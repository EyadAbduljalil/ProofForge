# خطة وسياسة الأمن الشاملة (Security Architecture Plan)

## 1. آليات الحماية المطبقة
- **المصادقة والتفويض**: نموذج الصلاحيات المرتكز على الأدوار (RBAC) مع فحص ملكية الموارد ضد ثغرات IDOR.
- **حماية المدخلات والبيانات**: التحقق الصارم من المخططات (Schema Validation) والاستعلامات المجهزة (Parameterized Queries).
- **إدارة الجلسات والأسرار**: تخزين الرموز في ملفات تعريف ارتباط HttpOnly آمنة، وعزل مفاتيح البيئة.
- **رؤوس الأمان (HTTP Security Headers)**:
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin

## 2. مصفوفة الصلاحيات (Permission Matrix)
| الدور | استعراض المنتجات | إنشاء طلب | تعديل الأسعار | إدارة المستخدمين |
|---|---|---|---|---|
| زائر (Guest) | نعم | لا | لا | لا |
| عميل (Customer) | نعم | نعم (طلبه فقط) | لا | لا |
| مدير متجر (Store Admin) | نعم | نعم | نعم | لا |
| مدير النظام (Super Admin) | نعم | نعم | نعم | نعم |
