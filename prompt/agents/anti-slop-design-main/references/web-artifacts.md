# Web Artifacts — Claude.ai Sandbox Reference

You're building inside a sandboxed iframe on claude.ai. The good news: you get
React, Tailwind utilities, and a decent library shelf. The bad news: you get
nothing else. No bundler, no external CSS imports at render time, no filesystem,
no localStorage. Everything ships in one file, or it doesn't ship at all.

This reference covers how to make that one file look like someone with taste
built it, not like Claude's default aesthetic threw up inside a `<div>`.

---

## Environment Constraints

The artifact sandbox pre-bundles a specific set of libraries. You don't get to
`npm install` anything. Here's what's on the shelf:

**React ecosystem:**
- `react`, `react-dom` (obviously)
- `lucide-react` — icon library, solid default choice
- `shadcn/ui` components — available but ship with their own opinions; override them

**Data & visualization:**
- `recharts` — React charting, good for dashboards
- `d3` — the full D3 library, for when Recharts isn't enough
- `Chart.js` — canvas-based charts
- `Plotly` — heavy but feature-complete
- `Three.js r128` — 3D rendering (yes, in an artifact; no, you probably shouldn't)

**Audio & data processing:**
- `Tone.js` — audio synthesis
- `Papaparse` — CSV parsing
- `SheetJS` — Excel file handling
- `mammoth` — .docx to HTML

**ML:**
- `tensorflow` — TensorFlow.js, for in-browser inference

**Styling:**
- Tailwind core utilities are available (no JIT compiler, no custom config)
- Inline `<style>` blocks work and are your best friend
- Google Fonts via CDN `<link>` injection (useEffect, not static HTML)
- External scripts from `cdnjs.cloudflare.com` only

**Hard constraints — things that will silently fail or error:**
- `localStorage` and `sessionStorage` are blocked. Use `window.storage` if you
  need persistence (it's a sandbox-provided shim)
- `<form>` elements don't work in React artifacts. Use controlled inputs + onClick
- `prefers-color-scheme` media query doesn't reflect the user's actual OS setting
  inside the iframe. Implement dark mode as React state
- No external image URLs. Use inline SVG, data URIs, or emoji
- No `@import` in CSS — it blocks rendering and may not resolve anyway

---

## Inlining Strategy

Everything lives in one file. That means your CSS reset, type scale, color
tokens, motion tokens, and domain-specific overrides all get inlined into a
single const string. Here's the template — adapt it, don't copy it verbatim
with the example values still in there.

```jsx
const styles = `
  /* === Reset === */
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
  html { font-size: 100%; -webkit-text-size-adjust: 100%; }
  img, svg { display: block; max-width: 100%; }

  /* === Fluid Type Scale === */
  :root {
    --text-xs: clamp(0.75rem, 0.7rem + 0.25vi, 0.875rem);
    --text-sm: clamp(0.875rem, 0.8rem + 0.38vi, 1rem);
    --text-base: clamp(1rem, 0.34vi + 0.91rem, 1.19rem);
    --text-lg: clamp(1.25rem, 0.61vi + 1.1rem, 1.58rem);
    --text-xl: clamp(1.56rem, 1vi + 1.31rem, 2.11rem);
    --text-2xl: clamp(1.95rem, 1.56vi + 1.56rem, 2.81rem);
    --text-3xl: clamp(2.44rem, 2.38vi + 1.85rem, 3.75rem);
  }

  /* === Fluid Space Scale === */
  :root {
    --space-xs: clamp(0.25rem, 0.2rem + 0.25vi, 0.5rem);
    --space-sm: clamp(0.5rem, 0.4rem + 0.5vi, 0.75rem);
    --space-md: clamp(1rem, 0.8rem + 1vi, 1.5rem);
    --space-lg: clamp(1.5rem, 1.2rem + 1.5vi, 2.5rem);
    --space-xl: clamp(2rem, 1.6rem + 2vi, 3.5rem);
    --space-2xl: clamp(3rem, 2.4rem + 3vi, 5rem);
  }

  /* === Domain Tokens (replace per domain) === */
  :root {
    --color-primary: oklch(0.55 0.18 250);
    --color-surface: oklch(0.985 0.003 85);
    --color-surface-2: oklch(0.96 0.006 85);
    --color-text: oklch(0.22 0.01 250);
    --color-text-muted: oklch(0.45 0.01 250);
    --color-accent: oklch(0.65 0.22 145);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 14px;
  }

  /* === Motion Tokens === */
  :root {
    --duration-fast: 120ms;
    --duration-normal: 220ms;
    --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
    --ease-out: cubic-bezier(0, 0, 0.25, 1);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* === Base Styles === */
  body {
    font-family: var(--font-body, 'General Sans', system-ui, sans-serif);
    font-size: var(--text-base);
    color: var(--color-text);
    background: var(--color-surface);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
`;
```

Inject this with a `<style>` tag inside your component's return:

```jsx
return (
  <>
    <style>{styles}</style>
    <div className="app">
      {/* your actual UI */}
    </div>
  </>
);
```

The key insight: this const string IS your design system. Treat it like one.
Don't scatter `style={{ color: '#333' }}` across fifty elements because you
were too lazy to define a token.

---

## Maximizing Quality

The sandbox is limited, not limiting. Here's how to make artifacts that don't
look like artifacts.

### Tailwind for layout, custom CSS for personality

Tailwind handles grid, flex, padding, margin — the structural stuff it's good
at. But the moment you need a distinctive visual identity, drop into your
`<style>` block. Tailwind alone produces Tailwind-looking output, which is
another way of saying "generic."

### Font loading via useEffect

Google Fonts won't work as a static `<link>` in the JSX return. Inject it:

```jsx
const useGoogleFont = (url) => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [url]);
};

// In your component:
useGoogleFont('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
```

Always define a fallback stack in your CSS tokens so the first render isn't
naked text in Times New Roman:
```css
--font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;
```

### Inline SVG textures for atmosphere

Flat white backgrounds scream "AI default." A grain overlay at 4% opacity
transforms the entire feel. Since you can't load external SVGs, inline them:

```jsx
const GrainOverlay = () => (
  <svg style={{
    position: 'fixed', inset: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 9999, opacity: 0.04,
    mixBlendMode: 'overlay'
  }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65"
        numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);
```

Drop `<GrainOverlay />` at the top of your component tree. Done. Instant
texture that costs almost nothing and signals "someone actually designed this."

### Dark mode via state toggle

`prefers-color-scheme` is useless in the sandbox. Use state:

```jsx
const [theme, setTheme] = React.useState('light');
```

Define both themes in your `<style>` block using class selectors:

```css
.theme-light {
  --color-surface: oklch(0.985 0.003 85);
  --color-text: oklch(0.22 0.01 250);
}
.theme-dark {
  --color-surface: oklch(0.145 0.008 260);
  --color-text: oklch(0.92 0.005 85);
}
```

Then apply: `<div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>`

Tailwind's `dark:` variants work too if you toggle a `dark` class on a parent
element. Mix both approaches — Tailwind `dark:` for quick utility overrides,
custom CSS classes for the token-level theme switch.

### shadcn/ui with taste

shadcn components are available but ship with their own aesthetic (which is,
unsurprisingly, the same aesthetic every other artifact has). Override the CSS
custom properties they rely on:

```css
/* Override shadcn defaults in your <style> block */
:root {
  --background: oklch(0.985 0.003 85);   /* not #FFFFFF */
  --foreground: oklch(0.22 0.01 250);    /* not #000000 */
  --primary: oklch(0.55 0.18 250);       /* not indigo-500 */
  --radius: 6px;                          /* not 8px */
}
```

### Animation in the style block

CSS animations and transitions go in your `<style>` const. Don't reach for
Framer Motion (it's not available anyway). CSS is perfectly capable:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fade-up var(--duration-normal) var(--ease-out) both;
}
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
```

### Complete example: a fintech mini-dashboard

This is what a non-generic artifact actually looks like. Note: domain tokens,
font loading, grain texture, dark mode toggle, fluid scale, reduced motion
handling — all in one file. No excuses.

```jsx
const App = () => {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const styles = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    :root {
      --text-sm: clamp(0.8rem, 0.75rem + 0.25vi, 0.9rem);
      --text-base: clamp(0.95rem, 0.9rem + 0.25vi, 1.05rem);
      --text-2xl: clamp(1.8rem, 1.4rem + 2vi, 2.6rem);
      --space-sm: clamp(0.5rem, 0.4rem + 0.5vi, 0.75rem);
      --space-md: clamp(1rem, 0.8rem + 1vi, 1.5rem);
      --duration-fast: 100ms;
      --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
    }
    .theme-light {
      --surface: oklch(0.98 0.004 250);
      --surface-2: oklch(0.95 0.008 250);
      --text-1: oklch(0.18 0.01 250);
      --text-2: oklch(0.45 0.01 250);
      --accent: oklch(0.52 0.14 160);
      --negative: oklch(0.55 0.2 25);
    }
    .theme-dark {
      --surface: oklch(0.14 0.008 260);
      --surface-2: oklch(0.19 0.012 260);
      --text-1: oklch(0.92 0.005 250);
      --text-2: oklch(0.65 0.01 250);
      --accent: oklch(0.65 0.16 160);
      --negative: oklch(0.65 0.2 25);
    }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: var(--surface);
      color: var(--text-1);
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .card {
      background: var(--surface-2);
      border-radius: 3px;
      padding: var(--space-md);
      border: 1px solid oklch(0.5 0 0 / 0.06);
    }
    .stat { font-size: var(--text-2xl); font-weight: 700; letter-spacing: -0.03em; }
    .label { font-size: var(--text-sm); color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
    .positive { color: var(--accent); }
    .negative { color: var(--negative); }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}
           style={{ minHeight: '100vh', padding: 'var(--space-md)' }}>
        <header className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h1 style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>Portfolio</h1>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>
        <div className="grid grid-cols-3 gap-3">
          <div className="card">
            <div className="label">Total Value</div>
            <div className="stat mono">$284,912</div>
            <div className="positive mono" style={{ fontSize: 'var(--text-sm)' }}>+2.4%</div>
          </div>
          <div className="card">
            <div className="label">Day P&L</div>
            <div className="stat mono negative">-$1,203</div>
          </div>
          <div className="card">
            <div className="label">Open Positions</div>
            <div className="stat mono">14</div>
          </div>
        </div>
      </div>
    </>
  );
};
```

Notice: 3px border radius (fintech, not 8px), DM Sans + JetBrains Mono (not
Inter), off-white surface in OKLCH (not #FFFFFF), uppercase labels with
letter-spacing, monospace numbers. Every choice is a deliberate departure from
the default.

---

## When to Escalate

An artifact is a single file. That's a feature until it's a constraint. Here's
when to tell the user "this needs a real project":

- **Multiple routes or pages** — React Router doesn't exist in the sandbox.
  If you're faking it with state-based view switching and the logic is getting
  gnarly, it's time to leave.
- **Complex state management** — If you're passing props through four levels or
  wishing for useContext/useReducer with multiple providers, the single-file
  format is fighting you.
- **Over 500 lines** — Not a hard rule, but a strong signal. If you're scrolling
  through 700 lines of JSX and inline CSS and squinting to find the component
  you need to edit, you've outgrown the format.
- **Heavy TypeScript needs** — Artifacts run JSX, not TSX. If the user needs
  strict typing, interfaces, and generics, suggest a proper project.
- **Multi-file data** — If the artifact needs to process uploaded files, talk
  to an API, or manage anything beyond trivial ephemeral state, it's no longer
  an artifact. It's a prototype that needs a real home.
- **Build-step dependencies** — If you catch yourself wishing for PostCSS,
  CSS Modules, or a custom Tailwind config, the sandbox isn't the right venue.

The honest answer for when to escalate: when you're spending more time working
around sandbox limitations than building the actual thing.

---

## Anti-Patterns

These are the five fastest ways to make an artifact look like every other
artifact. They're tempting because they're easy. Resist.

### 1. Pure Tailwind, zero custom CSS

Tailwind is a utility framework, not a design system. If your entire artifact
is `className="bg-white text-gray-900 rounded-lg p-6 shadow-md"` with not a
single `<style>` block in sight, congratulations — you've built something
indistinguishable from a Tailwind UI copy-paste. Tailwind handles structure.
Custom CSS handles identity. You need both.

### 2. Ignoring font loading

The default font in the sandbox is whatever the browser's system font stack
resolves to. If you don't load a custom font, your carefully designed artifact
renders in San Francisco on Mac, Segoe UI on Windows, and Roboto on Android.
Three different looks, none of them intentional. Spend the three lines on
useEffect font injection. It matters.

### 3. White background + blue accent + centered layout

This is the claude.ai house style. It's what happens when you don't override
anything. White `#FFFFFF` background, Tailwind blue or indigo accent, everything
centered in a `max-w-2xl mx-auto` container. It looks like a code exercise, not
a designed product. Use OKLCH off-whites, pick a domain-appropriate accent color,
and break the centered-column habit.

### 4. Not using window.storage when persistence matters

The sandbox blocks localStorage, but `window.storage` exists as a shim. If your
artifact has settings, preferences, or any state the user would want preserved
between renders — use it. A theme toggle that resets every time the artifact
re-renders is a bad experience. A simple `window.storage.setItem('theme', theme)`
takes five seconds to implement and the user will actually notice.

### 5. Giant monolithic component

One 400-line component with all the JSX, all the state, all the handlers, and
all the inline styles tangled together. The artifact is one *file*, not one
*component*. Break it into multiple function components inside that file.
Extract your styles into a const. Extract your data into consts. The file is
the boundary, not the function.

---

## Artifact Preflight Checklist

Run this before you ship. Every time. It takes thirty seconds.

- [ ] All CSS is in `<style>` block or inline — no external stylesheet refs
- [ ] Font loaded via useEffect with system font fallback defined
- [ ] No `localStorage` calls — using `window.storage` if persistence needed
- [ ] No `<form>` elements — using controlled inputs with onClick
- [ ] Dark mode uses React state, not `prefers-color-scheme`
- [ ] Background is NOT `#FFFFFF` — using OKLCH off-white
- [ ] At least one SVG texture (grain, dots, noise) at low opacity
- [ ] Domain tokens injected as CSS custom properties in `:root`
- [ ] `prefers-reduced-motion` media query present (it works in iframes)
- [ ] Border radius matches domain, not blanket 8px
- [ ] Components are broken into logical pieces, not one giant function
- [ ] Renders without errors in strict mode
