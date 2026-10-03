/**
 * @file output-verification-engine.js
 * @description محرك التحقق من مخرجات النموذج وتأصيل الادعاءات (C3 Output Verification Engine)
 * WebForge Master Orchestration - Cognitive Verification Layer (Stage C3)
 * 
 * المبادئ الحاكمة:
 * Generated Output !== Verified Truth
 * Citation !== Verification
 * Memory !== Evidence
 * Abstention !== Falsehood
 * 
 * ليس بيئة تشغيل runtime وليس مولد أكواد
 */

const GroundingGate = require('./grounding-gate');
const ClaimVerificationEngine = require('./claim-verification-engine');
const AISecurityGuard = require('../security/ai-security-guard');

class OutputVerificationEngine {
    constructor(options = {}) {
        this.evidenceGraph = options.evidenceGraph || null;
        this.claimEngine = options.claimEngine || new ClaimVerificationEngine({ evidenceGraph: this.evidenceGraph });
        this.groundingGate = options.groundingGate || new GroundingGate({ evidenceGraph: this.evidenceGraph });
        this.auditRecorder = options.auditRecorder || null;
    }

    /**
     * استخراج وتفكيك الادعاءات والاقتباسات من مخرجات النموذج بصورة حتمية وهيكلية
     * @param {string|Object} outputText مخرجات النموذج المراد فحصها
     * @returns {Object} قائمة الادعاءات المستخرجة والاقتباسات
     */
    extractClaimsAndCitations(outputText) {
        const text = typeof outputText === 'string' ? outputText : (outputText.text || outputText.content || JSON.stringify(outputText));
        const claims = [];
        const citations = [];

        // 1. استخراج الاقتباسات والمراجع (Citations extraction)
        const citationRegex = /(?:\[([^[\]]+)\]\(([^()]+)\)|راجع\s+الملف\s+([^\s]+)|file:\/\/\/([^\s\)]+)|(?:ملف|مسار|كود)\s+([a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+))/gi;
        let match;
        while ((match = citationRegex.exec(text)) !== null) {
            const rawCitation = match[0];
            const target = match[2] || match[3] || match[4] || match[5] || match[1];
            citations.push({
                raw: rawCitation,
                target: target.replace(/file:\/\/\/?/gi, ''),
                index: match.index
            });
        }

        // 2. استخراج الادعاءات الصريحة المنظمة (Structured or Semantic Factual Claims)
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;

            const isFactualClaim = /(?:تم\s*(?:إصلاح|معالجة|سد|تأمين|حماية|التحقق|اجتياز)|remediated|fixed|verified|passed|secured|implemented|prevented)/i.test(line);
            if (isFactualClaim) {
                const claimId = `OUT_CLM_${i}_${Math.random().toString(36).substring(2, 6)}`;
                let claimType = ClaimVerificationEngine.CLAIM_TYPES.TECHNICAL;
                if (/security|ثغرة|أمان|حقن|idor|csrf|auth/i.test(line)) {
                    claimType = ClaimVerificationEngine.CLAIM_TYPES.SECURITY;
                } else if (/architecture|معمار|هيكل|طبقة/i.test(line)) {
                    claimType = ClaimVerificationEngine.CLAIM_TYPES.ARCHITECTURAL;
                }

                claims.push({
                    claim_id: claimId,
                    statement: line,
                    claim_type: claimType,
                    required_evidence_level: ClaimVerificationEngine.EVIDENCE_LEVELS.L3_DYNAMIC_PROOF,
                    lineNumber: i + 1
                });
            }
        }

        return {
            textLength: text.length,
            claims,
            citations
        };
    }

    /**
     * فحص وتدقيق الاقتباسات للتأكد من أنها ليست وهمية أو مضللة (Citation Verification)
     * Citation !== Verification
     */
    verifyCitations(citations = [], context = {}) {
        const verifiedCitations = [];
        const knownArtifacts = context.knownArtifacts || [];

        for (const cit of citations) {
            const cleanTarget = cit.target.trim();
            const exists = knownArtifacts.length === 0 || knownArtifacts.some(art => art.includes(cleanTarget) || cleanTarget.includes(art));
            
            verifiedCitations.push({
                citation: cit.raw,
                target: cleanTarget,
                exists,
                isVerifiedClaimProof: false, // دستوري: وجود الاقتباس لا يعني صحة الادعاء
                status: exists ? 'RESOLVED_REFERENCE' : 'UNRESOLVED_OR_FABRICATED'
            });
        }

        return verifiedCitations;
    }

    /**
     * التحقق الشامل من مخرجات النموذج وتطبيق بوابة التأصيل الإدراكي
     * @param {string|Object} rawOutput مخرجات النموذج المراد فحصها
     * @param {Array<Object>} availableEvidences قاعدة الأدلة المتاحة
     * @param {Object} context سياق التحقق والبصمات والبيئة
     */
    verifyOutput(rawOutput, availableEvidences = [], context = {}) {
        if (!rawOutput) {
            return {
                status: 'INVALID_EMPTY_OUTPUT',
                verdict: GroundingGate.GROUNDING_VERDICTS.INSUFFICIENT_EVIDENCE,
                decision: GroundingGate.GATE_DECISIONS.ABSTAIN,
                verified: false,
                grounded: false,
                reason: 'المخرجات المقدمة فارغة أو غير صالحة هيكلياً.',
                claims: [],
                citations: []
            };
        }

        // أ) فحص أمان مخرجات النموذج من الأوامر الخطرة وحقن التعليمات
        const text = typeof rawOutput === 'string' ? rawOutput : ((rawOutput && (rawOutput.text || rawOutput.content)) || JSON.stringify(rawOutput || ''));
        
        try {
            AISecurityGuard.validateAIOutput(text);
        } catch (err) {
            return {
                status: 'BLOCKED',
                verdict: GroundingGate.GROUNDING_VERDICTS.REJECTED,
                decision: GroundingGate.GATE_DECISIONS.BLOCK,
                verified: false,
                grounded: false,
                reason: `حظر أمني: مخرجات النموذج انتهكت ضوابط الأمان: ${err.message}`,
                outputSummary: { claimsCount: 0, groundedCount: 0, ungroundedCount: 0 }
            };
        }

        // ب) استخراج الادعاءات والاقتباسات
        const extraction = this.extractClaimsAndCitations(text);
        const verifiedCitations = this.verifyCitations(extraction.citations, context);

        // ج) إذا لم تحتوِ المخرجات على أي ادعاءات وقائعية (نص تحليلي أو توضيحي مجرد)
        if (extraction.claims.length === 0) {
            return {
                status: 'INFORMATIONAL_NO_CLAIMS',
                verdict: GroundingGate.GROUNDING_VERDICTS.GROUNDED,
                decision: GroundingGate.GATE_DECISIONS.PERMIT,
                verified: true,
                reason: 'المخرجات لا تحتوي على ادعاءات وقائعية أو أمنية تستلزم براهين تجريبية.',
                claims: [],
                citations: verifiedCitations,
                groundingEvaluation: null
            };
        }

        // د) التحقق من كل ادعاء مستخرج عبر ClaimVerificationEngine (C2)
        const claimEvaluations = [];
        for (const claim of extraction.claims) {
            // ربط الأدلة المطابقة حصرياً للادعاء موضوع التحقق لمنع تسريب الأدلة غير الملائمة
            const matchingEvidences = (availableEvidences || []).filter(ev => {
                if (!ev || typeof ev !== 'object') return false;
                if (ev.claim_id && ev.claim_id === claim.claim_id) return true;
                if (ev.target_artifact && (claim.statement.includes(ev.target_artifact) || (claim.target_artifact && claim.target_artifact === ev.target_artifact))) return true;
                if (claim.target_artifact && ev.target_artifact && claim.target_artifact === ev.target_artifact) return true;
                if (ev.type === 'TEST_EXECUTION' && ev.status === 'PASSED') {
                    // إذا كان الدليل يحدد ملفاً أو أثراً معيناً، يجب أن يتطابق مع موضوع الادعاء
                    if (ev.target_artifact) {
                        return claim.statement.includes(ev.target_artifact) || (claim.target_artifact && claim.target_artifact === ev.target_artifact);
                    }
                    // إذا كان الادعاء يحدد ملفاً أو أثراً مستهدفاً بالاسم، فلا يجوز ربطه باختبار عام لا يحدده
                    const artifactInClaim = /[a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+/i.test(claim.statement) || claim.target_artifact;
                    if (artifactInClaim) {
                        return false;
                    }
                    // في حال كان الادعاء والاختبار عامين دون تحديد أثر مغاير
                    return true;
                }
                return false;
            });

            try {
                const evalResult = this.claimEngine.verifyClaim(claim, matchingEvidences, context);
                claimEvaluations.push({
                    ...claim,
                    ...evalResult
                });
            } catch (err) {
                // الفشل الآمن المغلق (Fail-Closed) عند حدوث أي خطأ استثنائي
                claimEvaluations.push({
                    ...claim,
                    status: 'FAIL',
                    verified: false,
                    reason: `فشل التحقق من الادعاء بصورة آمنة ومغلقة: ${err.message}`
                });
            }
        }

        // هـ) تطبيق بوابة التأصيل الإدراكي GroundingGate (C3)
        const gateEvaluation = this.groundingGate.evaluateGrounding(claimEvaluations, context);

        // و) توثيق النتيجة في مسجل التدقيق إذا توفر
        if (this.auditRecorder && typeof this.auditRecorder.recordAgentAction === 'function') {
            this.auditRecorder.recordAgentAction({
                action: 'OUTPUT_VERIFICATION',
                verdict: gateEvaluation.verdict,
                decision: gateEvaluation.decision,
                claimsCount: extraction.claims.length,
                groundedCount: gateEvaluation.claimsSummary.grounded,
                task_id: context.taskId || 'OUTPUT_VERIFICATION_JOB'
            });
        }

        return {
            status: gateEvaluation.decision === GroundingGate.GATE_DECISIONS.PERMIT ? 'VERIFIED' : (gateEvaluation.decision === GroundingGate.GATE_DECISIONS.QUALIFY ? 'QUALIFIED' : 'ABSTAINED_OR_BLOCKED'),
            verdict: gateEvaluation.verdict,
            decision: gateEvaluation.decision,
            grounded: gateEvaluation.grounded,
            isPartiallyGrounded: gateEvaluation.isPartiallyGrounded || false,
            coverageRatio: gateEvaluation.coverageRatio !== undefined ? gateEvaluation.coverageRatio : (gateEvaluation.grounded ? 1.0 : 0.0),
            reason: gateEvaluation.reason,
            claims: claimEvaluations,
            citations: verifiedCitations,
            unsupportedClaims: claimEvaluations.filter(c => c.status !== 'VERIFIED'),
            limitations: gateEvaluation.limitations || []
        };
    }
}

OutputVerificationEngine.GROUNDING_VERDICTS = GroundingGate.GROUNDING_VERDICTS;
OutputVerificationEngine.GATE_DECISIONS = GroundingGate.GATE_DECISIONS;

module.exports = OutputVerificationEngine;
