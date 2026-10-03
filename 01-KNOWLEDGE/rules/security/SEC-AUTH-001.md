---
id: "SEC-AUTH-001"
title: "إلزامية تشفير كلمات المرور باستخدام خوارزميات بطيئة ومقاومة للهجمات"
category: "security"
subcategory: "authentication"
severity: "CRITICAL"
applies_to:
  - "all"
  - "nodejs"
  - "python"
  - "go"
tags:
  - "security"
  - "auth"
  - "passwords"
  - "cryptography"
cwe: "CWE-916"
status: "ACTIVE"
---

# SEC-AUTH-001: إلزامية تشفير كلمات المرور باستخدام خوارزميات بطيئة ومقاومة للهجمات

## 1. المتطلب الإلزامي (Requirement)
يجب تجزئة وتشفير كافة كلمات المرور السرية للمستخدمين قبل تخزينها أو مقارنتها باستخدام خوارزمية تجزئة بطيئة معتمدة أمنياً (مثل Argon2id أو scrypt أو bcrypt بعامل تكرار لا يقل عن 12) مع توليد Salt عشوائي فريد لكل كلمة مرور. يُحظر حظراً مطلقاً استخدام MD5 أو SHA-1 أو SHA-256 البسيطة أو تخزين كلمات المرور بنص صريح.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
خوارزميات التجزئة السريعة (مثل SHA-256 و MD5) مصممة للسرعة ويمكن للمهاجمين كسرها بسرعة فائقة عبر مصفوفات GPU وجداول Rainbow Tables عند حدوث تسريب لقاعدة البيانات. استخدام Argon2id أو bcrypt يفرض عبئاً حسابياً وذاكرة عالية تحبط هجمات القوة الغاشمة (Brute-Force).

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// غير آمن إطلاقاً: تخزين بنص صريح أو خوارزمية سريعة
const hash = crypto.createHash('sha256').update(password).digest('hex');
await db.users.create({ username, passwordHash: hash });
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص دوال تجزئة كلمات المرور في الشيفرة المصدرية باستخدام `packages/security/password.js`.
- التحقق من عدم وجود أي استدعاء لـ `createHash('md5')` أو `createHash('sha1')` في مسارات المصادقة.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص الكود يُثبت استخدام `bcrypt` (عامل >= 12) أو `argon2id`.
- اجتياز اختبارات الوحدة الخاصة بالمقارنة الآمنة للمرور.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال خوارزميات التجزئة القديمة بمكتبة `bcrypt` أو `argon2`.
2. إجبار المستخدمين على تحديث كلمات المرور عبر خطة ترقية تدريجية (Hash Upgrade on Login).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد أي استثناءات مقبولة لتخزين كلمات المرور الحقيقية.

## 9. المراجع والمعايير الدولية (References)
- OWASP Password Storage Cheat Sheet
- NIST SP 800-63B Digital Identity Guidelines
- CWE-916: Use of Password Hash With Insufficient Computational Effort
