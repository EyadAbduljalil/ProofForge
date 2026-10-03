---
id: "TEST-TRACE-001"
title: "إلزامية تتبع حالات الاختبار وربطها بالمتطلبات والتهديدات الأمنية"
category: "testing"
subcategory: "traceability"
severity: "MEDIUM"
applies_to:
  - "all"
  - "tests"
  - "qa"
tags:
  - "testing"
  - "traceability"
  - "evidence"
  - "verification"
cwe: "N/A"
status: "ACTIVE"
---

# TEST-TRACE-001: إلزامية تتبع حالات الاختبار وربطها بالمتطلبات والتهديدات الأمنية

## 1. المتطلب الإلزامي (Requirement)
يجب أن ترتبط كل حالة اختبار (Test Case) في المستودع بمتطلب وظيفي، قاعدة معيارية (Rule ID)، أو تهديد أمني محدد صراحة في وصف الاختبار أو بياناته الوصفية، مع حظر الاختبارات العشوائية أو الفارغة التي تقتصر على فحص صحة عامة دون تدقيق للحالات الحدية (Edge Cases).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
غياب التتبع يمنع قياس التغطية الحقيقية للمتطلبات الأمنية ويؤدي لاختبارات سطحية لا تكشف الثغرات والعيوب الحقيقية للنظام.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// اختبار مبهم بلا هدف أو ربط بالمتطلبات
test('works properly', () => {
  expect(true).toBe(true);
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
describe('SEC-AUTHZ-001: التحقق من ملكية المورد ومنع ثغرات IDOR', () => {
  test('يجب حظر المستخدم من تعديل مستند لا يملكه برمز 403 Forbidden', async () => {
    const res = await request(app)
      .put('/api/documents/doc-other-user')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Modified' });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص ملفات الاختبارات والتأكد من تضمين معرفات القواعد والمتطلبات في أسماء كتل `describe` و `test`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير مصفوفة تتبع المتطلبات (Traceability Matrix Report).

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. إعادة تسمية وهيكلة ملفات الاختبارات لتعكس المعرفات المعيارية.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات.

## 9. المراجع والمعايير الدولية (References)
- ISO/IEC/IEEE 29119 Software Testing Standards
