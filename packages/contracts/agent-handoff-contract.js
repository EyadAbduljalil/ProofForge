/**
 * @file agent-handoff-contract.js
 * @description عقد تسليم وتمرير المهام بين الوكلاء في نظام ProofForge (Phase 9)
 * يحكم التعاون المهيكل بين الوكلاء مع فرض حدود الثقة ومنع تصعيد السلطات:
 * - Agent A Output !== Verified Evidence
 * - AI_CLAIMED !== PROOFFORGE_VERIFIED
 * - Source Agent cannot grant permissions to Target Agent
 * - Trust Boundary & CVGF Independence
 */

'use strict';

class AgentHandoffContract {
    /**
     * حالات دورة حياة التسليم
     */
    static STATUS = Object.freeze({
        CREATED: 'CREATED',
        VALIDATED: 'VALIDATED',
        ACCEPTED: 'ACCEPTED',
        REJECTED: 'REJECTED',
        VERIFIED: 'VERIFIED',
        ABSTAINED: 'ABSTAINED',
        FAILED: 'FAILED'
    });

    /**
     * حالات التحقق من الأدلة
     */
    static VERIFICATION_STATE = Object.freeze({
        UNVERIFIED: 'UNVERIFIED',
        VERIFIED: 'VERIFIED',
        CONTRADICTED: 'CONTRADICTED',
        CONFLICT: 'CONFLICT'
    });

    /**
     * إنشاء كائن عقد تسليم المهام وتجميده حتمياً
     * @param {Object} def بيانات تعريف التسليم
     */
    constructor(def) {
        const validation = AgentHandoffContract.validate(def);
        if (!validation.isValid) {
            const errDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
            throw new Error(`فشل إنشاء عقد تسليم المهام بين الوكلاء (Fail-Closed): ${errDetails}`);
        }

        // الحقول الأساسية
        this.handoff_id = String(def.handoff_id);
        this.workflow_id = String(def.workflow_id);
        this.source_agent = String(def.source_agent);
        this.target_agent = String(def.target_agent);
        this.source_skill = String(def.source_skill);
        this.target_skill = String(def.target_skill);
        this.task_context = String(def.task_context);
        this.status = def.status;
        this.verification_state = def.verification_state || AgentHandoffContract.VERIFICATION_STATE.UNVERIFIED;

        // المصفوفات والكائنات المجمدة
        this.input_artifacts = Object.freeze([...(def.input_artifacts || [])]);
        this.output_artifacts = Object.freeze([...(def.output_artifacts || [])]);
        this.claims = Object.freeze([...(def.claims || [])]);
        this.evidence = Object.freeze([...(def.evidence || [])]);
        this.requirements = Object.freeze([...(def.requirements || [])]);
        this.constraints = Object.freeze([...(def.constraints || [])]);
        this.security_context = Object.freeze({ ...(def.security_context || {}) });
        this.provenance = Object.freeze({ ...(def.provenance || {}) });
        this.failure_conditions = Object.freeze([...(def.failure_conditions || [])]);
        this.abstention_conditions = Object.freeze([...(def.abstention_conditions || [])]);
        this.audit_requirements = Object.freeze([...(def.audit_requirements || [])]);

        Object.freeze(this);
    }

    /**
     * فحص حتمي مغلق (Fail-Closed) لبيانات عقد تسليم المهام بين الوكلاء
     * @param {Object} def بيانات التعريف
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object' || Array.isArray(def)) {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'بيانات عقد تسليم المهام يجب أن تكون كائناً غير فارغ' }]
            };
        }

        // 1. معرف التسليم (handoff_id)
        const idPattern = /^PF-HANDOFF-[A-Z0-9_-]+$/;
        if (!def.handoff_id || typeof def.handoff_id !== 'string') {
            errors.push({ field: 'handoff_id', issue: 'حقل handoff_id إلزامي ويجب أن يكون نصاً' });
        } else if (!idPattern.test(def.handoff_id)) {
            errors.push({
                field: 'handoff_id',
                issue: `معرف التسليم '${def.handoff_id}' غير مطابق للنمط الكنسي (^PF-HANDOFF-[A-Z0-9_-]+$)`
            });
        }

        // 2. تدفق العمل الحاكم (workflow_id)
        if (!def.workflow_id || typeof def.workflow_id !== 'string') {
            errors.push({ field: 'workflow_id', issue: 'حقل workflow_id إلزامي لربط التسليم بتدفق العمل الكنسي' });
        }

        // 3. الوكيل المصدر والهدف (source_agent, target_agent)
        if (!def.source_agent || typeof def.source_agent !== 'string') {
            errors.push({ field: 'source_agent', issue: 'حقل source_agent إلزامي' });
        }
        if (!def.target_agent || typeof def.target_agent !== 'string') {
            errors.push({ field: 'target_agent', issue: 'حقل target_agent إلزامي' });
        }

        // 4. مهارات المصدر والهدف (source_skill, target_skill)
        if (!def.source_skill || typeof def.source_skill !== 'string') {
            errors.push({ field: 'source_skill', issue: 'حقل source_skill إلزامي' });
        }
        if (!def.target_skill || typeof def.target_skill !== 'string') {
            errors.push({ field: 'target_skill', issue: 'حقل target_skill إلزامي' });
        }

        // 5. سياق المهمة (task_context)
        if (!def.task_context || typeof def.task_context !== 'string' || def.task_context.trim() === '') {
            errors.push({ field: 'task_context', issue: 'حقل task_context إلزامي لبيان الهدف وسياق التسليم' });
        }

        // 6. الحالة وحالة التحقق (status, verification_state)
        if (!def.status || !Object.values(AgentHandoffContract.STATUS).includes(def.status)) {
            errors.push({
                field: 'status',
                issue: `حالة التسليم غير صالحة. القيم المسموحة: ${Object.values(AgentHandoffContract.STATUS).join(', ')}`
            });
        }
        if (def.verification_state && !Object.values(AgentHandoffContract.VERIFICATION_STATE).includes(def.verification_state)) {
            errors.push({
                field: 'verification_state',
                issue: `حالة التحقق غير صالحة. القيم المسموحة: ${Object.values(AgentHandoffContract.VERIFICATION_STATE).join(', ')}`
            });
        }

        // 7. سلسلة النسب (provenance)
        if (!def.provenance || typeof def.provenance !== 'object' || Object.keys(def.provenance).length === 0) {
            errors.push({ field: 'provenance', issue: 'حقل provenance إلزامي لضمان تتبع مصدر الادعاءات والأدلة' });
        }

        // 8. متطلبات الأدلة والادعاءات والقيود
        if (!Array.isArray(def.claims) || def.claims.length === 0) {
            errors.push({ field: 'claims', issue: 'حقل claims إلزامي ويجب أن يحدد ادعاءً هندسياً واحداً على الأقل' });
        }
        if (!Array.isArray(def.evidence)) {
            errors.push({ field: 'evidence', issue: 'حقل evidence يجب أن يكون مصفوفة أدلة' });
        }
        if (!Array.isArray(def.constraints)) {
            errors.push({ field: 'constraints', issue: 'حقل constraints يجب أن يكون مصفوفة قيود' });
        }
        if (!Array.isArray(def.audit_requirements) || def.audit_requirements.length === 0) {
            errors.push({ field: 'audit_requirements', issue: 'حقل audit_requirements إلزامي' });
        }

        // ==========================================
        // الفحوصات الأمنية الحتمية (Anti-Escalation & Verification Spoofing)
        // ==========================================

        const fullString = JSON.stringify(def);

        // أ. كشف محاولة تزييف التحقق (Verification Spoofing)
        // لا يجوز أن يكون التسليم بحالة VERIFIED إذا كانت الأدلة فارغة أو كانت حالة التحقق UNVERIFIED
        if (def.status === AgentHandoffContract.STATUS.VERIFIED) {
            if (def.verification_state !== AgentHandoffContract.VERIFICATION_STATE.VERIFIED) {
                errors.push({
                    field: 'status/verification_state',
                    issue: 'تزييف حالة التحقق: لا يمكن للتسليم أن يكون في حالة VERIFIED بينما verification_state ليست VERIFIED'
                });
            }
            if (!Array.isArray(def.evidence) || def.evidence.length === 0) {
                errors.push({
                    field: 'evidence',
                    issue: 'تزييف التحقق: لا يمكن إجازة حالة VERIFIED دون وجود أدلة مؤصلة في حقل evidence'
                });
            }
        }

        // ب. كشف محاولة تصعيد السلطة أو تمرير الامتيازات بين الوكلاء
        if (/GRANT[_\s-]+P0|TRANSFER[_\s-]+AUTHORITY|ESCALATE[_\s-]+PRIVILEGE|GRANT[_\s-]+PERMISSION/i.test(fullString)) {
            errors.push({
                field: 'constraints',
                issue: 'محاولة تصعيد أو نقل صلاحيات غير مصرح بها بين الوكلاء (Authority Escalation)'
            });
        }

        // ج. كشف محاولة تخفيض أو طمس الأدلة (Evidence Downgrade / Tampering)
        if (/DELETE[_\s-]+EVIDENCE|STRIP[_\s-]+PROVENANCE|SUPPRESS[_\s-]+CONFLICT/i.test(fullString)) {
            errors.push({
                field: 'provenance',
                issue: 'محاولة غير مصرح بها لطمس سلسلة النسب أو قمع النزاعات أو تخفيض تصنيف الأدلة'
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = AgentHandoffContract;
