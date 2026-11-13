/**
 * @file antigravity-adapter.js
 * @description محرك محول Google Antigravity الهيكلي الكنسي في نظام ProofForge (V3 Hardened Suite)
 * ينفذ التحويلات التصريحية الحتمية لأصول ProofForge إلى قطع متوافقة مع Google Antigravity
 * مع تطبيق بيان الملكية الكامل، وقواعد المزامنة الآمنة، وحماية مهارات وتعديلات المستخدمين.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const PathLoaderGuard = require('./path-loader-guard');

class AntigravityAdapter {
    static MANIFEST_SCHEMA_VERSION = '3.0.0';
    static GENERATOR_VERSION = '3.0.0';
    static OWNERSHIP_MARKER = 'proofforge-managed';
    static MANIFEST_FILENAME = '.proofforge-manifest.json';

    static ALLOWED_TARGET_PREFIXES = Object.freeze([
        'AGENTS.md',
        '.agents/rules/',
        '.agents/skills/'
    ]);

    /**
     * تطهير وضبط اسم المهارة ليتوافق مع معايير Antigravity الصارمة
     * (أحرف إنجليزية صغيرة وأرقام وشرطات فقط)
     */
    static sanitizeSkillName(rawName) {
        if (!rawName || typeof rawName !== 'string') {
            throw new Error('اسم المهارة المصدري غير معرف أو ليس نصاً (Fail-Closed)');
        }

        const cleaned = rawName
            .trim()
            .toLowerCase()
            .replace(/^pf-skill-/, '')
            .replace(/[^a-z0-9_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!cleaned || !/^[a-z0-9-]+$/.test(cleaned)) {
            throw new Error(`اسم المهارة الناتج '${cleaned}' غير صالح، يجب أن يتكون حصراً من أحرف صغيرة وأرقام وشرطات`);
        }

        return cleaned;
    }

    /**
     * ترميز قيم YAML بأمان مع معالجة الأسطر المتعددة والرموز الخاصة
     */
    static serializeYamlString(value) {
        if (value === null || value === undefined) return '""';
        const str = String(value).replace(/\r\n/g, '\n').trim();
        if (str.includes('\n') || /[:#@%`'"\[\]{}|>*\&?!,~\-]/.test(str)) {
            return JSON.stringify(str);
        }
        return str;
    }

    /**
     * حساب تجزئة SHA-256 للمحتوى
     */
    static computeHash(content) {
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    /**
     * حساب تجزئة SHA-256 لملف على القرص
     */
    static computeFileHash(filePath) {
        if (!fs.existsSync(filePath)) return null;
        const buf = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(buf).digest('hex');
    }

    /**
     * التحقق الصارم من سلامة المسار والوقاية من القفز عبر المسارات
     */
    static validatePath(relativePath, baseDir = process.cwd()) {
        if (!relativePath || typeof relativePath !== 'string') {
            return { isValid: false, error: 'المسار المستهدف غير معرف أو ليس نصاً' };
        }

        const trimmed = relativePath.trim().replace(/\\/g, '/');

        if (trimmed.includes('..') || trimmed.startsWith('/') || /^[a-zA-Z]:/.test(trimmed)) {
            return { isValid: false, error: `محاولة قفز مسار غير مصرح بها أو مسار مطلق: '${relativePath}'` };
        }

        if (!trimmed.endsWith('.md')) {
            return { isValid: false, error: `امتداد الملف غير مصرح به: '${relativePath}'. يجب أن ينتهي بـ .md` };
        }

        const isAllowedPrefix = AntigravityAdapter.ALLOWED_TARGET_PREFIXES.some(prefix => {
            if (prefix.endsWith('/')) {
                return trimmed.startsWith(prefix);
            }
            return trimmed === prefix;
        });

        if (!isAllowedPrefix) {
            return {
                isValid: false,
                error: `المسار المستهدف '${relativePath}' لا يقع ضمن البادئات المصرح بها لـ Antigravity (${AntigravityAdapter.ALLOWED_TARGET_PREFIXES.join(', ')})`
            };
        }

        const resolvedBase = path.resolve(baseDir);
        const resolvedPath = path.resolve(resolvedBase, trimmed);

        if (!PathLoaderGuard.isInsideRoot(resolvedPath, resolvedBase)) {
            return { isValid: false, error: 'المسار النهائي يقع خارج مساحة العمل (Path Traversal Detected)' };
        }

        return { isValid: true, safePath: resolvedPath };
    }

    /**
     * مسار ملف بيان الملكية المعتمد
     */
    static getManifestPath(targetDir) {
        return path.join(targetDir, AntigravityAdapter.MANIFEST_FILENAME);
    }

    /**
     * قراءة بيان الملكية المعتمد (Ownership Manifest)
     */
    static readManifest(targetDir) {
        const manifestPath = this.getManifestPath(targetDir);
        if (fs.existsSync(manifestPath)) {
            try {
                const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (parsed && typeof parsed === 'object' && parsed.skills) {
                    return parsed;
                }
            } catch (e) {
                // بيان تالف: نعيد هيكل جديد مع تسجيل تلف
                return {
                    manifestSchemaVersion: AntigravityAdapter.MANIFEST_SCHEMA_VERSION,
                    generatorVersion: AntigravityAdapter.GENERATOR_VERSION,
                    ownershipMarker: AntigravityAdapter.OWNERSHIP_MARKER,
                    managedBy: 'ProofForge AntigravityAdapter',
                    corrupted: true,
                    skills: {}
                };
            }
        }
        return {
            manifestSchemaVersion: AntigravityAdapter.MANIFEST_SCHEMA_VERSION,
            generatorVersion: AntigravityAdapter.GENERATOR_VERSION,
            ownershipMarker: AntigravityAdapter.OWNERSHIP_MARKER,
            managedBy: 'ProofForge AntigravityAdapter',
            updatedAt: new Date().toISOString(),
            skills: {}
        };
    }

    /**
     * كتابة بيان الملكية المعتمد بأمان وذرية
     */
    static writeManifest(targetDir, manifest) {
        manifest.manifestSchemaVersion = AntigravityAdapter.MANIFEST_SCHEMA_VERSION;
        manifest.generatorVersion = AntigravityAdapter.GENERATOR_VERSION;
        manifest.ownershipMarker = AntigravityAdapter.OWNERSHIP_MARKER;
        manifest.managedBy = 'ProofForge AntigravityAdapter';
        manifest.updatedAt = new Date().toISOString();

        const manifestPath = this.getManifestPath(targetDir);
        PathLoaderGuard.safeAtomicWrite(manifestPath, JSON.stringify(manifest, null, 2), {
            projectRoot: targetDir
        });
    }

    /**
     * مسح وحصر كافة الملفات داخل مجلد المهارة وحساب بياناتها وتجزئتها
     * @param {string} skillDir 
     * @returns {Object<string, {hash: string, size: number, type: string, relativePath: string}>}
     */
    static scanSkillInventory(skillDir) {
        const inventory = {};
        if (!fs.existsSync(skillDir)) return inventory;

        const walk = (current, rel) => {
            let entries;
            try {
                entries = fs.readdirSync(current, { withFileTypes: true });
            } catch (e) {
                return;
            }

            for (const entry of entries) {
                if (entry.name.startsWith('.tmp-') || entry.name === AntigravityAdapter.MANIFEST_FILENAME) continue;
                if (entry.isSymbolicLink()) continue;

                const fullPath = path.join(current, entry.name);
                const nextRel = rel ? `${rel}/${entry.name}` : entry.name;

                if (entry.isDirectory()) {
                    walk(fullPath, nextRel);
                } else if (entry.isFile()) {
                    const content = fs.readFileSync(fullPath);
                    const hash = crypto.createHash('sha256').update(content).digest('hex');
                    let type = 'other';
                    if (nextRel === 'SKILL.md') type = 'markdown';
                    else if (nextRel.startsWith('scripts/')) type = 'script';
                    else if (nextRel.startsWith('references/')) type = 'reference';
                    else if (nextRel.startsWith('examples/')) type = 'example';
                    else if (nextRel.startsWith('assets/')) type = 'asset';
                    else if (nextRel.startsWith('tests/')) type = 'test';

                    inventory[nextRel] = {
                        hash,
                        size: content.length,
                        type,
                        relativePath: nextRel
                    };
                }
            }
        };

        walk(skillDir, '');
        return inventory;
    }

    /**
     * مقارنة الفروق الكاملة بين المصدر الكنسي والمجلد المثبت بنموذج الملكية الحتمي الشامل
     */
    static diffSkills(canonicalSkillsDir, targetDir) {
        if (!fs.existsSync(canonicalSkillsDir)) {
            throw new Error(`مجلد المهارات الكنسي '${canonicalSkillsDir}' غير موجود.`);
        }

        const canonicalEntries = fs.readdirSync(canonicalSkillsDir, { withFileTypes: true })
            .filter(e => e.isDirectory())
            .map(e => e.name)
            .sort();

        const targetEntries = fs.existsSync(targetDir)
            ? fs.readdirSync(targetDir, { withFileTypes: true })
                .filter(e => e.isDirectory() && !e.name.startsWith('.'))
                .map(e => e.name)
                .sort()
            : [];

        const manifest = this.readManifest(targetDir);
        const manifestSkills = manifest.skills || {};

        const diffReport = {
            identical: [],
            missingInTarget: [],
            modifiedInTarget: [],
            addedFiles: [],
            removedFiles: [],
            canonicalUpdated: [],
            ownershipConflicts: [],
            staleProofForge: [],
            userCustom: []
        };

        for (const skill of canonicalEntries) {
            const canonicalSkillDir = path.join(canonicalSkillsDir, skill);
            const targetSkillDir = path.join(targetDir, skill);

            if (!fs.existsSync(targetSkillDir)) {
                diffReport.missingInTarget.push(skill);
                continue;
            }

            // فحص هل المهارة مسجلة في بيان الملكية كمهارة تابعة لـ ProofForge
            const skillManifest = manifestSkills[skill];
            if (!skillManifest) {
                // المجلد موجود في الهدف ولكنه غير مسجل في بيان الملكية -> مهارة مخصصة للمستخدم تحمل نفس الاسم!
                diffReport.ownershipConflicts.push({
                    skill,
                    file: '*',
                    type: 'UNOWNED_SKILL_COLLISION',
                    message: `المجلد '${skill}' موجود في الوجهة ولكنه غير مسجل في بيان ملكية ProofForge`
                });
                diffReport.userCustom.push(skill);
                continue;
            }

            const canonicalFiles = AntigravityAdapter.scanSkillInventory(canonicalSkillDir);
            const targetFiles = AntigravityAdapter.scanSkillInventory(targetSkillDir);
            const recordedFiles = skillManifest.files || {};

            let skillFullyIdentical = true;

            // 1. فحص ملفات المصدر الكنسي
            for (const [relPath, canInfo] of Object.entries(canonicalFiles)) {
                const tarInfo = targetFiles[relPath];
                const recInfo = recordedFiles[relPath];

                if (!tarInfo) {
                    diffReport.addedFiles.push({ skill, file: relPath, canonicalHash: canInfo.hash });
                    skillFullyIdentical = false;
                } else if (!recInfo) {
                    // ملف موجود في الهدف ولكن لم يكن في البيان
                    diffReport.ownershipConflicts.push({
                        skill,
                        file: relPath,
                        type: 'UNOWNED_FILE',
                        message: `الملف '${relPath}' موجود على القرص دون تسجيل في بيان الملكية`
                    });
                    skillFullyIdentical = false;
                } else {
                    // الملف مسجل في البيان وموجود في الهدف
                    if (tarInfo.hash !== recInfo.hash) {
                        // المستخدم عدل الملف في الوجهة!
                        diffReport.modifiedInTarget.push({
                            skill,
                            file: relPath,
                            recordedHash: recInfo.hash,
                            currentHash: tarInfo.hash
                        });
                        skillFullyIdentical = false;
                    } else if (canInfo.hash !== recInfo.hash) {
                        // الملف الأصلي تحدث في الكنسي ولكن الهدف لم يتغير عن حالته المسجلة
                        diffReport.canonicalUpdated.push({
                            skill,
                            file: relPath,
                            canonicalHash: canInfo.hash,
                            recordedHash: recInfo.hash
                        });
                        skillFullyIdentical = false;
                    }
                }
            }

            // 2. فحص الملفات التي أزيلت من الكنسي وكانت مسجلة
            for (const [relPath, recInfo] of Object.entries(recordedFiles)) {
                if (!canonicalFiles[relPath]) {
                    const tarInfo = targetFiles[relPath];
                    diffReport.removedFiles.push({
                        skill,
                        file: relPath,
                        recordedHash: recInfo.hash,
                        existsOnDisk: Boolean(tarInfo),
                        userModified: Boolean(tarInfo && tarInfo.hash !== recInfo.hash)
                    });
                    skillFullyIdentical = false;
                }
            }

            if (skillFullyIdentical) {
                diffReport.identical.push(skill);
            }
        }

        // 3. فحص المهارات الزائدة في الوجهة
        for (const targetSkill of targetEntries) {
            if (!canonicalEntries.includes(targetSkill)) {
                if (manifestSkills[targetSkill]) {
                    diffReport.staleProofForge.push(targetSkill);
                } else {
                    diffReport.userCustom.push(targetSkill);
                }
            }
        }

        // ترتيب النتائج حتمياً
        diffReport.identical.sort();
        diffReport.missingInTarget.sort();
        diffReport.staleProofForge.sort();
        diffReport.userCustom.sort();

        return diffReport;
    }

    /**
     * مزامنة المهارات الكنسية إلى مساحة عمل Antigravity وفق قواعد الأمان الحتمية وسجل الملكية
     */
    static syncCanonicalSkills(canonicalSkillsDir, targetDir, options = {}) {
        const dryRun = options.dryRun || false;
        const force = options.force || false;

        const report = {
            synced: [],
            updated: [],
            preserved: [],
            skipped: [],
            conflicts: [],
            errors: []
        };

        if (!fs.existsSync(canonicalSkillsDir)) {
            throw new Error(`مجلد المهارات الكنسي '${canonicalSkillsDir}' غير موجود.`);
        }

        // التأكد من أمان مجلد الوجهة
        PathLoaderGuard.validateSafeWritePath(path.join(targetDir, '.probe'), { projectRoot: targetDir });

        const canonicalEntries = fs.readdirSync(canonicalSkillsDir, { withFileTypes: true })
            .filter(e => e.isDirectory())
            .map(e => e.name)
            .sort();

        const manifest = this.readManifest(targetDir);
        manifest.manifestSchemaVersion = AntigravityAdapter.MANIFEST_SCHEMA_VERSION;
        manifest.generatorVersion = AntigravityAdapter.GENERATOR_VERSION;
        manifest.managedBy = 'ProofForge AntigravityAdapter';
        manifest.ownershipMarker = AntigravityAdapter.OWNERSHIP_MARKER;
        if (!manifest.skills) manifest.skills = {};

        for (const skillName of canonicalEntries) {
            const sanitizedSlug = AntigravityAdapter.sanitizeSkillName(skillName);
            const sourcePath = path.join(canonicalSkillsDir, skillName);
            const sourceSkillMd = path.join(sourcePath, 'SKILL.md');

            if (!fs.existsSync(sourceSkillMd)) {
                report.skipped.push(`${skillName} (Missing SKILL.md)`);
                continue;
            }

            const targetSkillDir = path.join(targetDir, sanitizedSlug);
            const skillExistsOnDisk = fs.existsSync(targetSkillDir);
            const isRegisteredInManifest = Boolean(manifest.skills[sanitizedSlug]);

            // القاعدة 1: إذا كان المجلد موجوداً بالفعل على القرص وغير مسجل في بيان الملكية:
            // هذا مجلد غير مملوك لـ ProofForge (مهارة مخصصة للمستخدم). يُحظر استبدالها قطعياً حتى مع force!
            if (skillExistsOnDisk && !isRegisteredInManifest) {
                report.conflicts.push({
                    skill: sanitizedSlug,
                    type: 'UNOWNED_CUSTOM_SKILL_EXISTS',
                    message: `المجلد '${sanitizedSlug}' موجود على القرص وغير مسجل في بيان ملكية ProofForge. تم تطبيق مبدأ حماية بيانات المستخدم ومنع الاستبدال.`
                });
                report.preserved.push(sanitizedSlug);
                continue;
            }

            try {
                const canonicalFiles = AntigravityAdapter.scanSkillInventory(sourcePath);
                const recordedFiles = isRegisteredInManifest ? (manifest.skills[sanitizedSlug].files || {}) : {};
                const currentTargetFiles = skillExistsOnDisk ? AntigravityAdapter.scanSkillInventory(targetSkillDir) : {};

                let hasConflict = false;
                let filesToWrite = [];
                let newFileInventory = { ...recordedFiles };

                for (const [relPath, canInfo] of Object.entries(canonicalFiles)) {
                    const tarInfo = currentTargetFiles[relPath];
                    const recInfo = recordedFiles[relPath];

                    if (!tarInfo) {
                        // ملف غير موجود في الهدف: كتابة آمنة جديدة
                        filesToWrite.push({ relPath, canInfo, action: 'CREATE' });
                        newFileInventory[relPath] = { ...canInfo };
                    } else if (!recInfo) {
                        // ملف موجود على القرص ولكنه غير مسجل في البيان لمهارة مسجلة: ملف غير مملوك
                        report.conflicts.push({
                            skill: sanitizedSlug,
                            file: relPath,
                            type: 'UNOWNED_DESTINATION_FILE',
                            message: `الملف '${relPath}' موجود على القرص وغير مسجل في بيان الملكية. يُحظر استبداله.`
                        });
                        hasConflict = true;
                    } else {
                        // ملف مسجل في البيان
                        if (tarInfo.hash !== recInfo.hash) {
                            // الملف تم تعديله من قبل المستخدم في الهدف!
                            if (force) {
                                // استبدال مسموح فقط مع التفعيل الصريح للراية force لملف مثبتة ملكيته
                                filesToWrite.push({ relPath, canInfo, action: 'FORCE_UPDATE' });
                                newFileInventory[relPath] = { ...canInfo };
                            } else {
                                // الحفاظ على تعديلات المستخدم ورفض الاستبدال
                                report.conflicts.push({
                                    skill: sanitizedSlug,
                                    file: relPath,
                                    type: 'USER_MODIFIED_CONFLICT',
                                    message: `تم رصد تعديلات للمستخدم في الملف '${relPath}'. تم الحفاظ على الملف المحلي ومنع الاستبدال.`
                                });
                                hasConflict = true;
                            }
                        } else if (canInfo.hash !== recInfo.hash) {
                            // المصدر الكنسي تحدث، والمستخدم لم يعدل الملف: تحديث آمن
                            filesToWrite.push({ relPath, canInfo, action: 'UPDATE' });
                            newFileInventory[relPath] = { ...canInfo };
                        }
                    }
                }

                if (hasConflict && !force) {
                    report.preserved.push(sanitizedSlug);
                    continue;
                }

                if (!dryRun) {
                    if (!fs.existsSync(targetSkillDir)) {
                        fs.mkdirSync(targetSkillDir, { recursive: true });
                    }

                    // تنفيذ الكتابة الذرية الآمنة للملفات المصرح بها
                    for (const item of filesToWrite) {
                        const srcFile = path.join(sourcePath, item.relPath);
                        const dstFile = path.join(targetSkillDir, item.relPath);
                        const content = fs.readFileSync(srcFile);

                        PathLoaderGuard.safeAtomicWrite(dstFile, content, {
                            projectRoot: targetDir
                        });
                    }

                    manifest.skills[sanitizedSlug] = {
                        skillId: sanitizedSlug,
                        canonicalSource: `skills/${skillName}`,
                        destination: path.relative(process.cwd(), targetSkillDir).replace(/\\/g, '/'),
                        ownershipMarker: AntigravityAdapter.OWNERSHIP_MARKER,
                        syncedAt: new Date().toISOString(),
                        version: '3.0.0',
                        files: newFileInventory
                    };
                }

                if (isRegisteredInManifest) {
                    report.updated.push(sanitizedSlug);
                } else {
                    report.synced.push(sanitizedSlug);
                }
            } catch (err) {
                report.errors.push(`${skillName}: ${err.message}`);
            }
        }

        if (!dryRun && fs.existsSync(targetDir)) {
            this.writeManifest(targetDir, manifest);
        }

        return report;
    }

    /**
     * تشذيب وتنظيف المهارات المتقادمة مع حماية مهارات المستخدم المخصصة والملفات المعدلة
     */
    static pruneSkills(canonicalSkillsDir, targetDir, options = {}) {
        const dryRun = options.dryRun || false;
        const force = options.force || false;

        const diff = AntigravityAdapter.diffSkills(canonicalSkillsDir, targetDir);
        const report = {
            pruned: [],
            protectedUserSkills: diff.userCustom,
            conflicts: [],
            skippedDryRun: []
        };

        const manifest = this.readManifest(targetDir);

        for (const stale of diff.staleProofForge) {
            const staleDir = path.join(targetDir, stale);
            const staleManifest = manifest.skills ? manifest.skills[stale] : null;

            if (!staleManifest) {
                // ليس مسجلاً في البيان: حماية فورية
                report.protectedUserSkills.push(stale);
                continue;
            }

            // التحقق مما إذا كان المستخدم قد عدل أي ملف في المهارة المتقادمة
            const currentFiles = AntigravityAdapter.scanSkillInventory(staleDir);
            const recordedFiles = staleManifest.files || {};
            let isUserModified = false;

            for (const [relPath, tarInfo] of Object.entries(currentFiles)) {
                const recInfo = recordedFiles[relPath];
                if (!recInfo || tarInfo.hash !== recInfo.hash) {
                    isUserModified = true;
                    break;
                }
            }

            if (isUserModified) {
                report.conflicts.push({
                    skill: stale,
                    type: 'MODIFIED_STALE_SKILL_PRESERVED',
                    message: `المهارة المتقادمة '${stale}' تحتوي على تعديلات قام بها المستخدم. تم تطبيق مبدأ الحفظ ومنع الحذف.`
                });
                continue;
            }

            if (dryRun || !force) {
                report.skippedDryRun.push(stale);
            } else {
                const resolvedTargetDir = path.resolve(targetDir);
                const resolvedStaleDir = path.resolve(staleDir);
                if (resolvedStaleDir.startsWith(resolvedTargetDir + path.sep)) {
                    fs.rmSync(resolvedStaleDir, { recursive: true, force: true });
                    report.pruned.push(stale);
                    if (manifest.skills && manifest.skills[stale]) {
                        delete manifest.skills[stale];
                    }
                }
            }
        }

        if (!dryRun && force && fs.existsSync(targetDir)) {
            this.writeManifest(targetDir, manifest);
        }

        return report;
    }

    /**
     * سرد المهارات الكنسية وحالتها
     * @param {string} canonicalSkillsDir 
     * @returns {{skills: Array, total: number, validCount: number}}
     */
    static listSkills(canonicalSkillsDir) {
        if (!fs.existsSync(canonicalSkillsDir)) {
            throw new Error(`مجلد المهارات الكنسي '${canonicalSkillsDir}' غير موجود.`);
        }

        const entries = fs.readdirSync(canonicalSkillsDir, { withFileTypes: true });
        const skills = [];
        let validCount = 0;

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const skillName = entry.name;
            const skillDir = path.join(canonicalSkillsDir, skillName);
            const skillMdPath = path.join(skillDir, 'SKILL.md');

            const hasSkillMd = fs.existsSync(skillMdPath);
            const hasScripts = fs.existsSync(path.join(skillDir, 'scripts'));
            const hasExamples = fs.existsSync(path.join(skillDir, 'examples'));
            const hasReferences = fs.existsSync(path.join(skillDir, 'references'));

            let issues = [];
            let name = skillName;
            let description = '';

            if (hasSkillMd) {
                const content = fs.readFileSync(skillMdPath, 'utf8');
                const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                if (fmMatch) {
                    const fm = fmMatch[1];
                    const nameMatch = fm.match(/name:\s*([^\r\n]+)/);
                    const descMatch = fm.match(/description:\s*(?:>[-+]?|\|[-+]?)?\s*\n?([\s\S]*?)(?=\n[a-z0-9_-]+:|$)/i) || fm.match(/description:\s*([^\r\n]+)/);
                    if (nameMatch) name = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
                    if (descMatch) description = descMatch[1].replace(/\r?\n\s*/g, ' ').replace(/^['"]|['"]$/g, '').trim();
                } else {
                    issues.push('Invalid YAML frontmatter');
                }
            } else {
                issues.push('Missing SKILL.md');
            }

            if (!hasScripts) issues.push('Missing scripts/');
            if (!hasExamples) issues.push('Missing examples/');
            if (!hasReferences) issues.push('Missing references/');

            const isValid = issues.length === 0 && Boolean(description && description.length >= 15);
            if (isValid) validCount++;

            skills.push({
                slug: skillName,
                name,
                description,
                hasSkillMd,
                hasScripts,
                hasExamples,
                hasReferences,
                isValid,
                issues
            });
        }

        return { skills, total: skills.length, validCount };
    }

    /**
     * فحص وتدقيق مهارة فردية بالتفصيل
     * @param {string} canonicalSkillsDir 
     * @param {string} skillName 
     * @returns {Object}
     */
    static inspectSkill(canonicalSkillsDir, skillName) {
        const skillDir = path.join(canonicalSkillsDir, skillName);
        if (!fs.existsSync(skillDir)) {
            throw new Error(`المهارة '${skillName}' غير موجودة في المجلد الكنسي.`);
        }

        const skillMdPath = path.join(skillDir, 'SKILL.md');
        let content = '';
        let frontmatter = null;
        if (fs.existsSync(skillMdPath)) {
            content = fs.readFileSync(skillMdPath, 'utf8');
            const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (fmMatch) {
                frontmatter = fmMatch[1].trim();
            }
        }

        const scripts = fs.existsSync(path.join(skillDir, 'scripts')) ? fs.readdirSync(path.join(skillDir, 'scripts')) : [];
        const examples = fs.existsSync(path.join(skillDir, 'examples')) ? fs.readdirSync(path.join(skillDir, 'examples')) : [];
        const references = fs.existsSync(path.join(skillDir, 'references')) ? fs.readdirSync(path.join(skillDir, 'references')) : [];

        return {
            slug: skillName,
            path: skillDir,
            hasSkillMd: fs.existsSync(skillMdPath),
            frontmatter,
            scripts,
            examples,
            references,
            contentLength: content.length
        };
    }

    /**
     * تحويل مهارة مفردة إلى ملف SKILL.md متوافق مع Antigravity
     */
    static transformSkill(skillContract) {
        if (!skillContract || typeof skillContract !== 'object') {
            throw new Error('عقد المهارة المصدري غير صالح أو فارغ (Fail-Closed)');
        }

        const rawName = skillContract.id || skillContract.name || 'unnamed-skill';
        const sanitizedSlug = AntigravityAdapter.sanitizeSkillName(rawName);

        const description = (skillContract.description || skillContract.purpose || '').trim();
        if (!description || description.length < 10) {
            throw new Error(`وصف المهارة '${sanitizedSlug}' غير كافٍ أو مفقود (أقل من 10 أحرف)`);
        }

        const frontmatter = [
            '---',
            `name: ${sanitizedSlug}`,
            `description: ${AntigravityAdapter.serializeYamlString(description)}`,
            '---'
        ].join('\n');

        const bodySections = [
            `# ${skillContract.name || sanitizedSlug}`,
            '',
            `> **معرف العقد الكنسي**: \`${skillContract.id || 'N/A'}\` | **الإصدار**: \`${skillContract.version || '1.0.0'}\``,
            '',
            '## 1. الغرض وحدود الاستخدام (Purpose & Scope)',
            skillContract.purpose || description,
            '',
            '## 2. المحددات الأمنية والامتثال (Security & Invariants)',
            Array.isArray(skillContract.security_constraints) && skillContract.security_constraints.length > 0
                ? skillContract.security_constraints.map(c => `- ${c}`).join('\n')
                : '- لا توجد قيود أمنية استثنائية محددة.',
            '',
            '## 3. منهجية التنفيذ (Methodology & Workflow)',
            Array.isArray(skillContract.responsibilities) && skillContract.responsibilities.length > 0
                ? skillContract.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')
                : '1. تنفيذ الفحوصات وفق العقد الكنسي.',
            '',
            '## 4. الأدلة والتحقق (Evidence & QA Gate)',
            Array.isArray(skillContract.verification_requirements) && skillContract.verification_requirements.length > 0
                ? skillContract.verification_requirements.map(v => `- متطلب تحقق: \`${v}\``).join('\n')
                : '- التحقق الحتمي عبر محرك ProofForge.'
        ].join('\n');

        const fullContent = `${frontmatter}\n\n${bodySections}\n`;
        const targetPath = `.agents/skills/${sanitizedSlug}/SKILL.md`;

        return {
            content: fullContent,
            targetPath,
            skillSlug: sanitizedSlug
        };
    }

    /**
     * تحويل قاعدة كنسية إلى مستند Markdown
     */
    static transformRule(ruleContract) {
        if (!ruleContract || typeof ruleContract !== 'object') {
            throw new Error('عقد القاعدة المصدري غير صالح أو فارغ (Fail-Closed)');
        }

        const ruleId = (ruleContract.rule_id || ruleContract.id || 'unnamed-rule').toLowerCase();
        const priority = ruleContract.priority || 'P1';

        const content = [
            `# قاعدة هندسية: ${ruleContract.name || ruleId}`,
            '',
            `- **معرف القاعدة**: \`${ruleContract.rule_id || ruleId}\``,
            `- **مستوى الأولوية**: \`${priority}\``,
            `- **النطاق**: ${ruleContract.scope || 'شامل'}`,
            '',
            '## نص القاعدة',
            ruleContract.statement || ruleContract.description || 'لا يوجد نص محدد.',
            ''
        ].join('\n');

        const targetPath = `.agents/rules/${ruleId}.md`;
        return { content, targetPath, ruleId };
    }

    /**
     * توليد ملف AGENTS.md المجمع لسجل الوكلاء
     */
    static generateAgentsManifest(agentRegistry) {
        if (!agentRegistry || (typeof agentRegistry.listAllAgents !== 'function' && typeof agentRegistry.getAll !== 'function')) {
            throw new Error('سجل الوكلاء الممرر غير صالح (Invalid AgentRegistry)');
        }

        const agents = typeof agentRegistry.listAllAgents === 'function'
            ? agentRegistry.listAllAgents()
            : agentRegistry.getAll();

        const lines = [
            '# مانيفست الوكلاء الكنسي لمنظومة ProofForge في Google Antigravity',
            '',
            'يوثق هذا المستند كافة الوكلاء المصرح لهم بالعمل وفق مبادئ ProofForge.',
            '',
            '## الوكلاء المسجلون',
            ''
        ];

        for (const agent of agents) {
            const agentId = agent.id || agent.agent_id;
            lines.push(`### ${agentId}: ${agent.role || agent.role_title || agent.name}`);
            lines.push(`- **المعرف**: \`${agentId}\``);
            lines.push(`- **مستوى الثقة**: \`${agent.trust_boundary || agent.authority_level || 'STANDARD'}\``);
            lines.push(`- **المسؤوليات**: ${(agent.responsibilities || []).join('، ') || 'عام'}`);
            lines.push('');
        }

        return {
            content: lines.join('\n'),
            targetPath: 'AGENTS.md',
            provenance: {
                source_contract: 'ProofForge AgentRegistry',
                generated_by: 'AntigravityAdapter',
                version: '3.0.0'
            }
        };
    }

    /**
     * تكامل تحويل تدفق العمل مع سياسة النموذج (Phase 6 ↔ Phase 7 Integration)
     * يثبت بقاء قيود الأمان وبوابات CVGF ومتطلبات الأدلة دون مساس
     * @param {Object} workflowContract عقد تدفق العمل
     * @param {Object} modelPolicy سياسة النموذج المطبقة
     * @returns {{content: string, targetPath: string, constraintsSurvive: boolean}}
     */
    static transformWorkflowWithPolicy(workflowContract, modelPolicy) {
        if (!workflowContract || !workflowContract.workflow_id) {
            throw new Error('عقد تدفق العمل غير صالح');
        }
        if (!modelPolicy || !modelPolicy.policy_id) {
            throw new Error('سياسة النموذج غير صالحة');
        }

        const targetPath = `.agents/skills/wf-${workflowContract.workflow_id.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}/SKILL.md`;

        const pathCheck = AntigravityAdapter.validatePath(targetPath);
        if (!pathCheck.isValid) {
            throw new Error(`مسار التدفق غير آمن: ${pathCheck.error}`);
        }

        const constraintsSurvive = (
            workflowContract.security_constraints && workflowContract.security_constraints.length > 0 &&
            modelPolicy.security_requirements && modelPolicy.security_requirements.length > 0 &&
            modelPolicy.verification_requirements && modelPolicy.verification_requirements.includes('CVGF_GROUNDING_GATE')
        );

        const lines = [];
        lines.push('---');
        lines.push(`name: ${workflowContract.name}`);
        lines.push(`description: ${workflowContract.description}`);
        lines.push('---');
        lines.push('');
        lines.push(`# ${workflowContract.name}`);
        lines.push(`**Workflow ID:** \`${workflowContract.workflow_id}\`  `);
        lines.push(`**Governing Model Policy:** \`${modelPolicy.policy_id}\` (Risk: ${modelPolicy.risk_level})  `);
        lines.push('');
        lines.push('## 1. القيود الأمنية الموروثة والباقية (Preserved Security Constraints)');
        for (const s of (modelPolicy.security_requirements || [])) {
            lines.push(`* ${s}`);
        }
        lines.push('');
        lines.push('## 2. بوابات التحقق المستقلة الإلزامية في CVGF');
        for (const v of (modelPolicy.verification_requirements || [])) {
            lines.push(`* \`${v}\``);
        }
        lines.push('');
        lines.push('## 3. متطلبات الأدلة المؤصلة');
        for (const e of (modelPolicy.evidence_requirements || [])) {
            lines.push(`* \`${e}\``);
        }
        lines.push('');

        return {
            content: lines.join('\n'),
            targetPath,
            constraintsSurvive
        };
    }
}

module.exports = AntigravityAdapter;
