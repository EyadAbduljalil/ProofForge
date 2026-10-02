/**
 * @file state_machine.test.js
 * @description اختبارات محرك آلات الحالة وانتقالات العمليات التجارية
 */

const assert = require('assert');
const StateMachineEngine = require('../state-machine-engine');

console.log('======================================================');
console.log('🔄 Testing WebForge State Machine Engine...');
console.log('======================================================');

const orderMachine = new StateMachineEngine({
    initialState: 'PENDING',
    states: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'CANCELLED'],
    transitions: {
        'PENDING': ['PAID', 'CANCELLED'],
        'PAID': ['PROCESSING', 'CANCELLED'],
        'PROCESSING': ['SHIPPED'],
        'SHIPPED': [],
        'CANCELLED': []
    },
    guards: {
        'PENDING->PAID': (ctx) => ctx.paymentConfirmed === true
    }
});

// 1. اختبار انتقال شرعي مع حارس صالح
const validTrans = orderMachine.transition('PAID', { paymentConfirmed: true });
assert.strictEqual(validTrans.to, 'PAID');
assert.strictEqual(orderMachine.currentState, 'PAID');
console.log('  [PASS] Valid Transition with Guard Verified');

// 2. اختبار حظر انتقال غير قانوني (مثل محاولة الانتقال المباشر من PAID إلى PENDING)
assert.throws(() => {
    orderMachine.transition('PENDING');
}, /محظور: الانتقال غير قانوني/);
console.log('  [PASS] Illegal Transition Rejection Verified');

// 3. اختبار التراجع Rollback
const rollbackRes = orderMachine.rollback();
assert.strictEqual(rollbackRes.rolledBackTo, 'PENDING');
assert.strictEqual(orderMachine.currentState, 'PENDING');
console.log('  [PASS] State Rollback Mechanism Verified');

console.log('>>> [SUCCESS] State Machine Tests PASSED 100%.');
