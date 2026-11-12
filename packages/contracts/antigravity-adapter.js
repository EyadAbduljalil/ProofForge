/**
 * @file antigravity-adapter.js
 * @description محرك محول Google Antigravity الهيكلي الكنسي في نظام ProofForge (V2 Overhaul)
 * ينفذ التحويلات التصريحية الحتمية لأصول ProofForge إلى قطع متوافقة مع هيكلية Google Antigravity.
 * 
 * المبادئ الحاكمة:
 * - Structural & Documentary Transformation ONLY
 * - No Runtime Execution / No Agent Invocation
 * - Complete Path Safety (Anti-Traversal)
 * - Determinism & Byte-for-Byte Idempotency
 * - Provenance & Security Constraint Preservation
 * - Strict Frontmatter & Valid Lowercase Hyphenated Skill Names
 */

'use strict';

const path = require('path');
const fs = require('fs');
const SkillContract = require('./skill-contract');
const ModelPolicyContract = require('./model-policy-contract');

class AntigravityAdapter {
    /**
     * المسارات الكنسية المسموحة لقطع Antigravity في مساحة العمل
     */
    static ALLOWED_TARGET_PREFIXES = Object.freeze([
        'AGENTS.md',
        '.agents/rules/',
        '.agents/skills/'
    ]);

    /**
     * تطهير وضبط اسم المهارة ليتوافق مع معايير Antigravity الصارمة
     * (أحرف إنجليزية صغيرة وشرطات فقط: lowercase-hyphenated)
     * @param {string} rawName 
     * @returns {string}
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
     * @param {string} value 
     * @returns {string}
     */
    static serializeYamlString(value) {
        if (value === null || value === undefined) return '""';
        const str = String(value).replace(/\r\n/g, '\n').trim();
        
        // إذا احتوى النص على أسطر متعددة أو رموز خاصة في YAML
        if (str.includes('\n') || /[:#@%`'"\[\]{}|>*\&?!,~\-]/.test(str)) {
            return JSON.stringify(str);
        }
        return str;
    }

    /**
     * التحقق الصارم والمغلق من سلامة المسار والوقاية من القفز عبر المسارات (Path Traversal)
     * @param {string} relativePath المسار النسبي للقطعة الهدف
     * @param {string} [baseDir] مجلد مساحة العمل الأساسي
     * @returns {{isValid: boolean, safePath?: string, error?: string}}
     */
    static validatePath(relativePath, baseDir = process.cwd()) {
        if (!relativePath || typeof relativePath !== 'string') {
            return { isValid: false, error: 'المسار المستهدف غير معرف أو ليس نصاً' };
        }

        const trimmed = relativePath.trim().replace(/\\/g, '/');

        // كشف محاولات القفز عبر المسارات (Path Traversal)
        if (trimmed.includes('..') || trimmed.startsWith('/') || /^[a-zA-Z]:/.test(trimmed)) {
            return { isValid: false, error: `محاولة قفز مسار غير مصرح بها أو مسار مطلق: '${relativePath}'` };
        }

        // التحقق من الامتداد المصرح
        if (!trimmed.endsWith('.md')) {
            return { isValid: false, error: `امتداد الملف غير مصرح به: '${relativePath}'. يجب أن ينتهي بـ .md` };
        }

        // التحقق من البادئات المسموحة
        const isAllowedPrefix = AntigravityAdapter.ALLOWED_TARGET_PREFIXES.some(prefix => {
            if (prefix.endsWith('/')) {
                return trimmed.startsWith(prefix);
            }
            return trimmed === prefix;
        });

        if (!isAllowedPrefix) {
            return {
                isValid: false,
                error: `المسار المستهدف '${trimmed}' لا يتبع الهيكلية المعتمدة لقطع Antigravity المصرح بها (${AntigravityAdapter.ALLOWED_TARGET_PREFIXES.join(', ')})`
            };
        }

        // فحص التحليل الفعلي للتأكد من عدم الخروج عن المجلد الأساسي
        const resolvedBase = path.resolve(baseDir);
        const resolvedTarget = path.resolve(resolvedBase, trimmed);

        if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
            return { isValid: false, error: `المسار المستهدف يخرج عن نطاق مجلد العمل الأساسي: '${resolvedTarget}'` };
        }

        return { isValid: true, safePath: resolvedTarget };
    }

    /**
     * تحويل عقد المهارة الكنسي إلى ملف SKILL.md متوافق مع نمط مهارات Antigravity الحديث
     * @param {SkillContract} skillContract عقد المهارة
     * @param {Object} [options] خيارات إضافية
     * @returns {{content: string, targetPath: string, provenance: Object}}
     */
    static transformSkill(skillContract, options = {}) {
        if (!skillContract || typeof skillContract !== 'object' || !skillContract.id) {
            throw new Error('عقد المهارة المصدري غير صالح أو فارغ (Fail-Closed)');
        }

        if (!skillContract.description || typeof skillContract.description !== 'string' || skillContract.description.trim().length < 10) {
            throw new Error('وصف المهارة غير كافٍ أو مفقود. تتطلب Antigravity وصفاً دلالياً غير فارغ لتفعيل المهارة بدقة');
        }

        // استخراج الاسم الدلالي للمهارة للمسار بتنسيق lowercase-hyphenated
        const skillSlug = AntigravityAdapter.sanitizeSkillName(skillContract.id);
        const targetPath = `.agents/skills/${skillSlug}/SKILL.md`;

        // التحقق من سلامة المسار المولد
        const pathCheck = AntigravityAdapter.validatePath(targetPath);
        if (!pathCheck.isValid) {
            throw new Error(`فشل التحقق من مسار المهارة الهدف: ${pathCheck.error}`);
        }

        // الحفاظ على سلسلة النسب والمصدر بشكل حتمي مستقر تماماً (بدون طوابع زمنية متغيرة)
        const provenance = {
            source_contract: 'ProofForge SkillContract',
            source_id: skillContract.id,
            version: skillContract.version || '2.0.0',
            transformation_mode: 'STRUCTURAL_DECLARATIVE',
            transformation_standard: 'ANTIGRAVITY_V2_NATIVE'
        };

        // إنشاء محتوى SKILL.md بتنسيق حتمي مستقر بنسبة 100%
        const lines = [];

        // ترويسة YAML متوافقة بدقة مع معايير Google Antigravity
        lines.push('---');
        lines.push(`name: ${skillSlug}`);
        lines.push(`description: ${AntigravityAdapter.serializeYamlString(skillContract.description)}`);
        lines.push('---');
        lines.push('');
        lines.push(`# ${skillContract.name}`);
        lines.push(`**ProofForge Skill ID:** \`${skillContract.id}\`  `);
        lines.push(`**Version:** \`${skillContract.version || '2.0.0'}\`  `);
        lines.push(`**Category:** \`${skillContract.category || 'ENGINEERING'}\`  `);
        lines.push(`**Status:** \`${skillContract.status || 'ACTIVE'}\`  `);
        lines.push('');
        lines.push('## 1. الغرض وحدود الاستخدام (Purpose & Scope)');
        lines.push(skillContract.purpose || skillContract.description);
        lines.push('');
        lines.push('## 2. المحددات الأمنية والامتثال (Security Restrictions)');
        lines.push('* **الخضوع الأمني:** الامتثال التام لسياسات الأمان `P0_SECURITY_SAFETY` وحاجز الصلاحيات المركزي.');
        lines.push('* **الامتياز الأدنى:** يُحظر على المهارة تنفيذ أي عمليات خارج نطاق صلاحيات الوكيل المستدعي.');
        const secList = [
            ...(skillContract.security_constraints || []),
            ...(skillContract.security_restrictions || [])
        ];
        for (const sec of secList) {
            lines.push(`* ${sec}`);
        }
        lines.push('');
        lines.push('## 3. متطلبات الأدلة وبوابات التحقق المستقلة (Evidence & CVGF Verification)');
        lines.push('* **ميثاق الأدلة:** مخرجات المهارة لا تمثل إثباتاً بحد ذاتها دون عبور بوابات التحقق المستقلة:');
        lines.push('  * `CVGF_GROUNDING_GATE`: التأصيل الصارم للادعاءات في ملفات المستودع.');
        lines.push('  * `CVGF_CLAIM_VERIFICATION`: التحقق الصوري والمادي من مطابقة الادعاء للكود.');
        lines.push('  * `CVGF_NON_CONTRADICTION`: خلو المخرجات من أي تناقض منطقي.');
        lines.push('');
        lines.push('## 4. شروط الاستنكاف والامتناع الإدراكي (Abstention Conditions)');
        if (Array.isArray(skillContract.abstention_conditions) && skillContract.abstention_conditions.length > 0) {
            for (const cond of skillContract.abstention_conditions) {
                lines.push(`* ${cond}`);
            }
        } else {
            lines.push('* الامتناع الفوري عند نقص الأدلة المادية أو غموض سياق المدخلات.');
        }
        lines.push('');
        lines.push('## 5. سلسلة النسب والمصدر الكنسي (Provenance)');
        lines.push('```json');
        lines.push(JSON.stringify(provenance, Object.keys(provenance).sort(), 2));
        lines.push('```');
        lines.push('');

        const content = lines.join('\n');
        return {
            content,
            targetPath,
            provenance
        };
    }

    /**
     * تحويل قاعدة هندسية أو أمنية إلى ملف Markdown متوافق مع .agents/rules/
     * @param {Object} ruleDef تعريف القاعدة
     * @returns {{content: string, targetPath: string, provenance: Object}}
     */
    static transformRule(ruleDef) {
        if (!ruleDef || typeof ruleDef !== 'object' || !ruleDef.rule_id || !ruleDef.name) {
            throw new Error('تعريف القاعدة المصدري مشوه أو غير مكتمل (Fail-Closed)');
        }

        const ruleSlug = ruleDef.rule_id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        const targetPath = `.agents/rules/${ruleSlug}.md`;

        const pathCheck = AntigravityAdapter.validatePath(targetPath);
        if (!pathCheck.isValid) {
            throw new Error(`فشل التحقق من مسار القاعدة الهدف: ${pathCheck.error}`);
        }

        const provenance = {
            source_contract: 'ProofForge Rule Definition',
            source_id: ruleDef.rule_id,
            priority: ruleDef.priority || 'P0',
            transformation_mode: 'STRUCTURAL_DECLARATIVE',
            transformation_standard: 'ANTIGRAVITY_V2_NATIVE'
        };

        const lines = [];
        lines.push(`# القاعدة الكنسية: ${ruleDef.name}`);
        lines.push(`**معرف القاعدة:** \`${ruleDef.rule_id}\`  `);
        lines.push(`**مستوى الأولوية:** \`${ruleDef.priority || 'P0'}\` (الأمان P0 يعلو كل الأولويات)  `);
        lines.push('');
        lines.push('## 1. نص القاعدة ومتطلبات الامتثال');
        lines.push(ruleDef.statement || ruleDef.description || 'يجب الالتزام بمتطلبات القاعدة بدقة.');
        lines.push('');
        lines.push('## 2. النطاق والمحددات');
        lines.push(ruleDef.scope || 'شامل لكافة وكلاء ومهارات وتدفقات العمل في المشروع.');
        lines.push('');
        lines.push('## 3. سلسلة النسب والتحقق');
        lines.push('```json');
        lines.push(JSON.stringify(provenance, Object.keys(provenance).sort(), 2));
        lines.push('```');
        lines.push('');

        return {
            content: lines.join('\n'),
            targetPath,
            provenance
        };
    }

    /**
     * توليد مانيفست الوكلاء AGENTS.md متوافقاً مع Antigravity من سجل الوكلاء
     * @param {Object} agentRegistry كائن سجل الوكلاء
     * @returns {{content: string, targetPath: string, provenance: Object}}
     */
    static generateAgentsManifest(agentRegistry) {
        if (!agentRegistry || (typeof agentRegistry.listActiveAgents !== 'function' && typeof agentRegistry.getActiveAgents !== 'function')) {
            throw new Error('سجل الوكلاء المصدري غير صالح أو فارغ (Fail-Closed)');
        }

        const targetPath = 'AGENTS.md';
        const activeAgents = typeof agentRegistry.listActiveAgents === 'function'
            ? agentRegistry.listActiveAgents()
            : agentRegistry.getActiveAgents();

        const provenance = {
            source_contract: 'ProofForge AgentRegistry',
            total_active_agents: activeAgents.length,
            transformation_mode: 'STRUCTURAL_DECLARATIVE',
            transformation_standard: 'ANTIGRAVITY_V2_NATIVE'
        };

        const lines = [];
        lines.push('# دليل وكلاء الذكاء الاصطناعي — نظام ProofForge (AGENTS.md)');
        lines.push('## مانيفست الوكلاء الكنسي المتوافق مع Google Antigravity');
        lines.push('');
        lines.push('> [!IMPORTANT]');
        lines.push('> هذا المانيفست هو تمثيل هيكلي وتوثيقي تصريحي (Declarative Structural Artifact) مستمد من سجل الوكلاء الكنسي في ProofForge.');
        lines.push('> وجود الوكيل في هذا المانيفست لا يمنحه أي سلطة تشغيلية ذاتية؛ كافة الصلاحيات مقيدة بحاجز الصلاحيات الأمني المركزي.');
        lines.push('');
        lines.push('### جدول الوكلاء النشطين ومجالات الاختصاص:');
        lines.push('| المعرف الكنسي | الاسم الفني | الدور الهندسي | مجالات المسؤولية | مستوى السلطة |');
        lines.push('| :--- | :--- | :--- | :--- | :--- |');

        for (const agent of activeAgents) {
            const role = agent.role || 'مهندس متخصص';
            const resp = (agent.responsibilities || []).slice(0, 2).join('، ') || 'مسؤوليات معيارية';
            lines.push(`| \`${agent.id}\` | ${agent.name} | ${role} | ${resp} | مقيد (P2/P3) |`);
        }

        lines.push('');
        lines.push('### الحواكم الأمنية المشتركة لكافة الوكلاء:');
        lines.push('1. **أولوية الأمان المطلقة P0:** حظر تجاوز أو إضعاف سياسات الأمان أو دستور التحقق P1.');
        lines.push('2. **مبدأ انعدام الثقة في مخرجات الذكاء الاصطناعي:** `AI Output !== Evidence`.');
        lines.push('3. **الامتثال لبوابات التحقق المستقلة:** إلزامية الخضوع لمحركات التأصيل والتحقق في CVGF.');
        lines.push('');
        lines.push('### سلسلة النسب والمصدر:');
        lines.push('```json');
        lines.push(JSON.stringify(provenance, Object.keys(provenance).sort(), 2));
        lines.push('```');
        lines.push('');

        return {
            content: lines.join('\n'),
            targetPath,
            provenance
        };
    }

    /**
     * تكامل تحويل تدفق العمل مع سياسة النموذج (Phase 6 ↔ Phase 7 Integration)
     * يثبت بقاء قيود الأمان وبوابات CVGF ومتطلبات الأدلة دون مساس
     * @param {Object} workflowContract عقد تدفق العمل
     * @param {ModelPolicyContract} modelPolicy سياسة النموذج المطبقة
     * @returns {{content: string, targetPath: string, constraintsSurvive: boolean}}
     */
    static transformWorkflowWithPolicy(workflowContract, modelPolicy) {
        if (!workflowContract || !workflowContract.workflow_id) {
            throw new Error('عقد تدفق العمل غير صالح');
        }
        if (!modelPolicy || !modelPolicy.policy_id) {
            throw new Error('سياسة النموذج غير صالحة');
        }

        const wfSlug = workflowContract.workflow_id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        const targetPath = `.agents/skills/wf-${wfSlug}/SKILL.md`;

        const pathCheck = AntigravityAdapter.validatePath(targetPath);
        if (!pathCheck.isValid) {
            throw new Error(`مسار التدفق غير آمن: ${pathCheck.error}`);
        }

        // التحقق من أن قيود السياسة والأمان تظل باقية ولا يتم تخفيضها
        const constraintsSurvive = (
            workflowContract.security_constraints &&
            workflowContract.security_constraints.length > 0 &&
            modelPolicy.security_requirements &&
            modelPolicy.security_requirements.length > 0 &&
            modelPolicy.verification_requirements &&
            modelPolicy.verification_requirements.includes('CVGF_GROUNDING_GATE')
        );

        const lines = [];
        lines.push('---');
        lines.push(`name: wf-${wfSlug}`);
        lines.push(`description: ${AntigravityAdapter.serializeYamlString(workflowContract.description || workflowContract.name)}`);
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

    /**
     * مزامنة المهارات الكنسية إلى مساحة عمل Antigravity بشكل حتمي وآمن
     * @param {string} canonicalSkillsDir مجلد المهارات الكنسي (skills/)
     * @param {string} targetDir مجلد الوجهة (.agents/skills)
     * @param {Object} [options] خيارات المزامنة
     * @returns {{synced: string[], skipped: string[], errors: string[]}}
     */
    static syncCanonicalSkills(canonicalSkillsDir, targetDir, options = {}) {
        const dryRun = options.dryRun || false;
        const force = options.force || false;

        const report = {
            synced: [],
            skipped: [],
            errors: []
        };

        if (!fs.existsSync(canonicalSkillsDir)) {
            throw new Error(`مجلد المهارات الكنسي '${canonicalSkillsDir}' غير موجود.`);
        }

        const entries = fs.readdirSync(canonicalSkillsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const skillName = entry.name;
            const sourcePath = path.join(canonicalSkillsDir, skillName);
            const sourceSkillMd = path.join(sourcePath, 'SKILL.md');

            if (!fs.existsSync(sourceSkillMd)) {
                report.skipped.push(`${skillName} (Missing SKILL.md)`);
                continue;
            }

            const sanitizedSlug = AntigravityAdapter.sanitizeSkillName(skillName);
            const targetSkillDir = path.join(targetDir, sanitizedSlug);

            try {
                if (!dryRun) {
                    if (!fs.existsSync(targetSkillDir)) {
                        fs.mkdirSync(targetSkillDir, { recursive: true });
                    }

                    // نسخ الملفات الداعمة
                    const subdirs = ['scripts', 'examples', 'references'];
                    for (const sub of subdirs) {
                        const srcSub = path.join(sourcePath, sub);
                        const dstSub = path.join(targetSkillDir, sub);
                        if (fs.existsSync(srcSub)) {
                            fs.cpSync(srcSub, dstSub, { recursive: true, force: true });
                        }
                    }

                    // قراءة وتحديث ترويسة SKILL.md
                    let skillMdContent = fs.readFileSync(sourceSkillMd, 'utf8');
                    fs.writeFileSync(path.join(targetSkillDir, 'SKILL.md'), skillMdContent, 'utf8');
                }
                report.synced.push(sanitizedSlug);
            } catch (err) {
                report.errors.push(`${skillName}: ${err.message}`);
            }
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
     * مقارنة الفروق بين المصدر الكنسي والمجلد المثبت في مساحة العمل
     * @param {string} canonicalSkillsDir 
     * @param {string} targetDir 
     * @returns {Object}
     */
    static diffSkills(canonicalSkillsDir, targetDir) {
        if (!fs.existsSync(canonicalSkillsDir)) {
            throw new Error(`مجلد المهارات الكنسي '${canonicalSkillsDir}' غير موجود.`);
        }

        const canonicalEntries = fs.readdirSync(canonicalSkillsDir, { withFileTypes: true })
            .filter(e => e.isDirectory())
            .map(e => e.name);

        const targetEntries = fs.existsSync(targetDir)
            ? fs.readdirSync(targetDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)
            : [];

        const diffReport = {
            identical: [],
            missingInTarget: [],
            modifiedInTarget: [],
            staleProofForge: [],
            userCustom: []
        };

        for (const skill of canonicalEntries) {
            const canonicalSkillMd = path.join(canonicalSkillsDir, skill, 'SKILL.md');
            const targetSkillMd = path.join(targetDir, skill, 'SKILL.md');

            if (!fs.existsSync(targetSkillMd)) {
                diffReport.missingInTarget.push(skill);
            } else {
                const canContent = fs.readFileSync(canonicalSkillMd, 'utf8');
                const tarContent = fs.readFileSync(targetSkillMd, 'utf8');
                if (canContent === tarContent) {
                    diffReport.identical.push(skill);
                } else {
                    diffReport.modifiedInTarget.push(skill);
                }
            }
        }

        for (const targetSkill of targetEntries) {
            if (!canonicalEntries.includes(targetSkill)) {
                const tarSkillMd = path.join(targetDir, targetSkill, 'SKILL.md');
                let isProofForge = false;
                if (fs.existsSync(tarSkillMd)) {
                    const content = fs.readFileSync(tarSkillMd, 'utf8');
                    if (content.includes('ProofForge') || content.includes('pf-skill')) {
                        isProofForge = true;
                    }
                }

                if (isProofForge) {
                    diffReport.staleProofForge.push(targetSkill);
                } else {
                    diffReport.userCustom.push(targetSkill);
                }
            }
        }

        return diffReport;
    }

    /**
     * تشذيب وتنظيف المهارات المتقادمة مع حماية مهارات المستخدم المخصصة
     * @param {string} canonicalSkillsDir 
     * @param {string} targetDir 
     * @param {Object} [options]
     * @returns {Object}
     */
    static pruneSkills(canonicalSkillsDir, targetDir, options = {}) {
        const dryRun = options.dryRun || false;
        const force = options.force || false;

        const diff = AntigravityAdapter.diffSkills(canonicalSkillsDir, targetDir);
        const report = {
            pruned: [],
            protectedUserSkills: diff.userCustom,
            skippedDryRun: []
        };

        for (const stale of diff.staleProofForge) {
            const staleDir = path.join(targetDir, stale);
            if (dryRun || !force) {
                report.skippedDryRun.push(stale);
            } else {
                fs.rmSync(staleDir, { recursive: true, force: true });
                report.pruned.push(stale);
            }
        }

        return report;
    }
}

module.exports = AntigravityAdapter;
