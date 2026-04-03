-- ============================================================
-- MFA fields on profiles
-- ============================================================
-- Adds TOTP-based multi-factor authentication columns.
-- mfa_secret stores the AES-256-GCM encrypted TOTP secret.
-- mfa_backup_codes stores bcrypt-hashed one-time codes (array).

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS mfa_enabled      BOOLEAN       NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS mfa_secret       TEXT,
  ADD COLUMN IF NOT EXISTS mfa_backup_codes TEXT[];
