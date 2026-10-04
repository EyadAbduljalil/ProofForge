/**
 * @file model-policy-registry.js
 * @description محرك سجل سياسات النماذج والذكاء الاصطناعي الكنسي في نظام ProofForge (Phase 6)
 * يوفر إدارة تصريحية حتمية وفحصاً مغلقاً (Fail-Closed) مع التحقق المتقاطع من القواعد والمدققات.
 */

'use strict';

const fs = require('fs');
const ModelPolicyContract = require('./model-policy-contract');
const PathLoaderGuard = require('./path-loader-guard');

class ModelPolicyRegistry {
    constructor() {
        /**
         * خريطة السياسات المفهرسة بالمعرف
         * @type {Map<string, ModelPolicyContract>}
         */
        this.policies = new Map();

        /**
         * خريطة الفهرسة بأنواع المهام
         * @type {Map<string, Set<string>>}
         */
        this.taskTypeIndex = new Map();

        /**
         * خريطة الفهرسة بمستوى الخطورة
         * @type {Map<string, Set<string>>}
         */
        this.riskIndex = new Map();
    }

    /**
     * تسجيل سياسة نموذج مجمدة داخل السجل
     * @param {ModelPolicyContract} policy
     */
    registerPolicy(policy) {
        if (!(policy instanceof ModelPolicyContract)) {
            throw new Error('الكائن المراد تسجيله يجب أن يكون نسخة صالحة ومجمدة من ModelPolicyContract');
        }

        if (this.policies.has(policy.policy_id)) {
            throw new Error(`معرف السياسة مكرر بالفعل في السجل: '${policy.policy_id}'`);
        }

        this.policies.set(policy.policy_id, policy);

        // الفهرسة بأنواع المهام
        for (const taskType of policy.task_types) {
            if (!this.taskTypeIndex.has(taskType)) {
                this.taskTypeIndex.set(taskType, new Set());
            }
            this.taskTypeIndex.get(taskType).add(policy.policy_id);
        }

        // الفهرسة بمستوى الخطورة
        if (!this.riskIndex.has(policy.risk_level)) {
            this.riskIndex.set(policy.risk_level, new Set());
        }
        this.riskIndex.get(policy.risk_level).add(policy.policy_id);
    }

    /**
     * جلب السياسة بالمعرف
     * @param {string} id
     * @returns {ModelPolicyContract|null}
     */
    getPolicy(id) {
        return this.policies.get(id) || null;
    }

    /**
     * جلب السياسة النشطة حصراً (Fail-Closed)
     * @param {string} id
     * @returns {ModelPolicyContract|null}
     */
    getActivePolicy(id) {
        const policy = this.getPolicy(id);
        if (policy && policy.status === ModelPolicyContract.STATUS.ACTIVE) {
            return policy;
        }
        return null;
    }

    /**
     * استعلام حتمي للسياسات النشطة المطابقة لنوع المهمة
     * @param {string} taskType
     * @returns {ModelPolicyContract[]}
     */
    getPoliciesForTaskType(taskType) {
        const ids = this.taskTypeIndex.get(taskType);
        if (!ids) return [];

        const activePolicies = [];
        for (const id of ids) {
            const p = this.getActivePolicy(id);
            if (p) activePolicies.push(p);
        }

        // فرز حتمي مستقر بنسبة 100%
        return activePolicies.sort((a, b) => a.policy_id.localeCompare(b.policy_id));
    }

    /**
     * استعلام حتمي للسياسات بمستوى الخطورة
     * @param {string} riskLevel
     * @returns {ModelPolicyContract[]}
     */
    getPoliciesByRiskLevel(riskLevel) {
        const ids = this.riskIndex.get(riskLevel);
        if (!ids) return [];

        const activePolicies = [];
        for (const id of ids) {
            const p = this.getActivePolicy(id);
            if (p) activePolicies.push(p);
        }

        return activePolicies.sort((a, b) => a.policy_id.localeCompare(b.policy_id));
    }

    /**
     * تقييم تصريحي لمطابقة حمولة عمل مع السياسة لمنع تخفيض مستوى الأمان (Security Downgrade)
     * @param {string} policyId معرف السياسة المراد استخدامها
     * @param {{risk_level: string, task_type: string}} workload حمولة العمل
     * @returns {{compliant: boolean, reason?: string}}
     */
    evaluatePolicyCompliance(policyId, workload) {
        const policy = this.getActivePolicy(policyId);
        if (!policy) {
            return {
                compliant: false,
                reason: `السياسة المطلوبة '${policyId}' غير موجودة أو ليست في حالة نشطة (ACTIVE)`
            };
        }

        if (!workload || typeof workload !== 'object') {
            return { compliant: false, reason: 'حمولة العمل غير معرفة أو مشوهة' };
        }

        // 1. التحقق من مطابقة نوع المهمة
        if (workload.task_type && !policy.task_types.includes(workload.task_type)) {
            return {
                compliant: false,
                reason: `نوع المهمة '${workload.task_type}' غير مصرح به في السياسة '${policyId}'`
            };
        }

        // 2. التحقق الحتمي من منع تخفيض الأمان (Anti-Security-Downgrade)
        if (workload.risk_level) {
            const workloadWeight = ModelPolicyContract.RISK_HIERARCHY[workload.risk_level];
            const policyWeight = ModelPolicyContract.RISK_HIERARCHY[policy.risk_level];

            if (!workloadWeight) {
                return { compliant: false, reason: `مستوى خطورة حمولة العمل '${workload.risk_level}' غير صالح` };
            }

            if (workloadWeight > policyWeight) {
                return {
                    compliant: false,
                    reason: `محاولة تخفيض أمان غير مصرح بها: حمولة العمل بمستوى خطورة مرتفع (${workload.risk_level}) لا يمكن ربطها بسياسة أقل صرامة (${policy.risk_level})`
                };
            }
        }

        return { compliant: true };
    }

    /**
     * إجمالي عدد السياسات المسجلة
     * @returns {number}
     */
    get size() {
        return this.policies.size;
    }

    /**
     * استرجاع كافة السياسات النشطة
     * @returns {ModelPolicyContract[]}
     */
    getActivePolicies() {
        const active = [];
        for (const policy of this.policies.values()) {
            if (policy.status === ModelPolicyContract.STATUS.ACTIVE) {
                active.push(policy);
            }
        }
        return active.sort((a, b) => a.policy_id.localeCompare(b.policy_id));
    }

    /**
     * التحقق الشامل من بنية بيانات سجل السياسات والتحقق المتقاطع (Fail-Closed)
     * @param {Object} rawData بيانات السجل الخام
     * @param {Object} [registries] سجلات التحقق المتقاطع (validRules, validValidators, etc.)
     * @returns {{isValid: boolean, errors: string[], parsedPolicies: ModelPolicyContract[]}}
     */
    static validateRegistryData(rawData, registries = {}) {
        const errors = [];
        const parsedPolicies = [];

        if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
            return {
                isValid: false,
                errors: ['بيانات سجل السياسات يجب أن تكون كائناً غير فارغ يحتوي على مصفوفة policies'],
                parsedPolicies: []
            };
        }

        if (!rawData.policies || !Array.isArray(rawData.policies)) {
            return {
                isValid: false,
                errors: ['حقل policies إلزامي ويجب أن يكون مصفوفة من سياسات النماذج'],
                parsedPolicies: []
            };
        }

        const seenIds = new Set();

        for (let i = 0; i < rawData.policies.length; i++) {
            const entry = rawData.policies[i];
            const id = entry ? entry.policy_id : null;

            if (!entry || typeof entry !== 'object') {
                errors.push(`عنصر السياسة رقم ${i} مشوه أو فارغ`);
                continue;
            }

            // منع تكرار المعرف
            if (seenIds.has(id)) {
                errors.push(`تكرار غير مسموح به لمعرف السياسة: '${id}'`);
                continue;
            }
            if (id) seenIds.add(id);

            // 1. التحقق الهيكلي من العقد
            const validation = ModelPolicyContract.validate(entry);
            if (!validation.isValid) {
                const subIssues = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
                errors.push(`خطأ في عقد سياسة النموذج '${id || i}': ${subIssues}`);
                continue;
            }

            // 2. التحقق المتقاطع من القواعد (Rules Validation)
            if (registries.validRules && Array.isArray(registries.validRules)) {
                const rulesToCheck = entry.applicable_rules || [];
                for (const r of rulesToCheck) {
                    if (!registries.validRules.includes(r)) {
                        errors.push(`قاعدة مجهولة غير مسجلة: '${r}' في سياسة النموذج '${id}'`);
                    }
                }
            }

            // 3. التحقق المتقاطع من المدققات (Validators Validation)
            if (registries.validValidators && Array.isArray(registries.validValidators)) {
                const valsToCheck = entry.required_validators || [];
                for (const v of valsToCheck) {
                    if (!registries.validValidators.includes(v)) {
                        errors.push(`مدقق مجهول غير مسجل: '${v}' في سياسة النموذج '${id}'`);
                    }
                }
            }

            try {
                parsedPolicies.push(new ModelPolicyContract(entry));
            } catch (err) {
                errors.push(`فشل إنشاء كائن سياسة النموذج '${id}': ${err.message}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            parsedPolicies
        };
    }

    /**
     * تحميل السجل الكنسي من ملف JSON على القرص
     * @param {string} filePath مسار ملف السجل
     * @param {Object} [registries] سجلات التحقق المتقاطع
     * @returns {ModelPolicyRegistry}
     */
    static loadFromFile(filePath, registries = {}) {
        const safePath = PathLoaderGuard.validateSafePath(filePath);

        let rawContent;
        try {
            rawContent = JSON.parse(fs.readFileSync(safePath, 'utf8'));
        } catch (err) {
            throw new Error(`تعذر قراءة أو تحليل ملف JSON لسجل سياسات النماذج: ${err.message}`);
        }

        const validation = ModelPolicyRegistry.validateRegistryData(rawContent, registries);
        if (!validation.isValid) {
            throw new Error(`فشل تحميل سجل سياسات النماذج (Fail-Closed):\n- ${validation.errors.join('\n- ')}`);
        }

        const registry = new ModelPolicyRegistry();
        for (const policy of validation.parsedPolicies) {
            registry.registerPolicy(policy);
        }

        return registry;
    }
}

module.exports = ModelPolicyRegistry;
