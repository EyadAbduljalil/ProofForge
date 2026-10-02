# Cart and Wishlist

استبدل نظام `localStorage` الحالي بنظام Cart حقيقي مرتبط بالـBackend.

نفذ:

* Add to Cart
* Remove from Cart
* Update Quantity
* Clear Cart
* Cart totals

السلة للمستخدم المسجل يجب أن تكون محفوظة في Database.

دعم Guest Cart بشكل اختياري باستخدام local storage، ثم دمجه مع Cart المستخدم عند Login.

نفذ Wishlist:

* Add product
* Remove product
* List wishlist
* Move to cart

تحقق من:

* product existence
* variant existence
* stock
* quantity

كل الأسعار يجب أن تأتي من Backend.

لا تثق بالسعر القادم من Frontend.
