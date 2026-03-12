"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, X } from "lucide-react";

interface DisclaimerBannerProps {
  /** Allow the user to dismiss the banner. Defaults to true. */
  dismissible?: boolean;
  /** Optional className override for positioning. */
  className?: string;
}

export default function DisclaimerBanner({
  dismissible = true,
  className = "",
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/40 ${className}`}
      role="status"
      aria-label="Legal disclaimer"
    >
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="flex-1 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
          CreditClean AI is not a law firm and does not provide legal advice.
          Letters and analysis are for self-help and educational purposes.{" "}
          <Link
            href="/disclaimer"
            className="font-medium underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100"
          >
            Consult a qualified attorney
          </Link>{" "}
          for legal advice specific to your situation.
        </p>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900 dark:hover:text-amber-200"
            aria-label="Dismiss disclaimer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
