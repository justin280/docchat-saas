'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const DEMO_DOCS = [
  { url: '/docs/docchat-architecture-review-package.pdf', name: 'Architecture Review.pdf', label: 'Architecture Review' },
  { url: '/docs/docchat-enterprise-security-overview.pdf', name: 'Enterprise Security Overview.pdf', label: 'Enterprise Security Overview' },
];

const SUGGESTED_QUESTIONS = [
  'Summarise the key points of both documents',
  'What security features are described?',
  'What are the main technical components?',
  'What compliance standards are mentioned?',
  'Compare the two documents',
  'What are the recommended next steps?',
];

const MODELS = [
  { id: 'meta/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
  { id: 'meta/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
  { id: 'mistralai/mistral-large-latest', label: 'Mistral Large' },
  { id: 'deepseek-ai/deepseek-r1', label: 'DeepSeek R1' },
];

export default function DemoPage() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('Preparing demo documents...');
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-70b-instruct');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const replyRef = useRef('');

  useEffect(() => { loadDemoDocs(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function loadDemoDocs() {
    setLoadingDocs(true);
    setLoadProgress(0);
    setMessages([]);
    const loaded = [];
    for (let i = 0; i < DEMO_DOCS.length; i++) {
      const doc = DEMO_DOCS[i];
      setLoadStatus('Loading ' + doc.label + '...');
      try {
        const res = await fetch('/api/parse-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl: doc.url, fileName: doc.name }),
        });
        const data = await res.json();
        if (data.text) loaded.push({ name: doc.name, text: data.text, size: data.size || 0 });
      } catch (e) { console.error('Demo load error:', e); }
      setLoadProgress(Math.round(((i + 1) / DEMO_DOCS.length) * 100));
    }
    setDocs(loaded);
    setLoadingDocs(false);
    if (loaded.length > 0) {
      setMessages([{
        role: 'assistant',
        content: '👋 Welcome to the **DocChat AI demo**! I have loaded ' + loaded.length + ' sample document' + (loaded.length > 1 ? 's' : '') + ' for you:\n\n' + loaded.map(d => '📄 **' + d.name + '**').join('\n') + '\n\nFeel free to ask anything, or try a suggested question below.',
      }]);
    }
  }

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    setError('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);
    replyRef.current = '';

    // Add empty assistant placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, docs, model: selectedModel }),
      });
      if (!res.ok) throw new Error('Chat request failed: ' + res.status);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.token ?? parsed.choices?.[0]?.delta?.content ?? '';
            if (token) {
              replyRef.current += token;
              const snapshot = replyRef.current;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: snapshot };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui,sans-serif', display: 'flex', flexDirection: 'column' },
    banner: { backgroundColor: '#0f1f00', border: '1px solid #84cc16', borderRadius: '10px', padding: '10px 18px', margin: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '13px' },
    bannerLeft: { display: 'flex', alignItems: 'center', gap: '8px', color: '#84cc16', fontWeight: '600' },
    bannerRight: { display: 'flex', gap: '10px', alignItems: 'center' },
    uploadBtn: { backgroundColor: '#84cc16', color: '#000', borderRadius: '7px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' },
    resetBtn: { backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '860px', width: '100%', margin: '0 auto', padding: '16px 20px 100px' },
    loadBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '60px 20px' },
    progressBar: { width: '100%', maxWidth: '320px', height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#84cc16', borderRadius: '3px', transition: 'width 0.3s' },
    docChips: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
    docChip: { backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '5px' },
    messages: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#1a2a00', border: '1px solid #84cc16', borderRadius: '14px 14px 2px 14px', padding: '10px 16px', maxWidth: '75%', fontSize: '14px', lineHeight: '1.6' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#111', border: '1px solid #222', borderRadius: '14px 14px 14px 2px', padding: '12px 16px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.7', minWidth: '40px', minHeight: '24px' },
    suggestions: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' },
    suggBtn: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#9ca3af', cursor: 'pointer', whiteSpace: 'nowrap' },
    inputArea: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', borderTop: '1px solid #111', padding: '12px 20px', zIndex: 50 },
    inputRow: { display: 'flex', gap: '10px', alignItems: 'center', maxWidth: '860px', margin: '0 auto' },
    input: { flex: 1, backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px', padding: '11px 16px', color: '#fff', fontSize: '14px', outline: 'none' },
    sendBtn: { backgroundColor: '#84cc16', color: '#000', border: 'none', borderRadius: '10px', padding: '11px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' },
    modelSelect: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '8px 12px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' },
    errorBox: { backgroundColor: '#2a0000', border: '1px solid #dc2626', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171', marginBottom: '10px' },
    spinner: { display: 'inline-block', width: '8px', height: '16px', backgroundColor: '#84cc16', animation: 'blink 1s step-end infinite' },
  };

  return (
    <div style={s.page}>
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <span>🔬</span>
          <span>Demo Mode — Sample documents loaded. Data is temporary and resets on refresh.</span>
        </div>
        <div style={s.bannerRight}>
          <button style={s.resetBtn} onClick={loadDemoDocs}>↺ Reset Demo</button>
          <Link href="/" style={s.uploadBtn}>Upload Your Own Files →</Link>
        </div>
      </div>

      <div style={s.main}>
        {loadingDocs ? (
          <div style={s.loadBox}>
            <div style={{ fontSize: '40px' }}>📄</div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>Loading Demo Documents</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>{loadStatus}</div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: loadProgress + '%' }} />
            </div>
            <div style={{ fontSize: '12px', color: '#4b5563' }}>{loadProgress}%</div>
          </div>
        ) : (
          <>
            <div style={s.docChips}>
              {docs.map((d, i) => (
                <div key={i} style={s.docChip}>📄 {d.name}</div>
              ))}
            </div>

            <div style={s.messages}>
              {messages.map((m, i) => (
                <div key={i} style={m.role === 'user' ? s.userBubble : s.aiBubble}>
                  {m.role === 'assistant' ? (
                    m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span style={{ color: '#84cc16' }}>▋</span>
                  ) : m.content}
                </div>
              ))}
              {error && <div style={s.errorBox}>{error}</div>}
              <div ref={messagesEndRef} />
            </div>

            {messages.filter(m => m.role === 'user').length === 0 && (
              <div style={s.suggestions}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} style={s.suggBtn} onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!loadingDocs && (
        <div style={s.inputArea}>
          <div style={s.inputRow}>
            <select style={s.modelSelect} value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <input
              style={s.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask anything about the demo documents..."
              disabled={loading}
            />
            <button
              style={{ ...s.sendBtn, opacity: loading ? 0.6 : 1 }}
              onClick={() => sendMessage()}
              disabled={loading}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
