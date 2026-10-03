# مخطط القواعد والضوابط الأمنية (Security Rule Schema)

## نظرة عامة
يحدد هذا المخطط البنية الهيكلية المعيارية لكافة القواعد والضوابط الأمنية في نظام WebForge OS، ويشكل امتداداً تخصصياً للمخطط الكنسي للقواعد في Phase 1 (`01-KNOWLEDGE`).

---

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeSecurityRule",
  "type": "object",
  "required": [
    "id",
    "title",
    "domain",
    "severity",
    "cwe_mapping",
    "asvs_mapping",
    "threat_category",
    "applies_to",
    "requirement",
    "bad_patterns",
    "good_patterns",
    "validation_check",
    "remediation"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^SEC-[A-Z]+-[0-9]{3}$",
      "description": "المعرف الفريد الحتمي للقاعدة الأمنية"
    },
    "title": { "type": "string" },
    "domain": {
      "type": "string",
      "enum": [
        "principles",
        "authentication",
        "authorization",
        "sessions",
        "input_validation",
        "output_encoding",
        "injection",
        "web",
        "api",
        "data_protection",
        "cryptography",
        "secrets",
        "files",
        "supply_chain",
        "dependencies",
        "business_logic",
        "ai_security",
        "repository_security"
      ]
    },
    "severity": {
      "type": "string",
      "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]
    },
    "cwe_mapping": {
      "type": "array",
      "items": { "type": "string", "pattern": "^CWE-[0-9]+$" }
    },
    "asvs_mapping": {
      "type": "array",
      "items": { "type": "string", "pattern": "^V[0-9]+(\\.[0-9]+)*$" }
    },
    "threat_category": {
      "type": "string",
      "enum": ["SPOOFING", "TAMPERING", "REPUDIATION", "INFORMATION_DISCLOSURE", "DENIAL_OF_SERVICE", "ELEVATION_OF_PRIVILEGE"]
    },
    "applies_to": {
      "type": "array",
      "items": { "type": "string" }
    },
    "requirement": { "type": "string" },
    "bad_patterns": {
      "type": "array",
      "items": { "type": "string" }
    },
    "good_patterns": {
      "type": "array",
      "items": { "type": "string" }
    },
    "validation_check": { "type": "string" },
    "remediation": { "type": "string" }
  }
}
```
