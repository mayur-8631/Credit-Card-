"use client";
import { useState, useEffect } from "react";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import { Check, X } from "lucide-react";

export default function UpgradePage() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [successMode, setSuccessMode] = useState<boolean>(false);

  useEffect(() => {
    const t = localStorage.getItem('stackr_token') || localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) {
      const pUser = JSON.parse(u);
      setUserId(pUser.id || pUser.email);
    }

    if (t) {
      // Check current subscription
      fetch('http://localhost:4000/api/subscription/status', {
        headers: { 'Authorization': `Bearer ${t}` }
      })
      .then(r => r.json())
      .then(d => {
        if (d && d.subscription && d.subscription.plan_type === 'pro' && d.subscription.status === 'active') {
          setIsPro(true);
        }
      })
      .catch(console.error);
    }
  }, []);

  const handleSuccess = () => {
    setSuccessMode(true);
    setIsPro(true);
  };

  if (successMode) {
    return (
      <main style={{ textAlign: "center", paddingTop: "150px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(4rem, 8vw, 6rem)", color: "var(--cyan)", letterSpacing: "1px", textShadow: "0 0 20px var(--cyan-glow)" }}>PRO ACTIVATED 🎉</h1>
        <p style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", margin: "20px auto 40px", color: "var(--text)", maxWidth: "500px", lineHeight: "1.6" }}>
          Welcome to the elite tier of STACKR. Your payment was successful and all Pro features are unleashed.
        </p>
        <a href="/profile" className="cta-pill" style={{ fontSize: "1rem", padding: "12px 32px" }}>Access Pro Dashboard</a>
      </main>
    )
  }

  return (
    <main style={{ padding: "clamp(80px, 12vw, 150px) clamp(28px, 6vw, 80px) clamp(70px, 9vw, 110px)", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <header style={{ marginBottom: "60px", textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: ".68rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "18px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
           <span style={{ width: "22px", height: "1px", background: "currentColor" }}></span>
           Power Up
           <span style={{ width: "22px", height: "1px", background: "currentColor" }}></span>
        </div>
        <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(3.5rem, 8vw, 5rem)", marginBottom: "16px", color: "var(--text-hi)", lineHeight: "1", letterSpacing: "0.5px" }}>Upgrade Your <span style={{ color: "var(--cyan)", textShadow: "0 0 15px var(--cyan-glow)" }}>Experience</span></h1>
        <p style={{ fontFamily: "var(--mono)", color: "var(--text)", fontSize: "0.9rem", lineHeight: "1.7", opacity: 0.8 }}>
          Unlock the full quantitative power of STACKR Card Intelligence. 
        </p>
      </header>

      {isPro && (
        <div style={{ textAlign: "center", border: "1px solid var(--cyan-glow)", background: "var(--ink2)", borderRadius: "var(--r)", marginBottom: "50px", padding: "20px", maxWidth: "600px", margin: "0 auto 50px" }}>
          <h2 style={{ fontFamily: "var(--display)", fontSize: "2rem", color: "var(--cyan)" }}>You are on the Pro Plan</h2>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--text-hi)", marginTop: "8px" }}>Your subscription is currently active.</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center", maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* FREE PLAN */}
        <div style={{ flex: "1 1 300px", maxWidth: "450px", background: "var(--ink2)", border: "1px solid var(--ghost)", borderRadius: "var(--r)", padding: "40px", transition: "transform 0.3s", opacity: isPro ? 0.6 : 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: "var(--display)", fontSize: "2.5rem", marginBottom: "5px", color: "var(--text-hi)", letterSpacing: "0.5px" }}>Essential</h2>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.2rem", marginBottom: "30px", color: "rgba(255,255,255,0.6)" }}>Free forever</div>
          
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text)" }}><Check size={18} color="var(--magenta)" /> Track up to 2 Credit Cards</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text)" }}><Check size={18} color="var(--magenta)" /> Basic Plan Comparison</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text)", opacity: 0.4 }}><X size={18} /> Advanced AI Recommendations</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text)", opacity: 0.4 }}><X size={18} /> Smart Timing Alerts</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text)", opacity: 0.4 }}><X size={18} /> Unlimited Cards Logging</li>
          </ul>

          <button style={{ width: "100%", padding: "14px", borderRadius: "50px", background: "var(--ink4)", color: "rgba(255,255,255,0.4)", fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 600, border: "1px solid var(--ghost)" }} disabled>Current Plan</button>
        </div>

        {/* PRO PLAN */}
        <div style={{ flex: "1 1 300px", maxWidth: "450px", background: "var(--ink3)", border: "1px solid var(--cyan)", borderRadius: "var(--r)", padding: "40px", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 0 30px var(--cyan-dim)" }}>
          <div style={{ position: "absolute", top: "-14px", right: "25px", background: "linear-gradient(135deg, var(--cyan), #00bcd4)", color: "var(--ink)", padding: "6px 16px", borderRadius: "50px", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: "bold", letterSpacing: "1px", boxShadow: "0 0 15px var(--cyan-glow)" }}>RECOMMENDED</div>
          
          <h2 style={{ fontFamily: "var(--display)", fontSize: "2.5rem", marginBottom: "5px", color: "var(--cyan)", letterSpacing: "0.5px" }}>STACKR Pro</h2>
          <div style={{ fontFamily: "var(--body)", fontSize: "1.5rem", marginBottom: "30px", color: "var(--text-hi)", fontWeight: "bold" }}>₹999 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", fontWeight: "normal" }}>/ year</span></div>
          
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text-hi)" }}><Check size={18} color="var(--cyan)" /> Unlimited Cards Logging</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text-hi)" }}><Check size={18} color="var(--cyan)" /> Advanced AI Recommendations</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text-hi)" }}><Check size={18} color="var(--cyan)" /> Smart Timing Alerts</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text-hi)" }}><Check size={18} color="var(--cyan)" /> Early Access to New Features</li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--body)", fontSize: "0.9rem", color: "var(--text-hi)" }}><Check size={18} color="var(--cyan)" /> Priority Support</li>
          </ul>

          {!isPro ? (
            token ? (
              <div style={{ width: "100%" }}>
                <RazorpayCheckout userId={userId!} token={token} onPaymentSuccess={handleSuccess} />
              </div>
            ) : (
              <a href="/login" style={{ display: "block", textAlign: "center", width: "100%", padding: "14px", borderRadius: "50px", background: "none", border: "1px solid var(--cyan)", color: "var(--cyan)", fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 600, transition: "background 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cyan-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>Login to Upgrade</a>
            )
          ) : (
            <button style={{ width: "100%", padding: "14px", borderRadius: "50px", background: "var(--ink2)", color: "var(--cyan)", border: "1px solid var(--cyan)", fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 600 }} disabled>Active Subscription</button>
          )}
        </div>
      </div>
    </main>
  );
}
