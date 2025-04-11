import Paystack from 'paystack-node';
import { buffer } from 'node:stream/consumers';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust import path

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const rawBody = await buffer(request.body as any);
  const signature = request.headers.get('x-paystack-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
  }

  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

  if (hash === signature) {
    try {
      const event = JSON.parse(rawBody.toString());

      // Idempotency check
      const existingEvent = await db.processedEvent.findUnique({
        where: { eventId: event.id }, // Assuming event.id is unique
      });

      if (existingEvent) {
        console.log('Duplicate event received:', event.id);
        return new NextResponse('Duplicate event', { status: 200 }); // Or 202
      }

      await db.processedEvent.create({ data: { eventId: event.id } });

      switch (event.event) {
        case 'charge.success':
          if (event.data.plan) {
            const { customer, plan, metadata, reference } = event.data;
            const userId = metadata?.userId as string | undefined;

            if (userId) {
              const user = await db.user.findUnique({ where: { id: userId } });
              if (user) {
                const existingSubscription = await db.subscription.findFirst({
                  where: { userId: userId, paystackSubscriptionId: event.data.subscription_id },
                });

                if (!existingSubscription && event.data.subscription_id) {
                  await db.subscription.create({
                    data: {
                      userId: user.id,
                      paystackSubscriptionId: event.data.subscription_id,
                      paystackPlanId: plan.id,
                      status: 'active',
                      startDate: new Date(),
                      nextPaymentDate: new Date(event.data.next_payment_date),
                      amount: plan.amount,
                      interval: plan.interval,
                      currency: plan.currency,
                      transactionReference: reference,
                    },
                  });
                  console.log('New subscription recorded:', event.data.subscription_id);
                } else if (existingSubscription) {
                  await db.subscription.update({
                    where: { id: existingSubscription.id },
                    data: {
                      status: 'active',
                      nextPaymentDate: new Date(event.data.next_payment_date),
                      transactionReference: reference,
                    },
                  });
                  console.log('Existing subscription updated:', existingSubscription.id);
                }
              }
            }
          }
          break;
        case 'subscription.create':
          console.log('New subscription created on Paystack:', event.data);
          break;
        case 'subscription.payment_failed':
          console.log('Subscription payment failed:', event.data);
          if (event.data.subscription_id) {
            await db.subscription.update({
              where: { paystackSubscriptionId: event.data.subscription_id },
              data: { status: 'payment_failed', nextPaymentDate: new Date(event.data.next_payment_date) },
            });
          }
          break;
        case 'subscription.disable':
          console.log('Subscription disabled:', event.data);
          if (event.data.subscription_id) {
            await db.subscription.update({
              where: { paystackSubscriptionId: event.data.subscription_id },
              data: { status: 'cancelled', endDate: new Date() },
            });
          }
          break;
        default:
          console.log('Unhandled Paystack event:', event.event);
          break;
      }

      return new NextResponse('Webhook received successfully', { status: 200 });
    } catch (error: any) {
      console.error('Error processing webhook event:', error);
      return NextResponse.json({ error: 'Error processing webhook', details: error.message }, { status: 500 });
    }
  } else {
    return new NextResponse('Invalid signature', { status: 401 });
  }
}