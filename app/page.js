'use client';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [file, setFile] = useState(null);
  const [docText, setDocText] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', f);
    const res = await fetch('/api/parse', { method: 'POST', body: formData });
    const data = await res.json();
    setDocText(data.text || '');
    setUploading(false);
    setMessages([{ role: 'assistant', content: 'Document loaded! Ask me anything about it.' }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !docText) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, docText }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8" style={{background:'#0f0f0f'}}>
      {/* Header */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full" style={{background:'#76b900'}}></div>
          <h1 className="text-2xl font-bold text-white">DocChat <span style={{color:'#76b900'}}>AI</span></h1>
        </div>
        <p className="text-gray-400 text-sm">Powered by NVIDIA NIM · Upload any document and ask questions instantly</p>
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-3xl mb-6">
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{borderColor: file ? '#76b900' : '#333', background: file ? '#0d1a00' : '#1a1a1a'}}
        >
          {uploading ? (
            <p className="text-gray-400">Parsing document...</p>
          ) : file ? (
            <div>
              <p style={{color:'#76b900'}} className="font-semibold">{file.name}</p>
              <p className="text-gray-500 text-sm mt-1">Click to replace</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 font-medium">Drop your document here</p>
              <p className="text-gray-500 text-sm mt-1">Supports PDF, DOCX, TXT</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} className="hidden" />
        </div>
      </div>

      {/* Chat Window */}
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
              <div
                className="rounded-2xl px-4 py-3 max-w-[80%] text-sm"
                style={{
                  background: m.role === 'user' ? '#76b900' : '#2a2a2a',
                  color: m.role === 'user' ? '#000' : '#e5e5e5'
                }}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 text-sm" style={{background:'#2a2a2a', color:'#76b900'}}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4 flex gap-3" style={{borderColor:'#2a2a2a'}}>
          <input
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{background:'#2a2a2a', color:'#e5e5e5', border:'1px solid #333'}}
            placeholder={docText ? 'Ask a question about your document...' : 'Upload a document first'}
            value={input}
            disabled={!docText || loading}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!docText || loading || !input.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
            style={{background:'#76b900', color:'#000'}}
          >
            Send
          </button>
        </div>
      </div>

      {/* Pricing Teaser */}
      <div className="w-full max-w-3xl mt-8 grid grid-cols-3 gap-4">
        {[
          { name:'Starter', price:'Free', features:'5 docs/month, 50 questions' },
          { name:'Pro', price:'$19/mo', features:'Unlimited docs & questions' },
          { name:'Business', price:'$49/mo', features:'API access, priority support' },
        ].map(plan => (
          <div key={plan.name} className="rounded-xl p-4 text-center" style={{background:'#1a1a1a', border:'1px solid #2a2a2a'}}>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{plan.name}</p>
            <p className="text-white font-bold text-xl mb-2">{plan.price}</p>
            <p className="text-gray-500 text-xs">{plan.features}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-6">Powered by NVIDIA NIM AI · Built with Next.js</p>
    </main>
  );
}