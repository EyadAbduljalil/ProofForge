/**
 * @file webforge-v2.2-data-api-distributed.test.js
 * @description WebForge V2.2 — Data, API & Distributed Systems Verification Test Suite
 * حزمة اختبارات شاملة تغطي سلامة البيانات وعقود الـ APIs والرسائل والويب هوك والأنظمة الموزعة
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const v2 = require('../v2/index.js');
const {
    DataIntegrityVerifier,
    ApiContractVerifier,
    EventMessageVerifier,
    WebhookVerifier,
    DistributedWorkflowVerifier
} = v2.distributedVerification;

describe('WebForge V2.2 — Data, API & Distributed Systems Verification Suite', () => {

    // 1. Data Integrity & Schema Verification
    describe('1. Data Integrity, Constraints & Migration Verification', () => {
        it('should verify compliant data records against schema contract', () => {
            const verifier = new DataIntegrityVerifier();
            verifier.registerDataContract({
                id: 'TBL-USERS',
                name: 'Users',
                fields: [
                    { name: 'id', type: 'string', required: true, unique: true },
                    { name: 'email', type: 'string', required: true, unique: true },
                    { name: 'orgId', type: 'string', required: true, references: { targetContract: 'Organizations', targetField: 'id' } }
                ]
            });

            const records = [
                { id: 'usr-1', email: 'alice@example.com', orgId: 'org-1' },
                { id: 'usr-2', email: 'bob@example.com', orgId: 'org-1' }
            ];

            const refs = {
                Organizations: [{ id: 'org-1' }]
            };

            const res = verifier.verifyRecords('TBL-USERS', records, refs);
            assert.equal(res.status, 'VERIFIED');
            assert.equal(res.gate, 'PASS');
            assert.equal(res.isCompliant, true);
        });

        it('should detect duplicate unique keys and orphaned foreign key records', () => {
            const verifier = new DataIntegrityVerifier();
            verifier.registerDataContract({
                id: 'TBL-ORDERS',
                name: 'Orders',
                fields: [
                    { name: 'id', required: true, unique: true },
                    { name: 'customerId', required: true, references: { targetContract: 'Customers', targetField: 'id' } }
                ]
            });

            const badRecords = [
                { id: 'ord-1', customerId: 'cust-valid' },
                { id: 'ord-1', customerId: 'cust-ghost' } // معرف مكرر وعميل غير موجود (يتيم)
            ];

            const refs = {
                Customers: [{ id: 'cust-valid' }]
            };

            const res = verifier.verifyRecords('TBL-ORDERS', badRecords, refs);
            assert.equal(res.gate, 'FAIL');
            assert.equal(res.isCompliant, false);
            assert.ok(res.anomalies.some(a => a.type === 'UNIQUE_CONSTRAINT_VIOLATION'));
            assert.ok(res.anomalies.some(a => a.type === 'BROKEN_REFERENCE_ORPHAN_RECORD'));
        });

        it('should verify migration data preservation and rollback safety', () => {
            const verifier = new DataIntegrityVerifier();
            verifier.registerMigration({
                id: 'MIG-001',
                fromVersion: 'v1.0',
                toVersion: 'v1.1',
                canRollback: true,
                transform: (row) => ({ ...row, fullName: `${row.firstName} ${row.lastName}` }),
                rollbackTransform: (row) => {
                    const [firstName, ...rest] = row.fullName.split(' ');
                    return { ...row, firstName, lastName: rest.join(' ') };
                }
            });

            const initial = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
            const migRes = verifier.verifyMigration('MIG-001', initial);
            assert.equal(migRes.status, 'VERIFIED');
            assert.equal(migRes.gate, 'PASS');
            assert.equal(migRes.rollbackSafe, true);
        });
    });

    // 2. API Contracts & Breaking Changes
    describe('2. API Contracts, Breaking Changes & Versioning', () => {
        it('should verify valid API calls and reject missing required request fields', () => {
            const apiVerifier = new ApiContractVerifier();
            apiVerifier.registerEndpoint({
                id: 'EP-CREATE-POST',
                path: '/api/v1/posts',
                method: 'POST',
                authRequired: true,
                requiredRoles: ['AUTHOR'],
                requestSchema: { requiredFields: ['title', 'content'] },
                expectedStatusCodes: [201]
            });

            // استدعاء فاشل لنقص الحقل الإلزامي
            const failRes = apiVerifier.verifyCall('EP-CREATE-POST', {
                actor: { isAuthenticated: true, roles: ['AUTHOR'] },
                requestPayload: { title: 'Hello World' }, // نقص content
                responseStatus: 201
            });
            assert.equal(failRes.gate, 'FAIL');
            assert.ok(failRes.violations.some(v => v.type === 'MISSING_REQUEST_FIELD'));

            // استدعاء ناجح ومستوفٍ للعقد
            const passRes = apiVerifier.verifyCall('EP-CREATE-POST', {
                actor: { isAuthenticated: true, roles: ['AUTHOR'] },
                requestPayload: { title: 'Hello World', content: 'Some body text' },
                responseStatus: 201
            });
            assert.equal(passRes.gate, 'PASS');
            assert.equal(passRes.isCompliant, true);
        });

        it('should detect undocumented breaking changes between API contract versions', () => {
            const apiVerifier = new ApiContractVerifier();
            const oldContract = {
                requestSchema: { requiredFields: ['id'] },
                responseSchema: { requiredFields: ['id', 'username', 'email'] },
                authRequired: false
            };
            const newContract = {
                requestSchema: { requiredFields: ['id', 'securityPin'] }, // إضافة حقل إلزامي
                responseSchema: { requiredFields: ['id', 'username'] }, // حذف email كسر توافق
                authRequired: true // فرض مصادقة مفاجئ
            };

            const check = apiVerifier.detectBreakingChanges(oldContract, newContract);
            assert.equal(check.gate, 'FAIL');
            assert.equal(check.isBackwardCompatible, false);
            assert.ok(check.breakingChanges.some(b => b.type === 'RESPONSE_FIELD_REMOVED'));
            assert.ok(check.breakingChanges.some(b => b.type === 'NEW_REQUIRED_REQUEST_FIELD'));
        });
    });

    // 3. Events, Messages, Queue Policies & DLQ
    describe('3. Events, Messages, Queue Policies & Dead-Letter Queues', () => {
        it('should verify event schemas and enforce correlation IDs for distributed tracing', () => {
            const evVerifier = new EventMessageVerifier();
            evVerifier.registerEventSchema({
                eventType: 'ORDER_PLACED',
                requiredFields: ['orderId', 'totalAmount'],
                enforceCorrelationId: true
            });

            // حدث يفتقر لمعرف الارتباط
            const noCorrRes = evVerifier.verifyEvent({
                eventType: 'ORDER_PLACED',
                payload: { orderId: 'ord-10', totalAmount: 150 },
                metadata: {}
            });
            assert.equal(noCorrRes.gate, 'FAIL');
            assert.ok(noCorrRes.violations.some(v => v.type === 'MISSING_CORRELATION_ID'));

            // حدث سليم بالكامل
            const validEvRes = evVerifier.verifyEvent({
                eventType: 'ORDER_PLACED',
                payload: { orderId: 'ord-10', totalAmount: 150 },
                metadata: { correlationId: 'corr-xyz-789' }
            });
            assert.equal(validEvRes.gate, 'PASS');
            assert.equal(validEvRes.isCompliant, true);
        });

        it('should verify routing to dead-letter queue when retries are exhausted or poison message detected', () => {
            const evVerifier = new EventMessageVerifier();
            evVerifier.registerQueuePolicy({
                queueName: 'payment-queue',
                maxRetryAttempts: 3,
                deadLetterQueue: 'payment-queue-dlq'
            });

            const dlqCheck = evVerifier.verifyDeadLetterHandling('payment-queue', { retryCount: 3 });
            assert.equal(dlqCheck.gate, 'PASS');
            assert.equal(dlqCheck.routedToDlq, true);

            const poisonCheck = evVerifier.verifyDeadLetterHandling('payment-queue', { retryCount: 1, isPoisonMessage: true });
            assert.equal(poisonCheck.routedToDlq, true);
        });
    });

    // 4. Webhooks & Anti-Replay
    describe('4. Webhook Security, HMAC Signatures & Anti-Replay', () => {
        it('should verify HMAC webhook signatures and prevent forged or replayed requests', () => {
            const whVerifier = new WebhookVerifier();
            const secret = 'super-secret-key-32-bytes-length';
            whVerifier.registerWebhook({
                id: 'WH-STRIPE',
                secret,
                toleranceSeconds: 60
            });

            const timestamp = Math.floor(Date.now() / 1000);
            const rawPayload = JSON.stringify({ event: 'charge.succeeded', id: 'ch_123' });
            const validSig = crypto
                .createHmac('sha256', secret)
                .update(`${timestamp}.${rawPayload}`)
                .digest('hex');

            // 1. طلب صالح وموثق
            const passRes = whVerifier.verifyIncomingPayload('WH-STRIPE', {
                rawPayload,
                timestamp,
                signature: validSig
            });
            assert.equal(passRes.gate, 'PASS');
            assert.equal(passRes.isValid, true);

            // 2. هجوم إعادة لنفس التوقيع (Replay Attack)
            const replayRes = whVerifier.verifyIncomingPayload('WH-STRIPE', {
                rawPayload,
                timestamp,
                signature: validSig
            });
            assert.equal(replayRes.gate, 'FAIL');
            assert.equal(replayRes.status, 'REPLAY_ATTACK_DETECTED');

            // 3. توقيع مزور
            const forgedRes = whVerifier.verifyIncomingPayload('WH-STRIPE', {
                rawPayload,
                timestamp,
                signature: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
            });
            assert.equal(forgedRes.gate, 'FAIL');
            assert.equal(forgedRes.status, 'SIGNATURE_MISMATCH');
        });
    });

    // 5. Distributed Sagas & External Integrations
    describe('5. Distributed Sagas & External Integration Resilience', () => {
        it('should detect uncompensated distributed failures in multi-service sagas', () => {
            const distVerifier = new DistributedWorkflowVerifier();
            distVerifier.registerWorkflow({
                id: 'WF-CHECKOUT-SAGA',
                name: 'Checkout Distributed Saga',
                steps: [
                    { service: 'Inventory', action: 'ReserveStock', compensationAction: 'ReleaseStock' },
                    { service: 'Payment', action: 'ChargeCard', compensationAction: null }, // ثغرة: لا يوجد تعويض
                    { service: 'Shipping', action: 'CreateLabel', compensationAction: 'CancelLabel' }
                ]
            });

            // فشل في الخطوة 3 بعد تنفيذ الخطوة 2 غير القابلة للتعويض
            const res = distVerifier.verifySagaExecution('WF-CHECKOUT-SAGA', { failAtStep: 3 });
            assert.equal(res.gate, 'FAIL');
            assert.equal(res.isSafe, false);
            assert.equal(res.uncompensatedCount, 1);
        });

        it('should verify external dependency resilience and graceful fallback on outage', () => {
            const distVerifier = new DistributedWorkflowVerifier();
            distVerifier.registerExternalDependency({
                id: 'DEP-CURRENCY-API',
                name: 'External Currency Exchange Service',
                timeoutMs: 2000,
                hasFallback: true,
                isCritical: true
            });

            // انقطاع الخدمة مع تفعيل البديل بنجاح
            const res = distVerifier.verifyExternalResilience('DEP-CURRENCY-API', {
                isServiceDown: true,
                returnedFallback: true
            });
            assert.equal(res.gate, 'PASS');
            assert.equal(res.isResilient, true);
        });
    });
});
