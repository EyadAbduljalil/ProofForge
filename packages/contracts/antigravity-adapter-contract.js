/**
 * @file antigravity-adapter-contract.js
 * @description عقد محول Google Antigravity الهيكلي الكنسي في نظام ProofForge (Phase 7)
 * يحكم التحويل التصريحي التوثيقي لأصول ProofForge إلى قطع متوافقة مع Google Antigravity.
 * 
 * المبادئ الحاكمة:
 * - Structural / Documentary Compatibility !== Native Runtime Integration
 * - Adapter !== Antigravity Runtime
 * - Transformation Preserves: Security, Evidence, CVGF, Provenance
 * - Fail-Closed on Path Traversal & Unsafe Resolution
 */

'use strict';

class AntigravityAdapterContract {
    /**
     * الحالات التشغيلية المعتمدة لعقد المحول
     */
    static STATUS = Object.freeze({
        ACTIVE: 'ACTIVE',
        DISABLED: 'DISABLED'
    });

    /**
     * أنواع التحويل الهيكلي المصرح بها
     */
    static TRANSFORMATION_TYPES = Object.freeze({
        SKILL_TRANSFORMATION: 'SKILL_TRANSFORMATION',
        RULE_TRANSFORMATION: 'RULE_TRANSFORMATION',
        AGENT_MANIFEST_GENERATION: 'AGENT_MANIFEST_GENERATION'
    });

    /**
     * نمط التوافقية المعماري
     */
    static COMPATIBILITY_MODE = 'STRUCTURAL_DECLARATIVE';

    /**
     * إنشاء كائن عقد المحول وتجميده حتمياً
     * @param {Object} def بيانات تعريف العقد
     */
    constructor(def) {
        const validation = AntigravityAdapterContract.validate(def);
        if (!validation.isValid) {
            const errDetails = validation.errors.map(e => `[${e.field}]: ${e.issue}`).join('; ');
            throw new Error(`فشل إنشاء عقد محول Antigravity (Fail-Closed): ${errDetails}`);
        }

        this.adapter_id = String(def.adapter_id);
        this.transformation_type = def.transformation_type;
        this.compatibility_mode = AntigravityAdapterContract.COMPATIBILITY_MODE;
        this.status = def.status;
        this.version = String(def.version);

        this.source_artifact = Object.freeze({ ...def.source_artifact });
        this.target_artifact = Object.freeze({ ...def.target_artifact });
        this.generated_path = String(def.generated_path);
        this.validation_requirements = Object.freeze([...(def.validation_requirements || [])]);
        this.security_restrictions = Object.freeze([...(def.security_restrictions || [])]);
        this.provenance = Object.freeze({ ...def.provenance });

        Object.freeze(this);
    }

    /**
     * فحص حتمي مغلق (Fail-Closed) لبيانات عقد محول Antigravity
     * @param {Object} def بيانات التعريف
     * @returns {{isValid: boolean, errors: Array<{field: string, issue: string}>}}
     */
    static validate(def) {
        const errors = [];

        if (!def || typeof def !== 'object' || Array.isArray(def)) {
            return {
                isValid: false,
                errors: [{ field: 'root', issue: 'بيانات عقد المحول يجب أن تكون كائناً غير فارغ' }]
            };
        }

        // 1. معرف المحول (adapter_id)
        const idPattern = /^PF-ADAPT-[A-Z0-9_-]+$/;
        if (!def.adapter_id || typeof def.adapter_id !== 'string') {
            errors.push({ field: 'adapter_id', issue: 'حقل adapter_id إلزامي ويجب أن يكون نصاً' });
        } else if (!idPattern.test(def.adapter_id)) {
            errors.push({
                field: 'adapter_id',
                issue: `معرف المحول '${def.adapter_id}' غير مطابق للنمط الكنسي الصارم (^PF-ADAPT-[A-Z0-9_-]+$)`
            });
        }

        // 2. نوع التحويل (transformation_type)
        if (!def.transformation_type || !Object.values(AntigravityAdapterContract.TRANSFORMATION_TYPES).includes(def.transformation_type)) {
            errors.push({
                field: 'transformation_type',
                issue: `نوع التحويل غير صالح. الأنواع المسموحة: ${Object.values(AntigravityAdapterContract.TRANSFORMATION_TYPES).join(', ')}`
            });
        }

        // 3. الحالة (status)
        if (!def.status || !Object.values(AntigravityAdapterContract.STATUS).includes(def.status)) {
            errors.push({
                field: 'status',
                issue: `حالة العقد غير صالحة. القيم المسموحة: ${Object.values(AntigravityAdapterContract.STATUS).join(', ')}`
            });
        }

        // 4. الإصدار (version)
        const semverPattern = /^\d+\.\d+\.\d+$/;
        if (!def.version || typeof def.version !== 'string' || !semverPattern.test(def.version)) {
            errors.push({ field: 'version', issue: 'حقل version إلزامي ويجب أن يتبع ترقيم SemVer (x.y.z)' });
        }

        // 5. القطعة المصدر (source_artifact)
        if (!def.source_artifact || typeof def.source_artifact !== 'object' || !def.source_artifact.type || !def.source_artifact.identifier) {
            errors.push({
                field: 'source_artifact',
                issue: 'حقل source_artifact إلزامي ويجب أن يحدد نوع المصدر (type) والمعرف (identifier)'
            });
        }

        // 6. القطعة الهدف (target_artifact)
        if (!def.target_artifact || typeof def.target_artifact !== 'object' || !def.target_artifact.format) {
            errors.push({
                field: 'target_artifact',
                issue: 'حقل target_artifact إلزامي ويجب أن يحدد صيغة القطعة الهدف في Antigravity (format)'
            });
        }

        // 7. المسار المولد (generated_path)
        if (!def.generated_path || typeof def.generated_path !== 'string' || def.generated_path.trim() === '') {
            errors.push({ field: 'generated_path', issue: 'حقل generated_path إلزامي لتحديد مسار القطعة الناتجة' });
        } else {
            // فحص أمني حتمي ضد القفز عبر المسارات (Path Traversal Defense)
            if (def.generated_path.includes('..') || def.generated_path.startsWith('/') || /^[a-zA-Z]:/.test(def.generated_path)) {
                errors.push({
                    field: 'generated_path',
                    issue: 'محاولة قفز مسار غير آمنة أو مسار مطلق غير مصرح به (Path Traversal Detected)'
                });
            }
            if (!def.generated_path.endsWith('.md')) {
                errors.push({
                    field: 'generated_path',
                    issue: 'امتداد الملف المولد غير مصرح به، يجب أن ينتهي بـ .md حصراً'
                });
            }
        }

        // 8. سلسلة النسب (provenance)
        if (!def.provenance || typeof def.provenance !== 'object' || !def.provenance.source_contract) {
            errors.push({
                field: 'provenance',
                issue: 'حقل provenance إلزامي ويجب أن يحدد العقد المصدري الكنسي لضمان سلسلة التتبع'
            });
        }

        // 9. المتطلبات الأمنية والتحقق (security_restrictions, validation_requirements)
        if (!Array.isArray(def.security_restrictions) || def.security_restrictions.length === 0) {
            errors.push({ field: 'security_restrictions', issue: 'حقل security_restrictions إلزامي لحفظ قيود الأمان' });
        }
        if (!Array.isArray(def.validation_requirements) || def.validation_requirements.length === 0) {
            errors.push({ field: 'validation_requirements', issue: 'حقل validation_requirements إلزامي' });
        }

        // الفحوصات الأمنية الحتمية
        const fullString = JSON.stringify(def);
        if (/BYPASS[_\s-]+P0|OVERRIDE[_\s-]+P0/i.test(fullString)) {
            errors.push({
                field: 'security_restrictions',
                issue: 'محاولة غير مصرح بها لتجاوز سياسات الأمان P0 في عقد المحول'
            });
        }
        if (/GRANT[_\s-]+P0|ESCALATE[_\s-]+AUTHORITY/i.test(fullString)) {
            errors.push({
                field: 'security_restrictions',
                issue: 'محاولة تصعيد سلطة غير مصرح بها أثناء التحويل الهيكلي'
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = AntigravityAdapterContract;
