// محرك التحقق من توقيع وأمان الـ Webhooks
const crypto = require('crypto');

class WebhookVerifier {
    static verifySignature(rawPayload, signatureHeader, secret, options = {}) {
        if (!rawPayload || !signatureHeader || !secret) {
            throw new Error('بيانات التحقق من الـ Webhook غير مكتملة');
        }

        const toleranceSeconds = options.toleranceSeconds || 300; // 5 دقائق لمنع هجمات الإعادة Replay
        const now = Math.floor(Date.now() / 1000);

        // دعم الترويسات التي تحتوي على timestamp مثل Stripe t=...,v1=...
        let timestamp = null;
        let signature = signatureHeader;

        if (signatureHeader.includes('t=') && signatureHeader.includes('v1=')) {
            const parts = signatureHeader.split(',');
            for (const part of parts) {
                if (part.startsWith('t=')) timestamp = parseInt(part.substring(2), 10);
                if (part.startsWith('v1=')) signature = part.substring(3);
            }

            if (timestamp && Math.abs(now - timestamp) > toleranceSeconds) {
                throw new Error('فشل التحقق: طابع الوقت للـ Webhook قديم جداً (مخاطر هجوم الإعادة Replay Attack)');
            }
        }

        const payloadToSign = timestamp ? `${timestamp}.${rawPayload}` : rawPayload;
        const expectedSignature = crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex');

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSignature);

        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
            throw new Error('توقيع الـ Webhook غير مطابق (Invalid Webhook Signature)');
        }

        return { valid: true, timestamp };
    }
}

module.exports = WebhookVerifier;
