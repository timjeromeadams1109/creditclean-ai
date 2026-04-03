import { z } from 'zod';
import { NextResponse } from 'next/server';

export function validate<T>(schema: z.ZodType<T>, data: unknown): { data: T } | { error: NextResponse } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { error: NextResponse.json({ error: 'Invalid request', details: result.error.flatten().fieldErrors }, { status: 400 }) };
  }
  return { data: result.data };
}

// POST /api/auth/signup
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// POST /api/auth/forgot-password
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// POST /api/auth/reset-password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// POST /api/admin/changelog
export const changelogCreateSchema = z.object({
  version: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().optional(),
});

// DELETE /api/admin/changelog
export const changelogDeleteSchema = z.object({
  id: z.string().uuid(),
});

// POST /api/disputes/generate
export const disputeGenerateSchema = z.object({
  creditItemId: z.string().uuid(),
  strategy: z.string().optional(),
  userProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
    ssnLast4: z.string(),
    dob: z.string(),
    email: z.string(),
    phone: z.string(),
  }).optional().nullable(),
});

// PUT /api/disputes/[id]
export const disputeUpdateSchema = z.object({
  status: z.string().optional(),
  date_sent: z.string().optional(),
  tracking_number: z.string().optional(),
  outcome: z.string().optional(),
});

// POST /api/items
export const itemCreateSchema = z.object({
  bureaus: z.union([z.string(), z.array(z.string())]),
  item_type: z.string(),
  creditor_name: z.string(),
  account_number: z.string().optional(),
  balance: z.number().optional().nullable(),
  original_balance: z.number().optional().nullable(),
  date_opened: z.string().optional().nullable(),
  date_reported: z.string().optional().nullable(),
  status: z.string().optional(),
  collector_name: z.string().optional().nullable(),
  collector_address: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  is_medical: z.boolean().optional(),
  late_payment_dates: z.array(z.string()).optional().nullable(),
  inquiry_date: z.string().optional().nullable(),
  inquiry_creditor: z.string().optional().nullable(),
  user_notes: z.string().optional().nullable(),
});

// POST /api/scores
export const scoreCreateSchema = z.object({
  bureau: z.string().min(1),
  score: z.number().min(300).max(850),
  score_type: z.string().optional(),
  recorded_at: z.string().optional(),
});

// POST /api/forensic/analyze
export const forensicAnalyzeSchema = z.object({
  items: z.array(z.record(z.unknown())).min(1, 'At least one credit item is required'),
  bureau: z.string().min(1, 'Bureau is required'),
  state: z.string().optional(),
});

// POST /api/forensic/generate-all
export const forensicGenerateAllSchema = z.object({
  reportId: z.string().uuid(),
});

// POST /api/stripe/checkout
export const stripeCheckoutSchema = z.object({
  priceId: z.string().min(1, 'priceId is required'),
  croaAccepted: z.literal(true, { errorMap: () => ({ message: 'CROA disclosures must be accepted' }) }),
});

// PATCH /api/letters/[id]
export const letterStatusSchema = z.object({
  status: z.enum(['draft', 'final', 'sent', 'awaiting_response']),
});
