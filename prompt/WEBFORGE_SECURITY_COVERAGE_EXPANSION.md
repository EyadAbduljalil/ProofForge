# WebForge OS — Security Coverage Expansion & Hardening Mission

## 1. Mission

You are operating inside the WebForge OS repository.

Your mission is to significantly expand and harden the WebForge OS security system so that it provides broad, structured, executable security coverage across:

* Web applications
* Frontend applications
* Backend applications
* REST APIs
* GraphQL APIs where applicable
* Databases
* Authentication systems
* Authorization systems
* Sessions
* File handling
* Infrastructure
* Containers
* Dependencies
* Secrets
* Business logic
* Distributed systems
* Webhooks
* Third-party integrations
* AI/LLM applications
* AI agents and tool/function calling
* RAG systems
* Multi-tenant systems

This is NOT a documentation-only task.

The security knowledge must be converted into:

```text
Threat
↓
Security Rule
↓
Prevention Guidance
↓
Detection / Validator
↓
Automated Test
↓
Regression Test
↓
Quality Gate
↓
Evidence
```

The objective is:

> Maximize practical security coverage and reduce exploitable weaknesses without creating insecure defaults, false assurances, or unnecessary complexity.

---

# 2. CRITICAL RULE — INSPECT FIRST

Before modifying anything:

1. Inspect the entire WebForge security architecture.
2. Read:

   * `AGENT.md`
   * `core/`
   * `skills/security/`
   * `core/rules/`
   * `core/policies/`
   * `verification/`
   * `checklists/security/`
   * `tests/`
   * `scripts/`
   * `registry/`
   * existing security packages
   * existing validators
   * existing Semgrep rules
   * existing ZAP configuration
   * existing ASVS mappings
   * existing security reports
3. Search for existing coverage of every security category in this document.
4. Classify every item:

```text
EXISTS
PARTIAL
MISSING
DUPLICATED
CONFLICTING
NOT APPLICABLE
```

Do NOT create duplicate rules, validators, tests, or packages.

If an existing implementation is weaker than the required security baseline, improve it instead of creating a second implementation.

---

# 3. SECURITY COVERAGE MODEL

Every security category must be represented using the strongest applicable layers.

Use:

```text
LAYER 1 — Secure Architecture
LAYER 2 — Secure Defaults
LAYER 3 — Preventive Rules
LAYER 4 — Static Analysis
LAYER 5 — Runtime Validation
LAYER 6 — Automated Security Tests
LAYER 7 — Dynamic Security Testing
LAYER 8 — Business Logic Testing
LAYER 9 — Regression Protection
LAYER 10 — Evidence
```

Not every vulnerability can be detected by every layer.

Do not pretend that a static rule can detect a runtime-only vulnerability.

For each vulnerability document which detection mechanisms are actually applicable.

---

# 4. CWE ACCURACY RULE

Never invent a CWE identifier.

When a vulnerability has a well-defined CWE:

```text
Name
CWE
Description
Detection
Prevention
Test
```

When there is no direct CWE mapping, use:

```text
CWE: N/A — No direct CWE mapping
```

or the appropriate related CWE(s) if the mapping is genuinely justified.

Do not force every security concept into a CWE number.

This is especially important for:

* Prompt Injection
* Excessive Agency
* Business Logic Vulnerability
* IDOR
* RAG Data Leakage
* Unauthorized Tool Execution
* AI Agent weaknesses
* some authentication/business abuse patterns

---

# 5. CORE VULNERABILITY COVERAGE

Ensure WebForge has explicit coverage for the following categories.

## Injection

### 1. OS Command Injection

CWE-78

Cover:

* unsafe shell execution
* user-controlled command arguments
* command construction
* shell interpolation
* unsafe process execution

Provide prevention and static/runtime detection where possible.

---

### 2. Code Injection

CWE-94

Cover:

* dynamic code execution
* `eval`
* dynamic function construction
* runtime code compilation
* unsafe expression evaluation

---

### 3. Server-Side Request Forgery

CWE-918

Cover:

* arbitrary URL fetching
* internal network access
* cloud metadata endpoints
* localhost access
* private IP ranges
* DNS rebinding considerations
* redirects
* protocol abuse

Do not rely solely on blacklist-based URL filtering.

Use architecture-appropriate allowlisting and network controls.

---

### 4. Command Injection

CWE-77

Distinguish it correctly from OS Command Injection where applicable.

---

### 5. SQL Injection

CWE-89

Cover:

* raw SQL construction
* unsafe query interpolation
* ORM escape bypass
* dynamic identifiers
* stored procedures where relevant

Prefer parameterized queries and safe query builders.

---

### 6. Improper Input Validation

CWE-20

Cover:

* schema validation
* type validation
* range validation
* enum validation
* business validation
* structural validation

---

### 7. Improper Output Neutralization

CWE-116

Cover context-specific output encoding.

---

# 6. AUTHENTICATION

Cover:

### 8. Missing Authentication for Critical Function

CWE-306

### 9. Improper Authentication

CWE-287

### 10. Authentication Bypass

Use appropriate CWE mappings where applicable.

Cover:

* missing authentication
* weak authentication
* authentication state confusion
* alternate authentication paths
* bypass through APIs
* bypass through direct endpoints
* bypass through manipulated headers
* bypass through inconsistent middleware
* password reset abuse
* account recovery abuse

---

# 7. AUTHORIZATION / ACCESS CONTROL

Cover:

### 11. Missing Authorization

CWE-862

### 12. Incorrect Authorization

CWE-863

### 13. Improper Privilege Management

CWE-269

### 14. Improper Access Control

Use appropriate CWE mappings where applicable.

### 15. IDOR / BOLA

Treat as a major security category.

Verify:

```text
User
↓
Resource
↓
Ownership
↓
Permission
↓
Action
```

Never trust object IDs supplied by clients.

Test:

* horizontal access
* vertical access
* cross-tenant access
* administrative resources
* nested resources
* API endpoints
* file resources
* downloadable assets

---

# 8. TRUST BOUNDARIES

Cover:

### 16. Trust Boundary Violation

CWE-501

Identify:

```text
Browser
API
Service
Database
Queue
Cache
Worker
Third Party
AI Model
Tool
File System
```

and verify validation/authentication/authorization across each boundary.

---

# 9. SESSION SECURITY

Cover:

### 17. Session Fixation

CWE-384

Also cover:

* session hijacking
* session theft
* insecure session cookies
* missing expiration
* missing rotation
* session reuse
* logout invalidation
* concurrent sessions
* refresh-token abuse
* token replay
* insecure storage
* weak session identifiers

Verify:

```text
HttpOnly
Secure
SameSite
Expiration
Rotation
Revocation
```

where applicable.

---

# 10. JWT SECURITY

Create explicit coverage for:

* algorithm confusion
* weak signing configuration
* missing signature verification
* accepting unsigned tokens
* incorrect issuer validation
* incorrect audience validation
* expiration failures
* `nbf` handling
* key rotation
* token replay
* refresh-token abuse
* excessive token lifetime
* sensitive information inside tokens
* insecure client storage

Never treat JWT as automatically secure merely because it is signed.

---

# 11. REQUEST FORGERY

Cover:

### 18. CSRF

CWE-352

Include:

* cookie-authenticated applications
* state-changing requests
* CSRF tokens
* SameSite strategy
* Origin/Referer validation where appropriate

Do not apply CSRF requirements blindly to incompatible authentication architectures.

---

# 12. FILE SECURITY

Cover:

### 19. Path Traversal

CWE-22

### 20. Local File Inclusion

### 21. Remote File Inclusion

### 22. Unrestricted File Upload

Cover:

* extension validation
* MIME validation
* magic bytes
* filename normalization
* path normalization
* storage isolation
* executable content
* archive extraction
* decompression bombs
* oversized files
* malicious filenames
* public/private storage
* authorization for downloads

Never trust:

```text
filename
extension
Content-Type
client-provided path
```

---

# 13. XML / SERIALIZATION

Cover:

### 23. XML External Entity

CWE-611

### 24. Insecure Deserialization

CWE-502

Cover:

* unsafe object deserialization
* untrusted serialized data
* gadget chains where applicable
* unsafe XML parsers
* external entities
* entity expansion

---

# 14. PROTOTYPE / MEMORY / LOW-LEVEL SAFETY

Cover where the technology stack is applicable:

### 25. Prototype Pollution

CWE-1321

### 26. Buffer Overflow

CWE-120

### 27. Use After Free

CWE-416

### 28. Out-of-Bounds Read

CWE-125

### 29. Out-of-Bounds Write

CWE-787

### 30. Integer Overflow / Wraparound

CWE-190

These must be marked as technology-dependent.

Do not create irrelevant checks for runtimes where these classes cannot meaningfully occur.

---

# 15. OPEN REDIRECT / HTTP PROTOCOL SECURITY

Cover:

### 31. Open Redirect

CWE-601

### 32. HTTP Request Smuggling

CWE-444

### 33. HTTP Response Splitting

CWE-113

Include relevant:

* reverse proxy
* frontend proxy
* backend
* HTTP parser
* header normalization
* transfer encoding
* content length
* duplicate header

checks where applicable.

---

# 16. RACE CONDITIONS

Cover:

### 34. Race Condition

CWE-362

### 35. TOCTOU

CWE-367

Test where relevant:

* inventory
* payments
* coupons
* permissions
* file operations
* account changes
* resource creation
* concurrent updates
* duplicate requests

Do not rely only on application-level locks.

Consider:

* database constraints
* transactions
* atomic operations
* distributed locks
* idempotency

where appropriate.

---

# 17. CREDENTIALS AND SECRETS

Cover:

### 36. Hard-coded Credentials

CWE-798

### 37. Weak Credentials

CWE-1391

### 38. Insufficiently Protected Credentials

CWE-522

### 39. Exposed Secrets

Detect:

* API keys
* private keys
* tokens
* passwords
* database credentials
* cloud credentials
* webhook secrets
* signing keys

Check:

```text
source code
git history where available
environment configuration
logs
build artifacts
frontend bundles
Docker images
configuration files
```

Never expose secrets through frontend code.

---

# 18. INFORMATION DISCLOSURE

Cover:

### 40. Exposure of Sensitive Information

CWE-200

### 41. Cleartext Transmission of Sensitive Information

CWE-319

### 42. Improper Error Handling

CWE-703

Check:

* stack traces
* SQL errors
* internal paths
* environment variables
* debug information
* secrets
* PII
* authentication tokens
* internal service information

---

# 19. CRYPTOGRAPHY

Cover:

### 43. Improper Cryptographic Implementation

CWE-327

Also check:

* weak algorithms
* deprecated algorithms
* insecure random generation
* hard-coded keys
* incorrect key management
* inappropriate encryption modes
* missing integrity protection
* insecure password hashing
* predictable tokens

Never implement custom cryptography unless there is an exceptional documented reason.

Prefer audited libraries.

---

# 20. MASS ASSIGNMENT / AUTOMATIC BINDING

Explicitly detect:

* automatic object binding
* unsafe request-to-model mapping
* hidden fields
* role manipulation
* ownership manipulation
* price manipulation
* status manipulation

Example dangerous pattern:

```text
Client
→
Entire Request Object
→
Database Model
```

Require explicit allowlisting of writable fields.

---

# 21. SECURITY MISCONFIGURATION

Cover:

* debug mode
* development endpoints
* default credentials
* permissive CORS
* weak headers
* exposed admin endpoints
* verbose errors
* insecure cookies
* exposed metrics
* exposed documentation
* exposed health/debug endpoints
* directory listing
* default ports
* unnecessary services
* unsafe container configuration
* excessive permissions

---

# 22. CORS

Cover:

* wildcard origins
* credential + wildcard conflicts
* reflected origins
* untrusted origins
* unsafe methods
* unsafe headers
* preflight inconsistencies

CORS must not be treated as an authentication or authorization mechanism.

---

# 23. RATE LIMITING / ABUSE

Cover:

### 44. API Rate Limit Bypass

Also cover:

* brute force
* credential stuffing
* OTP abuse
* password reset abuse
* signup abuse
* scraping
* expensive endpoint abuse
* resource exhaustion
* concurrent request abuse

Rate limits must be appropriate to:

```text
IP
User
Account
Endpoint
Operation
Tenant
Authentication state
```

where applicable.

---

# 24. DENIAL OF SERVICE

Cover:

### 45. Denial of Service

### 46. ReDoS

Check:

* catastrophic regex
* expensive parsing
* huge payloads
* large JSON
* recursive input
* expensive database queries
* unbounded pagination
* file decompression
* image processing
* AI token exhaustion
* expensive external API calls

---

# 25. DEPENDENCY / SUPPLY CHAIN SECURITY

Cover:

### 47. Dependency / Supply Chain Vulnerabilities

### 48. Vulnerable and Outdated Components

Check:

* package vulnerabilities
* transitive dependencies
* lockfile integrity
* abandoned packages
* malicious packages
* typosquatting risk
* dependency confusion
* post-install scripts
* excessive permissions
* compromised dependencies

Use the ecosystem's appropriate security scanners.

Do not invent vulnerability results.

---

# 26. LOGGING AND MONITORING

Cover:

### 49. Insufficient Logging & Monitoring

Security-sensitive events should be observable where appropriate:

* login failures
* privilege changes
* authorization failures
* password changes
* security configuration changes
* suspicious activity
* administrative actions
* webhook failures
* payment anomalies

Never log:

* passwords
* raw authentication tokens
* private keys
* sensitive payment information
* unnecessary PII

---

# 27. BUSINESS LOGIC SECURITY

Create an explicit security domain for:

### 50. Business Logic Vulnerabilities

Test:

* price manipulation
* quantity manipulation
* coupon abuse
* workflow bypass
* invalid state transitions
* payment bypass
* refund abuse
* inventory race
* ownership manipulation
* approval bypass
* subscription abuse
* role escalation
* replay
* duplicate operations
* negative values
* boundary manipulation
* client-side trust

Represent critical workflows as explicit state machines where appropriate.

---

# 28. ACCOUNT TAKEOVER

Create dedicated coverage for:

### 51. Account Takeover

Check attack surfaces including:

* password reset
* email change
* phone change
* MFA change
* session management
* OAuth linking
* account recovery
* credential stuffing
* session reuse
* token theft
* weak verification

---

# 29. WEBHOOK SECURITY

Add explicit webhook security coverage.

Check:

* signature verification
* timestamp validation
* replay prevention
* idempotency
* source verification
* payload validation
* authorization
* event ordering
* duplicate delivery
* secret rotation

---

# 30. API SECURITY

Create a dedicated API security matrix covering:

```text
Authentication
Authorization
Object-level authorization
Function-level authorization
Input validation
Output filtering
Rate limiting
Pagination
Mass assignment
Error handling
CORS
Caching
Idempotency
Replay
Schema validation
Content type validation
Request size limits
Timeouts
```

Include both REST and GraphQL-specific controls where applicable.

For GraphQL additionally consider:

* introspection exposure
* query depth
* query complexity
* batching abuse
* authorization at resolver level
* field-level data exposure

---

# 31. MULTI-TENANCY

If the project is multi-tenant, explicitly test:

```text
Tenant A → Tenant A data = allowed
Tenant A → Tenant B data = denied
Tenant A → Tenant B mutation = denied
Tenant A → Tenant B files = denied
Tenant A → Tenant B API resources = denied
```

Never rely solely on frontend tenant filtering.

Enforce tenant isolation at the server/data-access layer.

---

# 32. AI / LLM SECURITY

If the project contains AI/LLM functionality, activate this security layer.

If the project contains no AI functionality, mark it:

```text
NOT APPLICABLE
```

Do not create irrelevant AI security findings.

---

## 32.1 Prompt Injection

Cover:

* direct prompt injection
* indirect prompt injection
* malicious retrieved content
* malicious web content
* malicious documents
* instruction conflicts
* untrusted context

Never treat retrieved content as trusted instructions.

---

## 32.2 Sensitive Information Disclosure

Prevent models/agents from exposing:

* system prompts
* secrets
* credentials
* internal data
* private user information
* cross-tenant data
* hidden tool configuration

---

## 32.3 Insecure Output Handling

Never blindly trust model output.

Validate AI-generated:

* SQL
* HTML
* commands
* URLs
* JSON
* tool arguments
* code
* database operations

---

## 32.4 Excessive Agency

Limit AI agent capabilities using:

```text
Least Privilege
Allowlisted Tools
Scoped Permissions
Human Approval
Action Limits
Resource Limits
Audit Logs
```

---

## 32.5 Unauthorized Tool Execution

Every tool/function call must be authorized independently.

The model deciding to call a tool does NOT constitute authorization.

Use:

```text
User Permission
+
Application Policy
+
Tool Allowlist
+
Resource Authorization
```

---

## 32.6 Insecure Tool / Function Calling

Validate:

* tool arguments
* parameter types
* authorization
* resource ownership
* side effects
* destination
* scope
* rate limits

Never directly pass unvalidated LLM output to dangerous system APIs.

---

## 32.7 System Prompt Leakage

Treat system prompts as non-secret configuration unless they contain actual sensitive information.

Never rely on hiding instructions as a security boundary.

Actual secrets must never be placed in prompts.

---

## 32.8 Model Denial of Service

Cover:

* token exhaustion
* recursive agent loops
* excessive tool calls
* expensive prompts
* oversized context
* uncontrolled retries

Implement appropriate budgets.

---

## 32.9 Data / Model Poisoning

Where applicable, validate:

* training data
* retrieval documents
* embeddings
* external knowledge
* uploaded datasets
* model dependencies

---

## 32.10 Vector / Embedding Security

Cover:

* poisoned documents
* cross-tenant retrieval
* metadata filtering
* authorization-aware retrieval
* embedding injection
* retrieval manipulation

---

## 32.11 RAG Data Leakage

Verify that retrieval respects:

```text
User
Tenant
Resource
Permission
Document
Chunk
```

Never allow retrieval to bypass application authorization.

---

## 32.12 AI Cross-Tenant Isolation

An AI system must never retrieve or expose another tenant's information merely because the vector database contains it.

---

## 32.13 AI Output Validation

Treat model output as untrusted input.

Require schema validation for structured output.

Never directly execute arbitrary model-generated commands.

---

## 32.14 Unrestricted AI Agent Capabilities

Agents must operate under explicit:

```text
Tool Allowlist
Permission Boundary
Execution Budget
Time Limit
Action Limit
Data Scope
Network Scope
```

---

## 32.15 Jailbreaking / Model Manipulation

Where applicable, test whether untrusted instructions can cause policy/security boundary violations.

Do not treat jailbreak resistance as the sole security control.

Security must be enforced outside the model.

---

# 33. ADDITIONAL SECURITY CATEGORIES

Do not stop at the supplied list.

During the audit, identify additional security classes relevant to the repository and technology stack.

At minimum evaluate applicability of:

* OAuth/OIDC implementation weaknesses
* MFA bypass
* Password reset flaws
* Email verification bypass
* SSRF through redirects
* DNS rebinding
* Host header injection
* Cache poisoning
* Cache deception
* Web cache vulnerabilities
* WebSocket authorization
* WebSocket origin validation
* GraphQL authorization
* GraphQL query abuse
* XML/JSON parser abuse
* Archive extraction vulnerabilities
* Zip Slip
* decompression bombs
* image processing vulnerabilities
* template injection
* server-side template injection
* client-side template injection
* DOM-based XSS
* stored XSS
* reflected XSS
* CORS abuse
* clickjacking
* UI redressing
* OAuth redirect URI flaws
* token leakage
* refresh-token abuse
* password spraying
* credential stuffing
* brute force
* enumeration
* timing attacks
* cryptographic side channels where applicable
* cache-based information leakage
* insecure direct database access
* unsafe migrations
* database privilege overreach
* secret leakage through logs
* secret leakage through build artifacts
* CI/CD compromise
* malicious workflow changes
* unsafe deployment permissions
* container escape risks where relevant
* excessive container privileges
* exposed Docker socket
* Kubernetes misconfiguration where applicable
* cloud IAM misconfiguration where applicable
* public storage buckets where applicable
* metadata service exposure
* insecure third-party integrations
* unverified webhooks
* replay attacks
* race conditions
* resource exhaustion
* tenant isolation failures

Only activate technology-specific categories when relevant.

---

# 34. SECURITY RULE SCHEMA

Every new security rule should follow a consistent structure.

Example:

```yaml
id:
name:
category:
severity:
cwe:
owasp:
description:
threat_model:
applies_to:
does_not_apply_to:
prevention:
detection:
static_checks:
runtime_checks:
automated_tests:
regression_tests:
quality_gate:
evidence:
references:
version:
status:
```

Valid lifecycle:

```text
DRAFT
EXPERIMENTAL
VALIDATED
CANONICAL
DEPRECATED
REMOVED
```

---

# 35. SECURITY SEVERITY

Use:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

Do not assign severity arbitrarily.

Severity must consider:

* exploitability
* impact
* exposure
* privileges required
* affected data
* business impact
* authentication requirements
* tenant impact
* remote/local access

---

# 36. AUTOMATED SECURITY VALIDATORS

Where technically possible, create validators for:

* dangerous APIs
* insecure patterns
* missing authorization
* unsafe dynamic execution
* secret exposure
* insecure configuration
* dependency risks
* weak cryptography
* dangerous file operations
* unsafe deserialization
* missing security headers
* permissive CORS
* unsafe cookies
* dangerous AI tool execution
* unvalidated AI output

Use existing tools before creating custom scanners.

Prefer:

```text
Semgrep
Dependency scanners
Secret scanners
OWASP ZAP
Language-native analyzers
TypeScript compiler
ESLint security plugins
Container scanners
```

when applicable.

---

# 37. SECURITY TESTING

For every important vulnerability class, create appropriate tests.

Tests may include:

```text
Unit
Integration
API
E2E
Dynamic Security
Static Analysis
Configuration
Concurrency
Business Logic
AI Security
```

Do not force every vulnerability into a unit test.

Use the testing layer appropriate to the threat.

---

# 38. SECURITY QUALITY GATES

Create security release gates.

At minimum:

```text
BLOCKER security findings → Release blocked
CRITICAL security findings → Release blocked
HIGH findings → Follow configured project policy
MEDIUM/LOW → Track and document
```

Do not hide findings simply to achieve a green status.

---

# 39. SECURITY REGRESSION SYSTEM

Every important security defect that is fixed should produce a regression test whenever technically possible.

Required lifecycle:

```text
Vulnerability
↓
Reproduction
↓
Root Cause
↓
Fix
↓
Regression Test
↓
Full Relevant Test Suite
↓
Evidence
```

---

# 40. WEBFORGE SELF-PROTECTION

Do not only build rules for projects using WebForge.

Audit WebForge itself.

Inspect:

* scripts
* bootstrap system
* registries
* parsers
* validators
* configuration
* adapters
* generated files
* dependency usage
* filesystem access
* command execution
* dynamic imports
* network access
* secrets
* CI/CD
* GitHub workflows
* package scripts

Any real vulnerability found in WebForge itself must be fixed where feasible.

---

# 41. SECURITY TEST EXECUTION

After implementation:

1. Build the repository.
2. Run static analysis.
3. Run type checking.
4. Run lint/security lint.
5. Run unit tests.
6. Run integration tests.
7. Run available API tests.
8. Run available E2E tests.
9. Run Semgrep/security scanners.
10. Run dependency/security checks.
11. Run secret scanning.
12. Run ZAP or equivalent authorized dynamic testing where applicable.
13. Run repository integrity checks.
14. Fix failures.
15. Repeat the relevant checks.
16. Run the full security verification again.

Never report a check as PASS unless it actually executed successfully.

---

# 42. FALSE POSITIVE CONTROL

Security tooling can produce false positives.

Do not blindly suppress findings.

For every suppressed finding document:

```text
Finding
Reason
Evidence
Risk Assessment
Scope
Expiration / Review Date
```

Prefer targeted suppression rather than global disabling.

---

# 43. SECURITY EVIDENCE

Generate evidence artifacts under the existing WebForge verification/reporting architecture.

The evidence should show:

```text
Security Category
Rule
Tool
Command
Result
Finding
Severity
Fix
Regression Test
Final Status
```

Screenshots, logs, test output, traces, reports, and scanner output may be used when appropriate.

---

# 44. FINAL SECURITY MATRIX

Generate a final matrix:

| Category | Coverage | Prevention | Detection | Test | Status | Evidence |
| -------- | -------- | ---------- | --------- | ---- | ------ | -------- |

Coverage values:

```text
FULL
PARTIAL
NOT IMPLEMENTED
NOT APPLICABLE
```

Do not claim FULL merely because documentation exists.

FULL means there is meaningful implementation and verification appropriate to the category.

---

# 45. IMPORTANT DISTINCTION

Separate:

```text
Security Knowledge
Security Rule
Security Implementation
Security Detection
Security Test
Security Evidence
```

Do not consider a vulnerability "closed" merely because a rule describing it exists.

A vulnerability is considered addressed only when the applicable prevention/detection/verification mechanisms exist.

---

# 46. NO SECURITY THEATER

Do NOT:

* add thousands of meaningless rules
* map everything to random CWE numbers
* create fake scanners
* create fake test results
* disable failing security checks
* hide findings
* claim compliance without evidence
* claim vulnerability-free software
* add irrelevant checks
* introduce insecure defaults
* rely exclusively on AI-generated reasoning
* rely exclusively on static analysis
* rely exclusively on automated scanners

The objective is meaningful security engineering.

---

# 47. FINAL DELIVERABLES

At the end of the mission, provide:

## A. Security Coverage Added

List newly added security categories.

## B. Existing Coverage Improved

List existing rules/tools improved.

## C. Security Vulnerabilities Found in WebForge

For each:

```text
Finding
Severity
Root Cause
Affected Component
Fix
Regression Test
Status
```

## D. Security Tooling Added

List:

* validators
* scanners
* tests
* scripts
* quality gates

## E. Security Tests Executed

Include actual commands and results.

## F. Remaining Risks

List all unresolved risks.

## G. Environment Limitations

Clearly state anything that could not be tested.

## H. Final Security Status

Use only:

```text
SECURITY HARDENED — VERIFIED
SECURITY HARDENED — PARTIALLY VERIFIED
SECURITY VERIFICATION INCOMPLETE
```

Never use:

```text
100% SECURE
ZERO VULNERABILITIES
COMPLETELY SECURE
```

---

# 48. FINAL EXECUTION PRINCIPLE

Do not treat this mission as adding a vulnerability list.

The actual objective is to transform the security layer from:

```text
List of Vulnerabilities
```

into:

```text
Security Intelligence
        ↓
Threat Model
        ↓
Security Rules
        ↓
Secure Defaults
        ↓
Preventive Controls
        ↓
Static Detection
        ↓
Runtime Detection
        ↓
Security Tests
        ↓
Dynamic Testing
        ↓
Business Logic Testing
        ↓
AI Security Testing
        ↓
Regression Protection
        ↓
Quality Gates
        ↓
Evidence
```

The final WebForge OS should make secure implementation the default path for AI agents and developers while continuously verifying that the implementation actually satisfies the security requirements.

Execute the mission completely within the capabilities of the current environment.
