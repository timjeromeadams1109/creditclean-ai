"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  FileSearch,
  Plus,
  Mail,
  Upload,
  ArrowRight,
  CalendarClock,
  Eye,
  ExternalLink,
  FileText,
} from "lucide-react";

// TODO: Replace with Supabase query — fetch user's latest scores per bureau
const bureauScores = [
  {
    bureau: "Equifax",
    score: 612,
    change: +18,
    trend: "up" as const,
    color: "#E11D48",
    label: "EQ",
  },
  {
    bureau: "Experian",
    score: 598,
    change: +12,
    trend: "up" as const,
    color: "#2563EB",
    label: "EX",
  },
  {
    bureau: "TransUnion",
    score: 605,
    change: -3,
    trend: "down" as const,
    color: "#059669",
    label: "TU",
  },
];

// TODO: Replace with Supabase query — aggregate counts from credit_items
const stats = {
  activeDisputes: 7,
  itemsTracked: 14,
  itemsResolved: 5,
  itemsDisputing: 4,
  itemsPending: 5,
  targetDate: "August 2026",
  targetDaysRemaining: 152,
};

// TODO: Replace with Supabase query — fetch active disputes with round info
const activeDisputes = [
  {
    id: "1",
    account: "Capital One — Collection",
    bureau: "Equifax",
    bureauColor: "bg-rose-500",
    bureauLabel: "EQ",
    round: 2,
    totalRounds: 5,
    status: "Sent" as const,
    daysRemaining: 22,
  },
  {
    id: "2",
    account: "Medical Debt — $1,240",
    bureau: "Experian",
    bureauColor: "bg-blue-600",
    bureauLabel: "EX",
    round: 1,
    totalRounds: 5,
    status: "Awaiting" as const,
    daysRemaining: 15,
  },
  {
    id: "3",
    account: "Midland Credit — Collection",
    bureau: "Equifax",
    bureauColor: "bg-rose-500",
    bureauLabel: "EQ",
    round: 2,
    totalRounds: 5,
    status: "Draft" as const,
    daysRemaining: 30,
  },
  {
    id: "4",
    account: "Student Loan — Late Payment",
    bureau: "Experian",
    bureauColor: "bg-blue-600",
    bureauLabel: "EX",
    round: 1,
    totalRounds: 5,
    status: "Responded" as const,
    daysRemaining: 0,
  },
  {
    id: "5",
    account: "Discover — Charge Off",
    bureau: "TransUnion",
    bureauColor: "bg-emerald-600",
    bureauLabel: "TU",
    round: 3,
    totalRounds: 5,
    status: "Sent" as const,
    daysRemaining: 18,
  },
];

const statusStyles: Record<string, string> = {
  Draft:
    "bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400",
  Sent:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Awaiting:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Responded:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const quickActions = [
  {
    label: "Get Free Credit Reports",
    description: "From AnnualCreditReport.com",
    href: "https://www.annualcreditreport.com",
    icon: FileText,
    iconBg: "bg-teal-100 dark:bg-teal-950",
    iconColor: "text-teal-600 dark:text-teal-400",
    external: true,
  },
  {
    label: "Run Forensic Analysis",
    description: "AI-powered credit report scan",
    href: "/forensic",
    icon: FileSearch,
    iconBg: "bg-indigo-100 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Add Credit Item",
    description: "Track a new account or item",
    href: "/items/new",
    icon: Plus,
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    label: "Generate Letter",
    description: "Create a dispute letter",
    href: "/letters",
    icon: Mail,
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Upload Response",
    description: "Log a bureau response",
    href: "/responses",
    icon: Upload,
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

// SVG circular progress ring
function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-100 dark:text-zinc-800"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
          {percentage}%
        </span>
        <span className="text-[10px] font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wider">
          Complete
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const resolvedPct = Math.round(
    (stats.itemsResolved / stats.itemsTracked) * 100
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          {getGreeting()}, Tim
        </h1>
        <p className="mt-1 text-[14px] text-stone-500 dark:text-zinc-400">
          {getFormattedDate()} &mdash; Here&apos;s your credit repair progress
        </p>
      </motion.div>

      {/* Bureau score cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bureauScores.map((b, i) => (
          <motion.div
            key={b.bureau}
            custom={i + 1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Gradient top border */}
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${b.color}CC, ${b.color}40)`,
              }}
            />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-stone-500 dark:text-zinc-400">
                  {b.bureau}
                </p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium ${
                    b.trend === "up"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                  }`}
                >
                  {b.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {b.change > 0 ? "+" : ""}
                  {b.change}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-5xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
                  {b.score}
                </span>
                {/* Sparkline placeholder */}
                <div className="flex items-end gap-[3px] h-8 opacity-30">
                  {[35, 42, 38, 55, 48, 60, 52, 65, 58, 70, 68, 75].map(
                    (h, idx) => (
                      <div
                        key={idx}
                        className="w-[3px] rounded-full"
                        style={{
                          height: `${h}%`,
                          backgroundColor: b.color,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Get your free credit report */}
      <motion.div
        custom={3.5}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 dark:border-teal-800/40 dark:from-teal-950/30 dark:to-emerald-950/30"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="text-[14px] font-semibold text-teal-900 dark:text-teal-100">
                Get your free credit reports
              </p>
              <p className="mt-0.5 text-[13px] text-teal-700 dark:text-teal-300">
                Pull your reports from all 3 bureaus at AnnualCreditReport.com — the
                only federally authorized source. Free weekly reports are available.
              </p>
            </div>
          </div>
          <a
            href="https://www.annualcreditreport.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            Get Free Reports
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.div>

      {/* Progress section */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Progress ring */}
            <div className="flex justify-center md:justify-start shrink-0">
              <ProgressRing percentage={resolvedPct} />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-5">
              <div>
                <h2 className="text-[15px] font-semibold text-stone-900 dark:text-zinc-100">
                  Dispute Progress
                </h2>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-stone-500 dark:text-zinc-400">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span>
                    {stats.targetDaysRemaining} days until {stats.targetDate}
                  </span>
                </div>
              </div>

              {/* Horizontal stacked bar */}
              <div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-zinc-800">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-l-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(stats.itemsResolved / stats.itemsTracked) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  />
                  <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(stats.itemsDisputing / stats.itemsTracked) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                  />
                  <motion.div
                    className="h-full bg-stone-300 dark:bg-zinc-600 rounded-r-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(stats.itemsPending / stats.itemsTracked) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-600 dark:text-zinc-400">
                      Resolved
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-zinc-100">
                      {stats.itemsResolved}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span className="text-stone-600 dark:text-zinc-400">
                      Disputing
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-zinc-100">
                      {stats.itemsDisputing}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-zinc-600" />
                    <span className="text-stone-600 dark:text-zinc-400">
                      Pending
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-zinc-100">
                      {stats.itemsPending}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active disputes table */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-stone-900 dark:text-zinc-100">
            Active Disputes
          </h2>
          <Link
            href="/items"
            className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_80px_120px_100px_80px_48px] gap-4 border-b border-stone-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:border-zinc-800 dark:text-zinc-500">
            <span>Account</span>
            <span>Bureau</span>
            <span>Round</span>
            <span>Status</span>
            <span>Days Left</span>
            <span />
          </div>
          {/* Table rows */}
          <div className="divide-y divide-stone-100 dark:divide-zinc-800">
            {activeDisputes.map((d) => (
              <div
                key={d.id}
                className="group flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1fr_80px_120px_100px_80px_48px] sm:items-center sm:gap-4 hover:bg-stone-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Account */}
                <p className="text-[13px] font-medium text-stone-900 dark:text-zinc-100 truncate">
                  {d.account}
                </p>
                {/* Bureau badge */}
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-white ${d.bureauColor}`}
                >
                  {d.bureauLabel}
                </span>
                {/* Round indicator */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: d.totalRounds }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        idx < d.round
                          ? "bg-indigo-500"
                          : "bg-stone-200 dark:bg-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[11px] text-stone-400 dark:text-zinc-500">
                    {d.round}/{d.totalRounds}
                  </span>
                </div>
                {/* Status */}
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[d.status]}`}
                >
                  {d.status}
                </span>
                {/* Days remaining */}
                <span
                  className={`text-[13px] font-medium ${
                    d.daysRemaining <= 7
                      ? "text-rose-600 dark:text-rose-400"
                      : d.daysRemaining <= 14
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-stone-600 dark:text-zinc-400"
                  }`}
                >
                  {d.daysRemaining > 0 ? `${d.daysRemaining}d` : "Due"}
                </span>
                {/* View link */}
                <Link
                  href={`/items/${d.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick actions — 4 cards in a row */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h2 className="mb-4 text-[15px] font-semibold text-stone-900 dark:text-zinc-100">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action) => {
            const isExternal = "external" in action && action.external;
            const Component = isExternal ? "a" : Link;
            const extraProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Component
                key={action.label}
                href={action.href}
                {...extraProps}
                className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.iconBg}`}
                >
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <h3 className="mt-4 text-[14px] font-semibold text-stone-900 dark:text-zinc-100">
                  {action.label}
                </h3>
                <p className="mt-1 text-[12px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                  {action.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[12px] font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  {isExternal ? "Open site" : "Get started"}
                  {isExternal ? <ExternalLink className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                </div>
              </Component>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
