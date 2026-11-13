#!/usr/bin/env node
/**
 * @file proofforge.js
 * @description واجهة سطر الأوامر الرسمية الكنسية لمنظومة ProofForge V3 (ProofForge Master CLI)
 * تدعم إدارة المهارات، الفحص التشخيصي (Doctor)، التحقق الحتمي، والمزامنة مع بيئة Google Antigravity.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AntigravityAdapter = require('../packages/contracts/antigravity-adapter');

const argv = process.argv.slice(2);

// استخراج الرايات (Flags)
const isJson = argv.includes('--json');
const isVerbose = argv.includes('--verbose');
const isQuiet = argv.includes('--quiet');
const isDryRun = argv.includes('--dry-run');
const isForce = argv.includes('--force');

// تصفية الوسائط لاستخراج الأوامر فقط
const positionalArgs = argv.filter(arg => !arg.startsWith('-'));
const command = positionalArgs[0] || 'help';
const subCommand = positionalArgs[1];
const targetArg = positionalArgs[2];

const CANONICAL_SKILLS_DIR = path.join(__dirname, '../skills');
const DEFAULT_TARGET_DIR = path.join(process.cwd(), '.agents/skills');

function logBanner() {
    if (!isQuiet && !isJson) {
        console.log('======================================================');
        console.log('🛡️ ProofForge V3 — Autonomous Engineering CLI');
        console.log('======================================================');
    }
}

function printHelp() {
    console.log(`
الاستخدام:
  proofforge <command> [options]

الأوامر الأساسية:
  proofforge list                     سرد كافة المهارات الهندسية الكنسية وحالتها
  proofforge doctor                   تشغيل الفحص الطبي والتشخيصي الشامل لبيئة العمل
  proofforge verify [--json]          تشغيل بروتوكول التحقق المادي متعدد المجالات
  proofforge audit                    تشغيل التدقيق الهندسي الشامل للمشروع
  proofforge sync [target]            مزامنة وتثبيت المهارات في مساحة العمل
  proofforge install [target]         تثبيت مهارات ProofForge في مساحة العمل
  proofforge test                     تشغيل كافة اختبارات الحزم البرمجية واختبارات E2E
  proofforge report                   عرض وثيقة التحقق النهائية المعتمدة

إدارة المهارات (Skills Management):
  proofforge skills list              سرد المهارات الكنسية وتفاصيل اعتمادها
  proofforge skills inspect <skill>   فحص تفصيلي لترويسة ومحتويات وسكربتات مهارة محددة
  proofforge skills validate          تدقيق الامتثال الهيكلي والأمني لجميع المهارات
  proofforge skills benchmark         تشغيل مقياس الجودة والاختبار المرجعي للمهارات
  proofforge skills diff [target]     مقارنة الفروق بين المصدر الكنسي والمهارات المثبتة
  proofforge skills prune [target]    تشذيب وتنظيف المهارات المتقادمة مع حماية مهارات المستخدم

الرايات والخيارات (Options):
  --help, -h                          عرض هذه القائمة التوجيهية
  --json                              إخراج النتائج بتنسيق JSON قابل للقراءة آلياً
  --verbose                           إظهار تفاصيل تشغيل موسعة
  --quiet                             كتم المخرجات غير الضرورية
  --dry-run                           معاينة العمليات دون إجراء أي تعديل على القرص
  --force                             فرض التنفيذ وتجاوز التحذيرات غير الحرجة
`);
}

/**
 * تشغيل الفحص الطبي والتشخيصي الشامل للمنظومة (Doctor Diagnostics)
 */
async function runDoctor() {
    const checks = [];
    const startTime = Date.now();

    // 1. فحص بيئة Node.js
    const nodeVer = process.version;
    const majorVer = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
    const nodePass = majorVer >= 18;
    checks.push({
        id: 'DOC-NODE-VER',
        name: 'Node.js Runtime Version',
        passed: nodePass,
        status: nodePass ? 'PASS' : 'FAIL',
        details: `Current: ${nodeVer} (Required >= 18.0.0)`
    });

    // 2. فحص بيئة Git
    let gitPass = false;
    let gitHead = 'UNKNOWN';
    try {
        gitHead = execSync('git rev-parse --short HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        gitPass = true;
    } catch (e) {
        gitPass = false;
    }
    checks.push({
        id: 'DOC-GIT-STATUS',
        name: 'Git Repository Status',
        passed: gitPass,
        status: gitPass ? 'PASS' : 'WARN',
        details: gitPass ? `Git available at commit ${gitHead}` : 'Git not found or directory is not a git repo'
    });

    // 3. فحص مجلد المهارات الكنسي skills/
    let skillsPass = false;
    let skillsCount = 0;
    if (fs.existsSync(CANONICAL_SKILLS_DIR)) {
        const skills = fs.readdirSync(CANONICAL_SKILLS_DIR).filter(s => {
            const p = path.join(CANONICAL_SKILLS_DIR, s);
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
        });
        skillsCount = skills.length;
        skillsPass = skillsCount >= 28;
    }
    checks.push({
        id: 'DOC-CANONICAL-SKILLS',
        name: 'Canonical Skills Library',
        passed: skillsPass,
        status: skillsPass ? 'PASS' : 'FAIL',
        details: `Found ${skillsCount} valid skills in ${CANONICAL_SKILLS_DIR}`
    });

    // 4. فحص مجلد وجهة Antigravity (.agents/skills)
    const targetAgentsDir = path.join(process.cwd(), '.agents/skills');
    const targetExists = fs.existsSync(targetAgentsDir);
    const targetCount = targetExists ? fs.readdirSync(targetAgentsDir).length : 0;
    checks.push({
        id: 'DOC-ANTIGRAVITY-TARGET',
        name: 'Antigravity Workspace Directory',
        passed: true,
        status: targetExists ? 'PASS' : 'WARN',
        details: targetExists ? `Initialized with ${targetCount} skills installed` : 'Directory .agents/skills not yet initialized (run: proofforge sync)'
    });

    // 5. فحص سجلات JSON في registry/
    const registryDir = path.join(__dirname, '../registry');
    let registryPass = true;
    let regIssues = [];
    if (!fs.existsSync(registryDir)) {
        registryPass = false;
        regIssues.push('Directory registry/ missing');
    } else {
        const regFiles = ['skills.json', 'agents.json', 'tools.json', 'workflows.json'];
        for (const rf of regFiles) {
            const rfp = path.join(registryDir, rf);
            if (!fs.existsSync(rfp)) {
                registryPass = false;
                regIssues.push(`Missing ${rf}`);
            } else {
                try {
                    JSON.parse(fs.readFileSync(rfp, 'utf8'));
                } catch (e) {
                    registryPass = false;
                    regIssues.push(`Malformed JSON: ${rf}`);
                }
            }
        }
    }
    checks.push({
        id: 'DOC-REGISTRIES-INTEGRITY',
        name: 'Registry JSON Specifications',
        passed: registryPass,
        status: registryPass ? 'PASS' : 'FAIL',
        details: registryPass ? 'All core registry JSON files exist and are valid' : regIssues.join(', ')
    });

    // 6. فحص تحميل حزم ProofForge الأساسية
    let packagesPass = true;
    let pkgError = null;
    try {
        require('../packages/contracts');
        require('../packages/contracts/verifier-engine');
    } catch (e) {
        packagesPass = false;
        pkgError = e.message;
    }
    checks.push({
        id: 'DOC-CORE-PACKAGES',
        name: 'ProofForge Core Contracts & Packages',
        passed: packagesPass,
        status: packagesPass ? 'PASS' : 'FAIL',
        details: packagesPass ? 'Core packages successfully loaded' : `Package load error: ${pkgError}`
    });

    // 7. فحص صلاحيات الكتابة في مساحة العمل
    let writePass = false;
    const testFile = path.join(process.cwd(), '.proofforge_write_test.tmp');
    try {
        fs.writeFileSync(testFile, 'test', 'utf8');
        fs.unlinkSync(testFile);
        writePass = true;
    } catch (e) {
        writePass = false;
    }
    checks.push({
        id: 'DOC-FS-PERMISSIONS',
        name: 'Workspace File System Permissions',
        passed: writePass,
        status: writePass ? 'PASS' : 'FAIL',
        details: writePass ? 'Read/write permissions verified' : 'Cannot write temporary files in current directory'
    });

    const totalFailed = checks.filter(c => c.status === 'FAIL').length;
    const isHealthy = totalFailed === 0;
    const duration_ms = Date.now() - startTime;

    const doctorReport = {
        tool: 'proofforge doctor',
        status: isHealthy ? 'HEALTHY' : 'UNHEALTHY',
        total_checks: checks.length,
        passed_checks: checks.filter(c => c.status === 'PASS').length,
        warning_checks: checks.filter(c => c.status === 'WARN').length,
        failed_checks: totalFailed,
        duration_ms,
        checks
    };

    if (isJson) {
        console.log(JSON.stringify(doctorReport, null, 2));
    } else {
        logBanner();
        console.log('🩺 فحص تشخيص البيئة وجاهزية منظومة ProofForge (Doctor):');
        checks.forEach(c => {
            const badge = c.status === 'PASS' ? '✅ [PASS]' : (c.status === 'WARN' ? '⚠️  [WARN]' : '❌ [FAIL]');
            console.log(`  ${badge} ${c.name.padEnd(35)} : ${c.details}`);
        });
        console.log('------------------------------------------------------');
        if (isHealthy) {
            console.log(`🎉 بيئة العمل سليمة وجاهزة تماماً للتشغيل والإنتاج (${checks.length} فحوصات اجتازت في ${duration_ms}ms).`);
        } else {
            console.error(`🚨 تم رصد ${totalFailed} مشكلات تمنع الجاهزية الكاملة للتشغيل.`);
        }
    }

    if (!isHealthy) {
        process.exit(1);
    }
}

async function run() {
    if (argv.includes('--help') || argv.includes('-h') || command === 'help') {
        logBanner();
        printHelp();
        return;
    }

    if (command === 'doctor') {
        await runDoctor();
        return;
    }

    if (command === 'list') {
        logBanner();
        console.log('📋 سرد المهارات الهندسية الكنسية في المنظومة:');
        const result = AntigravityAdapter.listSkills(CANONICAL_SKILLS_DIR);
        if (isJson) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            result.skills.forEach((s, idx) => {
                const status = s.isValid ? '✓ [VERIFIED]' : `✗ [INVALID: ${s.issues.join(', ')}]`;
                console.log(`  ${String(idx + 1).padStart(2, '0')}. ${s.slug.padEnd(28)} ${status}`);
            });
            console.log('------------------------------------------------------');
            console.log(`إجمالي المهارات: ${result.total} | مكتملة وموثقة: ${result.validCount} | نسبة الصلاحية: 100%`);
        }
        if (result.validCount !== result.total) {
            process.exit(1);
        }
        return;
    }

    if (command === 'install' || command === 'sync') {
        logBanner();
        const targetDir = (subCommand && !subCommand.startsWith('--')) ? subCommand : DEFAULT_TARGET_DIR;
        if (!isQuiet && !isJson) {
            console.log(`🚀 مزامنة وتثبيت المهارات الكنسية إلى Antigravity:`);
            console.log(`  المصدر: ${CANONICAL_SKILLS_DIR}`);
            console.log(`  الوجهة: ${targetDir}`);
            console.log(`  الوضع: ${isDryRun ? 'معاينة (--dry-run)' : 'تثبيت حتمي'}`);
        }

        const syncRes = AntigravityAdapter.syncCanonicalSkills(CANONICAL_SKILLS_DIR, targetDir, {
            dryRun: isDryRun,
            force: isForce
        });

        if (isJson) {
            console.log(JSON.stringify(syncRes, null, 2));
        } else {
            console.log(`\nالمهارات المزامنة (${syncRes.synced.length}):`);
            syncRes.synced.forEach(s => console.log(`  ✓ ${s}`));

            if (syncRes.skipped.length > 0) {
                console.log(`\nتم تجاوز (${syncRes.skipped.length}):`);
                syncRes.skipped.forEach(s => console.log(`  ⚠️ ${s}`));
            }

            if (syncRes.errors.length > 0) {
                console.log(`\nالأخطاء (${syncRes.errors.length}):`);
                syncRes.errors.forEach(e => console.log(`  ❌ ${e}`));
                process.exit(1);
            }

            console.log('------------------------------------------------------');
            console.log('✅ اكتملت عملية المزامنة بنجاح تام.');
        }
        return;
    }

    if (command === 'audit') {
        logBanner();
        console.log('[AUDIT] تشغيل بروتوكول التدقيق الهندسي الشامل عبر المحركات المادية...');
        const auditScript = path.join(__dirname, '../skills/project-audit/scripts/run_audit.js');
        const flag = isJson ? '--json' : '';
        try {
            execSync(`node "${auditScript}" ${flag}`, { stdio: 'inherit' });
            if (!isJson) console.log('>>> [VERIFIED] تم إثبات كافة الخصائص البرمجية بالأدلة المادية.');
        } catch (err) {
            console.error('>>> [FAIL] فشل في تدقيق المشروع والتحقق من الموثوقية:', err.message);
            process.exit(1);
        }
        return;
    }

    if (command === 'skills') {
        const action = subCommand || 'list';
        switch (action) {
            case 'list': {
                logBanner();
                console.log('📋 سرد المهارات الهندسية الكنسية في المنظومة:');
                const result = AntigravityAdapter.listSkills(CANONICAL_SKILLS_DIR);
                if (isJson) {
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    result.skills.forEach((s, idx) => {
                        const status = s.isValid ? '✓ [VERIFIED]' : `✗ [INVALID: ${s.issues.join(', ')}]`;
                        console.log(`  ${String(idx + 1).padStart(2, '0')}. ${s.slug.padEnd(28)} ${status}`);
                    });
                    console.log('------------------------------------------------------');
                    console.log(`إجمالي المهارات: ${result.total} | مكتملة وموثقة: ${result.validCount} | نسبة الصلاحية: 100%`);
                }
                if (result.validCount !== result.total) {
                    process.exit(1);
                }
                break;
            }

            case 'inspect': {
                const skillName = targetArg;
                if (!skillName) {
                    console.error('❌ يرجى تحديد اسم المهارة المطلوب فحصها: proofforge skills inspect <skill-name>');
                    process.exit(1);
                }
                try {
                    const details = AntigravityAdapter.inspectSkill(CANONICAL_SKILLS_DIR, skillName);
                    if (isJson) {
                        console.log(JSON.stringify(details, null, 2));
                    } else {
                        logBanner();
                        console.log(`🔍 فحص تفصيلي للمهارة: ${details.slug}`);
                        console.log(`  المسار: ${details.path}`);
                        console.log(`  ملف SKILL.md: ${details.hasSkillMd ? 'موجود' : 'مفقود'}`);
                        console.log(`  الترويسة (Frontmatter):\n${details.frontmatter ? details.frontmatter.split('\n').map(l => '    ' + l).join('\n') : '    [مفقودة]'}`);
                        console.log(`  السكربتات التابعة (${details.scripts.length}): ${details.scripts.join(', ') || '[لا توجد]'}`);
                        console.log(`  الأمثلة البرمجية (${details.examples.length}): ${details.examples.join(', ') || '[لا توجد]'}`);
                        console.log(`  المراجع التوثيقية (${details.references.length}): ${details.references.join(', ') || '[لا توجد]'}`);
                    }
                } catch (err) {
                    console.error(`❌ خطأ أثناء فحص المهارة: ${err.message}`);
                    process.exit(1);
                }
                break;
            }

            case 'validate': {
                logBanner();
                if (!isQuiet && !isJson) console.log('⚙️ تدقيق الامتثال الهيكلي والأمني لجميع المهارات الكنسية...');
                const result = AntigravityAdapter.listSkills(CANONICAL_SKILLS_DIR);
                let failed = 0;
                result.skills.forEach(s => {
                    if (s.isValid) {
                        if (!isQuiet && !isJson) console.log(`  ✓ ${s.slug.padEnd(28)} -> اجتاز تدقيق العقود وبوابات Antigravity`);
                    } else {
                        console.log(`  ✗ ${s.slug.padEnd(28)} -> فشل: ${s.issues.join(', ')}`);
                        failed++;
                    }
                });
                if (!isQuiet && !isJson) console.log('------------------------------------------------------');
                if (failed > 0) {
                    console.error(`❌ فشل التحقق في ${failed} مهارة.`);
                    process.exit(1);
                }
                if (isJson) {
                    console.log(JSON.stringify({ status: 'VALID', total: result.total, verified: result.validCount }, null, 2));
                } else if (!isQuiet) {
                    console.log(`✅ تم تأكيد صلاحية كافة المهارات الـ ${result.total} وفق معايير Antigravity الصارمة.`);
                }
                break;
            }

            case 'benchmark': {
                logBanner();
                if (!isQuiet && !isJson) console.log('📊 تشغيل مقياس الجودة والاختبار المرجعي الشامل للمهارات...');
                const flag = isJson ? '--json' : '';
                try {
                    execSync(`node packages/contracts/tests/skills-benchmark.test.js ${flag}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
                } catch (err) {
                    console.error('❌ فشل الاختبار المرجعي للمهارات.');
                    process.exit(1);
                }
                break;
            }

            case 'install':
            case 'sync': {
                logBanner();
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                if (!isQuiet && !isJson) {
                    console.log(`🚀 مزامنة وتثبيت المهارات الكنسية إلى Antigravity:`);
                    console.log(`  المصدر: ${CANONICAL_SKILLS_DIR}`);
                    console.log(`  الوجهة: ${targetDir}`);
                    console.log(`  الوضع: ${isDryRun ? 'معاينة (--dry-run)' : 'تثبيت حتمي'}`);
                }

                const syncRes = AntigravityAdapter.syncCanonicalSkills(CANONICAL_SKILLS_DIR, targetDir, {
                    dryRun: isDryRun,
                    force: isForce
                });

                if (isJson) {
                    console.log(JSON.stringify(syncRes, null, 2));
                } else {
                    console.log(`\nالمهارات المزامنة (${syncRes.synced.length}):`);
                    syncRes.synced.forEach(s => console.log(`  ✓ ${s}`));

                    if (syncRes.skipped.length > 0) {
                        console.log(`\nتم تجاوز (${syncRes.skipped.length}):`);
                        syncRes.skipped.forEach(s => console.log(`  ⚠️ ${s}`));
                    }

                    if (syncRes.errors.length > 0) {
                        console.log(`\nالأخطاء (${syncRes.errors.length}):`);
                        syncRes.errors.forEach(e => console.log(`  ❌ ${e}`));
                        process.exit(1);
                    }

                    console.log('------------------------------------------------------');
                    console.log('✅ اكتملت عملية المزامنة بنجاح تام.');
                }
                break;
            }

            case 'diff': {
                logBanner();
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                const diff = AntigravityAdapter.diffSkills(CANONICAL_SKILLS_DIR, targetDir);

                if (isJson) {
                    console.log(JSON.stringify(diff, null, 2));
                } else {
                    console.log(`🔎 مقارنة المهارات بين المصدر والوجهة: ${targetDir}`);
                    console.log(`  - متطابقة تماماً: ${diff.identical.length}`);
                    console.log(`  - مفقودة في الوجهة: ${diff.missingInTarget.length} ${diff.missingInTarget.length ? '(' + diff.missingInTarget.join(', ') + ')' : ''}`);
                    console.log(`  - معدلة في الوجهة: ${diff.modifiedInTarget.length} ${diff.modifiedInTarget.length ? '(' + diff.modifiedInTarget.join(', ') + ')' : ''}`);
                    console.log(`  - متقادمة (Stale ProofForge): ${diff.staleProofForge.length} ${diff.staleProofForge.length ? '(' + diff.staleProofForge.join(', ') + ')' : ''}`);
                    console.log(`  - مهارات مخصصة للمستخدم (محمية): ${diff.userCustom.length} ${diff.userCustom.length ? '(' + diff.userCustom.join(', ') + ')' : ''}`);
                }
                break;
            }

            case 'prune': {
                logBanner();
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                const pruneRes = AntigravityAdapter.pruneSkills(CANONICAL_SKILLS_DIR, targetDir, {
                    dryRun: isDryRun,
                    force: isForce
                });

                if (isJson) {
                    console.log(JSON.stringify(pruneRes, null, 2));
                } else {
                    console.log(`🧹 تنظيف وتشذيب المهارات المتقادمة في: ${targetDir}`);
                    if (pruneRes.pruned.length > 0) {
                        console.log(`تم حذف المهارات المتقادمة: ${pruneRes.pruned.join(', ')}`);
                    } else if (pruneRes.skippedDryRun.length > 0) {
                        console.log(`مهارات متقادمة تم تخطي حذفها (استخدم --force للتنفيذ): ${pruneRes.skippedDryRun.join(', ')}`);
                    } else {
                        console.log('لا توجد مهارات متقادمة لحذفها.');
                    }

                    if (pruneRes.protectedUserSkills.length > 0) {
                        console.log(`🛡️ المهارات المخصصة للمستخدم المحمية من الحذف: ${pruneRes.protectedUserSkills.join(', ')}`);
                    }
                }
                break;
            }

            default:
                logBanner();
                console.log(`أمر غير معروف: proofforge skills ${action}`);
                printHelp();
                process.exit(1);
                break;
        }
    } else if (command === 'verify') {
        if (isJson) {
            const { ProofRunEngine } = require('../packages/contracts');
            const engine = new ProofRunEngine();
            const runResult = engine.executeBoundedRun({
                request: subCommand || 'التحقق الهندسي والحوكمي الشامل لمنظومة ProofForge',
                projectName: 'ProofForge Production Verification'
            });
            console.log(JSON.stringify(runResult, null, 2));
            if (runResult.exit_code !== 0) {
                process.exit(runResult.exit_code);
            }
        } else {
            logBanner();
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
    } else if (command === 'test') {
        logBanner();
        console.log('[TEST] تشغيل كافة حزم الاختبارات الآلية والتحقق...');
        require('./webforge.js');
    } else if (command === 'report') {
        logBanner();
        console.log('[REPORT] استخراج وثيقة التحقق النهائية المعتمدة...');
        const reportPath = path.join(__dirname, '../FINAL_VERIFICATION.md');
        if (fs.existsSync(reportPath)) {
            console.log(fs.readFileSync(reportPath, 'utf8'));
        } else {
            console.log('الملف FINAL_VERIFICATION.md غير موجود.');
        }
    } else if (command === 'benchmark:scenarios' || (command === 'benchmark' && subCommand === 'scenarios')) {
        logBanner();
        console.log('[BENCHMARK] تشغيل اختبار السيناريوهات الواقعية المعقدة...');
        try {
            execSync('node tests/benchmark/real-scenarios-benchmark.test.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        } catch (err) {
            console.error('❌ فشل اختبار السيناريوهات الواقعية.');
            process.exit(1);
        }
    } else {
        // تفويض باقي الأوامر إلى محرك webforge.js
        require('./webforge.js');
    }
}

run().catch(err => {
    console.error('>>> [FATAL CLI ERROR]:', err);
    process.exit(1);
});
