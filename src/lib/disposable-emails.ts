/**
 * Block disposable/temporary email domains on signup.
 * These are commonly used to abuse free tiers.
 * List sourced from common disposable email providers.
 */

const DISPOSABLE_DOMAINS = new Set([
  // Top disposable email providers
  "10minutemail.com", "10minutemail.net", "tempmail.com", "tempmail.net",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrilla.ml",
  "mailinator.com", "mailinator.net", "mailinator2.com",
  "yopmail.com", "yopmail.fr", "yopmail.net",
  "throwaway.email", "throwaway.me",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "spam4.me",
  "trashmail.com", "trashmail.me", "trashmail.net", "trashmail.org",
  "dispostable.com", "maildrop.cc", "mailnesia.com",
  "getnada.com", "nada.email", "anonbox.net",
  "tempail.com", "tempr.email", "temp-mail.org", "temp-mail.io",
  "fakeinbox.com", "fakemail.net", "emailondeck.com",
  "mohmal.com", "harakirimail.com",
  "mailcatch.com", "mailsac.com", "inboxbear.com",
  "discard.email", "discardmail.com", "discardmail.de",
  "mintemail.com", "flitmail.com",
  "getairmail.com", "filzmail.com",
  "mailforspam.com", "spamgourmet.com", "spambox.us",
  "mytemp.email", "burnermail.io", "tempinbox.com",
  "guerrillamail.de", "guerrillamail.biz",
  "crazymailing.com", "armyspy.com", "dayrep.com",
  "einrot.com", "fleckens.hu", "gustr.com", "jourrapide.com",
  "rhyta.com", "superrito.com", "teleworm.us",
  "mailnull.com", "spamcero.com", "spamhole.com",
  "jetable.org", "trash-mail.com",
  "bugmenot.com", "notmail.com",
  "safetymail.info", "trashymail.com", "trashymail.net",
  "tempmailo.com", "tempmailaddress.com",
  "emailfake.com", "cuvox.de", "icznn.com",
  // Catch-all patterns — add more as you see abuse
  "mailtemp.net", "tempmailer.com", "disposableemailaddresses.emailmiser.com",
]);

/**
 * Check if an email address uses a known disposable/temporary domain.
 * Returns true if the email should be blocked.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().trim().split("@")[1];
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Get the count of blocked domains (for monitoring).
 */
export function getBlockedDomainCount(): number {
  return DISPOSABLE_DOMAINS.size;
}
