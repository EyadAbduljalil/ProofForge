# تقرير المراقبة والقياس عن بُعد — WebForge OS Observability & Telemetry Report

## 1. ملخص المراقبة وسجلات التدقيق (Observability Summary)
يتضمن WebForge OS بنية مراقبة شاملة ثلاثية الأبعاد: **المقاييس (Metrics)**، **سجلات التدقيق (Audit Logs)**، و **تتبع سلامة النظام (Health & Readiness Probes)**.

## 2. نقاط النهاية المتاحة للرصد (Telemetry Endpoints)

| المسار (Endpoint) | البروتوكول / الصيغة | الاستخدام والغرض |
| :--- | :--- | :--- |
| `/healthz` | HTTP JSON | فحص حيوية الخادم (Liveness Probe) في بيئات Kubernetes/Docker |
| `/readyz` | HTTP JSON | فحص جاهزية الخادم والاتصال بقواعد البيانات والكاش (Readiness Probe) |
| `/metrics` | Prometheus Text Format | تصدير عدادات الطلبات، مصفوفة رموز الحالة 2xx/4xx/5xx، وعمليات الحظر الأمني |

## 3. حقول سجلات التدقيق وسجل العمليات الحساسة (Structured Audit Logging)
يتم تسجيل كافة العمليات الحساسة (تسجيل الدخول، إنشاء مستأجر، الشراء، تعديل الصلاحيات) داخل جدول `audit_logs` بصيغة JSON محكمة مع حجب البيانات السرية عبر `SecretsScrubber`.

```json
{
  "timestamp": "2026-10-02T12:40:00.000Z",
  "requestId": "req_1727872800_abc1",
  "tenantId": "tenant_alpha",
  "userId": "user_1001",
  "action": "ORDER_CHECKOUT_COMPLETED",
  "resource": "orders/ord_5001",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0 ...",
  "status": "SUCCESS"
}
```

---
**تاريخ التحقق**: 2026-10-02  
**فريق هندسة المراقبة والعمليات**: WebForge OS SRE & Observability
