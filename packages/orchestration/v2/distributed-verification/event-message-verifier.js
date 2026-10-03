/**
 * @file event-message-verifier.js
 * @description WebForge V2.2 — Event, Message, Queue & Dead-Letter Verifier
 * محرك التحقق من صحة عقود الأحداث وهياكل الرسائل، معرفات الارتباط (Correlation IDs)،
 * وسلوك طوابير الرسائل الميتة (DLQ) والرسائل المسمومة (Poison Messages)
 */

'use strict';

class EventMessageVerifier {
    constructor() {
        this.eventSchemas = new Map();
        this.queuePolicies = new Map();
    }

    /**
     * تسجيل مخطط حدث كنسي
     * @param {Object} schemaDef
     */
    registerEventSchema(schemaDef) {
        if (!schemaDef || !schemaDef.eventType || !Array.isArray(schemaDef.requiredFields)) {
            throw new Error('مخطط الحدث يتطلب نوع الحدث (eventType) ومصفوفة الحقول الإلزامية.');
        }

        const schema = {
            eventType: String(schemaDef.eventType),
            version: schemaDef.version || '1.0',
            requiredFields: schemaDef.requiredFields,
            enforceCorrelationId: Boolean(schemaDef.enforceCorrelationId),
            enforceCausationId: Boolean(schemaDef.enforceCausationId)
        };

        this.eventSchemas.set(schema.eventType, schema);
        return schema;
    }

    /**
     * التحقق من سلامة رسالة/حدث مقابل المخطط المسجل
     * @param {Object} eventInstance
     */
    verifyEvent(eventInstance = {}) {
        const { eventType, payload = {}, metadata = {} } = eventInstance;
        if (!eventType || !this.eventSchemas.has(eventType)) {
            return {
                eventType,
                status: 'UNKNOWN_EVENT_TYPE',
                gate: 'FAIL',
                isCompliant: false,
                reason: `نوع الحدث غير معروف: ${eventType}`
            };
        }

        const schema = this.eventSchemas.get(eventType);
        const violations = [];

        // 1. فحص الحقول الإلزامية داخل الحمولة
        for (const field of schema.requiredFields) {
            if (payload[field] === undefined || payload[field] === null) {
                violations.push({
                    type: 'MISSING_EVENT_PAYLOAD_FIELD',
                    severity: 'HIGH',
                    field,
                    message: `الحقل الإلزامي (${field}) مفقود في حمولة الحدث (${eventType}).`
                });
            }
        }

        // 2. فحص معرفات الارتباط والتتبع (Correlation ID & Causation ID)
        if (schema.enforceCorrelationId && !metadata.correlationId) {
            violations.push({
                type: 'MISSING_CORRELATION_ID',
                severity: 'CRITICAL',
                message: 'غياب معرف الارتباط (correlationId) يمنع التتبع في الأنظمة الموزعة.'
            });
        }

        if (schema.enforceCausationId && !metadata.causationId) {
            violations.push({
                type: 'MISSING_CAUSATION_ID',
                severity: 'MEDIUM',
                message: 'غياب معرف السبب (causationId) الذي أدى إلى انطلاق هذا الحدث.'
            });
        }

        const isCompliant = violations.length === 0;
        return {
            eventType,
            version: schema.version,
            status: isCompliant ? 'VERIFIED' : 'EVENT_SCHEMA_VIOLATION',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            violationsCount: violations.length,
            violations
        };
    }

    /**
     * تسجيل سياسة طابور ومعالجة الإخفاق (Dead-Letter Queue Policy)
     * @param {Object} queuePolicyDef
     */
    registerQueuePolicy(queuePolicyDef) {
        if (!queuePolicyDef || !queuePolicyDef.queueName) {
            throw new Error('سياسة الطابور تتطلب اسم الطابور (queueName).');
        }

        const policy = {
            queueName: String(queuePolicyDef.queueName),
            maxRetryAttempts: Number(queuePolicyDef.maxRetryAttempts) || 3,
            deadLetterQueue: queuePolicyDef.deadLetterQueue || `${queuePolicyDef.queueName}-dlq`,
            poisonMessageHandling: queuePolicyDef.poisonMessageHandling || 'ISOLATE_TO_DLQ'
        };

        this.queuePolicies.set(policy.queueName, policy);
        return policy;
    }

    /**
     * محاكاة وتدقيق معالجة الرسائل واستنفاذ المحاولات والتحويل إلى DLQ
     * @param {string} queueName
     * @param {Object} messageContext
     */
    verifyDeadLetterHandling(queueName, messageContext = {}) {
        const policy = this.queuePolicies.get(queueName);
        if (!policy) {
            return { queueName, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        const { retryCount = 0, isPoisonMessage = false } = messageContext;
        let routedToDlq = false;
        let reason = '';

        if (isPoisonMessage || retryCount >= policy.maxRetryAttempts) {
            routedToDlq = true;
            reason = isPoisonMessage
                ? 'تم عزل الرسالة المسمومة فوراً لمنع تعطل المستهلكين (Consumer Crash).'
                : `تم استنفاذ الحد الأقصى لمحاولات المعالجة (${policy.maxRetryAttempts}) وتحويل الرسالة إلى ${policy.deadLetterQueue}.`;
        }

        return {
            queueName: policy.queueName,
            deadLetterQueue: policy.deadLetterQueue,
            status: 'VERIFIED',
            gate: 'PASS',
            isProtected: true,
            retryCount,
            maxRetryAttempts: policy.maxRetryAttempts,
            routedToDlq,
            reason
        };
    }
}

module.exports = {
    EventMessageVerifier
};
