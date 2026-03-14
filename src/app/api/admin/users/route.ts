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

  // Get item counts per user
  const userIds = (data || []).map((u: Record<string, unknown>) => u.id as string);
  const usersWithCounts = await Promise.all(
    (data || []).map(async (user: Record<string, unknown>) => {
      const { count: itemCount } = await supabase
        .from("credit_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: letterCount } = await supabase
        .from("dispute_letters")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      return {
        ...user,
        itemCount: itemCount ?? 0,
        letterCount: letterCount ?? 0,
      };
    })
  );

  return NextResponse.json({
    users: usersWithCounts,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
