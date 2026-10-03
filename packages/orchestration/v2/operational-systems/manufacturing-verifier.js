/**
 * @file manufacturing-verifier.js
 * @description WebForge V2.7 — Manufacturing, Production & BOM Systems Verification Engine
 * محرك التحقق من قوائم المواد (BOM)، استهلاك المواد الخام، أوامر التشغيل، وحسابات التالف والمخرجات
 */

const WORK_ORDER_STATES = {
    PLANNED: 'PLANNED',
    RELEASED: 'RELEASED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

const ALLOWED_WORK_ORDER_TRANSITIONS = {
    [WORK_ORDER_STATES.PLANNED]: [WORK_ORDER_STATES.RELEASED, WORK_ORDER_STATES.CANCELLED],
    [WORK_ORDER_STATES.RELEASED]: [WORK_ORDER_STATES.IN_PROGRESS, WORK_ORDER_STATES.CANCELLED],
    [WORK_ORDER_STATES.IN_PROGRESS]: [WORK_ORDER_STATES.COMPLETED, WORK_ORDER_STATES.CANCELLED],
    [WORK_ORDER_STATES.COMPLETED]: [],
    [WORK_ORDER_STATES.CANCELLED]: []
};

class ManufacturingVerifier {
    constructor() {}

    /**
     * التحقق من قائمة المواد (Bill of Materials - BOM) وكفاية المواد الخام
     */
    verifyBillOfMaterials(bom, rawMaterialStock = {}, plannedQuantity = 1) {
        const findings = [];
        const { finishedGoodSku, components = [] } = bom;

        if (plannedQuantity <= 0) {
            findings.push({
                code: 'INVALID_PLANNED_PRODUCTION_QUANTITY',
                severity: 'CRITICAL',
                plannedQuantity,
                message: `كمية الإنتاج المخططة يجب أن تكون موجبة: ${plannedQuantity}`
            });
            return { valid: false, findings };
        }

        const requiredMaterials = [];

        for (const comp of components) {
            const totalRequired = comp.quantityPerUnit * plannedQuantity;
            const available = rawMaterialStock[comp.materialSku] || 0;

            requiredMaterials.push({
                materialSku: comp.materialSku,
                required: totalRequired,
                available
            });

            if (available < totalRequired) {
                findings.push({
                    code: 'INSUFFICIENT_RAW_MATERIALS',
                    severity: 'CRITICAL',
                    materialSku: comp.materialSku,
                    required: totalRequired,
                    available,
                    deficit: totalRequired - available,
                    message: `نقص في المواد الخام للسلعة (${comp.materialSku}): المطلوب ${totalRequired} والمتوفر ${available}`
                });
            }
        }

        return {
            valid: findings.length === 0,
            finishedGoodSku,
            plannedQuantity,
            requiredMaterials,
            findings
        };
    }

    /**
     * التحقق من انتقالات حالات أمر التشغيل والإنتاج
     */
    verifyWorkOrderTransition(currentState, nextState) {
        const findings = [];
        const allowed = ALLOWED_WORK_ORDER_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_WORK_ORDER_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة أمر التشغيل الحالية غير معترف بها: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_WORK_ORDER_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `انتقال محظور في حالة أمر التشغيل من ${currentState} إلى ${nextState}`
            });
        }

        return {
            valid: findings.length === 0,
            currentState,
            nextState,
            findings
        };
    }

    /**
     * مطابقة مخرجات الإنتاج التام واستهلاك المواد ونسب التالف (Production Reconciliation)
     * Invariant: Finished Goods Produced + Scrap Units = Total Processed Units
     */
    verifyProductionReconciliation(workOrder, productionReport = {}, maxAllowedScrapPercent = 10) {
        const findings = [];
        const { id: workOrderId, plannedQuantity } = workOrder;
        const { actualFinishedGoods, scrapQuantity = 0, reworkQuantity = 0 } = productionReport;

        if (scrapQuantity < 0 || actualFinishedGoods < 0) {
            findings.push({
                code: 'NEGATIVE_PRODUCTION_QUANTITY_ANOMALY',
                severity: 'CRITICAL',
                scrapQuantity,
                actualFinishedGoods,
                message: 'كميات الإنتاج التام أو التالف لا يمكن أن تكون سالبة'
            });
        }

        const totalAccountedFor = actualFinishedGoods + scrapQuantity;
        if (totalAccountedFor !== plannedQuantity) {
            findings.push({
                code: 'PRODUCTION_QUANTITY_UNBALANCED_DISCREPANCY',
                severity: 'HIGH',
                workOrderId,
                plannedQuantity,
                actualFinishedGoods,
                scrapQuantity,
                totalAccountedFor,
                discrepancy: totalAccountedFor - plannedQuantity,
                message: `عدم توازن في مخرجات أمر التشغيل: المخطط ${plannedQuantity} وإجمالي المحسوب (تام + تالف) ${totalAccountedFor}`
            });
        }

        // فحص تجاوز سقف نسبة التالف المسموحة
        const scrapPercent = (scrapQuantity / plannedQuantity) * 100;
        if (scrapPercent > maxAllowedScrapPercent) {
            findings.push({
                code: 'EXCESSIVE_SCRAP_TOLERANCE_EXCEEDED',
                severity: 'HIGH',
                scrapPercent: Math.round(scrapPercent),
                maxAllowedScrapPercent,
                message: `نسبة التالف (${Math.round(scrapPercent)}%) تتجاوز الحد الأقصى المسموح به (${maxAllowedScrapPercent}%) لأمر التشغيل`
            });
        }

        return {
            reconciled: findings.length === 0,
            scrapPercent,
            findings
        };
    }
}

module.exports = {
    WORK_ORDER_STATES,
    ALLOWED_WORK_ORDER_TRANSITIONS,
    ManufacturingVerifier
};
