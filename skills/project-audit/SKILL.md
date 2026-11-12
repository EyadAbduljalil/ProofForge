---
name: project-audit
description: >-
  Lead Technical Auditor & Codebase Inspector from ProofForge.
  Use when conducting deep repository diagnostics, technical debt assessments,
  dependency vulnerability scans (npm audit/Snyk), architecture fitness evaluations,
  and generating executive remediation reports.
---

# 📋 ProofForge Comprehensive Technical Project Audit Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `project-audit` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `project-audit`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `project-audit`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `skills/*/scripts/*.js`
  - `bin/webforge.js`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 📋 ProofForge Project Audit & Technical Debt Skill

## 1. مبادئ التدقيق الهندسي الشامل (Comprehensive Diagnostic Doctrine)
* **الفحص قبل الافتراض (Inspect Before Assume):**
  - فحص حقيقي لملفات المشروع الفعلي، لغات البرمجة، الحزم المقفلة، وهيكل المجلدات بدلاً من التخمين.
* **تصنيف الديون الفنية والأمنية (Technical Debt Categorization):**
  - فرز الملاحظات حسب الشدة: (P0 Security Critical -> P1 Architectural Regression -> P2 Visual Slop -> P3 Technical Debt).
* **تقرير معالجة قابل للتنفيذ (Actionable Remediation):**
  - كل ملاحظة يجب أن ترفق بالسبب الجذري، الأثر المحتمل، وكود المعالجة الدقيق.

---

## 2. خطوات التشغيل والتحقق
1. راجع مصفوفة التدقيق في [audit_matrix.md](./references/audit_matrix.md).
2. طالع نموذج التقرير في [audit_report_format.md](./examples/audit_report_format.md).
3. شغّل فاحص المشروع:
   ```bash
   node skills/project-audit/scripts/run_audit.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/project-audit/scripts/run_audit.js
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
