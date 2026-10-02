# Prompt 56 — Independent Full System Verification With Complete Evidence Report

## EXECUTION MODE

You are performing an **independent, evidence-based, adversarial verification** of the entire ecommerce system.

This is NOT a documentation-only task.

You must:

1. Inspect the complete repository.
2. Inspect the existing implementation.
3. Inspect the database schema and migrations.
4. Inspect backend APIs and business logic.
5. Inspect frontend behavior and state management.
6. Inspect the admin dashboard.
7. Inspect security controls.
8. Run the system locally where possible.
9. Execute real tests and runtime verification.
10. Identify every defect, inconsistency, hardcoded business value, non-functional control, synchronization problem, security weakness, and incomplete feature.
11. Fix every issue that can be safely fixed.
12. Re-run the verification after fixes.
13. Continue verification/fix/retest cycles until no unresolved defect remains or until an issue genuinely requires external configuration or unavailable infrastructure.
14. Produce ONE extremely detailed Markdown report containing the complete evidence of the work.

---

# 1. MANDATORY FILE-FIRST PROTOCOL

Before doing ANY repository modification:

### Step 1

Create:

`Antigravity_Prompts/56_Independent_Full_System_Verification.md`

### Step 2

Write this complete instruction set into that file.

### Step 3

Read the entire file from the repository.

### Step 4

Execute the work ONLY according to the instructions contained in that Markdown file.

Do not execute directly from the chat message.

---

# 2. ABSOLUTE REPORTING RULE

You must create exactly ONE final verification report:

`Antigravity_Prompts/56_Independent_Full_System_Verification_Report.md`

Do NOT create multiple fragmented reports for this prompt.

The final report must contain the COMPLETE history and evidence of:

* initial audit
* discovered issues
* severity
* exact affected files
* exact affected functionality
* root cause
* remediation plan
* implemented fixes
* validation performed
* test results
* runtime results
* database evidence
* API evidence
* frontend evidence
* admin evidence
* security evidence
* synchronization evidence
* final retest
* remaining configuration requirements
* remaining limitations
* final system status

The report must be detailed enough that another senior developer can review the report and understand exactly what was tested and what was actually proven without relying on assumptions.

---

# 3. ZERO FABRICATION POLICY

This is mandatory.

NEVER fabricate:

* test results
* database values
* API responses
* HTTP status codes
* screenshots
* browser results
* user records
* product records
* order records
* inventory values
* payment results
* coupon results
* security findings
* successful mutations
* runtime behavior
* configuration values
* deployment results
* performance measurements

If something was not actually tested, write:

`NOT VERIFIED`

If something was verified only by source-code inspection, write:

`VERIFIED BY CODE ONLY`

If it was verified by code inspection and actual runtime execution, write:

`VERIFIED BY CODE + RUNTIME`

If an external provider/configuration prevents verification, write:

`CONFIGURATION REQUIRED`

If the functionality does not apply to the current architecture, write:

`NOT APPLICABLE`

If a test fails, write:

`FAILED`

Never convert an assumption into a successful result.

---

# 4. REQUIRED EVIDENCE FORMAT

For every important verification, record concrete evidence.

Where applicable include:

* file path
* function/class/component
* route
* HTTP method
* request payload
* response status
* relevant response body
* database table/model
* before value
* action performed
* after value
* frontend result
* admin result
* authorization result
* audit result
* test name
* command executed
* command output
* runtime observation

Do NOT hide evidence behind phrases such as:

* "works correctly"
* "fully dynamic"
* "verified"
* "secure"
* "synchronized"

unless the report immediately explains exactly HOW it was verified.

---

# 5. INITIAL REPOSITORY AUDIT

Inspect the entire repository.

At minimum inspect:

* root structure
* frontend
* backend
* Prisma schema
* migrations
* API routes
* controllers
* services
* middleware
* authentication
* authorization
* security configuration
* admin dashboard
* storefront
* components
* hooks
* state management
* API clients
* image/assets directories
* configuration
* tests
* scripts
* package files
* environment examples
* documentation
* deployment configuration

Create a repository inventory in the final report.

Include:

| Area | Location | Purpose | Status | Evidence |
| ---- | -------- | ------- | ------ | -------- |

---

# 6. MASTER SYSTEM MAP

Build a real system map.

For every major feature identify:

`Frontend UI → Frontend handler → API → Middleware → Controller → Service → Business Logic → Prisma → PostgreSQL → Response → Frontend state → UI`

At minimum map:

* authentication
* registration
* login
* logout
* products
* categories
* brands
* search
* filters
* product details
* cart
* wishlist
* checkout
* coupons
* payments
* orders
* inventory
* returns
* refunds
* reviews
* customers
* notifications
* email
* storefront content
* hero carousel
* promotional sections
* admin dashboard
* admin users
* RBAC
* audit logs
* security center
* system health
* settings
* media

Identify any broken links in the chain.

---

# 7. DYNAMIC SYSTEM VERIFICATION

The primary objective is to determine whether the store is genuinely dynamic.

Do NOT simply search for hardcoded values.

Perform actual end-to-end verification.

For each major dynamic entity:

### Required proof

1. Read current value from database.
2. Request the corresponding API.
3. Record API response.
4. Verify frontend renders that value.
5. Perform an authorized Admin mutation.
6. Verify database changed.
7. Verify API returns new value.
8. Verify frontend renders new value.
9. Refresh browser/page.
10. Verify value remains correct.
11. Verify no stale value is displayed.
12. Verify related pages/components update where appropriate.

Perform this for as many real entities as possible.

---

# 8. DATABASE → API → ADMIN → STOREFRONT SYNCHRONIZATION

Explicitly verify synchronization.

Test examples:

### Product

Admin changes:

* name
* price
* status
* stock
* image
* category
* brand

Verify:

`Admin → API → DB → Storefront`

### Category

Verify:

`Admin → DB → Category Navigation → Product Listing`

### Inventory

Verify:

`Admin → DB → Product Page → Cart → Checkout`

### Coupon

Verify:

`Admin → DB → Checkout → Order`

### Order

Verify:

`Admin → DB → Customer Account → Order Tracking`

### Storefront Content

Verify:

`Admin → DB → Homepage`

### Hero

Verify:

`Admin → DB → Homepage Hero`

Document actual before/after evidence.

---

# 9. HARDCODED BUSINESS DATA AUDIT

Search the entire repository for hardcoded business data.

Look for:

* product names
* prices
* discounts
* stock quantities
* categories
* brands
* ratings
* review counts
* orders
* customer information
* coupon codes
* shipping prices
* payment values
* hero content
* promotional content
* storefront sections
* fake statistics
* fake KPIs
* fake notifications
* fake customer counts
* fake sales numbers
* fake product lists
* static commercial claims

Distinguish between:

### Legitimate static content

Examples:

* UI labels
* translation strings
* legal text
* navigation labels
* icons
* design constants

and:

### Invalid hardcoded business data

Examples:

* fake products
* fake prices
* fake inventory
* fake sales
* fake orders
* fake discounts
* fake commercial statistics

Record every relevant finding.

---

# 10. IMAGE / MEDIA VERIFICATION

Inspect all product and storefront images.

Search:

* `img`
* `images`
* `public`
* `frontend/public`
* `frontend/img`
* root assets
* generated assets
* uploaded media

Determine:

* actual project images
* generated/AI-looking assets
* placeholders
* broken images
* unused images
* hardcoded external image URLs
* product-image mapping
* hero-image mapping

If AI-generated product images were introduced in previous work, identify them explicitly.

Do not claim they are real project assets unless verified.

---

# 11. STOREFRONT VERIFICATION

Verify all storefront pages.

At minimum:

* homepage
* products
* category
* search
* product details
* cart
* wishlist
* checkout
* login
* register
* account
* orders
* tracking
* returns where available

For each page verify:

* real data
* API integration
* loading
* empty state
* error state
* pagination
* filters
* sorting
* search
* navigation
* buttons
* forms
* persistence
* refresh behavior
* responsive behavior
* RTL
* LTR
* accessibility
* console errors
* network errors

---

# 12. HOMEPAGE VERIFICATION

Verify every homepage section.

Especially:

* header
* search
* navigation
* category navigation
* hero carousel
* hero slides
* CTA buttons
* featured products
* flash deals
* best sellers
* new arrivals
* promotional banners
* editorial sections
* category sections
* brands
* recommendations
* trust section
* footer

For each section determine:

`Static UI / DB-driven / API-driven / Admin-controlled`

If Admin-controlled, prove:

`Admin → DB → API → Homepage`

---

# 13. ADMIN DASHBOARD — BUTTON-BY-BUTTON AUDIT

Audit every meaningful admin control.

Create a table:

| Page | Control | Intended Action | Handler | API | Backend | DB | Auth | Audit | Runtime | Status |
| ---- | ------- | --------------- | ------- | --- | ------- | -- | ---- | ----- | ------- | ------ |

Inspect:

* buttons
* dropdowns
* tabs
* filters
* search
* pagination
* dialogs
* drawers
* forms
* toggles
* bulk actions
* status controls
* delete/archive controls
* create/edit controls
* export controls
* restore controls
* refund controls
* return controls
* content controls
* settings controls

Every meaningful control must either:

1. Work end-to-end, or
2. Be intentionally removed/reworked.

No dead controls.

---

# 14. ADMIN DASHBOARD FUNCTIONALITY

Verify:

* Dashboard
* Products
* Categories
* Brands
* Inventory
* Orders
* Payments
* Returns
* Refunds
* Customers
* Coupons
* Reviews
* Storefront Management
* Hero Management
* Promotional Sections
* Media
* Notifications
* Email
* Admin Users
* Roles
* Permissions
* Audit Logs
* Security Center
* System Health
* Settings

For each feature prove:

`UI → API → authorization → business logic → DB → persistence → response → UI`

---

# 15. AUTHENTICATION VERIFICATION

Verify:

* registration
* login
* logout
* JWT
* HttpOnly cookies
* token expiry
* invalid token
* expired token
* password hashing
* password validation
* session behavior
* unauthorized access
* admin authentication

Test both successful and failure paths.

---

# 16. AUTHORIZATION / RBAC

Verify:

* normal user
* admin
* each available admin role
* unauthorized user
* missing token
* invalid token
* expired token

Attempt access to protected endpoints.

Verify frontend hiding is NOT the only authorization layer.

Backend must enforce authorization.

---

# 17. BOLA / IDOR

Test resource ownership for:

* orders
* addresses
* payment methods
* wishlist
* cart
* reviews
* customer resources
* other user-owned resources

Attempt access to another user's resource using a controlled local/test scenario.

Record actual result.

---

# 18. MASS ASSIGNMENT

Test whether users can inject privileged fields such as:

* role
* permissions
* isAdmin
* status
* price
* stock
* payment status
* order status
* ownership
* internal flags

Verify server-side allowlists.

---

# 19. FINANCIAL SECURITY

Verify all financial values are server-authoritative.

Test:

* product price manipulation
* quantity manipulation
* discount manipulation
* coupon manipulation
* shipping manipulation
* total manipulation
* payment amount manipulation
* refund amount manipulation

The client must never be authoritative for financial calculations.

---

# 20. COUPON LOGIC

Verify:

* valid coupon
* expired coupon
* inactive coupon
* minimum order
* maximum discount
* usage limit
* per-user usage
* duplicate use
* concurrent redemption
* order cancellation
* refund interaction
* usage counter
* transaction safety

Verify database state before and after.

---

# 21. INVENTORY LOGIC

This is a critical verification.

Determine the exact inventory lifecycle.

Verify:

* available stock
* reserved stock
* cart
* checkout
* payment
* order creation
* order processing
* shipping
* delivery
* cancellation
* return
* refund

Determine exactly when stock is:

* reserved
* committed/deducted
* released
* restored

Prove there is no double deduction.

Test:

* concurrent purchase
* insufficient stock
* duplicate request
* payment retry
* webhook replay
* order cancellation
* return
* refund

---

# 22. ORDER STATE MACHINE

Verify the real state machine.

Identify all statuses.

For every transition verify:

* allowed transition
* forbidden transition
* authorization
* side effects
* inventory effects
* payment effects
* notification effects
* timestamps
* audit log

Do not verify only the transition function.

Verify the actual business side effects.

---

# 23. PAYMENTS

Verify:

* payment initiation
* payment success
* payment failure
* payment retry
* duplicate payment
* webhook
* webhook signature verification
* webhook replay
* idempotency
* order/payment consistency
* refund

If real gateway credentials are unavailable:

`CONFIGURATION REQUIRED`

Do not simulate successful external payment verification and label it production verified.

---

# 24. RETURNS AND REFUNDS

Verify separately:

* return request
* return approval/rejection
* refund
* refund amount
* refund idempotency
* inventory restoration
* order status
* customer visibility
* admin visibility
* audit trail
* notification

Do not automatically restore inventory merely because a return request was submitted unless that is the actual business rule.

---

# 25. CART / CHECKOUT

Verify:

* inactive products
* deleted products
* insufficient stock
* quantity limits
* price changes
* coupon changes
* shipping
* totals
* duplicate checkout
* retry
* stale cart
* concurrent checkout

---

# 26. PRODUCT / CATEGORY / BRAND LIFECYCLE

Verify:

* create
* read
* update
* archive
* restore where supported
* delete where legitimately allowed
* product/category relationship
* category visibility
* storefront visibility
* brand visibility
* inventory interaction

Verify category deletion/archive does not create orphaned or contradictory product state.

---

# 27. SEARCH / FILTER / PAGINATION

Verify:

* search
* category filter
* brand filter
* price filter
* availability
* sorting
* pagination
* empty results
* malformed parameters
* combinations
* URL state where supported

Verify data comes from the backend rather than a static frontend dataset.

---

# 28. REVIEWS

Verify:

* authenticated review
* ownership
* purchase eligibility if required
* duplicate review
* update/delete rules
* admin moderation
* rating aggregation
* review count
* storefront synchronization

---

# 29. NOTIFICATIONS / EMAIL

Verify:

* notification creation
* read/unread
* persistence
* triggering events
* email queue/provider integration
* failure behavior

If provider credentials are missing:

`CONFIGURATION REQUIRED`

Do not fabricate delivery success.

---

# 30. SECURITY ARCHITECTURE

Inspect and verify:

* Helmet
* CORS
* rate limiting
* CSRF
* request correlation IDs
* idempotency
* security registry
* global security guard
* ownership guard
* audit service
* threat detection
* error handler
* logging
* secret handling
* environment validation
* production configuration
* secure cookies
* password hashing
* JWT configuration

---

# 31. INPUT SECURITY

Verify protection against:

* SQL injection
* Prisma misuse
* XSS
* HTML injection
* command injection where applicable
* path traversal
* SSRF where applicable
* prototype pollution
* unsafe deserialization
* malformed JSON
* oversized requests
* malicious query parameters

Do not perform destructive or external attacks.

---

# 32. FILE UPLOAD SECURITY

If uploads exist, verify:

* type validation
* size validation
* filename handling
* path traversal protection
* storage isolation
* authorization
* unsafe executable content
* external URL handling

---

# 33. ERROR HANDLING

Verify errors do not expose:

* secrets
* passwords
* tokens
* stack traces in production
* database credentials
* internal filesystem paths
* sensitive user information

Verify errors are correctly handled on:

* API
* frontend
* admin
* authentication
* checkout
* payments

---

# 34. DATABASE INTEGRITY

Inspect Prisma schema and migrations.

Verify:

* foreign keys
* unique constraints
* indexes
* nullable fields
* enum/state constraints
* cascade behavior
* transaction boundaries
* money precision
* inventory constraints
* coupon constraints
* ownership relations
* audit relations

Identify logical integrity gaps even if Prisma validation passes.

---

# 35. CONCURRENCY / RACE CONDITIONS

Test where relevant:

* inventory
* coupon usage
* order creation
* payment callbacks
* refunds
* duplicate admin actions
* duplicate customer requests

Verify transaction isolation and atomicity.

---

# 36. IDEMPOTENCY

Verify:

* checkout retry
* payment retry
* webhook replay
* refund retry
* duplicate mutation
* network retry

Ensure repeated requests do not create duplicate business effects.

---

# 37. FRONTEND STATE CONSISTENCY

Verify:

* page refresh
* navigation
* stale state
* multiple tabs where feasible
* cart changes
* admin mutations
* product changes
* inventory changes
* storefront content changes
* authentication changes

Determine whether cache invalidation/revalidation is correct.

---

# 38. RESPONSIVE / ACCESSIBILITY

Verify:

* 320px
* 360px
* 390px
* 414px
* 768px
* 1024px
* 1280px
* 1440px

Check:

* keyboard navigation
* focus
* labels
* buttons
* forms
* contrast
* RTL
* LTR
* touch interaction

---

# 39. UI / UX FUNCTIONALITY

Check for:

* dead buttons
* fake success messages
* empty handlers
* placeholder interactions
* mock data
* console-only actions
* TODO/FIXME affecting functionality
* broken dialogs
* broken forms
* incorrect loading states
* incorrect empty states
* incorrect error states

Search for patterns such as:

* empty onClick
* fake mutation functions
* setTimeout pretending to save
* hardcoded success
* mocked API calls
* local-only business mutations
* commented-out real API calls

---

# 40. ADMIN KPI VERIFICATION

Every dashboard KPI must be backed by real data.

Verify:

* sales
* orders
* customers
* products
* low stock
* pending orders
* revenue
* refunds
* coupon usage
* payment status
* operational alerts

No fake metrics.

Document the exact query/API source for each KPI.

---

# 41. SECURITY REGRESSION

Re-run all existing security tests.

Also verify that recent feature work did not weaken:

* auth
* RBAC
* ownership
* rate limiting
* CSRF
* CORS
* audit logging
* payment protection
* inventory protection
* idempotency

---

# 42. TEST QUALITY AUDIT

Do not only report:

`32/32 tests passed`

Inspect whether tests actually prove the business logic.

For every important test determine:

* what it tests
* what it does not test
* whether it is meaningful
* whether it can produce false confidence
* whether runtime/DB behavior is covered

Add tests when required.

---

# 43. REQUIRED VALIDATION COMMANDS

Run all relevant commands available in the repository.

At minimum attempt:

```bash
npm test
npx prisma validate
npx tsc --noEmit
npm run build
npm run lint
npm audit
```

Also run:

* backend tests
* frontend tests
* backend build
* frontend build
* typecheck
* lint
* migration validation
* secret scan
* repository-specific validation scripts

Do not claim a command passed unless actually executed.

---

# 44. RUNTIME VERIFICATION

Run the application locally where possible.

Verify real:

* API startup
* frontend startup
* database connectivity
* authentication
* admin access
* storefront requests
* mutations
* persistence
* error behavior

Inspect:

* browser console
* network requests
* HTTP responses
* backend logs
* database changes

Record actual results.

---

# 45. FAILURE INJECTION

Safely test failure paths.

Examples:

* invalid ID
* missing required field
* unauthorized request
* expired token
* insufficient inventory
* invalid coupon
* duplicate request
* invalid order transition
* failed payment configuration
* unavailable dependency
* malformed request

Verify system fails safely and consistently.

---

# 46. REMEDIATION PROCESS

After the initial audit:

Create an internal remediation plan.

For every finding:

| ID | Severity | Domain | Root Cause | File(s) | Fix | Validation |
| -- | -------- | ------ | ---------- | ------- | --- | ---------- |

Then implement fixes.

After fixes, repeat the complete verification.

If new issues appear:

1. Record them.
2. Fix them.
3. Retest them.
4. Re-run relevant regression tests.

Continue until:

* no Critical findings
* no High findings
* no unresolved Medium findings that can be fixed locally
* no known broken controls
* no known unsynchronized business flows
* no unverified claims presented as verified

---

# 47. FINAL PROOF MATRIX

The final report MUST contain a complete matrix:

| Domain | Code | Runtime | DB | API | Frontend | Admin | Security | Sync | Status | Evidence |
| ------ | ---- | ------- | -- | --- | -------- | ----- | -------- | ---- | ------ | -------- |

Include at least:

* Authentication
* Authorization
* RBAC
* BOLA/IDOR
* Products
* Categories
* Brands
* Search
* Filters
* Cart
* Wishlist
* Checkout
* Coupons
* Inventory
* Orders
* Payments
* Returns
* Refunds
* Reviews
* Customers
* Notifications
* Email
* Storefront
* Hero
* Promotional Content
* Media
* Admin Dashboard
* Admin Users
* Audit
* Security Center
* System Health
* Settings

---

# 48. COMPLETE FINDINGS TABLE

The final report must include:

| ID | Severity | Domain | Finding | Evidence | Root Cause | Fix | Retest | Final Status |
| -- | -------- | ------ | ------- | -------- | ---------- | --- | ------ | ------------ |

Severity:

* Critical
* High
* Medium
* Low
* Informational
* Configuration Required

---

# 49. CONFIGURATION REQUIREMENTS

Clearly separate:

### Code defects

from:

### Environment/configuration requirements

Examples:

* Stripe secret
* webhook secret
* SMTP credentials
* Redis
* Sentry DSN
* production database
* object storage

For each configuration requirement explain:

* why it is required
* what was verified without it
* what could not be verified
* what must be configured before production

Never hide configuration requirements.

---

# 50. STATIC VS DYNAMIC CLASSIFICATION

Create a final classification of the entire storefront/admin.

Every relevant element must be classified:

`STATIC UI`

or

`DYNAMIC FROM DATABASE`

or

`DYNAMIC FROM API`

or

`ADMIN CONTROLLED`

or

`CONFIGURATION DEPENDENT`

or

`NOT VERIFIED`

This classification must cover commercial/business content.

---

# 51. FINAL DYNAMIC SYSTEM VERDICT

Do NOT claim "100% dynamic" simply because no hardcoded data was found.

The final verdict must be based on actual evidence.

Possible status:

`DYNAMIC SYSTEM VERIFIED`

or

`DYNAMIC SYSTEM VERIFIED WITH LIMITATIONS`

or

`DYNAMIC SYSTEM NOT FULLY VERIFIED`

Explain exactly why.

---

# 52. FINAL SECURITY VERDICT

Possible:

`SECURITY VERIFIED — NO OPEN HIGH/CRITICAL FINDINGS`

or

`SECURITY VERIFIED WITH CONFIGURATION REQUIRED`

or

`SECURITY VERIFICATION FAILED — REMEDIATION REQUIRED`

Do not claim security is fully verified if important runtime/provider-dependent security controls were not testable.

---

# 53. FINAL FUNCTIONALITY VERDICT

Possible:

`FUNCTIONALITY VERIFIED — NO OPEN HIGH/CRITICAL FUNCTIONAL DEFECTS`

or

`FUNCTIONALITY VERIFIED WITH LIMITATIONS`

or

`FUNCTIONALITY VERIFICATION FAILED — REMEDIATION REQUIRED`

---

# 54. FINAL REPORT STRUCTURE

The single final Markdown file MUST contain the following sections:

1. Executive Summary
2. Verification Objective
3. Verification Methodology
4. Repository Inventory
5. Architecture Map
6. Technology Stack
7. Environment Used
8. Commands Executed
9. Initial System State
10. Master Feature Matrix
11. Dynamic Data Audit
12. Hardcoded Business Data Audit
13. Database Verification
14. API Verification
15. Frontend Verification
16. Admin Verification
17. Storefront Verification
18. Homepage Verification
19. Product Verification
20. Category Verification
21. Brand Verification
22. Search Verification
23. Cart Verification
24. Wishlist Verification
25. Checkout Verification
26. Coupon Verification
27. Inventory Verification
28. Order Verification
29. Payment Verification
30. Return Verification
31. Refund Verification
32. Review Verification
33. Customer Verification
34. Notification Verification
35. Email Verification
36. Storefront Content Verification
37. Media Verification
38. Authentication Verification
39. Authorization Verification
40. RBAC Verification
41. BOLA/IDOR Verification
42. Mass Assignment Verification
43. Financial Security Verification
44. Input Security Verification
45. File Security Verification
46. CSRF/CORS/Rate Limit Verification
47. Audit Logging Verification
48. Threat Detection Verification
49. Error Handling Verification
50. Database Integrity Verification
51. Concurrency Verification
52. Idempotency Verification
53. State Synchronization Verification
54. Browser Runtime Verification
55. Responsive Verification
56. Accessibility Verification
57. Test Quality Audit
58. Initial Findings
59. Remediation Plan
60. Implemented Fixes
61. Retest Results
62. Final Proof Matrix
63. Static vs Dynamic Classification
64. Configuration Requirements
65. Remaining Limitations
66. Open Findings
67. Final Security Verdict
68. Final Functionality Verdict
69. Final Dynamic-System Verdict
70. Final Production Readiness Verdict
71. Exact Commands and Results
72. Final Conclusion

---

# 55. EVIDENCE REQUIREMENT FOR EACH SECTION

Every section must contain concrete evidence.

Examples:

### Database

```text
Model:
Product

Before:
price = X

Mutation:
PUT /api/admin/products/:id

After:
price = Y

Database verification:
Product.price = Y

Storefront verification:
Product page displayed Y
```

Use actual values obtained during testing.

### API

Record:

```text
METHOD:
ROUTE:
AUTH:
REQUEST:
RESPONSE STATUS:
RESPONSE:
RESULT:
```

### Browser

Record:

```text
Page:
Action:
Expected:
Observed:
Console:
Network:
Result:
```

### Security

Record:

```text
Attack/abuse case:
Request:
Expected:
Observed:
HTTP status:
Result:
```

Never invent values.

---

# 56. AI-GENERATED / TEMPLATE DESIGN AUDIT

Inspect the storefront and admin UI for:

* generated-looking product imagery
* generic AI layouts
* copied marketplace layouts
* repetitive card grids
* meaningless gradients
* excessive rounded containers
* excessive glassmorphism
* generic SaaS dashboard patterns
* decorative elements without function
* fake metrics
* stock/generated promotional assets

Do not judge merely by aesthetics.

Identify concrete evidence where possible.

If an asset cannot be proven to be AI-generated, do NOT state it as fact.

Use:

`UNVERIFIED ASSET ORIGIN`

when necessary.

---

# 57. NOON / MARKETPLACE COPYING AUDIT

Check whether the implementation appears to directly copy:

* Noon
* Amazon
* Shopify
* eBay
* Temu
* AliExpress
* Shein
* Walmart
* Best Buy
* other recognizable templates

Usability principles are acceptable.

Direct visual/layout copying should be identified.

Do not replace functional marketplace conventions merely for the sake of originality.

---

# 58. NO FAKE SUCCESS

A button is NOT considered functional because:

* it changes local React state
* it closes a dialog
* it shows "Success"
* it displays a toast
* it waits with setTimeout
* it logs to console

A mutation is functional only if the intended business operation reaches the appropriate backend logic and persists correctly where persistence is required.

---

# 59. NO FAKE TESTING

Do not create tests merely to make the numbers look good.

Tests must assert real behavior.

Do not:

* mock away the entire business logic
* mock the database for a persistence claim
* assert constants
* test implementation details instead of outcomes
* mark skipped tests as passed
* suppress failures

If a test cannot provide meaningful proof, document that limitation.

---

# 60. STOP CONDITION

Do not finish immediately after the first successful test run.

You must:

1. Audit.
2. Find issues.
3. Fix issues.
4. Retest.
5. Audit again.
6. Verify cross-system consistency.
7. Verify runtime behavior.
8. Verify security regression.
9. Verify database persistence.
10. Produce the final evidence report.

Only stop when the remaining state is genuinely clean or when a real external configuration/dependency prevents further verification.

---

# 61. FINAL REPORT QUALITY BAR

The final report must NOT be a short summary.

It must be a complete technical audit document.

It must contain:

* exact findings
* exact evidence
* exact commands
* exact test results
* exact affected files
* exact fixes
* exact before/after states where applicable
* exact limitations
* exact configuration requirements
* exact final status

Do not remove details merely to make the report shorter.

If the report becomes very long, that is acceptable.

Accuracy is more important than brevity.

---

# 62. FINAL REPORT MUST BE SELF-CONTAINED

Another developer should be able to read:

`Antigravity_Prompts/56_Independent_Full_System_Verification_Report.md`

and understand:

* what was inspected
* what was tested
* what actually worked
* what failed
* what was fixed
* what remains
* what is dynamic
* what is static
* what is synchronized
* what is not synchronized
* what is secure
* what is not verified
* what requires configuration
* whether the system is production-ready

without needing to read the chat conversation.

---

# 63. FINAL REPORT HONESTY CHECK

Before finalizing the report, perform a final consistency check.

For every statement containing:

* verified
* passed
* complete
* secure
* dynamic
* synchronized
* functional
* production-ready

ensure there is actual evidence supporting it.

Remove or downgrade unsupported claims.

Do not write what you think the user wants to hear.

Write only what the evidence proves.

---

# 64. FINAL STATUS

At the very top of the final report include:

```text
FINAL SYSTEM STATUS:
[ONE OF THE VALID STATUSES]

VERIFICATION DATE:
[ACTUAL DATE]

REPOSITORY:
[ACTUAL REPOSITORY]

VERIFICATION SCOPE:
[FULL / PARTIAL + EXPLANATION]

CRITICAL FINDINGS:
[REAL NUMBER]

HIGH FINDINGS:
[REAL NUMBER]

MEDIUM FINDINGS:
[REAL NUMBER]

LOW FINDINGS:
[REAL NUMBER]

CONFIGURATION REQUIRED:
[REAL NUMBER]

NOT VERIFIED:
[REAL NUMBER]
```

All values must be real.

---

# 65. REQUIRED FINAL OUTPUT

Create:

`Antigravity_Prompts/56_Independent_Full_System_Verification_Report.md`

This must be the SINGLE comprehensive final report.

Do not create another report for Prompt 56.

Do not provide a simplified summary instead of the Markdown report.

The Markdown file itself is the primary deliverable.

---

# 66. FINAL CHAT RESPONSE

After completing the work, your final chat response must be concise and contain only:

1. Confirmation that Prompt 56 was executed.
2. Exact report path.
3. Final system status.
4. Critical/High/Medium/Low findings counts.
5. Configuration-required count.
6. Whether anything remains unverified.

Do not claim anything that is not supported by the final report.

---

# 67. DO NOT START THE NEXT PROMPT

After Prompt 56 is completed:

STOP.

Do not automatically execute Prompt 57 or any other prompt.

Do not make unrelated changes.

Do not perform additional feature development outside the scope of this verification.

---

# FINAL PRINCIPLE

**Evidence over claims.**

**Reality over assumptions.**

**Actual database/API/runtime behavior over source-code appearance.**

**A failed test is a finding, not an inconvenience.**

**An unverified feature is NOT a verified feature.**

**Configuration-required is NOT the same as passed.**

**Never fabricate evidence to make the project appear complete.**
