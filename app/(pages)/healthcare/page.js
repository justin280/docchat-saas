import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';
export const metadata = { title: 'AI for Healthcare Research — HIPAA-Ready Document Analysis | DocChat AI', description: 'DocChat AI for healthcare. Process clinical studies, medical literature and patient documents with HIPAA-ready AI.',
  alternates: { canonical: '/healthcare' }
};
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif',paddingBottom:'70px'}}>
      <NavBar activePath="/healthcare" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>AI for <span style={{color:'#84cc16'}}>Healthcare Research</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>Process clinical studies, medical literature and healthcare documents with HIPAA-ready AI — powered by NVIDIA NIM</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Healthcare professionals and researchers use DocChat AI to process volumes of clinical literature that would take days to review manually. Upload multiple research papers, clinical guidelines, patient case studies or medical device manuals and ask questions across all of them simultaneously using our advanced RAG architecture.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>HIPAA-Ready Data Processing</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Our Business plan supports HIPAA-compliant workflows. Documents are never stored after your session ends. No PHI is retained. All communications are encrypted. Business Associate Agreements are available for qualifying healthcare organisations.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Healthcare use cases</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>Clinical trial analysis — extract endpoints, cohorts, and outcomes</li>
        <li>Medical literature review — synthesise findings across multiple papers</li>
        <li>Drug formulary and protocol comparison</li>
        <li>Insurance policy and coding document analysis</li>
        <li>Healthcare research with AI for healthcare research workflows</li>
        <li>Regulatory submission document review</li>
      </ul>
      <a href="/" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Try Free — No Credit Card</a>
    </main>
      <StickyBar />
    </div>
  );
}
