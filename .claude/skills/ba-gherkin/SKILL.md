---
name: ba-gherkin
description: "Virtual BA framework — Elicitation Skill B. Turns a user story (or a set of them) into testable BDD acceptance criteria in Gherkin Given/When/Then syntax, covering happy paths, edge cases, error states, permissions and non-functional bounds, with Scenario Outlines + Examples tables for data-driven rules. Outputs valid .feature files QA can run. Use when acceptance criteria, BDD scenarios or a feature file are needed — triggers: 'write acceptance criteria', 'gherkin', 'given when then', 'BDD scenarios', 'make this story testable', 'write a .feature file', 'define done for this story'."
argument-hint: [user story or story JSON / file path] (optional: --tags, --outline-only)
---

# BA Gherkin (BDD) Creation — Virtual BA Framework, Category 1 / Skill B

Produce acceptance criteria that a developer can build against and a tester can execute without asking a follow-up question.

**Agent instruction (canonical):** *Write acceptance criteria covering happy paths, edge cases, and error states.*

## Inputs

- **Required** — one user story ("As a… I want… so that…"), a story JSON block from `/ba-user-stories`, or a plain capability description.
- **Optional** — business rules and validation limits, roles/permission matrix, data formats and boundary values, NFR targets (response time, volume), existing `.feature` files for naming consistency.

If the story carries no business rules, ask for the rules **or** generate scenarios and mark every guessed boundary value as `@assumption` — never present an invented threshold as agreed.

## Scenario Coverage Model

For each story, work through all six lanes. Skip a lane only when it genuinely does not apply, and say so.

| Lane | What it covers | Minimum |
|---|---|---|
| **Happy path** | The intended flow with valid data | 1 scenario |
| **Alternate path** | Valid but non-default routes (different role, different entry point) | as many as exist |
| **Boundary** | Min, max, min−1, max+1, zero, empty, first/last | one per limit |
| **Error / negative** | Invalid input, failed validation, downstream failure, timeout | one per failure mode |
| **Permission / security** | Unauthorized actor, expired session, cross-tenant access | one per restricted actor |
| **Non-functional** | Performance, volume, concurrency, audit/logging bounds — only when a target is stated | one per stated target |

## Workflow

1. **Extract the rule set** — list every business rule, constraint and limit implied by the story before writing a line of Gherkin. Rules with no stated value become `@assumption` scenarios plus an open question.
2. **Name the feature** — `Feature:` states the capability and carries the story's *so that* benefit as its description line.
3. **Set `Background:`** — shared preconditions only (authenticated actor, seeded data). Never put the trigger action in Background.
4. **Write scenarios** per the coverage model. One behaviour per scenario.
5. **Collapse repetition** — three or more scenarios differing only in data become one `Scenario Outline` with an `Examples:` table.
6. **Tag** — `@happy @boundary @error @permission @nfr @assumption`, plus the story id (`@US-01`) for traceability and `@manual` where automation is impractical.
7. **Validate syntax** — see the checklist below.

## Writing Rules

- **Given** = state that already exists (past/passive). **When** = exactly one action by one actor. **Then** = one observable, assertable outcome.
- Never chain two actions with `When … And …` — that is two scenarios, or a missing `Given`.
- Declarative, not imperative: `When the analyst submits the expense claim`, not `When the analyst clicks the blue Submit button`.
- Third person, present tense, one actor per scenario, named explicitly.
- **Then** must be machine-checkable: a message, a state, a stored value, a status code — never "the user is happy" or "it works correctly".
- Concrete data in the `Examples:` table, not prose ("over the limit" → `1000.01`).
- No UI implementation detail unless the requirement is genuinely about the UI.

## Output

A fenced `gherkin` block, valid as a `.feature` file:

```gherkin
@US-01 @expenses
Feature: Submit an expense claim
  So that employees are reimbursed within the monthly payroll cycle

  Background:
    Given an authenticated employee "Mai" in cost centre "OPS-12"
    And an approval limit of 1000.00 USD for cost centre "OPS-12"
    And a receipt is required for any claim over 50.00 USD

  @happy
  Scenario: Claim within the approval limit is submitted for approval
    Given Mai has a draft claim of 450.00 USD with a receipt attached
    When Mai submits the claim
    Then the claim status is "Pending Approval"
    And the cost centre approver receives a notification

  @boundary
  Scenario Outline: Claim amounts at the approval limit boundary
    Given Mai has a draft claim of <amount> USD with a receipt attached
    When Mai submits the claim
    Then the claim status is "<status>"

    Examples:
      | amount  | status              |
      | 999.99  | Pending Approval    |
      | 1000.00 | Pending Approval    |
      | 1000.01 | Pending Escalation  |

  @error
  Scenario: Claim without a receipt is rejected at submission
    Given Mai has a draft claim of 450.00 USD with no receipt attached
    When Mai submits the claim
    Then the claim is not submitted
    And Mai sees the message "A receipt is required for claims over 50.00 USD"

  @permission
  Scenario: An employee cannot submit a claim for another cost centre
    Given Mai has a draft claim against cost centre "FIN-03"
    When Mai submits the claim
    Then the submission is refused with "Not authorised for this cost centre"
```

Follow the block with:

```markdown
## Coverage Summary
| Lane | Scenarios | Notes |
|---|---|---|
| Happy | 1 | |
| Boundary | 3 (outline) | limit = 1000.00 USD |
| Error | 1 | |
| Permission | 1 | |
| Alternate | 0 | no alternate entry point in scope |
| Non-functional | 0 | no stated target — see Q-02 |

## Assumptions & Open Questions
| ID | Item | Type | Needs |
|---|---|---|---|
| Q-02 | No response-time target stated for submission | Open question | Product owner |
```

## Syntax Checklist (run before responding)

- [ ] Exactly one `Feature:` per file; every `Scenario`/`Scenario Outline` has a unique, behaviour-describing name.
- [ ] Every `Scenario Outline` has an `Examples:` table, and every `<placeholder>` appears as a column header (and vice versa).
- [ ] No `When` step contains `And` joining two actions.
- [ ] Every `Then` is assertable.
- [ ] Steps are consistently phrased across scenarios (same wording for the same action) so step definitions can be reused.
- [ ] Every invented value is tagged `@assumption` and listed in the table.

## Handoff

- Stories not yet written → `/ba-user-stories` first.
- Scenarios become the QA checklist in `/helix-publish` and the test-case layer (Layer 4) in `/helix-rtm`.
- Formal sign-off document → `/ba-brd`.
