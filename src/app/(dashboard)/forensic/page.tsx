"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSearch,
  FileText,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

type Bureau = "equifax" | "experian" | "transunion";

interface PreviousReport {
  id: string;
  bureau: Bureau;
  analyzedAt: string;
  findingsCount: number;
  estimatedRemovable: number;
  fileName?: string;
}

const bureauConfig: Record<Bureau, { label: string; color: string }> = {
  equifax: {
    label: "Equifax",
    color:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  experian: {
    label: "Experian",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  transunion: {
    label: "TransUnion",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
};

// TODO: Replace with Supabase query — fetch forensic_reports for user
const previousReports: PreviousReport[] = [
  {
    id: "fr-001",
    bureau: "equifax",
    analyzedAt: "2026-03-10T14:30:00Z",
    findingsCount: 8,
    estimatedRemovable: 5,
    fileName: "equifax-report-march.pdf",
  },
  {
    id: "fr-002",
    bureau: "experian",
    analyzedAt: "2026-03-08T09:15:00Z",
    findingsCount: 6,
    estimatedRemovable: 4,
    fileName: "experian-report-march.pdf",
  },
  {
    id: "fr-003",
    bureau: "transunion",
    analyzedAt: "2026-02-25T16:45:00Z",
    findingsCount: 5,
    estimatedRemovable: 3,
    fileName: "transunion-feb.pdf",
  },
];

export default function ForensicPage() {
  const router = useRouter();
  const [selectedBureau, setSelectedBureau] = useState<Bureau>("equifax");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (PNG, JPG, WebP).");
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("File must be under 25 MB.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUploadAnalyze = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    try {
      // TODO: Upload file to Supabase Storage, then call /api/forensic/upload-analyze
      // For now, simulate a delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirect to results page after analysis
      router.push("/forensic/fr-new");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Forensic Credit Report Analysis
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload your credit report or manually enter items for deep forensic
          analysis. We identify every violation, error, and disputeable item.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Upload Credit Report
            </h2>
          </div>

          {/* Bureau Selector */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bureau
            </label>
            <div className="flex gap-2">
              {(Object.keys(bureauConfig) as Bureau[]).map((bureau) => (
                <button
                  key={bureau}
                  onClick={() => setSelectedBureau(bureau)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    selectedBureau === bureau
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {bureauConfig[bureau].label}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50"
                : selectedFile
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                  : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
            }`}
          >
            {selectedFile ? (
              <>
                <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              </>
            ) : (
              <>
                <FileText className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Drag & drop your credit report
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  PDF, PNG, JPG up to 25 MB
                </p>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload button */}
          <button
            onClick={handleUploadAnalyze}
            disabled={!selectedFile || uploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="h-4 w-4" />
                Upload & Analyze
              </>
            )}
          </button>
        </motion.div>

        {/* Manual Entry Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Manual Entry
            </h2>
          </div>
          <p className="flex-1 text-sm text-zinc-500 dark:text-zinc-400">
            Prefer to enter items yourself? Manually add each account from your
            credit report for forensic analysis. You can enter items from any
            bureau and run the analysis when ready.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/forensic/analyze"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <FileText className="h-4 w-4" />
              Enter Items Manually
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Previous Reports */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Previous Reports
        </h2>
        {previousReports.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <FileSearch className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">
              No previous reports yet. Upload or enter items above to get
              started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {previousReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/forensic/${report.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {/* Bureau badge + file name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${bureauConfig[report.bureau].color}`}
                      >
                        {bureauConfig[report.bureau].label}
                      </span>
                      {report.fileName && (
                        <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                          {report.fileName}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {new Date(report.analyzedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Findings count */}
                  <div className="shrink-0 sm:text-right">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {report.findingsCount} findings
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {report.estimatedRemovable} likely removable
                    </p>
                  </div>

                  <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-400 sm:block" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
