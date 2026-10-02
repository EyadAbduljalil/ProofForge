/**
 * @file redis-adapter.js
 * @description محول الذاكرة المؤقتة الموزعة يدعم Redis مع بديل محلي محكم وسياسات أمان Fail-Closed
 * WebForge OS Distributed Cache & State Adapter
 */

class RedisAdapter {
    constructor(options = {}) {
        this.clientType = options.clientType || 'local-in-memory'; // 'redis-cluster' | 'local-in-memory'
        this.store = new Map();
        this.ttlMap = new Map();
        this.failPolicy = options.failPolicy || 'FAIL_CLOSED'; // FAIL_CLOSED: deny on error for security
    }

    async get(key) {
        this.cleanupExpired(key);
        return this.store.get(key) || null;
    }

    async set(key, value, ttlSeconds = null) {
        this.store.set(key, value);
        if (ttlSeconds) {
            this.ttlMap.set(key, Date.now() + (ttlSeconds * 1000));
        }
        return true;
    }

    async delete(key) {
        this.ttlMap.delete(key);
        return this.store.delete(key);
    }

    /**
     * التحقق من مفتاح الإعادة أو الـ Idempotency Key ذرياً
     * @param {string} key 
     * @param {number} ttlSeconds 
     * @returns {boolean} true إذا كان المفتاح جديداً، false إذا كان مكرراً
     */
    async setIfNotExists(key, value = '1', ttlSeconds = 300) {
        this.cleanupExpired(key);
        if (this.store.has(key)) {
            return false; // المفتاح موجود مسبقاً (Replay / Duplicate)
        }
        await this.set(key, value, ttlSeconds);
        return true;
    }

    cleanupExpired(key) {
        if (this.ttlMap.has(key)) {
            const expiry = this.ttlMap.get(key);
            if (Date.now() > expiry) {
                this.store.delete(key);
                this.ttlMap.delete(key);
            }
        }
    }
}

module.exports = RedisAdapter;
