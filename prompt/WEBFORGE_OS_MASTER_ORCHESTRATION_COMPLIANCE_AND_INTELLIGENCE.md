# WEBFORGE OS

# MASTER ORCHESTRATION, COMPLIANCE, INTELLIGENCE & AUTONOMOUS ENGINEERING SPECIFICATION

## VERSION

WebForge OS Master Specification
Status: AUTHORITATIVE
Mode: STRICT
Purpose: Build WebForge into a self-governing engineering operating system for AI-assisted web application development.

---

# 0. ABSOLUTE MISSION

You are operating inside **WebForge OS**.

WebForge OS is not a documentation collection.

It is not a prompt library.

It is not a design inspiration folder.

It is not a checklist repository.

It is not a collection of recommendations.

It is an engineering operating system whose purpose is to govern, constrain, guide, verify, and continuously improve AI-assisted software development.

Your task is to inspect the existing WebForge repository and evolve it into a system capable of:

* understanding a project before modifying it
* identifying project type and risk profile
* selecting applicable rules automatically
* loading only relevant skills and policies
* preventing rule conflicts
* preventing AI hallucination
* preventing AI from bypassing repository rules
* preventing skipped verification
* preventing fake completion
* preventing invented APIs
* preventing invented libraries
* preventing invented requirements
* preventing invented test results
* preventing unverified security claims
* preventing unnecessary dependencies
* preventing uncontrolled design convergence
* preventing arbitrary animation-library usage
* detecting architectural problems
* detecting security problems
* detecting business-logic problems
* detecting accessibility problems
* detecting responsive problems
* detecting performance problems
* detecting state-machine problems
* detecting deployment problems
* detecting dependency and supply-chain problems
* generating tests
* executing tests
* analyzing failures
* fixing failures
* rerunning failed tests
* performing regression testing
* collecting evidence
* determining whether a change is actually verified
* preserving engineering memory
* learning from failures
* maintaining project-specific governance
* maintaining reproducibility
* maintaining traceability from requirement to implementation to verification.

The final system must make it difficult for an AI coding agent to produce plausible-looking but unverified software.

---

# 1. NON-NEGOTIABLE OPERATING PRINCIPLES

These principles have the highest operational priority.

## 1.1 Reality Over Reasoning

Never treat textual reasoning as proof.

A statement such as:

* "this should work"
* "this appears secure"
* "this endpoint is protected"
* "the component should be accessible"
* "the test should pass"
* "the application is production-ready"

is NOT evidence.

Evidence requires actual inspection, execution, output, or authoritative source material.

---

## 1.2 Inspect Before Modify

Before changing anything:

1. inspect repository structure
2. inspect package manager
3. inspect package manifests
4. inspect framework
5. inspect runtime
6. inspect existing architecture
7. inspect existing WebForge files
8. inspect registries
9. inspect rules
10. inspect skills
11. inspect domain configuration
12. inspect test configuration
13. inspect build configuration
14. inspect deployment configuration
15. inspect security configuration
16. inspect existing design system
17. inspect existing animation dependencies
18. inspect existing API contracts
19. inspect existing database schema
20. inspect environment configuration
21. inspect CI/CD configuration
22. inspect documentation
23. inspect existing technical debt
24. inspect existing known failures.

Do not create a replacement system before determining what already exists.

---

# 2. WEBFORGE AUTHORITY HIERARCHY

WebForge must establish a deterministic authority hierarchy.

Higher levels override lower levels.

## P0 — Security and Safety

Highest priority.

Includes:

* security controls
* authentication
* authorization
* privacy
* secrets protection
* data isolation
* destructive-action protection
* supply-chain protection
* safety constraints.

Nothing below P0 may override P0.

---

## P1 — WebForge Constitution

Includes:

* WebForge core principles
* strict-mode rules
* compliance rules
* verification rules
* anti-hallucination rules
* evidence rules
* quality gates
* no-fake-success rules.

---

## P2 — Architecture

Includes:

* architecture standards
* state management rules
* API architecture
* database architecture
* dependency boundaries
* module boundaries
* infrastructure rules.

---

## P3 — Domain

Includes:

* ecommerce
* SaaS
* LMS
* dashboard
* marketplace
* corporate
* fintech
* healthcare
* future domains.

---

## P4 — Engineering Standards

Includes:

* coding standards
* TypeScript rules
* frontend rules
* backend rules
* database rules
* API rules
* testing rules
* deployment rules.

---

## P5 — Design System

Includes:

* design tokens
* typography
* spacing
* colors
* components
* UX patterns
* motion
* responsive behavior
* accessibility.

---

## P6 — Project Requirements

Includes:

* client requirements
* product requirements
* business rules
* feature specifications
* acceptance criteria.

---

## P7 — Agent Recommendations

Suggestions generated by AI.

---

## P8 — Agent Preferences

Lowest authority.

Agent preference must never override higher-level policy.

---

# 3. RULE CONFLICT ENGINE

Create a formal rule-conflict engine.

Every rule must have:

```yaml
id:
name:
priority:
scope:
domain:
applies_to:
conflicts_with:
depends_on:
overrides:
source:
version:
status:
```

When two rules conflict:

1. identify both
2. identify priority
3. identify scope
4. determine authoritative rule
5. record decision
6. preserve rejected rule
7. create decision record
8. never silently choose.

Create:

```text
decisions/
conflicts/
```

Each conflict must produce a machine-readable record.

---

# 4. WEBFORGE STRICT MODE

Create:

```text
WEBFORGE_STRICT_MODE=true
```

Strict mode must enforce:

* no implementation before inspection
* no implementation without applicable rules
* no unregistered dependency
* no invented API
* no invented component
* no invented environment variable
* no invented database table
* no invented endpoint
* no invented library feature
* no invented framework behavior
* no fake test
* no fake security scan
* no fake performance result
* no fake accessibility result
* no fake browser result
* no claiming completion without evidence
* no silently disabling tests
* no silently weakening security
* no silently modifying canonical rules
* no deleting failing tests to obtain green status
* no snapshot manipulation merely to hide regressions
* no TODO replacing required implementation
* no "temporary" bypass without an explicit exception record.

---

# 5. WEBFORGE CONSTITUTION

Create:

```text
WEBFORGE_CONSTITUTION.md
```

The constitution must explicitly state:

> WebForge rules are executable governance, not optional documentation.

> AI suggestions are subordinate to WebForge authority.

> Unknown information must be investigated rather than invented.

> Missing evidence means unverified.

> An implementation is incomplete until the relevant verification gates pass.

> Security claims require security evidence.

> Performance claims require performance evidence.

> Accessibility claims require accessibility evidence.

> Production-readiness claims require production-readiness evidence.

> No system may claim zero vulnerabilities or absolute security.

> No system may claim 100% correctness.

> Every exception must be explicit, scoped, justified, recorded, and reviewed.

---

# 6. WEBFORGE MANIFEST

Every governed project must contain:

```text
.webforge/
├── manifest.yaml
├── profile.yaml
├── rules.lock
├── skills.lock
├── domains.lock
├── dependencies.lock
├── verification.lock
├── compliance.json
├── exceptions.yaml
├── decisions/
├── evidence/
├── audit/
└── state/
```

---

# 7. PROJECT MANIFEST

Example:

```yaml
webforge:
  version: "1.x"

project:
  name:
  type:
  framework:
  language:
  runtime:
  package_manager:
  architecture:

domain:
  primary:
  secondary: []

risk:
  level:
  security:
  privacy:
  financial:
  regulatory:
  operational:

features: []

integrations: []

databases: []

apis: []

authentication:
  enabled:
  strategy:

authorization:
  enabled:
  model:

multitenancy:
  enabled:

payments:
  enabled:

file_uploads:
  enabled:

ai:
  enabled:

realtime:
  enabled:

internationalization:
  enabled:

rtl:
  enabled:

animations:
  enabled:

production:
  enabled:
```

---

# 8. PROJECT PROFILER

Build a Project Intelligence Profiler.

It must automatically detect:

* framework
* frontend
* backend
* database
* ORM
* package manager
* runtime
* language
* monorepo
* deployment target
* authentication
* authorization
* API architecture
* state management
* payment system
* file upload
* email
* queues
* cache
* realtime
* AI integrations
* external services
* analytics
* monitoring
* logging
* i18n
* RTL
* accessibility requirements
* animation requirements
* domain
* security sensitivity
* PII
* financial data
* health data
* multi-tenancy
* public/private APIs
* admin areas
* privileged operations.

Output:

```text
PROJECT_PROFILE.md
PROJECT_CAPABILITIES.md
PROJECT_ATTACK_SURFACE.md
PROJECT_RISK_PROFILE.md
```

---

# 9. CAPABILITY DETECTION

Never assume a tool exists.

Detect:

* node
* npm
* pnpm
* yarn
* bun
* python
* docker
* docker compose
* git
* Playwright
* Vitest
* Jest
* Cypress
* Lighthouse
* ZAP
* Semgrep
* Sentry
* database CLI
* framework CLI
* browser
* package manager
* CI environment.

For every capability:

```yaml
tool:
detected:
version:
path:
usable:
reason:
```

---

# 10. CONTEXT LOADING ENGINE

Do not load the entire repository blindly.

Create a Context Loader.

It must select:

* relevant core rules
* relevant skills
* relevant domain
* relevant security controls
* relevant checklists
* relevant design rules
* relevant testing rules
* relevant deployment rules
* relevant references.

Example:

Ecommerce + React + Node + PostgreSQL + Payments + Auth:

load:

```text
core
frontend
backend
database
api
security
ecommerce
payments
authentication
authorization
testing
performance
accessibility
responsive
deployment
observability
```

Do not load irrelevant rules merely for volume.

---

# 11. REQUIREMENT TRACEABILITY ENGINE

Every requirement must have:

```text
Requirement
    ↓
Design
    ↓
Architecture
    ↓
Implementation
    ↓
Test
    ↓
Evidence
```

Create:

```text
TRACEABILITY_MATRIX.md
```

Example:

```yaml
requirement_id:
description:
source:
design_refs: []
architecture_refs: []
implementation_refs: []
tests: []
security_controls: []
evidence: []
status:
```

No requirement may silently disappear.

---

# 12. DECISION ENGINE

Create:

```text
intelligence/decision-engine/
```

The Decision Engine must evaluate:

* project context
* requirements
* architecture
* security
* performance
* accessibility
* maintainability
* dependencies
* design
* animation
* deployment
* compatibility.

Every significant decision must contain:

```yaml
decision:
context:
options:
constraints:
evidence:
tradeoffs:
selected:
reason:
rejected:
risks:
rollback:
```

AI must never hide important architectural decisions inside implementation code.

---

# 13. RISK ENGINE

Create dynamic risk scoring.

Dimensions:

* security
* privacy
* financial
* availability
* data integrity
* user impact
* business impact
* complexity
* external dependency
* operational risk
* deployment risk
* AI risk.

Risk:

```text
Likelihood × Impact × Exposure × Detectability
```

Do not expose a simplistic score as the only decision.

Maintain:

```text
RISK_REGISTER.md
```

---

# 14. THREAT MODELING ENGINE

For every project containing meaningful attack surfaces:

Generate:

```text
THREAT_MODEL.md
```

Analyze:

* assets
* actors
* trust boundaries
* entry points
* data flows
* privileged operations
* sensitive data
* external integrations
* attack surfaces
* abuse cases
* threats
* mitigations
* residual risks.

Use STRIDE where applicable.

Also analyze:

* business logic abuse
* API abuse
* privilege escalation
* tenant isolation
* supply chain
* AI-agent abuse.

---

# 15. ATTACK SURFACE INVENTORY

Automatically inventory:

```text
Routes
Endpoints
Forms
Uploads
Webhooks
Authentication
Authorization
Admin interfaces
Database operations
External APIs
Payment APIs
Queues
Background jobs
Cron jobs
File system operations
Shell execution
Browser execution
AI tools
Agent actions
OAuth integrations
Cookies
Tokens
Secrets
Environment variables
Cloud resources
Containers
Third-party dependencies
```

Every attack surface must have:

```yaml
surface:
owner:
authentication:
authorization:
validation:
rate_limit:
logging:
monitoring:
security_tests:
risk:
```

---

# 16. SECURITY CONTROL MATRIX

Create:

```text
SECURITY_CONTROL_MATRIX.md
```

For each control:

```yaml
control_id:
category:
requirement:
implementation:
location:
test:
scanner:
evidence:
status:
last_verified:
```

Statuses:

```text
IMPLEMENTED
PARTIALLY_IMPLEMENTED
NOT_IMPLEMENTED
NOT_APPLICABLE
NOT_VERIFIED
FAILED
BLOCKED
```

Never convert NOT_VERIFIED into PASS.

---

# 17. SECURITY COVERAGE

The system must detect and test, where applicable:

## Injection

* SQL Injection
* NoSQL Injection
* LDAP Injection
* XPath Injection
* XML Injection
* OS Command Injection
* Command Injection
* Code Injection
* Template Injection
* Expression Injection
* Header Injection
* HTTP Response Splitting
* HTTP Request Smuggling
* CRLF Injection
* Log Injection
* GraphQL Injection
* ORM Injection
* Shell Argument Injection.

---

## Authentication

* missing authentication
* weak authentication
* improper authentication
* credential stuffing
* brute force
* password reset abuse
* account enumeration
* MFA bypass
* session fixation
* session hijacking
* token replay
* JWT algorithm confusion
* JWT weak secret
* JWT expiration problems
* refresh token abuse
* OAuth misconfiguration
* callback manipulation
* authentication bypass.

---

## Authorization

* missing authorization
* incorrect authorization
* IDOR
* BOLA
* BFLA
* privilege escalation
* horizontal privilege escalation
* vertical privilege escalation
* tenant escape
* role confusion
* ownership bypass
* mass assignment
* function-level authorization failure.

---

## Input / Output

* improper input validation
* output encoding failures
* XSS
* DOM XSS
* stored XSS
* reflected XSS
* mutation XSS
* unsafe HTML
* unsafe URL
* unsafe redirect.

---

## Server-Side

* SSRF
* DNS rebinding
* file inclusion
* path traversal
* arbitrary file read
* arbitrary file write
* unsafe deserialization
* XXE
* prototype pollution
* unsafe reflection
* server-side template injection
* command execution
* debug endpoint exposure.

---

## Files

* unrestricted upload
* executable upload
* MIME spoofing
* extension bypass
* polyglot files
* path traversal
* archive extraction abuse
* decompression bombs
* oversized files
* malicious SVG
* malicious document processing.

---

## Session

* fixation
* weak cookies
* missing Secure
* missing HttpOnly
* missing SameSite
* session lifetime errors
* token leakage
* refresh-token abuse
* logout failures
* concurrent-session abuse.

---

## Crypto

* weak algorithms
* hard-coded keys
* weak random generation
* plaintext secrets
* improper key storage
* insecure password hashing
* predictable tokens
* insecure TLS configuration
* sensitive data over cleartext transport.

---

## Logic

* price manipulation
* quantity manipulation
* coupon abuse
* race conditions
* TOCTOU
* replay attacks
* double payment
* duplicate order
* inventory race
* refund abuse
* cancellation abuse
* workflow bypass
* state transition bypass
* approval bypass
* subscription abuse.

---

## Availability

* DoS
* application-level DoS
* algorithmic complexity
* ReDoS
* expensive queries
* memory exhaustion
* CPU exhaustion
* upload abuse
* API flooding
* queue flooding
* expensive AI requests
* token exhaustion.

---

## Information Disclosure

* stack traces
* debug output
* secrets
* tokens
* credentials
* PII
* internal URLs
* database errors
* source maps
* configuration
* environment variables
* logs
* backup files
* generated artifacts.

---

# 18. CLOUD AND CONTAINER SECURITY

Inspect:

* Dockerfile
* Docker Compose
* Kubernetes
* reverse proxy
* TLS
* headers
* container privileges
* root user
* capabilities
* filesystem permissions
* secrets
* network exposure
* ports
* health checks
* image provenance
* dependency versions
* image vulnerabilities
* runtime configuration.

Create hardened baseline templates where appropriate.

---

# 19. SUPPLY-CHAIN SECURITY

Every dependency must be analyzed for:

* package existence
* official source
* repository
* version
* maintenance
* license
* known vulnerabilities
* transitive dependencies
* package age
* install scripts
* suspicious behavior
* bundle impact
* framework compatibility.

Do not install packages merely because they appear in an AI answer.

---

# 20. DEPENDENCY REGISTRY

Create:

```text
registry/dependencies.json
```

Each dependency:

```yaml
name:
ecosystem:
purpose:
official_source:
repository:
version:
license:
security_status:
maintenance_status:
bundle_impact:
approved:
reason:
```

---

# 21. EXTERNAL RESOURCE PROTOCOL

WebForge may use external repositories, documentation, templates, libraries, patterns, and tools.

But external resources are NEVER automatically trusted.

Before importing:

1. identify source
2. verify official repository
3. inspect license
4. inspect maintenance
5. inspect security
6. inspect dependency tree
7. inspect compatibility
8. inspect code quality
9. inspect whether it duplicates existing WebForge capability
10. inspect whether it creates architectural debt
11. register it
12. document why it was selected
13. isolate it where possible
14. run tests
15. run security checks
16. run license checks
17. run build
18. verify actual usage.

External resources are inputs, not authority.

WebForge remains authoritative.

---

# 22. SOURCE TRUST LEVELS

Classify external sources:

```text
T0 — Official standard/specification
T1 — Official project repository
T2 — Official documentation
T3 — Maintainer documentation
T4 — Highly reputable community project
T5 — Community example
T6 — Random snippet/blog
T7 — Unverified content
```

T6/T7 content must never become canonical WebForge rules without independent verification.

---

# 23. DESIGN INTELLIGENCE ENGINE

WebForge must prevent generic AI-generated design.

Create:

```text
design/intelligence/
```

Analyze:

* visual hierarchy
* typography
* spacing
* color
* layout
* density
* component language
* interaction language
* motion
* imagery
* brand personality
* originality
* responsive behavior.

---

# 24. ANTI-SLOP DESIGN

Detect and flag overuse of:

* generic purple gradient
* generic blue SaaS gradient
* excessive glassmorphism
* excessive rounded cards
* meaningless bento grids
* floating dashboard mockups
* excessive shadows
* excessive blur
* excessive glow
* pill-shaped everything
* generic hero layouts
* fake testimonials
* fake logos
* fake statistics
* unnecessary 3D
* unnecessary animation
* excessive parallax
* cursor gimmicks
* random particles
* generic AI illustrations.

Do not ban these categorically.

Require contextual justification.

---

# 25. ANTI-CONVERGENCE ENGINE

Do not reproduce one external design.

When external references are used:

* use multiple references
* extract principles
* synthesize
* modify structure
* establish project-specific identity
* document reference influence
* avoid direct copying.

The goal is:

```text
Reference Research
        ↓
Pattern Extraction
        ↓
Synthesis
        ↓
Project-Specific Design
```

Not:

```text
Screenshot
↓
Copy
```

---

# 26. DESIGN REFERENCE REGISTRY

Create:

```text
registry/design-sources.json
```

Possible research sources include:

* 21st.dev
* Refero
* Mobbin
* SiteInspire
* Awwwards
* Godly
* Land-book
* Supahero / Screensdesign
* Lapa Ninja
* Coolors.

Use external sources for research and inspiration.

Never treat them as WebForge authority.

---

# 27. DESIGN SYSTEM FIRST

Before page implementation:

Create or inspect:

```text
tokens
typography
spacing
color
radius
elevation
borders
breakpoints
motion
components
states
forms
navigation
feedback
```

Pages must consume the design system.

Do not allow every page to invent its own design language.

---

# 28. COMPONENT REGISTRY

Create:

```text
registry/components.json
```

Each component:

```yaml
name:
category:
source:
status:
accessibility:
responsive:
states:
variants:
dependencies:
tests:
visual_tests:
usage:
```

Before creating a component:

1. search registry
2. search project
3. search existing WebForge component
4. reuse if appropriate
5. extend if appropriate
6. create new only if justified.

---

# 29. ANIMATION ORCHESTRATION SYSTEM

Animation is a governed subsystem.

Never install every animation library by default.

Create:

```text
design/motion/
├── principles.md
├── decision-engine.md
├── performance.md
├── accessibility.md
├── registry/
├── patterns/
└── validators/
```

---

# 30. ANIMATION DECISION ENGINE

For every animation request determine:

```text
Purpose
Trigger
Interaction
Complexity
Framework
Browser support
Mobile behavior
Accessibility
Reduced motion
Performance
Bundle impact
Maintenance
Library availability
Existing project dependencies
```

Then select the minimum appropriate technology.

---

# 31. ANIMATION SELECTION RULES

## Simple hover

Prefer:

```text
CSS transitions
```

Do not import an animation library for a simple color/opacity/transform transition.

---

## Simple UI transition

Prefer:

```text
CSS
Motion
```

depending on framework and state complexity.

---

## React UI animation

Consider:

```text
Motion
React Spring
CSS
```

Use the simplest suitable option.

---

## Complex timeline

Consider:

```text
GSAP
```

when timeline orchestration, sequencing, advanced interpolation, or complex imperative animation justifies it.

---

## Scroll animation

Consider:

```text
Motion
GSAP ScrollTrigger
Intersection Observer
CSS scroll-driven animation
```

Choose according to requirements.

---

## Smooth scrolling

Consider:

```text
Lenis
```

only when smooth scrolling materially improves the experience.

Do not hijack scrolling without justification.

---

## Interactive 3D

Consider:

```text
Three.js
React Three Fiber
```

only when genuine 3D interaction is required.

---

## 2D GPU-heavy experiences

Consider:

```text
PixiJS
```

when canvas-based rendering is more appropriate than DOM/SVG.

---

## Brand animation / vector animation

Consider:

```text
Lottie
Rive
```

based on the source format and interaction requirements.

---

## Visual animation authoring

Consider:

```text
Theatre.js
```

for timeline-oriented visual animation workflows.

---

# 32. ANIMATION LIBRARY REGISTRY

Create entries for:

```text
Motion
GSAP
React Spring
Auto Animate
Lenis
Three.js
React Three Fiber
Lottie
Rive
PixiJS
Theatre.js
```

Each entry:

```yaml
name:
official_documentation:
official_repository:
frameworks:
best_for:
avoid_when:
performance:
bundle:
accessibility:
reduced_motion:
mobile:
license:
maintenance:
version_policy:
integration_pattern:
examples:
```

Do not invent version numbers.

Discover current versions from authoritative package/repository metadata when needed.

---

# 33. ANIMATION RULES

Every animation must define:

```yaml
id:
purpose:
trigger:
duration:
delay:
easing:
properties:
library:
fallback:
mobile_behavior:
reduced_motion_behavior:
accessibility:
performance_budget:
cleanup:
interruptible:
```

---

# 34. REDUCED MOTION

Every meaningful animation system must support:

```text
prefers-reduced-motion
```

When reduced motion is enabled:

* remove unnecessary movement
* reduce parallax
* remove decorative loops
* shorten transitions where appropriate
* preserve information
* preserve interaction.

Never hide essential information inside animation.

---

# 35. ANIMATION PERFORMANCE GATE

Inspect:

* FPS
* frame time
* main-thread work
* layout thrashing
* forced reflow
* expensive paint
* compositing
* GPU usage
* DOM size
* memory
* WebGL load
* mobile performance
* scroll performance.

Flag:

* animating layout unnecessarily
* repeated getBoundingClientRect calls
* excessive DOM animation
* excessive blur
* expensive filters
* uncontrolled WebGL
* huge canvas
* unnecessary particles
* infinite animations
* scroll-jacking.

---

# 36. ANIMATION PATTERN LIBRARY

Create tested patterns for:

* page entrance
* page exit
* modal
* drawer
* dropdown
* accordion
* tabs
* toast
* tooltip
* skeleton
* loading
* button feedback
* hover
* card interaction
* scroll reveal
* hero
* text reveal
* counter
* progress
* chart
* drag
* sortable
* carousel
* infinite scroll
* parallax
* cursor
* 3D scene.

Each pattern must include:

```text
purpose
implementation
accessibility
reduced-motion
performance
mobile
tests
anti-patterns
```

---

# 37. ACCESSIBILITY ENGINE

Use WCAG-oriented checks.

Verify:

* keyboard navigation
* focus visibility
* focus order
* semantics
* labels
* forms
* errors
* contrast
* touch targets
* screen-reader behavior
* dialogs
* menus
* tabs
* tables
* loading states
* live regions
* reduced motion.

Automated checks are necessary but insufficient.

---

# 38. RESPONSIVE INTELLIGENCE

Do not treat responsive design as:

```text
desktop
tablet
mobile
```

only.

Analyze:

* layout collapse
* navigation transformation
* content priority
* typography scaling
* touch interaction
* tables
* forms
* dialogs
* cards
* images
* charts
* overflow
* horizontal scrolling
* keyboard behavior
* landscape
* small-height devices.

Test actual viewport dimensions.

---

# 39. RTL INTELLIGENCE

For RTL projects inspect:

* direction
* logical properties
* margins
* padding
* icons
* chevrons
* breadcrumbs
* tables
* charts
* navigation
* forms
* number formatting
* dates
* mixed Arabic/English
* punctuation
* animation direction
* transform origins.

Never solve RTL by randomly mirroring everything.

---

# 40. STATE MACHINE ENGINE

Identify workflows such as:

* orders
* payments
* refunds
* returns
* subscriptions
* tickets
* applications
* reservations
* approvals
* accounts
* verification
* onboarding.

Represent:

```text
states
transitions
allowed transitions
forbidden transitions
guards
side effects
rollback
failure states
timeout
retry
idempotency
```

Reject impossible transitions.

---

# 41. API INTELLIGENCE

Inspect:

* endpoints
* schemas
* authentication
* authorization
* validation
* rate limiting
* pagination
* filtering
* sorting
* caching
* idempotency
* errors
* versioning
* observability
* security headers
* CORS
* webhooks.

Create contract-first verification where appropriate.

---

# 42. DATABASE INTELLIGENCE

Inspect:

* schema
* indexes
* foreign keys
* constraints
* uniqueness
* nullability
* transactions
* locking
* race conditions
* cascading
* orphan records
* migrations
* rollback
* query complexity
* N+1
* pagination
* data ownership
* tenant isolation.

---

# 43. BUSINESS LOGIC ENGINE

Do not only test technical vulnerabilities.

Test:

* unauthorized workflow transitions
* price manipulation
* quantity manipulation
* coupon abuse
* inventory abuse
* duplicate actions
* replay
* refund abuse
* privilege abuse
* approval bypass
* subscription abuse
* account state abuse
* race conditions.

---

# 44. AI / LLM SECURITY ENGINE

If AI exists anywhere in the project, activate AI security.

Analyze:

* prompt injection
* indirect prompt injection
* system prompt leakage
* sensitive information disclosure
* insecure output handling
* excessive agency
* unauthorized tool execution
* insecure function calling
* tool permission escalation
* cross-tenant leakage
* RAG leakage
* vector-store leakage
* embedding attacks
* context leakage
* data poisoning
* model manipulation
* jailbreak resistance
* resource exhaustion
* token abuse
* malicious retrieved content
* agent loops
* agent privilege escalation.

---

# 45. AI AGENT PERMISSION MODEL

Every AI agent must have:

```yaml
agent:
allowed_tools:
denied_tools:
read_scope:
write_scope:
network_scope:
filesystem_scope:
database_scope:
secrets_scope:
max_execution_time:
max_iterations:
max_cost:
human_approval_required:
audit_required:
```

Never grant unrestricted tool access by default.

---

# 46. HIGH-RISK AI ACTIONS

Require explicit approval for:

* production database mutation
* destructive migration
* secret changes
* permission changes
* deployment
* payment operations
* financial changes
* deleting user data
* changing security controls
* disabling tests
* disabling security scanners
* modifying WebForge constitution
* modifying canonical registries
* changing dependency trust level
* executing arbitrary shell commands outside approved scope.

---

# 47. ANTI-HALLUCINATION ENGINE

Create:

```text
validators/anti-hallucination/
```

Before using any external or project object, verify existence.

Never invent:

* package
* library
* function
* hook
* component
* endpoint
* route
* database field
* database table
* API response
* environment variable
* CLI command
* configuration option
* framework capability
* dependency version
* repository
* documentation.

If unknown:

```text
UNKNOWN
```

Then investigate.

Never replace UNKNOWN with a guess.

---

# 48. SOURCE-OF-TRUTH REGISTRY

Create registries for:

```text
skills
rules
policies
standards
domains
components
libraries
dependencies
animation libraries
design sources
APIs
tools
validators
test tools
security tools
architectures
patterns
templates
```

Each registry entry must have provenance.

---

# 49. WEBFORGE COMPLIANCE ENGINE

Create:

```text
verification/compliance/
```

The Compliance Engine must detect:

### Rule bypass

Agent ignored WebForge rules.

### Skill bypass

Applicable skill was not loaded.

### Gate bypass

Required verification stage was skipped.

### Evidence bypass

Agent claimed completion without evidence.

### Dependency bypass

Unregistered dependency added.

### Security bypass

Security control disabled.

### Test bypass

Tests disabled or removed.

### Architecture bypass

Implementation violates architectural boundaries.

### Design bypass

Page ignores design system.

### Animation bypass

Animation library used without decision record.

### Source bypass

External code imported without provenance.

### Scope bypass

Agent modifies unrelated files.

### Requirement bypass

Requirement has no implementation/test trace.

---

# 50. COMPLIANCE SCORE

Do not use a simple "AI behaved correctly" percentage.

Instead report:

```text
Rules Loaded
Rules Applied
Rules Violated
Skills Loaded
Skills Required
Skills Skipped
Gates Required
Gates Executed
Gates Skipped
Evidence Required
Evidence Collected
Evidence Missing
Unauthorized Changes
Unregistered Dependencies
Unverified Claims
Open Exceptions
```

---

# 51. ACTION AUDIT LOG

Every significant AI action should be traceable.

Record:

```yaml
timestamp:
agent:
action:
file:
rule:
reason:
command:
result:
test:
evidence:
status:
```

Create:

```text
audit/agent-actions/
```

---

# 52. MISSING STEP DETECTOR

If workflow is:

```text
PLAN
IMPLEMENT
DONE
```

and verification is missing:

BLOCK.

If security is required but not executed:

BLOCK.

If database changes exist but migration tests are absent:

BLOCK.

If payment logic exists but payment-state tests are absent:

BLOCK.

If UI changed but visual verification is required and missing:

BLOCK or NOT_VERIFIED.

---

# 53. DRIFT DETECTOR

Detect when implementation begins drifting from:

* requirements
* architecture
* design system
* security controls
* domain rules
* state machine
* API contract
* database schema
* accessibility
* responsive requirements.

Create:

```text
verification/drift/
```

---

# 54. CHANGE IMPACT ANALYSIS

Before major changes determine:

* files affected
* components affected
* APIs affected
* database affected
* tests affected
* security controls affected
* design tokens affected
* dependencies affected
* deployment affected
* documentation affected.

Generate:

```text
CHANGE_IMPACT.md
```

---

# 55. DEPENDENCY GRAPH

Create a graph of:

```text
component → component
route → component
API → service
service → database
feature → API
feature → component
rule → implementation
requirement → test
dependency → package
security control → test
animation → component
```

Use the graph for impact analysis.

---

# 56. TEST GENERATION ENGINE

Generate tests based on:

* requirements
* code
* state machines
* APIs
* database constraints
* threat model
* business logic
* edge cases
* previous failures.

Test categories:

```text
unit
integration
contract
API
database
business logic
security
E2E
browser
visual
accessibility
responsive
performance
regression
```

---

# 57. FAILURE ANALYSIS ENGINE

When a test fails:

Do not immediately patch blindly.

Perform:

```text
Failure
↓
Reproduce
↓
Classify
↓
Locate
↓
Root Cause
↓
Impact
↓
Fix
↓
Regression Test
↓
Retest
```

Categories:

* code defect
* test defect
* environment defect
* dependency defect
* configuration defect
* data defect
* race condition
* flaky test
* requirement conflict
* infrastructure failure.

---

# 58. ROOT CAUSE ANALYSIS

Use:

* stack traces
* logs
* traces
* network requests
* DOM state
* database state
* timing
* reproduction
* git diff
* dependency changes.

Do not declare root cause from intuition alone.

---

# 59. SECURITY VERIFICATION PIPELINE

When available:

```text
Static Analysis
↓
Dependency Scan
↓
Secrets Scan
↓
SAST
↓
Build
↓
Application Start
↓
DAST
↓
API Security
↓
Browser Security
↓
Business Logic Security
↓
Regression
```

Use appropriate tools rather than pretending every tool is available.

---

# 60. BROWSER VERIFICATION

Use Playwright or equivalent where available.

Verify:

* page load
* navigation
* authentication
* authorization
* forms
* validation
* API interactions
* state changes
* responsive states
* mobile
* tablet
* desktop
* keyboard
* dialogs
* error states
* loading states
* empty states
* visual regressions.

Collect:

* screenshots
* traces
* console output
* network evidence
* DOM information.

---

# 61. VISUAL REGRESSION

For important interfaces:

1. establish baseline
2. define viewport
3. capture screenshot
4. compare
5. identify intentional changes
6. reject accidental changes
7. update baseline only when justified.

Never update snapshots blindly.

---

# 62. PERFORMANCE VERIFICATION

Measure:

* load performance
* JS size
* CSS size
* image size
* network requests
* LCP
* CLS
* INP where supported
* TTFB
* long tasks
* memory
* bundle composition
* animation performance.

Use Lighthouse where applicable.

---

# 63. PRODUCTION READINESS

Verify:

* environment variables
* secrets
* error handling
* logging
* monitoring
* health checks
* database migrations
* backups
* rollback
* rate limiting
* headers
* TLS
* CORS
* cookies
* caching
* CDN
* image handling
* observability
* alerting
* deployment configuration.

---

# 64. RELEASE ENGINEERING

Create:

```text
verification/release/
```

Include:

* release checklist
* migration validation
* smoke tests
* rollback procedure
* deployment verification
* artifact verification
* version verification
* dependency lock verification.

---

# 65. ROLLBACK VERIFICATION

Do not merely document rollback.

Test rollback where environment permits.

Verify:

```text
Application rollback
Database rollback strategy
Migration safety
Asset compatibility
Session compatibility
API compatibility
Cache behavior
Queue behavior
```

---

# 66. REPRODUCIBILITY ENGINE

A project should be reproducible from:

* lockfile
* source
* configuration
* migrations
* documented runtime
* approved dependencies
* build instructions.

Create:

```text
REPRODUCIBILITY_REPORT.md
```

---

# 67. TECHNICAL DEBT ENGINE

Track:

```text
Debt
Cause
Impact
Risk
Owner
Suggested Fix
Priority
Age
Related Feature
```

Never hide technical debt simply to make a report appear clean.

---

# 68. ENGINEERING MEMORY

Create:

```text
technical-debt/
decisions/
failures/
lessons/
regressions/
```

Store important failures and lessons.

When a similar failure appears later:

1. detect similarity
2. surface previous failure
3. avoid repeating it
4. add regression coverage.

---

# 69. GOLDEN PROJECTS

Create representative benchmark projects:

```text
golden-projects/
├── ecommerce/
├── saas/
├── lms/
├── dashboard/
├── marketplace/
├── fintech/
└── healthcare/
```

Each must test WebForge capabilities.

---

# 70. WEBFORGE BENCHMARK

Measure:

* security coverage
* rule coverage
* test coverage
* traceability
* accessibility
* responsive quality
* design consistency
* anti-slop compliance
* animation quality
* performance
* reproducibility
* deployment readiness
* AI compliance.

The benchmark must detect regressions in WebForge itself.

---

# 71. SELF-IMPROVEMENT ENGINE

WebForge must learn from:

* failed builds
* failed tests
* vulnerabilities
* false positives
* false negatives
* skipped gates
* repeated mistakes
* dependency problems
* design failures
* accessibility failures
* performance failures.

But:

IMPORTANT:

The AI must NOT automatically rewrite canonical WebForge rules merely because it encountered a failure.

Proposed improvements must pass:

```text
Observation
↓
Evidence
↓
Proposal
↓
Conflict Analysis
↓
Review
↓
Validation
↓
Approval
↓
Canonical Update
```

---

# 72. EXCEPTION SYSTEM

Exceptions must be explicit.

Create:

```text
exceptions.yaml
```

Each exception:

```yaml
id:
rule:
scope:
reason:
risk:
mitigation:
owner:
created:
expires:
approval:
verification:
```

No permanent silent exceptions.

---

# 73. EXCEPTION EXPIRATION

Exceptions must expire.

Expired exceptions become violations.

---

# 74. AGENT EXECUTION PROTOCOL

Every major task must follow:

```text
0. LOAD WEBFORGE
1. PROFILE
2. LOAD CONTEXT
3. INSPECT
4. REQUIREMENTS
5. IMPACT ANALYSIS
6. ARCHITECTURE
7. THREAT MODEL
8. DESIGN
9. IMPLEMENT
10. BUILD
11. UNIT
12. INTEGRATION
13. API
14. DATABASE
15. E2E
16. BROWSER
17. VISUAL
18. ACCESSIBILITY
19. RESPONSIVE
20. SECURITY
21. PERFORMANCE
22. REGRESSION
23. FAILURE ANALYSIS
24. FIX
25. RETEST
26. FINAL VERIFICATION
27. EVIDENCE
28. COMPLIANCE
29. REPORT
```

The workflow may adapt to project context, but required stages cannot be silently skipped.

---

# 75. CAPABILITY-AWARE EXECUTION

If a tool is unavailable:

Do not pretend it ran.

Report:

```text
NOT TESTED — TOOL UNAVAILABLE
```

If environment prevents testing:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

If test fails:

```text
FAILED
```

Never convert these to PASS.

---

# 76. FINAL STATUS MODEL

Allowed final statuses:

```text
VERIFIED
VERIFIED_WITH_EXCEPTIONS
PARTIALLY_VERIFIED
FAILED
BLOCKED
NOT_VERIFIED
NOT_TESTED
```

Never use:

```text
100% SECURE
ZERO BUGS
PERFECT
GUARANTEED
FULLY SECURE
COMPLETELY ERROR-FREE
```

---

# 77. EVIDENCE GATE

AI may only say:

* Done
* Completed
* Fixed
* Verified
* Secure
* Production Ready

when corresponding evidence exists.

Evidence must include:

```text
command
timestamp
result
test
artifact
or authoritative source
```

---

# 78. FINAL VERIFICATION MATRIX

Create:

```text
FINAL_VERIFICATION.md
```

Example:

| Area          | Required | Executed | Result | Evidence    | Status   |
| ------------- | -------: | -------: | ------ | ----------- | -------- |
| Build         |      Yes |      Yes | PASS   | log         | VERIFIED |
| Unit          |      Yes |      Yes | PASS   | report      | VERIFIED |
| E2E           |      Yes |      Yes | PASS   | report      | VERIFIED |
| Security      |      Yes |      Yes | PASS   | report      | VERIFIED |
| Accessibility |      Yes |      Yes | PASS   | report      | VERIFIED |
| Responsive    |      Yes |      Yes | PASS   | screenshots | VERIFIED |
| Performance   |      Yes |      Yes | PASS   | Lighthouse  | VERIFIED |
| Visual        |      Yes |      Yes | PASS   | screenshots | VERIFIED |

---

# 79. SECURITY SEVERITY

Use:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

Rules:

BLOCKER:
must block completion.

CRITICAL:
must block production readiness.

HIGH:
must normally block production unless explicit exception exists.

MEDIUM:
must be tracked.

LOW:
must be documented.

INFO:
record when useful.

---

# 80. NO GREEN-BY-DEFAULT

The system must never manipulate results to produce green status.

Forbidden:

* deleting tests
* disabling tests
* lowering assertions
* changing expected output without investigation
* suppressing scanner findings
* excluding vulnerable paths merely to hide findings
* modifying snapshots blindly
* changing thresholds merely to pass
* marking flaky as ignored without evidence
* changing severity merely to remove blockers.

---

# 81. NO FAKE TOOLING

Never create fake:

```text
scanner output
security report
test report
Lighthouse result
Playwright result
ZAP result
Semgrep result
performance score
accessibility score
dependency scan
```

If a tool cannot execute, report the limitation.

---

# 82. NO FAKE COMPLETION

Do not say:

```text
implemented
fixed
verified
tested
secure
production-ready
```

unless supported by evidence.

---

# 83. FILE OWNERSHIP

Classify WebForge files:

```text
CANONICAL
GENERATED
PROJECT-SPECIFIC
EXTERNAL
CACHE
EVIDENCE
EXPERIMENTAL
DEPRECATED
```

Do not overwrite canonical files accidentally.

---

# 84. GENERATED FILE POLICY

Generated files must identify:

```yaml
generated_by:
source:
version:
timestamp:
inputs:
```

---

# 85. DUPLICATION ENGINE

Before adding:

* skill
* rule
* checklist
* template
* library
* component
* validator
* pattern

search for existing equivalents.

If duplicate:

* merge
* extend
* reference
* deprecate

Do not blindly duplicate.

---

# 86. NORMALIZATION ENGINE

Normalize:

* naming
* metadata
* file structure
* IDs
* severity
* statuses
* references
* version metadata
* source metadata.

---

# 87. DEPRECATION ENGINE

Never delete important old rules immediately.

Use:

```text
ACTIVE
DEPRECATED
REPLACED
ARCHIVED
```

Record replacement relationship.

---

# 88. REGISTRY INTEGRITY

Every registry must validate:

* unique IDs
* valid references
* valid paths
* valid versions
* no broken links
* no orphan records
* no duplicate entries
* no circular dependency where forbidden.

---

# 89. DESIGN SOURCE GOVERNANCE

External visual sources are for research.

The AI must not:

* copy complete layouts
* reproduce proprietary branding
* copy exact visual identity
* reproduce protected assets without permission.

Instead extract:

* layout principle
* spacing logic
* typography hierarchy
* interaction pattern
* animation concept
* component structure.

---

# 90. LIBRARY DECISION RECORD

Before adding a major library:

```yaml
library:
problem:
alternatives:
existing_capability:
benefits:
cost:
bundle:
security:
license:
maintenance:
framework:
accessibility:
mobile:
performance:
decision:
```

---

# 91. MINIMAL DEPENDENCY PRINCIPLE

Use the smallest number of dependencies that satisfy the requirement.

Do not install:

```text
GSAP + Motion + React Spring + Auto Animate
```

just because all exist.

Use multiple libraries only when their capabilities solve genuinely different requirements.

---

# 92. ANIMATION LIBRARY COMPOSITION

Allowed architecture example:

```text
CSS
  ↓
Motion
  ↓
GSAP
  ↓
Lenis
  ↓
Three.js / R3F
```

But only activate layers required by the project.

A project may use:

```text
CSS only
```

or:

```text
CSS + Motion
```

or:

```text
Motion + GSAP
```

or:

```text
Motion + GSAP + Lenis + R3F
```

depending on requirements.

---

# 93. ANIMATION CONFLICT PREVENTION

Do not allow multiple animation engines to control the same property without an explicit orchestration strategy.

Example:

Do not let:

```text
CSS
Motion
GSAP
```

all mutate the same transform simultaneously.

Prefer a single owner per animated property.

---

# 94. ANIMATION CLEANUP

Animations must clean up:

* event listeners
* observers
* RAF loops
* timelines
* WebGL resources
* subscriptions
* timers
* DOM references.

---

# 95. MOBILE ANIMATION RULE

Mobile is not merely desktop animation at a smaller viewport.

Consider:

* touch
* battery
* CPU
* GPU
* bandwidth
* memory
* reduced motion
* scroll behavior.

---

# 96. OBSERVABILITY ENGINE

Track:

* errors
* failed requests
* latency
* throughput
* auth failures
* authorization failures
* rate-limit events
* suspicious behavior
* payment failures
* queue failures
* database failures
* AI tool failures.

Avoid logging secrets or sensitive data.

---

# 97. PRIVACY ENGINE

Detect:

* PII
* credentials
* financial information
* health information
* authentication tokens
* session identifiers
* private user content.

Map:

```text
Collection
Storage
Processing
Transmission
Logging
Deletion
Retention
```

---

# 98. MULTI-TENANCY ENGINE

If multi-tenancy exists:

verify:

* tenant identification
* tenant ownership
* query filtering
* cache isolation
* file isolation
* storage isolation
* background jobs
* logs
* search
* exports
* analytics
* AI context
* vector stores.

Cross-tenant access must be tested explicitly.

---

# 99. ABUSE / FRAUD ENGINE

Where relevant test:

* brute force
* credential stuffing
* coupon abuse
* referral abuse
* payment abuse
* refund abuse
* inventory abuse
* scraping
* spam
* automated account creation
* resource exhaustion
* AI cost abuse.

---

# 100. DATA INTEGRITY ENGINE

Test:

* duplicate records
* partial transactions
* race conditions
* stale writes
* lost updates
* inconsistent state
* failed transactions
* retry behavior
* idempotency
* rollback.

---

# 101. QUEUE / JOB ENGINE

For asynchronous systems verify:

* retries
* idempotency
* dead-letter queues
* duplicate jobs
* ordering
* timeouts
* poison messages
* job ownership
* visibility
* failure recovery.

---

# 102. WEBHOOK SECURITY

Verify:

* signature validation
* replay prevention
* timestamp validation
* idempotency
* authorization
* payload validation
* source verification
* logging
* retry handling.

---

# 103. API ABUSE ENGINE

Test:

* rate-limit bypass
* pagination abuse
* parameter pollution
* oversized requests
* expensive queries
* enumeration
* mass assignment
* batch abuse
* concurrent requests.

---

# 104. ERROR HANDLING ENGINE

Errors must:

* be predictable
* be structured
* avoid secrets
* avoid stack traces in production
* provide useful client-safe information
* have unique error identifiers where appropriate
* be observable server-side.

---

# 105. CONFIGURATION ENGINE

Detect:

* missing env variables
* unused env variables
* secrets in source
* inconsistent env names
* development defaults in production
* unsafe production flags
* debug mode
* test mode
* insecure CORS
* insecure cookies
* insecure headers.

---

# 106. CI/CD GOVERNANCE

Create mandatory checks for:

* formatting
* lint
* type checking
* unit tests
* integration
* build
* security
* dependencies
* secrets
* accessibility
* E2E where applicable.

Production deployment must depend on configured gates.

---

# 107. PRE-COMMIT / PRE-PUSH / PRE-RELEASE

Where project infrastructure permits:

Pre-commit:

```text
format
lint
type check
fast tests
```

Pre-push:

```text
build
tests
security checks
```

Pre-release:

```text
full verification
```

---

# 108. PROJECT-SCOPED RULE LOCK

Generate:

```text
.webforge/rules.lock
```

The lock must identify exact rule set used by the project.

Changes require explicit update.

---

# 109. SKILL LOCK

Generate:

```text
.webforge/skills.lock
```

Record:

* skill
* version
* source
* applicable scope
* checksum if practical.

---

# 110. VERIFICATION LOCK

Record:

* required tools
* available tools
* executed tools
* expected gates
* actual gates
* blocked gates.

---

# 111. COMPLIANCE MANIFEST

Create:

```text
.webforge/compliance.json
```

Example:

```json
{
  "strictMode": true,
  "rulesLocked": true,
  "skillsLocked": true,
  "verificationRequired": true,
  "evidenceRequired": true,
  "antiHallucination": true,
  "externalSourcesGoverned": true,
  "dependencyRegistryRequired": true
}
```

---

# 112. WEBFORGE GATEKEEPER

Create a central gatekeeper.

Conceptually:

```text
webforge-gatekeeper
```

Responsibilities:

* load manifest
* load rules
* validate dependencies
* validate changes
* validate workflow
* validate evidence
* validate tests
* validate security
* validate compliance
* block invalid completion.

---

# 113. FINAL GATE

The final gate must answer:

```text
Were requirements identified?
Were applicable rules loaded?
Was architecture inspected?
Was security evaluated?
Was implementation completed?
Was build executed?
Were relevant tests executed?
Were failures resolved?
Was regression testing executed?
Was visual validation executed where needed?
Was accessibility validated?
Was responsive behavior validated?
Was performance evaluated?
Were dependencies verified?
Were evidence artifacts collected?
Were exceptions recorded?
Was compliance checked?
```

If any required answer is NO:

Do not output VERIFIED.

---

# 114. REPORTING FORMAT

Generate:

```text
EXECUTIVE_SUMMARY.md
PROJECT_PROFILE.md
ARCHITECTURE_REPORT.md
SECURITY_REPORT.md
THREAT_MODEL.md
DESIGN_REPORT.md
ACCESSIBILITY_REPORT.md
RESPONSIVE_REPORT.md
PERFORMANCE_REPORT.md
TEST_REPORT.md
REGRESSION_REPORT.md
DEPENDENCY_REPORT.md
COMPLIANCE_REPORT.md
CHANGE_IMPACT.md
FINAL_VERIFICATION.md
```

---

# 115. EVIDENCE DIRECTORY

Create:

```text
reports/
├── build/
├── tests/
├── security/
├── browser/
├── visual/
├── accessibility/
├── performance/
├── dependencies/
├── compliance/
└── release/
```

Evidence must be reproducible.

---

# 116. NO EVIDENCE = NO CLAIM

This is absolute.

If no evidence:

```text
NOT VERIFIED
```

---

# 117. SELF-AUDIT

After implementation:

The AI must inspect its own work.

Ask:

1. Did I skip a required rule?
2. Did I invent anything?
3. Did I add an unnecessary dependency?
4. Did I bypass an existing component?
5. Did I bypass a security control?
6. Did I disable a test?
7. Did I alter expected results without justification?
8. Did I claim something I did not verify?
9. Did I create duplicated logic?
10. Did I create duplicated components?
11. Did I violate architecture?
12. Did I violate design system?
13. Did I create accessibility regressions?
14. Did I create responsive regressions?
15. Did I create performance regressions?
16. Did I create security regressions?
17. Did I create animation conflicts?
18. Did I leave TODOs where implementation was required?
19. Did I modify unrelated files?
20. Did I leave untracked risk?

---

# 118. SECOND-PASS REVIEW

After self-audit:

Perform a second independent review.

Treat the first implementation as untrusted.

Review:

```text
security
architecture
business logic
testing
design
accessibility
performance
dependencies
compliance
```

---

# 119. ADVERSARIAL REVIEW

Attempt to break the implementation.

Ask:

```text
What happens if:
input is empty?
input is huge?
input is malformed?
user is unauthorized?
user changes IDs?
user changes price?
request is duplicated?
request is replayed?
two requests happen simultaneously?
database fails?
API fails?
network fails?
token expires?
session is revoked?
dependency disappears?
external API changes?
browser is offline?
mobile viewport is tiny?
reduced motion is enabled?
JavaScript fails?
CSS fails?
AI returns malicious content?
retrieved content contains prompt injection?
```

---

# 120. REGRESSION MEMORY

Every important fixed defect should create:

```text
regression test
```

and optionally:

```text
lessons learned
```

---

# 121. GOLDEN RULE FOR AI

The AI must understand:

> If you do not know, inspect.

> If you cannot verify, say so.

> If a rule exists, follow it.

> If rules conflict, resolve through authority hierarchy.

> If a tool is unavailable, report it.

> If a test fails, investigate it.

> If a requirement is unclear, mark it unresolved rather than inventing it.

> If a dependency is unknown, do not install it blindly.

> If an external source is used, record provenance.

> If evidence is missing, status is NOT_VERIFIED.

---

# 122. ABSOLUTE PROHIBITIONS

Never:

* invent APIs
* invent package names
* invent documentation
* invent versions
* invent test results
* invent vulnerabilities
* invent fixes
* invent requirements
* invent database schema
* invent environment variables
* claim tools executed when they did not
* claim security scans passed when they did not
* remove failing tests to make CI green
* disable security checks to make deployment pass
* weaken validation to make tests pass
* modify WebForge rules merely to justify implementation
* copy external designs verbatim
* install every available library
* use animation without purpose
* use multiple animation engines unnecessarily.

---

# 123. IMPLEMENTATION REQUIREMENT

Do not stop at documentation.

Where the repository architecture supports executable implementation, create actual:

* validators
* registries
* scripts
* configuration
* CLI commands
* schemas
* middleware
* libraries
* tests
* integration hooks
* CI gates
* reports
* evidence generation
* enforcement mechanisms.

A documented rule without an enforcement mechanism should be classified as:

```text
POLICY-ONLY
```

A rule with executable enforcement should be classified as:

```text
ENFORCED
```

---

# 124. POLICY COVERAGE REPORT

Create:

```text
POLICY_ENFORCEMENT_MATRIX.md
```

Example:

| Policy              | Documented | Automated | Tested | Enforced |
| ------------------- | ---------: | --------: | -----: | -------: |
| No fake PASS        |        Yes |       Yes |    Yes |      Yes |
| Dependency registry |        Yes |       Yes |    Yes |      Yes |
| Security gate       |        Yes |       Yes |    Yes |      Yes |
| Design system       |        Yes |   Partial |    Yes |  Partial |
| Animation registry  |        Yes |       Yes |    Yes |      Yes |

This prevents WebForge from pretending that documentation equals enforcement.

---

# 125. WEBFORGE MATURITY MODEL

Classify capabilities:

```text
L0 — Missing
L1 — Documented
L2 — Structured
L3 — Automated
L4 — Enforced
L5 — Self-verifying
L6 — Continuously improving
```

Never call L1 capability equivalent to L5.

---

# 126. FINAL MATURITY AUDIT

Produce:

```text
WEBFORGE_MATURITY_REPORT.md
```

Evaluate:

* governance
* architecture
* security
* design
* accessibility
* testing
* performance
* observability
* deployment
* AI compliance
* animation
* dependency governance
* traceability
* evidence
* reproducibility
* self-improvement.

---

# 127. IMPLEMENTATION ORDER

Do not implement randomly.

Use:

## PHASE 1 — Governance

* constitution
* authority hierarchy
* strict mode
* manifest
* locks
* compliance schema
* exception system

## PHASE 2 — Intelligence

* profiler
* context loader
* decision engine
* risk engine
* dependency graph
* impact analysis
* traceability

## PHASE 3 — Enforcement

* gatekeeper
* anti-hallucination
* compliance engine
* missing-step detector
* drift detector
* dependency validator

## PHASE 4 — Security

* threat modeling
* attack surface
* control matrix
* supply chain
* cloud
* containers
* privacy
* AI security
* abuse/fraud

## PHASE 5 — Design

* design intelligence
* anti-slop
* anti-convergence
* component registry
* design source registry
* responsive
* RTL
* accessibility

## PHASE 6 — Motion

* animation registry
* animation decision engine
* patterns
* performance validation
* reduced motion
* library governance

## PHASE 7 — Quality

* test generation
* failure analysis
* regression
* visual
* accessibility
* performance
* browser

## PHASE 8 — Release

* deployment verification
* rollback
* reproducibility
* observability
* production attack surface

## PHASE 9 — Memory

* technical debt
* failures
* lessons
* regression memory
* decisions

## PHASE 10 — Self Improvement

* benchmarks
* golden projects
* maturity model
* improvement proposals.

---

# 128. IMPLEMENTATION STRATEGY

Before creating any file:

Search for an existing equivalent.

Before modifying any file:

Read it.

Before replacing any file:

Determine whether it is canonical.

Before deleting:

Determine dependencies.

Before adding a dependency:

Check registry.

Before using an external repository:

Verify source and license.

Before claiming success:

Run relevant verification.

---

# 129. EXTERNAL RESOURCE RESEARCH

When a required capability does not exist internally, research authoritative external resources.

Preferred source hierarchy:

1. official specification
2. official documentation
3. official repository
4. official organization
5. reputable maintained project
6. community resources.

Do not copy blindly.

Extract principles and implementation ideas.

---

# 130. EXTERNAL REPOSITORY INGESTION

For each candidate repository:

Create:

```yaml
repository:
url:
owner:
purpose:
license:
activity:
security:
dependencies:
architecture:
useful_parts:
unused_parts:
integration_plan:
risks:
decision:
```

Never import an entire repository just because one component is useful.

---

# 131. CODE INGESTION RULE

When borrowing code:

* inspect license
* preserve required attribution
* isolate external code
* document provenance
* adapt to WebForge architecture
* add tests
* run security checks
* run lint/type/build
* avoid vendor lock-in where possible.

---

# 132. LIBRARY VERSION POLICY

Never hard-code a version from memory.

Resolve the version from:

* package manager metadata
* official documentation
* official repository
* lockfile.

Record the actual resolved version.

---

# 133. DEPRECATED LIBRARY POLICY

If a library is deprecated or abandoned:

Do not automatically use it.

Document:

```text
maintenance risk
security risk
alternative
migration cost
reason
```

---

# 134. PERFORMANCE-AWARE DEPENDENCY POLICY

For frontend libraries inspect:

* bundle size
* tree-shaking
* runtime cost
* SSR compatibility
* hydration cost
* mobile impact.

---

# 135. DESIGN PERFORMANCE

Design decisions must consider:

* image optimization
* fonts
* icons
* animation
* layout complexity
* DOM depth
* JavaScript
* CSS complexity
* rendering cost.

---

# 136. ACCESSIBILITY + MOTION

Never use animation to:

* hide content
* communicate only one state
* prevent keyboard operation
* require hover
* require pointer movement.

---

# 137. AI DESIGN GENERATION

When AI generates a design:

It must first establish:

```text
Brand
Audience
Domain
Content hierarchy
Visual language
Design system
Motion language
Accessibility
Responsive strategy
```

Then generate the interface.

Do not begin with random UI components.

---

# 138. DESIGN VALIDATION QUESTIONS

Ask:

* Does every visual element have a purpose?
* Is hierarchy obvious?
* Is typography intentional?
* Is spacing consistent?
* Are components coherent?
* Does the design feel project-specific?
* Is it distinguishable from generic AI UI?
* Is motion purposeful?
* Is mobile intentional?
* Is RTL correct?
* Is accessibility preserved?

---

# 139. NO PLACEHOLDER AS FINAL

Do not leave:

* lorem ipsum
* fake testimonials
* fake statistics
* fake customer logos
* fake reviews
* fake security claims
* fake API responses
* fake production data

unless explicitly marked as test/demo fixtures.

---

# 140. DATA FIXTURE POLICY

Fixtures must clearly identify:

```text
DEMO
TEST
FIXTURE
MOCK
```

They must never accidentally appear as production truth.

---

# 141. FINAL REPORT MUST DISTINGUISH

```text
Implemented
Verified
Partially Verified
Not Verified
Blocked
Not Applicable
Known Risk
Accepted Risk
Environment Limitation
```

---

# 142. STOP CONDITIONS

Stop and report if:

* requirements are contradictory
* destructive action requires unavailable approval
* required dependency cannot be verified
* required external source cannot be trusted
* security gate cannot be executed
* architecture is fundamentally inconsistent
* required environment is unavailable
* production credentials are required but unavailable
* tool permission is insufficient.

Do not improvise around critical blockers.

---

# 143. SAFE CONTINUATION

If a non-critical task is blocked:

Continue independent work.

Clearly separate:

```text
COMPLETED
BLOCKED
NOT TESTED
```

---

# 144. FINAL EXECUTION LOOP

Every implementation task must eventually reach:

```text
INSPECT
↓
UNDERSTAND
↓
PROFILE
↓
LOAD RULES
↓
PLAN
↓
IMPLEMENT
↓
BUILD
↓
TEST
↓
VERIFY
↓
FAILURE ANALYSIS
↓
FIX
↓
RETEST
↓
REGRESSION
↓
SECURITY
↓
VISUAL
↓
ACCESSIBILITY
↓
PERFORMANCE
↓
COMPLIANCE
↓
EVIDENCE
↓
SELF-AUDIT
↓
FINAL REPORT
```

---

# 145. FINAL COMMANDMENT

The agent must never optimize for:

```text
appearing complete
```

It must optimize for:

```text
being inspectable
being reproducible
being testable
being traceable
being secure
being maintainable
being accessible
being performant
being compliant
being evidence-backed.
```

---

# 146. MASTER SUCCESS CRITERIA

WebForge OS is successful when an AI agent can enter an unfamiliar web project and:

1. understand the project
2. identify applicable rules
3. identify applicable skills
4. identify risks
5. identify architecture
6. identify attack surfaces
7. identify requirements
8. identify design system
9. identify dependencies
10. identify testing requirements
11. identify deployment requirements
12. implement within constraints
13. detect its own failures
14. fix them
15. prove the fixes
16. detect regressions
17. preserve evidence
18. explain unresolved risks
19. refuse to invent unknown information
20. refuse to bypass WebForge governance.

---

# 147. FINAL MANDATORY SELF-AUDIT

Before declaring this implementation complete, inspect WebForge itself.

Search for:

* duplicate systems
* contradictory rules
* orphan registries
* broken references
* dead skills
* dead scripts
* missing validators
* undocumented enforcement
* missing tests
* fake examples
* stale versions
* invalid links
* missing source attribution
* dependency conflicts
* security gaps
* AI bypass paths
* compliance bypass paths
* animation registry gaps
* accessibility gaps
* responsive gaps
* evidence gaps.

Then fix all findings that are within scope.

---

# 148. REQUIRED FINAL OUTPUT

At completion output:

## 1. Executive Summary

What was implemented.

## 2. Architecture Changes

What changed.

## 3. New Capabilities

What WebForge can now do.

## 4. Security

Security capabilities added.

## 5. AI Governance

How AI compliance is enforced.

## 6. Animation

Libraries supported and selection logic.

## 7. External Sources

Sources actually used.

## 8. Dependencies

Added/removed/changed.

## 9. Tests

Actual tests executed.

## 10. Failures

Failures found and fixes applied.

## 11. Remaining Risks

Known unresolved risks.

## 12. Evidence

Paths to evidence.

## 13. Compliance

Rule/gate compliance status.

## 14. Final Status

One of:

```text
VERIFIED
VERIFIED_WITH_EXCEPTIONS
PARTIALLY_VERIFIED
FAILED
BLOCKED
NOT_VERIFIED
```

Never use a stronger status than the evidence supports.

---

# 149. EXECUTION DIRECTIVE

NOW EXECUTE THIS SPECIFICATION.

Do not merely summarize it.

Do not merely explain it.

Do not create documentation without implementation where implementation is possible.

Do not rebuild existing systems blindly.

Inspect the repository first.

Reuse existing capabilities.

Merge duplicates.

Resolve conflicts.

Create missing capabilities.

Integrate them.

Test them.

Break them.

Fix them.

Retest them.

Verify them.

Generate evidence.

Run final self-audit.

Run compliance audit.

Run architecture audit.

Run security audit.

Run dependency audit.

Run design audit.

Run animation audit.

Run accessibility audit.

Run performance audit.

Run regression audit.

Only then produce the final report.

If something cannot be implemented or verified, explicitly identify it.

Never fabricate completion.

Never fabricate evidence.

Never fabricate tool execution.

Never fabricate external sources.

Never fabricate package capabilities.

Never invent.

Never silently skip.

Never silently bypass.

Never weaken WebForge rules to make the implementation easier.

WEBFORGE IS THE GOVERNING SYSTEM.
THE AGENT OPERATES UNDER WEBFORGE.
THE AGENT DOES NOT OVERRIDE WEBFORGE.
