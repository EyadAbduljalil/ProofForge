# Full-Stack Feature Lifecycle Example

```javascript
// 1. Client Action (apps/web/app.js)
async function submitOrder(productId, quantity, idempotencyKey) {
    const res = await fetch('/api/v1/orders/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({ productId, quantity })
    });
    return await res.json();
}

// 2. Server Handler (apps/server/server.js)
if (reqPath === '/api/v1/orders/checkout' && method === 'POST') {
    const user = this._authenticate(req);
    const idempKey = req.headers['idempotency-key'];
    
    // Idempotency cache check
    const cached = await this.cache.get(`idemp:${idempKey}`);
    if (cached) return res.end(cached);

    // Atomic transaction
    const order = await this.storage.transaction(async (tx) => {
        const prod = (await tx.query('products', { id: body.productId }))[0];
        if (prod.stock_quantity < body.quantity) throw AppError.badRequest('Insufficient stock');
        await tx.update('products', prod.id, { stock_quantity: prod.stock_quantity - body.quantity });
        return await tx.insert('orders', { user_id: user.id, total_cents: prod.price_cents * body.quantity });
    });

    const response = JSON.stringify(ApiResponse.success({ order }));
    await this.cache.set(`idemp:${idempKey}`, response, 300);
    return res.end(response);
}
```
