import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';

export const metadata = {
    title: 'API Access (Coming Q3 2026) | DocChat AI',
    description: 'DocChat AI REST API is launching Q3 2026. Join the waitlist for early access to embed AI document analysis in your application.',
    alternates: { canonical: '/api-docs' }
};

export default function Page() {
    return (
          <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif',paddingBottom:'70px'}}>
      <NavBar activePath="/api-docs" />
        <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
        <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
        <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>API Access <span style={{color:'#84cc16'}}>Coming Q3 2026</span></h1>
          <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>The DocChat AI REST API is launching Q3 2026 — join the waitlist for early access</h2>
        <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>The DocChat AI API will let developers embed AI-powered document analysis directly into their applications. Authenticate with an API key, POST documents for parsing, and stream AI responses in real time — all powered by NVIDIA NIM.</p>
        <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>What's coming</h2>
          <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
          <li>REST endpoints for document parsing and chat</li>
          <li>Webhook events for async processing</li>
          <li>API key management and usage analytics</li>
          <li>11 AI models (Llama, Mistral, DeepSeek, Gemma, Phi-4 and more)</li>
          <li>Available on the Business plan</li>
  </ul>
        <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Join the waitlist</h2>
        <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'24px'}}>Email us with your use case and we'll notify you the moment the API goes live.</p>
          <a href="mailto:support.docchatai@proton.me?subject=API%20Waitlist" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none'}}>Join API Waitlist</a>
  </main>
      <StickyBar />
  </div>
  );
}
