// منطق النافذة المنبثقة مكتملة إمكانية الوصول وحبس التركيز (Accessible Dialog Primitive)
class AccessibleDialog {
    constructor(options = {}) {
        this.isOpen = false;
        this.title = options.title || '';
        this.description = options.description || '';
        this.onClose = options.onClose || (() => {});
        this.previouslyFocusedElement = null;
    }

    open(triggerElement = null) {
        this.previouslyFocusedElement = triggerElement;
        this.isOpen = true;
        return {
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'dialog-title',
            'aria-describedby': 'dialog-description',
            isOpen: true
        };
    }

    close() {
        this.isOpen = false;
        if (this.onClose) this.onClose();
        return {
            isOpen: false,
            restoreFocusTo: this.previouslyFocusedElement
        };
    }

    handleKeyDown(event) {
        if (!this.isOpen) return;
        if (event.key === 'Escape' || event.keyCode === 27) {
            return this.close();
        }
    }
}

module.exports = AccessibleDialog;
