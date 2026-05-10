import NavBar from '@/app/components/NavBar';

export const metadata = {
  title: 'DocChat AI vs ChatPDF — Which is Better in 2026?',
  description: 'Detailed comparison of DocChat AI vs ChatPDF. Compare features, pricing, AI models, file formats, privacy policies and more. See why DocChat AI beats ChatPDF.',
  alternates: { canonical: '/compare/chatpdf-vs-docchat' }
};

export default function ChatPDFvsDocChatPage() {
  const s = {
    page: { background: '#0a0a0a', color: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' },
    hero: { textAlign: 'center', padding: '80px 24px 40px', maxWidth: '900px', margin: '0 auto' },
    badge: { display: 'inline-block', background: '#1a2e00', color: '#84cc16', border: '1px solid #84cc16', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '24px' },
    h1: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1.2' },
    sub: { fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 32px' },
    winner: { display: 'inline-block', background: '#1a2e00', border: '1px solid #84cc16', borderRadius: '12px', padding: '16px 32px', marginBottom: '48px', color: '#84cc16', fontSize: '1.1rem', fontWeight: '700' },
    tableSection: { maxWidth: '960px', margin: '0 auto', padding: '0 24px 60px' },
    tableTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '24px', textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
    th: { background: '#111', padding: '14px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', borderBottom: '2px solid #222', fontSize: '0.95rem' },
    thGreen: { background: '#0a1a00', padding: '14px 16px', textAlign: 'center', color: '#84cc16', fontWeight: '700', borderBottom: '2px solid #84cc16', fontSize: '0.95rem' },
    thRed: { background: '#1a0000', padding: '14px 16px', textAlign: 'center', color: '#ef4444', fontWeight: '700', borderBottom: '2px solid #ef4444', fontSize: '0.95rem' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', color: '#d1d5db', verticalAlign: 'top' },
    tdGreen: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#84cc16', fontWeight: '600' },
    tdRed: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#ef4444' },
    tdCenter: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#d1d5db' },
    proSection: { maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' },
    proTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '24px' },
    proGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    proCard: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px' },
    proCardTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #222' },
    proList: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px' },
    proBullet: { display: 'flex', gap: '8px', color: '#9ca3af', fontSize: '0.9rem' },
    ctaSection: { textAlign: 'center', padding: '40px 24px 80px' },
    ctaTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '16px' },
    ctaSub: { color: '#9ca3af', marginBottom: '24px' },
    ctaBtn: { display: 'inline-block', background: '#84cc16', color: '#000', fontWeight: '700', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontSize: '1.1rem' },
  };

  const rows = [
    ['AI Models', '11 models (Llama 3.1/3.3, Mistral, DeepSeek R1/V3, Gemma, Phi-4 + more)', '1 model (GPT-based)', '#84cc16', '#ef4444'],
    ['Free Plan', '15 docs/month, 100 questions — No credit card', '2 docs/day limit', '#84cc16', '#f59e0b'],
    ['File Formats', 'PDF, DOCX, XLSX, CSV, TXT, Markdown, HTML, RTF, EPUB', 'PDF only', '#84cc16', '#ef4444'],
    ['Multi-document', 'Up to 5 docs simultaneously', 'Single doc per session', '#84cc16', '#ef4444'],
    ['Data Retention', 'Zero retention — never stored', 'Data stored on servers', '#84cc16', '#ef4444'],      ['HIPAA Ready', 'Yes', 'No', '#84cc16', '#ef4444'],
    ['Document Comparison', 'Yes — compare two documents side-by-side', 'No', '#84cc16', '#ef4444'],
    ['Export Chat', 'Yes — export as .txt', 'Limited', '#84cc16', '#f59e0b'],
    ['Powered By', 'NVIDIA NIM (enterprise-grade)', 'OpenAI GPT', '#84cc16', '#9ca3af'],
    ['Pro Plan Price', '\$19/month', '\$20/month', '#84cc16', '#f59e0b'],
  ];

  return (
    <div style={s.page}>
      <NavBar activePath="/compare" />

      <div style={s.hero}>
        <div style={s.badge}>COMPARISON</div>
        <h1 style={s.h1}>DocChat AI vs ChatPDF<br />Which AI Document Tool is Better in 2026?</h1>
        <p style={s.sub}>We compared both tools across 11 key features — file support, pricing, privacy, AI models, and more.</p>
        <div style={s.winner}>&#127942; Winner: DocChat AI — More models, more formats, zero data retention</div>
      </div>

      <div style={s.tableSection}>
        <h2 style={s.tableTitle}>Feature-by-Feature Comparison</h2>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Feature</th>
              <th style={s.thGreen}>DocChat AI</th>
              <th style={s.thRed}>ChatPDF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, docchat, chatpdf, dcColor, cpColor], i) => (
              <tr key={i} style={{background: i % 2 === 0 ? '#0d0d0d' : 'transparent'}}>
                <td style={s.td}>{feat}</td>
                <td style={{...s.tdCenter, color: dcColor}}>{docchat}</td>
                <td style={{...s.tdCenter, color: cpColor}}>{chatpdf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.proSection}>
        <div style={s.proGrid}>
          <div style={s.proCard}>
            <div style={{...s.proCardTitle, color: '#84cc16'}}>&#10003; DocChat AI Advantages</div>
            <ul style={s.proList}>
              {[
                '11 AI models to choose from — pick the best for your use case',
                'Zero data retention — documents never stored on any server',
                'Supports 10+ file formats including Excel, CSV, Markdown',
                'Multi-document chat — analyze 5 docs simultaneously',
                'HIPAA-ready with BAA for healthcare teams',
                'Powered by NVIDIA NIM — enterprise-grade infrastructure',
                'Document comparison mode built-in',
                'Free plan with no credit card required'
              ].map((item, i) => (
                <li key={i} style={s.proBullet}><span style={{color:'#84cc16'}}>&#10003;</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div style={s.proCard}>
            <div style={{...s.proCardTitle, color: '#ef4444'}}>&#10007; ChatPDF Limitations</div>
            <ul style={s.proList}>
              {[
                'Single AI model only — no flexibility',
                'PDF-only support — no Excel, CSV, DOCX native',
                'Data stored on ChatPDF servers after upload',
                'No multi-document analysis',
                'No HIPAA compliance or BAA available',
                'Limited free tier (2 PDFs/day)',
                'No document comparison feature',
                'Single document per conversation'
              ].map((item, i) => (
                <li key={i} style={s.proBullet}><span style={{color:'#ef4444'}}>&#10007;</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to switch from ChatPDF?</h2>
        <p style={s.ctaSub}>DocChat AI is free to start — no credit card, no account required. Upload your first document in seconds.</p>
        <a href="/" style={s.ctaBtn}>Try DocChat AI Free</a>
      </div>
    </div>
  );
}
