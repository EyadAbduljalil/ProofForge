---
id: "I18N-EXPAND-001"
title: "مرونة التخطيط واستيعاب تمدد النصوص عبر اللغات المختلفة"
category: "localization"
subcategory: "i18n"
severity: "LOW"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "i18n"
  - "localization"
  - "layout"
  - "text-expansion"
cwe: "N/A"
status: "ACTIVE"
---

# I18N-EXPAND-001: مرونة التخطيط واستيعاب تمدد النصوص عبر اللغات المختلفة

## 1. المتطلب الإلزامي (Requirement)
يجب تصميم حاويات النصوص والأزرار وبطاقات الواجهة لتستوعب تمدد النصوص (Text Expansion) بنسبة لا تقل عن 30% إلى 40% دون انقطاع النص أو تشوه الأزرار عند ترجمة المحتوى بين اللغات المختلفة (مثل الإنجليزية، الألمانية، والعربية). يُحظر استخدام ارتفاعات أو عروض ثابتة بالبكسل لحاويات النصوص.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
الترجمة إلى لغات معينة تزيد من طول الكلمات والجمل بشكل ملحوظ؛ عدم مرونة التخطيط يسبب قص النصوص (Text Truncation) أو تداخل العناصر فوق بعضها.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* زر بعرض وارتفاع ثابت يسبب انقطاع النصوص المترجمة */
.button {
  width: 100px;
  height: 35px;
  overflow: hidden;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
.button {
  min-width: 100px;
  min-height: 40px;
  padding: 0.5rem 1.25rem;
  white-space: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص قواعد CSS لحاويات النصوص والتأكد من استخدام `min-width` و `min-height` بدلاً من الأبعاد الثابتة.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص المظهر البصري للنصوص المترجمة.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إزالة الأبعاد الثابتة واستخدام الحشو الداخلي النسبي (`padding`).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الأيقونات المحددة برسم متجه ثابت (Fixed Vector Icons).

## 9. المراجع والمعايير الدولية (References)
- W3C Internationalization Best Practices: Handling text expansion
