import SubscriptionButton from '@/components/SubscriptionButton';
import React from 'react';

const page = () => {
  // Hardcoded user and subscription information for demonstration
  const userEmail = 'testuser@example.com';
  const userId = 'user-123';
  const planName = 'Premium Plan';
  const planAmount = 5000; // Amount in kobo (e.g., 5000 kobo = 50 NGN)
  const planCode = 'PREMIUM_PLAN_CODE';

  // Scenario: User is upgrading their account to a premium subscription
  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Upgrade to Premium</h2>
        <p className="mb-4 text-center">
          Unlock exclusive features and benefits by upgrading to our Premium Plan.
        </p>
        <div className="mb-4">
          <p className="font-semibold">Plan:</p>
          <p>{planName}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Amount:</p>
          <p>{(planAmount / 100).toFixed(2)} NGN</p>
        </div>
        <div className="flex justify-center">
          <SubscriptionButton
            planAmount={planAmount}
            planName={planName}
            planCode={planCode}
            userEmail={userEmail}
            userId={userId}
          />
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          By clicking "Pay Now," you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default page;