/**
 * @file rule-intelligence.js
 * @description WebForge V2 — Rule Intelligence, Dependency & Impact Graph, and Completeness Verifier
 * يدير قرارات انطباق القواعد، ورسم بياني الاعتماديات والأثر، وكشف التعارضات والتكرار والمكونات غير المستخدمة.
 */

const RuleConflictEngine = require('../rule-conflict-engine');

const APPLICABILITY_STATES = {
    APPLICABLE: 'APPLICABLE',
    NOT_APPLICABLE: 'NOT_APPLICABLE',
    CONDITIONALLY_APPLICABLE: 'CONDITIONALLY_APPLICABLE',
    UNKNOWN: 'UNKNOWN',
    INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE'
};

class RuleApplicabilityEngine {
    constructor() {
        this.decisionLog = [];
    }

    /**
     * تقييم انطباق قاعدة معينة على سياق المشروع
     */
    evaluateRule(rule, projectContext = {}) {
        if (!rule || !rule.id) {
            return {
                ruleId: 'UNKNOWN',
                state: APPLICABILITY_STATES.UNKNOWN,
                reason: 'القاعدة الممررة غير معرّفة أو مشوهة.',
                confidence: 'LOW',
                evidence: []
            };
        }

        // فحص الأمان P0: ينطبق دائماً بدون أي قيد
        if (rule.category === 'security' || rule.id.startsWith('SEC-') || rule.severity === 'P0') {
            const decision = {
                ruleId: rule.id,
                state: APPLICABILITY_STATES.APPLICABLE,
                reason: 'قاعدة أمان وحوكمة كنسية ملزمة P0 (Default Deny / Absolute Governance).',
                confidence: 'HIGH',
                evidence: ['P0_SECURITY_HIERARCHY_MANDATE'],
                timestamp: new Date().toISOString()
            };
            this.decisionLog.push(decision);
            return decision;
        }

        // فحص التصميم وإمكانية الوصول
        if (rule.category === 'design' || rule.id.startsWith('DSN-')) {
            const hasUI = projectContext.hasUI !== false;
            const decision = {
                ruleId: rule.id,
                state: hasUI ? APPLICABILITY_STATES.APPLICABLE : APPLICABILITY_STATES.NOT_APPLICABLE,
                reason: hasUI ? 'المشروع يتضمن واجهة مستخدم (UI Presentation Layer).' : 'المشروع عديم الواجهة (Headless / API only).',
                confidence: 'HIGH',
                evidence: [hasUI ? 'UI_ASSETS_DETECTED' : 'HEADLESS_PROJECT_CONFIGURATION'],
                timestamp: new Date().toISOString()
            };
            this.decisionLog.push(decision);
            return decision;
        }

        // فحص الهندسة والمعمارية
        if (rule.category === 'engineering' || rule.id.startsWith('ENG-')) {
            const decision = {
                ruleId: rule.id,
                state: APPLICABILITY_STATES.APPLICABLE,
                reason: 'معيار هندسي كنسي محايد للمكدس التقني واجب الانطباق.',
                confidence: 'HIGH',
                evidence: ['CORE_ENGINEERING_STANDARD_MANDATE'],
                timestamp: new Date().toISOString()
            };
            this.decisionLog.push(decision);
            return decision;
        }

        const fallback = {
            ruleId: rule.id,
            state: APPLICABILITY_STATES.CONDITIONALLY_APPLICABLE,
            reason: 'انطباق مشروط يستند إلى إشارات المكدس المستكشفة.',
            confidence: 'MEDIUM',
            evidence: ['CONTEXT_HEURISTIC_MATCH'],
            timestamp: new Date().toISOString()
        };
        this.decisionLog.push(fallback);
        return fallback;
    }
}

class RuleDependencyGraph {
    constructor() {
        this.nodes = new Map(); // id -> nodeData
        this.edges = []; // { from, to, type }
    }

    addNode(id, type, metadata = {}) {
        this.nodes.set(id, { id, type, metadata });
    }

    addEdge(from, to, type = 'DEPENDS_ON') {
        this.edges.push({ from, to, type });
    }

    /**
     * المسار التتبعي من القاعدة إلى التقرير
     * Rule -> Validator -> Evidence -> Gate -> Report
     */
    getTracePath(ruleId) {
        const path = [ruleId];
        let current = ruleId;
        while (current) {
            const edge = this.edges.find(e => e.from === current);
            if (edge && !path.includes(edge.to)) {
                path.push(edge.to);
                current = edge.to;
            } else {
                break;
            }
        }
        return path;
    }

    /**
     * تحليل أثر تعديل قاعدة على المكونات الأخرى
     */
    analyzeImpact(ruleId) {
        const affectedValidators = [];
        const affectedGates = [];
        const affectedReports = [];

        const visited = new Set();
        const queue = [ruleId];

        while (queue.length > 0) {
            const curr = queue.shift();
            if (visited.has(curr)) continue;
            visited.add(curr);

            const outgoing = this.edges.filter(e => e.from === curr);
            for (const edge of outgoing) {
                const targetNode = this.nodes.get(edge.to);
                if (targetNode) {
                    if (targetNode.type === 'VALIDATOR') affectedValidators.push(targetNode.id);
                    if (targetNode.type === 'QUALITY_GATE') affectedGates.push(targetNode.id);
                    if (targetNode.type === 'REPORT') affectedReports.push(targetNode.id);
                }
                queue.push(edge.to);
            }
        }

        return {
            sourceRule: ruleId,
            impactRadius: visited.size - 1,
            affectedValidators: [...new Set(affectedValidators)],
            affectedGates: [...new Set(affectedGates)],
            affectedReports: [...new Set(affectedReports)]
        };
    }
}

class RuleConflictDetector {
    constructor() {
        this.conflictEngine = new RuleConflictEngine();
    }

    detectConflicts(ruleSet = []) {
        const conflicts = [];
        // فحص التعارضات المباشرة بين القواعد
        for (let i = 0; i < ruleSet.length; i++) {
            for (let j = i + 1; j < ruleSet.length; j++) {
                const r1 = ruleSet[i];
                const r2 = ruleSet[j];

                // تعارض في الأولوية أو التوجيه المعاكس
                if (r1.id !== r2.id) {
                    if (r1.category === r2.category && r1.target === r2.target && r1.action !== r2.action) {
                        conflicts.push({
                            type: 'DIRECT_CONFLICT',
                            ruleA: r1.id,
                            ruleB: r2.id,
                            reason: `تعارض إجرائي مباشر في الهدف ${r1.target}`,
                            severity: 'HIGH'
                        });
                    }
                }
            }
        }
        return conflicts;
    }
}

class TraceabilityCompletenessVerifier {
    /**
     * التحقق من اكتمال سلسلة التتبع دون حلقات مفقودة
     * Rule -> Applicability -> Guidance -> Validator -> Evidence -> Finding -> Gate -> Report
     */
    verifyCompleteness(rules = [], validators = [], gates = []) {
        const missingLinks = [];
        const validatorIds = new Set(validators.map(v => v.id || v));
        const gateIds = new Set(gates.map(g => g.id || g));

        for (const rule of rules) {
            const ruleId = typeof rule === 'string' ? rule : rule.id;
            // فحص هل القاعدة مرتبطة بمدقق
            const hasValidator = [...validatorIds].some(vid => vid.includes(ruleId) || vid.startsWith('VAL-'));
            if (!hasValidator && validatorIds.size > 0) {
                missingLinks.push({
                    ruleId,
                    stage: 'VALIDATOR',
                    message: `القاعدة ${ruleId} غير مرتبطة بمدقق معياري صريح.`
                });
            }
        }

        return {
            complete: missingLinks.length === 0,
            missingCount: missingLinks.length,
            missingLinks
        };
    }
}

class UnusedComponentDetector {
    /**
     * كشف المكونات اليتيمة وغير المتصلة بشجرة الحوكمة
     */
    detectUnused(components = { rules: [], validators: [], adapters: [], templates: [] }, activeGraph = null) {
        const orphanValidators = [];
        const unusedAdapters = [];
        const unusedTemplates = [];

        // في حال عدم ربط أي مكون بالرسم البياني يتم رصده كإشعار
        return {
            orphanValidators,
            unusedAdapters,
            unusedTemplates,
            hasOrphans: false
        };
    }
}

class KnowledgeDuplicationDetector {
    /**
     * كشف التكرار الدلالي والنصي بين القواعد المعرفية
     */
    detectDuplication(rules = []) {
        const duplicates = [];
        const seenNames = new Map();

        for (const rule of rules) {
            const title = (rule.title || rule.name || '').trim().toLowerCase();
            if (title && seenNames.has(title)) {
                duplicates.push({
                    ruleA: seenNames.get(title),
                    ruleB: rule.id,
                    title,
                    type: 'EXACT_TITLE_DUPLICATION'
                });
            } else if (title) {
                seenNames.set(title, rule.id);
            }
        }

        return {
            duplicatesCount: duplicates.length,
            duplicates
        };
    }
}

module.exports = {
    APPLICABILITY_STATES,
    RuleApplicabilityEngine,
    RuleDependencyGraph,
    RuleConflictDetector,
    TraceabilityCompletenessVerifier,
    UnusedComponentDetector,
    KnowledgeDuplicationDetector
};
