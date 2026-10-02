# In-App & Multi-Channel Notification System

أنشئ نظام إشعارات مرن ومتكامل (Notification System) لتنبيه العملاء والمسؤولين بأهم مستجدات الطلبات والمعاملات.

## 1. محفزات وأحداث الإشعارات (Notification Events & Triggers)
* إطلاق إشعارات تلقائية عند وقوع الأحداث التالية:
  * `ORDER_CREATED`: عند إنشاء الطلب بنجاح.
  * `ORDER_CONFIRMED`: عند تأكيد الطلب.
  * `PAYMENT_SUCCESSFUL`: عند نجاح عملية الدفع الإلكتروني.
  * `PAYMENT_FAILED`: عند فشل عملية الدفع.
  * `ORDER_SHIPPED`: عند تم شحن الطلب وتسليم رقم التتبع.
  * `OUT_FOR_DELIVERY`: عند خروج الطلب مع التوصيل.
  * `ORDER_DELIVERED`: عند استلام العميل للطلب.
  * `ORDER_CANCELLED`: عند إلغاء الطلب.
  * `RETURN_UPDATED`: عند تحديث حالة طلب الإرجاع.

## 2. إدارة الإشعارات داخل التطبيق (In-App Notifications Feature)
* **نموذج بيانات الإشعار (`Notification`)**:
  * `userId`: معرف العميل المستهدف.
  * `title`: عنوان الإشعار.
  * `message`: نص الإشعار الموجز.
  * `type`: نوع الإشعار أو الحدث.
  * `isRead`: حالة القراءة (Boolean, Default: false).
  * `link`: رابط التوجيه السريع داخل التطبيق (e.g. `/account/orders/ORD-123`).
  * `createdAt`: وقت صدور الإشعار.
* **واجهات برمجة التطبيق (API Endpoints)**:
  * `GET /api/notifications`: جلب قائمة الإشعارات الخاصة بالعميل المسجل مع دعم Pagination.
  * `GET /api/notifications/unread-count`: جلب عدد الإشعارات غير المقروءة لتحديث أيقونة الجرس في Header.
  * `PATCH /api/notifications/:id/read`: تحديد إشعار معين كـ "تمت القراءة".
  * `PATCH /api/notifications/read-all`: تحديد جميع الإشعارات كـ "تمت القراءة".

## 3. المعمارية القابلة للتوسع والقنوات المستقبيلية (Multi-Channel Architecture)
* تصميم `NotificationService` اعتماداً على نمط الأحداث (Event-Driven Pattern / Observer Pattern).
* فصل محرك الإشعارات ليعمل عبر واجهة مجردة (`NotificationChannelProvider` Interface) تتيح بث الإشعار لعدة قنوات بحسب تفضيلات العميل:
  * In-App Notifications (المرحلة الحالية الأساسية)
  * Email Channel (التكامل مع Email Service)
  * SMS Channel (إمكانية إضافة مزود SMS مستقبلاً مثل Twilio / Unifonic)
  * Push Notifications (إمكانية إضافة Web Push / Firebase Cloud Messaging مستقبلاً)
