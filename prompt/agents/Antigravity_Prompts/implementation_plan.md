# خطة تنفيذ: مركز إشعارات النظام الإداري

## ملخص

تحويل صفحة الإشعارات من جدول ثابت إلى مركز إشعارات تشغيلي حقيقي مدعوم بقاعدة البيانات.

## الوضع الحالي

| المكون | الوضع |
|--------|--------|
| `Notification` model | موجود لكن للعملاء فقط - بسيط جداً |
| `getAdminNotifications` | يجلب إشعارات العملاء - غير مناسب |
| `createNotification` | broadcast للعملاء فقط |
| UI notifications tab | جدول بسيط ثابت |
| Notification bell | غير مربوط ببيانات حقيقية |
| `lowStockThreshold` | موجود في Product model = 5 |
| Payment review | لا يوجد حقل `requiresReview` |

## التغييرات المطلوبة

### 1. Prisma Schema (إضافة نموذج AdminNotification)
- `AdminNotification` model جديد منفصل عن `Notification` (إشعارات العملاء)
- الحقول: `id, type, category, priority, title, message, status, isRead, readAt, entityType, entityId, entityName, actionUrl, dedupKey, createdAt, updatedAt`
- إضافة `requiresReview` field لـ `Payment` model
- فهارس على: `category, priority, status, isRead, createdAt, dedupKey`

### 2. Backend Services
- `adminNotificationService.ts` جديد:
  - `createNotification()` مع deduplication عبر `dedupKey`
  - `generateInventoryNotifications()` - فحص المنتجات منخفضة المخزون
  - `generateOrderNotifications()` - فحص الطلبات المعلقة
  - `generatePaymentReviewNotifications()` - فحص Payment.amount !== Order.totalAmount
  - `generateCouponNotifications()` - كوبونات منتهية الصلاحية أو وصلت الحد
  - `markAsRead()`, `markAllRead()`

### 3. Backend Controller (adminController.ts)
- `getAdminSystemNotifications` - جلب مع pagination, filters, search
- `getAdminNotificationStats` - إحصائيات (total, unread, actionRequired, critical)
- `markAdminNotificationRead` - تحديد كمقروء
- `markAllAdminNotificationsRead` - تحديد الكل
- `triggerNotificationScan` - فحص يدوي (للاختبار)

### 4. Backend Routes
- `GET /api/admin/system-notifications`
- `GET /api/admin/system-notifications/stats`
- `PATCH /api/admin/system-notifications/:id/read`
- `PATCH /api/admin/system-notifications/read-all`
- `POST /api/admin/system-notifications/scan`

### 5. Backend Server (server.ts)
- إضافة scheduled job يفحص كل 5 دقائق: مخزون + طلبات + مدفوعات + كوبونات

### 6. Frontend (AdminDashboardPage.tsx)
- إعادة بناء notifications tab بالكامل
- Summary cards (total, unread, actionRequired, critical)
- Filter bar (category, priority, status, search)
- Notification feed list (ليس جدول)
- Detail drawer عند الضغط على إشعار
- Mark as read / mark all read
- Pagination حقيقي
- Loading/error/empty states
- ربط جرس الإشعارات بـ unread count

## منطق Payment Review
الحالة الوحيدة التي تستدعي إشعار "مبلغ يحتاج مراجعة":
- `payment.amount !== order.totalAmount` (عدم تطابق المبلغ)
- أو `payment.requiresReview === true` (علم يدوي)

لن يتم إنشاء إشعار لكل دفعة ناجحة أو فاشلة.

## استراتيجية Deduplication
كل إشعار له `dedupKey` فريد:
- مخزون منخفض: `LOW_STOCK_{productId}`
- نفاد المخزون: `OUT_OF_STOCK_{productId}`
- طلب معلق: `PENDING_ORDER_{orderId}`
- مراجعة دفع: `PAYMENT_REVIEW_{orderId}`
- كوبون منتهٍ: `COUPON_EXPIRED_{couponId}`

لن يُنشأ إشعار جديد إذا كان الـ dedupKey موجوداً بحالة غير مقروءة/غير محلولة.
