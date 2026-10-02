# مواصفات واجهات برمجة التطبيقات (API Specification)

## 1. المسارات ونقاط النهاية (Endpoints)

### `POST /api/v1/orders`
- **الوصف**: إنشاء طلب جديد بعد تثبيت الأسعار والتحقق من المخزون.
- **الصلاحية المطلوبة**: مستخدم مسجل (`customer`).
- **جسم الطلب (Request Body)**:
```json
{
  "items": [
    { "productId": "prod_123", "quantity": 2 }
  ],
  "shippingAddressId": "addr_456",
  "couponCode": "DISCOUNT10"
}
```
- **الاستجابة الناجحة (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "orderId": "ord_789",
    "status": "PENDING_PAYMENT",
    "totalAmount": 19900,
    "currency": "SAR"
  }
}
```
