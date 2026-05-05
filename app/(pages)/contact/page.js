import NavBar from '@/app/components/NavBar';
export const metadata = {
  title: 'Contact Us | DocChat AI',
  description: 'Get in touch with DocChat AI. Support, business opportunities, collaborations and partnerships — we would love to hear from you.',
};

export default function ContactPage() {
  const s = {
    page: { minHeight:'100vh', backgroundColor:'#0a0a0a', color:'#fff', fontFamily:'system-ui,sans-serif' },
    nav: { display:'flex', alignItems:'center', gap:'16px', padding:'14px 20px', borderBottom:'1px solid #111', backgroundColor:'#0a0a0a' },
    content: { maxWidth:'900px', margin:'0 auto', padding:'60px 20px' },
    h1: { fontSize:'clamp(28px,4vw,44px)', fontWeight:'700', marginBottom:'12px' },
    green: { color:'#84cc16' },
    subtitle: { color:'#9ca3af', fontSize:'16px', lineHeight:'1.7', marginBottom:'48px', maxWidth:'600px' },
    grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'24px', marginBottom:'48px' },
    card: { backgroundColor:'#111', border:'1px solid #222', borderRadius:'16px', padding:'28px' },
    cardGreen: { backgroundColor:'#0f1f00', border:'1px solid #84cc16', borderRadius:'16px', padding:'28px' },
    cardIcon: { fontSize:'36px', marginBottom:'12px' },
    cardTitle: { fontWeight:'700', fontSize:'18px', marginBottom:'8px' },
    cardDesc: { color:'#9ca3af', fontSize:'14px', lineHeight:'1.7', marginBottom:'16px' },
    link: { color:'#84cc16', textDecoration:'none', fontWeight:'600', fontSize:'14px', display:'inline-flex', alignItems:'center', gap:'6px' },
    divider: { borderTop:'1px solid #1a1a1a', margin:'48px 0' },
    socialGrid: { display:'flex', gap:'16px', flexWrap:'wrap', marginTop:'16px' },
    socialBtn: { display:'inline-flex', alignItems:'center', gap:'8px', backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'10px 18px', color:'#d1d5db', textDecoration:'none', fontSize:'14px', fontWeight:'500' },
    h2: { fontSize:'22px', fontWeight:'700', marginBottom:'8px' },
    h2sub: { color:'#9ca3af', fontSize:'14px', marginBottom:'24px' },
    emailHighlight: { backgroundColor:'#1a1a1a', border:'1px solid #333', borderRadius:'8px', padding:'12px 16px', fontSize:'14px', color:'#84cc16', fontFamily:'monospace', display:'inline-block', marginTop:'8px' },
  };

  return (
    <div style={s.page}>
            <NavBar activePath="/contact" />


      <div style={s.content}>
        <h1 style={s.h1}>Get in <span style={s.green}>Touch</span></h1>
        <p style={s.subtitle}>We are a small, focused team building AI-powered document tools. Whether you need support, want to explore a business opportunity, or are interested in collaborating — we would love to hear from you.</p>

        {/* SUPPORT */}
        <div style={s.grid}>
          <div style={s.cardGreen}>
            <div style={s.cardIcon}>&#128587;</div>
            <h2 style={s.cardTitle}>Customer Support</h2>
            <p style={s.cardDesc}>Having trouble with a document upload, payment or feature? Our support team is here to help.</p>
            <a href="mailto:support.docchatai@proton.me" style={s.link}>&#9993; support.docchatai@proton.me</a>
            <div style={s.emailHighlight}>support.docchatai@proton.me</div>
            <p style={{color:'#6b7280',fontSize:'12px',marginTop:'12px',marginBottom:0}}>We aim to respond within 24 hours.</p>
          </div>

          <div style={s.card}>
            <div style={s.cardIcon}>&#128640;</div>
            <h2 style={s.cardTitle}>Business Opportunities</h2>
            <p style={s.cardDesc}>Interested in white-labelling DocChat AI, integrating it into your product, or exploring a commercial partnership? We are open to discussions.</p>
            <p style={{color:'#9ca3af',fontSize:'13px',marginBottom:'12px'}}>Email us with the subject line: <strong style={{color:'#fff'}}>"Business Opportunity"</strong></p>
            <a href="mailto:support.docchatai@proton.me?subject=Business%20Opportunity" style={s.link}>&#9993; Get in touch</a>
          </div>

          <div style={s.card}>
            <div style={s.cardIcon}>&#129309;</div>
            <h2 style={s.cardTitle}>Collaborations</h2>
            <p style={s.cardDesc}>Are you a developer, content creator, AI researcher or industry expert? We welcome collaborations that help us build better tools for professionals.</p>
            <p style={{color:'#9ca3af',fontSize:'13px',marginBottom:'12px'}}>Email us with the subject line: <strong style={{color:'#fff'}}>"Collaboration"</strong></p>
            <a href="mailto:support.docchatai@proton.me?subject=Collaboration" style={s.link}>&#9993; Let's talk</a>
          </div>
        </div>

        <div style={s.divider}></div>

        {/* SOCIAL MEDIA */}
        <h2 style={s.h2}>Follow Us</h2>
        <p style={s.h2sub}>Stay up to date with new features, tips and announcements</p>
        <div style={s.socialGrid}>
          <a href="https://www.facebook.com/share/18tcsvjgAh/" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <a href="https://www.instagram.com/docchatai?igsh=MWxocDY1NGdncXZnNw==" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#ig)"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
          <a href="https://x.com/DocChatAI" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            X (Twitter)
          </a>
          <a href="https://www.linkedin.com/in/docchat-ai-1a3475408" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>

        <div style={s.divider}></div>

        {/* FOOTER NOTE */}
        <div style={{textAlign:'center',color:'#4b5563',fontSize:'13px'}}>
          <p style={{marginBottom:'4px'}}>&#169; 2026 DocChat AI &middot; Powered by NVIDIA NIM &middot; Secure payments by Stripe</p>
          <p style={{margin:0}}><a href="/" style={{color:'#6b7280',textDecoration:'none'}}>Home</a> &nbsp;&middot;&nbsp; <a href="/compliance" style={{color:'#6b7280',textDecoration:'none'}}>Compliance</a> &nbsp;&middot;&nbsp; <a href="/api-docs" style={{color:'#6b7280',textDecoration:'none'}}>API Docs</a></p>
        </div>
      </div>
    </div>
  );
}
