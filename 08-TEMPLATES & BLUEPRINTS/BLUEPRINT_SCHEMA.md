# مخطط المخططات المعمارية (Blueprint JSON Schema)

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeBlueprintSchema",
  "type": "object",
  "required": [
    "blueprint_id",
    "domain",
    "architecture_pattern",
    "components",
    "trust_boundaries",
    "data_flows",
    "failure_handling",
    "validation_contracts"
  ],
  "properties": {
    "blueprint_id": { "type": "string", "pattern": "^BLP-[A-Z]+-[A-Z0-9_-]+$" },
    "domain": { "type": "string" },
    "architecture_pattern": { "type": "string" },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "type"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" }
        }
      }
    },
    "trust_boundaries": {
      "type": "array",
      "items": { "type": "string" }
    },
    "data_flows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "protocol"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "protocol": { "type": "string" }
        }
      }
    },
    "failure_handling": {
      "type": "array",
      "items": { "type": "string" }
    },
    "validation_contracts": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```
