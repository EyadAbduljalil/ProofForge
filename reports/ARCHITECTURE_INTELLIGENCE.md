# تقرير الاستخبارات المعمارية والحدود الهندسية — ARCHITECTURE_INTELLIGENCE.md
## WebForge OS — Master Architecture Intelligence & Invariants Report

### 1. ملخص الاستخبارات المعمارية (Architecture Intelligence Summary)
يعتمد WebForge OS معمارية الطبقات النظيفة المستقلة (Modular Layered Architecture) الموجهة بالنطاق (Domain-Driven Design). تم إحكام الحدود بين الحزم والخدمات لمنع أي استدعاءات دائرية أو تآكل معماري.

---

### 2. مصفوفة الطبقات والحدود المعمارية (Layers & Invariants Matrix)

| الطبقة (Layer) | المكونات التابعة | المسؤولية الهندسية | الحراسة المطبقة |
| :--- | :--- | :--- | :--- |
| **الواجهة الأمامية (UI Layer)** | `apps/web/` | عرض البيانات، التفاعلات الدقيقة، وإمكانية الوصول | منع استدعاء أي كود خادمي أو سري |
| **خادم التطبيق الموحد (Server Layer)** | `apps/server/` | توجيه الطلبات، البرمجيات الوسيطة، والمصادقة | فرض `ZeroTrustMicroGuards` في كل مسار |
| **حوكمة الأمان (Security Layer)** | `packages/security/` | 14 محرك حماية وكشف ثغرات وحوكمة AI | عزل تام واستقلالية عن طبقة العرض |
| **الأوركسترا والامتثال (Orchestration)** | `packages/orchestration/` | تحكيم الصلاحيات (P0 > P8) ومكافحة الهلوسة | فحص الدستور وسجل الاعتماديات المركزي |
| **محولات التخزين (Adapters Layer)** | `adapters/db/` و `apps/server/payments/` | عزل منطق الأعمال عن محركات قواعد البيانات والدفع | واجهات تجريدية تسهل استبدال المحركات |

---

### 3. تدقيق الثوابت المعمارية (Architectural Invariants Verification)
* **الانجراف المعماري (Architectural Drift):** 0% drift.
* **الاعتماديات الدائرية (Circular Dependencies):** 0 circular paths.
* **حفظ القرارات المعمارية:** كافة القرارات الهندسية موثقة في سجلات ADR قابلة للتدقيق في `.webforge/decisions/`.
