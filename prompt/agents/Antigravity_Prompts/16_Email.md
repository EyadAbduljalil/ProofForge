# Email Service Abstraction & Template Engine

أنشئ خدمة بريد إلكتروني مستقلة (Email Service Abstraction) قابلة للتكيف وإعادة الاستخدام لارسال الرسائل التفاعلية والمعاملات المالية.

## 1. قوالب البريد الإلكتروني (Email Templates & Scenarios)
* بناء قوالب بريدية جذابة، متجاوبة (Responsive HTML Email Templates)، وتدعم اللغة العربية والإنجليزية لجميع المعاملات الحساسة:
  * **Welcome Email**: عند تسجيل حساب جديد.
  * **Password Reset Email**: عند طلب إعادة ضبط كلمة المرور وتحتوي على رابط توكين آمن ومحدد بزمن.
  * **Order Confirmation Email**: يحتوي على تفاصيل المنتجات، الإجمالي، وعنوان التوصيل فور إنشاء/تأكيد الطلب.
  * **Payment Confirmation Email**: إشعار باستلام المبلغ وتفاصيل الفاتورة الإلكترونية.
  * **Shipping Update Email**: يحتوي على رقم الشحن ورابط تتبع الشحنة مع شركة التوصيل.
  * **Delivery Confirmation Email**: إشعار بتاكيد استلام المنتج بنجاح مع دعوة لتقييم المنتجات.
  * **Return Update Email**: إشعار بقبول أو تحديث حالة طلب الإرجاع.

## 2. التجريد وفصل مزود البريد (Email Provider Abstraction)
* إنشاء واجهة مجردة `IEmailProvider` تحتوي على طريقة قياسية لإرسال الرسائل:
  ```typescript
  interface IEmailProvider {
    sendEmail(options: SendEmailOptions): Promise<boolean>;
  }
  ```
* عدم ربط الـ Business Logic إطلاقاً بأي مزود بريد مادي محدد داخل منطق التطبيق.
* إنشاء Adapters لمزودي الخدمة المختلفين (مثل Nodemailer SMTP, Resend, SendGrid, Amazon SES) بحيث يمكن التبديل بينهم فقط بتغيير إعداد في المتغيرات البيئية دون تعديل أسطر البرمجة.

## 3. التهيئة والأمان والمتغيرات البيئية (Environment Setup & Background Dispatch)
* **المتغيرات البيئية (`.env`)**:
  * ضبط إعدادات المزود عبر المتغيرات البيئية:
    * `EMAIL_PROVIDER`: (e.g. `smtp`, `resend`, `sendgrid`).
    * `EMAIL_FROM`: البريد الرسمي للمرسل (e.g. `no-reply@yourdomain.com`).
    * `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
* **الإرسال غير المتزامن (Asynchronous Non-Blocking Emails)**:
  * إرسال البريد الإلكتروني في الخلفية (Background Job / Queue) لضمان عدم إبطاء زمن استجابة API الخاصة بالعميل.
  * معالجة الأخطاء وإعادة المحاولة التلقائية (Retry Mechanism) في حالة فشل الاتصال بمزود البريد.
