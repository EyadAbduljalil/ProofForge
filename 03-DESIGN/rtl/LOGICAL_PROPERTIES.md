# دليل استخدام الخصائص المنطقية في CSS
## CSS Logical Properties Migration & Reference Guide

---

## 1. جدول التحويل المعماري للخصائص المنطقية (Logical Mapping Table)

يجب استبدال الخصائص الفيزيائية القديمة بالخصائص المنطقية الحديثة لدعم RTL و LTR تلقائياً:

| الخاصية الفيزيائية القديمة (Physical - Legacy) | الخاصية المنطقية الحديثة (Logical - Canonical) | السلوك في RTL (Arabic) | السلوك في LTR (English) |
| :--- | :--- | :--- | :--- |
| `margin-left` | **`margin-inline-start`** | هامش من جهة اليمين | هامش من جهة اليسار |
| `margin-right` | **`margin-inline-end`** | هامش من جهة اليسار | هامش من جهة اليمين |
| `padding-left` | **`padding-inline-start`** | حشوة من جهة اليمين | حشوة من جهة اليسار |
| `padding-right` | **`padding-inline-end`** | حشوة من جهة اليسار | حشوة من جهة اليمين |
| `border-left` | **`border-inline-start`** | إطار من جهة اليمين | إطار من جهة اليسار |
| `border-right` | **`border-inline-end`** | إطار من جهة اليسار | إطار من جهة اليمين |
| `text-align: left` | **`text-align: start`** | محاذاة لليمين | محاذاة لليسار |
| `text-align: right` | **`text-align: end`** | محاذاة لليسار | محاذاة لليمين |
| `left: 0` | **`inset-inline-start: 0`** | التصاق باليمين | التصاق باليسار |
| `right: 0` | **`inset-inline-end: 0`** | التصاق باليسار | التصاق باليمين |
| `float: left` | **`float: inline-start`** | طفو لليمين | طفو لليسار |

---

## 2. مثال كود تطبيقي للمكونات ثنائية الاتجاه

```css
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-3);
  padding-inline: var(--space-4);
  border-block-end: 1px solid var(--border-subtle);
}

.icon-badge {
  margin-inline-end: var(--space-2);
}
```
