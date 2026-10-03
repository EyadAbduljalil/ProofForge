# مخطط قوالب النطاقات (Template JSON Schema)

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeTemplateSchema",
  "type": "object",
  "required": [
    "template_id",
    "name",
    "domain",
    "status",
    "version",
    "canonical_rules",
    "stack_bindings",
    "validation_rules",
    "security_profile"
  ],
  "properties": {
    "template_id": { "type": "string", "pattern": "^TPL-[A-Z]+-[A-Z0-9_-]+$" },
    "name": { "type": "string" },
    "domain": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "ACTIVE", "DEPRECATED", "RETIRED"]
    },
    "version": { "type": "string" },
    "canonical_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "stack_bindings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "validation_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "security_profile": {
      "type": "object",
      "required": ["mandatory_security_rules", "risk_level"],
      "properties": {
        "mandatory_security_rules": { "type": "array", "items": { "type": "string" } },
        "risk_level": { "type": "string", "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"] }
      }
    }
  }
}
```
