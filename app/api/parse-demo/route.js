export const runtime = 'nodejs';

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Re-implementation of parse logic that accepts a URL instead of a file upload
export async function POST(req) {
  try {
    const { fileUrl, fileName } = await req.json();
    if (!fileUrl || !fileName) {
      return Response.json({ text: '', error: 'Missing fileUrl or fileName' }, { status: 400 });
    }

    // Fetch the static file from the public folder
    const baseUrl = process.env.VERCEL_URL
      ? 'https://' + process.env.VERCEL_URL
      : 'http://localhost:3000';

    const fullUrl = fileUrl.startsWith('http') ? fileUrl : baseUrl + fileUrl;
    const res = await fetch(fullUrl);
    if (!res.ok) {
      return Response.json({ text: '', error: 'Failed to fetch file: ' + res.status }, { status: 500 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = fileName.split('.').pop().toLowerCase();
    let text = '';

    if (ext === 'pdf') {
      // Use pdf-parse-fork or extract text via Buffer
      // Simple PDF text extraction using regex on raw buffer
      const str = buffer.toString('latin1');
      const matches = str.match(/BT[\s\S]*?ET/g) || [];
      const textParts = [];
      for (const block of matches) {
        const tjs = block.match(/\(([^)]+)\)\s*Tj/g) || [];
        for (const tj of tjs) {
          const m = tj.match(/\(([^)]+)\)/);
          if (m) textParts.push(m[1]);
        }
      }
      if (textParts.length > 0) {
        text = textParts.join(' ');
      } else {
        // Fallback: try to extract readable ASCII text from PDF binary
        const readable = str.replace(/[^\x20-\x7e\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        // Extract meaningful chunks (words longer than 3 chars)
        const words = readable.split(' ').filter(w => w.length > 3 && /[a-zA-Z]/.test(w));
        text = words.join(' ');
      }
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === 'xlsx' || ext === 'csv') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheets = workbook.SheetNames.map(name => {
        const ws = workbook.Sheets[name];
        return 'Sheet: ' + name + '\n' + XLSX.utils.sheet_to_csv(ws);
      });
      text = sheets.join('\n\n');
    } else if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'rtf') {
      text = buffer.toString('utf-8');
    } else {
      text = buffer.toString('utf-8');
    }

    return Response.json({ text: text.trim(), filename: fileName, size: buffer.length });
  } catch (err) {
    console.error('parse-demo error:', err);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}
