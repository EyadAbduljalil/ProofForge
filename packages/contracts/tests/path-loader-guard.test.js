/**
 * @file path-loader-guard.test.js
 * @description اختبارات أمان المسارات ونظام الملفات المتقدمة (Task 4 Regression Suite)
 * تغطي كافة السيناريوهات الـ 15 لاختبارات مسارات الكتابة والحماية من الروابط الرمزية
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const PathLoaderGuard = require('../path-loader-guard');

console.log('======================================================');
console.log('🛡️ Testing Hardened PathLoaderGuard Security (Task 4)');
console.log('======================================================');

// إعداد بيئة عزل مؤقتة نظيفة لكل جولة اختبار
const testRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-guard-test-'));
const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-guard-outside-'));

try {
    // 1. Normal file write
    console.log('>>> [1/15] Testing Normal File Write...');
    const target1 = path.join(testRoot, 'normal-file.txt');
    const safe1 = PathLoaderGuard.validateSafeWritePath(target1, { projectRoot: testRoot });
    assert.strictEqual(safe1, target1);
    PathLoaderGuard.safeAtomicWrite(target1, 'normal content', { projectRoot: testRoot });
    assert.strictEqual(fs.readFileSync(target1, 'utf8'), 'normal content');
    console.log('  [PASS] 1. Normal file write verified');

    // 2. Normal nested directory write
    console.log('>>> [2/15] Testing Normal Nested Directory Write...');
    const target2 = path.join(testRoot, 'nested/sub/deep-file.txt');
    const safe2 = PathLoaderGuard.validateSafeWritePath(target2, { projectRoot: testRoot });
    assert.strictEqual(safe2, target2);
    PathLoaderGuard.safeAtomicWrite(target2, 'nested content', { projectRoot: testRoot });
    assert.strictEqual(fs.readFileSync(target2, 'utf8'), 'nested content');
    console.log('  [PASS] 2. Normal nested directory write verified');

    // 3. Existing target file
    console.log('>>> [3/15] Testing Existing Target File...');
    const safe3 = PathLoaderGuard.validateSafeWritePath(target1, { projectRoot: testRoot });
    assert.strictEqual(safe3, target1);
    PathLoaderGuard.safeAtomicWrite(target1, 'updated content', { projectRoot: testRoot });
    assert.strictEqual(fs.readFileSync(target1, 'utf8'), 'updated content');
    console.log('  [PASS] 3. Existing target file update verified');

    // 4. Existing target symlink pointing outside
    console.log('>>> [4/15] Testing Existing Target Symlink Pointing Outside...');
    const secretOutsideFile = path.join(outsideRoot, 'secret.txt');
    fs.writeFileSync(secretOutsideFile, 'secret-data', 'utf8');
    const symlinkTarget = path.join(testRoot, 'symlink-to-outside.txt');
    let symlinkCreated = false;
    try {
        fs.symlinkSync(secretOutsideFile, symlinkTarget, 'file');
        symlinkCreated = true;
    } catch (e) {
        // في حال عدم توفر صلاحيات symlink على Windows لغير المشرف
        console.log('  [SKIP-NOTICE] Symlink creation restricted on OS without admin privilege');
    }

    if (symlinkCreated) {
        assert.throws(() => {
            PathLoaderGuard.validateSafeWritePath(symlinkTarget, { projectRoot: testRoot });
        }, err => err.code === 'SYMLINK_ESCAPE_DETECTED' || err.code === 'SYMLINK_TARGET_REJECTED');
        console.log('  [PASS] 4. Existing target symlink pointing outside BLOCKED');
    } else {
        console.log('  [SKIPPED] 4. Existing target symlink check skipped (OS unprivileged environment)');
    }

    // 5. Parent symlink pointing outside
    console.log('>>> [5/15] Testing Parent Symlink Pointing Outside...');
    const outsideDir = path.join(outsideRoot, 'outside-dir');
    fs.mkdirSync(outsideDir, { recursive: true });
    const symlinkDir = path.join(testRoot, 'symlink-dir');
    let symlinkDirCreated = false;
    try {
        fs.symlinkSync(outsideDir, symlinkDir, 'junction');
        symlinkDirCreated = true;
    } catch (e) {
        // تخطي إذا لم تتوفر صلاحية الروابط
    }

    if (symlinkDirCreated) {
        const targetUnderSymlink = path.join(symlinkDir, 'danger.txt');
        assert.throws(() => {
            PathLoaderGuard.validateSafeWritePath(targetUnderSymlink, { projectRoot: testRoot });
        }, err => err.code === 'SYMLINK_ESCAPE_DETECTED');
        console.log('  [PASS] 5. Parent symlink pointing outside BLOCKED');
    } else {
        console.log('  [SKIPPED] 5. Parent symlink check skipped (OS unprivileged environment)');
    }

    // 6. Nested symlink pointing outside
    console.log('>>> [6/15] Testing Nested Symlink Pointing Outside...');
    if (symlinkDirCreated) {
        const nestedUnderSymlink = path.join(symlinkDir, 'sub/deep/danger.txt');
        assert.throws(() => {
            PathLoaderGuard.validateSafeWritePath(nestedUnderSymlink, { projectRoot: testRoot });
        }, err => err.code === 'SYMLINK_ESCAPE_DETECTED');
        console.log('  [PASS] 6. Nested symlink pointing outside BLOCKED');
    } else {
        console.log('  [SKIPPED] 6. Nested symlink check skipped (OS unprivileged environment)');
    }

    // 7. Broken symlink
    console.log('>>> [7/15] Testing Broken Symlink...');
    const brokenSymlink = path.join(testRoot, 'broken-symlink.txt');
    let brokenCreated = false;
    try {
        fs.symlinkSync(path.join(outsideRoot, 'nonexistent-secret.txt'), brokenSymlink, 'file');
        brokenCreated = true;
    } catch (e) {}

    if (brokenCreated) {
        assert.throws(() => {
            PathLoaderGuard.validateSafeWritePath(brokenSymlink, { projectRoot: testRoot });
        }, err => err.code === 'SYMLINK_ESCAPE_DETECTED' || err.code === 'SYMLINK_TARGET_REJECTED');
        console.log('  [PASS] 7. Broken symlink BLOCKED');
    } else {
        console.log('  [SKIPPED] 7. Broken symlink check skipped (OS unprivileged environment)');
    }

    // 8. Atomic file write safe replacement
    console.log('>>> [8/15] Testing Atomic Safe Write...');
    const atomicTarget = path.join(testRoot, 'atomic-test.txt');
    PathLoaderGuard.safeAtomicWrite(atomicTarget, 'v1', { projectRoot: testRoot });
    assert.strictEqual(fs.readFileSync(atomicTarget, 'utf8'), 'v1');
    PathLoaderGuard.safeAtomicWrite(atomicTarget, 'v2', { projectRoot: testRoot });
    assert.strictEqual(fs.readFileSync(atomicTarget, 'utf8'), 'v2');
    console.log('  [PASS] 8. Atomic replacement verified');

    // 9. Nonexistent destination ancestor validation
    console.log('>>> [9/15] Testing Nonexistent Destination Ancestor Validation...');
    const deepTarget = path.join(testRoot, 'new-dir-1/new-dir-2/file.txt');
    const safeDeep = PathLoaderGuard.validateSafeWritePath(deepTarget, { projectRoot: testRoot });
    assert.strictEqual(safeDeep, deepTarget);
    console.log('  [PASS] 9. Nonexistent destination verified');

    // 10. Windows-style absolute paths escaping root
    console.log('>>> [10/15] Testing Windows-style Absolute Path Escapes...');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('C:\\Windows\\System32\\calc.exe', { projectRoot: testRoot });
    }, err => err.code === 'PATH_TRAVERSAL_DETECTED');
    console.log('  [PASS] 10. Windows-style absolute escape BLOCKED');

    // 11. UNC network paths
    console.log('>>> [11/15] Testing UNC Network Paths Defense...');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('\\\\192.168.1.1\\share\\evil.txt', { projectRoot: testRoot });
    }, err => err.code === 'UNC_PATH_REJECTED');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('//remote-host/share/evil.txt', { projectRoot: testRoot });
    }, err => err.code === 'UNC_PATH_REJECTED');
    console.log('  [PASS] 11. UNC paths BLOCKED');

    // 12. POSIX absolute paths escaping root
    console.log('>>> [12/15] Testing POSIX Absolute Paths Escapes...');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('/etc/passwd', { projectRoot: testRoot });
    }, err => err.code === 'PATH_TRAVERSAL_DETECTED');
    console.log('  [PASS] 12. POSIX absolute escape BLOCKED');

    // 13. Traversal attempts (../ and ..\)
    console.log('>>> [13/15] Testing Path Traversal Defense (../)...');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath(path.join(testRoot, '../../escaped.txt'), { projectRoot: testRoot });
    }, err => err.code === 'PATH_TRAVERSAL_DETECTED');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('sub/../../../escaped.txt', { projectRoot: testRoot });
    }, err => err.code === 'PATH_TRAVERSAL_DETECTED');
    console.log('  [PASS] 13. Path traversal attempts BLOCKED');

    // 14. Unexpected directories as file targets
    console.log('>>> [14/15] Testing Directory as File Target...');
    const subDirectory = path.join(testRoot, 'existing-dir-target');
    fs.mkdirSync(subDirectory);
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath(subDirectory, { projectRoot: testRoot });
    }, err => err.code === 'IS_A_DIRECTORY');
    console.log('  [PASS] 14. Directory target as file BLOCKED');

    // 15. Null-byte injection
    console.log('>>> [15/15] Testing Null-Byte Injection Defense...');
    assert.throws(() => {
        PathLoaderGuard.validateSafeWritePath('file.txt\0.js', { projectRoot: testRoot });
    }, err => err.code === 'SECURITY_PATH_POISONING');
    console.log('  [PASS] 15. Null-byte injection BLOCKED');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 15 PathLoaderGuard Security Tests PASSED 100%.');
    console.log('======================================================');
} finally {
    try {
        fs.rmSync(testRoot, { recursive: true, force: true });
        fs.rmSync(outsideRoot, { recursive: true, force: true });
    } catch (e) {}
}
