---
id: "SEC-AUTH-002"
title: "إدارة رموز الجلسات والتوكنات والتحقق من صلاحيتها وقوة المفتاح السري"
category: "security"
subcategory: "authentication"
severity: "CRITICAL"
applies_to:
  - "all"
  - "nodejs"
  - "python"
tags:
  - "security"
  - "jwt"
  - "tokens"
  - "session"
cwe: "CWE-347"
status: "ACTIVE"
---

# SEC-AUTH-002: إدارة رموز الجلسات والتوكنات والتحقق من صلاحيتها وقوة المفتاح السري

## 1. المتطلب الإلزامي (Requirement)
يجب توقيع كافة رموز JWT باستخدام خوارزميات تشفير قوية (HMAC-SHA256 كحد أدنى مع مفتاح سري عشوائي لا يقل عن 256-bit / 32 حرفاً أو RSA-256). كما يجب إلزامية تحديد وقت انتهاء صلاحية التوكن (`exp`) بفترة قصيرة (لا تتجاوز 15-60 دقيقة لتوكن الوصول)، مع التحقق الصارم من الخوارزمية لمنع هجمات "alg: none".

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
المفاتيح السرية الضعيفة قابلة للكسر عبر التخمين دون اتصال بالإنترنت (Offline Cracking)، مما يتيح للمهاجم تزوير التوكنات وتوليد صلاحيات إدارية وانتحال أي حساب مستخدم.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// مفتاح سري ضعيف وتوكن بلا تاريخ انتهاء
const token = jwt.sign({ userId: user.id }, "secret123");
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '15m' }
  );
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص دوال توليد والتحقق من JWT عبر `packages/security/token-manager.js`.
- فحص طول وتعقيد متغير البيئة `JWT_SECRET`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص الكود يُثبت رفض التوكنات المنتهية أو ذات التوقيع الباطل.
- نتائج اختبارات الوحدة للـ Token Manager بنجاح 100%.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. توليد مفتاح تشفير عشوائي آمن (بواسطة `crypto.randomBytes(32).toString('hex')`).
2. تحديد مدة صلاحية صريحة لجميع التوكنات وتفعيل نظام Refresh Tokens الآمن.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات لرموز الوصول الإنتاجية.

## 9. المراجع والمعايير الدولية (References)
- RFC 7519 JSON Web Token (JWT)
- OWASP JSON Web Token Cheat Sheet
- CWE-347: Improper Verification of Cryptographic Signature
