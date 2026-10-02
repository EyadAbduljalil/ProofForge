# Extending the Domain Token System

How to add new domains to the anti-slop design token system.

## Step-by-Step Process

### 1. Copy the template from domain-map.json

Open `domain-map.json` and copy the object at `extensibility.template`. This contains
every required field with empty values. Save it as a new entry under `domains.<your-key>`.

### 2. Fill in all domain metadata

- `name`: Human-readable domain name (e.g. "Gaming / Esports")
- `aesthetic_label`: A short hyphenated label summarizing the visual style (e.g. "neon-immersive")
- `description`: 1-2 sentences explaining the design philosophy
- `color_mood`: Array of 3-5 mood keywords guiding color choices
- `exemplar_sites`: 3-5 real-world sites that embody this aesthetic
- `anti_patterns`: 5-10 specific design mistakes to avoid in this domain

### 3. Define the OKLCH color palettes

Fill `primary_palette_oklch` (light mode) and `dark_mode_palette_oklch` (dark mode).
Each palette requires exactly 12 keys: `bg_primary`, `bg_secondary`, `bg_elevated`,
`text_primary`, `text_secondary`, `text_heading`, `accent_primary`, `accent_secondary`,
`border`, `error`, `success`, `warning`.

All values must be valid `oklch(L C H)` strings. Use the OKLCH color picker at
oklch.com to find values. Keep lightness above 0.85 for light backgrounds and below
0.25 for dark backgrounds. Ensure WCAG AA contrast between text and background pairs.

### 4. Define typography, shape, animation, and shadow style

- `typography`: heading/body/mono families, weights, letter-spacing, line-heights
- `border_radius`: small/medium/large/pill values in px
- `shadow_style`: one of `none`, `subtle`, `elevated`, `dramatic`
- `animation.intensity`: one of `none`, `minimal`, `moderate`, `expressive`
- `animation.style`: one of `snappy`, `smooth`, `springy`, `cinematic`

### 5. Create the token file

Run the token generator or manually create `assets/tokens/domain-tokens/<domain>.json`
following the schema. The token file maps domain-map values to CSS custom properties:

- `colors.light` / `colors.dark` map palette keys to `--color-*` variables
- `typography` maps to `--font-*`, `--font-weight-*`, `--letter-spacing-*`, `--line-height-*`
- `shape` maps to `--radius-*`
- `motion` maps intensity to duration (none=0ms, minimal=150ms, moderate=200ms, expressive=300ms)
- `shadows` are generated from the shadow_style and accent hue

### 6. Add signal keywords

Add an entry to `signal_keywords.<domain>` in domain-map.json with 20-40 keywords
that indicate a project belongs to this domain. These are used for automatic domain
detection from project descriptions.

### 7. Validate the new domain

Run through the checklist below before merging.

---

## Common Extension Domains

Starter suggestions for domains not yet included:

### Gaming / Esports
- Aesthetic: neon-immersive. Dark backgrounds, vivid neon accents (cyan, magenta, lime).
- Typography: bold geometric sans-serifs (Rajdhani, Orbitron). Tight letter-spacing.
- Animation: expressive + springy. Heavy micro-interactions, particle effects.
- Shadow style: dramatic. Border radius: small (4-6px).

### Nonprofit / NGO
- Aesthetic: warm-human. Earth tones, warm greens and ambers, organic feel.
- Typography: friendly rounded sans (Nunito, Quicksand) with readable serif body.
- Animation: minimal + smooth. Subtle and respectful.
- Shadow style: subtle. Border radius: medium (8-12px).

### Social / Community
- Aesthetic: friendly-vibrant. Saturated primary colors, rounded shapes, playful.
- Typography: rounded sans-serif headings (Poppins, Varela Round), clean body text.
- Animation: moderate + springy. Reactions, toasts, and transitions feel alive.
- Shadow style: elevated. Border radius: large (16-20px) with pill buttons.

### Enterprise / B2B SaaS
- Aesthetic: structured-professional. Restrained blues and grays, data-dense layouts.
- Typography: neutral sans-serifs (Inter, Roboto). Medium weights, standard spacing.
- Animation: minimal + snappy. No decoration, fast feedback only.
- Shadow style: subtle. Border radius: small (4-6px).

### Automotive
- Aesthetic: sleek-performance. Dark metallics, angular shapes, high contrast.
- Typography: wide tracking condensed sans (Barlow Condensed, Industry). Uppercase headings.
- Animation: moderate + cinematic. Smooth reveals, parallax hero sections.
- Shadow style: none. Border radius: 0px (sharp edges).

### Travel / Hospitality
- Aesthetic: aspirational-warm. Golden hour warmth, ocean blues, earthy accents.
- Typography: elegant serif headings (Libre Baskerville), clean sans body (Lato).
- Animation: moderate + smooth. Gentle parallax, fade-in image reveals.
- Shadow style: subtle. Border radius: medium (8-12px).

---

## Validation Checklist

Before merging a new domain, verify all of the following:

- [ ] All 12 color keys present in both light and dark palettes
- [ ] OKLCH values are syntactically valid (3 space-separated numbers in parentheses)
- [ ] Text-on-background contrast ratios meet WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Token file contains all 6 sections: colors, typography, shape, motion, shadows, and metadata
- [ ] Typography fallback stacks end with a generic family (serif, sans-serif, or monospace)
- [ ] Motion duration matches the intensity mapping exactly
- [ ] Motion ease matches the style mapping exactly
- [ ] Shadow values use the correct alpha ranges for the chosen shadow_style
- [ ] Signal keywords array has at least 15 entries and does not overlap heavily with existing domains
- [ ] Anti-patterns list has at least 5 entries specific to this domain
- [ ] Exemplar sites are real, accessible URLs that genuinely represent the aesthetic
- [ ] The aesthetic_label is unique across all domains
- [ ] The token_file value matches the actual filename in domain-tokens/
