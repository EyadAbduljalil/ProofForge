---
id: "ENG-CONC-001"
title: "منع ظروف التسابق وتأمين المعالجة المتزامنة للبيانات"
category: "engineering"
subcategory: "concurrency"
severity: "HIGH"
applies_to:
  - "all"
  - "backend"
  - "database"
tags:
  - "engineering"
  - "concurrency"
  - "race-condition"
  - "locking"
cwe: "CWE-362"
status: "ACTIVE"
---

# ENG-CONC-001: منع ظروف التسابق وتأمين المعالجة المتزامنة للبيانات

## 1. المتطلب الإلزامي (Requirement)
يجب حماية العمليات التحديثية الحساسة المتزامنة (مثل الأرصدة المالية، المخزون، أو عدادات الحصص) باستخدام القفل المتفائل (Optimistic Locking) مع التحقق من الإصدار أو القفل الإقصائي (Pessimistic Locking / Transactions) على مستوى قاعدة البيانات، لمنع تضارب الكتابة وظروف التسابق (Race Conditions).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تنفيذ عمليات السحب أو التعديل دون قفل آمن يتيح للمستخدمين استغلال طلبات متزامنة في نفس الجزء من الثانية لسحب مبالغ تتجاوز رصيدهم أو حجز موارد غير متاحة (Double Spending).

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// غير آمن: قراءة ثم تحديث منفصل يسبب Race Condition
const user = await db.users.findById(userId);
if (user.balance >= amount) {
  await db.users.update(userId, { balance: user.balance - amount });
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// آمن: تحديث ذري داخل عملية موحدة أو عبر قفل ذري
await db.transaction(async (trx) => {
  const result = await trx('users')
    .where('id', userId)
    .where('balance', '>=', amount)
    .decrement('balance', amount);

  if (result === 0) {
    throw new Error('INSUFFICIENT_FUNDS');
  }
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص العمليات التحديثية للبيانات المالية والتأكد من إجرائها ضمن معاملات ذرية (Atomic Transactions).

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار تزامني (Concurrent Test) يثبت عدم حدوث عجز مالي تحت ضغط 50 طلباً متزامناً.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام العمليات الذرية (`UPDATE ... WHERE balance >= amount`).
2. إضافة حقل `version` لدعم القفل المتفائل.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
السجلات والعدادات الإحصائية غير الحرجة التي تحتمل التقدير التقريبي.

## 9. المراجع والمعايير الدولية (References)
- Martin Fowler: Optimistic Offline Lock
- CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization
