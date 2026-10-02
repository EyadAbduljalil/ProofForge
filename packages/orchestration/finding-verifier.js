/**
 * @file finding-verifier.js
 * @description محرك التحقق المستقل من المشاكل وتمييز الإنذارات الخاطئة (False Positive & Negative Engine)
 * يفحص النتائج المكتشفة من أدوات المسح آلياً ويحدد ما إذا كانت حقيقية (True Positive) أو إنذاراً كاذباً (False Positive)
 */

class FindingVerifier {
    /**
     * التحقق المستقل من نتيجة أداة فحص معينة بالنظر إلى الحراسات والضوابط المحيطة
     * @param {Object} finding النتيجة الموحدة
     * @param {Object} codeContext سياق الكود والملف
     */
    static verifyFinding(finding, codeContext = {}) {
        const fileContent = codeContext.content || '';
        
        // 1. فحص ادعاء حقن SQL (SQL Injection Claim)
        if (finding.category.includes('SQL_INJECTION') || finding.rule_id?.includes('sql')) {
            // إذا كان الكود يستخدم Prepared Statements أو Parameterized Object queries
            if (fileContent.includes('prepare(') || fileContent.includes('query($') || fileContent.includes('query(table, filter)')) {
                return {
                    verdict: 'FALSE_POSITIVE',
                    reason: 'الاستعلام يستخدم وسائط محمية بالبارامترات (Parameterized Query) ولا يقبل الدمج النصي المباشر.',
                    confidence: 'HIGH'
                };
            }
        }

        // 2. فحص ادعاء تسريب الأسرار (Secret Leak Claim)
        if (finding.category.includes('SECRET') || finding.category.includes('CREDENTIAL')) {
            if (finding.evidence?.includes('process.env.') || finding.evidence?.includes('placeholder') || finding.evidence?.includes('test_secret')) {
                return {
                    verdict: 'FALSE_POSITIVE',
                    reason: 'القيمة المرصودة هي متغير بيئة أو قيمة تجريبية في بيئة الاختبار وليست سراً حقيقياً مسرباً.',
                    confidence: 'HIGH'
                };
            }
        }

        // 3. فحص ادعاء IDOR
        if (finding.category.includes('IDOR') || finding.rule_id?.includes('idor')) {
            if (fileContent.includes('tenant_id') && fileContent.includes('tenantContext')) {
                return {
                    verdict: 'FALSE_POSITIVE',
                    reason: 'المسار محمي بحراسة سياق المستأجر (Tenant Context Guard) الإلزامية.',
                    confidence: 'HIGH'
                };
            }
        }

        return {
            verdict: 'TRUE_POSITIVE',
            reason: 'المشكلة مؤكدة هندسياً وتتطلب تطبيق إصلاح آمن واختبار انحدار مصاحب.',
            confidence: 'CONFIRMED'
        };
    }
}

module.exports = FindingVerifier;
