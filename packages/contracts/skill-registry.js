/**
 * @file skill-registry.js
 * @description محرك سجل المهارات المركزي في ProofForge (ProofForge Canonical Skill Registry)
 * يضمن التحميل الحتمي، الفحص المغلق (Fail-Closed)، والتحقق من التوافق المتبادل بين الوكلاء والمهارات
 */

const fs = require('fs');
const path = require('path');
const SkillContract = require('./skill-contract');
const PathLoaderGuard = require('./path-loader-guard');

class SkillRegistry {
    constructor() {
        this.skills = new Map();
        this.version = '1.0.0';
        this.description = '';
    }

    /**
     * التحقق الحتمي الصارم من بيانات سجل المهارات بالكامل
     * @param {Object} rawData بيانات السجل الخام
     * @returns {{isValid: boolean, errors: Array, parsedSkills: Array}}
     */
    static validateRegistryData(rawData) {
        const errors = [];
        if (!rawData || typeof rawData !== 'object') {
            return {
                isValid: false,
                errors: ['يجب أن تكون بيانات سجل المهارات كائناً برمجياً صالحاً'],
                parsedSkills: []
            };
        }

        if (!rawData.version || typeof rawData.version !== 'string') {
            errors.push('حقل الإصدار (version) إلزامي في سجل المهارات');
        }

        if (!Array.isArray(rawData.skills)) {
            errors.push('حقل المهارات (skills) يجب أن يكون مصفوفة صالحة');
            return { isValid: false, errors, parsedSkills: [] };
        }

        const seenIds = new Set();
        const parsedSkills = [];

        for (let i = 0; i < rawData.skills.length; i++) {
            const entry = rawData.skills[i];
            if (!entry || typeof entry !== 'object') {
                errors.push(`العنصر رقم [${i}] في سجل المهارات لا يحتوي على تعريف مهارة صالح.`);
                continue;
            }

            let normalizedDef = entry.contract;
            if (!normalizedDef) {
                if (entry.id && entry.name) {
                    normalizedDef = {
                        id: entry.id,
                        name: entry.name,
                        version: '1.0.0',
                        description: `مسودة مهارة قيد التطوير: ${entry.name}`,
                        category: entry.scope || 'general',
                        purpose: `Draft skill definition for ${entry.name} pending canonical contract specification`,
                        status: SkillContract.STATUS.DRAFT,
                        inputs: [],
                        outputs: [],
                        preconditions: ['المهارة في طور المسودة DRAFT'],
                        postconditions: [],
                        responsibilities: [`تطوير وتوثيق مهارة ${entry.name}`],
                        allowed_agents: [],
                        prohibited_agents: [],
                        applicable_rules: entry.priority ? [entry.priority] : [],
                        security_constraints: ['مهارة مسودة غير مصرح باستخدامها في الإنتاج'],
                        permission_requirements: ['READ_REPOSITORY'],
                        authority_constraints: ['لا سلطة تشغيلية للمسودات غير النشطة'],
                        validators: [],
                        validation_requirements: [],
                        verification_requirements: [],
                        required_evidence: [],
                        evidence_schema: { draft: true },
                        failure_conditions: ['محاولة تشغيل مهارة في حالة مسودة'],
                        abstention_conditions: ['المهارة غير نشطة (DRAFT)'],
                        reporting_requirements: ['DRAFT_NOTICE'],
                        audit_requirements: ['LOG_DRAFT_ACCESS']
                    };
                } else {
                    normalizedDef = entry;
                }
            }

            const id = normalizedDef.id;
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف المهارة: '${id}'`);
                continue;
            }
            seenIds.add(id);

            const contractValidation = SkillContract.validate(normalizedDef);
            if (!contractValidation.isValid) {
                const subIssues = contractValidation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد المهارة '${id || i}': ${subIssues}`);
                continue;
            }

            parsedSkills.push(new SkillContract(normalizedDef));
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedSkills: errors.length === 0 ? parsedSkills : []
        };
    }

    /**
     * تحميل السجل من مسار على القرص مع التحقق المغلق الصارم (Fail-Closed)
     * @param {string} filePath مسار ملف registry/skills.json
     * @returns {SkillRegistry}
     */
    static loadFromFile(filePath) {
        const safePath = PathLoaderGuard.validateSafePath(filePath);

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(safePath, 'utf8'));
        } catch (err) {
            throw new Error(`فشل تحليل ملف سجل المهارات (تنسيق JSON تالف): ${err.message}`);
        }

        const validation = SkillRegistry.validateRegistryData(rawContent);
        if (!validation.isValid) {
            throw new Error(`فشل التحقق من نزاهة سجل المهارات:\n - ${validation.errors.join('\n - ')}`);
        }

        const registry = new SkillRegistry();
        registry.version = rawContent.version;
        registry.description = rawContent.description || '';

        for (const skill of validation.parsedSkills) {
            registry.skills.set(skill.id, skill);
        }

        return registry;
    }

    /**
     * جلب مهارة بمعرفها
     * @param {string} id معرف المهارة
     * @returns {SkillContract|null}
     */
    getSkill(id) {
        return this.skills.get(id) || null;
    }

    /**
     * جلب مهارة نشطة حصراً (Active Authoritative Skill)
     * @param {string} id معرف المهارة
     * @returns {SkillContract|null}
     */
    getActiveSkill(id) {
        const skill = this.skills.get(id);
        if (skill && skill.status === SkillContract.STATUS.ACTIVE) {
            return skill;
        }
        return null;
    }

    /**
     * التحقق من وجود المهارة في السجل
     * @param {string} id معرف المهارة
     * @returns {boolean}
     */
    hasSkill(id) {
        return this.skills.has(id);
    }

    /**
     * سرد كافة المهارات النشطة والمعتمدة
     * @returns {Array<SkillContract>}
     */
    listActiveSkills() {
        return Array.from(this.skills.values()).filter(s => s.status === SkillContract.STATUS.ACTIVE);
    }

    /**
     * سرد كافة المهارات المسجلة
     * @returns {Array<SkillContract>}
     */
    listAllSkills() {
        return Array.from(this.skills.values());
    }

    /**
     * التحقق المتبادل من التوافقية والأهلية بين الوكيل والمهارة (Agent ↔ Skill Compatibility Check)
     * @param {Object} agent كائن عقد الوكيل (AgentContract)
     * @param {Object} skill كائن عقد المهارة (SkillContract)
     * @returns {{compatible: boolean, reason: string}}
     */
    static checkCompatibility(agent, skill) {
        if (!agent || typeof agent !== 'object' || !agent.id || !agent.status) {
            return { compatible: false, reason: 'كائن الوكيل غير صالح أو مشوه (Malformed Agent)' };
        }

        if (!skill || typeof skill !== 'object' || !skill.id || !skill.status || typeof skill.isAgentCompatible !== 'function') {
            return { compatible: false, reason: 'كائن المهارة غير صالح أو مشوه (Malformed Skill)' };
        }

        if (agent.status !== 'ACTIVE') {
            return { compatible: false, reason: `الوكيل '${agent.id}' غير نشط (${agent.status})` };
        }

        if (skill.status !== SkillContract.STATUS.ACTIVE) {
            return { compatible: false, reason: `المهارة '${skill.id}' غير نشطة (${skill.status})` };
        }

        // 1. فحص جانب المهارة أولاً: هل تسمح المهارة بهذا الوكيل؟
        if (!skill.isAgentCompatible(agent.id)) {
            return { compatible: false, reason: `الوكيل '${agent.id}' غير مصرح له في قائمة وكلاء المهارة '${skill.id}'` };
        }

        // 2. فحص جانب الوكيل: هل المهارة محظورة صراحة في عقد الوكيل؟
        const skillAliases = [skill.id, skill.name.toLowerCase(), skill.category.toLowerCase()];
        
        const isProhibitedByAgent = agent.prohibited_skills && agent.prohibited_skills.some(ps => skillAliases.includes(ps));
        if (isProhibitedByAgent) {
            return { compatible: false, reason: `المهارة '${skill.id}' محظورة صراحة في عقد الوكيل '${agent.id}'` };
        }

        // 3. فحص جانب الوكيل: هل المهارة مسموحة صراحة في عقد الوكيل؟
        const isAllowedByAgent = agent.allowed_skills && (
            agent.allowed_skills.includes('*') ||
            agent.allowed_skills.some(as => skillAliases.includes(as))
        );
        if (!isAllowedByAgent) {
            return { compatible: false, reason: `المهارة '${skill.id}' غير مصرح بها في قائمة مهارات الوكيل '${agent.id}'` };
        }

        return { compatible: true, reason: 'التوافقية والأهلية متبادلة ومجازة 100%' };
    }

    /**
     * عدد المهارات المسجلة
     */
    get size() {
        return this.skills.size;
    }
}

module.exports = SkillRegistry;
