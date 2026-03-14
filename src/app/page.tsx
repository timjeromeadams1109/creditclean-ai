"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  FileSearch,
  Mail,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Scale,
  Send,
  Lock,
  Zap,
  Gavel,
  BarChart3,
  Download,
  BookOpen,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

/* ─── Data ─── */

const features = [
  {
    icon: FileSearch,
    title: "Forensic Analysis",
    description:
      "Every item checked against 26 legal violation types. We find errors bureaus hope you never notice.",
    stat: "26 checks",
  },
  {
    icon: Mail,
    title: "8 Letter Templates",
    description:
      "FCRA §611, §609, §623, FDCPA §809, goodwill, CFPB, state AG, and intent to litigate.",
    stat: "8 templates",
  },
  {
    icon: Zap,
    title: "5-Round Escalation",
    description:
      "Automatic strategy progression from initial dispute to regulatory complaints.",
    stat: "5 rounds",
  },
  {
    icon: Gavel,
    title: "Attorney Package",
    description:
      "Litigation-ready document bundles with damages calculation and case law citations.",
    stat: "20+ citations",
  },
  {
    icon: Download,
    title: "PDF Downloads",
    description:
      "Print-ready dispute letters formatted for certified mail, citing specific USC sections.",
    stat: "Print ready",
  },
  {
    icon: BarChart3,
    title: "Score Tracking",
    description:
      "Monitor progress across all 3 bureaus. See which disputes moved the needle.",
    stat: "3 bureaus",
  },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Small Business Owner",
    score: "+127 pts",
    stars: 5,
    text: "I had 6 collections on my report, 4 were removed within 60 days. The forensic analysis found violations I never would have caught myself.",
  },
  {
    name: "Danielle R.",
    role: "First-Time Homebuyer",
    stars: 5,
    score: "+89 pts",
    text: "Went from 580 to 669 in 3 months. Got approved for my mortgage. The escalation letters are incredibly detailed.",
  },
  {
    name: "James K.",
    role: "Veteran",
    stars: 5,
    score: "+156 pts",
    text: "The attorney package feature alone is worth it. My lawyer said the documents were better than what most firms produce.",
  },
  {
    name: "Priya S.",
    role: "Teacher",
    stars: 4,
    score: "+94 pts",
    text: "Simple to use and the legal language is already done for you. 3 items removed so far and I'm only on round 2.",
  },
];

const faqs = [
  {
    question: "Is this legal?",
    answer:
      "Absolutely. You have a federally protected right to dispute inaccurate information on your credit report under the FCRA (15 U.S.C. §1681). CreditClean AI simply helps you exercise those rights more effectively.",
  },
  {
    question: "Do I need a lawyer?",
    answer:
      "Not initially. The platform generates legally-grounded dispute letters that cite specific federal statutes. If your case escalates to the litigation stage, our Attorney Package Generator creates documents your lawyer can use immediately.",
  },
  {
    question: "How long does credit repair take?",
    answer:
      "Most users see significant improvement within 3-6 months. Bureaus are legally required to respond to disputes within 30 days, and our 5-round escalation strategy applies increasing pressure with each cycle.",
  },
  {
    question: "Will this hurt my credit score?",
    answer:
      "No. Filing disputes does not affect your credit score. In fact, successfully removing inaccurate negative items typically results in a score increase.",
  },
  {
    question: "What's the difference between this and credit repair companies?",
    answer:
      "Credit repair companies charge $79-$149/month and often use generic template letters. CreditClean AI puts you in control with forensic analysis, law-specific dispute strategies, and letters that cite actual federal statutes — at a fraction of the cost.",
  },
  {
    question: "Is my information secure?",
    answer:
      "Yes. All data is protected with 256-bit AES encryption in transit and at rest. We never share your information with third parties, and we never perform credit checks.",
  },
];

/* ─── Animated Counter Hook ─── */

function useCounter(target: number, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (startOnMount) setStarted(true);
  }, [startOnMount]);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, start };
}

/* ─── Score Ring Component ─── */

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = score / 850;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth="10"
        />
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          className="transition-all duration-1000 ease-out"
        />
        <text x="65" y="60" textAnchor="middle" className="fill-zinc-900 dark:fill-zinc-50 text-2xl font-bold" fontSize="28" fontWeight="700">
          {score}
        </text>
        <text x="65" y="80" textAnchor="middle" className="fill-zinc-500" fontSize="11">
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ─── Page ─── */

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Calculator state
  const [negativeItems, setNegativeItems] = useState(5);
  const [avgAge, setAvgAge] = useState(24);
  const [hasCollections, setHasCollections] = useState(3);

  // Animated counters
  const items = useCounter(10000);
  const violations = useCounter(2400000);
  const rate = useCounter(73);

  // Calculator result
  const estimatedImprovement = Math.round(
    negativeItems * 12 + (avgAge < 24 ? 15 : avgAge < 48 ? 10 : 5) + hasCollections * 18
  );
  const estimatedScore = Math.min(850, 550 + estimatedImprovement);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prices = {
    monthly: { free: 0, pro: 29, premium: 59 },
    annual: { free: 0, pro: 24, premium: 49 },
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
      {/* ──── Navigation ──── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/60 bg-stone-50/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500">
              <Shield className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              CreditClean AI
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#how-it-works" className="text-sm font-medium text-zinc-600 transition-colors hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400">
              Features
            </Link>
            <Link href="#calculator" className="text-sm font-medium text-zinc-600 transition-colors hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400">
              Score Calculator
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
            >
              Start Free Trial
            </Link>
            <button
              className="ml-1 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200/60 bg-stone-50 px-4 pb-4 pt-2 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
            {["How It Works", "Features", "Score Calculator", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ──── Split Hero ──── */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-50/60 via-transparent to-emerald-50/30 dark:from-teal-950/20 dark:to-emerald-950/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
              <Scale className="h-4 w-4" />
              Powered by Federal Consumer Protection Law
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
              Your Credit Report Has Errors.{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                The Law Says They Must Fix Them.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              The FCRA and FDCPA give you powerful legal rights to challenge
              inaccurate items. CreditClean AI turns those rights into action —
              with forensic analysis, legal dispute letters, and automatic escalation.
            </p>
            {/* Dual CTAs (Miestro pattern) */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/30"
              >
                Calculate Your Score Impact
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { icon: CheckCircle2, label: "No Credit Card Required" },
                { icon: Lock, label: "256-bit Encrypted" },
                { icon: CheckCircle2, label: "FCRA Compliant" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <b.icon className="h-4 w-4 text-emerald-500" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Animated Score Visualization */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-2xl shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-center text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Average Member Results
              </p>
              <div className="mt-6 flex items-center justify-center gap-6">
                <ScoreRing score={547} label="Before" color="#D1D5DB" />
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 text-teal-500" />
                  <span className="mt-1 text-xs font-bold text-teal-600">+127 pts</span>
                </div>
                <ScoreRing score={674} label="After" color="#0D9488" />
              </div>
              <div className="mt-8 space-y-3">
                {[
                  { label: "Items Removed", value: "4.2 avg", color: "bg-emerald-500" },
                  { label: "Time to Results", value: "67 days avg", color: "bg-teal-500" },
                  { label: "Removal Rate", value: "73%", color: "bg-teal-600" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${row.color}`} />
                      <span className="text-zinc-600 dark:text-zinc-400">{row.label}</span>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -right-4 -bottom-4 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">4.8/5</span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">from 2,400+ users</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Animated Stats Bar ──── */}
      <section className="border-y border-zinc-200/60 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-white">
              {items.count.toLocaleString()}+
            </p>
            <p className="mt-1 text-sm font-medium text-teal-200">Items Disputed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-white">
              ${(violations.count / 1000000).toFixed(1)}M+
            </p>
            <p className="mt-1 text-sm font-medium text-teal-200">in Violations Identified</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-white">
              {rate.count}%
            </p>
            <p className="mt-1 text-sm font-medium text-teal-200">Average Removal Rate</p>
          </div>
        </div>
      </section>

      {/* ──── How It Works ──── */}
      <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Three Steps to Clean Credit
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Our platform handles the legal complexity so you can focus on results.
            </p>
          </div>
          <div className="relative mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            <div className="pointer-events-none absolute top-16 right-[calc(33.33%+1rem)] left-[calc(33.33%-1rem)] hidden h-0.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-300 lg:block dark:from-teal-700 dark:via-emerald-600 dark:to-teal-700" />
            {[
              {
                step: "1",
                title: "Upload Your Report",
                description:
                  "Upload your credit report or enter items manually. Our forensic analyzer checks every item against federal law — 26 violation types across all three bureaus.",
                icon: FileSearch,
              },
              {
                step: "2",
                title: "Review Violations",
                description:
                  "See exactly which laws were broken, which items are removable, and your estimated score impact. Every violation is mapped to a specific federal statute.",
                icon: Scale,
              },
              {
                step: "3",
                title: "Send Legal Disputes",
                description:
                  "Download print-ready dispute letters citing specific USC sections. Track responses and escalate automatically through 5 rounds of increasing legal pressure.",
                icon: Send,
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-2xl font-bold text-white shadow-lg shadow-teal-500/25">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Interactive Score Impact Calculator (Miestro slider pattern) ──── */}
      <section
        id="calculator"
        className="border-y border-zinc-200/60 bg-zinc-100/50 px-4 py-24 sm:px-6 lg:py-32 dark:border-zinc-800/60 dark:bg-zinc-900/30"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
              <Sparkles className="h-4 w-4" />
              Interactive Calculator
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Estimate Your Score Improvement
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Adjust the sliders to see how removing inaccurate items could impact your credit score.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            {/* Sliders */}
            <div className="space-y-8">
              {/* Slider 1 */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Negative Items on Report
                  </label>
                  <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                    {negativeItems}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={negativeItems}
                  onChange={(e) => setNegativeItems(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-zinc-400">
                  <span>1</span><span>15</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Average Age of Items (months)
                  </label>
                  <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                    {avgAge}mo
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={84}
                  value={avgAge}
                  onChange={(e) => setAvgAge(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-zinc-400">
                  <span>6mo</span><span>84mo</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Collection Accounts
                  </label>
                  <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                    {hasCollections}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={hasCollections}
                  onChange={(e) => setHasCollections(Number(e.target.value))}
                  className="mt-3 w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-zinc-400">
                  <span>0</span><span>10</span>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-10 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Estimated Score Improvement
              </p>
              <p className="mt-4 bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
                +{estimatedImprovement}
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">points</p>
              <div className="mx-auto mt-6 h-px w-16 bg-zinc-200 dark:bg-zinc-700" />
              <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                Estimated new score
              </p>
              <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {estimatedScore}
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:brightness-110"
              >
                Start Your Free Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-xs text-zinc-400">
                Results vary based on individual circumstances
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Feature Grid ──── */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Built for People Who Want Results
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Every feature maximizes your legal leverage and minimizes the time you spend fighting bureaus.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 transition-colors group-hover:from-teal-100 group-hover:to-emerald-100 dark:from-teal-950/50 dark:to-emerald-950/50">
                  <feature.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
                <div className="mt-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Testimonial Carousel (Miestro pattern) ──── */}
      <section className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-24 sm:px-6 lg:py-32 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Real People, Real Results
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Join thousands who took control of their credit using federal law.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div
              key={testimonialIdx}
              className="animate-fade-in rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-1">
                {[...Array(testimonials[testimonialIdx].stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;{testimonials[testimonialIdx].text}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {testimonials[testimonialIdx].name}
                  </p>
                  <p className="text-sm text-zinc-500">{testimonials[testimonialIdx].role}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-lg font-bold text-white">
                  {testimonials[testimonialIdx].score}
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <button
              onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="absolute top-1/2 -left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 sm:-left-12"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
              className="absolute top-1/2 -right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 sm:-right-12"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>

            {/* Dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === testimonialIdx
                      ? "w-8 bg-teal-600"
                      : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── Legal Foundation ──── */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
              <Gavel className="h-4 w-4" />
              Legal Foundation
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Backed by Federal Law
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Every dispute letter and strategy is grounded in federal consumer
              protection statutes — the same laws attorneys use.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {[
              { title: "Fair Credit Reporting Act", abbr: "FCRA", description: "Requires bureaus to investigate disputes within 30 days. Inaccurate items must be corrected or removed." },
              { title: "Fair Debt Collection Practices Act", abbr: "FDCPA", description: "Collectors must validate debts upon request. Violations carry statutory damages of up to $1,000 per incident." },
              { title: "Fair Credit Billing Act", abbr: "FCBA", description: "Protects against billing errors on credit accounts. Creditors must acknowledge disputes within 30 days." },
              { title: "Equal Credit Opportunity Act", abbr: "ECOA", description: "Prohibits discrimination in credit decisions. Adverse action notices must include specific reasons for denial." },
            ].map((law) => (
              <div
                key={law.abbr}
                className="rounded-2xl border border-zinc-200/80 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    {law.abbr}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {law.title}
                  </h3>
                </div>
                <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {law.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  50-State SOL Database
                </h3>
              </div>
              <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Complete statute of limitations database for all 50 states.
                Know exactly when debts expire and can no longer be legally collected.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  20+ Case Law Citations
                </h3>
              </div>
              <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Including 5 Supreme Court decisions. Every dispute letter
                references relevant case law to strengthen your legal position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Pricing with Monthly/Annual Toggle (Miestro pattern) ──── */}
      <section
        id="pricing"
        className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-24 sm:px-6 lg:py-32 dark:border-zinc-800/60 dark:bg-zinc-900/30"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Start free. Upgrade when you need more firepower.
            </p>
            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                Annual
                <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Free */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Free</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Get started with the basics</p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">$0</span>
                <span className="text-sm font-medium text-zinc-500">/mo</span>
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Get Started
              </Link>
              <ul className="mt-8 space-y-3">
                {["Track items across 3 bureaus", "1 dispute letter per month", "Basic score tracking", "FCRA §611 template"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro — Highlighted */}
            <div className="relative rounded-2xl border-2 border-teal-600 bg-white p-8 shadow-xl shadow-teal-500/10 dark:bg-zinc-900">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pro</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Everything you need to clean your credit</p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  ${prices[billingCycle].pro}
                </span>
                <span className="text-sm font-medium text-zinc-500">/mo</span>
                {billingCycle === "annual" && (
                  <span className="ml-2 text-sm font-medium text-emerald-600 line-through decoration-zinc-400">$29</span>
                )}
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
              >
                Start Free Trial
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited dispute letters",
                  "Forensic analysis (26 checks)",
                  "All 8 letter templates",
                  "5-round escalation strategy",
                  "PDF downloads for certified mail",
                  "Full score tracking dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium — Progressive stacking */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Premium</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Maximum legal leverage</p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  ${prices[billingCycle].premium}
                </span>
                <span className="text-sm font-medium text-zinc-500">/mo</span>
                {billingCycle === "annual" && (
                  <span className="ml-2 text-sm font-medium text-emerald-600 line-through decoration-zinc-400">$59</span>
                )}
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Start Free Trial
              </Link>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Everything in Pro, plus:
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Attorney package generator",
                  "CFPB complaint templates",
                  "State AG escalation letters",
                  "AI-powered violation analysis",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-xs text-zinc-400 dark:text-zinc-500">
            Results vary. Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-zinc-200/80 bg-white transition-all open:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 text-left text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                  <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-90 dark:text-zinc-500" />
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Final CTA ──── */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-950 to-zinc-950 px-8 py-20 text-center shadow-2xl sm:px-16">
          <Sparkles className="mx-auto h-8 w-8 text-teal-300" />
          <h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl">
            Stop Paying Credit Repair Companies.
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              Start Using the Law.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-teal-200">
            Join thousands of consumers who took control of their credit using
            federal law — not expensive middlemen.
          </p>
          <Link
            href="/auth/signup"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-teal-700 shadow-lg transition-all hover:bg-teal-50 hover:shadow-xl"
          >
            Start Your Free Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-16 sm:px-6 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Product</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Calculator", href: "#calculator" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-zinc-500 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Legal</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Disclaimer", href: "/disclaimer" },
                  { label: "Refund Policy", href: "/refund-policy" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-zinc-500 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Resources</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "FCRA Guide", href: "/disclaimer#federal-rights" },
                  { label: "FDCPA Guide", href: "/disclaimer#general" },
                  { label: "Your Rights", href: "/disclaimer#croa-notice" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-zinc-500 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Company</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Contact", href: "mailto:support@creditclean.ai" },
                  { label: "Sign In", href: "/auth/signin" },
                  { label: "Sign Up", href: "/auth/signup" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-zinc-500 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/60 pt-8 sm:flex-row dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-teal-600 to-emerald-500">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">CreditClean AI</span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} CreditClean AI. Not a law firm. Not legal advice.
            </p>
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
            CreditClean AI is not a law firm and does not provide legal advice.
            The information and tools provided are for educational and self-help
            purposes. Consult a qualified attorney for legal advice specific to
            your situation.
          </p>
        </div>
      </footer>
    </div>
  );
}
