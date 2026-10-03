/**
 * @file rag-citation-verifier.js
 * @description WebForge V2.3 — RAG & Citation / Provenance Verifier
 * محرك تدقيق منظومات الـ RAG، مطابقة الادعاءات مع الاستشهادات والمصادر،
 * وكشف الاستشهادات الملفقة والمصادر المنقطعة والهلوسة المعرفية
 */

'use strict';

class RagCitationVerifier {
    constructor() {
        this.verifiedSources = new Map();
    }

    /**
     * تسجيل مصدر معرفي موثق في قاعدة البراهين
     * @param {Object} sourceDef
     */
    registerSource(sourceDef) {
        if (!sourceDef || !sourceDef.id || !sourceDef.content) {
            throw new Error('المصدر يتطلب معرفاً ومحتوى صالحين.');
        }

        const src = {
            id: String(sourceDef.id),
            uri: sourceDef.uri || sourceDef.id,
            title: sourceDef.title || '',
            content: String(sourceDef.content)
        };

        this.verifiedSources.set(src.id, src);
        return src;
    }

    /**
     * التحقق من ادعاء صادر عن النموذج وربطه بالاستشهاد والمصدر
     * @param {Object} claimContext
     */
    verifyClaimCitation(claimContext = {}) {
        const { claim, citationId, sourceExcerpt } = claimContext;

        if (!citationId) {
            return {
                claim,
                status: 'UNSUPPORTED_CLAIM',
                gate: 'FAIL',
                isSupported: false,
                reason: 'ادعاء صادر عن النموذج يفتقر إلى استشهاد بمصدر محدد.'
            };
        }

        const source = this.verifiedSources.get(citationId);
        if (!source) {
            return {
                claim,
                citationId,
                status: 'FABRICATED_OR_UNKNOWN_CITATION',
                gate: 'FAIL',
                isSupported: false,
                reason: `الاستشهاد المشار إليه (${citationId}) غير موجود في قاعدة المصادر المعتمدة (احتمال هلوسة أو فبركة مصادر).`
            };
        }

        // التحقق من أن المقتبس موجود فعلياً داخل المصدر المعتمد
        if (sourceExcerpt) {
            const normalizedSource = source.content.toLowerCase();
            const normalizedExcerpt = String(sourceExcerpt).toLowerCase().trim();

            if (!normalizedSource.includes(normalizedExcerpt)) {
                return {
                    claim,
                    citationId,
                    status: 'CITATION_MISMATCH',
                    gate: 'FAIL',
                    isSupported: false,
                    reason: 'المقتبس المشار إليه غير متطابق مع نص المصدر الأصلي.'
                };
            }
        }

        return {
            claim,
            citationId,
            sourceUri: source.uri,
            status: 'VERIFIED',
            gate: 'PASS',
            isSupported: true,
            verifiedAt: new Date().toISOString()
        };
    }
}

module.exports = {
    RagCitationVerifier
};
