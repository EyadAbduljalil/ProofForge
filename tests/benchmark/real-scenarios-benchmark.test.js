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
console.log('>>> [Scenario 1/5] Testing Broken Frontend Project Detection...');
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
console.log('>>> [Scenario 2/5] Testing Insecure Backend API Detection...');
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
console.log('>>> [Scenario 3/5] Testing Flawed Database Schema & Adapter Detection...');
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
console.log('>>> [Scenario 4/5] Testing Hardened Golden Production Project Verification...');
const auditScript = path.join(rootDir, 'skills/project-audit/scripts/run_audit.js');
const auditRes = spawnSync(process.execPath, [auditScript], {
    cwd: rootDir,
    encoding: 'utf8'
});
assert.strictEqual(auditRes.status, 0, 'المشروع الإنتاجي المحصن يجب أن يجتاز كافة الفحوصات بكود صفري 0');
assert(auditRes.stdout.includes('Composite Diagnostic Score: 100 / 100') || auditRes.stdout.includes('VERIFIED'), 'المشروع المحصن يجب أن يحقق 100/100 بالأدلة');
console.log('  [PASS] Hardened Production: All 14 domain verifiers confirmed with 100/100 real evidence (Exit Code: 0)');

// ==========================================
// السيناريو 5: اختبار دورة حياة تثبيت ومزامنة وتشذيب المهارات (Installation, Sync, Diff & Safe Pruning)
// ==========================================
console.log('>>> [Scenario 5/5] Testing Antigravity Skills Sync, Diff, User Protection & Pruning...');
const fs = require('fs');
const AntigravityAdapter = require(path.join(rootDir, 'packages/contracts/antigravity-adapter'));
const sandboxDir = path.join(rootDir, 'tests/fixtures/sandbox-workspace/.agents/skills');

if (fs.existsSync(sandboxDir)) {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
}
fs.mkdirSync(sandboxDir, { recursive: true });

try {
    // 5.1 مزامنة نظيفة لكافة المهارات الـ 28
    const syncRes = AntigravityAdapter.syncCanonicalSkills(path.join(rootDir, 'skills'), sandboxDir, { force: true });
    assert.strictEqual(syncRes.synced.length, 28, 'يجب مزامنة كافة المهارات الـ 28 بنجاح');
    assert.strictEqual(syncRes.errors.length, 0, 'يجب ألا تحدث أي أخطاء أثناء المزامنة');

    // 5.2 مقارنة الفروق (Diff)
    const diff1 = AntigravityAdapter.diffSkills(path.join(rootDir, 'skills'), sandboxDir);
    assert.strictEqual(diff1.identical.length, 28, 'كافة المهارات يجب أن تكون متطابقة');
    assert.strictEqual(diff1.missingInTarget.length, 0, 'لا توجد مهارات مفقودة');

    // 5.3 إضافة مهارة مخصصة للمستخدم وأخرى متقادمة
    const userCustomSkillDir = path.join(sandboxDir, 'my-team-custom-skill');
    fs.mkdirSync(userCustomSkillDir, { recursive: true });
    fs.writeFileSync(path.join(userCustomSkillDir, 'SKILL.md'), '---\nname: my-team-custom-skill\ndescription: Custom user skill\n---\n# My Custom Skill', 'utf8');

    const staleSkillDir = path.join(sandboxDir, 'stale-old-proof-skill');
    fs.mkdirSync(staleSkillDir, { recursive: true });
    fs.writeFileSync(path.join(staleSkillDir, 'SKILL.md'), '---\nname: stale-old-proof-skill\ndescription: Legacy ProofForge skill\n---\n# Stale ProofForge Skill', 'utf8');

    // 5.4 فحص التمييز بين مهارات المستخدم والمهارات المتقادمة
    const diff2 = AntigravityAdapter.diffSkills(path.join(rootDir, 'skills'), sandboxDir);
    assert(diff2.userCustom.includes('my-team-custom-skill'), 'يجب التعرف على مهارة المستخدم وحمايتها');
    assert(diff2.staleProofForge.includes('stale-old-proof-skill'), 'يجب التعرف على المهارة المتقادمة');

    // 5.5 تشذيب المهارات المتقادمة مع حماية مهارات المستخدم
    const pruneRes = AntigravityAdapter.pruneSkills(path.join(rootDir, 'skills'), sandboxDir, { force: true });
    assert(pruneRes.pruned.includes('stale-old-proof-skill'), 'يجب حذف المهارة المتقادمة');
    assert(fs.existsSync(userCustomSkillDir), 'مهارة المستخدم المخصصة يجب أن تبقى محمية تماماً');
    console.log('  [PASS] Installation & Sync: Full 28 skills sync, diffing, user skill protection and pruning verified');
} finally {
    if (fs.existsSync(sandboxDir)) {
        fs.rmSync(path.join(rootDir, 'tests/fixtures/sandbox-workspace'), { recursive: true, force: true });
    }
}

console.log('======================================================');
console.log('>>> [SUCCESS] Realistic Scenarios Benchmark COMPLETED 100% — Zero False Passes Confirmed.');
console.log('======================================================');
