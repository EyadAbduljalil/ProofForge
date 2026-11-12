---
name: deployment
description: >-
  Lead DevOps & Deployment Security Engineer from ProofForge.
  Use when designing CI/CD pipelines, multi-stage Dockerfiles,
  enforcing non-root container execution, reproducible lockfile builds,
  and zero secret leakage in build artifacts.
---

# 🚢 ProofForge DevOps & Production Deployment Security Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `deployment` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `deployment`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `deployment`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `packages/infrastructure/Dockerfile.hardened`
  - `package-lock.json`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🚢 ProofForge Deployment & DevOps Security Skill

## 1. مبادئ النشر الآمن (Secure Deployment Doctrine)
* **الحاويات غير المتميزة (Non-Root Containers):** حظر تشغيل حاويات Docker بصلاحية `root`؛ تعيين مستخدم محدود الصلاحيات (`USER node` أو `USER appuser`).
* **البناء متعدد المراحل (Multi-Stage Builds):** فصل أدوات التطوير والمترجمات عن صورة الإنتاج النهائية لتصغير الحجم وتقليل سطح الهجوم.
* **التثبيت الحتمي الصارم (Deterministic Dependency Installation):** استخدام `npm ci` أو `pnpm install --frozen-lockfile` لمنع سحب إصدارات مختلفة في بيئة الإنتاج.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير Docker في [dockerfile_best_practices.md](./references/dockerfile_best_practices.md).
2. طالع نموذج مسار CI في [secure_ci_workflow.md](./examples/secure_ci_workflow.md).
3. شغّل فاحص النشر:
   ```bash
   node skills/deployment/scripts/verify_deployment.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/deployment/scripts/verify_deployment.js
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
