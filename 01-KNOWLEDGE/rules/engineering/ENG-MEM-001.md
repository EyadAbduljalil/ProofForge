---
id: "ENG-MEM-001"
title: "منع تسرب الذاكرة وضمان إغلاق التدفقات والموارد غير المدارة"
category: "engineering"
subcategory: "performance"
severity: "MEDIUM"
applies_to:
  - "all"
  - "nodejs"
  - "backend"
tags:
  - "engineering"
  - "memory-leaks"
  - "streams"
  - "performance"
cwe: "CWE-775"
status: "ACTIVE"
---

# ENG-MEM-001: منع تسرب الذاكرة وضمان إغلاق التدفقات والموارد غير المدارة

## 1. المتطلب الإلزامي (Requirement)
يجب إغلاق وتحرير كافة مقابس الشبكة، اتصالات قواعد البيانات، تدفقات الملفات (File Streams)، والمؤقتات (Timers/Intervals) بعد الانتهاء من استخدامها، مع حظر تراكم كائنات الاستماع للأحداث (Event Listeners) دون إزالتها لتجنب تسرب الذاكرة.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تسرب الذاكرة يقود تدريجياً لزيادة استهلاك موارد الخادم وبطء الاستجابة، مما يؤدي في النهاية لانهيار العملية البرمجية (OOM Crash) وتعطيل الخدمة.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ترك تدفق الملف مفتوحاً دون معالجة الإغلاق عند الخطأ
const stream = fs.createReadStream('large-file.log');
stream.pipe(res);
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { pipeline } from 'stream/promises';

export async function transferFile(sourcePath, res) {
  const sourceStream = fs.createReadStream(sourcePath);
  try {
    await pipeline(sourceStream, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).end();
    }
  }
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- استخدام `pipeline` أو كتل `try...finally` لضمان إغلاق الموارد.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير استقرار الذاكرة تحت الضغط (Load Testing Memory Profile).

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام `stream.pipeline` لمعالجة التدفقات.
2. تنظيف مؤقتات `setInterval` عند تدمير المكونات أو إنهاء العمليات.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
المجمعات المركزية للاتصالات المستمرة (Persistent Connection Pools).

## 9. المراجع والمعايير الدولية (References)
- Node.js Stream Documentation
- CWE-775: Missing Release of Resource after Effective Lifetime
