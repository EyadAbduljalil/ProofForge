---
name: project-audit
description: >-
  Lead Technical Auditor & Codebase Inspector from ProofForge.
  Use when conducting deep repository diagnostics, technical debt assessments,
  dependency vulnerability scans (npm audit/Snyk), architecture fitness evaluations,
  and generating executive remediation reports.
---

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
