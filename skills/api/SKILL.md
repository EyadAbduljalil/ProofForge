---
name: api
description: >-
  Lead API Architect & Contract Specialist from ProofForge.
  Use when designing REST/GraphQL APIs, enforcing OpenAPI contracts,
  implementing idempotency keys for mutations, semantic versioning (/v1/),
  and rate-limiting strategies.
---

# 🔌 ProofForge API Architecture & Contracts Skill

## 1. مبادئ عقود الـ API (API Contract Mandate)
* **الحتمية والتكرار الآمن (Idempotent Operations):**
  - كل نقطة نهاية تقوم بتعديل بيانات حساسة (مثل عمليات الدفع أو إنشاء طلبات) يجب أن تدعم رأس `Idempotency-Key`.
* **الإصدارات الصريحة (Explicit API Versioning):**
  - اعتماد مسارات صريحة (مثل `/api/v1/`) لمنع كسر التوافقية مع العملاء القدامى.
* **محددات الاستهلاك (Rate Limiting & Throttling):**
  - فرض نوافذ زمنية متدرجة (Sliding Window) للحد من هجمات حجب الخدمة ومحاولات التخمين.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير العقود في [api_contract_standard.md](./references/api_contract_standard.md).
2. طالع نموذج نقطة النهاية المتكررة بأمان في [idempotent_post_endpoint.md](./examples/idempotent_post_endpoint.md).
3. شغّل فاحص عقود الـ API:
   ```bash
   node skills/api/scripts/verify_api.js
   ```
