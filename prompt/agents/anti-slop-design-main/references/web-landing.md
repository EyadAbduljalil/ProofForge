# Landing Page Design Reference

Landing pages are where AI slop goes to thrive. Every prompt that says "build me a
landing page" produces the same output: hero with gradient text, three feature columns,
a testimonial carousel, and a "Get Started Free" button. You've seen it. I've seen it.
Your users have seen it fourteen times this week and they've already stopped noticing.

This reference exists because a landing page is not a SaaS template with different
copy. An ecommerce landing page and a fintech landing page and a devtools landing page
should look absolutely nothing alike. The structure changes, the emphasis shifts, the
whole visual language is different. If your hero section works equally well for a
banking app and a skateboard brand, something has gone very wrong.

Read this before you touch a single `<section>` tag.

---

## Section Anatomy

Every landing page has sections. The AI default order is: hero, features (three columns),
social proof, CTA, footer. This order is fine for exactly one type of product (generic
SaaS) and wrong for almost everything else.

Here's how section order and emphasis shift by domain:

**SaaS / B2B**: Hero (value prop + screenshot) -> Feature breakdown (bento grid, not
three columns) -> Social proof (logo bar + case study) -> Pricing -> CTA -> Footer.
The screenshot in the hero does heavy lifting. If your product looks good, show it.
If it doesn't, fix your product.

**Ecommerce**: Hero (product imagery, full-bleed) -> Product grid or featured collection
-> Trust signals (shipping, returns, payment badges) -> Social proof (reviews, UGC) ->
Secondary collection -> Footer with policies. Notice: no "features" section. Nobody
cares about your ecommerce platform's features. They care about the products.

**Editorial / Media**: Featured article (full-width, editorial hero) -> Content grid
(masonry or asymmetric) -> Category navigation -> Newsletter CTA -> Footer. The content
IS the product. Don't put a marketing hero above the content people came for.

**Fintech**: Hero (trust-first, minimal) -> How it works (3-4 steps, numbered) ->
Security/compliance section -> Social proof (institutional logos, not user testimonials)
-> Pricing/comparison -> CTA -> Footer. Security comes before testimonials because
nobody cares how much your users love you if they don't trust you first.

**Healthcare**: Hero (empathy-first, real photography) -> How it works -> Compliance
badges (HIPAA, SOC2) -> Provider/patient testimonials -> CTA -> Footer. Stock photos
of smiling doctors will get you ratio'd on Twitter. Use real imagery or illustration.

**Creative / Portfolio**: Full-screen hero (project showcase) -> Selected work grid
(asymmetric) -> About/process -> Client list -> Contact CTA. No features section.
No pricing. The work speaks.

**Devtools**: Minimal hero (one sentence + code snippet) -> Live demo or playground ->
Feature deep-dive (with code examples) -> Integration logos -> Docs CTA -> Footer.
Developers will scroll past your marketing copy to find the code example. Put it early.

The pattern: **the closer your product is to something technical, the less marketing
fluff you need. The closer it is to something emotional, the more the visuals carry.**

---

## Hero Patterns

The hero is the first thing your user sees and the section AI gets wrong most
consistently. Here are the actual patterns, with CSS that works.

### Full-Bleed Image Hero

Best for: ecommerce, creative, editorial, hospitality. Domains where the visual IS
the message. A travel company hero should be 90% photograph and 10% text overlay.

```css
.hero-fullbleed {
  display: grid;
  grid-template: 1fr / 1fr;
  min-height: 85svh; /* svh, not vh — respects mobile browser chrome */
  overflow: hidden;
}
.hero-fullbleed > * {
  grid-area: 1 / 1;
}
.hero-fullbleed__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-fullbleed__content {
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: var(--space-xl) var(--space-lg);
  background: linear-gradient(to top, oklch(0.1 0 0 / 0.7), transparent 60%);
  color: oklch(0.97 0 0);
}
/* Domain token override — ecommerce gets bolder overlay: */
[data-domain="ecommerce"] .hero-fullbleed__content {
  background: linear-gradient(to top, oklch(0.08 0 0 / 0.8), transparent 50%);
}
```

### Split Hero (Text + Visual)

The workhorse. Good for SaaS, fintech, healthcare, devtools. The ratio matters:
60/40 if the text is the star (SaaS value prop), 50/50 if the visual is equally
important (product screenshot), 40/60 if the visual IS the argument (data viz product).

```css
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Default 50/50 */
  gap: var(--space-lg);
  align-items: center;
  padding: var(--space-2xl) var(--space-lg);
  min-height: 70svh;
}
/* SaaS: text-heavy, 60/40 */
[data-domain="saas"] .hero-split {
  grid-template-columns: 1.4fr 1fr;
}
/* Fintech: tighter, more restrained */
[data-domain="fintech"] .hero-split {
  grid-template-columns: 1.2fr 1fr;
  min-height: 60svh; /* Fintech doesn't need drama */
}
/* Healthcare: centered alignment, warmer */
[data-domain="healthcare"] .hero-split {
  align-items: center;
  gap: var(--space-2xl);
}
@media (max-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr;
    min-height: auto;
    text-align: center;
  }
}
```

### Video Hero

For media companies, creative agencies, product launches. The video should autoplay
muted — no one wants sound ambushing them. Keep it short (8-15 seconds, looped).

```css
.hero-video {
  position: relative;
  min-height: 90svh;
  overflow: hidden;
}
.hero-video__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-video__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90svh;
  text-align: center;
  padding: var(--space-lg);
}
/* Reduce motion: freeze the video, show poster */
@media (prefers-reduced-motion: reduce) {
  .hero-video__bg { display: none; }
  .hero-video { background: var(--color-bg-primary); }
}
```

### Minimal Text Hero (Devtools Style)

Linear, Vercel, Raycast energy. One sentence. Maybe two. A subtle gradient or
animated background. The confidence of not needing to explain yourself. This only
works if your brand is strong enough to carry it.

```css
.hero-minimal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 65svh;
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
}
.hero-minimal__headline {
  font-size: var(--text-4xl);
  font-weight: 500; /* Not 800. Confidence is quiet. */
  letter-spacing: -0.03em;
  max-width: 20ch; /* Force line breaks for rhythm */
  line-height: 1.1;
}
.hero-minimal__sub {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 45ch;
  margin-block-start: var(--space-md);
}
/* Optional: subtle radial glow behind the text */
.hero-minimal::before {
  content: '';
  position: absolute;
  width: 60vw;
  height: 60vw;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(0.5 0.15 var(--hue-primary) / 0.08),
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
}
```

---

## Social Proof

Social proof is the section where AI output gets laziest. A grid of grayscale logos
and a carousel of headshots with quotes. يسطا, we can do better.

### Logo Bars

Logo bars work. But the default implementation is garbage: logos at different sizes,
different visual weights, slapped in a row with `justify-content: space-between`.

**How to do it right:**
- Normalize visual weight. Every logo should feel the same "size" even if their
  pixel dimensions differ. A wordmark (Stripe) and an icon (Apple) need different
  actual sizes to feel equivalent.
- Use `filter: grayscale(1) opacity(0.5)` as default, color on hover. This isn't
  just aesthetic — it prevents the logo bar from becoming a visual circus.
- 5-7 logos max. More than that and you're padding the list with companies nobody
  recognizes. Quality over quantity.

```css
.logo-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg) var(--space-xl);
  padding: var(--space-xl) var(--space-lg);
}
.logo-bar__item {
  height: 2rem; /* Normalize height, let width be natural */
  filter: grayscale(1) opacity(0.4);
  transition: filter 200ms ease;
}
.logo-bar__item:hover {
  filter: grayscale(0) opacity(1);
}
/* Fintech: more subdued, tighter spacing */
[data-domain="fintech"] .logo-bar {
  gap: var(--space-md) var(--space-lg);
}
[data-domain="fintech"] .logo-bar__item {
  filter: grayscale(1) opacity(0.3);
  height: 1.5rem;
}
```

### Testimonial Cards vs. Inline Quotes

**Cards** work for SaaS, ecommerce, healthcare — domains where the person's role and
company matter. Include name, title, company, and a real photo (not a stock headshot).

**Inline quotes** work for editorial, creative, devtools — domains where the words
matter more than the attribution. A pull-quote in large italic type, attributed with
just a name and a dash.

```css
/* Card style — SaaS, ecommerce, healthcare */
.testimonial-card {
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
}
/* Inline quote style — editorial, creative, devtools */
.testimonial-quote {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-style: italic;
  font-weight: 300;
  line-height: 1.4;
  max-width: 55ch;
  border-inline-start: 3px solid var(--color-accent-primary);
  padding-inline-start: var(--space-md);
}
.testimonial-quote cite {
  display: block;
  font-style: normal;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-block-start: var(--space-sm);
}
```

### Metrics That Don't Feel Fake

"10,000+ happy customers" means nothing. It's the "I have a great personality" of
landing page copy. Real metrics are specific, slightly awkward, and verifiable:

- "4,847 deploys last Tuesday" (specific day = real)
- "$2.4M saved in Q3 2025" (specific quarter = accountable)
- "99.97% uptime, 38ms p95 latency" (two numbers = technical credibility)
- "Adopted by 3 of the 5 largest US banks" (fraction, not "trusted by enterprises")

The design treatment: large number, small label, no decorative icons.

```css
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--space-md);
  text-align: start; /* Not center. Left-aligned numbers feel more like data. */
}
.metric__value {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
.metric__label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-block-start: var(--space-2xs);
}
```

### Case Studies as Social Proof

For B2B and fintech, a testimonial card is nice. A case study link is better. It says
"we have a real story to tell" instead of "we begged someone for a quote."

Format: company logo + one-line result + link. Keep it scannable. Three case studies
max on the landing page — the detail lives on its own page.

---

## CTA Strategy

### Primary vs. Secondary

Every landing page should have exactly one primary CTA and one secondary. Not two
primaries. Not three. One primary ("Start free trial"), one secondary ("View demo"
or "Read docs"). The secondary is an escape hatch for people who aren't ready to
commit. Without it, you lose everyone who's interested but cautious.

```css
.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}
.cta-primary {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--text-base);
  cursor: pointer;
}
.cta-secondary {
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: var(--text-base);
  cursor: pointer;
}
```

### Domain-Specific CTA Language

"Get started" is the AI default for every CTA on every landing page in every domain.
It says nothing. Here's what actually works:

| Domain     | Primary CTA              | Secondary CTA        |
|------------|--------------------------|----------------------|
| SaaS       | "Start free trial"       | "Book a demo"        |
| Ecommerce  | "Shop now" / "Add to bag"| "View collection"    |
| Fintech    | "Open account"           | "Compare plans"      |
| Healthcare | "Find a provider"        | "Learn how it works"  |
| Creative   | "View work" / "Hire us"  | "About our process"  |
| Devtools   | "Read the docs"          | "View on GitHub"     |
| Editorial  | "Subscribe" / "Read now" | "Browse topics"      |

Notice: devtools primary CTA is "Read the docs," not "Get started." Developers don't
want to get started. They want to know if your thing solves their problem. The docs
tell them that. The signup form doesn't.

### The "Above the Fold" Myth

The idea that everything important must be visible without scrolling comes from
newspaper design in the 1890s and web design circa 2005 when people genuinely didn't
know they could scroll. In 2026, your users scroll. They scroll a lot. They scroll
on their phones while walking. They scroll on their laptops during meetings. They
scroll in their sleep.

The data has been clear for over a decade: people scroll. What they don't do is read
walls of text crammed into the top 600 pixels because someone was terrified of putting
anything below the fold.

**What actually matters**: the hero should create enough interest to make scrolling
feel worth it. That's it. If your hero communicates "this is relevant to you" and
"there's more below," you've done your job. You don't need to cram the CTA, the value
prop, three features, a testimonial, and a pricing table into the viewport.

Put the primary CTA in the hero AND repeat it after the social proof section. That's
the real pattern: strategic repetition, not viewport anxiety.

---

## Anti-Patterns

These are the specific ways landing pages go wrong. Not generic "bad design" — these
are the patterns that mark output as AI-generated.

### The Universal SaaS Template

Hero with gradient headline -> three equal feature columns with abstract icons ->
testimonial carousel -> "Ready to get started?" CTA banner -> footer. Every AI model
produces this. Every template marketplace sells this. It's the `Hello World` of landing
page design — proof that something renders, not proof that someone thought about it.

The fix isn't to rearrange the sections. It's to ask: what does THIS product need?
A developer tool needs a code example in the hero, not a stock illustration. A fintech
product needs trust signals before testimonials. An ecommerce brand needs product
photography doing 80% of the persuasion work. Start from the product, not the template.

### Generic Stock Imagery

Abstract 3D shapes floating in purple void. Diverse team high-fiving in a glass
conference room. Woman laughing alone with salad. If your hero image could be on any
website, it shouldn't be on yours.

Better alternatives: actual product screenshots (even if imperfect), custom illustration
in a style that matches your brand, real photography of real people using your actual
product, or just... no image. A minimal text hero with confidence beats a stock photo
hero with insecurity.

### "Transform Your Workflow" Copy

If your headline contains any of these words, your copy is AI slop:
- Transform, revolutionize, supercharge, unlock, unleash
- Seamless, cutting-edge, next-generation, game-changing
- "The future of [noun]"
- "Built for teams who [generic verb]"

Good landing page copy is specific enough to be wrong about something. "Deploy to 140
edge locations in 3 seconds" is a real claim. "Supercharge your deployment workflow" is
a warm bath of nothing.

### Missing Responsive Considerations

AI generates desktop layouts and calls it done. A landing page that doesn't work on
mobile in 2026 is not a landing page — it's a desktop-only art project. Minimum
responsive requirements:

- Hero splits stack to single column below 768px
- Logo bars wrap gracefully (flex-wrap, not overflow-x)
- Feature grids collapse to 1-2 columns, not remain at 3
- Text stays readable (no text that's `4rem` on mobile)
- Touch targets are minimum 44x44px
- CTA buttons are full-width on mobile

### No Dark Mode Variant

Roughly 80% of developers and ~40% of general users prefer dark mode. Shipping a
landing page without a dark variant in 2026 is like shipping without mobile support
in 2016 — technically possible, practically negligent. Define both `.light` and `.dark`
token sets. Use `prefers-color-scheme` for auto-detection with a manual toggle override.

### Identical Padding on Every Section

`padding: 5rem 0` on every `<section>`. The visual equivalent of reading in monotone.
Sections need breathing room that varies with content density:

- Hero: generous (space-2xl to space-3xl vertical)
- Dense feature section: moderate (space-xl)
- Social proof: tighter (space-lg) — logos don't need a football field of whitespace
- CTA: moderate with clear visual separation
- Footer: compact (space-md to space-lg)

Use the fluid space scale. Let the sections breathe differently. A page with varied
rhythm feels composed. A page with uniform padding feels generated.

```css
/* Domain-aware section spacing */
.section--hero      { padding-block: var(--space-2xl) var(--space-xl); }
.section--features  { padding-block: var(--space-xl); }
.section--social    { padding-block: var(--space-lg); }
.section--cta       { padding-block: var(--space-xl) var(--space-2xl); }
.section--footer    { padding-block: var(--space-md); }

/* Fintech: tighter overall — don't waste a banker's time */
[data-domain="fintech"] .section--hero { padding-block: var(--space-xl) var(--space-lg); }
/* Creative: more generous — let the work breathe */
[data-domain="creative"] .section--hero { padding-block: var(--space-3xl) var(--space-2xl); }
```

---

That's the reference. A landing page is not a template — it's a persuasion
architecture that changes shape based on what you're selling and who you're selling
it to. Load the domain profile, pick the right hero pattern, earn your social proof,
write a CTA that actually says something, and run the anti-slop checklist before
you ship. هانت.
