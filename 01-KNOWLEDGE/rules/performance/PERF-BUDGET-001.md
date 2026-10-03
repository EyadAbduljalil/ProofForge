---
id: "PERF-BUDGET-001"
title: "الالتزام بميزانية أحجام الحزم البرمجية وضغط الموارد"
category: "performance"
subcategory: "bundle-size"
severity: "MEDIUM"
applies_to:
  - "all"
  - "frontend"
  - "build"
tags:
  - "performance"
  - "bundle"
  - "optimization"
  - "web-vitals"
cwe: "N/A"
status: "ACTIVE"
---

# PERF-BUDGET-001: الالتزام بميزانية أحجام الحزم البرمجية وضغط الموارد

## 1. المتطلب الإلزامي (Requirement)
يجب ألا تتجاوز حزمة JavaScript الأولية المحملة عند الإقلاع (Initial JS Bundle) حاجز 150KB (مضغوطة بصيغة gzip/brotli)، مع تفعيل تقسيم الشيفرة البرمجية والتحميل الكسول (Code Splitting & Dynamic Imports) للمسارات والمكونات الثانوية لتحقيق مؤشر LCP أقل من 2.5 ثانية.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تضخم أحجام الحزم البرمجية يبطئ تحميل الصفحات ويزيد استهلاك باقات البيانات للمستخدمين ويؤدي لتدهور ترتيب الموقع في محركات البحث ومؤشرات أداء Core Web Vitals.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// استيراد مكتبات ضخمة بالكامل لمجرد استخدام دالة وحيدة
import _ from 'lodash';
import * as LucideIcons from 'lucide-react';
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// استيراد مخصص لتحسين Tree-shaking
import debounce from 'lodash/debounce.js';
import { SearchIcon } from 'lucide-react';

// تحميل كسول للمسارات الثقيلة
const AdminDashboard = React.lazy(() => import('./AdminDashboard.jsx'));
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص مخرجات البناء (Build Size Analyzer) والتأكد من عدم تجاوز الحد المعياري للملفات الأولية.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير مخرجات أمر البناء يوضح أحجام الحزم المضغوطة واجتياز الميزانية.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تفعيل Tree-shaking.
2. استخدام صيغ الصور الحديثة (WebP, AVIF).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
تطبيقات الويب التقنية المعقدة (مثل محررات الرسوم ثلاثية الأبعاد 3D WebGL Editors).

## 9. المراجع والمعايير الدولية (References)
- Web.dev: Core Web Vitals & Performance Budgets
