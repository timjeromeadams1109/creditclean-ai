"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Upload,
  FileText,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  Bureau,
  ItemType,
  DisputeStrategy,
  DisputeOutcome,
} from "@/lib/disputes/types";

const strategyLabels: Record<DisputeStrategy, string> = {
  [DisputeStrategy.FCRA_611_BUREAU_DISPUTE]: "FCRA 611 — Bureau Dispute",
  [DisputeStrategy.FCRA_609_VERIFICATION]: "FCRA 609 — Verification Request",
  [DisputeStrategy.FDCPA_809_VALIDATION]: "FDCPA 809 — Debt Validation",
  [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE]: "FCRA 623 — Furnisher Dispute",
  [DisputeStrategy.GOODWILL_LETTER]: "Goodwill Letter",
  [DisputeStrategy.CFPB_COMPLAINT]: "CFPB Complaint",
  [DisputeStrategy.STATE_AG_COMPLAINT]: "State AG Complaint",
  [DisputeStrategy.INTENT_TO_LITIGATE]: "Intent to Litigate",
};

const outcomeLabels: Record<DisputeOutcome, string> = {
  [DisputeOutcome.DELETED]: "Deleted",
  [DisputeOutcome.UPDATED]: "Updated",
  [DisputeOutcome.VERIFIED]: "Verified (Still Reporting)",
  [DisputeOutcome.NO_RESPONSE]: "No Response (Violation!)",
  [DisputeOutcome.PARTIAL_UPDATE]: "Partial Update",
  [DisputeOutcome.INVESTIGATION_IN_PROGRESS]: "Investigation In Progress",
};

// TODO: Replace with Supabase query — fetch credit_item by ID with dispute_rounds
const itemDetail = {
  id: "1",
  creditorName: "Capital One",
  originalCreditor: "Capital One Bank",
  bureau: Bureau.EQUIFAX,
  itemType: ItemType.COLLECTION,
  accountNumber: "****4821",
  balance: 2340,
  originalBalance: 1890,
  dateOpened: "2023-06-15",
  dateReported: "2024-01-22",
  status: "Collection",
  collectorName: "Midland Credit Management",
  userNotes: "Never received validation notice. Disputed verbally once before.",
  rounds: [
    {
      roundNumber: 1,
      strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
      dateSent: "2026-01-15",
      deadlineDate: "2026-02-14",
      recipientName: "Equifax Information Services",
      status: "completed" as const,
      outcome: DisputeOutcome.VERIFIED,
      responseDate: "2026-02-10",
      letterPreview:
        "Dear Equifax Information Services,\n\nPursuant to the Fair Credit Reporting Act, 15 U.S.C. 1681i, I am writing to dispute the following information...",
    },
    {
      roundNumber: 2,
      strategy: DisputeStrategy.FDCPA_809_VALIDATION,
      dateSent: "2026-02-20",
      deadlineDate: "2026-03-22",
      recipientName: "Midland Credit Management",
      status: "awaiting_response" as const,
      outcome: null,
      responseDate: null,
      letterPreview:
        "Dear Midland Credit Management,\n\nPursuant to the Fair Debt Collection Practices Act, 15 U.S.C. 1692g, I am requesting validation of the alleged debt...",
    },
  ],
  canEscalate: true,
  nextStrategy: DisputeStrategy.FCRA_623_FURNISHER_DISPUTE,
};

const roundStatusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  },
  awaiting_response: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
  },
  draft: {
    icon: FileText,
    color: "text-zinc-400",
    bgColor: "bg-zinc-400",
  },
};

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // TODO: Fetch item from Supabase using id
  const item = itemDetail;

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {item.creditorName}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {item.bureau.charAt(0).toUpperCase() + item.bureau.slice(1)} —{" "}
          {item.accountNumber}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Item info card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Item Details
          </h2>
          <dl className="mt-4 space-y-3">
            {[
              { label: "Creditor", value: item.creditorName },
              { label: "Original Creditor", value: item.originalCreditor },
              { label: "Collector", value: item.collectorName || "—" },
              { label: "Bureau", value: item.bureau.charAt(0).toUpperCase() + item.bureau.slice(1) },
              { label: "Account #", value: item.accountNumber },
              { label: "Type", value: item.itemType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
              { label: "Status", value: item.status },
              {
                label: "Balance",
                value: `$${item.balance.toLocaleString()}`,
              },
              {
                label: "Original Balance",
                value: `$${item.originalBalance?.toLocaleString() ?? "—"}`,
              },
              { label: "Date Opened", value: item.dateOpened },
              { label: "Date Reported", value: item.dateReported },
            ].map((field) => (
              <div
                key={field.label}
                className="flex justify-between border-b border-zinc-100 pb-2 last:border-0 dark:border-zinc-800"
              >
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                  {field.label}
                </dt>
                <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
          {item.userNotes && (
            <div className="mt-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Notes
              </p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {item.userNotes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Dispute timeline + actions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Dispute Timeline
            </h2>
            <div className="mt-6 space-y-0">
              {item.rounds.map((round, i) => {
                const config = roundStatusConfig[round.status];
                const Icon = config.icon;
                const isLast = i === item.rounds.length - 1;

                return (
                  <div key={round.roundNumber} className="relative flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          round.status === "completed"
                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
                            : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      {!isLast && (
                        <div className="h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                      )}
                    </div>

                    {/* Round content */}
                    <div className="flex-1 pb-8">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          Round {round.roundNumber}:{" "}
                          {strategyLabels[round.strategy]}
                        </h3>
                        <span className="text-xs text-zinc-500">
                          Sent {round.dateSent}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        To: {round.recipientName}
                      </p>

                      {/* Outcome */}
                      {round.outcome && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                          {round.outcome === DisputeOutcome.VERIFIED && (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                          )}
                          {round.outcome === DisputeOutcome.DELETED && (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          )}
                          {outcomeLabels[round.outcome]}
                          {round.responseDate && (
                            <span className="text-zinc-400">
                              — {round.responseDate}
                            </span>
                          )}
                        </div>
                      )}

                      {round.status === "awaiting_response" && (
                        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Deadline: {round.deadlineDate}
                        </div>
                      )}

                      {/* Letter preview */}
                      <details className="mt-3 group">
                        <summary className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          View Letter
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {round.letterPreview}
                        </pre>
                      </details>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            {item.canEscalate && (
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                <Mail className="h-4 w-4" />
                Generate Next Letter
                <span className="rounded bg-blue-500 px-1.5 py-0.5 text-xs">
                  {strategyLabels[item.nextStrategy].split("—")[0].trim()}
                </span>
              </button>
            )}
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
              <Upload className="h-4 w-4" />
              Upload Response
            </button>
          </motion.div>

          {/* Resolution status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Resolution Status
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  In Progress — Round 2 of Escalation
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Awaiting response from Midland Credit Management. Deadline:
                  March 22, 2026.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
