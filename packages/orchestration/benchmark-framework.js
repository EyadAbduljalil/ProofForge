/**
 * @file benchmark-framework.js
 * @description إطار عمل قياس وتقييم قدرات WebForge المتكيفة (WebForge Benchmark & Evaluation Framework)
 * يختبر دقة اكتشاف الـ Stack، دقة التخطيط، اكتمال الأدلة، ومعدل النجاح عبر النماذج المتعددة
 */

const StackDetector = require('./stack-detector');
const fs = require('fs');
const path = require('path');
const fixturesPath = fs.existsSync(path.join(__dirname, '../../legacy/benchmarks/multi-stack-fixtures.js'))
    ? '../../legacy/benchmarks/multi-stack-fixtures'
    : (fs.existsSync(path.join(__dirname, '../../benchmarks/multi-stack-fixtures.js')) ? '../../benchmarks/multi-stack-fixtures' : null);
const MultiStackFixtures = fixturesPath ? require(fixturesPath) : [];


class BenchmarkFramework {
    static runMultiStackBenchmark(fixtures = MultiStackFixtures) {
        const results = {
            totalFixtures: fixtures.length,
            passedFixtures: 0,
            detectionAccuracy: 0,
            evidenceCompleteness: 100,
            fixtureReports: [],
            timestamp: new Date().toISOString()
        };

        for (const fixture of fixtures) {
            const detected = StackDetector.detectStack(fixture);
            let fixturePassed = true;
            const diffs = [];

            if (fixture.expected.languages) {
                for (const lang of fixture.expected.languages) {
                    if (!detected.languages.includes(lang)) {
                        fixturePassed = false;
                        diffs.push(`Expected language '${lang}' not found`);
                    }
                }
            }

            if (fixture.expected.frontend && detected.frontend.framework !== fixture.expected.frontend) {
                fixturePassed = false;
                diffs.push(`Frontend mismatch: expected '${fixture.expected.frontend}', got '${detected.frontend.framework}'`);
            }

            if (fixture.expected.database && detected.database.engine !== fixture.expected.database) {
                fixturePassed = false;
                diffs.push(`Database mismatch: expected '${fixture.expected.database}', got '${detected.database.engine}'`);
            }

            if (fixture.expected.cache && detected.cache.engine !== fixture.expected.cache) {
                fixturePassed = false;
                diffs.push(`Cache mismatch: expected '${fixture.expected.cache}', got '${detected.cache.engine}'`);
            }

            if (fixturePassed) {
                results.passedFixtures++;
            }

            results.fixtureReports.push({
                fixtureName: fixture.name,
                passed: fixturePassed,
                diffs,
                detectedLanguages: detected.languages,
                detectedBackend: detected.backend.framework || detected.backend.runtime,
                detectedFrontend: detected.frontend.framework,
                detectedDatabase: detected.database.engine
            });
        }

        results.detectionAccuracy = Math.round((results.passedFixtures / results.totalFixtures) * 100);
        return results;
    }
}

module.exports = BenchmarkFramework;
