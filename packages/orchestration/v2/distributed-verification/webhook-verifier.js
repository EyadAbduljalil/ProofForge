/**
 * @file webhook-verifier.js
 * @description WebForge V2.2 — Webhook Security & Replay Attack Verifier
 * محرك تدقيق خطافات الويب (Webhooks) والتوقيع الرقمي المشفر (HMAC)
 * والتحقق من الطابع الزمني ومكافحة هجمات الإعادة (Anti-Replay Attack)
 */

'use strict';

const crypto = require('crypto');

class WebhookVerifier {
    constructor() {
        this.registeredEndpoints = new Map();
        this.processedSignatures = new Map(); // signature -> timestamp
    }

    /**
     * تسجيل نقطة استقبال webhook كنسية
     * @param {Object} endpointDef
     */
    registerWebhook(endpointDef) {
        if (!endpointDef || !endpointDef.id || !endpointDef.secret) {
            throw new Error('الـ Webhook يتطلب معرفاً وسراً تشفيرياً (secret).');
        }

        const endpoint = {
            id: String(endpointDef.id),
            secret: String(endpointDef.secret),
            algorithm: endpointDef.algorithm || 'sha256',
            toleranceSeconds: Number(endpointDef.toleranceSeconds) || 300, // 5 دقائق افتراضياً
            enforceSignature: endpointDef.enforceSignature !== false
        };

        this.registeredEndpoints.set(endpoint.id, endpoint);
        return endpoint;
    }

    /**
     * التحقق من شرعية حمولة الـ Webhook الواردة
     * @param {string} endpointId
     * @param {Object} incomingRequest
     */
    verifyIncomingPayload(endpointId, incomingRequest = {}) {
        const ep = this.registeredEndpoints.get(endpointId);
        if (!ep) {
            return {
                endpointId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isValid: false,
                reason: 'نقطة استقبال Webhook غير مسجلة'
            };
        }

        const { rawPayload, signature, timestamp } = incomingRequest;

        // 1. فحص وجود التوقيع
        if (ep.enforceSignature && !signature) {
            return {
                endpointId,
                status: 'MISSING_SIGNATURE',
                gate: 'FAIL',
                isValid: false,
                reason: 'الطلب يفتقر إلى توقيع HMAC الرقمي.'
            };
        }

        // 2. فحص الطابع الزمني لمنع هجمات الإعادة (Timestamp Drift / Replay)
        const now = Math.floor(Date.now() / 1000);
        if (timestamp) {
            const timeDiff = Math.abs(now - Number(timestamp));
            if (timeDiff > ep.toleranceSeconds) {
                return {
                    endpointId,
                    status: 'EXPIRED_OR_DRIFTED_TIMESTAMP',
                    gate: 'FAIL',
                    isValid: false,
                    reason: `فارق التوقيت (${timeDiff} ثانية) تجاوز الحد الأقصى المسموح (${ep.toleranceSeconds} ثانية). خطر Replay Attack.`
                };
            }
        }

        // 3. فحص التكرار الصريح لنفس التوقيع (Strict Replay Cache)
        if (signature && this.processedSignatures.has(signature)) {
            return {
                endpointId,
                status: 'REPLAY_ATTACK_DETECTED',
                gate: 'FAIL',
                isValid: false,
                reason: 'تم رصد استخدام مكرر لنفس التوقيع الرقمي (Replay Attack).'
            };
        }

        // 4. التحقق الرياضي التشفيري المقاوم لهجمات التوقيت (Constant-Time HMAC Verification)
        try {
            const dataToSign = timestamp ? `${timestamp}.${rawPayload}` : rawPayload;
            const expectedSignature = crypto
                .createHmac(ep.algorithm, ep.secret)
                .update(dataToSign)
                .digest('hex');

            const sigBuf = Buffer.from(signature || '', 'hex');
            const expBuf = Buffer.from(expectedSignature, 'hex');

            let matches = false;
            if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
                matches = true;
            }

            if (!matches) {
                return {
                    endpointId,
                    status: 'SIGNATURE_MISMATCH',
                    gate: 'FAIL',
                    isValid: false,
                    reason: 'فشل التحقق من التوقيع الرقمي HMAC. التوقيع غير مطابق أو مزور.'
                };
            }

            if (signature) {
                this.processedSignatures.set(signature, now);
            }

            return {
                endpointId,
                status: 'VERIFIED',
                gate: 'PASS',
                isValid: true,
                verifiedAt: new Date().toISOString()
            };
        } catch (err) {
            return {
                endpointId,
                status: 'CRYPTOGRAPHIC_VERIFICATION_ERROR',
                gate: 'FAIL',
                isValid: false,
                reason: `خطأ تشفيري: ${err.message}`
            };
        }
    }
}

module.exports = {
    WebhookVerifier
};
