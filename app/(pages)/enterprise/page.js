import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';
export const metadata = {
    title: 'Enterprise Document AI | DocChat AI',
    description: 'DocChat AI for enterprise teams. Multi-model AI document analysis with zero retention architecture.',
    alternates: { canonical: '/enterprise' }
};
export default function Page() {
    return (
          <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif',paddingBottom:'70px'}}>
      <NavBar activePath="/enterprise" />
        <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
        <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
        <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>DocChat AI for <span style={{color:'#84cc16'}}>Enterprise</span></h1>
          <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>Scalable AI document analysis for teams — powered by NVIDIA NIM</h2>
        <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>DocChat AI processes documents in-session only — nothing is ever written to a database or persistent storage. All API calls use TLS-encrypted channels. Your document content is never shared with third parties.</p>
        <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Features</h3>
        <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
          <li>11 AI models — Llama 3.3, DeepSeek V3, Mistral, Gemma 3, Phi-4 and more</li>
          <li>Multi-document analysis — chat across up to 5 documents simultaneously</li>
          <li>Zero retention architecture — documents never stored after session</li>
          <li>Excel and spreadsheet analysis with multi-sheet support</li>
          <li>Export chat history as .txt</li>
          <li>Priority support (Business plan)</li>
  </ul>
        <p style={{color:'#9ca3af',lineHeight:'1.8',marginBottom:'20px',marginTop:'24px',fontSize:'14px'}}>Enterprise features including SSO, admin dashboard and team workspaces are on the roadmap. Contact us to discuss your requirements.</p>
        <a href="mailto:support.docchatai@proton.me" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'8px'}}>Contact Us</a>
  </main>
      <StickyBar />
  </div>
  );
}
