# السجل المركزي لمحولات المكدس المعتمدة (Adapter Registry)

## 1. فهرس محولات المكدس القياسية في WebForge OS

| معرف المحول (Adapter ID) | التقنية | الفئة | الحالة | القواعد الكنسية المقترنة | المدققات المقترنة |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ADP-LANG-TYPESCRIPT`** | TypeScript | language | ACTIVE | `ENG-ARCH-001`, `SEC-INP-001` | `VAL-ENG-ARCH-001` |
| **`ADP-LANG-PYTHON`** | Python | language | ACTIVE | `ENG-ARCH-001`, `SEC-AUTH-001` | `VAL-SEC-AUTH-001` |
| **`ADP-FE-REACT`** | React | frontend | ACTIVE | `ENG-FE-001`, `DSN-RESP-001` | `VAL-DSN-RESP-001` |
| **`ADP-FE-VUE`** | Vue.js | frontend | ACTIVE | `ENG-FE-001`, `DSN-A11Y-001` | `VAL-DSN-A11Y-001` |
| **`ADP-BE-NODE`** | Node.js / Express | backend | ACTIVE | `ENG-BE-001`, `SEC-API-001` | `VAL-SEC-WEB-001` |
| **`ADP-BE-FASTAPI`** | FastAPI | backend | ACTIVE | `ENG-API-001`, `SEC-INP-001` | `VAL-ENG-API-001` |
| **`ADP-DB-POSTGRES`** | PostgreSQL | database | ACTIVE | `ENG-DB-001`, `SEC-INJ-001` | `VAL-SEC-INJ-001`, `VAL-ENG-DB-001` |
| **`ADP-DB-MONGO`** | MongoDB | database | ACTIVE | `ENG-DB-001`, `SEC-INJ-001` | `VAL-SEC-INJ-001` |
| **`ADP-TEST-NODE`** | Node Test Runner / Jest | testing | ACTIVE | `ENG-TEST-001`, `SEC-AUTH-001` | `VAL-SEC-AUTH-001` |
| **`ADP-DEPLOY-DOCKER`** | OCI / Container | deployment | ACTIVE | `ENG-CONF-001`, `SEC-SUPPLY-001` | `VAL-SEC-SECRETS-001` |

---

## 2. مصفوفة النزاهة والحتمية
- كافة المحولات تمتلك معرفات حتمية فريدة وغير مكررة.
- لا يجوز تسجيل محول دون ربطه صراحة بقواعد ومدققات كنسية معتمدة.
