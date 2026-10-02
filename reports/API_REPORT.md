# تقرير واجهات برمجة التطبيقات — API_REPORT.md
## WebForge OS — Comprehensive API & Endpoints Report

### 1. ملخص واجهات الـ API (API Summary)
يوفر خادم التطبيق الموحد (`apps/server/server.js`) مجموعة متكاملة من نقاط النهاية المحمية والموثقة والمختبرة، والتي تغطي الصحة والمراقبة والمصادقة وإدارة الحسابات والدفع ومعالجة الـ Webhooks.

---

### 2. جدول نقاط النهاية والحالة التشغيلية (Endpoints Inventory & Status)

| المسار (Endpoint) | الطريقة (Method) | الأمان والمصادقة | الغرض والوظيفة | نتيجة التحقق |
| :--- | :--- | :--- | :--- | :--- |
| `/healthz` | GET | Public | فحص سلامة الخادم الأساسي | مجاز (HTTP 200) |
| `/readyz` | GET | Public | فحص جاهزية التخزين والمكونات | مجاز (HTTP 200) |
| `/metrics` | GET | Public / Scraped | مقاييس Prometheus للرصد | مجاز (Text/Plain) |
| `/api/v1/auth/register` | POST | Rate Limited + Strict DTO | تسجيل حساب جديد بكلمة مرور معقدة | مجاز (HTTP 201) |
| `/api/v1/auth/login` | POST | Rate Limited + Timing-Safe | تسجيل الدخول وتوليد رمز جلسة آمن | مجاز (HTTP 200) |
| `/api/v1/user/profile` | GET | Bearer Token + Tenant Guard | جلب بيانات المستخدم مع عزل تام | مجاز (HTTP 200 / 403) |
| `/api/v1/checkout/process` | POST | Auth + Idempotency Key | معالجة عمليات الشراء والدفع | مجاز (HTTP 200 / Replay Blocked) |
| `/api/v1/webhooks/payment` | POST | HMAC Signature Verification | استقبال إشعارات الدفع الخارجية | مجاز (HTTP 200 / 401 Invalid Sig) |

---

### 3. تدقيق عقود الـ API والـ DTOs (Contracts & Schema Validation)
* جميع الاستجابات تتبع الغلاف المعياري الموحد (`ApiResponse Envelope`):
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": { "timestamp": "...", "requestId": "..." }
  }
  ```
* يتم تطهير جميع البيانات الخارجة من حقول PII (مثل كلمات المرور والرموز السرية) تلقائياً قبل إرسالها إلى العميل.

---

### 4. الأدلة والتحقق الفعلي (Evidence & Verification)
* تم التحقق من جميع المسارات السابقة عبر اختبارات الـ E2E الحية (`tests/e2e/server_app.test.js`) المكونة من 9 سيناريوهات كاملة.
