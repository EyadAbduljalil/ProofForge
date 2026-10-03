---
id: "ENG-ERR-001"
title: "المعالجة الهيكلية الموحدة للأخطاء وإخفاء التفاصيل الحساسة"
category: "engineering"
subcategory: "error-handling"
severity: "MEDIUM"
applies_to:
  - "all"
  - "backend"
  - "frontend"
tags:
  - "engineering"
  - "error-handling"
  - "logging"
  - "information-disclosure"
cwe: "CWE-209"
status: "ACTIVE"
---

# ENG-ERR-001: المعالجة الهيكلية الموحدة للأخطاء وإخفاء التفاصيل الحساسة

## 1. المتطلب الإلزامي (Requirement)
يجب التقاط ومعالجة كافة الأخطاء البرمجية والاستثناءات عبر وسيط مركزي موحد للأخطاء (Centralized Error Handler)، مع إرجاع رسائل خطأ دلالية مهذبة للعميل وإخفاء مكدس الاستدعاءات (Stack Trace)، وأكواد قواعد البيانات، ومسارات الملفات الداخلية، مع تسجيل تفاصيل الخطأ كاملة في سجلات الخادم المشفرة.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تسريب مكدس الأخطاء وتفاصيل الاستعلامات للمستخدم النهائي يساعد المهاجمين في رسم خريطة النظام والتعرف على إصدارات المكتبات والمحركات الداخلية لاستغلال الثغرات المعروفة.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// غير آمن: إرجاع تفاصيل الخطأ مباشرة للعميل
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack, query: err.sql });
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { logger } from '../logger.js';

app.use((err, req, res, next) => {
  const errorId = crypto.randomUUID();
  logger.error({ errorId, message: err.message, stack: err.stack, url: req.url });

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.isOperational ? err.message : 'حدث خطأ غير متوقع، يرجى مراجعة الدعم الفني.',
      errorId
    }
  });
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص وسيط معالجة الأخطاء والتأكد من خلو ردود بيئة الإنتاج من خاصية `stack`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار ردود الأخطاء يثبت إرجاع بنية موحدة مع معرّف تتبع `errorId`.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إنشاء أصناف أخطاء تشغيلية (Operational AppError Classes).
2. ربط وسيط معالجة أخطاء مركزي في نهاية مصفوفة التوجيه.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
بيئة التطوير المحلية الموجهة للمطور حصراً (`process.env.NODE_ENV === 'development'`).

## 9. المراجع والمعايير الدولية (References)
- OWASP Error Handling Cheat Sheet
- CWE-209: Generation of Error Message Containing Sensitive Information
