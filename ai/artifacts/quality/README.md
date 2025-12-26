# Quality & Testing Artifacts

This directory defines the **shared quality standards** for the system.

The purpose of these documents is to:
- Align expectations across frontend, backend, QA, and AI agents
- Define *how* testing is done, not to document individual tests
- Prevent over-testing, under-testing, and inconsistent practices

These documents describe **policy and approach**, not feature-specific behavior.

---

## How to Use This Folder

- Read these documents **before** writing tests
- Reference them when generating tests via AI agents
- Update them only when testing philosophy or boundaries change

Feature-level testing details live in:
- acceptance criteria
- test code
- CI results

---

## Artifact Overview

### `test-strategy.md`
Defines the **overall testing philosophy**.

Answers:
- What levels of testing exist
- What is in scope vs out of scope
- What the quality bar is for shipping

This is the anchor document for all testing decisions.

---

### `unit-testing.md`
Defines what a **unit test means in this system**.

Covers:
- What should be unit tested
- What should not
- Expectations around speed, isolation, and determinism

This prevents disagreement about test granularity.

---

### `integration-testing.md`
Defines how **components interact** during tests.

Covers:
- API + database behavior
- Auth and permissions
- Side effects and state changes

This is where acceptance criteria are primarily validated.

---

### `e2e-testing.md` (Optional / Advanced)
Defines the approach for **end-to-end user flows**.

Covers:
- Which user journeys are protected
- What is intentionally not covered
- Expectations around stability and cost

This file exists to prevent E2E test sprawl.

---

## What Does NOT Belong Here

- Feature-specific test cases
- Lists of individual tests
- Bug reports
- CI configuration
- Tool-specific setup instructions (unless required for understanding)

---

## Relationship to Other Artifacts

- Acceptance Criteria → define *what must be true*
- Quality Artifacts → define *how correctness is validated*
- Test Code → proves behavior
- OpenAPI / ERD → document reviewed truth

These artifacts work together but serve different purposes.

---

## Update Rules

- Changes to these documents should be rare and intentional
- All updates must be reviewed
- These documents represent **system-wide standards**

If a feature requires an exception, document it in the feature artifacts,
not by changing these files.

