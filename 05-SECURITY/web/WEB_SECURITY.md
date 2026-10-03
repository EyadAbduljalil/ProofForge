# أمان تطبيقات الويب وترويسات الحماية (Web Application Security & Headers)

## 1. ترويسات الأمان الإلزامية (Mandatory Security Headers)
يجب أن تقوم كافة خوادم الويب وواجهات برمجة التطبيقات بحقن الترويسات الدفاعية التالية في جميع الاستجابات:
- **`Strict-Transport-Security` (HSTS)**:
  `max-age=31536000; includeSubDomains; preload` لفرض استخدام بروتوكول HTTPS حصراً ومنع هجمات خفض التشفير (SSL Stripping).
- **`X-Content-Type-Options`**:
  `nosniff` لمنع المتصفحات من تخمين أنواع MIME للملفات وتنفيذ محتويات خبيثة.
- **`X-Frame-Options`** (أو `frame-ancestors` في CSP):
  `DENY` أو `SAMEORIGIN` لمنع تضمين الصفحة داخل إطارات خبيثة وحظر هجمات اختطاف النقرات (Clickjacking).
- **`Referrer-Policy`**:
  `strict-origin-when-cross-origin` أو `no-referrer` لحماية البيانات الحساسة والمعرفات من التسرب في ترويسة المرجع.
- **`Permissions-Policy`**:
  تقييد الوصول إلى ميزات العتاد الحساسة (مثل الكاميرا، الميكروفون، والموقع الجغرافي: `camera=(), microphone=(), geolocation=()`).

---

## 2. سياسة مشاركة الموارد عبر الأصول (CORS Policy)
- **المحظورات الصارمة**:
  - يُحظر تماماً الجمع بين `Access-Control-Allow-Origin: *` وترويسة `Access-Control-Allow-Credentials: true` (وهو خرق أمني فادح).
  - يُحظر الاعتماد على انعكاس ترويسة `Origin` الواردة مباشرة في الاستجابة دون التحقق منها في قائمة بيضاء صارمة للنطاقات المسموحة.
- **القواعد الإلزامية**:
  - التحقق من النطاق المصرح به بدقة (Exact String Match أو فحص دقيق للنطاقات الفرعية).
  - تحديد الطرق (`Allow-Methods`) والترويسات (`Allow-Headers`) المصرح بها حصراً.
  - تحديد مدة تخزين مسبق صالحة ومحدودة لنتائج طلبات التحقق المسبق (`Access-Control-Max-Age`).

---

## 3. الحماية من تزوير الطلبات عبر المواقع (Cross-Site Request Forgery - CSRF)
- استخدام نمط الرموز المضادة لتزوير الطلبات (`Anti-CSRF Tokens`) المقترنة بجلسة المستخدم في كافة العمليات المعدلة للحالة (POST, PUT, DELETE, PATCH).
- استخدام تقنية الكعكات المضاعفة الإرسال (`Double Submit Cookie`) أو التوثيق القائم على الترويسات المخصصة للواجهات البرمجية.
- ضبط سمة `SameSite=Strict` أو `SameSite=Lax` على كعكات الجلسات.
