import Link from "next/link";
import {
  Shield,
  FileSearch,
  Mail,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Scale,
  FileText,
  Send,
  Lock,
  Zap,
  Gavel,
  BarChart3,
  Download,
  BookOpen,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Forensic Analysis",
    description:
      "Every item is checked against 26 legal violation types. We find errors bureaus hope you never notice.",
  },
  {
    icon: Mail,
    title: "8 Letter Templates",
    description:
      "FCRA §611, §609, §623, FDCPA §809, goodwill, CFPB, state AG, and intent to litigate — all ready to send.",
  },
  {
    icon: Zap,
    title: "5-Round Escalation",
    description:
      "Automatic strategy progression from initial dispute to regulatory complaints. Each round increases pressure.",
  },
  {
    icon: Gavel,
    title: "Attorney Package Generator",
    description:
      "Litigation-ready document bundles with damages calculation, violation timelines, and case law citations.",
  },
  {
    icon: Download,
    title: "PDF Download",
    description:
      "Print-ready dispute letters formatted for certified mail. Every letter cites the specific USC section.",
  },
  {
    icon: BarChart3,
    title: "Score Tracking",
    description:
      "Monitor your progress across all 3 bureaus. See which disputes moved the needle and what to target next.",
  },
];

const laws = [
  {
    title: "Fair Credit Reporting Act",
    abbr: "FCRA",
    description:
      "Requires bureaus to investigate disputes within 30 days. Inaccurate items must be corrected or removed.",
  },
  {
    title: "Fair Debt Collection Practices Act",
    abbr: "FDCPA",
    description:
      "Collectors must validate debts upon request. Violations carry statutory damages of up to $1,000 per incident.",
  },
  {
    title: "Fair Credit Billing Act",
    abbr: "FCBA",
    description:
      "Protects against billing errors on credit accounts. Creditors must acknowledge disputes within 30 days.",
  },
  {
    title: "Equal Credit Opportunity Act",
    abbr: "ECOA",
    description:
      "Prohibits discrimination in credit decisions. Adverse action notices must include specific reasons for denial.",
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
    question:
      "What's the difference between this and credit repair companies?",
    answer:
      "Credit repair companies charge $79-$149/month and often use generic template letters. CreditClean AI puts you in control with forensic analysis, law-specific dispute strategies, and letters that cite actual federal statutes — at a fraction of the cost.",
  },
  {
    question: "Is my information secure?",
    answer:
      "Yes. All data is protected with 256-bit AES encryption in transit and at rest. We never share your information with third parties, and we never perform credit checks.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/60 bg-stone-50/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <Shield className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              CreditClean AI
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
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
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Scale className="h-4 w-4" />
            Powered by Federal Consumer Protection Law
          </div>
          <h1 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-zinc-50">
            Your Credit Report Has Errors.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              The Law Says They Must Fix Them.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            The FCRA and FDCPA give you powerful legal rights to challenge
            inaccurate items on your credit report. CreditClean AI turns those
            rights into action — with forensic analysis, legal dispute letters,
            and automatic escalation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            >
              Start Free Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              See How It Works
            </Link>
          </div>
          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              FCRA Compliant
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              FDCPA Powered
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Lock className="h-4 w-4 text-emerald-500" />
              256-bit Encrypted
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              No Credit Check Required
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-zinc-200/60 bg-zinc-100/50 px-4 py-12 sm:px-6 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              10,000+
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Items Disputed
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              $2.4M+
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              in Violations Identified
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              73%
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Average Removal Rate
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="px-4 py-24 sm:px-6 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Three Steps to Clean Credit
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Our platform handles the legal complexity so you can focus on results.
            </p>
          </div>
          <div className="relative mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {/* Connecting line (desktop only) */}
            <div className="pointer-events-none absolute top-16 right-[calc(33.33%+1rem)] left-[calc(33.33%-1rem)] hidden h-0.5 bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-300 lg:block dark:from-indigo-700 dark:via-indigo-600 dark:to-indigo-700" />
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
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
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

      {/* Feature Grid */}
      <section className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-24 sm:px-6 lg:py-32 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Built for People Who Want Results
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Every feature is designed to maximize your legal leverage and
              minimize the time you spend fighting bureaus.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950/50 dark:group-hover:bg-indigo-950">
                  <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Law Section */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
              <Gavel className="h-4 w-4" />
              Legal Foundation
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Backed by Federal Law
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Every dispute letter and strategy is grounded in federal consumer
              protection statutes — the same laws attorneys use.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {laws.map((law) => (
              <div
                key={law.abbr}
                className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
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
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  50-State SOL Database
                </h3>
              </div>
              <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Complete statute of limitations database for all 50 states.
                Know exactly when debts expire and can no longer be legally
                collected.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-24 sm:px-6 lg:py-32 dark:border-zinc-800/60 dark:bg-zinc-900/30"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Start free. Upgrade when you need more firepower.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Free Tier */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Free
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Get started with the basics
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  $0
                </span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  /mo
                </span>
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Get Started
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Track items across 3 bureaus",
                  "1 dispute letter per month",
                  "Basic score tracking",
                  "FCRA §611 template",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tier — Highlighted */}
            <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-xl shadow-indigo-500/10 dark:bg-zinc-900">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Pro
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Everything you need to clean your credit
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  $29
                </span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  /mo
                </span>
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
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
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Premium
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Maximum legal leverage
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  $59
                </span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  /mo
                </span>
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Start Free Trial
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Pro",
                  "Attorney package generator",
                  "CFPB complaint templates",
                  "State AG escalation letters",
                  "AI-powered violation analysis",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                  >
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

      {/* FAQ */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
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

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-950 px-8 py-20 text-center shadow-2xl sm:px-16">
          <Sparkles className="mx-auto h-8 w-8 text-indigo-300" />
          <h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl">
            Stop Paying Credit Repair Companies.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Start Using the Law.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-indigo-200">
            Join thousands of consumers who took control of their credit using
            federal law — not expensive middlemen.
          </p>
          <Link
            href="/auth/signup"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
          >
            Start Your Free Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 bg-zinc-100/50 px-4 py-16 sm:px-6 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Product
              </h4>
              <ul className="mt-4 space-y-3">
                {["Features", "Pricing", "How It Works"].map((item) => (
                  <li key={item}>
                    <Link
                      href={
                        item === "Pricing"
                          ? "#pricing"
                          : item === "How It Works"
                            ? "#how-it-works"
                            : "#"
                      }
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Legal
              </h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Disclaimer", href: "/disclaimer" },
                ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Resources
              </h4>
              <ul className="mt-4 space-y-3">
                {["Blog", "FCRA Guide", "FDCPA Guide"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                {["About", "Contact", "Support"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Bottom row */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/60 pt-8 sm:flex-row dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-violet-600">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                CreditClean AI
              </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} CreditClean AI. Not a law firm.
              Not legal advice.
            </p>
          </div>
          {/* Legal disclaimer */}
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
