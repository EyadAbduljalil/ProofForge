---
id: "SEC-INJ-002"
title: "منع ثغرات البرمجة عبر المواقع بتطهير المخرجات والتشفير الدلالي"
category: "security"
subcategory: "injection"
severity: "HIGH"
applies_to:
  - "all"
  - "frontend"
  - "ui"
tags:
  - "security"
  - "xss"
  - "sanitization"
  - "html"
cwe: "CWE-79"
status: "ACTIVE"
---

# SEC-INJ-002: منع ثغرات البرمجة عبر المواقع بتطهير المخرجات والتشفير الدلالي

## 1. المتطلب الإلزامي (Requirement)
يجب تشفير وتطهير (Sanitize / Context-Aware Output Encoding) كافة البيانات المسترجعة أو المعروضة في واجهات المستخدم ومستندات HTML. يُحظر حظراً تاماً استخدام `innerHTML`، `dangerouslySetInnerHTML`، أو `v-html` مع بيانات قادمة من مصادر خارجية أو مستخدمين دون تمريرها عبر مكتبة تطهير صارمة ومعتمدة (مثل DOMPurify).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
حقن الشيفرات النصية غير المطهرة يسمح بتنفيذ نصوص JavaScript خبيثة داخل متصفح الضحية (Cross-Site Scripting - XSS)، مما يمكن المهاجم من سرقة ملفات تعريف الارتباط والرموز السرية أو انتحال شخصية المستخدم.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// ثغرة XSS مباشرة
document.getElementById('user-comment').innerHTML = comment.text;
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
import DOMPurify from 'dompurify';

// الطريقة المفضلة: استخدام خاصية النص المجرد
element.textContent = comment.text;

// في حال الحاجة الإلزامية لتنسيق HTML:
element.innerHTML = DOMPurify.sanitize(comment.text);
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاءات `dangerouslySetInnerHTML` و `innerHTML` في كافة مكونات الواجهة وتأكيد وجود `DOMPurify`.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير فحص الكود يثبت حماية كافة عناصر العرض المباشر.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. استخدام `textContent` أو القوالب الآمنة افتراضياً.
2. تفعيل ترويسة سياسة أمان المحتوى الصارمة `Content-Security-Policy (CSP)`.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
لا توجد استثناءات لعرض مدخلات المستخدمين كـ HTML خام.

## 9. المراجع والمعايير الدولية (References)
- OWASP Cross Site Scripting Prevention Cheat Sheet
- CWE-79: Improper Neutralization of Input During Web Page Generation
