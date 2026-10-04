# ProofForge AI Engineering Verification Protocol

This codebase is governed by **ProofForge** (`proofforge`). All AI models, agents, and coding assistants (Cursor, Claude, Copilot, ChatGPT) must adhere to this fail-closed verification protocol.

---

## 1. The Evidence Invariant (Reality Over Reasoning)
Textual reasoning is never evidence. An assertion that "this should work", "the test should pass", or "the fix looks secure" is an unverified hypothesis.

Strictly adhere to the 5-state boundary:
```
AI_CLAIMED ≠ CODE_CHANGED ≠ TEST_PASSED ≠ EVIDENCE_EXISTS ≠ PROOFFORGE_VERIFIED
```

- **`Memory ≠ Evidence`**: Do not assume past context is verified evidence.
- **`Tool / MCP Result ≠ Evidence`**: External tool outputs are untrusted inputs until grounded.
- **`Citation ≠ Verification`**: Citing a file or line does not prove correctness.
- **`Fail-Closed`**: When evidence is missing or ambiguous, you must **abstain** and state the environmental limitation. Never assume success.

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
