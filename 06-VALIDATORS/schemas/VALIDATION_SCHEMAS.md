# المخططات المعيارية لطبقة التحقق وبوابات الجودة (Validation Layer Schemas)

## نظرة عامة
تحدد هذه الوثيقة المخططات الهيكلية المعيارية الخمسة (JSON Schemas) التي تحكم كافة مخرجات وعقود وبوابات الجودة في نظام WebForge OS.

---

## 1. مخطط نتيجة التحقق (Validation Result Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeValidationResult",
  "type": "object",
  "required": [
    "validation_id",
    "rule_id",
    "validator_id",
    "status",
    "severity",
    "applicability",
    "target",
    "validation_method",
    "evidence_refs",
    "rationale",
    "timestamp"
  ],
  "properties": {
    "validation_id": { "type": "string", "pattern": "^VAL-RES-[0-9]{4,}$" },
    "rule_id": { "type": "string" },
    "validator_id": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["PASS", "VERIFIED", "FAIL", "WARNING", "NOT_APPLICABLE", "ENVIRONMENT_LIMITATION", "NOT_TESTED", "INSUFFICIENT_EVIDENCE"]
    },
    "severity": {
      "type": "string",
      "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]
    },
    "applicability": {
      "type": "string",
      "enum": ["APPLICABLE", "NOT_APPLICABLE", "UNKNOWN"]
    },
    "target": {
      "type": "object",
      "required": ["component_path"],
      "properties": {
        "component_path": { "type": "string" },
        "line_range": { "type": "string" },
        "symbol": { "type": "string" }
      }
    },
    "validation_method": { "type": "string" },
    "evidence_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "finding_ref": { "type": "string" },
    "verifier_ref": { "type": "string" },
    "rationale": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

---

## 2. مخطط عقد المدقق (Validator Contract Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeValidatorContract",
  "type": "object",
  "required": [
    "validator_id",
    "name",
    "domain",
    "target_rules",
    "validation_method",
    "required_capabilities",
    "execution_constraints",
    "output_contract"
  ],
  "properties": {
    "validator_id": { "type": "string", "pattern": "^VAL-[A-Z]+-[0-9]{3}$" },
    "name": { "type": "string" },
    "domain": {
      "type": "string",
      "enum": ["security", "engineering", "design", "knowledge", "governance"]
    },
    "target_rules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "validation_method": { "type": "string" },
    "required_capabilities": {
      "type": "array",
      "items": { "type": "string" }
    },
    "execution_constraints": {
      "type": "object",
      "required": ["read_only", "network_access", "timeout_ms"],
      "properties": {
        "read_only": { "type": "boolean" },
        "network_access": { "type": "boolean" },
        "timeout_ms": { "type": "integer" }
      }
    },
    "output_contract": {
      "type": "object",
      "required": ["generates_evidence", "deterministic"],
      "properties": {
        "generates_evidence": { "type": "boolean" },
        "deterministic": { "type": "boolean" }
      }
    }
  }
}
```

---

## 3. مخطط بوابة الجودة (Quality Gate Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeQualityGate",
  "type": "object",
  "required": [
    "gate_id",
    "gate_type",
    "scope",
    "decision",
    "evaluated_rules_count",
    "blocking_findings_count",
    "policy_evaluations",
    "timestamp"
  ],
  "properties": {
    "gate_id": { "type": "string", "pattern": "^GATE-[A-Z0-9_-]+$" },
    "gate_type": {
      "type": "string",
      "enum": ["RULE_GATE", "DOMAIN_GATE", "RELEASE_GATE"]
    },
    "scope": { "type": "string" },
    "decision": {
      "type": "string",
      "enum": ["PASS", "FAIL", "BLOCKED"]
    },
    "evaluated_rules_count": { "type": "integer" },
    "blocking_findings_count": { "type": "integer" },
    "policy_evaluations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["policy_name", "passed", "blocking_severity"],
        "properties": {
          "policy_name": { "type": "string" },
          "passed": { "type": "boolean" },
          "blocking_severity": { "type": "string" }
        }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

---

## 4. مخطط تقرير التحقق (Validation Report Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeValidationReport",
  "type": "object",
  "required": [
    "report_id",
    "project_name",
    "run_timestamp",
    "overall_gate_decision",
    "summary_metrics",
    "validation_results",
    "findings_summary"
  ],
  "properties": {
    "report_id": { "type": "string", "pattern": "^REP-VAL-[0-9]{4,}$" },
    "project_name": { "type": "string" },
    "run_timestamp": { "type": "string", "format": "date-time" },
    "overall_gate_decision": {
      "type": "string",
      "enum": ["PASS", "FAIL", "BLOCKED"]
    },
    "summary_metrics": {
      "type": "object",
      "required": ["total_rules", "passed", "verified", "failed", "warnings", "not_applicable"],
      "properties": {
        "total_rules": { "type": "integer" },
        "passed": { "type": "integer" },
        "verified": { "type": "integer" },
        "failed": { "type": "integer" },
        "warnings": { "type": "integer" },
        "not_applicable": { "type": "integer" }
      }
    },
    "validation_results": {
      "type": "array",
      "items": { "type": "object" }
    },
    "findings_summary": {
      "type": "object",
      "required": ["critical", "high", "medium", "low"],
      "properties": {
        "critical": { "type": "integer" },
        "high": { "type": "integer" },
        "medium": { "type": "integer" },
        "low": { "type": "integer" }
      }
    }
  }
}
```

---

## 5. مخطط مرجع الدليل (Evidence Reference Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeEvidenceReference",
  "type": "object",
  "required": [
    "evidence_ref_id",
    "evidence_id",
    "target_rule",
    "evidence_class",
    "integrity_hash",
    "is_stale"
  ],
  "properties": {
    "evidence_ref_id": { "type": "string", "pattern": "^REF-EVD-[0-9]{4,}$" },
    "evidence_id": { "type": "string", "pattern": "^EVD-SEC-[0-9]{4,}$" },
    "target_rule": { "type": "string" },
    "evidence_class": {
      "type": "string",
      "enum": ["DIRECT", "TEST_GENERATED", "TOOL_GENERATED", "DERIVED", "MANUAL", "INFERRED"]
    },
    "integrity_hash": { "type": "string", "pattern": "^sha256:[a-f0-9]{64}$" },
    "is_stale": { "type": "boolean" }
  }
}
```

