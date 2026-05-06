'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

const NAV_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/healthcare', label: 'Healthcare' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/contact', label: 'Contact' },
  { slug: '/pricing', label: 'Pricing' },
  { slug: '/security', label: 'Security' },
];

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
  { id: 'meta/llama-3.1-8b-instruct', label: 'Llama 3.1 8B' },
  { id: 'mistralai/mistral-7b-instruct-v0.3', label: 'Mistral 7B' },
  { id: 'microsoft/phi-3-medium-128k-instruct', label: 'Phi-3 Medium' },
  { id: 'deepseek-ai/deepseek-r1', label: 'DeepSeek R1' },
];

export default function DemoPage() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const replyRef = useRef('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadDemoDocs();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadDemoDocs() {
    setLoading(true);
    setProgress(0);
    const loaded = [];
    for (let i = 0; i < DEMO_DOCS.length; i++) {
      const doc = DEMO_DOCS[i];
      setProgressLabel('Loading ' + doc.label + '...');
      setProgress(Math.round((i / DEMO_DOCS.length) * 100));
      try {
        const res = await fetch('/api/parse-demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileUrl: doc.url, fileName: doc.name }) });
        const data = await res.json();
        if (data.text) loaded.push({ name: doc.name, text: data.text, size: data.size || 0 });
      } catch (e) {}
    }
    setProgress(100);
    setDocs(loaded);
    setLoading(false);
    if (loaded.length > 0) {
      setMessages([{
        role: 'assistant',
        content: '👋 Welcome to the **DocChat AI demo**! I have loaded ' + loaded.length + ' sample documents for you:\n' +
          loaded.map(d => '📄 **' + d.name + '**').join('  ') + '\n\nFeel free to ask anything, or try a suggested question below.',
      }]);
    }
  }

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || streaming) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages([...newMessages, { role: 'assistant', content: '▋' }]);
    setStreaming(true);
    replyRef.current = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, docs, model }),
      });
      if (!res.ok) throw new Error('API error ' + res.status);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const parsed = JSON.parse(raw);
            const token = parsed.token ?? parsed.choices?.[0]?.delta?.content ?? '';
            if (!token) continue;
            replyRef.current += token;
            const snapshot = replyRef.current;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: snapshot + '▋' };
              return updated;
            });
          } catch {}
        }
      }
      const final = replyRef.current;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: final || 'Sorry, no response received.' };
        return updated;
      });
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Error: ' + e.message };
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleReset() {
    setDocs([]);
    setMessages([]);
    setProgress(0);
    loadDemoDocs();
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        {/* NavBar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 20px', borderBottom: '1px solid #111', backgroundColor: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
            <Image src="/logo.png" alt="DocChat AI Logo" width={36} height={36} style={{ borderRadius: '6px' }} priority />
            <span style={{ fontWeight: '700', color: '#84cc16', fontSize: '16px', whiteSpace: 'nowrap' }}>DocChat <span style={{ color: '#fff' }}>AI</span></span>
          </Link>
          {NAV_PAGES.map(p => (
            <Link key={p.slug} href={p.slug} style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>{p.label}</Link>
          ))}
          <Link href="/" style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>&#8962; Home</Link>
          <Link href="/" style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}>Try Free</Link>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 57px)', gap: '24px' }}>
          <div style={{ fontSize: '48px' }}>📄</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>Loading Demo Documents</h2>
          <p style={{ color: '#9ca3af', margin: 0 }}>{progressLabel}</p>
          <div style={{ width: '360px', height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: progress + '%', height: '100%', backgroundColor: '#84cc16', transition: 'width 0.3s ease', borderRadius: '3px' }} />
          </div>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>{progress}%</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* NavBar */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 20px', borderBottom: '1px solid #111', backgroundColor: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
          <Image src="/logo.png" alt="DocChat AI Logo" width={36} height={36} style={{ borderRadius: '6px' }} priority />
          <span style={{ fontWeight: '700', color: '#84cc16', fontSize: '16px', whiteSpace: 'nowrap' }}>DocChat <span style={{ color: '#fff' }}>AI</span></span>
        </Link>
        {NAV_PAGES.map(p => (
          <Link key={p.slug} href={p.slug} style={{ color: '/demo' === p.slug ? '#84cc16' : '#9ca3af', fontSize: '13px', textDecoration: 'none', fontWeight: '/demo' === p.slug ? '600' : '400' }}>{p.label}</Link>
        ))}
        <Link href="/" style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>&#8962; Home</Link>
        <Link href="/" style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}>Try Free</Link>
      </nav>

      {/* Demo banner */}
      <div style={{ backgroundColor: '#14532d', borderBottom: '1px solid #16a34a', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ color: '#86efac', fontSize: '13px' }}>🧪 <strong>Demo Mode</strong> — Sample documents are pre-loaded. Data is temporary and resets on refresh. <strong>No sign-up required.</strong></span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleReset} style={{ backgroundColor: 'transparent', color: '#86efac', border: '1px solid #16a34a', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>↺ Reset Demo</button>
          <Link href="/" style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '6px', padding: '5px 14px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>Upload Your Own Files →</Link>
        </div>
      </div>

      {/* Main layout: sidebar + chat */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 57px - 41px)' }}>

        {/* Sidebar */}
        <aside style={{ width: '260px', minWidth: '220px', borderRight: '1px solid #111', backgroundColor: '#0d0d0d', display: 'flex', flexDirection: 'column', padding: '16px', gap: '20px', overflowY: 'auto' }}>
          {/* AI Model */}
          <div>
            <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>AI Model</p>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              style={{ width: '100%', backgroundColor: '#1a1a1a', color: '#e5e7eb', border: '1px solid #333', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Documents */}
          <div>
            <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>Documents ({docs.length})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {docs.map((d, i) => (
                <div key={i} style={{ backgroundColor: '#1a1a1a', border: '1px solid #222', borderRadius: '8px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📄</span>
                  <span style={{ fontSize: '12px', color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free tier CTA */}
          <div style={{ marginTop: 'auto', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <p style={{ color: '#84cc16', fontWeight: '700', fontSize: '13px', margin: '0 0 4px 0' }}>🆓 Free Forever Plan</p>
            <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 10px 0' }}>No credit card · No email · No sign-up</p>
            <Link href="/" style={{ display: 'block', backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>Get Started Free →</Link>
          </div>
        </aside>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length === 0 && !streaming && (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '60px' }}>
                <p>Documents loaded. Ask a question below.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  backgroundColor: msg.role === 'user' ? '#84cc16' : '#1a1a1a',
                  color: msg.role === 'user' ? '#000' : '#e5e7eb',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  border: msg.role === 'assistant' ? '1px solid #222' : 'none',
                }}>
                  {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && !streaming && (
            <div style={{ padding: '0 20px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={streaming}
                  style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #111', display: 'flex', gap: '10px', backgroundColor: '#0d0d0d' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about the demo documents..."
              disabled={streaming}
              style={{ flex: 1, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={streaming || !input.trim()}
              style={{ backgroundColor: streaming ? '#333' : '#84cc16', color: streaming ? '#666' : '#000', borderRadius: '10px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: streaming ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
            >
              {streaming ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
