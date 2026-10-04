# ProofForge — Phase 3: Skill Contract & Skill Registry

Mission ID: PROOFFORGE-PHASE-3-SKILL-SYSTEM
Project: ProofForge
Current Identity: ProofForge — AI Engineering Verification Framework

Phase: 3 of 12
Phase Name: Skill Contract & Skill Registry

Status: IMPLEMENTATION

---

# 1. MISSION OBJECTIVE

Build the canonical ProofForge Skill System.

This phase establishes:

1. Skill Contract
2. Skill Registry
3. Skill metadata
4. Skill lifecycle/status
5. Skill validation
6. Skill security constraints
7. Skill permissions
8. Skill inputs/outputs
9. Skill preconditions
10. Skill failure conditions
11. Skill abstention conditions
12. Skill evidence requirements
13. Skill validation requirements
14. Skill verification requirements
15. Agent ↔ Skill compatibility

The goal is to transform the existing Skill concept/registry into a deterministic, validated, security-aware Skill architecture.

This phase MUST build on:

- Phase 1 Architecture Audit
- Phase 2 Agent Contract & Registry

Do not create a parallel architecture.

---

# 2. MANDATORY PREVIOUS PHASES

Before modifying anything, read:

reports/PROOFFORGE_PHASE_1_ARCHITECTURE_AUDIT.md

reports/PROOFFORGE_PHASE_2_AGENT_CONTRACT_REGISTRY_REPORT.md

Then inspect the actual repository components referenced by those reports.

At minimum inspect:

- registry/skills.json
- packages/contracts/
- packages/contracts/agent-contract.js
- packages/contracts/agent-registry.js
- packages/security/agent-permission-boundary.js
- packages/orchestration/agent-audit-recorder.js
- existing validators
- existing rule registries
- existing evidence systems
- existing CVGF components
- existing tests

Do not blindly trust reports.

Confirm important architectural assumptions against the actual repository.

---

# 3. CORE PRINCIPLE

A Skill is NOT:

- an autonomous agent;
- a runtime;
- a code generator;
- an LLM;
- a workflow engine;
- an MCP server;
- a permission escalation mechanism.

A Skill is a bounded, reusable, verifiable capability definition.

Conceptually:

Agent
 ↓
Skill
 ↓
Rules
 ↓
Execution by external AI system
 ↓
Validation
 ↓
Evidence
 ↓
Verification
 ↓
Report

ProofForge defines and verifies the Skill.

External AI tooling performs the actual work.

---

# 4. EXISTING SKILL REGISTRY

Phase 1 identified an existing:

registry/skills.json

Inspect it before making changes.

Determine:

- current schema;
- current number of skills;
- current IDs/names;
- current paths;
- current statuses;
- duplicate entries;
- broken paths;
- unsupported fields;
- references to missing files;
- whether the registry is authoritative or informational.

Do not assume existing paths are valid.

Resolve the previously identified issue where registry entries may reference:

skills/<name>/SKILL.md

while the actual repository does not contain the expected Skill directories.

Do not silently repair paths.

Determine the correct canonical architecture first.

---

# 5. SKILL CONTRACT

Create the canonical Skill Contract.

Preferred location:

packages/contracts/skill-contract.js

If an established contract architecture already exists, integrate with it.

The Skill Contract must support at minimum:

- id
- name
- version
- description
- category
- purpose
- inputs
- outputs
- preconditions
- postconditions
- responsibilities
- allowed_agents
- prohibited_agents
- applicable_rules
- security_constraints
- permission_requirements
- authority_constraints
- validators
- validation_requirements
- verification_requirements
- required_evidence
- evidence_schema
- failure_conditions
- abstention_conditions
- reporting_requirements
- audit_requirements
- status

Do not add fields without architectural justification.

---

# 6. SKILL ID

Skill IDs must be:

- unique;
- deterministic;
- stable;
- machine-readable.

Use a consistent ProofForge namespace.

Prefer descriptive IDs such as:

PF-SKILL-SECURITY-REVIEW
PF-SKILL-ARCHITECTURE-REVIEW
PF-SKILL-BACKEND-REVIEW
PF-SKILL-API-REVIEW
PF-SKILL-DATABASE-REVIEW
PF-SKILL-TESTING-REVIEW
PF-SKILL-PERFORMANCE-REVIEW
PF-SKILL-DEPENDENCY-AUDIT
PF-SKILL-AUTHENTICATION-REVIEW
PF-SKILL-AUTHORIZATION-REVIEW

If the existing registry already uses another stable convention, preserve it and document the convention.

Do not create duplicate IDs merely to rename existing skills.

---

# 7. SKILL STATUS

Define or reuse a deterministic lifecycle.

At minimum support:

- DRAFT
- ACTIVE
- DEPRECATED
- DISABLED

Only ACTIVE skills may be selected as authoritative capabilities.

Inactive skills must fail closed when an execution path attempts to use them as active capabilities.

---

# 8. SKILL PURPOSE

Every Skill must have a narrowly defined purpose.

A Skill should answer:

- What capability does it provide?
- What problem does it solve?
- What is inside its boundary?
- What is outside its boundary?

Avoid skills that are too broad.

Bad:

"Do everything required for backend development."

Good:

"Review backend authentication implementation against applicable ProofForge authentication and security rules."

---

# 9. INPUT CONTRACT

Each Skill must define its expected inputs.

Inputs should identify, where applicable:

- name;
- type;
- required/optional;
- source;
- trust level;
- validation requirements.

Untrusted input must not automatically become trusted instructions.

Do not allow a Skill input to override:

- system security rules;
- authority hierarchy;
- permission boundaries;
- mandatory validators;
- evidence requirements.

---

# 10. OUTPUT CONTRACT

Each Skill must define expected outputs.

Outputs should distinguish:

- findings;
- decisions;
- modifications;
- recommendations;
- validation results;
- evidence;
- verification status.

Do not allow a generic output string to be interpreted as verified evidence.

---

# 11. PRECONDITIONS

Every Skill should support explicit preconditions.

Examples:

- required repository scope available;
- required files available;
- required agent authority present;
- required validator available;
- required evidence available;
- required environment available.

If preconditions are not satisfied:

Do not execute the Skill as if it were valid.

Use the appropriate abstention/failure state.

---

# 12. POSTCONDITIONS

Skills should define what must be true after successful execution.

Examples:

- specified files reviewed;
- validation completed;
- findings classified;
- evidence recorded;
- verification performed.

Do not equate "Skill completed" with "system verified."

---

# 13. AGENT ↔ SKILL BOUNDARY

The Agent Contract created in Phase 2 already supports:

- allowed_skills
- required_skills
- prohibited_skills

The Skill Contract must provide the complementary side:

- allowed_agents
- prohibited_agents

This creates:

Agent
↕
Skill

with explicit compatibility rules.

A Skill must not automatically become available to every Agent.

An Agent must not automatically gain a Skill merely because the Skill exists in the Registry.

---

# 14. SKILL PERMISSIONS

Skills must declare permission requirements.

Examples:

- READ_REPOSITORY
- WRITE_SOURCE
- RUN_TESTS
- READ_CONFIG
- READ_SECURITY_REPORTS

Do not introduce arbitrary permission names if an existing permission vocabulary already exists.

Integrate with:

packages/security/agent-permission-boundary.js

Important:

Skill-declared permissions are NOT actual authority.

Actual authority remains enforced by the existing security boundary.

---

# 15. AUTHORITY

Skills must not elevate authority.

A Skill cannot:

- override P0 Security;
- bypass the authority hierarchy;
- bypass mandatory quality gates;
- bypass permission boundaries;
- grant an Agent new authority;
- treat untrusted instructions as trusted;
- convert tool output into trusted evidence.

If a Skill requests authority that is unavailable:

FAIL CLOSED.

---

# 16. RULE INTEGRATION

Skills must reference applicable ProofForge rules.

Use existing rule IDs where available.

Do not copy rule text into every Skill.

Prefer:

Skill
→ Rule IDs
→ Canonical Rules

This prevents duplication and makes rule updates authoritative.

---

# 17. VALIDATOR INTEGRATION

Skills must reference existing validators where appropriate.

Do not create a new validator merely because a Skill needs validation.

Prefer:

Skill
→ Validator IDs
→ Existing Validator

If an existing validator is insufficient, document the gap.

Do not expand the validator architecture outside the scope of this phase unless absolutely required for the Skill Contract itself.

---

# 18. EVIDENCE REQUIREMENTS

Every active Skill must be capable of declaring evidence requirements.

This is mandatory.

Examples:

Security Review:

Required Evidence:
- reviewed files;
- applicable rules;
- findings;
- validation results;
- test results where applicable;
- finding verification;
- final status.

The Skill must distinguish:

AI claim
≠
Work performed
≠
Validation result
≠
Evidence
≠
Verification.

---

# 19. EVIDENCE SCHEMA

The Skill Contract should define the structure expected for Skill evidence.

At minimum consider:

- evidence_type;
- source;
- scope;
- timestamp;
- validator;
- result;
- provenance;
- verification_status.

Reuse the existing EvidenceGraph conventions.

Do NOT create a second evidence store.

Do NOT create a second provenance system.

---

# 20. TEMPORAL AND SCOPE REQUIREMENTS

Where evidence is time-sensitive or scope-sensitive, the Skill must support:

- evidence freshness;
- project/repository scope;
- tenant/scope where applicable;
- artifact identity.

Stale or mismatched evidence must not be treated as current proof.

Reuse existing CVGF/EvidenceGraph mechanisms.

---

# 21. FAILURE CONDITIONS

Skills must explicitly support failure conditions.

Examples:

- invalid input;
- missing required file;
- unavailable validator;
- permission denied;
- validation failure;
- conflicting rules;
- insufficient evidence;
- stale evidence;
- scope mismatch;
- verification failure.

Do not silently convert failures into success.

---

# 22. ABSTENTION CONDITIONS

Skills must explicitly support abstention.

Examples:

- insufficient evidence;
- unsupported environment;
- ambiguous scope;
- conflicting requirements;
- missing required authority;
- untrusted input;
- stale evidence;
- missing validator;
- verification uncertainty.

Abstention is not equivalent to FALSE.

Use existing ProofForge semantics.

---

# 23. REPORTING REQUIREMENTS

A Skill must define what it must report.

At minimum consider:

- input scope;
- work performed;
- rules applied;
- validators executed;
- evidence generated;
- unresolved findings;
- limitations;
- verification status.

Never allow a Skill report to claim:

VERIFIED

unless the required verification evidence exists.

---

# 24. AUDIT INTEGRATION

Integrate with:

packages/orchestration/agent-audit-recorder.js

Do not create another audit system.

Skill actions must remain traceable to:

Requirement
→ Agent
→ Skill
→ Rule
→ Action
→ Validation
→ Evidence
→ Verification
→ Report

---

# 25. SKILL REGISTRY

Use:

registry/skills.json

as the canonical registry if Phase 1 confirms it is the appropriate registry architecture.

If the existing registry architecture requires an extension, implement the minimum required change.

The registry must support:

- skill ID;
- contract reference;
- status;
- version;
- category;
- compatibility;
- rule references;
- validator references.

Do not duplicate full Skill Contracts inside the Registry unless the existing architecture requires it.

Prefer references.

---

# 26. PATH INTEGRITY

The previous audit identified a potential mismatch between:

registry/skills.json

and:

skills/<name>/SKILL.md

Resolve this explicitly.

Choose one canonical model based on the actual repository architecture:

Option A:

registry/skills.json
→ packages/contracts/skill-contract.js

Option B:

registry/skills.json
→ skills/<id>/SKILL.md

Option C:

another existing architecture proven by repository evidence.

Do not maintain multiple competing Skill sources of truth.

If SKILL.md files are introduced, establish their relationship to the machine-readable Skill Contract.

The Registry must not point to nonexistent files.

---

# 27. INITIAL SKILL SET

Do not create dozens of Skills.

Create a minimal foundational set based on the Phase 1/2 findings.

Preferred initial set:

1. security-review
2. architecture-review
3. backend-review
4. api-review
5. database-review
6. testing-review
7. performance-review
8. dependency-audit
9. authentication-review
10. authorization-review

If an existing registry already contains these or equivalent Skills:

- reuse;
- normalize;
- validate;
- do not duplicate.

---

# 28. SKILL QUALITY STANDARD

Every ACTIVE Skill must have:

- clear purpose;
- defined inputs;
- defined outputs;
- defined boundary;
- allowed agents;
- prohibited agents where needed;
- applicable rules;
- permissions;
- validators;
- evidence requirements;
- verification requirements;
- failure conditions;
- abstention conditions;
- reporting requirements.

Do not activate incomplete Skills.

Incomplete Skills may remain:

DRAFT

until completed.

---

# 29. SKILL VALIDATOR

Create a deterministic Skill Contract validator if no suitable existing validator exists.

Preferred location:

packages/contracts/skill-contract.js

or the repository's established validation architecture.

It must reject at minimum:

- missing ID;
- duplicate ID;
- missing purpose;
- invalid status;
- invalid version;
- malformed inputs;
- malformed outputs;
- invalid agent references;
- invalid rule references;
- invalid validator references;
- invalid permission references;
- malformed evidence requirements;
- malformed verification requirements.

Invalid contracts must fail closed.

---

# 30. REGISTRY VALIDATION

The Skill Registry must reject:

- duplicate Skill IDs;
- missing contract references;
- invalid status;
- invalid version;
- nonexistent referenced contracts;
- malformed metadata;
- invalid agent references;
- invalid rule references;
- invalid validator references.

Do not silently ignore malformed entries.

---

# 31. DETERMINISM

Skill loading and validation must be deterministic.

The same repository state must produce the same:

- registry;
- active skill set;
- validation result;
- skill metadata.

Do not depend on:

- network access;
- model output;
- timestamps;
- random selection.

Runtime evidence may contain timestamps, but registry resolution must remain deterministic.

---

# 32. SECURITY TESTING

Add focused security tests for:

1. Skill cannot self-escalate.
2. Skill cannot override P0.
3. Skill cannot bypass AgentPermissionBoundary.
4. Prohibited Agent cannot use Skill.
5. Disabled Skill cannot become active.
6. Untrusted input cannot redefine Skill Contract.
7. Tool/MCP output cannot automatically become Skill evidence.
8. Stale evidence cannot automatically become current evidence.
9. Scope-mismatched evidence cannot automatically satisfy Skill evidence requirements.
10. Malformed registry fails closed.

---

# 33. CONTRACT TESTING

Test:

- valid Skill Contract;
- missing fields;
- malformed fields;
- duplicate IDs;
- invalid status;
- invalid versions;
- invalid references;
- invalid permissions;
- invalid evidence schema;
- invalid verification requirements;
- valid abstention conditions;
- valid failure conditions.

---

# 34. INTEGRATION TESTING

Verify integration with:

- Phase 2 Agent Contract;
- Agent Registry;
- existing rules;
- existing validators;
- AgentPermissionBoundary;
- AgentAuditRecorder;
- EvidenceGraph;
- CVGF.

Do not create fake stand-ins where actual repository components can be used.

---

# 35. TEST REPORTING

Run the relevant focused tests.

Then run:

npm run integrity

Then run:

npm test

Do not copy previous test counts.

Record the actual results:

- suites;
- tests;
- passed;
- failed;
- skipped;
- exit code.

If a test command does not exist, record that fact.

If unrelated legacy tests fail, classify them separately.

Do not hide failures.

---

# 36. DOCUMENTATION

Create or update only the documentation necessary to explain the new Skill architecture.

Do NOT perform the complete README rebrand.

Do NOT rewrite unrelated documentation.

Do NOT modify historical reports.

Document:

- Skill Contract;
- Skill Registry;
- Agent ↔ Skill relationship;
- Skill evidence requirements;
- Skill security boundaries.

---

# 37. TRACEABILITY

Every Skill capability must map to:

Requirement
→ Contract Field
→ Registry Entry
→ Validation
→ Test
→ Evidence

No major field should exist without a clear purpose.

---

# 38. ARCHITECTURAL QUALITY GATE

Before completion verify:

1. No duplicate Agent Contract.
2. No duplicate Agent Registry.
3. No duplicate authority hierarchy.
4. No duplicate permission boundary.
5. No duplicate audit recorder.
6. No duplicate EvidenceGraph.
7. No duplicate CVGF.
8. No runtime introduced.
9. No autonomous execution engine introduced.
10. No MCP server introduced.
11. No external agent catalog copied.
12. Skill Registry has one source of truth.
13. Skill IDs are unique.
14. Skill loading is deterministic.
15. Skill permissions cannot self-escalate.
16. Agent ↔ Skill compatibility is explicit.
17. Evidence requirements are explicit.
18. Verification requirements are explicit.
19. Abstention is explicit.
20. Invalid Skills fail closed.

---

# 39. REQUIRED REPORT

Create:

reports/PROOFFORGE_PHASE_3_SKILL_SYSTEM_REPORT.md

The report MUST contain:

# ProofForge Phase 3 — Skill System Report

## 1. Executive Summary

## 2. Phase 1/2 Findings Used

## 3. Existing Skill Architecture

## 4. Skill Contract

## 5. Skill Registry

## 6. Skill Path Integrity

## 7. Agent ↔ Skill Mapping

## 8. Rules Integration

## 9. Validator Integration

## 10. Permission & Authority Integration

## 11. Evidence Requirements

## 12. Verification Requirements

## 13. Failure & Abstention Model

## 14. Security Analysis

## 15. Initial Skill Set

## 16. Tests Executed

## 17. Traceability Matrix

## 18. Files Created

## 19. Files Modified

## 20. Files Deleted

## 21. Remaining Limitations

## 22. Phase 4 Prerequisites

## 23. Final Gate

---

# 40. FILE CHANGE CONTROL

Explicitly report:

FILES CREATED
FILES MODIFIED
FILES DELETED

If none were deleted:

FILES DELETED: NONE

Do not hide changes.

---

# 41. FINAL GATE

Issue exactly one:

PASS

PASS WITH LIMITATIONS

FAIL

PASS requires:

- Skill Contract implemented;
- Skill Registry implemented or correctly extended;
- existing Skill definitions normalized or correctly preserved;
- no duplicate source of truth;
- deterministic validation;
- security boundaries preserved;
- Agent ↔ Skill compatibility implemented;
- evidence requirements implemented;
- verification requirements implemented;
- abstention implemented;
- tests executed;
- integrity checks executed.

PASS WITH LIMITATIONS if the architecture is correct but bounded limitations remain.

FAIL if:

- Skill architecture conflicts with Agent architecture;
- registry is not deterministic;
- invalid Skills can become active;
- security boundaries can be bypassed;
- tests fail without acceptable explanation;
- duplicate verification/governance architecture is introduced.

---

# 42. STOP CONDITION

When complete:

1. Run focused Skill tests.
2. Run npm run integrity.
3. Run npm test.
4. Inspect actual changed files.
5. Verify no prohibited architecture was introduced.
6. Create the final Phase 3 report.
7. Issue the Final Gate.
8. STOP.

Do NOT start Phase 4.

Do NOT implement Agent ↔ Skill routing beyond what is required to validate compatibility.

Do NOT implement TaskRouter.

Do NOT implement Workflow Contract.

Do NOT implement Model/AI Policy.

Do NOT implement Antigravity Adapter.

Do NOT implement MCP Governance.

Do NOT begin the private-project trial.

Those belong to later missions.

---

# END OF PHASE 3