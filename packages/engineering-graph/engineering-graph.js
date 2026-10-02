/**
 * @file engineering-graph.js
 * @description الرسم البياني الهندسي لربط المتطلبات والمكونات والضوابط والاختبارات والأدلة
 * WebForge OS Engineering Graph Engine
 */

class EngineeringGraph {
    constructor() {
        this.nodes = new Map(); // id -> { id, type, label, metadata }
        this.edges = [];        // [{ from, to, relationship, metadata }]
    }

    addNode(id, type, label, metadata = {}) {
        this.nodes.set(id, { id, type, label, metadata });
        return this;
    }

    addEdge(from, to, relationship, metadata = {}) {
        if (!this.nodes.has(from) || !this.nodes.has(to)) {
            throw new Error(`Cannot link edge: Node '${!this.nodes.has(from) ? from : to}' does not exist in graph.`);
        }
        this.edges.push({ from, to, relationship, metadata });
        return this;
    }

    /**
     * حساب مساحة التأثير لأي عقدة عند التعديل (Blast Radius Analysis)
     * @param {string} nodeId 
     * @returns {Object} العقد المتأثرة
     */
    getBlastRadius(nodeId) {
        const affectedNodes = new Set();
        const queue = [nodeId];

        while (queue.length > 0) {
            const current = queue.shift();
            const outgoingEdges = this.edges.filter(e => e.from === current || (e.to === current && e.relationship === 'depends_on'));
            
            outgoingEdges.forEach(edge => {
                const target = edge.from === current ? edge.to : edge.from;
                if (!affectedNodes.has(target) && target !== nodeId) {
                    affectedNodes.add(target);
                    queue.push(target);
                }
            });
        }

        return {
            sourceNode: nodeId,
            affectedNodeIds: Array.from(affectedNodes),
            affectedNodes: Array.from(affectedNodes).map(id => this.nodes.get(id))
        };
    }

    /**
     * فحص مسار التتبع الكامل من المتطلب عبر كافة الحلقات حتى الدليل النهائي
     * @param {string} requirementId 
     * @returns {Object} مسار التتبع الكامل
     */
    traceRequirement(requirementId) {
        const path = [];
        const visited = new Set();
        const queue = [requirementId];

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (visited.has(currentId)) continue;
            visited.add(currentId);

            const currentNode = this.nodes.get(currentId);
            if (currentNode) {
                path.push(currentNode);
            }

            const outgoing = this.edges.filter(e => e.from === currentId);
            outgoing.forEach(edge => {
                if (!visited.has(edge.to)) {
                    queue.push(edge.to);
                }
            });
        }

        const hasTest = path.some(node => node.type === 'test');
        const hasEvidence = path.some(node => node.type === 'evidence');

        return {
            requirementId,
            complete: hasTest || hasEvidence,
            hasTest,
            hasEvidence,
            path
        };
    }
}

module.exports = EngineeringGraph;
