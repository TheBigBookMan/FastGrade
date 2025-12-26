# System Baseline Intake

## Context

This project is an existing backend application that has grown organically.
Core functionality is implemented and actively used, but the system lacks
formal documentation and test coverage.

Specifically, the project currently has:
- No OpenAPI / Swagger specification
- No ERD or documented data model
- Limited or no automated tests
- Implicit API contracts defined only by code

The codebase is functional, but knowledge about behaviour, contracts, and
edge cases exists primarily in implementation details.

---

## Objective

Establish a **documented and tested baseline of the current system**  
*without changing external behaviour*.

The goal of this initiative is to:
- Make existing behaviour explicit
- Lock in current API contracts
- Capture the current data model
- Add confidence through tests
- Enable safe future feature development

This baseline will act as the foundation for:
- future features
- refactors
- agent-assisted development
- onboarding (human or AI)

---

## Non-Goals (Very Important)

This initiative is **not** intended to:
- Add new features
- Change API response shapes
- Modify business logic
- Rename endpoints or fields
- Refactor code for style or cleanliness
- Change database schema (unless required for testability)

If behaviour is unclear, the default assumption is:
> *The current implementation defines the truth.*

---

## Scope of Baseline Work

The baseline initiative includes:

### API
- Identify existing routes and controllers
- Capture request parameters (path, query, body)
- Capture response envelopes and payload shapes
- Document error behaviour and status codes
- Produce OpenAPI documentation reflecting **current behaviour**

### Data Model
- Identify tables/entities used by the application
- Capture fields, relationships, and constraints
- Produce an ERD that reflects the **current schema**
- No schema changes unless unavoidable

### Quality
- Add unit tests for existing services/controllers
- Tests must assert **current behaviour**
- Mock external dependencies where appropriate
- No test-driven refactors at this stage

---

## Baseline Verification Rules

This system baseline must reflect **verified reality only**.

All statements about behavior, capabilities, or constraints MUST be:
- verified via direct code inspection, and
- accompanied by a concrete code reference

Required format for verification:
- `Verified in /relative/path/to/file.ts:<line-number>`

If behavior cannot be verified in code:
- it must be marked as **uncertain**, **inconsistent**, or **out-of-scope**
- speculation is not allowed

Future-looking or aspirational statements are prohibited in baseline artifacts.

---

## Constraints

- Production behaviour must remain unchanged
- Tests must reflect what the system does today
- Documentation must describe reality, not intent
- Changes should be incremental and reviewable
- Canonical artifacts must only be updated after review

---

## Risks & Considerations

- Some behaviours may be implicit or undocumented
- Inconsistencies between endpoints may exist
- Error handling may vary between routes
- Database usage patterns may not be uniform

These are expected and should be captured, not fixed yet.

---

## Open Questions

- Which endpoints are critical paths and should be baselined first?
- Are there deprecated or unused routes?
- Which tables are actively written to vs read-only?
- Are there environment-specific behaviours?

---

## Open Questions Resolution (Baseline)

All open questions identified during baseline review must be resolved using one of the following outcomes:

- **Verified** — confirmed via code inspection with reference
- **Not Implemented** — referenced in docs or schema but no runtime behavior exists
- **Inconsistent** — behavior differs across code paths
- **Out of Scope** — code exists but is not integrated into the current system
- **Unknown** — insufficient evidence in codebase

Each resolved question must:
- update the product brief and acceptance criteria
- include a code reference where applicable
- avoid inferred intent or assumed behavior

---

## Baseline Progression Gates

### Before API Baseline Can Proceed

The following conditions MUST be satisfied:

- [ ] All behavioral claims in acceptance criteria include code references
- [ ] All open questions are resolved using defined resolution outcomes
- [ ] Integration tests exist and pass for documented endpoints
- [ ] API response envelope consistency is verified
- [ ] Cascade behaviors are confirmed in schema or code
- [ ] Browser extension integration is:
  - documented with code references, or
  - explicitly marked as out-of-scope

API baseline work must not begin until all items above are complete.

---

### Before Data Model Baseline Can Proceed

The following conditions MUST be satisfied:

- [ ] ERD generated directly from Prisma schema
- [ ] All constraints documented with schema references
- [ ] Migration history reviewed
- [ ] Indexes documented
- [ ] Orphaned or unused fields identified and noted

Data model baseline work must not begin until all items above are complete.

---

## Definition of Done (for this initiative)

This baseline initiative is considered complete when:
- Existing API behaviour is documented in OpenAPI
- Current data model is captured in a mermaid ERD
- Critical endpoints have unit test coverage
- Behavioural assumptions are made explicit
- Future features can be developed safely on top

---

## Notes

This is a **one-time foundational effort**.
Subsequent work should follow the standard feature workflow and
build on top of this baseline rather than re-documenting it.

