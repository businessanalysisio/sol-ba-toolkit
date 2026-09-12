---
name: ba-user-stories
description: "Virtual BA framework — Elicitation Skill A. Converts raw, unstructured stakeholder material (meeting notes, interview transcripts, feature requests, email threads, Slack/Basecamp chatter) into atomic Agile user stories in 'As a / I want to / So that' form, with INVEST checks, MoSCoW priority, story-point estimate and a traceable link back to the source sentence. Emits both markdown and JSON. Use when someone has messy notes and needs a backlog — triggers: 'write user stories', 'turn these notes into stories', 'convert this transcript into a backlog', 'split this requirement into stories', 'As a... I want to...', 'groom this feature request'. For the governed Nexahelix pipeline stage (with adversarial Sarah audit and confidence scoring) use /helix-stories instead."
argument-hint: [raw notes / file path / feature request] (optional: --format json|md, --priority-model moscow|wsjf)
---

# BA User Story Generation — Virtual BA Framework, Category 1 / Skill A

Convert unstructured stakeholder information into a clean, atomic, prioritized set of Agile user stories. This skill does **stories only** — acceptance criteria are the job of `/ba-gherkin`, which consumes this skill's output.

**Agent instruction (canonical):** *Identify distinct actors and goals. Split large requirements into atomic stories. Prioritize based on the provided context.*

## Inputs

- **Required** — raw material: pasted meeting notes, an interview transcript, a feature request summary, a file path, or a list of bullet asks.
- **Optional** — persona list, existing backlog (to dedupe against), release/sprint context, priority model (`moscow` default, `wsjf` when business value/effort numbers exist), target format.

If the input contains no identifiable actor **and** no identifiable goal, stop and ask for the missing half rather than inventing a persona.

## Workflow

1. **Normalize** — strip transcript noise (fillers, crosstalk, scheduling chatter) without losing semantics. Keep a pointer to the source line for every retained statement; that pointer becomes `source_quote`.
2. **Identify actors** — every distinct *who*. Classify each as `End User`, `Internal Staff`, `Admin`, `External Partner`, or `System`. Merge synonyms ("the ops guy", "operations") into one actor and record the alias.
3. **Identify goals** — every distinct *what they want to be able to do*. A goal is a capability, not a UI element: "approve an invoice", not "a green button".
4. **Split to atomic** — one story = one actor + one goal + one outcome. Apply these split patterns when a requirement is compound:
   - **by workflow step** (submit → review → approve)
   - **by business rule variation** (domestic vs international payment)
   - **by CRUD operation** (create / view / edit / delete)
   - **by data variation** (single upload vs bulk upload)
   - **by role** (what a manager sees vs what an agent sees)
   - **by happy path first** (core path as one story, exception handling as its own)
   A story that needs "and" between two verbs in the *I want* clause is almost always two stories.
5. **Write the story** — strict syntax, business language, no solution design:
   `As a [actor], I want to [capability], so that [measurable business benefit].`
   The *so that* clause must state a benefit, never restate the capability.
6. **INVEST check** — score each story against Independent, Negotiable, Valuable, Estimable, Small, Testable. Any story failing **Small** or **Testable** goes back to step 4. Record failures you cannot fix as `invest_flags`.
7. **Prioritize** — MoSCoW (`Must` / `Should` / `Could` / `Won't`) from the context given: explicit stakeholder emphasis, regulatory or contractual language, blocking dependencies, and stated deadlines. When business value and effort numbers are supplied, use WSJF instead and show the arithmetic. **Never invent priority** — if the source gives no signal, mark `Should` and add the story to `open_questions`.
8. **Estimate** — modified Fibonacci points (1, 2, 3, 5, 8, 13). Anything ≥13 is an epic: keep it, mark `is_epic: true`, and list its child story IDs.
9. **Harvest open questions** — anything ambiguous, contradictory, or unstated that blocks writing the story. These are elicitation follow-ups, not assumptions to paper over.

**Zero invention.** Every story traces to something actually said. If you must assume, write it under Assumptions with an `ASM-nn` id — never silently inside a story.

## Output

### Markdown (default)

```markdown
# USER STORY BACKLOG: [Feature / Session Name]

**Source:** [origin] | **Generated:** [ISO date] | **Stories:** [n] | **Epics:** [n]

## Actors
| Actor ID | Actor | Type | Aliases in source |
|---|---|---|---|

## Stories
### [US-01] [Short title]
> **As a** [actor], **I want to** [capability], **so that** [benefit].

- **Priority:** Must | **Estimate:** 3 pts | **Epic:** [EP-01 / —]
- **INVEST:** ✅ I N V E S T  (flags: —)
- **Source:** "[verbatim quote from input]"
- **Depends on:** [US-nn / —]

## Epics
| Epic ID | Epic | Child stories | Total points |
|---|---|---|---|

## Assumptions
- **[ASM-01]** [assumption] — affects [US-nn]

## Open Questions (elicitation backlog)
| ID | Question | Blocks | Ask |
|---|---|---|---|
| Q-01 | [question] | US-03 | [stakeholder] |
```

### JSON (`--format json`, or when handing off to another skill)

```json
{
  "feature": "string",
  "generated_at": "ISO-8601",
  "source": "string",
  "actors": [ { "actor_id": "A-01", "name": "", "type": "End User | Internal Staff | Admin | External Partner | System", "aliases": [""] } ],
  "stories": [
    { "story_id": "US-01", "title": "", "actor_id": "A-01",
      "story": "As a ..., I want to ..., so that ...",
      "as_a": "", "i_want": "", "so_that": "",
      "priority": "Must | Should | Could | Won't", "estimate": 3,
      "epic_id": "EP-01 | null", "is_epic": false, "children": [],
      "invest": { "independent": true, "negotiable": true, "valuable": true,
                  "estimable": true, "small": true, "testable": true },
      "invest_flags": [""], "depends_on": ["US-nn"], "source_quote": "" }
  ],
  "assumptions": [ { "id": "ASM-01", "text": "", "affects": ["US-01"] } ],
  "open_questions": [ { "id": "Q-01", "question": "", "blocks": ["US-03"], "ask": "" } ]
}
```

Markdown and JSON are dual representations — every story present in one must appear in the other.

## Quality Bar (self-check before responding)

- [ ] No story contains "and" joining two capabilities in the *I want* clause.
- [ ] No *so that* clause restates the *I want* clause.
- [ ] No UI/technology nouns in the story sentence (button, dropdown, API, table) unless the stakeholder constraint is genuinely about that technology.
- [ ] Every story has a `source_quote` traceable to the input.
- [ ] Every actor named in a story exists in the actors table.
- [ ] Priorities reflect stated context, not your own product judgement.

## Handoff

- Acceptance criteria → `/ba-gherkin` (feed it this skill's JSON or a single story).
- Formal document → `/ba-brd` (stories become the Functional Requirements section).
- Process visualization → `/ba-diagram` (when stories describe a multi-step workflow).
- Governed pipeline with adversarial validation → `/helix-stories`.

End with a one-line handoff suggestion naming the next skill.
