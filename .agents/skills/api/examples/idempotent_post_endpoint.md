# Idempotent Mutation Endpoint Example

```typescript
import { Request, Response } from 'express';

export async function processPaymentEndpoint(req: Request, res: Response) {
  const idempotencyKey = req.headers['idempotency-key'] as string;
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing required Idempotency-Key header' });
  }

  const cached = await CacheService.get(`idempotency:${idempotencyKey}`);
  if (cached) {
    return res.status(cached.status).json(cached.body);
  }

  const result = await PaymentService.charge(req.body);
  const responsePayload = { success: true, transactionId: result.id };
  await CacheService.set(`idempotency:${idempotencyKey}`, { status: 200, body: responsePayload }, 86400);

  return res.status(200).json(responsePayload);
}
```
