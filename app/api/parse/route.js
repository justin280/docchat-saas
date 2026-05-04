export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return Response.json({ text: '', error: 'No file provided' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const name = file.name.toLowerCase();
    let text = '';

    // --- TXT ---
    if (name.endsWith('.txt')) {
      text = buffer.toString('utf-8');

    // --- MARKDOWN ---
    } else if (name.endsWith('.md') || name.endsWith('.markdown')) {
      // Strip markdown syntax for plain text extraction
      text = buffer.toString('utf-8')
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`(.+?)`/g, '$1')
        .replace(/^\s*[-*+]\s/gm, '')
        .replace(/^\s*>\s/gm, '');

    // --- HTML ---
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      const { parse } = await import('node-html-parser');
      const root = parse(buffer.toString('utf-8'));
      // Remove scripts and styles
      root.querySelectorAll('script, style').forEach(el => el.remove());
      text = root.structuredText || root.text || '';

    // --- RTF ---
    } else if (name.endsWith('.rtf')) {
      // Strip RTF control words and extract plain text
      const raw = buffer.toString('utf-8');
      text = raw
        .replace(/\\[a-z]+[-]?[0-9]* ?/g, ' ')
        .replace(/[{}]/g, '')
        .replace(/\\'/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // --- XLSX / XLS ---
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const lines = [];
      for (const sheetName of workbook.SheetNames) {
        lines.push(`=== Sheet: ${sheetName} ===`);
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        lines.push(csv);
      }
      text = lines.join('\n');

    // --- DOCX ---
    } else if (name.endsWith('.docx') || name.endsWith('.odt')) {
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (e) {
        // Fallback: extract readable strings
        const raw = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
        const readable = raw.match(/[\x20-\x7E]{5,}/g) || [];
        text = readable.filter(s => !s.startsWith('PK') && s.length > 4).join(' ');
        if (!text) text = 'Could not parse this file. Try re-saving from Word or Google Docs.';
      }

    // --- PDF ---
    } else if (name.endsWith('.pdf')) {
      try {
        const raw = buffer.toString('latin1');
        const btBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
        const lines = [];
        for (const block of btBlocks) {
          const tjMatches = block.match(/\(([^)]{1,500})\)\s*T[jJ]/g) || [];
          for (const m of tjMatches) {
            const clean = m.replace(/^\(/, '').replace(/\)\s*T[jJ]$/, '').trim();
            if (clean.length > 1) lines.push(clean);
          }
        }
        text = lines.join(' ').trim();
        if (!text) {
          // Fallback: grab readable strings
          const readable = raw.match(/[\x20-\x7E]{4,}/g) || [];
          text = readable.filter(s => !s.startsWith('%') && s.length > 3).join(' ').slice(0, 15000);
        }
        if (!text) text = 'This PDF appears to be image-based. Please convert to text-based PDF or TXT/DOCX.';
      } catch (e) {
        text = 'Error parsing PDF: ' + e.message;
      }

    // --- EPUB ---
    } else if (name.endsWith('.epub')) {
      // EPUB is a ZIP — extract text from HTML content files inside
      try {
        const raw = buffer.toString('utf-8', 0, Math.min(buffer.length, 100000));
        const htmlMatches = raw.match(/<[^>]+>([^<]{3,})<\/[^>]+>/g) || [];
        text = htmlMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').trim();
        if (!text) text = 'Could not extract text from this EPUB file.';
      } catch (e) {
        text = 'Error parsing EPUB: ' + e.message;
      }

    // --- Unknown: try as UTF-8 text ---
    } else {
      text = buffer.toString('utf-8');
    }

    return Response.json({ text: text.trim(), filename: file.name, size: buffer.length });
  } catch (err) {
    console.error('Parse error:', err);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}