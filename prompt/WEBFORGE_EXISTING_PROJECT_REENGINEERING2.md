اقرأ ونفّذ بالكامل:

WEBFORGE_EXISTING_PROJECT_REENGINEERING.md

هذا المستودع يحتوي حاليًا على WebForge OS نفسه، وهو نظام قائم بالفعل وليس مشروعًا فارغًا.

تعامل معه أولًا كـ Existing Project يحتاج إلى Reengineering وتحسين شامل.

مهم جدًا:
لا تثق بأي تقرير سابق أو README أو نسبة اكتمال أو ادعاء أمني على أنه حقيقة نهائية.

استخدم التقارير السابقة فقط كـ baseline / claims يجب إعادة التحقق منها.

أعد فحص الكود الفعلي والـruntime والاختبارات والأدلة.

لا تفترض أن:
READY = Production Ready
PASS = Complete
Implemented = Integrated
Mock = Real
HTTP E2E = Browser E2E
Static Audit = Runtime Verification
Documentation = Enforcement

أعد التحقق من كل ذلك.

ابدأ بـ:

1. Baseline للمستودع الحالي.
2. مقارنة الحالة الحالية مع التقارير السابقة.
3. اكتشاف كل الفجوات الجديدة والقديمة.
4. إصلاح المشاكل الموجودة فعليًا.
5. تحسين المشروع الموجود بدل إعادة بنائه من الصفر.
6. تحسين Architecture.
7. تحسين Security.
8. تحسين Business Logic.
9. تحسين Database.
10. تحسين API.
11. تحسين Frontend.
12. تحسين UX/UI.
13. إصلاح Responsive لكل المقاسات.
14. إصلاح RTL/LTR.
15. تحسين Accessibility.
16. مراجعة وتحسين Animation.
17. تحسين Performance.
18. تحسين Error Handling.
19. تحسين Forms.
20. تحسين State Management.
21. تحسين Caching.
22. تحسين Concurrency.
23. تحسين Observability.
24. تحسين Infrastructure.
25. تحسين CI/CD.
26. إصلاح جميع CLI commands غير المتوافقة.
27. إزالة/إصلاح الاختبارات simulated أو الضعيفة.
28. إضافة Real Browser E2E عندما تكون البيئة تسمح.
29. إضافة Visual Regression حقيقية عندما تكون البيئة تسمح.
30. التحقق من PostgreSQL وRedis الحقيقيين.
31. التحقق من Docker production path.
32. التحقق من Payment abstraction وSandbox integration.
33. مراجعة جميع Security Controls ومحاولة اكتشاف bypasses.
34. مراجعة AI/Agent Security.
35. مراجعة Requirement Traceability.
36. مراجعة Evidence.
37. مراجعة Documentation مقابل الواقع.
38. مراجعة جميع dependencies.
39. مراجعة dead code وTODO وstub وmock.
40. مراجعة التكرار والتعارض بين الحزم.

يجب أن تعمل بمنهج:

BASELINE
→ DISCOVER
→ AUDIT
→ IMPACT ANALYSIS
→ PLAN
→ MODIFY
→ TEST
→ REGRESSION
→ MEASURE
→ VERIFY
→ SELF-AUDIT
→ FINAL VERIFICATION

لا تكتفِ بإصلاح المشاكل التي أبلغ عنها التقرير.

ابحث بنفسك عن مشاكل لم يكتشفها التقرير.

إذا وجدت مشكلة في UX أصلحها.

إذا وجدت مشكلة Responsive أصلحها.

إذا وجدت Animation سيئة حسّنها أو أزلها.

إذا وجدت Performance bottleneck أصلحه وقِس Before/After.

إذا وجدت Security bypass أصلحه واكتب Regression Test.

إذا وجدت Business Logic flaw أصلحه واختبره.

إذا وجدت Architecture ضعيفة حسّنها دون كسر الوظائف.

إذا وجدت API غير متناسقة أصلحها.

إذا وجدت Database Query سيئة حسّنها.

إذا وجدت Error Handling ضعيفًا أصلحه.

إذا وجدت Accessibility issue أصلحه.

إذا وجدت مشروعًا يعمل لكنه سيئ الاستخدام، حسّن تجربة المستخدم.

إذا وجدت واجهة تعمل على Desktop لكنها تنهار على Mobile، أصلحها.

إذا وجدت تصميمًا قديمًا أو غير متناسق، حسّنه مع الحفاظ على هوية المشروع.

إذا وجدت Animation لا تضيف قيمة، أزلها.

إذا وجدت Animation تسبب jank أو layout thrashing، أصلحها.

إذا وجدت Loading أو Empty أو Error States ناقصة، أكملها.

إذا وجدت أي جزء يمكن تحسينه بشكل حقيقي، لا تتجاهله لمجرد أنه لم يكن ضمن التقرير السابق.

لكن:

لا تغيّر شيئًا لمجرد التغيير.

كل تغيير مهم يجب أن يكون:
JUSTIFIED
TRACEABLE
TESTED
REGRESSION-PROTECTED

ولا تعيد كتابة المشروع بالكامل إلا إذا أثبتت الأدلة أن الإصلاح التدريجي غير مناسب.

بعد الإصلاحات نفّذ:

UNIT
INTEGRATION
CONTRACT
API
DATABASE
SECURITY
BUSINESS LOGIC
CONCURRENCY
E2E
REAL BROWSER
VISUAL
RESPONSIVE
ACCESSIBILITY
PERFORMANCE
INFRASTRUCTURE
PRODUCTION SMOKE

حيثما تسمح البيئة.

ثم نفّذ Self-Audit جديدًا.

ثم أعد فحص جميع المشاكل التي اكتشفتها في البداية.

ثم قارن:

BEFORE
vs
AFTER

وأثبت أن التحسينات لم تكسر أي وظيفة كانت تعمل سابقًا.

أنشئ في النهاية:

reports/EXISTING_PROJECT_BASELINE.md
reports/PROJECT_IMPROVEMENT_REPORT.md
reports/PROJECT_REENGINEERING_FINAL.md
reports/BEFORE_AFTER_METRICS.md
reports/REGRESSION_FINAL_REPORT.md

ولا تعتبر المهمة مكتملة بمجرد نجاح build أو npm test.

الهدف هو:

WebForge OS
=
Understand
+
Repair
+
Secure
+
Optimize
+
Modernize
+
Verify

وليس مجرد:

Build
+
Test

ابدأ التنفيذ الآن.