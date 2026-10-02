# PROMPT 29 — PRODUCTION SECURITY CONFIGURATION & FINAL BACKEND HARDENING

## EXECUTION PROTOCOL — MANDATORY

قبل تنفيذ أي شيء:

1. أنشئ ملفًا جديدًا داخل:
   `Antigravity_Prompts/`

2. اسم الملف:
   `29_Production_Security_Configuration.md`

3. انسخ هذا الأمر كاملًا إلى الملف دون حذف أو اختصار أو إعادة صياغة.

4. احفظ الملف.

5. أغلقه ثم افتحه مرة أخرى من:
   `Antigravity_Prompts/29_Production_Security_Configuration.md`

6. اقرأه كاملًا.

7. اعتبر الملف المصدر الوحيد لتنفيذ هذه المرحلة.

8. لا تنفذ الأمر مباشرة من رسالة الـChat.

---

# الهدف

إغلاق المتطلب الأمني المتبقي من Security Assessment:

`SEC-002 — Payment Webhook Signature Configuration`

مع إجراء مراجعة نهائية لـProduction configuration الخاصة بالـBackend.

المطلوب ليس إدخال Secrets حقيقية داخل Repository.

المطلوب بناء نظام Configuration آمن يجعل:

Development / Test / Production

واضحة ومنفصلة.

---

# 1. Read Previous Security Reports

اقرأ:

* `26_Security_Assessment_Report.md`
* `27_Security_Remediation_Report.md`
* `28_Security_Retest_Report.md`

حدد كل:

* Open Finding
* Configuration Required
* Needs Manual Review
* Accepted Risk

خصوصًا:

`SEC-002`

---

# 2. Payment Webhook Configuration

راجع Payment Provider الحالي.

تحقق من:

* Webhook secret configuration
* Signature verification
* Environment variable loading
* Missing secret behavior
* Invalid signature behavior
* Duplicate webhook handling
* Idempotency
* Amount verification
* Order matching

---

# 3. Never Hard-Code Secrets

ممنوع وضع:

* Stripe secret
* Stripe webhook secret
* PayMob secret
* JWT secret
* Database password
* SMTP password
* API keys

داخل:

* TypeScript
* JavaScript
* JSON
* README
* Markdown examples
* Git repository

استخدم فقط environment variables.

---

# 4. Production Configuration Validation

راجع:

`backend/src/config/env.ts`

واجعل Production startup يفشل بشكل آمن إذا كان:

* payment provider مفعّلًا
* والـwebhook secret مطلوبًا
* لكنه غير موجود.

يجب ألا يعمل Production في حالة تجعل webhook verification غير محمي.

لكن لا تمنع Development/Test التي تستخدم:

* COD فقط
* أو Payment Sandbox بدون الحاجة إلى Production secret

إلا إذا كان ذلك مطلوبًا فعليًا من الـarchitecture.

---

# 5. Environment Separation

يجب الفصل بوضوح بين:

### Development

إعدادات التطوير.

### Test

إعدادات الاختبارات.

### Production

إعدادات الإنتاج.

لا تسمح بأن تنتقل أسرار Development إلى Production.

ولا تستخدم:

* default production secrets
* fallback JWT secrets
* fallback database credentials
* permissive CORS

---

# 6. `.env.example`

راجع:

`.env.example`

يجب أن يحتوي على أسماء المتغيرات المطلوبة فقط، مثل:

* DATABASE_URL
* JWT configuration
* CORS origins
* application URLs
* payment configuration
* webhook configuration
* email configuration

بدون قيم Secret حقيقية.

استخدم placeholders واضحة مثل:

`CHANGE_ME`

أو:

`YOUR_SECRET_HERE`

إذا كان ذلك مناسبًا.

---

# 7. Git Secret Protection

تحقق من:

`.gitignore`

وتأكد أن:

* `.env`
* `.env.local`
* `.env.production`
* أي ملفات Secrets

ليست tracked.

افحص Git-tracked files.

إذا وجدت Secret حقيقي:

لا تعرضه.

استخدم:

`REDACTED`

إذا كان هناك Secret حقيقي committed بالفعل، سجّل:

`SECRET ROTATION REQUIRED`

ولا تحاول نشر القيمة أو نسخها.

---

# 8. Payment Webhook Security

تحقق من أن Webhook:

1. يستقبل request.
2. يتحقق من signature.
3. يرفض invalid signature.
4. يرفض missing signature.
5. يتحقق من event structure.
6. يتحقق من payment/order relationship.
7. يتحقق من amount عند الحاجة.
8. يمنع duplicate processing.
9. يستخدم idempotency.
10. يحدّث Payment/Order فقط بعد نجاح verification.

لا تجعل:

`Frontend callback`

مصدر الحقيقة.

---

# 9. Webhook Error Handling

عند:

* missing secret
* invalid signature
* malformed event
* unknown event
* duplicate event
* unknown order

يجب أن يكون behavior آمنًا.

لا تكشف:

* webhook secret
* internal errors
* stack traces
* database details

في response.

---

# 10. Payment State Machine

راجع Payment statuses.

تأكد من عدم إمكانية الانتقال بشكل غير منطقي، مثل:

`FAILED → SUCCESS`

بدون حدث Payment موثوق.

أو:

`CANCELLED → PAID`

بدون workflow صالح.

اجعل transitions واضحة Server-side.

---

# 11. Order / Payment Consistency

تحقق من consistency بين:

Payment

و:

Order

مثل:

* amount
* currency
* order ID
* provider reference
* payment status

لا تسمح بتحديث Order إلى حالة مدفوعة بناءً على request غير موثوق.

---

# 12. Idempotency Retest

تحقق من:

`x-idempotency-key`

في:

* order creation
* payment initialization
* webhook processing

اختبر retry الآمن.

يجب ألا يؤدي retry إلى:

* duplicate Order
* duplicate Payment
* duplicate inventory deduction
* duplicate coupon usage

---

# 13. Production Startup Safety

راجع startup process.

عند:

`NODE_ENV=production`

تحقق من:

* required environment variables
* JWT secrets
* Database URL
* CORS origins
* payment configuration
* webhook secret
* email configuration إذا كان إلزاميًا

إذا كانت configuration الحرجة ناقصة:

**Fail Fast**

ولا تبدأ السيرفر في حالة غير آمنة.

---

# 14. No Secret Leakage

راجع:

* API responses
* logs
* error messages
* frontend bundle
* README
* source maps إن وجدت
* environment diagnostics

تأكد أن Secrets لا تظهر في:

* Browser
* Network responses
* Console
* Server logs

---

# 15. Frontend Environment Variables

راجع Frontend environment variables.

تأكد أن المتغيرات التي تصل إلى Frontend لا تحتوي على:

* private keys
* database credentials
* JWT secrets
* payment secret keys
* SMTP credentials

أي public configuration فقط يمكن أن يصل للـFrontend.

---

# 16. CORS Production Configuration

تأكد أن Production CORS:

* Explicit
* environment-driven
* credential-safe

ولا يسمح:

`*`

مع authenticated credentials.

اختبر actual HTTP response.

---

# 17. Cookie Production Configuration

راجع:

* HttpOnly
* Secure
* SameSite
* expiration
* domain
* path

تأكد أن:

`Secure=true`

عندما يعمل Production على HTTPS.

---

# 18. Security Headers

تحقق من:

* Helmet
* CSP
* HSTS
* X-Content-Type-Options
* Referrer-Policy
* Frame protection

راجع actual HTTP responses.

---

# 19. Logging

راجع Production logging.

لا تسجل:

* passwords
* JWTs
* refresh tokens
* cookies
* API keys
* payment secrets
* webhook secrets
* database credentials

مع الحفاظ على:

* request ID
* useful operational information
* security events
* payment event identifiers غير الحساسة

---

# 20. Health Checks

راجع:

`/health/liveness`

و:

`/health/readiness`

تأكد من:

* liveness لا يعتمد على Database بشكل غير ضروري.
* readiness يوضح readiness الحقيقي.
* لا يتم كشف Secrets.
* لا يتم كشف connection strings.
* لا يتم كشف infrastructure details الحساسة.

---

# 21. Graceful Shutdown

تحقق من:

* SIGTERM
* SIGINT
* HTTP server shutdown
* Prisma disconnect
* cleanup

اختبر shutdown behavior إن أمكن.

---

# 22. Production Error Handling

تأكد أن Production لا يعرض:

* stack traces
* SQL errors
* filesystem paths
* environment values
* internal service details

استخدم safe error responses.

---

# 23. Configuration Documentation

حدّث README بقسم:

`Production Security Configuration`

اشرح:

* Environment variables المطلوبة.
* كيفية إعداد Payment Provider.
* كيفية إعداد Webhook Secret.
* كيفية تشغيل Production.
* كيفية التحقق من readiness.
* كيفية تدوير Secrets.
* كيفية التعامل مع Secret rotation.

لا تضع أي Secret حقيقي.

---

# 24. Security Configuration Test

أضف tests تتحقق من:

### Production + Missing Webhook Secret

يجب أن:

`FAIL FAST`

إذا كان Provider يتطلب secret.

### Development + Missing Production Secret

يجب ألا يفشل إلا إذا كانت configuration الحالية تتطلبه فعليًا.

### Invalid Webhook Signature

يجب:

`REJECT`

### Missing Webhook Signature

يجب:

`REJECT`

### Valid Signature

يجب:

`ACCEPT`

فقط باستخدام Test/Sandbox credentials.

---

# 25. Configuration Required Handling

إذا كانت مفاتيح Payment Provider الحقيقية غير موجودة داخل بيئة التنفيذ الحالية:

لا تحاول اختراعها.

لا تضع credentials وهمية.

لا تضع Secret حقيقي.

بدلًا من ذلك:

اجعل الكود والـconfiguration جاهزين، وسجل:

`PRODUCTION PAYMENT CREDENTIALS REQUIRED`

هذا ليس Code Failure.

إنما Deployment Configuration Requirement.

---

# 26. Security Regression

شغّل:

* existing tests
* security tests
* configuration tests

ثم:

* lint
* typecheck
* frontend build
* backend build

أصلح أي regression.

---

# 27. Final Security Configuration Report

أنشئ:

`Antigravity_Prompts/29_Production_Security_Configuration_Report.md`

ويحتوي:

# Executive Summary

# Configuration Changes

# Payment Webhook Security

# Secret Management

# Production Startup Validation

# CORS

# Cookies

# Security Headers

# Logging

# Health Checks

# Graceful Shutdown

# Tests

# Configuration Required

# Remaining Risks

---

# 28. SEC-002 Status

يجب تحديد الحالة الفعلية:

إذا أصبح الكود جاهزًا وينتظر فقط Secret Production:

`CODE FIXED — PRODUCTION SECRET REQUIRED`

إذا تم اختبار Sandbox بنجاح:

`SANDBOX VERIFIED — PRODUCTION SECRET REQUIRED`

إذا تم إعداد Production configuration فعلية بواسطة صاحب المشروع:

`PRODUCTION CONFIGURATION VERIFIED`

لا تدّعي الحالة الأخيرة بدون إثبات.

---

# 29. Final Security Gate

أنشئ جدولًا:

| Control                  | Status                 |
| ------------------------ | ---------------------- |
| Authentication           | PASS                   |
| Authorization            | PASS                   |
| IDOR/BOLA                | PASS                   |
| Mass Assignment          | PASS                   |
| Input Validation         | PASS                   |
| Rate Limiting            | PASS                   |
| CORS                     | PASS                   |
| Cookies                  | PASS                   |
| Security Headers         | PASS                   |
| SQL/ORM Safety           | PASS                   |
| Financial Integrity      | PASS                   |
| Inventory Concurrency    | PASS                   |
| Payment Verification     | PASS / CONFIG REQUIRED |
| Webhook Verification     | PASS / CONFIG REQUIRED |
| Idempotency              | PASS                   |
| Error Handling           | PASS                   |
| Logging Security         | PASS                   |
| Health Checks            | PASS                   |
| Graceful Shutdown        | PASS                   |
| Secret Management        | PASS                   |
| Production Configuration | PASS / CONFIG REQUIRED |

استخدم الحالة الفعلية فقط.

---

# 30. Final Status

لا تستخدم:

`100% SECURE`

ولا:

`VULNERABILITY FREE`

استخدم:

`SECURITY CONFIGURATION HARDENING COMPLETED`

مع تحديد أي Configuration Required.

---

# START

نفّذ بالترتيب:

1. Create `29_Production_Security_Configuration.md`.
2. Copy this Prompt بالكامل إليه.
3. Read the file.
4. Read Security Reports 26, 27, 28.
5. Resolve SEC-002 as far as possible without real credentials.
6. Harden Production configuration.
7. Add configuration/security regression tests.
8. Run lint.
9. Run typecheck.
10. Run all tests.
11. Run security tests.
12. Run frontend build.
13. Run backend build.
14. Create `29_Production_Security_Configuration_Report.md`.
15. Document any remaining configuration requirement.
16. Do NOT invent credentials.
17. Do NOT claim Production payment is verified without real authorized Production configuration.
18. Do NOT start Prompt 30.
19. Stop after completing Prompt 29.

ابدأ الآن.
