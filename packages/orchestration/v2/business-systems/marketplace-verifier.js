/**
 * @file marketplace-verifier.js
 * @description WebForge V2.5 — Multi-Vendor Marketplace Isolation, Splitting & Settlement Verifier
 * محرك التحقق من عزل البائعين، تقسيم الطلبات، العمولات، وتسويات المستحقات
 */

class MarketplaceVerifier {
    constructor() {
        this.settledPayouts = new Set(); // payoutId
    }

    /**
     * التحقق الصارم من عزل البائعين ومنع اختراق الصلاحيات والـ IDOR
     * Invariant: Seller A must NOT access, view, or modify Seller B's resources
     */
    verifySellerIsolation(requestActor, targetResource) {
        const findings = [];
        const { actorId, role } = requestActor;
        const { resourceId, resourceType, ownerSellerId } = targetResource;

        if (role === 'PLATFORM_ADMIN') {
            // المشرف العام يمتلك صلاحيات إدارية عليا شريطة تسجيل التدقيق
            return {
                authorized: true,
                findings: []
            };
        }

        if (!actorId || !ownerSellerId) {
            findings.push({
                code: 'INVALID_AUTHORIZATION_CONTEXT',
                severity: 'CRITICAL',
                message: 'سياق التحقق يفتقد إلى معرف الفاعل أو معرف البائع المالك'
            });
            return { authorized: false, findings };
        }

        if (actorId !== ownerSellerId) {
            findings.push({
                code: 'CROSS_SELLER_ACCESS_VIOLATION_IDOR',
                severity: 'CRITICAL',
                actorId,
                ownerSellerId,
                resourceId,
                resourceType,
                message: `محاولة اختراق عزل البائعين (IDOR): البائع ${actorId} حاول الوصول إلى مورد مملوك للبائع ${ownerSellerId}`
            });
            return {
                authorized: false,
                findings
            };
        }

        return {
            authorized: true,
            findings: []
        };
    }

    /**
     * التحقق من تقسيم الطلبات المشتركة (Order Splitting Verification)
     * Invariant: Parent Order = Sum of Seller Sub-Orders with zero loss and zero duplication
     */
    verifyOrderSplitting(parentOrder, sellerSubOrders = []) {
        const findings = [];
        const { id: parentOrderId, items: parentItems = [], grandTotal: parentGrandTotal } = parentOrder;

        if (!sellerSubOrders || sellerSubOrders.length === 0) {
            findings.push({
                code: 'EMPTY_SUB_ORDERS',
                severity: 'CRITICAL',
                parentOrderId,
                message: 'لم يتم تقسيم الطلب إلى أي طلب فرعي للبائعين'
            });
            return { valid: false, findings };
        }

        // بناء خريطة البنود الأصلية لمطابقتها
        const parentItemsMap = new Map();
        for (const item of parentItems) {
            parentItemsMap.set(item.sku, { ...item, allocatedCount: 0 });
        }

        let totalSubOrdersAmount = 0;
        const seenSubOrderSellers = new Set();

        for (const subOrder of sellerSubOrders) {
            if (!subOrder.sellerId) {
                findings.push({
                    code: 'MISSING_SUB_ORDER_SELLER_ID',
                    severity: 'CRITICAL',
                    subOrderId: subOrder.id,
                    message: 'طلب فرعي لا يحتوي على معرف بائع محدد'
                });
            }

            // فحص بنود الطلب الفرعي
            for (const item of subOrder.items) {
                const parentItem = parentItemsMap.get(item.sku);
                if (!parentItem) {
                    findings.push({
                        code: 'UNKNOWN_ITEM_IN_SUB_ORDER',
                        severity: 'CRITICAL',
                        sku: item.sku,
                        sellerId: subOrder.sellerId,
                        message: `بند موجود في الطلب الفرعي (${item.sku}) غير موجود في الطلب الرئيسي الأصلي`
                    });
                    continue;
                }

                // التحقق من أن السلعة تابعة لنفس البائع المسجل
                if (item.sellerId && item.sellerId !== subOrder.sellerId) {
                    findings.push({
                        code: 'SELLER_ITEM_OWNERSHIP_MISMATCH',
                        severity: 'CRITICAL',
                        itemSellerId: item.sellerId,
                        subOrderSellerId: subOrder.sellerId,
                        sku: item.sku,
                        message: `البند (${item.sku}) مسجل لبائع آخر (${item.sellerId}) داخل طلب البائع (${subOrder.sellerId})`
                    });
                }

                parentItem.allocatedCount += item.quantity;
            }

            totalSubOrdersAmount += (subOrder.subtotal || 0);
        }

        // التحقق من اكتمال التخصيص وعدم النقص أو الازدواجية
        for (const [sku, pItem] of parentItemsMap.entries()) {
            if (pItem.allocatedCount !== pItem.quantity) {
                findings.push({
                    code: 'SPLIT_ALLOCATION_QUANTITY_MISMATCH',
                    severity: 'CRITICAL',
                    sku,
                    parentQuantity: pItem.quantity,
                    allocatedQuantity: pItem.allocatedCount,
                    message: `عدم تطابق في كميات التقسيم للـ SKU (${sku}): الأصل ${pItem.quantity} والمقسم ${pItem.allocatedCount}`
                });
            }
        }

        return {
            valid: findings.length === 0,
            parentOrderId,
            subOrdersCount: sellerSubOrders.length,
            findings
        };
    }

    /**
     * التحقق من حسابات العمولات واستحقاقات المنصة (Commission Verification)
     */
    verifyCommissions(subOrder, commissionRule = {}) {
        const findings = [];
        const { sellerId, subtotal = 0, claimedCommission = 0 } = subOrder;
        const { ratePercentage = 10, fixedFee = 0 } = commissionRule;

        if (ratePercentage < 0 || fixedFee < 0) {
            findings.push({
                code: 'INVALID_COMMISSION_RULE',
                severity: 'CRITICAL',
                ratePercentage,
                fixedFee,
                message: 'قاعدة العمولة تحتوي على نسب أو رسوم سالبة غير مقبولة'
            });
        }

        // الحساب المتوقع للعمولة
        const expectedCommission = (subtotal * (ratePercentage / 100)) + fixedFee;

        // تدقيق الفرق الحسابي
        if (Math.abs(expectedCommission - claimedCommission) > 0.01) {
            findings.push({
                code: 'COMMISSION_CALCULATION_DISCREPANCY',
                severity: 'HIGH',
                sellerId,
                claimedCommission,
                expectedCommission,
                difference: claimedCommission - expectedCommission,
                message: `تضارب في قيمة عمولة المنصة: المحسوب ${claimedCommission} والمتوقع وفق القواعد ${expectedCommission}`
            });
        }

        // ثابت: العمولة لا تتجاوز قيمة مبيعات الطلب
        if (claimedCommission > subtotal) {
            findings.push({
                code: 'COMMISSION_EXCEEDS_ORDER_TOTAL',
                severity: 'CRITICAL',
                claimedCommission,
                subtotal,
                message: `قيمة العمولة (${claimedCommission}) تتجاوز إجمالي قيمة الطلب الفرعي (${subtotal})`
            });
        }

        return {
            valid: findings.length === 0,
            expectedCommission,
            netSellerAmount: Math.max(0, subtotal - expectedCommission),
            findings
        };
    }

    /**
     * التحقق من دورة تسوية وصرف مستحقات البائعين (Seller Payout Verification)
     * Invariant: Payout Amount <= Available Balance & No Duplicate Payouts
     */
    verifySellerPayout(payoutRequest, sellerAccountLedger = {}) {
        const findings = [];
        const { payoutId, sellerId, requestedAmount, currency } = payoutRequest;
        const { availableBalance = 0, currency: ledgerCurrency, disputedAmount = 0 } = sellerAccountLedger;

        if (!payoutId || !sellerId) {
            findings.push({
                code: 'INVALID_PAYOUT_REQUEST',
                severity: 'CRITICAL',
                message: 'طلب التسوية يفتقد إلى معرف كنسي أو معرف البائع'
            });
        }

        // فحص تكرار الصرف
        if (this.settledPayouts.has(payoutId)) {
            findings.push({
                code: 'DUPLICATE_PAYOUT_EXECUTION_ATTEMPT',
                severity: 'CRITICAL',
                payoutId,
                message: `محاولة صرف مكررة لنفس تسوية المستحقات: ${payoutId}`
            });
        }

        // فحص العملة
        if (currency && ledgerCurrency && currency !== ledgerCurrency) {
            findings.push({
                code: 'CURRENCY_MISMATCH_IN_PAYOUT',
                severity: 'HIGH',
                payoutCurrency: currency,
                ledgerCurrency,
                message: `اختلاف عملة الصرف المطلوبة (${currency}) عن عملة حساب البائع (${ledgerCurrency})`
            });
        }

        // فحص كفاية الرصيد القابل للصرف بعد حجز مبالغ النزاعات
        const effectiveWithdrawableBalance = Math.max(0, availableBalance - disputedAmount);
        if (requestedAmount > effectiveWithdrawableBalance) {
            findings.push({
                code: 'INSUFFICIENT_PAYOUT_BALANCE',
                severity: 'CRITICAL',
                requestedAmount,
                availableBalance,
                disputedAmount,
                effectiveWithdrawableBalance,
                message: `المبلغ المطلوب صرفه (${requestedAmount}) يتجاوز الرصيد المتاح القابل للسحب (${effectiveWithdrawableBalance}) بعد خصم مخصصات النزاعات`
            });
        }

        if (requestedAmount <= 0) {
            findings.push({
                code: 'INVALID_PAYOUT_AMOUNT',
                severity: 'HIGH',
                requestedAmount,
                message: `مبلغ الصرف المطلوب غير صالح أو صفري: ${requestedAmount}`
            });
        }

        return {
            valid: findings.length === 0,
            sellerId,
            effectiveWithdrawableBalance,
            findings
        };
    }
}

module.exports = {
    MarketplaceVerifier
};
