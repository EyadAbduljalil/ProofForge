# WebForge OS — Security Intelligence, Governance & Advanced Defense Mission

## 1. Mission

You are operating inside the WebForge OS repository.

This mission is a continuation of the WebForge security hardening work.

The previous security mission established broad vulnerability coverage.

This mission addresses the next architectural gap:

> Transform WebForge OS from a security rule and vulnerability library into an intelligent, traceable, risk-aware, continuously verifiable security engineering system.

Do not recreate the vulnerability coverage already implemented.

Instead, build the missing intelligence, governance, attack-surface, risk, privacy, supply-chain, AI-agent, infrastructure, and regression capabilities.

This is an implementation mission.

Do not merely create documentation.

The system must contain executable logic, validators, schemas, tests, integrations, quality gates, and evidence wherever technically appropriate.

---

# 2. Primary Objective

The target architecture is:

```text
PROJECT
↓
PROJECT PROFILE
↓
ASSET INVENTORY
↓
ATTACK SURFACE
↓
THREAT MODEL
↓
RISK ASSESSMENT
↓
SECURITY CONTROLS
↓
IMPLEMENTATION
↓
DETECTION
↓
TESTING
↓
EVIDENCE
↓
QUALITY GATES
↓
RELEASE
↓
MONITORING
↓
INCIDENT / FINDING
↓
ROOT CAUSE
↓
FIX
↓
REGRESSION TEST
↓
SECURITY MEMORY
↓
RULE / CONTROL IMPROVEMENT
```

The system must connect these layers instead of keeping them as isolated documents.

---

# 3. NON-NEGOTIABLE RULE — INSPECT FIRST

Before modifying anything:

1. Inspect the complete repository.
2. Read the existing:

   * `AGENT.md`
   * `core/`
   * `security/`
   * `skills/security/`
   * `verification/`
   * `checklists/security/`
   * `registry/`
   * `tests/`
   * `scripts/`
   * `adapters/`
   * existing reports
3. Search for existing implementations of:

   * threat modeling
   * risk assessment
   * security controls
   * dependency scanning
   * CI/CD security
   * cloud security
   * container security
   * privacy
   * PII detection
   * attack surface discovery
   * AI security
   * agent permissions
   * regression tracking
   * change impact analysis
   * technical debt
4. Classify each capability:

```text
EXISTS
PARTIAL
MISSING
DUPLICATED
CONFLICTING
OBSOLETE
NOT APPLICABLE
```

Do not create duplicate systems.

Improve existing systems when they already provide part of the required functionality.

---

# 4. SECURITY INTELLIGENCE ARCHITECTURE

Introduce or integrate the following conceptual modules:

```text
security/
├── threat-modeling/
├── risk-engine/
├── control-matrix/
├── attack-surface/
├── change-impact/
├── supply-chain/
├── ci-cd/
├── cloud/
├── containers/
├── privacy/
├── data-flow/
├── pii/
├── abuse/
├── fraud/
├── ai-security/
├── agent-permissions/
├── security-memory/
└── incident-learning/
```

The actual repository structure may differ.

Do not force this exact directory layout if the existing architecture has a better structure.

---

# 5. PROJECT SECURITY PROFILER

Build or extend a project security profiler.

The profiler should identify, where possible:

```text
Framework
Language
Runtime
Frontend
Backend
Database
Cache
Queue
Authentication
Authorization
Payments
File Uploads
External APIs
Webhooks
Cloud
Containers
CI/CD
AI/LLM
RAG
Vector Database
Multi-tenancy
Sensitive Data
Admin Functions
Public APIs
```

The profiler should generate a structured project profile.

Example:

```yaml
project:
  type:
  stack:
  architecture:

security:
  authentication: true
  authorization: true
  payments: false
  file_uploads: true
  ai: true
  rag: true
  multi_tenant: true
  pii: true
  cloud: true
  containers: true
```

Do not infer capabilities without evidence.

Use repository evidence.

---

# 6. SECURITY FEATURE ACTIVATION

Security checks should be context-aware.

Example:

```text
AI project
→ AI Security enabled

Payment project
→ Payment security enabled

Multi-tenant project
→ Tenant isolation enabled

AWS project
→ Cloud security enabled

Docker project
→ Container security enabled

File upload project
→ File security enabled
```

Do not execute irrelevant security rules merely to increase the number of checks.

Every security rule should define:

```text
applies_when
does_not_apply_when
```

---

# 7. THREAT MODELING ENGINE

Build a reusable threat-modeling system.

It must identify:

## Assets

Examples:

* user accounts
* credentials
* PII
* payment data
* business data
* source code
* secrets
* tokens
* files
* databases
* AI prompts
* AI context
* models
* embeddings
* infrastructure

## Actors

Examples:

* anonymous user
* authenticated user
* administrator
* malicious user
* compromised account
* external service
* AI agent
* internal service
* attacker-controlled content

## Trust Boundaries

Examples:

```text
Browser → API
API → Service
Service → Database
Service → Redis
Service → Queue
Application → Third Party
Application → AI Model
AI Agent → Tool
Tenant A → Tenant B
Internet → Internal Network
CI → Production
```

## Threats

Map threats to:

```text
Asset
Actor
Boundary
Attack Surface
Control
Test
Evidence
```

---

# 8. THREAT MODEL FORMAT

Create a machine-readable representation.

Example:

```yaml
id:
asset:
actor:
entry_point:
trust_boundary:
threat:
impact:
likelihood:
risk:
controls:
tests:
evidence:
status:
```

Do not create fake threats.

Every threat should be supported by the actual project architecture.

---

# 9. RISK ENGINE

Implement a risk assessment mechanism.

Risk should consider at minimum:

```text
Impact
Exploitability
Exposure
Authentication Requirement
Privileges Required
Data Sensitivity
Business Criticality
Tenant Impact
Internet Exposure
Attack Complexity
```

Do not reduce security to a single arbitrary score.

Prefer:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

and provide reasoning/evidence for the classification.

---

# 10. SECURITY CONTROL MATRIX

Build a central security control matrix.

Required relationship:

```text
Threat
↓
Security Control
↓
Implementation
↓
Detection
↓
Test
↓
Evidence
↓
Quality Gate
```

Example:

```yaml
control_id:
name:
threats:
applies_to:
prevention:
implementation:
validator:
tests:
quality_gate:
evidence:
status:
owner:
version:
```

A control must not be marked effective merely because it is documented.

---

# 11. CONTROL EFFECTIVENESS

Every important control should be classified:

```text
PLANNED
IMPLEMENTED
PARTIALLY_VERIFIED
VERIFIED
FAILED
NOT_APPLICABLE
```

Distinguish:

```text
Implemented
```

from:

```text
Verified
```

A security control that exists but has never been tested is not fully verified.

---

# 12. ATTACK SURFACE INVENTORY

Build an automated attack-surface inventory where possible.

Discover:

```text
Public URLs
API Endpoints
Authentication Endpoints
Admin Endpoints
Webhooks
File Uploads
File Downloads
External Integrations
Database Interfaces
Queues
Caches
WebSockets
GraphQL
AI Endpoints
AI Tools
RAG Interfaces
Cloud Resources
Internal Services
Health Endpoints
Debug Endpoints
Metrics Endpoints
```

For every discovered surface record:

```yaml
surface:
type:
public:
authentication:
authorization:
rate_limit:
validation:
logging:
monitoring:
security_tests:
risk:
status:
```

---

# 13. CHANGE IMPACT ANALYSIS

Implement a change-impact system.

When a file/module/API/database schema/security control changes, determine:

```text
Changed Component
↓
Dependencies
↓
Affected Features
↓
Affected Security Controls
↓
Affected Tests
↓
Required Regression Scope
```

Example:

```text
Authentication changed
→ Sessions
→ Authorization
→ Admin
→ API
→ Password Reset
→ E2E
→ Security Tests
```

The system should recommend or automatically execute the relevant regression tests.

Do not run unrelated expensive tests unnecessarily when a narrower verified scope is sufficient.

---

# 14. DEPENDENCY GRAPH

Build or integrate a dependency graph capable of mapping where practical:

```text
Page
↓
Component
↓
Hook
↓
Service
↓
API
↓
Database
```

and:

```text
Security Control
↓
Implementation
↓
Tests
```

Use the graph for change-impact analysis.

---

# 15. SUPPLY CHAIN SECURITY

Build a supply-chain security layer.

Inspect:

## Dependencies

* direct dependencies
* transitive dependencies
* lockfiles
* outdated packages
* known vulnerabilities
* abandoned packages
* malicious packages
* typosquatting
* dependency confusion

## Package Scripts

Detect suspicious:

```text
preinstall
install
postinstall
```

scripts.

## Integrity

Check where practical:

* lockfile integrity
* package integrity
* pinned versions
* reproducibility

## SBOM

Support generation or integration of SBOM tooling where practical.

Possible formats:

```text
CycloneDX
SPDX
```

Do not invent dependency vulnerability results.

---

# 16. CI/CD SECURITY

Build CI/CD security analysis.

Inspect:

```text
GitHub Actions
GitLab CI
Deployment scripts
Docker builds
Release workflows
Secrets
Artifacts
Permissions
```

Detect:

* excessive workflow permissions
* untrusted code execution
* unsafe pull-request workflows
* exposed secrets
* unsafe shell execution
* dependency installation from untrusted sources
* mutable action references where policy requires pinning
* artifact trust problems
* deployment credentials with excessive privileges
* production deployment without appropriate controls

Where GitHub Actions exist, inspect `.github/workflows/`.

---

# 17. CLOUD SECURITY

Activate only when cloud infrastructure is present.

Support architecture-aware checks for:

```text
AWS
Azure
GCP
```

where applicable.

Cover:

* IAM
* least privilege
* public storage
* security groups
* public databases
* secrets
* KMS
* logging
* monitoring
* network exposure
* metadata services
* service accounts
* excessive permissions

Do not claim cloud compliance merely because configuration files exist.

---

# 18. CONTAINER SECURITY

If containers are present, inspect:

```text
Dockerfile
docker-compose
Container images
Volumes
Networks
Capabilities
Users
Ports
Secrets
```

Detect:

* root execution
* privileged containers
* excessive capabilities
* host networking
* host PID/IPC
* host mounts
* Docker socket exposure
* secrets baked into images
* mutable base images
* unnecessary packages
* exposed internal services

Where tooling is available, integrate container scanners rather than creating an inferior custom scanner.

---

# 19. DATABASE SECURITY

Create a database security layer.

Check:

```text
Credentials
Privileges
Public exposure
Encryption
Migrations
Backups
Sensitive columns
Tenant isolation
Query safety
Logging
```

Where possible verify:

```text
Application
↓
Database Role
↓
Allowed Operations
```

Prevent unnecessary administrative DB privileges.

---

# 20. DATA FLOW / PRIVACY ENGINE

Build a data-flow model.

Identify:

```text
Source
↓
Processing
↓
Storage
↓
Transmission
↓
Third Party
↓
Deletion / Retention
```

Track sensitive data categories:

```text
PII
Authentication Data
Financial Data
Private Documents
Health Data
Secrets
User Content
```

Do not classify data without evidence.

---

# 21. PII / SENSITIVE DATA DETECTION

Detect possible sensitive data in:

```text
Database schema
API responses
Logs
Frontend code
Source code
Configuration
Analytics
Error reporting
AI prompts
AI context
Third-party integrations
```

Look for unnecessary propagation of sensitive fields.

Example:

```text
Database
→ API
→ Frontend
```

should not automatically expose every database field.

Use explicit DTO/response schemas where appropriate.

---

# 22. DATA LEAKAGE PREVENTION

Create checks for:

* secrets in logs
* PII in logs
* PII in analytics
* sensitive API responses
* sensitive frontend bundles
* AI prompt leakage
* cross-user leakage
* cross-tenant leakage
* third-party data leakage

The system should identify:

```text
Data
↓
Destination
↓
Authorization
↓
Purpose
↓
Exposure
```

---

# 23. MULTI-TENANT SECURITY

If multi-tenancy exists, build explicit isolation verification.

Test:

```text
Tenant A → Tenant A = ALLOW
Tenant A → Tenant B = DENY
```

for:

* API
* database
* files
* search
* cache
* queues
* analytics
* AI/RAG
* background jobs

Never rely only on frontend filtering.

---

# 24. AI AGENT SECURITY ARCHITECTURE

If AI/LLM functionality exists, build a dedicated agent security boundary.

Represent:

```text
Agent
↓
Identity
↓
Permissions
↓
Tools
↓
Resources
↓
Actions
```

The LLM must never be considered the authorization authority.

---

# 25. AI TOOL PERMISSIONS

Every AI tool should define:

```yaml
tool:
risk_level:
required_permission:
allowed_resources:
allowed_operations:
input_schema:
output_schema:
requires_approval:
rate_limit:
audit_event:
```

Tool access must be explicitly allowlisted.

---

# 26. HIGH-RISK AI ACTIONS

Identify actions such as:

```text
Delete data
Modify permissions
Refund payment
Deploy production
Execute shell
Modify infrastructure
Send mass communication
Access sensitive records
Export data
Modify financial records
```

These should support risk-based human approval.

---

# 27. HUMAN APPROVAL ENGINE

Create an approval mechanism where appropriate:

```text
AI requests action
↓
Risk Classification
↓
Policy Check
↓
Approval Required?
↓
Human Approval / Rejection
↓
Execution
↓
Audit Event
```

Do not rely on model instructions for authorization.

---

# 28. AI DATA ISOLATION

For AI + RAG systems verify:

```text
User
↓
Tenant
↓
Authorization
↓
Retrieval
↓
Context
↓
Model
↓
Output
```

Authorization must happen before sensitive data enters the model context.

Do not rely on the model to hide unauthorized information.

---

# 29. RAG SECURITY

Verify:

* document authorization
* tenant filtering
* metadata filtering
* retrieval isolation
* deleted document invalidation
* stale embeddings
* malicious documents
* poisoned content
* sensitive document leakage

---

# 30. AI OUTPUT SECURITY

Treat model output as untrusted input.

Require validation for:

* JSON
* SQL
* commands
* HTML
* URLs
* tool arguments
* database operations
* code
* API requests

Use schemas and allowlists.

---

# 31. AI RESOURCE GOVERNANCE

Limit:

```text
Token Budget
Tool Calls
Execution Time
Network Requests
Recursive Calls
Context Size
File Access
Data Scope
```

Prevent uncontrolled agent loops and resource exhaustion.

---

# 32. ABUSE / FRAUD ENGINE

Build an abuse-analysis layer.

Detect patterns such as:

```text
Repeated coupon use
Account creation bursts
Password reset abuse
OTP abuse
Payment retries
Scraping
Expensive endpoint abuse
Concurrent requests
Resource exhaustion
```

Use:

```text
Velocity
Frequency
Identity
IP
Account
Device where applicable
Tenant
Operation
```

Do not assume IP address alone is sufficient.

---

# 33. SECURITY OBSERVABILITY

Create a security observability model.

Track:

```text
Authentication failures
Authorization failures
Privilege changes
Security configuration changes
Suspicious activity
Webhook failures
Payment anomalies
Agent high-risk actions
Tool execution
Sensitive-data access
```

Ensure logs do not contain:

```text
Passwords
Raw tokens
Private keys
Unnecessary sensitive data
```

---

# 34. SECURITY INCIDENT LEARNING

Create a structured incident/finding lifecycle:

```text
Finding
↓
Classification
↓
Root Cause
↓
Fix
↓
Regression Test
↓
Security Rule
↓
Control Update
↓
Benchmark
```

Every important recurring failure should improve WebForge itself.

---

# 35. SECURITY MEMORY

Create a project-level security memory system.

Store:

```yaml
finding_id:
date:
component:
vulnerability:
root_cause:
fix:
regression_test:
affected_controls:
lessons:
status:
```

This is engineering memory.

Do not use personal user memory.

---

# 36. SECURITY DEBT

Create a security debt ledger.

Each item should contain:

```yaml
id:
description:
severity:
risk:
affected_component:
reason:
temporary_mitigation:
permanent_fix:
owner:
target:
status:
```

Do not hide unresolved security debt.

---

# 37. SECURE DEFAULTS ENGINE

Where WebForge generates configurations, defaults should be secure.

Examples:

```text
Debug production = OFF
Verbose errors = OFF
HttpOnly cookies = ON where applicable
Secure cookies = ON under HTTPS
Restrictive CORS
Security headers
Rate limiting
Non-root containers
Secret externalization
Least privilege
Input validation
Output filtering
```

Defaults must remain architecture-aware.

Do not blindly enable incompatible security settings.

---

# 38. ARCHITECTURE SECURITY FITNESS

Create architecture rules capable of detecting patterns such as:

```text
Frontend → Database
AI → unrestricted shell
Controller → huge business logic
API → database without authorization
Tenant filter only on frontend
Sensitive data → external AI without policy
Admin endpoint → missing authorization
```

Architecture fitness checks should run during verification.

---

# 39. PRODUCTION ATTACK SURFACE REPORT

Generate a production-oriented attack surface report containing:

```text
Public Endpoint
Authentication
Authorization
Rate Limit
Validation
Sensitive Data
External Dependency
Security Test
Monitoring
Risk
```

This report should focus on what can actually be reached in the deployed architecture where deployment information is available.

---

# 40. SECURITY QUALITY GATES

Security gates should consume the control matrix.

Example:

```text
Critical finding
→ BLOCK

High-risk unprotected attack surface
→ BLOCK

Unverified critical security control
→ BLOCK

Known vulnerable dependency
→ Policy-dependent BLOCK

Missing regression for critical fixed vulnerability
→ BLOCK
```

Do not create arbitrary gates without documented reasoning.

---

# 41. SECURITY CHANGE IMPACT

When security-sensitive code changes, automatically determine whether to rerun:

```text
Authentication Tests
Authorization Tests
Session Tests
API Security Tests
Tenant Isolation Tests
Business Logic Tests
AI Security Tests
Regression Tests
```

Use the dependency graph and control matrix.

---

# 42. SECURITY BENCHMARK

Create or extend a WebForge security benchmark.

The benchmark should test WebForge's ability to detect:

```text
Authentication flaw
Authorization flaw
IDOR
SQL Injection
XSS
SSRF
CSRF
Secrets
Dependency vulnerability
Misconfiguration
Race condition
Business logic flaw
Tenant isolation flaw
AI prompt injection
AI tool authorization flaw
RAG leakage
CI/CD security flaw
Container flaw
```

The benchmark must contain intentionally vulnerable fixtures.

These fixtures are for testing WebForge's defensive detection capabilities.

---

# 43. NO FALSE PASS

The system must never mark:

```text
PASS
VERIFIED
SECURE
FIXED
```

unless actual evidence supports it.

Use:

```text
NOT TESTED
BLOCKED
PARTIAL
UNKNOWN
```

when appropriate.

---

# 44. NO SECURITY THEATER

Do not:

* create fake scanners
* create fake security reports
* assign random CWE numbers
* generate meaningless rules
* suppress failures globally
* weaken tests
* disable scanners
* mark findings resolved without evidence
* claim compliance without verification
* claim zero vulnerabilities
* claim perfect security

---

# 45. REGISTRY INTEGRATION

Register new capabilities in the existing WebForge registries.

Update only what is necessary:

```text
skills.json
rules.json
tools.json
domains.json
references.json
```

Avoid duplicate IDs.

Use consistent naming and versioning.

---

# 46. TESTING REQUIREMENTS

Every new intelligence subsystem must have tests.

At minimum:

```text
Happy Path
Invalid Project
Missing Evidence
False Positive
False Negative Fixture where possible
Boundary Conditions
Integration
Regression
```

Security-critical logic must have explicit regression coverage.

---

# 47. SELF-AUDIT

After implementation, audit WebForge itself for:

```text
Security Architecture
Threat Modeling
Controls
Attack Surface
Supply Chain
CI/CD
Cloud
Containers
Privacy
PII
AI Security
Agent Permissions
Abuse
Observability
Regression
Security Debt
```

Fix issues discovered where feasible.

---

# 48. FINAL VERIFICATION

Execute available:

* type checks
* lint
* build
* unit tests
* integration tests
* security tests
* static analysis
* dependency checks
* secret scanning
* container checks
* repository integrity tests
* benchmark tests

Use existing WebForge verification infrastructure.

Do not duplicate tools unnecessarily.

---

# 49. FINAL REPORT

Produce:

## A. Implemented Capabilities

List everything actually implemented.

## B. Existing Systems Extended

List existing systems modified.

## C. Security Architecture Added

Explain the new relationships between:

```text
Threat
Control
Implementation
Detection
Test
Evidence
Gate
```

## D. Security Findings

List actual findings discovered in WebForge.

## E. Tests Executed

Include:

```text
Command
Result
Evidence
```

## F. Remaining Risks

List unresolved risks.

## G. Environment Limitations

Clearly identify anything that could not be tested.

## H. Security Maturity Status

Use:

```text
HARDENED — VERIFIED
HARDENED — PARTIALLY VERIFIED
VERIFICATION INCOMPLETE
```

Never use:

```text
100% SECURE
ZERO VULNERABILITIES
PERFECT SECURITY
```

---

# 50. DEFINITION OF DONE

This mission is complete only when:

* [ ] Project Security Profiler exists or has been integrated.
* [ ] Context-aware security activation exists.
* [ ] Threat Modeling exists or has been materially extended.
* [ ] Risk Engine exists or has been materially extended.
* [ ] Security Control Matrix exists.
* [ ] Control effectiveness is distinguishable from documentation.
* [ ] Attack Surface Inventory exists.
* [ ] Change Impact Analysis exists.
* [ ] Dependency Graph exists or is integrated.
* [ ] Supply Chain Security exists.
* [ ] CI/CD Security exists.
* [ ] Cloud Security exists where applicable.
* [ ] Container Security exists where applicable.
* [ ] Database Security exists.
* [ ] Data Flow / Privacy analysis exists.
* [ ] PII/Sensitive Data analysis exists.
* [ ] Data Leakage controls exist.
* [ ] Multi-Tenant isolation verification exists where applicable.
* [ ] AI Agent permission boundaries exist where applicable.
* [ ] Human Approval support exists for high-risk AI actions where applicable.
* [ ] RAG authorization verification exists where applicable.
* [ ] AI output validation exists where applicable.
* [ ] Abuse/Fraud controls exist.
* [ ] Security Observability model exists.
* [ ] Security Incident Learning exists.
* [ ] Security Memory exists.
* [ ] Security Debt exists.
* [ ] Secure Defaults are enforced where applicable.
* [ ] Architecture Security Fitness exists.
* [ ] Production Attack Surface reporting exists.
* [ ] Security Quality Gates consume actual evidence.
* [ ] Security Benchmark exists.
* [ ] WebForge itself has been self-audited.
* [ ] Tests have been executed.
* [ ] Failures have been fixed or explicitly documented.
* [ ] Final evidence has been generated.

---

# 51. FINAL PRINCIPLE

The final security architecture must evolve from:

```text
Vulnerability List
+
Security Rules
+
Security Tools
```

into:

```text
PROJECT UNDERSTANDING
        ↓
THREAT MODEL
        ↓
RISK
        ↓
SECURITY CONTROLS
        ↓
ATTACK SURFACE
        ↓
IMPLEMENTATION
        ↓
DETECTION
        ↓
TESTING
        ↓
EVIDENCE
        ↓
QUALITY GATE
        ↓
RELEASE
        ↓
MONITORING
        ↓
FINDING
        ↓
ROOT CAUSE
        ↓
FIX
        ↓
REGRESSION
        ↓
SECURITY MEMORY
        ↓
WEBFORGE IMPROVEMENT
```

The purpose of this mission is not to make WebForge contain more security files.

The purpose is to make WebForge **understand security, apply the correct controls to the correct project, verify them with evidence, detect failures, prevent regressions, and continuously improve its own security engineering capabilities.**

Execute the mission completely within the capabilities of the current environment.
