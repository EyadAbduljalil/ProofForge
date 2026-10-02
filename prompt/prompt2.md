# WEBFORGE OS

# AUTONOMOUS BUILD, VERIFICATION & QUALITY SYSTEM

This module extends the WebForge OS architecture.

The objective is not merely to provide instructions to an AI coding agent.

The objective is to create a system in which an AI agent can:

PLAN → BUILD → RUN → INSPECT → TEST → DETECT → FIX → RETEST → REGRESS → VERIFY → REPORT

The agent must use the actual execution environment whenever the platform provides access to:

* editor
* terminal
* browser
* filesystem
* package manager
* test runner
* application runtime
* database
* logs
* network inspection
* screenshots
* traces
* CI/CD

Do not replace real verification with textual reasoning.

---

# 1. CORE PRINCIPLE

WebForge OS must optimize for:

> Maximum practical defect detection and correction before release.

The system must aggressively reduce:

* bugs
* regressions
* security vulnerabilities
* broken responsive layouts
* accessibility defects
* visual defects
* broken user flows
* API failures
* database inconsistencies
* business-logic errors
* performance regressions
* production configuration errors

The system must NEVER claim that a project contains zero bugs or is perfectly secure merely because automated checks passed.

However:

> Every reasonable automated verification available in the execution environment must be attempted before completion.

---

# 2. REAL EXECUTION OVER PROMPT-ONLY VERIFICATION

Never accept statements such as:

* "The code looks correct."
* "This should work."
* "The page should be responsive."
* "The endpoint should be secure."
* "The tests should pass."
* "The UI appears correct."

when the environment allows actual verification.

Instead:

RUN IT.

OPEN IT.

TEST IT.

INSPECT IT.

MEASURE IT.

FIX IT.

RUN IT AGAIN.

---

# 3. AUTONOMOUS DEVELOPMENT LOOP

Every substantial task must follow:

```text
DISCOVER
    ↓
PLAN
    ↓
IMPLEMENT
    ↓
BUILD
    ↓
START APPLICATION
    ↓
RUN STATIC CHECKS
    ↓
RUN UNIT TESTS
    ↓
RUN INTEGRATION TESTS
    ↓
RUN E2E TESTS
    ↓
OPEN APPLICATION IN BROWSER
    ↓
VISUAL INSPECTION
    ↓
RESPONSIVE INSPECTION
    ↓
ACCESSIBILITY INSPECTION
    ↓
SECURITY INSPECTION
    ↓
PERFORMANCE INSPECTION
    ↓
IDENTIFY FAILURES
    ↓
FIX
    ↓
RE-RUN FAILED CHECKS
    ↓
RUN REGRESSION SUITE
    ↓
FINAL VERIFICATION
    ↓
REPORT EVIDENCE
```

Never skip a stage without recording why.

---

# 4. BUILD VERIFICATION

After implementation:

1. Install dependencies.
2. Validate dependency integrity.
3. Run type checking.
4. Run linting.
5. Run formatting checks.
6. Build the application.
7. Start the application.
8. Confirm the expected port/service.
9. Inspect startup logs.
10. Detect runtime exceptions.
11. Inspect browser console errors.
12. Inspect failed network requests.

A successful build does NOT mean the application works.

---

# 5. PLAYWRIGHT AS THE PRIMARY BROWSER VERIFICATION LAYER

When the project is a web application and Playwright is compatible with the stack, use Playwright for browser-level verification.

Official source:

https://playwright.dev/

Use:

* Chromium
* Firefox
* WebKit

where practical.

Playwright supports cross-browser testing and mobile/tablet emulation.

Use it for:

* navigation
* authentication
* forms
* CRUD
* search
* filtering
* sorting
* pagination
* checkout
* payments in test environments
* file uploads
* dialogs
* modals
* permissions
* error states
* user workflows
* responsive behavior

---

# 6. BROWSER TEST GENERATION

For every important user flow:

```text
USER ACTION
→ EXPECTED RESULT
→ ACTUAL RESULT
→ PASS / FAIL
```

Create reusable E2E tests.

Do not only test happy paths.

Test:

* valid input
* invalid input
* empty input
* malformed input
* unauthorized access
* forbidden access
* expired session
* network failure
* server failure
* duplicate submission
* refresh during operation
* back button behavior
* direct URL access
* mobile behavior

---

# 7. VISUAL REGRESSION

Use Playwright screenshot assertions where appropriate.

Official documentation:

https://playwright.dev/docs/test-snapshots

Playwright supports screenshot comparison through `toHaveScreenshot()`.

Create visual baselines for important pages/components.

Compare:

* layout
* typography
* spacing
* colors
* component position
* overflow
* responsive behavior
* modal dimensions
* navigation
* tables
* cards
* forms

Do not update snapshots automatically merely to make tests pass.

A changed screenshot must be reviewed as a potential regression.

---

# 8. TRACE-BASED DEBUGGING

When a browser test fails:

Capture Playwright traces.

Trace information may include:

* DOM snapshots
* screenshots
* network activity
* console logs
* timing
* actions

Use the trace to identify the actual failure instead of guessing.

For CI failures, prefer trace-based debugging over relying only on screenshots or videos.

---

# 9. RESPONSIVE VERIFICATION

Do not merely inspect CSS media queries.

Actually open the application at representative viewports.

Minimum:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

When relevant, test:

* iOS-like mobile viewport
* Android-like mobile viewport
* tablet
* desktop

Inspect:

* navigation
* menus
* sidebar
* grids
* cards
* tables
* forms
* typography
* buttons
* dialogs
* images
* horizontal overflow
* sticky elements
* fixed elements
* touch targets

A page is NOT responsive merely because CSS contains media queries.

---

# 10. ACCESSIBILITY VERIFICATION

Run automated accessibility checks where available.

Then perform manual/agentic checks for:

* keyboard navigation
* focus order
* focus visibility
* semantic HTML
* labels
* headings
* landmarks
* dialogs
* menus
* buttons
* links
* contrast
* reduced motion
* screen-reader semantics

Do not rely solely on an accessibility score.

---

# 11. LIGHTHOUSE VERIFICATION

Use Lighthouse when applicable.

Official source:

https://developer.chrome.com/docs/lighthouse/

Lighthouse provides audits covering:

* Performance
* Accessibility
* Best Practices
* SEO

Use it as one verification signal, not as the entire QA system.

Record:

* Performance findings
* Accessibility findings
* Best Practice findings
* SEO findings
* important opportunities
* regressions

Do not optimize for the score alone.

Fix the underlying problem.

---

# 12. SECURITY VERIFICATION

Security must have multiple layers.

Use:

```text
Static Analysis
+
Dependency Analysis
+
Secrets Detection
+
Configuration Review
+
Authorization Tests
+
API Tests
+
Dynamic Application Testing
+
Business Logic Testing
```

---

# 13. OWASP ASVS

Use OWASP ASVS as the security verification baseline.

Official source:

https://owasp.org/www-project-application-security-verification-standard/

ASVS provides security requirements and a basis for testing technical security controls in web applications.

Map WebForge security rules to ASVS categories.

Create:

```text
security/asvs/
```

Do not copy the entire external standard blindly.

Create a mapping:

```text
WebForge Rule
→
ASVS Requirement
→
Verification Method
→
Evidence
```

---

# 14. OWASP ZAP

Use OWASP ZAP for dynamic security testing when appropriate and authorized.

Official source:

https://www.zaproxy.org/

Use the Automation Framework where practical.

ZAP supports automated jobs such as:

* spidering
* AJAX spider
* passive scanning
* active scanning
* OpenAPI import
* GraphQL import
* authentication
* request generation
* report generation

and can execute plans from YAML.

Use ZAP against:

* local development environments
* test environments
* staging environments

Do NOT perform active security scans against production systems unless explicitly authorized.

---

# 15. SECURITY TESTING SCOPE

Test for applicable categories including:

* broken authentication
* broken authorization
* IDOR/BOLA
* XSS
* injection
* CSRF
* SSRF
* insecure file upload
* path traversal
* security misconfiguration
* sensitive information exposure
* insecure cookies
* CORS problems
* missing security headers
* rate-limit weaknesses
* brute-force exposure
* session problems
* privilege escalation
* webhook verification
* API abuse
* business logic abuse

---

# 16. SEMGREP

Use Semgrep when compatible with the project.

Official source:

https://semgrep.dev/

Use it for static security analysis and code-pattern detection.

It can detect common issues such as XSS and SQL injection and can also identify more complex security/business-logic patterns depending on the available analysis.

Integrate it as:

```text
code
↓
Semgrep
↓
findings
↓
triage
↓
fix
↓
rescan
```

Do not automatically suppress findings simply because they are inconvenient.

Every ignored finding requires a documented reason.

---

# 17. DEPENDENCY SECURITY

Inspect:

* outdated dependencies
* vulnerable dependencies
* transitive dependencies
* abandoned packages
* suspicious packages
* unnecessary packages
* duplicate packages
* license conflicts
* package scripts
* supply-chain risks

Do not add a dependency merely to solve a trivial problem.

---

# 18. SECRET SECURITY

Detect:

* API keys
* passwords
* tokens
* private keys
* credentials
* database URLs
* cloud credentials

Never commit secrets.

Never expose secrets to frontend bundles.

Never print secrets in logs.

Never include secrets in screenshots or test artifacts.

---

# 19. API VERIFICATION

For every API:

Check:

```text
Authentication
Authorization
Validation
Response schema
Error schema
Rate limiting
Pagination
Filtering
Sorting
Caching
Idempotency
Transactions
Logging
Security
```

Test:

* valid request
* invalid request
* missing fields
* wrong types
* unauthorized request
* forbidden request
* nonexistent resource
* duplicate request
* malformed request
* excessive request
* unexpected input

---

# 20. DATABASE VERIFICATION

Inspect:

* schema correctness
* indexes
* foreign keys
* constraints
* unique constraints
* transactions
* cascading behavior
* orphan records
* race conditions
* migration integrity
* query performance
* N+1 queries
* unsafe queries

Test concurrent operations where business logic requires it.

---

# 21. BUSINESS LOGIC VERIFICATION

Do not limit testing to technical correctness.

Model the actual state machine.

For example:

```text
PENDING
→ PAID
→ PROCESSING
→ SHIPPED
→ DELIVERED
```

Then verify illegal transitions:

```text
DELIVERED
→ PENDING
```

must fail if the business rules prohibit it.

Test:

* duplicate actions
* retries
* race conditions
* stale state
* invalid transitions
* ownership
* privilege boundaries
* financial inconsistencies
* inventory inconsistencies

---

# 22. ECOMMERCE VERIFICATION

For Ecommerce projects specifically:

Test:

```text
Product
→ Cart
→ Checkout
→ Payment
→ Order
→ Inventory
→ Shipment
→ Return
→ Refund
```

Test:

* double checkout
* duplicate payment
* stock race
* coupon abuse
* invalid coupon
* expired coupon
* coupon limits
* refund limits
* unauthorized order access
* price manipulation
* quantity manipulation
* shipping manipulation
* invalid order transitions

---

# 23. ERROR OBSERVABILITY

Where production monitoring is part of the project, support:

https://sentry.io/

Use error and performance monitoring where appropriate.

Monitoring must capture useful diagnostic information without leaking:

* passwords
* tokens
* payment data
* secrets
* unnecessary PII

Production observability is separate from pre-release testing.

---

# 24. FAILURE CLASSIFICATION

Every failure must be classified:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

Severity should be based on:

* security impact
* data integrity
* business impact
* user impact
* exploitability
* reproducibility
* scope

Do not classify everything as critical.

Do not hide critical problems as warnings.

---

# 25. AUTOMATIC FIX LOOP

When a test fails:

```text
FAIL
↓
Collect Evidence
↓
Identify Root Cause
↓
Implement Fix
↓
Run Focused Test
↓
Run Related Tests
↓
Run Regression Suite
```

Do not simply modify the test to match broken behavior.

Tests are allowed to change only when the expected behavior legitimately changed.

---

# 26. ROOT-CAUSE REQUIREMENT

When fixing a defect:

Do not treat the visible symptom as the root cause automatically.

Example:

```text
Button does not work
```

Do not simply add another click handler.

Investigate:

```text
UI
↓
Event
↓
State
↓
API
↓
Backend
↓
Database
```

Fix the actual broken layer.

---

# 27. REGRESSION PROTECTION

Every important bug fixed should result in one of:

* regression test
* unit test
* integration test
* E2E test
* security test
* visual regression test

depending on the nature of the defect.

A fixed bug must not be allowed to silently return.

---

# 28. TEST PYRAMID

Use appropriate distribution:

```text
Many Unit Tests
        ↓
Integration Tests
        ↓
API Tests
        ↓
Fewer E2E Tests
        ↓
Critical User Journeys
```

Do not build the entire test strategy from E2E tests.

---

# 29. QUALITY GATES

Define gates:

## Gate 1 — Build

Must pass.

## Gate 2 — Type Safety

Must pass when applicable.

## Gate 3 — Lint

Must pass unless documented exception exists.

## Gate 4 — Unit Tests

Required.

## Gate 5 — Integration Tests

Required where applicable.

## Gate 6 — E2E

Required for critical flows.

## Gate 7 — Visual QA

Required for UI projects.

## Gate 8 — Responsive QA

Required for web UI.

## Gate 9 — Accessibility

Required.

## Gate 10 — Security

Required for applications.

## Gate 11 — Performance

Required for public-facing applications.

## Gate 12 — Production Readiness

Required before release.

---

# 30. NO GREEN-BY-DEFAULT

Never modify configuration simply to make the CI pipeline green.

Examples:

Do not:

* disable tests
* increase thresholds without evidence
* ignore errors
* suppress warnings globally
* skip failing suites
* hide console errors
* remove assertions
* weaken security checks
* update screenshots blindly
* mark tests as flaky without evidence

---

# 31. EVIDENCE ARTIFACTS

The verification process should produce evidence such as:

```text
reports/
├── build/
├── tests/
├── e2e/
├── visual/
├── accessibility/
├── security/
├── performance/
└── production/
```

Evidence may include:

* test reports
* screenshots
* traces
* logs
* network captures where appropriate
* Lighthouse reports
* security findings
* dependency reports

Do not store secrets in evidence artifacts.

---

# 32. FINAL VERIFICATION MATRIX

Generate:

```text
FINAL_VERIFICATION.md
```

Example:

| Area          | Status | Evidence          |
| ------------- | ------ | ----------------- |
| Build         | PASS   | build log         |
| Typecheck     | PASS   | compiler output   |
| Unit          | PASS   | test report       |
| Integration   | PASS   | test report       |
| E2E           | PASS   | Playwright report |
| Visual        | PASS   | screenshots       |
| Responsive    | PASS   | viewport tests    |
| Accessibility | PASS   | audit             |
| Security      | PASS   | ASVS/ZAP/SAST     |
| Performance   | PASS   | Lighthouse        |
| SEO           | PASS   | Lighthouse/manual |
| Production    | PASS   | deployment check  |

Never use:

```text
100% Secure
100% Bug Free
Perfect
```

Use evidence-based status.

---

# 33. COMPLETION CRITERIA

A project can be declared:

```text
VERIFIED
```

only when:

* required build checks pass
* required tests pass
* critical E2E flows pass
* visual verification passes
* responsive verification passes
* accessibility verification passes
* security checks pass or documented exceptions exist
* performance is reviewed
* production configuration is reviewed
* no unresolved blocker/critical defect remains

If something cannot be tested because the environment lacks the required capability:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

must be reported explicitly.

Do not convert it into PASS.

---

# 34. WEBFORGE SHOULD CHOOSE TOOLS DYNAMICALLY

Do not force every tool onto every project.

Determine:

```text
Project Type
+
Stack
+
Risk
+
Features
+
Environment
```

then select applicable validators.

Example:

Landing Page:

```text
Playwright
Lighthouse
Accessibility
Visual QA
SEO
```

Ecommerce:

```text
Playwright
Lighthouse
Accessibility
Security
ZAP
Semgrep
Database Tests
Payment Tests
Business Logic Tests
```

Internal API:

```text
Unit
Integration
API
Security
Semgrep
ZAP where applicable
```

Do not run expensive checks without reason.

---

# 35. EXTERNAL TOOLS ARE VALIDATORS, NOT SOURCES OF TRUTH

The hierarchy remains:

```text
Project Requirements
        ↓
Security / Correctness
        ↓
WebForge Core
        ↓
Domain Rules
        ↓
Design System
        ↓
Tooling
        ↓
AI Defaults
```

Playwright does not define WebForge's architecture.

Lighthouse does not define WebForge's UX.

ZAP does not define the entire security model.

External tools provide evidence.

WebForge defines how that evidence is interpreted and acted upon.

---

# 36. TOOL REGISTRY

Create:

```text
registry/tools.json
```

Each tool should include:

```yaml
id:
name:
category:
purpose:
official_url:
when_to_use:
required:
supports:
outputs:
limitations:
security_notes:
```

Initial registry:

```text
21st.dev
Refero
Mobbin
SiteInspire
Land-book
Godly
Awwwards
Supahero
Lapa Ninja
Coolors
Motion

Playwright
Lighthouse
OWASP ASVS
OWASP ZAP
Semgrep
Sentry
```

---

# 37. TOOL ADAPTERS

Create:

```text
adapters/
├── antigravity/
├── claude-code/
├── codex/
├── cursor/
├── v0/
├── lovable/
└── generic/
```

The core workflow must remain platform-independent.

Adapters translate WebForge workflows into the capabilities available in each environment.

---

# 38. CAPABILITY DETECTION

At the beginning of every project, the agent must determine what the current environment can actually do.

Detect:

```text
Browser available?
Terminal available?
Filesystem available?
Network available?
Database available?
Docker available?
Git available?
Test runner available?
Visual inspection available?
CI available?
Deployment access available?
```

Then create:

```text
PROJECT_CAPABILITIES.md
```

Do not assume a capability exists.

---

# 39. CAPABILITY-AWARE VERIFICATION

If browser access exists:

→ perform browser testing.

If terminal access exists:

→ execute tests and builds.

If database access exists:

→ verify database behavior.

If deployment access exists:

→ verify deployment.

If a capability does not exist:

→ document the limitation.

Never pretend a verification happened when it did not.

---

# 40. CONTINUOUS VERIFICATION

Do not wait until the entire application is finished.

Verify incrementally:

```text
Feature 1
→ Build
→ Test
→ Verify

Feature 2
→ Build
→ Test
→ Verify

Feature 3
→ Build
→ Test
→ Verify

Final
→ Full Regression
```

This reduces the search space when a failure occurs.

---

# 41. PRE-COMMIT QUALITY

Before committing substantial changes:

```text
Typecheck
Lint
Unit Tests
Relevant Integration Tests
Relevant E2E Tests
Security Checks
```

For UI changes:

```text
Visual Regression
Responsive Verification
Accessibility Verification
```

---

# 42. PRE-RELEASE QUALITY

Before release:

```text
Full Build
Full Test Suite
Critical E2E
Visual Regression
Accessibility
Security
Dependency Audit
Performance
SEO
Production Configuration
Environment Variables
Logging
Monitoring
Rollback Strategy
```

---

# 43. POST-DEPLOYMENT VERIFICATION

If deployment access exists:

After deployment:

```text
Health Check
Homepage
Authentication
Critical API
Critical User Flow
Error Monitoring
Console Errors
Network Errors
```

Do not assume local success means production success.

---

# 44. PRODUCTION SMOKE TEST

Create:

```text
tests/smoke/
```

with minimal critical flows.

Example:

```text
Open site
→ Login
→ Access dashboard
→ Perform critical action
→ Logout
```

For Ecommerce:

```text
Open
→ Product
→ Cart
→ Checkout
→ Test Payment
→ Order
```

Only use test/sandbox payment systems.

---

# 45. CHANGE IMPACT ANALYSIS

Before changing shared code:

Determine:

```text
What depends on this?
Which pages use it?
Which APIs use it?
Which tests cover it?
Which design components depend on it?
```

Then run targeted regression tests.

---

# 46. DEFINITION OF DONE

The phrase:

> "Feature implemented"

is not enough.

The actual Definition of Done is:

```text
Implemented
+
Built
+
Executed
+
Tested
+
Inspected
+
Secured
+
Verified
+
Regression-tested
+
Documented
```

---

# 47. FINAL AGENT BEHAVIOR

The AI agent must behave as:

```text
Developer
+
Architect
+
QA Engineer
+
Security Engineer
+
UX Reviewer
+
Accessibility Reviewer
+
Performance Engineer
+
Release Engineer
```

but must not pretend to possess evidence that it did not obtain.

---

# 48. FINAL RULE

The most important WebForge rule is:

> DO NOT TRUST THE CODE. VERIFY THE RUNNING SYSTEM.

And:

> DO NOT TRUST A SINGLE TEST. CROSS-VALIDATE IMPORTANT BEHAVIOR.

And:

> DO NOT DECLARE SUCCESS WITHOUT EVIDENCE.

````

### ما الذي تغيّر فعليًا بعد هذه الإضافة؟

النسخة أصبحت أقرب إلى هذا:

```text
                    WEBFORGE OS
                         │
          ┌──────────────┴──────────────┐
          │                             │
   KNOWLEDGE SYSTEM               EXECUTION SYSTEM
          │                             │
 Rules / Skills / Domains          Build / Run / Inspect
          │                             │
 Design Intelligence              Playwright
          │                       Lighthouse
          │                       ZAP
          │                       Semgrep
          │                       Sentry
          │                             │
          └──────────────┬──────────────┘
                         │
                   VERIFICATION
                         │
              ┌──────────┼──────────┐
              │          │          │
           Visual     Security    Functional
              │          │          │
              └──────────┼──────────┘
                         │
                     FIX LOOP
                         │
                   REGRESSION
                         │
                  FINAL EVIDENCE
````

وهذا مهم لأن **Playwright ليس مجرد Test Runner هنا**؛ يمكنه تشغيل المتصفح، اختبار Chromium/Firefox/WebKit، التقاط screenshots، تسجيل traces، فحص الشبكة والـDOM، وحتى العمل كأداة للـAI agents عبر MCP/CLI.

وبالمثل **ZAP ليس مجرد Security Scanner**؛ يمكن تشغيل خطة أمنية كاملة من YAML، مع authentication وspidering وpassive/active scanning وOpenAPI وGraphQL واختبارات لنتائج الـjobs.

## الإضافة التي لا يجب إهمالها

هناك فرق بين:

**Testing**

و

**Verification Architecture**

أنت تريد الثانية.

لذلك لا تجعل:

```text
tests/
```

مجلدًا فقط.

اجعل:

```text
verification/
├── capabilities/
├── build/
├── functional/
├── e2e/
├── visual/
├── responsive/
├── accessibility/
├── security/
├── performance/
├── api/
├── database/
├── business-logic/
├── production/
├── regression/
└── evidence/
```

ويكون لكل Verification:

```text
Rule
↓
Test
↓
Execution
↓
Evidence
↓
Failure
↓
Root Cause
↓
Fix
↓
Retest
```

هذا هو الجزء الذي يجعل المشروع **نظامًا هندسيًا فعليًا بدل مستودع Prompts ضخم**.

وأيضًا لا تجعل WebForge يطارد أرقام Lighthouse أو عدد اختبارات مرتفعًا لمجرد الأرقام؛ Lighthouse نفسه يغطي Performance وAccessibility وBest Practices وSEO، لكن بعض الأمور تحتاج مراجعة يدوية/سياقية، ولذلك يجب أن تكون نتيجته **دليلًا ضمن منظومة أكبر** وليس حكمًا نهائيًا.

وبالنسبة للأمن، ربط WebForge بـOWASP ASVS يعطيك أساسًا أكثر انضباطًا من كتابة قائمة أمنية من عندنا؛ ASVS مصمم أصلًا ليكون أساسًا لاختبار الضوابط الأمنية التقنية ومتطلبات التطوير الآمن.

**بهذه الإضافة، الهدف الواقعي لـWebForge يصبح: تقليل الأخطاء المكتشفة إلى الحد العملي الممكن، وليس الادعاء الكاذب بأن النظام يضمن Zero Bugs أو 100% Security.**
