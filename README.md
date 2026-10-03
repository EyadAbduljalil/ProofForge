<div align="center">

<img src="assets/banner.png" alt="WebForge OS — AI Engineering Rulebook & Quality Framework" width="100%">

<img src="assets/logo.jpg" alt="WebForge OS logo" width="180">

# WebForge OS

### AI Engineering Rulebook & Quality Framework

**A stack-agnostic, rule-driven, verification-oriented framework for AI instructions, engineering standards, security controls, evidence graphs, cognitive grounding, and auditable quality gates.**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](package.json)
[![Tests Passing](https://img.shields.io/badge/Automated%20Tests-265%2F265%20Passed-success.svg)](reports/RELEASE_TEST_REPORT.md)
[![Test Suites](https://img.shields.io/badge/Test%20Suites-28%20Passed-success.svg)](reports/RELEASE_TEST_REPORT.md)
[![Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Node.js)-blueviolet.svg)](package.json)
[![V1 Foundation Gate](https://img.shields.io/badge/V1%20Gate-VERIFIED%20%2F%20COMPLETE-success.svg)](reports/MASTER_FINAL_VERIFICATION_REPORT.md)
[![V2 Enterprise Gate](https://img.shields.io/badge/V2%20Gate-VERIFIED%20WITH%20LIMITATIONS-orange.svg)](reports/WEBFORGE_V2.8_FINAL_GATE_REPORT.md)
[![CVGF C1-C5 Gate](https://img.shields.io/badge/CVGF%20Gate-PASS%20WITH%20LIMITATIONS-orange.svg)](reports/C5_FINAL_GATE_REPORT.md)
[![Release Readiness Gate](https://img.shields.io/badge/Release%20Gate-RELEASE%20READY%20WITH%20LIMITATIONS-orange.svg)](reports/RELEASE_FINAL_GATE_REPORT.md)

[Overview](#-overview) •
[Identity](#-what-webforge-os-is-and-is-not) •
[Philosophy](#-core-philosophy--principles) •
[Architecture](#-system-architecture) •
[10-Stage Lifecycle](#-canonical-10-stage-ai-engineering-lifecycle) •
[CVGF Engine](#-cognitive-verification--grounding-framework-cvgf) •
[Security Model](#-security-model--threat-defense) •
[Verification Results](#-testing--verification-results) •
[Limitations](#-known-operational-limitations) •
[Quick Start](#-installation--quick-start)

</div>

---

## 🌟 Overview

**WebForge OS** is an **AI Engineering Rulebook and Quality Framework**. It provides a structured, single source of truth for software engineering standards, security baselines, design tokens, validation contracts, domain-specific state machines, and cognitive grounding mechanisms.

Modern AI coding agents generate code at unprecedented speeds, but often suffer from hallucinations, ungrounded architectural assertions, security anti-patterns ("AI Slop"), and lack of auditable evidence. WebForge OS solves this fundamental challenge by surrounding the AI engineering process with:

1. **Deterministic Rulebooks**: Clear, hierarchical constraints spanning core principles, design systems, and security policies.
2. **Modular Skill Layers**: 26 specialized engineering skills ensuring best practices across the full technology lifecycle.
3. **Cognitive Verification & Grounding Framework (CVGF)**: An evidence-driven verification pipeline that separates claims from proof, tracks provenance, validates temporal validity, enforces fail-closed gates, and prevents ungrounded generations.

> [!NOTE]
> WebForge OS requires **zero external npm runtime dependencies**. It executes natively across modern Node.js environments (>= 18.0.0) using built-in standard modules.

---

## 🧭 What WebForge OS IS and Is NOT

Establishing an unambiguous boundary between what WebForge OS is and what it is not is fundamental to its architectural integrity:

| What WebForge OS **IS** | What WebForge OS **IS NOT** |
| :--- | :--- |
| **An AI Engineering Rulebook & Quality Framework** | **NOT a Runtime** (does not replace Node, Bun, Docker, or V8) |
| **Stack-Agnostic & Rule-Driven** | **NOT a Code Generator** (does not synthesize code out of thin air) |
| **Verification-Oriented & Evidence-Aware** | **NOT an Autonomous Coding Engine** (human retains decision authority) |
| **A Systematic Knowledge Core** (`core/`, `skills/`, `domains/`) | **NOT an LLM Runtime** (does not host, train, or wrap model inference) |
| **Strict Security & Grounding Enforcer** (OWASP ASVS, CVGF) | **NOT an MCP Server** (rules integrate via stack adapters, not protocols) |
| **Checklists, Adapters & Deterministic Validators** | **NOT a Production Orchestration Platform** (does not replace K8s or CI) |

---

## 🛡️ Core Philosophy & Principles

WebForge OS is constructed on uncompromising software engineering and cybersecurity principles:

### 1. The Priority Ladder (Hierarchy of Authority)
When engineering trade-offs arise, WebForge OS resolves them through an inviolable precedence ladder:
$$\mathbf{P0\ (Security)} \succ \mathbf{P1\ (Reliability\ \&\ Correctness)} \succ \mathbf{P2\ (Performance)} \succ \mathbf{P3\ (Developer\ Experience)} \succ \mathbf{P4\ (Aesthetics)}$$

*No aesthetic or performance convenience may compromise security or correctness.*

### 2. The Six Absolute Prohibitions (اللاءات الست المطلقة)
1. **No Hallucinated Claims**: An output statement without verifiable evidence in the `EvidenceGraph` cannot pass the Grounding Gate.
2. **No Memory-as-Evidence Substitution**: Historical memory records provide context; they do not constitute objective proof (`Memory ≠ Evidence`).
3. **No Retried Chunk Trust**: External retrieval chunks are treated as untrusted claims until independently validated (`Retrieved Content ≠ Evidence`).
4. **No Raw Tool / MCP Trust**: Tool outputs and external API results operate outside the trust boundary until normalized and verified (`Tool/MCP Result ≠ Evidence`).
5. **No Blind Model Authority**: LLM generated text is unverified by definition until verified against test evidence (`LLM Output ≠ Evidence`).
6. **No Citation Spoofing**: Merely citing an identifier or URL does not substantiate a claim without cryptographic or physical verification (`Citation ≠ Verification`).

### 3. Fail-Closed Default
Whenever input is malformed, evidence is missing, conflicting data is detected, or verification times out, WebForge OS **fails closed**:
- The gate rejects or abstains (`ABSTAIN / BLOCK`).
- No speculative fallback passes unverified.
- `Abstention ≠ Falsehood`: Declaring lack of evidence is an honest, justified cognitive state.

---

## 🏛️ System Architecture

WebForge OS orchestrates interactions between developers, AI agents, project assets, and verification engines through a structured pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             USER REQUEST / INTENT                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT & ADAPTIVE STACK DETECTION                       │
│      (Inspects filesystem, manifests, lockfiles, and environment facts)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WEBFORGE RULES & KNOWLEDGE CORE                        │
│   • Priority Ladder (P0-P4)  • Core Principles  • 26 Modular Skills         │
│   • 8 Business Domains       • Checklists       • Design System Tokens      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AI INSTRUCTION FRAMEWORK                           │
│   (Targeted instructions dispatched via prompt adapters: Claude, Cursor,   │
│    Antigravity, Codex, Lovable, v0, Replit, Windsurf, or Generic)           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENGINEERING & IMPLEMENTATION                         │
│   (Strict style guides, parameterized contracts, accessible components)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VALIDATION & CONTRACT CONFORMANCE                        │
│   (Type-safety checks, JSON schemas, security invariants, DOM assertions)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            COGNITIVE VERIFICATION & GROUNDING FRAMEWORK (CVGF)              │
│   ┌───────────────────────────┐         ┌───────────────────────────────┐   │
│   │   ClaimVerificationEngine │ ◄─────► │    Unified EvidenceGraph      │   │
│   └─────────────┬─────────────┘         └───────────────▲───────────────┘   │
│                 │                                       │                   │
│                 ▼                                       │                   │
│   ┌───────────────────────────┐                         │                   │
│   │      GroundingGate        │ (PERMIT / QUALIFY /     │                   │
│   │                           │  ABSTAIN / BLOCK)       │                   │
│   └─────────────┬─────────────┘                         │                   │
│                 │                                       │                   │
│                 ▼                                       │                   │
│   ┌───────────────────────────┐                         │                   │
│   │  OutputVerificationEngine │ ────────────────────────┘                   │
│   │  (Sentence-level audit)   │                                             │
│   └─────────────┬─────────────┘                                             │
└─────────────────┼───────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUDIT TRAIL, EVIDENCE & FINAL REPORT                     │
│         (Sanitized secrets, deterministic exit code, traceable log)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Canonical 10-Stage AI Engineering Lifecycle

WebForge OS formalizes software engineering into a **single canonical 10-stage lifecycle**. All engineering tasks—whether executed by human engineers or AI agents—must progress through these stages:

```
  1. UNDERSTAND ──► 2. INSPECT ──► 3. DETECT ──► 4. SELECT RULES ──► 5. DECIDE
                                                                        │
 10. REPORT ◄── 9. VERIFY & EVIDENCE ◄── 8. VALIDATE ◄── 7. IMPLEMENT ◄── 6. PLAN
```

| Stage | Name | Purpose & Primary Actions |
| :---: | :--- | :--- |
| **1** | **UNDERSTAND** | Clarify the request, objective, scope, domain constraints, and human authority boundaries. |
| **2** | **INSPECT** | Read manifest files (`package.json`), directory structure, existing codebase, and configuration. |
| **3** | **DETECT** | Identify technology stack, framework, database, and package manager deterministically (`StackDetector`). |
| **4** | **SELECT RULES** | Dynamically bind applicable rules from `core/` and `domains/` according to the P0-P4 priority hierarchy. |
| **5** | **DECIDE** | Determine architecture approach, evaluate risk trade-offs, and record Architectural Decision Records (ADRs). |
| **6** | **PLAN** | Formulate atomic, verifiable steps before touching any code. |
| **7** | **IMPLEMENT** | Write minimal, clean, non-speculative code adhering strictly to security and design standards. |
| **8** | **VALIDATE** | Execute automated test suites, type-safety checks, schema validators, and lint rules. |
| **9** | **VERIFY & EVIDENCE** | Ingest test results into the `EvidenceGraph`, verify atomic claims, and pass through the `GroundingGate`. |
| **10** | **REPORT** | Issue structured, auditable completion reports with unambiguous validation states and sanitized logs. |

> [!IMPORTANT]
> The Cognitive Verification & Grounding Framework (CVGF) is **not** a separate lifecycle; it integrates directly into Stages 8, 9, and 10 to guarantee evidence-based reporting.

---

## 🧠 Cognitive Verification & Grounding Framework (CVGF)

The CVGF is the evidence-aware intelligence core of WebForge OS, developed and proven across the C1 through C5 verification path:

```
C1 (Architecture & Contracts) ──► C2 (Evidence & Claims) ──► C3 (Grounding & Verification) ──► C4 (Adversarial Hardening) ──► C5 (Integration & Determinism)
```

### Core Components

1. **`EvidenceGraph`** (`packages/orchestration/evidence-graph.js`):
   - Central directed graph linking Requirements $\to$ Tests $\to$ Artifacts $\to$ Verifications.
   - Enforces cryptographic hashing of source artifacts.
   - Detects code mutations and triggers automatic **temporal invalidation** of stale evidence.
   - Deeply sanitizes sensitive data (API keys, JWTs, Stripe tokens) before recording.

2. **`ClaimVerificationEngine`** (`packages/orchestration/claim-verification-engine.js`):
   - Extracts atomic assertions from outputs and specifications.
   - Evaluates claims against concrete evidence items in the graph.
   - Categorizes claims into `VERIFIED`, `CONTRADICTED`, `EXPIRED`, `UNSUPPORTED`, or `SCOPE_MISMATCH`.
   - Reconciles direct contradictions deterministically.

3. **`GroundingGate`** (`packages/orchestration/grounding-gate.js`):
   - The central policy gate evaluating claim-evidence packages.
   - Emits exactly one of four canonical decisions:
     - `PERMIT`: All claims are grounded with valid, unexpired, non-conflicting evidence.
     - `QUALIFY`: Output contains unverified assertions but non-critical claims; permitted only with explicit qualifications.
     - `ABSTAIN`: Insufficient evidence exists to verify critical claims (`Abstention ≠ Falsehood`).
     - `BLOCK`: Unambiguous contradictions, expired evidence, or security rule violations detected.

4. **`OutputVerificationEngine`** (`packages/orchestration/output-verification-engine.js`):
   - Audits output text sentence-by-sentence.
   - Maps each sentence to verified claims.
   - Flags or redacts ungrounded statements, hallucinated metric claims, and spoofed citations.

5. **`UntrustedRepoGuard`** (`packages/security/untrusted-repo-guard.js`):
   - Sanitizes untrusted user inputs, preventing prompt injections, indirect system prompt overrides, and dangerous command injections.

---

## 📊 Canonical Validation States

WebForge OS employs an unambiguous taxonomy of verification states. No ambiguous or fabricated statuses are permitted:

| State | Semantic Meaning |
| :--- | :--- |
| `PASS` | All automated tests and assertions executed and passed successfully. |
| `VERIFIED` | Claim or capability independently corroborated by concrete, unexpired evidence in the `EvidenceGraph`. |
| `FAIL` | Assertion failed, test error encountered, or security vulnerability detected. |
| `WARNING` | Non-blocking condition detected that requires attention or improvement. |
| `NOT_APPLICABLE` | Check or rule is intentionally excluded due to stack or domain incompatibility (e.g., No SQL checks for pure static sites). |
| `ENVIRONMENT_LIMITATION` | Test cannot execute due to missing hardware or host capabilities (e.g., GPU acceleration or external network access). |
| `NOT_TESTED` | Component was not included in the active test scope. |
| `INSUFFICIENT_EVIDENCE` | Data or evidence is inadequate to make an authoritative assertion, resulting in justified cognitive abstention. |

---

## 🔒 Security Model & Threat Defense

WebForge OS embeds security as an architectural default (`P0`), conforming to **OWASP ASVS Level 2** and defense-in-depth principles:

### Security Boundaries & Implemented Controls

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL UNTRUSTED INPUT                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  UntrustedRepoGuard: Neutralizes prompt injection & command injection       │
├─────────────────────────────────────────────────────────────────────────────┤
│  AgentPermissionBoundary: Least privilege gate & human approval boundaries  │
├─────────────────────────────────────────────────────────────────────────────┤
│  OwnershipGuard: Multi-tenant context enforcement & anti-IDOR isolation     │
├─────────────────────────────────────────────────────────────────────────────┤
│  IdempotencyMiddleware: Distributed lock & atomic financial replay defense   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Password & Crypto: Scrypt hashing with constant-time comparison            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Web Security: CSP nonce generation, strict HSTS, CSRF double-submit token  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Audit Sanitization: Deep regex scrubbing of sk_live_, ghp_, AKIA, and JWTs │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Boundary of Claims
- WebForge OS **enforces** application-level security rules, code sanitization, tenant isolation, and cognitive validation gates.
- WebForge OS **does NOT replace** network-level firewalls, cloud IAM, dedicated hardware security modules, enterprise SIEM, or independent penetration testing.

---

## 📂 Repository Architecture

The repository is structured systematically to separate knowledge, skills, execution packages, and test evidence:

```text
WebForge OS/
├── core/                         # Mandatory foundational principles and policies
│   ├── principles/               # Priority ladder, anti-slop rules, security baseline
│   ├── rules/                    # Frontend, backend, API, and database rules
│   ├── standards/                # Code conventions, naming standards, versioning
│   └── policies/                 # Zero-trust, least privilege, secret management
│
├── packages/                     # Hardened executable engineering packages
│   ├── security/                 # Scrypt, IDOR guard, CSRF, rate limiter, UntrustedRepoGuard
│   ├── security-governance/      # Profiler, threat model, SBOM, privacy data flow
│   ├── orchestration/            # EvidenceGraph, ClaimVerificationEngine, GroundingGate
│   ├── contracts/                # Standard API envelope, schema validators, error models
│   ├── components/               # Accessible UI components (AccessibleDialog, DataTable)
│   ├── design-system/            # CSS tokens, fluid scales, semantic colors, motion
│   └── infrastructure/           # Hardened Dockerfile, non-root users, Nginx config
│
├── skills/                       # 26 Modular engineering skills
│   ├── architecture/             # System design, ADRs, component boundaries
│   ├── frontend/                 # DOM efficiency, state management, bundle size
│   ├── backend/                  # RESTful patterns, idempotent handlers, concurrency
│   ├── security/                 # OWASP ASVS, vulnerability remediation, sanitize
│   ├── testing/                  # Unit, integration, E2E, mutation testing
│   ├── ui-ux/ & taste-craft/     # Visual craftsmanship, fluid typography, anti-slop
│   └── anti-laziness/            # Enforces complete implementations without placeholders
│
├── domains/                      # 8 Business domain rule sets & state machines
│   ├── ecommerce/                # Cart lifecycle, inventory locks, payment states
│   ├── saas/                     # Multi-tenancy, subscription tiers, role isolation
│   ├── fintech/                  # Ledger reconciliation, double-entry bookkeeping
│   ├── healthcare/               # HIPAA/PII scrubbers, consent audit trails
│   └── lms/, dashboard/, marketplace/, corporate/
│
├── checklists/                   # Mandatory quality and pre-flight checklists
│   ├── security/                 # IDOR, auth, injection, header verification
│   ├── accessibility/            # WCAG 2.2 AA audit criteria
│   ├── performance/              # Core Web Vitals, frame budget, memory leaks
│   └── production/               # Pre-flight launch and production readiness
│
├── templates/                    # Standardized project documentation templates
│   ├── project/                  # PROJECT.md, REQUIREMENTS.md
│   ├── architecture/             # ARCHITECTURE.md, ADR templates
│   └── security/ & testing/      # SECURITY.md, TESTING.md, FINAL_VERIFICATION.md
│
├── adapters/                     # AI Platform instruction adapters
│   ├── antigravity/, claude/, codex/, cursor/, lovable/, v0/, replit/, windsurf/, generic/
│
├── bin/                          # Unified WebForge master CLI
│   └── webforge.js               # Master command dispatcher and test orchestrator
│
├── tests/                        # Repository integrity and E2E test suites
│   ├── integrity_test.js         # Verifies file presence, registry consistency, links
│   └── e2e/server_app.test.js    # Live HTTP server, auth, IDOR, idempotency test
│
├── reports/                      # Auditable reports, evidence matrices, and gates
├── AGENT.md                      # Unified AI Agent Protocol & Operational Guide
├── CHANGELOG.md                  # Semantic version history and release log
├── CONTRIBUTING.md               # Contribution guidelines and lifecycle compliance
├── LICENSE                       # MIT License
└── SECURITY.md                   # Responsible vulnerability disclosure policy
```

---

## 🧪 Testing & Verification Results

WebForge OS enforces continuous automated regression testing across all packages and components.

### Current Verified Test Baseline

| Metric | Verified Repository Result | Notes |
| :--- | :---: | :--- |
| **Test Suites** | **28** | Covers core, security, orchestration, V2, C2, C3, C4, and E2E |
| **Automated Tests** | **265** | All individual test assertions |
| **Tests Passed** | **265** | 100% pass rate across executed automated tests |
| **Tests Failed** | **0** | Zero test failures |
| **Tests Skipped** | **0** | No skipped or deferred tests |
| **Exit Code** | **`0`** | Clean process exit |
| **Determinism** | **100% (3/3 Runs)** | Identical results across 3 consecutive regression runs |

> [!NOTE]
> A **100% test pass rate** means all 265 automated tests in the repository executed and passed successfully. It does not imply 100% line coverage or an absolute mathematical guarantee of zero undiscovered defects.

### Verification Milestone Status

| Layer / Phase | Milestone Name | Status | Gate Authority Report |
| :---: | :--- | :---: | :--- |
| **V1** | Initial Master Foundation | **`VERIFIED / COMPLETE`** | [`reports/MASTER_FINAL_VERIFICATION_REPORT.md`](reports/MASTER_FINAL_VERIFICATION_REPORT.md) |
| **V2** | Enterprise & Security Hardening | **`VERIFIED WITH LIMITATIONS`** | [`reports/WEBFORGE_V2.8_FINAL_GATE_REPORT.md`](reports/WEBFORGE_V2.8_FINAL_GATE_REPORT.md) |
| **C1** | Cognitive Verification Architecture | **`PASS WITH LIMITATIONS`** | [`reports/C1_COGNITIVE_VERIFICATION_FINAL_GATE_REPORT.md`](reports/C1_COGNITIVE_VERIFICATION_FINAL_GATE_REPORT.md) |
| **C2** | Evidence & Claim Intelligence | **`PASS WITH LIMITATIONS`** | [`reports/C2_EVIDENCE_CLAIM_FINAL_GATE_REPORT.md`](reports/C2_EVIDENCE_CLAIM_FINAL_GATE_REPORT.md) |
| **C3** | Grounding Gate & Output Verification | **`PASS WITH LIMITATIONS`** | [`reports/C3_FINAL_GATE_REPORT.md`](reports/C3_FINAL_GATE_REPORT.md) |
| **C4** | Adversarial Hardening & Defense | **`PASS WITH LIMITATIONS`** | [`reports/C4_FINAL_GATE_REPORT.md`](reports/C4_FINAL_GATE_REPORT.md) |
| **C5** | Final Integration & Determinism | **`PASS WITH LIMITATIONS`** | [`reports/C5_FINAL_GATE_REPORT.md`](reports/C5_FINAL_GATE_REPORT.md) |
| **RELEASE** | Public Release Readiness | **`RELEASE READY WITH LIMITATIONS`** | [`reports/RELEASE_FINAL_GATE_REPORT.md`](reports/RELEASE_FINAL_GATE_REPORT.md) |

---

## ⚠️ Known Operational Limitations

In adherence to truthfulness and transparency, WebForge OS explicitly documents its known limitations:

1. **Deterministic Claim Extraction Boundary**:
   - The `ClaimVerificationEngine` uses structured patterns, regular expressions, and syntactic heuristics to extract atomic claims deterministically without relying on non-deterministic external LLM calls. Consequently, extraction from highly amorphous, poetic, or arbitrarily nested free-form text requires standardized formatting.
2. **No Autonomous Decision Authority**:
   - WebForge OS serves as an engineering quality and verification gatekeeper; it **does not possess autonomous executive authority** to override human decisions in mission-critical environments. Human-in-the-Loop (HITL) approval is mandatory for production deployments and sensitive operations.
3. **Framework vs. Runtime Distinction**:
   - WebForge OS is a rulebook, validator collection, and verification framework. It is **not** a persistent daemon, cloud platform, or standalone code-generation runtime.
4. **Environment-Constrained Live Services**:
   - In offline development environments lacking a live Redis instance or external database cluster, storage falls back gracefully to hardened in-memory adapters with tenant isolation.

---

## 🚀 Installation & Quick Start

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **Git**: `>= 2.30.0`

WebForge OS has **zero external npm runtime dependencies**. No lengthy `npm install` downloads are required.

### 1. Clone the Repository
```bash
git clone https://github.com/EyadAbduljalil/WebForge_OS.git
cd WebForge_OS
```

### 2. Run Master Verification Suite
Execute all 28 test suites and 265 automated tests:
```bash
npm test
```

### 3. Verify Repository Integrity
Validate that all rule manifests, skills, schemas, and required documents exist without broken references:
```bash
npm run integrity
```

### 4. Available CLI Commands
WebForge OS includes a unified CLI dispatcher (`bin/webforge.js`):

```bash
# Execute full automated test suite
node bin/webforge.js test

# Run OWASP ASVS Level 2 security & governance audit
node bin/webforge.js security

# Execute 10-point evidence-based verification protocol
node bin/webforge.js verify

# Run live E2E server integration tests
node bin/webforge.js e2e

# Generate project security profile
node bin/webforge.js profile

# Generate threat model and trust boundaries
node bin/webforge.js threat-model

# Audit security controls matrix
node bin/webforge.js matrix

# Evaluate engineering maturity (L0 to L6)
node bin/webforge.js maturity

# Trace requirements against implemented code
node bin/webforge.js trace
```

---

## 💡 Example AI Agent Workflow

Here is how an AI coding assistant (e.g., Claude, Cursor, Antigravity) uses WebForge OS to fulfill an engineering request with zero slop:

```
Step 1: RECEIVE REQUEST
  User: "Add a checkout endpoint that charges a credit card and updates order status."

Step 2: UNDERSTAND & DETECT (Stages 1-3)
  Agent runs StackDetector: Identifies Node.js + Express + PostgreSQL.
  Agent reads domains/ecommerce/rules.md: Identifies order state machine:
  [PENDING] ──► [PROCESSING] ──► [PAID] (Terminal)

Step 3: SELECT RULES (Stage 4)
  Binds P0 Rules:
  - IdempotencyMiddleware (Prevents duplicate charges on network retry)
  - OwnershipGuard (Verifies user owns order_id; prevents IDOR)
  - SecretSanitization (Never log card tokens or secret keys)

Step 4: PLAN & IMPLEMENT (Stages 5-7)
  Implements idempotent handler using packages/contracts/envelope.js.
  Applies database transaction with row-level locks.

Step 5: VALIDATE & EVIDENCE (Stages 8-9)
  Runs npm test. Tests pass (265/265).
  Passes claim: "Endpoint prevents duplicate charges with 409 Conflict."
  EvidenceGraph links claim to automated idempotency replay test.
  GroundingGate: Decision = PERMIT.

Step 6: REPORT (Stage 10)
  Issues structured report with status: PASS / VERIFIED.
```

---

## 📄 License & Release Documentation

- **License**: Released under the permissive [MIT License](LICENSE).
- **Security Policy**: Read [SECURITY.md](SECURITY.md) for vulnerability disclosure procedures.
- **Contributing**: Review [CONTRIBUTING.md](CONTRIBUTING.md) for lifecycle and PR guidelines.
- **Changelog**: Full version history documented in [CHANGELOG.md](CHANGELOG.md).
- **AI Agent Protocol**: Operational rules for AI assistants in [AGENT.md](AGENT.md).

---

<div align="center">

**WebForge OS Architecture Team** • *Engineered for Quality, Security, and Truth in AI Engineering*

</div>
