import Paystack from 'paystack-node';
import { NextResponse } from 'next/server';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!); // Use ! for non-null assertion since you should have it in .env

interface CreatePlanPayload {
  name: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'biannually' | 'annually';
  amount: number;
}

export async function POST(request: Request) {
  try {
    const body: CreatePlanPayload = await request.json();
    const { name, interval, amount } = body;

    const response = await paystack.plan.create({
      name,
      interval,
      amount: amount * 100, // Amount in kobo
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ error: 'Failed to create subscription plan', details: error.message }, { status: 500 });
  }
}