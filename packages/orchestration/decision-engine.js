/**
 * @file decision-engine.js
 * @description محرك توثيق وحفظ السجلات والقرارات المعمارية والهندسية (Architectural Decision Records)
 * WebForge Master Orchestration System
 */

const fs = require('fs');
const path = require('path');

class ArchitectureDecisionEngine {
    /**
     * تسجيل قرار معماري مهيكل وتخزينه في مجلد القرارات .webforge/decisions/
     * @param {Object} decisionData 
     * @param {string} rootDir 
     */
    static recordDecision(decisionData, rootDir = process.cwd()) {
        const decisionId = decisionData.id || `ADR_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const record = {
            id: decisionId,
            timestamp: new Date().toISOString(),
            title: decisionData.title || 'Architectural Decision',
            context: decisionData.context || '',
            options_considered: decisionData.options || [],
            constraints: decisionData.constraints || [],
            selected_option: decisionData.selected || '',
            rationale: decisionData.reason || '',
            tradeoffs: decisionData.tradeoffs || [],
            risks_and_mitigations: decisionData.risks || [],
            rollback_plan: decisionData.rollback || '',
            status: 'ACCEPTED_AND_ENFORCED'
        };

        const targetDir = path.join(rootDir, '.webforge', 'decisions');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, `${decisionId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');

        return { record, filePath };
    }
}

module.exports = ArchitectureDecisionEngine;
