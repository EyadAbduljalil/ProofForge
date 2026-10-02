# Color Systems

Color is where AI slop is most immediately visible. The purple gradient. The pure white
background. The pure black dark mode. Hex values copy-pasted from Tailwind's default
palette. If typography convergence takes a trained eye, color convergence hits you from
across the room.

---

## Why OKLCH

HSL lies to you. Set `hsl(60, 100%, 50%)` (yellow) next to `hsl(240, 100%, 50%)` (blue).
Same saturation, same lightness. But the yellow *screams* and the blue *broods*. Your
eyes disagree with the math. Your eyes are right.

OKLCH is a perceptually uniform color space with three channels:

- **L** (Lightness): 0-1. The critical difference: `L=0.5` *looks* like medium lightness
  across ALL hues. Yellow at L=0.5 and blue at L=0.5 appear equally bright. Not true in
  HSL. Not true in RGB. This is the whole point.
- **C** (Chroma): 0-~0.37. Saturation's honest cousin. Most UI colors live 0.05-0.25.
- **H** (Hue): 0-360 degrees. Same circle as HSL, but perceptually corrected.

Browser support: Chrome 111+, Firefox 113+, Safari 15.4+. Baseline 2023. If you're still
writing `hsl()` for "browser support," you're two years behind.

```css
/* HSL: these look nothing alike in perceived brightness */
.badge-yellow { background: hsl(60, 100%, 50%); }   /* blazing */
.badge-blue   { background: hsl(240, 100%, 50%); }   /* dark */
/* OKLCH: same L = same perceived brightness */
.badge-yellow { background: oklch(0.75 0.18 90); }
.badge-blue   { background: oklch(0.75 0.18 250); }
/* Tints and shades: vary L, hold C and H */
.blue-light   { background: oklch(0.92 0.05 250); }
.blue-dark    { background: oklch(0.35 0.15 250); }
```

Killer feature: build an entire palette by varying L and C while holding H constant. Every
step looks perceptually even. Try that in HSL and watch your mid-tones turn to mud.

---

## Palette Architecture: 3-Tier Token System

Raw colors are not a design system. A design system is the layer of *meaning* between
"this is blue" and "this means interactive."

**Tier 1 — Primitives** (raw values, no meaning):
```css
:root {
  --color-blue-500: oklch(0.62 0.19 250);
  --color-blue-600: oklch(0.52 0.19 250);
  --color-gray-100: oklch(0.96 0.005 260);
  --color-gray-900: oklch(0.15 0.008 260);
}
```

**Tier 2 — Semantic** (purpose, swaps for dark mode):
```css
:root {
  --color-interactive: var(--color-blue-500);
  --color-surface-primary: var(--color-gray-100);
  --color-text-primary: var(--color-gray-900);
  --color-feedback-error: oklch(0.60 0.22 25);
}
```

**Tier 3 — Component** (specific bindings):
```css
:root {
  --button-bg-primary: var(--color-interactive);
  --card-bg: var(--color-surface-elevated);
  --input-border-focus: var(--color-interactive);
}
```

**Why three tiers**: Light/dark mode swaps Tier 2 pointers. Multi-brand/white-label swaps
Tier 1 palette. User customization at runtime sets Tier 1 values via JS. Component
overrides stay isolated in Tier 3. Each change layer has zero blast radius on the others.

**Real-world implementations**:
- **GitHub Primer**: 3-tier, 9 themes (light/dark/dimmed/high-contrast), automated
  contrast checking, 300+ color tokens.
- **Radix Themes**: `accentColor` prop swaps Tier 1 at runtime. 30+ colors, 12-step
  scales. Dark mode is one prop flip.
- **IBM Carbon**: Layering model (`$layer-01`/`$layer-02`/`$layer-03`). 4 themes, 52
  variables per theme. Nested components auto-resolve correct contrast.

---

## Generating Palettes

### The 12-Step Scale (Radix Standard)

| Steps 1-5 | Backgrounds (app, subtle, element, hover, active) | L: 0.97→0.83 |
|------------|---------------------------------------------------|---------------|
| Steps 6-7  | Borders (subtle, default/focus)                   | L: 0.78→0.71 |
| Steps 8-10 | Solids (badge, primary, hover)                    | L: 0.64→0.44 |
| Steps 11-12| Text (low-contrast, high-contrast)                | L: 0.43→0.22 |

### From a Single Brand Color

Convert to OKLCH (oklch.com). Hold H constant. Vary L from 0.99 to 0.25. Vary C: low at
extremes, peak at steps 8-9.

```css
/* Brand: oklch(0.60 0.20 250). Hold H=250, vary L and C: */
:root {
  --blue-1:  oklch(0.99 0.01 250);  --blue-2:  oklch(0.96 0.02 250);
  --blue-3:  oklch(0.93 0.04 250);  --blue-4:  oklch(0.90 0.06 250);
  --blue-5:  oklch(0.86 0.08 250);  --blue-6:  oklch(0.80 0.10 250);
  --blue-7:  oklch(0.73 0.13 250);  --blue-8:  oklch(0.64 0.18 250);
  --blue-9:  oklch(0.55 0.20 250);  --blue-10: oklch(0.49 0.19 250);
  --blue-11: oklch(0.43 0.15 250);  --blue-12: oklch(0.25 0.08 250);
}
```

### Harmony Rotations

- **Complementary**: H+180. Blue (250) → Orange (70). Maximum contrast.
- **Triadic**: H+120, H+240. Three colors, equal spacing.
- **Analogous**: H+/-30. Low contrast, harmonious, safe.
- **Split-complementary**: H+150, H+210. Complement's neighbors, less jarring.

### Tools

- **oklch.com** (Evil Martians) — Canonical OKLCH picker, gamut visualization.
- **Harmonizer** (Evil Martians) — OKLCH harmony palettes from a base color.
- **apcach** (Evil Martians) — Generate colors targeting specific APCA contrast values.
  "Give me a blue with 60Lc against this background." Contrast-first generation.

---

## Dark Mode Implementation

Dark mode is not "invert the colors." It's a complete rethinking of surface hierarchy,
contrast, and color intensity.

**Backgrounds**: `oklch(0.13-0.18)` range (~`#0A0A0A` to `#1A1A1A`). NEVER pure black —
OLED halation smears bright text, harsh contrast fatigues eyes. Cool backgrounds
(`H: 250-270`) for dev-tools/fintech. Warm (`H: 50-80`) for editorial/reading.

**Elevation = lighter surfaces** (shadows are invisible on dark). Step L up ~0.03/level:
```css
[data-theme="dark"] {
  --surface-base:    oklch(0.145 0.005 260);  /* base */
  --surface-raised:  oklch(0.175 0.005 260);  /* cards */
  --surface-overlay: oklch(0.21  0.005 260);  /* modals */
}
```

**Text**: 87-90% opacity, not pure white. Primary `oklch(0.93 ...)`, secondary
`oklch(0.65 ...)`. Pure white on dark gray is technically accessible but fatiguing.

**Accents**: REDUCE chroma 15-25%. Colors that look balanced on white look garish on dark.

**Shadows**: Eliminate (use elevation-through-lightness) or replace with colored glows:
```css
[data-theme="dark"] .card {
  box-shadow: 0 4px 24px oklch(0.30 0.05 250 / 0.15); /* glow, not shadow */
}
```

**Full toggle implementation**:
```css
:root, [data-theme="light"] {
  --surface-base: oklch(0.985 0.004 80);
  --text-primary: oklch(0.20 0.01 260);
  --accent: oklch(0.60 0.22 250);
}
[data-theme="dark"] {
  --surface-base: oklch(0.145 0.005 260);
  --text-primary: oklch(0.93 0.005 260);
  --accent: oklch(0.68 0.17 250);  /* lighter, less saturated */
}
```
```html
<script>
function toggle() {
  const t = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', t === 'dark' ? 'light' : 'dark');
}
// Respect system preference on load
if (matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.setAttribute('data-theme', 'dark');
</script>
```

Use `data-theme` over classes — more semantic, no utility class collisions, trivially
queryable via `getAttribute`, predictable specificity.

---

## Accessible Color

Accessibility is not a feature. It's a constraint. Like gravity.

**WCAG 2.2**: 4.5:1 for normal text, 3:1 for large text (>=24px or >=18.66px bold), 3:1
for UI components and graphical objects. OKLCH L correlates with perceived lightness but
is NOT the same as WCAG relative luminance — you still need to calculate actual ratios.

**APCA** (the future, not yet W3C): Uses Lc values — Lc 60 minimum for body, Lc 75
preferred, Lc 90+ for high-contrast headings. Better science, accounts for text size and
polarity. Use WCAG for compliance, APCA for aspiration.

**Cardinal rule**: Never use color alone to convey information. Always pair with icon,
text label, pattern, or position. 8% of men have color vision deficiency. Plus: low
brightness, sunlight, projectors, grayscale prints.

**Colorblind testing tools**: Viz Palette (projects.susielu.com/viz-palette), Polypane
(built-in CVD simulation), Chrome DevTools (Rendering → Emulate vision deficiencies).

**Safe pairings**: Blue+Orange (safest). Blue+Yellow (luminance saves it). Red+Green
(never rely on this alone, ever).

```css
/* Status colors: distinct in BOTH hue AND lightness — survives grayscale */
--status-success: oklch(0.65 0.20 145);
--status-error:   oklch(0.55 0.22 25);
--status-warning: oklch(0.80 0.14 80);
--status-info:    oklch(0.60 0.15 250);
```

```javascript
// Quick OKLCH contrast approximation (not WCAG-compliant — use colorjs.io for real math)
// |L1 - L2| >= 0.40 usually passes 4.5:1; >= 0.30 usually passes 3:1
function approxContrast(l1, l2) { return Math.abs(l1 - l2); }
// For compliance: import Color from 'colorjs.io';
// new Color('oklch(0.60 0.20 250)').contrast(new Color('oklch(0.985 0 0)'), 'WCAG21');
```

---

## Anti-Patterns

Seven things to stop doing. Each one is an AI default that makes output look generated.

1. **Pure white backgrounds** — `#FFFFFF` is the absence of a decision. Use
   `oklch(0.97-0.99 0.002-0.008 <hue>)`.

2. **Pure black dark mode** — `#000000` causes OLED halation and eye fatigue. Use
   `oklch(0.13-0.17)` with slight chroma.

3. **The purple-blue gradient** — `linear-gradient(135deg, #8B5CF6, #6366F1)` is the
   fingerprint of AI-generated design 2024-2026. If your brand is purple, use a single
   solid. Gradients should be functional, not wallpaper.

4. **Same saturation dark/light** — Colors balanced on white look neon on dark gray. Drop
   chroma 15-25% in dark mode. AI models never do this.

5. **Hardcoded hex values** — `color: #3B82F6` in components means you don't have a color
   system. Every color references a token. Three tiers. No shortcuts.

6. **HSL for palette generation** — Varying HSL lightness produces uneven perceptual steps,
   muddy mid-tones, and hue shifts. OKLCH exists to solve this. Use it.

7. **More than three accent colors** — If five saturated colors compete for attention,
   nothing is accentuated. One primary, one secondary, neutrals for everything else.
   Status colors are functional, not accents.
