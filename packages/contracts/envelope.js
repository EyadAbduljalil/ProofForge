// التغليف المعياري للاستجابات والطلبات (Standard API Envelope)
class ApiResponse {
    static success(data = {}, meta = {}) {
        return {
            success: true,
            data,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: meta.requestId || `req_${Math.random().toString(36).substring(2, 9)}`,
                ...meta
            }
        };
    }

    static error(code, message, details = [], meta = {}) {
        return {
            success: false,
            error: {
                code: code || 'INTERNAL_ERROR',
                message: message || 'حدث خطأ غير متوقع',
                details: Array.isArray(details) ? details : [details]
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: meta.requestId || `req_${Math.random().toString(36).substring(2, 9)}`,
                ...meta
            }
        };
    }
}

module.exports = ApiResponse;
