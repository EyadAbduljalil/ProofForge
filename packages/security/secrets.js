// فحص وحماية الأسرار ومتغيرات البيئة (Secrets & Env Guard)
class SecretsGuard {
    static validateRequiredEnv(requiredKeys = []) {
        const missing = [];
        for (const key of requiredKeys) {
            if (!process.env[key] || process.env[key].trim() === '') {
                missing.push(key);
            }
        }
        if (missing.length > 0) {
            throw new Error(`خطأ تكوين أمني: متغيرات البيئة الإلزامية التالية مفقودة: ${missing.join(', ')}`);
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
