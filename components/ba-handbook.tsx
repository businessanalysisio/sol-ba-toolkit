"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Target,
  Calendar,
  ExternalLink,
  BookOpen,
  Zap,
  GitBranch,
  MessageSquare,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Flag,
  Mail,
  Timer,
  UserCheck,
  ClipboardList,
  TrendingUp,
} from "lucide-react"

export default function BAHandbook() {
  const teamMembers = [
    {
      name: "Sarah",
      role: "Lead Business Analyst",
      avatar: "/placeholder-user.jpg",
      expertise: ["Strategic Planning", "Stakeholder Management", "Process Optimization"],
    },
    {
      name: "Emma",
      role: "Senior Business Analyst",
      avatar: "/placeholder-user.jpg",
      expertise: ["Requirements Analysis", "User Story Writing", "Data Analysis"],
    },
    {
      name: "Jack",
      role: "Business Analyst",
      avatar: "/placeholder-user.jpg",
      expertise: ["Technical Documentation", "System Integration", "Testing Coordination"],
    },
    {
      name: "Paul",
      role: "Business Analyst",
      avatar: "/placeholder-user.jpg",
      expertise: ["Process Documentation", "User Experience", "Quality Assurance"],
    },
    {
      name: "David",
      role: "Junior Business Analyst",
      avatar: "/placeholder-user.jpg",
      expertise: ["Data Collection", "Report Generation", "Stakeholder Communication"],
    },
  ]

  const upcomingTimelines = [
    {
      project: "E-commerce Platform Migration",
      phase: "Requirements Gathering",
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      status: "In Progress",
    },
    {
      project: "B2B Portal Enhancement",
      phase: "Design Review",
      startDate: "2025-07-10",
      endDate: "2025-07-25",
      status: "Upcoming",
    },
    {
      project: "Mobile App Optimization",
      phase: "Testing & Validation",
      startDate: "2025-07-20",
      endDate: "2025-08-05",
      status: "Planned",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BA Handbook</h1>
          <p className="text-muted-foreground">Your guide to working with the Business Analysis team</p>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="practices">Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Mission of the BA Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To bridge the gap between business stakeholders and technical teams by delivering clear, actionable
                  requirements that drive successful project outcomes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Translate business needs into technical requirements
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Facilitate communication between stakeholders
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Ensure project deliverables meet business objectives
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Meet the Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Important Timelines
              </CardTitle>
              <CardDescription>Current project phases and key milestones across our active initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTimelines.map((timeline, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{timeline.project}</h4>
                      <p className="text-sm text-muted-foreground">{timeline.phase}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeline.startDate} - {timeline.endDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        timeline.status === "In Progress"
                          ? "default"
                          : timeline.status === "Upcoming"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {timeline.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Detailed Project Timelines
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                How to Work with Us
              </CardTitle>
              <CardDescription>Guidelines for effective collaboration with the BA team</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="requirements-gathering">
                  <AccordionTrigger className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Requirements Gathering Sessions
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        When to engage:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Early in the project lifecycle, or when a new feature, product, or enhancement is being
                        considered.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <ClipboardList className="h-4 w-4 mr-2 text-green-500" />
                        What to prepare:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• High-level objectives or problem statements</li>
                        <li>• Known business rules and user personas</li>
                        <li>• Existing documents, workflows, or diagrams (if any)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-orange-500" />
                        Tips:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Allocate uninterrupted time for stakeholders</li>
                        <li>• Ensure the right decision-makers are present</li>
                        <li>• Be open to refining assumptions during the session</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="documentation-requests">
                  <AccordionTrigger className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Documentation and Analysis
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                        Request types:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Process maps, use cases, user stories, or feature documentation</li>
                        <li>• Competitive/market analysis, impact assessments, or data validation</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                        How to request:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>
                          • Use your team's standard request form or project management tool (e.g., Jira, Confluence)
                        </li>
                        <li>• Provide background context and target deadlines</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-green-500" />
                        Turnaround expectations:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-medium text-sm text-green-800">Minor clarifications</div>
                          <div className="text-xs text-green-600">~1–2 business days</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-medium text-sm text-blue-800">New documentation/analysis</div>
                          <div className="text-xs text-blue-600">~3–7 business days</div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="escalation">
                  <AccordionTrigger className="flex items-center">
                    <Flag className="h-4 w-4 mr-2" />
                    Escalate Blockers and Dependencies
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        When to escalate:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• If a decision is pending beyond the agreed timeline</li>
                        <li>• When requirements are unclear or conflicting across teams</li>
                        <li>• When external or cross-functional blockers impact analysis work</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                        Escalation steps:
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            1
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Notify the assigned BA</div>
                            <div className="text-xs text-muted-foreground">
                              Via preferred communication channel (Slack, Email)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            2
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Clearly state the issue</div>
                            <div className="text-xs text-muted-foreground">
                              Include blocker, impact, and urgency level
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            3
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Escalate if unresolved</div>
                            <div className="text-xs text-muted-foreground">
                              After 24–48 hours, escalate to BA Lead or Project Manager
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Communication Preferences
              </CardTitle>
              <CardDescription>How we prefer to communicate and our response times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
                  Primary Tools:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium text-sm">Slack</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Daily queries & quick updates</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium text-sm">Email</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Formal updates & documentation</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium text-sm">Confluence/Jira</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Documentation & tracking</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  Working Hours:
                </h4>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>9 AM – 5 PM (GMT+7), Monday–Friday</strong>
                    <br />
                    For urgent matters outside these hours, use Slack with 🔴 tag
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-green-500" />
                  Response Time SLA:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-sm text-green-800">Slack</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">4 hours</div>
                    <div className="text-xs text-green-600">within working hours</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-sm text-blue-800">Email</span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">1 day</div>
                    <div className="text-xs text-blue-600">business day</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                      <span className="font-medium text-sm text-red-800">Urgent Issues</span>
                    </div>
                    <div className="text-lg font-bold text-red-700">ASAP</div>
                    <div className="text-xs text-red-600">escalate via Slack 🔴</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Links to Key Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  JIRA - Project Management
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  BaseCamp - Team Communication
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Figma - Design Collaboration
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Trackers - Resource Planning
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Agile Framework & Tailoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our approach combines Scrum and Kanban methodologies, tailored to project needs and team dynamics.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    2-week sprint cycles for development projects
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Continuous flow for maintenance and support
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Hybrid approach for complex initiatives
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="h-5 w-5 mr-2" />
                  Scrum-Kanban Hybrid Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Structured sprints with flexible work-in-progress limits to optimize flow and predictability.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-500">2</div>
                    <div className="text-xs text-muted-foreground">Week Sprints</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">5</div>
                    <div className="text-xs text-muted-foreground">WIP Limit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Sprint Rituals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="planning">
                  <AccordionTrigger>Sprint Planning</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>When:</strong> First Monday of each sprint, 2 hours
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Who:</strong> BA Team, Product Owner, Scrum Master, Dev Team
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> Define sprint goals, select backlog items, estimate effort
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="daily">
                  <AccordionTrigger>Daily Standups</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>When:</strong> Every weekday, 15 minutes at 9:00 AM
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Who:</strong> All team members
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> Sync on progress, identify blockers, plan daily work
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="review">
                  <AccordionTrigger>Sprint Review</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>When:</strong> Last Friday of each sprint, 1 hour
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Who:</strong> Team + Stakeholders
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> Demo completed work, gather feedback, update backlog
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="retrospective">
                  <AccordionTrigger>Sprint Retrospective</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>When:</strong> Last Friday of each sprint, 45 minutes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Who:</strong> Core team members only
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> Reflect on process, identify improvements, plan changes
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Boards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Sprint</h4>
                    <p className="text-sm text-muted-foreground">
                      Active work items and their progress through the sprint workflow
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sprint Backlog</h4>
                    <p className="text-sm text-muted-foreground">
                      Prioritized list of user stories and tasks ready for upcoming sprints
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sprint Board & Adjustments</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time view of work in progress with ability to make mid-sprint adjustments
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Retrospective Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      Historical insights and action items from team retrospectives
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backlog Refinement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ongoing process to review, estimate, and prioritize backlog items for future sprints.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Weekly refinement sessions (Wednesdays, 1 hour)
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    BA, Product Owner, Tech Lead participation
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-orange-500" />
                    Focus on next 2-3 sprints worth of work
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prioritization Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Structured approach to ranking features and requirements based on business value and effort.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                    MoSCoW prioritization framework
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-red-500" />
                    Business value vs. effort matrix
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    Stakeholder impact assessment
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Logs & Mitigation Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Proactive identification and management of project risks with defined mitigation strategies.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Weekly risk assessment reviews
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Mitigation action tracking
                  </div>
                  <div className="flex items-center text-sm">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                    Stakeholder risk communication
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Regular synchronization meetings with stakeholders and cross-functional teams.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View BaseCamp Sync Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
