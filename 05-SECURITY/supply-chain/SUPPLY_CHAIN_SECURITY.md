# أمان سلسلة التوريد البرمجية والنزاهة (Supply Chain Security & Integrity)

## 1. حماية البناء والنشر التلقائي (CI/CD Pipeline Security)
- **مبدأ الصلاحيات الدنيا للـ Runners**:
  - تشغيل مهام البناء والاختبار في بيئات حاويات مؤقتة معزولة تُحذف فور الانتهاء (Ephemeral Runners).
  - حظر تمرير أسرار النشر والإنتاج إلى مهام بناء الفروع التجريبية أو طلبات السحب الخارجية (Pull Requests from Forks).
- **التحقق من نزاهة التوزيعات (Software Artifact Signing & Provenance)**:
  - توقيع حزم التوزيع رقمياً وتوليد سجلات البناء المشفرة (مثل معايير SLSA و Sigstore/Cosign).
  - استخدام ملفات قائمة المكونات البرمجية (Software Bill of Materials - SBOM) بصيغة CycloneDX أو SPDX.

---

## 2. إدارة المستودعات والتبعيات الخارجية
- **قفل الإصدارات بدقة (Strict Lockfiles)**:
  - الاعتماد الإلزامي على ملفات القفل (`package-lock.json`, `pnpm-lock.yaml`, `Pipfile.lock`, `Cargo.lock`, `go.sum`).
  - التحقق من بصمات التجزئة التشفيرية (Integrity Hashes) لكل حزمة أثناء التثبيت في مسارات النشر.
- **الحماية من هجمات الخلط والتشابه (Dependency Confusion & Typosquatting)**:
  - تكوين مديري الحزم لاستخدام سجلات الحزم الخاصة بالمؤسسة (Private Scoped Registries) أولاً.
  - فحص أسماء الحزم المضافة للتأكد من عدم تطابقها مع أسماء مشاريع شائعة بأخطاء إملائية طفيفة.
