---
name: frontend
description: >-
  Lead Frontend Architect from ProofForge.
  Use when designing client-side architecture, managing state (Context/Zustand/React Query),
  implementing error boundaries, optimizing re-renders, and configuring Vite/Next.js chunk splitting.
---

# 💻 ProofForge Frontend Architecture & Client Engineering Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `frontend` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `frontend`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `frontend`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/index.html`
  - `apps/web/app.js`
  - `packages/components/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
# 💻 ProofForge Frontend Architecture & Client Engineering Skill

## 1. الفلسفة المعمارية للواجهات (Client Architecture Doctrine)
* **عزل معالجة الأخطاء (Error Boundary Containment):** لا تسمح لخطأ في مكون فرعي بإسقاط التطبيق بالكامل؛ تغليف الشاشات الحيوية بـ `ErrorBoundary`.
* **تجزئة الحزم الذكية (Vite / Webpack Chunk Splitting):** تقسيم الحزم الضخمة بحيث لا تتجاوز أي حزمة مبنية حجم 200KB (Gzip < 60KB).
* **إدارة الحالة النظيفة:** حظر تمرير الخصائص العشوائي (Prop Drilling)؛ استخدام سياقات متخصصة أو Zustand/React Query لحالات الخادم.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير الأداء في [frontend_performance.md](./references/frontend_performance.md).
2. طالع نموذج الصفحة المتماسكة في [robust_frontend_page.md](./examples/robust_frontend_page.md).
3. شغّل فاحص الواجهات:
   ```bash
   node skills/frontend/scripts/verify_frontend.js
   ```

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/frontend/scripts/verify_frontend.js
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
