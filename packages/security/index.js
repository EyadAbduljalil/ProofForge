// حزمة الأمان المركزية الموسعة لنظام WebForge OS
module.exports = {
    TokenManager: require('./token-manager'),
    CookieSecurity: require('./cookie-security'),
    IdempotencyEngine: require('./idempotency-middleware'),
    OwnershipGuard: require('./ownership-guard'),
    AuthorizationMatrix: require('./authorization'),
    PasswordSecurity: require('./password'),
    CSRFProtection: require('./csrf'),
    CSPGenerator: require('./csp-headers'),
    RateLimiter: require('./rate-limit'),
    SecretsGuard: require('./secrets'),
    SSRFGuard: require('./ssrf-guard'),
    FileSecurityGuard: require('./file-security'),
    AISecurityGuard: require('./ai-security-guard'),
    WebhookVerifier: require('./webhook-verifier'),
    GraphQLSecurityGuard: require('./graphql-security'),
    InputSecurityGuard: require('./input-security'),
    AgentPermissionBoundary: require('./agent-permission-boundary'),
    UntrustedRepoGuard: require('./untrusted-repo-guard'),
    SafeRepairEngine: require('./safe-repair-engine')
};
