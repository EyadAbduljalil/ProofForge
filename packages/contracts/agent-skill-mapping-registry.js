/**
 * @file agent-skill-mapping-registry.js
 * @description محرك سجل الربط المركزي بين الوكلاء والمهارات في ProofForge (Agent ↔ Skill Mapping Registry)
 * يضمن التحميل الحتمي، الفحص المغلق (Fail-Closed)، والتحقق الثلاثي الصارم (Tri-Directional Compatibility)
 */

const fs = require('fs');
const path = require('path');
const AgentSkillMapping = require('./agent-skill-mapping');
const PathLoaderGuard = require('./path-loader-guard');

class AgentSkillMappingRegistry {
    constructor() {
        this.mappings = new Map(); // المفتاح: mapping_id
        this.agentMappings = new Map(); // المفتاح: agent_id -> Map(skill_id -> mapping)
        this.skillMappings = new Map(); // المفتاح: skill_id -> Map(agent_id -> mapping)
        this.version = '1.0.0';
        this.description = '';
    }

    /**
     * التحقق الحتمي الصارم من بيانات سجل الروابط وتطبيق مبدأ الفشل المغلق
     * @param {Object} rawData بيانات السجل الخام
     * @param {Object} [options] خيارات إضافية للتحقق المتقاطع مع سجلات الوكلاء والمهارات
     * @returns {{isValid: boolean, errors: Array<string>, parsedMappings: Array<AgentSkillMapping>}}
     */
    static validateRegistryData(rawData, options = {}) {
        const errors = [];

        if (!rawData || typeof rawData !== 'object') {
            return {
                isValid: false,
                errors: ['يجب أن تكون بيانات سجل الروابط كائناً برمجياً صالحاً'],
                parsedMappings: []
            };
        }

        if (!rawData.version || typeof rawData.version !== 'string') {
            errors.push('حقل الإصدار (version) إلزامي في سجل الروابط');
        }

        if (!Array.isArray(rawData.mappings)) {
            errors.push('حقل الروابط (mappings) يجب أن يكون مصفوفة صالحة');
            return { isValid: false, errors, parsedMappings: [] };
        }

        const seenIds = new Set();
        const seenPairs = new Set();
        const parsedMappings = [];

        for (let i = 0; i < rawData.mappings.length; i++) {
            const entry = rawData.mappings[i];
            if (!entry || typeof entry !== 'object') {
                errors.push(`العنصر رقم [${i}] في سجل الروابط لا يحتوي على تعريف رابط صالح.`);
                continue;
            }

            const id = entry.id;
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف الرابط: '${id}'`);
                continue;
            }
            seenIds.add(id);

            // منع تكرار الزوج (agent_id, skill_id)
            const pairKey = `${entry.agent_id}::${entry.skill_id}`;
            if (seenPairs.has(pairKey)) {
                errors.push(`تكرار غير مسموح به لزوج الوكيل والمهارة: '${entry.agent_id}' مع '${entry.skill_id}'`);
                continue;
            }
            seenPairs.add(pairKey);

            // التحقق الهيكلي من العقد
            const validation = AgentSkillMapping.validate(entry);
            if (!validation.isValid) {
                const subIssues = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد الرابط '${id || i}': ${subIssues}`);
                continue;
            }

            // فحص اختياري للتحقق المتقاطع مع سجل الوكلاء
            if (options.agentRegistry && typeof options.agentRegistry.hasAgent === 'function') {
                if (!options.agentRegistry.hasAgent(entry.agent_id)) {
                    errors.push(`الوكيل '${entry.agent_id}' المحدد في الرابط '${id}' غير مسجل في سجل الوكلاء الكنسي`);
                    continue;
                }
            }

            // فحص اختياري للتحقق المتقاطع مع سجل المهارات
            if (options.skillRegistry && typeof options.skillRegistry.hasSkill === 'function') {
                if (!options.skillRegistry.hasSkill(entry.skill_id)) {
                    errors.push(`المهارة '${entry.skill_id}' المحددة في الرابط '${id}' غير مسجلة في سجل المهارات الكنسي`);
                    continue;
                }
            }

            try {
                parsedMappings.push(new AgentSkillMapping(entry));
            } catch (err) {
                errors.push(`فشل إنشاء نموذج عقد الرابط '${id}': ${err.message}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedMappings
        };
    }

    /**
     * تحميل السجل الكنسي من ملف JSON على القرص مع التحقق المغلق الحتمي
     * @param {string} filePath مسار ملف JSON
     * @param {Object} [options] خيارات التحقق المتقاطع
     * @returns {AgentSkillMappingRegistry}
     */
    static loadFromFile(filePath, options = {}) {
        const safePath = PathLoaderGuard.validateSafePath(filePath);

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(safePath, 'utf8'));
        } catch (err) {
            throw new Error(`تعذر قراءة أو تحليل ملف JSON لسجل الروابط: ${err.message}`);
        }

        const validation = AgentSkillMappingRegistry.validateRegistryData(rawContent, options);
        if (!validation.isValid) {
            throw new Error(`فشل تحميل سجل روابط الوكلاء والمهارات (Fail-Closed):\n- ${validation.errors.join('\n- ')}`);
        }

        const registry = new AgentSkillMappingRegistry();
        registry.version = rawContent.version;
        registry.description = rawContent.description || '';

        for (const mapping of validation.parsedMappings) {
            registry.registerMapping(mapping);
        }

        return registry;
    }

    /**
     * تسجيل عقد ربط في السجل
     * @param {AgentSkillMapping} mapping
     */
    registerMapping(mapping) {
        if (!(mapping instanceof AgentSkillMapping)) {
            throw new Error('يجب أن يكون الرابط المضاف نسخة من كائن AgentSkillMapping');
        }

        this.mappings.set(mapping.id, mapping);

        // فهرسة بالوكيل
        if (!this.agentMappings.has(mapping.agent_id)) {
            this.agentMappings.set(mapping.agent_id, new Map());
        }
        this.agentMappings.get(mapping.agent_id).set(mapping.skill_id, mapping);

        // فهرسة بالمهارة
        if (!this.skillMappings.has(mapping.skill_id)) {
            this.skillMappings.set(mapping.skill_id, new Map());
        }
        this.skillMappings.get(mapping.skill_id).set(mapping.agent_id, mapping);
    }

    /**
     * استرجاع عقد رابط بالمعرف
     * @param {string} mappingId
     * @returns {AgentSkillMapping|null}
     */
    getMappingById(mappingId) {
        return this.mappings.get(mappingId) || null;
    }

    /**
     * استرجاع عقد الرابط المباشر بين وكيل محدد ومهارة محددة
     * @param {string} agentId معرف الوكيل
     * @param {string} skillId معرف المهارة
     * @returns {AgentSkillMapping|null}
     */
    getMapping(agentId, skillId) {
        const agentMap = this.agentMappings.get(agentId);
        if (!agentMap) return null;
        return agentMap.get(skillId) || null;
    }

    /**
     * استرجاع كافة روابط وكيل معين
     * @param {string} agentId
     * @returns {Array<AgentSkillMapping>}
     */
    getMappingsForAgent(agentId) {
        const agentMap = this.agentMappings.get(agentId);
        if (!agentMap) return [];
        return Array.from(agentMap.values());
    }

    /**
     * استرجاع كافة روابط مهارة معينة
     * @param {string} skillId
     * @returns {Array<AgentSkillMapping>}
     */
    getMappingsForSkill(skillId) {
        const skillMap = this.skillMappings.get(skillId);
        if (!skillMap) return [];
        return Array.from(skillMap.values());
    }

    /**
     * استرجاع كافة الروابط النشطة فقط
     * @returns {Array<AgentSkillMapping>}
     */
    getActiveMappings() {
        return Array.from(this.mappings.values()).filter(m => m.status === AgentSkillMapping.STATUS.ACTIVE && m.allowed);
    }

    /**
     * التحقق الثلاثي الكنسي الصارم من التوافق:
     * يجمع بين عقد الوكيل (AgentContract) وعقد المهارة (SkillContract) وعقد الرابط (AgentSkillMapping)
     * @param {Object} agent كائن الوكيل
     * @param {Object} skill كائن المهارة
     * @returns {{compatible: boolean, allowed: boolean, mappingStatus: string|null, reason: string, details: Object}}
     */
    checkTriDirectionalCompatibility(agent, skill) {
        // فحص الفشل المغلق للمدخلات المشوهة
        if (!agent || typeof agent !== 'object' || !agent.id) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: null,
                reason: 'INVALID_AGENT_OBJECT',
                details: { issue: 'كائن الوكيل غير صالح أو مشوه' }
            };
        }

        if (!skill || typeof skill !== 'object' || !skill.id) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: null,
                reason: 'INVALID_SKILL_OBJECT',
                details: { issue: 'كائن المهارة غير صالح أو مشوه' }
            };
        }

        // 1. استرجاع عقد الربط المسجل
        const mapping = this.getMapping(agent.id, skill.id);
        if (!mapping) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: null,
                reason: 'NO_MAPPING_FOUND',
                details: { issue: `لا يوجد عقد ربط مسجل بين الوكيل '${agent.id}' والمهارة '${skill.id}' في السجل الكنسي` }
            };
        }

        // 2. التحقق من حالة الرابط وسماحه
        if (mapping.status === AgentSkillMapping.STATUS.DISABLED) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'MAPPING_DISABLED',
                details: { issue: `عقد الربط بين '${agent.id}' و '${skill.id}' معطل (DISABLED)` }
            };
        }

        if (mapping.status === AgentSkillMapping.STATUS.DEPRECATED) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'MAPPING_DEPRECATED',
                details: { issue: `عقد الربط متقادم (DEPRECATED) ولا يجوز تفعيله صامتاً كـ ACTIVE` }
            };
        }

        if (mapping.status === AgentSkillMapping.STATUS.DRAFT) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'MAPPING_DRAFT',
                details: { issue: `عقد الربط في حالة مسودة (DRAFT) وغير مفعل تشغيلياً` }
            };
        }

        if (!mapping.allowed) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'MAPPING_DISALLOWED',
                details: { issue: `حقل allowed في عقد الربط ينص على الرفض (false)` }
            };
        }

        // 3. التحقق من حالة الوكيل والمهارة
        if (agent.status !== 'ACTIVE') {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'AGENT_NOT_ACTIVE',
                details: { issue: `الوكيل '${agent.id}' غير نشط (Status: ${agent.status})` }
            };
        }

        if (skill.status !== 'ACTIVE') {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'SKILL_NOT_ACTIVE',
                details: { issue: `المهارة '${skill.id}' غير نشطة (Status: ${skill.status}). المهارة المعطلة لا تصبح مسموحة بمجرد وجود رابط` }
            };
        }

        // 4. التحقق من الحظر الصريح المتبادل
        if (Array.isArray(skill.prohibited_agents) && skill.prohibited_agents.includes(agent.id)) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'AGENT_EXPLICITLY_PROHIBITED_BY_SKILL',
                details: { issue: `الوكيل '${agent.id}' محظور صراحة في عقد المهارة` }
            };
        }

        if (Array.isArray(agent.prohibited_skills) && agent.prohibited_skills.includes(skill.id)) {
            return {
                compatible: false,
                allowed: false,
                mappingStatus: mapping.status,
                reason: 'SKILL_EXPLICITLY_PROHIBITED_BY_AGENT',
                details: { issue: `المهارة '${skill.id}' محظورة صراحة في عقد الوكيل` }
            };
        }

        // اجتياز التوافق الثلاثي بنجاح
        return {
            compatible: true,
            allowed: true,
            mappingStatus: mapping.status,
            reason: 'COMPATIBLE_AND_ALLOWED',
            details: {
                mapping_id: mapping.id,
                agent_id: agent.id,
                skill_id: skill.id,
                restrictions: mapping.restrictions,
                required_validators: mapping.required_validators,
                required_evidence: mapping.required_evidence
            }
        };
    }

    /**
     * إجمالي عدد الروابط المسجلة
     */
    get size() {
        return this.mappings.size;
    }

    /**
     * فحص وجود رابط بمعرف الربط
     * @param {string} mappingId
     * @returns {boolean}
     */
    hasMapping(mappingId) {
        return this.mappings.has(mappingId);
    }
}

module.exports = AgentSkillMappingRegistry;
