# Animation & Motion: Making Things Move Without Making People Hate You

Motion is the most abused tool in the AI-generated UI toolkit. Every generated page
has the same fade-up-on-scroll, the same bouncy card hover. احا — stop it. Motion
should be invisible when it works and only noticeable when it's missing.

---

## Motion Library Landscape

| Library | Platform | Best For | Size | Performance |
|---------|----------|----------|------|-------------|
| Motion (Framer Motion v12.x) | React + vanilla + Vue | General React animation | ~5KB (LazyMotion) | Hybrid: JS + WAAPI, 120fps |
| GSAP 3.14.x | Any vanilla JS | Complex timelines, ScrollTrigger | ~30KB core | Compositor thread |
| CSS scroll-driven animations | Web (no JS) | Scroll-linked effects | 0KB (native) | Compositor GPU |
| View Transitions API | Web (no JS) | Page transitions SPA + MPA | 0KB (native) | Compositor |
| React Native Reanimated 4.x | React Native | Gesture-driven, shared elements | — | UI thread worklets |
| SwiftUI animations | iOS / macOS | Spring-based, interruptible | — | Core Animation |
| Compose Animation | Android | State-driven transitions | — | RenderThread |
| Rive | Web + native | Interactive vector animations | ~60KB runtime | Skia/WebGL |

**Quick decision:** React layout animations = Motion. Scroll-linked = CSS first, GSAP if not enough.
Page transitions = View Transitions API. Complex sequences = GSAP timeline. React Native = Reanimated.
هانت — if you're importing GSAP just to fade in a card, a CSS transition does it in zero deps.

---

## Timing Fundamentals

| Category | Range | Sweet Spot | Example |
|----------|-------|------------|---------|
| Micro-interactions | 100-300ms | 150-250ms | Button, toggle, checkbox |
| Medium transitions | 300-500ms | 300-400ms | Modal, panel slide, tab switch |
| NEVER for routine UI | >500ms | -- | Something is wrong |

**Hard rules:** Desktop ~30% faster than mobile. Exit faster than entry (200ms in, 150ms out).
Respond to user actions in <100ms even if the full animation takes longer.

### Motion Token System

```css
:root {
  --motion-duration-instant: 100ms;  --motion-duration-fast: 150ms;
  --motion-duration-normal:  250ms;  --motion-duration-slow: 350ms;
  --motion-duration-slower:  450ms;  --motion-duration-slowest: 500ms;

  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* Material 3 */
  --motion-ease-in:       cubic-bezier(0.4, 0, 1, 1);    /* Accelerate — exit */
  --motion-ease-out:      cubic-bezier(0, 0, 0.2, 1);    /* Decelerate — entry */
  --motion-ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
  --motion-ease-spring-bouncy: linear(0, 0.004, 0.016, 0.035, 0.098, 0.191,
    0.316, 0.473, 0.659, 0.876, 1.035, 1.12, 1.108, 1.015, 0.91, 0.879,
    0.915, 0.985, 1.02, 1.0, 0.988, 1.0);
  --motion-ease-spring-snappy: linear(0, 0.035, 0.141, 0.346, 0.694, 0.966,
    1.036, 1.016, 0.992, 1.0);
}
```

يسطا — `linear()` easing is the sleeper hit of modern CSS. Encode any spring curve
as control points. No JS physics needed.

---

## Motion Design Principles

### Material Design 3 (Google)
- **Curve:** `cubic-bezier(0.2, 0, 0, 1)`. Container transforms — card expands into detail page,
  FAB morphs into dialog. Shared axis: forward = left, back = right, hierarchy = vertical.
- **Best for:** Android apps, Material web, data dashboards, e-commerce browse flows.

### Apple HIG
- **Signature:** Springs everywhere. Duration is emergent — define `response` + `dampingFraction`.
  ALL animations interruptible; new input picks up current velocity mid-animation.
  `matchedGeometryEffect` for shared element transitions.
- **Best for:** Creative tools, consumer apps, gesture-heavy UIs, portfolios.

### Vercel/Linear Style
- **Signature:** "Invisible motion." Snappy, no overshoot, no bounce. `200ms ease-out` for
  everything. If you can perceive the duration, it's too slow.
- **Best for:** Developer tools, fintech, B2B SaaS — where users repeat actions 500x/day.

### IBM Carbon
- **Two modes:** Productive (100-200ms, functional) vs. Expressive (300-500ms, personality).
  Productive is default. Motion communicates hierarchy, not decoration.
- **Best for:** Enterprise software, admin panels, internal tools.

| Domain | Philosophy | Why |
|--------|-----------|-----|
| Fintech / Trading | Vercel/Linear | Speed is trust. Bounce = "is my money bouncing?" |
| Creative / Portfolio | Apple HIG | Springs feel organic for gesture-driven UIs |
| Enterprise / Admin | IBM Carbon | Productive default, expressive for onboarding |
| Consumer mobile | Material 3 | Container transforms build spatial memory |
| Developer tools | Vercel/Linear | Make motion fast enough they won't disable it |

---

## Animation Patterns with Code

### 1. Staggered List Reveal
```jsx
// Motion
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } }
};
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>{i.name}</motion.li>)}
</motion.ul>
```
```css
/* Pure CSS — use custom prop: style="--i: 3" */
.list-item {
  opacity: 0; transform: translateY(12px);
  animation: reveal 300ms var(--motion-ease-standard) forwards;
  animation-delay: calc(var(--i) * 60ms);
}
@keyframes reveal { to { opacity: 1; transform: translateY(0); } }
```

### 2. Scroll-Driven Progress Bar (CSS only)
```css
.progress-bar {
  position: fixed; top: 0; left: 0; width: 100%; height: 3px;
  background: var(--color-accent); transform-origin: left;
  animation: grow linear both; animation-timeline: scroll();
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```

### 3. Shared Element Transition (View Transitions API)
```css
.product-image { view-transition-name: hero-image; }
::view-transition-old(hero-image), ::view-transition-new(hero-image) {
  animation-duration: 300ms; animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```
```js
document.startViewTransition(() => updateProductDetail(newProduct));
```

### 4. Page-Load Choreography (GSAP)
```js
const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });
tl.from(".hero-heading", { y: 40, opacity: 0 })
  .from(".hero-subtitle", { y: 30, opacity: 0 }, "-=0.4")
  .from(".hero-cta", { y: 20, opacity: 0, scale: 0.95 }, "-=0.3")
  .from(".hero-image", { x: 60, opacity: 0, duration: 0.8 }, "-=0.5");
```

### 5. Spring-Based Drag (Motion)
```jsx
<motion.div drag dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.15} whileDrag={{ scale: 1.05 }}
  transition={{ type: "spring", damping: 20, stiffness: 300 }} />
```

### 6. Scroll-Triggered Reveal (CSS `view()` Timeline)
```css
.reveal-on-scroll {
  opacity: 0; transform: translateY(20px);
  animation: slide-in 1s var(--motion-ease-standard) both;
  animation-timeline: view(); animation-range: entry 0% entry 40%;
}
@keyframes slide-in { to { opacity: 1; transform: translateY(0); } }
```

---

## Performance Hard Rules

**GPU-accelerated safe properties** (animate freely): `transform`, `opacity`, `filter`, `clip-path`.

**NEVER animate** (triggers layout every frame): `width`, `height`, `top`, `left`, `right`,
`bottom`, `margin`, `padding`, `border-width`, `font-size`. Use `transform: scale()` or
`transform: translate()` instead. Every layout-triggering frame recalculates geometry for
potentially every element. At 60fps that's 16.6ms budget — layout alone eats 10ms+.

**`will-change` rules:**
- Add before animation starts, remove after (`transitionend` listener)
- Max ~5 elements at a time — each creates a GPU layer consuming memory
- Never blanket `* { will-change: transform; }` — promotes everything to separate layers
- `contain: layout` is the better long-term optimization

```css
.card:hover { will-change: transform; }  /* DO */
* { will-change: transform; }  /* احا — GPU memory leak */
```

---

## Accessibility — prefers-reduced-motion

Not optional. WCAG 2.1 AA requirement. Users with vestibular disorders get nausea from motion.

```css
/* Replace spatial motion with fades — don't just remove */
.list-item {
  animation: slide-in 300ms var(--motion-ease-standard) both;
  animation-delay: calc(var(--i) * 60ms);
}
@keyframes slide-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .list-item { animation: fade-in 150ms ease both; animation-delay: 0ms; }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
}
```

```js
// Motion — conditional transforms
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
<motion.div initial={{ opacity: 0, y: reduced ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.15 : 0.3 }} />

// GSAP — speed everything to near-instant
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  gsap.globalTimeline.timeScale(20);
```

**Rules:** Spatial transforms become opacity fades. Stagger delays become 0. Parallax completely
disabled. Carousels pause. Scroll-linked stays only if no spatial movement (progress bar = fine).

---

## Anti-Patterns

### 1. Bounce on Enterprise UIs
`cubic-bezier(0.68, -0.55, 0.265, 1.55)` says "playful." Your expense dashboard is not.
Never in fintech, healthcare, or enterprise.

### 2. >500ms Routine Interactions
Dropdown takes 500ms? Users click twice thinking it failed. 250ms max for direct triggers.

### 3. Parallax Without Purpose
Every parallax element must answer: "What does this depth communicate?" If the answer is
"it looks cool" you've added a vestibular trigger for zero informational value.

### 4. Animating Width/Height Instead of Transform
```css
.sidebar { transition: width 300ms; }      /* BAD — layout every frame */
.sidebar { transition: transform 300ms; }  /* GOOD — compositor only */
```

### 5. No prefers-reduced-motion
If your animation code lacks a reduced-motion query, it's not done. Full stop.

### 6. Page-Load Delays >1 Second
Content should be fully visible within 1s of paint. Your staggered reveal showing the
last card at 2.5s trades usability for theater.

### 7. `will-change` on Everything
200 cards with `will-change: transform, opacity, box-shadow` = hundreds of MB in GPU memory.
Mobile Safari drops layers. Chrome stalls. Use it surgically or not at all.

### 8. Animating Box-Shadow Directly
Pre-render shadow on a pseudo-element, animate its `opacity` instead. Box-shadow triggers
paint; opacity is compositor-only.

---

*يسطا — motion is a power tool. Restraint, timing, and knowing which properties hit
the GPU. That's the whole game. Now go animate something. Tastefully.*
