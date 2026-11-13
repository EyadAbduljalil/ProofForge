/**
 * @file skills-benchmark.test.js
 * @description معيار جودة وسلوك المهارات الهندسية (Behavioral Skills Benchmark Engine - Task 5)
 * يكتشف المهارات ديناميكياً ويقيم الأبعاد الهيكلية والسلوكية بشكل منفصل
 * ويفرض نجاح كافة السيناريوهات الإلزامية دون إخفاء أي إخفاق خلف المتوسط الحسابي.
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '../../../');
const skillsDir = path.join(rootDir, 'skills');
const agentsSkillsDir = path.join(rootDir, '.agents/skills');
const specsPath = path.join(rootDir, 'registry/skills-behavioral-specs.json');

const isJson = process.argv.includes('--json');
const isQuiet = process.argv.includes('--quiet');

if (!isQuiet && !isJson) {
    console.log('======================================================');
    console.log('🏆 ProofForge V3 — Behavioral Skills Benchmark Engine');
    console.log('======================================================');
}

assert(fs.existsSync(skillsDir), 'مجلد المهارات الكنسي غير موجود');

// 1. الاكتشاف الديناميكي للمهارات الكنسية دون افتراض عدد ثابت
const discoveredSkills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name)
    .sort();

assert(discoveredSkills.length > 0, 'يجب اكتشاف مهارة كنسية واحدة على الأقل');

// 2. تحميل مواصفات السلوك الحتمية
let behavioralSpecs = {};
if (fs.existsSync(specsPath)) {
    try {
        behavioralSpecs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));
    } catch (e) {
        throw new Error(`ملف مواصفات السلوك تالف: ${e.message}`);
    }
}

// 3. فحص التطابق مع مساحة عمل Antigravity (.agents/skills)
const antSkills = fs.existsSync(agentsSkillsDir)
    ? fs.readdirSync(agentsSkillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : [];
const missingInAntigravity = discoveredSkills.filter(s => !antSkills.includes(s));

const benchmarkReport = {
    timestamp: new Date().toISOString(),
    totalSkillsDiscovered: discoveredSkills.length,
    antigravityParity: {
        isParityMaintained: missingInAntigravity.length === 0,
        missingSkills: missingInAntigravity
    },
    skills: [],
    agentEffectivenessComparison: {
        status: 'NOT_RUN',
        mode: 'CONTROLLED_EVALUATION',
        reason: 'يتطلب جلسة تفاعلية مباشرة مع محرك Google Antigravity لحساب استهلاك الرموز وزمن الاستجابة',
        reproducibleProcedure: [
            '1. تنفيذ مهمة برمجية هندسية معقدة بواسطة وكيل Antigravity بدون مهارات ProofForge',
            '2. إعادة تنفيذ نفس المهمة في بيئة متطابقة مع تفعيل مهارات ProofForge',
            '3. قياس نسبة رصد الثغرات، ومعدل كسل الكود، ومطابقة WCAG، ومعدل التراجع والانحدار'
        ],
        baselineMetrics: {
            taskCompletionRate: null,
            securityDefectsCaughtDelta: null,
            antiSlopComplianceDelta: null
        }
    },
    summary: {
        totalVerified: 0,
        totalFailed: 0,
        totalIncomplete: 0,
        totalBlocked: 0,
        globalStatus: 'FAILED',
        averageStructuralScore: 0,
        averageBehavioralScore: 0
    }
};

let sumStructural = 0;
let sumBehavioral = 0;

for (const skill of discoveredSkills) {
    const skillPath = path.join(skillsDir, skill);
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const scriptsDir = path.join(skillPath, 'scripts');
    const examplesDir = path.join(skillPath, 'examples');
    const referencesDir = path.join(skillPath, 'references');

    const evalResult = {
        skillId: skill,
        dimensions: {
            metadataValidity: false,
            instructionQuality: false,
            resourceIntegrity: false,
            functionalBehavior: false,
            securityBehavior: false,
            integrationCompatibility: false
        },
        structuralScore: 0,
        behavioralScore: 0,
        status: 'NOT_TESTED',
        failedScenarios: [],
        evidence: {}
    };

    // البعد 1 & 2: فحص الميتاداتا وجودة التعليمات
    if (fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, 'utf8');
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

        if (fmMatch) {
            const fm = fmMatch[1];
            const nameMatch = fm.match(/name:\s*([^\r\n]+)/);
            const descMatch = fm.match(/description:\s*(?:>[-+]?|\|[-+]?)?\s*\n?([\s\S]*?)(?=\n[a-z0-9_-]+:|$)/i) || fm.match(/description:\s*([^\r\n]+)/);

            const hasValidName = nameMatch && /^[a-z0-9-]+$/.test(nameMatch[1].trim().replace(/^['"]|['"]$/g, ''));
            const hasValidDesc = descMatch && descMatch[1].trim().length >= 15;

            if (hasValidName && hasValidDesc) {
                evalResult.dimensions.metadataValidity = true;
            }
        }

        const hasScope = content.includes('الغرض') || content.includes('Scope') || content.includes('Purpose');
        const hasMethod = content.includes('منهجية') || content.includes('Methodology') || content.includes('Workflow');
        const hasEvidence = content.includes('أدلة') || content.includes('Evidence') || content.includes('التحقق');

        if (hasScope && hasMethod && hasEvidence) {
            evalResult.dimensions.instructionQuality = true;
        }
    }

    // البعد 3: تكامل الموارد (Resources)
    const hasScripts = fs.existsSync(scriptsDir) && fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js')).length > 0;
    const hasExamples = fs.existsSync(examplesDir) && fs.readdirSync(examplesDir).length > 0;
    const hasReferences = fs.existsSync(referencesDir) && fs.readdirSync(referencesDir).length > 0;

    if (hasScripts && hasExamples && hasReferences) {
        evalResult.dimensions.resourceIntegrity = true;
    }

    // حساب الدرجة الهيكلية (Structural Score)
    let structPoints = 0;
    if (evalResult.dimensions.metadataValidity) structPoints += 35;
    if (evalResult.dimensions.instructionQuality) structPoints += 35;
    if (evalResult.dimensions.resourceIntegrity) structPoints += 30;
    evalResult.structuralScore = structPoints;

    // البعد 4 & 5 & 6: فحص السلوك الوظيفي والأمني والتكاملي (Behavioral Evaluation)
    const spec = behavioralSpecs[skill];
    if (spec && spec.allScripts && spec.allScripts.length > 0) {
        let allMandatoryPassed = true;
        let functionalPassed = true;
        let securityPassed = true;
        let integrationPassed = true;

        for (const scriptRel of spec.allScripts) {
            const scriptFullPath = path.join(rootDir, scriptRel);
            if (!fs.existsSync(scriptFullPath)) {
                allMandatoryPassed = false;
                evalResult.failedScenarios.push(`Missing script file: ${scriptRel}`);
                continue;
            }

            // تنفيذ السيناريوهات الإلزامية للمهارة
            for (const scenario of spec.scenarios || []) {
                const res = spawnSync(process.execPath, [scriptFullPath, ...(scenario.args || [])], {
                    cwd: rootDir,
                    encoding: 'utf8',
                    timeout: 10000
                });

                if (res.status !== (scenario.expectedExitCode || 0)) {
                    if (scenario.isMandatory) allMandatoryPassed = false;
                    functionalPassed = false;
                    evalResult.failedScenarios.push(`${scenario.id} (${scriptRel}): expected exit code ${scenario.expectedExitCode}, got ${res.status}`);
                    continue;
                }

                // فحص تكامل الـ JSON في سيناريو الـ JSON
                if (scenario.args && scenario.args.includes('--json')) {
                    try {
                        const parsed = JSON.parse(res.stdout.trim());
                        if (!parsed || typeof parsed !== 'object' || typeof parsed.total_checks !== 'number') {
                            if (scenario.isMandatory) allMandatoryPassed = false;
                            integrationPassed = false;
                            evalResult.failedScenarios.push(`${scenario.id}: Malformed JSON schema`);
                        } else {
                            evalResult.evidence[scenario.id] = {
                                verifier: parsed.verifier,
                                totalChecks: parsed.total_checks,
                                passedChecks: parsed.passed_checks,
                                status: parsed.status
                            };
                        }
                    } catch (e) {
                        if (scenario.isMandatory) allMandatoryPassed = false;
                        integrationPassed = false;
                        evalResult.failedScenarios.push(`${scenario.id}: JSON parse error: ${e.message}`);
                    }
                }
            }

            // تنفيذ سيناريو الأمان ومقاومة المدخلات المشوهة
            for (const negScenario of spec.negativeScenarios || []) {
                const negRes = spawnSync(process.execPath, [scriptFullPath, ...(negScenario.args || [])], {
                    cwd: rootDir,
                    encoding: 'utf8',
                    timeout: 10000
                });
                // التأكد من عدم انهيار العملية بـ crash غير معالج (رمز خروج 0 أو 1 وليس استثناء برمجياً غير ملتقط)
                if (negRes.status !== 0 && negRes.status !== 1) {
                    securityPassed = false;
                    evalResult.failedScenarios.push(`${negScenario.id}: Process crashed with status ${negRes.status}`);
                }
            }
        }

        evalResult.dimensions.functionalBehavior = functionalPassed;
        evalResult.dimensions.securityBehavior = securityPassed;
        evalResult.dimensions.integrationCompatibility = integrationPassed;

        let behavPoints = 0;
        if (functionalPassed) behavPoints += 50;
        if (securityPassed) behavPoints += 25;
        if (integrationPassed) behavPoints += 25;
        evalResult.behavioralScore = behavPoints;

        // الحالة الحتمية للمهارة
        if (evalResult.structuralScore === 100 && evalResult.behavioralScore === 100 && allMandatoryPassed) {
            evalResult.status = 'VERIFIED';
        } else if (evalResult.failedScenarios.length > 0) {
            evalResult.status = 'FAILED';
        } else {
            evalResult.status = 'INCOMPLETE';
        }
    } else {
        evalResult.status = 'INCOMPLETE';
        evalResult.failedScenarios.push('No behavioral specification or executable scripts found');
    }

    sumStructural += evalResult.structuralScore;
    sumBehavioral += evalResult.behavioralScore;

    if (evalResult.status === 'VERIFIED') benchmarkReport.summary.totalVerified++;
    else if (evalResult.status === 'FAILED') benchmarkReport.summary.totalFailed++;
    else if (evalResult.status === 'INCOMPLETE') benchmarkReport.summary.totalIncomplete++;
    else if (evalResult.status === 'BLOCKED') benchmarkReport.summary.totalBlocked++;

    benchmarkReport.skills.push(evalResult);

    if (!isQuiet && !isJson) {
        const badge = evalResult.status === 'VERIFIED' ? '✅ VERIFIED' : `❌ ${evalResult.status}`;
        console.log(`  [${skill.padEnd(22)}] -> ${badge} (Struct: ${evalResult.structuralScore} | Behav: ${evalResult.behavioralScore})`);
        if (evalResult.failedScenarios.length > 0) {
            evalResult.failedScenarios.forEach(f => console.log(`      ⚠️ ${f}`));
        }
    }
}

benchmarkReport.summary.averageStructuralScore = Math.round(sumStructural / discoveredSkills.length);
benchmarkReport.summary.averageBehavioralScore = Math.round(sumBehavioral / discoveredSkills.length);

// المعيار الحتمي: النجاح الشامل مشروط بأن تكون كل المهارات VERIFIED دون استثناء
const allSkillsVerified = (benchmarkReport.summary.totalVerified === discoveredSkills.length);
benchmarkReport.summary.globalStatus = allSkillsVerified ? 'VERIFIED' : 'FAILED';

if (!isQuiet && !isJson) {
    console.log('======================================================');
    console.log(`📊 Global Benchmark Status: ${benchmarkReport.summary.globalStatus === 'VERIFIED' ? '✅ VERIFIED' : '❌ FAILED'}`);
    console.log(`Skills Verified: ${benchmarkReport.summary.totalVerified} / ${discoveredSkills.length}`);
    console.log(`Average Structural Quality: ${benchmarkReport.summary.averageStructuralScore} / 100`);
    console.log(`Average Behavioral Quality: ${benchmarkReport.summary.averageBehavioralScore} / 100`);
    console.log(`Antigravity Parity: ${benchmarkReport.antigravityParity.isParityMaintained ? '✅ MATCHED' : '⚠️ MISMATCH'}`);
    console.log('======================================================');
}

if (isJson) {
    console.log(JSON.stringify(benchmarkReport, null, 2));
}

assert.strictEqual(
    benchmarkReport.summary.globalStatus,
    'VERIFIED',
    `فشل معيار السلوك: ${benchmarkReport.summary.totalFailed} مهارات فاشلة، ${benchmarkReport.summary.totalIncomplete} غير مكتملة.`
);

if (!isQuiet && !isJson) {
    console.log('>>> [SUCCESS] All ProofForge Skills Passed Behavioral Quality Benchmark with VERIFIED Status.');
}
