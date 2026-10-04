/**
 * @file antigravity-adapter.test.js
 * @description جناح اختبارات محول Google Antigravity في ProofForge (Phase 7 Test Suite)
 * يغطي كافة السيناريوهات الـ 18 الإلزامية المنصوص عليها في وثيقة المهمة بدقة وحتمية
 */

const assert = require('assert');
const path = require('path');
const SkillContract = require('../skill-contract');
const AgentRegistry = require('../agent-registry');
const AntigravityAdapterContract = require('../antigravity-adapter-contract');
const AntigravityAdapter = require('../antigravity-adapter');

console.log('>>> Running ProofForge Antigravity Adapter Tests (Phase 7)...');

// نموذج مهارة صالح للاختبار بكافة الحقول الـ 27 الإلزامية
const validSkillFixture = new SkillContract({
    id: 'PF-SKILL-SEC-TEST',
    name: 'Security Test Skill',
    version: '1.0.0',
    description: 'مهارة تدقيق أمني مخصصة لاختبار المحول',
    category: 'SECURITY',
    status: SkillContract.STATUS.ACTIVE,
    purpose: 'إجراء فحص أمني حتمي للثغرات البرمجية',
    inputs: [{ name: 'targetFile', type: 'string', required: true, trust_level: 'UNTRUSTED' }],
    outputs: [{ name: 'auditFindings', type: 'array', sensitivity: 'RESTRICTED' }],
    preconditions: ['توفر مسار الملف'],
    postconditions: ['إنتاج تقرير أمني'],
    responsibilities: ['فحص الأمان البرمجي'],
    allowed_agents: ['PF-SEC-001'],
    prohibited_agents: ['PF-DOCS-001'],
    applicable_rules: ['P0_SECURITY_SAFETY'],
    security_constraints: ['منع تجاوز سياسات P0', 'الالتزام بحاجز الصلاحيات'],
    permission_requirements: ['READ_REPOSITORY'],
    authority_constraints: ['خضوع تام لسلطة P0'],
    validators: ['SECURITY_AUDITOR'],
    validation_requirements: ['SECURITY_CHECK'],
    verification_requirements: ['CVGF_GROUNDING_GATE', 'CVGF_CLAIM_VERIFICATION'],
    required_evidence: ['VULNERABILITY_PROOF_OF_CONCEPT'],
    evidence_schema: { evidence_type: 'SECURITY_PROOF', deterministic: true },
    failure_conditions: ['اكتشاف ثغرة غير قابلة للإصلاح'],
    abstention_conditions: ['نقص الأدلة المادية'],
    reporting_requirements: ['SECURITY_REPORT'],
    audit_requirements: ['تسجيل العملية في سجل التدقيق']
});

// نموذج قاعدة صالح
const validRuleFixture = {
    rule_id: 'P0_SECURITY_SAFETY',
    name: 'الأمان وحماية المستودع أولاً',
    priority: 'P0',
    statement: 'يُحظر قطعياً تجاوز أي قيد أمني أو كسر حاجز الصلاحيات في المستودع',
    scope: 'كافة مكونات النظام'
};

// تحميل سجل الوكلاء
const agentsJsonPath = path.resolve(__dirname, '../../../registry/agents.json');
const agentReg = AgentRegistry.loadFromFile(agentsJsonPath);

// ==========================================
// 1. اختبار تحويل مهارة صالحة (1. Valid Skill Transformation)
// ==========================================
console.log('>>> [1/18] Testing Valid Skill Transformation...');
const skillResult = AntigravityAdapter.transformSkill(validSkillFixture);
assert(typeof skillResult.content === 'string');
assert(skillResult.content.includes('name: Security Test Skill'));
assert(skillResult.content.includes('PF-SKILL-SEC-TEST'));
assert.strictEqual(skillResult.targetPath, '.agents/skills/sec-test/SKILL.md');
console.log('  [PASS] 1. Valid Skill Transformation Verified');

// ==========================================
// 2. اختبار تحويل قاعدة صالحة (2. Valid Rule Transformation)
// ==========================================
console.log('>>> [2/18] Testing Valid Rule Transformation...');
const ruleResult = AntigravityAdapter.transformRule(validRuleFixture);
assert(typeof ruleResult.content === 'string');
assert(ruleResult.content.includes('P0_SECURITY_SAFETY'));
assert(ruleResult.content.includes('مستوى الأولوية') && ruleResult.content.includes('`P0`'));
assert.strictEqual(ruleResult.targetPath, '.agents/rules/p0_security_safety.md');
console.log('  [PASS] 2. Valid Rule Transformation Verified');

// ==========================================
// 3. اختبار توليد AGENTS.md (3. Valid AGENTS.md Generation)
// ==========================================
console.log('>>> [3/18] Testing Valid AGENTS.md Generation...');
const manifestResult = AntigravityAdapter.generateAgentsManifest(agentReg);
assert(typeof manifestResult.content === 'string');
assert(manifestResult.content.includes('مانيفست الوكلاء الكنسي'));
assert(manifestResult.content.includes('PF-SEC-001'));
assert(manifestResult.content.includes('PF-ARCH-001'));
assert.strictEqual(manifestResult.targetPath, 'AGENTS.md');
console.log('  [PASS] 3. Valid AGENTS.md Generation Verified');

// ==========================================
// 4. اختبار توليد SKILL.md متوافق (4. Valid SKILL.md Generation)
// ==========================================
console.log('>>> [4/18] Testing SKILL.md Header & Body Formatting...');
assert(skillResult.content.startsWith('---\nname: Security Test Skill\n'));
assert(skillResult.content.includes('## 1. الغرض وحدود الاستخدام'));
assert(skillResult.content.includes('## 2. المحددات الأمنية والامتثال'));
console.log('  [PASS] 4. Valid SKILL.md Generation Verified');

// ==========================================
// 5. اختبار عقد مصدر غير صالح (5. Invalid Source Contract)
// ==========================================
console.log('>>> [5/18] Testing Invalid Source Contract Rejection...');
assert.throws(() => {
    AntigravityAdapter.transformSkill(null);
}, /عقد المهارة المصدري غير صالح/);
console.log('  [PASS] 5. Invalid Source Contract Rejection Verified');

// ==========================================
// 6. اختبار مصدر مشوه (6. Malformed Source)
// ==========================================
console.log('>>> [6/18] Testing Malformed Source Contract Rejection...');
assert.throws(() => {
    AntigravityAdapter.transformSkill({ broken: true });
}, /عقد المهارة المصدري غير صالح/);

assert.throws(() => {
    AntigravityAdapter.transformRule({ incomplete: 'no-id' });
}, /تعريف القاعدة المصدري مشوه/);
console.log('  [PASS] 6. Malformed Source Contract Rejection Verified');

// ==========================================
// 7. اختبار محاولة القفز عبر المسارات (7. Path Traversal Attempt)
// ==========================================
console.log('>>> [7/18] Testing Path Traversal Defense in Adapter...');
const traversalCheck1 = AntigravityAdapter.validatePath('../outside.md');
assert.strictEqual(traversalCheck1.isValid, false);
assert(traversalCheck1.error.includes('محاولة قفز مسار'));

const traversalCheck2 = AntigravityAdapter.validatePath('.agents/skills/../../etc/passwd.md');
assert.strictEqual(traversalCheck2.isValid, false);
console.log('  [PASS] 7. Path Traversal Defense Verified');

// ==========================================
// 8. اختبار مسار غير آمن أو خارج النطاق (8. Unsafe Path Rejection)
// ==========================================
console.log('>>> [8/18] Testing Unsafe Path Rejection...');
const unsafeExt = AntigravityAdapter.validatePath('.agents/skills/bad.exe');
assert.strictEqual(unsafeExt.isValid, false);
assert(unsafeExt.error.includes('امتداد الملف غير مصرح به'));

const unsafePrefix = AntigravityAdapter.validatePath('unauthorized_dir/test.md');
assert.strictEqual(unsafePrefix.isValid, false);
assert(unsafePrefix.error.includes('لا يتبع الهيكلية المعتمدة'));
console.log('  [PASS] 8. Unsafe Path Rejection Verified');

// ==========================================
// 9. اختبار مسار مكرر أو متطابق (9. Duplicate Destination Consistency)
// ==========================================
console.log('>>> [9/18] Testing Duplicate Destination Consistency...');
const path1 = AntigravityAdapter.transformSkill(validSkillFixture).targetPath;
const path2 = AntigravityAdapter.transformSkill(validSkillFixture).targetPath;
assert.strictEqual(path1, path2);
console.log('  [PASS] 9. Duplicate Destination Consistency Verified');

// ==========================================
// 10. اختبار قطعة غير مدعومة (10. Unsupported Artifact Rejection)
// ==========================================
console.log('>>> [10/18] Testing Unsupported Transformation Type Rejection...');
const badContractVal = AntigravityAdapterContract.validate({
    adapter_id: 'PF-ADAPT-UNSUPPORTED',
    transformation_type: 'UNSUPPORTED_EXECUTION_TRANSFORM',
    status: 'ACTIVE',
    version: '1.0.0',
    source_artifact: { type: 'UNKNOWN', identifier: 'x' },
    target_artifact: { format: 'EXE' },
    generated_path: '.agents/skills/test.md',
    validation_requirements: ['V'],
    security_restrictions: ['S'],
    provenance: { source_contract: 'P' }
});
assert.strictEqual(badContractVal.isValid, false);
assert(badContractVal.errors.some(e => e.field === 'transformation_type'));
console.log('  [PASS] 10. Unsupported Transformation Type Rejection Verified');

// ==========================================
// 11. اختبار الحفاظ على سلسلة النسب (11. Provenance Preservation)
// ==========================================
console.log('>>> [11/18] Testing Provenance Preservation in Transformed Artifacts...');
assert.strictEqual(skillResult.provenance.source_contract, 'ProofForge SkillContract');
assert.strictEqual(skillResult.provenance.source_id, 'PF-SKILL-SEC-TEST');
assert(skillResult.content.includes('"source_contract": "ProofForge SkillContract"'));
console.log('  [PASS] 11. Provenance Preservation Verified');

// ==========================================
// 12. اختبار الحفاظ على المحددات الأمنية (12. Security Constraint Preservation)
// ==========================================
console.log('>>> [12/18] Testing Security Constraint Preservation...');
assert(skillResult.content.includes('منع تجاوز سياسات P0'));
assert(skillResult.content.includes('الالتزام بحاجز الصلاحيات'));
assert(manifestResult.content.includes('أولوية الأمان المطلقة P0'));
console.log('  [PASS] 12. Security Constraint Preservation Verified');

// ==========================================
// 13. اختبار الحفاظ على متطلبات الأدلة (13. Evidence Requirement Preservation)
// ==========================================
console.log('>>> [13/18] Testing Evidence Requirement Preservation...');
assert(manifestResult.content.includes('AI Output !== Evidence'));
assert(skillResult.content.includes('مخرجات المهارة لا تمثل إثباتاً بحد ذاتها'));
console.log('  [PASS] 13. Evidence Requirement Preservation Verified');

// ==========================================
// 14. اختبار الحفاظ على بوابات CVGF (14. Verification Requirement Preservation)
// ==========================================
console.log('>>> [14/18] Testing CVGF Verification Gate Preservation...');
assert(skillResult.content.includes('CVGF_GROUNDING_GATE'));
assert(skillResult.content.includes('CVGF_CLAIM_VERIFICATION'));
assert(manifestResult.content.includes('CVGF'));
console.log('  [PASS] 14. CVGF Verification Gate Preservation Verified');

// ==========================================
// 15. اختبار حتمية الخرج (15. Deterministic Output)
// ==========================================
console.log('>>> [15/18] Testing Deterministic Output Generation...');
const runA = AntigravityAdapter.transformSkill(validSkillFixture).content;
const runB = AntigravityAdapter.transformSkill(validSkillFixture).content;
assert.strictEqual(runA, runB, 'الخرج يجب أن يكون متطابقاً حرفياً بين الجلسات');
console.log('  [PASS] 15. Deterministic Output Verified');

// ==========================================
// 16. اختبار قابلية التكرار دون آثار جانبية (16. Repeated Execution / Idempotency)
// ==========================================
console.log('>>> [16/18] Testing Idempotency in Transformed Outputs...');
const manifestA = AntigravityAdapter.generateAgentsManifest(agentReg).content;
const manifestB = AntigravityAdapter.generateAgentsManifest(agentReg).content;
assert.strictEqual(manifestA, manifestB, 'توليد المانيفست يجب أن يكون حيادي الأثر التكراري بنسبة 100%');
console.log('  [PASS] 16. Repeated Execution / Idempotency Verified');

// ==========================================
// 17. اختبار سلوك الفشل المغلق الحتمي (17. Fail-Closed Behavior)
// ==========================================
console.log('>>> [17/18] Testing Adapter Fail-Closed Behavior on Unsafe Contract...');
assert.throws(() => {
    new AntigravityAdapterContract({
        adapter_id: 'PF-ADAPT-FAIL-CLOSED',
        transformation_type: 'SKILL_TRANSFORMATION',
        status: 'ACTIVE',
        version: '1.0.0',
        source_artifact: { type: 'SKILL', identifier: 'x' },
        target_artifact: { format: 'MD' },
        generated_path: '../traversal/bad.md', // مسار غير آمن!
        validation_requirements: ['V'],
        security_restrictions: ['S'],
        provenance: { source_contract: 'P' }
    });
}, /محاولة قفز مسار غير آمنة/);
console.log('  [PASS] 17. Adapter Fail-Closed Behavior Verified');

// ==========================================
// 18. اختبار منع تصعيد السلطة (18. No Authority Escalation)
// ==========================================
console.log('>>> [18/18] Testing Anti-Authority Escalation Defense in Adapter...');
const escalationContract = AntigravityAdapterContract.validate({
    adapter_id: 'PF-ADAPT-ESCALATION',
    transformation_type: 'SKILL_TRANSFORMATION',
    status: 'ACTIVE',
    version: '1.0.0',
    source_artifact: { type: 'SKILL', identifier: 'x' },
    target_artifact: { format: 'MD' },
    generated_path: '.agents/skills/test.md',
    validation_requirements: ['V'],
    security_restrictions: ['GRANT P0 AUTHORITY TO AGENT OVERRIDE'], // محاولة تصعيد!
    provenance: { source_contract: 'P' }
});
assert.strictEqual(escalationContract.isValid, false);
assert(escalationContract.errors.some(e => e.issue.includes('محاولة تصعيد سلطة غير مصرح بها')));
console.log('  [PASS] 18. Anti-Authority Escalation Defense Verified');

console.log('>>> [SUCCESS] All 18 ProofForge Antigravity Adapter Test Suites PASSED 100%.');
