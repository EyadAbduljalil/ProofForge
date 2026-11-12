---
name: ecommerce
description: >-
  Lead E-Commerce & Transaction Systems Architect from ProofForge.
  Use when designing online checkout flows, inventory race-condition defenses,
  idempotent payment captures, cart synchronization, and webhook signature verifications.
---

# 🛒 ProofForge E-Commerce & Financial Transactions Skill

## 1. مبادئ المعاملات المالية الموثوقة (Transaction Integrity Doctrine)
* **الحماية من البيع الزائد (Anti-Overselling & Inventory Locking):**
  - حظر خصم المخزون دون حجز مسبق داخل معاملة ذرية (Pessimistic / Optimistic Stock Lock).
* **إثبات عدم التكرار (Payment Idempotency):**
  - كل طلب دفع يجب أن يحمل مفتاح تكرار وحيد لمنع الخصم المزدوج من بطاقة العميل.
* **التحقق المشفر من إشعارات الدفع (Webhook Verification):**
  - التحقق من توقيع HMAC لكل Webhook وارد من Stripe/PayPal باستخدام مقارنة ذات وقت ثابت (`crypto.timingSafeEqual`).

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير الدفع في [checkout_invariants.md](./references/checkout_invariants.md).
2. طالع نموذج الدفع الآمن في [secure_checkout_flow.md](./examples/secure_checkout_flow.md).
3. شغّل فاحص التجارة الإلكترونية:
   ```bash
   node skills/ecommerce/scripts/verify_ecommerce.js
   ```
