-- Enable RLS on password_reset_tokens (CRITICAL security fix)
-- Prior state: RLS disabled. Any authenticated user could read other users' reset tokens via anon key, enabling account takeover.
-- Target state: service-role only. Password reset flow runs server-side with service role; users never query this table directly.

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Deny all by default (no policies for anon or authenticated). Service role bypasses RLS.
-- Explicit deny policy for clarity and defense-in-depth.
CREATE POLICY "password_reset_tokens: deny all client access"
  ON public.password_reset_tokens
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
