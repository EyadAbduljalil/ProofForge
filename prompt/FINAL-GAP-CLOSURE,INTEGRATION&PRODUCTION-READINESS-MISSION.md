# WEBFORGE OS

# FINAL GAP CLOSURE, INTEGRATION & PRODUCTION READINESS MISSION

## MISSION TYPE

Repository-wide engineering transformation.

This is NOT a documentation task.

This is NOT a prompt-writing task.

This is NOT a task to create isolated demo packages.

This is NOT a task to report that something "should exist".

Your mission is to inspect the current WebForge OS repository, preserve and reuse everything that is already correct, close every verified architectural and implementation gap, integrate all existing packages into a coherent executable system, build the missing runtime infrastructure, execute real verification, fix failures, and leave the repository in the strongest practically verifiable state possible.

You MUST treat the existing repository as the source of truth.

You MUST NOT blindly recreate existing systems.

You MUST NOT create duplicate engines, duplicate security packages, duplicate registries, duplicate governance systems, duplicate idea compilers, duplicate animation engines, or parallel implementations of functionality that already exists.

If an existing implementation is incomplete:
→ extend it.

If it is weak:
→ harden it.

If it is duplicated:
→ consolidate it.

If it is disconnected:
→ integrate it.

If it is simulated:
→ replace or supplement it with real executable verification where technically possible.

If a requested capability cannot be fully implemented because the environment lacks an external dependency, credential, service, or infrastructure:
→ implement the complete adapter/interface/local fallback where possible,
→ create the exact integration path,
→ document the blocker,
→ test everything that can be tested locally,
→ NEVER falsely claim production verification.

---

# 1. PRIMARY OBJECTIVE

Transform WebForge OS from a collection of strong reusable engineering/security/governance packages into:

> A Unified, Executable, Verifiable, Security-First Web Engineering Operating System.

Target architecture:

```text
USER IDEA
    ↓
IDEA COMPILER
    ↓
PROJECT SPECIFICATION
    ↓
PROJECT PROFILER
    ↓
REQUIREMENT TRACEABILITY
    ↓
ARCHITECTURE / DESIGN / SECURITY PLANNING
    ↓
ENGINEERING GRAPH
    ↓
IMPLEMENTATION
    ↓
UNIFIED REFERENCE APPLICATION
    ↓
REAL DATABASE
    ↓
REAL CACHE / DISTRIBUTED STATE
    ↓
REAL API
    ↓
REAL FRONTEND
    ↓
REAL AUTHENTICATION / AUTHORIZATION
    ↓
REAL BUSINESS STATE MACHINES
    ↓
REAL SECURITY CONTROLS
    ↓
REAL BROWSER
    ↓
REAL E2E
    ↓
SECURITY TESTING
    ↓
PERFORMANCE TESTING
    ↓
ACCESSIBILITY
    ↓
VISUAL REGRESSION
    ↓
OBSERVABILITY
    ↓
RELEASE GATES
    ↓
EVIDENCE
    ↓
PRODUCTION READINESS
```

The final system must demonstrate that WebForge rules are not merely written down.

They must be:

```text
RULE
 ↓
IMPLEMENTATION
 ↓
VALIDATOR
 ↓
TEST
 ↓
GATE
 ↓
EVIDENCE
 ↓
ENFORCEMENT
```

And for AI-assisted execution:

```text
AI AGENT
 ↓
WEBFORGE RUNTIME
 ↓
AUTHORITY
 ↓
PERMISSION
 ↓
POLICY
 ↓
ACTION
 ↓
VALIDATION
 ↓
TEST
 ↓
EVIDENCE
 ↓
GATE
```

---

# 2. NON-NEGOTIABLE RULES

## RULE 1 — INSPECT BEFORE MODIFYING

Before changing anything:

1. Inspect the entire repository.
2. Inspect package structure.
3. Inspect package manifests.
4. Inspect scripts.
5. Inspect tests.
6. Inspect configuration.
7. Inspect existing documentation.
8. Inspect registries.
9. Inspect existing security engines.
10. Inspect orchestration.
11. Inspect idea-compiler.
12. Inspect engineering graph.
13. Inspect state-machine.
14. Inspect vulnerability lab.
15. Inspect maturity benchmark.
16. Inspect CLI.
17. Inspect design system.
18. Inspect API client.
19. Inspect contracts.
20. Inspect infrastructure.
21. Detect duplicate functionality.
22. Detect disconnected functionality.
23. Detect mocked/simulated functionality.
24. Detect dead code.
25. Detect incomplete implementations.
26. Detect failing tests.
27. Detect missing integrations.

Create:

```text
reports/FINAL_GAP_ANALYSIS.md
```

before major implementation.

---

# 3. EXISTING SYSTEMS MUST BE REUSED

The current repository already contains major systems.

The audit identifies existing implementations including:

* packages/security
* packages/security-governance
* packages/orchestration
* packages/idea-compiler
* packages/engineering-graph
* packages/state-machine
* packages/vulnerability-lab
* packages/maturity-benchmark
* packages/contracts
* packages/api-client
* packages/design-system
* packages/components
* packages/infrastructure
* bin/webforge.js

Do NOT recreate these systems.

Specifically:

### DO NOT CREATE

```text
another idea compiler
another threat engine
another risk engine
another animation decision engine
another anti-hallucination engine
another compliance engine
another traceability engine
another security package
another state machine package
another engineering graph
another vulnerability lab
another maturity benchmark
another API client
another design token system
```

unless the existing implementation is proven unusable.

If replacement is genuinely necessary:

1. document why,
2. compare old/new,
3. migrate dependents,
4. remove duplication,
5. update registries,
6. update tests,
7. update documentation.

---

# 4. CLOSE THE REAL ARCHITECTURAL GAPS

You must close ALL verified gaps.

## GAP A — REAL DATABASE

Current repository reportedly relies partly on local/in-memory simulation.

Build a real database integration.

Preferred baseline:

```text
PostgreSQL
```

Requirements:

* Docker development database
* production-compatible configuration
* connection pooling
* parameterized queries
* transaction support
* schema management
* indexes
* constraints
* foreign keys
* unique constraints
* check constraints
* transaction isolation where required
* deadlock handling
* connection failure handling
* retry policy where safe
* health checks
* readiness checks
* graceful shutdown
* database seeding
* test database
* isolated test data
* database reset strategy

Do NOT replace in-memory implementations blindly.

Use adapters:

```text
Storage Interface
      ↓
InMemory Adapter
      ↓
PostgreSQL Adapter
```

The in-memory adapter may remain useful for unit tests.

The production path must use real persistence.

---

# 5. DATABASE MIGRATION SYSTEM

Implement a real migration mechanism.

Requirements:

```text
migrations/
├── versioned migrations
├── up
├── down
├── status
├── validation
└── rollback support
```

Support:

* migration creation
* migration execution
* migration status
* rollback
* failed migration detection
* migration locking
* deterministic ordering
* migration checksum/integrity where practical
* CI migration verification
* production migration safety

Do not silently destroy data.

Test:

```text
empty database
↓
all migrations
↓
seed
↓
application
↓
rollback
↓
reapply
```

---

# 6. REAL REDIS / DISTRIBUTED STATE

Implement a Redis adapter.

Required use cases:

* distributed rate limiting
* nonce/replay cache
* idempotency keys
* session-related ephemeral state where appropriate
* abuse/fraud counters
* distributed locks where required
* caching where appropriate

Architecture:

```text
Cache Interface
      ↓
InMemory Adapter
      ↓
Redis Adapter
```

Requirements:

* connection management
* timeout handling
* reconnect behavior
* health check
* graceful fallback only where security semantics permit
* explicit fail-open/fail-closed policy
* namespace isolation
* TTL correctness
* serialization safety

CRITICAL:

Do not create a dangerous fallback where a security control silently becomes ineffective.

Example:

A distributed rate limiter MUST NOT silently become unlimited because Redis failed.

The behavior must be explicitly defined and tested.

---

# 7. MULTI-TENANT DATABASE SECURITY

Implement PostgreSQL Row-Level Security where applicable.

Requirements:

* tenant context
* tenant isolation
* RLS policies
* ownership validation
* cross-tenant access tests
* privileged administrative paths
* service-role boundaries
* transaction-safe tenant context
* tests attempting cross-tenant reads
* tests attempting cross-tenant updates
* tests attempting cross-tenant deletes

The following must be tested:

```text
Tenant A → Tenant A = ALLOWED

Tenant A → Tenant B = DENIED
```

Do not rely solely on application-level filtering.

---

# 8. UNIFIED FULL-STACK REFERENCE APPLICATION

Build:

```text
apps/
├── server/
└── web/
```

or an equivalent architecture if the existing repository has a better structure.

The reference application must actually connect:

```text
Browser
 ↓
Frontend
 ↓
API Client
 ↓
HTTP
 ↓
Server
 ↓
Security Middleware
 ↓
Authorization
 ↓
Controllers
 ↓
Business Services
 ↓
State Machines
 ↓
Database
 ↓
Redis
```

The application must demonstrate real integration.

---

# 9. SERVER ARCHITECTURE

Create a production-oriented application server.

Requirements:

* routing
* middleware pipeline
* authentication
* authorization
* input validation
* CSRF where applicable
* rate limiting
* security headers
* request IDs
* structured logging
* error handling
* centralized errors
* API versioning
* health endpoint
* readiness endpoint
* metrics endpoint
* graceful shutdown
* CORS policy
* request size limits
* timeout controls
* secure cookies
* audit logging

Every security middleware already implemented inside WebForge must be evaluated for integration.

Do not merely import a package.

Actually wire it into the request lifecycle.

---

# 10. FRONTEND REFERENCE APPLICATION

Build a real frontend consuming the backend.

The frontend must demonstrate:

* authentication
* login
* logout
* session refresh
* protected routes
* authorization-aware UI
* API client
* validation
* error states
* loading states
* empty states
* retry behavior
* responsive layout
* RTL/LTR switching
* accessibility
* keyboard navigation
* reduced motion
* theme handling
* secure checkout flow
* realistic data tables
* dialogs
* forms
* notifications
* navigation
* mobile sidebar

Use existing:

```text
packages/api-client
packages/contracts
packages/design-system
packages/components
```

Do not create parallel implementations.

---

# 11. END-TO-END CONTRACT PIPELINE

Implement:

```text
Backend Schema
      ↓
API Contract
      ↓
Validation Schema
      ↓
Type Generation
      ↓
Frontend Types
      ↓
API Client
      ↓
Runtime Validation
```

Requirements:

* request schemas
* response schemas
* error schemas
* shared types
* generated types where appropriate
* schema validation
* breaking-change detection
* contract tests
* API documentation

The frontend and backend must not independently invent incompatible types.

---

# 12. AUTHENTICATION & SESSION HARDENING

Verify and integrate:

* password hashing
* timing-safe comparisons
* secure cookies
* session rotation
* token rotation
* refresh handling
* reuse detection
* logout invalidation
* CSRF
* brute-force protection
* rate limiting
* session expiration
* privilege changes invalidating sessions where appropriate
* account lock/abuse policy where appropriate

Test:

```text
expired session
invalid token
reused token
rotated token
stolen session
CSRF attempt
brute force
privilege escalation
logout reuse
refresh race
```

---

# 13. AUTHORIZATION

Implement and verify:

* RBAC
* ABAC where required
* ownership checks
* tenant isolation
* object-level authorization
* function-level authorization
* administrative authorization
* resource-level authorization

Test:

```text
horizontal privilege escalation
vertical privilege escalation
IDOR
BOLA
cross-tenant access
unauthorized mutation
unauthorized delete
unauthorized admin action
```

---

# 14. STATE MACHINES

Use the existing state-machine package.

Extend it where required.

Critical domains:

```text
User
Order
Payment
Inventory
Shipment
Return
Refund
Coupon
Subscription
Ticket
Application
Approval
```

For every state machine define:

```text
states
legal transitions
illegal transitions
transition guards
side effects
rollback behavior
concurrency behavior
audit events
```

Test every illegal transition.

Example:

```text
PAID → PENDING = DENIED

REFUNDED → PAID = DENIED

CANCELLED → SHIPPED = DENIED
```

Do not rely on frontend state to enforce lifecycle rules.

---

# 15. PAYMENT ARCHITECTURE

Implement a provider abstraction:

```text
PaymentProvider
 ├── Mock/Test Provider
 ├── Stripe Adapter
 └── PayPal Adapter
```

The system must be designed for real sandbox integration.

Requirements:

* payment intent
* idempotency
* webhook verification
* replay protection
* payment state machine
* duplicate payment protection
* amount verification
* currency verification
* order ownership
* webhook authorization
* refund
* partial refund where supported
* failure handling
* timeout handling
* reconciliation hooks
* audit logging

Use sandbox credentials only if available.

Never embed real secrets.

If credentials are unavailable:

```text
IMPLEMENTED — SANDBOX NOT EXECUTED
```

not:

```text
TESTED SUCCESSFULLY
```

---

# 16. ECOMMERCE REFERENCE FLOW

Build and verify:

```text
Browse
 ↓
Product
 ↓
Cart
 ↓
Checkout
 ↓
Payment
 ↓
Webhook
 ↓
Order
 ↓
Inventory
 ↓
Shipment
 ↓
Return
 ↓
Refund
```

Test:

* price manipulation
* quantity manipulation
* coupon abuse
* stock race
* duplicate checkout
* duplicate webhook
* replayed webhook
* unauthorized order access
* unauthorized refund
* payment mismatch
* negative quantity
* zero quantity
* invalid product
* deleted product
* stale cart
* concurrent purchase

---

# 17. REAL BROWSER E2E

This is mandatory.

Replace purely simulated browser verification with actual browser execution where the environment permits.

Preferred:

```text
Playwright
Chromium
```

Create real E2E suites.

Minimum flows:

### Authentication

```text
register
login
logout
refresh
invalid credentials
expired session
```

### Authorization

```text
user → own resource
user → another user's resource
admin → admin resource
user → admin resource
```

### Ecommerce

```text
product
cart
checkout
payment test
order
refund
```

### Security

```text
CSRF
IDOR
rate limit
invalid input
XSS payload
authorization bypass attempts
```

### UI

```text
modal
ESC
keyboard navigation
responsive layout
mobile navigation
RTL
LTR
reduced motion
```

### Regression

Take deterministic screenshots for critical pages.

---

# 18. VISUAL REGRESSION

Implement real screenshot comparison.

Required pages:

```text
Home
Login
Register
Dashboard
Product
Cart
Checkout
Order
Admin
Error
```

Test:

* desktop
* tablet
* mobile
* RTL
* LTR

Do NOT blindly accept changed snapshots.

Every visual change must be classified:

```text
EXPECTED
UNEXPECTED
REGRESSION
```

---

# 19. ACCESSIBILITY

Verify:

* WCAG-oriented accessibility
* semantic HTML
* keyboard navigation
* focus management
* visible focus
* labels
* form errors
* screen reader semantics
* dialogs
* menus
* tables
* contrast
* reduced motion
* RTL accessibility

Use automated tools plus targeted manual-style checks.

Do not claim full accessibility from automation alone.

---

# 20. PERFORMANCE

Implement real performance verification.

Measure:

* frontend load
* API latency
* database query performance
* N+1 queries
* bundle size
* rendering cost
* layout thrashing
* image loading
* caching
* compression
* database indexes
* Redis latency
* critical interaction latency

Use Lighthouse where applicable.

Create performance budgets.

Fail CI when critical budgets are exceeded.

---

# 21. SECURITY TESTING

Integrate all relevant existing security modules.

Minimum verification:

### Injection

* SQL Injection
* NoSQL Injection
* Command Injection
* Code Injection
* Template Injection
* LDAP Injection where applicable
* XPath Injection where applicable

### Web

* XSS
* CSRF
* SSRF
* Path Traversal
* LFI/RFI
* XXE
* Open Redirect
* HTTP Request Smuggling
* HTTP Response Splitting

### Authentication

* auth bypass
* session fixation
* session hijacking
* credential stuffing protections
* brute force
* token reuse
* refresh abuse

### Authorization

* IDOR
* BOLA
* BFLA
* privilege escalation
* tenant isolation

### Files

* unrestricted upload
* MIME spoofing
* extension spoofing
* path traversal
* Zip Slip
* decompression bomb/resource abuse

### API

* rate limit bypass
* mass assignment
* excessive data exposure
* pagination abuse
* replay
* idempotency abuse
* schema bypass

### Logic

* race conditions
* TOCTOU
* double payment
* stock race
* coupon abuse
* invalid state transitions
* workflow bypass

### Configuration

* CORS
* headers
* cookies
* secrets
* debug endpoints
* verbose errors
* exposed configuration

### Supply Chain

* dependency audit
* lockfile integrity
* SBOM
* known vulnerable packages
* malicious package indicators where tooling supports it

---

# 22. AI / AGENT SECURITY

Use the existing AI governance systems.

Verify:

* prompt injection
* indirect prompt injection
* sensitive information disclosure
* insecure output handling
* excessive agency
* unauthorized tool calls
* tool permission bypass
* system prompt leakage
* RAG isolation
* cross-tenant context leakage
* malicious tool arguments
* tool result poisoning
* data exfiltration
* unsafe autonomous actions
* human approval for high-risk operations
* AI resource abuse

AI must NEVER be able to bypass WebForge security policy simply because an agent requested an action.

Architecture:

```text
AI Request
 ↓
Identity
 ↓
Permission
 ↓
Policy
 ↓
Risk
 ↓
Approval if required
 ↓
Tool
 ↓
Validation
 ↓
Execution
 ↓
Audit
```

---

# 23. SECRETS MANAGEMENT

Implement provider abstraction:

```text
SecretsProvider
 ├── Environment
 ├── Local Development
 └── Vault/KMS/Cloud Secret Manager Adapter
```

Requirements:

* no hardcoded secrets
* secret scanning
* log redaction
* environment validation
* startup failure for required missing secrets
* secret rotation architecture
* production provider integration interface
* test credentials clearly separated

---

# 24. OBSERVABILITY

Implement the foundation for:

```text
OpenTelemetry
Prometheus
structured logs
audit logs
request IDs
trace IDs
metrics
health checks
readiness
```

Track:

* HTTP requests
* errors
* latency
* authentication events
* authorization failures
* security events
* rate-limit events
* payment events
* database errors
* Redis errors
* state-machine violations
* AI security violations

Do not log:

* passwords
* access tokens
* refresh tokens
* payment secrets
* sensitive PII unnecessarily
* API keys

---

# 25. AUDIT LOGGING

Create a normalized audit event model.

Example:

```text
timestamp
actor
actor_type
tenant
action
resource
resource_id
result
reason
request_id
ip_hash/or appropriate privacy-preserving identifier
metadata
risk_level
```

Audit events must be tamper-resistant as far as the chosen architecture permits.

---

# 26. ENGINEERING GRAPH

Integrate the existing engineering graph with:

* packages
* modules
* APIs
* database
* frontend
* state machines
* security controls
* tests
* dependencies
* configuration

Implement blast-radius analysis.

For every major change:

```text
Changed Component
 ↓
Dependents
 ↓
Affected Features
 ↓
Affected Tests
 ↓
Affected Security Controls
 ↓
Affected APIs
 ↓
Affected Database
 ↓
Required Regression Tests
```

---

# 27. REQUIREMENT TRACEABILITY

Integrate:

```text
Requirement
 ↓
Design
 ↓
Implementation
 ↓
Test
 ↓
Evidence
```

Every critical requirement must have traceability.

Generate:

```text
reports/REQUIREMENT_TRACEABILITY.md
```

Identify:

```text
IMPLEMENTED
PARTIAL
UNIMPLEMENTED
UNTESTED
BLOCKED
```

---

# 28. EVIDENCE ENGINE

Create or extend an evidence system.

Every verification result must record:

```text
test
timestamp
environment
command
result
exit code
artifact
logs
screenshots
trace
severity
commit/version
```

Evidence must be reproducible.

Do not write:

```text
PASS
```

without evidence when executable verification was required.

---

# 29. TESTING PYRAMID

Implement where appropriate:

```text
Unit
 ↓
Integration
 ↓
Contract
 ↓
API
 ↓
Database
 ↓
Security
 ↓
E2E
 ↓
Browser
 ↓
Visual
 ↓
Performance
 ↓
Production Smoke
```

Add:

* property-based testing where useful
* mutation testing for critical logic where practical
* concurrency testing
* race-condition testing
* fuzz testing for security-sensitive parsers/input
* invariant testing
* state-machine testing

Do not add expensive testing where it provides no meaningful signal.

---

# 30. VULNERABILITY LAB

Expand the existing vulnerability lab.

Create controlled fixtures for:

```text
SQLi
XSS
SSRF
IDOR
BOLA
CSRF
Path Traversal
Upload
Race Conditions
Auth Bypass
Privilege Escalation
JWT Abuse
Webhook Replay
Payment Double Spend
Coupon Abuse
Tenant Escape
Prompt Injection
Tool Abuse
RAG Leakage
```

Each fixture must have:

```text
vulnerable version
secure version
attack
expected result
regression test
```

Never expose these vulnerable fixtures as production endpoints.

---

# 31. DESIGN SYSTEM COMPLETION

Extend the existing design system.

Required reusable components where relevant:

```text
Navbar
Sidebar
MobileSidebar
ProductCard
DataTable
Dialog
Form
Input
Select
Tabs
Toast
Alert
Pagination
Breadcrumb
Dropdown
CommandMenu
Loading
Skeleton
EmptyState
ErrorState
CheckoutForm
```

All components must support:

* responsive behavior
* keyboard navigation
* accessibility
* RTL
* LTR
* reduced motion
* design tokens
* dark/light mode where supported
* error states
* loading states

Do not turn every UI into cards.

Avoid generic AI design patterns.

---

# 32. RTL / LTR

Implement real direction switching.

Prefer:

```css
margin-inline
padding-inline
inset-inline
border-inline
text-align: start
```

over hardcoded directional CSS.

Test:

```text
LTR
RTL
mobile RTL
desktop RTL
```

Check:

* navigation
* forms
* tables
* dialogs
* icons
* animations
* charts
* spacing
* alignment

---

# 33. MOTION SYSTEM

Use the existing animation decision engine.

Do not create another animation engine.

Implement reusable motion patterns.

Every animation must consider:

```text
purpose
duration
easing
performance
layout impact
reduced motion
device capability
```

Avoid:

* meaningless animation
* excessive parallax
* cursor gimmicks
* infinite motion
* layout thrashing
* unnecessary blur
* excessive glow

---

# 34. INFRASTRUCTURE

Create a complete local production-like environment:

```text
Docker
 ├── Web
 ├── API
 ├── PostgreSQL
 ├── Redis
 ├── Nginx
 └── Observability services where practical
```

Requirements:

* non-root containers
* health checks
* restart policy
* environment configuration
* secrets separation
* networking
* persistent volumes
* graceful shutdown
* resource limits where appropriate
* production-like Nginx
* HTTPS-ready configuration
* security headers

---

# 35. CI/CD

Create or strengthen CI.

Pipeline:

```text
Install
 ↓
Lint
 ↓
Type Check
 ↓
Unit
 ↓
Integration
 ↓
Contract
 ↓
Database
 ↓
Security
 ↓
Build
 ↓
Start
 ↓
Playwright
 ↓
Accessibility
 ↓
Visual
 ↓
Performance
 ↓
Artifact Collection
 ↓
Release Gate
```

Critical failures must fail CI.

Never:

* disable failing tests
* weaken assertions to obtain green
* automatically accept snapshots
* suppress vulnerabilities without justification
* mark skipped tests as passed

---

# 36. WEBFORGE CLI

Extend the existing CLI rather than creating a parallel CLI.

The CLI should expose useful operations such as:

```bash
webforge inspect
webforge profile
webforge graph
webforge security
webforge threat-model
webforge risk
webforge test
webforge e2e
webforge visual
webforge accessibility
webforge performance
webforge audit
webforge verify
webforge evidence
webforge benchmark
webforge maturity
webforge report
```

Only expose commands that are actually implemented.

---

# 37. MATURITY MODEL

Use the existing maturity benchmark.

Evaluate the final system.

Do NOT fabricate a high maturity level.

For every maturity criterion provide:

```text
criterion
status
evidence
gap
```

If something is not verified:

```text
NOT VERIFIED
```

not:

```text
PASS
```

---

# 38. REFERENCE APPLICATION

The final repository must contain a real reference application demonstrating WebForge capabilities.

It should demonstrate at minimum:

```text
Authentication
Authorization
Multi-tenancy
Dashboard
CRUD
Database
Redis
API
Contracts
State Machine
Security
Ecommerce
Checkout
Payment abstraction
Webhook
Audit logs
Observability
Responsive UI
RTL/LTR
Accessibility
E2E
Visual regression
Performance
```

This application is NOT a toy.

It is the integration proving ground for WebForge.

---

# 39. FAILURE POLICY

When something fails:

DO NOT hide it.

DO NOT weaken the test.

DO NOT delete the test.

DO NOT change expected behavior simply to make CI green.

Instead:

```text
Detect
 ↓
Classify
 ↓
Root Cause
 ↓
Fix
 ↓
Regression Test
 ↓
Retest
```

Severity:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

---

# 40. EXTERNAL DEPENDENCY POLICY

If external infrastructure is unavailable:

Examples:

```text
Stripe credentials unavailable
AWS unavailable
Vault unavailable
Cloud Redis unavailable
Cloud PostgreSQL unavailable
Browser unavailable
```

Do NOT fabricate execution.

Instead:

```text
IMPLEMENTED
LOCALLY VERIFIED
EXTERNAL VERIFICATION BLOCKED
```

Document:

```text
missing dependency
why required
how to configure it
how to run verification
what was verified locally
what remains unverified
```

---

# 41. NO FALSE COMPLETION

Never use:

```text
100% secure
100% complete
zero vulnerabilities
production guaranteed
fully secure
perfect
```

unless referring to a narrowly defined deterministic check.

The final standard is:

> Maximum Practical Verification.

---

# 42. SELF-AUDIT

After implementation, WebForge must audit itself.

Run:

### Architecture audit

Check:

* duplication
* circular dependencies
* dead modules
* disconnected packages
* inconsistent interfaces
* architectural violations

### Security audit

Check:

* controls
* missing controls
* bypasses
* unsafe defaults
* privilege boundaries
* data exposure
* supply chain

### Testing audit

Check:

* missing tests
* weak assertions
* untested branches
* simulated tests
* flaky tests
* skipped tests

### Design audit

Check:

* consistency
* responsiveness
* accessibility
* RTL
* visual regression
* anti-slop
* unnecessary complexity

### Infrastructure audit

Check:

* Docker
* environment
* secrets
* database
* Redis
* networking
* health checks
* observability

---

# 43. DUPLICATION & CONSOLIDATION AUDIT

Before final completion search the repository for duplicate concepts.

Examples:

```text
Security
Auth
Authorization
Rate Limiting
CSRF
Tokens
API Client
Validation
State Machines
Animation
Design Tokens
Logging
Testing
Evidence
Risk
Threat Modeling
Requirements
```

For every duplicate:

```text
KEEP
MERGE
DEPRECATE
REMOVE
```

Document the decision.

---

# 44. DOCUMENTATION

Update:

```text
README.md
AGENT.md
ARCHITECTURE.md
SECURITY.md
CONTRIBUTING.md
CHANGELOG.md
```

Create/update:

```text
docs/
reports/
```

Include:

* architecture
* setup
* development
* testing
* security
* deployment
* database
* Redis
* payments
* observability
* E2E
* troubleshooting
* WebForge CLI
* agent execution rules

Documentation must describe the actual repository.

---

# 45. FINAL VERIFICATION MATRIX

Create:

```text
FINAL_VERIFICATION.md
```

Include at minimum:

| Area           | Implemented | Tested | Evidence | Status |
| -------------- | ----------: | -----: | -------- | ------ |
| Database       |             |        |          |        |
| Migrations     |             |        |          |        |
| Redis          |             |        |          |        |
| RLS            |             |        |          |        |
| Authentication |             |        |          |        |
| Authorization  |             |        |          |        |
| API            |             |        |          |        |
| Contracts      |             |        |          |        |
| Frontend       |             |        |          |        |
| State Machines |             |        |          |        |
| Payments       |             |        |          |        |
| Security       |             |        |          |        |
| AI Security    |             |        |          |        |
| E2E            |             |        |          |        |
| Visual         |             |        |          |        |
| Accessibility  |             |        |          |        |
| Performance    |             |        |          |        |
| Observability  |             |        |          |        |
| CI/CD          |             |        |          |        |
| Infrastructure |             |        |          |        |
| Documentation  |             |        |          |        |

Allowed statuses:

```text
VERIFIED
PARTIALLY VERIFIED
IMPLEMENTED — NOT FULLY VERIFIED
BLOCKED
NOT IMPLEMENTED
```

---

# 46. REQUIRED FINAL REPORTS

Generate:

```text
reports/
├── FINAL_GAP_ANALYSIS.md
├── IMPLEMENTATION_REPORT.md
├── SECURITY_FINAL_REPORT.md
├── ARCHITECTURE_FINAL_REPORT.md
├── DATABASE_FINAL_REPORT.md
├── E2E_FINAL_REPORT.md
├── PERFORMANCE_FINAL_REPORT.md
├── ACCESSIBILITY_FINAL_REPORT.md
├── OBSERVABILITY_FINAL_REPORT.md
├── REQUIREMENT_TRACEABILITY.md
├── DUPLICATION_AUDIT.md
├── MATURITY_FINAL_REPORT.md
├── PRODUCTION_READINESS_REPORT.md
└── FINAL_VERIFICATION.md
```

---

# 47. FINAL EXECUTION LOOP

Do not stop after implementation.

Execute:

```text
DISCOVER
 ↓
BASELINE
 ↓
GAP ANALYSIS
 ↓
ARCHITECTURE PLAN
 ↓
IMPLEMENT
 ↓
INTEGRATE
 ↓
BUILD
 ↓
START
 ↓
STATIC CHECKS
 ↓
UNIT
 ↓
INTEGRATION
 ↓
CONTRACT
 ↓
DATABASE
 ↓
SECURITY
 ↓
E2E
 ↓
BROWSER
 ↓
VISUAL
 ↓
ACCESSIBILITY
 ↓
PERFORMANCE
 ↓
OBSERVABILITY
 ↓
FAILURE ANALYSIS
 ↓
FIX
 ↓
REGRESSION
 ↓
RETEST
 ↓
SELF-AUDIT
 ↓
DUPLICATION AUDIT
 ↓
FINAL VERIFICATION
 ↓
REPORT
```

Repeat the loop until:

1. all practical blockers are resolved,
2. all critical failures are resolved,
3. all feasible verification is executed,
4. remaining blockers are explicitly documented,
5. no false claims remain.

---

# 48. DEFINITION OF DONE

The task is DONE only when:

### Architecture

* no unexplained critical duplication
* major packages integrated
* reference application exists
* architecture is documented

### Backend

* real server exists
* real API exists
* real database exists
* migrations exist
* Redis adapter exists
* authentication works
* authorization works

### Security

* major security controls integrated
* authorization tested
* IDOR/BOLA tested
* SSRF tested
* injection defenses tested
* CSRF tested
* upload security tested
* rate limiting tested
* webhook security tested
* payment security tested
* tenant isolation tested

### Frontend

* real frontend exists
* API integration works
* responsive
* accessible
* RTL/LTR
* reduced motion

### Testing

* unit tests
* integration tests
* contract tests
* security tests
* real Playwright E2E
* visual regression
* accessibility
* performance
* concurrency/race tests where relevant

### Infrastructure

* Docker
* PostgreSQL
* Redis
* Nginx
* health checks
* environment configuration
* CI/CD

### Observability

* logs
* metrics
* traces foundation
* audit logs

### Governance

* requirement traceability
* evidence
* gates
* agent permissions
* high-risk approval
* anti-hallucination
* decision tracking

### Documentation

* setup
* architecture
* security
* testing
* deployment
* final verification

---

# 49. FINAL RULE

The goal is NOT to make the repository look complete.

The goal is to make it actually work.

The goal is NOT to maximize the number of files.

The goal is to maximize:

```text
Correctness
Security
Integration
Reproducibility
Testability
Observability
Maintainability
Evidence
```

The goal is NOT to produce another report saying that WebForge is excellent.

The repository itself must provide the evidence.

---

# 50. START NOW

Begin immediately.

Do not ask for permission to inspect the repository.

Do not ask me to manually identify the existing packages.

Do not ask me to tell you what is already implemented.

Discover it yourself.

Do not stop at analysis.

Do not stop after creating a plan.

Do not stop after creating files.

Do not stop after tests pass once.

Implement → integrate → run → fail → diagnose → fix → retest → regress → verify.

At the end:

1. Give the exact implementation summary.
2. Give every major gap that was closed.
3. Give every gap that remains.
4. Give every external dependency that prevented verification.
5. Give exact commands used for verification.
6. Give test counts and actual results.
7. Give security findings.
8. Give architecture findings.
9. Give performance findings.
10. Give accessibility findings.
11. Give infrastructure findings.
12. Give remaining technical debt.
13. Give final maturity assessment based ONLY on evidence.
14. Never inflate scores.
15. Never claim 100%.
16. Never hide failures.
17. Never mark untested systems as verified.

FINAL OUTPUT:

```text
WEBFORGE OS
FINAL GAP CLOSURE REPORT

Repository Status:
[ACTUAL STATUS]

Major Gaps Closed:
[LIST]

Major Features Implemented:
[LIST]

Verification:
[ACTUAL RESULTS]

Security:
[ACTUAL RESULTS]

E2E:
[ACTUAL RESULTS]

Performance:
[ACTUAL RESULTS]

Accessibility:
[ACTUAL RESULTS]

Infrastructure:
[ACTUAL RESULTS]

Observability:
[ACTUAL RESULTS]

Remaining Blockers:
[LIST]

Remaining Technical Debt:
[LIST]

External Verification Required:
[LIST]

Final Verification:
[VERIFIED / PARTIALLY VERIFIED / BLOCKED]

Evidence Location:
[PATHS]
```

Do not fabricate any field.

END MISSION.
