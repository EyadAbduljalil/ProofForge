# السجل المركزي للقوالب والمخططات المعمارية (Template Registry)

## 1. فهرس القوالب والمخططات القياسية في WebForge OS

| المعرف (ID) | الاسم | النطاق | النوع | الحالة | القواعد الكنسية المقترنة | محولات المكدس المقترنة |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`TPL-DOM-ECOMMERCE`** | قالب متجر التجارة الإلكترونية | ecommerce | Template | ACTIVE | `SEC-AUTHZ-001`, `ENG-TRANS-001` | `ADP-FE-REACT`, `ADP-BE-NODE`, `ADP-DB-POSTGRES` |
| **`TPL-DOM-LMS`** | قالب منصة إدارة التعلم | lms | Template | ACTIVE | `SEC-AUTH-001`, `ENG-FE-001` | `ADP-FE-VUE`, `ADP-BE-FASTAPI` |
| **`TPL-DOM-SAAS`** | قالب منصة الخدمات السحابية | saas | Template | ACTIVE | `SEC-DATA-001`, `ENG-DB-001` | `ADP-BE-NODE`, `ADP-DB-POSTGRES` |
| **`TPL-DOM-AUTH`** | قالب منظومة التوثيق والهوية | auth_service | Template | ACTIVE | `SEC-AUTH-001`, `SEC-SESS-001` | `ADP-LANG-TYPESCRIPT`, `ADP-BE-NODE` |
| **`TPL-DOM-DASHBOARD`** | قالب لوحة التحكم والإدارة | admin_dashboard | Template | ACTIVE | `SEC-AUTHZ-001`, `DSN-RESP-001` | `ADP-FE-REACT`, `ADP-FE-VUE` |
| **`BLP-DOM-ECOMMERCE`** | مخطط معمارية التجارة الإلكترونية | ecommerce | Blueprint | ACTIVE | `ENG-ARCH-001`, `SEC-INJ-001` | `ADP-DB-POSTGRES`, `ADP-DEPLOY-DOCKER` |
| **`BLP-DOM-SAAS`** | مخطط معمارية تعدد المستأجرين | saas | Blueprint | ACTIVE | `ENG-ARCH-001`, `SEC-DATA-001` | `ADP-DB-POSTGRES`, `ADP-BE-NODE` |
| **`BLP-DOM-API`** | مخطط بوابة واجهات البرمجة | api_gateway | Blueprint | ACTIVE | `ENG-API-001`, `SEC-API-001` | `ADP-BE-FASTAPI`, `ADP-BE-NODE` |

---

## 2. النزاهة والتتبع المزدوج
- كافة القوالب والمخططات مرتبطة بقواعد كنسية ومحولات مكدس ومدققات معيارية.
- لا توجد أي قوالب أو مخططات يتيمة بدون تتبع حتمي.
