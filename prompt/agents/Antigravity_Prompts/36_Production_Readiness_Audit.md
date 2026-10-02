# Prompt 36 — Production Readiness Audit & Deployment Hardening

## Objective

Perform a comprehensive Production Readiness Audit of the complete ecommerce application and harden the project for a real production deployment.

The objective is to determine whether the application can safely transition from development/testing into production.

This stage must inspect the complete deployment chain:

* Frontend
* Backend
* PostgreSQL
* Prisma
* Environment configuration
* Authentication
* Cookies
* CORS
* HTTPS assumptions
* Payments
* Webhooks
* Email
* Redis
* Sentry
* Logging
* Health checks
* Graceful shutdown
* Rate limiting
* File handling
* Build configuration
* Deployment configuration
* Secrets
* Dependencies
* Database migrations
* Operational configuration

This is a production-readiness audit and hardening stage.

Do not simply run `build` and declare the application production-ready.

---

# 1. Mandatory Execution Protocol

Before implementation:

1. Create:

`Antigravity_Prompts/36_Production_Readiness_Audit.md`

2. Write this complete prompt into that file.

3. Read the Markdown file completely.

4. Execute ONLY from the Markdown file.

5. Inspect the entire project before making changes.

6. Do not assume previous production configuration is correct.

7. Do not invent credentials.

8. Do not create real secrets.

9. Do not commit secrets.

10. Do not use real payment credentials.

11. Do not perform destructive production operations.

12. Do not automatically start Prompt 37.

13. Create:

`Antigravity_Prompts/36_Production_Readiness_Audit_Report.md`

14. Fix safe production-readiness defects discovered during the audit.

15. Rerun validation after fixes.

16. Clearly document anything requiring real infrastructure or operator configuration.

17. Stop after Prompt 36 is complete.

---

# 2. Full Project Structure Audit

Inspect:

* Root project
* Frontend
* Backend
* Prisma
* Configuration
* Environment files
* Scripts
* Deployment files
* Docker files if present
* CI/CD configuration if present
* Documentation
* Test configuration
* Build configuration
* Static assets

Identify:

* Development-only code
* Production configuration
* Missing configuration
* Unsafe defaults
* Debug behavior
* Temporary code
* Secrets
* Hardcoded credentials
* Hardcoded URLs
* Hardcoded localhost assumptions

---

# 3. Environment Configuration

Audit all environment variables.

Inspect:

* `.env`
* `.env.example`
* `.env.local`
* `.env.production`
* Backend environment configuration
* Frontend environment configuration
* Runtime configuration

Ensure:

* Production secrets are never committed.
* `.env` files containing secrets are ignored.
* `.env.example` contains placeholders only.
* Required production variables are clearly documented.
* Development defaults cannot silently become production defaults.
* Sensitive variables are never exposed to the frontend unintentionally.

Do not invent values for:

* JWT secrets
* Encryption keys
* Database passwords
* Payment secrets
* Webhook secrets
* SMTP passwords
* Sentry DSNs
* Redis credentials

Use placeholders where necessary.

---

# 4. Secret Leakage Audit

Search the entire repository for likely secrets.

Look for:

* API keys
* JWT secrets
* Database credentials
* Stripe/payment secrets
* Webhook secrets
* SMTP credentials
* Private keys
* Access tokens
* Cloud credentials
* Hardcoded passwords

Check:

* Source code
* Config files
* Scripts
* Documentation
* Test files
* Example files
* Git-tracked files

If an actual secret is found:

1. Do not expose it in the report.
2. Remove it from source if safe.
3. Replace it with environment configuration.
4. Document that the secret must be rotated.
5. Do not invent a replacement secret.

---

# 5. Git Safety

Inspect:

* `.gitignore`
* Git-tracked environment files
* Generated files
* Build output
* Logs
* Temporary files
* Local configuration

Ensure sensitive files are not accidentally tracked.

Pay attention to:

* `.env`
* `.env.*`
* credentials
* certificates
* private keys
* local database files
* logs

Do not blindly ignore files required for deployment.

---

# 6. Backend Production Configuration

Inspect backend startup configuration.

Verify:

* `NODE_ENV`
* Port configuration
* Host configuration
* CORS
* Cookies
* Trust proxy
* Helmet/security headers
* Body size limits
* Request IDs
* Rate limiting
* Error handling
* Logging
* Graceful shutdown

Production behavior must be deliberate.

Avoid development-only behavior in production.

---

# 7. CORS

Review CORS configuration.

Ensure production does NOT default to:

* `*`
* Any-origin access
* Development localhost origins

Production allowed origins must come from controlled configuration.

Credentials must only be enabled when required.

Ensure CORS does not conflict with:

* HttpOnly cookies
* Authentication
* CSRF
* Frontend origin

Do not weaken CORS simply to make requests work.

---

# 8. Cookie Security

Audit authentication cookies.

Production cookies should appropriately use:

* `HttpOnly`
* `Secure`
* Appropriate `SameSite`
* Correct domain/path
* Correct expiration

Do not blindly copy development cookie settings into production.

Ensure HTTPS assumptions are documented.

---

# 9. Authentication Configuration

Review:

* JWT secret configuration
* Token expiration
* Refresh mechanism if implemented
* Cookie-based authentication
* Password hashing
* Authentication middleware
* Admin authentication

Ensure:

* Production secrets are externalized.
* Weak defaults are rejected.
* Authentication cannot silently start with a development secret.

If production configuration is invalid, fail safely rather than silently weakening security.

---

# 10. Database Configuration

Audit PostgreSQL configuration.

Review:

* Database URL
* Connection pooling
* Connection limits
* SSL requirements where appropriate
* Connection timeouts
* Query timeouts where supported
* Prisma configuration
* Migration strategy

Do not expose database credentials.

---

# 11. Prisma and Database Migrations

Inspect:

* `schema.prisma`
* Migration directory
* Migration scripts
* Deployment scripts
* Seed scripts

Verify production deployment uses a safe migration strategy.

Do NOT use destructive development commands against production databases.

Do not run destructive migrations.

Document:

* Migration command
* Deployment order
* Required backup procedure

if these are currently documented or can be safely documented.

---

# 12. Database Integrity

Review important relational constraints.

Pay attention to:

* Orders
* Order items
* Products
* Inventory
* Coupons
* Reviews
* Users
* Payments

Verify:

* Foreign keys
* Unique constraints
* Required fields
* Appropriate indexes

Do not redesign the entire database unless a clear production blocker is discovered.

---

# 13. Transaction Safety

Review production-critical workflows:

* Checkout
* Order creation
* Inventory changes
* Payment updates
* Coupon usage
* Product mutations

Ensure existing transactions are actually used where required.

Do not move business authority to the frontend.

---

# 14. Financial Configuration

Review payment configuration.

Verify:

* Provider configuration
* Secret handling
* Webhook secret handling
* Webhook endpoint
* Signature verification
* Payment state transitions
* Idempotency

Production payment configuration must fail safely if mandatory secrets are missing.

Do not use test credentials as production credentials.

Do not claim payment production readiness unless actual authorized configuration exists.

---

# 15. Webhook Configuration

Review payment webhooks.

Verify:

* Signature verification
* Raw-body requirements where applicable
* Secret configuration
* Idempotency
* Duplicate event handling
* Safe error handling

Do not disable signature verification to simplify development.

---

# 16. Email Configuration

Inspect email configuration.

Verify:

* SMTP/provider configuration
* Credentials
* From address
* TLS/security
* Failure handling
* Environment separation

Do not put SMTP passwords in source.

Do not send real emails during testing unless explicitly configured for an authorized test environment.

---

# 17. Redis Configuration

If Redis is used:

Inspect:

* Connection URL
* Credentials
* TLS where appropriate
* Retry behavior
* Queue configuration
* Graceful degradation

Verify the application behaves safely when Redis is unavailable.

Do not silently degrade security-critical functionality.

---

# 18. Sentry / Observability

If Sentry is integrated:

Verify:

* Production-only initialization where appropriate
* DSN configuration
* Error capture
* Sensitive-data handling
* Environment tagging
* Release information where practical

Do not expose Sentry secrets in frontend code unless the SDK architecture explicitly requires a public DSN.

Avoid sending sensitive customer/payment data unnecessarily.

---

# 19. Logging

Audit logging and application logging.

Verify:

* Structured logs
* Correlation/request IDs
* Error context
* Security events
* Audit events

Ensure logs do NOT contain:

* Passwords
* Password hashes
* JWTs
* API keys
* Payment secrets
* Webhook secrets
* Full payment credentials
* Sensitive personal data unnecessarily

Ensure log verbosity is appropriate for production.

---

# 20. Error Handling

Production errors must be safe.

Verify that production responses do not expose:

* Stack traces
* File paths
* SQL queries
* Database errors
* Internal architecture
* Secrets
* Environment variables

Ensure:

* Client receives safe messages.
* Server logs retain useful diagnostic context.
* Correlation ID is available for troubleshooting where appropriate.

---

# 21. Health Checks

Review:

* Liveness
* Readiness
* Health endpoints

Ensure health checks distinguish between:

### Liveness

The process is alive.

### Readiness

Required dependencies are available enough to serve traffic.

Do not expose unnecessary internal diagnostic information publicly.

Do not make health checks perform expensive operations.

---

# 22. Graceful Shutdown

Verify the server handles:

* SIGTERM
* SIGINT
* Active requests
* Database connections
* Redis connections
* Queues
* HTTP server

The application should stop accepting new work and close resources safely.

Do not terminate immediately while active operations are being processed.

---

# 23. Rate Limiting

Review production rate limits.

Ensure appropriate protection exists for:

* Login
* Registration
* Password reset
* Search
* Product details
* Checkout
* Coupons
* Reviews
* Admin mutations
* Webhooks

Avoid both:

* Missing limits
* Excessively aggressive limits that break legitimate customers

Rate limits should be environment-aware where appropriate.

---

# 24. Request Body Limits

Verify:

* JSON body size
* URL encoded body size
* Upload limits if applicable

Prevent unnecessarily large requests.

Do not choose arbitrary huge limits.

---

# 25. File Uploads

If the application supports uploads, audit:

* File type validation
* File size
* Storage location
* Filename handling
* MIME validation
* Authorization
* Path traversal protection
* Image processing

Never trust file extensions alone.

Do not allow arbitrary executable files.

---

# 26. Static Assets

Review:

* Frontend build
* Static assets
* Source maps
* Public configuration

Determine whether production source maps expose information that should remain private.

Do not automatically disable source maps if they are intentionally required for error monitoring.

Use a deliberate configuration.

---

# 27. Frontend Production Configuration

Review:

* API base URL
* Environment variables
* Build-time configuration
* Public configuration
* Authentication configuration
* CORS assumptions
* Asset paths

Ensure:

* No localhost API URL remains accidentally.
* No development server assumptions remain.
* No private backend secret is bundled into the frontend.

---

# 28. Frontend Environment Security

Search frontend source and build configuration for:

* API keys
* Private tokens
* Secrets
* Database credentials
* Payment secrets

Only intentionally public configuration may be exposed.

Never put server secrets into frontend environment variables.

---

# 29. Authentication in Production

Verify the production flow:

`Browser → HTTPS → Frontend → Backend → HttpOnly Cookie → Auth Middleware`

Ensure:

* Cookies are secure.
* CORS is compatible.
* CSRF remains active where required.
* Token expiration is appropriate.
* Logout clears authentication correctly.

---

# 30. Security Headers

Verify production headers including where appropriate:

* HSTS
* Content-Security-Policy
* X-Content-Type-Options
* Referrer-Policy
* Frame protection
* Permissions Policy

Do not blindly add headers that break required functionality.

Document any deliberate exceptions.

---

# 31. CSRF

Review CSRF configuration.

Verify:

* Secret configuration
* Cookie security
* Protected methods
* Authentication compatibility
* Production HTTPS assumptions
* Token endpoint

Do not disable CSRF merely because frontend development becomes easier without it.

---

# 32. Deployment Configuration

Inspect whether the project includes:

* Dockerfile
* Docker Compose
* CI/CD
* Deployment scripts
* Cloud configuration
* Reverse proxy configuration

If present, audit them.

If absent, do not invent a complete deployment infrastructure unless explicitly necessary.

Document what deployment information is currently available and what remains operator-specific.

---

# 33. Docker

If Docker is used, review:

* Base image
* Node version
* Multi-stage build
* Production dependencies
* Non-root user
* Exposed ports
* Environment handling
* Health checks
* Secrets

Do not bake secrets into Docker images.

Do not run production containers unnecessarily as root.

---

# 34. CI/CD

If CI/CD exists, inspect:

* Secrets handling
* Build
* Tests
* Lint
* Typecheck
* Deployment
* Migration execution

Ensure CI does not print secrets.

Do not change deployment pipelines destructively.

---

# 35. Dependency Review

Review:

* Frontend dependencies
* Backend dependencies
* Lockfiles
* Node version
* Deprecated packages
* Known vulnerabilities

Run the appropriate package audit command.

Do not blindly upgrade major versions.

Document vulnerabilities that require dependency upgrades or operator action.

---

# 36. Production Scripts

Inspect `package.json` scripts.

Ensure production scripts are clear.

Examples:

* Development
* Test
* Lint
* Build
* Start
* Migration

Avoid production scripts that accidentally:

* Seed development data
* Reset databases
* Use development environment
* Start debug mode

---

# 37. Seed and Test Data

Ensure production deployment cannot accidentally execute:

* Development seed
* Mock data
* Test data
* Fake products
* Fake users
* Fake orders

Separate development/testing utilities from production startup.

---

# 38. Development Defaults

Search for:

* `localhost`
* Default passwords
* Default JWT secrets
* Debug flags
* Development CORS
* Development cookies
* Test credentials
* Mock providers

Determine whether each is:

* Safe
* Development-only
* Production blocker

Fix safe production blockers.

---

# 39. Production Logging and Debugging

Ensure production does not run with:

* Verbose debug logging
* Stack traces to clients
* Sensitive request dumps
* Full request body logging
* Authentication token logging

Maintain enough information for troubleshooting.

---

# 40. Monitoring and Alerting

Determine whether production has monitoring for:

* Application errors
* Authentication failures
* Security events
* Database failures
* Payment failures
* Queue failures
* High error rates

If infrastructure is absent, document the requirement instead of inventing monitoring.

---

# 41. Backup and Recovery Readiness

Review whether documentation covers:

* Database backups
* Restore process
* Migration rollback considerations
* Recovery procedures

Do NOT perform destructive backup/restore operations.

Do not claim backups exist unless actual infrastructure confirms them.

Document operational requirements honestly.

---

# 42. Data Retention

Review whether logs and audit data have sensible retention considerations.

Do not delete existing audit data.

Do not invent legal requirements.

Document only technical retention concerns supported by the current architecture.

---

# 43. Production Security Boundary

Verify:

* Admin routes protected
* User routes protected
* Ownership checks active
* Security Registry active
* Global security guard active
* Rate limits active
* CSRF active
* Audit logging active
* Error handler active

Do not disable controls for deployment convenience.

---

# 44. Production Configuration Fail-Fast

Where security-critical configuration is mandatory:

The application should fail safely at startup rather than silently use insecure defaults.

Examples:

* Missing production JWT secret
* Missing encryption key
* Missing payment webhook secret when provider is enabled
* Invalid production database configuration

Do not make optional integrations mandatory unless the application requires them.

---

# 45. HTTPS and Reverse Proxy

Review whether the application is correctly prepared to run behind a reverse proxy/load balancer.

Inspect:

* `trust proxy`
* Secure cookies
* Forwarded headers
* HTTPS detection

Do not trust arbitrary proxy headers without appropriate configuration.

Document infrastructure-specific requirements.

---

# 46. Production Build Verification

Create clean production builds.

Verify:

* Frontend build
* Backend build

Do not use development build artifacts as proof of production readiness.

If build output contains unexpected:

* Secrets
* Debug code
* Development URLs

fix the issue.

---

# 47. Production Startup Verification

Where safely possible, verify the production startup path.

Use safe/local/test configuration.

Verify:

* Server starts
* Configuration validation works
* Database connection behavior
* Health endpoint
* Readiness behavior
* Graceful shutdown

Do NOT connect to or modify a real production database.

---

# 48. Environment Matrix

Create/document an environment matrix.

At minimum:

| Setting | Development | Test | Production |
| --- | --- | --- | --- |
| NODE_ENV | development | test | production |
| Database | isolated | isolated | production |
| Cookies | development-safe | test-safe | secure |
| CORS | local | test | explicit origins |
| Payment | test/sandbox | test/sandbox | real provider |
| Email | test/local | test | production provider |
| Redis | optional/test | test | production |
| Sentry | optional | optional | production |

Do not invent actual credentials.

---

# 49. Production Readiness Classification

Classify findings as:

### BLOCKER

Prevents safe production deployment.

### HIGH

Must be addressed before production unless explicitly accepted by the operator.

### MEDIUM

Should be addressed before or shortly after launch.

### LOW

Improvement that does not block launch.

### CONFIGURATION REQUIRED

Code is prepared, but real infrastructure/operator configuration is required.

### INFORMATIONAL

No immediate action required.

Do not exaggerate findings.

---

# 50. Fix Requirements

For every safe and clearly identified production defect:

1. Fix the defect.
2. Reinspect affected code.
3. Run relevant tests.
4. Run build.
5. Verify no regression.

Do not make broad unrelated changes.

---

# 51. Final Validation

Run:

* Frontend lint
* Frontend typecheck
* Frontend build
* Backend lint
* Backend typecheck
* Backend build
* Backend tests
* Dependency audit

Where applicable also verify:

* Production startup
* Health endpoint
* Readiness endpoint
* Graceful shutdown

Use safe local/test configuration.

---

# 52. Final Secret Scan

After all modifications, repeat the repository secret scan.

Ensure no new:

* API keys
* Tokens
* Passwords
* Private keys
* Payment secrets
* Webhook secrets

were introduced.

Do not expose detected secret values in the final report.

---

# 53. Final Production Checklist

Verify:

## Configuration

* Environment variables
* Secrets
* CORS
* Cookies
* JWT
* CSRF

## Database

* PostgreSQL
* Prisma
* Migrations
* Pooling
* Transactions

## Payments

* Provider
* Webhook
* Signature
* Idempotency

## Infrastructure

* Redis
* Email
* Sentry
* Logging

## Security

* Headers
* Rate limits
* Authentication
* Authorization
* Ownership
* Audit

## Operations

* Health
* Readiness
* Shutdown
* Monitoring
* Backup requirements

## Frontend

* API URL
* Production build
* No secrets
* No localhost assumptions

## Deployment

* Docker if present
* CI/CD if present
* Startup scripts

---

# 54. Definition of Done

Prompt 36 is complete only when:

1. Full production configuration was audited.
2. Environment variables were audited.
3. Secrets were audited.
4. Git safety was audited.
5. Backend production configuration was reviewed.
6. CORS was reviewed.
7. Cookies were reviewed.
8. Authentication configuration was reviewed.
9. Database configuration was reviewed.
10. Prisma migrations were reviewed.
11. Database integrity was reviewed.
12. Transactions were reviewed.
13. Payment configuration was reviewed.
14. Webhooks were reviewed.
15. Email configuration was reviewed.
16. Redis configuration was reviewed where applicable.
17. Sentry was reviewed where applicable.
18. Logging was reviewed.
19. Error handling was reviewed.
20. Health checks were reviewed.
21. Graceful shutdown was reviewed.
22. Rate limiting was reviewed.
23. Request limits were reviewed.
24. File uploads were reviewed where applicable.
25. Static assets were reviewed.
26. Frontend production configuration was reviewed.
27. Frontend secret exposure was reviewed.
28. Security headers were reviewed.
29. CSRF was reviewed.
30. Deployment configuration was reviewed.
31. Docker was reviewed where applicable.
32. CI/CD was reviewed where applicable.
33. Dependencies were reviewed.
34. Production scripts were reviewed.
35. Test/seed data separation was reviewed.
36. Development defaults were reviewed.
37. Monitoring requirements were reviewed.
38. Backup/recovery requirements were reviewed.
39. Production security boundaries were verified.
40. Fail-fast configuration was reviewed.
41. HTTPS/reverse proxy configuration was reviewed.
42. Production builds were verified.
43. Safe production startup was verified where possible.
44. Environment matrix was documented.
45. Findings were classified.
46. Safe blockers were fixed.
47. Complete validation was rerun.
48. Final secret scan passed.
49. Final report was created.
50. No real production credentials were introduced.
51. No destructive production operations were performed.

---

# 55. Final Report

Create:

`Antigravity_Prompts/36_Production_Readiness_Audit_Report.md`

Include:

## Executive Summary

## Production Readiness Status

Use one of:

`READY FOR PRODUCTION`

`READY WITH CONFIGURATION REQUIRED`

`NOT READY — BLOCKERS REMAIN`

Do not claim `READY FOR PRODUCTION` if mandatory infrastructure configuration remains incomplete.

## Environment Configuration

## Secrets

## Git Safety

## Backend Production Configuration

## CORS

## Cookies

## Authentication

## Database

## Prisma & Migrations

## Transactions

## Payments

## Webhooks

## Email

## Redis

## Sentry

## Logging

## Error Handling

## Health / Readiness

## Graceful Shutdown

## Rate Limiting

## Request Limits

## File Uploads

## Static Assets

## Frontend Production Configuration

## Security Headers

## CSRF

## Deployment

## Docker

## CI/CD

## Dependencies

## Production Scripts

## Seed/Test Data

## Development Defaults

## Monitoring

## Backup / Recovery

## HTTPS / Reverse Proxy

## Production Startup

## Environment Matrix

## Findings

For each finding include:

* ID
* Severity
* Area
* Description
* Impact
* Current status
* Fix/action required

Do not include actual secret values.

## Fixes Applied

## Validation Results

Include exact results for:

* Frontend lint
* Frontend typecheck
* Frontend build
* Backend lint
* Backend typecheck
* Backend build
* Backend tests
* Dependency audit
* Secret scan
* Production startup verification where applicable

## Configuration Required

Clearly list operator/infrastructure tasks that require real credentials or infrastructure.

Examples:

* Production database
* Payment provider
* Webhook secret
* SMTP
* Redis
* Sentry
* Domain
* TLS certificate
* Reverse proxy

Do not invent values.

## Remaining Risks

Only genuine risks.

## Final Status

Use exactly one:

`READY FOR PRODUCTION`

or

`READY WITH CONFIGURATION REQUIRED`

or

`NOT READY — BLOCKERS REMAIN`

---

# Critical Constraints

* Execute only Prompt 36.
* Do not start Prompt 37.
* Do not use real production credentials.
* Do not invent secrets.
* Do not expose secrets in reports.
* Do not commit secrets.
* Do not perform destructive production database operations.
* Do not reset production databases.
* Do not run destructive migrations.
* Do not use real payment credentials.
* Do not send real customer emails during testing unless explicitly configured for an authorized test environment.
* Do not disable security controls.
* Do not weaken CORS.
* Do not disable CSRF.
* Do not disable authentication.
* Do not bypass authorization.
* Do not remove audit logging.
* Do not make frontend business logic authoritative.
* Do not claim production readiness without evidence.
* Do not consider successful builds sufficient.
* Fix safe production blockers discovered during the audit.
* Rerun complete validation after fixes.
* Perform a final secret scan.
* Document infrastructure/operator configuration honestly.
* Do not automatically proceed to Prompt 37.
* Create the final report.
* Stop after Prompt 36 is complete.
