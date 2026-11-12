---
name: anti-laziness
description: >-
  Lead Anti-Laziness and Zero-Truncation Enforcement Engine from ProofForge.
  Use to prevent AI model laziness, ban "// TODO" or placeholder comments,
  prevent partial mock implementations, and enforce complete, fully implemented,
  production-grade code across all files and tasks.
---

# ⚡ ProofForge Anti-Laziness & Completeness Skill

## 1. مبدأ الحظر المطلق للكسل البرمجي (Zero-Tolerance Policy)
يميل الذكاء الاصطناعي أحياناً إلى اختصار الحلول وترك نصوص تعليقية ناقصة بدلاً من إكمال البرمجة. تخضع هذه المهارة لقاعدة صارمة:
* **حظر التعليقات الناقصة:** يُمنع منعاً باتاً كتابة `// TODO: implement later` أو `// add remaining logic here` أو ترك دوال فارغة أو استثناءات وهمية (`throw new Error("Not implemented")`).
* **الكود الكامل الجاهز للإنتاج (Production-Grade Deliverable):** أي كود يُطلب منك كتابته يجب أن يكون مكتملاً بالكامل، معالجاً لكافة الحالات الحدية، وجاهزاً للتشغيل المباشر في بيئة الإنتاج دون الحاجة لأن يكمل المستخدم ما نقص.

---

## 2. قائمة المحظورات الصارمة
1. ❌ حظر وضع `/* ... rest of code unchanged ... */` داخل الملفات الجديدة أو التعديلات الكاملة.
2. ❌ حظر استخدام دوال وهمية (Mocks) في كود الإنتاج.
3. ❌ حظر ترك حقول إدخال بدون دوال تحقق حقيقية.
4. ❌ حظر حذف الاختبارات الفاشلة لإظهار أن الفحص اجتاز بنجاح.

---

## 3. خطوات الفحص الآلي
قم بتشغيل الفاحص التلقائي لرصد أي كسل برمجي:
```bash
node skills/anti-laziness/scripts/scan_laziness.js
```
قارن الكود مع الأمثلة المعيارية في [complete_vs_lazy_code.md](./examples/complete_vs_lazy_code.md).
