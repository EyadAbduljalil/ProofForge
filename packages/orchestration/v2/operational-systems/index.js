/**
 * @file index.js
 * @description WebForge V2.7 — Operational Systems Verification Layer Master Exports
 * تصدير كافة محركات التحقق للأنظمة التشغيلية (Education, Logistics, Manufacturing, Warehouse & Supply Chain)
 */

const {
    ENROLLMENT_STATES,
    ALLOWED_ENROLLMENT_TRANSITIONS,
    EducationVerifier
} = require('./education-verifier');

const {
    SHIPMENT_STATES,
    ALLOWED_LOGISTICS_TRANSITIONS,
    LogisticsVerifier
} = require('./logistics-verifier');

const {
    WORK_ORDER_STATES,
    ALLOWED_WORK_ORDER_TRANSITIONS,
    ManufacturingVerifier
} = require('./manufacturing-verifier');

const {
    WarehouseSupplyVerifier
} = require('./warehouse-supply-verifier');

module.exports = {
    // Education Systems
    ENROLLMENT_STATES,
    ALLOWED_ENROLLMENT_TRANSITIONS,
    EducationVerifier,

    // Logistics & Advanced Shipping
    SHIPMENT_STATES,
    ALLOWED_LOGISTICS_TRANSITIONS,
    LogisticsVerifier,

    // Manufacturing & BOM Production
    WORK_ORDER_STATES,
    ALLOWED_WORK_ORDER_TRANSITIONS,
    ManufacturingVerifier,

    // Warehouse & Supply Chain
    WarehouseSupplyVerifier
};
