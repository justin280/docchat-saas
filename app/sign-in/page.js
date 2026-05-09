'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === 'sending') return;

    setStatus('sending');
    setErrorMsg('');

    const supabase = createClient();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message || 'Something went wrong. Try again.');
    } else {
      setStatus('sent');
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px', borderBottom: '1px solid #111', backgroundColor: '#0a0a0a' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', width: 'fit-content' }}>
          <Image src="/logo.png" alt="DocChat AI Logo" width={36} height={36} style={{ borderRadius: '6px' }} priority />
          <span style={{ fontWeight: '700', color: '#84cc16', fontSize: '16px' }}>
            DocChat <span style={{ color: '#fff' }}>AI</span>
          </span>
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 12px', textAlign: 'center' }}>Sign in to DocChat AI</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.6 }}>
            Sign-in is optional. The free chat works without an account.<br/>
            Sign in to upgrade to Pro or Business.
          </p>

          {status !== 'sent' && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" style={{ display: 'block', color: '#d1d5db', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'sending'}
                style={{ width: '100%', padding: '12px 14px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={status === 'sending' || !email}
                style={{ width: '100%', marginTop: '16px', padding: '12px', backgroundColor: status === 'sending' ? '#4d7c0f' : '#84cc16', color: '#000', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: status === 'sending' ? 'wait' : 'pointer' }}
              >
                {status === 'sending' ? 'Sending magic link…' : 'Send magic link'}
              </button>
              {status === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{errorMsg}</p>
              )}
            </form>
          )}

          {status === 'sent' && (
            <div style={{ backgroundColor: '#111', border: '1px solid #84cc16', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📩</div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px', color: '#84cc16' }}>Check your email</h2>
              <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                We&apos;ve sent a magic link to <strong style={{ color: '#fff' }}>{email}</strong>.<br/>
                Click the link in the email to sign in. The link expires in 1 hour.
              </p>
              <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '16px', margin: '16px 0 0' }}>
                Can&apos;t find it? Check spam, or <button onClick={() => setStatus('idle')} style={{ background: 'none', border: 'none', color: '#84cc16', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline', padding: 0 }}>try again</button>.
              </p>
            </div>
          )}

          <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
