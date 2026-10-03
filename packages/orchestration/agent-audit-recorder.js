/**
 * @file agent-audit-recorder.js
 * @description سجل تدقيق وتوثيق تغييرات وكيل الذكاء الاصطناعي (AI Change Record & Agent Audit)
 * يضمن التتبع الكامل لكل تعديل برمجي أو معماري مع ذكاء الفروقات (Diff Intelligence) وتطهير الأسرار
 */

const RISK_LEVELS = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

const DIFF_ANALYSIS_LEVELS = {
    RAW_DIFF: 'RAW_DIFF',
    STRUCTURAL_ANALYSIS: 'STRUCTURAL_ANALYSIS',
    SEMANTIC_ANALYSIS: 'SEMANTIC_ANALYSIS'
};

class AgentAuditRecorder {
    constructor() {
        this.auditLog = [];
    }

    /**
     * تسجيل عملية تعديل أو قرار هندسي من الوكيل
     */
    recordChange(changeContext = {}) {
        if (!changeContext || !changeContext.intent) {
            throw new Error('يجب تحديد القصد المعماري للتغيير (intent) في سجل التدقيق.');
        }

        const filesChanged = Array.isArray(changeContext.filesChanged) ? changeContext.filesChanged : [];
        const diffSummary = this.analyzeDiff(changeContext.diff || changeContext.rawDiff || '', filesChanged);
        const detectedRisk = changeContext.detectedRisk || this.classifyChangeRisk(filesChanged, changeContext.intent, diffSummary);

        const changeRecord = {
            operation_id: changeContext.operation_id || `OP_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            changeId: changeContext.changeId || `CHG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            agent_id: changeContext.agent_id || changeContext.agentName || 'WebForge_Autonomous_Agent',
            agentName: changeContext.agentName || 'WebForge_Autonomous_Agent',
            timestamp: new Date().toISOString(),
            recordedAt: new Date().toISOString(),
            task_id: changeContext.task_id || changeContext.userTask || 'TASK_UNSPECIFIED',
            userTask: changeContext.userTask || 'Unspecified user task',
            action: changeContext.action || 'CODE_MODIFICATION',
            intent: this._sanitizeText(changeContext.intent),
            target: changeContext.target || (filesChanged.length > 0 ? filesChanged[0] : 'workspace'),
            filesChanged,
            files_changed: filesChanged,
            diff_summary: diffSummary,
            diffSummary,
            commands: Array.isArray(changeContext.commands) ? changeContext.commands.map(c => this._sanitizeText(c)) : [],
            tools: Array.isArray(changeContext.tools) ? changeContext.tools : [],
            tests: Array.isArray(changeContext.testsExecuted) ? changeContext.testsExecuted : [],
            testsExecuted: Array.isArray(changeContext.testsExecuted) ? changeContext.testsExecuted : [],
            verification: changeContext.verification || 'AUTOMATED_VERIFICATION_PENDING',
            risk: detectedRisk,
            detectedRisk,
            approval: changeContext.approval || (['HIGH', 'CRITICAL'].includes(detectedRisk) ? 'REQUIRES_HUMAN_CONFIRMATION' : 'AUTO_APPROVED'),
            checkpoint: changeContext.rollbackPoint || `checkpoint_${Date.now()}`,
            rollbackPoint: changeContext.rollbackPoint || `checkpoint_${Date.now()}`,
            rollback: changeContext.rollback || null,
            architectureImpact: changeContext.architectureImpact || 'LOCAL_COMPONENT_MODIFICATION',
            securityImpact: changeContext.securityImpact || 'NO_CRITICAL_IMPACT',
            evidence: this._sanitizeText(changeContext.evidence || 'Test execution output attached'),
            finalVerdict: changeContext.finalVerdict || 'VERIFIED_AND_ACCEPTED',
            result: changeContext.finalVerdict || 'VERIFIED_AND_ACCEPTED'
        };

        this.auditLog.push(changeRecord);
        return changeRecord;
    }

    /**
     * تحليل ذكي للفروقات البرمجية (Diff Intelligence)
     */
    analyzeDiff(rawDiff = '', filesChanged = []) {
        const diffText = String(rawDiff);
        const lines = diffText.split('\n');

        let linesAdded = 0;
        let linesRemoved = 0;
        let securitySensitive = false;
        let databaseChanges = false;
        let apiContractChanges = false;
        let configurationChanged = false;
        let dependenciesChanged = false;

        for (const line of lines) {
            if (line.startsWith('+') && !line.startsWith('+++')) linesAdded++;
            if (line.startsWith('-') && !line.startsWith('---')) linesRemoved++;
            
            const lower = line.toLowerCase();
            if (lower.includes('password') || lower.includes('auth') || lower.includes('token') || lower.includes('permission') || lower.includes('csrf') || lower.includes('secret')) {
                securitySensitive = true;
            }
            if (lower.includes('table') || lower.includes('schema') || lower.includes('migration') || lower.includes('query') || lower.includes('sql') || lower.includes('database')) {
                databaseChanges = true;
            }
            if (lower.includes('api') || lower.includes('route') || lower.includes('endpoint') || lower.includes('request') || lower.includes('response')) {
                apiContractChanges = true;
            }
            if (lower.includes('dependencies') || lower.includes('package.json') || lower.includes('lock')) {
                dependenciesChanged = true;
            }
        }

        for (const file of filesChanged) {
            const fLower = file.toLowerCase();
            if (fLower.includes('config') || fLower.endsWith('.env') || fLower.endsWith('.json') || fLower.endsWith('.yaml')) configurationChanged = true;
            if (fLower.includes('security') || fLower.includes('auth') || fLower.includes('guard')) securitySensitive = true;
            if (fLower.includes('db') || fLower.includes('storage') || fLower.includes('model')) databaseChanges = true;
            if (fLower.includes('route') || fLower.includes('server') || fLower.includes('api')) apiContractChanges = true;
        }

        return {
            analysis_level: rawDiff ? DIFF_ANALYSIS_LEVELS.STRUCTURAL_ANALYSIS : DIFF_ANALYSIS_LEVELS.RAW_DIFF,
            files_added: filesChanged.filter(f => !f.includes('deleted')),
            files_modified: filesChanged,
            files_deleted: [],
            lines_added: linesAdded,
            lines_removed: linesRemoved,
            security_sensitive_changes: securitySensitive,
            database_changes: databaseChanges,
            API_contract_changes: apiContractChanges,
            configuration_changed: configurationChanged,
            dependencies_changed: dependenciesChanged
        };
    }

    /**
     * تصنيف مخاطر التغيير بناءً على السياق والملفات والفروقات
     */
    classifyChangeRisk(filesChanged = [], intent = '', diffSummary = {}) {
        const intentLower = String(intent).toLowerCase();
        
        // Critical Signals
        if (intentLower.includes('payment') || intentLower.includes('migration') || intentLower.includes('drop table') || intentLower.includes('delete all')) {
            return RISK_LEVELS.CRITICAL;
        }

        // High Signals
        if (diffSummary.security_sensitive_changes || intentLower.includes('auth') || intentLower.includes('permission') || intentLower.includes('secret') || intentLower.includes('token') || filesChanged.some(f => f.includes('security'))) {
            return RISK_LEVELS.HIGH;
        }

        // Medium Signals
        if (diffSummary.database_changes || diffSummary.API_contract_changes || diffSummary.dependencies_changed || filesChanged.some(f => f.includes('server') || f.includes('db'))) {
            return RISK_LEVELS.MEDIUM;
        }

        return RISK_LEVELS.LOW;
    }

    _sanitizeText(text) {
        if (typeof text !== 'string') return text;
        return text
            .replace(/((?:password|secret|token|key|api_key|auth|bearer|pwd|client_secret)=)([^\s&"'\`,;]+)/gi, '$1[REDACTED]')
            .replace(/(["']?(?:password|secret|token|apiKey|key|clientSecret|auth)["']?\s*:\s*["'])([^"']*)(["'])/gi, '$1[REDACTED]$3')
            .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED_TOKEN]')
            .replace(/\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+\b/g, '[REDACTED_JWT]')
            .replace(/-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]')
            .replace(/\b(?:sk_live_|ghp_|npm_|AKIA)[a-zA-Z0-9_]{8,}\b/g, '[REDACTED_API_KEY]')
            .replace(/([a-zA-Z0-9+.-]+:\/\/[^:\s]+:)([^@\s]+)(@)/gi, '$1[REDACTED]$3');
    }

    _sanitizeDeep(val) {
        if (typeof val === 'string') {
            return this._sanitizeText(val);
        }
        if (Array.isArray(val)) {
            return val.map(item => this._sanitizeDeep(item));
        }
        if (val !== null && typeof val === 'object') {
            const result = {};
            for (const [k, v] of Object.entries(val)) {
                result[k] = this._sanitizeDeep(v);
            }
            return result;
        }
        return val;
    }

    getAuditTrail() {
        return [...this.auditLog];
    }

    /**
     * تسجيل تدقيق لعملية التحقق من ادعاء (C2 Claim Verification Audit)
     */
    recordClaimVerification(claimRecord = {}) {
        const auditEntry = {
            id: `AUD_CLM_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            eventType: 'CLAIM_VERIFICATION',
            claimId: claimRecord.claim_id || 'UNKNOWN_CLAIM',
            status: claimRecord.status || 'UNVERIFIED',
            verified: Boolean(claimRecord.verified),
            reason: this._sanitizeText(claimRecord.reason || ''),
            evaluatedEvidencesCount: claimRecord.evaluatedEvidencesCount || claimRecord.supportingCount || 0,
            timestamp: new Date().toISOString()
        };
        this.auditLog.push(auditEntry);
        return auditEntry;
    }

    /**
     * تسجيل تدقيق لنزاع بين أدلة (C2 Evidence Conflict Audit)
     */
    recordEvidenceConflict(conflictRecord = {}) {
        const auditEntry = {
            id: `AUD_CNF_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            eventType: 'EVIDENCE_CONFLICT',
            claimId: conflictRecord.claimId || 'UNKNOWN_CLAIM',
            conflictType: conflictRecord.conflictType || 'EVIDENCE_CONTRADICTION',
            supportingCount: conflictRecord.supportingCount || 0,
            contradictingCount: conflictRecord.contradictingCount || 0,
            timestamp: new Date().toISOString()
        };
        this.auditLog.push(auditEntry);
        return auditEntry;
    }

    /**
     * تسجيل تدقيق لإبطال دليل متقادم (C2 Evidence Invalidation Audit)
     */
    recordEvidenceInvalidation(invalidationRecord = {}) {
        const auditEntry = {
            id: `AUD_INV_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            eventType: 'EVIDENCE_INVALIDATION',
            evidenceId: invalidationRecord.evidenceId || 'UNKNOWN_EVIDENCE',
            reason: this._sanitizeText(invalidationRecord.reason || 'Artifact mutation'),
            timestamp: new Date().toISOString()
        };
        this.auditLog.push(auditEntry);
        return auditEntry;
    }

    /**
     * تسجيل تدقيق عام لإجراءات الوكيل وبوابات الجودة والتأصيل (General Agent Action / Grounding Audit)
     */
    recordAgentAction(actionContext = {}) {
        const auditEntry = {
            id: `AUD_ACT_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            eventType: 'AGENT_ACTION',
            action: actionContext.action || 'UNSPECIFIED_ACTION',
            verdict: actionContext.verdict || null,
            decision: actionContext.decision || null,
            grounded: actionContext.grounded !== undefined ? actionContext.grounded : null,
            reason: this._sanitizeText(actionContext.reason || ''),
            intent: this._sanitizeText(actionContext.intent || ''),
            task_id: actionContext.task_id || 'UNSPECIFIED_TASK',
            metadata: this._sanitizeDeep(actionContext.metadata || {}),
            timestamp: new Date().toISOString()
        };
        this.auditLog.push(auditEntry);
        return auditEntry;
    }
}

AgentAuditRecorder.RISK_LEVELS = RISK_LEVELS;
AgentAuditRecorder.DIFF_ANALYSIS_LEVELS = DIFF_ANALYSIS_LEVELS;

module.exports = AgentAuditRecorder;

