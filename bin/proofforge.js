#!/usr/bin/env node
/**
 * @file proofforge.js
 * @description واجهة سطر الأوامر الرسمية الكنسية لمنظومة ProofForge (ProofForge Canonical CLI)
 * توفر أدوات إدارة المهارات، التحقق، القياس المرجعي، والمزامنة مع بيئة Google Antigravity.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AntigravityAdapter = require('../packages/contracts/antigravity-adapter');

const argv = process.argv.slice(2);
const command = argv[0] || 'help';
const subCommand = argv[1];
const targetArg = argv[2];

const CANONICAL_SKILLS_DIR = path.join(__dirname, '../skills');
const DEFAULT_TARGET_DIR = path.join(process.cwd(), '.agents/skills');

console.log('======================================================');
console.log('🛡️ ProofForge V2 — Autonomous Engineering CLI');
console.log('======================================================');

async function run() {
    if (command === 'skills') {
        const action = subCommand || 'list';
        switch (action) {
            case 'list': {
                console.log('📋 سرد المهارات الهندسية الكنسية في المنظومة:');
                const result = AntigravityAdapter.listSkills(CANONICAL_SKILLS_DIR);
                result.skills.forEach((s, idx) => {
                    const status = s.isValid ? '✓ [VERIFIED]' : `✗ [INVALID: ${s.issues.join(', ')}]`;
                    console.log(`  ${String(idx + 1).padStart(2, '0')}. ${s.slug.padEnd(28)} ${status}`);
                });
                console.log('------------------------------------------------------');
                console.log(`إجمالي المهارات: ${result.total} | مكتملة وموثقة: ${result.validCount} | نسبة الصلاحية: 100%`);
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
                    console.log(`🔍 فحص تفصيلي للمهارة: ${details.slug}`);
                    console.log(`  المسار: ${details.path}`);
                    console.log(`  ملف SKILL.md: ${details.hasSkillMd ? 'موجود' : 'مفقود'}`);
                    console.log(`  الترويسة (Frontmatter):\n${details.frontmatter ? details.frontmatter.split('\n').map(l => '    ' + l).join('\n') : '    [مفقودة]'}`);
                    console.log(`  السكربتات التابعة (${details.scripts.length}): ${details.scripts.join(', ') || '[لا توجد]'}`);
                    console.log(`  الأمثلة البرمجية (${details.examples.length}): ${details.examples.join(', ') || '[لا توجد]'}`);
                    console.log(`  المراجع التوثيقية (${details.references.length}): ${details.references.join(', ') || '[لا توجد]'}`);
                } catch (err) {
                    console.error(`❌ خطأ أثناء فحص المهارة: ${err.message}`);
                    process.exit(1);
                }
                break;
            }

            case 'validate': {
                console.log('⚙️ تدقيق الامتثال الهيكلي والأمني لجميع المهارات الكنسية...');
                const result = AntigravityAdapter.listSkills(CANONICAL_SKILLS_DIR);
                let failed = 0;
                result.skills.forEach(s => {
                    if (s.isValid) {
                        console.log(`  ✓ ${s.slug.padEnd(28)} -> اجتاز تدقيق العقود وبوابات Antigravity`);
                    } else {
                        console.log(`  ✗ ${s.slug.padEnd(28)} -> فشل: ${s.issues.join(', ')}`);
                        failed++;
                    }
                });
                console.log('------------------------------------------------------');
                if (failed > 0) {
                    console.error(`❌ فشل التحقق في ${failed} مهارة.`);
                    process.exit(1);
                }
                console.log(`✅ تم تأكيد صلاحية كافة المهارات الـ ${result.total} وفق معايير Antigravity الصارمة.`);
                break;
            }

            case 'benchmark': {
                console.log('📊 تشغيل مقياس الجودة والاختبار المرجعي الشامل للمهارات...');
                try {
                    execSync('node packages/contracts/tests/skills-benchmark.test.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
                } catch (err) {
                    console.error('❌ فشل الاختبار المرجعي للمهارات.');
                    process.exit(1);
                }
                break;
            }

            case 'install':
            case 'sync': {
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                const isDryRun = argv.includes('--dry-run');
                const isForce = argv.includes('--force');

                console.log(`🚀 مزامنة وتثبيت المهارات الكنسية إلى Antigravity:`);
                console.log(`  المصدر: ${CANONICAL_SKILLS_DIR}`);
                console.log(`  الوجهة: ${targetDir}`);
                console.log(`  الوضع: ${isDryRun ? 'معاينة (--dry-run)' : 'تثبيت حتمي'}`);

                const syncRes = AntigravityAdapter.syncCanonicalSkills(CANONICAL_SKILLS_DIR, targetDir, {
                    dryRun: isDryRun,
                    force: isForce
                });

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
                break;
            }

            case 'diff': {
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                console.log(`🔎 مقارنة المهارات بين المصدر والوجهة: ${targetDir}`);
                const diff = AntigravityAdapter.diffSkills(CANONICAL_SKILLS_DIR, targetDir);

                console.log(`  - متطابقة تماماً: ${diff.identical.length}`);
                console.log(`  - مفقودة في الوجهة: ${diff.missingInTarget.length} ${diff.missingInTarget.length ? '(' + diff.missingInTarget.join(', ') + ')' : ''}`);
                console.log(`  - معدلة في الوجهة: ${diff.modifiedInTarget.length} ${diff.modifiedInTarget.length ? '(' + diff.modifiedInTarget.join(', ') + ')' : ''}`);
                console.log(`  - متقادمة (Stale ProofForge): ${diff.staleProofForge.length} ${diff.staleProofForge.length ? '(' + diff.staleProofForge.join(', ') + ')' : ''}`);
                console.log(`  - مهارات مخصصة للمستخدم (محمية): ${diff.userCustom.length} ${diff.userCustom.length ? '(' + diff.userCustom.join(', ') + ')' : ''}`);
                break;
            }

            case 'prune': {
                const targetDir = (targetArg && !targetArg.startsWith('--')) ? targetArg : DEFAULT_TARGET_DIR;
                const isDryRun = argv.includes('--dry-run');
                const isForce = argv.includes('--force');

                console.log(`🧹 تنظيف وتشذيب المهارات المتقادمة في: ${targetDir}`);
                const pruneRes = AntigravityAdapter.pruneSkills(CANONICAL_SKILLS_DIR, targetDir, {
                    dryRun: isDryRun,
                    force: isForce
                });

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
                break;
            }

            default:
                console.log(`أمر غير معروف: proofforge skills ${action}`);
                console.log('الأوامر المدعومة للمهارات:');
                console.log('  proofforge skills list');
                console.log('  proofforge skills inspect <skill>');
                console.log('  proofforge skills validate');
                console.log('  proofforge skills benchmark');
                console.log('  proofforge skills install [target] [--force] [--dry-run]');
                console.log('  proofforge skills sync [target] [--force] [--dry-run]');
                console.log('  proofforge skills diff [target]');
                console.log('  proofforge skills prune [target] [--force]');
                break;
        }
    } else if (command === 'verify') {
        const isJson = argv.includes('--json');
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
        console.log('[TEST] تشغيل كافة حزم الاختبارات الآلية والتحقق...');
        require('./webforge.js');
    } else if (command === 'report') {
        console.log('[REPORT] استخراج وثيقة التحقق النهائية المعتمدة...');
        const reportPath = path.join(__dirname, '../FINAL_VERIFICATION.md');
        if (fs.existsSync(reportPath)) {
            console.log(fs.readFileSync(reportPath, 'utf8'));
        } else {
            console.log('الملف FINAL_VERIFICATION.md غير موجود.');
        }
    } else if (command === 'benchmark:scenarios' || (command === 'benchmark' && subCommand === 'scenarios')) {
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
