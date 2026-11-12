---
name: forms
description: >-
  Lead Form Architect & Validation Specialist from ProofForge.
  Use when building complex forms, schema validations (Zod/React Hook Form),
  input sanitization, inline error states, debounced field checks,
  and preventing double-submission.
---

# 📝 ProofForge Form Architecture & Validation Skill

## 1. مبادئ النماذج الآمنة (Form Validation Doctrine)
* **التحقق الصارم عبر المخططات (Schema-Driven Validation):**
  - لا يُسمح بإرسال أي نموذج دون التحقق من صحة مدخلاته مسبقاً عبر مخطط موحد (مثل Zod).
* **منع الإرسال المزدوج (Double-Submit Protection):**
  - تعطيل زر الإرسال تلقائياً أثناء المعالجة (`disabled={isSubmitting}`) مع إظهار مؤشر تحميل فوري.
* **إمكانية الوصول في رسائل الخطأ:**
  - ربط رسالة الخطأ بالحقل عبر `aria-describedby` و `aria-invalid={true}` لضمان قراءتها عبر قارئات الشاشة.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير التحقق في [form_validation_rules.md](./references/form_validation_rules.md).
2. طالع نموذج النموذج الآمن في [secure_form.md](./examples/secure_form.md).
3. شغّل فاحص النماذج:
   ```bash
   node skills/forms/scripts/verify_forms.js
   ```
