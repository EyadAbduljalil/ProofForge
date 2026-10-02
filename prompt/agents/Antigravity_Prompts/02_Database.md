# Database Implementation

أنشئ PostgreSQL database باستخدام Prisma.

صمم schema كاملة لمنصة التجارة الإلكترونية.

يجب أن تدعم على الأقل:

* Users
* Addresses
* Categories
* Products
* ProductImages
* ProductVariants
* Carts
* CartItems
* Wishlists
* Orders
* OrderItems
* Payments
* Coupons
* Reviews
* Notifications

Users يجب أن تدعم:

* CUSTOMER
* ADMIN

Orders يجب أن تدعم:

* PENDING
* CONFIRMED
* PROCESSING
* SHIPPED
* OUT_FOR_DELIVERY
* DELIVERED
* CANCELLED
* RETURN_REQUESTED
* RETURNED

Payments يجب أن تدعم حالات الدفع المختلفة.

احتفظ داخل Order وOrderItem بالـsnapshots اللازمة من بيانات المنتج والعنوان حتى لا تتغير الطلبات القديمة عند تعديل المنتجات.

طبّق:

* foreign keys
* indexes
* unique constraints
* cascading rules المناسبة
* timestamps
* nullable fields عند الحاجة

أنشئ:

* Prisma schema
* migrations
* seed script

انقل بيانات المنتجات الموجودة في `products.json` إلى seed data.

لا تستخدم `products.json` كمصدر بيانات production بعد انتهاء هذه المرحلة.

أنشئ Admin user وCustomer user تجريبيين للـdevelopment فقط.
