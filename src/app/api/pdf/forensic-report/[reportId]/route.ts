import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { generateForensicReportPDF } from "@/lib/pdf/generate";
import type { ForensicReport, ForensicFinding } from "@/lib/pdf/forensic-report-pdf";
import type { Bureau, ItemType, Violation } from "@/lib/disputes/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { reportId } = await params;
  const supabase = getServiceSupabase();

  try {
    // Fetch the forensic report
    const { data: reportData, error: reportError } = await supabase
      .from("forensic_reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (reportError || !reportData) {
      return NextResponse.json(
        { error: "Forensic report not found" },
        { status: 404 }
      );
    }

    // Fetch user profile for consumer name
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    const consumerName = profileData?.full_name ?? "Consumer";

    // Build the ForensicReport from DB data
    const reportContent =
      (reportData.report_content as Record<string, unknown>) ?? {};

    const findings: ForensicFinding[] = Array.isArray(reportContent.findings)
      ? (reportContent.findings as Record<string, unknown>[]).map((f) => ({
          itemId: (f.itemId as string) ?? "",
          creditorName: (f.creditorName as string) ?? "",
          accountNumber: (f.accountNumber as string) ?? "",
          itemType: (f.itemType as ItemType) ?? "other",
          bureau: (f.bureau as Bureau) ?? "equifax",
          violations: Array.isArray(f.violations)
            ? (f.violations as Violation[])
            : [],
          removalProbability: (f.removalProbability as number) ?? 0,
          priorityScore: (f.priorityScore as number) ?? 0,
          analysis: (f.analysis as string) ?? "",
          recommendedAction: (f.recommendedAction as string) ?? "",
          legalBasis: Array.isArray(f.legalBasis)
            ? (f.legalBasis as string[])
            : [],
        }))
      : [];

    const actionPlan = Array.isArray(reportContent.actionPlan)
      ? (reportContent.actionPlan as Record<string, unknown>[]).map((a) => ({
          priority: (a.priority as number) ?? 0,
          action: (a.action as string) ?? "",
          deadline: (a.deadline as string) ?? "",
          itemId: (a.itemId as string) ?? undefined,
        }))
      : [];

    const legalReferences = Array.isArray(reportContent.legalReferences)
      ? (reportContent.legalReferences as Record<string, unknown>[]).map(
          (r) => ({
            statute: (r.statute as string) ?? "",
            description: (r.description as string) ?? "",
          })
        )
      : [];

    const report: ForensicReport = {
      consumerName,
      bureau: (reportData.bureau as Bureau) ?? "equifax",
      reportDate: reportData.created_at
        ? new Date(reportData.created_at as string).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      totalItems: (reportContent.totalItems as number) ?? 0,
      negativeItems: (reportContent.negativeItems as number) ?? 0,
      disputeableItems: (reportContent.disputeableItems as number) ?? 0,
      estimatedRemovable: (reportContent.estimatedRemovable as number) ?? 0,
      scoreImpactEstimate:
        (reportContent.scoreImpactEstimate as string) ?? "N/A",
      findings,
      actionPlan,
      legalReferences,
    };

    // Generate PDF
    const pdfBuffer = await generateForensicReportPDF(report);

    // Build filename
    const bureau = (reportData.bureau as string) ?? "report";
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `forensic-report-${bureau}-${dateStr}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate forensic report PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
