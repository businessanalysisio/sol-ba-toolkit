---
name: ba-insights
description: "Virtual BA framework — Data Skill B. Turns raw query results, CSV extracts or JSON data into an executive narrative: the headline finding first, then quantified trends, outliers and segment drivers, then prioritized recommendations with the decision each one supports — plus an explicit statement of what the data cannot tell you. Use when numbers need to become a story an executive can act on — triggers: 'summarize this data', 'what does this data tell us', 'explain these results', 'write up these findings', 'insight summary', 'executive summary of this report', 'analyze this CSV', 'what are the trends here'."
argument-hint: [CSV / JSON / query results / file path] (optional: --audience exec|product|ops, --length brief|full)
---

# BA Insight Summarization — Virtual BA Framework, Category 3 / Skill B

Explain what the data means to someone who will not read the table — and who has to make a decision.

## Inputs

- **Required** — the data: query results, a CSV/JSON file or path, a pasted table.
- **Optional** — the question the data was meant to answer, targets/benchmarks/prior periods, audience, known upcoming decisions, segment definitions, data caveats.

Ask for the **prior period or target** if none is given — a number without a comparison supports no conclusion. If unavailable, say so in the write-up rather than implying a trend.

## Workflow

1. **Profile the data first** — rows, columns, grain (what one row is), time span, completeness (nulls per column), and obvious quality problems (duplicates, negative amounts where impossible, placeholder dates, unit inconsistency, a partial final period). Quality problems found here go in the write-up; a partial current month masquerading as a decline is the single most common false insight. When the data is large or needs arithmetic, compute with a script rather than by eye, and say the numbers were computed.
2. **Quantify the movement** — for each key measure: current value, comparison value, absolute change, % change, and direction against the target. Distinguish a *trend* (consistent direction over ≥3 periods) from a *fluctuation* (one period's move within historical range).
3. **Decompose** — where a total moved, find which segment, product, region or cohort moved it, and by how much of the total change. "Revenue fell 8%" is a fact; "revenue fell 8%, and 6 of those 8 points came from one enterprise segment" is an insight.
4. **Find outliers** — values far from the distribution, step changes, reversals, and segments moving against the overall direction. State the value, the expected range, and the size of the deviation.
5. **Interpret, labelled as interpretation** — offer the most plausible explanations, clearly separated from the observation, and say what would confirm or kill each one. Correlation stated as causation is the failure mode this step exists to prevent.
6. **Recommend** — each recommendation names the action, the owner role, the expected effect, and the decision it feeds. No recommendation without a finding behind it.
7. **State the limits** — what this data cannot answer, and what you would need next.

## Statistical Honesty

- Never assert causation from correlation; name the confounder you can see.
- Give small-sample caveats: percentages on n < 30 get the raw counts alongside; a rate over n < 10 should usually be expressed as counts only.
- Percentage change on a small base is misleading — pair "+200%" with "(3 → 9)".
- Do not extrapolate a trend beyond the observed range without saying it is an extrapolation.
- Check for a partial period, seasonality, a mix shift, and Simpson's paradox (segments all rising while the total falls) before declaring a trend.
- Round to a decision-useful precision: money to whole units, rates to one decimal. Never present more precision than the data supports.

## Output

```markdown
# [Headline finding as a full sentence with the number in it]

**Data:** [source] · [n] rows · [period] · **Computed:** [ISO date]

## What happened
[2–4 sentences: the movement, its size, how it compares to target/prior. Front-load the number that matters.]

## Key findings
| # | Finding | Measure | Now | Prior/Target | Change | Confidence |
|---|---|---|---|---|---|---|
| 1 | Enterprise churn doubled | Churn rate | 8.4% | 4.1% (Q2) | +4.3 pp | High |

**1. [Finding as a sentence with the number]**
[What the data shows. Which segment drove it, in points of the total move. What it is not — the alternative reading the data rules out.]

## Outliers
| Item | Value | Expected range | Deviation | Likely explanation |
|---|---|---|---|---|

## What is probably driving this *(interpretation, not observation)*
- **[Hypothesis]** — consistent with [evidence in the data]. To confirm: [the specific check or data needed].

## Recommendations
| # | Action | Owner | Expected effect | Supports decision | Urgency |
|---|---|---|---|---|---|
| 1 | [Action] | [Role] | [Quantified where possible] | [Decision] | Now |

## What this data cannot tell you
- [Limitation] — would need [data] to answer.

## Data quality notes
- [Nulls, duplicates, partial periods, unit or definition caveats — with row counts.]
```

For `--length brief`: headline, three findings, three recommendations, limits. Keep the same order — finding before interpretation, always.

## Writing Rules

- **Lead with the answer.** The first sentence is the finding, not the methodology.
- Every claim carries its number; every number carries its unit and period.
- Business vocabulary, not column names: `avg_ord_val_usd` is "average order value".
- Prefer percentage points (pp) for rate differences and % for relative change — and never mix them silently.
- Say "unchanged" when nothing moved; a flat result is a finding, not a failure.
- Keep observation, interpretation and recommendation in separate, labelled sections. If you cannot tell which one a sentence is, the sentence is wrong.
- No hedging stacks ("may possibly suggest") — state the confidence level instead.
- Charts: when a visual is warranted, load the `dataviz` skill before writing any chart code.

## Handoff

- Need to pull different numbers → `/ba-sql`.
- Findings that imply change → `/ba-gap-analysis`.
- Risks or issues surfaced → `/ba-raid`.
- Executive deliverable → `/ba-brd` or an Artifact for a shareable page.
