# Checkout

حوّل Checkout الحالي إلى Checkout حقيقي.

أنشئ flow واضح:

1. Cart Review
2. Delivery Address
3. Shipping Method
4. Payment Method
5. Order Review
6. Order Creation

العميل يستطيع:

* اختيار عنوان محفوظ
* إضافة عنوان
* تعديل عنوان
* اختيار Shipping Method
* تطبيق Coupon
* اختيار Payment Method

Backend يجب أن يعيد حساب:

* subtotal
* shipping
* discount
* tax
* total

لا تقبل totals من Frontend.

تحقق من المخزون قبل إنشاء الطلب.

اجعل إنشاء الطلب transaction-safe.

لا تستخدم Google Apps Script الحالي كحل لتسجيل الطلبات.
