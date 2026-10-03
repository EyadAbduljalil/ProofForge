# معيار عقد واجهات برمجة التطبيقات (API Contract Standard)

## المعرّف: `STD-API-CONTRACT-001`
## الحالة: `ACTIVE`
## النطاق: عام لجميع واجهات برمجة التطبيقات (REST, GraphQL, RPC)

---

## 1. الغرض والأهداف
تحديد معيار موحد، صارم، وخالٍ من الغموض لكافة عقود واجهات برمجة التطبيقات المستخرجة والمبنية داخل منظومة WebForge OS، لضمان استقرار التكامل البرمجي، أمن البيانات، وإمكانية التتبع والتحقق الآلي المستمر.

---

## 2. هيكل الاستجابة المعياري (Standard Response Envelope)
يجب أن تتبع كافة استجابات واجهات برمجة التطبيقات نمط التغليف الموحد:

### 2.1 استجابة النجاح (Success Response)
```json
{
  "success": true,
  "data": {
    "id": "item_12345",
    "name": "Resource Name"
  },
  "meta": {
    "timestamp": "2026-10-02T15:00:00.000Z",
    "requestId": "req_abc123xyz",
    "version": "v1"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2.2 استجابة الخطأ (Error Response)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT_PARAMETER",
    "message": "القيمة المدخلة للحقل غير صالحة.",
    "details": [
      {
        "field": "email",
        "issue": "تنسيق البريد الإلكتروني غير صحيح"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-02T15:00:00.000Z",
    "requestId": "req_abc123xyz"
  }
}
```

---

## 3. قواعد التسمية والاصطلاحات (Naming & Conventions)
1. **مسارات الموارد (Resource URIs)**:
   - تستخدم صيغة الجمع بالأسماء الصغيرة وبفواصل `-` (kebab-case): `/api/v1/user-profiles/{id}`.
   - لا يجوز استخدام الأفعال في مسارات RESTful (تحديد الفعل يتم عبر HTTP Method).
2. **مفاتيح الحقول (Field Keys)**:
   - تستخدم صيغة `camelCase` حصراً في كافة حمولات JSON.
3. **أكواد الحالة (HTTP Status Codes)**:
   - `200 OK`: للعمليات الناجحة مع إرجاع بيانات.
   - `201 Created`: عند إنشاء مورد جديد بنجاح.
   - `204 No Content`: للعمليات الناجحة بدون محتوى مسترجع.
   - `400 Bad Request`: عند فشل التحقق من صحة المدخلات.
   - `401 Unauthorized`: عند انعدام أو بطلان الهوية والمصادقة.
   - `403 Forbidden`: عند حظر الصلاحية حتى مع وجود هوية صالحة.
   - `404 Not Found`: عند عدم وجود المورد المطلوب.
   - `409 Conflict`: عند تعارض الحالة أو تكرار مورد فريد.
   - `422 Unprocessable Entity`: عند فشل منطق العمليات المعقدة.
   - `429 Too Many Requests`: عند تجاوز معدل الطلبات المسموح.
   - `500 Internal Server Error`: عند حدوث خطأ غير متوقع مع إخفاء تفاصيل المكدس البرمجي (Stack Trace).

---

## 4. ضوابط الأمان الإلزامية في العقود (Mandatory Security Constraints)
1. **التحقق من صحة المدخلات (Schema-First Validation)**:
   - يجب تعريف كل مسار بـ JSON Schema أو Zod Schema صارم.
   - منع الحقول الإضافية غير المصرح بها (Disallow Unknown Fields) لمنع هجمات Mass Assignment.
2. **منع تسريب البيانات الحساسة (Data Exposure)**:
   - منع إرجاع كلمات المرور، التوكنات الداخلية، مفاتيح التشفير، أو مسارات الملفات الداخلية مطلقاً.
3. **رؤوس الأمان (Security Headers)**:
   - إلزامية الرؤوس: `Content-Type: application/json`, `X-Content-Type-Options: nosniff`, `Cache-Control: no-store` (لنقاط النهاية الحساسة).
