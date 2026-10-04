/**
 * @file workflow-contract.js
 * @description عقد تدفق العمل المعياري الكنسي في ProofForge (ProofForge Canonical Workflow Contract)
 * يحدد تصريحياً البنية الهيكلية لتدفق العمل من الطلب وحتى التحقق والتقارير دون أي تنفيذ ديناميكي
 * Workflow Contract ≠ TaskRouter | Workflow Definition ≠ Workflow Execution
 */

class WorkflowContract {
    /**
     * الحالات الكنسية لتدفق العمل
     */
    static STATUS = Object.freeze({
        DRAFT: 'DRAFT',
        ACTIVE: 'ACTIVE',
        DEPRECATED: 'DEPRECATED',
        DISABLED: 'DISABLED'
    });

    /**
     * الحالات ومستويات الأدلة الكنسية المعتمدة في ProofForge
     */
    static EVIDENCE_LEVELS = Object.freeze({
        AI_CLAIMED: 'AI_CLAIMED',
        CODE_CHANGED: 'CODE_CHANGED',
        TEST_PASSED: 'TEST_PASSED',
        EVIDENCE_EXISTS: 'EVIDENCE_EXISTS',
        PROOFFORGE_VERIFIED: 'PROOFFORGE_VERIFIED'
    });

    /**
     * بوابات التحقق الكنسية المعتمدة في CVGF
     */
    static VERIFICATION_GATES = Object.freeze([
        'CVGF_CLAIM_VERIFICATION',
        'CVGF_GROUNDING_GATE',
        'CVGF_OUTPUT_VERIFICATION',
        'CVGF_ADVERSARIAL_VERIFICATION',
        'CVGF_EVIDENCE_PROVENANCE',
        'CVGF_FRESHNESS_VALIDATION',
        'CVGF_SCOPE_VALIDATION'
    ]);

    /**
     * إنشاء كائن عقد تدفق عمل مجمد وحتمي
     * @param {Object} def بيانات تعريف تدفق العمل
     */
    constructor(def) {
        const validation = WorkflowContract.validate(def);
        if (!validation.isValid) {
            const errorDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join(', ');
            throw new Error(`تعذر إنشاء عقد تدفق العمل: ${errorDetails}`);
        }

        this.workflow_id = def.workflow_id;
        this.name = def.name;
        this.version = def.version;
        this.description = def.description;
        this.status = def.status;
        this.intent = def.intent;

        // تجميد كافة المصفوفات لمنع أي تعديل أو حقن ديناميكي في الذاكرة
        this.task_types = Object.freeze([...(def.task_types || [])]);
        this.required_agents = Object.freeze([...(def.required_agents || [])]);
        this.optional_agents = Object.freeze([...(def.optional_agents || [])]);
        this.prohibited_agents = Object.freeze([...(def.prohibited_agents || [])]);

        this.required_skills = Object.freeze([...(def.required_skills || [])]);
        this.optional_skills = Object.freeze([...(def.optional_skills || [])]);
        this.prohibited_skills = Object.freeze([...(def.prohibited_skills || [])]);

        this.applicable_rules = Object.freeze([...(def.applicable_rules || [])]);
        this.required_validators = Object.freeze([...(def.required_validators || [])]);
        this.evidence_requirements = Object.freeze([...(def.evidence_requirements || [])]);
        this.verification_requirements = Object.freeze([...(def.verification_requirements || [])]);

        this.security_constraints = Object.freeze([...(def.security_constraints || [])]);
        this.permission_constraints = Object.freeze([...(def.permission_constraints || [])]);
        this.authority_constraints = Object.freeze([...(def.authority_constraints || [])]);

        this.prerequisites = Object.freeze([...(def.prerequisites || [])]);
        this.dependencies = Object.freeze([...(def.dependencies || [])]);
        this.abstention_conditions = Object.freeze([...(def.abstention_conditions || [])]);
        this.failure_conditions = Object.freeze([...(def.failure_conditions || [])]);

        this.reporting_requirements = Object.freeze([...(def.reporting_requirements || [])]);
        this.audit_requirements = Object.freeze([...(def.audit_requirements || [])]);
        this.traceability_requirements = Object.freeze([...(def.traceability_requirements || [])]);

        // التجميد العميق للكائن بالكامل
        Object.freeze(this);
    }

    /**
     * التحقق الحتمي الصارم من بيانات عقد تدفق العمل وتطبيق الفشل المغلق (Fail-Closed)
     * @param {Object} def كائن التعريف الممرر
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object') {
            return {
                isValid: false,
                errors: [{ field: 'def', issue: 'يجب أن يكون تعريف عقد تدفق العمل كائناً برمجياً صالحاً' }]
            };
        }

        // 1. معرف تدفق العمل (workflow_id)
        if (!def.workflow_id || typeof def.workflow_id !== 'string' || !def.workflow_id.trim()) {
            errors.push({ field: 'workflow_id', issue: 'معرف تدفق العمل (workflow_id) إلزامي' });
        } else if (!/^PF-WF-[A-Za-z0-9_-]+$/.test(def.workflow_id)) {
            errors.push({ field: 'workflow_id', issue: 'معرف تدفق العمل غير مطابق للنمط الكنسي المعتمد (PF-WF-...)' });
        }

        // 2. الاسم، الإصدار، الوصف، القصد (Metadata)
        if (!def.name || typeof def.name !== 'string' || !def.name.trim()) {
            errors.push({ field: 'name', issue: 'اسم تدفق العمل (name) إلزامي' });
        }

        if (!def.version || typeof def.version !== 'string' || !def.version.trim()) {
            errors.push({ field: 'version', issue: 'إصدار تدفق العمل (version) إلزامي' });
        }

        if (!def.description || typeof def.description !== 'string' || !def.description.trim()) {
            errors.push({ field: 'description', issue: 'وصف تدفق العمل (description) إلزامي' });
        }

        if (!def.intent || typeof def.intent !== 'string' || !def.intent.trim()) {
            errors.push({ field: 'intent', issue: 'قصد وغرض تدفق العمل (intent) إلزامي' });
        }

        // 3. حالة تدفق العمل (status)
        const validStatuses = Object.values(WorkflowContract.STATUS);
        if (!def.status || !validStatuses.includes(def.status)) {
            errors.push({ field: 'status', issue: `حالة تدفق العمل غير صالحة. الحالات المقبولة: ${validStatuses.join(', ')}` });
        }

        // 4. تصنيف المهام (task_types)
        if (!Array.isArray(def.task_types) || def.task_types.length === 0) {
            errors.push({ field: 'task_types', issue: 'يجب تحديد نوع مهمة واحد على الأقل في مصفوفة task_types' });
        }

        // 5. فحص مصفوفات الوكلاء والتناقضات
        const requiredAgents = Array.isArray(def.required_agents) ? def.required_agents : [];
        const optionalAgents = Array.isArray(def.optional_agents) ? def.optional_agents : [];
        const prohibitedAgents = Array.isArray(def.prohibited_agents) ? def.prohibited_agents : [];

        if (def.required_agents !== undefined && !Array.isArray(def.required_agents)) {
            errors.push({ field: 'required_agents', issue: 'حقل required_agents يجب أن يكون مصفوفة' });
        }
        if (def.optional_agents !== undefined && !Array.isArray(def.optional_agents)) {
            errors.push({ field: 'optional_agents', issue: 'حقل optional_agents يجب أن يكون مصفوفة' });
        }
        if (def.prohibited_agents !== undefined && !Array.isArray(def.prohibited_agents)) {
            errors.push({ field: 'prohibited_agents', issue: 'حقل prohibited_agents يجب أن يكون مصفوفة' });
        }

        // يجب تحديد وكيل واحد مطلوب على الأقل في تدفق العمل النشط
        if (def.status === WorkflowContract.STATUS.ACTIVE && requiredAgents.length === 0) {
            errors.push({ field: 'required_agents', issue: 'تدفق العمل النشط يجب أن يحدد وكيلاً رئيسياً واحداً على الأقل (required_agents)' });
        }

        // كشف التناقض: مطلوب ومحظور في نفس الوقت
        const agentConflict = requiredAgents.filter(a => prohibitedAgents.includes(a));
        if (agentConflict.length > 0) {
            errors.push({ field: 'required_agents/prohibited_agents', issue: `تعارض حتمي: الوكلاء التاليون محددون كمطلوبين ومحظورين في آن واحد: ${agentConflict.join(', ')}` });
        }

        // 6. فحص مصفوفات المهارات والتناقضات
        const requiredSkills = Array.isArray(def.required_skills) ? def.required_skills : [];
        const prohibitedSkills = Array.isArray(def.prohibited_skills) ? def.prohibited_skills : [];

        if (def.required_skills !== undefined && !Array.isArray(def.required_skills)) {
            errors.push({ field: 'required_skills', issue: 'حقل required_skills يجب أن يكون مصفوفة' });
        }
        if (def.prohibited_skills !== undefined && !Array.isArray(def.prohibited_skills)) {
            errors.push({ field: 'prohibited_skills', issue: 'حقل prohibited_skills يجب أن يكون مصفوفة' });
        }

        // كشف التناقض: مهارة مطلوبة ومحظورة في نفس الوقت
        const skillConflict = requiredSkills.filter(s => prohibitedSkills.includes(s));
        if (skillConflict.length > 0) {
            errors.push({ field: 'required_skills/prohibited_skills', issue: `تعارض حتمي: المهارات التالية محددة كمطلوبة ومحظورة في آن واحد: ${skillConflict.join(', ')}` });
        }

        // 7. القواعد والمدققات (applicable_rules & required_validators)
        if (def.applicable_rules !== undefined && !Array.isArray(def.applicable_rules)) {
            errors.push({ field: 'applicable_rules', issue: 'حقل applicable_rules يجب أن يكون مصفوفة' });
        }
        if (def.required_validators !== undefined && !Array.isArray(def.required_validators)) {
            errors.push({ field: 'required_validators', issue: 'حقل required_validators يجب أن يكون مصفوفة' });
        }

        // 8. فحص متطلبات الأدلة (evidence_requirements)
        if (!Array.isArray(def.evidence_requirements) || def.evidence_requirements.length === 0) {
            errors.push({ field: 'evidence_requirements', issue: 'يجب تحديد متطلبات أدلة صريحة في evidence_requirements' });
        } else {
            // التحقق من عدم محاولة إضعاف متطلبات الأدلة أو تمرير متطلبات غير صالحة
            const hasInvalidEvidence = def.evidence_requirements.some(ev => 
                typeof ev !== 'string' || !ev.trim() || ev === 'NO_EVIDENCE_REQUIRED' || ev === 'UNVERIFIED_ASSUMPTION'
            );
            if (hasInvalidEvidence) {
                errors.push({ field: 'evidence_requirements', issue: 'متطلبات الأدلة غير صالحة: يُحظر إضعاف الأدلة أو إلغاؤها' });
            }
        }

        // 9. فحص متطلبات التحقق في CVGF (verification_requirements)
        if (!Array.isArray(def.verification_requirements) || def.verification_requirements.length === 0) {
            errors.push({ field: 'verification_requirements', issue: 'يجب تحديد بوابات تحقق صريحة في verification_requirements' });
        } else {
            const invalidGates = def.verification_requirements.filter(g => !WorkflowContract.VERIFICATION_GATES.includes(g));
            if (invalidGates.length > 0) {
                errors.push({ field: 'verification_requirements', issue: `بوابات تحقق غير صالحة أو مجهولة في CVGF: ${invalidGates.join(', ')}` });
            }
        }

        // 10. فحص محددات السلطة ومنع التصعيد الذاتي (authority_constraints & security_constraints)
        const authorityConstraints = Array.isArray(def.authority_constraints) ? def.authority_constraints : [];
        const securityConstraints = Array.isArray(def.security_constraints) ? def.security_constraints : [];

        const escalationPattern = /(P0_MAXIMUM|OVERRIDE_P0|BYPASS_SECURITY|BYPASS_CONSTITUTION|GRANT_ROOT|P0_OVERRIDE)/i;
        const hasAuthorityEscalation = authorityConstraints.some(c => typeof c === 'string' && escalationPattern.test(c));
        const hasSecurityBypass = securityConstraints.some(c => typeof c === 'string' && escalationPattern.test(c));

        if (hasAuthorityEscalation || hasSecurityBypass) {
            errors.push({ field: 'authority_constraints/security_constraints', issue: 'محاولة تصعيد سلطة أو تجاوز أمني محظور: يُحظر لأي تدفق عمل تجاوز سياسات P0 أو الدستور' });
        }

        // 11. فحص الشروط المسبقة وشروط الامتناع والفشل
        const otherArrayFields = [
            'permission_constraints',
            'prerequisites',
            'dependencies',
            'abstention_conditions',
            'failure_conditions',
            'reporting_requirements',
            'audit_requirements',
            'traceability_requirements'
        ];

        for (const field of otherArrayFields) {
            if (def[field] !== undefined && !Array.isArray(def[field])) {
                errors.push({ field, issue: `حقل '${field}' يجب أن يكون مصفوفة نصوص صالحة` });
            }
        }

        // 12. التدفق النشط يجب أن يحدد شروط امتناع واستنكاف صريحة (Abstention Conditions)
        if (def.status === WorkflowContract.STATUS.ACTIVE) {
            const abstentions = Array.isArray(def.abstention_conditions) ? def.abstention_conditions : [];
            if (abstentions.length === 0) {
                errors.push({ field: 'abstention_conditions', issue: 'يجب تحديد شروط الاستنكاف والامتناع الإدراكي (abstention_conditions) لتدفق العمل النشط' });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = WorkflowContract;
