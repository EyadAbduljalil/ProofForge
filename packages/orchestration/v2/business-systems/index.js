/**
 * @file index.js
 * @description WebForge V2.5 — Business Systems Verification Layer Master Exports
 * تصدير كافة محركات التحقق للأنظمة التجارية (E-Commerce, Marketplace, CRM, Sales)
 */

const {
    ORDER_STATES,
    ALLOWED_ORDER_TRANSITIONS,
    CommerceLifecycleVerifier
} = require('./commerce-lifecycle-verifier');

const {
    MarketplaceVerifier
} = require('./marketplace-verifier');

const {
    CRM_LIFECYCLE_STATES,
    PIPELINE_STAGES,
    CrmSalesVerifier
} = require('./crm-sales-verifier');

module.exports = {
    // E-Commerce
    ORDER_STATES,
    ALLOWED_ORDER_TRANSITIONS,
    CommerceLifecycleVerifier,

    // Marketplace
    MarketplaceVerifier,

    // CRM & Sales
    CRM_LIFECYCLE_STATES,
    PIPELINE_STAGES,
    CrmSalesVerifier
};
