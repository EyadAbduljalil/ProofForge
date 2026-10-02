// حارس أمان استعلامات GraphQL وتحديد العمق والتعقيد
class GraphQLSecurityGuard {
    static calculateQueryDepth(queryString) {
        if (!queryString || typeof queryString !== 'string') return 0;
        let maxDepth = 0;
        let currentDepth = 0;

        for (let i = 0; i < queryString.length; i++) {
            if (queryString[i] === '{') {
                currentDepth++;
                if (currentDepth > maxDepth) maxDepth = currentDepth;
            } else if (queryString[i] === '}') {
                currentDepth--;
            }
        }
        return maxDepth;
    }

    static validateQuery(queryString, options = {}) {
        const maxAllowedDepth = options.maxDepth || 6;
        const depth = this.calculateQueryDepth(queryString);

        if (depth > maxAllowedDepth) {
            throw new Error(`عمق الاستعلام (${depth}) يتجاوز الحد المسموح به (${maxAllowedDepth}) لمنع هجمات DoS`);
        }

        // حظر الاستعلامات ذات الاستبطان (Introspection) في بيئة الإنتاج إن طُلب ذلك
        if (options.blockIntrospection && queryString.includes('__schema')) {
            throw new Error('استعلامات الاستبطان (__schema) محظورة في بيئة الإنتاج');
        }

        return { valid: true, depth };
    }
}

module.exports = GraphQLSecurityGuard;
