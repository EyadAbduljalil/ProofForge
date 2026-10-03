/**
 * @file cross-module-consistency.js
 * @description WebForge V2.1 — Cross-Module Consistency & Universal Reconciliation
 * محرك التحقق من الاتساق بين الوحدات البرمجية والخدمات المستقلة
 * ومحرك المطابقة العام (Universal Reconciliation Engine) لمطابقة المصدر مقابل الوجهة
 */

'use strict';

class CrossModuleConsistencyVerifier {
    constructor() {
        this.moduleRelationships = [];
    }

    /**
     * تعريف علاقة اتساق بين وحدتين أو أكثر
     * @param {Object} rel
     */
    registerRelationship(rel) {
        if (!rel || !rel.sourceModule || !rel.targetModule || !rel.expectedConsistency) {
            throw new Error('علاقة الوحدات تتطلب وحدة المصدر، وحدة الوجهة، ونوع الاتساق المتوقع.');
        }

        const canonicalRel = {
            id: rel.id || `REL-${rel.sourceModule}-${rel.targetModule}`,
            sourceModule: String(rel.sourceModule),
            targetModule: String(rel.targetModule),
            expectedConsistency: String(rel.expectedConsistency), // e.g. 'EXACT_MATCH', 'EVENTUAL_CONSISTENCY', 'REFERENTIAL_INTEGRITY'
            keyMapping: rel.keyMapping || { sourceKey: 'id', targetKey: 'sourceRef' },
            allowOrphans: Boolean(rel.allowOrphans)
        };

        this.moduleRelationships.push(canonicalRel);
        return canonicalRel;
    }

    /**
     * فحص الاتساق بين سجلات المصدر وسجلات الوجهة
     * @param {string} relationshipId
     * @param {Array} sourceRecords
     * @param {Array} targetRecords
     */
    verifyConsistency(relationshipId, sourceRecords = [], targetRecords = []) {
        const rel = this.moduleRelationships.find(r => r.id === relationshipId);
        if (!rel) {
            return {
                relationshipId,
                status: 'NOT_FOUND',
                gate: 'FAIL',
                isConsistent: false,
                reason: 'العلاقة غير مسجلة'
            };
        }

        const anomalies = [];
        const sourceMap = new Map();
        const targetMap = new Map();

        const sKey = rel.keyMapping.sourceKey;
        const tKey = rel.keyMapping.targetKey;

        for (const item of sourceRecords) {
            if (item && item[sKey] !== undefined) {
                sourceMap.set(String(item[sKey]), item);
            }
        }

        for (const item of targetRecords) {
            if (item && item[tKey] !== undefined) {
                targetMap.set(String(item[tKey]), item);
            }
        }

        // 1. كشف السجلات المفقودة في الوجهة (Missing Propagation)
        for (const [key, sItem] of sourceMap.entries()) {
            if (!targetMap.has(key)) {
                anomalies.push({
                    type: 'MISSING_PROPAGATION',
                    severity: 'HIGH',
                    sourceKey: key,
                    message: `سجل المصدر (${key}) غير موجود في الوجهة (${rel.targetModule}).`
                });
            }
        }

        // 2. كشف السجلات اليتيمة في الوجهة (Orphaned Records)
        if (!rel.allowOrphans) {
            for (const [key, tItem] of targetMap.entries()) {
                if (!sourceMap.has(key)) {
                    anomalies.push({
                        type: 'ORPHANED_STATE',
                        severity: 'CRITICAL',
                        targetKey: key,
                        message: `سجل يتيم في الوجهة (${rel.targetModule}) بدون سجل مصدر مطابق في (${rel.sourceModule}).`
                    });
                }
            }
        }

        const isConsistent = anomalies.length === 0;
        return {
            relationshipId: rel.id,
            sourceModule: rel.sourceModule,
            targetModule: rel.targetModule,
            status: isConsistent ? 'VERIFIED' : 'INCONSISTENCY_DETECTED',
            gate: isConsistent ? 'PASS' : 'FAIL',
            isConsistent,
            sourceCount: sourceRecords.length,
            targetCount: targetRecords.length,
            anomaliesCount: anomalies.length,
            anomalies
        };
    }
}

/**
 * محرك المطابقة العام (Universal Reconciliation Engine)
 * يدعم مقارنة: مصدر مقابل وجهة، مدخل مقابل مخرج، طلب مقابل دفع، أو أي أصلين
 */
class UniversalReconciliationEngine {
    constructor() {
        this.reconciliationHistory = [];
    }

    /**
     * تنفيذ مطابقة كنسية شاملة بين مجموعتين من البيانات
     * @param {Object} params
     */
    reconcile(params = {}) {
        const {
            name = 'Universal Reconciliation',
            sourceItems = [],
            targetItems = [],
            matchBy = 'id',
            valueField = 'amount',
            tolerance = 0.00
        } = params;

        const sourceMap = new Map();
        const targetMap = new Map();
        let sourceTotal = 0;
        let targetTotal = 0;
        const discrepancies = [];

        for (const s of sourceItems) {
            const id = String(s[matchBy]);
            const val = Number(s[valueField]) || 0;
            sourceMap.set(id, s);
            sourceTotal += val;
        }

        for (const t of targetItems) {
            const id = String(t[matchBy]);
            const val = Number(t[valueField]) || 0;
            targetMap.set(id, t);
            targetTotal += val;
        }

        // مطابقة كل بند
        for (const [id, sItem] of sourceMap.entries()) {
            const tItem = targetMap.get(id);
            if (!tItem) {
                discrepancies.push({
                    id,
                    type: 'MISSING_IN_TARGET',
                    sourceValue: sItem[valueField],
                    targetValue: null,
                    difference: sItem[valueField]
                });
            } else {
                const sVal = Number(sItem[valueField]) || 0;
                const tVal = Number(tItem[valueField]) || 0;
                const diff = Math.abs(sVal - tVal);
                if (diff > tolerance) {
                    discrepancies.push({
                        id,
                        type: 'VALUE_MISMATCH',
                        sourceValue: sVal,
                        targetValue: tVal,
                        difference: diff
                    });
                }
            }
        }

        for (const [id, tItem] of targetMap.entries()) {
            if (!sourceMap.has(id)) {
                discrepancies.push({
                    id,
                    type: 'SURPLUS_IN_TARGET',
                    sourceValue: null,
                    targetValue: tItem[valueField],
                    difference: tItem[valueField]
                });
            }
        }

        const totalDiff = Math.abs(sourceTotal - targetTotal);
        const isReconciled = discrepancies.length === 0 && totalDiff <= tolerance;

        const result = {
            name,
            timestamp: new Date().toISOString(),
            status: isReconciled ? 'RECONCILED' : 'DISCREPANCY_DETECTED',
            gate: isReconciled ? 'PASS' : 'FAIL',
            isReconciled,
            sourceCount: sourceItems.length,
            targetCount: targetItems.length,
            sourceTotal: Number(sourceTotal.toFixed(4)),
            targetTotal: Number(targetTotal.toFixed(4)),
            difference: Number(totalDiff.toFixed(4)),
            tolerance,
            discrepanciesCount: discrepancies.length,
            discrepancies
        };

        this.reconciliationHistory.push(result);
        return result;
    }
}

module.exports = {
    CrossModuleConsistencyVerifier,
    UniversalReconciliationEngine
};
