/**
 * @file phase-8-9-integration.test.js
 * @description اختبار التكامل الشامل للسلسلة الكاملة للحوكمة والتحقق المعرفي (Phases 8 & 9 Integration Suite)
 * يختبر السلسلة الكنسية الكاملة:
 * Workflow → Model Policy → Agent → Skill → Tool/MCP → Evidence → Agent Handoff → CVGF → Verification → Audit
 * 
 * يتحقق من المبادئ الحاكمة:
 * 1. Security constraints survive across all transitions.
 * 2. Permissions remain bounded (AgentPermissionBoundary enforced).
 * 3. Evidence provenance survives and remains traceable.
 * 4. Tool Result !== Evidence.
 * 5. Agent Output !== Verified Evidence (AI_CLAIMED !== PROOFFORGE_VERIFIED).
 * 6. Conflicting claims remain visible and unresolved until CVGF arbitrates.
 * 7. CVGF remains the sole authoritative verification engine.
 * 8. Zero authority escalation (P0 remains sovereign).
 */

'use strict';

const assert = require('assert');
const path = require('path');

// استيراد العقود والسجلات
const WorkflowRegistry = require('../workflow-registry');
const ModelPolicyRegistry = require('../model-policy-registry');
const AgentRegistry = require('../agent-registry');
const SkillRegistry = require('../skill-registry');
const AgentSkillMappingRegistry = require('../agent-skill-mapping-registry');
const ToolContract = require('../tool-contract');
const ToolRegistry = require('../tool-registry');
const AgentHandoffContract = require('../agent-handoff-contract');
const MultiAgentVerification = require('../multi-agent-verification');

// استيراد وحدات الأمان والتحقق والتدقيق
const AgentPermissionBoundary = require('../../security/agent-permission-boundary');
const ClaimVerificationEngine = require('../../orchestration/claim-verification-engine');
const AgentAuditRecorder = require('../../orchestration/agent-audit-recorder');

console.log('>>> Running ProofForge Phases 8 & 9 End-to-End Integration Tests...');

// 1. تحميل السجلات الكنسية
const baseDir = path.join(__dirname, '../../../registry');
const workflowReg = WorkflowRegistry.loadFromFile(path.join(baseDir, 'workflows.json'));
const policyReg = ModelPolicyRegistry.loadFromFile(path.join(baseDir, 'model-policies.json'));
const agentReg = AgentRegistry.loadFromFile(path.join(baseDir, 'agents.json'));
const skillReg = SkillRegistry.loadFromFile(path.join(baseDir, 'skills.json'));
const mappingReg = AgentSkillMappingRegistry.loadFromFile(path.join(baseDir, 'agent-skill-mappings.json'));
const toolReg = ToolRegistry.loadFromFile(path.join(baseDir, 'tools.json'));

const registries = {
    workflowRegistry: workflowReg,
    modelPolicyRegistry: policyReg,
    agentRegistry: agentReg,
    skillRegistry: skillReg,
    mappingRegistry: mappingReg,
    toolRegistry: toolReg
};

// =========================================================================
// الخطوة 1: Workflow Selection & Validation
// =========================================================================
console.log('>>> [Step 1/9] Validating Workflow Selection...');
const workflowId = 'PF-WF-SEC-001';
const workflow = workflowReg.getWorkflow(workflowId);
assert.ok(workflow, `Workflow ${workflowId} must exist`);
assert.strictEqual(workflow.status, 'ACTIVE');
assert.ok(workflow.required_agents.includes('PF-SEC-001'));
assert.ok(workflow.required_skills.includes('PF-SKILL-SECURITY-REVIEW'));
console.log(`  [PASS] Workflow ${workflowId} validated`);

// =========================================================================
// الخطوة 2: Model Policy Binding
// =========================================================================
console.log('>>> [Step 2/9] Validating Model Policy Association...');
const policy = policyReg.getPolicy('PF-POL-SEC-CRITICAL');
assert.ok(policy, 'Model policy PF-POL-SEC-CRITICAL must exist');
assert.strictEqual(policy.status, 'ACTIVE');
assert.strictEqual(policy.risk_level, 'CRITICAL');
console.log('  [PASS] Model Policy PF-POL-SEC-CRITICAL verified');

// =========================================================================
// الخطوة 3: Agent & Skill Mapping Verification
// =========================================================================
console.log('>>> [Step 3/9] Validating Agent ↔ Skill Compatibility & Permissions...');
const agentSec = agentReg.getAgent('PF-SEC-001');
const skillSec = skillReg.getSkill('PF-SKILL-SECURITY-REVIEW');
assert.ok(agentSec, 'Agent PF-SEC-001 must exist');
assert.ok(skillSec, 'Skill PF-SKILL-SECURITY-REVIEW must exist');

const mapping = mappingReg.getMapping(agentSec.id, skillSec.id);
assert.ok(mapping, 'Canonical mapping between PF-SEC-001 and PF-SKILL-SECURITY-REVIEW must exist');
assert.strictEqual(mapping.allowed, true);

// فحص حاجز الصلاحيات الأمني المركزي
const permissionBoundary = new AgentPermissionBoundary();
const permDecision = permissionBoundary.evaluatePermission('RUN_SECURITY_SCAN', {
    target: 'codebase/api',
    isWriteOperation: false
});
assert.strictEqual(permDecision.allowed, true);
console.log('  [PASS] Agent ↔ Skill mapping and permission boundary verified');

// =========================================================================
// الخطوة 4: Tool / MCP Governance (Phase 8 Invariant: Tool Result !== Evidence)
// =========================================================================
console.log('>>> [Step 4/9] Verifying Tool/MCP Governance & Untrusted Status...');
const tool = toolReg.getTool('PF-TOOL-ASVS-CHECKER');
assert.ok(tool, 'Tool PF-TOOL-ASVS-CHECKER must exist');
assert.strictEqual(tool.status, ToolContract.STATUS.ACTIVE);
assert.strictEqual(tool.trust_level, ToolContract.TRUST_LEVELS.SYSTEM);
assert.strictEqual(tool.evidence_behavior, 'REQUIRES_VALIDATION_NOT_EVIDENCE');

// تقييم حوكمة تشغيل الأداة
const toolGovEval = toolReg.evaluateToolExecution('PF-TOOL-ASVS-CHECKER', {
    agent_id: agentSec.id,
    skill_id: skillSec.id,
    workflow_id: workflow.workflow_id,
    environment: 'TEST',
    permissionBoundary,
    input_data: { target_file: 'src/auth/login.js' },
    is_write: false
});
assert.strictEqual(toolGovEval.allowed, true);

// فحص المبدأ الحاكم: نتيجة الأداة لا ترقى أبداً لمرتبة الدليل تلقائياً
const rawToolOutput = {
    exit_code: 0,
    findings: [{ rule: 'OWASP-ASVS-V2.1', status: 'VIOLATION', severity: 'HIGH' }]
};
assert.throws(() => {
    // محاولة ادعاء أن نتيجة الأداة كافية كدليل مؤصل دون مسار التحقق
    new ToolContract({
        ...tool,
        evidence_behavior: 'TOOL_RESULT_IS_EVIDENCE'
    });
}, /Fail-Closed|انتهاك ميثاق الأدلة|نتائج الأدوات لا تمثل أدلة قطعية/);
console.log('  [PASS] Tool Result !== Evidence strictly enforced');

// =========================================================================
// الخطوة 5: Evidence Grounding & Provenance Construction
// =========================================================================
console.log('>>> [Step 5/9] Constructing Grounded Evidence & Preserving Provenance...');
const formalEvidence = {
    evidence_id: 'EV-ASVS-SEC-001',
    type: 'STATIC_SECURITY_ANALYSIS',
    source_tool: tool.tool_id,
    generated_by: agentSec.id,
    workflow_id: workflow.workflow_id,
    hash: 'sha256-a1b2c3d4e5f6',
    timestamp: new Date().toISOString(),
    raw_reference: rawToolOutput
};
assert.ok(formalEvidence.evidence_id);
assert.strictEqual(formalEvidence.source_tool, 'PF-TOOL-ASVS-CHECKER');
console.log('  [PASS] Evidence created with intact provenance');

// =========================================================================
// الخطوة 6: Agent Handoff (Phase 9 Invariant: Agent Output !== Verified Evidence)
// =========================================================================
console.log('>>> [Step 6/9] Executing Agent Handoff (PF-SEC-001 → PF-QA-001)...');
const handoffData = {
    handoff_id: 'PF-HANDOFF-SEC-TO-QA-INT-001',
    workflow_id: workflow.workflow_id,
    source_agent: agentSec.id,
    target_agent: 'PF-QA-001',
    source_skill: skillSec.id,
    target_skill: 'PF-SKILL-TESTING-REVIEW',
    task_context: 'تمرير مصفوفة فحص الثغرات الأمنية للتحقق المستقل وإعداد اختبارات التحقق',
    status: AgentHandoffContract.STATUS.CREATED,
    verification_state: AgentHandoffContract.VERIFICATION_STATE.UNVERIFIED,
    input_artifacts: ['reports/security-findings.json'],
    output_artifacts: ['tests/e2e/security-verification.test.js'],
    claims: ['تم اكتشاف ثغرة عدم تطابق في آلية التحقق من الهوية وفق معيار ASVS V2.1'],
    evidence: [formalEvidence],
    requirements: ['ZERO_TRUST', 'OWASP_ASVS_L2'],
    constraints: ['READ_ONLY_MODE'],
    security_context: {
        scope: {
            tenant_id: 'TENANT-CORE',
            project_id: 'PROOFFORGE-PROJECT',
            environment: 'STAGING'
        }
    },
    provenance: {
        created_by: agentSec.id,
        origin_workflow: workflow.workflow_id,
        chain: [agentSec.id],
        scope: {
            tenant_id: 'TENANT-CORE',
            project_id: 'PROOFFORGE-PROJECT',
            environment: 'STAGING'
        }
    },
    failure_conditions: ['CRITICAL_VULNERABILITY_UNADDRESSED'],
    abstention_conditions: ['AMBIGUOUS_SPECIFICATION'],
    audit_requirements: ['FULL_LIFECYCLE_LOG']
};

// التحقق من صحة التسليم مع السجلات
const handoffValidation = MultiAgentVerification.validateHandoff(handoffData, {
    ...registries,
    expectedScope: {
        tenant_id: 'TENANT-CORE',
        project_id: 'PROOFFORGE-PROJECT',
        environment: 'STAGING'
    }
});
assert.strictEqual(handoffValidation.isValid, true, `Validation failed: ${JSON.stringify(handoffValidation.errors)}`);
assert.strictEqual(handoffValidation.status, AgentHandoffContract.STATUS.VALIDATED);

// فحص مبدأ منع تصعيد السلطة (Source Agent cannot grant permissions to Target Agent)
const maliciousHandoff = {
    ...handoffData,
    security_context: {
        ...handoffData.security_context,
        grant_permissions: ['BYPASS_P0']
    }
};
const maliciousValidation = MultiAgentVerification.validateHandoff(maliciousHandoff, registries);
assert.strictEqual(maliciousValidation.isValid, false);
assert.ok(maliciousValidation.errors.some(e => e.issue.includes('تصعيد')));
console.log('  [PASS] Agent Handoff validated and Anti-Escalation strictly enforced');

// =========================================================================
// الخطوة 7: Conflicting Claims Handling
// =========================================================================
console.log('>>> [Step 7/9] Verifying Conflicting Claims Handling...');
const claimSec = {
    agent_id: agentSec.id,
    statement: 'المسار البرمجي غير آمن ومعرض لثغرة أمنية',
    evidence: [formalEvidence]
};
const claimQA = {
    agent_id: 'PF-QA-001',
    statement: 'المسار البرمجي آمن وتم تجاوز كافة الاختبارات بنجاح',
    evidence: [{ id: 'EV-TEST-OK' }]
};
const conflictRep = MultiAgentVerification.handleConflictingClaims(claimSec, claimQA);
assert.strictEqual(conflictRep.is_conflict, true);
assert.strictEqual(conflictRep.status, 'CONFLICT');
assert.strictEqual(conflictRep.resolution, 'UNRESOLVED');
assert.strictEqual(conflictRep.arbitration.requires_cvgf_arbitration, true);
console.log('  [PASS] Conflict remains explicit and deferred to CVGF arbitration');

// =========================================================================
// الخطوة 8: Authoritative CVGF Verification
// =========================================================================
console.log('>>> [Step 8/9] Executing CVGF Authoritative Verification...');
const cvgfCoordination = MultiAgentVerification.coordinateVerification(handoffData, registries);
assert.strictEqual(cvgfCoordination.verified, true);
assert.strictEqual(cvgfCoordination.status, 'VERIFIED');
assert.strictEqual(cvgfCoordination.claim_results.length, 1);
assert.strictEqual(cvgfCoordination.claim_results[0].verified, true);
console.log('  [PASS] CVGF Authoritative Verification successfully concluded');

// =========================================================================
// الخطوة 9: Full Traceability & Audit Recording
// =========================================================================
console.log('>>> [Step 9/9] Logging Complete Multi-Agent Lifecycle in AgentAuditRecorder...');
const auditor = new AgentAuditRecorder();
const auditTrace = MultiAgentVerification.recordAuditTrace(handoffData, cvgfCoordination, {
    auditor,
    requirement: 'OWASP_ASVS_SECURITY_VERIFICATION'
});
assert.strictEqual(auditor.auditLog.length, 1);
const auditEntry = auditor.auditLog[0];
assert.strictEqual(auditEntry.action, 'MULTI_AGENT_HANDOFF');
assert.strictEqual(auditEntry.agent_id, agentSec.id);
assert.strictEqual(auditEntry.trace_chain.workflow, workflow.workflow_id);
assert.strictEqual(auditEntry.trace_chain.source_agent, agentSec.id);
assert.strictEqual(auditEntry.trace_chain.target_agent, 'PF-QA-001');
assert.strictEqual(auditEntry.trace_chain.final_result, 'PASSED_VERIFICATION');
console.log('  [PASS] Complete Trace recorded in AgentAuditRecorder:');
console.log(`         Requirement → Workflow [${workflow.workflow_id}] → Agent [${agentSec.id}] → Skill [${skillSec.id}] → Tool [${tool.tool_id}] → Evidence [${formalEvidence.evidence_id}] → Target [PF-QA-001] → CVGF [VERIFIED]`);

console.log('>>> ProofForge Phases 8 & 9 End-to-End Integration Suite PASSED 100%!');
