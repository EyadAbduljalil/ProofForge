# المخططات المعيارية لطبقة التحقق الإدراكي والادعاءات (Cognitive Evidence & Claim Schemas - Stage C2)

## نظرة عامة
تحدد هذه الوثيقة المخططات الهيكلية المعيارية لادعاءات وأدلة التحقق الإدراكي في مرحلة C2، بما يتوافق مع بنية `packages/orchestration/claim-verification-engine.js` ومدقق `packages/contracts/schema-validator.js`.

---

## 1. مخطط الادعاء الذري (Atomic Claim Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeAtomicClaim",
  "type": "object",
  "required": [
    "claim_id",
    "statement",
    "claim_type",
    "required_evidence_level",
    "status",
    "created_at"
  ],
  "properties": {
    "claim_id": { "type": "string", "pattern": "^CLM-[0-9]{4,}.*$" },
    "statement": { "type": "string", "minLength": 5 },
    "claim_type": {
      "type": "string",
      "enum": ["FACTUAL", "TECHNICAL", "ARCHITECTURAL", "SECURITY", "BEHAVIORAL", "CONFIGURATION", "TEMPORAL", "DEPENDENCY", "POLICY", "DERIVED"]
    },
    "target_artifact": { "type": "string" },
    "artifact_hash": { "type": "string" },
    "required_evidence_level": {
      "type": "string",
      "enum": ["L0_UNSUPPORTED", "L1_CONTEXT_ONLY", "L2_STATIC_ANALYSIS", "L3_DYNAMIC_PROOF", "L4_MULTI_DIMENSIONAL"]
    },
    "status": {
      "type": "string",
      "enum": ["VERIFIED", "INSUFFICIENT_EVIDENCE", "CONFLICTED", "INVALIDATED", "FAIL", "ENVIRONMENT_LIMITATION"]
    },
    "evidence_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "created_at": { "type": "string" }
  }
}
```

---

## 2. مخطط ربط ونزاع الأدلة (Evidence Link & Conflict Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeEvidenceLinkAndConflict",
  "type": "object",
  "required": [
    "link_id",
    "claim_id",
    "evidence_id",
    "relation_type",
    "temporal_status"
  ],
  "properties": {
    "link_id": { "type": "string" },
    "claim_id": { "type": "string" },
    "evidence_id": { "type": "string" },
    "relation_type": {
      "type": "string",
      "enum": ["SUPPORTS", "CONTRADICTS", "QUALIFIES", "SUPERSEDES", "DERIVED_FROM", "INVALIDATES", "INSUFFICIENT_FOR"]
    },
    "temporal_status": {
      "type": "string",
      "enum": ["CURRENT", "STALE", "SUPERSEDED", "INVALIDATED", "UNKNOWN"]
    },
    "conflict_detected": { "type": "boolean" },
    "conflict_type": { "type": "string" }
  }
}
```

---

## 3. مخطط نتيجة التأصيل الإدراكي (Grounding Result Schema - Stage C3)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeGroundingResult",
  "type": "object",
  "required": [
    "verdict",
    "decision",
    "grounded",
    "reason",
    "claimsSummary"
  ],
  "properties": {
    "verdict": {
      "type": "string",
      "enum": ["GROUNDED", "GROUNDED_WITH_LIMITATIONS", "INSUFFICIENT_EVIDENCE", "CONFLICTED", "STALE_EVIDENCE", "UNVERIFIED", "ENVIRONMENT_LIMITATION", "REJECTED"]
    },
    "decision": {
      "type": "string",
      "enum": ["PERMIT", "QUALIFY", "ABSTAIN", "BLOCK"]
    },
    "grounded": { "type": "boolean" },
    "isPartiallyGrounded": { "type": "boolean" },
    "coverageRatio": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "reason": { "type": "string" },
    "claimsSummary": {
      "type": "object",
      "required": ["total", "grounded", "conflicted", "stale", "insufficient", "rejected"],
      "properties": {
        "total": { "type": "integer" },
        "grounded": { "type": "integer" },
        "conflicted": { "type": "integer" },
        "stale": { "type": "integer" },
        "insufficient": { "type": "integer" },
        "rejected": { "type": "integer" }
      }
    },
    "limitations": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

---

## 4. مخطط تدقيق مخرجات النموذج (Output Verification Schema - Stage C3)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeOutputVerification",
  "type": "object",
  "required": [
    "status",
    "verdict",
    "decision",
    "grounded",
    "claims",
    "citations"
  ],
  "properties": {
    "status": {
      "type": "string",
      "enum": ["VERIFIED", "QUALIFIED", "ABSTAINED_OR_BLOCKED", "BLOCKED", "INFORMATIONAL_NO_CLAIMS"]
    },
    "verdict": { "type": "string" },
    "decision": { "type": "string" },
    "grounded": { "type": "boolean" },
    "claims": {
      "type": "array",
      "items": { "type": "object" }
    },
    "citations": {
      "type": "array",
      "items": { "type": "object" }
    },
    "unsupportedClaims": {
      "type": "array",
      "items": { "type": "object" }
    }
  }
}
```

---

## 5. مخطط الاستنكاف الإدراكي الصريح (Abstention Result Schema - Stage C3)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WebForgeAbstentionResult",
  "type": "object",
  "required": [
    "abstention_id",
    "reason_code",
    "statement",
    "is_falsehood",
    "timestamp"
  ],
  "properties": {
    "abstention_id": { "type": "string" },
    "reason_code": {
      "type": "string",
      "enum": ["INSUFFICIENT_EVIDENCE", "CONFLICTED_EVIDENCE", "STALE_EVIDENCE", "PROVENANCE_FAILURE", "ENVIRONMENT_LIMITATION"]
    },
    "statement": { "type": "string" },
    "is_falsehood": {
      "type": "boolean",
      "const": false
    },
    "timestamp": { "type": "string" }
  }
}
```

