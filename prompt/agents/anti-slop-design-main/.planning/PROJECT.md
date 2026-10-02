# anti-slop-design

## Vision

A 55-file Claude Code skill that replaces generic AI design output with domain-aware, production-grade aesthetics. The most comprehensive UI/UX design methodology available to an AI coding agent.

## What It Does

Takes any design task — web dashboard, mobile app, CLI tool, PDF report, email template — and routes it through a domain-specific design system. 8 domain profiles (fintech, healthcare, devtools, ecommerce, education, media, government, creative) each with full OKLCH color palettes, typography selections, motion configs, and layout preferences. The skill teaches Claude to produce output that looks like a human designer made it, not an AI.

## Requirements

### Active

- [ ] SKILL.md — decision engine hub (400-500 lines)
- [ ] domain-map.json — 8 domain profiles with signal keywords
- [ ] 17 reference files — deep platform guides with code snippets
- [ ] 7 CSS asset files — reset, fluid scales, motion tokens, color tokens
- [ ] 5 SVG texture files — grain, dot-grid, blob, noise, diagonal
- [ ] 2 font asset files — font stacks JSON + loading snippet
- [ ] 9 token files — 8 domain tokens + extensibility guide
- [ ] 18 template files — web, mobile, desktop, CLI, documents, dataviz
- [ ] Validation script — ~189 automated checks
- [ ] Evals — 12 test prompts covering all domains and platforms
- [ ] All documentation in authentic CooperVoice (non-SFW)

### Out of Scope

- Runtime code execution (this is a reference skill, not an app)
- Backend/API logic
- Design tokens for domains beyond the 8 defined profiles (use extensibility template)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OKLCH color space | Perceptual uniformity, modern browser support | Adopted |
| 8 domain profiles | Covers ~95% of real-world design requests | Adopted |
| 6-phase build order | Per spec: foundations → web → data/motion → mobile/desktop → docs/CLI/email → polish | Adopted |
| Authentic CooperVoice | User directive: all docs in non-SFW authentic voice | Adopted |

## Constraints

- Total exactly 55 files
- Validation script must pass all ~189 checks
- Every reference file must have ≥3 code snippets and ≥3 anti-patterns
- No two domains share same primary heading font or accent color
- All CSS uses OKLCH, never HSL for palette generation
- Banned primary fonts: Inter, Roboto, Open Sans, Lato, Arial, Helvetica, Montserrat, Poppins, Raleway

---
*Last updated: 2026-03-01 after initialization*
