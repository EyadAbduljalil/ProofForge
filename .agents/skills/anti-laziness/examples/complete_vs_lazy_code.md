# Complete vs Lazy Code Examples

## 1. Authentication Middleware

### ❌ Lazy Implementation (BANNED)
```typescript
export function authenticate(req, res, next) {
  // TODO: Add JWT verification logic here
  // For now, allow test user
  req.user = { id: 'test-user', role: 'admin' };
  next();
}
```

### ✅ Complete Implementation (ProofForge Standard)
```typescript
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  role: string;
}

export function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'proofforge.auth'
    }) as AuthenticatedUser;

    req.user = payload;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```
