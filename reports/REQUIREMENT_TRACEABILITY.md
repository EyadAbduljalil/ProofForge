# مصفوفة تتبع المتطلبات — WebForge OS Requirement Traceability Matrix (RTM)

## 1. ملخص التتبع الهندسي (Traceability Overview)
تربط هذه المصفوفة كل متطلب هندسي بالوحدة المسؤولة عن تنفيذه، والاختبار الآلي الذي يثبت صحته، ومستوى الدليل القاطع على تشغيله.

## 2. جدول تتبع المتطلبات إلى الاختبارات والأدلة (Requirement-to-Evidence Matrix)

| معرف المتطلب | نص المتطلب والمواصفة | الكود التنفيذي | كود الاختبار الآلي | حالة الدليل |
| :---: | :--- | :--- | :--- | :---: |
| **REQ-SEC-01** | عزل المستأجرين ومنع IDOR | `apps/server/db/storage-adapter.js` | `tests/e2e/server_app.test.js:L133` | ✅ **PASS** |
| **REQ-SEC-02** | تشفير وحماية كلمات المرور | `packages/security/password.js` | `packages/security/tests/security.test.js` | ✅ **PASS** |
| **REQ-SEC-03** | إدارة وتدوير الرموز الموقعة | `packages/security/token-manager.js` | `packages/security/tests/security.test.js` | ✅ **PASS** |
| **REQ-SEC-04** | حظر هجمات SSRF وعناوين الميتا | `packages/security/ssrf-guard.js` | `packages/security/tests/security_expansion.test.js` | ✅ **PASS** |
| **REQ-SEC-05** | حماية المسارات والملفات المضغوطة | `packages/security/file-security.js` | `packages/security/tests/security_expansion.test.js` | ✅ **PASS** |
| **REQ-SEC-06** | حراسة ذكاء الآلة وبوابات البشر | `packages/security/ai-security-guard.js` | `packages/security-governance/tests/governance.test.js` | ✅ **PASS** |
| **REQ-SEC-07** | عدم التكرار والدفع الذري | `apps/server/cache/redis-adapter.js` | `tests/e2e/server_app.test.js:L173` | ✅ **PASS** |
| **REQ-SEC-08** | حجب البيانات الحساسة بالسجلات | `packages/security/secrets.js` | `packages/security/tests/security.test.js` | ✅ **PASS** |
| **REQ-CORE-01**| خادم موحد يقدم واجهة كاملة | `apps/server/server.js` | `tests/e2e/server_app.test.js` | ✅ **PASS** |
| **REQ-CORE-02**| محرك آلات الحالة المنضبطة | `packages/state-machine/` | `packages/state-machine/tests/state_machine.test.js` | ✅ **PASS** |
| **REQ-CORE-03**| هندسة وتحليل المتطلبات والأفكار | `packages/idea-compiler/` | `packages/idea-compiler/tests/idea_compiler.test.js` | ✅ **PASS** |
| **REQ-CORE-04**| قياس نطاق التأثير الهندسي | `packages/engineering-graph/` | `packages/engineering-graph/tests/engineering_graph.test.js` | ✅ **PASS** |
| **REQ-A11Y-01**| سهولة الوصول ودعم قارئات الشاشة | `packages/components/` | `packages/components/tests/components.test.js` | ✅ **PASS** |
| **REQ-GOV-01** | دستور وحوكمة معايير النظام | `packages/orchestration/` | `packages/orchestration/tests/orchestration.test.js` | ✅ **PASS** |

---
**تاريخ التوليد**: 2026-10-02  
**محرك التتبع**: WebForge Traceability & Compliance Engine
