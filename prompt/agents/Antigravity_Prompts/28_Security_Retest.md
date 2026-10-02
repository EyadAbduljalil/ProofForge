# PROMPT 28 — SECURITY RETEST & FINAL VULNERABILITY VERIFICATION

## EXECUTION PROTOCOL — MANDATORY

قبل تنفيذ أي شيء:

1. أنشئ ملفًا جديدًا داخل:
   `Antigravity_Prompts/`

2. اسم الملف:
   `28_Security_Retest.md`

3. انسخ هذا الأمر كاملًا إلى الملف دون حذف أو اختصار أو إعادة صياغة.

4. احفظ الملف.

5. أغلقه ثم افتحه مرة أخرى من:
   `Antigravity_Prompts/28_Security_Retest.md`

6. اقرأ الملف كاملًا.

7. اعتبر الملف المصدر الوحيد لتنفيذ هذه المرحلة.

8. لا تنفذ الأمر مباشرة من رسالة الـChat.

---

# الهدف

إجراء **Security Retest** بعد تنفيذ:

* Prompt 25 — Backend Security Hardening
* Prompt 26 — Defensive Security Assessment
* Prompt 27 — Security Remediation

الهدف:

`Re-Test → Verify Fixes → Discover Regression → Discover New Issues → Report`

هذه ليست إعادة كتابة للتقرير السابق.

يجب التحقق من أن الإصلاحات تعمل فعليًا وأنها لم تنشئ مشاكل جديدة.

---

# 1. Read Previous Reports

اقرأ:

`Antigravity_Prompts/26_Security_Assessment_Report.md`

و:

`Antigravity_Prompts/27_Security_Remediation_Report.md`

استخرج جميع Findings السابقة.

أنشئ داخليًا قائمة:

* Fixed
* Configuration Required
* False Positive
* Accepted Risk
* Needs Manual Review

---

# 2. Verify Every Previous Finding

لكل Finding تم تصنيفه:

`FIXED`

يجب إثبات أن المشكلة لم تعد موجودة.

لا تقبل:

"الكود يبدو صحيحًا"

كإثبات كافٍ.

استخدم Verification مناسبًا.

---

# 3. Regression Verification

تحقق خصوصًا من التعديلات التي تمت في Prompt 27.

راجع:

* `rateLimiter.ts`
* `productRoutes.ts`
* `security.test.ts`
* Authentication
* Financial calculations
* Correlation IDs

وتأكد أن الإصلاحات:

* تعمل
* لا يمكن تجاوزها
* لا تكسر functionality الطبيعية
* لا تفتح vulnerability جديدة

---

# 4. Authentication Retest

أعد اختبار:

* Registration
* Login
* Logout
* Session
* Refresh
* Password reset
* Token expiration
* Invalid credentials
* Rate limiting
* Cookie security

تحقق من عدم وجود:

* account takeover path
* session fixation
* token leakage
* predictable tokens
* authentication bypass

---

# 5. Authorization Retest

استخدم Test identities:

* Customer A
* Customer B
* Admin

أعد التحقق من:

* Order ownership
* Address ownership
* Cart ownership
* Wishlist ownership
* Review ownership
* Customer profile access
* Admin APIs

تحقق من:

Horizontal privilege escalation

و:

Vertical privilege escalation

خصوصًا بعد أي تغييرات سابقة في routes أو middleware.

---

# 6. IDOR / BOLA Retest

راجع كل endpoint يستخدم identifiers.

تحقق من:

* User IDs
* Order IDs
* Address IDs
* Cart IDs
* Cart Item IDs
* Wishlist IDs
* Review IDs
* Product IDs

يجب أن يتم authorization قبل إرجاع البيانات أو تنفيذ التعديل.

---

# 7. Mass Assignment Retest

راجع جميع input DTOs.

حاول التأكد أن Client لا يستطيع إرسال fields إضافية لتغيير:

* role
* permissions
* payment status
* order status
* inventory
* verified flags
* internal fields

يجب أن تكون Server-controlled.

---

# 8. API Security Retest

راجع كل endpoint.

تحقق من:

* authentication
* authorization
* validation
* rate limiting
* ownership
* error handling

ابحث عن routes تم إضافتها أو تعديلها في Prompt 27.

خصوصًا:

`/api/products`

وكل route حساس.

---

# 9. Input Validation Retest

اختبر بشكل آمن:

* empty input
* null
* wrong types
* negative numbers
* zero
* very large numbers
* oversized strings
* unexpected fields
* invalid IDs
* invalid enum values

تأكد أن API لا:

* crashes
* leaks errors
* bypasses validation

---

# 10. Business Logic Retest

## Cart

تحقق من:

* quantity
* price
* product
* variant
* stock

## Coupons

تحقق من:

* expiration
* usage
* per-user limit
* minimum order
* maximum discount
* duplicate usage

## Checkout

تحقق أن Server يعيد حساب:

* subtotal
* shipping
* discount
* tax
* total

## Orders

تحقق من:

* duplicate creation
* ownership
* status transitions
* cancellation
* returns

---

# 11. Payment Retest

راجع PaymentProvider بالكامل.

استخدم Sandbox/Test configuration فقط.

تحقق من:

* initialization
* callback
* webhook
* signature verification
* amount verification
* order matching
* duplicate webhook
* replay handling
* idempotency

مهم:

`SEC-002` من التقرير السابق يجب أن تبقى:

`CONFIGURATION REQUIRED`

إذا كانت مفاتيح Production أو Sandbox الحقيقية غير متوفرة.

لا تخترع credentials.

لا تعتبر Payment Production-ready بدون provider configuration فعلي.

---

# 12. Inventory Retest

تحقق من:

* stock validation
* reservation
* release
* cancellation
* failed payment
* concurrent checkout

تأكد من:

`stock >= 0`

وعدم حدوث Overselling.

استخدم اختبارات محدودة وآمنة على Test Database.

---

# 13. Rate Limiting Retest

راجع:

* global limiter
* auth limiter
* product limiter
* order limiter
* coupon limiter

تحقق أن:

* limits تعمل
* limits لا يمكن تجاوزها بسهولة
* normal traffic لا يتم حظره بشكل غير منطقي

لا تستخدم traffic flooding.

---

# 14. CORS Retest

تحقق من actual HTTP responses.

اختبر:

* allowed origin
* unauthorized origin
* credentials
* preflight

تأكد من عدم وجود:

`Wildcard + Credentials`

---

# 15. Cookie Retest

تحقق من:

* HttpOnly
* Secure
* SameSite
* expiration
* domain/path

راجع الفرق بين:

Development

و:

Production

وتأكد أن Production لا يستخدم إعدادات غير آمنة.

---

# 16. Security Headers Retest

تحقق من HTTP responses الفعلية.

راجع:

* CSP
* HSTS
* X-Content-Type-Options
* Referrer-Policy
* frame protection

لا تعتبر middleware configuration وحدها دليلًا.

---

# 17. Error Disclosure Retest

تعمد إلى إحداث أخطاء متوقعة داخل Test Environment.

تأكد من عدم كشف:

* stack traces
* filesystem paths
* SQL details
* database information
* secrets
* internal implementation

---

# 18. Secret Retest

أعد فحص:

* source
* configuration
* Git tracked files

لـ:

* API keys
* JWT secrets
* passwords
* database credentials
* payment secrets
* SMTP credentials
* private keys

إذا وجدت Secret:

لا تعرضه.

استخدم:

`REDACTED`

---

# 19. Dependency Retest

أعد تشغيل dependency security audit.

قارن النتيجة بالمرحلة 26.

حدد:

* Fixed
* Still Present
* New
* Not Exploitable

---

# 20. Frontend Security Retest

راجع:

* authentication handling
* admin routes
* token exposure
* localStorage
* unsafe HTML
* XSS sinks
* sensitive data exposure
* API error rendering

تأكد أن Frontend لا يتجاوز Backend security.

---

# 21. Admin Retest

اختبر كل Admin capability.

تحقق من:

* Dashboard
* Products
* Categories
* Inventory
* Orders
* Customers
* Coupons
* Reviews

وتأكد من أن Customer لا يستطيع تنفيذ أي Admin operation.

---

# 22. Race Condition Retest

راجع العمليات الحساسة:

* Order creation
* Inventory
* Coupon usage
* Payment webhook

تحقق من عدم وجود:

* duplicate orders
* duplicate payments
* negative stock
* duplicate coupon usage
* inconsistent state

استخدم Test Environment فقط وبمعدل آمن.

---

# 23. New Vulnerability Review

لا تقتصر على Findings السابقة.

ابحث عن vulnerabilities جديدة نتجت عن Prompt 27.

خصوصًا التغييرات في:

* routes
* rate limiter
* security middleware
* DTOs
* tests
* payment
* authentication

---

# 24. Security Test Suite

شغّل جميع الاختبارات الأمنية.

يجب أن تشمل على الأقل:

* authentication
* authorization
* IDOR/BOLA
* mass assignment
* financial manipulation
* coupon abuse
* duplicate order
* payment verification
* inventory concurrency
* rate limiting
* error disclosure

إذا كانت الاختبارات غير كافية، أضف اختبارات Regression مناسبة.

---

# 25. No Remediation During Retest

مهم جدًا:

**لا تصلح vulnerabilities أثناء هذه المرحلة.**

إذا وجدت مشكلة:

1. أثبتها.
2. وثقها.
3. صنف Severity.
4. أضف evidence.
5. لا تغير الكود لإخفائها.

سيكون الإصلاح في Prompt منفصل بعد انتهاء Retest.

الاستثناء الوحيد:

إذا كان هناك خطأ يمنع تشغيل Test Environment نفسه، أصلح الحد الأدنى اللازم لتشغيل الاختبار، وسجل ذلك بوضوح.

---

# 26. Severity Classification

استخدم:

### Critical

سيطرة واسعة، كشف شديد الحساسية، أو تأثير تجاري/أمني شديد.

### High

تأثير أمني كبير وقابل للاستغلال عمليًا.

### Medium

تأثير متوسط أو يحتاج شروطًا إضافية.

### Low

تأثير محدود.

### Informational

ملاحظة أو تحسين بدون تأثير أمني مباشر.

لا تضخم Severity.

---

# 27. Finding Format

لكل vulnerability حقيقية:

### ID

`RETEST-001`

### Severity

### Title

### Component

### Affected File / Endpoint

### Preconditions

### Reproduction

### Expected

### Actual

### Impact

### Root Cause

### Previous Finding?

Yes / No

### Previous Fix Verified?

Yes / No / N/A

---

# 28. Retest Report

أنشئ:

`Antigravity_Prompts/28_Security_Retest_Report.md`

ويجب أن يحتوي:

# Executive Summary

# Scope

# Environment

# Previous Findings

# Retest Results

# Fixed Findings Verified

# Findings Still Open

# New Findings

# Configuration Required

# False Positives

# Security Controls Verified

# Regression Testing

# Dependency Results

# Risk Summary

---

# 29. Mandatory Summary Table

أنشئ:

| ID | Severity | Finding | Previous Status | Retest Status |
| -- | -------- | ------- | --------------- | ------------- |

استخدم:

* VERIFIED FIXED
* STILL OPEN
* NEW
* CONFIGURATION REQUIRED
* FALSE POSITIVE
* NEEDS MANUAL REVIEW

---

# 30. Final Counts

أعطِ الأرقام الفعلية:

* Critical
* High
* Medium
* Low
* Informational
* Configuration Required
* Needs Manual Review

---

# 31. Final Technical Validation

في نهاية Retest شغّل:

* lint
* typecheck
* all tests
* security tests
* frontend build
* backend build

وسجل النتائج الفعلية.

---

# 32. Final Status

استخدم واحدة فقط:

`SECURITY RETEST PASSED — NO OPEN HIGH/CRITICAL FINDINGS`

إذا لم توجد High/Critical مفتوحة.

أو:

`SECURITY RETEST FAILED — OPEN SECURITY FINDINGS`

إذا بقيت ثغرات.

أو:

`SECURITY RETEST INCOMPLETE`

إذا تعذر إكمال الاختبار.

لا تستخدم:

`100% SECURE`

ولا:

`VULNERABILITY FREE`

---

# 33. START

نفّذ بالترتيب:

1. Create `28_Security_Retest.md`.
2. Copy this Prompt بالكامل إليه.
3. Read the file.
4. Read Reports 26 و27.
5. Re-test previous findings.
6. Search for new vulnerabilities.
7. Validate every finding.
8. Run security regression tests.
9. Run lint.
10. Run typecheck.
11. Run all tests.
12. Run frontend build.
13. Run backend build.
14. Create `28_Security_Retest_Report.md`.
15. لا تصلح vulnerabilities في هذه المرحلة.
16. لا تبدأ Prompt 29 تلقائيًا.
17. توقف بعد إصدار التقرير النهائي.
