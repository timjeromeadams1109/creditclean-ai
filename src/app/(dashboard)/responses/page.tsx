"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  CloudUpload,
  X,
  Sparkles,
} from "lucide-react";

interface ResponseEntry {
  id: string;
  fileName: string;
  uploadDate: string;
  itemName: string;
  bureau: string;
  outcome: string;
  violationsDetected: string[];
  recommendedAction: string;
  summary: string;
}

// TODO: Replace with Supabase query — fetch uploaded responses with AI analysis
const responses: ResponseEntry[] = [
  {
    id: "1",
    fileName: "equifax-response-feb2026.pdf",
    uploadDate: "2026-02-10",
    itemName: "Capital One — Collection",
    bureau: "Equifax",
    outcome: "Verified — Item remains on report",
    violationsDetected: [
      "Failed to provide method of verification as required by FCRA 611(a)(6)(B)(iii)",
      "Response did not address all disputed items",
    ],
    recommendedAction:
      "Escalate to FDCPA 809 debt validation with Midland Credit Management",
    summary:
      "Equifax verified the Capital One collection account but failed to describe the verification method used. This is a procedural violation that strengthens the next dispute round.",
  },
  {
    id: "2",
    fileName: "experian-response-mar2026.pdf",
    uploadDate: "2026-03-08",
    itemName: "Medical Center of Dallas — Medical Debt",
    bureau: "Experian",
    outcome: "Under Investigation",
    violationsDetected: [],
    recommendedAction:
      "Wait for final response. If no response within 30 days, item must be deleted per FCRA timeline requirements.",
    summary:
      "Experian acknowledged the dispute and stated investigation is in progress. Response received within required timeframe. No violations detected at this stage.",
  },
];

export default function ResponsesPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploading(true);
    // TODO: Upload file to Supabase Storage, then trigger AI analysis
    // 1. Upload to supabase.storage.from("responses").upload(...)
    // 2. Call AI analysis endpoint to OCR + extract outcome + detect violations
    // 3. Insert response record into dispute_responses table
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false);
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      // TODO: Same upload + analysis flow as drop handler
      await new Promise((r) => setTimeout(r, 1500));
      setUploading(false);
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Responses
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload bureau and creditor responses for AI-powered analysis and next
          step recommendations.
        </p>
      </div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Uploading and analyzing...
              </p>
            </div>
          ) : (
            <>
              <CloudUpload
                className={`h-10 w-10 ${
                  isDragging
                    ? "text-blue-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              />
              <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Drag and drop response documents here
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                PDF, JPG, or PNG — max 10MB
              </p>
              <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </motion.div>

      {/* Responses list */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Analyzed Responses
        </h2>
        <div className="space-y-4">
          {responses.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <Upload className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500">
                No responses uploaded yet.
              </p>
            </div>
          ) : (
            responses.map((response, i) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <FileText className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {response.itemName}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {response.fileName} — {response.bureau} —{" "}
                        {response.uploadDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI analysis */}
                <div className="space-y-4 p-5">
                  {/* Outcome */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Outcome
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {response.outcome}
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                      AI Analysis
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {response.summary}
                    </p>
                  </div>

                  {/* Violations */}
                  {response.violationsDetected.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-red-500">
                        Violations Detected
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {response.violationsDetected.map((v, vi) => (
                          <li
                            key={vi}
                            className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400"
                          >
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            {v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended action */}
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Recommended Next Action
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                      {response.recommendedAction}
                    </p>
                    <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                      {/* TODO: Auto-generate next letter based on recommendation */}
                      <CheckCircle2 className="h-4 w-4" />
                      Accept Recommendation
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
