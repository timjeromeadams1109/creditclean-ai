import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

const itemUpdateSchema = z.object({
  bureau: z.string().optional(),
  item_type: z.string().optional(),
  creditor_name: z.string().optional(),
  account_number: z.string().optional().nullable(),
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { id } = await params;
  const supabase = getServiceSupabase();

  // Fetch credit item + dispute rounds + letters in parallel
  const [itemResult, roundsResult, lettersResult] = await Promise.all([
    supabase
      .from("credit_items")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single(),
    supabase
      .from("dispute_rounds")
      .select("*")
      .eq("credit_item_id", id)
      .order("round_number", { ascending: true }),
    supabase
      .from("dispute_letters")
      .select("*")
      .eq("credit_item_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (itemResult.error || !itemResult.data) {
    return NextResponse.json({ error: "Credit item not found" }, { status: 404 });
  }

  // Fetch dispute responses (depends on round IDs)
  const roundIds = (roundsResult.data ?? []).map((r: Record<string, unknown>) => r.id);
  let responses: Record<string, unknown>[] = [];
  if (roundIds.length > 0) {
    const { data: respData } = await supabase
      .from("dispute_responses")
      .select("*")
      .in("dispute_round_id", roundIds)
      .order("created_at", { ascending: true });
    responses = respData ?? [];
  }

  return NextResponse.json({ item: itemResult.data, rounds: roundsResult.data ?? [], letters: lettersResult.data ?? [], responses });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { id } = await params;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const validation = itemUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("credit_items")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Credit item not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("credit_items")
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { id } = await params;
  const supabase = getServiceSupabase();

  const { error } = await supabase
    .from("credit_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
