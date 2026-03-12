"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Download,
  Eye,
  CheckCircle2,
  Send,
  Filter,
  X,
  FileText,
} from "lucide-react";
import { DisputeStrategy } from "@/lib/disputes/types";

type LetterStatus = "draft" | "final" | "sent";

interface LetterRow {
  id: string;
  itemName: string;
  strategy: DisputeStrategy;
  recipient: string;
  status: LetterStatus;
  date: string;
  content: string;
}

const strategyLabels: Record<DisputeStrategy, string> = {
  [DisputeStrategy.FCRA_611_BUREAU_DISPUTE]: "FCRA 611 Bureau Dispute",
  [DisputeStrategy.FCRA_609_VERIFICATION]: "FCRA 609 Verification",
  [DisputeStrategy.FDCPA_809_VALIDATION]: "FDCPA 809 Validation",
  [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE]: "FCRA 623 Furnisher Dispute",
  [DisputeStrategy.GOODWILL_LETTER]: "Goodwill Letter",
  [DisputeStrategy.CFPB_COMPLAINT]: "CFPB Complaint",
  [DisputeStrategy.STATE_AG_COMPLAINT]: "State AG Complaint",
  [DisputeStrategy.INTENT_TO_LITIGATE]: "Intent to Litigate",
};

// TODO: Replace with Supabase query — fetch dispute_letters for user
const letters: LetterRow[] = [
  {
    id: "1",
    itemName: "Capital One — Collection",
    strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
    recipient: "Equifax Information Services",
    status: "sent",
    date: "2026-01-15",
    content:
      "Dear Equifax Information Services,\n\nPursuant to the Fair Credit Reporting Act, 15 U.S.C. 1681i, I am writing to dispute the following information in my credit file...\n\nThe item identified as Capital One, account ending in ****4821, is inaccurate and/or incomplete. I request that you investigate this matter and correct or delete the disputed information within 30 days as required by law.\n\nSincerely,\n[Your Name]",
  },
  {
    id: "2",
    itemName: "Capital One — Collection",
    strategy: DisputeStrategy.FDCPA_809_VALIDATION,
    recipient: "Midland Credit Management",
    status: "sent",
    date: "2026-02-20",
    content:
      "Dear Midland Credit Management,\n\nPursuant to the Fair Debt Collection Practices Act, 15 U.S.C. 1692g, I am requesting validation of the alleged debt...\n\nPlease provide: the original signed agreement, a complete payment history, and proof of your authority to collect.\n\nSincerely,\n[Your Name]",
  },
  {
    id: "3",
    itemName: "Medical Center of Dallas",
    strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
    recipient: "Experian",
    status: "final",
    date: "2026-03-08",
    content:
      "Dear Experian,\n\nPursuant to the FCRA, I dispute the medical debt reported by Medical Center of Dallas...\n\nThis item is inaccurate. The HIPAA provisions require additional protections for medical debt reporting.\n\nSincerely,\n[Your Name]",
  },
  {
    id: "4",
    itemName: "Navient — Student Loan",
    strategy: DisputeStrategy.FCRA_609_VERIFICATION,
    recipient: "Experian",
    status: "draft",
    date: "2026-03-10",
    content:
      "Dear Experian,\n\nPursuant to 15 U.S.C. 1681g, I am requesting disclosure of all information in my consumer file regarding the Navient student loan account...\n\nSincerely,\n[Your Name]",
  },
];

const statusConfig: Record<
  LetterStatus,
  { label: string; className: string; icon: typeof Mail }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    icon: FileText,
  },
  final: {
    label: "Final",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    icon: CheckCircle2,
  },
  sent: {
    label: "Sent",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    icon: Send,
  },
};

export default function LettersPage() {
  const [filterStatus, setFilterStatus] = useState<LetterStatus | "all">(
    "all"
  );
  const [filterStrategy, setFilterStrategy] = useState<
    DisputeStrategy | "all"
  >("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = letters.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterStrategy !== "all" && l.strategy !== filterStrategy) return false;
    return true;
  });

  const previewLetter = previewId
    ? letters.find((l) => l.id === previewId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Letters
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          All generated dispute letters. Preview, download, or mark as sent.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as LetterStatus | "all")
          }
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="sent">Sent</option>
        </select>
        <select
          value={filterStrategy}
          onChange={(e) =>
            setFilterStrategy(e.target.value as DisputeStrategy | "all")
          }
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Strategies</option>
          {Object.entries(strategyLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Letters list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Filter className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">
              No letters match your filters.
            </p>
          </div>
        ) : (
          filtered.map((letter, i) => {
            const sc = statusConfig[letter.status];
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Item + strategy */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {letter.itemName}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {strategyLabels[letter.strategy]} — To:{" "}
                      {letter.recipient}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="shrink-0 text-sm text-zinc-500">
                    {letter.date}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {sc.label}
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => setPreviewId(letter.id)}
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="Download PDF"
                    >
                      {/* TODO: Implement PDF download */}
                      <Download className="h-4 w-4" />
                    </button>
                    {letter.status !== "sent" && (
                      <button
                        className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                        title="Mark as Sent"
                      >
                        {/* TODO: Update status in Supabase */}
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Letter preview modal */}
      <AnimatePresence>
        {previewLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setPreviewId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {previewLetter.itemName}
                  </h3>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {strategyLabels[previewLetter.strategy]}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewId(null)}
                  className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 rounded-lg bg-zinc-50 p-5 dark:bg-zinc-800">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {previewLetter.content}
                </pre>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => setPreviewId(null)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
