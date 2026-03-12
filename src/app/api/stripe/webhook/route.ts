import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret || !stripe) {
    return NextResponse.json({ error: "Not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // Handle successful checkout
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // Handle subscription changes
      break;
  }

  return NextResponse.json({ received: true });
}
