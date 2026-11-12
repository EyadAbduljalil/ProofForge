# ProofForge Checkout & Financial Invariants

1. **Atomic Inventory Reservation:** Reservation must expire automatically after 15 minutes if payment is not confirmed.
2. **Double-Spend Mitigation:** Payment capture state machine: `PENDING -> PROCESSING -> COMPLETED | FAILED`. Transitions must be strictly monotonic.
3. **No Plaintext Credit Card Storage:** Enforce PCI-DSS; card tokens only, never raw PAN/CVV on servers.
