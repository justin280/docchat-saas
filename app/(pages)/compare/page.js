import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'DocChat AI vs ChatPDF vs ChatDOC vs Humata | DocChat AI', description: 'Compare the best AI document chat tools. DocChat AI beats ChatPDF, ChatDOC and Humata on features, price and flexibility.',
  alternates: { canonical: '/compare' }
};
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/compare" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>DocChat AI vs <span style={{color:'#84cc16'}}>ChatPDF vs ChatDOC vs Humata</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>The most complete AI document chat comparison — 2026</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>DocChat AI is the only platform combining chat with multiple PDFs, an AI Excel analyzer, contract review AI, and three AI models in one free product powered by NVIDIA NIM. ChatPDF limits you to one document and one AI model. ChatDOC and Humata lack specialized Excel analysis, follow-up prompts, document comparison, and advanced RAG architecture.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Why professionals choose DocChat AI</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Lawyers need contract review AI that understands legal language. Financial analysts need an AI Excel analyzer that handles multi-sheet workbooks. Researchers need to chat with multiple PDFs to cross-reference studies. DocChat AI delivers all three — free to start, no credit card needed.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Key advantages over ChatPDF, ChatDOC and Humata</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>Chat with up to 5 PDFs simultaneously (ChatPDF: 1)</li>
        <li>15 free documents/month (ChatPDF: 3, Humata: 3)</li>
        <li>3 AI models: Llama 3.1, Mistral Large, DeepSeek R1</li>
        <li>AI Excel and CSV analyzer with deep table analysis</li>
        <li>Contract review AI with clause and risk extraction</li>
        <li>Document comparison mode</li>
        <li>Follow-up prompt suggestions powered by advanced RAG</li>
        <li>20% annual discount available</li>
      </ul>
      <a href="/" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Try DocChat AI Free</a>
    </main>
      </div>
  );

      {/* Detailed Comparison Pages */}
      <div style={{maxWidth:'900px', margin:'0 auto 60px', padding:'0 24px'}}>
        <h2 style={{fontSize:'1.4rem', fontWeight:'800', color:'#fff', marginBottom:'20px', textAlign:'center'}}>
          Detailed Tool Comparisons
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'16px'}}>
          {[
            {href:'/compare/chatpdf-vs-docchat', title:'DocChat AI vs ChatPDF', desc:'11 AI models vs 1 · Zero retention · Multi-format support'},
            {href:'/compare/humata-vs-docchat', title:'DocChat AI vs Humata', desc:'Open-source models · HIPAA-ready · Excel & CSV analysis'},
          ].map(({href,title,desc}) => (
            <a key={href} href={href} style={{display:'block', background:'#111', border:'1px solid #222', borderRadius:'12px', padding:'20px', textDecoration:'none', color:'inherit', transition:'border-color 0.2s'}}>
              <div style={{fontWeight:'700', color:'#fff', marginBottom:'8px'}}>{title}</div>
              <div style={{color:'#6b7280', fontSize:'0.85rem'}}>{desc}</div>
              <div style={{color:'#84cc16', fontSize:'0.85rem', marginTop:'8px', fontWeight:'600'}}>Read comparison &#8594;</div>
            </a>
          ))}
        </div>
      </div>
}