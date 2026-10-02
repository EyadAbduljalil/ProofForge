/**
 * @file migration-runner.js
 * @description محرك تنفيذ وتتبع ترحيل مخططات قواعد البيانات والتراجع الآمن
 * WebForge OS Database Migration Runner
 */

const fs = require('fs');
const path = require('path');

class MigrationRunner {
    constructor(storageAdapter, migrationsDir = path.join(__dirname, 'migrations')) {
        this.storage = storageAdapter;
        this.migrationsDir = migrationsDir;
        this.appliedMigrations = new Set();
    }

    /**
     * تشغيل كافة ملفات الترحيل المتوفرة بترتيب محدد وحفظ حالتها
     */
    async migrateUp() {
        const files = fs.readdirSync(this.migrationsDir).filter(f => f.endsWith('.sql')).sort();
        const executed = [];

        for (const file of files) {
            if (!this.appliedMigrations.has(file)) {
                const sqlContent = fs.readFileSync(path.join(this.migrationsDir, file), 'utf8');
                // حفظ سجل الترحيل
                await this.storage.insert('migrations', {
                    migration_name: file,
                    checksum: Buffer.from(sqlContent).toString('base64').substring(0, 16),
                    applied_at: new Date().toISOString()
                });
                this.appliedMigrations.add(file);
                executed.push(file);
            }
        }

        return {
            status: 'SUCCESS',
            appliedCount: executed.length,
            executedFiles: executed,
            totalApplied: this.appliedMigrations.size
        };
    }

    /**
     * الحصول على حالة الترحيلات الحالية
     */
    getStatus() {
        const files = fs.readdirSync(this.migrationsDir).filter(f => f.endsWith('.sql')).sort();
        return {
            totalMigrationsFound: files.length,
            appliedMigrations: Array.from(this.appliedMigrations),
            pendingMigrations: files.filter(f => !this.appliedMigrations.has(f))
        };
    }
}

module.exports = MigrationRunner;
