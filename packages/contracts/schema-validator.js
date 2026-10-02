// مدقق المخططات الصارم وخالي الاعتماديات (Lightweight Schema Validator)
class SchemaValidator {
    static validate(schema, data) {
        const errors = [];
        const sanitized = {};

        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];

            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push({ field, issue: `الحقل '${field}' إلزامي` });
                continue;
            }

            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push({ field, issue: `نوع الحقل '${field}' يجب أن يكون ${rules.type}` });
                    continue;
                }

                if (rules.type === 'string') {
                    if (rules.minLength && value.length < rules.minLength) {
                        errors.push({ field, issue: `طول الحقل '${field}' يجب ألا يقل عن ${rules.minLength} أحرف` });
                    }
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors.push({ field, issue: `طول الحقل '${field}' يجب ألا يتجاوز ${rules.maxLength} أحرف` });
                    }
                    if (rules.pattern && !rules.pattern.test(value)) {
                        errors.push({ field, issue: `صيغة الحقل '${field}' غير صالحة` });
                    }
                }

                if (rules.type === 'number') {
                    if (rules.min !== undefined && value < rules.min) {
                        errors.push({ field, issue: `قيمة الحقل '${field}' يجب ألا تقل عن ${rules.min}` });
                    }
                    if (rules.max !== undefined && value > rules.max) {
                        errors.push({ field, issue: `قيمة الحقل '${field}' يجب ألا تتجاوز ${rules.max}` });
                    }
                }

                sanitized[field] = value;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            data: errors.length === 0 ? sanitized : null
        };
    }
}

module.exports = SchemaValidator;
