# WebForge OS — الدليل الهندسي والمعرفي المركزي (Knowledge Core)
## The Canonical AI Engineering Rulebook & Quality Knowledge Base

---

### 1. نظرة عامة (Overview)
مجلد `01-KNOWLEDGE` هو القلب المعرفي لنظام **WebForge OS**. يحتوي على القواعد الهندسية والمعمارية، معايير الأمان، أنماط التصميم، القوائم المرجعية، والسياسات الصارمة المصممة لتوجه وكلاء الذكاء الاصطناعي والمطورين لإنتاج برمجيات عالية الجودة والأمان والأداء والموثوقية.

---

### 2. البنية الهيكلية للطبقة المعرفية (Structure)

```text
01-KNOWLEDGE/
├── README.md               # دليل الاستخدام والبنية المعرفية
├── index.json              # الفهرس الآلي الموحد لجميع القواعد والأصول المعرفية
├── principles/             # المبادئ الهندسية والأمنية العليا الحاكمة
├── standards/              # المعايير الفنية، عقود الاستجابة، وتوكنات التصميم
├── policies/               # سياسات الأمان والحوكمة والامتثال الإلزامية
├── patterns/               # الحلول والأنماط المعمارية المعتمدة
├── anti-patterns/          # الأنماط المضادة والمحظورة (Anti-Slop & Flaws)
└── rules/                  # القواعد الصارمة القابلة للفحص الآلي
    ├── security/           # قواعد الأمان والمصادقة والصلاحيات (SEC-*)
    ├── engineering/        # معمارية النظم وإدارة الحالة والخطأ (ENG-*)
    ├── design/             # ذكاء التصميم والتناغم اللوني والطباعة (UI-*)
    ├── accessibility/      # معايير إتاحة الاستخدام WCAG 2.2 AA (A11Y-*)
    ├── responsive/         # قواعد التكيف مع الشاشات الـ 10 (RESP-*)
    ├── performance/        # ميزانيات الأداء وترشيد الموارد (PERF-*)
    ├── testing/            # اختبارات الانحدار وتتبع الأدلة (TEST-*)
    ├── api/                # معايير RESTful ومغلفات الاستجابة (API-*)
    ├── database/           # سلامة البيانات وعزل المستأجرين (DB-*)
    ├── localization/       # التعريب ودعم RTL واتجاه النصوص (I18N-*, RTL-*)
    ├── seo/                # معايير البنية الدلالية ومحركات البحث (SEO-*)
    └── ai-security/        # حماية الوكيل من Prompt Injection (AI-*)
```

---

### 3. معيار صياغة القواعد (Rule Schema)
كل ملف قاعدة داخل `rules/` مكتوب بصيغة Markdown مع ترويسة YAML متوافقة مع القراءة الآلية والبشرية:

```yaml
---
id: "SEC-AUTH-001"
title: "Strict Scrypt Password Hashing and Side-Channel Protection"
category: "security"
subcategory: "authentication"
severity: "CRITICAL"
applies_to:
  - "backend"
  - "api"
tags:
  - "authentication"
  - "scrypt"
cwe: "CWE-916"
status: "ACTIVE"
requirement: "..."
why: "..."
bad_patterns:
  - "..."
good_patterns:
  - "..."
validation_check: "..."
evidence: "..."
remediation: "..."
exceptions: "N/A"
references:
  - "..."
---
```

---

### 4. دورة حياة القواعد (Rule Lifecycle)
- **`DRAFT`**: قاعدة قيد الصياغة الأولية.
- **`REVIEW`**: قاعدة قيد المراجعة والتدقيق الهندسي.
- **`ACTIVE`**: قاعدة معتمدة وملزمة ومربوطة بفاحصات آلية وأدلة اختبار.
- **`DEPRECATED`**: قاعدة تم استبدالها بمعيار أحدث.
- **`ARCHIVED`**: قاعدة تاريخية مؤرشفة.

---

### 5. استهلاك المعرفة من قبل وكلاء الذكاء الاصطناعي والفاحصات (Consumption)
1. **الوكيل (AI Agent)**: يقرأ `index.json` لاكتشاف القواعد المنطبقة على سياق المشروع وتطبيقها فوراً.
2. **الفاحصات (Validators)**: تستدعي `validation_check` لفحص الشيفرة المصدرية وتوثيق الدليل في `EvidenceGraph`.
