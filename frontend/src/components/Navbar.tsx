import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="topbar">
      <div className="topbar-left">
        <div className="logo-mark"></div>
        <div className="logo-word">
          <Link href="/">STACKR<span>.</span></Link>
        </div>
      </div>
      <div className="topbar-center">CARD INTELLIGENCE PLATFORM</div>
      <div className="topbar-right">
        <Link href="/cards">Cards</Link>
        <Link href="/calculator">Cashback Calc</Link>
        <Link href="/simulator">Credit Score</Link>
        <Link href="/timing">Timing Intel</Link>
        <Link href="/upgrade" className="cta-pill" style={{ display: 'inline-block', background: 'var(--accent)', color: '#000', marginRight: '8px', border: 'none' }}>Upgrade Pro</Link>
        <Link href="/profile" className="cta-pill" style={{ display: 'inline-block' }}>Profile / Login</Link>
      </div>
    </nav>
  );
}
