# PROOFFORGE — PHASE 6 + PHASE 7
# MODEL & AI POLICIES + ANTIGRAVITY ADAPTER

Mission ID:
PROOFFORGE-PHASE-6-7-COMBINED

Project:
ProofForge — AI Engineering Verification Framework

Phases:
6 + 7 of 12

---

# OBJECTIVE

Execute Phase 6 and Phase 7 as one bounded mission.

PHASE 6:
Model & AI Policies

PHASE 7:
Antigravity Adapter

Both phases must be implemented, tested, documented, and verified
without starting Phase 8 or any later phase.

---

# REQUIRED FIRST STEP

Read the actual current repository and all available reports from
Phases 1–5.

Read:

- reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md
- reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md
- reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_AND_RECONCILIATION_REPORT.md
- reports/PROOFFORGE_PRE_PHASE_4_REMEDIATION_ROUND_2_REPORT.md
- reports/PROOFFORGE_PHASE_4_AGENT_SKILL_MAPPING_REPORT.md
- reports/PROOFFORGE_PHASE_5_WORKFLOW_CONTRACT_REPORT.md

Also inspect all current:

- Agent Contracts
- Skill Contracts
- Agent↔Skill Mapping
- Workflow Contract
- Workflow Registry
- Security Boundary
- Audit infrastructure
- CVGF
- Rules
- Validators
- Tests
- Antigravity-related files if already present

Do not assume historical test counts.

Do not overwrite existing architecture without first determining its
current state.

---

# PART A — PHASE 6
# MODEL & AI POLICIES

## 1. OBJECTIVE

Create the canonical ProofForge Model & AI Policy layer.

The policy layer defines constraints for AI/model usage, including:

- model selection criteria
- workload classification
- risk classification
- model capability requirements
- security requirements
- evidence requirements
- cost-awareness metadata
- latency-awareness metadata
- context requirements
- abstention requirements
- output verification requirements
- prompt governance requirements

The policy layer is declarative.

It must NOT become:

- LLM Runtime
- Model Router
- Autonomous Agent
- Agent Executor
- Prompt Injection Engine
- MCP Runtime

---

## 2. POLICY CONTRACT

Create if absent:

packages/contracts/model-policy-contract.js

The contract must support appropriate fields such as:

- policy_id
- name
- version
- status
- purpose
- task_types
- risk_level
- required_capabilities
- model_constraints
- context_requirements
- security_requirements
- evidence_requirements
- verification_requirements
- abstention_conditions
- prohibited_behaviors
- cost_constraints
- latency_constraints
- fallback_constraints
- reporting_requirements
- audit_requirements

Use canonical references instead of duplicating existing contracts.

---

## 3. POLICY REGISTRY

If required, create:

registry/model-policies.json

and:

packages/contracts/model-policy-registry.js

The registry must:

- reject duplicates
- reject malformed policies
- fail closed
- validate referenced Rules
- validate referenced Validators
- validate evidence requirements
- validate verification requirements
- provide deterministic lookup

---

## 4. RISK CLASSIFICATION

Support deterministic risk levels appropriate to the existing ProofForge
architecture.

At minimum:

- LOW
- MEDIUM
- HIGH
- CRITICAL

Higher-risk workflows MUST NOT silently downgrade to weaker AI policies.

P0 Security requirements always override lower priorities.

---

## 5. MODEL SELECTION

The policy may declare requirements such as:

- reasoning capability
- context capacity
- tool capability
- structured-output capability
- code capability
- security sensitivity
- verification capability

Do NOT hard-code vendor-specific models unless the current architecture
already requires them.

Do not claim a specific model is superior without evidence.

Model policy describes requirements, not marketing claims.

---

## 6. SECURITY

Model policies must preserve:

- prompt-injection resistance
- untrusted-input handling
- least privilege
- no authority escalation
- no automatic trust of model output
- no automatic trust of tool output
- no automatic conversion of model output into evidence

Preserve:

AI Output
≠
Evidence

Tool Result
≠
Evidence

MCP Result
≠
Verification

---

## 7. PROMPT GOVERNANCE

Define declarative requirements for:

- trusted instructions
- untrusted content
- instruction precedence
- context separation
- sensitive information handling
- output constraints
- verification requirements

Do not build a prompt runtime.

---

## 8. ABSTENTION

Policies must support abstention for:

- insufficient evidence
- unsupported claim
- conflicting evidence
- stale evidence
- scope mismatch
- unsafe request
- insufficient model capability
- unavailable verification
- security violation

---

## 9. EVIDENCE

Model policies must preserve the canonical evidence hierarchy:

AI_CLAIMED
→ CODE_CHANGED
→ TEST_PASSED
→ EVIDENCE_EXISTS
→ PROOFFORGE_VERIFIED

A policy cannot weaken evidence requirements.

---

## 10. CVGF

Reuse CVGF.

Do not create another:

- Claim Verification Engine
- Grounding Engine
- Output Verification Engine
- Evidence Engine

---

## 11. TESTING PHASE 6

Test at minimum:

1. valid policy
2. duplicate policy
3. malformed policy
4. invalid risk level
5. invalid model requirement
6. invalid Rule reference
7. invalid Validator reference
8. invalid evidence requirement
9. invalid verification requirement
10. security downgrade attempt
11. P0 bypass attempt
12. authority escalation attempt
13. unsafe fallback
14. abstention requirement
15. deterministic registry validation
16. fail-closed behavior

---

# PART B — PHASE 7
# ANTIGRAVITY ADAPTER

## 12. OBJECTIVE

Implement the ProofForge structural adapter for Google Antigravity.

The adapter must translate ProofForge declarative structures into
Antigravity-compatible project artifacts.

Current architectural principle:

ProofForge
→ Contract / Rules / Skills / Policies
→ Antigravity Adapter
→ Antigravity-compatible project structure

The adapter is NOT:

- Antigravity Runtime
- Agent Runtime
- LLM Runtime
- MCP Server
- Production Orchestrator

---

## 13. ANTIGRAVITY COMPATIBILITY

Use the actual repository and current Antigravity-compatible structure.

Prefer the modern Agent Skills model.

Where appropriate support:

- AGENTS.md
- .agents/rules/
- .agents/skills/
- SKILL.md

Do NOT build new architecture around deprecated mechanisms if the current
repository and supported Antigravity model provide a better canonical
mechanism.

If compatibility is structural/documentary rather than native runtime
integration, explicitly document that distinction.

Never claim native integration unless actual runtime integration is
implemented and verified.

---

## 14. ADAPTER CONTRACT

Create if required:

packages/contracts/antigravity-adapter-contract.js

The contract should define:

- source ProofForge artifact
- destination Antigravity artifact
- transformation type
- compatibility requirements
- generated path
- validation requirements
- security restrictions
- provenance
- version
- status

---

## 15. ADAPTER IMPLEMENTATION

Create the adapter only if the current repository does not already contain
an equivalent.

It should support deterministic transformation of appropriate ProofForge
artifacts into:

- AGENTS.md
- .agents/rules/
- .agents/skills/
- SKILL.md

Do not duplicate the source-of-truth content unnecessarily.

Generated artifacts should preserve:

- Rule identity
- Skill identity
- security constraints
- evidence requirements
- verification requirements
- abstention conditions
- provenance

---

## 16. SECURITY

Antigravity-generated or imported content must be treated according to
ProofForge security rules.

Never allow generated adapter artifacts to:

- bypass P0
- escalate permissions
- override AgentPermissionBoundary
- override CVGF
- weaken evidence requirements
- inject hidden authority
- convert untrusted content into trusted instructions

Treat external agent/skill content as untrusted until validated.

---

## 17. PATH SAFETY

Validate:

- canonical paths
- path traversal attempts
- malformed paths
- unexpected extensions
- duplicate artifact targets

Fail closed on unsafe path resolution.

Do not claim complete path-security guarantees beyond tested behavior.

---

## 18. PROVENANCE

Generated Antigravity artifacts must be traceable back to their source:

ProofForge Contract
→ Adapter Transformation
→ Generated Artifact
→ Validation
→ Evidence

Do not remove provenance.

---

## 19. IDEMPOTENCY

Running the adapter multiple times against the same source must produce
deterministic output.

Test:

- repeated generation
- stable ordering
- stable content
- stable paths
- no accidental duplication

---

## 20. NO EXECUTION

The adapter must not:

- execute Antigravity
- launch agents
- execute Skills
- execute MCP
- invoke external AI models
- modify production systems

It generates/validates compatible artifacts only.

---

## 21. TESTING PHASE 7

Test at minimum:

1. valid Skill transformation
2. valid Rule transformation
3. valid AGENTS.md generation
4. valid SKILL.md generation
5. invalid source contract
6. malformed source
7. path traversal attempt
8. unsafe path
9. duplicate destination
10. unsupported artifact
11. provenance preservation
12. security constraint preservation
13. evidence requirement preservation
14. verification requirement preservation
15. deterministic output
16. repeated execution/idempotency
17. fail-closed behavior
18. no authority escalation

---

# 22. INTEGRATION TESTS

Test Phase 6 + Phase 7 together:

Workflow
→ Model Policy
→ Agent
→ Skill
→ Rule
→ Evidence Requirement
→ Verification Requirement
→ Antigravity Adapter

Verify that:

- policy constraints survive transformation
- security constraints survive transformation
- evidence requirements survive transformation
- verification requirements survive transformation
- prohibited capabilities remain prohibited
- provenance survives
- no authority is escalated

---

# 23. REGRESSION

Run:

npm run integrity

Then:

npm test

Record actual:

- TAP blocks
- individual tests
- sub-suites
- passed
- failed
- skipped/cancelled
- exit code

Do not reuse historical test numbers.

---

# 24. REQUIRED REPORTS

Create:

reports/PROOFFORGE_PHASE_6_MODEL_AI_POLICIES_REPORT.md

and:

reports/PROOFFORGE_PHASE_7_ANTIGRAVITY_ADAPTER_REPORT.md

Each report must contain:

- Executive Summary
- Scope
- Architecture
- Implementation
- Security
- Evidence
- Verification
- Tests
- Determinism
- Findings
- Limitations
- Final Gate

Additionally create a combined integration section documenting:

Phase 6
↔
Phase 7

and whether policy constraints survive adapter transformation.

---

# 25. FINDINGS

Every finding must contain:

- finding_id
- severity
- location
- description
- evidence
- impact
- repair
- verification
- status

Do not use absolute security claims unless directly demonstrated.

Use:

VERIFIED

or:

VERIFIED WITH LIMITATIONS

where appropriate.

---

# 26. DEFINITION OF DONE

Phase 6 is complete when:

- Model & AI Policy Contract exists
- policy registry exists where required
- policies validate deterministically
- risk classification is deterministic
- security requirements are preserved
- evidence requirements are preserved
- verification requirements are preserved
- abstention is supported
- P0 cannot be bypassed
- no runtime model router is created
- no duplicate CVGF exists

Phase 7 is complete when:

- Antigravity Adapter Contract exists where required
- structural Antigravity transformation works
- modern Skills structure is supported
- provenance is preserved
- security constraints are preserved
- evidence requirements are preserved
- verification requirements are preserved
- path safety is validated
- deterministic output is verified
- idempotency is verified
- no runtime execution is introduced
- native Antigravity integration is not claimed unless actually verified

Both phases require:

- focused tests passing
- npm run integrity passing
- npm test passing
- actual test results recorded
- required reports created
- evidence-based Gates

---

# 27. SCOPE PROTECTION

Do NOT implement Phase 8.

Do NOT implement:

- Tool/MCP Governance
- MCP Evidence Governance
- Tool Trust Layer
- future Multi-Agent Verification
- Real Project Trial
- Adversarial Phase
- Final Release Audit

If a dependency for a later phase is discovered:

document it.

Do not implement it.

---

# 28. PROBLEM HANDLING

If problems are discovered in previous phases:

1. determine whether they block Phase 6/7
2. use previous reports as the source of truth
3. repair only issues necessary for the current mission or explicitly
   required to preserve correctness/security
4. document every repair
5. re-run affected tests
6. update findings and reports

Do not silently ignore blocking defects.

Do not invent historical facts.

---

# 29. FINAL GATE

Each phase must receive its own:

PASS
PASS WITH LIMITATIONS
FAIL

Do not merge the two Gates into one ambiguous status.

After both Gates:

STOP.

Do NOT start Phase 8 or any later phase.

END OF MISSION.