# نمط العزل التام للمستأجرين (Tenant Isolation Pattern)

## المعرّف: `PAT-TENANT-ISOLATION-001`
## الحالة: `ACTIVE`
## النطاق: بنية البيانات، استعلامات قواعد البيانات، وبيئات تعدد المستأجرين (Multi-Tenancy)

---

## 1. التوصيف المعماري
نمط معماري يضمن عزل بيانات كل مستأجر (Tenant) عن المستأجرين الآخرين بشكل حتمي على مستوى الاستعلامات والذاكرة، لمنع أي تسريب عرضي أو استغلال لثغرات العبور بين المستأجرين (Cross-Tenant Data Leakage).

---

## 2. آليات العزل المعتمدة
1. **العزل عبر السياق الإلزامي (Scoping Middleware)**:
   - استخراج `tenant_id` حصراً من هوية المستخدم المصادق عليها (JWT / Session Claims)، وليس من معلمات الطلب (Query Params) القابلة للتلاعب.
2. **الاستعلام المقيد (Constrained Querying)**:
   - تضمين `WHERE tenant_id = :currentTenantId` تلقائياً في كل استعلام استرجاع أو تحديث أو حذف عبر ORM Hooks أو قاعدة بيانات وسيطة.

---

## 3. تطبيق عملي آمن
```javascript
export function applyTenantScope(baseQuery, userContext) {
  if (!userContext || !userContext.tenantId) {
    throw new Error('SECURITY_VIOLATION: Unauthenticated tenant access attempt');
  }

  return {
    ...baseQuery,
    where: {
      ...baseQuery.where,
      tenantId: userContext.tenantId // فرض نطاق المستأجر بشكل حتمي
    }
  };
}
```
