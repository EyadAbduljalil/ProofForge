---
name: production-readiness
description: >-
  Lead Site Reliability Engineer & Production Readiness Auditor from ProofForge.
  Use before launching applications to production, verifying 12-Factor principles,
  healthz/readyz observability probes, structured JSON logging, process supervision,
  and zero hardcoded secrets.
---

# 🛡️ ProofForge Production Readiness & SRE Operations Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `production-readiness` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `production-readiness`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `production-readiness`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/server/server.js`
  - `packages/security/secrets.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🚀 ProofForge Production Readiness & Reliability Skill

## 1. ميثاق الجاهزية للإنتاج (Production Readiness Doctrine)
لا يُنشر أي تطبيق في بيئة الإنتاج دون اجتياز **بوابات الجاهزية التشغيلية (Operational Readiness Gates)**:
* **فحص الصحة والجاهزية (Health & Liveness Probes):** توفير نقاط نهاية خفيفة وسريعة `/healthz` (هل التطبيق يعمل؟) و `/readyz` (هل اتصالات قواعد البيانات والتخزين جاهزة؟).
* **السجلات المنظمة غير المسربة (Structured JSON Logging):** تسجيل الأحداث بتنسيق JSON مع حظر طباعة أي بيانات حساسة أو أرقام سرية أو رموز مرور.
* **مبادئ 12-Factor App:** قراءة كافة الإعدادات والروابط حصراً من متغيرات البيئة مع توفير قيم افتراضية آمنة (Strict Fail-Closed Defaults).

---

## 2. خطوات التشغيل والتحقق
1. راجع قائمة التحقق للإنتاج في [readiness_checklist.md](./references/readiness_checklist.md).
2. طالع نموذج نقاط الفحص في [health_check_controller.md](./examples/health_check_controller.md).
3. شغّل فاحص الجاهزية:
   ```bash
   node skills/production-readiness/scripts/audit_readiness.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/production-readiness/scripts/audit_readiness.js
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
