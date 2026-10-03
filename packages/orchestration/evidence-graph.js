/**
 * @file evidence-graph.js
 * @description محرك الرسم البياني الموحد للأدلة والتحقق (Unified Verification & Evidence Graph)
 * يربط المتطلبات بالمعمارية بالتنفيذ بالضوابط بالاختبارات والنتائج والأدلة والادعاءات والقرار النهائي
 * يدعم التصدير بصيغ JSON, Mermaid, Graphviz DOT مع تطهير كامل للأسرار
 */

class EvidenceGraph {
    constructor() {
        this.nodes = new Map(); // id -> node
        this.edges = []; // [{ from, to, type, timestamp }]
    }

    addNode(node) {
        if (!node || !node.id) throw new Error('يجب تحديد معرف العقدة (node.id) بصورة فريدة.');
        const sanitized = this._sanitizeNode(node);
        if (this.nodes.has(node.id)) {
            const existing = this.nodes.get(node.id);
            this.nodes.set(node.id, { ...existing, ...sanitized });
        } else {
            this.nodes.set(node.id, {
                type: 'GENERIC',
                status: 'UNVERIFIED',
                metadata: {},
                timestamp: new Date().toISOString(),
                ...sanitized
            });
        }
        return this.nodes.get(node.id);
    }

    addEdge(fromId, toId, type = 'RELATES_TO') {
        if (!this.nodes.has(fromId)) throw new Error(`العقدة المصدر '${fromId}' غير موجودة في الرسم البياني.`);
        if (!this.nodes.has(toId)) throw new Error(`العقدة الهدف '${toId}' غير موجودة في الرسم البياني.`);

        // منع تكرار الحواف
        const exists = this.edges.some(e => e.from === fromId && e.to === toId && e.type === type);
        if (!exists) {
            this.edges.push({ from: fromId, to: toId, type, timestamp: new Date().toISOString() });
        }
    }

    /**
     * تتبع مسار الدليل الكامل من المتطلب حتى الحكم النهائي
     * Requirement -> Decision -> Implementation -> Tool -> Test -> Runtime Evidence -> Finding -> Fix -> Regression Test -> Verification
     */
    tracePath(startNodeId) {
        if (!this.nodes.has(startNodeId)) return [];
        const visited = new Set();
        const path = [];

        const dfs = (currentId) => {
            visited.add(currentId);
            path.push(this.nodes.get(currentId));
            const outgoing = this.edges.filter(e => e.from === currentId);
            for (const edge of outgoing) {
                if (!visited.has(edge.to)) {
                    dfs(edge.to);
                }
            }
        };

        dfs(startNodeId);
        return path;
    }

    /**
     * التحقق من سلامة الادعاء (Claim Integrity): لا يمكن قبول ادعاء إلا إذا وجد مسار دليل مكتمل ينتهي بـ TEST_PASS
     */
    verifyClaimIntegrity(claimNodeId) {
        const claimNode = this.nodes.get(claimNodeId);
        if (!claimNode) return { verified: false, reason: 'الادعاء غير مسجل في الرسم البياني.' };

        const incomingEdges = this.edges.filter(e => e.to === claimNodeId);
        if (incomingEdges.length === 0) {
            return { verified: false, reason: 'ادعاء معزول بدون أي دليل أو مسار إثبات (Orphaned Claim).' };
        }

        const supportingEvidence = incomingEdges
            .map(e => this.nodes.get(e.from))
            .filter(n => n && (n.type === 'EVIDENCE' || n.type === 'TEST_EXECUTION' || n.type === 'RUNTIME_EVIDENCE'));

        if (supportingEvidence.length === 0) {
            return { verified: false, reason: 'لا يوجد دليل داعم أو تنفيذ اختبار مباشر يثبت هذا الادعاء.' };
        }

        const allPassed = supportingEvidence.every(ev => ev.status === 'PASSED' || ev.status === 'VERIFIED');
        if (!allPassed) {
            return { verified: false, reason: 'توجد اختبارات أو أدلة داعمة فاشلة أو غير مستوفية للشروط.' };
        }

        return {
            verified: true,
            supportingNodesCount: supportingEvidence.length,
            claim: claimNode.id,
            verdict: 'VERIFIED_WITH_RIGOROUS_EVIDENCE'
        };
    }

    /**
     * ربط تعاقدي بين ادعاء ودليل إثبات (C2 Claim-Evidence Linkage)
     * العلاقات المدعومة: SUPPORTS, CONTRADICTS, QUALIFIES, SUPERSEDES, DERIVED_FROM, INVALIDATES, INSUFFICIENT_FOR
     */
    linkClaimToEvidence(claimId, evidenceId, relationType = 'SUPPORTS', metadata = {}) {
        if (!this.nodes.has(claimId)) throw new Error(`عقدة الادعاء '${claimId}' غير موجودة.`);
        if (!this.nodes.has(evidenceId)) throw new Error(`عقدة الدليل '${evidenceId}' غير موجودة.`);

        const validRelations = ['SUPPORTS', 'CONTRADICTS', 'QUALIFIES', 'SUPERSEDES', 'DERIVED_FROM', 'INVALIDATES', 'INSUFFICIENT_FOR'];
        const relation = validRelations.includes(relationType) ? relationType : 'SUPPORTS';

        this.addEdge(evidenceId, claimId, relation);
        
        // تحديث بيانات الارتباط في العقدة
        const evidenceNode = this.nodes.get(evidenceId);
        if (metadata.artifact_hash) evidenceNode.artifact_hash = metadata.artifact_hash;
        if (metadata.provenance) evidenceNode.provenance = metadata.provenance;
        if (metadata.temporal_status) evidenceNode.temporal_status = metadata.temporal_status;
        
        return {
            claimId,
            evidenceId,
            relation,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * كشف نزاعات الأدلة المرتبطة بادعاء معين (C2 Evidence Conflict Detection)
     * Rule Conflict !== Evidence Conflict
     */
    detectEvidenceConflicts(claimId) {
        if (!this.nodes.has(claimId)) return { hasConflict: false, conflicts: [] };

        const incomingEdges = this.edges.filter(e => e.to === claimId);
        const supporting = [];
        const contradicting = [];

        for (const edge of incomingEdges) {
            const evNode = this.nodes.get(edge.from);
            if (!evNode) continue;

            if (edge.type === 'SUPPORTS' && (evNode.status === 'PASSED' || evNode.status === 'VERIFIED')) {
                supporting.push(evNode);
            } else if (edge.type === 'CONTRADICTS' || evNode.status === 'CONTRADICTING') {
                contradicting.push(evNode);
            }
        }

        const hasConflict = supporting.length > 0 && contradicting.length > 0;
        return {
            hasConflict,
            claimId,
            supportingCount: supporting.length,
            contradictingCount: contradicting.length,
            supportingNodes: supporting.map(n => n.id),
            contradictingNodes: contradicting.map(n => n.id),
            conflictType: hasConflict ? 'DIRECT_EVIDENCE_CONTRADICTION' : 'NONE'
        };
    }

    /**
     * إبطال الأدلة المتقادمة عند تغير بصمة الملف المستهدف (C2 Temporal & Artifact Invalidation)
     */
    invalidateByArtifactHash(artifactPath, currentHash) {
        const invalidatedNodes = [];
        for (const [nodeId, node] of this.nodes.entries()) {
            if (node.artifactPath === artifactPath || (node.metadata && node.metadata.targetArtifact === artifactPath)) {
                if (node.artifact_hash && node.artifact_hash !== currentHash) {
                    node.status = 'INVALIDATED';
                    node.temporal_status = 'STALE_MUTATED';
                    node.invalidationReason = `Artifact content changed: recorded ${node.artifact_hash} !== current ${currentHash}`;
                    invalidatedNodes.push(nodeId);
                }
            }
        }
        return {
            artifactPath,
            currentHash,
            invalidatedCount: invalidatedNodes.length,
            invalidatedNodes
        };
    }

    /**
     * إبطال دليل محدد مع ذكر السبب الصريح
     */
    invalidateEvidence(evidenceId, reason = 'Evidence superseded or invalidated') {
        const node = this.nodes.get(evidenceId);
        if (!node) return null;
        node.status = 'INVALIDATED';
        node.temporal_status = 'INVALIDATED';
        node.invalidationReason = reason;
        node.invalidatedAt = new Date().toISOString();
        return node;
    }

    /**
     * الحصول على الوضع الشامل لأدلة الادعاء (C2 Claim Evidence Status)
     */
    getClaimEvidenceStatus(claimId) {
        const claimNode = this.nodes.get(claimId);
        if (!claimNode) return { status: 'NOT_FOUND' };

        const conflicts = this.detectEvidenceConflicts(claimId);
        const incomingEdges = this.edges.filter(e => e.to === claimId);
        const evidences = incomingEdges.map(e => ({
            edgeType: e.type,
            evidence: this.nodes.get(e.from)
        })).filter(item => item.evidence);

        let overallStatus = 'UNVERIFIED';
        if (conflicts.hasConflict) {
            overallStatus = 'CONFLICTED';
        } else if (evidences.some(ev => ev.evidence.status === 'INVALIDATED')) {
            overallStatus = 'STALE_OR_INVALIDATED';
        } else if (evidences.length === 0) {
            overallStatus = 'INSUFFICIENT_EVIDENCE';
        } else {
            const integrity = this.verifyClaimIntegrity(claimId);
            overallStatus = integrity.verified ? 'VERIFIED' : 'INSUFFICIENT_EVIDENCE';
        }

        return {
            claimId,
            claim: claimNode,
            overallStatus,
            evidenceCount: evidences.length,
            conflicts,
            evidences
        };
    }

    /**
     * تسجيل دورة تتبع كاملة: Failure -> Finding -> Decision -> Repair -> Test -> Verification -> Outcome
     */
    recordRepairCycleTrace(cycleData = {}) {
        const failureId = cycleData.failureId || `FAIL_${Date.now()}`;
        const findingId = cycleData.findingId || `FIND_${Date.now()}`;
        const decisionId = cycleData.decisionId || `DEC_${Date.now()}`;
        const repairId = cycleData.repairId || `REP_${Date.now()}`;
        const testId = cycleData.testId || `TEST_${Date.now()}`;
        const outcomeId = cycleData.outcomeId || `OUT_${Date.now()}`;

        this.addNode({ id: failureId, type: 'FAILURE', ...cycleData.failure });
        this.addNode({ id: findingId, type: 'FINDING', ...cycleData.finding });
        this.addNode({ id: decisionId, type: 'DECISION', ...cycleData.decision });
        this.addNode({ id: repairId, type: 'REPAIR', ...cycleData.repair });
        this.addNode({ id: testId, type: 'TEST_EXECUTION', status: cycleData.testStatus || 'PASSED', ...cycleData.test });
        this.addNode({ id: outcomeId, type: 'CLAIM', status: cycleData.outcomeStatus || 'VERIFIED', ...cycleData.outcome });

        this.addEdge(failureId, findingId, 'IDENTIFIED_AS');
        this.addEdge(findingId, decisionId, 'DRIVES_DECISION');
        this.addEdge(decisionId, repairId, 'APPLIES_REPAIR');
        this.addEdge(repairId, testId, 'VALIDATED_BY');
        this.addEdge(testId, outcomeId, 'PROVES');

        return {
            traceId: `TRACE_${failureId}_${outcomeId}`,
            failureId,
            outcomeId,
            path: [failureId, findingId, decisionId, repairId, testId, outcomeId]
        };
    }

    getFailureRepairTrace(failureId) {
        return this.tracePath(failureId);
    }

    exportGraph() {
        return {
            nodeCount: this.nodes.size,
            edgeCount: this.edges.length,
            nodes: Array.from(this.nodes.values()).map(n => this._sanitizeNode(n)),
            edges: [...this.edges]
        };
    }

    exportJson() {
        return JSON.stringify(this.exportGraph(), null, 2);
    }

    exportMermaid() {
        let mermaid = 'graph TD\n';
        const sortedNodes = Array.from(this.nodes.values()).sort((a, b) => a.id.localeCompare(b.id));
        for (const node of sortedNodes) {
            const cleanLabel = this._cleanString(node.title || node.name || node.id);
            mermaid += `    ${this._sanitizeId(node.id)}["${node.id}: ${cleanLabel}"]\n`;
        }
        for (const edge of this.edges) {
            mermaid += `    ${this._sanitizeId(edge.from)} -->|${edge.type}| ${this._sanitizeId(edge.to)}\n`;
        }
        return mermaid;
    }

    exportDot() {
        let dot = 'digraph EvidenceGraph {\n';
        dot += '    rankdir=LR;\n';
        dot += '    node [shape=box, style=rounded, fontname="Helvetica"];\n';
        const sortedNodes = Array.from(this.nodes.values()).sort((a, b) => a.id.localeCompare(b.id));
        for (const node of sortedNodes) {
            const cleanLabel = this._cleanString(node.title || node.name || node.id);
            dot += `    "${this._sanitizeId(node.id)}" [label="${node.id}\\n${cleanLabel}"];\n`;
        }
        for (const edge of this.edges) {
            dot += `    "${this._sanitizeId(edge.from)}" -> "${this._sanitizeId(edge.to)}" [label="${edge.type}"];\n`;
        }
        dot += '}\n';
        return dot;
    }

    _sanitizeId(id) {
        return String(id).replace(/[^a-zA-Z0-9_]/g, '_');
    }

    _cleanString(str) {
        return String(str).replace(/["\\]/g, '').replace(/[\r\n]+/g, ' ').substring(0, 80);
    }

    _sanitizeNode(node) {
        if (!node || typeof node !== 'object') return node;
        const copy = JSON.parse(JSON.stringify(node));
        const sanitizeValue = (val) => {
            if (typeof val !== 'string') return val;
            return val
                .replace(/((?:password|secret|token|key|api_key|auth|bearer|pwd|client_secret)=)([^\s&"'\`,;]+)/gi, '$1[REDACTED_SECRET]')
                .replace(/(["']?(?:password|secret|token|apiKey|key|clientSecret|auth)["']?\s*:\s*["'])([^"']*)(["'])/gi, '$1[REDACTED_SECRET]$3')
                .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED_TOKEN]')
                .replace(/\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+\b/g, '[REDACTED_JWT]')
                .replace(/-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]')
                .replace(/\b(?:sk_live_|ghp_|npm_|AKIA)[a-zA-Z0-9_]{8,}\b/g, '[REDACTED_API_KEY]')
                .replace(/([a-zA-Z0-9+.-]+:\/\/[^:\s]+:)([^@\s]+)(@)/gi, '$1[REDACTED_SECRET]$3');
        };
        const scrub = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            for (const key of Object.keys(obj)) {
                if (/^(?:password|secret|token|apiKey|api_key|cred|auth|private_key|client_secret)$/i.test(key) && typeof obj[key] === 'string') {
                    obj[key] = '[REDACTED_SECRET]';
                } else if (typeof obj[key] === 'string') {
                    obj[key] = sanitizeValue(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    scrub(obj[key]);
                }
            }
        };
        scrub(copy);
        return copy;
    }
}

module.exports = EvidenceGraph;
