/**
 * @file engineering-memory.js
 * @description محرك الذاكرة الهندسية وسجل التجارب والأنماط المعمارية (Engineering Memory Engine)
 * يخزن المشاكل السابقة، الحلول الناجحة والمرفوضة، اختبارات الانحدار، والقرارات المعمارية لدعم اتخاذ القرار وتجنب تكرار الأخطاء
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
            known_risks: new Map()
        };
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
            applied_count: 0
        };
        this.records[category].set(key, record);
        return record;
    }

    /**
     * البحث عن نمط حل هندسي سابق مشابه للمشكلة الحالية
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

    exportMemoryState() {
        const state = {};
        for (const [cat, map] of Object.entries(this.records)) {
            state[cat] = Array.from(map.values());
        }
        return state;
    }
}

module.exports = EngineeringMemory;
