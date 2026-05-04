'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const PLANS = [
  { id: 'free', name: 'Starter', price: 'Free', features: ['5 documents/month', '50 questions/month', 'TXT, DOCX, PDF support'], cta: 'Start Free', highlight: false },
  { id: 'pro', name: 'Pro', price: '$19/mo', features: ['Unlimited documents', 'Unlimited questions', 'All file formats', 'Multi-document chat', 'All AI models', 'Priority responses'], cta: 'Get Pro', highlight: true },
  { id: 'business', name: 'Business', price: '$49/mo', features: ['Everything in Pro', 'API access', 'Priority support', 'Team collaboration (soon)'], cta: 'Get Business', highlight: false },
];
const MODELS = [
  { id: 'llama-3.1-70b', label: 'Llama 3.1 70B', badge: 'Fast', color: '#76b900' },
  { id: 'mistral-medium', label: 'Mistral Large', badge: 'Precise', color: '#f59e0b' },
  { id: 'deepseek', label: 'DeepSeek R1', badge: 'Reasoning', color: '#6366f1' },
];
const TEMPLATES = [
  { icon: '📝', label: 'Summarise', prompt: 'Please provide a concise summary of this document, covering the main points and key takeaways.' },
  { icon: '🎯', label: 'Key Points', prompt: 'Extract the most important key points from this document as a numbered list.' },
  { icon: '✅', label: 'Action Items', prompt: 'List all action items, tasks, or next steps mentioned in this document.' },
  { icon: '📅', label: 'Key Dates', prompt: 'Extract all dates, deadlines, and time-sensitive information from this document.' },
  { icon: '⚠️', label: 'Risks', prompt: 'Identify any risks, concerns, warnings, or potential issues mentioned in this document.' },
  { icon: '❓', label: 'FAQ', prompt: 'Generate a list of 5 frequently asked questions and answers based on this document.' },
];
const ACCEPTED = '.pdf,.docx,.txt,.xlsx,.csv,.md,.html,.htm,.rtf,.epub,.odt';
const MAX_DOCS = 5;
const USE_CASES = [
  { icon: '⚖️', title: 'Legal', desc: 'Upload contracts, find clauses instantly.' },
  { icon: '🏥', title: 'Healthcare', desc: 'Query research papers and reports.' },
  { icon: '📊', title: 'Finance', desc: 'Ask about annual reports and statements.' },
  { icon: '🎓', title: 'Students', desc: 'Upload notes, get answers for essays.' },
  { icon: '🏢', title: 'HR', desc: 'Search handbooks and policy documents.' },
  { icon: '🔬', title: 'Research', desc: 'Ask across multiple academic papers.' },
];
const FAQS = [
  { q: 'What file types are supported?', a: 'PDF, DOCX, TXT, XLSX, CSV, Markdown, HTML, RTF, EPUB, and ODT.' },
  { q: 'Can I upload multiple documents?', a: 'Yes — upload up to 5 documents and chat across all of them at once.' },
  { q: 'Which AI models are available?', a: 'Llama 3.1 70B (fast), Mistral Large (precise), and DeepSeek R1 (reasoning). Switch mid-chat.' },
  { q: 'Are my documents private?', a: 'Yes. Processed in real-time, never stored. Your data stays yours.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, cancel anytime from your Stripe billing portal. No lock-in.' },
];

export default function Home() {
  const [view, setView] = useState('landing');
  const [plan, setPlan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingName, setUploadingName] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.1-70b');
  const [openFaq, setOpenFaq] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('subscribed') === 'true') { setPlan('pro'); setView('chat'); }
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSubscribe = async (planId) => {
    if (planId === 'free') { setPlan('free'); setView('chat'); return; }
    setCheckingOut(planId);
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planId }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert('Error: ' + (data.error || 'Unknown')); setCheckingOut(false); }
  };

  const processFile = async (f) => {
    if (documents.length >= MAX_DOCS) { alert('Max 5 documents. Remove one first.'); return; }
    if (documents.find(d => d.name === f.name)) { alert('Already uploaded.'); return; }
    setUploading(true); setUploadingName(f.name);
    const fd = new FormData(); fd.append('file', f);
    const res = await fetch('/api/parse', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false); setUploadingName('');
    if (data.text) {
      const newDoc = { id: Date.now(), name: f.name, text: data.text, size: f.size };
      setDocuments(prev => {
        const updated = [...prev, newDoc];
        setMessages(msgs => [...msgs, { role: 'assistant', content: updated.length === 1 ? `📄 **${f.name}** loaded! Ask me anything about it.` : `📄 **${f.name}** added. Chatting across ${updated.length} documents.` }]);
        return updated;
      });
    } else alert('Could not parse: ' + (data.error || 'Unknown'));
  };

  const handleFileInput = async (e) => { for (const f of Array.from(e.target.files || [])) await processFile(f); e.target.value = ''; };
  const handleDrop = useCallback(async (e) => { e.preventDefault(); setDragOver(false); for (const f of Array.from(e.dataTransfer.files)) await processFile(f); }, [documents]);
  const removeDoc = (id) => setDocuments(prev => { const u = prev.filter(d => d.id !== id); if (!u.length) setMessages([]); else setMessages(m => [...m, { role: 'assistant', content: `Removed. Chatting across ${u.length} document(s).` }]); return u; });

  const sendMessage = async (custom) => {
    const text = custom || input;
    if (!text.trim() || !documents.length) return;
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(''); setLoading(true);
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMsgs, documents, model: selectedModel }) });
    const data = await res.json();
    setMessages([...newMsgs, { role: 'assistant', content: data.reply, model: data.model }]);
    setLoading(false);
  };

  const exportChat = () => {
    const lines = ['DocChat AI — Conversation Export', '='.repeat(40), ''];
    documents.forEach(d => lines.push('Document: ' + d.name));
    lines.push('', '='.repeat(40), '');
    messages.forEach(m => { lines.push(m.role === 'user' ? 'YOU:' : 'AI:'); lines.push(m.content); lines.push(''); });
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' })); a.download = 'docchat-export.txt'; a.click();
  };

  const currentModel = MODELS.find(m => m.id === selectedModel);

  if (view === 'chat') return (
    <main className="min-h-screen flex flex-col" style={{background:'#0f0f0f'}}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:'#2a2a2a',background:'#111'}}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full" style={{background:'#76b900'}}></div>
          <span className="text-white font-bold text-sm">DocChat <span style={{color:'#76b900'}}>AI</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'#1a2a00',color:'#76b900',border:'1px solid #76b900'}}>{plan==='pro'?'Pro':plan==='business'?'Business':'Starter'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg p-1" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>
            {MODELS.map(m => <button key={m.id} onClick={() => setSelectedModel(m.id)} className="px-2 py-1 rounded-md text-xs font-medium transition-all" style={{background:selectedModel===m.id?m.color:'transparent',color:selectedModel===m.id?'#000':'#666'}}>{m.label}</button>)}
          </div>
          {messages.length > 0 && <button onClick={exportChat} className="text-xs px-3 py-1.5 rounded-lg" style={{background:'#1a1a1a',color:'#888',border:'1px solid #2a2a2a'}}>⬇ Export</button>}
          <button onClick={() => setView('landing')} className="text-xs text-gray-500 hover:text-gray-300">← Plans</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden" style={{height:'calc(100vh - 57px)'}}>
        <div className="flex flex-col w-60 border-r p-3 gap-3 flex-shrink-0" style={{borderColor:'#2a2a2a',background:'#111'}}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Docs ({documents.length}/{MAX_DOCS})</p>
          <div onClick={() => !uploading && fileRef.current.click()} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop}
            className="border-2 border-dashed rounded-xl p-3 text-center cursor-pointer" style={{borderColor:dragOver?'#76b900':'#333',background:dragOver?'#0d1a00':'#1a1a1a'}}>
            {uploading ? <div><div className="text-xs" style={{color:'#76b900'}}>Parsing...</div><div className="text-xs text-gray-500 truncate">{uploadingName}</div></div>
              : <div><p className="text-xs text-gray-400">+ Add document</p><p className="text-xs text-gray-600">PDF, DOCX, XLSX, TXT, MD...</p></div>}
            <input ref={fileRef} type="file" accept={ACCEPTED} onChange={handleFileInput} multiple className="hidden" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {!documents.length && <p className="text-xs text-gray-600 text-center mt-4">No documents yet</p>}
            {documents.map(doc => (
              <div key={doc.id} className="flex items-start gap-2 p-2 rounded-lg group" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>
                <span className="text-sm mt-0.5">{doc.name.endsWith('.pdf')?'📄':doc.name.endsWith('.xlsx')||doc.name.endsWith('.csv')?'📊':'📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-600">{Math.round(doc.size/1024)}KB</p>
                </div>
                <button onClick={()=>removeDoc(doc.id)} className="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
          <div className="p-2 rounded-lg text-xs" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>
            <p className="text-gray-500">Model</p>
            <p className="font-semibold" style={{color:currentModel?.color}}>{currentModel?.label}</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto flex-shrink-0" style={{borderColor:'#2a2a2a',background:'#111'}}>
            <span className="text-xs text-gray-600 flex-shrink-0">Quick:</span>
            {TEMPLATES.map(t => <button key={t.label} onClick={()=>sendMessage(t.prompt)} disabled={!documents.length||loading} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 disabled:opacity-40" style={{background:'#1a1a1a',color:'#aaa',border:'1px solid #333'}}><span>{t.icon}</span>{t.label}</button>)}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!messages.length && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-400 font-medium">Upload documents to get started</p>
                <p className="text-gray-600 text-sm mt-1">Then ask questions or use a quick prompt above</p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md w-full">
                  {['Summarise the document','What are the key risks?','List all action items','Extract important dates'].map(q=><button key={q} onClick={()=>sendMessage(q)} disabled={!documents.length} className="text-left p-3 rounded-xl text-xs text-gray-400 disabled:opacity-30" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>"{q}"</button>)}
                </div>
              </div>
            )}
            {messages.map((m,i) => (
              <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className="max-w-[75%]">
                  {m.role==='assistant'&&m.model&&<p className="text-xs text-gray-600 mb-1 ml-1">{m.model}</p>}
                  <div className="rounded-2xl px-4 py-3 text-sm" style={{background:m.role==='user'?'#76b900':'#1e1e1e',color:m.role==='user'?'#000':'#e5e5e5',border:m.role==='assistant'?'1px solid #2a2a2a':'none'}}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="rounded-2xl px-4 py-3 text-sm flex items-center gap-2" style={{background:'#1e1e1e',border:'1px solid #2a2a2a'}}><div className="flex gap-1">{[0,150,300].map(d=><span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{background:'#76b900',animationDelay:d+'ms'}}></span>)}</div><span className="text-gray-500 text-xs">{currentModel?.label} thinking...</span></div></div>}
            <div ref={messagesEndRef}/>
          </div>
          <div className="p-4 border-t" style={{borderColor:'#2a2a2a',background:'#111'}}>
            <div className="flex gap-3">
              <input className="flex-1 rounded-xl px-4 py-3 text-sm outline-none" style={{background:'#1a1a1a',color:'#e5e5e5',border:'1px solid #333'}}
                placeholder={documents.length?'Ask a question...':'Upload a document first'}
                value={input} disabled={!documents.length||loading}
                onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}/>
              <button onClick={()=>sendMessage()} disabled={!documents.length||loading||!input.trim()} className="px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-40" style={{background:'#76b900',color:'#000'}}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12" style={{background:'#0f0f0f'}}>
      <div className="text-center mb-16 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6"><div className="w-10 h-10 rounded-full" style={{background:'#76b900'}}></div><h1 className="text-4xl font-bold text-white">DocChat <span style={{color:'#76b900'}}>AI</span></h1></div>
        <h2 className="text-2xl text-gray-200 font-semibold mb-3">Chat with any PDF or document instantly</h2>
        <p className="text-gray-400 mb-4">Upload up to 5 documents in any format — PDF, DOCX, XLSX, TXT, Markdown and more — then ask questions across all of them.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">{['PDF','DOCX','XLSX','TXT','Markdown','HTML','RTF','EPUB','CSV'].map(f=><span key={f} className="text-xs px-2 py-1 rounded-full" style={{background:'#1a2a00',color:'#76b900',border:'1px solid #76b90033'}}>{f}</span>)}</div>
        <button onClick={()=>handleSubscribe('free')} className="px-8 py-4 rounded-xl font-bold text-lg" style={{background:'#76b900',color:'#000'}}>Try Free — No Credit Card Needed</button>
        <p className="text-gray-600 text-xs mt-3">Powered by NVIDIA NIM · Llama · Mistral · DeepSeek</p>
      </div>
      <div className="w-full max-w-4xl mb-16 grid grid-cols-3 gap-4">
        {[{icon:'📁',title:'Multi-Document Chat',desc:'Upload up to 5 documents, ask across all simultaneously'},{icon:'🤖',title:'3 AI Models',desc:'Switch between Llama 3.1, Mistral Large, DeepSeek R1 mid-chat'},{icon:'⚡',title:'Quick Prompts',desc:'One-click: Summarise, Key Points, Action Items, Risks, Dates'},{icon:'📊',title:'Spreadsheet Support',desc:'Upload Excel and CSV, ask questions about your data'},{icon:'⬇️',title:'Export Chat',desc:'Download your full conversation as a text file'},{icon:'🔒',title:'Private & Secure',desc:'Never stored. Processed in real-time. Your data stays yours.'}].map(f=>(
          <div key={f.title} className="rounded-xl p-4" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}><div className="text-2xl mb-2">{f.icon}</div><p className="text-white font-semibold text-sm mb-1">{f.title}</p><p className="text-gray-500 text-xs">{f.desc}</p></div>
        ))}
      </div>
      <div className="w-full max-w-4xl mb-16"><h2 className="text-xl font-bold text-white text-center mb-8">Who uses DocChat AI?</h2><div className="grid grid-cols-3 gap-4">{USE_CASES.map(u=><div key={u.title} className="rounded-xl p-4" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}><div className="text-2xl mb-2">{u.icon}</div><p className="text-white font-semibold text-sm mb-1">{u.title}</p><p className="text-gray-500 text-xs">{u.desc}</p></div>)}</div></div>
      <div className="w-full max-w-4xl mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-8">Pricing</h2>
        <div className="grid grid-cols-3 gap-6">
          {PLANS.map(p=>(
            <div key={p.id} className="rounded-2xl p-6 flex flex-col" style={{background:p.highlight?'#0d1a00':'#1a1a1a',border:p.highlight?'2px solid #76b900':'1px solid #2a2a2a'}}>
              {p.highlight&&<div className="text-xs font-bold mb-3 text-center py-1 px-3 rounded-full self-center" style={{background:'#76b900',color:'#000'}}>MOST POPULAR</div>}
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{p.name}</p>
              <p className="text-white font-bold text-3xl mb-4">{p.price}</p>
              <ul className="space-y-2 mb-6 flex-1">{p.features.map(f=><li key={f} className="flex items-center gap-2 text-xs text-gray-300"><span style={{color:'#76b900'}}>✓</span>{f}</li>)}</ul>
              <button onClick={()=>handleSubscribe(p.id)} disabled={checkingOut===p.id} className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60" style={{background:p.highlight?'#76b900':'#2a2a2a',color:p.highlight?'#000':'#e5e5e5',border:p.highlight?'none':'1px solid #444'}}>{checkingOut===p.id?'Redirecting...':p.cta}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-2xl mb-16"><h2 className="text-xl font-bold text-white text-center mb-8">FAQ</h2><div className="space-y-3">{FAQS.map((faq,i)=><div key={i} className="rounded-xl overflow-hidden" style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full text-left px-5 py-4 flex items-center justify-between text-white text-sm font-medium">{faq.q}<span style={{color:'#76b900'}}>{openFaq===i?'−':'+'}</span></button>{openFaq===i&&<p className="px-5 pb-4 text-gray-400 text-sm">{faq.a}</p>}</div>)}</div></div>
      <div className="w-full max-w-2xl text-center mb-12 rounded-2xl p-10" style={{background:'#0d1a00',border:'2px solid #76b900'}}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to stop scrolling through documents?</h2>
        <p className="text-gray-400 mb-6">Join professionals who use DocChat AI to work smarter across any document format.</p>
        <button onClick={()=>handleSubscribe('free')} className="px-8 py-4 rounded-xl font-bold text-lg" style={{background:'#76b900',color:'#000'}}>Start for Free</button>
      </div>
      <p className="text-gray-600 text-xs">© 2026 DocChat AI · Powered by NVIDIA NIM · Secure payments by Stripe</p>
    </main>
  );
}