---
id: "PERF-DEBOUNCE-001"
title: "كبح وتأخير معالجة الأحداث عالية التكرار لمنع تجميد واجهة المستخدم"
category: "performance"
subcategory: "runtime"
severity: "MEDIUM"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "performance"
  - "debounce"
  - "throttle"
  - "events"
cwe: "N/A"
status: "ACTIVE"
---

# PERF-DEBOUNCE-001: كبح وتأخير معالجة الأحداث عالية التكرار لمنع تجميد واجهة المستخدم

## 1. المتطلب الإلزامي (Requirement)
يجب تطبيق تقنيات الإرجاء والتأخير (Debouncing) أو الكبح الدوري (Throttling) على كافة معالجات الأحداث عالية التكرار (مثل `scroll`, `resize`, `input`, `mousemove`) وعمليات البحث التلقائي أثناء الكتابة (Autocomplete/Search-as-you-type) بفترة زمنية تتراوح بين 150ms إلى 300ms لمنع إغراق الخادم بالطلبات أو تجميد الخيط الرئيسي للمتصفح.

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
تنفيذ عمليات الحساب الثقيلة أو إرسال طلبات HTTP مع كل نقرة زر كيبورد أو بكسل تمرير يؤدي إلى هبوط معدل الإطارات (Frame Drops) وبطء شديد في استجابة الصفحة وإجهاد الخوادم.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// إرسال طلب HTTP مع كل حرف يُكتب فوراً
inputElement.addEventListener('input', (e) => {
  fetchSearchResults(e.target.value);
});
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
function debounce(fn, delay = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

inputElement.addEventListener('input', debounce((e) => {
  fetchSearchResults(e.target.value);
}, 250));
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص مستمعات أحداث `input` و `scroll` في المكونات والتأكد من تغليفها بدوال `debounce`/`throttle`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار الأداء يثبت تقليل عدد الطلبات المرسلة أثناء الكتابة السريعة.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تغليف معالجات الأحداث بدوال debounce أو استخدام React Hooks مثل `useDebounce`.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
الألعاب ومحركات الرسوميات المعتمدة على `requestAnimationFrame`.

## 9. المراجع والمعايير الدولية (References)
- MDN: Debouncing and Throttling Explained
