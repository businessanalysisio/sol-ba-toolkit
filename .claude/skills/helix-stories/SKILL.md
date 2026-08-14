---
name: helix-stories
description: "Nexahelix BA pipeline — Stage 3 (David + Sarah writer↔validator loop, IDDA Deconstruct + Detect). Synthesizes ingested metadata and the architectural impact matrix into INVEST user stories with Gherkin acceptance criteria, then adversarially audits each story (confidence score = completeness×0.4 + testability×0.3 + architectural alignment×0.3, pass ≥85%, max 3 rework loops). Produces user_stories.md, validation_report.md, and requirements_register.json — the register /helix-rtm consumes. Triggers: 'helix stories', 'run David on this', 'write user stories from the ingested requirements', 'draft and validate stories', 'INVEST stories with Gherkin', or as stage 3 when /helix-pipeline runs."
---

# Helix Stories — Stage 3 of the Nexahelix BA Pipeline (David ↔ Sarah / IDDA: Deconstruct + Detect)

Run the **writer↔validator quality loop**: draft as **David, the Specification Agent**, audit as **Sarah, the Validation Agent**. The two roles alternate inside this one stage until every story passes the quality gate or the loop budget is exhausted.

**Position in chain**: `helix-ingest → helix-graph → helix-stories → helix-rtm → helix-publish`
**Conventions**: same run directory, `helix_state.json`, and signal-block rules as defined in /helix-ingest.

## Inputs

- **Required**: `ba_context.json` (+ `ingestion_metadata.md`) from /helix-ingest and `impact_matrix.md` + `strategy_analysis.md` from /helix-graph. If the graph stage was skipped, warn that stories will lack architectural anchors and confidence scoring loses its architectural-alignment component evidence.
- **Optional**: BA rework notes from a human review round.

## Part A — David drafts (IDDA: Deconstruct)

1. **Deconstruct scope** — split each functional flow into discrete slices of business value. INVEST-small: >5 happy-path steps or crossing multiple domain components → split the story.
2. **Anchor architecture** — embed Emma's guardrails: dependencies (`CONF-nn`, `NOTE-nn`), reusable assets, sequencing blocks.
3. **Draft** each story in the exact structure:

```markdown
# USER STORY: US-nnn: [Title]
## 1. STORY DESCRIPTION — As a [Actor ID + name] / I want to / So that
## 2. CONTEXT & ARCHITECTURAL ANCHORS — Target Component, Source Requirements (Jack refs),
   Key Dependencies (Emma refs), Reusable Assets
## 3. STORY PRECONDITIONS
## 4. EXECUTION FLOWS — Main Happy Path (numbered) + Alternative/Exception Flows
## 5. ACCEPTANCE CRITERIA (GHERKIN) — Scenario blocks: Given / And / When / Then / And
## 6. DATA CONSTRAINTS & VALIDATIONS — exact types, lengths, formats
```

**Zero vague phrasing**: no "fast", "secure", "user-friendly" — exact measurable parameters only ("< 500ms under normal load"). Every element in an execution flow must be established in preconditions. Exception flows must cover validation failures, network drops, and external API timeouts flagged in Emma's cascade analysis.

## Part B — Sarah audits (IDDA: Detect)

For **each** story, produce a Logic Audit section:

1. **QA stress test** — boundary conditions on every input; technical failure paths (API 401/403/500/502, network drop mid-write, DB lockout); logical integrity; Gherkin testability.
2. **Governance** — role authorization enforced; AuditLog present for PII/financial mutations; privacy bounds respected.
3. **Confidence score** (show the arithmetic):
   `Score = Completeness×0.4 + Testability×0.3 + ArchitecturalAlignment×0.3`
4. **Verdict** — `PASSED` (≥85%) or `REJECTED` (<85%) with a gap table: `| Severity (Critical/Major/Minor) | Category (Logic/Data/Boundary/Failure) | Gap | Proposed Solution |` and numbered action items for David.

Sarah is adversarial and does **not** rewrite stories — she specifies fixes; David applies them.

## Loop & Termination Policy (from orchestration rules)

- **Max 3 rework iterations** per story. Track `iterations` per story in `helix_state.json`.
- After 3 loops still <85% → **graceful degradation**: keep the latest draft, attach Sarah's latest audit, flag the story `needs_human`, and continue with the remaining stories.
- Log each iteration's score in the validation report so score progression is visible.

## Outputs

1. **`user_stories.md`** — all final story drafts (passed + degraded), in the structure above.
2. **`validation_report.md`** — per story: audit status, score breakdown, iteration history, remaining gaps, IDDA quality checklist.
3. **`requirements_register.json`** — the machine register consumed by /helix-rtm:

```json
{
  "project": "string",
  "generated_at": "ISO-8601",
  "requirements": [
    {
      "req_id": "REQ-001",
      "type": "Stakeholder | Solution | Transition",
      "title": "string",
      "description": "string",
      "business_need_ref": "BN-01",
      "story_id": "US-001",
      "priority": "Must Have | Should Have | Could Have | Won't Have",
      "acceptance_criteria": ["Given ... When ... Then ..."],
      "source_refs": ["jira:KEY-123", "basecamp:id", "flow:F-01", "rule:BR-02"],
      "lifecycle_state": "Defined | Validated | In Delivery | Done",
      "confidence_score": 0,
      "audit_status": "PASSED | NEEDS_HUMAN",
      "owner": null
    }
  ]
}
```

Derivation: each story yields one Solution requirement (the story itself) and links up to a Stakeholder requirement / business need (`BN-nn` from strategy_analysis.md). Priorities use MoSCoW; if the source material gives no priority, propose one and mark it `(proposed)` in the register title.

## Human-in-the-Loop

If any story ends `needs_human`, or if running interactively before hand-off to /helix-rtm, present: passed count, degraded stories with their blocking gaps, and the three HIL options — **Approve & continue**, **Edit inline**, **Request rework** (feeds back into Part A as a 4th, human-authorized iteration).

## Signal Contract

```json
{
  "pipeline": "nexahelix",
  "phase": "stories_complete",
  "project": "{project-slug}",
  "artefacts": ["user_stories.md", "validation_report.md", "requirements_register.json"],
  "stories": { "total": 0, "passed": 0, "needs_human": 0 },
  "avg_confidence": 0,
  "status": "ok | needs_human",
  "next": "/helix-rtm"
}
```
