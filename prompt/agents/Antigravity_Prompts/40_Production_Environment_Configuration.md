# Prompt 40 — Production Environment Configuration & Secret Generation

## Execution Protocol — Mandatory

You are operating on the authorized local repository:

`https://github.com/EyadAbduljalil/Online_shope.git`

Follow the mandatory Antigravity execution protocol:

1. First create:
   `Antigravity_Prompts/40_Production_Environment_Configuration.md`
2. Write this complete prompt into that file.
3. Read the Markdown file completely.
4. Execute ONLY from that Markdown file.
5. Do not ask the user for approval between steps.
6. Inspect the CURRENT repository implementation before changing any environment configuration.
7. Do not assume the database technology from an old report.
8. The actual current source code and Prisma schema are authoritative.
9. Never commit secrets.
10. Never place production secrets into source code.
11. Never place production secrets into `.env.example`.
12. Never print production secrets into the final report.
13. Do not deploy to production.
14. Do not contact external production services.
15. Stop after Prompt 40 is complete.

---

# Objective

Prepare the repository for production environment configuration.

The user supplied the following database connection information:

`mongodb+srv://eyadabduljalil1_db_user:7S60puk6MFtSIouy@cluster0.bkxvzwv.mongodb.net/`

IMPORTANT:

This URI contains a credential and must be treated as a secret.

DO NOT expose, repeat, commit, or place the complete URI in any report.

Before using it, inspect the current application architecture and determine whether the application actually uses MongoDB.

The previous architecture reports indicate PostgreSQL + Prisma, but the CURRENT repository must be treated as authoritative.

---

# 1. Determine Actual Database Architecture

Inspect:

* `backend/prisma/schema.prisma`
* Prisma configuration
* `backend/package.json`
* database configuration files
* imports
* environment validation
* Docker/deployment files if present

Determine whether the application currently uses:

* PostgreSQL
* MongoDB
* another database

Do NOT change the database architecture merely because the user supplied a MongoDB URI.

If the application uses PostgreSQL:

* Do NOT put the MongoDB URI into `DATABASE_URL`.
* Report that the supplied MongoDB URI is incompatible with the current database architecture.
* Keep the existing PostgreSQL architecture unchanged.

If the application actually uses MongoDB:

* Configure it according to the actual implementation.
* Never expose the credential in generated reports.

---

# 2. Production Environment Inventory

Inspect the current `env.ts`, `.env.example`, README, and all environment variable references.

Build an internal inventory of:

* Database
* JWT
* CORS
* Payment
* Stripe
* Webhook
* Email
* Redis
* Sentry
* Frontend API URL
* Storage/upload configuration
* Other required production variables

For each variable determine:

* Required
* Optional
* Development-only
* Test-only
* Secret
* Public

---

# 3. Generate Secure Application Secrets

For secrets that the application itself can safely generate, generate cryptographically secure random values locally.

Examples:

* `JWT_SECRET`
* CSRF secret if separately required
* Other application-level signing/encryption secrets

Requirements:

* Use a cryptographically secure random generator.
* Do not use predictable values.
* Do not use timestamps.
* Do not use usernames.
* Do not use repository names.
* Do not use sample/default secrets.
* Do not commit generated secrets.

Do NOT generate fake Stripe webhook secrets.

Stripe webhook secrets must come from Stripe's authorized webhook configuration.

---

# 4. Production `.env`

If the project expects a local production environment file, create/update:

`backend/.env`

ONLY if appropriate for the repository's development workflow.

Never commit it.

Ensure `.gitignore` excludes it.

Do not include secrets in any Markdown report.

If the project should instead rely exclusively on hosting environment variables, document that approach instead of creating a local production secret file.

---

# 5. `.env.example`

Update `.env.example` only with placeholders.

Example format:

```env
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
REDIS_URL=
SENTRY_DSN=
```

Never put real credentials in this file.

Never put generated production secrets in this file.

---

# 6. Database Configuration

Use the actual database architecture discovered in Step 1.

If PostgreSQL + Prisma:

* Keep PostgreSQL.
* Validate `DATABASE_URL`.
* Verify Prisma migrations.
* Verify production connection requirements.
* Verify no development database is accidentally referenced.
* Verify connection configuration is production-safe.

If MongoDB is actually used:

* Validate the MongoDB URI format.
* Ensure credentials remain secret.
* Ensure TLS/secure connection behavior is appropriate.
* Do not expose credentials.

Do not perform destructive database operations.

Do not drop databases.

Do not reset production databases.

---

# 7. JWT Configuration

Configure a production-strength JWT secret.

Requirements:

* Cryptographically random
* Sufficient entropy
* Not reused from development
* Not stored in Git
* Not exposed to frontend
* Production startup must reject missing/weak/default secrets

Verify JWT expiration settings.

---

# 8. CORS

Determine the production frontend origin from the repository/deployment configuration.

Do NOT use:

```text
*
```

for credentialed production requests.

Configure the production frontend origin explicitly.

Do not invent a domain if none exists.

If the final domain is not known, leave:

`CORS_ORIGIN=`

and document it as:

`CONFIGURATION REQUIRED`

---

# 9. Stripe

Inspect the current Stripe implementation.

Determine required variables such as:

* Stripe secret key
* Stripe publishable key
* Stripe webhook secret

Never generate Stripe secrets.

Never invent Stripe credentials.

Never place Stripe credentials into source code.

If production Stripe credentials are not available:

`CONFIGURATION REQUIRED`

must be reported.

---

# 10. Email

Inspect the actual email implementation.

Determine required:

* SMTP/API host
* Port
* Username
* Password/API key
* From address
* Provider configuration

Do not generate fake provider credentials.

If external email configuration is unavailable:

`CONFIGURATION REQUIRED`

---

# 11. Redis

Inspect whether Redis is mandatory or optional.

If mandatory:

* Document required `REDIS_URL`.
* Verify production configuration expectations.
* Do not invent credentials.

If optional:

* Verify fallback behavior.
* Ensure fallback does not weaken security or data integrity.

---

# 12. Sentry

Inspect the actual Sentry implementation.

If Sentry is enabled:

* Require production DSN through environment variables.
* Do not hardcode DSN.
* Do not expose sensitive request information.
* Verify environment configuration.

If Sentry is optional:

* Document it as optional.

---

# 13. Security Configuration

Verify production:

* HTTPS expectations
* Secure cookies
* HttpOnly cookies
* SameSite behavior
* CSRF
* Helmet
* CORS
* Trust proxy
* Rate limits
* Body limits
* Error handling
* Request correlation
* Audit logging

Do not weaken any security control.

---

# 14. Secret Scan

Perform a final repository scan for:

* Passwords
* API keys
* JWT secrets
* Private keys
* Stripe credentials
* Webhook secrets
* Database credentials
* Tokens

Do not print discovered secrets.

If a real secret is found in tracked files:

* Remove it from source control where safe.
* Do not merely replace the visible text while leaving Git history exposed.
* Document that the credential must be rotated.

---

# 15. Validate Environment

Run the application's environment validation.

Test safely that:

* Missing required production variables fail appropriately.
* Weak/default secrets fail appropriately.
* Valid placeholder/configuration structure passes validation.
* Development mode remains usable.
* Test configuration remains usable.

Do not use real external payment transactions.

---

# 16. Build and Test

Run:

### Backend

```bash
npm run lint
npm run build
npm test
```

### Frontend

```bash
npm run lint
npm run build
```

Run typechecking if it exists as a separate script.

Fix only configuration/integration issues directly caused by this prompt.

Do not introduce unrelated features.

---

# 17. Git Safety

Verify:

* `.env` ignored
* `backend/.env` ignored if applicable
* Production secret files ignored
* Generated reports contain no secrets
* No credentials are staged
* No credentials are tracked

Run a safe Git inspection.

---

# 18. Required Report

Create:

`Antigravity_Prompts/40_Production_Environment_Configuration_Report.md`

The report must include:

1. Executive Summary
2. Actual Database Architecture
3. Environment Variable Inventory
4. Secret Generation Status
5. Database Configuration Status
6. JWT Configuration Status
7. CORS Status
8. Stripe Configuration Status
9. Email Configuration Status
10. Redis Configuration Status
11. Sentry Configuration Status
12. Security Configuration Status
13. Git/Secret Safety Status
14. Environment Validation Results
15. Backend Test Results
16. Frontend Test Results
17. Build Results
18. Remaining Configuration Requirements
19. Final Status

CRITICAL:

Never put any actual secret, password, token, API key, or complete database URI in this report.

Use:

`CONFIGURED`

or:

`CONFIGURATION REQUIRED`

instead.

---

# Final Status

Use one of:

### `PRODUCTION ENVIRONMENT CONFIGURED`

when all required application-side configuration is safely prepared.

### `PRODUCTION ENVIRONMENT CONFIGURED — EXTERNAL CREDENTIALS REQUIRED`

when code and environment structure are ready but external provider credentials/domain configuration remain.

### `PRODUCTION ENVIRONMENT BLOCKED`

when a code/configuration problem prevents safe production operation.

---

# Completion Criteria

Prompt 40 is complete only when:

* Actual database architecture was verified from source.
* The supplied MongoDB URI was NOT blindly inserted.
* Application secrets were generated securely where appropriate.
* Production secrets are not committed.
* `.env.example` contains placeholders only.
* Stripe secrets were not fabricated.
* CORS production configuration is documented.
* Database configuration is documented.
* Git secret protection is verified.
* Secret scan passes.
* Environment validation passes appropriately.
* Backend tests pass.
* Frontend lint/build pass.
* No unrelated functionality was changed.
* Final report exists.
* No secrets appear in the report.
* Execution stops.

END OF PROMPT 40
