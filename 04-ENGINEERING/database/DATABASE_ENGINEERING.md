# هندسة قواعد البيانات وإدارة الترحيلات الآمنة
## Database Engineering, Schema Constraints & Migration Safety

---

## 1. مبادئ هندسة البيانات (Database Engineering Principles)

1. **القيود الهيكلية الصارمة (Schema Constraints)**:
   - فرض قيود التكامل المرجعي (Foreign Keys)، قيود التحقق (Check Constraints)، وحظر القيم الفارغة (`NOT NULL`) على مستوى محرك قاعدة البيانات لمنع تلوث البيانات.
2. **استراتيجيات الفهرسة الحكيمة (Intentional Indexing)**:
   - إنشاء الفهارس على حقول البحث والمطابقة المتكررة ومفاتيح الربط مع تجنب الفهارس الزائدة التي تبطئ عمليات الكتابة.
3. **الترحيلات الآمنة غير التدميرية (Safe Non-Destructive Migrations)**:
   - تقسيم التغييرات الكبرى إلى مراحل (Expand/Contract Phase) لمنع توقف الخدمة (Zero-Downtime Migrations).
   - حظر الحذف المباشر للأعمدة أو الجداول في الإنتاج دون مرحلة وسيطة للإهمال التدريجي (Deprecation).
