---
id: "SEC-INJ-001"
title: "إلزامية استخدام الاستعلامات المجهزة والمعلمة لمنع حقن SQL"
category: "security"
subcategory: "injection"
severity: "CRITICAL"
applies_to:
  - "all"
  - "sql"
  - "database"
tags:
  - "security"
  - "injection"
  - "sql"
  - "database"
cwe: "CWE-89"
status: "ACTIVE"
---

# SEC-INJ-001: إلزامية استخدام الاستعلامات المجهزة والمعلمة لمنع حقن SQL

## 1. المتطلب الإلزامي (Requirement)
يجب استخدام الاستعلامات المجهزة (Parameterized Queries / Prepared Statements) أو واجهات ORM الآمنة في كافة عمليات قواعد البيانات. يُحظر تماماً دمج النصوص أو استخدام قوالب النصوص (Template Literals) لإنشاء استعلامات SQL تتضمن مدخلات المستخدمين.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
دمج نصوص استعلامات SQL مع مدخلات غير مفلترة يسمح للمهاجمين بحقن أوامر SQL خبيثة والتلاعب بمنطق الاستعلام لقراءة قاعدة البيانات بأكملها أو تعديلها أو إسقاط الجداول بالكامل.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ثغرة حقن SQL خطيرة
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
const result = await db.query(query);
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// استعلام معلم وآمن حتمياً
const query = 'SELECT id, email, full_name FROM users WHERE email = $1';
const result = await db.query(query, [req.body.email]);
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- الفحص الثابت للكود لمنع أنماط دمج النصوص في دوال `db.query` أو `sequelize.query`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير تدقيق أمني يثبت خلو المستودع من دمج النصوص في استعلامات SQL.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تحويل كافة الاستعلامات إلى الصيغة المعلمة (`$1`, `?`, `:param`).
2. استخدام ORM معتمد مع تفعيل خاصية الهروب التلقائي للرموز.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات لمدخلات المستخدمين.

## 9. المراجع والمعايير الدولية (References)
- OWASP SQL Injection Prevention Cheat Sheet
- CWE-89: Improper Neutralization of Special Elements used in an SQL Command
