# ملف تعريف المشروع الشامل — PROJECT_PROFILE.md
## WebForge OS — Master Project Profile & Capability Catalog

### 1. بطاقة تعريف المشروع (Project Identification)
* **اسم النظام:** WebForge OS (Engineering Operating System & Governance Framework).
* **نوع المعمارية:** Monorepo يضم 7 حزم رئيسية وتطبيقي server و web وسجل مركزي للاعتماديات.
* **بيئة التشغيل (Runtime):** Node.js v22.16.0 (CommonJS / ES Modules Hybrid).
* **اللغات المستخدمة:** JavaScript (Node.js backend, Vanilla ES6+ frontend), CSS3 (Design Tokens), HTML5.
* **مستوى النضج الهندسي:** Level 4+ (Enforced & Self-Verified via Automated Harness).

---

### 2. مصفوفة القدرات التشغيلية والبيئية (Capabilities Matrix)

| البعد التقني | التقنية / المكون الفعلي | الحالة والتحقق |
| :--- | :--- | :--- |
| **الخادم الأساسي (Backend)** | Node.js Native HTTP Server (`apps/server/server.js`) | مجاز ومختبر عبر E2E |
| **الواجهة الأمامية (Frontend)** | Vanilla Web UI (`apps/web/`) بدون أطر عمل ضخمة | مجاز مع دعم WCAG 2.2 AA |
| **قواعد البيانات (Persistence)** | محول تخزين هجين (`In-Memory` مع دعم `PostgreSQL`) | مجاز (PostgreSQL Live: Limitation) |
| **التخزين المؤقت (Cache)** | محول كاش ذاتي بانتهاء صلاحية TTL | مجاز (Redis Live: Limitation) |
| **الحوكمة الأمنية (Security)** | 14 محرك حماية تشمل Scrypt, HMAC, SSRF, IDOR | مجاز 100% في Security Suite |
| **سطر الأوامر (CLI)** | 18 أمراً مركزياً عبر `bin/webforge.js` | مجاز ومثبت في الـ Terminal |

---

### 3. تدقيق التدفقات الحرجة (Critical Flows)
1. **المصادقة وعزل المستأجرين:** تسجيل الدخول المشفر وإصدار الرموز وعزل الموارد بناءً على `tenant_id`.
2. **المعاملات المالية والـ Webhooks:** تنفيذ الشراء الذري مع مفاتيح عدم التكرار والتحقق من التوقيع المشفر.
3. **حوكمة وكلاء الذكاء الاصطناعي:** فحص وحظر حقن الأوامر وتقييد الأدوات بالقائمة البيضاء.
