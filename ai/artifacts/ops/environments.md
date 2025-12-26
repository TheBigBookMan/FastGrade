# Runtime Environments

This document describes the **runtime environments** used by the system
and how they differ.

---

## Local

Purpose:
- Developer testing
- Rapid iteration

Characteristics:
- Local database
- Mocked or sandboxed external services
- Relaxed security constraints

Notes:
- Not production-representative
- Data persistence may be ephemeral

---

## Staging

Purpose:
- Pre-production validation
- QA and stakeholder testing

Characteristics:
- Production-like configuration
- Real integrations (where possible)
- Restricted access

Notes:
- Data may be reset
- Used to validate release readiness

---

## Production

Purpose:
- Live user traffic

Characteristics:
- Hardened security
- Full observability enabled
- Strict access controls

Notes:
- Changes must follow release process
- Rollback considerations apply

---

## Feature Flags

Feature flags may be used to:
- Gradually roll out features
- Disable risky functionality
- Test behavior safely

Feature flags should:
- Be documented
- Have a clear removal plan

---

## External Dependencies

List major external services used by the system:
- Authentication provider
- Payment provider
- Messaging/email service
- Analytics

Document environment-specific differences if applicable.

