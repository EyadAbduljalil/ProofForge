# PROOFFORGE — PHASE 8 + PHASE 9
# TOOL/MCP GOVERNANCE + MULTI-AGENT VERIFICATION

Mission ID:
PROOFFORGE-PHASE-8-9-COMBINED

Project:
ProofForge — AI Engineering Verification Framework

Phases:
8 + 9 of 12

---

# OBJECTIVE

Execute Phase 8 and Phase 9 as one bounded mission.

PHASE 8:
Tool / MCP Governance

PHASE 9:
Multi-Agent Verification

Both phases must be implemented, tested, documented, and verified.

Do NOT start Phase 10, Phase 11, or Phase 12.

---

# REQUIRED FIRST STEP

Read the actual current repository and all reports from Phases 1–7.

Read:

- reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md
- reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md
- reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_AND_RECONCILIATION_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_ROUND_2_REPORT.md
- reports/PROOFFORGE_PHASE_4_AGENT_SKILL_MAPPING_REPORT.md
- reports/PROOFFORGE_PHASE_5_WORKFLOW_CONTRACT_REPORT.md
- reports/PROOFFORGE_PHASE_6_MODEL_AI_POLICIES_REPORT.md
- reports/PROOFFORGE_PHASE_7_ANTIGRAVITY_ADAPTER_REPORT.md

Also inspect the current:

- Agent Contract
- Skill Contract
- Agent ↔ Skill Mapping
- Workflow Contract
- Model & AI Policies
- Antigravity Adapter
- AgentPermissionBoundary
- AgentAuditRecorder
- EvidenceGraph
- ClaimVerificationEngine
- GroundingGate
- OutputVerificationEngine
- existing validators
- existing security controls
- existing tests

Do not rely on historical test counts.

---

# PART A — PHASE 8
# TOOL / MCP GOVERNANCE

## 1. OBJECTIVE

Implement the canonical ProofForge governance layer for external Tools
and MCP integrations.

The purpose is to define how Tools/MCP are:

- identified
- classified
- scoped
- permission-checked
- treated as untrusted external inputs
- validated
- audited
- associated with evidence
- prevented from escalating authority

This phase governs Tools/MCP.

It does NOT implement an MCP server.

It does NOT implement a Tool Runtime.

It does NOT create a general-purpose tool executor.

---

# 2. CORE PRINCIPLES

Preserve:

Tool Result
≠
Evidence

MCP Result
≠
Verified Fact

Tool Availability
≠
Permission

Tool Permission
≠
Evidence

External Content
≠
Trusted Instruction

Tool Output must pass through the appropriate validation and evidence
pipeline before it can support a claim.

---

# 3. TOOL/MCP CONTRACT

Create if absent:

packages/contracts/tool-contract.js

The contract should support:

- tool_id
- name
- version
- type
- provider
- description
- status
- trust_level
- input_schema
- output_schema
- permission_requirements
- security_constraints
- allowed_agents
- prohibited_agents
- allowed_skills
- prohibited_skills
- allowed_workflows
- prohibited_workflows
- data_scope
- environment_scope
- evidence_behavior
- audit_requirements
- failure_conditions
- abstention_conditions

Reference canonical IDs.

Do not duplicate Agent, Skill, Workflow, or Rule contracts.

---

# 4. TOOL REGISTRY

If required, create:

registry/tools.json

and:

packages/contracts/tool-registry.js

The registry must:

- reject duplicates
- reject malformed tools
- reject unknown Agents
- reject unknown Skills
- reject unknown Workflows
- reject invalid permissions
- reject unsafe configurations
- fail closed
- provide deterministic lookup

Support statuses:

- DRAFT
- ACTIVE
- DEPRECATED
- DISABLED

DISABLED tools must fail closed.

---

# 5. MCP CLASSIFICATION

Support explicit classification between:

- internal tool
- external tool
- MCP server
- MCP resource
- MCP operation

Do not assume MCP content is trusted.

All external tool/MCP results are untrusted until validated.

---

# 6. PERMISSION GOVERNANCE

Integrate with existing:

AgentPermissionBoundary

Do NOT create a second permission system.

A Tool/MCP declaration must never grant authority by itself.

Preserve:

Declared Permission
≠
Actual Authority

Reject:

- privilege escalation
- scope escalation
- environment escalation
- unauthorized Agent access
- unauthorized Skill access
- unauthorized Workflow access

---

# 7. INPUT SECURITY

Treat Tool/MCP inputs as security-sensitive.

Validate:

- schema
- type
- size
- scope
- authorization
- allowed operation
- dangerous parameters

Do not claim complete security unless actually tested.

---

# 8. OUTPUT SECURITY

Tool/MCP outputs must be treated as untrusted external data.

Validate:

- output schema
- provenance
- source
- scope
- freshness
- integrity
- conflict state

Never automatically classify:

Tool Result
→ Evidence

Instead:

Tool Result
→ Validation
→ Evidence Candidate
→ Evidence Verification
→ Claim Verification

where required by CVGF.

---

# 9. EVIDENCE INTEGRATION

Integrate with existing EvidenceGraph and CVGF.

Do not create another Evidence Engine.

Tool/MCP output may contribute provenance only after validation.

Required principle:

Tool Result
≠
Evidence Exists

Tool Result
≠
ProofForge Verified

---

# 10. STALE EVIDENCE

Support freshness requirements.

Reject or downgrade stale external results according to the existing
evidence semantics.

Do not silently use expired data.

---

# 11. SCOPE / TENANT VALIDATION

Validate:

- tenant
- project
- repository
- environment
- artifact
- user/session scope

Reject scope mismatch.

Do not allow cross-scope evidence contamination.

---

# 12. TOOL AUDIT

Reuse:

AgentAuditRecorder

Record where appropriate:

- tool identity
- operation
- requesting Agent
- requesting Skill
- Workflow
- permission decision
- input classification
- output classification
- evidence decision
- verification result
- failure/abstention

Do not create a duplicate audit system.

---

# 13. MCP SECURITY TESTS

Test at minimum:

1. valid Tool
2. valid MCP definition
3. duplicate Tool
4. malformed Tool
5. disabled Tool
6. unknown Agent
7. prohibited Agent
8. unknown Skill
9. prohibited Skill
10. unknown Workflow
11. unauthorized operation
12. privilege escalation
13. scope escalation
14. malformed input
15. malformed output
16. stale output
17. scope mismatch
18. untrusted output incorrectly promoted to evidence
19. audit failure
20. fail-closed behavior

---

# PART B — PHASE 9
# MULTI-AGENT VERIFICATION

## 14. OBJECTIVE

Implement the canonical ProofForge Multi-Agent Verification layer.

The purpose is to govern structured cooperation between multiple Agents
while preserving:

- Agent contracts
- Skill contracts
- Workflow contracts
- security boundaries
- evidence requirements
- verification requirements
- CVGF
- auditability
- deterministic handoffs

This phase does NOT create a fully autonomous multi-agent runtime.

---

# 15. MULTI-AGENT MODEL

Canonical structure:

Requirement
↓
Agent A
↓
Agent B
↓
Agent C
↓
ProofForge Verification
↓
Evidence
↓
Final Report

Every handoff must remain traceable.

---

# 16. HANDOFF CONTRACT

Create if absent:

packages/contracts/agent-handoff-contract.js

The contract should support:

- handoff_id
- workflow_id
- source_agent
- target_agent
- source_skill
- target_skill
- task_context
- input_artifacts
- output_artifacts
- claims
- evidence
- requirements
- constraints
- security_context
- provenance
- verification_state
- status
- failure_conditions
- abstention_conditions
- audit_requirements

Do not duplicate Agent or Skill contracts.

---

# 17. HANDOFF VALIDATION

Validate:

- source Agent exists
- target Agent exists
- source Skill exists
- target Skill exists
- Workflow exists
- Agent ↔ Skill compatibility exists
- permissions are valid
- security constraints are preserved
- evidence requirements are preserved
- provenance exists

Unknown or malformed references:

FAIL-CLOSED

---

# 18. TRUST BOUNDARY

An Agent's output is not automatically trusted by the next Agent.

Preserve:

Agent A Output
≠
Verified Evidence

Agent B must receive the appropriate evidence/provenance context.

Do not treat:

AI_CLAIMED

as:

PROOFFORGE_VERIFIED

---

# 19. HANDOFF STATES

Support deterministic states such as:

- CREATED
- VALIDATED
- ACCEPTED
- REJECTED
- VERIFIED
- ABSTAINED
- FAILED

A handoff cannot become VERIFIED without satisfying its verification
requirements.

---

# 20. EVIDENCE PRESERVATION

Every handoff must preserve evidence provenance.

Do not allow:

- evidence deletion
- provenance loss
- evidence downgrading
- scope mutation
- timestamp manipulation
- verification-state spoofing

Preserve:

AI_CLAIMED
→ CODE_CHANGED
→ TEST_PASSED
→ EVIDENCE_EXISTS
→ PROOFFORGE_VERIFIED

---

# 21. CONFLICT HANDLING

If two Agents produce conflicting claims:

Do NOT automatically select one.

The system must represent:

- conflict
- competing claims
- evidence supporting each claim
- verification state
- unresolved status

Then defer to CVGF.

---

# 22. SECURITY HANDOFFS

Prevent:

- authority escalation between Agents
- permission escalation
- scope escalation
- privilege transfer
- hidden instruction injection
- untrusted content becoming trusted instructions

A source Agent cannot grant permissions to a target Agent.

---

# 23. MULTI-AGENT VERIFICATION

Reuse CVGF.

Do NOT create:

- MultiAgentVerificationEngine
- Duplicate ClaimVerificationEngine
- Duplicate EvidenceGraph
- Duplicate GroundingGate

The Multi-Agent layer coordinates verification requirements.

CVGF performs authoritative verification.

---

# 24. MULTI-AGENT AUDIT

Reuse AgentAuditRecorder.

Every important handoff must be auditable.

Trace:

Requirement
→ Workflow
→ Source Agent
→ Source Skill
→ Handoff
→ Target Agent
→ Target Skill
→ Evidence
→ Verification
→ Final Result

---

# 25. DETERMINISM

The same handoff input must produce the same validation result.

Test:

- stable IDs
- stable validation
- stable conflict representation
- stable security decisions
- stable evidence states

---

# 26. TESTS PHASE 9

Test at minimum:

1. valid handoff
2. unknown source Agent
3. unknown target Agent
4. unknown source Skill
5. unknown target Skill
6. unknown Workflow
7. incompatible Agent↔Skill
8. malformed handoff
9. missing provenance
10. evidence downgrade
11. verification spoofing
12. authority escalation
13. permission escalation
14. scope mismatch
15. conflicting claims
16. rejected handoff
17. abstained handoff
18. failed handoff
19. verified handoff
20. audit trace
21. deterministic validation
22. fail-closed behavior

---

# 27. INTEGRATION TEST

Verify the complete chain:

Workflow
→ Model Policy
→ Agent
→ Skill
→ Tool/MCP
→ Evidence
→ Agent Handoff
→ CVGF
→ Verification
→ Audit

Verify:

- security constraints survive
- permissions remain bounded
- evidence provenance survives
- tool results are not automatically evidence
- Agent output is not automatically verified
- conflicts remain visible
- CVGF remains authoritative
- no authority escalation occurs

---

# 28. NO AUTONOMOUS RUNTIME

Do NOT implement:

- autonomous multi-agent execution
- unrestricted agent loops
- recursive self-spawning agents
- automatic privilege escalation
- autonomous MCP execution
- unrestricted tool chaining

Phase 9 defines verification and governance structures only.

---

# 29. REGRESSION

Run:

npm run integrity

Then:

npm test

Record ACTUAL current results.

Do not reuse historical counts.

Record:

- TAP blocks
- individual tests
- sub-suites
- passed
- failed
- skipped/cancelled
- exit code

---

# 30. REQUIRED REPORTS

Create:

reports/PROOFFORGE_PHASE_8_TOOL_MCP_GOVERNANCE_REPORT.md

and:

reports/PROOFFORGE_PHASE_9_MULTI_AGENT_VERIFICATION_REPORT.md

Each report must include:

- Executive Summary
- Scope
- Architecture
- Contracts
- Registry
- Security
- Evidence
- Verification
- Audit
- Tests
- Determinism
- Findings
- Limitations
- Final Gate

Each finding must include:

- finding_id
- severity
- location
- description
- evidence
- impact
- repair
- verification
- status

Each phase receives its own:

PASS
PASS WITH LIMITATIONS
FAIL

---

# 31. PROBLEM HANDLING

If previous reports reveal a blocking defect:

1. verify it against the current repository
2. determine whether it blocks Phase 8 or 9
3. repair it if necessary for the current mission
4. run affected tests
5. document the repair
6. update the relevant report

Do not silently ignore blocking defects.

Do not invent evidence.

Do not claim complete security unless demonstrated.

---

# 32. DEFINITION OF DONE

PHASE 8:

- Tool/MCP Contract exists
- Tool Registry exists where required
- permissions are bounded
- P0 cannot be bypassed
- Tool/MCP output is untrusted by default
- evidence promotion requires validation
- provenance is preserved
- freshness is handled
- scope is validated
- audit integration works
- fail-closed behavior works
- tests pass
- integrity passes
- full regression passes
- report exists
- Gate is evidence-based

PHASE 9:

- Agent Handoff Contract exists
- handoffs are validated
- Agent↔Skill compatibility is reused
- Workflow compatibility is validated
- provenance is preserved
- evidence cannot be downgraded
- verification cannot be spoofed
- conflicts remain visible
- authority cannot escalate
- CVGF remains authoritative
- audit trace exists
- deterministic behavior is verified
- tests pass
- integrity passes
- full regression passes
- report exists
- Gate is evidence-based

---

# 33. SCOPE PROTECTION

Do NOT start:

- Phase 10 — Real Project Trial
- Phase 11 — Adversarial Test
- Phase 12 — Final Audit & Release Gate

Do not implement future-phase functionality merely because it appears
useful.

Document future dependencies instead.

---

# 34. MANDATORY STOP

After Phase 8 and Phase 9 are complete:

STOP.

Produce only:

1. Phase 8 implementation
2. Phase 8 tests
3. Phase 8 report
4. Phase 8 Gate
5. Phase 9 implementation
6. Phase 9 tests
7. Phase 9 report
8. Phase 9 Gate

Do NOT start Phase 10.

END OF MISSION.