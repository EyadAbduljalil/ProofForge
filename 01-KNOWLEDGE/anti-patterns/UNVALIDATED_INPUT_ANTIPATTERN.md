# النمط المضاد: قبول المدخلات دون تحقق صارم (Unvalidated Input Anti-Pattern)

## المعرّف: `ANTI-UNVALIDATED-INPUT-001`
## درجة الخطورة: `HIGH`
## تصنيف CWE: `CWE-20`

---

## 1. التوصيف
معالجة طلبات المستخدمين وحمولات البيانات دون التحقق من النوع، الطول، البنية، والقيم المسموح بها، مما يفتح المجال لهجمات الحقن، تلوث النماذج الأولية (Prototype Pollution)، وتمرير حقول غير مصرح بها (Mass Assignment).

---

## 2. النمط المعيب
```javascript
// خطأ فادح: تمرير كامل req.body مباشرة إلى قاعدة البيانات
app.post('/api/user/profile', async (req, res) => {
  await db.users.update(req.user.id, req.body); // قد يمرر المهاجم { "role": "admin" }
  return res.json({ success: true });
});
```

---

## 3. النمط المصحح
```javascript
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  bio: z.string().max(500).optional()
}).strict(); // strict يمنع أي حقول إضافية غير معرفة

app.post('/api/user/profile', authenticateUser, async (req, res) => {
  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ success: false, error: parseResult.error.format() });
  }

  await db.users.update(req.user.id, parseResult.data);
  return res.json({ success: true, message: 'تم تحديث الملف الشخصي بنجاح' });
});
```
