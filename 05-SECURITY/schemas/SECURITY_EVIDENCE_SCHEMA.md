# مخطط الأدلة وإثباتات التحقق الأمني (Security Evidence Schema)

## نظرة عامة
يحدد هذا المخطط البنية الهيكلية المعيارية لتسجيل وتوثيق الأدلة التثبيتية (Evidence Records) وإثباتات الاستغلال (Proof of Exploit) وإثباتات المعالجة (Proof of Fix) لضمان موثوقية القرارات الأمنية.

---

## 1. بنية المخطط (JSON Schema Definition)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeSecurityEvidence",
  "type": "object",
  "required": [
    "evidence_id",
    "finding_ref",
    "timestamp",
    "evidence_type",
    "collector",
    "target_component",
    "execution_trace",
    "assertion_result",
    "reproducibility",
    "integrity_hash"
  ],
  "properties": {
    "evidence_id": {
      "type": "string",
      "pattern": "^EVD-SEC-[0-9]{4,}$",
      "description": "المعرف الفريد لسجل الدليل الأمني"
    },
    "finding_ref": {
      "type": "string",
      "pattern": "^(SEC-FIND-[0-9]{4,}|SEC-RULE-[0-9]{3}|AUDIT-[A-Z0-9_-]+)$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "evidence_type": {
      "type": "string",
      "enum": [
        "STATIC_ANALYSIS_TRACE",
        "DYNAMIC_EXECUTION_LOG",
        "EXPLOIT_PAYLOAD_PROOF",
        "SECURITY_TEST_ASSERTION",
        "NETWORK_TRAFFIC_CAPTURE",
        "CRYPTOGRAPHIC_VERIFICATION",
        "CANONICAL_AUDIT_DIFF"
      ]
    },
    "collector": {
      "type": "string",
      "description": "الأداة أو المحرك الأمني المسؤول عن جمع الدليل"
    },
    "target_component": {
      "type": "object",
      "required": ["path"],
      "properties": {
        "path": { "type": "string" },
        "line_number": { "type": "integer" },
        "symbol": { "type": "string" }
      }
    },
    "execution_trace": {
      "type": "object",
      "required": ["input_payload", "observed_output", "execution_exit_code"],
      "properties": {
        "input_payload": { "type": "string" },
        "observed_output": { "type": "string" },
        "execution_exit_code": { "type": "integer" },
        "call_stack": { "type": "array", "items": { "type": "string" } }
      }
    },
    "assertion_result": {
      "type": "string",
      "enum": ["VULNERABILITY_CONFIRMED", "VULNERABILITY_MITIGATED", "INVARIANT_PRESERVED", "REGRESSION_DETECTED"]
    },
    "reproducibility": {
      "type": "object",
      "required": ["is_deterministic", "reproduction_command"],
      "properties": {
        "is_deterministic": { "type": "boolean" },
        "reproduction_command": { "type": "string" }
      }
    },
    "integrity_hash": {
      "type": "string",
      "pattern": "^sha256:[a-f0-9]{64}$",
      "description": "بصمة التجزئة المشفرة لسجل الدليل لضمان عدم التلاعب"
    }
  }
}
```
