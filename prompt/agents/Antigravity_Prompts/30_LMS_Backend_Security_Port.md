# PROMPT 30 — LMS BACKEND SECURITY PORT & COMPREHENSIVE SECURITY ARCHITECTURE ENHANCEMENT

أنت تعمل على مشروع المتجر المملوك لنا فقط:
`https://github.com/EyadAbduljalil/Online_shope.git`

وهذا هو المشروع المرجعي الذي يجب دراسته:
`https://github.com/EyadAbduljalil/LMS_Nilehi_Project.git`

مهم جدًا:

* هذا العمل Defensive Engineering فقط على مشاريع نملكها ونصرح بتعديلها.
* لا تتصل بأي نظام خارجي غير المستودعين المذكورين.
* لا تنفذ أي destructive testing أو DoS/flooding.
* لا تضع أي secrets حقيقية في repository.
* لا تنقل أي كود خاص بالـLMS إذا كان مرتبطًا بـMongo/Mongoose أو المجال الأكاديمي.
* الهدف هو نقل **الأفكار والأنماط الأمنية والتشغيلية المفيدة فقط** إلى متجر PostgreSQL/Prisma الحالي.

## البروتوكول الإلزامي

قبل تنفيذ أي شيء:

1. أنشئ الملف:
   `Antigravity_Prompts/30_LMS_Backend_Security_Port.md`
2. انسخ هذا الـPrompt بالكامل داخله.
3. اقرأ الملف من البداية إلى النهاية.
4. نفّذ العمل فقط اعتمادًا على الملف المقروء.
5. لا تعتمد على نص المحادثة كمصدر تنفيذ.
6. بعد كل مجموعة تغييرات: شغّل الاختبارات والـlint/typecheck/build المناسب.
7. عند ظهور مشكلة: أصلحها ثم أعد التحقق.
8. أنشئ في النهاية:
   `Antigravity_Prompts/30_LMS_Backend_Security_Port_Report.md`
9. لا تبدأ أي Prompt لاحق.

---

# المرحلة 1 — دراسة المشروعين

اقرأ المشروع المرجعي والـstore كاملًا بالقدر اللازم لفهم:

### من LMS

ركز على:

* `BackEnd/src/config/security.js`
* `BackEnd/src/config/secrets.js`
* `BackEnd/src/config/logger.js`
* `BackEnd/src/config/redis.js`
* `BackEnd/src/config/queue.js`
* `BackEnd/src/config/sentry.js`
* `BackEnd/src/middleware/advancedSecurity.middleware.js`
* `BackEnd/src/middleware/csrf.middleware.js`
* `BackEnd/src/middleware/globalGuard.middleware.js`
* `BackEnd/src/middleware/ownership.middleware.js`
* `BackEnd/src/middleware/audit.middleware.js`
* `BackEnd/src/middleware/errorHandler.middleware.js`
* `BackEnd/src/middleware/errorLogger.middleware.js`
* `BackEnd/src/middleware/permissions.middleware.js`
* `BackEnd/src/constants/securityRegistry.js`
* `BackEnd/src/constants/auditActions.js`
* `BackEnd/src/services/audit.service.js`
* `BackEnd/src/services/security.service.js`
* أي services/models مرتبطة مباشرة بهذه الطبقات.

ثم اقرأ الـbackend الحالي في المتجر بالكامل قبل إجراء التغييرات.

---

# المرحلة 2 — أنشئ Gap Analysis حقيقي

أنشئ ملف داخلي/وثيقة عمل تحدد لكل Pattern:

| LMS Pattern | موجود في المتجر؟ | هل يحتاج نقل؟ | طريقة النقل المناسبة |
| ----------- | ---------------- | ------------- | -------------------- |

افحص على الأقل:

1. Central Security Registry
2. Global security guard
3. RBAC
4. ABAC/policy checks
5. Ownership/BOLA protection
6. Audit logging
7. Security event logging
8. Brute-force detection
9. Credential-stuffing detection
10. Distributed brute-force detection
11. Mass-access detection
12. CSRF
13. Rate limiting
14. HPP protection
15. Security headers
16. Secrets abstraction
17. Environment validation
18. Structured logger
19. Log rotation strategy
20. Redis
21. Background queues
22. Sentry/error monitoring
23. Correlation IDs
24. Error handling
25. Alerting
26. Database connection hardening
27. Operational health checks
28. Graceful shutdown
29. Production configuration separation
30. Documentation/runbooks

لا تنقل كل شيء بشكل أعمى.

---

# المرحلة 3 — تبنّي Architecture مناسبة للمتجر

المتجر الحالي يستخدم:

* Node.js
* Express
* TypeScript
* PostgreSQL
* Prisma

لذلك يجب أن تبقى هذه هي البنية الأساسية.

أي Pattern من الـLMS يجب إعادة تطبيقه باستخدام:

* Prisma
* PostgreSQL
* TypeScript
* البنية الحالية للمتجر

ممنوع إدخال Mongo/Mongoose فقط لتقليد الـLMS.

---

# المرحلة 4 — Central Security Policy Registry

أنشئ نظامًا مركزيًا مشابهًا لفكرة:

`SECURITY_REGISTRY`

ولكن للمتجر.

يجب أن يدعم على الأقل:

* public
* authenticated
* roles
* permissions
* ownership/resource checks
* sensitive operation flags
* rate-limit profile

واجعل هناك Guard مركزي يستطيع:

1. تحديد policy للـroute.
2. رفض route غير معروف عندما تكون السياسة الافتراضية protected.
3. التحقق من Authentication.
4. التحقق من role/permission.
5. تمرير context مناسب للـpolicy.
6. إطلاق security event عند الرفض.

لا تكسر الـpublic product/catalog routes.

---

# المرحلة 5 — Ownership / BOLA Layer

طبّق طبقة ownership حقيقية تناسب المتجر.

الأمثلة:

* المستخدم يستطيع الوصول إلى بياناته فقط.
* يستطيع تعديل Address الخاصة به فقط.
* يستطيع رؤية Wishlist الخاصة به فقط.
* يستطيع رؤية Cart الخاصة به فقط.
* يستطيع رؤية Orders الخاصة به فقط.
* يستطيع تعديل بياناته فقط.
* يستطيع تنفيذ review فقط ضمن القواعد الصحيحة.
* admin/staff فقط يستطيع الوصول إلى موارد الإدارة.

لا تعتمد على UUID obscurity كحماية.

كل resource حساس يجب التحقق من ownership أو role المناسب.

عند اكتشاف محاولة غير مصرح بها:

* return 403/404 حسب التصميم الأمني الصحيح
* create audit/security event
* لا تكشف بيانات المورد

---

# المرحلة 6 — Audit System

أضف Audit System حقيقي للمتجر.

يجب دعم أحداث مثل:

Authentication:

* AUTH_LOGIN_SUCCESS
* AUTH_LOGIN_FAILED
* AUTH_LOGOUT
* AUTH_PASSWORD_CHANGE
* AUTH_PASSWORD_RESET_REQUEST
* AUTH_PASSWORD_RESET_COMPLETE
* AUTH_REFRESH

Security:

* SECURITY_UNAUTHORIZED_ACCESS
* SECURITY_FORBIDDEN_ACCESS
* SECURITY_SUSPICIOUS_ACTIVITY
* SECURITY_BRUTE_FORCE
* SECURITY_CREDENTIAL_STUFFING
* SECURITY_BOLA_ATTEMPT
* SECURITY_RATE_LIMIT
* SECURITY_CSRF
* SECURITY_SUSPICIOUS_ORDER_ACTIVITY

Commerce/Admin:

* USER_CREATE
* USER_UPDATE
* USER_ROLE_CHANGE
* PRODUCT_CREATE
* PRODUCT_UPDATE
* PRODUCT_DELETE
* INVENTORY_UPDATE
* COUPON_CREATE
* COUPON_UPDATE
* ORDER_CREATE
* ORDER_UPDATE
* ORDER_CANCEL
* ORDER_REFUND
* PAYMENT_CREATE
* PAYMENT_STATUS_CHANGE
* REVIEW_MODERATION
* SETTINGS_CHANGE

System:

* SYSTEM_CONFIG_CHANGE
* SYSTEM_START
* SYSTEM_SHUTDOWN
* SYSTEM_ERROR

كل Audit Entry يجب أن يحوي قدر الإمكان:

* correlationId
* actorId
* actorRole
* actionType
* category
* targetEntity
* targetId
* status
* severity
* endpoint
* method
* IP
* User-Agent
* metadata آمنة

يجب منع تسجيل:

* passwords
* JWT
* refresh tokens
* cookies
* authorization headers
* card secrets
* webhook secrets
* encryption keys

أضف sanitization قبل التخزين.

---

# المرحلة 7 — Security Event / Threat Detection

استفد من فكرة `SecurityService` في الـLMS ولكن صممها للمتجر.

طبّق detections آمنة وغير مزعجة مثل:

### Credential Stuffing

ارتفاع محاولات login الفاشلة من نفس source على حسابات مختلفة.

### Distributed Brute Force

عدة مصادر تحاول نفس الحساب خلال فترة قصيرة.

### Mass Access

عدد غير طبيعي من GET requests لموارد حساسة.

### Suspicious Admin Activity

كمية غير طبيعية من:

* product updates
* inventory changes
* coupon changes
* order status changes
* user role changes

### Suspicious Order Activity

أنماط متكررة جدًا من:

* checkout attempts
* coupon attempts
* payment attempts
* order creation failures

لا تطلق lockout دائمًا تلقائيًا.
ابدأ بـ:

* audit
* rate limit
* alert
* optional temporary mitigation

ولا تسبب false positives شديدة.

---

# المرحلة 8 — Rate Limiting

راجع الـrate limiting الحالي ونفذه بشكل layered.

على الأقل:

* global API limiter
* auth limiter
* login strict limiter
* password reset limiter
* checkout limiter
* coupon validation limiter
* review submission limiter
* public product search limiter
* admin mutation limiter
* webhook abuse protection

كلها configurable عبر environment.

لا تعطّل rate limiting بالكامل في production.

في development:
يمكن تخفيف الحدود فقط إذا كان ذلك ضروريًا للاختبارات.

يجب أن تكون الحدود معقولة وليست عشوائية.

سجّل rate-limit violations كـsecurity events.

---

# المرحلة 9 — CSRF

بما أن المتجر يستخدم authentication عبر HttpOnly cookies:

راجع CSRF protection الحالية.

نفّذ تصميمًا صحيحًا:

* CSRF secret من environment
* CSRF token generation endpoint عند الحاجة
* protection على state-changing requests
* GET/HEAD/OPTIONS مستثناة
* لا تستخدم bypass لمجرد وجود Authorization header
* لا تستخدم secure=false في production
* SameSite/Secure/HttpOnly يجب أن تتحدد حسب environment

يجب أن يتوافق ذلك مع frontend الحالي.

اختبر:

* valid token
* missing token
* invalid token
* expired/invalid session
* public GET

---

# المرحلة 10 — Security Headers

راجع Helmet الحالية وقارنها بنمط LMS.

حسّن:

* CSP
* X-Content-Type-Options
* Referrer-Policy
* Frame protection
* HSTS في production HTTPS
* Permissions-Policy حسب الحاجة
* Cross-Origin policies

لكن لا تضف directives تكسر React frontend أو الصور أو API.

اختبر frontend بعد التغيير.

---

# المرحلة 11 — Secrets Layer

أنشئ/طوّر centralized configuration layer.

لا تجعل codebase يقرأ secrets من `process.env` في عشرات الأماكن.

يجب أن تكون هناك طبقة واحدة مثل:

* `config/env.ts`
  أو البنية الحالية المناسبة.

تتحقق من:

* DATABASE_URL
* JWT secrets
* refresh secret
* CSRF secret
* encryption key
* payment secrets
* webhook secret
* email secrets
* Redis URL
* Sentry DSN عند تفعيله

Production يجب أن يفشل startup عند غياب secret إجباري.

Development/Test يمكن أن يكون لهما قواعد مختلفة، لكن بوضوح.

لا تسجل قيمة السر نفسها في logs.

---

# المرحلة 12 — Logging

استخدم structured logger مركزي.

يجب دعم:

* error
* warn
* info
* http
* debug

وأن يحتوي log context على:

* timestamp
* correlationId
* requestId
* route
* method
* status
* duration
* userId
* severity

لا تسجل بيانات حساسة.

في production:

* log rotation أو استراتيجية مناسبة للـplatform
* JSON logs إن كانت بيئة التشغيل server/container oriented

لا تستبدل كل شيء blindly إذا كان deployment الحالي له نظام logging مناسب.

---

# المرحلة 13 — Correlation ID

اجعل كل request يحصل على:

* requestId أو correlationId

ويتم تمريره إلى:

* logs
* audit logs
* security events
* error reports
* background jobs عندما يكون ذلك مفيدًا

يجب إعادة correlation/request ID في response header مناسب.

---

# المرحلة 14 — Error Handling

راجع error handling.

المطلوب:

* consistent API error format
* عدم كشف stack traces في production
* عدم كشف SQL/database internals للمستخدم
* logging داخلي كامل
* correlationId في الخطأ
* mapping صحيح لأخطاء Prisma
* 404/403/409/422/429/500 بشكل متناسق

---

# المرحلة 15 — Redis / Background Jobs

لا تضف Redis أو BullMQ لمجرد تقليد الـLMS.

استخدمه فقط عندما تكون فائدته واضحة للمتجر.

قيّم نقل/إنشاء queues لـ:

* transactional email
* notification delivery
* low-priority audit post-processing
* report generation
* cleanup jobs
* retryable webhook processing

إذا كان Redis موجودًا بالفعل:

* حسّن طريقة initialization
* graceful degradation عندما يكون غير متاح
* health status واضح

إذا لم يكن ضروريًا حاليًا:

* لا تجعل المتجر يعتمد عليه بشكل إجباري لجميع requests.

---

# المرحلة 16 — Sentry / Observability

اجعل Sentry أو equivalent اختياريًا.

في production فقط عندما يكون DSN configured.

يجب capture:

* unhandled exceptions
* important backend failures
* payment failures
* queue failures
* critical security events عند الحاجة

لا ترسل:

* passwords
* tokens
* cookies
* payment secrets
* full personal sensitive payloads

استخدم environment + release metadata إن كانت البنية تدعم ذلك.

---

# المرحلة 17 — Database Hardening

طبّق المفاهيم المفيدة من LMS لكن لـPostgreSQL/Prisma:

* connection pooling مناسب
* timeouts
* retries فقط حيث تكون آمنة
* graceful DB shutdown
* health/readiness database check
* لا تستخدم retry loop قد يسبب duplication للـfinancial operations
* لا تضع DB secrets في logs
* transactions لكل financial/inventory-critical workflow

راجع خصوصًا:

* checkout
* payment
* order creation
* inventory decrement
* coupon usage

---

# المرحلة 18 — Admin Security

Admin operations يجب أن تكون أشد حماية من customer operations.

راجع:

* role-based access
* permission checks
* audit trail
* rate limiting
* suspicious activity detection
* confirmation requirements للأفعال الحساسة عندما يكون مناسبًا
* عدم السماح بـmass assignment
* server-side field allowlists

خصوصًا:

* تعديل الأسعار
* inventory
* coupon rules
* payment state
* refund
* role changes
* user disable/delete
* settings

---

# المرحلة 19 — Security Tests

أضف اختبارات حقيقية لكل ما سبق.

على الأقل:

### Auth

* unauthorized protected route
* forbidden role
* valid user
* invalid token
* refresh behavior

### Ownership

* owner allowed
* other user denied
* admin allowed
* invalid resource denied

### Security

* rate limit
* CSRF
* HPP
* suspicious payload handling
* security headers

### Audit

* successful event recorded
* failed event recorded
* sensitive fields masked
* correlation ID propagated

### Commerce

* price tampering blocked
* quantity tampering blocked
* coupon manipulation blocked
* order ownership enforced
* payment state cannot be forged
* inventory concurrency protected

### Configuration

* missing production secrets fails startup
* development/test config behaves correctly

---

# المرحلة 20 — Production Readiness Review

بعد التنفيذ:

1. npm test
2. npm run lint
3. npm run typecheck إن وجد
4. npm run build
5. npm audit
6. أي migration checks مطلوبة
7. security test suite

ثم افحص يدويًا أهم endpoints.

---

# المرحلة 21 — Documentation

حدّث README/Documentation ليشرح:

* security architecture
* env variables
* production requirements
* Redis optional/required status
* Sentry optional status
* CSRF usage
* admin security
* audit log
* security alerts
* health/readiness
* safe deployment configuration

لا تضع أسرار حقيقية.

---

# المرحلة 22 — Security Report

أنشئ:
`Antigravity_Prompts/30_LMS_Backend_Security_Port_Report.md`

التقرير يجب أن يحتوي:

## Executive Summary

## LMS Security/Operations Patterns Reviewed

## Patterns Adopted

## Patterns Rejected

مع السبب التقني.

## Files Changed

## Database Changes

إن وجدت.

## Environment Changes

## Security Improvements

## Threat Detection Added

## Tests Added

## Validation Results

اذكر النتائج الفعلية فقط.

استخدم جدول:

| Area | Before | After | Evidence |
| ---- | ------ | ----- | -------- |

وفي النهاية:

### Remaining Risks

### Configuration Required

### Production Requirements

### Final Status

---

# قواعد مهمة جدًا

* لا تنسخ Mongo/Mongoose code إلى المشروع.
* لا تنشئ secrets وهمية وتعتبرها production-ready.
* لا تعتبر وجود Sentry/Redis وحده إنجازًا إن لم يكن integrated بشكل صحيح.
* لا تكسر frontend الحالي.
* لا تغير business logic للمتجر إلا عندما يكون ذلك ضروريًا للأمان.
* لا تجعل customer-facing API يعتمد على admin security policies.
* لا تجعل أي route محميًا خطأ.
* لا تستخدم `console.log` للعمليات الأمنية الحساسة إذا كان structured logger متاحًا.
* لا تكشف معلومات حساسة في error responses أو logs.
* لا تستخدم client-provided prices, totals, payment status, inventory values كمصدر ثقة.
* كل security control يجب أن يكون server-side.
* كل financial mutation يجب أن تكون transactional/idempotent حيث يلزم.
* لا تبدأ Prompt 31.
* لا تتوقف لطلب موافقة مني بين المراحل.
* بعد إكمال كل شيء، توقف واكتب التقرير فقط.

## START

1. أنشئ `Antigravity_Prompts/30_LMS_Backend_Security_Port.md`
2. انسخ هذا الـPrompt داخله.
3. اقرأ الملف.
4. اقرأ كود الـLMS المحدد.
5. اقرأ backend الحالي للمتجر.
6. أنشئ Gap Analysis.
7. نفذ فقط الأنماط المناسبة للمتجر.
8. اختبر.
9. أصلح.
10. أعد الاختبارات.
11. أنشئ `30_LMS_Backend_Security_Port_Report.md`
12. توقف.
