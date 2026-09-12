---
name: ba-brd
description: "Virtual BA framework — Documentation Skill A. Synthesizes scattered notes, feature lists, constraints and business goals into a formal Business Requirements Document: executive summary, business objectives with measurable success criteria, explicit in/out of scope, stakeholder register, functional requirements (uniquely IDed, atomic, testable), non-functional requirements across all quality attributes, assumptions/dependencies/constraints, and sign-off. Use when scattered inputs must become a document people approve — triggers: 'write a BRD', 'business requirements document', 'draft the requirements doc', 'formalize these requirements', 'turn these notes into a spec', 'requirements specification', 'FRD/SRS'."
argument-hint: [notes / features / constraints / goals / file paths] (optional: --level brd|frd, --audience exec|delivery)
---

# BA BRD Drafting — Virtual BA Framework, Category 4 / Skill A

Turn scattered material into a document a sponsor can approve and a delivery team can build from.

## Inputs

- **Required** — the raw material: feature lists, meeting notes, stakeholder constraints, business goals, existing partial documents.
- **Optional** — org/product context, regulatory obligations, budget and timeline, existing architecture, prior BRDs for house style, user stories from `/ba-user-stories`, gap register from `/ba-gap-analysis`, diagrams from `/ba-diagram`.

## What a BRD is and is not

A BRD states **what the business needs and why**, in business language. It does not choose the technical solution — schemas, frameworks and API designs belong in a technical design document. When the input mixes the two, keep the *requirement* and move the *implementation* into an appendix note, so the constraint is preserved without hard-coding a design decision the BRD has no authority to make.

## Requirement Writing Rules

Every functional requirement is:

- **Atomic** — one testable obligation. "and" joining two obligations means two requirements.
- **Uniquely identified** — `FR-001`, `NFR-001`; ids are permanent and never reused after a renumber.
- **Unambiguous** — `shall` for mandatory, `should` for recommended, `may` for optional. Ban vague quantifiers: *fast, user-friendly, robust, seamless, appropriate, as needed, etc., and/or, minimize, maximize, support* — each must be replaced with a measurable bound or logged as an open question.
- **Testable** — a tester can determine pass or fail without asking the author.
- **Traceable** — every requirement links to the business objective it serves and to its source. A requirement serving no objective is scope creep; an objective with no requirement is an unmet goal. Show both.
- **Solution-free** — states the need, not the mechanism.
- **Consistent** — one term, one meaning, defined in the glossary.

## Non-Functional Coverage

Walk every category; write "Not applicable — [reason]" rather than omitting one silently. Each NFR needs a **measurable target**, not an adjective.

| Category | Must specify |
|---|---|
| Performance | Response time at a named percentile, throughput, concurrent users |
| Scalability | Growth horizon and the volume to support at it |
| Availability | Uptime %, maintenance windows, RTO/RPO |
| Security | AuthN/AuthZ model, encryption at rest/in transit, session policy |
| Privacy & compliance | Regulation, lawful basis, data residency, retention, subject rights |
| Usability & accessibility | WCAG level, supported browsers/devices, languages |
| Auditability | What is logged, by whom, retained how long, who can read it |
| Data quality & integrity | Validation, reconciliation, backup/restore |
| Interoperability | Interfaces, formats, protocols, SLAs with each |
| Supportability | Monitoring, alerting, support tiers and hours |

## Document Structure

```markdown
# Business Requirements Document: [Initiative]

| | |
|---|---|
| **Document ID / Version** | BRD-[slug]-v0.1 (Draft) |
| **Author / Date** | [author] · [ISO date] |
| **Sponsor / Approvers** | [roles] |
| **Status** | Draft · In Review · Approved |

## 1. Executive Summary
[Half a page, readable alone: the problem, its business cost, the proposed change, the expected benefit with a number, the ask (budget/decision/timeline). No jargon, no requirement ids.]

## 2. Business Context & Problem Statement
### 2.1 Background · 2.2 Problem (with evidence) · 2.3 Cost of doing nothing · 2.4 Opportunity

## 3. Business Objectives & Success Criteria
| Obj ID | Objective | Success measure | Baseline | Target | By when | Owner |
|---|---|---|---|---|---|---|
| OBJ-1 | Cut invoice processing cost | Cost per invoice | 4.20 USD | 1.50 USD | Q4 2026 | CFO |

## 4. Scope
### 4.1 In scope · 4.2 Out of scope (with the reason each was excluded) · 4.3 Future phases
[Out of scope is the section that prevents the argument later — be specific, not generic.]

## 5. Stakeholders
| Stakeholder | Role | Interest | Influence | Involvement (RACI) |
|---|---|---|---|---|

## 6. Current State (AS-IS)
[Narrative + `/ba-diagram` flowchart + the pain points that justify the change.]

## 7. Future State (TO-BE)
[Narrative + diagram + what changes for each stakeholder group.]

## 8. Functional Requirements
### 8.1 [Capability area]
| Req ID | Requirement | Priority | Objective | Source | Acceptance |
|---|---|---|---|---|---|
| FR-001 | The system shall capture supplier invoice header data from PDF submissions. | Must | OBJ-1 | Workshop 2026-08-14 | AC in US-03 |

**FR-001 — [Title]**
*The system shall …*
- **Rationale:** [why]
- **Business rules:** [BR-01 …]
- **Acceptance criteria:** [reference the Gherkin, or state the conditions]

## 9. Non-Functional Requirements
| NFR ID | Category | Requirement | Target | Verification |
|---|---|---|---|---|
| NFR-001 | Performance | Invoice capture shall complete within 5 s at p95 | ≤5 s p95 | Load test, 500 concurrent |

## 10. Data Requirements
[Entities, key attributes, retention, migration, reporting needs, an ERD where useful.]

## 11. Interfaces & Integrations
| System | Direction | Data | Method | Frequency | Owner |
|---|---|---|---|---|---|

## 12. Assumptions, Dependencies & Constraints
| ID | Type | Statement | Impact if wrong/unmet | Owner |
|---|---|---|---|---|
| ASM-01 | Assumption | ERP exposes an invoice API | FR-004 becomes XL effort | IT Architecture |

## 13. Risks
[Summary table — full register via `/ba-raid`.]

## 14. Open Questions
| ID | Question | Blocks | Ask | Needed by |
|---|---|---|---|---|

## 15. Glossary
| Term | Definition |
|---|---|

## 16. Traceability
| Objective | Requirements | Stories | Test cases |
|---|---|---|---|

## 17. Approval
| Name | Role | Decision | Date |
|---|---|---|---|

## Appendix A — Implementation notes carried from source
[Technology preferences stated by stakeholders, kept as context, not as requirements.]
```

`--level frd` — drop sections 1–5 to summaries and expand 8–11 into per-function detail with field-level tables and error handling.

## Drafting Discipline

- **Never invent a requirement.** Everything traces to the input. Genuine gaps become Open Questions with an owner — a document full of plausible invented requirements is worse than a short one with honest holes.
- Mark every inference as an Assumption with an id.
- Keep the summary readable by someone who reads nothing else.
- Use consistent terminology; define each term once in the glossary and never vary it.
- Where the input conflicts with itself, show both positions in Open Questions rather than silently picking one.
- Number requirements with room to insert (`FR-010`, `FR-020`) on long documents.

## Completeness Check

- [ ] Every objective has ≥1 requirement; every requirement maps to an objective.
- [ ] No banned vague word survives in a requirement sentence.
- [ ] Every NFR category addressed or explicitly marked not applicable.
- [ ] Out of scope is populated and specific.
- [ ] Every assumption has an impact-if-wrong.
- [ ] Executive summary stands alone.
- [ ] No technical design decisions inside functional requirements.

## Handoff

- Requirements → `/ba-user-stories` → `/ba-gherkin` for the delivery backlog.
- Traceability at five layers → `/helix-rtm`.
- Risks/dependencies → `/ba-raid`.
- A .docx deliverable → the `docx` skill, reusing this structure.
