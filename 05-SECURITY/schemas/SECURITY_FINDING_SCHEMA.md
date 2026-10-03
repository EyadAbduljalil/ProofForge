# مخطط توثيق النتائج والثغرات الأمنية (Security Finding Schema)

## نظرة عامة
يحدد هذا المخطط البنية المعيارية لتوثيق الثغرات والنتائج الأمنية المرصودة بواسطة أدوات الفحص أو التدقيق اليدوي داخل منظومة WebForge OS.

---

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeSecurityFinding",
  "type": "object",
  "required": [
    "id",
    "title",
    "severity",
    "cwe_id",
    "category",
    "location",
    "description",
    "reproduction_steps",
    "impact",
    "remediation",
    "verification_status"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^SEC-FIND-[0-9]{4,}$",
      "description": "المعرف الفريد للثغرة الأمنية"
    },
    "title": {
      "type": "string",
      "description": "عنوان موجز للثغرة"
    },
    "severity": {
      "type": "string",
      "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]
    },
    "cwe_id": {
      "type": "string",
      "pattern": "^CWE-[0-9]+$",
      "description": "معرف التصنيف المعياري لـ CWE"
    },
    "category": {
      "type": "string",
      "enum": [
        "injection",
        "broken_authentication",
        "sensitive_data_exposure",
        "xml_external_entities",
        "broken_access_control",
        "security_misconfiguration",
        "cross_site_scripting",
        "insecure_deserialization",
        "vulnerable_components",
        "insufficient_logging",
        "server_side_request_forgery",
        "business_logic"
      ]
    },
    "location": {
      "type": "object",
      "required": ["file"],
      "properties": {
        "file": { "type": "string" },
        "line_range": { "type": "string" },
        "component": { "type": "string" }
      }
    },
    "description": {
      "type": "string",
      "description": "شرح تقني وافٍ لطبيعة الخلل الأمني"
    },
    "reproduction_steps": {
      "type": "array",
      "items": { "type": "string" }
    },
    "impact": {
      "type": "string",
      "description": "تقييم الأثر المترتب على استغلال الثغرة"
    },
    "remediation": {
      "type": "object",
      "required": ["recommendation", "code_sample_diff"],
      "properties": {
        "recommendation": { "type": "string" },
        "code_sample_diff": { "type": "string" }
      }
    },
    "verification_status": {
      "type": "string",
      "enum": ["OPEN", "TRIAGED", "RESOLVED", "FALSE_POSITIVE", "ACCEPTED_RISK"]
    }
  }
}
```
