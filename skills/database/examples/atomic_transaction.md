# Atomic Database Transaction Example

```typescript
import { db } from '../db';

export async function transferBalance(senderId: string, recipientId: string, amount: number) {
  return await db.transaction(async (tx) => {
    // 1. Lock sender row for update
    const sender = await tx.accounts.findUniqueOrThrow({
      where: { id: senderId },
      select: { balance: true }
    });

    if (sender.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // 2. Perform atomic mutations
    await tx.accounts.update({ where: { id: senderId }, data: { balance: { decrement: amount } } });
    await tx.accounts.update({ where: { id: recipientId }, data: { balance: { increment: amount } } });
    await tx.auditLogs.create({ data: { type: 'TRANSFER', senderId, recipientId, amount } });

    return { success: true };
  });
}
```
