# العقد المعياري لمحولات المكدس (Stack Adapter Contract)

## 1. بنية العقد المعياري
يجب أن يلتزم كل محول مكدس تقني في WebForge OS بالعقد الهيكلي المحدد أدناه لضمان الاتساق والحتمية:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeStackAdapterContract",
  "type": "object",
  "required": [
    "adapter_id",
    "name",
    "category",
    "technology",
    "version_scope",
    "status",
    "purpose",
    "detection_signals",
    "capabilities",
    "limitations",
    "canonical_rule_mappings",
    "validator_mappings",
    "evidence_requirements",
    "security_considerations"
  ],
  "properties": {
    "adapter_id": { "type": "string", "pattern": "^ADP-[A-Z]+-[A-Z0-9_-]+$" },
    "name": { "type": "string" },
    "category": {
      "type": "string",
      "enum": ["language", "frontend", "backend", "database", "api", "testing", "build", "ci_cd", "deployment", "infrastructure", "observability"]
    },
    "technology": { "type": "string" },
    "version_scope": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "ACTIVE", "DEPRECATED", "RETIRED"]
    },
    "purpose": { "type": "string" },
    "detection_signals": {
      "type": "object",
      "required": ["files", "dependencies"],
      "properties": {
        "files": { "type": "array", "items": { "type": "string" } },
        "dependencies": { "type": "array", "items": { "type": "string" } },
        "config_keys": { "type": "array", "items": { "type": "string" } }
      }
    },
    "capabilities": {
      "type": "array",
      "items": { "type": "string" }
    },
    "limitations": {
      "type": "array",
      "items": { "type": "string" }
    },
    "canonical_rule_mappings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["canonical_rule_id", "stack_pattern", "adaptation_type"],
        "properties": {
          "canonical_rule_id": { "type": "string" },
          "stack_pattern": { "type": "string" },
          "adaptation_type": { "type": "string", "enum": ["NATIVE", "LIBRARY_ASSISTED", "MANUAL_PATTERN", "UNSUPPORTED"] }
        }
      }
    },
    "validator_mappings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "evidence_requirements": {
      "type": "array",
      "items": { "type": "string" }
    },
    "security_considerations": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

---

## 2. المحظورات الصارمة على محولات المكدس
- **يُحظر تماماً**: قيام المحول بإلغاء أو إضعاف أي قاعدة أمنية كنسية.
- **يُحظر تماماً**: فرض تقنية المحول كخيار إلزامي عام خارج نطاق المشروعات التي تستخدمها بالفعل.
- **يُحظر تماماً**: تصنيف تقنية معينة بأنها "الأفضل" أو إنشاء ترتيبات تفضيلية مطلقة.
