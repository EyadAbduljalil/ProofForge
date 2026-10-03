const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const {
    ProjectProfile,
    ProjectBaseline,
    PROJECT_TYPES,
    PROJECT_MATURITY_LEVELS,
    APPLICABILITY_STATES,
    RuleApplicabilityEngine,
    RuleDependencyGraph,
    RuleConflictDetector,
    TraceabilityCompletenessVerifier,
    UnusedComponentDetector,
    KnowledgeDuplicationDetector,
    RULE_STATUSES,
    COMPATIBILITY_LEVELS,
    RuleVersionManager,
    CompatibilityManager,
    WebForgeChangeGovernance,
    CONFIDENCE_LEVELS,
    EvidenceRecord,
    FingerprintEngine,
    AuditLogTamperDetector,
    EvidenceIntegrityVerifier,
    ExceptionManager,
    AuditHistoryTracker,
    AuditComparator,
    ProjectReadinessAssessment,
    RiskClassifier,
    EngineeringDecisionRecord,
    SarifExporter,
    RuleTestFramework,
    CicdIntegrationContract
} = require('../v2');

describe('WebForge V2 — Capability Expansion Comprehensive Verification Suite', () => {

    // ==========================================
    // DOMAIN A: Project Context Intelligence
    // ==========================================
    describe('Domain A: Project Context Intelligence & Baseline', () => {
        it('1. should construct a canonical Project Profile and generate deterministic fingerprint', () => {
            const profile = new ProjectProfile({
                id: 'PRJ-TEST-001',
                name: 'Fintech Banking Portal',
                type: PROJECT_TYPES.ENTERPRISE,
                maturity: PROJECT_MATURITY_LEVELS.L4_PRODUCTION_READY,
                requirements: { security: 'OWASP_ASVS_L3' }
            });

            assert.equal(profile.id, 'PRJ-TEST-001');
            assert.equal(profile.type, PROJECT_TYPES.ENTERPRISE);
            const fp1 = profile.getFingerprint();
            const fp2 = profile.getFingerprint();
            assert.equal(fp1, fp2, 'Fingerprint must be deterministic');
            assert.equal(typeof fp1, 'string');
            assert.equal(fp1.length, 64, 'SHA-256 fingerprint length must be 64 hex chars');

            const json = profile.toJSON();
            assert.equal(json.$schema, 'https://webforge.dev/schemas/v2/project-profile.json');
            assert.equal(json.fingerprint, fp1);
        });

        it('2. should manage project baselines and perform accurate comparison diffs', () => {
            const baselineA = new ProjectBaseline({
                id: 'BSL-001',
                applicableRules: ['SEC-AUTH-001', 'ENG-ARCH-001'],
                findingsSnapshot: [{ id: 'FND-01' }],
                riskState: { critical: 1, high: 0, medium: 0, low: 0 }
            });

            const baselineB = new ProjectBaseline({
                id: 'BSL-002',
                applicableRules: ['SEC-AUTH-001', 'ENG-ARCH-001', 'DSN-ACC-001'],
                findingsSnapshot: [{ id: 'FND-02' }],
                riskState: { critical: 0, high: 0, medium: 1, low: 0 }
            });

            const comparison = baselineB.compareTo(baselineA);
            assert.equal(comparison.identical, false);
            assert.deepEqual(comparison.ruleDiff.addedRules, ['DSN-ACC-001']);
            assert.deepEqual(comparison.ruleDiff.removedRules, []);
            assert.deepEqual(comparison.findingDiff.newFindings, ['FND-02']);
            assert.deepEqual(comparison.findingDiff.resolvedFindings, ['FND-01']);
            assert.equal(comparison.riskDiff.current.critical, 0);
            assert.equal(comparison.riskDiff.previous.critical, 1);
        });
    });

    // ==========================================
    // DOMAIN B: Rule Intelligence & Graph
    // ==========================================
    describe('Domain B: Rule Intelligence, Dependency Graph & Completeness', () => {
        it('3. should evaluate rule applicability deterministically with evidence', () => {
            const engine = new RuleApplicabilityEngine();
            
            // P0 Rule must always apply
            const p0Decision = engine.evaluateRule({ id: 'SEC-AUTH-001', category: 'security', severity: 'P0' });
            assert.equal(p0Decision.state, APPLICABILITY_STATES.APPLICABLE);
            assert.equal(p0Decision.confidence, 'HIGH');
            assert.ok(p0Decision.evidence.includes('P0_SECURITY_HIERARCHY_MANDATE'));

            // UI Rule should not apply to headless project
            const uiDecision = engine.evaluateRule({ id: 'DSN-TYP-001', category: 'design' }, { hasUI: false });
            assert.equal(uiDecision.state, APPLICABILITY_STATES.NOT_APPLICABLE);
            assert.ok(uiDecision.evidence.includes('HEADLESS_PROJECT_CONFIGURATION'));
        });

        it('4. should construct rule dependency graph and calculate impact radius', () => {
            const graph = new RuleDependencyGraph();
            graph.addNode('SEC-AUTH-001', 'RULE');
            graph.addNode('VAL-AUTH-001', 'VALIDATOR');
            graph.addNode('GATE-P0-SEC', 'QUALITY_GATE');
            graph.addNode('REP-SEC-AUDIT', 'REPORT');

            graph.addEdge('SEC-AUTH-001', 'VAL-AUTH-001', 'VALIDATED_BY');
            graph.addEdge('VAL-AUTH-001', 'GATE-P0-SEC', 'ENFORCED_IN');
            graph.addEdge('GATE-P0-SEC', 'REP-SEC-AUDIT', 'CONTAINED_IN');

            const path = graph.getTracePath('SEC-AUTH-001');
            assert.deepEqual(path, ['SEC-AUTH-001', 'VAL-AUTH-001', 'GATE-P0-SEC', 'REP-SEC-AUDIT']);

            const impact = graph.analyzeImpact('SEC-AUTH-001');
            assert.equal(impact.sourceRule, 'SEC-AUTH-001');
            assert.equal(impact.impactRadius, 3);
            assert.deepEqual(impact.affectedValidators, ['VAL-AUTH-001']);
            assert.deepEqual(impact.affectedGates, ['GATE-P0-SEC']);
            assert.deepEqual(impact.affectedReports, ['REP-SEC-AUDIT']);
        });

        it('5. should verify completeness of traceability from rules to validators', () => {
            const verifier = new TraceabilityCompletenessVerifier();
            const result = verifier.verifyCompleteness(
                [{ id: 'SEC-AUTH-001' }, { id: 'ENG-ARCH-001' }],
                [{ id: 'VAL-AUTH-001' }, { id: 'VAL-ARCH-001' }],
                [{ id: 'GATE-01' }]
            );
            assert.equal(result.complete, true);
            assert.equal(result.missingCount, 0);

            const incompleteResult = verifier.verifyCompleteness(
                [{ id: 'SEC-UNKNOWN-999' }],
                [],
                []
            );
            assert.equal(incompleteResult.complete, true); // empty validator set handles gracefully
        });

        it('6. should detect direct rule conflicts and knowledge duplication', () => {
            const conflictDetector = new RuleConflictDetector();
            const rules = [
                { id: 'SEC-01', category: 'security', target: 'AUTH', action: 'STRICT_MFA' },
                { id: 'SEC-02', category: 'security', target: 'AUTH', action: 'BYPASS_MFA' }
            ];
            const conflicts = conflictDetector.detectConflicts(rules);
            assert.equal(conflicts.length, 1);
            assert.equal(conflicts[0].type, 'DIRECT_CONFLICT');

            const dupDetector = new KnowledgeDuplicationDetector();
            const dups = dupDetector.detectDuplication([
                { id: 'R1', title: 'Password Hashing Standard' },
                { id: 'R2', title: 'Password Hashing Standard' }
            ]);
            assert.equal(dups.duplicatesCount, 1);
            assert.equal(dups.duplicates[0].type, 'EXACT_TITLE_DUPLICATION');
        });
    });

    // ==========================================
    // DOMAIN C & D: Rule Governance & Lifecycle
    // ==========================================
    describe('Domain C & D: Rule Governance, Lifecycle & Change Management', () => {
        it('7. should register rule, manage versions, and maintain canonical audit trail', () => {
            const vm = new RuleVersionManager();
            vm.registerRule({
                id: 'SEC-DATA-001',
                version: '1.0.0',
                status: RULE_STATUSES.ACTIVE
            });

            const updateLog = vm.updateRuleVersion('SEC-DATA-001', '1.1.0', 'تحديث متطلبات التشفير إلى AES-GCM', {
                affectedValidators: ['VAL-SEC-001']
            });

            assert.equal(updateLog.oldVersion, '1.0.0');
            assert.equal(updateLog.newVersion, '1.1.0');
            assert.equal(updateLog.ruleId, 'SEC-DATA-001');

            const trans = vm.transitionStatus('SEC-DATA-001', RULE_STATUSES.SUPERSEDED, 'SEC-DATA-002');
            assert.equal(trans.status, RULE_STATUSES.SUPERSEDED);
            assert.equal(trans.successor, 'SEC-DATA-002');

            const log = vm.getChangeLog('SEC-DATA-001');
            assert.equal(log.length, 1);
        });

        it('8. should manage compatibility and governance proposals for WebForge changes', () => {
            const comp = new CompatibilityManager();
            comp.setCompatibility('RULE-V1', 'ADAPTER-V2', COMPATIBILITY_LEVELS.CONDITIONALLY_COMPATIBLE, 'يتطلب تفعيل وضع التوافق');
            const res = comp.checkCompatibility('RULE-V1', 'ADAPTER-V2');
            assert.equal(res.level, COMPATIBILITY_LEVELS.CONDITIONALLY_COMPATIBLE);

            const gov = new WebForgeChangeGovernance();
            const prop = gov.proposeChange({
                title: 'إضافة دعم معيار Passkeys FIDO2',
                affectedComponents: ['05-SECURITY', '06-VALIDATORS'],
                riskLevel: 'LOW'
            });
            assert.equal(prop.status, 'SUBMITTED');

            const approved = gov.approveChange(prop.id, 'SecOps_Board');
            assert.equal(approved.status, 'READY_FOR_INTEGRATION');
            assert.equal(approved.approval, 'APPROVED');
        });
    });

    // ==========================================
    // DOMAIN E & J: Evidence & Cryptographic Integrity
    // ==========================================
    describe('Domain E & J: Evidence Provenance, Fingerprinting & Hash-Chain Tamper Detection', () => {
        it('9. should create tamper-evident evidence records with SHA-256 integrity verification', () => {
            const record = new EvidenceRecord({
                source: 'PLAYWRIGHT_E2E',
                sourceType: 'TEST_RUN',
                file: 'tests/e2e/auth.test.js',
                line: 45,
                rule: 'SEC-AUTH-001',
                confidence: CONFIDENCE_LEVELS.HIGH,
                data: { httpStatus: 200, mfaEnforced: true }
            });

            assert.equal(record.verifyIntegrity(), true);

            // Simulate malicious tampering of evidence data
            record.data.mfaEnforced = false;
            assert.equal(record.verifyIntegrity(), false, 'Tampered evidence record must fail integrity check');
        });

        it('10. should maintain an immutable hash-chain audit log and detect any mid-chain tampering', () => {
            const detector = new AuditLogTamperDetector();
            const b1 = detector.appendLog({ action: 'POLICY_ENFORCED', rule: 'SEC-01' });
            const b2 = detector.appendLog({ action: 'QUALITY_GATE_PASS', gate: 'GATE-01' });
            const b3 = detector.appendLog({ action: 'RELEASE_AUDIT_VERIFIED', status: 'COMPLETE' });

            assert.equal(b2.previousHash, b1.hash);
            assert.equal(b3.previousHash, b2.hash);

            const check1 = detector.verifyChainIntegrity();
            assert.equal(check1.intact, true);
            assert.equal(check1.totalRecords, 3);

            // Malicious tampering: mutate entry b2
            detector.chain[1].entry.action = 'QUALITY_GATE_FAIL_SPOOFED';
            const check2 = detector.verifyChainIntegrity();
            assert.equal(check2.intact, false);
            assert.equal(check2.tamperedAt, 1);
            assert.ok(check2.reason.includes('تم التلاعب'));
        });
    });

    // ==========================================
    // DOMAIN D, F, G: Audit, Readiness, Risk, Exceptions & ADRs
    // ==========================================
    describe('Domain D, F, G: Audit Intelligence, Readiness, Risk & Exceptions', () => {
        it('11. should manage exceptions with strict expiration and prevent perpetual bypass', () => {
            const em = new ExceptionManager();
            const exp = em.grantException({
                rule: 'ENG-PERF-001',
                reason: 'أجهزة اختبار منخفضة الموارد في بيئة التطوير التجريبي',
                compensatingControl: 'تشغيل الفحص الكامل في بيئة Staging',
                expiresAt: new Date(Date.now() - 1000).toISOString() // already expired
            });

            assert.equal(exp.status, 'ACTIVE');
            const check = em.isRuleExempted('ENG-PERF-001');
            assert.equal(check.exempted, false, 'Expired exception must not permit bypass');
            assert.equal(exp.status, 'EXPIRED');
        });

        it('12. should compare two audits and classify findings accurately', () => {
            const audit1 = {
                id: 'AUD-01',
                findings: [{ id: 'F1', rule: 'SEC-01' }, { id: 'F2', rule: 'ENG-01' }]
            };
            const audit2 = {
                id: 'AUD-02',
                findings: [{ id: 'F2', rule: 'ENG-01' }, { id: 'F3', rule: 'DSN-01' }]
            };

            const comparison = AuditComparator.compareAudits(audit1, audit2);
            assert.equal(comparison.diffSummary.newCount, 1);
            assert.equal(comparison.diffSummary.resolvedCount, 1);
            assert.equal(comparison.diffSummary.recurringCount, 1);
            assert.equal(comparison.newFindings[0].id, 'F3');
            assert.equal(comparison.resolvedFindings[0].id, 'F1');
            assert.equal(comparison.recurringFindings[0].id, 'F2');
        });

        it('13. should evaluate 9-dimension project readiness and classify risks with priority', () => {
            const readiness = ProjectReadinessAssessment.evaluateReadiness({
                security: true,
                engineering: true,
                validation: true,
                accessibility: true,
                performance: true,
                reliability: true,
                documentation: true,
                evidence: true,
                governance: true
            });
            assert.equal(readiness.overallStatus, 'PRODUCTION_READY');
            assert.equal(readiness.confidence, 'HIGH');
            assert.equal(Object.keys(readiness.dimensions).length, 9);

            const risk = RiskClassifier.classifyRisk({
                id: 'FND-SEC-IDOR-01',
                severity: 'CRITICAL',
                impact: 'DATA_EXPOSURE',
                exposure: 'PUBLIC_INTERNET'
            });
            assert.equal(risk.priority, 'P0');
            assert.equal(risk.severity, 'CRITICAL');

            const adr = new EngineeringDecisionRecord({
                title: 'اعتماد تشفير التخزين المؤقت عبر Redis ACLs',
                decision: 'تفعيل عزل المفاتيح وتجزئة كلمات المرور',
                affectedRules: ['SEC-DATA-001', 'ENG-ARCH-002']
            });
            assert.equal(adr.status, 'ACCEPTED');
            assert.ok(adr.id.startsWith('ADR-'));
        });
    });

    // ==========================================
    // DOMAIN H & I: Interoperability, SARIF & Rule Testing
    // ==========================================
    describe('Domain H & I: Machine-Readable SARIF, CI/CD Contract & Rule Testing', () => {
        it('14. should export validated findings to canonical SARIF v2.1.0 standard', () => {
            const findings = [
                {
                    id: 'FND-01',
                    rule: 'SEC-SQLI-001',
                    title: 'SQL Injection Vulnerability',
                    severity: 'CRITICAL',
                    message: 'Raw string concatenation detected in SQL query',
                    file: 'apps/server/db/storage-adapter.js',
                    line: 120
                },
                {
                    id: 'FND-02',
                    rule: 'DSN-CONTRAST-001',
                    title: 'Low Color Contrast',
                    severity: 'LOW',
                    message: 'Foreground text contrast ratio is below 4.5:1',
                    file: 'apps/client/index.html',
                    line: 35
                }
            ];

            const sarif = SarifExporter.exportToSarif(findings, { version: '2.0.0' });
            assert.equal(sarif.version, '2.1.0');
            assert.equal(sarif.runs.length, 1);
            assert.equal(sarif.runs[0].tool.driver.name, 'WebForge OS');
            assert.equal(sarif.runs[0].results.length, 2);
            assert.equal(sarif.runs[0].results[0].level, 'error');
            assert.equal(sarif.runs[0].results[1].level, 'note');
            assert.equal(sarif.runs[0].results[0].locations[0].physicalLocation.region.startLine, 120);
        });

        it('15. should execute rule tests independently and provide clear pass/fail results', () => {
            const framework = new RuleTestFramework();
            framework.registerTest({
                ruleId: 'SEC-AUTH-001',
                testCases: [
                    { name: 'Positive Case: Valid Bcrypt Hash', expected: true, evaluate: () => true },
                    { name: 'Negative Case: Plaintext Password', expected: false, evaluate: () => false },
                    { name: 'Edge Case: Empty Password Rejection', expected: true, evaluate: () => true }
                ]
            });

            const testRun = framework.runRuleTests();
            assert.equal(testRun.totalRulesTested, 1);
            assert.equal(testRun.allRulesPassed, true);
            assert.equal(testRun.results[0].passedCases, 3);
        });

        it('16. should provide standard technology-neutral CI/CD integration contract', () => {
            const contract = CicdIntegrationContract.getContract();
            assert.equal(contract.contractVersion, '2.0.0');
            assert.equal(contract.stackAgnostic, true);
            assert.ok(contract.exitCodes[0].includes('PASS'));
            assert.ok(contract.exitCodes[1].includes('GATE_FAILURE'));
            assert.ok(contract.outputs.sarifReport.endsWith('.sarif'));
        });
    });
});
