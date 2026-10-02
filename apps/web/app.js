// منطق الواجهة الرسومية التفاعلية لـ WebForge OS - النسخة المحسنة
document.addEventListener('DOMContentLoaded', () => {
    const logOutput = document.getElementById('log-output');
    const systemStatus = document.getElementById('system-status');
    const sessionInfo = document.getElementById('session-info');
    const idempotencyInput = document.getElementById('idempotency-key');
    const productSelect = document.getElementById('product-select');
    const authAlert = document.getElementById('auth-alert');
    const checkoutAlert = document.getElementById('checkout-alert');

    let currentToken = localStorage.getItem('webforge_token') || null;
    let currentUser = null;

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function refreshIdempotencyKey() {
        if (idempotencyInput) {
            idempotencyInput.value = generateUUID();
        }
    }

    function showAlert(el, message, type = 'error') {
        if (!el) return;
        el.className = `alert-box visible ${type === 'error' ? 'alert-error' : 'alert-success'}`;
        el.textContent = message;
        setTimeout(() => {
            el.className = 'alert-box';
        }, 5000);
    }

    function setBtnLoading(btn, isLoading, originalText) {
        if (!btn) return;
        btn.disabled = isLoading;
        if (isLoading) {
            btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> جاري التنفيذ...`;
        } else {
            btn.innerHTML = originalText;
        }
    }

    function log(message, type = 'info') {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        const prefix = type === 'error' ? '[خطأ]' : type === 'warn' ? '[تحذير]' : '[نجاح]';
        const formatted = `[${time}] ${prefix} ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
        if (logOutput) {
            logOutput.textContent = formatted + '\n' + logOutput.textContent;
        }
    }

    // فحص الصحة الأولي مع إعادة المحاولة
    async function checkHealth(retries = 3) {
        try {
            const res = await fetch('/healthz');
            const data = await res.json();
            if (res.ok && data.status === 'HEALTHY') {
                systemStatus.className = 'status-badge badge-success';
                systemStatus.textContent = 'متصل وسليم (Healthy)';
            } else {
                systemStatus.className = 'status-badge badge-error';
                systemStatus.textContent = 'خلل في الصحة';
            }
        } catch (e) {
            if (retries > 0) {
                setTimeout(() => checkHealth(retries - 1), 1500);
            } else {
                systemStatus.className = 'status-badge badge-error';
                systemStatus.textContent = 'الخادم غير متاح';
            }
        }
    }

    // جلب قائمة المنتجات
    async function loadProducts() {
        try {
            const res = await fetch('/api/v1/products');
            const data = await res.json();
            if (res.ok && data.products) {
                productSelect.innerHTML = '';
                if (data.products.length === 0) {
                    const opt = document.createElement('option');
                    opt.value = '';
                    opt.textContent = '-- لا توجد منتجات متاحة حالياً --';
                    productSelect.appendChild(opt);
                } else {
                    data.products.forEach(p => {
                        const opt = document.createElement('option');
                        opt.value = p.id;
                        opt.textContent = `${p.name} — $${p.price} (المخزون: ${p.stock})`;
                        productSelect.appendChild(opt);
                    });
                }
                log(`تم تحميل ${data.products.length} من المنتجات بنجاح.`);
            }
        } catch (e) {
            log('فشل تحميل المنتجات: ' + e.message, 'error');
        }
    }

    // تسجيل حساب جديد
    const regBtn = document.getElementById('register-btn');
    regBtn?.addEventListener('click', async () => {
        const tenantId = document.getElementById('auth-tenant').value.trim();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;

        if (!tenantId || !email || !password) {
            showAlert(authAlert, 'يرجى إدخال كافة الحقول المطلوبة للتسجيل');
            return;
        }

        const origText = regBtn.innerHTML;
        setBtnLoading(regBtn, true, origText);

        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, email, password, role: 'member' })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(authAlert, `تم إنشاء الحساب بنجاح لـ ${email}`, 'success');
                log(`تم تسجيل الحساب بنجاح: ${email} (المستأجر: ${tenantId})`);
            } else {
                showAlert(authAlert, data.error || 'فشل التسجيل');
                log(`فشل التسجيل: ${data.error || 'خطأ غير معروف'}`, 'error');
            }
        } catch (e) {
            showAlert(authAlert, `خطأ في الاتصال: ${e.message}`);
            log(`خطأ في الاتصال أثناء التسجيل: ${e.message}`, 'error');
        } finally {
            setBtnLoading(regBtn, false, origText);
        }
    });

    // تسجيل الدخول
    const loginBtn = document.getElementById('login-btn');
    loginBtn?.addEventListener('click', async () => {
        const tenantId = document.getElementById('auth-tenant').value.trim();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;

        if (!email || !password) {
            showAlert(authAlert, 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        const origText = loginBtn.innerHTML;
        setBtnLoading(loginBtn, true, origText);

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                currentToken = data.token;
                currentUser = data.user;
                localStorage.setItem('webforge_token', currentToken);
                sessionInfo.textContent = `مرحباً ${currentUser.email} (${currentUser.role}) | المستأجر: ${currentUser.tenantId}`;
                showAlert(authAlert, 'تم تسجيل الدخول بنجاح', 'success');
                log(`تم تسجيل الدخول بنجاح. الرمز المميز صادر ومحمي.`);
                loadProducts();
            } else {
                showAlert(authAlert, data.error || 'بيانات الدخول غير صحيحة');
                log(`فشل تسجيل الدخول: ${data.error || 'بيانات غير صالحة'}`, 'error');
            }
        } catch (e) {
            showAlert(authAlert, `خطأ أثناء تسجيل الدخول: ${e.message}`);
            log(`خطأ أثناء تسجيل الدخول: ${e.message}`, 'error');
        } finally {
            setBtnLoading(loginBtn, false, origText);
        }
    });

    // تنفيذ أمر الشراء
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn?.addEventListener('click', async () => {
        if (!currentToken) {
            showAlert(checkoutAlert, 'يجب تسجيل الدخول أولاً لإجراء الشراء');
            log('يجب تسجيل الدخول أولاً لتنفيذ أمر الشراء', 'warn');
            return;
        }
        const productId = productSelect.value;
        if (!productId) {
            showAlert(checkoutAlert, 'يرجى اختيار منتج صالح');
            return;
        }
        const quantity = parseInt(document.getElementById('checkout-qty').value, 10) || 1;
        const idempotencyKey = idempotencyInput.value;

        const origText = checkoutBtn.innerHTML;
        setBtnLoading(checkoutBtn, true, origText);

        try {
            const res = await fetch('/api/v1/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                    'Idempotency-Key': idempotencyKey
                },
                body: JSON.stringify({ productId, quantity })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(checkoutAlert, `تم إتمام الطلب بنجاح (رقم: ${data.order?.id})`, 'success');
                log(`تم إتمام الطلب الذري بنجاح: ${JSON.stringify(data.order)}`);
                refreshIdempotencyKey();
                loadProducts();
            } else {
                showAlert(checkoutAlert, data.error || 'فشل إتمام الشراء');
                log(`فشل تنفيذ الشراء: ${data.error || 'خطأ في الخادم'}`, 'error');
            }
        } catch (e) {
            showAlert(checkoutAlert, `خطأ أثناء الاتصال: ${e.message}`);
            log(`خطأ أثناء الشراء: ${e.message}`, 'error');
        } finally {
            setBtnLoading(checkoutBtn, false, origText);
        }
    });

    // تبديل الاتجاه
    document.getElementById('toggle-dir-btn')?.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir');
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', nextDir);
        document.documentElement.setAttribute('lang', nextDir === 'rtl' ? 'ar' : 'en');
        log(`تم تغيير اتجاه الواجهة إلى: ${nextDir.toUpperCase()}`);
    });

    // فحص المقاييس
    document.getElementById('fetch-metrics-btn')?.addEventListener('click', async () => {
        try {
            const res = await fetch('/metrics');
            const txt = await res.text();
            log(`المقاييس الحية:\n${txt}`);
        } catch (e) {
            log('فشل جلب المقاييس: ' + e.message, 'error');
        }
    });

    // فحص الصحة
    document.getElementById('fetch-health-btn')?.addEventListener('click', async () => {
        try {
            const res = await fetch('/readyz');
            const data = await res.json();
            log(data);
        } catch (e) {
            log('فشل فحص الجاهزية: ' + e.message, 'error');
        }
    });

    // مسح السجل
    document.getElementById('clear-logs-btn')?.addEventListener('click', () => {
        if (logOutput) logOutput.textContent = 'تم مسح السجل.\n';
    });

    // التهيئة
    refreshIdempotencyKey();
    checkHealth();
    loadProducts();
});
