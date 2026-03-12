"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Gavel,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  ArrowRight,
  Zap,
  Scale,
} from "lucide-react";
import type {
  ForensicReport,
  ForensicFinding,
  Recommendation,
} from "@/lib/forensic/types";

const riskColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const riskBadge: Record<string, string> = {
  critical:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  high:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  medium:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  low:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

const removalBadge: Record<string, string> = {
  very_high:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  high:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  moderate:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  low:
    "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

const bureauBadge: Record<string, string> = {
  equifax:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  experian:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  transunion:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

const methodLabels: Record<string, string> = {
  dispute_letter: "Dispute Letter",
  debt_validation: "Debt Validation",
  verification_request: "Verification Request",
  goodwill: "Goodwill Letter",
  cfpb_complaint: "CFPB Complaint",
  state_ag: "State AG Complaint",
  cease_desist: "Cease & Desist",
  intent_to_litigate: "Intent to Litigate",
};

// TODO: Replace with Supabase fetch
const mockReport: ForensicReport = {
  id: "fr-001",
  userId: "owner",
  bureau: "equifax",
  analyzedAt: "2026-03-10T14:30:00Z",
  totalItems: 12,
  negativeItems: 8,
  disputeableItems: 7,
  estimatedRemovable: 5,
  findings: [
    {
      id: "f-1",
      itemDescription: "Collection account with balance discrepancy",
      accountName: "Midland Credit Management",
      accountNumber: "****4521",
      bureau: "equifax",
      itemType: "Collection",
      reportedBalance: 4500,
      dateOpened: "2023-06-15",
      dateReported: "2026-02-01",
      currentStatus: "Collection",
      violations: [
        {
          law: "FDCPA",
          uscReference: "15 U.S.C. 1692g",
          violationType: "Failure to validate debt",
          description:
            "Collector failed to provide adequate validation within 30 days of initial communication.",
          evidence:
            "No validation notice found in report. Account shows no evidence of original creditor documentation.",
          severity: "severe",
          actionableSteps: [
            "Send FDCPA 809 debt validation letter",
            "If not validated within 30 days, demand deletion",
          ],
          estimatedDamages: "$1,000 per violation",
        },
        {
          law: "FCRA",
          uscReference: "15 U.S.C. 1681s-2",
          violationType: "Inaccurate balance reporting",
          description:
            "Reported balance does not match original creditor records. Balance inflated by unverified fees.",
          evidence:
            "Original balance was $3,200. Currently reporting $4,500 with no documentation of additional charges.",
          severity: "moderate",
          actionableSteps: [
            "Dispute inaccurate balance with bureau",
            "Request itemized statement from collector",
          ],
        },
      ],
      recommendations: [
        {
          priority: 1,
          action: "Send FDCPA 809 Debt Validation Letter to Midland Credit Management",
          method: "debt_validation",
          targetRecipient: "Midland Credit Management",
          legalBasis: ["15 U.S.C. 1692g", "15 U.S.C. 1692e"],
          expectedOutcome: "Debt validation or deletion within 30 days",
          template: "fdcpa_809",
        },
      ],
      riskLevel: "critical",
      removalProbability: "very_high",
      legalBasis: ["15 U.S.C. 1692g", "15 U.S.C. 1681s-2"],
      priorityScore: 95,
    },
    {
      id: "f-2",
      itemDescription: "Late payment with reporting date errors",
      accountName: "Capital One",
      accountNumber: "****7890",
      bureau: "equifax",
      itemType: "Late Payment",
      reportedBalance: 0,
      dateOpened: "2020-03-10",
      dateReported: "2026-01-15",
      currentStatus: "Open",
      violations: [
        {
          law: "FCRA",
          uscReference: "15 U.S.C. 1681s-2(a)",
          violationType: "Reporting outdated information",
          description:
            "Late payment reported beyond the 7-year reporting window for the delinquency date shown.",
          evidence:
            "First delinquency date of 02/2019 exceeds the 7-year FCRA reporting limit.",
          severity: "severe",
          actionableSteps: [
            "Dispute with bureau citing FCRA 605(a) time limitation",
            "Request deletion of outdated information",
          ],
        },
      ],
      recommendations: [
        {
          priority: 2,
          action: "Send FCRA 611 dispute to Equifax for outdated reporting",
          method: "dispute_letter",
          targetRecipient: "Equifax",
          legalBasis: ["15 U.S.C. 1681c(a)", "15 U.S.C. 1681i"],
          expectedOutcome: "Deletion of outdated late payment entry",
          template: "fcra_611",
        },
      ],
      riskLevel: "high",
      removalProbability: "high",
      legalBasis: ["15 U.S.C. 1681c(a)"],
      priorityScore: 85,
    },
    {
      id: "f-3",
      itemDescription: "Medical collection under $500",
      accountName: "IC System",
      accountNumber: "****2233",
      bureau: "equifax",
      itemType: "Medical Debt",
      reportedBalance: 340,
      dateOpened: "2024-08-20",
      dateReported: "2025-12-01",
      currentStatus: "Collection",
      violations: [
        {
          law: "FCRA",
          uscReference: "15 U.S.C. 1681c-1",
          violationType: "Medical debt under $500 on credit report",
          description:
            "Per FCRA amendments effective 2023, medical debts under $500 cannot appear on consumer credit reports.",
          evidence:
            "Balance of $340 is below the $500 threshold for medical debt reporting.",
          severity: "critical",
          actionableSteps: [
            "Dispute with bureau citing medical debt reporting prohibition",
            "File CFPB complaint if not removed within 30 days",
          ],
        },
      ],
      recommendations: [
        {
          priority: 1,
          action:
            "Send FCRA dispute to Equifax — medical debt under $500 must be removed",
          method: "dispute_letter",
          targetRecipient: "Equifax",
          legalBasis: ["15 U.S.C. 1681c-1"],
          expectedOutcome: "Mandatory deletion — medical debt under $500",
          template: "fcra_611",
        },
      ],
      riskLevel: "critical",
      removalProbability: "very_high",
      legalBasis: ["15 U.S.C. 1681c-1"],
      priorityScore: 98,
    },
  ],
  prioritizedActions: [
    {
      priority: 1,
      action:
        "Dispute medical collection ($340) with Equifax — mandatory deletion under FCRA",
      method: "dispute_letter",
      targetRecipient: "Equifax",
      legalBasis: ["15 U.S.C. 1681c-1"],
      expectedOutcome: "Guaranteed deletion — medical debt under $500",
      template: "fcra_611",
    },
    {
      priority: 2,
      action:
        "Send FDCPA 809 debt validation to Midland Credit Management",
      method: "debt_validation",
      targetRecipient: "Midland Credit Management",
      legalBasis: ["15 U.S.C. 1692g"],
      expectedOutcome: "Validation failure leads to deletion",
      template: "fdcpa_809",
    },
    {
      priority: 3,
      action:
        "Dispute outdated Capital One late payment with Equifax",
      method: "dispute_letter",
      targetRecipient: "Equifax",
      legalBasis: ["15 U.S.C. 1681c(a)", "15 U.S.C. 1681i"],
      expectedOutcome: "Deletion of outdated information",
      template: "fcra_611",
    },
  ],
  estimatedTimeline: "3-5 months",
  estimatedScoreImpact: "+50-80 points",
  totalViolations: 4,
  violationsByLaw: { FDCPA: 1, FCRA: 3 },
  estimatedTotalDamages: "$2,000-4,000",
};

export default function ForensicReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const router = useRouter();
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [generatingLetters, setGeneratingLetters] = useState(false);
  const [creatingItems, setCreatingItems] = useState(false);

  useEffect(() => {
    // TODO: Fetch from /api/forensic/reports/[reportId]
    const timer = setTimeout(() => {
      setReport({ ...mockReport, id: reportId as string });
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [reportId]);

  const handleGenerateAllLetters = async () => {
    if (!report) return;
    setGeneratingLetters(true);
    try {
      const res = await fetch("/api/forensic/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id }),
      });
      if (!res.ok) throw new Error("Failed to generate letters");
      // TODO: Navigate to letters page or show download
      router.push("/letters");
    } catch {
      // TODO: Show error toast
    } finally {
      setGeneratingLetters(false);
    }
  };

  const handleCreateDisputeItems = async () => {
    if (!report) return;
    setCreatingItems(true);
    try {
      // TODO: POST each finding as a credit_item via /api/items
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/items");
    } catch {
      // TODO: Show error toast
    } finally {
      setCreatingItems(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertTriangle className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
        <p className="mt-3 text-sm text-zinc-500">Report not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Forensic Analysis Report
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="capitalize">{report.bureau}</span> report analyzed{" "}
            {new Date(report.analyzedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4" />
            Full Report (PDF)
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Mail className="h-4 w-4" />
            All Letters (PDF)
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Scale className="h-4 w-4" />
            Attorney Package
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Shield className="h-5 w-5 text-blue-600" />
          Executive Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={FileText}
            label="Items Analyzed"
            value={report.totalItems.toString()}
            sub={`${report.negativeItems} negative items`}
          />
          <SummaryCard
            icon={AlertTriangle}
            label="Disputeable Items"
            value={report.disputeableItems.toString()}
            sub={`${report.estimatedRemovable} est. removable`}
            highlight
          />
          <SummaryCard
            icon={TrendingUp}
            label="Est. Score Impact"
            value={report.estimatedScoreImpact}
            sub={report.estimatedTimeline}
          />
          <SummaryCard
            icon={Gavel}
            label="Violations Found"
            value={report.totalViolations.toString()}
            sub={report.estimatedTotalDamages + " est. damages"}
          />
        </div>
      </motion.div>

      {/* Findings Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Findings ({report.findings.length})
        </h2>
        <div className="space-y-3">
          {report.findings
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((finding, i) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Finding header */}
                <button
                  onClick={() =>
                    setExpandedFinding(
                      expandedFinding === finding.id ? null : finding.id
                    )
                  }
                  className="flex w-full items-start gap-4 p-4 text-left"
                >
                  {/* Risk bar */}
                  <div
                    className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${riskColors[finding.riskLevel]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {finding.accountName}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${bureauBadge[finding.bureau] || ""}`}
                      >
                        {finding.bureau.charAt(0).toUpperCase() +
                          finding.bureau.slice(1)}
                      </span>
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        {finding.itemType}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {finding.itemDescription}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${removalBadge[finding.removalProbability]}`}
                      >
                        {finding.removalProbability.replace("_", " ")} removal
                        probability
                      </span>
                      <span className="text-xs text-zinc-400">
                        Priority: {finding.priorityScore}/100
                      </span>
                      <span className="text-xs text-zinc-400">
                        {finding.violations.length} violation
                        {finding.violations.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-1">
                    {expandedFinding === finding.id ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedFinding === finding.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="space-y-4 p-4">
                        {/* Violations */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Violations
                          </h4>
                          <div className="space-y-3">
                            {finding.violations.map((v, vi) => (
                              <div
                                key={vi}
                                className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {v.law}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {v.uscReference}
                                  </span>
                                  <span
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${riskBadge[v.severity]}`}
                                  >
                                    {v.severity}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                                  {v.description}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  <strong>Evidence:</strong> {v.evidence}
                                </p>
                                {v.estimatedDamages && (
                                  <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    Est. damages: {v.estimatedDamages}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Legal Basis */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Legal Basis
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {finding.legalBasis.map((basis) => (
                              <span
                                key={basis}
                                className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              >
                                {basis}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Recommendations
                          </h4>
                          {finding.recommendations.map((rec, ri) => (
                            <div
                              key={ri}
                              className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                            >
                              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                  {rec.action}
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-500">
                                  {methodLabels[rec.method] || rec.method}{" "}
                                  <ArrowRight className="inline h-3 w-3" />{" "}
                                  {rec.targetRecipient}
                                </p>
                                <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                                  Expected: {rec.expectedOutcome}
                                </p>
                              </div>
                              <button className="shrink-0 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Generate Letter
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Action Plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <Gavel className="h-5 w-5 text-blue-600" />
            Action Plan
          </h2>
          <button
            onClick={handleGenerateAllLetters}
            disabled={generatingLetters}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {generatingLetters ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Generate All Round 1 Letters
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {report.prioritizedActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {action.priority}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {action.action}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    {methodLabels[action.method] || action.method}
                  </span>
                  <span>
                    <ArrowRight className="inline h-3 w-3" />{" "}
                    {action.targetRecipient}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {action.legalBasis.map((basis) => (
                    <span
                      key={basis}
                      className="text-xs text-blue-600 dark:text-blue-400"
                    >
                      {basis}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Expected: {action.expectedOutcome}
                </p>
              </div>
              <button className="shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Generate Letter
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-100">
            Ready to start disputing?
          </p>
          <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">
            Create dispute items in your tracker to manage the full process.
          </p>
        </div>
        <button
          onClick={handleCreateDisputeItems}
          disabled={creatingItems}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {creatingItems ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Items...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Create Dispute Items
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50"
          : "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            highlight
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        />
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${
          highlight
            ? "text-blue-700 dark:text-blue-300"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
    </div>
  );
}
