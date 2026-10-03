# هندسة الواجهات الخلفية ودورة حياة الطلب
## Backend Engineering, Request Lifecycle & Service Ownership

---

## 1. مبادئ الواجهات الخلفية (Backend Engineering Principles)

1. **السيادة التامة في التفويض والتحقق**:
   - التحقق الإلزامي من صلاحيات الوصول (RBAC/ABAC) وملكية المورد (Tenant/User Ownership) لكل طلب على حدة قبل تنفيذ أي منطق أعمال.
2. **إدارة الموارد والمهل الزمنية (Resource Limits & Timeouts)**:
   - تعيين مهلة زمنية قاطعة (Request Timeout) لكل عملية لمنع استنزاف خيوط المعالجة والذاكرة.
   - كبح حجم الحمولات الواردة (Payload Body Limit) لمنع هجمات حجب الخدمة (DoS).
3. **التنفيذ التكراري الآمن (Idempotency by Default)**:
   - دعم مفاتيح التكرار الآمن (`Idempotency-Key`) لكافة العمليات المالية والتعديلية الحساسة.
