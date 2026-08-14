"use client"

import { WorkspaceCard } from "./workspace-card"
import type { Workspace } from "@/lib/data"

interface WorkspaceListProps {
  workspaces: Workspace[]
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  )
}
