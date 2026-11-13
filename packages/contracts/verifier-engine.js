/**
 * @file verifier-engine.js
 * @description محرك التحقق المعياري الصارم لنظام ProofForge V3
 * يوفر أدوات الفحص الحقيقي للملفات، تحليل الشفرة المصدرية، التحقق من العقود، وحساب النتائج دون أي تزييف أو مخرجات صورية.
 * 
 * المبادئ الحاكمة:
 * 1. لا نتائج نجاح صورية أو معلبة (No Hardcoded Passes).
 * 2. لا نسب مئوية وهمية أو ملفقة (No Fabricated Percentages).
 * 3. خروج بكود خطأ غير صفري (Exit Code 1) عند وجود أي خرق أو عيب برمجي.
 * 4. دعم المخرجات الآلية المهيكلة (Machine-Readable JSON).
 * 5. التمييز الصارم بين حالات الفحص: PASS, FAIL, WARN, SKIPPED, ERROR.
 * 6. الفصل المنهجي بين: الفحص الهيكلي، التحليل الساكن، التحقق أثناء التشغيل، وفحص التكامل.
 */

'use strict';

const fs = require('fs');
const path = require('path');

class VerifierEngine {
    constructor(verifierName, options = {}) {
        this.name = verifierName || 'unnamed-verifier';
        this.rootDir = options.rootDir || process.env.TARGET_DIR || process.cwd();
        this.isJson = process.argv.includes('--json') || Boolean(options.json);
        this.verbose = process.argv.includes('--verbose') || Boolean(options.verbose);
        this.quiet = process.argv.includes('--quiet') || Boolean(options.quiet);
        this.startTime = Date.now();
        this.findings = [];
        this.checks = [];
    }

    /**
     * تسجيل نتيجة فحص محدد
     * يدعم الشكل التقليدي (property, passed, details, severity)
     * أو كائن فحص مفصل { id, description, passed, status, details, severity, category, duration_ms }
     */
    recordCheck(propertyOrObj, passed, details = '', severity = 'HIGH') {
        const now = new Date().toISOString();
        let check;

        if (typeof propertyOrObj === 'object' && propertyOrObj !== null) {
            const obj = propertyOrObj;
            const isPass = obj.passed !== undefined ? Boolean(obj.passed) : (obj.status === 'PASS');
            const status = obj.status || (isPass ? 'PASS' : 'FAIL');
            check = {
                id: obj.id || obj.property || `CHK-${this.checks.length + 1}`,
                property: obj.property || obj.id || `check-${this.checks.length + 1}`,
                description: obj.description || obj.property || '',
                status,
                passed: isPass,
                details: obj.details || details,
                severity: obj.severity || severity,
                category: obj.category || 'STATIC_ANALYSIS',
                duration_ms: obj.duration_ms || 0,
                evidence_ref: obj.evidence_ref || null,
                timestamp: now
            };
        } else {
            const isPass = Boolean(passed);
            check = {
                id: `CHK-${this.checks.length + 1}`,
                property: String(propertyOrObj),
                description: String(propertyOrObj),
                status: isPass ? 'PASS' : 'FAIL',
                passed: isPass,
                details: String(details),
                severity: String(severity).toUpperCase(),
                category: 'STATIC_ANALYSIS',
                duration_ms: 0,
                evidence_ref: null,
                timestamp: now
            };
        }

        this.checks.push(check);

        if (check.status === 'FAIL' || check.status === 'ERROR') {
            this.findings.push({
                id: check.id,
                property: check.property,
                details: check.details,
                severity: check.severity,
                status: check.status
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
            const entries = fs.readdirSync(current, { withFileTypes: true });
            for (const entry of entries) {
                if (ignore.includes(entry.name)) continue;
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
        const start = Date.now();
        const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(this.rootDir, relativePath);
        if (!fs.existsSync(fullPath)) {
            this.recordCheck({
                id: `FILE-EXISTS-${path.basename(relativePath)}`,
                property: relativePath,
                passed: false,
                status: 'FAIL',
                details: `الملف غير موجود: ${relativePath}`,
                severity: 'CRITICAL',
                category: 'STRUCTURAL',
                duration_ms: Date.now() - start
            });
            return false;
        }

        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            validatorFn(content, fullPath);
            return true;
        } catch (err) {
            this.recordCheck({
                id: `FILE-INSPECT-ERROR-${path.basename(relativePath)}`,
                property: relativePath,
                passed: false,
                status: 'ERROR',
                details: `خطأ أثناء فحص الملف: ${err.message}`,
                severity: 'CRITICAL',
                category: 'STATIC_ANALYSIS',
                duration_ms: Date.now() - start
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
     * حساب التقرير النهائي دون إنهاء المعالجة (مناسب للمكتبات والاختبارات البرمجية)
     */
    evaluate() {
        const duration_ms = Date.now() - this.startTime;
        const total = this.checks.length;
        const failedChecks = this.checks.filter(c => c.status === 'FAIL' || c.status === 'ERROR');
        const warningChecks = this.checks.filter(c => c.status === 'WARN');
        const passedChecks = this.checks.filter(c => c.status === 'PASS');
        const skippedChecks = this.checks.filter(c => c.status === 'SKIPPED');

        let status = 'VERIFIED';
        let exitCode = 0;

        if (total === 0) {
            status = 'NOT_TESTED';
            exitCode = 1;
        } else if (failedChecks.length > 0) {
            status = 'FAILED';
            exitCode = 1;
        } else if (warningChecks.length > 0 && passedChecks.length === 0) {
            status = 'WARN';
            exitCode = 0;
        }

        return {
            verifier: this.name,
            status,
            total_checks: total,
            passed_checks: passedChecks.length,
            failed_checks: failedChecks.length,
            warning_checks: warningChecks.length,
            skipped_checks: skippedChecks.length,
            findings: this.findings,
            checks: this.checks,
            duration_ms,
            exit_code: exitCode,
            executed_at: new Date().toISOString()
        };
    }

    /**
     * إنهاء الفحص، طباعة التقرير، والخروج برمز الحالة المناسب
     */
    finish() {
        const report = this.evaluate();

        if (this.isJson) {
            console.log(JSON.stringify(report, null, 2));
        } else if (!this.quiet) {
            console.log(`\n======================================================`);
            console.log(`🔍 [ProofForge Verifier] ${this.name}`);
            console.log(`======================================================`);
            console.log(`الحالة النهائية: ${report.status === 'VERIFIED' ? '✅ VERIFIED' : (report.status === 'NOT_TESTED' ? '⚠️ NOT_TESTED' : '❌ FAILED')}`);
            console.log(`الفحوصات المنجزة: ${report.passed_checks} / ${report.total_checks} ناجح (الوقت: ${report.duration_ms}ms)`);

            if (this.findings.length > 0) {
                console.log(`\nالمخالفات المكتشفة (${this.findings.length}):`);
                this.findings.forEach((f, idx) => {
                    console.log(`  ${idx + 1}. [${f.severity}] ${f.property}: ${f.details}`);
                });
            }

            if (report.status === 'VERIFIED') {
                console.log(`\n>>> تم إثبات كافة الخصائص البرمجية بالأدلة المادية.`);
            } else if (report.status === 'NOT_TESTED') {
                console.log(`\n>>> تنبيه: لم يتم العثور على أصول كافية لإجراء الفحص الآلي.`);
            } else {
                console.log(`\n>>> فشل التحقق: تم رصد مخالفات حقيقية تستوجب الإصلاح الفوري.`);
            }
            console.log(`======================================================\n`);
        }

        process.exit(report.exit_code);
    }
}

module.exports = VerifierEngine;
