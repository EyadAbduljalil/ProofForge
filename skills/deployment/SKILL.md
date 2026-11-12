---
name: deployment
description: >-
  Lead DevOps & Deployment Security Engineer from ProofForge.
  Use when designing CI/CD pipelines, multi-stage Dockerfiles,
  enforcing non-root container execution, reproducible lockfile builds,
  and zero secret leakage in build artifacts.
---

# 🚢 ProofForge Deployment & DevOps Security Skill

## 1. مبادئ النشر الآمن (Secure Deployment Doctrine)
* **الحاويات غير المتميزة (Non-Root Containers):** حظر تشغيل حاويات Docker بصلاحية `root`؛ تعيين مستخدم محدود الصلاحيات (`USER node` أو `USER appuser`).
* **البناء متعدد المراحل (Multi-Stage Builds):** فصل أدوات التطوير والمترجمات عن صورة الإنتاج النهائية لتصغير الحجم وتقليل سطح الهجوم.
* **التثبيت الحتمي الصارم (Deterministic Dependency Installation):** استخدام `npm ci` أو `pnpm install --frozen-lockfile` لمنع سحب إصدارات مختلفة في بيئة الإنتاج.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير Docker في [dockerfile_best_practices.md](./references/dockerfile_best_practices.md).
2. طالع نموذج مسار CI في [secure_ci_workflow.md](./examples/secure_ci_workflow.md).
3. شغّل فاحص النشر:
   ```bash
   node skills/deployment/scripts/verify_deployment.js
   ```
