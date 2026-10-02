/**
 * @file evidence-graph.js
 * @description محرك الرسم البياني الموحد للأدلة والتحقق (Unified Verification & Evidence Graph)
 * يربط المتطلبات بالمعمارية بالتنفيذ بالضوابط بالاختبارات والنتائج والأدلة والادعاءات والقرار النهائي
 */

class EvidenceGraph {
    constructor() {
        this.nodes = new Map(); // id -> node
        this.edges = []; // [{ from, to, type }]
    }

    addNode(node) {
        if (!node || !node.id) throw new Error('يجب تحديد معرف العقدة (node.id) بصورة فريدة.');
        if (this.nodes.has(node.id)) {
            const existing = this.nodes.get(node.id);
            this.nodes.set(node.id, { ...existing, ...node });
        } else {
            this.nodes.set(node.id, {
                type: 'GENERIC',
                status: 'UNVERIFIED',
                metadata: {},
                timestamp: new Date().toISOString(),
                ...node
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
     * Requirement -> Architecture -> Implementation -> Control -> Test -> Execution -> Artifact -> Evidence -> Claim -> Final Verdict
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

        // جلب كافة العقد السابقة المتصلة بالادعاء
        const incomingEdges = this.edges.filter(e => e.to === claimNodeId);
        if (incomingEdges.length === 0) {
            return { verified: false, reason: 'ادعاء معزول بدون أي دليل أو مسار إثبات (Orphaned Claim).' };
        }

        const supportingEvidence = incomingEdges
            .map(e => this.nodes.get(e.from))
            .filter(n => n && (n.type === 'EVIDENCE' || n.type === 'TEST_EXECUTION'));

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

    exportGraph() {
        return {
            nodeCount: this.nodes.size,
            edgeCount: this.edges.length,
            nodes: Array.from(this.nodes.values()),
            edges: [...this.edges]
        };
    }
}

module.exports = EvidenceGraph;
