/**
 * @file index.js
 * @description WebForge V2.1 — Canonical Core Verification Intelligence Layer
 * نقطة التصدير الموحدة لكافة محركات ونماذج التحقق الأساسية الكنسية لـ V2.1
 */

'use strict';

const { BusinessLogicEngine } = require('./business-logic-engine');
const { UniversalInvariantEngine } = require('./universal-invariant-engine');
const { StateMachineVerifier } = require('./state-machine-verifier');
const {
    SCENARIO_TYPES,
    EDGE_CASE_CATEGORIES,
    ScenarioIntelligenceEngine
} = require('./scenario-intelligence');
const {
    CrossModuleConsistencyVerifier,
    UniversalReconciliationEngine
} = require('./cross-module-consistency');
const { FailureRecoveryVerifier } = require('./failure-recovery-verifier');

module.exports = {
    // 1. Business Logic
    BusinessLogicEngine,

    // 2. Universal Invariants
    UniversalInvariantEngine,

    // 3. State Machine Verification
    StateMachineVerifier,

    // 4 & 5. Scenario & Edge-Case Intelligence
    SCENARIO_TYPES,
    EDGE_CASE_CATEGORIES,
    ScenarioIntelligenceEngine,

    // 6 & 7. Cross-Module Consistency & Universal Reconciliation
    CrossModuleConsistencyVerifier,
    UniversalReconciliationEngine,

    // 8 & 9. Failure, Recovery & Concurrency Risk Verification
    FailureRecoveryVerifier
};
