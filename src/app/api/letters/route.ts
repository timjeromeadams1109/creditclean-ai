import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const strategy = searchParams.get("strategy");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("dispute_rounds")
    .select(`
      id,
      round_number,
      strategy,
      letter_content,
      recipient_name,
      recipient_address,
      legal_basis,
      deadline_days,
      status,
      date_sent,
      created_at,
      credit_items (
        id,
        creditor_name,
        bureau,
        account_number,
        item_type,
        balance
      )
    `, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (strategy && strategy !== "all") {
    query = query.eq("strategy", strategy);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ letters: data || [], total: count ?? 0, page, limit });
}
