/**
 * @file orchestration.test.js
 * @description حزمة الاختبارات الآلية الشاملة للأوركسترا ودستور وقواعد الامتثال لنظام WebForge OS
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
    AuthorityHierarchy,
    RuleConflictEngine,
    AntiHallucinationGuard,
    WebForgeComplianceEngine,
    TraceabilityEngine,
    ArchitectureDecisionEngine,
    AnimationDecisionEngine,
    DesignIntelligenceEngine,
    StackDetector,
    AdaptiveVerificationPlanner
} = require('../index');

console.log('======================================================');
console.log('⚡ WebForge OS — Master Orchestration & Compliance Tests');
console.log('======================================================');

// 1. اختبار هرمية الصلاحيات
console.log('>>> [1/8] Testing Authority Hierarchy Arbitration...');
const arbSecurityVsAI = AuthorityHierarchy.arbitrate('P0_SECURITY_SAFETY', 'P8_AGENT_PREFERENCES');
assert.strictEqual(arbSecurityVsAI.winner, 'P0_SECURITY_SAFETY');
const arbConstVsEng = AuthorityHierarchy.arbitrate('P1_CONSTITUTION', 'P4_ENGINEERING');
assert.strictEqual(arbConstVsEng.winner, 'P1_CONSTITUTION');
console.log('  [PASS] P0 Security & P1 Constitution Overrides Verified');

// 2. اختبار محرك حل التعارضات
console.log('>>> [2/8] Testing Rule Conflict Resolution Engine...');
const conflictRes = RuleConflictEngine.resolveConflict(
    { id: 'RULE-SEC-01', name: 'Strict Tenant Token Auth', priority: 'P0_SECURITY_SAFETY', scope: 'SECURITY' },
    { id: 'RULE-AI-01', name: 'Bypass Auth for Fast Agent Testing', priority: 'P8_AGENT_PREFERENCES', scope: 'AGENT' }
);
assert.strictEqual(conflictRes.selected_rule, 'RULE-SEC-01');
assert.strictEqual(conflictRes.status, 'DECIDED_AND_LOGGED');
console.log('  [PASS] Rule Conflict Deterministic Decision Verified');

// 3. اختبار مكافحة الهلوسة والتحقق من الكيانات
console.log('>>> [3/8] Testing Anti-Hallucination Entity Verifier...');
const realPkg = AntiHallucinationGuard.verifyPackageExistence('argon2', path.resolve(__dirname, '../../..'));
assert.strictEqual(realPkg.verified, true);

const fakePkg = AntiHallucinationGuard.verifyPackageExistence('magic-super-ai-invented-pkg', path.resolve(__dirname, '../../..'));
assert.strictEqual(fakePkg.verified, false);
assert.strictEqual(fakePkg.status, 'VIOLATION_HALLUCINATED_PACKAGE');

const realFile = AntiHallucinationGuard.verifyFileExistence('README.md', path.resolve(__dirname, '../../..'));
assert.strictEqual(realFile.verified, true);
console.log('  [PASS] Anti-Hallucination & Provenance Verification Verified');

// 4. اختبار محرك تدقيق الامتثال الشامل
console.log('>>> [4/8] Testing WebForge Compliance Engine...');
const compAudit = WebForgeComplianceEngine.auditCompliance(path.resolve(__dirname, '../../..'));
assert.strictEqual(compAudit.status, 'COMPLIANT');
assert.strictEqual(compAudit.constitution_verified, true);
assert.strictEqual(compAudit.manifest_verified, true);
assert.strictEqual(compAudit.complianceScore, 100);
console.log('  [PASS] Full Constitution & Manifest Compliance Verified');

// 5. اختبار محرك تتبع المتطلبات
console.log('>>> [5/8] Testing Requirement Traceability Matrix Engine...');
const tracer = new TraceabilityEngine();
const traceResult = tracer.generateTraceabilityMatrix(path.resolve(__dirname, '../../..'));
assert(traceResult.totalTracked > 0);
assert(fs.existsSync(traceResult.targetFile), 'TRACEABILITY_MATRIX.md must be generated on disk');
console.log('  [PASS] Requirement Traceability Matrix Generation Verified');

// 6. اختبار محرك توثيق القرارات المعمارية ADR
console.log('>>> [6/8] Testing Architecture Decision Record (ADR) Engine...');
const adr = ArchitectureDecisionEngine.recordDecision({
    id: 'ADR-001',
    title: 'Adoption of Zero-Trust Security Middleware Architecture',
    context: 'Need strict server-side authorization across all API layers',
    selected: 'Custom Zero-Trust Micro-Guards',
    reason: 'Eliminates third-party supply-chain bloat while ensuring 100% testable invariants',
    rollback: 'Revert to classic monolithic middleware'
}, path.resolve(__dirname, '../../..'));
assert(fs.existsSync(adr.filePath), 'ADR JSON file must be saved in .webforge/decisions/');
console.log('  [PASS] Architecture Decision Recording & Storage Verified');

// 7. اختبار محرك حوكمة الحركة والأنيميشن
console.log('>>> [7/8] Testing Animation Decision & Performance Gate Engine...');
const hoverDecision = AnimationDecisionEngine.evaluateAnimationNeeds({ trigger: 'hover', complexity: 'simple' });
assert.strictEqual(hoverDecision.selectedTechnology, 'CSS_TRANSITIONS');

const timelineDecision = AnimationDecisionEngine.evaluateAnimationNeeds({ purpose: 'complex_timeline', complexity: 'complex' });
assert.strictEqual(timelineDecision.selectedTechnology, 'GSAP');

const badAnimationCode = 'function loop() { const rect = el.getBoundingClientRect(); requestAnimationFrame(loop); }';
const animAudit = AnimationDecisionEngine.auditAnimationCode(badAnimationCode);
assert.strictEqual(animAudit.compliant, false);
assert(animAudit.violations.some(v => v.rule === 'ACCESSIBILITY_REDUCED_MOTION'));
assert(animAudit.violations.some(v => v.rule === 'PERFORMANCE_LAYOUT_THRASHING'));
console.log('  [PASS] Animation Technology Selector & Performance Gate Verified');

// 8. اختبار الذكاء التصميمي ومكافحة الابتذال
console.log('>>> [8/10] Testing Design Intelligence & Anti-Slop Engine...');
const designEngine = new DesignIntelligenceEngine();
const slopCss = '.hero { background: linear-gradient(135deg, #8a2be2, #4b0082); backdrop-filter: blur(25px); background: rgba(255, 255, 255, 0.02); }';
const designAudit = designEngine.auditDesignQuality(slopCss);
assert(designAudit.hasSlopPatterns);
assert(designAudit.findingsCount >= 2);
console.log('  [PASS] Anti-Slop Quality Gate & Chromatic Intelligence Verified');

// 9. اختبار محرك اكتشاف الـ Stack المتكيف عبر الـ Fixtures
console.log('>>> [9/10] Testing Adaptive Stack & Capability Detection Engine...');
const currentStack = StackDetector.detectStack(path.resolve(__dirname, '../../..'));
assert.strictEqual(currentStack.projectType, 'fullstack-web-application');
assert(currentStack.languages.includes('javascript'));
assert.strictEqual(currentStack.frontend.framework, 'vanilla-html-css-js');
assert.strictEqual(currentStack.backend.framework, 'native-http-zero-trust');
assert.strictEqual(currentStack.database.engine, 'hybrid-in-memory-file');
console.log('  [PASS] Current Stack Detected with 100% Evidence');

// 10. اختبار محرك تخطيط التحقق وفصل NOT_APPLICABLE عن ENVIRONMENT_LIMITATION
console.log('>>> [10/10] Testing Adaptive Verification Planner & NOT_APPLICABLE Separation...');
const adaptivePlan = AdaptiveVerificationPlanner.planVerification(currentStack, { docker_daemon: false });
assert(adaptivePlan.metrics.totalSuites > 0);
assert(adaptivePlan.notApplicableSuites.some(s => s.id === 'SUITE_KAFKA_MESSAGING'));
assert(adaptivePlan.notApplicableSuites.some(s => s.id === 'SUITE_POSTGRESQL_LIVE'));
assert(adaptivePlan.activeVerificationSuites.some(s => s.id === 'SUITE_BACKEND_HTTP'));
console.log('  [PASS] Adaptive Verification & Context-Aware Planning Verified');

// 11. اختبار الرسم البياني الموحد للأدلة والتحقق
console.log('>>> [11/21] Testing Unified Evidence Graph & Claim Integrity Engine...');
const { EvidenceGraph, ToolResultNormalizer, EngineeringMemory, BenchmarkFramework, TaskReplanner, SupplyChainEngine, AgentAuditRecorder, FailureScenarioLibrary, FindingVerifier, PluginAdapterManager, IncidentIntelligence } = require('../index');
const evidenceGraph = new EvidenceGraph();
evidenceGraph.addNode({ id: 'REQ-AUTH-001', type: 'REQUIREMENT' });
evidenceGraph.addNode({ id: 'TEST-AUTH-E2E', type: 'TEST_EXECUTION', status: 'PASSED' });
evidenceGraph.addNode({ id: 'CLAIM-AUTH-VERIFIED', type: 'CLAIM' });
evidenceGraph.addEdge('REQ-AUTH-001', 'TEST-AUTH-E2E', 'VERIFIED_BY');
evidenceGraph.addEdge('TEST-AUTH-E2E', 'CLAIM-AUTH-VERIFIED', 'PROVES');
const claimCheck = evidenceGraph.verifyClaimIntegrity('CLAIM-AUTH-VERIFIED');
assert.strictEqual(claimCheck.verified, true);
console.log('  [PASS] Evidence Graph Traceability & Claim Integrity Verified');

// 12. اختبار توحيد وتطبيع نتائج أدوات الفحص
console.log('>>> [12/21] Testing Tool Result Normalization Engine...');
const rawSemgrep = { ruleId: 'node.security.injection', level: 'ERROR', file: 'server.js', line: 42, message: 'Potential SQL Injection' };
const normalized = ToolResultNormalizer.normalizeFinding(rawSemgrep, 'SEMGREP');
assert.strictEqual(normalized.severity, 'HIGH');
assert.strictEqual(normalized.source, 'SEMGREP');
assert.strictEqual(normalized.affected_files[0], 'server.js');
console.log('  [PASS] Tool Result Normalizer & Schema Unification Verified');

// 13. اختبار الذاكرة الهندسية وسجل الأنماط
console.log('>>> [13/21] Testing Engineering Memory & Pattern Matching Engine...');
const memory = new EngineeringMemory();
memory.recordMemory('successful_repair_patterns', 'sql_injection_fix', { fix: 'Use Parameterized Query Object', regression_test: 'test_sql_defense.js' });
const match = memory.findSimilarPattern({ category: 'SQL_INJECTION', title: 'SQL Injection detected' });
assert(match.length > 0);
assert.strictEqual(match[0].recommended_fix, 'Use Parameterized Query Object');
console.log('  [PASS] Engineering Memory & Historical Pattern Recall Verified');

// 14. اختبار المعيار القياسي متعدد الـ Stack
console.log('>>> [14/21] Testing Multi-Stack Benchmark Framework...');
const benchmarkResult = BenchmarkFramework.runMultiStackBenchmark();
assert.strictEqual(benchmarkResult.detectionAccuracy, 100);
assert.strictEqual(benchmarkResult.passedFixtures, benchmarkResult.totalFixtures);
console.log('  [PASS] Multi-Stack Benchmark Framework 100% Accuracy Verified');

// 15. اختبار محرك إعادة تخطيط المهام المتكيف
console.log('>>> [15/21] Testing Adaptive Task Replanner...');
const replanner = new TaskReplanner();
const replanDecision = replanner.replanOnFailure({ id: 'task_db_write' }, { error: 'Deadlock on concurrent transaction' });
assert.strictEqual(replanDecision.decision, 'CHANGE_STRATEGY');
assert.strictEqual(replanDecision.newStrategy, 'ATOMIC_MUTEX_LOCK');
console.log('  [PASS] Adaptive Task Replanner Failure Strategy Verified');

// 16. اختبار حوكمة سلسلة التوريد
console.log('>>> [16/21] Testing Supply Chain Posture Engine...');
const supplyChainAudit = SupplyChainEngine.auditSupplyChain({}, {
    'package.json': JSON.stringify({ dependencies: { 'safe-pkg': '1.0.0', 'unsafe-pkg': '*' } })
});
assert(supplyChainAudit.findingsCount > 0);
assert(supplyChainAudit.findings.some(f => f.id === 'SC_UNPINNED_unsafe-pkg'));
assert(supplyChainAudit.sbom && supplyChainAudit.sbom.format === 'CycloneDX-JSON');
console.log('  [PASS] Supply Chain Posture, SBOM & Unpinned Package Detection Verified');

// 17. اختبار سجل تدقيق وكيل الذكاء الاصطناعي
console.log('>>> [17/21] Testing AI Change Record & Agent Audit...');
const agentAuditor = new AgentAuditRecorder();
const record = agentAuditor.recordChange({
    intent: 'Refactor storage adapter to support strict RLS context',
    filesChanged: ['apps/server/db/storage-adapter.js'],
    detectedRisk: 'MEDIUM'
});
assert(record.changeId.startsWith('CHG_'));
assert(record.rollbackPoint.startsWith('checkpoint_'));
console.log('  [PASS] AI Change Record & Rollback Point Generation Verified');

// 18. اختبار مكتبة سيناريوهات الفشل
console.log('>>> [18/21] Testing Failure Scenario Library & Chaos Resilience...');
const scenarios = FailureScenarioLibrary.getScenarios();
assert(scenarios.length >= 4);
assert(scenarios.some(s => s.id === 'SCENARIO_DB_TIMEOUT'));
console.log('  [PASS] Failure Scenario Library Catalog Verified');

// 19. اختبار التحقق المستقل من المشاكل وتمييز الإنذارات الخاطئة
console.log('>>> [19/21] Testing Finding Verifier (False Positive/Negative Engine)...');
const fpCheck = FindingVerifier.verifyFinding(
    { category: 'SQL_INJECTION', rule_id: 'sql_raw' },
    { content: 'async query(table, filter) { return this.tables[table].query(filter); }' }
);
assert.strictEqual(fpCheck.verdict, 'FALSE_POSITIVE');
console.log('  [PASS] Independent Finding Verifier & Anti-Noise Gate Verified');

// 20. اختبار معمارية الإضافات والمحولات ومحول Redis الاختياري
console.log('>>> [20/21] Testing Plugin & Adapter Architecture...');
const pluginManager = new PluginAdapterManager();
pluginManager.registerAdapter('DATABASE', 'custom_pg', { query: async () => [] });
const registered = pluginManager.getAdapter('DATABASE', 'custom_pg');
assert(typeof registered.query === 'function');

// تسجيل واختبار محول Redis الاختياري
const RedisAdapter = require('../../../apps/server/cache/redis-adapter');
const redisInstance = new RedisAdapter({ clientType: 'local-in-memory' });
pluginManager.registerAdapter('CACHE', 'redis_optional', redisInstance, {
    version: '1.0.0',
    capabilities: ['distributed_cache', 'idempotency_locking'],
    status: 'AVAILABLE_OPTIONAL_ADAPTER',
    isOptional: true
});
const optionalAdapters = pluginManager.listRegisteredAdapters({ isOptional: true });
assert.strictEqual(optionalAdapters.length, 1);
assert.strictEqual(optionalAdapters[0].name, 'redis_optional');
assert.strictEqual(optionalAdapters[0].status, 'AVAILABLE_OPTIONAL_ADAPTER');
console.log('  [PASS] Plugin Adapter Architecture & Optional Redis Registration Verified');

// 21. اختبار استخبارات الحوادث والتحليل الجذري
console.log('>>> [21/21] Testing Production Incident Intelligence & Postmortem Engine...');
const incidentEngine = new IncidentIntelligence(memory);
const inc = incidentEngine.createIncident({ title: 'Unexpected Spike in 504 Gateway Timeouts' });
const resolvedInc = incidentEngine.resolveIncident(inc.id, {
    rootCause: 'Connection pool starvation due to unreleased client',
    remediation: 'Implemented automatic connection timeout and release wrapper'
});
assert.strictEqual(resolvedInc.status, 'VERIFIED');
assert(resolvedInc.postmortem.rootCauseAnalysis.includes('Connection pool'));
console.log('  [PASS] Incident Intelligence, Postmortem & Memory Injection Verified');

// 22. اختبارات تصليب P0 الإضافية (CapabilityModel, EvidenceGraph Exports, SARIF Normalizer, Security Memory)
console.log('>>> [22/22] Testing Hardened P0 Systems (CapabilityModel, Exports, SARIF, Security Debt)...');
const { CapabilityModel, CAPABILITY_STATES, CAPABILITY_DIMENSIONS } = require('../index');

// أ. اختبار نموذج القدرات الموحد وفصل الحالات
const capModel = new CapabilityModel(currentStack);
assert.strictEqual(capModel.getCapability('Runtime').state, CAPABILITY_STATES.AVAILABLE);
assert.strictEqual(capModel.getCapability('Database').state, CAPABILITY_STATES.AVAILABLE);
assert.strictEqual(capModel.getCapability('Cache').state, CAPABILITY_STATES.AVAILABLE);
capModel.setCapability('Browser', { state: CAPABILITY_STATES.ENVIRONMENT_LIMITATION, notes: 'Chromium headless missing in local env' });
assert.strictEqual(capModel.getCapability('Browser').state, CAPABILITY_STATES.ENVIRONMENT_LIMITATION);
capModel.setCapability('Queue', { state: CAPABILITY_STATES.NOT_APPLICABLE, isApplicable: false, notes: 'No background queue required' });
assert.strictEqual(capModel.getCapability('Queue').state, CAPABILITY_STATES.NOT_APPLICABLE);
assert(capModel.getApplicableCapabilities().length > 0);
assert(capModel.getNotApplicableCapabilities().length > 0);

// ب. اختبار تصدير رسم الأدلة (JSON, Mermaid, DOT) وتطهير الأسرار
evidenceGraph.addNode({ id: 'NODE-SECRET-01', type: 'CONFIG', command: 'AUTH_SECRET=super_secret_token_12345 npm start' });
const jsonExport = evidenceGraph.exportJson();
assert(typeof jsonExport === 'string');
assert(!jsonExport.includes('super_secret_token_12345'), 'Secrets must be sanitized in EvidenceGraph export');
assert(jsonExport.includes('[REDACTED_SECRET]'));

const mermaidExport = evidenceGraph.exportMermaid();
assert(mermaidExport.startsWith('graph TD\n'));
assert(mermaidExport.includes('NODE_SECRET_01'));

const dotExport = evidenceGraph.exportDot();
assert(dotExport.startsWith('digraph EvidenceGraph {\n'));
assert(dotExport.includes('}'));

// ج. اختبار تطبيع SARIF
const rawSarif = {
    version: '2.1.0',
    runs: [{
        tool: { driver: { name: 'CodeQL', version: '2.15.0' } },
        results: [{
            ruleId: 'js/xss-through-dom',
            level: 'error',
            message: { text: 'DOM-based XSS detected in innerHTML assignment' },
            locations: [{
                physicalLocation: {
                    artifactLocation: { uri: 'apps/client/app.js' },
                    region: { startLine: 104, startColumn: 12 }
                }
            }]
        }]
    }]
};
const normalizedSarif = ToolResultNormalizer.normalizeSarif(rawSarif);
assert.strictEqual(normalizedSarif.length, 1);
assert.strictEqual(normalizedSarif[0].tool, 'CodeQL');
assert.strictEqual(normalizedSarif[0].severity, 'HIGH');
assert.strictEqual(normalizedSarif[0].file, 'apps/client/app.js');
assert.strictEqual(normalizedSarif[0].line, 104);

// د. اختبار تكامل الذاكرة الهندسية والديون الأمنية
const debt = memory.recordSecurityDebt({
    id: 'SEC-DEBT-TEST-01',
    title: 'Weak JWT Secret Key',
    severity: 'HIGH',
    mitigation: 'Migrated to Argon2 and Ed25519 asymmetric keys',
    status: 'MITIGATED'
});
assert.strictEqual(debt.id, 'SEC-DEBT-TEST-01');
const recalledDebt = memory.getSecurityDebt();
assert(recalledDebt.some(d => d.id === 'SEC-DEBT-TEST-01'));
console.log('  [PASS] Hardened P0 Systems (CapabilityModel, Exports, SARIF, Security Debt) Fully Verified');

// 23. اختبارات أنظمة العمليات والذكاء التكيفي P1 (Phase 3 Operations & Adaptive Intelligence)
console.log('>>> [23/23] Testing Phase 3 P1 Subsystems (Replanning Loops, Diff Intel, Scenarios, Tracing)...');

// أ. اختبار حماية الحلقات التكرارية في TaskReplanner وحظر التكرار اللانهائي (Loop Protection)
const replannerLoop = new TaskReplanner({ maxAttempts: 3 });
const failure1 = replannerLoop.replanOnFailure({ id: 'task_loop_test' }, { error: 'SyntaxError: Unexpected token' });
assert.strictEqual(failure1.decision, 'REFINE');
assert.strictEqual(failure1.repairProposal.proposed_change, 'STRICT_TYPE_COMPLIANCE');

const failure2 = replannerLoop.replanOnFailure({ id: 'task_loop_test' }, { error: 'SyntaxError: Unexpected token' });
const failure3 = replannerLoop.replanOnFailure({ id: 'task_loop_test' }, { error: 'SyntaxError: Unexpected token' });
assert.strictEqual(failure3.decision, 'REPLAN_BLOCKED');
assert(failure3.rootCauseHypothesis.includes('حظر المحاولة لمنع حلقة لا نهائية'));

// ب. اختبار تصنيف حالات الفشل العشر
assert.strictEqual(replannerLoop.classifyFailure('Unauthorized access on resource', { category: 'SECURITY' }), 'SECURITY_FAILURE');
assert.strictEqual(replannerLoop.classifyFailure('Missing capability: Playwright browser'), 'CAPABILITY_MISSING');
assert.strictEqual(replannerLoop.classifyFailure('Rule conflict detected between Constitution and Agent'), 'REQUIREMENT_CONFLICT');
assert.strictEqual(replannerLoop.classifyFailure('Connection timeout after 5000ms'), 'PERFORMANCE_FAILURE');

// ج. اختبار ذكاء الفروقات وتصنيف المخاطر وتطهير الأسرار في AgentAuditRecorder
const auditRecorder = new AgentAuditRecorder();
const sampleDiff = `--- a/server.js\n+++ b/server.js\n+ const auth_secret = "super_secret_123";\n+ async function login() { return token; }`;
const auditRecord = auditRecorder.recordChange({
    intent: 'Update authentication middleware with key=secret_jwt_token',
    filesChanged: ['apps/server/auth.js'],
    diff: sampleDiff,
    commands: ['AUTH_KEY=secret_val_456 npm test']
});
assert.strictEqual(auditRecord.risk, 'HIGH');
assert(auditRecord.diff_summary.security_sensitive_changes);
assert(!auditRecord.intent.includes('secret_jwt_token'), 'Secrets must be sanitized in audit intent');
assert(auditRecord.intent.includes('[REDACTED]'));
assert(auditRecord.commands[0].includes('[REDACTED]'));

// د. اختبار كتالوج وتصنيفات مكتبة سيناريوهات الفشل (6 فئات وحقن آمن)
const allScenarios = FailureScenarioLibrary.getScenarios();
assert(allScenarios.length >= 8);
const planningScenarios = FailureScenarioLibrary.getScenarios('PLANNING');
assert(planningScenarios.length >= 2);
const securityScenarios = FailureScenarioLibrary.getScenarios('SECURITY');
assert(securityScenarios.length >= 2);

// هـ. اختبار التحقق المستقل وربطه بالرسم البياني للأدلة
const traceEvidenceGraph = new EvidenceGraph();
const fpResult = FindingVerifier.verifyFinding(
    { id: 'FND_PARAM_SQL', category: 'SQL_INJECTION', rule_id: 'sql_driver' },
    { content: 'const res = await db.query(table, filter);' },
    traceEvidenceGraph
);
assert.strictEqual(fpResult.verdict, 'FALSE_POSITIVE');
assert.strictEqual(fpResult.formalVerdict, 'FALSE_POSITIVE');
assert(traceEvidenceGraph.nodes.has('FND_PARAM_SQL'));

// و. اختبار مسار التتبع الكامل لدورة الفشل والإصلاح (Trace Cycle)
const traceCycle = traceEvidenceGraph.recordRepairCycleTrace({
    failureId: 'FAIL_AUTH_TIMEOUT',
    failure: { description: 'Auth gateway timeout under load' },
    findingId: 'FND_TIMEOUT',
    finding: { category: 'PERFORMANCE_FAILURE' },
    decisionId: 'DEC_ADD_RETRY',
    decision: { selectedStrategy: 'EXPONENTIAL_BACKOFF' },
    repairId: 'REP_BACKOFF_WRAPPER',
    repair: { patch: 'Implemented backoff wrapper in auth.js' },
    testId: 'TEST_AUTH_RETRY',
    testStatus: 'PASSED',
    outcomeId: 'CLAIM_AUTH_RESILIENT',
    outcomeStatus: 'VERIFIED'
});
assert.strictEqual(traceCycle.path.length, 6);
const tracedPath = traceEvidenceGraph.getFailureRepairTrace('FAIL_AUTH_TIMEOUT');
assert.strictEqual(tracedPath.length, 6);

// ز. اختبار تسجيل واسترجاع حالات الفشل المحلولة مع إزالة التكرار في الذاكرة الهندسية
const resolvedFailure = memory.recordResolvedFailure({
    failure_signature: 'PERF_DB_TIMEOUT_01',
    root_cause: 'Connection pool starved',
    repair_strategy: 'Connection timeout with auto-release',
    changed_components: ['apps/server/db/storage-adapter.js'],
    verification_result: 'VERIFIED_100',
    risk: 'MEDIUM'
});
assert.strictEqual(resolvedFailure.id, 'RESOLVED_PERF_DB_TIMEOUT_01');
const duplicateResolved = memory.recordResolvedFailure({
    failure_signature: 'PERF_DB_TIMEOUT_01',
    root_cause: 'Connection pool starved'
});
assert.strictEqual(duplicateResolved.applied_count, 2, 'Duplicate resolved failures must increment applied count');

console.log('  [PASS] All Phase 3 P1 Subsystems (Replanning, Diff, Scenarios, Tracing, Memory) Fully Verified');

console.log('======================================================');
console.log('>>> [SUCCESS] All Master Evolution P0 & P1 Subsystems PASSED with 100% Evidence.');
console.log('======================================================');


