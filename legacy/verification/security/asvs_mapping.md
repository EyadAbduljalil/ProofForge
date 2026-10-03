# مطابقة معايير OWASP ASVS (ASVS Security Verification Mapping)

| فئة ASVS | متطلب التحقق الأمني | آلية الفحص في WebForge | حالة الدليل |
|---|---|---|---|
| **V1: Architecture** | نموذج انعدام الثقة وتوثيق الحدود الأمنية | فحص `ARCHITECTURE.md` وتطبيق Zero Trust | PASS |
| **V2: Authentication** | كلمات المرور، قفل الحساب، وتأمين الرموز | فحص تشفير Argon2id/Bcrypt وتدوير التوكنات | PASS |
| **V3: Session Management** | ملفات تعريف ارتباط HttpOnly و SameSite | فحص سمات الكوكيز وعزل الجلسات | PASS |
| **V4: Access Control** | فحص ملكية المورد ومنع ثغرات IDOR/BOLA | فحص استعلامات الخادم ومطابقة `req.user.id` | PASS |
| **V5: Validation & Sanitization** | فحص المخططات والاستعلامات المجهزة | استخدام Zod/Joi و Parameterized Queries | PASS |
| **V8: Data Protection** | تشفير البيانات الحساسة وعزل الأسرار | فحص متغيرات البيئة وعدم تخزين أسرار في Git | PASS |
| **V13: API Security** | تحديد المعدل، مفاتيح عدم التكرار، والـ Webhooks | فحص Rate Limiting والتحقق من توقيع HMAC | PASS |
| **V14: Configuration** | رؤوس الأمان (CSP, HSTS) وإخفاء الأخطاء | فحص ترويسات الاستجابة وغياب Stack Traces | PASS |
