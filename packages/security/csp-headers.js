// مولد سياسة أمان المحتوى الصارمة (Content Security Policy Generator)
const crypto = require('crypto');

class CSPGenerator {
    static generateNonce() {
        return crypto.randomBytes(16).toString('base64');
    }

    static buildHeader(options = {}) {
        const nonce = options.nonce ? ` 'nonce-${options.nonce}'` : '';
        const directives = [
            "default-src 'self'",
            `script-src 'self'${nonce} 'strict-dynamic'`,
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
