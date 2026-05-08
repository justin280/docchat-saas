import NavBar from '@/app/components/NavBar';
import StickyBar from '@/app/components/StickyBar';

export const metadata = {
  title: 'DocChat AI vs Humata — Which is Better in 2026?',
  description: 'Detailed comparison of DocChat AI vs Humata AI. Compare features, AI models, pricing, file formats and privacy. See why DocChat AI is the better Humata alternative.',
  alternates: { canonical: '/compare/humata-vs-docchat' }
};

export default function HumatavsDocChatPage() {
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
    thOrange: { background: '#1a1000', padding: '14px 16px', textAlign: 'center', color: '#f59e0b', fontWeight: '700', borderBottom: '2px solid #f59e0b', fontSize: '0.95rem' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', color: '#d1d5db', verticalAlign: 'top' },
    tdGreen: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#84cc16', fontWeight: '600' },
    tdOrange: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#f59e0b' },
    tdCenter: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#d1d5db' },
    proGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px', margin: '0 auto 60px', padding: '0 24px' },
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
    ['AI Models', '11 models (Llama, Mistral, DeepSeek, Gemma, Phi-4)', 'GPT-4 only', '#84cc16', '#f59e0b'],
    ['Free Plan', '15 docs/month, 100 questions, no credit card', '3 docs total (lifetime)', '#84cc16', '#ef4444'],
    ['File Formats', 'PDF, DOCX, XLSX, CSV, TXT, Markdown, HTML, RTF, EPUB', 'PDF, DOCX, TXT', '#84cc16', '#f59e0b'],
    ['Multi-document', 'Up to 5 documents simultaneously', 'Yes (limited)', '#84cc16', '#9ca3af'],
    ['Data Retention', 'Zero retention — never stored', 'Stored for 30 days', '#84cc16', '#ef4444'],
    ['Excel / CSV Support', 'Full XLSX and CSV analysis', 'Limited', '#84cc16', '#f59e0b'],
    ['Export Chat', 'Yes — download as .txt', 'No', '#84cc16', '#ef4444'],
    ['API Access', 'Yes (Business plan)', 'Yes (paid)', '#84cc16', '#9ca3af'],
    ['Pro Plan Price', '\$19/month', '\$14.99/month', '#9ca3af', '#84cc16'],
    ['Open Source Models', 'Yes — Llama, Mistral, DeepSeek', 'No — GPT-4 only', '#84cc16', '#ef4444'],
  ];

  return (
    <div style={s.page}>
      <NavBar activePath="/compare" />

      <div style={s.hero}>
        <div style={s.badge}>COMPARISON</div>
        <h1 style={s.h1}>DocChat AI vs Humata AI<br />Which is Better for Document Analysis in 2026?</h1>
        <p style={s.sub}>A detailed head-to-head comparison of DocChat AI and Humata across pricing, features, AI models, and privacy.</p>
        <div style={s.winner}>&#127942; Winner: DocChat AI — More models, better privacy, zero data retention</div>
      </div>

      <div style={s.tableSection}>
        <h2 style={s.tableTitle}>Feature Comparison: DocChat AI vs Humata</h2>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Feature</th>
              <th style={s.thGreen}>DocChat AI</th>
              <th style={s.thOrange}>Humata AI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, docchat, humata, dcColor, hmColor], i) => (
              <tr key={i} style={{background: i % 2 === 0 ? '#0d0d0d' : 'transparent'}}>
                <td style={s.td}>{feat}</td>
                <td style={{...s.tdCenter, color: dcColor}}>{docchat}</td>
                <td style={{...s.tdCenter, color: hmColor}}>{humata}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.proGrid}>
        <div style={s.proCard}>
          <div style={{...s.proCardTitle, color: '#84cc16'}}>Why Choose DocChat AI</div>
          <ul style={s.proList}>
            {[
              '11 open-source AI models — no vendor lock-in',
              'Zero-retention architecture — your data is never stored',
              'Excel, CSV, and Markdown analysis built-in',
              'Free plan with no credit card required',
              'NVIDIA NIM powered — enterprise infrastructure',
              'Document comparison across multiple files',
            ].map((item, i) => (
              <li key={i} style={s.proBullet}><span style={{color:'#84cc16'}}>&#10003;</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
        <div style={s.proCard}>
          <div style={{...s.proCardTitle, color: '#f59e0b'}}>When Humata Might Work</div>
          <ul style={s.proList}>
            {[
              'Slightly cheaper Pro plan (\$14.99 vs \$19)',
              'Familiar GPT-4 responses',
              'Simple interface for basic PDF Q&A',
              'Good for one-off document summaries',
            ].map((item, i) => (
              <li key={i} style={s.proBullet}><span style={{color:'#f59e0b'}}>&#9654;</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Switch from Humata to DocChat AI</h2>
        <p style={s.ctaSub}>More models, better privacy, and a genuinely free plan. No credit card needed to get started.</p>
        <a href="/" style={s.ctaBtn}>Try DocChat AI Free</a>
      </div>
                  <StickyBar />
    </div>
  );
}
