// حارس الملكية ومنع ثغرات التحكم غير المباشر بالكائنات (Ownership Guard / Anti-IDOR)
class OwnershipGuard {
    static validateOwnership(user, resource, options = {}) {
        if (!user || !user.id) {
            const err = new Error('غير مصرح: يجب تسجيل الدخول للتحقق من ملكية المورد');
            err.statusCode = 401;
            throw err;
        }

        if (!resource) {
            const err = new Error('المورد المطلوب غير موجود');
            err.statusCode = 404;
            throw err;
        }

        // مدير النظام يملك صلاحية التجاوز إذا تم تحديد ذلك
        if (options.allowAdmin && user.role === 'admin') {
            return true;
        }

        // فحص عزل المستأجر (Tenant Isolation)
        if (options.checkTenant && resource.tenant_id && resource.tenant_id !== user.tenantId) {
            const err = new Error('محظور: لا تملك صلاحية الوصول لبيانات هذا المستأجر');
            err.statusCode = 403;
            throw err;
        }

        // فحص ملكية المستخدم الفردية
        const ownerId = resource.user_id || resource.userId || resource.owner_id;
        if (ownerId && String(ownerId) !== String(user.id)) {
            const err = new Error('محظور: لا تملك صلاحية الوصول أو تعديل هذا المورد (IDOR Protection)');
            err.statusCode = 403;
            throw err;
        }

        return true;
    }
}

module.exports = OwnershipGuard;
