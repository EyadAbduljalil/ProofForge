# ProofForge Anti-Laziness & Zero-Truncation Engineering Charter

## 1. Absolute Prohibition of Artificial Laziness
Under no circumstances may an agent or engineer commit:
1. `// TODO: implement later` or unimplemented stubs.
2. Artificial mock data where production contracts or database models are required.
3. Silent exception swallows (`catch (e) {}`).
4. Truncated sample datasets (`[item1, ... 98 more items]`).

## 2. Evidence Contract Requirements
- Every implementation must be end-to-end executable.
- Verifications must run against the physical file tree.
- Failure to provide complete code triggers automatic verification failure.
