import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'DocChat AI API Documentation | DocChat AI', description: 'DocChat AI API reference. Integrate AI document analysis into your application with our REST API.' };
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/api-docs" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>API <span style={{color:'#84cc16'}}>Documentation</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>Integrate DocChat AI into your application — REST API with document parsing and AI chat endpoints</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>The DocChat AI API allows developers to embed AI-powered document analysis directly into their applications. Available on the Business plan. Authenticate with an API key, POST documents for parsing, and stream AI responses in real time.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Base URL</h2>
      <pre style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'8px',padding:'16px',color:'#84cc16',fontSize:'14px',overflowX:'auto'}}>https://docchat-saas.vercel.app/api</pre>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Endpoints</h2>
      <h3 style={{fontSize:'16px',fontWeight:'700',margin:'20px 0 8px',color:'#fff'}}>POST /api/parse</h3>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'12px'}}>Upload a document for text extraction. Supports PDF, DOCX, TXT, XLSX, CSV, Markdown, HTML, RTF, EPUB and ODT.</p>
      <pre style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'8px',padding:'16px',color:'#d1d5db',fontSize:'13px',overflowX:'auto'}}>POST /api/parse&#10;Content-Type: multipart/form-data&#10;&#10;file: [your document]&#10;&#10;Response: {"{"}  "text": "extracted document text..."  {"}"}</pre>
      <h3 style={{fontSize:'16px',fontWeight:'700',margin:'20px 0 8px',color:'#fff'}}>POST /api/chat</h3>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'12px'}}>Send messages with document context and receive AI responses via NVIDIA NIM.</p>
      <pre style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'8px',padding:'16px',color:'#d1d5db',fontSize:'13px',overflowX:'auto'}}>POST /api/chat&#10;Content-Type: application/json&#10;&#10;{"{"} "messages": [...], "context": "doc text", "model": "meta/llama-3.1-70b-instruct" {"}"}&#10;&#10;Response: {"{"}  "content": "AI response..."  {"}"}</pre>
      <p style={{color:'#9ca3af',marginTop:'24px',fontSize:'14px'}}>Full API access is available on the Business plan. Contact us to request your API key.</p>
      <a href="mailto:support.docchatai@proton.me" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'16px'}}>Request API Access</a>
    </main>
      </div>
  );
}