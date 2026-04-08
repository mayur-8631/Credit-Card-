import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto', zIndex: 10 }}>
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div className="logo-mark" style={{ width: '22px', height: '22px' }}></div>
            <span style={{ fontFamily: 'var(--display)', fontSize: '1.05rem', color: 'var(--text-hi)', letterSpacing: '3px' }}>STACKR<span style={{ color: 'var(--cyan)' }}>.</span></span>
          </div>
          <p>STACKR is India's first priority-driven card intelligence platform. We don't just show you cards — we match them to your life.</p>
        </div>
        <div><h5>Explore</h5><ul><li><Link href="/cards">All Cards</Link></li><li><a href="#">Zero-Fee Cards</a></li><li><a href="#">Travel Cards</a></li><li><a href="#">Cashback Kings</a></li></ul></div>
        <div><h5>Tools</h5><ul><li><Link href="/">Priority Engine</Link></li><li><Link href="/calculator">Cashback Calc</Link></li><li><Link href="/simulator">Credit Score</Link></li><li><a href="#">EMI Planner</a></li></ul></div>
        <div><h5>Company</h5><ul><li><a href="#">About Us</a></li><li><a href="#">Blog</a></li><li><a href="#">Careers</a></li><li><a href="#">Privacy</a></li></ul></div>
      </div>
      <div className="footer-bar">
        <p>© 2026 STACKR. ALL RIGHTS RESERVED · INDEPENDENT COMPARISON PLATFORM</p>
        <div className="f-socials"><a>𝕏</a><a>in</a><a>ig</a><a>yt</a></div>
      </div>
    </footer>
  );
}
