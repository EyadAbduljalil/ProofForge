---
id: "SEC-API-002"
title: "الحماية الإلزامية من هجمات تزوير الطلبات عبر المواقع"
category: "security"
subcategory: "api-security"
severity: "HIGH"
applies_to:
  - "all"
  - "backend"
  - "web"
tags:
  - "security"
  - "csrf"
  - "tokens"
cwe: "CWE-352"
status: "ACTIVE"
---

# SEC-API-002: الحماية الإلزامية من هجمات تزوير الطلبات عبر المواقع

## 1. المتطلب الإلزامي (Requirement)
يجب حماية كافة الطلبات المعدلة للحالة (POST, PUT, DELETE, PATCH) المعتمدة على ملفات تعريف الارتباط للمصادقة عبر استخدام رموز مكافحة CSRF (Anti-CSRF Tokens) بنمط Double Submit Cookie أو التحقق من ترويسات `Origin` و `Sec-Fetch-Site`.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تتيح ثغرة CSRF للمهاجم خداع متصفح المستخدم المصادق لإرسال طلبات غير مصرح بها نيابة عنه (مثل تغيير البريد الإلكتروني أو تحويل الأموال) بمجرد زيارته لموقع خبيث.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// نقطة تغيير كلمة المرور تعتمد على الكوكي دون أي حماية من CSRF
app.post('/api/user/change-password', cookieAuth, async (req, res) => {
  // تنفيذ التغيير
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { verifyCsrfToken } from '../security/csrf.js';

app.post('/api/user/change-password', cookieAuth, verifyCsrfToken, async (req, res) => {
  // تنفيذ التغيير بأمان بعد مطابقة التوكن
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص تطبيق وسيط الحماية من CSRF عبر `packages/security/csrf.js`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار يثبت رفض الطلبات المفتقرة لرمز CSRF برمز 403.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تفعيل ترويسات `SameSite=Lax/Strict` لملفات الكوكيز.
2. فرض رمز CSRF مخصص في ترويسات الطلبات (`X-CSRF-Token`).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
واجهات برمجة التطبيقات الخالية من الحالة (Stateless APIs) المعتمدة حصراً على ترويسة `Authorization: Bearer <token>`.

## 9. المراجع والمعايير الدولية (References)
- OWASP Cross-Site Request Forgery Prevention
- CWE-352: Cross-Site Request Forgery (CSRF)
