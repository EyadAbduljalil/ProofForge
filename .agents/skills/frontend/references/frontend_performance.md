# ProofForge Frontend Performance Guidelines

1. **Chunk Budget:** No single vendor bundle should exceed 200KB uncompressed.
2. **Memoization Rule:** Use `useMemo` and `useCallback` only when calculating computationally heavy values or passing callbacks to memoized children.
3. **Lazy Loading:** Route-level components must be loaded via `React.lazy()` with a fallback loader.
