"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Plus,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Bureau } from "@/lib/disputes/types";

interface ScoreEntry {
  id: string;
  bureau: Bureau;
  score: number;
  date: string;
  source: string;
}

// TODO: Replace with Supabase query — fetch credit_scores for user ordered by date
const scoreHistory: ScoreEntry[] = [
  { id: "1", bureau: Bureau.EQUIFAX, score: 580, date: "2025-12-01", source: "Credit Karma" },
  { id: "2", bureau: Bureau.EXPERIAN, score: 572, date: "2025-12-01", source: "Experian App" },
  { id: "3", bureau: Bureau.TRANSUNION, score: 585, date: "2025-12-01", source: "Credit Karma" },
  { id: "4", bureau: Bureau.EQUIFAX, score: 594, date: "2026-01-15", source: "Credit Karma" },
  { id: "5", bureau: Bureau.EXPERIAN, score: 586, date: "2026-01-15", source: "Experian App" },
  { id: "6", bureau: Bureau.TRANSUNION, score: 608, date: "2026-01-15", source: "Credit Karma" },
  { id: "7", bureau: Bureau.EQUIFAX, score: 612, date: "2026-03-01", source: "Credit Karma" },
  { id: "8", bureau: Bureau.EXPERIAN, score: 598, date: "2026-03-01", source: "Experian App" },
  { id: "9", bureau: Bureau.TRANSUNION, score: 605, date: "2026-03-01", source: "Credit Karma" },
];

const bureauLabels: Record<Bureau, string> = {
  [Bureau.EQUIFAX]: "Equifax",
  [Bureau.EXPERIAN]: "Experian",
  [Bureau.TRANSUNION]: "TransUnion",
};

const bureauColors: Record<Bureau, string> = {
  [Bureau.EQUIFAX]: "bg-red-500",
  [Bureau.EXPERIAN]: "bg-blue-500",
  [Bureau.TRANSUNION]: "bg-emerald-500",
};

const bureauTextColors: Record<Bureau, string> = {
  [Bureau.EQUIFAX]: "text-red-600 dark:text-red-400",
  [Bureau.EXPERIAN]: "text-blue-600 dark:text-blue-400",
  [Bureau.TRANSUNION]: "text-emerald-600 dark:text-emerald-400",
};

const targetScore = 720;
const projectedDate = "August 2026";

export default function ScoresPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    bureau: "" as Bureau | "",
    score: "",
    date: "",
    source: "",
  });

  // Group scores by date for chart
  const dates = [...new Set(scoreHistory.map((s) => s.date))].sort();
  const bureaus = [Bureau.EQUIFAX, Bureau.EXPERIAN, Bureau.TRANSUNION];

  // Get latest score per bureau
  const latestScores = bureaus.map((bureau) => {
    const entries = scoreHistory
      .filter((s) => s.bureau === bureau)
      .sort((a, b) => b.date.localeCompare(a.date));
    return entries[0];
  });

  // Simple bar chart — height relative to 850 scale
  const chartMax = 850;
  const chartMin = 300;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Insert into Supabase credit_scores table
    // await supabase.from("credit_scores").insert({
    //   bureau: form.bureau,
    //   score: parseInt(form.score),
    //   date: form.date,
    //   source: form.source,
    //   user_id: session.user.id,
    // });
    setShowForm(false);
    setForm({ bureau: "", score: "", date: "", source: "" });
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Score Tracking
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Monitor your credit score progress across all three bureaus.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Score
        </button>
      </div>

      {/* Add score form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Enter New Score
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Bureau
              </label>
              <select
                required
                value={form.bureau}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bureau: e.target.value as Bureau }))
                }
                className={`mt-1.5 ${inputClass}`}
              >
                <option value="">Select...</option>
                {bureaus.map((b) => (
                  <option key={b} value={b}>
                    {bureauLabels[b]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Score
              </label>
              <input
                type="number"
                required
                min="300"
                max="850"
                placeholder="e.g., 620"
                value={form.score}
                onChange={(e) =>
                  setForm((f) => ({ ...f, score: e.target.value }))
                }
                className={`mt-1.5 ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className={`mt-1.5 ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Source
              </label>
              <input
                type="text"
                placeholder="e.g., Credit Karma"
                value={form.source}
                onChange={(e) =>
                  setForm((f) => ({ ...f, source: e.target.value }))
                }
                className={`mt-1.5 ${inputClass}`}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save Score
            </button>
          </div>
        </motion.form>
      )}

      {/* Target + projection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Target Score
            </p>
            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {targetScore}
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
            <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Projected Timeline
            </p>
            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {projectedDate}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Score chart placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Score History
          </h2>
          <div className="flex items-center gap-4">
            {bureaus.map((b) => (
              <div key={b} className="flex items-center gap-1.5">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${bureauColors[b]}`}
                />
                <span className="text-xs text-zinc-500">
                  {bureauLabels[b]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Simple bar chart visualization */}
        <div className="mt-6">
          {/* Target line */}
          <div className="relative mb-2">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-blue-300 dark:border-blue-700"
              style={{
                bottom: `${((targetScore - chartMin) / (chartMax - chartMin)) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-end justify-around gap-2 sm:gap-4" style={{ height: "240px" }}>
            {dates.map((date) => {
              const dateScores = scoreHistory.filter((s) => s.date === date);
              return (
                <div key={date} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full items-end justify-center gap-1" style={{ height: "200px" }}>
                    {bureaus.map((bureau) => {
                      const entry = dateScores.find((s) => s.bureau === bureau);
                      if (!entry) return null;
                      const heightPct =
                        ((entry.score - chartMin) / (chartMax - chartMin)) * 100;
                      return (
                        <motion.div
                          key={bureau}
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                          className={`w-4 rounded-t sm:w-6 ${bureauColors[bureau]} opacity-80`}
                          title={`${bureauLabels[bureau]}: ${entry.score}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* TODO: Replace with a proper charting library (recharts/chart.js) for line chart */}
          <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Placeholder chart — integrate recharts or chart.js for full line
            chart visualization
          </p>
        </div>
      </motion.div>

      {/* Score history table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            All Entries
          </h2>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {[...scoreHistory].reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 px-5 py-3"
            >
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${bureauColors[entry.bureau]}`}
              />
              <span
                className={`w-24 shrink-0 text-sm font-medium ${bureauTextColors[entry.bureau]}`}
              >
                {bureauLabels[entry.bureau]}
              </span>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {entry.score}
              </span>
              <span className="flex-1 text-sm text-zinc-500">
                {entry.source}
              </span>
              <span className="shrink-0 text-sm text-zinc-400">
                {entry.date}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
