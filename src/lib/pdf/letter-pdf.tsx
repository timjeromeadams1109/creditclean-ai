import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface LetterPDFProps {
  senderName: string;
  senderAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  recipientName: string;
  recipientAddress: string;
  date: string;
  reLine: string;
  body: string;
  legalBasis: string[];
  enclosures?: string[];
  trackingNumber?: string;
  ssnLast4?: string;
  dob?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 72, // 1 inch
    paddingBottom: 72,
    paddingLeft: 72,
    paddingRight: 72,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.15,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 24,
  },
  senderName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  senderAddress: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.4,
  },
  dateBlock: {
    textAlign: "right",
    marginBottom: 24,
    fontSize: 11,
  },
  recipientBlock: {
    marginBottom: 20,
    lineHeight: 1.4,
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  reLine: {
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  identificationBlock: {
    marginBottom: 16,
    fontSize: 10,
    color: "#444444",
  },
  bodyParagraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  legalSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  legalHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#555555",
  },
  legalCitation: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 12,
    color: "#333333",
  },
  signatureBlock: {
    marginTop: 32,
  },
  sincerely: {
    marginBottom: 36,
  },
  signatureName: {
    fontFamily: "Helvetica-Bold",
  },
  enclosuresBlock: {
    marginTop: 24,
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 10,
  },
  enclosuresHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 4,
  },
  enclosureItem: {
    fontSize: 10,
    paddingLeft: 12,
    marginBottom: 2,
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 72,
    right: 72,
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCertified: {
    fontSize: 8,
    fontFamily: "Helvetica-Oblique",
    color: "#666666",
  },
  footerTracking: {
    fontSize: 8,
    color: "#666666",
  },
  pageNumber: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
  },
});

function splitBodyIntoParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

export function LetterPDF(props: LetterPDFProps) {
  const {
    senderName,
    senderAddress,
    recipientName,
    recipientAddress,
    date,
    reLine,
    body,
    legalBasis,
    enclosures,
    trackingNumber,
    ssnLast4,
    dob,
  } = props;

  const paragraphs = splitBodyIntoParagraphs(body);
  const recipientLines = recipientAddress
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Sender Header */}
        <View style={styles.header}>
          <Text style={styles.senderName}>{senderName}</Text>
          <View style={styles.senderAddress}>
            <Text>{senderAddress.street}</Text>
            <Text>
              {senderAddress.city}, {senderAddress.state} {senderAddress.zip}
            </Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.dateBlock}>
          <Text>{date}</Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipientBlock}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          {recipientLines.map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </View>

        {/* Re: Line */}
        <Text style={styles.reLine}>{reLine}</Text>

        {/* Identification */}
        {(ssnLast4 || dob) && (
          <View style={styles.identificationBlock}>
            {ssnLast4 && <Text>SSN (last 4): XXX-XX-{ssnLast4}</Text>}
            {dob && <Text>Date of Birth: {dob}</Text>}
          </View>
        )}

        {/* Body */}
        {paragraphs.map((para, i) => (
          <Text key={i} style={styles.bodyParagraph}>
            {para}
          </Text>
        ))}

        {/* Legal Basis */}
        {legalBasis.length > 0 && (
          <View style={styles.legalSection}>
            <Text style={styles.legalHeader}>Legal Basis</Text>
            {legalBasis.map((citation, i) => (
              <Text key={i} style={styles.legalCitation}>
                {"\u2022"} {citation}
              </Text>
            ))}
          </View>
        )}

        {/* Signature Block */}
        <View style={styles.signatureBlock}>
          <Text style={styles.sincerely}>Sincerely,</Text>
          <Text style={styles.signatureName}>{senderName}</Text>
        </View>

        {/* Enclosures */}
        {enclosures && enclosures.length > 0 && (
          <View style={styles.enclosuresBlock}>
            <Text style={styles.enclosuresHeader}>Enclosures:</Text>
            {enclosures.map((enc, i) => (
              <Text key={i} style={styles.enclosureItem}>
                {i + 1}. {enc}
              </Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerCertified}>
            Sent via Certified Mail, Return Receipt Requested
          </Text>
          {trackingNumber && (
            <Text style={styles.footerTracking}>
              Tracking: {trackingNumber}
            </Text>
          )}
        </View>

        {/* Page Numbers */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
