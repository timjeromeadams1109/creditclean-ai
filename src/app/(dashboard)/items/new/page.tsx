"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Bureau, ItemType } from "@/lib/disputes/types";

const bureauOptions = [
  { value: Bureau.EQUIFAX, label: "Equifax" },
  { value: Bureau.EXPERIAN, label: "Experian" },
  { value: Bureau.TRANSUNION, label: "TransUnion" },
];

const itemTypeOptions = [
  { value: ItemType.LATE_PAYMENT, label: "Late Payment" },
  { value: ItemType.COLLECTION, label: "Collection" },
  { value: ItemType.CHARGE_OFF, label: "Charge-Off" },
  { value: ItemType.REPOSSESSION, label: "Repossession" },
  { value: ItemType.FORECLOSURE, label: "Foreclosure" },
  { value: ItemType.BANKRUPTCY, label: "Bankruptcy" },
  { value: ItemType.JUDGMENT, label: "Judgment" },
  { value: ItemType.TAX_LIEN, label: "Tax Lien" },
  { value: ItemType.INQUIRY, label: "Inquiry" },
  { value: ItemType.MEDICAL_DEBT, label: "Medical Debt" },
  { value: ItemType.STUDENT_LOAN, label: "Student Loan" },
  { value: ItemType.OTHER, label: "Other" },
];

export default function NewItemPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedBureaus, setSelectedBureaus] = useState<Bureau[]>([]);
  const [form, setForm] = useState({
    creditorName: "",
    accountNumber: "",
    originalCreditor: "",
    itemType: "" as ItemType | "",
    balance: "",
    dateOpened: "",
    dateReported: "",
    notes: "",
  });

  function toggleBureau(bureau: Bureau) {
    setSelectedBureaus((prev) =>
      prev.includes(bureau)
        ? prev.filter((b) => b !== bureau)
        : [...prev, bureau]
    );
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedBureaus.length === 0) return;
    setSubmitting(true);

    // TODO: Insert one credit_item per selected bureau into Supabase
    // Each item gets the same account details but different bureau
    // for (const bureau of selectedBureaus) {
    //   await supabase.from("credit_items").insert({
    //     bureau,
    //     creditor_name: form.creditorName,
    //     account_number: form.accountNumber,
    //     original_creditor: form.originalCreditor,
    //     item_type: form.itemType,
    //     balance: parseFloat(form.balance) || null,
    //     date_opened: form.dateOpened || null,
    //     date_reported: form.dateReported || null,
    //     notes: form.notes,
    //     status: "identified",
    //     user_id: session.user.id,
    //   });
    // }

    // Simulate submission
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    router.push("/items");
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";
  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Add Credit Item
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Add a negative item from your credit report. Select all bureaus where
          this item appears.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Bureau selector */}
        <fieldset>
          <legend className={labelClass}>
            Bureaus <span className="text-red-500">*</span>
          </legend>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Select all credit bureaus where this item appears.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {bureauOptions.map((b) => {
              const selected = selectedBureaus.includes(b.value);
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => toggleBureau(b.value)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selected
                        ? "border-blue-600 bg-blue-600"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  {b.label}
                </button>
              );
            })}
          </div>
          {selectedBureaus.length === 0 && (
            <p className="mt-2 text-xs text-red-500">
              Select at least one bureau.
            </p>
          )}
        </fieldset>

        {/* Account info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="creditorName" className={labelClass}>
              Account / Creditor Name <span className="text-red-500">*</span>
            </label>
            <input
              id="creditorName"
              type="text"
              required
              placeholder="e.g., Capital One"
              value={form.creditorName}
              onChange={(e) => updateField("creditorName", e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="accountNumber" className={labelClass}>
              Account Number (last 4-6 digits)
            </label>
            <input
              id="accountNumber"
              type="text"
              placeholder="e.g., ****4821"
              value={form.accountNumber}
              onChange={(e) => updateField("accountNumber", e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="originalCreditor" className={labelClass}>
            Original Creditor
          </label>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            If different from the current account holder (e.g., the original
            lender before a collection agency took over).
          </p>
          <input
            id="originalCreditor"
            type="text"
            placeholder="e.g., Capital One Bank"
            value={form.originalCreditor}
            onChange={(e) => updateField("originalCreditor", e.target.value)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>

        {/* Item type */}
        <div>
          <label htmlFor="itemType" className={labelClass}>
            Item Type <span className="text-red-500">*</span>
          </label>
          <select
            id="itemType"
            required
            value={form.itemType}
            onChange={(e) => updateField("itemType", e.target.value)}
            className={`mt-1.5 ${inputClass}`}
          >
            <option value="">Select type...</option>
            {itemTypeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Financial details */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="balance" className={labelClass}>
              Balance
            </label>
            <input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.balance}
              onChange={(e) => updateField("balance", e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="dateOpened" className={labelClass}>
              Date Opened
            </label>
            <input
              id="dateOpened"
              type="date"
              value={form.dateOpened}
              onChange={(e) => updateField("dateOpened", e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="dateReported" className={labelClass}>
              Date Reported
            </label>
            <input
              id="dateReported"
              type="date"
              value={form.dateReported}
              onChange={(e) => updateField("dateReported", e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Any additional context about this item (e.g., never received validation notice, already disputed verbally, etc.)"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className={`mt-1.5 ${inputClass} resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:justify-end dark:border-zinc-800">
          <Link
            href="/items"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || selectedBureaus.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Item
                {selectedBureaus.length > 1 &&
                  ` (${selectedBureaus.length} bureaus)`}
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
