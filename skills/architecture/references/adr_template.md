# Architecture Decision Record (ADR) Template

```json
{
  "id": "ADR-00X",
  "timestamp": "2026-11-13T00:00:00.000Z",
  "title": "Short descriptive title of the decision",
  "status": "APPROVED",
  "context": "Clear explanation of the problem, constraints, and business/technical requirements",
  "options_considered": [
    {
      "name": "Option A",
      "pros": ["Reason 1", "Reason 2"],
      "cons": ["Drawback 1"]
    },
    {
      "name": "Option B",
      "pros": ["Reason 1"],
      "cons": ["Drawback 1", "Drawback 2"]
    }
  ],
  "decision": "The chosen option and why it was selected over alternatives",
  "consequences": {
    "positive": ["Benefit 1", "Benefit 2"],
    "negative": ["Known tradeoff", "Mitigation required"]
  },
  "compliance_rules": ["SEC-AUTH-001", "ENG-ARCH-001"],
  "validation_evidence": "Passes all state-machine and integration test suites"
}
```
