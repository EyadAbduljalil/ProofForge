---
name: dashboards
description: >-
  Lead Dashboard & Data Visualization Architect from ProofForge.
  Use when building high-density analytics dashboards, real-time charts,
  virtualized tables for massive datasets, metric KPI cards,
  and polling/WebSocket data synchronizations.
---

# 📊 ProofForge Dashboard Architecture & High-Density UI Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `dashboards` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `dashboards`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `dashboards`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/web/app.js`
  - `packages/components/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/dashboards/scripts/verify_dashboards.js
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
