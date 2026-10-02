# Prompt 35 — Full Storefront & Admin Quality Assurance Audit

## Objective

Perform a comprehensive end-to-end quality assurance, UX/UI, functional integration, responsive, accessibility, runtime, and production-readiness audit of the complete ecommerce application.

The application has already gone through:

* Storefront UI/UX modernization
* Admin Dashboard modernization
* Advanced Product Management
* Complete Store Management workflows

This stage is a full-system quality gate.

The objective is to identify and FIX remaining defects, inconsistencies, broken workflows, visual problems, responsive problems, integration problems, and usability issues.

This is NOT a simple report-only audit.

When a safe and appropriate defect is discovered, FIX IT and validate the fix.

---

# 1. Mandatory Execution Protocol

Before implementation:

1. Create:

`Antigravity_Prompts/35_Full_Storefront_Admin_QA_Audit.md`

2. Write this complete prompt into that file.

3. Read the Markdown file completely.

4. Execute ONLY from the Markdown file.

5. Inspect the entire application before making changes.

6. Do not assume previous prompts are perfect.

7. Validate actual behavior.

8. Fix discovered issues.

9. Rerun validation after fixes.

10. Do not automatically start Prompt 36.

11. Create:

`Antigravity_Prompts/35_Full_Storefront_Admin_QA_Audit_Report.md`

12. Stop after Prompt 35 is complete.

---

# 2. Full Application Scope

Audit the complete system:

## Storefront

* Homepage
* Header
* Navigation
* Search
* Categories
* Product listing
* Product details
* Cart
* Wishlist
* Checkout
* Authentication
* Account
* Orders
* Order tracking
* Footer
* Notifications where applicable

## Admin

* Dashboard
* Products
* Product creation
* Product editing
* Categories
* Brands
* Inventory
* Orders
* Customers
* Coupons
* Reviews
* Payments
* Notifications
* Audit Logs
* Settings where supported

## Backend Integration

* APIs
* Authentication
* Authorization
* Validation
* Error handling
* Data persistence
* Financial authority
* Inventory authority
* Security middleware

---

# 3. First: Build a Complete Route Inventory

Inspect the source code and identify all actual application routes.

Create an internal inventory containing:

* Route
* Page/component
* Authentication requirement
* Authorization requirement
* Public/private/admin
* API dependencies
* Main user workflow

Compare the inventory with:

* Frontend routing
* Backend routes
* Security Registry
* Admin navigation

Identify:

* Missing routes
* Duplicate routes
* Dead routes
* Broken links
* Incorrect redirects
* Routes accessible to the wrong user

Fix safe issues.

---

# 4. Navigation Audit

Test all major navigation paths.

Check:

* Header links
* Sidebar links
* Breadcrumbs
* Product links
* Category links
* Account links
* Cart links
* Checkout navigation
* Admin navigation
* Back navigation
* Redirects

Ensure there are no:

* Dead links
* 404 pages caused by application mistakes
* Wrong redirects
* Duplicate navigation destinations
* Broken mobile menus

---

# 5. Storefront Visual Audit

Review the storefront as a complete commercial ecommerce product.

Inspect:

* Typography
* Spacing
* Colors
* Buttons
* Cards
* Product cards
* Inputs
* Forms
* Badges
* Modals
* Drawers
* Navigation
* Footer
* Product imagery

Look for:

* Inconsistent components
* Misaligned elements
* Poor spacing
* Incorrect typography
* Broken visual hierarchy
* Excessive decoration
* Inconsistent states
* Unprofessional layouts

Fix genuine defects.

Do not redesign everything again without reason.

---

# 6. Homepage QA

Test:

* Initial loading
* Product loading
* Category loading
* Hero/banner
* Featured products
* Navigation
* Product links
* Responsive behavior
* Empty states
* API failures

Ensure no section renders broken or fake information.

---

# 7. Catalog QA

Test:

* Product list
* Search
* Filters
* Sorting
* Pagination
* Product cards
* Wishlist
* Add to cart
* Loading
* Empty state
* Error state

Verify that filters actually affect results.

Verify pagination actually changes results.

Verify search does not produce inconsistent stale state.

---

# 8. Product Details QA

Test:

* Product loading
* Images
* Gallery
* Product information
* Pricing
* Stock
* Variants where supported
* Quantity
* Add to cart
* Wishlist
* Reviews
* Related products

Verify:

* Out-of-stock behavior
* Invalid product
* Broken image
* API failure
* Quantity limits

Do not allow the frontend to override server-authoritative pricing or inventory.

---

# 9. Cart QA

Test:

* Add product
* Increase quantity
* Decrease quantity
* Remove
* Empty cart
* Cart drawer
* Cart page where applicable
* Inventory changes
* Price changes
* API failure

Verify that displayed totals correspond to server state.

Test duplicate clicks/submissions.

---

# 10. Wishlist QA

Test:

* Add
* Remove
* Empty state
* Loading
* Error
* Add to cart

Verify persistence after refresh.

---

# 11. Authentication QA

Test:

* Login
* Logout
* Registration
* Invalid credentials
* Validation errors
* Forgot password where supported
* Reset password where supported
* Session expiration
* Unauthorized access

Verify protected pages redirect correctly.

Do not expose authentication internals.

---

# 12. Checkout QA

Checkout is a critical business workflow.

Test:

1. Cart
2. Address
3. Delivery
4. Coupon
5. Payment
6. Order submission
7. Confirmation

Verify:

* Validation
* Loading
* Duplicate submission prevention
* Server errors
* Invalid coupon
* Inventory changes
* Payment failure
* Successful order

The frontend must never become authoritative for:

* Final total
* Discount
* Shipping cost
* Inventory
* Payment state

---

# 13. Order Tracking QA

Test:

* Valid order
* Invalid order
* Authorized customer access
* Status display
* Timeline
* Loading
* Error state

Ensure customers cannot view unauthorized orders.

---

# 14. Account QA

Test:

* Profile
* Addresses
* Orders
* Wishlist
* Notifications
* Security settings where supported

Verify that customer data is properly scoped.

---

# 15. Admin Authentication QA

Test:

* Admin login
* Non-admin access
* Unauthorized access
* Session expiration
* Admin route protection
* Admin API authorization

Verify that hiding the Admin menu is NOT the only protection.

Backend authorization must remain authoritative.

---

# 16. Admin Dashboard QA

Test:

* Dashboard loading
* KPI cards
* Recent orders
* Inventory alerts
* Navigation
* Empty states
* API errors

Verify metrics use real data.

Do not allow fake values.

---

# 17. Admin Product QA

Perform complete workflows:

### Create

`Products → Create → Enter Data → Save → Verify`

### Edit

`Products → Open → Modify → Save → Reload → Verify`

### Delete/Disable

`Products → Open → Delete/Disable → Confirm → Verify`

### Search

`Products → Search → Verify Results`

### Filters

`Products → Filter → Verify Results`

### Pagination

`Products → Next Page → Verify`

### Bulk

`Products → Select → Bulk Action → Verify`

Only test capabilities actually supported by the backend.

---

# 18. Admin Category QA

Test:

* Create
* Edit
* Delete/disable where supported
* Search
* Product count
* Parent category where supported

Verify persistence after reload.

---

# 19. Admin Brand QA

Test:

* Create
* Edit
* Delete where supported
* Search
* Persistence

---

# 20. Admin Inventory QA

Test:

* Stock display
* Low-stock filtering
* Out-of-stock filtering
* Adjustment where supported
* Error handling
* Persistence

Verify actual database state after changes.

---

# 21. Admin Orders QA

Test:

* Search
* Filters
* Pagination
* Order details
* Timeline
* Payment state
* Fulfillment/order state
* Valid status actions

Verify unauthorized or invalid status transitions are rejected.

---

# 22. Admin Customers QA

Test:

* Search
* Filters
* Pagination
* Customer details
* Order history

Verify sensitive fields are not exposed.

---

# 23. Admin Coupons QA

Test:

* Create
* Edit
* Disable/delete where supported
* Search
* Filters
* Expiration
* Persistence

Verify coupon rules remain server-authoritative.

---

# 24. Admin Reviews QA

Test:

* Search
* Filter
* Rating
* Product
* Status
* Approve/reject where supported
* Delete where supported

Verify moderation persistence.

---

# 25. Admin Payments QA

Test:

* Payment list
* Search
* Status
* Order relation
* Amount
* Currency
* Provider

Verify no sensitive payment credentials are exposed.

---

# 26. Admin Notifications QA

Where supported, test:

* List
* Search
* Filter
* Status
* Recipient
* Notification action

Do not test fake functionality.

---

# 27. Admin Audit Logs QA

Test:

* List
* Search
* Filters
* Pagination
* Detail view
* Severity
* Actor
* Action
* Correlation ID

Verify secrets remain redacted.

---

# 28. Settings QA

Only test settings that are actually implemented.

Verify:

* Load
* Edit
* Save
* Validation
* Persistence
* Error handling

Do not create fake settings.

---

# 29. Responsive Audit

Perform a complete responsive audit.

Minimum widths:

* 320px
* 360px
* 390px
* 414px
* 768px
* 1024px
* 1280px
* 1440px

Audit both:

## Storefront

and

## Admin

Check:

* Header
* Navigation
* Sidebar
* Product grids
* Tables
* Forms
* Dialogs
* Drawers
* Checkout
* Footer
* Charts
* Pagination

There must be no unexplained horizontal overflow.

---

# 30. Mobile UX

Do not merely shrink desktop layouts.

Verify mobile-specific usability:

* Touch targets
* Menus
* Filters
* Product cards
* Cart
* Checkout
* Admin tables
* Admin forms
* Dialogs

Fix mobile interaction problems.

---

# 31. Arabic RTL Audit

Test real Arabic content.

Check:

* Header
* Navigation
* Sidebar
* Product cards
* Forms
* Tables
* Dialogs
* Breadcrumbs
* Pagination
* Status badges
* Icons
* Arrows
* Charts

Look for incorrect directional behavior.

Fix actual RTL defects.

---

# 32. English LTR Audit

Switch to English and verify:

* Layout
* Typography
* Spacing
* Navigation
* Tables
* Forms
* Dialogs
* Product cards

Ensure RTL fixes did not break LTR.

---

# 33. Form Audit

Audit every major form.

Check:

* Required fields
* Validation
* Input types
* Error messages
* Server errors
* Loading
* Disabled state
* Success
* Duplicate submission

Forms include:

* Login
* Registration
* Product create
* Product edit
* Category
* Brand
* Coupon
* Checkout
* Address
* Profile
* Admin settings where supported

---

# 34. Loading State Audit

Every API-dependent screen must have a proper loading state.

Look for:

* Blank screens
* Layout jumps
* Frozen controls
* Duplicate loaders
* Full-page loaders where unnecessary

Use skeletons where appropriate.

---

# 35. Empty State Audit

Verify useful empty states for:

* Products
* Search
* Cart
* Wishlist
* Orders
* Customers
* Reviews
* Coupons
* Notifications
* Audit logs
* Inventory

Every empty state should tell the user what happened and what to do next where appropriate.

---

# 36. Error State Audit

Test realistic failures.

Examples:

* API unavailable
* Unauthorized
* Forbidden
* Validation failure
* Invalid ID
* Network failure
* Empty response

Ensure safe user-facing messages.

Never expose:

* Stack traces
* SQL
* Internal filesystem paths
* Secrets
* Tokens

---

# 37. Console and Runtime Audit

Inspect browser runtime behavior.

Fix:

* Console errors
* React warnings
* Missing keys
* Unhandled promises
* Runtime exceptions
* Broken network requests caused by frontend bugs
* Invalid HTML
* Broken event handlers

Do not suppress warnings.

---

# 38. API Integration Audit

For every major frontend service:

Verify:

* Correct endpoint
* Correct HTTP method
* Correct payload
* Correct authentication
* Correct response handling
* Correct error handling
* Correct state update

Look for:

* Duplicate requests
* Incorrect payloads
* Stale state
* Race conditions
* Missing refresh
* Incorrect optimistic updates

Fix genuine issues.

---

# 39. State Consistency

Verify that mutations propagate across the application.

Examples:

* Product inventory update → Product list reflects it.
* Product status update → Storefront reflects it where appropriate.
* Order status update → Dashboard and order details reflect it.
* Coupon change → Coupon state is consistent.
* Review moderation → Review status updates.
* Category changes → Product selectors update.

Avoid stale UI state.

---

# 40. Data Persistence Audit

After each important mutation:

1. Perform action.
2. Wait for success.
3. Reload the relevant page.
4. Verify persisted server state.

Do not consider local React state proof of persistence.

---

# 41. Security Integration Audit

This stage is NOT an offensive security test.

It is a defensive application-integration review.

Verify that frontend behavior correctly respects:

* Authentication
* Authorization
* Security Registry
* Global Security Guard
* Ownership protection
* CSRF
* Rate limiting
* Audit logging
* Error handling
* Server validation
* Idempotency

Do not bypass controls to make tests pass.

---

# 42. Sensitive Data Audit

Review frontend responses and rendered UI for accidental exposure of:

* Passwords
* Password hashes
* JWTs
* Session tokens
* API keys
* Webhook secrets
* Payment secrets
* Full payment credentials
* Internal security metadata
* Unnecessary private customer data

Fix safe frontend exposure issues.

If the source is backend/API behavior, document the issue and apply the smallest secure correction if appropriate.

---

# 43. Accessibility Audit

Review:

* Semantic HTML
* Keyboard navigation
* Focus management
* Form labels
* Error association
* Dialog accessibility
* Dropdown accessibility
* Button semantics
* Table accessibility
* Image alt text
* Contrast

Fix genuine issues.

---

# 44. Performance Audit

Review:

* Initial page load
* Large images
* Duplicate requests
* Large bundles
* Unnecessary rerenders
* Excessive client-side filtering
* Unnecessary data loading
* Layout shifts

Fix clear performance problems without introducing unnecessary complexity.

---

# 45. Dependency Audit

Inspect frontend/backend dependencies.

Look for:

* Unused dependencies
* Duplicate dependencies
* Clearly unnecessary packages
* Known problematic configuration

Do not remove a dependency unless confirmed unused.

Do not upgrade major dependencies blindly.

---

# 46. Code Quality Audit

Inspect for:

* Duplicate components
* Dead code
* Unused imports
* Inconsistent naming
* Unsafe casts
* `any` abuse
* Repeated API logic
* Repeated UI logic
* Hardcoded fake values
* Debug code
* Temporary development code

Fix safe issues.

Do not perform unnecessary architecture rewrites.

---

# 47. Fake Data Audit

Search the application for:

* Hardcoded product counts
* Hardcoded revenue
* Fake orders
* Fake customer counts
* Placeholder analytics presented as real
* Mock payment states
* Fake inventory
* Fake notifications

Remove or clearly isolate any fake data that could be mistaken for real production data.

---

# 48. Business Logic Boundary Audit

Verify the frontend does NOT become authoritative for:

* Product price at checkout
* Discount validity
* Coupon validity
* Shipping total
* Tax total
* Inventory availability
* Payment state
* Order state

Frontend may display values.

Backend must remain authoritative.

---

# 49. Browser Compatibility

Check the application for obvious browser compatibility problems.

At minimum consider:

* Chromium-based desktop
* Mobile browser behavior
* Touch interactions
* Responsive CSS
* Dialog behavior
* Fixed/sticky elements

Do not introduce browser-specific hacks without justification.

---

# 50. Visual Regression Mindset

Compare related screens for consistency.

Examples:

* Product cards across homepage/catalog/details.
* Buttons across storefront/admin.
* Forms across authentication/admin.
* Status badges across orders/inventory/reviews.
* Tables across admin sections.
* Dialogs across admin workflows.

Fix inconsistencies.

---

# 51. End-to-End Business Workflow

Perform a realistic complete customer workflow:

`Browse → Search → Product → Add to Cart → Cart → Checkout → Payment → Order → Tracking`

Where payment sandbox/test functionality exists, use only the safe test environment.

Do not use real payment credentials.

---

# 52. End-to-End Admin Workflow

Perform:

`Admin Login → Dashboard → Products → Create/Edit → Inventory → Orders → Customer → Coupon → Review → Payment → Audit`

Use real test/local data.

Verify that each mutation persists.

---

# 53. Regression Testing

Ensure changes made during this prompt do not break:

* Authentication
* Storefront
* Cart
* Checkout
* Orders
* Admin
* Product Management
* Security middleware

Run all existing tests.

---

# 54. Automated Quality Gate

Run applicable commands.

At minimum:

* Frontend lint
* Frontend typecheck
* Backend lint
* Backend typecheck
* Frontend build
* Backend build
* Backend tests

If frontend tests exist, run them.

If additional test suites exist, run them.

Record exact results.

---

# 55. Fix-and-Retest Requirement

This is mandatory.

If any issue is found:

1. Document the issue internally.
2. Fix it.
3. Rerun the relevant validation.
4. Continue auditing.

After all fixes:

Run the complete quality gate again.

Do not report success based on a validation run that happened before the final fixes.

---

# 56. Definition of Done

Prompt 35 is complete only when:

1. Full storefront has been audited.
2. Full Admin has been audited.
3. All major routes were reviewed.
4. Navigation was tested.
5. Storefront workflows were tested.
6. Admin workflows were tested.
7. Product workflows were tested.
8. Order workflows were tested.
9. Customer workflows were tested.
10. Inventory workflows were tested.
11. Coupon workflows were tested.
12. Review workflows were tested.
13. Payment UI was reviewed.
14. Audit Logs were reviewed.
15. Forms were audited.
16. Loading states were audited.
17. Empty states were audited.
18. Error states were audited.
19. Responsive layouts were tested.
20. Mobile UX was tested.
21. Arabic RTL was tested.
22. English LTR was tested.
23. Accessibility was reviewed.
24. Runtime console errors were reviewed.
25. API integration was reviewed.
26. State consistency was reviewed.
27. Data persistence was verified.
28. Security integration was reviewed.
29. Sensitive data exposure was reviewed.
30. Performance was reviewed.
31. Dependencies were reviewed.
32. Code quality was reviewed.
33. Fake data/functionality was reviewed.
34. Business-logic boundaries were reviewed.
35. Realistic end-to-end workflows were tested.
36. Issues found were fixed where appropriate.
37. Complete validation was rerun after fixes.
38. No avoidable critical UI/runtime defects remain.
39. Final report was created.

---

# 57. Final Report

Create:

`Antigravity_Prompts/35_Full_Storefront_Admin_QA_Audit_Report.md`

Include:

## Executive Summary

## Overall Application Quality

## Route Inventory

## Navigation Audit

## Storefront Audit

## Homepage

## Catalog

## Product Details

## Cart

## Wishlist

## Authentication

## Checkout

## Orders & Tracking

## Account

## Admin Dashboard

## Product Management

## Categories

## Brands

## Inventory

## Orders Management

## Customers

## Coupons

## Reviews

## Payments

## Notifications

## Audit Logs

## Settings

## Responsive / Mobile

## Arabic RTL

## English LTR

## Forms

## Loading States

## Empty States

## Error States

## Runtime / Console

## API Integration

## State Consistency

## Data Persistence

## Security Integration

## Sensitive Data

## Accessibility

## Performance

## Dependency Review

## Code Quality

## Fake Data Review

## Business Logic Boundary

## End-to-End Workflows

## Bugs Found

For each genuine issue:

* Severity
* Area
* Description
* Root cause
* Fix

## Bugs Fixed

## Remaining Issues

Only document genuine unresolved issues.

## Automated Validation

Record exact results:

* Frontend tests
* Backend tests
* Frontend lint
* Backend lint
* Frontend typecheck
* Backend typecheck
* Frontend build
* Backend build

## Final Status

Use:

`COMPLETED`

or

`COMPLETED WITH DOCUMENTED LIMITATIONS`

---

# Critical Constraints

* Execute only Prompt 35.
* Do not start Prompt 36.
* Do not create fake data.
* Do not create fake functionality.
* Do not bypass authentication.
* Do not bypass authorization.
* Do not weaken security.
* Do not expose secrets.
* Do not expose passwords or password hashes.
* Do not expose payment credentials.
* Do not make frontend financial logic authoritative.
* Do not make frontend inventory logic authoritative.
* Do not remove working functionality.
* Do not rewrite the entire application unnecessarily.
* Do not perform destructive production testing.
* Do not use real payment credentials.
* Do not perform offensive security testing.
* Do not consider build success sufficient.
* Perform actual workflow validation.
* Verify persistence after mutations.
* Verify responsive behavior.
* Verify Arabic RTL and English LTR.
* Fix genuine issues discovered.
* Rerun complete validation after fixes.
* Create the final report.
* Stop after Prompt 35 is complete.
