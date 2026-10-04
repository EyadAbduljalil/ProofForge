<div align="center">

<img src="assets/banner.png" alt="ProofForge — AI Engineering Verification Framework" width="100%">

# ProofForge

### AI Engineering Verification Framework

**Build with AI. Verify with Evidence.**

A deterministic, evidence-driven verification and governance framework for AI-assisted software engineering. ProofForge establishes strict cognitive boundaries, enforces fail-closed engineering rules, tracks verifiable claims through an evidence graph, and governs multi-agent workflows.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen.svg)](package.json)
[![Integrity](https://img.shields.io/badge/Integrity-Fully%20Verified-success.svg)](tests/integrity_test.js)
[![CI Pipeline](https://img.shields.io/badge/CI-GitHub%20Actions-blue.svg)](.github/workflows/ci.yml)
[![Release Gate](https://img.shields.io/badge/Release%20Gate-READY%20WITH%20LIMITATIONS-orange.svg)](#release-status)

</div>

---

## What is ProofForge?

ProofForge is an **authoritative verification, governance, and evidence framework** designed specifically for AI-assisted and agentic software development.

As AI models take on complex coding tasks, traditional trust assumptions break down: language models frequently fabricate dependencies, claim test successes that never occurred, promote ungrounded assumptions to facts, and fail silently against subtle security flaws.

ProofForge sits between the AI and your codebase as a **deterministic, fail-closed arbiter**. It ensures that no claim is accepted without cryptographic proof, no agent operates outside authorized boundaries, and no code is certified without verifiable execution evidence.

### ProofForge is:
- **Rule-Driven**: Governed by strict P0 security baselines and architectural invariants.
- **Evidence-Aware**: Requires cryptographic hashes, test traces, and audit chains for every claim.
- **Security-First**: Enforces OWASP ASVS Level 2, anti-IDOR, path traversal guards, and prompt injection defense.
- **Fail-Closed**: Any missing, malformed, or conflicting evidence halts promotion automatically.
- **Stack-Agnostic**: Compatible with web services, backend APIs, distributed systems, and CLI tools.
- **Deterministic**: Produces reproducible machine-readable verification outputs and unique run identities.

### ProofForge is NOT:
- **Not an LLM** (it does not generate tokens or replace foundational models).
- **Not an autonomous coding agent** (it governs agents; it does not replace the developer).
- **Not a code generator** (it verifies code quality and security rather than synthesizing boilerplate).
- **Not an MCP server** (it treats MCP tools as untrusted boundaries requiring governance).
- **Not a production orchestrator** (it validates readiness before deployment).
- **Not a guarantee of absolute security** (it provides defense-in-depth, not theoretical perfection).
- **Not a guarantee of zero hallucinations** (it detects and isolates hallucinations via grounding gates).

---

## Core Philosophy: The Evidence Invariants

In ProofForge, belief is separated from truth. The framework strictly enforces the following constitutional boundaries:

```
  Memory               ≠  Evidence
  Retrieved Content    ≠  Evidence
  Tool / MCP Result    ≠  Evidence
  LLM Claim / Output   ≠  Evidence
  Citation             ≠  Verification
```

When evidence is missing, conflicting, or stale:
$$\text{Insufficient Evidence} \longrightarrow \textbf{Abstain / Environmental Limitation}$$

---

## Evidence Hierarchy & Five States

A fundamental innovation of ProofForge is the non-interchangeable separation of engineering claims into five distinct deterministic states:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌───────────────────────┐
│  AI_CLAIMED  │ ≠≠> │ CODE_CHANGED │ ≠≠> │ TEST_PASSED  │ ≠≠> │ EVIDENCE_EXISTS │ ≠≠> │  PROOFFORGE_VERIFIED  │
└──────────────┘     └──────────────┘     └──────────────┘     └─────────────────┘     └───────────────────────┘
```

1. **`AI_CLAIMED`**: The model asserts that a requirement, fix, or feature was implemented. Treated as unverified hypothesis.
2. **`CODE_CHANGED`**: Concrete files and AST modifications exist on disk with verifiable SHA-256 hashes.
3. **`TEST_PASSED`**: A deterministic test runner executed against the modified code and exited with code 0.
4. **`EVIDENCE_EXISTS`**: Formal evidence nodes with provenance, hashes, and execution logs are grounded in the `EvidenceGraph`.
5. **`PROOFFORGE_VERIFIED`**: The authoritative `ClaimVerificationEngine` and `CVGF` gate evaluated the evidence and certified the claim.

---

## Verification Lifecycle

Every engineering run governed by ProofForge progresses through an authoritative ten-step deterministic lifecycle:

```
UNDERSTAND ──> INSPECT ──> DETECT ──> SELECT RULES ──> DECIDE ──> PLAN ──> IMPLEMENT ──> VALIDATE ──> VERIFY & EVIDENCE ──> REPORT
```

1. **UNDERSTAND**: Analyze the target scope, intent, and project constraints.
2. **INSPECT**: Read live repository components, schemas, and calculate source artifact hashes.
3. **DETECT**: Identify requirements, architectural invariants, and security surface areas.
4. **SELECT RULES**: Bind applicable P0 security rules, ASVS standards, and domain policies.
5. **DECIDE**: Authoritatively select the required workflow, model policies, agents, and skills.
6. **PLAN**: Generate a deterministic step-by-step implementation plan.
7. **IMPLEMENT**: Execute modifications or governed tool operations within strict sandbox constraints.
8. **VALIDATE**: Enforce server-side permissions, Least Privilege, and path boundaries via `PathLoaderGuard`.
9. **VERIFY & EVIDENCE**: Ground execution artifacts into `EvidenceGraph`, verify claims via CVGF, and execute governed handoffs.
10. **REPORT**: Commit audit trail to `AgentAuditRecorder` and emit machine-readable JSON with unique Run Identity.

---

## The CVGF Architecture (Cognitive Verification & Grounding Framework)

ProofForge embeds the 5-stage **CVGF Engine** to guarantee cognitive and structural integrity:

| Stage | Name | Role & Responsibility |
|---|---|---|
| **C1** | **Cognitive Verification** | Enforces authority hierarchy, rule precedence, anti-hallucination guardrails, and decision trees. |
| **C2** | **Evidence & Claim Intelligence** | Operates `EvidenceGraph`, resolves conflicting claims, and links artifacts to cryptographic hashes. |
| **C3** | **Grounding & Output Verification** | Blocks ungrounded assertions, enforces strict grounding gates, and sanitizes outgoing artifacts. |
| **C4** | **Adversarial Testing & Repair** | Defends against prompt injection, citation spoofing, memory boundary poisoning, and safe autonomous repair. |
| **C5** | **Integration & Release Audit** | Executes full regression suites, audits supply chains, and evaluates final release gates. |

---

## Agent & Skill Governance System

ProofForge introduces strict institutional governance over multi-agent workflows:

- **Agents (`AgentRegistry`)**: Define *who* performs work (`PF-ARCH-001`, `PF-SEC-001`, `PF-QA-001`, etc.), specifying their role, authority level, and allowed operational scopes.
- **Skills (`SkillRegistry`)**: Define *what* capability is applied (`PF-SKILL-SECURITY-REVIEW`, `PF-SKILL-TESTING-REVIEW`, etc.), declaring required inputs, outputs, and constraints.
- **Agent ↔ Skill Mappings (`AgentSkillMappingRegistry`)**: Enforces explicit authorization matrices. An agent cannot invoke a skill unless explicitly mapped.
- **Workflows (`WorkflowRegistry`)**: Orchestrates ordered multi-agent pipelines with defined steps, error handling, and rollback procedures.
- **Handoff Contracts (`AgentHandoffContract`)**: Governs the transfer of artifacts and claims between agents. Anti-escalation invariants ensure target agents cannot inherit higher privileges than the source.

---

## Security & Defense-in-Depth

Security in ProofForge is enforced natively through zero-dependency, fail-closed components:

- **Path & Loader Security (`PathLoaderGuard`)**: All registry and configuration loaders enforce strict boundary validation. Rejects Null-byte injection (`\0`), path traversal (`../`), absolute path escapes, and unapproved extensions.
- **AI Security Guard (`AISecurityGuard`)**: Scans incoming prompts and context for direct and indirect prompt injections, adversarial overrides, rule-bypass requests, and authority impersonation in both English and Arabic.
- **Tool & MCP Governance (`ToolRegistry`)**: Tool results are treated as untrusted external inputs. Direct tool output is prohibited from automatically generating verified claims without secondary validation.
- **Audit Ledger (`AgentAuditRecorder`)**: Cryptographically signs and records every change, handoff, and verification event, scrubbing API keys and credentials automatically.

---

## Repository Structure

```
ProofForge/
├── bin/                          # Canonical CLI entry points (webforge, proofforge)
├── packages/
│   ├── contracts/                # Core contracts, registries, PathLoaderGuard, ProofRunEngine
│   ├── orchestration/            # EvidenceGraph, ClaimVerificationEngine, GroundingGate, CVGF
│   ├── security/                 # AISecurityGuard, AgentPermissionBoundary, ASVS controls
│   ├── security-governance/      # Threat modeling, attack surface, supply chain, audit ledger
│   ├── components/               # Core domain components & UI validators
│   ├── design-system/            # Anti-slop visual & typography design system
│   ├── infrastructure/           # Database, caching, and container adaptors
│   ├── state-machine/            # Deterministic state machine verifier
│   └── vulnerability-lab/        # Adversarial exploit simulation & verification lab
├── registry/                     # Canonical JSON Registries (agents, skills, mappings, policies, tools)
├── tests/                        # Repository integrity & end-to-end integration test suites
├── prompt/                       # Constitutional instructions (WEBFORGE_CONSTITUTION.md)
├── reports/                      # Release verification and audit reports
├── .github/                      # CI/CD Workflows (GitHub Actions)
├── package.json                  # Zero-dependency package manifest & script runner
└── README.md                     # Public documentation
```

---

## Quick Start & Installation

### Prerequisites
- **Node.js**: `>=18.0.0`
- **npm**: `>=9.0.0`
- **Git**

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/EyadAbduljalil/ProofForge.git
cd ProofForge

# 2. Clean install dependencies (zero external runtime dependencies)
npm ci

# 3. Verify deterministic module load & canonical registries
npm run proofforge

# 4. Run repository integrity checks
npm run integrity

# 5. Execute full quality, security, and verification test suites
npm test
```

---

## CLI & Machine-Readable Output

ProofForge includes a comprehensive CLI that produces deterministic, machine-readable JSON outputs for automated pipelines.

### Execute Bounded Run with Machine-Readable JSON
```bash
node bin/webforge.js verify --json
# or via npm script:
npm run verify -- --json
```

### Sample Output:
```json
{
  "run_identity": {
    "run_id": "PF-RUN-20261004-EC0SC7",
    "timestamp": "2026-10-04T22:32:17.535Z",
    "project": "WebForge OS Production Verification",
    "commit_sha": "2906874c13f256e67c82d13187b65fd926325936",
    "framework_version": "1.0.0",
    "registries_version": {
      "agents": 10,
      "skills": 29,
      "mappings": 18,
      "workflows": 6,
      "policies": 5,
      "tools": 5
    }
  },
  "evidence_hierarchy_distinction": {
    "AI_CLAIMED": true,
    "CODE_CHANGED": true,
    "TEST_PASSED": true,
    "EVIDENCE_EXISTS": true,
    "PROOFFORGE_VERIFIED": true
  },
  "claims": [
    {
      "claim_id": "CLM-PF-RUN-20261004-EC0SC7-001",
      "statement": "Service enforces OWASP ASVS Level 2 and Anti-IDOR tenant isolation",
      "verified": true,
      "status": "VERIFIED"
    }
  ],
  "status": "VERIFIED",
  "final_gate": "READY WITH LIMITATIONS",
  "exit_code": 0
}
```

---

## Continuous Integration (CI/CD)

The repository includes a strict GitHub Actions workflow (`.github/workflows/ci.yml`) that validates every push and pull request across Node.js `18.x`, `20.x`, and `22.x`:

1. `npm ci` — Deterministic clean installation.
2. `npm run integrity` — Structural repository integrity and registry mapping validation.
3. `npm run proofforge` — Deterministic module loading of all 16 contracts, registries, and CVGF engines.
4. `npm test` — Master regression suite (Security, Governance, Contracts, E2E, and Adversarial Lab).

---

## Operational Limitations

In accordance with ProofForge's constitutional commitment to honest engineering, the following limitations are formally recorded:
- **Cloud Infrastructure Execution**: Full GitHub Actions remote runs require external GitHub runners; local verification simulates all workflow steps.
- **Trial Environments**: Independent project verification was evaluated against local sandboxed services and SQLite; distributed multi-region cloud clusters remain unverified.
- **Prompt Injection Bounds**: While known direct and indirect attack vectors are neutralized via regex and AST patterns, no AI system can claim 100% immunity to novel linguistic evasion techniques.
- **Evidence Boundary**: Verification is strictly bounded by the evidence provided. ProofForge abstains when evidence is insufficient or ambiguous.

---

## Release Status & Gate

```
================================================================================
   FINAL GATE: RELEASE READY WITH LIMITATIONS
================================================================================
```

---

## License

This project is licensed under the [MIT License](LICENSE).
