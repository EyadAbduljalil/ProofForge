---
name: testing
description: >-
  Lead Quality Assurance and Deterministic Verification Engine from ProofForge.
  Use when creating automated test suites (Unit, Integration, E2E), property-based testing,
  adversarial fuzz testing, regression prevention, enforcing the Evidence Contract,
  and banning unverified claims of completion.
---

# 🧪 ProofForge Quality Assurance & Deterministic Testing Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `testing` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `testing`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `testing`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `tests/**`
  - `packages/*/tests/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 🧪 ProofForge Evidence-Driven Testing Skill

## 1. عقد الإثبات الحتمي (The Evidence Contract)
تخضع هذه المهارة لمبدأ الإثبات الرياضي الحتمي:
* **حظر الادعاء غير المثبت (No Unproven Claims):** يُحظر نهائياً على المساعد الذكي إعلان اكتمال أي ميزة أو إصلاح دون استخراج دليل ملموس (Output) من تشغيل الاختبارات الآلية.
* **الأدلة الأربعة الإلزامية (The 4 Non-Negotiable Proofs):**
  1. `Type Check Proof`: صفر أخطاء في فحص الأنواع الصارم (`tsc --noEmit`).
  2. `Linter Proof`: صفر أخطاء في فحص التنسيق البرمجي (`lint`).
  3. `Automated Test Proof`: نجاح 100% لكافة اختبارات الوحدة والتكامل بدون أي فشل.
  4. `Build Proof`: بناء حزمة الإنتاج بنجاح تام (`npm run build`).

---

## 2. أنواع الاختبارات الإلزامية في ProofForge

### أ) اختبارات الخصائص والحدود (Property & Invariant Tests)
* اختبار الحالات المتطرفة (Boundary Values): مدخلات فارغة، نصوص طويلة جداً، مصفوفات ضخمة، وحروف غير قياسية.
* اختبار الثبات تحت التزامن (Concurrency & Idempotency): التحقق من أن تكرار العملية 10 مرات ينتج نفس النتيجة الحتمية دون تكرار الخصم أو الإنشاء.

### ب) اختبارات الفحص العدائي (Adversarial Fuzzing)
* تمرير مدخلات مشوهة (Malformed Payloads) عمداً للتحقق من أن النظام يفشل بأمان (Fail-Closed) ولا يسرب تفاصيل داخلية (Stack Traces).

---

## 3. خطوات التشغيل والتحقق (Execution & Evidence Protocol)

1. **الاطلاع على عقد الإثبات:** راجع المعايير في [evidence_contract.md](./references/evidence_contract.md).
2. **نماذج الاختبار المتقدمة:** استخدم الأمثلة في [property_test_patterns.md](./examples/property_test_patterns.md).
3. **تشغيل الفاحص الآلي للأدلة:**
   ```bash
   node skills/testing/scripts/verify_evidence.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/testing/scripts/verify_evidence.js
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
