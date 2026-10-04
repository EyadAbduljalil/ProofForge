/**
 * @file agent-contract.js
 * @description عقد وكيل الذكاء الاصطناعي المعياري في ProofForge (ProofForge Canonical Agent Contract)
 * يوفر نموذجاً حتمياً وصارماً يحدد حقوق ومسؤوليات وقيود وبراهين الوكلاء
 * ويمنع التصعيد الذاتي للسلطة أو تجاوز الحدود الأمنية
 */

const AuthorityHierarchy = require('../orchestration/authority-hierarchy');
const AgentPermissionBoundary = require('../security/agent-permission-boundary');

/**
 * حالات دورة حياة الوكيل المعتمدة
 */
const AGENT_STATUS = Object.freeze({
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    DEPRECATED: 'DEPRECATED',
    DISABLED: 'DISABLED'
});

/**
 * التمييز الصارم بين حالات الإنجاز والأدلة
 */
const EVIDENCE_STATES = Object.freeze({
    AI_CLAIMED: 'AI_CLAIMED',                   // ادعاء غير موثق من الذكاء الاصطناعي
    CODE_CHANGED: 'CODE_CHANGED',               // رصد تعديل مادي في الشفرة المصدرية
    TEST_PASSED: 'TEST_PASSED',                 // نجاح اختبار آلي ذي صلة
    EVIDENCE_EXISTS: 'EVIDENCE_EXISTS',         // توفر دليل قطعي في الرسم البياني للأدلة
    PROOFFORGE_VERIFIED: 'PROOFFORGE_VERIFIED'   // اعتماد رسمي عبر بوابات CVGF
});

/**
 * نمط معرفات الوكلاء الحتمي
 */
const AGENT_ID_PATTERN = /^PF-[A-Z0-9]+-[0-9]{3}$/;

class AgentContract {
    /**
     * @param {Object} definition تعريف كائن الوكيل
     */
    constructor(definition) {
        const validation = AgentContract.validate(definition);
        if (!validation.isValid) {
            const errorMsg = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join(', ');
            throw new Error(`تعريف عقد الوكيل غير صالح: ${errorMsg}`);
        }

        const data = validation.data;
        this.id = data.id;
        this.name = data.name;
        this.version = data.version;
        this.description = data.description;
        this.role = data.role;
        this.expertise = Object.freeze([...data.expertise]);
        this.responsibilities = Object.freeze([...data.responsibilities]);
        this.allowed_tasks = Object.freeze([...data.allowed_tasks]);
        this.prohibited_tasks = Object.freeze([...data.prohibited_tasks]);
        this.allowed_skills = Object.freeze([...data.allowed_skills]);
        this.required_skills = Object.freeze([...data.required_skills]);
        this.prohibited_skills = Object.freeze([...data.prohibited_skills]);
        this.applicable_rules = Object.freeze([...data.applicable_rules]);
        this.security_constraints = Object.freeze([...data.security_constraints]);
        this.permission_boundary = Object.freeze({ ...data.permission_boundary });
        this.authority_level = data.authority_level;
        this.required_evidence = Object.freeze([...data.required_evidence]);
        this.validation_requirements = Object.freeze([...data.validation_requirements]);
        this.verification_requirements = Object.freeze([...data.verification_requirements]);
        this.failure_conditions = Object.freeze([...data.failure_conditions]);
        this.abstention_conditions = Object.freeze([...data.abstention_conditions]);
        this.reporting_requirements = Object.freeze([...data.reporting_requirements]);
        this.audit_requirements = Object.freeze([...data.audit_requirements]);
        this.status = data.status;

        // تجميد العقد لضمان عدم التلاعب به برمجياً أثناء التشغيل
        Object.freeze(this);
    }

    static get STATUS() {
        return AGENT_STATUS;
    }

    static get EVIDENCE_STATES() {
        return EVIDENCE_STATES;
    }

    /**
     * التحقق الحتمي الصارم من تعريف العقد
     * @param {Object} def التعريف المطلوب اختباره
     * @returns {{isValid: boolean, errors: Array, data: Object}}
     */
    static validate(def) {
        const errors = [];
        if (!def || typeof def !== 'object') {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'يجب توفير كائن تعريف صالح لعقد الوكيل' }],
                data: null
            };
        }

        // 1. المعرف (ID)
        if (!def.id || typeof def.id !== 'string') {
            errors.push({ field: 'id', issue: 'معرف الوكيل (id) إلزامي ويجب أن يكون نصاً' });
        } else if (!AGENT_ID_PATTERN.test(def.id)) {
            errors.push({ field: 'id', issue: `صيغة معرف الوكيل غير صالحة، يجب أن تطابق النمط 'PF-[ROLE]-[NUM]' مثل 'PF-SEC-001'` });
        }

        // 2. الاسم والنسخة والوصف والدور
        if (!def.name || typeof def.name !== 'string' || def.name.trim().length === 0) {
            errors.push({ field: 'name', issue: 'اسم الوكيل (name) إلزامي' });
        }
        if (!def.version || typeof def.version !== 'string') {
            errors.push({ field: 'version', issue: 'إصدار الوكيل (version) إلزامي' });
        }
        if (!def.description || typeof def.description !== 'string') {
            errors.push({ field: 'description', issue: 'وصف الوكيل (description) إلزامي' });
        }
        if (!def.role || typeof def.role !== 'string') {
            errors.push({ field: 'role', issue: 'دور الوكيل (role) إلزامي' });
        }

        // 3. الحالة (Status)
        if (!def.status || !Object.values(AGENT_STATUS).includes(def.status)) {
            errors.push({ field: 'status', issue: `حالة الوكيل غير صالحة، يجب أن تكون إحدى: ${Object.values(AGENT_STATUS).join(', ')}` });
        }

        // 4. مستوى السلطة وهرمية القرار (Authority Level)
        const validAuthorityLevels = Object.keys(AuthorityHierarchy.LEVELS);
        if (!def.authority_level || !validAuthorityLevels.includes(def.authority_level)) {
            errors.push({ field: 'authority_level', issue: `مستوى السلطة غير صالح. المستويات المعتمدة: ${validAuthorityLevels.join(', ')}` });
        } else {
            // التحقق الأمني: منع التصعيد الذاتي للسلطة (No Self-Escalation)
            // لا يجوز لأي وكيل أن يمنح نفسه سلطة P0_SECURITY_SAFETY أو P1_CONSTITUTION
            if (['P0_SECURITY_SAFETY', 'P1_CONSTITUTION'].includes(def.authority_level)) {
                errors.push({
                    field: 'authority_level',
                    issue: `محاولة تصعيد أمني غير مصرح به: لا يجوز لأي وكيل امتلاك سلطة '${def.authority_level}' المحجوزة حصرياً للدستور والأمان العام.`
                });
            }
        }

        // 5. فحص المصفوفات الإلزامية
        const requiredArrayFields = [
            'expertise',
            'responsibilities',
            'allowed_tasks',
            'prohibited_tasks',
            'allowed_skills',
            'required_skills',
            'prohibited_skills',
            'applicable_rules',
            'security_constraints',
            'required_evidence',
            'validation_requirements',
            'verification_requirements',
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

        // 6. حدود الصلاحيات المعلنة (Permission Boundary)
        if (!def.permission_boundary || typeof def.permission_boundary !== 'object' || Array.isArray(def.permission_boundary)) {
            errors.push({ field: 'permission_boundary', issue: 'حدود الصلاحيات (permission_boundary) إلزامية ويجب أن تكون كائناً' });
        }

        // 7. فحوصات التعارض المنطقي الداخلي
        if (Array.isArray(def.allowed_skills) && Array.isArray(def.prohibited_skills)) {
            const overlap = def.allowed_skills.filter(s => def.prohibited_skills.includes(s));
            if (overlap.length > 0) {
                errors.push({
                    field: 'skills_conflict',
                    issue: `تعارض في المهارات: المهارات التالية مسموحة ومحظورة في آن واحد: ${overlap.join(', ')}`
                });
            }
        }

        if (Array.isArray(def.allowed_tasks) && Array.isArray(def.prohibited_tasks)) {
            const overlap = def.allowed_tasks.filter(t => def.prohibited_tasks.includes(t));
            if (overlap.length > 0) {
                errors.push({
                    field: 'tasks_conflict',
                    issue: `تعارض في المهام: المهام التالية مسموحة ومحظورة في آن واحد: ${overlap.join(', ')}`
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
                role: def.role.trim(),
                expertise: def.expertise.map(String),
                responsibilities: def.responsibilities.map(String),
                allowed_tasks: def.allowed_tasks.map(String),
                prohibited_tasks: def.prohibited_tasks.map(String),
                allowed_skills: def.allowed_skills.map(String),
                required_skills: def.required_skills.map(String),
                prohibited_skills: def.prohibited_skills.map(String),
                applicable_rules: def.applicable_rules.map(String),
                security_constraints: def.security_constraints.map(String),
                permission_boundary: { ...def.permission_boundary },
                authority_level: def.authority_level,
                required_evidence: def.required_evidence.map(String),
                validation_requirements: def.validation_requirements.map(String),
                verification_requirements: def.verification_requirements.map(String),
                failure_conditions: def.failure_conditions.map(String),
                abstention_conditions: def.abstention_conditions.map(String),
                reporting_requirements: def.reporting_requirements.map(String),
                audit_requirements: def.audit_requirements.map(String),
                status: def.status
            }
        };
    }

    /**
     * التحقق مما إذا كانت المهمة مصرحة ومسموحة صراحة للوكيل
     * @param {string} taskType نوع المهمة
     * @returns {boolean}
     */
    isTaskAllowed(taskType) {
        if (!taskType || typeof taskType !== 'string') return false;
        if (this.prohibited_tasks.includes(taskType)) return false;
        return this.allowed_tasks.includes(taskType) || this.allowed_tasks.includes('*');
    }

    /**
     * تقييم ما إذا كان يجب على الوكيل الاستنكاف والامتناع عن التنفيذ (Fail-Closed Abstention)
     * @param {Object} context سياق العملية
     * @returns {{shouldAbstain: boolean, reason: string|null}}
     */
    evaluateAbstention(context = {}) {
        if (this.status !== AGENT_STATUS.ACTIVE) {
            return {
                shouldAbstain: true,
                reason: `الوكيل غير نشط (الحالة الحالية: ${this.status}). يُحظر تنفيذ أي مهمة بحالة غير نشطة.`
            };
        }

        if (context.untrustedContent && !context.sanitized) {
            return {
                shouldAbstain: true,
                reason: 'اكتشاف محتوى غير موثوق غير مطهر (Untrusted Content) يتطلب الاستنكاف الفوري حماية للنظام.'
            };
        }

        if (context.conflictingRequirements && context.conflictingRequirements.length > 0) {
            return {
                shouldAbstain: true,
                reason: `وجود تعارض غير محلول بين متطلبات المهمة والقواعد الهندسية: ${context.conflictingRequirements.join(', ')}`
            };
        }

        if (context.missingRequiredSkills && context.missingRequiredSkills.length > 0) {
            return {
                shouldAbstain: true,
                reason: `غياب مهارات إلزامية مطلوبة لإنجاز المهمة: ${context.missingRequiredSkills.join(', ')}`
            };
        }

        if (context.insufficientEvidence) {
            return {
                shouldAbstain: true,
                reason: 'الأدلة المتوفرة غير كافية لإثبات صحة ومأمونية التنفيذ الهندسي (Abstention !== Falsehood).'
            };
        }

        return { shouldAbstain: false, reason: null };
    }

    /**
     * التحقق الفعلي من إمكانية تنفيذ عملية عبر حاجز الصلاحيات الأمني المعتمد
     * الصلاحيات المعلنة في العقد لا تصبح سارية إلا بعد فحصها بواسطة AgentPermissionBoundary
     * @param {string} action العملية المراد تنفيذها
     * @param {Object} context سياق التنفيذ والتوثيق
     * @returns {Object} نتيجة الفحص الأمني
     */
    enforcePermission(action, context = {}) {
        const declaredPolicy = this.permission_boundary[action];
        if (!declaredPolicy || declaredPolicy === 'DENIED') {
            return {
                allowed: false,
                reason: `العملية '${action}' محظورة في عقد الوكيل الصريح (${this.id}).`
            };
        }

        // تفويض الفحص الفعلي لمحرك الأمان المركزي المعتمد
        const boundary = new AgentPermissionBoundary({ [action]: declaredPolicy });
        return boundary.evaluatePermission(action, context);
    }

    /**
     * تحويل بيانات تنفيذ الوكيل إلى نموذج تدقيق قياسي متوافق مع AgentAuditRecorder
     * @param {Object} executionContext بيانات التنفيذ
     * @returns {Object} كائن التدقيق الجاهز للتسجيل
     */
    buildAuditRecord(executionContext = {}) {
        return {
            agent_id: this.id,
            agentName: this.name,
            role: this.role,
            authority_level: this.authority_level,
            intent: executionContext.intent || `تنفيذ عملية عبر الوكيل ${this.name}`,
            action: executionContext.action || 'AGENT_TASK_EXECUTION',
            filesChanged: Array.isArray(executionContext.filesChanged) ? executionContext.filesChanged : [],
            requiredEvidenceTypes: [...this.required_evidence],
            validationRequirements: [...this.validation_requirements],
            status: executionContext.status || 'EXECUTED',
            evidenceState: executionContext.evidenceState || EVIDENCE_STATES.AI_CLAIMED,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = AgentContract;
