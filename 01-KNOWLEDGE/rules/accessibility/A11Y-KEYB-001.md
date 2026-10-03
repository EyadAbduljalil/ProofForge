---
id: "A11Y-KEYB-001"
title: "إمكانية الملاحة الكاملة عبر لوحة المفاتيح ووضوح مؤشر التركيز"
category: "accessibility"
subcategory: "keyboard"
severity: "HIGH"
applies_to:
  - "all"
  - "frontend"
  - "a11y"
tags:
  - "accessibility"
  - "keyboard"
  - "focus"
  - "wcag"
cwe: "N/A"
status: "ACTIVE"
---

# A11Y-KEYB-001: إمكانية الملاحة الكاملة عبر لوحة المفاتيح ووضوح مؤشر التركيز

## 1. المتطلب الإلزامي (Requirement)
يجب أن تكون كافة الإجراءات والروابط والعناصر التفاعلية قابلة للوصول والتفعيل الكامل عبر لوحة المفاتيح حصراً (باستخدام مفاتيح `Tab`, `Enter`, `Space`, والأسهم). يُحظر تماماً إلغاء مؤشر التركيز (`outline: none` أو `outline: 0`) دون توفير بديل بصري عالي التباين وواضح للتركيز عبر `:focus-visible`.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
مستخدمو لوحة المفاتيح والتقنيات المساعدة يعتمدون كلياً على مؤشر التركيز لمعرفة موقعهم الحالي على الشاشة؛ إخفاء المؤشر يجعل التطبيق غير قابل للاستخدام لهؤلاء المستخدمين.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* ممارسة سيئة جداً تكسر إمكانية الوصول */
* {
  outline: none !important;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 3px;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- التحقق من تفعيل كافة الأزرار ومستمعات النقر عبر لوحة المفاتيح ومنع اختفاء مؤشرات التركيز.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار الملاحة بلوحة المفاتيح واجتياز فحص `focus-visible`.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إزالة أي قواعد `outline: none` عامة.
2. تزويد العناصر بمؤشر تركيز بارز.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات للعناصر القابلة للتفاعل.

## 9. المراجع والمعايير الدولية (References)
- WCAG 2.2 Success Criterion 2.1.1 (Keyboard)
- WCAG 2.2 Success Criterion 2.4.7 (Focus Visible)
