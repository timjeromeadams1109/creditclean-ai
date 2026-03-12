import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM = process.env.EMAIL_FROM || "App <notifications@example.com>";

export async function sendNotification(to: string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Skipped (no API key): ${subject}`);
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html });
}

export function notifyAdmins(subject: string, html: string) {
  const emails = (process.env.ADMIN_NOTIFICATION_EMAILS ?? "").split(",").filter(Boolean);
  if (emails.length === 0) return;
  return sendNotification(emails, subject, html);
}
