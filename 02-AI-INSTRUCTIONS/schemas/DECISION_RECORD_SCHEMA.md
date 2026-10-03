# مخطط وسكيما سجل القرارات المعمارية (Decision Record Schema)

## المعرّف: `SCH-DECISION-RECORD-001`
## الحالة: `ACTIVE`

---

## 1. التوصيف
تعريف المخطط البياني الصارم (Schema) لسجلات القرارات التي يصدرها الوكيل الذكي للتحقق الآلي من اكتمال البيانات.

---

## 2. مواصفات المخطط (JSON Schema Specification)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DecisionRecordSchema",
  "type": "object",
  "required": [
    "decision_id",
    "timestamp",
    "task",
    "context",
    "options_considered",
    "selected_option",
    "authority_level",
    "applicable_rules",
    "tradeoffs",
    "status"
  ],
  "properties": {
    "decision_id": {
      "type": "string",
      "pattern": "^DEC_[A-Za-z0-9_\\-]+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "task": {
      "type": "string",
      "minLength": 5
    },
    "context": {
      "type": "string",
      "minLength": 10
    },
    "options_considered": {
      "type": "array",
      "items": { "type": "object" },
      "minItems": 1
    },
    "selected_option": {
      "type": "string"
    },
    "authority_level": {
      "type": "string",
      "enum": [
        "P0_SECURITY_SAFETY",
        "P1_CONSTITUTION",
        "P2_ARCHITECTURE",
        "P3_DOMAIN",
        "P4_ENGINEERING",
        "P5_DESIGN_SYSTEM",
        "P6_REQUIREMENTS",
        "P7_AGENT_RECOMMENDATIONS",
        "P8_AGENT_PREFERENCES"
      ]
    },
    "applicable_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "tradeoffs": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": ["PROPOSED", "APPROVED_AND_EXECUTED", "REJECTED", "ESCALATED"]
    }
  }
}
```
