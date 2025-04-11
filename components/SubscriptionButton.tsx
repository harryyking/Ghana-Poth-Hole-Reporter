'use client';

import { useState } from 'react';
import { Button } from './ui/button';

interface SubscriptionButtonProps {
  planName: string;
  planAmount: number;
  planCode?: string;
  userEmail: string;
  userId: string;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  planName,
  planAmount,
  planCode,
  userEmail,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paystack/initialize-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          amount: planAmount,
          plan: planCode,
          metadata: {
            userId: userId,
            subscriptionPlan: planName,
          },
          userId: userId, // Send userId in the body
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to initialize payment');
        return;
      }

      const authorizationUrl = await response.text();
      window.location.href = authorizationUrl;
    } catch (err: any) {
      console.error('Error initiating subscription:', err);
      setError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{planName}</h3>
      <p>Amount: {planAmount / 100} NGN</p>
      <Button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Subscribe Now': 'Pay Now'}
      </Button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default SubscriptionButton;