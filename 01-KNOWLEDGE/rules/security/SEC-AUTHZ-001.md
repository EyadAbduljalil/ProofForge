---
id: "SEC-AUTHZ-001"
title: "التحقق الإلزامي من ملكية المورد وصلاحيات الوصول على مستوى الخادم"
category: "security"
subcategory: "authorization"
severity: "CRITICAL"
applies_to:
  - "all"
  - "nodejs"
  - "python"
tags:
  - "security"
  - "authz"
  - "idor"
  - "access-control"
cwe: "CWE-639"
status: "ACTIVE"
---

# SEC-AUTHZ-001: التحقق الإلزامي من ملكية المورد وصلاحيات الوصول على مستوى الخادم

## 1. المتطلب الإلزامي (Requirement)
يجب على كافة نقاط النهاية وواجهات الاستعلام والعمليات البرمجية التي تتعامل مع موارد تابعة للمستخدمين التحقق الصارم من أن المستخدم المصادق يملك المورد المطلوب أو يملك صلاحية صريحة للوصول إليه (Resource Ownership Verification) قبل جلب البيانات أو تعديلها أو حذفها.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
غياب التحقق من ملكية المورد يؤدي إلى ثغرات المراجع المباشرة غير الآمنة للكائنات (IDOR - Insecure Direct Object References)، مما يمكن أي مستخدم مصادق من قراءة وتعديل بيانات مستخدمين آخرين بمجرد تغيير معرّف الكائن في الرابط.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ثغرة IDOR واضحة
app.get('/api/orders/:orderId', authenticate, async (req, res) => {
  const order = await db.orders.findById(req.params.orderId);
  res.json(order);
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import { checkOwnership } from '../security/ownership-guard.js';

app.get('/api/orders/:orderId', authenticate, async (req, res) => {
  const isOwner = await checkOwnership(req.user.id, req.params.orderId, 'orders');
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'غير مصرح بالوصول لهذا الطلب' } });
  }

  const order = await db.orders.findById(req.params.orderId);
  return res.json({ success: true, data: order });
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاء حارس الملكية عبر `packages/security/ownership-guard.js`.
- التحقق عبر اختبارات الهجوم العدائي بمحاولة وصول مستخدم أ إلى مورد مستخدم ب والتأكد من استرجاع كود 403/404.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار أمني يثبت فشل محاولات IDOR برمز استجابة 403 Forbidden.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تطبيق وسيط فحص الملكية (Ownership Guard Middleware) على كافة المسارات الحساسة.
2. تقييد استعلامات قواعد البيانات بمعرّف المستخدم المالك تلقائياً.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الموارد العامة المنشورة للجميع صراحة (Public Resources) مثل المقالات العامة والكتالوجات المفتوحة.

## 9. المراجع والمعايير الدولية (References)
- OWASP Top 10: Broken Object Level Authorization (BOLA / IDOR)
- CWE-639: Authorization Bypass Through User-Controlled Key
