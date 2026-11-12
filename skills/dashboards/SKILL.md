---
name: dashboards
description: >-
  Lead Dashboard & Data Visualization Architect from ProofForge.
  Use when building high-density analytics dashboards, real-time charts,
  virtualized tables for massive datasets, metric KPI cards,
  and polling/WebSocket data synchronizations.
---

# 📊 ProofForge Dashboard & Analytics Architecture Skill

## 1. مبادئ لوحات التحكم عالية الكثافة (Data Density Doctrine)
* **كفاءة المساحة والوضوح البصري:** عرض المؤشرات الحيوية (KPIs) بأرقام واضحة (`font-mono`) ومقارنات نسبية محددة دون تشتيت المستخدم.
* **الافتراضية للجداول الضخمة (Virtualization):** عند عرض أكثر من 100 صف، يجب استخدام تقنية Virtualization (مثل TanStack Virtual) لضمان بقاء استهلاك الذاكرة ثابتاً ومعدل الإطارات 60fps.
* **إدارة الاتصال اللحظي (Polling & Real-time):** حظر التحديث العشوائي غير المحدود؛ استخدام استراتيجيات Stale-While-Revalidate و Backoff عند انقطاع الشبكة.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير اللوحات في [dashboard_spec.md](./references/dashboard_spec.md).
2. طالع نموذج بطاقة المؤشرات في [analytics_metric_card.md](./examples/analytics_metric_card.md).
3. شغّل فاحص لوحات التحكم:
   ```bash
   node skills/dashboards/scripts/verify_dashboards.js
   ```
