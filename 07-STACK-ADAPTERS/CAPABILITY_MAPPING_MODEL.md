# نموذج مطابقة قدرات المكدس مع القواعد (Capability Mapping Model)

## 1. نموذج التكامل مع قدرات المكدس
يربط نموذج مطابقة القدرات بين ما توفره بيئة المكدس الفعلي للمشروع وما تفرضه قواعد WebForge الكنسية:

```
[ Project Technology Stack ] 
             |
             v
[ Capability Detector ] 
             |
             v
[ Capability Mapping Engine ] <---> [ Canonical WebForge Rules ]
             |
             v
[ Stack Adapter Guidance & Validator Selection ]
```

---

## 2. جدول مطابقة القدرات الأساسية

| القدرة التقنية (Capability) | دعم المكدس الأصيل (Native Support) | الدعم عبر مكتبات وسيطة (Library Assisted) | المعالجة في حال الغياب (Unsupported Fallback) |
| :--- | :--- | :--- | :--- |
| **تجزئة كلمات المرور** | `crypto.subtle`, بيئات مدمجة | `argon2`, `bcrypt` | إلزامية إضافة مكتبة معتمدة |
| **الاستعلامات المهيأة (SQLi Guard)** | برامج تشغيل قواعد البيانات الأصلية | محركات ORM / Query Builders | حظر دمج النصوص والتوجيه نحو المعاملات |
| **سياسات الأمان على مستوى الصف (RLS)** | محركات PostgreSQL, Oracle | حراسة برمجية وسيطة (`OwnershipGuard`) | تطبيق نمط حارس الملكية في طبقة الخدمة |
| **إمكانية الوصول والـ RTL** | خواص CSS Logical Properties | محولات CSS Frameworks | مراجعة وإلزامية القواعد المنطقية |
| **تحديد المعدل (Rate Limiting)** | بوابات API Gateway, Redis | خوارزميات الذاكرة المحلية (Sliding Window) | تطبيق محددات الذاكرة في التطبيق |
