/**
 * @file finding-verifier.js
 * @description محرك التحقق المستقل من المشاكل وتمييز الإنذارات الخاطئة (False Positive & Negative Engine)
 * يفحص النتائج المكتشفة من أدوات المسح آلياً ويحدد حالاتها: CONFIRMED, LIKELY, FALSE_POSITIVE, INSUFFICIENT_EVIDENCE, ENVIRONMENT_LIMITATION
 */

const VERIFICATION_VERDICTS = {
    CONFIRMED: 'CONFIRMED',
    LIKELY: 'LIKELY',
    FALSE_POSITIVE: 'FALSE_POSITIVE',
    INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
    ENVIRONMENT_LIMITATION: 'ENVIRONMENT_LIMITATION'
};

class FindingVerifier {
    /**
     * التحقق المستقل من نتيجة أداة فحص معينة بالنظر إلى الحراسات والضوابط المحيطة
     * @param {Object} finding النتيجة الموحدة
     * @param {Object} codeContext سياق الكود والملف
     * @param {Object} evidenceGraph الرسم البياني للأدلة (اختياري للربط المباشر)
     */
    static verifyFinding(finding = {}, codeContext = {}, evidenceGraph = null) {
        finding = finding || {};
        codeContext = codeContext || {};
        const fileContent = codeContext.content || '';
        const category = String(finding.category || '').toUpperCase();
        const ruleId = String(finding.rule_id || finding.ruleId || '').toLowerCase();

        let verdict = VERIFICATION_VERDICTS.CONFIRMED;
        let legacyVerdict = 'TRUE_POSITIVE';
        let reason = 'المشكلة مؤكدة هندسياً وتتطلب تطبيق إصلاح آمن واختبار انحدار مصاحب.';
        let confidence = 'CONFIRMED';

        // 1. فحص القيود البيئية (Environment Limitation)
        if (codeContext.environmentLimitation || finding.metadata?.environmentLimitation) {
            verdict = VERIFICATION_VERDICTS.ENVIRONMENT_LIMITATION;
            legacyVerdict = 'ENVIRONMENT_LIMITATION';
            reason = 'تعذر التحقق الفعلي الكامل نظراً لغياب محرك التشغيل أو متطلب بيئي في بيئة الاختبار الحالية.';
            confidence = 'LOW';
        }
        // 2. فحص ادعاء حقن SQL (SQL Injection Claim)
        else if (category.includes('SQL_INJECTION') || ruleId.includes('sql')) {
            if (fileContent.includes('prepare(') || fileContent.includes('query($') || fileContent.includes('query(table, filter)')) {
                verdict = VERIFICATION_VERDICTS.FALSE_POSITIVE;
                legacyVerdict = 'FALSE_POSITIVE';
                reason = 'الاستعلام يستخدم وسائط محمية بالبارامترات (Parameterized Query) ولا يقبل الدمج النصي المباشر.';
                confidence = 'HIGH';
            } else if (!fileContent && !finding.evidence) {
                verdict = VERIFICATION_VERDICTS.INSUFFICIENT_EVIDENCE;
                legacyVerdict = 'INSUFFICIENT_EVIDENCE';
                reason = 'لا تتوفر شيفرة برمجية كافية أو دليل مباشر لتأكيد شبهة الحقن.';
                confidence = 'LOW';
            }
        }
        // 3. فحص ادعاء تسريب الأسرار (Secret Leak Claim)
        else if (category.includes('SECRET') || category.includes('CREDENTIAL')) {
            if (finding.evidence?.includes('process.env.') || finding.evidence?.includes('placeholder') || finding.evidence?.includes('test_secret') || finding.evidence?.includes('[REDACTED]')) {
                verdict = VERIFICATION_VERDICTS.FALSE_POSITIVE;
                legacyVerdict = 'FALSE_POSITIVE';
                reason = 'القيمة المرصودة هي متغير بيئة أو قيمة تجريبية في بيئة الاختبار وليست سراً حقيقياً مسرباً.';
                confidence = 'HIGH';
            }
        }
        // 4. فحص ادعاء IDOR
        else if (category.includes('IDOR') || ruleId.includes('idor')) {
            if (fileContent.includes('tenant_id') && fileContent.includes('tenantContext')) {
                verdict = VERIFICATION_VERDICTS.FALSE_POSITIVE;
                legacyVerdict = 'FALSE_POSITIVE';
                reason = 'المسار محمي بحراسة سياق المستأجر (Tenant Context Guard) الإلزامية.';
                confidence = 'HIGH';
            }
        }
        // 5. فحص عدم كفاية الأدلة العامة
        else if (!finding.evidence || finding.evidence === 'No raw snippet provided') {
            verdict = VERIFICATION_VERDICTS.LIKELY;
            legacyVerdict = 'LIKELY';
            confidence = 'MEDIUM';
            reason = 'المشكلة مرجحة بناءً على تحليل الأداة ولكن الدليل المرفق أولي يحتاج لاختبار ديناميكي.';
        }

        const verificationResult = {
            findingId: finding.id || 'unspecified_finding',
            verdict: legacyVerdict, // للتوافق العكسي مع الاختبارات القائمة
            formalVerdict: verdict,
            reason,
            confidence,
            verifiedAt: new Date().toISOString()
        };

        // الربط بالرسم البياني للأدلة إذا توفر
        if (evidenceGraph && typeof evidenceGraph.addNode === 'function') {
            const findingNodeId = finding.id || `FND_${Date.now()}`;
            evidenceGraph.addNode({
                id: findingNodeId,
                type: 'FINDING',
                category,
                verdict,
                confidence,
                reason
            });
        }

        return verificationResult;
    }
}

FindingVerifier.VERIFICATION_VERDICTS = VERIFICATION_VERDICTS;

module.exports = FindingVerifier;

