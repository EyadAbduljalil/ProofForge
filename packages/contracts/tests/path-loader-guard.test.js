/**
 * @file path-loader-guard.test.js
 * @description اختبارات الأمان والتحصين لحارس المسارات ونظام الملفات (Path Security Test Suite)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const PathLoaderGuard = require('../path-loader-guard');

console.log('======================================================');
console.log('🛡️ Testing Hardened PathLoaderGuard Security (Phase 2)');
console.log('======================================================');

const root = PathLoaderGuard.getProjectRoot();

// 1. اختبار حظر محاولات القفز بين المسارات (Path Traversal)
console.log('>>> [1/6] Testing Path Traversal Defense (../)...');
assert.throws(() => {
    PathLoaderGuard.validateSafePath('../../etc/passwd', { projectRoot: root });
}, { code: 'PATH_TRAVERSAL_DETECTED' });

assert.throws(() => {
    PathLoaderGuard.validateSafePath('skills/../../outside.json', { projectRoot: root });
}, { code: 'PATH_TRAVERSAL_DETECTED' });
console.log('  [PASS] Path traversal attempts safely BLOCKED');

// 2. اختبار حظر حقن البايت الصفري (Null-Byte Injection)
console.log('>>> [2/6] Testing Null-Byte Injection Defense...');
assert.throws(() => {
    PathLoaderGuard.validateSafePath('package.json\0.txt', { projectRoot: root });
}, { code: 'SECURITY_PATH_POISONING' });
console.log('  [PASS] Null-byte injection safely BLOCKED');

// 3. اختبار حظر مسارات الشبكة (UNC Paths)
console.log('>>> [3/6] Testing UNC Path Defense...');
assert.throws(() => {
    PathLoaderGuard.validateSafePath('\\\\evil-host\\share\\file.json', { projectRoot: root });
}, { code: 'UNC_PATH_REJECTED' });
assert.throws(() => {
    PathLoaderGuard.validateSafeWritePath('//evil-host/share/file.json', { projectRoot: root });
}, { code: 'UNC_PATH_REJECTED' });
console.log('  [PASS] UNC network paths safely BLOCKED');

// 4. اختبار التحقق الصارم من امتداد الملفات المصرح بها
console.log('>>> [4/6] Testing Extension Whitelisting...');
assert.throws(() => {
    PathLoaderGuard.validateSafePath('README.md', { projectRoot: root, allowedExtensions: ['.json'] });
}, { code: 'DISALLOWED_EXTENSION' });
console.log('  [PASS] Extension whitelisting verified');

// 5. اختبار فحص مسارات الكتابة غير الموجودة بعد بأمان
console.log('>>> [5/6] Testing Safe Write Path for Nonexistent Destination...');
const safeWrite = PathLoaderGuard.validateSafeWritePath('scratch/test_write_target.tmp', { projectRoot: root });
assert(safeWrite.startsWith(root), 'Safe write path must be inside root');

assert.throws(() => {
    PathLoaderGuard.validateSafeWritePath('../outside_workspace.tmp', { projectRoot: root });
}, { code: 'PATH_TRAVERSAL_DETECTED' });
console.log('  [PASS] Nonexistent write destination ancestor verification verified');

// 6. اختبار التحقق من المسار الحقيقي لملف موجود
console.log('>>> [6/6] Testing Legitimate File Path Loading...');
const safePkg = PathLoaderGuard.validateSafePath('package.json', { projectRoot: root, allowedExtensions: ['.json'] });
assert(fs.existsSync(safePkg), 'Legitimate file must exist');
console.log('  [PASS] Legitimate file path verified');

console.log('======================================================');
console.log('>>> [SUCCESS] All PathLoaderGuard Security Tests PASSED 100%.');
console.log('======================================================');
