# خطة التحقق المتكيفة لـ WebForge OS
## WebForge OS Adaptive Verification & Suite Applicability Plan

> **التاريخ**: 2026-10-02  
> **المصدر البرمجي**: محرك تخطيط التحقق المتكيف (`packages/orchestration/adaptive-verification-planner.js`)  
> **الهدف**: مواءمة مجموعات الاختبارات بدقة مع الـ Stack الفعلي للمشروع وفصل غير المنطبق عن المنفذ.

---

### 1. مجموعات التحقق النشطة والمنفذة حياً (Active & Executed Verification Suites)

| معرف المجموعة (Suite ID) | النطاق والمكون (Domain / Target) | الحالة (Status) | الأدلة ومسارات الاختبار (Evidence Path) |
| :--- | :--- | :--- | :--- |
| `SUITE_CORE_SECURITY` | أمان الجلسات، التشفير، وحماية IDOR | `ACTIVE / PASSED` | `packages/security/tests/security.test.js` (14 نظام حوكمة) |
| `SUITE_BACKEND_HTTP` | خادم HTTP الحي وعزل المستأجرين ورؤوس الأمان | `ACTIVE / PASSED` | `tests/e2e/server_app.test.js` (9 اختبارات تكاملية حية) |
| `SUITE_STORAGE_HYBRID` | محول التخزين وعزل المستأجرين في الذاكرة | `ACTIVE / PASSED` | `apps/server/db/storage-adapter.js` + E2E Tests |
| `SUITE_DESIGN_ACCESSIBILITY` | نظام التصميم، إمكانية الوصول، وحركة الشاشات | `ACTIVE / PASSED` | `packages/design-system/tests/` + `packages/components/tests/` |
| `SUITE_ORCHESTRATION_COMPLIANCE`| محركات الحوكمة، كشف الـ Stack، وقوانين WebForge | `ACTIVE / PASSED` | `packages/orchestration/tests/orchestration.test.js` |
| `SUITE_INFRASTRUCTURE_STATIC` | تدقيق ملفات Dockerfile و Nginx المصلدة | `ACTIVE / PASSED` | `packages/infrastructure/tests/infra.test.js` |

---

### 2. مجموعات الاختبار المصنفة كـ غير منطبقة (Not Applicable Suites)

| معرف المجموعة (Suite ID) | التقنية المستهدفة (Target Tech) | سبب عدم الانطباق (Applicability Reason) |
| :--- | :--- | :--- |
| `SUITE_POSTGRESQL_LIVE` | خادم PostgreSQL الحي | `NOT_APPLICABLE`: المشروع الحالي يعتمد محرك التخزين المدمج ولا يعتمد على اتصال PostgreSQL إلزامي محلياً. |
| `SUITE_REDIS_CLUSTER_LIVE` | خادم Redis الحي | `NOT_APPLICABLE`: المشروع يعتمد كاش الذاكرة الداخلي المدمج بآلية TTL و Sliding Window. |
| `SUITE_KAFKA_MESSAGING` | وسيط الرسائل Kafka / RabbitMQ | `NOT_APPLICABLE`: معمارية المشروع الحالية متزامنة وتعتمد على معالجة الأحداث المباشرة بدون طوابير خارجية. |
| `SUITE_GRAPHQL_ENDPOINT` | استعلامات GraphQL | `NOT_APPLICABLE`: واجهة المشروع تعتمد معمارية RESTful نقية. |

---

### 3. مجموعات الاختبار المقيدة ببيئة الاستضافة (Environment Limitations)

| معرف المجموعة (Suite ID) | المتطلب (Prerequisite) | الحالة وخطة التفعيل (Limitation & Activation Plan) |
| :--- | :--- | :--- |
| `SUITE_BROWSER_PLAYWRIGHT_LIVE` | تثبيت حزم Chromium/WebKit | `ENVIRONMENT_LIMITATION`: تم تنفيذ والتحقق من اختبارات DOM/HTTP، ويتطلب تشغيل المتصفح الرسومي تشغيل أمر `npx playwright install`. |
| `SUITE_DOCKER_CONTAINER_RUNTIME` | تشغيل Docker Daemon | `ENVIRONMENT_LIMITATION`: تم تدقيق الحاويات استاتيكياً وهندسياً، ويتطلب تشغيل الحاويات توفر ديمون Docker في البيئة. |
