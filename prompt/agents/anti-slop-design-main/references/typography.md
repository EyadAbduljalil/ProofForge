# Typography: The Single Biggest Lever You Have

Typography is the fastest way to make AI output stop looking like AI output.
Not color. Not layout. Not motion. *Font choice.* Swap Inter for Clash Display
and the entire page goes from "Claude made this" to "someone with opinions made this."
The reason is simple: AI models pick the most common font in their training data,
and the most common font is always the most forgettable one. Typography is where
probability and taste diverge hardest, and that's exactly where you attack.

---

## Recommended Fonts by Aesthetic

Three tiers. Display fonts create identity. Body fonts do the work. Monospace fonts
show the code. Pick one from each tier and you're already ahead of 90% of generated output.

### Display / Heading Fonts

Your personality fonts. Use at `--step-3` and above.

| Font | Source | Aesthetic | Variable? | Pair With |
|------|--------|-----------|-----------|-----------|
| Clash Display | Fontshare | Geometric, bold, editorial | Yes (wght) | Satoshi, General Sans |
| Playfair Display | Google Fonts | High-contrast serif, editorial luxury | Yes (wght, ital) | Source Serif 4, DM Sans |
| Fraunces | Google Fonts | Soft serif, playful, warm — has WONK + SOFT axes | Yes (wght, opsz, WONK, SOFT) | Outfit, Plus Jakarta Sans |
| Bricolage Grotesque | Google Fonts | Quirky grotesque, slightly rough, human feel | Yes (wght, opsz) | DM Sans, General Sans |
| Cormorant Garamond | Google Fonts | Elegant oldstyle serif, literary, thin at light weights | Yes (wght, ital) | Lora, Plus Jakarta Sans |
| Cabinet Grotesk | Fontshare | Clean geometric, sharper than Inter, actual character | Yes (wght) | Satoshi, Outfit |
| Anton | Google Fonts | Condensed impact, poster-weight, shouts on purpose | No | DM Sans, Source Serif 4 |
| Bodoni Moda | Google Fonts | Ultra high-contrast didone, fashion/editorial | Yes (wght, ital, opsz) | General Sans, Satoshi |
| Space Grotesk | Google Fonts | Proportional companion to Space Mono, techy but warm | Yes (wght) | DM Sans, Outfit |

### Body Fonts

Readable at 16px, comfortable at 65ch, invisible in the best way.

| Font | Source | Aesthetic | Variable? | Best For |
|------|--------|-----------|-----------|----------|
| Satoshi | Fontshare | Modern geometric sans, slightly warmer than Inter | Yes (wght, ital) | SaaS, devtools, dashboards |
| Plus Jakarta Sans | Google Fonts | Rounded, friendly, geometric but soft | Yes (wght, ital) | Consumer apps, marketing, health |
| Outfit | Google Fonts | Clean geometric, good x-height, wide weight range | Yes (wght) | General purpose, portfolios |
| Source Serif 4 | Google Fonts | Workhorse serif, excellent for long-form reading | Yes (wght, ital, opsz) | Editorial, documentation, blogs |
| Lora | Google Fonts | Calligraphic serif, warm, works at body sizes | Yes (wght, ital) | Publishing, nonprofit, education |
| DM Sans | Google Fonts | Slightly quirky geometric, great for UI text | Yes (wght, ital, opsz) | Product UI, marketing sites |
| General Sans | Fontshare | Swiss-style sans, professional, clean | Yes (wght, ital) | Corporate, fintech, B2B |

### Monospace

For code blocks, data tables, and terminal output.

| Font | Source | Aesthetic | Variable? | Ligatures? |
|------|--------|-----------|-----------|------------|
| Geist Mono | Vercel | Clean, tight, modern — designed for code | Yes (wght) | Yes |
| JetBrains Mono | JetBrains | Tall x-height, increased letter-spacing for readability | No (but 8 weights) | Yes |
| Fira Code | GitHub (tonsky) | Mozilla lineage, solid ligature set, battle-tested | Yes (wght) | Yes |
| Recursive | Google Fonts | Has MONO axis — one font that goes from sans to mono | Yes (wght, CASL, MONO, CRSV, slnt) | Yes |
| IBM Plex Mono | Google Fonts | Corporate-clean, IBM design language, neutral | Yes (wght, ital) | No |
| Commit Mono | GitHub (eigilnikolajsen) | Neutral, no-fuss, optimized for code readability | No | No |

### The Banned List

These fonts are fine. That's the problem. They're the typographic equivalent
of a stock photo handshake.

**BANNED for primary use** (fallback stacks only):
Inter, Roboto, Open Sans, Lato, Arial, Helvetica, Montserrat, Poppins, Raleway.

Put them in your fallback chain after your real font. If your deployed site
renders Inter because your display font failed to load, that's a performance
bug, not a design choice.

---

## Font Pairing Rules

One font says something. The other shuts up and lets you read.

### The Five Rules

1. **Contrast family, not similarity.** Serif heading + sans body, or geometric
   display + humanist body. Two geometric sans-serifs together look like a mistake.
2. **Match x-height.** Similar x-heights make the transition between fonts feel
   natural. Mismatched x-heights look like two designers who never talked.
3. **One display + one workhorse.** Display gets headings, hero, pull quotes.
   Workhorse gets paragraphs, labels, captions, nav. No exceptions.
4. **Same source cohesion.** Fonts from the same foundry share design DNA.
   Fontshare pairs with Fontshare. Google superfamilies were designed together.
5. **Never pair two display fonts.** Clash Display + Bodoni Moda on the same
   page is a war crime. One personality per page.

### Concrete Pairings by Domain

| Domain | Heading | Body | Why It Works |
|--------|---------|------|-------------|
| SaaS / Devtools | Clash Display | Satoshi | Geometric cohesion, both from Fontshare, weight contrast does the heavy lifting |
| Editorial / Publishing | Playfair Display | Source Serif 4 | High-contrast display serif + readable body serif, classic editorial hierarchy |
| Healthcare / Nonprofit | Bricolage Grotesque | Plus Jakarta Sans | Approachable but not childish, the slight quirkiness feels human without being unprofessional |
| Fintech / Corporate | Cabinet Grotesk | General Sans | Clean, sharp, Swiss-style DNA in both, feels expensive without trying |
| Creative / Portfolio | Fraunces | Outfit | The WONK axis on Fraunces adds playfulness, Outfit stays out of the way |
| E-commerce / Consumer | Bodoni Moda | DM Sans | Fashion-forward heading, friendly body, the contrast ratio is doing all the work |
| Legal / Government | Cormorant Garamond | Lora | Two serifs that actually work together because Cormorant is display-weight and Lora is body-weight |

---

## Fluid Type Scales (Utopia)

`font-size: 48px` means nothing on a phone and too much on an ultrawide.
Fluid type scales use `clamp()` to interpolate between min and max sizes
based on viewport width. [Utopia.fyi](https://utopia.fyi/type/calculator/)
does the math. You pick: min viewport (320px), max viewport (1240px),
base sizes (16-18px min, 20-22px max), and a scale ratio.

### Scale Ratios

| Ratio | Name | Feel | Best For |
|-------|------|------|----------|
| 1.200 | Minor Third | Subtle, conservative | Dashboards, dense UI, data-heavy apps |
| 1.250 | Major Third | Balanced, versatile | Most websites, SaaS products, marketing |
| 1.333 | Perfect Fourth | Dramatic, editorial | Landing pages, portfolios, editorial sites |

### Complete Fluid Type Scale (Major Third, 18px-22px base)

```css
:root {
  /* @link https://utopia.fyi/type/calculator?c=320,18,1.25,1240,22,1.25,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
  --step--2: clamp(0.72rem, 0.65rem + 0.33vw, 0.88rem);
  --step--1: clamp(0.90rem, 0.82rem + 0.41vw, 1.10rem);
  --step-0:  clamp(1.13rem, 1.02rem + 0.51vw, 1.38rem);
  --step-1:  clamp(1.41rem, 1.28rem + 0.64vw, 1.72rem);
  --step-2:  clamp(1.76rem, 1.60rem + 0.80vw, 2.15rem);
  --step-3:  clamp(2.20rem, 2.00rem + 1.00vw, 2.69rem);
  --step-4:  clamp(2.75rem, 2.50rem + 1.25vw, 3.36rem);
  --step-5:  clamp(3.43rem, 3.12rem + 1.56vw, 4.20rem);
}

/* Usage */
body        { font-size: var(--step-0); }
.caption    { font-size: var(--step--1); }
.small      { font-size: var(--step--2); }
h6          { font-size: var(--step-1); }
h5          { font-size: var(--step-1); }
h4          { font-size: var(--step-2); }
h3          { font-size: var(--step-3); }
h2          { font-size: var(--step-4); }
h1          { font-size: var(--step-5); }
.hero-title { font-size: var(--step-5); }
```

---

## Variable Font Features

One file, entire weight range, intermediate values like 350 or 550 that fixed
fonts can't give you. One HTTP request instead of six.

### Standard Axes

| Axis | Tag | Range (typical) | What It Does |
|------|-----|-----------------|-------------|
| Weight | `wght` | 100-900 | Thin to Black |
| Width | `wdth` | 75-125 | Condensed to Expanded |
| Italic | `ital` | 0-1 | Upright to Italic |
| Slant | `slnt` | -12 to 0 | Oblique angle |
| Optical Size | `opsz` | 8-144 | Optimizes for display vs text size |

### Custom Axes (The Fun Ones)

| Font | Axis | Tag | What It Does |
|------|------|-----|-------------|
| Fraunces | Wonky | `WONK` | Toggles between wonky and clean letterforms |
| Fraunces | Softness | `SOFT` | Rounds the serifs from sharp to pillowy |
| Recursive | Mono | `MONO` | Slides between proportional sans and monospace |
| Recursive | Casual | `CASL` | Slides between linear and casual/handwritten |
| Recursive | Cursive | `CRSV` | Controls cursive letterforms in italic |

### Implementation

```css
/* Load a variable font with weight range */
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

/* Use intermediate weights that fixed fonts can't offer */
.hero-title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 800;
  font-variation-settings: 'WONK' 1, 'SOFT' 50;
}

.subtitle {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 350;  /* 350. Not 400. This is why variable fonts exist. */
  font-variation-settings: 'WONK' 0, 'SOFT' 0;
}

/* Animate axis values on hover — because you can */
.interactive-heading {
  font-variation-settings: 'wght' 400, 'SOFT' 0;
  transition: font-variation-settings 0.3s ease;
}
.interactive-heading:hover {
  font-variation-settings: 'wght' 800, 'SOFT' 100;
}
```

---

## Typographic Craft Rules

These aren't suggestions. Violate them and designers will know. Users won't
know *why* something feels off, but they'll feel it.

### Line Height

- **Body text**: `1.5` to `1.7`. Below 1.5 = cramped. Above 1.7 = dissolving.
- **Headings**: `1.0` to `1.2`. Multiline headings at 1.6 look like a paragraph
  pretending to be a heading.

### Measure (Line Length)

- **Max `65ch`** on body text containers. Not a preference, it's reading science.
  Past 75ch, the eye loses its place returning to the left margin.

### Letter Spacing

- **Uppercase**: `+0.05em` to `+0.1em`. Without tracking, uppercase text looks
  like it's trapped in an elevator.
- **Large headings** (step-4+): `-0.01em` to `-0.03em`. Negative tracking
  tightens display type into a cohesive block. This is what makes it look *designed*.

### Font Loading

- **WOFF2 only.** Not WOFF, TTF, or EOT. Those formats are for dead browsers.
- **`font-display: swap`** in every `@font-face`. Without it you get FOIT --
  invisible text for up to 3 seconds while the font loads.
- **Self-host.** Download the WOFF2 files. `@import` from Google Fonts is a
  render-blocking request to a third-party server. Three round trips before
  your user sees text.

### The CSS

```css
body {
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-size: var(--step-0);
  line-height: 1.6;
  max-width: 65ch; /* On the content container, not body itself */
  font-weight: 350;
}

h1, h2, h3 {
  font-family: 'Clash Display', 'Arial Black', sans-serif;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
  text-wrap: balance; /* Prevents orphans on multiline headings */
}

.overline, .label, .nav-item {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: var(--step--1);
  font-weight: 500;
}

p + p {
  margin-top: 1em; /* Not 1.5rem, not 24px. 1em = relative to the text size. */
}
```

---

## Anti-Patterns

Things AI does with typography that immediately mark the output as generated.
If you see these in your code, fix them before anyone else sees them.

### 1. Inter As Primary Font

The single most common tell. Inter is a perfectly good font that has been ruined
by ubiquity. It's the beige carpet of web typography. Using Inter as your primary
font in 2026 is like using a stock photo of people shaking hands as your hero image.
Technically functional. Emotionally bankrupt.

### 2. Subtle Weight Differences (400 vs 600)

AI loves to set body text at 400 and headings at 600. That's a 200-unit difference.
On most fonts, the visual difference between 400 and 600 is barely perceptible at
heading sizes. You need at least a 300-unit spread to create real hierarchy. 300/700.
350/800. 400/900. Make the contrast *obvious*.

### 3. Small Size Ratios Between Hierarchy Levels

Body at 16px, h3 at 18px, h2 at 20px, h1 at 24px. That's not a hierarchy, that's
a gentle slope. Each heading level should feel distinctly different from the one
below it. A 1.25x scale ratio means your h1 is 3x your body text. That's hierarchy.
2px increments between levels is not.

### 4. Missing Uppercase Letter-Spacing

AI generates `text-transform: uppercase` and stops there. No `letter-spacing`.
The result is uppercase text where the letters are touching shoulders in a crowded
elevator. It looks cramped, it looks rushed, it looks like nobody proofread it.
Every uppercase string needs `letter-spacing: 0.05em` minimum.

### 5. Lines Wider Than 75ch

AI doesn't set `max-width` on text containers. The text just stretches to fill
whatever space is available, which on a 1440px monitor means 120+ characters per
line. Reading that is like watching a tennis match. Your eyes physically cannot
track back to the start of the next line reliably past 75 characters.

### 6. @import for Google Fonts

```css
/* This is a render-blocking request. Your page shows nothing until Google responds. */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
```

Self-host. Download the WOFF2. Load it with `@font-face`. The `@import` approach
makes your initial render dependent on `fonts.googleapis.com` being fast, and
it creates a chain of two requests (your CSS, then the Google CSS, then the font
files). That's three round trips before your user sees text.

### 7. Loading 8 Weights When You Use 2-3

AI includes every available weight "just in case." The user downloads 400KB of
font data, and you use Regular, Medium, and Bold. If you're using a variable font,
this isn't an issue (one file, all weights). But if you're loading static files,
be surgical: pick the 2-3 weights you actually use and leave the rest.

### 8. No font-display Property

Missing `font-display: swap` (or `optional`, or `fallback`) in your `@font-face`
means the browser defaults to `font-display: auto`, which in most browsers means
`block` — the browser hides text for up to 3 seconds while the font loads. Three
seconds of invisible text. On a slow connection, that's your entire first impression.

---

## Quick Reference Cheat Sheet

```
PICK A FONT:     Not Inter. Not Roboto. Not Poppins.
PAIR IT:         One display + one workhorse. Contrast families.
SIZE IT:         clamp() from Utopia. Major Third (1.25) for most sites.
WEIGHT IT:       300-unit minimum spread. 350/700 or 400/800.
SPACE IT:        Uppercase +0.05em. Large headings -0.02em.
MEASURE IT:      max-width: 65ch on text containers.
LINE-HEIGHT IT:  Body 1.5-1.7. Headings 1.0-1.2.
LOAD IT:         WOFF2. Self-hosted. font-display: swap.
DONE:            You now look more intentional than 95% of AI output.
```
