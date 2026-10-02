# Payment Integration & Gateway Architecture

نفّذ نظام Payments متكامل وحقيقي للمشروع يربط بين Checkout والـBackend ومزودي خدمة الدفع الإلكتروني.

## 1. البنية التحتية لتكامل الدفع (Payment Abstraction Layer)
* أنشئ `PaymentProvider` Interface مرن ومستقل يتيح دعم وسائل دفع متعددة ويسهل استبدال أو إضافة مزود دفع مستقبلاً (مثل Stripe, PayMob, Tap, PayPal).
* صمم `PaymentService` ليتعامل مع وسائل الدفع المختلفة:
  * Cash on Delivery (COD)
  * Online Card Payments (Visa, MasterCard, Mada, Meeza)
* تضمن الخدمة الفصل التام بين Business Logic الخاص بالطلبات والتفاصيل التقنية لمزود الدفع.

## 2. دورة حياة الدفع (Payment Lifecycle & Flow)
* **Payment Initialization**:
  * عند اختيار العميل للدفع الإلكتروني في Checkout، ينشئ Backend حزمة الدفع (Payment Intent / Session) عبر مزود الخدمة.
  * إرجاع `client_secret` أو رابط الدفع الآمن إلى Frontend فقط.
* **Server-side Verification & Security**:
  * حساب إجمالي المبلغ (Total Amount) وتفاصيل السلة حصرياً على Server-side بناءً على أسعار قاعدة البيانات ومخزون المنتجات ورسوم الشحن والخصومات الحقيقية.
  * منع التلاعب بالمبالغ كلياً من جهة Frontend؛ أي إرسال للمبلغ من المترجم يُرفض فوراً.
* **Callback & Webhook Handling**:
  * إنشاء Webhook Endpoint آمن للتحقق من التحديثات اللحظية لعمليات الدفع (Payment Webhook Route).
  * فحص وتأكيد التوقيع الرقمي للـWebhook (Cryptographic Signature Verification) لمنع التزوير.
  * التعامل مع Callback Route في حالة إعادة توجيه المستخدم بعد الدفع.

## 3. حالات الدفع وتحديث الطلب (Payment Statuses)
* إدارة حالات الدفع بدقة داخل قاعدة البيانات:
  * `PENDING`
  * `PAID`
  * `FAILED`
  * `REFUNDED`
  * `PARTIALLY_REFUNDED`
* ربط السجل بحقول التتبع الحقيقية: `orderId`, `paymentProvider`, `transactionId`, `paymentIntentId`, `paymentMethod`.
* عند الدفع الناجح (`PAID`):
  * تحويل حالة الطلب إلى `CONFIRMED` أو `PROCESSING`.
  * خصم المخزون المحجوز نهائياً.
  * إرسال إشعار وتاكيد بريدي للعميل.
* عند فشل الدفع (`FAILED`):
  * تسجيل سبب الفشل دون كشف بيانات حساسة.
  * تحرير المخزون المحجوز (Stock Release).
  * إتاحة فرصة للعميل لإعادة المحاولة بأسلوب آمن.

## 4. معمارية الاسترداد (Refunds Architecture)
* دالة برمجية مخصصة للـAdmin لإجراء الاسترداد (Full or Partial Refund).
* التواصل مع مزود الدفع لتنفيذ الاسترداد المالي وإعادة تسجيل الحالة كـ `REFUNDED`.
* تحديث سجلات المخزون والمالية التابعة للطلب بدقة.

## 5. الأمان وامتثال PCI-DSS والبيئة
* **عدم تخزين بيانات البطاقات**: يُحظر تماماً حِفظ رقم البطاقة أو CVV أو تاريخ الانتهاء على سيرفراتنا أو قاعدة بياناتنا. استخدام عناصر وتوكينات آمنة من مزود الدفع (Hosted Fields / Elements).
* **إدارة المتغيرات البيئية (`.env`)**:
  * تخزين المفاتيح السرية (`PAYMENT_SECRET_KEY`, `WEBHOOK_SECRET`, `MERCHANT_ID`) في `.env` فقط.
  * التأكد من غياب الأسرار عن السورس كود.

## 6. التحقق والاختبار
* دعم بيئة Sandbox / Test Keys لاختبار سيناريوهات الدفع الناجح والدفع الفاشل والمعاملات المرفوضة والـWebhooks محلياً.
