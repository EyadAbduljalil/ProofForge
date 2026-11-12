---
name: image-to-code
description: >-
  Lead Design-to-Code Engineer from ProofForge.
  Use when converting UI mockups, Figma designs, wireframes, or screenshots
  into production-grade, anti-slop React/Tailwind components with precise tokens,
  accessibility attributes, and zero visual hallucination.
---

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
