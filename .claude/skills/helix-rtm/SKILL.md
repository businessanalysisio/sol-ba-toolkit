---
name: helix-rtm
description: Nexahelix BA pipeline — Stage 4 (traceability). Five-layer Requirements Traceability Matrix (business needs → stakeholder requirements → solution requirements → test cases → Jira/Basecamp source items) PLUS a domain ERD derived from the requirements, with coverage-gap detection and an agentic loop signal. Distinct from the generic prd-traceability-matrix skill (HTML-only, no layers/ERD/loop) — prefer helix-rtm whenever the work is part of the Lingble/Nexahelix BA pipeline. Runs after /helix-stories emits stories_complete (inputs from /helix-ingest, /helix-graph, /helix-stories), or standalone on any requirements register / PRD document set. Triggers: "helix rtm", "run the rtm loop", "RTM with ERD", "make traceability matrix", "link requirements to source", "requirements coverage", "trace stories to business need", or as stage 4 when /helix-pipeline runs.
---

# Helix RTM Skill (Nexahelix BABOK Pipeline)

Produce a Requirements Traceability Matrix (RTM) that provides bidirectional coverage from business needs down to source items, and from source items back up to business goals — plus a domain ERD derived from the requirements. The RTM + ERD bundle is the primary hand-off artefact to engineering, QA, and product leadership.

**Position in chain**: `helix-ingest → helix-graph → helix-stories → helix-rtm → helix-publish`
**Conventions**: same run directory (`helix_runs/{project-slug}/`), `helix_state.json`, and signal-block rules as defined in /helix-ingest.

Requires: `requirements_register.json` (from `/helix-stories`), `strategy_analysis.md` (from `/helix-graph`), and `ba_context.json` (from `/helix-ingest`). Standalone mode: if given a requirements register or PRD set outside a pipeline run, build the same inputs ad hoc from what is provided and note which layers are thin. Load `/babok-v3` for traceability technique guidance when needed.

---

## RTM Architecture

The matrix traces across five vertical layers:

```
Layer 1: Business Need        ← strategy_analysis.md
    ↓
Layer 2: Stakeholder Req      ← requirements_register.json (type: Stakeholder)
    ↓
Layer 3: Solution Req         ← requirements_register.json (type: Solution)
    ↓
Layer 4: Test / AC            ← acceptance_criteria from RADD
    ↓
Layer 5: Source Item          ← ba_context.json (Jira key / Basecamp ID)
```

Every row in the RTM must be traceable both **downward** (from business need to implementation) and **upward** (from Jira ticket to business justification).

---

## Step 1 — Build the RTM Data Model

Produce `rtm_data.json`:

```json
{
  "rtm_id": "RTM-{project}-{timestamp}",
  "project": "string",
  "generated_at": "ISO-8601",
  "rows": [
    {
      "rtm_row_id": "RTM-001",
      "business_need_ref": "BN-01",
      "business_need_summary": "string",
      "stakeholder_req_id": "REQ-{n}",
      "stakeholder_req_title": "string",
      "solution_req_id": "REQ-{n} | null",
      "solution_req_title": "string | null",
      "priority": "Must Have | Should Have | Could Have | Won't Have",
      "acceptance_criteria": ["string"],
      "test_coverage": "Covered | Partial | Not Covered",
      "source_items": [
        {
          "id": "string",
          "source": "jira | basecamp",
          "title": "string",
          "status": "string",
          "url": "string | null"
        }
      ],
      "lifecycle_state": "string",
      "coverage_gaps": ["string"],
      "owner": "string | null"
    }
  ],
  "coverage_summary": {
    "total_reqs": 0,
    "fully_traced": 0,
    "partially_traced": 0,
    "orphaned_reqs": 0,
    "orphaned_items": 0
  }
}
```

---

## Step 2 — Detect Coverage Gaps

After building rows, run these checks:

| Check | Flag as |
|---|---|
| Requirement with no source item linked | `orphaned_req` |
| Source item with no requirement linked | `orphaned_item` |
| Requirement with no acceptance criteria | `missing_AC` |
| Must Have req in Backlog/Defined state | `delivery_risk` |
| Requirement with conflicting source items (contradictory scope) | `conflict` |

Add flagged items to `coverage_gaps` on the row AND aggregate in `coverage_summary`.

---

## Step 3 — Generate the HTML RTM Artefact

Produce `traceability_matrix.html` — a self-contained, interactive RTM with:

**Header section**:
- Project name, RTM ID, date
- Coverage scorecard: % fully traced, # delivery risks, # orphaned items

**Interactive table** with columns:
| RTM ID | Business Need | Stakeholder Req | Solution Req | Priority | AC | Test Coverage | Status | Source Items | Flags |

**Filtering controls**:
- Filter by Priority (MoSCoW)
- Filter by Status (lifecycle state)
- Filter by Coverage Gap type
- Filter by Source (Jira / Basecamp)
- Search bar (searches title + ID fields)

**Row expansion**: clicking a row expands to show:
- Full acceptance criteria list
- All linked source items (as clickable Jira links if URL present)
- Coverage gap details

**Visual indicators**:
- 🔴 Must Have + not Done = delivery risk
- 🟡 Partial coverage
- 🟢 Fully traced + Done
- ⚠️ Orphaned / missing AC

**Design guidelines for the HTML**:
- Use a clean, data-dense layout (think Jira/Linear aesthetic)
- Monospace font for IDs, sans-serif for everything else
- Sticky header row
- Export to CSV button (downloads filterable view as CSV)
- No external dependencies — fully self-contained HTML/CSS/JS

---

## Step 4 — Generate the Domain ERD

Produce `domain_erd.md` — an entity-relationship diagram of the solution's data model, **derived from the requirements themselves** (entities are the nouns that appear in ACs, data fields, and developer notes). This gives engineering a data-model starting point that is provably grounded in requirements.

**Derivation rules:**
1. Scan ACs, field lists, and developer/QA notes for persistent nouns (things that are created, stored, listed, audited, or referenced across requirements).
2. Promote each to an entity with its key attributes (use field names verbatim from the requirements where available).
3. Mark attributes whose definition is still open (blocked OQ, pending schema) with a `_TBD` suffix — the ERD must expose unknowns, not paper over them.
4. Capture cardinality from the requirements' language ("each tenant has its own templates" → `TENANT ||--o{ CSV_TEMPLATE`).

**Output format** — Mermaid `erDiagram` in a fenced block (renders in Obsidian/GitHub/Confluence), followed by an **Entity Traceability Table**:

| Entity | Introduced by | Key requirements touching it | Open questions |
|---|---|---|---|

Every entity must trace to at least one RTM row; an entity with no requirement is a scope smell — flag it. A requirement that stores/lists/audits data but maps to no entity indicates a missing entity — flag that too, and add both to `coverage_gaps`.

---

## Step 5 — Generate Markdown Summary (bilingual)

Produce `rtm_summary.md` in Vietnamese/English bilingual format (matching Lingble team standard):

```markdown
# Requirements Traceability Matrix — {Project}
# Ma Trận Truy Xuất Yêu Cầu — {Project}

**Generated / Tạo lúc**: {date}
**RTM ID**: {id}

## Coverage Summary / Tóm Tắt Độ Phủ
| Metric | Value |
|---|---|
| Total Requirements | {n} |
| Fully Traced | {n} ({%}) |
| Orphaned Requirements | {n} |
| Orphaned Source Items | {n} |
| Delivery Risks (Must Have not Done) | {n} |

## Delivery Risks / Rủi Ro Giao Hàng
{table of Must Have items not yet Done}

## Orphaned Items / Mục Chưa Liên Kết
{list of source items with no requirement}

## Recommended Actions / Đề Xuất Hành Động
{numbered list of follow-up actions, prioritised}
```

---

## Step 6 — Optionally Create Jira Issues for Gaps

If `coverage_gaps` contains orphaned items or missing acceptance criteria, and Atlassian MCP is connected:

- Offer (do not auto-execute) to create Jira sub-tasks for: "Write acceptance criteria for {req_title}"
- Format as: `[RTM-Gap] {requirement_title} — Missing AC / Traceability`
- Ask user to confirm before creating any issues

---

## Agentic Loop Contract

- **Input**: `requirements_register.json`, `strategy_analysis.md`, `ba_context.json`
- **Output signal**:
  - `{ pipeline: "nexahelix", phase: "rtm_complete", project: "{project-slug}", artefacts: ["rtm_data.json", "traceability_matrix.html", "domain_erd.md", "rtm_summary.md"], coverage_pct: n, next: "/helix-publish" }`
- **Loop completion signal**: if `coverage_pct >= 80` (or the phase-specific threshold from `references/coverage-thresholds.md`), add `{ loop: "complete", status: "ready_for_review" }` — /helix-pipeline then advances to /helix-publish. Otherwise add `{ loop: "needs_gap_resolution", gaps: [...] }` — the orchestrator loops back to /helix-stories for one gap-resolution pass or asks the BA to accept the coverage level.

---

## Output Summary Block

```
## Traceability Matrix Complete
- Total requirements traced: {n}
- Coverage: {n}% fully traced
- Delivery risks: {n} Must Have items not Done
- Orphaned requirements: {n}
- Orphaned source items: {n}
- Entities in domain ERD: {n} ({n} with open schema questions)
- Artefacts: traceability_matrix.html, domain_erd.md, rtm_summary.md, rtm_data.json
```

---

## Reference Files

- `references/rtm-templates.md` — RTM table variants by project type
- `references/coverage-thresholds.md` — recommended coverage % by project phase
