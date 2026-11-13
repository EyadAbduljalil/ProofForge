/**
 * @file cli.test.js
 * @description حزمة اختبارات سطر الأوامر الكنسي لمنظومة ProofForge (CLI Integration & Regression Tests)
 */

'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('======================================================');
console.log('🧪 Testing ProofForge CLI Subsystem & Commands');
console.log('======================================================');

const rootDir = path.resolve(__dirname, '../..');
const cliPath = path.join(rootDir, 'bin/proofforge.js');

function runCli(args = []) {
    return spawnSync(process.execPath, [cliPath, ...args], {
        cwd: rootDir,
        encoding: 'utf8',
        timeout: 10000
    });
}

// 1. اختبار عرض المساعدة --help
console.log('>>> [1/7] Testing proofforge --help...');
const helpRes = runCli(['--help']);
assert.strictEqual(helpRes.status, 0, 'proofforge --help must exit with 0');
assert(helpRes.stdout.includes('proofforge <command>'), 'Help text must show usage');
console.log('  [PASS] proofforge --help verified');

// 2. اختبار فحص الطبيب proofforge doctor
console.log('>>> [2/7] Testing proofforge doctor...');
const doctorRes = runCli(['doctor']);
assert.strictEqual(doctorRes.status, 0, 'proofforge doctor must exit with 0 in healthy repo');
assert(doctorRes.stdout.includes('Node.js Runtime Version'), 'Doctor must check node version');
assert(doctorRes.stdout.includes('Canonical Skills Library'), 'Doctor must check skills library');
console.log('  [PASS] proofforge doctor verified');

// 3. اختبار proofforge doctor --json
console.log('>>> [3/7] Testing proofforge doctor --json...');
const docJsonRes = runCli(['doctor', '--json']);
assert.strictEqual(docJsonRes.status, 0, 'proofforge doctor --json must exit with 0');
const docData = JSON.parse(docJsonRes.stdout.trim());
assert.strictEqual(docData.status, 'HEALTHY', 'Doctor JSON status must be HEALTHY');
assert(docData.total_checks >= 7, 'Doctor must execute at least 7 health checks');
console.log('  [PASS] proofforge doctor --json verified');

// 4. اختبار proofforge list
console.log('>>> [4/7] Testing proofforge list...');
const listRes = runCli(['list']);
assert.strictEqual(listRes.status, 0, 'proofforge list must exit with 0');
assert(listRes.stdout.includes('28'), 'proofforge list must show 28 skills');
console.log('  [PASS] proofforge list verified');

// 5. اختبار proofforge skills inspect frontend
console.log('>>> [5/7] Testing proofforge skills inspect frontend...');
const inspectRes = runCli(['skills', 'inspect', 'frontend']);
assert.strictEqual(inspectRes.status, 0, 'inspect frontend must exit with 0');
assert(inspectRes.stdout.includes('frontend'), 'inspect output must contain skill name');
console.log('  [PASS] proofforge skills inspect frontend verified');

// 6. اختبار سلبي: فحص مهارة غير موجودة (Negative Test: inspect nonexistent)
console.log('>>> [6/7] Testing negative control: inspect nonexistent-skill...');
const negInspectRes = runCli(['skills', 'inspect', 'nonexistent-skill-xyz']);
assert.strictEqual(negInspectRes.status, 1, 'inspecting nonexistent skill must fail-closed with exit code 1');
console.log('  [PASS] Negative inspect control properly failed-closed');

// 7. اختبار proofforge skills validate
console.log('>>> [7/7] Testing proofforge skills validate...');
const valRes = runCli(['skills', 'validate']);
assert.strictEqual(valRes.status, 0, 'skills validate must exit with 0');
console.log('  [PASS] proofforge skills validate verified');

console.log('======================================================');
console.log('>>> [SUCCESS] All ProofForge CLI Integration Tests PASSED 100%.');
console.log('======================================================');
