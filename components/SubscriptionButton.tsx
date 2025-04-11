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
          userId: userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error || 'Failed to initialize payment. Please try again.';
        setError(errorMessage);
        return; // Important: Stop further processing
      }

      const data = await response.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError('Authorization URL not found in response. Please try again.');
      }
    } catch (err: any) {
      console.error('Error initiating subscription:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{planName}</h3>
      <p>Amount: {(planAmount / 100).toFixed(2)} NGN</p>
      <Button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default SubscriptionButton;