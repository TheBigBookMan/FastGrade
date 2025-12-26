# Backend Engineering Standards

This document defines **mandatory backend engineering rules**
for this repository.

These standards apply to all backend work performed by humans
and AI agents unless explicitly overridden.

---

## Authority & Scope

Backend standards are:
- subordinate only to `/ai/constitution.md` and approved acceptance criteria
- authoritative over implementation details and stylistic preferences

If conflicts exist, they must be surfaced and escalated.

---

## Technology Stack (Authoritative)

- Language: **<<INSERT TECH HERE>>**
- Framework: **<<INSERT TECH HERE>>**
- ORM / DB layer: **<<INSERT TECH HERE>>**

Deviations from this stack require explicit approval and documentation.

---

## Operating Modes

### Baseline Mode
- Preserve existing API behavior exactly
- Do NOT refactor controllers, services, or data access
- Do NOT rename endpoints, parameters, or response shapes
- Tests must codify current behavior only
- Known quirks or inconsistencies must be documented, not fixed

### Feature Mode
- Implement behavior defined in acceptance criteria
- Limit changes strictly to approved scope
- Do NOT alter unrelated endpoints or logic
- Backwards compatibility must be preserved unless explicitly approved

---

## Architectural Principles

- Clear separation of concerns is mandatory:
  - Controllers / handlers: HTTP concerns only
  - Services / use cases: business logic
  - Data access: persistence and querying
- Business logic must not live in controllers
- Controllers must be thin and declarative
- Prefer explicit dependency injection over implicit imports
- Side effects must be explicit and traceable

---

## API Design & Contracts

- OpenAPI is the source of truth for API behavior
- All endpoints must conform exactly to the OpenAPI spec
- Do NOT:
  - infer undocumented fields
  - reshape responses for convenience
  - introduce silent behavior changes
- Validation must occur at system boundaries
- Error responses must be:
  - consistent
  - explicit
  - documented

If the OpenAPI spec is insufficient or unclear, escalate — do not guess.

---

## Validation & Error Handling

- Input validation is mandatory at API boundaries
- Validation failures must return explicit client errors
- Internal errors must be:
  - logged
  - surfaced via consistent error responses
- Silent failures are prohibited

---

## Testing Expectations

- Business logic must be testable in isolation
- APIs must have integration test coverage where meaningful
- Error paths and edge cases must be tested
- Tests must reflect acceptance criteria, not assumptions

---

## Code Practices

- Prefer small, composable units
- Avoid hidden side effects
- Avoid implicit coupling between layers
- Make control flow explicit
- Prioritize readability and predictability over cleverness

---

## Anti-Patterns (Prohibited)

- Fat controllers
- Business logic in handlers
- Direct DB access from controllers
- Silent behavior changes
- Unvalidated inputs
- Undocumented API responses
- Convenience-driven schema or API drift

---

## Exceptions

Exceptions to these standards:
- Must be explicitly documented
- Must include rationale and scope
- Must live in feature artifacts
- Must be reviewed and approved

---

## Guiding Principle

> **Backend code defines the system’s contract with the world.
> Make it explicit, boring, and hard to misuse.**
