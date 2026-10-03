# سلم الخطوط والهرمية البصرية للنصوص
## Typographic Scale & Visual Hierarchy

---

## 1. سلم الخطوط المتناسق (Modular Type Scale)

يعتمد WebForge OS سلماً نسبياً متوازناً يستجيب لحجم الشاشة ويوفر هرمية دلالية واضحة:

| الدور الدلالي | الرمز (Token) | الحجم النموذجي (Desktop) | الحجم النموذجي (Mobile) | الوزن (Weight) | ارتفاع السطر (Line Height) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Heading** | `--text-display` | `2.5rem (40px)` | `2.0rem (32px)` | 700 / Bold | 1.15 |
| **Page Title (H1)** | `--text-h1` | `2.0rem (32px)` | `1.75rem (28px)` | 700 / Bold | 1.2 |
| **Section Title (H2)** | `--text-h2` | `1.5rem (24px)` | `1.375rem (22px)` | 600 / SemiBold | 1.25 |
| **Subsection (H3)** | `--text-h3` | `1.25rem (20px)` | `1.125rem (18px)` | 600 / SemiBold | 1.3 |
| **Card / Group (H4)** | `--text-h4` | `1.125rem (18px)` | `1.0rem (16px)` | 600 / SemiBold | 1.35 |
| **Body Text (Primary)**| `--text-body` | `1.0rem (16px)` | `0.9375rem (15px)` | 400 / Regular | 1.5 - 1.6 |
| **Body Text (Small)**  | `--text-body-sm` | `0.875rem (14px)` | `0.875rem (14px)` | 400 / Regular | 1.45 |
| **Caption / Metadata** | `--text-caption` | `0.75rem (12px)` | `0.75rem (12px)` | 500 / Medium | 1.35 |

---

## 2. قواعد تطبيق الهرمية البصرية (Hierarchy Rules)

1. **عنوان رئيسي واحد لكل صفحة (`<h1>`)**: استخدام وسم `<h1>` واحد فقط يمثل الهدف المركزي للصفحة.
2. **عدم تخطي مستويات العناوين**: التدرج المنطقي من `h1` إلى `h2` ثم `h3` دون القفز المباشر من `h1` إلى `h4` لأغراض المظهر البصري فقط.
3. **التمايز بالوزن واللون**: دعم تباين الهرمية باستخدام ألوان النصوص الدلالية (`--text-main` مقابل `--text-secondary` و `--text-muted`).
