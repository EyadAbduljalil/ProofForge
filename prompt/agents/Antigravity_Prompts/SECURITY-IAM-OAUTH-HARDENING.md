MASTER SECURITY PROMPT
COMPLETE IAM + AUTHENTICATION + AUTHORIZATION + API SECURITY + MFA + JWT + REFRESH TOKENS + SESSION MANAGEMENT + AUDIT LOGGING + ENCRYPTION + OWASP TOP 10:2025 HARDENING

You are working on an existing production-style Arabic ecommerce platform.

Technology stack:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- React
- REST API
- JWT
- HttpOnly cookies
- Customer accounts
- Admin accounts
- SUPER_ADMIN
- ADMIN
- RBAC
- Orders
- Payments
- Refunds
- Returns
- Products
- Inventory
- Coupons
- Reviews
- Notifications
- Store management
- Audit logs

Your task is to perform a COMPLETE FORENSIC SECURITY AUDIT and then IMPLEMENT, HARDEN, TEST, and VERIFY a production-grade application security architecture.

This is NOT a cosmetic security task.

This is NOT a request to simply install security packages.

Do not assume that existing authentication, JWT, RBAC, middleware, or audit logs are secure simply because they already exist.

Inspect the actual implementation.

Trace real requests through:

Frontend
→ API
→ Authentication
→ Authorization
→ Business Logic
→ Database
→ Response

Then harden every security boundary.

==================================================
0. NON-NEGOTIABLE SECURITY PRINCIPLE
==================================================

The backend is the final authority.

Never trust:

- frontend state
- hidden form fields
- route parameters
- customerId supplied by client
- role supplied by client
- permission supplied by client
- price supplied by client
- discount supplied by client
- payment status supplied by client
- order status supplied by client
- inventory quantity supplied by client
- JWT claims without validation
- success URLs
- redirect parameters
- browser local state

All security-sensitive decisions MUST be enforced server-side.

Default security posture:

DENY BY DEFAULT.

Allow only when all required security and business conditions are satisfied.

Fail closed.

Never fail open.

==================================================
1. SECURITY FORENSIC AUDIT — BEFORE CHANGING CODE
==================================================

First inspect the entire repository.

Do NOT immediately modify code.

Inventory:

- authentication
- authorization
- JWT implementation
- refresh tokens
- sessions
- cookies
- password hashing
- registration
- login
- logout
- password reset
- email verification
- phone verification
- MFA
- OAuth/OIDC
- RBAC
- permissions
- middleware
- API routes
- controllers
- services
- repositories
- Prisma schema
- database constraints
- audit logs
- security logs
- notifications
- rate limiting
- CORS
- CSRF
- security headers
- validation
- sanitization
- error handling
- file uploads
- media
- payment endpoints
- webhook endpoints
- admin endpoints
- customer endpoints
- secrets
- environment variables
- dependency versions
- scripts
- deployment configuration
- Docker configuration
- CI/CD
- tests

Search for:

- hardcoded secrets
- passwords
- API keys
- JWT secrets
- encryption keys
- credentials
- mock authentication
- bypasses
- debug endpoints
- test accounts
- hardcoded admin users
- hardcoded roles
- hardcoded permissions
- insecure defaults
- TODO security bypasses
- commented-out security checks
- duplicate auth systems
- duplicate RBAC systems
- duplicate session systems
- client-side authorization
- unsafe database queries
- raw SQL
- dynamic SQL
- unsafe redirects
- unsafe file handling
- unsafe error responses

Do NOT create a second authentication system if one already exists.

Do NOT create duplicate RBAC.

Do NOT create duplicate session management.

Consolidate the existing architecture whenever possible.

==================================================
2. SECURITY THREAT MODEL
==================================================

Create a concise threat model before implementation.

Identify threats against:

CUSTOMERS

- account takeover
- credential stuffing
- brute force
- session theft
- IDOR
- unauthorized order access
- unauthorized address access
- coupon abuse
- review abuse
- wishlist abuse
- password reset abuse

ADMINS

- privilege escalation
- account takeover
- role manipulation
- permission escalation
- session hijacking
- MFA bypass
- unauthorized sensitive actions
- malicious insiders

PAYMENTS

- price manipulation
- currency manipulation
- payment status manipulation
- fake success
- fake webhook
- replay
- duplicate processing
- refund abuse
- authorization bypass

ORDERS

- unauthorized access
- state manipulation
- price manipulation
- quantity manipulation
- inventory manipulation
- coupon manipulation
- race conditions

API

- IDOR
- injection
- brute force
- rate abuse
- mass assignment
- parameter pollution
- malformed requests
- excessive payloads
- unauthorized endpoint access

DATABASE

- SQL injection
- unsafe queries
- privilege escalation
- sensitive data exposure
- destructive operations

FILES

- malicious uploads
- executable uploads
- MIME spoofing
- path traversal
- oversized files
- unauthorized media access

==================================================
3. IAM — IDENTITY AND ACCESS MANAGEMENT
==================================================

Implement or harden a centralized Identity and Access Management model.

Identity types:

- CUSTOMER
- ADMIN
- SUPER_ADMIN

Do not mix identity with authorization.

Identity answers:

"Who is this?"

Authorization answers:

"What is this identity allowed to do?"

Each user must have a secure lifecycle.

Account states:

- ACTIVE
- DISABLED
- SUSPENDED
- PENDING_VERIFICATION where applicable

Every authentication request must validate account status.

Disabled or suspended accounts MUST NOT authenticate or use previously issued sessions according to the configured invalidation policy.

==================================================
4. CUSTOMER IDENTITY
==================================================

Customer identity must be based on the authenticated server-side identity.

Never trust:

customerId

from frontend requests.

Example:

GET /api/orders/:orderId

The backend must determine:

authenticatedUser.id

Then verify:

order.customerId === authenticatedUser.id

before returning the order.

Apply this principle to:

- orders
- addresses
- wishlist
- reviews
- notifications
- returns
- exchanges
- profile
- coupons
- customer documents
- saved payment-related records
- any private customer resource

Protect against IDOR/BOLA.

==================================================
5. ADMIN IDENTITY
==================================================

Admins must use the same centralized authentication architecture.

Do NOT create a separate insecure admin authentication mechanism.

Admin authentication must additionally enforce:

- account status
- role
- permissions
- MFA policy
- session validity
- security policy
- sensitive-action authorization

==================================================
6. AUTHENTICATION
==================================================

Implement secure:

- registration
- login
- logout
- password change
- forgot password
- reset password
- email verification
- phone verification if existing
- session invalidation
- account lock/protection where appropriate

Registration must NOT expose whether an email/account already exists when doing so could enable account enumeration.

Use generic authentication failure responses.

Example:

"بيانات الدخول غير صحيحة."

Do not reveal:

- email exists
- account does not exist
- password is incorrect
- account belongs to another role

unless the business/security model explicitly requires it.

==================================================
7. PASSWORD SECURITY
==================================================

Never store plaintext passwords.

Never encrypt passwords for reversible decryption.

Use a strong adaptive password hashing algorithm supported by the project/security environment, preferably:

Argon2id

or another OWASP-appropriate adaptive password hashing mechanism.

Never use:

- MD5
- SHA1
- plain SHA256
- reversible encryption
- plaintext

Passwords must never appear in:

- logs
- audit logs
- API responses
- database exports
- error messages
- analytics
- frontend state

Implement password policy based on modern security principles.

Do not create absurd complexity requirements that encourage unsafe password reuse.

==================================================
8. JWT AUTHENTICATION
==================================================

If JWT is the existing authentication architecture, harden it rather than replacing it unnecessarily.

Access JWT must be:

- short-lived
- signed
- integrity protected
- audience validated
- issuer validated
- expiration validated
- not trusted solely because signature is valid

Validate claims such as:

- iss
- aud
- sub
- exp
- iat
- nbf where applicable
- jti where applicable
- scope/role only when appropriate

Do not put sensitive personal data inside JWT payloads.

Do not store:

- passwords
- payment data
- secrets
- unnecessary PII

inside JWT.

Never accept an arbitrary algorithm from the token header.

Pin accepted signing algorithms server-side.

Reject malformed, expired, wrong-audience, wrong-issuer, or otherwise invalid tokens.

==================================================
9. JWT STORAGE
==================================================

Prefer secure HttpOnly cookies according to the existing architecture.

Use appropriate cookie flags:

- HttpOnly
- Secure in production
- SameSite according to actual cross-site architecture
- appropriate Path
- appropriate Domain only when necessary

Never expose long-lived authentication tokens to JavaScript unnecessarily.

Do not store sensitive long-lived tokens in:

- localStorage
- sessionStorage
- URL parameters
- query strings

==================================================
10. REFRESH TOKENS
==================================================

Implement a real refresh-token lifecycle.

Refresh tokens must NOT simply be permanent JWTs.

Implement:

- expiration
- secure storage
- rotation
- revocation
- reuse detection where appropriate
- session association
- device/session metadata where appropriate
- logout invalidation
- password-change invalidation policy
- account disable invalidation
- security-event invalidation

Prefer opaque random refresh tokens stored server-side as hashes or an equivalent secure design.

If JWT refresh tokens are retained for architectural reasons, implement appropriate rotation and revocation mechanisms.

Never log refresh tokens.

Never return refresh tokens in normal JSON responses if the architecture uses secure cookies.

==================================================
11. SESSION MANAGEMENT
==================================================

Implement centralized session management.

Track sessions where appropriate:

- session ID
- user ID
- role
- createdAt
- lastUsedAt
- expiresAt
- revokedAt
- IP metadata where justified
- user-agent/device metadata where justified
- MFA state where relevant

Security requirements:

- session invalidation on logout
- expiration
- idle timeout where appropriate
- absolute timeout where appropriate
- invalidation after critical credential changes
- invalidation after account disable/suspension
- protection against session fixation
- secure session identifiers
- no session identifiers in URLs

Provide appropriate session management for customers and stronger policies for admins.

==================================================
12. RBAC
==================================================

Implement centralized RBAC.

Primary roles:

SUPER_ADMIN
ADMIN
CUSTOMER

Permissions must be granular.

Example:

orders.view
orders.update
orders.cancel
orders.export

products.view
products.create
products.update
products.delete
products.publish

customers.view
customers.update
customers.disable

payments.view
payments.review
payments.refund
payments.reconcile

returns.view
returns.review
returns.approve
returns.reject

coupons.view
coupons.create
coupons.update
coupons.delete

settings.view
settings.update

admins.view
admins.create
admins.update
admins.disable
admins.permissions

audit_logs.view
security.view

==================================================
13. SUPER ADMIN SECURITY
==================================================

SUPER_ADMIN must have the highest authority.

But implement safety protections.

A normal ADMIN must never be able to:

- create SUPER_ADMIN
- promote itself
- change its own role
- grant itself permissions
- modify SUPER_ADMIN permissions
- disable the last active SUPER_ADMIN
- delete the last active SUPER_ADMIN

Protect last-super-admin logic server-side and with database/business constraints where practical.

Sensitive permission changes require:

- explicit authorization
- validation
- audit logging
- before/after snapshot
- actor identity

==================================================
14. AUTHORIZATION PIPELINE
==================================================

Every protected endpoint must follow the correct sequence:

Request
↓
Transport/security validation
↓
Authentication
↓
Account status
↓
Session validation
↓
MFA state where required
↓
Role
↓
Permission
↓
Resource ownership
↓
Business rules
↓
Transaction/concurrency checks
↓
Allow
OR
↓
Deny

Never skip authorization because the route is "internal".

Never rely on frontend route protection.

Frontend authorization is UX only.

Backend authorization is security.

==================================================
15. RESOURCE OWNERSHIP
==================================================

Every customer-owned resource must enforce ownership.

Examples:

Customer A must NOT access:

Customer B's:

- orders
- addresses
- notifications
- reviews
- wishlist
- return requests
- profile
- private coupons
- private documents

Test direct URL manipulation and API parameter manipulation.

Example:

Customer A:

GET /api/orders/B_ORDER_ID

must fail.

Do not rely on obscurity of IDs.

==================================================
16. MFA
==================================================

Implement MFA for administrative accounts.

Prefer a standards-based authenticator application approach such as TOTP where appropriate.

Support:

- enrollment
- verification
- recovery codes
- enable
- disable
- re-verification
- MFA challenge
- secure recovery flow

Recovery codes must:

- be cryptographically random
- be single-use
- be stored securely
- never appear in logs

Do not allow MFA disablement without sufficient authentication/reauthentication.

For SUPER_ADMIN and highly privileged ADMIN accounts, MFA should be enforceable by policy.

Customer MFA may be optional unless the existing business model requires mandatory MFA.

==================================================
17. MFA BYPASS PROTECTION
==================================================

No endpoint may bypass MFA simply because:

- the user knows the password
- the request comes from frontend
- a special URL is used
- a role is present
- a query parameter is supplied

Sensitive admin operations must verify the appropriate authentication assurance level.

==================================================
18. OAUTH2 / OPENID CONNECT READINESS
==================================================

Do NOT create a fake OAuth2 implementation.

Do NOT invent an OAuth authorization server merely to satisfy a checklist.

If the application does not currently require external identity providers, keep the authentication architecture internally coherent.

However:

- structure identity boundaries cleanly
- keep external identity provider integration possible
- do not hard-code authentication assumptions that prevent future OAuth2/OIDC integration
- if OAuth2/OIDC already exists, audit it fully

If implementing OAuth2/OIDC:

- validate issuer
- validate audience
- validate redirect URIs
- use exact redirect URI matching
- use state
- use PKCE for appropriate clients
- protect authorization codes
- validate ID token issuer/audience/signature/nonce where applicable
- never trust frontend identity claims

Do not confuse OAuth2 authorization with user authentication.

==================================================
19. SECURE REST API
==================================================

Every non-public endpoint must enforce authentication and authorization.

Implement:

- request validation
- schema validation
- strict content types
- request size limits
- rate limiting
- authentication
- authorization
- ownership
- safe errors
- consistent responses

Never expose stack traces in production.

Never expose:

- database errors
- Prisma internals
- SQL
- filesystem paths
- environment variables
- secrets
- JWT secrets
- internal architecture details

==================================================
20. INPUT VALIDATION
==================================================

Validate every external input.

Including:

- body
- query
- params
- headers where relevant
- file metadata
- uploaded content
- webhook payloads

Use explicit schemas.

Reject unexpected fields where appropriate.

Protect against mass assignment.

Do not blindly spread request bodies into database update objects.

BAD:

const update = { ...req.body };

GOOD:

Explicitly select allowed fields.

==================================================
21. INJECTION PROTECTION
==================================================

Protect against:

- SQL injection
- NoSQL injection where applicable
- command injection
- XSS
- template injection
- LDAP injection if applicable
- header injection
- log injection

Use Prisma safely.

Avoid raw SQL unless necessary.

If raw SQL exists:

- audit it
- parameterize it
- test it
- justify its use

Never concatenate untrusted input into SQL.

==================================================
22. XSS
==================================================

Audit all places where user-controlled content is rendered.

Especially:

- reviews
- names
- addresses
- product content
- admin-entered content
- store pages
- announcements
- FAQ
- coupon text
- notifications

Do not render arbitrary HTML from users.

Sanitize only where HTML is explicitly required.

Prefer plain text where possible.

Do not use dangerouslySetInnerHTML unless absolutely required and safely sanitized.

==================================================
23. CSRF
==================================================

Because authentication uses cookies, analyze CSRF risk.

Implement the appropriate protection for the actual architecture.

Consider:

- SameSite cookies
- CSRF tokens where required
- Origin validation
- Referer validation where appropriate
- strict method handling

Do not assume SameSite alone solves every possible cross-site scenario.

Test state-changing endpoints.

==================================================
24. CORS
==================================================

Configure CORS explicitly.

Never use:

Access-Control-Allow-Origin: *

with credentialed authentication.

Allow only known origins.

Do not reflect arbitrary Origin headers.

Audit:

- credentials
- methods
- headers
- preflight
- production origins
- development origins

==================================================
25. SECURITY HEADERS
==================================================

Implement appropriate security headers.

Audit:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame protection / frame-ancestors
- appropriate cache-control for sensitive responses

Do not blindly add headers that break legitimate application functionality.

Test the resulting application.

==================================================
26. RATE LIMITING
==================================================

Implement rate limiting appropriate to endpoint sensitivity.

At minimum audit:

- login
- registration
- password reset
- verification
- MFA
- refresh token
- sensitive admin operations
- public search where abuse is possible
- review submission
- coupon application
- checkout
- payment actions

Avoid a single global limit for everything.

Use endpoint-appropriate policies.

Log suspicious repeated failures.

==================================================
27. ACCOUNT ENUMERATION
==================================================

Protect:

- registration
- login
- password reset
- verification

from unnecessary account enumeration.

Use consistent responses where appropriate.

Avoid timing differences where practical.

Do not leak whether a specific account exists.

==================================================
28. PASSWORD RESET SECURITY
==================================================

Password reset tokens must be:

- cryptographically random
- short-lived
- single-use
- invalidated after use
- associated with the intended account
- never logged

Do not put reset tokens into audit logs.

After password reset:

- invalidate appropriate sessions
- invalidate old reset tokens
- require reauthentication where appropriate

==================================================
29. EMAIL / PHONE VERIFICATION
==================================================

Verification tokens must be:

- random
- short-lived
- single-use
- scoped
- invalidated after use

Rate-limit verification attempts.

Do not expose verification secrets in logs.

==================================================
30. REAUTHENTICATION
==================================================

Require recent authentication or reauthentication for sensitive operations where appropriate.

Examples:

- change password
- change email
- change phone
- disable MFA
- regenerate recovery codes
- change admin permissions
- create/delete admin
- payment-sensitive operations
- security settings

==================================================
31. AUDIT LOGGING
==================================================

Implement a centralized tamper-resistant audit log.

Audit security-sensitive and business-critical events.

At minimum:

AUTHENTICATION

- login success
- login failure
- logout
- password change
- password reset request
- password reset completion
- email verification
- phone verification
- MFA enabled
- MFA disabled
- MFA failure
- MFA recovery
- session revoked

AUTHORIZATION

- permission denied
- role changed
- permission changed
- admin created
- admin disabled
- admin role changed

BUSINESS SECURITY

- order state changes
- payment review
- refund
- return approval/rejection
- coupon manipulation
- price changes
- inventory adjustments
- critical settings changes

SECURITY

- suspicious activity
- rate-limit events
- repeated failed authentication
- invalid token attempts
- CSRF failures
- authorization failures
- malformed security-sensitive requests

==================================================
32. AUDIT LOG STRUCTURE
==================================================

Audit events should contain useful forensic context.

Possible fields:

- id
- timestamp
- actorUserId
- actorRole
- action
- resourceType
- resourceId
- outcome
- reason
- requestId
- sessionId where appropriate
- IP metadata where justified
- user-agent metadata where justified
- before
- after
- metadata

Do NOT log:

- passwords
- access tokens
- refresh tokens
- MFA secrets
- recovery codes
- payment secrets
- card numbers
- CVV
- unnecessary sensitive PII

==================================================
33. AUDIT LOG INTEGRITY
==================================================

Audit logs must not be casually editable or deletable by normal admins.

Prefer append-only behavior.

SUPER_ADMIN should not have arbitrary "edit audit log" functionality.

If retention/deletion is required:

- explicit policy
- authorization
- audit the deletion
- preserve required compliance evidence

Protect logs from tampering.

==================================================
34. SECURITY ALERTING
==================================================

Audit logs alone are insufficient.

Implement meaningful security alerts where appropriate.

Examples:

- repeated failed admin login
- suspected credential stuffing
- repeated MFA failures
- privilege escalation attempt
- repeated authorization failures
- refresh token reuse
- suspicious session behavior
- unusual payment/security events

Avoid notification spam.

Security alerts are not the same as normal customer notifications.

==================================================
35. ENCRYPTION
==================================================

Implement cryptographic protection based on data classification.

IN TRANSIT:

Use HTTPS/TLS in production.

Never transmit sensitive authentication data over plaintext HTTP in production.

AT REST:

Identify sensitive data requiring encryption or tokenization.

Do not encrypt everything blindly.

Passwords must be hashed, not reversibly encrypted.

Use authenticated encryption when application-level encryption is required.

Never invent cryptographic algorithms.

Never implement custom crypto.

Use vetted cryptographic libraries.

==================================================
36. KEY MANAGEMENT
==================================================

Secrets and encryption keys must NOT exist in source code.

Never commit:

- JWT secrets
- encryption keys
- database passwords
- API secrets
- OAuth secrets
- payment secrets
- MFA secrets

Use:

- environment secrets
- secret manager
- deployment secret storage

where appropriate.

Document required production secrets without exposing their values.

==================================================
37. DATA MINIMIZATION
==================================================

Do not store sensitive information unless the business requires it.

Review:

- customer profile
- addresses
- payment records
- sessions
- logs
- analytics
- notifications

Avoid unnecessary PII.

Sensitive responses should not be cached publicly.

==================================================
38. PAYMENT SECURITY
==================================================

Payment security must be isolated from normal order logic.

Never allow:

frontend
→ success
→ mark payment PAID

Never trust:

- frontend amount
- frontend currency
- frontend payment status
- success URL
- redirect parameter

Payment verification must be server-side.

Verify:

- order identity
- amount
- currency
- transaction identity
- trusted payment source
- idempotency
- state transition

Prepare for future gateway/webhook integration.

If no real gateway is currently configured:

DO NOT create fake production payment success.

Clearly isolate test/sandbox payment behavior.

==================================================
39. WEBHOOK SECURITY
==================================================

If payment webhooks exist or are prepared:

- authenticate webhook source
- verify signatures
- verify timestamp/replay protection where supported
- verify event ID
- implement idempotency
- verify order
- verify amount
- verify currency
- verify transaction identity
- process inside safe transaction boundaries
- reject invalid events
- audit every webhook decision

Never trust webhook payloads merely because they are HTTP POST requests.

==================================================
40. ORDER SECURITY
==================================================

Protect order state transitions server-side.

Implement an explicit state machine.

Do not allow arbitrary:

PATCH /orders/:id

to change:

- payment status
- order status
- refund status
- totals
- customer ID
- inventory
- discounts

Each transition must have:

- authorized actor
- allowed previous state
- allowed next state
- business conditions
- transaction
- audit event

==================================================
41. INVENTORY SECURITY
==================================================

Prevent:

- negative inventory
- unauthorized inventory adjustment
- race-condition overselling
- client-controlled quantity manipulation

Inventory-sensitive operations must be transactional.

Use appropriate database constraints/locking/atomic operations.

==================================================
42. COUPON SECURITY
==================================================

Never trust discount values from frontend.

Frontend submits:

coupon code

Backend calculates:

- validity
- expiration
- minimum order
- applicable products
- usage limit
- customer limit
- discount
- currency
- final total

Prevent:

- coupon replay
- usage limit race conditions
- customer limit bypass
- negative totals
- price manipulation

==================================================
43. FILE UPLOAD SECURITY
==================================================

Audit all uploads.

Validate:

- file type
- MIME
- extension
- size
- dimensions where relevant
- content
- filename
- storage location

Never trust client-provided MIME type alone.

Prevent:

- executable uploads
- path traversal
- malicious filenames
- oversized uploads
- unrestricted file types

Store uploaded files outside executable web roots where appropriate.

==================================================
44. API ERROR SECURITY
==================================================

Production API responses must be safe.

Do NOT expose:

- stack traces
- SQL
- Prisma internals
- filesystem paths
- environment values
- secrets
- internal authentication details

Use structured errors.

Example:

{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "غير مصرح بتنفيذ هذا الإجراء"
  }
}

Internal logs may contain additional diagnostic context, but must still avoid sensitive secrets.

==================================================
45. OWASP TOP 10:2025 COVERAGE
==================================================

Perform explicit mitigation and verification for ALL OWASP Top 10:2025 categories.

A01 — BROKEN ACCESS CONTROL

Verify:

- deny by default
- server-side authorization
- RBAC
- ownership checks
- IDOR/BOLA protection
- function-level authorization
- admin authorization
- API authorization
- direct URL manipulation
- privilege escalation protection

A02 — SECURITY MISCONFIGURATION

Verify:

- secure production config
- no default credentials
- secure headers
- CORS
- debug disabled
- directory listing disabled
- secure cookies
- secure error handling
- environment separation
- no secrets in repository

A03 — SOFTWARE SUPPLY CHAIN FAILURES

Audit:

- package dependencies
- outdated vulnerable packages
- dependency lockfile
- install scripts
- CI/CD
- third-party packages
- unnecessary dependencies

Do not blindly upgrade packages without testing compatibility.

A04 — CRYPTOGRAPHIC FAILURES

Verify:

- HTTPS
- password hashing
- secure randomness
- JWT signing
- key management
- sensitive data protection
- no weak algorithms
- no hardcoded secrets
- authenticated encryption where needed

A05 — INJECTION

Verify:

- SQL injection
- unsafe raw queries
- XSS
- command injection
- unsafe dynamic execution
- log injection
- input validation

A06 — INSECURE DESIGN

Verify:

- threat model
- business logic security
- state machines
- authorization architecture
- payment logic
- coupon logic
- inventory logic
- concurrency
- abuse cases
- fail-closed behavior

A07 — AUTHENTICATION FAILURES

Verify:

- login
- password policy
- password reset
- MFA
- session management
- JWT validation
- refresh token security
- account enumeration
- brute force
- credential stuffing
- logout
- session invalidation

A08 — SOFTWARE OR DATA INTEGRITY FAILURES

Verify:

- dependency integrity
- webhook integrity
- signed tokens
- trusted state transitions
- import integrity
- file integrity
- CI/CD integrity
- no client-controlled critical state

A09 — SECURITY LOGGING AND ALERTING FAILURES

Verify:

- audit logs
- failed authentication logs
- authorization failures
- critical business transactions
- security alerts
- log integrity
- sensitive data exclusion
- correlation/request IDs
- forensic usefulness

A10 — MISHANDLING OF EXCEPTIONAL CONDITIONS

Verify:

- fail closed
- transaction rollback
- race conditions
- timeout behavior
- malformed input
- database failures
- partial failures
- payment failures
- webhook failures
- retry behavior
- duplicate requests
- idempotency
- unexpected state transitions

==================================================
46. BUSINESS LOGIC SECURITY
==================================================

Do NOT focus only on technical vulnerabilities.

Test business abuse.

Examples:

Customer:

- change another customer's address
- access another customer's order
- review product without valid purchase if policy disallows it
- reuse coupon
- exceed coupon usage
- manipulate quantity
- manipulate price
- bypass return window
- create duplicate requests

Admin:

- execute unavailable permission
- modify another admin's permissions
- disable final SUPER_ADMIN
- approve unauthorized refund
- mark unpaid order as paid
- modify delivered order improperly
- bypass return workflow

Payment:

- fake payment success
- duplicate payment callback
- replay callback
- manipulate currency
- manipulate amount
- concurrent payment confirmation
- refund twice

==================================================
47. CONCURRENCY AND IDEMPOTENCY
==================================================

Sensitive operations must be safe under concurrent requests.

Audit:

- checkout
- payment confirmation
- webhook processing
- inventory deduction
- coupon usage
- refund
- return approval
- order transitions
- permission changes
- MFA operations

Use:

- database transactions
- unique constraints
- atomic updates
- row locking where necessary
- idempotency keys
- state validation

Do not rely only on frontend disabling a button.

==================================================
48. SECURITY RESPONSE HEADERS AND CACHE CONTROL
==================================================

Sensitive endpoints must not be publicly cached.

Audit:

- authentication responses
- customer profile
- orders
- payments
- admin data
- notifications
- sessions

Use appropriate:

Cache-Control
Pragma
Vary

where applicable.

Do not cache private customer data in shared caches.

==================================================
49. SECURITY TEST SUITE
==================================================

Create or extend automated tests.

AUTHENTICATION:

- valid login
- invalid login
- brute force
- account enumeration
- expired token
- invalid token
- wrong audience
- wrong issuer
- malformed JWT
- logout
- revoked session
- password reset
- password change

REFRESH TOKENS:

- valid refresh
- expired refresh
- revoked refresh
- rotation
- reuse detection
- logout invalidation
- password-change invalidation

AUTHORIZATION:

- unauthenticated request
- authenticated customer
- unauthorized customer
- ADMIN
- SUPER_ADMIN
- permission denied
- permission granted
- privilege escalation
- IDOR

MFA:

- enrollment
- valid code
- invalid code
- expired code
- recovery code
- recovery code reuse
- disable MFA
- MFA bypass attempts

API:

- SQL injection
- XSS
- malformed input
- mass assignment
- oversized payload
- CORS
- CSRF
- rate limiting

BUSINESS LOGIC:

- price manipulation
- coupon manipulation
- inventory race
- order state manipulation
- payment manipulation
- refund duplication
- webhook replay

AUDIT:

- successful sensitive action logged
- failed sensitive action logged
- actor recorded
- resource recorded
- outcome recorded
- secrets absent
- sensitive data absent

==================================================
50. SECURITY TESTING METHOD
==================================================

Do not only inspect source code.

Use:

1. Static analysis
2. Dependency audit
3. Unit tests
4. Integration tests
5. API tests
6. Database tests
7. Browser tests
8. Negative tests
9. Authorization bypass tests
10. Concurrency tests where practical
11. DAST/security scanning where tooling is available

If Burp/ZAP or equivalent tooling is available in the environment, use it appropriately.

Do not claim penetration testing if it was not actually performed.

==================================================
51. DIRECT API BYPASS TESTING
==================================================

This is mandatory.

Do not test authorization only through the UI.

Call APIs directly.

Examples:

Customer A attempts:

GET Customer B order
GET Customer B address
PATCH Customer B address
DELETE Customer B address
GET Customer B notifications

Admin attempts:

POST unauthorized resource
PATCH unauthorized resource
DELETE unauthorized resource
modify permissions
create SUPER_ADMIN
disable final SUPER_ADMIN

All must be denied.

==================================================
52. FRONTEND SECURITY
==================================================

Frontend must never be considered the final security layer.

Audit:

- route guards
- protected pages
- token handling
- sensitive data storage
- error handling
- permission-based UI
- XSS
- unsafe HTML
- URL handling

Frontend may hide unavailable actions for UX.

Backend MUST independently enforce them.

==================================================
53. DATABASE SECURITY
==================================================

Audit Prisma schema.

Implement appropriate:

- unique constraints
- foreign keys
- indexes
- ownership relationships
- enum/state constraints
- session constraints
- token uniqueness
- audit indexes
- permission relationships

Prevent inconsistent security states at the database/business layer where practical.

Do not rely entirely on application-level checks when a database constraint can safely enforce integrity.

==================================================
54. MIGRATIONS
==================================================

If new security tables/fields are required:

- create proper Prisma migrations
- do not delete migration history
- do not reset production database
- preserve existing data
- migrate safely
- add indexes
- verify rollback/recovery strategy where appropriate

Potential entities:

- User
- Role
- Permission
- RolePermission
- UserRole if needed
- Session
- RefreshToken
- MFA
- MFARecoveryCode
- OAuthIdentity if applicable
- AuditLog
- SecurityEvent
- SecurityAlert

Do not create unnecessary duplicate entities if equivalent existing models already exist.

==================================================
55. OBSERVABILITY
==================================================

Introduce correlation/request IDs where appropriate.

Security-sensitive logs should allow investigators to connect:

Request
→ User
→ Session
→ Action
→ Resource
→ Outcome

Do not expose correlation IDs as secrets.

==================================================
56. SECURITY ADMIN CENTER
==================================================

If an admin security section already exists, integrate with it.

If not, create a professional security/operations area where appropriate.

Possible sections:

- Security Overview
- Active Sessions
- Admin Security
- MFA Status
- Security Events
- Audit Logs
- Suspicious Activity
- Account Protection
- Authentication Activity

Do not expose secrets.

Do not allow normal admins to bypass security controls.

==================================================
57. CUSTOMER SECURITY CENTER
==================================================

Customer account should include appropriate:

- change password
- active sessions if supported
- logout other sessions
- MFA if enabled
- security activity
- email/phone verification state

Do not expose internal security details.

==================================================
58. NO FAKE SECURITY
==================================================

Absolutely prohibited:

- fake MFA
- fake OAuth2
- fake JWT validation
- fake audit logs
- fake security alerts
- hardcoded tokens
- test admin bypasses in production code
- hidden master passwords
- secret query parameters
- undocumented backdoors
- "temporary" security bypasses

If a feature cannot be fully implemented safely, document it rather than creating a fake implementation.

==================================================
59. SECURITY PACKAGE MANAGEMENT
==================================================

Do not install random security packages simply to increase package count.

Before adding any dependency:

- determine why it is needed
- verify maintenance status
- inspect compatibility
- check vulnerabilities
- verify license
- verify package integrity
- run existing tests after installation

Prefer established, well-maintained security libraries.

==================================================
60. PRODUCTION CONFIGURATION
==================================================

Create a security configuration checklist.

Development and production must not accidentally share:

- secrets
- databases
- admin accounts
- OAuth credentials
- payment credentials

Production:

- debug disabled
- secure cookies
- HTTPS
- restricted CORS
- safe headers
- strong secrets
- safe logging
- rate limiting
- safe error responses

==================================================
61. SECURITY DOCUMENTATION
==================================================

Create/update security documentation explaining:

- authentication architecture
- JWT architecture
- refresh token architecture
- session lifecycle
- RBAC
- permissions
- MFA
- OAuth readiness
- audit logs
- encryption
- secret management
- API security
- OWASP mitigations
- security testing
- incident response basics

Documentation must describe the REAL implementation.

Do not document features that do not exist.

==================================================
62. FINAL SECURITY VERIFICATION
==================================================

After implementation:

STOP.

Perform a second independent forensic security audit.

Pretend you are an attacker.

Try to:

- bypass authentication
- bypass authorization
- manipulate IDs
- escalate privileges
- reuse tokens
- reuse refresh tokens
- bypass MFA
- manipulate roles
- manipulate permissions
- manipulate prices
- manipulate coupons
- manipulate inventory
- manipulate payments
- replay webhooks
- duplicate refunds
- exploit race conditions
- inject SQL
- inject XSS
- upload malicious files
- trigger verbose errors
- enumerate accounts
- abuse rate limits
- access other customers
- access admin resources
- access security logs

Do not stop at "looks secure."

==================================================
63. SECURITY ACCEPTANCE CRITERIA
==================================================

The implementation is NOT COMPLETE unless:

[ ] IAM exists and is centralized
[ ] Authentication is secure
[ ] Authorization is server-side
[ ] RBAC is centralized
[ ] Resource ownership is enforced
[ ] IDOR/BOLA protections are verified
[ ] JWT validation is hardened
[ ] Access tokens are short-lived
[ ] Refresh token lifecycle is secure
[ ] Refresh token rotation/revocation exists where appropriate
[ ] Sessions can be invalidated
[ ] Logout invalidates the appropriate authentication state
[ ] Passwords use secure adaptive hashing
[ ] Password reset is secure
[ ] MFA works for administrators
[ ] MFA cannot be trivially bypassed
[ ] OAuth2/OIDC architecture is correctly handled where applicable
[ ] Secure REST API controls exist
[ ] Input validation exists
[ ] Rate limiting exists
[ ] CORS is restricted
[ ] CSRF protection is appropriate to cookie architecture
[ ] Security headers are configured
[ ] Sensitive data is protected
[ ] Secrets are not in source control
[ ] Encryption strategy is implemented where required
[ ] Payment endpoints are server-authoritative
[ ] Order state transitions are protected
[ ] Inventory logic is protected
[ ] Coupon logic is protected
[ ] File uploads are secured
[ ] Audit logs exist
[ ] Audit logs capture security-sensitive events
[ ] Audit logs do not expose secrets
[ ] Audit logs have integrity protections
[ ] Security alerts exist for meaningful events
[ ] OWASP Top 10:2025 has explicit coverage
[ ] Business logic abuse has been tested
[ ] Concurrency has been tested where relevant
[ ] API authorization has been tested directly
[ ] Customer-to-customer isolation has been tested
[ ] Admin privilege boundaries have been tested
[ ] SUPER_ADMIN protections have been tested
[ ] Production configuration has been reviewed
[ ] Dependencies have been audited
[ ] Error handling fails closed
[ ] No known Critical vulnerabilities remain
[ ] No known High vulnerabilities remain
[ ] No security bypass remains
[ ] Existing ecommerce business logic remains functional
[ ] Existing RBAC/business workflows remain compatible

==================================================
64. FINAL REPORT
==================================================

Produce an evidence-based security report.

Include:

1. Executive summary
2. Existing security architecture
3. Security issues discovered
4. Severity
5. Root cause
6. Remediation
7. Files changed
8. Database changes
9. Authentication architecture
10. Authorization architecture
11. RBAC architecture
12. JWT architecture
13. Refresh token architecture
14. Session architecture
15. MFA architecture
16. OAuth2/OIDC status
17. API security
18. Encryption strategy
19. Audit logging
20. Security alerting
21. OWASP Top 10:2025 mapping
22. Security tests executed
23. Direct API authorization tests
24. Negative tests
25. Concurrency tests
26. Dependency/security scan results
27. Browser verification
28. Remaining risks
29. Manual production configuration requirements
30. Final security status

IMPORTANT:

Never claim:

"100% secure"

"completely unhackable"

"penetration tested"

unless the corresponding evidence actually exists.

Use precise statements such as:

"Implemented and verified against the defined test suite."

or:

"Not verified because X was unavailable."

==================================================
65. EXECUTION ORDER
==================================================

Follow this exact workflow:

PHASE 1
Forensic security audit.

PHASE 2
Threat model and architecture assessment.

PHASE 3
Security remediation plan.

PHASE 4
Database/security schema changes.

PHASE 5
IAM and authentication hardening.

PHASE 6
JWT + refresh token + session management.

PHASE 7
RBAC + authorization + ownership enforcement.

PHASE 8
MFA.

PHASE 9
OAuth2/OIDC readiness or integration audit.

PHASE 10
Secure REST API hardening.

PHASE 11
Encryption and secret management.

PHASE 12
Audit logging + security events + alerting.

PHASE 13
OWASP Top 10:2025 mitigation.

PHASE 14
Business logic security.

PHASE 15
Automated security testing.

PHASE 16
Direct API authorization testing.

PHASE 17
Browser/security verification.

PHASE 18
Independent adversarial audit.

PHASE 19
Final remediation.

PHASE 20
Final evidence-based security report.

Do not skip phases.

Do not declare completion before the final independent audit.

==================================================
FINAL SECURITY ARCHITECTURE
==================================================

The resulting security architecture should conceptually enforce:

CLIENT
↓
HTTPS/TLS
↓
Secure Cookies / Authentication
↓
JWT Access Token Validation
↓
Session Validation
↓
MFA Assurance where required
↓
Account Status
↓
RBAC
↓
Permission
↓
Resource Ownership
↓
Input Validation
↓
Business Rules
↓
Transaction / Concurrency Protection
↓
Database
↓
Audit Event
↓
Safe Response

For payment-sensitive operations:

CLIENT
↓
Authenticated Request
↓
Authorization
↓
Server-side Order Verification
↓
Server-side Amount/Currency Verification
↓
Trusted Payment Verification
↓
Idempotency
↓
Transaction
↓
Payment State
↓
Order State
↓
Inventory
↓
Audit
↓
Notification

NEVER:

Frontend
→ "success"
→ PAID

NEVER:

Client
→ role=SUPER_ADMIN
→ trusted

NEVER:

Client
→ customerId=B
→ access B's resources

NEVER:

Admin
→ permission=false
→ endpoint executes anyway

NEVER:

JWT valid
→ automatically authorized

NEVER:

OAuth callback
→ blindly trusted

NEVER:

Webhook received
→ payment automatically marked paid

The backend must remain the ultimate security authority.

Execute the complete security audit, implementation, testing, adversarial verification, and final report now.


==================================================
8A. EXTERNAL AUTHENTICATION — GOOGLE / APPLE / OIDC
==================================================

The current application does not currently use external identity providers for customer account creation.

You MUST now implement real external authentication and account creation using industry-standard OAuth 2.0 / OpenID Connect flows.

The goal is to allow customers to:

1. Create an account using Google.
2. Create an account using Apple.
3. Log in using Google.
4. Log in using Apple.
5. Link an existing customer account to Google or Apple when appropriate.
6. Continue using the application's existing JWT + Refresh Token + Session Management architecture after successful authentication.

Do NOT implement a fake OAuth flow.

Do NOT simply add "Continue with Google" or "Continue with Apple" buttons without implementing the complete backend authentication flow.

==================================================
8A.1 PROVIDERS
==================================================

Implement:

- Google OAuth 2.0 / OpenID Connect
- Sign in with Apple / Apple OpenID Connect

Design the provider layer so additional providers can be added later without rewriting the authentication system.

Possible future providers:

- Microsoft
- Facebook
- other standards-compliant OIDC providers

Do NOT hardcode provider-specific logic throughout the application.

Create a clean provider abstraction.

Conceptually:

External Provider
        ↓
OAuth/OIDC Callback
        ↓
Provider Verification
        ↓
Normalized External Identity
        ↓
Existing Account Lookup
        ↓
Create / Link / Login
        ↓
Internal User Identity
        ↓
Internal Session
        ↓
JWT Access Token
        ↓
Refresh Token
        ↓
Authenticated Application

==================================================
8A.2 OAUTH FLOW
==================================================

Use the appropriate secure OAuth/OIDC authorization flow.

For browser-based authentication:

Prefer Authorization Code Flow.

Use PKCE where appropriate.

Do NOT use insecure implicit-flow patterns.

The frontend must NOT directly decide that OAuth authentication succeeded.

The backend must verify the authorization result.

==================================================
8A.3 STATE PROTECTION
==================================================

Protect the OAuth authorization flow against CSRF/login CSRF.

Use:

- state
- PKCE where applicable
- secure temporary transaction state
- short expiration
- one-time usage

OAuth state must:

- be cryptographically random
- be tied to the authentication transaction
- expire quickly
- be invalidated after successful or failed completion
- never be reusable

Do not store OAuth state in an insecure client-controlled location.

==================================================
8A.4 GOOGLE AUTHENTICATION
==================================================

Implement real Google authentication.

The backend must:

1. Generate the Google authorization request.
2. Generate secure state.
3. Generate PKCE values where applicable.
4. Redirect the customer to Google's authorization endpoint.
5. Receive the authorization callback.
6. Validate state.
7. Exchange authorization code securely.
8. Validate the returned identity/token data.
9. Verify issuer.
10. Verify audience/client ID.
11. Verify signature according to Google's OIDC metadata/JWKs.
12. Verify expiration.
13. Validate nonce where applicable.
14. Extract the normalized identity.
15. Determine whether the identity belongs to an existing customer.
16. Create or link the customer account according to the account-linking rules.
17. Create the application's authenticated session.
18. Issue the application's own access/refresh authentication mechanism.
19. Redirect the customer safely back to the application.

Never trust Google identity information simply because it was sent by the browser.

==================================================
8A.5 APPLE AUTHENTICATION
==================================================

Implement real Sign in with Apple authentication.

The backend must:

1. Generate the Apple authorization request.
2. Generate secure state.
3. Use the appropriate secure OAuth/OIDC flow.
4. Validate callback state.
5. Exchange authorization code securely.
6. Validate Apple identity tokens.
7. Verify issuer.
8. Verify audience.
9. Verify signature using Apple's published keys.
10. Verify expiration.
11. Validate nonce where applicable.
12. Normalize the Apple identity.
13. Handle Apple's private relay email addresses correctly.
14. Handle cases where Apple does not return profile information after the first authorization.
15. Create or link the customer account correctly.
16. Create the application's internal session.
17. Issue the application's own JWT/refresh-token authentication mechanism.
18. Redirect safely back to the application.

Do not assume that Apple will provide the user's name on every login.

Persist the necessary verified identity information during the initial account creation flow.

==================================================
8A.6 EXTERNAL IDENTITY DATABASE MODEL
==================================================

Do NOT store Google/Apple credentials as passwords.

Create or adapt an external identity model.

Conceptually:

ExternalIdentity

- id
- userId
- provider
- providerSubject
- providerEmail where appropriate
- emailVerified where supported
- createdAt
- updatedAt
- lastUsedAt

Recommended uniqueness:

(provider, providerSubject)

must be unique.

Do not use email as the only permanent external identity key.

The stable provider subject/identifier must be used to identify the external account.

==================================================
8A.7 ACCOUNT CREATION
==================================================

When a customer signs up using Google or Apple:

Create a normal CUSTOMER account inside the application's own identity system.

The external provider is an authentication source.

It is NOT the application's internal identity.

The application must still create:

- User
- Customer profile where applicable
- ExternalIdentity
- Session
- Refresh Token/session state
- appropriate audit event

The customer must be able to use the normal:

"حسابي"

area after registration.

==================================================
8A.8 ACCOUNT LINKING
==================================================

Prevent duplicate customer accounts.

Example:

Existing account:

customer@example.com

Customer later selects:

"المتابعة باستخدام Google"

If the verified Google identity corresponds to an existing linked identity:

→ Login to the existing account.

If the Google identity is not linked but the verified email matches an existing account:

DO NOT silently merge accounts.

Require an explicit secure account-linking flow.

For example:

Existing account authentication
        ↓
Recent authentication / reauthentication
        ↓
OAuth provider authentication
        ↓
Explicit confirmation
        ↓
Link external identity
        ↓
Audit event

Never automatically merge two accounts solely because their email strings match.

==================================================
8A.9 ACCOUNT LINKING SECURITY
==================================================

Account linking is a security-sensitive operation.

Require appropriate reauthentication for an already authenticated customer.

For example:

Customer logged into existing account
        ↓
Account Settings
        ↓
"ربط Google"
        ↓
OAuth authentication
        ↓
Verify OAuth identity
        ↓
Confirm link
        ↓
Create ExternalIdentity relation
        ↓
Audit Log

Do not allow an attacker who controls an external provider identity to silently attach it to another account.

==================================================
8A.10 EMAIL VERIFICATION
==================================================

Do not blindly treat an email claim as verified.

Use the identity provider's verified-email information only after validating the provider's identity token according to the provider's official OIDC requirements.

For Apple private relay addresses:

Treat them as legitimate provider identities.

Do not force the customer to use a personal email address.

==================================================
8A.11 ACCOUNT ENUMERATION
==================================================

OAuth login must not introduce account enumeration.

Do not return messages such as:

"This Google account already belongs to another user."

unless the response is necessary and safely designed.

Use generic responses where appropriate.

Do not expose whether an external identity belongs to a specific account.

==================================================
8A.12 OAUTH CALLBACK SECURITY
==================================================

OAuth callback endpoints must:

- accept only expected methods
- validate state
- validate authorization code
- validate issuer
- validate audience
- validate signature
- validate expiration
- validate nonce where applicable
- reject replay
- reject expired authorization transactions
- reject invalid redirect state
- never trust arbitrary redirect URLs

Never accept:

?redirect=https://attacker.example

and redirect the user blindly.

Use an allowlisted internal redirect destination system.

==================================================
8A.13 OPEN REDIRECT PROTECTION
==================================================

OAuth authentication MUST NOT create an open redirect vulnerability.

Allowed:

/account
/orders
/checkout

Not allowed:

https://attacker.example
//attacker.example
javascript:
data:

Validate redirect destinations server-side.

Prefer storing an internal route identifier rather than accepting an arbitrary URL.

==================================================
8A.14 OAUTH TOKEN SECURITY
==================================================

Provider access tokens and refresh tokens are highly sensitive.

Never expose them to the frontend unless explicitly required by the architecture.

Do not store provider tokens unnecessarily.

If provider tokens must be stored:

- encrypt them appropriately
- restrict access
- never log them
- never return them through customer APIs
- define expiration/revocation behavior

The application's own authentication tokens remain separate from provider tokens.

Do NOT reuse Google/Apple access tokens as the application's JWT.

==================================================
8A.15 INTERNAL AUTHENTICATION AFTER OAUTH
==================================================

After successful Google/Apple authentication:

DO NOT keep using the provider token as the application's session.

Instead:

Google/Apple
        ↓
Verified External Identity
        ↓
Internal User
        ↓
Internal Session
        ↓
Application Access JWT
        ↓
Application Refresh Token

The same authorization system must then apply.

Therefore:

OAuth customer
and
Password customer

must both become the same internal CUSTOMER identity type.

Both must use:

- same authorization
- same customer ownership rules
- same account area
- same orders
- same addresses
- same wishlist
- same notifications
- same reviews
- same returns/exchanges
- same security controls

==================================================
8A.16 OAUTH + MFA
==================================================

Do not assume successful OAuth authentication automatically satisfies every internal MFA policy.

For CUSTOMER accounts:

follow the configured customer security policy.

For ADMIN/SUPER_ADMIN:

External login must NOT automatically bypass internal privileged-account MFA requirements.

If OAuth is ever enabled for privileged accounts:

apply the configured admin authentication assurance policy.

Do not allow:

Google login
        ↓
skip required admin MFA
        ↓
SUPER_ADMIN access

==================================================
8A.17 OAUTH + RBAC
==================================================

OAuth authentication must NEVER determine application authorization.

The provider proves identity.

The application determines:

- role
- permissions
- account status
- resource ownership

Example:

Google identity
        ↓
Internal User ID
        ↓
CUSTOMER
        ↓
Customer permissions

Never:

Google account
        ↓
ADMIN

unless an explicitly authorized internal process assigns that role.

Never allow provider claims to create privileged roles.

==================================================
8A.18 OAUTH + SESSION MANAGEMENT
==================================================

After successful OAuth login:

create an internal session.

Track:

- internal user ID
- session ID
- provider
- authentication method
- createdAt
- lastUsedAt
- expiresAt
- revokedAt

Where appropriate, record:

authentication method:

PASSWORD
GOOGLE
APPLE

Do not store provider secrets in the session record.

Allow normal logout and session revocation.

==================================================
8A.19 OAUTH ACCOUNT DISCONNECTION
==================================================

If customers are allowed to disconnect Google or Apple:

Do not allow them to disconnect their final usable authentication method and lock themselves out.

For example:

If customer has:

Google only

and no password/passwordless alternative:

do not allow arbitrary unlinking.

Require the customer to establish another valid authentication method first.

Example:

Google
+
Set Password

then:

Google can be disconnected.

Audit all link/unlink operations.

==================================================
8A.20 OAUTH PASSWORD SETUP
==================================================

A customer created using Google or Apple may optionally establish an application password if supported.

Do not create a fake random password that the customer can never use.

If a password is created:

- hash it securely
- require appropriate verification
- audit the event
- apply normal password security

Do not expose whether an account originally came from Google or Apple unless appropriate to the customer's security UI.

==================================================
8A.21 OAUTH SECURITY LOGGING
==================================================

Create audit events for:

- OAuth authorization started
- OAuth callback success
- OAuth callback failure
- Google login success
- Google login failure
- Apple login success
- Apple login failure
- external identity linked
- external identity unlinked
- OAuth state validation failure
- invalid issuer
- invalid audience
- invalid signature
- expired token
- OAuth replay attempt
- suspicious callback
- account linking attempt
- account linking success/failure

Never log:

- authorization codes
- access tokens
- refresh tokens
- client secrets
- PKCE verifier
- private credentials

==================================================
8A.22 OAUTH RATE LIMITING
==================================================

Protect OAuth endpoints from abuse.

Rate-limit:

- authorization initiation
- callback endpoint
- account linking
- unlinking
- repeated failed authentication attempts

Do not apply a limit that breaks legitimate provider authentication flows.

==================================================
8A.23 OAUTH ENVIRONMENT CONFIGURATION
==================================================

Create separate configuration for:

DEVELOPMENT
STAGING
PRODUCTION

Never hardcode:

- Google Client ID
- Google Client Secret
- Apple Client ID
- Apple Team ID
- Apple Key ID
- Apple private key
- OAuth secrets

Use environment/deployment secret management.

Never commit these values to Git.

Document required environment variables without exposing secret values.

==================================================
8A.24 REDIRECT URI SECURITY
==================================================

OAuth redirect URIs must be explicitly configured.

Never construct redirect URIs from arbitrary request headers.

Never trust:

Host
X-Forwarded-Host
Origin

to construct a callback URL without trusted proxy configuration.

Use explicit configured callback URLs.

Example concept:

GOOGLE_CALLBACK_URL
APPLE_CALLBACK_URL

must be controlled by server configuration.

==================================================
8A.25 FRONTEND UX
==================================================

Customer registration page should provide:

"إنشاء حساب"

Traditional method:

- الاسم
- البريد الإلكتروني
- رقم الهاتف where required
- كلمة المرور
- تأكيد كلمة المرور

And external authentication:

"المتابعة باستخدام Google"

"المتابعة باستخدام Apple"

Use official provider branding guidelines.

Do not create fake provider logos.

Buttons must work through the real backend authentication flow.

After successful authentication:

redirect to:

حسابي

or the originally requested safe internal destination.

==================================================
8A.26 LOGIN PAGE
==================================================

Login should support:

- email/password
- Google
- Apple

Maintain the same internal authentication architecture.

Do not create separate customer account systems for each provider.

==================================================
8A.27 REGISTRATION + CART
==================================================

If a guest has an existing shopping cart and creates an account using Google or Apple:

preserve and securely merge the guest cart into the authenticated customer cart according to the existing cart architecture.

Prevent:

- cart ownership confusion
- duplicate quantities caused by unsafe merge
- unauthorized cart injection

Perform the merge server-side.

==================================================
8A.28 OAUTH TESTING
==================================================

Create integration tests for:

GOOGLE:

- successful login
- invalid state
- missing state
- invalid authorization code
- expired authorization code
- invalid issuer
- invalid audience
- invalid signature
- expired ID token
- invalid nonce
- duplicate external identity
- account linking
- account unlinking
- session creation
- logout

APPLE:

- successful login
- invalid state
- invalid authorization code
- invalid issuer
- invalid audience
- invalid signature
- expired ID token
- private relay email
- first-login profile data
- subsequent-login behavior
- account linking
- account unlinking
- session creation
- logout

SECURITY:

- CSRF/login-CSRF
- replay
- open redirect
- account enumeration
- token leakage
- privilege escalation
- OAuth callback manipulation
- unauthorized account linking

==================================================
8A.29 OAUTH ACCEPTANCE CRITERIA
==================================================

The implementation is NOT complete unless:

[ ] Google account creation works
[ ] Google login works
[ ] Apple account creation works
[ ] Apple login works
[ ] Existing customer accounts can securely link external identities
[ ] Duplicate external identities are prevented
[ ] Duplicate customer accounts are prevented where account linking is appropriate
[ ] Email matching does not silently merge accounts
[ ] OAuth state is protected
[ ] PKCE is implemented where appropriate
[ ] Authorization code flow is secure
[ ] ID tokens are cryptographically validated
[ ] issuer is validated
[ ] audience is validated
[ ] expiration is validated
[ ] nonce is validated where applicable
[ ] callback replay is prevented
[ ] open redirects are prevented
[ ] provider tokens are protected
[ ] provider credentials are stored only in secure configuration
[ ] OAuth does not bypass internal RBAC
[ ] OAuth does not bypass required admin MFA
[ ] OAuth creates the normal internal customer identity
[ ] OAuth creates the normal internal session
[ ] OAuth integrates with JWT access tokens
[ ] OAuth integrates with refresh tokens
[ ] OAuth integrates with session management
[ ] OAuth events are audited
[ ] sensitive OAuth data is not logged
[ ] logout works
[ ] account unlinking is safe
[ ] customer cart is preserved securely
[ ] direct API authorization still works
[ ] customer-to-customer isolation remains intact
[ ] existing password login remains functional
[ ] existing customer accounts remain functional

==================================================
8A.30 IMPORTANT SECURITY RULE
==================================================

OAuth2/OIDC is an AUTHENTICATION INPUT.

It is NOT the authorization system.

The final application authorization remains:

Authenticated Identity
        ↓
Internal User
        ↓
Account Status
        ↓
Role
        ↓
Permission
        ↓
Resource Ownership
        ↓
Business Rules

Never:

Google/Apple
        ↓
automatic ADMIN
        ↓
access

Never:

OAuth success
        ↓
skip MFA
        ↓
privileged access

Never:

Provider email
        ↓
automatic account merge

Never:

Frontend OAuth success
        ↓
trusted authentication

The backend must independently verify the external identity and then issue the application's own secure authentication/session state.