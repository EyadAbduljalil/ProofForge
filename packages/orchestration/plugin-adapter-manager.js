/**
 * @file plugin-adapter-manager.js
 * @description محرك معمارية وتكامل الإضافات والمحولات المتقدمة (Advanced Adapter Fabric & Governance)
 * يوفر عقوداً معيارية وحوكمة أمنية وصلاحيات متدرجة (READ > WRITE > DESTRUCTIVE) مع تصنيف حالات الفشل وتصدير الأدلة
 */

const ADAPTER_CATEGORIES = {
    DATABASE: 'DATABASE',
    CACHE: 'CACHE',
    QUEUE: 'QUEUE',
    CLOUD: 'CLOUD',
    CICD: 'CICD',
    OBSERVABILITY: 'OBSERVABILITY',
    STORAGE: 'STORAGE',
    AUTHENTICATION: 'AUTHENTICATION',
    DEPLOYMENT: 'DEPLOYMENT'
};

const ADAPTER_STATUS = {
    AVAILABLE: 'AVAILABLE',
    UNAVAILABLE: 'UNAVAILABLE',
    NOT_DETECTED: 'NOT_DETECTED',
    NOT_APPLICABLE: 'NOT_APPLICABLE',
    ENVIRONMENT_LIMITATION: 'ENVIRONMENT_LIMITATION',
    AVAILABLE_OPTIONAL_ADAPTER: 'AVAILABLE_OPTIONAL_ADAPTER'
};

const ADAPTER_PERMISSIONS = {
    READ: 'READ',
    WRITE: 'WRITE',
    DESTRUCTIVE: 'DESTRUCTIVE'
};

const ADAPTER_FAILURE_CLASSES = {
    AUTHENTICATION_FAILURE: 'AUTHENTICATION_FAILURE',
    AUTHORIZATION_FAILURE: 'AUTHORIZATION_FAILURE',
    NETWORK_FAILURE: 'NETWORK_FAILURE',
    TIMEOUT: 'TIMEOUT',
    RATE_LIMIT: 'RATE_LIMIT',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
    CAPABILITY_UNAVAILABLE: 'CAPABILITY_UNAVAILABLE',
    TOOL_NOT_INSTALLED: 'TOOL_NOT_INSTALLED',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    UNKNOWN: 'UNKNOWN'
};

class PluginAdapterManager {
    constructor(options = {}) {
        this.adapters = new Map(); // category:name -> adapter
        this.plugins = new Map(); // name -> manifest
        this.evidenceGraph = options.evidenceGraph || null;
    }

    /**
     * تسجيل محول جديد مع فحص العقد المعماري والحوكمة الأمنية
     */
    registerAdapter(category, name, adapterInstance, manifest = {}) {
        if (!category || !name || !adapterInstance) {
            throw new Error('يجب توفير التصنيف والاسم والنسخة البرمجية لتسجيل المحول (Adapter).');
        }

        const upperCategory = String(category).toUpperCase();
        const key = `${upperCategory}:${name}`;
        
        // التحقق من توافق العقود المعمارية الأساسية
        if (upperCategory === ADAPTER_CATEGORIES.DATABASE && typeof adapterInstance.query !== 'function') {
            throw new Error(`محول قاعدة البيانات '${name}' لا يلتزم بعقد query().`);
        }
        if (upperCategory === ADAPTER_CATEGORIES.CACHE && (typeof adapterInstance.get !== 'function' || typeof adapterInstance.set !== 'function')) {
            throw new Error(`محول الكاش '${name}' لا يلتزم بعقد get/set().`);
        }

        const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [ADAPTER_PERMISSIONS.READ];

        const adapterRecord = {
            id: manifest.id || `ADP_${upperCategory}_${name}`,
            category: upperCategory,
            type: upperCategory, // للتوافق العكسي
            name,
            instance: adapterInstance,
            version: manifest.version || '1.0.0',
            capabilities: Array.isArray(manifest.capabilities) ? manifest.capabilities : [],
            status: manifest.status || ADAPTER_STATUS.AVAILABLE,
            isOptional: manifest.isOptional !== undefined ? manifest.isOptional : (manifest.status === ADAPTER_STATUS.AVAILABLE_OPTIONAL_ADAPTER),
            permissions,
            riskLevel: permissions.includes(ADAPTER_PERMISSIONS.DESTRUCTIVE) ? 'HIGH' : (permissions.includes(ADAPTER_PERMISSIONS.WRITE) ? 'MEDIUM' : 'LOW'),
            registeredAt: new Date().toISOString()
        };

        this.adapters.set(key, adapterRecord);

        // تصدير دليل التسجيل إلى الرسم البياني للأدلة
        if (this.evidenceGraph && typeof this.evidenceGraph.addNode === 'function') {
            this.evidenceGraph.addNode({
                id: adapterRecord.id,
                type: 'ADAPTER',
                category: upperCategory,
                status: adapterRecord.status,
                capabilities: adapterRecord.capabilities
            });
        }

        return true;
    }

    getAdapter(category, name) {
        const key = `${String(category).toUpperCase()}:${name}`;
        if (!this.adapters.has(key)) {
            throw new Error(`المحول '${key}' غير مسجل في مدير المحولات.`);
        }
        return this.adapters.get(key).instance;
    }

    getAdapterRecord(category, name) {
        const key = `${String(category).toUpperCase()}:${name}`;
        return this.adapters.get(key) || null;
    }

    /**
     * تنفيذ عملية عبر المحول مع بوابات الصلاحيات والحماية من العمليات التدميرية غير المصرح بها
     */
    async executeOperation(category, name, operationName, params = {}, options = {}) {
        const record = this.getAdapterRecord(category, name);
        if (!record) {
            return {
                success: false,
                failureClass: ADAPTER_FAILURE_CLASSES.CAPABILITY_UNAVAILABLE,
                error: `المحول '${category}:${name}' غير متوفر.`
            };
        }

        const operationPermission = options.permission || ADAPTER_PERMISSIONS.READ;

        // بوابة الأمان: منع العمليات التدميرية دون إذن صريح
        if (operationPermission === ADAPTER_PERMISSIONS.DESTRUCTIVE && !record.permissions.includes(ADAPTER_PERMISSIONS.DESTRUCTIVE)) {
            return {
                success: false,
                failureClass: ADAPTER_FAILURE_CLASSES.AUTHORIZATION_FAILURE,
                error: `المحول '${name}' لا يمتلك صلاحية تنفيذ العمليات التدميرية (${operationName}).`
            };
        }

        try {
            if (typeof record.instance[operationName] !== 'function') {
                return {
                    success: false,
                    failureClass: ADAPTER_FAILURE_CLASSES.CAPABILITY_UNAVAILABLE,
                    error: `العملية '${operationName}' غير مدعومة في المحول '${name}'.`
                };
            }

            const result = await record.instance[operationName](params);
            
            // توليد وتطبيع دليل النجاح
            const evidence = {
                adapterId: record.id,
                category: record.category,
                operation: operationName,
                status: 'PASSED',
                timestamp: new Date().toISOString()
            };

            return {
                success: true,
                result,
                evidence
            };
        } catch (err) {
            const failureClass = this.classifyAdapterError(err);
            return {
                success: false,
                failureClass,
                error: err.message,
                adapterId: record.id
            };
        }
    }

    classifyAdapterError(error) {
        const msg = String(error?.message || error || '').toLowerCase();
        if (msg.includes('auth') || msg.includes('unauthorized') || msg.includes('credential') || msg.includes('invalid token')) {
            return ADAPTER_FAILURE_CLASSES.AUTHENTICATION_FAILURE;
        }
        if (msg.includes('forbidden') || msg.includes('permission') || msg.includes('access denied')) {
            return ADAPTER_FAILURE_CLASSES.AUTHORIZATION_FAILURE;
        }
        if (msg.includes('timeout') || msg.includes('etimedout')) {
            return ADAPTER_FAILURE_CLASSES.TIMEOUT;
        }
        if (msg.includes('rate limit') || msg.includes('429') || msg.includes('too many requests')) {
            return ADAPTER_FAILURE_CLASSES.RATE_LIMIT;
        }
        if (msg.includes('econnrefused') || msg.includes('network') || msg.includes('enotfound')) {
            return ADAPTER_FAILURE_CLASSES.NETWORK_FAILURE;
        }
        if (msg.includes('503') || msg.includes('service unavailable')) {
            return ADAPTER_FAILURE_CLASSES.SERVICE_UNAVAILABLE;
        }
        if (msg.includes('not installed') || msg.includes('binary missing') || msg.includes('command not found')) {
            return ADAPTER_FAILURE_CLASSES.TOOL_NOT_INSTALLED;
        }
        if (msg.includes('config') || msg.includes('invalid option') || msg.includes('missing setting')) {
            return ADAPTER_FAILURE_CLASSES.CONFIGURATION_ERROR;
        }
        return ADAPTER_FAILURE_CLASSES.UNKNOWN;
    }

    listRegisteredAdapters(filter = {}) {
        return Array.from(this.adapters.values())
            .filter(a => {
                if (filter.type && a.type !== filter.type && a.category !== filter.type) return false;
                if (filter.category && a.category !== filter.category) return false;
                if (filter.status && a.status !== filter.status) return false;
                if (filter.isOptional !== undefined && a.isOptional !== filter.isOptional) return false;
                return true;
            })
            .map(a => ({
                id: a.id,
                type: a.category,
                category: a.category,
                name: a.name,
                version: a.version,
                capabilities: a.capabilities,
                permissions: a.permissions,
                status: a.status,
                isOptional: a.isOptional,
                riskLevel: a.riskLevel,
                registeredAt: a.registeredAt
            }));
    }
}

PluginAdapterManager.ADAPTER_CATEGORIES = ADAPTER_CATEGORIES;
PluginAdapterManager.ADAPTER_STATUS = ADAPTER_STATUS;
PluginAdapterManager.ADAPTER_PERMISSIONS = ADAPTER_PERMISSIONS;
PluginAdapterManager.ADAPTER_FAILURE_CLASSES = ADAPTER_FAILURE_CLASSES;

module.exports = PluginAdapterManager;
