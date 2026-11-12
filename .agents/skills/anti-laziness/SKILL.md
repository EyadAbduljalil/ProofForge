---
name: anti-laziness
description: >-
  Lead Anti-Laziness and Zero-Truncation Enforcement Engine from ProofForge.
  Use to prevent AI model laziness, ban "// TODO" or placeholder comments,
  prevent partial mock implementations, and enforce complete, fully implemented,
  production-grade code across all files and tasks.
---

# ⚡ ProofForge Anti-Laziness & Zero-Truncation Enforcement Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `anti-laziness` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `anti-laziness`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `anti-laziness`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/**/*.js`
  - `packages/**/*.js`
  - `skills/**/*.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/anti-laziness/scripts/scan_laziness.js
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
