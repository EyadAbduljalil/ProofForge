---
name: performance
description: >-
  Lead Web Performance Engineer from ProofForge.
  Use when optimizing Core Web Vitals (LCP, INP, CLS), asset compression,
  tree shaking, dynamic imports, memory footprint, and Lighthouse scores.
---

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
