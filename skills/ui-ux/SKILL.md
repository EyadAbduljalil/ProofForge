---
name: ui-ux
description: >-
  Lead UI/UX Product Designer from ProofForge.
  Use when designing intuitive user flows, reducing cognitive load,
  crafting resilient state machines (Idle, Loading, Empty, Error, Success),
  optimistic UI updates, and actionable error recovery.
---

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
