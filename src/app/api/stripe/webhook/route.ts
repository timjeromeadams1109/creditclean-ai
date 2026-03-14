import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";
import { sendNotification } from "@/lib/email";
import {
  paymentConfirmationEmail,
  cancellationEmail,
  croaCancellationReminderEmail,
} from "@/lib/email-templates";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 * Handles Stripe subscription lifecycle events.
 * Upgrades/downgrades user tier and sends transactional emails.
 */
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

  const supabase = getServiceSupabase();

  try {
    switch (event.type) {
      // ─── Checkout completed — upgrade user tier ───
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (!userId) break;

        // Determine tier from the price
        const subscriptionId = session.subscription as string;
        let tier = "pro"; // default

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id;
          const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;

          if (priceId && premiumPriceId && priceId === premiumPriceId) {
            tier = "premium";
          }
        }

        // Update user profile
        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            stripe_customer_id: customerId,
          })
          .eq("id", userId);

        // Send payment confirmation email
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .single();

        if (profile?.email) {
          const planName = tier === "premium" ? "Premium" : "Pro";
          const amount = tier === "premium" ? "$79.00" : "$29.00";
          const nextBilling = new Date();
          nextBilling.setMonth(nextBilling.getMonth() + 1);

          const email = paymentConfirmationEmail(
            profile.full_name || "there",
            planName,
            amount,
            nextBilling.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          );
          await sendNotification([profile.email], email.subject, email.html);

          // Schedule CROA 3-day cancellation reminder (send on day 2)
          // In production, use a job queue. For now, we store the purchase date
          // and the daily cron/n8n workflow sends these.
          // CROA 3-day reminder is handled by daily cron/n8n checking purchase dates
        }

        break;
      }

      // ─── Subscription updated (upgrade/downgrade/renewal) ───
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        // Check if subscription is active or cancelled
        if (subscription.status === "active") {
          const priceId = subscription.items.data[0]?.price?.id;
          const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;
          const tier = (priceId && premiumPriceId && priceId === premiumPriceId)
            ? "premium"
            : "pro";

          await supabase
            .from("profiles")
            .update({ subscription_tier: tier })
            .eq("id", profile.id);
        } else if (subscription.cancel_at_period_end) {
          // User cancelled but has access until period end
          const periodEnd = (subscription as unknown as Record<string, number>).current_period_end ?? 0;
          const accessUntil = new Date(periodEnd * 1000);

          if (profile.email) {
            const email = cancellationEmail(
              profile.full_name || "there",
              accessUntil.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            );
            await sendNotification([profile.email], email.subject, email.html);
          }
        }

        break;
      }

      // ─── Subscription deleted (expired or immediately cancelled) ───
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        // Downgrade to free
        await supabase
          .from("profiles")
          .update({ subscription_tier: "free" })
          .eq("id", profile.id);

        // Send cancellation email if not already sent
        if (profile.email) {
          const email = cancellationEmail(
            profile.full_name || "there",
            new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          );
          await sendNotification([profile.email], email.subject, email.html);
        }

        break;
      }

      // ─── Payment failed ───
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile?.email) {
          await sendNotification(
            [profile.email],
            "Payment failed — action required",
            `<p>Hi ${profile.full_name || "there"}, your payment for CreditClean AI failed. Please update your payment method in <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/settings">Settings → Billing</a> to keep your Pro features active.</p>`
          );
        }

        break;
      }
    }
  } catch (err) {
    console.error("[Stripe Webhook] Error processing event:", event.type, err);
    // Return 200 anyway — Stripe retries on 5xx and we don't want duplicate processing
  }

  return NextResponse.json({ received: true });
}
