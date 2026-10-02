// حماية التزوير عبر المواقع (CSRF Double-Submit Protection)
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
