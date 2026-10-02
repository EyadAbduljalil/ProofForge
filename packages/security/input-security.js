// تعقيم المدخلات وحماية Prototype Pollution و Mass Assignment
class InputSecurityGuard {
    static sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        const clean = Array.isArray(obj) ? [] : {};

        for (const [key, value] of Object.entries(obj)) {
            // حظر محاولات تلويث الـ Prototype
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }

            if (typeof value === 'object' && value !== null) {
                clean[key] = this.sanitizeObject(value);
            } else if (typeof value === 'string') {
                // تعقيم أساسي للأحرف الصريحة
                clean[key] = value.replace(/[<>]/g, '');
            } else {
                clean[key] = value;
            }
        }
        return clean;
    }

    static filterAllowedFields(inputBody, allowedFields = []) {
        const result = {};
        for (const field of allowedFields) {
            if (inputBody[field] !== undefined) {
                result[field] = inputBody[field];
            }
        }
        return result;
    }
}

module.exports = InputSecurityGuard;
