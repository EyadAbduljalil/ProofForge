/**
 * @file payment-sandbox-adapter.js
 * @description محول بوابات الدفع المحصن يدعم البيئة التجريبية (Sandbox) والتحقق من التوقيع بالوقت الثابت
 * WebForge OS Enterprise Payment & Settlement Adapter
 */

const crypto = require('crypto');

class PaymentSandboxAdapter {
    constructor(options = {}) {
        this.secret = options.webhookSecret || process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_test_secure_entropy_key_32_bytes_min';
        this.settlementDelayMs = options.settlementDelayMs || 0;
        this.processedTransactions = new Set();
    }

    /**
     * معالجة أمر دفع تجريبي محكم وآمن
     * @param {Object} paymentIntent 
     * @returns {Promise<Object>}
     */
    async processPayment(paymentIntent) {
        const { amountCents, currency = 'USD', customerId, idempotencyKey } = paymentIntent;

        if (!amountCents || amountCents <= 0) {
            throw new Error('المبلغ يجب أن يكون رقماً موجباً أكبر من الصفر');
        }

        if (!customerId) {
            throw new Error('معرف العميل مطلوب لإتمام عملية الدفع');
        }

        if (idempotencyKey && this.processedTransactions.has(idempotencyKey)) {
            return {
                status: 'DUPLICATE_IGNORED',
                transactionId: `tx_replay_${idempotencyKey}`,
                amountCents,
                currency,
                isReplay: true
            };
        }

        if (idempotencyKey) {
            this.processedTransactions.add(idempotencyKey);
        }

        const transactionId = `tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        return {
            status: 'SUCCEEDED',
            transactionId,
            amountCents,
            currency,
            customerId,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * التحقق من توقيع Webhook بالوقت الثابت
     * @param {string|Buffer} payload 
     * @param {string} signatureHeader 
     * @returns {boolean}
     */
    verifyWebhookSignature(payload, signatureHeader) {
        if (!signatureHeader || !payload) return false;

        const expectedSignature = crypto
            .createHmac('sha256', this.secret)
            .update(payload)
            .digest('hex');

        const sigBuffer = Buffer.from(signatureHeader);
        const expBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expBuffer.length) return false;
        return crypto.timingSafeEqual(sigBuffer, expBuffer);
    }
}

module.exports = PaymentSandboxAdapter;
