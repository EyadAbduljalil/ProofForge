/**
 * @file engineering-memory.js
 * @description محرك الذاكرة الهندسية والديون الأمنية المركزية (Unified Engineering & Security Memory)
 * يدمج الذاكرة الهندسية الشاملة مع سجل الديون والحوادث الأمنية والقرارات المعمارية
 */

class EngineeringMemory {
    constructor() {
        this.records = {
            past_bugs: new Map(),
            past_fixes: new Map(),
            rejected_fixes: new Map(),
            regression_tests: new Map(),
            false_positives: new Map(),
            false_negatives: new Map(),
            environment_limitations: new Map(),
            successful_repair_patterns: new Map(),
            failed_repair_patterns: new Map(),
            known_risks: new Map(),
            security_debt: new Map(),
            security_incidents: new Map(),
            security_decisions: new Map()
        };

        this._seedSecurityMemory();
    }

    _seedSecurityMemory() {
        // حقن السجلات التاريخية لضمان عدم فقدان أي سياق أمني
        this.recordMemory('security_incidents', 'SEC-INC-001', {
            finding_id: 'SEC-INC-001',
            component: 'packages/security/file-security.js',
            vulnerability: 'Path Traversal via leading directory structure (CWE-22)',
            root_cause: 'Filename sanitizer operated without extracting path.basename first.',
            fix: 'Enforced path.basename prior to regex sanitization.',
            regression_test: 'packages/security/tests/security_expansion.test.js',
            status: 'RESOLVED_AND_VERIFIED'
        });

        this.recordMemory('security_incidents', 'SEC-INC-002', {
            finding_id: 'SEC-INC-002',
            component: 'packages/security/token-manager.js',
            vulnerability: 'Silent rejection of revoked refresh tokens without family invalidation (CWE-294)',
            root_cause: 'verifyToken failed early on expiration before checking revocation record.',
            fix: 'Implemented allowRevokedCheck option to trigger TokenFamily.invalidateAll on replay.',
            regression_test: 'packages/security/tests/security.test.js',
            status: 'RESOLVED_AND_VERIFIED'
        });

        this.recordMemory('security_debt', 'DEBT-001', {
            id: 'DEBT-001',
            description: 'In-Memory Rate Limiter and Nonce Cache not shared across clustered nodes',
            severity: 'MEDIUM',
            affected_component: 'packages/security/rate-limit.js, webhook-verifier.js',
            reason: 'Current environment uses single-process Node.js runtime.',
            status: 'ACCEPTED_TECH_DEBT'
        });
    }

    recordMemory(category, key, data) {
        if (!this.records[category]) {
            this.records[category] = new Map();
        }
        const record = {
            id: key,
            category,
            data,
            recorded_at: new Date().toISOString(),
            applied_count: 1
        };
        this.records[category].set(key, record);
        return record;
    }

    getMemoryRecord(category, key) {
        return this.records[category]?.get(key) || null;
    }

    getCategoryRecords(category) {
        return this.records[category] ? Array.from(this.records[category].values()) : [];
    }

    /**
     * البحث عن نمط حل هندسي أو أمني سابق مشابه للمشكلة الحالية
     */
    findSimilarPattern(finding) {
        const matches = [];
        const queryText = `${finding.category || ''} ${finding.title || ''} ${finding.rule_id || ''}`.toLowerCase();

        for (const [key, record] of this.records.successful_repair_patterns.entries()) {
            const patternDesc = `${key} ${JSON.stringify(record.data)}`.toLowerCase();
            if (queryText.split(' ').some(word => word.length > 3 && patternDesc.includes(word))) {
                matches.push({
                    pattern_id: key,
                    confidence: 'HIGH',
                    recommended_fix: record.data.fix,
                    regression_test: record.data.regression_test
                });
            }
        }

        // فحص الذاكرة الأمنية المشتركة
        for (const [key, record] of this.records.security_incidents.entries()) {
            const incDesc = `${key} ${JSON.stringify(record.data)}`.toLowerCase();
            if (queryText.split(' ').some(word => word.length > 3 && incDesc.includes(word))) {
                matches.push({
                    pattern_id: key,
                    confidence: 'VERY_HIGH',
                    recommended_fix: record.data.fix,
                    regression_test: record.data.regression_test
                });
            }
        }

        return matches;
    }

    getRegressionTestsForCategory(category) {
        const list = [];
        for (const [key, record] of this.records.regression_tests.entries()) {
            if (record.data.category === category || category === 'ALL') {
                list.push({ testId: key, ...record.data });
            }
        }
        return list;
    }

    recordSecurityDebt(debtData = {}) {
        const id = debtData.id || `DEBT_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        return this.recordMemory('security_debt', id, { id, ...debtData });
    }

    getSecurityDebt() {
        return this.getCategoryRecords('security_debt').map(r => r.data || r);
    }

    recordSecurityDecision(decisionData = {}) {
        const id = decisionData.id || `SEC_DEC_${Date.now()}`;
        return this.recordMemory('security_decisions', id, { id, ...decisionData });
    }

    /**
     * تسجيل معالجة فشل بنجاح مع إزالة التكرارات والربط باختبارات الانحدار
     */
    recordResolvedFailure(failureData = {}) {
        const signature = failureData.failure_signature || `${failureData.category || 'UNKNOWN'}_${failureData.root_cause || 'GENERIC'}`;
        const key = `RESOLVED_${signature.replace(/[^a-zA-Z0-9_]/g, '_')}`;

        const existing = this.getMemoryRecord('past_fixes', key);
        if (existing) {
            existing.applied_count = (typeof existing.applied_count === 'number' ? existing.applied_count : 0) + 1;
            existing.data.last_occurred_at = new Date().toISOString();
            existing.data.verification_result = failureData.verification_result || existing.data.verification_result;
            return existing;
        }

        const resolvedRecord = {
            id: key,
            failure_signature: signature,
            root_cause: failureData.root_cause || 'Root cause determined',
            repair_strategy: failureData.repair_strategy || failureData.fix || 'Adaptive Strategy',
            changed_components: Array.isArray(failureData.changed_components) ? failureData.changed_components : [],
            verification_result: failureData.verification_result || 'VERIFIED',
            regression_test: failureData.regression_test || null,
            risk: failureData.risk || 'LOW',
            environment: failureData.environment || 'local_workspace',
            timestamp: new Date().toISOString()
        };

        return this.recordMemory('past_fixes', key, resolvedRecord);
    }

    getResolvedFailures() {
        return this.getCategoryRecords('past_fixes').map(r => r.data || r);
    }

    exportMemoryState() {
        const state = {};
        for (const [cat, map] of Object.entries(this.records)) {
            state[cat] = Array.from(map.values());
        }
        return state;
    }
}

module.exports = EngineeringMemory;
