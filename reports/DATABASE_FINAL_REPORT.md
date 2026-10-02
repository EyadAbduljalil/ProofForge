# تقرير قواعد البيانات والترحيلات — WebForge OS Database & Storage Report

## 1. ملخص استراتيجية التخزين (Storage & Database Strategy)
تم تصميم طبقة التخزين في WebForge OS لتدعم العزل الصارم بين المستأجرين (Tenant Isolation) مع دعم سياسات أمان مستوى الصف (Row-Level Security) وتتبع الترحيلات التشغيلية الموجهة.

## 2. مخطط قاعدة البيانات ومسارات الترحيل (Schema Migrations)

| ملف الترحيل | الوصف والوظيفة | الجداول / الكائنات المتأثرة |
| :--- | :--- | :--- |
| `001_initial_schema.sql` | إنشاء الجداول الأساسية لنظام التجارة والحسابات والمستأجرين | `tenants`, `users`, `products`, `orders`, `audit_logs` |
| `002_rls_policies.sql` | تفعيل سياسات Row-Level Security في PostgreSQL | سياسات `tenant_isolation_policy` على كافة الجداول |

## 3. محرك الترحيلات (Migration Runner)
- **المسار**: `apps/server/db/migration-runner.js`
- **الوظيفة**: قراءة ملفات `.sql` بترتيب رقمي تصاعدي، تنفيذ الترحيلات داخل معاملات ذرية (Transactions)، وتسجيل حالة الترحيل في جدول `schema_migrations`.
- **حالة التشغيل التجريبي**: اجتاز التحقق بنجاح مع دعم التراجع الآمن (Rollback).

## 4. محول الذاكرة المؤقتة (Distributed Cache & State)
- **المسار**: `apps/server/cache/redis-adapter.js`
- **الميزات**:
  - دعم الذرية في عمليات التحقق من مفتاح عدم التكرار `setIfNotExists`.
  - إدارة عمر المفاتيح (TTL Cleanup).
  - التوافق مع سياسات الأمان المغلقة `FAIL_CLOSED`.

---
**تاريخ الفحص**: 2026-10-02  
**فريق هندسة قواعد البيانات**: WebForge OS Data Engineering
