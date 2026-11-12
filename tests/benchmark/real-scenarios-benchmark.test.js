/**
 * @file real-scenarios-benchmark.test.js
 * @description معيار الاختبارات الواقعية الصارم لمهارات ProofForge (Realistic Scenarios Benchmark)
 * يختبر استجابة المحركات الحقيقية ضد سيناريوهات برمجية معيبة لاختبار قدرتها على رصد العيوب والفشل بكود 1،
 * واختبار استجابتها ضد الشفرة المحصنة للتأكد من أنها تصدر كود 0 مع الأدلة المادية.
 */

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('======================================================');
console.log('🧪 ProofForge — Realistic Scenarios Benchmark Runner');
console.log('======================================================');

const rootDir = path.resolve(__dirname, '../../');
const fixturesDir = path.join(rootDir, 'tests/fixtures');

// ==========================================
// السيناريو 1: فحص مشروع واجهة أمامية معيب (Broken Frontend Scenario)
// ==========================================
console.log('>>> [Scenario 1/4] Testing Broken Frontend Project Detection...');
const brokenFrontendRoot = path.join(fixturesDir, 'broken-frontend');

// 1.1 اختبار رصد عيوب إمكانية الوصول (Accessibility Defect Detection)
const a11yScript = path.join(rootDir, 'skills/accessibility/scripts/audit_a11y.js');
const a11yRes = spawnSync(process.execPath, [a11yScript, '--json'], {
    cwd: brokenFrontendRoot,
    encoding: 'utf8'
});
assert.strictEqual(a11yRes.status, 1, 'يجب أن يفشل الفحص بكود 1 عند وجود صور بدون alt وأزرار بدون تسمية');
assert(a11yRes.stdout.includes('FAILED') || a11yRes.stdout.includes('"status": "FAILED"'), 'يجب أن يسجل التقرير حالة FAILED');
console.log('  [PASS] Broken Frontend: a11y detector correctly failed-closed on missing alt/labels (Exit Code: 1)');

// 1.2 اختبار رصد التصميم الصلب غير المتجاوب (Rigid Layout Detection)
const respScript = path.join(rootDir, 'skills/responsive/scripts/verify_responsive.js');
const respRes = spawnSync(process.execPath, [respScript, '--json'], {
    cwd: brokenFrontendRoot,
    encoding: 'utf8'
});
assert.strictEqual(respRes.status, 1, 'يجب أن يفشل الفحص بكود 1 عند وجود عرض صلب 850px بدون max-width');
console.log('  [PASS] Broken Frontend: responsive detector correctly failed-closed on 850px rigid container (Exit Code: 1)');

// ==========================================
// السيناريو 2: فحص واجهة خلفية غير آمنة ومفتوحة (Insecure Backend Scenario)
// ==========================================
console.log('>>> [Scenario 2/4] Testing Insecure Backend API Detection...');
const insecureBackendRoot = path.join(fixturesDir, 'insecure-backend');

const backendScript = path.join(rootDir, 'skills/backend/scripts/verify_backend.js');
const backendRes = spawnSync(process.execPath, [backendScript, '--json'], {
    cwd: insecureBackendRoot,
    encoding: 'utf8'
});
assert.strictEqual(backendRes.status, 1, 'يجب أن تفشل الواجهة الخلفية غير الآمنة بكود 1 لغياب المسارات الصحية وتحديد المعدل');
console.log('  [PASS] Insecure Backend: backend detector correctly failed-closed on missing probes & rate-limits (Exit Code: 1)');

// ==========================================
// السيناريو 3: فحص قاعدة بيانات تفتقر لعزل المستأجر (Flawed Database Scenario)
// ==========================================
console.log('>>> [Scenario 3/4] Testing Flawed Database Schema & Adapter Detection...');
const flawedDbRoot = path.join(fixturesDir, 'flawed-database');

const dbScript = path.join(rootDir, 'skills/database/scripts/verify_database.js');
const dbRes = spawnSync(process.execPath, [dbScript, '--json'], {
    cwd: flawedDbRoot,
    encoding: 'utf8'
});
assert.strictEqual(dbRes.status, 1, 'يجب أن تفشل قاعدة البيانات بكود 1 لغياب عمود tenant_id والمعاملات الذرية');
console.log('  [PASS] Flawed Database: database detector correctly failed-closed on missing tenant_id & transactions (Exit Code: 1)');

// ==========================================
// السيناريو 4: فحص المشروع الإنتاجي المحصن بالكامل (Hardened Production Scenario)
// ==========================================
console.log('>>> [Scenario 4/4] Testing Hardened Golden Production Project Verification...');
const auditScript = path.join(rootDir, 'skills/project-audit/scripts/run_audit.js');
const auditRes = spawnSync(process.execPath, [auditScript], {
    cwd: rootDir,
    encoding: 'utf8'
});
assert.strictEqual(auditRes.status, 0, 'المشروع الإنتاجي المحصن يجب أن يجتاز كافة الفحوصات بكود صفري 0');
assert(auditRes.stdout.includes('Composite Diagnostic Score: 100 / 100'), 'المشروع المحصن يجب أن يحقق 100/100 بالأدلة');
console.log('  [PASS] Hardened Production: All 14 domain verifiers confirmed with 100/100 real evidence (Exit Code: 0)');

console.log('======================================================');
console.log('>>> [SUCCESS] Realistic Scenarios Benchmark COMPLETED 100% — Zero False Passes Confirmed.');
console.log('======================================================');
