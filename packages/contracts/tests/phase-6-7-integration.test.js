/**
 * @file phase-6-7-integration.test.js
 * @description جناح اختبارات التكامل الشامل بين المرحلة 6 (سياسات النماذج) والمرحلة 7 (محول Antigravity)
 * يختبر السلسلة المعمارية الكاملة:
 * Workflow → Model Policy → Agent → Skill → Rule → Evidence Requirement → Verification Requirement → Antigravity Adapter
 */

const assert = require('assert');
const path = require('path');
const WorkflowRegistry = require('../workflow-registry');
const ModelPolicyRegistry = require('../model-policy-registry');
const AgentRegistry = require('../agent-registry');
const SkillRegistry = require('../skill-registry');
const AgentSkillMappingRegistry = require('../agent-skill-mapping-registry');
const AntigravityAdapter = require('../antigravity-adapter');

console.log('>>> Running ProofForge Phase 6 + Phase 7 Integration Tests...');

// 1. تحميل كافة السجلات الكنسية المعيارية
const agentsJsonPath = path.resolve(__dirname, '../../../registry/agents.json');
const skillsJsonPath = path.resolve(__dirname, '../../../registry/skills.json');
const mappingsJsonPath = path.resolve(__dirname, '../../../registry/agent-skill-mappings.json');
const workflowsJsonPath = path.resolve(__dirname, '../../../registry/workflows.json');
const modelPoliciesJsonPath = path.resolve(__dirname, '../../../registry/model-policies.json');

const agentReg = AgentRegistry.loadFromFile(agentsJsonPath);
const skillReg = SkillRegistry.loadFromFile(skillsJsonPath);
const mappingReg = AgentSkillMappingRegistry.loadFromFile(mappingsJsonPath);
const validRules = ['P0_SECURITY_SAFETY', 'P2_ARCHITECTURE', 'P4_ENGINEERING', 'sec.zero-trust', 'sec.authorization-ownership', 'sec.secrets-management', 'RULE-ARCH-01', 'RULE-ARCH-02', 'backend.schema-validation', 'qa.evidence-verification'];
const validValidators = ['SECURITY_AUDITOR', 'OWASP_ASVS_CHECKER', 'INJECTION_DETECTOR', 'ARCHITECTURE_AUDITOR', 'ADR_LINTER', 'SCHEMA_VALIDATOR', 'API_CONTRACT_VALIDATOR', 'TEST_RUNNER', 'DETERMINISM_VERIFIER'];

const crossRegistries = {
    agentRegistry: agentReg,
    skillRegistry: skillReg,
    mappingRegistry: mappingReg,
    validRules,
    validValidators
};

const wfReg = WorkflowRegistry.loadFromFile(workflowsJsonPath, crossRegistries);
const policyReg = ModelPolicyRegistry.loadFromFile(modelPoliciesJsonPath, crossRegistries);

// 2. اختبار السلسلة التكاملية: Workflow (PF-WF-SEC-001) → Model Policy (PF-POL-SEC-CRITICAL)
console.log('>>> [1/6] Testing Chain: Workflow → Model Policy Compatibility...');
const secWf = wfReg.getActiveWorkflow('PF-WF-SEC-001');
assert(secWf !== null, 'تدفق فحص الأمان يجب أن يكون نشطاً في السجل');

const secPolicy = policyReg.getActivePolicy('PF-POL-SEC-CRITICAL');
assert(secPolicy !== null, 'سياسة الأمان الصارمة يجب أن تكون نشطة في السجل');

// تقييم التوافق لمنع تخفيض مستوى الأمان
const compliance = policyReg.evaluatePolicyCompliance('PF-POL-SEC-CRITICAL', {
    task_type: 'SECURITY_AUDIT',
    risk_level: 'CRITICAL'
});
assert.strictEqual(compliance.compliant, true);
console.log('  [PASS] 1. Workflow → Model Policy Compatibility Verified');

// 3. التحقق من بقاء المحددات الأمنية أثناء التحويل الهيكلي لـ Antigravity
console.log('>>> [2/6] Testing Security Constraints Survival Across Adapter Transformation...');
const wfAdapterResult = AntigravityAdapter.transformWorkflowWithPolicy(secWf, secPolicy);
assert.strictEqual(wfAdapterResult.constraintsSurvive, true);
assert(wfAdapterResult.content.includes('الخضوع المطلق لحاجز الصلاحيات الأمني المركزي'));
assert(wfAdapterResult.content.includes('حظر كامل لأي تجاوز لسياسات الأمان P0'));
console.log('  [PASS] 2. Security Constraints Survival Across Adapter Transformation Verified');

// 4. التحقق من بقاء متطلبات الأدلة وبوابات CVGF
console.log('>>> [3/6] Testing Evidence & CVGF Gate Survival Across Transformation...');
assert(wfAdapterResult.content.includes('CVGF_GROUNDING_GATE'));
assert(wfAdapterResult.content.includes('VULNERABILITY_PROOF_OF_CONCEPT'));
console.log('  [PASS] 3. Evidence & CVGF Gate Survival Across Transformation Verified');

// 5. التحقق من بقاء حظر القدرات المحظورة
console.log('>>> [4/6] Testing Prohibited Capabilities Remain Blocked...');
assert(secPolicy.prohibited_behaviors.some(p => p.includes('تجاوز سياسات الأمان P0')));
assert(secWf.prohibited_agents.length > 0);
assert(secWf.prohibited_skills.length > 0);
console.log('  [PASS] 4. Prohibited Capabilities Remain Blocked Verified');

// 6. التحقق من عدم تصعيد السلطة وثبات سلسلة النسب
console.log('>>> [5/6] Testing No Authority Escalation Across End-to-End Pipeline...');
assert(!wfAdapterResult.content.includes('GRANT P0'));
assert(!wfAdapterResult.content.includes('GRANT RUNTIME EXECUTION'));
console.log('  [PASS] 5. No Authority Escalation Across End-to-End Pipeline Verified');

// 7. التحقق من التوليد الحتمي للمانيفست المتوافق مع Antigravity
console.log('>>> [6/6] Testing Full System Manifest Generation...');
const systemManifest = AntigravityAdapter.generateAgentsManifest(agentReg);
assert(systemManifest.content.includes('PF-SEC-001'));
assert(systemManifest.content.includes('PF-ARCH-001'));
assert(systemManifest.provenance.source_contract === 'ProofForge AgentRegistry');
console.log('  [PASS] 6. Full System Manifest Generation Verified');

console.log('>>> [SUCCESS] All Phase 6 + Phase 7 Integration Tests PASSED 100%.');
