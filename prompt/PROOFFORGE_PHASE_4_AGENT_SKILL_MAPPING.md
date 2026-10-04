# PROOFFORGE — PHASE 4: AGENT ↔ SKILL MAPPING

Mission ID:
PROOFFORGE-PHASE-4-AGENT-SKILL-MAPPING

Project:
ProofForge

Canonical Identity:
ProofForge — AI Engineering Verification Framework

Tagline:
Build with AI. Verify with Evidence.

Phase:
4 of 12

Previous Status:
Phase 1 — PASS WITH CONSTRAINTS
Phase 2 — PASS
Phase 3 — PASS
Pre-Phase 4 Remediation — PASS
Pre-Phase 4 Remediation Round 2 — PASS

Mission Type:
Agent ↔ Skill Mapping

MANDATORY:
This mission is strictly limited to Agent ↔ Skill Mapping.

Do NOT implement TaskRouter, Workflow Contract, Model Policy,
Antigravity Adapter, MCP Governance, Multi-Agent Verification,
Real Project Trial, or any later phase.

---

# 1. OBJECTIVE

Build the canonical Agent ↔ Skill Mapping layer on top of the already
validated:

- AgentContract
- AgentRegistry
- SkillContract
- SkillRegistry
- AgentPermissionBoundary
- AgentAuditRecorder
- existing ProofForge Rules
- existing Validators
- existing Evidence model
- existing CVGF

The purpose is to define, validate, and audit which Agents may use which
Skills and under what constraints.

This phase does NOT execute Agents.

This phase does NOT execute Skills.

This phase does NOT create an orchestration runtime.

This phase creates the declarative compatibility/mapping layer required
for later routing and workflow phases.

---

# 2. CURRENT ARCHITECTURAL PRINCIPLE

Preserve:

Agent
    ↓
Agent Contract
    ↓
Agent ↔ Skill Mapping
    ↓
Skill Contract
    ↓
Rules / Validators / Evidence Requirements

The mapping layer MUST NOT become:

- Runtime
- TaskRouter
- Workflow Engine
- Permission Escalation Engine
- Agent Executor
- Skill Executor
- LLM Runtime
- MCP Server

---

# 3. MANDATORY READS

Before modifying anything, read:

## Previous Phase Reports

- `reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md`
- `reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md`
- `reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md`
- `reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_AND_RECONCILIATION_REPORT.md`
- `reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_ROUND_2_REPORT.md`

## Contracts

- `packages/contracts/agent-contract.js`
- `packages/contracts/agent-registry.js`
- `packages/contracts/skill-contract.js`
- `packages/contracts/skill-registry.js`
- `packages/contracts/index.js`

## Registries

- `registry/agents.json`
- `registry/skills.json`

## Security

- `packages/security/agent-permission-boundary.js`

## Audit

- `packages/orchestration/agent-audit-recorder.js`

## Existing Tests

Inspect all relevant tests under:

- `packages/contracts/tests/`
- `packages/security/tests/`
- `packages/orchestration/tests/`
- relevant validator tests
- relevant CVGF tests

Do not assume previous test counts.

---

# 4. CURRENT BASELINE

The previous remediation established the current baseline.

Do NOT copy historical test numbers.

Verify the current repository before making decisions.

The previous verified baseline included:

- 29 registered Skills
- 10 ACTIVE Skills
- 19 DRAFT Skills
- canonical `skills/` path
- isolated `legacy/skills`
- 10 registered Agents
- current tests must be re-executed rather than assumed

Run appropriate focused tests before implementation.

---

# 5. MAPPING MODEL

Create one canonical mapping model.

Preferred conceptual structure:

Agent
    ↓
Agent Skill Mapping
    ↓
Skill
    ↓
Constraints
    ↓
Evidence / Validation / Verification Requirements

Each mapping MUST identify at minimum:

- agent_id
- skill_id
- status
- mapping_reason
- allowed
- restrictions
- applicable_rules
- required_validators
- required_evidence
- verification_requirements
- authority_constraints
- security_constraints
- abstention_conditions
- reporting_requirements

Do not duplicate fields unnecessarily if they already exist authoritatively
in AgentContract or SkillContract.

The mapping should reference canonical IDs rather than copying complete
contracts.

---

# 6. SINGLE SOURCE OF TRUTH

Do not create competing sources of truth.

Determine the correct canonical architecture.

Preferred:

Agent Registry
      ↓
Agent Contract
      ↓
Mapping Registry
      ↓
Skill Registry
      ↓
Skill Contract

The mapping layer references:

- Agent IDs
- Skill IDs
- Rule IDs
- Validator IDs

It must NOT copy entire Agent or Skill contracts into a second registry.

If an existing structure already provides the correct mapping capability,
extend it instead of creating a duplicate.

---

# 7. MAPPING STATUS

Define deterministic mapping states.

At minimum support:

- ACTIVE
- DISABLED
- DEPRECATED

If DRAFT mappings are technically useful, support:

- DRAFT

Document their meaning.

A disabled Agent ↔ Skill mapping MUST NOT be treated as allowed.

A disabled Skill MUST NOT become usable merely because a mapping exists.

A deprecated mapping MUST NOT silently become active.

---

# 8. ALLOW / DENY SEMANTICS

The mapping layer MUST distinguish:

```text
Allowed
≠
Authorized Runtime Execution
