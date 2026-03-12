"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Bureau, ItemType } from "@/lib/disputes/types";

type ItemStatus = "identified" | "disputing" | "responded" | "resolved";

interface CreditItemRow {
  id: string;
  creditorName: string;
  bureau: Bureau;
  itemType: ItemType;
  balance: number;
  status: ItemStatus;
  currentRound: number;
}

// TODO: Replace with Supabase query — fetch all credit_items for user
const items: CreditItemRow[] = [
  {
    id: "1",
    creditorName: "Capital One",
    bureau: Bureau.EQUIFAX,
    itemType: ItemType.COLLECTION,
    balance: 2340,
    status: "disputing",
    currentRound: 2,
  },
  {
    id: "2",
    creditorName: "Medical Center of Dallas",
    bureau: Bureau.EXPERIAN,
    itemType: ItemType.MEDICAL_DEBT,
    balance: 1240,
    status: "responded",
    currentRound: 1,
  },
  {
    id: "3",
    creditorName: "AT&T",
    bureau: Bureau.TRANSUNION,
    itemType: ItemType.LATE_PAYMENT,
    balance: 0,
    status: "resolved",
    currentRound: 1,
  },
  {
    id: "4",
    creditorName: "Midland Credit Management",
    bureau: Bureau.EQUIFAX,
    itemType: ItemType.COLLECTION,
    balance: 4500,
    status: "disputing",
    currentRound: 3,
  },
  {
    id: "5",
    creditorName: "Navient",
    bureau: Bureau.EXPERIAN,
    itemType: ItemType.STUDENT_LOAN,
    balance: 12800,
    status: "identified",
    currentRound: 0,
  },
  {
    id: "6",
    creditorName: "Wells Fargo",
    bureau: Bureau.TRANSUNION,
    itemType: ItemType.CHARGE_OFF,
    balance: 3200,
    status: "disputing",
    currentRound: 1,
  },
];

const statusConfig: Record<
  ItemStatus,
  { label: string; className: string }
> = {
  identified: {
    label: "Identified",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  disputing: {
    label: "Disputing",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  responded: {
    label: "Responded",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
};

const bureauLabels: Record<Bureau, string> = {
  [Bureau.EQUIFAX]: "Equifax",
  [Bureau.EXPERIAN]: "Experian",
  [Bureau.TRANSUNION]: "TransUnion",
};

const itemTypeLabels: Record<ItemType, string> = {
  [ItemType.LATE_PAYMENT]: "Late Payment",
  [ItemType.COLLECTION]: "Collection",
  [ItemType.CHARGE_OFF]: "Charge-Off",
  [ItemType.REPOSSESSION]: "Repossession",
  [ItemType.FORECLOSURE]: "Foreclosure",
  [ItemType.BANKRUPTCY]: "Bankruptcy",
  [ItemType.JUDGMENT]: "Judgment",
  [ItemType.TAX_LIEN]: "Tax Lien",
  [ItemType.INQUIRY]: "Inquiry",
  [ItemType.MEDICAL_DEBT]: "Medical Debt",
  [ItemType.STUDENT_LOAN]: "Student Loan",
  [ItemType.OTHER]: "Other",
};

export default function ItemsPage() {
  const [search, setSearch] = useState("");
  const [filterBureau, setFilterBureau] = useState<Bureau | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ItemStatus | "all">("all");
  const [filterType, setFilterType] = useState<ItemType | "all">("all");

  const filtered = items.filter((item) => {
    if (
      search &&
      !item.creditorName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterBureau !== "all" && item.bureau !== filterBureau) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterType !== "all" && item.itemType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Credit Items
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {items.length} items across all bureaus
          </p>
        </div>
        <Link
          href="/items/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by creditor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterBureau}
            onChange={(e) => setFilterBureau(e.target.value as Bureau | "all")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Bureaus</option>
            <option value={Bureau.EQUIFAX}>Equifax</option>
            <option value={Bureau.EXPERIAN}>Experian</option>
            <option value={Bureau.TRANSUNION}>TransUnion</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ItemType | "all")}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Types</option>
            {Object.entries(itemTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as ItemStatus | "all")
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All Statuses</option>
            <option value="identified">Identified</option>
            <option value="disputing">Disputing</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Items list — responsive cards on mobile, table-like on desktop */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Filter className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">
              No items match your filters.
            </p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link
                href={`/items/${item.id}`}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {/* Creditor + type */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.creditorName}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    {itemTypeLabels[item.itemType]}
                  </p>
                </div>

                {/* Bureau */}
                <div className="shrink-0 sm:w-24">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {bureauLabels[item.bureau]}
                  </span>
                </div>

                {/* Balance */}
                <div className="shrink-0 sm:w-24 sm:text-right">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.balance > 0
                      ? `$${item.balance.toLocaleString()}`
                      : "—"}
                  </span>
                </div>

                {/* Round */}
                <div className="shrink-0 sm:w-20 sm:text-center">
                  <span className="text-sm text-zinc-500">
                    {item.currentRound > 0
                      ? `Round ${item.currentRound}`
                      : "New"}
                  </span>
                </div>

                {/* Status badge */}
                <div className="shrink-0">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      statusConfig[item.status].className
                    }`}
                  >
                    {statusConfig[item.status].label}
                  </span>
                </div>

                <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-400 sm:block" />
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
