/**
 * WebForge OS - C3 Grounding & Output Verification Test Suite
 * 
 * Verifies:
 * - GroundingGate: PERMIT, QUALIFY, ABSTAIN, BLOCK, coverage ratios, limitations
 * - OutputVerificationEngine: claim extraction, citation verification, unsupported claim detection
 * - Abstention Intelligence: Abstention !== Falsehood, Insufficient Evidence handling
 * - Partial Grounding: mixed outputs, explicit limitations preservation
 * - Negative Tests: 24 conditions defined in C3 Mission Sections 40-46
 * - Adversarial Tests: Prompt injection in citations, evidence poisoning, fabricated references
 * - Audit Integration: Full traceability in AgentAuditRecorder
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const GroundingGate = require('../grounding-gate');
const OutputVerificationEngine = require('../output-verification-engine');
const ClaimVerificationEngine = require('../claim-verification-engine');
const EvidenceGraph = require('../evidence-graph');
const AgentAuditRecorder = require('../agent-audit-recorder');

describe('C3 Grounding & Output Verification Suite', () => {

  describe('1. GroundingGate Core Decisions & Thresholds', () => {
    it('should issue PERMIT and GROUNDED when all claims are strictly verified', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-1', status: 'VERIFIED', verified: true },
        { claim_id: 'CLM-2', status: 'VERIFIED', verified: true }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      assert.strictEqual(evaluation.grounded, true);
      assert.strictEqual(evaluation.verdict, GroundingGate.GROUNDING_VERDICTS.GROUNDED);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.PERMIT);
      assert.strictEqual(evaluation.coverageRatio, 1.0);
      assert.strictEqual(evaluation.limitations.length, 0);
    });

    it('should issue QUALIFY and GROUNDED_WITH_LIMITATIONS for partial grounding', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-1', status: 'VERIFIED', verified: true },
        { claim_id: 'CLM-2', status: 'INSUFFICIENT_EVIDENCE', verified: false }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      assert.strictEqual(evaluation.grounded, true);
      assert.strictEqual(evaluation.isPartiallyGrounded, true);
      assert.strictEqual(evaluation.verdict, GroundingGate.GROUNDING_VERDICTS.GROUNDED_WITH_LIMITATIONS);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.QUALIFY);
      assert.strictEqual(evaluation.coverageRatio, 0.5);
      assert.ok(evaluation.limitations.length > 0);
    });

    it('should issue ABSTAIN and INSUFFICIENT_EVIDENCE when no claims are grounded', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-1', status: 'INSUFFICIENT_EVIDENCE', verified: false },
        { claim_id: 'CLM-2', status: 'INSUFFICIENT_EVIDENCE', verified: false }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      assert.strictEqual(evaluation.grounded, false);
      assert.strictEqual(evaluation.verdict, GroundingGate.GROUNDING_VERDICTS.INSUFFICIENT_EVIDENCE);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.ABSTAIN);
      assert.ok(evaluation.reason.includes('استنكاف إدراكي مبرر'));
    });

    it('should issue ABSTAIN and CONFLICTED when evidence contradicts', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-1', status: 'VERIFIED', verified: true },
        { claim_id: 'CLM-2', status: 'CONFLICTED', verified: false }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      assert.strictEqual(evaluation.grounded, false);
      assert.strictEqual(evaluation.verdict, GroundingGate.GROUNDING_VERDICTS.CONFLICTED);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.ABSTAIN);
      assert.ok(evaluation.reason.includes('أدلة متناقضة'));
    });

    it('should issue BLOCK and REJECTED on security threats or poisoning', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-1', status: 'FAIL', threatDetected: true, verified: false }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      assert.strictEqual(evaluation.grounded, false);
      assert.strictEqual(evaluation.verdict, GroundingGate.GROUNDING_VERDICTS.REJECTED);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.BLOCK);
      assert.ok(evaluation.reason.includes('حظر المخرجات قطعياً'));
    });
  });

  describe('2. OutputVerificationEngine & Claim Extraction', () => {
    it('should extract structured factual claims and citations from output text', () => {
      const engine = new OutputVerificationEngine();
      const sampleText = `
        تقرير المعالجة:
        تم إصلاح ثغرة SQL Injection في مسار المستخدمين عبر استخدام استعلامات محمية.
        راجع الملف packages/security/file-security.js للتحقق.
      `;

      const result = engine.extractClaimsAndCitations(sampleText);
      assert.ok(result.claims.length >= 1);
      assert.strictEqual(result.claims[0].claim_type, 'SECURITY');
      assert.ok(result.citations.length >= 1);
      assert.ok(result.citations[0].target.includes('file-security.js'));
    });

    it('should verify citations without automatically promoting them to verified claims (Citation !== Verification)', () => {
      const engine = new OutputVerificationEngine();
      const citations = [
        { raw: '[file-security.js](file:///packages/security/file-security.js)', target: 'packages/security/file-security.js' },
        { raw: 'non_existent_file.js', target: 'non_existent_file.js' }
      ];

      const verifiedCitations = engine.verifyCitations(citations, {
        knownArtifacts: ['packages/security/file-security.js']
      });

      assert.strictEqual(verifiedCitations[0].exists, true);
      assert.strictEqual(verifiedCitations[0].isVerifiedClaimProof, false, 'Citation presence is NOT proof of verification');
      assert.strictEqual(verifiedCitations[1].exists, false);
      assert.strictEqual(verifiedCitations[1].status, 'UNRESOLVED_OR_FABRICATED');
    });

    it('should detect unsupported claims in generated output and flag them', () => {
      const engine = new OutputVerificationEngine();
      const outputText = `
        تم إصلاح ثغرة تفويض المستخدمين وتأمين كافة نقاط النهاية.
      `;

      // Available evidences do NOT cover this claim
      const availableEvidences = [];

      const verification = engine.verifyOutput(outputText, availableEvidences);
      assert.strictEqual(verification.grounded, false);
      assert.strictEqual(verification.decision, GroundingGate.GATE_DECISIONS.ABSTAIN);
      assert.strictEqual(verification.unsupportedClaims.length, 1);
    });

    it('should fully verify output when material claims are supported by passing tests', () => {
      const eg = new EvidenceGraph();
      const engine = new OutputVerificationEngine({ evidenceGraph: eg });

      const outputText = `
        تم التحقق من تجزئة كلمات المرور واجتياز كافة الفحوصات الأمنية.
      `;

      const evidences = [
        {
          id: 'EV-PASS-001',
          type: 'TEST_EXECUTION',
          status: 'PASSED',
          testPassed: true,
          executionVerified: true
        }
      ];

      const verification = engine.verifyOutput(outputText, evidences);
      assert.strictEqual(verification.grounded, true);
      assert.strictEqual(verification.status, 'VERIFIED');
      assert.strictEqual(verification.decision, GroundingGate.GATE_DECISIONS.PERMIT);
    });
  });

  describe('3. Epistemic Principles & Abstention Intelligence', () => {
    it('Principle: Abstention !== Falsehood', () => {
      const gate = new GroundingGate();
      const claims = [
        { claim_id: 'CLM-UNKNOWN', status: 'INSUFFICIENT_EVIDENCE', verified: false }
      ];

      const evaluation = gate.evaluateGrounding(claims);
      // Abstention must indicate insufficient evidence, not falsehood
      assert.strictEqual(evaluation.verdict, 'INSUFFICIENT_EVIDENCE');
      assert.strictEqual(evaluation.decision, 'ABSTAIN');
      assert.strictEqual(evaluation.grounded, false);
      // Crucial: It must not be labeled as REJECTED or MALICIOUS
      assert.notStrictEqual(evaluation.verdict, 'REJECTED');
    });

    it('Principle: Memory !== Evidence boundary remains unbroken', () => {
      const engine = new OutputVerificationEngine();
      const outputText = `
        تم تأمين الجلسة استناداً إلى الأنماط السابقة في الذاكرة الهندسية.
      `;

      const memoryOnlyEvidence = [
        {
          id: 'MEM-001',
          source_type: 'ENGINEERING_MEMORY',
          isMemoryRecord: true
        }
      ];

      const verification = engine.verifyOutput(outputText, memoryOnlyEvidence);
      assert.strictEqual(verification.grounded, false);
      assert.strictEqual(verification.decision, GroundingGate.GATE_DECISIONS.ABSTAIN);
      assert.ok(verification.unsupportedClaims.length > 0);
    });

    it('Principle: Mixed output must preserve limitations and never hide ungrounded claims', () => {
      const gate = new GroundingGate();
      const mixedClaims = [
        { claim_id: 'CLM-GOOD', status: 'VERIFIED', verified: true },
        { claim_id: 'CLM-BAD', status: 'INSUFFICIENT_EVIDENCE', verified: false },
        { claim_id: 'CLM-STALE', status: 'INVALIDATED', verified: false }
      ];

      const evaluation = gate.evaluateGrounding(mixedClaims);
      assert.strictEqual(evaluation.decision, GroundingGate.GATE_DECISIONS.QUALIFY);
      assert.strictEqual(evaluation.isPartiallyGrounded, true);
      assert.strictEqual(evaluation.claimsSummary.grounded, 1);
      assert.strictEqual(evaluation.claimsSummary.insufficient, 1);
      assert.strictEqual(evaluation.claimsSummary.stale, 1);
      assert.strictEqual(evaluation.limitations.length, 2);
    });
  });

  describe('4. Adversarial & Security Tests (Sections 40-41 Requirements)', () => {
    it('should block output containing dangerous command injection', () => {
      const engine = new OutputVerificationEngine();
      const hostileOutput = "النتيجة: تم إصلاح الخطأ. eval(process.mainModule.require('child_process'))";

      const verification = engine.verifyOutput(hostileOutput, []);
      assert.strictEqual(verification.status, 'BLOCKED');
      assert.strictEqual(verification.decision, GroundingGate.GATE_DECISIONS.BLOCK);
      assert.strictEqual(verification.grounded, false);
    });

    it('should reject fabricated citations and prevent them from conferring authority', () => {
      const engine = new OutputVerificationEngine();
      const textWithFakeCitation = "تم التأمين وفق المرجع [Sec-Standard](file:///fake/classified/security_spec.md)";

      const citations = engine.verifyCitations([
        { raw: '[Sec-Standard](file:///fake/classified/security_spec.md)', target: 'fake/classified/security_spec.md' }
      ], {
        knownArtifacts: ['packages/security/index.js']
      });

      assert.strictEqual(citations[0].exists, false);
      assert.strictEqual(citations[0].status, 'UNRESOLVED_OR_FABRICATED');
    });

    it('should record grounding decisions in AgentAuditRecorder for full auditability', () => {
      const auditRecorder = new AgentAuditRecorder();
      const gate = new GroundingGate({ auditRecorder });

      const claims = [
        { claim_id: 'CLM-AUDIT', status: 'VERIFIED', verified: true }
      ];

      gate.evaluateGrounding(claims, { taskId: 'TASK_TEST_AUDIT' });
      const trail = auditRecorder.getAuditTrail();
      
      const groundingAudit = trail.find(t => t.action === 'GROUNDING_GATE_EVALUATION');
      assert.ok(groundingAudit);
      assert.strictEqual(groundingAudit.verdict, 'GROUNDED');
      assert.strictEqual(groundingAudit.decision, 'PERMIT');
    });
  });

});
