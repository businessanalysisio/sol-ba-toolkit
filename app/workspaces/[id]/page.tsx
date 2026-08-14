// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
import { getWorkspaceById } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, File, Users, Target, Milestone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workspace = getWorkspaceById(id)

  if (!workspace) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
        <Image
          src={workspace.coverImage || "/placeholder.svg"}
          alt={`${workspace.name} cover image`}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{workspace.name}</h1>
          <p className="text-lg text-gray-200 mt-2">{workspace.description}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">
            <Target className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="documents">
            <File className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" /> Goals
                </h3>
                <ul className="space-y-3">
                  {workspace.goals.map((goal) => (
                    <li key={goal.id} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{goal.title}</span>
                        <Badge variant={goal.status === "at-risk" ? "destructive" : "secondary"}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{goal.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={goal.progress} className="h-2 flex-1" />
                        <span className="text-xs tabular-nums text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Target: {goal.targetDate}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Milestone className="w-5 h-5 mr-2 text-green-600" /> Milestones
                </h3>
                <ul className="space-y-3">
                  {workspace.milestones.map((milestone) => (
                    <li key={milestone.id} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{milestone.title}</span>
                        <Badge variant={milestone.status === "overdue" ? "destructive" : "secondary"}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{milestone.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspace.tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspace.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <File className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{doc.name}</span>
                  </a>
                ))}
                {workspace.documents.length === 0 && <p className="text-gray-500">No documents yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspace.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-6">
        <Link href="/">
          <Button variant="outline">Back to All Workspaces</Button>
        </Link>
      </div>
    </div>
  )
}
