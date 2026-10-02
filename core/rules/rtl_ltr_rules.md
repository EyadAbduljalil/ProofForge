# قواعد دعم اللغات والاتجاهات (RTL / LTR System Rules)

## 1. الاعتماد الحصري على الخصائص المنطقية (CSS Logical Properties)
يُمنع استخدام الخصائص الفيزيائية الثابتة المرتبطة بالاتجاه، واستبدالها بالخصائص المنطقية الحديثة:

```css
/* ممنوع */
margin-left: 16px;
padding-right: 24px;
left: 0;
text-align: right;
border-left: 1px solid var(--border);

/* إلزامي */
margin-inline-start: 16px;
padding-inline-end: 24px;
inset-inline-start: 0;
text-align: start;
border-inline-start: 1px solid var(--border);
```

## 2. أيقونات الاتجاه والحركات
- عكس الأيقونات الاتجاهية تلقائياً (مثل أسهم التنقل `Chevron`, أزرار الرجوع `Back`, ومؤشرات المسار `Breadcrumbs`) عند التحويل إلى RTL.
- الحفاظ على الأيقونات المحايدة غير الاتجاهية (مثل أيقونة البحث، الترس، الإغلاق X) دون تغيير.
- فحص المحاذاة والتدفق الطباعي لكلا اللغتين العربية والإنجليزية بشكل مستقل ومنفصل.
