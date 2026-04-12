"use client";
import { useState } from "react";

export default function UPICheckout({ onPaymentSuccess }: { onPaymentSuccess: () => void }) {
  const upiId = "7823008913-l793-2@ybl";
  const upiString = `upi://pay?pa=${upiId}&pn=STACKR%20Premium&am=199.00&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

  return (
    <div style={{ marginTop: '10px', background: 'var(--ink3)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--magenta)' }}>
      <h4 style={{ color: 'var(--text-hi)', marginBottom: '15px', fontSize: '1rem' }}>Unlock Pro via UPI</h4>
      
      <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '8px', marginBottom: '15px' }}>
        <img src={qrUrl} alt="UPI QR Code" style={{ width: '150px', height: '150px' }} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--ghost)', marginBottom: '4px' }}>Scan QR or pay directly to:</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--cyan)', background: 'var(--ink)', padding: '8px', borderRadius: '6px' }}>
          {upiId}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <a 
          href={upiString}
          style={{ width: '100%', padding: '12px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--cyan), #00bcd4)', color: 'var(--ink)', textDecoration: 'none', fontFamily: 'var(--body)', fontSize: '0.9rem', fontWeight: 700, display: 'inline-block', boxShadow: '0 0 15px var(--cyan-glow)' }}
        >
          Pay ₹199 with UPI App
        </a>
        
        <button 
          onClick={onPaymentSuccess}
          style={{ width: '100%', padding: '10px', borderRadius: '50px', background: 'transparent', color: 'var(--ghost)', border: '1px solid var(--ghost)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '10px' }}
        >
          I have completed the payment
        </button>
      </div>
    </div>
  );
}
