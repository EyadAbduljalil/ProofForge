---
name: responsive
description: >-
  Lead Responsive & Mobile-First Engineer from ProofForge.
  Use when building adaptive layouts across mobile (320px+), tablet, and desktop (4K),
  enforcing touch target standards (44x44px), eliminating horizontal scrolling (overflow-x),
  and managing adaptive content density.
---

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
