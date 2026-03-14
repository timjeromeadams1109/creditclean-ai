"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

type Bureau = "equifax" | "experian" | "transunion";

type AccountType =
  | "revolving"
  | "installment"
  | "mortgage"
  | "collection"
  | "other";

interface ManualCreditItem {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType: AccountType;
  currentStatus: string;
  paymentStatus: string;
  dateOpened: string;
  dateReported: string;
  firstDelinquencyDate: string;
  lastPaymentDate: string;
  currentBalance: number | "";
  originalBalance: number | "";
  highBalance: number | "";
  creditLimit: number | "";
  pastDueAmount: number | "";
  originalCreditor: string;
  collectorName: string;
  isCollection: boolean;
  isMedical: boolean;
  isStudentLoan: boolean;
  isAuthorizedUser: boolean;
  paymentHistory: string;
  comments: string;
}

const emptyItem = (): ManualCreditItem => ({
  id: crypto.randomUUID(),
  accountName: "",
  accountNumber: "",
  accountType: "revolving",
  currentStatus: "",
  paymentStatus: "",
  dateOpened: "",
  dateReported: "",
  firstDelinquencyDate: "",
  lastPaymentDate: "",
  currentBalance: "",
  originalBalance: "",
  highBalance: "",
  creditLimit: "",
  pastDueAmount: "",
  originalCreditor: "",
  collectorName: "",
  isCollection: false,
  isMedical: false,
  isStudentLoan: false,
  isAuthorizedUser: false,
  paymentHistory: "",
  comments: "",
});

const accountTypeLabels: Record<AccountType, string> = {
  revolving: "Revolving",
  installment: "Installment",
  mortgage: "Mortgage",
  collection: "Collection",
  other: "Other",
};

const bureauConfig: Record<Bureau, { label: string }> = {
  equifax: { label: "Equifax" },
  experian: { label: "Experian" },
  transunion: { label: "TransUnion" },
};

export default function ManualAnalyzePage() {
  const router = useRouter();
  const [selectedBureau, setSelectedBureau] = useState<Bureau>("equifax");
  const [items, setItems] = useState<ManualCreditItem[]>([]);
  const [editingItem, setEditingItem] = useState<ManualCreditItem>(emptyItem());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState("CA");

  const handleSaveItem = () => {
    if (!editingItem.accountName.trim()) {
      setError("Account name is required.");
      return;
    }
    setError(null);

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = editingItem;
      setItems(updated);
      setEditingIndex(null);
    } else {
      setItems([...items, editingItem]);
    }
    setEditingItem(emptyItem());
    setShowForm(false);
  };

  const handleEditItem = (index: number) => {
    setEditingItem(items[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingItem(emptyItem());
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(emptyItem());
    if (items.length > 0) setShowForm(false);
  };

  const handleRunAnalysis = async () => {
    if (items.length === 0) {
      setError("Add at least one item before running the analysis.");
      return;
    }
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/forensic/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          bureau: selectedBureau,
          state,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed.");
      }

      const data = await res.json();
      router.push(`/forensic/${data.report.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const updateField = <K extends keyof ManualCreditItem>(
    key: K,
    value: ManualCreditItem[K]
  ) => {
    setEditingItem((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  const labelClass =
    "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Manual Forensic Analysis
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter each item from your credit report. Add all items, then run the
          forensic analysis.
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have your report yet?{" "}
          <a
            href="https://www.annualcreditreport.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Get free reports from all 3 bureaus
          </a>{" "}
          — then enter items from each report below.
        </p>
      </div>

      {/* Bureau + State selectors */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className={labelClass}>Bureau</label>
          <div className="flex gap-2">
            {(Object.keys(bureauConfig) as Bureau[]).map((bureau) => (
              <button
                key={bureau}
                onClick={() => setSelectedBureau(bureau)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedBureau === bureau
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {bureauConfig[bureau].label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-32">
          <label className={labelClass}>State (for SOL)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={inputClass}
          >
            {[
              "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
              "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
              "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
              "VA","WA","WV","WI","WY","DC",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Items ({items.length})
          </h2>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.accountName}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    {accountTypeLabels[item.accountType]}
                    {item.accountNumber && ` - ****${item.accountNumber}`}
                    {item.currentBalance !== "" &&
                      ` - $${Number(item.currentBalance).toLocaleString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.id ? null : item.id
                      )
                    }
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    {expandedItem === item.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditItem(i)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(i)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 text-sm sm:grid-cols-3">
                      <Detail label="Status" value={item.currentStatus} />
                      <Detail label="Payment Status" value={item.paymentStatus} />
                      <Detail label="Date Opened" value={item.dateOpened} />
                      <Detail label="Date Reported" value={item.dateReported} />
                      <Detail label="1st Delinquency" value={item.firstDelinquencyDate} />
                      <Detail label="Last Payment" value={item.lastPaymentDate} />
                      <Detail
                        label="Original Balance"
                        value={
                          item.originalBalance !== ""
                            ? `$${Number(item.originalBalance).toLocaleString()}`
                            : ""
                        }
                      />
                      <Detail
                        label="High Balance"
                        value={
                          item.highBalance !== ""
                            ? `$${Number(item.highBalance).toLocaleString()}`
                            : ""
                        }
                      />
                      <Detail
                        label="Credit Limit"
                        value={
                          item.creditLimit !== ""
                            ? `$${Number(item.creditLimit).toLocaleString()}`
                            : ""
                        }
                      />
                      <Detail
                        label="Past Due"
                        value={
                          item.pastDueAmount !== ""
                            ? `$${Number(item.pastDueAmount).toLocaleString()}`
                            : ""
                        }
                      />
                      <Detail label="Original Creditor" value={item.originalCreditor} />
                      <Detail label="Collector" value={item.collectorName} />
                      {item.paymentHistory && (
                        <div className="col-span-2 sm:col-span-3">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Payment History:
                          </span>{" "}
                          <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                            {item.paymentHistory}
                          </span>
                        </div>
                      )}
                      {item.comments && (
                        <div className="col-span-2 sm:col-span-3">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Comments:
                          </span>{" "}
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {item.comments}
                          </span>
                        </div>
                      )}
                      <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-3">
                        {item.isCollection && <Tag>Collection</Tag>}
                        {item.isMedical && <Tag>Medical</Tag>}
                        {item.isStudentLoan && <Tag>Student Loan</Tag>}
                        {item.isAuthorizedUser && <Tag>Auth. User</Tag>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Item Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {editingIndex !== null ? "Edit Item" : "Add Credit Item"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Account Name */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingItem.accountName}
                  onChange={(e) => updateField("accountName", e.target.value)}
                  placeholder="e.g. Capital One"
                  className={inputClass}
                />
              </div>

              {/* Account Number (partial) */}
              <div>
                <label className={labelClass}>Account # (partial)</label>
                <input
                  type="text"
                  value={editingItem.accountNumber}
                  onChange={(e) => updateField("accountNumber", e.target.value)}
                  placeholder="e.g. 1234"
                  maxLength={10}
                  className={inputClass}
                />
              </div>

              {/* Account Type */}
              <div>
                <label className={labelClass}>Account Type</label>
                <select
                  value={editingItem.accountType}
                  onChange={(e) =>
                    updateField("accountType", e.target.value as AccountType)
                  }
                  className={inputClass}
                >
                  {Object.entries(accountTypeLabels).map(([val, lbl]) => (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Status */}
              <div>
                <label className={labelClass}>Current Status</label>
                <input
                  type="text"
                  value={editingItem.currentStatus}
                  onChange={(e) => updateField("currentStatus", e.target.value)}
                  placeholder="e.g. Open, Closed, Collection"
                  className={inputClass}
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className={labelClass}>Payment Status</label>
                <input
                  type="text"
                  value={editingItem.paymentStatus}
                  onChange={(e) => updateField("paymentStatus", e.target.value)}
                  placeholder="e.g. Current, 30 Days Late"
                  className={inputClass}
                />
              </div>

              {/* Date Opened */}
              <div>
                <label className={labelClass}>Date Opened</label>
                <input
                  type="date"
                  value={editingItem.dateOpened}
                  onChange={(e) => updateField("dateOpened", e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Date Reported */}
              <div>
                <label className={labelClass}>Date Reported</label>
                <input
                  type="date"
                  value={editingItem.dateReported}
                  onChange={(e) => updateField("dateReported", e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* First Delinquency Date */}
              <div>
                <label className={labelClass}>First Delinquency Date</label>
                <input
                  type="date"
                  value={editingItem.firstDelinquencyDate}
                  onChange={(e) =>
                    updateField("firstDelinquencyDate", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Last Payment Date */}
              <div>
                <label className={labelClass}>Last Payment Date</label>
                <input
                  type="date"
                  value={editingItem.lastPaymentDate}
                  onChange={(e) =>
                    updateField("lastPaymentDate", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Balances */}
              <div>
                <label className={labelClass}>Current Balance</label>
                <input
                  type="number"
                  value={editingItem.currentBalance}
                  onChange={(e) =>
                    updateField(
                      "currentBalance",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  min={0}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Original Balance</label>
                <input
                  type="number"
                  value={editingItem.originalBalance}
                  onChange={(e) =>
                    updateField(
                      "originalBalance",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  min={0}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>High Balance</label>
                <input
                  type="number"
                  value={editingItem.highBalance}
                  onChange={(e) =>
                    updateField(
                      "highBalance",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  min={0}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Credit Limit</label>
                <input
                  type="number"
                  value={editingItem.creditLimit}
                  onChange={(e) =>
                    updateField(
                      "creditLimit",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  min={0}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Past Due Amount</label>
                <input
                  type="number"
                  value={editingItem.pastDueAmount}
                  onChange={(e) =>
                    updateField(
                      "pastDueAmount",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  min={0}
                  className={inputClass}
                />
              </div>

              {/* Original Creditor */}
              <div>
                <label className={labelClass}>Original Creditor</label>
                <input
                  type="text"
                  value={editingItem.originalCreditor}
                  onChange={(e) =>
                    updateField("originalCreditor", e.target.value)
                  }
                  placeholder="For collections"
                  className={inputClass}
                />
              </div>

              {/* Collector Name */}
              <div>
                <label className={labelClass}>Collector Name</label>
                <input
                  type="text"
                  value={editingItem.collectorName}
                  onChange={(e) =>
                    updateField("collectorName", e.target.value)
                  }
                  placeholder="Collection agency name"
                  className={inputClass}
                />
              </div>

              {/* Payment History */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Payment History String</label>
                <input
                  type="text"
                  value={editingItem.paymentHistory}
                  onChange={(e) =>
                    updateField("paymentHistory", e.target.value.toUpperCase())
                  }
                  placeholder="e.g. CCCCC30CCCC60CCC"
                  className={`${inputClass} font-mono`}
                />
                <p className="mt-1 text-xs text-zinc-400">
                  C = Current, 30/60/90/120 = Days Late, CO = Charge Off
                </p>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 sm:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingItem.isCollection}
                    onChange={(e) =>
                      updateField("isCollection", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Collection Account
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingItem.isMedical}
                    onChange={(e) =>
                      updateField("isMedical", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Medical Debt
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingItem.isStudentLoan}
                    onChange={(e) =>
                      updateField("isStudentLoan", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Student Loan
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingItem.isAuthorizedUser}
                    onChange={(e) =>
                      updateField("isAuthorizedUser", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Authorized User
                </label>
              </div>

              {/* Comments */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Comments / Remarks</label>
                <textarea
                  value={editingItem.comments}
                  onChange={(e) => updateField("comments", e.target.value)}
                  placeholder="Any remarks from the credit report or your own notes"
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancelEdit}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {editingIndex !== null ? "Update Item" : "Add Item"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Another button (when form is hidden) */}
      {!showForm && (
        <button
          onClick={() => {
            setEditingItem(emptyItem());
            setEditingIndex(null);
            setShowForm(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-4 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
        >
          <Plus className="h-4 w-4" />
          Add Another Item
        </button>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run Analysis */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Ready to analyze {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
            <p className="mt-0.5 text-sm text-blue-700 dark:text-blue-300">
              {bureauConfig[selectedBureau].label} report, {state} statute of
              limitations
            </p>
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="h-4 w-4" />
                Run Forensic Analysis
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-zinc-500 dark:text-zinc-400">{label}:</span>{" "}
      <span className="text-zinc-700 dark:text-zinc-300">{value}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
      {children}
    </span>
  );
}
