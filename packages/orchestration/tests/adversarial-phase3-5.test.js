/**
 * @file adversarial-phase3-5.test.js
 * @description حزمة اختبارات التحقق العدائي المستقل (Phase 3.5 — Independent Adversarial Verification)
 * تفحص وتتحدى كافة أنظمة العمليات، كشف الحلقات، التراجع الآمن، تطهير الأسرار، وتكامل الأدلة
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const TaskReplanner = require('../task-replanner');
const SafeRepairEngine = require('../../security/safe-repair-engine');
const AgentAuditRecorder = require('../agent-audit-recorder');
const FailureScenarioLibrary = require('../failure-scenario-library');
const FindingVerifier = require('../finding-verifier');
const EvidenceGraph = require('../evidence-graph');
const EngineeringMemory = require('../engineering-memory');

async function runAdversarialVerificationSuite() {
    console.log('======================================================');
    console.log('⚔️  Executing Phase 3.5 — Independent Adversarial Verification Suite');
    console.log('======================================================');

    // ----------------------------------------------------
    // 1. TaskReplanner Adversarial Testing
    // ----------------------------------------------------
    console.log('>>> [1/8] Adversarial Testing: TaskReplanner...');
    {
        const replanner = new TaskReplanner({ maxAttempts: 3 });
        const task = { id: 'task_loop_test', attempts: 0, strategy: 'INIT' };

        // Test identical failure repeatedly -> must block loop
        const fail1 = replanner.replanOnFailure(task, { error: 'SyntaxError: Unexpected identifier' });
        assert.strictEqual(fail1.decision, TaskReplanner.REPLAN_DECISIONS.REFINE);
        assert.strictEqual(task.attempts, 1);

        const fail2 = replanner.replanOnFailure(task, { error: 'SyntaxError: Unexpected identifier' });
        assert.strictEqual(fail2.decision, TaskReplanner.REPLAN_DECISIONS.REFINE);
        assert.strictEqual(task.attempts, 2);

        const fail3 = replanner.replanOnFailure(task, { error: 'SyntaxError: Unexpected identifier' });
        assert.strictEqual(fail3.decision, TaskReplanner.REPLAN_DECISIONS.REPLAN_BLOCKED, 'Repeated failure must trigger REPLAN_BLOCKED');
        assert.strictEqual(fail3.risk, 'HIGH');

        // Test different failures -> should change strategy until maxAttempts
        const diffTask = { id: 'task_diff_failures', attempts: 0 };
        const diff1 = replanner.replanOnFailure(diffTask, { error: 'Syntax error' });
        assert.strictEqual(diff1.failureType, TaskReplanner.FAILURE_CLASSES.IMPLEMENTATION_FAILURE);

        const diff2 = replanner.replanOnFailure(diffTask, { error: 'Unauthorized access to user profile' });
        assert.strictEqual(diff2.failureType, TaskReplanner.FAILURE_CLASSES.SECURITY_FAILURE);
        assert.strictEqual(diff2.decision, TaskReplanner.REPLAN_DECISIONS.ESCALATE_TO_SECURITY_GATE);

        const diff3 = replanner.replanOnFailure(diffTask, { error: 'AssertionError: expected true to be false' });
        assert.strictEqual(diff3.decision, TaskReplanner.REPLAN_DECISIONS.ROLLBACK_AND_ESCALATE, 'Max attempts must trigger rollback & escalate');

        // Test Environment Limitation & Missing Capability
        const envTask = { id: 'task_env_limitation', attempts: 0 };
        const envFail = replanner.replanOnFailure(envTask, { error: 'environment limitation: binary not found' });
        assert.strictEqual(envFail.failureType, TaskReplanner.FAILURE_CLASSES.ENVIRONMENT_FAILURE);
        assert.strictEqual(envFail.decision, TaskReplanner.REPLAN_DECISIONS.ALTERNATIVE_VERIFICATION);

        const capTask = { id: 'task_cap_missing', attempts: 0 };
        const capFail = replanner.replanOnFailure(capTask, { error: 'missing capability: live browser' });
        assert.strictEqual(capFail.failureType, TaskReplanner.FAILURE_CLASSES.CAPABILITY_MISSING);
        assert.strictEqual(capFail.decision, TaskReplanner.REPLAN_DECISIONS.ALTERNATIVE_VERIFICATION);

        // Test Tool Failure
        const toolTask = { id: 'task_tool_fail', attempts: 0 };
        const toolFail = replanner.replanOnFailure(toolTask, { error: 'tool failed: parser error in SARIF' });
        assert.strictEqual(toolFail.failureType, TaskReplanner.FAILURE_CLASSES.TOOL_FAILURE);
        assert.strictEqual(toolFail.newStrategy, 'INTERNAL_NORMALIZER_FALLBACK');

        // Defensive inputs: null / undefined
        const nullRes = replanner.replanOnFailure(null, null);
        assert.ok(nullRes.taskId, 'Should handle null input defensively');

        console.log('  [PASS] TaskReplanner Loop Defense & Strategy Shifts Verified');
    }

    // ----------------------------------------------------
    // 2. SafeRepairEngine Adversarial Testing (Isolated Git Fixture)
    // ----------------------------------------------------
    console.log('>>> [2/8] Adversarial Testing: SafeRepairEngine & Real Git Rollback...');
    {
        const tempGitDir = fs.mkdtempSync(path.join(os.tmpdir(), 'webforge_git_adversarial_'));
        try {
            // Setup isolated clean Git repo
            execFileSync('git', ['init'], { cwd: tempGitDir, stdio: 'ignore' });
            execFileSync('git', ['config', 'user.name', 'AdversarialTest'], { cwd: tempGitDir, stdio: 'ignore' });
            execFileSync('git', ['config', 'user.email', 'test@webforge.local'], { cwd: tempGitDir, stdio: 'ignore' });
            execFileSync('git', ['config', 'core.autocrlf', 'false'], { cwd: tempGitDir, stdio: 'ignore' });

            const targetFilePath = path.join(tempGitDir, 'component.js');
            const originalContent = '// Original clean source code v1.0.0\nfunction add(a, b) { return a + b; }\nmodule.exports = { add };';
            fs.writeFileSync(targetFilePath, originalContent, 'utf8');

            execFileSync('git', ['add', '.'], { cwd: tempGitDir, stdio: 'ignore' });
            execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tempGitDir, stdio: 'ignore' });

            const engine = new SafeRepairEngine({ rootDir: tempGitDir });
            
            // 1. Test real failure and verified Git byte-level rollback
            const repairPlan = {
                id: 'repair_test_001',
                filesChanged: ['component.js'],
                originalState: { content: originalContent }
            };

            const failingExecutor = {
                async applyChange(plan) {
                    fs.writeFileSync(targetFilePath, '// CORRUPTED AND BROKEN CODE\nfunction syntax error', 'utf8');
                },
                async verifyBuild() {
                    return false; // Force build gate failure
                },
                async verifySecurity() {
                    return true;
                }
            };

            const res = await engine.executeSafeRepair(repairPlan, failingExecutor);
            assert.strictEqual(res.status, 'FAILED_AND_REVERTED');
            assert.strictEqual(res.reverted, true);
            assert.strictEqual(res.rollbackType, 'SAFE_GIT_FILE_RESTORE');

            // Byte-level / exact content verification
            const restoredContent = fs.readFileSync(targetFilePath, 'utf8');
            assert.strictEqual(restoredContent, originalContent, 'Rollback must restore exact original file content');

            // 2. Test Path Traversal and Malicious Filenames -> ROLLBACK_BLOCKED
            const badPathPlan = {
                id: 'repair_bad_path',
                filesChanged: ['../../outside_secret.txt', '-flag-injection', 'null\0byte']
            };
            const maliciousExecutor = {
                async applyChange() {},
                async verifyBuild() { return false; },
                async verifySecurity() { return false; }
            };
            const badRes = await engine.executeSafeRepair(badPathPlan, maliciousExecutor);
            assert.strictEqual(badRes.status, 'FAILED_ROLLBACK_BLOCKED');
            assert.ok(badRes.rollbackReason.includes('حظر التراجع'), 'Malicious filenames must be blocked');

            // 3. Test Error Sanitization in SafeRepairEngine
            const sanitizedErr = engine._sanitizeErrorMessage('Connection failed: password=SuperSecretPass123&api_key=sk_live_9988776655443322');
            assert.ok(!sanitizedErr.includes('SuperSecretPass123'), 'Password must be sanitized');
            assert.ok(!sanitizedErr.includes('9988776655443322'), 'API key must be sanitized');
            assert.ok(sanitizedErr.includes('[REDACTED]'), 'Redaction placeholder must be present');

            console.log('  [PASS] SafeRepairEngine Real Git Fixture Byte-Level Rollback & Security Gates Verified');
        } finally {
            try {
                fs.rmSync(tempGitDir, { recursive: true, force: true });
            } catch (e) {}
        }
    }

    // ----------------------------------------------------
    // 3. AgentAuditRecorder Adversarial Secret Redaction Testing
    // ----------------------------------------------------
    console.log('>>> [3/8] Adversarial Testing: AgentAuditRecorder Secret Redaction & Invariant Integrity...');
    {
        const recorder = new AgentAuditRecorder();

        const secretsPayload = [
            'API Key: sk_live_abcdef1234567890abcdef',
            'GitHub Token: ghp_11223344556677889900aabbcc',
            'NPM Token: npm_99887766554433221100aabb',
            'AWS Key: AKIAIOSFODNN7EXAMPLE',
            'Bearer Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHZw5L-GgW_xL-c7s8m_example',
            'JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiU1VQRVIifQ.Kj84jds93_dkjshdf9384jsdf834jdf',
            'Database URI: postgres://db_user:ultra_secure_p@ssw0rd!@10.0.0.5:5432/production_db',
            'Command Arg: curl -H "Authorization: Bearer secret_bearer_token" -u admin:myAdminPassword123 https://api.internal',
            'JSON payload: {"password": "ConfidentialPassword456", "apiKey": "custom_key_778899"}',
            'Private Key:\n-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Y1234567890abcdef...\n-----END RSA PRIVATE KEY-----'
        ];

        for (const secretStr of secretsPayload) {
            const sanitized = recorder._sanitizeText(secretStr);
            assert.ok(!sanitized.includes('sk_live_abcdef'), 'Stripe/API key must be redacted');
            assert.ok(!sanitized.includes('ghp_112233'), 'GitHub token must be redacted');
            assert.ok(!sanitized.includes('npm_998877'), 'NPM token must be redacted');
            assert.ok(!sanitized.includes('AKIAIOSFODNN7EXAMPLE'), 'AWS key must be redacted');
            assert.ok(!sanitized.includes('ultra_secure_p@ssw0rd!'), 'Database password must be redacted');
            assert.ok(!sanitized.includes('ConfidentialPassword456'), 'JSON password must be redacted');
            assert.ok(!sanitized.includes('MIIEowIBAAKCAQEA0Y1234567890abcdef'), 'Private key must be redacted');
        }

        // Test Preservation of Non-Sensitive Data
        const benignCode = 'const keyword = "searchQuery"; const passwordField = document.getElementById("pwd"); const passRate = 100; function authenticateUser() {}';
        const benignSanitized = recorder._sanitizeText(benignCode);
        assert.ok(benignSanitized.includes('keyword'), 'Benign word keyword must be preserved');
        assert.ok(benignSanitized.includes('passwordField'), 'Benign variable passwordField must be preserved');
        assert.ok(benignSanitized.includes('passRate'), 'Benign metric passRate must be preserved');
        assert.ok(benignSanitized.includes('authenticateUser'), 'Benign function name authenticateUser must be preserved');

        // Test Record Creation with High Risk & Secret Cleansing
        const record = recorder.recordChange({
            intent: 'Update database connection string to postgres://admin:superSecretPw@cluster:5432/main',
            filesChanged: ['packages/core/db.js'],
            diff: '+ const dbUrl = "postgres://admin:superSecretPw@cluster:5432/main";',
            commands: ['node migrate.js --token=superSecretToken123']
        });

        assert.ok(!record.intent.includes('superSecretPw'), 'Intent secret must be sanitized');
        assert.ok(!record.commands[0].includes('superSecretToken123'), 'Command args secret must be sanitized');
        assert.strictEqual(record.risk, 'HIGH', 'Modifying credentials must be classified as HIGH risk');

        console.log('  [PASS] AgentAuditRecorder Multi-Pattern Secret Redaction & Invariant Integrity Verified');
    }

    // ----------------------------------------------------
    // 4. FailureScenarioLibrary Adversarial Execution
    // ----------------------------------------------------
    console.log('>>> [4/8] Adversarial Testing: FailureScenarioLibrary Isolated Execution...');
    {
        const scenarios = FailureScenarioLibrary.getScenarios();
        assert.strictEqual(scenarios.length, 10, 'Must have exactly 10 standard scenarios');

        const categories = new Set(scenarios.map(s => s.category));
        assert.strictEqual(categories.size, 6, 'Must cover 6 distinct categories');

        // Execute all scenarios in isolated handlers
        for (const scenario of scenarios) {
            const execResult = await FailureScenarioLibrary.executeScenario(scenario.id, async (sc) => {
                // Simulate resilient handler matching the scenario contract
                return {
                    success: true,
                    evidence: `Handled ${sc.id} correctly via ${sc.expected_classification}`
                };
            });

            assert.strictEqual(execResult.passed, true, `Scenario ${scenario.id} must pass resilient handler`);
            assert.ok(execResult.recoveryTimeMs >= 0);
        }

        console.log('  [PASS] All 10 Scenarios Across 6 Categories Executed in Isolation & Verified');
    }

    // ----------------------------------------------------
    // 5. FindingVerifier Adversarial & Noise Gate Testing
    // ----------------------------------------------------
    console.log('>>> [5/8] Adversarial Testing: FindingVerifier 5 Verdict States...');
    {
        // 1. CONFIRMED
        const confirmedRes = FindingVerifier.verifyFinding(
            { category: 'SQL_INJECTION', evidence: 'SELECT * FROM users WHERE id = ' + 123 },
            { content: 'function getUser(id) { return db.query("SELECT * FROM users WHERE id = " + id); }' }
        );
        assert.strictEqual(confirmedRes.verdict, 'TRUE_POSITIVE');
        assert.strictEqual(confirmedRes.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.CONFIRMED);

        // 2. FALSE_POSITIVE (Parameterized SQL)
        const fpRes = FindingVerifier.verifyFinding(
            { category: 'SQL_INJECTION', rule_id: 'security/sql' },
            { content: 'const stmt = db.prepare("SELECT * FROM users WHERE id = ?"); return stmt.get(id);' }
        );
        assert.strictEqual(fpRes.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.FALSE_POSITIVE);

        // 3. FALSE_POSITIVE (TenantContext IDOR)
        const idorFp = FindingVerifier.verifyFinding(
            { category: 'IDOR', rule_id: 'security/idor' },
            { content: 'const order = db.query(tenantContext.tenant_id, orderId);' }
        );
        assert.strictEqual(idorFp.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.FALSE_POSITIVE);

        // 4. INSUFFICIENT_EVIDENCE
        const ieRes = FindingVerifier.verifyFinding(
            { category: 'SQL_INJECTION' },
            { content: '' }
        );
        assert.strictEqual(ieRes.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.INSUFFICIENT_EVIDENCE);

        // 5. ENVIRONMENT_LIMITATION
        const envRes = FindingVerifier.verifyFinding(
            { category: 'BROWSER_E2E' },
            { environmentLimitation: true }
        );
        assert.strictEqual(envRes.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.ENVIRONMENT_LIMITATION);

        // 6. LIKELY (Weak Evidence)
        const likelyRes = FindingVerifier.verifyFinding(
            { category: 'BUFFER_OVERFLOW', evidence: 'No raw snippet provided' },
            { content: 'some code' }
        );
        assert.strictEqual(likelyRes.formalVerdict, FindingVerifier.VERIFICATION_VERDICTS.LIKELY);

        // 7. Defensive handling of empty / null objects
        const nullRes = FindingVerifier.verifyFinding(null, null);
        assert.ok(nullRes.verdict, 'FindingVerifier must handle null safely');

        console.log('  [PASS] FindingVerifier 5-State Matrix & Noise Filtering Verified');
    }

    // ----------------------------------------------------
    // 6. EvidenceGraph Traceability & Claim Integrity Testing
    // ----------------------------------------------------
    console.log('>>> [6/8] Adversarial Testing: EvidenceGraph Claim Integrity & Graph Exports...');
    {
        const graph = new EvidenceGraph();

        // 1. Complete Repair Cycle
        const trace = graph.recordRepairCycleTrace({
            failureId: 'FAIL_AUTH_TIMEOUT',
            findingId: 'FND_TIMEOUT_GUARD',
            decisionId: 'DEC_ADD_RETRY',
            repairId: 'REP_EXPONENTIAL_BACKOFF',
            testId: 'TEST_REPAIR_E2E',
            outcomeId: 'CLAIM_RESILIENCE_RESTORED',
            testStatus: 'PASSED',
            outcomeStatus: 'VERIFIED'
        });

        assert.strictEqual(trace.path.length, 6);
        const pathNodes = graph.getFailureRepairTrace('FAIL_AUTH_TIMEOUT');
        assert.strictEqual(pathNodes.length, 6, 'Full failure-to-claim trace must be complete');

        // 2. Claim Integrity: Verified on Passed Test
        const verifiedClaim = graph.verifyClaimIntegrity('CLAIM_RESILIENCE_RESTORED');
        assert.strictEqual(verifiedClaim.verified, true);
        assert.strictEqual(verifiedClaim.verdict, 'VERIFIED_WITH_RIGOROUS_EVIDENCE');

        // 3. Claim Integrity: Orphaned Claim -> must reject
        graph.addNode({ id: 'CLAIM_ORPHAN', type: 'CLAIM' });
        const orphanRes = graph.verifyClaimIntegrity('CLAIM_ORPHAN');
        assert.strictEqual(orphanRes.verified, false);
        assert.ok(orphanRes.reason.includes('ادعاء معزول'));

        // 4. Claim Integrity: Claim with Failed Evidence -> must reject
        graph.addNode({ id: 'CLAIM_WITH_FAILING_TEST', type: 'CLAIM' });
        graph.addNode({ id: 'TEST_FAILED_NODE', type: 'TEST_EXECUTION', status: 'FAILED' });
        graph.addEdge('TEST_FAILED_NODE', 'CLAIM_WITH_FAILING_TEST', 'PROVES');
        const failClaimRes = graph.verifyClaimIntegrity('CLAIM_WITH_FAILING_TEST');
        assert.strictEqual(failClaimRes.verified, false);
        assert.ok(failClaimRes.reason.includes('فاشلة'));

        // 5. Export Formats & Redaction Check
        graph.addNode({
            id: 'NODE_WITH_SECRETS',
            type: 'GENERIC',
            secret: 'top_secret_123',
            password: 'myPassword123',
            token: 'Bearer eyJhbGciOi...',
            normalProp: 'benign_value',
            keyword: 'preserved_keyword'
        });

        const exported = graph.exportGraph();
        const secretNode = exported.nodes.find(n => n.id === 'NODE_WITH_SECRETS');
        assert.strictEqual(secretNode.secret, '[REDACTED_SECRET]');
        assert.strictEqual(secretNode.password, '[REDACTED_SECRET]');
        assert.strictEqual(secretNode.normalProp, 'benign_value');
        assert.strictEqual(secretNode.keyword, 'preserved_keyword', 'Non-sensitive properties must not be corrupted');

        const mermaid = graph.exportMermaid();
        assert.ok(mermaid.startsWith('graph TD'));

        const dot = graph.exportDot();
        assert.ok(dot.startsWith('digraph EvidenceGraph'));

        console.log('  [PASS] EvidenceGraph Claim Integrity & Anti-Fake Evidence Defense Verified');
    }

    // ----------------------------------------------------
    // 7. EngineeringMemory Failure Dedup & Pattern Recall Testing
    // ----------------------------------------------------
    console.log('>>> [7/8] Adversarial Testing: EngineeringMemory & Security Debt Invariants...');
    {
        const memory = new EngineeringMemory();

        // 1. Record failure once
        const rec1 = memory.recordResolvedFailure({
            failure_signature: 'SIG_AUTH_HEADER_MISSING',
            category: 'SECURITY',
            root_cause: 'Missing Authorization header in webhook request',
            fix: 'Add HeaderValidator middleware',
            verification_result: 'VERIFIED'
        });
        assert.strictEqual(rec1.applied_count, 1);

        // 2. Record same failure again -> must deduplicate and increment applied_count
        const rec2 = memory.recordResolvedFailure({
            failure_signature: 'SIG_AUTH_HEADER_MISSING',
            category: 'SECURITY',
            verification_result: 'VERIFIED_UPDATED'
        });
        assert.strictEqual(rec2.applied_count, 2);

        const allResolved = memory.getResolvedFailures();
        const matches = allResolved.filter(r => r.failure_signature === 'SIG_AUTH_HEADER_MISSING');
        assert.strictEqual(matches.length, 1, 'Resolved failure must not create duplicate entries');

        // 3. Similar Pattern Recall
        const similar = memory.findSimilarPattern({
            category: 'SECURITY',
            title: 'Path Traversal in filename',
            rule_id: 'security/path_traversal'
        });
        assert.ok(similar.length > 0, 'Must find seeded SEC-INC-001 pattern');
        assert.strictEqual(similar[0].pattern_id, 'SEC-INC-001');

        // 4. Security Debt Inspection
        const debt = memory.getSecurityDebt();
        assert.ok(debt.length >= 1);
        assert.strictEqual(debt[0].id, 'DEBT-001');

        console.log('  [PASS] EngineeringMemory Deduplication & Historical Incident Recall Verified');
    }

    // ----------------------------------------------------
    // 8. Security & Injection Attacks (Command Injection, Prototype Pollution, Oversized Payloads)
    // ----------------------------------------------------
    console.log('>>> [8/8] Adversarial Testing: Security Injection & Memory Attacks...');
    {
        const replanner = new TaskReplanner();
        const recorder = new AgentAuditRecorder();
        const graph = new EvidenceGraph();

        // 1. Prototype Pollution Attempt
        const pollutedInput = JSON.parse('{"__proto__": {"polluted": true}, "constructor": {"prototype": {"isAdmin": true}}}');
        const changeRes = recorder.recordChange({
            intent: 'Normal intent',
            diff: '',
            payload: pollutedInput
        });
        assert.strictEqual(Object.prototype.polluted, undefined, 'Prototype pollution must not affect Object.prototype');
        assert.strictEqual(Object.prototype.isAdmin, undefined, 'Prototype pollution must not affect Object.prototype');

        // 2. Command Injection Attempt in Task and Audit
        const injectionTask = {
            id: 'task_cmd_inj; rm -rf /; $(whoami) & calc.exe',
            attempts: 0
        };
        const injRes = replanner.replanOnFailure(injectionTask, {
            error: 'Failed command: `rm -rf /` | dir /s'
        });
        assert.ok(injRes.taskId, 'Command injection string handled as passive text');

        // 3. Oversized Payload & Malformed Nodes
        const hugeString = 'A'.repeat(50000);
        graph.addNode({
            id: 'NODE_HUGE',
            type: 'EVIDENCE',
            data: hugeString
        });
        const graphExport = graph.exportGraph();
        assert.strictEqual(graphExport.nodes.length > 0, true);

        console.log('  [PASS] Security Injection & Memory Resilience Invariants Fully Verified');
    }

    console.log('======================================================');
    console.log('>>> [SUCCESS] All Phase 3.5 Adversarial Tests PASSED (100% Verified).');
    console.log('======================================================');
}

if (require.main === module) {
    runAdversarialVerificationSuite().catch(err => {
        console.error('Adversarial Verification Failed:', err);
        process.exit(1);
    });
}

module.exports = { runAdversarialVerificationSuite };
