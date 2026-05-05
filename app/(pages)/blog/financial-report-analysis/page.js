import NavBar from '@/app/components/NavBar';
export const metadata = { title: 'Financial Report Analysis with AI: Guide for Analysts and CFOs | DocChat AI', description: 'Use AI for financial report analysis. Upload annual reports, P&L statements and board decks to get instant insights from DocChat AI.' };
export default function Page() {
  return (
    <div style={{backgroundColor:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
      <NavBar activePath="/blog/financial-report-analysis" />
      <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'800px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>Financial Report Analysis with AI: <span style={{color:"#84cc16"}}>Instant Insights from Any Report</span></h1>
      <p style={{color:'#9ca3af',marginBottom:'40px',fontSize:'15px'}}>Finance teams use DocChat AI to analyse annual reports, earnings calls, investor decks and financial statements in minutes — not hours.</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>The Problem with Manual Financial Report Analysis</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>A typical FTSE 100 annual report runs to 200+ pages. Earnings call transcripts, board packs, investor presentations and regulatory filings add hundreds more pages per quarter. Financial analysts and CFOs waste hours navigating documents to find the specific numbers, ratios and commentary they need. AI for financial report analysis eliminates this bottleneck.</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>How DocChat AI Handles Financial Documents</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>DocChat AI's AI Excel analyzer and PDF chat work together for comprehensive financial analysis. Upload a PDF annual report alongside an XLSX financial model and ask questions that span both. "What does management say about the margin pressure mentioned in the income statement?" or "Cross-reference the guidance given in the earnings call with the actual Q3 results in the Excel file."</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Advanced RAG for Financial Accuracy</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>Financial analysis demands accuracy. DocChat AI uses advanced RAG (Retrieval-Augmented Generation) architecture to ensure every answer is grounded in your specific documents. The AI cites the relevant sections of your report, so you can verify every figure.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Financial document use cases</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>Annual report analysis — KPIs, strategy, risk factors</li>
        <li>Earnings call transcript analysis — guidance, sentiment, commitments</li>
        <li>M&amp;A due diligence — financial model and IM cross-analysis</li>
        <li>Board pack preparation — automated executive summaries</li>
        <li>Competitor financial benchmarking across multiple reports</li>
        <li>Regulatory filing review — HMRC, SEC, FCA submissions</li>
      </ul>
      <div style={{marginTop:'48px',backgroundColor:'#0f1f00',border:'1px solid #84cc16',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
        <h3 style={{fontWeight:'700',marginBottom:'8px'}}>Try DocChat AI Free</h3>
        <p style={{color:'#9ca3af',marginBottom:'16px',fontSize:'14px'}}>Upload your documents and start chatting instantly — no credit card needed.</p>
        <a href="/" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'12px 24px',borderRadius:'8px',fontWeight:'700',textDecoration:'none'}}>Start Free</a>
      </div>
    </main>
      </div>
  );
}