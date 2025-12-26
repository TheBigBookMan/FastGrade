# Operations Artifacts

This directory contains **system-wide operational knowledge**.

The purpose of these documents is to:
- Make deployments predictable
- Reduce risk during releases
- Clarify environment differences
- Support safe rollback and recovery

These artifacts describe **how the system runs**, not how it is developed.

---

## How to Use This Folder

- Read these documents before releasing changes
- Reference them when modifying deployment-related behavior
- Update them only when runtime or release behavior changes

Feature-specific operational concerns should be documented
in the relevant feature artifacts, not here.

---

## Artifact Overview

### `environments.md`
Describes the runtime environments (local, staging, production)
and how they differ.

---

### `release-process.md`
Describes how changes are promoted, released, and rolled back.

---

## What Does NOT Belong Here

- CI pipeline configuration
- Secrets or credentials
- Infrastructure-as-code files
- Feature-specific behavior
- Incident reports

---

## Update Rules

- Changes to ops artifacts must be reviewed
- These documents represent **current operational truth**
- If behavior changes, update these docs as part of the change

