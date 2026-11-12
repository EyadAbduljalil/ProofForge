---
name: fullstack
description: >-
  Lead Full-Stack Integration Architect from ProofForge.
  Use when implementing end-to-end features connecting React frontend,
  Node/Express backend, database models, API contract synchronization,
  and end-to-end integration verification.
---

# 🌐 ProofForge Full-Stack Systems & End-to-End Integration Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد معماري لتكامل الأنظمة الشاملة (Full-Stack Architect) ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يختص بالربط الرأسي المتكامل بين واجهة المستخدم (Client UI)، الخادم الخلفي (Server API)، نماذج البيانات (Database Schema)، ومزامنة عقود النقل (DTO Contracts).
* **معايير التفعيل (Activation Criteria):** يتم تفعيل هذه المهارة عند تطوير ميزات كاملة من البداية إلى النهاية (End-to-End Features)، حل مشكلات التكامل بين العميل والخادم، أو إعداد تدفقات المصادقة والدفع الشاملة.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/web/app.js` (Client Integration Logic)
  - `apps/web/index.html` (Client UI DOM)
  - `apps/server/server.js` (API & Route Handlers)
  - `apps/server/db/storage-adapter.js` (Data Layer)
  - `packages/contracts/envelope.js` (Unified API Envelope)
  - `tests/e2e/server_app.test.js` (E2E Integration Suite)
* **استكشاف البنية المعمارية:** التأكد من تطابق أنواع البيانات المتبادلة بين العميل والخادم، استخدام ترويسات المصادقة الموحدة، وخلو المسار من أي افتراضات غير مؤكدة.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
* **1. مواءمة عقود الواجهة الخلفية والأمامية (Contract-First Alignment):**
  - استخدام التغليف المعياري `ApiResponse.success` و `ApiResponse.error` حصراً في كافة المسارات.
  - تعريف مسارات الإصدار الدلالي `/api/v1/` وضمان معالجة متسقة لرموز الحالة (200, 201, 400, 401, 403, 404, 429, 500).
* **2. تدفق المصادقة وعزل الجلسة (Auth & Session Flow):**
  - تبادل رموز JWT عبر ترويسة `Authorization: Bearer <token>` مع تخزين محلي آمن أو ملفات تعريف ارتباط `HttpOnly; Secure; SameSite=Strict`.
  - التحقق الإلزامي من سياق المستأجر (`tenantId`) على الخادم وقاعدة البيانات لمنع ثغرات IDOR.
* **3. المعاملات الحتمية وسلامة التكرار (Idempotency & Atomic Mutations):**
  - فرض مفتاح `Idempotency-Key` في كافة طلبات التعديل والإنشاء والشراء.
  - تغليف عمليات التعديل متعددة الجداول داخل معاملات ذرية `storage.transaction()`.

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/fullstack/scripts/verify_fullstack.js
```
* **معايير الاجتياز الحتمية:**
  - تكامل متصل بين العميل والخادم وقاعدة البيانات.
  - مطابقة مغلفات الاستجابة `ApiResponse` بين استدعاءات `fetch()` ومعالجات الخادم.
  - خروج السكريبت بكود صفري (`Exit Code 0`) عند ثبوت التكامل وبكود 1 عند الخلل.

## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)
* **الأدلة المطلوبة لإثبات الإنجاز:**
  - اجتياز اختبارات التكامل الحي `npm run test:e2e` بنسبة 100%.
  - سجل استجابة حقيقي من الخادم يثبت تطابق بنية البيانات والترويسات الأمنية.
