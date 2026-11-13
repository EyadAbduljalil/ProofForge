/**
 * @file independent-evidence-contract-adversarial.test.js
 * @description اختبارات التحقق العدائي من استقلالية عقود الأدلة، والفصل بين المنتج والمدقق، وبصمة المصدر
 * (ProofForge Independent Evidence Contract Adversarial Test Suite)
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const EvidenceContractValidator = require('../evidence-contract-validator');

console.log('======================================================');
console.log('🛡️  ProofForge — Independent Evidence Contract Adversarial Tests');
console.log('======================================================');

const tempSandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-indep-evid-'));

try {
    // ----------------------------------------------------
    // اختبار 1: حظر التزكية الذاتية للمنتج (Producer Self-Certification Violation)
    // ----------------------------------------------------
    console.log('>>> [1/7] Testing Rejection of Producer Self-Certification...');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            producerIdentity: 'skills/architecture/scripts/verify_architecture.js',
            verifierIdentity: 'skills/architecture/scripts/verify_architecture.js',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempSandbox
        });
    }, /انتهاك الفصل بين المنتج والمدقق/);
    console.log('  [PASS] 1. Producer self-certification strictly rejected');

    // ----------------------------------------------------
    // اختبار 2: حظر مطابقة البوادئ الجزئية لمُعرف الفحص (Exact Check ID Match Enforcement)
    // ----------------------------------------------------
    console.log('>>> [2/7] Testing Rejection of Prefix / Substring Check Matching...');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{
                    // يبدأ بنفس الاسم لكنه يضيف لاحقة مختلفة
                    property: 'Clean Architecture Dependency Invariant Extra Suffix Collision',
                    status: 'PASS',
                    passed: true
                }]
            },
            workspacePath: tempSandbox
        });
    }, /الفحص الكنسي الإلزامي.*غير موجود/);
    console.log('  [PASS] 2. Prefix collision strictly rejected, exact check ID required');

    // ----------------------------------------------------
    // اختبار 3: حظر المسار الفارغ (null) عند اشتراط مخرج مادي
    // ----------------------------------------------------
    console.log('>>> [3/7] Testing Rejection of Null Artifact for Required File Checks...');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            candidateArtifact: { path: null },
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempSandbox
        });
    }, /يتطلب مخرجاً مادياً إلزامياً/);
    console.log('  [PASS] 3. Null artifact path strictly rejected when artifact is required');

    // ----------------------------------------------------
    // اختبار 4: حظر تعارض بصمة المصدر مع الـ Commit SHA المتوقع
    // ----------------------------------------------------
    console.log('>>> [4/7] Testing Provenance Commit SHA Mismatch Rejection...');
    const adrFile = path.join(tempSandbox, 'ADR-001.md');
    fs.writeFileSync(adrFile, '# Valid Architecture ADR\nDecision recorded.', 'utf8');

    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            expectedCommitSha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            executionProvenance: {
                commitSha: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                executionId: 'EXEC_001'
            },
            candidateArtifact: { path: 'ADR-001.md' },
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempSandbox
        });
    }, /تعارض في بصمة المصدر/);
    console.log('  [PASS] 4. Provenance commit mismatch strictly rejected');

    // ----------------------------------------------------
    // اختبار 5: حظر تلاعب المخرج بعد التوليد (Hash Mismatch)
    // ----------------------------------------------------
    console.log('>>> [5/7] Testing Post-Generation Tampered Content Rejection...');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            candidateArtifact: {
                path: 'ADR-001.md',
                sha256: '0000000000000000000000000000000000000000000000000000000000000000'
            },
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempSandbox
        });
    }, /تلاعب مرصود في مخرج الدليل/);
    console.log('  [PASS] 5. Artifact hash mismatch strictly rejected');

    // ----------------------------------------------------
    // اختبار 6: حظر الهروب من المجلد أو تسلق المسارات
    // ----------------------------------------------------
    console.log('>>> [6/7] Testing Path Traversal Defense in Evidence Artifacts...');
    assert.throws(() => {
        EvidenceContractValidator.validateAndBindEvidence({
            skillId: 'architecture',
            requirementId: 'ADR_DOCUMENT',
            candidateArtifact: { path: '../../../windows/system32/cmd.exe' },
            parsedVerifierOutput: {
                status: 'VERIFIED',
                checks: [{ property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
            },
            workspacePath: tempSandbox
        });
    }, /Path Traversal/i);
    console.log('  [PASS] 6. Directory traversal attempts strictly blocked');

    // ----------------------------------------------------
    // اختبار 7: نجاح الاعتماد التام عند استيفاء كافة شروط الاستقلالية والأدلة
    // ----------------------------------------------------
    console.log('>>> [7/7] Testing Complete Compliant Independent Evidence Record...');
    const content = fs.readFileSync(adrFile);
    const validSha = crypto.createHash('sha256').update(content).digest('hex');

    const result = EvidenceContractValidator.validateAndBindEvidence({
        skillId: 'architecture',
        requirementId: 'ADR_DOCUMENT',
        producerIdentity: 'AGENT_PRODUCER_TASK_RUNNER',
        verifierIdentity: 'skills/architecture/scripts/verify_architecture.js',
        expectedCommitSha: 'e81b412c2edd684ca7af3c1e5c6e53445b624624',
        executionProvenance: {
            commitSha: 'e81b412c2edd684ca7af3c1e5c6e53445b624624',
            executionId: 'EXEC_INDEP_001',
            timestamp: new Date().toISOString()
        },
        candidateArtifact: { path: 'ADR-001.md', sha256: validSha },
        parsedVerifierOutput: {
            status: 'VERIFIED',
            total_checks: 1,
            passed_checks: 1,
            failed_checks: 0,
            checks: [{ id: 'CHK-01', property: 'Clean Architecture Dependency Invariant', status: 'PASS', passed: true }]
        },
        workspacePath: tempSandbox
    });

    assert.strictEqual(result.status, 'VERIFIED');
    assert.strictEqual(result.schemaVersion, '3.0.0');
    assert.strictEqual(result.producerId, 'AGENT_PRODUCER_TASK_RUNNER');
    assert.strictEqual(result.verifierId, 'skills/architecture/scripts/verify_architecture.js');
    assert.strictEqual(result.artifactHash, validSha);
    assert.strictEqual(result.provenance.commitSha, 'e81b412c2edd684ca7af3c1e5c6e53445b624624');
    console.log('  [PASS] 7. Fully independent and provenanced evidence record verified');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 7 Independent Evidence Contract Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try { fs.rmSync(tempSandbox, { recursive: true, force: true }); } catch (_) {}
}
