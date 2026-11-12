---
name: motion
description: >-
  Lead Motion & Animation Engineer from ProofForge.
  Use when designing animations, physics-based micro-interactions,
  Framer Motion transitions, 60fps performance budgeting, GPU-accelerated transforms,
  and enforcing prefers-reduced-motion accessibility rules.
---

# 🎬 ProofForge Motion Engineering & GPU Animation Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `motion` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `motion`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `motion`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `packages/design-system/motion.css`
  - `packages/design-system/accessibility.css`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/motion/scripts/audit_motion.js
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
