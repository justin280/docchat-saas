'use client'; // v4
import { useState, useRef } from 'react';
import Link from 'next/link';
import StickyBar from '@/app/components/StickyBar';

const QUICK_PROMPTS = [
  { icon: '📝', label: 'Summarise' },
  { icon: '🎯', label: 'Key Points' },
  { icon: '✅', label: 'Action Items' },
  { icon: '📅', label: 'Key Dates' },
  { icon: '⚠️', label: 'Risks' },
  { icon: '❓', label: 'FAQ' },
];

const USE_CASES = [
  { icon: '⚖️', title: 'Legal & Contract Review AI', desc: 'Upload contracts, NDAs, lease agreements. Instantly extract clauses, obligations, red flags and compliance requirements.' },
  { icon: '📊', title: 'AI Excel & Spreadsheet Analyzer', desc: 'Chat with Excel, CSV and financial reports. Ask questions across multiple sheets simultaneously with advanced analysis.' },
  { icon: '🎓', title: 'Academic & Research', desc: 'Chat across multiple research papers simultaneously. Generate citations, summaries and cross-paper analysis instantly.' },
  { icon: '💼', title: 'Business Intelligence', desc: 'Analyse financial reports, board decks and market research. Get executive summaries and data-driven insights in seconds.' },
  { icon: '🔧', title: 'Technical Documentation', desc: 'Navigate complex manuals, API docs and spec sheets. Get precise answers without reading hundreds of pages.' },
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


const NAV_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/contact', label: 'Contact' },

  { slug: '/pricing', label: 'Pricing' },
  { slug: '/security', label: 'Security' },];
export default function Home() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('landing');
  const [showVideo, setShowVideo] = useState(false);
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-70b-instruct');
  const [billing, setBilling] = useState('monthly');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const fileInputRef = useRef(null);

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

  const pricingPlans = [
    {
      tier: 'STARTER', name: 'Free', price: 0, annualPrice: 0,
      features: ['15 documents/month', '100 questions/month', 'TXT, DOCX, PDF support', 'Follow-up prompts'],
      cta: 'Start Free', ctaAction: () => setView('chat'),
    },
    {
      tier: 'PRO', name: '$19/mo', price: 19, annualPrice: 15,
      features: ['Unlimited documents', 'Unlimited questions', 'All file formats', 'Chat with multiple PDFs', 'All AI models', 'Priority responses', 'Auto-summarize', 'Document comparison'],
      cta: 'Get Pro', popular: true, ctaAction: () => handleCheckout('pro'),
    },
    {
      tier: 'BUSINESS', name: '$49/mo', price: 49, annualPrice: 39,
      features: ['Everything in Pro', 'API access (Q3 2026)', 'Priority support', 'Team workspace (Q3 2026)'],
      cta: 'Get Business', ctaAction: () => handleCheckout('business'),
    },
  ];

  async function handleCheckout(plan) {
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({plan}) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch(e) {
      alert('Checkout error: ' + e.message);
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
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
      } catch(err) {
        setUploadError('Upload failed for ' + file.name + ': ' + err.message + '. Please check your connection and try again.');
      }
    }
    setUploading(false);
    // Reset file input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  async function sendMessage(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ messages: [...messages, userMsg], docs, model: selectedModel })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, { role: 'assistant', content: errData.error || 'Error getting response. Please try again.' }]);
        setLoading(false);
        return;
      }
      // Stream the response
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
                setMessages(prev => { const msgs = [...prev]; msgs[msgs.length-1] = { role: 'assistant', content: assistantContent }; return msgs; });
                break;
              }
              if (parsed.token) {
                assistantContent += parsed.token;
                setMessages(prev => { const msgs = [...prev]; msgs[msgs.length-1] = { role: 'assistant', content: assistantContent }; return msgs; });
              }
            } catch(e) {}
          }
        }
      }
    } catch(err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your connection and try again.' }]);
    }
    setLoading(false);
  }

  function exportChat() {
    const text = messages.map(m => (m.role === 'user' ? 'You: ' : 'AI: ') + m.content).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'docchat-export.txt'; a.click();
  }

  const s = {
    page: { minHeight:'100vh', backgroundColor:'#0a0a0a', color:'#fff', fontFamily:'system-ui,sans-serif', paddingBottom:'60px' },
    hero: { textAlign:'center', padding:'60px 20px 40px' },
    logo: { display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'20px' },
    dot: { width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'#84cc16' },
    h1: { fontSize:'clamp(28px,5vw,52px)', fontWeight:'700', margin:'0 0 16px', lineHeight:1.2 },
    h1green: { color:'#84cc16' },
    subtitle: { fontSize:'clamp(14px,2vw,18px)', color:'#9ca3af', marginBottom:'24px', maxWidth:'700px', margin:'0 auto 24px' },
    badges: { display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap', marginBottom:'32px' },
    badge: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'20px', padding:'4px 12px', fontSize:'13px', color:'#84cc16' },
    ctaBtn: { backgroundColor:'#84cc16', color:'#000', border:'none', borderRadius:'8px', padding:'16px 36px', fontSize:'18px', fontWeight:'700', cursor:'pointer', display:'inline-block' },
    poweredBy: { color:'#6b7280', fontSize:'13px', marginTop:'12px' },
    section: { maxWidth:'1100px', margin:'0 auto', padding:'60px 20px' },
    h2: { fontSize:'clamp(22px,3vw,36px)', fontWeight:'700', textAlign:'center', marginBottom:'12px' },
    h2sub: { color:'#9ca3af', textAlign:'center', marginBottom:'40px', fontSize:'16px' },
    grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' },
    card: { backgroundColor:'#111', border:'1px solid #222', borderRadius:'12px', padding:'24px' },
    cardIcon: { fontSize:'32px', marginBottom:'12px' },
    cardTitle: { fontWeight:'700', marginBottom:'8px', fontSize:'16px' },
    cardDesc: { color:'#9ca3af', fontSize:'14px', lineHeight:'1.6' },
    pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px', marginTop:'20px' },
    pricingCard: { backgroundColor:'#111', border:'1px solid #222', borderRadius:'16px', padding:'28px' },
    pricingCardPop: { backgroundColor:'#0f1f00', border:'2px solid #84cc16', borderRadius:'16px', padding:'28px', position:'relative' },
    popularBadge: { backgroundColor:'#84cc16', color:'#000', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', display:'inline-block', marginBottom:'12px' },
    pricingTier: { fontSize:'11px', letterSpacing:'2px', color:'#6b7280', marginBottom:'4px' },
    pricingName: { fontSize:'36px', fontWeight:'700', marginBottom:'16px' },
    pricingFeature: { display:'flex', alignItems:'flex-start', gap:'8px', marginBottom:'8px', fontSize:'14px', color:'#d1d5db' },
    check: { color:'#84cc16', fontWeight:'700', flexShrink:0 },
    pricingBtn: { width:'100%', padding:'12px', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer', marginTop:'20px', border:'none' },
    compareSec: { backgroundColor:'#0f0f0f', padding:'60px 20px' },
    compareTable: { width:'100%', borderCollapse:'collapse', maxWidth:'900px', margin:'0 auto' },
    th: { padding:'12px 16px', textAlign:'left', backgroundColor:'#1a1a1a', fontSize:'13px', color:'#9ca3af', borderBottom:'1px solid #222' },
    thGreen: { padding:'12px 16px', textAlign:'left', backgroundColor:'#0f1f00', fontSize:'13px', color:'#84cc16', borderBottom:'1px solid #84cc16' },
    td: { padding:'12px 16px', borderBottom:'1px solid #1a1a1a', fontSize:'14px', color:'#d1d5db' },
    tdGreen: { padding:'12px 16px', borderBottom:'1px solid #1a1a1a', fontSize:'14px', color:'#84cc16', fontWeight:'600' },
    testimonialGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'20px' },
    testimonialCard: { backgroundColor:'#111', border:'1px solid #222', borderRadius:'12px', padding:'20px' },
    stars: { color:'#84cc16', marginBottom:'8px', fontSize:'16px' },
    testimonialText: { color:'#d1d5db', fontSize:'14px', lineHeight:'1.6', marginBottom:'12px', fontStyle:'italic' },
    testimonialName: { fontWeight:'700', fontSize:'14px' },
    testimonialRole: { color:'#6b7280', fontSize:'12px' },
    faqItem: { borderBottom:'1px solid #1a1a1a', padding:'16px 0', cursor:'pointer' },
    faqQ: { fontWeight:'600', fontSize:'15px', display:'flex', justifyContent:'space-between', alignItems:'center' },
    faqA: { color:'#9ca3af', fontSize:'14px', lineHeight:'1.6', marginTop:'8px' },
    ctaSection: { backgroundColor:'#0f1f00', border:'1px solid #84cc16', borderRadius:'16px', padding:'48px', textAlign:'center', maxWidth:'800px', margin:'0 auto' },
    billingToggle: { display:'flex', gap:'8px', justifyContent:'center', alignItems:'center', marginBottom:'24px' },
    toggleBtn: { padding:'6px 16px', borderRadius:'20px', border:'1px solid #333', cursor:'pointer', fontSize:'13px' },
    chatWrap: { display:'flex', height:'100vh', backgroundColor:'#0a0a0a', position:'relative', overflow:'hidden' },
    sidebar: { width:'260px', minWidth:'200px', backgroundColor:'#111', borderRight:'1px solid #222', padding:'16px', display:'flex', flexDirection:'column', gap:'12px', overflowY:'auto' },
    mainChat: { flex:1, display:'flex', flexDirection:'column', minWidth:0 },
    rightPanel: { width:'320px', minWidth:'240px', borderLeft:'1px solid #1a1a1a', backgroundColor:'#0d0d0d', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 },
    chatHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #222', backgroundColor:'#111', flexShrink:0 },
    msgArea: { flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' },
    userBubble: { alignSelf:'flex-end', backgroundColor:'#84cc16', color:'#000', borderRadius:'12px', padding:'10px 14px', maxWidth:'80%', fontSize:'14px', wordBreak:'break-word' },
    aiBubble: { alignSelf:'flex-start', backgroundColor:'#1a1a1a', borderRadius:'12px', padding:'10px 14px', maxWidth:'90%', fontSize:'14px', lineHeight:'1.6', whiteSpace:'pre-wrap', wordBreak:'break-word' },
    inputRow: { display:'flex', gap:'8px', padding:'12px 16px', borderTop:'1px solid #222', backgroundColor:'#111', flexShrink:0 },
    inputBox: { flex:1, backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'8px', padding:'10px 12px', color:'#fff', fontSize:'14px', minWidth:0 },
    sendBtn: { backgroundColor:'#84cc16', border:'none', borderRadius:'8px', padding:'10px 18px', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'14px', flexShrink:0 },
    quickRow: { display:'flex', gap:'6px', padding:'8px 16px', flexWrap:'wrap', backgroundColor:'#0f0f0f', flexShrink:0 },
    quickBtn: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'16px', padding:'4px 12px', color:'#d1d5db', fontSize:'12px', cursor:'pointer' },
    modelBtn: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'6px', padding:'4px 10px', color:'#9ca3af', fontSize:'12px', cursor:'pointer', marginBottom:'4px' },
    modelBtnActive: { backgroundColor:'#0f1f00', border:'1px solid #84cc16', borderRadius:'6px', padding:'4px 10px', color:'#84cc16', fontSize:'12px', cursor:'pointer', marginBottom:'4px' },
    docCard: { backgroundColor:'#1a1a1a', borderRadius:'8px', padding:'10px 12px', fontSize:'12px' },
    uploadLabel: { backgroundColor:'#84cc16', border:'none', borderRadius:'8px', padding:'10px', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'13px', textAlign:'center', display:'block' },
    uploadLabelDisabled: { backgroundColor:'#4b5563', border:'none', borderRadius:'8px', padding:'10px', color:'#9ca3af', fontSize:'13px', textAlign:'center', display:'block', cursor:'not-allowed' },
    backBtn: { backgroundColor:'transparent', border:'1px solid #333', borderRadius:'6px', padding:'6px 12px', color:'#9ca3af', fontSize:'12px', cursor:'pointer' },
    errorBox: { backgroundColor:'#1f0a0a', border:'1px solid #ef4444', borderRadius:'8px', padding:'10px 12px', fontSize:'12px', color:'#ef4444' },
  };
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: 'What file formats does DocChat AI support?', a: 'PDF, DOCX, TXT, XLSX, CSV, Markdown, HTML, RTF, EPUB, ODT and more.' },
    { q: 'Can I chat with multiple PDFs at once?', a: 'Yes! Upload up to 5 documents simultaneously and ask questions across all of them. Our advanced RAG architecture ensures accurate, grounded answers.' },
    { q: 'Is DocChat AI suitable for contract review?', a: 'Yes. The contract review AI is built for extracting clauses, flagging obligations and identifying risks in seconds.' },
    { q: 'Can it analyse Excel and CSV files?', a: 'Yes. Our AI Excel analyzer supports deep table and multi-sheet analysis. Upload financial reports, budgets or datasets and ask natural language questions.' },
    { q: 'Which AI models are available?', a: 'Llama 3.1 70B, Mistral Large and DeepSeek R1 — all powered by NVIDIA NIM infrastructure.' },
    { q: 'Are my documents private?', a: 'Yes. Documents are processed in-session only and never persisted to any database.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, cancel anytime from your account settings. No lock-in contracts.' },
  ];

  if (view === 'chat') {
    return (
      <main style={s.chatWrap}>
        <aside style={s.sidebar}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}>
            <span style={{fontWeight:'700',fontSize:'14px',color:'#84cc16',flexShrink:0}}>DocChat AI</span>
            <button style={s.backBtn} onClick={()=>setView('landing')}>Home</button>
          </div>

          {docs.length < 5 ? (
            <label style={uploading ? s.uploadLabelDisabled : s.uploadLabel}>
              {uploading ? 'Uploading...' : '+ Add Document'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.xlsx,.csv,.md,.html,.rtf,.epub,.odt"
                multiple
                disabled={uploading}
                style={{display:'none'}}
                onChange={handleUpload}
              />
            </label>
          ) : (
            <div style={{backgroundColor:'#1a1a1a',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'#6b7280',textAlign:'center'}}>Max 5 documents loaded</div>
          )}

          {uploadError && (
            <div style={s.errorBox}>
              <strong>Upload error:</strong> {uploadError}
              <button onClick={()=>setUploadError('')} style={{display:'block',marginTop:'6px',backgroundColor:'transparent',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'11px',padding:0,textDecoration:'underline'}}>Dismiss</button>
            </div>
          )}

          {docs.map((doc, i) => (
            <div key={i} style={s.docCard}>
              <div style={{fontWeight:'600',marginBottom:'4px',wordBreak:'break-all',fontSize:'12px'}}>{doc.name}</div>
              <div style={{color:'#6b7280',fontSize:'11px'}}>{(doc.size/1024).toFixed(0)}KB · {doc.text.split(' ').length.toLocaleString()} words</div>
              <button onClick={()=>setDocs(d=>d.filter((_,j)=>j!==i))} style={{marginTop:'6px',backgroundColor:'transparent',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'11px',padding:0}}>Remove</button>
            </div>
          ))}

          <div style={{marginTop:'auto',borderTop:'1px solid #222',paddingTop:'12px'}}>
            <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'8px',letterSpacing:'1px'}}>AI MODEL</div>
            <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
              {models.map(m => (
                <button key={m.id} style={selectedModel===m.id?s.modelBtnActive:s.modelBtn} onClick={()=>setSelectedModel(m.id)}>{m.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div style={s.mainChat}>
          <div style={s.chatHeader}>
            <span style={{fontWeight:'600',fontSize:'14px',color:'#9ca3af'}}>
              {docs.length === 0 ? 'No documents loaded — add one to start' : docs.length + ' document' + (docs.length!==1?'s':'') + ' loaded'}
            </span>
            <button style={s.backBtn} onClick={exportChat}>Export Chat</button>
          </div>

          <div style={s.quickRow}>
            {QUICK_PROMPTS.map((p,i) => (
              <button key={i} style={s.quickBtn} onClick={()=>sendMessage(p.label + ' this document')} disabled={docs.length===0}>{p.icon} {p.label}</button>
            ))}
          </div>

          <div style={s.msgArea}>
            {messages.length===0 && (
              <div style={{textAlign:'center',color:'#4b5563',marginTop:'60px',padding:'0 20px'}}>
                <div style={{fontSize:'40px',marginBottom:'12px'}}>💬</div>
                {docs.length === 0
                  ? <div>Add a document using the sidebar to get started</div>
                  : <div>Your document is ready — ask a question below</div>
                }
              </div>
            )}
            {messages.map((m,i) => (
              <div key={i} style={m.role==='user'?s.userBubble:s.aiBubble}>{m.content}</div>
            ))}
            {loading && <div style={s.aiBubble}>Thinking...</div>}
          </div>

          <div style={s.inputRow}>
            <input
              style={s.inputBox}
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder={docs.length===0 ? 'Upload a document first...' : 'Ask a question about your document...'}
              disabled={docs.length===0 && messages.length===0}
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
            />
            <button style={{...s.sendBtn, opacity: docs.length===0&&messages.length===0?0.5:1}} onClick={()=>sendMessage()} disabled={docs.length===0&&messages.length===0}>Send</button>
          </div>
        </div>

      {/* Right panel: Document viewer */}
      {viewerOpen && docs.length > 0 && (
        <aside style={s.rightPanel}>
          <div style={{padding:'8px 10px',borderBottom:'1px solid #1a1a1a',backgroundColor:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{display:'flex',gap:'4px',flex:1,minWidth:0,overflowX:'auto'}}>
              {docs.map((d,i) => (
                <button key={i} onClick={()=>setActiveDocIdx(i)} style={{padding:'4px 10px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'12px',whiteSpace:'nowrap',backgroundColor:activeDocIdx===i?'#84cc16':'#222',color:activeDocIdx===i?'#000':'#aaa',fontWeight:activeDocIdx===i?'700':'400'}}>
                  {d.name.length > 18 ? d.name.slice(0,16)+'...' : d.name}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:'6px',marginLeft:'8px'}}>
              <button onClick={()=>setDocModalOpen(true)} title="Enlarge" style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:'16px',padding:'2px 4px',lineHeight:1}}>⤢</button>
              <button onClick={()=>setViewerOpen(false)} title="Close" style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:'16px',padding:'2px 4px',lineHeight:1}}>✕</button>
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'16px',fontFamily:'Georgia,serif',fontSize:'13px',lineHeight:'1.7',color:'#d1d5db',whiteSpace:'pre-wrap'}}>
            {docs[activeDocIdx] ? docs[activeDocIdx].text : ''}
          </div>
        </aside>
      )}
      {docs.length > 0 && !viewerOpen && (
        <button onClick={()=>setViewerOpen(true)} style={{position:'absolute',right:'12px',bottom:'70px',background:'#111',border:'1px solid #333',color:'#84cc16',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',cursor:'pointer',zIndex:10}}>📄 Docs</button>
      )}
      {docModalOpen && docs[activeDocIdx] && (
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.85)',zIndex:1000,display:'flex',flexDirection:'column'}} onClick={()=>setDocModalOpen(false)}>
          <div style={{backgroundColor:'#0d0d0d',margin:'24px auto',width:'90%',maxWidth:'900px',maxHeight:'90vh',borderRadius:'12px',display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:'#111',flexShrink:0}}>
              <span style={{fontWeight:'700',color:'#fff',fontSize:'14px'}}>{docs[activeDocIdx].name}</span>
              <button onClick={()=>setDocModalOpen(false)} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:'20px',lineHeight:1}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'24px',fontFamily:'Georgia,serif',fontSize:'14px',lineHeight:'1.8',color:'#d1d5db',whiteSpace:'pre-wrap'}}>
              {docs[activeDocIdx].text}
            </div>
          </div>
        </div>
      )}      
      </main>
    );
  }
  return (
    <main style={s.page}>
      <nav style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 20px',borderBottom:'1px solid #111',backgroundColor:'#0a0a0a',position:'sticky',top:0,zIndex:100,flexWrap:'wrap'}}>
        <span style={{fontWeight:'700',color:'#84cc16',marginRight:'auto',fontSize:'16px'}}>DocChat AI</span>
        {NAV_PAGES.map(p=>(
          <a key={p.slug} href={p.slug} style={{color:'#9ca3af',fontSize:'13px',textDecoration:'none'}}>{p.label}</a>
        ))}
        <button style={{...s.ctaBtn, padding:'8px 18px', fontSize:'13px'}} onClick={()=>setView('chat')}>Try Free</button>
      </nav>

      <section style={s.hero}>
        <div style={s.logo}><img src="/logo.png" alt="DocChat AI" width="40" height="40" style={{borderRadius:'8px'}} /><span style={{fontSize:'24px',fontWeight:'700'}}>DocChat <span style={s.h1green}>AI</span></span></div>
        <h1 style={s.h1}>Chat with any <span style={s.h1green}>PDF</span> or document instantly</h1>
        <h2 style={{fontSize:'18px',fontWeight:'400',color:'#9ca3af',maxWidth:'700px',margin:'0 auto 24px',lineHeight:'1.6'}}>Upload up to 5 documents in any format — PDF, DOCX, XLSX, TXT, Markdown and more — then ask questions across all of them.</h2>
        <div style={s.badges}>
          {['PDF','DOCX','XLSX','TXT','Markdown','HTML','RTF','EPUB','CSV'].map(f=>(
            <span key={f} style={s.badge}>{f}</span>
          ))}
        </div>
        <button style={s.ctaBtn} onClick={()=>setView('chat')}>Try Free — No Credit Card Needed</button>
        <a href="/demo" style={{display:'inline-block', marginTop:'12px', backgroundColor:'transparent', color:'#84cc16', border:'2px solid #84cc16', borderRadius:'8px', padding:'12px 24px', fontSize:'15px', fontWeight:'600', cursor:'pointer', textDecoration:'none'}}>🔬 Try Live Demo — Free</a>
        <p style={{color:'#6b7280', fontSize:'13px', marginTop:'12px', marginBottom:'0'}}>✓ No credit card &nbsp;·&nbsp; ✓ No email &nbsp;·&nbsp; ✓ No sign-up required &nbsp;·&nbsp; ✓ Free plan available forever</p>
        <p style={s.poweredBy}>Powered by NVIDIA NIM · Llama · Mistral · DeepSeek</p>
      </section>

      {/* Video Demo Section */}
      <section style={{...s.section, padding:'40px 24px', backgroundColor:'#050505'}}>
        <div style={{textAlign:'center', maxWidth:'860px', margin:'0 auto'}}>
          <div style={{display:'inline-block', backgroundColor:'#14532d', color:'#86efac', fontSize:'12px', fontWeight:'700', padding:'4px 14px', borderRadius:'20px', marginBottom:'14px', letterSpacing:'0.05em'}}>SEE IT IN ACTION</div>
          <h2 style={{...s.h2, marginBottom:'10px'}}>Watch how it works</h2>
          <p style={{color:'#9ca3af', marginBottom:'28px', fontSize:'16px'}}>Upload any document, ask questions in plain English — get instant answers. See it in 90 seconds.</p>
          <div
            onClick={()=>setShowVideo(true)}
            style={{position:'relative', cursor:'pointer', borderRadius:'16px', overflow:'hidden', border:'2px solid #84cc16', maxWidth:'720px', margin:'0 auto', background:'#0a0a0a', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center'}}
          >
            <img src="/logo.png" alt="DocChat AI Demo" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80px', height:'80px', borderRadius:'16px', opacity:0.3}} />
            <div style={{position:'relative', zIndex:2, width:'72px', height:'72px', borderRadius:'50%', backgroundColor:'#84cc16', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 40px rgba(132,204,22,0.5)'}}>
              <span style={{fontSize:'28px', marginLeft:'4px'}}>▶</span>
            </div>
            <div style={{position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', color:'#9ca3af', fontSize:'13px', whiteSpace:'nowrap'}}>Click to watch the 90-second demo</div>
          </div>
          <div style={{display:'flex', justifyContent:'center', gap:'24px', marginTop:'20px', flexWrap:'wrap'}}>
            {[['📄','Upload any doc'],['💬','Ask in plain English'],['⚡','Get instant answers']].map(([icon,label],i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap:'6px', color:'#9ca3af', fontSize:'13px'}}>
                <span style={{fontSize:'18px'}}>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div onClick={()=>setShowVideo(false)} style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.9)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
          <div onClick={e=>e.stopPropagation()} style={{position:'relative', width:'100%', maxWidth:'900px', aspectRatio:'16/9', borderRadius:'12px', overflow:'hidden', backgroundColor:'#000'}}>
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCbmNph6atAoGfqLoCL_duAg&autoplay=1"
              title="DocChat AI Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{width:'100%', height:'100%', border:'none'}}
            />
            <button onClick={()=>setShowVideo(false)} style={{position:'absolute', top:'10px', right:'10px', backgroundColor:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:'50%', width:'36px', height:'36px', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
          </div>
          <p style={{position:'absolute', bottom:'16px', color:'#6b7280', fontSize:'12px'}}>Click outside or ✕ to close · Or <a href="/demo" style={{color:'#84cc16', textDecoration:'none'}}>try the live demo →</a></p>
        </div>
      )}

      <section style={s.section}>
        <h2 style={s.h2}>Everything you need to work smarter with documents</h2>
        <p style={s.h2sub}>Advanced RAG architecture · Follow-up prompts · Document comparison · Auto-summarize</p>
        <div style={s.grid3}>
          {FEATURES.map((f,i)=>(
            <div key={i} style={s.card}>
              <div style={s.cardIcon}>{f.icon}</div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{...s.section, backgroundColor:'#0f0f0f', maxWidth:'100%', padding:'60px 20px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <h2 style={s.h2}>Built for every industry</h2>
          <p style={s.h2sub}>From legal contract review AI to healthcare research to financial analysis</p>
          <div style={s.grid3}>
            {USE_CASES.map((u,i)=>(
              <div key={i} style={s.card}>
                <div style={s.cardIcon}>{u.icon}</div>
                <h3 style={s.cardTitle}>{u.title}</h3>
                <p style={s.cardDesc}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.compareSec}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <h2 style={s.h2}>DocChat AI vs ChatPDF vs ChatDOC vs Humata</h2>
          <p style={s.h2sub}>See why professionals choose DocChat AI for document analysis</p>
          <div style={{overflowX:'auto'}}>
            <table style={s.compareTable}>
              <thead>
                <tr>
                  <th style={s.th}>Feature</th>
                  <th style={s.thGreen}>DocChat AI</th>
                  <th style={s.th}>ChatPDF</th>
                  <th style={s.th}>ChatDOC</th>
                  <th style={s.th}>Humata</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Chat with multiple PDFs','✅ Up to 5','❌ 1 at a time','✅','✅'],
                  ['AI Excel / CSV analyzer','✅ Full support','❌','Limited','Limited'],
                  ['Contract review AI','✅ Specialized','Basic','Basic','Basic'],
                  ['AI models available','11 models (Llama, Mistral, DeepSeek + more)','1','1','1'],
                  ['Document comparison','✅','❌','❌','❌'],
                  ['Auto-summarize on upload','✅','❌','✅','✅'],
                  ['Follow-up prompts','✅ AI-suggested','❌','❌','❌'],
                  ['Advanced RAG','✅','Limited','Limited','✅'],
                  ['Free docs/month','15','3','5','3'],
                  ['Export chat','✅','❌','✅','❌'],
                  ['NVIDIA NIM powered','✅','❌','❌','❌'],
                ].map(([feat,...vals],i)=>(
                  <tr key={i}>
                    <td style={s.td}>{feat}</td>
                    {vals.map((v,j)=>(
                      <td key={j} style={j===0?s.tdGreen:s.td}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <h2 style={s.h2}>Simple, transparent pricing</h2>
        <p style={s.h2sub}>Start free. Upgrade when you need more power.</p>
        <div style={s.billingToggle}>
          <button style={{...s.toggleBtn, backgroundColor: billing==='monthly'?'#84cc16':'transparent', color: billing==='monthly'?'#000':'#9ca3af', border: billing==='monthly'?'1px solid #84cc16':'1px solid #333'}} onClick={()=>setBilling('monthly')}>Monthly</button>
          <button style={{...s.toggleBtn, backgroundColor: billing==='annual'?'#84cc16':'transparent', color: billing==='annual'?'#000':'#9ca3af', border: billing==='annual'?'1px solid #84cc16':'1px solid #333'}} onClick={()=>setBilling('annual')}>Annual <span style={{color: billing==='annual'?'#000':'#84cc16',fontSize:'11px',fontWeight:'700'}}> SAVE 20%</span></button>
        </div>
        <div style={s.pricingGrid}>
          {pricingPlans.map((plan,i)=>(
            <div key={i} style={plan.popular?s.pricingCardPop:s.pricingCard}>
              {plan.popular&&<div style={s.popularBadge}>MOST POPULAR</div>}
              <div style={s.pricingTier}>{plan.tier}</div>
              <div style={s.pricingName}>
                {plan.price===0 ? 'Free' : (billing==='annual'?'$'+plan.annualPrice:'$'+plan.price)+'/mo'}
                {plan.price>0&&billing==='annual'&&<span style={{fontSize:'12px',color:'#84cc16',marginLeft:'8px'}}>billed annually</span>}
              </div>
              {plan.features.map((f,j)=>(
                <div key={j} style={s.pricingFeature}><span style={s.check}>✓</span>{f}</div>
              ))}
              <button style={{...s.pricingBtn, backgroundColor: plan.popular?'#84cc16':'transparent', color: plan.popular?'#000':'#fff', border: plan.popular?'none':'1px solid #333'}} onClick={plan.ctaAction}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </section>



      <section style={{...s.section, paddingTop:'20px'}}>
        <h2 style={s.h2}>Frequently Asked Questions</h2>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          {faqs.map((f,i)=>(
            <div key={i} style={s.faqItem} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              <div style={s.faqQ}><span>{f.q}</span><span>{openFaq===i?'−':'+'}</span></div>
              {openFaq===i&&<div style={s.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={s.section}>
        <div style={s.ctaSection}>
          <h2 style={{...s.h2, marginBottom:'12px'}}>Ready to stop scrolling through documents?</h2>
          <p style={{color:'#9ca3af',marginBottom:'24px'}}>Join professionals who use DocChat AI to work smarter across any document format.</p>
          <button style={s.ctaBtn} onClick={()=>setView('chat')}>Start for Free</button>
        </div>
      </section>

      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',paddingBottom:'120px',textAlign:'center'}}>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',alignItems:'center',marginBottom:'8px'}}>
          {NAV_PAGES.map(p=>(
            <a key={p.slug} href={p.slug} style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>{p.label}</a>
          ))}
        </div>
        <p style={{color:'#4b5563',fontSize:'12px',margin:0}}>© 2026 DocChat AI · Powered by NVIDIA NIM · Secure payments by Stripe</p>
      </footer>

      <StickyBar />
    </main>
  );
}
