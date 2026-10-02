# PROMPT 26 — DEFENSIVE SECURITY VERIFICATION & VULNERABILITY ASSESSMENT

## EXECUTION PROTOCOL — MANDATORY

هذه المرحلة جزء من تطوير وتأمين مشروع `Online_shope` الذي نملكه ونطوره.

قبل التنفيذ:

1. افتح الملف الحالي:
   `Antigravity_Prompts/26_Authorized_Security_Assessment.md`

2. استبدل محتواه بالكامل بهذا الأمر.

3. احفظ الملف.

4. أغلقه ثم افتحه مرة أخرى من:
   `Antigravity_Prompts/26_Authorized_Security_Assessment.md`

5. اقرأه كاملًا.

6. اعتبر الملف هو المصدر الوحيد لتنفيذ هذه المرحلة.

7. لا تنفذ محتوى رسالة الـChat مباشرة.

---

# الهدف

إجراء **Defensive Security Verification** شامل للمشروع الحالي بهدف اكتشاف الأخطاء والثغرات الأمنية ونقاط الضعف في:

* Backend
* Frontend
* API
* Authentication
* Authorization
* Database
* Business Logic
* Payments
* Inventory
* Orders
* Coupons
* Reviews
* Admin
* Configuration
* Dependencies
* Error handling
* Production operations

الهدف هو:

`Review → Verify → Classify → Document`

وليس تنفيذ أي نشاط ضد أنظمة خارج المشروع.

---

# 1. Strict Scope

النطاق الوحيد:

* Repository الحالي.
* Source code الحالي.
* Local development environment.
* Local test environment.
* Test database.
* Test users.
* Test admin account.
* Test products/orders/coupons.
* Local APIs الخاصة بالمشروع.
* Payment Sandbox/Test configuration فقط إذا كانت موجودة.

ممنوع:

* أي نظام خارجي.
* أي Production system حقيقي.
* أي حساب مستخدم حقيقي.
* أي طرف ثالث.
* أي بيانات حقيقية.
* أي خدمة لا تخص المشروع.

---

# 2. Do Not Perform Destructive Testing

لا تستخدم:

* destructive payloads
* destructive database operations
* data deletion
* production traffic
* denial-of-service testing
* destructive file operations
* credential attacks ضد حسابات حقيقية
* أي نشاط قد يؤدي إلى تعطيل النظام.

استخدم فقط اختبارات آمنة ومحدودة على Test Environment.

---

# 3. First: Static Security Review

راجع الكود كاملًا قبل أي اختبار.

افحص:

* authentication
* authorization
* middleware
* controllers
* services
* database queries
* Prisma usage
* payment logic
* order logic
* inventory
* coupon validation
* admin operations
* file handling
* environment configuration
* logging
* error handling

ابحث عن:

* missing authorization
* IDOR/BOLA
* privilege escalation
* insecure direct object access
* mass assignment
* unsafe raw SQL
* sensitive data exposure
* hard-coded secrets
* insecure defaults
* weak validation
* insecure cookies
* unsafe CORS
* missing rate limits
* unsafe error messages
* race conditions
* duplicate operations
* business logic flaws

---

# 4. Dependency Security

افحص dependencies الخاصة بـ:

* Backend
* Frontend

استخدم أدوات package manager المناسبة.

صنف النتائج:

* Critical
* High
* Medium
* Low
* Informational

لا تعتبر advisory vulnerability قابلة للاستغلال تلقائيًا.

تحقق من:

* affected package
* installed version
* vulnerable path
* exploitability
* whether it is production dependency
* whether update is safe

لا تحدث dependency إلا إذا كان ذلك ضروريًا أو آمنًا.

---

# 5. Secret Detection

افحص repository بحثًا عن:

* API keys
* database credentials
* JWT secrets
* SMTP credentials
* payment secrets
* tokens
* private keys
* passwords

افحص أيضًا Git-tracked files.

إذا وجدت Secret حقيقي:

لا تعرض القيمة.

استخدم:

`REDACTED`

وسجل:

* location
* type
* severity
* remediation

---

# 6. Authentication Verification

راجع فعليًا:

### Registration

تحقق من:

* duplicate accounts
* validation
* password policy
* unexpected fields
* malformed input
* oversized input

### Login

تحقق من:

* invalid credentials
* nonexistent user
* rate limiting
* account enumeration
* session creation

### Sessions / Tokens

تحقق من:

* expiration
* refresh behavior
* revocation
* logout
* cookie security
* token handling

### Password Reset

تحقق من:

* token expiration
* token reuse
* invalid token
* rate limiting
* user enumeration

---

# 7. Authorization Verification

أنشئ Test identities:

* Customer A
* Customer B
* Admin

استخدم موارد اختبار خاصة بكل مستخدم.

تحقق من أن:

Customer A لا يستطيع الوصول إلى:

* Customer B orders
* Customer B addresses
* Customer B cart
* Customer B wishlist
* Customer B private data

وتحقق من أن:

Customer لا يستطيع الوصول إلى Admin operations.

اختبر الوصول مباشرة إلى API وليس فقط من خلال UI.

---

# 8. API Validation Verification

لكل API حساس، تحقق من:

* authentication
* authorization
* body validation
* query validation
* params validation
* unexpected fields
* invalid types
* boundary values
* negative values
* excessive values

تحقق أن الـAPI:

* يرفض input غير صالح.
* لا ينهار.
* لا يكشف stack trace.
* لا ينفذ operation غير مصرح به.

---

# 9. IDOR / BOLA Verification

راجع كل endpoint يستخدم:

* user ID
* order ID
* address ID
* cart item ID
* wishlist item ID
* review ID
* product ID
* coupon ID

تحقق أن resource ownership يتم التحقق منه Server-side.

وجود:

`GET /orders/:id`

مثلًا لا يعني أن معرفة ID كافية للوصول إلى الطلب.

---

# 10. Mass Assignment Verification

راجع جميع endpoints التي تستقبل objects.

تأكد أن المستخدم لا يستطيع تعديل fields داخلية مثل:

* role
* permissions
* payment status
* order status
* inventory
* verified flags
* admin flags
* internal pricing fields

استخدم explicit DTO/input schemas.

---

# 11. Injection Review

راجع Database operations.

خصوصًا:

* raw SQL
* `$queryRaw`
* `$executeRaw`

تحقق من parameterization.

راجع كذلك أي:

* shell execution
* template rendering
* dynamic HTML
* dynamic URLs

إذا لم توجد نقطة تعرض لهذا النوع من المخاطر، سجلها كـ:

`No vulnerable sink identified`

---

# 12. XSS Verification

راجع User-controlled content:

* Reviews
* Search
* Profile
* Product content
* Admin-entered content
* Query parameters

تحقق من:

* output encoding
* HTML rendering
* dangerous HTML APIs
* unsafe `innerHTML` أو equivalent
* stored user content

لا تستخدم destructive payloads.

يكفي إثبات whether untrusted content يمكن تفسيره كـexecutable markup.

---

# 13. CSRF Review

لأن Authentication يستخدم Cookies:

راجع جميع state-changing operations.

حدد هل architecture الحالية تحتاج CSRF protection إضافية.

راجع:

* SameSite
* Origin/Referer validation حيث مناسب
* CSRF tokens إذا كانت مطلوبة
* CORS

لا تفترض أن وجود Cookie flag وحده يثبت الحماية الكاملة.

---

# 14. CORS Verification

راجع actual server configuration.

تحقق من:

* allowed origins
* credentials
* methods
* headers
* preflight
* wildcard behavior

تأكد من عدم وجود:

`Wildcard Origin + Credentials`

في Production.

---

# 15. HTTP Security

راجع actual responses.

تحقق من:

* Helmet
* CSP
* HSTS
* frame protection
* X-Content-Type-Options
* Referrer-Policy

لا تعتبر middleware configured = PASS.

تحقق من النتيجة الفعلية.

---

# 16. Rate Limiting

راجع واختبر limits على Test Environment فقط.

تحقق من:

* Login
* Register
* Password reset
* Coupon validation
* Order creation
* Payment initialization
* General API

تحقق من أن limits تعمل فعليًا وأن configuration مناسبة للـproxy/load balancer إن وجد.

لا تنفذ traffic flooding.

---

# 17. Business Logic Verification

اختبر قواعد التجارة نفسها.

## Cart

تحقق من منع:

* negative quantities
* zero quantities
* excessive quantities
* invalid product
* invalid variant
* price manipulation

## Coupon

تحقق من:

* expiration
* usage limit
* per-user limit
* minimum order
* maximum discount
* fixed discount
* percentage discount
* duplicate use

## Checkout

تحقق من أن Server يعيد حساب:

* subtotal
* shipping
* discount
* tax
* total

ولا يثق في القيم القادمة من Frontend.

---

# 18. Order Security

تحقق من:

* ownership
* duplicate order prevention
* order status transitions
* cancellation authorization
* return authorization
* timeline integrity

Customer لا يستطيع تعديل:

* payment status
* order status
* fulfillment status
* internal fields

---

# 19. Inventory Verification

راجع concurrency protection.

تحقق من:

* stock validation
* reservation
* release
* cancellation
* failed payment
* concurrent checkout

استخدم عددًا محدودًا من Test Requests فقط.

الهدف إثبات صحة transaction/concurrency logic وليس تحميل النظام.

---

# 20. Payment Verification

استخدم Sandbox/Test environment فقط.

راجع:

* payment initialization
* callback
* webhook
* signature verification
* amount verification
* order matching
* duplicate event handling
* replay protection
* idempotency

تحقق من أن Frontend لا يستطيع تحديد:

`payment = SUCCESS`

بمجرد تعديل response أو request.

---

# 21. Admin Security

راجع كل Admin route.

تحقق من:

* authentication
* role verification
* authorization
* object ownership where applicable
* validation
* audit logging

اختبر Customer credentials على Admin APIs.

يجب أن تفشل جميع العمليات غير المصرح بها.

---

# 22. Error Disclosure

راجع Production-like error handling.

تأكد من عدم كشف:

* stack trace
* database errors
* filesystem paths
* secrets
* tokens
* internal architecture
* SQL details

Client يجب أن يحصل على safe error response.

---

# 23. Logging Security

راجع logs.

تأكد من عدم تسجيل:

* password
* access token
* refresh token
* cookies
* payment credentials
* secrets

تحقق من Request ID / Correlation ID.

---

# 24. Configuration Security

راجع:

`.env.example`

وconfiguration code.

تحقق من:

* required variables
* production validation
* insecure defaults
* CORS configuration
* cookie configuration
* JWT configuration
* payment configuration
* email configuration

---

# 25. Health & Operations Security

راجع:

* liveness
* readiness
* graceful shutdown
* startup validation
* database connection handling

Health endpoints يجب ألا تكشف أسرارًا أو معلومات داخلية حساسة.

---

# 26. Frontend Security Review

راجع:

* API token handling
* localStorage usage
* sensitive data exposure
* XSS sinks
* dangerous HTML
* route protection
* admin route protection
* API error rendering

مهم:

إخفاء Admin page في Frontend ليس Security Control.

Backend يجب أن يحمي API.

---

# 27. Security Test Suite

أضف أو وسّع automated security tests حسب الحاجة.

اختبر على الأقل:

* unauthorized access
* broken authorization
* IDOR/BOLA
* mass assignment
* invalid input
* price manipulation
* total manipulation
* quantity manipulation
* coupon abuse
* duplicate order
* duplicate webhook
* insufficient stock
* admin privilege escalation
* rate limiting
* error disclosure

يجب أن تكون الاختبارات deterministic.

---

# 28. Findings

لكل Finding حقيقي أنشئ:

### ID

مثل:

`SEC-001`

### Title

اسم واضح.

### Severity

* Critical
* High
* Medium
* Low
* Informational

### Component

مثال:

`POST /api/orders`

### Description

ما المشكلة؟

### Preconditions

ما المطلوب لحدوثها؟

### Reproduction

خطوات آمنة وقابلة لإعادة الإنتاج داخل Test Environment.

### Expected

السلوك الصحيح.

### Actual

السلوك الموجود.

### Impact

ما الأثر الأمني؟

### Root Cause

سبب المشكلة في الكود.

### Recommended Fix

الحل المقترح.

---

# 29. False Positives

لا تسجل شيء كـvulnerability بدون تحقق.

إذا وجدت حماية تمنع المشكلة:

سجل:

`VERIFIED PROTECTED`

إذا كانت النتيجة غير محسومة:

`NEEDS MANUAL REVIEW`

---

# 30. Security Assessment Report

أنشئ:

`Antigravity_Prompts/26_Security_Assessment_Report.md`

يجب أن يحتوي:

# Executive Summary

# Scope

# Environment

# Methodology

# Tools

# Security Controls Verified

# Findings

# Critical Findings

# High Findings

# Medium Findings

# Low Findings

# Informational Findings

# Verified Protections

# False Positives

# Dependency Findings

# Secret Findings

# Business Logic Findings

# Authentication Findings

# Authorization Findings

# API Findings

# Payment Findings

# Inventory Findings

# Admin Findings

# Recommendations

# Risk Summary

---

# 31. Severity Summary

أنشئ جدولًا:

| Severity      | Count |
| ------------- | ----: |
| Critical      |     0 |
| High          |     0 |
| Medium        |     0 |
| Low           |     0 |
| Informational |     0 |

ضع الأرقام الفعلية بعد انتهاء التقييم.

---

# 32. Do Not Remediate Yet

في هذه المرحلة:

**لا تقم بإصلاح Findings البرمجية الشاملة.**

أكمل Assessment أولًا.

أنشئ التقرير.

بعد ذلك ستكون هناك مرحلة منفصلة:

`27_Security_Remediation.md`

لإصلاح المشاكل.

---

# 33. Final Validation

بعد الانتهاء:

شغّل:

* lint
* typecheck
* security tests
* existing tests
* frontend build
* backend build

إذا فشل شيء بسبب تعديلات الاختبارات أو ملفات التقييم، أصلحه.

---

# 34. Important Reporting Rule

لا تقل:

`SECURE`

ولا تقل:

`VULNERABILITY FREE`

ولا تقل:

`100% SECURE`

حتى لو لم تجد vulnerabilities.

استخدم:

`SECURITY ASSESSMENT COMPLETED`

مع توضيح:

* ماذا تم فحصه.
* ماذا تم إثباته.
* ما الذي لم يتم اختباره.
* ما الذي يحتاج configuration.
* ما المخاطر المتبقية.

---

# 35. START

نفذ بالترتيب:

1. Update `26_Authorized_Security_Assessment.md` بهذا المحتوى.
2. Read the file.
3. Inspect the project.
4. Create isolated Test Environment if needed.
5. Perform defensive security verification.
6. Verify findings.
7. Create `26_Security_Assessment_Report.md`.
8. Add automated security tests where required.
9. Do NOT perform destructive testing.
10. Do NOT test external systems.
11. Do NOT remediate vulnerabilities yet.
12. Run final validation.
13. Return an accurate security assessment summary.

توقف بعد إكمال المرحلة `26`.

لا تبدأ `27` تلقائيًا.
