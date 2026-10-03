# الإيقاع البصري والشبكات الفراغية
## Visual Rhythm & Spacing Grid Standards

---

## 1. الإيقاع الرأسي (Vertical Rhythm)

- يعتمد الإيقاع الرأسي على مقياس خطوة فراغية ثابتة (غالباً 8px أو مضاعفاتها).
- المسافات الرأسية بين الأقسام الرئيسية (`margin-block-end`) تكون متناسبة طردياً مع عمق الانفصال المعرفي بين الموضوعات (مثلاً `48px` بين الأقسام الكبرى، `24px` بين المجموعات الفرعية، و `8px` بين العنوان ونصه).

---

## 2. تخطيطات الشبكة المرنة (CSS Grid & Flexbox)

```css
/* شبكة متجاوبة تلقائية التوزيع دون Media Queries مفرطة */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-6, 1.5rem);
}
```
