/**
 * @file skill-contract.js
 * @description عقد المهارة الهندسية المعيارية في ProofForge (ProofForge Canonical Skill Contract)
 * يوفر نموذجاً حتمياً وصارماً يحدد مدخلات ومخرجات ومسؤوليات وبراهين وقيود المهارات
 * ويمنع التصعيد الذاتي للسلطة أو تجاوز الحدود الأمنية
 */

const AgentPermissionBoundary = require('../security/agent-permission-boundary');

/**
 * حالات دورة حياة المهارة المعتمدة
 */
const SKILL_STATUS = Object.freeze({
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    DEPRECATED: 'DEPRECATED',
    DISABLED: 'DISABLED'
});

/**
 * نمط معرفات المهارات الحتمي
 */
const SKILL_ID_PATTERN = /^(PF-SKILL-[A-Z0-9-]+|[a-z0-9-]+)$/;

class SkillContract {
    /**
     * @param {Object} definition تعريف كائن المهارة
     */
    constructor(definition) {
        const validation = SkillContract.validate(definition);
        if (!validation.isValid) {
            const errorMsg = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join(', ');
            throw new Error(`تعريف عقد المهارة غير صالح: ${errorMsg}`);
        }

        const data = validation.data;
        this.id = data.id;
        this.name = data.name;
        this.version = data.version;
        this.description = data.description;
        this.category = data.category;
        this.purpose = data.purpose;
        this.inputs = Object.freeze([...data.inputs]);
        this.outputs = Object.freeze([...data.outputs]);
        this.preconditions = Object.freeze([...data.preconditions]);
        this.postconditions = Object.freeze([...data.postconditions]);
        this.responsibilities = Object.freeze([...data.responsibilities]);
        this.allowed_agents = Object.freeze([...data.allowed_agents]);
        this.prohibited_agents = Object.freeze([...data.prohibited_agents]);
        this.applicable_rules = Object.freeze([...data.applicable_rules]);
        this.security_constraints = Object.freeze([...data.security_constraints]);
        this.permission_requirements = Object.freeze([...data.permission_requirements]);
        this.authority_constraints = Object.freeze([...data.authority_constraints]);
        this.validators = Object.freeze([...data.validators]);
        this.validation_requirements = Object.freeze([...data.validation_requirements]);
        this.verification_requirements = Object.freeze([...data.verification_requirements]);
        this.required_evidence = Object.freeze([...data.required_evidence]);
        this.evidence_schema = Object.freeze({ ...data.evidence_schema });
        this.failure_conditions = Object.freeze([...data.failure_conditions]);
        this.abstention_conditions = Object.freeze([...data.abstention_conditions]);
        this.reporting_requirements = Object.freeze([...data.reporting_requirements]);
        this.audit_requirements = Object.freeze([...data.audit_requirements]);
        this.status = data.status;

        // تجميد العقد لضمان عدم التلاعب به برمجياً أثناء التشغيل
        Object.freeze(this);
    }

    static get STATUS() {
        return SKILL_STATUS;
    }

    /**
     * التحقق الحتمي الصارم من تعريف عقد المهارة
     * @param {Object} def التعريف المطلوب اختباره
     * @returns {{isValid: boolean, errors: Array, data: Object}}
     */
    static validate(def) {
        const errors = [];
        if (!def || typeof def !== 'object') {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'يجب توفير كائن تعريف صالح لعقد المهارة' }],
                data: null
            };
        }

        // 1. المعرف (ID)
        if (!def.id || typeof def.id !== 'string') {
            errors.push({ field: 'id', issue: 'معرف المهارة (id) إلزامي ويجب أن يكون نصاً' });
        } else if (!SKILL_ID_PATTERN.test(def.id)) {
            errors.push({ field: 'id', issue: `صيغة معرف المهارة غير صالحة. النمط المعتمد: 'PF-SKILL-NAME' أو 'name'` });
        }

        // 2. الحقول النصية الأساسية
        if (!def.name || typeof def.name !== 'string' || def.name.trim().length === 0) {
            errors.push({ field: 'name', issue: 'اسم المهارة (name) إلزامي' });
        }
        if (!def.version || typeof def.version !== 'string') {
            errors.push({ field: 'version', issue: 'إصدار المهارة (version) إلزامي' });
        }
        if (!def.description || typeof def.description !== 'string') {
            errors.push({ field: 'description', issue: 'وصف المهارة (description) إلزامي' });
        }
        if (!def.category || typeof def.category !== 'string') {
            errors.push({ field: 'category', issue: 'تصنيف المهارة (category) إلزامي' });
        }
        if (!def.purpose || typeof def.purpose !== 'string' || def.purpose.trim().length === 0) {
            errors.push({ field: 'purpose', issue: 'الهدف المحدد للمهارة (purpose) إلزامي ويجب ألا يكون عاماً أو فارغاً' });
        }

        // 3. الحالة (Status)
        if (!def.status || !Object.values(SKILL_STATUS).includes(def.status)) {
            errors.push({ field: 'status', issue: `حالة المهارة غير صالحة، يجب أن تكون إحدى: ${Object.values(SKILL_STATUS).join(', ')}` });
        }

        // 4. فحص المصفوفات الإلزامية
        const requiredArrayFields = [
            'inputs',
            'outputs',
            'preconditions',
            'postconditions',
            'responsibilities',
            'allowed_agents',
            'prohibited_agents',
            'applicable_rules',
            'security_constraints',
            'permission_requirements',
            'authority_constraints',
            'validators',
            'validation_requirements',
            'verification_requirements',
            'required_evidence',
            'failure_conditions',
            'abstention_conditions',
            'reporting_requirements',
            'audit_requirements'
        ];

        for (const field of requiredArrayFields) {
            if (!Array.isArray(def[field])) {
                errors.push({ field, issue: `الحقل '${field}' إلزامي ويجب أن يكون مصفوفة معرفة` });
            }
        }

        // 5. هيكل مخطط الأدلة (evidence_schema)
        if (!def.evidence_schema || typeof def.evidence_schema !== 'object' || Array.isArray(def.evidence_schema)) {
            errors.push({ field: 'evidence_schema', issue: 'مخطط الأدلة (evidence_schema) إلزامي ويجب أن يكون كائناً' });
        }

        // 6. التحقق من التعارض المنطقي بين الوكلاء المسموحين والمحظورين
        if (Array.isArray(def.allowed_agents) && Array.isArray(def.prohibited_agents)) {
            const overlap = def.allowed_agents.filter(a => def.prohibited_agents.includes(a));
            if (overlap.length > 0) {
                errors.push({
                    field: 'agents_conflict',
                    issue: `تعارض منطقي: الوكلاء التاليين مصرح لهم ومحظورون في آن واحد: ${overlap.join(', ')}`
                });
            }
        }

        // 7. التحقق الأمني: حظر تصعيد السلطة في المهارة (No Authority Escalation)
        if (Array.isArray(def.authority_constraints)) {
            const hasP0Bypass = def.authority_constraints.some(c =>
                c.toLowerCase().includes('override p0') ||
                c.toLowerCase().includes('bypass security') ||
                c.toLowerCase().includes('escalate root')
            );
            if (hasP0Bypass) {
                errors.push({
                    field: 'authority_constraints',
                    issue: 'محاولة تصعيد أمني محظورة: لا يجوز لأي مهارة محاولة تخطي أو كسر قواعد P0 الأمنية'
                });
            }
        }

        if (errors.length > 0) {
            return { isValid: false, errors, data: null };
        }

        return {
            isValid: true,
            errors: [],
            data: {
                id: def.id.trim(),
                name: def.name.trim(),
                version: def.version.trim(),
                description: def.description.trim(),
                category: def.category.trim(),
                purpose: def.purpose.trim(),
                inputs: [...def.inputs],
                outputs: [...def.outputs],
                preconditions: def.preconditions.map(String),
                postconditions: def.postconditions.map(String),
                responsibilities: def.responsibilities.map(String),
                allowed_agents: def.allowed_agents.map(String),
                prohibited_agents: def.prohibited_agents.map(String),
                applicable_rules: def.applicable_rules.map(String),
                security_constraints: def.security_constraints.map(String),
                permission_requirements: def.permission_requirements.map(String),
                authority_constraints: def.authority_constraints.map(String),
                validators: def.validators.map(String),
                validation_requirements: def.validation_requirements.map(String),
                verification_requirements: def.verification_requirements.map(String),
                required_evidence: def.required_evidence.map(String),
                evidence_schema: { ...def.evidence_schema },
                failure_conditions: def.failure_conditions.map(String),
                abstention_conditions: def.abstention_conditions.map(String),
                reporting_requirements: def.reporting_requirements.map(String),
                audit_requirements: def.audit_requirements.map(String),
                status: def.status
            }
        };
    }

    /**
     * التحقق مما إذا كانت المهارة متوافقة ومسموحة لوكيل معين
     * @param {string} agentId معرف الوكيل (مثل 'PF-SEC-001')
     * @returns {boolean}
     */
    isAgentCompatible(agentId) {
        if (!agentId || typeof agentId !== 'string') return false;
        if (this.prohibited_agents.includes(agentId)) return false;
        return this.allowed_agents.includes(agentId) || this.allowed_agents.includes('*');
    }

    /**
     * تقييم الشروط المسبقة لتشغيل المهارة (Preconditions Evaluation)
     * @param {Object} context سياق التنفيذ والبيئة
     * @returns {{passed: boolean, missingConditions: Array}}
     */
    evaluatePreconditions(context = {}) {
        const missingConditions = [];

        if (this.status !== SKILL_STATUS.ACTIVE) {
            missingConditions.push(`المهارة غير نشطة (الحالة الحالية: ${this.status})`);
        }

        if (context.agentId && !this.isAgentCompatible(context.agentId)) {
            missingConditions.push(`الوكيل '${context.agentId}' غير مصرح له باستخدام هذه المهارة`);
        }

        if (context.missingFiles && context.missingFiles.length > 0) {
            missingConditions.push(`الملفات المطلوبة غير متوفرة: ${context.missingFiles.join(', ')}`);
        }

        if (context.missingValidators && context.missingValidators.length > 0) {
            missingConditions.push(`أدوات الفحص المطلوبة غير متوفرة: ${context.missingValidators.join(', ')}`);
        }

        return {
            passed: missingConditions.length === 0,
            missingConditions
        };
    }

    /**
     * تقييم شروط الاستنكاف والامتناع عند الشك أو نقص الأدلة (Fail-Closed Abstention)
     * @param {Object} context سياق المهمة
     * @returns {{shouldAbstain: boolean, reason: string|null}}
     */
    evaluateAbstention(context = {}) {
        const preCheck = this.evaluatePreconditions(context);
        if (!preCheck.passed) {
            return {
                shouldAbstain: true,
                reason: `فشل استيفاء الشروط المسبقة للمهارة: ${preCheck.missingConditions.join('; ')}`
            };
        }

        if (context.untrustedInput && !context.sanitized) {
            return {
                shouldAbstain: true,
                reason: 'اكتشاف مدخلات غير موثوقة لم يتم تطهيرها خادمياً، مما يوجب الاستنكاف الفوري لحماية النظام.'
            };
        }

        if (context.conflictingRules && context.conflictingRules.length > 0) {
            return {
                shouldAbstain: true,
                reason: `تعارض غير محسوم بين القواعد المطبقة على المهارة: ${context.conflictingRules.join(', ')}`
            };
        }

        if (context.insufficientEvidence) {
            return {
                shouldAbstain: true,
                reason: 'الأدلة المتوفرة غير كافية لإثبات سلامة مخرجات المهارة (Abstention !== Falsehood).'
            };
        }

        if (context.staleEvidence) {
            return {
                shouldAbstain: true,
                reason: 'الأدلة المقدمة متقادمة زمنياً ولا تطابق الحالة الحالية للمستودع.'
            };
        }

        return { shouldAbstain: false, reason: null };
    }

    /**
     * بناء سجل تدقيق موحد للعملية متوافق مع مسجل تدقيق الوكيل المركزي
     * @param {Object} executionContext تفاصيل التنفيذ
     * @returns {Object} كائن التدقيق
     */
    buildAuditRecord(executionContext = {}) {
        return {
            skill_id: this.id,
            skillName: this.name,
            category: this.category,
            agent_id: executionContext.agent_id || 'UNSPECIFIED_AGENT',
            intent: executionContext.intent || `استدعاء المهارة الهندسية: ${this.name}`,
            action: executionContext.action || 'SKILL_CAPABILITY_EXECUTION',
            applicableRules: [...this.applicable_rules],
            requiredEvidenceTypes: [...this.required_evidence],
            validatorsExecuted: Array.isArray(executionContext.validatorsExecuted) ? executionContext.validatorsExecuted : [...this.validators],
            evidenceState: executionContext.evidenceState || 'AI_CLAIMED',
            status: executionContext.status || 'EXECUTED',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = SkillContract;
