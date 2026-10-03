---
id: "RESP-OVERFLOW-001"
title: "منع التمرير والفيضان الأفقي غير المقصود عبر كافة الشاشات"
category: "responsive"
subcategory: "layout"
severity: "MEDIUM"
applies_to:
  - "all"
  - "frontend"
  - "mobile"
tags:
  - "responsive"
  - "overflow"
  - "layout"
  - "css"
cwe: "N/A"
status: "ACTIVE"
---

# RESP-OVERFLOW-001: منع التمرير والفيضان الأفقي غير المقصود عبر كافة الشاشات

## 1. المتطلب الإلزامي (Requirement)
يجب ألا تتسبب أي صفحة ويب أو واجهة مستخدم في حدوث فيضان أفقي غير مقصود (Horizontal Overflow / Side Scrolling) على أي مقاس شاشة يبدأ من عرض 320px فما فوق. يجب ضبط الصور والوسائط لتكون مرنة (`max-width: 100%`, `height: auto`) واستخدام `box-sizing: border-box` عالمياً.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
الفيضان الأفقي يشوه تجربة المستخدم على الهواتف الذكية ويؤدي إلى اهتزاز الصفحة أثناء التمرير العمودي وانقطاع عناصر المحتوى خارج حدود الشاشة.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* صور غير مقيدة تسبب فيضاناً أفقياً */
img {
  width: 800px;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  max-width: 100%;
  overflow-x: hidden;
}

img, video, canvas, svg {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص عرض مستند الـ DOM عبر المتصفح والتأكد من تطابق `document.documentElement.scrollWidth <= window.innerWidth`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار التجاوب يثبت خلو الشاشات من الفيضان الأفقي بدقة 320px.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تطبيق نمط إعادة الضبط المعياري (CSS Reset) وضبط أبعاد الوسائط.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الجداول والرسوم البيانية الكبيرة التي تتطلب تمريراً أفقياً داخلياً مقيداً صراحة (`overflow-x: auto` داخل حاوية مخصصة).

## 9. المراجع والمعايير الدولية (References)
- Google Web Fundamentals: Responsive Web Design Basics
