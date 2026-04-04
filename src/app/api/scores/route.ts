import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { validate, scoreCreateSchema } from "@/lib/validation";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

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
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const parsed = validate(scoreCreateSchema, body);
    if ('error' in parsed) return parsed.error;
    const { bureau, score, score_type, recorded_at } = parsed.data;

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
