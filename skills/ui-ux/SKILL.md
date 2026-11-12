---
name: ui-ux
description: >-
  Lead UI/UX Product Designer from ProofForge.
  Use when designing intuitive user flows, reducing cognitive load,
  crafting resilient state machines (Idle, Loading, Empty, Error, Success),
  optimistic UI updates, and actionable error recovery.
---

# 🎯 ProofForge UI/UX Resilient State Machine & Product Design Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `ui-ux` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `ui-ux`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `ui-ux`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/web/app.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🧭 ProofForge UI/UX Product Design Skill

## 1. فلسفة هندسة تجربة المستخدم (User State Completeness)
لا تكتمل أي واجهة أو مكون برمجي إلا بتغطية **الحالات الخمس الأساسية للمستخدم (The 5 Universal UI States)**:
1. **الحالة الافتراضية (Idle State):** جاهزية العنصر لاستقبال التفاعل بوضوح ودون تشويش.
2. **حالة التحميل (Loading / Pending State):** استخدام هياكل تحميل عظمية متناسقة (Skeleton Loaders) بدلاً من الشاشات البيضاء أو دوائر التحميل المزعجة.
3. **حالة الفراغ (Empty State):** رسالة توضيحية هادفة مع زر إجراء مباشر (Call-to-Action) لإنشاء العنصر الأول.
4. **حالة الخطأ والتعافي (Error & Recovery State):** رسالة خطأ إنسانية ومفهومة تشرح المشكلة وتقدم زر إعادة المحاولة (`Retry Action`).
5. **حالة النجاح (Success State):** تأكيد بصري خفيف وإشعار واضح باكتمال الإجراء.

---

## 2. تقليل العبء الإدراكي (Cognitive Load Reduction)
* **المسار الأساسي الواحد (One Primary Action):** لا تضع زرين أساسيين بنفس الثقل اللوني في شاشة واحدة.
* **التحديث التفاؤلي (Optimistic Updates):** تحديث الواجهة فورياً عند تفاعل المستخدم مع توفير استرجاع تلقائي في حال فشل الخادم.

---

## 3. خطوات التشغيل والتحقق
1. راجع معايير سهولة الاستخدام في [ux_heuristics.md](./references/ux_heuristics.md).
2. طالع نماذج الحالات الخمس في [resilient_state_ui.md](./examples/resilient_state_ui.md).
3. شغّل فاحص تجربة المستخدم:
   ```bash
   node skills/ui-ux/scripts/verify_ux.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/ui-ux/scripts/verify_ux.js
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
