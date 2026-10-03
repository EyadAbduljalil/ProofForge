# نمط العمليات المتكررة الآمنة (Idempotent Operation Pattern)

## المعرّف: `PAT-IDEMPOTENT-OP-001`
## الحالة: `ACTIVE`
## النطاق: واجهات الدفع، معالجة الطلبات، وتنفيذ الأوامر الحرجة

---

## 1. التوصيف المعماري
نمط يضمن أن تنفيذ عملية معينة عدة مرات ينتج عنه نفس النتيجة دون أي آثار جانبية غير مقصودة (مثل الخصم المزدوج أو إنشاء موارد مكررة)، باستخدام مفتاح فريد للعملية (`Idempotency-Key`).

---

## 2. آلية العمل (Mechanism)
1. يرسل العميل ترويسة `Idempotency-Key: <unique-uuid>`.
2. يتحقق الخادم من وجود المفتاح في مخزن العمليات:
   - **إذا وُجد والمهمة منتهية**: يُرجع الخادم الاستجابة المخزنة فوراً مع كود الحالة الأصلي.
   - **إذا وُجد والمهمة قيد التنفيذ**: يُرجع `409 Conflict` أو `425 Too Early` لمنع التزامن المزدوج (Race Condition).
   - **إذا لم يوجد**: يُسجل المفتاح كـ `IN_PROGRESS`، ينفذ العملية، يخزن النتيجة، ثم يُرجع الاستجابة.

---

## 3. نموذج التطبيق البرمجي
```javascript
export async function handleIdempotentRequest(key, handler, storage) {
  if (!key) {
    return await handler();
  }

  const existing = await storage.get(key);
  if (existing) {
    if (existing.status === 'COMPLETED') {
      return { cached: true, ...existing.response };
    }
    if (existing.status === 'PROCESSING') {
      throw new Error('OPERATION_IN_PROGRESS');
    }
  }

  await storage.set(key, { status: 'PROCESSING', createdAt: Date.now() });
  try {
    const response = await handler();
    await storage.set(key, { status: 'COMPLETED', response, completedAt: Date.now() });
    return response;
  } catch (error) {
    await storage.delete(key);
    throw error;
  }
}
```
