# فهرس الأدلة البرمجية والتنفيذية — P0_FOUNDATION_EVIDENCE_INDEX.md
## WebForge OS — Phase 2: P0 Foundation Evidence Index

> **تاريخ الفهرسة**: 2026-10-02  
> **الهدف**: ربط كل ادعاء هندسي بدليله المادي في الشيفرة المصدرية والاختبارات المنفذة.

---

### جدول ربط الادعاءات بالأدلة (Claims-to-Evidence Matrix)

| البعد / القدرة (Dimension / Capability) | الادعاء الهندسي (Claim) | مصدر الدليل البرمجي (Source Code Evidence) | دليل الاختبار (Test Evidence) | الحالة (Status) |
| :--- | :--- | :--- | :--- | :---: |
| **Stack Detection** | كشف الـ Manifests وقفل التبعيات ومستويات الثقة | [packages/orchestration/stack-detector.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/stack-detector.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L112-L120) | `VERIFIED` |
| **Capability Model** | تمثيل 21 بعداً وفصل `NOT_APPLICABLE` و `ENVIRONMENT_LIMITATION` | [packages/orchestration/capability-model.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/capability-model.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L250-L260) | `VERIFIED` |
| **Evidence Graph** | تتبع مسارات الإثبات وتصدير JSON/Mermaid/DOT وتطهير الأسرار | [packages/orchestration/evidence-graph.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/evidence-graph.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L262-L274) | `VERIFIED` |
| **SARIF Normalizer** | تحويل مخرجات التحليل الساكن SARIF 2.1.0 للنموذج الداخلي | [packages/orchestration/tool-normalizer.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tool-normalizer.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L276-L300) | `VERIFIED` |
| **Supply Chain Posture**| فحص النسخ العائمة وتوليد CycloneDX SBOM والتحقق من Lockfiles | [packages/orchestration/supply-chain-engine.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/supply-chain-engine.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L176-L184) | `VERIFIED` |
| **Engineering Memory** | دمج سجل الديون والقرارات والحوادث الأمنية والأنماط التاريخية | [packages/orchestration/engineering-memory.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/engineering-memory.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L302-L315) | `VERIFIED` |
| **Safe Repair Engine** | نقاط استعادة Git المحكمة والتراجع غير التدميري وحظر العمليات الخطرة | [packages/security/safe-repair-engine.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/security/safe-repair-engine.js) | [packages/security/tests/security.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/security/tests/security.test.js#L111-L127) | `VERIFIED` |
| **Plugin Adapter Manager**| تسجيل المحولات وإدارة المحولات الاختيارية (مثل Redis) | [packages/orchestration/plugin-adapter-manager.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/plugin-adapter-manager.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L214-L230) | `VERIFIED` |
| **Multi-Stack Benchmark**| قياس دقة الكشف عبر نماذج مختلفة للغات وأطر العمل | [packages/orchestration/benchmark-framework.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/benchmark-framework.js) | [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L162-L167) | `VERIFIED` |

---

### جدول التحقق من متطلبات المرحلة الثانية

```text
Requirement               Status      Evidence Type
---------------------------------------------------------------------------------
StackDetector Hardening   VERIFIED    Code + Manifests Lockfiles Regex + Tests
CapabilityModel (21 dims) VERIFIED    Exported Class + States Distinction + Tests
EvidenceGraph Determinism VERIFIED    Deterministic Sort + Regex Sanitizer + Tests
SARIF 2.1.0 Support       VERIFIED    Parsed CodeQL Structure + Normalized Finding
SupplyChain & SBOM        VERIFIED    CycloneDX Spec 1.5 + Package Lock Check
Engineering/Security Debt VERIFIED    Unified Memory Map + Seeded Incident History
Git Rollback Safety       VERIFIED    execFileSync + Safe File Checkout + BLOCKED
Optional Redis Adapter    VERIFIED    PluginAdapterManager Contract + Optional Tag
Zero Regressions          VERIFIED    All Test Suites GREEN (npm test = 0)
```
