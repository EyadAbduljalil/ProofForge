# ProofForge Form Validation Standards

1. **Trim Whitespace:** String inputs must be automatically trimmed before validation.
2. **Sanitize Emails & URLs:** Normalize emails to lowercase; validate URL protocols strictly (`https:` only).
3. **No Uncontrolled Inputs:** Form state must be fully managed with initial deterministic defaults.
