---
name: ba-sql
description: "Virtual BA framework — Data Skill A. Translates a business question in plain language into a correct, readable ANSI SQL query against a provided schema, making the business-term-to-column mapping explicit (churn, active customer, MRR, Q3, enterprise tier) and stating every definitional assumption before the query runs. Explains the query back in business terms. Use when a non-technical question needs to become a query — triggers: 'write a SQL query', 'natural language to SQL', 'how do I query', 'show me the churn rate for', 'turn this question into SQL', 'query the database for', 'text to SQL'."
argument-hint: [business question + schema / file path] (optional: --dialect postgres|mysql|snowflake|bigquery|ansi)
---

# BA Natural Language to SQL — Virtual BA Framework, Category 3 / Skill A

Let a non-technical stakeholder ask a question in their own words and get back a query that answers exactly that question — with the definitions it relied on stated in the open.

**Agent instruction (canonical):** *Map business terms (e.g. 'churn') to specific schema columns. Use standard ANSI SQL.*

## Inputs

- **Required** — the business question, **and** the schema (DDL, a table/column list, an ERD, or a dbt/catalog export).
- **Optional** — SQL dialect (default: ANSI, portable), fiscal calendar, known metric definitions or a metrics layer, row-level security/tenancy rules, data volume (drives the performance notes), sample rows.

**No schema, no query.** If the schema is missing, ask for it — or, when the user explicitly wants a template, produce the query against clearly-marked placeholder table/column names and label it `-- TEMPLATE: verify names against your schema`. Never silently guess table names and present the result as runnable.

## Workflow

1. **Restate the question precisely** — resolve what is actually being asked: the metric, the population, the grain, the time window, and the comparison (if any). Ambiguity here is the main source of wrong-but-runnable queries.
2. **Build the term map** — every business term → schema object, with the definition being used. Show this table *before* the SQL. It is the part the stakeholder can actually check.
3. **Resolve time** — "Q3" needs a year and a calendar (fiscal vs calendar); "last month" needs an anchor (today vs the last complete month); "active in Q3" needs a rule (any event in the window vs status at window end). Use half-open ranges (`>= start AND < end`) so boundary rows are neither lost nor double-counted, and never wrap the filtered date column in a function (it kills index use).
4. **Pick the grain** — decide what one output row represents and make every aggregate consistent with it. State the grain in a comment.
5. **Plan the joins** — start from the fact/event table; join dimensions outward. Check the cardinality of every join: a one-to-many join before an aggregate is how a revenue number silently doubles. When a join can fan out, aggregate in a CTE first, then join.
6. **Write the SQL** — CTEs top to bottom, one logical step each, named for what they contain (`active_enterprise_accounts`, not `cte1`). Explicit `JOIN … ON`, never comma joins. Qualify every column with its table alias. No `SELECT *`.
7. **Handle NULLs deliberately** — `NULL` is not zero and is excluded by `COUNT(col)`, by `!=` filters and by inner joins. Say which behaviour is intended; use `COALESCE` only where the business meaning is genuinely "zero".
8. **Guard division** — every rate uses `NULLIF(denominator, 0)`, and numerator/denominator are cast so integer division cannot truncate.
9. **Explain and verify** — plain-language read-back, then the sanity checks the stakeholder can run.

## Definition Discipline (the part that is really business analysis)

Common terms that must be defined, never assumed:

| Term | Decisions it hides |
|---|---|
| **Churn** | Logo vs revenue churn · cancellation date vs subscription end date · voluntary vs involuntary · denominator = start-of-period base or average base · are downgrades churn? |
| **Active customer** | Logged in, transacted, or subscription status = active? Over what window? |
| **Revenue / MRR** | Booked, billed, or recognised? Gross or net of refunds/discounts/tax? Which currency and FX date? |
| **New customer** | First order date, account creation date, or first payment? |
| **Enterprise** | A tier column, a seat/revenue threshold, or a sales-assigned segment? |
| **Q3 / last quarter** | Fiscal or calendar? Which year? Inclusive of the closing day? |

When the schema supports more than one reading, pick the most conventional, **state it as an assumption**, and offer the alternative as a commented variant.

## Output

````markdown
### Question
> [verbatim question]

### Interpreted as
[One precise sentence: metric · population · grain · window · comparison]

### Term mapping
| Business term | Schema mapping | Definition used |
|---|---|---|
| Churned customer | `subscriptions.cancelled_at` | Logo churn: an account in the opening base with no subscription still active at window end (a downgrade is not churn) |
| Enterprise | `accounts.tier = 'enterprise'` | Tier column, current value |
| Q3 2026 | `cancelled_at >= '2026-07-01' AND < '2026-10-01'` | Calendar quarter |

### Assumptions
- **[A1]** Churn is counted at account level, not seat level.
- **[A2]** The denominator is the active enterprise base at 2026-07-01.

### Query (ANSI SQL)
```sql
-- Grain: one row = the enterprise cohort for Q3 2026
WITH base AS (          -- enterprise accounts active at the start of the window
    SELECT s.account_id
    FROM   subscriptions AS s
    JOIN   accounts      AS a ON a.account_id = s.account_id
    WHERE  a.tier = 'enterprise'
      AND  s.started_at <  DATE '2026-07-01'
      AND  (s.cancelled_at IS NULL OR s.cancelled_at >= DATE '2026-07-01')
    GROUP BY s.account_id
),
churned AS (            -- of those, the accounts with nothing still active at window end
    SELECT b.account_id   -- logo churn: gone entirely, not merely downgraded
    FROM   base AS b
    WHERE  NOT EXISTS (
               SELECT 1
               FROM   subscriptions AS s
               WHERE  s.account_id  = b.account_id
                 AND  s.started_at  <  DATE '2026-10-01'
                 AND  (s.cancelled_at IS NULL OR s.cancelled_at >= DATE '2026-10-01')
           )
)
SELECT
    COUNT(DISTINCT b.account_id)                                   AS base_accounts,
    COUNT(DISTINCT c.account_id)                                   AS churned_accounts,
    ROUND( CAST(COUNT(DISTINCT c.account_id) AS DECIMAL(18,4))
           / NULLIF(COUNT(DISTINCT b.account_id), 0) * 100, 2)     AS churn_rate_pct
FROM base AS b
LEFT JOIN churned AS c ON c.account_id = b.account_id;
```

### In plain language
[What the query does, step by step, in the stakeholder's vocabulary — no SQL keywords.]

### Verify before trusting it
- `base_accounts` should match the Q3 opening enterprise account count in [known report].
- Row count sanity: churned ≤ base, rate between 0 and 100.
- Spot-check 3 accounts in `churned` against the CRM.

### If your definitions differ
- Revenue churn instead of logo churn: [one line + the clause to swap].
- Fiscal quarter: [the date literals to change].

### Dialect notes
[Only where the query would need changing: date literals, `DATE_TRUNC`, `QUALIFY`, `LIMIT` vs `TOP`, string concat.]
````

## Safety Rules

- **Read-only by default.** Produce `SELECT` statements. Never emit `UPDATE`, `DELETE`, `DROP`, `TRUNCATE` or DDL unless the user explicitly asks for a change script — and then output it with an accompanying `SELECT` preview of the affected rows and an explicit warning to run it in a transaction.
- Never run a query against a live database off your own initiative; if a database tool is available, show the query and ask before executing.
- Respect tenancy: when the schema has a tenant/org column, include the filter and say so.
- Add `LIMIT`/`FETCH FIRST` to exploratory queries over large tables; note when a query will scan a lot.
- Do not put real personal data in examples.

## Handoff

- Once results come back → `/ba-insights` for the narrative.
- Recurring question → propose it as a metric definition for `/ba-brd` (reporting requirements).
- Entity relationships unclear → `/ba-diagram --type er`.
