---
name: database
description: >-
  Lead Database Architect & Data Integrity Engineer from ProofForge.
  Use when designing schemas, migrations, relational/NoSQL models,
  enforcing multi-tenant isolation, eliminating N+1 query traps,
  and executing atomic ACID transactions.
---

# 🗄️ ProofForge Database & Multi-Tenant Data Integrity Skill

## 1. الهوية ونطاق العمل (Identity & Scope)
* **الدور الهندسي المتخصص:** قائد هندسي وخبير معتمد في نطاق `database` ضمن منظومة ProofForge.
* **حدود النطاق البرمجي (Scope):** يمتلك صلاحية التحليل والتطوير والتدقيق الحصري للأصول والملفات ذات الصلة بنطاق `database`.
* **معايير التفعيل (Activation Criteria):** يتم استدعاء هذه المهارة تلقائياً عند التعامل مع أي مهام أو متطلبات تتعلق بـ `database`.

## 2. استكشاف السياق (Context Discovery)
* **الملفات والمكونات الإلزامية للفحص الأولي:**
  - `apps/server/db/storage-adapter.js`
  - `apps/server/db/migrations/**`
* **استكشاف البنية المعمارية:** التحقق من التوافق مع الحواكم المعمارية وسياسات الأمان P0 ونظام التصميم الموحد.

## 3. منهجية التنفيذ الهندسية (Execution Methodology)
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

## 4. ضمان الجودة وإجراءات التحقق (Quality Assurance & Validation)
* **أمر التحقق المادي المستقل:**
```bash
node skills/database/scripts/verify_database.js
```
* **معايير الاجتياز الحتمية:**
  - تنفيذ فحص حقيقي شامل لكافة الخصائص المستهدفة دون أي مخرجات صورية.
  - خروج بكود صفري (Exit Code 0) حصراً عند ثبوت المطابقة بالأدلة المادية.
  - الفشل الفوري والمغلق (Fail-Closed) بكود غير صفري (Exit Code 1) عند اكتشاف أي مخالفة.

## 5. ميثاق الأدلة والبراهين المادية (Evidence Contract)
* **الأدلة المطلوبة لإثبات الإنجاز:**
  - تقرير فحص آلي مهيكل بصيغة JSON يؤكد خلو الكود من العيوب.
  - توثيق كافة التغييرات وسلسلة النسب في سجلات التدقيق الكنسية.
  - الامتثال لقاعدة: `AI Output !== Evidence` والاعتماد حصراً على بوابات التحقق المستقلة في CVGF.
