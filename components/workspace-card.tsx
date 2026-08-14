"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Workspace } from "@/lib/data"

interface WorkspaceCardProps {
  workspace: Workspace
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "planning":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      case "on-hold":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return Target
      case "team":
        return Users
      case "client":
        return Users
      default:
        return Target
    }
  }

  const TypeIcon = getTypeIcon(workspace.type)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-blue-600" />
            <Badge variant="outline" className="text-xs">
              {workspace.type}
            </Badge>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(workspace.status)}`} />
        </div>
        <CardTitle className="text-lg">{workspace.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{workspace.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{workspace.progress}%</span>
          </div>
          <Progress value={workspace.progress} className="h-2" />
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Team</span>
            <span className="text-sm text-muted-foreground">{workspace.members.length} members</span>
          </div>
          <div className="flex -space-x-2">
            {workspace.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.members.length > 4 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-medium">+{workspace.members.length - 4}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(workspace.startDate).toLocaleDateString()}</span>
          </div>
          <span>→</span>
          <span>{new Date(workspace.endDate).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {workspace.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {workspace.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{workspace.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/workspaces/${workspace.id}`}>
          <Button variant="outline" className="w-full bg-transparent">
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
