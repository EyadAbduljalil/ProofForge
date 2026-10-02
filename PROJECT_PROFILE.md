# ملف توصيف الـ Stack الفعلي لمشروع WebForge OS
## WebForge OS Adaptive Project Profile

> **تاريخ التوليد**: 2026-10-02  
> **آلية التوصيف**: محرك الاستكشاف التكيفي المبني على الأدلة الصارمة (`packages/orchestration/stack-detector.js`)  
> **مبدأ الحقيقة**: الاستكشاف يحدد الواقع، ولا يتم فرض أي تقنية غير موجودة في بنية المشروع.

---

### 1. ملخص الـ Stack المكتشف (Discovered Stack Summary)

| البعد التقني (Dimension) | التقنية المكتشفة فعلياً (Detected Tech) | دليل الاستكشاف والملف المصدري (Evidence Source) |
| :--- | :--- | :--- |
| **نوع المشروع (Project Type)** | Fullstack Autonomous Web Engineering OS | وجود بنية متكاملة (`apps/web` + `apps/server` + `packages/`) |
| **لغات البرمجة (Languages)** | JavaScript (Node.js Runtime) | `package.json`, محرك Node.js الأصلي بدون اعتماديات خارجية غير ضرورية |
| **واجهة المستخدم (Frontend)** | Vanilla HTML5 / CSS3 / ES Modules | `apps/web/index.html`, `apps/web/styles/`, تصميم محمي من التبعيات الثقيلة |
| **محرك الخلفية (Backend Runtime)** | Native Node.js Zero-Trust HTTP Server | `apps/server/server.js` بنظام معماري صفري الاعتماديات |
| **قاعدة البيانات (Database Engine)** | Multi-Tenant Hybrid Storage Adapter | `apps/server/db/storage-adapter.js` مع عزل المستأجرين (RLS) |
| **محرك الكاش (Cache Engine)** | Internal In-Memory Cache with TTL & LRU | `apps/server/db/storage-adapter.js`, كاش محلي سريع مع سياسات انتهاء الصلاحية |
| **طبقة المصادقة (Auth Strategy)** | Scrypt Password Hashing + Timing-Safe Tokens | `packages/security/` + `apps/server/server.js` |
| **أنماط واجهات البرمجة (API Styles)** | RESTful Zero-Trust Architecture | `apps/server/server.js` مع معالجة الرؤوس المشددة و CSP |
| **أطر الاختبار (Testing Frameworks)** | Native Node.js Test Runner + Custom Verification | `node:test`, `packages/*/tests/`, `tests/e2e/` |
| **البنية التحتية (Infrastructure)** | Hardened Dockerfile + Nginx Security Config | `packages/infrastructure/Dockerfile.hardened`, `nginx-hardened.conf` |
| **دعم اللغات والاتجاه (Localization & RTL)** | Full Arabic (RTL) & English (LTR) Support | `apps/web/index.html` مع `dir="rtl"` و `lang="ar"` ورموز بصرية متوافقة |

---

### 2. تصنيف التقنيات الخارجية حسب الانطباق (Applicability Classification)

| التقنية (Technology) | حالة الانطباق في المشروع الحالي (Status) | التبرير الهندسي الصارم (Engineering Rationale) |
| :--- | :--- | :--- |
| **PostgreSQL Live Server** | `NOT_APPLICABLE` (بالمشروع الحالي) / `OPTIONAL_ADAPTER` | المشروع يعمل حالياً بمحول تخزين مدمج هجين آمن، محول PostgreSQL متاح كـ Driver خارجي عند توفر بيئة قاعدة بيانات حية. |
| **Redis Live Cluster** | `NOT_APPLICABLE` (بالمشروع الحالي) / `OPTIONAL_ADAPTER` | المشروع يعتمد محرك كاش محلي مدمج في الذاكرة بآلية Sliding Window و TTL، ويوفر محول Redis اختياري للإنتاج الموزع. |
| **Docker Daemon** | `ENVIRONMENT_LIMITATION` (على بيئة الاختبار الحالية) | ملفات Docker و Nginx المصلدة مبنية ومختبرة تكاملياً واستاتيكياً، لكن ديمون Docker غير مشغل في بيئة المضيف المحلية الحالية. |
| **Headless Playwright Chromium** | `ENVIRONMENT_LIMITATION` (على بيئة الاستضافة الخالية من المتصفحات) | تم تفعيل اختبارات الـ DOM/HTTP E2E المحاكية بالكامل وتوثيق متطلبات تثبيت متصفحات Playwright للـ Live Browser E2E. |

---

### 3. قرارات التكيف المعماري (Architectural Adaptations)
- **Zero-Dependency Core**: الاعتماد على مكتبات Node.js القياسية (`node:crypto`, `node:http`, `node:fs`, `node:test`) لضمان أقصى درجات الموثوقية والسرعة دون الاعتماد على مئات الحزم غير الآمنة.
- **Strict Tenant Context**: عزل كامل لبيانات كل مستأجر ومنع هجمات IDOR عبر تمرير سياق المستأجر الإلزامي في كل استعلام وتحديث.
- **Adaptive Execution**: تحويل WebForge من أداة تفرض أدوات خارجية إلى نظام ذكي يستكشف ما يملكه المطور ويختبره بكفاءة متناهية.
