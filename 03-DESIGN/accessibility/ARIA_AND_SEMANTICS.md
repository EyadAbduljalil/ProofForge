# معايير استخدام ARIA وهيكلية HTML الدلالية
## ARIA Patterns & Semantic HTML Standards

---

## 1. القاعدة الذهبية لـ ARIA (First Rule of ARIA)

> **لا تستخدم ARIA إذا كان بإمكانك استخدام عنصر HTML دلالي أصيل يحقق نفس الوظيفة.**

استخدم `<button>` بدلاً من `<div role="button">`، واستخدم `<nav>` بدلاً من `<div role="navigation">`.

---

## 2. مصفوفة سمات ARIA الشائعة والاستخدام الصحيح

| السمة / الدور | الغرض والاستخدام | مثال الكود الصحيح |
| :--- | :--- | :--- |
| **`aria-label`** | توفير اسم نصي لقارئات الشاشة لعنصر يحتوي على أيقونة فقط. | `<button aria-label="إغلاق النافذة"><svg>...</svg></button>` |
| **`aria-labelledby`** | ربط العنصر بعنصر نصي مرئي آخر يمثل عنوانه. | `<section aria-labelledby="billing-heading">...` |
| **`aria-describedby`** | ربط الحقل بنص المساعدة أو رسالة الخطأ المرافقة. | `<input id="email" aria-describedby="email-error">` |
| **`aria-expanded`** | توضيح حالة القوائم واللوحات القابلة للطي (مفتوح/مغلق). | `<button aria-expanded="true" aria-controls="menu-1">` |
| **`aria-live="polite"`** | إخطار قارئات الشاشة بالتحديثات الديناميكية دون مقاطعة المستخدم. | `<div aria-live="polite" id="status-message">تم الحفظ بنجاح</div>` |
| **`aria-hidden="true"`** | إخفاء العناصر التزيينية البحتة عن البرامج المساعدة. | `<svg aria-hidden="true">...</svg>` |

---

## 3. المعالم الدلالية للصفحة (Landmark Roles)

يجب تقسيم الصفحة إلى معالم هيكلية واضحة:
- `<header role="banner">`: ترويسة الصفحة.
- `<nav role="navigation">`: الملاحة الرئيسية.
- `<main role="main">`: المحتوى المركزي الرئيسي.
- `<aside role="complementary">`: الشريط الجانبي والمعلومات الإضافية.
- `<footer role="contentinfo">`: تذييل الصفحة ومعلومات الحقوق.
