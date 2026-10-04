/**
 * @file agent-registry.js
 * @description محرك سجل الوكلاء المركزي في ProofForge (ProofForge Canonical Agent Registry)
 * يضمن التحميل الحتمي والفحص المغلق (Fail-Closed) لسجل الوكلاء المعتمد
 */

const fs = require('fs');
const path = require('path');
const AgentContract = require('./agent-contract');
const PathLoaderGuard = require('./path-loader-guard');

class AgentRegistry {
    constructor() {
        this.agents = new Map();
        this.version = '1.0.0';
        this.description = '';
    }

    /**
     * التحقق الحتمي الصارم من بيانات السجل بالكامل
     * @param {Object} rawData بيانات السجل الخام
     * @returns {{isValid: boolean, errors: Array, parsedAgents: Array}}
     */
    static validateRegistryData(rawData) {
        const errors = [];
        if (!rawData || typeof rawData !== 'object') {
            return {
                isValid: false,
                errors: ['يجب أن تكون بيانات السجل كائناً برمجياً صالحاً'],
                parsedAgents: []
            };
        }

        if (!rawData.version || typeof rawData.version !== 'string') {
            errors.push('حقل الإصدار (version) إلزامي في سجل الوكلاء');
        }

        if (!Array.isArray(rawData.agents)) {
            errors.push('حقل الوكلاء (agents) يجب أن يكون مصفوفة صالحة');
            return { isValid: false, errors, parsedAgents: [] };
        }

        const seenIds = new Set();
        const parsedAgents = [];

        for (let i = 0; i < rawData.agents.length; i++) {
            const entry = rawData.agents[i];
            const agentDef = entry.contract || entry;

            if (!agentDef || typeof agentDef !== 'object') {
                errors.push(`العنصر رقم [${i}] في السجل لا يحتوي على تعريف وكيل صالح.`);
                continue;
            }

            const id = agentDef.id;
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف الوكيل: '${id}'`);
                continue;
            }
            seenIds.add(id);

            const contractValidation = AgentContract.validate(agentDef);
            if (!contractValidation.isValid) {
                const subIssues = contractValidation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد الوكيل '${id || i}': ${subIssues}`);
                continue;
            }

            parsedAgents.push(new AgentContract(agentDef));
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedAgents: errors.length === 0 ? parsedAgents : []
        };
    }

    /**
     * تحميل السجل من مسار على القرص مع التحقق المغلق الصارم (Fail-Closed)
     * @param {string} filePath مسار ملف registry/agents.json
     * @returns {AgentRegistry}
     */
    static loadFromFile(filePath) {
        const safePath = PathLoaderGuard.validateSafePath(filePath);

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(safePath, 'utf8'));
        } catch (err) {
            throw new Error(`فشل تحليل ملف سجل الوكلاء (تنسيق JSON تالف): ${err.message}`);
        }

        const validation = AgentRegistry.validateRegistryData(rawContent);
        if (!validation.isValid) {
            throw new Error(`فشل التحقق من نزاهة سجل الوكلاء:\n - ${validation.errors.join('\n - ')}`);
        }

        const registry = new AgentRegistry();
        registry.version = rawContent.version;
        registry.description = rawContent.description || '';

        for (const agent of validation.parsedAgents) {
            registry.agents.set(agent.id, agent);
        }

        return registry;
    }

    /**
     * جلب وكيل بمعرفه (سواء كان نشطاً أو غير نشط)
     * @param {string} id معرف الوكيل
     * @returns {AgentContract|null}
     */
    getAgent(id) {
        return this.agents.get(id) || null;
    }

    /**
     * جلب وكيل نشط حصراً (Active Authoritative Agent)
     * @param {string} id معرف الوكيل
     * @returns {AgentContract|null}
     */
    getActiveAgent(id) {
        const agent = this.agents.get(id);
        if (agent && agent.status === AgentContract.STATUS.ACTIVE) {
            return agent;
        }
        return null;
    }

    /**
     * التحقق من وجود الوكيل في السجل
     * @param {string} id معرف الوكيل
     * @returns {boolean}
     */
    hasAgent(id) {
        return this.agents.has(id);
    }

    /**
     * سرد كافة الوكلاء النشطين والمعتمدين
     * @returns {Array<AgentContract>}
     */
    listActiveAgents() {
        return Array.from(this.agents.values()).filter(a => a.status === AgentContract.STATUS.ACTIVE);
    }

    /**
     * سرد كافة الوكلاء المسجلين
     * @returns {Array<AgentContract>}
     */
    listAllAgents() {
        return Array.from(this.agents.values());
    }

    /**
     * عدد الوكلاء المسجلين
     */
    get size() {
        return this.agents.size;
    }
}

module.exports = AgentRegistry;
