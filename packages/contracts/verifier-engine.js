/**
 * @file verifier-engine.js
 * @description محرك التحقق الصارم والمغلق في نظام ProofForge (Hardened Verifier Engine)
 * يضمن تطبيق آلة الحالات الحتمية (Deterministic State Machine)،
 * ومنع ثغرات الإكراه المنطقي (Strict Boolean Invariants)،
 * وفرض التمايز الكامل بين الفحوصات الإلزامية (Required) والاختيارية (Optional)،
 * وقياس الأزمنة عبر الساعات الرتيبة (Monotonic High-Resolution Timing).
 */

'use strict';

const path = require('path');
const fs = require('fs');

const VALID_STATUSES = Object.freeze(['PASS', 'FAIL', 'WARN', 'SKIPPED', 'ERROR', 'BLOCKED', 'NOT_RUN']);
const VALID_SEVERITIES = Object.freeze(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
const VALID_CATEGORIES = Object.freeze(['STATIC_ANALYSIS', 'STRUCTURAL', 'SECURITY', 'BEHAVIORAL', 'INTEGRATION']);

class VerifierEngine {
    constructor(verifierName, options = {}) {
        if (!verifierName || typeof verifierName !== 'string') {
            throw new Error('يجب تحديد اسم مدقق صالح (Verifier Name is Required)');
        }

        this.name = verifierName.trim();
        this.options = options;
        this.checks = [];
        this.findings = [];
        this.checkIds = new Set();
        this.startHrTime = process.hrtime.bigint();
        this.rootDir = options.rootDir || process.cwd();
        this.isJson = options.isJson || process.argv.includes('--json');
        this.quiet = options.quiet || process.argv.includes('--quiet');
    }

    /**
     * التحقق الصارم من القيم المنطقية ومنع التحويل الضمني أو القسري (Strict Primitive Boolean Only)
     * يرفض قطعياً السلاسل النصية مثل "true" و "false" والأرقام 1 و 0 و null و undefined
     * @param {*} val 
     * @returns {boolean}
     */
    static safeBoolean(val) {
        if (typeof val === 'boolean') {
            return val;
        }
        const receivedType = val === null ? 'null' : typeof val;
        const serialized = JSON.stringify(val);
        const err = new TypeError(`Strict boolean violation: expected primitive boolean (true/false), received ${receivedType} (${serialized})`);
        err.code = 'STRICT_BOOLEAN_VIOLATION';
        throw err;
    }

    /**
     * تسجيل نتيجة فحص محدد بدقة تامة وفق العقد الصريح للفحوصات
     * يدعم إما:
     * 1. كائن فحص مفصل: { id, property, description, required, passed, status, details, severity, category, evidence, duration_ms }
     * 2. المعلمات الموضعية: (property, passed, details, severity, required)
     */
    recordCheck(propertyOrObj, passedArg, detailsArg = '', severityArg = 'HIGH', requiredArg = true) {
        const checkStartHr = process.hrtime.bigint();
        const now = new Date().toISOString();
        let check;

        if (typeof propertyOrObj === 'object' && propertyOrObj !== null) {
            const obj = propertyOrObj;

            // 1. تحديد صفة الإلزامية (Required vs Optional)
            let isRequired = true;
            if (obj.required !== undefined) {
                isRequired = VerifierEngine.safeBoolean(obj.required);
            }

            // 2. التحقق من القيمة المنطقية والحالة
            let isPass = false;
            let status = obj.status ? String(obj.status).toUpperCase() : null;

            if (status && !VALID_STATUSES.includes(status)) {
                const err = new Error(`Invalid check status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`);
                err.code = 'INVALID_CHECK_STATUS';
                throw err;
            }

            if (obj.passed !== undefined) {
                isPass = VerifierEngine.safeBoolean(obj.passed);
            } else if (status) {
                isPass = (status === 'PASS');
            } else {
                const err = new Error('يجب تحديد حالة الفحص (status) أو قيمته المنطقية (passed) بشكل صريح');
                err.code = 'MISSING_CHECK_RESULT';
                throw err;
            }

            if (!status) {
                status = isPass ? 'PASS' : 'FAIL';
            }

            // 3. فحص التناقض الصريح بين الحالة والقيمة المنطقية
            if (status === 'PASS' && !isPass) {
                const err = new Error(`Contradiction detected: status 'PASS' cannot have passed=false`);
                err.code = 'STATUS_PASSED_CONTRADICTION';
                throw err;
            }
            if (status === 'FAIL' && isPass) {
                const err = new Error(`Contradiction detected: status 'FAIL' cannot have passed=true`);
                err.code = 'STATUS_PASSED_CONTRADICTION';
                throw err;
            }
            if ((status === 'SKIPPED' || status === 'NOT_RUN' || status === 'BLOCKED' || status === 'ERROR') && isPass) {
                const err = new Error(`Contradiction detected: status '${status}' cannot have passed=true`);
                err.code = 'STATUS_PASSED_CONTRADICTION';
                throw err;
            }

            // 4. التحقق من الأدلة عند النجاح الإلزامي
            let evidence = obj.evidence || obj.evidence_ref || null;
            const details = String(obj.details || detailsArg || '');

            if (isRequired && status === 'PASS') {
                if (!evidence && details.trim() === '') {
                    const err = new Error(`Missing required evidence for passing mandatory check '${obj.id || obj.property}'`);
                    err.code = 'MISSING_REQUIRED_EVIDENCE';
                    throw err;
                }
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
                const err = new Error(`Duplicate check identifier rejected: '${id}'`);
                err.code = 'DUPLICATE_CHECK_ID';
                throw err;
            }
            this.checkIds.add(id);

            const isExecuted = (status !== 'SKIPPED' && status !== 'NOT_RUN');
            const duration_ms = isExecuted
                ? (obj.duration_ms !== undefined ? Number(obj.duration_ms) : Number(process.hrtime.bigint() - checkStartHr) / 1e6)
                : 0;

            check = {
                id,
                property: String(obj.property || obj.id || id),
                description: String(obj.description || obj.property || id),
                status,
                passed: isPass,
                required: isRequired,
                details,
                severity,
                category,
                evidence,
                duration_ms: Math.round(duration_ms * 100) / 100,
                execution_metadata: {
                    executed: isExecuted,
                    timestamp: now,
                    monotonic: true
                }
            };
        } else {
            // التعامل مع المعلمات الموضعية
            const isPass = VerifierEngine.safeBoolean(passedArg);
            let isRequired = true;
            if (requiredArg !== undefined) {
                isRequired = VerifierEngine.safeBoolean(requiredArg);
            }

            const id = `CHK-${this.checks.length + 1}`;
            if (this.checkIds.has(id)) {
                const err = new Error(`Duplicate check identifier rejected: '${id}'`);
                err.code = 'DUPLICATE_CHECK_ID';
                throw err;
            }
            this.checkIds.add(id);

            let severity = String(severityArg || 'HIGH').toUpperCase();
            if (!VALID_SEVERITIES.includes(severity)) {
                severity = 'HIGH';
            }

            const details = String(detailsArg || '');
            if (isRequired && isPass && details.trim() === '') {
                const err = new Error(`Missing required evidence for passing mandatory check '${propertyOrObj}'`);
                err.code = 'MISSING_REQUIRED_EVIDENCE';
                throw err;
            }

            const duration_ms = Number(process.hrtime.bigint() - checkStartHr) / 1e6;

            check = {
                id,
                property: String(propertyOrObj),
                description: String(propertyOrObj),
                status: isPass ? 'PASS' : 'FAIL',
                passed: isPass,
                required: isRequired,
                details,
                severity,
                category: 'STATIC_ANALYSIS',
                evidence: details,
                duration_ms: Math.round(duration_ms * 100) / 100,
                execution_metadata: {
                    executed: true,
                    timestamp: now,
                    monotonic: true
                }
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
                required: check.required,
                evidence: check.evidence
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
     * حساب التقرير النهائي وفق آلة الحالات الحتمية الصارمة مع التمييز بين الإلزامي والاختياري
     */
    evaluate() {
        const duration_ms = Math.round(Number(process.hrtime.bigint() - this.startHrTime) / 1e6 * 100) / 100;
        const total = this.checks.length;

        const requiredChecks = this.checks.filter(c => c.required);
        const optionalChecks = this.checks.filter(c => !c.required);

        const reqFailed = requiredChecks.filter(c => c.status === 'FAIL');
        const reqError = requiredChecks.filter(c => c.status === 'ERROR');
        const reqBlocked = requiredChecks.filter(c => c.status === 'BLOCKED');
        const reqSkipped = requiredChecks.filter(c => c.status === 'SKIPPED');
        const reqNotRun = requiredChecks.filter(c => c.status === 'NOT_RUN');
        const reqPassed = requiredChecks.filter(c => c.status === 'PASS');

        const optFailed = optionalChecks.filter(c => c.status === 'FAIL');
        const optWarning = this.checks.filter(c => c.status === 'WARN');

        let status = 'VERIFIED';
        let exitCode = 0;

        // قواعد آلة الحالات الحتمية
        if (total === 0) {
            status = 'INCOMPLETE';
            exitCode = 1;
        } else if (reqError.length > 0) {
            status = 'ERROR';
            exitCode = 1;
        } else if (reqFailed.length > 0) {
            status = 'FAILED';
            exitCode = 1;
        } else if (reqBlocked.length > 0) {
            status = 'BLOCKED';
            exitCode = 1;
        } else if (reqSkipped.length > 0 || reqNotRun.length > 0) {
            // أي فحص إلزامي متخطى أو لم ينفذ يجعل النتيجة INCOMPLETE فوراً
            status = 'INCOMPLETE';
            exitCode = 1;
        } else if (reqPassed.length < requiredChecks.length || requiredChecks.length === 0) {
            status = 'INCOMPLETE';
            exitCode = 1;
        } else if (optFailed.length > 0 || optWarning.length > 0) {
            // نجحت كافة الفحوصات الإلزامية ولكن توجد تحذيرات أو إخفاقات اختيارية
            status = 'VERIFIED_WITH_WARNINGS';
            exitCode = 0;
        } else {
            status = 'VERIFIED';
            exitCode = 0;
        }

        return {
            verifier: this.name,
            status,
            total_checks: total,
            required_checks: requiredChecks.length,
            optional_checks: optionalChecks.length,
            passed_checks: this.checks.filter(c => c.status === 'PASS').length,
            failed_checks: this.checks.filter(c => c.status === 'FAIL').length,
            error_checks: this.checks.filter(c => c.status === 'ERROR').length,
            blocked_checks: this.checks.filter(c => c.status === 'BLOCKED').length,
            warning_checks: optWarning.length,
            skipped_checks: this.checks.filter(c => c.status === 'SKIPPED').length,
            not_run_checks: this.checks.filter(c => c.status === 'NOT_RUN').length,
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
            console.log(`الفحوصات الإلزامية: ${report.passed_checks} / ${report.required_checks} ناجح (الوقت: ${report.duration_ms}ms)`);

            if (this.findings.length > 0) {
                console.log(`\nالمخالفات المرصودة (${this.findings.length}):`);
                this.findings.forEach((f, idx) => {
                    console.log(`  ${idx + 1}. [${f.severity}] ${f.property}: ${f.details}`);
                });
            }

            if (report.status === 'VERIFIED') {
                console.log(`\n>>> تم إثبات كافة الخصائص البرمجية بالأدلة المادية.`);
            } else if (report.status === 'INCOMPLETE') {
                console.log(`\n>>> تنبيه: لم تكتمل كافة الفحوصات الإلزامية (فشل مغلق).`);
            } else {
                console.log(`\n>>> فشل التحقق: تم رصد مخالفات حقيقية تستوجب الإصلاح الفوري.`);
            }
            console.log(`======================================================\n`);
        }

        process.exit(report.exit_code);
    }
}

module.exports = VerifierEngine;
