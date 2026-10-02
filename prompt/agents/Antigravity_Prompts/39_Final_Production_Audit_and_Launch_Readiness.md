# Prompt 39 — Final Production Audit & Launch Readiness

## Execution Protocol — Mandatory

You are operating on the authorized local repository:

`https://github.com/EyadAbduljalil/Online_shope.git`

Follow the mandatory Antigravity execution protocol exactly:

1. First create:
   `Antigravity_Prompts/39_Final_Production_Audit_and_Launch_Readiness.md`
2. Write this complete prompt into that file.
3. Read the Markdown file completely.
4. Execute ONLY from that Markdown file.
5. Do not ask the user for approval between steps.
6. Read the relevant previous reports, especially:

   * Prompt 36 Production Readiness Report
   * Prompt 37 Final Security Verification Report
   * Prompt 38 Security Remediation & Retest Report
7. Inspect the actual repository rather than trusting reports blindly.
8. Make only safe, evidence-based production-readiness fixes.
9. Do not introduce new features.
10. Do not introduce real secrets or credentials.
11. Do not deploy to production.
12. Do not access external production systems.
13. Do not perform destructive testing.
14. Do not claim a live production deployment was verified unless it actually was.
15. After the audit, create:
    `Antigravity_Prompts/39_Final_Production_Audit_and_Launch_Readiness_Report.md`
16. Stop after Prompt 39. Do not automatically start another prompt.

---

# Objective

Perform the final production audit of the ecommerce platform.

Determine whether the project is ready to be deployed and operated in a real production environment.

The audit must evaluate:

* Application correctness
* Security
* Production configuration
* Database readiness
* Payments
* Email
* Redis
* Monitoring
* Logging
* Backups/recovery
* Frontend production behavior
* Backend production behavior
* Deployment safety
* Operational readiness
* Documentation
* Dependency health
* Final regression status

The objective is not merely "the build passes."

---

# 1. Read Previous Security and Production Reports

Read:

`Antigravity_Prompts/36_Production_Readiness_Audit_Report.md`

`Antigravity_Prompts/37_Final_Security_Verification_Report.md`

`Antigravity_Prompts/38_Security_Remediation_and_Retest_Report.md`

Cross-check their conclusions against the current repository.

Identify any contradictions.

---

# 2. Repository Integrity

Verify:

* Git status
* Unexpected generated files
* Sensitive files
* `.env` files
* Debug artifacts
* Temporary files
* Test outputs
* Logs
* Build artifacts
* Development-only configuration
* Hardcoded secrets
* Placeholder production credentials

Perform a final secret scan.

---

# 3. Environment Configuration

Audit all environment variables.

Classify each as:

* Required in production
* Optional
* Development-only
* Test-only
* Generated
* Secret
* Public configuration

Verify:

* `.env.example`
* Production validation
* Required variables
* Default values
* Weak/default secret rejection
* Payment configuration
* Database configuration
* Redis configuration
* Email configuration
* Sentry configuration
* CORS
* Frontend API URL

Ensure production cannot accidentally run with insecure development defaults.

---

# 4. Backend Production Configuration

Verify:

* NODE_ENV
* Express configuration
* Trust proxy
* CORS
* Helmet
* Cookies
* JWT
* CSRF
* Body limits
* Rate limiting
* Request correlation
* Error handling
* Graceful shutdown
* Health endpoints
* Readiness endpoint
* Logging
* Sentry

Check startup behavior for missing critical production configuration.

---

# 5. Database Production Readiness

Audit:

* PostgreSQL
* Prisma schema
* Prisma client
* Migrations
* Indexes
* Unique constraints
* Foreign keys
* Transactions
* Connection pooling
* Connection timeout behavior
* Retry behavior
* Migration safety
* Seed separation

Verify:

* Production startup does not silently depend on development seed data.
* Destructive migrations are not accidentally part of normal startup.
* Database errors are handled safely.

Do not modify production databases.

---

# 6. Data Integrity

Verify business-critical invariants:

* Users
* Products
* Categories
* Brands
* Product variants
* Inventory
* Orders
* Order items
* Payments
* Coupons
* Reviews
* Notifications
* Audit logs

Check referential integrity and transaction boundaries.

---

# 7. Authentication and Security Final Check

Verify final state after Prompt 38:

* Authentication
* Authorization
* RBAC
* Security Registry
* Global Guard
* Ownership Guard
* CSRF
* JWT
* Cookies
* Rate limiting
* Idempotency
* Audit logs
* Threat detection
* Error handling
* Security headers
* CORS
* Secret management

No material security regression may remain.

---

# 8. Payment Production Readiness

Audit payment integration.

Verify:

* Production provider configuration
* Secret requirements
* Webhook secret requirements
* Signature verification
* Raw body handling
* Idempotency
* Payment state transitions
* Order state transitions
* Failed payments
* Duplicate webhook behavior
* Refund/cancellation handling if implemented

Do not use real payment credentials.

If configuration cannot be verified locally, classify it clearly as:

`CONFIGURATION REQUIRED`

Do not label the entire application insecure merely because real deployment credentials are intentionally absent.

---

# 9. Email and Notification Readiness

Verify:

* Email provider configuration
* SMTP/API credentials
* Password reset emails
* Order emails
* Payment emails
* Notification behavior
* Failure handling
* Retry behavior if implemented
* No credentials in source code

If provider configuration is intentionally absent, classify it as configuration required.

---

# 10. Redis and Background Operations

If Redis is used:

Verify:

* Connection configuration
* Authentication
* TLS expectations where applicable
* Failure behavior
* Queue behavior
* Retry behavior
* Duplicate job protection
* Graceful degradation

If Redis is optional, verify the fallback behavior does not silently compromise security or data integrity.

---

# 11. Monitoring and Observability

Verify:

* Structured logging
* Request correlation IDs
* Error logging
* Audit logging
* Sentry configuration
* Health checks
* Readiness checks
* Operational errors
* Security alerts

Ensure sensitive data is not emitted to logs.

---

# 12. Backup and Recovery Readiness

Inspect repository documentation and operational configuration for:

* Database backup strategy
* Backup frequency
* Retention
* Restore procedure
* Recovery Point Objective
* Recovery Time Objective
* Disaster recovery considerations

Do not claim backups exist unless evidence exists.

If backup/recovery must be configured externally, mark it:

`OPERATIONAL CONFIGURATION REQUIRED`

---

# 13. Deployment Readiness

Inspect available deployment configuration:

* Docker
* Docker Compose
* CI/CD
* Reverse proxy
* HTTPS
* Environment injection
* Build process
* Start commands
* Migration commands
* Static asset handling
* Frontend deployment
* Backend deployment

Do not invent deployment infrastructure that is not present.

Where infrastructure is absent, document the exact external configuration required.

---

# 14. Frontend Production Readiness

Verify:

* Production build
* API configuration
* Environment variables
* Routing
* Error handling
* Loading states
* Empty states
* Authentication state
* Checkout flow
* Orders
* Admin routes
* Responsive behavior
* RTL/LTR
* No development-only URLs
* No hardcoded localhost production dependency
* No exposed secrets

---

# 15. Admin Production Readiness

Verify:

* Admin authentication
* Admin authorization
* Dashboard
* Products
* Categories
* Brands
* Inventory
* Orders
* Customers
* Coupons
* Reviews
* Payments
* Notifications
* Audit logs
* Settings if implemented

Ensure sensitive admin data is appropriately protected.

---

# 16. Storefront Production Readiness

Verify:

* Home page
* Product listing
* Product search
* Filters
* Product details
* Cart
* Wishlist
* Checkout
* Payment
* Order confirmation
* Order tracking
* Account
* Login
* Registration

Ensure the UI does not imply capabilities that the backend does not support.

---

# 17. Performance Readiness

Inspect:

* Database query patterns
* N+1 risks
* Pagination
* Search
* Product listing
* Admin tables
* API payload size
* Frontend bundles
* Images
* Lazy loading
* Caching where implemented
* Rate limiting
* Connection pooling

Do not perform destructive load testing.

Document any material performance risks.

---

# 18. Accessibility and UX Readiness

Verify:

* Keyboard navigation
* Focus states
* Form labels
* Error messages
* Buttons
* Links
* Contrast
* Responsive layouts
* Mobile usability
* Arabic RTL
* English LTR

Do not introduce unrelated redesign work.

---

# 19. Dependency and Build Health

Run:

* npm audit
* Dependency checks
* Backend lint
* Frontend lint
* Backend typecheck
* Frontend typecheck
* Backend build
* Frontend build
* Backend tests
* Security tests
* Secret scan

Record exact results.

---

# 20. End-to-End Business Workflow Verification

Using local/test data only, verify the core lifecycle:

### Customer

1. Register
2. Login
3. Browse products
4. Search/filter
5. View product
6. Add to cart
7. Update cart
8. Checkout
9. Payment flow where safely mockable
10. Order creation
11. Order viewing/tracking
12. Review where supported

### Admin

1. Login
2. Dashboard
3. Product management
4. Category/brand management
5. Inventory
6. Orders
7. Customers
8. Coupons
9. Reviews
10. Payments
11. Notifications
12. Audit logs

Do not use real payment transactions.

---

# 21. Production Risk Classification

Every remaining issue must be classified as:

* BLOCKER
* HIGH RISK
* MEDIUM RISK
* LOW RISK
* CONFIGURATION REQUIRED
* OPERATIONAL CONFIGURATION REQUIRED
* INFORMATIONAL
* NOT APPLICABLE

Do not confuse missing external infrastructure with an application-code vulnerability.

---

# 22. Launch Gate

The final launch decision must be one of:

### `PRODUCTION READY`

Use only when:

* No blockers remain
* No unresolved Critical/High/Medium security findings remain
* Builds pass
* Tests pass
* Required production configuration is known
* No secrets are exposed
* Critical workflows are verified
* Deployment procedure is sufficiently documented

### `PRODUCTION READY — CONFIGURATION REQUIRED`

Use when:

* Application code is ready
* Security is acceptable
* Remaining requirements are deployment/provider/operational configuration
* No material application defect blocks launch

Clearly list every required configuration item.

### `NOT PRODUCTION READY`

Use when:

* Material code/security/business-logic issues remain
* Critical workflows fail
* Security findings remain
* Data integrity is unsafe
* Deployment cannot safely operate

Do not use "production ready" merely because the application builds.

---

# 23. Final Launch Checklist

Create a concise checklist covering:

## Security

* Secrets
* Auth
* RBAC
* CSRF
* BOLA/IDOR
* Headers
* CORS
* Rate limits
* Idempotency
* Audit
* Webhooks

## Application

* Storefront
* Cart
* Checkout
* Orders
* Admin

## Infrastructure

* PostgreSQL
* Redis
* Email
* Payment provider
* Sentry
* HTTPS
* Reverse proxy
* Backups

## Operations

* Logging
* Monitoring
* Alerts
* Health checks
* Recovery
* Deployment
* Rollback

---

# 24. Required Final Report

Create:

`Antigravity_Prompts/39_Final_Production_Audit_and_Launch_Readiness_Report.md`

Include:

1. Executive Summary
2. Previous Audit Review
3. Repository Integrity
4. Environment Audit
5. Backend Production Audit
6. Database Audit
7. Data Integrity Audit
8. Security Audit
9. Payment Audit
10. Email/Notification Audit
11. Redis/Queue Audit
12. Monitoring/Observability Audit
13. Backup/Recovery Audit
14. Deployment Audit
15. Frontend Audit
16. Admin Audit
17. Storefront Audit
18. Performance Audit
19. Accessibility/UX Audit
20. Dependency Audit
21. End-to-End Workflow Results
22. Remaining Risks
23. Required Configuration
24. Final Launch Checklist
25. Final Production Status

Include exact test results.

Include exact unresolved items.

Do not conceal configuration requirements.

Do not claim live infrastructure was tested when it was not.

---

# Completion Criteria

Prompt 39 is complete only when:

* Prompt 36, 37, and 38 reports were reviewed.
* Current repository state was independently checked.
* Final security state was verified.
* Production configuration was audited.
* Database readiness was audited.
* Payment readiness was audited.
* Email/Redis/monitoring requirements were audited.
* Frontend and admin production readiness were audited.
* Core workflows were verified using safe local/test data.
* Builds pass.
* Tests pass.
* Lint/typecheck pass.
* Secret scan passes.
* Dependency audit is documented.
* All remaining risks are classified.
* All required production configuration is documented.
* Final launch decision is explicit.
* Final report exists.
* Execution stops.

END OF PROMPT 39
