// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { fetchJiraIssues, syncWithJira, getJiraConnectionStatus } from "@/app/actions"
import { TrendingUp, Users, Target, CheckCircle2, Calendar, MessageSquare, BarChart3, Activity, Zap, ExternalLink, RefreshCw, Settings, AlertCircle, Clock, GitBranch, Filter, Download, Upload } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "available" | "busy" | "away"
  currentSprint: string
  completedStories: number
  inProgressStories: number
}

interface SprintMetric {
  name: string
  current: number
  target: number
  trend: "up" | "down" | "stable"
  unit: string
}

interface JiraTicket {
  key: string
  summary: string
  status: string
  assignee: string
  priority: string
  storyPoints: number
  sprint: string
  issueType: string
  created: string
  updated: string
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  type: "standup" | "planning" | "review" | "retro"
  attendees: number
}

export default function AgileBusinessAnalysis() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [jiraTickets, setJiraTickets] = useState<JiraTicket[]>([])
  const [jiraConnectionStatus, setJiraConnectionStatus] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)

  // Mock data - in real app, this would come from APIs
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Hoang Sol",
      role: "Senior BA",
      avatar: "/placeholder-user.jpg",
      status: "available",
      currentSprint: "Sprint 23",
      completedStories: 8,
      inProgressStories: 3,
    },
    {
      id: "2",
      name: "Alice Johnson",
      role: "Junior BA",
      avatar: "/placeholder-user.jpg",
      status: "busy",
      currentSprint: "Sprint 23",
      completedStories: 5,
      inProgressStories: 2,
    },
  ]

  const sprintMetrics: SprintMetric[] = [
    { name: "Velocity", current: 42, target: 45, trend: "down", unit: "points" },
    { name: "Burndown", current: 78, target: 80, trend: "stable", unit: "%" },
    { name: "Story Completion", current: 85, target: 90, trend: "up", unit: "%" },
    { name: "Defect Rate", current: 2.1, target: 2.0, trend: "up", unit: "%" },
  ]

  const upcomingMeetings: Meeting[] = [
    {
      id: "1",
      title: "Daily Standup",
      date: "2025-07-02",
      time: "09:00 AM",
      type: "standup",
      attendees: 8,
    },
    {
      id: "2",
      title: "Sprint Planning",
      date: "2025-07-03",
      time: "10:00 AM",
      type: "planning",
      attendees: 12,
    },
    {
      id: "3",
      title: "Sprint Review",
      date: "2025-07-05",
      time: "02:00 PM",
      type: "review",
      attendees: 15,
    },
  ]

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Check JIRA connection status
      const connectionStatus = await getJiraConnectionStatus()
      setJiraConnectionStatus(connectionStatus)

      // Load JIRA issues
      const issuesResult = await fetchJiraIssues()
      if (issuesResult.success) {
        setJiraTickets(issuesResult.issues)
      } else {
        setJiraTickets(issuesResult.issues) // Mock data fallback
        if (issuesResult.error) {
          toast({
            title: "JIRA Connection",
            description: issuesResult.error,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load agile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSyncWithJira = async () => {
    try {
      setSyncing(true)
      const result = await syncWithJira()
      
      if (result.success) {
        setJiraTickets(result.issues)
        toast({
          title: "Sync Complete",
          description: result.message,
        })
      } else {
        toast({
          title: "Sync Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing with JIRA:", error)
      toast({
        title: "Sync Error",
        description: "Failed to sync with JIRA",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in review":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "to do":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "highest":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
      case "lowest":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case "standup":
        return <Activity className="h-4 w-4" />
      case "planning":
        return <Calendar className="h-4 w-4" />
      case "review":
        return <CheckCircle2 className="h-4 w-4" />
      case "retro":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      case "stable":
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agile analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agile Business Analysis</h2>
          <p className="text-gray-600">Sprint metrics, team collaboration, and JIRA integration</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadInitialData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSyncWithJira} disabled={syncing}>
            {syncing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <ExternalLink className="h-4 w-4 mr-2" />
            )}
            Sync JIRA
          </Button>
        </div>
      </div>

      {/* JIRA Connection Status */}
      {jiraConnectionStatus && (
        <Card className={jiraConnectionStatus.connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {jiraConnectionStatus.connected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${jiraConnectionStatus.connected ? "text-green-800" : "text-red-800"}`}>
                  JIRA {jiraConnectionStatus.connected ? "Connected" : "Disconnected"}
                </span>
                {jiraConnectionStatus.connected && (
                  <span className="text-sm text-green-600">
                    ({jiraConnectionStatus.user} • {jiraConnectionStatus.project})
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sprint</p>
                <p className="text-2xl font-bold text-gray-900">Sprint 23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Velocity</p>
                <p className="text-2xl font-bold text-gray-900">42 pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Collaboration</TabsTrigger>
          <TabsTrigger value="jira">JIRA Integration</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Sprint Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Sprint Metrics</span>
              </CardTitle>
              <CardDescription>Current sprint performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sprintMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>
                          {metric.current} {metric.unit}
                        </span>
                        <span className="text-gray-500">Target: {metric.target}</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sprint Burndown Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Burndown</CardTitle>
              <CardDescription>Story points remaining over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Burndown chart visualization</p>
                  <p className="text-sm text-gray-500">Connect to JIRA for real-time data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Members</span>
              </CardTitle>
              <CardDescription>Current team status and workload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getTeamStatusColor(member.status)}`}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{member.currentSprint}</p>
                      <p className="text-sm text-gray-600">
                        {member.completedStories} done, {member.inProgressStories} in progress
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Capacity */}
          <Card>
            <CardHeader>
              <CardTitle>Team Capacity</CardTitle>
              <CardDescription>Current sprint capacity and allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">120</p>
                    <p className="text-sm text-gray-600">Total Capacity (hours)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">95</p>
                    <p className="text-sm text-gray-600">Allocated (hours)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">25</p>
                    <p className="text-sm text-gray-600">Available (hours)</p>
                  </div>
                </div>
                <Progress value={79} className="h-3" />
                <p className="text-sm text-gray-600 text-center">79% capacity utilized</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jira" className="space-y-4">
          {/* JIRA Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>JIRA Issues ({jiraTickets.length})</span>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Issues</SelectItem>
                      <SelectItem value="story">Stories</SelectItem>
                      <SelectItem value="bug">Bugs</SelectItem>
                      <SelectItem value="task">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Live data from your JIRA workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Sprint</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jiraTickets.map((ticket) => (
                      <TableRow key={ticket.key}>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto font-mono text-blue-600">
                            {ticket.key}
                          </Button>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{ticket.summary}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.issueType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </TableCell>
                        <TableCell>{ticket.assignee}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.storyPoints || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{ticket.sprint}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(ticket.updated).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* JIRA Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{jiraTickets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {jiraTickets.filter((t) => t.status.toLowerCase() === "done").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {jiraTickets.filter((t) => t.status.toLowerCase().includes("progress")).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Meetings</span>
              </CardTitle>
              <CardDescription>Scheduled agile ceremonies and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">{getMeetingIcon(meeting.type)}</div>
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-gray-600">
                          {meeting.date} at {meeting.time} • {meeting.attendees} attendees
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meeting Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Templates</CardTitle>
              <CardDescription>Quick start templates for agile ceremonies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium">Daily Standup</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Quick sync on progress, blockers, and plans</p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium">Sprint Planning</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Plan and estimate work for the upcoming sprint</p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium">Sprint Review</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Demo completed work and gather feedback</p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium">Retrospective</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Reflect on the sprint and identify improvements</p>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
