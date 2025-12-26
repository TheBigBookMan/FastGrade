# Architecture Standards

This document defines **mandatory architectural rules**
governing how this system is structured, evolved, and reviewed.

These standards apply to all architectural decisions made by
humans and AI agents unless explicitly overridden.

---

## Authority & Scope

Architecture standards are:
- subordinate only to `/ai/constitution.md` and approved acceptance criteria
- authoritative over implementation details and local design decisions

If conflicts arise, they must be surfaced and escalated.

---

## Architectural Model (Authoritative)

This system is a **modular monolith**.

- The codebase is organised by feature and responsibility
- Modules have clear ownership boundaries
- Internal modules may evolve independently
- External contracts are explicit and stable

Microservices are **not** used unless explicitly approved via ADR.

---

## Operating Modes

### Baseline Mode
- Preserve the existing architectural structure exactly
- Do NOT move modules, rename layers, or restructure boundaries
- Do NOT introduce new architectural patterns
- Capture architectural debt and inconsistencies explicitly

### Feature Mode
- Architectural changes are allowed only if:
  - required by acceptance criteria
  - explicitly documented
  - reviewed and approved
- Unrelated architectural refactors are prohibited

---

## Architectural Principles

- Clear ownership boundaries between modules
- Minimise cross-module coupling
- Prefer explicit contracts over implicit sharing
- Data ownership must be clear
- Control flow must be understandable from structure alone

---

## Boundaries & Contracts

Architectural boundaries are enforced through:
- Module APIs
- OpenAPI specifications (for external contracts)
- Data model ownership
- Explicit dependency direction

Rules:
- Modules may not reach across boundaries implicitly
- Shared logic must live in clearly owned modules
- Boundary violations must be escalated

---

## Spec-Driven Development

- Specs define intent
- Implementation follows specs
- Tests validate specs
- Documentation reflects specs

Specs are authoritative over implementation details.

---

## Architecture Decision Records (ADRs)

### When an ADR is Required
- Introducing a new architectural pattern
- Changing module boundaries
- Adopting new infrastructure or tooling
- Making irreversible or high-impact decisions

### ADR Requirements
- Must describe the decision
- Must explain the context and trade-offs
- Must document alternatives considered
- Must state consequences
- Must be reviewed and approved

ADRs live in:
- `/ai/artifacts/architecture/adr/`

---

## Evolution & Reversibility

- Prefer reversible decisions
- Avoid premature optimisation
- Avoid speculative abstractions
- Optimise for clarity over flexibility

---

## Anti-Patterns (Prohibited)

- Architecture changes during baseline work
- Implicit cross-module dependencies
- “Temporary” architectural hacks
- Silent introduction of new patterns
- Over-engineering without demonstrated need

---

## Exceptions

Exceptions to these standards:
- Must be explicitly documented
- Must include rationale and scope
- Must live in feature artifacts or ADRs
- Must be reviewed and approved

---

## Guiding Principle

> **Architecture should make correct system behavior obvious
> and incorrect behavior difficult.**
