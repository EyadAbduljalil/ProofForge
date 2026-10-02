# WebForge OS — Executable Core Implementation & Verification Mission

## 0. Mission

You are operating inside the WebForge OS repository.

Your mission is to transform WebForge OS from a primarily declarative/documentation-driven engineering system into a **reusable executable engineering system** by implementing the missing hardened software primitives, reusable components, infrastructure configurations, unified verification commands, and their corresponding tests and evidence.

This is an **implementation mission**, not a documentation exercise.

Do not merely describe what should be built.

Inspect the repository, determine what already exists, implement what is genuinely missing, integrate it with the existing architecture, test it, fix failures, retest it, and produce evidence.

---

# 1. Non-Negotiable Principles

## 1.1 Inspect Before Modifying

Before creating or modifying anything:

1. Inspect the complete repository structure.
2. Read the existing:

   * `AGENT.md`
   * `README.md`
   * `registry/`
   * `core/`
   * `skills/`
   * `verification/`
   * `scripts/`
   * `tests/`
   * relevant `templates/`
   * relevant `adapters/`
3. Identify existing implementations that overlap with this mission.
4. Do NOT recreate functionality that already exists.
5. Preserve existing architecture unless there is concrete evidence that restructuring is required.

Create an internal implementation map before coding.

---

# 2. Mission Objective

The final WebForge OS should provide:

```text
Knowledge
    ↓
Rules
    ↓
Reusable Executable Primitives
    ↓
Project Integration
    ↓
Automated Verification
    ↓
Failure Detection
    ↓
Fix
    ↓
Regression Testing
    ↓
Evidence
```

The goal is not to guarantee that software can never contain defects.

The goal is:

> Maximize practical defect detection, prevention, correction, regression protection, security hardening, consistency, and evidence-based verification.

Never claim:

* zero bugs
* 100% security
* mathematically complete verification
* perfect production safety

unless such a claim is objectively supported by a specific verification method.

---

# 3. Required Workflow

Follow this exact workflow:

```text
DISCOVER
↓
AUDIT
↓
MAP EXISTING CAPABILITIES
↓
IDENTIFY REAL GAPS
↓
PLAN IMPLEMENTATION
↓
IMPLEMENT
↓
INTEGRATE
↓
BUILD
↓
STATIC ANALYSIS
↓
UNIT TESTS
↓
INTEGRATION TESTS
↓
E2E TESTS
↓
SECURITY TESTS
↓
ACCESSIBILITY TESTS
↓
VISUAL TESTS
↓
PERFORMANCE TESTS
↓
FAILURE ANALYSIS
↓
FIX
↓
RETEST
↓
REGRESSION
↓
VERIFY
↓
GENERATE EVIDENCE
↓
SELF-AUDIT WEBFORGE
↓
FINAL REPORT
```

Do not skip verification merely because implementation appears correct.

---

# 4. Phase A — Repository Audit

First determine:

### Existing capabilities

Identify:

* existing packages
* existing executable TypeScript/JavaScript
* existing security utilities
* existing API utilities
* existing design tokens
* existing components
* existing infrastructure files
* existing scripts
* existing tests
* existing registries
* existing validators
* existing CLI commands
* existing verification workflows

For every proposed capability classify it as:

```text
EXISTS
PARTIAL
MISSING
DUPLICATED
CONFLICTING
OBSOLETE
```

Do not create duplicate implementations.

---

# 5. Phase B — Security Core

Implement or complete the security package only where the repository genuinely lacks the functionality.

Suggested architecture:

```text
packages/security/
├── token-manager.ts
├── cookie-security.ts
├── idempotency-middleware.ts
├── ownership-guard.ts
├── authorization.ts
├── password.ts
├── csrf.ts
├── csp-headers.ts
├── security-headers.ts
├── rate-limit.ts
├── input-security.ts
├── secrets.ts
└── index.ts
```

The exact structure may be changed if the existing repository architecture provides a better equivalent.

## Required security capabilities

### Authentication

Support secure patterns for:

* session/token validation
* expiration
* rotation where applicable
* secure cookie handling
* HttpOnly
* Secure
* SameSite
* token reuse prevention where applicable

Never encourage insecure token storage such as:

```text
localStorage JWT
sessionStorage JWT
```

when a safer architecture is applicable.

### Password Security

Provide a secure password hashing abstraction.

Prefer modern memory-hard password hashing such as Argon2id when supported by the project stack.

Never implement custom cryptography.

### Authorization

Provide reusable authorization/ownership primitives capable of enforcing:

```text
User → Resource → Permission
```

including protections against:

* IDOR
* BOLA
* horizontal privilege escalation
* vertical privilege escalation

### Idempotency

Implement reusable idempotency support for operations where duplicate execution can cause harm, especially:

* payments
* orders
* financial operations
* webhook processing
* external side effects

Handle:

* duplicate request
* concurrent request
* replay
* expired idempotency key
* conflicting payload for same key

### CSRF

Provide appropriate CSRF protection for cookie-authenticated applications.

Do not blindly apply CSRF mechanisms to architectures where they are not applicable.

### CSP

Provide a secure CSP abstraction.

Support nonce-based policies where appropriate.

Do not introduce unsafe defaults merely to make an application work.

### Security Headers

Provide reusable security-header configuration.

Consider:

* CSP
* HSTS
* X-Content-Type-Options
* Referrer-Policy
* Permissions-Policy
* frame protections
* appropriate cross-origin policies

Only enable policies that are compatible with the application's actual architecture.

### Rate Limiting

Provide an abstraction capable of using an external store such as Redis when required.

Do not create a fake in-memory implementation and represent it as production-ready distributed rate limiting.

---

# 6. Phase C — Type-Safe API Contract Layer

Create or complete:

```text
packages/contracts/
packages/api-client/
```

or integrate equivalent existing modules.

The objective is to minimize frontend/backend contract drift.

The system should support:

```text
Backend Schema
      ↓
Validation Schema
      ↓
Type / Contract
      ↓
API Client
      ↓
Frontend
```

Prefer contract-first or schema-first approaches.

Potential technologies include:

* Zod
* OpenAPI
* TypeScript
* generated clients

Choose based on the existing repository rather than introducing unnecessary dependencies.

---

# 7. API Client

Provide a reusable HTTP client abstraction with:

* typed requests
* typed responses
* structured errors
* correlation IDs
* timeout handling
* cancellation
* retry policy
* exponential backoff
* retry classification
* authentication handling
* 401 handling
* safe token/session refresh
* duplicate-request protection where appropriate

## Important

Never create an automatic retry mechanism that can duplicate unsafe operations.

For example:

```text
GET      → usually retryable
PUT      → depends on semantics
POST     → must be classified carefully
PAYMENT  → never blindly retry
```

Retry behavior must be method- and operation-aware.

---

# 8. Error Handling

Create a standardized error model.

It should distinguish:

```text
Validation Error
Authentication Error
Authorization Error
Not Found
Conflict
Rate Limited
Business Rule Violation
External Service Failure
Internal Server Error
Network Error
Timeout
```

Never expose:

* stack traces
* SQL errors
* internal paths
* secrets
* internal infrastructure details

to end users.

Preserve useful diagnostic information internally through:

```text
correlationId
requestId
traceId
```

where supported.

---

# 9. Phase D — Design System Executable Layer

Create or complete a reusable design system package.

Suggested:

```text
packages/design-system/
├── tokens.css
├── semantic.css
├── fluid.css
├── motion.css
├── reset.css
├── accessibility.css
└── index.css
```

Do not blindly copy values from an external design reference.

The WebForge design system must remain a system, not a collection of random styles.

Include:

### Color

* semantic colors
* neutral scale
* surface colors
* text colors
* border colors
* interactive states
* light mode
* dark mode where applicable

### Typography

Include:

* font family
* font size scale
* line-height
* font weights
* heading hierarchy
* fluid typography

### Spacing

Use a consistent spacing system.

### Radius

Define a limited coherent radius scale.

### Elevation

Define consistent shadow/elevation levels.

Avoid arbitrary shadows.

### Motion

Define:

* duration
* easing
* transitions
* motion hierarchy
* reduced-motion behavior

Support:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 10. Phase E — Accessible Core Components

Implement reusable components only where they fit the repository's technology.

Priority components:

```text
AccessibleDialog
Dropdown/Menu
ValidatedForm
FormField
Toast/Alert
DataTable
Pagination
Tabs
Tooltip
Modal
LoadingState
EmptyState
ErrorState
```

Every interactive component must consider:

* keyboard navigation
* focus management
* focus restoration
* accessible naming
* ARIA only when necessary
* screen reader behavior
* Escape behavior where applicable
* disabled/loading states
* error states
* mobile behavior
* RTL behavior
* reduced motion

Do not use ARIA as a replacement for correct native HTML semantics.

---

# 11. Secure Form Primitive

The reusable form system must support:

```text
Idle
↓
Editing
↓
Validating
↓
Submitting
↓
Success
OR
Validation Error
OR
Server Error
```

Prevent:

* duplicate submission
* uncontrolled race conditions
* lost errors
* inconsistent loading state

The form system must distinguish:

```text
Field Validation
Business Validation
Server Validation
Network Failure
```

---

# 12. DataTable

Implement a reusable table primitive where appropriate.

It should consider:

* responsive behavior
* sorting
* filtering
* pagination
* loading
* empty state
* error state
* keyboard navigation
* accessible table semantics

Do not force desktop-style tables onto mobile screens.

Where appropriate, provide a mobile-specific presentation strategy.

---

# 13. Phase F — Infrastructure

Create hardened infrastructure templates where appropriate.

Suggested:

```text
packages/infrastructure/
├── Dockerfile.hardened
├── nginx-hardened.conf
├── docker-compose.production.yml
└── README.md
```

## Docker

Consider:

* multi-stage build
* minimal runtime image
* non-root user
* no unnecessary development dependencies
* deterministic dependency installation
* health checks
* proper signal handling
* explicit ports
* secrets not baked into image

Do not assume every project should use Docker.

The infrastructure layer must be adaptable.

---

# 14. Nginx

Provide secure baseline configuration.

Consider:

* TLS termination
* security headers
* request size limits
* rate limiting
* proxy timeouts
* buffering
* compression
* static asset caching
* upstream configuration

Do not insert security settings that break legitimate application functionality without documenting the tradeoff.

---

# 15. Production Compose

If Docker Compose is appropriate, provide a hardened production-oriented baseline.

Consider:

```text
Application
Database
Redis
```

with:

* internal networks
* health checks
* persistent volumes
* non-root execution
* secrets handling
* restart policy
* dependency health conditions

Do not expose internal services publicly without an explicit requirement.

---

# 16. Phase G — Unified WebForge CLI

Create a unified command layer.

Example:

```bash
webforge init
webforge analyze
webforge check
webforge test
webforge security
webforge accessibility
webforge visual
webforge performance
webforge verify
webforge report
```

If a CLI is inappropriate for the repository, provide an equivalent script interface.

The critical requirement is a single entry point:

```bash
webforge verify
```

or its repository-equivalent command.

---

# 17. Verification Orchestration

The unified verification command should orchestrate available checks.

Potential stages:

```text
Environment
↓
Dependencies
↓
Type Check
↓
Lint
↓
Build
↓
Unit
↓
Integration
↓
E2E
↓
API
↓
Database
↓
Security
↓
Accessibility
↓
Visual
↓
Performance
```

The orchestrator must detect unavailable tools and report:

```text
NOT RUN — TOOL UNAVAILABLE
```

rather than pretending the test passed.

---

# 18. Testing Requirements

For every new executable primitive, add tests.

At minimum:

```text
Happy Path
Invalid Input
Boundary Conditions
Failure Conditions
Security Conditions
Concurrency where relevant
Regression Case
```

Security-related modules require security-focused tests.

---

# 19. Failure-Driven Development

Whenever a test fails:

1. Capture the failure.
2. Identify the root cause.
3. Fix the implementation.
4. Re-run the failing test.
5. Re-run related tests.
6. Run the full relevant regression suite.
7. Preserve a regression test when appropriate.

Do not simply suppress the failure.

Never:

* disable a failing test
* weaken assertions
* blindly regenerate snapshots
* ignore security findings
* mark failures as passed
* remove coverage to make metrics look better

---

# 20. Requirement Traceability

Where the existing repository supports it, connect:

```text
Requirement
↓
Rule
↓
Implementation
↓
Test
↓
Evidence
```

For every critical capability, WebForge should be able to answer:

```text
What requirement does this satisfy?
Where is it implemented?
How is it tested?
What evidence proves it?
```

---

# 21. Registry Integration

Every new reusable capability must be registered in the appropriate registry.

Update only the relevant files, such as:

```text
registry/skills.json
registry/rules.json
registry/domains.json
registry/references.json
registry/tools.json
```

Do not create duplicate registry entries.

Maintain consistent IDs, names, descriptions, versions, and paths.

---

# 22. Documentation Integration

Update relevant documentation:

```text
README.md
AGENT.md
CHANGELOG.md
```

and any relevant skill/rule documentation.

Documentation must describe actual implemented capabilities.

Never document an unimplemented feature as complete.

---

# 23. Adapter Integration

Inspect:

```text
adapters/
```

and update platform adapters only where required.

The adapters must remain thin.

Do not duplicate the WebForge engineering rules into every adapter.

Adapters should primarily translate:

```text
WebForge capability
→
Platform-specific execution format
```

---

# 24. Backward Compatibility

Do not break existing WebForge functionality unnecessarily.

Before changing an existing rule or interface:

1. Determine who uses it.
2. Determine whether it is referenced elsewhere.
3. Determine migration impact.
4. Preserve compatibility where practical.
5. Document breaking changes where unavoidable.

---

# 25. Dependency Discipline

Before adding a dependency:

1. Check whether an existing dependency already solves the problem.
2. Evaluate maintenance status.
3. Evaluate security implications.
4. Evaluate bundle/runtime cost.
5. Evaluate licensing.
6. Prefer established libraries over custom cryptography/security implementations.

Do not add dependencies merely for convenience.

---

# 26. Security Review

After implementation perform a security-focused review covering at least:

```text
Authentication
Authorization
IDOR/BOLA
Session Security
Token Handling
CSRF
XSS
Injection
SSRF
Path Traversal
File Upload
Secrets
CORS
Security Headers
Rate Limiting
Replay
Idempotency
Race Conditions
Privilege Escalation
Information Disclosure
Dependency Risk
Configuration
```

Use the repository's existing ASVS/ZAP/Semgrep mechanisms where available.

---

# 27. Accessibility Review

Verify:

* keyboard-only operation
* focus visibility
* focus order
* semantic HTML
* accessible names
* form errors
* dialogs
* menus
* tables
* contrast
* reduced motion
* zoom behavior
* large text
* RTL behavior

Do not rely exclusively on an accessibility score.

---

# 28. Responsive Review

Verify at minimum:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Do not simply shrink the desktop layout.

Check:

* navigation
* forms
* tables
* dialogs
* typography
* spacing
* overflow
* touch targets
* horizontal scrolling
* content hierarchy

---

# 29. RTL / Internationalization

Ensure reusable components do not assume LTR.

Consider:

```text
Arabic
English
RTL
LTR
Long text
Text expansion
Dates
Numbers
Currency
Timezone
Pluralization
```

Avoid hardcoded directional assumptions such as unnecessary:

```text
margin-left
padding-left
left
right
```

where logical properties are appropriate.

Prefer:

```text
margin-inline
padding-inline
inset-inline
border-inline
```

when suitable.

---

# 30. Anti-Slop Enforcement

The executable layer must not encourage:

* generic AI landing pages
* meaningless gradients
* excessive glassmorphism
* arbitrary rounded cards
* unnecessary bento layouts
* excessive shadows
* excessive animations
* fake statistics
* fake testimonials
* fake logos
* placeholder content presented as real
* decorative UI without function

External design references are research inputs, not sources of truth.

---

# 31. Visual Consistency

Where visual testing is available, verify consistency of:

* typography
* spacing
* radius
* shadows
* colors
* buttons
* forms
* icons
* motion
* component states

Do not confuse consistency with visual monotony.

---

# 32. Evidence System

Create or update verification artifacts.

At minimum provide a final verification matrix containing:

```text
Capability
Status
Test
Result
Evidence
Notes
```

Statuses should include:

```text
PASS
FAIL
PARTIAL
NOT TESTED
BLOCKED
```

Use:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

when verification could not be performed.

Never convert "not tested" into "passed".

---

# 33. Final Self-Audit

After implementation, WebForge must audit itself.

Check:

### Repository Integrity

* broken references
* invalid paths
* duplicate IDs
* invalid registry entries
* broken scripts
* missing files
* inconsistent naming

### Engineering Integrity

* duplicated implementations
* architecture violations
* circular dependencies
* inconsistent APIs
* insecure defaults

### Testing Integrity

* missing tests
* tests that do not execute
* false-positive tests
* disabled checks
* stale snapshots
* incomplete regression coverage

### Documentation Integrity

* claims unsupported by implementation
* outdated commands
* outdated architecture
* missing documentation

---

# 34. Definition of Done

The mission is complete only when:

* [ ] Existing repository capabilities were audited first.
* [ ] No unnecessary duplicate systems were created.
* [ ] Missing executable security primitives were implemented where justified.
* [ ] Type-safe API/contract infrastructure was implemented where justified.
* [ ] Executable design tokens were implemented where justified.
* [ ] Core accessible components were implemented where justified.
* [ ] Infrastructure templates were implemented where justified.
* [ ] Unified verification execution was implemented.
* [ ] New functionality has automated tests.
* [ ] Relevant existing tests pass.
* [ ] Failures were fixed rather than suppressed.
* [ ] Regression tests were added for important defects.
* [ ] Registries were updated.
* [ ] Documentation reflects actual implementation.
* [ ] Adapters remain synchronized.
* [ ] Security verification was executed where tooling permits.
* [ ] Accessibility verification was executed where tooling permits.
* [ ] Responsive/visual verification was executed where tooling permits.
* [ ] Final evidence was generated.
* [ ] WebForge itself was self-audited.
* [ ] Remaining limitations are explicitly documented.

---

# 35. Final Report

At the end, generate a concise but technically complete report containing:

## A. Implemented

List every capability actually implemented.

## B. Modified

List every major existing file/system modified.

## C. Tests Executed

For each test:

```text
Test
Command
Result
Evidence
```

## D. Failures Found

For each important failure:

```text
Failure
Root Cause
Fix
Regression Test
Result
```

## E. Security Findings

List remaining security findings with severity.

## F. Environment Limitations

Explicitly state what could not be tested and why.

## G. Remaining Work

Only list genuinely unfinished work.

## H. Final Verification Status

Use:

```text
VERIFIED
PARTIALLY VERIFIED
NOT VERIFIED
```

Do not use "100% complete" unless every defined requirement and verification gate genuinely passed.

---

# 36. Critical Execution Rule

Do not stop after creating files.

The mission is not:

```text
Create files → report success
```

The mission is:

```text
Create
→ Integrate
→ Build
→ Execute
→ Test
→ Detect failures
→ Fix
→ Retest
→ Regression
→ Verify
→ Evidence
```

If implementation causes a failure, continue until the failure is fixed or a genuine environment limitation prevents completion.

If a requested capability already exists, improve or integrate it instead of duplicating it.

If a proposed implementation would introduce an insecure default, redesign it.

If a requirement conflicts with an existing higher-priority WebForge rule, follow WebForge's established rule-precedence system and document the decision.

---

# 37. Final Principle

WebForge OS must evolve from:

```text
A repository that tells AI how to build software
```

into:

```text
A reusable engineering system that helps AI
understand,
build,
verify,
secure,
test,
debug,
and continuously improve software.
```

The final product must be executable, testable, reusable, evidence-driven, and maintainable.

Do not optimize for the number of files created.

Optimize for:

```text
Correctness
Security
Reliability
Reusability
Verification
Traceability
Maintainability
```
