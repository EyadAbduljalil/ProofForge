/**
 * @file data-integrity-verifier.js
 * @description WebForge V2.2 — Data Integrity, Database Contract & Migration Verifier
 * محرك فحص سلامة البيانات، القيود العلائقية، السجلات اليتيمة، وتدقيق الترحيلات المبرمجة
 * محايد للتقنيات البرمجية ولا يرتبط بنوع محدد من قواعد البيانات
 */

'use strict';

class DataIntegrityVerifier {
    constructor() {
        this.contracts = new Map();
        this.migrations = new Map();
    }

    /**
     * تسجيل عقد جدول أو مجموعة بيانات تصريحياً
     * @param {Object} contractDef
     */
    registerDataContract(contractDef) {
        if (!contractDef || !contractDef.id || !contractDef.name || !Array.isArray(contractDef.fields)) {
            throw new Error('عقد البيانات يتطلب معرفاً (id) واسماً (name) ومصفوفة حقول (fields).');
        }

        if (this.contracts.has(contractDef.id)) {
            throw new Error(`معرف عقد البيانات مكرر: ${contractDef.id}`);
        }

        const contract = {
            id: String(contractDef.id),
            name: String(contractDef.name),
            fields: contractDef.fields.map(f => ({
                name: f.name,
                type: f.type || 'string',
                required: Boolean(f.required),
                nullable: Boolean(f.nullable),
                immutable: Boolean(f.immutable),
                unique: Boolean(f.unique),
                references: f.references || null // { targetContract, targetField }
            })),
            constraints: Array.isArray(contractDef.constraints) ? contractDef.constraints : []
        };

        this.contracts.set(contract.id, contract);
        return contract;
    }

    /**
     * التحقق من سلامة مجموعة سجلات مقابل عقد البيانات
     * @param {string} contractId
     * @param {Array} records
     * @param {Object} externalReferences
     */
    verifyRecords(contractId, records = [], externalReferences = {}) {
        const contract = this.contracts.get(contractId);
        if (!contract) {
            return {
                contractId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isCompliant: false,
                reason: 'عقد البيانات غير مسجل'
            };
        }

        const anomalies = [];
        const seenUniqueValues = new Map();

        // إعداد تتبع الحقول الفريدة
        for (const f of contract.fields) {
            if (f.unique) {
                seenUniqueValues.set(f.name, new Set());
            }
        }

        for (let idx = 0; idx < records.length; idx++) {
            const rec = records[idx];
            if (!rec || typeof rec !== 'object') {
                anomalies.push({
                    type: 'MALFORMED_RECORD',
                    severity: 'HIGH',
                    index: idx,
                    message: `السجل رقم ${idx} مشوه أو غير صالح ككائن بيانات.`
                });
                continue;
            }

            // 1. فحص الحقول الإلزامية والفراغ
            for (const f of contract.fields) {
                const val = rec[f.name];
                if (f.required && (val === undefined || (val === null && !f.nullable))) {
                    anomalies.push({
                        type: 'REQUIRED_FIELD_MISSING_OR_ILLEGAL_NULL',
                        severity: 'CRITICAL',
                        index: idx,
                        field: f.name,
                        message: `الحقل الإلزامي (${f.name}) مفقود أو يحتوي على قيمة Null غير مسموحة.`
                    });
                }

                // 2. فحص الحقول الفريدة والتصادم
                if (f.unique && val !== undefined && val !== null) {
                    const set = seenUniqueValues.get(f.name);
                    if (set.has(val)) {
                        anomalies.push({
                            type: 'UNIQUE_CONSTRAINT_VIOLATION',
                            severity: 'CRITICAL',
                            index: idx,
                            field: f.name,
                            value: val,
                            message: `تصادم في القيمة الفريدة للحقل (${f.name}): ${val}`
                        });
                    } else {
                        set.add(val);
                    }
                }

                // 3. فحص الروابط المرجعية والسجلات اليتيمة
                if (f.references && val !== undefined && val !== null) {
                    const targetList = externalReferences[f.references.targetContract];
                    if (Array.isArray(targetList)) {
                        const exists = targetList.some(targetItem => targetItem[f.references.targetField] === val);
                        if (!exists) {
                            anomalies.push({
                                type: 'BROKEN_REFERENCE_ORPHAN_RECORD',
                                severity: 'CRITICAL',
                                index: idx,
                                field: f.name,
                                value: val,
                                target: `${f.references.targetContract}.${f.references.targetField}`,
                                message: `مرجع مكسور وسجل يتيم: القيمة (${val}) غير موجودة في الجدول المستهدف (${f.references.targetContract}).`
                            });
                        }
                    }
                }
            }
        }

        const isCompliant = anomalies.length === 0;
        return {
            contractId: contract.id,
            contractName: contract.name,
            status: isCompliant ? 'VERIFIED' : 'INTEGRITY_VIOLATION_DETECTED',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            recordCount: records.length,
            anomaliesCount: anomalies.length,
            anomalies
        };
    }

    /**
     * تسجيل ترحيل كنسي لتدقيق التحول بين الإصدارات
     * @param {Object} migrationDef
     */
    registerMigration(migrationDef) {
        if (!migrationDef || !migrationDef.id || !migrationDef.fromVersion || !migrationDef.toVersion) {
            throw new Error('الترحيل يتطلب معرفاً والإصدار المبدئي والإصدار المستهدف.');
        }

        const mig = {
            id: String(migrationDef.id),
            fromVersion: String(migrationDef.fromVersion),
            toVersion: String(migrationDef.toVersion),
            transform: typeof migrationDef.transform === 'function' ? migrationDef.transform : null,
            rollbackTransform: typeof migrationDef.rollbackTransform === 'function' ? migrationDef.rollbackTransform : null,
            canRollback: Boolean(migrationDef.canRollback)
        };

        this.migrations.set(mig.id, mig);
        return mig;
    }

    /**
     * فحص وتدقيق ترحيل البيانات والتأكد من الحفاظ على السجلات وإمكانية التراجع
     * @param {string} migrationId
     * @param {Array} initialRecords
     */
    verifyMigration(migrationId, initialRecords = []) {
        const mig = this.migrations.get(migrationId);
        if (!mig) {
            return { migrationId, status: 'NOT_FOUND', gate: 'FAIL' };
        }

        if (!mig.transform) {
            return {
                migrationId,
                status: 'INVALID_MIGRATION',
                gate: 'FAIL',
                reason: 'دالة التحويل (transform) غير معرفة في الترحيل.'
            };
        }

        // تطبيق الترحيل للأمام
        const migratedRecords = initialRecords.map(r => mig.transform({ ...r }));
        const recordsPreserved = migratedRecords.length === initialRecords.length;

        // التحقق من التراجع إذا كان مصرحاً به
        let rollbackSafe = false;
        if (mig.canRollback && mig.rollbackTransform) {
            const reverted = migratedRecords.map(r => mig.rollbackTransform({ ...r }));
            rollbackSafe = reverted.length === initialRecords.length;
        }

        const isCompliant = recordsPreserved && (!mig.canRollback || rollbackSafe);

        return {
            migrationId,
            fromVersion: mig.fromVersion,
            toVersion: mig.toVersion,
            status: isCompliant ? 'VERIFIED' : 'MIGRATION_FAILED',
            gate: isCompliant ? 'PASS' : 'FAIL',
            isCompliant,
            initialCount: initialRecords.length,
            migratedCount: migratedRecords.length,
            recordsPreserved,
            canRollback: mig.canRollback,
            rollbackSafe
        };
    }
}

module.exports = {
    DataIntegrityVerifier
};
