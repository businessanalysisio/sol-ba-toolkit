import type { RequirementStatus } from "@/types/domain"
import type { StatusTone } from "@/components/sol/status"

/**
 * The requirement lifecycle.
 *
 * Draft → In review → Approved, with Change requested as the way back. The
 * legal moves live here rather than in the page, so the API and the UI cannot
 * disagree about what is allowed — a button that offers a transition the server
 * rejects is worse than no button.
 */

/** The four states shown in the lifecycle strip, in order. */
export const LIFECYCLE_STATES: RequirementStatus[] = ["draft", "review", "approved", "change_requested"]

export const STATUS_LABEL: Record<RequirementStatus, string> = {
  draft: "Draft",
  review: "In review",
  approved: "Approved",
  change_requested: "Change requested",
  rejected: "Rejected",
  implemented: "Implemented",
  archived: "Archived",
}

export const STATUS_TONE: Record<RequirementStatus, StatusTone> = {
  draft: "neutral",
  review: "info",
  approved: "positive",
  change_requested: "caution",
  rejected: "critical",
  implemented: "positive",
  archived: "neutral",
}

export interface Transition {
  to: RequirementStatus
  label: string
  intent: "primary" | "secondary" | "ghost"
}

/**
 * Moves offered from a given state. Deliberately small: a requirement that is
 * already approved should not offer "Approve" again.
 */
export function transitionsFrom(status: RequirementStatus): Transition[] {
  switch (status) {
    case "draft":
      return [{ to: "review", label: "Send for review", intent: "primary" }]
    case "review":
      return [
        { to: "approved", label: "Approve", intent: "primary" },
        { to: "change_requested", label: "Request change", intent: "secondary" },
      ]
    case "approved":
      return [{ to: "change_requested", label: "Request change", intent: "secondary" }]
    case "change_requested":
      return [{ to: "review", label: "Back to review", intent: "primary" }]
    default:
      return [{ to: "review", label: "Reopen for review", intent: "secondary" }]
  }
}

export function canTransition(from: RequirementStatus, to: RequirementStatus): boolean {
  return transitionsFrom(from).some((transition) => transition.to === to)
}

/** Human sentence for a change-history row. */
export function describeEvent(action: string, changes: Record<string, unknown>): string {
  if (action === "status_changed") {
    const to = changes.to as RequirementStatus | undefined
    const from = changes.from as RequirementStatus | undefined
    if (to && from) return `${STATUS_LABEL[from]} → ${STATUS_LABEL[to]}`
    if (to) return `Moved to ${STATUS_LABEL[to]}`
  }
  if (action === "created") return "Captured"
  if (action === "edited") {
    const fields = Object.keys(changes ?? {})
    if (fields.length) return `Edited ${fields.join(", ")}`
    return "Edited"
  }
  return action.replace(/_/g, " ")
}
