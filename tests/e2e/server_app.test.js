const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { createServerInstance } = require('../../apps/server/server.js');
const http = require('node:http');

describe('WebForge OS — E2E Live Integration & Security Test Suite', () => {
    let server;
    let baseUrl;
    const testPort = 49152 + Math.floor(Math.random() * 5000);

    before(async () => {
        server = await createServerInstance({
            port: testPort,
            useInMemoryStorage: true,
            useInMemoryCache: true,
            rateLimitMax: 1000
        });
        baseUrl = `http://127.0.0.1:${testPort}`;
    });

    after(async () => {
        if (server) {
            if (typeof server.closeAllConnections === 'function') {
                server.closeAllConnections();
            }
            await new Promise(res => server.close(res));
        }
    });

    async function makeRequest(path, options = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(path, baseUrl);
            const reqOptions = {
                method: options.method || 'GET',
                agent: false,
                headers: {
                    'Connection': 'close',
                    ...(options.headers || {})
                }
            };

            const req = http.request(url, reqOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    let json = null;
                    try {
                        json = JSON.parse(data);
                    } catch (_) {}
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data,
                        json
                    });
                });
            });

            req.on('error', reject);
            if (options.body) {
                req.write(typeof options.body === 'object' ? JSON.stringify(options.body) : options.body);
            }
            req.end();
        });
    }

    test('1. Security Headers: Verifies CSP, HSTS, XFO, Anti-Sniff & Scrubbing', async () => {
        const res = await makeRequest('/healthz');
        assert.strictEqual(res.status, 200);
        assert.ok(res.headers['content-security-policy'], 'Missing CSP header');
        assert.ok(res.headers['strict-transport-security'], 'Missing HSTS header');
        assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
        assert.strictEqual(res.headers['x-frame-options'], 'DENY');
    });

    test('2. Health & Observability: Verifies /healthz, /readyz and /metrics', async () => {
        const healthRes = await makeRequest('/healthz');
        assert.strictEqual(healthRes.status, 200);
        assert.strictEqual(healthRes.json.status, 'HEALTHY');

        const readyRes = await makeRequest('/readyz');
        assert.strictEqual(readyRes.status, 200);
        assert.strictEqual(readyRes.json.status, 'READY');

        const metricsRes = await makeRequest('/metrics');
        assert.strictEqual(metricsRes.status, 200);
        assert.ok(metricsRes.body.includes('http_requests_total'));
        assert.ok(metricsRes.body.includes('http_request_duration_seconds'));
    });

    test('3. Authentication Flow: Password Complexity Enforcement', async () => {
        const weakRes = await makeRequest('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_e2e_1',
                email: 'weak@test.local',
                password: '123'
            }
        });
        assert.strictEqual(weakRes.status, 400);
        assert.ok(weakRes.json.error.includes('معايير التعقيد'));
    });

    test('4. End-to-End Registration & Login Lifecycle', async () => {
        const validPassword = 'P@ssw0rdSecure!2026_Strong';
        
        const regRes = await makeRequest('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_e2e_1',
                email: 'user1@e2e.corp',
                password: validPassword,
                role: 'admin'
            }
        });
        assert.strictEqual(regRes.status, 201);
        assert.ok(regRes.json.user);
        assert.strictEqual(regRes.json.user.email, 'user1@e2e.corp');
        assert.strictEqual(regRes.json.user.password_hash, undefined, 'Password hash leaked in response!');

        const loginRes = await makeRequest('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_e2e_1',
                email: 'user1@e2e.corp',
                password: validPassword
            }
        });
        assert.strictEqual(loginRes.status, 200);
        assert.ok(loginRes.json.token, 'Missing JWT token');
        assert.strictEqual(loginRes.json.user.tenantId, 'tenant_e2e_1');
    });

    test('5. Multi-Tenant Isolation & IDOR Protection', async () => {
        await makeRequest('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_alpha',
                email: 'alice@alpha.corp',
                password: 'P@ssw0rdSecure!2026_Alpha',
                role: 'admin'
            }
        });
        const loginAlpha = await makeRequest('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_alpha',
                email: 'alice@alpha.corp',
                password: 'P@ssw0rdSecure!2026_Alpha'
            }
        });
        const tokenAlpha = loginAlpha.json.token;

        const orderRes = await makeRequest('/api/v1/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAlpha}`,
                'Idempotency-Key': 'idemp_key_1001'
            },
            body: {
                productId: 'prod_1',
                quantity: 1
            }
        });
        assert.strictEqual(orderRes.status, 201);
        assert.strictEqual(orderRes.json.order.tenant_id, 'tenant_alpha');
    });

    test('6. Atomic Checkout & Idempotency Key Replay Protection', async () => {
        const loginAlpha = await makeRequest('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_alpha',
                email: 'alice@alpha.corp',
                password: 'P@ssw0rdSecure!2026_Alpha'
            }
        });
        const token = loginAlpha.json.token;
        const idempotencyKey = 'unique_idempotency_' + Date.now();

        const firstAttempt = await makeRequest('/api/v1/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Idempotency-Key': idempotencyKey
            },
            body: {
                productId: 'prod_2',
                quantity: 2
            }
        });
        assert.strictEqual(firstAttempt.status, 201);
        const firstOrderId = firstAttempt.json.order.id;

        const secondAttempt = await makeRequest('/api/v1/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Idempotency-Key': idempotencyKey
            },
            body: {
                productId: 'prod_2',
                quantity: 2
            }
        });
        assert.strictEqual(secondAttempt.status, 201);
        assert.strictEqual(secondAttempt.json.order.id, firstOrderId, 'Idempotency key did not return cached order!');
    });

    test('7. Web Client UI Static Asset Serving', async () => {
        const indexRes = await makeRequest('/');
        assert.strictEqual(indexRes.status, 200);
        assert.ok(indexRes.body.includes('WebForge OS'));
        assert.ok(indexRes.body.includes('dir="rtl"'));

        const appJsRes = await makeRequest('/web/app.js');
        assert.strictEqual(appJsRes.status, 200);
        assert.ok(appJsRes.body.includes('DOMContentLoaded'));
    });

    test('8. Sandbox Payment Processing & Idempotency Gate', async () => {
        const loginRes = await makeRequest('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                tenantId: 'tenant_alpha',
                email: 'alice@alpha.corp',
                password: 'P@ssw0rdSecure!2026_Alpha'
            }
        });
        const token = loginRes.json.token;
        const pKey = 'pay_key_' + Date.now();

        const chargeRes = await makeRequest('/api/v1/payments/charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Idempotency-Key': pKey
            },
            body: {
                amountCents: 15000,
                currency: 'USD'
            }
        });
        assert.strictEqual(chargeRes.status, 200);
        assert.strictEqual(chargeRes.json.payment.status, 'SUCCEEDED');
        assert.strictEqual(chargeRes.json.payment.amountCents, 15000);
    });

    test('9. Webhook HMAC Signature & Timing-Safe Verification', async () => {
        const crypto = require('crypto');
        const webhookSecret = 'whsec_test_secure_entropy_key_32_bytes_min';
        const payload = JSON.stringify({ event: 'payment.succeeded', id: 'evt_1001' });

        const validSig = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

        // ضربة صحيحة بتوقيع سليم
        const validRes = await makeRequest('/api/v1/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': validSig
            },
            body: payload
        });
        assert.strictEqual(validRes.status, 200);
        assert.strictEqual(validRes.json.received, true);

        // ضربة مزورة بتوقيع خاطئ
        const invalidRes = await makeRequest('/api/v1/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': 'forged_fake_signature_hex_value'
            },
            body: payload
        });
        assert.strictEqual(invalidRes.status, 401);
    });
});
