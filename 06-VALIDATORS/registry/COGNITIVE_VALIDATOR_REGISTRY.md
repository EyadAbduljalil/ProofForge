# السجل المعياري لمدققات التحقق الإدراكي والادعاءات (Cognitive Validator Registry - Stage C2)

## 1. فهرس المدققات الإدراكية في WebForge OS

| معرف المدقق (Validator ID) | اسم المدقق | النطاق | القواعد المستهدفة | منهجية التحقق | القدرات المطلوبة | المكون المنفذ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`COG-VAL-CLM-001`** | مدقق استخبارات الادعاءات والأدلة | Cognitive | `COG-CLM-001` | claim-evidence-intelligence | deterministic-verification, temporal-check, conflict-detection | `packages/orchestration/claim-verification-engine.js` |
| **`COG-VAL-EVD-001`** | مدقق الرسم البياني ونزاهة الأدلة | Cognitive | `COG-EVD-001` | evidence-graph-integrity | dag-traversal, artifact-hash-invalidation, cycle-trace | `packages/orchestration/evidence-graph.js` |
| **`COG-VAL-RET-001`** | حارس عدم الثقة في المحتوى المسترجع | Cognitive / Security | `COG-SEC-001` | zero-trust-retrieval | prompt-injection-defense, evidence-poisoning-guard | `packages/security/ai-security-guard.js` |
| **`COG-VAL-GAT-001`** | بوابة التأصيل الإدراكي وبوابة الاستنكاف | Cognitive | `COG-GAT-001` | grounding-gate-evaluation | partial-grounding, abstention-logic, permit-qualify-block | `packages/orchestration/grounding-gate.js` |
| **`COG-VAL-OUT-001`** | محقق مخرجات النموذج والاقتباسات | Cognitive | `COG-OUT-001` | output-claim-verification | claim-extraction, citation-verification, unsupported-detection | `packages/orchestration/output-verification-engine.js` |

---

## 2. قواعد تسجيل وتوسيع مدققات التحقق الإدراكي
- يخضع كل مدقق إدراكي للمبادئ الدستورية الصارمة: Memory !== Evidence, Retrieved Content !== Evidence, Citation !== Verification.
- يجب أن يكون تنفيذ المدقق حتمياً (Deterministic) بالكامل، ولا يعتمد على مخرجات احتمالية من نماذج لغوية.
- يمنع تحويل أي مدقق إدراكي إلى بيئة تشغيل runtime أو محرك لتوليد الأكواد.
