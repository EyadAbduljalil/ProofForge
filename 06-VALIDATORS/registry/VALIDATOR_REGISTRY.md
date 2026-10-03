# السجل المعياري للمدققات والخرائط مع القواعد (Validator Registry)

## 1. فهرس المدققات القياسية في WebForge OS

| معرف المدقق (Validator ID) | اسم المدقق | النطاق | القواعد المستهدفة | منهجية التحقق | القدرات المطلوبة |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`VAL-SEC-AUTH-001`** | مدقق تجزئة كلمات المرور | Security | `SEC-AUTH-001` | source-code-analysis | ast-parsing, crypto-check |
| **`VAL-SEC-AUTHZ-001`** | مدقق التفويض وفحص الملكية | Security | `SEC-AUTHZ-001` | semantic-analysis | route-ownership-inspect |
| **`VAL-SEC-SESS-001`** | مدقق كعكات الجلسة والـ JWT | Security | `SEC-SESS-001` | config-and-code | cookie-header-inspect |
| **`VAL-SEC-INJ-001`** | مدقق الاستعلامات وحقن SQL | Security | `SEC-INJ-001` | source-code-analysis | query-parameterization-check |
| **`VAL-SEC-WEB-001`** | مدقق ترويسات الأمان و CORS | Security | `SEC-WEB-001` | config-and-response | security-headers-inspect |
| **`VAL-SEC-CRYPTO-001`** | مدقق الخوارزميات التشفيرية | Security | `SEC-CRYPTO-001` | static-analysis | crypto-inventory |
| **`VAL-SEC-SECRETS-001`** | مدقق خلو الشيفرة من الأسرار | Security | `SEC-SECRETS-001` | secret-scanning | regex-entropy-scan |
| **`VAL-ENG-ARCH-001`** | مدقق العزل المعماري للطبقات | Engineering | `ENG-ARCH-001` | structural-analysis | dependency-graph-check |
| **`VAL-ENG-API-001`** | مدقق معايير واجهات البرمجة | Engineering | `ENG-API-001` | schema-validation | openapi-contract-check |
| **`VAL-ENG-DB-001`** | مدقق المعاملات وسياسات RLS | Engineering | `ENG-DB-001` | migration-analysis | schema-migration-check |
| **`VAL-ENG-PERF-001`** | مدقق ميزانيات الأداء والضغط | Engineering | `ENG-PERF-001` | dynamic-metrics | bundle-budget-check |
| **`VAL-ENG-REL-001`** | مدقق قواطع الدوائر والمهل | Engineering | `ENG-REL-001` | code-and-flow | retry-timeout-check |
| **`VAL-DSN-A11Y-001`** | مدقق إمكانية الوصول والتباين | Design | `DSN-A11Y-001` | semantic-dom-check | contrast-wcag-eval |
| **`VAL-DSN-RESP-001`** | مدقق التجاوب للشاشات العشر | Design | `DSN-RESP-001` | viewport-simulation | layout-breakpoint-check |
| **`VAL-DSN-SLOP-001`** | مدقق مكافحة التصاميم المبتذلة | Design | `DSN-SLOP-001` | heuristic-design-eval | anti-slop-matrix |

---

## 2. قواعد تسجيل وتوسيع المدققات
- يجب أن يرتبط كل مدقق جديد بقاعدة معتمدة ومسجلة في `01-KNOWLEDGE/` أو الأدلة التخصصية.
- يُحظر تسجيل أي مدقق مكرر الوظيفة أو ذي معرف متضارب.
- يجب أن يستوفي المدقق المسجل متطلبات الأمان والعزل الكاملة (Read-Only & Sandboxed).
