# Prompt 51 — Creative High-Converting Ecommerce Homepage Redesign

## Objective

Completely redesign and enhance the ecommerce Storefront Homepage into a **creative, premium, highly engaging, marketing-focused ecommerce experience**.

The homepage must immediately attract the customer, communicate the store's value, showcase products intelligently, and encourage browsing and purchasing.

This is NOT a generic ecommerce product grid.

This is NOT a simple landing page.

This is NOT a copy of Noon, Amazon, Shopify, Temu, AliExpress, Shein, Walmart, or any other ecommerce website.

Create an original visual and commercial experience.

The homepage should feel like a real professionally designed ecommerce storefront with a strong merchandising strategy.

---

# 1. Mandatory Execution Protocol

Before implementation:

1. Create:

`Antigravity_Prompts/51_Creative_High_Converting_Ecommerce_Homepage.md`

2. Put this entire prompt inside that file.

3. Read the complete file.

4. Execute ONLY from that file.

5. Inspect the current homepage and existing storefront architecture.

6. Inspect the actual product/category/brand/content data.

7. Inspect the real image assets available in the project.

8. Do not ask the user for approval between stages.

9. Preserve existing backend functionality.

10. After implementation:

* run frontend lint
* run frontend typecheck
* run frontend build
* run backend tests
* run backend lint/typecheck/build if relevant
* run Prisma validation if schema changes were made
* run browser/runtime QA
* fix discovered issues
* rerun validation

11. Create:

`Antigravity_Prompts/51_Creative_High_Converting_Ecommerce_Homepage_Report.md`

12. Stop after Prompt 51.

---

# 2. First: Audit the Existing Homepage

Inspect:

* current Homepage
* header
* navigation
* category navigation
* hero
* banners
* product sections
* product cards
* brands
* promotional sections
* footer
* API calls
* storefront APIs
* database models
* storefront section configuration
* product images
* category images
* brand images
* responsive behavior
* Arabic RTL
* English LTR

Identify:

* sections that are hardcoded
* sections that are dynamic
* sections connected to backend
* sections that are visual-only
* missing content
* broken links
* fake products
* fake images
* repeated layouts
* weak merchandising
* poor visual hierarchy
* missing calls-to-action
* sections that do not encourage purchasing

---

# 3. Homepage Philosophy

The homepage should answer these questions immediately:

### What does this store sell?

### What are the most interesting offers?

### What should I look at first?

### What products are popular?

### What can I buy now?

### Why should I continue browsing?

The page should guide the customer naturally:

```text
Attention
↓
Interest
↓
Discovery
↓
Product Exploration
↓
Trust
↓
Purchase
```

---

# 4. Hero Advertising Area

The FIRST major visual element after the navigation should be a large promotional Hero Carousel.

This is a core requirement.

The Hero should support multiple slides.

Conceptually:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                  HERO ADVERTISEMENT                      │
│                                                          │
│   Promotional Message          Real Promotional Image   │
│                                                          │
│   Short headline                                      │
│   Supporting text                                     │
│                                                          │
│   [ Shop Now ]                                        │
│                                                          │
│                         ● ○ ○ ○                       │
└──────────────────────────────────────────────────────────┘
```

Do not copy this exact visual layout.

Create an original composition.

---

# 5. Hero Carousel Requirements

The carousel must support:

* multiple slides
* real images
* headline
* supporting text
* CTA
* target URL/route
* optional product/category destination
* ordering
* visibility
* Arabic content
* English content

Use actual project assets.

Do NOT use generated placeholder imagery.

Do NOT use random external images.

---

# 6. Hero Animation

The carousel should automatically rotate.

Use a professional transition.

Support:

* autoplay
* pause on hover where appropriate
* manual previous/next
* pagination indicators
* keyboard accessibility
* touch/swipe on mobile

Do not make the animation aggressive.

Avoid excessive zoom effects.

Avoid flashy transitions.

The animation should feel premium and controlled.

---

# 7. Hero Content Management

If the existing Admin Storefront Management supports dynamic homepage sections, integrate the Hero with it.

Ideally:

```text
Admin
↓
Hero Slides
↓
Database
↓
Storefront API
↓
Homepage
```

Admin should be able to control:

* slide order
* visibility
* image
* Arabic headline
* English headline
* Arabic description
* English description
* CTA text
* CTA destination
* active state

Do not hardcode the hero slides inside React.

If the backend does not currently support Hero slide management and it is required by the existing storefront architecture:

Implement the missing backend/database support properly.

---

# 8. Real Images

Use the real image assets already available in the repository.

Inspect:

* `img/`
* `frontend/img/`
* `frontend/public/img/`
* `public/img/`
* other relevant project asset directories

Create an asset inventory.

Determine:

* product images
* category images
* brand images
* promotional images
* banners

Use images according to their actual purpose.

Do not randomly assign unrelated images to products.

Do not generate fake products to fill sections.

---

# 9. Homepage Section Strategy

After the Hero, create a rich sequence of merchandising sections.

The exact sections must be based on actual store data.

A strong possible structure is:

```text
Hero Carousel

↓
Quick Categories

↓
Promotional / Featured Collection

↓
Best Sellers

↓
Special Offers

↓
New Arrivals

↓
Category Spotlight

↓
Brand Showcase

↓
Curated Product Collection

↓
Promotional Banner

↓
More Products / Recommendations

↓
Trust / Service Benefits

↓
Footer
```

Do NOT blindly implement every section.

Only show sections when there is meaningful content.

---

# 10. Quick Categories

Create a visually attractive category discovery area.

It should allow customers to quickly explore major categories.

Do not make it a generic row of identical pill buttons.

Use:

* category image
* category name
* subtle interaction
* clear hierarchy

The category list must come from the actual backend.

Admin ordering/visibility must be respected.

---

# 11. Best Sellers

Create a Best Sellers section.

Products must come from actual data.

Do not randomly choose products.

If sales data exists, use actual sales/order information.

Otherwise use the closest legitimate business-defined metric already available.

Each product card should show relevant information such as:

* image
* product name
* price
* compare-at price
* discount
* rating where available
* availability
* quick action where supported

---

# 12. New Arrivals

Create a New Arrivals section using actual product creation dates or the existing backend's legitimate definition of new products.

Do not manually hardcode products.

---

# 13. Special Offers

Create a promotional product area when actual discounted products exist.

Highlight:

* original price
* current price
* discount
* availability

Do not fabricate discount percentages.

Prices must come from the server.

---

# 14. Curated Collections

Create visually distinct product collections.

Examples:

```text
Trending Now
Recommended For You
Editor's Picks
Top Rated
Featured Collection
```

Only use names whose underlying selection logic actually exists.

If Admin can manually configure collections, use database-backed configuration.

---

# 15. Category Spotlight

Instead of only showing products, create larger editorial-style category sections.

Example concept:

```text
┌──────────────────────────────────────────────┐
│                                              │
│          CATEGORY SPOTLIGHT                  │
│                                              │
│      Image             Products              │
│                                              │
│      Explore Category →                     │
│                                              │
└──────────────────────────────────────────────┘
```

Create an original layout.

The purpose is to break the visual rhythm of repeated product grids.

---

# 16. Brand Showcase

If the store has brands:

Create a professional Brand Showcase.

Use real brand logos/data.

Allow navigation to:

* brand page
* brand products

Do not show fake brands.

---

# 17. Promotional Banners

Use additional promotional banners between major product sections.

They can promote:

* seasonal campaigns
* category campaigns
* discounts
* new collections
* shipping offers
* store benefits

Banners should have a clear purpose.

Do not fill the page with banners just for visual decoration.

---

# 18. Product Section Variation

Do not make every section look like:

```text
Title
[Card] [Card] [Card] [Card]
```

Repeated 10 times.

Create visual variation:

* horizontal product rail
* featured product layout
* split category section
* editorial collection
* compact product list
* large feature product
* promotional block
* brand section

Maintain visual consistency without repetitive composition.

---

# 19. Product Cards

Redesign Product Cards to feel premium and consistent.

They should support:

* real image
* product name
* price
* previous price
* discount
* rating
* stock state where relevant
* wishlist
* quick add-to-cart where supported
* product link

Use professional icons.

No emojis.

Do not overload the card with buttons.

---

# 20. Product Image Behavior

Product images should:

* maintain aspect ratio
* avoid distortion
* load efficiently
* support lazy loading below the fold
* have appropriate fallback
* provide meaningful alt text

Do not stretch product images.

---

# 21. Calls To Action

Use meaningful CTAs.

Examples:

* Shop Now
* Explore Collection
* View Products
* Discover More
* See All

CTA wording must match the destination.

Do not create buttons that lead nowhere.

---

# 22. Promotional Psychology

The homepage should naturally create:

### Discovery

Customers discover categories/products.

### Urgency

Only where legitimate:

* active promotions
* limited stock
* sale periods

Do not fabricate scarcity.

### Social Proof

Use actual:

* ratings
* review counts
* best-seller signals

if available.

### Trust

Highlight legitimate store benefits such as:

* shipping
* returns
* secure payment
* customer support

Only if these services actually exist.

---

# 23. Trust / Benefits Section

Near the lower portion of the homepage, create a concise service-benefits section if the store actually provides these services.

Possible:

```text
Secure Payment
Fast Delivery
Easy Returns
Customer Support
```

Use professional icons.

No emojis.

Do not claim services that the backend/business does not actually support.

---

# 24. Homepage Personalization

If the application already supports customer-specific recommendations, integrate them.

If not, do NOT create fake personalization.

Do not show:

> Recommended for You

unless the selection logic actually exists.

Use honest alternatives such as:

> Featured Products

or:

> Popular Products

---

# 25. Dynamic Storefront Architecture

The homepage should use the existing Storefront content architecture.

Preferred concept:

```text
Database
↓
Storefront Configuration
↓
API
↓
Homepage Renderer
```

Each section should be controlled by actual data/configuration where supported.

Do not create a second competing homepage configuration system.

---

# 26. Admin Control

Ensure the homepage can be managed from the Admin Dashboard.

Admin should be able to control supported sections:

* visibility
* order
* title
* content
* selected products
* images
* links
* campaign banners
* hero slides

If a section is presented as configurable but has no backend persistence:

Implement the necessary persistence.

---

# 27. Mobile Homepage

Mobile must NOT be a reduced desktop version.

Create an intentional mobile composition.

Requirements:

* Hero adapts to mobile aspect ratio
* carousel remains usable
* touch gestures
* category browsing
* horizontal product rails where appropriate
* readable typography
* appropriate image sizes
* no horizontal page overflow

Test:

```text
320px
375px
390px
414px
```

---

# 28. Desktop Homepage

Test:

```text
768px
1024px
1280px
1440px+
```

Use available width intelligently.

Do not stretch content excessively.

Maintain readable maximum content width.

---

# 29. RTL / LTR

Support:

```text
Arabic → RTL
English → LTR
```

The entire homepage must adapt.

Check:

* Hero text
* arrows
* carousel controls
* product rails
* category sections
* navigation
* buttons
* spacing
* image/text compositions

Directional controls must reverse appropriately.

---

# 30. Visual Design

The homepage should be:

* premium
* modern
* creative
* commercial
* memorable
* clean
* original

Avoid:

* generic AI layouts
* excessive rounded cards
* excessive gradients
* glassmorphism
* decorative blobs
* random shadows
* excessive floating elements
* excessive pills
* generic template sections

The design should feel deliberately art-directed.

---

# 31. Do Not Copy Other Stores

Do not reproduce:

* Noon layout
* Amazon layout
* Shopify theme layouts
* Temu layout
* AliExpress layout
* Shein layout
* Walmart layout
* any recognizable ecommerce template

The objective is inspiration from ecommerce UX principles, not visual imitation.

---

# 32. Typography

Use the existing project typography system if appropriate.

Ensure:

* strong hero typography
* readable product titles
* clear prices
* good Arabic typography
* correct hierarchy

Do not use huge typography merely to make the design look impressive.

---

# 33. Color Usage

Use the existing brand identity where available.

Create visual contrast through:

* typography
* whitespace
* image composition
* borders
* restrained surfaces

Do not turn the entire homepage into a gradient.

---

# 34. Motion

Use subtle purposeful motion:

* hero transitions
* hover states
* product image transitions
* reveal animations where useful

Avoid excessive animation.

Respect reduced-motion preferences.

---

# 35. Performance

The homepage may contain many images.

Optimize:

* image loading
* lazy loading
* image dimensions
* responsive images
* above-the-fold priority
* unnecessary JavaScript
* duplicate API requests

The Hero's first visible image should load efficiently.

Do not lazy-load the primary above-the-fold image if that harms LCP.

---

# 36. SEO

Ensure the homepage has:

* proper title
* meta description
* semantic headings
* meaningful image alt text
* crawlable product/category links

Do not duplicate H1 elements unnecessarily.

---

# 37. Accessibility

Ensure:

* keyboard-accessible carousel
* accessible carousel controls
* readable contrast
* semantic headings
* meaningful links
* alt text
* focus states
* screen-reader-friendly controls

Do not make the carousel inaccessible.

---

# 38. Functional Requirements

Every:

* Hero CTA
* Product card
* Category card
* Brand card
* Banner
* Collection
* View All button
* Shop Now button

must lead to a real destination.

No dead links.

No visual-only CTAs.

---

# 39. Data Integrity

Do not introduce:

* fake products
* fake prices
* fake discounts
* fake reviews
* fake ratings
* fake brands
* fake stock
* fake sales numbers

Use actual backend data.

---

# 40. Cross-System Verification

Verify:

```text
Admin changes Hero
↓
Database
↓
API
↓
Homepage
```

Verify:

```text
Admin changes Product
↓
Database
↓
Homepage
↓
Product Details
```

Verify:

```text
Admin changes Category
↓
Database
↓
Homepage Category Section
↓
Category Page
```

Verify:

```text
Admin changes Product Visibility
↓
Database
↓
Homepage
```

---

# 41. Error Handling

Homepage must gracefully handle:

* API failure
* missing image
* empty category
* empty product collection
* unavailable product
* failed storefront configuration

Do not crash the entire homepage because one section fails.

Where appropriate, allow independent sections to fail gracefully.

---

# 42. Loading Experience

Use proper:

* hero loading state
* category skeleton
* product skeleton
* section loading

Do not show fake content during loading.

---

# 43. Empty Sections

If a dynamic section has no valid products:

Do not render an empty giant section.

Hide it or show an appropriate state depending on the business requirement.

The homepage should remain visually intentional.

---

# 44. Final Homepage Structure

The final homepage should feel like a complete shopping journey.

A possible conceptual structure:

```text
Header
↓
Hero Advertising Carousel
↓
Category Discovery
↓
Featured Campaign / Collection
↓
Best Sellers
↓
Promotional Offer
↓
New Arrivals
↓
Category Spotlight
↓
Brand Showcase
↓
Curated Collection
↓
Promotional Banner
↓
Trust / Service Benefits
↓
Footer
```

The actual implementation should adapt this structure to the real store's available data.

Do not blindly render empty sections.

---

# 45. Browser QA

Open the actual application.

Verify:

* hero loads
* slides change
* arrows work
* dots work
* swipe works
* CTA works
* categories work
* products work
* wishlist works
* add to cart works
* product links work
* banners work
* sections load
* images load
* no broken images
* no console errors
* no network errors
* no layout overflow

---

# 46. Final Responsive QA

Verify visually at:

```text
320px
375px
390px
414px
768px
1024px
1280px
1440px
```

Verify both:

```text
Arabic RTL
English LTR
```

---

# 47. Required Validation

Run:

### Frontend

* lint
* typecheck
* build

### Backend

* tests
* lint
* typecheck
* build

### Prisma

* `npx prisma validate`

if schema changes were made.

Fix issues and rerun validation.

---

# 48. Final Report

Create:

`Antigravity_Prompts/51_Creative_High_Converting_Ecommerce_Homepage_Report.md`

Include:

## 1. Homepage Audit

What was wrong with the old homepage.

## 2. New Structure

List the implemented sections in order.

## 3. Hero Carousel

Explain:

* slide system
* data source
* controls
* Admin integration
* responsive behavior

## 4. Product Sections

List every implemented dynamic section and its data source.

## 5. Storefront/Admin Integration

Document how Admin changes reach the homepage.

## 6. Assets

Document the actual project assets used.

## 7. Responsive

Document mobile/tablet/desktop behavior.

## 8. RTL/LTR

Document language behavior.

## 9. Accessibility

Document improvements.

## 10. Performance

Document image/loading optimizations.

## 11. QA

Include exact results for:

* lint
* typecheck
* build
* backend tests
* Prisma validation
* browser QA

## 12. Remaining Issues

Only report real remaining issues.

---

# 49. Final Status

Use exactly one:

`HOMEPAGE REDESIGN COMPLETED`

or:

`HOMEPAGE REDESIGN COMPLETED WITH LIMITATIONS`

or:

`HOMEPAGE REDESIGN FAILED`

Do not claim completion if major homepage functionality remains broken.

---

# 50. Stop

After implementation, QA, bug fixing, validation, and report creation:

STOP.

Do not automatically start Prompt 52.
