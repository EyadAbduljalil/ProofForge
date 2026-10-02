// Typst report template with structured theming.
// Compile: typst compile report.typ

// ── Page Setup ──────────────────────────────────────────

#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  header: context {
    if counter(page).get().first() > 1 [
      #set text(8pt, fill: theme-muted)
      #h(1fr) Project Report
    ]
  },
  footer: context [
    #set text(8pt, fill: theme-muted)
    #h(1fr) #counter(page).display("1 / 1", both: true)
  ],
)

// ── Theme ───────────────────────────────────────────────

/* THEME: replace font with domain typeface */
#set text(font: "IBM Plex Sans", size: 11pt)

/* THEME: replace colors with domain palette */
#let theme-primary = rgb("#0891b2")   // cyan-600
#let theme-accent = rgb("#7c3aed")    // violet-600
#let theme-success = rgb("#16a34a")   // green-600
#let theme-muted = rgb("#6b7280")     // gray-500
#let theme-bg = rgb("#f8fafc")        // slate-50
#let theme-border = rgb("#e2e8f0")    // slate-200
#let theme-row-alt = rgb("#f1f5f9")   // slate-100

// ── Heading Styles ──────────────────────────────────────

/* THEME: replace heading colors and decoration */
#show heading.where(level: 1): it => {
  set text(18pt, weight: "bold", fill: theme-primary)
  block(above: 1.8em, below: 0.8em)[
    #it.body
    #v(4pt)
    #line(length: 100%, stroke: 1pt + theme-primary)
  ]
}

#show heading.where(level: 2): it => {
  set text(14pt, weight: "semibold", fill: theme-accent)
  block(above: 1.4em, below: 0.6em, it.body)
}

#show heading.where(level: 3): it => {
  set text(12pt, weight: "medium", fill: theme-muted)
  block(above: 1.2em, below: 0.4em, it.body)
}

// ── Code Block Styling ──────────────────────────────────

/* THEME: replace code block background */
#show raw.where(block: true): it => {
  block(
    fill: theme-bg,
    stroke: 0.5pt + theme-border,
    radius: 4pt,
    inset: 10pt,
    width: 100%,
    it,
  )
}

#show raw.where(block: false): it => {
  box(fill: theme-bg, outset: (x: 2pt, y: 2pt), radius: 2pt, it)
}

// ── Title Page ──────────────────────────────────────────

/* THEME: replace project name, author, subtitle */
#align(center + horizon)[
  #block(above: 0pt)[
    #text(28pt, weight: "bold", fill: theme-primary)[Project Report]
    #v(8pt)
    #text(14pt, fill: theme-muted)[Quarterly Engineering Review]
    #v(24pt)
    #line(length: 40%, stroke: 1.5pt + theme-accent)
    #v(24pt)
    #text(12pt)[Prepared by *Engineering Team*]
    #v(8pt)
    #text(11pt, fill: theme-muted)[#datetime.today().display("[month repr:long] [day], [year]")]
  ]
]

#pagebreak()

// ── Table of Contents ───────────────────────────────────

#outline(indent: 1.5em, depth: 3)

#pagebreak()

// ── Content ─────────────────────────────────────────────

= Executive Summary

This report covers the engineering progress for the current quarter.
Key metrics show improvement across reliability, performance, and delivery velocity.

== Highlights

- System uptime reached 99.97% across all regions.
- Median API latency decreased from 142ms to 89ms.
- 47 pull requests merged with zero rollbacks.

= Performance Metrics

== Latency Overview

/* THEME: replace table header color */
#figure(
  table(
    columns: (auto, 1fr, 1fr, 1fr),
    stroke: 0.5pt + theme-border,
    fill: (_, row) => if row == 0 { theme-primary.lighten(85%) } else if calc.odd(row) { theme-row-alt } else { white },
    table.header(
      [*Endpoint*], [*P50 (ms)*], [*P95 (ms)*], [*P99 (ms)*],
    ),
    [`/api/users`], [32], [89], [142],
    [`/api/orders`], [45], [120], [198],
    [`/api/search`], [78], [210], [340],
    [`/api/feed`], [12], [34], [56],
  ),
  caption: [API latency by endpoint],
)

== Infrastructure

=== Compute Utilization

Average CPU utilization remained below 60% with auto-scaling enabled.
Memory pressure events dropped to zero after the buffer pool optimization in week 6.

= Architecture

== System Diagram

/* THEME: replace with actual diagram or image path */
#figure(
  rect(
    width: 80%,
    height: 6cm,
    fill: theme-bg,
    stroke: 0.5pt + theme-border,
    radius: 4pt,
  )[
    #align(center + horizon)[
      #text(fill: theme-muted)[_Architecture diagram placeholder_]
    ]
  ],
  caption: [High-level system architecture],
)

= Implementation Details

Example configuration:

```yaml
services:
  api:
    replicas: 3
    memory: 512Mi
    cpu: "0.5"
    healthCheck:
      path: /healthz
      interval: 10s
```

= Conclusion

The team delivered all planned milestones. Next quarter priorities
include the data pipeline migration and observability improvements.
