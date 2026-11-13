/**
 * @file verifier-engine.test.js
 * @description اختبارات آلة الحالات الصارمة ونزاهة الأنواع في محرك التحقق (Task 3 Regression Suite)
 * يغطي كافة السيناريوهات الـ 20 الإلزامية المنصوص عليها بدقة وحتمية
 */

const assert = require('assert');
const VerifierEngine = require('../verifier-engine');

console.log('======================================================');
console.log('🧪 Testing Hardened VerifierEngine (Task 3 Suite)');
console.log('======================================================');

// 1. All required checks PASS
console.log('>>> [1/20] Testing All Required Checks PASS...');
{
    const engine = new VerifierEngine('TestEngine-1', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Valid evidence 1', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: true, status: 'PASS', details: 'Valid evidence 2', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'VERIFIED');
    assert.strictEqual(report.exit_code, 0);
    assert.strictEqual(report.passed_checks, 2);
    console.log('  [PASS] 1. All required checks PASS verified');
}

// 2. One required PASS and one required SKIPPED
console.log('>>> [2/20] Testing One Required PASS and One Required SKIPPED...');
{
    const engine = new VerifierEngine('TestEngine-2', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Valid evidence 1', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'SKIPPED', details: 'Skipped reason', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'INCOMPLETE');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 2. Required SKIPPED yields INCOMPLETE (Exit code 1)');
}

// 3. One required PASS and one required NOT_RUN
console.log('>>> [3/20] Testing One Required PASS and One Required NOT_RUN...');
{
    const engine = new VerifierEngine('TestEngine-3', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Valid evidence 1', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'NOT_RUN', details: 'Never started', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'INCOMPLETE');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 3. Required NOT_RUN yields INCOMPLETE (Exit code 1)');
}

// 4. One required PASS and one required BLOCKED
console.log('>>> [4/20] Testing One Required PASS and One Required BLOCKED...');
{
    const engine = new VerifierEngine('TestEngine-4', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Valid evidence 1', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'BLOCKED', details: 'External block', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'BLOCKED');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 4. Required BLOCKED yields BLOCKED (Exit code 1)');
}

// 5. One required FAIL
console.log('>>> [5/20] Testing One Required FAIL...');
{
    const engine = new VerifierEngine('TestEngine-5', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Valid evidence 1', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'FAIL', details: 'Critical flaw', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'FAILED');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 5. Required FAIL yields FAILED (Exit code 1)');
}

// 6. One required ERROR
console.log('>>> [6/20] Testing One Required ERROR...');
{
    const engine = new VerifierEngine('TestEngine-6', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: false, status: 'ERROR', details: 'Execution fault', required: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'ERROR');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 6. Required ERROR yields ERROR (Exit code 1)');
}

// 7. All optional checks SKIPPED with required checks PASS
console.log('>>> [7/20] Testing All Optional Checks SKIPPED with Required PASS...');
{
    const engine = new VerifierEngine('TestEngine-7', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Evidence', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'SKIPPED', details: 'Optional feature skipped', required: false });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'VERIFIED');
    assert.strictEqual(report.exit_code, 0);
    console.log('  [PASS] 7. Optional SKIPPED allows VERIFIED');
}

// 8. No checks
console.log('>>> [8/20] Testing Zero Checks Fail-Closed...');
{
    const engine = new VerifierEngine('TestEngine-8', { quiet: true });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'INCOMPLETE');
    assert.strictEqual(report.exit_code, 1);
    console.log('  [PASS] 8. Zero checks yields INCOMPLETE (Exit code 1)');
}

// 9. Missing required evidence
console.log('>>> [9/20] Testing Missing Required Evidence...');
{
    const engine = new VerifierEngine('TestEngine-9', { quiet: true });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: '   ', required: true });
    }, err => err.code === 'MISSING_REQUIRED_EVIDENCE');
    console.log('  [PASS] 9. Missing required evidence throws error');
}

// 10. Invalid evidence structure / details empty for required positional
console.log('>>> [10/20] Testing Empty Evidence for Positional Record...');
{
    const engine = new VerifierEngine('TestEngine-10', { quiet: true });
    assert.throws(() => {
        engine.recordCheck('P1', true, '', 'HIGH', true);
    }, err => err.code === 'MISSING_REQUIRED_EVIDENCE');
    console.log('  [PASS] 10. Empty positional evidence throws error');
}

// 11. Duplicate check IDs
console.log('>>> [11/20] Testing Duplicate Check IDs...');
{
    const engine = new VerifierEngine('TestEngine-11', { quiet: true });
    engine.recordCheck({ id: 'CHK-DUP', property: 'P1', passed: true, status: 'PASS', details: 'evidence 1' });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-DUP', property: 'P2', passed: true, status: 'PASS', details: 'evidence 2' });
    }, err => err.code === 'DUPLICATE_CHECK_ID');
    console.log('  [PASS] 11. Duplicate check IDs rejected');
}

// 12. Invalid statuses
console.log('>>> [12/20] Testing Invalid Statuses...');
{
    const engine = new VerifierEngine('TestEngine-12', { quiet: true });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'UNKNOWN_STATUS', details: 'ev' });
    }, err => err.code === 'INVALID_CHECK_STATUS');
    console.log('  [PASS] 12. Invalid status rejected');
}

// 13. Contradictory status and passed values
console.log('>>> [13/20] Testing Contradictory Status & Passed Values...');
{
    const engine = new VerifierEngine('TestEngine-13', { quiet: true });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: false, status: 'PASS', details: 'ev' });
    }, err => err.code === 'STATUS_PASSED_CONTRADICTION');
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: true, status: 'FAIL', details: 'ev' });
    }, err => err.code === 'STATUS_PASSED_CONTRADICTION');
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-3', property: 'P3', passed: true, status: 'SKIPPED', details: 'ev' });
    }, err => err.code === 'STATUS_PASSED_CONTRADICTION');
    console.log('  [PASS] 13. Contradictions safely rejected');
}

// 14. String boolean values ("true", "false")
console.log('>>> [14/20] Testing String Boolean Rejection...');
{
    assert.throws(() => VerifierEngine.safeBoolean('true'), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    assert.throws(() => VerifierEngine.safeBoolean('false'), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    console.log('  [PASS] 14. String booleans rejected');
}

// 15. Numeric boolean values (1, 0)
console.log('>>> [15/20] Testing Numeric Boolean Rejection...');
{
    assert.throws(() => VerifierEngine.safeBoolean(1), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    assert.throws(() => VerifierEngine.safeBoolean(0), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    console.log('  [PASS] 15. Numeric booleans rejected');
}

// 16. Null and undefined boolean values
console.log('>>> [16/20] Testing Null/Undefined Boolean Rejection...');
{
    assert.throws(() => VerifierEngine.safeBoolean(null), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    assert.throws(() => VerifierEngine.safeBoolean(undefined), err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    console.log('  [PASS] 16. Null/undefined booleans rejected');
}

// 17. Optional check failure yields VERIFIED_WITH_WARNINGS
console.log('>>> [17/20] Testing Optional Check Failure...');
{
    const engine = new VerifierEngine('TestEngine-17', { quiet: true });
    engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'Required evidence', required: true });
    engine.recordCheck({ id: 'CHK-2', property: 'P2', passed: false, status: 'FAIL', details: 'Optional fail', required: false });
    const report = engine.evaluate();
    assert.strictEqual(report.status, 'VERIFIED_WITH_WARNINGS');
    assert.strictEqual(report.exit_code, 0);
    console.log('  [PASS] 17. Optional check failure yields VERIFIED_WITH_WARNINGS');
}

// 18. Required check missing from report
console.log('>>> [18/20] Testing Required Check Missing Result...');
{
    const engine = new VerifierEngine('TestEngine-18', { quiet: true });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-1', property: 'P1', details: 'No passed or status' });
    }, err => err.code === 'MISSING_CHECK_RESULT');
    console.log('  [PASS] 18. Missing check result throws error');
}

// 19. Incomplete execution with Monotonic metadata
console.log('>>> [19/20] Testing Monotonic Execution Metadata...');
{
    const engine = new VerifierEngine('TestEngine-19', { quiet: true });
    const c = engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'evidence', required: true });
    assert.strictEqual(c.execution_metadata.monotonic, true);
    assert.strictEqual(c.execution_metadata.executed, true);
    assert(typeof c.duration_ms === 'number' && c.duration_ms >= 0);
    console.log('  [PASS] 19. Monotonic metadata verified');
}

// 20. Invalid check required attribute non-boolean
console.log('>>> [20/20] Testing Invalid Required Attribute Coercion...');
{
    const engine = new VerifierEngine('TestEngine-20', { quiet: true });
    assert.throws(() => {
        engine.recordCheck({ id: 'CHK-1', property: 'P1', passed: true, status: 'PASS', details: 'ev', required: 'true' });
    }, err => err.code === 'STRICT_BOOLEAN_VIOLATION');
    console.log('  [PASS] 20. Non-boolean required attribute rejected');
}

console.log('======================================================');
console.log('>>> [SUCCESS] All 20 VerifierEngine Integrity Tests PASSED 100%.');
console.log('======================================================');
