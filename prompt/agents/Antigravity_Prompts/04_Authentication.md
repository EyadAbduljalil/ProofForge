# Authentication

نفذ نظام Authentication حقيقي.

الوظائف:

* Register
* Login
* Logout
* Get Current User
* Update Profile
* Change Password
* Forgot Password
* Reset Password

بيانات التسجيل:

* name
* email
* phone
* password

طبّق:

* secure password hashing
* email validation
* password validation
* duplicate account handling
* secure authentication tokens/session
* refresh strategy إذا كانت architecture تحتاجها
* rate limiting
* authorization

أنشئ Role Based Access Control.

CUSTOMER لا يستطيع الوصول إلى Admin APIs.

ADMIN يستطيع إدارة النظام.

لا تعتمد على Frontend لحماية Admin routes.

لا تُرجع passwordHash أو secrets في أي API response.
