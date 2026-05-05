import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'Contract Review AI — Legal Document Analysis | DocChat AI', description: 'AI contract review for lawyers and legal teams. Extract clauses, obligations, risks and compliance requirements instantly.' , alternates: { canonical: '/legal-ai' } };
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/legal-ai" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'900px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>Contract Review <span style={{color:'#84cc16'}}>AI</span></h1>
      <h2 style={{fontSize:'18px',color:'#9ca3af',fontWeight:'400',marginBottom:'32px'}}>AI-powered legal document analysis — extract clauses, obligations and risks from contracts in seconds</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>DocChat AI transforms how legal professionals work with contracts. Upload NDAs, lease agreements, employment contracts, vendor agreements or regulatory filings and ask plain-English questions. Our contract review AI extracts key clauses, identifies obligations, flags risks and surfaces compliance requirements — without any prompting knowledge required.</p>
      <h2 style={{fontSize:'22px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Why lawyers use DocChat AI</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'20px'}}>Traditional contract review takes hours. With DocChat AI's advanced RAG architecture and contract review AI, you can review a 50-page agreement in minutes. Ask "What are the termination clauses?" or "List all payment obligations" and get precise, cited answers. Compare two versions of a contract using document comparison mode to spot changes instantly.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Legal document capabilities</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>NDAs — extract confidentiality scope, exclusions, term and jurisdiction</li>
        <li>Employment contracts — obligations, IP assignments, non-competes</li>
        <li>Lease agreements — rent, break clauses, repair obligations</li>
        <li>Vendor agreements — SLAs, liability caps, termination rights</li>
        <li>Regulatory filings — compliance requirements and deadlines</li>
        <li>Document comparison — side-by-side diff between contract versions</li>
      </ul>
      <a href="/" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',textDecoration:'none',marginTop:'24px'}}>Try Contract Review AI Free</a>
    </main>
      </div>
  );
}