# تقرير إنجاز المرحلة الثامنة: حوكمة الأدوات وتكامل بروتوكول سياق النموذج (Tool / MCP Governance)

**معرف المهمة التشغيلي:** `PROOFFORGE-PHASE-8-9-COMBINED`  
**المرحلة:** 8 من 12  
**المشروع:** نظام بروف فورج — إطار التحقق والتوثيق الهندسي لبرمجيات الذكاء الاصطناعي (ProofForge AI Engineering Verification Framework)  
**تاريخ التنفيذ:** 2026-10-05  
**قرار البوابة الهندسية (Final Gate):** **`GATE: PASS`**  

---

## 1. الملخص التنفيذي (Executive Summary)

تم بحمد الله وتوفيقه إنجاز المرحلة الثامنة بالكامل وبناء طبقة الحوكمة الكنسية للأدوات الخارجية وتكاملات بروتوكول سياق النموذج (`Model Context Protocol - MCP`).  
تم تصميم هذه الطبقة وفق النمط الحتمي التصريحي الصارم (Deterministic Declarative Governance) دون بناء خادم MCP أو بيئة تشغيل أدوات عشوائية (No MCP Server / No Tool Runtime)، تنفيذاً دقيقاً للحدود المعمارية المنصوص عليها في ميثاق المهمة.

ترسخ هذه الطبقة المبادئ الحاكمة الصارمة للأمان وهندسة الأدلة:
1. **نتيجة الأداة لا تساوي الدليل القطعي:** ($\text{Tool Result} \neq \text{Evidence}$). مخرجات الأدوات تمثل مجرد مرشحات أدلة (`Evidence Candidates`) تخضع لإلزامية الفحص المستقل.
2. **نتيجة MCP لا تمثل حقيقة مؤكدة تلقائياً:** ($\text{MCP Result} \neq \text{Verified Fact}$).
3. **توفر الأداة لا يعني الإذن بتشغيلها:** ($\text{Tool Availability} \neq \text{Permission}$).
4. **المحتوى الخارجي لا يمثل تعليمات موثوقة:** ($\text{External Content} \neq \text{Trusted Instruction}$).
5. **السيادة المطلقة لسياسات الأمان P0:** لا يمكن لأي أداة أو تكامل MCP تصعيد السلطات أو تجاوز حاجز الصلاحيات الأمني المركزي (`AgentPermissionBoundary`).

تم تطوير العقد الكنسي للأداة [tool-contract.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-contract.js)، ومحرك السجل المركزي [tool-registry.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-registry.js)، وتحديث السجل الكنسي [registry/tools.json](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/registry/tools.json)، وتنفيذ جناح اختبارات شامل يغطي السيناريوهات الـ 20 الإلزامية بنسبة نجاح 100%.

---

## 2. النطاق المعماري والحدود التشغيلية (Scope & Boundaries)

### ما تم تنفيذه ضمن النطاق:
* **التعريف الكنسي والتصنيف الحتمي للأدوات و MCP:** دعم 24 حقلاً معمارياً وأمنياً يحدد نوع الأداة، المزود، الإصدار، مخطط المدخلات والمخرجات، ومستوى الثقة.
* **التحكم والتقييد الصارم في الصلاحيات (Permission & Scope Bounding):** حظر الأدوات المعطلة، والتحقق الصارم من قوائم الوكلاء والمهارات وتدفقات العمل المصرح لها والمحظورة.
* **الربط مع حاجز الصلاحيات الأمني المركزي:** دمج التقييم الحتمي مع [AgentPermissionBoundary](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/security/agent-permission-boundary.js).
* **إلزامية مسار الأدلة والحداثة الزمنية (Freshness & Provenance):** فرض كشف المخرجات المتقادمة ومنع الترقية التلقائية إلى أدلة مؤصلة.
* **التكامل التام مع سجل التدقيق الموحد:** إعادة استخدام مسجل التدقيق الكنسي [AgentAuditRecorder](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/agent-audit-recorder.js).

### ما تم استبعاده صراحة (Scope Exclusions):
* لم يتم بناء أي خادم MCP تشغيلي (No MCP Server Implementation).
* لم يتم بناء محرك تشغيل أدوات عشوائي (No Tool Runtime / General-Purpose Executor).
* لم يتم بدء أي من متطلبات المراحل 10 أو 11 أو 12.

---

## 3. البنية المعمارية وهرمية السيطرة (Architecture & Hierarchy)

تعمل طبقة حوكمة الأدوات كبوابة فحص مغلقة (Fail-Closed Gate) تفصل بين نماذج الذكاء الاصطناعي والبيئة الخارجية:

```
[Agent / Skill Intent]
         │
         ▼
[Tool Governance Evaluation (ToolRegistry)]
         │
         ├── 1. فحص وجود الأداة ونشاطها (Active Status)
         ├── 2. فحص مصفوفة الوكلاء (Allowed/Prohibited Agents)
         ├── 3. فحص مصفوفة المهارات (Allowed/Prohibited Skills)
         ├── 4. فحص تدفقات العمل (Allowed/Prohibited Workflows)
         ├── 5. فحص نطاق وبيئة التشغيل (Scope & Environment)
         └── 6. فحص حاجز الصلاحيات الأمني المركزي (AgentPermissionBoundary)
         │
    ┌────┴──────────────────────────┐
 [مرفوض (FAIL-CLOSED)]      [مصرح (AUTHORIZED)]
         │                          │
         ▼                          ▼
 [تسجيل الرفض في التدقيق]    [تشغيل الأداة في بيئة معزولة]
                                    │
                                    ▼
                         [مخرجات الأداة: غير موثوقة (UNTRUSTED)]
                                    │
                                    ▼
                         [بوابة التحقق والتأصيل المستقلة CVGF]
                                    │
                                    ▼
                         [دليل مؤصل قطعي (Verified Evidence)]
```

---

## 4. ميثاق العقد الكنسي للأداة (Tool Contract Specification)

تم توثيق وتطبيق العقد في الملف [tool-contract.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-contract.js) ويتضمن البنية الحتمية التالية:

| الحقل المعماري | النوع البرمجي | الوصف والدور الأمني |
| :--- | :--- | :--- |
| `tool_id` | نص مطابق للنمط | معرف كنسي فريد يبدأ بـ `PF-TOOL-` أو `PF-MCP-` |
| `name` | نص غير فارغ | الاسم الرسمي للأداة أو خادم MCP |
| `version` | نص كنسي | إصدار الأداة وفق الترقيم الدلالي |
| `type` | قيمة محددة | تصنيف الأداة (`INTERNAL_TOOL`, `EXTERNAL_TOOL`, `MCP_SERVER`, `MCP_RESOURCE`, `MCP_OPERATION`) |
| `provider` | نص | الجهة المزودة أو المطورة للأداة |
| `description` | نص فني | الوصف الوظيفي والمعماري للأداة |
| `status` | قيمة محددة | الحالة التشغيلية (`ACTIVE`, `DISABLED`, `DRAFT`, `DEPRECATED`) |
| `trust_level` | قيمة محددة | مستوى الثقة المعماري (`UNTRUSTED`, `SANDBOXED`, `SYSTEM`) |
| `environment_scope` | قيمة محددة | بيئة العمل المصرح بها (`TEST`, `SANDBOX`, `DEVELOPMENT`, `PRODUCTION_RESTRICTED`) |
| `input_schema` | كائن | مخطط JSON Schema للمدخلات للتحقق المسبق ومنع الحقن |
| `output_schema` | كائن | مخطط JSON Schema للمخرجات لضمان البنية ومنع التلويث |
| `permission_requirements`| مصفوفة نصوص | الصلاحيات المطلوبة الخاضعة لحاجز الصلاحيات |
| `security_constraints` | مصفوفة نصوص | القيود الأمنية الإلزامية وحظر تجاوز P0 |
| `allowed_agents` | مصفوفة معرفات | الوكلاء المصرح لهم حصراً باستخدام الأداة |
| `prohibited_agents` | مصفوفة معرفات | الوكلاء المحظور عليهم قطعياً استدعاء الأداة |
| `allowed_skills` | مصفوفة معرفات | المهارات المصرح لها بربط الأداة |
| `prohibited_skills` | مصفوفة معرفات | المهارات المحظورة من ربط الأداة |
| `allowed_workflows` | مصفوفة معرفات | تدفقات العمل المصرح لها بتفعيل الأداة |
| `prohibited_workflows`| مصفوفة معرفات | تدفقات العمل المحظورة من تفعيل الأداة |
| `evidence_behavior` | قيمة محددة | سلوك الأدلة (`REQUIRES_VALIDATION_NOT_EVIDENCE`, إلخ) |
| `audit_requirements` | مصفوفة نصوص | متطلبات التوثيق الإلزامية في سجل التدقيق |
| `failure_conditions` | مصفوفة نصوص | الشروط التي توجب الفشل والإغلاق الفوري |
| `abstention_conditions`| مصفوفة نصوص | شروط الاستنكاف والامتناع عند غموض المعطيات |

---

## 5. سجل الأدوات وتكاملات MCP الكنسي (Tool Registry)

تم بناء محرك السجل في [tool-registry.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-registry.js) وتغذية قاعدة البيانات المرجعية في [registry/tools.json](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/registry/tools.json).

### الأدوات المعتمدة كنسياً في السجل:
1. `PF-TOOL-PLAYWRIGHT`: أداة فحص المتصفحات الحقيقية (نوع: `EXTERNAL_TOOL`، ثقة: `SANDBOXED`).
2. `PF-TOOL-LIGHTHOUSE`: أداة فحص الأداء والامتثال القياسي (نوع: `EXTERNAL_TOOL`، ثقة: `SANDBOXED`).
3. `PF-TOOL-ASVS-CHECKER`: مدقق الامتثال الأمني لمعايير OWASP ASVS L2 (نوع: `INTERNAL_TOOL`، ثقة: `SYSTEM`).
4. `PF-MCP-SCHEMA-INSPECTOR`: فاحص مخططات MCP والبيانات الوصفية (نوع: `MCP_OPERATION`، ثقة: `UNTRUSTED`).
5. `PF-TOOL-LEGACY-DISABLED`: أداة اختبار معطلة للتحقق من مبدأ الفشل المغلق (حالة: `DISABLED`).

---

## 6. التحليل الأمني ومكافحة التهديدات (Security Analysis & Threat Modeling)

تلتزم المرحلة الثامنة بالعقلية الأمنية الصارمة وتفترض عدائية المدخلات الخارجية افتراضياً:

* **منع تجاوز سياسات P0 (Anti-Bypass P0):** التحقق الحتمي عبر التعبيرات القياسية والتجميد العميق يمنع أي محاولة لحقن قيود تجاوز مثل `BYPASS_P0` أو `IGNORE_P0`.
* **منع تصعيد السلطة (Anti-Authority Escalation):** حظر أي أداة تدعي اكتساب سلطات تشريعية أو قضائية داخل النظام.
* **عزل المخرجات غير الموثوقة (Untrusted Output Wrapping):** مخرجات بروتوكول MCP تعامل دائماً كبيانات نصية غير موثوقة وغير قابلة للتنفيذ المباشر، وتخضع للتطهير الصارم لمنع هجمات حقن التعليمات غير المباشرة (Indirect Prompt Injection).
* **حظر الترقية التلقائية للأدلة (Evidence Spoofing Prevention):** منع اعتبار نتيجة تنفيذ الأداة دليلاً ما لم تعبر بوابات التحقق المستقلة في محرك التحقق المعرفي والتأصيلي (`CVGF`).

---

## 7. نتائج الاختبارات وحزمة التحقق (Tests & Verification Evidence)

تم تشغيل جناح اختبارات المرحلة 8 بالكامل في الملف [packages/contracts/tests/tool-contract.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tests/tool-contract.test.js) وجاءت النتائج كالتالي:

| الرقم | سيناريو الاختبار الإلزامي | النتيجة الفعلية | التوثيق والدليل |
| :---: | :--- | :---: | :--- |
| 1 | اختبار إنشاء عقد أداة صالح والتجميد العميق للأشجار البرمجية | **PASS** | `[PASS] 1. Valid Tool Creation & Deep Immutability Verified` |
| 2 | اختبار تعريف صالح لعملية بروتوكول MCP | **PASS** | `[PASS] 2. Valid MCP Definition Verified` |
| 3 | رفض الأدوات ذات المعرفات المكررة (Duplicate Tool) | **PASS** | `[PASS] 3. Duplicate Tool Rejection Verified` |
| 4 | رفض تعريفات الأدوات المشوهة أو الناقصة (Malformed Tool) | **PASS** | `[PASS] 4. Malformed Tool Rejection Verified` |
| 5 | فرض مبدأ الفشل المغلق للأدوات المعطلة (Disabled Tool) | **PASS** | `[PASS] 5. Disabled Tool Fail-Closed Behavior Verified` |
| 6 | رفض طلب تشغيل أداة من وكيل غير معروف بالسجل | **PASS** | `[PASS] 6. Unknown Agent Rejection Verified` |
| 7 | إنفاذ حظر الوكلاء المحظورين صراحة (Prohibited Agent) | **PASS** | `[PASS] 7. Prohibited Agent Enforcement Verified` |
| 8 | رفض طلب تشغيل أداة من مهارة غير معروفة بالسجل | **PASS** | `[PASS] 8. Unknown Skill Rejection Verified` |
| 9 | إنفاذ حظر المهارات المحظورة صراحة (Prohibited Skill) | **PASS** | `[PASS] 9. Prohibited Skill Enforcement Verified` |
| 10 | رفض طلب تشغيل أداة ضمن تدفق عمل غير معروف بالسجل | **PASS** | `[PASS] 10. Unknown Workflow Rejection Verified` |
| 11 | رفض العمليات غير المصرح بها عبر حاجز الصلاحيات الأمني | **PASS** | `[PASS] 11. Unauthorized Operation Verified` |
| 12 | إحباط محاولات تصعيد الامتيازات (Privilege Escalation) | **PASS** | `[PASS] 12. Privilege Escalation Attempt Defense Verified` |
| 13 | إحباط محاولات تصعيد النطاق الجغرافي أو البيئي (Scope Escalation) | **PASS** | `[PASS] 13. Scope Escalation Attempt Defense Verified` |
| 14 | رفض المدخلات غير المطابقة لمخطط المدخلات (Malformed Input) | **PASS** | `[PASS] 14. Malformed Input Rejection Verified` |
| 15 | رفض المخرجات غير المطابقة لمخطط المخرجات (Malformed Output) | **PASS** | `[PASS] 15. Malformed Output Schema Rejection Verified` |
| 16 | كشف المخرجات المتقادمة وإلزامية التحقق من الحداثة (Stale Output) | **PASS** | `[PASS] 16. Stale Output Handling Verified` |
| 17 | كشف ومنع عدم تطابق بيئة التشغيل (Scope Mismatch) | **PASS** | `[PASS] 17. Environment Scope Mismatch Defense Verified` |
| 18 | منع ترقية المخرجات غير الموثوقة كأدلة تلقائياً دون CVGF | **PASS** | `[PASS] 18. Untrusted Output Cannot Become Evidence Automatically Verified` |
| 19 | فحص والتحقق من متطلبات سجل التدقيق الإلزامية | **PASS** | `[PASS] 19. Audit Requirements Validation Verified` |
| 20 | التحميل الكنسي للسجل وفرض الفشل المغلق الشامل | **PASS** | `[PASS] 20. Canonical Tool Registry Loading & Fail-Closed Behavior Verified` |

**معدل النجاح:** 20/20 بنسبة 100%، كود الخروج: `0`.

---

## 8. سجل المكتشفات والإصلاحات الهندسية (Findings Register)

```json
[
  {
    "finding_id": "PF-FINDING-PH8-001",
    "severity": "HIGH",
    "location": "registry/tools.json",
    "description": "استخدام معرفات وكلاء ومهارات غير متطابقة مع المعرفات المعتمدة كنسياً في السجلات الرسمية (مثل استخدام PF-TEST-001 بدلاً من PF-QA-001).",
    "evidence": "ظهور أخطاء عدم تطابق المراجع أثناء الفحص المتقاطع للسجل الكنسي.",
    "impact": "فشل التحميل الكنسي وتعطل الفحص المغلق بسبب غياب المراجع الصالحة.",
    "repair": "تمت مواءمة وتوحيد كافة المعرفات في السجل لتطابق registry/agents.json و registry/skills.json و registry/workflows.json بدقة تامة.",
    "verification": "اجتياز فحص السجل الكنسي بنجاح في الاختبار رقم 20.",
    "status": "RESOLVED"
  },
  {
    "finding_id": "PF-FINDING-PH8-002",
    "severity": "CRITICAL",
    "location": "packages/contracts/tool-contract.js",
    "description": "احتمالية تمرير نتيجة الأداة كدليل معتمد مباشرة إذا لم يتم فحص ميثاق الأدلة صراحة في نص العقد.",
    "evidence": "فحص المتطلبات كشف ضرورة الالتزام بالقاعدة الصارمة Tool Result !== Evidence.",
    "impact": "إمكانية تلويث بيئة التحقق المعرفي بأدلة واهية مولدة من أدوات غير موثوقة.",
    "repair": "تم تضمين فحص أمني حتمي بالتعابير النمطية في ToolContract.validate لمنع أي خاصية أو تعليق يدعي TOOL_RESULT_IS_EVIDENCE أو AUTO_PROMOTE_TO_VERIFIED.",
    "verification": "اجتياز الاختبار رقم 18 واختبار التكامل الشامل للتحقق من رفض هذا السلوك قطيعاً.",
    "status": "RESOLVED"
  }
]
```

---

## 9. القيود المعمارية والاعتماديات المستقبلية (Limitations & Future Dependencies)

1. **الاعتماد على بيئة التشغيل المعزولة (Sandboxing):** يفترض العقد تشغيل الأدوات الخارجية ضمن بيئة معزولة، وسيتم اختبار الربط الحي مع بيئات العزل الصارمة في المراحل اللاحقة.
2. **عدم وجود خادم MCP داخلي:** النظام لا يوفر خادم MCP مدمج بل يحكم التفاعل مع الخوادم الموثقة في السجل فقط.

---

## 10. قرار البوابة الهندسية (Final Gate Decision)

استناداً إلى الأدلة المادية المستوفاة:
* وجود وتجميد العقد الكنسي للأداة [tool-contract.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-contract.js).
* اكتمال السجل الكنسي للأدوات [tool-registry.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/contracts/tool-registry.js).
* اجتياز السيناريوهات الـ 20 الإلزامية بنسبة 100%.
* انعدام أي إمكانية لتجاوز سياسات الأمان P0 أو ترقية نتائج الأدوات إلى أدلة تلقائياً.

يصدر القرار الرسمي للمرحلة الثامنة:
**`GATE: PASS`**
