import Paystack from 'paystack-node';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust import path

interface InitializeSubscriptionPayload {
  email: string;
  amount: number;
  plan?: string;
  metadata?: Record<string, any>;
  userId: string; // Add userId to the payload
}

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body: InitializeSubscriptionPayload = await request.json();
    const { email, amount, plan, metadata, userId } = body;

    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Amount in kobo
      plan,
      metadata: {
        ...metadata,
        userId: userId, // Include userId in Paystack metadata
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success`,
    });

    // Optionally, you might want to create a pending Subscription record here
    // in your database, which will be updated upon successful payment via webhook.

    return NextResponse.json(response.data.authorization_url);
  } catch (error: any) {
    console.error('Error initializing subscription:', error);
    return NextResponse.json({ error: 'Failed to initialize subscription payment', details: error.message }, { status: 500 });
  }
}