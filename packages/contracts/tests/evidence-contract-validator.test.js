/**
 * @file evidence-contract-validator.test.js
 * @description اختبارات التحقق العدائي لعقود الأدلة الحتمية (Evidence Contract Validator Adversarial Tests)
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const EvidenceContractValidator = require('../evidence-contract-validator');

console.log('======================================================');
console.log('🛡️ Testing Evidence Contract Validator (Fail-Closed Matrix)');
console.log('======================================================');

const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-evid-test-'));

try {
    // 1. متطلب غير مسجل كنسياً
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'UNREGISTERED_REQ',
            parsedVerifierOutput: { status: 'VERIFIED', checks: [] },
            workspacePath: tempWorkspace
        });
    }, /العقد الكنسي غير مسجل للمتطلب/);
    console.log('  [PASS] 1. Rejects unregistered requirement');

    // 2. مخرجات مدقق مشوهة
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: null,
            workspacePath: tempWorkspace
        });
    }, /مفقودة أو مشوهة/);
    console.log('  [PASS] 2. Rejects missing verifier output');

    // 3. حالة مدقق ليست VERIFIED
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: { status: 'FAILED', checks: [] },
            workspacePath: tempWorkspace
        });
    }, /حالة المدقق للمهارة.*ليست VERIFIED/);
    console.log('  [PASS] 3. Rejects non-VERIFIED verifier status');

    // 4. فحص مطابق غير موجود (محاولة استخدام فحص عام أو تخمين نصي)
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Generic Check Mentions Architecture Word', status: 'PASS', passed: true }]
            },
            workspacePath: tempWorkspace
        });
    }, /الفحص الكنسي الإلزامي.*غير موجود/);
    console.log('  [PASS] 4. Rejects generic check keyword substitution');

    // 5. فحص مطابق كنسياً لكنه فاشل (FAIL)
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'FAIL', passed: false }]
            },
            workspacePath: tempWorkspace
        });
    }, /لم يسجل حالة PASS/);
    console.log('  [PASS] 5. Rejects failed canonical check');

    // 6. مخرج مادي إلزامي غير موجود على القرص
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempWorkspace
        });
    }, /غير موجود على القرص/);
    console.log('  [PASS] 6. Rejects missing physical artifact');

    // 7. مخرج مادي فارغ (Zero-Byte File)
    const emptyAdrPath = path.join(tempWorkspace, 'ADR-001.md');
    fs.writeFileSync(emptyAdrPath, '', 'utf8');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempWorkspace
        });
    }, /فارغ تماماً \(Zero Bytes\)/);
    console.log('  [PASS] 7. Rejects zero-byte physical artifact');

    // 8. محاولة تسلق مسارات في المخرج المادي
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempWorkspace,
            candidateArtifact: { path: '../../etc/passwd' }
        });
    }, /Path Traversal/i);
    console.log('  [PASS] 8. Rejects path traversal in artifact path');

    // 9. تلاعب بالتجزئة المشفرة بعد الإنشاء
    fs.writeFileSync(emptyAdrPath, '# Real Valid ADR Content\nClean architecture verified.', 'utf8');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempWorkspace,
            candidateArtifact: { sha256: 'tampered_fake_hash_1234567890' }
        });
    }, /تلاعب مرصود في مخرج الدليل/);
    console.log('  [PASS] 9. Rejects tampered artifact hash');

    // 10. اعتماد ناجح ودقيق مع ربط كامل وموثق
    const validAdrBytes = fs.readFileSync(emptyAdrPath);
    const validHash = crypto.createHash('sha256').update(validAdrBytes).digest('hex');
    const validBoundEvidence = EvidenceContractValidator.validateAndBindEvidence({
        skillId: 'architecture',
        requirementId: 'ADR_DOCUMENT',
        parsedVerifierOutput: {
            status: 'VERIFIED',
            total_checks: 1,
            passed_checks: 1,
            failed_checks: 0,
            checks: [{ id: 'CHK-ARCH', property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
        },
        workspacePath: tempWorkspace,
        candidateArtifact: { path: 'ADR-001.md', sha256: validHash }
    });

    assert.strictEqual(validBoundEvidence.status, 'VERIFIED');
    assert.strictEqual(validBoundEvidence.requirementId, 'ADR_DOCUMENT');
    assert.strictEqual(validBoundEvidence.skillId, 'architecture');
    assert.strictEqual(validBoundEvidence.artifactHash, validHash);
    assert(validBoundEvidence.evidenceId.startsWith('EVID_'));
    console.log('  [PASS] 10. Validates and binds complete deterministic evidence record');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 10 Evidence Contract Validator Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try { fs.rmSync(tempWorkspace, { recursive: true, force: true }); } catch (_) {}
}
