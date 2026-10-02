# Comprehensive Security Hardening & Vulnerability Mitigation

قم بجمع ومراجعة وتطبيق جميع تدابير الأمان المشددة (Security Hardening & Zero-Trust Verification) عبر كافة طبقات النظام لحماية بيانات العملاء والمتجر.

## 1. التوثيق وتأمين الجلسات (Authentication & Session Security)
* **تشفير كلمات المرور**: استخدام خوارزمية تشفير متينة مع التمليح (Argon2id أو Bcrypt بـ Cost Factor لا يقل عن 12).
* **إدارة التوكينات والجلسات**:
  * حفظ Refresh Tokens في كوكيز آمنة ومحمية (`HttpOnly`, `Secure`, `SameSite=Strict`).
  * استخدام أزمنة انتهاء قصيرة لـ Access Tokens (e.g. 15 دقيقة) وإلغاء التوكينات عند تسجيل الخروج أو تغيير كلمة المرور.
  * حظر كشف تجزئة كلمات المرور (Password Hashes) أو التوكينات في أي استجابة API أو سجلات النظام (Omit sensitive fields from DB responses).

## 2. الثغرات الشائعة وتأمين المدخلات (Vulnerability Remediation)
* **IDOR & Authorization**: التحقق سيرفر-سايد من ملكية المستخدم الحقيقية للمورد في كل API قبل تنفيذ الاستعلام (مثل الطلبات، العناوين، السلة، التقييمات).
* **SQL Injection & ORM Safety**: الاعتماد الحصري على Parameterized Queries و Prisma ORM، وتجنب بناء SQL Queries عن طريق دمج النصوص (String Concatenation).
* **XSS (Cross-Site Scripting)**: تعقيم كافة نصوص مدخلات المستخدم واستخدام مكتبات تنظيف النصوص (Sanitization) وضبط ترويسات Content Security Policy (CSP).
* **CSRF (Cross-Site Request Forgery)**: حماية المسارات التعديلية واستخدام SameSite Strict Cookies مع CSRF Tokens إن لزم.
* **Mass Assignment & Input Validation**: استخدام مكتبة Zod أو Joi للتحقق من هيكل وأنواع كافة البيانات المدخلة في Requests DTOs ومنع حقول غير مصرح بها (Strict Schema Parsing).

## 3. حماية العمليات المالية والتلاعب (Business Logic & Rate Limiting)
* **تأمين الأسعار والمبالغ المالية**: منع قبول المبالغ أو الإجماليات من Frontend كلياً؛ يتم إعادة الحساب سيرفر-سايد دائماً.
* **تأمين الكوبونات والمخزون**: حماية استعلامات الكوبونات والمخزون من سباقات التزامن (Race Conditions) وتجاوز الحدود باستخدام تجميد الصفوف والـ DB Transactions.
* **معدل الطلبات (Rate Limiting)**: تطبيق Rate Limiting مشدد على مسارات الحساسة (Login, Register, Password Reset, Checkout, Admin APIs) باستعمال IP & User Throttling لمنع هجمات القوة الغاشمة و Denial of Service.
* **تأمين رفع الملفات (File Upload Security)**: التحقق من نوع الملف الحقيقي (MIME Type Magic Bytes)، تقييد الحجم الأقصى، تغيير اسم الملف لرمز عشوائي، وتخزينه خارج المسارات التنفيذية للسيرفر (أو على Cloud Storage مثل S3/Cloudinary).

## 4. إخفاء الأسرار وتوليد بيئة العمل (Secrets, Error Masking & `.env.example`)
* **إخفاء الأسرار**: التحقق التام من عدم تسريب أي أسرار، مفاتيح API، أو بيانات اعتماد في مستودع Git (`.gitignore`).
* **قمع الأخطاء في الإنتاج (Production Error Masking)**:
  * تعطيل Stack Traces ورسائل الأخطاء التفصيلية في بيئة Production إطلاقاً.
  * إرجاع رسالة خطأ موحدة وعامة للعميل وتدوين التفاصيل الفنية في سجلات السيرفر الآمنة.
* **توليد `.env.example`**:
  * إنشاء ملف `.env.example` يحتوي على كافة اسم المتغيرات البيئية المطلوبة لتشغيل المتجر دون تدوين القيم السرية الحقيقية.
