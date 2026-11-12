# Secure Checkout & Webhook Handler Example

```typescript
import crypto from 'node:crypto';
import { Request, Response } from 'express';

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Timing-safe signature check
  try {
    const event = StripeService.constructEvent(req.body, sig, webhookSecret);
    if (event.type === 'payment_intent.succeeded') {
      await OrderService.fulfillOrder(event.data.object.id);
    }
    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
```
