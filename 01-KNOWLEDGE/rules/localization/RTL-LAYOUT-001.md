---
id: "RTL-LAYOUT-001"
title: "الدعم الإلزامي للتخطيط ثنائي الاتجاه واستخدام الخصائص المنطقية للـ CSS"
category: "localization"
subcategory: "rtl-ltr"
severity: "MEDIUM"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "localization"
  - "rtl"
  - "ltr"
  - "css-logical-properties"
cwe: "N/A"
status: "ACTIVE"
---

# RTL-LAYOUT-001: الدعم الإلزامي للتخطيط ثنائي الاتجاه واستخدام الخصائص المنطقية للـ CSS

## 1. المتطلب الإلزامي (Requirement)
يجب استخدام الخصائص المنطقية لـ CSS (CSS Logical Properties) مثل `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start` بدلاً من الخصائص الاتجاهية الثابتة (`margin-left`, `padding-right`, `left`, `right`) لضمان تكيف الواجهة تلقائياً وبشكل كامل مع اللغات التي تُكتب من اليمين إلى اليسار (RTL مثل العربية) ومن اليسار إلى اليمين (LTR) دون الحاجة لكتابة قواعد مكررة.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
استخدام الاتجاهات الثابتة يجبر المطورين على كتابة ملفات CSS منفصلة لكل اتجاه ويزيد حجم الملفات واحتمالية حدوث أخطاء بصرية في محاذاة الأيقونات والمسافات.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* خصائص اتجاهية ثابتة تكسر التخطيط في وضع RTL */
.sidebar {
  float: left;
  margin-left: 20px;
  padding-right: 15px;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
/* خصائص منطقية تتكيف ذاتياً مع dir="rtl" و dir="ltr" */
.sidebar {
  margin-inline-start: 20px;
  padding-inline-end: 15px;
  text-align: start;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص ملفات CSS والتأكد من استخدام الخصائص المنطقية `*-inline-*` وتجنب `*-left`/`*-right` المباشرة إلا للضرورة المعمارية.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار المظهر البصري لصفحات الواجهة في وضعي `dir="rtl"` و `dir="ltr"`.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال `margin-left` بـ `margin-inline-start`.
2. استبدال `padding-right` بـ `padding-inline-end`.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
عناصر محددة الاتجاه عالمياً (مثل أشرطة تشغيل الوسائط الصوتية والمرئية).

## 9. المراجع والمعايير الدولية (References)
- W3C CSS Logical Properties and Values
