# RTM Table Variants by Project Type

Pick the variant that matches the project. All variants keep the same five-layer trace
(Business Need → Stakeholder Req → Solution Req → Test/AC → Source Item); they differ
in which columns are surfaced and how rows are grouped.

---

## 1. Greenfield Product / New Feature (default)

Full matrix — every layer visible. Use when the PRD is the source of truth and
delivery tickets are being created from it.

| RTM ID | Business Need | Stakeholder Req | Solution Req | Priority | AC | Test Coverage | Status | Source Items | Flags |
|---|---|---|---|---|---|---|---|---|---|

- Group rows by Business Need.
- Sort within group by MoSCoW priority (Must → Won't).

## 2. Enhancement / Change Request

Existing system, incremental scope. Add an **Impacted Component** column and a
**Regression Risk** flag; business needs are often inherited rather than new.

| RTM ID | Change Driver | Stakeholder Req | Solution Req | Impacted Component | Priority | AC | Status | Source Items | Flags |
|---|---|---|---|---|---|---|---|---|---|

- `Change Driver` replaces Business Need (link to CR / incident / feedback item).
- Flag rows touching shared components as `regression_risk`.

## 3. Integration / Migration Project

Trace both sides of the integration. Add **Source System** and **Target System**
columns and a data-mapping reference.

| RTM ID | Business Need | Interface / Data Req | Source System | Target System | Mapping Ref | Priority | AC | Status | Source Items |
|---|---|---|---|---|---|---|---|---|---|

- Every data requirement must link to a field-level mapping document.
- `Not Covered` test coverage on a Must Have interface = automatic `delivery_risk`.

## 4. Compliance / Audit-Driven Project

Regulator or policy is the top layer. Add **Regulation / Clause** as Layer 0 and an
**Evidence** column (where proof of compliance lives).

| RTM ID | Regulation / Clause | Business Need | Solution Req | Control / AC | Evidence | Status | Source Items | Flags |
|---|---|---|---|---|---|---|---|---|

- 100% trace is mandatory — any orphaned clause is a `compliance_gap`, not a warning.
- Evidence column links to test results, sign-offs, or audit artefacts.

## 5. Lightweight / Sprint-Level RTM

For a single sprint or small initiative where a full PRD is overkill. Collapse
stakeholder + solution layers into one Requirement column.

| RTM ID | Goal | Requirement (User Story) | Priority | AC | Status | Ticket |
|---|---|---|---|---|---|---|

- Skip the coverage scorecard; just flag missing AC and unlinked stories.

---

## Choosing a variant

| Signal in inputs | Variant |
|---|---|
| New PRD, no existing system references | 1 — Greenfield |
| CR / incident IDs in `ba_context.json` | 2 — Enhancement |
| Two or more system names, field mappings | 3 — Integration |
| Regulation, policy, or audit terms in strategy analysis | 4 — Compliance |
| < ~15 requirements, single sprint scope | 5 — Lightweight |

When in doubt, default to variant 1.
