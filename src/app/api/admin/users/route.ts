import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (!["owner", "admin"].includes(role ?? "")) return null;
  return session;
}

export async function GET(request: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || "";
  const tier = searchParams.get("tier") || "all";
  const offset = (page - 1) * limit;

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, subscription_tier, role, stripe_customer_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (tier !== "all") {
    query = query.eq("subscription_tier", tier);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Batch fetch counts for all users in 2 queries instead of 2*N
  const userIds = (data || []).map((u: Record<string, unknown>) => u.id as string);

  const [itemsResult, lettersResult] = await Promise.all([
    supabase
      .from("credit_items")
      .select("user_id", { count: "exact" })
      .in("user_id", userIds),
    supabase
      .from("dispute_letters")
      .select("user_id", { count: "exact" })
      .in("user_id", userIds),
  ]);

  // Count per user from batch results
  const itemCounts: Record<string, number> = {};
  const letterCounts: Record<string, number> = {};
  for (const row of (itemsResult.data ?? []) as Array<{ user_id: string }>) {
    itemCounts[row.user_id] = (itemCounts[row.user_id] ?? 0) + 1;
  }
  for (const row of (lettersResult.data ?? []) as Array<{ user_id: string }>) {
    letterCounts[row.user_id] = (letterCounts[row.user_id] ?? 0) + 1;
  }

  const usersWithCounts = (data || []).map((user: Record<string, unknown>) => ({
    ...user,
    itemCount: itemCounts[user.id as string] ?? 0,
    letterCount: letterCounts[user.id as string] ?? 0,
  }));

  return NextResponse.json({
    users: usersWithCounts,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
