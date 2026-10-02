// إدارة الإشعارات التفاعلية وقارئات الشاشة (Accessible Toast Alert)
class ToastManager {
    constructor() {
        this.toasts = [];
        this.listeners = [];
    }

    notify(message, type = 'info', durationMs = 4000) {
        const id = `toast_${Math.random().toString(36).substring(2, 9)}`;
        const toast = {
            id,
            message,
            type, // info, success, warning, danger
            role: type === 'danger' ? 'alert' : 'status',
            'aria-live': type === 'danger' ? 'assertive' : 'polite',
            createdAt: Date.now()
        };

        this.toasts.push(toast);
        this._emit();

        if (durationMs > 0) {
            setTimeout(() => this.dismiss(id), durationMs);
        }

        return id;
    }

    dismiss(id) {
        this.toasts = this.toasts.filter(t => t.id !== id);
        this._emit();
    }

    _emit() {
        this.listeners.forEach(fn => fn(this.toasts));
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }
}

module.exports = ToastManager;
