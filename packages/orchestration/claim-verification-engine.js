/**
 * @file claim-verification-engine.js
 * @description محرك التحقق من الادعاءات الذرية واستخبارات الأدلة (C2 Claim Verification Engine)
 * WebForge Master Orchestration - Cognitive Verification Layer (Stage C2)
 * 
 * المبادئ الدستورية الصارمة:
 * Memory !== Evidence
 * Retrieved Content !== Evidence
 * Tool Result !== Evidence
 * MCP Result !== Evidence
 * LLM Output !== Evidence
 * Citation !== Verification
 * 
 * ليس بيئة تشغيل للذكاء الاصطناعي (Not an LLM Runtime) وليس مولد أكواد (Not a Code Generator)
 */

const SchemaValidator = require('../contracts/schema-validator');
const AISecurityGuard = require('../../packages/security/ai-security-guard');

const CLAIM_TYPES = {
    FACTUAL: 'FACTUAL',
    TECHNICAL: 'TECHNICAL',
    ARCHITECTURAL: 'ARCHITECTURAL',
    SECURITY: 'SECURITY',
    BEHAVIORAL: 'BEHAVIORAL',
    CONFIGURATION: 'CONFIGURATION',
    TEMPORAL: 'TEMPORAL',
    DEPENDENCY: 'DEPENDENCY',
    POLICY: 'POLICY',
    DERIVED: 'DERIVED'
};

const EVIDENCE_LEVELS = {
    L0_UNSUPPORTED: 'L0_UNSUPPORTED',
    L1_CONTEXT_ONLY: 'L1_CONTEXT_ONLY',
    L2_STATIC_ANALYSIS: 'L2_STATIC_ANALYSIS',
    L3_DYNAMIC_PROOF: 'L3_DYNAMIC_PROOF',
    L4_MULTI_DIMENSIONAL: 'L4_MULTI_DIMENSIONAL'
};

const VERIFICATION_STATES = {
    VERIFIED: 'VERIFIED',
    INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
    CONFLICTED: 'CONFLICTED',
    INVALIDATED: 'INVALIDATED',
    FAIL: 'FAIL',
    ENVIRONMENT_LIMITATION: 'ENVIRONMENT_LIMITATION'
};

const CLAIM_EVIDENCE_RELATIONS = {
    SUPPORTS: 'SUPPORTS',
    CONTRADICTS: 'CONTRADICTS',
    QUALIFIES: 'QUALIFIES',
    SUPERSEDES: 'SUPERSEDES',
    DERIVED_FROM: 'DERIVED_FROM',
    INVALIDATES: 'INVALIDATES',
    INSUFFICIENT_FOR: 'INSUFFICIENT_FOR'
};

const ATOMIC_CLAIM_SCHEMA = {
    claim_id: { required: true, type: 'string', minLength: 3 },
    statement: { required: true, type: 'string', minLength: 5 },
    claim_type: { required: true, type: 'string' },
    target_artifact: { required: false, type: 'string' },
    artifact_hash: { required: false, type: 'string' },
    required_evidence_level: { required: false, type: 'string' }
};

class ClaimVerificationEngine {
    constructor(options = {}) {
        this.evidenceGraph = options.evidenceGraph || null;
        this.securityGuard = options.securityGuard || AISecurityGuard;
    }

    /**
     * تطبيع وبناء كائن ادعاء ذري متوافق مع المخطط القياسي
     */
    static normalizeClaim(rawClaim = {}) {
        const claimId = rawClaim.claim_id || rawClaim.id || `CLM_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const statement = rawClaim.statement || rawClaim.text || rawClaim.claimText || '';
        const claimType = (rawClaim.claim_type || rawClaim.type || CLAIM_TYPES.TECHNICAL).toUpperCase();

        const claimObject = {
            claim_id: claimId,
            statement: String(statement).trim(),
            claim_type: CLAIM_TYPES[claimType] ? claimType : CLAIM_TYPES.TECHNICAL,
            target_artifact: rawClaim.target_artifact || rawClaim.artifact || null,
            artifact_hash: rawClaim.artifact_hash || rawClaim.hash || null,
            required_evidence_level: rawClaim.required_evidence_level || EVIDENCE_LEVELS.L3_DYNAMIC_PROOF,
            scope: rawClaim.scope || null,
            tenant_id: rawClaim.tenant_id || null,
            status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
            evidence_refs: Array.isArray(rawClaim.evidence_refs) ? [...rawClaim.evidence_refs] : [],
            conflicts: [],
            created_at: rawClaim.created_at || new Date().toISOString()
        };

        const validation = SchemaValidator.validate(ATOMIC_CLAIM_SCHEMA, claimObject);
        if (!validation.isValid) {
            throw new Error(`مخطط الادعاء غير صالح: ${validation.errors.map(e => e.issue).join(', ')}`);
        }

        return claimObject;
    }

    /**
     * التحقق الحتمي الصارم من الادعاء ومطابقته مع الأدلة المقدمة
     * @param {Object} claim الادعاء الذري
     * @param {Array<Object>} evidences قائمة الأدلة المرتبطة
     * @param {Object} context سياق التحقق (يتضمن بصمات الملفات الحالية والبيئة)
     */
    verifyClaim(claim, evidences = [], context = {}) {
        if (!claim) throw new Error('يجب تمرير كائن الادعاء للتحقق.');
        const normalizedClaim = ClaimVerificationEngine.normalizeClaim(claim);
        const currentArtifactHashes = context.artifactHashes || {};
        const isEnvironmentLimited = Boolean(context.environmentLimitation);

        // 1. فحص القيود البيئية
        if (isEnvironmentLimited) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.ENVIRONMENT_LIMITATION,
                verified: false,
                reason: 'تعذر التحقق التجريبي من الادعاء نظراً لقيود بيئة التشغيل الحالية.',
                evaluatedEvidencesCount: evidences.length
            };
        }

        // 2. فحص غياب الأدلة (Orphaned Claim / No Evidence)
        if (!Array.isArray(evidences) || evidences.length === 0) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
                verified: false,
                reason: 'لا توجد أدلة داعمة كافية أو اختبارات مرتبطة بهذا الادعاء (L0_UNSUPPORTED).',
                evaluatedEvidencesCount: 0
            };
        }

        const validSupporting = [];
        const contradicting = [];
        const staleOrInvalid = [];
        const memoryOnlyEvidences = [];

        for (const ev of evidences) {
            if (!ev || typeof ev !== 'object') continue;

            // أ) فحص حدود الأمان وحقن التعليمات في الأدلة الخارجية
            if (ev.source_type === 'MCP_RESULT' || ev.source_type === 'UNTRUSTED_EXTERNAL_CONTENT' || ev.source_type === 'TOOL_RESULT') {
                const secCheck = this.securityGuard.validateRetrievedContent(ev.content || ev.rawOutput || '');
                if (secCheck.threatDetected) {
                    return {
                        claim_id: normalizedClaim.claim_id,
                        status: VERIFICATION_STATES.FAIL,
                        verified: false,
                        reason: `تم حظر الدليل لاحتوائه على مؤشرات اختراق أو تسميم أدلة: ${secCheck.reasons.join(', ')}`,
                        threatDetected: true
                    };
                }
            }

            // ب) فرض المبدأ الكنسي: المحتوى غير الموثوق لا يمنح نفسه الثقة (Untrusted Content Cannot Self-Authorize)
            if (ev.source_type === 'UNTRUSTED_EXTERNAL_CONTENT' && !ev.trustedSource && !ev.isAssessedEvidence) {
                // المحتوى الخارجي غير الموثوق يظل غير موثوق ولا يُقبل كدليل إثبات قطعي
                continue;
            }

            // ج) فرض المبدأ الكنسي: مخرجات الأدوات و MCP ليست أدلة تلقائية (Tool/MCP Result !== Evidence)
            if ((ev.source_type === 'TOOL_RESULT' || ev.source_type === 'MCP_RESULT') && !ev.isAssessedEvidence && !ev.assessed_by) {
                // مخرج أداة خام لم يخضع لمسار تقييم الأدلة الكنسي
                continue;
            }

            // د) فرض المبدأ الكنسي: Memory !== Evidence
            if (ev.source_type === 'ENGINEERING_MEMORY' || ev.source === 'ENGINEERING_MEMORY' || ev.isMemoryRecord) {
                memoryOnlyEvidences.push(ev);
                continue; // لا تُعتبر الذاكرة دليلاً إثباتياً مباشراً
            }

            // هـ) فرض المبدأ الكنسي: Citation !== Verification
            if (ev.source_type === 'CITATION_ONLY' || (ev.citation && !ev.testExecution && !ev.staticAnalysisProof)) {
                // اقتباس مجرد دون برهان حتمي
                continue;
            }

            // و) فحص الصلاحية الزمنية وتحور الملف وتاريخ الانتهاء (Temporal Validity)
            const isStaleFlag = ev.isStale === true || ev.temporal_status === 'STALE' || ev.status === 'EXPIRED';
            const isExpiredTime = ev.expires_at && !isNaN(new Date(ev.expires_at).getTime()) && new Date(ev.expires_at).getTime() < Date.now();
            if (isStaleFlag || isExpiredTime) {
                staleOrInvalid.push({
                    evidenceId: ev.id,
                    reason: isExpiredTime ? `انتهت صلاحية الدليل زمنياً (Expired at ${ev.expires_at})` : 'تم وسم الدليل كمتقادم (Stale)'
                });
                continue;
            }

            const targetFile = ev.target_artifact || normalizedClaim.target_artifact;
            if (targetFile && currentArtifactHashes[targetFile]) {
                const recordedHash = ev.artifact_hash || normalizedClaim.artifact_hash;
                if (recordedHash && recordedHash !== currentArtifactHashes[targetFile]) {
                    staleOrInvalid.push({
                        evidenceId: ev.id,
                        reason: `تغيرت بصمة الملف المستهدف: المسجل ${recordedHash} !== الفعلي ${currentArtifactHashes[targetFile]}`
                    });
                    continue;
                }
            }

            // ز) فحص تطابق النطاق والمستأجر والبيئة (Scope & Cross-Tenant Boundary)
            const expectedScope = normalizedClaim.scope || context.scope;
            if (expectedScope && ev.scope && ev.scope !== expectedScope) {
                // عدم تطابق النطاق
                continue;
            }
            const expectedTenant = normalizedClaim.tenant_id || context.tenant_id;
            if (expectedTenant && ev.tenant_id && ev.tenant_id !== expectedTenant) {
                // عدم تطابق المستأجر
                continue;
            }

            // ح) تصنيف علاقة الدليل بالادعاء
            const relation = ev.relation || (ev.status === 'FAILED' ? CLAIM_EVIDENCE_RELATIONS.CONTRADICTS : CLAIM_EVIDENCE_RELATIONS.SUPPORTS);
            if (relation === CLAIM_EVIDENCE_RELATIONS.CONTRADICTS || ev.status === 'CONTRADICTING' || ev.status === 'FAILED') {
                contradicting.push(ev);
            } else if (relation === CLAIM_EVIDENCE_RELATIONS.SUPPORTS && (ev.status === 'PASSED' || ev.status === 'VERIFIED')) {
                validSupporting.push(ev);
            }
        }

        // 3. تقييم نزاعات الأدلة (Evidence Conflicts)
        if (validSupporting.length > 0 && contradicting.length > 0) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.CONFLICTED,
                verified: false,
                reason: 'يوجد نزاع مباشر بين أدلة تدعم الادعاء وأدلة تنقضه (Evidence Conflict). لا يمكن حسم الادعاء تلقائياً.',
                conflictDetails: {
                    supportingCount: validSupporting.length,
                    contradictingCount: contradicting.length
                }
            };
        }

        // 4. تقييم تقادم الأدلة وإبطالها
        if (validSupporting.length === 0 && staleOrInvalid.length > 0) {
            const reasonsText = staleOrInvalid.map(i => i.reason).join('; ');
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.INVALIDATED,
                verified: false,
                reason: `تم إبطال كافة الأدلة المرتبطة بالادعاء نظراً لتحور الشيفرة أو تقادمها: ${reasonsText}`,
                invalidatedDetails: staleOrInvalid
            };
        }

        // 5. تقييم اعتماد الادعاء على الذاكرة فقط
        if (validSupporting.length === 0 && memoryOnlyEvidences.length > 0) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
                verified: false,
                reason: 'القاعدة الدستورية: الذاكرة ليست دليلاً (Memory !== Evidence). لا يمكن التحقق من الادعاء استناداً إلى الذاكرة فقط.',
                memoryReferenceCount: memoryOnlyEvidences.length
            };
        }

        // 6. التحقق من كفاية الأدلة ومستوى الإثبات المطلوب
        if (validSupporting.length === 0) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
                verified: false,
                reason: 'الأدلة المقدمة غير كافية أو غير مكتملة الإثبات.',
                evaluatedEvidencesCount: evidences.length
            };
        }

        // مطابقة مستوى الأدلة
        const requiresDynamic = normalizedClaim.required_evidence_level === EVIDENCE_LEVELS.L3_DYNAMIC_PROOF || normalizedClaim.required_evidence_level === EVIDENCE_LEVELS.L4_MULTI_DIMENSIONAL;
        const hasDynamicProof = validSupporting.some(ev => ev.type === 'TEST_EXECUTION' || ev.testPassed === true || ev.executionVerified === true);

        if (requiresDynamic && !hasDynamicProof) {
            return {
                claim_id: normalizedClaim.claim_id,
                status: VERIFICATION_STATES.INSUFFICIENT_EVIDENCE,
                verified: false,
                reason: `الادعاء يتطلب برهاناً ديناميكياً حتمياً (${normalizedClaim.required_evidence_level})، بينما الأدلة المتوفرة ساكنة فقط.`,
                supportingCount: validSupporting.length
            };
        }

        // 7. اعتماد الادعاء بنجاح (VERIFIED) وتسجيله في EvidenceGraph إذا كان متوفراً
        if (this.evidenceGraph && typeof this.evidenceGraph.addNode === 'function') {
            this.evidenceGraph.addNode({
                id: normalizedClaim.claim_id,
                type: 'CLAIM',
                status: VERIFICATION_STATES.VERIFIED,
                statement: normalizedClaim.statement,
                claim_type: normalizedClaim.claim_type
            });

            for (const ev of validSupporting) {
                if (!this.evidenceGraph.nodes.has(ev.id)) {
                    this.evidenceGraph.addNode({
                        id: ev.id,
                        type: ev.type || 'EVIDENCE',
                        status: ev.status || 'PASSED',
                        ...ev
                    });
                }
                if (typeof this.evidenceGraph.linkClaimToEvidence === 'function') {
                    this.evidenceGraph.linkClaimToEvidence(normalizedClaim.claim_id, ev.id, CLAIM_EVIDENCE_RELATIONS.SUPPORTS);
                }
            }
        }

        return {
            claim_id: normalizedClaim.claim_id,
            status: VERIFICATION_STATES.VERIFIED,
            verified: true,
            reason: 'تم التحقق من الادعاء بنجاح استناداً إلى أدلة قطعية صالحة زمنياً وغير متناقضة.',
            supportingCount: validSupporting.length,
            evidenceLevelSatisfied: normalizedClaim.required_evidence_level
        };
    }
}

ClaimVerificationEngine.CLAIM_TYPES = CLAIM_TYPES;
ClaimVerificationEngine.EVIDENCE_LEVELS = EVIDENCE_LEVELS;
ClaimVerificationEngine.VERIFICATION_STATES = VERIFICATION_STATES;
ClaimVerificationEngine.CLAIM_EVIDENCE_RELATIONS = CLAIM_EVIDENCE_RELATIONS;
ClaimVerificationEngine.ATOMIC_CLAIM_SCHEMA = ATOMIC_CLAIM_SCHEMA;

module.exports = ClaimVerificationEngine;
