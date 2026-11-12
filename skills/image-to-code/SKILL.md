---
name: image-to-code
description: >-
  Lead Design-to-Code Engineer from ProofForge.
  Use when converting UI mockups, Figma designs, wireframes, or screenshots
  into production-grade, anti-slop React/Tailwind components with precise tokens,
  accessibility attributes, and zero visual hallucination.
---

# 🖼️ ProofForge Design-to-Code & Visual Reconstruction Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `image-to-code` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `image-to-code`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `image-to-code`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `packages/components/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🖼️ ProofForge Image-to-Code Engineering Skill

## 1. مبادئ ترجمة التصاميم إلى كود برمجي (Fidelity & Anti-Hallucination)
* **المطابقة الدقيقة لرموز التصميم (Design Token Mapping):**
  - استخراج المسافات والألوان من التصميم ومطابقتها مع مقياس 4px/8px ورموز Tailwind الدلالية بدلاً من وضع قياسات عشوائية تقريبية.
* **حظر التخمين العشوائي (Zero Visual Hallucination):**
  - لا تخترع أزراراً أو عناصر غير موجودة في الصورة؛ التزم بالهيكل البصري الظاهر مع إكماله كودياً بالخصائص التفاعلية وإمكانية الوصول (`aria-label`, `focus-visible`).
* **بنية المكونات المعيارية:** تجزئة الصورة إلى مكونات فرعية صغيرة وقابلة لإعادة الاستخدام.

---

## 2. خطوات التشغيل والتحقق
1. راجع جدول تحويل القياسات في [figma_to_code_rubric.md](./references/figma_to_code_rubric.md).
2. طالع نموذج التحويل النظيف في [mockup_to_clean_code.md](./examples/mockup_to_clean_code.md).
3. شغّل فاحص المكونات:
   ```bash
   node skills/image-to-code/scripts/verify_image_code.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/image-to-code/scripts/verify_image_code.js
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
