"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Bell, Shield, CreditCard, LogOut, AlertTriangle, CheckCircle2, Loader2, ExternalLink, ShieldCheck, ShieldOff, Copy, Check } from "lucide-react";
import CROADisclosureModal from "@/components/shared/CROADisclosureModal";

// ── MFA Setup Flow ──────────────────────────────────────────────────────────

type MfaStep = "idle" | "qr" | "confirm" | "backup-codes" | "disabling";

interface MfaSectionProps {
  mfaEnabled: boolean;
  onToggled: () => void;
}

function MfaSection({ mfaEnabled, onToggled }: MfaSectionProps) {
  const [step, setStep] = useState<MfaStep>("idle");
  const [qrUri, setQrUri] = useState("");
  const [encryptedSecret, setEncryptedSecret] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function startSetup() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      setQrUri(data.uri);
      setEncryptedSecret(data.encryptedSecret);
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function confirmSetup() {
    if (setupCode.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedSecret, code: setupCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setBackupCodes(data.backupCodes);
      setStep("backup-codes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDisable() {
    if (!disableCode.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: disableCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable");
      setStep("idle");
      setDisableCode("");
      onToggled();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function finishSetup() {
    setStep("idle");
    setSetupCode("");
    setBackupCodes([]);
    onToggled();
  }

  if (mfaEnabled && step === "idle") {
    return (
      <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Two-Factor Authentication
              </h3>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              MFA is active. Your account requires a code from your authenticator app at login.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            Enabled
          </span>
        </div>
        <button
          onClick={() => { setStep("disabling"); setError(""); }}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/50 dark:hover:bg-red-950/20"
        >
          <ShieldOff className="h-4 w-4" />
          Disable 2FA
        </button>
      </div>
    );
  }

  if (step === "disabling") {
    return (
      <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Disable Two-Factor Authentication</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Enter your current authenticator code or a backup code to confirm.
        </p>
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}
        <div className="mt-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            placeholder="6-digit code or backup code"
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value.replace(/\s/g, ""))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center font-mono text-sm tracking-widest outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={confirmDisable}
            disabled={loading || !disableCode.trim()}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Disabling..." : "Confirm Disable"}
          </button>
          <button
            onClick={() => { setStep("idle"); setError(""); setDisableCode(""); }}
            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === "qr") {
    // Render QR code as an img using a free QR API — no extra dependency
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUri)}`;
    return (
      <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Set Up Two-Factor Authentication</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
        </p>
        <div className="mt-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="MFA QR code — scan with your authenticator app"
            width={200}
            height={200}
            className="rounded-xl border border-zinc-200 p-2 dark:border-zinc-700 dark:bg-white"
          />
        </div>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          After scanning, enter the 6-digit code your app shows:
        </p>
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}
        <div className="mt-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={setupCode}
            onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.4em] outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={confirmSetup}
            disabled={loading || setupCode.length !== 6}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Verifying..." : "Verify & Enable"}
          </button>
          <button
            onClick={() => { setStep("idle"); setError(""); setSetupCode(""); }}
            className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === "backup-codes") {
    return (
      <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">2FA Enabled — Save Your Backup Codes</h3>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Store these codes somewhere safe. Each code can be used once if you lose access to your authenticator app.
          These will not be shown again.
        </p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code) => (
              <code key={code} className="rounded bg-white px-3 py-1.5 text-center text-sm font-mono font-medium text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100">
                {code}
              </code>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={copyBackupCodes}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={finishSetup}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // idle + not enabled
  return (
    <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Two-Factor Authentication
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Add an extra layer of security to your financial account. Required for Pro users.
          </p>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
          <button
            onClick={startSetup}
            disabled={loading}
            className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Loading..." : "Enable 2FA"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings Page ────────────────────────────────────────────────────────────

function SettingsContent() {
  const searchParams = useSearchParams();
  const justUpgraded = searchParams.get("upgraded") === "1";
  const [activeTab, setActiveTab] = useState(justUpgraded ? "billing" : "profile");
  const [showCROAModal, setShowCROAModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/mfa/status")
      .then((r) => r.json())
      .then((d) => { if (typeof d.mfaEnabled === "boolean") setMfaEnabled(d.mfaEnabled); })
      .catch(() => {});
  }, []);

  async function handleUpgrade() {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "PRICE_ID_NOT_SET",
          croaAccepted: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Portal unavailable");
      if (data.url) window.location.href = data.url;
    } catch {
      // No Stripe customer yet — expected for free users
    } finally {
      setPortalLoading(false);
    }
  }

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

              <MfaSection
                mfaEnabled={mfaEnabled}
                onToggled={() => setMfaEnabled((prev) => !prev)}
              />

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
            <div className="space-y-6">
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
                {justUpgraded && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Upgrade successful! Your Pro features are now active.
                  </div>
                )}

                {checkoutError && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {checkoutError}
                  </div>
                )}

                <button
                  onClick={() => setShowCROAModal(true)}
                  disabled={checkoutLoading}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to checkout...</span>
                  ) : (
                    "Upgrade to Pro — $29/mo"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-zinc-400">
                  Unlock unlimited letters, forensic analysis, and 5-round escalation
                </p>

                {/* Manage billing via Stripe portal */}
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="mt-2 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  {portalLoading ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Opening...</span>
                  ) : (
                    <span className="inline-flex items-center gap-2">Manage Billing &amp; Invoices <ExternalLink className="h-3.5 w-3.5" /></span>
                  )}
                </button>
              </div>

              {/* Cancellation section */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Cancel Subscription
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Under CROA (15 U.S.C. &sect;1679e), you may cancel within 3 business
                  days of purchase for a full refund. After 3 days, monthly plans can be
                  cancelled anytime — you&apos;ll retain access through the end of your billing
                  period.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800/50 dark:hover:bg-red-950/20"
                  >
                    {portalLoading ? "Opening..." : "Cancel Subscription"}
                  </button>
                  <a
                    href="mailto:support@creditclean.ai?subject=Cancellation Request"
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Email Support
                  </a>
                </div>
              </div>

              {/* Legal notice */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                    <p>
                      <strong>Your rights:</strong> You have the right to dispute credit
                      report errors directly with credit bureaus at no cost. CreditClean AI
                      is a self-help tool — not a law firm and not legal advice.
                    </p>
                    <p className="mt-2">
                      Full details:{" "}
                      <Link href="/terms" className="underline hover:text-amber-900 dark:hover:text-amber-100">Terms</Link>{" | "}
                      <Link href="/refund-policy" className="underline hover:text-amber-900 dark:hover:text-amber-100">Refund Policy</Link>{" | "}
                      <Link href="/disclaimer" className="underline hover:text-amber-900 dark:hover:text-amber-100">Disclaimer</Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* CROA pre-payment modal */}
              <CROADisclosureModal
                open={showCROAModal}
                onClose={() => setShowCROAModal(false)}
                onAccept={() => {
                  setShowCROAModal(false);
                  handleUpgrade();
                }}
                planName="Pro Plan — $29/mo"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl animate-pulse"><div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
