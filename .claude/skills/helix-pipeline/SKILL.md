---
name: helix-pipeline
description: "Nexahelix BA pipeline — orchestrator. Runs the full KG-BA chain end-to-end: /helix-ingest (Jack) → /helix-graph (Emma) → /helix-stories (David↔Sarah loop) → /helix-rtm (traceability + ERD) → /helix-publish (Paul), maintaining helix_state.json, enforcing quality gates and HIL checkpoints, and resuming from any completed stage. Use whenever raw requirements should be taken all the way to validated stories, an RTM, and published tickets — triggers: 'helix pipeline', 'run the helix pipeline', 'run the full BA pipeline on this', 'nexahelix this transcript', 'take this from raw notes to Jira', 'run the KG-BA chain', 'resume the helix run'. For a single stage, invoke that stage's skill directly instead."
argument-hint: [raw input / file / Basecamp-Jira ref] or "resume {project-slug}"
---

# Helix Pipeline — Nexahelix BA Chain Orchestrator

Run the five-stage KG-BA pipeline as a state machine with quality gates. Each stage is its own skill — invoke them in order via the Skill tool, letting each read/write the shared state.

```
Ingestion (Jack) → Graph (Emma) → Stories (David ⇄ Sarah, ≤3 loops) → RTM (+ERD) → HIL → Publish (Paul)
                        │ CRITICAL conflict            │ <85% after 3 loops        │ coverage <80%
                        ▼                              ▼                           ▼
                    escalate to BA               needs_human flag          needs_gap_resolution loop
```

## Stage Map

| # | Skill | Persona / IDDA | Gate to advance |
|---|---|---|---|
| 1 | `/helix-ingest` | Jack / Identify | `status: ok` (no blocking ambiguity) |
| 2 | `/helix-graph` | Emma / Detect-arch | compatibility ≠ CRITICAL |
| 3 | `/helix-stories` | David↔Sarah / Deconstruct+Detect | all stories PASSED ≥85%, or degraded set human-approved |
| 4 | `/helix-rtm` | Traceability + ERD | `coverage_pct ≥ 80` (see its coverage-thresholds reference for phase-specific values) |
| 5 | `/helix-publish` | Paul / Align | mandatory HIL approval before external sync |

## Orchestration Procedure

1. **Initialize** — derive `{project-slug}` from the input; create `helix_runs/{project-slug}/` and write `helix_state.json`:

```json
{
  "pipeline_id": "HELIX-{project-slug}-{ISO-date}",
  "project": "{project-slug}",
  "mode": "interactive | autonomous",
  "current_stage": "ingest",
  "stages": {
    "ingest":  { "status": "pending | running | complete | needs_human", "artefacts": [], "signal": null },
    "graph":   { "status": "pending", "artefacts": [], "signal": null },
    "stories": { "status": "pending", "artefacts": [], "signal": null, "iterations_by_story": {} },
    "rtm":     { "status": "pending", "artefacts": [], "signal": null, "coverage_pct": null },
    "publish": { "status": "pending", "artefacts": [], "signal": null }
  },
  "hil_log": [ { "checkpoint": "", "timestamp": "", "decision": "" } ],
  "audit_trail": []
}
```

2. **Run stages in order** via the Skill tool. After each stage: parse its signal block, record it in `helix_state.json`, and apply the gate rules:
   - `status: ok` → advance to `next`.
   - `status: escalate` (Emma CRITICAL conflict) → stop, present the conflict table, wait for BA design clarification, then re-run /helix-graph.
   - `status: needs_human` → present the HIL options for that stage (see stage skill); resume on decision.
   - RTM `loop: needs_gap_resolution` → present the gap list; either loop back to /helix-stories to fill missing ACs / link orphans (one gap-resolution pass), or get explicit BA acceptance to proceed below threshold. Log the decision.
3. **HIL checkpoints** (from orchestration rules): optional review after ingest (actors/entities), mandatory approval before publish. In autonomous mode (cron/loop), skip optional checkpoints, never skip the publish gate — end the run at `stories`/`rtm` with a `needs_human` state instead of publishing unattended.
4. **Resume** — on "resume {project-slug}": read `helix_state.json`, report per-stage status, and continue from the first non-complete stage. Never re-run completed stages unless the user asks (inputs changed).
5. **Final report** — end with a bilingual (EN/VN) run summary: stage table with status/artefacts, story pass rate + avg confidence, RTM coverage %, published ticket keys, residual `needs_human` backlog, and the closing signal:

```json
{
  "pipeline": "nexahelix",
  "phase": "pipeline_complete",
  "project": "{project-slug}",
  "stages_complete": 5,
  "coverage_pct": 0,
  "published": [],
  "residual_backlog": [],
  "loop": "complete | needs_human"
}
```

## Execution Modes

- **Inline (default)** — run each stage skill sequentially in this conversation. Right for a single feature / one meeting's worth of scope.
- **Fan-out** — for large scope (multiple independent features), after stage 2 split by feature and run /helix-stories per feature via parallel subagents, then merge registers before /helix-rtm. Only when the user asks for it or scope is clearly large (>~8 flows); merging must dedupe `REQ-`/`US-` IDs by re-numbering.

## Rules

- Never let a stage write outside `helix_runs/{project-slug}/`.
- Every stage transition appends one line to `audit_trail` (stage, timestamp, gate result) — this becomes Paul's transaction history.
- If the user provides mid-pipeline artefacts (e.g. an existing requirements register), enter at the matching stage — the chain is joinable at any point where required inputs exist.
- Related knowledge skills: load `/babok-v3` for technique guidance inside any stage; `/ba-glossary` for term definitions. The generic `/prd-traceability-matrix` is NOT part of this chain — /helix-rtm is.
