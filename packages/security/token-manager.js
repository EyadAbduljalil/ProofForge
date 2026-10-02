// إدارة الجلسات وتدوير الرموز الآمنة (Token Manager)
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
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
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
        const accessSignature = this._sign(`${accessHeader}.${encodedAccessPayload}`);
        const accessToken = `${accessHeader}.${encodedAccessPayload}.${accessSignature}`;

        const refreshHeader = this._base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'REFRESH' }));
        const encodedRefreshPayload = this._base64UrlEncode(JSON.stringify(refreshPayload));
        const refreshSignature = this._sign(`${refreshHeader}.${encodedRefreshPayload}`);
        const refreshToken = `${refreshHeader}.${encodedRefreshPayload}.${refreshSignature}`;

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
            const expectedSignature = this._sign(`${header}.${payload}`);

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
        if (!verify.payload) throw new Error(`فشل التحقق من رمز التحديث: ${verify.error}`);

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
