import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Bureau, ItemType, Violation } from "@/lib/disputes/types";

// --- Types ---

export interface ForensicFinding {
  itemId: string;
  creditorName: string;
  accountNumber: string;
  itemType: ItemType;
  bureau: Bureau;
  violations: Violation[];
  removalProbability: number; // 0-100
  priorityScore: number; // 1-10
  analysis: string;
  recommendedAction: string;
  legalBasis: string[];
}

export interface ForensicReport {
  consumerName: string;
  bureau: Bureau;
  reportDate: string;
  totalItems: number;
  negativeItems: number;
  disputeableItems: number;
  estimatedRemovable: number;
  scoreImpactEstimate: string;
  findings: ForensicFinding[];
  actionPlan: {
    priority: number;
    action: string;
    deadline: string;
    itemId?: string;
  }[];
  legalReferences: {
    statute: string;
    description: string;
  }[];
}

// --- Color helpers ---

function severityColor(severity: "minor" | "moderate" | "severe"): string {
  switch (severity) {
    case "severe":
      return "#dc2626";
    case "moderate":
      return "#ea580c";
    case "minor":
      return "#ca8a04";
  }
}

function probabilityColor(prob: number): string {
  if (prob >= 75) return "#16a34a";
  if (prob >= 50) return "#ea580c";
  return "#dc2626";
}

// --- Styles ---

const s = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 56,
    paddingRight: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
    color: "#1a1a1a",
  },
  // Cover page
  coverPage: {
    paddingTop: 180,
    paddingBottom: 60,
    paddingLeft: 56,
    paddingRight: 56,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
    color: "#111827",
  },
  coverSubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 48,
  },
  coverMeta: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 6,
    color: "#374151",
  },
  coverConfidential: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
    fontFamily: "Helvetica-Oblique",
  },
  // Section headers
  sectionHeader: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: "#111827",
    color: "#111827",
  },
  subHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#374151",
  },
  // Executive summary
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  summaryCard: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#f9fafb",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
  },
  // Detailed finding
  findingCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 12,
  },
  findingTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#111827",
  },
  findingMeta: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 12,
  },
  badge: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    color: "#ffffff",
  },
  findingBody: {
    fontSize: 9,
    marginBottom: 6,
    color: "#374151",
    textAlign: "justify",
  },
  violationRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 8,
  },
  violationDot: {
    fontSize: 9,
    marginRight: 4,
  },
  violationText: {
    fontSize: 9,
    flex: 1,
  },
  // Action plan
  actionRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  actionPriority: {
    width: 28,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
  },
  actionText: {
    flex: 1,
    fontSize: 9,
  },
  actionDeadline: {
    width: 80,
    fontSize: 8,
    color: "#6b7280",
    textAlign: "right",
  },
  // Legal references
  legalRow: {
    marginBottom: 6,
  },
  legalStatute: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  legalDesc: {
    fontSize: 9,
    color: "#6b7280",
    paddingLeft: 8,
  },
  // Disclaimer
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#f59e0b",
  },
  disclaimerText: {
    fontSize: 8,
    color: "#92400e",
    fontFamily: "Helvetica-Oblique",
    textAlign: "center",
  },
  // Footer
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
    marginVertical: 8,
  },
});

function bureauLabel(bureau: Bureau): string {
  return bureau.charAt(0).toUpperCase() + bureau.slice(1);
}

export function ForensicReportPDF({ report }: { report: ForensicReport }) {
  const {
    consumerName,
    bureau,
    reportDate,
    totalItems,
    negativeItems,
    disputeableItems,
    estimatedRemovable,
    scoreImpactEstimate,
    findings,
    actionPlan,
    legalReferences,
  } = report;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={s.coverPage}>
        <Text style={s.coverTitle}>FORENSIC CREDIT REPORT</Text>
        <Text style={s.coverTitle}>ANALYSIS</Text>
        <Text style={s.coverSubtitle}>Comprehensive Dispute Strategy Report</Text>

        <View style={s.hr} />

        <Text style={s.coverMeta}>Prepared for: {consumerName}</Text>
        <Text style={s.coverMeta}>Bureau: {bureauLabel(bureau)}</Text>
        <Text style={s.coverMeta}>Date: {reportDate}</Text>

        <Text style={s.coverConfidential}>
          CONFIDENTIAL — Prepared for the exclusive use of {consumerName}
        </Text>
      </Page>

      {/* Executive Summary + Findings Table */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionHeader}>Executive Summary</Text>

        <View style={s.summaryGrid}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Total Items</Text>
            <Text style={s.summaryValue}>{totalItems}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Negative Items</Text>
            <Text style={s.summaryValue}>{negativeItems}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Disputeable</Text>
            <Text style={s.summaryValue}>{disputeableItems}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Est. Removable</Text>
            <Text style={s.summaryValue}>{estimatedRemovable}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Score Impact</Text>
            <Text style={[s.summaryValue, { fontSize: 14 }]}>
              {scoreImpactEstimate}
            </Text>
          </View>
        </View>

        {/* Findings Table */}
        <Text style={s.sectionHeader}>Findings Overview</Text>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, { width: "25%" }]}>Creditor</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Account</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Violations</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Removal %</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Priority</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Action</Text>
        </View>

        {findings.map((f, i) => (
          <View
            key={f.itemId}
            style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
          >
            <Text style={[s.tableCell, { width: "25%" }]}>
              {f.creditorName}
            </Text>
            <Text style={[s.tableCell, { width: "15%" }]}>
              ...{f.accountNumber}
            </Text>
            <Text style={[s.tableCell, { width: "15%" }]}>
              {f.violations.length} found
            </Text>
            <Text
              style={[
                s.tableCell,
                { width: "15%", color: probabilityColor(f.removalProbability) },
              ]}
            >
              {f.removalProbability}%
            </Text>
            <Text
              style={[s.tableCell, { width: "15%", fontFamily: "Helvetica-Bold" }]}
            >
              {f.priorityScore}/10
            </Text>
            <Text style={[s.tableCell, { width: "15%", fontSize: 8 }]}>
              {f.recommendedAction.substring(0, 30)}
              {f.recommendedAction.length > 30 ? "..." : ""}
            </Text>
          </View>
        ))}

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Detailed Findings */}
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.sectionHeader}>Detailed Findings</Text>

        {findings.map((f) => (
          <View key={f.itemId} style={s.findingCard} wrap={false}>
            <Text style={s.findingTitle}>
              {f.creditorName} — ...{f.accountNumber}
            </Text>

            <View style={s.findingMeta}>
              <Text
                style={[
                  s.badge,
                  {
                    backgroundColor: probabilityColor(f.removalProbability),
                  },
                ]}
              >
                {f.removalProbability}% removal
              </Text>
              <Text
                style={[s.badge, { backgroundColor: "#6366f1" }]}
              >
                Priority {f.priorityScore}/10
              </Text>
              <Text style={[s.badge, { backgroundColor: "#64748b" }]}>
                {f.itemType.replace(/_/g, " ")}
              </Text>
            </View>

            <Text style={s.findingBody}>{f.analysis}</Text>

            {f.violations.length > 0 && (
              <>
                <Text style={s.subHeader}>Violations Identified</Text>
                {f.violations.map((v, vi) => (
                  <View key={vi} style={s.violationRow}>
                    <Text
                      style={[s.violationDot, { color: severityColor(v.severity) }]}
                    >
                      {"\u25CF"}
                    </Text>
                    <Text style={s.violationText}>
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>
                        {v.statute}
                      </Text>
                      {" \u2014 "}
                      {v.description}
                      {v.severity === "severe" ? " [CRITICAL]" : ""}
                    </Text>
                  </View>
                ))}
              </>
            )}

            <Text style={s.subHeader}>Recommended Action</Text>
            <Text style={s.findingBody}>{f.recommendedAction}</Text>

            {f.legalBasis.length > 0 && (
              <>
                <Text style={s.subHeader}>Legal Basis</Text>
                {f.legalBasis.map((lb, li) => (
                  <Text key={li} style={[s.findingBody, { paddingLeft: 8 }]}>
                    {"\u2022"} {lb}
                  </Text>
                ))}
              </>
            )}
          </View>
        ))}

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Action Plan + Legal References + Disclaimer */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionHeader}>Action Plan</Text>

        {actionPlan.map((a, i) => (
          <View key={i} style={s.actionRow}>
            <Text style={s.actionPriority}>#{a.priority}</Text>
            <Text style={s.actionText}>{a.action}</Text>
            <Text style={s.actionDeadline}>{a.deadline}</Text>
          </View>
        ))}

        <Text style={s.sectionHeader}>Legal Reference</Text>

        {legalReferences.map((ref, i) => (
          <View key={i} style={s.legalRow}>
            <Text style={s.legalStatute}>{ref.statute}</Text>
            <Text style={s.legalDesc}>{ref.description}</Text>
          </View>
        ))}

        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            DISCLAIMER: This report is for informational purposes only and does
            not constitute legal advice. The analysis is based on information
            provided and publicly available data. Results may vary. Consult with
            a qualified attorney for legal advice regarding your specific
            situation.
          </Text>
        </View>

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
