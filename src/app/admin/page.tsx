"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  DollarSign,
  FileText,
  FileSearch,
  TrendingUp,
  Shield,
  Mail,
  BarChart3,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Zap,
  ArrowRight,
} from "lucide-react";

/* ─── Types ─── */

interface Stats {
  users: {
    total: number;
    newLast7Days: number;
    newLast30Days: number;
    byTier: { free: number; pro: number; premium: number };
  };
  subscriptions: { paid: number; mrr: number; conversionRate: number };
  disputes: {
    totalItems: number;
    totalRounds: number;
    totalLetters: number;
    totalReports: number;
    resolved: number;
    disputing: number;
  };
  activity: { lettersThisMonth: number; reportsThisMonth: number };
}

interface ActivityData {
  signups: { date: string; count: number }[];
  letters: { date: string; count: number }[];
  reports: { date: string; count: number }[];
}

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: string;
  role: string;
  stripe_customer_id: string | null;
  created_at: string;
  itemCount: number;
  letterCount: number;
}

type TabId = "overview" | "users" | "revenue" | "tools";

/* ─── Animation ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ─── Sparkline ─── */

function Sparkline({ data, color = "#0d9488", height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const width = 200;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(" ");

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

/* ─── Stat Card ─── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor = "text-teal-600 dark:text-teal-400",
  iconBg = "bg-teal-50 dark:bg-teal-950/50",
  sparkData,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  iconColor?: string;
  iconBg?: string;
  sparkData?: number[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {sparkData && <Sparkline data={sparkData} />}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-teal-600 dark:text-teal-400">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Tier Badge ─── */

function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    free: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    pro: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    premium: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[tier] || styles.free}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

/* ─── Main Dashboard ─── */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  // Users tab state
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userTierFilter, setUserTierFilter] = useState("all");

  // Fetch dashboard stats
  useEffect(() => {
    async function load() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activity"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (activityRes.ok) setActivity(await activityRes.json());
      } catch {
        // Keep loading state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(usersPage),
        limit: "20",
        ...(userSearch && { search: userSearch }),
        ...(userTierFilter !== "all" && { tier: userTierFilter }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setUsersTotalPages(data.totalPages || 1);
        setUsersTotal(data.total || 0);
      }
    } catch {
      // Keep existing data
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, userSearch, userTierFilter]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab, fetchUsers]);

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "tools", label: "Tools", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 shadow-lg shadow-teal-500/25">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              CreditClean Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Tab Navigation */}
        <nav className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Top stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.users.total}
                  sub={`+${stats.users.newLast7Days} this week`}
                  sparkData={activity?.signups.map((s) => s.count)}
                />
              </motion.div>
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={DollarSign}
                  label="Monthly Recurring Revenue"
                  value={`$${stats.subscriptions.mrr.toLocaleString()}`}
                  sub={`${stats.subscriptions.paid} paying users`}
                  iconColor="text-emerald-600 dark:text-emerald-400"
                  iconBg="bg-emerald-50 dark:bg-emerald-950/50"
                />
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={Mail}
                  label="Letters Generated"
                  value={stats.disputes.totalLetters}
                  sub={`${stats.activity.lettersThisMonth} this month`}
                  iconColor="text-indigo-600 dark:text-indigo-400"
                  iconBg="bg-indigo-50 dark:bg-indigo-950/50"
                  sparkData={activity?.letters.map((s) => s.count)}
                />
              </motion.div>
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={FileSearch}
                  label="Forensic Reports"
                  value={stats.disputes.totalReports}
                  sub={`${stats.activity.reportsThisMonth} this month`}
                  iconColor="text-violet-600 dark:text-violet-400"
                  iconBg="bg-violet-50 dark:bg-violet-950/50"
                  sparkData={activity?.reports.map((s) => s.count)}
                />
              </motion.div>
            </div>

            {/* Subscription breakdown + Dispute progress */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Subscription tiers */}
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Subscription Tiers</h3>
                  <div className="mt-6 space-y-4">
                    {[
                      { label: "Free", count: stats.users.byTier.free, color: "bg-zinc-400", pct: stats.users.total > 0 ? Math.round((stats.users.byTier.free / stats.users.total) * 100) : 0 },
                      { label: "Pro ($29/m)", count: stats.users.byTier.pro, color: "bg-teal-500", pct: stats.users.total > 0 ? Math.round((stats.users.byTier.pro / stats.users.total) * 100) : 0 },
                      { label: "Premium ($79/m)", count: stats.users.byTier.premium, color: "bg-amber-500", pct: stats.users.total > 0 ? Math.round((stats.users.byTier.premium / stats.users.total) * 100) : 0 },
                    ].map((tier) => (
                      <div key={tier.label}>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-700 dark:text-zinc-300">{tier.label}</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{tier.count} ({tier.pct}%)</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div className={`h-full rounded-full ${tier.color} transition-all duration-700`} style={{ width: `${tier.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Conversion rate</span>
                      <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{stats.subscriptions.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Dispute progress */}
              <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dispute Activity</h3>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.disputes.totalItems}</p>
                      <p className="text-xs text-zinc-500">Total Items Tracked</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.disputes.totalRounds}</p>
                      <p className="text-xs text-zinc-500">Dispute Rounds</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.disputes.resolved}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Resolved</p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.disputes.disputing}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Actively Disputing</p>
                    </div>
                  </div>
                  {stats.disputes.totalItems > 0 && (
                    <div className="mt-6">
                      <p className="mb-2 text-sm text-zinc-500">Resolution rate</p>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700"
                          style={{ width: `${Math.round((stats.disputes.resolved / stats.disputes.totalItems) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-teal-600 dark:text-teal-400">
                        {Math.round((stats.disputes.resolved / stats.disputes.totalItems) * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Quick Links</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Stripe Dashboard", href: "https://dashboard.stripe.com", icon: CreditCard, external: true },
                  { label: "Supabase Dashboard", href: "https://supabase.com/dashboard", icon: Shield, external: true },
                  { label: "Vercel Dashboard", href: "https://vercel.com/dashboard", icon: Zap, external: true },
                  { label: "Google Search Console", href: "https://search.google.com/search-console", icon: TrendingUp, external: true },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-700 transition-colors hover:border-teal-300 hover:bg-teal-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/20"
                  >
                    <link.icon className="h-4 w-4 text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                    {link.label}
                    <ExternalLink className="ml-auto h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* ══════════════ USERS TAB ══════════════ */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900 min-w-[250px]">
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUsersPage(1);
                  }}
                  className="flex-1 bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 dark:text-zinc-200"
                />
              </div>
              <select
                value={userTierFilter}
                onChange={(e) => {
                  setUserTierFilter(e.target.value);
                  setUsersPage(1);
                }}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 focus:border-teal-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {usersTotal} user{usersTotal !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Users table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {usersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-20 text-center text-sm text-zinc-500">No users found.</div>
              ) : (
                <>
                  <div className="hidden sm:grid sm:grid-cols-[1fr_140px_80px_80px_100px_100px] gap-4 border-b border-zinc-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                    <span>User</span>
                    <span>Email</span>
                    <span>Tier</span>
                    <span>Items</span>
                    <span>Letters</span>
                    <span>Joined</span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1fr_140px_80px_80px_100px_100px] sm:items-center sm:gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {user.full_name || "—"}
                          </p>
                        </div>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                        <TierBadge tier={user.subscription_tier} />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.itemCount}</span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.letterCount}</span>
                        <span className="text-xs text-zinc-400">
                          {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            {usersTotalPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                  disabled={usersPage <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Page {usersPage} of {usersTotalPages}
                </span>
                <button
                  onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                  disabled={usersPage >= usersTotalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ REVENUE TAB ══════════════ */}
        {activeTab === "revenue" && stats && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={DollarSign}
                  label="Monthly Recurring Revenue"
                  value={`$${stats.subscriptions.mrr.toLocaleString()}`}
                  sub={`$${(stats.subscriptions.mrr * 12).toLocaleString()} ARR`}
                  iconColor="text-emerald-600 dark:text-emerald-400"
                  iconBg="bg-emerald-50 dark:bg-emerald-950/50"
                />
              </motion.div>
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={CreditCard}
                  label="Paid Subscriptions"
                  value={stats.subscriptions.paid}
                  sub={`${stats.subscriptions.conversionRate}% conversion`}
                  iconColor="text-indigo-600 dark:text-indigo-400"
                  iconBg="bg-indigo-50 dark:bg-indigo-950/50"
                />
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <StatCard
                  icon={TrendingUp}
                  label="Target Progress"
                  value={`${Math.round((stats.subscriptions.mrr / 10000) * 100)}%`}
                  sub={`$${stats.subscriptions.mrr.toLocaleString()} / $10,000 goal`}
                  iconColor="text-teal-600 dark:text-teal-400"
                  iconBg="bg-teal-50 dark:bg-teal-950/50"
                />
              </motion.div>
            </div>

            {/* Revenue breakdown */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Revenue Breakdown</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pro subscriptions</p>
                      <p className="text-xs text-zinc-500">{stats.users.byTier.pro} users x $29/mo</p>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      ${(stats.users.byTier.pro * 29).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Premium subscriptions</p>
                      <p className="text-xs text-zinc-500">{stats.users.byTier.premium} users x $79/mo</p>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      ${(stats.users.byTier.premium * 79).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4 dark:border-teal-800/50 dark:bg-teal-950/20">
                    <div>
                      <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Estimated monthly costs</p>
                      <p className="text-xs text-teal-600 dark:text-teal-400">Stripe + Supabase + Vercel + Resend</p>
                    </div>
                    <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
                      -${(67 + Math.round(stats.subscriptions.mrr * 0.039)).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Estimated net profit</p>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      ${Math.max(0, stats.subscriptions.mrr - 67 - Math.round(stats.subscriptions.mrr * 0.039)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Target tracker */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Path to $10K/mo</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-500">{stats.subscriptions.paid} paying users</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">362 target</span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((stats.subscriptions.paid / 362) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-sm text-teal-600 dark:text-teal-400">
                    {Math.round((stats.subscriptions.paid / 362) * 100)}% — need {Math.max(0, 362 - stats.subscriptions.paid)} more
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ══════════════ TOOLS TAB ══════════════ */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            {/* Marketing links */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Marketing</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Quick access to marketing channels</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Google Ads", href: "https://ads.google.com" },
                  { label: "Meta Ads Manager", href: "https://business.facebook.com/adsmanager" },
                  { label: "TikTok Ads", href: "https://ads.tiktok.com" },
                  { label: "Google Search Console", href: "https://search.google.com/search-console" },
                  { label: "Reddit Ads", href: "https://ads.reddit.com" },
                  { label: "Canva (creatives)", href: "https://www.canva.com" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-teal-300 hover:bg-teal-50/50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/20"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Business tools */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Business Operations</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Stripe Dashboard", href: "https://dashboard.stripe.com" },
                  { label: "Supabase Dashboard", href: "https://supabase.com/dashboard" },
                  { label: "Vercel Deployments", href: "https://vercel.com/dashboard" },
                  { label: "Resend (Email)", href: "https://resend.com" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-teal-300 hover:bg-teal-50/50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/20"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Market Plan */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-6 dark:border-teal-800/40 dark:bg-teal-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h3 className="font-semibold text-teal-900 dark:text-teal-100">Market Plan</h3>
                  <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
                    Full 12-month growth strategy is in MARKET-PLAN.md at the project root.
                    Target: 362 users at $29/mo = $10K/mo net profit.
                  </p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-800/40 dark:bg-zinc-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Destructive operations. Handle with care.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/50 dark:hover:bg-red-950/20"
                      onClick={() => alert("Not implemented — use Supabase dashboard for bulk operations")}
                    >
                      Clear Test Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
