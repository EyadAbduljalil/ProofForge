/**
 * @file agent-handoff.test.js
 * @description جناح اختبارات عقد تسليم المهام والتحقق متعدد الوكلاء في ProofForge (Phase 9 Test Suite)
 * يغطي السيناريوهات الـ 22 الإلزامية وفقاً للمهمة PROOFFORGE-PHASE-8-9-COMBINED (القسم 26)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const AgentHandoffContract = require('../agent-handoff-contract');
const MultiAgentVerification = require('../multi-agent-verification');
const AgentRegistry = require('../agent-registry');
const SkillRegistry = require('../skill-registry');
const WorkflowRegistry = require('../workflow-registry');
const AgentSkillMappingRegistry = require('../agent-skill-mapping-registry');
const AgentAuditRecorder = require('../../orchestration/agent-audit-recorder');
const ClaimVerificationEngine = require('../../orchestration/claim-verification-engine');

console.log('>>> Running ProofForge Multi-Agent Verification & Handoff Tests (Phase 9)...');

// 1. تحميل السجلات الكنسية
const agentsPath = path.join(__dirname, '../../../registry/agents.json');
const skillsPath = path.join(__dirname, '../../../registry/skills.json');
const workflowsPath = path.join(__dirname, '../../../registry/workflows.json');
const mappingsPath = path.join(__dirname, '../../../registry/agent-skill-mappings.json');

const agentRegistry = AgentRegistry.loadFromFile(agentsPath);
const skillRegistry = SkillRegistry.loadFromFile(skillsPath);
const workflowRegistry = WorkflowRegistry.loadFromFile(workflowsPath);
const mappingRegistry = AgentSkillMappingRegistry.loadFromFile(mappingsPath);

const registries = {
    agentRegistry,
    skillRegistry,
    workflowRegistry,
    mappingRegistry
};

// عينة تسليم صالحة كنسياً
const getValidHandoffFixture = () => ({
    handoff_id: 'PF-HANDOFF-SEC-TO-QA-001',
    workflow_id: 'PF-WF-SEC-001',
    source_agent: 'PF-SEC-001',
    target_agent: 'PF-QA-001',
    source_skill: 'PF-SKILL-SECURITY-REVIEW',
    target_skill: 'PF-SKILL-TESTING-REVIEW',
    task_context: 'تمرير مصفوفة فحص الثغرات الأمنية لفحص التحقق وتأصيل الأدلة',
    status: AgentHandoffContract.STATUS.CREATED,
    verification_state: AgentHandoffContract.VERIFICATION_STATE.UNVERIFIED,
    input_artifacts: ['reports/security-threats.json'],
    output_artifacts: ['reports/test-plan.json'],
    claims: ['جميع ثغرات ASVS L2 محددة وموثقة بـ PoC'],
    evidence: [{ id: 'EV-001', type: 'SECURITY_POC', file: 'tests/poc.js' }],
    requirements: ['ZERO_TRUST', 'OWASP_ASVS_CHECK'],
    constraints: ['READ_ONLY_TESTING'],
    security_context: {
        scope: {
            tenant_id: 'TENANT-DEFAULT',
            project_id: 'PROOFFORGE-CORE',
            environment: 'TESTING'
        }
    },
    provenance: {
        created_by: 'PF-SEC-001',
        origin_workflow: 'PF-WF-SEC-001',
        chain: ['PF-SEC-001'],
        scope: {
            tenant_id: 'TENANT-DEFAULT',
            project_id: 'PROOFFORGE-CORE',
            environment: 'TESTING'
        }
    },
    failure_conditions: ['CRITICAL_SECURITY_LEAK'],
    abstention_conditions: ['AMBIGUOUS_SCOPE'],
    audit_requirements: ['LOG_EVERY_STEP', 'IMMUTABLE_RECORD']
});

// ==========================================
// 1. Valid handoff
// ==========================================
console.log('>>> [1/22] Testing Valid Handoff...');
const validFixture = getValidHandoffFixture();
const validation1 = MultiAgentVerification.validateHandoff(validFixture, registries);
assert.strictEqual(validation1.isValid, true, `Validation failed: ${JSON.stringify(validation1.errors)}`);
assert.strictEqual(validation1.status, AgentHandoffContract.STATUS.VALIDATED);
const handoffObj1 = new AgentHandoffContract(validFixture);
assert.strictEqual(handoffObj1.handoff_id, validFixture.handoff_id);
console.log('  [PASS] 1. Valid handoff verified');

// ==========================================
// 2. Unknown source Agent
// ==========================================
console.log('>>> [2/22] Testing Unknown Source Agent...');
const fixture2 = getValidHandoffFixture();
fixture2.source_agent = 'PF-AGENT-GHOST-UNKNOWN';
const validation2 = MultiAgentVerification.validateHandoff(fixture2, registries);
assert.strictEqual(validation2.isValid, false);
assert.strictEqual(validation2.status, AgentHandoffContract.STATUS.REJECTED);
assert.ok(validation2.errors.some(e => e.field === 'source_agent' && e.issue.includes('الوكيل المصدر غير معروف')));
console.log('  [PASS] 2. Unknown source Agent rejected');

// ==========================================
// 3. Unknown target Agent
// ==========================================
console.log('>>> [3/22] Testing Unknown Target Agent...');
const fixture3 = getValidHandoffFixture();
fixture3.target_agent = 'PF-AGENT-TARGET-UNKNOWN';
const validation3 = MultiAgentVerification.validateHandoff(fixture3, registries);
assert.strictEqual(validation3.isValid, false);
assert.strictEqual(validation3.status, AgentHandoffContract.STATUS.REJECTED);
assert.ok(validation3.errors.some(e => e.field === 'target_agent' && e.issue.includes('الوكيل الهدف غير معروف')));
console.log('  [PASS] 3. Unknown target Agent rejected');

// ==========================================
// 4. Unknown source Skill
// ==========================================
console.log('>>> [4/22] Testing Unknown Source Skill...');
const fixture4 = getValidHandoffFixture();
fixture4.source_skill = 'PF-SKILL-NON-EXISTENT';
const validation4 = MultiAgentVerification.validateHandoff(fixture4, registries);
assert.strictEqual(validation4.isValid, false);
assert.strictEqual(validation4.status, AgentHandoffContract.STATUS.REJECTED);
assert.ok(validation4.errors.some(e => e.field === 'source_skill' && e.issue.includes('مهارة المصدر غير معروفة')));
console.log('  [PASS] 4. Unknown source Skill rejected');

// ==========================================
// 5. Unknown target Skill
// ==========================================
console.log('>>> [5/22] Testing Unknown Target Skill...');
const fixture5 = getValidHandoffFixture();
fixture5.target_skill = 'PF-SKILL-TARGET-NON-EXISTENT';
const validation5 = MultiAgentVerification.validateHandoff(fixture5, registries);
assert.strictEqual(validation5.isValid, false);
assert.strictEqual(validation5.status, AgentHandoffContract.STATUS.REJECTED);
assert.ok(validation5.errors.some(e => e.field === 'target_skill' && e.issue.includes('مهارة الهدف غير معروفة')));
console.log('  [PASS] 5. Unknown target Skill rejected');

// ==========================================
// 6. Unknown Workflow
// ==========================================
console.log('>>> [6/22] Testing Unknown Workflow...');
const fixture6 = getValidHandoffFixture();
fixture6.workflow_id = 'PF-WF-UNKNOWN-GHOST';
const validation6 = MultiAgentVerification.validateHandoff(fixture6, registries);
assert.strictEqual(validation6.isValid, false);
assert.strictEqual(validation6.status, AgentHandoffContract.STATUS.REJECTED);
assert.ok(validation6.errors.some(e => e.field === 'workflow_id' && e.issue.includes('تدفق العمل الحاكم غير معروف')));
console.log('  [PASS] 6. Unknown Workflow rejected');

// ==========================================
// 7. Incompatible Agent↔Skill
// ==========================================
console.log('>>> [7/22] Testing Incompatible Agent↔Skill...');
const fixture7 = getValidHandoffFixture();
fixture7.target_agent = 'PF-SEC-001';
fixture7.target_skill = 'PF-SKILL-TESTING-REVIEW';
const mockIncompatibleSkill = {
    id: 'PF-SKILL-TESTING-REVIEW',
    name: 'Testing Review',
    status: 'ACTIVE',
    prohibited_agents: ['PF-SEC-001']
};
const customSkillRegistry = {
    getSkill: (id) => (id === 'PF-SKILL-TESTING-REVIEW' ? mockIncompatibleSkill : skillRegistry.getSkill(id))
};
const validation7 = MultiAgentVerification.validateHandoff(fixture7, {
    ...registries,
    skillRegistry: customSkillRegistry
});
assert.strictEqual(validation7.isValid, false);
assert.ok(validation7.errors.some(e => e.field === 'target_agent_skill' && e.issue.includes('عدم توافق')));
console.log('  [PASS] 7. Incompatible Agent↔Skill rejected');

// ==========================================
// 8. Malformed handoff
// ==========================================
console.log('>>> [8/22] Testing Malformed Handoff...');
const validation8a = MultiAgentVerification.validateHandoff(null, registries);
assert.strictEqual(validation8a.isValid, false);
const validation8b = MultiAgentVerification.validateHandoff({ handoff_id: 'INVALID-NAME' }, registries);
assert.strictEqual(validation8b.isValid, false);
assert.throws(() => new AgentHandoffContract({}), /Fail-Closed|فشل إنشاء عقد تسليم المهام/);
console.log('  [PASS] 8. Malformed handoff rejected fail-closed');

// ==========================================
// 9. Missing provenance
// ==========================================
console.log('>>> [9/22] Testing Missing Provenance...');
const fixture9 = getValidHandoffFixture();
fixture9.provenance = {};
const validation9 = MultiAgentVerification.validateHandoff(fixture9, registries);
assert.strictEqual(validation9.isValid, false);
assert.ok(validation9.errors.some(e => e.field === 'provenance' && (e.issue.includes('provenance') || e.issue.includes('مصدر') || e.issue.includes('النسب'))));
console.log('  [PASS] 9. Missing provenance rejected');

// ==========================================
// 10. Evidence downgrade
// ==========================================
console.log('>>> [10/22] Testing Evidence Downgrade...');
const fixture10 = getValidHandoffFixture();
fixture10.provenance.downgrade_evidence = true;
const validation10 = MultiAgentVerification.validateHandoff(fixture10, registries);
assert.strictEqual(validation10.isValid, false);
assert.ok(validation10.errors.some(e => e.field === 'provenance' && e.issue.includes('تخفيض')));
console.log('  [PASS] 10. Evidence downgrade rejected');

// ==========================================
// 11. Verification spoofing
// ==========================================
console.log('>>> [11/22] Testing Verification Spoofing...');
const fixture11 = getValidHandoffFixture();
// محاولة إعلان حالة VERIFIED دون وجود أدلة أو بحالة غير محققة
fixture11.status = AgentHandoffContract.STATUS.VERIFIED;
fixture11.verification_state = AgentHandoffContract.VERIFICATION_STATE.UNVERIFIED;
fixture11.evidence = [];
const validation11 = MultiAgentVerification.validateHandoff(fixture11, registries);
assert.strictEqual(validation11.isValid, false);
assert.ok(validation11.errors.some(e => e.issue.includes('تزييف')));
console.log('  [PASS] 11. Verification spoofing rejected');

// ==========================================
// 12. Authority escalation
// ==========================================
console.log('>>> [12/22] Testing Authority Escalation...');
const fixture12 = getValidHandoffFixture();
fixture12.security_context.transfer_authority = true;
const validation12 = MultiAgentVerification.validateHandoff(fixture12, registries);
assert.strictEqual(validation12.isValid, false);
assert.ok(validation12.errors.some(e => (e.field === 'security_context' || e.field === 'constraints') && (e.issue.includes('تصعيد') || e.issue.includes('Authority Escalation'))));
console.log('  [PASS] 12. Authority escalation rejected');

// ==========================================
// 13. Privilege escalation
// ==========================================
console.log('>>> [13/22] Testing Privilege Escalation...');
const fixture13 = getValidHandoffFixture();
fixture13.security_context.grant_permissions = ['ROOT_ACCESS', 'BYPASS_SECURITY'];
const validation13 = MultiAgentVerification.validateHandoff(fixture13, registries);
assert.strictEqual(validation13.isValid, false);
assert.ok(validation13.errors.some(e => (e.field === 'security_context' || e.field === 'constraints') && (e.issue.includes('تصعيد') || e.issue.includes('Authority Escalation'))));
console.log('  [PASS] 13. Privilege escalation rejected');

// ==========================================
// 14. Scope mismatch
// ==========================================
console.log('>>> [14/22] Testing Scope Mismatch...');
const fixture14 = getValidHandoffFixture();
const validation14 = MultiAgentVerification.validateHandoff(fixture14, {
    ...registries,
    expectedScope: {
        tenant_id: 'TENANT-FINANCE-PROD',
        project_id: 'PROOFFORGE-CORE',
        environment: 'TESTING'
    }
});
assert.strictEqual(validation14.isValid, false);
assert.ok(validation14.errors.some(e => e.field.includes('scope') && e.issue.includes('عدم تطابق نطاق المستأجر')));
console.log('  [PASS] 14. Scope mismatch rejected');

// ==========================================
// 15. Conflicting claims
// ==========================================
console.log('>>> [15/22] Testing Conflicting Claims...');
const claimA = {
    agent_id: 'PF-SEC-001',
    statement: 'النظام معرض لثغرة SSRF في مسار الاستدعاء الخارجي',
    evidence: [{ id: 'EV-POC-SSRF' }]
};
const claimB = {
    agent_id: 'PF-QA-001',
    statement: 'مسار الاستدعاء الخارجي محمي بحاجز شبكي ولا توجد ثغرة SSRF',
    evidence: [{ id: 'EV-NET-ISOLATION' }]
};
const conflict = MultiAgentVerification.handleConflictingClaims(claimA, claimB);
assert.strictEqual(conflict.is_conflict, true);
assert.strictEqual(conflict.status, 'CONFLICT');
assert.strictEqual(conflict.resolution, 'UNRESOLVED');
assert.strictEqual(conflict.arbitration.requires_cvgf_arbitration, true);
assert.strictEqual(conflict.competing_claims.length, 2);
console.log('  [PASS] 15. Conflicting claims represented deterministically for CVGF arbitration');

// ==========================================
// 16. Rejected handoff
// ==========================================
console.log('>>> [16/22] Testing Rejected Handoff...');
const fixture16 = getValidHandoffFixture();
fixture16.workflow_id = 'PF-WF-INVALID';
const validation16 = MultiAgentVerification.validateHandoff(fixture16, registries);
assert.strictEqual(validation16.status, AgentHandoffContract.STATUS.REJECTED);
assert.strictEqual(validation16.isValid, false);
console.log('  [PASS] 16. Rejected handoff properly marked REJECTED');

// ==========================================
// 17. Abstained handoff
// ==========================================
console.log('>>> [17/22] Testing Abstained Handoff...');
const fixture17 = getValidHandoffFixture();
const result17 = MultiAgentVerification.coordinateVerification(fixture17, {
    ...registries,
    hasAmbiguity: true
});
assert.strictEqual(result17.verified, false);
assert.strictEqual(result17.status, 'ABSTAINED');
assert.ok(result17.reason.includes('امتناع'));
console.log('  [PASS] 17. Abstained handoff handled correctly');

// ==========================================
// 18. Failed handoff
// ==========================================
console.log('>>> [18/22] Testing Failed Handoff...');
const fixture18 = getValidHandoffFixture();
const result18 = MultiAgentVerification.coordinateVerification(fixture18, {
    ...registries,
    hasCriticalVulnerability: true
});
assert.strictEqual(result18.verified, false);
assert.strictEqual(result18.status, 'FAILED');
assert.ok(result18.reason.includes('فشل'));
console.log('  [PASS] 18. Failed handoff handled correctly');

// ==========================================
// 19. Verified handoff
// ==========================================
console.log('>>> [19/22] Testing Verified Handoff...');
const fixture19 = getValidHandoffFixture();
const result19 = MultiAgentVerification.coordinateVerification(fixture19, registries);
assert.strictEqual(result19.verified, true);
assert.strictEqual(result19.status, 'VERIFIED');
assert.strictEqual(result19.claim_results.length, 1);
assert.strictEqual(result19.claim_results[0].verified, true);
console.log('  [PASS] 19. Verified handoff coordinated with CVGF');

// ==========================================
// 20. Audit trace
// ==========================================
console.log('>>> [20/22] Testing Audit Trace...');
const fixture20 = getValidHandoffFixture();
const recorder = new AgentAuditRecorder();
const decision20 = { status: 'VERIFIED', verified: true };
const auditTrace = MultiAgentVerification.recordAuditTrace(fixture20, decision20, {
    auditor: recorder,
    requirement: 'ASVS_L2_AUDIT_REQUIREMENT'
});
assert.strictEqual(auditTrace.auditor.auditLog.length, 1);
const logEntry = auditTrace.auditor.auditLog[0];
assert.strictEqual(logEntry.action, 'MULTI_AGENT_HANDOFF');
assert.strictEqual(logEntry.agent_id, fixture20.source_agent);
assert.strictEqual(logEntry.trace_chain.workflow, fixture20.workflow_id);
assert.strictEqual(logEntry.trace_chain.source_agent, fixture20.source_agent);
assert.strictEqual(logEntry.trace_chain.target_agent, fixture20.target_agent);
assert.strictEqual(logEntry.trace_chain.verification_decision, 'VERIFIED');
console.log('  [PASS] 20. Audit trace logged completely in AgentAuditRecorder');

// ==========================================
// 21. Deterministic validation
// ==========================================
console.log('>>> [21/22] Testing Deterministic Validation...');
const fixture21 = getValidHandoffFixture();
const res1 = MultiAgentVerification.validateHandoff(fixture21, registries);
const res2 = MultiAgentVerification.validateHandoff(fixture21, registries);
assert.deepStrictEqual(res1.isValid, res2.isValid);
assert.deepStrictEqual(res1.status, res2.status);
assert.deepStrictEqual(res1.errors, res2.errors);
console.log('  [PASS] 21. Deterministic validation verified across repeated runs');

// ==========================================
// 22. Fail-closed behavior
// ==========================================
console.log('>>> [22/22] Testing Fail-Closed Behavior...');
const badInputs = [
    undefined,
    null,
    '',
    123,
    {},
    { handoff_id: 'BAD' },
    { ...getValidHandoffFixture(), source_agent: '' }
];
for (const bad of badInputs) {
    const res = MultiAgentVerification.validateHandoff(bad, registries);
    assert.strictEqual(res.isValid, false, `Expected fail-closed for: ${JSON.stringify(bad)}`);
    assert.strictEqual(res.status, AgentHandoffContract.STATUS.REJECTED);
}
console.log('  [PASS] 22. Fail-closed behavior verified for all corrupt/empty inputs');

console.log('>>> All 22/22 Multi-Agent Verification (Phase 9) tests PASSED successfully!');
