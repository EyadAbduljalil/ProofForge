---
id: "UI-COLOR-001"
title: "استخدام توكنات الألوان الدلالية وحظر قيم Hex المباشرة في المكونات"
category: "design"
subcategory: "colors"
severity: "LOW"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "design"
  - "colors"
  - "tokens"
  - "theming"
cwe: "N/A"
status: "ACTIVE"
---

# UI-COLOR-001: استخدام توكنات الألوان الدلالية وحظر قيم Hex المباشرة في المكونات

## 1. المتطلب الإلزامي (Requirement)
يجب استخدام توكنات الألوان الدلالية (`--color-surface-primary`, `--color-brand-primary`, etc.) في كافة المكونات البرمجية وصفحات الواجهة. يُحظر استخدام أكواد الألوان الست عشرية المباشرة (مثل `#3b82f6` أو `rgb(15, 23, 42)`) داخل ملفات المكونات لضمان دعم الثيمات الفاتحة والداكنة بسلاسة.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
التضمين المباشر للألوان يكسر إمكانية التبديل بين الوضعين الداكن والفاتح (Dark/Light Modes) ويجعل إعادة بناء الهوية البصرية مستحيلة ومكلفة هندسياً.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* ألوان ثابتة ومباشرة تكسر التبديل بين الثيمات */
.button-primary {
  background-color: #2563eb;
  color: #ffffff;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
.button-primary {
  background-color: var(--color-brand-primary);
  color: var(--color-text-primary);
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص ملفات CSS للتأكد من خلوها من قيم Hex المباشرة داخل كتل فئات المكونات.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير مراجعة الأنماط البصرية يؤكد توافق كافة المكونات مع الثيمات المتعددة.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال قيم الألوان المباشرة بمتغيرات CSS المعرفة في جذر النظام.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
ملف تعريف التوكنات المركزي نفسه (`tokens.css` أو `theme.js`).

## 9. المراجع والمعايير الدولية (References)
- W3C Design Tokens Community Group Specification
