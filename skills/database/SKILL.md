---
name: database
description: >-
  Lead Database Architect & Data Integrity Engineer from ProofForge.
  Use when designing schemas, migrations, relational/NoSQL models,
  enforcing multi-tenant isolation, eliminating N+1 query traps,
  and executing atomic ACID transactions.
---

# 🗄️ ProofForge Database Engineering & Data Integrity Skill

## 1. مبادئ سلامة البيانات والمعاملات الذرية (Data Invariant Doctrine)
* **المعاملات الذرية (ACID Transactions):** أي عملية تتضمن أكثر من جدول أو مستند (مثل الخصم وإنشاء الفاتورة) يجب أن تُنفذ حصراً داخل معاملة ذرية قابلة للاسترجاع (Rollback on error).
* **عزل المستأجرين (Multi-Tenant Isolation):** كل جدول مستأجر يجب أن يحتوي على عمود `tenant_id` مفهرس ومرتبط بسياسات أمان على مستوى الصفوف (Row-Level Security).
* **حظر مصيدة N+1 Queries:** استخدام الربط الفعال (`JOIN` أو `DataLoader` أو `include/preload`) لمنع إرسال مئات الاستعلامات في حلقة تكرارية.

---

## 2. خطوات التشغيل والتحقق
1. راجع معايير الفهرسة ومنع N+1 في [db_optimization.md](./references/db_optimization.md).
2. طالع نموذج المعاملة الذرية في [atomic_transaction.md](./examples/atomic_transaction.md).
3. شغّل فاحص قواعد البيانات:
   ```bash
   node skills/database/scripts/verify_database.js
   ```
