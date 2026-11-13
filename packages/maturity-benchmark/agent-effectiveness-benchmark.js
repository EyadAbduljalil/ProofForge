/**
 * @file agent-effectiveness-benchmark.js
 * @description محول التوافقية لمعيار الفحص ضد المثبتات الواقعية (Fixture Defense Benchmark)
 * تم توجيهه بشفافية ونزاهة علمية لمعيار FixtureDefenseBenchmark لمنع أي ادعاءات غير مثبتة بتفوق الوكلاء
 */

'use strict';

const FixtureDefenseBenchmark = require('./fixture-defense-benchmark');

class AgentEffectivenessBenchmark extends FixtureDefenseBenchmark {
    static runComparison(options = {}) {
        return FixtureDefenseBenchmark.runComparison(options);
    }
}

module.exports = AgentEffectivenessBenchmark;
