# مخطط وثائق نمذجة التهديدات (Threat Model Schema)

## نظرة عامة
يحدد هذا المخطط البنية الهيكلية المعيارية لإعداد ومراجعة وثائق نمذجة التهديدات (Threat Models) وفق تصنيف STRIDE داخل منظومة WebForge OS.

---

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeThreatModel",
  "type": "object",
  "required": [
    "feature_id",
    "feature_name",
    "author",
    "version",
    "trust_boundaries",
    "data_flows",
    "threats",
    "mitigations",
    "residual_risk"
  ],
  "properties": {
    "feature_id": {
      "type": "string",
      "description": "معرف الميزة أو المكون قيد التحليل"
    },
    "feature_name": {
      "type": "string",
      "description": "اسم الميزة"
    },
    "author": { "type": "string" },
    "version": { "type": "string" },
    "trust_boundaries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["boundary_id", "from_entity", "to_entity", "trust_level_change"],
        "properties": {
          "boundary_id": { "type": "string" },
          "from_entity": { "type": "string" },
          "to_entity": { "type": "string" },
          "trust_level_change": { "type": "string" }
        }
      }
    },
    "data_flows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["flow_id", "source", "destination", "data_type", "protocol"],
        "properties": {
          "flow_id": { "type": "string" },
          "source": { "type": "string" },
          "destination": { "type": "string" },
          "data_type": { "type": "string" },
          "protocol": { "type": "string" }
        }
      }
    },
    "threats": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["threat_id", "stride_category", "target_element", "description", "risk_level"],
        "properties": {
          "threat_id": { "type": "string" },
          "stride_category": {
            "type": "string",
            "enum": ["SPOOFING", "TAMPERING", "REPUDIATION", "INFORMATION_DISCLOSURE", "DENIAL_OF_SERVICE", "ELEVATION_OF_PRIVILEGE"]
          },
          "target_element": { "type": "string" },
          "description": { "type": "string" },
          "risk_level": {
            "type": "string",
            "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
          }
        }
      }
    },
    "mitigations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["mitigation_id", "threat_ref", "strategy_description", "implementation_status"],
        "properties": {
          "mitigation_id": { "type": "string" },
          "threat_ref": { "type": "string" },
          "strategy_description": { "type": "string" },
          "implementation_status": {
            "type": "string",
            "enum": ["IMPLEMENTED", "PLANNED", "ACCEPTED_RESIDUAL"]
          }
        }
      }
    },
    "residual_risk": {
      "type": "string",
      "description": "تقييم المخاطر المتبقية بعد تطبيق التدابير الوقائية"
    }
  }
}
```
