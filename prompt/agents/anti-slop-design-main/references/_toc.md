# References — Table of Contents

> The field manual index. Every reference doc, what it covers, when to reach for it.
> If you're Claude and you're reading this: start here, then go deep.

---

## Core System

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`anti-patterns.md`](anti-patterns.md) | The AI Slop Bible — convergence patterns, detection heuristics, counter-techniques | Every single time. Read first, design second |
| [`color-systems.md`](color-systems.md) | OKLCH primer, 3-tier token architecture, palette generation, dark mode | Picking colors, building palettes, theming |
| [`typography.md`](typography.md) | Font selection per domain, fluid scales, vertical rhythm, pairing rules | Any text styling, font choices, type scale work |

## Web Platform

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`web-react.md`](web-react.md) | React/Next.js stack, component libraries, code patterns, View Transitions | React apps, SaaS dashboards, Next.js projects |
| [`web-landing.md`](web-landing.md) | Section anatomy, hero patterns, social proof, CTA strategy | Marketing pages, landing pages, product sites |
| [`web-artifacts.md`](web-artifacts.md) | Claude.ai artifact constraints, single-file patterns, domain adaptation | Artifact mode specifically — different rules apply |

## Data & Motion

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`dataviz.md`](dataviz.md) | Chart library matrix, anti-default styling, scrollytelling, color-blind palettes | Any data visualization, charts, graphs |
| [`animation-motion.md`](animation-motion.md) | Motion libraries, timing tokens, 6 animation patterns, performance rules | Animations, transitions, micro-interactions |
| [`layout-spacing.md`](layout-spacing.md) | Grid patterns, fluid spacing, density levels, container queries | Page layout, spacing, responsive patterns |

## Native Platforms

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`mobile-native.md`](mobile-native.md) | SwiftUI/Compose token systems, Dynamic Type, platform behavior tables | Native mobile apps (Swift/Kotlin) |
| [`mobile-crossplatform.md`](mobile-crossplatform.md) | React Native/Flutter token bridging, Compose Multiplatform, platform-aware components | Cross-platform mobile (RN, Flutter, KMP) |
| [`desktop.md`](desktop.md) | Electron/Tauri patterns, custom titlebars, command palettes, system integration | Desktop apps |

## Documents & CLI

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`cli-terminal.md`](cli-terminal.md) | Bubble Tea/Rich/Ink/Clack, ANSI color tiers, Unicode patterns, NO_COLOR | Terminal UIs, CLI tools |
| [`pdf-print.md`](pdf-print.md) | Typst/react-pdf, CMYK considerations, print stylesheets, PDF generation | Print, PDF, physical output |
| [`email.md`](email.md) | Outlook Word engine, dark mode in email, React Email/MJML, table layouts | HTML emails, newsletters |

## Accessibility & Validation

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [`accessibility.md`](accessibility.md) | WCAG 2.2, ARIA patterns, screen readers, reduced motion, keyboard nav | Every project — accessibility is not optional |

---

## Reading Order

**New to the system?** Go: `anti-patterns.md` → `color-systems.md` → `typography.md` → platform-specific ref

**Building a React app?** Go: `web-react.md` → check domain in `../domain-map.json` → grab template from `../templates/web/`

**Making an artifact?** Go: `web-artifacts.md` → `../templates/web/artifact-react.jsx` → adapt

**Quick domain lookup?** Skip all this, go straight to `../domain-map.json`

---

**Native mobile?** Go: `mobile-native.md` → check domain in `../domain-map.json` → grab template from `../templates/mobile/`

**CLI/TUI tool?** Go: `cli-terminal.md` → grab template from `../templates/cli/`

**Email template?** Go: `email.md` → `../templates/documents/react-email.tsx` → adapt
