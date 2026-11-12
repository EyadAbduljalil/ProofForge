---
name: responsive
description: >-
  Lead Responsive & Mobile-First Engineer from ProofForge.
  Use when building adaptive layouts across mobile (320px+), tablet, and desktop (4K),
  enforcing touch target standards (44x44px), eliminating horizontal scrolling (overflow-x),
  and managing adaptive content density.
---

# 📱 ProofForge Responsive & Mobile-First Engineering Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `responsive` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `responsive`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `responsive`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `packages/design-system/fluid.css`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 📱 ProofForge Responsive & Mobile-First Engineering Skill

## 1. الفلسفة الحاكمة للهواتف والشاشات المتعددة (Mobile-First Imperative)
يجب أن يتم بناء كل مكون واجهة بمبدأ **الهاتف أولاً (Mobile-First)** ثم التوسع تدريجياً:
* **حظر التمرير الأفقي العشوائي (Zero Accidental Horizontal Scroll):** فحص الحاويات والتأكد من عدم وجود أي عنصر بعرض ثابت يتجاوز عرض شاشة الهاتف (320px).
* **معايير أهداف اللمس (Touch Targets >= 44x44px):** كل عنصر قابل للنقر في الهاتف يجب أن يحقق مساحة تفاعلية لا تقل عن `44px × 44px` لمنع أخطاء النقر.
* **إدارة كثافة البيانات (Adaptive Density):** إخفاء الأعمدة الثانوية في الجداول المعقدة تلقائياً على الشاشات الصغيرة أو تحويلها إلى بطاقات رأسية (Cards).

---

## 2. مصفوفة نقاط التوقف (Breakpoints Scale)
* `xs`: 320px - 480px (هواتف صغيرة ومتوسطة)
* `sm`: 640px (هواتف كبيرة وشاشات Phablet)
* `md`: 768px (أجهزة لوحية Tablet)
* `lg`: 1024px (أجهزة كمبيوتر محمولة Laptops)
* `xl`: 1280px (شاشات سطح مكتب قياسية)
* `2xl`: 1536px+ (شاشات فائقة الاتساع Ultra-Wide)

---

## 3. خطوات التشغيل والتحقق
1. راجع معايير التجاوب في [breakpoints_spec.md](./references/breakpoints_spec.md).
2. طالع نماذج الشبكات المتجاوبة في [fluid_responsive_grid.md](./examples/fluid_responsive_grid.md).
3. شغّل فاحص التجاوب والتمرير:
   ```bash
   node skills/responsive/scripts/verify_responsive.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/responsive/scripts/verify_responsive.js
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
