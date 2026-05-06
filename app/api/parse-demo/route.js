export const runtime = 'nodejs';

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

function extractPdfText(buffer) {
  try {
    const raw = buffer.toString('latin1');
    const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
    const parts = [];
    for (const block of btBlocks) {
      const tjs = block.match(/\(([^)\\]|\\[\s\S])*\)\s*Tj/g) || [];
      for (const tj of tjs) {
        const m = tj.match(/\(([^)\\]|\\[\s\S])*\)/);
        if (m) parts.push(m[0].slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, ' '));
      }
      // Also extract TJ arrays
      const arrMatches = block.match(/\[([^\]]*)\]\s*TJ/g) || [];
      for (const arr of arrMatches) {
        const strs = arr.match(/\(([^)\\]|\\[\s\S])*\)/g) || [];
        for (const s of strs) parts.push(s.slice(1,-1));
      }
    }
    if (parts.length > 20) return parts.join(' ');
    // Fallback: extract printable ASCII sequences of length > 4
    const words = raw.match(/[a-zA-Z0-9 ,.'":;!?\-]{5,}/g) || [];
    return words.join(' ');
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

    // Fetch the static sample file from the /public folder using a relative-style URL
    // On Vercel, VERCEL_URL is the deployment hostname (no protocol prefix)
    const host = process.env.VERCEL_URL || 'docchat-saas.vercel.app';
    const baseUrl = host.startsWith('http') ? host : 'https://' + host;
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : baseUrl + fileUrl;

    const fileRes = await fetch(fullUrl, { cache: 'no-store' });
    if (!fileRes.ok) {
      return Response.json({ text: '', error: 'Could not fetch: ' + fullUrl + ' (' + fileRes.status + ')' }, { status: 500 });
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
