---
name: design-system
description: >-
  Lead Design System Architect from ProofForge.
  Use when defining design tokens, color scales, typographic hierarchy,
  spacing systems (4px/8px rhythm), reusable component primitives,
  and enforcing consistent UI patterns across web applications.
---

# 📐 ProofForge Design System Architecture Skill

## 1. الفلسفة المعمارية لنظام التصميم (Design Token Governance)
نظام التصميم في ProofForge لا يقتصر على المظهر، بل هو **عقد هندسي صارم** يربط بين كود الواجهة وتجربة المستخدم:
* **حظر القيم الثابتة العشوائية (No Arbitrary Values):** يُمنع استخدام قيم مثل `text-[13px]` أو `p-[18px]` أو ألوان سداسية عشرية متناثرة كودياً بدون استخدام رموز التصميم الدلالية (Semantic Tokens).
* **إيقاع التباعد المنتظم (4px / 8px Grid Rhythm):** كافة المسافات والهوامش تتبع مقياس 4px/8px الهندسي (`p-2`, `p-4`, `p-6`, `p-8`).
* **الهرمية الطباعية (Typographic Hierarchy):** الالتزام بنسب التناسب التيبوغرافي من `text-xs` (12px) حتى `text-4xl` (36px).

---

## 2. مصفوفة الرموز الدلالية (Semantic Tokens)
* **الألوان الوظيفية (Role-Based Colors):**
  - `bg-background`: لون خلفية التطبيق الأساسية (Dark Obsidian `#090d16` / Light Pure `#ffffff`).
  - `text-foreground`: النص الرئيسي عالي التباين (Contrast >= 7:1).
  - `border-border`: خطوط الفصل الهادئة غير المشوشة.
  - `bg-primary` و `text-primary-foreground`: أزرار الإجراءات الأساسية (Primary Actions).
  - `destructive`: للعمليات الخطرة وحذف البيانات.

---

## 3. خطوات التشغيل والتحقق
1. راجع قاموس الرموز في [tokens_spec.md](./references/tokens_spec.md).
2. طالع نماذج المكونات في [component_tokens.md](./examples/component_tokens.md).
3. شغّل فاحص اتساق الرموز:
   ```bash
   node skills/design-system/scripts/verify_tokens.js
   ```
