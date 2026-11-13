/**
 * @file verifier-engine.js
 * @description محرك التحقق المعياري الصارم لنظام ProofForge V3 (Hardened Verifier Engine)
 * يوفر أدوات الفحص الحقيقي للملفات، تحليل الشفرة المصدرية، التحقق من العقود، وحساب النتائج دون أي تزييف أو مخرجات صورية.
 * 
 * المبادئ الحاكمة:
 * 1. لا نتائج نجاح صورية أو معلبة (No Hardcoded Passes).
 * 2. لا نسب مئوية وهمية أو ملفقة (No Fabricated Percentages).
 * 3. خروج بكود خطأ غير صفري (Exit Code 1) عند وجود أي خرق أو عيب برمجي أو تجاوز.
 * 4. دعم المخرجات الآلية المهيكلة (Machine-Readable JSON).
 * 5. التمييز الصارم بين حالات الفحص: PASS, FAIL, WARN, SKIPPED, ERROR, BLOCKED, NOT_RUN.
 * 6. الفصل المنهجي بين: الفحص الهيكلي، التحليل الساكن، التحقق أثناء التشغيل، وفحص التكامل.
 * 7. حماية تامة ضد التلاعب بالأنواع (No Boolean Coercion Vulnerabilities).
 * 8. قياس زمني دقيق عبر ساعة رتيبة (Monotonic Clock via process.hrtime.bigint).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const VALID_STATUSES = Object.freeze(['PASS', 'FAIL', 'WARN', 'SKIPPED', 'ERROR', 'BLOCKED', 'NOT_RUN']);
const VALID_SEVERITIES = Object.freeze(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
const VALID_CATEGORIES = Object.freeze(['STRUCTURAL', 'STATIC_ANALYSIS', 'RUNTIME', 'INTEGRATION', 'BEHAVIORAL']);

class VerifierEngine {
    constructor(verifierName, options = {}) {
        this.name = verifierName || 'unnamed-verifier';
        this.rootDir = options.rootDir || process.env.TARGET_DIR || process.cwd();
        this.isJson = process.argv.includes('--json') || Boolean(options.json);
        this.verbose = process.argv.includes('--verbose') || Boolean(options.verbose);
        this.quiet = process.argv.includes('--quiet') || Boolean(options.quiet);
        this.startHrTime = process.hrtime.bigint();
        this.findings = [];
        this.checks = [];
        this.checkIds = new Set();
    }

    /**
     * تحويل وتقييم القيمة المنطقية بأمان لمنع ثغرات التحويل القسري (Anti-Boolean Coercion)
     * تمنع اعتبار نصوص مثل "false" أو أرقام صفرية كقيمة true.
     * @param {*} val 
     * @returns {boolean}
     */
    static safeBoolean(val) {
        if (typeof val === 'boolean') return val;
        if (val === 'false' || val === '0' || val === 0 || val === null || val === undefined) return false;
        if (val === 'true' || val === '1' || val === 1) return true;
        throw new TypeError(`Invalid boolean specification: received ${typeof val} (${JSON.stringify(val)})`);
    }

    /**
     * تسجيل نتيجة فحص محدد بدقة تامة
     * يدعم الشكل التقليدي (property, passed, details, severity)
     * أو كائن فحص مفصل { id, description, passed, status, details, severity, category, duration_ms, evidence_ref }
     */
    recordCheck(propertyOrObj, passedArg, detailsArg = '', severityArg = 'HIGH') {
        const checkStartHr = process.hrtime.bigint();
        const now = new Date().toISOString();
        let check;

        if (typeof propertyOrObj === 'object' && propertyOrObj !== null) {
            const obj = propertyOrObj;
            let isPass = false;

            if (obj.passed !== undefined) {
                isPass = VerifierEngine.safeBoolean(obj.passed);
            } else if (obj.status) {
                isPass = obj.status === 'PASS';
            }

            let status = obj.status;
            if (!status) {
                status = isPass ? 'PASS' : 'FAIL';
            } else {
                status = String(status).toUpperCase();
                if (!VALID_STATUSES.includes(status)) {
                    throw new Error(`Invalid check status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`);
                }
            }

            // فحص التناقض الصريح بين الحالة والقيمة المنطقية
            if ((status === 'PASS' && !isPass) || (status === 'FAIL' && isPass)) {
                throw new Error(`Contradiction detected: status '${status}' does not match passed=${isPass}`);
            }

            let severity = String(obj.severity || severityArg || 'HIGH').toUpperCase();
            if (!VALID_SEVERITIES.includes(severity)) {
                severity = 'HIGH';
            }

            let category = String(obj.category || 'STATIC_ANALYSIS').toUpperCase();
            if (!VALID_CATEGORIES.includes(category)) {
                category = 'STATIC_ANALYSIS';
            }

            const id = String(obj.id || obj.property || `CHK-${this.checks.length + 1}`).trim();
            if (this.checkIds.has(id)) {
                throw new Error(`Duplicate check identifier rejected: '${id}'`);
            }
            this.checkIds.add(id);

            const duration_ms = obj.duration_ms !== undefined
                ? Number(obj.duration_ms)
                : Number(process.hrtime.bigint() - checkStartHr) / 1e6;

            check = {
                id,
                property: String(obj.property || obj.id || id),
                description: String(obj.description || obj.property || ''),
                status,
                passed: isPass,
                details: String(obj.details || detailsArg || ''),
                severity,
                category,
                duration_ms: Math.round(duration_ms * 100) / 100,
                evidence_ref: obj.evidence_ref || null,
                timestamp: now
            };
        } else {
            const isPass = VerifierEngine.safeBoolean(passedArg);
            const id = `CHK-${this.checks.length + 1}`;
            if (this.checkIds.has(id)) {
                throw new Error(`Duplicate check identifier rejected: '${id}'`);
            }
            this.checkIds.add(id);

            let severity = String(severityArg || 'HIGH').toUpperCase();
            if (!VALID_SEVERITIES.includes(severity)) {
                severity = 'HIGH';
            }

            const duration_ms = Number(process.hrtime.bigint() - checkStartHr) / 1e6;

            check = {
                id,
                property: String(propertyOrObj),
                description: String(propertyOrObj),
                status: isPass ? 'PASS' : 'FAIL',
                passed: isPass,
                details: String(detailsArg || ''),
                severity,
                category: 'STATIC_ANALYSIS',
                duration_ms: Math.round(duration_ms * 100) / 100,
                evidence_ref: null,
                timestamp: now
            };
        }

        this.checks.push(check);

        if (check.status === 'FAIL' || check.status === 'ERROR' || check.status === 'BLOCKED') {
            this.findings.push({
                id: check.id,
                property: check.property,
                details: check.details,
                severity: check.severity,
                status: check.status,
                evidence_ref: check.evidence_ref
            });
        }

        return check;
    }

    /**
     * فحص مسار الملفات والبحث المتكرر مع استبعاد المجلدات غير المرغوبة
     */
    findFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx'], ignore = ['node_modules', '.git', 'dist', 'coverage', '.webforge']) {
        const results = [];
        const fullDir = path.isAbsolute(dir) ? dir : path.join(this.rootDir, dir);

        if (!fs.existsSync(fullDir)) {
            return results;
        }

        const walk = (current) => {
            let entries;
            try {
                entries = fs.readdirSync(current, { withFileTypes: true });
            } catch (e) {
                return;
            }

            for (const entry of entries) {
                if (ignore.includes(entry.name)) continue;
                // تجنب تتبع الروابط الرمزية (Avoid Following Symlinks)
                if (entry.isSymbolicLink()) continue;

                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (extensions.length === 0 || extensions.includes(ext)) {
                        results.push(fullPath);
                    }
                }
            }
        };

        walk(fullDir);
        return results;
    }

    /**
     * قراءة آمنة لملف نصي داخل مجلد العمل
     */
    readFile(relativePath) {
        const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(this.rootDir, relativePath);
        if (!fs.existsSync(fullPath)) {
            return null;
        }
        return fs.readFileSync(fullPath, 'utf8');
    }

    /**
     * فحص وقراءة آمنة لملف وتمرير محتواه لدالة فحص
     */
    inspectFile(relativePath, validatorFn) {
        const startHr = process.hrtime.bigint();
        const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(this.rootDir, relativePath);

        if (!fs.existsSync(fullPath)) {
            this.recordCheck({
                id: `FILE-EXISTS-${path.basename(relativePath)}-${this.checks.length + 1}`,
                property: relativePath,
                passed: false,
                status: 'FAIL',
                details: `الملف غير موجود: ${relativePath}`,
                severity: 'CRITICAL',
                category: 'STRUCTURAL',
                duration_ms: Number(process.hrtime.bigint() - startHr) / 1e6
            });
            return false;
        }

        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            validatorFn(content, fullPath);
            return true;
        } catch (err) {
            this.recordCheck({
                id: `FILE-INSPECT-ERROR-${path.basename(relativePath)}-${this.checks.length + 1}`,
                property: relativePath,
                passed: false,
                status: 'ERROR',
                details: `خطأ أثناء فحص الملف: ${err.message}`,
                severity: 'CRITICAL',
                category: 'STATIC_ANALYSIS',
                duration_ms: Number(process.hrtime.bigint() - startHr) / 1e6
            });
            return false;
        }
    }

    /**
     * فحص محتوى مجموعة ملفات بحثاً عن أنماط محظورة أو متطلبات إلزامية
     */
    scanPatterns(files, bannedPatterns = [], requiredPatterns = []) {
        const patternViolations = [];
        const foundRequired = new Set();

        for (const file of files) {
            let content;
            try {
                content = fs.readFileSync(file, 'utf8');
            } catch (err) {
                continue;
            }

            const relativePath = path.relative(this.rootDir, file);

            // فحص الأنماط المحظورة
            for (const bp of bannedPatterns) {
                if (bp.regex.test(content)) {
                    patternViolations.push({
                        file: relativePath,
                        rule: bp.name,
                        details: bp.message || `اكتشاف نمط محظور: ${bp.name}`,
                        severity: bp.severity || 'HIGH'
                    });
                }
            }

            // فحص الأنماط المطلوبة
            for (const rp of requiredPatterns) {
                if (rp.regex.test(content)) {
                    foundRequired.add(rp.name);
                }
            }
        }

        return {
            violations: patternViolations,
            missingRequired: requiredPatterns.filter(rp => !foundRequired.has(rp.name))
        };
    }

    /**
     * حساب التقرير النهائي وفق آلة الحالات الحتمية الصارمة (Strict State Machine)
     */
    evaluate() {
        const duration_ms = Math.round(Number(process.hrtime.bigint() - this.startHrTime) / 1e6 * 100) / 100;
        const total = this.checks.length;

        const failedChecks = this.checks.filter(c => c.status === 'FAIL');
        const errorChecks = this.checks.filter(c => c.status === 'ERROR');
        const blockedChecks = this.checks.filter(c => c.status === 'BLOCKED');
        const warningChecks = this.checks.filter(c => c.status === 'WARN');
        const skippedChecks = this.checks.filter(c => c.status === 'SKIPPED');
        const notRunChecks = this.checks.filter(c => c.status === 'NOT_RUN');
        const passedChecks = this.checks.filter(c => c.status === 'PASS');

        let status = 'VERIFIED';
        let exitCode = 0;

        // قواعد آلة الحالات الصارمة
        if (total === 0) {
            status = 'NOT_RUN';
            exitCode = 1;
        } else if (errorChecks.length > 0) {
            status = 'ERROR';
            exitCode = 1;
        } else if (failedChecks.length > 0) {
            status = 'FAILED';
            exitCode = 1;
        } else if (blockedChecks.length > 0) {
            status = 'BLOCKED';
            exitCode = 1;
        } else if (passedChecks.length === 0) {
            // إذا كانت كافة الفحوصات SKIPPED أو NOT_RUN، يُحظر إعطاء VERIFIED
            if (skippedChecks.length > 0) {
                status = 'SKIPPED';
            } else {
                status = 'NOT_RUN';
            }
            exitCode = 1;
        } else if (warningChecks.length > 0) {
            status = 'VERIFIED_WITH_WARNINGS';
            exitCode = 0;
        }

        return {
            verifier: this.name,
            status,
            total_checks: total,
            passed_checks: passedChecks.length,
            failed_checks: failedChecks.length,
            error_checks: errorChecks.length,
            blocked_checks: blockedChecks.length,
            warning_checks: warningChecks.length,
            skipped_checks: skippedChecks.length,
            not_run_checks: notRunChecks.length,
            findings: this.findings,
            checks: this.checks,
            duration_ms,
            exit_code: exitCode,
            executed_at: new Date().toISOString()
        };
    }

    /**
     * إنهاء الفحص، طباعة التقرير، والخروج برمز الحالة الحتمي
     */
    finish() {
        const report = this.evaluate();

        if (this.isJson) {
            console.log(JSON.stringify(report, null, 2));
        } else if (!this.quiet) {
            console.log(`\n======================================================`);
            console.log(`🔍 [ProofForge Verifier] ${this.name}`);
            console.log(`======================================================`);
            console.log(`الحالة النهائية: ${report.status.startsWith('VERIFIED') ? '✅ ' + report.status : '❌ ' + report.status}`);
            console.log(`الفحوصات المنجزة: ${report.passed_checks} / ${report.total_checks} ناجح (الوقت: ${report.duration_ms}ms)`);

            if (this.findings.length > 0) {
                console.log(`\nالمخالفات المكتشفة (${this.findings.length}):`);
                this.findings.forEach((f, idx) => {
                    console.log(`  ${idx + 1}. [${f.severity}] ${f.property}: ${f.details}`);
                });
            }

            if (report.status.startsWith('VERIFIED')) {
                console.log(`\n>>> تم إثبات كافة الخصائص البرمجية بالأدلة المادية.`);
            } else if (report.status === 'SKIPPED' || report.status === 'NOT_RUN') {
                console.log(`\n>>> تنبيه: لم يتم تنفيذ أي فحص فعلي (فشل مغلق).`);
            } else {
                console.log(`\n>>> فشل التحقق: تم رصد مخالفات حقيقية تستوجب الإصلاح الفوري.`);
            }
            console.log(`======================================================\n`);
        }

        process.exit(report.exit_code);
    }
}

module.exports = VerifierEngine;
