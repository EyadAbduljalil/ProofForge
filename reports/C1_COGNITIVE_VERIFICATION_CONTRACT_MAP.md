# خريطة عقود التحقق الإدراكي والواجهات المعمارية (C1 Cognitive Verification Contract Map)

## 1. مقدمة وخطة التعاقد المعماري
تحدد هذه الوثيقة مواصفات العقود البرمجية (Interfaces & Schemas) الخاصة بإطار **التحقق الإدراكي والتأصيل البرمجي** لنظام **WebForge OS**. 
توضح الخريطة كيفية تفاعل المكونات القائمة مع الامتدادات المقررة، وتوزع العقود الجديدة حصرياً على المراحل الزمنية اللاحقة دون تنفيذ استباقي في مرحلة C1.

---

## 2. خريطة العقود والواجهات للمكونات القائمة (Existing System Contracts & Extension Points)

### 2.1 عقد محرك رسم الأدلة (`EvidenceGraph Contract`)
* **الملف المصدر**: `packages/orchestration/evidence-graph.js`
* **الحالة في C1**: `EXTEND`
* **الواجهات الحالية**:
  - `addNode(node)`: تسجيل عقدة جديدة في الرسم البياني (FAILURE, FINDING, DECISION, REPAIR, TEST, CLAIM).
  - `addEdge(fromId, toId, type)`: إنشاء علاقة موجهة بين عقدتين مع منع التكرار.
  - `verifyClaimIntegrity(claimId)`: فحص سلامة الادعاء والتحقق من وجود عقد إثبات داعمة واختبارات ناجحة.
  - `recordRepairCycleTrace(cycleData)`: تسجيل دورة تصحيح سداسية متكاملة.
* **الامتداد التعاقدي المعتمد لـ C1**:
  - `addGroundingEdge(claimId, evidenceId, metadata)`: ربط الادعاء بالدليل مع توثيق بصمة الملف ونوع التأصيل.
  - `invalidateExpiredEvidence(currentArtifactHashes)`: فحص ومطابقة بصمات التجزئة للملفات الحالية وإبطال الأدلة التي تغيرت ملفاتها.
  - `detectEvidenceContradictions(claimId)`: رصد الأدلة المتعارضة تجريبياً.

### 2.2 عقد سجل الذاكرة الهندسية (`EngineeringMemory Contract`)
* **الملف المصدر**: `packages/orchestration/engineering-memory.js`
* **الحالة في C1**: `REUSE` (مع عزل تعاقدي صارم)
* **الواجهات الحالية**:
  - `recordMemory(category, key, data)`: تدوين سجل تاريخي في تصنيف محدد.
  - `recordSecurityDebt(debtData)`: تسجيل دين أمني أو تقني معتمد.
  - `recordSecurityDecision(decisionData)`: تسجيل قرار أمني أو معماري.
  - `recordResolvedFailure(failureData)`: توثيق معالجة فشل بنجاح والربط باختبارات الانحدار.
  - `exportMemoryState()`: تصدير كافة سجلات الذاكرة.
* **الشرط التعاقدي المقيد لـ C1**:
  - يُحظر حظراً باتاً استخدام مخرجات `EngineeringMemory` كبديل لعقد الإثبات في `EvidenceGraph`. الذاكرة تقدم سياقاً فقط (`Context Only`) ولا تملك صلاحية إثبات الادعاءات.

### 2.3 عقد مسجل تدقيق الوكيل (`AgentAuditRecorder Contract`)
* **الملف المصدر**: `packages/orchestration/agent-audit-recorder.js`
* **الحالة في C1**: `EXTEND`
* **الواجهات الحالية**:
  - `recordAgentAction(action)`: تسجيل الإجراء والعملية المنفذة.
  - `recordDiff(file, before, after)`: حساب وتوثيق الفروقات البرمجية الموحدة.
  - `assessChangeRisk(diffSummary)`: تقييم مستوى خطورة التعديل البرمجي.
* **الامتداد التعاقدي لـ C1**:
  - `recordAbstentionEvent(eventData)`: تسجيل أحداث الاستنكاف الإدراكي عندما يعجز النظام عن إثبات الادعاء، مع تدوين السبب ومستوى غياب الأدلة.

### 2.4 عقد محرك التحقق المستقل من المشاكل (`FindingVerifier Contract`)
* **الملف المصدر**: `packages/orchestration/finding-verifier.js`
* **الحالة في C1**: `REUSE`
* **الواجهات الحالية**:
  - `verifyFinding(finding, codeContext, evidenceGraph)`: تصنيف النتيجة ضمن إحدى الحالات الخمس الكنسية:
    - `CONFIRMED`: مشكلة حقيقية مؤكدة بدليل تجريبي أو فحص سياقي صارم.
    - `LIKELY`: مشكلة مرجحة ولكن الدليل أولي يحتاج لاختبار ديناميكي.
    - `FALSE_POSITIVE`: إنذار خاطئ مثبت بوجود حراسات وضوابط محيطة.
    - `INSUFFICIENT_EVIDENCE`: نقص في البيانات والشيفرة المتاحة للتحقق.
    - `ENVIRONMENT_LIMITATION`: تعذر التحقق بسبب قيود بيئة التشغيل.

### 2.5 عقد هرمية السلطة وفصل الأولويات (`AuthorityHierarchy Contract`)
* **الملف المصدر**: `packages/orchestration/authority-hierarchy.js`
* **الحالة في C1**: `REUSE`
* **الواجهات الحالية**:
  - `AuthorityHierarchy.LEVELS`: مصفوفة مستويات الصلاحية من P0 إلى P8.
  - `AuthorityHierarchy.arbitrate(levelKeyA, levelKeyB)`: فض النزاع الحتمي وإرجاع الطرف الفائز استناداً إلى أسبقية الأولوية.

### 2.6 عقد حارس أمان الذكاء الاصطناعي (`AISecurityGuard Contract`)
* **الملف المصدر**: `packages/security/ai-security-guard.js`
* **الحالة في C1**: `EXTEND`
* **الواجهات الحالية**:
  - `detectPromptInjection(inputText)`: رصد محاولات حقن التعليمات والتجاوز.
  - `authorizeToolExecution(user, toolName, toolArguments)`: فحص ميزانية العمليات والقائمة البيضاء للأدوات وعزل المستأجر.
  - `validateAIOutput(rawOutput, expectedSchema)`: فحص وحظر الأوامر التنفيذية الخطرة في المخرجات.
* **الامتداد التعاقدي لـ C1**:
  - `validateRetrievedContent(payload)`: تدقيق الحمولات المسترجعة عبر أدوات MCP أو قنوات الاسترجاع وعزل أي تعليمات ضمنية خبيثة.

---

## 3. خريطة العقود الجديدة وتوزيعها الزمني (New Contract Registry & Phased Allocation)

| معرف العقد التعاقدي | اسم العقد | المرحلة المخصصة | المكون المالك | المدخلات الأساسية | المخرجات المتوقعة |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CNT-C2-CLM-001** | `AtomicClaimSchema` | **C2** | ClaimVerificationEngine | نص مخرجات النموذج، سياق الملف المستهدف، وسوم التصنيف | كائن ادعاء ذري مقسم ومحدد البصمة (`Atomic Claim Object`) |
| **CNT-C2-PRV-002** | `ProvenanceTracker` | **C2** | ProvenanceRegistry | معرف الادعاء، مصدر الاستخراج (Tool, Diff, Log)، رقم السطر | سلسلة تتبع المصدر المثبتة (`Trace Chain`) |
| **CNT-C2-VAL-003** | `ClaimValidatorContract` | **C2** | DeterministicValidator | عقدة الادعاء، أدلة الاختبارات في EvidenceGraph | قرار مطابقة مبدئي (`PASS` / `FAIL` / `INSUFFICIENT`) |
| **CNT-C3-GND-001** | `GroundingDistanceEngine` | **C3** | GroundingVerifier | نصوص الادعاءات، الشيفرة الفعلية، براهين AST | مقياس مسافة التأصيل ومعدل التطابق مع الواقع (`0.0 - 1.0`) |
| **CNT-C3-GAT-002** | `GroundingGateContract` | **C3** | GroundingGate | قائمة الادعاءات المؤصلة، حدود الأمان P0 | قرار إجازة التقرير أو التوقف والحظر (`PERMIT` / `ABSTAIN_AND_BLOCK`) |
| **CNT-C3-ABS-003** | `AbstentionProtocol` | **C3** | AbstentionHandler | تقرير الفشل الإدراكي، أسباب نقص الأدلة | بيان استنكاف رسمي شفاف موجه للمستخدم |

---

## 4. مخطط تدفق العقود عبر دورة الحياة الكنسية

```mermaid
graph TD
    subgraph المرحلة 8: VALIDATE
        T1[أدوات الفحص والاختبار] --> CNT_VAL[ClaimValidatorContract (C2)]
    end
    
    subgraph المرحلة 9: VERIFY & EVIDENCE
        CNT_VAL --> FV[FindingVerifier (REUSE)]
        FV --> EG[EvidenceGraph (EXTEND)]
        EG --> CNT_GND[GroundingDistanceEngine (C3)]
        CNT_GND --> CNT_GAT[GroundingGateContract (C3)]
    end
    
    subgraph المرحلة 10: REPORT
        CNT_GAT -->|إجازة الدليل| REP[التقرير النهائي المعتمد]
        CNT_GAT -->|غياب الدليل| CNT_ABS[AbstentionProtocol (C3)]
        CNT_ABS --> AAR[AgentAuditRecorder (EXTEND)]
        CNT_ABS --> REP_ABS[تقرير الاستنكاف الصريح المعتمد]
    end
```

---

## 5. الخلاصة والالتزام المعماري
تؤكد هذه الخريطة أن جميع العقود الجديدة المجدولة لمرحلتي C2 و C3 ترتبط حصرياً بالمكونات القائمة في حزم `packages/orchestration` و `packages/security`، ولا تتطلب استحداث أي بنى تحتية موازية أو متضاربة، مما يضمن كفاءة واكتمال المعمارية بنسبة 100%.
