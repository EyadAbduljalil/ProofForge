# WEBFORGE OS

# COMPLETE ENGINEERING INTELLIGENCE

# REENGINEERING, HARDENING, VERIFICATION & CONTINUOUS IMPROVEMENT MISSION

## MISSION TYPE

MASTER SYSTEM ENGINEERING MISSION

## MISSION STATUS

AUTHORITATIVE IMPLEMENTATION SPECIFICATION

## PRIMARY OBJECTIVE

تحويل WebForge OS إلى نظام هندسي متكامل قادر على:

1. بناء مشاريع Web حديثة بالذكاء الاصطناعي.
2. فهم مشروع قائم بالكامل قبل تعديله.
3. اكتشاف العيوب والمخاطر والاختناقات والأخطاء المخفية.
4. إصلاح المشاكل مع المحافظة على الوظائف الصحيحة.
5. إعادة هندسة المشاريع القديمة دون Rewrite غير ضروري.
6. تحسين Architecture وCode Quality وSecurity وPerformance وUX/UI وResponsive وAccessibility.
7. اكتشاف Regression قبل اعتبار أي تغيير ناجحًا.
8. تشغيل الاختبارات المناسبة تلقائيًا حسب نوع التغيير.
9. استخدام Browser Automation حقيقي عندما تكون المشكلة متعلقة بالمتصفح.
10. استخدام PostgreSQL وRedis الحقيقيين عندما تكون الحقيقة مرتبطة بهما.
11. قياس الأداء قبل وبعد.
12. مقارنة Screenshots قبل وبعد.
13. تحليل تأثير كل تغيير قبل تنفيذه.
14. منع التعديلات الخطرة غير المصرح بها.
15. الاحتفاظ بالأدلة Evidence لكل ادعاء مهم.
16. إنشاء Regression Tests لكل Bug مهم يتم إصلاحه.
17. الاحتفاظ بذاكرة هندسية للمشروع.
18. التعلم من الأخطاء السابقة دون اختلاق معلومات.
19. اكتشاف Architecture Drift.
20. اكتشاف Security Drift.
21. اكتشاف Design Drift.
22. اكتشاف Dependency Drift.
23. اكتشاف Requirement Drift.
24. اكتشاف Performance Regression.
25. اكتشاف Accessibility Regression.
26. اكتشاف Responsive Regression.
27. اكتشاف Business Logic Regression.
28. اكتشاف Data Integrity Regression.
29. اكتشاف State Machine Regression.
30. اكتشاف AI Agent Security Risks.
31. توفير Quality Gates قابلة للتنفيذ.
32. توفير Evidence-Driven Verification.
33. توفير Rollback آمن.
34. توفير Continuous Improvement Loop.
35. جعل WebForge نفسه قابلًا للتطوير والتوسع والاختبار.
36. منع WebForge من الادعاء بأنه "مكتمل" أو "آمن 100%" دون Evidence حقيقي.

---

# 0. NON-NEGOTIABLE ENGINEERING PRINCIPLES

يجب اعتبار المبادئ التالية قوانين أساسية للنظام.

## PRINCIPLE 001 — INSPECT BEFORE MODIFY

لا تعدل أي ملف قبل فهم:

* architecture
* dependencies
* runtime
* entrypoints
* build system
* test system
* database
* API
* frontend
* backend
* authentication
* authorization
* business logic
* state
* infrastructure
* configuration
* deployment
* observability

---

## PRINCIPLE 002 — EXISTING SYSTEMS ARE AUTHORITATIVE UNTIL VERIFIED

لا تنشئ نظامًا جديدًا إذا كان النظام موجودًا.

قبل إضافة أي implementation:

1. ابحث عن النظام الحالي.
2. حدد موقعه.
3. افهم واجهته.
4. افحص استخداماته.
5. افحص اختباراته.
6. حدد نواقصه.
7. قرر هل:

   * reuse
   * extend
   * refactor
   * replace

لا تنشئ Duplicate Implementation لمجرد أن التنفيذ الحالي غير مثالي.

---

# PRINCIPLE 003 — DOCUMENTATION IS NOT EVIDENCE

لا تعتبر:

* README
* comments
* reports
* TODO
* status files
* previous audit
* percentage score
* "implemented"
* "production ready"
* "secure"
* "tested"

دليلًا كافيًا.

يجب التحقق من الكود والruntime والاختبارات الفعلية.

---

# PRINCIPLE 004 — MOCK IS NOT REAL

يجب التمييز دائمًا بين:

```text
Mock
Stub
Simulation
Unit Test
Integration Test
Real Service
Real Database
Real Redis
Real Browser
Real Production-like Environment
Production Telemetry
```

لا يجوز اعتبار mock دليلًا على صحة production integration.

---

# PRINCIPLE 005 — HTTP E2E IS NOT BROWSER E2E

HTTP E2E يثبت HTTP behavior.

Browser E2E يثبت:

* DOM
* JavaScript
* routing
* forms
* focus
* viewport
* visual behavior
* browser APIs
* storage
* cookies
* navigation
* responsive behavior
* actual interaction

لا تخلط بينهما.

---

# PRINCIPLE 006 — STATIC AUDIT IS NOT RUNTIME VERIFICATION

Static inspection وحده لا يكفي.

---

# PRINCIPLE 007 — EVERY IMPORTANT CHANGE MUST HAVE EVIDENCE

كل تغيير مهم يجب أن يمتلك:

```text
WHY
WHAT
IMPACT
TEST
RESULT
REGRESSION STATUS
EVIDENCE
```

---

# PRINCIPLE 008 — NO GREEN-BY-DEFAULT

لا تعتبر النظام ناجحًا فقط لأن:

```text
npm test
```

نجح.

يجب تحديد:

* ماذا تم اختباره؟
* ماذا لم يتم اختباره؟
* ما البيئة؟
* ما الأدوات؟
* ما حدود الاختبار؟

---

# PRINCIPLE 009 — NO FALSE COMPLETION

ممنوع كتابة:

```text
100% secure
Zero bugs
Fully production ready
Everything verified
Complete
Perfect
```

إلا إذا كان هناك معيار موضوعي ودليل قابل لإعادة التنفيذ، وحتى عندها يجب تحديد نطاق الادعاء.

---

# PRINCIPLE 010 — MAXIMUM PRACTICAL VERIFICATION

الهدف:

```text
Maximum Practical Verification
```

وليس ادعاء الكمال.

---

# PRINCIPLE 011 — EVERY FIX SHOULD BECOME A REGRESSION TEST

إذا تم اكتشاف Bug مهم:

```text
BUG
↓
FIX
↓
REGRESSION TEST
↓
VERIFY
```

---

# PRINCIPLE 012 — CHANGE MUST BE REVERSIBLE

كل تغيير عالي المخاطر يجب أن يكون:

* traceable
* reviewable
* reversible
* testable

---

# PRINCIPLE 013 — DO NOT REWRITE WITHOUT EVIDENCE

لا تعيد كتابة:

* frontend
* backend
* database
* architecture
* authentication
* design system

فقط لأنها قد تكون "أفضل".

يجب وجود سبب هندسي قابل للإثبات.

---

# PRINCIPLE 014 — SECURITY HAS PRIORITY

ترتيب الأولويات:

```text
P0 Security / Data Integrity / Safety
P1 Correctness / Architecture
P2 Reliability
P3 Performance
P4 Accessibility / UX
P5 Design polish
P6 Preferences
```

---

# 1. WEBFORGE CORE OPERATING MODEL

يجب أن يعمل WebForge بهذا النموذج:

```text
INPUT
 ↓
DISCOVER
 ↓
UNDERSTAND
 ↓
MODEL
 ↓
BASELINE
 ↓
THREAT MODEL
 ↓
RISK ANALYSIS
 ↓
CHANGE IMPACT
 ↓
PLAN
 ↓
IMPLEMENT
 ↓
BUILD
 ↓
STATIC ANALYSIS
 ↓
UNIT TEST
 ↓
INTEGRATION TEST
 ↓
DATABASE TEST
 ↓
API TEST
 ↓
BROWSER TEST
 ↓
VISUAL TEST
 ↓
RESPONSIVE TEST
 ↓
ACCESSIBILITY TEST
 ↓
SECURITY TEST
 ↓
PERFORMANCE TEST
 ↓
BUSINESS LOGIC TEST
 ↓
CONCURRENCY TEST
 ↓
FAILURE TEST
 ↓
REGRESSION TEST
 ↓
COMPARE BEFORE/AFTER
 ↓
EVIDENCE
 ↓
ACCEPT / REJECT / ROLLBACK
 ↓
MEMORY
 ↓
FINAL REPORT
```

---

# 2. PROJECT UNDERSTANDING ENGINE

أنشئ نظامًا مركزيًا:

```text
Project Understanding Engine
```

يجب أن يبني نموذجًا متكاملًا للمشروع.

## يجب اكتشاف:

### Repository

* directories
* files
* file types
* generated files
* source files
* configuration
* scripts
* documentation
* tests
* assets

### Applications

* web
* server
* worker
* mobile
* CLI
* admin
* public API

### Architecture

* layers
* modules
* boundaries
* services
* adapters
* repositories
* controllers
* components
* state
* events

### Runtime

* Node
* Python
* Java
* Go
* PHP
* browser
* containers
* workers

### Dependencies

* direct
* transitive
* dev
* runtime
* peer
* optional

---

# 3. CODEBASE SEMANTIC MAP

لا يكفي Dependency Graph.

أنشئ:

```text
Codebase Semantic Graph
```

يحتوي:

```text
Repository
Application
Module
File
Symbol
Function
Class
Component
Hook
Route
API
Database Table
Column
Index
Event
Queue
State
State Transition
Test
Requirement
Security Control
Performance Budget
Design Token
Feature
```

العلاقات:

```text
CALLS
IMPORTS
EXPORTS
RENDERS
DEPENDS_ON
READS
WRITES
TRIGGERS
TRANSITIONS_TO
AUTHORIZES
VALIDATES
TESTS
IMPLEMENTS
SATISFIES
AFFECTS
```

---

# 4. FEATURE GRAPH

كل Feature يجب أن يصبح قابلاً للتتبع:

```text
Requirement
 ↓
Feature
 ↓
UI
 ↓
API
 ↓
Service
 ↓
Database
 ↓
State
 ↓
Tests
 ↓
Security Controls
 ↓
Evidence
```

---

# 5. REQUIREMENT TRACEABILITY

أنشئ:

```text
Requirement Traceability Engine
```

كل Requirement يجب أن يعرف:

* source
* owner
* implementation
* affected files
* APIs
* DB
* UI
* tests
* security controls
* acceptance criteria
* evidence
* status

الحالات:

```text
DISCOVERED
PLANNED
IMPLEMENTED
TESTED
VERIFIED
REGRESSED
BLOCKED
DEPRECATED
```

---

# 6. PROJECT BASELINE ENGINE

قبل أي Reengineering:

أنشئ Baseline.

## Baseline يشمل:

### Build

* build time
* warnings
* errors
* bundle size
* output size

### Runtime

* startup time
* memory
* CPU
* errors
* crashes

### Frontend

* FCP
* LCP
* INP
* CLS
* TTFB
* JS execution
* CSS size
* image size

### Backend

* API latency
* throughput
* error rate
* p95
* p99

### Database

* query latency
* query count
* slow queries
* connection usage

### Security

* vulnerabilities
* secrets
* auth findings
* authorization findings
* dependency findings

### Accessibility

* WCAG findings
* keyboard
* focus
* contrast
* screen reader issues

### Responsive

* viewport failures
* overflow
* clipping
* layout breaks

### Visual

* screenshot baseline

---

# 7. CHANGE IMPACT ANALYZER

قبل كل تغيير:

```text
Changed File
 ↓
Affected Symbols
 ↓
Affected Modules
 ↓
Affected Features
 ↓
Affected APIs
 ↓
Affected DB
 ↓
Affected Security Controls
 ↓
Affected Tests
 ↓
Affected UI
 ↓
Affected Performance
 ↓
Risk
```

صنف:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 8. REGRESSION RISK ENGINE

احسب المخاطر بناءً على:

* surface area
* dependency count
* criticality
* security sensitivity
* data sensitivity
* API exposure
* state impact
* concurrency
* payment impact
* authentication impact
* database impact
* test coverage
* historical failures

لا تستخدم رقمًا بلا تفسير.

كل risk يجب أن يحتوي:

```text
Risk
Reason
Affected Areas
Required Tests
Mitigation
Rollback Strategy
```

---

# 9. ARCHITECTURE INTELLIGENCE

أنشئ:

```text
Architecture Intelligence Engine
```

وظائفه:

* architecture detection
* layer detection
* boundary detection
* coupling analysis
* cohesion analysis
* circular dependency detection
* dependency direction
* architecture rule validation
* architecture drift
* anti-pattern detection

---

# 10. ARCHITECTURE DRIFT DETECTION

قارن:

```text
Declared Architecture
VS
Actual Architecture
```

واكتشف:

* frontend → DB
* service → UI
* circular imports
* forbidden dependency
* layer violation
* boundary violation
* unexpected coupling

---

# 11. ARCHITECTURE FITNESS TESTS

يجب أن تكون Architecture Rules executable.

مثال:

```text
Frontend MUST NOT access DB.
Controllers MUST NOT contain business logic.
Services MUST NOT import UI.
Security middleware MUST precede protected routes.
```

هذه ليست Documentation فقط.

يجب أن تكون Tests/Gates.

---

# 12. ENGINEERING DECISION ENGINE

عند وجود أكثر من حل:

يقارن:

```text
Correctness
Security
Complexity
Performance
Maintainability
Compatibility
Migration Cost
Regression Risk
Operational Risk
```

لا يختار حلًا عشوائيًا.

يكتب ADR عند القرار المعماري المهم.

---

# 13. SECURITY INTELLIGENCE ENGINE

يجب دمج:

* threat modeling
* security profiler
* security control matrix
* attack surface inventory
* risk engine
* change impact
* supply chain
* privacy/data flow
* AI security
* abuse/fraud
* architecture fitness
* security memory

---

# 14. SECURITY COVERAGE

افحص على الأقل:

```text
OS Command Injection
Code Injection
Command Injection
SQL Injection
NoSQL Injection
LDAP Injection
XSS
CSRF
SSRF
XXE
Path Traversal
LFI
RFI
Open Redirect
HTTP Request Smuggling
HTTP Response Splitting
Prototype Pollution
Insecure Deserialization
Mass Assignment
IDOR
BOLA
Broken Authentication
Broken Authorization
Privilege Escalation
Session Fixation
Session Hijacking
JWT weaknesses
OAuth weaknesses
CORS misconfiguration
CSRF
Clickjacking
Security Headers
TLS
Cookie Security
Secrets Exposure
Hard-coded Credentials
Weak Credentials
Information Disclosure
Improper Error Handling
File Upload
Zip Slip
Race Conditions
TOCTOU
DoS
ReDoS
Rate Limit Bypass
API Abuse
Business Logic Abuse
Webhook Abuse
Replay
Double Spending
Coupon Abuse
Price Manipulation
Quantity Manipulation
Tenant Isolation Failure
Data Leakage
Logging Leakage
PII Leakage
```

---

# 15. AI / LLM SECURITY

يجب دعم:

```text
Prompt Injection
Indirect Prompt Injection
System Prompt Leakage
Sensitive Information Disclosure
Insecure Output Handling
Improper Tool Authorization
Excessive Agency
Unauthorized Tool Execution
Agent Privilege Escalation
RAG Leakage
Cross-Tenant Retrieval
Vector Store Leakage
Embedding Weaknesses
Data Poisoning
Model Poisoning
AI Supply Chain
Context Leakage
Improper Output Validation
Unsafe Code Generation
Tool Parameter Manipulation
Agent DoS
Resource Exhaustion
Unauthorized External Actions
```

---

# 16. AI AGENT PERMISSION SYSTEM

كل Agent Action:

```text
REQUEST
 ↓
CLASSIFY
 ↓
AUTHENTICATE AGENT
 ↓
AUTHORIZE
 ↓
RISK SCORE
 ↓
POLICY
 ↓
EXECUTE
 ↓
VALIDATE
 ↓
AUDIT
```

مثال:

```text
Read source → ALLOW
Edit CSS → ALLOW
Edit auth → HIGH RISK
Change DB schema → HIGH RISK
Delete data → BLOCK / APPROVAL
Deploy production → APPROVAL
Rotate secrets → APPROVAL
```

---

# 17. HUMAN APPROVAL GATES

لا تسمح Autonomous Execution لبعض العمليات الحساسة دون policy approval.

على الأقل:

* production deployment
* database destruction
* destructive migration
* secret rotation
* privilege changes
* auth architecture changes
* payment logic changes
* deletion of security controls
* disabling tests
* disabling security middleware
* disabling logging
* disabling audit trail

---

# 18. DATABASE INTELLIGENCE

يجب دعم PostgreSQL على الأقل.

تحقق من:

```text
Schema
Tables
Columns
Types
Constraints
Primary Keys
Foreign Keys
Unique
Indexes
Partial Indexes
RLS
Policies
Transactions
Isolation
Locks
Deadlocks
Connection Pool
Migrations
Rollback
Schema Drift
Query Plans
Slow Queries
N+1
Unused Indexes
Duplicate Indexes
Orphan Rows
Cascade Behavior
Data Integrity
Race Conditions
```

---

# 19. REAL DATABASE VERIFICATION

إذا كان المشروع يستخدم PostgreSQL:

يجب أن تكون هناك إمكانية لتشغيل:

```text
REAL POSTGRES
```

وليس فقط in-memory.

اختبر:

* migrations
* rollback
* transactions
* RLS
* concurrent writes
* constraints
* indexes
* isolation

---

# 20. REDIS INTELLIGENCE

اختبر Redis الحقيقي عند استخدامه.

يشمل:

* cache
* sessions
* locks
* rate limits
* idempotency
* queues
* TTL
* eviction
* reconnect
* failover
* cluster behavior

Security-sensitive features يجب أن تكون:

```text
FAIL CLOSED
```

عندما يكون ذلك مطلوبًا.

---

# 21. API INTELLIGENCE

لكل API:

```text
Authentication
Authorization
Validation
Schema
Errors
Rate Limit
Pagination
Sorting
Filtering
Caching
Idempotency
Transactions
Timeouts
Retries
Logging
Tracing
Security
```

---

# 22. CONTRACT-FIRST DEVELOPMENT

كل API يجب أن يمتلك Contract.

يشمل:

```text
Request
Response
Errors
Authentication
Authorization
Status Codes
Validation
Pagination
Idempotency
```

ثم:

```text
Contract
 ↓
Server
 ↓
Client
 ↓
Tests
```

يجب اكتشاف Contract Drift.

---

# 23. API CLIENT INTELLIGENCE

يدعم:

* authentication
* refresh
* retry
* timeout
* exponential backoff
* cancellation
* idempotency
* error normalization
* request tracing
* correlation ID

ممنوع إعادة إرسال عمليات غير idempotent بشكل أعمى.

---

# 24. BUSINESS LOGIC ENGINE

يجب تحليل:

```text
Pricing
Inventory
Coupons
Orders
Payments
Refunds
Returns
Subscriptions
Reservations
Applications
Approvals
Accounts
Roles
Tenants
```

اكتشف:

* invalid transitions
* race conditions
* duplicate actions
* replay
* state corruption
* ownership bypass
* price manipulation
* negative quantities
* impossible states

---

# 25. STATE MACHINE ENGINE

كل domain critical workflow يجب أن يستخدم state machine عندما يكون ذلك مناسبًا.

مثال:

```text
PENDING
 ↓
PAID
 ↓
PROCESSING
 ↓
SHIPPED
 ↓
DELIVERED
```

لا تسمح:

```text
DELIVERED → PENDING
```

إلا إذا كانت policy تسمح بذلك.

---

# 26. CONCURRENCY ENGINE

اختبر:

```text
Concurrent Requests
Concurrent Purchases
Concurrent Updates
Duplicate Webhooks
Double Payment
Stock Race
Coupon Race
Balance Race
Session Race
```

استخدم:

* stress
* concurrency
* locking
* transactions
* atomic operations

---

# 27. VULNERABILITY LAB

احتفظ بمشاريع Fixtures تحتوي عمدًا على:

```text
Broken Auth
Broken RBAC
IDOR
SQLi
XSS
SSRF
CSRF
Race Condition
Path Traversal
Weak Session
Broken Tenant Isolation
Payment Logic Bug
N+1
Responsive Bug
Accessibility Bug
Performance Bug
State Machine Bug
AI Agent Bug
```

يجب أن يستطيع WebForge اكتشافها.

---

# 28. MUTATION TESTING

اختبر قوة الاختبارات.

أنشئ Mutations مثل:

```text
Change > to >=
Change == to !=
Remove validation
Bypass authorization
Change return value
Disable error handling
Change state transition
Alter SQL condition
```

إذا بقيت الاختبارات ناجحة:

```text
TEST SUITE WEAKNESS DETECTED
```

---

# 29. PROPERTY-BASED TESTING

للقواعد التي يجب أن تكون صحيحة دائمًا:

مثلاً:

```text
stock >= 0
balance >= 0
unauthorized user cannot access resource
invalid state cannot transition
tenant A cannot read tenant B
```

اختبر properties وليس حالات محددة فقط.

---

# 30. FUZZING ENGINE

Fuzz:

```text
JSON
Query
Headers
Forms
Files
URLs
API Payloads
Webhooks
Parsers
State Inputs
```

القيم تشمل:

```text
empty
null
huge
negative
unicode
malformed
nested
unexpected type
NaN
Infinity
duplicate keys
```

---

# 31. FAILURE INJECTION / CHAOS ENGINE

حالات:

```text
DB unavailable
Redis unavailable
Payment timeout
API timeout
Network latency
500 response
Partial failure
Duplicate webhook
Expired credentials
Missing configuration
Disk full
Memory pressure
Connection exhaustion
```

تحقق من:

```text
Recovery
Data Integrity
Retry
Idempotency
User Error
Logging
Alerting
```

---

# 32. FRONTEND INTELLIGENCE

افحص:

* component architecture
* state management
* props
* hooks
* effects
* event handlers
* memory leaks
* unnecessary renders
* accessibility
* forms
* loading states
* empty states
* error states
* skeletons
* optimistic updates
* routing
* code splitting

---

# 33. UI/UX INTELLIGENCE

لا تكتفِ بـ"التصميم جميل".

حلل:

```text
Hierarchy
Navigation
Consistency
Affordance
Feedback
Loading
Errors
Empty States
Forms
Validation
Mobile UX
Keyboard UX
Touch Targets
Readability
Density
Information Architecture
```

---

# 34. ANTI-SLOP ENGINE

يمنع:

* generic AI SaaS hero
* arbitrary gradients
* excessive glassmorphism
* meaningless bento
* excessive rounded cards
* excessive pills
* fake testimonials
* fake statistics
* fake logos
* excessive glow
* excessive blur
* excessive shadows
* meaningless 3D
* unnecessary animation
* cursor gimmicks
* parallax abuse

---

# 35. DESIGN INTELLIGENCE

استخدم:

```text
Design Tokens
Typography System
Spacing System
Color System
Elevation
Radius
Motion
Grid
Responsive Rules
Component States
```

لكن لا تفرض تصميمًا واحدًا على كل مشروع.

---

# 36. DESIGN ANTI-CONVERGENCE

عند الاستعانة بمراجع خارجية:

```text
Research
+
Compare
+
Synthesize
```

لا:

```text
Copy
```

لا تنسخ موقعًا أو تصميمًا كاملًا.

---

# 37. VISUAL REGRESSION ENGINE

يجب دعم:

```text
Playwright
Chromium
Screenshots
Pixel Diff
DOM Diff
Layout Diff
Typography Diff
Overflow Detection
```

كل صفحة مهمة يجب أن تمتلك baseline عند الحاجة.

---

# 38. RESPONSIVE INTELLIGENCE

اختبر:

```text
320
375
390
414
480
768
834
1024
1280
1440
1920
```

مع:

```text
Portrait
Landscape
Touch
Keyboard
High Zoom
Reduced Motion
```

اكتشف:

* overflow
* clipping
* overlap
* hidden controls
* broken navigation
* fixed width
* broken tables
* modal overflow
* typography collapse

---

# 39. RTL/LTR ENGINE

يجب دعم:

```text
RTL
LTR
Mixed Content
Arabic
English
Numbers
Dates
Currencies
Icons
Directional Icons
Tables
Forms
```

اختبر:

```text
dir=rtl
dir=ltr
```

ولا تعكس Icons التي لا تحتاج عكسًا.

---

# 40. ACCESSIBILITY ENGINE

استهدف:

```text
WCAG 2.2 AA
```

تحقق من:

* semantic HTML
* keyboard navigation
* focus
* focus visibility
* focus trap
* labels
* errors
* ARIA
* contrast
* screen reader
* reduced motion
* touch target
* headings
* landmarks
* dialogs
* tables
* forms

---

# 41. PERFORMANCE ENGINE

افحص:

```text
Bundle
Images
Fonts
CSS
JS
Network
Rendering
Long Tasks
Memory
CPU
Caching
Compression
Lazy Loading
Preloading
Prefetching
Code Splitting
Server Rendering
Database
API
```

---

# 42. PERFORMANCE BUDGETS

يمكن للمشروع تعريف:

```text
LCP budget
INP budget
CLS budget
Bundle budget
API latency budget
DB latency budget
Memory budget
```

إذا تم تجاوز budget:

```text
PERFORMANCE REGRESSION
```

---

# 43. REAL USER PERFORMANCE

إذا كان instrumentation متوفرًا:

اجمع:

```text
RUM
LCP
INP
CLS
TTFB
Errors
API latency
Device class
Network class
```

افصل:

```text
LAB
```

عن:

```text
REAL USER
```

---

# 44. CODE QUALITY ENGINE

اكتشف:

* dead code
* unreachable code
* duplicate logic
* duplicate components
* unused exports
* unused dependencies
* circular imports
* overly complex functions
* large files
* large components
* duplicated validation
* inconsistent error handling

---

# 45. TECHNICAL DEBT ENGINE

كل debt:

```text
ID
Description
Impact
Risk
Owner
Introduced
Affected Areas
Cost
Priority
Remediation
```

---

# 46. DEPENDENCY INTELLIGENCE

لكل dependency:

```text
Version
Purpose
Usage
Vulnerabilities
License
Maintenance
Bundle Impact
Transitive Dependencies
Upgrade Risk
Breaking Changes
```

لا تحدث dependency عشوائيًا.

---

# 47. SUPPLY CHAIN SECURITY

تحقق من:

* lockfile
* integrity
* package provenance when available
* dependency confusion risk
* malicious packages
* typosquatting
* install scripts
* unexpected network behavior
* abandoned packages
* vulnerable transitive dependencies

---

# 48. SECRET MANAGEMENT

اكتشف:

```text
API Keys
Tokens
Passwords
Private Keys
Cloud Credentials
Database URLs
JWT Secrets
Webhook Secrets
```

في:

```text
Source
Git
Logs
Build Artifacts
Images
Environment Files
Documentation
Tests
```

لا تعرض secret كاملًا في reports.

---

# 49. PRIVACY / DATA FLOW

ابنِ:

```text
Data Flow Graph
```

من:

```text
Input
→ API
→ Service
→ Database
→ Logs
→ Analytics
→ External Service
```

صنف:

```text
PII
Credentials
Financial
Authentication
Business Sensitive
Public
```

---

# 50. ERROR INTELLIGENCE

كل error يجب أن يحتوي:

```text
Stable Error Code
User Message
Developer Context
HTTP Status
Severity
Correlation ID
Trace ID
Recovery Suggestion
```

لا تعرض:

```text
Stack Trace
Secrets
SQL
Internal Paths
Credentials
Tokens
```

للمستخدم.

---

# 51. OBSERVABILITY

يجب دعم:

```text
Logs
Metrics
Traces
Health
Readiness
Liveness
Audit
Error Tracking
Correlation IDs
```

---

# 52. AUDIT LOGGING

الأحداث المهمة:

```text
Login
Logout
Failed Login
Password Change
Role Change
Permission Change
Data Export
Data Delete
Payment
Refund
Webhook
Admin Action
Security Event
Configuration Change
Deployment
```

يجب أن تكون:

```text
Structured
Tamper-aware
Privacy-aware
Searchable
Correlated
```

---

# 53. CLI INTELLIGENCE

كل CLI command يجب أن يكون:

```text
Documented
Validated
Tested
Consistent
Idempotent where appropriate
```

يجب اكتشاف:

* function name mismatch
* argument mismatch
* instance/static mismatch
* missing command
* wrong output
* wrong exit code

---

# 54. CLI CONTRACT

لكل command:

```text
Name
Arguments
Options
Input
Output
Exit Codes
Errors
Permissions
Side Effects
```

---

# 55. CI/CD ENGINE

أنشئ CI pipeline قابلة للتنفيذ:

```text
Install
↓
Integrity
↓
Lint
↓
Type Check
↓
Unit
↓
Integration
↓
Build
↓
Database
↓
API
↓
Browser
↓
Accessibility
↓
Security
↓
Performance
↓
Visual
↓
Regression
↓
Evidence
```

---

# 56. QUALITY GATES

مثال:

```text
GATE 1
Build must pass

GATE 2
Critical tests must pass

GATE 3
No new critical security finding

GATE 4
No unauthorized architecture drift

GATE 5
No critical accessibility regression

GATE 6
No severe performance regression

GATE 7
No business logic regression

GATE 8
Required browser flows pass

GATE 9
Evidence generated

GATE 10
Rollback available
```

---

# 57. EVIDENCE ENGINE

كل claim مهم يجب أن يحتوي:

```text
Claim
Evidence Type
Command
Environment
Timestamp
Result
Artifact
Confidence
Limitations
```

---

# 58. EVIDENCE CONFIDENCE

صنف Evidence:

```text
DOCUMENTATION
LOW

STATIC ANALYSIS
LOW/MEDIUM

UNIT
MEDIUM

INTEGRATION
MEDIUM/HIGH

REAL DATABASE
HIGH

REAL REDIS
HIGH

REAL BROWSER
HIGH

PRODUCTION TELEMETRY
VERY HIGH
```

لا تخلط بينهم.

---

# 59. BEFORE / AFTER ENGINE

لكل تحسين:

```text
BEFORE
AFTER
DELTA
REGRESSION
```

مثال:

```text
Bundle:
2.8 MB → 1.7 MB

LCP:
4.2s → 2.1s

API p95:
680ms → 210ms
```

إذا لم تتوفر القياسات:

```text
NOT MEASURED
```

وليس:

```text
IMPROVED
```

---

# 60. AUTOMATIC ROLLBACK

إذا:

```text
Critical regression
Security regression
Data corruption
Build failure
Critical E2E failure
```

يجب:

```text
REJECT
```

أو:

```text
ROLLBACK
```

بحسب البيئة والسياسة.

---

# 61. ENGINEERING MEMORY

أنشئ:

```text
Engineering Memory
```

تحتفظ بـ:

```text
Bugs
Fixes
Regressions
Architecture Decisions
Security Findings
Performance Findings
Rejected Solutions
Known Constraints
Historical Baselines
Lessons Learned
```

لا تخترع memory.

---

# 62. CONTINUOUS IMPROVEMENT LOOP

بعد كل عملية:

```text
What changed?
What improved?
What regressed?
What failed?
What was learned?
What should be tested next time?
What should become a rule?
```

---

# 63. RULE PROMOTION

إذا تكرر خطأ مهم:

```text
Incident
↓
Pattern
↓
Rule Candidate
↓
Review
↓
Rule
↓
Validator
↓
Test
↓
Gate
```

وبالتالي:

```text
Rule
↓
Validator
↓
Test
↓
Gate
↓
Evidence
```

---

# 64. SELF-HEALING CONTROLLED MODE

مسموح لـWebForge باقتراح:

* bug fixes
* refactors
* performance fixes
* accessibility fixes
* responsive fixes
* security fixes

لكن التنفيذ يجب أن يخضع لـ:

```text
Risk
Policy
Impact
Tests
Evidence
```

---

# 65. NO BLIND AUTO-FIX

ممنوع:

```text
Find Error
→ Automatically rewrite entire project
```

يجب:

```text
Detect
→ Diagnose
→ Propose
→ Impact
→ Patch
→ Test
→ Compare
```

---

# 66. PROJECT REENGINEERING MODE

عند إضافة WebForge إلى مشروع قائم:

فعّل:

```text
EXISTING PROJECT MODE
```

ولا تفترض أن المشروع صمم بواسطة WebForge.

---

# 67. EXISTING PROJECT WORKFLOW

```text
DISCOVER
↓
MAP
↓
BASELINE
↓
UNDERSTAND
↓
RISK
↓
PLAN
↓
IMPROVE
↓
VERIFY
↓
COMPARE
↓
REGRESSION
↓
DOCUMENT
```

---

# 68. PRESERVE WORKING FUNCTIONALITY

لا تكسر:

* routes
* APIs
* forms
* auth
* payments
* data
* integrations
* user flows

دون سبب موثق.

---

# 69. IMPROVE WITHOUT BREAKING

كل تغيير يجب أن يمر:

```text
BASELINE
→ CHANGE PLAN
→ IMPLEMENT
→ BUILD
→ TEST
→ COMPARE
→ REGRESSION
→ ACCEPT
```

---

# 70. AUTOMATIC PROBLEM DISCOVERY

لا تنتظر أن يعطي المستخدم Bug list.

اكتشف:

```text
Hidden Bugs
Security Issues
Performance Problems
Responsive Problems
Accessibility Problems
UX Problems
Architecture Problems
Data Problems
State Problems
Concurrency Problems
Error Handling Problems
Dependency Problems
```

---

# 71. TEST SELECTION ENGINE

لا تشغل دائمًا كل الاختبارات فقط.

حدد affected tests.

مثال:

```text
Auth changed
→ Auth tests
→ Session tests
→ Permission tests
→ Security tests
→ affected API tests
→ affected browser flows
```

لكن قبل merge/release:

```text
FULL REGRESSION
```

يجب أن يكون متاحًا.

---

# 72. TEST MATRIX

أنشئ Matrix:

```text
Unit
Integration
API
Database
Browser
Visual
Accessibility
Security
Performance
Concurrency
Mutation
Fuzz
Chaos
Regression
```

مع:

```text
Required
Optional
Unavailable
Not Applicable
```

---

# 73. TEST ENVIRONMENT DETECTION

اكتشف تلقائيًا:

```text
Node
npm
pnpm
yarn
Python
Docker
PostgreSQL
Redis
Playwright
Chromium
Browsers
Git
CI
```

أنشئ:

```text
PROJECT_CAPABILITIES.md
```

---

# 74. ENVIRONMENT LIMITATION POLICY

إذا لم تتوفر أداة:

لا تدّعِ نجاح الاختبار.

اكتب:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

مع:

```text
Missing Tool
Why Needed
How To Enable
What Remains Unverified
```

---

# 75. BROWSER AUTOMATION

إذا كان المشروع Web:

حاول استخدام:

```text
Playwright
Chromium
```

لـ:

* navigation
* login
* forms
* checkout
* dialogs
* keyboard
* responsive
* screenshots
* visual regression
* console errors
* network failures

---

# 76. BROWSER FAILURE DETECTION

اكتشف:

```text
Console Errors
Unhandled Rejections
Network Errors
404
500
Broken Images
Broken Fonts
Hydration Errors
JS Exceptions
Layout Overflow
Focus Problems
```

---

# 77. PERFORMANCE PROFILING

عند الحاجة استخدم:

```text
Browser Performance
CPU Profiling
Network
Memory
Long Tasks
Database Query Plans
API Timing
```

---

# 78. MEMORY LEAK DETECTION

خصوصًا:

```text
Event Listeners
Timers
Intervals
WebSockets
Subscriptions
Observers
Caches
DOM References
```

---

# 79. IMAGE / ASSET INTELLIGENCE

افحص:

```text
Image Dimensions
Format
Compression
Lazy Loading
Responsive Images
Unused Assets
Duplicate Assets
Huge Assets
Fonts
Preload
Caching
```

---

# 80. SEO ENGINE

عند وجود public website:

تحقق من:

```text
Title
Description
Canonical
Robots
Sitemap
Structured Data
Open Graph
Twitter Cards
Semantic HTML
Headings
Links
404
Redirects
Performance
```

---

# 81. SECURITY HEADERS

تحقق من:

```text
CSP
HSTS
X-Content-Type-Options
Frame protection
Referrer-Policy
Permissions-Policy
COOP
COEP where appropriate
CORP where appropriate
```

لا تضف Header قد يكسر التطبيق دون اختبار.

---

# 82. SESSION SECURITY

تحقق من:

```text
HttpOnly
Secure
SameSite
Expiration
Rotation
Revocation
Fixation
Refresh
Logout
Concurrent Sessions
```

---

# 83. AUTHORIZATION

افصل:

```text
Authentication
Authorization
Ownership
Tenant Isolation
Role
Permission
Resource Access
```

اختبر كل طبقة.

---

# 84. MULTI-TENANCY

اختبر:

```text
Tenant A → Tenant A
Tenant B → Tenant B
Tenant A → Tenant B
Admin → Tenant
Cross-Tenant API
Cross-Tenant Cache
Cross-Tenant Search
Cross-Tenant Logs
Cross-Tenant Files
```

يجب منع cross-tenant leakage.

---

# 85. FILE SECURITY

تحقق من:

```text
Extension
MIME
Magic Bytes
Size
Path
Filename
Storage
Execution
Archive
Zip Slip
Traversal
Virus/Malware scanning where appropriate
```

---

# 86. WEBHOOK SECURITY

تحقق من:

```text
Signature
Timestamp
Replay
Idempotency
Ordering
Authentication
Authorization
Payload Validation
Timeout
Duplicate Delivery
```

---

# 87. PAYMENT ARCHITECTURE

لا تدّعِ أن simulation هو payment integration حقيقي.

يجب توفير abstraction:

```text
PaymentProvider
```

مع adapters:

```text
Mock
Sandbox
Production
```

ولا تخزن card secrets بطريقة غير آمنة.

---

# 88. ECOMMERCE VERIFICATION

اختبر:

```text
Product
Cart
Stock
Price
Coupon
Checkout
Payment
Order
Inventory
Shipment
Return
Refund
```

مع:

```text
Duplicate Payment
Price Tampering
Quantity Tampering
Coupon Abuse
Stock Race
Replay
Invalid State
Unauthorized Order
```

---

# 89. FORM INTELLIGENCE

كل Form يجب أن يختبر:

```text
Empty
Invalid
Boundary
Unicode
Long Input
Duplicate
Slow Network
Server Error
Validation Error
Success
Loading
Retry
```

---

# 90. ERROR STATE COVERAGE

لكل feature:

```text
Loading
Success
Empty
Error
Offline
Unauthorized
Forbidden
Not Found
Conflict
Rate Limited
Server Failure
```

---

# 91. STATE MANAGEMENT

افحص:

```text
Global State
Local State
Server State
Cache
Persistence
Invalidation
Race
Stale Data
Memory
Subscriptions
```

---

# 92. CACHE INTELLIGENCE

تحقق من:

```text
Cache Key
TTL
Invalidation
Stale Data
Tenant Isolation
Authorization
Race
Stampede
Poisoning
Sensitive Data
```

---

# 93. RATE LIMIT INTELLIGENCE

اختبر:

```text
Login
Signup
Password Reset
OTP
Search
API
Payment
Webhook
Expensive Operations
```

ويجب ألا يكون rate limiting قابلاً للتجاوز بسهولة.

---

# 94. OBSERVABILITY SECURITY

تأكد أن logs لا تحتوي:

```text
Passwords
Tokens
Secrets
Full Payment Data
Private Keys
Sensitive PII
```

---

# 95. DEPLOYMENT INTELLIGENCE

افحص:

```text
Docker
Nginx
Reverse Proxy
TLS
Environment
Secrets
Healthchecks
Readiness
Liveness
Graceful Shutdown
Signals
Resource Limits
Restart Policy
Network
Volumes
```

---

# 96. CONTAINER SECURITY

تحقق من:

```text
Non-root
Minimal Image
Pinned Versions
Read-only FS where possible
Dropped Capabilities
No Privileged
Healthcheck
Secrets
Network Isolation
Resource Limits
```

---

# 97. PRODUCTION READINESS

لا تقل READY إلا إذا تم تحديد:

```text
Database
Cache
Secrets
Observability
Backups
Migrations
Rollback
Security
Monitoring
Alerts
Scaling
Failure Recovery
Deployment
Browser
Performance
```

---

# 98. BACKUP / RECOVERY

إذا كان المشروع data-bearing:

اختبر أو وثق:

```text
Backup
Restore
Migration Recovery
Point-in-Time Recovery where applicable
Data Integrity
Disaster Recovery
```

---

# 99. RATE / RESOURCE ABUSE

اختبر:

```text
Large Payload
Large File
Deep JSON
Huge Query
Expensive Search
Concurrent Requests
Repeated Requests
Slow Clients
```

---

# 100. SECURITY BENCHMARK

أنشئ benchmark suite يقيس:

```text
Detection Rate
Fix Rate
Regression Rate
False Positive
False Negative
Coverage
Evidence Quality
```

---

# 101. DESIGN BENCHMARK

أنشئ fixtures لتقييم:

```text
Responsive
Accessibility
Typography
Spacing
Contrast
Visual Hierarchy
Animation
Interaction
Anti-Slop
```

---

# 102. PERFORMANCE BENCHMARK

Fixtures تشمل:

```text
Huge Bundle
N+1
Slow API
Slow DB
Huge Images
Memory Leak
Long Tasks
Poor Caching
```

ويجب أن يستطيع WebForge اكتشافها.

---

# 103. BUSINESS LOGIC BENCHMARK

Fixtures:

```text
Price Manipulation
Coupon Abuse
Stock Race
Unauthorized Refund
Invalid State
Duplicate Payment
Tenant Escape
Privilege Escalation
```

---

# 104. AI SECURITY BENCHMARK

Fixtures:

```text
Prompt Injection
Indirect Injection
Tool Abuse
RAG Leakage
Cross Tenant Retrieval
Secret Extraction
Unauthorized Action
Excessive Agency
```

---

# 105. SELF-AUDIT ENGINE

WebForge يجب أن يستطيع فحص نفسه:

```text
Core
Architecture
Security
Tests
CLI
Packages
Dependencies
Documentation
Evidence
CI
Performance
```

ولا يجوز أن يعتمد على نفسه دون external-like fixtures حيثما كان ذلك ممكنًا.

---

# 106. DUPLICATION AUDIT

اكتشف:

```text
Duplicate Security
Duplicate Auth
Duplicate Tokens
Duplicate API Client
Duplicate Validation
Duplicate State Machine
Duplicate DB Adapter
Duplicate Logging
Duplicate Error Handler
Duplicate Components
```

اختر canonical implementation واحدًا.

---

# 107. PACKAGE BOUNDARIES

كل package يجب أن يحدد:

```text
Purpose
Public API
Dependencies
Forbidden Dependencies
Tests
Owner
Stability
```

---

# 108. PUBLIC API STABILITY

لا تكسر public API دون:

```text
Versioning
Migration
Compatibility
Deprecation
Tests
```

---

# 109. BACKWARD COMPATIBILITY

عند تغيير contract:

اختبر:

```text
Old Client
New Client
Old Data
New Data
Old API
New API
Migration
Rollback
```

---

# 110. MIGRATION SAFETY

كل DB migration يجب أن يكون:

```text
Forward
Validated
Rollback-aware
Data-safe
Idempotent where appropriate
Tested
```

---

# 111. ZERO-DOWNTIME MIGRATION THINKING

عند production-like migration:

استخدم patterns مناسبة مثل:

```text
Expand
Migrate
Contract
```

ولا تفترض أن تغيير schema مباشرة آمن.

---

# 112. CONFIGURATION ENGINE

كل config:

```text
Name
Type
Required
Default
Secret?
Environment
Validation
Impact
```

لا تعتمد على environment variables غير موثقة.

---

# 113. CONFIGURATION DRIFT

قارن:

```text
Development
Test
Staging
Production
```

واكتشف الاختلافات الخطرة.

---

# 114. FEATURE FLAGS

إذا استخدمت:

```text
Feature Flags
```

يجب أن تدعم:

```text
Default
Environment
Targeting
Expiration
Audit
Rollback
```

---

# 115. RELEASE ENGINE

كل release يجب أن يمتلك:

```text
Version
Changes
Risk
Tests
Evidence
Migration
Rollback
Known Issues
```

---

# 116. CHANGELOG INTELLIGENCE

لا تكتب changelog عشوائيًا.

يجب أن يعتمد على changes الفعلية.

---

# 117. DOCUMENTATION VALIDATION

افحص:

```text
README
Architecture
API
CLI
Setup
Deployment
Security
Testing
```

مقابل الكود الفعلي.

اكتشف:

```text
Documentation Drift
```

---

# 118. DEAD DOCUMENTATION

اكتشف docs التي تشير إلى:

* deleted files
* old commands
* old APIs
* old architecture
* deprecated systems

---

# 119. AGENT INSTRUCTIONS

يجب أن يمتلك WebForge Agent Contract يحدد:

```text
Allowed
Forbidden
Required
Approval Required
Evidence Required
Testing Required
```

---

# 120. AGENT ANTI-LAZINESS

ممنوع:

```text
Looks good
Should work
Probably fixed
Tests should pass
Security appears fine
```

بدون Evidence.

---

# 121. AGENT ANTI-HALLUCINATION

عند عدم المعرفة:

```text
UNKNOWN
```

عند عدم الاختبار:

```text
NOT TESTED
```

عند نقص البيئة:

```text
ENVIRONMENT LIMITATION
```

---

# 122. AGENT EXECUTION LOG

كل مهمة مهمة تسجل:

```text
Intent
Files Inspected
Commands
Changes
Tests
Failures
Fixes
Final State
Evidence
```

---

# 123. SAFE PATCHING

كل patch يجب أن يكون:

```text
Minimal
Scoped
Reviewable
Testable
Reversible
```

---

# 124. LARGE REFACTOR POLICY

إذا كان التغيير كبيرًا:

قسّمه إلى:

```text
Phase 1
Phase 2
Phase 3
```

وكل Phase يجب أن يبقى قابلاً للاختبار.

---

# 125. NO CASCADE DAMAGE

لا تسمح بتغيير صغير ينتج عنه Rewrite واسع دون Impact Report.

---

# 126. TEST FAILURE INTELLIGENCE

عند فشل test:

لا تكتفِ بـ:

```text
FAIL
```

حلل:

```text
Failure
Root Cause
Affected Area
Regression
Environment
Flaky?
Reproducible?
Fix
```

---

# 127. FLAKY TEST DETECTION

اختبر الاختبارات المتذبذبة عدة مرات.

إذا:

```text
PASS
FAIL
PASS
```

صنف:

```text
FLAKY
```

ولا تعتبره PASS موثوقًا.

---

# 128. TEST QUARANTINE

ممنوع إخفاء test.

إذا اضطررت إلى quarantine:

```text
Reason
Owner
Issue
Date
Impact
Replacement Plan
```

---

# 129. NO SNAPSHOT BLIND UPDATE

إذا فشل visual snapshot:

ممنوع:

```text
update snapshot
```

دون تحليل.

---

# 130. SECURITY FINDING LIFECYCLE

```text
DISCOVERED
↓
TRIAGED
↓
CONFIRMED
↓
FIXED
↓
REGRESSION TEST
↓
VERIFIED
↓
CLOSED
```

---

# 131. SEVERITY

استخدم:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

مع تعريفات واضحة.

---

# 132. RISK ACCEPTANCE

لا يتم تجاهل finding مهم دون:

```text
Reason
Scope
Owner
Expiration
Mitigation
```

---

# 133. SECURITY REGRESSION

كل Security Fix مهم يجب أن يضيف regression fixture.

---

# 134. BUSINESS REGRESSION

كل Business Logic Fix مهم يجب أن يضيف regression scenario.

---

# 135. PERFORMANCE REGRESSION

كل Performance optimization يجب أن يحتوي:

```text
Baseline
Change
After
Measurement
Environment
```

---

# 136. VISUAL REGRESSION

كل Visual improvement يجب أن يحتوي:

```text
Before Screenshot
After Screenshot
Viewport
Browser
Difference
Acceptance
```

---

# 137. ACCESSIBILITY REGRESSION

كل Accessibility fix يجب أن يحتوي test يثبت عدم عودة المشكلة.

---

# 138. RESPONSIVE REGRESSION

كل responsive fix يجب أن يختبر:

```text
Target viewport
Nearby viewports
Mobile
Tablet
Desktop
```

---

# 139. PERFORMANCE + SECURITY TRADEOFF

لا تقم بتحسين Performance إذا أدى إلى:

```text
Security Regression
Data Leakage
Auth Bypass
Cache Isolation Failure
```

---

# 140. UX + SECURITY TRADEOFF

سهولة الاستخدام لا تبرر:

```text
Weak Authentication
Weak Authorization
Sensitive Data Exposure
Unsafe Defaults
```

---

# 141. ACCESSIBILITY + DESIGN

لا تسمح بأن تكون الجمالية سببًا في:

```text
Poor Contrast
Tiny Text
Keyboard Failure
Motion Problems
```

---

# 142. MOTION ENGINE

كل animation يجب تقييمه:

```text
Purpose
Duration
Easing
Performance
Accessibility
Reduced Motion
Input Device
Mobile
```

التصنيف:

```text
KEEP
IMPROVE
SIMPLIFY
REPLACE
REMOVE
```

---

# 143. MOTION PERFORMANCE

تفضيل:

```text
transform
opacity
```

وتجنب layout thrashing.

راقب:

```text
Forced Reflow
Long Animation Frames
Excessive JS
Scroll Jank
```

---

# 144. REDUCED MOTION

احترم:

```text
prefers-reduced-motion
```

---

# 145. COMPONENT QUALITY

كل reusable component يجب أن يمتلك:

```text
API
Variants
States
Accessibility
Responsive behavior
Tests
Documentation
```

---

# 146. DESIGN TOKEN GOVERNANCE

لا تستخدم:

```text
Random Colors
Random Spacing
Random Radius
Random Shadows
```

دون سبب.

---

# 147. TOKEN DRIFT

اكتشف:

```text
Hard-coded colors
Hard-coded spacing
Duplicate typography
Inconsistent radius
```

---

# 148. INTERNATIONALIZATION

افحص:

```text
Translation
Fallback
Pluralization
Dates
Numbers
Currency
RTL
Text Expansion
```

---

# 149. LOCALIZATION REGRESSION

النصوص الطويلة يجب ألا تسبب:

```text
Overflow
Clipping
Broken Buttons
Broken Cards
```

---

# 150. DATA VALIDATION

Validation يجب أن تكون:

```text
Client
+
Server
```

لكن Server هو authoritative boundary.

---

# 151. INPUT NORMALIZATION

تعامل مع:

```text
Unicode
Whitespace
Case
Encoding
Unexpected Types
```

بحذر.

---

# 152. OUTPUT ENCODING

كل output يجب أن يكون context-appropriate:

```text
HTML
JS
URL
SQL
JSON
Headers
```

---

# 153. ERROR BOUNDARIES

Frontend يجب أن يمتلك Error Boundaries حيث يلزم.

Backend يجب أن يمتلك global error handling.

---

# 154. GRACEFUL DEGRADATION

إذا فشل service غير أساسي:

لا يجب أن ينهار النظام كاملًا دون ضرورة.

---

# 155. RETRY INTELLIGENCE

لا retry للعمليات غير idempotent بشكل أعمى.

يجب معرفة:

```text
Safe Retry
Unsafe Retry
Idempotency Required
Backoff
Timeout
Maximum Attempts
```

---

# 156. TIMEOUT GOVERNANCE

كل external call يجب أن يمتلك timeout مناسبًا.

---

# 157. CIRCUIT BREAKER

عند الحاجة:

```text
Closed
Open
Half-Open
```

---

# 158. QUEUE SAFETY

للـqueues:

```text
Retry
Dead Letter
Visibility Timeout
Idempotency
Ordering
Poison Message
```

---

# 159. EVENT SAFETY

الأحداث يجب أن تكون:

```text
Versioned
Validated
Idempotent where needed
Traceable
```

---

# 160. OBSERVABILITY CORRELATION

كل request مهم يجب أن يستطيع ربط:

```text
Request
→ API
→ Service
→ DB
→ Queue
→ External API
→ Log
```

---

# 161. ENGINEERING GRAPH BLAST RADIUS

عند تغيير symbol:

أظهر:

```text
Direct Impact
Indirect Impact
Tests
Security
Performance
Business Features
```

---

# 162. CHANGE PREVIEW

قبل التنفيذ يجب أن يستطيع WebForge إخراج:

```text
I intend to change:

X

Expected impact:

A
B
C

Required tests:

1
2
3
```

---

# 163. SAFE AUTONOMY LEVELS

أنشئ:

```text
LEVEL 0 — OBSERVE
LEVEL 1 — SUGGEST
LEVEL 2 — SAFE AUTO-FIX
LEVEL 3 — TESTED AUTO-FIX
LEVEL 4 — HIGH-RISK WITH APPROVAL
LEVEL 5 — PRODUCTION RESTRICTED
```

---

# 164. AUTONOMY POLICY

ليس كل project يسمح بنفس المستوى.

Project policy يحدد:

```text
Allowed autonomy
```

---

# 165. PROJECT CONSTRAINTS

قبل التعديل:

اكتشف:

```text
Budget
Runtime
Browser Support
Node Version
Database
Hosting
Deployment
Legal constraints if explicitly provided
Performance constraints
Accessibility requirements
```

---

# 166. NO UNREQUESTED SCOPE CREEP

لا تضف feature business جديدة إلا إذا كانت:

```text
Required
Explicitly requested
Necessary for correctness/security
```

---

# 167. SMART IMPROVEMENT

يمكن إضافة تحسينات غير مطلوبة فقط إذا كانت:

```text
Clearly beneficial
Low risk
Within scope
Traceable
Tested
```

---

# 168. PROJECT GOAL AWARENESS

كل مشروع يجب أن يمتلك:

```text
Project Goal
Users
Critical Flows
Constraints
Success Criteria
```

---

# 169. CRITICAL USER FLOWS

اكتشف تلقائيًا أو اطلب تعريف:

```text
Signup
Login
Core Feature
Checkout
Payment
Admin
Search
Create
Update
Delete
Logout
```

واعتبرها Regression-critical.

---

# 170. CRITICAL PATH ENGINE

كل مشروع يجب أن يمتلك:

```text
Critical Path
```

ويتم اختباره في كل Full Verification.

---

# 171. RELEASE CANDIDATE VERIFICATION

قبل release:

```text
FULL BUILD
FULL TEST
FULL SECURITY
FULL E2E
FULL VISUAL
FULL ACCESSIBILITY
FULL PERFORMANCE
FULL REGRESSION
```

---

# 172. FINAL VERIFICATION MATRIX

أنشئ:

```text
Area
Status
Command
Environment
Evidence
Limitations
Risk
```

---

# 173. FINAL STATUS

استخدم فقط:

```text
VERIFIED
PARTIALLY VERIFIED
NOT VERIFIED
BLOCKED
NOT TESTED — ENVIRONMENT LIMITATION
```

---

# 174. NEVER USE "PASS" WITHOUT SCOPE

مثال:

خطأ:

```text
Security: PASS
```

الصحيح:

```text
Security static analysis: PASS
Browser security flows: PASS
DAST: NOT RUN
Production telemetry: NOT AVAILABLE
```

---

# 175. FINAL REPORTS

يجب إنشاء:

```text
reports/
├── PROJECT_BASELINE.md
├── PROJECT_CAPABILITIES.md
├── PROJECT_INTELLIGENCE.md
├── ARCHITECTURE_REPORT.md
├── SECURITY_REPORT.md
├── DATABASE_REPORT.md
├── API_REPORT.md
├── FRONTEND_REPORT.md
├── UX_UI_REPORT.md
├── RESPONSIVE_REPORT.md
├── ACCESSIBILITY_REPORT.md
├── PERFORMANCE_REPORT.md
├── BUSINESS_LOGIC_REPORT.md
├── CONCURRENCY_REPORT.md
├── DEPENDENCY_REPORT.md
├── AI_SECURITY_REPORT.md
├── VISUAL_REGRESSION_REPORT.md
├── CHANGE_IMPACT_REPORT.md
├── REGRESSION_REPORT.md
├── BEFORE_AFTER_METRICS.md
├── EVIDENCE_INDEX.md
├── TECHNICAL_DEBT_REPORT.md
├── ARCHITECTURE_DRIFT_REPORT.md
├── DOCUMENTATION_DRIFT_REPORT.md
├── FINAL_VERIFICATION.md
└── PROJECT_REENGINEERING_FINAL.md
```

---

# 176. MACHINE-READABLE REPORTS

بالإضافة إلى Markdown:

أنشئ structured output عند الحاجة:

```text
JSON
```

مثلاً:

```json
{
  "status": "PARTIALLY_VERIFIED",
  "critical_findings": [],
  "high_findings": [],
  "tests": {},
  "evidence": {},
  "limitations": []
}
```

---

# 177. EVIDENCE INDEX

كل evidence يجب أن يمتلك:

```text
ID
Claim
Command
Artifact
Result
Timestamp
Environment
Confidence
```

---

# 178. REPRODUCIBILITY

كل نتيجة مهمة يجب أن تكون قابلة لإعادة التنفيذ.

---

# 179. COMMAND REGISTRY

أنشئ registry للأوامر:

```text
build
test
verify
security
e2e
browser
visual
accessibility
performance
database
benchmark
audit
reengineer
```

---

# 180. ONE-COMMAND VERIFICATION

وفّر:

```bash
webforge verify
```

لكن لا تجعل command مجرد wrapper وهمي.

يجب أن ينفذ فعليًا ما يعلنه.

---

# 181. ONE-COMMAND PROJECT AUDIT

وفّر:

```bash
webforge audit
```

لتشغيل intelligence audit.

---

# 182. ONE-COMMAND REENGINEERING

وفّر:

```bash
webforge reengineer
```

مع modes:

```text
--audit
--safe
--auto
--security
--performance
--ui
--responsive
--full
```

---

# 183. ONE-COMMAND REPORT

وفّر:

```bash
webforge report
```

---

# 184. ONE-COMMAND BASELINE

وفّر:

```bash
webforge baseline
```

---

# 185. ONE-COMMAND REGRESSION

وفّر:

```bash
webforge regression
```

---

# 186. ONE-COMMAND BENCHMARK

وفّر:

```bash
webforge benchmark
```

---

# 187. COMMAND EXIT CODES

حدد exit codes واضحة.

مثلاً:

```text
0 SUCCESS
1 TEST FAILURE
2 SECURITY FAILURE
3 BUILD FAILURE
4 CONFIGURATION FAILURE
5 ENVIRONMENT LIMITATION
6 POLICY BLOCK
7 REGRESSION
8 INTERNAL ERROR
```

---

# 188. AUTOMATION

لا تجعل المستخدم يشغل:

```text
10 commands
```

يدويًا كل مرة إذا كان من الممكن دمجها بأمان.

---

# 189. SMART TEST SELECTION

شغل impacted tests أولًا.

ثم full regression قبل release.

---

# 190. CACHING TEST RESULTS

يمكن caching للنتائج فقط إذا كان:

```text
Inputs unchanged
Code unchanged
Environment compatible
Dependencies unchanged
```

وإلا يجب إعادة الاختبار.

---

# 191. NO FALSE CACHE

لا تستخدم cached result بعد تغيير code أو environment المؤثر.

---

# 192. BENCHMARK HISTORY

احتفظ:

```text
Baseline
Current
Trend
Regression
Improvement
```

---

# 193. PERFORMANCE TREND

إذا أصبح:

```text
2.1s
2.3s
2.8s
3.4s
```

يجب اكتشاف regression trend.

---

# 194. SECURITY TREND

إذا زادت findings:

```text
5
→
8
→
13
```

يجب إظهار Security Drift.

---

# 195. TECHNICAL DEBT TREND

لا تسمح بزيادة debt دون visibility.

---

# 196. CODE HEALTH SCORE

يمكن تقديم score داخلي، لكن يجب أن يكون:

```text
Transparent
Evidence-backed
Area-specific
Not a certification
```

---

# 197. NO SINGLE MAGIC SCORE

لا تختصر المشروع في:

```text
92%
```

فقط.

يجب إظهار المجالات منفصلة.

---

# 198. SYSTEM MATURITY

يمكن استخدام:

```text
L0
L1
L2
L3
L4
L5
```

لكن يجب تعريف كل مستوى بالأدلة.

---

# 199. REFERENCE APPLICATION

أنشئ:

```text
apps/reference/
```

يحتوي مشروعًا حقيقيًا يمثل أفضل استخدام لـWebForge.

يجب أن يحتوي:

```text
Frontend
Backend
PostgreSQL
Redis
Auth
RBAC
Tenant Isolation
API Contracts
State Machine
Payment Adapter
Observability
Playwright
Accessibility
Security
CI
```

---

# 200. REFERENCE APPLICATION AS TEST BED

لا تستخدم reference app للعرض فقط.

استخدمه كـ:

```text
Integration Test Bed
Regression Bed
Performance Bed
Security Bed
Benchmark Bed
```

---

# 201. INTENTIONALLY BROKEN REFERENCE MODE

يجب أن يستطيع WebForge إدخال أخطاء متعمدة إلى reference project واختبار قدرته على اكتشافها.

---

# 202. SELF-IMPROVEMENT BENCHMARK

عند إضافة capability جديدة:

اختبر:

```text
Before Capability
After Capability
```

ولا تعتبرها ناجحة إلا إذا حسّنت detection/verification فعليًا.

---

# 203. PLUGIN / ADAPTER ARCHITECTURE

WebForge يجب أن يكون extensible.

Adapters:

```text
Framework
Database
Cache
Cloud
CI
Browser
AI Agent
Testing Tool
Security Tool
Observability
```

---

# 204. TOOL ABSTRACTION

لا تربط core بالكامل بأداة واحدة.

مثال:

```text
BrowserAdapter
```

يمكن أن يستخدم:

```text
Playwright
```

مع إمكانية adapter مستقبلي.

---

# 205. TOOL CAPABILITY DETECTION

اكتشف الأداة قبل استخدامها.

---

# 206. TOOL FAILURE HANDLING

إذا فشلت الأداة:

```text
Record
Reason
Fallback
Limitation
```

ولا تدّعِ نجاحًا.

---

# 207. EXTERNAL REFERENCE POLICY

عند استخدام مصادر تصميم أو هندسة:

لا تنسخ.

استخدم:

```text
Research
Pattern extraction
Synthesis
```

---

# 208. SOURCE REGISTRY

كل external reference مهم:

```text
Name
URL
Purpose
Date
License if known
Usage
```

---

# 209. LICENSE AWARENESS

لا تدخل asset/code غير واضح الترخيص إليه دون تسجيل المخاطر.

---

# 210. SECURITY TOOLING

عند توفر البيئة، استخدم ما يناسب:

```text
SAST
DAST
Dependency Scanner
Secret Scanner
Container Scanner
Browser Testing
Lighthouse
OWASP ZAP
Semgrep
```

لكن لا تدّعي تشغيل أداة لم يتم تشغيلها.

---

# 211. STATIC ANALYSIS

تحقق من:

```text
Types
Syntax
Lint
Security Patterns
Imports
Exports
Dead Code
Complexity
```

---

# 212. BUILD VERIFICATION

Build يجب أن يكون clean قدر الإمكان.

سجل:

```text
Warnings
Errors
Duration
Output
```

---

# 213. STARTUP VERIFICATION

شغل التطبيق فعليًا عندما يكون ذلك ممكنًا.

تحقق من:

```text
Startup
Health
Readiness
Shutdown
```

---

# 214. GRACEFUL SHUTDOWN

تحقق من:

```text
SIGTERM
SIGINT
Active Requests
DB
Redis
Queues
WebSockets
```

---

# 215. SECURITY STARTUP

إذا كان secret/config/security requirement مفقودًا:

يجب fail fast عندما يكون required.

---

# 216. SAFE DEFAULTS

كل component جديد يجب أن يستخدم:

```text
Secure Default
```

---

# 217. FAIL CLOSED

في security-critical authorization:

```text
Unknown
Failure
Unavailable
```

لا تعني:

```text
ALLOW
```

---

# 218. FAIL OPEN EXCEPTIONS

لا تسمح إلا إذا كان القرار موثقًا وآمنًا ومقصودًا.

---

# 219. DATA INTEGRITY

كل critical mutation يجب أن يكون:

```text
Atomic
Validated
Authorized
Audited
Recoverable
```

---

# 220. TRANSACTION GOVERNANCE

لا تجعل transaction أكبر من اللازم.

ولا تقطع transaction حيث تحتاج atomicity.

---

# 221. N+1 DETECTION

اكتشف:

```text
Query in loop
Repeated DB call
Repeated API call
Repeated rendering
```

---

# 222. API N+1

ليس فقط DB.

اكتشف أيضًا:

```text
Frontend → API → repeated requests
```

---

# 223. NETWORK INTELLIGENCE

اكتشف:

```text
Duplicate Requests
Waterfall
Unused Requests
Large Payloads
Blocking Resources
```

---

# 224. CACHE / PREFETCH

لا تضف caching/prefetching إذا أدى إلى stale sensitive data.

---

# 225. BUNDLE INTELLIGENCE

اكتشف:

```text
Duplicate Dependencies
Huge Packages
Unused Code
Poor Tree Shaking
Missing Code Splitting
```

---

# 226. JAVASCRIPT EXECUTION

ابحث عن:

```text
Long Tasks
Heavy Parsing
Heavy Hydration
Repeated Computation
Unnecessary Renders
```

---

# 227. SERVER PERFORMANCE

افحص:

```text
CPU
Memory
Event Loop
I/O
DB
Cache
External APIs
```

---

# 228. DATABASE PERFORMANCE

استخدم query plans عند توفر DB حقيقي.

---

# 229. LOAD TESTING

عند توفر بيئة مناسبة:

اختبر:

```text
Baseline
Normal Load
Peak Load
Burst
Concurrency
```

---

# 230. RATE / CAPACITY

حدد:

```text
RPS
Concurrency
Latency
Error Rate
```

---

# 231. RESOURCE GOVERNANCE

ضع limits مناسبة:

```text
CPU
Memory
File Size
Request Size
Timeout
Query Time
Queue Size
```

---

# 232. DOS RESILIENCE

اختبر الموارد ضد abuse.

---

# 233. SECURITY + PERFORMANCE

أي security control يجب ألا يسبب degradation غير مقبول دون قياس.

---

# 234. FULL PROJECT REENGINEERING

عند تشغيل:

```bash
webforge reengineer --full
```

نفذ:

```text
1 Discover
2 Understand
3 Baseline
4 Architecture
5 Security
6 Database
7 API
8 Business Logic
9 Frontend
10 UX/UI
11 Responsive
12 Accessibility
13 Animation
14 Performance
15 Dependencies
16 Infrastructure
17 Testing
18 Browser
19 Visual
20 Regression
21 Evidence
22 Report
```

---

# 235. FIX PRIORITY

الأولوية:

```text
BLOCKER
CRITICAL
HIGH
MEDIUM
LOW
```

ثم:

```text
Security
Data Integrity
Correctness
Reliability
Performance
Accessibility
UX
Design Polish
```

---

# 236. SAFE BATCHING

لا تغير 50 نظامًا مرة واحدة إذا كان ذلك يمنع تحديد سبب regression.

قسّم التغييرات إلى batches قابلة للتحقق.

---

# 237. ATOMIC IMPROVEMENT UNITS

كل batch:

```text
Goal
Scope
Expected Result
Tests
Evidence
Rollback
```

---

# 238. FAILURE TRIAGE

عند failure:

```text
Is it code?
Is it test?
Is it environment?
Is it flaky?
Is it dependency?
Is it infrastructure?
```

---

# 239. NEVER PATCH TEST TO HIDE BUG

ممنوع تعديل test فقط لجعلها PASS إلا إذا كان test نفسه خاطئًا والدليل موجود.

---

# 240. NEVER DISABLE SECURITY CHECKS

ممنوع:

```text
disable
skip
ignore
suppress
```

بدون policy + evidence.

---

# 241. NEVER SILENCE WARNINGS BLINDLY

يجب فهم warning أولًا.

---

# 242. SNAPSHOT GOVERNANCE

Snapshot changes يجب مراجعتها كأي code change.

---

# 243. TEST DATA

استخدم test data:

```text
Safe
Deterministic
Isolated
Reproducible
```

---

# 244. PRODUCTION DATA

لا تستخدم production secrets/data في الاختبارات دون policy واضحة.

---

# 245. TENANT TEST DATA

اختبر tenant isolation باستخدام أكثر من tenant.

---

# 246. SECURITY FIXTURE LIBRARY

أنشئ reusable fixtures للأخطاء الأمنية.

---

# 247. REGRESSION FIXTURE LIBRARY

كل bug مهم يدخل library.

---

# 248. ENGINEERING KNOWLEDGE BASE

احتفظ بالمعرفة القابلة لإعادة الاستخدام:

```text
Patterns
Anti-Patterns
Fixes
Tests
Benchmarks
Failures
```

---

# 249. NO DUPLICATE KNOWLEDGE

إذا كان هناك canonical rule:

لا تنشئ نسخة متضاربة منه.

---

# 250. RULE CONFLICT ENGINE

عند تعارض rules:

```text
P0 Security
>
P1 Constitution
>
P2 Requirements
>
P3 Design Preference
```

ويجب تسجيل القرار.

---

# 251. GOVERNANCE HIERARCHY

اعتمد hierarchy واضحة.

لا تسمح لقاعدة تصميمية أن تتغلب على security.

---

# 252. POLICY ENGINE

يجب أن تكون policies executable عندما يكون ذلك ممكنًا.

---

# 253. COMPLIANCE ENGINE

افحص:

```text
Requirement
Rule
Implementation
Test
Evidence
```

---

# 254. TRACEABILITY ENGINE

أي claim مهم يجب ربطه إلى:

```text
Source
Implementation
Test
Evidence
```

---

# 255. DECISION MEMORY

احتفظ بـ:

```text
Decision
Context
Alternatives
Reason
Consequences
Date
```

---

# 256. ARCHITECTURE DECISION RECORDS

أي تغيير architectural مهم ينتج ADR.

---

# 257. DESIGN DECISION RECORDS

أي تغيير design-system مهم يجب أن يكون قابلًا للتتبع.

---

# 258. SECURITY DECISION RECORDS

الاستثناءات الأمنية تحتاج توثيقًا.

---

# 259. PERFORMANCE DECISION RECORDS

Optimization مهم يجب أن يذكر:

```text
Problem
Hypothesis
Change
Measurement
Result
Tradeoff
```

---

# 260. AUTOMATIC REPORT GENERATION

في نهاية المهمة:

أنشئ التقارير المطلوبة دون انتظار المستخدم.

---

# 261. REPORT QUALITY

التقرير يجب أن يجيب:

```text
What is implemented?
What is integrated?
What is verified?
What is simulated?
What is missing?
What is risky?
What changed?
What improved?
What regressed?
What remains?
```

---

# 262. EXECUTIVE SUMMARY

يجب أن يكون مختصرًا.

لكن التفاصيل تبقى في التقارير المتخصصة.

---

# 263. TECHNICAL APPENDIX

يجب تضمين:

```text
Commands
Test Results
Artifacts
Environment
Versions
Failures
Limitations
```

---

# 264. EXACT COMMANDS

كل test مهم يجب أن يسجل command.

---

# 265. ENVIRONMENT SNAPSHOT

سجل:

```text
OS
Node
Package Manager
DB
Redis
Browser
Docker
Git
```

---

# 266. VERSION PINNING

عند الحاجة ثبت versions لتقليل non-determinism.

---

# 267. REPRODUCIBLE TESTS

اختبارات يجب أن تكون deterministic قدر الإمكان.

---

# 268. CLOCK / RANDOMNESS

عند الحاجة استخدم controlled:

```text
Time
Randomness
UUID
External APIs
```

---

# 269. NETWORK CONTROL

اختبارات يجب ألا تعتمد على internet بشكل غير ضروري.

---

# 270. EXTERNAL SERVICE CONTRACTS

استخدم sandbox/mock فقط عندما يكون مناسبًا، وميّز ذلك بوضوح عن live integration.

---

# 271. LIVE INTEGRATION TESTS

عند توفر sandbox حقيقي:

اختبر integration حقيقي.

---

# 272. PRODUCTION PARITY

كلما اقتربت test environment من production كان الدليل أقوى.

لكن يجب ذكر الاختلافات.

---

# 273. DEPLOYMENT SMOKE

بعد deployment:

```text
Health
Auth
Critical Flow
API
Database
Cache
Monitoring
```

---

# 274. POST-DEPLOY VERIFICATION

تحقق من:

```text
Error Rate
Latency
Logs
Health
Critical User Flow
```

---

# 275. INCIDENT LEARNING

إذا حدث failure:

```text
Incident
Root Cause
Fix
Regression Test
Rule
Memory
```

---

# 276. CONTINUOUS AUDIT

يمكن تشغيل:

```text
Daily
CI
Pre-release
Post-deploy
```

بحسب المشروع.

---

# 277. DRIFT MONITORING

راقب:

```text
Architecture
Dependencies
Security
Performance
Design
Documentation
Configuration
```

---

# 278. SECURITY MEMORY

لا تسمح بعودة vulnerability تم إصلاحها.

---

# 279. PERFORMANCE MEMORY

احتفظ بالـbaseline التاريخي.

---

# 280. VISUAL MEMORY

احتفظ بالصور المرجعية المهمة.

---

# 281. ACCESSIBILITY MEMORY

احتفظ بالإصلاحات السابقة.

---

# 282. AUTOMATIC REGRESSION GENERATION

إذا تم اكتشاف bug جديد:

حاول إنشاء test آلي له.

---

# 283. REGRESSION CONFIDENCE

لا تعتبر regression test جيدًا إلا إذا فشل عند إدخال mutation المناسبة عندما يكون ذلك ممكنًا.

---

# 284. QUALITY OF TESTS

لا تقيس:

```text
Number of tests
```

فقط.

قِس:

```text
Coverage
Mutation Score
Critical Flow Coverage
Failure Detection
Regression Protection
```

---

# 285. TEST COVERAGE

استخدم coverage كمؤشر وليس كحقيقة وحيدة.

---

# 286. CRITICAL PATH COVERAGE

يجب أن تكون critical flows ذات coverage أعلى.

---

# 287. SECURITY COVERAGE

قِس coverage على مستوى controls وليس الملفات فقط.

---

# 288. REQUIREMENT COVERAGE

كل requirement مهم يجب أن يرتبط باختبار.

---

# 289. EVIDENCE COVERAGE

كل claim مهم يجب أن يرتبط evidence.

---

# 290. UNVERIFIED CLAIM DETECTOR

ابحث في docs/reports عن:

```text
verified
secure
complete
production-ready
tested
implemented
```

ثم تحقق من evidence.

---

# 291. CLAIM AUDITOR

إذا لم يوجد evidence:

```text
CLAIM UNVERIFIED
```

---

# 292. REPORT CONSISTENCY

قارن التقارير السابقة مع الواقع.

اكتشف:

```text
Old Claim
Actual State
Difference
```

---

# 293. PRIOR REPORT RECONCILIATION

التقارير السابقة تستخدم:

```text
Baseline
```

وليست truth.

---

# 294. KNOWN ISSUES FROM CURRENT WEBFORGE BASELINE

يجب إعادة فحص وإصلاح ما يلي على الأقل:

```text
CLI signature mismatches
Smoke test without assertions
In-memory DB default
In-memory Redis default
Missing real PostgreSQL verification
Missing real Redis verification
Missing real Playwright/Chromium verification
Missing screenshot regression
Payment simulation vs real sandbox
Docker entrypoint mismatch
Missing CI workflows
Documentation drift
```

## هذه النقاط وردت في التقرير السابق ويجب عدم افتراض أنها ما زالت موجودة أو أنها أُصلحت؛ يجب التحقق منها فعليًا.

# 295. WEBFORGE SELF-INTEGRATION

WebForge يجب أن يستخدم WebForge للتحقق من WebForge حيثما كان ذلك ممكنًا.

لكن لا تعتمد على circular self-validation فقط.

استخدم:

```text
Independent Fixtures
Mutation
Known Broken Projects
External Tools
```

---

# 296. REFERENCE PROJECT MATRIX

احتفظ بعدة reference projects:

```text
Ecommerce
SaaS
LMS
Dashboard
Marketplace
Corporate
Fintech-like
Multi-tenant
AI Application
```

---

# 297. FRAMEWORK ADAPTERS

عند الحاجة:

```text
React
Next.js
Vue
Nuxt
Svelte
SvelteKit
Angular
Node
Express
Fastify
NestJS
```

لا تفرض Framework واحدًا على WebForge.

---

# 298. DATABASE ADAPTERS

على الأقل architecture يسمح:

```text
PostgreSQL
MySQL
SQLite
```

مع PostgreSQL كمرجع قوي.

---

# 299. CACHE ADAPTERS

دعم abstraction لـ:

```text
Redis
Memory
```

لكن memory لا يمثل production Redis.

---

# 300. OBSERVABILITY ADAPTERS

يمكن دعم:

```text
OpenTelemetry
Prometheus
Sentry-like systems
Structured logs
```

---

# 301. BROWSER ADAPTER

Browser verification يجب أن يكون abstraction وليس hard-coded بالكامل.

---

# 302. SECURITY ADAPTER

Security tools يجب أن تكون قابلة للاستبدال.

---

# 303. PROJECT PROFILE

أنشئ:

```text
PROJECT_PROFILE
```

يتضمن:

```text
Stack
Architecture
Criticality
Users
Data Sensitivity
Security Profile
Performance Profile
Browser Requirements
Deployment
Constraints
```

---

# 304. SECURITY PROFILE

مثلاً:

```text
PUBLIC
INTERNAL
SENSITIVE
HIGHLY SENSITIVE
PAYMENT
HEALTH
FINANCIAL
MULTI-TENANT
AI AGENT
```

بحسب ما يحدده المشروع.

---

# 305. ADAPTIVE VERIFICATION

لا تشغل نفس الاختبارات لكل مشروع.

WebForge يحدد:

```text
Project Type
Risk
Surface
Criticality
```

ثم يبني verification plan.

---

# 306. VERIFICATION PLAN GENERATOR

يولد:

```text
Required Tests
Recommended Tests
Optional Tests
Unavailable Tests
```

---

# 307. TEST COST OPTIMIZATION

هدف النظام:

```text
Maximum Confidence
with
Minimum Unnecessary Repetition
```

ليس:

```text
Run Everything 20 Times
```

---

# 308. INTELLIGENT RETESTING

إذا تغير CSS فقط:

لا تعيد DB migrations بلا سبب.

إذا تغير auth:

شغل auth/security/critical browser flows.

إذا تغير DB schema:

شغل migration/data/API/business regression.

---

# 309. FULL REGRESSION POLICY

Full regression مطلوب:

```text
Before release
After high-risk architecture change
After auth change
After payment change
After DB migration with broad impact
```

---

# 310. RETEST LOOP

إذا فشل:

```text
Fix
→ Targeted Test
→ Full Impact Test
→ Regression
```

ولا تكرر كل الاختبارات عشوائيًا دون سبب.

---

# 311. ROOT CAUSE FIRST

لا تصلح symptoms فقط.

ابحث عن:

```text
Root Cause
```

---

# 312. FIVE WHYS

عند المشاكل المتكررة استخدم root-cause analysis.

---

# 313. SYSTEMIC FIX

إذا كان الخطأ ناتجًا عن:

```text
Missing Rule
```

أضف rule.

إذا كان:

```text
Missing Test
```

أضف test.

إذا كان:

```text
Missing Architecture Boundary
```

أضف architecture gate.

---

# 314. PREVENTION OVER REPAIR

الأفضل:

```text
Detect
→ Prevent
```

بدل:

```text
Detect
→ Repair forever
```

---

# 315. SECURITY PREVENTION

Security controls يجب أن تكون:

```text
Default
Centralized
Reusable
Tested
Enforced
```

---

# 316. DESIGN PREVENTION

Design tokens تمنع drift.

---

# 317. API PREVENTION

Contracts تمنع API drift.

---

# 318. DB PREVENTION

Migrations + constraints تمنع data drift.

---

# 319. ARCHITECTURE PREVENTION

Architecture tests تمنع drift.

---

# 320. TEST PREVENTION

Regression tests تمنع recurrence.

---

# 321. FINAL SYSTEM PHILOSOPHY

WebForge ليس:

```text
Prompt Collection
```

وليس:

```text
AI Code Generator
```

وليس:

```text
Static Checklist
```

بل:

```text
Engineering Intelligence + Governance + Execution + Verification Platform
```

---

# 322. FINAL ARCHITECTURE

يجب أن تصبح الصورة النهائية تقريبًا:

```text
                           WEBFORGE OS
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
 PROJECT INTELLIGENCE     ENGINEERING GOVERNANCE     AI AGENT CONTROL
        │                       │                        │
        ▼                       ▼                        ▼
 Semantic Map             Rules / Policies         Permissions
 Dependency Graph         Conflicts                Risk
 Feature Graph            Compliance               Approval
 Data Flow                Traceability             Audit
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                ▼
                         RISK & IMPACT ENGINE
                                │
             ┌──────────────────┼───────────────────┐
             ▼                  ▼                   ▼
        Security           Architecture         Business
             ▼                  ▼                   ▼
        Database              API                 State
             ▼                  ▼                   ▼
        Frontend             UX/UI             Performance
             └──────────────────┼───────────────────┘
                                ▼
                         IMPROVEMENT ENGINE
                                │
                         Safe Change Plan
                                │
                                ▼
                            EXECUTION
                                │
                ┌───────────────┼────────────────┐
                ▼               ▼                ▼
             Build           Static           Runtime
                ▼               ▼                ▼
             Unit          Integration       Browser
                ▼               ▼                ▼
             API             Database         Visual
                ▼               ▼                ▼
          Accessibility     Security       Performance
                └───────────────┼────────────────┘
                                ▼
                         REGRESSION ENGINE
                                │
                                ▼
                        BEFORE / AFTER
                                │
                                ▼
                         EVIDENCE ENGINE
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                      ACCEPT        ROLLBACK
                         │
                         ▼
                  ENGINEERING MEMORY
                         │
                         ▼
                CONTINUOUS IMPROVEMENT
```

---

# 323. IMPLEMENTATION RULE

لا تحاول تنفيذ كل شيء في ملف واحد.

قسّم implementation إلى packages واضحة.

مثال:

```text
packages/
├── project-intelligence/
├── semantic-graph/
├── dependency-graph/
├── feature-graph/
├── impact-analysis/
├── risk-engine/
├── architecture-intelligence/
├── security/
├── security-governance/
├── privacy/
├── ai-security/
├── contracts/
├── api-intelligence/
├── database-intelligence/
├── cache-intelligence/
├── state-machine/
├── business-logic/
├── testing-engine/
├── mutation-testing/
├── fuzzing/
├── chaos/
├── browser-engine/
├── visual-regression/
├── accessibility/
├── responsive/
├── performance/
├── design-intelligence/
├── animation/
├── dependency-intelligence/
├── observability/
├── evidence/
├── regression/
├── engineering-memory/
├── release-engine/
├── benchmark/
├── orchestration/
└── maturity/
```

لا تنشئ package إذا كان equivalent موجودًا.

---

# 324. DIRECTORY GOVERNANCE

كل package يجب أن يحتوي حسب الحاجة:

```text
src/
tests/
fixtures/
README.md
```

والـREADME يشرح:

```text
Purpose
Public API
Dependencies
Integration
Tests
Limitations
```

---

# 325. INTERNAL API CONTRACT

كل package يجب أن يمتلك stable internal contract.

---

# 326. NO GOD OBJECT

لا تنشئ class واحدة تدير كل WebForge.

استخدم modular architecture.

---

# 327. NO GOD PACKAGE

لا تجمع كل شيء في package واحدة.

---

# 328. DEPENDENCY DIRECTION

يجب الحفاظ على اتجاه dependencies.

---

# 329. CORE MUST REMAIN STABLE

Core contracts يجب ألا تعتمد على domain-specific implementation.

---

# 330. DOMAIN EXTENSIONS

Ecommerce/LMS/SaaS وغيرها يجب أن تكون extensions فوق core.

---

# 331. SECURITY CORE

Security primitives يجب أن تكون مركزية.

---

# 332. TESTING CORE

Testing utilities يجب أن تكون reusable.

---

# 333. EVIDENCE CORE

Evidence يجب أن يكون centralized.

---

# 334. REGRESSION CORE

Regression storage/execution centralized.

---

# 335. MEMORY CORE

Engineering memory centralized.

---

# 336. BENCHMARK CORE

Benchmark framework centralized.

---

# 337. VERSIONING

Version:

```text
Core
Rules
Policies
Adapters
Schemas
Evidence
Benchmarks
```

بحسب الحاجة.

---

# 338. MIGRATION SYSTEM

أي تغيير breaking يجب أن يمتلك migration path.

---

# 339. COMPATIBILITY MATRIX

أنشئ:

```text
WebForge Version
Node Version
Browser
DB
Redis
Framework
Adapter
```

---

# 340. INSTALLATION

يجب أن يكون تشغيل WebForge واضحًا.

---

# 341. BOOTSTRAP

أنشئ bootstrap يقوم بـ:

```text
Detect
Configure
Validate
Generate Capability Report
```

---

# 342. PROJECT ONBOARDING

عند إضافة WebForge إلى مشروع:

```bash
webforge init
```

يجب أن:

```text
Detect project
Generate profile
Generate baseline plan
Generate capabilities
```

---

# 343. PROJECT AUDIT

```bash
webforge audit
```

---

# 344. PROJECT IMPROVEMENT

```bash
webforge improve
```

---

# 345. PROJECT REENGINEERING

```bash
webforge reengineer
```

---

# 346. SECURITY AUDIT

```bash
webforge security
```

---

# 347. FULL VERIFICATION

```bash
webforge verify --full
```

---

# 348. REPORT

```bash
webforge report
```

---

# 349. BENCHMARK

```bash
webforge benchmark
```

---

# 350. CI

```bash
webforge ci
```

---

# 351. DO NOT STOP AT ANALYSIS

إذا اكتشفت مشكلة قابلة للإصلاح:

لا تكتفِ بالتقرير.

في وضع التنفيذ المصرح به:

```text
Analyze
→ Fix
→ Test
→ Verify
```

---

# 352. DO NOT FIX WITHOUT UNDERSTANDING

لا تصلح مشكلة دون معرفة root cause قدر الإمكان.

---

# 353. DO NOT CHANGE UNRELATED FILES

ابقَ داخل scope.

---

# 354. DO NOT DELETE FUNCTIONALITY

إلا إذا:

```text
Deprecated
Unused
Dangerous
Replaced
Explicitly requested
```

ويجب تسجيل السبب.

---

# 355. FINAL SELF-AUDIT

بعد التنفيذ:

أعد فحص WebForge نفسه.

تحقق من:

```text
Build
Tests
CLI
Packages
Imports
Architecture
Security
Dependencies
Docs
Reports
```

---

# 356. FINAL DUPLICATION AUDIT

ابحث مرة أخرى عن duplicate implementations.

---

# 357. FINAL DEAD CODE AUDIT

ابحث عن:

```text
Unused
Unreachable
Old
Deprecated
Temporary
```

---

# 358. FINAL TODO AUDIT

لا تترك TODOs حرجة دون تسجيل.

---

# 359. FINAL STUB AUDIT

لا تترك:

```text
throw new Error("not implemented")
```

أو fake implementations في critical paths دون declaration.

---

# 360. FINAL MOCK AUDIT

حدد كل:

```text
Mock
Stub
Simulation
```

وأين يتم استخدامه.

---

# 361. FINAL REALITY AUDIT

أنشئ جدول:

```text
Claim
Actual Implementation
Integration
Runtime Verification
Evidence
Confidence
```

---

# 362. FINAL COMPLETENESS AUDIT

لا تستخدم:

```text
100%
```

بل:

```text
Implemented
Integrated
Verified
Partially Verified
Not Verified
Blocked
```

---

# 363. FINAL GAP MATRIX

لكل gap:

```text
ID
Area
Severity
Description
Evidence
Impact
Fix
Status
Regression Test
```

---

# 364. FINAL RISK MATRIX

لكل risk:

```text
Likelihood
Impact
Severity
Mitigation
Owner
Status
```

---

# 365. FINAL PRIORITY MATRIX

```text
P0 Immediate
P1 Critical
P2 Important
P3 Improvement
P4 Optional
```

---

# 366. FINAL ROADMAP

إذا بقيت gaps:

```text
Now
Next
Later
```

---

# 367. FINAL VERIFICATION STATUS

لا تكتب:

```text
COMPLETE
```

إلا إذا كان كل requirement داخل scope:

```text
Implemented
Integrated
Tested
Verified
Documented
```

---

# 368. FINAL COMMAND VERIFICATION

نفذ فعليًا أهم commands.

لا تكتب commands لم يتم تشغيلها وكأنها نتائج.

---

# 369. FINAL EVIDENCE

كل result يجب أن يحتوي artifact حيثما أمكن.

---

# 370. FINAL DELIVERY

بعد الانتهاء أعطني:

```text
1. What changed
2. What was fixed
3. What was added
4. What was verified
5. What was not verified
6. Security status
7. Performance status
8. UX/UI status
9. Responsive status
10. Accessibility status
11. Database status
12. API status
13. Browser status
14. Visual status
15. Regression status
16. Remaining risks
17. Remaining limitations
18. Exact commands executed
19. Evidence locations
20. Final recommendation
```

---

# 371. EXECUTION DIRECTIVE

ابدأ الآن.

لا تبدأ بكتابة تقرير طويل قبل فحص المشروع.

نفذ بالترتيب:

```text
DISCOVER
UNDERSTAND
BASELINE
COMPARE
MODEL
ANALYZE
PLAN
IMPLEMENT
BUILD
TEST
VERIFY
COMPARE
REGRESSION
EVIDENCE
AUDIT
REPORT
```

---

# 372. CRITICAL DIRECTIVE

إذا وجدت أن WebForge يحتوي بالفعل على نظام يؤدي الوظيفة المطلوبة:

```text
DO NOT DUPLICATE IT
```

بل:

```text
INSPECT
INTEGRATE
EXTEND
HARDEN
TEST
```

---

# 373. CRITICAL DIRECTIVE

إذا وجدت أن تقريرًا سابقًا يقول:

```text
PASS
```

لا تعتمد عليه.

أعد التحقق.

---

# 374. CRITICAL DIRECTIVE

إذا وجدت:

```text
MOCK
```

حددها بوضوح.

---

# 375. CRITICAL DIRECTIVE

إذا وجدت:

```text
STATIC ONLY
```

لا تعتبرها Runtime Verification.

---

# 376. CRITICAL DIRECTIVE

إذا وجدت:

```text
HTTP E2E
```

لا تعتبرها Browser Verification.

---

# 377. CRITICAL DIRECTIVE

إذا لم يتوفر:

```text
Playwright/Chromium
```

سجل:

```text
Browser Verification Blocked
```

ولا تدّعِ نجاحها.

---

# 378. CRITICAL DIRECTIVE

إذا لم يتوفر PostgreSQL حقيقي:

لا تدّعِ:

```text
PostgreSQL Verified
```

---

# 379. CRITICAL DIRECTIVE

إذا لم يتوفر Redis حقيقي:

لا تدّعِ:

```text
Redis Production Verified
```

---

# 380. CRITICAL DIRECTIVE

إذا كان Payment مجرد simulation:

اكتب:

```text
PAYMENT SIMULATION
```

ولا تسميه production payment integration.

---

# 381. CRITICAL DIRECTIVE

إذا وجدت Docker/config mismatch:

أصلحه واختبره.

---

# 382. CRITICAL DIRECTIVE

إذا وجدت CLI mismatch:

أصلحه واختبر كل command.

---

# 383. CRITICAL DIRECTIVE

إذا وجدت smoke tests بلا assertions:

حوّلها إلى tests حقيقية أو أزلها واستبدلها باختبار حقيقي.

---

# 384. CRITICAL DIRECTIVE

لا تضف fake tests.

---

# 385. CRITICAL DIRECTIVE

لا تقلل severity لإظهار نتائج أفضل.

---

# 386. CRITICAL DIRECTIVE

لا تخفي findings.

---

# 387. CRITICAL DIRECTIVE

لا تحذف tests الفاشلة لمجرد أنها تمنع PASS.

---

# 388. CRITICAL DIRECTIVE

لا تحدث snapshots بشكل أعمى.

---

# 389. CRITICAL DIRECTIVE

لا تحدث dependencies بشكل أعمى.

---

# 390. CRITICAL DIRECTIVE

لا تعيد كتابة المشروع بالكامل دون evidence.

---

# 391. CRITICAL DIRECTIVE

كل إصلاح مهم:

```text
FIX
+
TEST
+
REGRESSION PROTECTION
```

---

# 392. CRITICAL DIRECTIVE

كل security control مهم:

```text
IMPLEMENTATION
+
TEST
+
EVIDENCE
```

---

# 393. CRITICAL DIRECTIVE

كل performance improvement:

```text
BEFORE
+
AFTER
```

---

# 394. CRITICAL DIRECTIVE

كل visual improvement:

```text
BEFORE
+
AFTER
```

---

# 395. CRITICAL DIRECTIVE

كل architecture change:

```text
ADR
+
IMPACT
+
TEST
```

---

# 396. CRITICAL DIRECTIVE

كل production-critical change:

```text
ROLLBACK PLAN
```

---

# 397. CRITICAL DIRECTIVE

عند وجود uncertainty:

لا تخمن.

استخدم:

```text
UNKNOWN
```

ثم حاول جمع evidence.

---

# 398. CRITICAL DIRECTIVE

إذا تعذر التحقق:

```text
NOT VERIFIED
```

---

# 399. CRITICAL DIRECTIVE

إذا كان السبب البيئة:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

---

# 400. FINAL OBJECTIVE

النتيجة المطلوبة ليست:

```text
More files
More prompts
More documentation
More percentages
```

بل:

```text
A coherent engineering operating system
that can understand,
build,
repair,
secure,
optimize,
test,
verify,
measure,
learn,
and continuously improve
AI-built and human-built web projects.
```

---

# 401. FINAL QUALITY BAR

اعتبر WebForge ناجحًا عندما يستطيع:

```text
TAKE NEW PROJECT
↓
UNDERSTAND IT
↓
BUILD BASELINE
↓
FIND RISKS
↓
FIND BUGS
↓
FIND SECURITY ISSUES
↓
FIND PERFORMANCE ISSUES
↓
FIND UX/UI ISSUES
↓
FIND RESPONSIVE ISSUES
↓
FIND ACCESSIBILITY ISSUES
↓
FIND BUSINESS LOGIC ISSUES
↓
FIND ARCHITECTURE ISSUES
↓
PLAN SAFE CHANGES
↓
IMPLEMENT CHANGES
↓
RUN APPROPRIATE TESTS
↓
RUN REAL BROWSER TESTS
↓
RUN REAL DATABASE TESTS
↓
RUN SECURITY TESTS
↓
RUN PERFORMANCE TESTS
↓
RUN VISUAL TESTS
↓
COMPARE BEFORE/AFTER
↓
DETECT REGRESSION
↓
ROLLBACK IF NECESSARY
↓
GENERATE EVIDENCE
↓
SAVE ENGINEERING MEMORY
↓
LEAVE THE PROJECT IN A BETTER VERIFIED STATE
```

---

# 402. FINAL EXECUTION RULE

لا تتوقف عند:

```text
Analysis
```

ولا عند:

```text
Plan
```

ولا عند:

```text
Partial Implementation
```

نفّذ كل ما يمكن تنفيذه فعليًا في البيئة الحالية.

إذا كان شيء غير قابل للتنفيذ بسبب البيئة:

1. لا تتظاهر بأنه تم.
2. سجل السبب.
3. جهز integration point.
4. أنشئ test/fixture إن أمكن.
5. سجل exact command المطلوب لاحقًا.
6. ضع الحالة `BLOCKED` أو `NOT TESTED — ENVIRONMENT LIMITATION`.

---

# 403. FINAL RESPONSE FORMAT

بعد انتهاء العمل، اجعل الرد النهائي مختصرًا نسبيًا، ويحتوي:

```text
WEBFORGE OS — FINAL ENGINEERING STATUS

Implementation:
...

Verification:
...

Security:
...

Performance:
...

Browser:
...

Visual:
...

Database:
...

Redis:
...

Architecture:
...

Regression:
...

Evidence:
...

Remaining Risks:
...

Environment Limitations:
...

Commands Executed:
...

Reports:
...
```

لا تستخدم لغة تسويقية.

لا تستخدم "Perfect".

لا تستخدم "100% Secure".

لا تستخدم "Zero Bugs".

استخدم لغة هندسية قائمة على Evidence.

---

# 404. FINAL ACCEPTANCE CRITERIA

WebForge يجب ألا يعتبر هذه المهمة ناجحة إلا بعد:

* فحص المشروع الفعلي.
* إعادة التحقق من التقارير السابقة.
* اكتشاف الأنظمة الموجودة.
* منع التكرار.
* بناء Project Intelligence.
* بناء Semantic Map.
* بناء Change Impact.
* بناء Risk Engine.
* دمج Security Intelligence.
* دمج Database Intelligence.
* دمج API Intelligence.
* دمج Business Logic Verification.
* دمج Browser Verification.
* دمج Visual Regression.
* دمج Responsive Verification.
* دمج Accessibility.
* دمج Performance.
* دمج Mutation Testing.
* دمج Fuzzing.
* دمج Failure Injection عند الإمكان.
* دمج Evidence Engine.
* دمج Regression Engine.
* دمج Engineering Memory.
* دمج Benchmark Suite.
* دمج Reference Applications.
* إصلاح Known Gaps.
* اختبار CLI.
* اختبار Build.
* اختبار Runtime.
* اختبار Integration.
* اختبار Security.
* اختبار Critical Flows.
* اختبار Regression.
* إنشاء التقارير.
* تنفيذ Self-Audit.
* عدم وجود false completion claims.

---

# 405. ABSOLUTE FINAL RULE

**لا تجعل WebForge مجرد أداة تساعد الـAI على كتابة الكود.**

اجعله النظام الذي يقف بين:

```text
AI
```

و:

```text
REAL SOFTWARE
```

بحيث يكون المسار:

```text
AI INTENT
↓
WEBFORGE UNDERSTANDING
↓
POLICY
↓
ARCHITECTURE
↓
RISK
↓
SAFE CHANGE
↓
IMPLEMENTATION
↓
AUTOMATED VERIFICATION
↓
REGRESSION
↓
EVIDENCE
↓
ACCEPTANCE
```

والهدف النهائي:

```text
AI writes less blindly.
AI changes less dangerously.
AI tests more intelligently.
AI understands more deeply.
AI produces evidence.
AI learns from failures.
AI improves existing software instead of destroying it.
```

**نفّذ المهمة كاملة، وأصلح كل ما تكتشفه ضمن النطاق، ولا تكتفِ بإعداد تقرير عن المشاكل التي تستطيع إصلاحها.**
