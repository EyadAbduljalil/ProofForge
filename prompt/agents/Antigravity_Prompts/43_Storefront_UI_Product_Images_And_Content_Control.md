# Prompt 43 — Complete Storefront UI, Product Images & Admin Content Control

## Mission

Perform a comprehensive storefront and catalog-management enhancement covering four connected objectives:

1. Replace all storefront/admin emojis with a consistent professional icon system.
2. Use the **real product images already available inside the project's `img` directory** for product presentation.
3. Fix and polish the homepage and all pages/components directly connected to it.
4. Give the Admin Dashboard complete control over storefront sections, categories, and which products appear in each section.

The final result must feel like a polished, production-quality modern ecommerce platform.

Do not invent product images, fake products, fake metrics, or placeholder merchandising data when real project data/assets already exist.

---

# 1. Mandatory Antigravity Execution Protocol

Follow the established execution protocol exactly.

### Step 1 — Create the prompt file

Create:

`Antigravity_Prompts/43_Storefront_UI_Product_Images_And_Content_Control.md`

Write this complete prompt into the file.

### Step 2 — Read the entire prompt file

Read the complete file from beginning to end.

Execute only from the Markdown file.

### Step 3 — Audit before implementation

Before changing code, inspect:

* entire frontend structure
* homepage
* header
* navigation
* section/category bar
* footer
* product listing pages
* product details
* search
* cart
* wishlist
* checkout
* account
* order tracking
* loading/error/empty states
* all homepage-related components
* admin dashboard
* product management
* category management
* brand management
* current storefront section implementation
* Prisma schema
* product/media models
* existing image assets
* `img` directories throughout the repository
* existing API routes
* current frontend API integration

Also inspect:

* hardcoded product arrays
* hardcoded image URLs
* broken image paths
* placeholder images
* emoji-based UI
* duplicated components
* dead links/buttons
* inconsistent navigation
* runtime errors

Do not assume an existing feature works merely because the UI exists.

---

# 2. Real Product Images From `img`

This is a high-priority requirement.

Search the project for all relevant image directories, especially:

```text
img/
frontend/img/
frontend/public/img/
public/img/
backend/img/
assets/
public/
```

and any other existing asset directories.

Determine:

* what images exist
* image filenames
* image formats
* dimensions
* whether filenames correspond to products
* whether duplicate images exist
* whether some images are category/brand/banner images instead of product images

Do not delete existing assets.

Do not replace valid real product images with generated images.

Do not download random internet images.

---

# 3. Product Image Mapping

Build a reliable mapping between actual products and the existing images.

Prefer, in order:

1. existing database/media relationship
2. existing product image field
3. SKU/product identifier in filename
4. exact/strong product-name matching
5. deterministic mapping documented in code/data
6. manual admin assignment if the existing data does not provide enough information

Do not guess incorrectly.

If an image cannot be confidently mapped to a product:

* do not assign it randomly
* identify it as unmapped
* document it in the final report
* allow future admin assignment if appropriate

---

# 4. Product Image Architecture

Use the existing product/media architecture if one already exists.

Do not create a duplicate product-image system unnecessarily.

If the current architecture stores image URLs/paths:

* make them point to the real project assets
* ensure frontend URLs resolve correctly
* handle missing images gracefully

If product images are stored in the database:

* preserve that model
* update references safely
* do not destroy existing product data

The storefront must display the real product image associated with each product.

---

# 5. Product Cards

Audit and improve the product card.

It should support:

* real product image
* product name
* brand/category where appropriate
* current price
* previous price if applicable
* discount indication if real
* stock/availability state
* rating if available from real data
* wishlist action
* add-to-cart action where appropriate
* product details navigation

Use professional icons rather than emojis.

Images must:

* preserve aspect ratio
* use proper object-fit behavior
* avoid distortion
* have useful alt text
* provide fallback behavior
* lazy-load when appropriate

---

# 6. Product Image Performance

Optimize image rendering without destroying quality.

Use:

* lazy loading where appropriate
* explicit dimensions/aspect ratio
* responsive sizing
* browser caching/static asset behavior where appropriate

Do not introduce an external image service unless the project already uses one.

Avoid loading unnecessarily large images for small cards.

---

# 7. Replace All UI Emojis

Perform a complete frontend audit.

Replace emoji-based UI with professional SVG/icon components.

Check:

* Header
* Search
* Cart
* Wishlist
* Account
* Notifications
* Navigation
* Category bar
* Product cards
* Product details
* Cart drawer
* Checkout
* Orders
* Account
* Empty states
* Error states
* Success states
* Admin dashboard
* Admin tables
* Admin forms
* Status indicators
* Action buttons

Use one coherent icon library/system.

Do not use a mixture of unrelated icon styles.

---

# 8. Homepage Full Audit

The homepage must be treated as a complete user journey, not just a single component.

Inspect and fix:

* hero area
* category area
* category navigation/bar
* featured sections
* product grids
* product carousels
* promotional areas
* search entry points
* calls to action
* spacing
* typography
* images
* responsive behavior
* loading states
* empty states
* error states
* navigation
* footer
* mobile layout

Check for:

* broken links
* dead buttons
* wrong routes
* missing images
* incorrect product data
* duplicated sections
* inconsistent spacing
* overflow
* layout jumps
* mobile clipping
* horizontal scroll
* RTL problems
* console errors

---

# 9. Homepage Product Sections

Every product section on the homepage must be backed by actual data.

Examples:

* Featured Products
* New Arrivals
* Best Sellers
* Deals
* Trending
* Recommended
* Category-specific collections

Do not fabricate these sections.

For dynamic sections such as:

### New Arrivals

Use real product creation/update data.

### Best Sellers

Use real order data if implemented.

### Deals

Use actual active pricing/discount data.

### Featured

Use admin-selected products.

If the backend does not contain enough real data to support a dynamic section, make it manual/admin-controlled instead of fabricating metrics.

---

# 10. Category Bar / Category Navigation

The category bar is a major part of the storefront and must be completely audited.

It should:

* display real categories from the backend
* respect category visibility/status
* use real category names
* support Arabic and English
* follow the persisted category display order
* navigate to the correct category
* highlight the current category when appropriate
* work on mobile
* support horizontal scrolling where appropriate
* avoid visual overflow
* remain usable in RTL
* use professional icons where icons are appropriate

Do not hardcode product/category content if it already exists in the database.

---

# 11. Category Bar Design

Create a polished modern category navigation experience.

Desktop:

* clean horizontal navigation
* clear active state
* proper spacing
* optional category icons/images if real assets exist

Mobile:

* touch-friendly
* horizontal scroll
* no broken wrapping
* no accidental page-wide horizontal scrolling
* clear active state

RTL:

* scrolling and alignment must behave correctly
* arrows/icons must be direction-aware
* text must align naturally

---

# 12. Category Pages

Audit category pages and category filtering.

Verify:

* category route works
* products belong to the selected category
* product images are correct
* filters work
* sorting works
* pagination works
* empty category behaves correctly
* inactive categories are not publicly exposed where business rules require hiding them
* category names are localized
* URLs are correct

---

# 13. Products Page

Audit the main product listing page.

Verify:

* real products load
* real images load
* search works
* category filter works
* brand filter works
* price filtering works
* sorting works
* pagination works
* loading state works
* empty state works
* error state works

Check mobile and RTL/LTR behavior.

---

# 14. Product Details Page

Fix all issues found on the product details page.

Verify:

* correct product image
* product title
* price
* discount
* inventory status
* product description
* category
* brand
* variants if supported
* quantity controls
* add to cart
* wishlist
* related products
* breadcrumb
* back/navigation behavior

The page must never trust frontend-supplied pricing or inventory.

---

# 15. Related Products

Related products must come from actual products.

Possible sources:

* same category
* same brand
* manually selected products
* real recommendation logic

Do not show arbitrary hardcoded products.

Do not recommend inactive/unavailable products unless explicitly intended.

Use the real images.

---

# 16. Header and Global Navigation

Audit:

* logo
* navigation
* search
* cart
* wishlist
* account
* notifications if present
* language switch
* mobile menu

Fix:

* alignment
* icon consistency
* spacing
* responsive behavior
* sticky behavior if used
* RTL/LTR
* route correctness
* accessibility

Do not break existing authentication/cart behavior.

---

# 17. Cart and Checkout

Because the homepage connects directly to shopping flows, verify:

* product cards add correct product
* correct product image appears in cart
* quantity controls work
* totals are server-authoritative
* checkout receives correct cart state
* unavailable products are handled
* out-of-stock behavior is correct

Do not change financial business logic merely for visual changes.

---

# 18. Admin — Complete Storefront Management

Create or enhance a dedicated admin area such as:

**Storefront Management**

The admin must control what customers see.

Admin should be able to manage:

* homepage sections
* section order
* section visibility
* section title Arabic/English
* section description Arabic/English
* section type
* section products
* product order within section
* categories
* category order
* category visibility
* category/product relationships
* brands
* brand visibility
* promotional content where supported

---

# 19. Section Management

Each storefront section must support:

* create
* edit
* activate
* deactivate
* reorder
* archive/delete where safe
* product assignment
* product removal
* product ordering

Store the configuration persistently in PostgreSQL.

The frontend must read it from the backend.

---

# 20. Product Selection Interface

Administrators must NOT need to enter product IDs.

Create a product selector with:

* product image
* product name
* SKU
* price
* inventory state
* search
* filters
* pagination
* selection
* deselection
* ordering

The selector must use the same real product images from the project.

---

# 21. Category Management

Admin must be able to control:

* category name Arabic
* category name English
* description
* image/icon where supported
* visibility
* order
* products assigned to category

Provide a clear category → products interface.

Do not duplicate products.

---

# 22. Complete Storefront Content Hierarchy

The final architecture should conceptually support:

```text
Storefront
│
├── Header
│
├── Category Navigation
│
├── Hero / Promotional Area
│
├── Admin-Configured Section 1
│   ├── Product
│   ├── Product
│   └── Product
│
├── Admin-Configured Section 2
│   ├── Product
│   └── Product
│
├── Category Section
│
├── Additional Sections
│
└── Footer
```

The exact sections must come from actual persisted configuration where they represent merchandising/content.

---

# 23. No Hardcoded Merchandising

Search the frontend for:

* hardcoded product IDs
* hardcoded product arrays
* hardcoded featured products
* hardcoded category lists
* hardcoded homepage product order
* hardcoded fake "best seller" lists
* hardcoded fake "trending" lists

Classify every occurrence.

Replace merchandising hardcoding with backend/database-driven data where appropriate.

Static UI structure may remain hardcoded.

---

# 24. Admin Preview

Where practical, provide a preview of how a section will appear.

Preview must use actual selected products and actual images.

Do not create a fake preview disconnected from saved data.

If live preview is too complex for the current architecture, provide a clear editor preview based on current form state.

---

# 25. Admin Authorization

Only authorized administrators can modify storefront configuration.

Verify backend authorization for:

* section creation
* section updates
* section deletion/archive
* section activation
* section ordering
* product assignment
* category management
* brand management

Do not rely on frontend route protection.

Integrate with:

* global security guard
* security registry
* RBAC
* audit logging

---

# 26. Audit Logging

Log significant administrative merchandising actions:

* section created
* section updated
* section activated/deactivated
* section reordered
* products assigned
* products removed
* product order changed
* category created/updated
* category activated/deactivated
* category reordered
* brand changes

Do not log:

* passwords
* tokens
* cookies
* API secrets
* payment credentials

---

# 27. Database Design

Inspect Prisma first.

Use existing models where possible.

If schema changes are required, use a normalized design.

A conceptual structure could be:

```text
StorefrontSection
    id
    nameAr
    nameEn
    descriptionAr
    descriptionEn
    type
    status
    displayOrder
    maxProducts
    configuration
    createdAt
    updatedAt

StorefrontSectionProduct
    sectionId
    productId
    displayOrder
```

Do not blindly copy this schema.

Adapt it to the existing project.

Add:

* foreign keys
* indexes
* unique constraints
* timestamps
* safe delete behavior

---

# 28. Database Safety

Do not introduce destructive migrations.

Verify:

* duplicate assignments are prevented
* invalid product IDs are rejected
* invalid section IDs are rejected
* ordering is persisted
* transactions protect multi-step reorder/assignment operations where required

Preserve all existing products/orders/customers/inventory.

---

# 29. API Design

Implement or enhance APIs following existing project conventions.

Admin:

* GET sections
* GET section
* POST section
* PATCH section
* DELETE/archive section
* PATCH section status
* PATCH section order
* assign products
* remove products
* reorder products

Storefront:

* GET published sections
* GET published categories
* GET section products

Customer APIs must not expose admin-only configuration.

---

# 30. Performance

Avoid N+1 queries.

For homepage data:

* fetch sections efficiently
* fetch products in bounded quantities
* use Prisma `select/include` appropriately
* add required indexes
* avoid fetching unnecessary admin data

Do not issue one request per product.

---

# 31. Image Error Handling

Every product image must have:

* valid source
* appropriate alt text
* graceful fallback
* no broken-image icon where avoidable

If a mapped image is missing:

* do not crash the page
* show a professional fallback
* document the missing asset

Do not silently substitute an unrelated product image.

---

# 32. Accessibility

Verify:

* keyboard navigation
* button semantics
* icon-only button labels
* image alt text
* sufficient focus visibility
* form labels
* accessible status messages
* logical heading hierarchy

Emoji replacement must improve, not reduce, accessibility.

---

# 33. Arabic / English

Verify every changed page in:

### Arabic RTL

and:

### English LTR

Check:

* header
* category bar
* homepage
* product cards
* filters
* admin section management
* product selector
* buttons
* icons
* breadcrumbs
* forms
* tables
* mobile navigation

---

# 34. Responsive Verification

Verify at minimum:

* 320px
* 375px
* 768px
* 1024px
* 1280px
* 1440px+

Pay particular attention to:

* category bar
* product grids
* carousels
* hero
* header
* admin product selector
* section editor

No unintended horizontal page scrolling.

---

# 35. Runtime QA

Run the storefront locally where possible.

Check browser console for:

* errors
* warnings caused by the implementation
* failed API requests
* broken image requests
* invalid React keys
* hydration/runtime issues where applicable

Test the main journey:

```text
Homepage
→ Category
→ Product Listing
→ Product Details
→ Add To Cart
→ Cart
→ Checkout
```

Also test:

```text
Admin
→ Storefront Management
→ Create/Edit Section
→ Select Products
→ Reorder Products
→ Save
→ Activate
→ Open Storefront
→ Verify Display
→ Deactivate
→ Verify Removal
```

---

# 36. Security Regression

Preserve all security architecture from previous prompts.

Run existing security tests.

The previous baseline was:

`11/11 security tests passing`

Verify no regression.

Also verify:

* RBAC
* BOLA/IDOR
* mass assignment
* server-authoritative prices
* inventory authority
* coupon authority
* payment authority

---

# 37. Quality Gates

Run:

### Frontend

```bash
npm run lint
npm run build
```

Run typecheck separately if available.

### Backend

```bash
npm run lint
npm run build
npm test
```

### Database

Run:

* Prisma validation
* schema validation
* migration validation

### Security

Run:

* secret scan
* dependency audit
* relevant authorization tests

---

# 38. Final Asset Audit

Create an inventory of the discovered product images.

Classify:

* mapped successfully
* duplicate
* unmapped
* invalid/corrupt
* non-product asset

Do not delete files during this stage unless they are clearly generated build artifacts and removal is safe.

Include the results in the final report.

---

# 39. Final Report

Create:

`Antigravity_Prompts/43_Storefront_UI_Product_Images_And_Content_Control_Report.md`

Include:

1. Executive summary
2. Before/after storefront findings
3. Emoji/icon replacement
4. Product image inventory
5. Product-image mapping
6. Homepage fixes
7. Category bar fixes
8. Header/navigation fixes
9. Product listing fixes
10. Product details fixes
11. Cart/checkout integration verification
12. Storefront section architecture
13. Admin management features
14. Category/product management
15. Database changes
16. API changes
17. Authorization/RBAC
18. Audit logging
19. Arabic/English verification
20. Responsive verification
21. Runtime QA
22. Hardcoded merchandising audit
23. Performance
24. Tests
25. Build/lint/typecheck
26. Prisma/migration validation
27. Dependency audit
28. Secret scan
29. Remaining limitations/configuration requirements
30. Final status

---

# 40. Final Status

Use exactly one:

### `COMPLETED`

All requested functionality is implemented and validated.

### `COMPLETED WITH CONFIGURATION REQUIRED`

Implementation is complete but environment/external configuration remains.

### `COMPLETED WITH LIMITATIONS`

The implementation works but one or more documented limitations remain.

### `FAILED — REMEDIATION REQUIRED`

A major requested feature or existing critical functionality remains broken.

Do not claim completion merely because builds pass.

---

# 41. Completion Requirement

Prompt 43 is complete only after:

* prompt file created
* prompt file fully read
* `img` assets inspected
* real product images integrated correctly
* emoji UI replaced with professional icons
* homepage audited and fixed
* category bar audited and fixed
* connected storefront pages audited and fixed
* product cards improved
* product listing verified
* product details verified
* header/navigation verified
* cart/checkout integration verified
* storefront sections are database-driven
* admin controls section visibility
* admin controls section ordering
* admin controls products within sections
* admin controls product ordering
* categories are manageable
* category/product relationships are manageable
* brands are manageable where supported
* RBAC enforced
* audit logging integrated
* Arabic RTL works
* English LTR works
* mobile/responsive behavior verified
* no fake product images/data introduced
* no broken existing ecommerce functionality
* frontend lint/build pass
* backend lint/build/tests pass
* Prisma validation passes
* security regression passes
* secret scan passes
* final report created

Then:

**STOP.**

Do not execute Prompt 44 automatically.
