import Link from 'next/link';
import Image from 'next/image';

const NAV_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/healthcare', label: 'Healthcare' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/contact', label: 'Contact' },
  { slug: '/pricing', label: 'Pricing' },
  { slug: '/security', label: 'Security' },
];

export default function NavBar({ activePath }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '10px 20px',
      borderBottom: '1px solid #111',
      backgroundColor: '#0a0a0a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
    }}>
      {/* Logo + Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
        <Image
          src="/logo.png"
          alt="DocChat AI Logo"
          width={36}
          height={36}
          style={{ borderRadius: '6px' }}
          priority
        />
        <span style={{ fontWeight: '700', color: '#84cc16', fontSize: '16px', whiteSpace: 'nowrap' }}>
          DocChat <span style={{ color: '#fff' }}>AI</span>
        </span>
      </Link>

      {/* Nav Links */}
      {NAV_PAGES.map(p => (
        <Link
          key={p.slug}
          href={p.slug}
          style={{
            color: activePath === p.slug ? '#84cc16' : '#9ca3af',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: activePath === p.slug ? '600' : '400',
          }}
        >
          {p.label}
        </Link>
      ))}

      {/* Home Button */}
      <Link
        href="/"
        style={{
          backgroundColor: 'transparent',
          color: '#9ca3af',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '7px 14px',
          fontSize: '12px',
          fontWeight: '600',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        &#8962; Home
      </Link>

      {/* Try Free CTA */}
      <Link
        href="/"
        style={{
          backgroundColor: '#84cc16',
          color: '#000',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '700',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Try Free
      </Link>
    </nav>
  );
}
