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

const realFile = AntiHallucinationGuard.verifyFileExistence('WEBFORGE_CONSTITUTION.md', path.resolve(__dirname, '../../..'));
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
    'package.json': JSON.stringify({ dependencies: { 'safe-pkg': '^1.0.0', 'unsafe-pkg': '*' } })
});
assert(supplyChainAudit.findingsCount > 0);
assert.strictEqual(supplyChainAudit.findings[0].id, 'SC_UNPINNED_unsafe-pkg');
console.log('  [PASS] Supply Chain Posture & Unpinned Package Detection Verified');

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

// 20. اختبار معمارية الإضافات والمحولات
console.log('>>> [20/21] Testing Plugin & Adapter Architecture...');
const pluginManager = new PluginAdapterManager();
pluginManager.registerAdapter('DATABASE', 'custom_pg', { query: async () => [] });
const registered = pluginManager.getAdapter('DATABASE', 'custom_pg');
assert(typeof registered.query === 'function');
console.log('  [PASS] Plugin Adapter Architecture Contract Verification Verified');

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

console.log('======================================================');
console.log('>>> [SUCCESS] All 21 Master Evolution Subsystems PASSED with 100% Evidence.');
console.log('======================================================');
