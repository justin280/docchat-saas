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
      text = buffer.toString('utf-8');
    } else if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith('.pdf')) {
      // Extract readable text from PDF buffer using basic byte scanning
      // Works for most text-based PDFs without heavy dependencies
      const raw = buffer.toString('latin1');
      const textMatches = raw.match(/BT[\s\S]*?ET/g) || [];
      const extracted = textMatches.map(block => {
        const tjMatches = block.match(/\(([^)]+)\)\s*Tj/g) || [];
        return tjMatches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
      }).join('\n');
      text = extracted.trim() || 'PDF text extraction: Please convert to .txt for best results.';
    }

    return Response.json({ text: text.trim() });
  } catch (err) {
    console.error(err);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}