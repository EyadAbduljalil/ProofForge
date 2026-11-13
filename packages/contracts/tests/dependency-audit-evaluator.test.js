/**
 * @file dependency-audit-evaluator.test.js
 * @description اختبارات التحقق العدائي لمقيّم أمان التبعيات (Fail-Closed Adversarial Tests)
 */

'use strict';

const assert = require('assert');
const DependencyAuditEvaluator = require('../dependency-audit-evaluator');

console.log('======================================================');
console.log('🛡️ Testing Dependency Audit Evaluator (Fail-Closed Matrix)');
console.log('======================================================');

// 1. كائن مفقود
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution(null);
}, /Missing execution result/);
console.log('  [PASS] 1. Rejects missing execution result');

// 2. خطأ تشغيل (ENOENT)
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ error: { code: 'ENOENT', message: 'spawn npm ENOENT' } });
}, /npm executable missing\/ENOENT/);
console.log('  [PASS] 2. Rejects missing executable / ENOENT');

// 3. تجاوز المهلة (ETIMEDOUT)
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ error: { code: 'ETIMEDOUT', message: 'timed out' } });
}, /Process execution timeout/);
console.log('  [PASS] 3. Rejects timeout / ETIMEDOUT');

// 4. إنهاء بإشارة نظام (SIGTERM)
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ signal: 'SIGTERM' });
}, /SIGTERM timeout/);
console.log('  [PASS] 4. Rejects SIGTERM termination');

// 5. مخرجات فارغة
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ status: 0, stdout: '   ', stderr: 'empty' });
}, /Empty stdout/);
console.log('  [PASS] 5. Rejects empty stdout');

// 6. JSON مشوه
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ status: 0, stdout: '{ invalid json', stderr: '' });
}, /invalid JSON/i);
console.log('  [PASS] 6. Rejects malformed JSON');

// 7. مفقود metadata.vulnerabilities
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ status: 0, stdout: JSON.stringify({ auditReportVersion: 2 }), stderr: '' });
}, /metadata\.vulnerabilities/);
console.log('  [PASS] 7. Rejects missing metadata.vulnerabilities');

// 8. فئة مفقودة في الثغرات
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({
        status: 0,
        stdout: JSON.stringify({ metadata: { vulnerabilities: { critical: 0, high: 0 } } })
    });
}, /عدد الثغرات لفئة 'moderate'/);
console.log('  [PASS] 8. Rejects missing vulnerability categories');

// 9. أعداد سالبة
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({
        status: 0,
        stdout: JSON.stringify({ metadata: { vulnerabilities: { critical: -1, high: 0, moderate: 0, low: 0, info: 0 } } })
    });
}, /غير صالح أو سالب/);
console.log('  [PASS] 9. Rejects negative vulnerability counts');

// 10. أعداد غير صحيحة (كسور)
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({
        status: 0,
        stdout: JSON.stringify({ metadata: { vulnerabilities: { critical: 2.5, high: 0, moderate: 0, low: 0, info: 0 } } })
    });
}, /غير صالح أو سالب أو ليس عدداً صحيحاً/);
console.log('  [PASS] 10. Rejects non-integer vulnerability counts');

// 11. تقرير صالح مع صفر ثغرات (اجتياز تام)
const zeroVulnRes = DependencyAuditEvaluator.evaluateAuditExecution({
    status: 0,
    stdout: JSON.stringify({
        metadata: {
            vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: 0 },
            dependencies: { total: 15 }
        }
    })
});
assert.strictEqual(zeroVulnRes.status, 'PASS');
assert.strictEqual(zeroVulnRes.isPolicyCompliant, true);
assert.strictEqual(zeroVulnRes.policyViolations.length, 0);
console.log('  [PASS] 11. Approves valid report with zero vulnerabilities');

// 12. تقرير مع ثغرة عالية (فشل السياسة رغم صحة التقرير)
const highVulnRes = DependencyAuditEvaluator.evaluateAuditExecution({
    status: 1, // npm audit returns 1 when vulnerabilities found
    stdout: JSON.stringify({
        metadata: {
            vulnerabilities: { critical: 0, high: 2, moderate: 1, low: 0, info: 0, total: 3 }
        }
    })
});
assert.strictEqual(highVulnRes.status, 'FAIL');
assert.strictEqual(highVulnRes.isPolicyCompliant, false);
assert(highVulnRes.policyViolations.some(v => v.includes('عالية الخطورة')));
console.log('  [PASS] 12. Rejects valid report with high vulnerabilities');

// 13. تقرير مع ثغرة حرجة (فشل السياسة الحتمية)
const critVulnRes = DependencyAuditEvaluator.evaluateAuditExecution({
    status: 1,
    stdout: JSON.stringify({
        metadata: {
            vulnerabilities: { critical: 1, high: 0, moderate: 0, low: 0, info: 0, total: 1 }
        }
    })
});
assert.strictEqual(critVulnRes.status, 'FAIL');
assert.strictEqual(critVulnRes.isPolicyCompliant, false);
assert(critVulnRes.policyViolations.some(v => v.includes('ثغرة حرجة')));
console.log('  [PASS] 13. Rejects valid report with critical vulnerabilities');

// 14. كود خروج غير صفري مع مخرجات مشوهة
assert.throws(() => {
    DependencyAuditEvaluator.evaluateAuditExecution({ status: 1, stdout: 'npm ERR! code ENOLOCK', stderr: 'No lockfile' });
}, /invalid JSON/i);
console.log('  [PASS] 14. Rejects non-zero exit with malformed error output');

console.log('======================================================');
console.log('>>> [SUCCESS] All 14 Dependency Audit Evaluator Tests PASSED 100%.');
console.log('======================================================');
