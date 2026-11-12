# Health & Readiness Probe Example

```typescript
import { Request, Response } from 'express';
import { db } from '../db';

export async function healthzHandler(req: Request, res: Response) {
  return res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
}

export async function readyzHandler(req: Request, res: Response) {
  try {
    await db.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'READY', db: 'CONNECTED' });
  } catch (err: any) {
    return res.status(503).json({ status: 'NOT_READY', error: err.message });
  }
}
```
