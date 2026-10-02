# Prompt 57 — Forensic Evidence-Based Full Ecommerce System Verification

## MISSION

Perform a **forensic, adversarial, evidence-first verification** of the entire ecommerce system.

The previous Prompt 56 report claimed that the system was fully dynamic, synchronized, functional, persistent, and secure.

Do NOT trust those claims.

Treat the Prompt 56 report as **untrusted evidence** until independently reproduced.

The objective is NOT to make the report look positive.

The objective is to determine the actual truth of the system.

If the system is broken, incomplete, partially dynamic, unsynchronized, insecure, or dependent on unavailable configuration, report that fact explicitly.

If something cannot be experimentally proven, it MUST NOT be marked as verified.

---

# 1. FILE-FIRST EXECUTION PROTOCOL

Before modifying anything:

Create:

`Antigravity_Prompts/57_Forensic_Evidence_Based_Full_System_Verification.md`

Write this entire instruction set into that file.

Then:

1. Read the entire file.
2. Execute only from that file.
3. Do not execute directly from the chat.
4. Inspect the existing Prompt 56 report.
5. Independently reproduce its important claims.
6. Fix defects discovered during this audit.
7. Retest after every remediation cycle.
8. Stop only when verification is genuinely complete or blocked by a real external dependency.

---

# 2. SINGLE FINAL REPORT

Create exactly ONE final report:

`Antigravity_Prompts/57_Forensic_Evidence_Based_Full_System_Verification_Report.md`

Do not create multiple fragmented reports.

The report must contain the entire investigation from beginning to end.

It must be self-contained.

Another developer must be able to read this one file and understand exactly:

* what was tested
* how it was tested
* what actually happened
* what failed
* what was fixed
* what remains
* what was not testable
* what is dynamic
* what is static
* what is synchronized
* what is not synchronized
* what is secure
* what is not proven
* what requires configuration

---

# 3. ZERO-FABRICATION RULE

This is the most important rule.

NEVER fabricate:

* database values
* API responses
* HTTP status codes
* browser observations
* screenshots
* test results
* product records
* customer records
* order records
* inventory values
* payment results
* coupon results
* runtime results
* performance metrics
* security results
* configuration values

Never write a result simply because the code appears correct.

Never write:

`VERIFIED`

unless actual evidence supports it.

Use only these statuses:

* `VERIFIED BY RUNTIME + DATABASE + API`
* `VERIFIED BY RUNTIME + API`
* `VERIFIED BY CODE ONLY`
* `NOT VERIFIED`
* `FAILED`
* `CONFIGURATION REQUIRED`
* `NOT APPLICABLE`

---

# 4. IMPORTANT: CODE INSPECTION IS NOT RUNTIME PROOF

The following are NOT sufficient to claim runtime verification:

* TypeScript compilation
* Prisma validation
* successful build
* presence of a controller
* presence of an API route
* presence of a React handler
* existence of a database model
* passing unit tests
* static code search

For example:

```text
/api/products exists
```

does NOT prove:

```text
GET /api/products actually works
```

Similarly:

```text
Product model exists
```

does NOT prove:

```text
Admin changes Product.price → database changes → API returns new price → storefront displays new price
```

---

# 5. REAL DATABASE VERIFICATION

Whenever possible, use the actual development database.

For important mutations capture:

### BEFORE

* database record
* relevant fields

### ACTION

* exact UI action
* exact API endpoint
* exact request

### RESPONSE

* HTTP status
* relevant response

### AFTER

* database record
* relevant fields

### STOREFRONT

* displayed value

### REFRESH

* value after browser refresh

### FINAL RESULT

* verified / failed / not verified

Example format:

```text
TEST ID: PRODUCT-PRICE-001

DATABASE BEFORE:
Product ID: <actual ID>
Price: <actual value>

ADMIN ACTION:
Changed product price from <actual> to <actual>

API:
PUT /api/admin/products/<actual-id>

HTTP STATUS:
<actual>

DATABASE AFTER:
Price: <actual>

STOREFRONT AFTER:
Displayed price: <actual>

AFTER REFRESH:
Displayed price: <actual>

RESULT:
VERIFIED BY RUNTIME + DATABASE + API
```

Use actual values.

---

# 6. CREATE A REAL TEST DATA STRATEGY

If the database does not contain suitable safe development/test data:

Create controlled local test data using the repository's existing seed/test mechanisms.

Do NOT create fake production claims.

Clearly label all records:

`FORENSIC_TEST_DATA`

Do not confuse test records with real commercial data.

Record:

* test record ID
* creation method
* cleanup method
* affected tables

If test data cannot safely be created:

`NOT VERIFIED`

---

# 7. PRODUCT FORENSIC TEST

Verify:

* create
* read
* update
* archive/deactivate
* restore where supported
* price
* compare price
* stock
* reserved stock
* category
* brand
* images
* Arabic name
* English name
* description
* visibility

For at least one real test product prove:

```text
Admin
→ API
→ Database
→ Storefront
→ Refresh
```

Test a mutation and verify persistence.

---

# 8. CATEGORY FORENSIC TEST

Verify:

* create
* edit
* archive
* restore
* ordering
* visibility
* image/icon
* bilingual fields
* product association

Prove:

```text
Admin Category Change
→ Database
→ Category API
→ Navigation
→ Category Page
```

---

# 9. BRAND FORENSIC TEST

Verify:

* create
* edit
* archive
* visibility
* image/logo
* product association
* product counts

Prove synchronization with storefront.

---

# 10. STOREFRONT CONTENT FORENSIC TEST

This is critical.

Verify every Admin-controlled homepage entity:

* hero
* hero slides
* promotional banners
* featured sections
* product sections
* curated collections
* category sections
* brand sections
* visibility
* ordering
* assigned products

For at least one real section:

```text
DB BEFORE
↓
ADMIN MUTATION
↓
API RESPONSE
↓
DB AFTER
↓
HOMEPAGE BEFORE
↓
HOMEPAGE AFTER
↓
PAGE REFRESH
```

---

# 11. HERO CAROUSEL FORENSIC TEST

Inspect every hero slide.

Determine:

* database-backed?
* API-backed?
* Admin-controlled?
* hardcoded?
* image source?
* CTA destination?
* Arabic content?
* English content?

Verify that changing a slide in Admin actually changes the homepage.

Do NOT mark hero as dynamic merely because a `Hero` component exists.

---

# 12. HARDCODED BUSINESS DATA FORENSIC AUDIT

Perform repository-wide searches.

Search for:

* products arrays
* categories arrays
* brands arrays
* price literals
* discount literals
* stock literals
* coupon codes
* fake order objects
* fake customer objects
* fake sales values
* fake dashboard KPIs
* fake ratings
* fake review counts
* hardcoded hero slides
* hardcoded promotional sections

Inspect each match.

Classify:

`LEGITIMATE STATIC UI`

or

`INVALID BUSINESS DATA`

or

`TEST DATA`

or

`NOT SURE — MANUAL REVIEW`

Do not count search results blindly.

---

# 13. IMAGE FORENSIC AUDIT

Inspect actual assets.

Identify:

* project-owned images
* uploaded images
* generated images
* placeholders
* external images
* broken images
* unused images

For every homepage hero/product image determine source.

If origin cannot be proven:

`UNVERIFIED ASSET ORIGIN`

Do NOT call an image "real" merely because it exists in `/img`.

---

# 14. EVERY ADMIN BUTTON

Perform a complete button/control inventory.

For every meaningful control:

```text
PAGE:
CONTROL:
LABEL:
INTENDED ACTION:
FRONTEND HANDLER:
API:
BACKEND:
DATABASE:
AUTHORIZATION:
AUDIT:
RUNTIME RESULT:
PERSISTENCE:
STATUS:
```

Check:

* Add
* Edit
* Delete
* Archive
* Restore
* Save
* Cancel
* Search
* Filter
* Sort
* Pagination
* Bulk actions
* Status changes
* Refund
* Return
* Approve
* Reject
* Publish
* Unpublish
* Upload
* Reorder
* Toggle
* Export
* Settings

No dead buttons.

---

# 15. DEAD CONTROL SEARCH

Search for:

```text
onClick={() => {}}
```

and similar patterns.

Also search:

* TODO
* FIXME
* console.log used as business action
* fake setTimeout mutations
* mock save functions
* fake success
* placeholder handlers
* commented API calls
* local-only mutations
* hardcoded state toggles

Every relevant result must be investigated.

---

# 16. ADMIN DASHBOARD KPI FORENSIC VERIFICATION

For every KPI identify:

```text
KPI:
Frontend Source:
API:
Backend Query:
Database Model:
Database Query:
Actual Value:
Runtime Display:
```

Verify dashboard numbers are real.

No fake:

* sales
* revenue
* customers
* orders
* inventory
* low-stock alerts
* pending orders
* refunds

---

# 17. ORDER FORENSIC VERIFICATION

Test complete order lifecycle.

At minimum:

```text
Cart
→ Checkout
→ Order Creation
→ Payment State
→ Processing
→ Shipping
→ Delivery
```

Also test:

* cancellation
* invalid transition
* duplicate request
* retry
* stale order
* ownership

Record database changes after each state transition.

---

# 18. INVENTORY FORENSIC VERIFICATION

Determine exact business lifecycle:

```text
Available
Reserved
Committed/Deducted
Released
Restored
```

Do not assume.

Inspect the actual implementation.

Test:

* normal purchase
* insufficient stock
* duplicate purchase
* concurrent purchase
* cancellation
* return
* refund

Specifically prove there is no double deduction.

---

# 19. COUPON FORENSIC VERIFICATION

Test:

* valid coupon
* invalid coupon
* expired
* inactive
* minimum order
* maximum discount
* usage limit
* per-user limit
* duplicate redemption
* concurrent redemption
* cancellation
* refund

Verify:

```text
Coupon BEFORE
→ Order
→ CouponUsage
→ usedCount AFTER
```

---

# 20. CART FORENSIC VERIFICATION

Test:

* inactive product
* archived product
* unavailable product
* insufficient stock
* excessive quantity
* price changes
* duplicate add
* stale cart
* refresh
* login/logout synchronization

---

# 21. CHECKOUT FORENSIC VERIFICATION

Verify:

* prices
* quantities
* discounts
* shipping
* totals
* inventory
* address
* coupon
* order creation
* duplicate submission

All authoritative values must come from the server.

---

# 22. PAYMENT FORENSIC VERIFICATION

Inspect:

* payment initiation
* payment status
* webhook
* signature verification
* idempotency
* duplicate webhook
* failed payment
* successful payment
* refund

If external credentials are unavailable:

`CONFIGURATION REQUIRED`

Do not pretend to have verified a live payment provider.

---

# 23. RETURN / REFUND FORENSIC VERIFICATION

Verify separately:

### Return request

Does NOT automatically imply refund.

### Return approval

Determine actual business behavior.

### Refund

Verify:

* amount
* order relationship
* payment relationship
* idempotency
* audit
* inventory restoration
* customer visibility

---

# 24. CUSTOMER FORENSIC VERIFICATION

Verify:

* profile
* addresses
* orders
* ownership
* account mutations
* admin visibility
* sensitive information protection

---

# 25. REVIEW FORENSIC VERIFICATION

Verify:

* create
* ownership
* eligibility
* duplicate prevention
* moderation
* publish
* reject
* rating aggregation
* review count

---

# 26. SEARCH / FILTER / PAGINATION FORENSIC VERIFICATION

Verify backend-driven behavior.

Test:

* search
* Arabic
* English
* category
* brand
* price
* availability
* sorting
* pagination
* empty results
* malformed query

---

# 27. AUTHENTICATION FORENSIC VERIFICATION

Test:

* registration
* login
* logout
* invalid credentials
* expired token
* missing token
* invalid token
* password hashing
* HttpOnly cookies
* admin login

---

# 28. AUTHORIZATION FORENSIC VERIFICATION

Test:

* guest
* normal user
* admin
* other admin roles if implemented

Attempt protected operations with insufficient privileges.

Record actual HTTP responses.

---

# 29. BOLA / IDOR FORENSIC VERIFICATION

Test ownership on:

* orders
* addresses
* payment methods
* reviews
* wishlist
* cart
* customer resources

Use safe local/test identities.

---

# 30. MASS ASSIGNMENT FORENSIC VERIFICATION

Attempt to inject unauthorized fields:

* role
* permissions
* isAdmin
* owner
* price
* stock
* payment status
* order status
* internal flags

Verify server-side protection.

---

# 31. FINANCIAL MANIPULATION TESTS

Attempt controlled modification of:

* price
* discount
* shipping
* tax
* total
* refund
* quantity

Verify the server rejects client authority.

---

# 32. INPUT SECURITY

Verify:

* SQL injection resistance
* XSS
* malformed input
* path traversal
* SSRF where relevant
* oversized requests
* unsafe query parameters

Do not attack external systems.

---

# 33. CSRF / CORS / RATE LIMITING

Verify actual behavior.

Do not rely only on configuration files.

Test:

* allowed origin
* rejected origin
* protected mutation without CSRF where applicable
* rate limit response
* authenticated vs unauthenticated behavior

---

# 34. AUDIT LOGGING

Perform real sensitive mutations.

Verify:

```text
Action
→ Database mutation
→ Audit record
```

Check sensitive data redaction.

---

# 35. ERROR HANDLING

Trigger controlled errors.

Verify responses do not expose:

* secrets
* passwords
* JWTs
* stack traces
* database credentials
* internal paths

---

# 36. DATABASE INTEGRITY

Inspect:

* all Prisma models
* foreign keys
* unique constraints
* indexes
* relations
* cascade rules
* enums
* nullable fields
* transaction boundaries

Do not equate:

`prisma validate`

with:

`database/business integrity verified`.

---

# 37. CONCURRENCY

Perform safe concurrency tests where possible.

At minimum inspect/test:

* inventory
* coupon usage
* checkout
* webhook
* refund
* admin duplicate actions

Record actual behavior.

---

# 38. IDEMPOTENCY

Test repeated identical requests.

Verify duplicate requests do not produce duplicate:

* orders
* payments
* refunds
* coupon usage
* inventory deductions
* notifications

---

# 39. STATE SYNCHRONIZATION

Test:

* Admin mutation
* storefront update
* browser refresh
* multiple navigation paths
* stale state
* cached state
* cart synchronization
* inventory synchronization
* authentication synchronization

---

# 40. BROWSER RUNTIME AUDIT

Run the application.

Inspect actual browser behavior.

Record:

* URL
* action
* expected
* observed
* console
* network
* response
* persistence

Do not write:

`Browser QA passed`

without describing what was actually tested.

---

# 41. RESPONSIVE TESTING

Actually inspect relevant viewport sizes:

* 320
* 360
* 390
* 414
* 768
* 1024
* 1280
* 1440

Record meaningful defects.

---

# 42. RTL / LTR

Test both:

* Arabic RTL
* English LTR

Check:

* header
* navigation
* cards
* forms
* tables
* dialogs
* checkout
* admin

---

# 43. ACCESSIBILITY

Check actual:

* keyboard navigation
* focus
* labels
* semantic structure
* buttons
* forms
* aria attributes
* contrast where practical

Do not claim full WCAG compliance unless actually tested.

---

# 44. PERFORMANCE

Only report measurements actually obtained.

If no formal benchmark exists:

`NOT VERIFIED`

Do not invent load times.

---

# 45. AUTOMATED TEST AUDIT

Run:

```bash
npm test
npx prisma validate
npx tsc --noEmit
npm run build
npm run lint
npm audit
```

Run any additional project-specific scripts.

Record:

* exact command
* exit code
* actual result
* duration where available

---

# 46. TEST SUITE INTEGRITY

Inspect tests for false confidence.

Determine whether tests:

* use real business logic
* use mocked DB
* use mocked APIs
* skip important behavior
* assert meaningful outcomes
* cover persistence
* cover concurrency
* cover authorization

A passing test suite does not automatically prove the feature works.

---

# 47. REMEDIATION

When a defect is found:

1. Record it.
2. Identify root cause.
3. Identify affected files.
4. Fix it.
5. Add or improve test coverage.
6. Retest.
7. Run regression tests.
8. Verify no new defect was introduced.

Repeat as necessary.

---

# 48. NO COSMETIC FIXES FOR LOGIC BUGS

Do not solve a backend/business problem by merely:

* hiding the button
* disabling UI
* changing text
* adding a toast
* adding loading animation
* changing local state

Fix the actual business logic.

---

# 49. CROSS-SYSTEM INVARIANTS

Verify these invariants:

### Product

Admin product data = API product data = storefront product data.

### Price

Server price = order line price = historical order price.

### Inventory

Available stock never becomes negative.

### Coupon

Usage counters match actual valid usage.

### Order

Order status follows valid transitions.

### Payment

Payment state is consistent with order state.

### Refund

Refund cannot exceed refundable amount.

### Ownership

Users cannot access another user's resources.

### Storefront

Admin-controlled content persists after refresh.

---

# 50. FINAL CLASSIFICATION

For every major business feature classify:

`STATIC`

`DYNAMIC`

`ADMIN CONTROLLED`

`API DRIVEN`

`DATABASE DRIVEN`

`CONFIGURATION DEPENDENT`

`NOT VERIFIED`

Do not classify something as dynamic solely because it uses React state.

---

# 51. FINAL FINDINGS

Create:

| ID | Severity | Domain | Finding | Evidence | Root Cause | Fix | Retest | Status |
| -- | -------- | ------ | ------- | -------- | ---------- | --- | ------ | ------ |

Count accurately:

* Critical
* High
* Medium
* Low
* Configuration Required
* Not Verified

---

# 52. FINAL EVIDENCE MATRIX

Create:

| Feature | Code | API Runtime | DB Runtime | Frontend Runtime | Admin Runtime | Persistence | Synchronization | Security | Final Status |
| ------- | ---- | ----------- | ---------- | ---------------- | ------------- | ----------- | --------------- | -------- | ------------ |

Do not mark a cell `YES` without evidence.

---

# 53. FINAL PROOF TABLE

For every critical business workflow include:

```text
Workflow:
Precondition:
Database Before:
User/Admin Action:
API Request:
API Response:
Database After:
Frontend Result:
Refresh Result:
Security Result:
Persistence Result:
Final Status:
Evidence Location:
```

---

# 54. PROMPT 56 CLAIM-BY-CLAIM REASSESSMENT

The final report MUST explicitly audit the claims from:

`Antigravity_Prompts/56_Independent_Full_System_Verification_Report.md`

Create:

| Prompt 56 Claim | Independent Result | Evidence | Verdict |
| --------------- | ------------------ | -------- | ------- |

Every major Prompt 56 claim must be:

* CONFIRMED
* PARTIALLY CONFIRMED
* REJECTED
* NOT VERIFIABLE

Do not automatically preserve Prompt 56's conclusions.

---

# 55. REPORT MUST INCLUDE RAW EVIDENCE

Where useful include sanitized excerpts of:

* API requests
* API responses
* SQL/Prisma queries
* database before/after values
* test output
* HTTP status
* browser console
* relevant network results
* file paths
* function names

Never expose real secrets.

Mask:

* passwords
* JWTs
* API keys
* payment secrets
* webhook secrets
* private credentials

---

# 56. NO SECRET EXPOSURE

Never place actual secrets inside the report.

Use:

`[REDACTED]`

when necessary.

---

# 57. FINAL REPORT STRUCTURE

The report MUST contain:

1. Final Status
2. Verification Date
3. Repository
4. Scope
5. Environment
6. Methodology
7. Repository Inventory
8. Architecture Map
9. Prompt 56 Claim Reassessment
10. Initial Findings
11. Dynamic Data Audit
12. Hardcoded Business Data Audit
13. Image/Media Audit
14. Product Verification
15. Category Verification
16. Brand Verification
17. Storefront Verification
18. Homepage Verification
19. Hero Verification
20. Search Verification
21. Cart Verification
22. Wishlist Verification
23. Checkout Verification
24. Coupon Verification
25. Inventory Verification
26. Order Verification
27. Payment Verification
28. Return Verification
29. Refund Verification
30. Review Verification
31. Customer Verification
32. Notification Verification
33. Email Verification
34. Admin Dashboard Verification
35. Admin Button Matrix
36. Admin CRUD Verification
37. RBAC Verification
38. Authentication Verification
39. BOLA/IDOR Verification
40. Mass Assignment Verification
41. Financial Security Verification
42. Input Security Verification
43. File Security Verification
44. CSRF/CORS/Rate Limit Verification
45. Audit Logging Verification
46. Threat Detection Verification
47. Error Handling Verification
48. Database Integrity Verification
49. Concurrency Verification
50. Idempotency Verification
51. State Synchronization Verification
52. Browser Runtime Verification
53. Responsive Verification
54. RTL/LTR Verification
55. Accessibility Verification
56. Performance Verification
57. Test Suite Audit
58. Commands and Exact Results
59. Remediation Plan
60. Implemented Fixes
61. Retest Results
62. Cross-System Invariants
63. Static/Dynamic Classification
64. Configuration Requirements
65. Remaining Limitations
66. Open Findings
67. Final Evidence Matrix
68. Final Proof Table
69. Security Verdict
70. Functionality Verdict
71. Dynamic-System Verdict
72. Synchronization Verdict
73. Production Readiness Verdict
74. Final Conclusion

---

# 58. FINAL VERDICT RULES

Use:

`SYSTEM FORENSICALLY VERIFIED`

ONLY if all critical business domains have actual runtime evidence and no unresolved material defect remains.

Use:

`SYSTEM FORENSICALLY VERIFIED WITH CONFIGURATION REQUIRED`

if the system is otherwise verified but external providers prevent specific verification.

Use:

`SYSTEM PARTIALLY VERIFIED`

if important runtime/database evidence is missing.

Use:

`SYSTEM VERIFICATION FAILED — REMEDIATION REQUIRED`

if material defects remain.

---

# 59. DO NOT SAY "100%"

Do not use:

* 100% dynamic
* 100% secure
* 100% complete
* zero defects

unless the evidence genuinely supports the exact statement.

Prefer precise statements such as:

`All tested product mutations persisted correctly.`

rather than:

`The entire system is 100% dynamic.`

---

# 60. FINAL HONESTY AUDIT

Before saving the report:

Search the report itself for:

* VERIFIED
* PASSED
* COMPLETE
* SECURE
* DYNAMIC
* SYNCHRONIZED
* FUNCTIONAL
* PRODUCTION READY

For every occurrence verify that evidence exists.

Downgrade unsupported claims.

---

# 61. REQUIRED FINAL HEADER

At the beginning of the report:

```text
FINAL SYSTEM STATUS:
[REAL STATUS]

VERIFICATION DATE:
[REAL DATE]

REPOSITORY:
[REAL REPOSITORY]

SCOPE:
[REAL SCOPE]

CRITICAL:
[REAL NUMBER]

HIGH:
[REAL NUMBER]

MEDIUM:
[REAL NUMBER]

LOW:
[REAL NUMBER]

CONFIGURATION REQUIRED:
[REAL NUMBER]

NOT VERIFIED:
[REAL NUMBER]

FAILED:
[REAL NUMBER]
```

---

# 62. FINAL CHAT RESPONSE

After completion, respond briefly with:

* Prompt 57 executed
* final report path
* final status
* findings counts
* configuration requirements
* unverified items

Do not provide unsupported claims.

---

# 63. STOP

After completing Prompt 57:

STOP.

Do not execute another prompt.

Do not add unrelated features.

Do not redesign unrelated UI.

Do not change functionality unless required to fix a finding discovered by this verification.

---

# FINAL PRINCIPLE

**The report is not a marketing document.**

**The report is forensic evidence.**

**If the system fails, document the failure.**

**If a feature is incomplete, document it.**

**If a claim cannot be proven, mark it NOT VERIFIED.**

**If a provider cannot be tested, mark CONFIGURATION REQUIRED.**

**If a bug is found, fix it and prove the fix.**

**Never manufacture evidence.**

**Never optimize the report for a positive conclusion.**

**Optimize exclusively for truth.**
