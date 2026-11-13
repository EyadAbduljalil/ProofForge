/**
 * @file release-gate-fail-closed-matrix.test.js
 * @description مصفوفة الاختبارات العدائية لبوابة الاعتماد وإثبات السلوك المغلق عند الإخفاق
 * (ProofForge Release Gate Fail-Closed Verification Matrix)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const { FAILURE_CODES } = require('../../bin/release-gate');

console.log('======================================================');
console.log('🛡️  ProofForge — Release Gate Fail-Closed Matrix Tests');
console.log('======================================================');

const rootDir = path.resolve(__dirname, '../..');
const gateScript = path.join(rootDir, 'bin/release-gate.js');
const tempSandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-gate-matrix-'));

try {
    // ----------------------------------------------------
    // سيناريو 1: نجاح البوابة عندما يكون HEAD الحالي والبيانات سليمة
    // ----------------------------------------------------
    console.log('>>> [1/12] Testing Baseline Success with Real Valid HEAD & Evidence...');
    const validRes = spawnSync(process.execPath, [gateScript, '--json'], {
        cwd: rootDir,
        encoding: 'utf8'
    });
    assert.strictEqual(validRes.status, 0, `Valid release gate should pass: ${validRes.stderr || validRes.stdout}`);
    const validReport = JSON.parse(validRes.stdout);
    assert.strictEqual(validReport.gateStatus, 'CANDIDATE_READY_FOR_HUMAN_ACCEPTANCE');
    assert.strictEqual(validReport.decision, 'PASS_TO_MANUAL_ACCEPTANCE');
    console.log('  [PASS] 1. Baseline success verified with exit code 0');

    // ----------------------------------------------------
    // سيناريو 2: تعذر استخراج HEAD من Git في مجلد فارغ أو معزول
    // ----------------------------------------------------
    console.log('>>> [2/12] Testing Release Gate Fails Closed when HEAD is Unresolved...');
    const nonGitDir = path.join(tempSandbox, 'non-git-dir');
    fs.mkdirSync(nonGitDir, { recursive: true });
    // تشغيل كود الاستخراج في مجلد ليس مستودع Git وبدون متغيرات
    const unresolvedRes = spawnSync(process.execPath, ['-e', `
        delete process.env.GITHUB_SHA;
        const { resolveCurrentGitHead, FAILURE_CODES } = require('${gateScript.replace(/\\/g, '/')}');
        try {
            resolveCurrentGitHead('${nonGitDir.replace(/\\/g, '/')}');
            process.exit(0);
        } catch (e) {
            if (e.code === FAILURE_CODES.HEAD_UNRESOLVED) {
                process.exit(42);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8', env: {} });
    assert.strictEqual(unresolvedRes.status, 42);
    console.log('  [PASS] 2. Unresolved Git HEAD strictly throws RELEASE_HEAD_UNRESOLVED');

    // ----------------------------------------------------
    // سيناريو 3: مشوهية تجزئة HEAD (Malformed SHA)
    // ----------------------------------------------------
    console.log('>>> [3/12] Testing Rejection of Malformed Git HEAD SHA...');
    const malformedRes = spawnSync(process.execPath, ['-e', `
        const { resolveCurrentGitHead, FAILURE_CODES } = require('${gateScript.replace(/\\/g, '/')}');
        process.env.GITHUB_SHA = 'invalid-short-hash';
        try {
            resolveCurrentGitHead('${rootDir.replace(/\\/g, '/')}');
            process.exit(0);
        } catch (e) {
            if (e.code === FAILURE_CODES.HEAD_INVALID) {
                process.exit(43);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(malformedRes.status, 43);
    console.log('  [PASS] 3. Malformed Git HEAD strictly throws RELEASE_HEAD_INVALID');

    // ----------------------------------------------------
    // سيناريو 4: تعارض الـ Commit SHA بين الدليل و HEAD الحقيقي
    // ----------------------------------------------------
    console.log('>>> [4/12] Testing Rejection of Commit SHA Mismatch...');
    const mismatchEnv = { ...process.env, GITHUB_SHA: '1111111111111111111111111111111111111111' };
    const mismatchRes = spawnSync(process.execPath, [gateScript, '--json'], {
        cwd: rootDir,
        encoding: 'utf8',
        env: mismatchEnv
    });
    assert.strictEqual(mismatchRes.status, 1);
    const mismatchReport = JSON.parse(mismatchRes.stdout);
    const gate06 = mismatchReport.checks.find(c => c.id === 'GATE-06');
    assert.strictEqual(gate06.passed, false);
    assert.strictEqual(gate06.errorCode, FAILURE_CODES.COMMIT_MISMATCH);
    assert(gate06.error.includes('commitSha mismatch'));
    console.log('  [PASS] 4. Commit SHA mismatch strictly blocked with RELEASE_COMMIT_MISMATCH');

    // ----------------------------------------------------
    // سيناريو 5: تجزئة الـ Commit في ملف الدليل عبارة عن Placeholder
    // ----------------------------------------------------
    console.log('>>> [5/12] Testing Rejection of Placeholder Commit SHA in Evidence...');
    const fakeEvidenceDir = path.join(tempSandbox, 'fake-evidence');
    fs.mkdirSync(path.join(fakeEvidenceDir, 'docs/release'), { recursive: true });
    const placeholderEvidence = {
        commitSha: 'CURRENT_GIT_HEAD',
        suites: {}
    };
    fs.writeFileSync(path.join(fakeEvidenceDir, 'docs/release/FINAL_TEST_EVIDENCE.json'), JSON.stringify(placeholderEvidence), 'utf8');

    const placeholderRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        // تبديل مسار الدليل لفحص ملف الحاوية المؤقتة
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) {
                return '${JSON.stringify(placeholderEvidence)}';
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.EVIDENCE_INVALID && e.message.includes('placeholder')) {
                process.exit(44);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(placeholderRes.status, 44);
    console.log('  [PASS] 5. Placeholder commitSha in evidence strictly rejected');

    // ----------------------------------------------------
    // سيناريو 6: ملف الأدلة مفقود تماماً (EVIDENCE_MISSING)
    // ----------------------------------------------------
    console.log('>>> [6/12] Testing Rejection when Evidence File is Missing...');
    const missingEvidenceRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origExistsSync = fs.existsSync;
        fs.existsSync = function(p) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) return false;
            return origExistsSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.EVIDENCE_MISSING) {
                process.exit(45);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(missingEvidenceRes.status, 45);
    console.log('  [PASS] 6. Missing evidence file strictly throws RELEASE_EVIDENCE_MISSING');

    // ----------------------------------------------------
    // سيناريو 7: ملف الأدلة يحوي JSON تالف (EVIDENCE_INVALID)
    // ----------------------------------------------------
    console.log('>>> [7/12] Testing Rejection when Evidence File Contains Corrupted JSON...');
    const corruptEvidenceRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) return '{ corrupted json ... ';
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.EVIDENCE_INVALID) {
                process.exit(46);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(corruptEvidenceRes.status, 46);
    console.log('  [PASS] 7. Corrupt JSON in evidence strictly throws RELEASE_EVIDENCE_INVALID');

    // ----------------------------------------------------
    // سيناريو 8: غياب مجموعة اختبارات إلزامية (REQUIRED_CHECK_MISSING)
    // ----------------------------------------------------
    console.log('>>> [8/12] Testing Rejection when Mandatory Suite is Missing in Evidence...');
    const missingSuiteRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) {
                const real = JSON.parse(origReadFileSync.apply(this, arguments));
                delete real.suites.skills_behavioral_validation;
                return JSON.stringify(real);
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.REQUIRED_CHECK_MISSING) {
                process.exit(47);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(missingSuiteRes.status, 47);
    console.log('  [PASS] 8. Missing mandatory test suite strictly throws RELEASE_REQUIRED_CHECK_MISSING');

    // ----------------------------------------------------
    // سيناريو 9: احتواء مجموعة اختبارات على إخفاقات (REQUIRED_CHECK_FAILED)
    // ----------------------------------------------------
    console.log('>>> [9/12] Testing Rejection when a Test Suite Contains Failed Checks...');
    const failedSuiteRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) {
                const real = JSON.parse(origReadFileSync.apply(this, arguments));
                real.suites.multi_skill_real_execution.failedChecks = 1;
                return JSON.stringify(real);
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.REQUIRED_CHECK_FAILED) {
                process.exit(48);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(failedSuiteRes.status, 48);
    console.log('  [PASS] 9. Suite with failed checks strictly throws RELEASE_REQUIRED_CHECK_FAILED');

    // ----------------------------------------------------
    // سيناريو 10: ادعاء نجاح PASS لمعيار كفاءة الوكلاء دون تنفيذ حقيقي
    // ----------------------------------------------------
    console.log('>>> [10/12] Testing Rejection when Agent A/B Benchmark Claims Fabricated PASS...');
    const fakePassRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) {
                const real = JSON.parse(origReadFileSync.apply(this, arguments));
                real.suites.agent_effectiveness_ab_benchmark = { status: 'PASS' };
                return JSON.stringify(real);
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.INDEPENDENT_VERIFICATION_MISSING) {
                process.exit(49);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(fakePassRes.status, 49);
    console.log('  [PASS] 10. Fabricated PASS on unexecuted A/B benchmark strictly rejected');

    // ----------------------------------------------------
    // سيناريو 11: تدقيق التبعيات يحوي ثغرات أمنية حرجة
    // ----------------------------------------------------
    console.log('>>> [11/12] Testing Rejection when Dependency Audit Contains Critical Vulnerabilities...');
    const vulnRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check06 = gate.checks.find(c => c.id === 'GATE-06');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('FINAL_TEST_EVIDENCE.json')) {
                const real = JSON.parse(origReadFileSync.apply(this, arguments));
                real.suites.dependency_security_audit.vulnerabilities.critical = 1;
                return JSON.stringify(real);
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check06.verify();
            process.exit(0);
        } catch (e) {
            if (e.code === gate.FAILURE_CODES.REQUIRED_CHECK_FAILED) {
                process.exit(50);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(vulnRes.status, 50);
    console.log('  [PASS] 11. Critical vulnerabilities strictly block release approval');

    // ----------------------------------------------------
    // سيناريو 12: محاولة تزييف بنود القبول البشري في MANUAL_ACCEPTANCE_CHECKLIST.md
    // ----------------------------------------------------
    console.log('>>> [12/12] Testing Rejection of Falsely Certified Human Acceptance Checklist...');
    const fakeHumanRes = spawnSync(process.execPath, ['-e', `
        const gate = require('${gateScript.replace(/\\/g, '/')}');
        const check07 = gate.checks.find(c => c.id === 'GATE-07');
        const fs = require('fs');
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = function(p, enc) {
            if (p.includes('MANUAL_ACCEPTANCE_CHECKLIST.md')) {
                return '### [HUMAN-01] Antigravity Live Test: PASS';
            }
            return origReadFileSync.apply(this, arguments);
        };
        try {
            check07.verify();
            process.exit(0);
        } catch (e) {
            if (e.message.includes('falsely marked')) {
                process.exit(51);
            }
            process.exit(1);
        }
    `], { encoding: 'utf8' });
    assert.strictEqual(fakeHumanRes.status, 51);
    console.log('  [PASS] 12. Falsely checked human acceptance items strictly blocked');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 12 Release Gate Fail-Closed Scenarios PASSED 100%.');
    console.log('======================================================');
} finally {
    try { fs.rmSync(tempSandbox, { recursive: true, force: true }); } catch (_) {}
}
