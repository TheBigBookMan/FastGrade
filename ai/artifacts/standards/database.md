# Database Standards

This document defines **mandatory rules for data modeling,
schema evolution, and database access** in this repository.

These standards apply to all database-related work performed by
humans and AI agents unless explicitly overridden.

---

## Authority & Scope

Database standards are:
- subordinate only to `/ai/constitution.md` and approved acceptance criteria
- authoritative over implementation details and convenience decisions

If conflicts arise, they must be surfaced and escalated.

---

## Operating Modes

### Baseline Mode
- Document the existing database schema as-is
- Do NOT change table structures, columns, or constraints
- Do NOT rename fields or normalise data
- Capture quirks, inconsistencies, and technical debt explicitly
- Treat the current schema as the source of truth

### Feature Mode
- Schema changes are allowed **only if explicitly approved**
- Changes must be:
  - required by acceptance criteria
  - documented in feature artifacts
  - reviewed before migration is applied
- Unrelated schema changes are prohibited

---

## Data Modeling Principles

- Table and column names must be explicit and meaningful
- Relationships must be explicitly defined
- Avoid nullable fields unless required by domain logic
- Avoid over-normalisation unless justified
- Prefer explicit foreign keys over implicit relationships
- Derived or computed data must be clearly identified

---

## Schema Changes & Migrations

- Every schema change must have a corresponding migration
- Migrations should be reversible where feasible
- One concern per migration
- Migrations must be:
  - reviewed
  - tested
  - documented in feature artifacts
- Schema changes must trigger updates to:
  - ERD documentation
  - affected OpenAPI specs (if applicable)
  - relevant tests

No schema changes may be applied silently.

---

## Data Access Rules

- All database access must go through the data layer / ORM
- Raw SQL is prohibited unless:
  - ORM support is insufficient
  - performance or correctness requires it
- Raw SQL usage must be:
  - explicitly documented
  - justified in feature artifacts
  - reviewed and approved

---

## Data Safety & Integrity

- Writes must be intentional and traceable
- Destructive operations must be explicitly guarded
- Bulk updates or deletes require special review
- Data integrity must be enforced at the schema level where possible

---

## Documentation Requirements

- The ERD must reflect the approved schema
- Relationships and constraints must be documented
- Known schema inconsistencies must be recorded
- Temporary workarounds must be explicitly called out

---

## Anti-Patterns (Prohibited)

- Schema changes during baseline work
- Renaming columns for “clarity” without approval
- Silent migrations
- Unreviewed raw SQL
- Implicit relationships
- Application-level enforcement of data integrity where DB constraints exist

---

## Exceptions

Exceptions to these standards:
- Must be explicitly documented
- Must include rationale and scope
- Must live in feature artifacts
- Must be reviewed and approved

---

## Guiding Principle

> **Database changes are expensive, irreversible, and high-risk.
> Make them deliberate, visible, and boring.**
