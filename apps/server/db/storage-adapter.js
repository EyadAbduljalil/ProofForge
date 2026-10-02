/**
 * @file storage-adapter.js
 * @description محول قواعد البيانات والتخزين الموحد يدعم PostgreSQL ومحرك الذاكرة المحلي مع سياق المستأجر
 * WebForge OS Database & Storage Interface
 */

class StorageAdapter {
    constructor(options = {}) {
        this.type = options.type || 'in-memory'; // 'postgres' | 'in-memory'
        this.tables = {
            tenants: new Map(),
            users: new Map(),
            products: new Map(),
            orders: new Map(),
            audit_logs: new Map(),
            migrations: new Map()
        };
        this.tenantContext = null;
    }

    setTenantContext(tenantId) {
        this.tenantContext = tenantId;
    }

    clearTenantContext() {
        this.tenantContext = null;
    }

    /**
     * استعلام مدرع بالبارامترات ومحمي ضد حقن SQL وعزل المستأجرين
     */
    async query(table, filter = {}) {
        const tableMap = this.tables[table];
        if (!tableMap) throw new Error(`الجدول '${table}' غير موجود في قاعدة البيانات.`);

        const results = [];
        for (const record of tableMap.values()) {
            // تطبيق فحص المستأجر الإلزامي (RLS Simulation / Enforcement)
            if (this.tenantContext && record.tenant_id && record.tenant_id !== this.tenantContext) {
                continue; // حظر قراءة سجلات المستأجر الآخر
            }

            let match = true;
            for (const [key, value] of Object.entries(filter)) {
                if (record[key] !== value) {
                    match = false;
                    break;
                }
            }
            if (match) {
                results.push({ ...record });
            }
        }
        return results;
    }

    async insert(table, data) {
        const tableMap = this.tables[table];
        if (!tableMap) throw new Error(`الجدول '${table}' غير موجود.`);

        const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const record = {
            ...data,
            id,
            tenant_id: data.tenant_id || this.tenantContext || 'default',
            created_at: new Date().toISOString()
        };

        tableMap.set(id, record);
        return { ...record };
    }

    async update(table, id, updates) {
        const tableMap = this.tables[table];
        if (!tableMap || !tableMap.has(id)) throw new Error(`السجل غير موجود في الجدول '${table}'.`);

        const record = tableMap.get(id);
        if (this.tenantContext && record.tenant_id && record.tenant_id !== this.tenantContext) {
            throw new Error('محظور: لا تملك صلاحية تعديل سجل تابع لمستأجر آخر (RLS Violation)');
        }

        const updatedRecord = { ...record, ...updates, updated_at: new Date().toISOString() };
        tableMap.set(id, updatedRecord);
        return { ...updatedRecord };
    }

    async delete(table, id) {
        const tableMap = this.tables[table];
        if (!tableMap || !tableMap.has(id)) return false;

        const record = tableMap.get(id);
        if (this.tenantContext && record.tenant_id && record.tenant_id !== this.tenantContext) {
            throw new Error('محظور: لا تملك صلاحية حذف سجل تابع لمستأجر آخر (RLS Violation)');
        }

        return tableMap.delete(id);
    }
}

module.exports = StorageAdapter;
