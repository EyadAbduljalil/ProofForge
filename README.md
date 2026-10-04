<div align="center">

<img src="assets/banner.png" alt="ProofForge — AI Engineering Verification Framework" width="100%">

# ProofForge

### AI Engineering Verification Framework

**Build with AI. Verify with Evidence.**

A stack-agnostic, evidence-driven framework for AI-assisted software engineering. ProofForge combines deterministic engineering rules, security boundaries, validation, evidence grounding, claim verification, and auditable quality gates.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen.svg)](package.json)
[![Tests](https://img.shields.io/badge/Tests-276%2F276-success.svg)](#verification)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blue.svg)](.github/workflows/ci.yml)
[![Release](https://img.shields.io/badge/Release-Ready%20with%20Limitations-orange.svg)](#release-status)

</div>

---

## What is ProofForge?

ProofForge is a **verification and governance framework for AI-assisted software development**.

It does not replace your application stack or development environment. It defines how AI-assisted engineering work should be **inspected, constrained, validated, verified, and evidenced**.

### ProofForge is

- Stack-agnostic
- Rule-driven
- Security-first
- Evidence-aware
- Fail-closed
- Auditable
- Designed for human-controlled AI engineering

### ProofForge is not

- An operating system
- A runtime
- A code generator
- An autonomous coding engine
- An LLM runtime
- An MCP server
- A production orchestrator
- A guarantee of zero defects

---

## Core Principle

> **AI output is not proof.**

ProofForge maintains explicit trust boundaries:

| Principle | Meaning |
|---|---|
| **Memory ≠ Evidence** | Previous context does not prove current implementation state. |
| **Retrieved Content ≠ Evidence** | Retrieved material is untrusted until validated. |
| **Tool/MCP Result ≠ Evidence** | Tool output does not become proof automatically. |
| **LLM Output ≠ Evidence** | A model claiming something is fixed does not verify it. |
| **Citation ≠ Verification** | A reference does not prove the referenced behavior is correct. |

Verification states remain distinct:

~~~text
AI_CLAIMED
    ↓
CODE_CHANGED
    ↓
TEST_PASSED
    ↓
EVIDENCE_EXISTS
    ↓
PROOFFORGE_VERIFIED
~~~

---

## Canonical Engineering Lifecycle

~~~text
UNDERSTAND
    ↓
INSPECT
    ↓
DETECT
    ↓
SELECT RULES
    ↓
DECIDE
    ↓
PLAN
    ↓
IMPLEMENT
    ↓
VALIDATE
    ↓
VERIFY & EVIDENCE
    ↓
REPORT
~~~

Traceability:

~~~text
Requirement
    ↓
Applicable Rule
    ↓
Decision
    ↓
Change
    ↓
Test
    ↓
Evidence
    ↓
Verification
    ↓
Report
~~~

---

## Architecture

~~~text
ProofForge/
├── .github/                   # CI/CD
├── assets/                    # Visual assets
│
├── 01-KNOWLEDGE/              # Canonical engineering knowledge
├── 02-AI-INSTRUCTIONS/        # AI engineering instructions
├── 03-DESIGN/                 # Design standards
├── 04-ENGINEERING/            # Engineering standards
├── 05-SECURITY/               # Security standards
├── 06-VALIDATORS/             # Validation rules and gates
├── 07-STACK-ADAPTERS/         # Stack compatibility
├── 08-TEMPLATES & BLUEPRINTS/ # Reusable templates
│
├── apps/                      # Application components
├── bin/                       # CLI
├── packages/                  # Executable ProofForge components
├── registry/                  # Canonical registries
├── tests/                     # Repository-level tests
├── legacy/                    # Isolated historical material
│
├── AGENT.md                   # AI agent operating rules
├── PROOFFORGE_AI_ADOPTION.md  # Adoption guide
├── SECURITY.md                # Security policy
├── CONTRIBUTING.md            # Contribution guide
├── CHANGELOG.md               # Release history
└── README.md                  # Project entry point
~~~

---

## CVGF

The **Cognitive Verification & Grounding Framework (CVGF)** is the evidence-verification core.

~~~text
Request
  ↓
Intent / Context
  ↓
Evidence Requirements
  ↓
Rules / Agents / Skills
  ↓
Evidence Normalization
  ↓
Claim Extraction
  ↓
Claim ↔ Evidence Verification
  ↓
Conflict / Temporal / Scope Validation
  ↓
Grounding Gate
  ↓
Output Verification
  ↓
Audit Evidence
~~~

Core engines:

- EvidenceGraph
- ClaimVerificationEngine
- GroundingGate
- OutputVerificationEngine
- AgentAuditRecorder
- AgentPermissionBoundary

---

## Security Model

Security is treated as **P0**.

ProofForge uses:

- Fail-closed validation
- Least-privilege permission boundaries
- Untrusted repository/content handling
- Prompt-injection defenses
- Evidence poisoning defenses
- Path and loader validation
- Scope and provenance checks
- Temporal evidence validation
- Agent handoff controls
- Tool/MCP trust boundaries

ProofForge does **not** claim immunity to all prompt-injection techniques or absolute security.

---

## Agents, Skills & Governance

~~~text
WHO performs the work
        ↓
Agent Contract

WHAT capability is used
        ↓
Skill Contract

WHAT rules govern it
        ↓
ProofForge Rules

WHAT proves the result
        ↓
Evidence + Verification
~~~

External agent catalogs can be adapted to ProofForge contracts without becoming trusted authorities.

---

## CLI

### Install

~~~bash
git clone https://github.com/EyadAbduljalil/ProofForge.git
cd ProofForge
npm ci
~~~

### Verify the repository

~~~bash
npm run integrity
npm run proofforge
npm test
~~~

### Machine-readable verification

~~~bash
node bin/webforge.js verify --json
~~~

### Other commands

~~~bash
node bin/webforge.js test
node bin/webforge.js security
node bin/webforge.js verify
node bin/webforge.js e2e
node bin/webforge.js profile
node bin/webforge.js trace
~~~

---

## Verification

Current repository verification baseline:

| Check | Result |
|---|---|
| npm ci | PASS |
| npm audit | 0 known vulnerabilities |
| npm run integrity | PASS |
| npm run proofforge | PASS |
| npm test | 276 / 276 PASS |
| TAP blocks | 24 |
| Test sub-suites | 97 |
| Failed tests | 0 |
| Skipped / cancelled | 0 |
| Contracts verification | PASS |
| Hardening E2E | PASS |
| Independent project trial | PASS |
| Release working tree | Clean |

A passing test suite is evidence for the tested scope. It is not a mathematical guarantee that undiscovered defects do not exist.

---

## CI/CD

The canonical workflow is:

~~~text
Checkout
  ↓
Node.js Matrix
  ↓
npm ci
  ↓
npm audit
  ↓
npm run integrity
  ↓
npm run proofforge
  ↓
npm test
~~~

GitHub Actions is configured for Node.js 18, 20, and 22.

The workflow fails when a required verification step fails.

---

## Release Status

**Current release gate: RELEASE READY WITH LIMITATIONS**

Remaining limitations are environmental rather than missing core architecture:

1. Direct cloud execution of GitHub Actions cannot be independently confirmed from the current execution environment.
2. The independent project trial is bounded and local; it does not represent a distributed multi-region production deployment.
3. Prompt-injection defenses cover tested attack families and known patterns; they are not an absolute guarantee against future novel language-based attacks.

These limitations are intentionally disclosed rather than hidden.

---

## AI Adoption

For integrating ProofForge into an AI-assisted development workflow:

**[PROOFFORGE_AI_ADOPTION.md](PROOFFORGE_AI_ADOPTION.md)**

For repository-level AI behavior:

**[AGENT.md](AGENT.md)**

---

## Security

Security issues should be reported privately according to:

**[SECURITY.md](SECURITY.md)**

Do not publish undisclosed vulnerabilities in public issues or pull requests.

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

All changes should preserve:

- P0 security priority
- fail-closed behavior
- evidence traceability
- deterministic validation
- regression coverage
- explicit limitations

---

## License

ProofForge is released under the **MIT License**.

See [LICENSE](LICENSE).

---

<div align="center">

**ProofForge — Build with AI. Verify with Evidence.**

</div>
