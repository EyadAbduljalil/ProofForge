/**
 * @file authority-hierarchy.js
 * @description محرك هرمية السلطة وفصل الأولويات لنظام WebForge OS
 * WebForge Master Orchestration System
 */

class AuthorityHierarchy {
    static get LEVELS() {
        return {
            P0_SECURITY_SAFETY: { level: 0, name: 'P0 — Security & Safety', overrideable: false },
            P1_CONSTITUTION: { level: 1, name: 'P1 — WebForge Constitution', overrideable: false },
            P2_ARCHITECTURE: { level: 2, name: 'P2 — Architecture Standards', overrideable: false },
            P3_DOMAIN: { level: 3, name: 'P3 — Domain Business Rules', overrideable: false },
            P4_ENGINEERING: { level: 4, name: 'P4 — Engineering Standards', overrideable: true },
            P5_DESIGN_SYSTEM: { level: 5, name: 'P5 — Design System & Motion', overrideable: true },
            P6_REQUIREMENTS: { level: 6, name: 'P6 — Project Requirements', overrideable: true },
            P7_AGENT_RECOMMENDATIONS: { level: 7, name: 'P7 — AI Suggestions', overrideable: true },
            P8_AGENT_PREFERENCES: { level: 8, name: 'P8 — AI Preferences', overrideable: true }
        };
    }

    /**
     * الفصل التلقائي بين مستويين من الصلاحيات وفق الدستور
     * @param {string} levelKeyA 
     * @param {string} levelKeyB 
     * @returns {Object} نتيجة التحكيم
     */
    static arbitrate(levelKeyA, levelKeyB) {
        const a = this.LEVELS[levelKeyA] || { level: 99, name: 'UNKNOWN' };
        const b = this.LEVELS[levelKeyB] || { level: 99, name: 'UNKNOWN' };

        if (a.level < b.level) {
            return {
                winner: levelKeyA,
                loser: levelKeyB,
                reason: `${a.name} (Priority ${a.level}) strictly overrides ${b.name} (Priority ${b.level})`
            };
        } else if (b.level < a.level) {
            return {
                winner: levelKeyB,
                loser: levelKeyA,
                reason: `${b.name} (Priority ${b.level}) strictly overrides ${a.name} (Priority ${a.level})`
            };
        } else {
            return {
                winner: 'EQUAL',
                reason: 'Both rules hold equal priority level in the hierarchy.'
            };
        }
    }
}

module.exports = AuthorityHierarchy;
