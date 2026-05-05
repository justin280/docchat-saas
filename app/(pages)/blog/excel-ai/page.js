export const metadata = { title: 'AI Excel Analyzer: Chat With Your Spreadsheets Using AI | DocChat AI', description: 'Use DocChat AI as an AI Excel analyzer. Upload XLSX, CSV and spreadsheets and ask questions in plain English. No formulas required.' };
export default function Page() {
  return (
    <main style={{minHeight:'100vh',backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif',padding:'60px 20px',maxWidth:'800px',margin:'0 auto'}}>
      <a href="/" style={{color:'#84cc16',textDecoration:'none',fontSize:'14px'}}>&#8592; Back to DocChat AI</a>
      <h1 style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:'700',margin:'32px 0 16px'}}>AI Excel Analyzer: <span style={{color:"#84cc16"}}>Chat With Your Spreadsheets</span></h1>
      <p style={{color:'#9ca3af',marginBottom:'40px',fontSize:'15px'}}>Stop writing complex formulas. DocChat AI's AI Excel analyzer lets you ask plain-English questions about your spreadsheets and get instant answers.</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>What is an AI Excel Analyzer?</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>An AI Excel analyzer uses natural language processing to let you ask questions about spreadsheet data without writing formulas or pivot tables. Instead of typing =SUMIF(A2:A100,">1000",B2:B100), you just ask "What is the total revenue from orders over £1,000?" and get an instant, accurate answer.</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>DocChat AI as Your AI Excel Analyzer</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>DocChat AI supports XLSX and CSV upload natively. Upload your spreadsheet, financial model, budget tracker or sales data and start asking questions immediately. Our advanced parsing extracts table structure, column headers and data relationships, giving the AI full context to answer complex analytical questions accurately.</p>
      <h2 style={{fontSize:'24px',fontWeight:'700',margin:'32px 0 12px',color:'#84cc16'}}>Cross-Spreadsheet Analysis</h2>
      <p style={{color:'#d1d5db',lineHeight:'1.8',marginBottom:'16px'}}>Upload multiple Excel files simultaneously — for example, Q1, Q2 and Q3 revenue files — and ask cross-document questions like "Which quarter had the highest growth rate?" or "Compare marketing spend across all three quarters." This multi-spreadsheet capability is unique to DocChat AI among document AI tools.</p>
      <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 8px'}}>Excel AI use cases</h3>
      <ul style={{color:'#d1d5db',lineHeight:'2',paddingLeft:'20px'}}>
        <li>Financial report analysis — P&amp;L, balance sheet, cash flow</li>
        <li>Sales data analysis — trends, top performers, pipeline</li>
        <li>Budget vs actuals comparison across multiple files</li>
        <li>HR data — headcount, attrition, compensation analysis</li>
        <li>Inventory and supply chain data analysis</li>
        <li>Marketing campaign performance data</li>
      </ul>
      <div style={{marginTop:'48px',backgroundColor:'#0f1f00',border:'1px solid #84cc16',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
        <h3 style={{fontWeight:'700',marginBottom:'8px'}}>Try DocChat AI Free</h3>
        <p style={{color:'#9ca3af',marginBottom:'16px',fontSize:'14px'}}>Upload your documents and start chatting instantly — no credit card needed.</p>
        <a href="/" style={{display:'inline-block',backgroundColor:'#84cc16',color:'#000',padding:'12px 24px',borderRadius:'8px',fontWeight:'700',textDecoration:'none'}}>Start Free</a>
      </div>
    </main>
  );
}