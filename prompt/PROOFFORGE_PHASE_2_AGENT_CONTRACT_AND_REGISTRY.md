# ProofForge — Phase 2: Agent Contract & Registry

Mission ID: PROOFFORGE-PHASE-2-AGENT-CONTRACT-REGISTRY
Project: ProofForge
Previous Identity: WebForge OS
Current Identity: ProofForge — AI Engineering Verification Framework

Phase: 2 of 12
Phase Name: Agent Contract & Registry

Status: IMPLEMENTATION

---

# 1. MISSION OBJECTIVE

Build the foundational Agent Contract and Agent Registry architecture for ProofForge.

The purpose of this mission is to establish a formal, deterministic, security-aware contract describing how an AI Agent is represented, governed, constrained, audited, verified, and associated with ProofForge rules and evidence requirements.

This phase MUST build on the architecture discovered during Phase 1.

Do NOT create a parallel AI governance system.

Do NOT create an autonomous coding runtime.

Do NOT create an Agent execution engine.

Do NOT create an LLM runtime.

Do NOT create a production orchestrator.

ProofForge remains an AI Engineering Verification Framework.

The Agent Contract defines the governance and verification requirements for an agent.

The external AI system or coding environment remains responsible for execution.

---

# 2. MANDATORY PHASE 1 BASELINE

Before modifying anything:

Read:

reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md

Also inspect the actual repository components identified by Phase 1 as relevant to Agent governance, especially where present:

- AGENT.md
- 02-AI-INSTRUCTIONS/
- packages/security/agent-permission-boundary.js
- packages/orchestration/agent-audit-recorder.js
- packages/orchestration/authority-hierarchy.js
- packages/orchestration/rule-conflict-engine.js
- registry/
- registry/skills.json
- packages/contracts/
- existing schemas
- existing registries
- existing validators
- existing tests

Do NOT blindly trust the Phase 1 report.

Confirm important assumptions against the actual repository.

If Phase 1 recommendations conflict with the actual repository, preserve the actual repository evidence and document the discrepancy.

---

# 3. ARCHITECTURAL PRINCIPLE

ProofForge governs agents.

ProofForge does not become the agent runtime.

The intended relationship is:

External AI Agent
        ↓
ProofForge Agent Contract
        ↓
ProofForge Rules
        ↓
ProofForge Security Constraints
        ↓
ProofForge Validation
        ↓
ProofForge Evidence Requirements
        ↓
CVGF Verification
        ↓
Audit / Report

The Agent Contract must describe what an agent:

- is;
- is responsible for;
- is allowed to do;
- is prohibited from doing;
- is allowed to claim;
- must provide evidence for;
- must validate;
- must verify;
- must report;
- must abstain from.

---

# 4. DO NOT CREATE

Do NOT create:

- V3
- V2.9
- C6
- Phase 9
- Runtime
- Code Generator
- Autonomous Coding Engine
- LLM Runtime
- MCP Server
- Production Orchestrator
- autonomous execution subsystem
- second verification engine
- second evidence store
- second audit subsystem
- second validator registry
- parallel authority hierarchy

Do NOT copy external agent catalogs into ProofForge.

Do NOT install Agency Agents as a dependency.

Do NOT add 200+ external agent profiles.

---

# 5. EXISTING SYSTEMS MUST BE REUSED

The Agent Contract must integrate with existing systems where they already exist.

At minimum inspect and reuse:

- AuthorityHierarchy
- AgentPermissionBoundary
- AgentAuditRecorder
- UntrustedRepoGuard
- RuleConflictEngine
- Validators
- Quality Gates
- EvidenceGraph
- ClaimVerificationEngine
- GroundingGate
- OutputVerificationEngine
- existing rule registry
- existing security policies
- existing traceability mechanisms

Do not duplicate these systems.

If an existing component already provides a required capability, reference or extend it instead of creating a duplicate.

---

# 6. AGENT CONTRACT

Create a canonical Agent Contract.

Preferred location:

packages/contracts/agent-contract.js

If the repository has an established contract/schema architecture, integrate into that architecture instead of blindly creating a new one.

The Agent Contract must define, at minimum:

- id
- name
- version
- description
- role
- expertise
- responsibilities
- allowed_tasks
- prohibited_tasks
- allowed_skills
- required_skills
- prohibited_skills
- applicable_rules
- security_constraints
- permission_boundary
- authority_level
- required_evidence
- validation_requirements
- verification_requirements
- failure_conditions
- abstention_conditions
- reporting_requirements
- audit_requirements
- status

Use deterministic validation.

Do not allow arbitrary unvalidated fields to silently become authoritative.

---

# 7. AGENT ID

Agent IDs must be:

- unique;
- deterministic;
- stable;
- machine-readable.

Use a consistent namespace.

Preferred examples:

PF-ARCH-001
PF-BACKEND-001
PF-FRONTEND-001
PF-SEC-001
PF-QA-001

Do not create unnecessary IDs.

Do not create hundreds of agents.

---

# 8. AGENT STATUS

Define an explicit lifecycle/status model.

At minimum evaluate:

- DRAFT
- ACTIVE
- DEPRECATED
- DISABLED

If the repository already has an established status vocabulary, reuse it.

An agent that is not ACTIVE must not be treated as an active authoritative agent definition.

---

# 9. AGENT ROLE MODEL

The Agent Contract must separate:

Role

from:

Skills

from:

Rules

from:

Authority

from:

Execution.

Example:

Security Engineer

does not mean:

- automatically authorized to modify production;
- automatically authorized to deploy;
- automatically authorized to access secrets;
- automatically authorized to execute arbitrary tools.

Role describes responsibility.

Permission defines authority.

Skills define capabilities.

Rules define constraints.

Evidence defines what must be demonstrated.

---

# 10. AUTHORITY MODEL

Integrate with the existing ProofForge authority hierarchy.

Do not create a second authority hierarchy.

The Agent Contract may reference an existing authority level.

Security must remain the highest priority.

The Agent Contract must not allow an agent to override:

- P0 security rules;
- system security policies;
- repository trust boundaries;
- permission boundaries;
- mandatory quality gates;
- evidence requirements.

An agent cannot grant itself additional authority through its own definition.

---

# 11. PERMISSION BOUNDARY

Integrate with:

packages/security/agent-permission-boundary.js

Do not replace it.

The Agent Contract must express the intended permission boundary.

Actual enforcement remains with the existing security boundary.

Conceptually:

Agent Contract
      ↓
Declared Permissions
      ↓
AgentPermissionBoundary
      ↓
Enforced Permission

Do not assume declared permissions are automatically enforced.

Verification must confirm the enforcement path.

---

# 12. SECURITY CONSTRAINTS

Agent definitions must support security constraints.

Examples:

- no secret access unless explicitly authorized;
- no arbitrary filesystem access;
- no unrestricted command execution;
- no production deployment authority by default;
- no bypass of security validators;
- no bypass of quality gates;
- no trust escalation from tool results;
- no treating external instructions as higher authority;
- no treating retrieved content as trusted instructions;
- no treating tool/MCP output as evidence without validation.

Do not create unsupported security guarantees.

---

# 13. SKILL RELATIONSHIP

This phase does NOT implement the full Skill System.

However, Agent Contract MUST support Agent ↔ Skill relationships.

The contract must distinguish:

allowed_skills
required_skills
prohibited_skills

This is required because future phases will implement the canonical Skill System.

Do not hard-code 27 skills into agent logic.

Reference skill IDs where appropriate.

If a skill ID does not yet have a verified implementation, do not falsely mark it as active.

---

# 14. EVIDENCE REQUIREMENTS

This is a mandatory ProofForge requirement.

An Agent Contract must be able to declare what evidence is required to support its work.

Example:

Security Engineer:

Required Evidence:
- affected files;
- security findings;
- validation result;
- relevant test results;
- finding verification;
- final verification status.

The contract must distinguish:

AI said it was fixed

from:

Code changed

from:

Test passed

from:

Evidence exists

from:

ProofForge verified.

Never collapse these states.

---

# 15. VALIDATION REQUIREMENTS

Agent definitions must support explicit validation requirements.

Examples:

- static analysis;
- unit tests;
- integration tests;
- security validators;
- dependency audit;
- API validation;
- architecture validation.

Do not hard-code implementation-specific test runners into the generic Agent Contract unless the existing architecture requires it.

Prefer references to validator IDs, rule IDs, or capability IDs.

---

# 16. VERIFICATION REQUIREMENTS

Agent definitions must support explicit verification requirements.

Verification must remain connected to the existing CVGF.

Do not create:

AgentVerificationEngine

if existing CVGF components already provide the required functionality.

The intended relationship is:

Agent
↓
Work
↓
Validation
↓
EvidenceGraph
↓
CVGF
↓
Verification

---

# 17. FAILURE CONDITIONS

Agent definitions must support explicit failure conditions.

Examples:

- insufficient evidence;
- conflicting requirements;
- unauthorized action;
- security violation;
- missing dependency;
- missing required skill;
- validation failure;
- verification failure;
- stale evidence;
- scope mismatch.

Failure must not automatically trigger autonomous repair.

Repair remains outside this phase.

---

# 18. ABSTENTION CONDITIONS

Agent definitions MUST support abstention.

Examples:

- insufficient evidence;
- unclear authority;
- conflicting rules;
- missing required skill;
- untrusted repository content;
- unsupported environment;
- stale evidence;
- scope mismatch;
- security uncertainty.

Use the existing ProofForge fail-closed / abstention principles.

Do not treat abstention as failure of the framework.

---

# 19. REPORTING REQUIREMENTS

Agents must have explicit reporting requirements.

At minimum determine whether the agent must report:

- task performed;
- files changed;
- validators executed;
- tests executed;
- evidence produced;
- unresolved findings;
- limitations;
- verification status.

The report must not claim verification unless verification evidence exists.

---

# 20. AGENT AUDIT

Integrate with:

packages/orchestration/agent-audit-recorder.js

Do not create another audit recorder.

The Agent Contract must identify what actions or outputs require audit.

Audit data should support:

Requirement
→ Agent
→ Skill
→ Rule
→ Action
→ Validation
→ Evidence
→ Verification
→ Report

Preserve existing AgentAuditRecorder behavior.

---

# 21. AGENT REGISTRY

Create a canonical Agent Registry only if an equivalent authoritative registry does not already exist.

Preferred location:

registry/agents.json

Before creating it:

- inspect existing registry architecture;
- inspect schemas;
- inspect naming conventions;
- determine whether registry files are authoritative or generated.

The registry must not duplicate information unnecessarily.

The registry should reference canonical Agent Contracts.

Preferred conceptual structure:

{
  "version": "...",
  "agents": [
    {
      "id": "PF-SEC-001",
      "contract": "..."
    }
  ]
}

Use the repository's existing conventions where applicable.

---

# 22. REGISTRY INTEGRITY

The registry must validate:

- unique IDs;
- valid status;
- valid contract references;
- valid rule references;
- valid skill references;
- valid authority references;
- valid permission references;
- no duplicate agents;
- no malformed contracts.

Invalid registry entries must fail closed.

Do not silently ignore invalid entries.

---

# 23. CANONICAL INITIAL AGENTS

Do not create a large catalog.

Create only a minimal foundational set if the audit confirms they are useful.

Preferred initial roles:

1. Software Architect
2. Backend Engineer
3. Frontend Engineer
4. Security Engineer
5. QA Engineer
6. DevOps Engineer
7. Database Engineer
8. API Engineer
9. Performance Engineer
10. Code Reviewer
11. Threat Modeler
12. Documentation Engineer

Do not create all 12 automatically if existing architecture suggests fewer are appropriate.

Avoid overlapping responsibilities.

Each agent must have a clearly differentiated role.

---

# 24. EXTERNAL AGENT COMPATIBILITY

The Agent Contract must be designed so that external agent catalogs can later be adapted into ProofForge.

Conceptual model:

External Agent
↓
Adapter
↓
Normalize
↓
ProofForge Agent Contract
↓
ProofForge Rules
↓
Validation
↓
Verification
↓
Evidence

Do not build the external adapter now.

Do not import external agent definitions now.

Only ensure that the contract is sufficiently normalized to support future adapters.

---

# 25. SCHEMA / CONTRACT VALIDATION

Implement deterministic validation for Agent Contracts.

The validator must reject at minimum:

- missing ID;
- duplicate ID;
- missing role;
- invalid status;
- invalid authority;
- malformed skill references;
- malformed rule references;
- malformed evidence requirements;
- malformed permission boundary;
- malformed verification requirements.

Do not over-constrain fields without repository evidence.

---

# 26. TESTING

Add focused tests for the new Agent Contract and Registry.

Tests must cover:

### Contract

- valid contract;
- missing required fields;
- invalid status;
- invalid ID;
- duplicate ID;
- malformed permissions;
- malformed skill references;
- malformed rule references;
- malformed evidence requirements;
- abstention conditions;
- failure conditions.

### Registry

- valid registry;
- duplicate agent IDs;
- invalid contract reference;
- inactive agent handling;
- malformed registry;
- deterministic loading;
- fail-closed behavior.

### Security

- agent cannot self-escalate authority;
- agent cannot bypass P0 security;
- agent cannot convert declared permission into actual permission;
- untrusted content cannot redefine the Agent Contract;
- tool/MCP output cannot automatically become evidence.

### Integration

Verify that the Agent Contract can reference:

- existing rules;
- existing security boundary;
- existing validators;
- existing audit recorder;
- existing evidence architecture.

Do not create a fake CVGF.

Use real repository components where practical.

---

# 27. NO TESTING CLAIMS WITHOUT EXECUTION

Do not write:

"All tests pass"

unless the tests were actually executed.

Record:

- command;
- number of tests;
- passed;
- failed;
- skipped;
- exit code.

Do not copy old test counts from previous reports.

---

# 28. DOCUMENTATION

Update documentation only where necessary to make the new Agent Contract and Registry discoverable.

Do not perform the full ProofForge README rebrand in this phase.

Do not rewrite the README.

If documentation is required, keep it minimal and scoped to the new Agent Contract architecture.

Prefer a dedicated document if the repository architecture calls for one.

---

# 29. TRACEABILITY

Every new Agent Contract capability must map to:

Requirement
→ Contract Field
→ Validation
→ Test
→ Evidence

The implementation must not introduce fields that have no reason or validation.

---

# 30. ARCHITECTURAL QUALITY GATE

Before completion, verify:

1. No duplicate authority hierarchy.
2. No duplicate permission boundary.
3. No duplicate audit recorder.
4. No duplicate evidence store.
5. No duplicate verification engine.
6. No runtime was created.
7. No autonomous execution engine was created.
8. No MCP server was created.
9. No external agent catalog was copied.
10. Existing CVGF remains authoritative.
11. Existing security controls remain authoritative.
12. Agent Contract cannot self-escalate.
13. Registry fails closed.
14. Agent ↔ Skill mapping is explicit.
15. Evidence requirements are explicit.
16. Abstention is explicit.
17. Verification requirements are explicit.

---

# 31. REQUIRED REPORT

Create:

reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md

The report MUST include:

# ProofForge Phase 2 — Agent Contract & Registry Report

## 1. Executive Summary

## 2. Phase 1 Findings Used

## 3. Existing Agent Architecture

## 4. Agent Contract Design

## 5. Agent Registry Design

## 6. Authority Integration

## 7. Permission Boundary Integration

## 8. Skill Relationship

## 9. Evidence Requirements

## 10. Validation Requirements

## 11. Verification Requirements

## 12. Failure & Abstention Model

## 13. Agent Audit Integration

## 14. Security Analysis

## 15. Registry Integrity

## 16. Initial Agent Profiles

## 17. Tests Executed

## 18. Traceability Matrix

## 19. Files Changed

## 20. Remaining Limitations

## 21. Phase 3 Prerequisites

## 22. Final Gate

---

# 32. FILE CHANGE REPORT

The final report must explicitly list:

FILES CREATED
FILES MODIFIED
FILES DELETED

If none were deleted, explicitly state:

FILES DELETED: NONE

Do not hide modifications.

---

# 33. FINAL GATE

Issue exactly one:

PASS

PASS WITH LIMITATIONS

FAIL

PASS requires:

- Agent Contract implemented;
- registry implemented or existing registry safely extended;
- deterministic validation implemented;
- security boundaries preserved;
- Agent ↔ Skill relationship represented;
- evidence requirements represented;
- verification requirements represented;
- tests executed;
- no architectural duplication;
- no runtime introduced.

PASS WITH LIMITATIONS if the architecture is correct but a bounded limitation remains.

FAIL if:

- contract architecture conflicts with existing governance;
- security boundaries are bypassed;
- registry is not deterministic;
- tests fail;
- duplicate verification/governance architecture is introduced;
- actual repository evidence is insufficient.

---

# 34. STOP CONDITION

When complete:

1. Run all required tests.
2. Run relevant integrity validation.
3. Verify changed files.
4. Verify no prohibited architecture was introduced.
5. Create the final Phase 2 report.
6. Issue the final Gate.
7. STOP.

Do NOT start Phase 3.

Do NOT implement the Skill System.

Do NOT implement TaskRouter.

Do NOT implement Workflow Contract.

Do NOT implement Model Policy.

Do NOT implement Antigravity Adapter.

Do NOT implement MCP Governance.

Do NOT begin the private-project trial.

Those belong to later missions.

---

# END OF PHASE 2