---
name: security
description: >-
  Lead Security Architect and Penetration Testing Engine from ProofForge.
  Use when analyzing, implementing, or auditing application security, authentication,
  authorization (anti-IDOR/BOLA), input sanitization, injection defense (SQLi/XSS/SSRF),
  cryptographic storage, rate-limiting, session hygiene, and OWASP ASVS Level 2 compliance.
---

# 🛡️ ProofForge Security Engineering Skill

## 1. هرمية السلطة وقاعدة P0 الإلزامية (Fail-Closed Security)
تخضع هذه المهارة لمستوى السلطة **P0 (Security & Safety)** وهو قطعي وغير قابل للتجاوز تحت أي ظرف:
* **الرفض الافتراضي (Default Deny):** أي مسار أو إجراء أو استعلام لم يُصرّح به صراحة يُعد محظوراً افتراضياً.
* **سلطة الخادم الحصرية (Server-Side Authority):** لا ثقة إطلاقاً في أي فحص أو تصفية تتم من طرف العميل (Zero Trust Client).
* **حظر ثغرات تفويض الصلاحيات (Anti-IDOR / Anti-BOLA):** التحقق الصارم من ملكية المورد لكل مستخدم قبل أي قراءة أو تعديل.

---

## 2. مصفوفة الفحص الشامل وضوابط الأمان

### أ) التحكم بالوصول وحماية الموارد (Access Control & Ownership)
1. **حظر IDOR/BOLA قطيعاً:**
   - لا تعتمد على المعرف الممرر في الطلب (`req.params.id`) بمفرده أبداً.
   - اقرن دائماً استعلام المورد بمعرف المستخدم صاحب الجلسة الموثقة:
   ```typescript
   // ❌ غير آمن:
   const order = await db.orders.findById(req.params.id);

   // ✅ آمن (ProofForge Standard):
   const order = await db.orders.findOne({ id: req.params.id, tenantId: req.user.tenantId, userId: req.user.id });
   if (!order) throw new ForbiddenError('Access Denied');
   ```

### ب) حماية المدخلات وحظر الحقن (Input Sanitization & Injection Defense)
1. **SQL / NoSQL Injection:** استخدام الاستعلامات المجهزة (Parameterized Queries) والمخططات الصارمة (Zod/TypeBox).
2. **Cross-Site Scripting (XSS):** تعقيم كافة حقول الإدخال وترميز المخرجات، وفرض رؤوس `Content-Security-Policy`.
3. **Server-Side Request Forgery (SSRF):** حظر أي طلب خارجي موجه لشبكات داخلية (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, أو بيانات التعريف السحابية `169.254.169.254`).

### ج) الجلسات والأسرار (Sessions & Secrets Hygiene)
1. **تخزين التوكنات:** حفظ رموز المصادقة داخل كعكات `HttpOnly`, `Secure`, `SameSite=Strict`.
2. **تطهير الأسرار (Secret Scrubbing):** حظر طباعة أي مفاتيح API أو كلمات مرور في السجلات (Logs) أو رسائل الخطأ.

---

## 3. خطوات التشغيل والتحقق الآلي (Execution & Verification Steps)

1. **فحص السياق أولاً:** اقرأ مصفوفة التهديدات في [security_matrix.md](./references/security_matrix.md).
2. **مطابقة الكود بالأمثلة:** قارن تطبيقك مع الأمثلة الآمنة والمحظورة في [secure_code_patterns.md](./examples/secure_code_patterns.md).
3. **تشغيل الفحص الآلي المدمج:**
   قم بتشغيل نص الفحص الآلي من سطر الأوامر:
   ```bash
   node bin/webforge.js security
   ```
   أو تشغيل الفاحص المحلي:
   ```bash
   node skills/security/scripts/verify_security.js
   ```

---

## 4. التقرير الأمني الإلزامي (Security Report Contract)
يجب أن يختتم كل تدقيق أمني بتقرير منظم يتضمن:
1. **ملخص أمني تنفيذي.**
2. **قائمة الثغرات المكتشفة مع تصنيف الخطورة (Critical / High / Medium / Low).**
3. **خطوات المعالجة البرمجية الدقيقة.**
4. **أدلة الاختبار الناجحة مع zero unhandled risks.**
