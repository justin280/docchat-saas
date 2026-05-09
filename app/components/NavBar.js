'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const NAV_PAGES = [
  { slug: '/legal-ai', label: 'Legal AI' },
  { slug: '/enterprise', label: 'Enterprise' },
  { slug: '/compare', label: 'vs Competitors' },
  { slug: '/api-docs', label: 'API Docs' },
  { slug: '/contact', label: 'Contact' },
  { slug: '/pricing', label: 'Pricing' },
  { slug: '/security', label: 'Security' },
];

function truncateEmail(email) {
  if (!email) return '';
  if (email.length <= 22) return email;
  const [local, domain] = email.split('@');
  if (local.length > 8) return `${local.slice(0, 8)}…@${domain}`;
  return `${local}@${domain.slice(0, 8)}…`;
}

export default function NavBar({ activePath }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setAuthLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

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

          {/* Auth state — Sign in or email + Sign out */}
          {authLoaded && !user && (
            <Link
              href="/sign-in"
              style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', borderLeft: '1px solid #222', paddingLeft: '14px' }}
            >
              Sign in
            </Link>
          )}
          {authLoaded && user && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #222', paddingLeft: '14px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }} title={user.email}>{truncateEmail(user.email)}</span>
              <form action="/auth/signout" method="post" style={{ margin: 0 }}>
                <button type="submit" style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                  Sign out
                </button>
              </form>
            </span>
          )}

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

          {/* Mobile auth section */}
          {authLoaded && !user && (
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#d1d5db', fontSize: '15px', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid #111' }}
            >
              Sign in
            </Link>
          )}
          {authLoaded && user && (
            <div style={{ padding: '4px 0', borderBottom: '1px solid #111' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Signed in as</div>
              <div style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px', wordBreak: 'break-all' }}>{user.email}</div>
              <form action="/auth/signout" method="post" style={{ margin: 0 }}>
                <button type="submit" style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', padding: '6px 12px' }}>
                  Sign out
                </button>
              </form>
            </div>
          )}

          <Link href="/" onClick={() => setMenuOpen(false)} style={{ backgroundColor: '#84cc16', color: '#000', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', textAlign: 'center', marginTop: '4px' }}>
            Try Free — No Credit Card
          </Link>
          <Link href="/demo" onClick={() => setMenuOpen(false)} style={{ backgroundColor: 'transparent', color: '#84cc16', border: '1px solid #84cc16', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>
            🔬 Try Live Demo
          </Link>
        </div>
      )}

      <style>
        @media (max-width: 768px) {'{'}
          .nav-desktop {'{'}display: none !important;{'}'}
          .nav-hamburger {'{'}display: flex !important;{'}'}
        {'}'}
        @media (min-width: 769px) {'{'}
          .nav-hamburger {'{'}display: none !important;{'}'}
        {'}'}
      </style>
    </>
  );
}
