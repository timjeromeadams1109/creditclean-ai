/**
 * Email templates for CreditClean AI.
 * Used with Resend for transactional emails.
 *
 * All emails include CROA disclosures and legal disclaimers as required.
 */

const BRAND = {
  name: "CreditClean AI",
  color: "#0d9488", // teal-600
  url: process.env.NEXT_PUBLIC_APP_URL || "https://creditclean.ai",
};

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);padding:10px 12px;border-radius:12px;">
        <span style="color:#fff;font-size:16px;font-weight:700;letter-spacing:-0.5px;">${BRAND.name}</span>
      </div>
    </div>

    <!-- Content card -->
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e4e4e7;">
      ${content}
    </div>

    <!-- Legal footer -->
    <div style="margin-top:24px;padding:0 8px;text-align:center;">
      <p style="font-size:11px;color:#a1a1aa;line-height:1.6;margin:0 0 8px 0;">
        ${BRAND.name} is not a law firm and does not provide legal advice.
        All tools and letters are for self-help and educational purposes only.
        You have the right to dispute credit report errors directly with bureaus at no cost.
      </p>
      <p style="font-size:11px;color:#a1a1aa;margin:0 0 8px 0;">
        <a href="${BRAND.url}/terms" style="color:#a1a1aa;">Terms</a> &middot;
        <a href="${BRAND.url}/privacy" style="color:#a1a1aa;">Privacy</a> &middot;
        <a href="${BRAND.url}/disclaimer" style="color:#a1a1aa;">Disclaimer</a> &middot;
        <a href="${BRAND.url}/refund-policy" style="color:#a1a1aa;">Refund Policy</a>
      </p>
      <p style="font-size:11px;color:#d4d4d8;margin:0;">
        &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Welcome Email (Day 0) ───

export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: `Welcome to ${BRAND.name} — let's clean your credit`,
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Welcome, ${name}!</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Your free account is ready. Here's how to get started:
      </p>

      <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#0f766e;">Your free plan includes:</p>
        <ul style="margin:0;padding:0 0 0 20px;color:#52525b;font-size:13px;line-height:2;">
          <li>1 forensic analysis per month</li>
          <li>1 dispute letter per month</li>
          <li>Track up to 5 credit items</li>
          <li>3 PDF downloads per month</li>
        </ul>
      </div>

      <div style="margin:0 0 20px;">
        <p style="font-size:14px;font-weight:600;color:#18181b;margin:0 0 8px;">Step 1: Run your first forensic analysis</p>
        <p style="font-size:13px;color:#52525b;margin:0 0 16px;line-height:1.6;">
          Enter your negative credit items and we'll check them against 26 legal violation types — finding errors bureaus hope you never notice.
        </p>
        <a href="${BRAND.url}/forensic" style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
          Start Forensic Analysis &rarr;
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #f4f4f5;margin:24px 0;">

      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        <strong>Important:</strong> You have the right to dispute inaccurate information on your
        credit report directly with the credit bureaus (Equifax, Experian, TransUnion) at no cost.
        ${BRAND.name} is a self-help tool — paid plans are optional.
      </p>
    `),
  };
}

// ─── Upgrade Nudge (Day 3) ───

export function upgradeNudgeEmail(name: string, violationCount: number): { subject: string; html: string } {
  return {
    subject: `Your free report found ${violationCount} potential violations`,
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Your credit has ${violationCount} potential violations, ${name}</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Your free forensic analysis identified issues that could be hurting your credit score.
        With Pro, you can generate dispute letters for every violation — up to 30 per month.
      </p>

      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#92400e;">Free plan limits:</p>
        <p style="margin:0;font-size:13px;color:#78716c;line-height:1.6;">
          You've used your 1 free letter this month. Upgrade to Pro to generate dispute letters
          for all ${violationCount} violations and start cleaning your credit.
        </p>
      </div>

      <a href="${BRAND.url}/settings" style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;margin:0 0 20px;">
        Upgrade to Pro — $29/mo &rarr;
      </a>

      <p style="font-size:12px;color:#a1a1aa;margin:20px 0 0;line-height:1.6;">
        No commitment — cancel anytime. Under CROA, you have the right to cancel within
        3 business days for a full refund.
      </p>
    `),
  };
}

// ─── Letter Reminder (Day 7) ───

export function letterReminderEmail(name: string): { subject: string; html: string } {
  return {
    subject: "Your dispute letters are ready — don't forget to send them",
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Time to send your letters, ${name}</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        You have dispute letters ready to download. For the best results, send them via
        certified mail with return receipt — this creates a paper trail if the bureau
        doesn't respond within 30 days (as required by FCRA &sect;611).
      </p>

      <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#0f766e;">Pro tip:</p>
        <p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;">
          Send each letter via USPS Certified Mail (#7 green card). Keep the tracking number —
          you'll need it if the bureau doesn't respond. Under FCRA, they have 30 days to investigate.
        </p>
      </div>

      <a href="${BRAND.url}/letters" style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
        View My Letters &rarr;
      </a>
    `),
  };
}

// ─── Payment Confirmation ───

export function paymentConfirmationEmail(
  name: string,
  planName: string,
  amount: string,
  nextBillingDate: string
): { subject: string; html: string } {
  return {
    subject: `Payment confirmed — ${planName} is active`,
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">You're on ${planName}, ${name}!</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Your payment of ${amount} has been processed. Your subscription is now active.
      </p>

      <div style="background:#f4f4f5;border-radius:12px;padding:20px;margin:0 0 20px;">
        <table style="width:100%;font-size:13px;color:#52525b;">
          <tr><td style="padding:4px 0;font-weight:600;">Plan</td><td style="text-align:right;">${planName}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Amount</td><td style="text-align:right;">${amount}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Next billing</td><td style="text-align:right;">${nextBillingDate}</td></tr>
        </table>
      </div>

      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="margin:0;font-size:12px;color:#92400e;line-height:1.6;">
          <strong>Your cancellation rights (CROA):</strong> Under 15 U.S.C. &sect;1679e, you have
          the right to cancel this service within 3 business days for a full refund. After that,
          you may cancel anytime from
          <a href="${BRAND.url}/settings" style="color:#92400e;">Settings &rarr; Billing</a>
          or by emailing
          <a href="mailto:support@creditclean.ai" style="color:#92400e;">support@creditclean.ai</a>.
        </p>
      </div>

      <a href="${BRAND.url}/dashboard" style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
        Go to Dashboard &rarr;
      </a>
    `),
  };
}

// ─── Cancellation Confirmation ───

export function cancellationEmail(
  name: string,
  accessUntil: string
): { subject: string; html: string } {
  return {
    subject: "Your CreditClean AI subscription has been cancelled",
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Subscription cancelled</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Hi ${name}, your subscription has been cancelled. You'll retain access to Pro features
        until <strong>${accessUntil}</strong>.
      </p>

      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        After that date, your account will revert to the free plan. Your data (credit items,
        dispute history, letters) will be preserved — you just won't be able to generate
        new letters beyond the free tier limit.
      </p>

      <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="margin:0;font-size:13px;color:#0f766e;line-height:1.6;">
          Changed your mind? You can resubscribe anytime from
          <a href="${BRAND.url}/settings" style="color:#0f766e;font-weight:600;">Settings &rarr; Billing</a>.
        </p>
      </div>

      <p style="font-size:12px;color:#a1a1aa;margin:0;line-height:1.6;">
        If you have questions about your refund or billing, contact
        <a href="mailto:support@creditclean.ai" style="color:#a1a1aa;">support@creditclean.ai</a>.
      </p>
    `),
  };
}

// ─── CROA 3-Day Cancellation Window Reminder (Day 2 after purchase) ───

export function croaCancellationReminderEmail(name: string, purchaseDate: string): { subject: string; html: string } {
  return {
    subject: "Reminder: Your 3-day cancellation window ends tomorrow",
    html: layout(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Cancellation window reminder</h1>
      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Hi ${name}, this is a reminder that under the Credit Repair Organizations Act (CROA),
        you have the right to cancel your subscription within 3 business days of your purchase
        on ${purchaseDate} for a full refund.
      </p>

      <p style="color:#52525b;font-size:14px;line-height:1.7;margin:0 0 20px;">
        <strong>Your 3-day window ends tomorrow.</strong> If you're happy with the service,
        no action is needed — your subscription will continue.
      </p>

      <div style="margin:0 0 20px;">
        <a href="${BRAND.url}/settings" style="display:inline-block;border:2px solid #ef4444;color:#ef4444;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;margin-right:8px;">
          Cancel &amp; Get Refund
        </a>
        <a href="${BRAND.url}/dashboard" style="display:inline-block;background:linear-gradient(135deg,${BRAND.color},#10b981);color:#fff;padding:12px 24px;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;">
          Keep My Subscription &rarr;
        </a>
      </div>

      <p style="font-size:12px;color:#a1a1aa;margin:0;line-height:1.6;">
        This reminder is sent in compliance with 15 U.S.C. &sect;1679e.
        You can also cancel by emailing
        <a href="mailto:support@creditclean.ai" style="color:#a1a1aa;">support@creditclean.ai</a>.
      </p>
    `),
  };
}
