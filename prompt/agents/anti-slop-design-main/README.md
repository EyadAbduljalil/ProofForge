# anti-slop-design

Claude Code skill that makes AI stop generating the same website.

![Files](https://img.shields.io/badge/files-67-blue)
![Domains](https://img.shields.io/badge/domains-8-green)
![Checks](https://img.shields.io/badge/validation-178%2F178-brightgreen)
![Template families](https://img.shields.io/badge/template_families-6-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## Why I Built It

Every AI tool generates the same website. Purple gradient, Inter font, three equal columns, rounded everything, generic SaaS headline. It's not a conspiracy - it's distributional convergence. The model predicts the most likely next token, and the most likely design is the average of everything it trained on. The average of a million websites is a very boring website.

Telling the model "be more creative" doesn't fix this. It's a prompt engineering cope. The model doesn't have taste - it has probability distributions. The fix is structured: give it domain-specific design tokens that override the defaults before generation starts.

That's what this skill does. Eight industry domains (fintech, healthcare, devtools, ecommerce, education, media, government, creative), each with a full token set - OKLCH color palettes, typography stacks, spacing scales, border radius, motion curves, texture preferences. A fintech app gets navy and Plus Jakarta Sans and subtle shadows. A healthcare app gets calming teal and breathing whitespace. Same template, different domain, fundamentally different output.

178 validation checks ensure the tokens are structurally correct. An anti-patterns reference catalogs every convergence pattern so you know exactly which defaults to kill. The goal isn't "different for different's sake" - it's domain-appropriate design that doesn't trigger the "this was clearly AI-generated" reflex in the first three seconds.

I built this after regenerating the same purple gradient portfolio for [Erdos](https://github.com/Cuuper22/Erdos), [ToaruOS-Arnold](https://github.com/Cuuper22/ToaruOS-Arnold), and every other project in this account. The distributional convergence wasn't theoretical - it was my actual portfolio.

What this repo shows about me: I treat taste as something you can operationalize. Not fully automate, not fake, but constrain and test enough that a model has less room to fall back to the average.

## What it does

Intercepts design requests and applies **domain-aware tokens** instead of generic defaults:

| Domain | You get | Instead of |
|--------|---------|------------|
| **Fintech** | Navy/institutional, Plus Jakarta Sans, 8px radius, subtle shadows | Purple gradient, Inter, "modern" look |
| **Healthcare** | Calming teal, Outfit headings, 12-16px radius, breathing space | Same purple gradient, dense layout |
| **Devtools** | Dark-first, Geist Mono, 1px borders, dot-grid texture | ...still that purple gradient |
| **Ecommerce** | Warm cream, Cormorant Garamond, 0px radius, editorial whitespace | You get the pattern |
| **Education** | Vibrant green, Nunito, bouncy animations, reward gold | |
| **Media** | Warm off-white, Playfair Display, 65ch body width, pull quotes | |
| **Government** | Pure white, Noto Sans, 0px radius, zero decorative animation | |
| **Creative** | Vermillion + purple, Clash Display, asymmetric layouts, grain textures | |

All color palettes use [OKLCH](https://oklch.com/) - a perceptually uniform color space where same numeric distance = same visual distance. A navy-to-white gradient in the fintech palette has the same perceptual smoothness as a teal-to-white gradient in the healthcare palette. HEX and HSL can't guarantee this.

## 67 files across 6 template families

```
references/       17 docs - platform guides, anti-patterns, accessibility
templates/         18 starters - React, HTML, SwiftUI, Compose, Electron, Tauri, CLI, PDF, email
assets/            23 files - CSS tokens, SVG textures, font stacks, domain token JSONs
scripts/            3 - validation (178 checks), domain-map generator, eval generator
evals/              1 - 12 test prompts covering all domains × platforms
```

Template families: web, mobile, CLI/TUI, desktop, documents/PDF/email, and dataviz.

Templates span 10+ languages: JSX, TSX, HTML, Kotlin (Jetpack Compose), Swift (SwiftUI), Go (Bubble Tea), TypeScript, Python (Rich), Typst.

## Why not just...

| Approach | What it does | What it misses |
|----------|-------------|---------------|
| Tailwind config | Sets design tokens | One config for all domains. Same look regardless of industry. |
| CSS custom properties | Variables for colors/spacing | No domain awareness. You still pick the values manually. |
| Figma design system | Visual token library | Doesn't integrate with AI code generation. Manual handoff. |
| "Be more creative" prompt | Tells the model to try harder | Doesn't work. The model has no taste - only probability distributions. |
| **anti-slop-design** | Domain-specific tokens injected before generation | Structured intervention that changes the distribution, not the sampling. |

## How it works

1. **SKILL.md** - Hub document. 15-rule Anti-Slop Checklist + 5-step Design Thinking Protocol
2. **domain-map.json** (34KB) - 8 structured domain profiles with full OKLCH palettes, typography, shape, motion tokens
3. **references/** - 17 platform-specific field manuals (React, landing pages, mobile native, CLI, email, etc.)
4. **templates/** - 18 starter files with `/* THEME */` injection points where domain tokens get applied
5. **assets/** - CSS foundations (fluid type scale, spacing scale, motion tokens), SVG textures, font stacks

The `/* THEME */` markers in templates are where domain tokens get applied - same template, different domain = fundamentally different output. The domain map and eval prompts are generated programmatically (`gen-domain-map.py`, `gen-evals.py`), not hand-written.

For the complete specification covering every design decision and rationale, see [anti-slop-design-FULL-SPEC.md](anti-slop-design-FULL-SPEC.md) (271KB). That's not a typo - it covers color science, typography theory, spacing philosophy, motion design, accessibility, platform constraints, and domain differentiation rationale for all 8 industries.

## How To Inspect It

If you are evaluating this as AI tooling work, start with the constraint system, not the marketing idea.

1. Read `SKILL.md` first. That is the entry point an agent actually sees.
2. Open `domain-map.json` and compare two distant domains, such as fintech and creative. The point is not a nicer palette. The point is a different design grammar.
3. Read `references/anti-patterns.md` to see the failure modes the skill is designed to kill.
4. Inspect `templates/web/saas-app.tsx`, `templates/web/landing-page.html`, and `templates/mobile/compose-app.kt` to see how tokens become implementation pressure.
5. Run `bash scripts/validate-skill.sh`. The 161 checks are there because aesthetic systems still need boring structural guarantees.

## Install

Copy the skill folder to your Claude Code skills directory:

```bash
git clone https://github.com/Cuuper22/anti-slop-design.git
cp -r anti-slop-design ~/.claude/skills/anti-slop-design
```

Claude reads `SKILL.md` as the entry point, then routes to the right references and templates based on your prompt.

For lightweight usage without cloning the full repo: [CSS foundations Gist](https://gist.github.com/Cuuper22/050a2b9268cee5e0f3eb0dfc3ae65a19) | [Template starters Gist](https://gist.github.com/Cuuper22/73c54273ea1fa542cc8bf9976deb64e1)

## Validation

```bash
bash scripts/validate-skill.sh
# 178/178 checks passing
```

Checks file existence, JSON validity, minimum line counts, section headers, CSS custom properties, SVG validity, theme markers, and domain token schema compliance.

## Add your own domain

See [`assets/tokens/_extensibility.md`](assets/tokens/_extensibility.md) for the full guide. The short version:

1. Copy an existing domain token JSON (e.g., `devtools.json`)
2. Modify the OKLCH palettes, typography, spacing, motion values
3. Add the new domain to `domain-map.json`
4. Run `validate-skill.sh` to verify

## The anti-pattern bible

[`references/anti-patterns.md`](references/anti-patterns.md) catalogs every convergence pattern in AI-generated design - the purple gradients, the testimonial carousels, the interchangeable SaaS headlines. If you're curious why everything looks the same, start there.

## License

MIT
