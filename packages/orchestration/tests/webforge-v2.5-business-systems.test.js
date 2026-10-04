/**
 * @file webforge-v2.5-business-systems.test.js
 * @description WebForge V2.5 — Business Systems Verification Layer Master Test Suite
 * حزمة اختبارات شاملة وعدائية للأنظمة التجارية (E-Commerce, Marketplace, CRM, Sales, AI Workflows)
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const v2 = require('../v2/index.js');
const {
    ORDER_STATES,
    ALLOWED_ORDER_TRANSITIONS,
    CommerceLifecycleVerifier,
    MarketplaceVerifier,
    CRM_LIFECYCLE_STATES,
    PIPELINE_STAGES,
    CrmSalesVerifier
} = v2.businessSystems;

describe('WebForge V2.5 — Business Systems Verification Layer Suite', () => {

    // 1. E-Commerce: Catalog, Pricing, Cart & Inventory
    describe('1. E-Commerce: Catalog, Pricing, Cart & Inventory', () => {
        it('should detect duplicate SKUs, orphan variants and invalid product prices', () => {
            const verifier = new CommerceLifecycleVerifier();
            const catalog = {
                products: [
                    { id: 'PROD-1', sku: 'SKU-PHONE', price: 999.99, category: 'Electronics', status: 'ACTIVE' },
                    { id: 'PROD-2', sku: 'SKU-PHONE', price: 899.99, category: 'Electronics', status: 'ACTIVE' }, // SKU مكرر
                    { id: 'PROD-3', sku: 'SKU-CASE', price: -10.00, category: 'Accessories', status: 'ACTIVE' }, // سعر سالب
                    {
                        id: 'PROD-4',
                        sku: 'SKU-SHIRT',
                        price: 29.99,
                        category: 'Apparel',
                        status: 'ACTIVE',
                        variants: [
                            { sku: 'VAR-SHIRT-M', parentSku: 'SKU-OTHER' } // متغير يتيم
                        ]
                    }
                ]
            };

            const result = verifier.verifyCatalog(catalog);
            assert.equal(result.valid, false);
            const codes = result.findings.map(f => f.code);
            assert.ok(codes.includes('DUPLICATE_SKU'));
            assert.ok(codes.includes('INVALID_PRODUCT_PRICE'));
            assert.ok(codes.includes('ORPHAN_VARIANT'));
        });

        it('should block negative prices, expired coupons, coupon reuse, and discount cap violations', () => {
            const verifier = new CommerceLifecycleVerifier();
            
            // تسجيل استخدام كوبون مسبق
            verifier.usedCoupons.set('SINGLE50:USER-123', 1);

            const orderReq = {
                customerId: 'USER-123',
                items: [
                    { sku: 'SKU-1', price: 100, quantity: 2 }
                ],
                coupons: [
                    { code: 'SINGLE50', singleUse: true, value: 50, valid: true } // استخدام مكرر
                ],
                discounts: [
                    { id: 'DISC-EXP', amount: 80, expiryDate: '2020-01-01' } // عرض منتهي
                ],
                maxAllowedDiscountPercent: 40 // السقف 40% = 80 من 200
            };

            const result = verifier.verifyPricingAndDiscounts(orderReq);
            assert.equal(result.valid, false);
            const codes = result.findings.map(f => f.code);
            assert.ok(codes.includes('COUPON_REUSE_EXCEEDED'));
            assert.ok(codes.includes('EXPIRED_PROMOTION'));
            assert.ok(codes.includes('MAX_DISCOUNT_CAP_EXCEEDED'));
        });

        it('should detect cart price drift and invalid quantities', () => {
            const verifier = new CommerceLifecycleVerifier();
            const cart = {
                items: [
                    { sku: 'SKU-LAPTOP', quantity: 1, snapshotPrice: 1200 },
                    { sku: 'SKU-MOUSE', quantity: -1, snapshotPrice: 25 } // كمية سالبة
                ]
            };
            const livePrices = {
                'SKU-LAPTOP': 1400 // تغير السعر الكنسي
            };

            const result = verifier.verifyCart(cart, livePrices);
            assert.equal(result.valid, false);
            const codes = result.findings.map(f => f.code);
            assert.ok(codes.includes('CART_PRICE_DRIFT'));
            assert.ok(codes.includes('INVALID_CART_QUANTITY'));
        });

        it('should detect and prevent overselling during inventory allocation', () => {
            const verifier = new CommerceLifecycleVerifier();
            const orderItems = [
                { sku: 'SKU-CONSOLEX', quantity: 5 }
            ];
            const stockDb = {
                'SKU-CONSOLEX': { available: 2, reserved: 0 }
            };

            const result = verifier.verifyInventoryAllocation(orderItems, stockDb);
            assert.equal(result.valid, false);
            const codes = result.findings.map(f => f.code);
            assert.ok(codes.includes('INSUFFICIENT_STOCK_OVERSELLING_ATTEMPT'));
        });
    });

    // 2. E-Commerce: Order Lifecycle, Invariants, Returns & Shipping
    describe('2. E-Commerce: Order Lifecycle, Invariants, Returns & Shipping', () => {
        it('should verify legal order transitions and reject illegal bypasses and cancellation after shipment', () => {
            const verifier = new CommerceLifecycleVerifier();

            // تحول قانوني
            const validTrans = verifier.verifyOrderTransition(ORDER_STATES.DRAFT, ORDER_STATES.PENDING);
            assert.equal(validTrans.valid, true);

            // تحول محظور: إلغاء بعد الشحن
            const cancelShipped = verifier.verifyOrderTransition(ORDER_STATES.SHIPPED, ORDER_STATES.CANCELLED);
            assert.equal(cancelShipped.valid, false);
            assert.ok(cancelShipped.findings.some(f => f.code === 'ILLEGAL_ORDER_TRANSITION' || f.code === 'CANCEL_AFTER_SHIPMENT_FORBIDDEN'));

            // تحول محظور: التجهيز دون إثبات الدفع
            const procNoPay = verifier.verifyOrderTransition(ORDER_STATES.PAID, ORDER_STATES.PROCESSING, { paymentVerified: false });
            assert.equal(procNoPay.valid, false);
            assert.ok(procNoPay.findings.some(f => f.code === 'PROCESSING_WITHOUT_PAYMENT_VERIFICATION'));
        });

        it('should enforce order mathematical invariants', () => {
            const verifier = new CommerceLifecycleVerifier();
            const badOrder = {
                items: [
                    { sku: 'SKU-A', unitPrice: 50, quantity: 2 }, // 100
                    { sku: 'SKU-B', unitPrice: 30, quantity: 1 }  // 30
                ],
                subtotal: 130,
                discountTotal: 10,
                taxTotal: 15,
                shippingTotal: 10,
                grandTotal: 100 // خطأ رياضي متعمد: المتوقع 130 - 10 + 15 + 10 = 145
            };

            const result = verifier.verifyOrderInvariants(badOrder);
            assert.equal(result.valid, false);
            assert.ok(result.findings.some(f => f.code === 'ORDER_GRAND_TOTAL_INVARIANT_VIOLATION'));
        });

        it('should enforce return window boundary and block refund exceeding original payment', () => {
            const verifier = new CommerceLifecycleVerifier();
            const order = {
                originalPaymentAmount: 200,
                totalRefundedSoFar: 150,
                deliveryDate: '2026-01-01',
                returnWindowDays: 14
            };

            // 1. استرداد يتجاوز المبلغ الأصلي (150 + 100 = 250 > 200)
            const badRefund = verifier.verifyReturnAndRefund(order, {
                requestedRefundAmount: 100,
                requestDate: '2026-01-05'
            });
            assert.equal(badRefund.valid, false);
            assert.ok(badRefund.findings.some(f => f.code === 'REFUND_EXCEEDS_ORIGINAL_PAYMENT'));

            // 2. طلب إرجاع بعد انقضاء المهلة
            const lateReturn = verifier.verifyReturnAndRefund(order, {
                requestedRefundAmount: 30,
                requestDate: '2026-02-15' // أكثر من 14 يوم
            });
            assert.equal(lateReturn.valid, false);
            assert.ok(lateReturn.findings.some(f => f.code === 'RETURN_WINDOW_EXPIRED'));
        });

        it('should detect chronological shipping anomalies and replay attacks with idempotency keys', () => {
            const verifier = new CommerceLifecycleVerifier();

            // شحنة تم تسليمها قبل تاريخ خروجها
            const badShipment = verifier.verifyShipping({
                orderId: 'ORD-101',
                trackingNumber: 'TRACK-XYZ',
                shippedAt: '2026-10-02T10:00:00Z',
                deliveredAt: '2026-10-01T10:00:00Z'
            });
            assert.equal(badShipment.valid, false);
            assert.ok(badShipment.findings.some(f => f.code === 'DELIVERED_BEFORE_SHIPPED_ANOMALY'));

            // فحص منع التكرار
            const key = 'IDEMP-PAY-998877';
            const first = verifier.verifyIdempotency(key);
            assert.equal(first.valid, true);

            const duplicate = verifier.verifyIdempotency(key);
            assert.equal(duplicate.valid, false);
            assert.equal(duplicate.isDuplicate, true);
        });
    });

    // 3. Marketplace: Multi-Vendor Isolation, Order Splitting & Payouts
    describe('3. Marketplace: Multi-Vendor Isolation, Order Splitting & Payouts', () => {
        it('should strictly isolate sellers and block cross-vendor access (IDOR)', () => {
            const verifier = new MarketplaceVerifier();

            const sellerActor = { actorId: 'SELLER-ALPHA', role: 'SELLER' };
            const foreignResource = { resourceId: 'PROD-999', resourceType: 'PRODUCT', ownerSellerId: 'SELLER-BETA' };

            const check = verifier.verifySellerIsolation(sellerActor, foreignResource);
            assert.equal(check.authorized, false);
            assert.ok(check.findings.some(f => f.code === 'CROSS_SELLER_ACCESS_VIOLATION_IDOR'));
        });

        it('should verify order splitting across sellers and detect unallocated items or mismatch', () => {
            const verifier = new MarketplaceVerifier();
            const parentOrder = {
                id: 'PARENT-ORD-1',
                items: [
                    { sku: 'SKU-A', quantity: 2, sellerId: 'SELLER-1' },
                    { sku: 'SKU-B', quantity: 3, sellerId: 'SELLER-2' }
                ],
                grandTotal: 500
            };

            // تقسيم مع نقص في الكمية للـ SKU-B
            const badSubOrders = [
                {
                    id: 'SUB-1',
                    sellerId: 'SELLER-1',
                    items: [{ sku: 'SKU-A', quantity: 2, sellerId: 'SELLER-1' }]
                },
                {
                    id: 'SUB-2',
                    sellerId: 'SELLER-2',
                    items: [{ sku: 'SKU-B', quantity: 1, sellerId: 'SELLER-2' }] // 1 بدلاً من 3
                }
            ];

            const result = verifier.verifyOrderSplitting(parentOrder, badSubOrders);
            assert.equal(result.valid, false);
            assert.ok(result.findings.some(f => f.code === 'SPLIT_ALLOCATION_QUANTITY_MISMATCH'));
        });

        it('should verify commission calculations and reject payouts exceeding available balance or duplicates', () => {
            const verifier = new MarketplaceVerifier();

            // فحص العمولة
            const commResult = verifier.verifyCommissions(
                { sellerId: 'SELLER-1', subtotal: 1000, claimedCommission: 50 }, // المدعى 50 بينما النسبة 10% = 100
                { ratePercentage: 10, fixedFee: 0 }
            );
            assert.equal(commResult.valid, false);
            assert.ok(commResult.findings.some(f => f.code === 'COMMISSION_CALCULATION_DISCREPANCY'));

            // فحص الصرف وتجاوز الرصيد المتاح
            const payoutReq = {
                payoutId: 'PAYOUT-001',
                sellerId: 'SELLER-1',
                requestedAmount: 800,
                currency: 'USD'
            };
            const sellerLedger = {
                availableBalance: 1000,
                disputedAmount: 300, // المتبقي القابل للسحب 700 فقط
                currency: 'USD'
            };

            const payoutCheck = verifier.verifySellerPayout(payoutReq, sellerLedger);
            assert.equal(payoutCheck.valid, false);
            assert.ok(payoutCheck.findings.some(f => f.code === 'INSUFFICIENT_PAYOUT_BALANCE'));
        });
    });

    // 4. CRM, Sales Pipelines & AI Workflow Governance
    describe('4. CRM, Sales Pipelines & AI Workflow Governance', () => {
        it('should verify CRM customer lifecycle transitions and detect duplicate leads', () => {
            const verifier = new CrmSalesVerifier();

            // تحول شرعي
            const valid = verifier.verifyCrmTransition(CRM_LIFECYCLE_STATES.LEAD, CRM_LIFECYCLE_STATES.QUALIFIED, { ownerId: 'REP-01' });
            assert.equal(valid.valid, true);

            // تحول غير شرعي: عميل نهائي يعود كـ Lead
            const invalid = verifier.verifyCrmTransition(CRM_LIFECYCLE_STATES.CUSTOMER, CRM_LIFECYCLE_STATES.LEAD, { ownerId: 'REP-01' });
            assert.equal(invalid.valid, false);
            assert.ok(invalid.findings.some(f => f.code === 'ILLEGAL_CRM_LIFECYCLE_TRANSITION'));

            // كشف تكرار العملاء المتوقعين
            verifier.verifyLead({ id: 'LEAD-1', email: 'test@example.com', source: 'Web' });
            const dupLead = verifier.verifyLead({ id: 'LEAD-2', email: 'test@example.com', source: 'Referral' });
            assert.equal(dupLead.valid, false);
            assert.ok(dupLead.findings.some(f => f.code === 'DUPLICATE_LEAD_DETECTED'));
        });

        it('should enforce quote expiration date and single-use acceptance', () => {
            const verifier = new CrmSalesVerifier();

            // عرض سعر منتهي الصلاحية
            const expiredQuote = {
                id: 'QUOTE-99',
                items: [{ sku: 'PROD-A', unitPrice: 100, quantity: 1 }],
                grandTotal: 100,
                expiryDate: '2020-01-01'
            };

            const quoteCheck = verifier.verifyQuote(expiredQuote);
            assert.equal(quoteCheck.valid, false);
            assert.ok(quoteCheck.findings.some(f => f.code === 'EXPIRED_QUOTE_ACCEPTANCE_FORBIDDEN'));
        });

        it('should govern AI-assisted sales actions and mandate human approval (HITL) for high-value actions', () => {
            const verifier = new CrmSalesVerifier();

            // إجراء ذكاء اصطناعي يمنح خصماً 35% وهو يفوق الحد التلقائي 10%
            const unapprovedAiProposal = {
                actionType: 'GENERATE_DISCOUNT',
                proposedDiscountPercent: 35,
                proposedValue: 5000,
                hasHumanApproval: false
            };

            const check = verifier.verifyAiBusinessAction(unapprovedAiProposal, { maxAutonomousDiscount: 10 });
            assert.equal(check.approved, false);
            assert.equal(check.requiresHumanApproval, true);
            assert.ok(check.findings.some(f => f.code === 'AI_DISCOUNT_EXCEEDS_AUTONOMOUS_LIMIT'));

            // نفس الإجراء مع موافقة بشرية موثقة
            const approvedProposal = {
                ...unapprovedAiProposal,
                hasHumanApproval: true,
                approverRole: 'SALES_DIRECTOR'
            };
            const approvedCheck = verifier.verifyAiBusinessAction(approvedProposal, { maxAutonomousDiscount: 10 });
            assert.equal(approvedCheck.approved, true);
        });
    });
});
