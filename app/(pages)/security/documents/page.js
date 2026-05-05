import Link from 'next/link';

export const metadata = {
  title: 'Security Documents | DocChat AI — Enterprise Security Pack',
  description: 'Download DocChat AI enterprise security documentation: Security Overview, Architecture Review Package, BAA & Security Assessment.',
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

const DOCS = [
  {
    id: 'overview',
    title: 'Enterprise Security Overview',
    subtitle: 'Core security principles, zero-retention architecture, compliance position',
    badge: 'START HERE',
    badgeColor: '#84cc16',
    badgeText: '#000',
    icon: '\uD83D\uDEE1\uFE0F',
    file: '/docs/docchat-enterprise-security-overview.pdf',
    filename: 'docchat-enterprise-security-overview.pdf',
    sections: ['Zero-Retention Architecture', 'Encryption & Key Management', 'IAM', 'Data Handling & Privacy', 'SOC2 & HIPAA Position', 'Subprocessors', 'Incident Response', 'Security Assertions'],
  },
  {
    id: 'architecture',
    title: 'Architecture Review Package',
    subtitle: 'System boundaries, data flow, SOC2 controls mapping, threat model',
    badge: 'SOC2 AUDITORS',
    badgeColor: '#1d4ed8',
    badgeText: '#fff',
    icon: '\uD83C\uDFD7\uFE0F',
    file: '/docs/docchat-architecture-review-package.pdf',
    filename: 'docchat-architecture-review-package.pdf',
    sections: ['System Boundary Definition', 'Precise Data Flow', 'Architecture Diagram', 'SOC2 Controls Mapping', 'Threat Model', 'Logging Policy', 'Subprocessor Model'],
  },
  {
    id: 'baa',
    title: 'BAA + Security Assessment + CAIQ',
    subtitle: 'Business Associate Agreement template, vendor questionnaire, CAIQ mapping, IR plan',
    badge: 'ENTERPRISE',
    badgeColor: '#7c3aed',
    badgeText: '#fff',
    icon: '\uD83D\uDCCB',
    file: '/docs/docchat-baa-security-assessment.pdf',
    filename: 'docchat-baa-security-assessment.pdf',
    sections: ['BAA Template (HIPAA)', 'Security Assessment Questionnaire', 'CAIQ Targeted Mapping', 'Incident Response Plan', 'Security Assertions & Proof Pack'],
  },
];

export default function SecurityDocumentsPage() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      {/* Nav */}
      <nav style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 20px',borderBottom:'1px solid #111',backgroundColor:'#0a0a0a',position:'sticky',top:0,zIndex:100,flexWrap:'wrap'}}>
        <Link href="/" style={{fontWeight:'700',color:'#84cc16',marginRight:'auto',fontSize:'16px',textDecoration:'none'}}>DocChat AI</Link>
        {NAV_PAGES.map(p=>(
          <Link key={p.slug} href={p.slug} style={{color:'#9ca3af',fontSize:'13px',textDecoration:'none'}}>{p.label}</Link>
        ))}
        <Link href="/" style={{backgroundColor:'#84cc16',color:'#000',borderRadius:'8px',padding:'8px 18px',fontSize:'13px',fontWeight:'700',textDecoration:'none'}}>Try Free</Link>
      </nav>

      {/* Hero */}
      <section style={{textAlign:'center',padding:'64px 20px 48px',maxWidth:'860px',margin:'0 auto'}}>
        <Link href="/security" style={{color:'#9ca3af',fontSize:'13px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'6px',marginBottom:'20px'}}>
          \u2190 Back to Security
        </Link>
        <span style={{backgroundColor:'#84cc16',color:'#000',padding:'5px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',display:'block',marginBottom:'20px'}}>Enterprise Security Pack</span>
        <h1 style={{fontSize:'clamp(28px,5vw,52px)',fontWeight:'900',margin:'0 0 16px',lineHeight:1.1}}>Security Documents</h1>
        <p style={{color:'#9ca3af',fontSize:'16px',maxWidth:'580px',margin:'0 auto',lineHeight:1.7}}>
          Professional security documentation for enterprise customers, procurement teams, and SOC2 auditors. All documents are free to download.
        </p>
      </section>

      {/* Document Cards */}
      <section style={{maxWidth:'1100px',margin:'0 auto',padding:'0 20px 80px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'24px'}}>
        {DOCS.map(doc => (
          <div key={doc.id} style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',overflow:'hidden',display:'flex',flexDirection:'column'}}>
            {/* Card header */}
            <div style={{padding:'28px 28px 20px',borderBottom:'1px solid #1a1a1a'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'16px'}}>
                <span style={{fontSize:'32px'}}>{doc.icon}</span>
                <span style={{backgroundColor:doc.badgeColor,color:doc.badgeText,padding:'3px 10px',borderRadius:'12px',fontSize:'10px',fontWeight:'700',letterSpacing:'0.5px'}}>{doc.badge}</span>
              </div>
              <h2 style={{fontSize:'18px',fontWeight:'800',margin:'0 0 8px',lineHeight:1.2}}>{doc.title}</h2>
              <p style={{color:'#9ca3af',fontSize:'13px',margin:0,lineHeight:1.6}}>{doc.subtitle}</p>
            </div>
            
            {/* Sections list */}
            <div style={{padding:'20px 28px',flex:1}}>
              <p style={{color:'#6b7280',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',margin:'0 0 12px'}}>COVERS</p>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'8px'}}>
                {doc.sections.map((s,i) => (
                  <li key={i} style={{display:'flex',alignItems:'center',gap:'8px',color:'#d1d5db',fontSize:'13px'}}>
                    <span style={{color:'#84cc16',fontSize:'10px',flexShrink:0}}>\u2713</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Actions */}
            <div style={{padding:'20px 28px',borderTop:'1px solid #1a1a1a',display:'flex',gap:'12px'}}>
              <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{flex:1,backgroundColor:'#111',border:'1px solid #333',color:'#9ca3af',padding:'10px 0',borderRadius:'8px',fontSize:'13px',fontWeight:'600',textDecoration:'none',textAlign:'center',display:'block'}}>
                View PDF
              </a>
              <a href={doc.file} download={doc.filename} style={{flex:1,backgroundColor:'#84cc16',color:'#000',padding:'10px 0',borderRadius:'8px',fontSize:'13px',fontWeight:'700',textDecoration:'none',textAlign:'center',display:'block'}}>
                Download
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Note */}
      <section style={{maxWidth:'700px',margin:'0 auto 80px',padding:'0 20px',textAlign:'center'}}>
        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'12px',padding:'24px'}}>
          <p style={{color:'#9ca3af',fontSize:'14px',margin:'0 0 4px',lineHeight:1.7}}>
            <strong style={{color:'#fff'}}>Need signed BAA, custom security assessment, or architecture review?</strong>
          </p>
          <p style={{color:'#6b7280',fontSize:'13px',margin:'0 0 16px',lineHeight:1.6}}>
            These templates are ready to use. For executed agreements or bespoke documentation, contact the security team.
          </p>
          <Link href="/contact" style={{backgroundColor:'#84cc16',color:'#000',padding:'10px 28px',borderRadius:'8px',fontWeight:'700',fontSize:'14px',textDecoration:'none',display:'inline-block'}}>Contact Security Team</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',textAlign:'center',color:'#6b7280',fontSize:'13px'}}>
        <p style={{margin:0}}>{String.fromCharCode(169)} {new Date().getFullYear()} DocChat AI \u2014 <Link href="/security" style={{color:'#9ca3af',textDecoration:'none'}}>Security</Link> \u00B7 <Link href="/contact" style={{color:'#9ca3af',textDecoration:'none'}}>Contact</Link> \u00B7 <Link href="/" style={{color:'#9ca3af',textDecoration:'none'}}>Home</Link></p>
      </footer>
    </div>
  );
}
