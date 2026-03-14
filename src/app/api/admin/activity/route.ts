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

interface TimeSeriesPoint {
  date: string;
  count: number;
}

function generateLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function bucketByDate(rows: Record<string, unknown>[], dateField: string, days: string[]): TimeSeriesPoint[] {
  const counts: Record<string, number> = {};
  for (const day of days) counts[day] = 0;

  for (const row of rows) {
    const val = row[dateField] as string | null;
    if (!val) continue;
    const day = val.split("T")[0];
    if (day in counts) counts[day]++;
  }

  return days.map((date) => ({ date, count: counts[date] }));
}

export async function GET() {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const days = generateLast30Days();
  const since = days[0] + "T00:00:00Z";

  const [signupsRes, lettersRes, reportsRes] = await Promise.all([
    supabase.from("profiles").select("created_at").gte("created_at", since),
    supabase.from("dispute_letters").select("created_at").gte("created_at", since),
    supabase.from("forensic_reports").select("analyzed_at").gte("analyzed_at", since),
  ]);

  return NextResponse.json({
    signups: bucketByDate(signupsRes.data || [], "created_at", days),
    letters: bucketByDate(lettersRes.data || [], "created_at", days),
    reports: bucketByDate(reportsRes.data || [], "analyzed_at", days),
  });
}
