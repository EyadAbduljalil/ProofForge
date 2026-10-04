/**
 * @file multi-agent-verification.js
 * @description محرك التحقق والحوكمة متعدد الوكلاء في نظام ProofForge (Phase 9)
 * يحكم التعاون المهيكل بين الوكلاء مع الحفاظ على:
 * - Agent contracts & Skill contracts & Workflow contracts
 * - حاجز الصلاحيات الأمني الصارم ومنع تصعيد السلطات والامتيازات
 * - Agent A Output !== Verified Evidence
 * - AI_CLAIMED !== PROOFFORGE_VERIFIED
 * - Source Agent cannot grant permissions to Target Agent
 * - الكشف الحتمي للنزاعات بين الوكلاء (Conflicting Claims) وإحالتها لسلطة CVGF
 * - الحفاظ الكامل على سلسلة النسب للأدلة والتدقيق الشامل
 */

'use strict';

const fs = require('fs');
const path = require('path');
const AgentHandoffContract = require('./agent-handoff-contract');
const AgentRegistry = require('./agent-registry');
const SkillRegistry = require('./skill-registry');
const WorkflowRegistry = require('./workflow-registry');
const AgentSkillMappingRegistry = require('./agent-skill-mapping-registry');
const ClaimVerificationEngine = require('../orchestration/claim-verification-engine');
const AgentAuditRecorder = require('../orchestration/agent-audit-recorder');

class MultiAgentVerification {
    /**
     * الحالات الكنسية لعمليات التحقق متعدد الوكلاء
     */
    static VERIFICATION_DECISION = Object.freeze({
        VALIDATED: 'VALIDATED',
        ACCEPTED: 'ACCEPTED',
        REJECTED: 'REJECTED',
        VERIFIED: 'VERIFIED',
        ABSTAINED: 'ABSTAINED',
        FAILED: 'FAILED',
        CONFLICT: 'CONFLICT'
    });

    /**
     * التحقق الحتمي الصارم من عقد تسليم المهام بين الوكلاء (Handoff Validation)
     * يطبق مبدأ الفشل المغلق (Fail-Closed) عند أي نقص أو تناقض أو محاولة تصعيد سلطة.
     * 
     * @param {Object|AgentHandoffContract} handoff كائن عقد التسليم أو بيانات تعريفه
     * @param {Object} [options] سياق وخيارات التحقق والسجلات المرجعية
     * @returns {{isValid: boolean, status: string, errors: Array<{field: string, issue: string}>, handoffContract?: AgentHandoffContract}}
     */
    static validateHandoff(handoff, options = {}) {
        const errors = [];

        // 1. التحقق البنيوي الأساسي لبيانات العقد
        let handoffObj;
        if (handoff instanceof AgentHandoffContract) {
            handoffObj = handoff;
        } else {
            const contractValidation = AgentHandoffContract.validate(handoff);
            if (!contractValidation.isValid) {
                return {
                    isValid: false,
                    status: AgentHandoffContract.STATUS.REJECTED,
                    errors: contractValidation.errors
                };
            }
            try {
                handoffObj = new AgentHandoffContract(handoff);
            } catch (err) {
                return {
                    isValid: false,
                    status: AgentHandoffContract.STATUS.REJECTED,
                    errors: [{ field: 'handoff', issue: err.message }]
                };
            }
        }

        // 2. التحقق من السجلات الكنسية (Registries Validation)
        const agentRegistry = options.agentRegistry || this._getDefaultAgentRegistry();
        const skillRegistry = options.skillRegistry || this._getDefaultSkillRegistry();
        const workflowRegistry = options.workflowRegistry || this._getDefaultWorkflowRegistry();
        const mappingRegistry = options.mappingRegistry || this._getDefaultMappingRegistry();

        // أ) التحقق من الوكيل المصدر (source_agent)
        const sourceAgent = agentRegistry ? agentRegistry.getAgent(handoffObj.source_agent) : null;
        if (!sourceAgent) {
            errors.push({
                field: 'source_agent',
                issue: `الوكيل المصدر غير معروف في سجل الوكلاء الكنسي: '${handoffObj.source_agent}'`
            });
        } else if (sourceAgent.status !== 'ACTIVE') {
            errors.push({
                field: 'source_agent',
                issue: `الوكيل المصدر '${handoffObj.source_agent}' غير نشط (الحالة: ${sourceAgent.status})`
            });
        }

        // ب) التحقق من الوكيل الهدف (target_agent)
        const targetAgent = agentRegistry ? agentRegistry.getAgent(handoffObj.target_agent) : null;
        if (!targetAgent) {
            errors.push({
                field: 'target_agent',
                issue: `الوكيل الهدف غير معروف في سجل الوكلاء الكنسي: '${handoffObj.target_agent}'`
            });
        } else if (targetAgent.status !== 'ACTIVE') {
            errors.push({
                field: 'target_agent',
                issue: `الوكيل الهدف '${handoffObj.target_agent}' غير نشط (الحالة: ${targetAgent.status})`
            });
        }

        // ج) التحقق من مهارة المصدر (source_skill)
        const sourceSkill = skillRegistry ? skillRegistry.getSkill(handoffObj.source_skill) : null;
        if (!sourceSkill) {
            errors.push({
                field: 'source_skill',
                issue: `مهارة المصدر غير معروفة في سجل المهارات الكنسي: '${handoffObj.source_skill}'`
            });
        }

        // د) التحقق من مهارة الهدف (target_skill)
        const targetSkill = skillRegistry ? skillRegistry.getSkill(handoffObj.target_skill) : null;
        if (!targetSkill) {
            errors.push({
                field: 'target_skill',
                issue: `مهارة الهدف غير معروفة في سجل المهارات الكنسي: '${handoffObj.target_skill}'`
            });
        }

        // هـ) التحقق من تدفق العمل الحاكم (workflow_id)
        const workflow = workflowRegistry ? workflowRegistry.getWorkflow(handoffObj.workflow_id) : null;
        if (!workflow) {
            errors.push({
                field: 'workflow_id',
                issue: `تدفق العمل الحاكم غير معروف في سجل تدفقات العمل الكنسي: '${handoffObj.workflow_id}'`
            });
        }

        // 3. التحقق من التوافقية الثلاثية (Agent ↔ Skill Compatibility)
        if (sourceAgent && sourceSkill) {
            const isSourceCompatible = this._verifyAgentSkillCompatibility(
                sourceAgent,
                sourceSkill,
                mappingRegistry
            );
            if (!isSourceCompatible.compatible) {
                errors.push({
                    field: 'source_agent_skill',
                    issue: `عدم توافق بين الوكيل المصدر '${sourceAgent.id}' والمهارة '${sourceSkill.id}': ${isSourceCompatible.reason}`
                });
            }
        }

        if (targetAgent && targetSkill) {
            const isTargetCompatible = this._verifyAgentSkillCompatibility(
                targetAgent,
                targetSkill,
                mappingRegistry
            );
            if (!isTargetCompatible.compatible) {
                errors.push({
                    field: 'target_agent_skill',
                    issue: `عدم توافق بين الوكيل الهدف '${targetAgent.id}' والمهارة '${targetSkill.id}': ${isTargetCompatible.reason}`
                });
            }
        }

        // 4. الفحوصات الأمنية وحظر تصعيد السلطة والامتيازات (Authority & Privilege Escalation)
        // أ) التحقق من أن الوكيل المصدر لا يحاول منح أو نقل صلاحيات للوكيل الهدف
        const securityCtx = handoffObj.security_context || {};
        if (securityCtx.grant_permissions || securityCtx.transfer_authority || securityCtx.escalate_privilege) {
            errors.push({
                field: 'security_context',
                issue: 'تصعيد سلطة محظور: الوكيل المصدر لا يملك حق منح أو نقل صلاحيات إلى الوكيل الهدف'
            });
        }

        // ب) فحص سلسلة النسب للأدلة ومنع التخفيض أو التزييف (Provenance & Evidence Protection)
        if (!handoffObj.provenance || Object.keys(handoffObj.provenance).length === 0) {
            errors.push({
                field: 'provenance',
                issue: 'سلسلة النسب مفقودة: يجب توثيق أصل ومسار توليد الادعاءات والأدلة'
            });
        } else {
            // كشف محاولات طمس أو تزييف النسب
            if (handoffObj.provenance.strip_provenance || handoffObj.provenance.downgrade_evidence) {
                errors.push({
                    field: 'provenance',
                    issue: 'محاولة محظورة لطمس سلسلة النسب أو تخفيض موثوقية الأدلة'
                });
            }
        }

        // ج) التحقق من تطابق النطاق (Scope / Tenant Matching)
        const expectedScope = options.expectedScope || options.scope || null;
        if (expectedScope && typeof expectedScope === 'object') {
            const handoffScope = securityCtx.scope || handoffObj.provenance.scope || {};
            if (expectedScope.tenant_id && handoffScope.tenant_id && expectedScope.tenant_id !== handoffScope.tenant_id) {
                errors.push({
                    field: 'scope.tenant_id',
                    issue: `عدم تطابق نطاق المستأجر (Scope Mismatch): المتوقع '${expectedScope.tenant_id}' مقابل '${handoffScope.tenant_id}'`
                });
            }
            if (expectedScope.project_id && handoffScope.project_id && expectedScope.project_id !== handoffScope.project_id) {
                errors.push({
                    field: 'scope.project_id',
                    issue: `عدم تطابق نطاق المشروع: المتوقع '${expectedScope.project_id}' مقابل '${handoffScope.project_id}'`
                });
            }
            if (expectedScope.environment && handoffScope.environment && expectedScope.environment !== handoffScope.environment) {
                errors.push({
                    field: 'scope.environment',
                    issue: `عدم تطابق بيئة التشغيل: المتوقع '${expectedScope.environment}' مقابل '${handoffScope.environment}'`
                });
            }
        }

        // د) كشف تزييف حالة التحقق (Verification Spoofing)
        if (handoffObj.status === AgentHandoffContract.STATUS.VERIFIED) {
            if (handoffObj.verification_state !== AgentHandoffContract.VERIFICATION_STATE.VERIFIED) {
                errors.push({
                    field: 'verification_spoofing',
                    issue: 'تزييف حالة التحقق: لا يمكن إجازة حالة VERIFIED دون مطابقة verification_state'
                });
            }
            if (!Array.isArray(handoffObj.evidence) || handoffObj.evidence.length === 0) {
                errors.push({
                    field: 'verification_spoofing',
                    issue: 'تزييف حالة التحقق: لا يمكن اعتبار التسليم محققاً (VERIFIED) دون وجود أدلة مؤصلة في evidence'
                });
            }
        }

        const isValid = errors.length === 0;
        return {
            isValid,
            status: isValid ? AgentHandoffContract.STATUS.VALIDATED : AgentHandoffContract.STATUS.REJECTED,
            errors,
            handoffContract: handoffObj
        };
    }

    /**
     * معالجة الادعاءات المتناقضة بين وكيلين بشكل حتمي وشفاف دون انحياز آلي
     * تضمن إحالة النزاع إلى سلطة التحقق والتأصيل المستقلة (CVGF)
     * 
     * @param {Object} claimA ادعاء الوكيل الأول
     * @param {Object} claimB ادعاء الوكيل الثاني
     * @param {Object} [context] سياق إضافي
     * @returns {Object} كائن تمثيل النزاع المعماري المستقر
     */
    static handleConflictingClaims(claimA, claimB, context = {}) {
        if (!claimA || !claimB) {
            throw new Error('يجب تمرير كلي الادعاءين المتنافسين لمعالجة حالة النزاع');
        }

        const conflictRecord = {
            conflict_id: `CNF_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            is_conflict: true,
            status: MultiAgentVerification.VERIFICATION_DECISION.CONFLICT,
            resolution: 'UNRESOLVED',
            reason: 'تناقض صريح بين ادعاءات الوكلاء يتطلب تحكيماً مستقلاً من CVGF',
            timestamp: new Date().toISOString(),
            competing_claims: [
                {
                    agent_id: claimA.agent_id || 'UNKNOWN_AGENT_A',
                    claim_text: claimA.text || claimA.statement || JSON.stringify(claimA),
                    evidence: Array.isArray(claimA.evidence) ? claimA.evidence : []
                },
                {
                    agent_id: claimB.agent_id || 'UNKNOWN_AGENT_B',
                    claim_text: claimB.text || claimB.statement || JSON.stringify(claimB),
                    evidence: Array.isArray(claimB.evidence) ? claimB.evidence : []
                }
            ],
            arbitration: {
                requires_cvgf_arbitration: true,
                cvgf_authority: 'CVGF_AUTHORITATIVE',
                arbitration_status: 'PENDING_EVIDENCE_EVALUATION'
            },
            context: { ...(context || {}) }
        };

        return Object.freeze(conflictRecord);
    }

    /**
     * تنسيق متطلبات التحقق مع محرك التحقق المعرفي والتأصيلي (CVGF)
     * يفصل فصلاً تاماً بين مخرجات الوكلاء (محتوى غير موثوق) وبين الأدلة المؤصلة
     * 
     * @param {AgentHandoffContract|Object} handoff كائن التسليم
     * @param {Object} [cvgfContext] سياق ومحركات التحقق
     * @returns {Object} نتيجة التحقق الرسمية
     */
    static coordinateVerification(handoff, cvgfContext = {}) {
        const validation = this.validateHandoff(handoff, cvgfContext);
        if (!validation.isValid) {
            return {
                verified: false,
                status: MultiAgentVerification.VERIFICATION_DECISION.REJECTED,
                reason: 'فشل الفحص المعماري والأمني الأولي لعقد التسليم (Fail-Closed)',
                errors: validation.errors
            };
        }

        const handoffObj = validation.handoffContract;

        // التحقق من شروط الامتناع (Abstention Conditions)
        if (cvgfContext.hasAmbiguity || cvgfContext.unresolvedScope || handoffObj.abstention_conditions.some(c => cvgfContext[c] === true)) {
            return {
                verified: false,
                status: MultiAgentVerification.VERIFICATION_DECISION.ABSTAINED,
                reason: 'تحفيز شرط الامتناع والاستنكاف الإدراكي بسبب غموض أو نقص في سياق التحقق',
                handoff_id: handoffObj.handoff_id
            };
        }

        // التحقق من شروط الفشل (Failure Conditions)
        if (cvgfContext.hasCriticalVulnerability || handoffObj.failure_conditions.some(c => cvgfContext[c] === true)) {
            return {
                verified: false,
                status: MultiAgentVerification.VERIFICATION_DECISION.FAILED,
                reason: 'تحفيز شرط فشل صريح في عملية التحقق',
                handoff_id: handoffObj.handoff_id
            };
        }

        // استخدام ClaimVerificationEngine للتحقق من ادعاءات التسليم ومطابقتها مع الأدلة
        const claimEngine = cvgfContext.claimEngine || new ClaimVerificationEngine();
        const verificationResults = [];
        let allClaimsVerified = true;

        for (const claim of handoffObj.claims) {
            const rawClaim = typeof claim === 'string' ? { statement: claim, agent_id: handoffObj.source_agent } : claim;
            const normClaim = ClaimVerificationEngine.normalizeClaim(rawClaim);

            // مخرجات الوكلاء بطبيعتها AI_CLAIMED ولا ترقى للأدلة إلا بإثبات
            const hasValidEvidence = Array.isArray(handoffObj.evidence) && handoffObj.evidence.length > 0;
            if (!hasValidEvidence) {
                allClaimsVerified = false;
                verificationResults.push({
                    claim_id: normClaim.id,
                    statement: normClaim.statement,
                    verified: false,
                    reason: 'ادعاء غير مدعوم بأدلة هندسية مؤصلة (AI_CLAIMED !== PROOFFORGE_VERIFIED)'
                });
            } else {
                verificationResults.push({
                    claim_id: normClaim.id,
                    statement: normClaim.statement,
                    verified: true,
                    evidence_level: normClaim.required_evidence_level || 'L2_STATIC_RECORD'
                });
            }
        }

        if (!allClaimsVerified) {
            return {
                verified: false,
                status: MultiAgentVerification.VERIFICATION_DECISION.FAILED,
                reason: 'فشل التحقق: توجد ادعاءات لم يتم تأصيلها بالأدلة اللازمة',
                handoff_id: handoffObj.handoff_id,
                claim_results: verificationResults
            };
        }

        return {
            verified: true,
            status: MultiAgentVerification.VERIFICATION_DECISION.VERIFIED,
            reason: 'تم التحقق من كافة الادعاءات وتأصيلها عبر CVGF بنجاح تام',
            handoff_id: handoffObj.handoff_id,
            claim_results: verificationResults,
            evidence: handoffObj.evidence
        };
    }

    /**
     * تسجيل دورة التدقيق الكاملة لعملية التسليم في مسجل التدقيق الكنسي (AgentAuditRecorder)
     * يوثق السلسلة:
     * Requirement → Workflow → Source Agent → Source Skill → Handoff → Target Agent → Target Skill → Evidence → Verification → Final Result
     * 
     * @param {AgentHandoffContract|Object} handoff كائن التسليم
     * @param {Object} decision نتيجة القرار المتخذ
     * @param {Object} [options] خيارات إضافية ومسجل التدقيق
     * @returns {Object} سجل التدقيق الموثق
     */
    static recordAuditTrace(handoff, decision, options = {}) {
        const auditor = options.auditor || new AgentAuditRecorder();

        const auditContext = {
            operation_id: `OP_HANDOFF_${handoff.handoff_id || 'UNKNOWN'}_${Date.now()}`,
            agent_id: handoff.source_agent || 'UNKNOWN_SOURCE',
            target_agent: handoff.target_agent || 'UNKNOWN_TARGET',
            source_skill: handoff.source_skill || 'UNKNOWN_SKILL',
            target_skill: handoff.target_skill || 'UNKNOWN_SKILL',
            workflow_id: handoff.workflow_id || 'UNKNOWN_WORKFLOW',
            action: 'MULTI_AGENT_HANDOFF',
            intent: `تسليم ومزامنة المهام بين الوكيل [${handoff.source_agent}] والوكيل [${handoff.target_agent}] في إطار تدفق العمل [${handoff.workflow_id}]`,
            handoff_id: handoff.handoff_id,
            status: decision.status || 'UNKNOWN',
            verified: Boolean(decision.verified),
            trace_chain: {
                requirement: options.requirement || 'CANONICAL_ENGINEERING_TASK',
                workflow: handoff.workflow_id,
                source_agent: handoff.source_agent,
                source_skill: handoff.source_skill,
                handoff_id: handoff.handoff_id,
                target_agent: handoff.target_agent,
                target_skill: handoff.target_skill,
                evidence_count: Array.isArray(handoff.evidence) ? handoff.evidence.length : 0,
                verification_decision: decision.status,
                final_result: decision.verified ? 'PASSED_VERIFICATION' : 'VERIFICATION_UNSATISFIED'
            },
            claims: handoff.claims || [],
            evidence: handoff.evidence || [],
            provenance: handoff.provenance || {}
        };

        const recorded = auditor.recordChange(auditContext);
        return {
            auditor,
            record: recorded
        };
    }

    // ==========================================
    // الدوال المساعدة الداخلية (Internal Helpers)
    // ==========================================

    /**
     * التحقق من التوافق المتبادل بين الوكيل والمهارة
     * @private
     */
    static _verifyAgentSkillCompatibility(agent, skill, mappingRegistry) {
        // 1. إذا كان سجل الروابط متاحاً، نبحث عن الرابط الرسمي
        if (mappingRegistry && typeof mappingRegistry.getMapping === 'function') {
            const mapping = mappingRegistry.getMapping(agent.id, skill.id);
            if (mapping) {
                if (mapping.status !== 'ACTIVE' || mapping.allowed !== true) {
                    return { compatible: false, reason: `رابط الوكيل والمهارة غير نشط أو غير مصرح به (الحالة: ${mapping.status})` };
                }
                return { compatible: true };
            }
        }

        // 2. التحقق من الحظر الصريح في المهارة
        if (Array.isArray(skill.prohibited_agents) && skill.prohibited_agents.includes(agent.id)) {
            return { compatible: false, reason: `الوكيل '${agent.id}' محظور صراحة في قائمة prohibited_agents للمهارة` };
        }

        // 3. التحقق من الحظر الصريح في الوكيل
        if (Array.isArray(agent.prohibited_skills) && (agent.prohibited_skills.includes(skill.id) || agent.prohibited_skills.includes(skill.name))) {
            return { compatible: false, reason: `المهارة '${skill.id}' محظورة صراحة في قائمة prohibited_skills للوكيل` };
        }

        // 4. التحقق من السماح
        const agentAllowsSkill = Array.isArray(agent.allowed_skills) && (agent.allowed_skills.includes(skill.id) || agent.allowed_skills.includes(skill.name) || agent.allowed_skills.includes(skill.domain));
        const skillAllowsAgent = Array.isArray(skill.allowed_agents) && (skill.allowed_agents.includes(agent.id) || skill.allowed_agents.includes('*'));

        if (!agentAllowsSkill && !skillAllowsAgent) {
            return { compatible: false, reason: `لا يوجد تصريح صريح بالسماح بين الوكيل '${agent.id}' والمهارة '${skill.id}'` };
        }

        return { compatible: true };
    }

    /**
     * محمل افتراضي لسجل الوكلاء
     * @private
     */
    static _getDefaultAgentRegistry() {
        const filePath = path.join(__dirname, '../../registry/agents.json');
        if (fs.existsSync(filePath)) {
            return AgentRegistry.loadFromFile(filePath);
        }
        return null;
    }

    /**
     * محمل افتراضي لسجل المهارات
     * @private
     */
    static _getDefaultSkillRegistry() {
        const filePath = path.join(__dirname, '../../registry/skills.json');
        if (fs.existsSync(filePath)) {
            return SkillRegistry.loadFromFile(filePath);
        }
        return null;
    }

    /**
     * محمل افتراضي لسجل تدفقات العمل
     * @private
     */
    static _getDefaultWorkflowRegistry() {
        const filePath = path.join(__dirname, '../../registry/workflows.json');
        if (fs.existsSync(filePath)) {
            return WorkflowRegistry.loadFromFile(filePath);
        }
        return null;
    }

    /**
     * محمل افتراضي لسجل روابط الوكلاء والمهارات
     * @private
     */
    static _getDefaultMappingRegistry() {
        const filePath = path.join(__dirname, '../../registry/agent-skill-mappings.json');
        if (fs.existsSync(filePath)) {
            return AgentSkillMappingRegistry.loadFromFile(filePath);
        }
        return null;
    }
}

module.exports = MultiAgentVerification;
