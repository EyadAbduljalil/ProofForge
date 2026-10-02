# Prompt 31 — Modern Storefront UI/UX Overhaul

## Role

You are working as a senior frontend engineer, UI/UX engineer, design-system architect, and product-quality engineer on the existing ecommerce repository.

The objective of this stage is to transform the customer-facing storefront into a modern, premium, production-quality ecommerce experience.

The storefront must feel like a serious, large-scale ecommerce platform inspired by modern marketplace UX patterns, but it MUST NOT copy Noon, Amazon, or any other platform's branding, proprietary visual identity, assets, or exact layouts.

Use the existing project's branding, functionality, backend APIs, and business logic wherever possible.

---

# 1. Mandatory Execution Protocol

Before doing any implementation:

1. Create this exact file:

`Antigravity_Prompts/31_Modern_Storefront_UI_UX_Overhaul.md`

2. Write this complete prompt into that file.

3. Read the Markdown file completely.

4. Execute the work ONLY from that Markdown file.

5. Do not execute this prompt directly from the chat message.

6. Inspect the existing application before changing anything.

7. Do not blindly rewrite the frontend.

8. Preserve working backend functionality and APIs.

9. Do not remove existing business functionality merely because the current UI is weak.

10. Do not start Prompt 32 automatically.

11. Stop after this prompt is completely implemented, validated, and reported.

12. Create a report:

`Antigravity_Prompts/31_Modern_Storefront_UI_UX_Overhaul_Report.md`

13. The report must document:

* What was inspected
* What was changed
* What components/pages were created or redesigned
* Responsive behavior
* Accessibility improvements
* Bugs discovered
* Bugs fixed
* Validation performed
* Remaining issues, if any

---

# 2. First: Perform a Full Frontend Audit

Before implementation, inspect the complete frontend.

Identify:

* Framework and version
* Routing
* Existing component architecture
* Existing styling system
* Design tokens
* CSS/Tailwind/etc.
* Existing UI components
* Existing layouts
* Existing pages
* Existing forms
* Existing API integration
* Authentication state
* Cart state
* Wishlist state
* Product state
* Search
* Filters
* Checkout
* Order tracking
* Notifications
* Localization
* Arabic/English support
* RTL implementation
* Loading states
* Error states
* Empty states
* Responsive behavior
* Accessibility
* Browser console errors
* TypeScript errors
* Dead components
* Duplicate components
* Inconsistent styling

Do not assume that the existing implementation is correct.

Verify it.

---

# 3. Establish a Consistent Design System

Create or consolidate a reusable frontend design system.

The goal is consistency, not adding unnecessary dependencies.

Define reusable tokens/components for:

* Typography
* Headings
* Body text
* Labels
* Buttons
* Inputs
* Selects
* Textareas
* Checkboxes
* Radio buttons
* Badges
* Chips
* Cards
* Product cards
* Containers
* Sections
* Modals
* Drawers
* Dropdowns
* Tooltips
* Alerts
* Toasts
* Skeleton loaders
* Pagination
* Tabs
* Breadcrumbs
* Tables where applicable
* Dividers
* Icons
* Form validation states

Use the project's existing styling technology when reasonable.

Do not introduce a massive UI framework just for appearance.

Avoid duplicated styling logic.

---

# 4. Modern Visual Direction

The storefront should have a modern, premium ecommerce visual language.

Requirements:

* Clean visual hierarchy
* Strong typography
* Professional spacing
* Consistent border radius
* Consistent shadows
* Clear primary actions
* Subtle interaction feedback
* High-quality cards
* Strong product imagery
* Clean navigation
* Clear pricing hierarchy
* Excellent whitespace
* No visual clutter
* No random colors
* No inconsistent component styles
* No excessive animations

Animations must be subtle and purposeful.

Do NOT use animations that negatively affect:

* Performance
* Accessibility
* Navigation
* Checkout
* Mobile usability

Respect `prefers-reduced-motion`.

---

# 5. Header and Navigation

Redesign the storefront header.

It should provide a professional ecommerce navigation experience.

Include, where supported by the existing application:

* Brand/logo
* Search
* Account
* Wishlist
* Cart
* Main navigation
* Categories
* Mobile navigation
* Authentication state
* Appropriate badges/counts

Search should be highly usable.

Desktop and mobile navigation must be intentionally designed separately rather than simply shrinking the desktop layout.

Ensure:

* No overflow
* No overlapping elements
* No broken dropdowns
* No inaccessible controls
* No layout jumps

---

# 6. Homepage

Redesign the homepage as a professional ecommerce landing experience.

Use the actual data/API capabilities of the project.

Potential sections:

* Hero/banner
* Featured categories
* Featured products
* Best sellers
* New arrivals
* Promotional sections
* Product collections
* Trust/value propositions
* Recently viewed where supported
* Personalized sections only if backend functionality exists

Do not create fake dynamic data.

If a section requires backend functionality that does not exist, do not pretend it works.

Use realistic fallback/empty states.

---

# 7. Product Listing / Catalog

Redesign category and product listing pages.

Requirements:

* Clear page hierarchy
* Breadcrumbs
* Search/filter controls
* Sorting
* Product count
* Responsive grid
* Pagination or existing pagination mechanism
* Mobile filter UX
* Loading skeletons
* Empty states
* Error states

Product cards must support the existing functionality.

A product card should clearly present, where available:

* Product image
* Product name
* Current price
* Previous price
* Discount
* Rating
* Review count
* Availability
* Wishlist action
* Quick action where appropriate

Do not display fake values.

---

# 8. Product Details Page

Redesign the product details experience.

Create a clear information hierarchy.

Where supported:

* Image gallery
* Product title
* Rating
* Reviews
* Current price
* Original price
* Discount
* Availability
* SKU
* Variants
* Quantity selector
* Add to cart
* Wishlist
* Description
* Specifications
* Shipping information
* Related products
* Reviews
* Product policies

Important:

All pricing and availability must remain server-authoritative.

Do not move business logic into the frontend.

Do not trust frontend-calculated prices.

---

# 9. Cart

Redesign the cart experience.

Requirements:

* Clear product rows/cards
* Product image
* Product information
* Quantity controls
* Remove action
* Wishlist/move action if supported
* Price
* Subtotal
* Discounts where applicable
* Shipping where applicable
* Total
* Checkout CTA

Handle:

* Empty cart
* Loading
* API failure
* Product unavailable
* Quantity limits
* Inventory changes

Make the cart understandable at a glance.

---

# 10. Wishlist

Redesign wishlist UI.

Support existing backend functionality.

Include:

* Product cards
* Remove
* Add to cart
* Availability
* Price
* Empty state
* Loading
* Error handling

Do not duplicate business logic.

---

# 11. Authentication Pages

Redesign:

* Login
* Registration
* Forgot password
* Reset password
* Verification flows where supported

Requirements:

* Professional forms
* Clear labels
* Inline validation
* Server error handling
* Loading states
* Disabled submit states
* Password visibility control where appropriate
* Accessible keyboard navigation

Do not expose sensitive backend errors.

---

# 12. Checkout

Checkout is a critical conversion flow.

Redesign it carefully without changing business rules.

Make the flow clear and trustworthy.

Where supported:

* Address
* Delivery
* Payment
* Order summary
* Coupon
* Totals
* Confirmation

Prevent accidental duplicate submission.

Show clear progress/loading states.

Do not trust client-side totals.

The frontend must display backend-authoritative totals.

---

# 13. Orders and Account Area

Redesign customer account pages.

Where supported:

* Profile
* Addresses
* Orders
* Order details
* Order tracking
* Wishlist
* Notifications
* Security/account settings

Orders should have clear statuses.

Use consistent status badges.

Make mobile order history usable.

---

# 14. Search UX

Improve search UX.

Requirements:

* Search input
* Clear button
* Loading state
* No-results state
* Error state
* Useful result presentation
* Mobile usability
* Keyboard accessibility

If autocomplete/search suggestions already exist, improve them.

Do not invent backend search behavior.

---

# 15. Arabic / English / RTL

The storefront must work correctly in both supported languages.

Verify:

* Text direction
* Layout direction
* Icons
* Arrows
* Breadcrumbs
* Forms
* Product grids
* Navigation
* Modals
* Drawers
* Alignment
* Spacing
* Numbers
* Currency
* Dates

Do not simply apply `direction: rtl` and assume the UI is correct.

Test actual Arabic layouts.

Ensure English remains correct.

---

# 16. Responsive Design

Treat responsive design as a first-class requirement.

Test at minimum:

* 320px
* 360px
* 390px
* 414px
* 768px
* 1024px
* 1280px
* 1440px+

Check every major page.

Look specifically for:

* Horizontal overflow
* Cropped content
* Broken grids
* Tiny text
* Oversized buttons
* Overlapping headers
* Broken dialogs
* Broken tables
* Broken product images
* Navigation issues
* Footer issues

Fix the underlying layout rather than adding random media-query patches.

---

# 17. Loading / Empty / Error / Success States

Every asynchronous customer-facing feature must have intentional states.

Implement or improve:

### Loading

Use skeletons where appropriate.

### Empty

Explain what happened and provide the next useful action.

### Error

Show user-safe error messages.

### Success

Provide clear confirmation.

Do not leave blank screens.

Do not show raw API errors.

---

# 18. Accessibility

Perform a serious accessibility pass.

Check:

* Semantic HTML
* Labels
* Keyboard navigation
* Focus states
* Focus management
* Button semantics
* Form errors
* Color contrast
* Screen-reader labels
* Modal accessibility
* Dropdown accessibility
* Image alt text
* Heading hierarchy

Do not hide important information from keyboard or screen-reader users.

---

# 19. Performance

Improve frontend performance without premature optimization.

Check:

* Large images
* Image dimensions
* Lazy loading
* Unnecessary rerenders
* Large bundles
* Duplicate dependencies
* Excessive client-side work
* Layout shifts
* Expensive effects
* Unnecessary API requests

Do not introduce complicated caching systems unless justified by the existing architecture.

---

# 20. Browser Console and Runtime Quality

The final storefront must not have avoidable:

* Console errors
* Unhandled promise rejections
* React warnings
* Hydration errors where applicable
* Broken network calls caused by frontend mistakes
* Missing keys
* Broken routes
* Invalid HTML
* Runtime crashes

Fix discovered issues.

Do not suppress errors just to make the console appear clean.

---

# 21. Preserve Backend Contracts

IMPORTANT:

Do not rewrite backend business logic during this prompt.

Do not modify:

* Pricing authority
* Inventory authority
* Payment authority
* Order calculations
* Coupon validation
* Authentication rules
* Authorization rules

unless a frontend integration bug absolutely requires a compatible correction.

If a backend limitation prevents a proper UI feature, document it instead of inventing behavior.

---

# 22. Avoid Fake Functionality

Do NOT:

* Create fake analytics
* Create fake product data
* Create fake order status
* Create fake reviews
* Create fake payment success
* Create fake inventory
* Hardcode backend results
* Pretend an unavailable feature works

The UI must reflect actual application state.

---

# 23. Component Architecture

Refactor duplicated UI into reusable components where beneficial.

Examples:

* `Button`
* `Input`
* `Select`
* `Modal`
* `Drawer`
* `Toast`
* `Badge`
* `ProductCard`
* `ProductGrid`
* `ProductGallery`
* `PriceDisplay`
* `Rating`
* `Pagination`
* `EmptyState`
* `ErrorState`
* `LoadingSkeleton`
* `PageHeader`
* `Breadcrumbs`

Use naming and folder organization consistent with the existing project.

Do not over-engineer.

---

# 24. Visual Consistency Audit

After implementation, inspect the entire storefront as one product.

Verify:

* Same button language
* Same card language
* Same spacing
* Same typography
* Same border treatment
* Same interaction states
* Same form behavior
* Same status badges
* Same loading patterns
* Same error patterns
* Same RTL behavior

The application should look like one coherent product, not many independently designed pages.

---

# 25. Quality Gate

Before declaring completion, run all applicable checks.

At minimum:

* Frontend tests
* Frontend lint
* TypeScript/typecheck
* Production build
* Backend tests if frontend changes interact with backend
* Backend lint/typecheck if applicable
* Backend build if applicable

Also perform manual/automated inspection of:

* Homepage
* Catalog
* Product details
* Search
* Cart
* Wishlist
* Login
* Registration
* Checkout
* Account
* Orders
* Mobile layouts
* Arabic RTL
* English LTR

Fix all issues discovered during validation.

Then rerun validation.

Do not stop at the first successful build.

---

# 26. Definition of Done

This prompt is complete only when:

1. Storefront has a coherent modern design system.
2. Major customer-facing pages have been redesigned.
3. Desktop layouts are polished.
4. Mobile layouts are polished.
5. Arabic RTL works correctly.
6. English LTR works correctly.
7. Loading states are intentional.
8. Empty states are intentional.
9. Error states are intentional.
10. Forms are polished and accessible.
11. Product presentation is professional.
12. Cart and checkout are clear and trustworthy.
13. No fake functionality was introduced.
14. Existing backend business logic remains authoritative.
15. No avoidable console/runtime errors remain.
16. Lint passes.
17. Typecheck passes.
18. Build passes.
19. Tests pass.
20. Any discovered issues are fixed and validation is rerun.
21. The final report is created.

---

# 27. Final Report

Create:

`Antigravity_Prompts/31_Modern_Storefront_UI_UX_Overhaul_Report.md`

Include:

## Executive Summary

## Existing Frontend Audit

## Design System Changes

## Pages Redesigned

## Components Created/Refactored

## Responsive Improvements

## Arabic/RTL Improvements

## Accessibility Improvements

## Performance Improvements

## Bugs Found

## Bugs Fixed

## Validation Results

Include exact results for:

* Tests
* Lint
* Typecheck
* Build
* Any additional checks

## Remaining Issues

Only list genuine remaining issues.

## Final Status

Use one of:

`COMPLETED`

or

`COMPLETED WITH DOCUMENTED LIMITATIONS`

Do not claim perfection if a genuine unresolved issue remains.

---

# Critical Constraints

* Do not start Prompt 32.
* Do not modify unrelated backend business logic.
* Do not remove existing working functionality.
* Do not invent functionality.
* Do not use fake data to hide missing backend functionality.
* Do not add unnecessary dependencies.
* Do not merely change colors and call it a redesign.
* Do not consider a successful build sufficient.
* Perform actual UX and responsive quality validation.
* Fix issues discovered during validation.
* Rerun validation after fixes.
* Create the required report.
* Stop when Prompt 31 is complete.
