# Frontend Engineering Standards

This document defines **mandatory frontend engineering rules**
for this repository.

These standards apply to all frontend work performed by humans
and AI agents unless explicitly overridden in feature artifacts.

---

## Authority & Scope

Frontend standards are:
- subordinate only to `/ai/constitution.md` and acceptance criteria
- authoritative over implementation details and stylistic preferences

If a conflict exists, it must be surfaced and escalated.

---

## Technology Stack (Authoritative)

- Framework: **<<INSERT TECH HERE>>**
- Language: **<<INSERT TECH HERE>>**
- Styling: **<<INSERT TECH HERE>>**
- State management: **<<INSERT TECH HERE>>**
- Build tooling: **<<INSERT TECH HERE>>**

Deviations from this stack require explicit approval and documentation.

---

## Operating Modes

### Baseline Mode
- Preserve existing UI behavior exactly
- Do not refactor, rename, or restructure components
- Do not alter UX flows
- Tests must codify current behavior only

### Feature Mode
- Implement UI changes defined in acceptance criteria
- Limit changes strictly to approved scope
- Do not modify unrelated components or flows
- Ensure new behavior integrates cleanly with existing patterns

---

## Architectural Principles

- Component-based architecture is mandatory
- Clear separation of concerns:
  - Presentational components (UI only)
  - State management (Zustand or hooks)
  - API/data access (service or adapter layer)
- Prefer composition over inheritance
- Prefer explicit data flow over implicit coupling

---

## API & Contract Rules (Non-Negotiable)

- Frontend must treat OpenAPI as the source of truth
- Do not infer, reshape, or “fix” API responses silently
- Do not assume optional fields exist
- All API interactions must:
  - handle loading states
  - handle error states
  - handle empty states explicitly

If API behavior appears inconsistent, escalate — do not workaround.

---

## Styling Rules

- Use Tailwind utility classes exclusively
- Prefer design tokens / Tailwind config variables over raw values
- Avoid inline styles unless explicitly justified
- Avoid custom CSS unless no utility alternative exists

---

## Code Practices

- All code must be fully typed
- Avoid `any`
- Prefer functional components
- Components should be:
  - small
  - focused
  - predictable
- Hooks must have clear ownership and scope
- Side effects must be explicit and isolated

---

## Testing Expectations

- UI behavior must be testable
- State transitions should be covered where meaningful
- API integration tests must mock or stub responses
- Tests must reflect acceptance criteria, not assumptions

---

## Anti-Patterns (Prohibited)

- Business logic inside UI components
- API calls directly inside JSX
- Silent API response reshaping
- Uncontrolled global state
- Copy-pasted styles or logic
- Implicit dependencies between components
- “Temporary” hacks without documentation

---

## Exceptions

Exceptions to these standards:
- Must be explicitly documented
- Must include rationale and scope
- Must live in feature artifacts
- Must be reviewed and approved

---

## Guiding Principle

> **Frontend code should make system behavior obvious,
> predictable, and difficult to misuse.**
