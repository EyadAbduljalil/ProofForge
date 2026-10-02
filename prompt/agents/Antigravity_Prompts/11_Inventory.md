# Inventory & Stock Control System

أنشئ نظام إدارة مخزون (Inventory Control & Management System) متقدم ودقيق لمنع Overselling وضمان سلامة البيانات في بيئة عالية التزامن.

## 1. نموذج بيانات المخزون (Inventory Data Model)
* تصميم حقول المخزون لكل منتج أو Variant في قاعدة البيانات:
  * `stockQuantity`: إجمالي الكمية الفعلية الموجودة بالمستودع.
  * `reservedQuantity`: الكمية المحجوزة لطلبات قيد الدفع أو المعالجة ولم تُشحن بعد.
  * `availableQuantity`: الكمية المتاحة للبيع والشراء فعلياً، وتُحسب بـ (`stockQuantity - reservedQuantity`).
  * `lowStockThreshold`: حد المخزون المنخفض لتنبيه المسؤولين عند الاقتراب من النفاد.
* إضافة جدول `InventoryLog` لتسجيل كل حركة على المخزون (السبب، الكمية السابقة، الكمية الجديدة، رقم الطلب، المعرف الشخصي للمنفذ).

## 2. آليات الحجز والتحرير (Stock Reservation & Release Logic)
* **حجز المخزون (Stock Reservation)**:
  * عند بدء عملية Checkout أو إنشاء طلب جديد، يتم حجز الكميات فوراً عن طريق زيادة `reservedQuantity` لفترة زمنية محددة (Temporary Hold e.g. 15 دقيقة).
  * إذا كانت `availableQuantity < requestedQuantity` يرفض السيرفر الطلب فوراً ويمنع الإضافة للسلة أو إتمام الطلب.
* **تأكيد الخصم (Stock Deduction)**:
  * عند تأكيد نجاح الدفع أو تأكيد الطلب، يتم خصم الكمية المحجوزة نهائياً من `stockQuantity` وخفض `reservedQuantity` بالمثل.
* **تحرير المخزون (Stock Release)**:
  * في حالات إلغاء الطلب، فشل الدفع، أو انتهاء مهلة الدفع (Checkout Timeout)، تُخصم الكمية المحجوزة من `reservedQuantity` لتعود مجهزة ومتاحة لعملاء آخرين تلقائياً.

## 3. التعامل مع الطلبات المتزامنة والـConcurrency Safe Transactions
* **منع البيع الزائد (Preventing Overselling)**:
  * الاعتماد الكامل على Database Transactions بدعم القفل المشروط أو الذري (Atomic Operations / Pessimistic Row Locking `SELECT ... FOR UPDATE` أو Optimistic Concurrency Control مع `version` Column).
  * يجب تنفيذ الاستعلام بحيث يتم التحقق والحجز في خطوة داتابيز واحدة غير قابلة للتجزئة:
    ```sql
    UPDATE products 
    SET reserved_quantity = reserved_quantity + :qty 
    WHERE id = :id AND (stock_quantity - reserved_quantity) >= :qty;
    ```
  * إذا لم تتأثر أي صفوف بالاستعلام، يُعتبر المنتج نافداً ويُلغى الحجز فوراً مع تنبيه العميل.

## 4. التحديثات والحرص والتنبيهات (Inventory Updates & Low Stock Threshold)
* **تحديثات المخزون من الـ Admin**:
  * واجهة وتكامات لـ Admin لتعديل الـ `stockQuantity` أو ضبط الـ `lowStockThreshold`.
  * كل تعديل يدوي يسجل في `InventoryLog` مع تدوين السبب (مشتريات جديدة، تلفيات، تسوية دورية).
* **التنبيه التلقائي (Low Stock Notifications)**:
  * مشغل تلقائي ينشئ إشعاراً في لوحة التحكم ويراسل المسؤول عندما تصل `availableQuantity` إلى `lowStockThreshold` أو أقل.
  * تحديث حالة المنتج تلقائياً لـ `OUT_OF_STOCK` عندما تصبح الكمية المتاحة تساوي صفر.
