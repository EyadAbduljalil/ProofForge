/**
 * @file model-policy-contract.js
 * @description عقد سياسات النماذج والذكاء الاصطناعي المعياري الكنسي في نظام ProofForge (Phase 6)
 * يحدد القيود التصريحية الحتمية لاستخدام النماذج والذكاء الاصطناعي مع فرض هرمية الأمان P0 ومنع التصعيد الذاتي.
 * 
 * المبادئ الحاكمة:
 * - AI Output !== Evidence
 * - Tool Result !== Evidence
 * - MCP Result !== Verification
 * - Higher Risk !== Downgraded Policy
 * - P0 Security > All Other Priorities
 */

'use strict';

class ModelPolicyContract {
    /**
     * الحالات التشغيلية المعتمدة لسياسة النموذج
     */
    static STATUS = Object.freeze({
        DRAFT: 'DRAFT',
        ACTIVE: 'ACTIVE',
        DEPRECATED: 'DEPRECATED',
        DISABLED: 'DISABLED'
    });

    /**
     * مستويات الخطورة المعيارية الحتمية
     */
    static RISK_LEVEL = Object.freeze({
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        CRITICAL: 'CRITICAL'
    });

    /**
     * ترتيب مستويات الخطورة لقياس محاولات تخفيض الأمان
     */
    static RISK_HIERARCHY = Object.freeze({
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        CRITICAL: 4
    });

    /**
     * القدرات النموذجية المعترف بها
     */
    static RECOGNIZED_CAPABILITIES = Object.freeze([
        'reasoning',
        'code_generation',
        'code_review',
        'structured_output',
        'architecture_analysis',
        'security_audit',
        'threat_modeling',
        'test_generation',
        'documentation_synthesis'
    ]);

    /**
     * بوابات التحقق المستقلة في إطار CVGF
     */
    static VERIFICATION_GATES = Object.freeze([
        'CVGF_GROUNDING_GATE',
        'CVGF_CLAIM_VERIFICATION',
        'CVGF_NON_CONTRADICTION',
        'CVGF_FRESHNESS_VALIDATION',
        'CVGF_SCOPE_VALIDATION'
    ]);

    /**
     * هرمية الأدلة الكنسية
     */
    static EVIDENCE_HIERARCHY = Object.freeze([
        'AI_CLAIMED',
        'CODE_CHANGED',
        'TEST_PASSED',
        'EVIDENCE_EXISTS',
        'PROOFFORGE_VERIFIED'
    ]);

    /**
     * إنشاء كائن عقد سياسة النموذج وتجميده حتمياً
     * @param {Object} def بيانات تعريف السياسة
     */
    constructor(def) {
        const validation = ModelPolicyContract.validate(def);
        if (!validation.isValid) {
            const errDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
            throw new Error(`فشل إنشاء عقد سياسة النموذج (Fail-Closed) بسبب أخطاء التحقق: ${errDetails}`);
        }

        // الحقول التعريفية الأساسية
        this.policy_id = String(def.policy_id);
        this.name = String(def.name);
        this.version = String(def.version);
        this.status = def.status;
        this.purpose = String(def.purpose);
        this.risk_level = def.risk_level;

        // المصفوفات الهندسية والأمنية المجمدة
        this.task_types = Object.freeze([...(def.task_types || [])]);
        this.required_capabilities = Object.freeze([...(def.required_capabilities || [])]);
        this.model_constraints = Object.freeze([...(def.model_constraints || [])]);
        this.context_requirements = Object.freeze({ ...(def.context_requirements || {}) });
        this.security_requirements = Object.freeze([...(def.security_requirements || [])]);
        this.evidence_requirements = Object.freeze([...(def.evidence_requirements || [])]);
        this.verification_requirements = Object.freeze([...(def.verification_requirements || [])]);
        this.abstention_conditions = Object.freeze([...(def.abstention_conditions || [])]);
        this.prohibited_behaviors = Object.freeze([...(def.prohibited_behaviors || [])]);
        this.cost_constraints = Object.freeze({ ...(def.cost_constraints || {}) });
        this.latency_constraints = Object.freeze({ ...(def.latency_constraints || {}) });
        this.fallback_constraints = Object.freeze({ ...(def.fallback_constraints || {}) });
        this.reporting_requirements = Object.freeze([...(def.reporting_requirements || [])]);
        this.audit_requirements = Object.freeze([...(def.audit_requirements || [])]);

        // التجميد العميق الحتمي للكائن الأساسي
        Object.freeze(this);
    }

    /**
     * فحص حتمي مغلق (Fail-Closed) لبيانات عقد سياسة النموذج
     * @param {Object} def بيانات التعريف المراد فحصها
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object' || Array.isArray(def)) {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'بيانات عقد السياسة يجب أن تكون كائناً غير فارغ' }]
            };
        }

        // 1. معرف السياسة (policy_id)
        const idPattern = /^PF-POL-[A-Z0-9_-]+$/;
        if (!def.policy_id || typeof def.policy_id !== 'string') {
            errors.push({ field: 'policy_id', issue: 'حقل policy_id إلزامي ويجب أن يكون نصاً' });
        } else if (!idPattern.test(def.policy_id)) {
            errors.push({
                field: 'policy_id',
                issue: `معرف السياسة '${def.policy_id}' غير مطابق للنمط الكنسي الصارم (^PF-POL-[A-Z0-9_-]+$)`
            });
        }

        // 2. الاسم (name)
        if (!def.name || typeof def.name !== 'string' || def.name.trim() === '') {
            errors.push({ field: 'name', issue: 'حقل name إلزامي ويجب أن يكون نصاً غير فارغ' });
        }

        // 3. الإصدار (version)
        const semverPattern = /^\d+\.\d+\.\d+$/;
        if (!def.version || typeof def.version !== 'string' || !semverPattern.test(def.version)) {
            errors.push({ field: 'version', issue: 'حقل version إلزامي ويجب أن يتبع الترقيم الدلالي (SemVer x.y.z)' });
        }

        // 4. الحالة (status)
        if (!def.status || !Object.values(ModelPolicyContract.STATUS).includes(def.status)) {
            errors.push({
                field: 'status',
                issue: `حقل status غير صالح. القيم المسموحة: ${Object.values(ModelPolicyContract.STATUS).join(', ')}`
            });
        }

        // 5. الغرض (purpose)
        if (!def.purpose || typeof def.purpose !== 'string' || def.purpose.trim() === '') {
            errors.push({ field: 'purpose', issue: 'حقل purpose إلزامي لبيان الغرض الهندسي للسياسة' });
        }

        // 6. مستوى الخطورة (risk_level)
        if (!def.risk_level || !Object.values(ModelPolicyContract.RISK_LEVEL).includes(def.risk_level)) {
            errors.push({
                field: 'risk_level',
                issue: `حقل risk_level غير صالح. القيم المسموحة: ${Object.values(ModelPolicyContract.RISK_LEVEL).join(', ')}`
            });
        }

        // 7. أنواع المهام (task_types)
        if (!Array.isArray(def.task_types) || def.task_types.length === 0) {
            errors.push({ field: 'task_types', issue: 'حقل task_types إلزامي ويجب أن يحتوي على مهمة واحدة على الأقل' });
        } else if (!def.task_types.every(t => typeof t === 'string' && t.trim() !== '')) {
            errors.push({ field: 'task_types', issue: 'كافة عناصر task_types يجب أن تكون نصوصاً غير فارغة' });
        }

        // 8. القدرات المطلوبة (required_capabilities)
        if (!Array.isArray(def.required_capabilities) || def.required_capabilities.length === 0) {
            errors.push({ field: 'required_capabilities', issue: 'حقل required_capabilities إلزامي ويجب أن يحدد قدرة واحدة على الأقل' });
        } else {
            for (const cap of def.required_capabilities) {
                if (typeof cap !== 'string' || cap.trim() === '') {
                    errors.push({ field: 'required_capabilities', issue: `القدرة '${cap}' غير صالحة، يجب أن تكون نصاً غير فارغ` });
                }
            }
        }

        // 9. قيود النموذج (model_constraints)
        if (!Array.isArray(def.model_constraints)) {
            errors.push({ field: 'model_constraints', issue: 'حقل model_constraints يجب أن يكون مصفوفة نصوص' });
        }

        // 10. متطلبات السياق (context_requirements)
        if (!def.context_requirements || typeof def.context_requirements !== 'object') {
            errors.push({ field: 'context_requirements', issue: 'حقل context_requirements يجب أن يكون كائناً يحدد قيود السياق' });
        }

        // 11. المتطلبات الأمنية (security_requirements)
        if (!Array.isArray(def.security_requirements) || def.security_requirements.length === 0) {
            errors.push({ field: 'security_requirements', issue: 'حقل security_requirements إلزامي ويجب ألا يكون فارغاً' });
        }

        // 12. متطلبات الأدلة (evidence_requirements)
        if (!Array.isArray(def.evidence_requirements) || def.evidence_requirements.length === 0) {
            errors.push({ field: 'evidence_requirements', issue: 'حقل evidence_requirements إلزامي ويجب ألا يكون فارغاً' });
        }

        // 13. متطلبات التحقق في CVGF (verification_requirements)
        if (!Array.isArray(def.verification_requirements) || def.verification_requirements.length === 0) {
            errors.push({ field: 'verification_requirements', issue: 'حقل verification_requirements إلزامي ويجب ألا يكون فارغاً' });
        } else {
            const invalidGates = def.verification_requirements.filter(g => !ModelPolicyContract.VERIFICATION_GATES.includes(g));
            if (invalidGates.length > 0) {
                errors.push({
                    field: 'verification_requirements',
                    issue: `بوابات تحقق غير صالحة أو مجهولة في CVGF: ${invalidGates.join(', ')}`
                });
            }
        }

        // 14. شروط الامتناع والاستنكاف الإدراكي (abstention_conditions)
        if (!Array.isArray(def.abstention_conditions) || def.abstention_conditions.length === 0) {
            errors.push({ field: 'abstention_conditions', issue: 'حقل abstention_conditions إلزامي لتحديد متى يمتنع النموذج إدراكياً' });
        }

        // 15. السلوكيات المحظورة (prohibited_behaviors)
        if (!Array.isArray(def.prohibited_behaviors) || def.prohibited_behaviors.length === 0) {
            errors.push({ field: 'prohibited_behaviors', issue: 'حقل prohibited_behaviors إلزامي لتحديد محظورات النموذج صراحة' });
        }

        // 16. قيود التراجع الآمن (fallback_constraints)
        if (!def.fallback_constraints || typeof def.fallback_constraints !== 'object') {
            errors.push({ field: 'fallback_constraints', issue: 'حقل fallback_constraints يجب أن يكون كائناً يحدد سياسة التراجع' });
        } else {
            // التحقق من منع التراجع لسياسة ذات خطورة أقل أو أضعف أمنياً
            if (def.fallback_constraints.allowed_downgrade === true) {
                errors.push({
                    field: 'fallback_constraints',
                    issue: 'حظر أمني: يُمنع السماح بتخفيض مستوى الأمان أو الانتقال التلقائي لسياسة أضعف عند الفشل'
                });
            }
        }

        // 17. متطلبات التقارير وسجل التدقيق (reporting_requirements, audit_requirements)
        if (!Array.isArray(def.reporting_requirements) || def.reporting_requirements.length === 0) {
            errors.push({ field: 'reporting_requirements', issue: 'حقل reporting_requirements إلزامي ويجب ألا يكون فارغاً' });
        }
        if (!Array.isArray(def.audit_requirements) || def.audit_requirements.length === 0) {
            errors.push({ field: 'audit_requirements', issue: 'حقل audit_requirements إلزامي ويجب ألا يكون فارغاً' });
        }

        // ==========================================
        // الفحوصات الأمنية الحتمية (Anti-Bypass & Anti-Escalation)
        // ==========================================

        // أ. كشف محاولة تجاوز سياسات الأمان P0 (P0 Bypass Attempt)
        const fullString = JSON.stringify(def);
        if (/BYPASS[_\s-]+P0|OVERRIDE[_\s-]+P0|DISABLE[_\s-]+P0|IGNORE[_\s-]+P0/i.test(fullString)) {
            errors.push({
                field: 'security_requirements',
                issue: 'محاولة غير مصرح بها لتجاوز أو إضعاف سياسات الأمان P0 الحاكمة'
            });
        }

        // ب. كشف محاولة تصعيد السلطة (Authority Escalation)
        if (/GRANT[_\s-]+P0|ACQUIRE[_\s-]+P0|CLAIM[_\s-]+P0_AUTHORITY|ESCALATE[_\s-]+AUTHORITY/i.test(fullString)) {
            errors.push({
                field: 'authority_constraints',
                issue: 'محاولة تصعيد سلطة ذاتية غير مصرح بها لسياسة النموذج'
            });
        }

        // ج. كشف محاولة مساواة مخرجات الذكاء الاصطناعي بالأدلة (AI Output !== Evidence)
        if (/TRUST_AI_OUTPUT|AI_OUTPUT_IS_EVIDENCE|SKIP_VERIFICATION/i.test(fullString)) {
            errors.push({
                field: 'evidence_requirements',
                issue: 'انتهاك ميثاق الأدلة: يُحظر اعتبار مخرجات النموذج أو أدوات MCP كأدلة دون تحقق مستقل'
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = ModelPolicyContract;
