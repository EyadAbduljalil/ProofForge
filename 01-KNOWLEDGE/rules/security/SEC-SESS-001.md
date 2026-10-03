---
id: "SEC-SESS-001"
title: "إدارة الجلسات الآمنة وتأمين ملفات تعريف الارتباط"
category: "security"
subcategory: "sessions"
severity: "HIGH"
applies_to:
  - "all"
  - "backend"
  - "auth"
tags:
  - "security"
  - "session"
  - "cookies"
  - "httpOnly"
cwe: "CWE-614"
status: "ACTIVE"
---

# SEC-SESS-001: إدارة الجلسات الآمنة وتأمين ملفات تعريف الارتباط

## 1. المتطلب الإلزامي (Requirement)
يجب تكوين ملفات تعريف الارتباط الخاصة بالجلسات والمصادقة بالسمات الإلزامية التالية: `HttpOnly` لمنع الوصول عبر JavaScript، و `Secure` لإلزام النقل عبر HTTPS فقط، و `SameSite=Lax` أو `SameSite=Strict` للحماية من CSRF. كما يجب تجديد معرّف الجلسة فور تسجيل الدخول لمنع تثبيت الجلسة (Session Fixation).

## 2. مبررات المتطلب والأثر الأمني/الهندسي (Rationale)
عدم ضبط هذه السمات يعرض الجلسة للسرقة عبر ثغرات XSS، أو التنصت الشبكي (Man-in-the-Middle)، أو التلاعب عبر المواقع الشقيقة.

## 3. الأنماط المعيبة (Bad Patterns)
```javascript
// غير آمن: غياب سمات الحماية
res.cookie('session_id', sessionId);
```

## 4. الأنماط السليمة المعتمدة (Good Patterns)
```javascript
res.cookie('session_id', sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 ساعة
});
```

## 5. آلية الفحص والتحقق الآلي (Validation Check)
- فحص استدعاءات ضبط الـ Cookies في طبقة التوجيه والمصادقة.

## 6. الدليل المطلوب للإثبات (Required Evidence)
- تقرير اختبار أمني يؤكد وجود ترويسات `Set-Cookie` مع السمات الثلاث `HttpOnly; Secure; SameSite`.

## 7. خطوات الإصلاح والمعالجة (Remediation)
1. تحديث إعدادات `express-session` أو وسيط الـ Cookies لفرض السمات.
2. تدمير الجلسة القديمة وإصدار معرّف جديد عند تسجيل الدخول والخروج.

## 8. الاستثناءات المسموحة (Allowed Exceptions)
ملفات الكوكيز غير الحساسة المخصصة لتفضيلات الواجهة في جانب العميل (مثل `theme_mode`).

## 9. المراجع والمعايير الدولية (References)
- OWASP Session Management Cheat Sheet
- CWE-614: Sensitive Cookie in HTTPS Session Without 'Secure' Attribute
