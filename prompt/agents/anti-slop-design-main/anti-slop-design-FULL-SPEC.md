# anti-slop-design Skill Spec — Part 1 of 5
## Architecture, SKILL.md Spec, and Frontmatter

> **Reading order**: Part 1 (this) → Part 2 (Decision Engine) → Part 3 (Reference Files) → Part 4 (Assets & Templates) → Part 5 (Validation & Build Order)
>
> **Companion docs**: `CONTINUATION_GUIDE.md` (session recovery), `spec-outline.md` (approved outline), research report artifact (data source)

---

## 1.1 PURPOSE AND IDENTITY

**Skill name**: `anti-slop-design`
**Replaces**: The existing `frontend-design` skill entirely
**One-line purpose**: Arm an AI coding agent with everything it needs to produce UI/UX designs that are context-aware, production-polished, accessible, and genuinely distinctive — across every output platform — by systematically eliminating the generic "AI slop" aesthetic.

### What this skill is NOT

- NOT a design system itself (it's a *methodology* for choosing and building design systems)
- NOT limited to web/React (covers mobile, desktop, CLI, PDF, email, dataviz)
- NOT a collection of pretty templates (templates are scaffolding; the decision engine and reference docs are the core value)
- NOT a replacement for human designers (it raises the floor so designers refine rather than discard AI output)

### Core philosophy (priority order)

1. **Anti-generic**: Every output must be distinguishable from default AI generations. The agent must actively avoid convergent patterns (Inter font, purple gradients, symmetric hero layouts).
2. **Context-aware aesthetics**: Design choices are driven by domain, audience, and purpose — a fintech dashboard and a children's education app must look fundamentally different.
3. **Production-quality polish**: Spacing, typography, micro-interactions, and detail must meet the bar of a senior frontend developer, not a prototype.
4. **Accessibility baked in**: WCAG 2.2 AA is a hard constraint, not an afterthought. The European Accessibility Act is enforceable law.


---

## 1.2 RUNTIME ENVIRONMENT

**Primary**: Claude Code (full filesystem, multi-file projects, CLI access, subagents)
**Secondary**: Claude.ai artifacts (React/HTML/JSX sandbox, single-file, no filesystem)

### Claude Code behavior

When running in Claude Code, the agent has full access to:
- Create multi-file project structures
- Copy bundled assets (CSS, SVG, tokens) into the user's project
- Run build tools, linters, and validation scripts
- Read multiple reference files as needed
- Generate and modify code across files

### Claude.ai artifact degradation rules

When running in claude.ai (detected by: no filesystem access, single-file output constraint):
- **Inline critical CSS** from `assets/css/` directly into the artifact's `<style>` block
- **Inline SVG patterns** as data URIs or embedded `<svg>` elements
- **Skip**: multi-file templates, build tools, external font loading (use Google Fonts CDN instead)
- **Embed domain tokens** as CSS custom properties directly in the artifact
- **Reference files**: Agent should still read them for methodology, but adapt output to single-file constraint
- **Templates**: Use `templates/web/artifact-react.jsx` as the base (specifically designed for this environment)


---

## 1.3 COMPLETE DIRECTORY TREE

This is the authoritative file manifest. Every file listed here MUST exist in the final skill package. The validation script (Part 5) checks against this list.

```
anti-slop-design/
│
├── SKILL.md                              # [HUB] Decision engine + routing logic
│                                         #   Target: 400-500 lines
│                                         #   Sections: Frontmatter, Design Thinking Protocol,
│                                         #     Decision Engine (NL), Anti-Slop Checklist,
│                                         #     Asset Usage Guide, Platform Routing Table,
│                                         #     Claude.ai Artifact Mode
│
├── domain-map.json                       # [DATA] Structured domain→aesthetic lookup
│                                         #   Target: 300-500 lines
│                                         #   Contains: 8 domain profiles, signal keywords,
│                                         #     extensibility schema
│
├── references/                           # [DOCS] Domain-specific deep guides
│   ├── _toc.md                           #   Table of contents + reading guide
│   ├── web-react.md                      #   React/HTML apps, dashboards, SPAs
│   ├── web-landing.md                    #   Landing pages, marketing sites, portfolios
│   ├── web-artifacts.md                  #   Claude.ai artifact-specific patterns
│   ├── dataviz.md                        #   Charts, dashboards, infographics, scrollytelling
│   ├── mobile-native.md                  #   SwiftUI, Jetpack Compose, Flutter
│   ├── mobile-crossplatform.md           #   React Native, KMP, Flutter cross-platform
│   ├── desktop.md                        #   Electron, Tauri, WinUI, AppKit
│   ├── cli-terminal.md                   #   TUI frameworks, CLI design patterns
│   ├── pdf-print.md                      #   Typst, React-PDF, WeasyPrint, print principles
│   ├── email.md                          #   React Email, MJML, dark mode, Outlook compat
│   ├── animation-motion.md               #   Motion/GSAP/CSS scroll, spring physics, perf
│   ├── typography.md                     #   Font selection, pairing, fluid scales, variable fonts
│   ├── color-systems.md                  #   OKLCH, palette gen, dark mode, accessibility
│   ├── layout-spacing.md                 #   Grid systems, fluid design, density, subgrid
│   ├── accessibility.md                  #   WCAG 2.2, ARIA, EAA, preference queries
│   └── anti-patterns.md                  #   The AI slop bible: detect, avoid, replace
│
├── assets/                               # [STATIC] Files copied/adapted into user projects
│   ├── css/
│   │   ├── modern-reset.css              #   Modern CSS reset (Josh Comeau + Andy Bell style)
│   │   ├── fluid-type-scale.css          #   Utopia clamp() type scale (320→1240px)
│   │   ├── fluid-space-scale.css         #   Utopia clamp() spacing scale
│   │   ├── motion-tokens.css             #   Duration, easing, spring CSS custom properties
│   │   └── color-tokens/
│   │       ├── primitives-light.css      #   OKLCH primitive tokens (light mode)
│   │       ├── primitives-dark.css       #   OKLCH primitive tokens (dark mode)
│   │       └── semantic.css              #   Semantic token mapping layer
│   │
│   ├── svg/
│   │   ├── grain-overlay.svg             #   feTurbulence noise texture
│   │   ├── dot-grid.svg                  #   Dot grid pattern (devtools aesthetic)
│   │   ├── blob-organic.svg              #   Organic blob shape with random border-radius
│   │   ├── noise-subtle.svg              #   Subtle noise for background texture
│   │   └── diagonal-lines.svg            #   Diagonal line pattern (editorial feel)
│   │
│   ├── fonts/
│   │   ├── font-stacks.json              #   Curated stacks per aesthetic category
│   │   └── loading-snippet.html          #   Optimal font loading (preload + display swap)
│   │
│   └── tokens/
│       ├── domain-tokens/
│       │   ├── fintech.json              #   Fintech: navy, geometric sans, minimal motion
│       │   ├── healthcare.json           #   Healthcare: calming blues/greens, large targets
│       │   ├── devtools.json             #   Devtools: dark-first, neon accents, monospace
│       │   ├── ecommerce.json            #   E-commerce/luxury: serif, restrained, cinematic
│       │   ├── education.json            #   Education: vibrant, rounded, gamified
│       │   ├── media.json                #   Media/publishing: editorial serif, multi-column
│       │   ├── government.json           #   Government: functional, accessible-first, plain
│       │   └── creative.json             #   Creative agency: bold, experimental, maximal
│       └── _extensibility.md             #   How to add new domain token sets
│
├── templates/                            # [SCAFFOLD] Structural starters, themed at runtime
│   ├── web/
│   │   ├── dashboard.tsx                 #   React dashboard: sidebar + cards + chart area
│   │   ├── landing-page.html             #   Single-file: hero + features + CTA
│   │   ├── saas-app.tsx                  #   SaaS shell: nav + content + command palette
│   │   └── artifact-react.jsx            #   Claude.ai artifact-optimized React component
│   │
│   ├── mobile/
│   │   ├── swiftui-app.swift             #   SwiftUI with custom design token architecture
│   │   ├── compose-app.kt               #   Jetpack Compose with M3 custom theme
│   │   └── react-native-app.tsx          #   RN with NativeWind + Reanimated setup
│   │
│   ├── desktop/
│   │   ├── electron-app.html             #   Electron renderer with custom titlebar pattern
│   │   └── tauri-app.html                #   Tauri frontend skeleton
│   │
│   ├── cli/
│   │   ├── node-cli.ts                   #   Clack-based interactive Node CLI
│   │   ├── python-tui.py                 #   Textual/Rich Python TUI
│   │   └── go-tui.go                     #   Bubbletea Go TUI
│   │
│   ├── documents/
│   │   ├── typst-report.typ              #   Typst professional report template
│   │   ├── react-pdf-invoice.tsx         #   React-PDF invoice/report template
│   │   └── react-email.tsx               #   React Email transactional template
│   │
│   └── dataviz/
│       ├── recharts-dashboard.tsx        #   Multi-chart Recharts dashboard
│       ├── d3-editorial.html             #   D3 editorial/scrollytelling visualization
│       └── nivo-cards.tsx                #   Nivo chart card components
│
├── scripts/
│   └── validate-skill.sh                #   Runnable sanity check script
│
└── evals/
    └── evals.json                        #   Test prompts for skill quality validation
```

**Total file count**: 55 files across 6 top-level directories.


---

## 1.4 SKILL.md FRONTMATTER SPEC

The frontmatter is the primary triggering mechanism. It must be "pushy" per skill-creator
guidance — erring on the side of triggering too often rather than too rarely.

```yaml
---
name: anti-slop-design
description: >
  Create distinctive, production-grade UI/UX designs across ALL platforms that
  systematically avoid generic AI aesthetics. Use this skill whenever the user asks
  to build, design, style, or beautify ANY user interface — including but not limited
  to: websites, landing pages, web apps, dashboards, React components, HTML/CSS layouts,
  data visualizations, charts, mobile apps (iOS/SwiftUI, Android/Compose, React Native,
  Flutter), desktop apps (Electron, Tauri), CLI/terminal UIs, PDF reports, email
  templates, or any visual output that humans will see. Also trigger when the user
  mentions: making something look good, fixing ugly UI, design systems, theming,
  dark mode, responsive design, accessibility compliance, animation/motion design,
  typography choices, color palettes, or when they express dissatisfaction with
  generic/bland/AI-looking output. This skill replaces basic frontend design
  approaches with a context-aware decision engine that matches aesthetics to domain,
  audience, and purpose. Even if the user doesn't explicitly ask for "design help,"
  trigger this skill if the output will have a visual/UI component that benefits
  from intentional design thinking.
---
```

### Frontmatter validation criteria
- [ ] `name` is exactly `anti-slop-design`
- [ ] `description` mentions all 8+ output types (web, mobile, desktop, CLI, PDF, email, dataviz, dashboard)
- [ ] `description` includes negative-trigger phrases ("making something look good", "fixing ugly UI")
- [ ] `description` mentions the decision engine concept
- [ ] `description` length is 150-250 words (long enough to trigger broadly, short enough for context window)


---

## 1.5 SKILL.MD BODY — SECTION-BY-SECTION SPEC

The SKILL.md body must be 400-500 lines. It is the HUB document — it contains decision
logic and routing, NOT deep implementation details (those live in `references/*.md`).

### Section A: Opening Paragraph (5-10 lines)

One paragraph stating the skill's purpose and the agent's mindset. Must include:
- "Before writing any UI code, run the Design Thinking Protocol below"
- "Every design decision must be intentional and context-driven"
- "Read the relevant reference file(s) for your platform before generating code"
- A reminder that this skill covers ALL visual output, not just web

```markdown
# anti-slop-design

This skill guides creation of distinctive, production-grade interfaces across all
platforms. Before writing ANY code that produces visual output — web, mobile, desktop,
CLI, PDF, email, or data visualization — run the Design Thinking Protocol below to
select the right aesthetic direction. Then read the relevant reference file(s) for
deep implementation guidance. Every design choice must be intentional, context-driven,
and systematically different from generic AI output.
```

### Section B: Design Thinking Protocol (40-60 lines)

A numbered 5-step sequence the agent MUST execute before writing code. This is the
intellectual core of the skill.

**Step 1 — Classify the domain** (10 lines)
- Extract domain signals from the user's request
- Look up in `domain-map.json` under `signal_keywords`
- If match found → load that domain's `aesthetic_label`
- If ambiguous → ask the user: "This could be [X] or [Y] — which aesthetic direction fits better?"
- If no match → default to a neutral modern aesthetic, but still avoid AI slop patterns
- Include the literal instruction: `Read domain-map.json and find the matching domain entry`

**Step 2 — Identify the audience** (8 lines)
- Age range signals → affects playfulness, density, font size
- Technical sophistication → affects information density, terminology in UI
- Accessibility requirements → sets minimum contrast, target sizes, ARIA depth
- Cultural context → affects color associations, reading direction, formality
- If not specified, default to: "professional adult, moderate technical literacy, WCAG 2.2 AA"

**Step 3 — Select the aesthetic direction** (10 lines)
- Use the domain profile from Step 1 as the STARTING POINT, not gospel
- Adjust based on: audience (Step 2), user's explicit preferences, brand keywords
- Commit to ONE clear direction — "refined minimal," "editorial bold," "playful gamified," etc.
- Name the direction explicitly in a comment: `/* Aesthetic: editorial-bold */`
- Load the corresponding domain token file from `assets/tokens/domain-tokens/`

**Step 4 — Choose the platform and routing** (15 lines)
- Identify the output platform from the user's request
- Route to the correct reference file(s) using this table:

| User signals | Primary reference | Also read |
|---|---|---|
| React, component, web app, SPA, Next.js | `web-react.md` | `animation-motion.md` |
| Landing page, marketing, portfolio, homepage | `web-landing.md` | `animation-motion.md` |
| Claude artifact, artifact, jsx sandbox | `web-artifacts.md` | — |
| Chart, graph, data viz, dashboard analytics | `dataviz.md` | `color-systems.md` |
| iOS, SwiftUI, iPhone, iPad | `mobile-native.md` | — |
| Android, Compose, Kotlin, Material | `mobile-native.md` | — |
| React Native, Expo, cross-platform mobile | `mobile-crossplatform.md` | — |
| Flutter, Dart | `mobile-crossplatform.md` | — |
| Electron, desktop app, Tauri | `desktop.md` | — |
| CLI, terminal, TUI, command line | `cli-terminal.md` | — |
| PDF, report, document, print | `pdf-print.md` | `typography.md` |
| Email, newsletter, transactional email | `email.md` | — |
| Animation, motion, transitions, scroll effects | `animation-motion.md` | — |

- The agent must literally read the file: `Read references/{filename}` before proceeding
- Multiple reference files can be loaded if the task spans domains

**Step 5 — Load assets and begin** (10 lines)
- Copy the appropriate CSS reset, type scale, and color tokens into the project
- Apply the domain token overlay
- Select and use the appropriate template as scaffolding (or build from scratch if no template fits)
- Remind: "Before finalizing, run the Anti-Slop Checklist (Section C)"


### Section C: Anti-Slop Checklist (50-70 lines)

This is the quality gate. The agent MUST check every output against these rules before
delivering to the user. Write this section as a numbered checklist with detection
heuristics (how to spot the violation) and fixes (what to do instead).

**The 15 Cardinal Rules** (each needs 3-4 lines: rule + detection + fix):

```
RULE 1 — NEVER USE DEFAULT FONTS
Detection: Output contains font-family with Inter, Roboto, Open Sans, Lato, Arial,
  Helvetica, or system-ui as the PRIMARY font.
Fix: Choose a distinctive font from `assets/fonts/font-stacks.json` that matches the
  domain aesthetic. Inter may appear as a FALLBACK only, never primary.

RULE 2 — NO PURPLE-TO-BLUE GRADIENTS
Detection: CSS contains `linear-gradient` with hues in the 240-290° range (purple-blue).
Fix: Use gradients from the domain token palette, or single-color backgrounds with
  texture (grain, noise, dot-grid from assets/svg/).

RULE 3 — BREAK THE SYMMETRIC HERO LAYOUT
Detection: Page structure follows centered-hero → 3-column-grid → testimonials → CTA.
Fix: Use asymmetric grids, editorial layouts, bento grids, or full-bleed sections.
  Reference `web-landing.md` for 6+ alternative layout patterns.

RULE 4 — NO PURE WHITE BACKGROUNDS
Detection: `background: #fff`, `background: #ffffff`, `background: white`, `bg-white`.
Fix: Use warm off-whites (oklch(0.985 0.002 90) ≈ #FAFAF5) or tinted backgrounds.
  Load from `assets/css/color-tokens/primitives-light.css`.

RULE 5 — NO PURE BLACK TEXT ON WHITE
Detection: `color: #000` or `color: black` on `background: #fff`.
Fix: Use dark gray (oklch(0.25 0.005 270) ≈ #1A1A2E) for body text.
  Semantic token --color-text-primary handles this.

RULE 6 — TYPOGRAPHY MUST HAVE DRAMATIC HIERARCHY
Detection: Heading-to-body size ratio is less than 2×. Weight difference is only
  400 vs 600 (too subtle).
Fix: Use ≥3× size ratio for hero headings. Use extreme weight contrasts (300 vs 800+).
  Apply negative letter-spacing on large headings (-0.02em).

RULE 7 — EVERY INTERACTIVE ELEMENT NEEDS A VISIBLE STATE CHANGE
Detection: Buttons, links, cards lack :hover, :focus-visible, or :active styles.
Fix: Add transitions (150-250ms) with transform, background-color, or box-shadow changes.
  Focus-visible must use a visible ring (not just outline: none).

RULE 8 — NO STOCK-ICON-IN-A-CIRCLE FEATURE GRIDS
Detection: Three or more cards in a row, each with a centered icon + heading + paragraph.
Fix: Use asymmetric card sizes (bento), illustration-driven layouts, or
  content-first designs where the feature IS the visual.

RULE 9 — COLOR PALETTE MUST BE INTENTIONAL AND COHESIVE
Detection: More than 3 accent colors with no clear hierarchy. Colors don't share
  an OKLCH hue family. Random hex codes scattered through markup.
Fix: Use the 3-tier token system: primitives → semantic → component.
  Load from domain token file. One dominant color, one accent, neutrals.

RULE 10 — MOTION MUST BE PURPOSEFUL, NOT DECORATIVE
Detection: Bouncy animations (spring with high bounce) on enterprise/professional UIs.
  Gratuitous parallax. Animations >500ms on routine interactions.
Fix: Match motion intensity to domain profile. Use easing from motion-tokens.css.
  Respect prefers-reduced-motion.

RULE 11 — DARK MODE MUST NOT BE INVERTED LIGHT MODE
Detection: Pure #000000 backgrounds. Same saturation levels as light mode. Shadows
  instead of glows. White text at full opacity.
Fix: Use elevated surface grays (#0A0A0A → #1A1A1A → #2A2A2A). Reduce color
  saturation. Replace shadows with subtle colored glows.

RULE 12 — ACCESSIBILITY IS A HARD CONSTRAINT
Detection: Contrast ratio below 4.5:1 for text. Interactive targets below 24×24px.
  Missing aria-label on icon-only buttons. No skip-nav link.
Fix: Test with OKLCH contrast checker. Use semantic HTML. Add ARIA where needed.
  Reference `accessibility.md` for patterns.

RULE 13 — RESPONSIVE DESIGN IS NOT OPTIONAL
Detection: Fixed pixel widths. No @media or @container queries. Horizontal scroll
  on mobile viewport.
Fix: Use fluid design (clamp() values from fluid-type-scale.css and
  fluid-space-scale.css). Container queries for component-level responsiveness.

RULE 14 — ADD ATMOSPHERE AND DEPTH
Detection: Flat solid-color backgrounds with no texture, gradient, or visual interest.
  All elements feel like they're on the same plane.
Fix: Layer backgrounds (gradient + SVG pattern + grain texture from assets/svg/).
  Use colored shadows. Add subtle border treatments.

RULE 15 — CONTENT AND COPY MUST HAVE PERSONALITY
Detection: Generic placeholder text: "Get started," "Transform your workflow,"
  "Ship faster," "Learn more."
Fix: Write copy that matches the domain voice. Use specific, concrete language.
  If placeholders are needed, make them domain-realistic, not generic SaaS.
```

**Implementation note for SKILL.md**: The rules above should be written in a compact
format — the detection and fix can be on the same line. Target ~3 lines per rule,
~50 lines total for this section.


### Section D: Asset Usage Guide (40-50 lines)

This section tells the agent WHEN and HOW to use each bundled asset. Written as
imperative instructions with conditional logic.

**Spec for this section's content:**

```markdown
## Asset Usage Guide

### CSS Foundation (apply to EVERY web project)

1. Copy `assets/css/modern-reset.css` into the project root styles
2. Copy `assets/css/fluid-type-scale.css` — provides `--step-{-2..5}` CSS variables
3. Copy `assets/css/fluid-space-scale.css` — provides `--space-{3xs..3xl}` CSS variables
4. Copy `assets/css/color-tokens/semantic.css` — provides semantic color variables
5. Copy the appropriate primitives file:
   - Light theme default → `assets/css/color-tokens/primitives-light.css`
   - Dark theme default → `assets/css/color-tokens/primitives-dark.css`
   - Both (user toggle) → copy both, wrap dark in `@media (prefers-color-scheme: dark)` or class toggle
6. Copy `assets/css/motion-tokens.css` — provides `--motion-duration-*` and `--motion-ease-*`

### Domain Tokens (apply based on Step 1 domain classification)

7. Read the matching `assets/tokens/domain-tokens/{domain}.json`
8. Merge domain token values into the CSS custom properties (override primitives)
9. The domain token file specifies: accent colors, border-radius range, shadow style,
   font family recommendations, animation intensity level

### SVG Textures (apply based on aesthetic direction)

10. `grain-overlay.svg` — use as a full-viewport overlay for atmospheric depth.
    Apply via: `background-image: url(grain-overlay.svg); opacity: 0.03-0.08; mix-blend-mode: multiply;`
    Best for: editorial, luxury, creative domains
11. `dot-grid.svg` — use as section background pattern
    Best for: devtools, SaaS, technical domains
12. `noise-subtle.svg` — use as card/surface texture
    Best for: fintech, healthcare (very subtle)
13. `blob-organic.svg` — use as decorative element or section divider
    Best for: education, creative, playful domains
14. `diagonal-lines.svg` — use as accent background
    Best for: media, editorial, print-inspired designs

### Font Loading (apply to every web project using custom fonts)

15. Use the pattern from `assets/fonts/loading-snippet.html`
16. Select font stacks from `assets/fonts/font-stacks.json` based on the aesthetic category
    identified in Step 3 of the Design Thinking Protocol

### Templates (use as scaffolding, not final output)

17. Select the closest template from `templates/` for the target platform
18. Templates contain `/* THEME: ... */` comment markers — these are injection points
    where domain tokens and aesthetic customizations must be applied
19. Templates are STARTING POINTS — the agent must customize:
    - All color values (replace with domain tokens)
    - All font families (replace with aesthetic-appropriate choices)
    - Layout structure (adapt to content, break symmetry)
    - Copy/placeholder text (make domain-realistic)
20. If no template fits, build from scratch using the reference file methodology

### Claude.ai Artifact Mode

21. When no filesystem is available, inline all CSS directly
22. Use Google Fonts CDN links for fonts: `<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">`
23. Embed SVG textures as inline `<svg>` in the JSX, not as external files
24. Reference `references/web-artifacts.md` for single-file optimization techniques
```


### Section E: Platform Routing Table (20-30 lines)

A quick-reference lookup table the agent uses to find everything it needs for a given
output type. This is the "cheat sheet" version of the Design Thinking Protocol's Step 4.

**Spec for this section's content:**

The table must have these columns:
- **Output Type**: What the user is asking for
- **Template**: Path to the starter template
- **Reference File(s)**: Which `references/*.md` to read
- **CSS Assets**: Which `assets/css/` files to load
- **Domain Tokens**: Whether to apply domain token overlay
- **SVG Assets**: Which textures are appropriate

```markdown
## Platform Routing Table

| Output Type | Template | Reference | CSS Assets | Tokens | SVG |
|---|---|---|---|---|---|
| React web app | `web/dashboard.tsx` or `web/saas-app.tsx` | `web-react.md` + `animation-motion.md` | All CSS foundation | Yes | Per aesthetic |
| Landing page | `web/landing-page.html` | `web-landing.md` + `animation-motion.md` | All CSS foundation | Yes | Per aesthetic |
| Claude.ai artifact | `web/artifact-react.jsx` | `web-artifacts.md` | Inline only | Inline | Inline only |
| Data visualization | `dataviz/recharts-dashboard.tsx` | `dataviz.md` + `color-systems.md` | All CSS foundation | Yes | Minimal |
| iOS app | `mobile/swiftui-app.swift` | `mobile-native.md` | N/A (native) | Adapt to Swift | N/A |
| Android app | `mobile/compose-app.kt` | `mobile-native.md` | N/A (native) | Adapt to Kotlin | N/A |
| React Native app | `mobile/react-native-app.tsx` | `mobile-crossplatform.md` | NativeWind tokens | Adapt to RN | N/A |
| Flutter app | N/A (build from reference) | `mobile-crossplatform.md` | N/A (native) | Adapt to Dart | N/A |
| Electron app | `desktop/electron-app.html` | `desktop.md` | All CSS foundation | Yes | Per aesthetic |
| Tauri app | `desktop/tauri-app.html` | `desktop.md` | All CSS foundation | Yes | Per aesthetic |
| CLI / TUI (Node) | `cli/node-cli.ts` | `cli-terminal.md` | N/A (terminal) | Color mapping | N/A |
| CLI / TUI (Python) | `cli/python-tui.py` | `cli-terminal.md` | N/A (terminal) | Color mapping | N/A |
| CLI / TUI (Go) | `cli/go-tui.go` | `cli-terminal.md` | N/A (terminal) | Color mapping | N/A |
| PDF report | `documents/typst-report.typ` | `pdf-print.md` + `typography.md` | N/A (print) | Adapt to Typst | N/A |
| Invoice/PDF (React) | `documents/react-pdf-invoice.tsx` | `pdf-print.md` | N/A (React-PDF) | Adapt to RN style | N/A |
| Email | `documents/react-email.tsx` | `email.md` | Inline only | Adapt to email | N/A |
| Editorial chart | `dataviz/d3-editorial.html` | `dataviz.md` + `animation-motion.md` | All CSS foundation | Yes | grain-overlay |
```


### Section F: Claude.ai Artifact Mode (30-40 lines)

Specific instructions for when the agent is operating in the claude.ai sandbox (React JSX
or HTML artifacts) without filesystem access.

**Spec for this section's content:**

```markdown
## Claude.ai Artifact Mode

When generating artifacts in claude.ai (no filesystem, single-file output):

### What to inline
- Full CSS reset (copy content of modern-reset.css into <style> block)
- Fluid type scale (copy clamp() custom properties into :root)
- Fluid space scale (copy clamp() custom properties into :root)
- Domain color tokens (paste OKLCH values directly as CSS custom properties)
- Motion tokens (paste duration/easing variables into :root)
- SVG textures (embed as inline <svg> elements or CSS background data URIs)

### What to use via CDN
- Google Fonts: always use <link> import, never @import in CSS (blocks rendering)
- Component libraries available in claude.ai: lucide-react, recharts, d3, Three.js,
  Plotly, shadcn/ui, Chart.js, Tone.js
- Tailwind: available as pre-defined utility classes (no compiler, use core classes only)

### What to skip
- External file references (no filesystem)
- Build tools, bundlers, package.json
- Multi-file component structures (everything in one file)
- Font self-hosting (use CDN)
- Separate CSS files (inline everything)

### Artifact-specific optimizations
- Use `artifact-react.jsx` template as the base structure
- shadcn/ui: available via `import { Component } from '@/components/ui/...'`
- State management: React hooks only (useState, useReducer, useEffect, useRef)
- NO localStorage/sessionStorage (use window.storage API if persistence needed)
- CSS: prefer Tailwind utilities for layout, custom <style> block for distinctive
  typography, colors, and animations that Tailwind can't express
- For dark mode: use Tailwind's `dark:` variant classes with a state toggle

### Quality bar in artifact mode
The anti-slop checklist STILL APPLIES in full. Artifacts are not an excuse for
generic output. The single-file constraint makes distinctive design harder, which
means the agent must be even more intentional about font selection, color choices,
and layout composition. The artifact template includes theme injection points
marked with `{/* THEME */}` comments.
```


---

## 1.6 SKILL.MD LINE BUDGET

The SKILL.md must stay within 400-500 lines. Here is the target allocation:

| Section | Lines | Purpose |
|---|---|---|
| Frontmatter (YAML) | 15-20 | Triggering description |
| A: Opening paragraph | 8-12 | Mindset + instructions |
| B: Design Thinking Protocol | 50-65 | 5-step decision sequence |
| C: Anti-Slop Checklist | 50-70 | 15 rules with detection + fix |
| D: Asset Usage Guide | 45-55 | When/how to use every asset type |
| E: Platform Routing Table | 25-35 | Quick-reference routing table |
| F: Claude.ai Artifact Mode | 35-45 | Single-file degradation rules |
| **TOTAL** | **~230-300** | Leaves room for connective text |

The remaining ~100-200 lines of budget can be used for:
- Section headers and whitespace
- Transition paragraphs between sections
- Edge case notes (e.g., "If the user asks for both a web app AND a mobile app...")
- Cross-references to reference files with brief context

### What MUST NOT be in SKILL.md

- Detailed tool comparisons (belongs in reference files)
- Full code examples (belongs in templates)
- Exhaustive color palettes (belongs in token files)
- Font lists (belongs in font-stacks.json)
- WCAG specification details (belongs in accessibility.md)
- Historical context or rationale essays (belongs in research report)

The principle: SKILL.md is a dispatcher. It makes decisions and routes. It does not teach.

---

## 1.7 PROGRESSIVE DISCLOSURE FLOW

When the agent reads this skill, here is the exact sequence of what gets loaded into context:

```
1. ALWAYS IN CONTEXT (via skill metadata):
   └── name + description (~200 words) → triggers skill selection

2. LOADED WHEN SKILL TRIGGERS (agent reads SKILL.md):
   └── SKILL.md (~400-500 lines) → decision engine runs

3. LOADED ON-DEMAND (agent reads specific reference files):
   ├── domain-map.json → parsed for domain aesthetic profile
   ├── references/{platform}.md → deep implementation guide
   ├── references/anti-patterns.md → loaded if output quality is suspect
   ├── references/typography.md → loaded if font decisions needed
   ├── references/color-systems.md → loaded if palette decisions needed
   ├── references/accessibility.md → loaded if accessibility audit needed
   └── references/animation-motion.md → loaded if motion design needed

4. USED BUT NOT LOADED INTO CONTEXT (agent copies into project):
   ├── assets/css/*.css → copied as files
   ├── assets/svg/*.svg → copied as files
   ├── assets/tokens/*.json → parsed and applied
   ├── assets/fonts/*.json → parsed for font stack selection
   └── templates/**/* → copied and customized
```

The agent should NEVER load all reference files at once. Maximum 2-3 reference files
per task. The decision engine in SKILL.md routes to the minimum necessary set.

---

## 1.8 RELATIONSHIP TO EXISTING SKILLS

### Replacing `frontend-design`

The existing `frontend-design` skill is 43 lines with generic guidance. This skill
replaces it completely. After installation:
- Same conceptual purpose (distinctive, non-generic frontend design)
- Vastly expanded scope (all platforms, not just web)
- Structured decision engine instead of vibes-based guidance
- Bundled assets instead of "figure it out"
- Concrete anti-patterns instead of "avoid generic AI aesthetics"

### Coexisting with `web-artifacts-builder`

The `web-artifacts-builder` skill handles the BUILD PIPELINE for complex multi-component
claude.ai artifacts (React + TypeScript + Vite + Parcel + shadcn/ui bundling). This skill
handles DESIGN DECISIONS. They are complementary:

- If the user needs a complex artifact with routing/state → trigger `web-artifacts-builder`
  for the build pipeline, AND `anti-slop-design` for the aesthetic decisions
- If the user needs a simple artifact → `anti-slop-design` alone is sufficient
- The `web-artifacts.md` reference file acknowledges the builder skill and notes when
  to recommend it for complex cases

### Coexisting with `theme-factory`

The `theme-factory` skill applies pre-set themes to existing artifacts. This skill creates
designs from scratch with baked-in theming. They are complementary:

- `theme-factory` is for restyling EXISTING artifacts
- `anti-slop-design` is for creating NEW designs with intentional aesthetics from the start
- If the user has an existing artifact and wants it restyled → `theme-factory`
- If the user is building something new → `anti-slop-design`

---

## 1.9 PART 1 VALIDATION CHECKLIST

Before Part 1 is considered complete, verify:

- [ ] SKILL.md frontmatter is trigger-optimized and mentions all output types
- [ ] SKILL.md body spec covers all 6 sections (A-F) with line counts
- [ ] Design Thinking Protocol has exactly 5 steps with clear decision logic
- [ ] Anti-Slop Checklist has exactly 15 rules with detection heuristics and fixes
- [ ] Asset Usage Guide covers all asset types with conditional instructions
- [ ] Platform Routing Table has entries for ALL output types in the directory tree
- [ ] Claude.ai Artifact Mode has inline/CDN/skip categorization
- [ ] Line budget totals 400-500 lines
- [ ] Progressive disclosure flow is documented
- [ ] Relationship to existing skills (frontend-design, web-artifacts-builder, theme-factory) is specified
- [ ] Complete directory tree matches the outline (55 files)

---

*End of Part 1. Continue to Part 2: Decision Engine, domain-map.json, and Anti-Patterns.*

# anti-slop-design Skill Spec — Part 2 of 5
## Decision Engine, domain-map.json Schema, and Anti-Patterns Bible

> **Reading order**: Part 1 (Architecture) → Part 2 (this) → Part 3 (Reference Files) → Part 4 (Assets & Templates) → Part 5 (Validation & Build Order)
>
> **This part specifies**: The structured data backbone (`domain-map.json`), the 8 core domain aesthetic profiles in full detail, the signal keyword taxonomy, and the comprehensive anti-patterns reference file.

---

## 2.1 DOMAIN-MAP.JSON — PURPOSE AND SCHEMA

### Purpose

`domain-map.json` is the structured data backbone of the decision engine. When the agent
runs Step 1 of the Design Thinking Protocol, it:
1. Extracts keywords from the user's request
2. Matches them against `signal_keywords` in this file
3. Loads the full aesthetic profile for the matched domain
4. Uses that profile to guide every subsequent design decision

This file must be valid JSON, parseable programmatically, and self-documenting through
clear key names.

### Top-Level Schema

```jsonc
{
  // Schema version for forward compatibility
  "schema_version": "1.0.0",

  // The 8 core domain profiles
  "domains": {
    "<domain_key>": { /* DomainProfile object — see §2.2 */ }
  },

  // Keyword → domain mapping for intent classification
  "signal_keywords": {
    "<domain_key>": ["keyword1", "keyword2", ...]
  },

  // Decision axes with defaults (used when domain is ambiguous)
  "axes_defaults": {
    "serif_vs_sans": "sans",
    "dark_vs_light": "light",
    "density": "medium",
    "animation_intensity": "moderate",
    "border_radius": "8px",
    "formality": "professional"
  },

  // Extensibility: instructions for adding new domains
  "extensibility": {
    "template": { /* Empty DomainProfile with all required keys */ },
    "instructions": "See assets/tokens/_extensibility.md for full guide"
  }
}
```

### DomainProfile Object Schema

Every domain entry MUST include ALL of these keys. No optional fields — if a value
isn't applicable, use an explicit `"none"` or `"default"` rather than omitting.

```jsonc
{
  // IDENTITY
  "name": "string",                    // Human-readable name
  "aesthetic_label": "string",         // 2-3 word aesthetic direction (e.g., "minimal-trust")
  "description": "string",            // 1-2 sentence description of the visual feel

  // COLOR
  "color_mood": ["string"],           // 3-5 mood words (e.g., "navy", "muted", "institutional")
  "primary_palette_oklch": {
    "bg_primary":      "oklch(...)",   // Main background
    "bg_secondary":    "oklch(...)",   // Card/surface background
    "bg_elevated":     "oklch(...)",   // Modal/popover background
    "text_primary":    "oklch(...)",   // Body text
    "text_secondary":  "oklch(...)",   // Muted/secondary text
    "text_heading":    "oklch(...)",   // Heading text (may differ from body)
    "accent_primary":  "oklch(...)",   // Primary interactive color
    "accent_secondary":"oklch(...)",   // Secondary accent
    "border":          "oklch(...)",   // Default border color
    "error":           "oklch(...)",   // Error state
    "success":         "oklch(...)",   // Success state
    "warning":         "oklch(...)"    // Warning state
  },
  "dark_mode_palette_oklch": {
    // Same keys as primary_palette_oklch but for dark mode
    // ...
  },
  "dark_default": false,               // Whether dark mode is the default

  // TYPOGRAPHY
  "typography": {
    "heading_family": "string",        // CSS font-family value (e.g., "'Plus Jakarta Sans', sans-serif")
    "heading_weight": "string",        // CSS font-weight (e.g., "700" or "800")
    "body_family": "string",           // CSS font-family value
    "body_weight": "string",           // CSS font-weight
    "mono_family": "string",           // Monospace font-family (for code/data)
    "font_scale": "string",            // Utopia scale ratio: "minor-third" | "major-third" | "perfect-fourth"
    "heading_letter_spacing": "string", // e.g., "-0.02em"
    "body_line_height": "string",      // e.g., "1.6"
    "heading_line_height": "string",   // e.g., "1.15"
    "heading_transform": "string"      // "none" | "uppercase" | "capitalize"
  },

  // SHAPE & SPACE
  "border_radius": {
    "small": "string",                 // Button, input (e.g., "4px")
    "medium": "string",                // Card (e.g., "8px")
    "large": "string",                 // Modal, section (e.g., "12px")
    "pill": "string"                   // Tag, badge (e.g., "9999px")
  },
  "density": "string",                // "spacious" | "medium" | "dense"
  "shadow_style": "string",           // "none" | "subtle" | "elevated" | "dramatic" | "colored"

  // MOTION
  "animation": {
    "intensity": "string",             // "none" | "minimal" | "moderate" | "expressive"
    "style": "string",                 // "snappy" | "smooth" | "springy" | "cinematic"
    "page_transitions": true,          // Whether to use page-level transitions
    "scroll_animations": false,        // Whether to use scroll-driven animations
    "micro_interactions": true         // Whether to animate hover/focus/press states
  },

  // LAYOUT
  "layout_preference": "string",      // "symmetric" | "asymmetric" | "editorial" | "bento" | "single-column"
  "max_content_width": "string",      // e.g., "1200px", "1400px", "100%"
  "grid_columns": "string",           // e.g., "12", "16", "fluid"

  // IMAGERY
  "imagery_style": "string",          // "photography" | "illustration" | "abstract" | "none" | "screenshots"
  "imagery_treatment": "string",      // "full-bleed" | "contained" | "masked" | "duotone"

  // REFERENCE
  "reference_files": ["string"],      // Which references/*.md to load
  "token_file": "string",             // Path to domain token JSON
  "exemplar_sites": ["string"],       // 3-5 real-world examples
  "anti_patterns": ["string"]         // Domain-specific things to NEVER do
}
```

### Validation criteria for domain-map.json
- [ ] Valid JSON (parseable by `JSON.parse()` / `json.load()`)
- [ ] Contains exactly 8 domains under `domains` key
- [ ] Each domain has ALL keys from DomainProfile schema (no missing keys)
- [ ] All `primary_palette_oklch` values are valid OKLCH strings matching `oklch(L C H)` format
- [ ] All `dark_mode_palette_oklch` values are valid OKLCH strings
- [ ] `signal_keywords` has an entry for each domain with ≥10 keywords each
- [ ] `axes_defaults` contains all 6 axis keys
- [ ] `extensibility.template` contains all DomainProfile keys with placeholder values
- [ ] Total file is 300-500 lines of formatted JSON


---

## 2.2 THE 8 CORE DOMAIN PROFILES

Each profile below is the COMPLETE specification for what must appear in `domain-map.json`.
The builder must translate these into the JSON schema defined in §2.1.

### DOMAIN 1: FINTECH (`fintech`)

**Aesthetic label**: `"minimal-trust"`
**Description**: Clean, restrained, confidence-inspiring. Every pixel must convey "your money is safe here." Precision over personality.

**Color mood**: `["navy", "institutional", "muted", "high-contrast"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.985 0.003 250)` | #F8F9FC | Cool-tinted off-white, not pure white |
| bg_secondary | `oklch(0.97 0.005 250)` | #F0F2F8 | Subtle blue-gray card surface |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | White for modals/popovers (contrast against bg) |
| text_primary | `oklch(0.20 0.02 260)` | #0F1729 | Near-black with navy tint |
| text_secondary | `oklch(0.45 0.015 260)` | #5A6478 | Muted slate |
| text_heading | `oklch(0.15 0.03 260)` | #0A1120 | Slightly deeper than body |
| accent_primary | `oklch(0.50 0.18 260)` | #2B4ACB | Trustworthy blue (NOT Tailwind blue-500) |
| accent_secondary | `oklch(0.60 0.10 170)` | #1A9E7A | Teal for positive/growth indicators |
| border | `oklch(0.88 0.01 250)` | #D4D9E4 | Subtle cool gray |
| error | `oklch(0.55 0.22 25)` | #D93025 | Clear red, sufficient contrast |
| success | `oklch(0.60 0.17 155)` | #1A8754 | Green (not too bright) |
| warning | `oklch(0.70 0.15 80)` | #C17C1A | Amber |

**Dark mode palette**:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.13 0.015 260)` | #0D1117 |
| bg_secondary | `oklch(0.17 0.015 260)` | #151B27 |
| bg_elevated | `oklch(0.22 0.015 260)` | #1E2535 |
| text_primary | `oklch(0.92 0.005 250)` | #E1E4ED |
| text_secondary | `oklch(0.65 0.01 250)` | #8B93A5 |
| accent_primary | `oklch(0.65 0.18 260)` | #5B7FE8 |
| border | `oklch(0.28 0.015 260)` | #2A3347 |

**Dark default**: `false`

**Typography**:
```json
{
  "heading_family": "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
  "heading_weight": "700",
  "body_family": "'Inter', 'Helvetica Neue', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace",
  "font_scale": "minor-third",
  "heading_letter_spacing": "-0.02em",
  "body_line_height": "1.6",
  "heading_line_height": "1.15",
  "heading_transform": "none"
}
```
**Note**: Inter is permitted here as BODY ONLY because fintech demands maximum legibility
for dense data. The heading font (Plus Jakarta Sans) provides the distinctiveness.
In other domains, Inter must not appear even as body.

**Shape & space**:
```json
{
  "border_radius": { "small": "6px", "medium": "8px", "large": "12px", "pill": "9999px" },
  "density": "medium",
  "shadow_style": "subtle"
}
```

**Motion**:
```json
{
  "intensity": "minimal",
  "style": "snappy",
  "page_transitions": false,
  "scroll_animations": false,
  "micro_interactions": true
}
```
Motion is used ONLY for: state transitions on interactive elements, loading states,
number/chart animations when data loads. No decorative animation.

**Layout**: `"symmetric"` — grids, cards, tables. Clean alignment conveys precision.
**Max content width**: `"1280px"`
**Grid**: `"12"`
**Imagery**: `"screenshots"` — show the product. No stock photos. No illustrations.
**Imagery treatment**: `"contained"` — always within defined bounds, never full-bleed.

**Reference files**: `["web-react.md", "dataviz.md"]`
**Token file**: `"fintech.json"`
**Exemplar sites**: `["stripe.com", "mercury.com", "wise.com", "linear.app/finance", "ramp.com"]`
**Anti-patterns**: `["Decorative animation", "Stock photography of handshakes", "Playful rounded corners >12px", "Bright saturated primary colors", "Gradient backgrounds", "Comic/playful fonts", "Excessive use of illustrations"]`


---

### DOMAIN 2: HEALTHCARE (`healthcare`)

**Aesthetic label**: `"calm-reassuring"`
**Description**: Soothing, trustworthy, warm. Must feel safe and approachable — never clinical or cold. Accessibility is paramount (patients may be elderly, stressed, or impaired).

**Color mood**: `["calming", "blue-green", "warm-neutral", "soft"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.98 0.004 160)` | #F5FAF8 | Warm off-white with green tint |
| bg_secondary | `oklch(0.96 0.01 170)` | #E8F4EF | Soft mint surface |
| bg_elevated | `oklch(0.995 0.002 90)` | #FEFEFA | Near-white warm |
| text_primary | `oklch(0.22 0.02 200)` | #152B26 | Dark teal-gray |
| text_secondary | `oklch(0.48 0.015 200)` | #4F7069 | Muted sage |
| text_heading | `oklch(0.18 0.025 200)` | #0E2320 | Deep teal |
| accent_primary | `oklch(0.55 0.14 190)` | #1A8A7A | Teal — calming, not alarming |
| accent_secondary | `oklch(0.60 0.12 250)` | #4B7FCC | Soft blue for secondary actions |
| border | `oklch(0.88 0.015 170)` | #C8DED5 | Soft green-gray |
| error | `oklch(0.55 0.18 25)` | #C4382A | Red — NEVER as primary color, only errors |
| success | `oklch(0.58 0.15 160)` | #1D8A5E | Green confirmation |
| warning | `oklch(0.72 0.12 80)` | #B88A2E | Gentle amber |

**Dark mode palette**:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.14 0.01 200)` | #0E1A17 |
| bg_secondary | `oklch(0.18 0.015 200)` | #142622 |
| bg_elevated | `oklch(0.23 0.015 200)` | #1E322D |
| text_primary | `oklch(0.90 0.008 170)` | #D5E8E0 |
| text_secondary | `oklch(0.65 0.01 180)` | #85A89C |
| accent_primary | `oklch(0.65 0.12 190)` | #3AAFA0 |
| border | `oklch(0.30 0.015 200)` | #2A3F39 |

**Dark default**: `false`

**Typography**:
```json
{
  "heading_family": "'Outfit', 'DM Sans', system-ui, sans-serif",
  "heading_weight": "600",
  "body_family": "'DM Sans', 'Source Sans 3', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'IBM Plex Mono', 'Consolas', monospace",
  "font_scale": "major-third",
  "heading_letter_spacing": "-0.01em",
  "body_line_height": "1.7",
  "heading_line_height": "1.2",
  "heading_transform": "none"
}
```
**Note**: Larger base font (18px recommended), generous line height (1.7). Body line
height is the highest of any domain — readability for stressed or impaired users.

**Shape & space**:
```json
{
  "border_radius": { "small": "8px", "medium": "12px", "large": "16px", "pill": "9999px" },
  "density": "spacious",
  "shadow_style": "subtle"
}
```
Rounded corners (8-16px) feel approachable. Spacious density gives breathing room.
Minimum tap target: 44×44px (exceeds WCAG 24px minimum).

**Motion**:
```json
{
  "intensity": "minimal",
  "style": "smooth",
  "page_transitions": true,
  "scroll_animations": false,
  "micro_interactions": true
}
```
Gentle, slow transitions only. "Breathing" animations for loading states (scale 1.0→1.02
on a 2s ease-in-out loop). No fast or jarring motion — patients may be anxious.

**Layout**: `"single-column"` primary, with sidebars for navigation only.
**Max content width**: `"800px"` for content, `"1200px"` for dashboards
**Grid**: `"12"` (but content rarely spans more than 8 columns)
**Imagery**: `"illustration"` — custom, friendly, inclusive illustrations (Headspace model). No stock photos of doctors/patients (feels impersonal). No photography unless showing real team.
**Imagery treatment**: `"contained"` — within defined containers, not overwhelming.

**Reference files**: `["web-react.md", "accessibility.md"]`
**Token file**: `"healthcare.json"`
**Exemplar sites**: `["headspace.com", "calm.com", "zocdoc.com", "one.app", "nhs.uk"]`
**Anti-patterns**: `["Red as primary/accent color (triggers alarm)", "Dense information layouts", "Small text below 16px", "Stock photos of stethoscopes", "Clinical/sterile color schemes (pure white + gray)", "Fast animations", "Complex multi-step forms without progress indicators", "Tiny tap targets"]`


---

### DOMAIN 3: DEVELOPER TOOLS (`devtools`)

**Aesthetic label**: `"linear-dark"`
**Description**: The "Linear look" — dark-first, precise, information-dense. Monochrome with colorful accent glows. Targets technical users who appreciate craft and performance.

**Color mood**: `["dark", "precise", "neon-accent", "monochrome-plus-glow"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.97 0.003 260)` | #F4F5F9 | Cool gray-white |
| bg_secondary | `oklch(0.94 0.005 260)` | #E8EAF2 | Subtle blue-gray |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | Pure white cards on gray bg |
| text_primary | `oklch(0.18 0.02 270)` | #101828 | Near-black blue |
| text_secondary | `oklch(0.50 0.01 260)` | #667085 | Medium gray |
| text_heading | `oklch(0.13 0.025 270)` | #0A0F1E | Very dark blue |
| accent_primary | `oklch(0.60 0.25 290)` | #7C3AED | Vivid purple (brand accent) |
| accent_secondary | `oklch(0.70 0.20 180)` | #06B6D4 | Cyan for secondary |
| border | `oklch(0.87 0.008 260)` | #D0D5E0 | 1px subtle lines |
| error | `oklch(0.60 0.22 25)` | #EF4444 | Bright red |
| success | `oklch(0.65 0.18 155)` | #22C55E | Bright green |
| warning | `oklch(0.75 0.15 80)` | #EAB308 | Yellow |

**Dark mode palette** (this is the DEFAULT):
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.10 0.01 270)` | #0A0A0F | Near-black with blue tint |
| bg_secondary | `oklch(0.14 0.012 270)` | #111118 | Elevated surface |
| bg_elevated | `oklch(0.18 0.015 270)` | #1A1A25 | Card/modal |
| text_primary | `oklch(0.90 0.005 260)` | #E0E2EA | Off-white |
| text_secondary | `oklch(0.60 0.008 260)` | #7A7F8E | Medium gray |
| accent_primary | `oklch(0.70 0.25 290)` | #A78BFA | Lighter purple for dark bg |
| accent_secondary | `oklch(0.75 0.20 180)` | #22D3EE | Bright cyan |
| border | `oklch(0.25 0.012 270)` | #1F2030 | Subtle 1px lines |

**Dark default**: `true` — devtools are dark-first.

**Typography**:
```json
{
  "heading_family": "'Geist Sans', 'Cabinet Grotesk', system-ui, sans-serif",
  "heading_weight": "600",
  "body_family": "'Geist Sans', 'General Sans', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace",
  "font_scale": "minor-third",
  "heading_letter_spacing": "-0.025em",
  "body_line_height": "1.5",
  "heading_line_height": "1.1",
  "heading_transform": "none"
}
```
**Note**: Geist is the Vercel superfamily — Swiss-design precision. Sans and Mono share
the same design DNA, creating cohesion between UI and code. If unavailable, Cabinet
Grotesk provides similar geometric precision.

**Shape & space**:
```json
{
  "border_radius": { "small": "6px", "medium": "8px", "large": "12px", "pill": "9999px" },
  "density": "medium",
  "shadow_style": "none"
}
```
Shadows are replaced by 1px borders and subtle gradient glows. Elevation is communicated
through background color stepping, not drop shadows.

**Motion**:
```json
{
  "intensity": "moderate",
  "style": "snappy",
  "page_transitions": true,
  "scroll_animations": true,
  "micro_interactions": true
}
```
Fast, precise animations (100-200ms). No bouncy springs — use ease-out curves.
Keyboard shortcut reveals should be instant. Command palette (⌘K) should appear
in <100ms. Skeleton loading states, not spinners.

**Layout**: `"bento"` — modular grid cells of varying sizes (2×1, 1×2, 2×2).
**Max content width**: `"1400px"`
**Grid**: `"16"` (finer grid allows more varied bento compositions)
**Imagery**: `"screenshots"` — product screenshots, code snippets, terminal output. No photos.
**Imagery treatment**: `"contained"` with subtle border-radius and border.

**Visual textures**: dot-grid backgrounds (`assets/svg/dot-grid.svg`), subtle gradient
glow effects behind cards (`box-shadow: 0 0 60px oklch(0.5 0.2 290 / 0.1)`).

**Reference files**: `["web-react.md", "animation-motion.md", "cli-terminal.md"]`
**Token file**: `"devtools.json"`
**Exemplar sites**: `["linear.app", "vercel.com", "raycast.com", "warp.dev", "supabase.com"]`
**Anti-patterns**: `["Light backgrounds as default", "Rounded corners >12px", "Stock photography", "Bouncy/playful animations", "Serif fonts", "Low information density", "Hamburger menus (use command palette)", "Loading spinners instead of skeleton states"]`


---

### DOMAIN 4: E-COMMERCE / LUXURY (`ecommerce`)

**Aesthetic label**: `"editorial-cinematic"`
**Description**: Product is the hero. Restrained UI that steps back to let merchandise speak. Luxury end leans serif/editorial; mass-market leans clean/functional. Photography dominates.

**Color mood**: `["neutral", "warm", "restrained", "high-contrast-accents"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.98 0.005 80)` | #FAF9F5 | Warm cream off-white |
| bg_secondary | `oklch(0.95 0.008 80)` | #F0EDE5 | Warm beige surface |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | White for product cards |
| text_primary | `oklch(0.18 0.01 50)` | #1A1610 | Warm near-black |
| text_secondary | `oklch(0.50 0.01 60)` | #706A5A | Warm gray |
| text_heading | `oklch(0.12 0.015 50)` | #0F0C07 | Deep warm black |
| accent_primary | `oklch(0.25 0.01 50)` | #1A1610 | Near-black (CTA on light bg) |
| accent_secondary | `oklch(0.55 0.12 50)` | #8B5E3C | Warm bronze/copper |
| border | `oklch(0.85 0.01 70)` | #D5CEBF | Warm subtle border |
| error | `oklch(0.55 0.18 25)` | #C4382A | Red — for errors only |
| success | `oklch(0.55 0.14 155)` | #2A7A52 | Muted green |
| warning | `oklch(0.70 0.12 80)` | #B88A2E | Warm amber |

**Dark mode palette**:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.10 0.008 50)` | #0F0D0A |
| bg_secondary | `oklch(0.15 0.008 50)` | #1A1714 |
| bg_elevated | `oklch(0.20 0.01 50)` | #252119 |
| text_primary | `oklch(0.90 0.005 70)` | #E5E0D5 |
| text_secondary | `oklch(0.62 0.008 60)` | #918A7A |
| accent_primary | `oklch(0.90 0.005 70)` | #E5E0D5 |
| border | `oklch(0.28 0.008 50)` | #302C25 |

**Dark default**: `false`

**Typography**:
```json
{
  "heading_family": "'Cormorant Garamond', 'Playfair Display', 'Georgia', serif",
  "heading_weight": "500",
  "body_family": "'Lato', 'Proza Libre', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'IBM Plex Mono', monospace",
  "font_scale": "perfect-fourth",
  "heading_letter_spacing": "0.02em",
  "body_line_height": "1.6",
  "heading_line_height": "1.1",
  "heading_transform": "uppercase"
}
```
**Note**: Serif headings + sans body is the luxury/editorial standard. All-caps headings
with generous letter-spacing (0.02em+) for brand names and section titles. Perfect-fourth
scale creates dramatic hierarchy.

**Shape & space**:
```json
{
  "border_radius": { "small": "0px", "medium": "0px", "large": "2px", "pill": "0px" },
  "density": "spacious",
  "shadow_style": "none"
}
```
Sharp corners (0-2px) are a luxury signal. No shadows — use borders or whitespace.
Spacious density with generous padding creates a gallery feel.

**Motion**:
```json
{
  "intensity": "moderate",
  "style": "cinematic",
  "page_transitions": true,
  "scroll_animations": true,
  "micro_interactions": true
}
```
Slow, deliberate reveal animations (400-600ms). Products fade in on scroll.
Image hover: slow zoom (transform: scale(1.03) over 800ms). No bouncy or fast motion.

**Layout**: `"editorial"` — full-width hero images, asymmetric product grids, generous whitespace between sections.
**Max content width**: `"1400px"` for grid, `"100%"` for hero images
**Grid**: `"12"`
**Imagery**: `"photography"` — hero-quality product photography is mandatory. NEVER stock.
**Imagery treatment**: `"full-bleed"` for hero sections, `"contained"` for product grids.

**Reference files**: `["web-landing.md", "animation-motion.md", "typography.md"]`
**Token file**: `"ecommerce.json"`
**Exemplar sites**: `["apple.com", "aesop.com", "everlane.com", "ssense.com", "mrporter.com"]`
**Anti-patterns**: `["Bright primary colors", "Rounded corners >4px", "Sans-serif headings without serif counterpart", "Stock photography", "Busy backgrounds or patterns", "Playful illustrations", "Dense product grids without whitespace", "Generic 'Shop Now' CTAs without brand voice"]`

---

### DOMAIN 5: EDUCATION (`education`)

**Aesthetic label**: `"playful-gamified"`
**Description**: Vibrant, encouraging, game-like. Learning should feel rewarding. Heavy use of color, progress indicators, streaks, badges, and character illustrations. Duolingo is the north star.

**Color mood**: `["vibrant", "saturated", "encouraging", "colorful"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.98 0.005 110)` | #F7FAF5 | Very faint green tint |
| bg_secondary | `oklch(0.96 0.01 110)` | #EEF5E8 | Soft green surface |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | White cards |
| text_primary | `oklch(0.20 0.025 150)` | #0C2618 | Deep forest green |
| text_secondary | `oklch(0.45 0.02 150)` | #3D6A50 | Medium green |
| text_heading | `oklch(0.18 0.03 150)` | #0A2214 | Deepest green |
| accent_primary | `oklch(0.72 0.22 145)` | #58CC02 | Duolingo green — energizing |
| accent_secondary | `oklch(0.65 0.22 280)` | #8549E0 | Purple for premium/bonus |
| border | `oklch(0.88 0.02 145)` | #BCDE9C | Soft green border |
| error | `oklch(0.60 0.22 25)` | #FF4B4B | Bright red for wrong answers |
| success | `oklch(0.72 0.22 145)` | #58CC02 | Same green as accent (correct!) |
| warning | `oklch(0.78 0.16 80)` | #FFC800 | Bright gold for streaks/rewards |

**Dark mode palette**:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.13 0.015 150)` | #0A1A10 |
| bg_secondary | `oklch(0.17 0.02 150)` | #122618 |
| bg_elevated | `oklch(0.22 0.02 150)` | #1A3322 |
| text_primary | `oklch(0.90 0.01 145)` | #D5F0C0 |
| text_secondary | `oklch(0.65 0.015 145)` | #7DB86A |
| accent_primary | `oklch(0.72 0.22 145)` | #58CC02 |
| border | `oklch(0.28 0.02 150)` | #1F3D28 |

**Dark default**: `false`

**Typography**:
```json
{
  "heading_family": "'Nunito', 'Baloo 2', 'Poppins', sans-serif",
  "heading_weight": "800",
  "body_family": "'Nunito', 'DM Sans', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'Fira Code', monospace",
  "font_scale": "major-third",
  "heading_letter_spacing": "-0.01em",
  "body_line_height": "1.6",
  "heading_line_height": "1.2",
  "heading_transform": "none"
}
```
**Note**: Rounded, friendly sans-serif. Nunito's rounded terminals feel approachable
and game-like. Heavy weight (800) for headings creates bold, playful hierarchy.

**Shape & space**:
```json
{
  "border_radius": { "small": "12px", "medium": "16px", "large": "20px", "pill": "9999px" },
  "density": "medium",
  "shadow_style": "elevated"
}
```
Large border-radius (12-20px) creates a toy-like, tactile feel. Elevated shadows
make cards feel like physical objects you can interact with.

**Motion**:
```json
{
  "intensity": "expressive",
  "style": "springy",
  "page_transitions": true,
  "scroll_animations": true,
  "micro_interactions": true
}
```
Spring physics for interactive elements (bouncy buttons, celebrating correct answers).
Confetti animations for streaks. Progress bars animate with easing. XP counters
tick up. Stagger animations for list items appearing. Motion is a REWARD mechanism.

**Layout**: `"bento"` — game-board-like modular layouts with varying card sizes.
**Max content width**: `"1000px"` (focused, not overwhelming)
**Grid**: `"12"`
**Imagery**: `"illustration"` — custom character illustrations, mascots, badge icons. Duolingo's owl, Brilliant's geometric art. NEVER photography unless showing real students.
**Imagery treatment**: `"contained"` — illustrations live within defined card/section bounds.

**Reference files**: `["web-react.md", "animation-motion.md"]`
**Token file**: `"education.json"`
**Exemplar sites**: `["duolingo.com", "brilliant.org", "khanacademy.org", "codecademy.com", "notion.so/education"]`
**Anti-patterns**: `["Boring/corporate color schemes", "Small text", "Dense information without chunking", "Missing progress indicators", "No celebration/reward on completion", "Static pages with no interaction", "Serif fonts (feel too formal)", "Gray/muted palettes"]`


---

### DOMAIN 6: MEDIA / PUBLISHING (`media`)

**Aesthetic label**: `"editorial-typographic"`
**Description**: Content is king. Typography drives the entire design — dramatic size hierarchies, editorial serif fonts, multi-column layouts. The New York Times, The Verge, and Medium are references. Design serves readability.

**Color mood**: `["warm-neutral", "high-contrast", "ink-on-paper", "minimal-accent"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.985 0.005 80)` | #FAF8F3 | Warm paper-like off-white |
| bg_secondary | `oklch(0.97 0.008 80)` | #F2EEE5 | Parchment surface |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | Clean white for article body |
| text_primary | `oklch(0.18 0.01 60)` | #1A1711 | Warm near-black (ink) |
| text_secondary | `oklch(0.48 0.008 60)` | #6B6558 | Warm gray |
| text_heading | `oklch(0.10 0.015 50)` | #0A0804 | Deep black for headlines |
| accent_primary | `oklch(0.50 0.20 25)` | #C02020 | Editorial red (The Economist, NYT) |
| accent_secondary | `oklch(0.35 0.01 60)` | #3D3A32 | Dark warm gray for secondary links |
| border | `oklch(0.85 0.008 70)` | #D2CCC0 | Warm hairline rule |
| error | `oklch(0.55 0.20 25)` | #CC2222 | Red |
| success | `oklch(0.55 0.14 155)` | #2A7A52 | Muted green |
| warning | `oklch(0.70 0.12 80)` | #B88A2E | Amber |

**Dark mode palette**:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.12 0.008 60)` | #111009 |
| bg_secondary | `oklch(0.16 0.008 60)` | #1A1810 |
| bg_elevated | `oklch(0.21 0.01 60)` | #252218 |
| text_primary | `oklch(0.88 0.005 70)` | #DDD8CC |
| text_secondary | `oklch(0.62 0.006 60)` | #928C80 |
| accent_primary | `oklch(0.65 0.18 25)` | #E04040 |
| border | `oklch(0.28 0.008 60)` | #302D22 |

**Dark default**: `false`

**Typography**:
```json
{
  "heading_family": "'Playfair Display', 'Libre Baskerville', 'Georgia', serif",
  "heading_weight": "700",
  "body_family": "'Source Serif 4', 'Lora', 'Charter', serif",
  "body_weight": "400",
  "mono_family": "'Fira Code', 'Source Code Pro', monospace",
  "font_scale": "perfect-fourth",
  "heading_letter_spacing": "-0.015em",
  "body_line_height": "1.65",
  "heading_line_height": "1.1",
  "heading_transform": "none"
}
```
**Note**: Serif-dominant. Both heading AND body are serif — this is what distinguishes
editorial design. Body serif must be highly legible (Source Serif 4, Lora). Perfect-fourth
scale creates the dramatic headline sizes that define editorial layouts. Max line
width: 65ch (hardcoded).

**Shape & space**:
```json
{
  "border_radius": { "small": "2px", "medium": "4px", "large": "4px", "pill": "9999px" },
  "density": "medium",
  "shadow_style": "none"
}
```
Minimal border-radius — editorial design is sharp and structured. Hairline rules
(1px borders) as section dividers. No drop shadows.

**Motion**:
```json
{
  "intensity": "minimal",
  "style": "smooth",
  "page_transitions": false,
  "scroll_animations": false,
  "micro_interactions": true
}
```
Content should load fast and stay still. No scroll-driven effects on articles
(they distract from reading). Subtle hover states on links/cards only.

**Layout**: `"editorial"` — multi-column CSS Grid with asymmetric sidebar, pull quotes, full-bleed images breaking the column flow.
**Max content width**: `"720px"` for body text (65ch), `"1200px"` for grid
**Grid**: `"12"` with named grid areas
**Imagery**: `"photography"` — hero images, photo essays. Photography is editorial content.
**Imagery treatment**: `"full-bleed"` for hero, `"contained"` for inline.

**Reference files**: `["web-landing.md", "typography.md", "layout-spacing.md"]`
**Token file**: `"media.json"`
**Exemplar sites**: `["nytimes.com", "theverge.com", "medium.com", "aeon.co", "economist.com"]`
**Anti-patterns**: `["Sans-serif body text", "Low type hierarchy (small headlines)", "Sidebar ads breaking reading flow", "Infinite scroll without section breaks", "Hamburger menus hiding navigation", "Generic blog templates", "Line widths >75ch", "Illustrations replacing photography for news content"]`

---

### DOMAIN 7: GOVERNMENT / CIVIC (`government`)

**Aesthetic label**: `"functional-accessible"`
**Description**: Accessibility-first, content-first, trust-through-plainness. GOV.UK is the gold standard. Zero decoration. Progressive enhancement. Every citizen must be able to use it — including elderly, low-literacy, low-bandwidth, assistive-technology users.

**Color mood**: `["institutional", "high-contrast", "blue", "plain"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(1.0 0 0)` | #FFFFFF | Pure white (GOV.UK standard) |
| bg_secondary | `oklch(0.97 0.003 240)` | #F3F4F6 | Light gray for alternate sections |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | Same as primary |
| text_primary | `oklch(0.15 0.01 260)` | #0B0C10 | Near-black |
| text_secondary | `oklch(0.40 0.01 260)` | #505A6A | Medium gray |
| text_heading | `oklch(0.10 0.01 260)` | #050608 | Black |
| accent_primary | `oklch(0.47 0.18 250)` | #1D70B8 | GOV.UK-style institutional blue |
| accent_secondary | `oklch(0.40 0.15 250)` | #1654A0 | Darker blue for visited links |
| border | `oklch(0.75 0.005 260)` | #B1B4B6 | Solid gray borders |
| error | `oklch(0.50 0.22 25)` | #D4351C | GOV.UK red |
| success | `oklch(0.52 0.16 160)` | #00703C | GOV.UK green |
| warning | `oklch(0.78 0.16 80)` | #FFDD00 | GOV.UK yellow (high visibility) |

**Dark mode palette**:
Government sites typically do NOT implement dark mode. If required:
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.15 0.005 260)` | #121418 |
| bg_secondary | `oklch(0.19 0.005 260)` | #1C1E24 |
| text_primary | `oklch(0.92 0.003 260)` | #E8E9EC |
| accent_primary | `oklch(0.62 0.18 250)` | #5694D0 |
| border | `oklch(0.35 0.005 260)` | #40444C |

**Dark default**: `false` — always light.

**Typography**:
```json
{
  "heading_family": "'GDS Transport', 'Noto Sans', 'Arial', sans-serif",
  "heading_weight": "700",
  "body_family": "'Noto Sans', 'Arial', sans-serif",
  "body_weight": "400",
  "mono_family": "'Noto Sans Mono', 'Consolas', monospace",
  "font_scale": "minor-third",
  "heading_letter_spacing": "0",
  "body_line_height": "1.6",
  "heading_line_height": "1.2",
  "heading_transform": "none"
}
```
**Note**: Arial-based fallbacks are intentional — government sites must work on any
device with any font availability. GDS Transport is GOV.UK's proprietary font; for
non-UK government, Noto Sans covers every Unicode character (essential for multilingual).
Minimum 19px body text (GOV.UK standard).

**Shape & space**:
```json
{
  "border_radius": { "small": "0px", "medium": "0px", "large": "0px", "pill": "0px" },
  "density": "spacious",
  "shadow_style": "none"
}
```
Zero border-radius — every corner is square. No shadows. No visual embellishment.
This is a feature, not a limitation: it communicates seriousness and prevents
decorative elements from creating accessibility barriers.

**Motion**:
```json
{
  "intensity": "none",
  "style": "snappy",
  "page_transitions": false,
  "scroll_animations": false,
  "micro_interactions": false
}
```
**No decorative animation whatsoever.** Focus management transitions are acceptable
(focus ring appearance). Progressive disclosure (show/hide) uses no transition.
Rationale: animation can trigger vestibular disorders, distract users with
cognitive disabilities, and waste bandwidth on slow connections.

**Layout**: `"single-column"` — 2/3 width max, left-aligned. No sidebars in content areas. Navigation is flat and visible.
**Max content width**: `"750px"` for content
**Grid**: `"fluid"` — single column, no grid needed
**Imagery**: `"none"` — minimize imagery. When required: simple diagrams, charts, or icons. No photography, illustrations, or decorative images.
**Imagery treatment**: `"contained"` — alt text required, never decorative.

**Reference files**: `["web-react.md", "accessibility.md"]`
**Token file**: `"government.json"`
**Exemplar sites**: `["gov.uk", "design-system.service.gov.uk", "usa.gov", "canada.ca", "nsw.gov.au"]`
**Anti-patterns**: `["ANY decorative animation", "Rounded corners", "Gradient backgrounds", "Custom fonts that might not load", "Hamburger menus", "Carousel/slider components", "Auto-playing media", "Pop-ups or modals for non-essential content", "JavaScript-dependent core functionality", "Text below 19px", "Color as the sole differentiator for any information"]`


---

### DOMAIN 8: CREATIVE AGENCY / PORTFOLIO (`creative`)

**Aesthetic label**: `"bold-experimental"`
**Description**: Maximum creative freedom. This is where the agent can push boundaries — asymmetric layouts, experimental typography, dramatic animation, unconventional navigation. Portfolio sites, agency websites, design studios. The design IS the content.

**Color mood**: `["bold", "unexpected", "high-saturation-accent", "dramatic-contrast"]`

**Primary palette (light)**:
| Token | OKLCH Value | Hex Approx | Rationale |
|---|---|---|---|
| bg_primary | `oklch(0.985 0.003 90)` | #FAFAF5 | Warm off-white |
| bg_secondary | `oklch(0.08 0.01 270)` | #070810 | Near-black section blocks |
| bg_elevated | `oklch(1.0 0 0)` | #FFFFFF | White for content overlays |
| text_primary | `oklch(0.15 0.01 50)` | #120F0A | Warm near-black |
| text_secondary | `oklch(0.50 0.008 50)` | #6D6760 | Warm mid-gray |
| text_heading | `oklch(0.08 0.01 270)` | #070810 | Deep black for impact |
| accent_primary | `oklch(0.65 0.27 30)` | #FF4D25 | Bold vermillion/coral |
| accent_secondary | `oklch(0.55 0.25 290)` | #7C2DE0 | Electric purple |
| border | `oklch(0.80 0.005 50)` | #C4BFB5 | Warm gray |
| error | `oklch(0.60 0.22 25)` | #EF4444 | Red |
| success | `oklch(0.65 0.18 155)` | #22C55E | Green |
| warning | `oklch(0.78 0.16 80)` | #FFC800 | Gold |

**Dark mode palette** (equally valid as primary):
| Token | OKLCH Value | Hex Approx |
|---|---|---|
| bg_primary | `oklch(0.08 0.01 270)` | #070810 |
| bg_secondary | `oklch(0.14 0.01 270)` | #121320 |
| bg_elevated | `oklch(0.20 0.01 270)` | #1C1D2E |
| text_primary | `oklch(0.95 0.005 80)` | #F5F2EA |
| text_secondary | `oklch(0.65 0.005 60)` | #9A958C |
| accent_primary | `oklch(0.70 0.27 30)` | #FF6D4A |
| border | `oklch(0.25 0.01 270)` | #1E1F2F |

**Dark default**: `false` (but the palette supports dramatic light/dark section alternation)

**Typography**:
```json
{
  "heading_family": "'Clash Display', 'Bricolage Grotesque', 'Anton', sans-serif",
  "heading_weight": "700",
  "body_family": "'Satoshi', 'General Sans', system-ui, sans-serif",
  "body_weight": "400",
  "mono_family": "'Recursive', 'Fira Code', monospace",
  "font_scale": "perfect-fourth",
  "heading_letter_spacing": "-0.03em",
  "body_line_height": "1.6",
  "heading_line_height": "1.0",
  "heading_transform": "none"
}
```
**Note**: Maximum typographic expression. Clash Display is bold and distinctive — the
kind of font that makes a portfolio memorable. Tight heading line-height (1.0) and
aggressive negative letter-spacing (-0.03em) for headlines. Satoshi for body provides
modern readability. Recursive mono allows variable MONO axis tricks (proportional → monospace
in a single font). Perfect-fourth scale for dramatic 4×+ headline-to-body ratios.

**Shape & space**:
```json
{
  "border_radius": { "small": "0px", "medium": "0px", "large": "0px", "pill": "9999px" },
  "density": "spacious",
  "shadow_style": "dramatic"
}
```
Sharp corners except for pill-shaped badges/tags. Dramatic shadows used intentionally
as design elements (not just elevation). Spacious density with sections that breathe.

**Motion**:
```json
{
  "intensity": "expressive",
  "style": "cinematic",
  "page_transitions": true,
  "scroll_animations": true,
  "micro_interactions": true
}
```
This is the domain where motion IS the design. Page-load choreography with staggered
reveals. Scroll-driven parallax and element transformations. Cursor effects (custom
cursor, mix-blend-mode). Text reveal animations (clip-path or mask). Kinetic typography.
GSAP ScrollTrigger and View Transitions API.

**HOWEVER**: even maximal motion must respect `prefers-reduced-motion`. Replace spatial
animation with fades, not elimination.

**Layout**: `"asymmetric"` — deliberately broken grids, overlapping elements, diagonal flow, negative space as composition element. CSS Grid with named areas and intentional overlap via negative margins or grid-column spanning.
**Max content width**: `"100%"` — creative sites often go full-viewport.
**Grid**: `"fluid"` — CSS Grid with fr units, not a fixed column system
**Imagery**: `"abstract"` or `"photography"` — either high-art photography or generative/abstract visuals. Custom cursor effects. WebGL/Three.js for hero sections is appropriate here.
**Imagery treatment**: `"full-bleed"` — images and video dominate the viewport.

**Visual textures**: All SVG textures from `assets/svg/` are fair game. Layer grain,
noise, and blob shapes. Use `mix-blend-mode` for overlay effects. CSS `backdrop-filter`
for glassmorphism. Generative backgrounds via CSS gradients or canvas.

**Reference files**: `["web-landing.md", "animation-motion.md", "typography.md", "layout-spacing.md"]`
**Token file**: `"creative.json"`
**Exemplar sites**: `["awwwards.com winners", "thefwa.com", "pentagram.com", "sagmeister.com", "stripe.com/sessions"]`
**Anti-patterns**: `["Safe/corporate color schemes", "Centered symmetric layouts", "Standard navigation patterns (always innovate nav)", "Static pages without motion", "Generic stock photography", "Template-looking layouts", "Cookie-cutter three-column grids", "Being experimental without being usable (accessibility still applies)"]`


---

## 2.3 SIGNAL KEYWORDS TAXONOMY

The `signal_keywords` object in `domain-map.json` maps user-intent keywords to domains.
The agent scans the user's request for these terms during Step 1 of the Design Thinking
Protocol.

### Keyword assignment rules

1. Keywords must be SPECIFIC enough to disambiguate — generic words like "app" or "website" should NOT appear
2. A keyword may appear in at most TWO domains (some ambiguity is OK, the agent resolves in Step 2)
3. Each domain must have ≥15 keywords, covering: the domain itself, common products/features, user roles, industry jargon
4. Keywords are case-insensitive at matching time

### Complete keyword table

```json
{
  "signal_keywords": {
    "fintech": [
      "bank", "banking", "payment", "payments", "transaction", "transactions",
      "invoice", "invoicing", "finance", "financial", "fintech", "money",
      "billing", "subscription", "pricing", "checkout", "wallet", "crypto",
      "trading", "stocks", "portfolio", "wealth", "insurance", "lending",
      "credit", "debit", "accounting", "ledger", "payroll", "revenue",
      "expense", "budget", "tax", "compliance", "KYC", "AML"
    ],
    "healthcare": [
      "health", "healthcare", "medical", "patient", "doctor", "clinical",
      "hospital", "pharmacy", "prescription", "diagnosis", "symptom",
      "wellness", "mental health", "therapy", "telehealth", "telemedicine",
      "EMR", "EHR", "HIPAA", "appointment", "medication", "vitals",
      "fitness", "nutrition", "meditation", "sleep", "wearable",
      "caregiver", "nursing", "dental", "veterinary", "lab results"
    ],
    "devtools": [
      "developer", "dev tools", "devtools", "IDE", "code editor", "terminal",
      "CLI", "API", "SDK", "documentation", "docs", "git", "GitHub",
      "deployment", "CI/CD", "pipeline", "monitoring", "logging", "debugging",
      "database", "infrastructure", "cloud", "serverless", "container",
      "docker", "kubernetes", "microservice", "open source", "npm",
      "package", "library", "framework", "lint", "test runner", "build tool",
      "command palette", "developer experience", "DX"
    ],
    "ecommerce": [
      "shop", "shopping", "store", "e-commerce", "ecommerce", "product page",
      "cart", "catalog", "marketplace", "retail", "fashion", "luxury",
      "brand", "merchandise", "inventory", "SKU", "wishlist", "collection",
      "seasonal", "sale", "discount", "coupon", "shipping", "delivery",
      "returns", "reviews", "ratings", "beauty", "cosmetics", "jewelry",
      "watches", "designer", "boutique", "lifestyle"
    ],
    "education": [
      "education", "learning", "course", "lesson", "quiz", "test",
      "student", "teacher", "classroom", "LMS", "curriculum", "module",
      "assignment", "grade", "progress", "streak", "badge", "certificate",
      "tutorial", "exercise", "practice", "flashcard", "study",
      "school", "university", "training", "onboarding", "upskill",
      "e-learning", "MOOC", "gamification", "leaderboard", "achievement"
    ],
    "media": [
      "news", "article", "blog", "editorial", "magazine", "publication",
      "journalism", "reporter", "newsletter", "content", "CMS", "publishing",
      "podcast", "video", "streaming", "media", "press", "headline",
      "byline", "column", "opinion", "review", "critic", "feature",
      "longform", "essay", "story", "narrative", "archive", "subscription",
      "paywall", "readership", "RSS", "feed"
    ],
    "government": [
      "government", "gov", "civic", "public service", "citizen", "municipal",
      "federal", "state", "council", "agency", "department", "regulation",
      "policy", "permit", "license", "tax filing", "voter", "election",
      "census", "benefits", "social services", "immigration", "passport",
      "public health", "emergency", "FOIA", "transparency", "open data",
      "compliance", "procurement", "grant", "accessibility", "508",
      "Section 508", "ADA"
    ],
    "creative": [
      "portfolio", "agency", "design studio", "creative", "art direction",
      "branding", "brand identity", "visual identity", "showreel",
      "case study", "gallery", "exhibition", "photography portfolio",
      "artist", "illustrator", "motion designer", "3D", "WebGL",
      "interactive experience", "immersive", "experimental", "avant-garde",
      "award", "awwwards", "FWA", "pitch deck", "creative brief",
      "concept", "campaign", "launch", "reveal"
    ]
  }
}
```

### Conflict resolution for ambiguous matches

When a user's request matches keywords from multiple domains, the agent resolves using
this priority:

1. **Explicit domain mention wins**: "Build me a fintech dashboard" → fintech
2. **Most keywords matched wins**: If 5 fintech keywords and 2 devtools keywords, → fintech
3. **Context from conversation history**: What has the user been building?
4. **Ask the user**: "This could be styled as [X] or [Y] — which direction fits better?"
5. **Default to the more constrained domain**: When in doubt, choose the domain with MORE rules (government > healthcare > fintech > media > ecommerce > education > devtools > creative), because constrained domains are harder to get wrong.


---

## 2.4 EXTENSIBILITY PATTERN

The `extensibility` key in `domain-map.json` provides a blank DomainProfile template
and instructions for adding new domains without modifying the core 8.

### Template entry in domain-map.json

```json
{
  "extensibility": {
    "template": {
      "name": "",
      "aesthetic_label": "",
      "description": "",
      "color_mood": [],
      "primary_palette_oklch": {
        "bg_primary": "oklch()",
        "bg_secondary": "oklch()",
        "bg_elevated": "oklch()",
        "text_primary": "oklch()",
        "text_secondary": "oklch()",
        "text_heading": "oklch()",
        "accent_primary": "oklch()",
        "accent_secondary": "oklch()",
        "border": "oklch()",
        "error": "oklch()",
        "success": "oklch()",
        "warning": "oklch()"
      },
      "dark_mode_palette_oklch": {},
      "dark_default": false,
      "typography": {
        "heading_family": "",
        "heading_weight": "",
        "body_family": "",
        "body_weight": "",
        "mono_family": "",
        "font_scale": "",
        "heading_letter_spacing": "",
        "body_line_height": "",
        "heading_line_height": "",
        "heading_transform": ""
      },
      "border_radius": { "small": "", "medium": "", "large": "", "pill": "" },
      "density": "",
      "shadow_style": "",
      "animation": {
        "intensity": "",
        "style": "",
        "page_transitions": false,
        "scroll_animations": false,
        "micro_interactions": false
      },
      "layout_preference": "",
      "max_content_width": "",
      "grid_columns": "",
      "imagery_style": "",
      "imagery_treatment": "",
      "reference_files": [],
      "token_file": "",
      "exemplar_sites": [],
      "anti_patterns": []
    },
    "instructions": "See assets/tokens/_extensibility.md for the full guide on adding new domains."
  }
}
```

### _extensibility.md content spec

The `assets/tokens/_extensibility.md` file must contain:

1. **Step-by-step guide** for adding a new domain:
   - Copy the template from `domain-map.json → extensibility.template`
   - Fill in every field (no empty strings allowed)
   - Create a new `assets/tokens/domain-tokens/{domain_key}.json` token file
   - Add signal_keywords for the new domain (≥15 keywords)
   - Add the domain to the SKILL.md Platform Routing Table
   - Run the validation script to check all fields are populated

2. **Common extension domains** with starter suggestions:
   - `gaming` — dark, neon, achievement-heavy, immersive
   - `nonprofit` — warm, trustworthy, mission-driven, donation-focused
   - `social` — feed-centric, avatar-heavy, engagement-driven
   - `enterprise` — formal, data-dense, role-based, dashboard-heavy
   - `automotive` — sleek, dark, product-hero, configurator-style
   - `travel` — photography-dominant, warm, aspirational

3. **Validation checklist** for new domains:
   - All DomainProfile keys populated
   - OKLCH values are valid
   - Token file exists and is valid JSON
   - ≥15 signal keywords assigned
   - ≥3 exemplar sites listed
   - ≥3 anti-patterns specified


---

## 2.5 ANTI-PATTERNS REFERENCE FILE SPEC (`references/anti-patterns.md`)

This is the most philosophically important file in the skill. It defines what "AI slop"
IS, why it happens, and how to systematically avoid it. The anti-slop checklist in
SKILL.md is the compact operational version; this file is the comprehensive reference
the agent reads when it needs deeper understanding.

### Required file structure

```markdown
# Anti-Patterns: The AI Slop Bible

## Why AI Output Converges (3-5 paragraphs)
[Explain distributional convergence — LLMs gravitate to statistical mean of training
data. Every model trained on the same internet produces the same median design. This
is not a bug in any single model; it's an emergent property of how LLMs learn.]

## The Telltale Signs (organized by category)

### Typography Convergence
- Inter everywhere — the #1 indicator of AI-generated UI
- Subtle weight differences (400 vs 600) instead of dramatic contrasts (300 vs 900)
- Conservative size scales (1.5× jumps instead of 3×+)
- Space Grotesk as the "slightly interesting" convergent choice
- Poppins/Montserrat as the "friendly but generic" fallback
- No typographic hierarchy — everything feels the same weight
- Missing letter-spacing adjustments on headings
- Detection: check if font-family resolves to Inter, Roboto, Open Sans, Lato, or Arial
- Fix: consult `assets/fonts/font-stacks.json` for domain-appropriate alternatives

### Color Convergence
- Purple-to-blue gradients (THE signature of AI design, c. 2023-2025)
- Tailwind blue-500 (#3B82F6) as default accent
- Pure white (#FFFFFF) backgrounds
- Oversaturated gradient blobs as decorative elements
- Evenly-distributed timid palettes (no dominant color)
- Detection: check for `linear-gradient` with purple/blue hues; check for #3B82F6; check for bg-white
- Fix: use OKLCH palette from domain tokens; warm off-whites; one dominant + one accent

### Layout Convergence
- Hero → 3-column features → testimonials → CTA (the universal SaaS template)
- Perfect bilateral symmetry
- "Three boxes with icons" feature sections
- Uniform spacing between all elements
- Centered everything
- Detection: count centered sections; check if feature section has exactly 3 equal-width children
- Fix: asymmetric grids, editorial layouts, bento grids, varied section heights

### Content Convergence
- "Ship faster" / "Get started" / "Transform your workflow"
- Generic CTA text without brand voice
- "Trusted by 10,000+ companies" without specifics
- Lorem ipsum or obvious placeholder content
- Detection: search for these exact phrases
- Fix: write domain-specific copy or realistic placeholder for the vertical

### Interaction Convergence
- No page-load choreography (everything appears at once)
- Hover = opacity change (only)
- No scroll-driven animations
- Static, lifeless feel
- Detection: check for transition/animation CSS; count unique interaction states
- Fix: add staggered load animation, scroll triggers, meaningful hover transformations

## The Counter-Techniques (organized by intervention)

### Typography as Differentiator (20-30 lines)
- Extreme weight contrasts (100 vs 900)
- 3×+ size jumps between body and hero headings
- Distinctive fonts: Playfair Display, Fraunces, Clash Display, Satoshi, Cabinet Grotesk,
  Bricolage Grotesque, Cormorant Garamond, Outfit, Recursive
- Variable font axis tricks (WONK, SOFT in Fraunces; MONO in Recursive)
- Negative letter-spacing on large headings (-0.02em to -0.03em)
- All-caps with generous tracking for section labels (+0.1em)
- Font pairing rules: contrast family (serif + sans), match x-height, one display + one workhorse
- Reference: `references/typography.md` for complete guidance

### Breaking Layout Monotony (20-30 lines)
- Asymmetric CSS Grid: `grid-template-columns: 2fr 1fr` or named areas with overlap
- Bento grids: varied cell sizes (Apple-inspired modular composition)
- Editorial layouts: multi-column with pull quotes and full-bleed images
- Overlapping elements: negative margins, grid overlap, absolute positioning with z-index
- Negative space as compositional element (not just "empty")
- Diagonal flow: CSS transforms, clip-path, or rotated grid containers
- Reference: `references/layout-spacing.md` for complete guidance

### Adding Atmosphere (20-30 lines)
- Layered backgrounds: base color + gradient + SVG noise/grain + subtle pattern
- Warm off-whites: oklch(0.985 0.002 90) instead of #FFFFFF
- Colored shadows: `box-shadow: 0 8px 32px oklch(0.5 0.2 250 / 0.15)`
- Grain/noise overlays: `assets/svg/grain-overlay.svg` at 3-8% opacity
- Organic shapes: `border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%`
- Dot-grid/line patterns: `assets/svg/dot-grid.svg` for subtle texture
- Background blur: `backdrop-filter: blur(80px)` for glassmorphism
- Reference: `assets/svg/` directory for bundled texture resources

### Intentional Motion (20-30 lines)
- Page-load choreography: staggered reveal with `animation-delay` (50-100ms per element)
- Scroll-driven animation: CSS `scroll()` / `view()` timelines (no JS needed)
- Spring physics: not timed easings — every interactive element should feel physical
- Meaningful hover: `transform: translateY(-2px)` + `box-shadow` increase, not just opacity
- Exit animations: `AnimatePresence` in Motion, `@starting-style` in CSS
- Kinetic typography: text animation as hero content (GSAP SplitText or CSS)
- Reference: `references/animation-motion.md` for complete guidance

### 2025-2026 Counter-Trend: Hand-Made Aesthetic (15-20 lines)
- Hand-drawn illustrations as pushback against AI sterility
- Scribble accents, handwriting fonts (Caveat, Kalam) for annotations
- Intentional imperfections: slightly uneven spacing, organic shapes, non-grid layouts
- Rough.js for sketchy graphics (hand-drawn chart rendering)
- Custom cursors with character
- Collage-style compositions mixing photography, illustration, and typography
- This is specifically relevant for creative, education, and brand-forward domains

## Pre-Delivery Audit Protocol (the compact checklist)

Before delivering ANY visual output, the agent runs this audit:

1. ☐ Is the primary font distinctive? (NOT Inter/Roboto/Open Sans/Lato/Arial)
2. ☐ Is there dramatic type hierarchy? (≥2.5× ratio heading:body, weight contrast ≥300)
3. ☐ Are backgrounds warm/tinted? (NOT pure #FFFFFF or #000000)
4. ☐ Is the color palette cohesive? (1 dominant + 1 accent + neutrals from tokens)
5. ☐ Is the layout non-default? (NOT centered-hero → 3-col → testimonials)
6. ☐ Is there visual texture/atmosphere? (gradient, grain, pattern, shadow, or depth)
7. ☐ Is motion purposeful? (meaningful state transitions, not just decoration)
8. ☐ Does motion respect `prefers-reduced-motion`?
9. ☐ Does the design match the domain aesthetic? (from domain-map.json)
10. ☐ Are all interactive elements accessible? (contrast, target size, focus states, ARIA)
11. ☐ Is responsive design implemented? (fluid or container-query based)
12. ☐ Does content/copy have domain personality? (NOT generic SaaS phrases)
13. ☐ Would a designer say "this looks AI-generated"? (if yes, iterate)
14. ☐ Would a designer say "I'd refine this, not throw it out"? (if no, iterate)
15. ☐ Does the design tell a story? (visual hierarchy guides the eye through content)

If ANY check fails, the agent must fix it before delivering. Items 13-14 are the
meta-check: the agent should mentally "step back" and evaluate the gestalt.
```

### Validation criteria for anti-patterns.md
- [ ] File is ≥250 lines
- [ ] Contains "Why AI Output Converges" section with explanatory paragraphs
- [ ] Has ≥5 convergence categories (typography, color, layout, content, interaction)
- [ ] Each category has ≥4 specific anti-patterns
- [ ] Each category has detection heuristics and fix instructions
- [ ] Contains ≥4 counter-technique sections
- [ ] Each counter-technique has ≥5 concrete techniques with CSS/code examples
- [ ] Contains the 15-point Pre-Delivery Audit Protocol
- [ ] Cross-references other reference files and asset directories


---

## 2.6 AXES DEFAULTS AND CONFLICT RESOLUTION

When the user's request doesn't clearly map to a domain, the agent uses these defaults
from `axes_defaults` in `domain-map.json`.

### Default axes

```json
{
  "axes_defaults": {
    "serif_vs_sans": "sans",
    "dark_vs_light": "light",
    "density": "medium",
    "animation_intensity": "moderate",
    "border_radius": "8px",
    "formality": "professional"
  }
}
```

### Decision axis ranges

Each axis is a spectrum. The domain profile sets the position on each axis:

| Axis | Range | Domain Examples |
|---|---|---|
| **serif_vs_sans** | serif ←→ sans | media=serif, devtools=sans, ecommerce=serif-heading+sans-body |
| **dark_vs_light** | dark-default ←→ light-default | devtools=dark, government=light, creative=either |
| **density** | dense ←→ spacious | devtools=medium, government=spacious, fintech=medium |
| **animation_intensity** | none ←→ expressive | government=none, fintech=minimal, creative=expressive |
| **border_radius** | 0px (sharp) ←→ 20px+ (rounded) | government=0, ecommerce=0, education=16, healthcare=12 |
| **formality** | casual ←→ formal | education=casual, government=formal, creative=casual |

### Conflict resolution priority

When design decisions conflict, resolve in this order:

```
1. ACCESSIBILITY > everything
   (If a design choice fails contrast, target size, or ARIA requirements, it loses)

2. DOMAIN CONVENTIONS > personal preference
   (A fintech app should look like fintech, even if the agent "prefers" creative styles)

3. USER EXPLICIT REQUEST > domain conventions
   (If the user says "make it dark" for a government site, do it — but warn about accessibility)

4. AESTHETICS > novelty
   (Don't be weird for the sake of being different — be intentionally distinctive)

5. TRUST SIGNALS > visual flair
   (For fintech, healthcare, government: conservative choices that build trust beat flashy ones)

6. PERFORMANCE > visual complexity
   (If an animation will cause jank or slow loading, simplify it)

7. SIMPLICITY > complexity
   (When in doubt, do less but do it perfectly)
```

---

## 2.7 DOMAIN TOKEN JSON FILE SPEC

Each `assets/tokens/domain-tokens/{domain}.json` file must conform to this schema.
These files are OVERLAYS — they are merged on top of the base CSS custom properties
from `assets/css/color-tokens/`.

### Token file schema

```json
{
  "domain": "fintech",
  "aesthetic_label": "minimal-trust",
  
  "colors": {
    "light": {
      "--color-bg-primary": "oklch(0.985 0.003 250)",
      "--color-bg-secondary": "oklch(0.97 0.005 250)",
      "--color-bg-elevated": "oklch(1.0 0 0)",
      "--color-text-primary": "oklch(0.20 0.02 260)",
      "--color-text-secondary": "oklch(0.45 0.015 260)",
      "--color-text-heading": "oklch(0.15 0.03 260)",
      "--color-accent-primary": "oklch(0.50 0.18 260)",
      "--color-accent-secondary": "oklch(0.60 0.10 170)",
      "--color-border": "oklch(0.88 0.01 250)",
      "--color-error": "oklch(0.55 0.22 25)",
      "--color-success": "oklch(0.60 0.17 155)",
      "--color-warning": "oklch(0.70 0.15 80)"
    },
    "dark": {
      "--color-bg-primary": "oklch(0.13 0.015 260)",
      "--color-bg-secondary": "oklch(0.17 0.015 260)",
      "--color-bg-elevated": "oklch(0.22 0.015 260)",
      "--color-text-primary": "oklch(0.92 0.005 250)",
      "--color-text-secondary": "oklch(0.65 0.01 250)",
      "--color-text-heading": "oklch(0.95 0.003 250)",
      "--color-accent-primary": "oklch(0.65 0.18 260)",
      "--color-accent-secondary": "oklch(0.70 0.10 170)",
      "--color-border": "oklch(0.28 0.015 260)",
      "--color-error": "oklch(0.65 0.20 25)",
      "--color-success": "oklch(0.70 0.17 155)",
      "--color-warning": "oklch(0.78 0.15 80)"
    }
  },
  
  "typography": {
    "--font-heading": "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    "--font-body": "'Inter', 'Helvetica Neue', system-ui, sans-serif",
    "--font-mono": "'JetBrains Mono', 'SF Mono', monospace",
    "--font-weight-heading": "700",
    "--font-weight-body": "400",
    "--letter-spacing-heading": "-0.02em",
    "--line-height-body": "1.6",
    "--line-height-heading": "1.15"
  },
  
  "shape": {
    "--radius-sm": "6px",
    "--radius-md": "8px",
    "--radius-lg": "12px",
    "--radius-pill": "9999px"
  },
  
  "motion": {
    "--motion-intensity": "minimal",
    "--motion-duration-base": "200ms",
    "--motion-ease-default": "cubic-bezier(0.2, 0, 0, 1)"
  },
  
  "shadows": {
    "--shadow-sm": "0 1px 2px oklch(0.20 0.02 260 / 0.06)",
    "--shadow-md": "0 4px 12px oklch(0.20 0.02 260 / 0.08)",
    "--shadow-lg": "0 8px 24px oklch(0.20 0.02 260 / 0.12)"
  }
}
```

### Validation criteria for each domain token file
- [ ] Valid JSON
- [ ] Contains `domain` key matching the filename (without `.json`)
- [ ] `colors.light` has all 12 required color tokens
- [ ] `colors.dark` has all 12 required color tokens
- [ ] All color values are valid OKLCH strings
- [ ] `typography` has all 8 required font tokens
- [ ] `shape` has all 4 radius tokens
- [ ] `motion` has intensity, duration, and ease tokens
- [ ] `shadows` has sm, md, and lg definitions
- [ ] Color values match the domain profile specified in §2.2

### Future-proofing: DTCG format

The **Design Tokens Community Group (DTCG)** published its first stable specification in
October 2025, defining a standard JSON format for machine-readable design tokens. While
this skill uses a custom JSON schema optimized for simplicity, builders should be aware
that DTCG is the emerging interchange standard. A future version of these token files
could be converted to DTCG format for interoperability with tools like Figma Tokens,
Style Dictionary, and Specify. Key DTCG concepts: `$value` for the token value,
`$type` for semantic type (`color`, `dimension`, `fontFamily`, etc.), and `$description`
for documentation. Reference: https://tr.designtokens.org/format/

---

## 2.8 PART 2 VALIDATION CHECKLIST

Before Part 2 is considered complete, verify:

- [ ] domain-map.json schema is fully specified with all required keys documented
- [ ] All 8 domain profiles are completely specified (no empty/placeholder values)
- [ ] Each domain has: name, aesthetic_label, description, color_mood, BOTH light AND dark palettes, typography (all 10 keys), shape (all 4 radii), density, shadow_style, motion (all 5 keys), layout, max_width, grid, imagery (style + treatment), reference_files, token_file, exemplar_sites (≥3), anti_patterns (≥3)
- [ ] Signal keywords table has ≥15 keywords per domain
- [ ] Conflict resolution priority is defined (7 levels)
- [ ] Extensibility template contains all DomainProfile keys
- [ ] _extensibility.md content spec is defined
- [ ] Anti-patterns.md file spec includes: convergence explanation, ≥5 categories, counter-techniques, 15-point audit protocol
- [ ] Domain token JSON schema is fully specified with validation criteria
- [ ] Each domain's OKLCH color values are unique (not copy-pasted between domains)
- [ ] Typography choices are distinctive per domain (no two domains share the same heading font)
- [ ] Axes defaults are documented with ranges and domain examples

---

*End of Part 2. Continue to Part 3: All 16 Reference File Specifications.*

# anti-slop-design Skill Spec — Part 3 of 5
## All 16 Reference File Specifications

> **Reading order**: Part 1 (Architecture) → Part 2 (Decision Engine) → Part 3 (this) → Part 4 (Assets & Templates) → Part 5 (Validation & Build Order)
>
> **This part specifies**: Every `references/*.md` file — its purpose, required sections, minimum content depth, code snippet requirements, and validation criteria. Each reference file is what the agent reads on-demand when routed by the SKILL.md decision engine.

### Common structure for ALL reference files

Every reference file follows this skeleton:

```markdown
# [Title]

> When to read this file: [1-2 sentence trigger condition]
> Estimated reading: [line count] lines

## Recommended Tools (table format)
## Core Patterns (with code snippets)
## Anti-Patterns (domain-specific)
## Decision Criteria (when to choose X vs Y)
## Exemplar References (real-world sites/apps)
```

**Universal rules**:
- Every file must have ≥3 concrete code snippets (not pseudocode)
- Every file must have ≥3 named anti-patterns with "instead, do X" fixes
- Code snippets must be production-ready (not toy examples)
- Tool recommendations must include version numbers and status (stable/beta/deprecated)
- Each file should cross-reference related reference files where appropriate

---

## 3.1 REFERENCE: `_toc.md` — Table of Contents

**Purpose**: A reading guide that helps the agent (and human readers) navigate the reference files. Not a deep reference itself — just a directory.

**Required content**:

```markdown
# Reference Files — Table of Contents

## Foundation References (read for any output type)
| File | Focus | When to Read |
|---|---|---|
| `anti-patterns.md` | AI slop detection & avoidance | Before finalizing ANY visual output |
| `typography.md` | Font selection, pairing, fluid scales | When choosing fonts or building type hierarchy |
| `color-systems.md` | OKLCH palettes, dark mode, accessibility | When building color system or dark mode |
| `layout-spacing.md` | Grid systems, fluid design, density | When designing page/component layout |
| `accessibility.md` | WCAG 2.2, ARIA, EAA, preferences | For every output (skim), deep-read for complex UIs |
| `animation-motion.md` | Motion libraries, timing, performance | When adding animation or transitions |

## Platform References (read based on output type)
| File | Platform | When to Read |
|---|---|---|
| `web-react.md` | React/HTML web apps, SPAs, dashboards | Building React or vanilla web applications |
| `web-landing.md` | Landing pages, marketing, portfolios | Building single-page marketing/content sites |
| `web-artifacts.md` | Claude.ai React/HTML artifacts | Operating in claude.ai sandbox environment |
| `dataviz.md` | Charts, graphs, data dashboards | Any data visualization component |
| `mobile-native.md` | SwiftUI, Jetpack Compose, Flutter | Building native iOS/Android apps |
| `mobile-crossplatform.md` | React Native, KMP, Flutter cross | Building cross-platform mobile apps |
| `desktop.md` | Electron, Tauri, native desktop | Building desktop applications |
| `cli-terminal.md` | Terminal UIs, CLI tools | Building command-line interfaces |
| `pdf-print.md` | Typst, React-PDF, print design | Generating PDF reports or print layouts |
| `email.md` | React Email, MJML, HTML email | Building email templates |

## Reading Strategy
- **Always read**: `anti-patterns.md` (skim the checklist at minimum)
- **Usually read**: 1 platform reference + 1-2 foundation references
- **Never read all at once**: Maximum 3 reference files per task
```

**Validation**: File exists, contains both tables, lists all 16 reference files.
**Target length**: 40-60 lines.


---

## 3.2 REFERENCE: `web-react.md` — React/HTML Web Applications

**Purpose**: The primary reference for building React web applications, SPAs, and dashboards. Covers component libraries, state patterns, project structure, and React-specific anti-slop techniques.

**Target length**: 250-350 lines

### Required sections and content

#### Section: Recommended Component Libraries (table + guidance)

```markdown
## Component Libraries

| Library | Stars | Best For | Anti-Slop Risk | Notes |
|---|---|---|---|---|
| shadcn/ui | 66k+ | General UI, customizable | MEDIUM — must vary between 5 styles | Dec 2025: Vega, Nova, Maia, Lyra, Mira styles |
| Aceternity UI | — | Animated hero sections, 3D | LOW — inherently distinctive | Next.js + Tailwind + Framer Motion |
| Magic UI | — | Subtle animation components | LOW | Pairs with shadcn/ui |
| Mantine | 25k+ | Full-featured apps | MEDIUM — use custom theme | 100+ components, 50+ hooks, form mgmt |
| Tremor | — | Analytics dashboards | LOW — strong defaults | Best out-of-box dashboard aesthetic |
| Radix UI (headless) | — | Custom-styled primitives | NONE — you style everything | Foundation of shadcn/ui |
| Radix Themes | — | Full styled component system | LOW — customize via props | `<Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">` inline API. 30+ accent colors × 12-step scales. Good for rapid prototyping with design-system quality |
| Ark UI | — | Multi-framework headless | NONE | Zag.js powered, works in React/Vue/Solid |
| React Aria (Adobe) | — | Accessibility-first headless | NONE | Best i18n support |

### shadcn/ui style guide
CRITICAL: Never use shadcn/ui with default styling unchanged. Always:
1. Pick a base style (Vega/Nova/Maia/Lyra/Mira) appropriate to the domain
2. Override the color palette with domain tokens
3. Override the font family
4. Adjust border-radius to match domain profile
```

#### Section: Tailwind CSS v4 (configuration patterns)

Must cover:
- CSS-first configuration with `@theme` directive (no more tailwind.config.js)
- How to override the default palette entirely with OKLCH domain tokens
- Custom spacing/type scales using `@theme` blocks
- Container queries via `@container` utility classes
- The Tailwind "sameness" problem: avoiding the default aesthetic by customizing `@theme` values
- Code snippet: complete `@theme` block that applies a domain token set

#### Section: Modern CSS Techniques (production-ready)

Must cover these features with code examples:
- CSS nesting (production baseline)
- Container queries (`@container`)
- `:has()` selector (parent-of-match styling)
- `@layer` cascade layers (reset → base → components → utilities)
- Scroll-driven animations (`scroll()` and `view()` timelines)
- View Transitions API (SPA + MPA)
- `oklch()` color functions
- `@scope` for component encapsulation
- Anchor positioning for tooltips/popovers
- Native `popover` attribute

Code snippet requirement: one real-world example per feature, showing how it replaces
JavaScript or complex CSS hacks.

#### Section: React Patterns for Design Quality

Must cover:
- Design token propagation via CSS custom properties (NOT React context for colors)
- Theme switching (light/dark) via `data-theme` attribute on `<html>`, toggling CSS class
- Compound components pattern for flexible UI composition
- `asChild` polymorphic rendering (Radix pattern) for semantic HTML
- `forwardRef` for focus management in custom components
- Responsive design: prefer container queries over viewport media queries for components
- Code snippet: a complete themed Button component demonstrating token usage

#### Section: Project Structure

Must specify the recommended file organization for a new React project:

```
src/
├── styles/
│   ├── reset.css                  # From assets/css/modern-reset.css
│   ├── tokens.css                 # Merged: fluid scales + color tokens + motion tokens
│   └── global.css                 # App-specific global styles
├── components/
│   ├── ui/                        # shadcn/ui or custom primitives
│   └── [feature]/                 # Feature-specific compositions
├── lib/
│   └── utils.ts                   # cn() helper, token utilities
└── app/                           # Routes/pages
```

#### Section: Anti-Patterns (React-specific)

Must include ≥5 React-specific anti-patterns:
1. Inline styles for theming (use CSS custom properties instead)
2. Hardcoded color hex values scattered through JSX
3. `className="text-center mx-auto"` on everything (centered layout default)
4. Default shadcn/ui with zero customization
5. Missing `key` props causing animation glitches on lists
6. Using `React.memo` everywhere instead of fixing re-render causes
7. Client-side data fetching for initial page load (use SSR/RSC when available)

#### Section: Exemplar Implementations

List 3-5 open-source React projects with exceptional design quality, noting what
makes each distinctive. Include GitHub URLs or live demo links.

### Validation criteria for web-react.md
- [ ] ≥250 lines
- [ ] Component library table with ≥6 entries and anti-slop risk column
- [ ] shadcn/ui style guide section with all 5 style names
- [ ] Tailwind v4 `@theme` configuration code snippet
- [ ] ≥5 modern CSS features with real-world code examples
- [ ] React patterns section with themed component code snippet
- [ ] Project structure diagram
- [ ] ≥5 React-specific anti-patterns with fixes
- [ ] ≥3 exemplar implementation references


---

## 3.3 REFERENCE: `web-landing.md` — Landing Pages & Marketing Sites

**Purpose**: Specialized guidance for single-page or few-page marketing/content sites. Landing pages have unique design challenges: first impressions, scroll narrative, conversion optimization, and heavy animation.

**Target length**: 200-300 lines

### Required sections and content

#### Section: Layout Patterns (NOT the default hero template)

Must include ≥6 alternative layout compositions with ASCII diagrams:

1. **Editorial Asymmetric**: Full-width hero image on left (60%) + text right (40%), flowing into staggered content blocks
2. **Bento Grid**: Apple-style modular cells of varying sizes showcasing features
3. **Vertical Scroll Narrative**: Full-viewport sections with scroll-snap, each telling a chapter of the story
4. **Split Contrast**: Alternating light/dark full-width sections with content offset left/right
5. **Magazine Column**: Multi-column CSS Grid with sidebar callouts and pull quotes
6. **Diagonal Flow**: Sections connected by diagonal clip-path transitions

For each pattern, provide:
- ASCII layout diagram (grid lines + content areas)
- CSS Grid code snippet
- Best-fit domains (which domains from domain-map.json suit this layout)
- Scroll behavior notes

#### Section: Hero Section Variants

Must include ≥5 hero patterns that are NOT "centered heading + subtitle + CTA button":

1. **Split Hero**: Image/video left, text right (or reversed)
2. **Full-Bleed Video/Image**: Background media with overlaid text (must pass contrast)
3. **Interactive Hero**: Three.js scene, particle effect, or animated canvas behind text
4. **Text-Only Kinetic**: Oversized animated typography as the entire hero (no image)
5. **Product Screenshot Hero**: App screenshot at scale with floating UI element accents
6. **Scroll-Reveal Hero**: Minimal initial state that transforms as user scrolls

Code snippet requirement: at least 2 heroes implemented as complete HTML/CSS blocks.

#### Section: Conversion-Oriented Design Patterns

Must cover:
- CTA placement science: above the fold, repeated at natural decision points, NOT just bottom
- Social proof patterns: logos (with grayscale + hover color), testimonial cards, metric counters
- Pricing table design: highlight recommended tier, use domain tokens for accent
- Trust signals by domain: what works in fintech (security badges) vs education (student count) vs creative (award logos)
- Form design: progressive disclosure, single-field-per-step, inline validation

#### Section: Performance for Landing Pages

Must cover:
- Above-the-fold CSS inlining strategy
- Image optimization: WebP/AVIF with `<picture>` element fallbacks
- Font subsetting for headline fonts (only used characters)
- Lazy loading: `loading="lazy"` for below-fold images, IntersectionObserver for animations
- Core Web Vitals targets: LCP <2.5s, INP <200ms, CLS <0.1

#### Section: Anti-Patterns (landing-page-specific)

≥5 anti-patterns:
1. Hero → 3-col features → testimonials → CTA (the template)
2. Generic stock photography for hero
3. "Trusted by 10,000+ companies" without real logos or specifics
4. Carousel/slider for testimonials (low engagement, accessibility issues)
5. Fixed sticky CTAs that obscure content on mobile
6. Cookie banners that block 30% of the viewport
7. "Get Started Free" as the only CTA text variant on the entire page

### Validation criteria for web-landing.md
- [ ] ≥200 lines
- [ ] ≥6 layout patterns with ASCII diagrams and CSS snippets
- [ ] ≥5 hero variants with descriptions
- [ ] ≥2 complete hero HTML/CSS code snippets
- [ ] Conversion patterns section with CTA, social proof, pricing guidance
- [ ] Performance section with Core Web Vitals targets
- [ ] ≥5 landing-page-specific anti-patterns

---

## 3.4 REFERENCE: `web-artifacts.md` — Claude.ai Artifacts

**Purpose**: Specialized guidance for building React/HTML artifacts within the claude.ai sandbox environment. Covers the unique constraints (single-file, no filesystem, limited libraries) and how to achieve distinctive design within them.

**Target length**: 150-250 lines

### Required sections and content

#### Section: Environment Constraints

Must document:
- Single-file output (everything in one .jsx or .html file)
- Available libraries: `lucide-react`, `recharts`, `d3`, `Three.js` (r128), `Plotly`, `shadcn/ui`, `Chart.js`, `Tone.js`, `Papaparse`, `SheetJS`, `mammoth`, `tensorflow`
- Available styling: Tailwind core utilities (pre-defined classes, no compiler), inline `<style>` blocks
- NO localStorage/sessionStorage (use `window.storage` API for persistence)
- NO `<form>` tags in React artifacts
- Font loading: Google Fonts CDN `<link>` only
- External scripts: `https://cdnjs.cloudflare.com` only

#### Section: Inlining Strategy

Must provide a clear template showing how to inline all foundational CSS:

```jsx
// Template structure for distinctive claude.ai artifacts
const styles = `
  /* === RESET (from modern-reset.css, condensed) === */
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
  
  /* === FLUID TYPE SCALE (from fluid-type-scale.css) === */
  :root {
    --step--2: clamp(0.69rem, 0.66rem + 0.18vw, 0.80rem);
    --step--1: clamp(0.83rem, 0.78rem + 0.25vw, 1.00rem);
    /* ... full scale ... */
  }
  
  /* === DOMAIN TOKENS (from domain-tokens/{domain}.json) === */
  :root {
    --color-bg-primary: oklch(0.985 0.003 250);
    /* ... all tokens ... */
  }
  
  /* === MOTION TOKENS === */
  :root {
    --motion-duration-fast: 160ms;
    --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    /* ... */
  }
`;
```

#### Section: Maximizing Quality in Single-File Constraints

Must cover:
- Using Tailwind utilities for layout + custom `<style>` for distinctive design
- Embedding SVG textures inline for atmosphere (grain, noise as `<svg>` in JSX)
- Font loading: `<link>` in component head or via `useEffect` DOM injection
- Dark mode: Tailwind `dark:` variants + state toggle (no `prefers-color-scheme` in artifacts)
- Animation: CSS animations in `<style>` block + Tailwind animation utilities
- shadcn/ui components: available via import, must customize with inline theme overrides
- Code snippet: a complete artifact demonstrating all techniques combined

#### Section: When to Escalate to web-artifacts-builder

Clear decision criteria for when the simpler single-file approach isn't enough:
- Multiple routes/pages needed → use web-artifacts-builder
- Complex state management → consider web-artifacts-builder
- Heavy TypeScript usage → web-artifacts-builder adds TS support
- >500 lines of logic → web-artifacts-builder for maintainability
- Simple showcase/demo → stay single-file with this skill

#### Section: Anti-Patterns (artifact-specific)

≥4 anti-patterns:
1. Pure Tailwind with zero custom CSS (looks like every other Tailwind artifact)
2. Ignoring font loading (falling back to system fonts = generic)
3. White background + blue accent + centered layout (the claude.ai default look)
4. Not using `window.storage` when persistence would improve UX
5. Giant monolithic component without decomposition into sub-components

### Validation criteria for web-artifacts.md
- [ ] ≥150 lines
- [ ] Complete environment constraints table
- [ ] Inlining strategy with code template
- [ ] Quality maximization section with ≥5 techniques
- [ ] Complete example artifact code snippet
- [ ] Escalation decision criteria for web-artifacts-builder
- [ ] ≥4 artifact-specific anti-patterns


---

## 3.5 REFERENCE: `dataviz.md` — Data Visualization

**Purpose**: Comprehensive guidance for charts, dashboards, infographics, and scrollytelling. Covers library selection, anti-default styling, color for data, and narrative visualization techniques.

**Target length**: 250-350 lines

### Required sections and content

#### Section: Library Selection Matrix

```markdown
## Library Selection

| Need | Library | Why | Anti-Slop Risk |
|---|---|---|---|
| React dashboard standard charts | Recharts | 80% of D3 power in 1/10th code, shadcn charts built on it | HIGH — must override ALL defaults |
| Beautiful defaults | Nivo | 9/10 aesthetics out of box | MEDIUM — still customize colors |
| Maximum custom control | visx (Airbnb) | D3 power with React patterns | LOW — you build everything |
| Large datasets (1M+ points) | Apache ECharts | Canvas-based, 10× faster than SVG | MEDIUM |
| Performance-critical streaming | uPlot | Fastest: 166K pts in 25ms, 60fps | LOW — minimal styling |
| Scientific/academic | Plotly.js 6.0 | Violin plots, 3D, statistical | MEDIUM |
| Next.js + shadcn ecosystem | shadcn/ui Charts | Tailwind-styled Recharts | HIGH — same as Recharts |
| Scrollytelling | Scrollama + D3 | IntersectionObserver step triggers | LOW |
| Complex timeline animation | GSAP ScrollTrigger + D3 | Scrubbed animations on scroll | LOW |

### Decision: "Which library should I use?"
- Building a DASHBOARD with standard charts? → Recharts (or Nivo for prettier defaults)
- Need ONE impressive custom chart? → visx or raw D3
- Streaming real-time data? → uPlot
- Scientific/statistical audience? → Plotly
- Telling a data STORY? → Scrollama + D3
- Claude.ai artifact? → Recharts (available) or Chart.js (available)
```

#### Section: Anti-Default Chart Styling (THE most important section)

Must cover the NYT Graphics team approach with code:

```markdown
## Anti-Default Chart Styling

Every chart library ships with defaults that scream "I didn't design this." Override ALL of these:

### 1. Color Palette (NEVER use library defaults)
- Use Viz Palette (Susie Lu) to test for colorblind safety
- Domain token palette as source: accent_primary for hero data, muted for secondary
- Maximum 5-6 colors in a single chart (beyond that, use small multiples)
- Code snippet: Recharts custom color array from domain tokens

### 2. Typography in Charts
- Chart titles: use the domain heading font, not default sans
- Axis labels: domain body font at --step--1 size
- Data labels: domain mono font for numerical values
- Code snippet: Recharts with custom font via `tick` component

### 3. Declarative Titles
- BAD: "Sales Over Time"
- GOOD: "Q3 Sales Surged 15% After Campaign Launch"
- Title should state the FINDING, not describe the chart type

### 4. Annotation Over Legend
- Place labels directly on data (line endpoints, bar tops)
- Use annotations to highlight key data points or events
- Only use legends when direct labeling is impractical (>4 series)
- Code snippet: Recharts ReferenceLine + custom label for annotation

### 5. Remove Chart Junk (Tufte)
- Remove: default gridlines, chart borders, unnecessary tick marks, background colors
- Keep: essential axis lines, data labels, subtle dotted gridlines if needed
- Code snippet: Recharts with stripped gridlines and custom axis styling

### 6. Highlight + Mute Pattern
- One bold color for the story, everything else gray (#C0C0C0)
- The eye immediately finds the narrative
- Code snippet: conditional color assignment based on highlight criteria
```

#### Section: Dashboard Composition

Must cover:
- Card hierarchy: one hero metric card (large) + supporting cards (small)
- Chart type selection: line for trends, bar for comparison, area for volume, donut for proportions
- Sparklines for compact trend indication in metric cards
- Real-time data patterns: WebSocket connection + optimistic UI + skeleton loading
- Dashboard layout: header metrics → hero chart → supporting charts → table
- Responsive: charts must resize fluidly, not break at breakpoints

#### Section: Scrollytelling Patterns

Must cover:
- Scrollama setup: step-enter triggers drive chart transitions
- Data-driven narrative: one chart transforms as user scrolls through sections
- Progressive reveal: data points appear as narrative context is provided
- Annotation layers: text overlays on charts tied to scroll position
- The Pudding as reference (Svelte + D3, but patterns apply to React + D3)
- Performance: use `IntersectionObserver` threshold, not scroll events

#### Section: Anti-Patterns (dataviz-specific)

≥6 anti-patterns:
1. Library default colors (Recharts blue, Nivo purples)
2. "Sales Over Time" descriptive titles instead of declarative findings
3. Legends instead of direct data labels
4. 3D effects on charts (never appropriate except actual 3D data)
5. Pie charts for more than 5 categories
6. Y-axis not starting at zero for bar charts (misleading)
7. Rainbow color schemes (not colorblind-safe)
8. Axis labels rotated 90° (unreadable — use horizontal bars instead)

### Validation criteria for dataviz.md
- [ ] ≥250 lines
- [ ] Library selection matrix with ≥8 entries and decision guide
- [ ] Anti-default styling section with ≥6 override techniques and code snippets
- [ ] Dashboard composition patterns
- [ ] Scrollytelling section with Scrollama patterns
- [ ] ≥6 dataviz-specific anti-patterns
- [ ] Recharts code snippets showing custom styling (not defaults)

---

## 3.6 REFERENCE: `mobile-native.md` — Native iOS & Android

**Purpose**: Design guidance for native mobile apps using SwiftUI (iOS) and Jetpack Compose (Android). Covers platform conventions, custom theming, animation APIs, and how to break out of default platform templates.

**Target length**: 250-350 lines

### Required sections and content

#### Section: SwiftUI (iOS 26+)

Must cover:

**Custom Design Token Architecture**:
```swift
// Colors.swift — domain token system for SwiftUI
import SwiftUI

struct AppColors {
    // Semantic tokens mapped from domain profile
    static let bgPrimary = Color(oklch: (0.985, 0.003, 250))  // or Color("bgPrimary")
    static let accentPrimary = Color(oklch: (0.50, 0.18, 260))
    // ... all 12 tokens
    
    // Usage: never use Color.blue, Color.red directly
    // Always: AppColors.accentPrimary
}
```

**Typography System**:
```swift
// Typography.swift
struct AppTypography {
    static let headingFont = Font.custom("PlusJakartaSans-Bold", size: 28)
    static let bodyFont = Font.custom("PlusJakartaSans-Regular", size: 16)
    // Fluid scaling via @ScaledMetric or dynamic type integration
}
```

**Animation APIs**:
- `withAnimation(.spring(response: 0.35, dampingFraction: 0.7))` — spring-first (Apple HIG)
- `PhaseAnimator` for multi-step sequential animations (shimmer, breathing)
- `KeyframeAnimator` for multi-track timeline-based keyframe animations
- `matchedGeometryEffect` for shared element transitions between views
- Code snippet: a complete view with spring-based list item appearance animation

**Liquid Glass (iOS 26)**:
- New material system for translucent surfaces
- `NavigationStack` and `TabView` updates for new visual language
- How to maintain brand identity within the Liquid Glass framework
- When to embrace vs override system materials

**Breaking the Template**:
- Custom `NavigationBar` instead of default
- Custom `TabBar` designs (floating, minimal, hidden-on-scroll)
- Full-bleed content under navigation (ignoring safe areas intentionally)
- Custom transitions between views (not just default push/pop)
- Haptic feedback integration: `UIImpactFeedbackGenerator` for tactile design

#### Section: Jetpack Compose (Material3 1.4.0+)

Must cover:

**Custom MaterialTheme Override**:
```kotlin
// Theme.kt — never use default Material3 colors
@Composable
fun AppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Color(0xFF2B4ACB),       // From domain tokens
            surface = Color(0xFFF8F9FC),
            onSurface = Color(0xFF0F1729),
            // ... all semantic colors mapped from domain profile
        ),
        typography = Typography(
            headlineLarge = TextStyle(
                fontFamily = FontFamily(Font(R.font.plus_jakarta_sans_bold)),
                fontWeight = FontWeight.Bold,
                fontSize = 28.sp,
                letterSpacing = (-0.02).em
            ),
            // ... complete type scale
        ),
        shapes = Shapes(
            small = RoundedCornerShape(6.dp),   // From domain profile
            medium = RoundedCornerShape(8.dp),
            large = RoundedCornerShape(12.dp)
        ),
        content = content
    )
}
```

**Compose Animation**:
- `MotionScheme` (M3 1.4.0) for consistent component animations
- `SharedTransitionLayout` for shared element transitions
- `AnimatedVisibility` with custom `EnterTransition`/`ExitTransition`
- `updateTransition` for multi-property state-driven animation
- Code snippet: a card expand/collapse with shared element animation

**Compose Multiplatform (1.8.0+)**:
- iOS target now stable and production-ready
- Used by: Netflix, McDonald's, Cash App, Duolingo
- Shared UI code with platform-specific adaptations
- When to use CMP vs native per-platform

#### Section: Flutter (3.41.2+)

Must cover:
- Impeller rendering engine: 30-50% jank reduction, zero shader compilation stutters
- Custom `ThemeExtension` for brand-specific tokens beyond Material
- Rive for interactive animations with state machines (vs Lottie for simple playback)
- `CustomPainter` for bespoke visual elements
- Code snippet: complete `ThemeData` with custom extensions

#### Section: Platform-Appropriate Behavior

Must include decision table:
| Behavior | iOS Convention | Android Convention | Recommendation |
|---|---|---|---|
| Back navigation | Swipe from left edge | System back button/gesture | Follow platform |
| Pull to refresh | UIRefreshControl | SwipeRefresh | Follow platform |
| Bottom sheet | `.sheet()` modifier | BottomSheetScaffold | Follow platform |
| Haptics | UIFeedbackGenerator | HapticFeedbackType | Always include |
| Tab bar position | Bottom | Bottom (Material 3) | Bottom on both |
| Typography | SF Pro (system) | Roboto (system) | Custom font + system fallback |

#### Section: Anti-Patterns (mobile-native-specific)

≥5 anti-patterns:
1. Using default Material/Cupertino theme without customization
2. Ignoring safe areas (notch, home indicator, camera cutout)
3. Small tap targets (<44pt iOS / <48dp Android)
4. Missing haptic feedback on meaningful interactions
5. Desktop-style hover effects that don't work on touch
6. Not testing on actual devices (simulator != real performance)
7. Ignoring Dynamic Type / font scaling preferences

### Validation criteria for mobile-native.md
- [ ] ≥250 lines
- [ ] SwiftUI section with: token architecture, typography system, ≥3 animation APIs, Liquid Glass notes
- [ ] Jetpack Compose section with: full theme override code, animation patterns, CMP notes
- [ ] Flutter section with: Impeller notes, ThemeExtension, Rive mention
- [ ] Platform behavior comparison table
- [ ] ≥5 mobile-native anti-patterns


---

## 3.7 REFERENCE: `mobile-crossplatform.md` — Cross-Platform Mobile

**Purpose**: Guidance for building mobile apps that target both iOS and Android from a single codebase. Covers React Native, Kotlin Multiplatform, and Flutter cross-platform strategies, with emphasis on avoiding the "cross-platform uncanny valley."

**Target length**: 200-280 lines

### Required sections and content

#### Section: Framework Selection

| Framework | Best For | Tradeoffs | Anti-Slop Risk |
|---|---|---|---|
| React Native + NativeWind | Teams with web React expertise | Bridge overhead, large binary | HIGH — easy to look "not quite native" |
| Flutter | Maximum UI control, custom design | Dart ecosystem, large binary | LOW — everything is custom |
| Kotlin Multiplatform (CMP) | Shared logic + native UI per platform | Newer, smaller ecosystem | LOW — native UI layer |

#### Section: React Native Design Excellence

Must cover:

**NativeWind v4 (Tailwind for RN)**:
- Compiles Tailwind classes to native StyleSheet at build time (zero runtime overhead)
- How to customize with domain tokens via `tailwind.config.js` theme overrides
- Code snippet: NativeWind component with custom theme applied

**Avoiding the "Uncanny Valley"**:
- Use `@react-navigation/native-stack` (NOT JS-based stack navigator)
- Use `react-native-bottom-tabs` for native tab bars (not custom JS tabs)
- `Platform.select()` for platform-specific styling differences
- Implement proper haptic feedback via `react-native-haptic-feedback`
- Avoid web patterns: no hover states, no tooltips, no right-click menus
- Code snippet: platform-adaptive component using `Platform.select()`

**React Native Reanimated 4.x**:
- Shared element transitions between screens
- Worklet-based animations on UI thread (no JS bridge overhead)
- `useAnimatedStyle` for gesture-driven animations
- Spring configs matching domain motion profile
- Code snippet: pull-to-refresh with custom spring animation

**Tamagui**:
- Universal styling with optimizing compiler
- ~10% overhead vs vanilla RN StyleSheet
- Cross-platform with web support
- When to choose Tamagui vs NativeWind

#### Section: Flutter Cross-Platform Strategy

Must cover:
- Impeller on both iOS and Android
- Platform-adaptive widgets (`Platform.isIOS` checks for system-appropriate behavior)
- Custom design system via `ThemeExtension` (not relying on Material defaults)
- Rive for cross-platform animations with state machines
- go_router for declarative navigation
- Code snippet: platform-adaptive scaffold

#### Section: Cross-Platform Design Strategy

Three approaches with when to use each:

| Strategy | Description | Example | When |
|---|---|---|---|
| Platform-native | Follow HIG on iOS, Material on Android exactly | Settings apps | Utility apps, system integration |
| Brand-consistent | Identical design everywhere | Spotify, Instagram | Strong brand, entertainment/social |
| Mixed (recommended) | Brand fonts/colors + platform interaction patterns | Airbnb, Facebook | Most apps |

For the mixed approach, specify what should be consistent vs platform-specific:
- **Consistent**: colors, fonts, brand elements, content layout, iconography
- **Platform-specific**: navigation patterns, system sheets/dialogs, haptic patterns, gesture behavior, status bar treatment

#### Section: Anti-Patterns (cross-platform-specific)

≥5 anti-patterns:
1. JS-based navigation stack instead of native (janky transitions)
2. Custom tab bar that doesn't feel native on either platform
3. Web-style layouts without respecting mobile density/touch targets
4. Ignoring platform-specific safe areas, keyboard handling
5. Same animation timing on iOS and Android (iOS prefers springs, Android prefers ease curves)
6. Not handling notch/camera cutout/dynamic island

### Validation criteria for mobile-crossplatform.md
- [ ] ≥200 lines
- [ ] Framework selection comparison table
- [ ] React Native section with NativeWind, uncanny valley avoidance, Reanimated code
- [ ] Flutter cross-platform section
- [ ] Design strategy table (3 approaches)
- [ ] Mixed approach specifics (consistent vs platform-specific)
- [ ] ≥5 cross-platform anti-patterns

---

## 3.8 REFERENCE: `desktop.md` — Desktop Applications

**Purpose**: Guidance for Electron and Tauri desktop apps, plus notes on native desktop (WinUI, AppKit). Focus on making web-tech desktop apps feel native and performant.

**Target length**: 180-260 lines

### Required sections and content

#### Section: Electron Best Practices

Must cover:

**Making Electron Feel Native**:
- Custom title bar: `titleBarStyle: 'hiddenInset'` on macOS, `frame: false` + custom titlebar on Windows
- Traffic lights positioning (macOS): `titleBarOverlay` with proper inset
- Window management: remember position/size, support multi-monitor
- System tray integration
- Code snippet: BrowserWindow config for native-feeling macOS app

**Performance**:
- Pre-warm the renderer (hidden window at startup)
- Local SQLite for data (not remote DB for every read)
- `ipcRenderer.invoke()` (async) — NEVER `sendSync()` (blocks renderer)
- Optimistic updates: update UI immediately, sync with backend async
- Aggressive code splitting: only load visible panels

**Design Patterns**:
- Command palette (⌘K / Ctrl+K): now expected in every desktop app
- Sidebar navigation with collapsible sections
- Multi-pane layouts (email: list + preview, IDE: tree + editor + terminal)
- Keyboard-first: every action should have a shortcut
- Code snippet: command palette component with fuzzy search

#### Section: Tauri 2.0

Must cover:
- Rust backend + system WebView (vs Electron's bundled Chromium)
- Binary size: <10MB vs Electron's 100MB+
- Memory: 30-40MB idle vs Electron's hundreds
- Startup: <0.5s
- ACL-based permission system for security
- Mobile targets (iOS/Android) now supported
- Tradeoffs: system WebView inconsistencies, smaller ecosystem
- When to choose Tauri vs Electron: new project with size constraints → Tauri; existing Electron codebase or needing Chromium consistency → Electron

#### Section: Native Desktop Notes

Brief guidance for native desktop (when the user specifically requests it):
- macOS: SwiftUI for modern, AppKit for legacy/complex. Sonoma+ design language
- Windows: WinUI 3 for modern Windows apps, WPF for legacy
- Linux: GTK 4 with libadwaita for GNOME integration
- .NET MAUI for cross-platform desktop

Each should note: "For deep native guidance, the agent should research platform-specific documentation. This skill provides aesthetic direction, not native API deep-dives."

#### Section: Desktop-Specific Design Principles

Must cover:
- Information density: desktop users expect MORE density than mobile
- Hover states: essential on desktop (not optional like mobile)
- Context menus: right-click menus with keyboard shortcuts listed
- Drag and drop: native-feeling with proper cursor feedback
- Focus management: tab order, focus rings, keyboard navigation
- Multi-window: support detachable panels, popout windows

#### Section: Anti-Patterns (desktop-specific)

≥5 anti-patterns:
1. Web-style responsive layout that wastes desktop screen space
2. Missing keyboard shortcuts
3. No command palette / spotlight search
4. Electron apps that feel like websites (no title bar integration, no system tray)
5. Ignoring OS-level dark mode preference
6. Slow startup (>2s to interactive)
7. Missing drag-and-drop for file operations

### Validation criteria for desktop.md
- [ ] ≥180 lines
- [ ] Electron section with: native feel patterns, performance tips, command palette code
- [ ] Tauri section with: comparison metrics, ACL system, decision criteria
- [ ] Native desktop notes (macOS, Windows, Linux)
- [ ] Desktop design principles section
- [ ] ≥5 desktop-specific anti-patterns


---

## 3.9 REFERENCE: `cli-terminal.md` — CLI & Terminal UIs

**Purpose**: Guidance for building beautiful terminal interfaces and CLI tools. Covers framework selection, ASCII/Unicode art, color systems in terminals, and interaction patterns.

**Target length**: 180-260 lines

### Required sections and content

#### Section: Framework Selection

| Language | Framework | Description | Best For |
|---|---|---|---|
| Go | Bubble Tea (Charm) | Elm Architecture for terminals. Rich ecosystem: Lip Gloss (styling), Bubbles (components), Huh (forms), Gum (scripting) | Production CLI tools, complex TUIs |
| Rust | Ratatui | Sub-millisecond rendering, constraint-based Flexbox layouts | Performance-critical, dashboards |
| Python | Textual | CSS-like `.tcss` stylesheets, runs in terminal AND web browser | Python dev tools, rapid prototyping |
| Python | Rich | Beautiful output (tables, progress, markdown, syntax highlighting) | Simple CLI output formatting |
| JS/TS | Clack (@clack/prompts) | Modern interactive prompts, 5.6M weekly downloads, 80% smaller than alternatives | Node CLI tools, interactive setup wizards |
| JS/TS | Ink | React components rendered to terminal via Yoga Flexbox | Complex TUI with React patterns |

Include: "Used by" notable projects for credibility (Netflix uses Ratatui, Gatsby uses Ink, etc.)

#### Section: Terminal Color Systems

Must cover:
- 16-color ANSI (universal support): map domain accent to nearest ANSI color
- 256-color: extended palette, good middle ground
- Truecolor (24-bit): full RGB support in modern terminals
- Detection: check `$COLORTERM` and `$TERM` for capability
- Color libraries: `picocolors` (7KB, fastest, Node), `ansis` (5.9KB, 256+truecolor), Lip Gloss (Go), `crossterm` (Rust)
- Domain token mapping: translate OKLCH domain tokens to nearest terminal colors
- Code snippet: adaptive color scheme that degrades gracefully across terminal capabilities

#### Section: Unicode Design Patterns

Must cover:
- Box-drawing characters: rounded corners `╭─╮│╰─╯`, double line `╔═╗║╚═╝`
- Braille spinner frames: `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` (smooth 10-frame rotation)
- Progress bars: `█░` or `━╺` or custom blocks
- Status indicators: `✓` success (green), `✗` error (red), `⚠` warning (yellow), `●` dot, `◐` partial
- Table formatting: column alignment, header separators, truncation with ellipsis
- Tree rendering: `├──`, `└──`, `│  ` for filesystem/hierarchy display
- Code snippet: a styled output block using box-drawing + color

#### Section: Interaction Patterns

Must cover:
- Prompts: single-select, multi-select, text input, confirmation, password
- Progressive disclosure: reveal advanced options only when requested
- Live updating: real-time progress, streaming output, log tailing
- Keyboard shortcuts: display in consistent format (`^C`, `⌘Q`, `←→`)
- Error display: red text + icon + helpful suggestion (not just stack traces)
- Help screens: consistent format with grouped commands, examples

#### Section: CLI Design Principles

- First 3 seconds matter: show something useful immediately
- Progressive complexity: simple by default, flags/options for power users
- Color is information, not decoration: green=success, red=error, yellow=warning, blue=info
- Respect `NO_COLOR` environment variable (standard for disabling color output)
- Respect terminal width: wrap or truncate gracefully
- Piping support: detect `stdout.isTTY` and disable color/formatting when piped

#### Section: Anti-Patterns (CLI-specific)

≥5 anti-patterns:
1. Wall of text output without visual hierarchy
2. Requiring flags for basic operations (should work with zero args)
3. Missing `--help` or unhelpful help text
4. Spinners that don't indicate what's happening
5. Ignoring `NO_COLOR` standard
6. Non-zero exit codes for success
7. Prompts that don't support piped input

### Validation criteria for cli-terminal.md
- [ ] ≥180 lines
- [ ] Framework selection table with ≥6 entries
- [ ] Terminal color systems with degradation strategy
- [ ] Unicode design patterns with character examples
- [ ] Interaction patterns section
- [ ] CLI design principles
- [ ] ≥5 CLI-specific anti-patterns

---

## 3.10 REFERENCE: `pdf-print.md` — PDF & Print Design

**Purpose**: Guidance for generating PDF documents and print-optimized layouts. Covers Typst (recommended), React-PDF, WeasyPrint, and print design principles that differ from screen design.

**Target length**: 180-260 lines

### Required sections and content

#### Section: Tool Selection

| Tool | Language | Best For | Quality | Speed |
|---|---|---|---|---|
| Typst (v0.14.2) | Typst markup | Reports, papers, documents | Excellent | 27× faster than XeLaTeX |
| React-PDF (@react-pdf/renderer v4.3.x) | React/JSX | Invoices, reports from React apps | Good | Fast |
| WeasyPrint | HTML/CSS → PDF | HTML-first document generation | Good | Medium |
| Prince XML | HTML/CSS → PDF | Highest-quality HTML→PDF (commercial) | Excellent | Fast |
| LaTeX | TeX | Academic papers, math-heavy docs | Excellent | Slow |

**Decision**: Typst for new documents, React-PDF for React app integrations, WeasyPrint for HTML-template-based generation.

#### Section: Typst Deep Dive

Must cover:
- Typst syntax: everything is a function call with clear mental model
- Document structure: `#set`, `#show`, `#let` for configuration
- Custom styling: fonts, colors, page layout, headers/footers
- PDF/A accessibility compliance (built-in)
- 1,100+ community packages (Typst Universe)
- Code snippet: complete professional report template with:
  - Custom fonts (loaded from file or bundled)
  - Color scheme from domain tokens (adapted to print)
  - Page header/footer with page numbers
  - Table of contents
  - Styled heading hierarchy
  - Table with alternating row colors

#### Section: React-PDF Patterns

Must cover:
- Flexbox-based layout system (like React Native)
- Font registration for custom fonts
- Dynamic data injection from props
- Conditional page breaks
- Code snippet: invoice template with domain-appropriate styling

#### Section: Print Design Principles (differ from screen)

Must cover:
- **Color space**: CMYK for professional print, RGB for digital PDF (most common use case)
- **Typography for print**: serif body text (more readable in print), tighter line-height (1.4 vs 1.6 for screen), 10-12pt body text
- **Margins**: generous (≥20mm) for readability and binding
- **Grid**: traditional typographic grid, not CSS Grid
- **Images**: 300 DPI for print, 72-150 DPI for digital PDF
- **Headers/footers**: page numbers, document title, section names
- **Widows and orphans**: control paragraph breaks (Typst and CSS both support `orphans: 2; widows: 2`)
- **Color for print**: use LESS color than screen — print is expensive, and dense color can reduce readability

#### Section: Anti-Patterns (PDF/print-specific)

≥4 anti-patterns:
1. Screen-optimized design sent to print (huge margins wasted, low DPI images)
2. Body text in sans-serif for long-form print documents
3. Full-bleed color backgrounds on every page (expensive, slow to print)
4. Missing page numbers and headers
5. No table of contents for documents >5 pages
6. Ignoring PDF/A accessibility requirements

### Validation criteria for pdf-print.md
- [ ] ≥180 lines
- [ ] Tool selection table with ≥5 options
- [ ] Typst section with complete report template code
- [ ] React-PDF section with invoice code snippet
- [ ] Print design principles (≥7 principles that differ from screen)
- [ ] ≥4 PDF/print anti-patterns

---

## 3.11 REFERENCE: `email.md` — Email Templates

**Purpose**: Guidance for building email templates that render correctly across the fragmented email client landscape. Covers React Email, MJML, dark mode, and the critical Outlook compatibility challenge.

**Target length**: 180-260 lines

### Required sections and content

#### Section: The Email Landscape (2025-2026)

Must document the rendering engine reality:
- **Apple Mail** (48-53% market share): supports nearly everything (CSS Grid, flexbox, web fonts)
- **Gmail** (web + app): strips `<style>` tags, requires inline styles, ignores media queries in some contexts
- **Classic Outlook** (Word rendering engine): table-based layout ONLY, no flexbox, no border-radius, no modern CSS. Still in use until October 2026 end-of-support
- **New Outlook** (Chromium-based): supports modern CSS but doesn't support MSO conditional comments
- **Must code for BOTH Outlooks simultaneously** until late 2026

#### Section: Framework Selection

| Framework | Approach | Best For |
|---|---|---|
| React Email (v5.0, 920K+ weekly) | React components → HTML | Developer teams, complex templates |
| MJML | Custom markup → responsive HTML | Most cross-client safe, established |
| Maizzle | Tailwind CSS → inline HTML | Tailwind-familiar teams |

**Decision**: React Email for new projects (modern DX, dark mode switcher, spam score checker). MJML if maximum cross-client compatibility is paramount.

#### Section: Coding Patterns

Must cover:

**Table-Based Layout** (still required for Outlook):
```html
<!-- Outer container: 600px max width, centered -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="padding: 24px; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;">
      <!-- Content here -->
    </td>
  </tr>
</table>
```

**Hybrid/Ghost Tables** (modern email technique):
- Use `<div>` for modern clients with `display: block` and `max-width`
- Wrap in MSO conditional `<!--[if mso]>` table fallback
- Code snippet: complete hybrid layout block

**Dark Mode Handling**:
- Add `<meta name="color-scheme" content="light dark">` for Apple Mail
- Add `<meta name="supported-color-schemes" content="light dark">` for some clients
- Use off-whites (#FAFAFA not #FFFFFF) and dark grays (#222222 not #000000) — pure values trigger aggressive auto-inversion
- Gmail iOS inverts everything automatically with zero developer control
- Code snippet: dark mode-safe color system with `@media (prefers-color-scheme: dark)` and fallbacks

#### Section: Email-Specific Typography

Must cover:
- System font stacks ONLY (web fonts render in Apple Mail only, 48-53% → worth it for some brands)
- Apple system stack: `-apple-system, 'Helvetica Neue', sans-serif`
- Windows stack: `'Segoe UI', Tahoma, sans-serif`
- Combined safe stack: `-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`
- Body size: 16px minimum (some clients override smaller)
- Line-height: use absolute pixels (20px not 1.5) for consistent cross-client rendering
- Heading hierarchy via font-size only (some clients strip font-weight)

#### Section: Anti-Patterns (email-specific)

≥5 anti-patterns:
1. Relying on CSS classes (Gmail strips `<style>` tags)
2. Using web fonts and expecting them to render everywhere
3. Pure white backgrounds + pure black text (triggers dark mode inversion issues)
4. Complex layouts that break when images are blocked by default
5. "View in browser" as a substitute for proper email coding
6. Accessibility overlays or interactive JavaScript (doesn't execute in email)
7. Embedding video (use animated GIF thumbnail + play button → link)

### Validation criteria for email.md
- [ ] ≥180 lines
- [ ] Client landscape section with rendering engine details
- [ ] Framework selection table
- [ ] Table-based layout code snippet
- [ ] Hybrid/ghost table code snippet
- [ ] Dark mode handling with meta tags and color strategy
- [ ] Email typography guidance with system font stacks
- [ ] ≥5 email-specific anti-patterns


---

## 3.12 REFERENCE: `animation-motion.md` — Animation & Motion Design

**Purpose**: Comprehensive motion design guidance covering libraries, timing, performance, and the philosophy of purposeful motion. Cross-platform — covers web, mobile concepts, and accessibility.

**Target length**: 250-350 lines

### Required sections and content

#### Section: Motion Library Landscape

| Library | Platform | Best For | Size | Performance |
|---|---|---|---|---|
| Motion (formerly Framer Motion v12.x) | React + vanilla + Vue | General React animation, layout transitions, exit animations | ~5KB (LazyMotion) | Hybrid: JS + WAAPI for 120fps GPU |
| GSAP (3.14.x) | Any (vanilla JS) | Complex timelines, ScrollTrigger, text animation | ~30KB core | Excellent, compositor thread |
| CSS scroll-driven animations | Web (no JS) | Scroll-linked effects, progress indicators | 0KB (native) | Compositor thread (GPU) |
| View Transitions API | Web (no JS) | Page transitions (SPA + MPA) | 0KB (native) | Compositor thread |
| React Native Reanimated 4.x | React Native | Gesture-driven, shared elements | — | UI thread worklets |
| SwiftUI animations | iOS | Spring-based, interruptible | — | Native Core Animation |
| Compose Animation | Android | State-driven transitions | — | Native RenderThread |

#### Section: Timing Fundamentals

Must include the complete timing reference:

```
Micro-interactions (hover, press, toggle): 100-300ms (sweet spot: 150-250ms)
Larger transitions (panel open, page change): 300-500ms
NEVER exceed 500ms for routine UI (feels sluggish)

Desktop: 30% faster than mobile (users expect snappier response)
Exit: faster than entry (users don't want to wait for things to leave)

Motion token system (for CSS custom properties):
  --motion-duration-instant: 100ms   (tooltips, state toggles)
  --motion-duration-fast: 160ms      (hover effects, micro-interactions)
  --motion-duration-base: 240ms      (panel transitions, reveals)
  --motion-duration-slow: 360ms      (page transitions, complex sequences)
  --motion-duration-slowest: 500ms   (dramatic reveals, only for creative domain)
  
  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1)    (Material Design 3 default)
  --motion-ease-in: cubic-bezier(0.4, 0, 1, 1)          (elements entering view)
  --motion-ease-out: cubic-bezier(0, 0, 0.2, 1)         (elements leaving view)
  --motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)    (elements moving within view)
  --motion-spring-bouncy: spring(1, 100, 10, 0)         (education, creative domains)
  --motion-spring-snappy: spring(1, 200, 20, 0)         (devtools, fintech)
```

#### Section: Motion Design Principles

Must cover the three philosophies:
- **Material Design 3**: `cubic-bezier(0.2, 0, 0, 1)` for standard movement. Emphasis on container transforms and shared axis transitions.
- **Apple HIG**: Spring-first physics, ALL animations interruptible mid-flight. Springs defined by response time and damping, not duration.
- **Vercel/Linear**: "Invisible motion" — best animation goes unnoticed. Snappy, no overshoot, serves navigation not spectacle.
- **IBM Carbon**: productive motion (quick, efficient) vs expressive motion (enthusiastic, celebrations)

Include: when to use which philosophy (mapped to domain profiles)

#### Section: Animation Patterns with Code

Must include code snippets for each pattern:

1. **Staggered list reveal** (Motion + CSS):
   - Items appear one by one with 50-100ms delay
   - Code: Motion `variants` with `staggerChildren`
   - Code: Pure CSS with `animation-delay: calc(var(--i) * 80ms)`

2. **Scroll-driven progress bar** (CSS only):
   - Progress bar fills as user scrolls down page
   - Code: `animation-timeline: scroll()` with `@keyframes`

3. **Shared element transition** (View Transitions API):
   - Image in list morphs into hero image on detail page
   - Code: `view-transition-name` CSS + `document.startViewTransition()`

4. **Page-load choreography** (GSAP):
   - Header slides down, hero fades in, content staggers up
   - Code: GSAP `timeline()` with `.from()` calls

5. **Spring-based drag** (Motion):
   - Element follows finger/cursor with spring physics
   - Code: `motion.div` with `drag` prop and `dragElastic`

6. **Scroll-triggered reveal** (CSS `view()` timeline):
   - Elements animate in when they enter viewport
   - Code: `animation-timeline: view()` with `animation-range: entry`

#### Section: Performance Rules

Must include:

```markdown
## Performance Hard Rules

### ONLY animate these properties (compositor thread, GPU-accelerated):
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)
- `clip-path`

### NEVER animate these (trigger layout/paint, cause jank):
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`
- `font-size`

### `will-change` usage:
- Add `will-change: transform` BEFORE animation starts (via class toggle or JS)
- REMOVE after animation completes (promotes element to own layer = memory cost)
- NEVER apply `will-change` to more than ~5 elements simultaneously (crashes mobile)
- NEVER apply via CSS to all instances of a component (use sparingly)
```

#### Section: Accessibility — `prefers-reduced-motion`

Must cover:
- `@media (prefers-reduced-motion: reduce)`: MANDATORY for all animated output
- Replace spatial motion with fades (NOT elimination)
- Reduce duration to instant (~1ms) for transitions that convey state change
- Keep essential animation (loading spinners → reduce to simple fade pulse)
- GSAP: `gsap.matchMedia()` for responsive accessibility-friendly patterns
- Code snippet: complete reduced-motion override for a staggered animation

#### Section: Anti-Patterns (motion-specific)

≥5 anti-patterns:
1. Bounce effects on enterprise/professional UIs
2. Animations >500ms for routine interactions
3. Parallax without purpose (decorative only)
4. Animating `width`/`height` instead of `transform: scale()`
5. No `prefers-reduced-motion` support
6. Page-load animations that delay content access by >1s
7. `will-change` applied to every element in CSS

### Validation criteria for animation-motion.md
- [ ] ≥250 lines
- [ ] Library selection table with ≥7 entries
- [ ] Complete timing reference with motion tokens
- [ ] Three motion philosophies (Material, Apple, Vercel) with domain mapping
- [ ] ≥6 animation patterns with code snippets
- [ ] Performance hard rules (animate vs never-animate lists)
- [ ] `prefers-reduced-motion` section with code
- [ ] ≥5 motion-specific anti-patterns


---

## 3.13 REFERENCE: `typography.md` — Typography

**Purpose**: Font selection, pairing, fluid type scales, variable fonts, and typographic craft. Typography is the single most impactful intervention for breaking the AI aesthetic — this file is critical.

**Target length**: 250-350 lines

### Required sections and content

#### Section: The Typography Thesis

Short (5-8 lines) statement: "Typography is the #1 lever for making AI output look human-designed. Changing the font instantly signals quality. A distinctive font choice + proper hierarchy + correct spacing transforms generic output into professional design."

#### Section: Font Selection by Aesthetic

Must include curated recommendations (NOT an exhaustive list — opinionated picks):

```markdown
## Recommended Fonts by Aesthetic

### Display/Heading Fonts (the differentiator)
| Font | Source | Aesthetic | Variable? | Pair With |
|---|---|---|---|---|
| Clash Display | Fontshare (free) | Bold, geometric, distinctive | Yes | Satoshi, General Sans |
| Playfair Display | Google Fonts | Classic editorial serif | Yes | Lora, Source Serif 4 |
| Fraunces | Google Fonts | Old-style with WONK/SOFT axes | Yes | Inter, DM Sans |
| Bricolage Grotesque | Google Fonts | Quirky, hand-made feel | Yes | Outfit, Work Sans |
| Cormorant Garamond | Google Fonts | Elegant, luxury serif | Yes | Lato, Proza Libre |
| Cabinet Grotesk | Fontshare (free) | Geometric with character | Yes | General Sans |
| Anton | Google Fonts | Ultra-bold condensed | No | Epilogue, Raleway |
| Bodoni Moda | Google Fonts | High-contrast luxury | Yes | Lato |

### Body Fonts (readability first)
| Font | Source | Style | Best For |
|---|---|---|---|
| Satoshi | Fontshare (free) | Modern geometric sans | Tech, creative |
| Plus Jakarta Sans | Google Fonts | Warm geometric with curve | Fintech, SaaS |
| Outfit | Google Fonts | Fresh Montserrat alternative | General use |
| Source Serif 4 | Google Fonts | Highly legible serif | Editorial, long-form |
| Lora | Google Fonts | Literary serif | Blogs, publishing |
| DM Sans | Google Fonts | Clean, optical sizing | Healthcare, minimal |
| General Sans | Fontshare (free) | Versatile humanist sans | Any |

### Monospace (for code/data)
| Font | Source | Features |
|---|---|---|
| Geist Mono | Vercel (free) | Swiss-design, pairs with Geist Sans |
| JetBrains Mono | JetBrains (free) | Ligatures, tall x-height |
| Fira Code | Google Fonts | Ligatures, widely supported |
| Recursive | Google Fonts | Variable MONO axis (proportional↔monospace) |
| IBM Plex Mono | Google Fonts | Corporate, pairs with Plex Sans/Serif |

### BANNED for primary use (convergent/overused)
Inter, Roboto, Open Sans, Lato, Arial, Helvetica, Montserrat, Poppins, Raleway
(these may appear as fallbacks ONLY)
```

#### Section: Font Pairing Rules

Must include:
- **Contrast family**: Pair serif heading + sans body (or vice versa) for maximum distinction
- **Match x-height**: Fonts look harmonious when their lowercase letter heights are similar
- **One display + one workhorse**: display font for headings (≤3 levels), workhorse for everything else
- **Same source cohesion**: fonts from the same designer/foundry often pair well (Geist Sans + Geist Mono, IBM Plex family)
- **Never pair two display fonts**: both fight for attention
- ≥5 concrete pairing recommendations mapped to domain profiles

#### Section: Fluid Type Scales (Utopia)

Must cover:
- Utopia.fyi: generates CSS `clamp()` values interpolating between two modular scales at two viewport widths
- Configuration parameters: min viewport (320px), max viewport (1240px), min scale (1.2 minor third), max scale (1.25 major third)
- The output: `--step--2` through `--step-5` CSS custom properties
- Code snippet: complete fluid type scale CSS (this is what goes in `assets/css/fluid-type-scale.css`)
- Scale ratios by context:
  - Minor Third (1.2): content-heavy, documentation, government
  - Major Third (1.25): marketing, SaaS, most web apps
  - Perfect Fourth (1.333): editorial, creative, dramatic hierarchy

#### Section: Variable Font Features

Must cover:
- Weight axis (`wght`): use for dynamic hierarchy without loading multiple files
- Width axis (`wdth`): condensed headings for tight spaces
- Custom axes: `WONK` in Fraunces (quirkiness), `SOFT` in Fraunces (sharpness), `MONO` in Recursive (proportional↔monospace)
- Performance: one variable font file < multiple static font files
- Code snippet: CSS `@font-face` with `font-weight: 100 900` range + usage with `font-variation-settings`

#### Section: Typographic Craft Rules

Hard rules that must be applied to every output:

```
Body text line-height: 1.5-1.7 (1.6 default)
Heading line-height: 1.0-1.2 (tighter = more intentional)
Maximum line width: 65ch (hardcoded for readability)
All-caps letter-spacing: +0.05em to +0.1em (MANDATORY for uppercase text)
Large heading letter-spacing: -0.01em to -0.03em (tightens display text)
Paragraph spacing: 1em-1.5em (use margin-bottom, not double <br>)
Font loading: WOFF2 only, font-display: swap for headings, optional for body
Self-hosting > CDN for performance (but CDN is fine for artifacts)
```

#### Section: Anti-Patterns (typography-specific)

≥5 anti-patterns:
1. Inter as primary font (convergent)
2. Subtle weight differences (400 vs 600 instead of 300 vs 800)
3. Small size ratios between heading and body (<2×)
4. Missing letter-spacing on uppercase text (looks cramped)
5. Line widths >75ch (hard to track across lines)
6. Using `@import` for Google Fonts (blocks rendering — use `<link>` with `preload`)
7. Loading 8 font weights when only 2-3 are used
8. Not setting `font-display: swap` or `optional`

### Validation criteria for typography.md
- [ ] ≥250 lines
- [ ] Display font table with ≥8 distinctive fonts (none banned)
- [ ] Body font table with ≥7 fonts
- [ ] Monospace font table with ≥5 fonts
- [ ] Banned fonts list explicitly stated
- [ ] Font pairing rules with ≥5 concrete pairings
- [ ] Fluid type scale section with Utopia explanation and code
- [ ] Variable font features with code snippet
- [ ] Typographic craft rules (all hard rules listed)
- [ ] ≥5 typography anti-patterns

---

## 3.14 REFERENCE: `color-systems.md` — Color Science & Systems

**Purpose**: OKLCH color space, palette generation, dark mode implementation, and accessible color. This file covers the WHY and HOW of color choices across all platforms.

**Target length**: 200-300 lines

### Required sections and content

#### Section: Why OKLCH

Must explain:
- OKLCH: Lightness (0-1), Chroma (0-0.37), Hue (0-360°)
- Perceptual uniformity: same L value = same perceived lightness across ALL hues (unlike HSL where blue at L=50% looks darker than yellow at L=50%)
- Browser support: baseline in all modern browsers
- Better than HSL for: generating palette scales, ensuring accessible contrast, creating harmonious palettes
- Code snippet: `oklch()` in CSS vs `hsl()` comparison showing consistency

#### Section: Palette Architecture (3-Tier Token System)

Must document the three-tier system with examples:

```
Tier 1 — Primitives (raw colors):
  --color-blue-500: oklch(0.62 0.18 250);
  --color-blue-600: oklch(0.55 0.20 250);
  
Tier 2 — Semantic (purpose-based):
  --color-interactive: var(--color-blue-500);
  --color-interactive-hover: var(--color-blue-600);
  
Tier 3 — Component (specific usage):
  --button-bg-primary: var(--color-interactive);
  --button-bg-primary-hover: var(--color-interactive-hover);
```

Why three tiers:
- Light/dark mode: swap Tier 2 mappings, Tier 1 and 3 stay the same
- Multi-brand: swap Tier 1, Tier 2 and 3 stay the same
- User customization: override any layer at runtime
- Domain switching: ship different Tier 1 sets per vertical

**Real-world reference implementations** the builder should study and cite:
- **GitHub Primer**: 3-tier system (base → functional → component) with 9 themes across 2 modes, including light-colorblind, dark-tritanopia, and dark-dimmed variants. Automated contrast checking runs as a GitHub Action on every PR — the gold standard for accessible theming at scale.
- **Radix Themes**: `<Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">` prop API provides 30+ accent colors, each a 12-step scale where each step has a specific purpose. Gray scale automatically complements accent. Excellent example of runtime theme customization.
- **IBM Carbon**: Layering model where neutral grays stack to create depth. Light themes alternate White↔Gray 10, dark themes step lighter per layer. Four themes, 52 universal color variables per theme.

#### Section: Generating Palettes

Must cover:
- **Radix Colors**: 12-step purpose-built scales (steps 1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solids, 11-12 text)
- **Evil Martians tools**: oklch.com (picker), Harmonizer (palette gen), apcach (accessible palettes)
- **From a single brand color**: generate a full scale by varying L and C in OKLCH while holding H constant
- **Complementary accents**: rotate H by 180° for complement, 120° for triadic, 30° for analogous
- Code snippet: generating a 12-step scale from a single OKLCH base color

#### Section: Dark Mode Implementation

Must cover (this is where most implementations fail):

```
Background range: #0A0A0A to #1A1A1A (NEVER pure #000000 — causes OLED smearing/halation)
Elevated surfaces: step lighter (#1E1E1E → #2A2A2A → #353535 per elevation level)
Borders: #2E2E2E with 1px subtle lines (borders replace shadows in dark mode)
Text: reduce to 87-90% opacity (not pure white — causes eye strain)
Accent colors: REDUCE saturation compared to light mode (vibrant colors strain eyes on dark bg)
Shadows: ELIMINATE or replace with subtle colored glows:
  box-shadow: 0 0 80px rgba(100, 100, 255, 0.05)  (ambient glow, not directional shadow)
Warm vs cool backgrounds: choose intentionally
  Cool (#0A0A12): technical, devtools, scientific
  Warm (#0F0D0A): editorial, luxury, organic
  Neutral (#0F0F0F): general purpose
```

Implementation approaches:
- CSS `prefers-color-scheme` media query (automatic, respects OS setting)
- CSS class toggle `.dark` on `<html>` (manual toggle, more control)
- `data-theme="dark"` attribute (preferred: clean selector, no specificity issues)
- Code snippet: complete dark mode toggle with CSS custom properties

#### Section: Accessible Color

Must cover:
- **WCAG 2.2**: 4.5:1 contrast ratio for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- **APCA** (Advanced Perceptual Contrast Algorithm): future replacement for WCAG 2.x, designed for WCAG 3.0. More nuanced — different requirements for different font sizes and weights
- **Never rely on color alone**: add shape, pattern, icon, or text alongside color-coded info
- **Colorblind testing**: test with Viz Palette, Polypane for deuteranopia, protanopia, tritanopia
- **Safe accent combinations**: avoid red/green pairings, use blue/orange as colorblind-safe alternative
- Code snippet: OKLCH contrast checking utility function

#### Section: Anti-Patterns (color-specific)

≥5 anti-patterns:
1. Pure white (#FFFFFF) backgrounds (use warm off-whites)
2. Pure black (#000000) in dark mode (causes OLED halation)
3. Purple-to-blue gradients (THE AI slop signature)
4. Same saturation in dark mode as light mode (eye strain)
5. Hardcoded hex values scattered through code (use token system)
6. Using HSL for palette generation (inconsistent perceived lightness)
7. More than 3 accent colors without clear hierarchy

### Validation criteria for color-systems.md
- [ ] ≥200 lines
- [ ] OKLCH explanation with perceptual uniformity comparison
- [ ] 3-tier token system with complete example
- [ ] Palette generation section with OKLCH scale code
- [ ] Dark mode section with specific value ranges and code snippet
- [ ] Accessible color section with WCAG and APCA references
- [ ] ≥5 color-specific anti-patterns


---

## 3.15 REFERENCE: `layout-spacing.md` — Layout & Spacing Systems

**Purpose**: Grid systems, fluid design, content density patterns, CSS Subgrid, container queries, and spatial composition. How to structure pages and components for every density level.

**Target length**: 200-300 lines

### Required sections and content

#### Section: CSS Grid Patterns

Must include ≥4 grid patterns with code:

1. **12-Column Foundation**: the standard grid with named areas
```css
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-m);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-l);
}
```

2. **Bento Grid** (Apple-inspired): modular cells of varying sizes
```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: var(--space-s);
}
.bento-hero { grid-column: span 2; grid-row: span 2; }
.bento-tall { grid-row: span 2; }
.bento-wide { grid-column: span 2; }
```

3. **Asymmetric Editorial**: offset content with sidebar
```css
.editorial {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
}
```

4. **Masonry** (JavaScript fallback):
```css
/* True CSS masonry (when supported): */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-template-rows: masonry; /* experimental */
}
/* JS fallback: Colcade or manual column distribution */
```

5. **CSS Subgrid**: child elements inherit parent grid tracks
```css
.parent { display: grid; grid-template-columns: repeat(4, 1fr); }
.child { display: grid; grid-template-columns: subgrid; grid-column: span 2; }
```

#### Section: Fluid Design System (No Breakpoints)

Must cover:
- **Utopia.fyi fluid spacing**: generates `clamp()` spacing values that work with the type scale
- Parameters: min 320px, max 1240px, matching the type scale configuration
- Output: `--space-3xs` through `--space-3xl` CSS custom properties
- Code snippet: complete fluid space scale CSS (content of `fluid-space-scale.css`)
- **auto-fill + minmax**: `grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr))` for cards
- **Container queries**: `@container (min-width: 400px)` for component-level responsive behavior (replaces viewport media queries for components)
- Code snippet: a card component that changes layout based on container width

#### Section: Content Density Patterns

Three density levels the agent selects based on domain profile:

```markdown
### Spacious (landing pages, luxury, healthcare)
Section spacing: 80-120px (or --space-3xl to --space-3xl * 1.5)
Element padding: 24-48px
Card padding: 32-48px
Content max-width: 720-800px for text, 1200px for grids
Use case: marketing, editorial, breathing room for important content

### Medium (SaaS apps, fintech, most web apps)
Section spacing: 32-64px (--space-xl to --space-2xl)
Element padding: 12-24px
Card padding: 16-24px
Content max-width: 1200-1400px
Use case: product interfaces, dashboards, general applications

### Dense (developer tools, admin panels, data tables)
Section spacing: 8-24px (--space-xs to --space-m)
Element padding: 4-12px
Card padding: 8-16px
Content max-width: 1600px+ or full-width
Use case: data-heavy interfaces, monitoring, code editors

The agent identifies density from context:
- User mentions "dashboard" or "admin" → dense
- User mentions "landing" or "homepage" → spacious
- Default → medium
- Domain profile overrides → use domain's density value
```

#### Section: Spatial Composition Techniques

Must cover:
- **Negative space as design element**: intentionally large empty areas to direct attention
- **Overlapping elements**: CSS Grid with overlapping areas, negative margins, absolute positioning
- **Section dividers**: diagonal clip-path, SVG waves, color transitions (not just `<hr>`)
- **Viewport-height sections**: `min-height: 100svh` (small viewport height, accounts for mobile browser chrome)
- **Scroll snap**: `scroll-snap-type: y mandatory` for section-by-section scrolling
- **Z-axis depth**: layered elements creating depth without 3D transforms
- Code snippet: diagonal section transition using clip-path

#### Section: Anti-Patterns (layout-specific)

≥5 anti-patterns:
1. Fixed pixel widths without fluid alternatives
2. Breakpoint-only responsive (no fluid intermediate states)
3. Equal-width columns for everything (no visual hierarchy)
4. Excessive nesting creating narrow content areas
5. No max-width on text columns (lines >75ch)
6. Ignoring container queries for component-level responsiveness
7. Using viewport units for spacing (inconsistent on mobile with browser chrome)

### Validation criteria for layout-spacing.md
- [ ] ≥200 lines
- [ ] ≥4 CSS Grid patterns with complete code snippets
- [ ] Fluid design system with Utopia spacing scale code
- [ ] Container queries explanation and code snippet
- [ ] Content density section with 3 levels and selection criteria
- [ ] Spatial composition section with ≥4 techniques
- [ ] ≥5 layout-specific anti-patterns

---

## 3.16 REFERENCE: `accessibility.md` — Accessibility Compliance

**Purpose**: WCAG 2.2 compliance guidance, ARIA patterns, European Accessibility Act awareness, and preference-based adaptations. This is a HARD CONSTRAINT reference — not optional enhancement.

**Target length**: 250-350 lines

### Required sections and content

#### Section: Legal Context (why this is mandatory)

Brief but firm:
- 2,019 lawsuits filed H1 2025 in US (37% increase YoY)
- European Accessibility Act enforceable June 28, 2025 (applies to any company selling to EU customers)
- First EAA lawsuits filed November 2025
- FTC fined accessiBe $1M for misleading overlay claims
- 22.6% of lawsuits targeted sites WITH accessibility overlays installed
- Bottom line: overlays don't work, compliance must be baked into design

#### Section: WCAG 2.2 Key Requirements (Level AA)

Must cover with implementation guidance:

| Criterion | Requirement | Implementation |
|---|---|---|
| 1.4.3 Contrast | 4.5:1 text, 3:1 large text | Use OKLCH contrast checking; test with domain palette |
| 1.4.11 Non-Text Contrast | 3:1 for UI components and graphics | Borders, icons, focus rings must pass |
| 2.4.7 Focus Visible | Focus indicator always visible | `:focus-visible` with 2px+ offset ring |
| 2.4.11 Focus Not Obscured | Focused element not hidden by sticky headers | Scroll margin, z-index management |
| 2.5.8 Target Size | ≥24×24 CSS px for interactive targets | Padding/min-dimensions on buttons/links |
| 3.3.7 Redundant Entry | Don't re-ask entered information | Persist form data across steps |
| 3.3.8 Accessible Auth | No cognitive function tests | Support paste, password managers |
| 4.1.2 Name/Role/Value | All controls have accessible name | `aria-label`, `aria-labelledby`, visible label |

#### Section: ARIA Patterns (APG Reference)

Must cover the most common patterns the agent will need to implement:

1. **Combobox** (autocomplete input):
   - `role="combobox"` on input
   - `aria-expanded`, `aria-activedescendant`, `aria-autocomplete`
   - Listbox popup with `role="option"` items
   - Code snippet: accessible combobox structure

2. **Dialog (modal)**:
   - `role="dialog"` or `<dialog>` element
   - `aria-labelledby` pointing to dialog title
   - Focus trap: first focusable element on open, return focus on close
   - Escape key closes

3. **Tabs**:
   - `role="tablist"`, `role="tab"`, `role="tabpanel"`
   - Roving tabindex: Arrow keys move between tabs, Tab moves to panel
   - `aria-selected="true"` on active tab

4. **Data Grid / Table**:
   - `role="grid"` for interactive, `<table>` for static
   - `aria-sort` for sortable columns
   - `aria-colindex` for virtual scrolling

5. **Live Regions**:
   - `aria-live="polite"` for status updates (toast notifications)
   - `aria-live="assertive"` for errors
   - `role="status"` for search result counts, loading states

6. **Disclosure / Accordion**:
   - `<details>/<summary>` native HTML or
   - `aria-expanded` + `aria-controls` on trigger button

#### Section: Preference-Based Adaptations

Must cover with CSS code:

```css
/* Reduced motion: replace spatial animation with fades */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Restore essential fade transitions */
  .fade-transition { transition: opacity 150ms ease; }
}

/* High contrast: boost contrast ratios */
@media (prefers-contrast: more) {
  :root {
    --color-text-primary: oklch(0.05 0 0);      /* Near-black */
    --color-bg-primary: oklch(1.0 0 0);          /* Pure white */
    --color-border: oklch(0.30 0 0);             /* Strong borders */
  }
}

/* Windows High Contrast: use system colors */
@media (forced-colors: active) {
  .button {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }
  /* Custom focus ring using system colors */
  :focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}
```

#### Section: Testing Checklist

Quick checklist the agent should mentally run:
1. Keyboard navigation: can every interactive element be reached and operated with Tab/Enter/Space/Arrows?
2. Screen reader: do headings, landmarks, and labels make sense read linearly?
3. Zoom: does the page work at 200% zoom without horizontal scroll?
4. Color only: if all color is removed, is all information still conveyed?
5. Focus management: after a modal/dialog/dropdown, does focus return correctly?

#### Section: Anti-Patterns (accessibility-specific)

≥5 anti-patterns:
1. `outline: none` without replacement focus indicator
2. `aria-label` that duplicates visible text (redundant)
3. `role="button"` on a `<div>` instead of using `<button>` element
4. Placeholder text as the only label (disappears on input)
5. Auto-playing media without pause control
6. Accessibility overlays as compliance strategy (legally proven ineffective)
7. Hiding content from screen readers that sighted users need (`aria-hidden="true"` abuse)
8. Color-only error indicators (red border without icon or text)

### Validation criteria for accessibility.md
- [ ] ≥250 lines
- [ ] Legal context section with current statistics
- [ ] WCAG 2.2 table with ≥8 key criteria and implementation guidance
- [ ] ≥6 ARIA patterns with code snippets
- [ ] Preference queries section with `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` code
- [ ] Testing checklist (≥5 items)
- [ ] ≥5 accessibility anti-patterns


---

## 3.17 REFERENCE: `anti-patterns.md` — The AI Slop Bible

**Full specification**: See **Part 2, Section 2.5** for the complete spec of this file.

This is the most philosophically important reference file. Summary of required content:
- Why AI output converges (distributional convergence explanation)
- 5 convergence categories with detection heuristics (typography, color, layout, content, interaction)
- 4 counter-technique sections with concrete code (typography, layout, atmosphere, motion)
- 2025-2026 counter-trend: hand-made aesthetic
- 15-point Pre-Delivery Audit Protocol

**Target length**: 300-400 lines
**Validation**: See Part 2, Section 2.5 for complete criteria.

---

## 3.18 PART 3 SUMMARY — ALL REFERENCE FILES AT A GLANCE

| # | File | Target Lines | Key Deliverables |
|---|---|---|---|
| 1 | `_toc.md` | 40-60 | Two navigation tables, reading strategy |
| 2 | `web-react.md` | 250-350 | Component libs, Tailwind v4, modern CSS, React patterns |
| 3 | `web-landing.md` | 200-300 | 6+ layouts, 5+ hero variants, conversion patterns |
| 4 | `web-artifacts.md` | 150-250 | Constraints, inlining strategy, escalation criteria |
| 5 | `dataviz.md` | 250-350 | Library matrix, anti-default styling, scrollytelling |
| 6 | `mobile-native.md` | 250-350 | SwiftUI + Compose + Flutter, platform behaviors |
| 7 | `mobile-crossplatform.md` | 200-280 | RN + Flutter cross, uncanny valley, design strategy |
| 8 | `desktop.md` | 180-260 | Electron + Tauri, command palette, native notes |
| 9 | `cli-terminal.md` | 180-260 | TUI frameworks, Unicode patterns, color systems |
| 10 | `pdf-print.md` | 180-260 | Typst, React-PDF, print vs screen principles |
| 11 | `email.md` | 180-260 | Client landscape, hybrid tables, dark mode |
| 12 | `animation-motion.md` | 250-350 | Libraries, timing tokens, 6+ patterns, perf rules |
| 13 | `typography.md` | 250-350 | Font tables, pairing rules, fluid scales, craft rules |
| 14 | `color-systems.md` | 200-300 | OKLCH, 3-tier tokens, dark mode, accessible color |
| 15 | `layout-spacing.md` | 200-300 | Grid patterns, fluid spacing, density levels |
| 16 | `accessibility.md` | 250-350 | WCAG 2.2, ARIA patterns, preference queries, legal |
| 17 | `anti-patterns.md` | 300-400 | Convergence analysis, counter-techniques, audit protocol |

**Total estimated reference file content**: 3,560-5,120 lines across 17 files.

---

## 3.19 PART 3 VALIDATION CHECKLIST

Before Part 3 is considered complete, verify:

- [ ] All 17 reference files (including _toc.md) have complete specifications
- [ ] Every file spec includes: purpose, target length, required sections, code snippet requirements, anti-patterns, validation criteria
- [ ] No two reference files have significant content overlap (each has a unique focus)
- [ ] Cross-references between related files are noted (e.g., web-react → animation-motion)
- [ ] Code snippet requirements are specific (language, pattern, minimum complexity)
- [ ] Anti-pattern lists are unique per file (not duplicated across files)
- [ ] Total estimated line count across all reference files is documented
- [ ] Every platform mentioned in the directory tree has a corresponding reference file
- [ ] Foundation references (typography, color, layout, accessibility, animation) are platform-agnostic
- [ ] Platform references (web, mobile, desktop, CLI, PDF, email) include tool version numbers

---

*End of Part 3. Continue to Part 4: Asset Specifications and Template Specifications.*

# anti-slop-design Skill Spec — Part 4 of 5
## Asset Specifications and Template Specifications

> **Reading order**: Part 1 (Architecture) → Part 2 (Decision Engine) → Part 3 (Reference Files) → Part 4 (this) → Part 5 (Validation & Build Order)
>
> **This part specifies**: Every file in `assets/` and `templates/` — exact content requirements, generation instructions, format specifications, and validation criteria. These are the files the agent copies or adapts into user projects.

---

## 4.1 CSS ASSETS (`assets/css/`)

These CSS files form the design foundation. The agent copies them into every web project
(and inlines them for claude.ai artifacts). They must be production-ready, well-commented,
and self-documenting.

---

### 4.1.1 `modern-reset.css`

**Purpose**: A modern CSS reset combining Josh Comeau's and Andy Bell's approaches. Establishes a sane baseline without being opinionated about design.

**Generation instructions**: Write a reset that includes ALL of the following:

```css
/* === modern-reset.css ===
 * Modern CSS Reset — anti-slop-design foundation
 * Based on Josh Comeau + Andy Bell approaches (2025)
 */

/* Box sizing */
*, *::before, *::after { box-sizing: border-box; }

/* Remove default margins */
* { margin: 0; }

/* Body defaults */
body {
  line-height: 1.5;              /* Readable default */
  -webkit-font-smoothing: antialiased;  /* Crisp text on macOS */
}

/* Improve media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* Remove built-in form typography styles */
input, button, textarea, select {
  font: inherit;
}

/* Avoid text overflow */
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/* Remove list styles on ul, ol with list role */
ul[role="list"], ol[role="list"] {
  list-style: none;
  padding: 0;
}

/* Anchor defaults */
a { text-decoration-skip-ink: auto; }

/* Smooth scroll (with reduced-motion override) */
html:focus-within { scroll-behavior: smooth; }

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  html:focus-within { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Remove animations for reduced motion but keep essential fades */
@media (prefers-reduced-motion: reduce) {
  .motion-safe-fade {
    transition: opacity 150ms ease !important;
  }
}

/* Create stacking context on root */
#root, #__next { isolation: isolate; }

/* Table normalization */
table { border-collapse: collapse; border-spacing: 0; }

/* Remove button styles */
button { background: none; border: none; cursor: pointer; padding: 0; }
```

**Validation criteria**:
- [ ] File contains `box-sizing: border-box` rule
- [ ] File contains `prefers-reduced-motion` media query
- [ ] File contains body line-height setting
- [ ] File contains media element defaults (`img, picture, video`)
- [ ] File contains form element font inheritance
- [ ] File is 40-80 lines (compact but complete)
- [ ] File has descriptive comments

---

### 4.1.2 `fluid-type-scale.css`

**Purpose**: Utopia-generated fluid typography scale using CSS `clamp()`. Provides `--step-{-2}` through `--step-{5}` custom properties that smoothly interpolate between two modular scales.

**Generation parameters** (use Utopia.fyi calculator or manual formula):
- Minimum viewport: **320px**
- Maximum viewport: **1240px**
- Minimum base size: **16px** (1rem)
- Maximum base size: **18px** (1.125rem)
- Minimum type scale: **1.2** (Minor Third)
- Maximum type scale: **1.25** (Major Third)
- Steps: -2 through 5 (8 steps total)

**Required output format**:

```css
/* === fluid-type-scale.css ===
 * Fluid typography scale — anti-slop-design foundation
 * Generated from Utopia.fyi: 320px→1240px, 16px→18px, 1.2→1.25 scale
 * Usage: font-size: var(--step-0) for body, var(--step-3) for h1, etc.
 */

:root {
  --step--2: clamp(0.69rem, 0.66rem + 0.18vw, 0.80rem);
  --step--1: clamp(0.83rem, 0.78rem + 0.25vw, 1.00rem);
  --step-0:  clamp(1.00rem, 0.93rem + 0.33vw, 1.13rem);   /* Body text */
  --step-1:  clamp(1.20rem, 1.10rem + 0.45vw, 1.41rem);   /* h4 / large body */
  --step-2:  clamp(1.44rem, 1.30rem + 0.63vw, 1.76rem);   /* h3 */
  --step-3:  clamp(1.73rem, 1.54rem + 0.88vw, 2.20rem);   /* h2 */
  --step-4:  clamp(2.07rem, 1.81rem + 1.23vw, 2.75rem);   /* h1 */
  --step-5:  clamp(2.49rem, 2.13rem + 1.69vw, 3.43rem);   /* Display / hero */
}

/* Usage guide:
 * --step--2: captions, footnotes, metadata
 * --step--1: small text, labels, helper text
 * --step-0:  body text (default paragraph size)
 * --step-1:  large body, h4, emphasized text
 * --step-2:  h3, section headings
 * --step-3:  h2, major headings
 * --step-4:  h1, page titles
 * --step-5:  display text, hero headings
 */
```

**Note**: The exact `clamp()` values should be recalculated using the Utopia formula. The values above are illustrative. The builder must either use the Utopia.fyi calculator or implement the interpolation formula:
```
clamp(minSize, minSize + (maxSize - minSize) * ((100vw - minViewport) / (maxViewport - minViewport)), maxSize)
```

**Validation criteria**:
- [ ] File defines `--step--2` through `--step-5` (8 steps)
- [ ] All values use `clamp()` with rem units
- [ ] Values increase monotonically from --step--2 to --step-5
- [ ] File includes usage comments mapping steps to heading levels
- [ ] File is 25-50 lines

---

### 4.1.3 `fluid-space-scale.css`

**Purpose**: Utopia-generated fluid spacing scale. Provides `--space-3xs` through `--space-3xl` plus one-up pairs for responsive spacing.

**Generation parameters**:
- Minimum viewport: **320px**
- Maximum viewport: **1240px**
- Minimum base space: **16px** (matching type scale base)
- Maximum base space: **18px** (matching type scale base)
- Scale multipliers: standard Utopia space scale

**Required output format**:

```css
/* === fluid-space-scale.css ===
 * Fluid spacing scale — anti-slop-design foundation
 * Generated from Utopia.fyi matching the type scale
 * Usage: padding: var(--space-m); gap: var(--space-s);
 */

:root {
  --space-3xs: clamp(0.25rem, 0.23rem + 0.11vw, 0.31rem);
  --space-2xs: clamp(0.50rem, 0.46rem + 0.22vw, 0.63rem);
  --space-xs:  clamp(0.75rem, 0.69rem + 0.33vw, 0.94rem);
  --space-s:   clamp(1.00rem, 0.93rem + 0.33vw, 1.13rem);
  --space-m:   clamp(1.50rem, 1.39rem + 0.54vw, 1.69rem);
  --space-l:   clamp(2.00rem, 1.85rem + 0.76vw, 2.25rem);
  --space-xl:  clamp(3.00rem, 2.78rem + 1.09vw, 3.38rem);
  --space-2xl: clamp(4.00rem, 3.70rem + 1.52vw, 4.50rem);
  --space-3xl: clamp(6.00rem, 5.57rem + 2.17vw, 6.75rem);

  /* One-up pairs (for responsive margin/padding that jumps a step) */
  --space-s-m:  clamp(1.00rem, 0.76rem + 1.20vw, 1.69rem);
  --space-m-l:  clamp(1.50rem, 1.15rem + 1.74vw, 2.25rem);
  --space-l-xl: clamp(2.00rem, 1.46rem + 2.72vw, 3.38rem);
}

/* Usage guide:
 * --space-3xs to --space-xs: tight gaps, icon padding, inline spacing
 * --space-s to --space-m: component padding, card gaps, form spacing
 * --space-l to --space-xl: section spacing, large padding
 * --space-2xl to --space-3xl: hero sections, page-level spacing
 * One-up pairs: for spacing that needs to grow faster than single steps
 */
```

**Validation criteria**:
- [ ] File defines `--space-3xs` through `--space-3xl` (9 steps)
- [ ] File includes ≥3 one-up pairs
- [ ] All values use `clamp()` with rem units
- [ ] Values increase monotonically
- [ ] File includes usage comments
- [ ] File is 25-50 lines


---

### 4.1.4 `motion-tokens.css`

**Purpose**: CSS custom properties for animation duration, easing curves, and spring configurations. The agent references these to maintain consistent motion across a project.

**Required content**:

```css
/* === motion-tokens.css ===
 * Motion design tokens — anti-slop-design foundation
 * Usage: transition: transform var(--motion-duration-fast) var(--motion-ease-standard);
 */

:root {
  /* Durations */
  --motion-duration-instant:  100ms;   /* Tooltips, toggle states */
  --motion-duration-fast:     160ms;   /* Hover effects, micro-interactions */
  --motion-duration-base:     240ms;   /* Panel transitions, reveals */
  --motion-duration-slow:     360ms;   /* Page transitions, complex sequences */
  --motion-duration-slowest:  500ms;   /* Dramatic reveals (creative domain only) */

  /* Easing curves */
  --motion-ease-standard:  cubic-bezier(0.2, 0, 0, 1);     /* Material 3 default */
  --motion-ease-in:        cubic-bezier(0.4, 0, 1, 1);     /* Elements entering */
  --motion-ease-out:       cubic-bezier(0, 0, 0.2, 1);     /* Elements exiting */
  --motion-ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);   /* Moving within view */
  --motion-ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful overshoot */
  --motion-ease-linear:    linear;                          /* Progress bars only */

  /* Common transition shorthand helpers */
  --motion-hover:      var(--motion-duration-fast) var(--motion-ease-standard);
  --motion-appear:     var(--motion-duration-base) var(--motion-ease-out);
  --motion-exit:       var(--motion-duration-fast) var(--motion-ease-in);
  --motion-page:       var(--motion-duration-slow) var(--motion-ease-in-out);
}

/* Stagger animation utility (apply --i via style attribute or CSS counter) */
.motion-stagger {
  animation-delay: calc(var(--i, 0) * 80ms);
}

/* Safe properties to animate (GPU-accelerated) */
/* transition: transform var(--motion-hover), opacity var(--motion-hover); */
/* NEVER: width, height, top, left, margin, padding */
```

**Validation criteria**:
- [ ] File defines 5 duration tokens
- [ ] File defines 6 easing curve tokens
- [ ] File includes shorthand helper tokens
- [ ] File includes stagger utility class
- [ ] Comments document intended usage
- [ ] File is 30-50 lines

---

### 4.1.5 Color Token Files (`assets/css/color-tokens/`)

Three files forming the color token system:

#### `primitives-light.css`

**Purpose**: Base OKLCH color primitives for light mode. These are the "Tier 1" raw values that semantic tokens map to.

**Required content**:

```css
/* === primitives-light.css ===
 * Light mode color primitives (Tier 1)
 * These provide sensible defaults; domain token overlays customize them.
 * Palette: warm neutral with blue accent
 */

:root {
  /* Backgrounds */
  --primitive-bg-0:    oklch(0.985 0.003 90);    /* Page background (warm off-white) */
  --primitive-bg-1:    oklch(0.97 0.005 90);     /* Card/surface */
  --primitive-bg-2:    oklch(1.0 0 0);           /* Elevated (modal/popover) */
  --primitive-bg-3:    oklch(0.94 0.008 90);     /* Muted/inset */

  /* Text */
  --primitive-text-0:  oklch(0.18 0.01 250);     /* Primary text */
  --primitive-text-1:  oklch(0.45 0.008 250);    /* Secondary text */
  --primitive-text-2:  oklch(0.60 0.005 250);    /* Tertiary/disabled */

  /* Accents */
  --primitive-accent-0: oklch(0.55 0.20 250);    /* Primary accent (blue) */
  --primitive-accent-1: oklch(0.48 0.22 250);    /* Accent hover */
  --primitive-accent-2: oklch(0.42 0.24 250);    /* Accent active */
  --primitive-accent-bg: oklch(0.95 0.03 250);   /* Accent background tint */

  /* Borders */
  --primitive-border-0: oklch(0.88 0.005 250);   /* Default border */
  --primitive-border-1: oklch(0.80 0.008 250);   /* Strong border */
  --primitive-border-2: oklch(0.93 0.003 250);   /* Subtle border */

  /* State colors */
  --primitive-error:   oklch(0.55 0.22 25);
  --primitive-success: oklch(0.55 0.17 155);
  --primitive-warning: oklch(0.70 0.15 80);
  --primitive-info:    oklch(0.60 0.15 250);
}
```

#### `primitives-dark.css`

**Purpose**: Base OKLCH color primitives for dark mode.

**Required content**:

```css
/* === primitives-dark.css ===
 * Dark mode color primitives (Tier 1)
 * Applied via [data-theme="dark"] or @media (prefers-color-scheme: dark)
 */

[data-theme="dark"] {
  --primitive-bg-0:    oklch(0.13 0.008 250);    /* Page background */
  --primitive-bg-1:    oklch(0.17 0.01 250);     /* Card/surface */
  --primitive-bg-2:    oklch(0.22 0.012 250);    /* Elevated */
  --primitive-bg-3:    oklch(0.10 0.005 250);    /* Muted/inset */

  --primitive-text-0:  oklch(0.92 0.005 250);    /* Primary text */
  --primitive-text-1:  oklch(0.65 0.005 250);    /* Secondary text */
  --primitive-text-2:  oklch(0.48 0.005 250);    /* Tertiary/disabled */

  --primitive-accent-0: oklch(0.68 0.18 250);    /* Primary accent (lighter) */
  --primitive-accent-1: oklch(0.72 0.16 250);    /* Accent hover */
  --primitive-accent-2: oklch(0.60 0.20 250);    /* Accent active */
  --primitive-accent-bg: oklch(0.18 0.04 250);   /* Accent background tint */

  --primitive-border-0: oklch(0.28 0.008 250);   /* Default border */
  --primitive-border-1: oklch(0.35 0.01 250);    /* Strong border */
  --primitive-border-2: oklch(0.22 0.005 250);   /* Subtle border */

  --primitive-error:   oklch(0.65 0.20 25);      /* Reduced saturation */
  --primitive-success: oklch(0.65 0.15 155);
  --primitive-warning: oklch(0.75 0.13 80);
  --primitive-info:    oklch(0.68 0.13 250);
}

/* Also support media query for auto-detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Same values as [data-theme="dark"] above */
    /* Duplicated here for auto-detection when no explicit data-theme is set */
  }
}
```

**Note**: Builder should either duplicate the values in the media query block or use `@import` with `@media` wrapping. The `[data-theme]` approach takes priority when set manually.

#### `semantic.css`

**Purpose**: Tier 2 semantic mapping. Maps purpose-based token names to primitive values. This is the file domain tokens override.

**Required content**:

```css
/* === semantic.css ===
 * Semantic color tokens (Tier 2)
 * Maps meaningful names to primitive values.
 * Domain token overlays replace these via :root overrides.
 */

:root {
  /* Backgrounds */
  --color-bg-primary:     var(--primitive-bg-0);
  --color-bg-secondary:   var(--primitive-bg-1);
  --color-bg-elevated:    var(--primitive-bg-2);
  --color-bg-muted:       var(--primitive-bg-3);

  /* Text */
  --color-text-primary:   var(--primitive-text-0);
  --color-text-secondary: var(--primitive-text-1);
  --color-text-tertiary:  var(--primitive-text-2);
  --color-text-heading:   var(--primitive-text-0);   /* May be overridden per domain */
  --color-text-inverse:   var(--primitive-bg-0);     /* Light text on dark bg */

  /* Interactive */
  --color-interactive:         var(--primitive-accent-0);
  --color-interactive-hover:   var(--primitive-accent-1);
  --color-interactive-active:  var(--primitive-accent-2);
  --color-interactive-bg:      var(--primitive-accent-bg);

  /* Borders */
  --color-border:         var(--primitive-border-0);
  --color-border-strong:  var(--primitive-border-1);
  --color-border-subtle:  var(--primitive-border-2);

  /* State */
  --color-error:          var(--primitive-error);
  --color-success:        var(--primitive-success);
  --color-warning:        var(--primitive-warning);
  --color-info:           var(--primitive-info);

  /* Surfaces (for cards, modals) */
  --color-surface:        var(--primitive-bg-1);
  --color-surface-hover:  var(--primitive-bg-3);
  --color-overlay:        oklch(0 0 0 / 0.5);        /* Modal backdrop */
}
```

**Validation criteria for all three color token files**:
- [ ] `primitives-light.css`: ≥20 custom properties, all OKLCH values, warm off-white backgrounds (NOT pure #FFFFFF)
- [ ] `primitives-dark.css`: ≥20 custom properties, backgrounds in #0A-#1A range (NOT pure #000000), reduced saturation accents
- [ ] `primitives-dark.css`: uses `[data-theme="dark"]` selector + `@media (prefers-color-scheme: dark)` fallback
- [ ] `semantic.css`: ≥25 custom properties, all referencing `var(--primitive-*)` values
- [ ] Semantic tokens cover: bg (4), text (5), interactive (4), border (3), state (4), surface (3)
- [ ] Each file is 30-60 lines


---

## 4.2 SVG ASSETS (`assets/svg/`)

Five SVG texture files for adding visual atmosphere. Each must be valid SVG, lightweight
(<5KB), and designed for use as CSS `background-image` or inline `<svg>`.

### 4.2.1 `grain-overlay.svg`

**Purpose**: Noise/grain texture overlay for depth and organic feel.
**Usage**: `background-image: url(grain-overlay.svg); opacity: 0.03-0.08; mix-blend-mode: multiply;`
**Best for**: editorial, luxury, creative domains.

**Required SVG content**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5"/>
</svg>
```
**Tuning**: `baseFrequency` controls grain size (0.5-0.8 range), `numOctaves` controls detail (2-4), `opacity` should be applied at usage site, not in SVG.

### 4.2.2 `dot-grid.svg`

**Purpose**: Dot grid pattern for technical/devtools aesthetic.
**Usage**: `background-image: url(dot-grid.svg); background-size: 24px 24px;`
**Best for**: devtools, SaaS, technical domains.

**Required SVG content**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.15"/>
</svg>
```
**Notes**: Tile seamlessly via `background-repeat`. Use `currentColor` so dot color adapts to theme. Agent adjusts opacity and dot size per domain.

### 4.2.3 `blob-organic.svg`

**Purpose**: Organic blob shape for decorative elements and section backgrounds.
**Usage**: Position absolutely, use as background or clip-path.
**Best for**: education, creative, playful domains.

**Required SVG content**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <path d="M440,290Q420,380,340,410Q260,440,180,400Q100,360,80,280Q60,200,120,130Q180,60,270,60Q360,60,410,130Q460,200,440,290Z" 
    fill="currentColor" opacity="0.08"/>
</svg>
```
**Notes**: The path creates an irregular organic shape. Agent should vary the path control points when using multiple blobs. `currentColor` enables theming via parent `color` property.

### 4.2.4 `noise-subtle.svg`

**Purpose**: Very subtle noise texture for card/surface backgrounds.
**Usage**: `background-image: url(noise-subtle.svg); opacity: 0.02-0.05;`
**Best for**: fintech, healthcare (very subtle), SaaS.

**Required SVG content**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" opacity="0.3"/>
</svg>
```
**Notes**: Higher `baseFrequency` than grain-overlay = finer texture. Lower applied opacity = more subtle.

### 4.2.5 `diagonal-lines.svg`

**Purpose**: Diagonal line pattern for editorial/print-inspired sections.
**Usage**: `background-image: url(diagonal-lines.svg); background-size: 16px 16px;`
**Best for**: media, editorial, government (subtle accent).

**Required SVG content**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
  <line x1="0" y1="16" x2="16" y2="0" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
</svg>
```
**Notes**: Tiles seamlessly. Adjust `stroke-width` and `opacity` per use case.

### SVG validation criteria (all files)
- [ ] All 5 SVG files exist
- [ ] All are valid XML (parseable by any XML parser)
- [ ] All use `currentColor` or `opacity` for theme adaptability
- [ ] None exceed 5KB
- [ ] Grain and noise use `feTurbulence` filter
- [ ] Dot-grid and diagonal-lines tile seamlessly
- [ ] Blob uses organic curved path

### SVG generation and customization tools

If the builder wants to create alternative textures or customize beyond the bundled defaults,
these tools generate production-ready SVG textures:

- **fffuel.co/gggrain/** — Interactive grain/noise texture generator with tunable density, color, and blend mode
- **fffuel.co/nnnoise/** — SVG noise pattern generator (lighter than grain, good for subtle backgrounds)
- **blobmaker.app** — Organic blob shape generator with randomized border-radius curves
- **heropatterns.com** — Library of 100+ repeating SVG background patterns (geometric, organic, etc.)
- **pattern.monster** — CSS/SVG pattern gallery with live customization and export

Reference these in `references/anti-patterns.md` under the "Adding Atmosphere" counter-technique section.

---

## 4.3 FONT ASSETS (`assets/fonts/`)

### 4.3.1 `font-stacks.json`

**Purpose**: Curated font stack definitions organized by aesthetic category. The agent selects from these based on the domain profile's typography requirements.

**Required schema and content**:

```json
{
  "schema_version": "1.0.0",
  "stacks": {
    "heading": {
      "geometric-bold": {
        "family": "'Clash Display', 'Plus Jakarta Sans', system-ui, sans-serif",
        "google_fonts_url": null,
        "fontshare_url": "https://www.fontshare.com/fonts/clash-display",
        "weights": ["500", "600", "700"],
        "variable": true,
        "domains": ["creative", "devtools"]
      },
      "editorial-serif": {
        "family": "'Playfair Display', 'Georgia', serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap",
        "fontshare_url": null,
        "weights": ["400", "700", "900"],
        "variable": true,
        "domains": ["media", "ecommerce"]
      },
      "warm-geometric": {
        "family": "'Plus Jakarta Sans', system-ui, sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap",
        "fontshare_url": null,
        "weights": ["400", "600", "700", "800"],
        "variable": true,
        "domains": ["fintech", "healthcare"]
      },
      "quirky-grotesque": {
        "family": "'Bricolage Grotesque', system-ui, sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700;800&display=swap",
        "fontshare_url": null,
        "weights": ["400", "700", "800"],
        "variable": true,
        "domains": ["education", "creative"]
      },
      "luxury-serif": {
        "family": "'Cormorant Garamond', 'Georgia', serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;700&display=swap",
        "fontshare_url": null,
        "weights": ["400", "500", "700"],
        "variable": false,
        "domains": ["ecommerce"]
      },
      "swiss-clean": {
        "family": "'Geist Sans', 'Helvetica Neue', system-ui, sans-serif",
        "google_fonts_url": null,
        "source_url": "https://vercel.com/font",
        "weights": ["400", "500", "600", "700"],
        "variable": true,
        "domains": ["devtools"]
      },
      "playful-rounded": {
        "family": "'Nunito', 'Poppins', sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap",
        "fontshare_url": null,
        "weights": ["400", "600", "700", "800"],
        "variable": true,
        "domains": ["education"]
      },
      "functional-accessible": {
        "family": "'Noto Sans', 'Arial', sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap",
        "fontshare_url": null,
        "weights": ["400", "600", "700"],
        "variable": true,
        "domains": ["government"]
      }
    },
    "body": {
      "modern-sans": {
        "family": "'Satoshi', 'General Sans', system-ui, sans-serif",
        "fontshare_url": "https://www.fontshare.com/fonts/satoshi",
        "domains": ["creative", "devtools"]
      },
      "humanist-sans": {
        "family": "'DM Sans', 'Source Sans 3', system-ui, sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
        "domains": ["healthcare", "education"]
      },
      "legible-serif": {
        "family": "'Source Serif 4', 'Lora', 'Charter', serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap",
        "domains": ["media"]
      },
      "clean-neutral": {
        "family": "'Outfit', 'Work Sans', system-ui, sans-serif",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
        "domains": ["fintech", "general"]
      }
    },
    "mono": {
      "geist": {
        "family": "'Geist Mono', 'JetBrains Mono', monospace",
        "source_url": "https://vercel.com/font",
        "domains": ["devtools"]
      },
      "jetbrains": {
        "family": "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
        "domains": ["fintech", "general"]
      },
      "ibm": {
        "family": "'IBM Plex Mono', 'Consolas', monospace",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap",
        "domains": ["healthcare", "government"]
      }
    },
    "banned_primary": [
      "Inter", "Roboto", "Open Sans", "Lato", "Arial", "Helvetica",
      "Montserrat", "Poppins", "Raleway"
    ]
  }
}
```

**Validation criteria**:
- [ ] Valid JSON
- [ ] ≥6 heading stacks, ≥3 body stacks, ≥3 mono stacks
- [ ] Each stack has: family, source URL, domains array
- [ ] Banned list includes all convergent fonts
- [ ] Every domain in domain-map.json has at least one heading and body stack mapped

### 4.3.2 `loading-snippet.html`

**Purpose**: Optimal font loading pattern for web projects. Copy-paste ready.

**Required content**:

```html
<!-- === Font Loading — anti-slop-design ===
     Place in <head>, BEFORE any stylesheet that references these fonts.
     Replace font URLs with the fonts chosen for your domain.
-->

<!-- Preconnect to font CDN (eliminates DNS + TLS handshake) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load heading font with swap (visible immediately, swaps when loaded) -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=HEADING_FONT:wght@400;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Load body font with optional (if not loaded in ~100ms, use fallback forever) -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=BODY_FONT:wght@400;500&display=optional" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Fallback for JS-disabled browsers -->
<noscript>
  <link href="https://fonts.googleapis.com/css2?family=HEADING_FONT:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=BODY_FONT:wght@400;500&display=swap" rel="stylesheet">
</noscript>

<!-- 
  IMPORTANT: 
  - Replace HEADING_FONT and BODY_FONT with actual font names
  - Use display=swap for heading (headings must show correct font)
  - Use display=optional for body (body text layout shift is jarring)
  - For Fontshare fonts, preconnect to api.fontshare.com instead
  - For self-hosted WOFF2: use <link rel="preload" as="font" type="font/woff2" crossorigin>
-->
```

**Validation criteria**:
- [ ] Contains preconnect links
- [ ] Uses `rel="preload"` with `as="style"` pattern
- [ ] Documents `display=swap` vs `display=optional` difference
- [ ] Contains `<noscript>` fallback
- [ ] Has placeholder markers for font replacement


---

## 4.4 DOMAIN TOKEN FILES

The schema and one complete example are defined in **Part 2, Section 2.7**. The builder must create 8 files using the palettes from Part 2, Section 2.2:

| File | Domain | Source Profile |
|---|---|---|
| `fintech.json` | Fintech | Part 2, §2.2 Domain 1 |
| `healthcare.json` | Healthcare | Part 2, §2.2 Domain 2 |
| `devtools.json` | Developer Tools | Part 2, §2.2 Domain 3 |
| `ecommerce.json` | E-commerce/Luxury | Part 2, §2.2 Domain 4 |
| `education.json` | Education | Part 2, §2.2 Domain 5 |
| `media.json` | Media/Publishing | Part 2, §2.2 Domain 6 |
| `government.json` | Government/Civic | Part 2, §2.2 Domain 7 |
| `creative.json` | Creative Agency | Part 2, §2.2 Domain 8 |

Each file follows the exact schema in Part 2 §2.7 with values from the corresponding domain profile.

**Validation**: Each file is valid JSON, contains all required keys, OKLCH values match the domain profile.

The `_extensibility.md` content is specified in **Part 2, Section 2.4**.

---

## 4.5 TEMPLATES (`templates/`)

Templates are structural scaffolds. They are NOT final output — the agent must customize
them by injecting domain tokens, changing fonts, adapting layout, and replacing placeholder
content. Every template must include `/* THEME: ... */` comment markers at every
customization point.

### General template rules

1. Every template has a comment block at the top explaining what it is and how to customize
2. `/* THEME: description */` markers at every point the agent should inject domain-specific values
3. Placeholder content must be realistic for the domain (not "Lorem ipsum")
4. Accessibility baseline: semantic HTML, ARIA where needed, focus management
5. Responsive foundation: fluid or container-query-based, not fixed-width
6. Templates must be syntactically valid and executable as-is (with placeholder styling)

---

### 4.5.1 Web Templates (`templates/web/`)

#### `dashboard.tsx` — React Dashboard

**Purpose**: Starting point for data-heavy web applications with sidebar navigation, metric cards, and chart areas.

**Required structure**:
```
┌─────────────────────────────────────────────────┐
│ Sidebar (collapsible)  │  Header (breadcrumb + user) │
│                        │──────────────────────────────│
│  ☐ Nav item 1          │  ┌─ Metric Card ─┐ ┌─ MC ─┐ │
│  ☐ Nav item 2          │  │  $12,450       │ │ 342  │ │
│  ☐ Nav item 3          │  │  Revenue       │ │ Users│ │
│                        │  └────────────────┘ └──────┘ │
│                        │  ┌─ Main Chart Area ────────┐ │
│                        │  │                          │ │
│                        │  │  (Recharts placeholder)  │ │
│                        │  │                          │ │
│                        │  └──────────────────────────┘ │
│                        │  ┌─ Table / Secondary ──────┐ │
│                        │  │                          │ │
│                        │  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Must include**:
- Sidebar with `/* THEME: sidebar background, border, nav item colors */`
- Metric card component with `/* THEME: card background, border-radius, shadow */`
- Chart placeholder area with `/* THEME: chart colors from domain tokens */`
- Responsive: sidebar collapses to hamburger on mobile
- CSS custom properties for all colors (not hardcoded)
- Imports for Recharts (or placeholder for chart library)
- Accessible: sidebar uses `<nav>`, cards use `role="region"` with labels
- **Target**: 150-250 lines

#### `landing-page.html` — Single-File Landing Page

**Purpose**: Marketing/content landing page with non-default layout.

**Must include**:
- NON-default layout (asymmetric hero or bento or editorial — NOT centered hero → 3-col)
- `<style>` block with CSS custom properties from fluid scales and color tokens
- Hero section with `/* THEME: hero layout, background, typography */`
- Features section using a non-standard layout with `/* THEME: feature card styling */`
- Social proof section with `/* THEME: testimonial/logo styling */`
- CTA section with `/* THEME: CTA button, background */`
- Scroll-triggered CSS animations (using `animation-timeline: view()` or `IntersectionObserver` class toggle)
- Responsive via fluid design (no breakpoints if possible)
- Accessible: semantic HTML, skip-nav link, heading hierarchy
- **Target**: 200-350 lines

#### `saas-app.tsx` — SaaS Application Shell

**Purpose**: Starting point for SaaS product interfaces with navigation, content area, and command palette.

**Must include**:
- Top navigation bar with `/* THEME: nav background, border */`
- Command palette (⌘K) component with `/* THEME: palette styling */`
- Content area with sidebar/breadcrumb navigation
- Empty state component (for initial/empty views)
- Toast/notification area
- CSS custom properties throughout
- Keyboard shortcut handling (at least ⌘K for palette)
- Accessible: landmarks, focus management in command palette
- **Target**: 200-300 lines

#### `artifact-react.jsx` — Claude.ai Artifact Template

**Purpose**: Optimized single-file React component for claude.ai artifacts. Everything inlined — no external files.

**Must include**:
- Inlined CSS reset (condensed from modern-reset.css)
- Inlined fluid type scale custom properties
- Inlined domain color tokens with `/* THEME: replace with domain palette */`
- Inlined motion tokens
- Google Fonts `<link>` injection via `useEffect` with `/* THEME: replace font URL */`
- Inline SVG grain/noise texture with `/* THEME: adjust opacity per domain */`
- Dark mode toggle using state (not `prefers-color-scheme` — doesn't work in artifacts)
- Example content demonstrating: heading hierarchy, card component, interactive element
- Comments at every theme injection point
- NO localStorage, NO `<form>` tags
- **Target**: 150-250 lines


---

### 4.5.2 Mobile Templates (`templates/mobile/`)

#### `swiftui-app.swift` — SwiftUI Application Skeleton

**Must include**:
- `AppColors` struct with semantic color tokens mapped from domain profile, with `/* THEME: replace colors */` markers
- `AppTypography` struct with custom font styles using `Font.custom()`, with `/* THEME: replace font names */`
- `AppShapes` struct with border radius values
- Main `ContentView` demonstrating: tab navigation, a list view, a detail view
- Custom `NavigationBar` appearance override (not default)
- Spring-based animation example (list item appearance)
- `@Environment(\.colorScheme)` for dark mode support
- Accessible: `.accessibilityLabel()` on icon-only buttons, Dynamic Type support
- **Target**: 150-200 lines

#### `compose-app.kt` — Jetpack Compose Skeleton

**Must include**:
- Complete `AppTheme` composable overriding `MaterialTheme` with custom `colorScheme`, `typography`, `shapes`, with `/* THEME: replace values */` markers
- `Color.kt` with domain palette values
- `Typography.kt` with custom `FontFamily` and `TextStyle` definitions
- Main screen with `Scaffold`, bottom navigation, and content area
- Animated list item with `AnimatedVisibility`
- Dark theme support via `isSystemInDarkTheme()`
- Accessible: content descriptions on images/icons, sufficient contrast
- **Target**: 150-200 lines

#### `react-native-app.tsx` — React Native Skeleton

**Must include**:
- NativeWind v4 configuration approach with `/* THEME: customize tailwind.config.js */`
- Token constants file structure: `colors.ts`, `typography.ts`
- Tab navigator using `@react-navigation/bottom-tabs` with native tab bar
- Screen component demonstrating: card list, pull-to-refresh, haptic feedback
- `Platform.select()` example for platform-specific styling
- Reanimated example: spring-based card press animation
- Accessible: `accessibilityRole`, `accessibilityLabel` on interactive elements
- **Target**: 150-200 lines

---

### 4.5.3 Desktop Templates (`templates/desktop/`)

#### `electron-app.html` — Electron Renderer

**Must include**:
- Custom title bar with `/* THEME: titlebar background, window controls */` using `-webkit-app-region: drag`
- macOS traffic light inset handling
- Sidebar navigation (collapsible)
- Content area with multi-pane layout
- Command palette trigger (⌘K / Ctrl+K) placeholder
- CSS custom properties from token system
- IPC communication patterns (comment-documented, not fully implemented)
- `/* THEME */` markers for all color/font customization points
- **Target**: 120-180 lines

#### `tauri-app.html` — Tauri Frontend Skeleton

**Must include**:
- Custom title bar (Tauri uses `data-tauri-drag-region` attribute)
- Same general structure as electron-app but noting Tauri-specific differences
- Lighter CSS (matching Tauri's lightweight philosophy)
- Note about `@tauri-apps/api` for system integration
- `/* THEME */` markers throughout
- **Target**: 100-150 lines

---

### 4.5.4 CLI Templates (`templates/cli/`)

#### `node-cli.ts` — Node.js Interactive CLI (Clack)

**Must include**:
- `@clack/prompts` import for interactive prompts
- `picocolors` for colored output
- Welcome banner using Unicode box-drawing characters `╭──╮│╰──╯`
- Spinner example with Braille characters
- Multi-step prompt flow (intro → select → confirm → outro)
- Success/error output with color-coded icons (✓ green, ✗ red)
- `/* THEME: replace colors with domain palette */` markers
- `process.env.NO_COLOR` check
- **Target**: 80-120 lines

#### `python-tui.py` — Python TUI (Textual/Rich)

**Must include**:
- Textual `App` class with `.tcss` stylesheet or Rich console setup
- Color theme defined as class attributes with `/* THEME: replace */` markers
- Example screen: header, content area with table/list, footer with status
- Keyboard binding example
- Responsive layout using Textual's CSS-like grid or Rich's Panel/Table
- **Target**: 80-120 lines

#### `go-tui.go` — Go TUI (Bubble Tea)

**Must include**:
- Bubble Tea `Model`, `Update`, `View` structure
- Lip Gloss styles with `/* THEME: replace colors */` markers
- Example: list view with selectable items, styled with borders and colors
- Spinner component using Bubbles library
- Keyboard handling for navigation
- **Target**: 80-120 lines

---

### 4.5.5 Document Templates (`templates/documents/`)

#### `typst-report.typ` — Typst Professional Report

**Must include**:
- Page setup: A4, custom margins, headers/footers with page numbers
- Font configuration with `#set text(font: "...")` and `/* THEME: replace font */`
- Color definitions as Typst variables: `#let accent = rgb("...")` with `/* THEME */`
- Title page with company/project name, date, author
- Table of contents via `#outline()`
- Styled headings (3 levels with color accent and rules)
- Example table with alternating row colors
- Example figure with caption
- Code block styling
- **Target**: 100-150 lines

#### `react-pdf-invoice.tsx` — React-PDF Invoice/Report

**Must include**:
- `@react-pdf/renderer` imports: `Document`, `Page`, `View`, `Text`, `StyleSheet`
- Registered custom fonts via `Font.register()` with `/* THEME: replace font URLs */`
- Color constants from domain tokens with `/* THEME */` markers
- Invoice structure: header (logo area + company info), line items table, totals, footer
- StyleSheet with proper Flexbox layout
- Conditionally rendered sections (e.g., notes, terms)
- **Target**: 120-180 lines

#### `react-email.tsx` — React Email Transactional Template

**Must include**:
- `@react-email/components` imports: `Html`, `Head`, `Body`, `Container`, `Section`, `Text`, `Button`, `Img`
- Color scheme meta tag for dark mode: `<meta name="color-scheme" content="light dark">`
- System font stack (no web fonts for email by default)
- Off-white background (not pure white) with `/* THEME: replace colors */`
- Table-based inner structure for Outlook compatibility
- Responsive container (600px max-width, 100% on mobile)
- Header with logo placeholder
- Body content area
- CTA button (table-based for Outlook, styled for modern clients)
- Footer with unsubscribe link
- All styles inline (React Email handles this, but document why)
- **Target**: 100-150 lines

---

### 4.5.6 Data Visualization Templates (`templates/dataviz/`)

#### `recharts-dashboard.tsx` — Multi-Chart Dashboard

**Must include**:
- Recharts imports: `LineChart`, `BarChart`, `AreaChart`, `ResponsiveContainer`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`, `Line`, `Bar`, `Area`
- Custom color array from domain tokens (NOT Recharts defaults) with `/* THEME */`
- Custom Tooltip component with styled container
- Custom tick/label components using domain typography
- 3 charts: line (trend), bar (comparison), area (volume)
- Stripped chart junk: minimal gridlines, no outer borders
- Declarative titles (findings, not descriptions)
- Direct data labels where appropriate
- Responsive via `ResponsiveContainer`
- **Target**: 150-250 lines

#### `d3-editorial.html` — D3 Editorial Visualization

**Must include**:
- D3 v7 import from CDN
- Scrollama import from CDN (or IntersectionObserver manual implementation)
- SVG container with responsive viewBox
- Step-based narrative structure: prose sections + chart that transforms
- At least 2 scroll-triggered transitions (e.g., data highlight, annotation reveal)
- Custom color palette from domain tokens
- Custom typography applied to chart text
- Annotation system (text + line pointing to data)
- Accessible: `aria-label` on SVG, meaningful `title` elements
- CSS custom properties for theming
- **Target**: 200-300 lines

#### `nivo-cards.tsx` — Nivo Chart Card Components

**Must include**:
- `@nivo/bar`, `@nivo/line`, `@nivo/pie` imports
- Card wrapper component with domain-styled container
- Custom color scheme array (NOT Nivo defaults) with `/* THEME */`
- 3 card-sized charts: mini bar, sparkline, donut
- Custom theme object overriding Nivo defaults: font family, colors, grid, axis
- Tooltips styled to match domain aesthetic
- Responsive via container query or ResizeObserver
- **Target**: 120-180 lines


---

## 4.6 TEMPLATE SUMMARY TABLE

| Template | Path | Language | Target Lines | Key Features |
|---|---|---|---|---|
| Dashboard | `web/dashboard.tsx` | React/TSX | 150-250 | Sidebar, metric cards, chart area |
| Landing Page | `web/landing-page.html` | HTML/CSS | 200-350 | Non-default layout, scroll animation |
| SaaS App | `web/saas-app.tsx` | React/TSX | 200-300 | Nav, command palette, empty state |
| Artifact | `web/artifact-react.jsx` | React/JSX | 150-250 | Fully inlined, dark toggle, grain texture |
| SwiftUI | `mobile/swiftui-app.swift` | Swift | 150-200 | Token architecture, spring animations |
| Compose | `mobile/compose-app.kt` | Kotlin | 150-200 | Custom MaterialTheme, animated list |
| React Native | `mobile/react-native-app.tsx` | TSX | 150-200 | NativeWind, native tab bar, haptics |
| Electron | `desktop/electron-app.html` | HTML/JS | 120-180 | Custom titlebar, command palette |
| Tauri | `desktop/tauri-app.html` | HTML/JS | 100-150 | Tauri drag region, light CSS |
| Node CLI | `cli/node-cli.ts` | TypeScript | 80-120 | Clack prompts, Unicode box art |
| Python TUI | `cli/python-tui.py` | Python | 80-120 | Textual/Rich, CSS-like styling |
| Go TUI | `cli/go-tui.go` | Go | 80-120 | Bubble Tea + Lip Gloss |
| Typst Report | `documents/typst-report.typ` | Typst | 100-150 | ToC, styled headings, tables |
| React-PDF | `documents/react-pdf-invoice.tsx` | TSX | 120-180 | Invoice layout, custom fonts |
| React Email | `documents/react-email.tsx` | TSX | 100-150 | Outlook compat, dark mode meta |
| Recharts Dashboard | `dataviz/recharts-dashboard.tsx` | TSX | 150-250 | Custom colors, stripped junk |
| D3 Editorial | `dataviz/d3-editorial.html` | HTML/JS | 200-300 | Scrollytelling, annotations |
| Nivo Cards | `dataviz/nivo-cards.tsx` | TSX | 120-180 | Card-sized charts, custom theme |

**Total template lines**: 2,570-3,870 across 18 files.

---

## 4.7 PART 4 VALIDATION CHECKLIST

Before Part 4 is considered complete, verify:

### CSS Assets
- [ ] `modern-reset.css` exists, contains box-sizing + reduced-motion + body defaults
- [ ] `fluid-type-scale.css` exists, defines `--step--2` through `--step-5` with clamp()
- [ ] `fluid-space-scale.css` exists, defines `--space-3xs` through `--space-3xl` with clamp()
- [ ] `motion-tokens.css` exists, defines 5 durations + 6 easing curves
- [ ] `color-tokens/primitives-light.css` exists, ≥20 OKLCH custom properties, warm off-white bg
- [ ] `color-tokens/primitives-dark.css` exists, ≥20 OKLCH custom properties, NOT pure black
- [ ] `color-tokens/semantic.css` exists, ≥25 custom properties mapping to primitives

### SVG Assets
- [ ] All 5 SVG files exist (grain, dot-grid, blob, noise, diagonal)
- [ ] All are valid XML under 5KB
- [ ] All use `currentColor` or `opacity` for theme adaptability
- [ ] Grain and noise use `feTurbulence` filter

### Font Assets
- [ ] `font-stacks.json` is valid JSON with ≥6 heading + ≥3 body + ≥3 mono stacks
- [ ] Each stack has `family`, source URL, and `domains` array
- [ ] Banned fonts list is present
- [ ] `loading-snippet.html` contains preconnect + preload pattern

### Domain Tokens
- [ ] All 8 domain token JSON files exist and are valid
- [ ] Each matches the domain profile from Part 2
- [ ] Each contains all required keys (colors.light, colors.dark, typography, shape, motion, shadows)
- [ ] `_extensibility.md` exists with step-by-step guide

### Templates
- [ ] All 18 template files exist
- [ ] Every template has `/* THEME */` comment markers at customization points
- [ ] Every template has a descriptive header comment
- [ ] Every web template uses CSS custom properties (not hardcoded colors)
- [ ] Every template includes basic accessibility (semantic elements, labels)
- [ ] Every template is syntactically valid in its language

### Cross-Checks
- [ ] CSS token names in asset files match the names used in templates
- [ ] Font stacks in `font-stacks.json` match the families referenced in domain token files
- [ ] Color values in primitive CSS files match the "default" palette (before domain override)
- [ ] SVG usage patterns documented in SKILL.md §D match the actual SVG file capabilities

---

*End of Part 4. Continue to Part 5: Validation Script, Build Order, and Evaluation.*

# anti-slop-design Skill Spec — Part 5 of 5
## Validation Script, Build Order, Evaluation, and Master Checklist

> **Reading order**: Part 1 (Architecture) → Part 2 (Decision Engine) → Part 3 (Reference Files) → Part 4 (Assets & Templates) → Part 5 (this)
>
> **This part specifies**: The `validate-skill.sh` script, the `evals/evals.json` test cases, the phased build order, and the master validation checklist that ties everything together.

---

## 5.1 VALIDATE-SKILL.SH — FULL SCRIPT SPEC

This script is the machine-runnable sanity check. It lives at `scripts/validate-skill.sh`
and must be executable (`chmod +x`). It checks the entire skill package for completeness
and correctness.

### Behavior

- Takes one optional argument: the skill root directory (defaults to `.`)
- Outputs one line per check: `✓ PASS: <description>` or `✗ FAIL: <description>`
- Tracks pass/fail counts
- Exits 0 if ALL checks pass, exits 1 if ANY check fails
- Final summary line: `Results: X/Y checks passed`

### Checks the script MUST implement

The builder must implement every check below. Group them by category.

#### Category 1: File Existence (28 checks)

Every file in the directory tree from Part 1 §1.3 must exist. The script checks:

```bash
# Core files
SKILL.md
domain-map.json

# References (17 files)
references/_toc.md
references/web-react.md
references/web-landing.md
references/web-artifacts.md
references/dataviz.md
references/mobile-native.md
references/mobile-crossplatform.md
references/desktop.md
references/cli-terminal.md
references/pdf-print.md
references/email.md
references/animation-motion.md
references/typography.md
references/color-systems.md
references/layout-spacing.md
references/accessibility.md
references/anti-patterns.md

# CSS assets (7 files)
assets/css/modern-reset.css
assets/css/fluid-type-scale.css
assets/css/fluid-space-scale.css
assets/css/motion-tokens.css
assets/css/color-tokens/primitives-light.css
assets/css/color-tokens/primitives-dark.css
assets/css/color-tokens/semantic.css

# SVG assets (5 files)
assets/svg/grain-overlay.svg
assets/svg/dot-grid.svg
assets/svg/blob-organic.svg
assets/svg/noise-subtle.svg
assets/svg/diagonal-lines.svg

# Font assets (2 files)
assets/fonts/font-stacks.json
assets/fonts/loading-snippet.html

# Token assets (9 files)
assets/tokens/domain-tokens/fintech.json
assets/tokens/domain-tokens/healthcare.json
assets/tokens/domain-tokens/devtools.json
assets/tokens/domain-tokens/ecommerce.json
assets/tokens/domain-tokens/education.json
assets/tokens/domain-tokens/media.json
assets/tokens/domain-tokens/government.json
assets/tokens/domain-tokens/creative.json
assets/tokens/_extensibility.md

# Templates - web (4 files)
templates/web/dashboard.tsx
templates/web/landing-page.html
templates/web/saas-app.tsx
templates/web/artifact-react.jsx

# Templates - mobile (3 files)
templates/mobile/swiftui-app.swift
templates/mobile/compose-app.kt
templates/mobile/react-native-app.tsx

# Templates - desktop (2 files)
templates/desktop/electron-app.html
templates/desktop/tauri-app.html

# Templates - CLI (3 files)
templates/cli/node-cli.ts
templates/cli/python-tui.py
templates/cli/go-tui.go

# Templates - documents (3 files)
templates/documents/typst-report.typ
templates/documents/react-pdf-invoice.tsx
templates/documents/react-email.tsx

# Templates - dataviz (3 files)
templates/dataviz/recharts-dashboard.tsx
templates/dataviz/d3-editorial.html
templates/dataviz/nivo-cards.tsx

# Validation & eval (2 files)
scripts/validate-skill.sh
evals/evals.json
```

**Total**: 55 file-existence checks.


#### Category 2: Minimum Line Counts (18 checks)

Files must meet minimum size thresholds to ensure they contain real content, not stubs.

| File | Min Lines | Rationale |
|---|---|---|
| `SKILL.md` | 300 | Hub document must be substantial |
| `domain-map.json` | 300 | 8 domains × ~30 lines each + keywords |
| `references/anti-patterns.md` | 250 | The core philosophy document |
| `references/web-react.md` | 150 | Major platform reference |
| `references/web-landing.md` | 120 | Landing page patterns |
| `references/web-artifacts.md` | 100 | Artifact-specific constraints |
| `references/dataviz.md` | 150 | Library comparisons + patterns |
| `references/mobile-native.md` | 150 | SwiftUI + Compose + Flutter |
| `references/mobile-crossplatform.md` | 120 | RN + KMP + Flutter cross |
| `references/desktop.md` | 100 | Electron + Tauri |
| `references/cli-terminal.md` | 100 | TUI frameworks |
| `references/pdf-print.md` | 100 | Typst + React-PDF |
| `references/email.md` | 100 | Email rendering challenges |
| `references/animation-motion.md` | 150 | Motion library deep dive |
| `references/typography.md` | 150 | Font selection + fluid scales |
| `references/color-systems.md` | 120 | OKLCH + palette generation |
| `references/layout-spacing.md` | 100 | Grid + fluid design |
| `references/accessibility.md` | 150 | WCAG + ARIA + legal |

#### Category 3: JSON Validity (10 checks)

Every `.json` file must be parseable:

```bash
# Use python3 -m json.tool or jq to validate:
domain-map.json
assets/fonts/font-stacks.json
assets/tokens/domain-tokens/fintech.json
assets/tokens/domain-tokens/healthcare.json
assets/tokens/domain-tokens/devtools.json
assets/tokens/domain-tokens/ecommerce.json
assets/tokens/domain-tokens/education.json
assets/tokens/domain-tokens/media.json
assets/tokens/domain-tokens/government.json
assets/tokens/domain-tokens/creative.json
evals/evals.json
```

Implementation: `python3 -m json.tool "$file" > /dev/null 2>&1`

#### Category 4: Required Section Headers in Markdown Files (17 checks)

Each reference `.md` file must contain its required `## ` section headers as specified
in Part 3. The script uses `grep -c` to verify.

Required headers per file:

```bash
# references/web-react.md must contain:
"## Recommended Stack"
"## Component Libraries"
"## Code Patterns"
"## Anti-Patterns"
"## Exemplar Sites"

# references/typography.md must contain:
"## Font Selection"
"## Font Pairing"
"## Fluid Type Scale"
"## Variable Fonts"
"## Anti-Patterns"

# references/anti-patterns.md must contain:
"## Why AI Output Converges"
"## The Telltale Signs"
"## The Counter-Techniques"
"## Pre-Delivery Audit Protocol"

# (Similar checks for all 17 reference files — see Part 3 for required sections per file)
```

Implementation: For each file, grep for each required header. Fail if any are missing.

#### Category 5: CSS Custom Property Checks (6 checks)

CSS files must contain their expected custom properties:

```bash
# fluid-type-scale.css must contain:
grep -q "\-\-step-0" assets/css/fluid-type-scale.css       # base step
grep -q "\-\-step-5" assets/css/fluid-type-scale.css       # largest step
grep -q "clamp(" assets/css/fluid-type-scale.css            # fluid values

# fluid-space-scale.css must contain:
grep -q "\-\-space-s" assets/css/fluid-space-scale.css      # base space
grep -q "clamp(" assets/css/fluid-space-scale.css           # fluid values

# motion-tokens.css must contain:
grep -q "\-\-motion-duration" assets/css/motion-tokens.css
grep -q "\-\-motion-ease" assets/css/motion-tokens.css

# semantic.css must contain:
grep -q "\-\-color-bg-primary" assets/css/color-tokens/semantic.css
grep -q "\-\-color-text-primary" assets/css/color-tokens/semantic.css
grep -q "\-\-color-accent-primary" assets/css/color-tokens/semantic.css

# primitives-light.css must contain oklch values:
grep -q "oklch" assets/css/color-tokens/primitives-light.css

# primitives-dark.css must contain oklch values:
grep -q "oklch" assets/css/color-tokens/primitives-dark.css
```

#### Category 6: SVG Validity (5 checks)

Each SVG file must be well-formed XML:

```bash
# Check each .svg file starts with <?xml or <svg and is parseable
python3 -c "import xml.etree.ElementTree as ET; ET.parse('$file')"
```

#### Category 7: Template Theme Markers (18 checks)

Every template file must contain a theme injection comment — the marker that tells
the agent where to customize:

```bash
# Web templates: look for "THEME" in comments
grep -qi "theme" templates/web/dashboard.tsx
grep -qi "theme" templates/web/landing-page.html
grep -qi "theme" templates/web/saas-app.tsx
grep -qi "theme" templates/web/artifact-react.jsx

# Mobile templates: look for "THEME" or "Design Tokens"
grep -qi "theme\|design.token" templates/mobile/swiftui-app.swift
grep -qi "theme\|design.token" templates/mobile/compose-app.kt
grep -qi "theme\|design.token" templates/mobile/react-native-app.tsx

# Desktop, CLI, document, dataviz templates: same pattern
# (all 18 template files must have theme markers)
```

#### Category 8: Domain Token Schema Compliance (8 checks)

Each domain token JSON must contain the required top-level keys:

```bash
# For each domain token file, verify required keys exist:
python3 -c "
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
required = ['domain', 'colors', 'typography', 'shape', 'motion', 'shadows']
missing = [k for k in required if k not in data]
if missing:
    print(f'Missing keys: {missing}')
    sys.exit(1)
# Check colors has light and dark
for mode in ['light', 'dark']:
    if mode not in data['colors']:
        print(f'Missing colors.{mode}')
        sys.exit(1)
    required_colors = [
        '--color-bg-primary', '--color-text-primary', '--color-accent-primary',
        '--color-border', '--color-error', '--color-success'
    ]
    for c in required_colors:
        if c not in data['colors'][mode]:
            print(f'Missing {mode} color: {c}')
            sys.exit(1)
"
```

#### Category 9: SKILL.md Frontmatter Check (1 check)

```bash
# SKILL.md must start with --- frontmatter and contain name + description
head -20 SKILL.md | grep -q "^name: anti-slop-design"
head -50 SKILL.md | grep -q "description:"
```

#### Category 10: domain-map.json Structure Check (1 check)

```bash
# Must have 8 domains and signal_keywords
python3 -c "
import json
with open('domain-map.json') as f:
    data = json.load(f)
assert len(data['domains']) == 8, f'Expected 8 domains, got {len(data[\"domains\"])}'
assert 'signal_keywords' in data, 'Missing signal_keywords'
for domain in data['domains']:
    assert domain in data['signal_keywords'], f'Missing keywords for {domain}'
    assert len(data['signal_keywords'][domain]) >= 10, f'{domain} has <10 keywords'
"
```

### Total check count

| Category | Checks |
|---|---|
| File existence | 55 |
| Minimum line counts | 18 |
| JSON validity | 11 |
| Required section headers | ~60 (variable per file) |
| CSS custom properties | ~12 |
| SVG validity | 5 |
| Template theme markers | 18 |
| Domain token schema | 8 |
| SKILL.md frontmatter | 1 |
| domain-map.json structure | 1 |
| **TOTAL** | **~189** |

### Script structure spec

```bash
#!/usr/bin/env bash
set -euo pipefail

SKILL_ROOT="${1:-.}"
PASS=0
FAIL=0

check() {
  local description="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "✓ PASS: $description"
    ((PASS++))
  else
    echo "✗ FAIL: $description"
    ((FAIL++))
  fi
}

check_file() {
  check "File exists: $1" test -f "$SKILL_ROOT/$1"
}

check_min_lines() {
  local file="$1" min="$2"
  check "Min lines ($min): $file" bash -c "[ \$(wc -l < '$SKILL_ROOT/$file') -ge $min ]"
}

check_json() {
  check "Valid JSON: $1" python3 -m json.tool "$SKILL_ROOT/$1"
}

check_grep() {
  local file="$1" pattern="$2" desc="$3"
  check "$desc" grep -qi "$pattern" "$SKILL_ROOT/$file"
}

# === FILE EXISTENCE ===
echo "=== File Existence Checks ==="
check_file "SKILL.md"
check_file "domain-map.json"
# ... (all 55 files)

# === MINIMUM LINE COUNTS ===
echo ""
echo "=== Minimum Line Count Checks ==="
check_min_lines "SKILL.md" 300
# ... (all 18 files)

# === JSON VALIDITY ===
echo ""
echo "=== JSON Validity Checks ==="
check_json "domain-map.json"
# ... (all 11 JSON files)

# ... (remaining categories)

# === SUMMARY ===
echo ""
TOTAL=$((PASS + FAIL))
echo "================================"
echo "Results: $PASS/$TOTAL checks passed"
if [ "$FAIL" -gt 0 ]; then
  echo "$FAIL checks FAILED"
  exit 1
else
  echo "ALL CHECKS PASSED ✓"
  exit 0
fi
```

### Validation criteria for validate-skill.sh itself
- [ ] File is executable (`chmod +x`)
- [ ] Accepts optional skill root directory argument
- [ ] Implements all 10 check categories
- [ ] Outputs per-check results with ✓/✗ prefix
- [ ] Exits 0 on full pass, 1 on any failure
- [ ] Summary line shows pass/total count
- [ ] Script is ≥100 lines


---

## 5.2 PHASED BUILD ORDER

The builder (Claude Code session or human) should follow this sequence. Each phase
has a validation gate — run `validate-skill.sh` (or the subset of checks relevant
to that phase) before proceeding to the next.

### Phase 1 — Foundations (Build First)

**Goal**: The decision engine core + base assets that everything else depends on.

**Files to create**:
1. `SKILL.md` — Full hub document per Part 1 spec (§1.4 + §1.5)
2. `domain-map.json` — Complete 8-domain profile per Part 2 spec (§2.1-§2.4)
3. `references/anti-patterns.md` — The philosophy bible per Part 2 spec (§2.5)
4. `assets/css/modern-reset.css` — Per Part 4 spec (§4.1)
5. `assets/css/color-tokens/primitives-light.css` — Per Part 4 spec (§4.3)
6. `assets/css/color-tokens/primitives-dark.css` — Per Part 4 spec (§4.3)
7. `assets/css/color-tokens/semantic.css` — Per Part 4 spec (§4.3)
8. `scripts/validate-skill.sh` — Per Part 5 spec (§5.1)

**Validation gate**: Run validate-skill.sh — expect ~30 passes (these files) + ~159 fails (remaining files). The core 8 files should all pass their checks.

**Why this order**: SKILL.md references domain-map.json. Both reference anti-patterns.md. The CSS tokens define the variable names that all templates and domain tokens use. The validation script lets you check your work as you build.

---

### Phase 2 — Web Platform (Highest Usage)

**Goal**: Complete the web stack — the most commonly triggered platform.

**Files to create**:
1. `references/web-react.md` — Per Part 3 spec (§3.1)
2. `references/web-landing.md` — Per Part 3 spec (§3.2)
3. `references/web-artifacts.md` — Per Part 3 spec (§3.3)
4. `references/typography.md` — Per Part 3 spec (§3.10)
5. `references/color-systems.md` — Per Part 3 spec (§3.11)
6. `templates/web/dashboard.tsx` — Per Part 4 spec (§4.7)
7. `templates/web/landing-page.html` — Per Part 4 spec (§4.7)
8. `templates/web/saas-app.tsx` — Per Part 4 spec (§4.7)
9. `templates/web/artifact-react.jsx` — Per Part 4 spec (§4.7)
10. `assets/svg/grain-overlay.svg` — Per Part 4 spec (§4.4)
11. `assets/svg/dot-grid.svg` — Per Part 4 spec (§4.4)
12. `assets/svg/blob-organic.svg` — Per Part 4 spec (§4.4)
13. `assets/svg/noise-subtle.svg` — Per Part 4 spec (§4.4)
14. `assets/svg/diagonal-lines.svg` — Per Part 4 spec (§4.4)
15. `assets/fonts/font-stacks.json` — Per Part 4 spec (§4.5)
16. `assets/fonts/loading-snippet.html` — Per Part 4 spec (§4.5)
17. All 8 domain token files: `assets/tokens/domain-tokens/{domain}.json` — Per Part 2 spec (§2.7)
18. `assets/tokens/_extensibility.md` — Per Part 2 spec (§2.4)

**Validation gate**: Re-run validate-skill.sh — expect ~80 passes. All web-related checks should pass.

---

### Phase 3 — Data & Motion

**Goal**: Charts, animations, spatial layout — the "wow factor" layer.

**Files to create**:
1. `references/dataviz.md` — Per Part 3 spec (§3.4)
2. `references/animation-motion.md` — Per Part 3 spec (§3.9)
3. `references/layout-spacing.md` — Per Part 3 spec (§3.12)
4. `templates/dataviz/recharts-dashboard.tsx` — Per Part 4 spec (§4.7)
5. `templates/dataviz/d3-editorial.html` — Per Part 4 spec (§4.7)
6. `templates/dataviz/nivo-cards.tsx` — Per Part 4 spec (§4.7)
7. `assets/css/fluid-type-scale.css` — Per Part 4 spec (§4.2)
8. `assets/css/fluid-space-scale.css` — Per Part 4 spec (§4.2)
9. `assets/css/motion-tokens.css` — Per Part 4 spec (§4.2)

**Validation gate**: Re-run — expect ~110 passes.

---

### Phase 4 — Mobile & Desktop

**Goal**: Native and cross-platform mobile + desktop applications.

**Files to create**:
1. `references/mobile-native.md` — Per Part 3 spec (§3.5)
2. `references/mobile-crossplatform.md` — Per Part 3 spec (§3.6)
3. `references/desktop.md` — Per Part 3 spec (§3.7)
4. `templates/mobile/swiftui-app.swift` — Per Part 4 spec (§4.7)
5. `templates/mobile/compose-app.kt` — Per Part 4 spec (§4.7)
6. `templates/mobile/react-native-app.tsx` — Per Part 4 spec (§4.7)
7. `templates/desktop/electron-app.html` — Per Part 4 spec (§4.7)
8. `templates/desktop/tauri-app.html` — Per Part 4 spec (§4.7)

**Validation gate**: Re-run — expect ~140 passes.

---

### Phase 5 — Documents, CLI, Email

**Goal**: Non-web output formats.

**Files to create**:
1. `references/cli-terminal.md` — Per Part 3 spec (§3.8)
2. `references/pdf-print.md` — Per Part 3 spec (§3.13)
3. `references/email.md` — Per Part 3 spec (§3.14)
4. `templates/cli/node-cli.ts` — Per Part 4 spec (§4.7)
5. `templates/cli/python-tui.py` — Per Part 4 spec (§4.7)
6. `templates/cli/go-tui.go` — Per Part 4 spec (§4.7)
7. `templates/documents/typst-report.typ` — Per Part 4 spec (§4.7)
8. `templates/documents/react-pdf-invoice.tsx` — Per Part 4 spec (§4.7)
9. `templates/documents/react-email.tsx` — Per Part 4 spec (§4.7)

**Validation gate**: Re-run — expect ~170 passes.

---

### Phase 6 — Polish & Validation

**Goal**: Complete remaining files, run full validation, fix all failures.

**Files to create**:
1. `references/accessibility.md` — Per Part 3 spec (§3.15)
2. `references/_toc.md` — Per Part 3 spec (§3.16)
3. `evals/evals.json` — Per Part 5 spec (§5.3)

**Final validation**:
```bash
chmod +x scripts/validate-skill.sh
./scripts/validate-skill.sh .
# Must output: "ALL CHECKS PASSED ✓" with exit code 0
```

**Quality review**:
1. Read SKILL.md end-to-end — does the decision engine make sense?
2. Pick 3 random reference files — are code snippets correct and runnable?
3. Pick 2 random templates — do theme markers exist at all customization points?
4. Pick 2 random domain tokens — do OKLCH values look visually correct?
5. Run the evals (§5.3) mentally — would the skill produce good results for each?

---

### Build timeline estimate

| Phase | Files | Est. Time (Claude Code) | Est. Time (Human) |
|---|---|---|---|
| Phase 1: Foundations | 8 | 15-20 min | 2-3 hours |
| Phase 2: Web | 18 | 25-35 min | 4-6 hours |
| Phase 3: Data & Motion | 9 | 15-20 min | 2-3 hours |
| Phase 4: Mobile & Desktop | 8 | 15-20 min | 3-4 hours |
| Phase 5: Docs/CLI/Email | 9 | 15-20 min | 2-3 hours |
| Phase 6: Polish | 3 | 10-15 min | 1-2 hours |
| **TOTAL** | **55** | **~1.5-2 hours** | **~15-20 hours** |


---

## 5.3 EVALS/EVALS.JSON — TEST CASES

The `evals/evals.json` file contains test prompts that exercise the skill across domains
and platforms. These are used during skill development to verify the skill produces
quality output.

### Schema

```json
{
  "skill_name": "anti-slop-design",
  "evals": [
    {
      "id": 1,
      "prompt": "The user's task prompt",
      "expected_output": "Description of what good output looks like",
      "domain": "which domain this tests",
      "platform": "which platform this tests",
      "difficulty": "basic | intermediate | advanced",
      "files": []
    }
  ]
}
```

### Required test prompts (minimum 12, covering all domains and platforms)

```json
{
  "skill_name": "anti-slop-design",
  "evals": [
    {
      "id": 1,
      "prompt": "Build me a dashboard for our payment analytics platform. It needs to show transaction volume over time, success/failure rates, a revenue summary card, and a recent transactions table. We're a B2B fintech startup — think Stripe Dashboard vibes but with our own identity.",
      "expected_output": "React dashboard with: fintech token overlay applied (navy/institutional palette, Plus Jakarta Sans headings), Recharts or Nivo for charts with custom fintech color palette, NOT default chart colors, tabular monospace font for currency figures, 8px border-radius cards, subtle shadows, data table with proper alignment. NO purple gradients, NO Inter as heading font, NO stock imagery.",
      "domain": "fintech",
      "platform": "web-react",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 2,
      "prompt": "Create a landing page for a meditation and therapy app called 'Stillwater'. It should have a hero section with a calming feel, feature highlights for guided meditation/therapy matching/progress tracking, testimonials from users, and a download CTA. Target audience is adults dealing with anxiety.",
      "expected_output": "Single-page HTML with: healthcare token overlay (calming teal/blue-green palette, Outfit headings, DM Sans body), spacious layout with generous whitespace, 44px minimum tap targets, ≥18px body text, rounded corners (12-16px), gentle breathing animations only, soft illustrations not stock photos. NO red accents, NO dense layouts, NO fast/jarring animations.",
      "domain": "healthcare",
      "platform": "web-landing",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 3,
      "prompt": "I need a React component for a CLI tool's web documentation site. It should be a command reference page showing available commands, their flags, and examples — similar to how Vercel or Raycast document their CLI tools. Dark mode by default.",
      "expected_output": "React component with: devtools token overlay (dark-first, #0A0A0F background, Geist Sans + Geist Mono, vivid accent glows), bento-style command cards, monospace code blocks with syntax highlighting, 1px borders not shadows, dot-grid background texture, command palette aesthetic. NO light theme default, NO serif fonts, NO rounded corners >12px.",
      "domain": "devtools",
      "platform": "web-react",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 4,
      "prompt": "Design a product detail page for a high-end watch e-commerce site. One hero image, a product title, price, description, variants selector, and add-to-cart button. Think luxury — Apple Store meets Mr. Porter.",
      "expected_output": "HTML page with: ecommerce token overlay (warm cream palette, Cormorant Garamond serif headings with uppercase + tracking, Lato body), 0px border-radius, NO shadows, full-bleed hero image, generous whitespace, slow cinematic hover zoom on product image, editorial typography with perfect-fourth scale. NO bright primary colors, NO rounded buttons, NO stock photography placeholders.",
      "domain": "ecommerce",
      "platform": "web-landing",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 5,
      "prompt": "Build a quiz/lesson completion screen as a Claude artifact for a language learning app. Show the user's score (8/10), XP earned, streak count, and a 'Continue' button. Make it feel rewarding and fun.",
      "expected_output": "React JSX artifact with: education tokens inlined (vibrant green #58CC02, Nunito 800 weight, 16px+ radius), spring animation on the score reveal, confetti or particle effect for celebration, XP counter that ticks up, streak flame icon, bouncy Continue button, bright gold for reward elements. NO corporate styling, NO muted colors, NO static reveal.",
      "domain": "education",
      "platform": "web-artifacts",
      "difficulty": "basic",
      "files": []
    },
    {
      "id": 6,
      "prompt": "Create a long-form article layout for an online magazine. It should have a hero image, article title, author byline with avatar, publication date, body text with pull quotes, inline images, and a related articles section at the bottom. Think of The Verge or Aeon editorial style.",
      "expected_output": "HTML page with: media token overlay (warm paper off-white, Playfair Display headings, Source Serif 4 body, editorial red accent), 65ch max body width, multi-column grid with pull quotes breaking the column, serif body text at 1.65 line height, hairline rule dividers, full-bleed hero, minimal animation. NO sans-serif body text, NO line widths >75ch, NO sidebar ads pattern.",
      "domain": "media",
      "platform": "web-landing",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 7,
      "prompt": "Build a government benefits eligibility checker form. Users enter their household size, income, state, and age to see which programs they qualify for. Must be fully accessible — my organization follows Section 508.",
      "expected_output": "HTML or React form with: government tokens (pure white bg, institutional blue #1D70B8, Noto Sans, 0px radius), single-column layout ≤750px wide, ≥19px body text, 44px+ tap targets, NO decorative animation whatsoever, skip-nav link, all form fields with visible labels (not placeholders), error messages associated via aria-describedby, progressive enhancement (works without JS). NO rounded corners, NO custom fonts that might fail, NO hamburger menu.",
      "domain": "government",
      "platform": "web-react",
      "difficulty": "advanced",
      "files": []
    },
    {
      "id": 8,
      "prompt": "Design a portfolio website hero section for a motion designer. It should be dramatic, showcase their work, and make visitors say 'wow'. Full creative freedom.",
      "expected_output": "HTML page with: creative tokens (bold vermillion/coral + electric purple accents, Clash Display headings, Satoshi body, 0px radius + dramatic shadows), asymmetric layout, kinetic typography on the hero, scroll-driven parallax, custom cursor effect, grain overlay texture, staggered page-load animation, full-bleed composition. NO safe corporate styling, NO symmetric centered layout, NO static page. MUST respect prefers-reduced-motion with fade alternatives.",
      "domain": "creative",
      "platform": "web-landing",
      "difficulty": "advanced",
      "files": []
    },
    {
      "id": 9,
      "prompt": "Create a SwiftUI view for a patient medication tracker. Show today's medications in a list, each with name, dosage, time, and a taken/not-taken toggle. The design should feel calming and approachable.",
      "expected_output": "SwiftUI code with: healthcare-inspired custom design tokens (calming teal accent, Outfit-style rounded sans heading, 12-16px corner radius, spacious padding), 44pt minimum tap targets, VoiceOver-compatible toggle buttons with accessibility labels, gentle spring animation on toggle, high contrast text. NO red as primary color, NO dense list rows, NO small text.",
      "domain": "healthcare",
      "platform": "mobile-native",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 10,
      "prompt": "Build a Bubbletea TUI app in Go for a git branch manager. Show a list of local branches with indicators for current branch and recent activity. Support keyboard navigation to switch, delete, or create branches.",
      "expected_output": "Go code using Bubbletea + Lip Gloss + Bubbles with: green ✓ for current branch, color-coded recency indicators, Unicode box-drawing borders (rounded ╭╮╰╯), braille spinner for operations, two-column layout (branches + details), keyboard shortcut hints at bottom, proper terminal color support with ANSI 256. NO plain unformatted text, NO missing keyboard hints.",
      "domain": "devtools",
      "platform": "cli",
      "difficulty": "advanced",
      "files": []
    },
    {
      "id": 11,
      "prompt": "Generate a professional quarterly business report as a PDF using Typst. Include a cover page, executive summary, 3 sections with charts placeholders, and a conclusion. For a management consulting firm.",
      "expected_output": "Typst document with: professional token overlay adapted to Typst (serif headings, clean sans body, navy accent), proper page margins, header/footer with page numbers, table of contents, consistent heading hierarchy, figure captions, clean table styling. NO LaTeX syntax, NO default Typst styling without customization.",
      "domain": "fintech",
      "platform": "pdf",
      "difficulty": "intermediate",
      "files": []
    },
    {
      "id": 12,
      "prompt": "Create a transactional email template for order confirmation. Show order number, items purchased with images, total, shipping address, and tracking link. Must look good in both Gmail and Outlook.",
      "expected_output": "React Email or MJML template with: ecommerce-appropriate styling (warm neutrals, serif heading if email-safe, clean product cards), table-based layout for Outlook compatibility, dark mode meta tags, off-white backgrounds (not pure #FFFFFF), inline styles, MSO conditional comments for Outlook fallbacks, ≥14px body text, high-contrast links. NO CSS flexbox/grid in email, NO web fonts without fallbacks, NO pure black on pure white.",
      "domain": "ecommerce",
      "platform": "email",
      "difficulty": "advanced",
      "files": []
    }
  ]
}
```

### Eval coverage matrix

| Domain | basic | intermediate | advanced | Total |
|---|---|---|---|---|
| fintech | — | 2 (web, pdf) | — | 2 |
| healthcare | — | 2 (web, mobile) | — | 2 |
| devtools | — | 1 (web) | 1 (cli) | 2 |
| ecommerce | — | 1 (web) | 1 (email) | 2 |
| education | 1 (artifact) | — | — | 1 |
| media | — | 1 (web) | — | 1 |
| government | — | — | 1 (web) | 1 |
| creative | — | — | 1 (web) | 1 |
| **Total** | **1** | **7** | **4** | **12** |

| Platform | Count |
|---|---|
| web-react | 3 |
| web-landing | 4 |
| web-artifacts | 1 |
| mobile-native | 1 |
| cli | 1 |
| pdf | 1 |
| email | 1 |
| **Total** | **12** |

### Validation criteria for evals.json
- [ ] Valid JSON matching the schema above
- [ ] ≥12 test prompts
- [ ] Every domain represented at least once
- [ ] ≥5 distinct platforms represented
- [ ] Each eval has: id, prompt (≥30 words), expected_output (≥30 words), domain, platform, difficulty
- [ ] Prompts are realistic user requests with context (not abstract like "make a dashboard")
- [ ] Expected outputs include specific anti-slop criteria (what MUST and MUST NOT appear)


---

## 5.4 MASTER VALIDATION CHECKLIST

This is the human-readable companion to `validate-skill.sh`. The builder checks every
row manually (or references the script output). This is the FINAL sign-off before
the skill package is considered complete.

### Core Architecture

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 1 | `SKILL.md` exists and is 300-500 lines | Part 1 §1.6 | ☐ |
| 2 | `SKILL.md` frontmatter has name `anti-slop-design` | Part 1 §1.4 | ☐ |
| 3 | `SKILL.md` description mentions all output types (web, mobile, desktop, CLI, PDF, email, dataviz) | Part 1 §1.4 | ☐ |
| 4 | `SKILL.md` contains Design Thinking Protocol (5 steps) | Part 1 §1.5B | ☐ |
| 5 | `SKILL.md` contains Anti-Slop Checklist (15 rules) | Part 1 §1.5C | ☐ |
| 6 | `SKILL.md` contains Asset Usage Guide | Part 1 §1.5D | ☐ |
| 7 | `SKILL.md` contains Platform Routing Table with all output types | Part 1 §1.5E | ☐ |
| 8 | `SKILL.md` contains Claude.ai Artifact Mode section | Part 1 §1.5F | ☐ |
| 9 | `domain-map.json` is valid JSON with 8 domains | Part 2 §2.1 | ☐ |
| 10 | Each domain has ALL DomainProfile keys (none missing) | Part 2 §2.1 | ☐ |
| 11 | `signal_keywords` has ≥15 keywords per domain | Part 2 §2.3 | ☐ |
| 12 | `extensibility.template` has all DomainProfile keys | Part 2 §2.4 | ☐ |

### Reference Files

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 13 | `references/_toc.md` exists with entries for all 16 reference files | Part 3 §3.16 | ☐ |
| 14 | `references/web-react.md` ≥150 lines with required sections | Part 3 §3.1 | ☐ |
| 15 | `references/web-landing.md` ≥120 lines with required sections | Part 3 §3.2 | ☐ |
| 16 | `references/web-artifacts.md` ≥100 lines with required sections | Part 3 §3.3 | ☐ |
| 17 | `references/dataviz.md` ≥150 lines with required sections | Part 3 §3.4 | ☐ |
| 18 | `references/mobile-native.md` ≥150 lines with required sections | Part 3 §3.5 | ☐ |
| 19 | `references/mobile-crossplatform.md` ≥120 lines with required sections | Part 3 §3.6 | ☐ |
| 20 | `references/desktop.md` ≥100 lines with required sections | Part 3 §3.7 | ☐ |
| 21 | `references/cli-terminal.md` ≥100 lines with required sections | Part 3 §3.8 | ☐ |
| 22 | `references/animation-motion.md` ≥150 lines with required sections | Part 3 §3.9 | ☐ |
| 23 | `references/typography.md` ≥150 lines with required sections | Part 3 §3.10 | ☐ |
| 24 | `references/color-systems.md` ≥120 lines with required sections | Part 3 §3.11 | ☐ |
| 25 | `references/layout-spacing.md` ≥100 lines with required sections | Part 3 §3.12 | ☐ |
| 26 | `references/pdf-print.md` ≥100 lines with required sections | Part 3 §3.13 | ☐ |
| 27 | `references/email.md` ≥100 lines with required sections | Part 3 §3.14 | ☐ |
| 28 | `references/accessibility.md` ≥150 lines with required sections | Part 3 §3.15 | ☐ |
| 29 | `references/anti-patterns.md` ≥250 lines with required sections | Part 2 §2.5 | ☐ |
| 30 | Every reference file has ≥3 concrete code snippets | Part 3 (all) | ☐ |
| 31 | Every reference file has ≥3 named anti-patterns with alternatives | Part 3 (all) | ☐ |
| 32 | No reference file exceeds 400 lines (keep focused) | Part 3 (all) | ☐ |

### Assets — CSS

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 33 | `modern-reset.css` exists and contains `box-sizing: border-box` | Part 4 §4.1 | ☐ |
| 34 | `fluid-type-scale.css` contains `--step-{-2..5}` with `clamp()` values | Part 4 §4.2 | ☐ |
| 35 | `fluid-space-scale.css` contains `--space-{3xs..3xl}` with `clamp()` values | Part 4 §4.2 | ☐ |
| 36 | `motion-tokens.css` contains `--motion-duration-*` and `--motion-ease-*` | Part 4 §4.2 | ☐ |
| 37 | `primitives-light.css` contains OKLCH values for all semantic tokens | Part 4 §4.3 | ☐ |
| 38 | `primitives-dark.css` contains OKLCH values (NOT pure #000000 bg) | Part 4 §4.3 | ☐ |
| 39 | `semantic.css` maps `--color-bg-primary` etc. to `var(--primitive-*)` | Part 4 §4.3 | ☐ |
| 40 | No CSS file contains `#FFFFFF` or `#000000` as background (warm off-whites/grays) | Anti-slop Rule 4-5 | ☐ |

### Assets — SVG

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 41 | All 5 SVG files are valid XML | Part 4 §4.4 | ☐ |
| 42 | `grain-overlay.svg` uses `feTurbulence` filter | Part 4 §4.4 | ☐ |
| 43 | SVG files are optimized (no unnecessary metadata/editor cruft) | Part 4 §4.4 | ☐ |

### Assets — Fonts & Tokens

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 44 | `font-stacks.json` is valid JSON with ≥6 aesthetic categories | Part 4 §4.5 | ☐ |
| 45 | `font-stacks.json` does NOT list Inter as a primary heading font in any stack | Anti-slop Rule 1 | ☐ |
| 46 | `loading-snippet.html` includes `<link rel="preload">` and `font-display: swap` | Part 4 §4.5 | ☐ |
| 47 | All 8 domain token JSON files are valid and contain required keys | Part 2 §2.7 | ☐ |
| 48 | All OKLCH values in token files match domain profiles from Part 2 §2.2 | Part 2 §2.2 | ☐ |
| 49 | No two domain token files share the same `accent_primary` color | Uniqueness check | ☐ |
| 50 | `_extensibility.md` contains step-by-step guide for adding domains | Part 2 §2.4 | ☐ |

### Templates

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 51 | All 18 template files exist | Part 1 §1.3 | ☐ |
| 52 | All templates contain theme injection markers (`THEME` or `Design Token`) | Part 4 §4.7 | ☐ |
| 53 | Web templates include responsive design (media/container queries or fluid) | Part 4 §4.7 | ☐ |
| 54 | Web templates include accessibility baseline (semantic HTML, focus styles) | Part 4 §4.7 | ☐ |
| 55 | `artifact-react.jsx` works as a self-contained Claude.ai artifact | Part 4 §4.7 | ☐ |
| 56 | Mobile templates include platform-specific design token architecture | Part 4 §4.7 | ☐ |
| 57 | CLI templates include color support and Unicode box-drawing | Part 4 §4.7 | ☐ |
| 58 | Document templates include professional typography and page layout | Part 4 §4.7 | ☐ |

### Validation & Eval

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 59 | `validate-skill.sh` is executable and exits 0 on the final package | Part 5 §5.1 | ☐ |
| 60 | `evals/evals.json` contains ≥12 test prompts covering all 8 domains | Part 5 §5.3 | ☐ |
| 61 | Each eval has realistic prompt (≥30 words), expected_output with anti-slop criteria | Part 5 §5.3 | ☐ |
| 62 | ≥5 distinct platforms represented in evals | Part 5 §5.3 | ☐ |

### Cross-Cutting Quality

| # | Check | Spec Ref | Pass? |
|---|---|---|---|
| 63 | No two domains share the same primary heading font family | Part 2 §2.2 | ☐ |
| 64 | SKILL.md decision engine covers all 8 domains + all platforms | Part 1 §1.5 | ☐ |
| 65 | Anti-patterns checklist in SKILL.md has ≥15 items with detection heuristics | Part 1 §1.5C | ☐ |
| 66 | Every domain has ≥3 exemplar sites in domain-map.json | Part 2 §2.2 | ☐ |
| 67 | `prefers-reduced-motion` is addressed in: SKILL.md, animation-motion.md, accessibility.md | Part 1+3 | ☐ |
| 68 | WCAG 2.2 AA compliance is mentioned as hard constraint in ≥3 files | Parts 1-3 | ☐ |
| 69 | Total file count is exactly 55 | Part 1 §1.3 | ☐ |
| 70 | Running `validate-skill.sh` outputs `ALL CHECKS PASSED ✓` | Part 5 §5.1 | ☐ |

**Total manual checks: 70**


---

## 5.5 PACKAGING AND DISTRIBUTION

After all checks pass, the skill package should be assembled for installation.

### Using the skill-creator packaging script

```bash
# From the parent directory containing anti-slop-design/
python -m scripts.package_skill anti-slop-design/
# Produces: anti-slop-design.skill
```

If the skill-creator packaging script isn't available, manually create a `.skill` file:

```bash
cd anti-slop-design/
tar -czf ../anti-slop-design.skill .
```

### Installation verification

After packaging, verify the `.skill` file:

```bash
# Extract to temp directory
mkdir /tmp/skill-verify
tar -xzf anti-slop-design.skill -C /tmp/skill-verify

# Run validation
cd /tmp/skill-verify
chmod +x scripts/validate-skill.sh
./scripts/validate-skill.sh .

# Should output: ALL CHECKS PASSED ✓
```

### Claude.ai skill installation

In Claude.ai, users install skills through the Projects feature:
1. Upload the `.skill` file as a project resource
2. The skill files become available in the project context
3. Claude reads `SKILL.md` when the skill triggers

### Claude Code skill installation

In Claude Code, skills are typically placed in a user skills directory:
```bash
# Extract to user skills directory
mkdir -p ~/.claude/skills/anti-slop-design
tar -xzf anti-slop-design.skill -C ~/.claude/skills/anti-slop-design
```

---

## 5.6 SPEC DOCUMENT MAP

This section ties together all 5 spec parts into one cross-reference.

### Part 1: Architecture + SKILL.md Spec (677 lines)
- §1.1 Purpose and Identity
- §1.2 Runtime Environment (Claude Code + claude.ai degradation)
- §1.3 Complete Directory Tree (55 files)
- §1.4 SKILL.md Frontmatter Spec
- §1.5 SKILL.md Body Spec (Sections A-F)
  - A: Opening Paragraph
  - B: Design Thinking Protocol (5 steps)
  - C: Anti-Slop Checklist (15 rules)
  - D: Asset Usage Guide
  - E: Platform Routing Table
  - F: Claude.ai Artifact Mode
- §1.6 Line Budget
- §1.7 Progressive Disclosure Flow
- §1.8 Relationship to Existing Skills
- §1.9 Part 1 Validation Checklist

### Part 2: Decision Engine + domain-map.json + Anti-Patterns (1447 lines)
- §2.1 domain-map.json Schema (DomainProfile object)
- §2.2 The 8 Core Domain Profiles
  - fintech (minimal-trust)
  - healthcare (calm-reassuring)
  - devtools (linear-dark)
  - ecommerce (editorial-cinematic)
  - education (playful-gamified)
  - media (editorial-typographic)
  - government (functional-accessible)
  - creative (bold-experimental)
- §2.3 Signal Keywords Taxonomy (≥15 per domain)
- §2.4 Extensibility Pattern
- §2.5 Anti-Patterns Reference File Spec
- §2.6 Axes Defaults and Conflict Resolution
- §2.7 Domain Token JSON File Spec
- §2.8 Part 2 Validation Checklist

### Part 3: Reference File Specs (1789 lines)
- §3.1–§3.16: Specs for all 17 reference files
  - Each has: purpose, required sections, minimum content, code snippets, anti-patterns, exemplars
- §3.17 Part 3 Validation Checklist

### Part 4: Asset Specs + Template Specs (1112 lines)
- §4.1 modern-reset.css spec
- §4.2 Fluid scales + motion tokens specs
- §4.3 Color token CSS files spec
- §4.4 SVG texture files spec
- §4.5 Font assets spec
- §4.6 Domain token JSON implementation guidance
- §4.7 Template specs (all 18 templates across 6 platform categories)
- §4.8 Part 4 Validation Checklist

### Part 5: Validation, Build Order, Evals (this document)
- §5.1 validate-skill.sh full script spec (~189 checks across 10 categories)
- §5.2 Phased Build Order (6 phases with validation gates)
- §5.3 evals/evals.json test cases (12 evals across 8 domains, 7 platforms)
- §5.4 Master Validation Checklist (70 manual checks)
- §5.5 Packaging and Distribution
- §5.6 Spec Document Map (this section)
- §5.7 Final Notes

---

## 5.7 FINAL NOTES

### For the builder

This spec defines a skill package of 55 files that, together, form the most comprehensive
UI/UX design methodology available to an AI coding agent. The scope is deliberately
ambitious — the goal is not perfection on the first pass, but a complete structure that
can be refined through the eval loop.

**Priority guidance**: If you're running low on time or context:
1. Phase 1 (Foundations) is non-negotiable — everything depends on it
2. Phase 2 (Web) serves ~80% of real-world requests
3. Phases 3-5 can be built incrementally as needed
4. Phase 6 (Polish) ensures nothing was missed

**Quality over quantity**: A 150-line reference file with 5 excellent code snippets
and 3 actionable anti-patterns is better than a 400-line file full of generic prose.
Every line should earn its place in the context window.

**The anti-slop philosophy in practice**: As you build this skill, practice what it
preaches. Don't default to generic patterns. Don't copy-paste between domain profiles.
Make each file distinctive and purposeful. If you catch yourself writing something that
"all 8 domains" share identically, question whether it should be in the domain-specific
file at all versus the shared SKILL.md.

### Research sources

The spec draws from research conducted in this conversation session, covering:
- CSS frameworks and modern CSS features (2025-2026 state)
- Typography trends and variable font capabilities
- Component library landscape (shadcn/ui, Aceternity, Mantine, Tremor, etc.)
- Data visualization libraries and NYT Graphics team approaches
- Animation/motion libraries (Motion v12, GSAP post-Webflow, CSS scroll-driven)
- Color science (OKLCH, Radix Colors, APCA)
- Mobile frameworks (SwiftUI iOS 26, Compose Material3 1.4, Flutter Impeller)
- Desktop frameworks (Electron optimization, Tauri 2.0)
- CLI/TUI frameworks (Bubbletea/Charm, Textual, Ratatui, Ink, Clack)
- PDF generation (Typst v0.14, React-PDF v4.3)
- Email rendering (React Email v5, MJML, dual-Outlook problem)
- Accessibility (WCAG 2.2, European Accessibility Act, APCA)
- AI slop identification and counter-techniques

The original research report and extended research artifact should be preserved as
companion documents for reference during construction.

---

*End of Part 5. This completes the anti-slop-design skill specification.*
*Total spec: ~5,500 lines across 5 documents + continuation guide.*

