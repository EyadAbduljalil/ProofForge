/**
 * @file index.js
 * @description WebForge V2 — Master V2 Capability Expansion Exports
 * يجمع كافة مكونات التوسعة المعمارية لنظام WebForge V2
 */

const {
    ProjectProfile,
    ProjectBaseline,
    PROJECT_TYPES,
    PROJECT_MATURITY_LEVELS
} = require('./project-intelligence');

const {
    APPLICABILITY_STATES,
    RuleApplicabilityEngine,
    RuleDependencyGraph,
    RuleConflictDetector,
    TraceabilityCompletenessVerifier,
    UnusedComponentDetector,
    KnowledgeDuplicationDetector
} = require('./rule-intelligence');

const {
    RULE_STATUSES,
    COMPATIBILITY_LEVELS,
    RuleVersionManager,
    CompatibilityManager,
    WebForgeChangeGovernance
} = require('./rule-governance');

const {
    CONFIDENCE_LEVELS,
    EvidenceRecord,
    FingerprintEngine,
    AuditLogTamperDetector,
    EvidenceIntegrityVerifier
} = require('./evidence-intelligence');

const {
    ExceptionManager,
    AuditHistoryTracker,
    AuditComparator,
    ProjectReadinessAssessment,
    RiskClassifier,
    EngineeringDecisionRecord
} = require('./audit-intelligence');

const {
    SarifExporter,
    RuleTestFramework,
    CicdIntegrationContract
} = require('./interoperability-engine');

module.exports = {
    // Domain A: Project Context Intelligence
    ProjectProfile,
    ProjectBaseline,
    PROJECT_TYPES,
    PROJECT_MATURITY_LEVELS,

    // Domain B: Rule Intelligence & Graph
    APPLICABILITY_STATES,
    RuleApplicabilityEngine,
    RuleDependencyGraph,
    RuleConflictDetector,
    TraceabilityCompletenessVerifier,
    UnusedComponentDetector,
    KnowledgeDuplicationDetector,

    // Domain C & D: Rule Governance & Lifecycle
    RULE_STATUSES,
    COMPATIBILITY_LEVELS,
    RuleVersionManager,
    CompatibilityManager,
    WebForgeChangeGovernance,

    // Domain E & J: Evidence & Cryptographic Integrity
    CONFIDENCE_LEVELS,
    EvidenceRecord,
    FingerprintEngine,
    AuditLogTamperDetector,
    EvidenceIntegrityVerifier,

    // Domain D, F, G: Audit, Readiness, Risk, Exceptions & ADRs
    ExceptionManager,
    AuditHistoryTracker,
    AuditComparator,
    ProjectReadinessAssessment,
    RiskClassifier,
    EngineeringDecisionRecord,

    // Domain H & I: Interoperability, SARIF & Rule Testing
    SarifExporter,
    RuleTestFramework,
    CicdIntegrationContract,

    // Specialized Domain: Financial & ERP Verification
    financialErp: require('./financial-erp'),

    // Canonical Core Verification Layer (V2.1)
    coreVerification: require('./core-verification'),

    // Canonical Data, API & Distributed Systems Verification Layer (V2.2)
    distributedVerification: require('./distributed-verification'),

    // Canonical AI / LLM Verification & Security Layer (V2.3)
    aiVerification: require('./ai-verification'),

    // Canonical Business Systems Verification Layer (V2.5)
    businessSystems: require('./business-systems'),

    // Canonical Enterprise & Critical Systems Verification Layer (V2.6)
    enterpriseCritical: require('./enterprise-critical'),

    // Canonical Operational Systems Verification Layer (V2.7)
    operationalSystems: require('./operational-systems')
};
