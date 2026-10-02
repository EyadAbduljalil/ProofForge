// نموذج الأخطاء المهيكلة وتصنيفاتها (Structured Error Model)
class AppError extends Error {
    constructor(code, message, statusCode = 400, details = [], correlationId = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.correlationId = correlationId || `corr_${Math.random().toString(36).substring(2, 9)}`;
    }

    static validation(message = 'فشل التحقق من صحة البيانات', details = []) {
        return new AppError('VALIDATION_ERROR', message, 400, details);
    }

    static unauthorized(message = 'غير مصرح: يرجى تسجيل الدخول') {
        return new AppError('UNAUTHORIZED', message, 401);
    }

    static forbidden(message = 'محظور: لا تملك الصلاحية الكافية') {
        return new AppError('FORBIDDEN', message, 403);
    }

    static notFound(message = 'المورد المطلوب غير موجود') {
        return new AppError('NOT_FOUND', message, 404);
    }

    static conflict(message = 'تعارض في حالة المورد') {
        return new AppError('CONFLICT', message, 409);
    }

    static rateLimited(message = 'تم تجاوز معدل الطلبات المسموح به') {
        return new AppError('RATE_LIMITED', message, 429);
    }

    static internal(message = 'خطأ داخلي في الخادم', correlationId = null) {
        return new AppError('INTERNAL_SERVER_ERROR', message, 500, [], correlationId);
    }
}

module.exports = AppError;
