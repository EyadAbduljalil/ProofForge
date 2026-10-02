# Web Platform Reference (React)

The primary reference for React-based web applications. This covers dashboards,
SaaS apps, admin panels, and anything that renders in a browser with a component
tree. If you're building a static landing page, you want `web-landing.md` instead.
If you're building a Claude artifact, you want `web-artifacts.md`.

This file assumes you've already read `SKILL.md` and know which domain profile
you're working with. If you haven't done that yet, go back. The domain profile
is the single most important input to any design decision you make here.

---

## Recommended Stack

The stack is opinionated because unopinionated stacks produce slop. That said,
not every project needs every piece. Use what the project calls for.

**Framework**: React 19+ with Server Components. If you're building a full app,
Next.js 15 (App Router). If it's a dashboard embedded in an existing app, plain
React with Vite is fine. Don't reach for Next.js to build a settings page.

**Styling**: This is where people go wrong immediately.

- **Tailwind v4** is appropriate when: you're building a product with a team,
  you've customized the theme to match your domain tokens, and you understand
  that Tailwind is a utility *system*, not a design system. Out-of-the-box
  Tailwind with default colors is how you get AI slop.
- **Vanilla CSS with custom properties** is appropriate when: you're building
  something with strong visual identity, the design doesn't map cleanly to
  utility classes, or you want fine control over every detail. This is often
  the better choice for creative and editorial domains.
- **CSS Modules** when you need scoping without a utility framework.

The anti-slop system ships CSS tokens (`assets/css/`) that work with any
approach. Load them. Use them. Don't reinvent spacing and type scales.

**Animation**: Motion (the library formerly known as Framer Motion). It's the
best React animation library by a wide margin. But — and this matters — check
the domain's `animation.intensity` before you touch it. If the domain says
`minimal`, your entire motion budget is opacity transitions and subtle
translates. Don't spring-animate a fintech table row.

**Components**: Radix Primitives as the accessibility foundation, with shadcn/ui
as a starting point you *will* customize. More on this below.

---

## Component Libraries

Here's the landscape, with honest takes on each.

### shadcn/ui

The most popular choice right now, and that's exactly the problem. When every
AI-assisted project starts with `npx shadcn@latest init` and ships the default
theme, you get thousands of apps that look identical. The zinc palette, the
`rounded-md` on everything, the exact same Dialog and Sheet animations.

shadcn is a *copy-paste component collection*, not a package. This is its
strength — you own the code, you can change anything. But most people don't
change anything. They accept the defaults and ship zinc-colored slop.

**How to use it right**: Install it, then immediately override `globals.css`
with your domain tokens. Replace the default radius, swap the color scale,
change the font. If your shadcn app looks like every other shadcn app, you
haven't done the work.

### Radix Primitives

The headless foundation that shadcn builds on. Unstyled, accessible, composable.
If you want full control over appearance without fighting a library's opinions,
start here. You write all the CSS yourself, which means more work but zero
visual debt.

**When to use over shadcn**: Creative and editorial domains where the visual
language is distinctive enough that pre-styled components would fight you.
Also when building a design system that other teams will consume.

### Ark UI

From the Chakra UI team but headless this time. Supports React, Solid, and Vue.
State machine-driven internals (via Zag.js) make behavior predictable. Good
alternative to Radix if you need cross-framework compatibility or prefer the
API style. Less ecosystem adoption than Radix, which means fewer copy-paste
examples floating around — which is arguably a feature, not a bug.

### Park UI

Pre-styled components built on Ark UI, similar to how shadcn builds on Radix.
Smaller community, less battle-tested, but the default theme is slightly more
distinctive than shadcn's zinc. Still needs domain customization.

### The Principle

**Headless > pre-styled**. Always. Pre-styled libraries encode someone else's
design opinions into your product. Headless libraries give you accessible
behavior without visual baggage. The extra CSS work is the price of not looking
like everyone else, and it's a price worth paying.

If you must use pre-styled components (deadlines are real), at minimum override
the color tokens, border radius, font stack, and shadow values with your domain
profile. That alone gets you 70% of the way to "this doesn't look generated."

---

## Code Patterns

These are the patterns that separate intentional UI from default-riddled output.
Every snippet below uses the anti-slop token system.

### Importing Domain Tokens

The domain token files in `assets/tokens/domain-tokens/` export OKLCH color
values, spacing, typography, and shape config. Convert them to CSS custom
properties and load them at the root.

```css
/* Load domain tokens as custom properties */
/* Values sourced from assets/tokens/domain-tokens/{domain}.json */
:root {
  /* Colors — OKLCH, not hex */
  --color-bg-primary: oklch(0.985 0.003 250);
  --color-bg-secondary: oklch(0.97 0.005 250);
  --color-text-primary: oklch(0.20 0.02 260);
  --color-text-secondary: oklch(0.45 0.015 260);
  --color-accent: oklch(0.50 0.18 260);
  --color-border: oklch(0.88 0.01 250);

  /* Typography — from domain profile */
  --font-heading: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Shape — domain-specific, not 8px everywhere */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Spacing — fluid, from assets/css/fluid-space-scale.css */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vi, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vi, 0.75rem);
  --space-md: clamp(1rem, 0.8rem + 1vi, 1.5rem);
  --space-lg: clamp(1.5rem, 1.2rem + 1.5vi, 2.5rem);
  --space-xl: clamp(2rem, 1.6rem + 2vi, 3.5rem);
}
```

In a React component, reference these through standard CSS — no magic:

```jsx
function DomainCard({ title, children }) {
  return (
    <article style={{
      background: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      border: '1px solid var(--color-border)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--color-text-primary)',
        marginBlockEnd: 'var(--space-xs)',
      }}>
        {title}
      </h3>
      <div style={{ color: 'var(--color-text-secondary)' }}>
        {children}
      </div>
    </article>
  );
}
```

### Container Queries Over Media Queries

Media queries ask "how wide is the viewport?" Container queries ask "how wide
is the space this component actually lives in?" For component-level
responsiveness — which is what you want in any dashboard or app with resizable
panels — container queries are the correct tool.

```css
/* The parent declares itself as a container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* The child responds to the container's width, not the viewport */
.card-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}

@container card (min-width: 400px) {
  .card-content {
    grid-template-columns: 1fr 1fr;
  }
}

@container card (min-width: 700px) {
  .card-content {
    grid-template-columns: 2fr 1fr 1fr;
  }
}
```

```jsx
function MetricsPanel({ metrics }) {
  return (
    <div className="card-container">
      <div className="card-content">
        {metrics.map(m => (
          <MetricCard key={m.id} label={m.label} value={m.value} />
        ))}
      </div>
    </div>
  );
}
```

This means the same component works in a full-width layout AND a sidebar AND a
modal without any viewport-awareness hacks. This is how component libraries
should work. Most don't.

### View Transitions API

Page transitions that feel native without a JavaScript animation library.
The View Transitions API lets the browser handle cross-document or same-document
transitions with CSS-only animation definitions.

```css
/* Define what animates during navigation */
.page-header {
  view-transition-name: page-header;
}
.main-content {
  view-transition-name: main-content;
}

/* Customize the transition animations */
::view-transition-old(main-content) {
  animation: fade-out 200ms ease-out;
}
::view-transition-new(main-content) {
  animation: fade-in 300ms ease-in;
}

@keyframes fade-out {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
  }
}
```

In Next.js 15 with App Router, trigger transitions on navigation:

```jsx
'use client';
import { useRouter } from 'next/navigation';

function NavLink({ href, children }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }
    document.startViewTransition(() => router.push(href));
  };

  return <a href={href} onClick={handleClick}>{children}</a>;
}
```

### Entry Animations with `@starting-style`

CSS-only entry animations. No JavaScript, no animation library, no
`useEffect` timing hacks. The `@starting-style` rule defines what the
element looks like before it enters the DOM — the browser transitions from
there to the element's normal state.

```css
.dialog-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition:
    opacity 250ms ease-out,
    transform 250ms ease-out,
    display 250ms allow-discrete;

  @starting-style {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
}

/* Exit animation — when the element is removed */
.dialog-panel[data-closing] {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
```

This replaces a significant chunk of what people use Motion for. If your
animation is "fade in and slide up on mount" — you don't need a library. CSS
can do it natively now. Save Motion for orchestrated sequences and
physics-based interactions.

### Progressive Enhancement

Build it so it works without JavaScript first. Then enhance. This isn't
idealism — it's pragmatism. Server Components in React 19 make this the
default architecture.

```jsx
// This component works with zero client-side JS
// It's a Server Component by default in Next.js 15
async function TransactionList({ accountId }) {
  const transactions = await getTransactions(accountId);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{formatDate(tx.date)}</td>
            <td>{tx.description}</td>
            <td data-positive={tx.amount > 0}>
              {formatCurrency(tx.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Only the interactive parts need 'use client'
'use client';
function TransactionFilter({ onFilter }) {
  // Client-side filtering enhances the server-rendered table
  // The table still works without this component loading
}
```

---

## Anti-Patterns

Things you should actively refuse to ship. If you see these in generated output,
fix them before the user does.

### Default Tailwind Palette

Using `bg-slate-50`, `text-slate-900`, `border-slate-200` everywhere without
customizing `tailwind.config`. This is the #1 tell that a project was
AI-generated. The slate palette is fine — as a starting point you override.
Ship it raw and your app looks like every other Tailwind project from 2024.

**Fix**: Extend or replace the color palette in your Tailwind config with OKLCH
values from the domain profile. At minimum, replace primary, secondary, accent,
and background colors.

### shadcn/ui Without Theme Override

Running `npx shadcn@latest init` and never touching `globals.css`. The default
zinc theme, `rounded-md`, and Inter font create a look so recognizable that
designers have a name for it: "shadcn default." If someone can identify your
component library from a screenshot, your design has no identity.

**Fix**: After init, immediately replace the CSS variables in `globals.css`
with your domain tokens. Change the radius, colors, font stack, and shadow
values. It takes 10 minutes and makes a massive difference.

### className Soup

```jsx
{/* This is not engineering. This is suffering. */}
<div className="flex items-center justify-between gap-4 rounded-lg border
  border-slate-200 bg-white p-4 shadow-sm transition-all duration-200
  hover:shadow-md hover:border-slate-300 dark:bg-slate-900
  dark:border-slate-700 dark:hover:border-slate-600 md:p-6 lg:flex-row
  lg:gap-6 xl:p-8">
```

Thirty-plus utility classes on a single element means your styling is
unreadable, unmaintainable, and impossible to update consistently. If you
change the border color, you're doing find-and-replace across 47 files.

**Fix**: Extract repeated patterns into CSS classes or component abstractions.
Use `@apply` sparingly (it exists for this reason). Or just write CSS — custom
properties with your domain tokens are cleaner than a 200-character className.

### Missing Dark Mode

If your app doesn't have dark mode in 2026, it's incomplete. Not optional.
Users expect it. The domain profile ships both light and dark palettes — use
them.

**Fix**: Define dark mode tokens alongside light mode tokens. Use
`prefers-color-scheme` as the default with a manual toggle override. Test
both modes. Don't ship a dark mode where half the text is unreadable because
you forgot to swap the secondary text color.

```css
:root { --color-bg: oklch(0.985 0.003 250); }

@media (prefers-color-scheme: dark) {
  :root { --color-bg: oklch(0.13 0.015 260); }
}

/* Manual override */
[data-theme="dark"] { --color-bg: oklch(0.13 0.015 260); }
[data-theme="light"] { --color-bg: oklch(0.985 0.003 250); }
```

### No Loading or Error States

A component that shows data but has no loading state, no error state, and no
empty state is a prototype, not a product. AI-generated components almost
never include these because the training data skews toward demos and tutorials
where data is always available and nothing ever fails.

**Fix**: Every data-fetching component needs four states: loading, error, empty,
and populated. Use React Suspense for loading boundaries and Error Boundaries
for error handling. Style all four states with the same care as the happy path.

```jsx
<Suspense fallback={<MetricsSkeleton />}>
  <ErrorBoundary fallback={<MetricsError />}>
    <MetricsPanel />
  </ErrorBoundary>
</Suspense>
```

### Static Pages With No Motion

The opposite extreme from spring-animating everything: a page where absolutely
nothing moves. No hover feedback, no transition on state changes, no indication
that the UI is alive. This feels broken, not minimal.

**Fix**: At minimum, add transitions to interactive elements (buttons, links,
cards). Use the motion tokens from `assets/css/motion-tokens.css` — even the
`minimal` level includes subtle hover and focus transitions. A 150ms opacity
change on hover costs nothing and tells the user "this is clickable."

---

## Exemplar Sites

Real sites worth studying. Not because you should copy them — because each one
demonstrates a specific principle better than any tutorial.

### Linear (linear.app)

**What to learn**: Motion restraint in a dense app. Linear is a project tracker
with hundreds of interactive elements, and the motion budget is extremely tight.
Transitions are fast (120-160ms), ease-out only, no bouncing. Keyboard
navigation is impeccable. The dark mode is one of the best on the web — warm
dark backgrounds with carefully tuned text contrast. Proof that `minimal`
animation intensity doesn't mean boring.

### Vercel Dashboard (vercel.com/dashboard)

**What to learn**: Component density done right. Dense information display
without feeling cluttered. Excellent use of monospace for data values alongside
proportional text for labels. The deployment status indicators use color
purposefully — not decoratively. A masterclass in "every pixel earns its place."

### Stripe Docs (docs.stripe.com)

**What to learn**: Content hierarchy through typography alone. Minimal color
usage — the hierarchy comes from weight, size, and spacing. Code blocks are
first-class citizens, not afterthoughts. Responsive behavior degrades
gracefully. The sidebar navigation respects screen real estate. If you're
building anything with documentation or dense text content, study this.

### Raycast (raycast.com)

**What to learn**: How to do expressive animation without feeling gratuitous.
The landing page uses scroll-driven animations and 3D transforms that actually
serve the narrative — they show you what the product does. The dark-first design
with accent colors that pop. Proof that `expressive` motion can feel intentional
if every animation has a purpose.

### Read.cv (read.cv)

**What to learn**: Editorial minimalism. Almost no color. Almost no decoration.
The design is typography, whitespace, and content. Proof that you don't need
gradients, shadows, or texture to create a distinctive visual identity. If
you're building for the editorial or creative domains, this is the benchmark
for "how little can you add and still have it feel designed?"

### Resend (resend.com)

**What to learn**: Developer tools that don't look like developer tools. Clean,
modern, with just enough personality to feel approachable without being playful.
The email preview rendering, the API key management UI, the logs — all dense
data, all presented clearly. Good example of domain-appropriate border radius
and shadow usage.

### Figma (figma.com)

**What to learn**: Complex app UI that stays learnable. Thousands of controls,
layers, panels — and it doesn't collapse under its own weight. The key is
progressive disclosure: show the minimum, reveal on demand. If you're building
anything with tool panels, property inspectors, or nested UI, study how Figma
handles information density without making you scroll through settings pages.

---

## Working With This System

The workflow, in practice:

1. Identify the domain from the user's prompt
2. Load the domain profile from `domain-map.json`
3. Load CSS tokens from `assets/css/` (reset, type scale, space scale, motion)
4. Load color tokens from `assets/css/color-tokens/` or domain token JSON
5. Inject everything as CSS custom properties
6. Build components using the tokens — never hardcode values
7. Run the 15-rule checklist from `SKILL.md`
8. Ship it

If a generated component uses `#FFFFFF` as a background, `8px` as a border
radius, or Inter as the only font — it hasn't gone through this process. Go
back to step 2.

The goal isn't perfection. The goal is intention. Every visual decision should
trace back to a domain profile value, not to a model's default output. That's
the whole game.
