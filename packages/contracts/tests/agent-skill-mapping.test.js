/**
 * @file agent-skill-mapping.test.js
 * @description جناح اختبارات عقد وسجل الربط المعياري بين الوكلاء والمهارات في ProofForge (Phase 4 Test Suite)
 * يغطي الفحص الحتمي، التجميد، التمييز الصارم بين Allowed و Authorized، حالات الربط، ومنع التصعيد، والتوافق الثلاثي
 */

const assert = require('assert');
const path = require('path');
const AgentSkillMapping = require('../agent-skill-mapping');
const AgentSkillMappingRegistry = require('../agent-skill-mapping-registry');
const AgentContract = require('../agent-contract');
const SkillContract = require('../skill-contract');

console.log('>>> Running ProofForge Agent ↔ Skill Mapping Tests (Phase 4)...');

// عينة تجريبية صالحة لعقد الربط
const validMappingFixture = {
    id: 'MAP-PF-SEC-001-PF-SKILL-SECURITY-REVIEW',
    agent_id: 'PF-SEC-001',
    skill_id: 'PF-SKILL-SECURITY-REVIEW',
    status: AgentSkillMapping.STATUS.ACTIVE,
    mapping_reason: 'تمكين مهندس الأمان من فحص ومراجعة الثغرات وتطبيق قواعد ASVS L2',
    allowed: true,
    restrictions: ['READ_ONLY', 'ZERO_TRUST_SCOPE'],
    applicable_rules: ['P0_SECURITY_SAFETY', 'sec.zero-trust'],
    required_validators: ['SECURITY_AUDITOR', 'OWASP_ASVS_CHECKER'],
    required_evidence: ['VULNERABILITY_PROOF_OF_CONCEPT'],
    verification_requirements: ['CVGF_GROUNDING_GATE'],
    authority_constraints: ['الخضوع لسلطة P0 الأمنية وعدم التجاوز'],
    security_constraints: ['منع التستر على أي ثغرة مكتشفة'],
    abstention_conditions: ['غموض بيئة التهديد أو نقص الأدلة'],
    reporting_requirements: ['SECURITY_AUDIT_REPORT']
};

// كائنات وهمية متوافقة للاختبارات
const mockSecAgent = {
    id: 'PF-SEC-001',
    name: 'Security Engineer',
    status: 'ACTIVE',
    allowed_skills: ['security', 'threat-modeling'],
    prohibited_skills: ['arbitrary-code-execution']
};

const mockSecSkill = {
    id: 'PF-SKILL-SECURITY-REVIEW',
    name: 'Security Review',
    status: 'ACTIVE',
    allowed_agents: ['PF-SEC-001', 'PF-THREAT-001'],
    prohibited_agents: ['PF-DOCS-001']
};

// ==========================================
// 1. اختبار إنشاء عقد الربط وتجميده وحتميته
// ==========================================
console.log('>>> [1/7] Testing Valid Mapping Instantiation & Immutability...');
const mapping1 = new AgentSkillMapping(validMappingFixture);
assert.strictEqual(mapping1.id, validMappingFixture.id);
assert.strictEqual(mapping1.agent_id, 'PF-SEC-001');
assert.strictEqual(mapping1.skill_id, 'PF-SKILL-SECURITY-REVIEW');
assert.strictEqual(mapping1.status, 'ACTIVE');
assert.strictEqual(mapping1.allowed, true);
assert(Object.isFrozen(mapping1), 'يجب أن يكون كائن العقد مجمداً بالكامل (Object.freeze)');
assert(Object.isFrozen(mapping1.restrictions), 'يجب أن تكون مصفوفة القيود مجمدة');
assert(Object.isFrozen(mapping1.applicable_rules), 'يجب أن تكون مصفوفة القواعد مجمدة');

// التحقق من مناعة الكائن ضد التعديل
assert.strictEqual(Object.isFrozen(mapping1), true);
try {
    'use strict';
    mapping1.status = 'DISABLED';
} catch (e) {
    // في الوضع الصارم يتم رمي خطأ TypeError
}
assert.strictEqual(mapping1.status, 'ACTIVE', 'يجب أن تظل حالة العقد دون تغيير بسبب التجميد');
console.log('  [PASS] Valid Mapping Instantiation & Immutability Verified');

// ==========================================
// 2. اختبار التحقق الهيكلي والفشل المغلق للمدخلات المشوهة
// ==========================================
console.log('>>> [2/7] Testing Mapping Validation Edge Cases & Malformed Inputs...');
const valNull = AgentSkillMapping.validate(null);
assert.strictEqual(valNull.isValid, false);
assert(valNull.errors.some(e => e.field === 'def'));

const valMissingId = AgentSkillMapping.validate({ ...validMappingFixture, id: '' });
assert.strictEqual(valMissingId.isValid, false);

const valBadStatus = AgentSkillMapping.validate({ ...validMappingFixture, status: 'UNKNOWN_STATUS' });
assert.strictEqual(valBadStatus.isValid, false);

const valNonBoolAllowed = AgentSkillMapping.validate({ ...validMappingFixture, allowed: 'yes' });
assert.strictEqual(valNonBoolAllowed.isValid, false);

// تناقض الحالة: معطل مع سماح نشط
const valDisabledAllowedConflict = AgentSkillMapping.validate({
    ...validMappingFixture,
    status: 'DISABLED',
    allowed: true
});
assert.strictEqual(valDisabledAllowedConflict.isValid, false);
assert(valDisabledAllowedConflict.errors.some(e => e.field === 'status/allowed'));

console.log('  [PASS] Mapping Validation Edge Cases & Malformed Inputs Verified');

// ==========================================
// 3. التمييز الصارم بين السماح والتفويض التشغيلي (Allowed ≠ Authorized)
// ==========================================
console.log('>>> [3/7] Testing Strict Distinction: Allowed ≠ Authorized Runtime Execution...');

// 3.1 وكيل غير نشط يمنع التفويض حتى مع وجود ربط مسموح
const inactiveAgent = { ...mockSecAgent, status: 'DISABLED' };
const authRes1 = mapping1.evaluateRuntimeAuthorization(inactiveAgent, mockSecSkill);
assert.strictEqual(authRes1.allowed, true, 'الربط مصرح به معمارياً');
assert.strictEqual(authRes1.authorized, false, 'ولكن التنفيذ التشغيلي محظور لأن الوكيل معطل');
assert.strictEqual(authRes1.reason, 'AGENT_NOT_ACTIVE');

// 3.2 مهارة غير نشطة تمنع التفويض حتى مع وجود ربط مسموح (المهارة المعطلة لا تصبح مسموحة بالربط)
const disabledSkill = { ...mockSecSkill, status: 'DISABLED' };
const authRes2 = mapping1.evaluateRuntimeAuthorization(mockSecAgent, disabledSkill);
assert.strictEqual(authRes2.allowed, true);
assert.strictEqual(authRes2.authorized, false);
assert.strictEqual(authRes2.reason, 'SKILL_NOT_ACTIVE');

// 3.3 وكيل محظور صراحة في المهارة
const prohibitedBySkill = { ...mockSecSkill, prohibited_agents: ['PF-SEC-001'] };
const authRes3 = mapping1.evaluateRuntimeAuthorization(mockSecAgent, prohibitedBySkill);
assert.strictEqual(authRes3.authorized, false);
assert.strictEqual(authRes3.reason, 'AGENT_EXPLICITLY_PROHIBITED_BY_SKILL');

// 3.4 مهارة محظورة صراحة في الوكيل
const prohibitedByAgent = { ...mockSecAgent, prohibited_skills: ['PF-SKILL-SECURITY-REVIEW'] };
const authRes4 = mapping1.evaluateRuntimeAuthorization(prohibitedByAgent, mockSecSkill);
assert.strictEqual(authRes4.authorized, false);
assert.strictEqual(authRes4.reason, 'SKILL_EXPLICITLY_PROHIBITED_BY_AGENT');

// 3.5 تحفيز الامتناع والاستنكاف الإدراكي
const authRes5 = mapping1.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill, { hasAmbiguousScope: true });
assert.strictEqual(authRes5.authorized, false);
assert.strictEqual(authRes5.reason, 'ABSTENTION_TRIGGERED');

// 3.6 انتهاك قيد القراءة فقط
const authRes6 = mapping1.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill, { isWriteOperation: true });
assert.strictEqual(authRes6.authorized, false);
assert.strictEqual(authRes6.reason, 'RESTRICTION_VIOLATION_READ_ONLY');

// 3.7 اجتياز كافة الشروط بنجاح وتفويض التنفيذ
const authResSuccess = mapping1.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill, { isWriteOperation: false });
assert.strictEqual(authResSuccess.authorized, true);
assert.strictEqual(authResSuccess.allowed, true);
assert.strictEqual(authResSuccess.reason, 'AUTHORIZED');

console.log('  [PASS] Strict Distinction between Allowed and Authorized Runtime Execution Verified');

// ==========================================
// 4. اختبار حالات الربط الأربعة ودلالاتها الحتمية
// ==========================================
console.log('>>> [4/7] Testing Deterministic Mapping States (ACTIVE, DISABLED, DEPRECATED, DRAFT)...');

// الربط المعطل DISABLED
const disabledMapping = new AgentSkillMapping({
    ...validMappingFixture,
    id: 'MAP-PF-DOCS-001-SECURITY-DISABLED',
    status: AgentSkillMapping.STATUS.DISABLED,
    allowed: false
});
const evalDisabled = disabledMapping.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill);
assert.strictEqual(evalDisabled.authorized, false);
assert.strictEqual(evalDisabled.reason, 'MAPPING_DISALLOWED');

// الربط المسودة DRAFT
const draftMapping = new AgentSkillMapping({
    ...validMappingFixture,
    id: 'MAP-PF-TEST-DRAFT',
    status: AgentSkillMapping.STATUS.DRAFT,
    allowed: false
});
const evalDraft = draftMapping.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill);
assert.strictEqual(evalDraft.authorized, false);
assert.strictEqual(evalDraft.reason, 'MAPPING_DISALLOWED');

// الربط المتقادم DEPRECATED
const depMapping = new AgentSkillMapping({
    ...validMappingFixture,
    id: 'MAP-PF-TEST-DEPRECATED',
    status: AgentSkillMapping.STATUS.DEPRECATED,
    allowed: false
});
const evalDep = depMapping.evaluateRuntimeAuthorization(mockSecAgent, mockSecSkill);
assert.strictEqual(evalDep.authorized, false);
assert.strictEqual(evalDep.reason, 'MAPPING_DISALLOWED');

console.log('  [PASS] All Deterministic Mapping States (ACTIVE, DISABLED, DEPRECATED, DRAFT) Verified');

// ==========================================
// 5. اختبار منع التصعيد الذاتي للسلطة عبر قيود الربط
// ==========================================
console.log('>>> [5/7] Testing Anti-Self-Escalation Defense in Mapping Constraints...');
const escalationDef = {
    ...validMappingFixture,
    id: 'MAP-PF-ESCALATION-ATTACK',
    authority_constraints: ['GRANT P0_MAXIMUM OVERRIDE TO AGENT']
};
const valEscalation = AgentSkillMapping.validate(escalationDef);
assert.strictEqual(valEscalation.isValid, false);
assert(valEscalation.errors.some(e => e.issue.includes('محاولة تصعيد سلطة محظورة')));

console.log('  [PASS] Anti-Self-Escalation Defense Verified');

// ==========================================
// 6. تحميل سجل الروابط الكنسي وفحوصات النزاهة المغلقة
// ==========================================
console.log('>>> [6/7] Testing Canonical Mapping Registry Loading & Fail-Closed Integrity...');
const mappingsRegistryPath = path.resolve(__dirname, '../../../registry/agent-skill-mappings.json');
const mappingReg = AgentSkillMappingRegistry.loadFromFile(mappingsRegistryPath);

assert(mappingReg.size >= 15, `يجب أن يحتوي السجل على الأقل على 15 رابطاً (العدد الحالي: ${mappingReg.size})`);
assert.strictEqual(mappingReg.hasMapping('MAP-PF-ARCH-001-ARCHITECTURE-REVIEW'), true);
assert.strictEqual(mappingReg.hasMapping('MAP-PF-SEC-001-SECURITY-REVIEW'), true);
assert.strictEqual(mappingReg.hasMapping('MAP-PF-DOCS-001-SECURITY-REVIEW-DISABLED'), true);

const activeMappings = mappingReg.getActiveMappings();
assert(activeMappings.length >= 12, 'يجب أن تكون غالبية الروابط الأساسية نشطة');
assert(activeMappings.every(m => m.status === 'ACTIVE' && m.allowed === true));

// استرجاع روابط وكيل معين
const archMappings = mappingReg.getMappingsForAgent('PF-ARCH-001');
assert(archMappings.length >= 2);
assert(archMappings.some(m => m.skill_id === 'PF-SKILL-ARCHITECTURE-REVIEW'));

// استرجاع روابط مهارة معينة
const secSkillMappings = mappingReg.getMappingsForSkill('PF-SKILL-SECURITY-REVIEW');
assert(secSkillMappings.length >= 2);

// فحص الفشل المغلق عند تكرار المعرفات
const dupMappingData = {
    version: '1.0.0',
    mappings: [
        validMappingFixture,
        { ...validMappingFixture, agent_id: 'PF-OTHER-001' }
    ]
};
const dupVal = AgentSkillMappingRegistry.validateRegistryData(dupMappingData);
assert.strictEqual(dupVal.isValid, false);
assert(dupVal.errors.some(e => e.includes('تكرار غير مسموح به لمعرف الرابط')));

// فحص الفشل المغلق عند تكرار الزوج (agent_id, skill_id)
const dupPairData = {
    version: '1.0.0',
    mappings: [
        validMappingFixture,
        { ...validMappingFixture, id: 'MAP-DIFFERENT-ID' }
    ]
};
const dupPairVal = AgentSkillMappingRegistry.validateRegistryData(dupPairData);
assert.strictEqual(dupPairVal.isValid, false);
assert(dupPairVal.errors.some(e => e.includes('تكرار غير مسموح به لزوج الوكيل والمهارة')));

console.log('  [PASS] Canonical Mapping Registry Loading & Fail-Closed Integrity Verified');

// ==========================================
// 7. اختبار التوافق الثلاثي الكنسي الصارم (Tri-Directional Compatibility)
// ==========================================
console.log('>>> [7/7] Testing Canonical Tri-Directional Compatibility...');

// حالة 1: وكيل ومهارة ورابط متوافقون تماماً
const tri1 = mappingReg.checkTriDirectionalCompatibility(
    { id: 'PF-SEC-001', status: 'ACTIVE', prohibited_skills: [] },
    { id: 'PF-SKILL-SECURITY-REVIEW', status: 'ACTIVE', prohibited_agents: [] }
);
assert.strictEqual(tri1.compatible, true);
assert.strictEqual(tri1.allowed, true);
assert.strictEqual(tri1.reason, 'COMPATIBLE_AND_ALLOWED');

// حالة 2: لا يوجد رابط مسجل بين الوكيل والمهارة
const tri2 = mappingReg.checkTriDirectionalCompatibility(
    { id: 'PF-DOCS-001', status: 'ACTIVE', prohibited_skills: [] },
    { id: 'PF-SKILL-DATABASE-REVIEW', status: 'ACTIVE', prohibited_agents: [] }
);
assert.strictEqual(tri2.compatible, false);
assert.strictEqual(tri2.reason, 'NO_MAPPING_FOUND');

// حالة 3: الرابط معطل صراحة (DISABLED)
const tri3 = mappingReg.checkTriDirectionalCompatibility(
    { id: 'PF-DOCS-001', status: 'ACTIVE', prohibited_skills: [] },
    { id: 'PF-SKILL-SECURITY-REVIEW', status: 'ACTIVE', prohibited_agents: [] }
);
assert.strictEqual(tri3.compatible, false);
assert.strictEqual(tri3.reason, 'MAPPING_DISABLED');

// حالة 4: الرابط متقادم (DEPRECATED)
const tri4 = mappingReg.checkTriDirectionalCompatibility(
    { id: 'PF-BACKEND-001', status: 'ACTIVE', prohibited_skills: [] },
    { id: 'PF-SKILL-DEPRECATED-QUERY', status: 'ACTIVE', prohibited_agents: [] }
);
assert.strictEqual(tri4.compatible, false);
assert.strictEqual(tri4.reason, 'MAPPING_DEPRECATED');

// حالة 5: الرابط مسودة (DRAFT)
const tri5 = mappingReg.checkTriDirectionalCompatibility(
    { id: 'PF-ARCH-001', status: 'ACTIVE', prohibited_skills: [] },
    { id: 'PF-SKILL-LEGACY-DRAFT', status: 'ACTIVE', prohibited_agents: [] }
);
assert.strictEqual(tri5.compatible, false);
assert.strictEqual(tri5.reason, 'MAPPING_DRAFT');

// حالة 6: مدخلات مشوهة وفشل مغلق
const tri6 = mappingReg.checkTriDirectionalCompatibility(null, null);
assert.strictEqual(tri6.compatible, false);
assert.strictEqual(tri6.reason, 'INVALID_AGENT_OBJECT');

console.log('  [PASS] Canonical Tri-Directional Compatibility (All Scenarios) Verified');

console.log('>>> [SUCCESS] All 7 ProofForge Agent ↔ Skill Mapping Test Suites PASSED 100%.');
