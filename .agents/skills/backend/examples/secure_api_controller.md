# Secure API Controller Example

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const CreateSecretSchema = z.object({
  payload: z.string().min(1).max(50000),
  expiresInSeconds: z.number().int().min(60).max(604800)
});

export async function createSecretHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = CreateSecretSchema.parse(req.body);
    const result = await SecretService.createSecret({
      ...validated,
      userId: req.user!.id,
      tenantId: req.user!.tenantId
    });

    return res.status(201).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
}
```
