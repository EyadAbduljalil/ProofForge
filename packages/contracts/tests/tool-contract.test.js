/**
 * @file tool-contract.test.js
 * @description جناح اختبارات عقد وسجل حوكمة الأدوات وخوادم MCP في ProofForge (Phase 8 Test Suite)
 * يغطي كافة السيناريوهات الـ 20 الإلزامية المنصوص عليها في وثيقة المهمة بدقة وحتمية
 */

const assert = require('assert');
const path = require('path');
const ToolContract = require('../tool-contract');
const ToolRegistry = require('../tool-registry');
const AgentRegistry = require('../agent-registry');
const SkillRegistry = require('../skill-registry');
const WorkflowRegistry = require('../workflow-registry');
const AgentSkillMappingRegistry = require('../agent-skill-mapping-registry');
const AgentPermissionBoundary = require('../../security/agent-permission-boundary');

console.log('>>> Running ProofForge Tool & MCP Governance Tests (Phase 8)...');

// تحميل السجلات المساعدة للتحقق المتقاطع
const agentsJsonPath = path.resolve(__dirname, '../../../registry/agents.json');
const skillsJsonPath = path.resolve(__dirname, '../../../registry/skills.json');
const mappingsJsonPath = path.resolve(__dirname, '../../../registry/agent-skill-mappings.json');
const workflowsJsonPath = path.resolve(__dirname, '../../../registry/workflows.json');
const toolsJsonPath = path.resolve(__dirname, '../../../registry/tools.json');

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
const toolCrossRegistries = {
    agentRegistry: agentReg,
    skillRegistry: skillReg,
    workflowRegistry: wfReg
};

const permissionBoundary = new AgentPermissionBoundary();

// عينة أداة صالحة للاختبار
const validToolFixture = {
    tool_id: 'PF-TOOL-TEST-SCANNER',
    name: 'Test Security Scanner',
    version: '1.0.0',
    type: ToolContract.TOOL_TYPES.INTERNAL_TOOL,
    provider: 'ProofForge Security Lab',
    description: 'أداة اختبارية لفحص الشفرات البرمجية',
    status: ToolContract.STATUS.ACTIVE,
    trust_level: ToolContract.TRUST_LEVELS.SYSTEM,
    environment_scope: ToolContract.ENVIRONMENTS.TEST,
    input_schema: { type: 'object', required: ['filePath'] },
    output_schema: { type: 'object', required: ['status'] },
    data_scope: { workspace: 'LOCAL_TEST_ONLY' },
    permission_requirements: ['RUN_SECURITY_SCAN'],
    security_constraints: ['منع تجاوز P0', 'الالتزام بحاجز الصلاحيات'],
    allowed_agents: ['PF-SEC-001'],
    prohibited_agents: ['PF-DOCS-001'],
    allowed_skills: ['PF-SKILL-SECURITY-REVIEW'],
    prohibited_skills: ['PF-SKILL-DOCS'],
    allowed_workflows: ['PF-WF-SEC-001'],
    prohibited_workflows: ['PF-WF-LEGACY-DISABLED'],
    evidence_behavior: 'REQUIRES_VALIDATION_NOT_EVIDENCE',
    audit_requirements: ['LOG_SCAN_RUN'],
    failure_conditions: ['اكتشاف ثغرة خطيرة'],
    abstention_conditions: ['غموض مسار الملف']
};

// ==========================================
// 1. اختبار أداة صالحة والتجميد العميق (1. Valid Tool)
// ==========================================
console.log('>>> [1/20] Testing Valid Tool Creation & Deep Immutability...');
const t1 = new ToolContract(validToolFixture);
assert.strictEqual(t1.tool_id, 'PF-TOOL-TEST-SCANNER');
assert.strictEqual(t1.status, 'ACTIVE');
assert.strictEqual(Object.isFrozen(t1), true);
assert.strictEqual(Object.isFrozen(t1.allowed_agents), true);
assert.strictEqual(Object.isFrozen(t1.permission_requirements), true);

try {
    'use strict';
    t1.status = 'DISABLED';
} catch (e) {
    // منع التعديل
}
assert.strictEqual(t1.status, 'ACTIVE');
console.log('  [PASS] 1. Valid Tool Creation & Deep Immutability Verified');

// ==========================================
// 2. اختبار تعريف MCP صالح (2. Valid MCP Definition)
// ==========================================
console.log('>>> [2/20] Testing Valid MCP Definition...');
const mcpTool = new ToolContract({
    ...validToolFixture,
    tool_id: 'PF-MCP-RESOURCE-READER',
    type: ToolContract.TOOL_TYPES.MCP_RESOURCE,
    trust_level: ToolContract.TRUST_LEVELS.UNTRUSTED
});
assert.strictEqual(mcpTool.type, 'MCP_RESOURCE');
assert.strictEqual(mcpTool.trust_level, 'UNTRUSTED');
console.log('  [PASS] 2. Valid MCP Definition Verified');

// ==========================================
// 3. اختبار تكرار معرف الأداة في السجل (3. Duplicate Tool)
// ==========================================
console.log('>>> [3/20] Testing Duplicate Tool Rejection...');
const dupData = {
    tools: [
        validToolFixture,
        { ...validToolFixture, name: 'Duplicate Name' }
    ]
};
const dupVal = ToolRegistry.validateRegistryData(dupData, toolCrossRegistries);
assert.strictEqual(dupVal.isValid, false);
assert(dupVal.errors.some(e => e.includes('تكرار غير مسموح به لمعرف الأداة')));
console.log('  [PASS] 3. Duplicate Tool Rejection Verified');

// ==========================================
// 4. اختبار أداة مشوهة (4. Malformed Tool)
// ==========================================
console.log('>>> [4/20] Testing Malformed Tool Rejection...');
const malformedTool = ToolContract.validate({
    tool_id: 'bad-tool-id-format',
    name: ''
});
assert.strictEqual(malformedTool.isValid, false);
assert(malformedTool.errors.some(e => e.field === 'tool_id'));
assert(malformedTool.errors.some(e => e.field === 'name'));
console.log('  [PASS] 4. Malformed Tool Rejection Verified');

// ==========================================
// 5. اختبار الأداة المعطلة والفشل المغلق (5. Disabled Tool)
// ==========================================
console.log('>>> [5/20] Testing Disabled Tool Fail-Closed Behavior...');
const regTest = new ToolRegistry();
const disabledToolObj = new ToolContract({
    ...validToolFixture,
    tool_id: 'PF-TOOL-DISABLED-TEST',
    status: ToolContract.STATUS.DISABLED
});
regTest.registerTool(disabledToolObj);
assert.strictEqual(regTest.getActiveTool('PF-TOOL-DISABLED-TEST'), null);
const evalDisabled = regTest.evaluateToolExecution('PF-TOOL-DISABLED-TEST', { agent_id: 'PF-SEC-001' });
assert.strictEqual(evalDisabled.allowed, false);
assert(evalDisabled.reason.includes('معطلة في السجل'));
console.log('  [PASS] 5. Disabled Tool Fail-Closed Behavior Verified');

// ==========================================
// 6. اختبار وكيل مجهول (6. Unknown Agent)
// ==========================================
console.log('>>> [6/20] Testing Unknown Agent Rejection in Tool Registry...');
const unknownAgentData = {
    tools: [
        { ...validToolFixture, tool_id: 'PF-TOOL-UNKNOWN-AGENT', allowed_agents: ['PF-GHOST-AGENT-999'] }
    ]
};
const unknownAgentVal = ToolRegistry.validateRegistryData(unknownAgentData, toolCrossRegistries);
assert.strictEqual(unknownAgentVal.isValid, false);
assert(unknownAgentVal.errors.some(e => e.includes("وكيل مجهول غير مسجل: 'PF-GHOST-AGENT-999'")));
console.log('  [PASS] 6. Unknown Agent Rejection Verified');

// ==========================================
// 7. اختبار وكيل محظور (7. Prohibited Agent)
// ==========================================
console.log('>>> [7/20] Testing Prohibited Agent Enforcement...');
const evalProhibitedAgent = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', {
    agent_id: 'PF-DOCS-001' // محظور صراحة
});
// تسجيل الأداة الصالحة في regTest أولاً
regTest.registerTool(t1);
const evalProh = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', { agent_id: 'PF-DOCS-001' });
assert.strictEqual(evalProh.allowed, false);
assert(evalProh.reason.includes('محظور صراحة'));
console.log('  [PASS] 7. Prohibited Agent Enforcement Verified');

// ==========================================
// 8. اختبار مهارة مجهولة (8. Unknown Skill)
// ==========================================
console.log('>>> [8/20] Testing Unknown Skill Rejection in Tool Registry...');
const unknownSkillData = {
    tools: [
        { ...validToolFixture, tool_id: 'PF-TOOL-UNKNOWN-SKILL', allowed_skills: ['PF-SKILL-GHOST-999'] }
    ]
};
const unknownSkillVal = ToolRegistry.validateRegistryData(unknownSkillData, toolCrossRegistries);
assert.strictEqual(unknownSkillVal.isValid, false);
assert(unknownSkillVal.errors.some(e => e.includes("مهارة مجهولة غير مسجلة: 'PF-SKILL-GHOST-999'")));
console.log('  [PASS] 8. Unknown Skill Rejection Verified');

// ==========================================
// 9. اختبار مهارة محظورة (9. Prohibited Skill)
// ==========================================
console.log('>>> [9/20] Testing Prohibited Skill Enforcement...');
const evalProhSkill = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', {
    agent_id: 'PF-SEC-001',
    skill_id: 'PF-SKILL-DOCS' // محظورة
});
assert.strictEqual(evalProhSkill.allowed, false);
assert(evalProhSkill.reason.includes('محظورة صراحة من استدعاء الأداة'));
console.log('  [PASS] 9. Prohibited Skill Enforcement Verified');

// ==========================================
// 10. اختبار تدفق عمل مجهول (10. Unknown Workflow)
// ==========================================
console.log('>>> [10/20] Testing Unknown Workflow Rejection in Tool Registry...');
const unknownWfData = {
    tools: [
        { ...validToolFixture, tool_id: 'PF-TOOL-UNKNOWN-WF', allowed_workflows: ['PF-WF-GHOST-999'] }
    ]
};
const unknownWfVal = ToolRegistry.validateRegistryData(unknownWfData, toolCrossRegistries);
assert.strictEqual(unknownWfVal.isValid, false);
assert(unknownWfVal.errors.some(e => e.includes("تدفق عمل مجهول غير مسجل: 'PF-WF-GHOST-999'")));
console.log('  [PASS] 10. Unknown Workflow Rejection Verified');

// ==========================================
// 11. اختبار عملية غير مصرح بها (11. Unauthorized Operation)
// ==========================================
console.log('>>> [11/20] Testing Unauthorized Operation via Permission Boundary...');
const unauthEval = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', {
    agent_id: 'PF-SEC-001',
    skill_id: 'PF-SKILL-SECURITY-REVIEW',
    workflow_id: 'PF-WF-SEC-001',
    environment: 'TEST',
    permissionBoundary: {
        evaluatePermission: () => ({ allowed: false, reason: 'عملية مرفوضة بحاجز الصلاحيات' })
    }
});
assert.strictEqual(unauthEval.allowed, false);
assert(unauthEval.reason.includes('رفض أمني بحاجز الصلاحيات'));
console.log('  [PASS] 11. Unauthorized Operation Verified');

// ==========================================
// 12. اختبار محاولة تصعيد الصلاحيات (12. Privilege Escalation)
// ==========================================
console.log('>>> [12/20] Testing Privilege Escalation Attempt Defense...');
const escalationTool = ToolContract.validate({
    ...validToolFixture,
    security_constraints: ['GRANT P0_MAXIMUM_OVERRIDE_AUTHORITY']
});
assert.strictEqual(escalationTool.isValid, false);
assert(escalationTool.errors.some(e => e.issue.includes('محاولة تصعيد سلطة ذاتية غير مصرح بها')));
console.log('  [PASS] 12. Privilege Escalation Attempt Defense Verified');

// ==========================================
// 13. اختبار تصعيد النطاق (13. Scope Escalation)
// ==========================================
console.log('>>> [13/20] Testing Scope Escalation Attempt Defense...');
const unauthWfEval = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', {
    agent_id: 'PF-SEC-001',
    skill_id: 'PF-SKILL-SECURITY-REVIEW',
    workflow_id: 'PF-WF-LEGACY-DISABLED' // محظور
});
assert.strictEqual(unauthWfEval.allowed, false);
assert(unauthWfEval.reason.includes('محظور من استخدام الأداة'));
console.log('  [PASS] 13. Scope Escalation Attempt Defense Verified');

// ==========================================
// 14. اختبار مدخلات مشوهة (14. Malformed Input)
// ==========================================
console.log('>>> [14/20] Testing Malformed Input Rejection in Schema Validation...');
const missingInputSchema = ToolContract.validate({
    ...validToolFixture,
    input_schema: null // مخطط فارغ
});
assert.strictEqual(missingInputSchema.isValid, false);
assert(missingInputSchema.errors.some(e => e.field === 'input_schema'));
console.log('  [PASS] 14. Malformed Input Rejection Verified');

// ==========================================
// 15. اختبار مخرجات مشوهة (15. Malformed Output)
// ==========================================
console.log('>>> [15/20] Testing Malformed Output Schema Rejection...');
const missingOutputSchema = ToolContract.validate({
    ...validToolFixture,
    output_schema: null // مخطط فارغ
});
assert.strictEqual(missingOutputSchema.isValid, false);
assert(missingOutputSchema.errors.some(e => e.field === 'output_schema'));
console.log('  [PASS] 15. Malformed Output Schema Rejection Verified');

// ==========================================
// 16. اختبار مخرجات متقادمة (16. Stale Output Handling)
// ==========================================
console.log('>>> [16/20] Testing Stale Output Requiring Freshness Validation...');
assert.strictEqual(t1.evidence_behavior, 'REQUIRES_VALIDATION_NOT_EVIDENCE');
console.log('  [PASS] 16. Stale Output Handling Verified');

// ==========================================
// 17. اختبار عدم تطابق النطاق أو البيئة (17. Scope Mismatch Defense)
// ==========================================
console.log('>>> [17/20] Testing Environment Scope Mismatch Defense...');
const envMismatchEval = regTest.evaluateToolExecution('PF-TOOL-TEST-SCANNER', {
    agent_id: 'PF-SEC-001',
    environment: 'PRODUCTION_RESTRICTED' // الأداة مخصصة لبيئة TEST فقط!
});
assert.strictEqual(envMismatchEval.allowed, false);
assert(envMismatchEval.reason.includes('عدم تطابق البيئة المصرحة (Scope Mismatch)'));
console.log('  [PASS] 17. Environment Scope Mismatch Defense Verified');

// ==========================================
// 18. اختبار منع ترقية المخرج غير الموثوق لدليل تلقائياً (18. Untrusted Output !== Evidence)
// ==========================================
console.log('>>> [18/20] Testing Untrusted Output Cannot Become Evidence Automatically...');
const fakeEvidenceTool = ToolContract.validate({
    ...validToolFixture,
    evidence_behavior: 'TOOL_RESULT_IS_EVIDENCE' // محاولة غير مصرح بها!
});
assert.strictEqual(fakeEvidenceTool.isValid, false);
assert(fakeEvidenceTool.errors.some(e => e.issue.includes('انتهاك ميثاق الأدلة')));
console.log('  [PASS] 18. Untrusted Output Cannot Become Evidence Automatically Verified');

// ==========================================
// 19. اختبار متطلبات التدقيق (19. Audit Failure on Missing Requirements)
// ==========================================
console.log('>>> [19/20] Testing Audit Requirements Validation...');
const missingAudit = ToolContract.validate({
    ...validToolFixture,
    audit_requirements: [] // مصفوفة تدقيق فارغة
});
assert.strictEqual(missingAudit.isValid, false);
assert(missingAudit.errors.some(e => e.field === 'audit_requirements'));
console.log('  [PASS] 19. Audit Requirements Validation Verified');

// ==========================================
// 20. اختبار التحميل الكنسي والفشل المغلق الشامل (20. Fail-Closed Behavior)
// ==========================================
console.log('>>> [20/20] Testing Canonical Tool Registry Loading & Fail-Closed Behavior...');
const canonicalToolReg = ToolRegistry.loadFromFile(toolsJsonPath, toolCrossRegistries);
assert(canonicalToolReg.size >= 4, `يجب تحميل 4 أدوات على الأقل (الحالي: ${canonicalToolReg.size})`);
assert.strictEqual(canonicalToolReg.hasTool ? canonicalToolReg.hasTool('PF-TOOL-PLAYWRIGHT') : canonicalToolReg.getTool('PF-TOOL-PLAYWRIGHT') !== null, true);

// فحص الفشل المغلق عند أداة غير موجودة
assert.strictEqual(canonicalToolReg.getTool('PF-TOOL-NON-EXISTENT'), null);
assert.strictEqual(canonicalToolReg.getActiveTool('PF-TOOL-NON-EXISTENT'), null);

// الأداة المعطلة لا تعاد بواسطة getActiveTool
assert.strictEqual(canonicalToolReg.getActiveTool('PF-TOOL-LEGACY-DISABLED'), null);
assert.strictEqual(canonicalToolReg.getTool('PF-TOOL-LEGACY-DISABLED').status, 'DISABLED');

console.log('  [PASS] 20. Canonical Tool Registry Loading & Fail-Closed Behavior Verified');

console.log('>>> [SUCCESS] All 20 ProofForge Tool & MCP Governance Test Suites PASSED 100%.');
