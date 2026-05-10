'use client'; // v5
import { useState, useRef, useEffect, useCallback } from 'react';
import StickyBar from '@/app/components/StickyBar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUICK_PROMPTS = [
  { icon: '📝', label: 'Summarise' },
  { icon: '🎯', label: 'Key Points' },
  { icon: '✅', label: 'Action Items' },
  { icon: '📅', label: 'Key Dates' },
  { icon: '⚠️', label: 'Risks' },
];

const NAV_PAGES = [
  { slug: '/', label: 'Home' },
  { slug: '/contact', label: 'Contact' },
];

const FEATURES = [
  { icon: '📁', title: 'Chat With Multiple PDFs', desc: 'Upload up to 5 documents simultaneously and ask questions across all of them at once.' },
  { icon: '🤖', title: '11 AI Models', desc: 'Choose from 11 AI models: Llama 3.3, DeepSeek V3, Gemma 3, Phi-4, Qwen 2.5, Nemotron and more.' },
  { icon: '⚡', title: 'Quick Prompts', desc: 'One-click: Summarise, Key Points, Action Items, Risks, Dates.' },
  { icon: '📊', title: 'AI Excel Analyzer', desc: 'Deep spreadsheet and CSV analysis with multi-sheet support.' },
  { icon: '⬇️', title: 'Export Chat', desc: 'Download your entire conversation as a .txt file.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Documents are never stored. Advanced RAG architecture ensures accurate, grounded answers.' },
  { icon: '💬', title: 'Follow-Up Prompts', desc: 'AI suggests intelligent follow-up questions based on your document context.' },
  { icon: '🔄', title: 'Document Comparison', desc: 'Compare two contracts or reports side-by-side to spot differences instantly.' },
  { icon: '🔍', title: 'Auto-Summarize', desc: 'Toggle auto-summarize on upload to get an instant overview before you start chatting.' },
];

const STORAGE_KEY = 'docchat-session-v1';
// Rough token estimate: ~4 chars per token for English text.
const estimateTokens = (text) => Math.ceil((text || '').length / 4);
// Rough page estimate: ~1800 chars per A4 page.
const estimatePages = (text) => Math.max(1, Math.round((text || '').length / 1800));
// Soft warning threshold (sum of all loaded docs)
const TOKEN_WARN_LIMIT = 60000;

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('landing');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-70b');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showScrollPill, setShowScrollPill] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const fileInputRef = useRef(null);
  const abortRef = useRef(null);
  const msgAreaRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const models = [
    { id: 'llama-3.1-70b',  label: 'Llama 3.1 70B',    badge: 'Popular' },
    { id: 'llama-3.3-70b',  label: 'Llama 3.3 70B',    badge: 'New' },
    { id: 'llama-3.1-8b',   label: 'Llama 3.1 8B',     badge: 'Fast' },
    { id: 'mistral-large',  label: 'Mistral Large',     badge: null },
    { id: 'mistral-nemo',   label: 'Mistral NeMo 12B',  badge: 'Fast' },
    { id: 'deepseek-r1',    label: 'DeepSeek R1',       badge: null },
    { id: 'deepseek-v3',    label: 'DeepSeek V3',       badge: 'New' },
    { id: 'gemma-3-27b',    label: 'Gemma 3 27B',       badge: 'New' },
    { id: 'phi-4',          label: 'Phi-4',             badge: 'New' },
    { id: 'qwen2.5-72b',    label: 'Qwen 2.5 72B',      badge: 'New' },
    { id: 'nemotron-70b',   label: 'Nemotron 70B',      badge: null },
  ];

  // Hydrate session from localStorage once on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.docs)) setDocs(saved.docs);
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (typeof saved.selectedModel === 'string') setSelectedModel(saved.selectedModel);
        if (saved.view === 'chat' && (saved.docs?.length || saved.messages?.length)) setView('chat');
      }
    } catch (e) {}
    setHydrated(true);
  }, []);

  // Persist session
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ docs, messages, selectedModel, view }));
    } catch (e) {}
  }, [docs, messages, selectedModel, view, hydrated]);

  // Auto-scroll on new messages, but only if user is already near the bottom
  useEffect(() => {
    const el = msgAreaRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  function handleScroll() {
    const el = msgAreaRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.clientHeight - el.scrollTop;
    const atBottom = distance < 80;
    stickToBottomRef.current = atBottom;
    setShowScrollPill(!atBottom && messages.length > 0);
  }

  function scrollToBottom() {
    const el = msgAreaRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    stickToBottomRef.current = true;
    setShowScrollPill(false);
  }

  async function uploadFiles(files) {
    if (!files || files.length === 0) return;
    setUploadError('');
    setUploading(true);
    setView('chat');
    let added = 0;
    for (const file of files) {
      if (docs.length + added >= 5) {
        setUploadError('Maximum 5 documents reached.');
        break;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/parse', { method: 'POST', body: formData });
        if (!res.ok) {
          const errText = await res.text();
          setUploadError('Failed to parse ' + file.name + ': ' + (errText || res.status));
          continue;
        }
        const data = await res.json();
        if (data.text && data.text.trim().length > 0) {
          setDocs(prev => [...prev, { name: file.name, text: data.text, size: file.size }]);
          setViewerOpen(true);
          added++;
        } else if (data.error) {
          setUploadError('Error reading ' + file.name + ': ' + data.error);
        } else {
          setUploadError('Could not extract text from ' + file.name + '. Please check the file is not password-protected.');
        }
      } catch (err) {
        setUploadError('Upload failed for ' + file.name + ': ' + err.message + '. Please check your connection and try again.');
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  }

  // Drag and drop handlers (work on both hero zone and chat surface)
  const onDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const onDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) uploadFiles(files);
  }, [docs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  async function sendMessage(text) {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    stickToBottomRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], docs, model: selectedModel }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, { role: 'assistant', content: errData.error || 'Error getting response. Please try again.' }]);
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                assistantContent = parsed.error;
                setMessages(prev => { const msgs = [...prev]; msgs[msgs.length - 1] = { role: 'assistant', content: assistantContent }; return msgs; });
                break;
              }
              if (parsed.token) {
                assistantContent += parsed.token;
                setMessages(prev => { const msgs = [...prev]; msgs[msgs.length - 1] = { role: 'assistant', content: assistantContent }; return msgs; });
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => {
          const msgs = [...prev];
          const last = msgs[msgs.length - 1];
          if (last && last.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content: (last.content || '') + '\n\n_⏹ Stopped by user._' };
          }
          return msgs;
        });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your connection and try again.' }]);
      }
    }
    abortRef.current = null;
    setLoading(false);
  }

  function stopGenerating() {
    if (abortRef.current) abortRef.current.abort();
  }

  function exportChat() {
    const text = messages.map(m => (m.role === 'user' ? 'You: ' : 'AI: ') + m.content).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'docchat-export.txt'; a.click();
  }

  function clearSession() {
    if (!window.confirm('Clear all loaded documents and chat history?')) return;
    setDocs([]); setMessages([]); setUploadError(''); setView('landing');
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  async function copyMessage(content, idx) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch (e) {}
  }

  const totalTokens = docs.reduce((sum, d) => sum + estimateTokens(d.text), 0);
  const overLimit = totalTokens > TOKEN_WARN_LIMIT;

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui,sans-serif', paddingBottom: '60px' },
    hero: { textAlign: 'center', padding: '60px 20px 40px' },
    h1: { fontSize: 'clamp(28px,5vw,52px)', fontWeight: '700', margin: '0 0 16px', lineHeight: 1.2 },
    h1green: { color: '#84cc16' },
    subtitle: { fontSize: 'clamp(14px,2vw,18px)', color: '#9ca3af', marginBottom: '24px', maxWidth: '700px', margin: '0 auto 24px' },
    ctaBtn: { backgroundColor: '#84cc16', color: '#000', border: 'none', borderRadius: '8px', padding: '16px 36px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'inline-block' },
    section: { maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' },
    h2: { fontSize: 'clamp(22px,3vw,36px)', fontWeight: '700', textAlign: 'center', marginBottom: '12px' },
    h2sub: { color: '#9ca3af', textAlign: 'center', marginBottom: '40px', fontSize: '16px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' },
    card: { backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px' },
    cardIcon: { fontSize: '32px', marginBottom: '12px' },
    cardTitle: { fontWeight: '700', marginBottom: '8px', fontSize: '16px' },
    cardDesc: { color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' },
    chatWrap: { display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', position: 'relative', overflow: 'hidden' },
    sidebar: { width: '260px', minWidth: '200px', backgroundColor: '#111', borderRight: '1px solid #222', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' },
    mainChat: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    rightPanel: { width: '320px', minWidth: '240px', borderLeft: '1px solid #1a1a1a', backgroundColor: '#0d0d0d', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
    chatHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #222', backgroundColor: '#111', flexShrink: 0, gap: '8px' },
    msgArea: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#84cc16', color: '#000', borderRadius: '12px', padding: '10px 14px', maxWidth: '80%', fontSize: '14px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
    aiBubbleWrap: { alignSelf: 'flex-start', maxWidth: '92%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' },
    aiBubble: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', lineHeight: '1.6', wordBreak: 'break-word' },
    bubbleActions: { display: 'flex', gap: '6px', paddingLeft: '4px' },
    iconBtn: { background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' },
    inputRow: { display: 'flex', gap: '8px', padding: '12px 16px', borderTop: '1px solid #222', backgroundColor: '#111', flexShrink: 0 },
    inputBox: { flex: 1, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', minWidth: 0 },
    sendBtn: { backgroundColor: '#84cc16', border: 'none', borderRadius: '8px', padding: '10px 18px', color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '14px', flexShrink: 0 },
    stopBtn: { backgroundColor: '#1a1a1a', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 18px', color: '#ef4444', fontWeight: '700', cursor: 'pointer', fontSize: '14px', flexShrink: 0 },
    quickRow: { display: 'flex', gap: '6px', padding: '8px 16px', flexWrap: 'wrap', backgroundColor: '#0f0f0f', flexShrink: 0 },
    quickBtn: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '4px 12px', color: '#d1d5db', fontSize: '12px', cursor: 'pointer' },
    modelBtn: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', padding: '4px 10px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', marginBottom: '4px' },
    modelBtnActive: { backgroundColor: '#0f1f00', border: '1px solid #84cc16', borderRadius: '6px', padding: '4px 10px', color: '#84cc16', fontSize: '12px', cursor: 'pointer', marginBottom: '4px' },
    docCard: { backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '10px 12px', fontSize: '12px' },
    uploadLabel: { backgroundColor: '#84cc16', border: 'none', borderRadius: '8px', padding: '10px', color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '13px', textAlign: 'center', display: 'block' },
    uploadLabelDisabled: { backgroundColor: '#4b5563', border: 'none', borderRadius: '8px', padding: '10px', color: '#9ca3af', fontSize: '13px', textAlign: 'center', display: 'block', cursor: 'not-allowed' },
    backBtn: { backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '6px', padding: '6px 12px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' },
    errorBox: { backgroundColor: '#1f0a0a', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#ef4444' },
    warnBox: { backgroundColor: '#1f1a0a', border: '1px solid #d97706', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#fbbf24' },
    dropOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(132,204,22,0.12)', border: '3px dashed #84cc16', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
    dropOverlayInner: { backgroundColor: '#0a0a0a', border: '1px solid #84cc16', borderRadius: '12px', padding: '24px 36px', color: '#84cc16', fontWeight: '700', fontSize: '18px' },
    scrollPill: { position: 'absolute', right: '16px', bottom: '12px', backgroundColor: '#84cc16', color: '#000', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', zIndex: 5 },
  };

  // Markdown components: tighten spacing inside chat bubbles
  const md = {
    p: ({node, ...p}) => <p style={{margin: '0 0 8px'}} {...p} />,
    ul: ({node, ...p}) => <ul style={{margin: '0 0 8px', paddingLeft: '20px'}} {...p} />,
    ol: ({node, ...p}) => <ol style={{margin: '0 0 8px', paddingLeft: '20px'}} {...p} />,
    li: ({node, ...p}) => <li style={{marginBottom: '2px'}} {...p} />,
    h1: ({node, ...p}) => <h3 style={{margin: '8px 0 6px', fontSize: '16px'}} {...p} />,
    h2: ({node, ...p}) => <h4 style={{margin: '8px 0 6px', fontSize: '15px'}} {...p} />,
    h3: ({node, ...p}) => <h5 style={{margin: '8px 0 6px', fontSize: '14px'}} {...p} />,
    code: ({inline, ...p}) => inline
      ? <code style={{backgroundColor: '#0a0a0a', padding: '1px 5px', borderRadius: '4px', fontSize: '12px'}} {...p} />
      : <code style={{display: 'block', backgroundColor: '#0a0a0a', padding: '10px', borderRadius: '6px', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre'}} {...p} />,
    pre: ({node, ...p}) => <pre style={{margin: '0 0 8px', overflowX: 'auto'}} {...p} />,
    table: ({node, ...p}) => <div style={{overflowX: 'auto', margin: '0 0 8px'}}><table style={{borderCollapse: 'collapse', fontSize: '12px'}} {...p} /></div>,
    th: ({node, ...p}) => <th style={{border: '1px solid #333', padding: '4px 8px', backgroundColor: '#0a0a0a', textAlign: 'left'}} {...p} />,
    td: ({node, ...p}) => <td style={{border: '1px solid #222', padding: '4px 8px'}} {...p} />,
    a: ({node, ...p}) => <a style={{color: '#84cc16'}} target="_blank" rel="noreferrer noopener" {...p} />,
  };

  if (view === 'chat') {
    return (
      <main style={s.chatWrap} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <aside style={s.sidebar}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'}}>
            <span style={{fontWeight: '700', fontSize: '14px', color: '#84cc16', flexShrink: 0}}>DocChat AI</span>
            <button data-testid="back-home-btn" style={s.backBtn} onClick={() => setView('landing')}>Home</button>
          </div>

          {docs.length < 5 ? (
            <label data-testid="add-document-label" style={uploading ? s.uploadLabelDisabled : s.uploadLabel}>
              {uploading ? 'Uploading...' : '+ Add Document'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.xlsx,.csv,.md,.html,.rtf,.epub,.odt"
                multiple
                disabled={uploading}
                style={{display: 'none'}}
                onChange={handleUpload}
                data-testid="add-document-input"
              />
            </label>
          ) : (
            <div style={{backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#6b7280', textAlign: 'center'}}>Max 5 documents loaded</div>
          )}

          <div style={{fontSize: '11px', color: '#6b7280', textAlign: 'center', marginTop: '-4px'}}>or drop files anywhere</div>

          {uploadError && (
            <div style={s.errorBox} data-testid="upload-error">
              <strong>Upload error:</strong> {uploadError}
              <button onClick={() => setUploadError('')} style={{display: 'block', marginTop: '6px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', padding: 0, textDecoration: 'underline'}}>Dismiss</button>
            </div>
          )}

          {docs.length > 0 && (
            <div style={{fontSize: '11px', color: overLimit ? '#fbbf24' : '#6b7280', textAlign: 'center'}}>
              ~{totalTokens.toLocaleString()} tokens loaded
            </div>
          )}
          {overLimit && (
            <div style={s.warnBox}>⚠ Large context — answers may be slower or truncated. Consider removing a document.</div>
          )}

          {docs.map((doc, i) => (
            <div key={i} style={s.docCard} data-testid={`doc-card-${i}`}>
              <div style={{fontWeight: '600', marginBottom: '4px', wordBreak: 'break-all', fontSize: '12px'}}>{doc.name}</div>
              <div style={{color: '#6b7280', fontSize: '11px'}}>
                {(doc.size / 1024).toFixed(0)}KB · ~{estimatePages(doc.text)} page{estimatePages(doc.text) !== 1 ? 's' : ''} · ~{estimateTokens(doc.text).toLocaleString()} tokens
              </div>
              <button onClick={() => setDocs(d => d.filter((_, j) => j !== i))} style={{marginTop: '6px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', padding: 0}} data-testid={`doc-remove-${i}`}>Remove</button>
            </div>
          ))}

          <div style={{marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '12px'}}>
            <button onClick={clearSession} style={{...s.backBtn, width: '100%', marginBottom: '12px', borderColor: '#444', color: '#9ca3af'}} data-testid="clear-session-btn">Clear session</button>
            <div style={{fontSize: '11px', color: '#6b7280', marginBottom: '8px', letterSpacing: '1px'}}>AI MODEL</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              {models.map(m => (
                <button key={m.id} style={selectedModel === m.id ? s.modelBtnActive : s.modelBtn} onClick={() => setSelectedModel(m.id)} data-testid={`model-${m.id}`}>{m.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div style={s.mainChat}>
          <div style={s.chatHeader}>
            <span style={{fontWeight: '600', fontSize: '14px', color: '#9ca3af'}}>
              {docs.length === 0 ? 'No documents loaded — add one to start' : docs.length + ' document' + (docs.length !== 1 ? 's' : '') + ' loaded'}
            </span>
            <button style={s.backBtn} onClick={exportChat} data-testid="export-chat-btn">Export Chat</button>
          </div>

          <div style={s.quickRow}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} style={s.quickBtn} onClick={() => sendMessage(p.label + ' this document')} disabled={docs.length === 0} data-testid={`quick-prompt-${i}`}>{p.icon} {p.label}</button>
            ))}
          </div>

          <div style={s.msgArea} ref={msgAreaRef} onScroll={handleScroll} data-testid="msg-area">
            {messages.length === 0 && (
              <div style={{textAlign: 'center', color: '#4b5563', marginTop: '60px', padding: '0 20px'}}>
                <div style={{fontSize: '40px', marginBottom: '12px'}}>💬</div>
                {docs.length === 0
                  ? <div>Add a document or drop one here to get started</div>
                  : <div>Your document is ready — ask a question below</div>
                }
              </div>
            )}
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} style={s.userBubble} data-testid={`msg-user-${i}`}>{m.content}</div>
              ) : (
                <div key={i} style={s.aiBubbleWrap} data-testid={`msg-ai-${i}`}>
                  <div style={s.aiBubble}>
                    {m.content
                      ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{m.content}</ReactMarkdown>
                      : <span style={{color: '#6b7280'}}>...</span>}
                  </div>
                  {m.content && (
                    <div style={s.bubbleActions}>
                      <button style={s.iconBtn} onClick={() => copyMessage(m.content, i)} data-testid={`copy-msg-${i}`}>
                        {copiedIdx === i ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                  )}
                </div>
              )
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div style={s.aiBubbleWrap}><div style={s.aiBubble}><span style={{color: '#6b7280'}}>Thinking...</span></div></div>
            )}
            {showScrollPill && (
              <button style={s.scrollPill} onClick={scrollToBottom} data-testid="scroll-bottom-pill">↓ New messages</button>
            )}
          </div>

          <div style={s.inputRow}>
            <input
              style={s.inputBox}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={docs.length === 0 ? 'Upload a document first...' : 'Ask a question about your document...'}
              disabled={docs.length === 0 && messages.length === 0}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && sendMessage()}
              data-testid="chat-input"
            />
            {loading ? (
              <button style={s.stopBtn} onClick={stopGenerating} data-testid="stop-generation-btn">⏹ Stop</button>
            ) : (
              <button style={{...s.sendBtn, opacity: docs.length === 0 && messages.length === 0 ? 0.5 : 1}} onClick={() => sendMessage()} disabled={docs.length === 0 && messages.length === 0} data-testid="send-message-btn">Send</button>
            )}
          </div>
        </div>

        {/* Right panel: Document viewer */}
        {viewerOpen && docs.length > 0 && (
          <aside style={s.rightPanel}>
            <div style={{padding: '8px 10px', borderBottom: '1px solid #1a1a1a', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0}}>
              <div style={{display: 'flex', gap: '4px', flex: 1, minWidth: 0, overflowX: 'auto'}}>
                {docs.map((d, i) => (
                  <button key={i} onClick={() => setActiveDocIdx(i)} style={{padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', backgroundColor: activeDocIdx === i ? '#84cc16' : '#222', color: activeDocIdx === i ? '#000' : '#aaa', fontWeight: activeDocIdx === i ? '700' : '400'}}>
                    {d.name.length > 18 ? d.name.slice(0, 16) + '...' : d.name}
                  </button>
                ))}
              </div>
              <div style={{display: 'flex', gap: '6px', marginLeft: '8px'}}>
                <button onClick={() => setDocModalOpen(true)} title="Enlarge" style={{background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', lineHeight: 1}}>⤢</button>
                <button onClick={() => setViewerOpen(false)} title="Close" style={{background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', lineHeight: 1}}>✕</button>
              </div>
            </div>
            <div style={{flex: 1, overflowY: 'auto', padding: '16px', fontFamily: 'Georgia,serif', fontSize: '13px', lineHeight: '1.7', color: '#d1d5db', whiteSpace: 'pre-wrap'}}>
              {docs[activeDocIdx] ? docs[activeDocIdx].text : ''}
            </div>
          </aside>
        )}
        {docs.length > 0 && !viewerOpen && (
          <button onClick={() => setViewerOpen(true)} style={{position: 'absolute', right: '12px', bottom: '70px', background: '#111', border: '1px solid #333', color: '#84cc16', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', zIndex: 10}}>📄 Docs</button>
        )}
        {docModalOpen && docs[activeDocIdx] && (
          <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column'}} onClick={() => setDocModalOpen(false)}>
            <div style={{backgroundColor: '#0d0d0d', margin: '24px auto', width: '90%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}} onClick={e => e.stopPropagation()}>
              <div style={{padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', flexShrink: 0}}>
                <span style={{fontWeight: '700', color: '#fff', fontSize: '14px'}}>{docs[activeDocIdx].name}</span>
                <button onClick={() => setDocModalOpen(false)} style={{background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '20px', lineHeight: 1}}>✕</button>
              </div>
              <div style={{flex: 1, overflowY: 'auto', padding: '24px', fontFamily: 'Georgia,serif', fontSize: '14px', lineHeight: '1.8', color: '#d1d5db', whiteSpace: 'pre-wrap'}}>
                {docs[activeDocIdx].text}
              </div>
            </div>
          </div>
        )}
        {dragActive && (
          <div style={s.dropOverlay}><div style={s.dropOverlayInner}>📥  Drop your file to upload</div></div>
        )}
      </main>
    );
  }

  return (
    <main style={s.page} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <nav style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid #111', backgroundColor: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap'}}>
        <span style={{fontWeight: '700', color: '#84cc16', marginRight: 'auto', fontSize: '16px'}}>DocChat AI</span>
        {NAV_PAGES.map(p => (
          <a key={p.slug} href={p.slug} style={{color: '#9ca3af', fontSize: '13px', textDecoration: 'none'}}>{p.label}</a>
        ))}
        {(docs.length > 0 || messages.length > 0) && (
          <button onClick={() => setView('chat')} style={{...s.ctaBtn, padding: '6px 14px', fontSize: '12px'}} data-testid="resume-session-btn">Resume session</button>
        )}
      </nav>

      <section style={{...s.hero, padding: '80px 20px 40px'}}>
        <h1 style={s.h1}>Chat with any <span style={s.h1green}>PDF or document</span> instantly</h1>
        <p style={s.subtitle}>Upload your file and start asking questions. No sign-up required.</p>

        <div style={{maxWidth: '560px', margin: '32px auto 0', padding: '0 20px'}}>
          <label
            style={{
              display: 'block',
              padding: '36px 18px',
              borderRadius: '12px',
              border: dragActive ? '2px dashed #84cc16' : '2px dashed #333',
              backgroundColor: dragActive ? 'rgba(132,204,22,0.08)' : '#0f0f0f',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1,
              transition: 'background-color 120ms, border-color 120ms',
            }}
            data-testid="hero-upload-zone"
          >
            <div style={{fontSize: '40px', marginBottom: '8px'}}>📄</div>
            <div style={{fontWeight: '700', fontSize: '15px', color: '#fff', marginBottom: '4px'}}>
              {uploading ? 'Uploading...' : (dragActive ? 'Drop to upload' : 'Drop a file here, or click to upload')}
            </div>
            <div style={{color: '#6b7280', fontSize: '12px'}}>up to 5 documents · max 50&nbsp;MB each</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.xlsx,.csv,.md,.html,.rtf,.epub,.odt"
              multiple
              disabled={uploading}
              style={{display: 'none'}}
              onChange={handleUpload}
            />
          </label>
          <p style={{color: '#6b7280', fontSize: '12px', marginTop: '12px', textAlign: 'center'}}>
            PDF · DOCX · TXT · XLSX · CSV · MD · HTML · RTF · EPUB · ODT
          </p>
          {uploadError && (
            <div style={{...s.errorBox, marginTop: '16px'}} data-testid="hero-upload-error">
              <strong>Upload error:</strong> {uploadError}
            </div>
          )}
        </div>
      </section>

      <section style={{...s.section, paddingTop: '40px'}}>
        <h2 style={s.h2}>Everything you need to work smarter with documents</h2>
        <p style={s.h2sub}>Advanced RAG architecture · Follow-up prompts · Document comparison · Auto-summarize</p>
        <div style={s.grid3}>
          {FEATURES.map((f, i) => (
            <div key={i} style={s.card}>
              <div style={s.cardIcon}>{f.icon}</div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop: '1px solid #111', padding: '24px 20px', paddingBottom: '120px', textAlign: 'center'}}>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px'}}>
          {NAV_PAGES.map(p => (
            <a key={p.slug} href={p.slug} style={{color: '#6b7280', fontSize: '12px', textDecoration: 'none'}}>{p.label}</a>
          ))}
        </div>
        <p style={{color: '#4b5563', fontSize: '12px', margin: 0}}>© 2026 DocChat AI · Powered by NVIDIA NIM</p>
      </footer>

      {dragActive && (
        <div style={s.dropOverlay}><div style={s.dropOverlayInner}>📥  Drop your file to upload</div></div>
      )}

      <StickyBar />
    </main>
  );
}
