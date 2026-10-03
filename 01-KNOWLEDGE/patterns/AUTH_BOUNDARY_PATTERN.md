# نمط الحدود الأمنية للمصادقة والتفويض (Auth Boundary Pattern)

## المعرّف: `PAT-AUTH-BOUNDARY-001`
## الحالة: `ACTIVE`
## النطاق: طبقة التوجيه، حراس المسارات (Route Guards)، ومتحكمات واجهات التطبيق

---

## 1. التوصيف المعماري
نمط تصميمي يضمن إنشاء حاجز أمني معزول ومحكم عند نقطة دخول أي طلب برمجي (HTTP / RPC / WebSocket)، بحيث يتم التحقق الصارم من صحة الهوية (Authentication)، سريان الجلسة، وصلاحيات الوصول (Authorization) قبل وصول الطلب إلى منطق العمليات الداخلي (Business Logic).

---

## 2. مخطط التدفق الأمني (Security Flow)
```
[ Incoming Request ]
        │
        ▼
[ 1. Token / Session Extraction ] ── (Invalid/Missing) ──► [ 401 Unauthorized ]
        │ (Valid)
        ▼
[ 2. Identity Verification & Claims ] ── (Expired/Tampered) ──► [ 401 Unauthorized ]
        │ (Active & Valid)
        ▼
[ 3. Resource Ownership / RBAC ] ── (Insufficient Privileges) ──► [ 403 Forbidden ]
        │ (Authorized)
        ▼
[ 4. Input Sanitization & Execution ]
        │
        ▼
[ 5. Business Logic Handler ]
```

---

## 3. التطبيق البرمجي النموذجي (Implementation Example)
```javascript
// middleware/authBoundary.js
import { verifyJwtToken } from '../security/token-manager.js';
import { checkOwnership } from '../security/ownership-guard.js';

export function createAuthBoundary({ requiredRole, resourceParam } = {}) {
  return async function authBoundaryMiddleware(req, res, next) {
    // 1. استخراج التوكن من ترويسة Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'مطلوب مصادقة صالحة' } });
    }

    const token = authHeader.slice(7);
    const authResult = verifyJwtToken(token);
    if (!authResult.valid) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'رمز المصادقة غير صالح أو منتهي الصلاحية' } });
    }

    req.user = authResult.payload;

    // 2. فحص الصلاحية الرأسية (RBAC)
    if (requiredRole && req.user.role !== requiredRole && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'ليس لديك الصلاحية لتنفيذ هذا الإجراء' } });
    }

    // 3. فحص ملكية المورد لمنع IDOR (Horizontal Privilege Escalation)
    if (resourceParam && req.params[resourceParam]) {
      const resourceId = req.params[resourceParam];
      const isOwner = await checkOwnership(req.user.id, resourceId);
      if (!isOwner) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'لا تملك حق الوصول لهذا المورد' } });
      }
    }

    return next();
  };
}
```

---

## 4. المزايا الأمنية
- حصر منطق الأمان في طبقة وسيطة موحدة ومختبرة بدقة.
- منع التسرب العرضي للمسارات غير المحمية.
- إتاحة سجل تدقيق موحد لكافة محاولات الوصول المرفوضة والمقبولة.
