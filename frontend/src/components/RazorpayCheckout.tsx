"use client";
import { useState, useEffect } from "react";

export default function RazorpayCheckout({ userId, token, onPaymentSuccess }: { userId: number | string, token: string, onPaymentSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!token) {
      setError("Please login first to upgrade.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create order (with mock fallback if backend is down)
      let orderData;
      try {
        const createOrderRes = await fetch("http://localhost:4000/api/subscription/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });
        orderData = await createOrderRes.json();
        if (!createOrderRes.ok) throw new Error(orderData.error || "Failed to create order");
      } catch (err) {
        console.warn("Backend offline, using mock order for Demo.");
        orderData = {
          id: "order_mock_" + Math.floor(Math.random()*10000),
          amount: 19900, // ₹199 in paise
          currency: "INR"
        };
      }

      // 2. Open Razorpay Checkout Window
      const options = {
        // We use a dummy key here or read from ENV ideally. NextJS public env `process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID`
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "STACKR Pro",
        description: "Yearly Pro Subscription",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("http://localhost:4000/api/subscription/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onPaymentSuccess();
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            setError("Error verifying the payment.");
          }
        },
        prefill: {
          name: "User",
          email: "user@stackr.com"
        },
        theme: {
          color: "#CCFF00" // STACKR accent color
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any){
         setError(`Payment Failed: ${response.error.description}`);
      });
      razorpayInstance.open();

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      {error && <div style={{ color: '#ff2d95', marginBottom: '10px', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}
      <button 
        onClick={handlePayment} 
        disabled={loading}
        style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--cyan), #00bcd4)', color: 'var(--ink)', fontFamily: 'var(--body)', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'box-shadow 0.25s', boxShadow: loading ? 'none' : '0 0 15px var(--cyan-glow)' }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 0 25px var(--cyan-glow)'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 0 15px var(--cyan-glow)'; }}
      >
        {loading ? "Initializing..." : "Upgrade to Pro Now"}
      </button>
    </div>
  );
}
