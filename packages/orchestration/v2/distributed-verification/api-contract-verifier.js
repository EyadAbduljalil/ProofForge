/**
 * @file api-contract-verifier.js
 * @description WebForge V2.2 — API Contract, Versioning & Error Model Verifier
 * محرك فحص وتدقيق عقود واجهات البرمجة (REST, GraphQL, RPC)
 * واكتشاف التغييرات الكاسرة غير الموثقة (Breaking Changes) واتساق عقود الأخطاء
 */

'use strict';

class ApiContractVerifier {
    constructor() {
        this.endpoints = new Map();
    }

    /**
     * تسجيل عقد نقطة نهاية برمجية (API Endpoint Contract)
     * @param {Object} endpointDef
     */
    registerEndpoint(endpointDef) {
        if (!endpointDef || !endpointDef.id || !endpointDef.path || !endpointDef.method) {
            throw new Error('عقد الـ API يتطلب معرفاً ومساراً (path) وطريقة استدعاء (method).');
        }

        const endpoint = {
            id: String(endpointDef.id),
            path: String(endpointDef.path),
            method: String(endpointDef.method).toUpperCase(),
            style: endpointDef.style || 'REST', // REST, GRAPHQL, RPC
            version: endpointDef.version || 'v1',
            deprecated: Boolean(endpointDef.deprecated),
            authRequired: Boolean(endpointDef.authRequired),
            requiredRoles: Array.isArray(endpointDef.requiredRoles) ? endpointDef.requiredRoles : [],
            requestSchema: endpointDef.requestSchema || { requiredFields: [] },
            responseSchema: endpointDef.responseSchema || { requiredFields: [] },
            expectedStatusCodes: Array.isArray(endpointDef.expectedStatusCodes) ? endpointDef.expectedStatusCodes : [200]
        };

        this.endpoints.set(endpoint.id, endpoint);
        return endpoint;
    }

    /**
     * التحقق من استدعاء API مقابل العقد المسجل
     * @param {string} endpointId
     * @param {Object} callContext
     */
    verifyCall(endpointId, callContext = {}) {
        const ep = this.endpoints.get(endpointId);
        if (!ep) {
            return {
                endpointId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isCompliant: false,
                reason: 'نقطة النهاية غير مسجلة'
            };
        }

        const { actor, requestPayload, responseStatus, responsePayload } = callContext;
        const violations = [];

        // 1. فحص المصادقة والصلاحيات (Auth Guard)
        if (ep.authRequired) {
            if (!actor || !actor.isAuthenticated) {
                violations.push({
                    type: 'AUTHENTICATION_REQUIRED',
                    severity: 'CRITICAL',
                    message: `نقطة النهاية (${ep.path}) تتطلب مصادقة صريحة.`
                });
            } else if (ep.requiredRoles.length > 0) {
                const hasRole = ep.requiredRoles.some(r => actor.roles && actor.roles.includes(r));
                if (!hasRole) {
                    violations.push({
                        type: 'UNAUTHORIZED_ROLE',
                        severity: 'CRITICAL',
                        message: `الفاعل يفتقر للأدوار المصرح بها: ${ep.requiredRoles.join(', ')}`
                    });
                }
            }
        }

        // 2. فحص حمولة الطلب (Request Payload Validation)
        if (ep.requestSchema && ep.requestSchema.requiredFields) {
            const req = requestPayload || {};
            for (const f of ep.requestSchema.requiredFields) {
                if (req[f] === undefined || req[f] === null) {
                    violations.push({
                        type: 'MISSING_REQUEST_FIELD',
                        severity: 'HIGH',
                        field: f,
                        message: `الحقل الإلزامي (${f}) مفقود في حمولة الطلب.`
                    });
                }
            }
        }

        // 3. فحص كود الحالة المتوقع
        if (responseStatus && !ep.expectedStatusCodes.includes(responseStatus)) {
            violations.push({
                type: 'UNEXPECTED_STATUS_CODE',
                severity: 'HIGH',
                status: responseStatus,
                expected: ep.expectedStatusCodes,
                message: `كود الاستجابة (${responseStatus}) غير متطابق مع العقد (${ep.expectedStatusCodes.join(', ')}).`
            });
        }

        // 4. فحص حمولة الاستجابة (Response Payload Validation)
        if (responsePayload && ep.responseSchema && ep.responseSchema.requiredFields) {
            for (const rf of ep.responseSchema.requiredFields) {
                if (responsePayload[rf] === undefined) {
                    violations.push({
                        type: 'MISSING_RESPONSE_FIELD',
                        severity: 'HIGH',
                        field: rf,
                        message: `حقل الاستجابة الإلزامي (${rf}) مفقود في الرد الملاحظ.`
                    });
                }
            }
        }

        const isCompliant = violations.length === 0;
        return {
            endpointId: ep.id,
            path: ep.path,
            method: ep.method,
            status: isCompliant ? 'VERIFIED' : 'CONTRACT_VIOLATION',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            violationsCount: violations.length,
            violations
        };
    }

    /**
     * مقارنة إصدارين من العقد لاكتشاف التغييرات الكاسرة (Breaking Changes Detection)
     * @param {Object} oldContract
     * @param {Object} newContract
     */
    detectBreakingChanges(oldContract, newContract) {
        const breakingChanges = [];

        // 1. حذف حقول من الاستجابة المتوقعة
        const oldRespFields = (oldContract.responseSchema && oldContract.responseSchema.requiredFields) || [];
        const newRespFields = (newContract.responseSchema && newContract.responseSchema.requiredFields) || [];
        for (const f of oldRespFields) {
            if (!newRespFields.includes(f)) {
                breakingChanges.push({
                    type: 'RESPONSE_FIELD_REMOVED',
                    severity: 'CRITICAL',
                    field: f,
                    message: `تم حذف الحقل (${f}) من استجابة العقد الجديد مما يكسر توافق العملاء الحاليين.`
                });
            }
        }

        // 2. إضافة حقول إلزامية جديدة في الطلب
        const oldReqFields = (oldContract.requestSchema && oldContract.requestSchema.requiredFields) || [];
        const newReqFields = (newContract.requestSchema && newContract.requestSchema.requiredFields) || [];
        for (const nf of newReqFields) {
            if (!oldReqFields.includes(nf)) {
                breakingChanges.push({
                    type: 'NEW_REQUIRED_REQUEST_FIELD',
                    severity: 'HIGH',
                    field: nf,
                    message: `تمت إضافة حقل إلزامي جديد (${nf}) في الطلب دون توفير قيمة افتراضية.`
                });
            }
        }

        // 3. حذف أو تشديد المتطلبات الأمنية فجأة
        if (!oldContract.authRequired && newContract.authRequired) {
            breakingChanges.push({
                type: 'UNANNOUNCED_AUTH_ENFORCEMENT',
                severity: 'HIGH',
                message: 'فرض المصادقة على نقطة نهاية كانت مفتوحة سابقاً دون تدرج في الإصدارات.'
            });
        }

        const isBackwardCompatible = breakingChanges.length === 0;
        return {
            isBackwardCompatible,
            status: isBackwardCompatible ? 'COMPATIBLE' : 'BREAKING_CHANGES_DETECTED',
            gate: isBackwardCompatible ? 'PASS' : 'FAIL',
            breakingChangesCount: breakingChanges.length,
            breakingChanges
        };
    }
}

module.exports = {
    ApiContractVerifier
};
