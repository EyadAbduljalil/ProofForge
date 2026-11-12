---
name: taste-craft
description: >-
  Lead Taste & Visual Craft Director from ProofForge.
  Use when elevating UI craftsmanship, refining micro-interactions,
  enforcing tactile feedback, polishing details (borders, typography, shadows, physics),
  and eliminating generic boilerplate aesthetics.
---

# 💎 ProofForge Taste & Visual Craft Skill

## 1. فلسفة الذوق الهندسي الرفيع (The Taste Imperative)
الفرق بين الموقع العادي والموقع المتقن يكمن في **دقّة التفاصيل غير المرئية**:
* **الحدود الدقيقة (Subtle Borders):** استخدام خطوط فصل شبه شفافة (`border-white/10` أو `border-slate-800`) بدلاً من الحدود الصريحة الثقيلة.
* **الظلال الوظيفية (Layered Ambient Shadows):** ظلال ذات انتشار ناعم ومنخفض العتامة بدلاً من الظلال الداكنة الحادة.
* **الاستجابة الحسية اللحظية (Tactile Feedback):** كل زر وتفاعل يجب أن يعطي إحساساً فيزيائياً فوريّاً بالضغط والانتقال (`active:scale-[0.98]`, `transition-all duration-150`).

---

## 2. معايير الإتقان البصري (Craft Standards)
1. **الطباعة:** ضبط تباعد الأسطر (Line-Height / Leading) ليمنح النص مساحة مريحة للقراءة (`leading-relaxed` للفقرات، و `leading-tight` للعناوين).
2. **التباين الهادئ:** تجنب تباين 100% الأبيض الناصع على الأسود القاتم المطلق؛ استخدم الرمادي الفاتح (`text-slate-100` على `#0b0f17`) لإراحة عين المستخدم.
3. **انعدام الزخرفة الفارغة:** لا تضع أي عنصر بصري أو أيقونة ما لم تكن تؤدي وظيفة دلالية حقيقية.

---

## 3. خطوات التشغيل والتحقق
1. راجع معايير الذوق في [craft_rubric.md](./references/craft_rubric.md).
2. استلهم من النماذج الرفيعة في [tasteful_components.md](./examples/tasteful_components.md).
3. شغّل فاحص الإتقان:
   ```bash
   node skills/taste-craft/scripts/audit_craft.js
   ```
