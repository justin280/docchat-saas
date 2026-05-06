export const runtime = 'nodejs';

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { readFile } from 'fs/promises';
import { join } from 'path';

function extractPdfText(buffer) {
  try {
    const raw = buffer.toString('latin1');
    const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
    const parts = [];
    for (const block of btBlocks) {
      const tjs = block.match(/\([^)]*\)\s*Tj/g) || [];
      for (const tj of tjs) {
        const m = tj.match(/\(([^)]*)\)/);
        if (m) parts.push(m[1]);
      }
      const arrMatches = block.match(/\[([^\]]*)\]\s*TJ/g) || [];
      for (const arr of arrMatches) {
        const strs = arr.match(/\(([^)]*)\)/g) || [];
        for (const s of strs) parts.push(s.slice(1, -1));
      }
    }
    if (parts.length > 20) return parts.join(' ');
    const words = raw.match(/[a-zA-Z0-9 ,.'":;!?\-]{5,}/g) || [];
    return words.slice(0, 2000).join(' ');
  } catch {
    return '';
  }
}

export async function POST(req) {
  try {
    const { fileUrl, fileName } = await req.json();
    if (!fileUrl || !fileName) {
      return Response.json({ text: '', error: 'Missing fileUrl or fileName' }, { status: 400 });
    }

    // Read file directly from filesystem (works on Vercel - public files are bundled)
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
    const filePath = join(process.cwd(), 'public', relativePath.replace(/^public\//, ''));

    let buffer;
    try {
      buffer = await readFile(filePath);
    } catch (fsErr) {
      return Response.json({ text: '', error: 'File not found: ' + filePath }, { status: 404 });
    }

    const ext = fileName.split('.').pop().toLowerCase();
    let text = '';

    if (ext === 'pdf') {
      text = extractPdfText(buffer);
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
    } else {
      text = buffer.toString('utf-8');
    }

    return Response.json({ text: text.trim(), filename: fileName, size: buffer.length });
  } catch (err) {
    console.error('parse-demo error:', err.message);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}
