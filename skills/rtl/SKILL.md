---
name: rtl
description: >-
  Lead RTL & Bidirectional Localization Specialist from ProofForge.
  Use when implementing Arabic/Hebrew RTL layouts, internationalization (i18n),
  logical CSS properties (ms-, me-, start, end), icon directional mirroring,
  and ensuring complete visual and functional parity between RTL and LTR.
---

# 🌍 ProofForge RTL & Bidirectional Layout Skill

## 1. مبدأ التماثل ثنائي الاتجاه (BiDi Parity Mandate)
الواجهات العربية والشرقية لا تعامل كترجمة نصية ثانوية؛ بل تخضع لـ **التماثل المعماري الكامل (Full Architectural Parity)**:
* **استخدام الخصائص المنطقية حصراً (CSS Logical Properties):**
  - استبدال `ml-*` و `mr-*` بـ `ms-*` (Margin-Inline-Start) و `me-*` (Margin-Inline-End).
  - استبدال `pl-*` و `pr-*` بـ `ps-*` و `pe-*`.
  - استبدال `left-*` و `right-*` بـ `start-*` و `end-*`.
  - استبدال `text-left` و `text-right` بـ `text-start` و `text-end`.
* **انعكاس الأيقونات الاتجاهية (Directional Icon Mirroring):**
  - أسهم التنقل والرجوع (`ChevronLeft`, `ArrowRight`) يجب أن تنعكس تلقائياً في نمط RTL (`rtl:rotate-180`).
  - الرموز الحيادية (مثل علامة الصح، الإعدادات، القفل) تظل كما هي دون تدوير.

---

## 2. قواعد الخطوط العربية وتجربة القراءة
1. **الخط العربي:** استخدام خطوط عربية حديثة واضحة ومقروءة (مثل `IBM Plex Sans Arabic`, `Cairo`, `Geist Arabic`).
2. **ارتفاع السطر (Line-Height):** النصوص العربية تحتاج بطبيعتها إلى ارتفاع سطر أكبر بنسبة 15-20% مقارنة بالإنجليزية لمنع تداخل التشكيل والنقاط (`leading-relaxed` للفقرات العربية).

---

## 3. خطوات التشغيل والتحقق
1. راجع معايير الخصائص المنطقية في [bidi_spec.md](./references/bidi_spec.md).
2. طالع نماذج التخطيط ثنائي اللغة في [rtl_clean_layout.md](./examples/rtl_clean_layout.md).
3. شغّل فاحص الخصائص الفيزيائية الممنوعة:
   ```bash
   node skills/rtl/scripts/verify_rtl.js
   ```
