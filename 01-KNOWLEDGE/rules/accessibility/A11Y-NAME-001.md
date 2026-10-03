---
id: "A11Y-NAME-001"
title: "إلزامية التسمية الدلالية الصريحة وربط الملصقات بكافة العناصر التفاعلية"
category: "accessibility"
subcategory: "screen-readers"
severity: "HIGH"
applies_to:
  - "all"
  - "frontend"
  - "a11y"
tags:
  - "accessibility"
  - "a11y"
  - "aria"
  - "forms"
  - "wcag"
cwe: "N/A"
status: "ACTIVE"
---

# A11Y-NAME-001: إلزامية التسمية الدلالية الصريحة وربط الملصقات بكافة العناصر التفاعلية

## 1. المتطلب الإلزامي (Requirement)
يجب أن يمتلك كل عنصر إدخال وحقل نموذج ملصقاً نصياً دلالياً مرتبطاً به صراحة عبر سمة `for`/`id` أو عبر الاحتواء المباشر (`<label><input ... /></label>`). كما يجب تزويد الأزرار الأيقونية الخالية من النصوص الصريحة بتسمية دلالية عبر `aria-label` أو `aria-labelledby`، وتزويد الصور بالنص البديل `alt`.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
العناصر التفاعلية الخالية من الأسماء الدلالية تمنع مستخدمي قارئات الشاشة والتقنيات المساعدة من فهم الغرض من الزر أو الحقل، مما يعطل قدرتهم على استخدام التطبيق.

## 3. الأنماط المعيبة (Bad Patterns)
```html
<!-- زر أيقونة بلا تسمية وحقل إدخال بلا ملصق -->
<button onclick="close()"><svg>...</svg></button>
<input type="text" placeholder="ابحث هنا..." />
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```html
<button onclick="close()" aria-label="إغلاق النافذة">
  <svg aria-hidden="true">...</svg>
</button>

<label for="search-input">البحث في الموقع</label>
<input id="search-input" type="search" placeholder="ابحث هنا..." />
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص شجرة الـ DOM والتأكد من نجاح معايير إمكانية الوصول عبر أدوات التحقق الآلي مثل `axe-core`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص إمكانية الوصول يثبت خلو المستند من عناصر `button-name` أو `label` مفقودة.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. ربط كل حقل إدخال بعنصر `<label>`.
2. إضافة `aria-label` للأزرار الأيقونية.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الصور التزيينية البحتة التي تحمل صراحة `alt=""` أو `aria-hidden="true"`.

## 9. المراجع والمعايير الدولية (References)
- W3C WAI-ARIA 1.2 Specification
- WCAG 2.2 Success Criterion 4.1.2 (Name, Role, Value)
