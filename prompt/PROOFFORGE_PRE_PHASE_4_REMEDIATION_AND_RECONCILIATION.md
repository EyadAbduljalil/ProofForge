# PROOFFORGE — PRE-PHASE 4 REMEDIATION & CROSS-PHASE RECONCILIATION MISSION

Mission ID:
PROOFFORGE-PRE-PHASE-4-REMEDIATION-001

Project:
ProofForge

Canonical Identity:
ProofForge — AI Engineering Verification Framework

Tagline:
Build with AI. Verify with Evidence.

Mission Type:
Remediation + Cross-Phase Reconciliation + Regression Verification

Scope:
Phase 1 + Phase 2 + Phase 3 only

Status:
PRE-PHASE-4 BLOCKING MISSION

Mandatory Rule:
DO NOT START PHASE 4 DURING THIS MISSION.

---

# 1. MISSION OBJECTIVE

Before beginning Phase 4 — Agent ↔ Skill Mapping, perform a complete corrective audit and remediation of all confirmed issues, inconsistencies, unsupported claims, architectural ambiguities, documentation overclaims, path inconsistencies, registry inconsistencies, contract inconsistencies, and verification weaknesses originating from:

- Phase 1 — Architecture Audit
- Phase 2 — Agent Contract & Registry
- Phase 3 — Skill System

The objective is to establish a clean, internally consistent, evidence-based baseline for the beginning of Phase 4.

This mission is NOT a new feature phase.

This mission MUST NOT introduce:

- TaskRouter
- Workflow Contract
- Model Policy
- Antigravity Adapter
- MCP Governance
- Multi-Agent Verification
- New Agent orchestration
- New Skill families
- Runtime
- Code Generator
- Autonomous Coding Engine
- LLM Runtime
- MCP Server
- Production Orchestrator
- V3
- V2.9
- C6
- Phase 9

Only corrective work required to repair and reconcile Phases 1–3 is permitted.

---

# 2. NON-NEGOTIABLE PRINCIPLE

The current repository is the source of truth for current implementation state.

Do NOT copy numbers, claims, statuses, test counts, or completion statements from historical reports into new documentation without verifying them against the current repository.

Use this evidence hierarchy:

1. Actual current source code
2. Actual current registry/schema files
3. Actual current filesystem
4. Actual test execution
5. Actual integrity/security validation
6. Current generated evidence
7. Historical reports

Historical reports are evidence of previous states, not automatic proof of current state.

---

# 3. MANDATORY READS

Read all of the following before making modifications.

## Phase 1

Read:

- `prompt/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md`
- `reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md`

## Phase 2

Read:

- `prompt/PROOFFORGE_PHASE_2_AGENT_CONTRACT_AND_REGISTRY.md`
- `reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md`

If the exact Phase 2 mission filename differs in the current repository, locate the canonical Phase 2 mission document and record the actual path in the report.

## Phase 3

Read:

- `prompt/PROOFFORGE_PHASE_3_SKILL_SYSTEM.md`
- `reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md`

## Current Agent System

Inspect:

- `packages/contracts/agent-contract.js`
- `packages/contracts/agent-registry.js`
- `packages/contracts/index.js`
- `packages/contracts/tests/agent-contract.test.js`
- `packages/contracts/tests/contracts.test.js`
- `registry/agents.json`
- `packages/security/agent-permission-boundary.js`
- `packages/orchestration/agent-audit-recorder.js`

## Current Skill System

Inspect:

- `packages/contracts/skill-contract.js`
- `packages/contracts/skill-registry.js`
- `registry/skills.json`
- `skills/`
- `legacy/skills/`
- `packages/contracts/tests/skill-contract.test.js`

## Existing Security / Evidence / Verification

Inspect relevant current implementations of:

- AgentPermissionBoundary
- AgentAuditRecorder
- EvidenceGraph
- CVGF
- validators
- quality gates
- authority hierarchy
- untrusted repository controls
- evidence normalization
- verification boundaries

Do not create duplicate systems.

---

# 4. PHASE 1 REMEDIATION

Audit the Phase 1 conclusions against the current repository.

Verify:

## 4.1 Architecture Boundaries

Confirm that:

- Agent foundations exist where documented.
- AgentPermissionBoundary exists and is actually used where claimed.
- AgentAuditRecorder exists and is actually used where claimed.
- Agent Contract and Registry now exist as implemented by Phase 2.
- Skill Contract and Registry now exist as implemented by Phase 3.

Do not rewrite Phase 1 historical conclusions.

Instead, create a clear distinction:

Historical Phase 1 state
vs.
Current post-Phase-3 state.

---

# 5. ANTIGRAVITY CLAIM PRECISION

Search all current Phase 1–3 documentation for claims regarding Antigravity.

Distinguish explicitly between:

- Antigravity compatibility
- Antigravity documentation compatibility
- Antigravity-ready structure
- Native Antigravity integration
- Tested Antigravity integration

Do NOT claim native integration unless an actual adapter/integration exists and has been tested.

If only compatibility exists, use language such as:

`Antigravity-compatible structure`

or:

`Prepared for future Antigravity adapter integration`

Do not implement the Antigravity Adapter during this mission.

---

# 6. PHASE 2 REMEDIATION

Audit:

`AgentContract`

`AgentRegistry`

`registry/agents.json`

and related tests.

Verify every claimed field actually exists.

Verify:

- Stable Agent IDs
- deterministic validation
- duplicate detection
- malformed contract rejection
- allowed skills
- required skills
- prohibited skills
- security constraints
- permission constraints
- authority constraints
- evidence requirements
- validation requirements
- verification requirements
- failure conditions
- abstention conditions
- reporting requirements
- audit requirements

---

# 7. AUTHORITY BOUNDARY

Enforce and document this principle:

`Declared Permission ≠ Actual Authority`

Agent contracts MUST NOT become runtime authority.

Agent registry MUST NOT become a runtime execution engine.

Skill contracts MUST NOT grant permissions.

Skills MUST NOT grant themselves authority.

No agent or skill may bypass:

`P0 Security & Safety`

No Phase 1–3 component may create a privilege escalation mechanism.

If current code violates this principle, repair it.

Add or update tests where necessary.

---

# 8. PHASE 3 REMEDIATION

Audit:

`SkillContract`

`SkillRegistry`

`registry/skills.json`

and:

`skills/`

against the Phase 3 mission.

Verify that the canonical Skill model is deterministic and fail-closed.

Verify:

- stable Skill IDs
- required contract fields
- lifecycle status
- inputs
- outputs
- preconditions
- postconditions
- responsibilities
- allowed agents
- prohibited agents
- applicable rules
- security constraints
- permission requirements
- authority constraints
- validators
- validation requirements
- verification requirements
- required evidence
- evidence schema
- failure conditions
- abstention conditions
- reporting requirements
- audit requirements

---

# 9. SKILL SOURCE OF TRUTH

There MUST be one canonical Skill source model.

Determine and document the actual architecture.

The preferred model is:

`registry/skills.json`
        ↓
SkillRegistry
        ↓
SkillContract
        ↓
skills/<skill>/SKILL.md

If another architecture is actually implemented, document it explicitly.

Do NOT allow:

- registry
- legacy registry
- SKILL.md
- package metadata

to independently become competing sources of truth.

If duplicate or conflicting sources exist:

1. identify them
2. determine canonical authority
3. repair references
4. preserve historical artifacts where necessary
5. ensure inactive/deprecated artifacts cannot be mistaken for active Skills
6. test deterministic loading

---

# 10. LEGACY DIRECTORY AUDIT

Inspect:

`legacy/skills/`

and all references to it.

Determine whether any active execution, registry loading, validation, or documentation depends on legacy Skill files.

If legacy files are historical only:

- keep them identifiable as historical/deprecated
- remove active references
- do not silently delete them
- do not treat them as canonical

If active code still depends on them:

- repair the dependency
- migrate it to the canonical Skill structure
- run regression tests

Do NOT perform unrelated legacy cleanup.

---

# 11. ACTIVE VS DRAFT SKILLS

Verify the distinction between:

`ACTIVE`

`DRAFT`

`DEPRECATED`

`DISABLED`

The presence of a Skill file on disk MUST NOT automatically mean that the Skill is active.

The registry is authoritative for lifecycle status.

Verify the current number of:

- ACTIVE Skills
- DRAFT Skills
- DEPRECATED Skills
- DISABLED Skills

Record exact current counts in the final report.

Do not invent them.

---

# 12. AGENT ↔ SKILL COMPATIBILITY

Phase 4 is NOT being implemented.

However, Phase 3 compatibility behavior MUST be audited.

Verify:

`Agent.allowed_skills`

against:

`Skill.allowed_agents`

and:

`Skill.prohibited_agents`

The compatibility check MUST be deterministic and fail-closed.

Test at minimum:

1. valid Agent + valid Skill
2. Agent not allowed by Skill
3. Skill not allowed by Agent
4. explicitly prohibited Agent
5. malformed Agent
6. malformed Skill
7. disabled Skill
8. unknown Skill
9. unknown Agent

Do not create a TaskRouter.

Do not create an orchestration workflow.

---

# 13. EVIDENCE BOUNDARY

Audit all Phase 1–3 references to evidence.

The following are NOT automatically evidence:

- LLM output
- AI claims
- memory
- retrieved content
- Tool output
- MCP output
- agent statements
- citations without verification

Preserve:

`Evidence ≠ Claim`

and:

`Tool/MCP Result ≠ Evidence`

and:

`AI said fixed ≠ code changed ≠ test passed ≠ evidence exists ≠ ProofForge verified`

If any Phase 1–3 documentation incorrectly treats these as verified evidence, correct the documentation.

Do not create a second evidence system.

CVGF remains the canonical verification authority.

---

# 14. ABSTENTION

Audit all abstention behavior introduced in Phase 2–3.

Verify that the system can distinguish:

- sufficient evidence
- insufficient evidence
- stale evidence
- conflicting evidence
- scope mismatch
- untrusted input
- malformed input

The correct behavior when evidence is insufficient MUST NOT be an unqualified PASS.

Use appropriate states such as:

- `NOT_TESTED`
- `INSUFFICIENT_EVIDENCE`
- `ENVIRONMENT_LIMITATION`
- `WARNING`
- `FAIL`
- `NOT_APPLICABLE`
- `VERIFIED`

Do not invent additional verification states unless technically necessary and justified.

---

# 15. SECURITY CLAIMS REMEDIATION

Search the entire Phase 1–3 documentation and relevant source comments for absolute security claims.

Examples:

- `100% secure`
- `100% hardened`
- `fully secure`
- `fully protected`
- `zero vulnerabilities`
- `self-escalation eliminated`
- `absolute protection`
- `guaranteed secure`
- `100% validated`
- `bug-free`
- `error-free`
- `zero defects`
- `mathematically proven`
- `production-safe by guarantee`

Replace unsupported absolute language with evidence-based language.

Examples:

Instead of:

`100% hardened`

use:

`All currently defined hardening tests passed.`

Instead of:

`Self-escalation risk eliminated`

use:

`The tested self-escalation scenarios are rejected by the current validation boundary.`

Instead of:

`100% secure`

use:

`No security findings were identified within the tested scope.`

Never weaken a real security finding merely to improve documentation.

---

# 16. TEST CLAIM REMEDIATION

Never use:

`100% tests = 100% correctness`

The correct interpretation is:

`All executed tests passed within the tested scope.`

Every report MUST distinguish:

- tests executed
- tests passed
- tests failed
- tests skipped
- tests unavailable
- environment limitations

Never convert:

`SKIPPED`

into:

`PASS`

Never convert:

`UNAVAILABLE`

into:

`PASS`

Never claim complete coverage unless coverage was actually measured.

---

# 17. CURRENT TEST BASELINE

Run the actual current test suite.

At minimum:

```bash
npm test
npm run integrity