# النمط المضاد: آليات التفويض غير الآمنة (Insecure Authorization Anti-Pattern)

## المعرّف: `ANTI-INSECURE-AUTHZ-001`
## درجة الخطورة: `CRITICAL`
## تصنيف CWE: `CWE-285`, `CWE-639`

---

## 1. التوصيف
الاعتماد على افتراض أن مصادقة المستخدم (Authentication) تعني تلقائياً امتلاكه حق الوصول للمورد المطلوب، أو الاعتماد على معرّفات الموارد المرسلة من العميل دون التحقق من ملكيتها الفعلية في قاعدة البيانات، مما يؤدي إلى ثغرات IDOR وتجاوز الصلاحيات الأفقي والرأسي.

---

## 2. النمط المعيب (Vulnerable Code Example)
```javascript
// كارثة أمنية: الوثوق بمعرّف المستخدم الممرر في الرابط مباشرة
app.get('/api/documents/:docId', async (req, res) => {
  // يتم استرجاع المستند دون التحقق مما إذا كان المستخدم المصادق يملكه
  const document = await db.documents.findById(req.params.docId);
  return res.json(document);
});
```

---

## 3. النمط الآمن المصحح (Remediated Pattern)
```javascript
app.get('/api/documents/:docId', authenticateUser, async (req, res) => {
  const document = await db.documents.findOne({
    where: {
      id: req.params.docId,
      ownerId: req.user.id // فرض ملكية المورد حتمياً
    }
  });

  if (!document) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'المستند غير موجود' } });
  }

  return res.json({ success: true, data: document });
});
```
