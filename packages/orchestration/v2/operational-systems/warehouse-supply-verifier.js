/**
 * @file warehouse-supply-verifier.js
 * @description WebForge V2.7 — Warehouse Operations & Supply Chain Three-Way Matching Verifier
 * محرك التحقق من مواقع المستودعات، النقل الذري، منع الأرصدة السالبة، المطابقة الثلاثية للمشتريات والفصل بين المهام
 */

class WarehouseSupplyVerifier {
    constructor() {}

    /**
     * التحقق من النقل الذري بين مواقع المستودع (Bin-to-Bin Transfer) ومنع الأرصدة السالبة
     */
    verifyBinTransfer(sourceBin, destBin, sku, quantity) {
        const findings = [];

        if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
            findings.push({
                code: 'INVALID_TRANSFER_QUANTITY',
                severity: 'CRITICAL',
                quantity,
                message: `كمية النقل بين الرفوف يجب أن تكون عدداً صحيحاً موجباً: ${quantity}`
            });
            return { valid: false, findings };
        }

        const sourceAvailable = (sourceBin.stock && sourceBin.stock[sku]) || 0;
        if (sourceAvailable < quantity) {
            findings.push({
                code: 'INSUFFICIENT_BIN_STOCK_NEGATIVE_PREVENTED',
                severity: 'CRITICAL',
                sourceBinId: sourceBin.id,
                sku,
                available: sourceAvailable,
                requested: quantity,
                deficit: quantity - sourceAvailable,
                message: `محاولة نقل تؤدي لرصيد سالب: الرف المصدر (${sourceBin.id}) يحتوي على ${sourceAvailable} فقط والمطلوب نقل ${quantity}`
            });
        }

        return {
            valid: findings.length === 0,
            projectedSourceStock: Math.max(0, sourceAvailable - quantity),
            projectedDestStock: ((destBin.stock && destBin.stock[sku]) || 0) + quantity,
            findings
        };
    }

    /**
     * كشف تضارب الجمع المتزامن للمخزون (Concurrent Picking Race Detection)
     */
    verifyConcurrentPicking(availableStock, pickRequests = []) {
        const findings = [];
        let totalRequestedQuantity = 0;

        for (const req of pickRequests) {
            totalRequestedQuantity += req.quantity;
        }

        if (totalRequestedQuantity > availableStock) {
            findings.push({
                code: 'CONCURRENT_PICKING_OVERALLOCATION_COLLISION',
                severity: 'CRITICAL',
                availableStock,
                totalRequestedQuantity,
                shortage: totalRequestedQuantity - availableStock,
                message: `سباق عمليات متزامن: إجمالي طلبات الجمع المتزامنة (${totalRequestedQuantity}) يتجاوز الرصيد الفعلي المتوفر على الرف (${availableStock})`
            });
        }

        return {
            valid: findings.length === 0,
            totalRequestedQuantity,
            availableStock,
            findings
        };
    }

    /**
     * المطابقة الثلاثية للمشتريات (Procurement Three-Way Matching)
     * Invariant: Purchase Order (PO) ↔ Goods Receipt (GR) ↔ Vendor Invoice (VI)
     */
    verifyThreeWayMatching(purchaseOrder, goodsReceipt, vendorInvoice) {
        const findings = [];
        const { poNumber, sku, quantity: poQty, unitPrice: poPrice } = purchaseOrder;
        const { quantityReceived: grQty } = goodsReceipt;
        const { quantityInvoiced: viQty, unitPriceInvoiced: viPrice } = vendorInvoice;

        // 1. مطابقة الاستلام مع أمر الشراء (منع الاستلام الزائد غير المصرح به)
        if (grQty > poQty) {
            findings.push({
                code: 'GOODS_RECEIPT_EXCEEDS_PURCHASE_ORDER',
                severity: 'HIGH',
                poNumber,
                poQty,
                grQty,
                overage: grQty - poQty,
                message: `الكمية المستلمة في المستودع (${grQty}) تتجاوز الكمية المصرح بها في أمر الشراء (${poQty})`
            });
        }

        // 2. مطابقة الفاتورة مع البضاعة المستلمة فعلياً (حظر الفوترة للبضاعة غير المستلمة)
        if (viQty > grQty) {
            findings.push({
                code: 'INVOICE_EXCEEDS_GOODS_RECEIVED',
                severity: 'CRITICAL',
                poNumber,
                grQty,
                viQty,
                unreceivedInvoiced: viQty - grQty,
                message: `مطالبة مالية غير مشروعة: كمية الفاتورة المطالب بسدادها (${viQty}) تتجاوز ما تم استلامه فعلياً في المستودع (${grQty})`
            });
        }

        // 3. مطابقة سعر الوحدة في الفاتورة مع سعر أمر الشراء المعتمد
        if (Math.abs(viPrice - poPrice) > 0.01) {
            findings.push({
                code: 'INVOICE_PRICE_VARIANCE_MISMATCH',
                severity: 'HIGH',
                poPrice,
                viPrice,
                variance: viPrice - poPrice,
                message: `تضارب في سعر الوحدة المفوتر: سعر الفاتورة (${viPrice}) يختلف عن السعر التعاقدي المعتمد في أمر الشراء (${poPrice})`
            });
        }

        return {
            matched: findings.length === 0,
            findings
        };
    }

    /**
     * التحقق من الفصل الصارم بين المهام في المشتريات (Segregation of Duties)
     * Invariant: Requisition Creator / Buyer CANNOT approve their own Purchase Order
     */
    verifySegregationOfDuties(purchaseOrder, approvingActor) {
        const findings = [];
        const { id: poId, buyerId, creatorId } = purchaseOrder;
        const { actorId, role } = approvingActor;

        if (actorId === buyerId || actorId === creatorId) {
            findings.push({
                code: 'SEGREGATION_OF_DUTIES_VIOLATION',
                severity: 'CRITICAL',
                poId,
                actorId,
                message: `انتهاك رقابي حرج: منشئ أمر الشراء أو مسؤول المشتريات (${actorId}) يحاول اعتماد أمر الشراء الخاص به (Self-Procurement Forbidden)`
            });
        }

        if (role !== 'FINANCE_DIRECTOR' && role !== 'PROCUREMENT_MANAGER') {
            findings.push({
                code: 'INSUFFICIENT_PROCUREMENT_APPROVAL_ROLE',
                severity: 'HIGH',
                actorId,
                role,
                message: `رتبة المستخدم (${role}) غير مؤهلة لاعتماد أوامر الشراء`
            });
        }

        return {
            authorized: findings.length === 0,
            findings
        };
    }
}

module.exports = {
    WarehouseSupplyVerifier
};
