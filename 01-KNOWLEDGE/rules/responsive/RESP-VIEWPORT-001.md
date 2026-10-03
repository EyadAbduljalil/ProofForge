---
id: "RESP-VIEWPORT-001"
title: "إلزامية وسم إطار العرض والتخطيطات المرنة المتجاوبة"
category: "responsive"
subcategory: "viewport"
severity: "HIGH"
applies_to:
  - "all"
  - "frontend"
  - "mobile"
tags:
  - "responsive"
  - "viewport"
  - "mobile"
  - "css"
cwe: "N/A"
status: "ACTIVE"
---

# RESP-VIEWPORT-001: إلزامية وسم إطار العرض والتخطيطات المرنة المتجاوبة

## 1. المتطلب الإلزامي (Requirement)
يجب أن يحتوي رأس كل مستند HTML (`<head>`) على وسم إطار العرض المعياري:
`<meta name="viewport" content="width=device-width, initial-scale=1.0">`. كما يجب بناء التخطيطات باستخدام وحدات قياس نسبية ومرنة (`rem`, `%`, `fr`, Flexbox, CSS Grid) وتجنب استخدام العروض الثابتة بالبكسل للحاويات الرئيسية (Containers).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
غياب وسم إطار العرض يجعل المتصفحات على الهواتف الذكية تعرض الصفحة وكأنها شاشة حاسوب مكتبي بدقة مصغرة يصعب التفاعل معها، واستخدام العروض الثابتة يكسر التجاوب عبر الشاشات المختلفة.

## 3. الأنماط المعيبة (Bad Patterns)
```html
<!-- حاوية بعرض ثابت يكسر شاشات الهواتف -->
<div style="width: 1200px;">...</div>
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص وجود وسم `meta[name="viewport"]` في `index.html`.
- فحص قواعد CSS للتحقق من عدم وجود `width: > 600px` ثابتة على الحاويات دون `max-width`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص التجاوب عبر نقاط التوقف (320px, 768px, 1024px, 1440px).

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إضافة وسم الـ viewport لمستند الـ HTML.
2. استبدال `width` بـ `max-width` و `width: 100%`.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات لصفحات الويب الحديثة.

## 9. المراجع والمعايير الدولية (References)
- MDN: Using the viewport meta tag
