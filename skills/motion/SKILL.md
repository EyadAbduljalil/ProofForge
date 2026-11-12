---
name: motion
description: >-
  Lead Motion & Animation Engineer from ProofForge.
  Use when designing animations, physics-based micro-interactions,
  Framer Motion transitions, 60fps performance budgeting, GPU-accelerated transforms,
  and enforcing prefers-reduced-motion accessibility rules.
---

# 🎬 ProofForge Motion & Animation Skill

## 1. الفلسفة الحركية الهادفة (Functional Motion Doctrine)
التحريك في ProofForge ليس للزينة بل هو **إشارة وظيفية إدراكية** توضح للمستخدم تدفق العمليات وتغير الحالات:
* **حظر التحريك الثقيل غير الضروري:** يُمنع تحريك خصائص تسبب إعادة تخطيط الصفحة (Reflow / Layout Shift) مثل `width`, `height`, `top`, `margin`.
* **الاعتماد الحصري على تسريع البطاقة الرسومية (GPU Accelerated):** تحريك `transform` (الترجمة والتحجيم) و `opacity` فقط.
* **احترام خيار تقليل الحركة (Reduced Motion):** إذا كان المستخدم مفعلاً لـ `prefers-reduced-motion`، يجب تعطيل الحركة فورياً والانتقال المباشر بدون تأخير.

---

## 2. معايير المدة والمنحنيات الفيزيائية
1. **الاستجابة اللحظية (Micro-Interactions):** مدة `100ms - 200ms` (أزرار، حقول، أيقونات).
2. **الانتقالات الهيكلية (Panels & Modals):** مدة `250ms - 350ms` باستخدام منحنيات فيزيائية طبيعية (`ease-out` أو Spring Physics).
3. **معدل الإطارات (60 FPS Budget):** عدم حدوث أي انخفاض في معدل الإطارات (Jank / Dropped Frames).

---

## 3. خطوات التشغيل والتحقق
1. راجع معايير المنحنيات في [motion_spec.md](./references/motion_spec.md).
2. طالع نماذج التحريك السلس في [smooth_transitions.md](./examples/smooth_transitions.md).
3. شغّل فاحص الحركة:
   ```bash
   node skills/motion/scripts/audit_motion.js
   ```
