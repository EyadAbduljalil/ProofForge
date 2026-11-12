<div align="center">

<img src="assets/banner.png" alt="ProofForge — AI Engineering Verification Framework" width="100%">

# ProofForge

### AI Engineering Verification & Governance Framework

**Build with AI. Verify with Evidence.**

A deterministic, evidence-driven verification framework that establishes cognitive boundaries, enforces fail-closed engineering rules, grounds AI assertions in verifiable cryptographic artifacts, and governs agentic software development workflows.

[![npm version](https://img.shields.io/npm/v/proofforge.svg)](https://www.npmjs.com/package/proofforge)
[![Release: v1.1.0](https://img.shields.io/badge/Release-v1.1.0-purple.svg)](https://github.com/EyadAbduljalil/ProofForge/releases/tag/v1.1.0)
[![Antigravity Skills](https://img.shields.io/badge/Antigravity%20Skills-26%20Verified-emerald.svg)](skills/)
[![Security Standard](https://img.shields.io/badge/Security-OWASP%20ASVS%20Level%202-blue.svg)](skills/security/references/security_matrix.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI Pipeline](https://img.shields.io/badge/CI-GitHub%20Actions-blue.svg)](https://github.com/EyadAbduljalil/ProofForge/actions)
[![Integrity](https://img.shields.io/badge/Integrity-Fully%20Verified-success.svg)](tests/integrity_test.js)

**NPM Package:** [`proofforge`](https://www.npmjs.com/package/proofforge) &nbsp;|&nbsp; **Repository:** [github.com/EyadAbduljalil/ProofForge](https://github.com/EyadAbduljalil/ProofForge)

</div>

---

## 📌 Table of Contents

- [💡 What is ProofForge?](#-what-is-proofforge)
- [✨ Key Features & Capabilities](#-key-features--capabilities)
- [⚡ One-Click AI Skills Adoption Directive](#-one-click-ai-skills-adoption-directive)
- [🛡️ The 26 Antigravity Engineering Skills](#️-the-26-antigravity-engineering-skills)
- [🔬 How It Works: The 5-State Evidence Invariant](#-how-it-works-the-5-state-evidence-invariant)
- [🚀 Quick Start & CLI Usage](#-quick-start--cli-usage)
- [📦 Programmatic API Usage](#-programmatic-api-usage)
- [📂 Repository Structure](#-repository-structure)
- [📜 Protocols, Contributing & License](#-protocols-contributing--license)

---

## 💡 What is ProofForge?

Modern AI coding agents (Antigravity, Claude Code, Cursor, Codex, ChatGPT) are extraordinarily fast at generating code, but they suffer from three critical blind spots:

1. **Unverified Claims:** Declaring tasks "completed" without executing tests or verifying edge cases.
2. **Security Vulnerabilities:** Introducing subtle authorization flaws (IDOR/BOLA), unparameterized queries, and SSRF.
3. **AI Slop & Laziness:** Generating boilerplate designs with bloated gradients and leaving `// TODO: implement later` placeholders.

**ProofForge solves this by providing a deterministic, fail-closed verification layer.** It does not replace your AI assistant — it **governs** it. ProofForge enforces mathematical proof over plain assertion: no task is ever marked complete without terminal-backed, machine-verifiable evidence.

---

## ✨ Key Features & Capabilities

* 🛡️ **P0 Security & OWASP ASVS Level 2:** Enforces server-side authorization boundaries, anti-IDOR checks, tenant isolation, and prompt injection defense.
* 🏛️ **Clean Architecture Invariants:** Decouples presentation from data layers, enforces deterministic state machines, and documents decisions via ADRs.
* 🧪 **Deterministic Evidence Model:** Distinguishes between `AI_CLAIMED` and `PROOFFORGE_VERIFIED`. Every claim requires an exit code 0 terminal proof.
* 🎨 **Anti-Slop Visual Intelligence:** Bans generic AI design clichés (purple gradients, card bloat, fake trust metrics) in favor of high-contrast, semantic tokens.
* 🌍 **BiDi & Arabic RTL Parity:** Native support for CSS logical properties (`ms-`, `me-`), directional icon mirroring, and typography.
* 🔌 **Zero-Dependency CLI & Engine:** Runs natively on Node.js (>= 18) with zero bloated external runtimes.

---

## ⚡ One-Click AI Skills Adoption Directive

> 💡 **For Antigravity, Claude Code, Cursor, Windsurf, ChatGPT, and Gemini:**  
> Copy and send this prompt to your AI coding agent to immediately adopt ProofForge's 26 engineering skills and governance rules in any project:

```text
================================================================================
           PROOFFORGE AI SUITE — ONE-CLICK SKILL ADOPTION PROMPT
================================================================================
You are the Lead Software & Security Architect for this project, governed by ProofForge.

MANDATORY FIRST STEP:
Clone and activate the official ProofForge engineering skills suite:
git clone https://github.com/EyadAbduljalil/ProofForge.git .proofforge

CORE GOVERNANCE RULES:
1. [Security (P0)]: Zero-trust, server-side authorization, anti-IDOR, sanitize I/O, enforce default-deny.
2. [Architecture]: Strict separation of data/logic from presentation; preserve system invariants & strong types.
3. [Anti-Slop UI]: Reject generic AI designs; enforce high typographic craft, semantic tokens, and RTL/LTR parity.
4. [Evidence QA]: Never claim completion without proof (0 type errors, clean lint, 100% passing tests, green build).
5. [Anti-Laziness]: Strictly no "// TODO: implement later"; deliver complete, robust, production-grade solutions.

OPERATING CONTRACT:
- Inspect codebase & understand context before editing any file.
- Apply Minimal Safe Diffs without breaking existing patterns.
- Conclude each task with a structured report: Security Summary, Changes Made, and Verifiable Proof.
================================================================================
```

---

## 🛡️ The 26 Antigravity Engineering Skills

ProofForge includes **26 production-grade, modular skills** formatted according to the official Antigravity Skill Specification (featuring progressive disclosure, references, examples, and automated verification scripts):

| Domain | Skill Name | Primary Responsibility | Automated Verification |
|---|---|---|---|
| **Security** | [`security`](./skills/security/SKILL.md) | OWASP ASVS Level 2, Anti-IDOR/BOLA, SSRF, Injection prevention | `node skills/security/scripts/verify_security.js` |
| **Architecture** | [`architecture`](./skills/architecture/SKILL.md) | Clean Architecture layers, ADR records, DFDs, State machines | `node skills/architecture/scripts/verify_architecture.js` |
| **Design Craft** | [`anti-slop`](./skills/anti-slop/SKILL.md) | Banning generic AI purple gradients, bloated cards, WCAG AAA contrast | `node skills/anti-slop/scripts/audit_slop.js` |
| **Evidence QA** | [`testing`](./skills/testing/SKILL.md) | Property-based testing, fuzzing, Evidence Contract enforcement | `node skills/testing/scripts/verify_evidence.js` |
| **Bug Hunting** | [`code-review`](./skills/code-review/SKILL.md) | Adversarial bug hunting, side-effect analysis, 10-point review rubric | `npm test` |
| **Completeness**| [`anti-laziness`](./skills/anti-laziness/SKILL.md) | Banning `// TODO` placeholders, mock bypasses, and unhandled logic | `node skills/anti-laziness/scripts/scan_laziness.js` |
| **Design System**| [`design-system`](./skills/design-system/SKILL.md) | 4px/8px spatial rhythm, typographic hierarchy, semantic tokens | `node skills/design-system/scripts/verify_tokens.js` |
| **Visual Taste** | [`taste-craft`](./skills/taste-craft/SKILL.md) | Subtle borders, ambient shadows, tactile button physics, and restraint | `node skills/taste-craft/scripts/audit_craft.js` |
| **BiDi Parity** | [`rtl`](./skills/rtl/SKILL.md) | CSS logical properties (`ms-`, `me-`), directional icon mirroring, Arabic type | `node skills/rtl/scripts/verify_rtl.js` |
| **Accessibility**| [`accessibility`](./skills/accessibility/SKILL.md) | WCAG 2.2 AA/AAA, screen reader ARIA, full keyboard navigation, focus trap | `node skills/accessibility/scripts/audit_a11y.js` |
| **Motion** | [`motion`](./skills/motion/SKILL.md) | 60fps frame budget, GPU transforms (`translate/opacity`), reduced motion | `node skills/motion/scripts/audit_motion.js` |
| **UI/UX States** | [`ui-ux`](./skills/ui-ux/SKILL.md) | The 5 UI states (Idle, Loading, Empty, Error, Success), cognitive reduction | `node skills/ui-ux/scripts/verify_ux.js` |
| **Mobile-First** | [`responsive`](./skills/responsive/SKILL.md) | 320px to 4K viewports, 44x44px touch targets, zero horizontal overflow | `node skills/responsive/scripts/verify_responsive.js` |
| **Backend Core** | [`backend`](./skills/backend/SKILL.md) | Express/Fastify/Next routing, unified response envelopes, graceful shutdown | `node skills/backend/scripts/verify_backend.js` |
| **API Contracts**| [`api`](./skills/api/SKILL.md) | Idempotent mutations (`Idempotency-Key`), REST/GraphQL, sliding rate-limits | `node skills/api/scripts/verify_api.js` |
| **Data Integrity**| [`database`](./skills/database/SKILL.md) | ACID transactions, multi-tenant RLS, anti-N+1 queries, foreign key indexes | `node skills/database/scripts/verify_database.js` |
| **Client Core** | [`frontend`](./skills/frontend/SKILL.md) | Error boundary containment, Vite chunk splitting (< 200KB), re-render guards | `node skills/frontend/scripts/verify_frontend.js` |
| **Safe Forms** | [`forms`](./skills/forms/SKILL.md) | Zod schema validation, double-submit protection, inline accessible errors | `node skills/forms/scripts/verify_forms.js` |
| **Data Density** | [`dashboards`](./skills/dashboards/SKILL.md) | Real-time KPI cards, tabular monospace numbers, table virtualization | `node skills/dashboards/scripts/verify_dashboards.js` |
| **Transactions** | [`ecommerce`](./skills/ecommerce/SKILL.md) | Inventory locks, double-spend defense, timing-safe webhook HMAC checks | `node skills/ecommerce/scripts/verify_ecommerce.js` |
| **Design to Code**| [`image-to-code`](./skills/image-to-code/SKILL.md) | Converting mockups to anti-slop React/Tailwind without visual hallucination | `node skills/image-to-code/scripts/verify_image_code.js` |
| **SRE Health** | [`production-readiness`](./skills/production-readiness/SKILL.md) | 12-Factor compliance, `/healthz` & `/readyz` probes, JSON log hygiene | `node skills/production-readiness/scripts/audit_readiness.js` |
| **DevOps Guard** | [`deployment`](./skills/deployment/SKILL.md) | Non-root multi-stage Dockerfiles, frozen lockfiles, secure CI/CD pipelines | `node skills/deployment/scripts/verify_deployment.js` |
| **Web Vitals** | [`performance`](./skills/performance/SKILL.md) | Google Core Web Vitals (< 2.5s LCP, < 200ms INP, < 0.1 CLS), image optimization | `node skills/performance/scripts/audit_performance.js` |
| **Semantic SEO** | [`seo`](./skills/seo/SKILL.md) | Semantic HTML5 headings, OpenGraph, Twitter cards, JSON-LD schemas | `node skills/seo/scripts/verify_seo.js` |
| **Health Audit** | [`project-audit`](./skills/project-audit/SKILL.md) | Deep repository diagnostic, technical debt scoring, automated remediation | `node skills/project-audit/scripts/run_audit.js` |

To list and verify all skills from the CLI:
```bash
node bin/webforge.js skills
```

---

## 🔬 How It Works: The 5-State Evidence Invariant

ProofForge enforces a strict distinction between AI claims and machine reality through a 5-tier evidence hierarchy:

```text
[State 0] AI_CLAIMED         → Model asserts a fix was made (Untrusted / Rejected)
    ↓
[State 1] CODE_CHANGED       → Syntactic AST modification verified on disk
    ↓
[State 2] TEST_PASSED        → Deterministic test suite completed with exit code 0
    ↓
[State 3] EVIDENCE_EXISTS    → Terminal artifacts, hashes, or logs captured
    ↓
[State 4] PROOFFORGE_VERIFIED → Cryptographically attested and signed by ProofRunEngine
```

**Fail-Closed Principle:** If an AI agent attempts to skip any state (e.g. jumping from `AI_CLAIMED` directly to claiming completion), the verification gate aborts with exit code 1.

---

## 🚀 Quick Start & CLI Usage

### 1. Installation
Install ProofForge into your workspace:

```bash
npm install proofforge
```

### 2. Verify Repository Health & Invariants
Run the bounded verification engine to audit your codebase:

```bash
npx proofforge verify --json
```

### 3. Check Verified Antigravity Skills
Inspect the status of all 26 engineering skills:

```bash
npm run skills
```

---

## 📦 Programmatic API Usage

ProofForge exports a clean programmatic API for integration into CI/CD pipelines and custom AI harnesses:

```javascript
const { ProofRunEngine, PathLoaderGuard } = require('proofforge');

// 1. Execute a Bounded Verification Run
const engine = new ProofRunEngine();
const result = engine.executeBoundedRun({
  request: 'Verify user authentication & tenant isolation',
  projectName: 'CoreAPI'
});

console.log('Verification Status:', result.status);
console.log('Final Gate:', result.final_gate);
console.log('Exit Code:', result.exit_code);

// 2. Validate Paths Securely (Fail-Closed against path traversal)
const safePath = PathLoaderGuard.validateSafePath('registry/agents.json', process.cwd());
console.log('Safe Path:', safePath);
```

---

## 📂 Repository Structure

```text
ProofForge/
├── bin/                          # Executable CLI entry points (proofforge, webforge)
├── skills/                       # 26 Verified Antigravity Skills (with scripts, examples & references)
├── packages/
│   ├── contracts/                # Core contracts, registries, PathLoaderGuard, ProofRunEngine
│   ├── orchestration/            # EvidenceGraph, ClaimVerificationEngine, CVGF C1-C5
│   ├── security/                 # AISecurityGuard, AgentPermissionBoundary, ASVS controls
│   ├── security-governance/      # Threat modeling, attack surface, supply chain, audit ledger
│   ├── components/               # Core domain components & UI validators
│   ├── design-system/            # Anti-slop visual & typography design system
│   ├── infrastructure/           # Database storage adapters and migration runners
│   ├── state-machine/            # Deterministic state machine verifier
│   └── vulnerability-lab/        # Adversarial exploit simulation & verification lab
├── registry/                     # Canonical JSON Registries (agents, skills, mappings, policies, tools)
├── docs/                         # Canonical project documentation & WEBFORGE_CONSTITUTION.md
├── tests/                        # Repository integrity & end-to-end integration test suites
├── .github/                      # CI/CD Workflows (GitHub Actions)
├── plugin.json                   # Official Antigravity Plugin manifest
├── GEMINI.md                     # Always-on project-level rules for Antigravity & Gemini
├── AGENTS.md                     # Universal AI Agent Engineering Protocol (Full 300-line specification)
├── package.json                  # Package manifest, dependencies, and script runner
└── README.md                     # Framework documentation & Quick Start
```

---

## 📜 Protocols, Contributing & License

* **Extended Agent Protocol:** For the complete 300-line autonomous agent instructions, see [`AGENTS.md`](AGENTS.md).
* **Always-On Antigravity Rules:** Pre-configured in [`GEMINI.md`](GEMINI.md).
* **Contributing:** Please review [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting pull requests.
* **Security Reporting:** Consult [`SECURITY.md`](SECURITY.md) for responsible disclosure.
* **License:** Released under the [MIT License](LICENSE).
