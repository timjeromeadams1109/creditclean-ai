"use client";

import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";

/**
 * Site-wide legal footer for the dashboard.
 * Includes links to all legal pages, CROA notice, contact info, and CFPB/FTC complaint links.
 */
export default function LegalFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-8 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl">
        {/* Main links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/disclaimer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Disclaimer
          </Link>
          <Link href="/refund-policy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Refund &amp; Cancellation
          </Link>
          <a href="mailto:legal@creditclean.ai" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            legal@creditclean.ai
          </a>
        </div>

        {/* CROA + free-right disclosure */}
        <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          CreditClean AI is not a law firm and does not provide legal advice. All letters
          and analysis are for self-help and educational purposes only.{" "}
          <strong className="text-zinc-500 dark:text-zinc-400">
            You have the right to dispute inaccurate information on your credit report
            directly with credit bureaus at no cost.
          </strong>{" "}
          Under the Credit Repair Organizations Act (CROA), 15 U.S.C. &sect;1679 et seq.,
          you have the right to cancel any contract with a credit repair organization
          within 3 business days.
        </p>

        {/* Regulatory complaint links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>File a complaint:</span>
          <a
            href="https://www.consumerfinance.gov/complaint/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            CFPB <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href="https://reportfraud.ftc.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            FTC <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href="https://www.naag.org/find-my-ag/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            State Attorney General <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-teal-600 to-emerald-500">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} CreditClean AI. Not a law firm. Not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
