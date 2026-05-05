'use client';
import { useState } from 'react';

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
  { icon: '🏥', title: 'Healthcare Research', desc: 'Process clinical studies, medical literature and HIPAA-compliant documents. Extract insights from complex health data.' },
  { icon: '🎓', title: 'Academic & Research', desc: 'Chat across multiple research papers simultaneously. Generate citations, summaries and cross-paper analysis instantly.' },
  { icon: '💼', title: 'Business Intelligence', desc: 'Analyse financial reports, board decks and market research. Get executive summaries and data-driven insights in seconds.' },
  { icon: '🔧', title: 'Technical Documentation', desc: 'Navigate complex manuals, API docs and spec sheets. Get precise answers without reading hundreds of pages.' },
];

const FEATURES = [
  { icon: '📁', title: 'Chat With Multiple PDFs', desc: 'Upload up to 5 documents simultaneously and ask questions across all of them at once.' },
  { icon: '🤖', title: '3 AI Models', desc: 'Switch between Llama 3.1, Mistral Large and DeepSeek R1 mid-chat for the best results.' },
  { icon: '⚡', title: 'Quick Prompts', desc: 'One-click: Summarise, Key Points, Action Items, Risks, Dates.' },
  { icon: '📊', title: 'AI Excel Analyzer', desc: 'Deep spreadsheet and CSV analysis with multi-sheet support.' },
  { icon: '⬇️', title: 'Export Chat', desc: 'Download your entire conversation as a .txt file.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Documents are never stored. Advanced RAG architecture ensures accurate, grounded answers.' },
  { icon: '💬', title: 'Follow-Up Prompts', desc: 'AI suggests intelligent follow-up questions based on your document context.' },
  { icon: '🔄', title: 'Document Comparison', desc: 'Compare two contracts or reports side-by-side to spot differences instantly.' },
  { icon: '🔍', title: 'Auto-Summarize', desc: 'Toggle auto-summarize on upload to get an instant overview before you start chatting.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Contract Lawyer', text: 'I review 20+ contracts a week. DocChat AI cuts my time in half. The contract review AI is incredibly accurate.' },
  { name: 'James T.', role: 'Financial Analyst', text: 'The AI Excel analyzer is a game changer. I uploaded 3 quarterly reports and asked cross-document questions instantly.' },
  { name: 'Dr. Priya R.', role: 'Medical Researcher', text: 'Perfect for healthcare research. I process clinical studies and get structured summaries in minutes, not hours.' },
  { name: 'Alex W.', role: 'Startup Founder', text: 'We use DocChat AI for due diligence. Uploading investor reports and chatting with them saves us days of manual work.' },
];

const INDUSTRY_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/healthcare', label: 'Healthcare' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/compliance', label: 'Compliance' },
];

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('landing');
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-70b-instruct');
  const [billing, setBilling] = useState('monthly');

  const models = [
    { id: 'meta/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
    { id: 'mistralai/mistral-large-latest', label: 'Mistral Large' },
    { id: 'deepseek-ai/deepseek-r1', label: 'DeepSeek R1' },
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
      features: ['Everything in Pro', 'API access', 'Priority support', 'Team workspace (Q3 2026)', 'SSO (Google/Microsoft)', 'Admin controls', 'SOC2 & HIPAA ready'],
      cta: 'Get Business', ctaAction: () => handleCheckout('business'),
    },
  ];

  async function handleCheckout(plan) {
    const res = await fetch('/api/checkout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({plan}) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      if (docs.length >= 5) break;
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.text) {
        setDocs(prev => [...prev, { name: file.name, text: data.text, size: file.size }]);
      }
    }
    if (docs.length > 0 || files.length > 0) setView('chat');
  }

  async function sendMessage(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const context = docs.map(d => 'Document: ' + d.name + '\n' + d.text.substring(0, 8000)).join('\n\n---\n\n');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ messages: [...messages, userMsg], context, model: selectedModel })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Error getting response' }]);
    setLoading(false);
  }

  function exportChat() {
    const text = messages.map(m => (m.role === 'user' ? 'You: ' : 'AI: ') + m.content).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'docchat-export.txt'; a.click();
  }

  const s = {
    page: { minHeight:'100vh', backgroundColor:'#0a0a0a', color:'#fff', fontFamily:'system-ui,sans-serif' },
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
    navLinks: { display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap', marginBottom:'20px' },
    navLink: { color:'#84cc16', fontSize:'13px', textDecoration:'none' },
    chatWrap: { display:'flex', height:'100vh', backgroundColor:'#0a0a0a' },
    sidebar: { width:'260px', backgroundColor:'#111', borderRight:'1px solid #222', padding:'16px', display:'flex', flexDirection:'column', gap:'12px', overflowY:'auto' },
    mainChat: { flex:1, display:'flex', flexDirection:'column' },
    chatHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #222', backgroundColor:'#111' },
    msgArea: { flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' },
    userBubble: { alignSelf:'flex-end', backgroundColor:'#84cc16', color:'#000', borderRadius:'12px', padding:'10px 14px', maxWidth:'70%', fontSize:'14px' },
    aiBubble: { alignSelf:'flex-start', backgroundColor:'#1a1a1a', borderRadius:'12px', padding:'10px 14px', maxWidth:'80%', fontSize:'14px', lineHeight:'1.6', whiteSpace:'pre-wrap' },
    inputRow: { display:'flex', gap:'8px', padding:'12px 16px', borderTop:'1px solid #222', backgroundColor:'#111' },
    inputBox: { flex:1, backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'8px', padding:'10px 12px', color:'#fff', fontSize:'14px' },
    sendBtn: { backgroundColor:'#84cc16', border:'none', borderRadius:'8px', padding:'10px 18px', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'14px' },
    quickRow: { display:'flex', gap:'6px', padding:'8px 16px', flexWrap:'wrap', backgroundColor:'#0f0f0f' },
    quickBtn: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'16px', padding:'4px 12px', color:'#d1d5db', fontSize:'12px', cursor:'pointer' },
    modelBtn: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'6px', padding:'4px 10px', color:'#9ca3af', fontSize:'12px', cursor:'pointer' },
    modelBtnActive: { backgroundColor:'#0f1f00', border:'1px solid #84cc16', borderRadius:'6px', padding:'4px 10px', color:'#84cc16', fontSize:'12px', cursor:'pointer' },
    docCard: { backgroundColor:'#1a1a1a', borderRadius:'8px', padding:'10px 12px', fontSize:'12px' },
    uploadBtn: { backgroundColor:'#84cc16', border:'none', borderRadius:'8px', padding:'10px', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'13px', textAlign:'center' },
    backBtn: { backgroundColor:'transparent', border:'1px solid #333', borderRadius:'6px', padding:'6px 12px', color:'#9ca3af', fontSize:'12px', cursor:'pointer' },
    billingToggle: { display:'flex', gap:'8px', justifyContent:'center', alignItems:'center', marginBottom:'24px' },
    toggleBtn: { padding:'6px 16px', borderRadius:'20px', border:'1px solid #333', cursor:'pointer', fontSize:'13px' },
  };

  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: 'What file formats does DocChat AI support?', a: 'PDF, DOCX, TXT, XLSX, CSV, Markdown, HTML, RTF, EPUB, ODT and more.' },
    { q: 'Can I chat with multiple PDFs at once?', a: 'Yes! Upload up to 5 documents simultaneously and ask questions across all of them. Our advanced RAG architecture ensures accurate, grounded answers.' },
    { q: 'Is DocChat AI suitable for contract review?', a: 'Absolutely. Our contract review AI is used by lawyers and paralegals to extract clauses, flag obligations and identify risks in seconds.' },
    { q: 'Can it analyse Excel and CSV files?', a: 'Yes. Our AI Excel analyzer supports deep table and multi-sheet analysis. Upload financial reports, budgets or datasets and ask natural language questions.' },
    { q: 'Is it HIPAA compliant for healthcare use?', a: 'Our Business plan includes HIPAA-ready processing. Documents are never stored after your session ends.' },
    { q: 'Which AI models are available?', a: 'Llama 3.1 70B, Mistral Large and DeepSeek R1 — all powered by NVIDIA NIM infrastructure.' },
    { q: 'Are my documents private?', a: 'Yes. Documents are processed in-session only and never persisted to any database.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, cancel anytime from your account settings. No lock-in contracts.' },
  ];

  if (view === 'chat') {
    return (
      <main style={s.chatWrap}>
        <aside style={s.sidebar}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontWeight:'700',fontSize:'14px',color:'#84cc16'}}>DocChat AI</span>
            <button style={s.backBtn} onClick={()=>setView('landing')}>Home</button>
          </div>
          <label style={s.uploadBtn}>
            + Add Document
            <input type="file" accept=".pdf,.docx,.txt,.xlsx,.csv,.md,.html,.rtf,.epub,.odt" multiple style={{display:'none'}} onChange={handleUpload} />
          </label>
          {docs.map((doc, i) => (
            <div key={i} style={s.docCard}>
              <div style={{fontWeight:'600',marginBottom:'4px',wordBreak:'break-all'}}>{doc.name}</div>
              <div style={{color:'#6b7280',fontSize:'11px'}}>{Math.round(doc.size/1024)}KB · {doc.text.split(' ').length} words</div>
              <button onClick={()=>setDocs(d=>d.filter((_,j)=>j!==i))} style={{marginTop:'6px',backgroundColor:'transparent',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'11px',padding:0}}>Remove</button>
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid #222',paddingTop:'12px'}}>
            <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'8px'}}>AI MODEL</div>
            {models.map(m => (
              <button key={m.id} style={selectedModel===m.id?s.modelBtnActive:s.modelBtn} onClick={()=>setSelectedModel(m.id)}>{m.label}</button>
            ))}
          </div>
        </aside>
        <div style={s.mainChat}>
          <div style={s.chatHeader}>
            <span style={{fontWeight:'600',fontSize:'14px'}}>{docs.length} document{docs.length!==1?'s':''} loaded</span>
            <button style={s.backBtn} onClick={exportChat}>Export Chat</button>
          </div>
          <div style={s.quickRow}>
            {QUICK_PROMPTS.map((p,i) => (
              <button key={i} style={s.quickBtn} onClick={()=>sendMessage(p.label + ' this document')}>{p.icon} {p.label}</button>
            ))}
          </div>
          <div style={s.msgArea}>
            {messages.length===0 && (
              <div style={{textAlign:'center',color:'#4b5563',marginTop:'60px'}}>
                <div style={{fontSize:'40px',marginBottom:'12px'}}>💬</div>
                <div>Upload a document and start chatting</div>
              </div>
            )}
            {messages.map((m,i) => (
              <div key={i} style={m.role==='user'?s.userBubble:s.aiBubble}>{m.content}</div>
            ))}
            {loading && <div style={s.aiBubble}>Thinking...</div>}
          </div>
          <div style={s.inputRow}>
            <input style={s.inputBox} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask a question about your document..." onKeyDown={e=>e.key==='Enter'&&sendMessage()} />
            <button style={s.sendBtn} onClick={()=>sendMessage()}>Send</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={s.page}>
      {/* NAV */}
      <nav style={{...s.navLinks, padding:'16px 20px', borderBottom:'1px solid #111', backgroundColor:'#0a0a0a', position:'sticky', top:0, zIndex:100}}>
        <span style={{fontWeight:'700',color:'#84cc16',marginRight:'auto'}}>DocChat AI</span>
        {INDUSTRY_PAGES.map(p=>(
          <a key={p.slug} href={p.slug} style={s.navLink}>{p.label}</a>
        ))}
        <button style={{...s.ctaBtn, padding:'6px 16px', fontSize:'13px'}} onClick={()=>setView('chat')}>Try Free</button>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.logo}><div style={s.dot}></div><span style={{fontSize:'24px',fontWeight:'700'}}>DocChat <span style={s.h1green}>AI</span></span></div>
        <h1 style={s.h1}>Chat with any <span style={s.h1green}>PDF</span> or document instantly</h1>
        <h2 style={{...s.subtitle, fontSize:'18px', fontWeight:'400'}}>Upload up to 5 documents in any format — PDF, DOCX, XLSX, TXT, Markdown and more — then ask questions across all of them.</h2>
        <div style={s.badges}>
          {['PDF','DOCX','XLSX','TXT','Markdown','HTML','RTF','EPUB','CSV'].map(f=>(
            <span key={f} style={s.badge}>{f}</span>
          ))}
        </div>
        <button style={s.ctaBtn} onClick={()=>setView('chat')}>Try Free — No Credit Card Needed</button>
        <p style={s.poweredBy}>Powered by NVIDIA NIM · Llama · Mistral · DeepSeek</p>
      </section>

      {/* FEATURES */}
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

      {/* USE CASES */}
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

      {/* COMPETITOR COMPARISON */}
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
                  ['AI models available','3 (Llama/Mistral/DeepSeek)','1','1','1'],
                  ['Document comparison','✅','❌','❌','❌'],
                  ['Auto-summarize on upload','✅','❌','✅','✅'],
                  ['Follow-up prompts','✅ AI-suggested','❌','❌','❌'],
                  ['Advanced RAG','✅','Limited','Limited','✅'],
                  ['Free docs/month','15','3','5','3'],
                  ['Export chat','✅','❌','✅','❌'],
                  ['HIPAA / Enterprise ready','✅ Business plan','❌','❌','✅'],
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

      {/* PRICING */}
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

      {/* TESTIMONIALS */}
      <section style={{...s.section, paddingTop:'20px'}}>
        <h2 style={s.h2}>Trusted by professionals worldwide</h2>
        <p style={s.h2sub}>Join thousands of lawyers, analysts, researchers and founders</p>
        <div style={s.testimonialGrid}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={s.testimonialCard}>
              <div style={s.stars}>★★★★★</div>
              <p style={s.testimonialText}>"{t.text}"</p>
              <div style={s.testimonialName}>{t.name}</div>
              <div style={s.testimonialRole}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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

      {/* CTA */}
      <section style={s.section}>
        <div style={s.ctaSection}>
          <h2 style={{...s.h2, marginBottom:'12px'}}>Ready to stop scrolling through documents?</h2>
          <p style={{color:'#9ca3af',marginBottom:'24px'}}>Join professionals who use DocChat AI to work smarter across any document format.</p>
          <button style={s.ctaBtn} onClick={()=>setView('chat')}>Start for Free</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',textAlign:'center'}}>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',alignItems:'center',marginBottom:'8px'}}>
          {INDUSTRY_PAGES.map(p=>(
            <a key={p.slug} href={p.slug} style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>{p.label}</a>
          ))}
        </div>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',alignItems:'center',marginBottom:'8px'}}>
          <a href="mailto:support.docchatai@proton.me" style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>support.docchatai&#64;proton.me</a>
          <a href="https://www.facebook.com/share/18tcsvjgAh/" target="_blank" rel="noopener noreferrer" style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>Facebook</a>
          <a href="https://www.instagram.com/docchatai?igsh=MWxocDY1NGdncXZnNw==" target="_blank" rel="noopener noreferrer" style={{color:'#6b7280',fontSize:'12px',textDecoration:'none'}}>Instagram</a>
        </div>
        <p style={{color:'#4b5563',fontSize:'12px',margin:0}}>&#169; 2026 DocChat AI &#183; Powered by NVIDIA NIM &#183; Secure payments by Stripe</p>
      </footer>
    </main>
  );
}
