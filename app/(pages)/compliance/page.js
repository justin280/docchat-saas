import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';
export const metadata = {
    title: 'Security & Privacy | DocChat AI',
    description: 'DocChat AI processes documents in-session only. Zero retention, TLS encryption, no third-party data sharing.',
    alternates: { canonical: '/compliance' }
};
export default function Page() {
    return (
          <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif',paddingBottom:'70px'}}>
      <NavBar activePath="/compliance" />
        <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
        <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
        <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>Security & <span style={{color:'#84cc16'}}>Privacy</span></h1>
          <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>How DocChat AI handles your documents</h2>
        <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>We take the security of your documents seriously. DocChat AI is built with a zero-retention architecture — documents are processed in-session only and never written to any persistent storage. Your data stays yours.</p>
        <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>How your data is handled</h2>
        <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
          <li>Zero document retention — files are never written to disk or database</li>
          <li>All processing happens in-memory for the duration of your session only</li>
          <li>TLS encryption for all communications between your browser and our servers</li>
          <li>Your document content is never shared with or sold to any third parties</li>
          <li>No user accounts means no personal data stored on our servers</li>
  </ul>
        <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Questions?</h2>
        <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>If you have security questions or concerns, get in touch directly.</p>
        <a href="mailto:support.docchatai@proton.me" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Contact Us</a>
  </main>
      <StickyBar />
  </div>
  );
}
