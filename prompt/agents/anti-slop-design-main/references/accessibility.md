# Accessibility — Field Notes

> "Accessibility isn't a feature you bolt on. It's a quality bar you either meet or you don't.
> The law doesn't care about your roadmap." — field notes, 2025

---

## Legal Context

The numbers are not ambiguous anymore.

**United States (2025)**:
- **2,019 ADA digital accessibility lawsuits** filed in H1 2025 alone — a 37% increase year-over-year.
- **22.6% of lawsuits targeted sites that already had accessibility overlays installed.** The overlays didn't help. They arguably made things worse by giving companies false confidence.
- FTC fined **accessiBe $1M** for misleading claims about their overlay product. The settlement explicitly stated their widget did not make sites compliant.

**European Union (2025)**:
- The **European Accessibility Act (EAA)** became enforceable **June 28, 2025**. This applies to any company selling products or services to EU consumers — not just EU-based companies.
- First EAA enforcement actions and lawsuits landed in **November 2025**. Member states have their own penalty structures.

**Bottom line**: Overlays don't work. They never did. Compliance must be baked into the design and implementation. There is no shortcut, no magic `<script>` tag, no third-party widget that absolves you. If your plan is "we'll add an overlay later," your plan is to get sued.

يسطا — just build it right from the start. هانت.

---

## WCAG 2.2 Key Requirements (Level AA)

These are the criteria that actually bite people in production. Not an exhaustive list — these are the ones I see fail constantly.

| Criterion | Requirement | Implementation Notes |
|-----------|-------------|---------------------|
| **1.4.3 Contrast (Minimum)** | 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold) | Use OKLCH for perceptually uniform contrast checking. sRGB hex-based checkers lie at the edges. Tools: APCA for relative luminance if you want better accuracy than WCAG 2.x formula. |
| **1.4.11 Non-Text Contrast** | 3:1 contrast ratio for UI components and graphical objects | Borders on inputs, icon fill/stroke, focus rings, chart segments — all need 3:1 against adjacent colors. Ghost buttons with light gray borders on white? That's a fail. |
| **2.4.7 Focus Visible** | Keyboard focus indicator must always be visible | Use `:focus-visible` (not `:focus`) with minimum 2px outline offset. Don't rely on browser defaults — they're inconsistent and often invisible on dark backgrounds. |
| **2.4.11 Focus Not Obscured (Minimum)** | Focused element must not be entirely hidden by sticky/fixed content | Sticky headers, cookie banners, bottom navs — they all obscure focus. Use `scroll-margin-top`, `scroll-padding`, and manage z-index so focused elements are never fully covered. |
| **2.5.8 Target Size (Minimum)** | Interactive targets must be at least 24x24 CSS pixels | Padding counts. A 16px icon inside a 44px tap target is fine. But a bare 16px icon link with no padding? Fail. Use `min-width`/`min-height` or padding to hit the threshold. |
| **3.3.7 Redundant Entry** | Don't ask users to re-enter information they already provided | Persist form data across steps. If someone entered their address on step 1, don't make them type it again on step 3. Use autocomplete attributes properly. |
| **3.3.8 Accessible Authentication (Minimum)** | No cognitive function tests for authentication | Support paste in password fields. Support password managers. No "type the letters you see" CAPTCHAs without alternatives. No "drag the puzzle piece." |
| **4.1.2 Name, Role, Value** | All interactive controls must have accessible names and expose their state | Every `<button>`, `<input>`, custom widget needs a name — via visible label, `aria-label`, or `aria-labelledby`. State changes (expanded, selected, checked) must be communicated. |
| **1.3.1 Info and Relationships** | Structure conveyed visually must be conveyed programmatically | Heading hierarchy (`h1`-`h6`), table headers (`<th scope>`), form grouping (`<fieldset>`/`<legend>`). If it looks like a list, it better be a `<ul>`. |
| **2.1.1 Keyboard** | All functionality available via keyboard | Every click handler needs a keyboard equivalent. Every drag interaction needs an alternative. If you can't Tab to it and activate it with Enter/Space, it's broken. |

---

## ARIA Patterns (APG Reference)

ARIA is a repair tool, not a first choice. Use native HTML elements when they exist. When they don't — here's how to do it properly.

### Combobox (Autocomplete / Search Input)

```html
<label for="city-input">City</label>
<div class="combobox-wrapper">
  <input
    id="city-input"
    role="combobox"
    aria-expanded="false"
    aria-autocomplete="list"
    aria-controls="city-listbox"
    aria-activedescendant=""
  />
  <ul id="city-listbox" role="listbox" hidden>
    <li id="city-opt-1" role="option">Cairo</li>
    <li id="city-opt-2" role="option">Amman</li>
    <li id="city-opt-3" role="option">Beirut</li>
  </ul>
</div>
```

Arrow keys navigate options (updating `aria-activedescendant`), Enter selects, Escape closes. Type-ahead filters; announce result count via live region.

### Dialog (Modal)

```html
<dialog id="confirm-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm deletion</h2>
  <p>This action cannot be undone. Delete this item?</p>
  <div class="dialog-actions">
    <button type="button" data-action="cancel">Cancel</button>
    <button type="button" data-action="confirm" autofocus>Delete</button>
  </div>
</dialog>
```

Native `<dialog>` with `.showModal()` gives you focus trap and backdrop for free. If using `role="dialog"` on a `<div>`, implement focus trap manually. Escape closes; focus returns to the trigger element. Nothing outside the dialog should be reachable while open.

### Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Project settings">
    <button role="tab" id="tab-general" aria-selected="true"
            aria-controls="panel-general" tabindex="0">General</button>
    <button role="tab" id="tab-members" aria-selected="false"
            aria-controls="panel-members" tabindex="-1">Members</button>
    <button role="tab" id="tab-billing" aria-selected="false"
            aria-controls="panel-billing" tabindex="-1">Billing</button>
  </div>
  <div role="tabpanel" id="panel-general" aria-labelledby="tab-general">
    <!-- General content -->
  </div>
  <div role="tabpanel" id="panel-members" aria-labelledby="tab-members" hidden>
    <!-- Members content -->
  </div>
  <div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" hidden>
    <!-- Billing content -->
  </div>
</div>
```

**Roving tabindex**: only the active tab gets `tabindex="0"`, others `tabindex="-1"`. Arrow Left/Right moves between tabs, Home/End to first/last. Tab key moves focus INTO the active panel. `aria-selected="true"` on active tab only.

### Data Grid

```html
<table role="grid" aria-label="Employee directory">
  <thead>
    <tr>
      <th role="columnheader" aria-sort="ascending" aria-colindex="1">
        <button>Name</button>
      </th>
      <th role="columnheader" aria-sort="none" aria-colindex="2">
        <button>Department</button>
      </th>
      <th role="columnheader" aria-colindex="3">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td aria-colindex="1">Yousef Anas</td>
      <td aria-colindex="2">Engineering</td>
      <td aria-colindex="3">yousef@example.com</td>
    </tr>
  </tbody>
</table>
```

Use `role="grid"` only when cells are interactive. For read-only data, plain `<table>` is correct and simpler. `aria-sort` values: `ascending`, `descending`, `none`, `other`. `aria-colindex` required when columns are virtualized. Arrow keys navigate cells, Enter activates.

### Live Regions

```html
<!-- Toast notifications — polite, don't interrupt -->
<div aria-live="polite" aria-atomic="true" class="toast-container">
  <!-- Toasts injected here by JS -->
</div>

<!-- Form validation errors — assertive, announce immediately -->
<div aria-live="assertive" role="alert" class="error-summary">
  <!-- Error messages injected here -->
</div>

<!-- Status updates — polite, informational -->
<div role="status" class="search-status">
  <!-- "3 results found" or "Loading..." -->
</div>
```

`polite` waits for the screen reader to finish; `assertive` interrupts (use sparingly). `role="status"` implies `polite`, `role="alert"` implies `assertive` — no need to double-declare. `aria-atomic="true"` reads the entire region, not just changes. Content must be **injected dynamically** to trigger announcement.

### Disclosure / Accordion

```html
<!-- Native HTML — preferred approach -->
<details>
  <summary>Shipping information</summary>
  <div class="details-content">
    <p>We ship to 40+ countries. Standard delivery takes 5-7 business days.</p>
  </div>
</details>

<!-- ARIA approach — when you need more styling control -->
<div class="accordion">
  <h3>
    <button aria-expanded="false" aria-controls="section-shipping">
      Shipping information
    </button>
  </h3>
  <div id="section-shipping" role="region" aria-labelledby="..." hidden>
    <p>We ship to 40+ countries. Standard delivery takes 5-7 business days.</p>
  </div>
</div>
```

Native `<details>`/`<summary>` handles keyboard, state, and announcements out of the box — use it when possible. ARIA version: toggle `aria-expanded` and `hidden` on the panel. Enter/Space toggles. For single-open accordion groups, manage state in JS but don't use `role="tablist"` — accordions are not tabs.

---

## Preference-Based Adaptations

Respect what the user asked for. These media queries exist because people need them.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Gentle fades instead of hard cuts where needed */
  .slide-up { animation: none; transform: none; transition: opacity 150ms ease; }
}
```

Don't just slap `animation: none` on everything. Progress bars, loading spinners, and state transitions are functional. The goal is removing vestibular-trigger motion, not all visual feedback.

### High Contrast

```css
@media (prefers-contrast: more) {
  :root {
    --text-primary: oklch(0.05 0 0);       /* Near-black */
    --text-secondary: oklch(0.2 0 0);      /* Dark gray, not mid-gray */
    --bg-primary: oklch(1 0 0);            /* Pure white */
    --bg-surface: oklch(0.97 0 0);         /* Barely off-white */
    --border-default: oklch(0.15 0 0);     /* Strong borders */
    --border-subtle: oklch(0.35 0 0);      /* "Subtle" but still visible */
  }

  /* Boost focus indicators */
  :focus-visible {
    outline: 3px solid oklch(0.05 0 0);
    outline-offset: 2px;
  }

  /* Kill translucency that reduces readability */
  .glass-panel,
  .frosted-bg {
    backdrop-filter: none;
    background: var(--bg-surface);
  }
}
```

### Windows High Contrast (Forced Colors)

```css
@media (forced-colors: active) {
  /* The system overrides most colors. Work WITH it, not against it. */

  /* Ensure custom focus rings use system colors */
  :focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }

  /* Borders that were invisible (same color as bg) become visible */
  .card,
  .input,
  .button {
    border: 1px solid ButtonText;
  }

  /* SVG icons need forced color */
  .icon svg {
    fill: currentColor;
    forced-color-adjust: auto;
  }

  /* Disable decorative backgrounds that become noise */
  .hero-gradient,
  .decorative-bg {
    background: Canvas;
    forced-color-adjust: none;
  }

  /* System color keywords you can use:
     Canvas, CanvasText, LinkText, VisitedText,
     ActiveText, ButtonFace, ButtonText, Field,
     FieldText, Highlight, HighlightText,
     GrayText, Mark, MarkText */
}
```

احا — the number of sites that break completely in Windows High Contrast mode is embarrassing. Test it. It takes 30 seconds to toggle on.

---

## Testing Checklist

Automated tools catch maybe 30-40% of accessibility issues. The rest require a human.

- [ ] **Keyboard navigation**: Tab through the entire page. Can you reach everything? Can you activate everything? Can you always see where focus is? Can you escape modals and menus?

- [ ] **Screen reader testing**: Test with at least one of NVDA (free, Windows), VoiceOver (macOS/iOS), TalkBack (Android). Listen to the page — does it make sense without seeing it? Are interactive elements announced with their role and state?

- [ ] **200% zoom**: Browser zoom to 200%. No content should overflow, get clipped, or overlap. No horizontal scrolling on single-column content. Text must reflow.

- [ ] **Color-only information removal**: Squint test or use a grayscale filter. Can you still distinguish error states from success states? Can you read the chart without color? Are links distinguishable from surrounding text without color?

- [ ] **Focus management on dynamic content**: When a modal opens, does focus move into it? When it closes, does focus return to the trigger? When content loads dynamically (infinite scroll, SPA navigation), is focus handled or is it lost in the void?

- [ ] **Form error handling**: Are errors associated with their fields via `aria-describedby`? Is there an error summary? Can a screen reader user find and understand all errors? Are errors announced via live region when they appear?

- [ ] **Heading hierarchy**: Run a heading outline tool (or check in screen reader). Is there one `h1`? Do headings descend logically without skipping levels? Do they describe the content structure?

- [ ] **Touch target size**: On mobile, are all interactive elements at least 24x24 CSS px? (44x44 is the ideal.) Are targets spaced enough to avoid accidental activation?

---

## Anti-Patterns

Things I see in production constantly. Every single one of these is a real WCAG failure.

### 1. `outline: none` Without Replacement

```css
/* The accessibility crime scene */
*:focus { outline: none; }

/* احا — you just made your site unusable for keyboard users */
/* Fix: */
*:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

Designers remove outlines because they "look ugly" on click. `:focus-visible` exists specifically for this — it shows the ring for keyboard users, hides it for mouse users. There is no excuse for bare `outline: none` in 2025.

### 2. `aria-label` Duplicating Visible Text

```html
<!-- Wrong: screen reader says "Submit Submit" -->
<button aria-label="Submit">Submit</button>

<!-- Right: label only when there's no visible text -->
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>

<!-- Right: visible text IS the accessible name -->
<button>Submit</button>
```

`aria-label` **overrides** visible text for screen readers. If the button already says "Submit," the label is redundant at best, confusing at worst when someone "helpfully" makes them slightly different.

### 3. `<div>` as Button

```html
<!-- Wrong: no keyboard support, no role, no announcement -->
<div class="btn" onclick="doThing()">Click me</div>

<!-- Right: just use a button -->
<button type="button" onclick="doThing()">Click me</button>
```

A `<div>` with `onclick` gets no focus, no Enter/Space, no screen reader announcement. You'd need `role="button"`, `tabindex="0"`, keydown handlers, and cursor styling. Or just use `<button>` and get all of that for free.

### 4. Placeholder-Only Labels

```html
<!-- Wrong: placeholder disappears on input, no persistent label -->
<input type="email" placeholder="Email address" />

<!-- Right: visible label + optional placeholder -->
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com" />
```

Placeholders vanish when you type. Users with cognitive disabilities or just anyone on a long form can't remember what field they're in. Placeholders are hints, not labels.

### 5. Auto-Playing Media

```html
<!-- Wrong: surprise audio/video -->
<video autoplay src="promo.mp4"></video>

<!-- Acceptable: muted autoplay (still provide pause control) -->
<video autoplay muted src="ambient.mp4">
  <button class="video-control">Pause background video</button>
</video>
```

Auto-playing media with sound talks over screen readers. Muted autoplay is tolerable IF there's a visible pause/stop control.

### 6. Accessibility Overlays

```html
<!-- The "$50/month compliance" fantasy -->
<script src="https://overlay-vendor.com/magic-widget.js"></script>
```

Overlays add ARIA on top of broken markup and call it accessible. 22.6% of ADA lawsuits targeted sites with overlays. FTC fined accessiBe $1M. The NFB publicly opposes overlays. If a vendor promises "one line of JavaScript" for compliance, they're selling you a lawsuit.

### 7. `aria-hidden="true"` on Interactive Elements

```html
<!-- Wrong: element exists in tab order but is invisible to screen readers -->
<button aria-hidden="true">Close</button>

<!-- This creates a "ghost button" — keyboard users can focus it,
     but screen readers won't announce it. The user presses Enter
     on something they can't identify. -->

<!-- Fix: if you want to hide it, ALSO remove from tab order -->
<button aria-hidden="true" tabindex="-1">Close</button>

<!-- Or better: just don't render it if it shouldn't be interactive -->
```

### 8. Color-Only Error Indication

```css
/* Wrong: red border is the only error signal */
.input-error { border-color: red; }

/* Right: color + icon + text */
.input-error {
  border-color: var(--color-error);
  border-width: 2px;
}
.input-error + .error-message {
  color: var(--color-error);
  /* Includes error icon SVG + descriptive text */
}
```

```html
<input type="email" class="input-error" aria-describedby="email-error" aria-invalid="true" />
<span id="email-error" class="error-message">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Please enter a valid email address.
</span>
```

8% of men have some form of color vision deficiency. If the only thing that says "this field has an error" is a red border, those users are stuck guessing.

---

## References

- [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [UsableNet 2025 ADA Lawsuit Report](https://blog.usablenet.com/midyear-report-2025-ada-digital-accessibility-lawsuits)
- [European Accessibility Act (EAA)](https://ec.europa.eu/social/main.jsp?catId=1202)
- [APCA Contrast Algorithm](https://github.com/Myndex/SAPC-APCA)
- [Overlay Fact Sheet](https://overlayfactsheet.com/)
