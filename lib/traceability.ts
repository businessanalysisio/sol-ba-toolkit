import type { Requirement } from "@/types/domain"

/**
 * Traceability: backward to the goal, forward to the test.
 *
 * A requirement is only defensible at audit if you can answer two questions
 * about it — why does it exist (a business goal), and how would you know it is
 * met (a test). The two failure modes have names:
 *
 *   orphan — no goal. It exists, and nobody can say why.
 *   gap    — no test. It is claimed, and nobody can show it.
 *
 * Coverage is a deliberate, stated formula rather than a feel: half the score
 * for being justified, half for being demonstrable, where "demonstrable" is the
 * share of acceptance criteria that have a test behind them. It is a summary,
 * not a measurement — the state below is what you act on.
 */

export type TraceState = "covered" | "partial" | "gap" | "orphan"

export interface TraceRow {
  requirement: Requirement
  goal: string | null
  criteria: number
  tests: number
  coverage: number
  state: TraceState
}

const GOAL_WEIGHT = 50
const TEST_WEIGHT = 50

export function traceRow(requirement: Requirement): TraceRow {
  const goal = requirement.goal?.trim() ? requirement.goal.trim() : null
  const criteria = requirement.acceptance_criteria?.length ?? 0
  const tests = requirement.tests?.length ?? 0

  // With no criteria there is nothing for a test to cover, so a test counts in
  // full rather than dividing by zero.
  const demonstrable = criteria === 0 ? (tests > 0 ? 1 : 0) : Math.min(1, tests / criteria)
  const coverage = Math.round((goal ? GOAL_WEIGHT : 0) + TEST_WEIGHT * demonstrable)

  let state: TraceState
  if (!goal) state = "orphan"
  else if (tests === 0) state = "gap"
  else if (demonstrable < 1) state = "partial"
  else state = "covered"

  return { requirement, goal, criteria, tests, coverage, state }
}

export const STATE_LABEL: Record<TraceState, string> = {
  covered: "Covered",
  partial: "Partial",
  gap: "Gap · no test",
  orphan: "Orphan · no goal",
}

/** Severity hue, matching the product's status vocabulary. */
export const STATE_TONE: Record<TraceState, { text: string; bar: string }> = {
  covered: { text: "text-sol-mint", bar: "bg-sol-mint" },
  partial: { text: "text-sol-gold", bar: "bg-sol-gold" },
  gap: { text: "text-sol-warn", bar: "bg-sol-warn" },
  orphan: { text: "text-sol-coral", bar: "bg-sol-coral" },
}

export interface TraceSummary {
  total: number
  covered: number
  gaps: number
  orphans: number
}

export function summarise(rows: TraceRow[]): TraceSummary {
  return {
    total: rows.length,
    covered: rows.filter((r) => r.state === "covered").length,
    gaps: rows.filter((r) => r.state === "gap" || r.state === "partial").length,
    orphans: rows.filter((r) => r.state === "orphan").length,
  }
}
