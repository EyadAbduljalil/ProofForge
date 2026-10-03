# WebForge OS — خريطة الانتقال من الشيفرة إلى المعرفة
## Code to Knowledge Migration Map

> **المبدأ المعماري**: نقل المعايير والضوابط من منطق تشغيلي مشتت إلى قواعد ومعايير وفاحصات معيارية مصنفة بدقة دون كسر الاختبارات أو حذف الأنظمة القائمة.

---

### 1. مصفوفة تحويل الأنظمة والمكونات (Subsystems Migration Mapping)

| المكون الحالي (Current Subsystem) | المسار الحالي (Current Path) | التصنيف (Classification) | الموقع المعياري المستقبلي (Target Location) | التحويل المطلوب (Migration Required) | الأولوية (Priority) |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **`StackDetector`** | `packages/orchestration/stack-detector.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/stack-detector/` | إبقاء الفاحص مع ربطه بالقواعد المتكيفة. | **`P0`** |
| **`CapabilityModel`** | `packages/orchestration/capability-model.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/capability-model/` | إبقاء نموذج القدرات الـ 21 كمعيار تقييم. | **`P0`** |
| **`CodeIntelligence`** | `packages/orchestration/code-intelligence.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/code-intelligence/` | توسيع محولات الصياغة (Parser Adapters). | **`P1`** |
| **`FindingVerifier`** | `packages/orchestration/finding-verifier.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/finding-verifier/` | ربطه بمحرك فحص القواعد المستقل. | **`P0`** |
| **`EvidenceGraph`** | `packages/orchestration/evidence-graph.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/evidence-graph/` | المحافظة على مسار تتبع الأدلة والادعاءات. | **`P0`** |
| **`ToolNormalizer`** | `packages/orchestration/tool-normalizer.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/tool-normalizer/` | تطبيع SARIF الموحد لجميع الفاحصات. | **`P1`** |
| **`ProductionReadiness`**| `packages/orchestration/production-readiness.js` | `KEEP_VALIDATOR` | `06-VALIDATORS/readiness-eval/` | تقييم الأبعاد الـ 21 استناداً للأدلة. | **`P1`** |
| **`AuthorityHierarchy`** | `packages/orchestration/authority-hierarchy.js` | `KEEP_AI_WORKFLOW` | `02-AI-INSTRUCTIONS/decision-rules/` | مصفوفة حسم النزاعات وأولوية P0 Security. | **`P0`** |
| **`RuleConflictEngine`** | `packages/orchestration/rule-conflict-engine.js` | `KEEP_AI_WORKFLOW` | `02-AI-INSTRUCTIONS/decision-rules/` | التحكيم الحتمي بين القواعد المتعارضة. | **`P1`** |
| **`EngineeringMemory`** | `packages/orchestration/engineering-memory.js` | `KEEP_CORE` | `01-KNOWLEDGE/memory/` | دمج سجلات الديون الأمنية والأخطاء السابقة. | **`P0`** |
| **`AgentAuditRecorder`** | `packages/orchestration/agent-audit-recorder.js` | `KEEP_CORE` | `02-AI-INSTRUCTIONS/audit/` | توثيق الفروقات وحجب الأسرار وتصنيف المخاطر. | **`P1`** |
| **`TaskReplanner`** | `packages/orchestration/task-replanner.js` | `KEEP_AI_WORKFLOW` | `02-AI-INSTRUCTIONS/workflows/` | استراتيجيات إعادة التخطيط وحماية الحلقات. | **`P1`** |
| **`FailureScenarioLibrary`**| `packages/orchestration/failure-scenario-library.js`| `KEEP_VALIDATOR` | `06-VALIDATORS/chaos/` | كتالوج سيناريوهات الفشل المعيارية. | **`P2`** |
| **`PluginAdapterManager`** | `packages/orchestration/plugin-adapter-manager.js` | `OPTIONAL` | `07-STACK-ADAPTERS/manager/` | معمارية المحولات الاختيارية الخارجية. | **`P2`** |
| **`IncidentIntelligence`** | `packages/orchestration/incident-intelligence.js` | `SIMPLIFY` | `01-KNOWLEDGE/incidents/` | تحويله لقوالب Postmortem وإرشادات تشخيص. | **`P2`** |
| **`SafeRepairEngine`** | `packages/security/safe-repair-engine.js` | `SIMPLIFY` | `02-AI-INSTRUCTIONS/rollback/` | تبسيطه كأداة نقاط استعادة Git مساعدة. | **`P2`** |
| **`AgentPermissionBoundary`**| `packages/security/agent-permission-boundary.js`| `KEEP_CORE` | `02-AI-INSTRUCTIONS/permissions/` | بوابات الصلاحيات وحظر العمليات التدميرية. | **`P0`** |
| **`UntrustedRepoGuard`** | `packages/security/untrusted-repo-guard.js` | `KEEP_CORE` | `05-SECURITY/untrusted-content/` | حماية من Prompt Injection والملفات الخبيثة. | **`P0`** |
| **`Password Security`** | `packages/security/password.js` | `CONVERT_TO_RULE` | `05-SECURITY/authentication/SEC-AUTH-001` | صياغة قاعدة Scrypt مع فاحص آلي. | **`P1`** |
| **`Ownership & Anti-IDOR`**| `packages/security/ownership-guard.js` | `CONVERT_TO_RULE` | `05-SECURITY/authorization/SEC-AUTHZ-001` | صياغة قاعدة عزل المستأجرين مع فاحص. | **`P1`** |
| **`Idempotency Guard`** | `packages/security/idempotency-middleware.js`| `CONVERT_TO_RULE` | `04-ENGINEERING/concurrency/ENG-CONC-001` | صياغة قاعدة العمليات الذرية والمفاتيح. | **`P1`** |
| **`Token Manager (JWT)`** | `packages/security/token-manager.js` | `CONVERT_TO_RULE` | `05-SECURITY/authentication/SEC-AUTH-002` | صياغة قاعدة تدوير الرموز والإلغاء. | **`P1`** |
| **`Rate Limiter`** | `packages/security/rate-limit.js` | `CONVERT_TO_RULE` | `05-SECURITY/api-security/SEC-API-001` | صياغة قاعدة النوافذ المنزلقة للحد من الطلبات. | **`P1`** |
| **`CSRF Protection`** | `packages/security/csrf.js` | `CONVERT_TO_RULE` | `05-SECURITY/session-security/SEC-SESS-001`| صياغة قاعدة Double-Submit Cookie. | **`P1`** |
| **`SSRF Guard`** | `packages/security/ssrf-guard.js` | `CONVERT_TO_RULE` | `05-SECURITY/injection/SEC-INJ-003` | صياغة قاعدة حظر العناوين الخاصة و Metadata. | **`P1`** |
| **`File Security`** | `packages/security/file-security.js` | `CONVERT_TO_RULE` | `05-SECURITY/input-validation/SEC-INP-002`| صياغة قاعدة منع Path Traversal و Zip Slip. | **`P1`** |
| **`Webhook HMAC Guard`**| `packages/security/webhook-verifier.js` | `CONVERT_TO_RULE` | `05-SECURITY/api-security/SEC-API-002` | صياغة قاعدة التوقيع الثابت التوقيت. | **`P1`** |
| **`GraphQL Guard`** | `packages/security/graphql-security.js` | `CONVERT_TO_RULE` | `05-SECURITY/api-security/SEC-API-003` | صياغة قاعدة تقييد عمق وتعقيد الاستعلامات. | **`P2`** |
| **`Security Governance`** | `packages/security-governance/*.js` | `ARCHIVE_CANDIDATE`| `archive/security-governance/` | دمج الوظائف المكررة وأرشفة الحزمة. | **`P2`** |
| **`IdeaCompiler`** | `packages/idea-compiler/` | `EXPERIMENTAL` | `02-AI-INSTRUCTIONS/idea-compiler/` | تحويله لأداة هندسة متطلبات اختيارية. | **`P3`** |
| **`Contracts & DTOs`** | `packages/contracts/` | `CONVERT_TO_STANDARD`| `01-KNOWLEDGE/standards/contracts/` | توثيق مغلفات الاستجابة والاستثناءات. | **`P1`** |
| **`Design System Tokens`** | `packages/design-system/` | `CONVERT_TO_STANDARD`| `03-DESIGN/design-system/` | توكنات CSS للألوان والطباعة والتجاوب. | **`P1`** |
| **`Accessible Components`**| `packages/components/` | `CONVERT_TO_REFERENCE`| `03-DESIGN/accessibility/examples/` | نماذج مرجعية لمكونات WCAG 2.2 AA. | **`P2`** |
| **`Infrastructure Hardening`**| `packages/infrastructure/`| `CONVERT_TO_TEMPLATE`| `08-TEMPLATES/infra/` | قوالب Dockerfile و Nginx المحصنة. | **`P2`** |
| **`Prompt Adapters`** | `adapters/` | `KEEP_AI_WORKFLOW` | `02-AI-INSTRUCTIONS/adapters/` | قواعد وموجهات الوكلاء الخارجية. | **`P1`** |
| **`Domain Blueprints`** | `domains/` | `CONVERT_TO_TEMPLATE`| `08-TEMPLATES/domains/` | مخططات وقوالب النطاقات المتخصصة. | **`P2`** |

---

### 2. خطة التنفيذ المتدرجة للمرحلة القادمة (Gradual Migration Execution Plan)
1. **المحافظة التامة على المسارات القائمة** لتفادي كسر أي اختبارات (`npm test` يظل أخضر 100%).
2. **صياغة ملفات القواعد المعيارية (Markdown Rule Schema)** لكل ضابط أمني وتصميمي في `01-KNOWLEDGE/rules/`.
3. **ربط الفاحصات (Validators)** بالقواعد المعيارية لتوليد تقارير الامتثال تلقائياً.
4. **أرشفة الوحدات المكررة** بعد التأكد من اكتمال دمجها التام.
