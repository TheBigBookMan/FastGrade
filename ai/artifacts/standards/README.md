# Engineering Standards

This directory defines **how software is built, reviewed, and evolved**
in this repository.

These standards exist to:
- ensure consistency and predictability
- reduce cognitive load during development
- protect system integrity as the codebase grows
- enable safe collaboration between humans and AI agents

They are **mandatory unless explicitly overridden**.

---

## Scope

Engineering standards apply to:

- backend implementation
- frontend implementation
- testing and quality practices
- architectural patterns
- data access and persistence
- documentation structure (where applicable)

All contributors — human or AI — are expected to follow these standards.

---

## Authority Model

Engineering standards are **subordinate only to**:

1. `/ai/constitution.md`
2. Approved acceptance criteria
3. Approved feature-specific exceptions

They are **authoritative over**:
- implementation details
- stylistic preferences
- ad-hoc conventions
- individual agent judgment

If conflicts arise, they must be surfaced and escalated.

---

## Structure

This directory contains focused standards for specific domains:

- `architecture.md` — system-level patterns and constraints
- `backend.md` — backend engineering conventions
- `frontend.md` — frontend engineering conventions
- `database.md` — data modeling and persistence rules
- `testing.md` — testing strategy and enforcement
- `quality.md` — quality gates and expectations (if present)

Each file defines **rules**, not suggestions.

---

## Usage Guidelines

### For Humans
- Read relevant standards before implementing changes
- Use standards to guide design and review decisions
- Propose changes via review, not ad-hoc edits

### For AI Agents
- Standards are binding constraints
- Deviations are not allowed without explicit instruction
- Ambiguities must be surfaced, not resolved implicitly

---

## Exceptions & Overrides

Exceptions to standards:
- Must be **explicitly documented**
- Must live in feature artifacts (not inline code comments)
- Must include rationale and scope
- Must be reviewed and approved

Temporary exceptions should be removed as soon as feasible.

---

## Evolution of Standards

Standards are living documents, but:
- Changes require review
- Changes should be intentional and minimal
- Changes should improve clarity, not add abstraction

When standards change, agents may need to be re-registered.

---

## Enforcement

Standards are enforced through:
- agent constraints
- staff engineer review
- acceptance criteria
- test coverage
- artifact promotion gates

Non-compliance must be surfaced and addressed before merge.

---

## Guiding Principle

> **Standards exist to make correct work easier and incorrect work harder.**

If a standard no longer serves that purpose, it should be revisited.
