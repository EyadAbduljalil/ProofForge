/**
 * @file universal-invariant-engine.js
 * @description WebForge V2.1 — Universal Invariant Engine
 * محرك الثوابت المعمم لجميع النطاقات والتطبيقات (مالية، تجارة إلكترونية، لوجستية، رعاية صحية)
 * مستقل عن التقنيات ويفرض الثوابت الرياضية والهندسية
 */

'use strict';

class UniversalInvariantEngine {
    constructor() {
        this.invariants = new Map();
        this.evaluations = [];
    }

    /**
     * تسجيل ثابت عام كنسي
     * @param {Object} def
     */
    registerInvariant(def) {
        if (!def || !def.id || !def.title || !def.predicate) {
            throw new Error('الثابت العام يتطلب معرفاً، عنواناً، ودالة تحقق (predicate).');
        }

        if (this.invariants.has(def.id)) {
            throw new Error(`معرف الثابت مكرر: ${def.id}`);
        }

        const invariant = {
            id: String(def.id),
            title: String(def.title),
            domain: def.domain || 'UNIVERSAL',
            severity: def.severity || 'CRITICAL',
            preconditions: Array.isArray(def.preconditions) ? def.preconditions : [],
            predicate: def.predicate,
            expectedResult: def.expectedResult !== undefined ? def.expectedResult : true,
            violationCondition: def.violationCondition || 'عدم تطابق النتيجة مع القيمة المتوقعة',
            remediationGuidance: def.remediationGuidance || 'مراجعة منطق العملية وعزل الحالة غير المتسقة',
            traceability: def.traceability || {}
        };

        this.invariants.set(invariant.id, invariant);
        return invariant;
    }

    /**
     * تقييم ثابت معين مقابل حالة نظام محددة
     * @param {string} id
     * @param {Object} state
     * @param {Object} evidence
     */
    evaluate(id, state = {}, evidence = null) {
        const inv = this.invariants.get(id);
        if (!inv) {
            return {
                id,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isCompliant: false,
                reason: `الثابت غير مسجل: ${id}`
            };
        }

        // فحص وجود دليل مادي
        const hasEvidence = Boolean(evidence && (evidence.source || evidence.checksum || evidence.logRef));
        if (!hasEvidence) {
            return {
                id: inv.id,
                title: inv.title,
                severity: inv.severity,
                status: 'INSUFFICIENT_EVIDENCE',
                gate: 'FAIL',
                isCompliant: false,
                reason: 'لا يمكن اعتماد الامتثال للثابت في غياب الدليل المادي القاطع.',
                remediationGuidance: inv.remediationGuidance
            };
        }

        try {
            const actualResult = inv.predicate(state);
            const isCompliant = actualResult === inv.expectedResult;

            const record = {
                id: inv.id,
                title: inv.title,
                severity: inv.severity,
                domain: inv.domain,
                status: isCompliant ? 'VERIFIED' : 'VIOLATED',
                gate: isCompliant ? 'PASS' : 'FAIL',
                isCompliant,
                expected: inv.expectedResult,
                actual: actualResult,
                remediationGuidance: isCompliant ? null : inv.remediationGuidance,
                timestamp: new Date().toISOString()
            };

            this.evaluations.push(record);
            return record;
        } catch (err) {
            const errRecord = {
                id: inv.id,
                title: inv.title,
                severity: 'CRITICAL',
                status: 'EVALUATION_ERROR',
                gate: 'FAIL',
                isCompliant: false,
                reason: `خطأ أثناء تقييم الثابت: ${err.message}`,
                remediationGuidance: inv.remediationGuidance
            };
            this.evaluations.push(errRecord);
            return errRecord;
        }
    }

    /**
     * إنشاء قائمة الثوابت الكنسية العامة المعيارية مسبقاً
     */
    loadStandardUniversalInvariants() {
        // 1. عدم وجود كميات سالبة غير مصرح بها (Non-Negative Quantities)
        this.registerInvariant({
            id: 'INV-UNIV-001',
            title: 'الكميات والأرصدة غير السالبة افتراضياً',
            domain: 'UNIVERSAL',
            severity: 'CRITICAL',
            predicate: (state) => {
                if (!state || typeof state.quantity !== 'number') return true;
                return state.quantity >= 0;
            },
            remediationGuidance: 'منع العمليات التي تؤدي إلى قيم سالبة في المخزون أو الكميات دون موافقة ائتمانية صريحة.'
        });

        // 2. حصانة السجلات المقفلة (Immutability of Locked Records)
        this.registerInvariant({
            id: 'INV-UNIV-002',
            title: 'منع تعديل السجلات بعد القفل والأرشفة',
            domain: 'UNIVERSAL',
            severity: 'CRITICAL',
            predicate: (state) => {
                if (!state || !state.isLocked) return true;
                return state.modifiedAfterLock !== true;
            },
            remediationGuidance: 'رفض أية عمليات تحديث أو حذف على السجلات التي تم تجميدها أو قفل فترتها.'
        });

        // 3. اتساق الهويات الفريدة ومنع التصادم (Unique Identifiers Integrity)
        this.registerInvariant({
            id: 'INV-UNIV-003',
            title: 'عدم تصادم المعرفات الفريدة في المجموعة',
            domain: 'UNIVERSAL',
            severity: 'HIGH',
            predicate: (state) => {
                if (!state || !Array.isArray(state.ids)) return true;
                const set = new Set(state.ids);
                return set.size === state.ids.length;
            },
            remediationGuidance: 'ضمان توليد المعرفات العشوائية أو التسلسلية بأمان وبشكل يمنع التكرار تماماً.'
        });

        // 4. الذرية وعدم ترك حالات جزئية يتيمة (Atomic State Integrity)
        this.registerInvariant({
            id: 'INV-UNIV-004',
            title: 'اكتمال العمليات الذرية أو التراجع الكامل',
            domain: 'UNIVERSAL',
            severity: 'CRITICAL',
            predicate: (state) => {
                if (!state || !state.isTransaction) return true;
                if (state.hasFailed) {
                    return state.revertedCleanly === true && state.partialChangesRemaining === false;
                }
                return true;
            },
            remediationGuidance: 'تفعيل آلية التراجع الذري والتأكد من عدم بقاء أي سجلات يتيمة عند حدوث فشل.'
        });
    }
}

module.exports = {
    UniversalInvariantEngine
};
