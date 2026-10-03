# إرشادات المراقبة والرصد ومنع تلويث السجلات
## Observability Guidance, Structured Logging & PII Masking

---

## 1. أركان المراقبة البرمجية (The Three Pillars of Observability)

1. **السجلات الهيكلية (Structured Logging)**:
   - كتابة السجلات بتنسيق JSON موحد يتضمن: `timestamp`, `level`, `service`, `correlation_id`, `event`, و `context`.
2. **المقاييس الصحية والتشغيلية (Metrics & Health Checks)**:
   - توفير نقاط نهاية قياسية للمراقبة: `/healthz` (Liveness) و `/readyz` (Readiness) ومقاييس الأداء `/metrics`.
3. **التتبع الموزع (Distributed Tracing)**:
   - تمرير معرف الطلب (`X-Correlation-ID`) عبر كافة الخدمات والطلبات الفرعية لتسهيل تتبع المسار الكامل للعمليات.

---

## 2. سياسة منع تلويث السجلات بالبيانات الحساسة (Strict Data Minimization)

يُحظر منعاً باتاً تسجيل أي من العناصر التالية في السجلات أو لوحات المراقبة:
- كلمات المرور والرموز السرية الصريحة.
- توكنات الجلسات ومفاتيح الـ API ورموز JWT.
- أرقام البطاقات الائتمانية والبيانات المصرفية.
- البيانات الشخصية الحساسة (PII) دون تشفير وتعتيم (Masking/Redaction).
