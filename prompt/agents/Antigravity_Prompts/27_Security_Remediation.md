# PROMPT 27 — SECURITY REMEDIATION & HARDENING

## EXECUTION PROTOCOL — MANDATORY

قبل تنفيذ أي شيء:

1. أنشئ ملفًا جديدًا داخل:
   `Antigravity_Prompts/`

2. اسم الملف:
   `27_Security_Remediation.md`

3. انسخ هذا الأمر كاملًا إلى الملف دون حذف أو اختصار أو إعادة صياغة.

4. احفظ الملف.

5. أغلق الملف ثم افتحه مرة أخرى من:
   `Antigravity_Prompts/27_Security_Remediation.md`

6. اقرأ الملف كاملًا.

7. اعتبر الملف المصدر الوحيد لتنفيذ هذه المرحلة.

8. لا تنفذ الأمر مباشرة من رسالة الـChat.

---

# الهدف

تنفيذ مرحلة:

**Security Findings → Root Cause → Remediation → Regression Testing**

اعتمادًا على:

`Antigravity_Prompts/26_Security_Assessment_Report.md`

والكود الفعلي الحالي.

لا تفترض أن تقرير المرحلة 26 كامل أو صحيح لمجرد أنه يقول `VERIFIED PROTECTED`.

راجع النتائج مقابل الكود الفعلي.

---

# 1. Read Previous Security Report

اقرأ:

`Antigravity_Prompts/26_Security_Assessment_Report.md`

واستخرج جميع:

* Critical
* High
* Medium
* Low
* Informational
* Needs Manual Review
* Configuration Required

ثم اربط كل Finding بالملف أو الـendpoint المتأثر.

---

# 2. Re-Validate Findings

قبل الإصلاح:

تحقق من كل Finding.

لكل Finding حدد:

* هل المشكلة حقيقية؟
* هل هي قابلة للاستغلال؟
* ما السبب؟
* ما الأثر؟
* هل تحتاج Code Fix؟
* هل تحتاج Configuration Fix؟
* هل هي False Positive؟

لا تصلح False Positive على حساب استقرار النظام.

---

# 3. Fix Real Security Issues

أصلح جميع المشاكل الأمنية الحقيقية الموجودة ضمن نطاق المشروع.

الأولوية:

`Critical → High → Medium → Low → Informational`

إذا لم توجد Critical/High/Medium، لا تنشئ مشاكل وهمية لمجرد وجود مرحلة Remediation.

---

# 4. Authentication Hardening

راجع Authentication مرة أخرى.

تأكد من:

* secure password hashing
* password validation
* login rate limiting
* refresh token security
* token expiration
* token revocation
* logout
* password reset
* forgot password
* session invalidation
* secure cookies
* no sensitive token leakage

لا تستخدم:

* plaintext passwords
* predictable tokens
* hard-coded secrets
* insecure fallback secrets

---

# 5. Authorization Hardening

راجع جميع الموارد وليس Admin فقط.

تأكد من Server-side authorization لكل:

* Users
* Addresses
* Cart
* Wishlist
* Orders
* Reviews
* Coupons
* Products
* Admin operations

تأكد من منع:

* IDOR
* BOLA
* horizontal privilege escalation
* vertical privilege escalation

لا تعتمد على Frontend route protection.

---

# 6. Input & DTO Hardening

راجع جميع Zod schemas.

تأكد من:

* strict validation
* unexpected field rejection
* type validation
* boundary validation
* string limits
* numeric limits
* enum validation

لا تسمح Client-controlled fields مثل:

* role
* permissions
* payment status
* order status
* inventory
* verified flags

إلا من خلال Server-controlled workflows.

---

# 7. API Hardening

راجع كل endpoint.

لكل endpoint تأكد من:

* authentication requirement
* authorization requirement
* validation
* rate limit
* error handling
* ownership checks
* transaction requirements

إذا وجدت endpoint غير محمي، أصلحه.

إذا كان endpoint يجب أن يكون Public، وثّق سبب ذلك.

---

# 8. Business Logic Hardening

راجع:

## Cart

يجب منع:

* negative quantity
* excessive quantity
* invalid product
* invalid variant
* client price manipulation

## Coupon

يجب منع:

* expiration bypass
* usage limit bypass
* per-user limit bypass
* minimum order bypass
* maximum discount bypass
* duplicate usage

## Checkout

يجب أن يعيد Server حساب:

* subtotal
* shipping
* discount
* tax
* total

ولا يقبل القيم المالية من Client كمصدر للحقيقة.

---

# 9. Order Security

راجع:

* order ownership
* order creation
* duplicate orders
* status transitions
* cancellation
* returns
* timeline

Customer لا يستطيع تعديل:

* payment status
* fulfillment status
* order status
* internal fields

إلا عبر workflows مصرح بها.

---

# 10. Payment Hardening

راجع:

* PaymentProvider
* payment initialization
* callbacks
* webhooks
* signatures
* amount verification
* order matching
* duplicate event handling
* idempotency
* failure handling

لا تعتمد على Frontend لتأكيد الدفع.

لا تخزن:

* card number
* CVV
* sensitive payment credentials

---

# 11. Inventory Hardening

راجع concurrency logic.

تأكد من:

* atomic stock changes
* reservations
* releases
* cancellation
* failed payment handling
* concurrent checkout

يجب ألا يحدث:

`stock < 0`

ولا Overselling.

---

# 12. Idempotency Hardening

راجع استخدام:

`x-idempotency-key`

خصوصًا في:

* order creation
* payment initialization
* webhook processing
* refunds إذا كانت موجودة

تأكد من أن retry لا يؤدي إلى:

* duplicate Order
* duplicate Payment
* duplicate inventory deduction
* duplicate coupon usage

---

# 13. Rate Limiting Hardening

راجع limits الحالية.

تحقق من أنها مناسبة لـ:

* login
* register
* password reset
* coupon validation
* order creation
* payment initialization
* public API

لا تجعل rate limiting يؤدي إلى تعطيل المستخدمين الطبيعيين.

---

# 14. Error Handling

تأكد من أن Production responses لا تكشف:

* stack traces
* filesystem paths
* SQL details
* environment variables
* secrets
* internal implementation

استخدم error codes/messages آمنة.

Server logs يجب أن تحتوي التفاصيل الضرورية للتشخيص فقط.

---

# 15. Logging Security

راجع جميع logs.

يجب ألا يتم تسجيل:

* passwords
* JWT
* refresh tokens
* cookies
* payment secrets
* API keys
* SMTP passwords

احتفظ بـRequest ID للتتبع.

---

# 16. CORS Hardening

راجع CORS configuration.

Production يجب ألا يسمح بـ:

`*`

مع authenticated credentials.

اجعل origins صريحة وقابلة للضبط من environment configuration.

---

# 17. Cookie Hardening

راجع Authentication cookies.

في Production استخدم الإعدادات الأمنية المناسبة:

* HttpOnly
* Secure
* SameSite
* proper expiration
* proper path/domain

لا تجعل Development configuration تتسرب إلى Production.

---

# 18. Environment Security

راجع:

`.env.example`

وتأكد من:

* no real secrets
* no hard-coded credentials
* no insecure production defaults
* required variable validation

وتحقق من:

`.gitignore`

وGit tracked files.

---

# 19. Database Security

راجع Prisma schema والاستعلامات.

تحقق من:

* constraints
* ownership checks
* indexes
* transactions
* raw SQL usage
* transaction boundaries

لا تضف raw SQL إلا عند الضرورة.

---

# 20. Security Headers

تحقق من:

* Helmet
* CSP
* HSTS
* X-Content-Type-Options
* Referrer-Policy
* frame protection

تأكد من actual HTTP behavior.

لا يكفي وجود middleware فقط.

---

# 21. Health & Operations

راجع:

* liveness
* readiness
* graceful shutdown
* startup validation
* database connectivity

Health endpoints يجب ألا تكشف secrets.

---

# 22. Frontend Security

راجع Frontend بحثًا عن:

* sensitive data
* tokens
* secrets
* unsafe HTML rendering
* XSS sinks
* unsafe URL handling
* exposed admin functionality
* insecure localStorage usage

لا تجعل Frontend مصدر الحقيقة لأي security-sensitive operation.

---

# 23. Dependency Remediation

إذا كان Security Assessment اكتشف dependency vulnerability:

قيّمها.

إذا كان التحديث الآمن متاحًا:

1. حدّث dependency.
2. شغّل tests.
3. شغّل lint.
4. شغّل typecheck.
5. شغّل build.

لا تقم بتحديث شامل غير ضروري.

---

# 24. Automated Security Regression Tests

لكل vulnerability تم إصلاحها، أضف regression test عندما يكون ذلك مناسبًا.

الهدف:

إذا عاد الخطأ مستقبلًا، يفشل الاختبار.

اختبر على الأقل:

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

---

# 25. Do Not Reduce Security

ممنوع إصلاح vulnerability عن طريق:

* تعطيل feature
* إزالة validation
* إزالة authentication
* تخفيف authorization
* تعطيل tests
* استخدام `any`
* تجاهل TypeScript
* تعطيل ESLint
* إخفاء errors
* hard-coding solution

الإصلاح يجب أن يعالج Root Cause.

---

# 26. Regression Testing

بعد كل مجموعة إصلاحات:

شغّل الاختبارات المتعلقة بها.

ثم في النهاية شغّل:

* lint
* typecheck
* all tests
* security tests
* frontend build
* backend build

---

# 27. Full Security Re-Review

بعد الإصلاح:

أعد مراجعة المناطق الحساسة بالكامل:

* Auth
* RBAC
* API
* Database
* Cart
* Checkout
* Payments
* Orders
* Inventory
* Coupons
* Reviews
* Admin
* Configuration
* Logging

لا تكتفِ بإعادة اختبار الـFinding نفسه.

تأكد أن الإصلاح لم يخلق vulnerability جديدة.

---

# 28. Update Security Report

لا تحذف التقرير القديم.

أنشئ:

`Antigravity_Prompts/27_Security_Remediation_Report.md`

يحتوي:

## Executive Summary

## Findings Reviewed

## Findings Fixed

## False Positives

## Configuration Issues

## Regression Tests

## Security Improvements

## Remaining Risks

---

# 29. Findings Table

أنشئ جدولًا:

| ID | Original Severity | Finding | Action | Status |
| -- | ----------------- | ------- | ------ | ------ |

استخدم:

* FIXED
* FALSE POSITIVE
* ACCEPTED RISK
* CONFIGURATION REQUIRED
* NEEDS MANUAL REVIEW

لا تستخدم `FIXED` بدون إثبات.

---

# 30. Security Score

لا تخترع نسبة مثل:

`100% Secure`

بدل ذلك استخدم تقييمًا وصفيًا:

* Critical Findings: العدد
* High Findings: العدد
* Medium Findings: العدد
* Low Findings: العدد
* Informational: العدد
* Configuration Required: العدد
* Needs Manual Review: العدد

---

# 31. Important

حتى بعد Remediation:

لا تعتبر النظام آمنًا نهائيًا.

المرحلة التالية ستكون:

`28_Security_Retest.md`

وهدفها إعادة تقييم المشروع بعد الإصلاح.

---

# 32. Final Status

في نهاية التقرير استخدم إحدى الحالات:

`REMEDIATION COMPLETED — READY FOR SECURITY RETEST`

أو:

`REMEDIATION PARTIALLY COMPLETED — SECURITY RETEST REQUIRED`

أو:

`REMEDIATION BLOCKED`

حسب الحالة الفعلية.

---

# START

نفّذ بالترتيب:

1. Create `27_Security_Remediation.md`.
2. Copy this Prompt بالكامل.
3. Read the file.
4. Read `26_Security_Assessment_Report.md`.
5. Re-validate findings.
6. Fix real security issues.
7. Add regression tests.
8. Run lint.
9. Run typecheck.
10. Run all tests.
11. Run security tests.
12. Run frontend build.
13. Run backend build.
14. Create `27_Security_Remediation_Report.md`.
15. Document every finding and its actual status.
16. Do NOT claim the project is vulnerability-free.
17. Do NOT start Prompt 28 automatically.
18. Stop after completing Prompt 27.
