// عميل الـ API المحصن مع التجديد التلقائي للرموز وإعادة المحاولة الذكية (Resilient API Client)
class ApiClient {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.tokenRefreshHandler = options.tokenRefreshHandler || null;
        this.maxRetries = options.maxRetries || 3;
        this.timeoutMs = options.timeoutMs || 8000;
        this.isRefreshing = false;
        this.refreshQueue = [];
    }

    _isSafeToRetry(method, statusCode) {
        // حظر إعادة المحاولة لعمليات POST والعمليات غير الآمنة لتجنب تكرار الدفع
        const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
        if (!idempotentMethods.includes(method.toUpperCase())) return false;
        return [408, 429, 500, 502, 503, 504].includes(statusCode);
    }

    async _delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    async request(path, options = {}) {
        const method = options.method || 'GET';
        const url = `${this.baseUrl}${path}`;
        let attempt = 0;

        while (attempt <= this.maxRetries) {
            try {
                const response = await this._executeFetch(url, { ...options, method });
                
                // معالجة 401 Unauthorized وحلقة التجديد الصامت
                if (response.status === 401 && this.tokenRefreshHandler && !options._isRetryAfterRefresh) {
                    const refreshed = await this._handleSilentRefresh();
                    if (refreshed) {
                        return this.request(path, { ...options, _isRetryAfterRefresh: true });
                    }
                }

                if (!response.ok && this._isSafeToRetry(method, response.status) && attempt < this.maxRetries) {
                    attempt++;
                    const backoff = Math.pow(2, attempt) * 100 + Math.random() * 50;
                    await this._delay(backoff);
                    continue;
                }

                return response;
            } catch (err) {
                if (this._isSafeToRetry(method, 500) && attempt < this.maxRetries) {
                    attempt++;
                    const backoff = Math.pow(2, attempt) * 100;
                    await this._delay(backoff);
                    continue;
                }
                throw err;
            }
        }
    }

    async _executeFetch(url, options) {
        // محاكاة fetch أو استخدام fetch الأصلي المتاح في Node 18+
        if (typeof fetch === 'function') {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
            try {
                const res = await fetch(url, { ...options, signal: controller.signal });
                return res;
            } finally {
                clearTimeout(timeout);
            }
        }

        // بيئة محاكاة للاختبارات الداخلية
        return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: {} })
        };
    }

    async _handleSilentRefresh() {
        if (this.isRefreshing) {
            return new Promise(resolve => this.refreshQueue.push(resolve));
        }

        this.isRefreshing = true;
        try {
            const success = await this.tokenRefreshHandler();
            this.refreshQueue.forEach(cb => cb(success));
            this.refreshQueue = [];
            return success;
        } catch {
            this.refreshQueue.forEach(cb => cb(false));
            this.refreshQueue = [];
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }
}

module.exports = ApiClient;
