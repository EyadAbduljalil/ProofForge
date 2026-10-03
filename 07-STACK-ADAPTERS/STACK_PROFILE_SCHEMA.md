# مخطط ملف تعريف المكدس التقني للمشروع (Stack Profile Schema)

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeStackProfile",
  "type": "object",
  "required": [
    "profile_id",
    "project_name",
    "detected_stacks",
    "capabilities",
    "timestamp"
  ],
  "properties": {
    "profile_id": { "type": "string", "pattern": "^STK-PROF-[0-9]{4,}$" },
    "project_name": { "type": "string" },
    "detected_stacks": {
      "type": "object",
      "properties": {
        "languages": { "type": "array", "items": { "type": "string" } },
        "frontend": { "type": "array", "items": { "type": "string" } },
        "backend": { "type": "array", "items": { "type": "string" } },
        "database": { "type": "array", "items": { "type": "string" } },
        "api_protocols": { "type": "array", "items": { "type": "string" } },
        "testing_frameworks": { "type": "array", "items": { "type": "string" } },
        "package_managers": { "type": "array", "items": { "type": "string" } },
        "ci_cd": { "type": "array", "items": { "type": "string" } },
        "deployment": { "type": "array", "items": { "type": "string" } }
      }
    },
    "capabilities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["capability_key", "detection_status", "confidence"],
        "properties": {
          "capability_key": { "type": "string" },
          "detection_status": {
            "type": "string",
            "enum": ["DETECTED", "DECLARED", "INFERRED", "UNKNOWN", "UNSUPPORTED"]
          },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
        }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```
