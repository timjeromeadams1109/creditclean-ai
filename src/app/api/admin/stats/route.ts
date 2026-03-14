import { NextResponse } from "next/server";
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

export async function GET() {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    totalUsersRes,
    newUsersWeekRes,
    newUsersMonthRes,
    freeUsersRes,
    proUsersRes,
    premiumUsersRes,
    totalItemsRes,
    totalRoundsRes,
    totalLettersRes,
    totalReportsRes,
    resolvedItemsRes,
    disputingItemsRes,
    lettersThisMonthRes,
    reportsThisMonthRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_tier", "free"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_tier", "pro"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_tier", "premium"),
    supabase.from("credit_items").select("id", { count: "exact", head: true }),
    supabase.from("dispute_rounds").select("id", { count: "exact", head: true }),
    supabase.from("dispute_letters").select("id", { count: "exact", head: true }),
    supabase.from("forensic_reports").select("id", { count: "exact", head: true }),
    supabase.from("credit_items").select("id", { count: "exact", head: true }).eq("status", "resolved"),
    supabase.from("credit_items").select("id", { count: "exact", head: true }).eq("status", "disputing"),
    supabase.from("dispute_letters").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("forensic_reports").select("id", { count: "exact", head: true }).gte("analyzed_at", monthStart),
  ]);

  const proUsers = proUsersRes.count ?? 0;
  const premiumUsers = premiumUsersRes.count ?? 0;
  const paidUsers = proUsers + premiumUsers;
  const mrr = proUsers * 29 + premiumUsers * 79;

  return NextResponse.json({
    users: {
      total: totalUsersRes.count ?? 0,
      newLast7Days: newUsersWeekRes.count ?? 0,
      newLast30Days: newUsersMonthRes.count ?? 0,
      byTier: {
        free: freeUsersRes.count ?? 0,
        pro: proUsers,
        premium: premiumUsers,
      },
    },
    subscriptions: {
      paid: paidUsers,
      mrr,
      conversionRate: (totalUsersRes.count ?? 0) > 0
        ? Math.round((paidUsers / (totalUsersRes.count ?? 1)) * 100)
        : 0,
    },
    disputes: {
      totalItems: totalItemsRes.count ?? 0,
      totalRounds: totalRoundsRes.count ?? 0,
      totalLetters: totalLettersRes.count ?? 0,
      totalReports: totalReportsRes.count ?? 0,
      resolved: resolvedItemsRes.count ?? 0,
      disputing: disputingItemsRes.count ?? 0,
    },
    activity: {
      lettersThisMonth: lettersThisMonthRes.count ?? 0,
      reportsThisMonth: reportsThisMonthRes.count ?? 0,
    },
  });
}
