import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function POST(req) {
  try {
    const { messages, docText } = await req.json();

    const systemPrompt = `You are a helpful document assistant. The user has uploaded a document. Answer questions about it accurately and concisely based ONLY on the document content below.

DOCUMENT CONTENT:
${docText.slice(0, 12000)}
`;

    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.1-70b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ reply: 'Error: ' + err.message }, { status: 500 });
  }
}