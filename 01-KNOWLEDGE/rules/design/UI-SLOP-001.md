---
id: "UI-SLOP-001"
title: "حظر التوليد البصري الرديء واكتمال الحالات التفاعلية للمكونات"
category: "design"
subcategory: "quality"
severity: "MEDIUM"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "design"
  - "anti-slop"
  - "quality"
  - "interactions"
cwe: "N/A"
status: "ACTIVE"
---

# UI-SLOP-001: حظر التوليد البصري الرديء واكتمال الحالات التفاعلية للمكونات

## 1. المتطلب الإلزامي (Requirement)
يجب أن يحتوي كل مكون تفاعلي (أزرار، حقول إدخال، بطاقات، قوائم) على تعريف مكتمل لكافة حالاته التفاعلية: الحالة الافتراضية (Default)، التحويم (Hover)، التنشيط (Active)، التركيز (Focus-Visible)، والتعطيل (Disabled)، بالإضافة لحالات التحميل (Loading States). يُحظر ترك المكونات بتصاميم بدائية تفتقر للصلابة البصرية.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
المكونات المبتورة الحالات تعطي انطباعاً بضعف جودة المنتج وتسبب إرباكاً للمستخدمين وقصوراً في سهولة الاستخدام.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* زر يفتقر لحالات التحويم والتركيز والتعطيل */
.btn {
  background: blue;
  color: white;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
.btn {
  background: var(--color-brand-primary);
  color: var(--color-text-primary);
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.btn:hover:not(:disabled) {
  background: var(--color-brand-hover);
}
.btn:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص قواعد CSS للتأكد من وجود حالات `:hover`, `:focus-visible`, `:disabled` لكل مكون تفاعلي.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير تغطية الحالات التفاعلية للمكونات بنسبة 100%.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تزويد كل مكون بكافة الحالات التفاعلية القياسية.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
العناصر الثابتة غير التفاعلية (Static Text Elements).

## 9. المراجع والمعايير الدولية (References)
- WebForge Design System Standard (STD-DESIGN-SYSTEM-001)
