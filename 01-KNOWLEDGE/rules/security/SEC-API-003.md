---
id: "SEC-API-003"
title: "منع تزوير الطلبات من جانب الخادم والتحقق من الروابط الخارجية"
category: "security"
subcategory: "api-security"
severity: "HIGH"
applies_to:
  - "all"
  - "backend"
tags:
  - "security"
  - "ssrf"
  - "network"
  - "webhooks"
cwe: "CWE-918"
status: "ACTIVE"
---

# SEC-API-003: منع تزوير الطلبات من جانب الخادم والتحقق من الروابط الخارجية

## 1. المتطلب الإلزامي (Requirement)
يجب تقييد وفحص كافة الروابط الشبكية وعناوين URL الممررة من المستخدمين قبل قيام الخادم بإرسال طلبات خارجية إليها (مثل معالجة Webhooks أو جلب الصور)، مع حظر استدعاء العناوين المحلية والخاصة (RFC 1918, 127.0.0.1, localhost, 169.254.169.254) وحظر نطاقات شبكات السحابة الداخلية.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
ثغرات تزوير الطلبات من جانب الخادم (SSRF) تتيح للمهاجم استخدام الخادم كبوابة خلفية للوصول إلى الخدمات والشبكات الداخلية الحساسة وخدمات البيانات الوصفية للسحابة (AWS Metadata / GCP Metadata) وسرقة مفاتيح الوصول لبيئة الاستضافة.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ثغرة SSRF خطيرة
app.post('/api/fetch-avatar', async (req, res) => {
  const image = await fetch(req.body.imageUrl);
  // إرجاع الصورة
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { validateSafeUrl } from '../security/ssrf-guard.js';

app.post('/api/fetch-avatar', async (req, res) => {
  const isSafe = await validateSafeUrl(req.body.imageUrl);
  if (!isSafe) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_URL', message: 'الرابط المطلوب غير مسموح به' } });
  }

  const image = await fetch(req.body.imageUrl);
  // معالجة آمنة
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاءات `validateSafeUrl` في `packages/security/ssrf-guard.js` قبل أي عملية `fetch` أو `axios` ديناميكية.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار يثبت حظر محاولات الاتصال بـ `127.0.0.1` و `169.254.169.254`.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام القائمة البيضاء للنطاقات المصرح بها حصراً.
2. حل عنوان الـ DNS والتحقق من أن الـ IP الناتج ليس ضمن نطاقات الشبكات الخاصة قبل تنفيذ الطلب.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الخدمات المصممة داخلياً للاتصال بقواعد بيانات داخلية محددة مسبقاً في ملفات التكوين.

## 9. المراجع والمعايير الدولية (References)
- OWASP Server-Side Request Forgery Prevention
- CWE-918: Server-Side Request Forgery (SSRF)
