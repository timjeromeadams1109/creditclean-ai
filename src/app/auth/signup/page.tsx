"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Scale } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!acceptedTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to sign in with success
      router.push("/auth/signin?registered=1");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
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
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Start cleaning your credit
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Create your free account — no credit card required
          </p>
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
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Full name
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Free Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Terms checkbox */}
            <label className="mt-5 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-medium text-teal-600 underline hover:text-teal-700 dark:text-teal-400">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" target="_blank" className="font-medium text-teal-600 underline hover:text-teal-700 dark:text-teal-400">
                  Privacy Policy
                </Link>
                . I understand CreditClean AI is not a law firm and does not provide
                legal advice.
              </span>
            </label>

            {/* Benefits */}
            <div className="mt-5 space-y-2">
              {[
                "Track items across all 3 bureaus",
                "1 free dispute letter per month",
                "Basic score tracking included",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* Free right notice */}
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-start gap-2">
                <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                  You have the right to dispute inaccurate information on your credit
                  report directly with the credit bureaus at no cost. CreditClean AI
                  provides self-help tools — paid plans are optional.
                </p>
              </div>
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <Link href="/disclaimer" className="underline hover:text-teal-600 dark:hover:text-teal-400">Disclaimer</Link>{" | "}
          <Link href="/refund-policy" className="underline hover:text-teal-600 dark:hover:text-teal-400">Refund Policy</Link>{" | "}
          <Link href="/terms" className="underline hover:text-teal-600 dark:hover:text-teal-400">Terms</Link>{" | "}
          <Link href="/privacy" className="underline hover:text-teal-600 dark:hover:text-teal-400">Privacy</Link>
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
