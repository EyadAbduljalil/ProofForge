# PROMPT 25 — BACKEND SECURITY HARDENING & PRODUCTION OPERATIONS

## EXECUTION PROTOCOL — MANDATORY

قبل تنفيذ أي شيء:

1. أنشئ ملفًا جديدًا داخل:
   `Antigravity_Prompts/`

2. اسم الملف يجب أن يكون:
   `25_Backend_Security_and_Operations.md`

3. انسخ **هذا الأمر كاملًا** إلى الملف دون حذف أو اختصار أو إعادة صياغة.

4. بعد إنشاء الملف، افتح واقرأ:
   `Antigravity_Prompts/25_Backend_Security_and_Operations.md`

5. اعتبر الملف هو المصدر الوحيد للتنفيذ.

6. لا تنفذ هذا الأمر مباشرة من رسالة الـChat.

7. بعد قراءة الملف، ابدأ التنفيذ منه.

8. لا تنتقل إلى أي مرحلة لاحقة قبل إكمال الحالية والتحقق منها.

9. إذا وجدت مشكلة في Architecture أو Database أو Authentication تم إنشاؤها في المراحل السابقة، أصلحها بشكل صحيح ثم أعد اختبارها.

10. لا تحذف متطلبات سابقة لإخفاء المشاكل.

---

# الهدف

رفع مستوى Backend الحالي من مجرد Backend يعمل إلى Backend قوي ومهيأ لبيئة Production، مع التركيز على:

* Security
* Reliability
* Availability
* Observability
* Error handling
* Configuration
* Authentication
* Authorization
* Session security
* API security
* Database security
* Operational resilience
* Graceful shutdown
* Health monitoring
* Logging
* Rate limiting
* Abuse protection
* Secure deployment
* Failure handling

لا تقم بإضافة تعقيد غير ضروري.

أي تقنية أو طبقة جديدة يجب أن يكون لها سبب واضح.

---

# 1. Audit أولي قبل التعديل

افحص Backend بالكامل.

راجع:

* `server`
* routes
* controllers
* services
* middleware
* authentication
* authorization
* Prisma
* database access
* payments
* orders
* inventory
* uploads إن وجدت
* email
* notifications
* environment configuration
* logging
* error handling
* tests
* build configuration

ابحث عن:

* TODO
* FIXME
* mock
* fake
* placeholder
* hard-coded secrets
* insecure defaults
* swallowed exceptions
* exposed stack traces
* unsafe database queries
* missing authorization
* missing validation
* inconsistent error responses
* unhandled promise rejection
* unhandled exceptions
* sensitive information in logs

لا تبدأ الإصلاح قبل فهم architecture الحالية.

---

# 2. Environment & Secrets

اجعل configuration مركزيًا.

كل Secret يجب أن يأتي من environment variables.

راجع:

* DATABASE_URL
* JWT secrets
* refresh token secrets
* payment secrets
* webhook secrets
* email credentials
* application URL
* frontend URL
* CORS configuration
* cookie configuration
* environment mode

يجب أن يكون هناك:

`.env.example`

بدون أي Secret حقيقي.

تحقق من أن:

`.env`

لا يتم commit له في Git.

لا تطبع Secrets في logs.

لا ترسل Secrets إلى Frontend.

---

# 3. Configuration Validation

عند تشغيل Backend:

يجب التحقق من required environment variables.

إذا كان Production configuration ناقصًا، يجب أن يفشل startup بشكل واضح وآمن بدل أن يعمل بحالة غير آمنة.

استخدم validation مناسبة للـenvironment configuration.

لا تستخدم fallback غير آمن مثل:

* default production password
* default JWT secret
* default database credentials
* permissive CORS

---

# 4. HTTP Security

راجع تطبيق Express بالكامل.

طبّق Security Headers مناسبة باستخدام الأدوات المناسبة للـstack الحالي.

تحقق من:

* Helmet
* Content Security Policy حيث تكون مناسبة
* X-Content-Type-Options
* Referrer-Policy
* Frame protection
* HSTS في Production/HTTPS
* secure cookie settings

لا تطبق CSP بطريقة تكسر Frontend بدون اختبار.

---

# 5. CORS

CORS يجب أن يكون Explicit.

لا تستخدم:

`Access-Control-Allow-Origin: *`

مع authenticated credentialed requests.

Production origins يجب أن تكون configuration.

اختبر:

* allowed origin
* disallowed origin
* credentials
* preflight
* methods
* headers

---

# 6. Authentication Hardening

راجع Authentication بالكامل.

تحقق من:

* Password hashing
* Password policy
* Login rate limiting
* Refresh token security
* Token rotation
* Token revocation
* Logout
* Expiration
* Cookie flags
* Session invalidation
* Password reset
* Forgot password
* Account enumeration risks

لا تخزن passwords plaintext.

لا تعرض password hashes في API responses.

لا تجعل JWT payload يحتوي معلومات حساسة غير ضرورية.

---

# 7. Authorization / RBAC

راجع كل Endpoint وليس Admin فقط.

لكل endpoint حدد:

* Public
* Authenticated
* Customer
* Admin

اختبر:

* Customer → Customer resources
* Customer → Other customer's resources
* Customer → Admin resources
* Unauthenticated → protected resources
* Admin → authorized resources

يجب منع IDOR/Broken Object Level Authorization.

لا تعتمد على:

* hidden buttons
* frontend routes
* UI visibility

كمصدر للصلاحيات.

التحقق يجب أن يكون Server-side.

---

# 8. Input Validation

كل Request يجب أن يكون validated.

راجع:

* body
* query
* params
* headers عند الحاجة
* file uploads عند وجودها

استخدم Zod أو validation system الحالي.

ارفض:

* unexpected fields
* invalid types
* invalid IDs
* invalid enum values
* oversized input
* malformed data

انتبه إلى Mass Assignment.

لا تسمح للعميل بتغيير:

* role
* permissions
* internal status
* payment status
* inventory fields
* privileged fields

إلا من خلال عمليات Server-side مصممة لذلك.

---

# 9. SQL / Prisma Security

راجع كل Database access.

تأكد من عدم وجود raw SQL غير آمن.

إذا وجدت `$queryRaw` أو أي raw database operation، راجعه يدويًا.

تأكد من:

* parameterization
* validation
* authorization before query
* tenant/user ownership checks عند الحاجة
* transactions
* constraints

ابحث عن N+1 queries.

---

# 10. Financial Security

كل العمليات المالية يجب أن تكون Server-authoritative.

لا تثق في:

* client price
* client subtotal
* client discount
* client tax
* client shipping
* client total
* client payment status

Server يعيد الحساب من Database.

Coupon validation Server-side.

Payment verification Server-side.

Order total يجب أن يكون قابلًا لإعادة التحقق.

---

# 11. Payment Security

راجع payment architecture.

تحقق من:

* provider abstraction
* webhook verification
* signature validation
* duplicate webhook handling
* idempotency
* payment status transitions
* failed payments
* successful payments
* cancelled payments
* refunds architecture

لا تعتبر payment ناجحًا بسبب Frontend callback فقط.

لا تخزن:

* card number
* CVV
* full payment credentials

داخل Database.

إذا كانت Production payment credentials غير موجودة، اجعل ذلك واضحًا كـ:

`CONFIGURATION REQUIRED`

ولا تدّعي أن Production payment integration مكتمل بدون credentials/provider verification.

---

# 12. Idempotency

أضف idempotency حيث تكون ضرورية، خصوصًا في العمليات الحساسة مثل:

* order creation
* payment initialization
* payment webhook processing
* inventory reservation
* refund operations

يجب منع إنشاء Order مكرر بسبب:

* double click
* network retry
* browser retry
* webhook retry

---

# 13. Inventory Concurrency

راجع inventory transaction logic.

اختبر:

* last item
* simultaneous purchases
* quantity exceeding stock
* failed checkout
* cancelled order
* reservation release

يجب منع Overselling.

لا تعتمد على:

`read stock → calculate → write stock`

بدون حماية concurrency مناسبة.

---

# 14. Rate Limiting

طبّق rate limiting مناسبًا حسب نوع endpoint.

خصوصًا:

* Login
* Register
* Password reset
* Forgot password
* Coupon validation
* Reviews
* Search abuse-sensitive endpoints
* Payment initialization
* Public APIs

لا تستخدم rate limit واحدًا لجميع الـendpoints إذا كان ذلك غير مناسب.

يجب مراعاة Production deployment إذا كان Backend يعمل خلف reverse proxy/load balancer.

---

# 15. Abuse Protection

راجع:

* request size
* JSON body size
* URL size
* pagination limits
* maximum quantity
* maximum cart items
* maximum review length
* maximum search length
* coupon abuse
* login abuse

ضع حدودًا منطقية تمنع resource exhaustion.

---

# 16. Error Handling

يجب أن يكون هناك centralized error handling.

في Production:

لا ترسل:

* stack traces
* filesystem paths
* SQL errors
* secrets
* internal implementation details

إلا إلى العميل.

Client يحصل على:

* stable error code
* safe message
* appropriate HTTP status

Server logs التفاصيل اللازمة للتشخيص.

---

# 17. Logging

أنشئ logging strategy مناسبة.

يجب أن تسجل الأحداث المهمة مثل:

* startup
* shutdown
* authentication failures
* authorization failures
* payment events
* order creation
* order status changes
* inventory failures
* unexpected exceptions
* database errors

لكن لا تسجل:

* passwords
* tokens
* cookies
* card data
* secrets

استخدم structured logging إذا كان مناسبًا.

---

# 18. Request Correlation

أضف Request ID / Correlation ID مناسبًا.

بحيث يمكن ربط:

Frontend request
→ API request
→ service
→ database/payment operation
→ log

مع الحفاظ على عدم تسريب معلومات حساسة.

---

# 19. Health Checks

أضف health endpoints مناسبة.

مثل:

* liveness
* readiness

Readiness يجب أن يستطيع التحقق من dependencies المهمة مثل Database عندما يكون ذلك مناسبًا.

Health endpoint لا يجب أن يكشف:

* database credentials
* environment secrets
* internal infrastructure details

---

# 20. Graceful Shutdown

عند:

SIGTERM
SIGINT

يجب أن يقوم Backend بـ:

1. إيقاف استقبال requests جديدة.
2. السماح للطلبات الحالية بالانتهاء ضمن timeout منطقي.
3. إغلاق Database connection.
4. إغلاق resources الأخرى.
5. إغلاق server بشكل منظم.

لا تجعل process يموت فجأة ويترك resources مفتوحة.

---

# 21. Startup Safety

عند تشغيل Production:

* validate configuration
* initialize required services
* verify database connectivity
* start server فقط بعد نجاح المتطلبات الأساسية

إذا كان dependency critical غير متاح، لا تشغّل Backend في حالة غير صالحة.

---

# 22. Database Resilience

راجع Database access.

تحقق من:

* connection lifecycle
* connection limits
* transaction handling
* timeout behavior
* error handling

لا تضف retry logic عشوائيًا للـDatabase.

أي retry يجب أن يكون آمنًا ولا يسبب duplicate financial operations.

---

# 23. API Security

راجع كل API endpoint.

أنشئ جدولًا داخليًا يحتوي:

* Method
* Path
* Authentication
* Authorization
* Validation
* Rate limit
* Database operation
* Sensitive operation?
* Idempotency requirement?

استخدم الجدول لاكتشاف endpoints غير محمية.

---

# 24. File Upload Security

إذا كان المشروع يدعم رفع صور أو ملفات:

تحقق من:

* file size
* MIME type
* extension
* content validation
* filename handling
* path traversal
* storage isolation
* executable file prevention

لا تثق في filename أو MIME type القادم من العميل وحده.

إذا لم يكن هناك upload system حاليًا، لا تضف نظامًا معقدًا بلا حاجة؛ فقط تأكد من عدم وجود upload endpoint غير محمي.

---

# 25. Admin Security

Admin operations يجب أن تكون شديدة الحماية.

تحقق من:

* RBAC
* ownership/authorization
* audit logging
* sensitive operation validation

العمليات الحساسة مثل:

* تغيير Order status
* تغيير Inventory
* إدارة Users
* تغيير Coupon
* تغيير Product
* تغيير Review status

يجب أن يكون لها authorization واضح.

---

# 26. Security Headers & Cookies

راجع Cookies.

Authentication cookies يجب أن تستخدم الإعدادات المناسبة للبيئة، مثل:

* HttpOnly
* Secure في HTTPS Production
* SameSite مناسب

لا تجعل إعدادات Development غير الآمنة تنتقل تلقائيًا إلى Production.

---

# 27. Dependency Security

نفذ:

* dependency audit
* outdated dependency review
* vulnerability review

لا تقم بتحديث dependencies عشوائيًا.

إذا كان تحديث dependency ضروريًا:

1. حدّثها.
2. اختبر.
3. lint.
4. typecheck.
5. build.
6. tests.

---

# 28. Automated Security Tests

أضف اختبارات أمنية فعلية، وليس فقط Unit Tests عادية.

اختبر على الأقل:

* unauthorized access
* customer → admin
* customer → other customer resource
* invalid token
* expired token
* malformed input
* mass assignment
* invalid coupon
* price manipulation
* total manipulation
* quantity manipulation
* duplicate order request
* duplicate webhook
* insufficient stock
* rate limiting
* protected endpoints

---

# 29. Production Failure Scenarios

اختبر behavior عند:

* Database unavailable
* invalid environment
* payment provider unavailable
* email provider unavailable
* malformed webhook
* duplicate webhook
* timeout
* invalid request
* unexpected exception

يجب ألا يؤدي فشل Email مثلًا إلى إفساد Order تم إنشاؤه بنجاح إذا كانت architecture تسمح بالفصل بينهما.

---

# 30. Operational Documentation

حدّث README وأضف قسم:

`Production Operations`

يتضمن:

* startup
* shutdown
* environment variables
* migrations
* health checks
* logs
* troubleshooting
* backup considerations
* payment configuration
* email configuration
* security configuration

لا تضع Secrets.

---

# 31. Security Checklist

قبل إنهاء المرحلة، راجع:

### Authentication

PASS / FAIL

### Authorization

PASS / FAIL

### Cookies

PASS / FAIL

### CORS

PASS / FAIL

### Headers

PASS / FAIL

### Input validation

PASS / FAIL

### Rate limiting

PASS / FAIL

### IDOR protection

PASS / FAIL

### Mass assignment

PASS / FAIL

### SQL injection protection

PASS / FAIL

### XSS-related API risks

PASS / FAIL

### CSRF considerations

PASS / FAIL

### Secrets management

PASS / FAIL

### Payment security

PASS / FAIL

### Inventory concurrency

PASS / FAIL

### Error handling

PASS / FAIL

### Logging

PASS / FAIL

### Health checks

PASS / FAIL

### Graceful shutdown

PASS / FAIL

### Dependency security

PASS / FAIL

---

# 32. Required Validation

بعد التنفيذ شغّل:

* lint
* typecheck
* unit tests
* integration tests
* security tests
* frontend build
* backend build

وأصلح كل Error.

إذا بقي Warning أمني أو configuration issue، لا تخفيه.

صنّفه بوضوح:

`WARNING`

أو:

`CONFIGURATION REQUIRED`

---

# 33. لا تدّعي Production Ready

ممنوع كتابة:

`PRODUCTION READY`

فقط لأن:

* build نجح
* tests نجحت
* lint نجح

Production readiness تحتاج Security + Operations + Configuration + Deployment verification.

---

# 34. لا تنفذ Penetration Testing في هذه المرحلة

هذه المرحلة هدفها:

**Build → Harden → Validate**

لا تبدأ Pentest شامل الآن.

بعد إكمال هذه المرحلة، سيكون هناك Prompt مستقل للـAuthorized Security Assessment.

---

# 35. Final Report

بعد إكمال التنفيذ، أعطني تقريرًا دقيقًا يحتوي:

## Implementation

ما الذي تم بناؤه.

## Security

ما الذي تم تأمينه.

## Operations

ما الذي تم إضافته لتشغيل Backend Production.

## Tests

كل الاختبارات التي تم تشغيلها ونتائجها.

## Findings

أي مشاكل تم اكتشافها.

## Fixes

ما تم إصلاحه.

## Remaining Risks

أي مخاطر متبقية.

## Configuration Required

أي Secrets / Providers / Infrastructure configuration مطلوبة خارج الكود.

## Final Status

استخدم واحدة فقط:

`READY FOR AUTHORIZED SECURITY TESTING`

أو:

`NOT READY FOR AUTHORIZED SECURITY TESTING`

لا تستخدم:

`PRODUCTION READY`

إلا إذا كان ذلك مثبتًا فعلًا.

---

# START

ابدأ الآن بهذه العملية:

1. أنشئ `25_Backend_Security_and_Operations.md`.
2. انسخ هذا الـPrompt إليه بالكامل.
3. اقرأ الملف من داخل `Antigravity_Prompts`.
4. نفّذ ما فيه بالترتيب.
5. اختبر.
6. أصلح.
7. أعد الاختبار.
8. لا تبدأ أي Prompt آخر.
9. لا تسألني للموافقة بين الخطوات.
10. توقف فقط بعد إكمال هذه المرحلة وإعطاء التقرير النهائي.
