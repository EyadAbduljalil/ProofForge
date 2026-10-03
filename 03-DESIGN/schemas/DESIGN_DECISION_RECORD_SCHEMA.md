# مخطط سجل القرارات التصميمية (Design Decision Record Schema)
## Design Decision Record Schema & JSON Structure

---

## 1. الغرض من سجل القرارات التصميمية (DDR)

يوثق هذا السجل القرارات البصرية والمعمارية المؤثرة في واجهة المستخدم، مسوغاتها الهندسية، أثرها على إمكانية الوصول والتجاوب، والدليل المعتمد لتأكيد صحتها.

---

## 2. المخطط الهيكلي القياسي (JSON Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeDesignDecisionRecord",
  "type": "object",
  "required": [
    "decision_id",
    "task_id",
    "design_problem",
    "user_need",
    "constraints",
    "selected_direction",
    "rationale",
    "accessibility_impact",
    "responsive_impact",
    "evidence",
    "status"
  ],
  "properties": {
    "decision_id": {
      "type": "string",
      "pattern": "^DDR-[0-9]{4}-[0-9]{3,}$"
    },
    "task_id": {
      "type": "string"
    },
    "design_problem": {
      "type": "string"
    },
    "user_need": {
      "type": "string"
    },
    "constraints": {
      "type": "array",
      "items": { "type": "string" }
    },
    "options_considered": {
      "type": "array",
      "items": { "type": "string" }
    },
    "selected_direction": {
      "type": "string"
    },
    "rationale": {
      "type": "string"
    },
    "accessibility_impact": {
      "type": "string"
    },
    "responsive_impact": {
      "type": "string"
    },
    "evaluated_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "evidence": {
      "type": "array",
      "items": { "type": "string" }
    },
    "status": {
      "type": "string",
      "enum": ["PROPOSED", "DECIDED", "REJECTED", "VERIFIED"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```
