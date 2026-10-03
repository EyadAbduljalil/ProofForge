/**
 * @file webforge-v2.7-operational-systems.test.js
 * @description WebForge V2.7 — Operational Systems Verification Layer Master Test Suite
 * حزمة اختبارات شاملة وعدائية لأنظمة التعليم، اللوجستيات، التصنيع، والمستودعات وسلاسل الإمداد
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const v2 = require('../v2/index.js');
const {
    ENROLLMENT_STATES,
    ALLOWED_ENROLLMENT_TRANSITIONS,
    EducationVerifier,
    SHIPMENT_STATES,
    ALLOWED_LOGISTICS_TRANSITIONS,
    LogisticsVerifier,
    WORK_ORDER_STATES,
    ManufacturingVerifier,
    WarehouseSupplyVerifier
} = v2.operationalSystems;

describe('WebForge V2.7 — Operational Systems Verification Layer Suite', () => {

    // 1. Education & Academic Systems Verification
    describe('1. Education: Course Capacity, Prerequisites, Grade Tampering & Transcripts', () => {
        it('should detect course capacity overflow and missing academic prerequisites', () => {
            const verifier = new EducationVerifier();

            // 1. فحص تجاوز السعة
            const course = { id: 'CS-301', capacity: 25 };
            const capCheck = verifier.verifyCourseCapacity(course, 25, 2, false);
            assert.equal(capCheck.valid, false);
            assert.ok(capCheck.findings.some(f => f.code === 'COURSE_CAPACITY_EXCEEDED'));

            // 2. فحص المتطلبات السابقة المفقودة
            const studentCourses = ['MATH-101', 'CS-101'];
            const coursePrereqs = ['MATH-101', 'CS-101', 'CS-201']; // CS-201 مفقود
            const prereqCheck = verifier.verifyPrerequisites(studentCourses, coursePrereqs);
            assert.equal(prereqCheck.eligible, false);
            assert.ok(prereqCheck.findings.some(f => f.code === 'PREREQUISITE_REQUIREMENT_UNMET'));
            assert.ok(prereqCheck.missingPrerequisites.includes('CS-201'));
        });

        it('should block unauthorized grade tampering and reconcile transcripts against authoritative records', () => {
            const verifier = new EducationVerifier();

            // 1. محاولة تعديل درجة معتمدة دون توقيع عمادة التسجيل
            const finalizedGrade = {
                studentId: 'STU-100',
                courseId: 'CS-301',
                grade: 75,
                isFinalized: true
            };
            const tamperReq = {
                newGrade: 95,
                signedByRegistrar: false // غير موقع رسمياً
            };
            const actorInstructor = { actorId: 'INST-01', role: 'INSTRUCTOR' };

            const gradeCheck = verifier.verifyGradeModification(finalizedGrade, tamperReq, actorInstructor);
            assert.equal(gradeCheck.valid, false);
            assert.ok(gradeCheck.findings.some(f => f.code === 'UNAUTHORIZED_GRADE_TAMPERING_ATTEMPT'));

            // 2. مطابقة كشف الدرجات وكشف التضارب
            const transcript = [
                { courseId: 'CS-101', grade: 90 },
                { courseId: 'CS-201', grade: 88 } // تضارب
            ];
            const authoritative = [
                { courseId: 'CS-101', grade: 90 },
                { courseId: 'CS-201', grade: 78 } // الأصل 78
            ];
            const recon = verifier.verifyTranscriptReconciliation(transcript, authoritative);
            assert.equal(recon.reconciled, false);
            assert.ok(recon.findings.some(f => f.code === 'TRANSCRIPT_GRADE_MISMATCH'));
        });
    });

    // 2. Logistics & Advanced Shipping Verification
    describe('2. Logistics: Shipment Lifecycle, Out-of-Order Tracking & Quantity Reconciliation', () => {
        it('should verify shipment state transitions and detect out-of-order tracking events', () => {
            const verifier = new LogisticsVerifier();

            // تحول قانوني
            const valid = verifier.verifyShipmentTransition(SHIPMENT_STATES.CREATED, SHIPMENT_STATES.PICKED_UP);
            assert.equal(valid.valid, true);

            // تحول محظور
            const invalid = verifier.verifyShipmentTransition(SHIPMENT_STATES.DELIVERED, SHIPMENT_STATES.PICKED_UP);
            assert.equal(invalid.valid, false);
            assert.ok(invalid.findings.some(f => f.code === 'ILLEGAL_SHIPMENT_TRANSITION'));

            // كشف وصول حدث تتبع متأخر زمنياً (Out-of-order)
            const events = [
                { eventId: 'EVT-1', status: SHIPMENT_STATES.PICKED_UP, timestamp: '2026-10-02T10:00:00Z' },
                { eventId: 'EVT-2', status: SHIPMENT_STATES.IN_TRANSIT, timestamp: '2026-10-02T14:00:00Z' }
            ];
            const lateEvent = {
                eventId: 'EVT-0',
                trackingNumber: 'TRACK-1',
                status: SHIPMENT_STATES.CREATED,
                timestamp: '2026-10-02T08:00:00Z' // أقدم من آخر حدث مسجل
            };
            const seqCheck = verifier.verifyTrackingEventSequence(events, lateEvent);
            assert.equal(seqCheck.valid, false);
            assert.ok(seqCheck.findings.some(f => f.code === 'OUT_OF_ORDER_TRACKING_EVENT'));
        });

        it('should reconcile package quantities against order items and prevent duplicate webhooks', () => {
            const verifier = new LogisticsVerifier();

            // عدم تطابق كمية الشحن مع أمر الشراء
            const orderItems = [{ sku: 'SKU-PHONE', quantity: 10 }];
            const shipmentPkgs = [
                { items: [{ sku: 'SKU-PHONE', quantity: 8 }] } // 8 بدلاً من 10
            ];
            const pkgRecon = verifier.verifyPackageQuantityReconciliation(orderItems, shipmentPkgs);
            assert.equal(pkgRecon.reconciled, false);
            assert.ok(pkgRecon.findings.some(f => f.code === 'SHIPMENT_QUANTITY_RECONCILIATION_MISMATCH'));

            // كشف تكرار الـ Webhook
            const hook1 = verifier.verifyCarrierWebhook({ eventId: 'HOOK-7788', trackingNumber: 'TRK-9' });
            assert.equal(hook1.valid, true);

            const hook2 = verifier.verifyCarrierWebhook({ eventId: 'HOOK-7788', trackingNumber: 'TRK-9' });
            assert.equal(hook2.valid, false);
            assert.ok(hook2.findings.some(f => f.code === 'DUPLICATE_WEBHOOK_REPLAY_ATTEMPT'));
        });
    });

    // 3. Manufacturing & BOM Production Verification
    describe('3. Manufacturing: BOM Verification, Work Order Transitions & Production Reconciliation', () => {
        it('should detect insufficient raw materials according to BOM requirements', () => {
            const verifier = new ManufacturingVerifier();
            const bom = {
                finishedGoodSku: 'DESK-WOOD',
                components: [
                    { materialSku: 'WOOD-PLANK', quantityPerUnit: 4 },
                    { materialSku: 'METAL-SCREW', quantityPerUnit: 16 }
                ]
            };
            const rawStock = {
                'WOOD-PLANK': 40,  // يكفي لـ 10 مكاتب (40 / 4)
                'METAL-SCREW': 100 // المطلوب لـ 10 مكاتب = 160 (عجز 60)
            };

            const bomCheck = verifier.verifyBillOfMaterials(bom, rawStock, 10);
            assert.equal(bomCheck.valid, false);
            assert.ok(bomCheck.findings.some(f => f.code === 'INSUFFICIENT_RAW_MATERIALS'));
        });

        it('should verify production reconciliation and detect excessive scrap tolerance overflow', () => {
            const verifier = new ManufacturingVerifier();
            const workOrder = { id: 'WO-900', plannedQuantity: 100 };

            // إنتاج به نسبة تالف 25% وهو يتجاوز الحد الأقصى المسموح (10%)
            const productionReport = {
                actualFinishedGoods: 75,
                scrapQuantity: 25
            };

            const prodRecon = verifier.verifyProductionReconciliation(workOrder, productionReport, 10);
            assert.equal(prodRecon.reconciled, false);
            assert.ok(prodRecon.findings.some(f => f.code === 'EXCESSIVE_SCRAP_TOLERANCE_EXCEEDED'));
        });
    });

    // 4. Warehouse & Supply Chain Verification
    describe('4. Warehouse & Supply Chain: Bin Transfers, Concurrent Picking & 3-Way Matching', () => {
        it('should prevent negative bin stock on transfer and detect concurrent picking collisions', () => {
            const verifier = new WarehouseSupplyVerifier();
            const binA = { id: 'BIN-A1', stock: { 'SKU-TOOL': 5 } };
            const binB = { id: 'BIN-B2', stock: { 'SKU-TOOL': 0 } };

            // محاولة نقل كمية أكبر من المتوفر في الرف
            const transferCheck = verifier.verifyBinTransfer(binA, binB, 'SKU-TOOL', 10);
            assert.equal(transferCheck.valid, false);
            assert.ok(transferCheck.findings.some(f => f.code === 'INSUFFICIENT_BIN_STOCK_NEGATIVE_PREVENTED'));

            // كشف سباق العمليات في الجمع المتزامن (Concurrent Picking)
            const available = 8;
            const pickRequests = [
                { pickerId: 'P1', quantity: 5 },
                { pickerId: 'P2', quantity: 5 } // المجموع 10 > 8
            ];
            const pickCheck = verifier.verifyConcurrentPicking(available, pickRequests);
            assert.equal(pickCheck.valid, false);
            assert.ok(pickCheck.findings.some(f => f.code === 'CONCURRENT_PICKING_OVERALLOCATION_COLLISION'));
        });

        it('should enforce 3-way matching and enforce segregation of duties in procurement', () => {
            const verifier = new WarehouseSupplyVerifier();

            // 1. المطابقة الثلاثية: فاتورة تطالب بسداد كمية لم يتم استلامها
            const po = { poNumber: 'PO-501', sku: 'LAPTOP-X', quantity: 20, unitPrice: 1000 };
            const gr = { quantityReceived: 15 }; // تم استلام 15 فقط
            const vi = { quantityInvoiced: 20, unitPriceInvoiced: 1000 }; // الفاتورة بـ 20

            const matchCheck = verifier.verifyThreeWayMatching(po, gr, vi);
            assert.equal(matchCheck.matched, false);
            assert.ok(matchCheck.findings.some(f => f.code === 'INVOICE_EXCEEDS_GOODS_RECEIVED'));

            // 2. الفصل الصارم بين المهام: مسؤول المشتريات يحاول اعتماد أمر الشراء الخاص به
            const poRecord = { id: 'PO-501', buyerId: 'BUYER-AHMED', creatorId: 'BUYER-AHMED' };
            const approverActor = { actorId: 'BUYER-AHMED', role: 'PROCUREMENT_MANAGER' };

            const sodCheck = verifier.verifySegregationOfDuties(poRecord, approverActor);
            assert.equal(sodCheck.authorized, false);
            assert.ok(sodCheck.findings.some(f => f.code === 'SEGREGATION_OF_DUTIES_VIOLATION'));
        });
    });
});
