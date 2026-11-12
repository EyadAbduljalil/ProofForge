/**
 * @file verifier-engine.js
 * @description محرك التحقق المعياري الصارم لنظام ProofForge V2
 * يوفر أدوات الفحص الحقيقي للملفات، تحليل الشفرة المصدرية، التحقق من العقود، وحساب النتائج دون أي تزييف أو مخرجات صورية.
 * 
 * المبادئ الحاكمة:
 * 1. لا نتائج نجاح صورية أو معلبة (No Hardcoded Passes).
 * 2. لا نسب مئوية وهمية أو ملفقة (No Fabricated Percentages).
 * 3. خروج بكود خطأ غير صفري (Exit Code 1) عند وجود أي خرق.
 * 4. دعم المخرجات الآلية المهيكلة (Machine-Readable JSON).
 * 5. الفصل الواضح بين الحالات: VERIFIED, FAILED, NOT_TESTED, BLOCKED.
 */

'use strict';

const fs = require('fs');
const path = require('path');

class VerifierEngine {
    constructor(verifierName, options = {}) {
        this.name = verifierName;
        this.rootDir = options.rootDir || process.env.TARGET_DIR || process.cwd();
        this.isJson = process.argv.includes('--json') || options.json || false;
        this.verbose = process.argv.includes('--verbose') || options.verbose || false;
        this.findings = [];
        this.checks = [];
    }

    /**
     * تسجيل نتيجة فحص محدد
     * @param {string} property الخاصية أو البند المفحوص
     * @param {boolean} passed هل اجتاز الفحص الحقيقي
     * @param {string} details تفاصيل أو مسار المخالفة
     * @param {string} [severity='HIGH'] مستوى الخطورة (CRITICAL, HIGH, MEDIUM, LOW)
     */
    recordCheck(property, passed, details = '', severity = 'HIGH') {
        const check = {
            property,
            passed: Boolean(passed),
            details,
            severity,
            timestamp: new Date().toISOString()
        };
        this.checks.push(check);
        if (!passed) {
            this.findings.push({
                property,
                details,
                severity
            });
        }
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
     * فحص محتوى مجموعة ملفات بحثاً عن أنماط محظورة أو متطلبات إلزامية
     */
    scanPatterns(files, bannedPatterns = [], requiredPatterns = []) {
        const patternViolations = [];
        const foundRequired = new Set();

        for (const file of files) {
            let content;
            try {
                content = fs.readFileSync(file, 'utf8');
            } catch (e) {
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
     * إنهاء الفحص، طباعة التقرير، وتحديد كود الخروج المناسب
     */
    finish() {
        const total = this.checks.length;
        const failed = this.findings.length;
        const passed = total - failed;

        let status = 'VERIFIED';
        let exitCode = 0;

        if (total === 0) {
            status = 'NOT_TESTED';
            exitCode = 1;
        } else if (failed > 0) {
            status = 'FAILED';
            exitCode = 1;
        }

        const report = {
            verifier: this.name,
            status,
            total_checks: total,
            passed_checks: passed,
            failed_checks: failed,
            findings: this.findings,
            checks: this.checks,
            exit_code: exitCode,
            executed_at: new Date().toISOString()
        };

        if (this.isJson) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            console.log(`\n======================================================`);
            console.log(`🔍 [ProofForge Verifier] ${this.name}`);
            console.log(`======================================================`);
            console.log(`الحالة النهائية: ${status === 'VERIFIED' ? '✅ VERIFIED' : (status === 'NOT_TESTED' ? '⚠️ NOT_TESTED' : '❌ FAILED')}`);
            console.log(`الفحوصات المنجزة: ${passed} / ${total} ناجح`);

            if (this.findings.length > 0) {
                console.log(`\nالمخالفات المكتشفة (${this.findings.length}):`);
                this.findings.forEach((f, idx) => {
                    console.log(`  ${idx + 1}. [${f.severity}] ${f.property}: ${f.details}`);
                });
            }

            if (status === 'VERIFIED') {
                console.log(`\n>>> تم إثبات كافة الخصائص البرمجية بالأدلة المادية.`);
            } else if (status === 'NOT_TESTED') {
                console.log(`\n>>> تنبيه: لم يتم العثور على أصول كافية لإجراء الفحص الآلي.`);
            } else {
                console.log(`\n>>> فشل التحقق: تم رصد مخالفات حقيقية تستوجب الإصلاح الفوري.`);
            }
            console.log(`======================================================\n`);
        }

        process.exit(exitCode);
    }
}

module.exports = VerifierEngine;
