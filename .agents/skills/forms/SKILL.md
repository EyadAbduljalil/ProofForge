---
name: forms
description: >-
  Lead Form Architect & Validation Specialist from ProofForge.
  Use when building complex forms, schema validations (Zod/React Hook Form),
  input sanitization, inline error states, debounced field checks,
  and preventing double-submission.
---

# 📝 ProofForge Form Architect & Schema Validation Specialist Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `forms` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `forms`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `forms`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/server/server.js`
  - `packages/security/input-security.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/forms/scripts/verify_forms.js
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
