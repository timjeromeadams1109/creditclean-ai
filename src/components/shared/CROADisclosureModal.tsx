"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, AlertTriangle, CheckCircle2, X } from "lucide-react";

interface CROADisclosureModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when user closes without accepting */
  onClose: () => void;
  /** Called when user accepts all disclosures and wants to proceed */
  onAccept: () => void;
  /** Plan name for display (e.g. "Pro Plan — $29/mo") */
  planName: string;
}

/**
 * Pre-payment CROA disclosure modal.
 * Required by 15 U.S.C. §1679c before collecting any payment for credit repair services.
 * Shows cancellation rights, no-guarantee disclosure, free-right notice, and terms acceptance.
 */
export default function CROADisclosureModal({
  open,
  onClose,
  onAccept,
  planName,
}: CROADisclosureModalProps) {
  const [accepted, setAccepted] = useState({
    terms: false,
    noGuarantee: false,
    freeRight: false,
    cancellation: false,
  });

  const allAccepted = Object.values(accepted).every(Boolean);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Important Disclosures
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Required before purchasing {planName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 px-6 py-5">
          {/* CROA Consumer Rights Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold">
                  Consumer Credit File Rights Under State and Federal Law
                </p>
                <p className="mt-2 leading-relaxed">
                  You have a right to dispute inaccurate information in your credit
                  report by contacting the credit bureau directly. However, neither you
                  nor any &ldquo;credit repair&rdquo; company or credit repair
                  organization has the right to have accurate, current, and verifiable
                  information removed from your credit report.
                </p>
                <p className="mt-2 leading-relaxed">
                  Under the Fair Credit Reporting Act (FCRA), the credit bureau must
                  remove accurate, negative information from your report only if it is
                  outdated (generally after 7 years, or 10 years for bankruptcies).
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgment checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input
                type="checkbox"
                checked={accepted.freeRight}
                onChange={(e) => setAccepted((p) => ({ ...p, freeRight: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                <strong>Free dispute right:</strong> I understand I have the right to
                dispute inaccurate items on my credit report directly with the credit
                bureaus (Equifax, Experian, TransUnion) at no cost.
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input
                type="checkbox"
                checked={accepted.noGuarantee}
                onChange={(e) => setAccepted((p) => ({ ...p, noGuarantee: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                <strong>No guarantee of results:</strong> I understand that CreditClean
                AI cannot guarantee that any item will be removed from my credit report
                or that my credit score will improve.
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input
                type="checkbox"
                checked={accepted.cancellation}
                onChange={(e) => setAccepted((p) => ({ ...p, cancellation: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                <strong>3-day cancellation right:</strong> I understand that under
                CROA (15 U.S.C. &sect;1679e), I have the right to cancel this service
                within 3 business days of purchase for a full refund, without penalty.
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input
                type="checkbox"
                checked={accepted.terms}
                onChange={(e) => setAccepted((p) => ({ ...p, terms: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                I have read and agree to the{" "}
                <Link href="/terms" target="_blank" className="font-medium text-teal-600 underline hover:text-teal-700 dark:text-teal-400">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/privacy" target="_blank" className="font-medium text-teal-600 underline hover:text-teal-700 dark:text-teal-400">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/refund-policy" target="_blank" className="font-medium text-teal-600 underline hover:text-teal-700 dark:text-teal-400">
                  Refund &amp; Cancellation Policy
                </Link>
                .
              </div>
            </label>
          </div>

          {/* Not legal advice notice */}
          <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
            CreditClean AI is not a law firm, does not provide legal advice, and is
            not a substitute for an attorney. This service provides self-help tools
            for educational purposes. No attorney-client relationship is formed by
            using this service.
          </p>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (allAccepted) onAccept();
            }}
            disabled={!allAccepted}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            I Understand — Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
