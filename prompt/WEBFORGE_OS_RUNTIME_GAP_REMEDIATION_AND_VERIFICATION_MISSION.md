# WEBFORGE OS

# RUNTIME GAP REMEDIATION & VERIFICATION MISSION

## Comprehensive Partial / Unverified / Unproven Gap Discovery, Remediation, Testing & Evidence Mission

---

## 0. MISSION IDENTITY

أنت تعمل الآن كـ:

* Principal Software Architect
* Senior Full-Stack Engineer
* Application Security Engineer
* DevSecOps Engineer
* QA / Test Automation Engineer
* SRE / Reliability Engineer
* Performance Engineer
* Database Engineer
* UX/UI & Accessibility Auditor
* Browser Automation Engineer
* Code Quality Engineer
* Technical Debt Analyst
* Verification & Evidence Engineer

هذه المهمة ليست مهمة إضافة Features عشوائية.

هذه المهمة هي:

> **العثور على كل شيء في WebForge OS تم تصنيفه بأنه PARTIAL أو NOT VERIFIED أو NOT TESTED أو UNPROVEN أو ENVIRONMENT LIMITATION أو KNOWN RISK أو BLOCKED، ثم التحقق منه فعليًا، وإصلاح ما يحتاج إلى إصلاح، وإعادة اختباره، وإثبات النتيجة بالأدلة.**

الهدف النهائي:

> تحويل أكبر عدد ممكن من الفجوات غير المتحققة إلى حالات VERIFIED حقيقية، وليس مجرد تغيير نصوص التقارير.

---

# 1. RULE ZERO — SOURCE OF TRUTH

لا تعتبر أي تقرير سابق حقيقة نهائية بمفرده.

ترتيب الثقة:

```text
1. Runtime Evidence
2. Executed Tests
3. Actual Source Code
4. Actual Configuration
5. Infrastructure State
6. Generated Artifacts
7. Historical Reports
8. README / Documentation Claims
```

إذا تعارض التقرير مع الكود أو runtime أو الاختبار:

> الكود/runtime/test هو المرجع.

لا تقم بتغيير التقرير فقط لجعل الحالة VERIFIED.

لا تقم بإخفاء المشكلة.

لا تقم بحذف الاختبار الذي يكشف المشكلة.

لا تقم بتعطيل lint/security/test rule لإجبار النظام على النجاح.

لا تقم بتحديث snapshots بشكل أعمى.

لا تقم باستخدام Mock لإثبات قدرة يفترض إثباتها Runtime حقيقي.

---

# 2. CURRENT STATE

ابدأ بقراءة وتحليل جميع التقارير الموجودة داخل:

```text
reports/
```

وخاصة:

```text
CLAIM_REGISTRY.md
REPORT_CONSISTENCY_MATRIX.md
REALITY_VERIFICATION_REPORT.md
WEBFORGE_FINAL_TRUTH_REPORT.md
VERIFICATION_LIMITATIONS.md
FINAL_EVIDENCE_INDEX.md
```

وأي تقارير أخرى ذات علاقة.

ثم اقرأ:

```text
README.md
AGENT.md
package.json
```

والـsource code والـconfiguration والـtests والـinfrastructure.

---

# 3. BUILD A GAP REGISTRY FIRST

قبل إجراء أي إصلاح، أنشئ قائمة كاملة بكل الحالات:

```text
PARTIAL
NOT VERIFIED
NOT TESTED
UNPROVEN
ENVIRONMENT LIMITATION
KNOWN RISK
BLOCKED
SIMULATED
MOCKED
HYBRID
CLAIMED BUT NOT EVIDENCED
```

لا تعتمد على كلمات التقارير فقط.

ابحث أيضًا عن فجوات مخفية مثل:

```text
TODO
FIXME
HACK
TEMP
STUB
MOCK
FAKE
SIMULATED
PLACEHOLDER
console.log
skip
.skip
.only
todo tests
disabled tests
ignored tests
snapshot update
fallback
in-memory
dummy
fake adapter
test adapter
development-only
production TODO
```

ثم افحص:

* source code
* tests
* scripts
* CI/CD
* Docker
* compose
* environment configuration
* migrations
* database
* Redis
* frontend
* backend
* security
* infrastructure
* observability
* documentation

---

# 4. CREATE MASTER GAP REGISTRY

أنشئ:

```text
reports/RUNTIME_GAP_REGISTRY.md
```

يجب أن يحتوي على جدول شامل:

| ID | Area | Current Status | Evidence | Required Verification | Fix Required | Priority | Final Status |
| -- | ---- | -------------- | -------- | --------------------- | ------------ | -------- | ------------ |

استخدم IDs مثل:

```text
GAP-RUNTIME-001
GAP-RUNTIME-002
GAP-RUNTIME-003
...
```

كل Gap يجب أن يكون له:

```text
Problem
Current Evidence
Missing Evidence
Root Cause
Risk
Required Action
Verification Method
Regression Test
Evidence Location
Final Status
```

---

# 5. DO NOT FIX EVERYTHING BLINDLY

لكل Gap:

### أولًا:

حدد هل المشكلة:

```text
A. Missing Implementation
B. Broken Implementation
C. Missing Test
D. Weak Test
E. Missing Runtime Environment
F. Configuration Problem
G. Documentation Drift
H. False Claim
I. Architectural Risk
J. Performance Problem
K. Security Problem
L. Reliability Problem
M. Observability Problem
N. Design/UX Verification Gap
O. Infrastructure Gap
```

ثم حدد الإجراء:

```text
VERIFY
FIX
ADD TEST
ADD INFRASTRUCTURE
ADD CONFIGURATION
REFACTOR
REMOVE FALSE CLAIM
DOCUMENT LIMITATION
NO ACTION REQUIRED
```

---

# 6. POSTGRESQL — REAL DATABASE VERIFICATION

يجب محاولة تشغيل PostgreSQL حقيقي في بيئة معزولة.

يمكن استخدام:

```text
Docker
Docker Compose
Local PostgreSQL
CI service
```

حسب البيئة المتاحة.

## تحقق من:

### Connection

* startup
* connection pool
* connection failure
* reconnect
* timeout

### Schema

* tables
* columns
* types
* defaults
* constraints
* foreign keys
* unique constraints
* indexes
* migrations

### Transactions

اختبر:

```text
COMMIT
ROLLBACK
partial failure
nested operations
concurrent writes
```

### Persistence

اختبر:

```text
write
restart database
restart application
read data again
```

يجب ألا يختفي critical data بسبب fallback إلى memory.

### Tenant Isolation

اختبر:

```text
Tenant A cannot read Tenant B
Tenant A cannot modify Tenant B
Tenant A cannot delete Tenant B
```

### RLS

إذا كان RLS مستخدمًا:

* verify policies
* verify enforcement
* verify bypass attempts
* verify role behavior

### Concurrency

اختبر:

```text
double update
stock race
duplicate transaction
parallel order
parallel payment
parallel idempotency request
```

### Failure

اختبر:

```text
DB unavailable
DB timeout
connection exhaustion
transaction failure
migration failure
```

إذا كان PostgreSQL غير متاح:

```text
NOT TESTED — ENVIRONMENT LIMITATION
```

ولا يجوز اعتبار In-Memory equivalent.

---

# 7. REDIS — REAL RUNTIME VERIFICATION

شغّل Redis حقيقيًا.

تحقق من:

```text
connection
TTL
expiration
cache
invalidation
idempotency
rate limiting
locking
concurrency
restart
failure
reconnect
```

إذا كان Redis يستخدم في security-critical behavior:

اختبر ماذا يحدث عند توقف Redis.

يجب تحديد هل النظام:

```text
FAIL CLOSED
FAIL OPEN
DEGRADE SAFELY
```

ويجب التأكد أن fallback لا يحول Redis إلى مجرد optional layer عندما يكون جزءًا من security guarantee.

اختبر:

```text
duplicate request
parallel request
same idempotency key
different tenants
expired key
restart Redis
Redis unavailable
```

---

# 8. BROWSER RUNTIME VERIFICATION

إذا كان Playwright غير موجود:

حاول توفير:

```text
Playwright
Chromium
```

بطريقة مناسبة للمشروع.

لا تدّعِ Browser Verification بدون تشغيل Browser حقيقي.

اختبر:

### Authentication

```text
registration
login
logout
invalid credentials
session expiration
refresh
unauthorized access
```

### Navigation

```text
routes
protected routes
redirects
404
errors
deep links
```

### Forms

```text
valid input
invalid input
empty input
boundary values
keyboard
submission
loading
server errors
duplicate submission
```

### UI

```text
buttons
dialogs
dropdowns
tabs
tables
pagination
modals
notifications
loading states
empty states
error states
```

### Console

سجّل:

```text
console errors
uncaught exceptions
unhandled promises
```

### Network

تحقق من:

```text
failed requests
4xx
5xx
CORS
timeouts
duplicate requests
unexpected requests
sensitive data exposure
```

---

# 9. RESPONSIVE VERIFICATION

اختبر فعليًا:

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

ولكل منها حسب الحاجة:

```text
Portrait
Landscape
```

تحقق من:

* overflow
* horizontal scroll
* clipped content
* broken navigation
* text wrapping
* buttons
* forms
* tables
* modals
* images
* typography
* spacing
* touch targets
* fixed/sticky elements
* viewport bugs

لا يكفي CSS inspection.

---

# 10. RTL / LTR VERIFICATION

اختبر:

```text
LTR
RTL
```

فعليًا داخل browser.

تحقق من:

* layout direction
* flex/grid
* margins/padding
* icons
* arrows
* forms
* tables
* navigation
* dialogs
* tooltips
* animations
* directional transforms
* text alignment
* mixed-language content

ابحث عن:

```text
left/right hardcoding
margin-left
margin-right
padding-left
padding-right
left:
right:
translateX
```

واستبدلها عند الحاجة بـ logical properties.

---

# 11. DARK MODE VERIFICATION

لا تفترض أن وجود Dark Mode يعني أنه صحيح.

اختبر:

```text
Light
Dark
System preference
```

تحقق من:

* contrast
* backgrounds
* text
* borders
* icons
* inputs
* disabled states
* focus states
* hover states
* modals
* dropdowns
* charts
* images
* shadows
* code blocks
* error/success/warning states

ابحث عن hardcoded colors.

---

# 12. ACCESSIBILITY VERIFICATION

نفذ automated accessibility testing إن أمكن.

تحقق من:

```text
WCAG 2.2 AA
```

على الأقل:

* keyboard navigation
* focus visibility
* focus order
* labels
* form errors
* buttons
* links
* dialogs
* headings
* landmarks
* alt text
* aria usage
* color contrast
* reduced motion
* screen-reader semantics

لا تعتمد على automated scanner وحده.

---

# 13. VISUAL REGRESSION

أنشئ:

```text
reports/VISUAL_REGRESSION_FINAL_REPORT.md
```

إذا لم توجد Baseline سابقة:

أنشئ baseline واضحة باسم:

```text
INITIAL BASELINE
```

ولا تسميها Regression Pass.

التقط screenshots للصفحات والحالات المهمة.

Matrix:

```text
Mobile
Tablet
Desktop

Light
Dark

LTR
RTL
```

قارن:

```text
layout
spacing
typography
colors
icons
images
components
animations where measurable
```

لا تقبل تغييرات snapshot بشكل أعمى.

---

# 14. PERFORMANCE RUNTIME VERIFICATION

استخدم Browser/Lighthouse أو أدوات حقيقية متاحة.

قِس:

```text
FCP
LCP
INP
CLS
TTFB
Total Blocking Time where applicable
Long Tasks
JS payload
CSS payload
Image payload
Font payload
Network requests
```

وثّق:

```text
browser
OS/environment
viewport
network profile
CPU profile if available
number of runs
median
outliers
```

لا تستخدم تشغيلًا محليًا واحدًا لإثبات Production Performance.

---

# 15. MOTION & ANIMATION VERIFICATION

افحص:

```text
entrance
exit
hover
microinteraction
scroll reveal
parallax
3D
loader
skeleton
modal
drawer
dropdown
toast
page transition
```

لكل animation:

```text
PURPOSE
TRIGGER
DURATION
EASING
PERFORMANCE
ACCESSIBILITY
MOBILE BEHAVIOR
REDUCED MOTION
```

حدد:

```text
KEEP
IMPROVE
SIMPLIFY
REPLACE
REMOVE
```

تحقق من:

* layout thrashing
* excessive JS animation
* unnecessary reflows
* scroll jank
* GPU abuse
* heavy mobile effects

---

# 16. REDUCED MOTION

اختبر:

```text
prefers-reduced-motion
```

وتأكد أن الحركة غير الضرورية:

```text
disabled
reduced
simplified
```

ولا تكسر functionality.

---

# 17. SECURITY RUNTIME VERIFICATION

لا تكتفِ بوجود security modules.

اختبر Runtime فعليًا:

### Authentication

* brute force
* session
* token rotation
* expiration
* invalid token
* privilege escalation

### Authorization

* IDOR
* BOLA
* tenant escape
* role escalation
* object ownership
* admin endpoints

### Input

* SQL injection
* XSS
* command injection
* path traversal
* SSRF
* prototype pollution
* malicious file upload
* mass assignment

### Web

* CSRF
* CORS
* security headers
* cookies
* open redirect
* request smuggling where applicable

### API

* rate limit
* abuse
* pagination abuse
* parameter tampering
* duplicate requests
* replay

### Secrets

ابحث عن:

```text
hardcoded credentials
tokens
API keys
private keys
database credentials
JWT secrets
```

---

# 18. AI / AGENT SECURITY RUNTIME

تحقق من أن AI-related controls ليست مجرد ملفات نظرية.

اختبر:

```text
prompt injection
indirect prompt injection
tool abuse
unauthorized tool execution
privilege escalation
sensitive context leakage
system prompt exposure
cross-tenant context leakage
malicious tool parameters
untrusted output
excessive agency
```

إذا كان AI functionality غير مستخدم فعليًا في runtime:

سجّل:

```text
NOT APPLICABLE
```

ولا تخترع اختبارًا غير موجود.

---

# 19. BUSINESS LOGIC

افحص state machines والعمليات الحساسة.

خصوصًا:

```text
orders
payments
inventory
coupons
refunds
returns
subscriptions
applications
reservations
approvals
user accounts
```

اختبر:

```text
invalid state transition
duplicate operation
replay
race condition
price manipulation
quantity manipulation
coupon abuse
ownership bypass
negative values
boundary values
concurrent requests
```

كل bug مكتشف يجب أن يحصل على:

```text
Fix
Regression Test
Evidence
```

---

# 20. API VERIFICATION

تحقق من:

```text
authentication
authorization
schema validation
input validation
error handling
status codes
rate limiting
pagination
sorting
filtering
idempotency
caching
transactions
timeouts
logging
security headers
```

افحص consistency بين:

```text
API Contract
Implementation
Frontend Client
Tests
Documentation
```

---

# 21. DATABASE PERFORMANCE

افحص:

```text
N+1
missing indexes
slow queries
unbounded queries
pagination
large result sets
connection pool
transaction scope
locking
deadlocks
```

إذا وجدت مشكلة:

```text
Measure
Fix
Measure Again
```

---

# 22. DEPENDENCY & SUPPLY CHAIN

افحص:

```text
npm audit
outdated dependencies
known vulnerabilities
lockfile
dependency duplication
unused dependencies
suspicious packages
install scripts
secrets
```

لا تقم بترقية dependency بشكل أعمى.

قبل الترقية:

```text
compatibility
breaking changes
security impact
tests
```

---

# 23. CI/CD VERIFICATION

تحقق هل توجد gates حقيقية لـ:

```text
build
tests
security
lint
typecheck
dependency audit
secrets
E2E
```

إذا لم توجد:

لا تضف CI عشوائيًا قبل فهم architecture.

إذا كانت ضرورية:

أضف Quality Gates مناسبة بحيث لا يمر build عند فشل critical checks.

---

# 24. OBSERVABILITY

تحقق من:

```text
logs
metrics
health
readiness
liveness
errors
audit events
request correlation
security events
```

اختبر هل failures تظهر فعليًا أم تختفي silently.

---

# 25. BACKUP & RESTORE

إذا كان PostgreSQL حقيقيًا متاحًا:

نفذ:

```text
Create Data
↓
Backup
↓
Destroy/Reset Test DB
↓
Restore
↓
Run Migrations if appropriate
↓
Start Application
↓
Verify Data
↓
Run Critical Flows
```

تحقق من:

```text
row counts
relationships
constraints
indexes
critical business data
```

لا تعتبر:

```text
idempotency
database transactions
```

بديلًا عن Backup/Restore.

---

# 26. RPO / RTO

لا تكتب أرقامًا نظرية.

إذا تم اختبارها فعليًا:

سجّل:

```text
Observed RPO
Observed RTO
Test Environment
Test Procedure
Result
Limitations
```

إذا لم يتم اختبارها:

```text
NOT VERIFIED
```

---

# 27. RESILIENCE / CHAOS TESTING

في بيئة معزولة فقط.

اختبر:

```text
PostgreSQL unavailable
Redis unavailable
API timeout
network failure
dependency timeout
process crash
worker crash
queue failure
third-party failure
slow database
connection exhaustion
```

تحقق من:

```text
timeout
retry
fallback
circuit behavior
error reporting
data integrity
recovery
duplicate operations
```

مهم جدًا:

> لا تسمح بأن يتحول In-Memory fallback إلى مصدر حقيقة بديل للبيانات الحرجة.

---

# 28. TEST QUALITY AUDIT

لكل Test مهم حدد:

```text
REAL
MOCKED
SIMULATED
HYBRID
```

تحقق من:

```text
actual assertions
meaningful assertions
false positives
console.log-only tests
skipped tests
disabled tests
weak mocks
missing negative tests
missing concurrency tests
```

يجب ألا يكون:

```text
process exited 0
```

دليلًا وحيدًا على نجاح الاختبار.

---

# 29. CLI VERIFICATION

تحقق من جميع أوامر:

```text
webforge
```

والـCLI mappings.

خصوصًا المشاكل السابقة مثل:

```text
runAudit
auditCompliance

generateMatrix
generateTraceabilityMatrix
```

تحقق من:

* names
* arguments
* static vs instance
* return values
* error handling
* exit codes

كل CLI command يجب أن يكون:

```text
implemented
callable
tested
documented
```

---

# 30. INFRASTRUCTURE

تحقق من:

```text
Dockerfile
docker-compose
Nginx
PostgreSQL
Redis
environment variables
ports
health checks
startup order
shutdown
restart
volumes
permissions
secrets
production configuration
```

تحقق من أي mismatch مثل:

```text
Docker CMD
actual server entrypoint
ports
environment
healthcheck
```

---

# 31. FRONTEND QUALITY

افحص:

```text
memory leaks
event listeners
timers
subscriptions
websockets
unmounted async operations
state synchronization
unnecessary rerenders
large components
dead code
duplicate components
```

لا تقم بتحسين performance قبل إثبات وجود المشكلة.

---

# 32. DESIGN INTELLIGENCE

راجع:

```text
anti-slop
anti-convergence
color system
typography
icons
spacing
components
layout
motion
dark mode
RTL
responsive
```

تأكد أن:

* لا توجد Emoji كبديل للأيقونات.
* لا توجد أيقونات AI عامة بلا سبب.
* لا توجد gradients/glass/bento/card patterns بشكل مفرط.
* لا يتم فرض Dark Mode إذا لم يكن مطلوبًا.
* لا يتم فرض RTL إذا لم يكن مطلوبًا.
* لا يتم تغيير visual identity بدون سبب.

---

# 33. DOCUMENTATION DRIFT

قارن:

```text
README
AGENT
reports
source
tests
configuration
CLI
architecture
```

إذا وجدت claim قديمًا:

لا تحذفه فقط.

سجّل:

```text
OLD CLAIM
ACTUAL STATE
WHY IT WAS WRONG/OUTDATED
NEW VERIFIED STATE
EVIDENCE
```

---

# 34. AUTOMATIC REMEDIATION POLICY

إذا وجدت مشكلة حقيقية:

```text
IDENTIFY
↓
UNDERSTAND ROOT CAUSE
↓
ASSESS IMPACT
↓
PLAN MINIMAL SAFE FIX
↓
IMPLEMENT
↓
UNIT TEST
↓
INTEGRATION TEST
↓
E2E IF APPLICABLE
↓
SECURITY TEST IF APPLICABLE
↓
REGRESSION TEST
↓
MEASURE AGAIN
```

لا تستخدم:

```text
blind rewrite
mass refactor
unrelated cleanup
dependency upgrade without reason
architecture rewrite without evidence
```

---

# 35. CHANGE IMPACT ANALYSIS

قبل كل إصلاح مهم:

حدد:

```text
Affected Files
Affected Modules
Affected APIs
Affected Database
Affected Security Controls
Affected Frontend
Affected Tests
Affected Documentation
Affected Deployment
Affected Performance
Affected Users/Flows
```

بعد الإصلاح:

أعد اختبار كل affected surface.

---

# 36. REGRESSION MEMORY

كل مشكلة مهمة تم إصلاحها يجب أن يكون لها regression test.

الهدف:

> لا يعود الخطأ في المستقبل.

أنشئ أو حدّث:

```text
tests/regression/
```

بحسب architecture الموجودة.

---

# 37. EVIDENCE ENGINE

لكل Claim مهم يجب تسجيل:

```text
Claim
Test
Command
Environment
Timestamp
Result
Artifact
Evidence Path
Status
```

أمثلة:

```text
PostgreSQL persistence
Redis TTL
Browser login
RTL rendering
Dark mode
IDOR prevention
Backup restore
Recovery
Performance
```

---

# 38. STATUS RULES

استخدم فقط الحالات:

```text
VERIFIED
PARTIALLY VERIFIED
NOT VERIFIED
NOT TESTED
ENVIRONMENT LIMITATION
KNOWN RISK
BLOCKED
NOT APPLICABLE
```

ممنوع:

```text
100% secure
zero bugs
perfect
fully secure
guaranteed
production proof
```

---

# 39. FINAL ACCEPTANCE CRITERIA

لا تعتبر المهمة مكتملة لمجرد أن:

```text
npm test
```

نجح.

المهمة تعتبر مكتملة فقط بعد:

```text
Gap Discovery
+
Runtime Verification
+
Required Remediation
+
Regression Testing
+
Evidence
+
Report Reconciliation
```

---

# 40. REQUIRED REPORTS

أنشئ أو حدّث الملفات التالية:

```text
reports/RUNTIME_GAP_REGISTRY.md

reports/RUNTIME_VERIFICATION_ENVIRONMENT.md

reports/POSTGRESQL_LIVE_VERIFICATION.md

reports/REDIS_LIVE_VERIFICATION.md

reports/BROWSER_E2E_FINAL_REPORT.md

reports/VISUAL_REGRESSION_FINAL_REPORT.md

reports/PERFORMANCE_RUNTIME_REPORT.md

reports/BACKUP_RESTORE_VERIFICATION.md

reports/RESILIENCE_RUNTIME_REPORT.md

reports/SECURITY_RUNTIME_VERIFICATION.md

reports/ACCESSIBILITY_RUNTIME_REPORT.md

reports/RESPONSIVE_RUNTIME_REPORT.md

reports/DESIGN_RUNTIME_VERIFICATION.md

reports/TEST_QUALITY_AUDIT.md

reports/CI_CD_VERIFICATION.md

reports/INFRASTRUCTURE_RUNTIME_REPORT.md

reports/REMEDIATION_CHANGELOG.md

reports/RUNTIME_EVIDENCE_INDEX.md
```

ثم **حدّث**:

```text
reports/WEBFORGE_FINAL_TRUTH_REPORT.md
```

ولا تنشئ ملفًا آخر ينافسه باعتباره Final Truth.

---

# 41. FINAL TRUTH UPDATE

في نهاية المهمة، يجب أن يحتوي:

```text
WEBFORGE_FINAL_TRUTH_REPORT.md
```

على:

## Verified

كل ما أصبح مثبتًا بأدلة حقيقية.

## Partially Verified

ما تم التحقق منه جزئيًا مع توضيح الجزء المتبقي.

## Not Verified

ما لم يمكن إثباته.

## Environment Limitations

ما تعذر بسبب البيئة.

## Known Risks

المخاطر الموجودة التي لم يتم إصلاحها.

## Remediated

كل المشاكل التي تم إصلاحها.

## Regression Coverage

الاختبارات التي تمنع عودة المشاكل.

## Evidence Index

روابط/مسارات الأدلة.

---

# 42. FINAL VERIFICATION MATRIX

أنشئ Matrix نهائية:

| Domain | Previous Status | Action | Verification | Result | Evidence | Regression | Final Status |
| ------ | --------------- | ------ | ------------ | ------ | -------- | ---------- | ------------ |

يجب أن تغطي على الأقل:

```text
Architecture
Security
Authentication
Authorization
Tenant Isolation
Database
PostgreSQL
Redis
API
Business Logic
Payments
State Machines
Frontend
Browser
Responsive
RTL
LTR
Dark Mode
Accessibility
Motion
Performance
Visual Regression
Dependencies
Supply Chain
Secrets
Infrastructure
Docker
Nginx
CI/CD
Observability
Backup
Restore
RPO
RTO
Resilience
Chaos
AI Security
Testing
CLI
Documentation
Traceability
Technical Debt
```

---

# 43. FINAL COMMAND EXECUTION

بعد الإصلاحات:

شغّل كل الاختبارات المناسبة.

على الأقل:

```text
npm test
```

ثم:

```text
node bin/webforge.js test
```

ثم جميع الاختبارات الإضافية الموجودة.

ثم:

```text
build
lint
typecheck
security checks
dependency checks
E2E
browser
visual
performance
```

حسب ما يدعمه المشروع فعليًا.

---

# 44. NO FALSE SUCCESS

إذا فشل شيء:

لا تصلحه في التقرير.

أصلحه في النظام أولًا.

إذا تعذر إصلاحه:

سجله بوضوح:

```text
KNOWN RISK
```

أو:

```text
ENVIRONMENT LIMITATION
```

أو:

```text
BLOCKED
```

مع السبب.

---

# 45. IMPORTANT: DO NOT STOP AT FIRST FAILURE

إذا فشل:

```text
PostgreSQL
```

لا تتوقف عن:

```text
Redis
Browser
Security
Performance
Accessibility
Visual
Resilience
```

استمر في كل المسارات التي يمكن تنفيذها.

وفي النهاية اجمع جميع النتائج.

---

# 46. IMPORTANT: DO NOT CREATE FAKE INFRASTRUCTURE

إذا لم تتوفر خدمة معينة:

لا تصنع Mock وتكتب أنها Runtime Verification.

افصل بوضوح:

```text
REAL
MOCKED
SIMULATED
HYBRID
```

---

# 47. IMPORTANT: FIX ONLY WHEN JUSTIFIED

ليس كل:

```text
PARTIAL
```

يعني Bug.

قد يكون:

```text
intentional limitation
optional capability
environment limitation
future integration
not applicable
```

لذلك:

> تحقق أولًا، ثم قرر.

---

# 48. FINAL SELF-AUDIT

قبل إنهاء المهمة اسأل نفسك:

```text
هل فحصت كل PARTIAL؟
هل فحصت كل NOT VERIFIED؟
هل فحصت كل NOT TESTED؟
هل فحصت كل UNPROVEN؟
هل فحصت كل ENVIRONMENT LIMITATION؟
هل فحصت كل KNOWN RISK؟
هل أصلحت المشاكل التي تحتاج إصلاحًا؟
هل أضفت Regression Tests؟
هل شغلت الاختبارات فعليًا؟
هل استخدمت Runtime حقيقي عندما كان مطلوبًا؟
هل فصلت REAL عن MOCKED؟
هل تحققت من Browser؟
هل تحققت من PostgreSQL؟
هل تحققت من Redis؟
هل تحققت من Backup/Restore؟
هل تحققت من Resilience؟
هل تحققت من Performance؟
هل تحققت من Accessibility؟
هل تحققت من Responsive؟
هل تحققت من RTL/LTR؟
هل تحققت من Dark/Light؟
هل تحققت من Security Runtime؟
هل راجعت CLI؟
هل راجعت Infrastructure؟
هل راجعت Documentation Drift؟
هل حدثت FINAL TRUTH؟
هل كل Claim مهم لديه Evidence؟
```

إذا كانت الإجابة "لا" لأي نقطة:

إما نفذها أو سجل سبب عدم إمكانية تنفيذها.

---

# 49. FINAL OUTPUT

في نهاية المهمة اطبع ملخصًا تنفيذيًا واضحًا:

```text
WEBFORGE OS
RUNTIME GAP REMEDIATION — FINAL RESULT

Total Gaps:
Previously Verified:
Previously Partial:
Previously Unverified:
Previously Untested:
Previously Blocked:

Fixed:
Regression Tests Added:
New Tests:
New Evidence:

PostgreSQL:
Redis:
Browser:
Visual:
Performance:
Security:
Accessibility:
Responsive:
RTL/LTR:
Dark Mode:
Backup/Restore:
Resilience:
CI/CD:
Infrastructure:
AI Security:

Remaining Risks:
Remaining Limitations:
Blocked Items:

FINAL TRUTH STATUS:
```

ثم اربط كل نتيجة بالتقرير أو الـEvidence الخاص بها.

---

# 50. ABSOLUTE FINAL RULE

لا تعتبر WebForge OS مكتملًا لأن التقارير أصبحت جميلة.

لا تعتبره مكتملًا لأن:

```text
61 tests passed
```

ولا لأن:

```text
npm test = 0
```

الهدف هو:

```text
REAL SYSTEM
+
REAL EXECUTION
+
REAL TESTS
+
REAL INFRASTRUCTURE
+
REAL EVIDENCE
+
REGRESSION PROTECTION
```

والقاعدة النهائية:

> **CODE + RUNTIME + TESTS + INFRASTRUCTURE + EVIDENCE = VERIFIED TRUTH**

إذا لم يمكن إثبات شيء:

> لا تدّعي أنه مثبت.

إذا اكتشفت مشكلة:

> أصلحها.

إذا أصلحتها:

> اختبرها.

إذا اختبرتها:

> أضف Regression Test عندما يكون ذلك مناسبًا.

إذا نجح الاختبار:

> خزّن Evidence.

إذا تغيرت الحقيقة:

> حدّث `WEBFORGE_FINAL_TRUTH_REPORT.md`.

**لا تنشئ Final Truth منافسًا.**

**لا تخفِ القيود.**

**لا تتوقف عند أول نجاح.**

**افحص النظام كاملًا مرة أخرى بعد الإصلاحات.**
