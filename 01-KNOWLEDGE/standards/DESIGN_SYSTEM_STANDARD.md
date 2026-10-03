# معيار منظومة التصميم المعمارية (Design System Standard)

## المعرّف: `STD-DESIGN-SYSTEM-001`
## الحالة: `ACTIVE`
## النطاق: واجهات المستخدم (UI/UX) والتطبيقات الأمامية

---

## 1. الغرض والمبادئ التوجيهية
تحديد ركائز الجودة البصرية والهندسية لمنظومات التصميم التابعة لنظام WebForge OS، ومنع توليد التصاميم العشوائية أو الركيكة (Anti-AI-Slop)، وضمان الاتساق الجمالي والوظيفي عبر كافة الشاشات والأنظمة.

---

## 2. مصفوفة توكنات التصميم (Design Tokens Matrix)

### 2.1 لوحات الألوان الدلالية (Semantic Color Palette)
يجب استخدام متغيرات CSS أو كائنات التوكنات لتعريف الألوان دلالياً دون استخدام قيم ألوان عشوائية أو ثابتة:

```css
:root {
  /* درجات الألوان الأساسية والمحايدة */
  --color-surface-primary: #0f172a;
  --color-surface-secondary: #1e293b;
  --color-surface-tertiary: #334155;
  
  /* التباين والنصوص */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;

  /* الحالات الدلالية */
  --color-brand-primary: #3b82f6;
  --color-brand-hover: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #06b6d4;

  /* الحدود والظلال */
  --color-border-subtle: rgba(255, 255, 255, 0.1);
  --color-border-strong: rgba(255, 255, 255, 0.2);
}
```

### 2.2 مصفوفة التباعد والمحاذاة (Spacing & Layout Grid)
تعتمد المنظومة نظام التباعد المضاعف القائم على شبكة 4px / 8px:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px

---

## 3. معايير الخطوط والطباعة (Typography Hierarchy)
1. **مقياس الطباعة (Type Scale)**:
   - العناوين الرئيسية `H1`: 2.25rem (36px) / Line-height: 1.25 / Font-weight: 700
   - العناوين الفرعية `H2`: 1.875rem (30px) / Line-height: 1.3 / Font-weight: 600
   - العناوين القسمية `H3`: 1.5rem (24px) / Line-height: 1.35 / Font-weight: 600
   - النص الأساسي `Body`: 1.0rem (16px) / Line-height: 1.5 / Font-weight: 400
   - الملاحظات والنصوص المساعدة `Caption`: 0.875rem (14px) / Line-height: 1.4 / Font-weight: 400
2. **توافق الخطوط للغات المتعددة**:
   - دعم الخطوط الحديثة مع دعم كامل للنصوص العربية (مثل `IBM Plex Sans Arabic`, `Cairo`, `Inter`).

---

## 4. ضوابط إمكانية الوصول والتفاعل (Accessibility & Interaction)
1. **نسبة تباين الألوان (Color Contrast)**:
   - الالتزام الصارم بمعيار WCAG 2.2 AA (حد أدنى لنسبة التباين 4.5:1 للنصوص العادية و 3:1 للنصوص الكبيرة وعناصر التحكم).
2. **مؤشرات التركيز البصري (Focus Indicators)**:
   - يجب توفير حلقة تركيز واضحة ومرئية (`outline` أو `ring`) لا تقل عن 2px لكافة العناصر القابلة للتفاعل عند استخدام لوحة المفاتيح.
3. **دعم سمات العرض (Dark / Light Modes)**:
   - دعم كامل للتبديل السلس بين الوضعين الداكن والفاتح دون أي تشويه بصري أو كسر في التباين.
