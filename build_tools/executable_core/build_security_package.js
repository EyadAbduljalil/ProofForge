const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeDoc(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
    console.log(`[SECURITY-PKG] Created: ${filePath}`);
}

module.exports = function buildSecurityPackage() {
    console.log('>>> Building Hardened Security Package (packages/security)...');

    // 1. Token Manager
    writeDoc('packages/security/token-manager.js', `// إدارة الجلسات وتدوير الرموز الآمنة (Token Manager)
const crypto = require('crypto');

class TokenManager {
    constructor(options = {}) {
        this.secret = options.secret || process.env.JWT_SECRET || 'webforge_default_secure_secret_entropy_minimum_32_chars';
        this.accessTokenTtl = options.accessTokenTtl || 900; // 15 دقيقة
        this.refreshTokenTtl = options.refreshTokenTtl || 604800; // 7 أيام
        this.revokedTokens = new Set();
        this.refreshStore = new Map();
    }

    _base64UrlEncode(str) {
        return Buffer.from(str)
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\\+/g, '-')
            .replace(/\\//g, '_');
    }

    _base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        return Buffer.from(str, 'base64').toString('utf8');
    }

    _sign(data) {
        return crypto.createHmac('sha256', this.secret).update(data).digest('base64url');
    }

    generateTokens(user) {
        const tokenId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        const accessPayload = {
            sub: user.id,
            role: user.role || 'customer',
            tenantId: user.tenantId || null,
            jti: tokenId,
            iat: now,
            exp: now + this.accessTokenTtl
        };

        const refreshPayload = {
            sub: user.id,
            jti: crypto.randomUUID(),
            family: tokenId,
            iat: now,
            exp: now + this.refreshTokenTtl
        };

        const accessHeader = this._base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const encodedAccessPayload = this._base64UrlEncode(JSON.stringify(accessPayload));
        const accessSignature = this._sign(\`\${accessHeader}.\${encodedAccessPayload}\`);
        const accessToken = \`\${accessHeader}.\${encodedAccessPayload}.\${accessSignature}\`;

        const refreshHeader = this._base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'REFRESH' }));
        const encodedRefreshPayload = this._base64UrlEncode(JSON.stringify(refreshPayload));
        const refreshSignature = this._sign(\`\${refreshHeader}.\${encodedRefreshPayload}\`);
        const refreshToken = \`\${refreshHeader}.\${encodedRefreshPayload}.\${refreshSignature}\`;

        this.refreshStore.set(refreshPayload.jti, {
            userId: user.id,
            family: tokenId,
            expiresAt: refreshPayload.exp
        });

        return { accessToken, refreshToken, expiresIn: this.accessTokenTtl };
    }

    verifyToken(token, options = {}) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error('تنسيق الرمز غير صالح');
            const [header, payload, signature] = parts;
            const expectedSignature = this._sign(\`\${header}.\${payload}\`);

            const sigBuffer = Buffer.from(signature);
            const expBuffer = Buffer.from(expectedSignature);
            if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
                throw new Error('توقيع الرمز غير متطابق');
            }

            const parsedPayload = JSON.parse(this._base64UrlDecode(payload));
            const now = Math.floor(Date.now() / 1000);
            if (parsedPayload.exp && parsedPayload.exp < now) {
                throw new Error('انتهت صلاحية الرمز');
            }

            const isRevoked = this.revokedTokens.has(parsedPayload.jti);
            if (isRevoked && !options.allowRevokedCheck) {
                throw new Error('تم إبطال هذا الرمز مسبقاً');
            }

            return { valid: !isRevoked, payload: parsedPayload, isRevoked };
        } catch (err) {
            return { valid: false, error: err.message };
        }
    }

    rotateRefreshToken(oldRefreshToken, user) {
        const verify = this.verifyToken(oldRefreshToken, { allowRevokedCheck: true });
        if (!verify.payload) throw new Error(\`فشل التحقق من رمز التحديث: \${verify.error}\`);

        const oldJti = verify.payload.jti;
        if (verify.isRevoked || !this.refreshStore.has(oldJti)) {
            // كشف محاولة إعادة استخدام التوكن وإبطال كافة توكنات الأسرة فوراً
            this.revokeFamily(verify.payload.family);
            throw new Error('تحذير أمني: تم رصد محاولة إعادة استخدام رمز تحديث ملغي!');
        }

        // إبطال التوكن القديم وتوليد زوج جديد
        this.refreshStore.delete(oldJti);
        this.revokedTokens.add(oldJti);
        return this.generateTokens(user);
    }

    revokeFamily(familyId) {
        for (const [jti, data] of this.refreshStore.entries()) {
            if (data.family === familyId) {
                this.refreshStore.delete(jti);
                this.revokedTokens.add(jti);
            }
        }
    }

    revokeToken(jti) {
        this.revokedTokens.add(jti);
        this.refreshStore.delete(jti);
    }
}

module.exports = TokenManager;
`);

    // 2. Cookie Security
    writeDoc('packages/security/cookie-security.js', `// إدارة وتأمين ملفات تعريف الارتباط (Cookie Security)
class CookieSecurity {
    static getSecureCookieOptions(isProduction = true) {
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'Strict' : 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
        };
    }

    static serializeCookie(name, value, options = {}) {
        const opts = { ...this.getSecureCookieOptions(process.env.NODE_ENV === 'production'), ...options };
        let cookieStr = \`\${encodeURIComponent(name)}=\${encodeURIComponent(value)}\`;

        if (opts.maxAge) cookieStr += \`; Max-Age=\${Math.floor(opts.maxAge / 1000)}\`;
        if (opts.path) cookieStr += \`; Path=\${opts.path}\`;
        if (opts.httpOnly) cookieStr += '; HttpOnly';
        if (opts.secure) cookieStr += '; Secure';
        if (opts.sameSite) cookieStr += \`; SameSite=\${opts.sameSite}\`;

        return cookieStr;
    }

    static parseCookies(cookieHeader) {
        if (!cookieHeader) return {};
        const cookies = {};
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length >= 2) {
                const name = decodeURIComponent(parts[0].trim());
                const val = decodeURIComponent(parts.slice(1).join('=').trim());
                cookies[name] = val;
            }
        });
        return cookies;
    }
}

module.exports = CookieSecurity;
`);

    // 3. Idempotency Middleware
    writeDoc('packages/security/idempotency-middleware.js', `// حماية المعاملات المالية ومنع التكرار (Idempotency Engine)
const crypto = require('crypto');

class IdempotencyEngine {
    constructor(options = {}) {
        this.store = new Map();
        this.ttlMs = options.ttlMs || 86400000; // 24 ساعة
    }

    _hashPayload(payload) {
        return crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');
    }

    async process(key, payload, operationHandler) {
        if (!key) {
            throw new Error('مفتاح عدم التكرار (Idempotency-Key) إلزامي للعمليات الحساسة');
        }

        const payloadHash = this._hashPayload(payload);
        const existing = this.store.get(key);

        if (existing) {
            if (existing.payloadHash !== payloadHash) {
                const err = new Error('تعارض في البيانات: مفتاح عدم التكرار مستخدم مسبقاً مع حمولة بيانات مختلفة');
                err.statusCode = 409;
                throw err;
            }

            if (existing.status === 'PENDING') {
                const err = new Error('العملية قيد التنفيذ حالياً، يرجى الانتظار');
                err.statusCode = 429;
                throw err;
            }

            return {
                idempotentReplay: true,
                statusCode: existing.statusCode,
                data: existing.data
            };
        }

        // قفل المفتاح بحالة معلق
        this.store.set(key, {
            status: 'PENDING',
            payloadHash,
            createdAt: Date.now()
        });

        try {
            const result = await operationHandler();
            this.store.set(key, {
                status: 'COMPLETED',
                payloadHash,
                statusCode: result.statusCode || 200,
                data: result.data || result,
                createdAt: Date.now()
            });

            return {
                idempotentReplay: false,
                statusCode: result.statusCode || 200,
                data: result.data || result
            };
        } catch (err) {
            this.store.delete(key);
            throw err;
        }
    }
}

module.exports = IdempotencyEngine;
`);

    // 4. Ownership Guard (IDOR Protection)
    writeDoc('packages/security/ownership-guard.js', `// حارس الملكية ومنع ثغرات التحكم غير المباشر بالكائنات (Ownership Guard / Anti-IDOR)
class OwnershipGuard {
    static validateOwnership(user, resource, options = {}) {
        if (!user || !user.id) {
            const err = new Error('غير مصرح: يجب تسجيل الدخول للتحقق من ملكية المورد');
            err.statusCode = 401;
            throw err;
        }

        if (!resource) {
            const err = new Error('المورد المطلوب غير موجود');
            err.statusCode = 404;
            throw err;
        }

        // مدير النظام يملك صلاحية التجاوز إذا تم تحديد ذلك
        if (options.allowAdmin && user.role === 'admin') {
            return true;
        }

        // فحص عزل المستأجر (Tenant Isolation)
        if (options.checkTenant && resource.tenant_id && resource.tenant_id !== user.tenantId) {
            const err = new Error('محظور: لا تملك صلاحية الوصول لبيانات هذا المستأجر');
            err.statusCode = 403;
            throw err;
        }

        // فحص ملكية المستخدم الفردية
        const ownerId = resource.user_id || resource.userId || resource.owner_id;
        if (ownerId && String(ownerId) !== String(user.id)) {
            const err = new Error('محظور: لا تملك صلاحية الوصول أو تعديل هذا المورد (IDOR Protection)');
            err.statusCode = 403;
            throw err;
        }

        return true;
    }
}

module.exports = OwnershipGuard;
`);

    // 5. Authorization (RBAC & Permissions)
    writeDoc('packages/security/authorization.js', `// مصفوفة وتفويض الصلاحيات الصارم (RBAC Authorization)
class AuthorizationMatrix {
    constructor() {
        this.roles = {
            guest: ['products:read', 'categories:read'],
            customer: ['products:read', 'categories:read', 'orders:create', 'orders:read_own', 'profile:manage_own'],
            admin: ['*']
        };
    }

    hasPermission(role, requiredPermission) {
        if (!role || !this.roles[role]) return false;
        const permissions = this.roles[role];
        if (permissions.includes('*')) return true;
        return permissions.includes(requiredPermission);
    }

    enforce(role, requiredPermission) {
        if (!this.hasPermission(role, requiredPermission)) {
            const err = new Error(\`محظور: الدور الحالي (\${role}) لا يملك الصلاحية المطلوبة (\${requiredPermission})\`);
            err.statusCode = 403;
            throw err;
        }
        return true;
    }
}

module.exports = AuthorizationMatrix;
`);

    // 6. Password Security
    writeDoc('packages/security/password.js', `// تشفير كلمات المرور الآمن (Password Security Hashing)
const crypto = require('crypto');

class PasswordSecurity {
    static async hash(password) {
        if (!password || typeof password !== 'string' || password.length < 10) {
            throw new Error('كلمة المرور يجب ألا تقل عن 10 أحرف وتكون نصاً صالحاً');
        }

        const salt = crypto.randomBytes(16).toString('hex');
        return new Promise((resolve, reject) => {
            crypto.scrypt(password.normalize('NFKC'), salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
                if (err) return reject(err);
                resolve(\`scrypt$\${salt}$\${derivedKey.toString('hex')}\`);
            });
        });
    }

    static async verify(password, storedHash) {
        if (!storedHash || !storedHash.startsWith('scrypt$')) return false;
        const parts = storedHash.split('$');
        if (parts.length !== 3) return false;

        const salt = parts[1];
        const keyHex = parts[2];
        const keyBuffer = Buffer.from(keyHex, 'hex');

        return new Promise((resolve) => {
            crypto.scrypt(password.normalize('NFKC'), salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
                if (err) return resolve(false);
                if (derivedKey.length !== keyBuffer.length) return resolve(false);
                resolve(crypto.timingSafeEqual(derivedKey, keyBuffer));
            });
        });
    }
}

module.exports = PasswordSecurity;
`);

    // 7. CSRF Protection
    writeDoc('packages/security/csrf.js', `// حماية التزوير عبر المواقع (CSRF Double-Submit Protection)
const crypto = require('crypto');

class CSRFProtection {
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static validate(cookieToken, headerToken) {
        if (!cookieToken || !headerToken) return false;
        const cBuf = Buffer.from(cookieToken);
        const hBuf = Buffer.from(headerToken);
        if (cBuf.length !== hBuf.length) return false;
        return crypto.timingSafeEqual(cBuf, hBuf);
    }
}

module.exports = CSRFProtection;
`);

    // 8. CSP Headers & Nonce
    writeDoc('packages/security/csp-headers.js', `// مولد سياسة أمان المحتوى الصارمة (Content Security Policy Generator)
const crypto = require('crypto');

class CSPGenerator {
    static generateNonce() {
        return crypto.randomBytes(16).toString('base64');
    }

    static buildHeader(options = {}) {
        const nonce = options.nonce ? \` 'nonce-\${options.nonce}'\` : '';
        const directives = [
            "default-src 'self'",
            \`script-src 'self'\${nonce} 'strict-dynamic'\`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
            "upgrade-insecure-requests"
        ];
        return directives.join('; ');
    }
}

module.exports = CSPGenerator;
`);

    // 9. Rate Limiter
    writeDoc('packages/security/rate-limit.js', `// محرك تحديد معدل الطلبات بالنافذة المنزلقة (Sliding-Window Rate Limiter)
class RateLimiter {
    constructor(options = {}) {
        this.windowMs = options.windowMs || 60000; // 1 دقيقة
        this.maxRequests = options.maxRequests || 60; // 60 طلب
        this.hits = new Map();
    }

    isAllowed(key) {
        const now = Date.now();
        const timestamps = this.hits.get(key) || [];
        const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);

        if (validTimestamps.length >= this.maxRequests) {
            const oldest = validTimestamps[0];
            const retryAfterMs = this.windowMs - (now - oldest);
            return {
                allowed: false,
                current: validTimestamps.length,
                max: this.maxRequests,
                retryAfterMs: Math.max(0, retryAfterMs)
            };
        }

        validTimestamps.push(now);
        this.hits.set(key, validTimestamps);

        return {
            allowed: true,
            current: validTimestamps.length,
            max: this.maxRequests,
            remaining: this.maxRequests - validTimestamps.length
        };
    }
}

module.exports = RateLimiter;
`);

    // 10. Secrets & Environment Validator
    writeDoc('packages/security/secrets.js', `// فحص وحماية الأسرار ومتغيرات البيئة (Secrets & Env Guard)
class SecretsGuard {
    static validateRequiredEnv(requiredKeys = []) {
        const missing = [];
        for (const key of requiredKeys) {
            if (!process.env[key] || process.env[key].trim() === '') {
                missing.push(key);
            }
        }
        if (missing.length > 0) {
            throw new Error(\`خطأ تكوين أمني: متغيرات البيئة الإلزامية التالية مفقودة: \${missing.join(', ')}\`);
        }
        return true;
    }

    static sanitizeForLogging(obj) {
        const sensitiveKeys = ['password', 'secret', 'token', 'apiKey', 'authorization', 'cookie', 'creditCard'];
        const copy = JSON.parse(JSON.stringify(obj || {}));

        function mask(target) {
            if (typeof target !== 'object' || target === null) return;
            for (const key of Object.keys(target)) {
                if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
                    target[key] = '[REDACTED_SECRET]';
                } else if (typeof target[key] === 'object') {
                    mask(target[key]);
                }
            }
        }

        mask(copy);
        return copy;
    }
}

module.exports = SecretsGuard;
`);

    // 11. Security Index
    writeDoc('packages/security/index.js', `// حزمة الأمان المركزية لنظام WebForge OS
module.exports = {
    TokenManager: require('./token-manager'),
    CookieSecurity: require('./cookie-security'),
    IdempotencyEngine: require('./idempotency-middleware'),
    OwnershipGuard: require('./ownership-guard'),
    AuthorizationMatrix: require('./authorization'),
    PasswordSecurity: require('./password'),
    CSRFProtection: require('./csrf'),
    CSPGenerator: require('./csp-headers'),
    RateLimiter: require('./rate-limit'),
    SecretsGuard: require('./secrets')
};
`);

    // 12. Security Tests
    writeDoc('packages/security/tests/security.test.js', `// الاختبارات الآلية لحزمة الأمان (Security Package Test Suite)
const assert = require('assert');
const {
    TokenManager,
    CookieSecurity,
    IdempotencyEngine,
    OwnershipGuard,
    AuthorizationMatrix,
    PasswordSecurity,
    CSRFProtection,
    CSPGenerator,
    RateLimiter,
    SecretsGuard
} = require('../index');

console.log('>>> Running Comprehensive Security Tests...');

async function runTests() {
    // 1. Token Manager Test
    const tm = new TokenManager({ accessTokenTtl: 2, refreshTokenTtl: 5 });
    const user = { id: 'usr_100', role: 'customer', tenantId: 'ten_200' };
    const tokens = tm.generateTokens(user);
    assert.strictEqual(typeof tokens.accessToken, 'string');
    
    const v1 = tm.verifyToken(tokens.accessToken);
    assert.strictEqual(v1.valid, true);
    assert.strictEqual(v1.payload.sub, 'usr_100');

    // Token Rotation
    const rotated = tm.rotateRefreshToken(tokens.refreshToken, user);
    assert.strictEqual(typeof rotated.accessToken, 'string');
    
    // Test Replay Attack on Revoked Token
    assert.throws(() => tm.rotateRefreshToken(tokens.refreshToken, user), /تحذير أمني/);
    console.log('  [PASS] Token Manager & Rotation Defense Verified');

    // 2. Password Security Test
    const pwd = 'CorrectSuperSecretPassword123!';
    const hashed = await PasswordSecurity.hash(pwd);
    assert.strictEqual(await PasswordSecurity.verify(pwd, hashed), true);
    assert.strictEqual(await PasswordSecurity.verify('WrongPassword', hashed), false);
    console.log('  [PASS] Password Hashing & Constant-Time Verification Verified');

    // 3. Ownership Guard (IDOR) Test
    const userOwner = { id: 'usr_100', role: 'customer' };
    const orderResource = { id: 'ord_500', user_id: 'usr_100' };
    const foreignOrder = { id: 'ord_999', user_id: 'usr_999' };
    
    assert.strictEqual(OwnershipGuard.validateOwnership(userOwner, orderResource), true);
    assert.throws(() => OwnershipGuard.validateOwnership(userOwner, foreignOrder), /محظور.*IDOR/);
    console.log('  [PASS] Ownership Guard & Anti-IDOR Prevention Verified');

    // 4. Authorization Matrix Test
    const auth = new AuthorizationMatrix();
    assert.strictEqual(auth.hasPermission('customer', 'orders:create'), true);
    assert.strictEqual(auth.hasPermission('guest', 'orders:create'), false);
    assert.throws(() => auth.enforce('guest', 'orders:create'), /محظور/);
    console.log('  [PASS] Authorization & Least Privilege Matrix Verified');

    // 5. Idempotency Engine Test
    const idempotency = new IdempotencyEngine();
    let executionCount = 0;
    const paymentOp = async () => {
        executionCount++;
        return { statusCode: 201, data: { paymentId: 'pay_777' } };
    };

    const res1 = await idempotency.process('idem_key_1', { amount: 100 }, paymentOp);
    assert.strictEqual(res1.idempotentReplay, false);
    assert.strictEqual(executionCount, 1);

    const res2 = await idempotency.process('idem_key_1', { amount: 100 }, paymentOp);
    assert.strictEqual(res2.idempotentReplay, true);
    assert.strictEqual(executionCount, 1); // No double execution
    console.log('  [PASS] Idempotency Engine & Anti-Double-Execution Verified');

    // 6. Rate Limiter Test
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 2 });
    assert.strictEqual(limiter.isAllowed('ip_1').allowed, true);
    assert.strictEqual(limiter.isAllowed('ip_1').allowed, true);
    assert.strictEqual(limiter.isAllowed('ip_1').allowed, false); // Blocked
    console.log('  [PASS] Sliding-Window Rate Limiter Verified');

    // 7. CSRF Protection Test
    const token = CSRFProtection.generateToken();
    assert.strictEqual(CSRFProtection.validate(token, token), true);
    assert.strictEqual(CSRFProtection.validate(token, 'tampered_token'), false);
    console.log('  [PASS] CSRF Double-Submit Validation Verified');

    // 8. Secrets Sanitization Test
    const dirtyLog = { user: 'Alice', password: 'SecretPassword', token: 'jwt.token.secret', details: { apiKey: 'key_123' } };
    const cleanLog = SecretsGuard.sanitizeForLogging(dirtyLog);
    assert.strictEqual(cleanLog.password, '[REDACTED_SECRET]');
    assert.strictEqual(cleanLog.token, '[REDACTED_SECRET]');
    assert.strictEqual(cleanLog.details.apiKey, '[REDACTED_SECRET]');
    console.log('  [PASS] Secrets Redaction & Logging Sanitizer Verified');

    console.log('>>> [SUCCESS] All Security Package Tests PASSED with 100% Evidence.');
}

runTests().catch(err => {
    console.error('>>> [FAIL] Security Test Failed:', err);
    process.exit(1);
});
`);

    console.log('>>> Security Package Layer Built Successfully.');
};
