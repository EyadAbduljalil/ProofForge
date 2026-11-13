/**
 * @file structured-test-report-parser.js
 * @description مُحلل تقارير الاختبارات الهيكلية الحتمي والمغلق عند الفشل (Fail-Closed Structured Test Report Parser)
 * 
 * يحلل مخرجات الاختبارات الهيكلية (JSON / TAP v13) ويتحقق من الاتساق الحسابي التام،
 * ويفرض التطابق الصارم بين كود خروج العملية والنتائج المسجلة في التقرير.
 */

'use strict';

class StructuredTestReportParser {
    /**
     * تحليل تقرير TAP الهيكلي والتحقق من اتساقه
     * @param {Object} executionResult كائن مخرج spawnSync
     * @param {Object} options خيارات والتحقق الإلزامي
     * @returns {Object} نتيجة التحليل الموثقة
     */
    static parseTapReport(executionResult, options = {}) {
        const mandatory = options.mandatory !== false;
        const suiteName = options.suiteName || 'Test Suite';

        if (!executionResult || typeof executionResult !== 'object') {
            throw new Error(`[FAIL-CLOSED] تقرير اختبار مفقود للجناح '${suiteName}' (Missing execution result).`);
        }

        if (executionResult.error) {
            throw new Error(`[FAIL-CLOSED] خطأ في تشغيل جناح '${suiteName}': ${executionResult.error.message}`);
        }

        if (executionResult.signal) {
            throw new Error(`[FAIL-CLOSED] تم إنهاء تشغيل '${suiteName}' بإشارة: ${executionResult.signal}`);
        }

        const stdout = (executionResult.stdout || '').toString();
        const exitCode = executionResult.status;

        // 1. استخراج الأعداد الهيكلية من تذييل TAP v13 القياسي
        // # tests N
        // # pass N
        // # fail N
        // # cancelled N
        // # skipped N
        // # todo N
        const testsMatch = stdout.match(/^#\s+tests\s+(\d+)/m);
        const passMatch = stdout.match(/^#\s+pass\s+(\d+)/m);
        const failMatch = stdout.match(/^#\s+fail\s+(\d+)/m);
        const cancelledMatch = stdout.match(/^#\s+cancelled\s+(\d+)/m);
        const skippedMatch = stdout.match(/^#\s+skipped\s+(\d+)/m);
        const todoMatch = stdout.match(/^#\s+todo\s+(\d+)/m);

        // إذا وجد تذييل TAP
        if (testsMatch && passMatch && failMatch) {
            const total = parseInt(testsMatch[1], 10);
            const pass = parseInt(passMatch[1], 10);
            const fail = parseInt(failMatch[1], 10);
            const cancelled = cancelledMatch ? parseInt(cancelledMatch[1], 10) : 0;
            const skipped = skippedMatch ? parseInt(skippedMatch[1], 10) : 0;
            const todo = todoMatch ? parseInt(todoMatch[1], 10) : 0;

            // التحقق من الحساب الرياضي الصارم (Arithmetic Consistency)
            if (pass + fail + cancelled + skipped + todo !== total) {
                throw new Error(`[FAIL-CLOSED] عدم اتساق حسابي في تقرير TAP للجناح '${suiteName}': إجمالي (${total}) != ناجح (${pass}) + فاشل (${fail}) + ملغى (${cancelled}) + متخطى (${skipped}) + مؤجل (${todo})`);
            }

            if (mandatory && total === 0) {
                throw new Error(`[FAIL-CLOSED] سجل جناح '${suiteName}' الإلزامي 0 اختبارات (Zero tests reported in mandatory suite).`);
            }

            // فرض التطابق بين كود الخروج والتقرير
            if (exitCode === 0 && fail > 0) {
                throw new Error(`[FAIL-CLOSED] تعارض: انتهت عملية '${suiteName}' بنجاح (exit 0) لكن التقرير يحتوي على ${fail} اختبارات فاشلة.`);
            }
            if (exitCode !== 0 && fail === 0 && cancelled === 0) {
                throw new Error(`[FAIL-CLOSED] تعارض: انتهت عملية '${suiteName}' برمز خطأ (${exitCode}) رغم أن التقرير لا يسجل أي إخفاق.`);
            }

            // استخراج أسماء الاختبارات الناجحة والفاشلة من أسطر TAP
            const passDetails = [...stdout.matchAll(/^ok\s+\d+\s+-\s+(.+)$/gm)].map(m => m[1].trim());
            const failDetails = [...stdout.matchAll(/^not\s+ok\s+\d+\s+-\s+(.+)$/gm)].map(m => m[1].trim());

            return {
                suiteName,
                status: (fail === 0 && cancelled === 0 && exitCode === 0) ? 'PASS' : 'FAIL',
                total,
                passed: pass,
                failed: fail,
                cancelled,
                skipped,
                todo,
                exitCode,
                passDetails,
                failDetails,
                reportFormat: 'TAP_V13'
            };
        }

        // 2. إذا لم يكن تذييل TAP قياسياً، تحليل أسطر التحقق الصريحة المنظمة
        // البحث عن مؤشرات [PASS] و [FAIL] المعتمدة
        const passMatches = [...stdout.matchAll(/\[PASS\]\s*(?:(\d+)\.\s*)?(.+)/g)].map(m => m[2].trim());
        const failMatches = [...stdout.matchAll(/\[FAIL\]\s*(?:(\d+)\.\s*)?(.+)/g)].map(m => m[2].trim());

        const passCount = passMatches.length;
        const failCount = failMatches.length;
        const totalCount = passCount + failCount;

        if (mandatory && totalCount === 0) {
            throw new Error(`[FAIL-CLOSED] تعذر استخراج أي نتائج اختبار هيكلية للجناح الإلزامي '${suiteName}' (Zero tests parsed).`);
        }

        if (exitCode === 0 && failCount > 0) {
            throw new Error(`[FAIL-CLOSED] تعارض: خرجت عملية '${suiteName}' بكود 0 لكنها سجلت ${failCount} فحوصات فاشلة.`);
        }
        if (exitCode !== 0 && failCount === 0) {
            throw new Error(`[FAIL-CLOSED] تعارض: خرجت عملية '${suiteName}' برمز فشل (${exitCode}) بينما لم تسجل أي فحص فاشل في المخرجات.`);
        }

        return {
            suiteName,
            status: (exitCode === 0 && failCount === 0) ? 'PASS' : 'FAIL',
            total: totalCount,
            passed: passCount,
            failed: failCount,
            cancelled: 0,
            skipped: 0,
            todo: 0,
            exitCode,
            passDetails: passMatches,
            failDetails: failMatches,
            reportFormat: 'STRUCTURED_INVARIANT_LINES'
        };
    }
}

module.exports = StructuredTestReportParser;
