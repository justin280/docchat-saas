import OpenAI from 'openai';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// Model registry - maps UI id to NVIDIA NIM model string
const MODEL_MAP = {
  'llama-3.1-70b':    'meta/llama-3.1-70b-instruct',
  'llama-3.3-70b':    'meta/llama-3.3-70b-instruct',
  'llama-3.1-8b':     'meta/llama-3.1-8b-instruct',
  'mistral-large':    'mistralai/mistral-large-2-instruct',
  'mistral-nemo':     'mistralai/mistral-nemo-12b-instruct',
  'deepseek-r1':      'deepseek-ai/deepseek-r1',
  'deepseek-v3':      'deepseek-ai/deepseek-v3',
  'gemma-3-27b':      'google/gemma-3-27b-it',
  'phi-4':            'microsoft/phi-4',
  'qwen2.5-72b':      'qwen/qwen2.5-72b-instruct',
  'nemotron-70b':     'nvidia/llama-3.1-nemotron-70b-instruct',
};

// Context window limits (chars) per model — conservative to avoid 400 errors
const CONTEXT_LIMITS = {
  'llama-3.1-70b':  60000,
  'llama-3.3-70b':  60000,
  'llama-3.1-8b':   24000,
  'mistral-large':  60000,
  'mistral-nemo':   40000,
  'deepseek-r1':    40000,
  'deepseek-v3':    60000,
  'gemma-3-27b':    60000,
  'phi-4':          40000,
  'qwen2.5-72b':    60000,
  'nemotron-70b':   60000,
};

function buildContext(docs, modelId) {
  const limit = CONTEXT_LIMITS[modelId] || 50000;
  // Reserve ~2000 chars for system prompt and question
  const docBudget = limit - 2000;

  if (!docs || docs.length === 0) return '';

  const perDoc = Math.floor(docBudget / docs.length);
  let ctx = '';
  for (const doc of docs) {
    const text = doc.content || '';
    if (text.length <= perDoc) {
      ctx += '--- Document: ' + doc.name + ' ---\n' + text + '\n\n';
    } else {
      // Smart truncation: take first 60% + last 40% to capture intro and conclusion
      const head = Math.floor(perDoc * 0.6);
      const tail = perDoc - head;
      const truncated = text.slice(0, head) + '\n\n[... middle section truncated for context window ...]\n\n' + text.slice(-tail);
      ctx += '--- Document: ' + doc.name + ' (truncated to fit context window) ---\n' + truncated + '\n\n';
    }
  }
  return ctx;
}

export async function POST(req) {
  try {
    const { messages, docs, model: modelId = 'llama-3.1-70b' } = await req.json();

    if (!NVIDIA_API_KEY) {
      return Response.json({ error: 'NVIDIA_API_KEY not configured' }, { status: 500 });
    }

    const nimModel = MODEL_MAP[modelId] || MODEL_MAP['llama-3.1-70b'];
    const docContext = buildContext(docs, modelId);

    const systemPrompt = docContext
      ? 'You are a helpful document analysis assistant. The user has uploaded the following document(s). Answer questions accurately based on the content provided. If asked about something not in the documents, say so clearly.\n\nDOCUMENT CONTENT:\n' + docContext
      : 'You are a helpful AI assistant. Be concise and accurate.';

    const client = new OpenAI({
      apiKey: NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const completion = await client.chat.completions.create({
      model: nimModel,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1500,
      temperature: 0.6,
    });

    const reply = completion.choices?.[0]?.message?.content || 'No response generated.';
    const wasTruncated = docs && docs.some(d => (d.content || '').length > (CONTEXT_LIMITS[modelId] || 50000) / (docs.length || 1));

    return Response.json({ content: reply, model: nimModel, truncated: wasTruncated });

  } catch (err) {
    const status = err?.status || err?.response?.status || 500;
    const msg = err?.message || err?.error?.message || 'Unknown error';

    // Surface specific known errors
    if (status === 400) {
      return Response.json({ error: 'Document too large for this model. Try switching to a model with a larger context window, or upload a shorter document.' }, { status: 400 });
    }
    if (status === 401) {
      return Response.json({ error: 'API key invalid or expired. Please check your NVIDIA API key in Vercel environment variables.' }, { status: 401 });
    }
    if (status === 429) {
      return Response.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 });
    }
    if (status === 503 || status === 504) {
      return Response.json({ error: 'AI model is temporarily unavailable. Try switching to a different model.' }, { status: 503 });
    }

    return Response.json({ error: 'Error: ' + msg }, { status: 500 });
  }
}