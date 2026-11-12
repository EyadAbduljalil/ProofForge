// التغليف المعياري للاستجابات والطلبات (Standard API Envelope)
class ApiResponse {
    static success(data = {}, meta = {}) {
        const payload = typeof data === 'object' && data !== null ? data : { result: data };
        return {
            success: true,
            ...payload,
            data: payload,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: meta.requestId || `req_${Math.random().toString(36).substring(2, 9)}`,
                ...meta
            }
        };
    }

    static error(code, message, details = [], meta = {}) {
        const msg = typeof message === 'string' ? message : (message?.message || 'حدث خطأ غير متوقع');
        return {
            success: false,
            error: {
                code: code || 'INTERNAL_ERROR',
                message: msg,
                details: Array.isArray(details) ? details : [details]
            },
            code: code || 'INTERNAL_ERROR',
            message: msg,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: meta.requestId || `req_${Math.random().toString(36).substring(2, 9)}`,
                ...meta
            }
        };
    }

    static fail(message, code = 'REQUEST_FAILED', statusCode = 400, meta = {}) {
        return this.error(code, message, [], { statusCode, ...meta });
    }
}

module.exports = ApiResponse;
