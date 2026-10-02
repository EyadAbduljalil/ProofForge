/**
 * @file plugin-adapter-manager.js
 * @description محرك معمارية وتكامل الإضافات والمحولات (Plugin & Adapter Manager Architecture)
 * يوفر عقوداً معيارية للمحولات (Adapters) للإضافات دون تعديل النواة (Core)
 */

class PluginAdapterManager {
    constructor() {
        this.adapters = new Map(); // type:name -> adapter
        this.plugins = new Map(); // name -> manifest
    }

    registerAdapter(type, name, adapterInstance, manifest = {}) {
        if (!type || !name || !adapterInstance) {
            throw new Error('يجب توفير النوع والاسم والنسخة البرمجية لتسجيل المحول (Adapter).');
        }

        const key = `${type}:${name}`;
        
        // التحقق من توافق العقد المعماري (Contract Compatibility)
        if (type === 'DATABASE' && typeof adapterInstance.query !== 'function') {
            throw new Error(`محول قاعدة البيانات '${name}' لا يلتزم بعقد query().`);
        }
        if (type === 'CACHE' && (typeof adapterInstance.get !== 'function' || typeof adapterInstance.set !== 'function')) {
            throw new Error(`محول الكاش '${name}' لا يلتزم بعقد get/set().`);
        }

        this.adapters.set(key, {
            type,
            name,
            instance: adapterInstance,
            version: manifest.version || '1.0.0',
            capabilities: manifest.capabilities || [],
            registeredAt: new Date().toISOString()
        });

        return true;
    }

    getAdapter(type, name) {
        const key = `${type}:${name}`;
        if (!this.adapters.has(key)) {
            throw new Error(`المحول '${key}' غير مسجل في مدير المحولات.`);
        }
        return this.adapters.get(key).instance;
    }

    listRegisteredAdapters() {
        return Array.from(this.adapters.values()).map(a => ({
            type: a.type,
            name: a.name,
            version: a.version,
            capabilities: a.capabilities
        }));
    }
}

module.exports = PluginAdapterManager;
