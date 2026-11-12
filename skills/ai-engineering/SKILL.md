---
name: ai-engineering
description: >-
  Lead AI Systems Engineer from ProofForge.
  Use when designing LLM integrations, tool calling schemas, agent workflows,
  structured JSON outputs, RAG architectures, prompt injection defenses,
  and automated AI integration tests.
---

# 🤖 ProofForge AI Systems & Agent Engineering Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي لأنظمة الذكاء الاصطناعي وهندسة الوكلاء ونماذج اللغة الكبيرة (LLMs) ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يختص بتكاملات نماذج الذكاء الاصطناعي، استدعاء الأدوات (Tool Calling)، حوكمة مدخلات ومخرجات الوكلاء، تأمين سياق RAG، ومنع هجمات حقن الموجهات (Prompt Injection).
* **معايير التفعيل (Activation Criteria):** يتم تفعيل هذه المهارة عند دمج نماذج الذكاء الاصطناعي، تعريف عقود استدعاء الأدوات للوكلاء، بناء خطوط RAG، أو اختبار مخرجات الذكاء الاصطناعي المهيكلة.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `packages/security/ai-security-guard.js`
  - `packages/contracts/tool-contract.js`
  - `packages/contracts/model-policy-contract.js`
  - `apps/server/server.js`
* **استكشاف البنية المعمارية:** التحقق من وجود قوائم سماح للأدوات (Tool Whitelist)، بوابات الموافقة البشرية على العمليات الحساسة، وفصل سياق المستأجر في مخازن المتجهات RAG.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
* **1. حوكمة استدعاء الأدوات (Tool Calling Governance):**
  - كل أداة يستدعيها الوكيل يجب أن تمتلك مخطط مدخلات صارم بصيغة JSON Schema مع التحقق المسبق من الأنواع.
  - حظر التنفيذ التلقائي للأدوات التدميرية (حذف قواعد البيانات، تنفيذ الأوامر في النظام) وفرض بوابة موافقة بشرية (Human-in-the-Loop).
* **2. الحماية ضد حقن الموجهات (Prompt Injection Defense):**
  - تطبيق الفحص الاستباقي عبر `AISecurityGuard.detectPromptInjection` على كافة مدخلات المستخدم والمستندات الخارجية غير الموثوقة.
  - عزل بيانات الـ RAG المسترجعة وتحديد وسم صريح لها كمحتوى غير موثوق لمنع هجمات الاستغلال غير المباشر (Indirect Prompt Injection).
* **3. المخرجات المهيكلة والحتمية (Deterministic Structured Outputs):**
  - إلزام النماذج بتوليد استجابات تتبع عقود ProofForge الكنسية وتمريرها عبر مدقق المخطط (Schema Validator).
  - حظر الاعتماد على مخرجات الذكاء الاصطناعي كدليل على صحة النظام (`AI Output !== Evidence`).

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/ai-engineering/scripts/verify_ai_engineering.js
```
* **معايير الاجتياز الحتمية:**
  - وجود حارس حوكمة الذكاء الاصطناعي (`ai-security-guard.js`).
  - التحقق من تفعيل كشف حقن الموجهات وقوائم سماح الأدوات.
  - خلو مسارات استدعاء النماذج من التمرير المباشر للمدخلات دون تطهير.
  - خروج السكريبت بكود صفري (`Exit Code 0`) عند ثبوت الضوابط وبكود 1 عند الخرق.

## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)
* **الأدلة المطلوبة لإثبات الإنجاز:**
  - تقرير فحص آلي مهيكل بصيغة JSON يؤكد اجتياز بوابات الدفاع ضد حقن الموجهات بنسبة 100%.
  - تسجيل كافة استدعاءات الأدوات في سجل تدقيق آمن (`AgentAuditRecorder`).
  - براهين الاختبارات الآلية التي تثبت رفض الموجهات العدائية.
