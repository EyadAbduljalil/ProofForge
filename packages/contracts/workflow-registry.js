/**
 * @file workflow-registry.js
 * @description محرك سجل تدفقات العمل المركزي في ProofForge (ProofForge Canonical Workflow Registry)
 * يضمن التحميل الحتمي، الفحص المغلق (Fail-Closed)، والتحقق الصارم من تبعيات الوكلاء والمهارات والقواعد والتوافقية
 */

const fs = require('fs');
const path = require('path');
const WorkflowContract = require('./workflow-contract');

class WorkflowRegistry {
    constructor() {
        this.workflows = new Map(); // المفتاح: workflow_id -> WorkflowContract
        this.taskTypeIndex = new Map(); // المفتاح: task_type -> Set(workflow_id)
        this.version = '1.0.0';
        this.description = '';
    }

    /**
     * التحقق الحتمي الصارم من بيانات سجل تدفقات العمل وتطبيق الفشل المغلق
     * @param {Object} rawData بيانات السجل الخام
     * @param {Object} [registries] السجلات الكنسية للتحقق المتقاطع (agentRegistry, skillRegistry, mappingRegistry, rules, tools)
     * @returns {{isValid: boolean, errors: Array<string>, parsedWorkflows: Array<WorkflowContract>}}
     */
    static validateRegistryData(rawData, registries = {}) {
        const errors = [];

        if (!rawData || typeof rawData !== 'object') {
            return {
                isValid: false,
                errors: ['يجب أن تكون بيانات سجل تدفقات العمل كائناً برمجياً صالحاً'],
                parsedWorkflows: []
            };
        }

        if (!rawData.version || typeof rawData.version !== 'string') {
            errors.push('حقل الإصدار (version) إلزامي في سجل تدفقات العمل');
        }

        if (!Array.isArray(rawData.workflows)) {
            errors.push('حقل تدفقات العمل (workflows) يجب أن يكون مصفوفة صالحة');
            return { isValid: false, errors, parsedWorkflows: [] };
        }

        const seenIds = new Set();
        const parsedWorkflows = [];

        for (let i = 0; i < rawData.workflows.length; i++) {
            const entry = rawData.workflows[i];
            if (!entry || typeof entry !== 'object') {
                errors.push(`العنصر رقم [${i}] في سجل تدفقات العمل لا يحتوي على تعريف تدفق صالح.`);
                continue;
            }

            const id = entry.workflow_id;
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف تدفق العمل: '${id}'`);
                continue;
            }
            seenIds.add(id);

            // 1. التحقق الهيكلي للعقد
            const validation = WorkflowContract.validate(entry);
            if (!validation.isValid) {
                const subIssues = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد تدفق العمل '${id || i}': ${subIssues}`);
                continue;
            }

            // 2. التحقق المتقاطع من الوكلاء (Agent Validation)
            if (registries.agentRegistry && typeof registries.agentRegistry.hasAgent === 'function') {
                const agentsToCheck = [
                    ...(entry.required_agents || []),
                    ...(entry.optional_agents || [])
                ];
                for (const agentId of agentsToCheck) {
                    if (!registries.agentRegistry.hasAgent(agentId)) {
                        errors.push(`وكيل مجهول غير مسجل: '${agentId}' في تدفق العمل '${id}'`);
                    } else if (entry.status === WorkflowContract.STATUS.ACTIVE) {
                        const agentObj = registries.agentRegistry.getActiveAgent(agentId);
                        if (!agentObj) {
                            errors.push(`وكيل معطل أو غير نشط: '${agentId}' في تدفق العمل النشط '${id}'`);
                        }
                    }
                }
            }

            // 3. التحقق المتقاطع من المهارات (Skill Validation)
            if (registries.skillRegistry && typeof registries.skillRegistry.hasSkill === 'function') {
                const skillsToCheck = [
                    ...(entry.required_skills || []),
                    ...(entry.optional_skills || [])
                ];
                for (const skillId of skillsToCheck) {
                    if (!registries.skillRegistry.hasSkill(skillId)) {
                        errors.push(`مهارة مجهولة غير مسجلة: '${skillId}' في تدفق العمل '${id}'`);
                    } else if (entry.status === WorkflowContract.STATUS.ACTIVE) {
                        const skillObj = registries.skillRegistry.getActiveSkill(skillId);
                        if (!skillObj) {
                            errors.push(`مهارة معطلة أو في طور المسودة: '${skillId}' في تدفق العمل النشط '${id}'`);
                        }
                    }
                }
            }

            // 4. التحقق من التوافقية بين الوكلاء والمهارات عبر سجل المرحلة الرابعة (Agent ↔ Skill Compatibility)
            if (registries.mappingRegistry && typeof registries.mappingRegistry.getMapping === 'function') {
                if (entry.status === WorkflowContract.STATUS.ACTIVE) {
                    const reqAgents = entry.required_agents || [];
                    const reqSkills = entry.required_skills || [];

                    // التحقق من أن المهارات المطلوبة مسموحة للوكلاء المطلوبين
                    for (const reqSkill of reqSkills) {
                        const hasCompatibleAgent = reqAgents.some(reqAgent => {
                            const mapping = registries.mappingRegistry.getMapping(reqAgent, reqSkill);
                            return mapping && mapping.status === 'ACTIVE' && mapping.allowed === true;
                        });

                        // إذا كانت المهارة مطلوبة ولا يوجد أي وكيل مطلوب مصرح له بها
                        if (!hasCompatibleAgent && reqAgents.length > 0) {
                            errors.push(`عدم توافق حتمي: المهارة المطلوبة '${reqSkill}' في تدفق العمل '${id}' غير مصرح بها لأي من الوكلاء المطلوبين في سجل روابط المرحلة الرابعة`);
                        }
                    }
                }
            }

            // 5. التحقق من القواعد (Rules Validation)
            if (registries.validRules && Array.isArray(registries.validRules)) {
                for (const ruleId of (entry.applicable_rules || [])) {
                    if (!registries.validRules.includes(ruleId)) {
                        errors.push(`قاعدة مجهولة غير مسجلة: '${ruleId}' في تدفق العمل '${id}'`);
                    }
                }
            }

            // 6. التحقق من المدققات (Validators Validation)
            if (registries.validValidators && Array.isArray(registries.validValidators)) {
                for (const valId of (entry.required_validators || [])) {
                    if (!registries.validValidators.includes(valId)) {
                        errors.push(`مدقق مجهول غير مسجل: '${valId}' في تدفق العمل '${id}'`);
                    }
                }
            }

            try {
                parsedWorkflows.push(new WorkflowContract(entry));
            } catch (err) {
                errors.push(`فشل إنشاء نموذج عقد تدفق العمل '${id}': ${err.message}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedWorkflows
        };
    }

    /**
     * تحميل السجل الكنسي من ملف JSON على القرص
     * @param {string} filePath مسار ملف JSON
     * @param {Object} [registries] سجلات التحقق المتقاطع
     * @returns {WorkflowRegistry}
     */
    static loadFromFile(filePath, registries = {}) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`ملف سجل تدفقات العمل غير موجود في المسار: ${filePath}`);
        }

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
            throw new Error(`تعذر قراءة أو تحليل ملف JSON لسجل تدفقات العمل: ${err.message}`);
        }

        const validation = WorkflowRegistry.validateRegistryData(rawContent, registries);
        if (!validation.isValid) {
            throw new Error(`فشل تحميل سجل تدفقات العمل (Fail-Closed):\n- ${validation.errors.join('\n- ')}`);
        }

        const registry = new WorkflowRegistry();
        registry.version = rawContent.version;
        registry.description = rawContent.description || '';

        for (const wf of validation.parsedWorkflows) {
            registry.registerWorkflow(wf);
        }

        return registry;
    }

    /**
     * تسجيل عقد تدفق عمل في السجل وفهرسته
     * @param {WorkflowContract} workflow
     */
    registerWorkflow(workflow) {
        if (!(workflow instanceof WorkflowContract)) {
            throw new Error('يجب أن يكون تدفق العمل نسخة من كائن WorkflowContract');
        }

        this.workflows.set(workflow.workflow_id, workflow);

        // فهرسة حسب تصنيف المهام
        for (const taskType of workflow.task_types) {
            if (!this.taskTypeIndex.has(taskType)) {
                this.taskTypeIndex.set(taskType, new Set());
            }
            this.taskTypeIndex.get(taskType).add(workflow.workflow_id);
        }
    }

    /**
     * استرجاع تدفق عمل بالمعرف الكنسي
     * @param {string} workflowId
     * @returns {WorkflowContract|null}
     */
    getWorkflow(workflowId) {
        return this.workflows.get(workflowId) || null;
    }

    /**
     * استرجاع تدفق العمل النشط فقط (تطبيق الفشل المغلق على المعطل والمتقادم)
     * @param {string} workflowId
     * @returns {WorkflowContract|null}
     */
    getActiveWorkflow(workflowId) {
        const wf = this.workflows.get(workflowId);
        if (!wf || wf.status !== WorkflowContract.STATUS.ACTIVE) {
            return null;
        }
        return wf;
    }

    /**
     * استرجاع كافة تدفقات العمل النشطة فقط
     * @returns {Array<WorkflowContract>}
     */
    getActiveWorkflows() {
        return Array.from(this.workflows.values()).filter(wf => wf.status === WorkflowContract.STATUS.ACTIVE);
    }

    /**
     * استرجاع كافة تدفقات العمل المرتبطة بنوع مهمة معين
     * @param {string} taskType نوع المهمة
     * @param {boolean} [onlyActive=true] حصر الاسترجاع بالتدفقات النشطة فقط
     * @returns {Array<WorkflowContract>}
     */
    getWorkflowsForTaskType(taskType, onlyActive = true) {
        const ids = this.taskTypeIndex.get(taskType);
        if (!ids) return [];

        const results = [];
        for (const id of ids) {
            const wf = this.workflows.get(id);
            if (wf) {
                if (!onlyActive || wf.status === WorkflowContract.STATUS.ACTIVE) {
                    results.push(wf);
                }
            }
        }
        return results;
    }

    /**
     * فحص وجود تدفق عمل في السجل
     * @param {string} workflowId
     * @returns {boolean}
     */
    hasWorkflow(workflowId) {
        return this.workflows.has(workflowId);
    }

    /**
     * إجمالي عدد تدفقات العمل المسجلة
     */
    get size() {
        return this.workflows.size;
    }
}

module.exports = WorkflowRegistry;
