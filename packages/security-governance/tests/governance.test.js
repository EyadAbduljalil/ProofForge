/**
 * @file governance.test.js
 * @description حزمة الاختبارات الآلية الشاملة لأنظمة الذكاء الأمني والحوكمة لنظام WebForge OS
 */

const assert = require('assert');
const path = require('path');
const {
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
} = require('../index');

async function runGovernanceTests() {
    console.log('======================================================');
    console.log('🛡️ WebForge OS — Security Intelligence & Governance Tests');
    console.log('======================================================');

    // 1. اختبار توصيف المشروع والتفعيل السياقي
    console.log('>>> [1/14] Testing Project Security Profiler & Context-Aware Activation...');
    const profile = ProjectSecurityProfiler.profileProject(path.resolve(__dirname, '../../..'));
    assert(profile.project.name, 'Project name should be detected');
    assert(profile.capabilities.authentication, 'Authentication should be detected');
    assert(profile.activeSecurityControls.length > 0, 'Contextual security controls should be activated');
    console.log('  [PASS] Project Profiling & Context Controls Verified');

    // 2. اختبار محرك نمذجة التهديدات وحدود الثقة
    console.log('>>> [2/14] Testing Threat Modeling & Trust Boundaries Engine...');
    const threatModel = ThreatModelingEngine.generateThreatModel(profile);
    assert(threatModel.assets.length > 0, 'Assets must be identified');
    assert(threatModel.actors.length > 0, 'Actors must be identified');
    assert(threatModel.trustBoundaries.length > 0, 'Trust boundaries must be identified');
    assert(threatModel.threats.some(t => t.cwe === 'CWE-918'), 'SSRF threat should be mapped');
    console.log('  [PASS] Threat Modeling & Trust Boundaries Verified');

    // 3. اختبار محرك تقييم المخاطر متعدد الأبعاد
    console.log('>>> [3/14] Testing Multi-Factor Risk Assessment Engine...');
    const criticalRisk = RiskAssessmentEngine.evaluateRisk({
        impact: 'CRITICAL',
        exploitability: 'HIGH',
        exposure: 'PUBLIC_INTERNET',
        authRequired: false,
        tenantImpact: 'CROSS_TENANT'
    });
    assert.strictEqual(criticalRisk.level, 'CRITICAL', 'Should classify as CRITICAL');
    assert.strictEqual(criticalRisk.isBlocker, true, 'Should mark as release blocker');
    assert.strictEqual(criticalRisk.qualityGateAction, 'BLOCK_RELEASE');
    console.log('  [PASS] Risk Engine Evaluation & Blocker Gate Verified');

    // 4. اختبار مصفوفة الضوابط وتتبع الفعالية
    console.log('>>> [4/14] Testing Security Control Matrix & Effectiveness Auditor...');
    const matrix = new SecurityControlMatrix();
    const matrixAudit = matrix.auditControlEffectiveness(path.resolve(__dirname, '../../..'));
    assert(matrixAudit.totalControls > 0, 'Controls must exist');
    assert.strictEqual(matrixAudit.failed, 0, 'No control should fail existence check');
    assert(matrixAudit.verified > 0, 'Controls must be verified against actual code and test files');
    console.log('  [PASS] Control Matrix Effectiveness & Evidence Verified');

    // 5. اختبار جرد مساحة الهجوم والانكشاف
    console.log('>>> [5/14] Testing Attack Surface Inventory & Exposure Discovery...');
    const surfaceReport = AttackSurfaceInventory.discoverAttackSurface(path.resolve(__dirname, '../../..'));
    assert(surfaceReport.totalSurfaces > 0, 'Attack surfaces must be discovered');
    assert(surfaceReport.criticalSurfaces > 0, 'Critical surfaces must be flagged');
    assert(surfaceReport.surfaces.every(s => s.risk && s.status), 'Every surface must have risk and status');
    console.log('  [PASS] Attack Surface Inventory & Protection Status Verified');

    // 6. اختبار تحليل أثر التغييرات واختبارات التراجع
    console.log('>>> [6/14] Testing Change Impact & Targeted Regression Scope...');
    const impactAnalyzer = new ChangeImpactAnalyzer();
    const impactResult = impactAnalyzer.analyzeImpact(['packages/security/token-manager.js', 'packages/security/ssrf-guard.js']);
    assert(impactResult.affectedControls.includes('SEC-CTRL-01'), 'Should detect token control impact');
    assert(impactResult.affectedControls.includes('SEC-CTRL-03'), 'Should detect SSRF control impact');
    assert(impactResult.targetedRegressionSuite.length >= 2, 'Should target specific test suites');
    console.log('  [PASS] Change Impact Blast Radius & Regression Targeting Verified');

    // 7. اختبار أمان سلسلة التوريد وتوليد SBOM
    console.log('>>> [7/14] Testing Supply Chain Security & SBOM Generation...');
    const supplyChainReport = SupplyChainGuard.auditSupplyChain(path.resolve(__dirname, '../../..'));
    assert(supplyChainReport.sbom.components.length >= 0, 'SBOM components structure must be present');
    assert.strictEqual(supplyChainReport.sbom.format, 'CycloneDX-JSON');
    console.log('  [PASS] Supply Chain Guard & CycloneDX SBOM Verified');

    // 8. اختبار أمان الحاويات وأنابيب CI/CD
    console.log('>>> [8/14] Testing Pipeline & Infrastructure Security Guard...');
    const infraAudit = PipelineInfraGuard.auditInfrastructure(path.resolve(__dirname, '../../..'));
    assert(infraAudit.containerSecurity.checks.length > 0, 'Container checks must be performed');
    assert(infraAudit.containerSecurity.checks.some(c => c.rule === 'NON_ROOT_USER' && c.passed), 'Non-root user in Dockerfile must pass');
    console.log('  [PASS] Infrastructure Non-Root & CI/CD Pipeline Checks Verified');

    // 9. اختبار حماية الخصوصية وتطهير PII والأسرار
    console.log('>>> [9/14] Testing Privacy, PII Scrubbing & Response DTO Guard...');
    const privacyGuard = new PrivacyDataFlowGuard();
    const rawLeakData = {
        user: 'johndoe',
        password: 'UnsafePassword!',
        emailText: 'Reach me at secret@enterprise.com with key sk_live_1234567890123456'
    };
    const scrubbed = privacyGuard.sanitizeAndAudit(rawLeakData);
    assert(scrubbed.hasLeakage, 'Should detect leakage');
    assert.strictEqual(scrubbed.sanitizedData.password, '[REDACTED_SECRET]');
    assert(scrubbed.sanitizedData.emailText.includes('[REDACTED_EMAIL]'));
    assert(scrubbed.sanitizedData.emailText.includes('[REDACTED_API_KEY]'));

    const cleanDto = privacyGuard.enforceResponseDTO({ id: 1, name: 'Alice', secret_hash: '123' }, ['id', 'name']);
    assert.deepStrictEqual(cleanDto, { id: 1, name: 'Alice' }, 'DTO must strip unauthorized columns');
    console.log('  [PASS] Privacy Scrubbing & Response DTO Enforcement Verified');

    // 10. اختبار حوكمة الذكاء الاصطناعي وبوابة الموافقة البشرية
    console.log('>>> [10/14] Testing AI Agent Tool Governance, Human Gate & RAG Isolation...');
    const aiGov = new AIAgentGovernanceEngine();
    const normalTool = aiGov.evaluateToolInvocation({ toolName: 'search_knowledge_base', userRole: 'user' });
    assert.strictEqual(normalTool.allowed, true);

    const highRiskTool = aiGov.evaluateToolInvocation({ toolName: 'issue_financial_refund', userRole: 'admin', approvedByHuman: false });
    assert.strictEqual(highRiskTool.allowed, false);
    assert.strictEqual(highRiskTool.requiresApproval, true);
    assert(highRiskTool.requestId, 'Must generate approval request ID');

    const ragDocs = [
        { id: 1, tenantId: 'tenant-A', text: 'Financial report tenant A' },
        { id: 2, tenantId: 'tenant-B', text: 'Confidential project tenant B' }
    ];
    const filteredDocs = aiGov.filterRAGContextForTenant(ragDocs, 'tenant-A');
    assert.strictEqual(filteredDocs.length, 1);
    assert.strictEqual(filteredDocs[0].tenantId, 'tenant-A');
    console.log('  [PASS] AI Tool Governance, Human Approval Gate & RAG Isolation Verified');

    // 11. اختبار محرك رصد الاحتيال وسوء الاستخدام متعدد الأبعاد
    console.log('>>> [11/14] Testing Multi-Dimensional Abuse & Fraud Velocity Engine...');
    const fraudEngine = new AbuseFraudEngine();
    for (let i = 0; i < 5; i++) {
        const res = fraudEngine.evaluateEvent({ actionType: 'LOGIN_BURST', ipAddress: '198.51.100.1' });
        assert.strictEqual(res.allowed, true);
    }
    const blockedBurst = fraudEngine.evaluateEvent({ actionType: 'LOGIN_BURST', ipAddress: '198.51.100.1' });
    assert.strictEqual(blockedBurst.allowed, false);
    assert.strictEqual(blockedBurst.action, 'BLOCK_AND_ALERT');
    console.log('  [PASS] Multi-Dimensional Abuse & Velocity Limiter Verified');

    // 12. اختبار سجل الذاكرة الأمنية والديون الفنية
    console.log('>>> [12/14] Testing Security Memory & Technical Debt Ledger...');
    const memoryLedger = new SecurityMemoryLedger();
    memoryLedger.logSecurityEvent({
        eventType: 'AUTH_FAILURE_BURST',
        severity: 'HIGH',
        actor: '198.51.100.1',
        details: { reason: 'Brute force blocked' }
    });
    const ledgerData = memoryLedger.getGovernanceLedger();
    assert(ledgerData.totalIncidentsResolved > 0, 'Incident memory must contain documented resolutions');
    assert(ledgerData.totalActiveDebt > 0, 'Security debt must be recorded transparently');
    assert(ledgerData.recentAuditEvents.length > 0, 'Audit event must be registered');
    console.log('  [PASS] Security Memory & Debt Ledger Verified');

    // 13. اختبار فحص الملاءمة المعمارية والإعدادات الافتراضية الآمنة
    console.log('>>> [13/14] Testing Architecture Security Fitness & Secure Defaults...');
    const fitnessReport = ArchitectureFitnessGuard.checkFitness(path.resolve(__dirname, '../../..'));
    assert.strictEqual(fitnessReport.status, 'FIT', 'Architecture must satisfy fitness invariants');
    assert(fitnessReport.secureDefaultsChecked.every(c => c.compliant), 'All secure defaults must be compliant');
    console.log('  [PASS] Architecture Fitness & Secure Defaults Invariants Verified');

    // 14. اختبار معايير الفحص الأمني والنماذج الهجومية
    console.log('>>> [14/14] Testing Security Benchmark with Attack Fixtures...');
    const benchmarkResult = await SecurityBenchmark.runBenchmark();
    assert.strictEqual(benchmarkResult.detected, 8, 'All 8 benchmark attack fixtures must be detected');
    assert.strictEqual(benchmarkResult.blocked, 8, 'All 8 benchmark attack fixtures must be blocked');
    assert.strictEqual(benchmarkResult.benchmarkScore, 100, 'Benchmark score must be 100%');
    console.log('  [PASS] Security Benchmark 100% Detection & Defense Verified');

    console.log('======================================================');
    console.log('>>> [SUCCESS] All 14 Security Governance Subsystems PASSED with 100% Evidence.');
    console.log('======================================================');
}

if (require.main === module) {
    runGovernanceTests().catch(err => {
        console.error('>>> [FAIL] Governance tests encountered an error:', err);
        process.exit(1);
    });
}

module.exports = runGovernanceTests;
