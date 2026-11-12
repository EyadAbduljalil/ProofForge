---
name: api
description: >-
  Lead API Architect & Contract Specialist from ProofForge.
  Use when designing REST/GraphQL APIs, enforcing OpenAPI contracts,
  implementing idempotency keys for mutations, semantic versioning (/v1/),
  and rate-limiting strategies.
---

# 🔌 ProofForge API Contract & Protocol Engineering Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `api` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `api`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `api`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/server/server.js`
  - `packages/contracts/envelope.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🔌 ProofForge API Architecture & Contracts Skill

## 1. مبادئ عقود الـ API (API Contract Mandate)
* **الحتمية والتكرار الآمن (Idempotent Operations):**
  - كل نقطة نهاية تقوم بتعديل بيانات حساسة (مثل عمليات الدفع أو إنشاء طلبات) يجب أن تدعم رأس `Idempotency-Key`.
* **الإصدارات الصريحة (Explicit API Versioning):**
  - اعتماد مسارات صريحة (مثل `/api/v1/`) لمنع كسر التوافقية مع العملاء القدامى.
* **محددات الاستهلاك (Rate Limiting & Throttling):**
  - فرض نوافذ زمنية متدرجة (Sliding Window) للحد من هجمات حجب الخدمة ومحاولات التخمين.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير العقود في [api_contract_standard.md](./references/api_contract_standard.md).
2. طالع نموذج نقطة النهاية المتكررة بأمان في [idempotent_post_endpoint.md](./examples/idempotent_post_endpoint.md).
3. شغّل فاحص عقود الـ API:
   ```bash
   node skills/api/scripts/verify_api.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/api/scripts/verify_api.js
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
