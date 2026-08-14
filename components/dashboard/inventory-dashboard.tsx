"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "Generate Requirements",
    description: "Use AI to create user stories",
    icon: Sparkles,
    href: "/dashboard/ai-workspace",
    color: "bg-blue-500",
  },
  {
    title: "New Project",
    description: "Start a new BA initiative",
    icon: Plus,
    href: "/dashboard/projects",
    color: "bg-green-500",
  },
  {
    title: "Stakeholder Meeting",
    description: "Schedule stakeholder session",
    icon: Calendar,
    href: "/dashboard/collaboration",
    color: "bg-purple-500",
  },
  {
    title: "Process Analysis",
    description: "Model business processes",
    icon: Target,
    href: "/dashboard/requirements",
    color: "bg-orange-500",
  },
]

const recentActivity = [
  {
    id: "1",
    type: "requirement",
    title: "User Authentication Requirements Updated",
    description: "Added multi-factor authentication requirements",
    time: "2 hours ago",
    user: "Sarah Johnson",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    type: "meeting",
    title: "Stakeholder Review Meeting",
    description: "Reviewed Q1 project requirements with stakeholders",
    time: "4 hours ago",
    user: "Mike Chen",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    type: "document",
    title: "BRD v2.1 Published",
    description: "Business Requirements Document finalized",
    time: "1 day ago",
    user: "Emily Davis",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    type: "approval",
    title: "Requirements Approved",
    description: "Customer portal requirements signed off",
    time: "2 days ago",
    user: "John Smith",
    avatar: "/placeholder-user.jpg",
  },
]

const teamMetrics = [
  {
    title: "Active Requirements",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Projects in Progress",
    value: "8",
    change: "+2",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Stakeholder Meetings",
    value: "24",
    change: "+8%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Completion Rate",
    value: "94%",
    change: "+3%",
    trend: "up",
    icon: CheckCircle,
  },
]

const priorities = [
  {
    id: "1",
    title: "Customer Portal Requirements Review",
    project: "Digital Transformation",
    priority: "High",
    dueDate: "Today",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Stakeholder Analysis - CRM Project",
    project: "CRM Implementation",
    priority: "Medium",
    dueDate: "Tomorrow",
    status: "todo",
  },
  {
    id: "3",
    title: "Process Mapping - Order Fulfillment",
    project: "Supply Chain Optimization",
    priority: "High",
    dueDate: "This Week",
    status: "todo",
  },
]

export default function InventoryDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your business analysis work today.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Requirement
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Priorities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              My Priorities
            </CardTitle>
            <CardDescription>Your assigned work and upcoming deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorities.map((priority) => (
              <div key={priority.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{priority.title}</h4>
                  <p className="text-xs text-muted-foreground">{priority.project}</p>
                </div>
                <div className="text-right">
                  <Badge variant={priority.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                    {priority.priority}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{priority.dueDate}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across your projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Overview
          </CardTitle>
          <CardDescription>Project health and team workload distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Project Health</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">On Track</span>
                  <span className="text-sm font-medium">6 projects</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">At Risk</span>
                  <span className="text-sm font-medium">2 projects</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Team Velocity</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requirements/Week</span>
                  <span className="text-sm font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Completion Time</span>
                  <span className="text-sm font-medium">3.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Score</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Workload Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sarah Johnson</span>
                  <Badge variant="secondary">8 tasks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mike Chen</span>
                  <Badge variant="secondary">6 tasks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emily Davis</span>
                  <Badge variant="secondary">5 tasks</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
