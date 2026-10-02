// مصفوفة وتفويض الصلاحيات الصارم (RBAC Authorization)
class AuthorizationMatrix {
    constructor() {
        this.roles = {
            guest: ['products:read', 'categories:read'],
            customer: ['products:read', 'categories:read', 'orders:create', 'orders:read_own', 'profile:manage_own'],
            admin: ['*']
        };
    }

    hasPermission(role, requiredPermission) {
        if (!role || !this.roles[role]) return false;
        const permissions = this.roles[role];
        if (permissions.includes('*')) return true;
        return permissions.includes(requiredPermission);
    }

    enforce(role, requiredPermission) {
        if (!this.hasPermission(role, requiredPermission)) {
            const err = new Error(`محظور: الدور الحالي (${role}) لا يملك الصلاحية المطلوبة (${requiredPermission})`);
            err.statusCode = 403;
            throw err;
        }
        return true;
    }
}

module.exports = AuthorizationMatrix;
