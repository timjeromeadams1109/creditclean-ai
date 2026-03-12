-- 002_credit_repair.sql
-- CreditClean AI — Credit repair automation schema
-- Supports: negative item tracking, multi-round dispute workflow,
--           letter generation, response analysis, score tracking, legal citations

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE credit_bureau AS ENUM (
  'equifax',
  'experian',
  'transunion'
);

CREATE TYPE credit_item_type AS ENUM (
  'late_payment',
  'collection',
  'charge_off',
  'repossession',
  'foreclosure',
  'bankruptcy',
  'judgment',
  'tax_lien',
  'inquiry',
  'medical_debt',
  'student_loan',
  'other'
);

CREATE TYPE credit_item_status AS ENUM (
  'identified',
  'disputing',
  'responded',
  'escalating',
  'resolved',
  'verified',
  'deleted'
);

CREATE TYPE credit_item_resolution AS ENUM (
  'deleted',
  'updated',
  'verified_accurate',
  'settled',
  'paid_for_delete'
);

CREATE TYPE dispute_strategy AS ENUM (
  'fcra_611_bureau_dispute',
  'fcra_609_verification',
  'fdcpa_809_validation',
  'fcra_623_furnisher_dispute',
  'goodwill_letter',
  'cfpb_complaint',
  'state_ag_complaint',
  'intent_to_litigate'
);

CREATE TYPE dispute_round_outcome AS ENUM (
  'no_response',
  'deleted',
  'updated',
  'verified',
  'partial_update',
  'rejected',
  'settlement_offered'
);

CREATE TYPE dispute_round_status AS ENUM (
  'draft',
  'ready',
  'sent',
  'awaiting_response',
  'response_received',
  'escalating',
  'complete'
);

CREATE TYPE dispute_letter_status AS ENUM (
  'draft',
  'final',
  'sent'
);

CREATE TYPE dispute_response_type AS ENUM (
  'bureau_investigation_result',
  'debt_validation',
  'verification_response',
  'settlement_offer',
  'deletion_confirmation',
  'rejection',
  'other'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- 1. credit_items — Each negative item on a credit report
CREATE TABLE credit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bureau credit_bureau NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT,
  item_type credit_item_type NOT NULL,
  original_creditor TEXT,
  balance DECIMAL(12, 2),
  date_opened DATE,
  date_reported DATE,
  status credit_item_status NOT NULL DEFAULT 'identified',
  resolution credit_item_resolution,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. dispute_rounds — Each round of dispute for an item (up to 5)
CREATE TABLE dispute_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_item_id UUID NOT NULL REFERENCES credit_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  round_number INT NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  strategy dispute_strategy NOT NULL,
  recipient TEXT NOT NULL,
  sent_date DATE,
  deadline_date DATE,
  response_received BOOLEAN NOT NULL DEFAULT false,
  response_date DATE,
  outcome dispute_round_outcome,
  status dispute_round_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (credit_item_id, round_number)
);

-- 3. dispute_letters — Generated letters
CREATE TABLE dispute_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_round_id UUID NOT NULL REFERENCES dispute_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  letter_type dispute_strategy NOT NULL,
  content TEXT NOT NULL,
  legal_basis TEXT[] NOT NULL DEFAULT '{}',
  recipient_name TEXT NOT NULL,
  recipient_address TEXT,
  pdf_url TEXT,
  status dispute_letter_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. dispute_responses — Uploaded responses from bureaus/collectors
CREATE TABLE dispute_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_round_id UUID NOT NULL REFERENCES dispute_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  response_type dispute_response_type NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  summary TEXT,
  key_findings JSONB,
  recommended_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. credit_scores — Score tracking over time
CREATE TABLE credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bureau credit_bureau NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 300 AND 850),
  score_date DATE NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. legal_citations — Reference table of laws/statutes
CREATE TABLE legal_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  law_name TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_text TEXT NOT NULL,
  applicable_to TEXT[] NOT NULL DEFAULT '{}',
  dispute_strategy TEXT NOT NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- credit_items
CREATE INDEX idx_credit_items_user_id ON credit_items(user_id);
CREATE INDEX idx_credit_items_status ON credit_items(status);
CREATE INDEX idx_credit_items_user_status ON credit_items(user_id, status);

-- dispute_rounds
CREATE INDEX idx_dispute_rounds_user_id ON dispute_rounds(user_id);
CREATE INDEX idx_dispute_rounds_credit_item_id ON dispute_rounds(credit_item_id);
CREATE INDEX idx_dispute_rounds_status ON dispute_rounds(status);

-- dispute_letters
CREATE INDEX idx_dispute_letters_user_id ON dispute_letters(user_id);
CREATE INDEX idx_dispute_letters_dispute_round_id ON dispute_letters(dispute_round_id);

-- dispute_responses
CREATE INDEX idx_dispute_responses_user_id ON dispute_responses(user_id);
CREATE INDEX idx_dispute_responses_dispute_round_id ON dispute_responses(dispute_round_id);

-- credit_scores
CREATE INDEX idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX idx_credit_scores_user_bureau_date ON credit_scores(user_id, bureau, score_date);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_credit_items_updated_at
  BEFORE UPDATE ON credit_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_dispute_rounds_updated_at
  BEFORE UPDATE ON dispute_rounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE credit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_citations ENABLE ROW LEVEL SECURITY;

-- credit_items
CREATE POLICY "Users can view their own credit items"
  ON credit_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit items"
  ON credit_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit items"
  ON credit_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit items"
  ON credit_items FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to credit items"
  ON credit_items FOR ALL
  USING (auth.role() = 'service_role');

-- dispute_rounds
CREATE POLICY "Users can view their own dispute rounds"
  ON dispute_rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dispute rounds"
  ON dispute_rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dispute rounds"
  ON dispute_rounds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dispute rounds"
  ON dispute_rounds FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to dispute rounds"
  ON dispute_rounds FOR ALL
  USING (auth.role() = 'service_role');

-- dispute_letters
CREATE POLICY "Users can view their own dispute letters"
  ON dispute_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dispute letters"
  ON dispute_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dispute letters"
  ON dispute_letters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dispute letters"
  ON dispute_letters FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to dispute letters"
  ON dispute_letters FOR ALL
  USING (auth.role() = 'service_role');

-- dispute_responses
CREATE POLICY "Users can view their own dispute responses"
  ON dispute_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dispute responses"
  ON dispute_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dispute responses"
  ON dispute_responses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dispute responses"
  ON dispute_responses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to dispute responses"
  ON dispute_responses FOR ALL
  USING (auth.role() = 'service_role');

-- credit_scores
CREATE POLICY "Users can view their own credit scores"
  ON credit_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit scores"
  ON credit_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit scores"
  ON credit_scores FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit scores"
  ON credit_scores FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to credit scores"
  ON credit_scores FOR ALL
  USING (auth.role() = 'service_role');

-- legal_citations (read-only for all authenticated users, service role manages)
CREATE POLICY "Authenticated users can read legal citations"
  ON legal_citations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to legal citations"
  ON legal_citations FOR ALL
  USING (auth.role() = 'service_role');
