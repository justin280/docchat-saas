import Link from 'next/link';
import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';

export const metadata = {
    title: 'Security & Privacy | DocChat AI',
    description: 'DocChat AI processes your documents in-session only. Zero retention, TLS encryption, no third-party data sharing.',
    keywords: 'DocChat AI security, zero retention, document privacy, data security, TLS encryption',
    alternates: { canonical: '/security' }
};

export default function SecurityPage() {
    return (
          <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/security" />

{/* Hero */}
      <section style={{textAlign:'center',padding:'80px 20px 60px',maxWidth:'900px',margin:'0 auto'}}>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:'900',margin:'0 0 24px',lineHeight:1.1}}>Security & Privacy</h1>
        <p style={{fontSize:'18px',color:'#9ca3af',maxWidth:'640px',margin:'0 auto',lineHeight:1.7}}>
          DocChat AI is built with a zero-retention architecture — documents are processed in-session only and never written to any persistent storage.
            </p>
            </section>

{/* Cards */}
      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'0 20px 60px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px'}}>

        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{fontSize:'32px',marginBottom:'16px'}}>🚫</div>
          <h2 style={{color:'#84cc16',fontSize:'20px',fontWeight:'700',marginBottom:'12px'}}>Zero Document Retention</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>Documents are never written to disk or database. All processing happens in-memory for the duration of your session only. When you close the session, your data is gone.</p>
        </div>

        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{fontSize:'32px',marginBottom:'16px'}}>🔐</div>
          <h2 style={{color:'#84cc16',fontSize:'20px',fontWeight:'700',marginBottom:'12px'}}>TLS Encryption in Transit</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>All data transfer between your browser and our servers is encrypted using TLS. Your documents are never transmitted in plain text.</p>
        </div>

        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{fontSize:'32px',marginBottom:'16px'}}>🛡️</div>
          <h2 style={{color:'#84cc16',fontSize:'20px',fontWeight:'700',marginBottom:'12px'}}>No Third-Party Data Sharing</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>Your document content is never shared with or sold to any third parties. We use NVIDIA NIM to process queries — your document text is sent as part of the API request but is not retained by the provider.</p>
        </div>

        <div style={{backgroundColor:'#111',border:'1px solid #222',borderRadius:'16px',padding:'32px'}}>
          <div style={{fontSize:'32px',marginBottom:'16px'}}>👤</div>
          <h2 style={{color:'#84cc16',fontSize:'20px',fontWeight:'700',marginBottom:'12px'}}>No User Accounts</h2>
          <p style={{color:'#9ca3af',lineHeight:1.7,margin:0}}>We don't store user accounts, session history, or personal data on our servers. Every session starts fresh with no data carried over.</p>
        </div>

        </section>

{/* Contact */}
      <section style={{textAlign:'center',padding:'0 20px 100px'}}>
        <p style={{color:'#9ca3af',marginBottom:'24px',fontSize:'16px'}}>Have a security question or concern?</p>
        <Link href="/contact" style={{backgroundColor:'#84cc16',color:'#000',padding:'14px 36px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',textDecoration:'none',display:'inline-block'}}>Contact Us</Link>
        </section>

{/* Footer */}
      <footer style={{borderTop:'1px solid #111',padding:'24px 20px',paddingBottom:'80px',textAlign:'center',color:'#6b7280',fontSize:'13px'}}>
        © DocChat AI {new Date().getFullYear()} — <Link href="/contact" style={{color:'#9ca3af',textDecoration:'none'}}>Contact</Link> · <Link href="/" style={{color:'#9ca3af',textDecoration:'none'}}>Home</Link>
          </footer>

      <StickyBar />
          </div>
  );
}
