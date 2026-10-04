# PROOFFORGE — PHASE 5: WORKFLOW CONTRACT

Mission ID:
PROOFFORGE-PHASE-5-WORKFLOW-CONTRACT

Project:
ProofForge — AI Engineering Verification Framework

Phase:
5 of 12

## OBJECTIVE

Implement the canonical ProofForge Workflow Contract.

The Workflow Contract must declaratively define:

User Request
→ Intent / Context
→ Task Type
→ Required Agents
→ Required Skills
→ Applicable Rules
→ Required Validators
→ Evidence Requirements
→ Verification Requirements
→ Security Constraints
→ Abstention Conditions
→ Failure Conditions
→ Reporting Requirements

This phase MUST remain declarative.

Do NOT implement workflow execution, TaskRouter, Agent Executor,
Skill Executor, LLM Runtime, MCP Runtime, Model Policy, Antigravity
Adapter, or any functionality belonging to later phases.

---

## REQUIRED FIRST STEP

Read the actual current repository and all previous Phase 1–4 reports
before making changes.

Read:

- reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md
- reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md
- reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_AND_RECONCILIATION_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_ROUND_2_REPORT.md
- reports/PROOFFORGE_PHASE_4_AGENT_SKILL_MAPPING_REPORT.md

Read the current AgentContract, SkillContract, AgentRegistry,
SkillRegistry, Phase 4 Agent↔Skill Mapping implementation, security
boundary, audit infrastructure, CVGF, rules, validators, and tests.

Do not rely on historical test counts.

---

## 1. WORKFLOW CONTRACT

Create or extend the canonical Workflow Contract.

Preferred:

packages/contracts/workflow-contract.js

The contract must support and validate:

- workflow_id
- name
- version
- description
- status
- intent
- task_types
- required_agents
- optional_agents
- prohibited_agents
- required_skills
- optional_skills
- prohibited_skills
- applicable_rules
- required_validators
- evidence_requirements
- verification_requirements
- security_constraints
- permission_constraints
- authority_constraints
- prerequisites
- dependencies
- abstention_conditions
- failure_conditions
- reporting_requirements
- audit_requirements
- traceability_requirements

Reuse existing contracts instead of duplicating their definitions.

---

## 2. WORKFLOW REGISTRY

If no canonical registry exists, create:

registry/workflows.json

and the corresponding registry implementation:

packages/contracts/workflow-registry.js

The registry must:

- reject duplicate workflow IDs
- reject malformed workflows
- reject unknown Agents
- reject unknown Skills
- reject unknown Rules
- reject unknown Validators
- reject invalid evidence requirements
- reject invalid verification requirements
- fail closed
- provide deterministic lookup
- preserve stable ordering

Possible declarative operations:

- getWorkflow(workflowId)
- getActiveWorkflows()
- getWorkflowsForTaskType(taskType)
- validateWorkflow(workflow)
- validateRegistry()

These functions MUST NOT execute workflows.

---

## 3. WORKFLOW STATUS

Support:

- DRAFT
- ACTIVE
- DEPRECATED
- DISABLED

DISABLED workflows must fail closed.

DEPRECATED workflows must not silently become active.

---

## 4. AGENT VALIDATION

Validate all:

- required_agents
- optional_agents
- prohibited_agents

Unknown or disabled Agents must fail closed.

---

## 5. SKILL VALIDATION

Validate all:

- required_skills
- optional_skills
- prohibited_skills

Unknown or disabled Skills must fail closed.

---

## 6. AGENT ↔ SKILL COMPATIBILITY

Reuse the canonical Phase 4 Agent ↔ Skill Mapping.

Do NOT create another compatibility engine.

If a workflow requires an Agent and Skill whose Phase 4 mapping is DENY,
the workflow must fail closed.

Required principle:

Agent ↔ Skill Mapping
≠
Runtime Authority

---

## 7. CONFLICT VALIDATION

Reject contradictions such as:

- required Agent + prohibited Agent
- required Skill + prohibited Skill
- disabled dependency + required dependency
- incompatible Agent + required Skill
- malformed dependency

Never resolve security conflicts by choosing the less restrictive option.

---

## 8. RULES

Workflows may reference existing ProofForge Rule IDs.

Do not duplicate Rule definitions.

Unknown or malformed Rule IDs must fail closed.

Preserve:

P0 Security
>
P1 Reliability & Correctness
>
P2 Performance
>
P3 Developer Experience
>
P4 Aesthetics

A workflow must never weaken a higher-priority rule.

---

## 9. VALIDATORS

Workflows may reference existing Validator IDs.

Do not create duplicate validators.

Unknown or malformed Validator IDs must fail closed.

The Workflow Contract only declares validator requirements.

It does not execute validators.

---

## 10. EVIDENCE

Preserve the existing evidence states:

AI_CLAIMED
CODE_CHANGED
TEST_PASSED
EVIDENCE_EXISTS
PROOFFORGE_VERIFIED

A workflow must not weaken a stronger evidence requirement into a weaker
one.

Examples:

PROOFFORGE_VERIFIED ≠ AI_CLAIMED

TEST_PASSED ≠ CODE_CHANGED

Evidence ≠ Verification

---

## 11. VERIFICATION

Workflow definitions may require:

- claim verification
- grounding
- output verification
- adversarial verification
- evidence provenance
- freshness validation
- scope validation

Reuse CVGF.

Do NOT create a duplicate verification engine.

---

## 12. SECURITY

Preserve existing security architecture.

The Workflow Contract must not:

- bypass P0
- override AgentPermissionBoundary
- grant runtime authority
- escalate permissions
- escalate Agent authority
- convert Tool/MCP output directly into evidence
- weaken existing security constraints

Declared permissions remain declarations unless existing security
architecture explicitly authorizes them.

---

## 13. ABSTENTION

Support deterministic abstention conditions including:

- insufficient evidence
- stale evidence
- scope mismatch
- conflicting evidence
- missing Agent
- missing Skill
- incompatible mapping
- unavailable Validator
- failed security gate
- failed verification gate

Abstention is a valid result.

---

## 14. FAILURE CONDITIONS

Support explicit failure conditions for:

- malformed workflow
- unknown dependency
- disabled dependency
- prohibited dependency
- contradictory dependency
- invalid Rule
- invalid Validator
- invalid evidence requirement
- invalid verification requirement
- security violation

Do not silently repair malformed workflow definitions.

---

## 15. CANONICAL WORKFLOWS

Create only a small number of justified workflows based on the actual
current repository.

Potential examples:

- PF-WF-SEC-001
- PF-WF-ARCH-001
- PF-WF-API-001

Only create a workflow when its required Agents, Skills, Rules,
Validators, and verification requirements actually exist.

Do not create artificial mappings merely to populate the registry.

---

## 16. TRACEABILITY

Maintain:

Requirement
→ Workflow
→ Agent
→ Skill
→ Rule
→ Validator
→ Evidence Requirement
→ Verification Requirement
→ Test
→ Report

Reuse existing traceability and audit infrastructure.

Do not create duplicate audit or verification systems.

---

## 17. TESTS

Create focused Phase 5 tests covering at minimum:

1. valid workflow
2. duplicate workflow ID
3. malformed workflow
4. unknown Agent
5. unknown Skill
6. unknown Rule
7. unknown Validator
8. disabled Agent
9. disabled Skill
10. disabled Workflow
11. prohibited Agent
12. prohibited Skill
13. Agent↔Skill incompatibility
14. contradictory dependencies
15. invalid evidence requirement
16. invalid verification requirement
17. P0 bypass attempt
18. authority escalation attempt
19. permission escalation attempt
20. stale evidence requirement
21. scope mismatch
22. deterministic registry validation
23. fail-closed behavior

Run:

npm run integrity

Then:

npm test

Record the ACTUAL current results.

Do not reuse historical test counts.

---

## 18. DETERMINISM

Run workflow validation more than once and verify:

- stable ordering
- stable lookup
- stable dependency validation
- stable compatibility results
- stable failure behavior

Repair correctness-affecting nondeterminism.

---

## 19. REQUIRED REPORT

Create:

reports/PROOFFORGE_PHASE_5_WORKFLOW_CONTRACT_REPORT.md

The report must include:

- Executive Summary
- Scope
- Architecture
- Workflow Contract
- Workflow Registry
- Dependency Model
- Agent Dependencies
- Skill Dependencies
- Agent↔Skill Compatibility
- Rules
- Validators
- Evidence Requirements
- Verification Requirements
- Security
- Abstention
- Failure Conditions
- Tests
- Determinism
- Traceability
- Findings
- Limitations
- Final Gate

Every finding must include:

- finding_id
- severity
- location
- description
- evidence
- impact
- repair
- verification
- status

The final Gate must be exactly one of:

PASS
PASS WITH LIMITATIONS
FAIL

The Gate must be based on actual evidence.

---

## 20. DEFINITION OF DONE

Phase 5 is complete only when:

- Workflow Contract exists
- Workflow Registry exists where required
- all IDs are validated
- duplicate IDs are rejected
- unknown dependencies fail closed
- disabled dependencies fail closed
- prohibited dependencies fail closed
- contradictory dependencies fail closed
- Phase 4 Agent↔Skill Mapping is reused
- P0 cannot be bypassed
- authority cannot be escalated
- evidence requirements are explicit
- verification requirements are explicit
- abstention is supported
- CVGF remains authoritative
- existing security and audit infrastructure is reused
- no TaskRouter is implemented
- no workflow runtime is implemented
- no Agent executor is implemented
- no Skill executor is implemented
- no Model Policy is implemented
- no Antigravity Adapter is implemented
- no MCP Governance is implemented
- focused tests pass
- npm run integrity passes
- npm test passes
- actual test results are recorded
- deterministic validation passes
- required report exists
- final Gate is evidence-based

---

## 21. MANDATORY STOP

After Phase 5 is complete:

STOP.

Do NOT start Phase 6 or any subsequent phase.

Do NOT automatically fix future-phase work.

If a problem is discovered:

1. document it
2. determine whether it belongs to Phase 5
3. repair it if it is within Phase 5 scope
4. otherwise document it as a limitation/finding
5. stop

END OF MISSION.