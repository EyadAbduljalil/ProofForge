# Contributing to WebForge OS

Thank you for your interest in contributing to **WebForge OS**!

WebForge OS is an **AI Engineering Rulebook & Quality Framework** designed to enforce engineering standards, security controls, design discipline, validation gates, and cognitive grounding for AI-assisted and human software engineering.

To maintain architectural integrity, determinism, and high security standards, all contributors must adhere to the principles outlined below.

---

## 1. Authoritative Project Identity

Before contributing, understand what WebForge OS is and what it is not:

- **What WebForge OS IS**:
  - An AI Engineering Rulebook & Quality Framework.
  - Stack-agnostic, rule-driven, verification-oriented, and evidence-aware.
  - A systematic repository of rules, instructions, design tokens, security policies, validators, checklists, stack adapters, and cognitive verification mechanisms.
- **What WebForge OS IS NOT**:
  - It is **NOT** a Runtime.
  - It is **NOT** a Code Generator.
  - It is **NOT** an Autonomous Coding Engine.
  - It is **NOT** an LLM Runtime or MCP Server.
  - It is **NOT** a replacement for human authority in critical engineering decisions.

> [!IMPORTANT]
> Pull requests that attempt to convert WebForge OS into an autonomous execution runtime, add code-generation servers, or introduce unverified phases (such as C6, V2.9, or Phase 9) will be rejected.

---

## 2. The Canonical 10-Stage Lifecycle

All rules, workflows, and contributions must align with the Canonical 10-Stage AI Engineering Lifecycle:

```
1. UNDERSTAND ──► 2. INSPECT ──► 3. DETECT ──► 4. SELECT RULES ──► 5. DECIDE
                                                                      │
10. REPORT ◄── 9. VERIFY & EVIDENCE ◄── 8. VALIDATE ◄── 7. IMPLEMENT ◄── 6. PLAN
```

1. **UNDERSTAND**: Clarify intent, scope, domain constraints, and user authority.
2. **INSPECT**: Examine repository facts, manifest files, and project assets.
3. **DETECT**: Identify technology stacks, frameworks, and operational context deterministically.
4. **SELECT RULES**: Bind applicable rules from `core/` and `domains/` based on priority (`P0` Security first).
5. **DECIDE**: Resolve architectural decisions, record ADRs, and identify risk trade-offs.
6. **PLAN**: Formulate atomic, verifiable steps before execution.
7. **IMPLEMENT**: Execute code changes adhering strictly to style guides and security baselines.
8. **VALIDATE**: Run automated checks, type validators, and schema conformance tests.
9. **VERIFY & EVIDENCE**: Ground claims against concrete evidence in the `EvidenceGraph`.
10. **REPORT**: Generate structured, traceable audit reports with unambiguous validation states.

---

## 3. Cognitive Verification & Grounding Framework (CVGF) Rules

If contributing to verification, evidence, or output audit logic:

1. **Preserve Core Axioms**:
   - `Memory ≠ Evidence`: Past memory records provide context, not proof.
   - `Retrieved Content ≠ Evidence`: RAG chunks are claims until independently verified.
   - `Tool Result ≠ Evidence`: Tool outputs are external claims requiring normalization.
   - `MCP Result ≠ Evidence`: External protocol calls operate outside the trust boundary.
   - `LLM Output ≠ Evidence`: Model generations are unverified until validated.
   - `Citation ≠ Verification`: Merely referencing a source does not substantiate a claim.
2. **Fail-Closed by Default**: Any malformed input, missing citation, expired evidence, or unresolved conflict must result in gate rejection or justified abstention (`Abstention ≠ Falsehood`).
3. **Determinism**: Verification logic must yield identical results across repeated executions for the same input.

---

## 4. Development & Testing Requirements

WebForge OS has **zero external npm runtime dependencies**. It relies exclusively on native Node.js (>= 18.0.0) standard modules (`node:test`, `node:assert`, `node:crypto`, `node:fs`, `node:path`, `node:http`).

### Running Tests

Before submitting any pull request, verify that all test suites pass with zero failures:

```bash
# Run full automated test suite (28 test suites, 265 automated tests)
npm test

# Verify repository integrity and registry links
npm run integrity

# Run live E2E integration test
npm run test:e2e
```

**Quality Bar**:
- **0 test failures** permitted (`Exit Code: 0`).
- **0 skipped tests** without explicit, documented architectural justification.
- **100% determinism**: Tests must pass consistently across multiple runs.
- **No secrets or machine-specific paths**: Check that no local absolute paths or personal identifiers are introduced.

---

## 5. Pull Request Process

1. **Fork & Branch**: Create a feature branch with a descriptive name (e.g., `fix/claim-temporal-check` or `docs/adapter-guide`).
2. **Keep Changes Minimal & Focused**: Follow the repair/enhancement policy:
   `FIND ──► REPRODUCE ──► CLASSIFY ──► ROOT CAUSE ──► MINIMAL FIX ──► TEST ──► REGRESSION`
3. **Commit Messages**: Use clear, conventional commit messages:
   - `fix: resolve temporal invalidation edge case in EvidenceGraph`
   - `docs: improve stack adapter documentation for Claude`
   - `test: add negative fuzzing case for GroundingGate`
4. **PR Description**: Detail the motivation, exact changes made, and paste the output of `npm test`.

---

## 6. Code of Conduct

Maintain professional, respectful, and constructive collaboration. Respect architectural constraints and prioritize security and quality over convenience.
