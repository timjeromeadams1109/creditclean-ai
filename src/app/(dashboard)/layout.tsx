"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  Mail,
  Upload,
  TrendingUp,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forensic", label: "Forensic Analysis", icon: FileSearch },
  { href: "/items", label: "Items", icon: FileText },
  { href: "/letters", label: "Letters", icon: Mail },
  { href: "/responses", label: "Responses", icon: Upload },
  { href: "/scores", label: "Scores", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

const labelMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/forensic": "Forensic Analysis",
  "/items": "Items",
  "/letters": "Letters",
  "/responses": "Responses",
  "/scores": "Scores",
  "/settings": "Settings",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({
      label: labelMap[path] || seg.charAt(0).toUpperCase() + seg.slice(1),
      href: path,
    });
  }
  return crumbs;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-zinc-950">
      {/* Mobile overlay with backdrop blur */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — dark theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-zinc-900 transition-transform duration-300 ease-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 shadow-lg shadow-teal-500/25">
            <Shield className="h-4.5 w-4.5 text-white" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg bg-teal-500/20 blur-md" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            CreditClean AI
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 text-zinc-500 hover:text-zinc-300 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 px-3 py-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {/* Active indicator — left border bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-teal-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-[13px] font-semibold text-white shadow-lg shadow-teal-500/20">
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-medium text-zinc-200">
                Tim Adams
              </p>
              <p className="truncate text-[11px] text-zinc-500">
                tim@creditclean.ai
              </p>
            </div>
            <button className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-stone-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-zinc-800 dark:bg-zinc-950/80">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden dark:hover:bg-zinc-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden items-center gap-1 text-[13px] sm:flex">
            <Link
              href="/dashboard"
              className="text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-stone-300 dark:text-zinc-600" />
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-stone-700 dark:text-zinc-200">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-stone-400 hover:text-stone-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-[13px] text-stone-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 w-64 transition-colors focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/10">
            <Search className="h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search items, letters..."
              className="flex-1 bg-transparent outline-none text-stone-700 placeholder:text-stone-400 dark:text-zinc-200 dark:placeholder:text-zinc-500"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-stone-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-stone-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {/* User avatar (top bar) */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-[12px] font-semibold text-white cursor-pointer hover:shadow-md transition-shadow">
            T
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
