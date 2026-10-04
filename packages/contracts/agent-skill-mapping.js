/**
 * @file agent-skill-mapping.js
 * @description عقد الربط المعياري الكنسي بين وكلاء الذكاء الاصطناعي والمهارات في ProofForge (Agent ↔ Skill Mapping Contract)
 * يحدد ويضبط ويدقق أي وكيل مصرح له باستخدام أي مهارة وتحت أي قيود، مع التمييز الصارم بين التصريح بالسماح (Allowed) والتفويض التشغيلي الفعلي (Authorized Runtime Execution).
 */

const { AuthorityHierarchy } = require('../orchestration/authority-hierarchy');

class AgentSkillMapping {
    /**
     * الحالات الكنسية لحالة الربط
     */
    static STATUS = Object.freeze({
        ACTIVE: 'ACTIVE',
        DISABLED: 'DISABLED',
        DEPRECATED: 'DEPRECATED',
        DRAFT: 'DRAFT'
    });

    /**
     * إنشاء كائن ربط مجمد وحتمي بين وكيل ومهارة
     * @param {Object} def بيانات تعريف الربط
     */
    constructor(def) {
        const validation = AgentSkillMapping.validate(def);
        if (!validation.isValid) {
            const errorDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join(', ');
            throw new Error(`تعذر إنشاء عقد الربط بين الوكيل والمهارة: ${errorDetails}`);
        }

        this.id = def.id;
        this.agent_id = def.agent_id;
        this.skill_id = def.skill_id;
        this.status = def.status;
        this.mapping_reason = def.mapping_reason;
        this.allowed = Boolean(def.allowed);
        this.restrictions = Object.freeze([...(def.restrictions || [])]);
        this.applicable_rules = Object.freeze([...(def.applicable_rules || [])]);
        this.required_validators = Object.freeze([...(def.required_validators || [])]);
        this.required_evidence = Object.freeze([...(def.required_evidence || [])]);
        this.verification_requirements = Object.freeze([...(def.verification_requirements || [])]);
        this.authority_constraints = Object.freeze([...(def.authority_constraints || [])]);
        this.security_constraints = Object.freeze([...(def.security_constraints || [])]);
        this.abstention_conditions = Object.freeze([...(def.abstention_conditions || [])]);
        this.reporting_requirements = Object.freeze([...(def.reporting_requirements || [])]);

        // التجميد العميق للكائن لمنع أي تلاعب ديناميكي أثناء التشغيل
        Object.freeze(this);
    }

    /**
     * التحقق الحتمي الصارم من بيانات عقد الربط وتطبيق مبدأ الفشل المغلق (Fail-Closed)
     * @param {Object} def كائن التعريف الممرر
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object') {
            return {
                isValid: false,
                errors: [{ field: 'def', issue: 'يجب أن يكون تعريف عقد الربط كائناً برمجياً صالحاً' }]
            };
        }

        // 1. معرف الربط (id)
        if (!def.id || typeof def.id !== 'string' || !def.id.trim()) {
            errors.push({ field: 'id', issue: 'معرف الربط (id) إلزامي ويجب أن يكون نصاً غير فارغ' });
        } else if (!/^MAP-PF-[A-Z0-9]+-[A-Z0-9-_]+$/.test(def.id) && !/^MAP-[A-Za-z0-9_-]+$/.test(def.id)) {
            errors.push({ field: 'id', issue: 'معرف الربط غير مطابق للنمط الكنسي المعتمد (MAP-...)' });
        }

        // 2. معرف الوكيل (agent_id)
        if (!def.agent_id || typeof def.agent_id !== 'string' || !def.agent_id.trim()) {
            errors.push({ field: 'agent_id', issue: 'معرف الوكيل (agent_id) إلزامي' });
        }

        // 3. معرف المهارة (skill_id)
        if (!def.skill_id || typeof def.skill_id !== 'string' || !def.skill_id.trim()) {
            errors.push({ field: 'skill_id', issue: 'معرف المهارة (skill_id) إلزامي' });
        }

        // 4. حالة الربط (status)
        const validStatuses = Object.values(AgentSkillMapping.STATUS);
        if (!def.status || !validStatuses.includes(def.status)) {
            errors.push({ field: 'status', issue: `حالة الربط غير صالحة. الحالات المقبولة: ${validStatuses.join(', ')}` });
        }

        // 5. سبب الربط (mapping_reason)
        if (!def.mapping_reason || typeof def.mapping_reason !== 'string' || !def.mapping_reason.trim()) {
            errors.push({ field: 'mapping_reason', issue: 'سبب الربط والغرض المعماري (mapping_reason) إلزامي' });
        }

        // 6. قيمة السماح (allowed)
        if (typeof def.allowed !== 'boolean') {
            errors.push({ field: 'allowed', issue: 'حقل السماح (allowed) يجب أن يكون قيمة منطقية صريحة (boolean)' });
        }

        // 7. تناسق الحالة مع السماح: إذا كان الربط معطلاً أو مسودة، لا يجوز أن يكون مسموحاً بنشاط فعال
        if (def.status === AgentSkillMapping.STATUS.DISABLED && def.allowed === true) {
            errors.push({ field: 'status/allowed', issue: 'لا يجوز تفعيل السماح (allowed: true) لربط يحمل حالة معطل (DISABLED)' });
        }

        // 8. فحص المصفوفات الإلزامية
        const arrayFields = [
            'restrictions',
            'applicable_rules',
            'required_validators',
            'required_evidence',
            'verification_requirements',
            'authority_constraints',
            'security_constraints',
            'abstention_conditions',
            'reporting_requirements'
        ];

        for (const field of arrayFields) {
            if (def[field] !== undefined && !Array.isArray(def[field])) {
                errors.push({ field, issue: `حقل '${field}' يجب أن يكون مصفوفة نصوص صالحة` });
            }
        }

        // 9. التحقق من حظر التصعيد الذاتي للسلطة عبر قيود الربط
        if (Array.isArray(def.authority_constraints)) {
            const hasEscalationClaim = def.authority_constraints.some(c => 
                typeof c === 'string' && (c.includes('P0_MAXIMUM') || c.includes('OVERRIDE_CONSTITUTION'))
            );
            if (hasEscalationClaim) {
                errors.push({ field: 'authority_constraints', issue: 'محاولة تصعيد سلطة محظورة: لا يجوز لأي ربط منح حق تجاوز P0 أو الدستور' });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * التمييز الصارم بين التصريح بالسماح والتفويض التشغيلي الفعلي في وقت التنفيذ:
     * Allowed ≠ Authorized Runtime Execution
     * @param {Object} agentInstance كائن الوكيل المعتمد (AgentContract instance)
     * @param {Object} skillInstance كائن المهارة المعتمد (SkillContract instance)
     * @param {Object} context سياق التنفيذ الحالي
     * @param {Object} [permissionBoundary] محرك حاجز الصلاحيات الأمني الاختياري
     * @returns {{authorized: boolean, allowed: boolean, status: string, reason: string, details: Object}}
     */
    evaluateRuntimeAuthorization(agentInstance, skillInstance, context = {}, permissionBoundary = null) {
        // 1. الفحص المبدئي للربط ذاته: هل هو مصرح به ونشط؟
        if (!this.allowed) {
            return {
                authorized: false,
                allowed: false,
                status: this.status,
                reason: 'MAPPING_DISALLOWED',
                details: { issue: 'عقد الربط ينص صراحة على حظر هذا الاستخدام (allowed: false)' }
            };
        }

        if (this.status !== AgentSkillMapping.STATUS.ACTIVE) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'MAPPING_NOT_ACTIVE',
                details: { issue: `حالة عقد الربط هي '${this.status}' وليست 'ACTIVE'` }
            };
        }

        // 2. التحقق من سلامة كائن الوكيل وحالته التشغيلية
        if (!agentInstance || typeof agentInstance !== 'object' || agentInstance.id !== this.agent_id) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'INVALID_OR_MISMATCHED_AGENT',
                details: { issue: 'كائن الوكيل غير صالح أو لا يتطابق معرفه مع معرف الوكيل في العقد' }
            };
        }

        if (agentInstance.status !== 'ACTIVE') {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'AGENT_NOT_ACTIVE',
                details: { issue: `وكيل التنفيذ '${agentInstance.id}' ليس في حالة نشطة (حالة الوكيل: ${agentInstance.status})` }
            };
        }

        // 3. التحقق من سلامة كائن المهارة وحالتها التشغيلية
        // المهارة المعطلة لا تصبح صالحة لمجرد وجود ربط!
        if (!skillInstance || typeof skillInstance !== 'object') {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'INVALID_SKILL_OBJECT',
                details: { issue: 'كائن المهارة الممرر مشوه أو غير صالح' }
            };
        }

        const skillId = skillInstance.id;
        if (skillId !== this.skill_id && skillInstance.name !== this.skill_id) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'SKILL_ID_MISMATCH',
                details: { issue: `معرف المهارة '${skillId}' لا يتطابق مع المهارة المعرفة في عقد الربط '${this.skill_id}'` }
            };
        }

        if (skillInstance.status !== 'ACTIVE') {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'SKILL_NOT_ACTIVE',
                details: { issue: `المهارة '${skillId}' معطلة أو في طور المسودة (حالة المهارة: ${skillInstance.status}). لا يمكن تشغيل مهارة غير نشطة بمجرد وجود ربط` }
            };
        }

        // 4. التحقق من التوافق المتبادل الصريح بين عقدي الوكيل والمهارة
        if (Array.isArray(skillInstance.prohibited_agents) && skillInstance.prohibited_agents.includes(agentInstance.id)) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'AGENT_EXPLICITLY_PROHIBITED_BY_SKILL',
                details: { issue: `الوكيل '${agentInstance.id}' محظور صراحة في قائمة prohibited_agents للمهارة` }
            };
        }

        if (Array.isArray(agentInstance.prohibited_skills) && (agentInstance.prohibited_skills.includes(skillInstance.id) || agentInstance.prohibited_skills.includes(this.skill_id))) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'SKILL_EXPLICITLY_PROHIBITED_BY_AGENT',
                details: { issue: `المهارة '${skillInstance.id}' محظورة صراحة في قائمة prohibited_skills للوكيل` }
            };
        }

        // 5. التحقق من شروط الامتناع والاستنكاف الإدراكي (Abstention Conditions)
        if (context.hasAmbiguousScope === true || context.unverifiedInput === true) {
            return {
                authorized: false,
                allowed: this.allowed,
                status: this.status,
                reason: 'ABSTENTION_TRIGGERED',
                details: { issue: 'تحفيز شرط الامتناع والاستنكاف الإدراكي بسبب غموض السياق أو مدخلات غير موثوقة' }
            };
        }

        // 6. التحقق من القيود الصريحة المحددة في الربط (Restrictions)
        if (this.restrictions.length > 0) {
            if (this.restrictions.includes('READ_ONLY') && (context.isWriteOperation === true || context.intent === 'WRITE')) {
                return {
                    authorized: false,
                    allowed: this.allowed,
                    status: this.status,
                    reason: 'RESTRICTION_VIOLATION_READ_ONLY',
                    details: { issue: 'الربط مقيد بالقراءة فقط (READ_ONLY)، ومحاولة الكتابة محظورة قطيعاً' }
                };
            }
        }

        // 7. التحقق عبر حاجز الصلاحيات الأمني في حال تم توفيره
        if (permissionBoundary && typeof permissionBoundary.enforcePermission === 'function') {
            const action = context.action || 'EXECUTE_SKILL';
            const permCheck = permissionBoundary.enforcePermission(agentInstance.id, action, context);
            if (!permCheck || permCheck.allowed !== true) {
                return {
                    authorized: false,
                    allowed: this.allowed,
                    status: this.status,
                    reason: 'PERMISSION_BOUNDARY_DENIED',
                    details: { issue: permCheck ? permCheck.reason : 'رفض من حاجز الصلاحيات الأمني المركزي' }
                };
            }
        }

        // استيفاء كافة الشروط بنجاح وتفويض التنفيذ التشغيلي
        return {
            authorized: true,
            allowed: true,
            status: this.status,
            reason: 'AUTHORIZED',
            details: {
                agent_id: this.agent_id,
                skill_id: this.skill_id,
                required_validators: this.required_validators,
                required_evidence: this.required_evidence,
                verification_requirements: this.verification_requirements
            }
        };
    }
}

module.exports = AgentSkillMapping;
