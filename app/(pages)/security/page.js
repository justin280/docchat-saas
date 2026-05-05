export const metadata = {
  title: 'Security & Compliance | DocChat AI — SOC2, HIPAA, Zero Retention',
  description: 'DocChat AI security architecture — SOC2-aligned, HIPAA-ready, zero document retention. Your documents are processed in-session only and never stored.',
  keywords: 'DocChat AI security, HIPAA compliant AI, SOC2 document AI, zero retention AI, secure document chat',
};

export default function SecurityPage() {
  return (
    <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      {/* Hero */}
      <section style={{padding:'80px 20px 60px',maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
        <div style={{display:'inline-block',backgroundColor:'#14532d',color:'#86efac',padding:'6px 16px',borderRadius:'999px',fontSize:'13px',fontWeight:'600',marginBottom:'20px',letterSpacing:'0.05em'}}>ENTERPRISE SECURITY</div>
        <h1 style={{fontSize:'clamp(32px,5vw,52px)',fontWeight:'800',lineHeight:'1.1',marginBottom:'20px'}}>
          Security {'&'} Compliance
        </h1>
        <p style={{fontSize:'18px',color:'#9ca3af',lineHeight:'1.7',maxWidth:'680px',margin:'0 auto'}}>
          DocChat AI is built with a zero-retention architecture — documents are processed in-session only and never written to any persistent storage. Your data stays yours.
        </p>
      </section>

      {/* Compliance badges */}
      <section style={{padding:'0 20px 60px',maxWidth:'900px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'24px'}}>
          {/* SOC2 */}
          <div style={{backgroundColor:'#111827',border:'1px solid #1f2937',borderRadius:'16px',padding:'32px'}}>
            <div style={{width:'48px',height:'48px',backgroundColor:'#1e3a5f',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px',fontSize:'24px'}}>🔒</div>
            <h2 style={{fontSize:'20px',fontWeight:'700',marginBottom:'12px',color:'#60a5fa'}}>SOC2 Compliance</h2>
            <p style={{color:'#9ca3af',lineHeight:'1.7',fontSize:'15px'}}>Our architecture aligns with SOC2 Type II Trust Service Criteria covering Security, Availability and Confidentiality. Enterprise customers can request our security documentation and architecture review.</p>
          </div>
          {/* HIPAA */}
          <div style={{backgroundColor:'#111827',border:'1px solid #1f2937',borderRadius:'16px',padding:'32px'}}>
            <div style={{width:'48px',height:'48px',backgroundColor:'#1a3a2a',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px',fontSize:'24px'}}>🏥</div>
            <h2 style={{fontSize:'20px',fontWeight:'700',marginBottom:'12px',color:'#34d399'}}>HIPAA Compliance</h2>
            <p style={{color:'#9ca3af',lineHeight:'1.7',fontSize:'15px'}}>Business plan customers can process documents containing PHI under our HIPAA-ready configuration. Business Associate Agreements (BAAs) are available. No PHI is retained after session end. All API communications are TLS-encrypted.</p>
          </div>
        </div>
      </section>

      {/* Security summary */}
      <section style={{padding:'0 20px 80px',maxWidth:'900px',margin:'0 auto'}}>
        <h2 style={{fontSize:'28px',fontWeight:'700',marginBottom:'32px',textAlign:'center'}}>Security Summary</h2>
        <div style={{backgroundColor:'#111827',border:'1px solid #1f2937',borderRadius:'16px',padding:'40px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px'}}>
            {[
              {icon:'🗑️', title:'Zero document retention', desc:'Files are deleted immediately after your session ends — nothing is ever written to persistent storage.'},
              {icon:'🔐', title:'TLS encryption', desc:'All API communications are encrypted in transit using TLS 1.2+. Data is never transmitted unencrypted.'},
              {icon:'✅', title:'SOC2-aligned controls', desc:'Our security controls align with SOC2 Type II Trust Service Criteria for Security, Availability and Confidentiality.'},
              {icon:'🏥', title:'HIPAA-ready', desc:'Business plan includes HIPAA-ready configuration for processing documents containing Protected Health Information.'},
              {icon:'📄', title:'BAAs available', desc:'Business Associate Agreements are available for healthcare organisations on the Business plan.'},
              {icon:'🔑', title:'SSO support', desc:'Single Sign-On via Google and Microsoft available on Business plan for seamless enterprise authentication.'},
              {icon:'🚫', title:'No third-party data sharing', desc:'Your document content is never shared with third parties. NVIDIA NIM API calls contain only the text needed for analysis.'},
            ].map((item,i) => (
              <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
                <div style={{width:'40px',height:'40px',backgroundColor:'#1f2937',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'20px'}}>{item.icon}</div>
                <div>
                  <div style={{fontWeight:'600',marginBottom:'4px',color:'#f9fafb'}}>{item.title}</div>
                  <div style={{color:'#9ca3af',fontSize:'14px',lineHeight:'1.6'}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'60px 20px 80px',textAlign:'center',borderTop:'1px solid #1f2937'}}>
        <h2 style={{fontSize:'28px',fontWeight:'700',marginBottom:'12px'}}>Need enterprise security documentation?</h2>
        <p style={{color:'#9ca3af',marginBottom:'28px',fontSize:'16px'}}>Contact our team for architecture reviews, BAAs and custom security assessments.</p>
        <a href="mailto:support.docchatai@proton.me?subject=Enterprise%20Security%20Documentation" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 32px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',textDecoration:'none'}}>Contact Security Team</a>
      </section>
    </main>
  );
}