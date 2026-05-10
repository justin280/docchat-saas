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
];

const NAV_PAGES = [
  { slug: '/', label: 'Home' },
  { slug: '/contact', label: 'Contact' },
];
export default function Home() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('landing');
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-70b-instruct');
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
      </nav>


      <section style={{...s.hero, padding:'80px 20px 40px'}}>
        <h1 style={s.h1}>Chat with any <span style={s.h1green}>PDF or document</span> instantly</h1>
        <p style={s.subtitle}>Upload your file and start asking questions. No sign-up required.</p>

        <div style={{maxWidth:'520px', margin:'32px auto 0', padding:'0 20px'}}>
          <label style={{...s.uploadLabel, padding:'18px', fontSize:'15px', display:'block', cursor:uploading?'not-allowed':'pointer', opacity:uploading?0.6:1}}>
            {uploading ? 'Uploading...' : '📄  Upload a document to start chatting'}
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
          <p style={{color:'#6b7280', fontSize:'12px', marginTop:'12px', textAlign:'center'}}>
            PDF · DOCX · TXT · XLSX · CSV · MD · HTML · RTF · EPUB · ODT
          </p>
          {uploadError && (
            <div style={{...s.errorBox, marginTop:'16px'}}>
              <strong>Upload error:</strong> {uploadError}
            </div>
          )}
        </div>
      </section>

      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',paddingBottom:'120px',textAlign:'center'}}>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',alignItems:'center',marginBottom:'8px'}}>
          {NAV_PAGES.map(p=>(
            <a key={p.slug} href={p.slug} style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>{p.label}</a>
          ))}
        </div>
        <p style={{color:'#4b5563',fontSize:'12px',margin:0}}>© 2026 DocChat AI · Powered by NVIDIA NIM</p>
      </footer>

      <StickyBar />
    </main>
  );
}
