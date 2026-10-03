# حوكمة وضوابط توكنات التصميم
## Design Token Governance & Anti-Explosion Policy

---

## 1. سياسة منع انفجار التوكنات (Anti-Token-Explosion Policy)

تهدف هذه السياسة إلى منع التضخم العشوائي للمتغيرات وضمان قابلية صيانة نظام التصميم.

### القواعد الحاكمة:
1. **حظر التضمين المباشر (No Raw Hardcoding)**: يُمنع استخدام قيم Hex أو Pixel مباشرة في المكونات المكررة عندما يكون هناك توكن دلالي معتمد.
2. **منع التوكن الفردي غير المبرر (No Single-Use Tokens)**: لا يتم إنشاء توكن جديد لقيمة تُستخدم في موضع واحد فقط ما لم تكن تعبر عن مفهوم دلالي عام.
3. **تجنب التكرار والتسميات المتطابقة (No Duplicative Aliasing)**: عدم إنشاء توكنات مترادفة تشير إلى نفس القيمة بنفس المعنى (مثل `--color-main` و `--color-primary-base` و `--color-main-theme`).
4. **الحفاظ على المعنى الدلالي (Semantic Preservation)**: يجب أن يعكس اسم التوكن وظيفته وليس مظهره البصري المجرد (مثلاً `--color-danger` أفضل من `--color-red-dark`).

---

## 2. جدول حوكمة التوكنات المعتمدة (Canonical Token Governance)

| فئة التوكن | المستوى الدلالي | أمثلة التسمية القياسية | الغرض والاستخدام |
| :--- | :--- | :--- | :--- |
| **Color Surface** | Semantic | `--surface-base`, `--surface-raised`, `--surface-overlay` | ألوان خلفيات الواجهات والحاويات والطبقات |
| **Color Text** | Semantic | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse` | ألوان النصوص والقراءات حسب درجة الأهمية |
| **Color Interactive** | Semantic | `--interactive-default`, `--interactive-hover`, `--interactive-active` | ألوان العناصر التفاعلية والأزرار والروابط |
| **Color Feedback** | Semantic | `--feedback-success`, `--feedback-warning`, `--feedback-danger`, `--feedback-info` | ألوان رسائل النظام والتنبيهات وحالات التحقق |
| **Spacing** | Scale | `--space-1` (0.25rem), `--space-2` (0.5rem), `--space-4` (1rem), `--space-8` (2rem) | الهوامش الداخلية والخارجية والفواصل البينية |
| **Radii** | Semantic | `--radius-none`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full` | درجات انحناء الحواف للمكونات |
| **Elevation** | Semantic | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-overlay` | ظلال المكونات والعمق البصري |

---

## 3. آلية التتبع وتحديث السمات (Theme Switch Traceability)

عند التبديل بين السمات (مثل الوضع الفاتح والوضع الليلي)، يتم تبديل قيم التوكنات الدلالية (Semantic Tokens) دون الحاجة لتعديل المكونات أو فئات الـ CSS.
