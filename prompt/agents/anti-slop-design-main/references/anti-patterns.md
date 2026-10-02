# The AI Slop Bible

You're reading this because AI design output has a problem. Every model, every provider,
every "generate me a landing page" prompt produces the same thing: Inter font, purple
gradient, three equal columns, "Unlock the power of [noun]." It's not a conspiracy.
It's math. And this file is the field manual for fighting it.

If you've seen one AI-generated SaaS landing page, you've seen ten thousand of them.
Let's talk about why, and more importantly, what to do about it.

---

## Why AI Output Converges

Language models don't have taste. They have probability distributions.

When you ask a model to generate a website design, it's doing one thing: predicting the
most likely next token given everything it's seen in training. And what has it seen? The
entire internet. Stack Overflow answers. Tailwind UI examples. Every "modern landing page"
Dribbble shot from 2021 to 2025. The collective output of a million developers who all
read the same blog posts about "clean design."

The result is **distributional convergence** — the tendency for generative models to
collapse toward the statistical mode of their training data. In plain English: AI picks
the most popular option every single time.

Here's what that looks like in practice:

- **Font**: Inter. Always Inter. Sometimes Roboto if the model is feeling adventurous.
  Poppins if it's trying to be "friendly." These three fonts account for roughly 80% of
  AI-generated web designs. Not because they're bad fonts — they're fine fonts — but
  because they're the *most common* fonts in the training data.

- **Colors**: Purple-to-blue gradients. Indigo accents (#6366F1, Tailwind's indigo-500).
  Pure white backgrounds. Pure black dark modes. The palette of every YC startup from
  2022.

- **Layout**: Centered hero section. Three-column feature grid. CTA banner. Footer.
  In that order. Every time. The model has seen this layout ten million times, so it
  generates this layout ten million and one times.

- **Radius**: 8px. On everything. Buttons, cards, inputs, images. 8px is the Tailwind
  default (`rounded-lg`), and the model has memorized it like a mantra.

- **Icons**: Heroicons or Lucide. Abstract geometric shapes for feature cards. A rocket
  emoji in the hero. You know the ones.

This is the **mode of the distribution** problem. The model isn't generating *good*
design. It's generating *average* design. The arithmetic mean of everything it's ever
seen. And the average of a million websites is... a very boring website.

Why does this matter? Because users are developing **AI fatigue**. They can smell a
generated page from three scroll-lengths away. The uncanny sameness triggers the same
response as stock photography — technically competent, emotionally hollow, immediately
forgettable. Your AI-assisted output needs to not look AI-assisted, or it's dead on
arrival.

The solution isn't to stop using AI. The solution is to know exactly where the model's
defaults are wrong and override them with intention.

---

## The Telltale Signs

Five convergence categories. Learn to spot them and you'll never ship slop again.

### 1. Typography Convergence

**What it looks like**: Inter or Roboto as the only font. Weight hierarchy of 400
(body) and 600 (headings) — safe, boring, indistinguishable. No letter-spacing
adjustments on uppercase text. Body and heading using the same font family because
the model couldn't be bothered to pair two fonts.

**Detection heuristics**:
```bash
# In your CSS/Tailwind files:
grep -iE "inter|roboto|poppins|open.sans|montserrat" src/**/*.{css,tsx,jsx}
# Check weight spread — if you only see 400 and 600, you're converging:
grep -oE "font-weight:\s*[0-9]+" src/**/*.css | sort -u
```

**The tell**: If you can swap Inter for Roboto and nobody notices, your typography
has no personality.

### 2. Color Convergence

**What it looks like**: `linear-gradient(to right, #8B5CF6, #6366F1)` — the purple
gradient that launched a thousand startups. Pure `#FFFFFF` backgrounds. Pure `#000000`
dark mode. Colors defined in hex or HSL, never OKLCH. Accent colors pulled straight
from Tailwind's default palette.

**Detection heuristics**:
```bash
grep -iE "linear-gradient.*purple|#6366F1|#8B5CF6|#7C3AED" src/**/*.css
grep -E "background:\s*#(FFF|FFFFFF|000|000000)" src/**/*.css
# Check if oklch is used anywhere (it should be):
grep -c "oklch" src/**/*.css  # 0 results = convergence
```

**The tell**: Screenshot your page, desaturate it, and compare it to five competitors.
If the luminance pattern is identical, you've got color convergence.

### 3. Layout Convergence

**What it looks like**: Centered hero with illustration on the right. Three-column
equal grid (`grid-template-columns: repeat(3, 1fr)`) for features. CTA section.
Testimonials carousel. Footer with four link columns. The same visual rhythm every
time. No asymmetry. No bento grids. No editorial layouts. No tension.

**Detection heuristics**:
```bash
grep -E "repeat\(3,\s*1fr\)" src/**/*.css
grep -E "grid-cols-3" src/**/*.{tsx,jsx}  # Tailwind equivalent
# Check for any non-symmetric grid definitions:
grep -E "grid-template-columns" src/**/*.css | grep -v "repeat"
# If that returns nothing, every grid is symmetric. Bad sign.
```

**The tell**: Draw boxes around your layout sections. If every box is the same width
and centered, you're looking at the mode of the distribution.

### 4. Content Convergence

**What it looks like**: "Unlock the power of [product]." "Supercharge your workflow."
"Built for developers, by developers." "Everything you need to [verb]." Hero section
with abstract 3D illustration on the right. Three feature cards with vague icons
(lightning bolt = fast, shield = secure, puzzle piece = integrations).

**Detection heuristics**:
```bash
# The slop dictionary:
grep -iE "unlock the power|supercharge|revolutionize|seamless|cutting-edge" src/**/*
grep -iE "built for developers|everything you need|take .* to the next level" src/**/*
```

**The tell**: Read your hero copy out loud. If it could describe literally any product
in any industry, it's convergent. Good copy is specific enough to be wrong about
something.

### 5. Interaction Convergence

**What it looks like**: Spring physics on every animation. `whileHover={{ scale: 1.05 }}`
on every card. Fade-in-up on scroll for every section. The same Framer Motion presets
copy-pasted across every component. Everything bounces. Everything scales. Everything
fades in from 20px below.

**Detection heuristics**:
```bash
grep -E "scale.*1\.05|scale.*1\.02" src/**/*.{tsx,jsx}
grep -E "whileHover|whileInView" src/**/*.{tsx,jsx} | wc -l  # >10 = probably too many
grep -E "transition.*spring" src/**/*.{tsx,jsx}
```

**The tell**: Disable all animations. If the page feels exactly the same, the
animations were decorative noise, not meaningful interaction feedback.

---

## The Counter-Techniques

Knowing what's wrong is step one. Here's step two: what to do instead, with code
you can actually ship.

### 1. Typography Counter

Stop pairing Inter with Inter. Pick a heading font with actual character — something
your user hasn't seen on fifteen other sites this week. Pair it with a workhorse body
font. Use dramatic weight contrast (300 vs 800, not 400 vs 600). Set letter-spacing
on uppercase because uppercase text without tracking looks like it's shouting into a
pillow.

```css
:root {
  --font-heading: 'Clash Display', 'Satoshi', sans-serif;
  --font-body: 'General Sans', 'Inter', sans-serif;
  --text-base: clamp(1rem, 0.34vi + 0.91rem, 1.19rem);
  --text-xl: clamp(1.56rem, 1vi + 1.31rem, 2.11rem);
  --text-3xl: clamp(2.44rem, 2.38vi + 1.85rem, 3.75rem);
}
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.label, .overline {
  text-transform: uppercase;
  letter-spacing: 0.08em; /* Expand uppercase — this is not optional */
  font-weight: 500;
}
body {
  font-family: var(--font-body);
  font-weight: 350; /* Not 400. 350 feels lighter, more modern. */
}
```

Why it works: Distinctive fonts create instant recognition. Weight contrast creates
visual hierarchy your eye can parse without reading.

### 2. Layout Counter

Break the grid. Not every section needs to be centered. Not every feature list needs
three equal columns. Use asymmetric splits. Let elements overlap. Create visual tension
with unequal column widths. Give the eye something to explore instead of something to
scan.

```css
/* Instead of: grid-template-columns: repeat(3, 1fr) */

/* Asymmetric hero */
.hero {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: clamp(1.5rem, 3vi, 3rem);
  align-items: end; /* Bottom-align, not center */
}

/* Bento grid — unequal cells create visual interest */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 1rem;
}
.feature-grid > :nth-child(1) { grid-column: span 2; grid-row: span 2; }
.feature-grid > :nth-child(2) { grid-column: span 2; }
.feature-grid > :nth-child(3) { grid-column: span 1; }
.feature-grid > :nth-child(4) { grid-column: span 1; }

/* Editorial offset — content doesn't have to be centered */
.editorial-section {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  padding-inline-start: 8vw; /* Asymmetric padding, not centered */
}
```

Why it works: Asymmetry creates hierarchy. Your eye goes to the bigger element first.
Bento grids feel curated, not generated. Editorial offsets feel intentional, like
someone actually designed the page instead of accepting defaults.

### 3. Atmosphere Counter

Flat surfaces look digital. Real surfaces have texture. Add grain, noise, dot patterns,
or subtle organic shapes. Use SVG filters for performant texture overlays. Use OKLCH
for color so your palettes have perceptual uniformity instead of the weird luminance
jumps you get with HSL.

```css
/* Grain overlay: fixed, pointer-events:none, z-index:9999 */
.grain-overlay {
  position: fixed; inset: 0; pointer-events: none;
  z-index: 9999; opacity: 0.05; mix-blend-mode: overlay;
}
/* SVG inside: <svg><filter id="grain"><feTurbulence type="fractalNoise"
   baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
   <feColorMatrix type="saturate" values="0"/></filter>
   <rect width="100%" height="100%" filter="url(#grain)"/></svg> */

:root {
  --surface-1: oklch(0.985 0.005 250);  /* Not #FFFFFF — warm near-white */
  --surface-2: oklch(0.96 0.008 250);
  --text-1: oklch(0.25 0.01 250);       /* Not #000000 — deep charcoal */
  --text-2: oklch(0.45 0.01 250);
  --accent: oklch(0.65 0.25 145);       /* Vivid, but not Tailwind indigo */
}
.dot-grid {
  background-image: radial-gradient(circle, oklch(0.7 0 0 / 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

**Tool references** for generating textures:
- Grain: [fffuel.co/gggrain](https://fffuel.co/gggrain/)
- Blobs: [blobmaker.app](https://www.blobmaker.app/)
- Patterns: [heropatterns.com](https://heropatterns.com/)

Why it works: Texture breaks the "digital perfection" that screams AI. A 5% grain
overlay makes a page feel like it was printed, not rendered. OKLCH means your grays
actually look gray, not slightly blue or slightly green.

### 4. Motion Counter

Not everything needs to move. And not everything needs spring physics. Match the
animation energy to the domain. A healthcare dashboard should not bounce like a
gaming landing page. Use CSS custom properties as motion tokens so you can tune
the entire system in one place.

```css
:root {
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  /* Healthcare/Gov/Finance: */ --duration-fast: 120ms; --duration-normal: 200ms;
  /* Devtools/Productivity:  */ /* --duration-fast: 80ms; --duration-normal: 160ms; */
  /* Creative/Portfolio:     */ /* --duration-fast: 200ms; --duration-normal: 400ms; */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
.card:hover {
  translate: 0 -2px;
  box-shadow: 0 8px 24px oklch(0 0 0 / 0.08);
  transition: translate var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-normal) var(--ease-default);
}
```

Why it works: Domain-aware motion feels intentional. 160ms on a devtool says "we
respect your time." 800ms on a portfolio says "look at this." Spring-on-everything
says "we copied the Framer Motion docs."

---

## 2025-2026 Counter-Trend: The Hand-Made Aesthetic

The backlash is already here. The more AI-polished output floods the web, the more
users crave evidence of human craft. Here's what's actually trending among studios
and products that people remember:

- **Imperfect typography**: Slight letter-spacing variation between sections. Mixed
  serif and sans-serif in the same heading. Type that looks set by a human, not a
  system.
- **Hand-drawn illustrations**: Over 3D renders, over abstract geometric shapes, over
  Midjourney hero images. Illustration styles that couldn't be generated because they
  have a specific artist's hand in them.
- **Visible grain and texture**: Film photography color science. Paper-like surfaces.
  Halftone patterns. Ink bleed effects on borders.
- **Analog-inspired color palettes**: Desaturated, warm, pulled from film stocks and
  darkroom prints. Not the saturated neon of Tailwind defaults.
- **Deliberate asymmetry**: Overlapping elements. Off-grid placements. Text that
  bleeds to the edge. Layouts that feel composed, not templated.
- **"Just enough" animation**: Most things don't move. The things that do move are
  meaningful — a loading state, a state change, a reveal of new content. Not
  decorative parallax on every scroll pixel.

**Exemplars worth studying**: Read.cv (editorial simplicity), Diagram.com (playful
precision), Linear.app (snappy, no-waste motion), Arc Browser (bold asymmetric
layouts). These products look nothing alike, which is exactly the point — they each
have a point of view.

---

## Pre-Delivery Audit Protocol

Before any generated design output reaches the user, run these 15 checks. If more
than two items fail, the output needs rework. No exceptions.

| #  | Check | Pass Criteria | Fail Action |
|----|-------|--------------|-------------|
| 1  | Primary font | NOT Inter, Roboto, Open Sans, Poppins, or Montserrat | Swap to a distinctive font from the domain profile |
| 2  | Gradient check | No purple-to-blue gradients (unless domain profile says purple) | Replace with domain-appropriate palette |
| 3  | Light background | NOT pure `#FFFFFF`; OKLCH lightness 0.96-0.99 with some chroma | Tint the background using the domain's base hue |
| 4  | Dark background | NOT pure `#000000`; OKLCH lightness 0.10-0.18 | Shift to a dark charcoal with slight hue |
| 5  | Border radius | Matches domain profile, NOT default 8px everywhere | Apply domain-specific radius tokens |
| 6  | Font weight spread | At least 2 distinct weights with >200 unit difference | Add weight contrast (e.g., 300 body + 700 heading) |
| 7  | Color format | Palette uses OKLCH, not hex-only or HSL | Convert palette to OKLCH with `oklch()` values |
| 8  | Layout asymmetry | At least one non-symmetric element or grid | Add asymmetric split, bento cell, or offset element |
| 9  | Spacing system | Fluid scale tokens (`clamp()`), not hardcoded px | Replace static values with fluid clamp tokens |
| 10 | Chart palette | Uses domain palette, not library defaults (d3 categorical, chart.js blue) | Override chart colors with domain accent scale |
| 11 | Reduced motion | `prefers-reduced-motion` media query is present | Add the media query — this is an accessibility requirement |
| 12 | Focus styles | `:focus-visible` with 2px+ visible ring | Add focus ring using outline-offset and domain accent |
| 13 | Type scale | Heading hierarchy uses fluid `clamp()` sizes, not manual px | Replace with fluid type scale tokens |
| 14 | Copy check | No "Unlock the power of", "Supercharge", "Seamless", "Cutting-edge" | Rewrite with specific, concrete language |
| 15 | Texture | SVG textures present (grain, dots, noise) at low opacity (2-8%) | Add grain overlay or dot-grid background |

A design that passes all 15 isn't automatically good. But a design that fails five of
them is almost certainly slop.

---

## Anti-Patterns

This section exists so validation scripts can find it. Here's the summary.

The five convergence categories described above — **Typography**, **Color**, **Layout**,
**Content**, and **Interaction** — are the primary anti-patterns this system is designed
to detect and counter. Each represents a dimension where AI output collapses toward the
statistical mean of its training data.

The counter-techniques are not about being contrarian for its own sake. Using a weird
font doesn't make a design good. The point is **intentionality** — every design decision
should be a conscious choice that serves the user and the domain, not a default that the
model picked because it was the most probable token.

If you're building on top of this system, the audit protocol in the previous section is
your minimum bar. Run it. Fix the failures. Ship something that a human would be proud
to claim they designed.

The bar is not "does this look professional." The bar is "does this look like *someone*
designed it." There's a difference, and your users can tell.
