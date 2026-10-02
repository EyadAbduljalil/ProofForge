# Full Testing Strategy & Quality Assurance

نفّذ إستراتيجية اختبارات متكاملة (Automated Testing Strategy) لضمان موثوقية وجودة الكود وتغطيته لكافة الأجزاء والسيناريوهات الحساسة.

## 1. نطاقات وأنواع الاختبارات (Testing Levels & Coverage)
* **Unit Tests (اختبارات الوحدة)**:
  * اختبار الدوال البرمجية الحسابية المستقلة (حساب إجمالي السلة، خصم الكوبون، حساب الضرائب والشحن، حساب متوسط التقييم).
* **Integration Tests (اختبارات التكامل)**:
  * اختبار التفاعل بين الخدمات وقاعدة البيانات (Inventory hold/release, Order state transitions, DB Transactions).
* **API / End-to-End Tests (اختبارات الواجهات البرمجية)**:
  * اختبار مسارات HTTP APIs للتأكد من أداء الـ Controller, Middleware, Validation, والردود بصيغة JSON متوقعة ورُموز الحالة (Status Codes).

## 2. المكونات المستهدفة بالاختبارات (Modules Under Test)
تغطية المكونات الأساسية للنظام باختبارات مؤكدة:
* Authentication & Authorization
* Products & Categories Management
* Cart & Wishlist Operations
* Coupons Discount Validation & Limits
* Checkout Process & Order Creation
* Orders Management & Timeline Tracking
* Inventory Concurrency & Stock Locks
* Payments Initialization & Webhooks
* Reviews Submission & Moderation
* Admin Dashboard APIs & RBAC Guards

## 3. السيناريوهات الحساسة والحالات الحدية (Critical Edge Case Scenarios)
كتابة اختبارات مخصصة تضمن سلامة النظام في الحالات الحساسة التالية:
* **Invalid Login & Auth Security**: محاولات دخول بكلمات مرور خاطئة أو توكينات منتهية/منتزعة.
* **Unauthorized Access**: محاولة مستخدم عادي الوصول لمسارات الأدمن أو تعديل طلبات عميل آخر (IDOR Attempt).
* **Insufficient Stock**: محاولة شراء منتج بكمية تتجاوز المخزون المتاح أو نافد الصلاحية.
* **Concurrent Orders (Race Condition)**: قيام عدة مستخدمين بشراء آخر قطعة متوفرة في المخزون بنفس اللحظة وتأكيد عدم البيع الزائد.
* **Coupon Calculation Constraints**: تطبيق كوبون منتهي الصلاحية، أو لم يحقق حد السلة الأدنى، أو استخدام الكوبون لأكثر من الحد المسموح.
* **Order Totals Verification**: التأكد من مطابقة إجمالي الطلب الحسابية بدقة مع مراعاة كافة التخفيضات والشحن.
* **Payment Success & Failure Webhooks**: محاكاة استلام Webhook لعملية دفع ناجحة وفاشلة واختبار صحة التحديثات والتراجع عن الحجز عند الفشل.
* **Order Cancellation & Stock Rollback**: إلغاء الطلب والتأكد من عودة الكميات المحجوزة للمخزون بدقة.

## 4. تشغيل الاختبارات وإصلاح الأخطاء (Execution Pipeline)
* ضبط واستدعاء أوامر التشغيل القياسية:
  * تشغيل الأخطاء التنسيقية والفحص البرمجي: `npm run lint`
  * تشغيل كافة الاختبارات: `npm run test`
  * تشغيل بناء المشروع: `npm run build`
* إصلاح كافة الأخطاء الناتجة (Lint errors, failed tests, TypeScript type errors) حتى يعيد الأمر ناتجاً سليماً 100% دون أي تحذيرات أو أخطاء.
