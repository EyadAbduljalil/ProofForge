// منطق النماذج الآمنة مع التحقق المباشر ومنع الإرسال المكرر (Secure Validated Form)
class ValidatedForm {
    constructor(options = {}) {
        this.schema = options.schema || {};
        this.onSubmit = options.onSubmit || (async () => {});
        this.values = {};
        this.errors = {};
        this.isSubmitting = false;
        this.isSubmitted = false;
    }

    setFieldValue(field, value) {
        this.values[field] = value;
        // إزالة الخطأ عند بدء التعديل
        if (this.errors[field]) {
            delete this.errors[field];
        }
    }

    validate() {
        this.errors = {};
        for (const [field, rules] of Object.entries(this.schema)) {
            const val = this.values[field];
            if (rules.required && (!val || String(val).trim() === '')) {
                this.errors[field] = 'هذا الحقل إلزامي';
            } else if (rules.minLength && String(val).length < rules.minLength) {
                this.errors[field] = `يجب ألا يقل عن ${rules.minLength} أحرف`;
            }
        }
        return Object.keys(this.errors).length === 0;
    }

    async submit() {
        // حظر الإرسال المكرر
        if (this.isSubmitting) {
            return { blocked: true, reason: 'الطلب قيد المعالجة حالياً' };
        }

        const isValid = this.validate();
        if (!isValid) {
            return { success: false, errors: this.errors };
        }

        this.isSubmitting = true;
        try {
            const result = await this.onSubmit(this.values);
            this.isSubmitted = true;
            return { success: true, data: result };
        } catch (err) {
            return { success: false, serverError: err.message };
        } finally {
            this.isSubmitting = false;
        }
    }
}

module.exports = ValidatedForm;
