# دليل دعم تفضيل تقليل الحركة (Reduced Motion)
## Prefers-Reduced-Motion Specification & Implementation

---

## 1. الإلزامية المعمارية لدعم تقليل الحركة (Accessibility Requirement)

يعاني بعض المستخدمين من اضطرابات الجهاز الدهليزي (Vestibular Disorders) أو الدوار الحركي الناتج عن الرسوم المتحركة والاهتزازات والانتقالات المفاجئة.

يلزم WebForge OS احترام تفضيل نظام التشغيل `prefers-reduced-motion` بشكل صارم:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 2. البديل الهادئ للرسوم الحركية (Graceful Fallback)

بدلاً من تحريك العناصر من مسافات بعيدة أو استخدام التكبير والتصغير (Scaling/Zooming)، يتم استبدال الحركة بتلاشٍ بصري فوري ورقيق للشفافية (`opacity: 0 -> 1`) لضمان وضوح الحالة دون إزعاج دهليزي.
