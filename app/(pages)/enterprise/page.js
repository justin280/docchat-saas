import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'Enterprise Document AI — SOC2, SSO, Admin Controls | DocChat AI', description: 'DocChat AI for enterprise teams. SOC2-ready, SSO (Google/Microsoft), admin dashboard, API access and team workspaces.' };
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/enterprise" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>DocChat AI for <span style={{color:'#84cc16'}}>Enterprise</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>Secure, scalable AI document analysis for teams — with SOC2 readiness, SSO and admin controls</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Enterprise security and compliance are built into DocChat AI from the ground up. Our Business plan includes HIPAA-ready processing, SOC2-aligned architecture, SSO via Google and Microsoft, and a team admin dashboard — giving IT teams the controls they need while giving employees the productivity they want.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Enterprise Security Compliance</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Documents are processed in-session only — never persisted to any database. All API calls use encrypted channels. Our architecture aligns with SOC2 Type II controls covering availability, confidentiality and security. HIPAA Business Associate Agreements are available for healthcare organisations on the Business plan.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Enterprise features</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>SSO — Google Workspace and Microsoft Azure AD</li>
        <li>Admin dashboard — user management and usage controls</li>
        <li>API access with rate limits and key management</li>
        <li>Team workspaces with shared document libraries (Q3 2026)</li>
        <li>SOC2-aligned architecture</li>
        <li>HIPAA-ready data processing</li>
        <li>Priority support with SLA</li>
        <li>Custom deployment options available</li>
      </ul>
      <a href="mailto:support.docchatai@proton.me" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Contact Enterprise Sales</a>
    </main>
      </div>
  );
}