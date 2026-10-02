# Email Design Reference

The forgotten frontend. Everyone's arguing about React meta-frameworks while
email — the channel that actually makes money — renders in Microsoft Word.
Literally. If you think responsive email is "just HTML," يسطا, buckle up.

---

## The Email Landscape

Email clients are not browsers. They are hostile environments with arbitrary
CSS support, aggressive sanitization, and rendering engines from 2007.

**Apple Mail (48-53% share):** The good news. Supports nearly everything —
Grid, flexbox, web fonts, `@media` queries, `calc()`, custom properties.
If every client was Apple Mail, we'd be done here. But they're not.

**Gmail (web + apps):** Strips `<style>` tags in many contexts. Media
queries? Gone. Hover states? Gone. Requires inline styles on every element.
The mobile app sometimes respects `<style>` in `<head>`, sometimes doesn't
— depends on the version and apparently the phase of the moon. Safe bet:
inline everything, treat `<style>` tags as progressive enhancement.

**Classic Outlook (The Word Engine):** احا. Classic Outlook (2016, 2019,
2021, M365 desktop) uses Word's HTML renderer. No flexbox, no Grid, no
`border-radius`, no `background-image` on divs, no `max-width`, no `padding`
on `<p>`/`<div>`, no CSS positioning. The only reliable layout: **nested
HTML tables**. Like it's 2003. End of support: **October 2026**. Until then,
you code for it. No exceptions.

**New Outlook (Chromium):** Modern CSS works. But MSO conditional comments
(`<!--[if mso]>`) are ignored — it doesn't identify as "mso." You need
table-based layout for Classic AND modern CSS for New Outlook simultaneously.
Tables are baseline; CSS is progressive enhancement. This dual-Outlook
reality persists through late 2026.

---

## Framework Selection

Don't hand-code email HTML in 2026. The compatibility matrix is too brutal.

| Framework | Approach | Best For |
|---|---|---|
| **React Email v5.0** (920K+/wk) | React components → HTML | Developer teams, complex templates, design systems |
| **MJML** (350K+/wk) | Custom markup → responsive HTML | Max cross-client safety, non-React teams |
| **Maizzle** (25K+/wk) | Tailwind CSS → inline HTML | Tailwind-familiar teams, utility-first workflow |

**React Email** for new projects — v5.0 has dark mode switcher, spam score
checker, and the component model maps naturally to design systems. **MJML**
when cross-client compatibility is the absolute top priority — its generated
table HTML is gnarly but bulletproof. **Maizzle** if your team thinks in
Tailwind and doesn't want a new component model.

Decision: **React Email for new projects. MJML when max compatibility
matters more than DX.**

---

## Coding Patterns

### Table-Based Layout (Outlook Baseline)

Every email starts here. Not optional — it's your Outlook insurance policy.

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
           style="max-width: 600px; width: 100%;">
      <tr><td style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Content -->
      </td></tr>
    </table>
  </td></tr>
</table>
```

`role="presentation"` for screen readers. `width="600"` HTML attribute for
Outlook, `max-width: 600px` CSS for everything else. You need both.

### Dark Mode (Three Layers)

1. **Meta tag**: `<meta name="color-scheme" content="light dark">` — without
   this, Apple Mail won't activate dark mode handling.
2. **CSS media query** in `<style>`: `@media (prefers-color-scheme: dark)`
   with `!important` overrides — for clients that keep style tags.
3. **MSO conditional**: `<!--[if mso]><style>...</style><![endif]-->` for
   Classic Outlook, which ignores dark mode entirely.

Without all three, something breaks somewhere. Gmail auto-inverts colors
unpredictably. Outlook does whatever Word feels like (usually nothing).

### Typography

**System font stacks by default.** Web fonts in email are progressive
enhancement, not primary. Many clients block external resource loading.

```
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

Use `@import` in `<style>` for clients that support web fonts (Apple Mail,
iOS Mail). Gmail and Outlook get the system stack. هانت.

### VML Rounded Buttons (Outlook)

Outlook ignores `border-radius`. For rounded CTAs, you need VML — two
completely different elements conditionally rendered:

```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://example.com"
  style="height:44px;v-text-anchor:middle;width:200px;" arcsize="10%"
  fillcolor="#2563eb" strokecolor="#2563eb">
  <center style="color:#fff;font-family:sans-serif;font-size:16px;">Click Here</center>
</v:roundrect><![endif]-->
<!--[if !mso]><!-->
<a href="https://example.com" style="background:#2563eb;border-radius:6px;color:#fff;
   display:inline-block;font-size:16px;line-height:44px;text-align:center;
   text-decoration:none;width:200px;">Click Here</a>
<!--<![endif]-->
```

### Image Handling

- Set `width` and `height` as HTML attributes (Outlook/Gmail need them)
- Always include `alt` text — images blocked by default in many clients
- `display: block` on images to kill phantom spacing
- Retina: export at 2x, set `width` to 1x size (1200px image, `width="600"`)
- Total weight under 800KB, ideally under 500KB

### React Email Component

```tsx
import { Html, Head, Body, Container, Section, Text, Button, Img } from '@react-email/components';

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head><meta name="color-scheme" content="light dark" /></Head>
      <Body style={{ backgroundColor: '#f4f4f5', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
          <Img src="https://example.com/logo.png" width={120} height={32}
               alt="Company Name" style={{ display: 'block', marginBottom: 24 }} />
          <Section style={{ backgroundColor: '#fff', borderRadius: 8, padding: 32 }}>
            <Text style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 20, fontWeight: 600, color: '#18181b', margin: '0 0 16px' }}>
              Welcome, {name}
            </Text>
            <Text style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 16, color: '#3f3f46', lineHeight: '24px', margin: '0 0 24px' }}>
              Your account is ready. Here is what happens next.
            </Text>
            <Button href="https://example.com/dashboard" style={{ backgroundColor: '#2563eb',
              borderRadius: 6, color: '#fff', fontSize: 16, fontWeight: 600,
              textDecoration: 'none', padding: '12px 24px' }}>
              Go to Dashboard
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Email Design Principles

**600px maximum width.** Fits most preview panes without horizontal scroll.
Some designers push 640 or 660. Don't. 600 is the safe standard.

**Single column for mobile.** Multi-column layouts collapse unpredictably.
Design single-column first; multi-column only as desktop enhancement.

**System fonts by default.** Web fonts are a gamble in email. Load one only
if the brand demands it, always with the full system fallback stack.

**Preheader text.** The snippet after the subject line in inbox views. Skip
it and the client grabs "View in browser" or nav links. Set explicitly:
`<span style="display:none;max-height:0;overflow:hidden;">Your text</span>`

**CTA button sizing.** 44px+ tap target height (Apple HIG). At least 160px
wide, full width on mobile. One primary CTA per email — two equal-weight
CTAs means zero effective CTAs.

**Unsubscribe link.** Required by CAN-SPAM, GDPR, CASL, and Gmail/Yahoo
2024 sender requirements. Use `List-Unsubscribe` headers AND a visible
footer link. Missing either tanks deliverability.

**Image-to-text ratio.** 80% images / 20% text = spam filter magnet. Aim
for 60%+ text. Lead with text, use images to support your message.

---

## Anti-Patterns

### 1. CSS-Only Layout Without Table Fallback

Beautiful flexbox/grid layout. Stunning in browser preview. Classic Outlook
renders it as a single column of chaos because Word doesn't speak flexbox.
Start with tables, enhance with CSS for modern clients.

### 2. Web Fonts Without System Fallback

`font-family: 'Custom Brand Font'` with nothing else. Gmail blocks the
load. Outlook blocks the load. Now you're rendering in Times New Roman —
the email equivalent of showing up to a meeting in pajamas.

### 3. Images Without Alt Text

Images blocked by default in Outlook, corporate clients, slow connections.
No alt text = wall of broken image icons. Every `<img>` gets descriptive
alt text. Every single one.

### 4. No Dark Mode Meta Tag

Without `<meta name="color-scheme" content="light dark">`, Apple Mail
skips dark mode adaptation. Your white backgrounds become blinding
rectangles in an otherwise dark UI. Gmail auto-inverts unpredictably.

### 5. Fixed-Width That Breaks on Mobile

`width: 600px` without `max-width: 600px; width: 100%`. On a 375px phone,
the email overflows horizontally. Users side-scroll to read. They won't —
they'll delete it.

### 6. Massive Image-Only Emails

Entire email is one big image. No live text. Spam filters flag these hard
because spammers love them — can't scan text that doesn't exist. Make the
email readable with images disabled.

### 7. Missing Preheader Text

No preheader means the inbox shows "View this email in your browser" or
"Company Logo | Home | Products | Contact" from your nav. Wasted real
estate. The preheader is your second subject line — set it explicitly.

### 8. Forgetting `role="presentation"` on Layout Tables

Screen readers announce layout tables as "table with 3 rows and 2 columns"
before the user hears your content. Every layout table needs the attribute.

---

*Last updated: 2026-03-01. Verify against Litmus or Email on Acid before
any production send.*
