export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return Response.json({ text: '' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const name = file.name.toLowerCase();
    let text = '';

    if (name.endsWith('.txt')) {
      // Plain text - direct read
      text = buffer.toString('utf-8');

    } else if (name.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (docxErr) {
        // If mammoth fails (corrupted/invalid DOCX), try reading any embedded text
        const raw = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
        // Extract readable ASCII strings of length > 4
        const readable = raw.match(/[\x20-\x7E]{5,}/g) || [];
        const extracted = readable
          .filter(s => !s.startsWith('PK') && !/^[\x00-\x1F]+$/.test(s))
          .join(' ');
        text = extracted.length > 50 ? extracted : 'Could not parse this DOCX. Please try re-saving it from Word or Google Docs.';
      }

    } else if (name.endsWith('.pdf')) {
      // Extract text from PDF BT/ET blocks (works for text-based PDFs)
      try {
        const raw = buffer.toString('latin1');
        const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
        const lines = [];
        for (const block of btBlocks) {
          // Match (text) Tj and [(text)] TJ patterns
          const tjMatches = block.match(/\(([^)]{1,500})\)\s*T[jJ]/g) || [];
          for (const m of tjMatches) {
            const clean = m.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '').trim();
            if (clean.length > 1) lines.push(clean);
          }
        }
        text = lines.join(' ').trim();
        if (!text) {
          // Fallback: extract any readable strings from the PDF
          const readable = raw.match(/[\x20-\x7E]{4,}/g) || [];
          text = readable
            .filter(s => !s.startsWith('%') && !s.includes('/') && s.length > 3)
            .join(' ')
            .slice(0, 10000);
        }
        if (!text) {
          text = 'This PDF appears to be image-based (scanned). Text extraction requires an OCR service. Please try a text-based PDF or convert to TXT/DOCX.';
        }
      } catch (pdfErr) {
        text = 'Error parsing PDF: ' + pdfErr.message;
      }

    } else {
      // Unknown file type - try reading as text anyway
      text = buffer.toString('utf-8');
    }

    return Response.json({ text: text.trim() });
  } catch (err) {
    console.error('Parse error:', err);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}