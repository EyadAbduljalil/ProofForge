/**
 * @file verifier-engine.test.js
 * @description اختبارات النزاهة الهندسية والحماية لمحرك التحقق المعياري (Verifier Engine Integrity Suite)
 */

'use strict';

const assert = require('assert');
const VerifierEngine = require('../verifier-engine');

console.log('======================================================');
console.log('🧪 Testing Hardened VerifierEngine (Phase 1)');
console.log('======================================================');

// 1. اختبار منع ثغرات التحويل القسري للقيم المنطقية (Anti-Boolean Coercion)
console.log('>>> [1/7] Testing Anti-Boolean Coercion Protection...');
assert.strictEqual(VerifierEngine.safeBoolean(true), true);
assert.strictEqual(VerifierEngine.safeBoolean(false), false);
assert.strictEqual(VerifierEngine.safeBoolean('false'), false);
assert.strictEqual(VerifierEngine.safeBoolean('0'), false);
assert.strictEqual(VerifierEngine.safeBoolean(0), false);
assert.strictEqual(VerifierEngine.safeBoolean('true'), true);
assert.strictEqual(VerifierEngine.safeBoolean('1'), true);
assert.strictEqual(VerifierEngine.safeBoolean(1), true);

assert.throws(() => {
    VerifierEngine.safeBoolean('invalid-value');
}, /Invalid boolean specification/);
console.log('  [PASS] Anti-Boolean coercion verified');

// 2. اختبار رفض التناقض الصريح بين الحالة والقيمة المنطقية
console.log('>>> [2/7] Testing Contradiction Detection...');
const v1 = new VerifierEngine('test-contradiction', { json: true });
assert.throws(() => {
    v1.recordCheck({ id: 'CHK-1', status: 'PASS', passed: false });
}, /Contradiction detected/);
assert.throws(() => {
    v1.recordCheck({ id: 'CHK-2', status: 'FAIL', passed: true });
}, /Contradiction detected/);
console.log('  [PASS] Status/Passed contradiction detection verified');

// 3. اختبار رفض تكرار معرفات الفحص (Duplicate Check IDs)
console.log('>>> [3/7] Testing Duplicate Check ID Rejection...');
const v2 = new VerifierEngine('test-dup-id', { json: true });
v2.recordCheck({ id: 'UNIQUE-ID-1', status: 'PASS', passed: true });
assert.throws(() => {
    v2.recordCheck({ id: 'UNIQUE-ID-1', status: 'PASS', passed: true });
}, /Duplicate check identifier rejected/);
console.log('  [PASS] Duplicate check ID rejection verified');

// 4. اختبار حظر الفشل المفتوح عند تخطي كافة الفحوصات (All-Skipped False Positive Defense)
console.log('>>> [4/7] Testing All-Skipped Fail-Closed Protection...');
const v3 = new VerifierEngine('test-all-skipped', { json: true });
v3.recordCheck({ id: 'CHK-SKIP-1', status: 'SKIPPED', passed: false, details: 'Optional feature not present' });
v3.recordCheck({ id: 'CHK-SKIP-2', status: 'SKIPPED', passed: false, details: 'Environment not configured' });
const rep3 = v3.evaluate();
assert.strictEqual(rep3.status, 'SKIPPED', 'Status must be SKIPPED when all checks are skipped');
assert.strictEqual(rep3.exit_code, 1, 'Exit code must be 1 (fail-closed) when zero checks passed');
console.log('  [PASS] All-skipped checks fail-closed verified (Exit code 1)');

// 5. اختبار حظر الصفر فحوصات (Zero Checks Defense)
console.log('>>> [5/7] Testing Zero Checks Fail-Closed Protection...');
const v4 = new VerifierEngine('test-zero-checks', { json: true });
const rep4 = v4.evaluate();
assert.strictEqual(rep4.status, 'NOT_RUN');
assert.strictEqual(rep4.exit_code, 1);
console.log('  [PASS] Zero-checks fail-closed verified (Exit code 1)');

// 6. اختبار دقة قياس المدة الزمنية بالساعة الرتيبة (Monotonic Timing)
console.log('>>> [6/7] Testing Monotonic Duration Measurement...');
const v5 = new VerifierEngine('test-timing', { json: true });
v5.recordCheck({ id: 'CHK-TIME-1', status: 'PASS', passed: true });
const rep5 = v5.evaluate();
assert(typeof rep5.duration_ms === 'number' && rep5.duration_ms >= 0, 'Duration must be a valid non-negative number');
console.log(`  [PASS] Monotonic timing verified (Duration: ${rep5.duration_ms}ms)`);

// 7. اختبار النجاح الصريح بالأدلة الحقيقية
console.log('>>> [7/7] Testing Genuine Passing Evaluation...');
const v6 = new VerifierEngine('test-valid-pass', { json: true });
v6.recordCheck({ id: 'CHK-VALID-1', status: 'PASS', passed: true, details: 'Asset verified' });
v6.recordCheck({ id: 'CHK-VALID-2', status: 'PASS', passed: true, details: 'Syntax verified' });
const rep6 = v6.evaluate();
assert.strictEqual(rep6.status, 'VERIFIED');
assert.strictEqual(rep6.exit_code, 0);
assert.strictEqual(rep6.passed_checks, 2);
assert.strictEqual(rep6.failed_checks, 0);
console.log('  [PASS] Genuine passing evaluation verified (Exit code 0)');

console.log('======================================================');
console.log('>>> [SUCCESS] All VerifierEngine Integrity Tests PASSED 100%.');
console.log('======================================================');
