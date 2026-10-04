/**
 * @file agent-contract.test.js
 * @description حزمة اختبارات عقد وسجل وكيل الذكاء الاصطناعي (Agent Contract & Registry Test Suite)
 * تغطي التحقق الحتمي، الفحص الأمني، مكافحة التصعيد الذاتي، ونزاهة السجل المغلق
 */

const assert = require('assert');
const path = require('path');
const { AgentContract, AgentRegistry } = require('../index');
const AuthorityHierarchy = require('../../orchestration/authority-hierarchy');

console.log('>>> Running ProofForge Agent Contract & Registry Tests...');

// عينة لعقد صالح مكتمل
const validAgentFixture = {
    id: 'PF-TEST-001',
    name: 'Test Engineer',
    version: '1.0.0',
    description: 'وكيل اختباري معتمد لأغراض التحقق',
    role: 'Test Engineer',
    expertise: ['Automated Testing', 'Verification'],
    responsibilities: ['تنفيذ الاختبارات', 'جمع الأدلة'],
    allowed_tasks: ['RUN_UNIT_TESTS', 'RUN_INTEGRATION_TESTS'],
    prohibited_tasks: ['BYPASS_SECURITY', 'RAW_SECRET_ACCESS'],
    allowed_skills: ['testing', 'verification'],
    required_skills: ['testing'],
    prohibited_skills: ['arbitrary-code-execution'],
    applicable_rules: ['P4_ENGINEERING', 'RULE-TEST-01'],
    security_constraints: ['منع تجاوز بوابات الأمان'],
    permission_boundary: {
        READ_REPOSITORY: 'ALLOWED',
        RUN_TESTS: 'ALLOWED',
        WRITE_SOURCE: 'REQUIRES_CHECKPOINT'
    },
    authority_level: 'P4_ENGINEERING',
    required_evidence: ['TEST_EXECUTION_LOG'],
    validation_requirements: ['UNIT_TESTS'],
    verification_requirements: ['CVGF_GROUNDING_GATE'],
    failure_conditions: ['فشل الاختبارات'],
    abstention_conditions: ['غياب الأدلة الداعمة'],
    reporting_requirements: ['TEST_SUMMARY'],
    audit_requirements: ['LOG_TEST_RUNS'],
    status: 'ACTIVE'
};

// ==========================================
// 1. اختبارات العقد الصالح والتحقق الحتمي
// ==========================================
console.log('>>> [1/7] Testing Valid Agent Contract Instantiation & Immutability...');
const agent = new AgentContract(validAgentFixture);
assert.strictEqual(agent.id, 'PF-TEST-001');
assert.strictEqual(agent.name, 'Test Engineer');
assert.strictEqual(agent.status, AgentContract.STATUS.ACTIVE);
assert.strictEqual(agent.authority_level, 'P4_ENGINEERING');
assert.strictEqual(agent.isTaskAllowed('RUN_UNIT_TESTS'), true);
assert.strictEqual(agent.isTaskAllowed('BYPASS_SECURITY'), false);
assert.strictEqual(agent.isTaskAllowed('UNKNOWN_TASK'), false);

// التأكد من تجميد الكائن وعدم قابليته للتعديل العشوائي (Object.freeze)
assert.throws(() => {
    'use strict';
    agent.name = 'Tampered Name';
}, /Cannot assign to read only property/);
console.log('  [PASS] Valid Contract Creation & Immutability Verified');

// ==========================================
// 2. كشف الحقول المفقودة وصيغة المعرفات
// ==========================================
console.log('>>> [2/7] Testing Contract Validation Edge Cases & Malformed Inputs...');
// معرف غير صالح
const badIdDef = { ...validAgentFixture, id: 'INVALID-ID-FORMAT' };
const badIdRes = AgentContract.validate(badIdDef);
assert.strictEqual(badIdRes.isValid, false);
assert(badIdRes.errors.some(e => e.field === 'id'));

// حالة غير صالحة
const badStatusDef = { ...validAgentFixture, status: 'INVALID_STATUS' };
const badStatusRes = AgentContract.validate(badStatusDef);
assert.strictEqual(badStatusRes.isValid, false);
assert(badStatusRes.errors.some(e => e.field === 'status'));

// حقل إلزامي مفقود
const missingRoleDef = { ...validAgentFixture, role: '' };
const missingRoleRes = AgentContract.validate(missingRoleDef);
assert.strictEqual(missingRoleRes.isValid, false);
assert(missingRoleRes.errors.some(e => e.field === 'role'));
console.log('  [PASS] Missing Fields & Malformed ID Rejection Verified');

// ==========================================
// 3. منع التصعيد الذاتي للسلطة (Security Self-Escalation Defense)
// ==========================================
console.log('>>> [3/7] Testing Anti-Self-Escalation Authority Defense...');
// محاولة منح الوكيل سلطة P0 الأمنية أو P1 الدستورية
const escalatedDefP0 = { ...validAgentFixture, id: 'PF-HACK-001', authority_level: 'P0_SECURITY_SAFETY' };
const resP0 = AgentContract.validate(escalatedDefP0);
assert.strictEqual(resP0.isValid, false);
assert(resP0.errors.some(e => e.field === 'authority_level' && e.issue.includes('محاولة تصعيد أمني')));

const escalatedDefP1 = { ...validAgentFixture, id: 'PF-HACK-002', authority_level: 'P1_CONSTITUTION' };
const resP1 = AgentContract.validate(escalatedDefP1);
assert.strictEqual(resP1.isValid, false);
assert(resP1.errors.some(e => e.field === 'authority_level' && e.issue.includes('محاولة تصعيد أمني')));
console.log('  [PASS] Self-Escalation to P0 or P1 Strictly Blocked');

// ==========================================
// 4. كشف التعارضات المنطقية في المهارات والمهام
// ==========================================
console.log('>>> [4/7] Testing Logical Conflicts in Skills and Tasks...');
const conflictingSkillsDef = {
    ...validAgentFixture,
    allowed_skills: ['testing', 'network'],
    prohibited_skills: ['network', 'arbitrary-exec']
};
const confSkillRes = AgentContract.validate(conflictingSkillsDef);
assert.strictEqual(confSkillRes.isValid, false);
assert(confSkillRes.errors.some(e => e.field === 'skills_conflict'));

const conflictingTasksDef = {
    ...validAgentFixture,
    allowed_tasks: ['TASK_A', 'TASK_B'],
    prohibited_tasks: ['TASK_B']
};
const confTaskRes = AgentContract.validate(conflictingTasksDef);
assert.strictEqual(confTaskRes.isValid, false);
assert(confTaskRes.errors.some(e => e.field === 'tasks_conflict'));
console.log('  [PASS] Internal Skill and Task Conflict Detection Verified');

// ==========================================
// 5. حراسة الصلاحيات وشروط الامتناع (Abstention & Permission Boundaries)
// ==========================================
console.log('>>> [5/7] Testing Permission Boundaries & Abstention Triggers...');
// عملية مسموحة مباشرة
const readPerm = agent.enforcePermission('READ_REPOSITORY');
assert.strictEqual(readPerm.allowed, true);

// عملية تتطلب نقطة استعادة (Requires Checkpoint) دون توفيرها
const writePermNoCp = agent.enforcePermission('WRITE_SOURCE', { checkpointCreated: false });
assert.strictEqual(writePermNoCp.allowed, false);
assert.strictEqual(writePermNoCp.requiresCheckpoint, true);

// عملية تتطلب نقطة استعادة مع توفيرها
const writePermWithCp = agent.enforcePermission('WRITE_SOURCE', { checkpointCreated: true });
assert.strictEqual(writePermWithCp.allowed, true);

// عملية محظورة تماماً
const dropDbPerm = agent.enforcePermission('DROP_PRODUCTION_DATABASE');
assert.strictEqual(dropDbPerm.allowed, false);

// شروط الامتناع (Abstention)
// محتوى غير موثوق
const abstainUntrusted = agent.evaluateAbstention({ untrustedContent: true, sanitized: false });
assert.strictEqual(abstainUntrusted.shouldAbstain, true);
assert(abstainUntrusted.reason.includes('Untrusted Content'));

// أدلة غير كافية
const abstainEvidence = agent.evaluateAbstention({ insufficientEvidence: true });
assert.strictEqual(abstainEvidence.shouldAbstain, true);

// وكيل غير نشط
const inactiveAgentDef = { ...validAgentFixture, id: 'PF-TEST-002', status: 'DISABLED' };
const inactiveAgent = new AgentContract(inactiveAgentDef);
const abstainInactive = inactiveAgent.evaluateAbstention();
assert.strictEqual(abstainInactive.shouldAbstain, true);
assert(abstainInactive.reason.includes('الوكيل غير نشط'));
console.log('  [PASS] Permission Enforcement & Fail-Closed Abstention Verified');

// ==========================================
// 6. التمييز الصارم بين حالات الأدلة وسجل التدقيق
// ==========================================
console.log('>>> [6/7] Testing Evidence State Semantics & Audit Record Integration...');
const states = AgentContract.EVIDENCE_STATES;
assert.notStrictEqual(states.AI_CLAIMED, states.CODE_CHANGED);
assert.notStrictEqual(states.CODE_CHANGED, states.TEST_PASSED);
assert.notStrictEqual(states.TEST_PASSED, states.EVIDENCE_EXISTS);
assert.notStrictEqual(states.EVIDENCE_EXISTS, states.PROOFFORGE_VERIFIED);

const auditRec = agent.buildAuditRecord({
    intent: 'تشغيل فحص الجودة الآلي',
    action: 'UNIT_TEST_EXECUTION',
    filesChanged: ['tests/sample.test.js'],
    evidenceState: states.TEST_PASSED
});
assert.strictEqual(auditRec.agent_id, 'PF-TEST-001');
assert.strictEqual(auditRec.evidenceState, states.TEST_PASSED);
assert.strictEqual(Array.isArray(auditRec.requiredEvidenceTypes), true);
console.log('  [PASS] Evidence States Differentiation & Audit Record Verified');

// ==========================================
// 7. اختبارات سجل الوكلاء المركزي (Agent Registry & Fail-Closed Integrity)
// ==========================================
console.log('>>> [7/7] Testing Canonical Agent Registry Loading & Integrity...');
const registryPath = path.resolve(__dirname, '../../../registry/agents.json');
const registry = AgentRegistry.loadFromFile(registryPath);

// التحقق من تحميل الوكلاء الـ 10 المؤسسين
assert.strictEqual(registry.size, 10);
assert.strictEqual(registry.hasAgent('PF-ARCH-001'), true);
assert.strictEqual(registry.hasAgent('PF-BACKEND-001'), true);
assert.strictEqual(registry.hasAgent('PF-FRONTEND-001'), true);
assert.strictEqual(registry.hasAgent('PF-SEC-001'), true);
assert.strictEqual(registry.hasAgent('PF-QA-001'), true);
assert.strictEqual(registry.hasAgent('PF-DB-001'), true);
assert.strictEqual(registry.hasAgent('PF-API-001'), true);
assert.strictEqual(registry.hasAgent('PF-REV-001'), true);
assert.strictEqual(registry.hasAgent('PF-THREAT-001'), true);
assert.strictEqual(registry.hasAgent('PF-DOCS-001'), true);

const secAgent = registry.getActiveAgent('PF-SEC-001');
assert(secAgent !== null);
assert.strictEqual(secAgent.role, 'Security Engineer');
assert.strictEqual(secAgent.authority_level, 'P2_ARCHITECTURE');
assert(secAgent.required_skills.includes('security'));

// فحص الفشل المغلق عند تكرار المعرفات في السجل
const duplicateData = {
    version: '1.0.0',
    agents: [
        validAgentFixture,
        { ...validAgentFixture, name: 'Duplicate Agent' }
    ]
};
const dupVal = AgentRegistry.validateRegistryData(duplicateData);
assert.strictEqual(dupVal.isValid, false);
assert(dupVal.errors.some(e => e.includes('تكرار غير مسموح به لمعرف الوكيل')));

// فحص الفشل المغلق عند وجود عقد تالف في السجل
const corruptData = {
    version: '1.0.0',
    agents: [
        { id: 'PF-BAD-001', name: 'Corrupt' } // missing fields
    ]
};
const corruptVal = AgentRegistry.validateRegistryData(corruptData);
assert.strictEqual(corruptVal.isValid, false);
assert(corruptVal.errors.some(e => e.includes('خطأ في عقد الوكيل')));

console.log('  [PASS] Canonical Agent Registry Full Integrity & Fail-Closed Behavior Verified');

console.log('>>> [SUCCESS] All 7 ProofForge Agent Contract & Registry Test Suites PASSED 100%.');
