import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { LetterPDF, type LetterPDFProps } from "./letter-pdf";
import {
  ForensicReportPDF,
  type ForensicReport,
} from "./forensic-report-pdf";
import {
  AttorneyPackagePDF,
  type AttorneyPackagePDFData,
} from "./attorney-package-pdf";

/**
 * Generate a dispute letter PDF as a Buffer.
 * Ready to be served as a download response or stored in Supabase Storage.
 */
export async function generateLetterPDF(
  props: LetterPDFProps
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(LetterPDF, props) as any;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}

/**
 * Generate a forensic credit report analysis PDF as a Buffer.
 */
export async function generateForensicReportPDF(
  report: ForensicReport
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(ForensicReportPDF, { report }) as any;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}

/**
 * Generate an attorney litigation package PDF as a Buffer.
 */
export async function generateAttorneyPackagePDF(
  pkg: AttorneyPackagePDFData
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(AttorneyPackagePDF, { pkg }) as any;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}
