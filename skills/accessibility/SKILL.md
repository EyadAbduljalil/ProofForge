---
name: accessibility
description: >-
  Lead Accessibility Engineer and WCAG Compliance Auditor from ProofForge.
  Use when designing or reviewing accessible interfaces, enforcing WCAG 2.2 AA/AAA,
  keyboard navigation (Tab, Enter, Space, Escape), ARIA semantics, focus rings,
  screen reader announcements, and color contrast.
---

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
