# مخطط وسكيما التقرير الهندسي النهائي (AI Report Schema)

## المعرّف: `SCH-AI-REPORT-001`
## الحالة: `ACTIVE`

---

## 1. التوصيف
تعريف المخطط الهيكلي الإلزامي للتقارير الهندسية والأمنية الصادرة عن الوكلاء الأذكياء عند إتمام المهام.

---

## 2. مواصفات المخطط (JSON Schema Specification)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIReportSchema",
  "type": "object",
  "required": [
    "report_id",
    "timestamp",
    "task_summary",
    "scope",
    "detected_environment",
    "rules_applied",
    "applied_changes",
    "test_and_validation_results",
    "evidence_matrix",
    "final_status"
  ],
  "properties": {
    "report_id": {
      "type": "string",
      "pattern": "^REP_[A-Za-z0-9_\\-]+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "task_summary": {
      "type": "string",
      "minLength": 10
    },
    "scope": {
      "type": "object",
      "required": ["included", "excluded"],
      "properties": {
        "included": { "type": "array", "items": { "type": "string" } },
        "excluded": { "type": "array", "items": { "type": "string" } }
      }
    },
    "detected_environment": {
      "type": "object"
    },
    "rules_applied": {
      "type": "array",
      "items": { "type": "string" }
    },
    "applied_changes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["file", "description"]
      }
    },
    "test_and_validation_results": {
      "type": "object",
      "required": ["total_tests", "passed", "failed", "pass_rate"]
    },
    "evidence_matrix": {
      "type": "array",
      "items": { "type": "object" }
    },
    "limitations_and_risks": {
      "type": "array",
      "items": { "type": "string" }
    },
    "final_status": {
      "type": "string",
      "enum": [
        "COMPLETED",
        "COMPLETED_WITH_WARNINGS",
        "BLOCKED",
        "FAILED",
        "PARTIALLY_COMPLETED"
      ]
    }
  }
}
```
