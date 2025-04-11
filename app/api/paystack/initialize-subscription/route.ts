import Paystack from 'paystack-node';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust import path

interface InitializeSubscriptionPayload {
  email: string;
  amount: number;
  plan?: string;
  metadata?: Record<string, any>;
  userId: string;
}

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body: InitializeSubscriptionPayload = await request.json();
    const { email, amount, plan, metadata, userId } = body;

    // Use the provided plan code directly.
    const planCode = "PLN_o1h2io6q0pxg36t";

    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Amount in kobo
      plan: planCode, // Use the hardcoded plan code
      metadata: {
        ...metadata,
        userId: userId,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success`,
    });

    return NextResponse.json({ authorization_url: response.data.authorization_url });
  } catch (error: any) {
    console.error('Error initializing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to initialize subscription payment', details: error.message },
      { status: 500 }
    );
  }
}