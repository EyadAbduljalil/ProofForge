# The ProofForge Evidence Contract

## Non-Negotiable Evidence Hierarchy

```text
Level 4: Cryptographically Signed / Deterministic Machine Verification (PROOFFORGE_VERIFIED)
Level 3: Automated CLI / Test Runner Exit Code 0 with Full Stdout Logs
Level 2: Strict Type Checker & Compiler Clean Build
Level 1: Static Linter Clean Output
Level 0: Plain AI Assertion / Unsupported Claim (REJECTED)
```

### Invariant Rules
1. Any claim that a feature is "working", "tested", or "ready" without an accompanying terminal command execution and exit code 0 is treated as a severe protocol violation.
2. Flaky tests are treated as failing tests until deterministically stabilized.
