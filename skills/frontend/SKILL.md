---
name: frontend
description: >-
  Lead Frontend Architect from ProofForge.
  Use when designing client-side architecture, managing state (Context/Zustand/React Query),
  implementing error boundaries, optimizing re-renders, and configuring Vite/Next.js chunk splitting.
---

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
