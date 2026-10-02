/**
 * @file index.js
 * @description البوابة المركزية لحزمة الذكاء والحوكمة الأمنية لنظام WebForge OS
 * WebForge OS Security Intelligence & Governance Package
 */

const ProjectSecurityProfiler = require('./project-profiler');
const ThreatModelingEngine = require('./threat-engine');
const RiskAssessmentEngine = require('./risk-engine');
const SecurityControlMatrix = require('./control-matrix');
const AttackSurfaceInventory = require('./attack-surface');
const ChangeImpactAnalyzer = require('./change-impact');
const SupplyChainGuard = require('./supply-chain');
const PipelineInfraGuard = require('./pipeline-infra-guard');
const PrivacyDataFlowGuard = require('./privacy-data-flow');
const AIAgentGovernanceEngine = require('./ai-agent-governance');
const AbuseFraudEngine = require('./abuse-fraud-engine');
const SecurityMemoryLedger = require('./security-memory-ledger');
const ArchitectureFitnessGuard = require('./architecture-fitness');
const SecurityBenchmark = require('./benchmark/security-benchmark');

module.exports = {
    ProjectSecurityProfiler,
    ThreatModelingEngine,
    RiskAssessmentEngine,
    SecurityControlMatrix,
    AttackSurfaceInventory,
    ChangeImpactAnalyzer,
    SupplyChainGuard,
    PipelineInfraGuard,
    PrivacyDataFlowGuard,
    AIAgentGovernanceEngine,
    AbuseFraudEngine,
    SecurityMemoryLedger,
    ArchitectureFitnessGuard,
    SecurityBenchmark
};
