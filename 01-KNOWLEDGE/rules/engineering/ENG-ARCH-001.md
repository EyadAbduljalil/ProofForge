---
id: "ENG-ARCH-001"
title: "فصل الاهتمامات والالتزام بالحدود المعمارية بين الطبقات"
category: "engineering"
subcategory: "architecture"
severity: "MEDIUM"
applies_to:
  - "all"
  - "backend"
  - "frontend"
tags:
  - "engineering"
  - "architecture"
  - "clean-code"
  - "modularity"
cwe: "N/A"
status: "ACTIVE"
---

# ENG-ARCH-001: فصل الاهتمامات والالتزام بالحدود المعمارية بين الطبقات

## 1. المتطلب الإلزامي (Requirement)
يجب فصل طبقة التوجيه والواجهات (Controllers / Presentation) عن طبقة منطق العمليات (Business Logic / Services) وعن طبقة الوصول للبيانات (Data Access / Repositories). يُحظر كتابة استعلامات قواعد البيانات المباشرة داخل متحكمات التوجيه أو مكونات واجهة المستخدم.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
خلط الطبقات يجعل الشيفرة المصدرية صعبة الصيانة والاختبار، ويزيد احتمالية تكرار الثغرات الأمنية في نقاط النهاية المتعددة نتيجة غياب المنطق الموحد.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// خلط غير سليم: تنفيذ استعلام مباشر في المتحكم
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
// طبقة التوجيه تستدعي خدمة مستقلة ومختبرة
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await userService.getActiveUsers();
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص الاعتماديات والتأكد من عدم استيراد طبقة البيانات مباشرة في مسارات التوجيه.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير البنية المعمارية يثبت الالتزام بنمط الطبقات وفصل المسؤوليات.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخراج منطق العمليات إلى ملفات Services منفصلة.
2. استخراج استعلامات البيانات إلى Repositories قابلة للمحاكاة (Mockable).

## 8. الاستثناءات المسموحة (Allowed Exceptions)
السكربتات المصغرة أحادية الغرض (Single-purpose Utility Scripts).

## 9. المراجع والمعايير الدولية (References)
- Clean Architecture (Robert C. Martin)
