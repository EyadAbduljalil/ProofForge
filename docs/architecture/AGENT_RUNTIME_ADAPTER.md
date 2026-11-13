# وثيقة التصميم المعماري: محول مشغل الوكيل الذكي (Agent Runtime Adapter)

## 1. الملخص المعماري (Architectural Overview)
تم استبدال آلية التنفيذ المبنية على القوالب الجاهزة والنتائج المصطنعة داخل محرك التنفيذ متعدد المهارات `MultiSkillExecutionEngine` بمحول مشغل وكيل حقيقي `AgentExecutionAdapter` ومزود بيئة تشغيل مستقل `AgentRuntimeProvider`.

النظام يرفض قطعياً:
- توليد مستندات قرار معماري (ADR) أو سجلات تهديد أمني (Threat Models) جاهزة دون عمل فعلي.
- توليد مقاييس أداء زائفة (مثل Lighthouse: 98، LCP: 1.2s، CLS: 0.01، INP: 45ms).
- توليد نسب مطابقة زائفة (مثل `tokenMatchRate: 100`).
- منح حالة `VERIFIED` دون تدقيق مستقل بواسطة أدوات الفحص المتخصصة المادية على القرص.

---

## 2. آلة الحالات الحتمية المكونة من 12 حالة (Strict 12-State Machine)
ينتقل المحول عبر دورة حياة محكمة لا تقبل القفز أو تجاوز البوابات:

```text
PENDING 
  └── CONTEXT_DISCOVERY 
        └── SKILL_LOADING 
              └── AGENT_RUNTIME_INITIALIZING 
                    └── AGENT_EXECUTING 
                          └── ARTIFACT_COLLECTION 
                                └── INDEPENDENT_VERIFICATION 
                                      └── VERIFIED
```

### حالات التوقف والإخفاق (Terminal & Failure States)
- `AGENT_RUNTIME_UNAVAILABLE`: غياب واجهة تشغيل الوكيل المعتمدة في البيئة (Fail-Closed).
- `FAILED`: إخفاق تنفيذي أو برمجي للوكيل أثناء تنفيذ المهمة.
- `BLOCKED`: تعثر الاستدعاء أو انتهاك صلاحيات الحدود الأمنية.
- `CANCELLED`: إلغاء يدوي أو عبر إشارة توقف.

---

## 3. تصنيف الأخطاء الصارم (Error Taxonomy)
1. `AGENT_RUNTIME_UNAVAILABLE`: المشغل غير متاح أو غير معتمد.
2. `AGENT_RUNTIME_INITIALIZATION_FAILED`: فشل تهيئة بيئة المشغل.
3. `AGENT_EXECUTION_FAILED`: إخفاق داخلي في منطق تنفيذ الوكيل.
4. `AGENT_EXECUTION_TIMEOUT`: تجاوز مهلة التنفيذ الزمنية المحددة.
5. `AGENT_EXECUTION_CANCELLED`: إلغاء التنفيذ قبل الاكتمال.
6. `PROJECT_CONTEXT_UNAVAILABLE`: تعذر اكتشاف واستخراج سياق المشروع المستهدف.
7. `WORKSPACE_PERMISSION_DENIED`: محاولة كتابة أو قراءة دون الصلاحيات الممنوحة.
8. `UNAUTHORIZED_WORKSPACE_MODIFICATION`: محاولة التعديل أو الهروب خارج حدود المجلد الجذري للمشروع (`Directory Traversal`).
9. `ARTIFACT_COLLECTION_FAILED`: تعذر جمع وتأكيد المخرجات المادية المكتوبة.
10. `INDEPENDENT_VERIFICATION_FAILED`: إخفاق أدوات الفحص المستقلة في التحقق من صحة المخرجات.

---

## 4. المزودات المدعومة (Supported Runtime Providers)
1. `AntigravityCliRuntimeAdapter`: يتصل بمشغل واجهة سطر أوامر Antigravity الرسمية (`agy.exe`) مع تحديد مهلة تنفيذ زمنية وإعادة توجيه مساحة العمل بأمان.
2. `ControlledTestRuntimeAdapter`: مخصص حصرياً لبيئة الاختبار المعزولة ومحاكاة السيناريوهات الحتمية لحالات الخطأ، والمهلات، والإلغاء دون أي ادعاء لذكاء اصطناعي.
3. السلوك الافتراضي: الإخفاق المغلق الفوري `AGENT_RUNTIME_UNAVAILABLE` في حال عدم وجود مشغل حقيقي أو علامة تنشيط واضحة.
