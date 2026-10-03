---
id: "DB-PARAM-001"
title: "ربط المعاملات الصارم على مستوى مشغلات قواعد البيانات"
category: "database"
subcategory: "query-safety"
severity: "HIGH"
applies_to:
  - "all"
  - "database"
tags:
  - "database"
  - "prepared-statements"
  - "sql"
  - "nosql"
cwe: "CWE-89"
status: "ACTIVE"
---

# DB-PARAM-001: ربط المعاملات الصارم على مستوى مشغلات قواعد البيانات

## 1. المتطلب الإلزامي (Requirement)
يجب استخدام خاصية ربط المعاملات الصارم (Strict Parameter Binding) التي يوفرها مشغل قاعدة البيانات (Database Driver) لجميع أنواع قواعد البيانات (SQL و NoSQL مثل MongoDB)، مع حظر تمرير كائنات غير مفلترة كشروط استعلام (لتجنب ثغرات NoSQL Injection مثل مشغلات `$ne`, `$gt`).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
في قواعد بيانات NoSQL، تمرير كائنات JSON خبيثة مثل `{"password": {"$ne": ""}}` يمكن المهاجم من تسجيل الدخول دون معرفة كلمة المرور في حال غياب التدقيق النمطي للنوع.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ثغرة NoSQL Injection عند تمرير req.body مباشرة
const user = await db.collection('users').findOne({
  username: req.body.username,
  password: req.body.password // قد يمرر المهاجم كائناً { "$gt": "" }
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// فرض النوع النصي الصارم قبل الاستعلام
if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
  throw new Error('INVALID_INPUT_TYPE');
}

const user = await db.collection('users').findOne({
  username: String(req.body.username),
  password: String(req.body.password)
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استعلامات NoSQL والتأكد من التحقق من نوع البيانات عبر Zod أو دوال التدقيق.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار أمني يثبت إحباط محاولات NoSQL Injection.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام Zod لفرض نوع المدخلات كسلاسل نصية بسيطة.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات لمدخلات المستخدمين.

## 9. المراجع والمعايير الدولية (References)
- OWASP NoSQL Injection Prevention Cheat Sheet
- CWE-89: Improper Neutralization of Special Elements used in an SQL Command
