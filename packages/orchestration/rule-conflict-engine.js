/**
 * @file rule-conflict-engine.js
 * @description محرك حل التعارضات بين القواعد وإصدار القرارات الحتمية
 * WebForge Master Orchestration System
 */

const AuthorityHierarchy = require('./authority-hierarchy');

class RuleConflictEngine {
    /**
     * تحليل وتفكيك التعارض بين قاعدتين أو أكثر وتوثيق القرار
     * @param {Object} ruleA 
     * @param {Object} ruleB 
     * @returns {Object} سجل القرار الحتمي (Conflict Decision Record)
     */
    static resolveConflict(ruleA, ruleB) {
        if (!ruleA || !ruleB) {
            throw new Error('Both rules must be provided to evaluate conflict.');
        }

        const arbitration = AuthorityHierarchy.arbitrate(ruleA.priority, ruleB.priority);
        let selectedRule = null;
        let rejectedRule = null;

        if (arbitration.winner === ruleA.priority) {
            selectedRule = ruleA;
            rejectedRule = ruleB;
        } else if (arbitration.winner === ruleB.priority) {
            selectedRule = ruleB;
            rejectedRule = ruleA;
        } else {
            // في حال تساوي الأولوية، يتم التحكيم بناءً على نطاق الحماية الأضيق والأكثر أماناً
            selectedRule = ruleA.scope === 'SECURITY' ? ruleA : ruleB;
            rejectedRule = selectedRule === ruleA ? ruleB : ruleA;
        }

        return {
            decision_id: `DEC_CONF_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            conflict: {
                rule_a: { id: ruleA.id, name: ruleA.name, priority: ruleA.priority },
                rule_b: { id: ruleB.id, name: ruleB.name, priority: ruleB.priority }
            },
            arbitration_result: arbitration.reason,
            selected_rule: selectedRule.id,
            rejected_rule: rejectedRule.id,
            reason: `Rule '${selectedRule.name}' selected because ${arbitration.reason}`,
            status: 'DECIDED_AND_LOGGED'
        };
    }
}

module.exports = RuleConflictEngine;
