import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { validate, letterStatusSchema } from "@/lib/validation";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

export async function PATCH(
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

  const body = await req.json();
  const parsed = validate(letterStatusSchema, body);
  if ('error' in parsed) return parsed.error;
  const { status } = parsed.data;

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "sent") {
    update.date_sent = new Date().toISOString().split("T")[0];
  }

  const { data, error } = await supabase
    .from("dispute_rounds")
    .update(update)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ letter: data });
}
