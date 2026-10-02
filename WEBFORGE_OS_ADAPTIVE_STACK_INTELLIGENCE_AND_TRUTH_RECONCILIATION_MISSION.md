# WEBFORGE OS

# ADAPTIVE STACK INTELLIGENCE & TRUTH RECONCILIATION MISSION

## Comprehensive Architecture Correction, Stack Detection, Contradiction Resolution, Runtime Adaptation & Final Verification

---

# 0. MISSION PURPOSE

هذه المهمة ليست لإضافة Features عشوائية.

وليست لتشغيل PostgreSQL أو Redis أو Docker لمجرد أن تقارير سابقة ذكرتها.

الهدف هو تصحيح WebForge OS نفسه بحيث يصبح:

> **Stack-Agnostic + Project-Aware + Context-Aware + Evidence-Driven + Adaptive**

أي أن WebForge لا يفرض على المشروع:

* Programming Language
* Framework
* Database
* ORM
* Cache
* Queue
* API style
* Authentication strategy
* Infrastructure
* Cloud provider
* Testing framework
* Deployment platform

بل:

```text
PROJECT
   ↓
DISCOVERY
   ↓
STACK DETECTION
   ↓
CAPABILITY DETECTION
   ↓
ARCHITECTURE UNDERSTANDING
   ↓
APPLICABILITY ANALYSIS
   ↓
RELEVANT VERIFICATION MODULES
   ↓
PROJECT-SPECIFIC TEST PLAN
   ↓
EXECUTION
   ↓
REMEDIATION
   ↓
REGRESSION
   ↓
EVIDENCE
   ↓
FINAL TRUTH
```

---

# 1. PRIMARY CORRECTION

يجب اعتبار القاعدة التالية جزءًا من دستور WebForge:

> **WebForge verifies the project that exists. It does not invent the project it expects.**

إذا كان المشروع يستخدم PostgreSQL:

```text
→ PostgreSQL verification
```

إذا كان يستخدم MySQL:

```text
→ MySQL verification
```

إذا كان يستخدم MongoDB:

```text
→ MongoDB verification
```

إذا كان يستخدم SQLite:

```text
→ SQLite verification
```

إذا كان يستخدم Firebase:

```text
→ Firebase verification
```

إذا كان يستخدم Redis:

```text
→ Redis verification
```

إذا لم يستخدم Redis:

```text
→ Redis = NOT APPLICABLE
```

وليس:

```text
→ Redis = NOT TESTED
```

---

# 2. ABSOLUTE NON-ASSUMPTION RULE

ممنوع على WebForge افتراض:

```text
PostgreSQL
Redis
Docker
Node.js
Next.js
React
Prisma
REST
JWT
Playwright
AWS
Kubernetes
```

إلا إذا تم اكتشافها في المشروع أو اختار المستخدم استخدامها.

---

# 3. SOURCE OF TRUTH

افحص:

```text
source code
package manifests
lockfiles
configuration
environment templates
Docker
CI/CD
database migrations
ORM configuration
API definitions
tests
scripts
deployment files
documentation
reports
```

ثم حدد الـStack الفعلي.

ترتيب الثقة:

```text
1. Runtime
2. Executable configuration
3. Source code
4. Package manifests
5. Infrastructure
6. Tests
7. Generated artifacts
8. Documentation
9. Historical reports
```

---

# 4. DISCOVER THE ACTUAL PROJECT STACK

أنشئ Engine أو طور الموجود إذا كان موجودًا.

اسم المفهوم:

```text
Project Stack & Capability Detection Engine
```

يجب اكتشاف:

## Programming Languages

```text
JavaScript
TypeScript
Python
Java
C#
PHP
Go
Rust
Ruby
Kotlin
Swift
...
```

## Frontend

```text
React
Next.js
Vue
Nuxt
Angular
Svelte
SvelteKit
Astro
HTML/CSS/JS
...
```

## Backend

```text
Node
Express
Fastify
NestJS
Django
FastAPI
Flask
Spring
.NET
Laravel
Rails
Go frameworks
...
```

## Databases

```text
PostgreSQL
MySQL
MariaDB
SQLite
MongoDB
DynamoDB
Firestore
Firebase
Supabase
Redis
Cassandra
...
```

## ORM / Data Access

```text
Prisma
Drizzle
Sequelize
TypeORM
Mongoose
SQLAlchemy
Django ORM
Eloquent
Hibernate
EF Core
...
```

## API

```text
REST
GraphQL
gRPC
tRPC
WebSocket
Socket.IO
Server Actions
RPC
```

## Authentication

```text
JWT
Session Cookies
OAuth
OIDC
Auth.js
Passport
Firebase Auth
Supabase Auth
Custom Authentication
```

## Cache

```text
Redis
Memcached
In-memory
Database cache
CDN
None
```

## Queue / Messaging

```text
RabbitMQ
Kafka
BullMQ
Celery
SQS
Pub/Sub
Redis Streams
None
```

## Infrastructure

```text
Docker
Docker Compose
Kubernetes
AWS
Azure
GCP
Vercel
Cloudflare
Netlify
Railway
Render
Bare Metal
VM
Serverless
```

## Testing

```text
Jest
Vitest
Pytest
JUnit
Cypress
Playwright
Mocha
PHPUnit
...
```

---

# 5. PROJECT_CAPABILITIES

يجب أن ينشئ أو يحدث:

```text
PROJECT_CAPABILITIES.md
```

ويحتوي على:

```yaml
project:
  name:
  type:
  architecture:

languages:
frameworks:
frontend:
backend:
database:
orm:
cache:
queue:
api:
authentication:
authorization:
storage:
payments:
search:
messaging:
testing:
build:
deployment:
infrastructure:
observability:
localization:
rtl:
ai:
```

مع:

```text
confidence
evidence
source
```

لكل Capability.

مثال:

```text
database:
  engine: PostgreSQL
  confidence: HIGH
  evidence:
    - prisma/schema.prisma
    - DATABASE_URL
    - migrations/
```

---

# 6. CAPABILITY STATUS MODEL

لا تستخدم فقط:

```text
VERIFIED
NOT VERIFIED
```

استخدم:

```text
DETECTED
VERIFIED
PARTIALLY VERIFIED
NOT VERIFIED
NOT TESTED
NOT APPLICABLE
ENVIRONMENT LIMITATION
BLOCKED
KNOWN RISK
UNKNOWN
```

---

# 7. NOT APPLICABLE VS NOT TESTED

هذه نقطة إلزامية.

### NOT APPLICABLE

الميزة غير موجودة أصلًا في المشروع.

مثال:

```text
Project has no Redis
→ Redis Verification = NOT APPLICABLE
```

### NOT TESTED

الميزة موجودة لكن لم يتم اختبارها.

مثال:

```text
Project uses PostgreSQL
PostgreSQL server unavailable
→ PostgreSQL Verification = NOT TESTED
```

### ENVIRONMENT LIMITATION

الميزة موجودة، لكن البيئة الحالية تمنع الاختبار.

مثال:

```text
PostgreSQL detected
Docker unavailable
No local PostgreSQL
→ ENVIRONMENT LIMITATION
```

### BLOCKED

هناك dependency أو permission أو failure يمنع التنفيذ بعد المحاولة.

---

# 8. ADAPTIVE VERIFICATION ENGINE

أنشئ أو صحح:

```text
Verification Planner
```

بحيث يبني خطة الاختبار بناءً على:

```text
Detected Stack
+
Detected Capabilities
+
Architecture
+
Project Type
+
Risk Profile
+
Environment
```

مثال:

```text
Project A

Next.js
TypeScript
PostgreSQL
Prisma
Redis
Stripe
Playwright
Docker

→ activate:

Next.js checks
TypeScript checks
PostgreSQL checks
Prisma checks
Redis checks
Stripe checks
Playwright checks
Docker checks
```

بينما:

```text
Project B

Django
Python
MySQL
Celery
Pytest

→ activate:

Python checks
Django checks
MySQL checks
Celery checks
Pytest checks
```

ولا يتم تشغيل PostgreSQL/Redis/Next.js checks.

---

# 9. CONDITIONAL SECURITY

Security يجب أن يكون Context-Aware.

مثال:

إذا يوجد:

```text
JWT
```

فعّل:

```text
JWT security checks
```

إذا يوجد:

```text
Session Cookies
```

فعّل:

```text
Session security checks
```

إذا يوجد:

```text
OAuth/OIDC
```

فعّل:

```text
OAuth/OIDC checks
```

إذا يوجد:

```text
File Upload
```

فعّل:

```text
Upload security
```

إذا لا يوجد:

```text
File Upload
```

سجل:

```text
File Upload Security = NOT APPLICABLE
```

---

# 10. CONDITIONAL DATABASE VERIFICATION

أنشئ abstraction:

```text
Database Verification Adapter
```

لا تجعل WebForge مربوطًا بـPostgreSQL.

يجب أن يكون المفهوم:

```text
Database
 ├── PostgreSQL Adapter
 ├── MySQL Adapter
 ├── MariaDB Adapter
 ├── SQLite Adapter
 ├── MongoDB Adapter
 ├── Firebase Adapter
 ├── DynamoDB Adapter
 └── Generic Adapter
```

لكن:

> لا تنشئ adapters وهمية لمجرد زيادة العدد.

ابدأ بما يتطلبه architecture الفعلية.

---

# 11. CONDITIONAL CACHE VERIFICATION

نفس المبدأ:

```text
Cache
 ├── Redis
 ├── Memcached
 ├── In-Memory
 ├── CDN
 ├── Database Cache
 └── None
```

إذا المشروع يستخدم In-Memory:

تحقق من In-Memory.

إذا Redis:

تحقق من Redis الحقيقي.

إذا لا يوجد Cache:

```text
Cache Verification = NOT APPLICABLE
```

---

# 12. CONDITIONAL QUEUE VERIFICATION

إذا:

```text
RabbitMQ
```

اختبر RabbitMQ.

إذا:

```text
Kafka
```

اختبر Kafka.

إذا:

```text
BullMQ
```

اختبر BullMQ.

إذا:

```text
Celery
```

اختبر Celery.

إذا لا يوجد Queue:

```text
Queue Verification = NOT APPLICABLE
```

---

# 13. CONDITIONAL API VERIFICATION

اكتشف:

```text
REST
GraphQL
gRPC
WebSocket
Socket.IO
tRPC
Server Actions
```

ثم فعّل الاختبارات المناسبة فقط.

---

# 14. CONDITIONAL INFRASTRUCTURE VERIFICATION

إذا المشروع يستخدم Docker:

```text
→ Docker verification
```

إذا لا يستخدم Docker:

```text
→ Docker = NOT APPLICABLE
```

إذا يستخدم Kubernetes:

```text
→ Kubernetes verification
```

إذا Vercel:

```text
→ Vercel deployment checks
```

إذا AWS:

```text
→ AWS-specific checks
```

لا تجعل Docker Requirement عالميًا.

---

# 15. TESTING ADAPTER

اكتشف test framework.

مثال:

```text
Jest
Vitest
Pytest
JUnit
PHPUnit
Cypress
Playwright
```

ثم استخدم الموجود.

لا تفرض Playwright على كل مشروع.

لكن:

> إذا كان Browser UI موجودًا ولم توجد Browser E2E، يجب أن يسجل WebForge Gap مناسبًا.

---

# 16. PLAYWRIGHT POLICY

Playwright ليس Requirement عالميًا.

إذا المشروع:

```text
Frontend UI
```

يمكن أن تكون Browser Verification مناسبة.

إذا:

```text
Backend-only library
```

فلا داعي لإجبار Playwright.

الحالة:

```text
Browser E2E = NOT APPLICABLE
```

إذا لم يوجد UI.

---

# 17. VISUAL REGRESSION POLICY

نفس القاعدة.

إذا يوجد UI:

```text
Visual Verification = Applicable
```

إذا Backend-only:

```text
Visual Verification = NOT APPLICABLE
```

---

# 18. RESPONSIVE POLICY

إذا يوجد Web UI:

```text
Responsive Verification = Applicable
```

إذا CLI-only:

```text
Responsive Verification = NOT APPLICABLE
```

---

# 19. RTL / LTR POLICY

لا تفترض RTL.

اكتشف:

```text
supported locales
dir attributes
i18n configuration
translation files
language selectors
```

إذا يدعم العربية:

```text
RTL = Applicable
```

إذا المشروع English-only:

```text
RTL = NOT APPLICABLE
```

---

# 20. DARK MODE POLICY

إذا يوجد Theme System:

اختبره.

إذا المشروع لا يدعم Dark Mode وليس ذلك Requirement:

```text
Dark Mode = NOT APPLICABLE
```

ولا تضف Dark Mode تلقائيًا.

---

# 21. PAYMENTS

إذا يوجد payment integration:

اكتشف provider:

```text
Stripe
PayPal
Adyen
Checkout
Custom
```

ثم فعّل provider-specific checks.

إذا لا يوجد payment:

```text
Payment Security = NOT APPLICABLE
```

---

# 22. AI / LLM CAPABILITY DETECTION

اكتشف:

```text
OpenAI
Anthropic
Gemini
Local Models
RAG
Vector DB
Embeddings
Agents
Tools
Function Calling
MCP
```

ثم فعّل:

```text
Prompt Injection
Tool Authorization
Context Isolation
Sensitive Data Leakage
Agent Permissions
Output Validation
RAG Isolation
```

إذا لا يوجد AI:

```text
AI Security = NOT APPLICABLE
```

---

# 23. CORRECT THE CURRENT WEBFORGE ARCHITECTURE

افحص WebForge نفسه بحثًا عن assumptions مثل:

```text
PostgreSQL required
Redis required
Node required
Docker required
Prisma required
Next.js required
```

إذا وجدتها في core architecture:

صححها.

استخدم:

```text
Adapters
Providers
Capability Interfaces
Plugin Architecture
Detection Layer
Verification Profiles
```

بدون overengineering.

---

# 24. CONTRADICTION RECONCILIATION

أنشئ:

```text
reports/CONTRADICTION_RECONCILIATION_REPORT.md
```

ابحث عن كل تعارض بين:

```text
Reports
Code
Tests
Runtime
Infrastructure
Documentation
Claims
```

لكل تعارض:

```text
CONTRADICTION ID
Claim A
Claim B
Actual Evidence
Root Cause
Resolution
Files Changed
Tests
Final Truth
```

---

# 25. FIX EXISTING REPORT CONTRADICTIONS

صحح خصوصًا أي حالات مثل:

```text
Total Gaps = 7
Verified = 4
Limitations = 3
```

بينما Registry يقول:

```text
Verified = 3
Limitations = 4
```

يجب أن يصبح الرقم واحدًا في جميع التقارير.

---

# 26. CORRECT FALSE EQUIVALENCES

ممنوع اعتبار:

```text
In-Memory Cache
=
Redis
```

وممنوع:

```text
HTTP E2E
=
Playwright E2E
```

وممنوع:

```text
State Rollback
=
Database Backup/Restore
```

وممنوع:

```text
CSS Inspection
=
Browser Responsive Verification
```

وممنوع:

```text
Static Accessibility Audit
=
Full Accessibility Verification
```

وممنوع:

```text
Local Performance
=
Production Performance
```

وممنوع:

```text
Security Assertions
=
100% Security
```

---

# 27. CORRECT CLAIM LANGUAGE

استبدل الادعاءات المطلقة.

ممنوع:

```text
100% secure
zero bugs
fully secure
perfect
all vulnerabilities fixed
production proven
```

استخدم:

```text
X/Y tests passed
Control X verified
Control Y partially verified
Not tested
Environment limitation
Known risk
```

---

# 28. ANTI-HALLUCINATION GUARD

راجع:

```text
packages/**/anti-hallucination*
```

وأي mechanism مرتبط بها.

تأكد أنها لا تمنع:

```text
legitimate project-specific paths
dynamic project paths
different languages
different frameworks
different database adapters
```

وفي الوقت نفسه تمنع:

```text
fabricated evidence
invented test results
unsupported claims
fake runtime verification
```

---

# 29. CONSTITUTION

راجع:

```text
WEBFORGE_CONSTITUTION.md
```

وأضف المبادئ التالية إذا لم تكن موجودة:

```text
1. WebForge does not impose a technology stack.
2. WebForge discovers before it verifies.
3. WebForge verifies only applicable capabilities.
4. NOT APPLICABLE is different from NOT TESTED.
5. Runtime evidence outranks documentation.
6. In-memory substitutes cannot prove external infrastructure.
7. Static inspection cannot prove runtime behavior.
8. One test cannot prove an entire security domain.
9. Project architecture belongs to the developer.
10. WebForge adapts its verification strategy to the project.
```

---

# 30. EXISTING PROJECT MODE

تأكد أن Existing Project Mode يعمل بهذا الترتيب:

```text
Inspect Existing Project
        ↓
Detect Stack
        ↓
Detect Architecture
        ↓
Detect Capabilities
        ↓
Detect Dependencies
        ↓
Detect Infrastructure
        ↓
Detect Existing Tests
        ↓
Create Project Profile
        ↓
Create Verification Plan
        ↓
Baseline
        ↓
Improve
        ↓
Verify
```

وليس:

```text
Install WebForge
↓
Assume WebForge Stack
↓
Force Project Into WebForge Stack
```

---

# 31. NEW PROJECT MODE

إذا بدأ مشروعًا جديدًا:

```text
Developer chooses Stack
        ↓
WebForge records Stack
        ↓
WebForge generates appropriate standards
        ↓
WebForge generates relevant architecture
        ↓
WebForge generates tests
        ↓
WebForge generates security profile
```

WebForge يساعد المطور.

لا يستبدل قراره المعماري.

---

# 32. ADAPTIVE PROJECT PROFILE

أنشئ أو طوّر:

```text
PROJECT_PROFILE.md
```

ويجب أن يحتوي على:

```text
Project Type
Languages
Frameworks
Databases
ORM
API
Authentication
Authorization
Cache
Queues
Storage
Payments
AI
Testing
Infrastructure
Deployment
Localization
UI
Security Surface
Risk Profile
Verification Profile
```

---

# 33. VERIFICATION PROFILE

أنشئ concept:

```text
Verification Profile
```

مثال:

```text
PROFILE: WEB-NEXTJS-POSTGRES

ACTIVE:
- TypeScript
- Next.js
- PostgreSQL
- Prisma
- REST
- Browser
- Accessibility
- Responsive
- Security
- Performance

INACTIVE:
- MongoDB
- Laravel
- Django
- Kafka
- Kubernetes
```

---

# 34. RISK-BASED ACTIVATION

لا تعتمد فقط على technology.

مثلاً:

```text
File Upload
→ Upload Security

Payment
→ Financial Security

Multi-Tenant
→ Tenant Isolation

Admin Panel
→ Privilege Escalation

User Generated Content
→ XSS / Injection

WebSocket
→ Connection/Auth/DoS

AI Agent
→ Tool/Prompt/Context Security
```

---

# 35. FIX THE CURRENT GAP REGISTRY

بعد إصلاح architecture:

أعد بناء:

```text
reports/RUNTIME_GAP_REGISTRY.md
```

من الصفر بناءً على الواقع الجديد.

لا تحتفظ بأرقام قديمة إذا أصبحت غير صحيحة.

---

# 36. RE-RUN ALL RELEVANT TESTS

شغّل:

```text
existing tests
new tests
security tests
integration tests
runtime tests
CLI tests
```

لكن فقط ما ينطبق على المشروع.

---

# 37. REGRESSION TESTS

كل إصلاح معماري يجب أن يحصل على Regression Test مناسب.

خصوصًا:

```text
Stack Detection
Capability Detection
NOT APPLICABLE logic
Adapter selection
Verification profile
Report consistency
Anti-hallucination
```

---

# 38. TEST THE DETECTION ENGINE ITSELF

أنشئ Fixtures لمشاريع افتراضية/اختبارية:

### Fixture A

```text
Node
Next.js
PostgreSQL
Redis
```

### Fixture B

```text
Python
Django
MySQL
Celery
```

### Fixture C

```text
PHP
Laravel
MariaDB
Redis
```

### Fixture D

```text
Java
Spring
MongoDB
Kafka
```

### Fixture E

```text
Next.js
Firebase
```

### Fixture F

```text
Backend-only
Python
FastAPI
PostgreSQL
```

### Fixture G

```text
CLI-only
Rust
SQLite
```

وتحقق أن WebForge لا يخلط بينها.

---

# 39. TEST NEGATIVE DETECTION

اختبر ألا يكتشف WebForge تقنية لمجرد وجود كلمة في README.

مثال:

```text
README says PostgreSQL
Actual project uses MongoDB
```

يجب أن يعتمد على Evidence أقوى.

وكذلك:

```text
Dockerfile exists
but project does not actually use Docker
```

يجب ألا يفترض أن Docker هو runtime الوحيد.

---

# 40. EVIDENCE FOR DETECTION

كل Capability يجب أن تحتوي:

```text
Detected Technology
Evidence
Confidence
Detection Method
```

مثال:

```text
Redis
Confidence: HIGH
Evidence:
- package.json
- redis client import
- REDIS_URL
- runtime connection
```

---

# 41. ENVIRONMENT ADAPTER

أنشئ مفهوم:

```text
Environment Capability Detection
```

اكتشف:

```text
Docker available?
Database server available?
Redis available?
Browser available?
Node available?
Python available?
Java available?
Cloud credentials?
CI environment?
```

لكن:

> البيئة لا تحدد Stack المشروع.

بل تحدد:

> ما الذي يمكن التحقق منه الآن.

---

# 42. FINAL TRUTH MODEL

أنشئ:

```text
reports/WEBFORGE_FINAL_TRUTH_REPORT.md
```

بناءً على:

```text
Project Profile
+
Detected Stack
+
Applicable Capabilities
+
Executed Tests
+
Runtime Evidence
+
Infrastructure Evidence
+
Known Limitations
```

---

# 43. FINAL REPORT SECTIONS

يجب أن يحتوي التقرير النهائي على:

```text
1. Project Identity
2. Detected Stack
3. Architecture
4. Active Capabilities
5. Non-Applicable Capabilities
6. Verification Environment
7. Verified Controls
8. Partial Controls
9. Untested Controls
10. Environment Limitations
11. Known Risks
12. Contradictions Found
13. Contradictions Resolved
14. Code Fixes
15. Regression Tests
16. Evidence
17. Remaining Gaps
18. Final Truth
```

---

# 44. REQUIRED REPORTS

أنشئ/حدّث:

```text
PROJECT_CAPABILITIES.md

PROJECT_PROFILE.md

reports/CONTRADICTION_RECONCILIATION_REPORT.md

reports/RUNTIME_GAP_REGISTRY.md

reports/ADAPTIVE_VERIFICATION_PLAN.md

reports/REMEDIATION_CHANGELOG.md

reports/RUNTIME_EVIDENCE_INDEX.md

reports/WEBFORGE_FINAL_TRUTH_REPORT.md
```

---

# 45. DO NOT CREATE FALSE FINALITY

لا تكتب:

```text
MISSION COMPLETE
```

إذا بقيت:

```text
contradictions
unverified applicable capabilities
broken detection
false claims
failed tests
unknown stack
```

يمكن فقط اعتبار المهمة مكتملة إذا:

```text
Stack Detection = Verified
Capability Detection = Verified
Applicability Logic = Verified
Contradictions = Reconciled
Applicable Tests = Executed
Known Problems = Fixed or Documented
Reports = Consistent
Evidence = Available
```

---

# 46. FINAL SELF-AUDIT

قبل النهاية، أجب فعليًا:

```text
هل WebForge يفرض PostgreSQL؟
هل WebForge يفرض Redis؟
هل WebForge يفرض Node.js؟
هل WebForge يفرض Docker؟
هل WebForge يفرض Next.js؟
هل WebForge يفرض Playwright؟
هل كل ذلك أصبح Context-Aware؟

هل يميز NOT APPLICABLE عن NOT TESTED؟
هل يميز MOCKED عن REAL؟
هل يميز STATIC عن RUNTIME؟
هل يميز ROLLBACK عن BACKUP/RESTORE؟
هل يميز HTTP E2E عن Browser E2E؟
هل يميز Local Performance عن Production Performance؟

هل كل تقرير يعطي نفس الأرقام؟
هل كل Claim لديه Evidence؟
هل Stack Detection قابل للاختبار؟
هل Verification Planner قابل للاختبار؟
هل Adapter selection قابل للاختبار؟
هل Existing Project Mode يتكيف مع المشروع؟
هل New Project Mode يتكيف مع Stack الذي اختاره المطور؟

هل بقي أي contradiction؟
هل بقي أي false claim؟
هل بقي أي assumption غير مبرر؟
```

---

# 47. FINAL OUTPUT

في نهاية التنفيذ، اطبع:

```text
================================================================
WEBFORGE OS — ADAPTIVE STACK INTELLIGENCE FINAL RESULT
================================================================

Detected Stack:
Project Type:
Architecture:

Capabilities Detected:
Applicable Capabilities:
Not Applicable:
Verified:
Partially Verified:
Not Tested:
Environment Limitations:
Blocked:
Known Risks:

Contradictions Found:
Contradictions Resolved:

Code Fixes:
Architecture Fixes:
Detection Fixes:
Verification Fixes:
Report Fixes:

Regression Tests:
Total Tests:
Passed:
Failed:

Evidence:

FINAL TRUTH STATUS:
================================================================
```

---

# 48. ABSOLUTE FINAL PRINCIPLE

WebForge ليس Framework يفرض طريقة بناء المشروع.

WebForge هو:

> **Engineering Intelligence Layer that understands the project, adapts to its technology choices, verifies what actually exists, and improves it without replacing the developer's architectural decisions.**

المعادلة النهائية:

```text
DEVELOPER CHOOSES
        ↓
WEBFORGE DISCOVERS
        ↓
WEBFORGE UNDERSTANDS
        ↓
WEBFORGE ADAPTS
        ↓
WEBFORGE VERIFIES
        ↓
WEBFORGE IMPROVES
        ↓
WEBFORGE PROVES
```

وليس:

```text
WEBFORGE CHOOSES
        ↓
PROJECT MUST ADAPT
```

---

# 49. EXECUTION RULE

نفذ هذه المهمة بالكامل على WebForge OS.

لا تكتفِ بالتقارير.

إذا وجدت أن المشكلة في الكود أو architecture:

> أصلح الكود.

إذا وجدت أن المشكلة في verification engine:

> أصلحه.

إذا وجدت أن المشكلة في detection:

> أصلحه.

إذا وجدت أن المشكلة في report:

> أصلح التقرير.

إذا وجدت أن المشكلة في test:

> أصلح الاختبار.

إذا وجدت أن المشكلة مجرد Environment Limitation:

> لا تختلق نتيجة، وسجلها كما هي.

إذا وجدت أن Capability غير موجودة:

> صنفها `NOT APPLICABLE` ولا تحاول تشغيل أدوات لا تخص المشروع.

بعد الإصلاحات:

```text
RE-DISCOVER
→ RE-PROFILE
→ RE-PLAN
→ RE-TEST
→ RE-VERIFY
→ RECONCILE
→ UPDATE FINAL TRUTH
```

**لا تعتبر المهمة مكتملة قبل تنفيذ دورة التحقق الثانية بعد الإصلاحات.**

# END OF MISSION
