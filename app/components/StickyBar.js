'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function StickyBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: '#0a0a0a', borderTop: '1px solid #84cc16',
      padding: '10px 20px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
      zIndex: 200
    }}>
      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
        <span style={{color:'#84cc16', fontSize:'20px'}}>⚡</span>
        <div>
          <span style={{color:'#fff', fontWeight:'700', fontSize:'14px'}}>DocChat AI is free to start</span>
          <span style={{color:'#6b7280', fontSize:'12px', marginLeft:'8px'}}>No credit card · No email · No sign-up</span>
        </div>
      </div>
      <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
        <Link href="/demo" style={{color:'#9ca3af', fontSize:'13px', textDecoration:'none', border:'1px solid #333', borderRadius:'8px', padding:'7px 14px', whiteSpace:'nowrap'}}>Try Demo →</Link>
        <Link href="/" style={{backgroundColor:'#84cc16', color:'#000', border:'none', borderRadius:'8px', padding:'8px 18px', fontSize:'13px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none', display:'inline-block'}}>Start Free Now</Link>
        <button onClick={()=>setDismissed(true)} style={{background:'none', border:'none', color:'#6b7280', fontSize:'18px', cursor:'pointer', padding:'0 4px', lineHeight:1}} title="Dismiss">×</button>
      </div>
    </div>
  );
}
