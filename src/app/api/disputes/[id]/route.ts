import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { validate, disputeUpdateSchema } from "@/lib/validation";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

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

  // Fetch round, letter, and responses in parallel
  const [roundResult, letterResult, responsesResult] = await Promise.all([
    supabase
      .from("dispute_rounds")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single(),
    supabase
      .from("dispute_letters")
      .select("*")
      .eq("dispute_round_id", id)
      .single(),
    supabase
      .from("dispute_responses")
      .select("*")
      .eq("dispute_round_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (roundResult.error || !roundResult.data) {
    return NextResponse.json({ error: "Dispute round not found" }, { status: 404 });
  }

  return NextResponse.json({ round: roundResult.data, letter: letterResult.data, responses: responsesResult.data ?? [] });
}

export async function PUT(
  req: NextRequest,
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { id } = await params;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const parsed = validate(disputeUpdateSchema, body);
    if ('error' in parsed) return parsed.error;

    // Verify ownership
    const { data: existing } = await supabase
      .from("dispute_rounds")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Dispute round not found" }, { status: 404 });
    }

    // Build update — supports marking as sent, updating status, recording outcome
    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (parsed.data.status) updateFields.status = parsed.data.status;
    if (parsed.data.date_sent) updateFields.date_sent = parsed.data.date_sent;
    if (parsed.data.tracking_number) updateFields.tracking_number = parsed.data.tracking_number;
    if (parsed.data.outcome) updateFields.outcome = parsed.data.outcome;

    const { data, error } = await supabase
      .from("dispute_rounds")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ round: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
