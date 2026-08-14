export type WorkspaceRole = "owner" | "admin" | "member" | "viewer"
export type RequirementKind = "business" | "stakeholder" | "functional" | "non_functional" | "transition"
export type RequirementStatus = "draft" | "review" | "approved" | "rejected" | "implemented" | "archived"
export type Priority = "low" | "medium" | "high" | "critical"

export interface Workspace {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: WorkspaceRole
  joined_at: string
}

export interface SourceRecord {
  id: string
  workspace_id: string
  created_by: string
  kind: "note" | "document" | "meeting" | "email" | "ticket" | "interview" | "other"
  title: string
  content: string | null
  external_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Requirement {
  id: string
  workspace_id: string
  source_id: string | null
  created_by: string
  assigned_to: string | null
  title: string
  description: string
  kind: RequirementKind
  status: RequirementStatus
  priority: Priority
  acceptance_criteria: string[]
  /** Business goal this requirement exists to serve. Null means it is an orphan. */
  goal: string | null
  /** Test references covering this requirement. Empty means it is a gap. */
  tests: string[]
  version: number
  created_at: string
  updated_at: string
}

export interface CreateRequirementInput {
  workspace_id: string
  source_id?: string | null
  title: string
  description?: string
  kind?: RequirementKind
  priority?: Priority
  acceptance_criteria?: string[]
  goal?: string | null
  tests?: string[]
}
