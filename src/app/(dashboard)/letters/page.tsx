"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { DisputeStrategy } from "@/lib/disputes/types";

type LetterStatus = "draft" | "final" | "sent";

interface LetterRow {
  id: string;
  round_number: number;
  strategy: DisputeStrategy;
  letter_content: string;
  recipient_name: string;
  recipient_address: string;
  legal_basis: string[];
  deadline_days: number;
  status: LetterStatus;
  date_sent: string | null;
  created_at: string;
  credit_items: {
    id: string;
    creditor_name: string;
    bureau: string;
    account_number: string;
    item_type: string;
    balance: number;
  } | null;
}

const strategyLabels: Record<string, string> = {
  [DisputeStrategy.FCRA_611_BUREAU_DISPUTE]: "FCRA 611 Bureau Dispute",
  [DisputeStrategy.FCRA_609_VERIFICATION]: "FCRA 609 Verification",
  [DisputeStrategy.FDCPA_809_VALIDATION]: "FDCPA 809 Validation",
  [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE]: "FCRA 623 Furnisher Dispute",
  [DisputeStrategy.GOODWILL_LETTER]: "Goodwill Letter",
  [DisputeStrategy.CFPB_COMPLAINT]: "CFPB Complaint",
  [DisputeStrategy.STATE_AG_COMPLAINT]: "State AG Complaint",
  [DisputeStrategy.INTENT_TO_LITIGATE]: "Intent to Litigate",
};

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
      "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
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
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LetterStatus | "all">("all");
  const [filterStrategy, setFilterStrategy] = useState<DisputeStrategy | "all">("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLetters = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterStrategy !== "all") params.set("strategy", filterStrategy);
      const res = await fetch(`/api/letters?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLetters(data.letters || []);
      }
    } catch {
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterStrategy]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const handleDownload = async (letter: LetterRow) => {
    setDownloadingId(letter.id);
    try {
      const res = await fetch(`/api/pdf/letter/${letter.id}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const bureau = letter.credit_items?.bureau || "dispute";
      const date = new Date().toISOString().split("T")[0];
      a.download = `dispute-letter-${bureau}-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Could show toast — for now silently fail
    } finally {
      setDownloadingId(null);
    }
  };

  const handleMarkSent = async (letterId: string) => {
    setUpdatingId(letterId);
    try {
      const res = await fetch(`/api/letters/${letterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      });
      if (res.ok) {
        setLetters((prev) =>
          prev.map((l) =>
            l.id === letterId
              ? { ...l, status: "sent" as LetterStatus, date_sent: new Date().toISOString().split("T")[0] }
              : l
          )
        );
      }
    } catch {
      // Keep existing state
    } finally {
      setUpdatingId(null);
    }
  };

  const previewLetter = previewId ? letters.find((l) => l.id === previewId) : null;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Letters
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {letters.length} dispute letter{letters.length !== 1 ? "s" : ""} generated. Preview, download PDF, or mark as sent.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LetterStatus | "all")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-teal-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="sent">Sent</option>
        </select>
        <select
          value={filterStrategy}
          onChange={(e) => setFilterStrategy(e.target.value as DisputeStrategy | "all")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-teal-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Strategies</option>
          {Object.entries(strategyLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Letters list */}
      <div className="space-y-3">
        {letters.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Filter className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">
              {loading ? "Loading letters..." : "No letters yet. Run a forensic analysis and generate letters to get started."}
            </p>
          </div>
        ) : (
          letters.map((letter, i) => {
            const sc = statusConfig[letter.status] || statusConfig.draft;
            const StatusIcon = sc.icon;
            const itemName = letter.credit_items
              ? `${letter.credit_items.creditor_name} — ${letter.credit_items.bureau}`
              : "Unknown Item";
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {itemName}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {strategyLabels[letter.strategy] || letter.strategy} — To: {letter.recipient_name}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-zinc-500">
                    {new Date(letter.created_at).toLocaleDateString()}
                  </span>

                  <span className={`inline-flex items-center gap-1 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {sc.label}
                  </span>

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => setPreviewId(letter.id)}
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(letter)}
                      disabled={downloadingId === letter.id}
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="Download PDF"
                    >
                      {downloadingId === letter.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </button>
                    {letter.status !== "sent" && (
                      <button
                        onClick={() => handleMarkSent(letter.id)}
                        disabled={updatingId === letter.id}
                        className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                        title="Mark as Sent"
                      >
                        {updatingId === letter.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
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
                    {previewLetter.credit_items?.creditor_name || "Dispute Letter"}
                  </h3>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {strategyLabels[previewLetter.strategy] || previewLetter.strategy} — Round {previewLetter.round_number}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewId(null)}
                  className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(previewLetter.legal_basis || []).map((basis: string) => (
                  <span key={basis} className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {basis}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-zinc-50 p-5 dark:bg-zinc-800">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {previewLetter.letter_content}
                </pre>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleDownload(previewLetter)}
                  disabled={downloadingId === previewLetter.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {downloadingId === previewLetter.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download PDF
                </button>
                <button
                  onClick={() => setPreviewId(null)}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
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
