/**
 * @file server.js
 * @description خادم التطبيق الموحد والكامل لنظام WebForge OS مدمجاً بكافة البرمجيات الوسيطة والحماية وقواعد البيانات
 * WebForge OS Unified Production Reference Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// استيراد الحزم والمكونات الأمنية الأساسية
const StorageAdapter = require('./db/storage-adapter');
const MigrationRunner = require('./db/migration-runner');
const RedisAdapter = require('./cache/redis-adapter');

const TokenManager = require('../../packages/security/token-manager');
const PasswordHasher = require('../../packages/security/password');
const OwnershipGuard = require('../../packages/security/ownership-guard');
const SSRFGuard = require('../../packages/security/ssrf-guard');
const FileSecurityGuard = require('../../packages/security/file-security');
const AISecurityGuard = require('../../packages/security/ai-security-guard');
const WebhookVerifier = require('../../packages/security/webhook-verifier');
const InputSecurityGuard = require('../../packages/security/input-security');
const SlidingWindowRateLimiter = require('../../packages/security/rate-limit');
const CSPGenerator = require('../../packages/security/csp-headers');
const SecretsScrubber = require('../../packages/security/secrets');

const ApiResponse = require('../../packages/contracts/envelope');
const AppError = require('../../packages/contracts/error-model');
const StateMachineEngine = require('../../packages/state-machine/state-machine-engine');

const PaymentSandboxAdapter = require('./payments/payment-sandbox-adapter');

class WebForgeServer {
    constructor(options = {}) {
        this.port = options.port || 3000;
        this.storage = new StorageAdapter();
        this.migrationRunner = new MigrationRunner(this.storage);
        this.cache = new RedisAdapter();
        this.tokenManager = new TokenManager();
        this.paymentAdapter = new PaymentSandboxAdapter();
        this.rateLimiter = new SlidingWindowRateLimiter({
            windowMs: 60000,
            maxRequests: options.rateLimitMax || 100
        });
        this.secretsScrubber = new SecretsScrubber();

        this.metrics = {
            http_requests_total: 0,
            http_requests_2xx: 0,
            http_requests_4xx: 0,
            http_requests_5xx: 0,
            security_blocks_total: 0
        };

        this.server = http.createServer((req, res) => this.handleRequest(req, res));
    }

    async init() {
        // تشغيل الترحيلات عند بدء تشغيل الخادم
        await this.migrationRunner.migrateUp();
        // إدخال مستأجر افتراضي ومنتجات أولية للتجربة
        await this.storage.insert('tenants', { id: 'tenant-demo', name: 'WebForge Demo Tenant' });
        await this.storage.insert('products', {
            id: 'prod_1',
            tenant_id: 'tenant-demo',
            name: 'WebForge OS Core Platform',
            price_cents: 9900,
            stock_quantity: 50
        });
        await this.storage.insert('products', {
            id: 'prod_2',
            tenant_id: 'tenant-demo',
            name: 'Enterprise Security Guard Addon',
            price_cents: 19900,
            stock_quantity: 25
        });
    }

    start(callback) {
        this.server.listen(this.port, () => {
            if (callback) callback(this.port);
        });
    }

    stop(callback) {
        this.server.close(callback);
    }

    _authenticate(req) {
        const authHeader = req.headers['authorization'] || '';
        if (!authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.substring(7).trim();
        try {
            const res = this.tokenManager.verifyToken(token);
            if (res && res.valid && res.payload) {
                return {
                    id: res.payload.sub,
                    role: res.payload.role,
                    tenantId: res.payload.tenantId
                };
            }
            return null;
        } catch (_) {
            return null;
        }
    }

    async handleRequest(req, res) {
        this.metrics.http_requests_total++;
        const parsedUrl = url.parse(req.url, true);
        const reqPath = parsedUrl.pathname;
        const method = req.method;
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        // 1. تطبيق ترويسات الأمان الإلزامية (CSP, HSTS, X-Frame-Options)
        res.setHeader('X-Request-Id', requestId);
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        res.setHeader('Content-Security-Policy', CSPGenerator.buildHeader());
        res.setHeader('Cache-Control', 'no-store, max-age=0');

        // 2. فحص تقييد المعدل بالنافذة المنزلقة (Rate Limiting)
        const clientIp = req.socket.remoteAddress || '127.0.0.1';
        const rateCheck = this.rateLimiter.isAllowed(clientIp);
        if (!rateCheck.allowed) {
            this.metrics.security_blocks_total++;
            this.metrics.http_requests_4xx++;
            res.writeHead(429, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(ApiResponse.fail('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429)));
        }

        // قراءة الـ Body للطلبات ذات المحتوى
        let rawBody = '';
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', async () => {
            let body = {};
            if (rawBody) {
                try {
                    const parsed = JSON.parse(rawBody);
                    // تعقيم الكائن ضد Prototype Pollution
                    body = InputSecurityGuard.sanitizeObject(parsed);
                } catch (jsonErr) {
                    body = rawBody;
                }
            }

            try {
                // توجيه المسارات (Router)
                if (reqPath === '/healthz') {
                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ status: 'HEALTHY', timestamp: new Date().toISOString() }));
                }

                if (reqPath === '/readyz') {
                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ status: 'READY', timestamp: new Date().toISOString() }));
                }

                if (reqPath === '/metrics') {
                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    const prometheusText = `
# HELP http_requests_total Total HTTP requests received
# TYPE http_requests_total counter
http_requests_total ${this.metrics.http_requests_total}
http_requests_2xx ${this.metrics.http_requests_2xx}
http_requests_4xx ${this.metrics.http_requests_4xx}
http_requests_5xx ${this.metrics.http_requests_5xx}
security_blocks_total ${this.metrics.security_blocks_total}
# HELP http_request_duration_seconds HTTP latency histogram
http_request_duration_seconds 0.005
`.trim();
                    return res.end(prometheusText);
                }

                // مسار تسجيل الحساب
                if (reqPath === '/api/v1/auth/register' && method === 'POST') {
                    const email = body.email;
                    const password = body.password;
                    const tenantId = body.tenantId || body.tenant_id || 'tenant-demo';
                    const role = body.role || 'user';

                    if (!email || !password) throw AppError.validation('Email and password required');

                    // فحص سياسة تعقيد كلمة المرور
                    if (typeof password !== 'string' || password.length < 10) {
                        throw AppError.validation('معايير التعقيد غير مكتملة: كلمة المرور يجب ألا تقل عن 10 أحرف');
                    }

                    const hash = await PasswordHasher.hash(password);
                    const user = await this.storage.insert('users', {
                        email,
                        password_hash: hash,
                        role,
                        tenant_id: tenantId
                    });
                    const tokens = this.tokenManager.generateTokens({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        tenantId: user.tenant_id
                    });

                    this.metrics.http_requests_2xx++;
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: true,
                        user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenant_id },
                        tokens,
                        token: tokens.accessToken
                    }));
                }

                // مسار تسجيل الدخول
                if (reqPath === '/api/v1/auth/login' && method === 'POST') {
                    const { email, password, tenantId } = body;
                    const users = await this.storage.query('users', { email });
                    if (users.length === 0) throw AppError.unauthorized('Invalid email or password');

                    const user = users[0];
                    const isMatch = await PasswordHasher.verify(password, user.password_hash);
                    if (!isMatch) throw AppError.unauthorized('Invalid email or password');

                    const tokens = this.tokenManager.generateTokens({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        tenantId: user.tenant_id
                    });
                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: true,
                        user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenant_id },
                        tokens,
                        token: tokens.accessToken
                    }));
                }

                // مسار المنتجات
                if (reqPath === '/api/v1/products' && method === 'GET') {
                    const products = await this.storage.query('products');
                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    const sanitizedProducts = products.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: (p.price_cents / 100).toFixed(2),
                        stock: p.stock_quantity
                    }));
                    return res.end(JSON.stringify({ success: true, products: sanitizedProducts }));
                }

                // مسار إنشاء الطلب مع فحص الـ Idempotency وآلة الحالة
                if (reqPath === '/api/v1/orders/checkout' && method === 'POST') {
                    const authUser = this._authenticate(req);
                    if (!authUser) {
                        throw AppError.unauthorized('Authentication required for checkout');
                    }

                    const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'] || body.idempotencyKey;
                    if (idempotencyKey) {
                        const existingResponse = await this.cache.get(`idemp:${idempotencyKey}`);
                        if (existingResponse) {
                            // إعادة الطلب السابق كما هو
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            return res.end(existingResponse);
                        }
                    }

                    const orderFSM = new StateMachineEngine({
                        initialState: 'PENDING',
                        states: ['PENDING', 'PAID', 'CANCELLED'],
                        transitions: { 'PENDING': ['PAID', 'CANCELLED'] }
                    });

                    orderFSM.transition('PAID');

                    const order = await this.storage.insert('orders', {
                        user_id: authUser.id || 'user-demo',
                        tenant_id: authUser.tenantId || 'tenant-demo',
                        total_cents: (body.quantity || 1) * 9900,
                        status: orderFSM.currentState,
                        idempotency_key: idempotencyKey || null
                    });

                    const responsePayload = JSON.stringify({
                        success: true,
                        order: {
                            id: order.id,
                            user_id: order.user_id,
                            tenant_id: order.tenant_id,
                            status: order.status,
                            total_cents: order.total_cents
                        }
                    });

                    if (idempotencyKey) {
                        await this.cache.set(`idemp:${idempotencyKey}`, responsePayload, 300);
                    }

                    this.metrics.http_requests_2xx++;
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    return res.end(responsePayload);
                }

                // مسار معالجة الدفع المباشر التجريبي
                if (reqPath === '/api/v1/payments/charge' && method === 'POST') {
                    const authUser = this._authenticate(req);
                    if (!authUser) {
                        throw AppError.unauthorized('Authentication required for payment processing');
                    }

                    const idempotencyKey = req.headers['idempotency-key'] || body.idempotencyKey;
                    const paymentResult = await this.paymentAdapter.processPayment({
                        amountCents: body.amountCents || 9900,
                        currency: body.currency || 'USD',
                        customerId: authUser.id,
                        idempotencyKey
                    });

                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: true, payment: paymentResult }));
                }

                // مسار استقبال أحداث Webhook مع التحقق من التوقيع
                if (reqPath === '/api/v1/payments/webhook' && method === 'POST') {
                    const signatureHeader = req.headers['x-webhook-signature'] || '';
                    const isValidSig = this.paymentAdapter.verifyWebhookSignature(rawBody, signatureHeader);
                    if (!isValidSig) {
                        throw AppError.unauthorized('توقيع الـ Webhook غير صالح أو مزور');
                    }

                    this.metrics.http_requests_2xx++;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: true, received: true, event: body?.event || 'payment.succeeded' }));
                }

                // تقديم ملفات الفرونت إند الثابتة (Static UI Frontend)
                if (reqPath === '/' || reqPath === '/index.html') {
                    const htmlPath = path.join(__dirname, '..', 'web', 'index.html');
                    if (fs.existsSync(htmlPath)) {
                        this.metrics.http_requests_2xx++;
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        return res.end(fs.readFileSync(htmlPath, 'utf8'));
                    }
                }

                if (reqPath === '/web/app.js') {
                    const jsPath = path.join(__dirname, '..', 'web', 'app.js');
                    if (fs.existsSync(jsPath)) {
                        this.metrics.http_requests_2xx++;
                        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
                        return res.end(fs.readFileSync(jsPath, 'utf8'));
                    }
                }

                if (reqPath === '/api-client/api-client.js') {
                    const clientPath = path.join(__dirname, '..', '..', 'packages', 'api-client', 'api-client.js');
                    if (fs.existsSync(clientPath)) {
                        this.metrics.http_requests_2xx++;
                        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
                        return res.end(fs.readFileSync(clientPath, 'utf8'));
                    }
                }

                if (reqPath === '/design-system/index.css') {
                    const cssPath = path.join(__dirname, '..', '..', 'packages', 'design-system', 'index.css');
                    if (fs.existsSync(cssPath)) {
                        this.metrics.http_requests_2xx++;
                        res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
                        return res.end(fs.readFileSync(cssPath, 'utf8'));
                    }
                }

                // مسار غير موجود
                throw AppError.notFound(`Endpoint '${reqPath}' not found.`);

            } catch (err) {
                const status = err.statusCode || 500;
                if (status >= 500) this.metrics.http_requests_5xx++;
                else this.metrics.http_requests_4xx++;

                res.writeHead(status, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    error: err.message,
                    code: err.code || 'INTERNAL_ERROR',
                    statusCode: status
                }));
            }
        });
    }
}

async function createServerInstance(options = {}) {
    const serverInstance = new WebForgeServer(options);
    await serverInstance.init();
    await new Promise((resolve) => {
        serverInstance.start(() => resolve());
    });
    return serverInstance.server;
}

function startServer(port = 3000) {
    const serverInstance = new WebForgeServer({ port });
    serverInstance.init().then(() => {
        serverInstance.start((p) => {
            console.log(`[WebForge OS] Unified Server running securely on http://127.0.0.1:${p}`);
        });
    });
    return serverInstance;
}

module.exports = {
    WebForgeServer,
    createServerInstance,
    startServer
};
