// حماية المعاملات المالية ومنع التكرار (Idempotency Engine)
const crypto = require('crypto');

class IdempotencyEngine {
    constructor(options = {}) {
        this.store = new Map();
        this.ttlMs = options.ttlMs || 86400000; // 24 ساعة
    }

    _hashPayload(payload) {
        return crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');
    }

    async process(key, payload, operationHandler) {
        if (!key) {
            throw new Error('مفتاح عدم التكرار (Idempotency-Key) إلزامي للعمليات الحساسة');
        }

        const payloadHash = this._hashPayload(payload);
        const existing = this.store.get(key);

        if (existing) {
            if (existing.payloadHash !== payloadHash) {
                const err = new Error('تعارض في البيانات: مفتاح عدم التكرار مستخدم مسبقاً مع حمولة بيانات مختلفة');
                err.statusCode = 409;
                throw err;
            }

            if (existing.status === 'PENDING') {
                const err = new Error('العملية قيد التنفيذ حالياً، يرجى الانتظار');
                err.statusCode = 429;
                throw err;
            }

            return {
                idempotentReplay: true,
                statusCode: existing.statusCode,
                data: existing.data
            };
        }

        // قفل المفتاح بحالة معلق
        this.store.set(key, {
            status: 'PENDING',
            payloadHash,
            createdAt: Date.now()
        });

        try {
            const result = await operationHandler();
            this.store.set(key, {
                status: 'COMPLETED',
                payloadHash,
                statusCode: result.statusCode || 200,
                data: result.data || result,
                createdAt: Date.now()
            });

            return {
                idempotentReplay: false,
                statusCode: result.statusCode || 200,
                data: result.data || result
            };
        } catch (err) {
            this.store.delete(key);
            throw err;
        }
    }
}

module.exports = IdempotencyEngine;
