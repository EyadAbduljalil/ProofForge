/**
 * @file model-policy.test.js
 * @description جناح اختبارات عقد وسجل سياسات النماذج والذكاء الاصطناعي في ProofForge (Phase 6 Test Suite)
 * يغطي كافة السيناريوهات الـ 16 الإلزامية المنصوص عليها في وثيقة المهمة بحتمية مطلقة
 */

const assert = require('assert');
const path = require('path');
const ModelPolicyContract = require('../model-policy-contract');
const ModelPolicyRegistry = require('../model-policy-registry');

console.log('>>> Running ProofForge Model Policy Contract Tests (Phase 6)...');

const modelPoliciesJsonPath = path.resolve(__dirname, '../../../registry/model-policies.json');

const validRules = ['P0_SECURITY_SAFETY', 'P2_ARCHITECTURE', 'sec.zero-trust'];
const validValidators = ['SECURITY_AUDITOR', 'INJECTION_DETECTOR', 'ARCHITECTURE_AUDITOR', 'TEST_RUNNER'];
const crossRegistries = { validRules, validValidators };

// عينة سياسة صالحة
const validPolicyFixture = {
    policy_id: 'PF-POL-TEST-001',
    name: 'Test Policy',
    version: '1.0.0',
    status: ModelPolicyContract.STATUS.ACTIVE,
    purpose: 'سياسة اختبارية لقياس كفاءة العقد وحتمية الفحص المغلق',
    task_types: ['SECURITY_AUDIT'],
    risk_level: ModelPolicyContract.RISK_LEVEL.HIGH,
    required_capabilities: ['reasoning', 'security_audit'],
    model_constraints: ['منع استدعاء أدوات غير مصرحة'],
    context_requirements: { min_context_tokens: 16384 },
    security_requirements: ['الامتثال لحاجز الصلاحيات'],
    evidence_requirements: ['VULNERABILITY_PROOF_OF_CONCEPT'],
    verification_requirements: ['CVGF_GROUNDING_GATE', 'CVGF_CLAIM_VERIFICATION'],
    abstention_conditions: ['غموض النطاق'],
    prohibited_behaviors: ['تجاوز سياسات الأمان P0'],
    cost_constraints: { max_tokens_per_call: 8192 },
    latency_constraints: { max_timeout_ms: 30000 },
    fallback_constraints: { allowed_downgrade: false, fallback_action: 'DETERMINISTIC_ABSTENTION' },
    reporting_requirements: ['SECURITY_REPORT'],
    audit_requirements: ['LOG_TO_RECORDER']
};

// ==========================================
// 1. اختبار سياسة صالحة والتجميد العميق (1. Valid Policy & Immutability)
// ==========================================
console.log('>>> [1/16] Testing Valid Policy Creation & Deep Immutability...');
const p1 = new ModelPolicyContract(validPolicyFixture);
assert.strictEqual(p1.policy_id, 'PF-POL-TEST-001');
assert.strictEqual(p1.status, 'ACTIVE');
assert.strictEqual(p1.risk_level, 'HIGH');
assert.strictEqual(Object.isFrozen(p1), true, 'كائن العقد يجب أن يكون مجمداً');
assert.strictEqual(Object.isFrozen(p1.task_types), true, 'مصفوفة task_types يجب أن تكون مجمدة');
assert.strictEqual(Object.isFrozen(p1.security_requirements), true, 'مصفوفة security_requirements يجب أن تكون مجمدة');

try {
    'use strict';
    p1.status = 'DISABLED';
} catch (e) {
    // رمي استثناء في الوضع الصارم
}
assert.strictEqual(p1.status, 'ACTIVE', 'الحالة يجب ألا تتغير بعد التجميد');
console.log('  [PASS] 1. Valid Policy Creation & Deep Immutability Verified');

// ==========================================
// 2. اختبار تكرار معرف السياسة (2. Duplicate Policy)
// ==========================================
console.log('>>> [2/16] Testing Duplicate Policy Rejection...');
const dupRegData = {
    policies: [
        validPolicyFixture,
        { ...validPolicyFixture, name: 'Duplicate Policy Name' }
    ]
};
const dupVal = ModelPolicyRegistry.validateRegistryData(dupRegData, crossRegistries);
assert.strictEqual(dupVal.isValid, false);
assert(dupVal.errors.some(e => e.includes('تكرار غير مسموح به لمعرف السياسة')));
console.log('  [PASS] 2. Duplicate Policy Rejection Verified');

// ==========================================
// 3. اختبار سياسة مشوهة (3. Malformed Policy)
// ==========================================
console.log('>>> [3/16] Testing Malformed Policy Rejection...');
const malformed1 = ModelPolicyContract.validate(null);
assert.strictEqual(malformed1.isValid, false);

const malformed2 = ModelPolicyContract.validate({
    policy_id: 'bad_id_format', // لا يطابق النمط ^PF-POL-[A-Z0-9_-]+$
    name: 'Malformed'
});
assert.strictEqual(malformed2.isValid, false);
assert(malformed2.errors.some(e => e.field === 'policy_id'));
console.log('  [PASS] 3. Malformed Policy Rejection Verified');

// ==========================================
// 4. اختبار مستوى خطورة غير صالح (4. Invalid Risk Level)
// ==========================================
console.log('>>> [4/16] Testing Invalid Risk Level Rejection...');
const invalidRisk = ModelPolicyContract.validate({
    ...validPolicyFixture,
    risk_level: 'SUPER_EXTREME_DANGEROUS' // مستوى خطورة غير معترف به
});
assert.strictEqual(invalidRisk.isValid, false);
assert(invalidRisk.errors.some(e => e.field === 'risk_level'));
console.log('  [PASS] 4. Invalid Risk Level Rejection Verified');

// ==========================================
// 5. اختبار متطلب قدرة غير صالح (5. Invalid Model Requirement)
// ==========================================
console.log('>>> [5/16] Testing Invalid Capability / Model Requirement Rejection...');
const invalidCap = ModelPolicyContract.validate({
    ...validPolicyFixture,
    required_capabilities: [''] // قدرة فارغة
});
assert.strictEqual(invalidCap.isValid, false);
assert(invalidCap.errors.some(e => e.field === 'required_capabilities'));
console.log('  [PASS] 5. Invalid Capability / Model Requirement Rejection Verified');

// ==========================================
// 6. اختبار مرجع قاعدة غير صالح (6. Invalid Rule Reference)
// ==========================================
console.log('>>> [6/16] Testing Invalid Rule Reference Rejection...');
const invalidRuleData = {
    policies: [
        { ...validPolicyFixture, policy_id: 'PF-POL-RULE-FAIL', applicable_rules: ['RULE-GHOST-FAKE-999'] }
    ]
};
const ruleVal = ModelPolicyRegistry.validateRegistryData(invalidRuleData, crossRegistries);
assert.strictEqual(ruleVal.isValid, false);
assert(ruleVal.errors.some(e => e.includes("قاعدة مجهولة غير مسجلة: 'RULE-GHOST-FAKE-999'")));
console.log('  [PASS] 6. Invalid Rule Reference Rejection Verified');

// ==========================================
// 7. اختبار مرجع مدقق غير صالح (7. Invalid Validator Reference)
// ==========================================
console.log('>>> [7/16] Testing Invalid Validator Reference Rejection...');
const invalidValData = {
    policies: [
        { ...validPolicyFixture, policy_id: 'PF-POL-VAL-FAIL', required_validators: ['FAKE_VALIDATOR_007'] }
    ]
};
const valVal = ModelPolicyRegistry.validateRegistryData(invalidValData, crossRegistries);
assert.strictEqual(valVal.isValid, false);
assert(valVal.errors.some(e => e.includes("مدقق مجهول غير مسجل: 'FAKE_VALIDATOR_007'")));
console.log('  [PASS] 7. Invalid Validator Reference Rejection Verified');

// ==========================================
// 8. اختبار متطلب دليل غير صالح أو مفرغ (8. Invalid Evidence Requirement)
// ==========================================
console.log('>>> [8/16] Testing Invalid Evidence Requirement Rejection...');
// محاولة إقرار أن مخرج الذكاء الاصطناعي هو دليل بحد ذاته
const invalidEvidence = ModelPolicyContract.validate({
    ...validPolicyFixture,
    evidence_requirements: ['AI_OUTPUT_IS_EVIDENCE']
});
assert.strictEqual(invalidEvidence.isValid, false);
assert(invalidEvidence.errors.some(e => e.issue.includes('انتهاك ميثاق الأدلة')));
console.log('  [PASS] 8. Invalid Evidence Requirement Rejection Verified');

// ==========================================
// 9. اختبار بوابة تحقق غير صالحة في CVGF (9. Invalid Verification Requirement)
// ==========================================
console.log('>>> [9/16] Testing Invalid Verification Gate Rejection...');
const invalidGate = ModelPolicyContract.validate({
    ...validPolicyFixture,
    verification_requirements: ['FAKE_UNVERIFIED_GATE_99']
});
assert.strictEqual(invalidGate.isValid, false);
assert(invalidGate.errors.some(e => e.field === 'verification_requirements'));
console.log('  [PASS] 9. Invalid Verification Gate Rejection Verified');

// ==========================================
// 10. اختبار محاولة تخفيض الأمان (10. Security Downgrade Attempt)
// ==========================================
console.log('>>> [10/16] Testing Security Downgrade Attempt Defense...');
const regTest = new ModelPolicyRegistry();
regTest.registerPolicy(p1); // سياستنا HIGH

// محاولة تشغيل حمولة CRITICAL تحت سياسة HIGH
const downgradeEval = regTest.evaluatePolicyCompliance('PF-POL-TEST-001', {
    task_type: 'SECURITY_AUDIT',
    risk_level: 'CRITICAL'
});
assert.strictEqual(downgradeEval.compliant, false);
assert(downgradeEval.reason.includes('محاولة تخفيض أمان غير مصرح بها'));
console.log('  [PASS] 10. Security Downgrade Attempt Defense Verified');

// ==========================================
// 11. اختبار محاولة تجاوز سياسات الأمان P0 (11. P0 Bypass Attempt)
// ==========================================
console.log('>>> [11/16] Testing P0 Bypass Attempt Defense...');
const bypassP0 = ModelPolicyContract.validate({
    ...validPolicyFixture,
    security_requirements: ['BYPASS P0_SECURITY_SAFETY FOR PERFORMANCE']
});
assert.strictEqual(bypassP0.isValid, false);
assert(bypassP0.errors.some(e => e.issue.includes('محاولة غير مصرح بها لتجاوز أو إضعاف سياسات الأمان P0')));
console.log('  [PASS] 11. P0 Bypass Attempt Defense Verified');

// ==========================================
// 12. اختبار محاولة تصعيد السلطة (12. Authority Escalation Attempt)
// ==========================================
console.log('>>> [12/16] Testing Authority Escalation Attempt Defense...');
const escalation = ModelPolicyContract.validate({
    ...validPolicyFixture,
    security_requirements: ['CLAIM P0_AUTHORITY FOR AI MODEL']
});
assert.strictEqual(escalation.isValid, false);
assert(escalation.errors.some(e => e.field === 'authority_constraints'));
console.log('  [PASS] 12. Authority Escalation Attempt Defense Verified');

// ==========================================
// 13. اختبار التراجع غير الآمن (13. Unsafe Fallback Rejection)
// ==========================================
console.log('>>> [13/16] Testing Unsafe Fallback Rejection...');
const unsafeFallback = ModelPolicyContract.validate({
    ...validPolicyFixture,
    fallback_constraints: { allowed_downgrade: true } // محاولة إباحة التراجع لسياسة أضعف!
});
assert.strictEqual(unsafeFallback.isValid, false);
assert(unsafeFallback.errors.some(e => e.issue.includes('حظر أمني: يُمنع السماح بتخفيض مستوى الأمان')));
console.log('  [PASS] 13. Unsafe Fallback Rejection Verified');

// ==========================================
// 14. اختبار شروط الاستنكاف الإدراكي (14. Abstention Requirement)
// ==========================================
console.log('>>> [14/16] Testing Abstention Conditions Presence...');
assert(p1.abstention_conditions.includes('غموض النطاق'));
const noAbstention = ModelPolicyContract.validate({
    ...validPolicyFixture,
    abstention_conditions: [] // مصفوفة فارغة
});
assert.strictEqual(noAbstention.isValid, false);
assert(noAbstention.errors.some(e => e.field === 'abstention_conditions'));
console.log('  [PASS] 14. Abstention Conditions Presence Verified');

// ==========================================
// 15. اختبار التحقق الحتمي من السجل الكنسي (15. Deterministic Registry Validation)
// ==========================================
console.log('>>> [15/16] Testing Deterministic Registry Validation...');
const canonicalReg1 = ModelPolicyRegistry.loadFromFile(modelPoliciesJsonPath, crossRegistries);
const canonicalReg2 = ModelPolicyRegistry.loadFromFile(modelPoliciesJsonPath, crossRegistries);

assert.strictEqual(canonicalReg1.size, canonicalReg2.size);
assert(canonicalReg1.size >= 4, `يجب تحميل 4 سياسات على الأقل (الحالي: ${canonicalReg1.size})`);
assert.strictEqual(canonicalReg1.getActivePolicies().length, 4);

// التحقق من استقرار الفهرسة
const secPolicies = canonicalReg1.getPoliciesForTaskType('SECURITY_AUDIT');
assert(secPolicies.length >= 1);
assert.strictEqual(secPolicies[0].policy_id, 'PF-POL-SEC-CRITICAL');

console.log('  [PASS] 15. Deterministic Registry Validation Verified');

// ==========================================
// 16. اختبار سلوك الفشل المغلق الشامل (16. Fail-Closed Behavior)
// ==========================================
console.log('>>> [16/16] Testing Comprehensive Fail-Closed Behavior...');
// استعلام عن سياسة مجهولة
assert.strictEqual(canonicalReg1.getPolicy('PF-POL-NON-EXISTENT'), null);
assert.strictEqual(canonicalReg1.getActivePolicy('PF-POL-NON-EXISTENT'), null);

// استعلام عن سياسة معطلة (يجب ألا تعاد بواسطة getActivePolicy)
assert.strictEqual(canonicalReg1.getActivePolicy('PF-POL-LEGACY-DISABLED'), null);
assert.strictEqual(canonicalReg1.getPolicy('PF-POL-LEGACY-DISABLED').status, 'DISABLED');

console.log('  [PASS] 16. Comprehensive Fail-Closed Behavior Verified');

console.log('>>> [SUCCESS] All 16 ProofForge Model Policy Contract Test Suites PASSED 100%.');
