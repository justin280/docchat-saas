'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_PAGES = [
      { slug: '/healthcare', label: 'Healthcare' },
      { slug: '/contact', label: 'Contact' },
  ];

export default function NavBar({ activePath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
      }}>
        {/* Logo + Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
          <Image src="/logo.png" alt="DocChat AI Logo" width={36} height={36} style={{ borderRadius: '6px' }} priority />
          <span style={{ fontWeight: '700', color: '#84cc16', fontSize: '16px', whiteSpace: 'nowrap' }}>
            DocChat <span style={{ color: '#fff' }}>AI</span>
          </span>
        </Link>

        {/* Nav Links — hidden on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }} className="nav-desktop">
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
          <Link href="/" style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #333', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            &#8962; Home
          </Link>
          <Link href="/" style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Try Free
          </Link>
        </div>

        {/* Hamburger button — visible on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-hamburger"
          style={{ backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#fff', fontSize: '18px', lineHeight: 1 }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '57px', left: 0, right: 0, backgroundColor: '#0d0d0d', borderBottom: '1px solid #222', zIndex: 99, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {NAV_PAGES.map(p => (
            <Link
              key={p.slug}
              href={p.slug}
              onClick={() => setMenuOpen(false)}
              style={{ color: activePath === p.slug ? '#84cc16' : '#d1d5db', fontSize: '15px', textDecoration: 'none', fontWeight: activePath === p.slug ? '600' : '400', padding: '4px 0', borderBottom: '1px solid #111' }}
            >
              {p.label}
            </Link>
          ))}
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', textAlign: 'center', marginTop: '4px' }}>
            Try Free — No Credit Card
          </Link>
          <Link href="/demo" onClick={() => setMenuOpen(false)} style={{ backgroundColor: 'transparent', color: '#84cc16', border: '1px solid #84cc16', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>
            🔬 Try Live Demo
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
