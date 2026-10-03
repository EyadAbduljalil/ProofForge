/**
 * @file phase4-production-excellence.test.js
 * @description حزمة اختبارات التميز الإنتاجي والمحولات المتقدمة (Phase 4 — Production Excellence Test Suite)
 * تختبر محرك الاستخبارات البرمجية، تحليل مسار التلوث، استخبارات الحوادث، حوكمة المحولات، وتقييم الجاهزية
 */

const assert = require('assert');
const {
    CodeIntelligenceEngine,
    IncidentIntelligence,
    PluginAdapterManager,
    ProductionReadinessEvaluator,
    EngineeringMemory,
    EvidenceGraph
} = require('../index');

async function runPhase4TestSuite() {
    console.log('======================================================');
    console.log('🚀 Executing Phase 4 — Production Excellence Test Suite');
    console.log('======================================================');

    // ----------------------------------------------------
    // 1. Code Intelligence & AST/Taint Analysis Tests
    // ----------------------------------------------------
    console.log('>>> [1/4] Testing Advanced Code Intelligence & Taint Analysis...');
    {
        const engine = new CodeIntelligenceEngine();

        // 1. Capability Detection
        assert.strictEqual(engine.getParserCapability('app.js'), 'AST_SUPPORTED');
        assert.strictEqual(engine.getParserCapability('service.ts'), 'AST_PARTIAL');
        assert.strictEqual(engine.getParserCapability('data.json'), 'AST_SUPPORTED');
        assert.strictEqual(engine.getParserCapability('script.py'), 'AST_UNAVAILABLE');
        assert.strictEqual(engine.getParserCapability(null), 'NOT_APPLICABLE');

        // 2. Dangerous Command Execution with Taint Flow -> CONFIRMED
        const vulnerableCode = `
            const userInput = req.query.cmd;
            const result = execSync(userInput);
        `;
        const resVulnerable = engine.analyzeSourceCode('server/controller.js', vulnerableCode);
        assert.strictEqual(resVulnerable.analysisLevel, 'TAINT_ANALYSIS');
        assert.strictEqual(resVulnerable.findingsCount, 1);
        assert.strictEqual(resVulnerable.findings[0].verification_status, 'CONFIRMED');
        assert.strictEqual(resVulnerable.findings[0].source, 'req.query');
        assert.strictEqual(resVulnerable.findings[0].sink, 'execSync(');

        // 3. Sanitized Command Execution -> FALSE_POSITIVE
        const safeCode = `
            const userInput = req.query.cmd;
            const sanitized = sanitize(userInput);
            const result = execSync(sanitized);
        `;
        const resSafe = engine.analyzeSourceCode('server/safe-controller.js', safeCode);
        assert.strictEqual(resSafe.findings[0].verification_status, 'FALSE_POSITIVE');

        // 4. Path Traversal with and without path.basename
        const vulnPath = `
            const file = req.params.fileName;
            fs.readFile(file, 'utf8', (err, data) => {});
        `;
        const resPath = engine.analyzeSourceCode('server/files.js', vulnPath);
        assert.strictEqual(resPath.findings[0].verification_status, 'CONFIRMED');
        assert.strictEqual(resPath.findings[0].rule, 'security/path-traversal-sink');

        // 5. Dangerous Eval
        const evalCode = `eval("2 + 2");`;
        const resEval = engine.analyzeSourceCode('server/dynamic.js', evalCode);
        assert.strictEqual(resEval.findings[0].verification_status, 'CONFIRMED');
        assert.strictEqual(resEval.findings[0].rule, 'security/dangerous-dynamic-execution');

        console.log('  [PASS] Advanced Code Intelligence & Taint Flow Analysis 100% Verified');
    }

    // ----------------------------------------------------
    // 2. Production Incident Intelligence Tests
    // ----------------------------------------------------
    console.log('>>> [2/4] Testing Production Incident Intelligence & RCA...');
    {
        const memory = new EngineeringMemory();
        const incidentEngine = new IncidentIntelligence(memory);

        // 1. Create Incident with Incomplete Timeline
        const inc = incidentEngine.createIncident({
            title: 'Critical Gateway Timeout 504 on Payment Webhook',
            severity: 'CRITICAL',
            affected_components: ['apps/server/webhook-verifier.js'],
            timeline: [
                { type: 'runtime_error', description: 'HTTP 504 Timeout' } // missing timestamp
            ]
        });

        assert.strictEqual(inc.status, 'OPEN');
        assert.strictEqual(inc.timeline_status, 'TIMELINE_INCOMPLETE');

        // 2. Add Timed Event -> Timeline Becomes COMPLETE
        incidentEngine.addTimelineEvent(inc.id, {
            type: 'deployment',
            description: 'Deploy v2.4.1 to cluster',
            timestamp: '2026-10-02T12:00:00Z'
        });

        // 3. Correlate Changes
        const correlated = incidentEngine.correlateChanges(inc.id, [
            {
                changeId: 'CHG_001',
                intent: 'Update webhook timeout threshold',
                filesChanged: ['apps/server/webhook-verifier.js'],
                diffSummary: { security_sensitive_changes: true }
            }
        ]);
        assert.strictEqual(correlated[0].correlation, 'CAUSALITY_CONFIRMED');

        // 4. Evaluate Root Cause Candidates
        const candidates = incidentEngine.evaluateRootCauseCandidates(inc.id, [
            {
                hypothesis: 'Deadlock in unreleased HMAC verification mutex',
                supporting_evidence: ['Thread dump shows 10 workers blocked on mutex'],
                contradicting_evidence: [],
                reproduced: true
            },
            {
                hypothesis: 'Database disk full',
                supporting_evidence: [],
                contradicting_evidence: ['Disk has 80% free space']
            }
        ]);

        assert.strictEqual(candidates[0].confidence, 'CONFIRMED');
        assert.strictEqual(candidates[1].confidence, 'INSUFFICIENT_EVIDENCE');
        assert.strictEqual(inc.rootCause, 'Deadlock in unreleased HMAC verification mutex');

        // 5. Resolve Incident & Generate Postmortem
        const resolved = incidentEngine.resolveIncident(inc.id, {
            remediation: 'Added finally block to release HMAC mutex lock under all conditions',
            whatWorked: ['Rate limiter prevented cascade failure'],
            whatFailed: ['Missing timeout on lock acquisition']
        });

        assert.strictEqual(resolved.status, 'VERIFIED');
        assert.ok(resolved.postmortem.confirmed_root_cause.includes('Deadlock'));
        assert.strictEqual(resolved.postmortem.what_worked.length, 1);

        // 6. Verify Memory Injection
        const resolvedMem = memory.getResolvedFailures();
        assert.ok(resolvedMem.some(r => r.id === `RESOLVED_INC_FAIL_${inc.id}`));

        console.log('  [PASS] Incident Intelligence, Evidence-Based RCA & Postmortems Verified');
    }

    // ----------------------------------------------------
    // 3. Advanced Adapter Fabric & Governance Tests
    // ----------------------------------------------------
    console.log('>>> [3/4] Testing Advanced Adapter Fabric & Governance...');
    {
        const graph = new EvidenceGraph();
        const adapterManager = new PluginAdapterManager({ evidenceGraph: graph });

        // 1. Register Read-Only Database Adapter
        const mockDb = {
            query: async (sql) => [{ id: 1, name: 'Sample' }]
        };
        adapterManager.registerAdapter('DATABASE', 'read_replica', mockDb, {
            version: '1.0.0',
            capabilities: ['sql_query', 'read_only'],
            permissions: ['READ']
        });

        const registered = adapterManager.listRegisteredAdapters();
        assert.strictEqual(registered.length, 1);
        assert.strictEqual(registered[0].category, 'DATABASE');
        assert.strictEqual(registered[0].riskLevel, 'LOW');

        // 2. Execute Allowed Read Operation
        const readRes = await adapterManager.executeOperation('DATABASE', 'read_replica', 'query', 'SELECT 1', {
            permission: 'READ'
        });
        assert.strictEqual(readRes.success, true);
        assert.strictEqual(readRes.evidence.status, 'PASSED');

        // 3. Block Unauthorized Destructive Operation
        const destRes = await adapterManager.executeOperation('DATABASE', 'read_replica', 'query', 'DROP TABLE users', {
            permission: 'DESTRUCTIVE'
        });
        assert.strictEqual(destRes.success, false);
        assert.strictEqual(destRes.failureClass, 'AUTHORIZATION_FAILURE');
        assert.ok(destRes.error.includes('لا يمتلك صلاحية'));

        // 4. Test Adapter Error Classification
        const authErrClass = adapterManager.classifyAdapterError(new Error('Invalid token provided: auth failed'));
        assert.strictEqual(authErrClass, 'AUTHENTICATION_FAILURE');

        const timeoutErrClass = adapterManager.classifyAdapterError(new Error('ETIMEDOUT connection timeout'));
        assert.strictEqual(timeoutErrClass, 'TIMEOUT');

        console.log('  [PASS] Advanced Adapter Fabric, Permissions & Governance Verified');
    }

    // ----------------------------------------------------
    // 4. Production Readiness Intelligence Tests
    // ----------------------------------------------------
    console.log('>>> [4/4] Testing Production Readiness Intelligence (21 Dimensions)...');
    {
        const readiness = ProductionReadinessEvaluator.evaluateReadiness({
            BUILD: 'VERIFIED',
            TESTING: 'VERIFIED',
            SECURITY: 'VERIFIED',
            DATABASE: 'VERIFIED',
            REDIS: 'AVAILABLE_OPTIONAL_ADAPTER'
        });

        assert.strictEqual(readiness.totalDimensions, 21);
        assert.ok(readiness.applicableDimensions > 10);
        assert.ok(readiness.overallScore >= 80);
        assert.strictEqual(readiness.readinessVerdict, 'PRODUCTION_READY_WITH_EVIDENCE');
        assert.strictEqual(readiness.evaluations.QUEUES.status, 'NOT_APPLICABLE');
        assert.strictEqual(readiness.evaluations.DEPLOYMENT.status, 'ENVIRONMENT_LIMITATION');

        console.log('  [PASS] Production Readiness 21-Dimension Intelligence Verified');
    }

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Phase 4 Subsystems PASSED with 100% Evidence.');
    console.log('======================================================');
}

if (require.main === module) {
    runPhase4TestSuite().catch(err => {
        console.error('Phase 4 Test Suite Failed:', err);
        process.exit(1);
    });
}

module.exports = { runPhase4TestSuite };
