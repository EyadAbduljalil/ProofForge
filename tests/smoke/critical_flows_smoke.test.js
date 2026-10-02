// اختبارات التدفقات الحرجة السريعة المحصنة (Hardened Critical Flows Smoke Test)
const assert = require('node:assert');
const PasswordSecurity = require('../../packages/security/password');
const TokenManager = require('../../packages/security/token-manager');
const OwnershipGuard = require('../../packages/security/ownership-guard');
const StateMachineEngine = require('../../packages/state-machine/state-machine-engine');

console.log('>>> Running WebForge Hardened Smoke Tests with Strict Assertions...');

async function testCryptoAndTokenFlow() {
    const rawPass = 'P@ssw0rdSecure!2026_Strong';
    const hash = await PasswordSecurity.hash(rawPass);
    assert.ok(hash.startsWith('scrypt$'), 'Hash format must be scrypt');
    const isVerified = await PasswordSecurity.verify(rawPass, hash);
    assert.strictEqual(isVerified, true, 'Valid password verification failed');
    const isInvalidRejected = await PasswordSecurity.verify('WrongPassword', hash);
    assert.strictEqual(isInvalidRejected, false, 'Invalid password must be rejected');

    const tokenMgr = new TokenManager();
    const tokens = tokenMgr.generateTokens({ id: 'smoke-user-1', role: 'admin', tenantId: 'smoke-tenant' });
    assert.ok(tokens.accessToken, 'Access token missing');
    const verifiedToken = tokenMgr.verifyToken(tokens.accessToken);
    assert.strictEqual(verifiedToken.valid, true, 'Generated token verification failed');
    assert.strictEqual(verifiedToken.payload.sub, 'smoke-user-1');
    console.log('  [PASS] Cryptographic Password & Token Lifecycle Verified.');
}

function testOwnershipAndTenantFlow() {
    const user = { id: 'u101', role: 'user', tenantId: 'tenant-a' };
    const resourceOwned = { id: 'res1', tenant_id: 'tenant-a', user_id: 'u101' };
    const resourceForeignTenant = { id: 'res2', tenant_id: 'tenant-b', user_id: 'u101' };

    assert.strictEqual(OwnershipGuard.validateOwnership(user, resourceOwned, { checkTenant: true }), true);
    assert.throws(() => {
        OwnershipGuard.validateOwnership(user, resourceForeignTenant, { checkTenant: true });
    }, /لا تملك صلاحية الوصول لبيانات هذا المستأجر/, 'Cross-tenant access must throw');
    console.log('  [PASS] Ownership & Multi-Tenant Boundaries Verified.');
}

function testStateMachineFlow() {
    const fsm = new StateMachineEngine({
        initialState: 'ORDER_PLACED',
        states: ['ORDER_PLACED', 'PAYMENT_CONFIRMED', 'SHIPPED'],
        transitions: {
            'ORDER_PLACED': ['PAYMENT_CONFIRMED'],
            'PAYMENT_CONFIRMED': ['SHIPPED']
        }
    });

    assert.strictEqual(fsm.currentState, 'ORDER_PLACED');
    fsm.transition('PAYMENT_CONFIRMED');
    assert.strictEqual(fsm.currentState, 'PAYMENT_CONFIRMED');
    assert.throws(() => {
        fsm.transition('ORDER_PLACED'); // غير مسموح
    }, /الانتقال غير قانوني/);
    console.log('  [PASS] State Machine Deterministic Flow Verified.');
}

async function runAll() {
    await testCryptoAndTokenFlow();
    testOwnershipAndTenantFlow();
    testStateMachineFlow();
    console.log('>>> [SUCCESS] All Hardened Smoke Checks PASSED with 100% Evidence.');
}

runAll().catch(err => {
    console.error('>>> [FAIL] Smoke Test Failure:', err);
    process.exit(1);
});
