/**
 * @file agent-execution-adapter.test.js
 * @description اختبارات التحقق من محول دورة حياة الوكيل وآلة الحالات
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { AgentExecutionAdapter, VALID_STATES } = require('../agent-execution-adapter');

console.log('======================================================');
console.log('🤖 Testing Agent Execution Adapter & Lifecycle State Machine');
console.log('======================================================');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aea-test-'));

try {
    // 1. Initial State
    const adapter = new AgentExecutionAdapter('TASK_001');
    assert.strictEqual(adapter.currentState, 'PENDING');
    console.log('  [PASS] 1. Initial state is PENDING');

    // 2. Illegal Transition (PENDING -> VERIFIED must fail)
    assert.throws(() => {
        adapter.transition('VERIFIED');
    }, /انتقال غير قانوني/);
    console.log('  [PASS] 2. Rejects illegal jump from PENDING to VERIFIED');

    // 3. Normal Flow: PENDING -> CONTEXT_DISCOVERY -> PLANNING -> READY
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ name: 'test-app' }));
    adapter.discoverProjectContext(tempDir);
    assert.strictEqual(adapter.currentState, 'CONTEXT_DISCOVERY');

    const dummyPlan = {
        scenarioId: 'saas-scenario',
        steps: [{ stepNumber: 1, skillId: 'architecture' }]
    };
    adapter.registerPlan(dummyPlan);
    assert.strictEqual(adapter.currentState, 'READY');
    console.log('  [PASS] 3. Successfully traverses PENDING -> CONTEXT_DISCOVERY -> PLANNING -> READY');

    // 4. Runtime Unavailable Transition
    const adapter2 = new AgentExecutionAdapter('TASK_002');
    adapter2.markRuntimeUnavailable('No agent container');
    assert.strictEqual(adapter2.currentState, 'AGENT_RUNTIME_UNAVAILABLE');
    console.log('  [PASS] 4. Gracefully transitions to AGENT_RUNTIME_UNAVAILABLE');

    // 5. Failure & Rollback flow
    const adapter3 = new AgentExecutionAdapter('TASK_003');
    adapter3.transition('CONTEXT_DISCOVERY');
    adapter3.transition('FAILED', { error: 'Syntax Error in codebase' });
    assert.strictEqual(adapter3.currentState, 'FAILED');
    adapter3.transition('ROLLED_BACK');
    assert.strictEqual(adapter3.currentState, 'ROLLED_BACK');
    console.log('  [PASS] 5. Successfully manages FAILED -> ROLLED_BACK');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Agent Execution Adapter Tests PASSED.');
    console.log('======================================================');

} finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
