# مصفوفة حواجز وصلاحيات الوكيل الذكي (Agent Permission Boundary)

## المعرّف: `PERM-AGENT-BOUNDARY-001`
## الحالة: `ACTIVE`
## المتطابقة مع: `packages/security/agent-permission-boundary.js`

---

## 1. التوصيف
تطبيق مبدأ الامتيازات الأقل (Principle of Least Privilege) والرفض الافتراضي (Default Deny) على كافة أدوات وعمليات الوكيل الذكي أثناء التعامل مع المستودع والبيئة.

---

## 2. جدول سياسات الصلاحيات المعيارية

| العملية البرمجية | رمز الإجراء | السياسة الأمنية المعتمدة |
| :--- | :--- | :--- |
| **قراءة المستودع** | `READ_REPOSITORY` | `ALLOWED` (مسموح دائماً) |
| **تشغيل الاختبارات** | `RUN_TESTS` | `ALLOWED` (مسموح دائماً) |
| **فحص البناء** | `RUN_BUILD` | `ALLOWED` (مسموح دائماً) |
| **الفحص الأمني** | `RUN_SECURITY_SCAN` | `ALLOWED` (مسموح دائماً) |
| **كتابة وتعديل الكود** | `WRITE_SOURCE` | `REQUIRES_CHECKPOINT` (يتطلب نقطة استعادة) |
| **عمليات قواعد البيانات** | `RUN_DATABASE` | `SANDBOXED_ONLY` (في بيئة معزولة حصراً) |
| **الاتصال الشبكي الخارجي** | `RUN_NETWORK` | `RESTRICTED_LOCAL` (محظور إلا للنطاقات المصرح بها) |
| **تعديل البنية التحتية** | `MODIFY_INFRASTRUCTURE` | `REQUIRES_APPROVAL` (يتطلب موافقة صريحة) |
| **دفع التغييرات للـ Remote** | `PUSH_GIT` | `REQUIRES_APPROVAL` (يتطلب موافقة صريحة) |
| **إنشاء طلبات الدمج** | `CREATE_PR` | `ALLOWED` (مسموح) |
| **دمج التغييرات للـ Main** | `MERGE` | `REQUIRES_HUMAN_GATE` (بوابة بشرية إلزامية) |

---

## 3. آلية الحظر التلقائي (Default Deny)
أي عملية أو أداة غير مدرجة صراحة في مصفوفة الصلاحيات تُعتبر محظورة افتراضياً برمز `DENIED` حتى يتم منحها إذناً مخصصاً ومدروساً.
