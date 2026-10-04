/**
 * @file tool-registry.js
 * @description محرك سجل الأدوات وخوادم MCP الكنسي في نظام ProofForge (Phase 8)
 * يوفر إدارة تصريحية حتمية وفحصاً مغلقاً (Fail-Closed) للأدوات وعمليات MCP مع التكامل الأمني الصارم.
 */

'use strict';

const fs = require('fs');
const ToolContract = require('./tool-contract');

class ToolRegistry {
    constructor() {
        /**
         * خريطة الأدوات المفهرسة بالمعرف
         * @type {Map<string, ToolContract>}
         */
        this.tools = new Map();

        /**
         * الفهرسة بالوكلاء المصرح لهم
         * @type {Map<string, Set<string>>}
         */
        this.agentIndex = new Map();

        /**
         * الفهرسة بالمهارات المصرح لها
         * @type {Map<string, Set<string>>}
         */
        this.skillIndex = new Map();

        /**
         * الفهرسة بتدفقات العمل المصرح لها
         * @type {Map<string, Set<string>>}
         */
        this.workflowIndex = new Map();
    }

    /**
     * تسجيل أداة مجمدة داخل السجل
     * @param {ToolContract} tool
     */
    registerTool(tool) {
        if (!(tool instanceof ToolContract)) {
            throw new Error('الكائن المراد تسجيله يجب أن يكون نسخة صالحة ومجمدة من ToolContract');
        }

        if (this.tools.has(tool.tool_id)) {
            throw new Error(`معرف الأداة مكرر بالفعل في السجل: '${tool.tool_id}'`);
        }

        this.tools.set(tool.tool_id, tool);

        // الفهرسة بالوكلاء
        for (const agentId of tool.allowed_agents) {
            if (!this.agentIndex.has(agentId)) {
                this.agentIndex.set(agentId, new Set());
            }
            this.agentIndex.get(agentId).add(tool.tool_id);
        }

        // الفهرسة بالمهارات
        for (const skillId of tool.allowed_skills) {
            if (!this.skillIndex.has(skillId)) {
                this.skillIndex.set(skillId, new Set());
            }
            this.skillIndex.get(skillId).add(tool.tool_id);
        }

        // الفهرسة بتدفقات العمل
        for (const wfId of tool.allowed_workflows) {
            if (!this.workflowIndex.has(wfId)) {
                this.workflowIndex.set(wfId, new Set());
            }
            this.workflowIndex.get(wfId).add(tool.tool_id);
        }
    }

    /**
     * جلب الأداة بمعرفها
     * @param {string} id
     * @returns {ToolContract|null}
     */
    getTool(id) {
        return this.tools.get(id) || null;
    }

    /**
     * جلب الأداة النشطة حصراً (Fail-Closed)
     * @param {string} id
     * @returns {ToolContract|null}
     */
    getActiveTool(id) {
        const tool = this.getTool(id);
        if (tool && tool.status === ToolContract.STATUS.ACTIVE) {
            return tool;
        }
        return null;
    }

    /**
     * استعلام حتمي للأدوات النشطة المصرح بها للوكيل
     * @param {string} agentId
     * @returns {ToolContract[]}
     */
    getToolsForAgent(agentId) {
        const ids = this.agentIndex.get(agentId);
        if (!ids) return [];

        const activeTools = [];
        for (const id of ids) {
            const t = this.getActiveTool(id);
            if (t && !t.prohibited_agents.includes(agentId)) {
                activeTools.push(t);
            }
        }

        return activeTools.sort((a, b) => a.tool_id.localeCompare(b.tool_id));
    }

    /**
     * استعلام حتمي للأدوات النشطة المصرح بها للمهارة
     * @param {string} skillId
     * @returns {ToolContract[]}
     */
    getToolsForSkill(skillId) {
        const ids = this.skillIndex.get(skillId);
        if (!ids) return [];

        const activeTools = [];
        for (const id of ids) {
            const t = this.getActiveTool(id);
            if (t && !t.prohibited_skills.includes(skillId)) {
                activeTools.push(t);
            }
        }

        return activeTools.sort((a, b) => a.tool_id.localeCompare(b.tool_id));
    }

    /**
     * استعلام حتمي للأدوات النشطة المصرح بها لتدفق العمل
     * @param {string} workflowId
     * @returns {ToolContract[]}
     */
    getToolsForWorkflow(workflowId) {
        const ids = this.workflowIndex.get(workflowId);
        if (!ids) return [];

        const activeTools = [];
        for (const id of ids) {
            const t = this.getActiveTool(id);
            if (t && !t.prohibited_workflows.includes(workflowId)) {
                activeTools.push(t);
            }
        }

        return activeTools.sort((a, b) => a.tool_id.localeCompare(b.tool_id));
    }

    /**
     * تقييم تصريحي لحوكمة طلب تشغيل الأداة (Permission & Scope Evaluation)
     * يمنع تصعيد الصلاحيات ويفرض مبدأ الرفض الافتراضي
     * @param {string} toolId معرف الأداة
     * @param {Object} context سياق الطلب (agent_id, skill_id, workflow_id, scope, environment, permissionBoundary)
     * @returns {{allowed: boolean, reason?: string, requiresValidation: boolean}}
     */
    evaluateToolExecution(toolId, context = {}) {
        const tool = this.getActiveTool(toolId);
        if (!tool) {
            return {
                allowed: false,
                reason: `الأداة المطلوبة '${toolId}' غير موجودة أو معطلة في السجل الكنسي (Fail-Closed)`,
                requiresValidation: true
            };
        }

        // 1. التحقق من الوكيل
        if (context.agent_id) {
            if (tool.prohibited_agents.includes(context.agent_id)) {
                return {
                    allowed: false,
                    reason: `الوكيل '${context.agent_id}' محظور صراحة من استخدام الأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
            if (tool.allowed_agents.length > 0 && !tool.allowed_agents.includes(context.agent_id)) {
                return {
                    allowed: false,
                    reason: `الوكيل '${context.agent_id}' غير مدرج في قائمة الوكلاء المصرح لهم بالأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
        }

        // 2. التحقق من المهارة
        if (context.skill_id) {
            if (tool.prohibited_skills.includes(context.skill_id)) {
                return {
                    allowed: false,
                    reason: `المهارة '${context.skill_id}' محظورة صراحة من استدعاء الأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
            if (tool.allowed_skills.length > 0 && !tool.allowed_skills.includes(context.skill_id)) {
                return {
                    allowed: false,
                    reason: `المهارة '${context.skill_id}' غير مصرح لها باستدعاء الأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
        }

        // 3. التحقق من تدفق العمل
        if (context.workflow_id) {
            if (tool.prohibited_workflows.includes(context.workflow_id)) {
                return {
                    allowed: false,
                    reason: `تدفق العمل '${context.workflow_id}' محظور من استخدام الأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
            if (tool.allowed_workflows.length > 0 && !tool.allowed_workflows.includes(context.workflow_id)) {
                return {
                    allowed: false,
                    reason: `تدفق العمل '${context.workflow_id}' غير مصرح له باستخدام الأداة '${toolId}'`,
                    requiresValidation: true
                };
            }
        }

        // 4. التحقق من تطابق البيئة والنطاق (Scope Mismatch Defense)
        if (context.environment && tool.environment_scope !== context.environment) {
            return {
                allowed: false,
                reason: `عدم تطابق البيئة المصرحة (Scope Mismatch): الأداة مخصصة لبيئة '${tool.environment_scope}' والطلب ورد في بيئة '${context.environment}'`,
                requiresValidation: true
            };
        }

        // 5. فحص حاجز الصلاحيات الأمني المركزي (AgentPermissionBoundary Integration)
        if (context.permissionBoundary && typeof context.permissionBoundary.evaluatePermission === 'function') {
            for (const perm of tool.permission_requirements) {
                const evalResult = context.permissionBoundary.evaluatePermission(perm, context);
                if (!evalResult.allowed) {
                    return {
                        allowed: false,
                        reason: `رفض أمني بحاجز الصلاحيات: الصلاحية '${perm}' غير مصرحة: ${evalResult.reason}`,
                        requiresValidation: true
                    };
                }
            }
        }

        return {
            allowed: true,
            requiresValidation: true, // نتيجة الأداة لا ترقى للدليل دون تحقق
            evidence_behavior: tool.evidence_behavior
        };
    }

    /**
     * إجمالي عدد الأدوات المسجلة
     * @returns {number}
     */
    get size() {
        return this.tools.size;
    }

    /**
     * استرجاع كافة الأدوات النشطة
     * @returns {ToolContract[]}
     */
    getActiveTools() {
        const active = [];
        for (const tool of this.tools.values()) {
            if (tool.status === ToolContract.STATUS.ACTIVE) {
                active.push(tool);
            }
        }
        return active.sort((a, b) => a.tool_id.localeCompare(b.tool_id));
    }

    /**
     * التحقق الشامل من بنية بيانات سجل الأدوات والتحقق المتقاطع (Fail-Closed)
     * @param {Object} rawData بيانات السجل الخام
     * @param {Object} [registries] سجلات التحقق المتقاطع (agentRegistry, skillRegistry, workflowRegistry)
     * @returns {{isValid: boolean, errors: string[], parsedTools: ToolContract[]}}
     */
    static validateRegistryData(rawData, registries = {}) {
        const errors = [];
        const parsedTools = [];

        if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
            return {
                isValid: false,
                errors: ['بيانات سجل الأدوات يجب أن تكون كائناً غير فارغ يحتوي على مصفوفة tools'],
                parsedTools: []
            };
        }

        if (!rawData.tools || !Array.isArray(rawData.tools)) {
            return {
                isValid: false,
                errors: ['حقل tools إلزامي ويجب أن يكون مصفوفة من الأدوات'],
                parsedTools: []
            };
        }

        const seenIds = new Set();

        for (let i = 0; i < rawData.tools.length; i++) {
            const entry = rawData.tools[i];
            const id = entry ? entry.tool_id : null;

            if (!entry || typeof entry !== 'object') {
                errors.push(`عنصر الأداة رقم ${i} مشوه أو فارغ`);
                continue;
            }

            // منع تكرار المعرف
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف الأداة: '${id}'`);
                continue;
            }
            if (id) seenIds.add(id);

            // 1. التحقق الهيكلي من العقد
            const validation = ToolContract.validate(entry);
            if (!validation.isValid) {
                const subIssues = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد الأداة '${id || i}': ${subIssues}`);
                continue;
            }

            // 2. التحقق المتقاطع من الوكلاء المصرح لهم
            if (registries.agentRegistry && typeof registries.agentRegistry.hasAgent === 'function') {
                const agentsToCheck = [...(entry.allowed_agents || []), ...(entry.prohibited_agents || [])];
                for (const aId of agentsToCheck) {
                    if (!registries.agentRegistry.hasAgent(aId)) {
                        errors.push(`وكيل مجهول غير مسجل: '${aId}' في عقد الأداة '${id}'`);
                    }
                }
            }

            // 3. التحقق المتقاطع من المهارات المصرح لها
            if (registries.skillRegistry && typeof registries.skillRegistry.hasSkill === 'function') {
                const skillsToCheck = [...(entry.allowed_skills || []), ...(entry.prohibited_skills || [])];
                for (const sId of skillsToCheck) {
                    if (!registries.skillRegistry.hasSkill(sId)) {
                        errors.push(`مهارة مجهولة غير مسجلة: '${sId}' في عقد الأداة '${id}'`);
                    }
                }
            }

            // 4. التحقق المتقاطع من تدفقات العمل
            if (registries.workflowRegistry && typeof registries.workflowRegistry.hasWorkflow === 'function') {
                const wfsToCheck = [...(entry.allowed_workflows || []), ...(entry.prohibited_workflows || [])];
                for (const wId of wfsToCheck) {
                    if (!registries.workflowRegistry.hasWorkflow(wId)) {
                        errors.push(`تدفق عمل مجهول غير مسجل: '${wId}' في عقد الأداة '${id}'`);
                    }
                }
            }

            try {
                parsedTools.push(new ToolContract(entry));
            } catch (err) {
                errors.push(`فشل إنشاء كائن عقد الأداة '${id}': ${err.message}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedTools
        };
    }

    /**
     * تحميل السجل الكنسي من ملف JSON على القرص
     * @param {string} filePath مسار ملف السجل
     * @param {Object} [registries] سجلات التحقق المتقاطع
     * @returns {ToolRegistry}
     */
    static loadFromFile(filePath, registries = {}) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`ملف سجل الأدوات غير موجود في المسار: ${filePath}`);
        }

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
            throw new Error(`تعذر قراءة أو تحليل ملف JSON لسجل الأدوات: ${err.message}`);
        }

        const validation = ToolRegistry.validateRegistryData(rawContent, registries);
        if (!validation.isValid) {
            throw new Error(`فشل تحميل سجل الأدوات (Fail-Closed):\n- ${validation.errors.join('\n- ')}`);
        }

        const registry = new ToolRegistry();
        for (const tool of validation.parsedTools) {
            registry.registerTool(tool);
        }

        return registry;
    }
}

module.exports = ToolRegistry;
