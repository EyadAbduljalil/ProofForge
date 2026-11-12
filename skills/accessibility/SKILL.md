---
name: accessibility
description: >-
  Lead Accessibility Engineer and WCAG Compliance Auditor from ProofForge.
  Use when designing or reviewing accessible interfaces, enforcing WCAG 2.2 AA/AAA,
  keyboard navigation (Tab, Enter, Space, Escape), ARIA semantics, focus rings,
  screen reader announcements, and color contrast.
---

# ♿ ProofForge Accessibility (a11y) & WCAG 2.2 Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `accessibility` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `accessibility`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `accessibility`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/web/app.js`
  - `packages/design-system/*.css`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# ♿ ProofForge Accessibility (a11y) Skill

## 1. مبادئ الشمولية الرقمية وإمكانية الوصول (WCAG 2.2 Standard)
كل ميزة وواجهة في ProofForge يجب أن تكون قابلة للاستخدام الكامل من قِبل جميع المستخدمين دون استثناء:
* **التنقل الكامل بلوحة المفاتيح (100% Keyboard Navigable):**
  - كل زر، رابط، نموذج، وقائمة منسدلة يجب الوصول إليها عبر مفتاح `Tab` وتفعيلها بـ `Enter` أو `Space`.
  - النوافذ المنبثقة (Modals) يجب إغلاقها بمفتاح `Escape` واحتواء التركيز بداخلها (Focus Trap).
* **حلقات التركيز المرئية (Visible Focus Rings):** يُمنع إزالة مؤشر التركيز (`outline: none`) دون توفير بديل عالي الوضوح (`focus-visible:ring-2 focus-visible:ring-ring`).
* **الدلالات الوصفية لبرامج قراءة الشاشة (ARIA Semantics):**
  - تسمية واضحة للأزرار التي تحتوي أيقونات فقط (`aria-label="Close dialog"`).
  - تحديد أدوار العناصر الحوارية (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).

---

## 2. مصفوفة نسب التباين الإلزامية (Contrast Ratios)
* **النصوص العادية:** نسبة تباين لا تقل عن **4.5:1** مقابل الخلفية.
* **النصوص الكبيرة والعناوين:** نسبة تباين لا تقل عن **3:1**.
* **عناصر التحكم والحدود النشطة:** نسبة تباين لا تقل عن **3:1**.

---

## 3. خطوات التشغيل والتحقق
1. راجع قائمة التحقق في [wcag_checklist.md](./references/wcag_checklist.md).
2. طالع نموذج النافذة المنبثقة في [accessible_dialog.md](./examples/accessible_dialog.md).
3. شغّل فاحص إمكانية الوصول:
   ```bash
   node skills/accessibility/scripts/audit_a11y.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/accessibility/scripts/audit_a11y.js
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
