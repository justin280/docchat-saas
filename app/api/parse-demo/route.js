export const runtime = 'nodejs';

// parse-demo: fetches a static file from /public and pipes it through /api/parse
// This reuses all existing document parsing logic (PDF, DOCX, XLSX, etc.)
export async function POST(req) {
  try {
    const { fileUrl, fileName } = await req.json();
    if (!fileUrl || !fileName) {
      return Response.json({ text: '', error: 'Missing fileUrl or fileName' }, { status: 400 });
    }

    // Build the absolute base URL for internal API calls
    const baseUrl = process.env.VERCEL_URL
      ? 'https://' + process.env.VERCEL_URL
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

    // Fetch the static sample file from the /public folder
    const fileRes = await fetch(baseUrl + fileUrl);
    if (!fileRes.ok) {
      return Response.json({ text: '', error: 'Could not load sample file: ' + fileRes.status }, { status: 500 });
    }

    const fileBlob = await fileRes.blob();

    // Forward to /api/parse as multipart/form-data — reuses all parsing logic
    const form = new FormData();
    form.append('file', fileBlob, fileName);

    const parseRes = await fetch(baseUrl + '/api/parse', {
      method: 'POST',
      body: form,
    });

    if (!parseRes.ok) {
      const err = await parseRes.json().catch(() => ({}));
      return Response.json({ text: '', error: err.error || 'Parse failed' }, { status: 500 });
    }

    const data = await parseRes.json();
    return Response.json({ text: data.text || '', filename: fileName, size: fileBlob.size });
  } catch (err) {
    console.error('parse-demo error:', err);
    return Response.json({ text: '', error: err.message }, { status: 500 });
  }
}
