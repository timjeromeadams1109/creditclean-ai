/**
 * Vitest global setup — runs before each test file.
 * Seeds environment variables so modules that read process.env at
 * import-time don't throw.  Real secrets are never used here.
 */

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key-test";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key-test";
process.env.NEXTAUTH_SECRET = "test-secret-32-chars-minimum-x";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.OWNER_EMAIL = "owner@creditclean.ai";
process.env.OWNER_PASSWORD = "test-owner-password";
process.env.STRIPE_SECRET_KEY = "sk_test_fake";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_fake";
process.env.STRIPE_PREMIUM_PRICE_ID = "price_premium_test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
(process.env as unknown as { NODE_ENV: string }).NODE_ENV = "test";
