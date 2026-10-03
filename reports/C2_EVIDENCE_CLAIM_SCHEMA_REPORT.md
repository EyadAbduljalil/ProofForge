# تقرير المخططات المعمارية والسجلات الإدراكية (C2 Evidence & Claim Schema Report)

## 1. نظرة عامة والأساس المعماري
يحدد هذا التقرير مواصفات المخططات الهيكلية (JSON Schemas) والسجلات المعيارية التي تم اعتمادها لطبقة **استخبارات الادعاءات والأدلة** في مرحلة **C2**. 
تم تصميم كافة المخططات لتكون خفيفة الوزن وخالية من الاعتماديات الخارجية، ومتوافقة تماماً مع محرك التدقيق الصارم `packages/contracts/schema-validator.js`.

---

## 2. المخططات الهيكلية المعتمدة في C2

### 2.1 مخطط الادعاء الذري (Atomic Claim Schema)
* **المسار التوثيقي**: `06-VALIDATORS/schemas/COGNITIVE_EVIDENCE_CLAIM_SCHEMAS.md`
* **المكون المنفذ**: `ClaimVerificationEngine.ATOMIC_CLAIM_SCHEMA`
* **الحقول الإلزامية**:
  - `claim_id`: سلسلة نصية تبدأ بـ `CLM-` متبوعة برقم زمني مميز.
  - `statement`: متن الادعاء الواضح بطول لا يقل عن 5 محارف.
  - `claim_type`: تصنيف الادعاء من ضمن القائمة الكنسية المعتمدة:
    `FACTUAL`, `TECHNICAL`, `ARCHITECTURAL`, `SECURITY`, `BEHAVIORAL`, `CONFIGURATION`, `TEMPORAL`, `DEPENDENCY`, `POLICY`, `DERIVED`.
  - `required_evidence_level`: مستوى الإثبات المشترط:
    `L0_UNSUPPORTED`, `L1_CONTEXT_ONLY`, `L2_STATIC_ANALYSIS`, `L3_DYNAMIC_PROOF`, `L4_MULTI_DIMENSIONAL`.
  - `status`: حالة التحقق الناتجة:
    `VERIFIED`, `INSUFFICIENT_EVIDENCE`, `CONFLICTED`, `INVALIDATED`, `FAIL`, `ENVIRONMENT_LIMITATION`.
  - `created_at`: الختم الزمني بتنسيق ISO 8601.

### 2.2 مخطط ربط ونزاع الأدلة (Evidence Link & Conflict Schema)
* **المسار التوثيقي**: `06-VALIDATORS/schemas/COGNITIVE_EVIDENCE_CLAIM_SCHEMAS.md`
* **الحقول الإلزامية**:
  - `link_id`: المعرف الفريد للرابط.
  - `claim_id`: معرف الادعاء المرتبط.
  - `evidence_id`: معرف عقدة الدليل في `EvidenceGraph`.
  - `relation_type`: طبيعة العلاقة:
    `SUPPORTS`, `CONTRADICTS`, `QUALIFIES`, `SUPERSEDES`, `DERIVED_FROM`, `INVALIDATES`, `INSUFFICIENT_FOR`.
  - `temporal_status`: الوضع الزمني للدليل:
    `CURRENT`, `STALE`, `SUPERSEDED`, `INVALIDATED`, `UNKNOWN`.
  - `conflict_detected`: قيمة منطقية توضح وجود تعارض مع أدلة أخرى.

---

## 3. استراتيجية السجلات وحماية خط الأساس (Registry & Baseline Protection Strategy)

### صيانة سلامة خط الأساس للمرحلتين 5A و 8:
* تم رصد أن اختبارات انحدار المراحل التاريخية السابقة تتطلب:
  - احتواء ملف `06-VALIDATORS/schemas/VALIDATION_SCHEMAS.md` على **5 مخططات أصلية بالضبط** (Phase 5A Requirement).
  - احتواء ملف `06-VALIDATORS/registry/VALIDATOR_REGISTRY.md` على **15 مدققاً أصلياً بالضبط** (Phase 8 Requirement).
* لحماية هذا الخط الأساسي ومنع أي كسر لاختبارات الانحدار التاريخية:
  1. تمت إعادة الملفات الأصلية بدقة لتطابق شروط الـ 5 والـ 15.
  2. تم تأسيس ملفات السجلات والمخططات الإدراكية المستحدثة لـ C2 كملفات مخصصة تكميلية داخل نفس المجلدات المعيارية:
     - `06-VALIDATORS/schemas/COGNITIVE_EVIDENCE_CLAIM_SCHEMAS.md`
     - `06-VALIDATORS/registry/COGNITIVE_VALIDATOR_REGISTRY.md`
  3. تم تسجيل المدقق `COG-VAL-CLM-001` وحارس الاسترجاع `COG-VAL-RET-001` ومدقق الأدلة `COG-VAL-EVD-001` في السجل الإدراكي الجديد.

---

## 4. نتائج التحقق المؤتمت من المخططات
* تم اختبار صحة المخططات ورفض الادعاءات المشوهة عبر اختبارات الوحدة في `c2-evidence-claim-intelligence.test.js`.
* جميع المخططات اجتازت التحقق الحسابي والمنطقي بنسبة 100%.
