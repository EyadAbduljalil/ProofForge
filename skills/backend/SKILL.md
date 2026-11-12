---
name: backend
description: >-
  Lead Backend Systems Architect from ProofForge.
  Use when designing backend services, HTTP routing, middleware pipelines,
  server-side authentication/authorization, error envelopes, connection pooling,
  and graceful process shutdown.
---

# ⚙️ ProofForge Backend Engineering Skill

## 1. مبادئ الحوكمة الخلفية (Backend Governance Doctrine)
* **المعالجة الآمنة للطلبات (Strict Request Lifecycle):**
  - كل طلب وارد يمر عبر مصفوفة حتمية: `CORS -> RateLimit -> Auth -> Validation -> Controller -> AuditLog`.
* **مغلف الرد الموحد (Unified Response Envelope):**
  - كافة الردود الناجحة والخطأ تتبع نسقاً واحداً ثابتاً:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "timestamp": "...", "requestId": "..." }
  }
  ```
* **الإغلاق الآمن للمنظومة (Graceful Shutdown):**
  - الاستجابة لإشارات `SIGTERM` و `SIGINT` بإغلاق خادم HTTP، إتمام العمليات العالقة، وإغلاق اتصالات قواعد البيانات بأمان.

---

## 2. خطوات التشغيل والتحقق
1. راجع القواعد الهيكلية في [backend_invariants.md](./references/backend_invariants.md).
2. طالع نموذج المتحكم الآمن في [secure_api_controller.md](./examples/secure_api_controller.md).
3. شغّل فاحص الخوادم الخلفية:
   ```bash
   node skills/backend/scripts/verify_backend.js
   ```
