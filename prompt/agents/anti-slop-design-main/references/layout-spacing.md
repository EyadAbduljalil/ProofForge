# Layout & Spacing: The Skeleton Nobody Sees Until It's Wrong

Layout is invisible work. Nobody says "wow, great grid." They say "this feels
professional" or "something's off but I can't explain it." That something is
spacing. Every AI-generated page has the same 1fr 1fr 1fr energy, the same
`py-8 px-4` Tailwind defaults, the same lack of spatial hierarchy. Layout is
where you make the page *breathe* — or where you let it suffocate in a sea of
identical 24px gaps. يسطا, let's fix that.

---

## CSS Grid Patterns

Grid is the backbone. Flexbox is for components, Grid is for pages.
Here are five patterns that cover 95% of real layouts.

### 12-Column Foundation

The workhorse. Every serious design system sits on this.

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-m);
  max-width: var(--max-width, 1400px);
  margin-inline: auto;
  padding-inline: var(--space-m);
}

/* Span utilities */
.col-1   { grid-column: span 1; }
.col-2   { grid-column: span 2; }
.col-3   { grid-column: span 3; }
.col-4   { grid-column: span 4; }
.col-6   { grid-column: span 6; }
.col-8   { grid-column: span 8; }
.col-12  { grid-column: span 12; }

/* Full-bleed breakout — child escapes max-width */
.col-full {
  grid-column: 1 / -1;
  margin-inline: calc(-1 * var(--space-m));
}
```

Don't make 12 columns on mobile. Use `auto-fill` for small screens or just
let everything be `col-12`. Nobody needs 12 columns at 375px. Nobody.

### Bento Grid (Apple-inspired)

The Apple keynote layout. Cards of different sizes, visual hierarchy
through area, not just font size.

```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: var(--space-s);
}

.bento-wide    { grid-column: span 2; }
.bento-tall    { grid-row: span 2; }
.bento-hero    { grid-column: span 2; grid-row: span 2; }
.bento-full    { grid-column: span 4; }

/* Card internals */
.bento > * {
  border-radius: var(--radius-l, 16px);
  padding: var(--space-m);
  overflow: hidden;
  display: grid;
  align-content: end;
}
```

The trick is *not* making every card the same size. Three sizes minimum:
hero (2x2), wide (2x1), and standard (1x1). If everything's 1x1, it's
just a grid of cards — boring as hell.

### Asymmetric Editorial

Content + sidebar. The internet's oldest layout, still undefeated for
blogs, docs, and long-form content.

```css
.editorial {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-l);
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-m);
}

.editorial-main {
  max-width: 72ch; /* Readable line length */
}

.editorial-sidebar {
  position: sticky;
  top: var(--space-m);
  align-self: start;
  height: fit-content;
}

/* Flip on smaller containers */
@container (max-width: 768px) {
  .editorial {
    grid-template-columns: 1fr;
  }
}
```

The 2fr/1fr ratio matters. Not 3fr/1fr (sidebar too cramped), not
1fr/1fr (that's not a sidebar, that's a split). 2:1 is the sweet spot.

### Masonry Layout

Pinterest-style. Cards fill vertical space without leaving gaps. CSS has
an experimental `masonry` value — use it with a fallback.

```css
/* Modern CSS masonry — Chrome 128+, Firefox 127+ (behind flag) */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  grid-template-rows: masonry;
  gap: var(--space-s);
}
```

**Reality check**: CSS masonry is still experimental and has inconsistent
support as of early 2026. For production, you need a JS fallback. Use
a lightweight library like `colcade` or roll your own with
`column-count` (which isn't true masonry but gets close enough):

```css
/* CSS-only approximation */
.masonry-fallback {
  column-count: 3;
  column-gap: var(--space-s);
}

.masonry-fallback > * {
  break-inside: avoid;
  margin-bottom: var(--space-s);
}
```

`column-count` doesn't give you the same order (items flow top-to-bottom
per column, not left-to-right per row). Know the tradeoff before shipping.

### CSS Subgrid

Parent defines the grid. Children inherit tracks. This is how you align
card headers, bodies, and footers across a row of cards without fixed heights.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: var(--space-m);
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* header + body + footer */
}

.card-header { /* auto-aligned across siblings */ }
.card-body   { /* stretches to fill */ }
.card-footer { /* pinned to bottom, aligned */ }
```

Subgrid is the answer to "how do I make card footers line up." Before
subgrid we did terrible things with flexbox and min-heights. Dark times.
Support is solid in 2026 — all evergreen browsers.

---

## Fluid Design System

Breakpoints are dead. Long live `clamp()`. If your layout jumps between
states at 768px and 1024px, you've built a layout with three modes and
two awkward transitions between them. Fluid design scales *continuously*.
No jumps. No "tablet breakpoint."

### Utopia-style Fluid Spacing

Use [Utopia.fyi](https://utopia.fyi/space/calculator/) to generate these
or steal these values directly. Viewport range: 320px to 1240px.

```css
:root {
  /* Fluid spacing scale — no breakpoints, just math */
  --space-3xs: clamp(0.25rem, 0.2283rem + 0.1087vi, 0.3125rem);
  --space-2xs: clamp(0.5rem, 0.4565rem + 0.2174vi, 0.625rem);
  --space-xs:  clamp(0.75rem, 0.6848rem + 0.3261vi, 0.9375rem);
  --space-s:   clamp(1rem, 0.913rem + 0.4348vi, 1.25rem);
  --space-m:   clamp(1.5rem, 1.3696rem + 0.6522vi, 1.875rem);
  --space-l:   clamp(2rem, 1.8261rem + 0.8696vi, 2.5rem);
  --space-xl:  clamp(3rem, 2.7391rem + 1.3043vi, 3.75rem);
  --space-2xl: clamp(4rem, 3.6522rem + 1.7391vi, 5rem);
  --space-3xl: clamp(6rem, 5.4783rem + 2.6087vi, 7.5rem);
}
```

These pair with a fluid type scale. If your `--step-0` body text clamps
from 16px to 20px, your `--space-s` should clamp proportionally. The
whole system scales in lockstep. That's the point.

### Auto-fill Cards (The One Grid Line You Need)

This single line handles 90% of card layouts. No media queries.

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: var(--space-m);
}
```

The `min(300px, 100%)` is the key — it prevents overflow on viewports
narrower than the minimum. Without it, a 300px min on a 280px screen
causes horizontal scroll. احا.

### Container Queries

Media queries ask "how wide is the viewport?" Container queries ask
"how wide is *my parent*?" This is the difference between page-level
and component-level responsive design.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: var(--space-s);
  padding: var(--space-m);
}

/* Horizontal layout when container is wide enough */
@container card (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto auto;
  }
  .card-image {
    grid-row: 1 / -1;
  }
}

/* Full-width stacked when narrow */
@container card (max-width: 499px) {
  .card {
    grid-template-columns: 1fr;
  }
  .card-image {
    aspect-ratio: 16 / 9;
    width: 100%;
  }
}
```

The card doesn't care if it's in a sidebar, a modal, or a full-width
section. It asks its container how much room it has, and adapts.
This is how components *should* work. Media queries are for page layout.
Container queries are for components. Use both.

---

## Content Density Patterns

Not every page needs the same spacing. A luxury brand landing page and a
devtools admin panel have completely different spatial needs. Picking the
wrong density is one of the fastest ways to make a page feel off.

### Spacious (Landing Pages, Luxury, Healthcare)

```css
.density-spacious {
  --section-spacing: clamp(5rem, 4rem + 3vi, 8rem);    /* 80-128px */
  --card-padding:    clamp(2rem, 1.5rem + 1.5vi, 3rem); /* 32-48px  */
  --content-width:   min(800px, 90vi);                   /* Narrow text */
  --element-gap:     var(--space-l);
}
```

Big breathing room. Lots of white space. Text columns max 800px wide.
Sections spaced 80-120px apart. This density says "we have nothing to
hide and we're not in a rush." Use for: portfolios, brand sites,
healthcare, luxury, editorial longform.

### Medium (SaaS, Fintech, Most Apps)

```css
.density-medium {
  --section-spacing: clamp(2rem, 1.5rem + 1.5vi, 4rem);  /* 32-64px */
  --card-padding:    clamp(1rem, 0.75rem + 0.75vi, 1.5rem); /* 16-24px */
  --content-width:   min(1400px, 95vi);
  --element-gap:     var(--space-m);
}
```

The default. Comfortable without being wasteful. If you don't know
what density to pick, pick this one. Use for: SaaS dashboards, fintech,
productivity apps, e-commerce, documentation.

### Dense (Devtools, Admin, Data Tables)

```css
.density-dense {
  --section-spacing: clamp(0.5rem, 0.25rem + 0.75vi, 1.5rem); /* 8-24px */
  --card-padding:    clamp(0.5rem, 0.375rem + 0.375vi, 1rem); /* 8-16px */
  --content-width:   min(1600px, 98vi);
  --element-gap:     var(--space-xs);
}
```

Every pixel earns its keep. Tight spacing, wide containers, small gaps.
Information density is the feature, not a compromise. Use for: IDE-like
tools, admin panels, data tables, monitoring dashboards, terminal UIs.

### How to Pick Density

The agent should pick density based on context clues:

| Signal | Density |
|--------|---------|
| User says "dashboard" or "admin" | Dense |
| User says "landing page" or "portfolio" | Spacious |
| User says "app" or "tool" | Medium |
| Domain is healthcare, luxury, editorial | Spacious |
| Domain is devtools, analytics, monitoring | Dense |
| Domain is SaaS, fintech, e-commerce | Medium |
| No clear signal | Medium (safe default) |

Domain profile in `domain-map.json` overrides these heuristics.
If the domain profile says `"density": "spacious"`, use spacious
regardless of other signals. The domain map is the final word.

---

## Spatial Composition

Spacing isn't just gaps between things. It's a composition tool.
How you *arrange* empty space determines the visual hierarchy as
much as type size or color.

### Negative Space as Design Element

Empty space is not wasted space. It's the silence between notes.
The biggest difference between amateur and professional layouts is
how they use emptiness.

```css
/* Hero with intentional asymmetric spacing */
.hero-composed {
  display: grid;
  grid-template-columns: 1fr min(600px, 50%) 1fr;
  padding-block: var(--space-3xl) var(--space-xl);
  /* Top padding >> bottom padding = content feels elevated */
}

.hero-composed > * {
  grid-column: 2;
}
```

The uneven top/bottom padding is intentional. Equal padding everywhere
is the AI default. Asymmetric spacing creates visual tension and
directs the eye. It feels *designed* instead of *generated*.

### Overlapping Elements

Flat layouts are boring. Overlap creates depth, connection, visual interest.

```css
/* Image overlapping into next section */
.overlap-hero {
  display: grid;
  grid-template-rows: 1fr auto;
}

.overlap-hero img {
  grid-row: 1 / 3;
  grid-column: 1;
  z-index: 1;
}

.overlap-hero .content {
  grid-row: 2;
  grid-column: 1;
  z-index: 2;
  margin-top: -4rem; /* Bleeds into image */
  background: var(--surface-primary);
  border-radius: var(--radius-l) var(--radius-l) 0 0;
  padding: var(--space-l);
}
```

Negative margins, grid overlap, absolute positioning — all valid.
The point is breaking the flat-stack pattern. Elements that relate
to each other should feel spatially connected, not just sequentially
stacked.

### Section Dividers (Not Just `<hr>`)

Straight horizontal lines between sections are the most boring
transition possible. Here are alternatives.

```css
/* Diagonal transition via clip-path */
.section-angled {
  --angle: 3deg;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - tan(var(--angle)) * 100vw),
    0 100%
  );
  padding-bottom: calc(tan(var(--angle)) * 100vw + var(--space-xl));
  margin-bottom: calc(-1 * tan(var(--angle)) * 100vw);
}

/* Color transition — no divider needed */
.section-light { background: var(--surface-primary); }
.section-dark  { background: var(--surface-elevated); }
/* Alternating backgrounds IS the divider */

/* SVG wave — inline for performance */
.section-wave::after {
  content: '';
  display: block;
  height: 60px;
  background: var(--surface-primary);
  mask-image: url("data:image/svg+xml,..."); /* inline wave SVG */
  mask-size: 100% 100%;
}
```

The diagonal clip-path is the most impactful with the least code.
3deg is subtle. 5deg is dramatic. More than that and it eats too
much content space. هانت.

### Viewport-Height Sections

Full-screen sections for heroes and key moments.

```css
.section-full {
  min-height: 100svh; /* svh, not vh — respects mobile toolbar */
  display: grid;
  place-content: center;
  padding: var(--space-xl);
}
```

Use `svh` (small viewport height), not `vh`. On mobile, `vh` includes
the browser toolbar height, so `100vh` is actually taller than the
visible area. `svh` gives you the smallest viewport — the one where
the toolbar is visible. Your content won't get cut off.

### Scroll Snap

Fullscreen sections that snap into place on scroll.

```css
.snap-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100svh;
}

.snap-section {
  scroll-snap-align: start;
  min-height: 100svh;
  display: grid;
  place-content: center;
}
```

Use sparingly. Scroll snap feels premium on a product tour or
portfolio showcase. It feels hostile on a blog post or docs page
where the user needs fine scroll control.

### Z-Axis Depth

Layered elements create perceived depth without 3D transforms.

```css
.depth-stack {
  display: grid;
  grid-template-areas: "stack";
}

.depth-stack > * {
  grid-area: stack;
}

.depth-back  { transform: scale(0.95); opacity: 0.3; z-index: 1; }
.depth-mid   { transform: scale(0.975); opacity: 0.6; z-index: 2; }
.depth-front { z-index: 3; }
```

Stack three cards or screenshots. The back ones are slightly scaled
down and faded. Creates a "deck of cards" effect that communicates
"there's more here" without a carousel.

---

## Anti-Patterns

Things that make layouts feel broken or generated. If you see
these in your output, fix them.

### Fixed Pixel Widths Without Fluid Alternatives

```css
/* Bad */
.container { width: 1200px; }

/* Good */
.container { width: min(1200px, 100% - var(--space-m) * 2); }
```

Hard pixel widths create horizontal scroll on anything smaller.
Always pair with `min()`, `max()`, or `clamp()`.

### Breakpoint-Only Responsive (No Fluid Intermediate States)

```css
/* Bad — three frozen states */
.card { width: 100%; }
@media (min-width: 768px) { .card { width: 50%; } }
@media (min-width: 1024px) { .card { width: 33.33%; } }

/* Good — continuous scaling */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
}
```

At 767px and 769px, the bad version looks completely different.
The good version scales smoothly across every viewport width.

### Equal-Width Columns for Everything

Not all content deserves equal space. A hero headline and a
sidebar nav are not equal. A product image and its description
are not equal. Stop defaulting to `1fr 1fr` or `grid-cols-2`.

Use ratios: `2fr 1fr`, `3fr 2fr`, `1fr 2fr 1fr`. Let the
content hierarchy dictate the column ratios.

### Excessive Nesting Creating Narrow Content

Every wrapper with padding shrinks the content area. Three levels
of `px-6` on a 375px screen means your actual content width is
375 - 48 - 48 - 48 = 231px. That's not a layout, that's a phone
number.

Flatten your structure. Use grid to define spacing from the top
level. If you need more than two levels of padding-bearing
containers, your component architecture is wrong.

### No Max-Width on Text Columns

```css
/* Bad — text spanning full 1400px container */
.prose { width: 100%; }

/* Good — readable line length */
.prose { max-width: 72ch; }
```

Text wider than 75 characters per line becomes genuinely hard to
read. The eye loses its place jumping back to the next line. 60-72ch
is the sweet spot. This is not an opinion, it's typographic research
going back to the 1920s.

### Ignoring Container Queries

If your component's layout changes based on `@media` viewport width,
it will break the moment someone puts it in a sidebar. Container
queries exist. Use them for components. Media queries for page layout.

### Viewport Units for Spacing on Mobile

```css
/* Bad — 5vw padding = 18px on mobile, 96px on desktop */
.section { padding: 5vw; }

/* Good — bounded fluid spacing */
.section { padding: clamp(1rem, 3vw, 4rem); }
```

Raw `vw`/`vh` units for spacing scale to extremes. Too small on
mobile, too large on desktop. Always bound them with `clamp()`.
The same goes for font sizes — never `font-size: 4vw` without
a clamp wrapper.

---

*Layout is the frame. Get it wrong and the best typography, color,
and motion in the world can't save you. Get it right and even
plain text on a white background feels intentional.*
