---
name: backend
description: >-
  Lead Backend Systems Architect from ProofForge.
  Use when designing backend services, HTTP routing, middleware pipelines,
  server-side authentication/authorization, error envelopes, connection pooling,
  and graceful process shutdown.
---

# ⚙️ ProofForge Backend Engineering & Systems Architecture Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `backend` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `backend`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `backend`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/server/server.js`
  - `apps/server/db/**`
  - `apps/server/cache/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# ⚙️ ProofForge Backend Engineering Skill

## 1. مبادئ الحوكمة الخلفية (Backend Governance Doctrine)
* **المعالجة الآمنة للطلبات (Strict Request Lifecycle):**
  - كل طلب وارد يمر عبر مصفوفة حتمية: `CORS -> RateLimit -> Auth -> Validation -> Controller -> AuditLog`.
* **مغلف الرد الموحد (Unified Response Envelope):**
  - كافة الردود الناجحة والخطأ تتبع نسقاً واحداً ثابتاً:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "timestamp": "...", "requestId": "..." }
  }
  ```
* **الإغلاق الآمن للمنظومة (Graceful Shutdown):**
  - الاستجابة لإشارات `SIGTERM` و `SIGINT` بإغلاق خادم HTTP، إتمام العمليات العالقة، وإغلاق اتصالات قواعد البيانات بأمان.

---

## 2. خطوات التشغيل والتحقق
1. راجع القواعد الهيكلية في [backend_invariants.md](./references/backend_invariants.md).
2. طالع نموذج المتحكم الآمن في [secure_api_controller.md](./examples/secure_api_controller.md).
3. شغّل فاحص الخوادم الخلفية:
   ```bash
   node skills/backend/scripts/verify_backend.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/backend/scripts/verify_backend.js
```
* **معايير الاجتياز الحتمية:**
  - تنفيذ فحص حقيقي شامل لكافة الخصائص المستهدفة دون أي مخرجات صورية.
  - خروج بكود صفري (Exit Code 0) حصراً عند ثبوت المطابقة بالأدلة المادية.
  - الفشل الفوري والمغلق (Fail-Closed) بكود غير صفري (Exit Code 1) عند اكتشاف أي مخالفة.

## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)
* **الأدلة المطلوبة لإثبات الإنجاز:**
  - تقرير فحص آلي مهيكل بصيغة JSON يؤكد خلو الكود من العيوب.
  - توثيق كافة التغييرات وسلسلة النسب في سجلات التدقيق الكنسية.
  - الامتثال لقاعدة: `AI Output !== Evidence` والاعتماد حصراً على بوابات التحقق المستقلة في CVGF.
