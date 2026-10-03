---
id: "SEO-SEMANTIC-001"
title: "الهيكلية الدلالية للمستندات ووسوم البيانات الوصفية لتحسين محركات البحث"
category: "seo"
subcategory: "semantics"
severity: "LOW"
applies_to:
  - "all"
  - "frontend"
  - "seo"
tags:
  - "seo"
  - "html5"
  - "semantics"
  - "metadata"
cwe: "N/A"
status: "ACTIVE"
---

# SEO-SEMANTIC-001: الهيكلية الدلالية للمستندات ووسوم البيانات الوصفية لتحسين محركات البحث

## 1. المتطلب الإلزامي (Requirement)
يجب أن تحتوي كل صفحة ويب عامة على عنوان فريد وصريح (`<title>`)، ووسم وصف دلالي (`<meta name="description">`)، وعنوان رئيسي وحيد (`<h1>`)، مع استخدام العناصر الدلالية لـ HTML5 (`<main>`, `<header>`, `<nav>`, `<footer>`, `<article>`, `<section>`) بدلاً من الاعتماد الكلي على وسوم `<div>` المجردة.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
العناصر الدلالية تساعد زواحف محركات البحث وقارئات الشاشة في استيعاب البنية الهيكلية للمحتوى وأهميته، وتزيد من دقة الفهرسة وتصنيف الصفحة.

## 3. الأنماط المعيبة (Bad Patterns)
```html
<!-- صفحة مبنية بالكامل على div بلا أي دلالة -->
<div class="header"><div class="logo">Site</div></div>
<div class="main-content">
  <div class="title">Welcome</div>
</div>
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```html
<header>
  <nav aria-label="القائمة الرئيسية">...</nav>
</header>
<main>
  <h1>عنوان الصفحة الرئيسي المعبر</h1>
  <section aria-labelledby="sec-title">
    <h2 id="sec-title">القسم الأول</h2>
    <p>المحتوى الدلالي...</p>
  </section>
</main>
<footer>...</footer>
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص هيكل الـ DOM للتأكد من وجود `<h1>` وحيد واستخدام وسوم HTML5 الدلالية.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص SEO الآلي يثبت اكتمال الوسوم الدلالية والبيانات الوصفية.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال `div` العلوية بـ `<header>`, `<main>`, `<footer>`.
2. حصر الصفحة في `<h1>` واحد معبر.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
واجهات التطبيقات الداخلية المغلقة خلف تسجيل الدخول (Internal Dashboards).

## 9. المراجع والمعايير الدولية (References)
- Google Search Central: SEO Starter Guide
- W3C Semantic HTML5 Standards
