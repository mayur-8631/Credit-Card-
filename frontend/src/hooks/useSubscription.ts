'use client';

import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  plan_type: 'free' | 'pro';
  status: 'active' | 'inactive';
  end_date: string | null;
}

export default function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({ plan_type: 'free', status: 'active', end_date: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('credimatch_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/subscription/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription);
        }
      } catch {
        // Stay on free if can't reach backend
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return {
    isPro: subscription.plan_type === 'pro' && subscription.status === 'active',
    subscription,
    loading,
  };
}
