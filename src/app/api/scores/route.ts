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
  const bureau = searchParams.get("bureau");

  let query = supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false });

  if (bureau) query = query.eq("bureau", bureau);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scores: data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const { bureau, score, score_type, recorded_at } = body;

    if (!bureau || score == null) {
      return NextResponse.json({ error: "bureau and score are required" }, { status: 400 });
    }

    if (typeof score !== "number" || score < 300 || score > 850) {
      return NextResponse.json({ error: "Score must be a number between 300 and 850" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("credit_scores")
      .insert({
        user_id: userId,
        bureau,
        score,
        score_type: score_type ?? "vantage_3",
        recorded_at: recorded_at ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ score: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
