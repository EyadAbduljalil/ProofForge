# إطار توجيهات الذكاء الاصطناعي (AI Instruction Framework)

## المعرّف: `DOC-AI-INSTRUCTIONS-README-001`
## الحالة: `ACTIVE`
## النطاق: الوكلاء الأذكياء وهندسة البرمجيات التوليدية

---

## 1. نظرة عامة والهدف المعماري
يُمثّل **إطار توجيهات الذكاء الاصطناعي (AI Instruction Framework)** الطبقة التشغيلية التي تترجم أصول النواة المعرفية [`01-KNOWLEDGE/`](file:///c:/Users/WAHAD/Desktop/WebForge%20OS/01-KNOWLEDGE/) إلى تعليمات وبروتوكولات تنفيذية تحكم سلوك أي وكيل برمجي ذكي (AI Coding Agent).

النظام يُحدد بوضوح:
- **الوكيل الذكي**: هو المنفّذ (Executor).
- **WebForge OS**: هو الدليل الهندسي ونظام الجودة والحوكمة الصارم (Rulebook & Quality Framework).

---

## 2. الهيكل التنظيمي للمجلد (`02-AI-INSTRUCTIONS/`)

```text
02-AI-INSTRUCTIONS/
├── README.md                          # الدليل الرئيسي وخريطة الإطار
├── core/                              # العقد الأساسي والمبادئ التشغيلية الحاكمة
│   ├── AI_AGENT_CONTRACT.md
│   └── OPERATING_PRINCIPLES.md
├── lifecycle/                         # دورة حياة عمل الوكيل عبر 10 مراحل حتمية
│   ├── AI_LIFECYCLE.md
│   ├── UNDERSTAND.md
│   ├── INSPECT.md
│   ├── DETECT.md
│   ├── SELECT_RULES.md
│   ├── DECIDE.md
│   ├── PLAN.md
│   ├── IMPLEMENT.md
│   ├── VALIDATE.md
│   ├── VERIFY_EVIDENCE.md
│   └── REPORT.md
├── decision-rules/                    # هرمية السلطة وحل التعارضات وتقييم الانطباق
│   ├── AUTHORITY_HIERARCHY.md
│   ├── RULE_CONFLICT_RESOLUTION.md
│   └── APPLICABILITY_DECISION.md
├── workflows/                         # مسارات العمل والتخطيط التكيفي وإدارة المخاطر
│   ├── TASK_WORKFLOW.md
│   ├── REPLANNING.md
│   └── RISK_BASED_EXECUTION.md
├── permissions/                       # مصفوفة الصلاحيات وسياسات العمليات الحساسة
│   ├── AGENT_PERMISSION_BOUNDARY.md
│   └── DESTRUCTIVE_OPERATION_POLICY.md
├── safety/                            # الأمان الدفاعي ومكافحة الحقن وحماية الأسرار
│   ├── UNTRUSTED_REPOSITORY.md
│   ├── PROMPT_INJECTION_DEFENSE.md
│   ├── SECRET_HANDLING.md
│   └── SAFE_STOP_CONDITIONS.md
├── evidence/                          # بروتوكول الإثبات وربط الادعاءات بالأدلة
│   ├── EVIDENCE_CONTRACT.md
│   └── VERIFICATION_CLAIMS.md
├── audit/                             # سجلات التدقيق وتوثيق القرارات المعمارية
│   ├── AGENT_AUDIT_CONTRACT.md
│   └── DECISION_RECORD.md
└── schemas/                           # المخططات المعيارية للتقارير والقرارات
    ├── DECISION_RECORD_SCHEMA.md
    └── AI_REPORT_SCHEMA.md
```

---

## 3. دورة حياة الوكيل المعيارية (10 المراحل الحتمية)
1. **UNDERSTAND (الاستيعاب)**: تفكيك الطلب وتحديد النطاق والمعايير والافتراضات.
2. **INSPECT (الفحص)**: مسح المستودع والكود القائم والاعتماديات.
3. **DETECT (الاكتشاف)**: استكشاف المكدس التقني والبيئة دون افتراضات مسبقة.
4. **SELECT RULES (انتقاء القواعد)**: اختيار القواعد المنطبقة من الـ 36 قاعدة معيارية.
5. **DECIDE (اتخاذ القرار)**: التحكيم عبر هرمية السلطة وتوثيق المفاضلات.
6. **PLAN (التخطيط)**: وضع خطة تنفيذ وتحقق متناسبة مع حجم المهمة.
7. **IMPLEMENT (التنفيذ)**: تطبيق التعديل الأدنى الآمن (Minimal Safe Diff).
8. **VALIDATE (التحقق البرمجي)**: تشغيل الفحوصات والاختبارات الآلية.
9. **VERIFY EVIDENCE (توثيق الأدلة)**: ربط كل نتيجة برقم مخرج وسجل حقيقي.
10. **REPORT (إصدار التقرير والتوقف)**: تقديم التقرير الشامل والتوقف التام.
