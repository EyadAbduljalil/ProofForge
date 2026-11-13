/**
 * @file structured-test-report-parser.test.js
 * @description اختبارات التحقق العدائي لمحلل تقارير الاختبارات الهيكلية (Structured Report Parser Adversarial Tests)
 */

'use strict';

const assert = require('assert');
const StructuredTestReportParser = require('../structured-test-report-parser');

console.log('======================================================');
console.log('📊 Testing Structured Test Report Parser (Fail-Closed Matrix)');
console.log('======================================================');

// 1. مفقود مخرج التنفيذ
assert.throws(() => {
    StructuredTestReportParser.parseTapReport(null, { suiteName: 'Missing Suite' });
}, /Missing execution result/);
console.log('  [PASS] 1. Rejects missing execution result');

// 2. خطأ في العملية
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ error: new Error('Command failed') });
}, /خطأ في تشغيل جناح/);
console.log('  [PASS] 2. Rejects process execution error');

// 3. إنهاء بإشارة
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ signal: 'SIGKILL' });
}, /تم إنهاء تشغيل.*بإشارة/);
console.log('  [PASS] 3. Rejects signal termination');

// 4. عدم اتساق حسابي في تقرير TAP
const inconsistentTap = `
TAP version 13
ok 1 - test a
ok 2 - test b
# tests 10
# pass 2
# fail 0
# duration_ms 5
`;
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ status: 0, stdout: inconsistentTap });
}, /عدم اتساق حسابي/);
console.log('  [PASS] 4. Rejects arithmetic inconsistency in TAP summary');

// 5. تقرير TAP مع صفر اختبارات لجناح إلزامي
const zeroTap = `
TAP version 13
# tests 0
# pass 0
# fail 0
`;
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ status: 0, stdout: zeroTap }, { mandatory: true });
}, /Zero tests reported/);
console.log('  [PASS] 5. Rejects zero-test reports when tests are mandatory');

// 6. تعارض: كود 0 مع وجود اختبارات فاشلة في TAP
const exit0WithFails = `
TAP version 13
ok 1 - passed
not ok 2 - failed
# tests 2
# pass 1
# fail 1
`;
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ status: 0, stdout: exit0WithFails });
}, /تعارض.*exit 0.*فاشلة/);
console.log('  [PASS] 6. Rejects exitCode 0 when failures exist in TAP report');

// 7. تعارض: كود 1 بدون أي اختبارات فاشلة في TAP
const exit1WithZeroFails = `
TAP version 13
ok 1 - passed
# tests 1
# pass 1
# fail 0
`;
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ status: 1, stdout: exit1WithZeroFails });
}, /تعارض.*رمز خطأ/);
console.log('  [PASS] 7. Rejects exitCode 1 when zero failures exist in TAP report');

// 8. تقرير TAP صالح ومتسق بنسبة 100%
const validTap = `
TAP version 13
ok 1 - test 1
ok 2 - test 2
# tests 2
# pass 2
# fail 0
# cancelled 0
# skipped 0
# todo 0
`;
const parsedTap = StructuredTestReportParser.parseTapReport({ status: 0, stdout: validTap });
assert.strictEqual(parsedTap.status, 'PASS');
assert.strictEqual(parsedTap.total, 2);
assert.strictEqual(parsedTap.passed, 2);
assert.strictEqual(parsedTap.failed, 0);
assert.strictEqual(parsedTap.reportFormat, 'TAP_V13');
console.log('  [PASS] 8. Approves valid consistent TAP v13 report');

// 9. تقرير الأسطر الهيكلية المنظمة الصالحة
const structuredLines = `
>>> Checking Invariants
  [PASS] 1. package.json valid
  [PASS] 2. lockfile valid
>>> Success
`;
const parsedLines = StructuredTestReportParser.parseTapReport({ status: 0, stdout: structuredLines });
assert.strictEqual(parsedLines.status, 'PASS');
assert.strictEqual(parsedLines.total, 2);
assert.strictEqual(parsedLines.passed, 2);
assert.strictEqual(parsedLines.failed, 0);
assert.strictEqual(parsedLines.reportFormat, 'STRUCTURED_INVARIANT_LINES');
console.log('  [PASS] 9. Approves valid structured invariant lines');

// 10. تعارض الأسطر الهيكلية: كود 0 مع وجود [FAIL]
const structuredWithFail = `
  [PASS] 1. ok
  [FAIL] 2. failed check
`;
assert.throws(() => {
    StructuredTestReportParser.parseTapReport({ status: 0, stdout: structuredWithFail });
}, /خرجت عملية.*بكود 0 لكنها سجلت 1 فحوصات فاشلة/);
console.log('  [PASS] 10. Rejects exitCode 0 when structured failures exist');

console.log('======================================================');
console.log('>>> [SUCCESS] All 10 Structured Test Report Parser Tests PASSED 100%.');
console.log('======================================================');
