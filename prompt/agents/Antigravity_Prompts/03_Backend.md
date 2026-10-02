# Backend Implementation

أنشئ Backend حقيقي للمشروع باستخدام الـArchitecture المعتمدة.

اربط Backend بـPostgreSQL عبر Prisma.

أنشئ REST API منظمة.

المسارات الأساسية:

* /api/auth
* /api/users
* /api/products
* /api/categories
* /api/cart
* /api/wishlist
* /api/orders
* /api/payments
* /api/reviews
* /api/coupons
* /api/admin

طبّق:

* controllers
* services
* repositories/data access عند الحاجة
* validation
* centralized error handling
* authentication middleware
* authorization middleware
* pagination
* filtering
* sorting
* logging

لا تضع business logic داخل controllers بشكل عشوائي.

لا تثق بأي price أو total قادم من Frontend.

كل الحسابات المالية يجب أن يعيد Backend حسابها.

أضف health check endpoint.

تأكد أن Backend يعمل بشكل مستقل ويمكن اختباره بدون Frontend.
