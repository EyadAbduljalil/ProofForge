---
name: ecommerce
description: >-
  Lead E-Commerce & Transaction Systems Architect from ProofForge.
  Use when designing online checkout flows, inventory race-condition defenses,
  idempotent payment captures, cart synchronization, and webhook signature verifications.
---

# 💳 ProofForge E-Commerce & Transaction Systems Architecture Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `ecommerce` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `ecommerce`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `ecommerce`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/server/server.js`
  - `apps/server/payments/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/ecommerce/scripts/verify_ecommerce.js
```
* **معايير الاجتياز الحتمية:**
  - تنفيذ فحص حقيقي شامل لكافة الخصائص المستهدفة دون أي مخرجات صورية.
  - خروج بكود صفري (Exit Code 0) حصراً عند ثبوت المطابقة بالأدلة المادية.
  - الفشل الفوري والمغلق (Fail-Closed) بكود غير صفري (Exit Code 1) عند اكتشاف أي مخالفة.

## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)
* **الأدلة المطلوبة لإثبات الإنجاز:**
  - تقرير فحص آلي مهيكل بصيغة JSON يؤكد خلو الكود من العيوب.
  - توثيق كافة التغييرات وسلسلة النسب في سجلات التدقيق الكنسية.
  - الامتثال لقاعدة: `AI Output !== Evidence` والاعتماد حصراً على بوابات التحقق المستقلة في CVGF.
