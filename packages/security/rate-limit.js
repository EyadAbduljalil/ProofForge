// محرك تحديد معدل الطلبات بالنافذة المنزلقة (Sliding-Window Rate Limiter)
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
