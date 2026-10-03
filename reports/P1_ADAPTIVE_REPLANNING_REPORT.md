# تقرير إعادة التخطيط المتكيف وحماية الحلقات — P1_ADAPTIVE_REPLANNING_REPORT.md
## WebForge OS — Phase 3: Adaptive Replanning & Loop Protection Report

> **تاريخ الإصدار**: 2026-10-02  
> **النظام المختص**: `packages/orchestration/task-replanner.js`  
> **حالة التحقق**: `VERIFIED` بنسبة 100%

---

### 1. تصنيف حالات الفشل العشر (Failure Taxonomy)

| الفئة (Failure Class) | المؤشرات والأنماط (Keywords & Patterns) | القرار الافتراضي (Decision) | الاستراتيجية المقترحة (Strategy) | مستوى الخطر (Risk) |
| :--- | :--- | :---: | :--- | :---: |
| **`SECURITY_FAILURE`** | `unauthorized`, `forbidden`, `idor`, `injection`, `permission` | `ESCALATE_TO_SECURITY_GATE` | `STRICT_AUTHORIZATION_FIX` | `CRITICAL` |
| **`REQUIREMENT_CONFLICT`** | `conflict`, `contradiction`, `rule conflict` | `ESCALATE` | `ARBITRATE_CONSTITUTION_RULE` | `HIGH` |
| **`CAPABILITY_MISSING`** | `missing capability`, `not supported in stack` | `ALTERNATIVE_VERIFICATION` | `FALLBACK_STATIC_AUDIT` | `LOW` |
| **`ENVIRONMENT_FAILURE`** | `environment`, `econnrefused`, `missing binary` | `ALTERNATIVE_VERIFICATION` | `FALLBACK_STATIC_AUDIT` | `LOW` |
| **`DEPENDENCY_FAILURE`** | `module not found`, `cannot find package`, `lockfile` | `REFINE` | `PINNED_VERSION_FALLBACK` | `MEDIUM` |
| **`CONCURRENCY_OR_RACE`** | `race`, `deadlock`, `lock`, `concurrent` | `CHANGE_STRATEGY` | `ATOMIC_MUTEX_LOCK` | `MEDIUM` |
| **`PERFORMANCE_FAILURE`** | `timeout`, `performance`, `latency`, `thrashing` | `CHANGE_STRATEGY` | `DEBOUNCED_ASYNC_THROTTLE` | `MEDIUM` |
| **`TEST_FAILURE`** | `assert`, `test failed`, `expect` | `REFINE` | `REGRESSION_DRIVEN_REPAIR` | `MEDIUM` |
| **`IMPLEMENTATION_FAILURE`**| `syntax`, `typeerror`, `referenceerror`, `undefined` | `REFINE` | `STRICT_TYPE_COMPLIANCE` | `LOW` |
| **`TOOL_FAILURE`** | `tool failed`, `parser error`, `sarif invalid` | `ALTERNATIVE_VERIFICATION` | `INTERNAL_NORMALIZER_FALLBACK`| `LOW` |

---

### 2. آلية حماية الحلقات التكرارية (Loop Protection & Bounded Retries)

- يتم احتساب توقيع رقمي فريد لكل فشل: `failureSignature = ${failureType}_${hash(error)}`.
- يتم تتبع التواقيع لكل مهمة في جدول `attemptSignatures`.
- إذا تكرر نفس التوقيع لنفس المهمة مرتين متتاليتين:
  - يُتخذ قرار `REPLAN_BLOCKED` فوراً مع إيقاف المحاولات العشوائية.
  - يتم تسجيل الفشل وتصنيف الخطر كـ `HIGH`.
- إذا تجاوز عدد المحاولات الحد الأقصى (`maxAttempts`، الافتراضي 3):
  - يُتخذ قرار `ROLLBACK_AND_ESCALATE`.

---

### 3. دليل الاختبار البرمجي
تم التحقق في [packages/orchestration/tests/orchestration.test.js](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/packages/orchestration/tests/orchestration.test.js#L318-L330) من حظر التكرار في المحاولة الثالثة بنجاح، واجتياز تصنيف الأنواع العشرة.
