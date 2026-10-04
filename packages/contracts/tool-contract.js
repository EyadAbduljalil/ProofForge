/**
 * @file tool-contract.js
 * @description عقد حوكمة الأدوات وخوادم MCP المعياري الكنسي في نظام ProofForge (Phase 8)
 * يحكم التصريح بالأدوات وعمليات MCP مع فرض مبادئ الأمان الصارمة:
 * - Tool Result !== Evidence
 * - MCP Result !== Verified Fact
 * - Tool Availability !== Permission
 * - Tool Permission !== Evidence
 * - External Content !== Trusted Instruction
 */

'use strict';

class ToolContract {
    /**
     * الحالات التشغيلية المعتمدة للأداة / MCP
     */
    static STATUS = Object.freeze({
        DRAFT: 'DRAFT',
        ACTIVE: 'ACTIVE',
        DEPRECATED: 'DEPRECATED',
        DISABLED: 'DISABLED'
    });

    /**
     * تصنيفات الأدوات و MCP
     */
    static TOOL_TYPES = Object.freeze({
        INTERNAL_TOOL: 'INTERNAL_TOOL',
        EXTERNAL_TOOL: 'EXTERNAL_TOOL',
        MCP_SERVER: 'MCP_SERVER',
        MCP_RESOURCE: 'MCP_RESOURCE',
        MCP_OPERATION: 'MCP_OPERATION'
    });

    /**
     * مستويات الثقة المعمارية (الأدوات الخارجية غير موثوقة افتراضياً)
     */
    static TRUST_LEVELS = Object.freeze({
        UNTRUSTED: 'UNTRUSTED',
        SANDBOXED: 'SANDBOXED',
        SYSTEM: 'SYSTEM'
    });

    /**
     * بيئات العمل المصرح بها
     */
    static ENVIRONMENTS = Object.freeze({
        SANDBOX: 'SANDBOX',
        TEST: 'TEST',
        DEVELOPMENT: 'DEVELOPMENT',
        PRODUCTION_RESTRICTED: 'PRODUCTION_RESTRICTED'
    });

    /**
     * إنشاء كائن عقد الأداة وتجميده حتمياً
     * @param {Object} def بيانات تعريف الأداة / MCP
     */
    constructor(def) {
        const validation = ToolContract.validate(def);
        if (!validation.isValid) {
            const errDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
            throw new Error(`فشل إنشاء عقد الأداة / MCP (Fail-Closed): ${errDetails}`);
        }

        // الحقول الأساسية
        this.tool_id = String(def.tool_id);
        this.name = String(def.name);
        this.version = String(def.version);
        this.type = def.type;
        this.provider = String(def.provider);
        this.description = String(def.description);
        this.status = def.status;
        this.trust_level = def.trust_level;
        this.environment_scope = def.environment_scope;

        // المخططات والنطاقات
        this.input_schema = Object.freeze({ ...(def.input_schema || {}) });
        this.output_schema = Object.freeze({ ...(def.output_schema || {}) });
        this.data_scope = Object.freeze({ ...(def.data_scope || {}) });

        // المصفوفات المقيدة المجمدة
        this.permission_requirements = Object.freeze([...(def.permission_requirements || [])]);
        this.security_constraints = Object.freeze([...(def.security_constraints || [])]);
        this.allowed_agents = Object.freeze([...(def.allowed_agents || [])]);
        this.prohibited_agents = Object.freeze([...(def.prohibited_agents || [])]);
        this.allowed_skills = Object.freeze([...(def.allowed_skills || [])]);
        this.prohibited_skills = Object.freeze([...(def.prohibited_skills || [])]);
        this.allowed_workflows = Object.freeze([...(def.allowed_workflows || [])]);
        this.prohibited_workflows = Object.freeze([...(def.prohibited_workflows || [])]);
        this.evidence_behavior = String(def.evidence_behavior || 'REQUIRES_VALIDATION_NOT_EVIDENCE');
        this.audit_requirements = Object.freeze([...(def.audit_requirements || [])]);
        this.failure_conditions = Object.freeze([...(def.failure_conditions || [])]);
        this.abstention_conditions = Object.freeze([...(def.abstention_conditions || [])]);

        // التجميد العميق الحتمي للكائن الأساسي
        Object.freeze(this);
    }

    /**
     * فحص حتمي مغلق (Fail-Closed) لبيانات عقد الأداة / MCP
     * @param {Object} def بيانات التعريف
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object' || Array.isArray(def)) {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'بيانات عقد الأداة يجب أن تكون كائناً غير فارغ' }]
            };
        }

        // 1. معرف الأداة (tool_id)
        const idPattern = /^PF-(TOOL|MCP)-[A-Z0-9_-]+$/;
        if (!def.tool_id || typeof def.tool_id !== 'string') {
            errors.push({ field: 'tool_id', issue: 'حقل tool_id إلزامي ويجب أن يكون نصاً' });
        } else if (!idPattern.test(def.tool_id)) {
            errors.push({
                field: 'tool_id',
                issue: `معرف الأداة '${def.tool_id}' غير مطابق للنمط الكنسي (^PF-(TOOL|MCP)-[A-Z0-9_-]+$)`
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

        // 4. النوع (type)
        if (!def.type || !Object.values(ToolContract.TOOL_TYPES).includes(def.type)) {
            errors.push({
                field: 'type',
                issue: `نوع الأداة غير صالح. الأنواع المسموحة: ${Object.values(ToolContract.TOOL_TYPES).join(', ')}`
            });
        }

        // 5. المزود (provider)
        if (!def.provider || typeof def.provider !== 'string' || def.provider.trim() === '') {
            errors.push({ field: 'provider', issue: 'حقل provider إلزامي لتحديد مصدر الأداة' });
        }

        // 6. الوصف (description)
        if (!def.description || typeof def.description !== 'string' || def.description.trim() === '') {
            errors.push({ field: 'description', issue: 'حقل description إلزامي' });
        }

        // 7. الحالة (status)
        if (!def.status || !Object.values(ToolContract.STATUS).includes(def.status)) {
            errors.push({
                field: 'status',
                issue: `حالة الأداة غير صالحة. القيم المسموحة: ${Object.values(ToolContract.STATUS).join(', ')}`
            });
        }

        // 8. مستوى الثقة (trust_level)
        if (!def.trust_level || !Object.values(ToolContract.TRUST_LEVELS).includes(def.trust_level)) {
            errors.push({
                field: 'trust_level',
                issue: `مستوى الثقة غير صالح. القيم المسموحة: ${Object.values(ToolContract.TRUST_LEVELS).join(', ')}`
            });
        }

        // 9. بيئة الاستدعاء (environment_scope)
        if (!def.environment_scope || !Object.values(ToolContract.ENVIRONMENTS).includes(def.environment_scope)) {
            errors.push({
                field: 'environment_scope',
                issue: `بيئة الاستدعاء غير صالحة. البيئات المسموحة: ${Object.values(ToolContract.ENVIRONMENTS).join(', ')}`
            });
        }

        // 10. مخططات المدخلات والمخرجات (input_schema, output_schema)
        if (!def.input_schema || typeof def.input_schema !== 'object') {
            errors.push({ field: 'input_schema', issue: 'حقل input_schema إلزامي لتحديد قيود المدخلات' });
        }
        if (!def.output_schema || typeof def.output_schema !== 'object') {
            errors.push({ field: 'output_schema', issue: 'حقل output_schema إلزامي لتحديد قيود المخرجات' });
        }

        // 11. الصلاحيات والمحددات الأمنية
        if (!Array.isArray(def.permission_requirements) || def.permission_requirements.length === 0) {
            errors.push({ field: 'permission_requirements', issue: 'حقل permission_requirements إلزامي ويجب ألا يكون فارغاً' });
        }
        if (!Array.isArray(def.security_constraints) || def.security_constraints.length === 0) {
            errors.push({ field: 'security_constraints', issue: 'حقل security_constraints إلزامي ويجب ألا يكون فارغاً' });
        }

        // 12. مصفوفات الوكلاء والمهارات وتدفقات العمل
        if (!Array.isArray(def.allowed_agents)) {
            errors.push({ field: 'allowed_agents', issue: 'حقل allowed_agents يجب أن يكون مصفوفة معرفات وكلاء' });
        }
        if (!Array.isArray(def.prohibited_agents)) {
            errors.push({ field: 'prohibited_agents', issue: 'حقل prohibited_agents يجب أن يكون مصفوفة معرفات وكلاء' });
        }
        if (!Array.isArray(def.allowed_skills)) {
            errors.push({ field: 'allowed_skills', issue: 'حقل allowed_skills يجب أن يكون مصفوفة معرفات مهارات' });
        }
        if (!Array.isArray(def.prohibited_skills)) {
            errors.push({ field: 'prohibited_skills', issue: 'حقل prohibited_skills يجب أن يكون مصفوفة معرفات مهارات' });
        }
        if (!Array.isArray(def.allowed_workflows)) {
            errors.push({ field: 'allowed_workflows', issue: 'حقل allowed_workflows يجب أن يكون مصفوفة معرفات تدفقات عمل' });
        }
        if (!Array.isArray(def.prohibited_workflows)) {
            errors.push({ field: 'prohibited_workflows', issue: 'حقل prohibited_workflows يجب أن يكون مصفوفة معرفات تدفقات عمل' });
        }

        // 13. فحص التناقضات بين المسموح والمحظور
        if (Array.isArray(def.allowed_agents) && Array.isArray(def.prohibited_agents)) {
            const conflictAgents = def.allowed_agents.filter(a => def.prohibited_agents.includes(a));
            if (conflictAgents.length > 0) {
                errors.push({
                    field: 'allowed_agents/prohibited_agents',
                    issue: `تناقض حتمي: الوكلاء التاليون مدرجون في المسموح والمحظور معاً: ${conflictAgents.join(', ')}`
                });
            }
        }
        if (Array.isArray(def.allowed_skills) && Array.isArray(def.prohibited_skills)) {
            const conflictSkills = def.allowed_skills.filter(s => def.prohibited_skills.includes(s));
            if (conflictSkills.length > 0) {
                errors.push({
                    field: 'allowed_skills/prohibited_skills',
                    issue: `تناقض حتمي: المهارات التالية مدرجة في المسموح والمحظور معاً: ${conflictSkills.join(', ')}`
                });
            }
        }

        // 14. متطلبات التدقيق والاستنكاف والفشل
        if (!Array.isArray(def.audit_requirements) || def.audit_requirements.length === 0) {
            errors.push({ field: 'audit_requirements', issue: 'حقل audit_requirements إلزامي لضمان التسجيل في سجل التدقيق' });
        }
        if (!Array.isArray(def.failure_conditions) || def.failure_conditions.length === 0) {
            errors.push({ field: 'failure_conditions', issue: 'حقل failure_conditions إلزامي لتحديد شروط الفشل المغلق' });
        }
        if (!Array.isArray(def.abstention_conditions) || def.abstention_conditions.length === 0) {
            errors.push({ field: 'abstention_conditions', issue: 'حقل abstention_conditions إلزامي لتحديد شروط الامتناع' });
        }

        // ==========================================
        // الفحوصات الأمنية الحتمية (Anti-Bypass & Anti-Escalation)
        // ==========================================

        const fullString = JSON.stringify(def);

        // أ. كشف محاولة تجاوز سياسات الأمان P0
        if (/BYPASS[_\s-]+P0|OVERRIDE[_\s-]+P0|IGNORE[_\s-]+P0/i.test(fullString)) {
            errors.push({
                field: 'security_constraints',
                issue: 'محاولة غير مصرح بها لتجاوز سياسات الأمان P0 في عقد الأداة'
            });
        }

        // ب. كشف محاولة تصعيد السلطة (Authority Escalation)
        if (/GRANT[_\s-]+P0|ACQUIRE[_\s-]+P0|CLAIM[_\s-]+P0_AUTHORITY|ESCALATE[_\s-]+AUTHORITY/i.test(fullString)) {
            errors.push({
                field: 'security_constraints',
                issue: 'محاولة تصعيد سلطة ذاتية غير مصرح بها للأداة'
            });
        }

        // ج. كشف محاولة مساواة نتيجة الأداة بالدليل مباشرة دون تحقق (Tool Result !== Evidence)
        if (/TOOL_RESULT_IS_EVIDENCE|TRUST_EXTERNAL_RESULT|AUTO_PROMOTE_TO_VERIFIED/i.test(fullString)) {
            errors.push({
                field: 'evidence_behavior',
                issue: 'انتهاك ميثاق الأدلة: نتائج الأدوات لا تمثل أدلة قطعية دون التحقق المستقل في CVGF'
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = ToolContract;
