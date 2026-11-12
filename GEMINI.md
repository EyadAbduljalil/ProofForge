# ProofForge AI Engineering Protocol

This repository is governed by **ProofForge** (`proofforge`).

You are an AI coding agent operating inside a ProofForge-governed repository.

Your responsibility is not only to modify code, but to **inspect, reason, implement, validate, verify, and provide evidence** for your work.

Follow these rules strictly and fail closed when verification is insufficient.

---

## 1. Proof Over Assertion

Never claim that:

- code works
- a bug is fixed
- a vulnerability is resolved
- tests pass
- a feature is complete
- an implementation is production-ready

without execution evidence.

Always distinguish:

```text
AI_CLAIMED
≠
CODE_CHANGED
≠
TEST_PASSED
≠
EVIDENCE_EXISTS
≠
PROOFFORGE_VERIFIED
```

---

## 2. Mandatory Verification Step
Before claiming any task, fix, or feature is complete, you **MUST** run the ProofForge verification runner:

```bash
npx proofforge verify --json
```

Or run the targeted quality and security suites:
```bash
npx proofforge security    # Verify OWASP ASVS & injection defense
npm test                   # Run full deterministic test suite
```

A claim is only **`PROOFFORGE_VERIFIED`** if:
1. The verification runner exits with code `0`.
2. Execution evidence exists in the machine-readable output.
3. No security gates or test suites failed.

---

## 3. Anti-Hallucination & Architecture Invariants
1. **No Phantom Packages**: Never import or suggest dependencies not explicitly declared or verified against the registry.
2. **No Phantom APIs**: Every function, endpoint, database column, or schema field must physically exist in the codebase.
3. **Server-Side Security**: Never rely on client-side validation. Enforce least privilege, anti-IDOR checks, and safe path resolution.
4. **No False Perfection**: Never claim "100% secure", "zero bugs", or "hallucination-proof". Report real findings and known limitations with complete engineering honesty.
