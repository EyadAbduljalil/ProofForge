# دليل نظام التصميم والرموز البرمجية (Design System Guide)

## 1. متغيرات CSS المعتمدة
```css
:root {
  --font-sans: 'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}
```

## 2. قواعد المكونات والتفاعل
- الأزرار: حالات التفاعل (Hover, Active, Focus-visible, Disabled, Loading).
- الحقول: تسميات واضحة، رسائل خطأ محاذاة، وتلميحات دقيقة.
