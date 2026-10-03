# WebForge OS — سجل المرشحين للإيداع بالأرشيف والتبسيط (Deprecation & Archive Candidates)

> **قاعدة الأمان الإلزامية**: لا يتم حذف أي كود برمجي أو وحدة أثناء هذه المهمة، بل يتم توثيق حالتها وتصنيفها تمهيداً لإعادة هيكلتها بنظام وتدرج.

---

### 1. قائمة المرشحين للأرشفة (Archive Candidates)

| المكون / الحزمة (Component) | المسار (Path) | سبب الترشيح للأرشفة (Reason for Archiving) | البديل المعياري المعتمد (Canonical Alternative) |
| :--- | :--- | :--- | :--- |
| **`packages/security-governance/`** | `packages/security-governance/` | حزمة مكررة وظائفياً مع `packages/orchestration/` و `packages/security/` تم دمج سياساتها بالكامل في `supply-chain-engine.js` و `engineering-memory.js`. | `packages/orchestration/` + `packages/security/` |
| **`prompt/reports/` (النسخ القديمة)**| `prompt/reports/` | نسخ تقارير تاريخية سابقة تم دمج نتائجها وتحديثها في السجل الرئيسي. | `reports/` المحدثة والمعتمدة |

---

### 2. قائمة المرشحين للتبسيط (Simplification Candidates)

| المكون (Component) | المسار (Path) | سبب التبسيط (Reason for Simplification) | الاتجاه المعماري للتبسيط (Simplification Direction) |
| :--- | :--- | :--- | :--- |
| **`IncidentIntelligence`** | `packages/orchestration/incident-intelligence.js` | تضخم كمنظومة تشغيل حية في الإنتاج، بينما دور WebForge هو توفير منهجية التحليل الجذري وقوالب Postmortem. | تبسيطه كفاحص معايير وقوالب تشخيصية موجهة للوكيل. |
| **`SafeRepairEngine`** | `packages/security/safe-repair-engine.js` | تعقيد محاكاة التراجع التلقائي بينما يكفي توفير إرشادات نقاط استعادة Git الآمنة كأداة مساعدة للوكيل. | الإبقاء عليه كـ Scoped Git Checkpoint utility خفيف. |

---

### 3. قائمة المرشحين للتحويل إلى قواعد ومعايير (Conversion Candidates)

| المكون (Component) | المسار (Path) | نوع التحويل (Target Format) | المعيار المستهدف (Target Rule/Standard) |
| :--- | :--- | :---: | :--- |
| **`Password Hashing`** | `packages/security/password.js` | `Rule + Validator` | `SEC-AUTH-001 (Scrypt Complexity & Side-Channel Defense)` |
| **`Ownership Guard`** | `packages/security/ownership-guard.js` | `Rule + Validator` | `SEC-AUTHZ-001 (Strict Multi-Tenant Isolation & Anti-IDOR)` |
| **`Idempotency Guard`** | `packages/security/idempotency-middleware.js` | `Rule + Validator` | `ENG-CONC-001 (Atomic Mutex & Idempotency Key Replay Gate)` |
| **`Token Manager`** | `packages/security/token-manager.js` | `Rule + Validator` | `SEC-AUTH-002 (JWT Lifecycle & Token Family Revocation)` |
| **`Rate Limiter`** | `packages/security/rate-limit.js` | `Rule + Validator` | `SEC-API-001 (Sliding-Window Rate Limiter & Abuse Prevention)` |
| **`CSRF Protection`** | `packages/security/csrf.js` | `Rule + Validator` | `SEC-SESS-001 (Double-Submit Cookie CSRF Defense)` |
| **`SSRF Guard`** | `packages/security/ssrf-guard.js` | `Rule + Validator` | `SEC-INJ-003 (Private IP & Cloud Metadata Blocking)` |
| **`File Security`** | `packages/security/file-security.js` | `Rule + Validator` | `SEC-INP-002 (Path Traversal & Zip Slip Boundary Guard)` |
| **`Webhook Verifier`** | `packages/security/webhook-verifier.js` | `Rule + Validator` | `SEC-API-002 (HMAC Timing-Safe Signature Verification)` |
| **`GraphQL Guard`** | `packages/security/graphql-security.js` | `Rule + Validator` | `SEC-API-003 (Query Depth & Complexity Boundary)` |
| **`Maturity Evaluator`**| `packages/maturity-benchmark/` | `Checklist` | `CHK-MATURITY-001 (L0 - L6 Engineering Maturity Checklist)` |
| **`Contracts Envelope`**| `packages/contracts/` | `Standard` | `STD-API-001 (Standard ApiResponse & AppError Envelope)` |
| **`Design Tokens`** | `packages/design-system/` | `Standard` | `STD-UI-001 (WebForge CSS Design Tokens & Themes)` |
| **`Accessible UI`** | `packages/components/` | `Reference` | `REF-A11Y-001 (Accessible Dialog, Table & Toast Reference)` |
| **`Infra Hardening`** | `packages/infrastructure/` | `Template` | `TMP-INFRA-001 (Non-Root Dockerfile & Secure Nginx Template)` |

---

### 4. المرشحون للحذف الصريح (Remove Candidates)
* **العدد الحالي**: **`0`**.
* **الموقف المعماري**: لا توجد ملفات مهملة تستدعي الحذف الفوري؛ جميع الوحدات تخدم إما فاحصات نشطة أو مراجع واختبارات قياسية.
