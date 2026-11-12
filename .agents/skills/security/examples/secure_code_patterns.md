# Secure Code Patterns vs Anti-Patterns

## 1. Ownership & Anti-IDOR Enforcement

### ❌ Insecure (IDOR Vulnerability)
```typescript
// Route handler trusting client-supplied ID
app.get('/api/documents/:id', async (req, res) => {
  const doc = await db.documents.findOne({ id: req.params.id });
  if (!doc) return res.status(404).send('Not found');
  res.json(doc);
});
```

### ✅ Secure (ProofForge Standard)
```typescript
// Route handler enforcing tenant isolation and ownership guard
app.get('/api/documents/:id', authenticateToken, async (req, res) => {
  const doc = await db.documents.findOne({
    id: req.params.id,
    tenantId: req.user.tenantId,
    userId: req.user.id
  });
  if (!doc) {
    // Default-deny: do not leak existence of other users' records
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(doc);
});
```

---

## 2. Timing-Safe Token & Webhook Verification

### ❌ Insecure (Timing Attack Vulnerable)
```javascript
if (receivedSignature === expectedSignature) {
  processWebhook(payload);
}
```

### ✅ Secure (Constant-Time Comparison)
```javascript
import crypto from 'node:crypto';

function verifyWebhook(payload, signatureHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const bufReceived = Buffer.from(signatureHeader, 'hex');
  const bufExpected = Buffer.from(expected, 'hex');

  if (bufReceived.length !== bufExpected.length || !crypto.timingSafeEqual(bufReceived, bufExpected)) {
    throw new Error('Invalid signature');
  }
  return true;
}
```
