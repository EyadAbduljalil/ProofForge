---
name: architecture
description: >-
  Lead Software Architect and Systems Design Engine from ProofForge.
  Use when designing application architecture, planning component boundaries,
  enforcing Clean Architecture separation of concerns, authoring Architecture Decision Records (ADRs),
  modeling data flow diagrams (DFDs), designing state machines, and defining domain invariants.
---

# 🏛️ ProofForge Architecture Skill

## 1. الهدف والمبادئ الحاكمة (Architectural Mandate)
توجيه الذكاء الاصطناعي وهندسة النظم لبناء تطبيقات متماسكة، قابلة للتوسع، ومعزولة الطبقات:
* **الفصل الصارم للمسؤوليات (Strict Separation of Concerns):** عزل طبقة البيانات (Data/Persistence)، عن طبقة منطق الأعمال (Domain Logic)، عن طبقة العرض (Presentation Layer).
* **الحتمية والاستقرار (Invariants & State Integrity):** عدم السماح بانتقال النظام إلى حالات غير معرفة؛ استخدام آلات الحالات المحددة (Deterministic State Machines).
* **التوثيق المعماري الإلزامي (ADR Documentation):** توثيق كل قرار هيكلي استراتيجي داخل سجلات ADRs رسمية.

---

## 2. بروتوكول التصميم المعماري الإلزامي

### أ) طبقات النظام (Clean Architecture Layers)
1. **طبقة الكيانات والمنطق (Domain Layer):** نماذج البيانات النقية، وقواعد الأعمال المستقلة عن أي إطار عمل أو قاعدة بيانات.
2. **طبقة التطبيق والخدمات (Application Layer):** حالات الاستخدام (Use Cases)، وتنسيق العمليات، وإدارة الصلاحيات.
3. **طبقة البنية التحتية والبيانات (Infrastructure Layer):** محولات قواعد البيانات، والتخزين المؤقت، واستدعاء واجهات الـ API الخارجية.
4. **طبقة الواجهة والعرض (Presentation Layer):** المكونات البصرية، ونقاط النهاية، ومعالجة أحداث المستخدم.

### ب) توثيق القرارات المعمارية (ADR Workflow)
عند اتخاذ قرار معماري (مثل اختيار تقنية التشفير، قاعدة البيانات، أو نمط إدارة الحالة):
1. قم بإنشاء ملف قرار داخل `.webforge/decisions/` أو `docs/decisions/` وفق قالب [adr_template.md](./references/adr_template.md).
2. حدد بوضوح: المشكلة، الخيارات البديلة، القرار المختار، والعواقب (الإيجابيات والسلبيات).

### ج) رسم مخططات تدفق البيانات (Data Flow Diagrams via Mermaid)
توضيح حركة البيانات ومستويات الثقة في كل مهمة هيكلية باستخدام مخططات Mermaid:
```mermaid
flowchart LR
    Client["Client / UI"] -->|"1. Sanitized Request"| Gateway["API Gateway / Auth Gate"]
    Gateway -->|"2. Authenticated Context"| Domain["Domain Service"]
    Domain -->|"3. Persistence Query"| Repo["Repository / DB"]
```

---

## 3. خطوات التشغيل والتحقق (Execution & Verification)

1. **مراجعة نماذج المعمارية:** اطلع على البنية النموذجية في [clean_architecture_layers.md](./examples/clean_architecture_layers.md).
2. **تدقيق القرارات:** استخدم قالب القرارات في [adr_template.md](./references/adr_template.md).
3. **تشغيل فاحص المعمارية:**
   ```bash
   node skills/architecture/scripts/verify_architecture.js
   ```
