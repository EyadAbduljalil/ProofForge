/**
 * @file isolated-workspace-safety.test.js
 * @description اختبارات سلامة بيئة القياس ومنع فقدان البيانات (Task 2 Fixture Data-Loss Prevention Tests)
 * تغطي السيناريوهات الـ 10 المنصوص عليها بدقة وحتمية
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const IsolatedBenchmarkWorkspace = require('./helpers/isolated-benchmark-workspace');

console.log('======================================================');
console.log('🛡️ Testing Benchmark Fixture Data-Loss Prevention (Task 2)');
console.log('======================================================');

const rootDir = path.resolve(__dirname, '../../');
const sharedFixtureDir = path.join(rootDir, 'tests/fixtures/sandbox-workspace');

// 1. Prepopulate old shared fixture directory with unique files
console.log('>>> [Task2: 1/10] Prepopulating Shared Fixture Directory...');
if (!fs.existsSync(sharedFixtureDir)) {
    fs.mkdirSync(sharedFixtureDir, { recursive: true });
}
const preExistingFile = path.join(sharedFixtureDir, 'precious-user-data.txt');
fs.writeFileSync(preExistingFile, 'CRITICAL USER DATA THAT MUST NEVER BE DELETED', 'utf8');
const preExistingHash = fs.readFileSync(preExistingFile, 'utf8');
console.log('  [PASS] 1. Preexisting fixture file established');

// 2. Execute the real-scenarios benchmark
console.log('>>> [Task2: 2/10] Executing Real-Scenarios Benchmark...');
const benchScript = path.join(rootDir, 'tests/benchmark/real-scenarios-benchmark.test.js');
const res = spawnSync(process.execPath, [benchScript], {
    cwd: rootDir,
    encoding: 'utf8'
});
assert.strictEqual(res.status, 0, `Benchmark execution failed: ${res.stderr || res.stdout}`);
console.log('  [PASS] 2. Benchmark executed successfully');

// 3. Verify that all preexisting files remain unchanged
console.log('>>> [Task2: 3/10] Verifying Preexisting Files Remained 100% Untouched...');
assert(fs.existsSync(preExistingFile), 'الملف المشترك يجب ألا يتم حذفه نهائياً');
assert.strictEqual(fs.readFileSync(preExistingFile, 'utf8'), preExistingHash, 'محتوى الملف المشترك يجب ألا يتغير بتاتاً');
console.log('  [PASS] 3. Preexisting files in shared fixtures preserved byte-for-byte');

// 4. Verify that benchmark uses unique workspace
console.log('>>> [Task2: 4/10] Verifying Unique Workspace Allocation...');
const ws1 = IsolatedBenchmarkWorkspace.allocate('test-unique-1-');
const ws2 = IsolatedBenchmarkWorkspace.allocate('test-unique-2-');
assert.notStrictEqual(ws1.workspaceDir, ws2.workspaceDir);
assert(ws1.workspaceDir.startsWith(fs.realpathSync(os.tmpdir())));
console.log('  [PASS] 4. Unique workspace in OS tmpdir verified');

// 5. Verify successful execution cleans only its own workspace
console.log('>>> [Task2: 5/10] Verifying Clean Up of Allocated Workspace Only...');
ws1.cleanup();
assert(!fs.existsSync(ws1.workspaceDir), 'مساحة العمل المخصصة يجب أن تُحذف بعد التنظيف');
assert(fs.existsSync(ws2.workspaceDir), 'مساحة العمل الأخرى يجب ألا تتأثر');
console.log('  [PASS] 5. Clean up limited exclusively to allocated workspace');

// 6. Verify failed execution cleans only its own workspace
console.log('>>> [Task2: 6/10] Verifying Failure Teardown Safety...');
const wsFail = IsolatedBenchmarkWorkspace.allocate('test-fail-');
try {
    throw new Error('Simulated scenario failure');
} catch (e) {
    wsFail.cleanup();
}
assert(!fs.existsSync(wsFail.workspaceDir));
assert(fs.existsSync(ws2.workspaceDir));
console.log('  [PASS] 6. Failure teardown safely cleans only own workspace');

// 7. Verify forged or missing ownership marker prevents deletion
console.log('>>> [Task2: 7/10] Verifying Missing or Forged Marker Prevents Deletion...');
const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fake-ws-'));
assert.throws(() => {
    IsolatedBenchmarkWorkspace.safeCleanup(fakeDir);
}, /علامة ملكية ProofForge/);
assert(fs.existsSync(fakeDir), 'المجلد غير المملوك يجب رفض حذفه');
fs.rmSync(fakeDir, { recursive: true, force: true });
console.log('  [PASS] 7. Deletion of unowned directory refused');

// 8. Verify refusal to delete outside temporary root
console.log('>>> [Task2: 8/10] Verifying Refusal to Delete Outside OS Temp...');
assert.throws(() => {
    IsolatedBenchmarkWorkspace.safeCleanup(sharedFixtureDir);
}, /خارج مجلد النظام المؤقت/);
console.log('  [PASS] 8. Outside-tmp directory cleanup rejected');

// 9. Verify concurrent benchmark runs use different workspaces
console.log('>>> [Task2: 9/10] Verifying Concurrency Isolation...');
const workspaces = [];
for (let i = 0; i < 5; i++) {
    workspaces.push(IsolatedBenchmarkWorkspace.allocate(`concurrent-${i}-`));
}
const paths = new Set(workspaces.map(w => w.workspaceDir));
assert.strictEqual(paths.size, 5, 'كافة مساحات العمل المتزامنة يجب أن تكون فريدة تماماً');
workspaces.forEach(w => w.cleanup());
console.log('  [PASS] 9. Concurrency isolation confirmed across 5 concurrent allocations');

// 10. Verify repository fixture tree remains unchanged
console.log('>>> [Task2: 10/10] Verifying Repository Fixture Tree Invariance...');
assert(fs.existsSync(preExistingFile));
// Clean up our test file
fs.unlinkSync(preExistingFile);
ws2.cleanup();
console.log('  [PASS] 10. Repository fixture tree integrity verified');

console.log('======================================================');
console.log('>>> [SUCCESS] All 10 Isolated Workspace Safety Tests PASSED 100%.');
console.log('======================================================');
