'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const PLANS = [
  { id: 'free', name: 'Starter', price: 'Free', features: ['5 documents/month', '50 questions/month', 'TXT & DOCX support'], cta: 'Start Free', highlight: false },
  { id: 'pro', name: 'Pro', price: '$19/mo', features: ['Unlimited documents', 'Unlimited questions', 'PDF, DOCX, TXT support', 'Priority AI responses'], cta: 'Get Pro', highlight: true },
  { id: 'business', name: 'Business', price: '$49/mo', features: ['Everything in Pro', 'API access', 'Priority support', 'Team collaboration (soon)'], cta: 'Get Business', highlight: false },
];

const USE_CASES = [
  { icon: '⚖️', title: 'Legal Teams', desc: 'Upload contracts and ask "What are the termination clauses?" instantly.' },
  { icon: '🏥', title: 'Healthcare', desc: 'Query research papers and clinical reports without reading every page.' },
  { icon: '📊', title: 'Finance', desc: 'Ask questions about annual reports, prospectuses, and financial statements.' },
  { icon: '🎓', title: 'Students', desc: 'Upload lecture notes and textbooks — get answers for your essays and exams.' },
  { icon: '🏢', title: 'HR & Compliance', desc: 'Search employee handbooks, policies, and compliance documents in seconds.' },
  { icon: '🔬', title: 'Research', desc: 'Upload academic papers and ask specific questions across multiple documents.' },
];

const FAQS = [
  { q: 'What file types does DocChat AI support?', a: 'DocChat AI supports PDF, DOCX (Microsoft Word), and TXT files. Support for more formats is coming soon.' },
  { q: 'How accurate are the answers?', a: 'DocChat AI only answers from the content of your uploaded document — it never makes things up. Answers are highly accurate for text-based documents.' },
  { q: 'Is my document data private?', a: 'Yes. Your documents are processed in real-time and never stored on our servers. Each session is completely private.' },
  { q: 'What AI model powers DocChat?', a: 'DocChat AI is powered by NVIDIA NIM — enterprise-grade AI infrastructure used by the world's leading companies.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. Cancel anytime from your Stripe billing portal. No contracts, no lock-in.' },
];

export default function Home() {
  const [view, setView] = useState('landing');
  const [plan, setPlan] = useState(null);
  const [file, setFile] = useState(null);
  const [docText, setDocText] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscribed') === 'true') {
      setPlan('pro');
      setView('chat');
    }
  }, []);

  const handleSubscribe = async (planId) => {
    if (planId === 'free') { setPlan('free'); setView('chat'); return; }
    setCheckingOut(planId);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
    else { alert('Error: ' + (data.error || 'Unknown error')); setCheckingOut(false); }
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); setUploading(true);
    const formData = new FormData();
    formData.append('file', f);
    const res = await fetch('/api/parse', { method: 'POST', body: formData });
    const data = await res.json();
    setDocText(data.text || '');
    setUploading(false);
    setMessages([{ role: 'assistant', content: `Document "${f.name}" loaded! Ask me anything about it.` }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !docText) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(''); setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, docText }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  if (view === 'chat') {
    return (
      <main className="min-h-screen flex flex-col items-center px-4 py-8" style={{background:'#0f0f0f'}}>
        <div className="w-full max-w-3xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{background:'#76b900'}}></div>
            <div>
              <h1 className="text-xl font-bold text-white">DocChat <span style={{color:'#76b900'}}>AI</span></h1>
              <p className="text-xs" style={{color:'#76b900'}}>{plan === 'pro' ? 'Pro Plan' : plan === 'business' ? 'Business Plan' : 'Starter'}</p>
            </div>
          </div>
          <button onClick={() => setView('landing')} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Plans</button>
        </div>
        <div className="w-full max-w-3xl mb-4">
          <div onClick={() => fileRef.current.click()} className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
            style={{borderColor: file ? '#76b900' : '#333', background: file ? '#0d1a00' : '#1a1a1a'}}>
            {uploading ? <p className="text-gray-400 text-sm">Parsing document...</p>
              : file ? <div><p style={{color:'#76b900'}} className="font-semibold text-sm">{file.name}</p><p className="text-gray-500 text-xs mt-1">Click to replace</p></div>
              : <div><p className="text-gray-300 font-medium text-sm">Click to upload your document</p><p className="text-gray-500 text-xs mt-1">PDF, DOCX, TXT supported</p></div>}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} className="hidden" />
          </div>
        </div>
        <div className="w-full max-w-3xl flex-1 rounded-xl overflow-hidden" style={{background:'#1a1a1a', minHeight:'380px'}}>
          <div className="p-4 space-y-4 overflow-y-auto" style={{maxHeight:'420px'}}>
            {messages.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">Upload a document to get started</p>
                <p className="text-sm mt-2">Then ask any question about its contents</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="rounded-2xl px-4 py-3 max-w-[80%] text-sm"
                  style={{background: m.role === 'user' ? '#76b900' : '#2a2a2a', color: m.role === 'user' ? '#000' : '#e5e5e5'}}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="rounded-2xl px-4 py-3 text-sm" style={{background:'#2a2a2a', color:'#76b900'}}>Thinking...</div></div>}
          </div>
          <div className="border-t p-4 flex gap-3" style={{borderColor:'#2a2a2a'}}>
            <input className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{background:'#2a2a2a', color:'#e5e5e5', border:'1px solid #333'}}
              placeholder={docText ? 'Ask a question about your document...' : 'Upload a document first'}
              value={input} disabled={!docText || loading}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()} />
            <button onClick={sendMessage} disabled={!docText || loading || !input.trim()}
              className="px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
              style={{background:'#76b900', color:'#000'}}>Send</button>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-6">Powered by NVIDIA NIM AI · Built with Next.js</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12" style={{background:'#0f0f0f'}}>

      {/* Hero */}
      <div className="text-center mb-16 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full" style={{background:'#76b900'}}></div>
          <h1 className="text-4xl font-bold text-white">DocChat <span style={{color:'#76b900'}}>AI</span></h1>
        </div>
        <h2 className="text-2xl text-gray-200 font-semibold mb-3">Chat with any PDF or document instantly</h2>
        <p className="text-gray-400 mb-6">Upload a PDF, DOCX or TXT — then ask questions in plain English and get accurate AI answers in seconds. No more scrolling through 100-page documents.</p>
        <button onClick={() => handleSubscribe('free')} className="px-8 py-4 rounded-xl font-bold text-lg transition-all" style={{background:'#76b900', color:'#000'}}>
          Try Free — No Credit Card Needed
        </button>
        <p className="text-gray-600 text-xs mt-3">Powered by NVIDIA NIM · Secure payments by Stripe</p>
      </div>

      {/* How it works */}
      <div className="w-full max-w-3xl mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-8">How it works</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { step:'1', title:'Upload your document', desc:'Drop any PDF, DOCX or TXT — up to 50MB' },
            { step:'2', title:'Ask a question', desc:'Type any question in plain English' },
            { step:'3', title:'Get an instant answer', desc:'AI answers directly from your document — no hallucinations' },
          ].map(s => (
            <div key={s.step} className="rounded-xl p-5" style={{background:'#1a1a1a', border:'1px solid #2a2a2a'}}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3 mx-auto" style={{background:'#76b900', color:'#000'}}>{s.step}</div>
              <p className="text-white font-semibold mb-1 text-sm">{s.title}</p>
              <p className="text-gray-500 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="w-full max-w-4xl mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-2">Who uses DocChat AI?</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Perfect for anyone who works with documents</p>
        <div className="grid grid-cols-3 gap-4">
          {USE_CASES.map(u => (
            <div key={u.title} className="rounded-xl p-4" style={{background:'#1a1a1a', border:'1px solid #2a2a2a'}}>
              <div className="text-2xl mb-2">{u.icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{u.title}</p>
              <p className="text-gray-500 text-xs">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="w-full max-w-4xl mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-2">Simple, transparent pricing</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Start free. Upgrade when you need more.</p>
        <div className="grid grid-cols-3 gap-6">
          {PLANS.map(p => (
            <div key={p.id} className="rounded-2xl p-6 flex flex-col"
              style={{background: p.highlight ? '#0d1a00' : '#1a1a1a', border: p.highlight ? '2px solid #76b900' : '1px solid #2a2a2a'}}>
              {p.highlight && <div className="text-xs font-bold mb-3 text-center py-1 px-3 rounded-full self-center" style={{background:'#76b900', color:'#000'}}>MOST POPULAR</div>}
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{p.name}</p>
              <p className="text-white font-bold text-3xl mb-4">{p.price}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                    <span style={{color:'#76b900'}}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(p.id)} disabled={checkingOut === p.id}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                style={{background: p.highlight ? '#76b900' : '#2a2a2a', color: p.highlight ? '#000' : '#e5e5e5', border: p.highlight ? 'none' : '1px solid #444'}}>
                {checkingOut === p.id ? 'Redirecting...' : p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="w-full max-w-2xl mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{background:'#1a1a1a', border:'1px solid #2a2a2a'}}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-white text-sm font-medium">
                {faq.q}
                <span style={{color:'#76b900'}}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-gray-400 text-sm">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-2xl text-center mb-12 rounded-2xl p-10" style={{background:'#0d1a00', border:'2px solid #76b900'}}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to stop scrolling through documents?</h2>
        <p className="text-gray-400 mb-6">Join thousands of professionals who use DocChat AI to work smarter.</p>
        <button onClick={() => handleSubscribe('free')} className="px-8 py-4 rounded-xl font-bold text-lg transition-all" style={{background:'#76b900', color:'#000'}}>
          Start for Free
        </button>
      </div>

      <p className="text-gray-600 text-xs">© 2026 DocChat AI · Powered by NVIDIA NIM · Secure payments by Stripe</p>
    </main>
  );
}