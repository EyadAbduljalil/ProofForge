---
id: "API-ENVELOPE-001"
title: "إلزامية التغليف الهيكلي الموحد لكافة استجابات واجهات برمجة التطبيقات"
category: "api"
subcategory: "design"
severity: "MEDIUM"
applies_to:
  - "all"
  - "api"
  - "backend"
tags:
  - "api"
  - "envelope"
  - "rest"
  - "contract"
cwe: "N/A"
status: "ACTIVE"
---

# API-ENVELOPE-001: إلزامية التغليف الهيكلي الموحد لكافة استجابات واجهات برمجة التطبيقات

## 1. المتطلب الإلزامي (Requirement)
يجب أن تلتزم كافة استجابات واجهات برمجة التطبيقات بالهيكل المعياري المحدد في `STD-API-CONTRACT-001`، باحتوائها دائماً على حقل `success: boolean`، مع حقل `data` في حالات النجاح وحقل `error` المنظم في حالات الفشل، بالإضافة لحقل البيانات الوصفية `meta` الذي يحتوي على الطابع الزمني ومعرف الطلب `requestId`.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
توحيد هيكل الاستجابة يمنع تشتت منطق المعالجة في التطبيقات العميلة ويسهل تصيد الأخطاء وتحليلها وتتبع الطلبات عبر مسارات النظام المختلفة.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// استجابة غير مغلفة وعشوائية البنية
res.json("Done");
res.status(400).send("Bad parameters");
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// استجابة نجاح نموذجية
res.status(200).json({
  success: true,
  data: resultData,
  meta: { timestamp: new Date().toISOString(), requestId: req.id }
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- التحقق عبر فحص العقود (Contract Testing) من مطابقة استجابات الـ API لمخطط JSON Schema الموحد.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبارات التكامل يثبت التزام كافة المسارات بنمط التغليف الموحد بنسبة 100%.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام دالة مساعدة معيارية للتغليف (`sendSuccess`, `sendError`).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
تنزيل الملفات الثنائية (Binary Files / PDF / Images) والتدفقات الحية (SSE Streams).

## 9. المراجع والمعايير الدولية (References)
- WebForge API Contract Standard (STD-API-CONTRACT-001)
- JSON:API Specification
