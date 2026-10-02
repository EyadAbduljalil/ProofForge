/**
 * React-PDF invoice template.
 * Render with: ReactPDF.render(<Invoice {...data} />, `invoice.pdf`);
 */

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

/* THEME: replace font URLs with domain typeface */
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
});

/* THEME: replace colors with domain palette */
const colors = {
  primary: "#0891b2",
  accent: "#7c3aed",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  bgLight: "#f8fafc",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: colors.text,
    padding: 40,
    backgroundColor: colors.white,
  },
  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoArea: {
    width: 120,
    height: 40,
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: { fontSize: 8, color: colors.muted },
  companyInfo: { textAlign: "right" },
  companyName: { fontSize: 14, fontWeight: 700, color: colors.primary },
  /* Addresses row */
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  addressBlock: { width: "45%" },
  addressLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  /* Invoice meta */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  invoiceTitle: { fontSize: 22, fontWeight: 700, color: colors.primary },
  metaDetail: { fontSize: 9, color: colors.muted, marginTop: 2 },
  /* Table */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 8,
    fontWeight: 600,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tableRowAlt: { backgroundColor: colors.bgLight },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  headerText: { color: colors.white },
  /* Totals */
  totalsWrap: { alignItems: "flex-end", marginTop: 15 },
  totalsRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: { color: colors.muted },
  totalFinal: { fontWeight: 700, fontSize: 13, color: colors.primary },
  /* Notes / Terms */
  section: { marginTop: 25, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: colors.border },
  sectionTitle: { fontSize: 9, fontWeight: 600, color: colors.muted, marginBottom: 4 },
  /* Footer */
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: colors.muted,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
});

/* ── Types ──────────────────────────────────────── */

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: { name: string; address: string };
  to: { name: string; address: string };
  items: LineItem[];
  notes?: string;
  terms?: string;
  taxRate?: number;
}

/* ── Component ──────────────────────────────────── */

export function Invoice(props: InvoiceProps) {
  const { invoiceNumber, date, dueDate, from, to, items, notes, terms, taxRate = 0 } = props;

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoArea}>
            <Text style={s.logoPlaceholder}>LOGO</Text>
          </View>
          <View style={s.companyInfo}>
            <Text style={s.companyName}>{from.name}</Text>
            <Text style={s.metaDetail}>{from.address}</Text>
          </View>
        </View>

        {/* Invoice meta */}
        <View style={s.metaRow}>
          <Text style={s.invoiceTitle}>Invoice</Text>
          <View>
            <Text style={s.metaDetail}>No. {invoiceNumber}</Text>
            <Text style={s.metaDetail}>Date: {date}</Text>
            <Text style={s.metaDetail}>Due: {dueDate}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={s.addressRow}>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>Bill To</Text>
            <Text>{to.name}</Text>
            <Text style={s.metaDetail}>{to.address}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={s.tableHeader}>
          <Text style={[s.colDesc, s.headerText]}>Description</Text>
          <Text style={[s.colQty, s.headerText]}>Qty</Text>
          <Text style={[s.colRate, s.headerText]}>Rate</Text>
          <Text style={[s.colAmount, s.headerText]}>Amount</Text>
        </View>
        {items.map((item, i) => (
          <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
            <Text style={s.colDesc}>{item.description}</Text>
            <Text style={s.colQty}>{item.quantity}</Text>
            <Text style={s.colRate}>{fmt(item.rate)}</Text>
            <Text style={s.colAmount}>{fmt(item.quantity * item.rate)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsWrap}>
          <View style={s.totalsRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text>{fmt(subtotal)}</Text>
          </View>
          {taxRate > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalLabel}>Tax ({(taxRate * 100).toFixed(0)}%)</Text>
              <Text>{fmt(tax)}</Text>
            </View>
          )}
          <View style={[s.totalsRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, marginTop: 4 }]}>
            <Text style={s.totalFinal}>Total</Text>
            <Text style={s.totalFinal}>{fmt(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Notes</Text>
            <Text>{notes}</Text>
          </View>
        )}

        {/* Terms */}
        {terms && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Terms & Conditions</Text>
            <Text>{terms}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={s.footer}>
          Thank you for your business. Payment is due by {dueDate}.
        </Text>
      </Page>
    </Document>
  );
}
