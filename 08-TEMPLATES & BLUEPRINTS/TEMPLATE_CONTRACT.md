# العقد المعياري لقوالب النطاقات (Template Contract Specification)

## 1. بنية عقد القالب
يحدد هذا العقد الحقول والمتطلبات الإلزامية التي يجب أن يستوفيها كل قالب نطاق في WebForge OS:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeTemplateContract",
  "type": "object",
  "required": [
    "template_id",
    "name",
    "domain",
    "category",
    "purpose",
    "status",
    "version",
    "applicability_rules",
    "required_canonical_rules",
    "recommended_components",
    "security_requirements",
    "validation_mappings",
    "evidence_expectations"
  ],
  "properties": {
    "template_id": { "type": "string", "pattern": "^TPL-[A-Z]+-[A-Z0-9_-]+$" },
    "name": { "type": "string" },
    "domain": {
      "type": "string",
      "enum": ["ecommerce", "lms", "saas", "auth_service", "api_gateway", "admin_dashboard", "realtime", "community"]
    },
    "category": { "type": "string" },
    "purpose": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "ACTIVE", "DEPRECATED", "RETIRED"]
    },
    "version": { "type": "string" },
    "applicability_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "required_canonical_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "recommended_components": {
      "type": "array",
      "items": { "type": "string" }
    },
    "security_requirements": {
      "type": "array",
      "items": { "type": "string" }
    },
    "validation_mappings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "evidence_expectations": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

---

## 2. القيود الحتمية للقوالب
- لا يجوز للقالب إلغاء أي فحص أمني أو اعتبار النطاق "معفياً" من القواعد الأساسية.
- يجب أن يكون القالب قابلاً للتركيب والدمج مع قوالب فرعية أخرى بسلاسة.
