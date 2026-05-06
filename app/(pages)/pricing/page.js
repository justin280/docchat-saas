import NavBar from '@/app/components/NavBar';

export const metadata = {
  title: 'Pricing — DocChat AI Plans | Free, Pro & Business',
  description: 'DocChat AI pricing: Free Starter plan with no credit card, Pro at \$19/month, Business at \$49/month. Unlimited documents, 11 AI models, HIPAA-ready options.',
  alternates: { canonical: '/pricing' }
};

export default function PricingPage() {
  const s = {
    page: { background: '#0a0a0a', color: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' },
    hero: { textAlign: 'center', padding: '80px 24px 40px', maxWidth: '800px', margin: '0 auto' },
    badge: { display: 'inline-block', background: '#1a2e00', color: '#84cc16', border: '1px solid #84cc16', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '24px' },
    h1: { fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1.2' },
    sub: { fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '0 24px 60px' },
    card: { background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px' },
    cardFeatured: { background: '#111', border: '2px solid #84cc16', borderRadius: '16px', padding: '32px', position: 'relative' },
    featuredBadge: { position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#84cc16', color: '#000', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
    planName: { fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '8px' },
    price: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' },
    priceNum: { fontSize: '3rem', fontWeight: '900', color: '#84cc16' },
    pricePer: { color: '#6b7280', fontSize: '0.9rem' },
    planDesc: { color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' },
    divider: { height: '1px', background: '#222', margin: '20px 0' },
    featureList: { listStyle: 'none', padding: '0', margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' },
    feature: { display: 'flex', alignItems: 'center', gap: '10px', color: '#d1d5db', fontSize: '0.9rem' },
    featureCheck: { color: '#84cc16', fontWeight: '700', flexShrink: '0' },
    featureMuted: { color: '#6b7280' },
    ctaFree: { display: 'block', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #333', background: 'transparent', color: '#fff', fontWeight: '700', fontSize: '1rem', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' },
    ctaFeatured: { display: 'block', width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#84cc16', color: '#000', fontWeight: '700', fontSize: '1rem', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' },
    faqSection: { maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' },
    faqTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '32px' },
    faqItem: { marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '20px' },
    faqQ: { fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '8px' },
    faqA: { color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' },
    trustSection: { background: '#111', borderTop: '1px solid #1a1a1a', padding: '40px 24px', textAlign: 'center' },
    trustGrid: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px', maxWidth: '800px', margin: '16px auto 0' },
    trustItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    trustNum: { fontSize: '2rem', fontWeight: '900', color: '#84cc16' },
    trustLabel: { color: '#9ca3af', fontSize: '0.85rem' },
    comparisonSection: { maxWidth: '900px', margin: '0 auto 60px', padding: '0 24px' },
    compTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: '32px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
    th: { background: '#111', padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', borderBottom: '2px solid #222' },
    thGreen: { background: '#0a1a00', padding: '12px 16px', textAlign: 'center', color: '#84cc16', fontWeight: '700', borderBottom: '2px solid #84cc16' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', color: '#d1d5db' },
    tdCenter: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#d1d5db' },
    tdGreen: { padding: '12px 16px', borderBottom: '1px solid #1a1a1a', textAlign: 'center', color: '#84cc16', fontWeight: '600' },
  };

  const faqs = [
    ['Can I change my plan at any time?', 'Yes — upgrade, downgrade or cancel anytime. Changes take effect at the next billing cycle. No lock-in contracts.'],
    ['Is there really a free plan with no credit card?', 'Yes. The Starter plan is completely free with no credit card required. You get 15 document uploads and 100 AI questions every month.'],
    ['What payment methods do you accept?', 'We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe. All payments are processed securely.'],
    ['What happens if I exceed my document limit?', "On the Starter plan, you'll be prompted to upgrade when you hit your limit. Pro and Business plans have unlimited uploads."],
    ['Do you offer refunds?', 'Yes — we offer a 14-day money-back guarantee on all paid plans. No questions asked.'],
    ['What is zero-retention architecture?', 'Your documents are processed entirely in-session and are never written to disk, stored in databases, or used to train AI models.'],
    ['Can I get a BAA for HIPAA compliance?', 'Yes — Business plan customers can request a signed Business Associate Agreement (BAA) from our security team.'],
  ];

  const tableRows = [
    ['Documents per month', '15', 'Unlimited', 'Unlimited'],
    ['AI questions per month', '100', 'Unlimited', 'Unlimited'],
    ['Docs per session', '5', '20', 'Unlimited'],
    ['AI models available', '11', '11', '11'],
    ['File formats', 'PDF, DOCX, XLSX, TXT', 'All formats', 'All formats'],
    ['Document comparison', '&#10007;', '&#10003;', '&#10003;'],
    ['Export chat history', '&#10007;', '&#10003;', '&#10003;'],
    ['HIPAA-ready config', '&#10007;', '&#10007;', '&#10003;'],
    ['BAA available', '&#10007;', '&#10007;', '&#10003;'],
    ['SSO (Google / Microsoft)', '&#10007;', '&#10007;', '&#10003;'],
    ['API access', '&#10007;', '&#10007;', '&#10003;'],
    ['Audit logs', '&#10007;', '&#10007;', '&#10003;'],
    ['Support', 'Community', 'Email', 'Priority + SLA'],
  ];

  return (
    <div style={s.page}>
      <NavBar activePath="/pricing" />

      <div style={s.hero}>
        <div style={s.badge}>PRICING</div>
        <h1 style={s.h1}>Simple, Transparent Pricing</h1>
        <p style={s.sub}>Start free — no credit card, no email, no sign-up required. Scale as you grow. No hidden fees. Cancel anytime.</p>
      <div style={{display:'flex', justifyContent:'center', gap:'16px', flexWrap:'wrap', marginTop:'12px'}}>
        <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'13px', fontWeight:'600', padding:'5px 14px', borderRadius:'20px', border:'1px solid #16a34a'}}>✓ Free plan forever</span>
        <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'13px', fontWeight:'600', padding:'5px 14px', borderRadius:'20px', border:'1px solid #16a34a'}}>✓ No credit card needed</span>
        <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'13px', fontWeight:'600', padding:'5px 14px', borderRadius:'20px', border:'1px solid #16a34a'}}>✓ No email required</span>
      </div>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.planName}>Starter</div>
          <div style={s.price}>
            <span style={{...s.priceNum, color: '#fff'}}>&#36;0</span>
            <span style={s.pricePer}>/month</span>
          </div>
          <p style={s.planDesc}>Perfect for individuals exploring AI document analysis.</p>
          <div style={{display:'flex', flexWrap:'wrap', gap:'6px', margin:'10px 0 0 0'}}>
            <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'12px', border:'1px solid #16a34a'}}>✓ No credit card</span>
            <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'12px', border:'1px solid #16a34a'}}>✓ No email</span>
            <span style={{backgroundColor:'#14532d', color:'#86efac', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'12px', border:'1px solid #16a34a'}}>✓ No sign-up</span>
          </div>
          <div style={s.divider} />
          <ul style={s.featureList}>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> 15 documents/month</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> 100 AI questions/month</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Up to 5 documents per session</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> PDF, DOCX, XLSX, TXT support</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> All 11 AI models</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Zero data retention</li>
            <li style={s.feature}><span style={s.featureMuted}>&#8212;</span> <span style={s.featureMuted}>No API access</span></li>
            <li style={s.feature}><span style={s.featureMuted}>&#8212;</span> <span style={s.featureMuted}>No priority support</span></li>
          </ul>
          <a href="/" style={s.ctaFree}>Get Started Free</a>
          <p style={{textAlign:'center', color:'#6b7280', fontSize:'12px', margin:'10px 0 0 0'}}>No credit card · No email · No sign-up</p>
          <a href="/demo" style={{display:'block', textAlign:'center', color:'#84cc16', fontSize:'12px', marginTop:'6px', textDecoration:'none', fontWeight:'600'}}>🔬 Try the free demo first →</a>
        </div>

        <div style={s.cardFeatured}>
          <div style={s.featuredBadge}>MOST POPULAR</div>
          <div style={s.planName}>Pro</div>
          <div style={s.price}>
            <span style={s.priceNum}>&#36;19</span>
            <span style={s.pricePer}>/month</span>
          </div>
          <p style={s.planDesc}>For professionals and teams who work with documents daily.</p>
          <div style={s.divider} />
          <ul style={s.featureList}>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Unlimited documents</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Unlimited AI questions</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Up to 20 docs per session</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> All file formats</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> All 11 AI models</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Document comparison</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Export chat history</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Email support</li>
          </ul>
          <a href="/" style={s.ctaFeatured}>Start Pro Trial</a>
        </div>

        <div style={s.card}>
          <div style={s.planName}>Business</div>
          <div style={s.price}>
            <span style={{...s.priceNum, color: '#fff'}}>&#36;49</span>
            <span style={s.pricePer}>/month</span>
          </div>
          <p style={s.planDesc}>For teams needing compliance, audit trails, and API access.</p>
          <div style={s.divider} />
          <ul style={s.featureList}>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Everything in Pro</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> HIPAA-ready configuration</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> BAA available</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> SSO (Google + Microsoft)</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> API access + webhooks</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Audit logs</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Admin dashboard</li>
            <li style={s.feature}><span style={s.featureCheck}>&#10003;</span> Priority support + SLA</li>
          </ul>
          <a href="/contact" style={s.ctaFree}>Contact Sales</a>
        </div>
      </div>

      <div style={s.comparisonSection}>
        <h2 style={s.compTitle}>Full Feature Comparison</h2>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Feature</th>
              <th style={{...s.th, textAlign: 'center'}}>Starter</th>
              <th style={s.thGreen}>Pro</th>
              <th style={{...s.th, textAlign: 'center'}}>Business</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(([feat, starter, pro, biz], i) => (
              <tr key={i} style={{background: i % 2 === 0 ? '#0d0d0d' : 'transparent'}}>
                <td style={s.td}>{feat}</td>
                <td style={{...s.tdCenter, color: starter.includes('10007') ? '#6b7280' : '#d1d5db'}} dangerouslySetInnerHTML={{__html: starter}} />
                <td style={s.tdGreen} dangerouslySetInnerHTML={{__html: pro}} />
                <td style={{...s.tdCenter, color: biz.includes('10007') ? '#6b7280' : '#d1d5db'}} dangerouslySetInnerHTML={{__html: biz}} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.faqSection}>
        <h2 style={s.faqTitle}>Pricing FAQ</h2>
        {faqs.map(([q, a], i) => (
          <div key={i} style={s.faqItem}>
            <div style={s.faqQ}>{q}</div>
            <div style={s.faqA}>{a}</div>
          </div>
        ))}
      </div>

      <div style={s.trustSection}>
        <p style={{color: '#6b7280', marginBottom: '8px', fontSize: '0.85rem', letterSpacing: '0.1em'}}>TRUSTED BY PROFESSIONALS WORLDWIDE</p>
        <div style={s.trustGrid}>
          {[['11', 'AI Models'], ['10+', 'File Formats'], ['0', 'Data Retained'], ['14-day', 'Money-Back Guarantee']].map(([num, label]) => (
            <div key={label} style={s.trustItem}>
              <div style={s.trustNum}>{num}</div>
              <div style={s.trustLabel}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{color: '#4b5563', marginTop: '32px', fontSize: '0.85rem'}}>
          Powered by <strong style={{color: '#9ca3af'}}>NVIDIA NIM</strong> &#183; SOC2-aligned &#183; HIPAA-ready &#183; Zero retention
        </p>
      </div>
    </div>
  );
}
