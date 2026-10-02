# PDF & Print Reference

PDF generation is where AI confidently hands you a screen design with
`linear-gradient(purple, blue)` and calls it print-ready. It is not.
Print has different physics, different color models, different failure modes.

---

## Tool Selection

| Tool | Language | Best For | Quality | Speed |
|------|----------|----------|---------|-------|
| **Typst v0.14.2** | Typst markup | Reports, papers, resumes | Excellent | 27x faster than XeLaTeX |
| **React-PDF** (`@react-pdf/renderer` v4.3.x) | React/JSX | Invoices/reports from React apps | Good | Fast |
| **WeasyPrint** | HTML/CSS | HTML-first PDF generation | Good | Medium |
| **Prince XML** | HTML/CSS | Highest quality commercial | Excellent | Fast |
| **LaTeX** | TeX | Academic, math-heavy | Excellent | Slow |

**Decision**: Typst for new documents. React-PDF for React integrations.
WeasyPrint (free) or Prince (commercial) for existing HTML templates.
LaTeX only if you have 200 equations and no choice.

احا — if someone suggests Puppeteer `page.pdf()`: that's a screenshot with a
`.pdf` extension. No selectable text, no accessibility, no bookmarks. Don't.

---

## Typst Deep Dive

Typst is what LaTeX would be if designed in 2024. Compiled, instant preview,
sane syntax, 1100+ packages. Three modes: **markup** (text), **code** (`#`
prefix), **math** (`$`). Everything is a function. `#set` changes defaults,
`#show` transforms rendering, `#let` defines variables.

### Professional Report Template

Complete template — custom fonts, domain colors for print, header/footer with
page numbers, TOC, styled headings, alternating-row tables:

```typst
#let brand-primary = rgb("#1a365d")   // Deep navy — prints clean
#let brand-accent  = rgb("#2b6cb0")   // Mid blue — good contrast
#let brand-muted   = rgb("#a0aec0")   // Warm gray — borders, captions
#let brand-bg-alt  = rgb("#f7fafc")   // Off-white — alternating rows

#let doc-title = "Q4 2025 Performance Report"
#let doc-author = "Operations Division"

#set page(
  paper: "a4",
  margin: (top: 30mm, bottom: 25mm, left: 22mm, right: 22mm),
  header: context {
    if counter(page).get().first() > 1 [
      #set text(size: 8pt, fill: brand-muted)
      #doc-title #h(1fr) #doc-author
      #line(length: 100%, stroke: 0.3pt + brand-muted)
    ]
  },
  footer: context {
    set text(size: 8pt, fill: brand-muted)
    h(1fr); counter(page).display("1 / 1", both: true); h(1fr)
  },
)
#set text(font: "Source Serif 4", size: 10.5pt, fill: rgb("#1a202c"))
#set par(leading: 0.65em, justify: true)
#set document(title: doc-title, author: doc-author)

#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  v(2em)
  text(size: 20pt, weight: "bold", fill: brand-primary)[#it.body]
  v(0.4em)
  line(length: 40%, stroke: 1.5pt + brand-accent)
  v(1em)
}
#show heading.where(level: 2): it => {
  v(1.2em)
  text(size: 14pt, weight: "bold", fill: brand-primary)[#it.body]
  v(0.5em)
}

// Title page
#align(center + horizon)[
  #text(size: 32pt, weight: "bold", fill: brand-primary)[#doc-title]
  #v(1em)
  #line(length: 30%, stroke: 2pt + brand-accent)
  #v(1.5em)
  #text(size: 14pt, fill: brand-muted)[#doc-author]
]

// TOC
#pagebreak()
#outline(title: text(size: 18pt, weight: "bold", fill: brand-primary)[Contents], indent: 1.5em)

// Alternating-row table helper
#let data-table(headers, rows) = {
  table(
    columns: headers.len(),
    stroke: 0.5pt + brand-muted,
    fill: (_, row) => if row == 0 { brand-primary }
      else if calc.odd(row) { brand-bg-alt } else { white },
    ..headers.map(h => text(weight: "bold", fill: white, size: 9pt)[#h]),
    ..rows.flatten().map(cell => text(size: 9.5pt)[#cell]),
  )
}

= Key Metrics
#data-table(
  ("Metric", "Q3", "Q4", "Change"),
  (("Revenue", "$4.2M", "$5.1M", "+21%"),
   ("Users", "12.4K", "15.8K", "+27%"),
   ("Churn", "3.8%", "2.9%", "-24%")),
)
```

PDF/A: `#set document(title: ..., author: ..., keywords: (...))` gives you
metadata. Tagged PDF support is maturing — sufficient for business docs,
check the tracker for full PDF/UA compliance.

---

## React-PDF Patterns

`@react-pdf/renderer` = React Native for PDFs. Flexbox only, no CSS Grid,
no `display: block`. Register fonts once at module level:

```jsx
import { Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Source Serif',
  fonts: [
    { src: '/fonts/SourceSerif4-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/SourceSerif4-Bold.ttf', fontWeight: 'bold' },
  ],
});
```

### Invoice Template

```jsx
const brand = { primary: '#1a365d', accent: '#2b6cb0', muted: '#718096', bg: '#f7fafc' };

const s = StyleSheet.create({
  page: { padding: '20mm', fontFamily: 'Source Serif', fontSize: 10, lineHeight: 1.4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30,
    paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: brand.muted },
  companyName: { fontSize: 22, fontWeight: 'bold', color: brand.primary },
  invoiceLabel: { fontSize: 20, fontWeight: 'bold', color: brand.accent },
  meta: { fontSize: 9, color: brand.muted, marginTop: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: brand.primary, padding: 8 },
  thText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 8, borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  rowAlt: { backgroundColor: brand.bg },
  colDesc: { flex: 3 }, colQty: { flex: 1, textAlign: 'center' },
  colRate: { flex: 1, textAlign: 'right' }, colTotal: { flex: 1, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15,
    paddingTop: 10, borderTopWidth: 1.5, borderTopColor: brand.primary },
  footer: { position: 'absolute', bottom: '15mm', left: '20mm', right: '20mm',
    textAlign: 'center', fontSize: 8, color: brand.muted },
});

const Invoice = ({ data }) => (
  <Document>
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <View>
          <Text style={s.companyName}>{data.company}</Text>
          <Text style={s.meta}>{data.address}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.invoiceLabel}>INVOICE</Text>
          <Text style={s.meta}>#{data.number} | Due: {data.dueDate}</Text>
        </View>
      </View>

      <View style={s.tableHeader}>
        {['Description','Qty','Rate','Total'].map((h,i) => (
          <Text key={i} style={[s.thText, [s.colDesc,s.colQty,s.colRate,s.colTotal][i]]}>{h}</Text>
        ))}
      </View>
      {data.items.map((item, i) => (
        <View key={i} style={[s.row, i % 2 === 1 && s.rowAlt]}>
          <Text style={s.colDesc}>{item.desc}</Text>
          <Text style={s.colQty}>{item.qty}</Text>
          <Text style={s.colRate}>${item.rate.toFixed(2)}</Text>
          <Text style={s.colTotal}>${(item.qty * item.rate).toFixed(2)}</Text>
        </View>
      ))}
      <View style={s.totalRow}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: brand.primary }}>
          Total: ${data.items.reduce((s, i) => s + i.qty * i.rate, 0).toFixed(2)}
        </Text>
      </View>

      <Text style={s.footer} fixed>
        {data.company} | Page <Text render={({ pageNumber, totalPages }) =>
          `${pageNumber}/${totalPages}`} />
      </Text>
    </Page>
  </Document>
);
```

**Gotchas**: no `em`/`rem` (use `pt`). `break` prop forces page break.
`minPresenceAhead` controls widows/orphans. `fixed` prop repeats on every page.

---

## Print Design Principles

يسطا, print is not "the web but on paper." Different medium, different rules.

**Color** — CMYK for professional print (offset/high-end digital). RGB/sRGB
for digital PDFs. Rich black: CMYK (60,40,40,100) not (0,0,0,100). Avoid
saturated screen colors outside the CMYK gamut. Use less color than screen —
ink costs money. Color on cover/openers, white pages elsewhere. Ensure charts
work in grayscale (B&W printers, photocopies).

**Typography** — Serif body (Source Serif 4, Crimson Pro, Literata), 10-12pt
(11pt sweet spot). Line height 1.3-1.5 (tighter than screen's 1.5-1.75).
Sans headings for contrast. Enable hyphenation for justified text.

**Layout** — Margins minimum 20mm (25mm better). 3mm bleed for commercial
print. 300 DPI for pro print, 150 office/digital, 72 screen-only. Keep
content 5mm inside trim line.

**Navigation** — Page numbers every page (except cover). Running headers at
8-9pt muted. TOC at 5+ pages. PDF bookmarks for all heading levels.

**Widows/Orphans** — `orphans: 2; widows: 2;` in CSS (WeasyPrint/Prince).
`minPresenceAhead` in React-PDF. Headings: `break-after: avoid`.

---

## Anti-Patterns

هانت — what AI gets wrong every time.

**1. Screen design sent to print.** Tailwind spacing, `rgba()` transparencies,
`#6366F1` purple — none translates. Use physical units (pt/mm), print-safe
colors. Transparencies cause rendering issues in PDF viewers and RIPs.

**2. Sans-serif body for long-form.** Inter at 10pt on A4 for 30 pages is
harder to read than serif. Fix: serif body, sans headings.

**3. Full-bleed color on every page.** Triples print cost. Fix: color on
cover/openers only, use rules/lines for structure elsewhere.

**4. Missing page numbers.** AI never includes them. Non-negotiable: page
numbers on every page except the cover.

**5. No TOC for long documents.** Over 5 pages = TOC. Over 15 = two-level
TOC. AI generates 40 pages with no TOC and no PDF bookmarks.

**6. Ignoring PDF/A accessibility.** No tagged structure, no alt text, no
language metadata. Fix: set metadata, semantic headings, test with PAC 2024.

---

*Last updated: 2026-03-01 | Typst v0.14.2, @react-pdf/renderer v4.3.x*
