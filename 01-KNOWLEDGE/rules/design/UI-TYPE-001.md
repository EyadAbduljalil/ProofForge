---
id: "UI-TYPE-001"
title: "الاتساق الإلزامي لسلم الطباعة والخطوط الدلالية"
category: "design"
subcategory: "typography"
severity: "LOW"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "design"
  - "typography"
  - "hierarchy"
  - "fonts"
cwe: "N/A"
status: "ACTIVE"
---

# UI-TYPE-001: الاتساق الإلزامي لسلم الطباعة والخطوط الدلالية

## 1. المتطلب الإلزامي (Requirement)
يجب استخدام سلم الطباعة المعياري المحدد في منظومة التصميم (`STD-DESIGN-SYSTEM-001`) لكافة النصوص والعناوين والفقرات. يُحظر استخدام أحجام خطوط عشوائية (مثل `font-size: 17.5px`) دون ربطها بتوكنات النظام، مع الالتزام بالتراتبية الهرمية الدلالية (`H1` -> `H2` -> `H3` -> `Body`).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
العشوائية في أحجام الخطوط تؤدي إلى واجهات مستخدم مشتتة بصرياً وضعيفة الاحترافية وتضر بسهولة القراءة وتجربة المستخدم.

## 3. الأنماط المعيبة (Bad Patterns)
```css
/* أحجام عشوائية غير معيارية */
.card-header {
  font-size: 19px;
  line-height: 23px;
}
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```css
/* استخدام توكنات سلم الطباعة */
.card-header {
  font-size: var(--text-h3);
  line-height: var(--leading-tight);
  font-weight: var(--font-semibold);
}
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص ملفات CSS للتأكد من استخدام متغيرات الخطوط المعيارية.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير مراجعة الأنماط البصرية يثبت اتساق أحجام الخطوط.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استبدال قيم `font-size` الثابتة بمتغيرات CSS المعرفية.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
حالات العرض الفني التوضيحي الخاصة جداً (Hero Canvas Art).

## 9. المراجع والمعايير الدولية (References)
- WebForge Design System Standard (STD-DESIGN-SYSTEM-001)
