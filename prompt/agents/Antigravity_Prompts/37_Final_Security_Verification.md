# Prompt 37 — Final Security Verification

## Execution Protocol — Mandatory

You are operating on the authorized local repository:

`https://github.com/EyadAbduljalil/Online_shope.git`

Follow the project's mandatory Antigravity execution protocol exactly:

1. First create this exact prompt file:
   `Antigravity_Prompts/37_Final_Security_Verification.md`
2. Write this complete prompt into that file.
3. Read the Markdown file completely.
4. Execute ONLY from the Markdown file.
5. Do not ask the user for approval between steps.
6. Perform all verification in the local authorized project/test environment only.
7. Do NOT test production systems.
8. Do NOT use real credentials, real payment credentials, real customer data, or real secrets.
9. Do NOT perform destructive testing, flooding, denial-of-service testing, persistence, credential attacks, or exploitation intended to compromise systems.
10. Do not make substantial remediation changes in this stage. This stage is verification and classification. Findings must be documented for Prompt 38.
11. After verification, create:
    `Antigravity_Prompts/37_Final_Security_Verification_Report.md`
12. The report must contain the exact checks performed, results, evidence, findings, severity, configuration requirements, and final status.
13. Run all relevant tests, lint, typecheck, build, and security checks.
14. Stop after Prompt 37 is complete. Do NOT start Prompt 38 automatically.

---

# Objective

Perform a final, comprehensive, defensive security verification of the ecommerce platform after all previous architecture, security, remediation, LMS security-port, storefront, admin, QA, and production-readiness work.

The goal is to determine whether any meaningful security weakness, regression, configuration gap, or architectural inconsistency remains.

This is an authorized defensive verification of the repository.

Do not turn this into offensive exploitation.

---

# 1. Security Architecture Inventory

Inspect the current implementation and identify all security controls, including where applicable:

* Authentication
* JWT/session handling
* HttpOnly cookies
* CSRF protection
* RBAC
* Admin authorization
* Security Registry
* Global Security Guard
* Ownership/BOLA protection
* Rate limiting
* Request correlation IDs
* Idempotency
* Input validation
* Prisma/database protections
* Audit logging
* Threat detection
* Error handling
* Security headers
* CORS
* Environment validation
* Production fail-fast configuration
* Health/readiness endpoints
* Graceful shutdown
* Sentry
* Redis
* Payment webhook verification
* Sensitive-data redaction

Compare the actual implementation with the intended architecture.

---

# 2. Authentication and Session Security

Verify defensively:

* Login authentication
* Registration
* Password hashing
* Password verification
* JWT creation
* JWT validation
* Token expiration
* HttpOnly cookie behavior
* Secure cookie behavior in production
* SameSite configuration
* Logout/session invalidation behavior
* Authentication middleware
* Unauthorized responses
* Authentication error behavior
* Protection against authentication bypass
* Protection against accidental token exposure
* No secrets embedded in frontend code

Do not attempt credential attacks.

---

# 3. CSRF Protection

Verify:

* CSRF middleware configuration
* CSRF token generation
* CSRF token validation
* State-changing requests
* Cookie configuration
* Production secure-cookie requirements
* Compatibility with frontend requests
* Exempt/public routes
* Protection against accidental CSRF bypass

Do not use destructive requests.

---

# 4. Authorization and RBAC

Verify every major protected administrative capability.

Check:

* Customer vs admin authorization
* Admin-only routes
* Role enforcement
* Security Registry policies
* Global Security Guard behavior
* Default-deny behavior where intended
* Public-route exceptions
* Unauthorized access behavior
* Privilege escalation prevention
* Mass assignment protection
* Ownership checks

Ensure authorization is enforced server-side rather than only in the frontend.

---

# 5. BOLA / IDOR Verification

Review resource ownership enforcement for:

* Orders
* Customer accounts
* Addresses
* Cart
* Wishlist
* Reviews
* Payments
* Notifications
* Admin resources
* Other user-owned resources

Verify that a user cannot access another user's resources by changing identifiers.

Use safe local/test fixtures only.

Do not attempt to access real users or external systems.

---

# 6. Input Validation and Injection Resistance

Verify defensive protections against:

* SQL injection
* Unsafe raw database queries
* Prisma misuse
* NoSQL injection patterns where irrelevant
* XSS
* HTML injection
* Malicious strings
* Invalid IDs
* Invalid UUIDs
* Invalid numbers
* Invalid currencies
* Invalid quantities
* Oversized payloads
* Unexpected object properties
* Mass assignment
* Type confusion

Confirm that database access remains parameterized through Prisma or equivalent safe mechanisms.

Do not execute destructive payloads.

---

# 7. SSRF / File / Path Security

Only where functionality exists, review:

* URL fetching
* Remote image handling
* File uploads
* Static asset serving
* Filename handling
* Path traversal protection
* Directory traversal protection
* Unsafe file type handling
* MIME validation
* File size limits

If a capability does not exist, explicitly mark it as:

`NOT APPLICABLE`

Do not invent functionality.

---

# 8. Rate Limiting and Abuse Protection

Verify appropriate rate limits for:

* Authentication
* Registration
* Password-related endpoints if present
* Product search
* Product details
* Checkout
* Payment-related endpoints
* Webhooks
* Admin-sensitive operations
* Public API endpoints

Confirm:

* Correct limiter attachment
* Reasonable configuration
* No accidental global denial
* Correct proxy/IP handling
* Production trust-proxy configuration
* Rate-limit behavior under safe local test conditions

Do not perform flooding or denial-of-service testing.

---

# 9. Idempotency and Replay Protection

Verify idempotency where financially or operationally important:

* Checkout
* Payment creation
* Order creation
* Payment webhooks
* Other retry-sensitive operations

Check:

* Idempotency key handling
* Duplicate request behavior
* Duplicate webhook behavior
* Safe retry behavior
* Consistent response behavior
* Storage/expiration behavior if implemented

---

# 10. Financial Integrity

Verify that the server remains authoritative for:

* Product prices
* Variant prices
* Quantities
* Discounts
* Coupons
* Shipping
* Taxes if implemented
* Subtotals
* Grand totals
* Payment amounts
* Order totals

Verify that clients cannot safely manipulate financial values by changing frontend payloads.

Check coupon validation and discount calculations.

Do not interact with real payment providers.

---

# 11. Inventory Integrity

Verify:

* Stock validation
* Server-authoritative inventory
* Quantity validation
* Transaction boundaries
* Concurrent order behavior
* Overselling protection
* Stock restoration where applicable
* Inventory consistency after order/payment state changes

Use local/test fixtures only.

---

# 12. Payment and Webhook Security

Inspect payment implementation and verify:

* Webhook signature verification
* Raw request body requirements
* Webhook secret handling
* Environment configuration
* Production fail-fast behavior
* Duplicate webhook protection
* Event validation
* Payment/order state consistency
* No trust in client-supplied payment state
* No hardcoded credentials

If a real webhook secret is intentionally absent from the local environment, classify it as:

`CONFIGURATION REQUIRED`

Do not invent or generate real credentials.

---

# 13. Audit Logging and Sensitive Data Protection

Verify audit logging captures important security-sensitive operations.

Check:

* Actor
* Action
* Target
* Correlation ID
* Timestamp
* Severity
* Status
* Context
* Metadata
* Security events

Verify sensitive fields are redacted.

Pay particular attention to:

* Passwords
* JWTs
* Cookies
* Authorization headers
* Payment secrets
* Webhook secrets
* API keys
* Personal credentials

Ensure logs do not accidentally leak secrets.

---

# 14. Threat Detection

Review the current threat detection implementation for:

* Credential stuffing detection
* Brute-force indicators
* Suspicious access
* Mass data access
* Impossible-travel logic if present
* Security alert generation
* False-positive risks
* Safe failure behavior

Do not copy unsafe LMS assumptions blindly.

Identify any logic that could cause:

* Excessive false positives
* Account lockout abuse
* Privacy problems
* Security bypass
* Operational instability

Classify findings rather than broadly rewriting the system.

---

# 15. Error Handling and Information Leakage

Verify:

* Production error responses
* Stack trace suppression
* Database error leakage
* Authentication error leakage
* Validation error safety
* Internal path leakage
* Environment variable leakage
* Secret leakage
* Debug mode behavior

Ensure errors are useful without exposing internal implementation details.

---

# 16. HTTP Security

Verify:

* Helmet/security headers
* Content Security Policy where configured
* X-Content-Type-Options
* Frame protection
* Referrer policy
* CORS
* Allowed origins
* Credentials configuration
* HTTPS assumptions
* Proxy configuration
* Cookie security
* Body size limits

Pay special attention to production behavior.

---

# 17. Environment and Secret Security

Verify:

* `.env` is ignored
* Secrets are not committed
* `.env.example` contains placeholders only
* Production startup validation
* JWT secret strength requirements
* Payment webhook secret requirements
* CORS production restrictions
* Database configuration
* Redis configuration
* Sentry configuration
* No hardcoded credentials
* No private keys
* No tokens
* No API keys
* No production secrets in test fixtures

Perform a safe repository secret scan.

---

# 18. Production Configuration

Review:

* NODE_ENV
* CORS
* Cookies
* JWT
* Database
* Prisma
* Redis
* Sentry
* Payment provider
* Webhooks
* Email
* Rate limiting
* Proxy trust
* Logging
* Error handling
* Health/readiness
* Graceful shutdown

Verify development defaults cannot silently become unsafe production defaults.

---

# 19. Dependency Security

Run appropriate dependency security checks.

Inspect:

* npm audit
* Lockfiles
* Direct dependencies
* Security-sensitive packages
* Outdated critical packages
* Known vulnerabilities

Do not automatically upgrade dependencies during this verification stage unless absolutely necessary to make a security check executable.

Classify dependency findings separately.

---

# 20. Test and Build Verification

Run:

* Backend tests
* Frontend tests if present
* Backend lint
* Frontend lint
* Backend typecheck
* Frontend typecheck
* Backend build
* Frontend build
* Security-specific tests
* Repository secret scan
* Dependency audit

Record exact results.

---

# 21. Security Regression Review

Compare the current implementation against previous security work, especially:

* Prompt 25
* Prompt 26
* Prompt 27
* Prompt 28
* Prompt 29
* Prompt 30
* Prompt 36

Look specifically for regressions caused by:

* Admin changes
* Product-management changes
* Storefront changes
* Checkout changes
* Payment changes
* New middleware
* New routes
* New frontend API calls
* Production hardening

---

# 22. Findings Classification

Every finding must be classified as exactly one of:

* CRITICAL
* HIGH
* MEDIUM
* LOW
* INFORMATIONAL
* CONFIGURATION REQUIRED
* NOT APPLICABLE

For every finding provide:

* ID
* Severity
* Component
* Description
* Evidence
* Security impact
* Reproduction/verification method in safe local terms
* Recommended remediation
* Whether Prompt 38 should address it

Do not exaggerate theoretical risks.

---

# 23. Final Security Status

Calculate:

* Critical count
* High count
* Medium count
* Low count
* Informational count
* Configuration Required count
* Not Applicable count

Use one final status:

### `SECURITY VERIFICATION PASSED`

Only if there are no Critical/High/Medium findings and no unresolved security regression.

### `SECURITY VERIFICATION PASSED — CONFIGURATION REQUIRED`

If the code is secure but deployment configuration is still required.

### `SECURITY VERIFICATION FAILED — REMEDIATION REQUIRED`

If meaningful security findings remain.

Do not declare the project production-secure merely because tests pass.

---

# 24. Required Report

Create:

`Antigravity_Prompts/37_Final_Security_Verification_Report.md`

The report must include:

1. Executive Summary
2. Scope
3. Authorization and Safety Boundaries
4. Security Architecture Inventory
5. Authentication Results
6. CSRF Results
7. Authorization/RBAC Results
8. BOLA/IDOR Results
9. Input Validation Results
10. Injection Security Results
11. Rate Limiting Results
12. Idempotency Results
13. Financial Integrity Results
14. Inventory Integrity Results
15. Payment/Webhook Results
16. Audit Logging Results
17. Threat Detection Results
18. Error Leakage Results
19. HTTP Security Results
20. Environment/Secrets Results
21. Production Configuration Results
22. Dependency Audit Results
23. Test/Build Results
24. Security Regression Results
25. Findings Table
26. Remediation Priorities
27. Final Security Status

Do not hide configuration requirements.

Do not claim that a control was verified if it could not actually be verified.

---

# Completion Criteria

Prompt 37 is complete only when:

* The full security architecture has been reviewed.
* Major attack surfaces have been defensively verified.
* No unauthorized/external testing was performed.
* No destructive testing was performed.
* Security findings are accurately classified.
* No substantial remediation was performed.
* All relevant automated checks were executed.
* `37_Final_Security_Verification_Report.md` exists.
* The final security status is explicitly stated.
* Execution stops.

END OF PROMPT 37
