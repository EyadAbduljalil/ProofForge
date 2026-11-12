---
name: production-readiness
description: >-
  Lead Site Reliability Engineer & Production Readiness Auditor from ProofForge.
  Use before launching applications to production, verifying 12-Factor principles,
  healthz/readyz observability probes, structured JSON logging, process supervision,
  and zero hardcoded secrets.
---

# 🚀 ProofForge Production Readiness & Reliability Skill

## 1. ميثاق الجاهزية للإنتاج (Production Readiness Doctrine)
لا يُنشر أي تطبيق في بيئة الإنتاج دون اجتياز **بوابات الجاهزية التشغيلية (Operational Readiness Gates)**:
* **فحص الصحة والجاهزية (Health & Liveness Probes):** توفير نقاط نهاية خفيفة وسريعة `/healthz` (هل التطبيق يعمل؟) و `/readyz` (هل اتصالات قواعد البيانات والتخزين جاهزة؟).
* **السجلات المنظمة غير المسربة (Structured JSON Logging):** تسجيل الأحداث بتنسيق JSON مع حظر طباعة أي بيانات حساسة أو أرقام سرية أو رموز مرور.
* **مبادئ 12-Factor App:** قراءة كافة الإعدادات والروابط حصراً من متغيرات البيئة مع توفير قيم افتراضية آمنة (Strict Fail-Closed Defaults).

---

## 2. خطوات التشغيل والتحقق
1. راجع قائمة التحقق للإنتاج في [readiness_checklist.md](./references/readiness_checklist.md).
2. طالع نموذج نقاط الفحص في [health_check_controller.md](./examples/health_check_controller.md).
3. شغّل فاحص الجاهزية:
   ```bash
   node skills/production-readiness/scripts/audit_readiness.js
   ```
