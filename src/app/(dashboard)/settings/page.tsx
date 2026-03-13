"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your account preferences
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar tabs */}
        <nav className="flex gap-1 lg:w-52 lg:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Update your personal information
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full name</label>
                  <input
                    type="text"
                    defaultValue=""
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                  <input
                    type="email"
                    defaultValue=""
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">State</label>
                  <select className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    <option value="">Select your state</option>
                    {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Choose what you want to be notified about
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Dispute status updates", desc: "Get notified when a bureau responds" },
                  { label: "Score changes", desc: "Alert when your score changes significantly" },
                  { label: "Letter reminders", desc: "Remind to send generated letters" },
                  { label: "Escalation alerts", desc: "When it's time to escalate a dispute" },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500" />
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Security</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Update your password
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Current password</label>
                  <input type="password" className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">New password</label>
                  <input type="password" className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm new password</label>
                  <input type="password" className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <button className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110">
                  Update Password
                </button>
              </div>

              <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Once you delete your account, there is no going back.
                </p>
                <button className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/50 dark:hover:bg-red-950/20">
                  <LogOut className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Billing</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Manage your subscription
              </p>
              <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-800/50 dark:bg-teal-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Free Plan</p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">1 dispute letter/month, basic tracking</p>
                  </div>
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                    Current
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110">
                Upgrade to Pro — $29/mo
              </button>
              <p className="mt-3 text-center text-xs text-zinc-400">
                Unlock unlimited letters, forensic analysis, and 5-round escalation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
