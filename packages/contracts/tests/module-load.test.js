/**
 * @file module-load.test.js
 * @description اختبار التحميل الشامل لكافة الوحدات والمكونات الكنسية في ProofForge
 * (Full Module Load & Deterministic Component Initialization Test)
 */

const assert = require('assert');
const path = require('path');

console.log('--- [TEST] Full Module Load & Canonical Component Verification ---');

// 1. فحص تحميل مكونات حزمة العقود (Contracts & Registries)
const contractsPkg = require('../index');
assert.ok(contractsPkg.AgentContract, 'AgentContract must be exported');
assert.ok(contractsPkg.AgentRegistry, 'AgentRegistry must be exported');
assert.ok(contractsPkg.SkillContract, 'SkillContract must be exported');
assert.ok(contractsPkg.SkillRegistry, 'SkillRegistry must be exported');
assert.ok(contractsPkg.AgentSkillMapping, 'AgentSkillMapping must be exported');
assert.ok(contractsPkg.AgentSkillMappingRegistry, 'AgentSkillMappingRegistry must be exported');
assert.ok(contractsPkg.WorkflowContract, 'WorkflowContract must be exported');
assert.ok(contractsPkg.WorkflowRegistry, 'WorkflowRegistry must be exported');
assert.ok(contractsPkg.ModelPolicyContract, 'ModelPolicyContract must be exported');
assert.ok(contractsPkg.ModelPolicyRegistry, 'ModelPolicyRegistry must be exported');
assert.ok(contractsPkg.ToolContract, 'ToolContract must be exported');
assert.ok(contractsPkg.ToolRegistry, 'ToolRegistry must be exported');
assert.ok(contractsPkg.AgentHandoffContract, 'AgentHandoffContract must be exported');
assert.ok(contractsPkg.MultiAgentVerification, 'MultiAgentVerification must be exported');
assert.ok(contractsPkg.AntigravityAdapterContract, 'AntigravityAdapterContract must be exported');
assert.ok(contractsPkg.AntigravityAdapter, 'AntigravityAdapter must be exported');
console.log('  [PASS] All 16 Canonical Contracts & Registries Loaded Successfully');

// 2. فحص تحميل مكونات إطار التحكمة الكنسي CVGF (Evidence & Grounding Engines)
const {
    EvidenceGraph,
    ClaimVerificationEngine,
    GroundingGate,
    OutputVerificationEngine,
    AgentAuditRecorder
} = require('../../orchestration');

assert.ok(EvidenceGraph, 'EvidenceGraph must be available');
assert.ok(ClaimVerificationEngine, 'ClaimVerificationEngine must be available');
assert.ok(GroundingGate, 'GroundingGate must be available');
assert.ok(OutputVerificationEngine, 'OutputVerificationEngine must be available');
assert.ok(AgentAuditRecorder, 'AgentAuditRecorder must be available');
console.log('  [PASS] CVGF Core Engines (EvidenceGraph, ClaimVerification, GroundingGate, OutputVerification, AuditRecorder) Loaded Successfully');

// 3. فحص تحميل حدود الأذونات ومكونات الأمان (Security Permission Boundary)
const { AgentPermissionBoundary } = require('../../security');
assert.ok(AgentPermissionBoundary, 'AgentPermissionBoundary must be available');
console.log('  [PASS] Security Boundary (AgentPermissionBoundary) Loaded Successfully');

// 4. التحقق الحتمي من تحميل ملفات السجلات المركزية الستة من مسار القرص
const rootDir = path.resolve(__dirname, '../../..');
const agentReg = contractsPkg.AgentRegistry.loadFromFile(path.join(rootDir, 'registry/agents.json'));
const skillReg = contractsPkg.SkillRegistry.loadFromFile(path.join(rootDir, 'registry/skills.json'));
const mappingReg = contractsPkg.AgentSkillMappingRegistry.loadFromFile(
    path.join(rootDir, 'registry/agent-skill-mappings.json'),
    agentReg,
    skillReg
);
const workflowReg = contractsPkg.WorkflowRegistry.loadFromFile(
    path.join(rootDir, 'registry/workflows.json'),
    agentReg,
    skillReg
);
const modelReg = contractsPkg.ModelPolicyRegistry.loadFromFile(path.join(rootDir, 'registry/model-policies.json'));
const toolReg = contractsPkg.ToolRegistry.loadFromFile(path.join(rootDir, 'registry/tools.json'));

assert.strictEqual(agentReg.agents.size, 10, 'AgentRegistry must have 10 registered agents');
assert.strictEqual(skillReg.skills.size, 29, 'SkillRegistry must have 29 registered skills');
assert.strictEqual(mappingReg.mappings.size, 18, 'AgentSkillMappingRegistry must have 18 registered mappings');
assert.strictEqual(workflowReg.workflows.size, 6, 'WorkflowRegistry must have 6 registered workflows');
assert.strictEqual(modelReg.policies.size, 5, 'ModelPolicyRegistry must have 5 registered policies');
assert.strictEqual(toolReg.tools.size, 5, 'ToolRegistry must have 5 registered tools');
console.log('  [PASS] All 6 Authoritative Registries Loaded and Verified Deterministically');

// 5. فحص تهيئة كائنات CVGF في الذاكرة والتأكد من خلوها من أي انهيار
const evidenceGraph = new EvidenceGraph();
assert.ok(evidenceGraph, 'EvidenceGraph instance created');
const claimEngine = new ClaimVerificationEngine({ evidenceGraph });
assert.ok(claimEngine, 'ClaimVerificationEngine instance created');
const groundingGate = new GroundingGate({ evidenceGraph });
assert.ok(groundingGate, 'GroundingGate instance created');
const outputEngine = new OutputVerificationEngine({ claimVerificationEngine: claimEngine, groundingGate });
assert.ok(outputEngine, 'OutputVerificationEngine instance created');
console.log('  [PASS] In-Memory CVGF Pipeline Initialized Successfully');

console.log('>>> [SUCCESS] Full Module Load Test Passed with Complete Proof.');
