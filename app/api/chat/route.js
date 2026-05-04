import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const MODELS = {
  'llama-3.1-70b': {
    id: 'meta/llama-3.1-70b-instruct',
    label: 'Llama 3.1 70B',
    badge: 'Fast',
  },
  'mistral-medium': {
    id: 'mistralai/mistral-large-2-instruct',
    label: 'Mistral Large',
    badge: 'Precise',
  },
  'deepseek': {
    id: 'deepseek-ai/deepseek-r1',
    label: 'DeepSeek R1',
    badge: 'Reasoning',
  },
};

export async function POST(req) {
  try {
    const { messages, documents, model = 'llama-3.1-70b' } = await req.json();

    // Support both single docText (legacy) and multi-doc array
    const docs = documents || [];

    // Build combined document context
    let docContext = '';
    if (docs.length === 1) {
      docContext = `DOCUMENT: ${docs[0].name}\n\n${docs[0].text.slice(0, 14000)}`;
    } else if (docs.length > 1) {
      docContext = docs.map((d, i) =>
        `--- DOCUMENT ${i + 1}: ${d.name} ---\n${d.text.slice(0, Math.floor(12000 / docs.length))}`
      ).join('\n\n');
    }

    const selectedModel = MODELS[model] || MODELS['llama-3.1-70b'];

    const systemPrompt = `You are an expert document analyst. The user has uploaded ${docs.length} document(s).
Answer questions accurately and concisely based ONLY on the document content provided.
Always cite which document you are drawing from when answering across multiple documents.
If the answer is not in the documents, say so clearly — never make up information.

${docContext}`;

    const completion = await client.chat.completions.create({
      model: selectedModel.id,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    return Response.json({ reply, model: selectedModel.label });
  } catch (err) {
    console.error(err);
    return Response.json({ reply: 'Error: ' + err.message }, { status: 500 });
  }
}