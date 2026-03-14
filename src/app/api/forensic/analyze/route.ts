import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { analyzeFullReport, parseManualEntry } from "@/lib/forensic";
import { checkUsageLimit } from "@/lib/usage-limits";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Rate limit
  const rl = checkRateLimit(userId, "generate");
  if (!rl.allowed) return rateLimitResponse(rl);

  // Usage limit
  const usage = await checkUsageLimit(userId, "forensic_report");
  if (!usage.allowed) {
    return NextResponse.json(
      { error: usage.reason, limit: usage.limit, used: usage.used, tier: usage.tier },
      { status: 403 }
    );
  }

  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const { items, bureau, state } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one credit item is required." },
        { status: 400 }
      );
    }

    if (!bureau) {
      return NextResponse.json(
        { error: "Bureau is required." },
        { status: 400 }
      );
    }

    // Parse manual entries into ParsedCreditItem format
    const parsedItems = items.map((item: Record<string, unknown>) => {
      // Map form field names to ParsedCreditItem fields
      const mapped: Record<string, unknown> = {
        ...item,
        balance: item.currentBalance !== "" ? Number(item.currentBalance) : 0,
        originalBalance:
          item.originalBalance !== "" ? Number(item.originalBalance) : undefined,
        highBalance:
          item.highBalance !== "" ? Number(item.highBalance) : undefined,
        creditLimit:
          item.creditLimit !== "" ? Number(item.creditLimit) : undefined,
        pastDueAmount:
          item.pastDueAmount !== "" ? Number(item.pastDueAmount) : undefined,
        dateOfFirstDelinquency: item.firstDelinquencyDate || undefined,
      };
      return parseManualEntry(mapped);
    });

    // Run the full forensic analysis engine
    const reportDate = new Date().toISOString().split("T")[0];
    const report = analyzeFullReport(
      parsedItems,
      reportDate,
      bureau,
      state || "CA"
    );

    // Assign user ID to the report
    report.userId = userId;

    // Save to forensic_reports table
    const { error: dbError } = await supabase.from("forensic_reports").insert({
      id: report.id,
      user_id: userId,
      bureau,
      state: state || null,
      analyzed_at: report.analyzedAt,
      total_items: report.totalItems,
      negative_items: report.negativeItems,
      disputeable_items: report.disputeableItems,
      estimated_removable: report.estimatedRemovable,
      estimated_timeline: report.estimatedTimeline,
      estimated_score_impact: report.estimatedScoreImpact,
      total_violations: report.totalViolations,
      violations_by_law: report.violationsByLaw,
      estimated_total_damages: report.estimatedTotalDamages,
      report_data: report,
    });

    if (dbError) {
      console.error("Failed to save forensic report:", dbError);
      // Continue — return report even if save fails
    }

    return NextResponse.json({ report }, { status: 201 });
  } catch (err) {
    console.error("Forensic analysis error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
