/**
 * @file webforge-v2.1-core-verification.test.js
 * @description WebForge V2.1 — Core Verification Intelligence Master Test Suite
 * حزمة اختبارات شاملة تغطي كافة القدرات الـ 12 مع سيناريوهات إيجابية وسلبية وعدائية
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const v2 = require('../v2/index.js');
const {
    BusinessLogicEngine,
    UniversalInvariantEngine,
    StateMachineVerifier,
    SCENARIO_TYPES,
    EDGE_CASE_CATEGORIES,
    ScenarioIntelligenceEngine,
    CrossModuleConsistencyVerifier,
    UniversalReconciliationEngine,
    FailureRecoveryVerifier
} = v2.coreVerification;

describe('WebForge V2.1 — Core Verification Intelligence Master Suite', () => {

    // 1. Business Logic Verification
    describe('1. Business Logic Verification & Authorization Guard', () => {
        it('should verify compliant business rules with valid evidence', () => {
            const engine = new BusinessLogicEngine();
            engine.registerRule({
                id: 'BL-ORDER-001',
                title: 'قاعدة إنشاء الطلب وتوافر المخزون',
                preconditions: [
                    {
                        description: 'يجب أن يكون المخزون كافياً',
                        evaluate: ({ input }) => input.stock >= input.requestedQuantity
                    }
                ],
                constraints: [
                    {
                        description: 'الكمية المطلوبة أكبر من الصفر',
                        evaluate: ({ input }) => input.requestedQuantity > 0
                    }
                ],
                postconditions: [
                    {
                        description: 'يتم حجز الكمية في الحالة النهائية',
                        evaluate: ({ postState, input }) => postState.reservedQuantity === input.requestedQuantity
                    }
                ],
                authorization: { requiredRole: 'CUSTOMER', enforceOwnership: true },
                requiredSideEffects: ['EMIT_ORDER_CREATED_EVENT'],
                forbiddenSideEffects: ['DIRECT_DATABASE_PURGE']
            });

            const res = engine.verify('BL-ORDER-001', {
                actor: { id: 'user-1', roles: ['CUSTOMER'] },
                resourceOwnerId: 'user-1',
                input: { stock: 10, requestedQuantity: 2 },
                preState: { stock: 10 },
                postState: { reservedQuantity: 2 },
                observedSideEffects: ['EMIT_ORDER_CREATED_EVENT'],
                evidence: { uri: 'audit://events/order-001.log', checksum: 'sha256-abc123' }
            });

            assert.equal(res.status, 'VERIFIED');
            assert.equal(res.gate, 'PASS');
            assert.equal(res.isVerified, true);
        });

        it('should reject unauthorized execution and prevent IDOR / privilege escalation', () => {
            const engine = new BusinessLogicEngine();
            engine.registerRule({
                id: 'BL-SEC-002',
                title: 'تعديل الملف الشخصي',
                authorization: { requiredRole: 'USER', enforceOwnership: true }
            });

            // محاولة تعديل مورد يخص مستخدم آخر (IDOR Attempt)
            const idorRes = engine.verify('BL-SEC-002', {
                actor: { id: 'attacker-1', roles: ['USER'] },
                resourceOwnerId: 'victim-99',
                evidence: { uri: 'log://auth' }
            });

            assert.equal(idorRes.gate, 'FAIL');
            assert.equal(idorRes.isVerified, false);
            assert.ok(idorRes.violations.some(v => v.type === 'HORIZONTAL_PRIVILEGE_ESCALATION'));
        });

        it('should fail with INSUFFICIENT_EVIDENCE if no verifiable evidence is provided', () => {
            const engine = new BusinessLogicEngine();
            engine.registerRule({
                id: 'BL-NO-EV',
                title: 'قاعدة بلا دليل'
            });

            const res = engine.verify('BL-NO-EV', {
                actor: { roles: [] },
                evidence: null
            });

            assert.equal(res.status, 'INSUFFICIENT_EVIDENCE');
            assert.equal(res.gate, 'FAIL');
            assert.equal(res.isVerified, false);
        });
    });

    // 2. Universal Invariant Engine
    describe('2. Universal Invariant Engine', () => {
        it('should evaluate universal invariants and verify compliance', () => {
            const invEngine = new UniversalInvariantEngine();
            invEngine.loadStandardUniversalInvariants();

            const res = invEngine.evaluate('INV-UNIV-001', { quantity: 15 }, { source: 'warehouse-db' });
            assert.equal(res.status, 'VERIFIED');
            assert.equal(res.gate, 'PASS');
            assert.equal(res.isCompliant, true);
        });

        it('should detect violations of negative values in default universal invariants', () => {
            const invEngine = new UniversalInvariantEngine();
            invEngine.loadStandardUniversalInvariants();

            const res = invEngine.evaluate('INV-UNIV-001', { quantity: -5 }, { source: 'warehouse-db' });
            assert.equal(res.status, 'VIOLATED');
            assert.equal(res.gate, 'FAIL');
            assert.equal(res.isCompliant, false);
            assert.ok(res.remediationGuidance);
        });

        it('should reject invariant verification in absence of concrete evidence', () => {
            const invEngine = new UniversalInvariantEngine();
            invEngine.loadStandardUniversalInvariants();

            const res = invEngine.evaluate('INV-UNIV-002', { isLocked: true, modifiedAfterLock: false }, null);
            assert.equal(res.status, 'INSUFFICIENT_EVIDENCE');
            assert.equal(res.gate, 'FAIL');
        });
    });

    // 3. State Machine Verification
    describe('3. State Machine Verification & Forbidden Transitions', () => {
        it('should detect unreachable states and topological anomalies in state machines', () => {
            const smVerifier = new StateMachineVerifier();
            smVerifier.registerStateMachine({
                id: 'SM-ANOMALY',
                initialState: 'DRAFT',
                terminalStates: ['PUBLISHED'],
                states: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ORPHAN_STATE'],
                transitions: [
                    { from: 'DRAFT', to: 'REVIEW' },
                    { from: 'REVIEW', to: 'PUBLISHED' }
                ],
                forbiddenTransitions: [
                    { from: 'PUBLISHED', to: 'DRAFT' }
                ]
            });

            const audit = smVerifier.auditTopology('SM-ANOMALY');
            assert.equal(audit.gate, 'FAIL');
            assert.equal(audit.isCompliant, false);
            assert.ok(audit.anomalies.some(a => a.type === 'UNREACHABLE_STATE' && a.state === 'ORPHAN_STATE'));
        });

        it('should enforce guards and strictly prohibit forbidden transitions', () => {
            const smVerifier = new StateMachineVerifier();
            smVerifier.registerStateMachine({
                id: 'SM-WORKFLOW',
                initialState: 'OPEN',
                terminalStates: ['CLOSED'],
                states: ['OPEN', 'PROCESSING', 'CLOSED'],
                transitions: [
                    {
                        from: 'OPEN',
                        to: 'PROCESSING',
                        allowedRoles: ['OPERATOR'],
                        guard: ({ payload }) => payload && payload.isValid === true
                    },
                    { from: 'PROCESSING', to: 'CLOSED' }
                ],
                forbiddenTransitions: [
                    { from: 'CLOSED', to: 'OPEN' }
                ]
            });

            // 1. انتقال محظور صراحة
            const fbRes = smVerifier.verifyTransition('SM-WORKFLOW', 'CLOSED', 'OPEN');
            assert.equal(fbRes.valid, false);
            assert.equal(fbRes.gate, 'FAIL');

            // 2. انتقال غير مصرح به دورياً
            const unauthRes = smVerifier.verifyTransition('SM-WORKFLOW', 'OPEN', 'PROCESSING', {
                actor: { roles: ['VIEWER'] },
                payload: { isValid: true }
            });
            assert.equal(unauthRes.valid, false);

            // 3. انتقال سليم مستوفٍ للحراسة والصلاحيات
            const validRes = smVerifier.verifyTransition('SM-WORKFLOW', 'OPEN', 'PROCESSING', {
                actor: { roles: ['OPERATOR'] },
                payload: { isValid: true }
            });
            assert.equal(validRes.valid, true);
            assert.equal(validRes.gate, 'PASS');
        });
    });

    // 4 & 5. Scenario Intelligence & Edge Cases
    describe('4 & 5. Scenario Intelligence & Edge Cases', () => {
        it('should register declarative scenarios across multiple categories', () => {
            const scenEngine = new ScenarioIntelligenceEngine();
            const sc = scenEngine.registerScenario({
                id: 'SC-PAY-FAIL-01',
                type: 'FAILURE_PATH',
                title: 'فشل بوابة الدفع واستدعاء الإجراء التعويضي',
                expectedOutcome: 'ROLLBACK_AND_NOTIFY'
            });

            assert.equal(sc.id, 'SC-PAY-FAIL-01');
            assert.equal(sc.type, SCENARIO_TYPES.FAILURE_PATH);
        });

        it('should verify standard edge-cases (zero, null, negative)', () => {
            const scenEngine = new ScenarioIntelligenceEngine();
            scenEngine.loadStandardEdgeCases();

            const ec1 = scenEngine.verifyEdgeCaseBehavior('EC-STD-001', { amount: 0 }, { rejected: true, handledGracefully: true });
            assert.equal(ec1.gate, 'PASS');
            assert.equal(ec1.isVerified, true);

            const ec2 = scenEngine.verifyEdgeCaseBehavior('EC-STD-003', -100, { rejected: true });
            assert.equal(ec2.gate, 'PASS');
            assert.equal(ec2.isVerified, true);
        });
    });

    // 6 & 7. Cross-Module Consistency & Universal Reconciliation
    describe('6 & 7. Cross-Module Consistency & Universal Reconciliation', () => {
        it('should detect missing propagation and orphaned records between modules', () => {
            const cmVerifier = new CrossModuleConsistencyVerifier();
            cmVerifier.registerRelationship({
                id: 'REL-ORDER-INVENTORY',
                sourceModule: 'OrderService',
                targetModule: 'InventoryService',
                expectedConsistency: 'EXACT_MATCH',
                keyMapping: { sourceKey: 'id', targetKey: 'orderRef' },
                allowOrphans: false
            });

            const source = [{ id: 'ORD-1' }, { id: 'ORD-2' }];
            const target = [{ orderRef: 'ORD-1' }, { orderRef: 'ORD-999' }]; // ORD-2 مفقود، و ORD-999 يتيم

            const check = cmVerifier.verifyConsistency('REL-ORDER-INVENTORY', source, target);
            assert.equal(check.gate, 'FAIL');
            assert.equal(check.isConsistent, false);
            assert.ok(check.anomalies.some(a => a.type === 'MISSING_PROPAGATION'));
            assert.ok(check.anomalies.some(a => a.type === 'ORPHANED_STATE'));
        });

        it('should execute universal reconciliation and identify discrepancies', () => {
            const reconciler = new UniversalReconciliationEngine();
            const source = [
                { id: 'TX-1', amount: 100 },
                { id: 'TX-2', amount: 250 }
            ];
            const target = [
                { id: 'TX-1', amount: 100 },
                { id: 'TX-2', amount: 200 } // فارق 50
            ];

            const result = reconciler.reconcile({
                name: 'Payment vs Gateway Reconcile',
                sourceItems: source,
                targetItems: target,
                matchBy: 'id',
                valueField: 'amount'
            });

            assert.equal(result.gate, 'FAIL');
            assert.equal(result.isReconciled, false);
            assert.equal(result.difference, 50);
            assert.equal(result.discrepanciesCount, 1);
        });
    });

    // 8 & 9. Failure, Recovery & Concurrency Risk
    describe('8 & 9. Failure, Recovery & Concurrency Risk', () => {
        it('should verify atomic rollback on workflow failures', () => {
            const frVerifier = new FailureRecoveryVerifier();
            const workflow = {
                name: 'Three-Step Saga',
                failAtStep: 3,
                steps: [
                    { name: 'ReserveStock', canRollback: true },
                    { name: 'ChargePayment', canRollback: true },
                    { name: 'IssueInvoice', canRollback: true }
                ]
            };

            const res = frVerifier.verifyAtomicRollback(workflow);
            assert.equal(res.gate, 'PASS');
            assert.equal(res.isAtomic, true);
            assert.equal(res.rolledBackCleanly, true);
        });

        it('should detect idempotency key reuse with mismatched payloads', () => {
            const frVerifier = new FailureRecoveryVerifier();
            const requests = [
                { idempotencyKey: 'idemp-1', payload: { action: 'pay', amount: 50 } },
                { idempotencyKey: 'idemp-1', payload: { action: 'refund', amount: 50 } } // تضارب الحمولة
            ];

            const check = frVerifier.verifyIdempotency(requests);
            assert.equal(check.gate, 'FAIL');
            assert.equal(check.isCompliant, false);
            assert.ok(check.anomalies.some(a => a.type === 'IDEMPOTENCY_KEY_REUSE_PAYLOAD_MISMATCH'));
        });

        it('should detect concurrency risks when concurrency control is omitted under concurrent operations', () => {
            const frVerifier = new FailureRecoveryVerifier();
            const check = frVerifier.verifyConcurrencySafety({
                resourceId: 'account-101',
                concurrentOperationsCount: 5,
                concurrencyControl: 'NONE'
            });

            assert.equal(check.gate, 'FAIL');
            assert.equal(check.isSafe, false);
            assert.ok(check.risks.some(r => r.type === 'LOST_UPDATE_RISK'));
        });
    });
});
