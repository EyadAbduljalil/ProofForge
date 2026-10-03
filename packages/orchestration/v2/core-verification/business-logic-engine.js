/**
 * @file business-logic-engine.js
 * @description WebForge V2.1 — Business Logic Verification Engine
 * محرك التحقق الكنسي من منطق الأعمال والشروط المسبقة واللاحقة والقيود
 * محايد تماماً للتقنيات البرمجية ومبني على الأدلة
 */

'use strict';

class BusinessLogicEngine {
    constructor() {
        this.registeredRules = new Map();
        this.verificationHistory = [];
    }

    /**
     * تسجيل قاعدة منطق أعمال تصريحية
     * @param {Object} ruleDef
     */
    registerRule(ruleDef) {
        if (!ruleDef || !ruleDef.id || !ruleDef.title) {
            throw new Error('قاعدة منطق الأعمال تتطلب معرفاً (id) وعنواناً (title) صالحين.');
        }

        if (this.registeredRules.has(ruleDef.id)) {
            throw new Error(`معرف قاعدة منطق الأعمال مكرر: ${ruleDef.id}`);
        }

        const canonicalRule = {
            id: String(ruleDef.id),
            title: String(ruleDef.title),
            domain: ruleDef.domain || 'GENERAL',
            preconditions: Array.isArray(ruleDef.preconditions) ? ruleDef.preconditions : [],
            postconditions: Array.isArray(ruleDef.postconditions) ? ruleDef.postconditions : [],
            constraints: Array.isArray(ruleDef.constraints) ? ruleDef.constraints : [],
            forbiddenSideEffects: Array.isArray(ruleDef.forbiddenSideEffects) ? ruleDef.forbiddenSideEffects : [],
            requiredSideEffects: Array.isArray(ruleDef.requiredSideEffects) ? ruleDef.requiredSideEffects : [],
            authorization: ruleDef.authorization || { requiredRole: null, enforceOwnership: true },
            lifecycleState: ruleDef.lifecycleState || null,
            metadata: ruleDef.metadata || {}
        };

        this.registeredRules.set(canonicalRule.id, canonicalRule);
        return canonicalRule;
    }

    /**
     * فحص وتدقيق منطق الأعمال بناءً على المدخلات، الحالة المبدئية، والتنفيذ المرصود
     * @param {string} ruleId
     * @param {Object} context
     * @returns {Object} نتيجة التحقق الرسمية
     */
    verify(ruleId, context = {}) {
        const rule = this.registeredRules.get(ruleId);
        if (!rule) {
            return {
                ruleId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isVerified: false,
                reason: `القاعدة غير مسجلة: ${ruleId}`
            };
        }

        const { actor, input, preState, postState, observedSideEffects, evidence } = context;
        const violations = [];

        // 1. فحص الصلاحيات وعزل الامتيازات (Authorization & Least Privilege)
        if (rule.authorization && rule.authorization.requiredRole) {
            if (!actor || !actor.roles || !actor.roles.includes(rule.authorization.requiredRole)) {
                violations.push({
                    type: 'UNAUTHORIZED_ACCESS',
                    severity: 'CRITICAL',
                    message: `الفاعل يفتقر إلى الدور المطلوب: ${rule.authorization.requiredRole}`
                });
            }
        }

        if (rule.authorization && rule.authorization.enforceOwnership && actor) {
            if (context.resourceOwnerId && actor.id !== context.resourceOwnerId && !actor.isSystemAdmin) {
                violations.push({
                    type: 'HORIZONTAL_PRIVILEGE_ESCALATION',
                    severity: 'CRITICAL',
                    message: 'تم رصد انتهاك لصلاحية ملكية المورد (Anti-IDOR).'
                });
            }
        }

        // 2. فحص الشروط المسبقة (Preconditions)
        for (const pre of rule.preconditions) {
            if (typeof pre.evaluate === 'function') {
                const passed = pre.evaluate({ input, preState });
                if (!passed) {
                    violations.push({
                        type: 'PRECONDITION_FAILED',
                        severity: pre.severity || 'HIGH',
                        message: pre.description || 'فشل شرط مسبق في منطق الأعمال.'
                    });
                }
            }
        }

        // 3. فحص القيود المستمرة (Business Constraints)
        for (const constraint of rule.constraints) {
            if (typeof constraint.evaluate === 'function') {
                const passed = constraint.evaluate({ input, preState, postState });
                if (!passed) {
                    violations.push({
                        type: 'CONSTRAINT_VIOLATION',
                        severity: constraint.severity || 'HIGH',
                        message: constraint.description || 'تم انتهاك قيد من قيود الأعمال الأساسية.'
                    });
                }
            }
        }

        // 4. فحص الشروط اللاحقة (Postconditions)
        for (const post of rule.postconditions) {
            if (typeof post.evaluate === 'function') {
                const passed = post.evaluate({ input, preState, postState });
                if (!passed) {
                    violations.push({
                        type: 'POSTCONDITION_FAILED',
                        severity: post.severity || 'HIGH',
                        message: post.description || 'لم يتحقق الشرط اللاحق المطلوب لمنطق الأعمال.'
                    });
                }
            }
        }

        // 5. فحص الآثار الجانبية الممنوعة (Forbidden Side Effects)
        const actualEffects = Array.isArray(observedSideEffects) ? observedSideEffects : [];
        for (const forbidden of rule.forbiddenSideEffects) {
            if (actualEffects.includes(forbidden)) {
                violations.push({
                    type: 'FORBIDDEN_SIDE_EFFECT_DETECTED',
                    severity: 'CRITICAL',
                    message: `تم رصد أثر جانبي محظور: ${forbidden}`
                });
            }
        }

        // 6. فحص الآثار الجانبية المطلوبة (Required Side Effects)
        for (const required of rule.requiredSideEffects) {
            if (!actualEffects.includes(required)) {
                violations.push({
                    type: 'MISSING_REQUIRED_SIDE_EFFECT',
                    severity: 'MEDIUM',
                    message: `أثر جانبي إلزامي مفقود: ${required}`
                });
            }
        }

        // 7. تقييم الدليل المادي (Evidence Strength)
        const hasEvidence = Boolean(evidence && (evidence.uri || evidence.auditLog || evidence.checksum));
        let status = 'VERIFIED';
        let gate = 'PASS';

        if (violations.length > 0) {
            status = 'VIOLATED';
            gate = 'FAIL';
        } else if (!hasEvidence) {
            status = 'INSUFFICIENT_EVIDENCE';
            gate = 'FAIL';
        }

        const verificationRecord = {
            ruleId,
            status,
            gate,
            isVerified: status === 'VERIFIED',
            violationsCount: violations.length,
            violations,
            evidenceProvided: hasEvidence,
            verifiedAt: new Date().toISOString()
        };

        this.verificationHistory.push(verificationRecord);
        return verificationRecord;
    }
}

module.exports = {
    BusinessLogicEngine
};
