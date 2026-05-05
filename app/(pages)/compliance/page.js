import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'SOC2, HIPAA and Security Compliance | DocChat AI', description: 'DocChat AI security and compliance information. SOC2-aligned, HIPAA-ready, zero data retention, encrypted communications.' };
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/compliance" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>Security & <span style={{color:'#84cc16'}}>Compliance</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>DocChat AI security architecture — SOC2-aligned, HIPAA-ready, zero document retention</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>We take the security of your documents seriously. DocChat AI is built with a zero-retention architecture — documents are processed in-session only and never written to any persistent storage. Your data stays yours.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>SOC2 Compliance</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Our architecture aligns with SOC2 Type II Trust Service Criteria covering Security, Availability and Confidentiality. Enterprise customers can request our security documentation and architecture review.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>HIPAA Compliance</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Business plan customers can process documents containing PHI under our HIPAA-ready configuration. Business Associate Agreements (BAAs) are available. No PHI is retained after session end. All API communications are TLS-encrypted.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Security summary</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>Zero document retention — files deleted after session</li>
        <li>TLS encryption for all API communications</li>
        <li>SOC2-aligned security controls</li>
        <li>HIPAA-ready (Business plan)</li>
        <li>BAAs available for healthcare organisations</li>
        <li>SSO via Google and Microsoft (Business plan)</li>
        <li>No third-party data sharing</li>
      </ul>
      <a href="mailto:support.docchatai@proton.me" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Request Security Documentation</a>
    </main>
      </div>
  );
}