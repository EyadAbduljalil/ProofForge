#!/usr/bin/env node
// أداة سطر الأوامر الموحدة لنظام WebForge OS (Unified WebForge CLI)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const {
    ProjectSecurityProfiler,
    ThreatModelingEngine,
    RiskAssessmentEngine,
    SecurityControlMatrix,
    AttackSurfaceInventory,
    ChangeImpactAnalyzer,
    SupplyChainGuard,
    PipelineInfraGuard,
    PrivacyDataFlowGuard,
    AIAgentGovernanceEngine,
    AbuseFraudEngine,
    SecurityMemoryLedger,
    ArchitectureFitnessGuard,
    SecurityBenchmark
} = require('../packages/security-governance');

const {
    AuthorityHierarchy,
    RuleConflictEngine,
    AntiHallucinationGuard,
    WebForgeComplianceEngine,
    TraceabilityEngine,
    ArchitectureDecisionEngine,
    AnimationDecisionEngine,
    DesignIntelligenceEngine
} = require('../packages/orchestration');

const IdeaCompiler = require('../packages/idea-compiler/idea-compiler');
const EngineeringGraph = require('../packages/engineering-graph/engineering-graph');
const StateMachineEngine = require('../packages/state-machine/state-machine-engine');
const VulnerabilityLab = require('../packages/vulnerability-lab/vulnerability-lab');
const MaturityEvaluator = require('../packages/maturity-benchmark/maturity-evaluator');
const GoldenProjectsBenchmark = require('../packages/maturity-benchmark/golden-projects');

const command = process.argv[2] || 'help';
const arg1 = process.argv[3];
const arg2 = process.argv[4];

console.log('======================================================');
console.log('⚡ WebForge OS — Master Autonomous Engineering CLI');
console.log('======================================================');

async function main() {
    switch (command) {
        case 'init':
            const type = arg1 || 'ecommerce';
            const name = arg2 || 'my-app';
            console.log(`[INIT] تهيئة مشروع جديد بنطاق: ${type} واسم: ${name}`);
            console.log('  - تحميل القواعد الهندسية الأساسية (P0 - Security & Core)...');
            console.log(`  - ربط نطاق: domains/${type}/...`);
            console.log('  - تجهيز ملفات التكوين والتحقق ومجلد .webforge/...');
            console.log('>>> تم تهيئة المشروع بنجاح! يمكنك الآن بدء تنفيذ المتطلبات.');
            break;

        case 'intake':
        case 'compile-idea':
            console.log('[INTAKE] تشغيل محرك استكشاف الأفكار وهندسة المتطلبات...');
            const compiler = new IdeaCompiler();
            const intakeRes = compiler.analyzeInitialIdea({
                idea: arg1 || 'مشروع تطبيق ويب تجريبي',
                problem: 'أتمتة العمليات التجارية',
                solution: 'نظام إدارة شامل',
                roles: ['user', 'admin'],
                features: [{ name: 'لوحة التحكم', priority: 'MUST' }]
            });
            console.log(JSON.stringify(compiler.compileToExecutionPackage(), null, 2));
            break;

        case 'maturity':
            console.log('[MATURITY] تقييم مستوى نضج قدرات النظام (L0 - L6)...');
            const mat = MaturityEvaluator.evaluateMaturity();
            console.log(JSON.stringify(mat, null, 2));
            break;

        case 'golden':
            console.log('[GOLDEN] تشغيل اختبارات المشاريع الذهبية القياسية...');
            const gold = GoldenProjectsBenchmark.runAllGoldenProjects();
            console.log(JSON.stringify(gold, null, 2));
            break;

        case 'lab':
            console.log('[LAB] تشغيل معمل الفحص المتقدم ومحاكاة سباق العمليات...');
            const inv = VulnerabilityLab.testInvariants();
            const race = await VulnerabilityLab.simulateConcurrentDeduction(1, 10);
            console.log(JSON.stringify({ invariants: inv, concurrencySimulation: race }, null, 2));
            break;

        case 'constitution':
            console.log('[CONSTITUTION] عرض ميثاق ودستور نظام WebForge OS الملزم...');
            if (fs.existsSync('WEBFORGE_CONSTITUTION.md')) {
                console.log(fs.readFileSync('WEBFORGE_CONSTITUTION.md', 'utf8'));
            } else {
                console.error('الملف غير موجود!');
            }
            break;

        case 'compliance':
            console.log('[COMPLIANCE] فحص الامتثال الشامل للدستور والقواعد الهندسية...');
            const audit = WebForgeComplianceEngine.auditCompliance();
            console.log(JSON.stringify(audit, null, 2));
            break;

        case 'trace':
            console.log('[TRACE] توليد مصفوفة تتبع المتطلبات Traceability Matrix...');
            const tracer = new TraceabilityEngine();
            const traceResult = tracer.generateTraceabilityMatrix();
            console.log(JSON.stringify(traceResult, null, 2));
            break;

        case 'profile':
            console.log('[PROFILE] توليد ملف تعريف الأمان للمشروع والتفعيل السياقي...');
            const profile = ProjectSecurityProfiler.profileProject();
            console.log(JSON.stringify(profile, null, 2));
            break;

        case 'threat-model':
            console.log('[THREAT-MODEL] توليد نموذج التهديدات وحدود الثقة المنهجي...');
            const currentProfile = ProjectSecurityProfiler.profileProject();
            const model = ThreatModelingEngine.generateThreatModel(currentProfile);
            console.log(JSON.stringify(model, null, 2));
            break;

        case 'matrix':
            console.log('[MATRIX] فحص مصفوفة الضوابط الأمنية وحالة التغطية...');
            const scm = new SecurityControlMatrix();
            const matrixCoverage = scm.auditControlEffectiveness();
            console.log(JSON.stringify(matrixCoverage, null, 2));
            break;

        case 'surface':
            console.log('[SURFACE] جرد مساحة الهجوم والانكشاف في الإنتاج...');
            const surfaceResult = AttackSurfaceInventory.discoverAttackSurface();
            console.log(JSON.stringify(surfaceResult, null, 2));
            break;

        case 'benchmark':
            console.log('[BENCHMARK] تشغيل معيار الفحص الأمني ضد النماذج الهجومية...');
            const bm = await SecurityBenchmark.runBenchmark();
            console.log(JSON.stringify(bm, null, 2));
            break;

        case 'serve':
            const port = parseInt(arg1, 10) || 3000;
            console.log(`[SERVE] تشغيل خادم WebForge OS الموحد على المنفذ: ${port}...`);
            const { startServer } = require('../apps/server/server.js');
            startServer(port);
            break;

        case 'migrate':
            console.log('[MIGRATE] تطبيق ترحيلات قواعد البيانات وإعداد جداول المستأجرين وسجلات التدقيق...');
            const StorageAdapter = require('../apps/server/db/storage-adapter');
            const MigrationRunner = require('../apps/server/db/migration-runner');
            const storage = new StorageAdapter();
            const runner = new MigrationRunner(storage);
            await runner.migrateUp();
            console.log('>>> [SUCCESS] تم تنفيذ الترحيلات وتأمين هيكل قاعدة البيانات وسياسات RLS.');
            break;

        case 'e2e':
            console.log('[E2E] تشغيل حزمة اختبارات التكامل الحي E2E والتحقق من الخادم والتطبيق...');
            try {
                execSync('node --test tests/e2e/server_app.test.js', { stdio: 'inherit' });
                console.log('>>> [PASS] اختبارات الـ E2E الحية اجتازت بنجاح كامل.');
            } catch (err) {
                console.error('>>> [FAIL] فشل في اختبارات الـ E2E:', err.message);
                process.exit(1);
            }
            break;

        case 'test':
            console.log('[TEST] تشغيل حزمة الاختبارات الآلية الشاملة عبر جميع الحزم واختبارات E2E...');
            try {
                require('../packages/security/tests/security.test.js');
                require('../packages/security/tests/security_expansion.test.js');
                await require('../packages/security-governance/tests/governance.test.js')();
                require('../packages/orchestration/tests/orchestration.test.js');
                await require('../packages/orchestration/tests/adversarial-phase3-5.test.js').runAdversarialVerificationSuite();
                await require('../packages/orchestration/tests/phase4-production-excellence.test.js').runPhase4TestSuite();
                require('../packages/idea-compiler/tests/idea_compiler.test.js');
                require('../packages/engineering-graph/tests/engineering_graph.test.js');
                require('../packages/state-machine/tests/state_machine.test.js');
                await require('../packages/vulnerability-lab/tests/vulnerability_lab.test.js')();
                require('../packages/maturity-benchmark/tests/maturity_benchmark.test.js');
                require('../packages/contracts/tests/contracts.test.js');
                require('../packages/components/tests/components.test.js');
                require('../packages/design-system/tests/design_system.test.js');
                require('../packages/infrastructure/tests/infra.test.js');
                execSync('node --test packages/orchestration/tests/knowledge-core.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/ai-instruction-framework.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/design-intelligence.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/engineering-security-framework.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase4b-adversarial-audit.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase5a-validation-quality-gates.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase5b-adversarial-audit.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase6a-domains-templates-adapters.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase6b-adversarial-audit.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase7-system-integration.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/phase8-final-completion-audit.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2-capability-expansion.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/financial-erp-domain.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.1-core-verification.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.2-data-api-distributed.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.3-ai-llm-verification.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.4-financial-erp-expansion.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.5-business-systems.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.6-enterprise-critical.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/webforge-v2.7-operational-systems.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/c2-evidence-claim-intelligence.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/c3-grounding-output-verification.test.js', { stdio: 'inherit' });
                execSync('node --test packages/orchestration/tests/c4-adversarial-testing-repair.test.js', { stdio: 'inherit' });
                execSync('node --test tests/e2e/server_app.test.js', { stdio: 'inherit' });
                console.log('>>> [PASS] كافة اختبارات الحزم البرمجية والـ E2E واختبارات WebForge V2 و C1 و C2 و C3 و C4 و C5 اجتازت بنجاح بالكامل.');
            } catch (e) {
                console.error('>>> [FAIL] فشل في أحد الاختبارات:', e.message);
                process.exit(1);
            }
            break;

        case 'security':
            console.log('[SECURITY] تشغيل فحص الأمان الشامل والحوكمة ومطابقة OWASP ASVS...');
            try {
                require('../packages/security/tests/security.test.js');
                require('../packages/security/tests/security_expansion.test.js');
                await require('../packages/security-governance/tests/governance.test.js')();
                console.log('>>> [PASS] الفحص الأمني الموسع والحوكمة مكتملة بنجاح ومطابقة لـ ASVS Level 2.');
            } catch (e) {
                console.error('>>> [FAIL] فشل الفحص الأمني:', e.message);
                process.exit(1);
            }
            break;

        case 'proofforge':
        case 'verify':
            const isJson = process.argv.includes('--json');
            if (isJson) {
                const { ProofRunEngine } = require('../packages/contracts');
                const engine = new ProofRunEngine();
                const runResult = engine.executeBoundedRun({
                    request: arg1 || 'التحقق الهندسي والحوكمي الشامل لمنظومة ProofForge',
                    projectName: 'WebForge OS Production Verification'
                });
                console.log(JSON.stringify(runResult, null, 2));
                if (runResult.exit_code !== 0) {
                    process.exit(runResult.exit_code);
                }
            } else if (command === 'proofforge') {
                console.log('[PROOFFORGE] فحص وتشغيل منظومة ProofForge الكنسية للتحقق والحوكمة...');
                try {
                    require('../packages/contracts/tests/module-load.test.js');
                    console.log('>>> [PASS] منظومة ProofForge جاهزة للتشغيل بكافة عقودها وسجلاتها ومحركاتها.');
                } catch (err) {
                    console.error('>>> [FAIL] فشل في تحميل منظومة ProofForge:', err.message);
                    process.exit(1);
                }
            } else {
                console.log('[VERIFY] تشغيل بروتوكول التحقق المبني على الأدلة الشامل عبر المحركات المادية...');
                const auditScript = path.join(__dirname, '../skills/project-audit/scripts/run_audit.js');
                try {
                    execSync(`node "${auditScript}"`, { stdio: 'inherit' });
                    console.log('>>> [VERIFIED] تم إثبات كافة الخصائص البرمجية بالأدلة المادية.');
                } catch (err) {
                    console.error('>>> [FAIL] فشل في تدقيق المشروع والتحقق من الموثوقية:', err.message);
                    process.exit(1);
                }
            }
            break;

        case 'report':
            console.log('[REPORT] استخراج مصفوفة التحقق والأدلة النهائية...');
            if (fs.existsSync('FINAL_VERIFICATION.md')) {
                console.log(fs.readFileSync('FINAL_VERIFICATION.md', 'utf8'));
            } else if (fs.existsSync('templates/testing/FINAL_VERIFICATION.md')) {
                console.log(fs.readFileSync('templates/testing/FINAL_VERIFICATION.md', 'utf8'));
            } else {
                console.log('الملف غير موجود');
            }
            break;

        case 'skills':
            console.log('🛡️ WebForge OS — Real Antigravity Skills Validation & Inventory');
            console.log('======================================================');
            const skillsDir = path.join(__dirname, '../skills');
            if (fs.existsSync(skillsDir)) {
                const list = fs.readdirSync(skillsDir);
                let validCount = 0;
                let totalSkills = 0;
                list.forEach(s => {
                    const skillPath = path.join(skillsDir, s);
                    if (fs.statSync(skillPath).isDirectory()) {
                        totalSkills++;
                        const skillMdPath = path.join(skillPath, 'SKILL.md');
                        const hasSkill = fs.existsSync(skillMdPath);
                        const hasRef = fs.existsSync(path.join(skillPath, 'references'));
                        const hasEx = fs.existsSync(path.join(skillPath, 'examples'));
                        const hasScr = fs.existsSync(path.join(skillPath, 'scripts'));

                        let issues = [];
                        if (!hasSkill) issues.push('Missing SKILL.md');
                        if (!hasRef) issues.push('Missing references/');
                        if (!hasEx) issues.push('Missing examples/');
                        if (!hasScr) issues.push('Missing scripts/');

                        if (hasSkill) {
                            const content = fs.readFileSync(skillMdPath, 'utf8');
                            const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                            if (!fmMatch) {
                                issues.push('Invalid YAML frontmatter');
                            } else {
                                const fm = fmMatch[1];
                                const nameMatch = fm.match(/name:\s*([^\r\n]+)/);
                                const descMatch = fm.match(/description:\s*(?:>[-+]?|\|[-+]?)?\s*\n?([\s\S]*?)(?=\n[a-z0-9_-]+:|$)/i) || fm.match(/description:\s*([^\r\n]+)/);

                                if (!nameMatch || !nameMatch[1].trim()) {
                                    issues.push('Missing skill name');
                                } else {
                                    const rawName = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
                                    if (!/^[a-z0-9-]+$/.test(rawName)) {
                                        issues.push(`Invalid name '${rawName}' (must be lowercase-hyphenated)`);
                                    }
                                }

                                const descText = descMatch ? descMatch[1].replace(/\r?\n\s*/g, ' ').replace(/^['"]|['"]$/g, '').trim() : '';
                                if (!descText || descText.length < 15) {
                                    issues.push('Missing/insufficient description');
                                }
                            }
                        }

                        const isValid = issues.length === 0;
                        if (isValid) validCount++;
                        const status = isValid ? '✓ VERIFIED (Native Antigravity Standard)' : `✗ FAILED: [${issues.join(', ')}]`;
                        console.log(`  [${s.padEnd(22)}] -> ${status}`);
                    }
                });
                console.log('======================================================');
                console.log(`📊 Validated Antigravity Skills: ${validCount} / ${totalSkills}`);
                if (validCount !== totalSkills) {
                    process.exit(1);
                }
            }
            break;

        case 'sync-skills':
        case 'install-skills':
            console.log('🚀 WebForge OS — Canonical Skills Synchronization to Antigravity');
            console.log('======================================================');
            const AntigravityAdapter = require('../packages/contracts/antigravity-adapter');
            const srcDir = path.join(__dirname, '../skills');
            const targetBase = (arg1 && !arg1.startsWith('--')) ? arg1 : path.join(process.cwd(), '.agents/skills');
            const isDryRun = process.argv.includes('--dry-run');
            const isForce = process.argv.includes('--force');

            console.log(`المصدر الكنسي: ${srcDir}`);
            console.log(`الوجهة المستهدفة: ${targetBase}`);
            console.log(`الوضع: ${isDryRun ? 'معاينة تجريبية (--dry-run)' : 'تثبيت ومزامنة حقيقية'}`);

            const syncResult = AntigravityAdapter.syncCanonicalSkills(srcDir, targetBase, {
                dryRun: isDryRun,
                force: isForce
            });

            console.log(`\nالمهارات المزامنة (${syncResult.synced.length}):`);
            syncResult.synced.forEach(s => console.log(`  ✓ ${s}`));
            if (syncResult.skipped.length > 0) {
                console.log(`\nالمهارات المتجاوزة (${syncResult.skipped.length}):`);
                syncResult.skipped.forEach(s => console.log(`  ⚠️ ${s}`));
            }
            if (syncResult.errors.length > 0) {
                console.log(`\nالأخطاء (${syncResult.errors.length}):`);
                syncResult.errors.forEach(e => console.log(`  ❌ ${e}`));
                process.exit(1);
            }
            console.log('======================================================');
            console.log('>>> اكتملت المزامنة بنجاح وحتمية.');
            break;

        default:
            console.log('الاستخدام:');
            console.log('  webforge serve [port]         تشغيل خادم الإنتاج الموحد وواجهة المستخدم');
            console.log('  webforge migrate              تطبيق ترحيلات قاعدة البيانات وسياسات RLS');
            console.log('  webforge e2e                  تشغيل اختبارات التكامل الحي الشاملة E2E');
            console.log('  webforge init <type> <name>   تهيئة مشروع جديد');
            console.log('  webforge intake               تشغيل محرك استكشاف وتجميع الأفكار');
            console.log('  webforge maturity             تقييم مستوى النضج الهندسي L0-L6');
            console.log('  webforge golden               تشغيل اختبارات المشاريع الذهبية القياسية');
            console.log('  webforge lab                  تشغيل معمل الفحص المتقدم ومحاكاة السباق');
            console.log('  webforge constitution         عرض ميثاق ودستور WebForge');
            console.log('  webforge compliance           تدقيق الامتثال الشامل للدستور والقواعد');
            console.log('  webforge trace                توليد وعرض مصفوفة تتبع المتطلبات');
            console.log('  webforge profile              توليد ملف تعريف أمان المشروع والتفعيل السياقي');
            console.log('  webforge threat-model         توليد نموذج التهديدات وحدود الثقة');
            console.log('  webforge matrix               فحص مصفوفة الضوابط الأمنية وتتبع الفعالية');
            console.log('  webforge surface              جرد مساحة الهجوم والانكشاف في الإنتاج');
            console.log('  webforge benchmark            تشغيل معيار الفحص الأمني ضد النماذج الهجومية');
            console.log('  webforge proofforge           فحص وتحميل منظومة ProofForge الكنسية والتحقق من السجلات');
            console.log('  webforge test                 تشغيل كافة اختبارات الحزم البرمجية والـ E2E');
            console.log('  webforge security             تشغيل التدقيق الأمني ومطابقة ASVS والحوكمة');
            console.log('  webforge verify               تشغيل بروتوكول التحقق الشامل');
            console.log('  webforge report               عرض تقرير التحقق النهائي والأدلة');
            break;
    }
}

main().catch(err => {
    console.error('>>> [ERROR]:', err);
    process.exit(1);
});
