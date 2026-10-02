#!/usr/bin/env python3
"""Generate evals/evals.json for the anti-slop-design skill."""
import json
import os

evals = {
    "skill_name": "anti-slop-design",
    "evals": [
        {
            "id": 1,
            "prompt": "Build me a dashboard for our payment analytics platform. It needs to show transaction volume over time, success/failure rates, a revenue summary card, and a recent transactions table. We're a B2B fintech startup \u2014 think Stripe Dashboard vibes but with our own identity.",
            "expected_output": "React dashboard with: fintech token overlay applied (navy/institutional palette, Plus Jakarta Sans headings), Recharts or Nivo for charts with custom fintech color palette, NOT default chart colors, tabular monospace font for currency figures, 8px border-radius cards, subtle shadows, data table with proper alignment. NO purple gradients, NO Inter as heading font, NO stock imagery.",
            "domain": "fintech",
            "platform": "web-react",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 2,
            "prompt": "Create a landing page for a meditation and therapy app called 'Stillwater'. It should have a hero section with a calming feel, feature highlights for guided meditation/therapy matching/progress tracking, testimonials from users, and a download CTA. Target audience is adults dealing with anxiety.",
            "expected_output": "Single-page HTML with: healthcare token overlay (calming teal/blue-green palette, Outfit headings, DM Sans body), spacious layout with generous whitespace, 44px minimum tap targets, \u226518px body text, rounded corners (12-16px), gentle breathing animations only, soft illustrations not stock photos. NO red accents, NO dense layouts, NO fast/jarring animations.",
            "domain": "healthcare",
            "platform": "web-landing",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 3,
            "prompt": "I need a React component for a CLI tool's web documentation site. It should be a command reference page showing available commands, their flags, and examples \u2014 similar to how Vercel or Raycast document their CLI tools. Dark mode by default.",
            "expected_output": "React component with: devtools token overlay (dark-first, #0A0A0F background, Geist Sans + Geist Mono, vivid accent glows), bento-style command cards, monospace code blocks with syntax highlighting, 1px borders not shadows, dot-grid background texture, command palette aesthetic. NO light theme default, NO serif fonts, NO rounded corners >12px.",
            "domain": "devtools",
            "platform": "web-react",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 4,
            "prompt": "Design a product detail page for a high-end watch e-commerce site. One hero image, a product title, price, description, variants selector, and add-to-cart button. Think luxury \u2014 Apple Store meets Mr. Porter.",
            "expected_output": "HTML page with: ecommerce token overlay (warm cream palette, Cormorant Garamond serif headings with uppercase + tracking, Lato body), 0px border-radius, NO shadows, full-bleed hero image, generous whitespace, slow cinematic hover zoom on product image, editorial typography with perfect-fourth scale. NO bright primary colors, NO rounded buttons, NO stock photography placeholders.",
            "domain": "ecommerce",
            "platform": "web-landing",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 5,
            "prompt": "Build a quiz/lesson completion screen as a Claude artifact for a language learning app. Show the user's score (8/10), XP earned, streak count, and a 'Continue' button. Make it feel rewarding and fun.",
            "expected_output": "React JSX artifact with: education tokens inlined (vibrant green #58CC02, Nunito 800 weight, 16px+ radius), spring animation on the score reveal, confetti or particle effect for celebration, XP counter that ticks up, streak flame icon, bouncy Continue button, bright gold for reward elements. NO corporate styling, NO muted colors, NO static reveal.",
            "domain": "education",
            "platform": "web-artifacts",
            "difficulty": "basic",
            "files": []
        },
        {
            "id": 6,
            "prompt": "Create a long-form article layout for an online magazine. It should have a hero image, article title, author byline with avatar, publication date, body text with pull quotes, inline images, and a related articles section at the bottom. Think of The Verge or Aeon editorial style.",
            "expected_output": "HTML page with: media token overlay (warm paper off-white, Playfair Display headings, Source Serif 4 body, editorial red accent), 65ch max body width, multi-column grid with pull quotes breaking the column, serif body text at 1.65 line height, hairline rule dividers, full-bleed hero, minimal animation. NO sans-serif body text, NO line widths >75ch, NO sidebar ads pattern.",
            "domain": "media",
            "platform": "web-landing",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 7,
            "prompt": "Build a government benefits eligibility checker form. Users enter their household size, income, state, and age to see which programs they qualify for. Must be fully accessible \u2014 my organization follows Section 508.",
            "expected_output": "HTML or React form with: government tokens (pure white bg, institutional blue #1D70B8, Noto Sans, 0px radius), single-column layout \u2264750px wide, \u226519px body text, 44px+ tap targets, NO decorative animation whatsoever, skip-nav link, all form fields with visible labels (not placeholders), error messages associated via aria-describedby, progressive enhancement (works without JS). NO rounded corners, NO custom fonts that might fail, NO hamburger menu.",
            "domain": "government",
            "platform": "web-react",
            "difficulty": "advanced",
            "files": []
        },
        {
            "id": 8,
            "prompt": "Design a portfolio website hero section for a motion designer. It should be dramatic, showcase their work, and make visitors say 'wow'. Full creative freedom.",
            "expected_output": "HTML page with: creative tokens (bold vermillion/coral + electric purple accents, Clash Display headings, Satoshi body, 0px radius + dramatic shadows), asymmetric layout, kinetic typography on the hero, scroll-driven parallax, custom cursor effect, grain overlay texture, staggered page-load animation, full-bleed composition. NO safe corporate styling, NO symmetric centered layout, NO static page. MUST respect prefers-reduced-motion with fade alternatives.",
            "domain": "creative",
            "platform": "web-landing",
            "difficulty": "advanced",
            "files": []
        },
        {
            "id": 9,
            "prompt": "Create a SwiftUI view for a patient medication tracker. Show today's medications in a list, each with name, dosage, time, and a taken/not-taken toggle. The design should feel calming and approachable.",
            "expected_output": "SwiftUI code with: healthcare-inspired custom design tokens (calming teal accent, Outfit-style rounded sans heading, 12-16px corner radius, spacious padding), 44pt minimum tap targets, VoiceOver-compatible toggle buttons with accessibility labels, gentle spring animation on toggle, high contrast text. NO red as primary color, NO dense list rows, NO small text.",
            "domain": "healthcare",
            "platform": "mobile-native",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 10,
            "prompt": "Build a Bubbletea TUI app in Go for a git branch manager. Show a list of local branches with indicators for current branch and recent activity. Support keyboard navigation to switch, delete, or create branches.",
            "expected_output": "Go code using Bubbletea + Lip Gloss + Bubbles with: green \u2713 for current branch, color-coded recency indicators, Unicode box-drawing borders (rounded \u256D\u256E\u2570\u256F), braille spinner for operations, two-column layout (branches + details), keyboard shortcut hints at bottom, proper terminal color support with ANSI 256. NO plain unformatted text, NO missing keyboard hints.",
            "domain": "devtools",
            "platform": "cli",
            "difficulty": "advanced",
            "files": []
        },
        {
            "id": 11,
            "prompt": "Generate a professional quarterly business report as a PDF using Typst. Include a cover page, executive summary, 3 sections with charts placeholders, and a conclusion. For a management consulting firm.",
            "expected_output": "Typst document with: professional token overlay adapted to Typst (serif headings, clean sans body, navy accent), proper page margins, header/footer with page numbers, table of contents, consistent heading hierarchy, figure captions, clean table styling. NO LaTeX syntax, NO default Typst styling without customization.",
            "domain": "fintech",
            "platform": "pdf",
            "difficulty": "intermediate",
            "files": []
        },
        {
            "id": 12,
            "prompt": "Create a transactional email template for order confirmation. Show order number, items purchased with images, total, shipping address, and tracking link. Must look good in both Gmail and Outlook.",
            "expected_output": "React Email or MJML template with: ecommerce-appropriate styling (warm neutrals, serif heading if email-safe, clean product cards), table-based layout for Outlook compatibility, dark mode meta tags, off-white backgrounds (not pure #FFFFFF), inline styles, MSO conditional comments for Outlook fallbacks, \u226514px body text, high-contrast links. NO CSS flexbox/grid in email, NO web fonts without fallbacks, NO pure black on pure white.",
            "domain": "ecommerce",
            "platform": "email",
            "difficulty": "advanced",
            "files": []
        }
    ]
}

os.makedirs("evals", exist_ok=True)
with open("evals/evals.json", "w", encoding="utf-8") as f:
    json.dump(evals, f, indent=2, ensure_ascii=False)

print(f"Written {len(evals['evals'])} evals to evals/evals.json")

# Validate
domains = set(e["domain"] for e in evals["evals"])
platforms = set(e["platform"] for e in evals["evals"])
print(f"Domains covered: {sorted(domains)} ({len(domains)}/8)")
print(f"Platforms covered: {sorted(platforms)} ({len(platforms)}/7)")
