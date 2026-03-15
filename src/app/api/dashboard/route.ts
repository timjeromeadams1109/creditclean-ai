import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const userName = (session.user as Record<string, unknown>).name as string | undefined;
  const supabase = getServiceSupabase();

  // Fetch scores, items, and active rounds in parallel
  const [scoresResult, itemsResult, roundsResult] = await Promise.all([
    supabase
      .from("credit_scores")
      .select("bureau, score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("credit_items")
      .select("id, bureau, creditor_name, item_type, balance, status")
      .eq("user_id", userId),
    supabase
      .from("dispute_rounds")
      .select("id, credit_item_id, round_number, status, date_sent, deadline_days, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const scores = scoresResult.data ?? [];
  const items = itemsResult.data ?? [];
  const rounds = roundsResult.data ?? [];

  // Build bureau scores — latest per bureau with change from previous
  const bureauScores: Array<{
    bureau: string;
    score: number;
    change: number;
    trend: "up" | "down";
  }> = [];

  for (const bureau of ["equifax", "experian", "transunion"]) {
    const bureauScoreRows = scores
      .filter((s: Record<string, unknown>) => s.bureau === bureau)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
      );

    if (bureauScoreRows.length > 0) {
      const latest = bureauScoreRows[0].score as number;
      const previous = bureauScoreRows.length > 1 ? (bureauScoreRows[1].score as number) : latest;
      const change = latest - previous;
      bureauScores.push({
        bureau,
        score: latest,
        change,
        trend: change >= 0 ? "up" : "down",
      });
    }
  }

  // Build stats
  const resolvedStatuses = ["deleted", "resolved", "updated"];
  const disputingStatuses = ["draft", "sent", "awaiting"];
  const itemsResolved = items.filter((i: Record<string, unknown>) =>
    resolvedStatuses.includes((i.status as string || "").toLowerCase())
  ).length;
  const itemsDisputing = items.filter((i: Record<string, unknown>) =>
    disputingStatuses.includes((i.status as string || "").toLowerCase())
  ).length;

  const stats = {
    activeDisputes: rounds.filter((r: Record<string, unknown>) =>
      ["draft", "sent", "awaiting"].includes((r.status as string || "").toLowerCase())
    ).length,
    itemsTracked: items.length,
    itemsResolved,
    itemsDisputing,
    itemsPending: items.length - itemsResolved - itemsDisputing,
  };

  // Build active disputes list — join rounds with items
  const itemMap = new Map<string, Record<string, unknown>>();
  for (const item of items) {
    itemMap.set(item.id as string, item);
  }

  // Count rounds per item for totalRounds
  const roundCountByItem = new Map<string, number>();
  for (const r of rounds) {
    const key = r.credit_item_id as string;
    roundCountByItem.set(key, (roundCountByItem.get(key) ?? 0) + 1);
  }

  const activeDisputes = rounds
    .filter((r: Record<string, unknown>) =>
      ["draft", "sent", "awaiting"].includes((r.status as string || "").toLowerCase())
    )
    .slice(0, 10)
    .map((r: Record<string, unknown>) => {
      const item = itemMap.get(r.credit_item_id as string);
      const bureau = ((item?.bureau as string) || "equifax").toLowerCase();
      const dateSent = r.date_sent ? new Date(r.date_sent as string) : null;
      const deadlineDays = (r.deadline_days as number) || 30;
      let daysRemaining = 30;
      if (dateSent) {
        const deadline = new Date(dateSent.getTime() + deadlineDays * 24 * 60 * 60 * 1000);
        daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      }

      const statusRaw = ((r.status as string) || "draft").toLowerCase();
      const statusMap: Record<string, string> = {
        draft: "Draft",
        sent: "Sent",
        awaiting: "Awaiting",
        responded: "Responded",
      };

      return {
        id: item?.id || r.id,
        account: `${item?.creditor_name || "Unknown"} — ${(item?.item_type as string || "other").replace(/_/g, " ")}`,
        bureau,
        round: r.round_number as number,
        totalRounds: roundCountByItem.get(r.credit_item_id as string) ?? 1,
        status: statusMap[statusRaw] || "Draft",
        daysRemaining,
      };
    });

  return NextResponse.json({
    userName: userName || "there",
    bureauScores,
    stats,
    activeDisputes,
  });
}
