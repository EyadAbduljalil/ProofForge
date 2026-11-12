---
name: seo
description: >-
  Lead Technical SEO & Metadata Architect from ProofForge.
  Use when implementing semantic HTML5, Open Graph protocol, Twitter cards,
  JSON-LD structured data, XML sitemaps, robots.txt, and canonical URL tags.
---

# 🔍 ProofForge Technical SEO & Semantic Metadata Skill

## 1. مبادئ محركات البحث والبيانات المنظمة (Technical SEO Doctrine)
* **الهرمية الدلالية الصارمة (Semantic HTML5):** عنوان رئيسي وحيد `<h1>` لكل صفحة، مع تسلسل هرمي طبيعي (`<h2>`, `<h3>`) بدون القفز بين الرتب.
* **بروتوكول المشاركة الاجتماعية (Open Graph & Twitter):** توفير `og:title`, `og:description`, `og:image`, `og:url` لكل مسار عام.
* **البيانات المنظمة (JSON-LD):** تضمين مخططات Schema.org التوصيفية (`Organization`, `SoftwareApplication`, `Person`).

---

## 2. خطوات التشغيل والتحقق
1. راجع قائمة التحقق في [seo_checklist.md](./references/seo_checklist.md).
2. طالع نموذج وسوم الـ SEO في [seo_meta_tags.md](./examples/seo_meta_tags.md).
3. شغّل فاحص الـ SEO:
   ```bash
   node skills/seo/scripts/verify_seo.js
   ```
