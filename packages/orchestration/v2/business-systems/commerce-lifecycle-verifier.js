/**
 * @file commerce-lifecycle-verifier.js
 * @description WebForge V2.5 — E-Commerce Lifecycle & Invariant Verification Engine
 * محرك التحقق من دورات حياة الكتالوج، الأسعار، السلة، المخزون، الطلبات، والمدفوعات والمرتجعات
 */

const crypto = require('crypto');

const ORDER_STATES = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PAID: 'PAID',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    RETURN_REQUESTED: 'RETURN_REQUESTED',
    RETURNED: 'RETURNED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED'
};

const ALLOWED_ORDER_TRANSITIONS = {
    [ORDER_STATES.DRAFT]: [ORDER_STATES.PENDING, ORDER_STATES.CANCELLED],
    [ORDER_STATES.PENDING]: [ORDER_STATES.CONFIRMED, ORDER_STATES.PAID, ORDER_STATES.CANCELLED],
    [ORDER_STATES.CONFIRMED]: [ORDER_STATES.PAID, ORDER_STATES.CANCELLED],
    [ORDER_STATES.PAID]: [ORDER_STATES.PROCESSING, ORDER_STATES.REFUNDED, ORDER_STATES.PARTIALLY_REFUNDED, ORDER_STATES.CANCELLED],
    [ORDER_STATES.PROCESSING]: [ORDER_STATES.SHIPPED, ORDER_STATES.CANCELLED, ORDER_STATES.REFUNDED],
    [ORDER_STATES.SHIPPED]: [ORDER_STATES.DELIVERED, ORDER_STATES.RETURN_REQUESTED],
    [ORDER_STATES.DELIVERED]: [ORDER_STATES.RETURN_REQUESTED, ORDER_STATES.REFUNDED, ORDER_STATES.PARTIALLY_REFUNDED],
    [ORDER_STATES.RETURN_REQUESTED]: [ORDER_STATES.RETURNED, ORDER_STATES.CONFIRMED],
    [ORDER_STATES.RETURNED]: [ORDER_STATES.REFUNDED, ORDER_STATES.PARTIALLY_REFUNDED],
    [ORDER_STATES.REFUNDED]: [],
    [ORDER_STATES.PARTIALLY_REFUNDED]: [ORDER_STATES.REFUNDED],
    [ORDER_STATES.CANCELLED]: []
};

class CommerceLifecycleVerifier {
    constructor() {
        this.usedCoupons = new Map(); // couponCode:userId -> count
        this.inventoryLedger = new Map(); // sku -> { available, reserved, sold }
        this.processedIdempotencyKeys = new Set();
    }

    /**
     * التحقق من سلامة المنتجات والكتالوج
     */
    verifyCatalog(catalog) {
        const findings = [];
        const seenSkus = new Set();

        if (!catalog || !Array.isArray(catalog.products)) {
            return {
                valid: false,
                findings: [{ code: 'INVALID_CATALOG_STRUCTURE', severity: 'CRITICAL', message: 'هيكل الكتالوج غير صالح أو خاوٍ' }]
            };
        }

        for (const product of catalog.products) {
            // فحص معرف المنتج والـ SKU
            if (!product.id || !product.sku) {
                findings.push({
                    code: 'MISSING_PRODUCT_IDENTITY',
                    severity: 'HIGH',
                    productId: product.id,
                    message: 'المنتج يفتقد إلى معرف أو SKU كنسي'
                });
            }

            if (seenSkus.has(product.sku)) {
                findings.push({
                    code: 'DUPLICATE_SKU',
                    severity: 'HIGH',
                    sku: product.sku,
                    message: `تم اكتشاف تكرار في رمز الـ SKU: ${product.sku}`
                });
            } else {
                seenSkus.add(product.sku);
            }

            // فحص الأسعار الأساسية
            if (typeof product.price !== 'number' || isNaN(product.price) || product.price <= 0) {
                findings.push({
                    code: 'INVALID_PRODUCT_PRICE',
                    severity: 'HIGH',
                    sku: product.sku,
                    price: product.price,
                    message: `سعر المنتج غير صالح أو سالب/صفري: ${product.price}`
                });
            }

            // فحص الفئات
            if (!product.category || typeof product.category !== 'string') {
                findings.push({
                    code: 'INVALID_CATEGORY',
                    severity: 'MEDIUM',
                    sku: product.sku,
                    message: `المنتج يفتقد إلى فئة تصنيف صالحة`
                });
            }

            // فحص المتغيرات اليتيمة (Orphan Variants)
            if (product.variants && Array.isArray(product.variants)) {
                for (const variant of product.variants) {
                    if (!variant.parentSku || variant.parentSku !== product.sku) {
                        findings.push({
                            code: 'ORPHAN_VARIANT',
                            severity: 'HIGH',
                            variantSku: variant.sku,
                            message: `تم اكتشاف متغير يتيم لا ينتمي للـ SKU الأساسي: ${variant.sku}`
                        });
                    }
                }
            }

            // فحص الإشارة إلى منتج معطل في سياق نشط
            if (product.status === 'INACTIVE' && product.activeCampaignReference) {
                findings.push({
                    code: 'INACTIVE_PRODUCT_REFERENCED',
                    severity: 'HIGH',
                    sku: product.sku,
                    message: `منتج معطل مستهدف في حملة أو تدفق نشط`
                });
            }
        }

        return {
            valid: findings.length === 0,
            totalProductsChecked: catalog.products.length,
            findings
        };
    }

    /**
     * التحقق من الأسعار والخصومات والكوبونات
     */
    verifyPricingAndDiscounts(orderRequest, pricingPolicy = {}) {
        const findings = [];
        const { items, discounts = [], coupons = [], maxAllowedDiscountPercent = 50, customerId } = orderRequest;

        let calculatedSubtotal = 0;

        for (const item of items) {
            if (item.price <= 0) {
                findings.push({
                    code: 'NEGATIVE_OR_ZERO_PRICE',
                    severity: 'CRITICAL',
                    sku: item.sku,
                    price: item.price,
                    message: `سعر غير قانوني للسلعة: ${item.price}`
                });
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                findings.push({
                    code: 'INVALID_ITEM_QUANTITY',
                    severity: 'CRITICAL',
                    sku: item.sku,
                    quantity: item.quantity,
                    message: `كمية السلعة يجب أن تكون عدداً صحيحاً موجباً: ${item.quantity}`
                });
            }
            calculatedSubtotal += (item.price || 0) * (item.quantity || 0);
        }

        let totalDiscount = 0;

        // تدقيق الخصومات العامة
        for (const discount of discounts) {
            if (discount.amount < 0 || discount.percentage < 0) {
                findings.push({
                    code: 'NEGATIVE_DISCOUNT_VALUE',
                    severity: 'CRITICAL',
                    discountId: discount.id,
                    message: 'تم إرسال قيمة خصم سالبة تؤدي لزيادة السعر بطريقة مشبوهة'
                });
            }
            if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) {
                findings.push({
                    code: 'EXPIRED_PROMOTION',
                    severity: 'HIGH',
                    discountId: discount.id,
                    message: `محاولة تطبيق عرض ترويجي منتهي الصلاحية: ${discount.id}`
                });
            }
            if (discount.startDate && new Date(discount.startDate) > new Date()) {
                findings.push({
                    code: 'FUTURE_PROMOTION_USED',
                    severity: 'HIGH',
                    discountId: discount.id,
                    message: `محاولة تطبيق عرض ترويجي مستقبلي لم يبدأ بعد: ${discount.id}`
                });
            }
            totalDiscount += discount.amount || (calculatedSubtotal * (discount.percentage / 100));
        }

        // تدقيق الكوبونات وتكرار استخدامها
        const seenCoupons = new Set();
        for (const coupon of coupons) {
            if (seenCoupons.has(coupon.code)) {
                findings.push({
                    code: 'DUPLICATE_COUPON_IN_REQUEST',
                    severity: 'HIGH',
                    coupon: coupon.code,
                    message: `تكرار نفس الكوبون في نفس الطلب: ${coupon.code}`
                });
            }
            seenCoupons.add(coupon.code);

            const userKey = `${coupon.code}:${customerId}`;
            const usageCount = this.usedCoupons.get(userKey) || 0;
            if (coupon.singleUse && usageCount > 0) {
                findings.push({
                    code: 'COUPON_REUSE_EXCEEDED',
                    severity: 'CRITICAL',
                    coupon: coupon.code,
                    customerId,
                    message: `محاولة إعادة استخدام كوبون مخصص للاستخدام لمرة واحدة: ${coupon.code}`
                });
            }

            if (coupon.valid === false) {
                findings.push({
                    code: 'INVALID_COUPON_CODE',
                    severity: 'HIGH',
                    coupon: coupon.code,
                    message: `الكوبون المرسل غير معتمد أو ملغى: ${coupon.code}`
                });
            }

            totalDiscount += coupon.value || 0;
        }

        // فحص سقف الحد الأقصى للخصم المسموح (Maximum Discount Boundary)
        const maxDiscountCap = calculatedSubtotal * (maxAllowedDiscountPercent / 100);
        if (totalDiscount > maxDiscountCap) {
            findings.push({
                code: 'MAX_DISCOUNT_CAP_EXCEEDED',
                severity: 'HIGH',
                totalDiscount,
                maxAllowed: maxDiscountCap,
                message: `إجمالي الخصومات (${totalDiscount}) يتجاوز الحد الأقصى المسموح (${maxAllowedDiscountPercent}% = ${maxDiscountCap})`
            });
        }

        return {
            valid: findings.length === 0,
            subtotal: calculatedSubtotal,
            totalDiscount,
            findings
        };
    }

    /**
     * التحقق من دورة حياة السلة ولقطات الأسعار (Cart Verification)
     */
    verifyCart(cart, currentCatalogPrices = {}) {
        const findings = [];

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            findings.push({
                code: 'EMPTY_CART',
                severity: 'MEDIUM',
                message: 'السلة فارغة ولا يمكن إتمام الشراء'
            });
            return { valid: false, findings };
        }

        const seenSkus = new Set();
        let expectedTotal = 0;

        for (const item of cart.items) {
            if (seenSkus.has(item.sku)) {
                findings.push({
                    code: 'DUPLICATE_CART_ITEM',
                    severity: 'LOW',
                    sku: item.sku,
                    message: `تم العثور على سلع مكررة في السلة بدلاً من دمج الكميات: ${item.sku}`
                });
            }
            seenSkus.add(item.sku);

            if (item.quantity <= 0) {
                findings.push({
                    code: 'INVALID_CART_QUANTITY',
                    severity: 'CRITICAL',
                    sku: item.sku,
                    quantity: item.quantity,
                    message: `كمية السلعة في السلة غير قانونية: ${item.quantity}`
                });
            }

            // فحص تطابق سعر لقطة السلة مع السعر الكنسي الحالي (Price Drift Detection)
            const livePrice = currentCatalogPrices[item.sku];
            if (livePrice !== undefined && livePrice !== item.snapshotPrice) {
                findings.push({
                    code: 'CART_PRICE_DRIFT',
                    severity: 'HIGH',
                    sku: item.sku,
                    snapshotPrice: item.snapshotPrice,
                    livePrice,
                    message: `تغير سعر السلعة في الكتالوج (${livePrice}) عن سعر لقطة السلة (${item.snapshotPrice})`
                });
            }

            expectedTotal += (item.snapshotPrice || 0) * (item.quantity || 0);
        }

        return {
            valid: findings.length === 0,
            expectedTotal,
            findings
        };
    }

    /**
     * التحقق من حجز المخزون ومنع البيع الزائد (Inventory Allocation & Anti-Overselling)
     */
    verifyInventoryAllocation(orderItems, stockDatabase = {}) {
        const findings = [];
        const allocations = [];

        for (const item of orderItems) {
            const stock = stockDatabase[item.sku];
            if (!stock) {
                findings.push({
                    code: 'PRODUCT_OUT_OF_STOCK_OR_MISSING',
                    severity: 'HIGH',
                    sku: item.sku,
                    message: `السلعة غير موجودة في سجلات المخزون: ${item.sku}`
                });
                continue;
            }

            const available = stock.available;
            if (item.quantity > available) {
                findings.push({
                    code: 'INSUFFICIENT_STOCK_OVERSELLING_ATTEMPT',
                    severity: 'CRITICAL',
                    sku: item.sku,
                    requested: item.quantity,
                    available,
                    message: `محاولة بيع زائد (Overselling): الكمية المطلوبة ${item.quantity} تفوق المتوفر ${available}`
                });
            } else {
                allocations.push({
                    sku: item.sku,
                    reservedQuantity: item.quantity,
                    remainingStock: available - item.quantity
                });
            }
        }

        return {
            valid: findings.length === 0,
            allocations,
            findings
        };
    }

    /**
     * التحقق من دورة حياة وانتقالات حالات الطلب (Order State Transition Model)
     */
    verifyOrderTransition(currentState, nextState, context = {}) {
        const findings = [];
        const allowed = ALLOWED_ORDER_TRANSITIONS[currentState];

        if (!allowed) {
            findings.push({
                code: 'UNKNOWN_CURRENT_ORDER_STATE',
                severity: 'CRITICAL',
                state: currentState,
                message: `حالة الطلب الحالية غير معترف بها: ${currentState}`
            });
            return { valid: false, findings };
        }

        if (!allowed.includes(nextState)) {
            findings.push({
                code: 'ILLEGAL_ORDER_TRANSITION',
                severity: 'CRITICAL',
                from: currentState,
                to: nextState,
                allowedTransitions: allowed,
                message: `تحول غير قانوني ومحظور في حالة الطلب من ${currentState} إلى ${nextState}`
            });
        }

        // فحص الأثر الجانبي: محاولة الإلغاء بعد الشحن
        if (currentState === ORDER_STATES.SHIPPED && nextState === ORDER_STATES.CANCELLED) {
            findings.push({
                code: 'CANCEL_AFTER_SHIPMENT_FORBIDDEN',
                severity: 'CRITICAL',
                message: 'لا يجوز إلغاء الطلب بعد خروجه للشحن؛ يجب تقديم طلب إرجاع'
            });
        }

        // فحص شرط الدفع: التحول إلى PROCESSING بدون إثبات دفع صالح
        if (nextState === ORDER_STATES.PROCESSING && !context.paymentVerified) {
            findings.push({
                code: 'PROCESSING_WITHOUT_PAYMENT_VERIFICATION',
                severity: 'CRITICAL',
                message: 'محاولة نقل الطلب للتجهيز دون إثبات دفع بنكي صالح'
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
     * التحقق من ثوابت الطلب الحسابية والقانونية (Order Invariants)
     */
    verifyOrderInvariants(order) {
        const findings = [];
        const { items = [], subtotal, discountTotal = 0, taxTotal = 0, shippingTotal = 0, grandTotal } = order;

        let computedSubtotal = 0;
        for (const item of items) {
            if (item.quantity <= 0) {
                findings.push({
                    code: 'INVALID_ITEM_QUANTITY',
                    severity: 'CRITICAL',
                    sku: item.sku,
                    quantity: item.quantity,
                    message: `كمية السلعة سالبة أو صفرية: ${item.quantity}`
                });
            }
            computedSubtotal += (item.unitPrice || 0) * (item.quantity || 0);
        }

        if (Math.abs(computedSubtotal - subtotal) > 0.01) {
            findings.push({
                code: 'SUBTOTAL_MISMATCH',
                severity: 'HIGH',
                computedSubtotal,
                claimedSubtotal: subtotal,
                message: `عدم تطابق المجموع الفرعي للبنود (${computedSubtotal}) مع القيمة المسجلة (${subtotal})`
            });
        }

        const expectedGrandTotal = Math.max(0, computedSubtotal - discountTotal + taxTotal + shippingTotal);
        if (Math.abs(expectedGrandTotal - grandTotal) > 0.01) {
            findings.push({
                code: 'ORDER_GRAND_TOTAL_INVARIANT_VIOLATION',
                severity: 'CRITICAL',
                expectedGrandTotal,
                claimedGrandTotal: grandTotal,
                message: `انتهاك ثابت المجموع الكلي للطلب: المتوقع ${expectedGrandTotal} والمسجل ${grandTotal}`
            });
        }

        return {
            valid: findings.length === 0,
            expectedGrandTotal,
            findings
        };
    }

    /**
     * التحقق من إدارة المرتجعات والاسترداد المالي (Returns & Refunds Invariants)
     */
    verifyReturnAndRefund(order, returnRequest) {
        const findings = [];
        const { originalPaymentAmount, totalRefundedSoFar = 0, deliveryDate, returnWindowDays = 30 } = order;
        const { requestedRefundAmount, requestDate = new Date() } = returnRequest;

        // 1. فحص نافذة الأهلية الزمنية للإرجاع
        if (deliveryDate) {
            const daysSinceDelivery = (new Date(requestDate) - new Date(deliveryDate)) / (1000 * 60 * 60 * 24);
            if (daysSinceDelivery > returnWindowDays) {
                findings.push({
                    code: 'RETURN_WINDOW_EXPIRED',
                    severity: 'HIGH',
                    daysSinceDelivery: Math.round(daysSinceDelivery),
                    returnWindowDays,
                    message: `انقضت نافذة الإرجاع المسموحة (${returnWindowDays} يوماً). مضى ${Math.round(daysSinceDelivery)} يوماً`
                });
            }
        }

        // 2. التحقق الحازم من ثابت المبالغ المستردة: إجمالي الاسترداد لا يتجاوز المبلغ المدفوع الأصلي
        const projectedRefund = totalRefundedSoFar + requestedRefundAmount;
        if (projectedRefund > originalPaymentAmount) {
            findings.push({
                code: 'REFUND_EXCEEDS_ORIGINAL_PAYMENT',
                severity: 'CRITICAL',
                originalPaymentAmount,
                totalRefundedSoFar,
                requestedRefundAmount,
                projectedRefund,
                overage: projectedRefund - originalPaymentAmount,
                message: `محاولة استرداد مبلغ (${projectedRefund}) يتجاوز إجمالي ما دفعه العميل (${originalPaymentAmount})`
            });
        }

        if (requestedRefundAmount <= 0) {
            findings.push({
                code: 'INVALID_REFUND_AMOUNT',
                severity: 'HIGH',
                requestedRefundAmount,
                message: `مبلغ الاسترداد المطلوب غير قانوني: ${requestedRefundAmount}`
            });
        }

        return {
            valid: findings.length === 0,
            remainingRefundableBalance: Math.max(0, originalPaymentAmount - projectedRefund),
            findings
        };
    }

    /**
     * التحقق من الشحن والتعقب (Shipping Verification)
     */
    verifyShipping(shipment) {
        const findings = [];
        const { orderId, trackingNumber, status, shippedAt, deliveredAt } = shipment;

        if (!orderId || !trackingNumber) {
            findings.push({
                code: 'INVALID_SHIPMENT_RECORD',
                severity: 'HIGH',
                message: 'سجل الشحنة يفتقد إلى معرف الطلب أو رقم التتبع الكنسي'
            });
        }

        // فحص الترتيب الزمني: التسليم قبل الشحن
        if (shippedAt && deliveredAt && new Date(deliveredAt) < new Date(shippedAt)) {
            findings.push({
                code: 'DELIVERED_BEFORE_SHIPPED_ANOMALY',
                severity: 'CRITICAL',
                shippedAt,
                deliveredAt,
                message: 'خلل زمني مستحيل: تم تسجيل وقت التسليم قبل تاريخ خروج الشحنة'
            });
        }

        return {
            valid: findings.length === 0,
            findings
        };
    }

    /**
     * فحص عدم التكرار (Idempotency) للمدفوعات وإنشاء الطلبات
     */
    verifyIdempotency(idempotencyKey) {
        if (!idempotencyKey || typeof idempotencyKey !== 'string') {
            return {
                valid: false,
                isDuplicate: false,
                findings: [{ code: 'MISSING_IDEMPOTENCY_KEY', severity: 'HIGH', message: 'مفتاح منع التكرار مفقود' }]
            };
        }

        if (this.processedIdempotencyKeys.has(idempotencyKey)) {
            return {
                valid: false,
                isDuplicate: true,
                findings: [{
                    code: 'DUPLICATE_IDEMPOTENT_OPERATION',
                    severity: 'CRITICAL',
                    idempotencyKey,
                    message: `تم اكتشاف تكرار لعملية تجارية تمت معالجتها مسبقاً بنفس المفتاح: ${idempotencyKey}`
                }]
            };
        }

        this.processedIdempotencyKeys.add(idempotencyKey);
        return {
            valid: true,
            isDuplicate: false,
            findings: []
        };
    }
}

module.exports = {
    ORDER_STATES,
    ALLOWED_ORDER_TRANSITIONS,
    CommerceLifecycleVerifier
};
