import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type {
  AttorneyPackage,
  Violation,
  DisputeRound,
  UserProfile,
} from "@/lib/disputes/types";

// --- Extended types for PDF-specific data ---

export interface AttorneyPackagePDFData extends AttorneyPackage {
  damagesCalculation: {
    statutoryMin: number;
    statutoryMax: number;
    actualDamages?: number;
    actualDamagesDescription?: string;
    punitivePotential?: string;
    attorneyFees?: string;
    stateLawDamages?: string;
    stateLawDescription?: string;
    totalEstimatedMin: number;
    totalEstimatedMax: number;
  };
  evidenceExhibits: {
    exhibitLabel: string; // e.g. "Exhibit A"
    description: string;
    date: string;
    type: string; // "letter_sent", "response_received", "credit_report", etc.
  }[];
  legalMemorandum: string;
  recommendedClaims: {
    cause: string; // e.g. "FCRA Section 611 — Failure to Conduct Reasonable Investigation"
    basis: string;
    strength: "strong" | "moderate" | "weak";
  }[];
  caseNumber?: string;
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
  // Cover
  coverPage: {
    paddingTop: 160,
    paddingBottom: 60,
    paddingLeft: 56,
    paddingRight: 56,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  coverLabel: {
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#9ca3af",
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#111827",
  },
  coverCase: {
    fontSize: 16,
    textAlign: "center",
    color: "#374151",
    marginBottom: 40,
    fontFamily: "Helvetica-Oblique",
  },
  coverMeta: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 6,
    color: "#374151",
  },
  coverConfidential: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#dc2626",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  coverPrivilege: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    fontFamily: "Helvetica-Oblique",
  },
  // TOC
  tocTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    color: "#111827",
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tocItemText: {
    fontSize: 11,
    color: "#374151",
  },
  tocItemSection: {
    fontFamily: "Helvetica-Bold",
    marginRight: 8,
    color: "#111827",
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
  // Content
  bodyText: {
    fontSize: 10,
    marginBottom: 6,
    textAlign: "justify",
    color: "#374151",
  },
  label: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    marginBottom: 8,
    color: "#111827",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  infoCol: {
    width: "45%",
  },
  // Timeline
  timelineRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 4,
  },
  timelineDate: {
    width: 80,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
  },
  timelineDot: {
    width: 16,
    fontSize: 10,
    color: "#6366f1",
    textAlign: "center",
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 4,
  },
  timelineEvent: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 1,
  },
  timelineDetails: {
    fontSize: 9,
    color: "#6b7280",
  },
  // Violations table
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
  // Damages
  damagesCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  damagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  damagesLabel: {
    fontSize: 10,
    color: "#374151",
  },
  damagesValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  damagesTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#111827",
  },
  damagesTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  damagesTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
  },
  // Exhibits
  exhibitRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  exhibitLabel: {
    width: 70,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6366f1",
  },
  exhibitDesc: {
    flex: 1,
    fontSize: 9,
    color: "#374151",
  },
  exhibitDate: {
    width: 80,
    fontSize: 8,
    color: "#6b7280",
    textAlign: "right",
  },
  // Claims
  claimCard: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
  },
  claimTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  claimBasis: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
    textAlign: "justify",
  },
  claimStrength: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    color: "#ffffff",
    alignSelf: "flex-start",
  },
  // Page number
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function strengthColor(strength: "strong" | "moderate" | "weak"): string {
  switch (strength) {
    case "strong":
      return "#16a34a";
    case "moderate":
      return "#ea580c";
    case "weak":
      return "#dc2626";
  }
}

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

const tocSections = [
  "I. Client Information",
  "II. Case Summary",
  "III. Timeline of Events",
  "IV. Violation Inventory",
  "V. Damages Calculation",
  "VI. Evidence Exhibits",
  "VII. Legal Memorandum",
  "VIII. Recommended Claims",
];

export function AttorneyPackagePDF({ pkg }: { pkg: AttorneyPackagePDFData }) {
  const {
    clientProfile,
    creditItem,
    timeline,
    disputeRounds,
    identifiedViolations,
    estimatedStatutoryDamages,
    summary,
    damagesCalculation,
    evidenceExhibits,
    legalMemorandum,
    recommendedClaims,
    caseNumber,
  } = pkg;

  const clientName = `${clientProfile.firstName} ${clientProfile.lastName}`;
  const respondent =
    creditItem.collectorName ?? creditItem.creditorName;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={s.coverPage}>
        <Text style={s.coverLabel}>Litigation Package</Text>
        <Text style={s.coverTitle}>
          {clientName}
        </Text>
        <Text style={s.coverCase}>v. {respondent}</Text>

        {caseNumber && (
          <Text style={s.coverMeta}>Case No.: {caseNumber}</Text>
        )}
        <Text style={s.coverMeta}>
          Prepared: {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Text style={s.coverConfidential}>
          Attorney-Client Privileged / Work Product
        </Text>
        <Text style={s.coverPrivilege}>
          This document is prepared in anticipation of litigation and is
          protected by attorney-client privilege and the work product doctrine.
        </Text>
      </Page>

      {/* Table of Contents */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.tocTitle}>Table of Contents</Text>

        {tocSections.map((section, i) => (
          <View key={i} style={s.tocItem}>
            <Text style={s.tocItemText}>
              <Text style={s.tocItemSection}>{section}</Text>
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

      {/* Client Information + Case Summary */}
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.sectionHeader}>I. Client Information</Text>

        <View style={s.infoGrid}>
          <View style={s.infoCol}>
            <Text style={s.label}>Full Name</Text>
            <Text style={s.value}>{clientName}</Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Address</Text>
            <Text style={s.value}>
              {clientProfile.address.street},{" "}
              {clientProfile.address.city},{" "}
              {clientProfile.address.state}{" "}
              {clientProfile.address.zip}
            </Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>SSN (Last 4)</Text>
            <Text style={s.value}>XXX-XX-{clientProfile.ssnLast4}</Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Date of Birth</Text>
            <Text style={s.value}>{clientProfile.dob}</Text>
          </View>
          {clientProfile.email && (
            <View style={s.infoCol}>
              <Text style={s.label}>Email</Text>
              <Text style={s.value}>{clientProfile.email}</Text>
            </View>
          )}
          {clientProfile.phone && (
            <View style={s.infoCol}>
              <Text style={s.label}>Phone</Text>
              <Text style={s.value}>{clientProfile.phone}</Text>
            </View>
          )}
        </View>

        <Text style={s.sectionHeader}>II. Case Summary</Text>
        <Text style={s.bodyText}>{summary}</Text>

        <Text style={s.subHeader}>Subject Account</Text>
        <View style={s.infoGrid}>
          <View style={s.infoCol}>
            <Text style={s.label}>Creditor</Text>
            <Text style={s.value}>{creditItem.creditorName}</Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Account Number</Text>
            <Text style={s.value}>...{creditItem.accountNumber}</Text>
          </View>
          {creditItem.collectorName && (
            <View style={s.infoCol}>
              <Text style={s.label}>Collection Agency</Text>
              <Text style={s.value}>{creditItem.collectorName}</Text>
            </View>
          )}
          <View style={s.infoCol}>
            <Text style={s.label}>Balance</Text>
            <Text style={s.value}>
              {creditItem.balance
                ? formatCurrency(creditItem.balance)
                : "Unknown"}
            </Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Violations Found</Text>
            <Text style={s.value}>{identifiedViolations.length}</Text>
          </View>
          <View style={s.infoCol}>
            <Text style={s.label}>Dispute Rounds</Text>
            <Text style={s.value}>{disputeRounds.length}</Text>
          </View>
        </View>

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Timeline */}
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.sectionHeader}>III. Timeline of Events</Text>

        {timeline.map((t, i) => (
          <View key={i} style={s.timelineRow}>
            <Text style={s.timelineDate}>{t.date}</Text>
            <Text style={s.timelineDot}>{"\u25C6"}</Text>
            <View style={s.timelineContent}>
              <Text style={s.timelineEvent}>{t.event}</Text>
              <Text style={s.timelineDetails}>{t.details}</Text>
            </View>
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

      {/* Violation Inventory */}
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.sectionHeader}>IV. Violation Inventory</Text>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, { width: "20%" }]}>Statute</Text>
          <Text style={[s.tableHeaderText, { width: "30%" }]}>Description</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Severity</Text>
          <Text style={[s.tableHeaderText, { width: "15%" }]}>Damages</Text>
          <Text style={[s.tableHeaderText, { width: "20%" }]}>Evidence</Text>
        </View>

        {identifiedViolations.map((v, i) => (
          <View
            key={i}
            style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
            wrap={false}
          >
            <Text style={[s.tableCell, { width: "20%", fontFamily: "Helvetica-Bold" }]}>
              {v.statute}
            </Text>
            <Text style={[s.tableCell, { width: "30%" }]}>
              {v.description}
            </Text>
            <Text
              style={[
                s.tableCell,
                { width: "15%", color: severityColor(v.severity) },
              ]}
            >
              {v.severity.toUpperCase()}
            </Text>
            <Text style={[s.tableCell, { width: "15%" }]}>
              {v.estimatedDamages ?? "TBD"}
            </Text>
            <Text style={[s.tableCell, { width: "20%", fontSize: 8 }]}>
              {v.evidenceDescription.substring(0, 60)}
              {v.evidenceDescription.length > 60 ? "..." : ""}
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

      {/* Damages Calculation */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionHeader}>V. Damages Calculation</Text>

        <View style={s.damagesCard}>
          <View style={s.damagesRow}>
            <Text style={s.damagesLabel}>
              Statutory Damages ({identifiedViolations.length} violations)
            </Text>
            <Text style={s.damagesValue}>
              {formatCurrency(damagesCalculation.statutoryMin)} —{" "}
              {formatCurrency(damagesCalculation.statutoryMax)}
            </Text>
          </View>

          {damagesCalculation.actualDamages !== undefined && (
            <View style={s.damagesRow}>
              <Text style={s.damagesLabel}>
                Actual Damages
                {damagesCalculation.actualDamagesDescription
                  ? ` (${damagesCalculation.actualDamagesDescription})`
                  : ""}
              </Text>
              <Text style={s.damagesValue}>
                {formatCurrency(damagesCalculation.actualDamages)}
              </Text>
            </View>
          )}

          {damagesCalculation.punitivePotential && (
            <View style={s.damagesRow}>
              <Text style={s.damagesLabel}>Punitive Damages Potential</Text>
              <Text style={s.damagesValue}>
                {damagesCalculation.punitivePotential}
              </Text>
            </View>
          )}

          {damagesCalculation.attorneyFees && (
            <View style={s.damagesRow}>
              <Text style={s.damagesLabel}>
                Attorney Fees & Costs (statutory)
              </Text>
              <Text style={s.damagesValue}>
                {damagesCalculation.attorneyFees}
              </Text>
            </View>
          )}

          {damagesCalculation.stateLawDamages && (
            <View style={s.damagesRow}>
              <Text style={s.damagesLabel}>
                State Law Additional Damages
                {damagesCalculation.stateLawDescription
                  ? ` (${damagesCalculation.stateLawDescription})`
                  : ""}
              </Text>
              <Text style={s.damagesValue}>
                {damagesCalculation.stateLawDamages}
              </Text>
            </View>
          )}

          <View style={s.damagesTotalRow}>
            <Text style={s.damagesTotalLabel}>Estimated Total Range</Text>
            <Text style={s.damagesTotalValue}>
              {formatCurrency(damagesCalculation.totalEstimatedMin)} —{" "}
              {formatCurrency(damagesCalculation.totalEstimatedMax)}
            </Text>
          </View>
        </View>

        <Text style={s.bodyText}>
          Per-violation statutory damages reference: FCRA {"\u00A7"} 616(a)
          provides $100 — $1,000 per willful violation. FDCPA {"\u00A7"} 813
          provides up to $1,000 per action. State laws may provide additional
          damages (e.g., CA CCRAA {"\u00A7"} 1785.31: $100 — $5,000; TX
          treble actual damages).
        </Text>

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Evidence Exhibits + Legal Memorandum */}
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.sectionHeader}>VI. Evidence Exhibits</Text>

        {evidenceExhibits.map((ex, i) => (
          <View key={i} style={s.exhibitRow}>
            <Text style={s.exhibitLabel}>{ex.exhibitLabel}</Text>
            <Text style={s.exhibitDesc}>{ex.description}</Text>
            <Text style={s.exhibitDate}>{ex.date}</Text>
          </View>
        ))}

        <Text style={s.sectionHeader}>VII. Legal Memorandum</Text>

        {legalMemorandum.split("\n\n").map((para, i) => (
          <Text key={i} style={s.bodyText}>
            {para.replace(/\n/g, " ").trim()}
          </Text>
        ))}

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Recommended Claims */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionHeader}>VIII. Recommended Claims</Text>

        {recommendedClaims.map((claim, i) => (
          <View key={i} style={s.claimCard} wrap={false}>
            <Text style={s.claimTitle}>
              {i + 1}. {claim.cause}
            </Text>
            <Text style={s.claimBasis}>{claim.basis}</Text>
            <Text
              style={[
                s.claimStrength,
                { backgroundColor: strengthColor(claim.strength) },
              ]}
            >
              {claim.strength.toUpperCase()} CASE
            </Text>
          </View>
        ))}

        <View style={s.hr} />

        <Text style={[s.bodyText, { fontFamily: "Helvetica-Oblique", fontSize: 8, color: "#6b7280", marginTop: 20 }]}>
          This litigation package has been prepared based on the consumer
          dispute records maintained in CreditClean AI. All dates, correspondence,
          and violation analyses are derived from system records. An attorney
          should independently verify all claims and evidence before filing any
          legal action.
        </Text>

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
