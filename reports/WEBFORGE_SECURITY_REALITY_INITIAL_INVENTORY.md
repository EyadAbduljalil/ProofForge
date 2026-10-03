# فهرس الحصر الأولي لمكونات الأمان والحراسة في WebForge OS
# WEBFORGE SECURITY REALITY INITIAL INVENTORY

- **الإصدار المعماري:** WebForge Security Reality Audit
- **الحالة:** مكتمل وموثق بالأدلة (AUDITED & INVENTORIED)
- **النطاق:** حزم الأمان، المدققات، المخططات، القواعد، الحراس، والاختبارات في V1 و V2.

---

## 1. فهرس مكونات وحراس الأمان الأساسية (`packages/security/`)

| اسم المكون البرمجي | المسار الفعلي | الوظيفة الأمنية والهدف | المستدعون والمستهلكون (Callers) |
|---|---|---|---|
| **OwnershipGuard** | `packages/security/ownership-guard.js` | التحقق من ملكية الموارد وعزل المستأجرين لمنع IDOR / BOLA | `tests/smoke/`, `packages/security/tests/`, `server.js` |
| **RateLimiter** | `packages/security/rate-limit.js` | تحديد معدل الطلبات بالنافذة المنزلقة وحماية الذاكرة | `packages/security/tests/`, `server.js` |
| **AISecurityGuard** | `packages/security/ai-security-guard.js` | كشف حقن التوجيه، وحوكمة استدعاء الأدوات، وفحص المخرجات | `packages/security/tests/security_expansion.test.js` |
| **AuthorizationMatrix** | `packages/security/authorization.js` | إنفاذ مصفوفة الصلاحيات ومبدأ الامتياز الأدنى (RBAC/ABAC) | `packages/security/tests/security.test.js` |
| **PasswordSecurity** | `packages/security/password.js` | تجزئة كلمات المرور والتحقق بالزمن الثابت (Constant-Time) | `tests/smoke/`, `packages/security/tests/security.test.js` |
| **TokenManager** | `packages/security/token-manager.js` | إدارة الرموز، التدوير، ومنع إعادة تشغيل الرموز الملغاة | `tests/smoke/`, `packages/security/tests/security.test.js` |
| **IdempotencyEngine** | `packages/security/idempotency-middleware.js`| منع المعاملات المزدوجة والهجمات التكرارية | `packages/security/tests/security.test.js`, `server.js` |
| **CSRFProtection** | `packages/security/csrf.js` | حماية تزوير الطلبات عبر المواقع بنمط Double-Submit Cookie | `packages/security/tests/security.test.js` |
| **SSRFGuard** | `packages/security/ssrf-guard.js` | منع تزوير الطلبات الخادمية وحظر الشبكات الداخلية والبيانات الوصفية | `packages/security/tests/security_expansion.test.js` |
| **FileSecurityGuard** | `packages/security/file-security.js` | تنقية أسماء الملفات ومنع عبور المسارات (Zip Slip / Traversal) | `packages/security/tests/security_expansion.test.js` |
| **UntrustedRepoGuard** | `packages/security/untrusted-repo-guard.js` | عزل ومعالجة المدخلات غير الموثوقة من المستودعات الخارجية | `packages/security/tests/security.test.js` |
| **AgentPermissionBoundary**| `packages/security/agent-permission-boundary.js`| فرض حدود الأذونات لوكلاء الذكاء الاصطناعي وبوابات HITL | `packages/security/tests/security.test.js` |
| **SafeRepairEngine** | `packages/security/safe-repair-engine.js` | نقاط استعادة ونقاط تفتيش للإصلاح غير التخريبي والتراجع الآمن | `packages/security/tests/security.test.js` |
| **WebhookVerifier** | `packages/security/webhook-verifier.js` | تدقيق التوقيع المشفر HMAC لخطافات الويب بالزمن الثابت | `packages/security/tests/security_expansion.test.js` |
| **GraphQLSecurityGuard** | `packages/security/graphql-security.js` | تقييد عمق استعلامات GraphQL ومنع هجمات الاستنزاف | `packages/security/tests/security_expansion.test.js` |
| **InputSecurityGuard** | `packages/security/input-security.js` | تطهير الكائنات ومنع Prototype Pollution وتخصيص الكتل | `packages/security/tests/security_expansion.test.js` |

---

## 2. فهرس مدققات وقواعد النطاقات التخصصية (`packages/orchestration/v2/`)

- **Core Verification (`core-verification`)**: تدقيق الثوابت العالمية، سلامة آلات الحالة، تسوية السجلات، ومصفوفة تصنيف المخاطر.
- **Distributed Verification (`distributed-verification`)**: عقود واجهات البرمجة، عدم تكرار الأحداث، الاتساق الموزع، وتتبع المهلات.
- **AI Verification (`ai-verification`)**: جدران حماية التوجيهات، حظر اختلاق الأدلة، وسياق RAG المعزول.
- **Financial ERP (`financial-erp`)**: موازنة القيد المزدوج، منع السحب على المكشوف، ومطابقة الفواتير الثلاثية.
- **Business Systems (`business-systems`)**: عزل بيانات البائعين في الأسواق ومنع تلاعب الأسعار وعربات التسوق.
- **Enterprise Critical (`enterprise-critical`)**: حماية خصوصية السجلات الصحية (PHI)، العمليات البنكية، والخدمات الحكومية.
- **Operational Systems (`operational-systems`)**: مطابقة مواد التصنيع، أرقام التتبع اللوجستي، وسجلات الأكاديميا والمستودعات.

---

## 3. حزم الاختبارات الرقابية المرتبطة بالأمان

1. `packages/security/tests/security.test.js`: يغطي الرموز، كلمات المرور، حارس الملكية، تحديد المعدل، CSRF، وحراس الوكلاء.
2. `packages/security/tests/security_expansion.test.js`: يغطي SSRF، أمان الملفات، حارس الذكاء الاصطناعي، خطافات الويب، و GraphQL.
3. `tests/smoke/critical_flows_smoke.test.js`: يغطي التدفقات الحرجة والتكاملية لحراس الهوية والملكية والمستأجرين.
4. `packages/orchestration/tests/adversarial-phase3-5.test.js` & `phase*b-adversarial-audit.test.js`: اختبارات الاختراق المتقدمة.

---

## 4. المخططات والسجلات الأمنية الكنسية

- المخططات: `schemas/v2/` (تطبق التحقق الصارم وحظر الخصائص الإضافية `additionalProperties: false`).
- السجلات: `registries/v2-master-registry.json` (تسجيل كافة القدرات ومحددات الأمان).
- مصفوفة القواعد: `POLICY_ENFORCEMENT_MATRIX.md` (ربط القواعد بمستويات الخطورة P0/P1/P2).
