import Link from 'next/link';

export const metadata = {
  title: 'Security & Compliance | DocChat AI — SOC2, HIPAA, Zero Retention',
  description: 'DocChat AI security architecture — SOC2-aligned, HIPAA-ready, zero document retention. Your documents are processed in-session only and never stored.',
  keywords: 'DocChat AI security, SOC2 compliance, HIPAA compliance, zero retention, document security, data privacy',
};

const NAV_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/healthcare', label: 'Healthcare' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/contact', label: 'Contact' },
  { slug: '/security', label: 'Security' },
];

export default function SecurityPage() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      {/* Nav */}
      <nav style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 20px',borderBottom:'1px solid #111',backgroundColor:'#0a0a0a',position:'sticky',top:0,zIndex:100,flexWrap:'wrap'}}>
        <Link href="/" style={{fontWeight:'700',color:'#84cc16',marginRight:'auto',fontSize:'16px',textDecoration:'none'}}>DocChat AI</Link>
        {NAV_PAGES.map(p=>(
          <Link key={p.slug} href={p.slug} style={{color:'#9ca3af',fontSize:'13px',textDecoration:'none'}}>{p.label}</Link>
        ))}
        <Link href="/" style={{backgroundColor:'#84cc16',color:'#000',border:'none',borderRadius:'8px',padding:'8px 18px',fontSize:'13px',fontWeight:'700',textDecoration:'none'}}>Try Free</Link>
      </nav>

      {/* Hero */}
      <section style={{textAlign:'center',padding:'80px 20px 60px',maxWidth:'900px',margin:'0 auto'}}>
        <span style={{backgroundColor:'#84cc16',color:'#000',padding:'6px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',display:'inline-block',marginBottom:'24px'}}>Enterprise Security</span>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:'900',margin:'0 0 24px',lineHeight:1.1}}>Security &amp; Compliance</h1>
        <p style={{fontSize:'18px',color:'#9ca3af',maxWidth:'640px',margin:'0 auto',lineHeight:1.7}}>
          DocChat AI is built with a zero-retention architecture — documents are processed in-session only and never written to any persistent storage. Your data stays yours.
        </p>
      </section>

      {/* Cards */}
      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'0 20px 60px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px'}}>

        {/* SOC2 */}
        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{width:'48px',height:'48px',backgroundColor:'#1a2a1a',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'24px'}}>
            🔒
          </div>
          <h2 style={{color:'#84cc16',fontSize:'22px',fontWeight:'700',marginBottom:'12px'}}>SOC2 Compliance</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>
            Our architecture aligns with SOC2 Type II Trust Service Criteria covering Security, Availability and Confidentiality. Enterprise customers can request our security documentation and architecture review.
          </p>
        </div>

        {/* HIPAA */}
        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{width:'48px',height:'48px',backgroundColor:'#1a2a1a',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'24px'}}>
            🏥
          </div>
          <h2 style={{color:'#84cc16',fontSize:'22px',fontWeight:'700',marginBottom:'12px'}}>HIPAA Compliance</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>
            Business plan customers can process documents containing PHI under our HIPAA-ready configuration. Business Associate Agreements (BAAs) are available. No PHI is retained after session end. All API calls are encrypted in transit.
          </p>
        </div>
      </section>

      {/* Security Summary */}
      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'0 20px 80px'}}>
        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'40px'}}>
          <h2 style={{fontSize:'28px',fontWeight:'800',marginBottom:'32px',textAlign:'center'}}>Security at a Glance</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px'}}>
            {[
              {icon:'🚫', title:'Zero document retention', desc:'Documents are never written to disk or database. Session-only processing.'},
              {icon:'🔐', title:'TLS encryption in transit', desc:'All data transfer between your browser and our servers is encrypted.'},
              {icon:'✅', title:'SOC2-aligned architecture', desc:'Controls mapped to SOC2 Trust Service Criteria. Audit docs available on request.'},
              {icon:'🏥', title:'HIPAA-ready (Business plan)', desc:'PHI processing with BAA available for Business plan customers.'},
              {icon:'📝', title:'BAAs available', desc:'Business Associate Agreements provided for healthcare and covered entities.'},
              {icon:'🔑', title:'SSO via Google & Microsoft', desc:'Enterprise SSO available on Business plan. Secure OAuth 2.0 authentication.'},
              {icon:'🛡️', title:'No third-party data sharing', desc:'Your document content is never shared with or sold to any third parties.'},
            ].map((item, i) => (
              <div key={i} style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
                <span style={{fontSize:'24px',flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontWeight:'700',marginBottom:'6px',fontSize:'15px'}}>{item.title}</div>
                  <div style={{color:'#9ca3af',fontSize:'14px',lineHeight:1.6}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      
      {/* Security Documents CTA */}
      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'0 20px 40px'}}>
        <div style={{background:'linear-gradient(135deg,#111 0%,#1a2a0a 100%)',border:'1px solid #84cc16',borderRadius:'16px',padding:'40px',textAlign:'center'}}>
          <span style={{fontSize:'36px',display:'block',marginBottom:'16px'}}>&#128196;</span>
          <h2 style={{fontSize:'26px',fontWeight:'800',margin:'0 0 12px'}}>Enterprise Security Documentation</h2>
          <p style={{color:'#9ca3af',fontSize:'15px',margin:'0 0 8px',lineHeight:1.7,maxWidth:'560px',display:'inline-block'}}>
            Download our full enterprise security pack: Architecture Review, BAA template, Security Assessment questionnaire, CAIQ mapping, and Incident Response plan.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginTop:'24px'}}>
            <Link href="/security/documents" style={{backgroundColor:'#84cc16',color:'#000',padding:'13px 32px',borderRadius:'8px',fontWeight:'700',fontSize:'15px',textDecoration:'none',display:'inline-block'}}>View &amp; Download Documents</Link>
            <Link href="/contact" style={{backgroundColor:'transparent',color:'#84cc16',padding:'13px 32px',borderRadius:'8px',fontWeight:'700',fontSize:'15px',textDecoration:'none',display:'inline-block',border:'1px solid #84cc16'}}>Request Signed BAA</Link>
          </div>
          <div style={{display:'flex',gap:'24px',justifyContent:'center',flexWrap:'wrap',marginTop:'20px'}}>
            {['Enterprise Security Overview','Architecture Review Package','BAA + Security Assessment'].map((d,i) => (
              <span key={i} style={{color:'#6b7280',fontSize:'12px',display:'flex',alignItems:'center',gap:'5px'}}>
                <span style={{color:'#84cc16'}}>&#10003;</span>{d}
              </span>
            ))}
          </div>
        </div>
      </section>

<section style={{textAlign:'center',padding:'0 20px 100px'}}>
        <p style={{color:'#9ca3af',marginBottom:'24px',fontSize:'16px'}}>Have a security question or need enterprise documentation?</p>
        <Link href="/contact" style={{backgroundColor:'#84cc16',color:'#000',padding:'14px 36px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',textDecoration:'none',display:'inline-block'}}>Contact Security Team</Link>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',textAlign:'center',color:'#6b7280',fontSize:'13px'}}>
        <p style={{margin:0}}>© {new Date().getFullYear()} DocChat AI — <Link href="/contact" style={{color:'#9ca3af',textDecoration:'none'}}>Contact</Link> · <Link href="/" style={{color:'#9ca3af',textDecoration:'none'}}>Home</Link></p>
      </footer>
    </div>
  );
}
