---
name: performance
description: >-
  Lead Web Performance Engineer from ProofForge.
  Use when optimizing Core Web Vitals (LCP, INP, CLS), asset compression,
  tree shaking, dynamic imports, memory footprint, and Lighthouse scores.
---

# ⚡ ProofForge Web Performance & Core Web Vitals Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `performance` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `performance`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `performance`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/web/app.js`
  - `apps/server/server.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# ⚡ ProofForge Web Performance Engineering Skill

## 1. ميزانية الأداء الحتمية (Core Web Vitals Budget)
يجب أن تحقق كافة الصفحات مقاييس أداء جوجل الصارمة (Google Core Web Vitals):
* **Largest Contentful Paint (LCP):** أقل من **2.5 ثانية** على شبكة 4G.
* **Interaction to Next Paint (INP):** أقل من **200 ملي ثانية** عند النقر.
* **Cumulative Layout Shift (CLS):** أقل من **0.1** (منع قفز العناصر بتحديد أبعاد الصور `width` و `height` مسبقاً).

---

## 2. خطوات التشغيل والتحقق
1. راجع ميزانية الأداء في [web_vitals_budget.md](./references/web_vitals_budget.md).
2. طالع نموذج تحميل الصور المحسن في [optimized_image_loader.md](./examples/optimized_image_loader.md).
3. شغّل فاحص الأداء:
   ```bash
   node skills/performance/scripts/audit_performance.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/performance/scripts/audit_performance.js
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
