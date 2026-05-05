import { NextResponse } from 'next/server';

const NVIDIA_API_BASE = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

const MODEL_MAP = {
  'llama-3.1-70b':  'meta/llama-3.1-70b-instruct',
  'llama-3.3-70b':  'meta/llama-3.3-70b-instruct',
  'llama-3.1-8b':   'meta/llama-3.1-8b-instruct',
  'mistral-large':  'mistralai/mistral-large',
  'mistral-nemo':   'mistralai/mistral-nemo-12b-instruct',
  'deepseek-r1':    'deepseek-ai/deepseek-r1',
  'deepseek-v3':    'deepseek-ai/deepseek-v3',
  'gemma-3-27b':    'google/gemma-3-27b-it',
  'phi-4':          'microsoft/phi-4',
  'qwen2.5-72b':    'qwen/qwen2.5-72b-instruct',
  'nemotron-70b':   'nvidia/llama-3.1-nemotron-70b-instruct',
};

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
  const docBudget = limit - 2000;
  if (!docs || docs.length === 0) return '';
  const perDoc = Math.floor(docBudget / docs.length);
  let ctx = '';
  for (const doc of docs) {
    const text = doc.text || '';
    if (text.length <= perDoc) {
      ctx += '--- Document: ' + doc.name + ' ---\n' + text + '\n\n';
    } else {
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
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const nvidiaModel = MODEL_MAP[modelId] || MODEL_MAP['llama-3.1-70b'];
    const context = buildContext(docs, modelId);

    const systemPrompt = context
      ? 'You are a helpful document analysis assistant. Use the following document content to answer questions accurately and thoroughly.\n\nDOCUMENT CONTENT:\n' + context
      : 'You are a helpful assistant.';

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const nvidiaRes = await fetch(NVIDIA_API_BASE + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NVIDIA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: nvidiaModel,
        messages: apiMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!nvidiaRes.ok) {
      const errText = await nvidiaRes.text();
      let errMsg = 'AI service error. Please try again.';
      if (nvidiaRes.status === 401) errMsg = 'Invalid API key. Please check configuration.';
      else if (nvidiaRes.status === 429) errMsg = 'Rate limit reached. Please wait a moment and try again.';
      else if (nvidiaRes.status === 400) errMsg = 'Request too large. Try a smaller document or different model.';
      else if (nvidiaRes.status === 503) errMsg = 'AI model temporarily unavailable. Please try a different model.';
      return NextResponse.json({ error: errMsg }, { status: nvidiaRes.status });
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = nvidiaRes.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              controller.close();
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  const token = parsed.choices?.[0]?.delta?.content;
                  if (token) {
                    controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ token }) + '\n\n'));
                  }
                } catch (e) {
                  // skip malformed lines
                }
              }
            }
          }
        } catch (e) {
          controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ error: 'Stream interrupted.' }) + '\n\n'));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
