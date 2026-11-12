# ProofForge Database Optimization & Indexing Rules

1. **Foreign Key Indexing:** Every foreign key column must have an explicit B-tree index.
2. **Compound Index Ordering:** Place equality columns first, followed by range/sort columns (`WHERE tenant_id = ? AND created_at > ?`).
3. **No Unbounded SELECT *:** Always specify projection columns to prevent memory saturation and payload bloat.
