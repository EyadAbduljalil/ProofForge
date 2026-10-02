# Prompt 54 — Professional Ecommerce Homepage Inspired by the Reference Layout

## OBJECTIVE

Redesign the ecommerce homepage using the **same overall commercial philosophy, information architecture, content density, and shopping flow demonstrated by the provided reference screenshots**, while creating a completely original visual implementation for this project.

The reference demonstrates a classic, highly functional ecommerce homepage structure:

* Store header
* Search-first navigation
* Category navigation
* Large primary hero
* Secondary promotional area
* Small promotional/deal cards
* Product carousel
* Large promotional banners
* Category/product sections
* Additional product discovery
* Trust/service information
* Footer

The goal is to reproduce this **design thinking and shopping experience**, NOT to copy the reference website pixel-for-pixel.

The final homepage should feel:

* Professional
* Elegant
* Clean
* Commercial
* Product-focused
* Easy to navigate
* High-converting
* Modern
* Original
* Human-designed
* Visually balanced

Do NOT turn the page into a generic AI-generated ecommerce landing page.

---

# 1. MANDATORY ANTIGRAVITY EXECUTION PROTOCOL

Before making any changes:

1. Create:

`Antigravity_Prompts/54_Professional_Ecommerce_Homepage_Reference_Style.md`

2. Write this complete prompt into that file.

3. Read the Markdown file completely.

4. Execute ONLY from the Markdown file.

5. Inspect the existing repository before modifying anything.

6. Inspect the current homepage implementation and all related components.

7. Inspect existing:

* Header
* Navigation
* Category navigation
* Hero
* Product cards
* Product carousels
* Promotional components
* Brand sections
* Trust sections
* Footer
* Storefront content system
* Admin storefront management
* Product APIs
* Category APIs
* Brand APIs
* Image assets
* Prisma schema
* Existing responsive implementation
* RTL/LTR implementation

8. Reuse existing functionality where it is correct.

9. Do not create fake data.

10. Do not create fake API responses.

11. Do not replace real backend data with static frontend data.

12. After implementation, run complete validation.

13. Fix all discovered issues.

14. Rerun validation.

15. Create:

`Antigravity_Prompts/54_Professional_Ecommerce_Homepage_Reference_Style_Report.md`

16. Stop after Prompt 54.

Do NOT automatically start another prompt.

---

# 2. IMPORTANT DESIGN PRINCIPLE

The provided reference screenshots should be treated as **design inspiration for structure and ecommerce merchandising**, not as a design to clone.

Take inspiration from:

* Information hierarchy
* Product-first presentation
* Hero composition
* Promotional blocks
* Product carousel structure
* Category organization
* Section rhythm
* Search/navigation philosophy
* Shopping density
* Clear CTA placement

Do NOT copy:

* Exact layout dimensions
* Exact colors
* Exact typography
* Exact icons
* Exact logos
* Exact text
* Exact product images
* Exact card styling
* Exact spacing
* Exact header design
* Exact visual identity

The resulting website must belong to the project's own brand.

---

# 3. TARGET HOMEPAGE ARCHITECTURE

Rebuild the homepage around this structure:

## HEADER

↓

## MAIN NAVIGATION / CATEGORY NAVIGATION

↓

## HERO AREA

Large primary promotional hero + optional secondary promotional panel

↓

## QUICK DEAL / PROMOTION STRIP

Small visual promotional cards

↓

## FEATURED / HOT DEALS PRODUCT CAROUSEL

↓

## LARGE PROMOTIONAL BANNERS

Two or more carefully designed editorial/promotional banners where real content exists

↓

## CATEGORY PRODUCT SECTION

Example:

Electronics

Products carousel

↓

## SECOND CATEGORY PRODUCT SECTION

Example:

Smartphones & Laptops

Products carousel

↓

## NEW ARRIVALS / BEST SELLERS / RECOMMENDED

Choose only the sections that have meaningful real data.

↓

## BRANDS

↓

## TRUST / SERVICE BENEFITS

↓

## FOOTER

The exact number of sections should be determined by actual available data.

Do not create empty sections simply to match the reference.

---

# 4. HEADER

The header should be a professional ecommerce header.

Primary elements:

### Brand

Display the store logo/identity prominently.

### Search

Search should be one of the most important elements in the header.

It should support:

* Product search
* Category search
* Brand search where supported
* Search suggestions
* Keyboard interaction
* Mobile search
* Clear search state
* Proper Arabic/English behavior

Search should visually feel like a central shopping tool.

Do not make it unnecessarily huge.

---

# 5. PRIMARY NAVIGATION

Create a clean navigation layer containing:

* Home
* Products
* Categories
* Important store destinations
* Account
* Wishlist
* Cart
* Language
* Admin access where appropriate

The navigation must not become visually crowded.

Use professional icons.

NO emojis.

Use the existing icon library where available.

---

# 6. CATEGORY NAVIGATION

The reference uses a clear category discovery mechanism.

Implement a strong category navigation system.

Desktop:

* horizontal category navigation
* clear active state
* category names
* optional category icons/images where useful

Mobile:

* horizontal scrolling
* compact but readable
* touch-friendly
* no page overflow

The category navigation must be generated from real backend categories.

Do not hardcode category names.

---

# 7. HERO AREA

The Hero should be inspired by the reference's strong commercial composition.

Instead of the current oversized dark promotional panel, create a more refined ecommerce Hero.

Recommended structure:

### Main Hero

Large visual promotional area occupying the majority of the available width.

Content:

* small category/eyebrow
* strong headline
* short supporting text
* CTA
* real promotional/product image

Example:

`Discover the latest technology`

`Shop the collection`

The actual content must use configured storefront data when available.

Do not invent fake discounts.

---

# 8. HERO + SECONDARY PROMOTION

Where enough valid content exists, use:

### Main Hero

Approximately 65–75% width.

### Secondary Promotion

Approximately 25–35% width.

The secondary block may contain:

* New arrival
* Featured category
* Limited promotion
* Best-selling product
* Campaign

Only display it if real content exists.

If no valid secondary content exists, allow the Hero to occupy the full width.

Do not create an empty placeholder.

---

# 9. HERO IMAGE

The Hero must use actual project assets.

Inspect:

* `img/`
* `frontend/img/`
* `frontend/public/img/`
* `public/img/`
* all relevant asset directories

Build an image inventory.

Use real images that can be confidently mapped to:

* products
* categories
* brands
* campaigns

Do not randomly assign images.

Do not generate AI images.

Do not use unrelated stock imagery when project assets are available.

---

# 10. HERO CAROUSEL

If the current storefront content system supports multiple hero slides, preserve and improve it.

Requirements:

* multiple slides
* autoplay
* pause behavior
* next/previous
* keyboard navigation
* touch/swipe
* responsive behavior
* Arabic/English content
* CTA
* configured target links
* accessible controls

The carousel must feel refined rather than flashy.

Use a subtle transition.

Do not use excessive animation.

---

# 11. QUICK PROMOTIONAL STRIP

Inspired by the small promotional cards visible beneath the Hero in the reference.

Create a compact promotional strip.

Possible content:

* Flash Deals
* New Arrivals
* Electronics
* Smartphones
* Home Devices

Each item may include:

* small real product/category image
* short title
* short supporting text
* discount only when real
* CTA

Keep this section compact.

Do not turn each item into a large rounded card.

The purpose is quick discovery.

---

# 12. HOT DEALS / FEATURED PRODUCTS

Create a strong horizontal product carousel.

Section header:

* Section title
* Optional short description
* View all link
* Navigation controls

Example:

`Hot Deals`

or

`Featured Products`

Use the actual store configuration and available data.

Product cards must use real backend products.

---

# 13. PRODUCT CAROUSEL

The carousel should support:

Desktop:

* 4–5 products depending on viewport

Tablet:

* 3–4 products

Mobile:

* 1.5–2.2 products where appropriate

Avoid squeezing cards too tightly.

The carousel should support:

* previous
* next
* touch swipe
* keyboard navigation
* responsive item sizing

Do not use enormous product cards.

---

# 14. PRODUCT CARD

Product cards should be clean and commercially useful.

Display:

1. Product image
2. Brand where available
3. Product name
4. Rating when real
5. Current price
6. Previous price when real
7. Discount when real
8. Stock state where appropriate
9. Wishlist
10. Add to cart

Primary visual focus:

**PRODUCT IMAGE**

The card should not look like a dashboard widget.

Avoid:

* excessive badges
* huge buttons
* unnecessary borders
* gradients
* excessive shadows
* excessive rounded corners
* multiple competing CTAs

---

# 15. PRODUCT IMAGE TREATMENT

Product images should have enough breathing room.

Prefer:

* clean neutral image background
* consistent image ratio
* predictable card height
* centered product presentation
* high-quality rendering

Where multiple images exist, subtle hover behavior can reveal a secondary image.

Do not distort images.

Do not crop important product details.

---

# 16. PROMOTIONAL BANNER SECTION

The reference demonstrates a strong pattern of two large promotional banners placed side by side.

Implement this concept in an original way.

Desktop:

Two balanced promotional areas.

Each can contain:

* real category/product image
* short headline
* supporting text
* CTA

Example conceptual themes:

`Upgrade Your Workspace`

`Smart Technology for Every Room`

Do not copy the reference text.

Do not invent fake prices or discounts.

If no valid promotional content exists, use real category discovery instead.

---

# 17. EDITORIAL VISUAL STYLE

Promotional banners should feel like real ecommerce campaigns.

Avoid generic:

* colored rectangles
* text floating over gradients
* AI-generated decorative blobs
* excessive icons

Prefer:

* strong imagery
* controlled typography
* asymmetric compositions
* clean whitespace
* clear CTA
* restrained color usage

The image should do most of the visual work.

---

# 18. CATEGORY PRODUCT SECTIONS

After the promotional banners, create category-focused product sections.

Example:

## Electronics

[Product] [Product] [Product] [Product] [Product]

Navigation:

`View all electronics`

Then another meaningful category:

## Smartphones & Laptops

[Product] [Product] [Product] [Product] [Product]

Only create sections for categories that have enough real products.

---

# 19. CATEGORY SECTION DESIGN

Each category section should have:

* category title
* short optional description
* View All link
* product carousel
* navigation arrows

Avoid placing every category inside a giant bordered container.

Use whitespace and typography to separate sections.

---

# 20. CATEGORY-BASED MERCHANDISING

Category sections should be data-driven.

Preferred source hierarchy:

1. Admin-configured storefront section
2. Backend category configuration
3. Real product/category data

Do not hardcode:

```text
Electronics
Phones
Laptops
Cameras
```

unless those are actual persisted categories.

---

# 21. BEST SELLERS

If actual sales/order data supports identifying best sellers:

Create a Best Sellers section.

Use real order-derived product information.

Do not fake popularity.

Do not display:

`#1 Best Seller`

unless the backend can support that claim.

---

# 22. NEW ARRIVALS

If product creation/publish dates are available:

Create a New Arrivals section.

Use real product dates.

Do not manually classify products as new.

---

# 23. OFFERS / FLASH DEALS

If actual active discounts exist:

Create an Offers section.

Display:

* actual previous price
* actual current price
* actual discount
* actual availability

Do not invent:

* 70% off
* limited stock
* ending soon
* only 2 left

unless those values are genuinely supported by backend data.

---

# 24. BRANDS

If the store has real brands:

Create a clean brand discovery section.

Do not make it look like a row of generic buttons.

Possible design:

* logo/image
* brand name
* subtle hover
* link to brand products

Maintain consistent logo dimensions.

If logos do not exist:

Use clean typography rather than fake logos.

---

# 25. RECOMMENDATIONS

If the current backend supports personalized or contextual recommendations:

Display them.

Otherwise use a deterministic merchandising mechanism such as:

* related products
* popular products
* category-based recommendations

Do not fake personalization.

Do not label a generic list:

`Recommended For You`

unless the recommendation logic actually supports it.

---

# 26. TRUST SECTION

Keep the trust section but make it compact.

Use 4 maximum primary benefits.

Examples:

* Fast & Secure Delivery
* Secure Payment
* Easy Returns
* Authentic Products / Warranty

Each should contain:

* professional line icon
* short title
* one-line explanation

No emojis.

No giant cards.

No decorative gradients.

---

# 27. FOOTER

Create a professional ecommerce footer.

Sections:

### Store

* About
* Contact
* Store information

### Shopping

* Products
* Categories
* Offers
* Brands

### Customer Service

* Orders
* Tracking
* Returns
* Support

### Newsletter

Only if the newsletter actually works.

### Payment

Display only payment methods actually supported.

### Legal

* Privacy
* Terms
* Refund/return policy

Every link must work.

---

# 28. VISUAL STYLE

The reference has a clean retail style.

Build a more polished version using:

* white/light neutral background
* dark typography
* one strong brand accent
* restrained secondary colors
* clean product imagery
* subtle borders
* minimal shadows
* professional typography

Avoid overusing:

* dark giant Hero blocks
* gradients
* glassmorphism
* floating cards
* excessive rounded containers
* excessive pills

---

# 29. ORIGINALITY

The final design must be inspired by the reference's **structure**, not its visual identity.

Perform an originality audit.

Do not produce:

* a clone of the reference
* a Noon clone
* an Amazon clone
* a Shopify template
* a generic Tailwind ecommerce template

The store should look like its own brand.

---

# 30. SPACING SYSTEM

Use a consistent spacing system.

Sections should have enough separation to create rhythm.

Do not create enormous blank spaces like the current homepage screenshots.

Do not compress everything together either.

The desired feeling:

**Dense enough to shop, spacious enough to feel premium.**

---

# 31. SECTION RHYTHM

Use alternating visual compositions.

Example:

Hero

↓

Products

↓

Promotion

↓

Products

↓

Category

↓

Products

↓

Brands

↓

Trust

This creates a natural ecommerce rhythm.

Avoid:

Product grid

Product grid

Product grid

Product grid

Product grid

---

# 32. MOBILE HOMEPAGE

Mobile must be designed intentionally.

Target:

* 320px
* 360px
* 375px
* 390px
* 414px

On mobile:

* compact header
* dedicated search
* horizontally scrollable categories
* full-width Hero
* compact promotional cards
* horizontal product carousels
* optimized banners
* no desktop-style two-column layouts where they become cramped

Do not simply stack every desktop section vertically.

---

# 33. DESKTOP HOMEPAGE

At:

* 1024px
* 1280px
* 1440px

Use the available space intelligently.

Maximum content width should be controlled.

Avoid:

* content touching screen edges
* enormous empty margins
* extremely wide unreadable text
* oversized cards

---

# 34. RTL / LTR

Arabic RTL must be first-class.

Verify:

* Header
* Search
* Category navigation
* Hero
* Carousel arrows
* Product cards
* Price alignment
* Promotional banners
* Footer
* Horizontal scrolling
* Directional icons

English must correctly switch to LTR.

Do not hardcode directional positioning.

Use logical CSS properties where appropriate.

---

# 35. ICONOGRAPHY

Remove all emoji-based UI.

Use a consistent professional icon system.

Icons must:

* have consistent stroke/weight
* have consistent sizing
* align with text
* communicate function

Do not use icons merely as decoration.

---

# 36. ADMIN INTEGRATION

The homepage must work with the existing Admin Storefront Management system.

Admin should be able to control, where supported:

### Hero

* slides
* ordering
* visibility
* title
* subtitle
* image
* CTA
* target

### Product Sections

* section title
* visibility
* ordering
* category
* products
* product order

### Promotional Sections

* image
* title
* description
* CTA
* target
* visibility
* ordering

### Brands

* visibility
* order

The storefront must reflect persisted admin changes.

Do not create frontend-only settings.

---

# 37. ADMIN → STOREFRONT DATA FLOW

Verify:

Admin changes

↓

API

↓

Database

↓

Storefront API

↓

Homepage

No hardcoded duplicate state should override persisted data.

Test:

* adding section
* removing section
* reordering section
* changing products
* changing hero
* changing visibility

where these operations are supported.

---

# 38. BACKEND REQUIREMENTS

Only modify backend if necessary.

If required functionality is missing:

* implement proper API
* validate inputs
* enforce authorization
* persist data
* add audit logging where appropriate
* maintain server authority
* preserve existing security architecture

Do not build fake endpoints simply to satisfy UI.

---

# 39. DATABASE REQUIREMENTS

Inspect Prisma schema before making changes.

If existing storefront models can support the required design:

**reuse them.**

Only create new models/migrations when genuinely required.

Possible concepts if missing:

* StorefrontSection
* StorefrontSectionProduct
* HeroSlide
* PromotionalBanner
* CategorySection
* BrandSection

But do NOT blindly create these models.

Adapt to the existing architecture.

---

# 40. PERFORMANCE

The homepage can contain many images.

Optimize carefully.

Use:

* responsive images
* lazy loading
* eager loading for the primary Hero where appropriate
* proper image dimensions
* controlled carousel rendering
* minimal duplicate requests

Do not load every image at maximum resolution.

Avoid layout shifts.

---

# 41. SEO

Verify:

* meaningful page title
* meta description
* semantic headings
* proper image alt text
* crawlable product/category links
* canonical behavior where applicable
* clean URL structure

Do not create duplicate heading hierarchies.

---

# 42. ACCESSIBILITY

Verify:

* keyboard navigation
* visible focus
* carousel keyboard controls
* accessible labels
* semantic buttons
* semantic links
* readable contrast
* alt text
* touch target sizes

Do not sacrifice accessibility for visual design.

---

# 43. LOADING STATES

Dynamic sections need professional loading states.

Use:

* subtle skeletons
* correct layout dimensions
* no page jumping

Do not display giant loading spinners unnecessarily.

---

# 44. ERROR STATES

A failed product section should not break the entire homepage.

Handle:

* API failure
* missing images
* empty categories
* unavailable products
* expired promotions

Use graceful fallbacks.

---

# 45. EMPTY STATES

If a section has no real data:

Do not display:

* empty card containers
* broken layouts
* fake products

Instead:

* hide the section
* or use a meaningful fallback based on actual available data

---

# 46. PRODUCT DATA INTEGRITY

Every product shown on the homepage must be verified against backend state.

Ensure:

* active product
* valid price
* valid inventory state
* valid category
* correct image
* correct discount
* correct availability

Do not expose archived/inactive products.

---

# 47. CART INTEGRATION

Every Add to Cart action must use the existing backend-authoritative cart flow.

Verify:

* product ID
* quantity
* stock availability
* authentication behavior
* guest cart behavior if supported
* error handling
* success feedback

Do not implement a fake local-only cart.

---

# 48. WISHLIST INTEGRATION

Wishlist buttons must use the existing real wishlist functionality.

Verify:

* add
* remove
* authentication
* loading
* success/error state
* persisted state after refresh

---

# 49. SEARCH INTEGRATION

The homepage search must connect to the actual product search system.

Verify:

* product search
* category search
* brand search where supported
* Arabic
* English
* no-results state
* navigation to results

---

# 50. BROWSER QA

Run the actual application.

Inspect visually in browser at:

### Desktop

1280 × 720

1440 × 900

### Mobile

390 × 844

414 × 896

Test:

* scrolling
* Hero
* carousels
* search
* buttons
* product links
* categories
* banners
* footer
* RTL
* LTR

Inspect browser console.

There must be no:

* React errors
* unhandled promise errors
* broken image errors
* failed critical API requests
* navigation errors
* hydration/runtime errors

---

# 51. CROSS-SYSTEM TESTING

Verify complete shopping flows:

### Homepage → Product

Homepage product

→ Product details

### Homepage → Category

Category

→ Product listing

### Homepage → Cart

Product

→ Add to cart

→ Cart

### Homepage → Wishlist

Product

→ Wishlist

### Homepage → Search

Search

→ Results

### Admin → Homepage

Admin changes Hero

→ Homepage updates

Admin changes section

→ Homepage updates

Admin changes products

→ Homepage updates

---

# 52. VALIDATION

Run all relevant project checks.

### Frontend

* lint
* typecheck
* production build

### Backend

* lint
* typecheck
* tests
* production build

### Database

* Prisma validate
* migration validation if schema changed

### Security

* dependency audit
* secret scan

### Runtime

* browser QA
* API/network inspection
* console inspection

Fix all errors.

Run validation again.

---

# 53. FINAL DESIGN QUALITY CHECK

Before declaring completion, compare the implementation conceptually against the provided reference screenshots.

The new homepage should have:

* clear commercial hierarchy
* strong Hero
* visible product discovery
* compact promotional content
* product carousels
* large promotional banners
* category-focused shopping
* real product imagery
* clear CTAs
* strong search
* clean header
* compact trust section
* professional footer

But it must also be:

* more modern
* more elegant
* cleaner
* more refined
* more original
* less visually noisy
* less template-like
* more consistent with this project's brand

---

# 54. DO NOT OVERDESIGN

This is extremely important.

Do NOT respond to the redesign by adding:

* more gradients
* more animations
* more cards
* more decorative backgrounds
* more floating elements
* more badges
* more pills
* more glass effects
* more colors
* more sections

The objective is:

**Professional ecommerce design through hierarchy and merchandising — not visual complexity.**

---

# 55. FINAL REPORT

Create:

`Antigravity_Prompts/54_Professional_Ecommerce_Homepage_Reference_Style_Report.md`

The report must include:

## Executive Summary

## Reference Design Analysis

## Current Homepage Problems

## New Homepage Architecture

## Header

## Navigation

## Hero

## Secondary Promotion

## Promotional Strip

## Product Carousels

## Product Cards

## Promotional Banners

## Category Sections

## Brands

## Trust Section

## Footer

## Image Asset Audit

## Admin Integration

## Backend Changes

## Database Changes

## Responsive Design

## RTL/LTR

## Accessibility

## SEO

## Performance

## Browser QA

## Cross-System Testing

## Frontend Validation

## Backend Validation

## Prisma Validation

## Dependency Audit

## Secret Scan

## Remaining Configuration Requirements

## Final Status

Use exactly one:

`PROFESSIONAL ECOMMERCE HOMEPAGE COMPLETED`

or

`PROFESSIONAL ECOMMERCE HOMEPAGE COMPLETED WITH LIMITATIONS`

or

`PROFESSIONAL ECOMMERCE HOMEPAGE FAILED — REMEDIATION REQUIRED`

Do not claim completion if critical functionality remains broken.

---

# 56. STOP CONDITION

After Prompt 54:

1. Create the execution report.
2. Validate the repository.
3. Fix validation issues.
4. Rerun validation.
5. Record final status.
6. STOP.

Do NOT execute Prompt 55 or any future prompt automatically.
