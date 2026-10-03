/**
 * @file evidence-intelligence.js
 * @description WebForge V2 — Evidence Provenance, Confidence, Cryptographic Integrity & Tamper Detection
 * يدير إثباتات الأدلة الثبوتية، مستويات الثقة، البصمات المشفرة، واكتشاف التلاعب في سجلات التدقيق (Hash-Chain Tamper Detection).
 */

const crypto = require('crypto');

const CONFIDENCE_LEVELS = {
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
    UNKNOWN: 'UNKNOWN'
};

class EvidenceRecord {
    constructor(config = {}) {
        this.id = config.id || `EVD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        this.source = config.source || 'AUTOMATED_SUITE';
        this.sourceType = config.sourceType || 'CODE_INSPECTION'; // CODE_INSPECTION, TEST_RUN, STATIC_ANALYSIS, POLICY
        this.file = config.file || 'unknown';
        this.line = config.line || null;
        this.tool = config.tool || 'webforge-core';
        this.toolVersion = config.toolVersion || '2.0.0';
        this.timestamp = config.timestamp || new Date().toISOString();
        this.project = config.project || 'PRJ-DEFAULT';
        this.rule = config.rule || 'RULE-GENERAL';
        this.validator = config.validator || 'VAL-GENERAL';
        this.confidence = config.confidence || CONFIDENCE_LEVELS.HIGH;
        this.data = config.data || {};
        this.integrityHash = this.calculateHash();
    }

    calculateHash() {
        const payload = JSON.stringify({
            id: this.id,
            source: this.source,
            sourceType: this.sourceType,
            file: this.file,
            line: this.line,
            tool: this.tool,
            toolVersion: this.toolVersion,
            timestamp: this.timestamp,
            project: this.project,
            rule: this.rule,
            validator: this.validator,
            confidence: this.confidence,
            data: this.data
        });
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    verifyIntegrity() {
        return this.calculateHash() === this.integrityHash;
    }
}

class FingerprintEngine {
    /**
     * حساب بصمة حتمية لبيانات مصفوفية أو كائنات
     */
    static computeFingerprint(data) {
        if (!data) return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // empty sha256
        const sortedString = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
        return crypto.createHash('sha256').update(sortedString).digest('hex');
    }
}

class AuditLogTamperDetector {
    constructor() {
        this.chain = [];
    }

    /**
     * إضافة سجل تدقيق في سلسلة الهاش المتصلة (Hash-Chain)
     */
    appendLog(entry) {
        const previousHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : 'GENESIS_BLOCK_0000000000000000';
        const timestamp = new Date().toISOString();
        const payload = JSON.stringify({
            sequence: this.chain.length,
            previousHash,
            entry,
            timestamp
        });
        const hash = crypto.createHash('sha256').update(payload).digest('hex');

        const block = {
            sequence: this.chain.length,
            previousHash,
            entry,
            timestamp,
            hash
        };

        this.chain.push(block);
        return block;
    }

    /**
     * التحقق من سلامة سلسلة السجلات واكتشاف أي تعديل أو تلاعب
     */
    verifyChainIntegrity() {
        for (let i = 0; i < this.chain.length; i++) {
            const current = this.chain[i];
            const expectedPrevHash = i === 0 ? 'GENESIS_BLOCK_0000000000000000' : this.chain[i - 1].hash;

            if (current.previousHash !== expectedPrevHash) {
                return {
                    intact: false,
                    tamperedAt: i,
                    reason: `انقطاع في سلسلة التجزئة: الهاش السابق غير متطابق في السجل ${i}`
                };
            }

            const payload = JSON.stringify({
                sequence: current.sequence,
                previousHash: current.previousHash,
                entry: current.entry,
                timestamp: current.timestamp
            });
            const recomputed = crypto.createHash('sha256').update(payload).digest('hex');

            if (recomputed !== current.hash) {
                return {
                    intact: false,
                    tamperedAt: i,
                    reason: `تم التلاعب بمحتوى السجل ${i}: الهاش المحسوب لا يطابق الهاش المسجل`
                };
            }
        }

        return {
            intact: true,
            totalRecords: this.chain.length,
            latestHash: this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : null
        };
    }
}

class EvidenceIntegrityVerifier {
    /**
     * التحقق من سلامة وتطابق حزمة الأدلة
     */
    static verifyEvidenceSet(evidenceList = []) {
        const issues = [];
        let validCount = 0;

        for (const ev of evidenceList) {
            if (!(ev instanceof EvidenceRecord)) {
                issues.push({ id: ev.id || 'UNKNOWN', issue: 'دليل غير مطابق للمخطط المعياري EvidenceRecord' });
                continue;
            }
            if (!ev.verifyIntegrity()) {
                issues.push({ id: ev.id, issue: 'فشل التحقق من هاش سلامة الدليل (Hash mismatch)' });
                continue;
            }
            validCount++;
        }

        return {
            total: evidenceList.length,
            valid: validCount,
            compromised: issues.length,
            issues
        };
    }
}

module.exports = {
    CONFIDENCE_LEVELS,
    EvidenceRecord,
    FingerprintEngine,
    AuditLogTamperDetector,
    EvidenceIntegrityVerifier
};
