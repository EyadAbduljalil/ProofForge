# MASTER PROMPT

# Build a Unified Web Engineering Knowledge & Execution Repository

أنت تعمل الآن على بناء **المستودع المركزي المرجعي** الخاص بتطوير مواقع وتطبيقات الويب.

المجلد المرفق يحتوي على مجموعة كبيرة من المستودعات، الـ Skills، الـ Prompts، قواعد التصميم، أنظمة الـ QA، قواعد الأمن، مراجع UI/UX، قوالب، ومصادر أخرى تم جمعها من مشاريع سابقة.

مهمتك ليست نسخ هذه المستودعات إلى مجلد واحد.

مهمتك هي **تحليلها، تفكيكها، إزالة التكرار والتعارض، واستخراج أفضل ما فيها، ثم إعادة بناء نظام موحد واحد يمكن الاعتماد عليه كأساس لكل مشروع ويب مستقبلي.**

---

# 1. الهدف الأساسي

أنشئ مستودعًا واحدًا يمثل:

> **Single Source of Truth for Web Development**

ويكون قادرًا على توجيه بناء أي مشروع ويب من:

* Landing Page
* SaaS
* Dashboard
* E-commerce
* LMS
* Marketplace
* Admin Panel
* Portfolio
* Corporate Website
* Web Application
* API-backed Application
* Full-stack Application

بحيث لا أحتاج في كل مشروع إلى إعادة كتابة نفس التعليمات المتعلقة بـ:

* Architecture
* UI/UX
* Design System
* Responsive Design
* Accessibility
* Frontend
* Backend
* Database
* Authentication
* Authorization
* Security
* API
* Validation
* Error Handling
* Loading States
* Empty States
* Performance
* SEO
* Testing
* QA
* Deployment
* Production Readiness
* Code Quality
* Maintainability
* Mobile
* RTL/LTR
* Animation
* Motion
* Forms
* Tables
* Dashboards
* E-commerce logic
* Payments
* Notifications
* Logging
* Monitoring
* Observability

هذه القواعد يجب أن تصبح جزءًا من النظام نفسه، وليس شيئًا أكرره في كل Prompt.

---

# 2. أهم قاعدة

المستودع الناتج هو:

> **AUTHORITATIVE SOURCE OF TRUTH**

لكل مشروع جديد.

سواء تم تنفيذ المشروع باستخدام:

* Antigravity
* Claude
* Cursor
* Codex
* Lovable
* v0
* Replit
* Bolt
* Windsurf
* أو أي AI coding/building platform أخرى

فإن منصة البناء لا تعتبر مصدر القواعد.

المصدر هو هذا المستودع.

لا تسمح لمنصة التنفيذ بأن تستبدل قواعد المستودع بقواعدها الافتراضية.

إذا حدث تعارض بين:

1. متطلبات المشروع
2. قواعد هذا المستودع
3. Default behavior الخاص بمنصة البناء

فالأولوية تكون:

### Priority 1

Explicit project requirements

### Priority 2

Security / correctness / legal / accessibility requirements

### Priority 3

Rules of this repository

### Priority 4

Framework/platform conventions

### Priority 5

AI default behavior

لا تستخدم Default AI behavior عندما توجد قاعدة صريحة في المستودع.

---

# 3. لا تدمج الملفات بشكل أعمى

افحص جميع الملفات الموجودة في المصدر.

لا تقم بـ:

* Copy Everything
* Merge Everything
* Keep Duplicates
* Preserve Conflicting Rules
* Keep Multiple Versions of the Same Rule

بدلًا من ذلك:

### Analyze → Classify → Compare → Deduplicate → Resolve Conflicts → Normalize → Canonicalize → Organize

كل قاعدة يجب أن يكون لها مكان واحد واضح.

إذا كانت القاعدة موجودة في خمسة مستودعات، لا تحتفظ بخمس نسخ منها.

استخرج النسخة الأقوى، ثم ضعها في المكان canonical الصحيح.

---

# 4. تحليل المصادر

ابدأ أولًا بعمل Inventory كامل للمجلد.

اكتشف:

* repositories
* markdown files
* prompts
* skills
* templates
* rules
* references
* scripts
* configuration
* design tokens
* components
* examples
* checklists
* testing systems
* security rules
* API references
* duplicated content

قم بإنشاء تقرير داخلي يوضح:

* ماذا يحتوي كل مصدر؟
* ما الذي يستحق الاحتفاظ به؟
* ما الذي يتكرر؟
* ما الذي يتعارض؟
* ما الذي يجب دمجه؟
* ما الذي يجب تحويله إلى Rule؟
* ما الذي يجب تحويله إلى Skill؟
* ما الذي يجب تحويله إلى Checklist؟
* ما الذي يجب تحويله إلى Template؟
* ما الذي يجب أن يبقى Reference فقط؟
* ما الذي يجب استبعاده؟

لا تحذف المعلومات المهمة قبل التأكد من عدم فقدانها.

---

# 5. تصنيف المحتوى

أعد تصنيف جميع المعرفة في طبقات واضحة.

## CORE

القواعد الإلزامية التي تنطبق على كل مشروع.

مثال:

* Security baseline
* Accessibility baseline
* Responsive baseline
* Error handling
* Validation
* Testing
* Code quality
* Performance
* Project structure

---

## DOMAIN

قواعد خاصة بنوع المشروع.

مثل:

* Ecommerce
* SaaS
* LMS
* Dashboard
* Marketplace
* Fintech
* Healthcare
* Education
* Government
* Media
* Creative

---

## DESIGN

كل ما يتعلق بالتصميم:

* Design system
* Typography
* Color
* Spacing
* Layout
* Components
* Visual hierarchy
* UX
* Responsive
* Mobile
* Accessibility
* Motion
* Animation
* Interaction
* Empty states
* Loading states
* Error states
* Forms
* Tables
* Navigation
* Dashboards

---

## ENGINEERING

* Architecture
* Frontend
* Backend
* Database
* API
* State management
* Authentication
* Authorization
* Caching
* Queues
* Background jobs
* File storage
* Email
* Notifications
* Logging
* Monitoring
* Observability

---

## SECURITY

اجعل Security طبقة مستقلة وليست مجرد Prompt.

تشمل:

* Authentication
* Authorization
* RBAC
* Session security
* Password security
* JWT
* Cookies
* CSRF
* XSS
* SQL/NoSQL Injection
* SSRF
* IDOR/BOLA
* Rate limiting
* Brute force protection
* Input validation
* Output encoding
* File upload security
* Secrets
* Environment variables
* CORS
* CSP
* Security headers
* Dependency vulnerabilities
* Supply-chain security
* API security
* Payment security
* Webhook security
* Logging
* Audit trails
* Abuse prevention

---

## QUALITY

يشمل:

* Unit testing
* Integration testing
* E2E
* API testing
* UI testing
* Regression testing
* Accessibility testing
* Responsive testing
* Security testing
* Performance testing
* Build validation
* Type checking
* Linting
* Formatting
* Production readiness

---

# 6. Design Sources

يوجد في المشروع عدد من مصادر التصميم الخارجية والمرجعية.

تعامل معها كمصادر Inspiration / Reference وليس كقواعد متضاربة مستقلة.

المصادر:

* https://21st.dev/
* https://styles.refero.design/
* https://supahero.io/
* https://motion.dev/

كما يجب الاستفادة من المصادر الموجودة داخل المستودع مثل:

* anti-slop-design
* anti-slop
* impeccable
* taste-skill
* awesome-design-md
* skills

لكن لا تجعل أي مصدر خارجي يفرض تصميمًا جاهزًا على كل المشاريع.

استخرج منه:

* patterns
* principles
* component ideas
* interaction patterns
* motion patterns
* layout patterns
* visual systems

ثم اجعلها قابلة للتطبيق حسب سياق المشروع.

---

# 7. Anti-Slop System

يجب أن يكون هناك نظام صريح لمنع التصميمات الرديئة الناتجة عن AI.

لا تسمح تلقائيًا بـ:

* Generic SaaS layout
* Hero section مكرر
* Purple/blue gradient بلا سبب
* Glassmorphism عشوائي
* Cards everywhere
* excessive rounded corners
* excessive shadows
* random gradients
* meaningless animations
* excessive icons
* huge typography بلا hierarchy
* poor whitespace
* repetitive sections
* template-looking layouts
* fake statistics
* fake testimonials
* fake logos
* fake social proof
* unnecessary badges
* meaningless decorative elements
* excessive motion

أي تصميم يجب أن يكون له:

* visual hierarchy
* purpose
* information architecture
* interaction rationale
* responsive behavior
* accessibility consideration

---

# 8. Responsive Design

Responsive ليس مجرد:

```css
@media (max-width: ...)
```

يجب اختبار التصميم منطقيًا عبر:

* Mobile
* Tablet
* Laptop
* Desktop
* Large Desktop

ويجب تحليل:

* navigation
* typography
* spacing
* grids
* cards
* tables
* forms
* images
* dialogs
* sidebars
* dashboards
* overflow
* touch targets
* horizontal scrolling
* text wrapping

لا تعتبر الصفحة مكتملة إذا كانت Desktop جيدة وMobile مكسورة.

---

# 9. Accessibility

طبّق WCAG principles على مستوى النظام.

يجب مراجعة:

* semantic HTML
* keyboard navigation
* focus states
* contrast
* labels
* forms
* screen readers
* ARIA
* dialogs
* menus
* buttons
* links
* touch targets
* reduced motion
* error messages

Accessibility ليست مرحلة اختيارية في النهاية.

---

# 10. RTL / LTR

يجب أن يدعم النظام:

* LTR
* RTL

بدون hardcoding للاتجاه.

لا تستخدم:

```css
margin-left
padding-right
left
right
```

عندما يكون المنطق متعلقًا بالاتجاه.

استخدم logical properties عندما يكون ذلك مناسبًا:

```css
margin-inline
padding-inline
inset-inline
border-inline
text-align: start
```

اختبر Arabic وEnglish بشكل مستقل.

---

# 11. Engineering Rules

يجب أن يتضمن النظام قواعد موحدة لـ:

* naming
* folder structure
* components
* hooks
* services
* repositories
* controllers
* middleware
* schemas
* DTOs
* validation
* error handling
* logging
* configuration
* environment variables
* API contracts
* database access
* migrations
* transactions
* caching

لا تسمح بمنطق Business Logic موزع عشوائيًا داخل UI components.

---

# 12. Error Handling

كل عملية يجب أن تمتلك حالات واضحة:

### Success

### Loading

### Empty

### Error

### Partial failure

### Retry

### Unauthorized

### Forbidden

### Not found

### Validation error

### Network failure

### Server failure

لا تسمح بوجود:

```text
Something went wrong
```

بدون سياق مفيد للمستخدم أو logging مناسب للمطور.

ولا تعرض:

* stack traces
* secrets
* database errors
* internal implementation details

للمستخدم النهائي.

---

# 13. Forms

كل Form يجب أن يحتوي على:

* validation
* field states
* error states
* loading state
* success state
* disabled state
* keyboard behavior
* accessibility
* server-side validation
* client-side validation عند الحاجة

لا تعتمد على client-side validation وحدها.

---

# 14. Security by Default

أي Feature جديد يجب أن يخضع تلقائيًا لمراجعة أمنية.

مثال:

إذا أضيف endpoint:

```text
POST /api/orders
```

يجب التفكير تلقائيًا في:

* Authentication
* Authorization
* Input validation
* Ownership
* Rate limiting
* Abuse
* Idempotency
* Logging
* Audit
* Error leakage
* Transaction consistency
* Race conditions

لا تنتظر Prompt Security منفصلًا حتى يتم التفكير في الأمن.

---

# 15. Business Logic Integrity

أي نظام يحتوي على Business Logic يجب أن يتم اختباره ضد:

* duplicate operations
* race conditions
* invalid state transitions
* stale data
* inconsistent state
* double payment
* double order
* stock race
* coupon abuse
* privilege escalation
* invalid ownership
* orphan records
* partial transactions
* retry duplication

خصوصًا:

### Ecommerce

يجب مراجعة:

* cart
* stock
* coupons
* orders
* payment
* refund
* return
* shipment
* inventory
* order state machine

---

# 16. AI Agent Execution Protocol

أنشئ داخل المستودع بروتوكولًا موحدًا لأي AI Agent.

عند بدء أي مشروع يجب أن ينفذ:

## PHASE 0 — Repository Discovery

اقرأ قواعد المشروع.

## PHASE 1 — Project Discovery

افحص المشروع الحالي.

## PHASE 2 — Requirements

استخرج المتطلبات.

## PHASE 3 — Architecture

حدد architecture قبل implementation.

## PHASE 4 — Design System

حدد visual language.

## PHASE 5 — Implementation

نفذ على مراحل.

## PHASE 6 — Validation

اختبر كل Feature.

## PHASE 7 — Security Review

نفذ security audit.

## PHASE 8 — UX/UI Review

راجع التصميم.

## PHASE 9 — Responsive Review

راجع جميع breakpoints.

## PHASE 10 — Accessibility Review

راجع accessibility.

## PHASE 11 — Performance Review

راجع الأداء.

## PHASE 12 — Regression Testing

تأكد أن الإصلاحات لم تكسر أجزاء أخرى.

## PHASE 13 — Production Readiness

تحقق من الجاهزية.

لا تنتقل إلى المرحلة التالية إذا كانت المرحلة السابقة تحتوي على blocker.

---

# 17. Verification Loop

أي Feature يتم بناؤه يجب ألا يعتبر مكتملًا بمجرد كتابة الكود.

استخدم:

```text
BUILD
↓
RUN
↓
TEST
↓
INSPECT
↓
FIND ISSUES
↓
FIX
↓
RETEST
↓
REGRESSION TEST
↓
APPROVE
```

لا تستخدم:

```text
BUILD
↓
DONE
```

---

# 18. No Fake Completion

ممنوع كتابة:

```text
Done
Complete
Production ready
Fully secure
Fully responsive
All tests passed
```

إلا إذا تم إثباتها.

كل Claim يجب أن يكون مبنيًا على Evidence.

---

# 19. Evidence-Based Verification

أنشئ نظام Verification Report موحد.

يجب أن يسجل:

* What was tested
* How it was tested
* Result
* Failed checks
* Fixed issues
* Remaining issues
* Risk level
* Evidence

استخدم:

```text
PASS
FAIL
BLOCKED
NOT TESTED
NOT APPLICABLE
```

ولا تستخدم أوصافًا غامضة مثل:

```text
Looks good
Seems fine
Probably secure
Should work
```

---

# 20. Project-Level Configuration

أنشئ نظامًا يسمح لكل مشروع بتحديد:

```yaml
project:
  type:
  stack:
  language:
  framework:
  database:
  deployment:
  auth:
  payments:
  localization:
  rtl:
  accessibility:
  seo:
  performance:
```

وبناءً عليه يتم تفعيل الـ rules المناسبة.

لا تطبق قواعد Ecommerce على Landing Page بلا داعٍ.

ولا تطبق قواعد Mobile Native على Web Application.

---

# 21. Rule Precedence System

أنشئ نظام أولوية رسمي:

```text
P0 — Security / Safety / Correctness
P1 — Explicit Project Requirements
P2 — Core Repository Rules
P3 — Domain Rules
P4 — Design System Rules
P5 — Framework Conventions
P6 — Platform Defaults
P7 — AI Suggestions
```

أي Rule منخفضة الأولوية لا يجوز أن تكسر Rule أعلى منها.

---

# 22. Skills Architecture

لا تضع كل شيء في ملف واحد ضخم.

أنشئ Skills منفصلة مثل:

```text
skills/
  project-audit/
  architecture/
  frontend/
  backend/
  database/
  api/
  authentication/
  authorization/
  security/
  ui-ux/
  design-system/
  responsive/
  accessibility/
  rtl/
  motion/
  forms/
  dashboards/
  ecommerce/
  testing/
  performance/
  seo/
  deployment/
  production-readiness/
  anti-slop/
  code-review/
```

كل Skill يجب أن يكون:

* focused
* reusable
* composable
* testable
* framework-aware where necessary

---

# 23. Templates

أنشئ Templates عملية لـ:

* Project specification
* Architecture document
* Design system
* Security checklist
* QA checklist
* Production checklist
* Audit report
* Feature specification
* API specification
* Database specification
* Deployment checklist

---

# 24. Project Starter

أنشئ Template موحدًا لبداية أي مشروع.

يجب أن يحتوي على:

```text
PROJECT.md
REQUIREMENTS.md
ARCHITECTURE.md
DESIGN.md
SECURITY.md
TESTING.md
DEPLOYMENT.md
DECISIONS.md
```

---

# 25. Decision Records

أضف نظام ADR:

```text
docs/decisions/
```

أي قرار معماري مهم يجب أن يكون قابلًا للتوثيق.

مثل:

* لماذا اخترنا PostgreSQL؟
* لماذا اخترنا Redis؟
* لماذا اخترنا JWT؟
* لماذا اخترنا SSR؟
* لماذا اخترنا REST؟
* لماذا اخترنا هذا UI library؟

---

# 26. External References

أنشئ:

```text
references/
```

ولا تجعل الـ external references جزءًا من الـ core rules.

قسمها إلى:

```text
references/
  design/
  animation/
  accessibility/
  architecture/
  security/
  APIs/
  platforms/
  inspiration/
```

المصدر الخارجي يقدم Reference.

أما القرار النهائي فيأتي من Core Rules + Project Requirements.

---

# 27. API Sources

المصادر الضخمة مثل:

* API Mega List
* Public APIs

لا تجعلها تدخل مباشرة في Core.

أنشئ لها:

```text
references/apis/
```

مع فهرسة وتصنيف.

لا تجعل آلاف APIs تلوث الـ execution rules.

---

# 28. Platform Independence

المستودع يجب ألا يكون مرتبطًا بـ Antigravity فقط.

يجب أن تكون هناك طبقة:

```text
core/
```

ثم:

```text
adapters/
  antigravity/
  cursor/
  claude/
  codex/
  lovable/
  v0/
  replit/
  bolt/
```

الـ Core يحتوي القواعد الحقيقية.

الـ Adapter يحولها إلى الصيغة التي يفهمها كل Agent.

---

# 29. Universal Project Prompt

أنشئ ملفًا:

```text
AGENT.md
```

وهو الـ entry point.

يجب أن يكون قادرًا على توجيه أي AI Agent:

```text
Read repository rules.
Read project requirements.
Load applicable skills.
Determine architecture.
Determine applicable security requirements.
Determine design requirements.
Implement.
Validate.
Audit.
Fix.
Retest.
Report.
```

---

# 30. Do Not Reinvent Existing Rules

قبل إنشاء Rule جديدة:

1. ابحث عن Rule مشابهة.
2. قارنها بالموجود.
3. دمجها إذا كانت امتدادًا.
4. استبدلها إذا كانت أفضل.
5. أنشئ Rule جديدة فقط إذا لم يوجد لها equivalent.

---

# 31. Conflict Resolution

إذا وجدت تعارضًا بين المصادر:

لا تحتفظ بالاثنين.

حل التعارض بناءً على:

1. correctness
2. security
3. accessibility
4. maintainability
5. scalability
6. performance
7. simplicity

ثم وثق سبب اختيار القاعدة النهائية.

---

# 32. Deduplication

أزل:

* duplicate prompts
* duplicate skills
* duplicate copies
* platform-specific copies
* repeated README files
* repeated instructions
* repeated design rules

احتفظ بنسخة canonical واحدة.

---

# 33. Source Attribution

لكل مجموعة معرفة مهمة، احتفظ ببيانات:

```yaml
source:
  repository:
  original_file:
  category:
  adapted: true
  merged_from:
  notes:
```

حتى يمكن معرفة أصل القاعدة دون الاحتفاظ بالفوضى الأصلية.

---

# 34. Do Not Destroy Useful Knowledge

لا تحذف Knowledge لمجرد أنها تبدو مكررة.

افحص أولًا:

* semantic difference
* edge cases
* implementation difference
* platform difference
* security difference

ثم قرر.

---

# 35. Testing The Repository Itself

المستودع نفسه يجب أن يخضع لاختبارات.

أنشئ:

```text
tests/
```

اختبر:

* conflicting rules
* missing rules
* duplicate rules
* broken references
* invalid links
* malformed YAML/JSON
* missing metadata
* circular dependencies
* skill dependency problems
* rule precedence

---

# 36. Final Repository Structure

استخدم بنية قريبة من:

```text
web-engineering-os/
│
├── AGENT.md
├── README.md
├── CHANGELOG.md
├── LICENSE
│
├── core/
│   ├── principles/
│   ├── rules/
│   ├── standards/
│   └── policies/
│
├── skills/
│   ├── architecture/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   ├── api/
│   ├── security/
│   ├── design/
│   ├── responsive/
│   ├── accessibility/
│   ├── rtl/
│   ├── testing/
│   ├── performance/
│   ├── seo/
│   ├── deployment/
│   └── anti-slop/
│
├── domains/
│   ├── ecommerce/
│   ├── saas/
│   ├── lms/
│   ├── dashboard/
│   ├── marketplace/
│   └── corporate/
│
├── templates/
│   ├── project/
│   ├── architecture/
│   ├── design/
│   ├── security/
│   ├── testing/
│   └── deployment/
│
├── checklists/
│   ├── security/
│   ├── accessibility/
│   ├── responsive/
│   ├── performance/
│   ├── production/
│   └── qa/
│
├── references/
│   ├── design/
│   ├── animation/
│   ├── accessibility/
│   ├── APIs/
│   ├── platforms/
│   └── inspiration/
│
├── adapters/
│   ├── antigravity/
│   ├── cursor/
│   ├── claude/
│   ├── codex/
│   ├── lovable/
│   ├── v0/
│   └── generic/
│
├── examples/
│
├── tests/
│
├── scripts/
│
└── registry/
    ├── skills.json
    ├── rules.json
    ├── domains.json
    ├── references.json
    └── sources.json
```

هذه بنية مقترحة وليست قيدًا حرفيًا. عدّلها إذا كان هناك سبب معماري أقوى.

---

# 37. Master Registry

أنشئ Registry مركزيًا يوضح:

* rule
* skill
* domain
* dependency
* priority
* source
* status
* version

مثال:

```yaml
id: security.api.input-validation
type: rule
priority: P0
scope: api
mandatory: true
source:
  - anti-slop
  - Antigravity_Prompts
status: canonical
```

---

# 38. Project Bootstrap Engine

أنشئ نظامًا يستطيع أخذ مشروع جديد ثم تحديد:

```text
Project Type
↓
Tech Stack
↓
Applicable Domains
↓
Applicable Skills
↓
Applicable Security Rules
↓
Applicable Design Rules
↓
Applicable QA Rules
↓
Execution Plan
```

بدل تحميل جميع قواعد المستودع على كل مشروع.

---

# 39. Mandatory Pre-Build Audit

قبل كتابة الكود:

```text
Understand
→ Inspect
→ Plan
→ Identify risks
→ Identify dependencies
→ Identify security requirements
→ Identify responsive requirements
→ Identify accessibility requirements
→ Define acceptance criteria
→ Then implement
```

لا تبدأ مباشرة من UI أو Code.

---

# 40. Mandatory Post-Build Audit

بعد البناء:

```text
Functional Audit
Security Audit
UI Audit
UX Audit
Responsive Audit
Accessibility Audit
Performance Audit
SEO Audit
Code Quality Audit
Regression Audit
Production Audit
```

ثم:

```text
Fix → Retest → Verify
```

---

# 41. Visual QA

إذا كانت البيئة قادرة على تشغيل المشروع ورؤية الناتج بصريًا، يجب استخدام ذلك.

راجع:

* alignment
* spacing
* typography
* hierarchy
* responsive behavior
* overflow
* clipping
* inconsistent components
* visual noise
* poor contrast
* broken states
* mobile navigation

لا تعتمد على قراءة الكود فقط لتقييم UI.

---

# 42. Functional QA

اختبر المسارات الفعلية للمستخدم.

مثال:

```text
Register
→ Login
→ Browse
→ Search
→ Create
→ Edit
→ Delete
→ Logout
```

وفي Ecommerce:

```text
Browse
→ Product
→ Cart
→ Checkout
→ Payment
→ Order
→ Tracking
→ Return/Refund
```

---

# 43. Security QA

لا تكتفِ بوجود Security middleware.

اختبر behavior الفعلي.

مثال:

* Unauthorized access
* Broken authorization
* IDOR
* malformed input
* rate-limit bypass
* expired sessions
* privilege escalation
* invalid state transitions
* duplicate requests
* malicious file upload
* sensitive error leakage

---

# 44. Performance

افحص:

* bundle size
* image optimization
* lazy loading
* caching
* database queries
* N+1
* API latency
* unnecessary renders
* client-side JavaScript
* Core Web Vitals where applicable

لا تضف optimization عشوائيًا.

اعتمد على evidence.

---

# 45. SEO

عند كون المشروع public-facing، راجع:

* metadata
* title
* description
* canonical
* sitemap
* robots
* Open Graph
* structured data
* semantic HTML
* headings
* URLs
* crawlability

---

# 46. Completion Standard

لا يعتبر المشروع مكتملًا حتى:

```text
Requirements = Verified
Architecture = Verified
Implementation = Verified
Security = Verified
UI = Verified
Responsive = Verified
Accessibility = Verified
Testing = Verified
Performance = Reviewed
SEO = Reviewed
Production = Reviewed
```

إذا بقي شيء غير مختبر، يجب تسجيله صراحة.

---

# 47. Final Deliverables

بعد دمج المصادر، يجب أن تنتج:

1. Unified Repository
2. AGENT.md
3. Core Rules
4. Skills
5. Domain Rules
6. Templates
7. Checklists
8. Adapters
9. Registry
10. Tests
11. Documentation
12. Migration/source mapping

---

# 48. Migration Report

أنشئ تقريرًا:

```text
MIGRATION_REPORT.md
```

يوضح:

* Sources analyzed
* Files analyzed
* Rules extracted
* Rules merged
* Rules removed as duplicates
* Conflicts resolved
* Skills created
* Templates created
* References preserved
* Sources excluded
* Reasons for exclusion
* Important knowledge preserved
* Missing areas

---

# 49. No Silent Decisions

إذا قررت:

* حذف شيء
* دمج شيء
* استبدال Rule
* تجاهل مصدر
* تغيير Architecture
* تغيير Rule

وثّق السبب.

لا تتخذ قرارات جوهرية بصمت.

---

# 50. Final Principle

هذا المستودع ليس:

> Prompt Collection

وليس:

> Design Inspiration Collection

وليس:

> Security Checklist

وليس:

> Antigravity Prompt Pack

بل:

> **A reusable Web Engineering Operating System for AI-assisted software development.**

يجب أن يجعل بدء مشروع جديد أقرب إلى:

```text
Load Repository
↓
Describe Project
↓
Bootstrap
↓
Build
↓
Verify
↓
Fix
↓
Retest
↓
Ship
```

بدل:

```text
Start project
↓
Remember all requirements manually
↓
Write huge prompt
↓
Repeat security rules
↓
Repeat responsive rules
↓
Repeat design rules
↓
Repeat QA rules
↓
Repeat everything again
```

---

# EXECUTION INSTRUCTION

ابدأ الآن.

لا تبدأ بكتابة المشروع النهائي مباشرة.

نفّذ أولًا:

### STEP 1

Inventory كامل للمصادر.

### STEP 2

Classify كل مصدر.

### STEP 3

Detect duplicates.

### STEP 4

Detect conflicts.

### STEP 5

Extract canonical knowledge.

### STEP 6

Design the unified architecture.

### STEP 7

Build the repository.

### STEP 8

Validate repository integrity.

### STEP 9

Run consistency checks.

### STEP 10

Review the repository as if another AI Agent will use it without human assistance.

### STEP 11

Fix ambiguities.

### STEP 12

Generate `MIGRATION_REPORT.md`.

### STEP 13

Generate the final `AGENT.md`.

لا تعتبر المهمة مكتملة بمجرد إنشاء الملفات.

المعيار الحقيقي للنجاح هو:

> هل يستطيع AI Agent جديد الدخول إلى هذا المستودع، فهم القواعد، تحديد ما ينطبق على المشروع، بناء المشروع، اختباره، اكتشاف أخطائه، إصلاحها، ثم تقديم تقرير Evidence-based — بدون أن أضطر إلى إعادة شرح نفس القواعد في كل مشروع؟

إذا كانت الإجابة لا، فالمستودع لم يكتمل بعد.
