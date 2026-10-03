# النمط المضاد: التضمين المباشر للأسرار (Hardcoded Secrets Anti-Pattern)

## المعرّف: `ANTI-HARDCODED-SECRETS-001`
## درجة الخطورة: `CRITICAL`
## تصنيف CWE: `CWE-798`

---

## 1. التوصيف
تضمين مفاتيح API، كلمات مرور قواعد البيانات، سلاسل تشفير JWT، أو شهادات خاصة مباشرة في الشيفرة المصدرية أو ملفات التكوين الملتزم بها في أنظمة إدارة الإصدارات (Git).

---

## 2. النموذج المعيب والنموذج المصحح

### 2.1 النمط المعيب
```javascript
// خطير جداً: تضمين مباشر للمفتاح السري
const JWT_SECRET = "my-ultra-secret-key-12345";
const db = connect("postgres://admin:password123@localhost:5432/prod_db");
```

### 2.2 النمط المصحح
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("FATAL_SECURITY: JWT_SECRET environment variable is missing or insecure");
}
```
