/**
 * @file scenario-intelligence.js
 * @description WebForge V2.1 — Scenario & Edge-Case Intelligence Engine
 * محرك تمثيل وتصنيف السيناريوهات (المسار السليم، البديل، الفشل، التعافي، التكرار، السباق)
 * ونمذجة الحالات الحدية (Edge Cases: صفر، سالب، فارغ، مكرر، منتهي) بطريقة تصريحية
 */

'use strict';

const SCENARIO_TYPES = {
    HAPPY_PATH: 'HAPPY_PATH',
    ALTERNATIVE_PATH: 'ALTERNATIVE_PATH',
    FAILURE_PATH: 'FAILURE_PATH',
    RECOVERY_PATH: 'RECOVERY_PATH',
    TIMEOUT: 'TIMEOUT',
    RETRY: 'RETRY',
    DUPLICATE_REQUEST: 'DUPLICATE_REQUEST',
    CONCURRENT_RACE: 'CONCURRENT_RACE',
    BOUNDARY_EDGE_CASE: 'BOUNDARY_EDGE_CASE'
};

const EDGE_CASE_CATEGORIES = {
    ZERO: 'ZERO',
    NEGATIVE: 'NEGATIVE',
    NULL_OR_UNDEFINED: 'NULL_OR_UNDEFINED',
    MAX_LIMIT: 'MAX_LIMIT',
    MIN_LIMIT: 'MIN_LIMIT',
    DUPLICATE: 'DUPLICATE',
    EXPIRED: 'EXPIRED',
    MALFORMED: 'MALFORMED',
    CONCURRENT: 'CONCURRENT',
    OUT_OF_ORDER: 'OUT_OF_ORDER'
};

class ScenarioIntelligenceEngine {
    constructor() {
        this.scenarios = new Map();
        this.edgeCases = new Map();
    }

    /**
     * تسجيل سيناريو تصريحي
     * @param {Object} def
     */
    registerScenario(def) {
        if (!def || !def.id || !def.type || !def.title) {
            throw new Error('السيناريو يتطلب معرفاً، نوعاً، وعنواناً صالحين.');
        }

        if (this.scenarios.has(def.id)) {
            throw new Error(`معرف السيناريو مكرر: ${def.id}`);
        }

        const scenario = {
            id: String(def.id),
            title: String(def.title),
            type: SCENARIO_TYPES[def.type] || SCENARIO_TYPES.BOUNDARY_EDGE_CASE,
            description: def.description || '',
            expectedOutcome: def.expectedOutcome || 'SUCCESS',
            steps: Array.isArray(def.steps) ? def.steps : [],
            compensatingActions: Array.isArray(def.compensatingActions) ? def.compensatingActions : [],
            tags: Array.isArray(def.tags) ? def.tags : []
        };

        this.scenarios.set(scenario.id, scenario);
        return scenario;
    }

    /**
     * تسجيل حالة حدية كنسية
     * @param {Object} def
     */
    registerEdgeCase(def) {
        if (!def || !def.id || !def.category || !def.title) {
            throw new Error('الحالة الحدية تتطلب معرفاً، فئة، وعنواناً صالحين.');
        }

        if (this.edgeCases.has(def.id)) {
            throw new Error(`معرف الحالة الحدية مكرر: ${def.id}`);
        }

        const edgeCase = {
            id: String(def.id),
            title: String(def.title),
            category: EDGE_CASE_CATEGORIES[def.category] || EDGE_CASE_CATEGORIES.BOUNDARY_EDGE_CASE,
            sampleInput: def.sampleInput !== undefined ? def.sampleInput : null,
            expectedBehavior: def.expectedBehavior || 'GRACEFUL_REJECTION',
            evaluator: typeof def.evaluator === 'function' ? def.evaluator : null,
            severity: def.severity || 'HIGH'
        };

        this.edgeCases.set(edgeCase.id, edgeCase);
        return edgeCase;
    }

    /**
     * فحص مدخلات النظام مقابل الحالات الحدية المسجلة
     * @param {string} edgeCaseId
     * @param {any} input
     * @param {Object} observedResult
     */
    verifyEdgeCaseBehavior(edgeCaseId, input, observedResult = {}) {
        const ec = this.edgeCases.get(edgeCaseId);
        if (!ec) {
            return {
                id: edgeCaseId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isVerified: false
            };
        }

        // إذا كانت دالة التقييم متوفرة يتم استدعاؤها
        let passed = false;
        let details = '';

        if (ec.evaluator) {
            passed = ec.evaluator(input, observedResult);
            details = passed ? 'سلوك النظام سليم ومتوافق مع التوقعات' : 'فشل النظام في التعامل الآمن مع الحالة الحدية';
        } else {
            // التقييم الافتراضي: التأكد من عدم انهيار النظام وعودة رد مهذب
            passed = observedResult && observedResult.handledGracefully === true && !observedResult.unhandledCrash;
            details = passed ? 'تمت معالجة المدخل الحدي دون انهيار' : 'حدث خطأ غير معالج أو تسريب استثناءات';
        }

        return {
            edgeCaseId: ec.id,
            category: ec.category,
            severity: ec.severity,
            status: passed ? 'VERIFIED' : 'VULNERABLE',
            gate: passed ? 'PASS' : 'FAIL',
            isVerified: passed,
            details
        };
    }

    /**
     * تحميل مكتبة الحالات الحدية المعيارية
     */
    loadStandardEdgeCases() {
        // 1. مدخلات الأصفار
        this.registerEdgeCase({
            id: 'EC-STD-001',
            category: 'ZERO',
            title: 'القسمة على صفر أو مبالغ صفرية غير منطقية',
            expectedBehavior: 'GRACEFUL_REJECTION',
            evaluator: (input, res) => {
                if (input === 0 || (input && input.amount === 0)) {
                    return res && res.rejected === true && !res.unhandledCrash;
                }
                return true;
            }
        });

        // 2. المدخلات الفارغة وغير المعرفة (Null / Undefined)
        this.registerEdgeCase({
            id: 'EC-STD-002',
            category: 'NULL_OR_UNDEFINED',
            title: 'القيم الخالية أو الناقصة في الحقول الإلزامية',
            expectedBehavior: 'GRACEFUL_REJECTION',
            evaluator: (input, res) => {
                if (input === null || input === undefined || (input && input.requiredField === null)) {
                    return res && res.validationFailed === true && !res.unhandledCrash;
                }
                return true;
            }
        });

        // 3. المدخلات السالبة غير المصرح بها
        this.registerEdgeCase({
            id: 'EC-STD-003',
            category: 'NEGATIVE',
            title: 'القيم العددية السالبة في معاملات الكميات والأسعار',
            expectedBehavior: 'GRACEFUL_REJECTION',
            evaluator: (input, res) => {
                if (typeof input === 'number' && input < 0) {
                    return res && res.rejected === true;
                }
                return true;
            }
        });
    }
}

module.exports = {
    SCENARIO_TYPES,
    EDGE_CASE_CATEGORIES,
    ScenarioIntelligenceEngine
};
