# The 14 AI Visual Slop Anti-Patterns

| ID | Anti-Pattern | Description | Enforced Fix |
|---|---|---|---|
| **SLOP-01** | Violet Convergence | Defaulting to purple/indigo gradients on dark backgrounds | Use obsidian neutral palettes (`#0a0d12`, `#121820`) |
| **SLOP-02** | Card Overload | Wrapping every paragraph and icon in nested cards with heavy borders | Use whitespace hierarchy and clean separator lines |
| **SLOP-03** | Pill Button Bloat | Flooding the screen with pill badges that carry no filter/action semantics | Limit badges to actionable filters or strict status tags |
| **SLOP-04** | Low Contrast Text | Using `text-slate-500` on dark backgrounds failing WCAG | Enforce minimum 4.5:1 ratio (`text-slate-300` / `text-slate-100`) |
| **SLOP-05** | Fake Avatars | Stock photo avatars with generic testimonial quotes | Use authentic developer metrics or commit proofs |
| **SLOP-06** | Bouncing Icons | Incessant looping animations distracting the user | Animations must be user-triggered, subtle, and physics-based |
| **SLOP-07** | Broken Arabic RTL | Translating words literally while leaving layouts, arrows, and flex in LTR | True mirror layouts (`rtl:` variants, logical properties `ms-`, `me-`) |
| **SLOP-08** | Inconsistent Spacing | Random mix of `p-3`, `p-5`, `p-7` without a design token scale | Enforce strict 4px/8px rhythm (`p-2`, `p-4`, `p-6`, `p-8`) |
