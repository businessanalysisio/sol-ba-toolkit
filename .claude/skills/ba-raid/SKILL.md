---
name: ba-raid
description: "Virtual BA framework — Documentation Skill B. Reads project status updates, standup notes, steering reports or escalation threads and extracts a categorized RAID log — Risks (probability × impact scored, with mitigation and owner), Assumptions (with validation date and impact if false), Issues (severity, age, resolution action) and Dependencies (direction, needed-by date, blocking status) — plus a project health read and the escalations needing attention now. Use for project health and RAID tracking — triggers: 'RAID log', 'risk register', 'what are the risks here', 'extract issues and dependencies', 'project health check', 'analyze this status update', 'what's blocking us', 'update the risk log'."
argument-hint: [status update / notes / existing RAID log] (optional: --update path/to/raid.md)
---

# BA RAID Log Management — Virtual BA Framework, Category 4 / Skill B

Read project narrative and surface what actually threatens delivery.

## Inputs

- **Required** — project narrative: a status update, standup notes, a steering pack, a retro, an escalation email thread.
- **Optional** — an existing RAID log to update (`--update`), the plan/milestones, the RACI, prior period's log for trend, organisational risk appetite.

## The four categories — classify correctly, because the treatment differs

| | Definition | Test | Treatment |
|---|---|---|---|
| **Risk** | A future event that *may* happen and would affect objectives | Has not happened; uncertain | Mitigate / avoid / transfer / accept |
| **Assumption** | Something taken as true without proof, that the plan depends on | Believed true, unverified | Validate by a date; becomes an Issue if false |
| **Issue** | Something that *has* happened and is affecting the project now | Already real | Resolve; assign and track to closure |
| **Dependency** | Something needed from, or owed to, another party | External to the team's control | Confirm the date; escalate when at risk |

**The classification that is most often wrong:** a risk that has materialised is an **Issue**, not a risk — move it and say so. A risk stated as "we might not have enough developers" when the team is already short is today's issue.

Also watch: a *constraint* (a fixed, known boundary — budget, deadline, technology mandate) is not a risk; record it as a constraint and, where it creates exposure, raise the resulting risk separately. A *decision needed* is not a dependency; it is an issue with a named decision-maker.

## Scoring

**Risk score = Probability × Impact**, each 1–5, giving 1–25.

| Probability | | Impact | |
|---|---|---|---|
| 1 Rare (<10%) | 2 Unlikely (10–30%) | 1 Negligible | 2 Minor (days, absorbed) |
| 3 Possible (30–60%) | 4 Likely (60–85%) | 3 Moderate (milestone slips, budget variance) | 4 Major (go-live slips, significant overspend) |
| 5 Almost certain (>85%) | | 5 Severe (objective unachievable, regulatory breach, safety/data loss) | |

Bands: **1–4 Low** (monitor) · **5–9 Medium** (mitigate, owner assigned) · **10–15 High** (active mitigation + steering visibility) · **16–25 Critical** (escalate now, contingency required).

Any risk touching safety, regulatory breach or personal-data loss gets impact ≥4 regardless of the financial figure.

Issue severity: **S1** work stopped · **S2** milestone at risk · **S3** contained with workaround · **S4** minor.

## Workflow

1. **Read for signals** — phrases that carry RAID content, including the ones people use to avoid saying "risk":
   - Risk: *might, could, if … then, concerned that, exposed to, unless, worst case, no fallback*
   - Assumption: *assuming, we expect, should be, presumably, as long as, based on, we're counting on*
   - Issue: *blocked, broken, failed, slipped, over budget, missed, escalated, still not, went down*
   - Dependency: *waiting on, pending, needs X from Y, hand-off, third party, approval from, once they*
2. **Extract and classify** using the tests above. One item per row — a sentence carrying two concerns becomes two entries.
3. **Deduplicate against the existing log** — match on substance rather than wording; update status and score rather than appending a near-duplicate. Preserve original ids and log the change in the audit trail.
4. **Score and enrich** — probability/impact with a one-line basis, owner (role), target/review date, mitigation or resolution action.
5. **Detect what is implied but unstated** — an unowned item, a dependency with no date, an assumption underpinning the critical path, a risk whose mitigation is itself unfunded. Mark these `inferred` and flag for confirmation; do not present an inference as reported fact.
6. **Assess health** — trend by category, aging issues, overdue assumption validations, unmitigated High/Critical risks.
7. **List the escalations** — what needs a decision this week, from whom, by when.

## Output

```markdown
# RAID LOG: [Project] — [reporting period]

**Source:** [update] · **Updated:** [ISO date] · **New:** [n] · **Closed:** [n]
**Health:** 🔴 At risk — [one sentence naming the single biggest threat]

## Summary
| Category | Open | New | Closed | Critical/High | Overdue |
|---|---|---|---|---|---|
| Risks | 6 | 2 | 1 | 2 | — |
| Assumptions | 4 | 1 | 0 | — | 1 validation overdue |
| Issues | 3 | 1 | 2 | 1 (S1) | 1 aging >14d |
| Dependencies | 5 | 0 | 1 | 2 at risk | 1 date passed |

## Risks
| ID | Risk (cause → event → effect) | P | I | Score | Band | Response | Mitigation | Owner | Review |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | Because the vendor has not confirmed the API, integration may start late, delaying go-live by ~3 weeks | 4 | 4 | 16 | Critical | Mitigate | Escalate to vendor exec; prepare file-based fallback | Delivery Lead | 2026-09-19 |

## Assumptions
| ID | Assumption | Basis | Validate by | Owner | If false | Status |
|---|---|---|---|---|---|---|
| A-01 | Finance can free 2 SMEs for UAT in October | Verbal, steering 2026-08 | 2026-09-20 | Finance Mgr | UAT slips 2 weeks | ⚠️ Overdue |

## Issues
| ID | Issue | Sev | Raised | Age | Impact now | Action | Owner | Target |
|---|---|---|---|---|---|---|---|---|
| I-01 | Test environment unavailable since 2026-09-02 | S1 | 2026-09-02 | 10d | All testing stopped | Rebuild env; interim shared instance | Infra Lead | 2026-09-15 |

## Dependencies
| ID | Dependency | Direction | Party | Needed by | Status | Blocks | Owner |
|---|---|---|---|---|---|---|---|
| D-01 | Vendor API specification | Inbound | AcmeSoft | 2026-09-10 | 🔴 Overdue | R-01, FR-004 | Delivery Lead |

## Escalations this week
| # | Ask | Decision-maker | By | Consequence of delay |
|---|---|---|---|---|
| 1 | Approve file-based fallback build (~15 days) | Steering | 2026-09-19 | Go-live slips to Q1 |

## Movement since last log
- **New:** R-07 …  **Closed:** I-02 …  **Escalated:** R-01 High → Critical (vendor date passed)

## Inferred — confirm before relying on
| ID | Item | Why inferred | Confirm with |
|---|---|---|---|
| R-08 | No named owner for data migration | Never mentioned in any update | PM |
```

## Writing Rules

- Risks use cause → event → effect: *"Because [cause], [event] may occur, resulting in [effect]."* A risk without an effect cannot be scored; a risk without a cause cannot be mitigated.
- Mitigations are actions with owners and dates — "monitor the situation" is not a mitigation.
- Issues state impact **now**, in time, money or stopped work.
- Dependencies always carry direction and a needed-by date; a dependency with no date is itself a risk.
- Owners are roles, never guessed names.
- Never delete a closed item — set status `Closed` with the closure date and outcome, keeping the audit trail.
- Do not inflate: if a status update is genuinely clean, say the log is clean. Manufactured risks destroy the log's credibility faster than missed ones.

## Handoff

- Risks from a state change → `/ba-gap-analysis` ("Risks of not closing").
- Formal document section → `/ba-brd` §13.
- Recurring cadence (weekly RAID from a status thread) → `/loop`, or a scheduled routine.
