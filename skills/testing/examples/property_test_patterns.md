# Property-Based & Invariant Test Examples

## 1. Idempotency Key Invariant Test
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Idempotent Operation Invariant: replay of key must return identical result without re-executing', async () => {
  const idempotencyKey = 'test-key-' + Date.now();
  
  // First invocation
  const res1 = await processPayment({ key: idempotencyKey, amount: 100 });
  assert.equal(res1.status, 'SUCCESS');
  assert.equal(res1.replayed, false);

  // Immediate concurrent re-invocation with same key
  const res2 = await processPayment({ key: idempotencyKey, amount: 100 });
  assert.equal(res2.status, 'SUCCESS');
  assert.equal(res2.replayed, true);
  assert.equal(res1.transactionId, res2.transactionId);
});
```
