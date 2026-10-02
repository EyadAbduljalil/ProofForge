# Prompt 55 — Complete Dynamic System, Synchronization, Functional, Security & Production Integrity Audit

## MISSION

Perform the most comprehensive audit of the entire ecommerce platform.

The objective is to determine whether the store is genuinely:

* Fully dynamic where business data must be dynamic
* Fully synchronized across frontend, backend, database, and admin
* Functionally complete
* Free of broken buttons and dead controls
* Free of fake/static business data
* Free of stale or duplicated state
* Free of business logic inconsistencies
* Free of critical/high security vulnerabilities
* Free of broken API flows
* Free of broken database persistence
* Free of frontend/backend synchronization defects
* Free of race conditions where applicable
* Free of broken CRUD operations
* Free of broken admin controls
* Free of broken storefront controls
* Free of fake success states
* Free of mock/demo data in production-facing functionality
* Free of hardcoded business configuration that should be database/admin controlled
* Free of orphaned or unused business functionality
* Free of broken cross-system workflows
* Free of runtime errors
* Free of build/type/lint errors
* Free of obvious production-readiness defects

This is NOT a superficial code review.

This is a **full-system verification, remediation, and repeated re-verification process**.

The final goal is not merely to find problems.

The final goal is to reach a verified state where every important business capability has a valid and traceable flow:

**Frontend → API → Authentication/Authorization → Business Logic → Database → Persistence → Response → Frontend State → Admin/Storefront Synchronization**

---

# 1. MANDATORY ANTIGRAVITY EXECUTION PROTOCOL

Before doing any work:

1. Create:

`Antigravity_Prompts/55_Complete_Dynamic_System_Integrity_Audit.md`

2. Write this entire prompt into that file.

3. Read the Markdown file completely.

4. Execute ONLY from the Markdown file.

5. Do not execute directly from the chat message.

6. Inspect the complete repository before making changes.

7. Review all relevant previous prompts and reports, especially:

* Prompts 25–30 — Security
* Prompts 31–36 — Storefront/Admin/Production
* Prompt 41 — LMS Admin Feature Extraction
* Prompt 42 — Final Security Verification
* Prompt 43 — Storefront UI/Product Images/Admin Content Control
* Prompt 44 — Original Human-Crafted Design
* Prompt 45 — Business Logic Fixes
* Prompt 46 — Business Logic Retest
* Prompt 47 — Admin Functional Reconstruction
* Prompt 48 — Complete Admin Commerce Operations
* Prompt 49 — Admin Visual UX
* Prompt 50 — Admin Functional Completion
* Prompt 51 — Creative Homepage
* Prompt 52 — Premium Storefront Style
* Prompt 53 — Elegant Minimal Homepage
* Prompt 54 — Reference-Style Homepage

8. Read their execution reports where available.

9. Compare the current repository against those previous claims.

10. Never assume a previous report is still correct.

11. Treat the current repository as the source of truth.

12. Do not ask the user for approval between audit, planning, remediation, and retest cycles.

13. Continue the audit/remediation loop automatically.

14. Do not automatically start Prompt 56.

15. Stop only when the final exit criteria in this prompt are satisfied or when a genuine external/configuration blocker prevents verification.

---

# 2. CRITICAL PRINCIPLE — DO NOT CONFUSE STATIC UI WITH STATIC BUSINESS DATA

The objective is NOT to make every line of frontend code dynamic.

Static code is acceptable for:

* Layout
* Components
* Typography
* Icons
* Design tokens
* Accessibility structure
* Navigation shell
* Reusable UI logic
* Error/loading components
* General presentation rules

However, business data that should be controlled by the backend/database/admin MUST NOT be hardcoded in the frontend.

Examples of data that should normally be dynamic:

* Products
* Prices
* Discounts
* Inventory
* Categories
* Brands
* Hero slides
* Promotional banners
* Homepage sections
* Product ordering
* Category ordering
* Storefront visibility
* Coupons
* Orders
* Customers
* Reviews
* Payments
* Returns
* Refunds
* Notifications
* Operational settings
* Business rules where configuration is intended
* Delivery configuration where supported
* Store policies where intended to be admin-managed
* Product metadata
* Availability
* Sales-derived information
* Dashboard KPIs
* Admin operational metrics

Do not force unnecessary database models for static presentation concerns.

The audit must distinguish:

### ACCEPTABLE STATIC

Static UI/presentation logic.

### SUSPICIOUS STATIC

Business content hardcoded for convenience.

### INVALID STATIC

Business data that should come from the backend/database/admin.

---

# 3. CREATE A COMPLETE SYSTEM INVENTORY

Before fixing anything, inventory the entire system.

Inspect:

## Frontend

* All routes
* All pages
* All components
* All hooks
* All services
* All API clients
* All state management
* All forms
* All buttons
* All links
* All dialogs
* All drawers
* All dropdowns
* All tables
* All filters
* All pagination
* All carousels
* All homepage sections
* All product components
* All admin components
* All loading states
* All error states
* All empty states

## Backend

* Server
* Middleware
* Routes
* Controllers
* Services
* Validators
* Authentication
* Authorization
* Security middleware
* Rate limiting
* CSRF
* Idempotency
* Audit logging
* Threat detection
* Error handling
* Payment services
* Email services
* Notification services
* Inventory logic
* Coupon logic
* Order logic
* Return/refund logic
* Admin logic

## Database

* Prisma schema
* Relations
* Constraints
* Indexes
* Unique constraints
* Enums
* Nullable fields
* Cascades
* Soft deletes
* Transaction boundaries
* Migration history

## Infrastructure

* Environment configuration
* Redis
* Queues
* Sentry
* Logging
* Health checks
* Graceful shutdown
* CORS
* Cookies
* Security headers

---

# 4. BUILD A MASTER FUNCTIONALITY MATRIX

Create an internal matrix for every meaningful functionality.

For each feature record:

| Feature | Frontend | API | Auth | Authorization | Business Logic | DB | Persistence | Audit | Sync | Runtime Status |
| ------- | -------- | --- | ---- | ------------- | -------------- | -- | ----------- | ----- | ---- | -------------- |

Do this for every important feature.

A feature is NOT considered functional merely because a button exists.

For example:

`Delete Product`

must trace:

Button

→ Handler

→ API request

→ Authentication

→ Authorization

→ Validation

→ Controller

→ Service/business logic

→ Database mutation

→ Transaction if required

→ Audit log

→ API response

→ Frontend state refresh

→ Storefront consistency

If any important link is missing, classify it as defective.

---

# 5. DYNAMIC DATA AUDIT

Search the entire project for hardcoded business data.

Inspect:

* Product names
* Product prices
* Product images
* Product IDs
* Categories
* Brand names
* Discounts
* Ratings
* Inventory quantities
* Hero content
* Banner content
* Homepage sections
* Navigation categories
* Promotions
* Coupon values
* Dashboard numbers
* Order counts
* Customer counts
* Revenue
* Payment statuses
* Return statuses
* Delivery statuses
* Store settings

Search for patterns such as:

* hardcoded arrays
* mock products
* demoProducts
* sampleProducts
* fakeProducts
* static categories
* hardcoded prices
* hardcoded discounts
* fake ratings
* fake order counts
* fake dashboard KPIs
* placeholder customer data
* mock API responses
* static JSON used as production data
* localStorage used as a substitute for server persistence
* sessionStorage used as a substitute for persistence
* frontend-only state pretending to be database state

Every finding must be classified.

---

# 6. DYNAMIC STOREFRONT AUDIT

Verify that the entire storefront is driven by actual backend state.

Audit:

### Header

* Logo
* Navigation
* Categories
* Search
* Account
* Wishlist
* Cart
* Language

### Homepage

* Hero
* Hero slides
* Promotions
* Categories
* Featured products
* Best sellers
* Offers
* New arrivals
* Brands
* Curated sections
* Trust information

### Product listing

* Products
* Filters
* Sort
* Pagination
* Search
* Category
* Brand
* Price
* Availability

### Product details

* Product
* Images
* Price
* Discount
* Inventory
* Variants
* Reviews
* Related products

### Cart

* Products
* Quantities
* Availability
* Prices
* Discounts
* Totals

### Checkout

* Customer
* Address
* Shipping
* Payment
* Coupon
* Final total

### Orders

* Status
* Items
* Prices
* Payment
* Tracking
* Returns
* Refunds

Nothing that represents live business data should silently come from stale hardcoded frontend state.

---

# 7. ADMIN → DATABASE → STOREFRONT SYNCHRONIZATION

This is one of the most important parts of the audit.

For every admin mutation verify:

Admin UI

→ API

→ Authorization

→ Validation

→ Business Logic

→ Database

→ Response

→ Frontend refresh/revalidation

→ Storefront reflects change

Test examples:

## Product

Admin creates product

→ product appears in database

→ product appears in storefront

Admin edits price

→ database changes

→ product page changes

→ product listing changes

→ homepage changes where applicable

Admin archives product

→ product disappears from storefront

## Category

Admin creates category

→ category appears in navigation

→ category page works

Admin reorders category

→ storefront order changes

Admin hides category

→ category disappears from visible storefront navigation

## Homepage

Admin changes Hero

→ persisted

→ storefront updates

Admin changes section order

→ persisted

→ storefront updates

Admin changes section products

→ persisted

→ storefront updates

## Inventory

Admin changes inventory

→ database updates

→ product availability updates

→ cart behavior updates

→ checkout behavior updates

## Coupon

Admin creates coupon

→ checkout can use it

Admin disables coupon

→ checkout rejects it

## Order

Order status changes in admin

→ customer order state updates

→ tracking updates

→ permitted transitions enforced

Every cross-system flow must be verified.

---

# 8. STALE STATE AUDIT

Search for synchronization problems caused by:

* React state not being refreshed
* stale query caches
* stale localStorage
* stale sessionStorage
* duplicated state
* optimistic updates without reconciliation
* failed mutations leaving incorrect UI state
* browser refresh showing different state
* multiple tabs becoming inconsistent
* duplicate API requests
* missing cache invalidation
* incorrect cache keys
* race conditions
* stale product inventory
* stale cart totals
* stale coupon state
* stale order state

For every mutation determine:

1. What changed?
2. Where is the authoritative source?
3. How does the frontend learn about the change?
4. What happens after refresh?
5. What happens after another request?
6. What happens in another browser tab?
7. What happens if the request fails?
8. What happens if the request succeeds but response processing fails?

---

# 9. SERVER AUTHORITY AUDIT

The server must remain authoritative for:

* Prices
* Discounts
* Coupons
* Inventory
* Order totals
* Shipping costs
* Payment status
* Refund amounts
* Return eligibility
* Product availability
* Authorization
* Role permissions

The frontend must never be trusted to determine financial/business truth.

Test for:

* client-side price manipulation
* quantity manipulation
* discount manipulation
* coupon manipulation
* shipping manipulation
* payment-status manipulation
* order-status manipulation
* inventory manipulation
* admin-role manipulation

---

# 10. AUTHENTICATION AUDIT

Verify:

* Registration
* Login
* Logout
* JWT handling
* Refresh/session behavior where implemented
* HttpOnly cookies
* Secure cookie configuration
* SameSite
* Token expiration
* Password hashing
* Password reset
* Session invalidation
* Unauthorized access
* Account ownership

Test:

* expired token
* invalid token
* missing token
* tampered token
* unauthorized user
* authenticated non-admin
* admin
* different admin roles

---

# 11. AUTHORIZATION / RBAC AUDIT

Verify authorization at the backend.

Do NOT trust frontend route hiding.

Test:

* customer accessing another customer's order
* customer accessing another customer's address
* customer accessing another customer's wishlist
* customer accessing another customer's return
* customer accessing admin APIs
* lower-level admin accessing restricted operations
* unauthorized product mutations
* unauthorized coupon mutations
* unauthorized refund operations
* unauthorized settings changes
* unauthorized audit log access

Verify:

* RBAC
* ownership checks
* BOLA/IDOR protection
* global security guard
* security registry
* ownership guard

---

# 12. SECURITY AUDIT

Perform a defensive security audit.

Check:

* SQL injection
* Prisma query safety
* NoSQL-style injection where relevant
* XSS
* CSRF
* SSRF
* path traversal
* unsafe file access
* malicious uploads
* mass assignment
* prototype pollution where relevant
* command injection
* open redirects
* authentication bypass
* authorization bypass
* IDOR/BOLA
* rate-limit bypass
* sensitive data exposure
* stack traces
* secret exposure
* unsafe logging
* payment webhook attacks
* replay attacks
* duplicate requests
* brute force
* credential stuffing
* privilege escalation

Do NOT attack external systems.

Do NOT test production.

Do NOT use real credentials.

Do NOT perform destructive exploitation.

Use local/test environment and safe verification only.

---

# 13. PAYMENT SECURITY AUDIT

Verify:

* payment intent creation
* amount calculated server-side
* order association
* payment status
* webhook signature verification
* webhook idempotency
* replay protection
* duplicate webhook handling
* payment/order consistency
* refund consistency
* failed payment behavior
* successful payment behavior

Never trust:

* client amount
* client payment status
* client order status

If a real provider requires configuration that is unavailable:

classify it as:

`CONFIGURATION REQUIRED`

Do not falsely declare it verified.

---

# 14. ORDER STATE MACHINE AUDIT

Verify the actual state machine.

Expected business transitions must be explicit and validated.

For example:

`PENDING → PAID → PROCESSING → SHIPPED → DELIVERED`

Verify:

* invalid transitions rejected
* side effects attached to correct transitions
* payment status consistency
* inventory consistency
* notification consistency
* tracking consistency
* return eligibility consistency

Test invalid transitions such as:

* DELIVERED → PENDING
* SHIPPED → PAID
* CANCELLED → SHIPPED
* PENDING → DELIVERED

where business rules do not permit them.

---

# 15. INVENTORY AUDIT

This is a critical domain.

Determine the exact inventory lifecycle.

Verify:

* stock quantity
* reserved quantity
* cart reservation if supported
* checkout
* payment
* order confirmation
* shipping
* cancellation
* return
* refund
* restock

Ensure stock is not deducted twice.

Ensure stock is not restored incorrectly.

Ensure reservation is released correctly.

Test concurrent purchases.

Test:

* quantity 1
* quantity equal to stock
* quantity greater than stock
* two users buying final item
* failed payment
* repeated payment callback
* cancellation
* return
* refund

Establish one authoritative inventory lifecycle.

---

# 16. COUPON AUDIT

Verify:

* expiration
* activation
* minimum order
* maximum discount
* usage limit
* per-user usage
* concurrency
* duplicate application
* order cancellation
* refund
* usage counters

Ensure coupon usage is transactional where required.

Test two simultaneous requests using the final available coupon usage.

---

# 17. CART AUDIT

Verify:

* inactive product rejection
* archived product rejection
* insufficient inventory rejection
* quantity validation
* price recalculation
* coupon recalculation
* cart persistence
* guest cart if supported
* authenticated cart
* duplicate requests
* refresh persistence

The cart must not become a source of business truth.

---

# 18. RETURN / REFUND AUDIT

Clearly separate:

### Return Request

Customer asks to return.

### Return Approval

Admin/business process approves.

### Refund

Money is returned.

### Restock

Inventory is restored only according to actual business rules.

Do NOT treat these as one operation unless the business model explicitly requires it.

Verify:

* return window
* delivered date anchor
* boundary conditions
* return status
* approval
* rejection
* refund
* restock
* duplicate refund prevention
* payment provider consistency
* audit log

---

# 19. PRODUCT LIFECYCLE AUDIT

Verify:

* create
* edit
* publish
* unpublish
* archive
* restore
* delete where legitimately allowed
* category assignment
* brand assignment
* image management
* pricing
* inventory
* visibility

Ensure archived/inactive products cannot accidentally appear in customer-facing flows.

---

# 20. CATEGORY / BRAND AUDIT

Verify:

* CRUD
* soft delete/archive
* restoration where supported
* product associations
* storefront visibility
* ordering
* admin management
* navigation
* listing
* SEO URLs/slugs
* duplicate prevention

Do not automatically disable products merely because a category is archived unless the business rule explicitly requires it.

---

# 21. CUSTOMER AUDIT

Verify:

* registration
* profile
* addresses
* orders
* wishlist
* reviews
* returns
* account security

Ensure customers cannot access another customer's resources.

---

# 22. REVIEW AUDIT

Verify:

* product ownership/purchase eligibility
* duplicate reviews
* review editing/deletion
* rating validation
* moderation
* visibility
* admin management

Do not fabricate ratings.

---

# 23. NOTIFICATION / EMAIL AUDIT

Verify actual triggers.

Examples:

* registration
* order creation
* payment
* order processing
* shipping
* delivery
* return
* refund
* security events

Ensure failed notification delivery does not incorrectly mark the business operation as failed unless explicitly designed that way.

Check queue behavior where implemented.

---

# 24. ADMIN FUNCTIONALITY AUDIT

Inspect every admin page.

For every button:

* What should it do?
* Does it have a handler?
* Does the handler call the correct API?
* Does the API exist?
* Does the backend perform the action?
* Does the database change?
* Is authorization enforced?
* Is audit logging required?
* Does the UI refresh?
* Does the action survive browser refresh?

Remove or implement every dead control.

Find:

* empty onClick
* TODO
* FIXME
* console.log-only action
* fake success toast
* mocked mutation
* static toggle
* fake pagination
* fake filter
* fake search
* fake status change
* commented API calls
* disabled controls without legitimate reason

---

# 25. ADMIN DASHBOARD KPI AUDIT

Every KPI must come from real data.

Verify:

* revenue
* orders
* customers
* products
* low stock
* pending orders
* returns
* refunds
* payments
* operational alerts

No fabricated metrics.

No hardcoded numbers.

No misleading charts.

Every metric must have an identifiable backend/data source.

---

# 26. SEARCH AUDIT

Verify:

* product search
* category search
* brand search where supported
* Arabic
* English
* partial matches
* no results
* pagination
* sorting
* filters
* search persistence
* URL/query state where appropriate

Search results must reflect current database state.

---

# 27. FILTER / SORT / PAGINATION AUDIT

Verify that every visible filter actually affects the query.

Test:

* category
* brand
* price
* rating
* availability
* search
* sorting
* pagination

Check that frontend filtering is not merely cosmetic when server-side filtering is required.

---

# 28. IMAGE / MEDIA AUDIT

Inventory all product/storefront images.

Determine:

* source
* mapping
* whether image is real
* whether image is relevant
* whether image is broken
* whether image is duplicated
* whether image is unused
* whether image is hardcoded to incorrect business data

Do NOT assume every static image is a defect.

Classify:

* legitimate static asset
* real product asset
* admin-uploaded asset
* generated/demo asset
* orphaned asset
* incorrectly mapped asset

Any AI-generated image used as fake product/business data must be flagged.

Do not silently replace legitimate static UI assets.

---

# 29. HOMEPAGE AUDIT

Verify every homepage section.

For each section determine:

* source of data
* API
* database model
* admin control
* persistence
* visibility
* ordering
* product mapping
* category mapping
* image mapping
* error state
* empty state
* loading state

A homepage section is only considered dynamic if changing its underlying data actually changes the storefront after persistence/revalidation.

---

# 30. FRONTEND STATE ARCHITECTURE AUDIT

Search for duplicated sources of truth.

Examples:

Database product

*

hardcoded product

*

localStorage product

*

React product

This is dangerous.

Determine the authoritative source for each domain.

Prefer:

**Database → Backend API → Frontend state**

The frontend may cache data, but cache must be treated as a representation of backend state, not an independent business authority.

---

# 31. API CONTRACT AUDIT

Create a complete API matrix:

| Endpoint | Method | Auth | Role | Validation | Business Logic | DB | Response | Error Handling | Idempotency |
| -------- | ------ | ---- | ---- | ---------- | -------------- | -- | -------- | -------------- | ----------- |

Verify every frontend API call.

Find:

* frontend calls to nonexistent endpoints
* endpoints with no frontend consumer
* mismatched payloads
* mismatched response shapes
* wrong HTTP methods
* missing authentication
* missing authorization
* inconsistent errors
* undocumented required fields
* silent failures

---

# 32. DATABASE INTEGRITY AUDIT

Inspect Prisma schema for:

* missing constraints
* missing unique fields
* nullable business-critical fields
* incorrect relations
* orphaned records
* incorrect cascade behavior
* missing indexes
* duplicate records
* inconsistent enum states
* missing transaction boundaries
* monetary precision problems
* concurrency problems

Money must use appropriate precise representation.

Do not use unsafe floating-point arithmetic for authoritative financial values.

---

# 33. TRANSACTION AUDIT

Identify multi-step business operations.

Examples:

* checkout
* coupon usage
* order creation
* payment confirmation
* inventory mutation
* refund
* return
* category archive
* bulk admin actions

Determine where transactions are required.

Ensure partial failure does not leave inconsistent state.

---

# 34. CONCURRENCY AUDIT

Test race conditions for:

* inventory
* coupon usage
* payment webhook
* order state
* refunds
* duplicate checkout
* duplicate admin actions

Simulate safe local concurrent requests.

Verify:

* atomic updates
* transactions
* unique constraints
* idempotency keys
* state checks

---

# 35. ERROR HANDLING AUDIT

Every important operation must handle:

* validation error
* authentication error
* authorization error
* not found
* conflict
* business rule rejection
* database error
* external service failure
* timeout

Frontend must not display fake success when the backend failed.

Backend must not expose:

* stack traces
* database internals
* secrets
* tokens
* sensitive user information

---

# 36. LOADING / ERROR / EMPTY STATE AUDIT

Every dynamic component must have appropriate states.

Verify:

### Loading

Correct skeleton/spinner.

### Empty

Meaningful empty state.

### Error

Recoverable error.

### Success

Actual confirmed success.

No fake states.

---

# 37. REAL-TIME / REVALIDATION AUDIT

Determine which information needs:

* immediate revalidation
* polling
* event-driven updates
* WebSocket/SSE if actually implemented
* manual refresh
* cache invalidation

Do NOT force real-time infrastructure everywhere.

Instead determine the correct consistency model per domain.

For example:

Inventory and payment state may require stronger consistency than static marketing content.

Document the expected consistency model for each important domain.

---

# 38. MULTI-TAB / REFRESH CONSISTENCY

Test:

1. Open store in browser tab A.
2. Change relevant data in tab B/admin.
3. Refresh/revalidate tab A.
4. Verify correct state.

Test:

* product price
* inventory
* wishlist
* cart
* order
* storefront content
* admin changes

---

# 39. SECURITY REGRESSION

Re-run the security architecture created in previous prompts.

Verify:

* global security guard
* security registry
* ownership guard
* RBAC
* rate limiting
* CSRF
* CORS
* Helmet
* request correlation
* audit logging
* threat detection
* error handler
* idempotency
* secure cookies
* environment validation
* payment webhook protection

Do not assume previous security reports remain valid.

---

# 40. PRODUCTION CONFIGURATION AUDIT

Inspect:

* `.env`
* `.env.example`
* production environment validation
* secret handling
* CORS
* cookies
* proxy trust
* logging
* Sentry
* Redis
* payment configuration
* webhook secret
* database configuration
* shutdown handling
* health checks

Never place real secrets into the repository.

Never invent credentials.

---

# 41. DEPENDENCY AUDIT

Check:

* npm audit
* outdated critical dependencies
* vulnerable packages
* duplicate dependencies
* unused dependencies
* unnecessary packages

Do not blindly upgrade packages if doing so creates regression risk.

---

# 42. CODE QUALITY AUDIT

Search for:

* TODO
* FIXME
* HACK
* mock
* demo
* placeholder
* fake
* sample
* test-only code
* commented production logic
* dead code
* unused imports
* unreachable code
* duplicate services
* duplicate API implementations

Every finding must be classified rather than blindly removed.

---

# 43. RUNTIME AUDIT

Run the application.

Inspect:

* browser console
* server logs
* API requests
* API failures
* network errors
* broken images
* runtime exceptions
* hydration errors
* infinite requests
* duplicate requests
* unexpected redirects
* failed navigation

Do not rely only on compilation.

---

# 44. FULL USER JOURNEY TESTING

Test complete workflows.

## Customer

Registration

→ Login

→ Browse

→ Search

→ Product

→ Wishlist

→ Cart

→ Coupon

→ Checkout

→ Payment

→ Order

→ Tracking

→ Return

→ Refund

## Admin

Login

→ Dashboard

→ Product

→ Category

→ Brand

→ Inventory

→ Order

→ Payment

→ Customer

→ Coupon

→ Review

→ Return

→ Refund

→ Storefront Management

→ Notifications

→ Audit

→ Security

→ System Health

Every journey must work end-to-end.

---

# 45. FAILURE PATH TESTING

Do not test only happy paths.

Test:

* invalid input
* expired coupon
* inactive product
* insufficient inventory
* unauthorized access
* duplicate request
* duplicate webhook
* payment failure
* database failure
* external service failure
* invalid state transition
* expired return window
* already refunded order
* archived category
* archived product
* missing image
* empty search
* empty category
* empty storefront section

Verify graceful recovery.

---

# 46. AUTOMATED TEST COVERAGE

Inspect existing tests.

Determine what they actually prove.

Do NOT count a test as coverage merely because it exists.

Add tests where important business invariants are currently untested.

Prioritize:

* authentication
* authorization
* IDOR/BOLA
* prices
* coupons
* inventory
* order state machine
* payments
* refunds
* returns
* cart
* admin mutations
* storefront configuration
* synchronization
* concurrency
* idempotency

---

# 47. BUSINESS INVARIANTS

Define and test invariants such as:

### Inventory

Stock cannot become negative.

### Money

Order total must equal authoritative calculation.

### Coupon

Usage cannot exceed configured limits.

### Order

Invalid state transitions are rejected.

### Payment

Client cannot mark an order paid.

### Refund

Refund cannot exceed eligible amount.

### Ownership

Customer cannot access another customer's private resources.

### Product

Inactive products cannot enter new customer orders.

### Admin

Unauthorized roles cannot execute restricted operations.

### Storefront

Admin changes must persist before appearing as authoritative state.

---

# 48. FINDINGS CLASSIFICATION

Every issue must be classified:

### CRITICAL

* financial loss
* authentication bypass
* authorization bypass
* destructive data corruption
* severe inventory corruption
* payment integrity failure
* critical security vulnerability

### HIGH

* major broken business flow
* serious synchronization defect
* major admin functionality failure
* significant security weakness
* serious data inconsistency

### MEDIUM

* important feature defect
* moderate synchronization problem
* meaningful UX/functional issue

### LOW

* minor defect
* non-critical inconsistency

### INFORMATIONAL

* improvement
* technical debt
* optimization

### CONFIGURATION REQUIRED

Issue cannot be fully verified/fixed without legitimate external configuration.

---

# 49. FIRST AUDIT — DO NOT FIX YET

The FIRST pass must be an investigation.

Produce a complete internal findings inventory before making major changes.

For every finding record:

* ID
* Severity
* Domain
* Location
* Root cause
* Impact
* Reproduction
* Expected behavior
* Actual behavior
* Dependencies
* Proposed fix
* Files affected
* Database impact
* API impact
* Security impact
* Regression risk
* Validation method

Then build a remediation plan ordered by:

1. Critical
2. High
3. Medium
4. Low
5. Informational

---

# 50. REMEDIATION PLAN

Before implementation, create a complete remediation strategy.

Group related fixes to avoid contradictory changes.

For each fix specify:

* exact problem
* root cause
* implementation approach
* affected files
* database migration if required
* API changes
* frontend changes
* test changes
* security considerations
* synchronization implications
* rollback considerations
* validation criteria

Do not make random incremental edits without understanding dependencies.

---

# 51. IMPLEMENT THE PLAN

Implement the remediation plan.

Rules:

* preserve working functionality
* do not rewrite working architecture unnecessarily
* do not introduce fake functionality
* do not introduce mock data
* do not bypass security
* do not weaken validation
* do not remove protections to make tests pass
* do not silence errors
* do not hide broken buttons
* do not replace backend truth with frontend state

If a database change is required:

* update Prisma schema
* create migration
* validate migration
* update backend
* update frontend
* add tests

---

# 52. FIRST RETEST

After remediation:

Run a complete retest.

Do NOT test only the files that were changed.

Re-run the entire audit scope.

This is mandatory because one fix can introduce another defect.

Check:

* dynamic data
* synchronization
* API
* DB
* business logic
* security
* admin
* storefront
* payments
* inventory
* orders
* frontend
* runtime

---

# 53. SECOND FINDINGS PLAN

If new findings exist:

Create a second remediation plan.

Classify every newly discovered issue.

Fix them.

Then retest the entire system again.

Do not stop merely because the original findings disappeared.

---

# 54. CONTINUOUS AUDIT / REMEDIATION LOOP

Repeat:

### AUDIT

↓

### FINDINGS

↓

### ROOT CAUSE ANALYSIS

↓

### REMEDIATION PLAN

↓

### IMPLEMENTATION

↓

### VALIDATION

↓

### FULL RETEST

↓

### NEW FINDINGS

↓

### REMEDIATION PLAN

↓

### IMPLEMENTATION

↓

### FULL RETEST

Continue until the exit criteria are satisfied.

The loop must continue automatically.

Do not ask the user for permission between cycles.

---

# 55. REGRESSION RULE

After every remediation cycle, test:

* previously fixed issues
* newly fixed issues
* unrelated critical workflows

A fix is not accepted until:

1. The original defect is fixed.
2. The business invariant passes.
3. Existing related workflows still pass.
4. No new Critical/High defect is introduced.

---

# 56. DYNAMIC SYSTEM DEFINITION

The system can only be declared dynamically correct when:

### Business Data

is persisted in the authoritative backend/database.

### Admin Changes

persist to the database.

### Storefront

reads current backend state.

### Refresh

does not revert changes.

### API

does not return stale hardcoded business data.

### Frontend State

does not override authoritative backend state incorrectly.

### Cross-System Changes

propagate correctly.

### Error Handling

does not leave frontend and backend in contradictory states.

---

# 57. SYNCHRONIZATION DEFINITION

For each domain define its consistency model.

Examples:

### Product

Admin update must persist and storefront must show updated data after revalidation.

### Inventory

Strong server authority and transaction-safe mutation.

### Payment

Webhook/provider state must be authoritative.

### Order

State machine must be authoritative.

### Storefront Content

Database configuration must be authoritative.

Do not require instantaneous real-time propagation where eventual consistency is acceptable.

The requirement is:

**Correct, predictable, documented synchronization.**

---

# 58. NO FAKE COMPLETION

Never report:

`PASSED`

because:

* build works
* TypeScript works
* page looks good
* tests pass

if dynamic/business synchronization has not been verified.

Never report:

`SECURE`

if a critical external configuration is missing.

Never report:

`FULLY DYNAMIC`

if hardcoded business data remains.

Never report:

`FULLY FUNCTIONAL`

if visible controls are broken.

---

# 59. FINAL STATIC BUSINESS DATA SCAN

At the end perform a final repository-wide scan for:

* hardcoded product data
* hardcoded categories
* hardcoded brands
* hardcoded prices
* hardcoded discounts
* hardcoded inventory
* fake ratings
* fake KPIs
* fake orders
* fake customers
* mock API responses
* placeholder business data
* production-facing demo data
* hardcoded storefront content
* hardcoded merchandising
* fake promotional claims

Every remaining match must be classified as:

`LEGITIMATE STATIC UI`

or

`REAL STATIC ASSET`

or

`TEST FIXTURE`

or

`DOCUMENTATION`

or

`INVALID BUSINESS DATA`

There must be **zero unresolved INVALID BUSINESS DATA findings**.

---

# 60. FINAL DEAD CONTROL SCAN

Perform a repository-wide scan for:

* empty onClick
* TODO actions
* FIXME actions
* console-only handlers
* fake success
* mock mutations
* disabled functionality
* unreachable admin controls
* links without destinations
* buttons without functionality
* API calls to nonexistent routes

There must be zero unresolved critical/high dead controls.

---

# 61. FINAL API / DATABASE CONSISTENCY SCAN

Verify:

Every important frontend API call has:

* real backend route
* correct method
* correct payload
* validation
* auth
* authorization
* business logic
* DB operation
* correct response
* error handling

Every important backend mutation has:

* actual DB persistence
* correct transaction behavior
* correct authorization
* audit where required
* frontend synchronization

---

# 62. FINAL BROWSER QA

Run the actual application.

Test:

### Desktop

1280 × 720

1440 × 900

### Mobile

320 × 844

390 × 844

414 × 896

Test both:

* Arabic RTL
* English LTR

Check:

* navigation
* search
* homepage
* products
* product details
* cart
* checkout
* account
* orders
* tracking
* admin
* every important admin mutation

Inspect:

* console
* network
* runtime errors
* broken assets
* failed requests
* layout overflow

---

# 63. FINAL AUTOMATED VALIDATION

Run all applicable:

## Frontend

* lint
* typecheck
* production build
* tests

## Backend

* lint
* typecheck
* production build
* tests

## Database

* Prisma validate
* migration validation

## Security

* npm audit
* secret scan

## Runtime

* browser QA

Fix all discovered problems.

Rerun validation.

---

# 64. FINAL SECURITY RETEST

After all functional remediation is complete, perform another defensive security verification.

Recheck:

* auth
* RBAC
* ownership
* IDOR/BOLA
* mass assignment
* SQL injection
* XSS
* CSRF
* CORS
* rate limiting
* payment webhook
* replay/idempotency
* error disclosure
* secrets
* uploads
* path traversal
* SSRF
* admin privilege escalation

No external systems.

No production.

No real credentials.

No destructive testing.

---

# 65. FINAL CROSS-SYSTEM CONSISTENCY TEST

Perform a final matrix test:

| Domain | Admin Change | DB Change | API Response | Storefront Change | Refresh Persists | Status |
| ------ | ------------ | --------- | ------------ | ----------------- | ---------------- | ------ |

Include at minimum:

* Product
* Category
* Brand
* Inventory
* Coupon
* Order
* Customer
* Review
* Return
* Refund
* Payment
* Hero
* Homepage sections
* Promotional content
* Notifications
* Settings

---

# 66. EXIT CRITERIA

The audit/remediation loop may stop ONLY when ALL applicable criteria are satisfied.

### Security

* 0 Critical
* 0 High
* No unresolved authorization bypass
* No unresolved financial security issue

### Business Logic

* 0 Critical
* 0 High
* Business invariants pass

### Dynamic Data

* 0 unresolved invalid hardcoded business data
* No fake production-facing business data

### Synchronization

* No unresolved critical/high synchronization defects
* Admin → DB → API → Storefront verified
* Refresh/revalidation verified

### Functionality

* No unresolved critical/high broken functionality
* No critical/high dead admin controls
* Important buttons/actions work end-to-end

### Database

* Prisma valid
* migrations valid
* integrity verified

### Frontend

* lint pass
* typecheck pass
* build pass

### Backend

* lint pass
* typecheck pass
* build pass
* tests pass

### Runtime

* no unresolved runtime errors
* no critical API failures
* no critical broken navigation
* no critical broken assets

### Security/Operations

* secret scan clean
* dependency audit reviewed
* production configuration issues explicitly documented

---

# 67. EXTERNAL CONFIGURATION RULE

If something cannot be verified because it requires legitimate external configuration:

Do NOT fabricate success.

Mark:

`CONFIGURATION REQUIRED`

Clearly document:

* what is missing
* why it matters
* where it must be configured
* how it should be validated later

Examples:

* payment webhook secret
* production payment credentials
* Redis production configuration
* Sentry DSN
* email provider credentials
* production domain
* external shipping provider

Configuration requirements must NOT be counted as code defects when the implementation itself is correct.

---

# 68. FINAL REPORTS

Create the following reports.

## Initial Audit Report

`Antigravity_Prompts/55_Initial_Audit_Report.md`

Include:

* system inventory
* dynamic data findings
* synchronization findings
* functionality findings
* security findings
* business logic findings
* database findings
* API findings
* admin findings
* storefront findings
* runtime findings
* severity matrix
* complete remediation plan

## Remediation Cycle Reports

For every remediation cycle create:

`Antigravity_Prompts/55_Remediation_Cycle_<N>_Report.md`

Include:

* findings addressed
* root causes
* changes made
* tests added
* regressions checked
* remaining findings

## Final Report

Create:

`Antigravity_Prompts/55_Complete_Dynamic_System_Integrity_Audit_Report.md`

Include:

# Executive Summary

# Repository Inventory

# Architecture Verification

# Dynamic Data Verification

# Frontend Verification

# Backend Verification

# Database Verification

# API Verification

# Admin Verification

# Storefront Verification

# Synchronization Verification

# Business Logic Verification

# Security Verification

# Payment Verification

# Inventory Verification

# Coupon Verification

# Order Verification

# Return/Refund Verification

# Notification Verification

# Search Verification

# Media/Image Verification

# Runtime Verification

# Performance Verification

# Accessibility Verification

# RTL/LTR Verification

# Automated Tests

# Lint

# Typecheck

# Build

# Prisma Validation

# Dependency Audit

# Secret Scan

# Browser QA

# Findings History

# Remediation Cycles

# Remaining Configuration Requirements

# Final Exit Criteria

# Final Status

---

# 69. FINAL STATUS

Use exactly one:

`SYSTEM FULLY VERIFIED — DYNAMIC, SYNCHRONIZED, FUNCTIONAL AND SECURE`

or

`SYSTEM VERIFIED WITH CONFIGURATION REQUIRED`

or

`SYSTEM VERIFICATION FAILED — REMEDIATION REQUIRED`

Use:

`SYSTEM FULLY VERIFIED — DYNAMIC, SYNCHRONIZED, FUNCTIONAL AND SECURE`

ONLY if every applicable exit criterion has genuinely passed.

Use:

`SYSTEM VERIFIED WITH CONFIGURATION REQUIRED`

when the code/system is verified but legitimate external configuration prevents complete verification.

Use:

`SYSTEM VERIFICATION FAILED — REMEDIATION REQUIRED`

if any Critical/High issue remains unresolved.

---

# 70. IMPORTANT — DO NOT HIDE REMAINING ISSUES

If the system cannot reach the exit criteria:

Do NOT:

* lower severity
* delete the feature
* hide the button
* disable the test
* weaken security
* bypass validation
* remove functionality
* fake successful API responses
* hardcode values
* mark configuration as complete
* claim the system is fully dynamic

Instead:

1. Document the issue.
2. Explain root cause.
3. Create remediation plan.
4. Attempt remediation.
5. Retest.
6. Report honestly if still unresolved.

---

# 71. STOP CONDITION

The process ends only after:

1. Initial full audit completed.
2. Complete findings inventory created.
3. Complete remediation plan created.
4. All possible remediation implemented.
5. Full retest completed.
6. New findings identified.
7. New remediation plans created where necessary.
8. Remediation/retest cycle repeated until exit criteria are satisfied.
9. Final dynamic-data scan completed.
10. Final synchronization scan completed.
11. Final functionality scan completed.
12. Final security retest completed.
13. Final browser QA completed.
14. All automated validation completed.
15. Final report created.

Then:

**STOP.**

Do NOT automatically execute Prompt 56 or any future prompt.
