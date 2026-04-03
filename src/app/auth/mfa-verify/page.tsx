"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield, KeyRound, ShieldCheck, AlertCircle } from "lucide-react";

function MfaVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const { update: updateSession } = useSession();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useBackup, setUseBackup] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid code. Please try again.");
        setIsLoading(false);
        return;
      }

      // Clear the mfaPending flag so middleware stops intercepting this session
      await updateSession({ mfaPending: false });
      router.push(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 shadow-lg shadow-teal-500/25">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              CreditClean AI
            </span>
          </Link>
          <div className="mt-8 flex flex-col items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {useBackup
                ? "Enter one of your 8-character backup codes"
                : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="mfa-code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {useBackup ? "Backup code" : "Authenticator code"}
                </label>
                <input
                  id="mfa-code"
                  type="text"
                  inputMode={useBackup ? "text" : "numeric"}
                  pattern={useBackup ? undefined : "[0-9]*"}
                  autoComplete={useBackup ? "off" : "one-time-code"}
                  placeholder={useBackup ? "XXXXXXXX" : "000000"}
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (useBackup) {
                      setCode(v.toUpperCase().slice(0, 8));
                    } else {
                      setCode(v.replace(/\D/g, "").slice(0, 6));
                    }
                  }}
                  required
                  aria-required="true"
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white py-3 px-4 text-center text-lg font-mono tracking-[0.25em] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                (!useBackup && code.length !== 6) ||
                (useBackup && code.length !== 8)
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            {/* Toggle backup code mode */}
            <div className="mt-6 border-t border-zinc-200 pt-5 text-center dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setUseBackup((prev) => !prev);
                  setCode("");
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400"
              >
                <KeyRound className="h-3.5 w-3.5" />
                {useBackup
                  ? "Use authenticator app instead"
                  : "Use a backup code instead"}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function MfaVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-zinc-950">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      }
    >
      <MfaVerifyContent />
    </Suspense>
  );
}
