/**
 * @file abuse-fraud-engine.js
 * @description محرك رصد ومنع الاحتيال وسوء الاستخدام والسرعات المشبوهة متعددة الأبعاد
 * WebForge OS Security Intelligence & Governance System
 */

class AbuseFraudEngine {
    constructor() {
        this.eventHistory = new Map(); // key -> Array of timestamps
        this.thresholds = {
            'LOGIN_BURST': { windowMs: 60000, maxAttempts: 5, action: 'BLOCK_AND_ALERT' },
            'COUPON_REPLAY': { windowMs: 300000, maxAttempts: 3, action: 'CHALLENGE' },
            'PAYMENT_BURST': { windowMs: 120000, maxAttempts: 3, action: 'BLOCK_AND_ALERT' },
            'OTP_REQUEST_BURST': { windowMs: 300000, maxAttempts: 3, action: 'RATE_LIMITED' }
        };
    }

    /**
     * تقييم حدث أمني ورصد التكرار وسرعة المحاولات عبر أبعاد متعددة (IP, User, Action)
     * @param {Object} eventParams 
     * @returns {Object} قرار التقييم
     */
    evaluateEvent({ actionType, ipAddress, userId, tenantId }) {
        const threshold = this.thresholds[actionType];
        if (!threshold) {
            return { allowed: true, action: 'ALLOW' };
        }

        const compositeKey = `${actionType}:${tenantId || 'global'}:${userId || ipAddress}`;
        const now = Date.now();

        if (!this.eventHistory.has(compositeKey)) {
            this.eventHistory.set(compositeKey, []);
        }

        const timestamps = this.eventHistory.get(compositeKey);
        // تصفية المحاولات القديمة خارج النافذة الزمنية
        const recentTimestamps = timestamps.filter(t => now - t < threshold.windowMs);
        recentTimestamps.push(now);
        this.eventHistory.set(compositeKey, recentTimestamps);

        if (recentTimestamps.length > threshold.maxAttempts) {
            return {
                allowed: false,
                action: threshold.action,
                reason: `Abuse threshold exceeded for action '${actionType}'. Attempts: ${recentTimestamps.length}/${threshold.maxAttempts} in ${threshold.windowMs / 1000}s.`,
                retryAfterSec: Math.ceil(threshold.windowMs / 1000)
            };
        }

        return {
            allowed: true,
            action: 'ALLOW',
            remainingAttempts: threshold.maxAttempts - recentTimestamps.length
        };
    }

    /**
     * إعادة ضبط سجل حدث معين (مثل نجاح تسجيل الدخول)
     */
    resetKey(actionType, id) {
        for (const key of this.eventHistory.keys()) {
            if (key.startsWith(actionType) && key.includes(id)) {
                this.eventHistory.delete(key);
            }
        }
    }
}

module.exports = AbuseFraudEngine;
