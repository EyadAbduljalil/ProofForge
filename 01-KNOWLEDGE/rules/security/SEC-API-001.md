---
id: "SEC-API-001"
title: "كبح معدل الطلبات وحماية نقاط النهاية من هجمات القوة الغاشمة"
category: "security"
subcategory: "api-security"
severity: "HIGH"
applies_to:
  - "all"
  - "api"
  - "backend"
tags:
  - "security"
  - "rate-limit"
  - "ddos"
  - "brute-force"
cwe: "CWE-799"
status: "ACTIVE"
---

# SEC-API-001: كبح معدل الطلبات وحماية نقاط النهاية من هجمات القوة الغاشمة

## 1. المتطلب الإلزامي (Requirement)
يجب تطبيق قيود كبح معدل الطلبات (Rate Limiting) على كافة واجهات برمجة التطبيقات ونقاط الدخول، مع تشديد القيود بنسبة مضاعفة على نقاط النهاية الحساسة (مثل تسجيل الدخول، إعادة تعيين كلمة المرور، وعمليات الدفع) لمنع هجمات حجب الخدمة والتخمين الآلي.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
غياب كبح الطلبات يتيح للمهاجمين تجربة ملايين التوافيق لكلمات المرور أو إغراق الخادم بطلبات وهمية تؤدي لانهيار الأداء أو استنزاف الموارد المالية.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// نقطة تسجيل دخول بلا أي كبح لمعدل الطلبات
app.post('/api/auth/login', async (req, res) => {
  // معالجة الدخول مباشرة
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { createRateLimiter } from '../security/rate-limit.js';

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات فقط
  message: 'تم تجاوز الحد الأقصى لمحاولات الدخول، يرجى المحاولة لاحقاً'
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // معالجة الدخول الآمنة
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاءات `createRateLimiter` في `packages/security/rate-limit.js` وتطبيقها على مسارات المصادقة.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار يثبت إرجاع كود `429 Too Many Requests` عند تجاوز الحد المحدد.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تطبيق كبح الطلبات العام (Global Rate Limiter) على مستوى مسار `/api/`.
2. تطبيق كبح مخصص وصارم على مسارات الحسابات والأسرار.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
نقاط فحص الصحة التشغيلية الداخلية (Internal Healthchecks / Ping).

## 9. المراجع والمعايير الدولية (References)
- OWASP Automated Threat Handbook: Credential Stuffing & Brute Force
- CWE-799: Improper Control of Interaction Frequency
