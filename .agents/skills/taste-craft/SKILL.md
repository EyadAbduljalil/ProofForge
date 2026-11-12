---
name: taste-craft
description: >-
  Lead Taste & Visual Craft Director from ProofForge.
  Use when elevating UI craftsmanship, refining micro-interactions,
  enforcing tactile feedback, polishing details (borders, typography, shadows, physics),
  and eliminating generic boilerplate aesthetics.
---

# 💎 ProofForge Taste, Tactile Polish & Visual Craft Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `taste-craft` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `taste-craft`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `taste-craft`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `packages/design-system/*.css`
  - `apps/web/index.html`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/taste-craft/scripts/audit_craft.js
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
