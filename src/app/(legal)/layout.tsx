import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — CreditClean AI",
  description:
    "Terms of Service, Privacy Policy, and Legal Disclaimers for CreditClean AI.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              CreditClean AI
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <nav className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/terms"
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                Privacy
              </Link>
              <Link
                href="/disclaimer"
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                Disclaimer
              </Link>
              <Link
                href="/refund-policy"
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                Refund Policy
              </Link>
            </nav>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Last updated: March 11, 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
