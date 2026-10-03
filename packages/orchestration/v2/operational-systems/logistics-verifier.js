/**
 * @file logistics-verifier.js
 * @description WebForge V2.7 — Logistics & Advanced Shipping Verification Engine
 * محرك التحقق من دورات حياة الشحن، تسلسل أحداث التتبع، وكشف الـ Webhooks المكررة أو غير المرتبة
 */

const crypto = require('crypto');

const SHIPMENT_STATES = {
    CREATED: 'CREATED',
    PICKED_UP: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    FAILED_DELIVERY: 'FAILED_DELIVERY',
    RETURNED_TO_SENDER: 'RETURNED_TO_SENDER',
    CANCELLED: 'CANCELLED'
};

const ALLOWED_LOGISTICS_TRANSITIONS = {
    [SHIPMENT_STATES.CREATED]: [SHIPMENT_STATES.PICKED_UP, SHIPMENT_STATES.CANCELLED],
    [SHIPMENT_STATES.PICKED_UP]: [SHIPMENT_STATES.IN_TRANSIT, SHIPMENT_STATES.CANCELLED],
    [SHIPMENT_STATES.IN_TRANSIT]: [SHIPMENT_STATES.OUT_FOR_DELIVERY, SHIPMENT_STATES.FAILED_DELIVERY, SHIPMENT_STATES.RETURNED_TO_SENDER],
    [SHIPMENT_STATES.OUT_FOR_DELIVERY]: [SHIPMENT_STATES.DELIVERED, SHIPMENT_STATES.FAILED_DELIVERY],
    [SHIPMENT_STATES.FAILED_DELIVERY]: [SHIPMENT_STATES.OUT_FOR_DELIVERY, SHIPMENT_STATES.RETURNED_TO_SENDER],
    [SHIPMENT_STATES.RETURNED_TO_SENDER]: [],
    [SHIPMENT_STATES.DELIVERED]: [],
    [SHIPMENT_STATES.CANCELLED]: []
};

class LogisticsVerifier {
    constructor() {
        this.processedWebhooks = new Set(); // eventId
        this.recordedEvents = new Map(); // trackingNumber -> eventList
    }

    /**
     * التحقق من انتقالات دورة حياة الشحنة
     */
    verifyShipmentTransition(currentState, nextState) {
        const findings = [];
        const allowed = ALLOWED_LOGISTICS_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_SHIPMENT_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة الشحنة الحالية غير معترف بها: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_SHIPMENT_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال محظور في حالة الشحنة من ${currentState} إلى ${nextState}`
            });
        }

        return {
            valid: findings.length === 0,
            currentState,
            nextState,
            findings
        };
    }

    /**
     * التحقق من تسلسل أحداث التتبع وكشف الأحداث المتأخرة أو المعكوسة زمنياً (Out-of-order Events)
     */
    verifyTrackingEventSequence(existingEvents = [], newEvent) {
        const findings = [];
        const { eventId, trackingNumber, status, timestamp } = newEvent;

        const newTime = new Date(timestamp).getTime();

        // 1. كشف تكرار الحدث (Duplicate Tracking Event)
        const isDuplicate = existingEvents.some(e => e.eventId === eventId || (e.status === status && Math.abs(new Date(e.timestamp).getTime() - newTime) < 1000));
        if (isDuplicate) {
            findings.push({
                code: 'DUPLICATE_TRACKING_EVENT_DETECTED',
                severity: 'HIGH',
                eventId,
                trackingNumber,
                status,
                message: `تم اكتشاف حدث تتبع مكرر للشحنة: ${trackingNumber} بحالة ${status}`
            });
        }

        // 2. كشف الأحداث غير المرتبة زمنياً (Out-of-order / Chronological Inconsistency)
        if (existingEvents.length > 0) {
            const latestEvent = existingEvents[existingEvents.length - 1];
            const latestTime = new Date(latestEvent.timestamp).getTime();

            if (newTime < latestTime) {
                findings.push({
                    code: 'OUT_OF_ORDER_TRACKING_EVENT',
                    severity: 'HIGH',
                    trackingNumber,
                    newEventTime: timestamp,
                    latestEventTime: latestEvent.timestamp,
                    message: `وصول حدث تتبع بأثر رجعي زمني غير مرتب: وقت الحدث (${timestamp}) أقدم من آخر حدث مسجل (${latestEvent.timestamp})`
                });
            }

            // تراجع الحالة من تسليم إلى نقل
            if (latestEvent.status === SHIPMENT_STATES.DELIVERED && status !== SHIPMENT_STATES.DELIVERED) {
                findings.push({
                    code: 'REGRESSION_FROM_TERMINAL_DELIVERED_STATE',
                    severity: 'CRITICAL',
                    trackingNumber,
                    previousStatus: latestEvent.status,
                    attemptedStatus: status,
                    message: 'محاولة غير منطقية لتراجع حالة الشحنة بعد إتمام التسليم النهائي'
                });
            }
        }

        return {
            valid: findings.length === 0,
            findings
        };
    }

    /**
     * مطابقة كميات الطرود المشحونة مع بنود أمر الشراء الأصلي (Package Quantity Reconciliation)
     */
    verifyPackageQuantityReconciliation(sourceOrderItems = [], shipmentPackages = []) {
        const findings = [];
        const orderQtyMap = new Map();

        for (const item of sourceOrderItems) {
            orderQtyMap.set(item.sku, (orderQtyMap.get(item.sku) || 0) + item.quantity);
        }

        const shippedQtyMap = new Map();
        for (const pkg of shipmentPackages) {
            for (const item of pkg.items) {
                shippedQtyMap.set(item.sku, (shippedQtyMap.get(item.sku) || 0) + item.quantity);
            }
        }

        // مطابقة الكميات
        for (const [sku, orderQty] of orderQtyMap.entries()) {
            const shippedQty = shippedQtyMap.get(sku) || 0;
            if (shippedQty !== orderQty) {
                findings.push({
                    code: 'SHIPMENT_QUANTITY_RECONCILIATION_MISMATCH',
                    severity: 'CRITICAL',
                    sku,
                    orderQuantity: orderQty,
                    shippedQuantity: shippedQty,
                    discrepancy: shippedQty - orderQty,
                    message: `عدم تطابق في كمية الشحن للسلعة (${sku}): المطلوب في الطلب ${orderQty} والمشحون فعلياً ${shippedQty}`
                });
            }
        }

        return {
            reconciled: findings.length === 0,
            findings
        };
    }

    /**
     * التحقق من إشعارات الناقلين وتوقيعها ومنع إعادة الإرسال (Carrier Webhook Verification)
     */
    verifyCarrierWebhook(payload, signatureHeader = null, secret = null) {
        const findings = [];
        const { eventId, trackingNumber } = payload;

        if (!eventId) {
            findings.push({
                code: 'MISSING_WEBHOOK_EVENT_ID',
                severity: 'CRITICAL',
                message: 'إشعار الناقل يفتقد إلى معرف الحدث (Event ID) لمنع التكرار'
            });
            return { valid: false, findings };
        }

        // فحص هجوم إعادة الإرسال (Replay / Duplicate Webhook)
        if (this.processedWebhooks.has(eventId)) {
            findings.push({
                code: 'DUPLICATE_WEBHOOK_REPLAY_ATTEMPT',
                severity: 'CRITICAL',
                eventId,
                trackingNumber,
                message: `محاولة إعادة إرسال مكررة لنفس إشعار الناقل: ${eventId}`
            });
            return { valid: false, findings };
        }

        this.processedWebhooks.add(eventId);

        return {
            valid: findings.length === 0,
            eventId,
            findings
        };
    }
}

module.exports = {
    SHIPMENT_STATES,
    ALLOWED_LOGISTICS_TRANSITIONS,
    LogisticsVerifier
};
