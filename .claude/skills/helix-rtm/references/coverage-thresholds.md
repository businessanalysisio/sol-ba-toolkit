# Recommended Coverage Thresholds by Project Phase

`coverage_pct` = fully traced requirements ÷ total requirements. A row is *fully
traced* when it has a business need ref, at least one acceptance criterion, and at
least one linked source item.

These thresholds drive the agentic loop signal: at or above the threshold for the
current phase, emit `{ loop: "complete" }`; below it, emit
`{ loop: "needs_gap_resolution" }`.

| Phase | Min coverage | Orphaned reqs allowed | Missing AC allowed | Notes |
|---|---|---|---|---|
| Discovery / Strategy Analysis | 50% | Yes | Yes | RTM is a working draft; gaps are expected and listed as elicitation backlog. |
| Requirements Definition (PRD draft) | 70% | Must Haves: no | Must Haves: no | All Must Have rows fully traced before PRD review. |
| PRD Sign-off / Hand-off to delivery | 80% | No | No | Default loop threshold. Every requirement linked both directions. |
| Mid-delivery (sprint execution) | 90% | No | No | New tickets created during delivery must be linked back within the sprint. |
| Pre-release / UAT | 95% | No | No | Remaining untraced rows must be explicitly descoped (Won't Have) with rationale. |
| Compliance / audit projects (any phase) | 100% | No | No | No tolerance — every clause traced with evidence. |

## Severity escalation

- A Must Have requirement that is `Not Covered` for tests counts as a **delivery
  risk** regardless of overall coverage %.
- More than 10% orphaned source items at any phase suggests scope creep — recommend a
  backlog review action in `rtm_summary.md` rather than silently linking them.
- If coverage drops between two RTM generations for the same project, flag the
  regression explicitly in the summary.

## Default

If the project phase cannot be determined from the inputs, use the **80%** sign-off
threshold (matches the Agentic Loop Contract in SKILL.md).
