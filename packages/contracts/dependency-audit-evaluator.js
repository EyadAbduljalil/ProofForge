/**
 * @file dependency-audit-evaluator.js
 * @description مُقيّم أمان التبعيات الحتمي والمغلق عند الفشل (Fail-Closed Dependency Audit Evaluator)
 * 
 * يضمن التحقق الصارم من حالة تنفيذ أمر npm audit،
 * ويحظر تماماً افتراض خلو المشروع من الثغرات عند حدوث أخطاء تنفيذ أو انقطاع أو مخرجات مشوهة.
 */

'use strict';

class DependencyAuditEvaluator {
    /**
     * سياسة الثغرات الأمنية الافتراضية
     */
    static DEFAULT_POLICY = Object.freeze({
        maxAllowedCritical: 0,
        maxAllowedHigh: 0,
        maxAllowedModerate: Infinity,
        maxAllowedLow: Infinity,
        maxAllowedInfo: Infinity
    });

    /**
     * تقييم نتيجة تنفيذ npm audit وتطبيق السياسة الأمنية الصارمة
     * @param {Object} auditRes مخرج تنفيذ spawnSync
     * @param {Object} options خيارات والسياسة المخصصة
     * @returns {Object} تقرير التدقيق الموثق
     */
    static evaluateAuditExecution(auditRes, options = {}) {
        const policy = { ...this.DEFAULT_POLICY, ...(options.policy || {}) };

        // 1. التحقق من وجود كائن نتيجة التنفيذ
        if (!auditRes || typeof auditRes !== 'object') {
            throw new Error('[FAIL-CLOSED] تعذر تقييم أمان التبعيات: كائن نتيجة التنفيذ مفقود (Missing execution result).');
        }

        // 2. التحقق من أخطاء تشغيل العملية
        if (auditRes.error) {
            if (auditRes.error.code === 'ETIMEDOUT') {
                throw new Error('[FAIL-CLOSED] تجاوزت عملية npm audit المهلة الزمنية المحددة (Process execution timeout).');
            }
            if (auditRes.error.code === 'ENOENT') {
                throw new Error('[FAIL-CLOSED] أمر npm غير موجود على النظام أو تعذر تشغيله (npm executable missing/ENOENT).');
            }
            throw new Error(`[FAIL-CLOSED] خطأ في تشغيل عملية npm audit: ${auditRes.error.message}`);
        }

        // 3. التحقق من إنهاء العملية عبر إشارة نظام
        if (auditRes.signal) {
            if (auditRes.signal === 'SIGTERM') {
                throw new Error('[FAIL-CLOSED] تم إنهاء عملية npm audit قسرياً لتجاوز المهلة (SIGTERM timeout).');
            }
            throw new Error(`[FAIL-CLOSED] تم إنهاء عملية npm audit بإشارة النظام: ${auditRes.signal}`);
        }

        // 4. التحقق من وجود مخرجات نصية
        const stdout = (auditRes.stdout || '').toString().trim();
        const stderr = (auditRes.stderr || '').toString().trim();

        if (stdout.length === 0) {
            throw new Error(`[FAIL-CLOSED] أنتج أمر npm audit مخرجات فارغة تماماً (Empty stdout). Stderr: ${stderr || 'None'}`);
        }

        // 5. التحليل الصارم لتنسيق JSON
        let auditData;
        try {
            auditData = JSON.parse(stdout);
        } catch (jsonErr) {
            throw new Error(`[FAIL-CLOSED] فشل تحليل مخرجات npm audit كـ JSON صالح (Invalid JSON): ${jsonErr.message}. Output snippet: ${stdout.substring(0, 100)}`);
        }

        // 6. التحقق من وجود كائن metadata.vulnerabilities
        if (!auditData || typeof auditData !== 'object') {
            throw new Error('[FAIL-CLOSED] مخرجات npm audit ليست كائناً برمجياً صالحاً.');
        }

        const rawVulns = auditData.metadata && auditData.metadata.vulnerabilities;
        if (!rawVulns || typeof rawVulns !== 'object') {
            throw new Error('[FAIL-CLOSED] مخرجات npm audit تفتقر إلى حقل metadata.vulnerabilities المطلوب.');
        }

        // 7. التحقق من الفئات الإلزامية وكونها أعداداً صحيحة غير سالبة
        const requiredSeverities = ['critical', 'high', 'moderate', 'low', 'info'];
        const parsedVulnerabilities = {};

        for (const sev of requiredSeverities) {
            const count = rawVulns[sev];
            if (typeof count !== 'number' || !Number.isInteger(count) || count < 0 || isNaN(count)) {
                throw new Error(`[FAIL-CLOSED] عدد الثغرات لفئة '${sev}' غير صالح أو سالب أو ليس عدداً صحيحاً: ${count}`);
            }
            parsedVulnerabilities[sev] = count;
        }

        parsedVulnerabilities.total = typeof rawVulns.total === 'number' && Number.isInteger(rawVulns.total) && rawVulns.total >= 0
            ? rawVulns.total
            : (parsedVulnerabilities.critical + parsedVulnerabilities.high + parsedVulnerabilities.moderate + parsedVulnerabilities.low + parsedVulnerabilities.info);

        // 8. تطبيق السياسة الأمنية الصارمة (Vulnerability Policy Enforcement)
        const policyViolations = [];
        if (parsedVulnerabilities.critical > policy.maxAllowedCritical) {
            policyViolations.push(`تم رصد ${parsedVulnerabilities.critical} ثغرة حرجة (الحد الأقصى المسموح: ${policy.maxAllowedCritical})`);
        }
        if (parsedVulnerabilities.high > policy.maxAllowedHigh) {
            policyViolations.push(`تم رصد ${parsedVulnerabilities.high} ثغرة عالية الخطورة (الحد الأقصى المسموح: ${policy.maxAllowedHigh})`);
        }
        if (parsedVulnerabilities.moderate > policy.maxAllowedModerate) {
            policyViolations.push(`تم رصد ${parsedVulnerabilities.moderate} ثغرة متوسطة الخطورة (الحد الأقصى المسموح: ${policy.maxAllowedModerate})`);
        }

        const isPolicyCompliant = policyViolations.length === 0;

        return {
            status: isPolicyCompliant ? 'PASS' : 'FAIL',
            isPolicyCompliant,
            commandExitCode: auditRes.status,
            vulnerabilities: parsedVulnerabilities,
            policy,
            policyViolations,
            dependenciesAudited: auditData.metadata && auditData.metadata.dependencies ? auditData.metadata.dependencies.total || 0 : 0,
            evaluatedAt: new Date().toISOString()
        };
    }
}

module.exports = DependencyAuditEvaluator;
