"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Tag,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  MessageSquare,
  FileCheck,
  Handshake,
  Loader2,
  MapPin,
  TrendingUp,
  User,
  Building,
  Target,
  Zap,
  Send,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface JourneyStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending"
  icon: any
  estimatedTime: string
}

interface RequirementRequest {
  id: string
  title: string
  description: string
  requestor: string
  department: string
  priority: "High" | "Medium" | "Low"
  type: "Feature" | "Enhancement" | "Bug Fix" | "Process Change"
  businessJustification: string
  expectedOutcome: string
  stakeholders: string[]
  timeline: string
  status: "Draft" | "Submitted" | "Under Review" | "In Analysis" | "Approved" | "Rejected"
  submittedDate?: string
  assignedBA?: string
  lastUpdated?: string
  comments?: Comment[]
  attachments?: Attachment[]
  jiraIssueKey?: string
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  type: "comment" | "status_change" | "assignment"
}

interface Attachment {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

interface TrackingEvent {
  id: string
  type: "status_change" | "assignment" | "comment" | "attachment" | "jira_sync"
  description: string
  timestamp: string
  author?: string
  details?: any
}

const journeySteps: JourneyStep[] = [
  {
    id: "submit",
    title: "Submit Request",
    description: "Initial requirement submission with business context",
    status: "completed",
    icon: Send,
    estimatedTime: "5-10 min",
  },
  {
    id: "triage",
    title: "Triage & Classification",
    description: "BA team reviews and categorizes the request",
    status: "current",
    icon: Tag,
    estimatedTime: "1-2 days",
  },
  {
    id: "stakeholders",
    title: "Stakeholder Identification",
    description: "Identify key stakeholders and decision makers",
    status: "pending",
    icon: Users,
    estimatedTime: "1 day",
  },
  {
    id: "gathering",
    title: "Requirements Gathering",
    description: "Conduct sessions to gather detailed requirements",
    status: "pending",
    icon: MessageSquare,
    estimatedTime: "3-5 days",
  },
  {
    id: "analysis",
    title: "Analysis & Documentation",
    description: "Analyze requirements and create documentation",
    status: "pending",
    icon: FileText,
    estimatedTime: "5-7 days",
  },
  {
    id: "validation",
    title: "Validation & Sign-off",
    description: "Stakeholder review and approval",
    status: "pending",
    icon: FileCheck,
    estimatedTime: "2-3 days",
  },
  {
    id: "handoff",
    title: "Development Handoff",
    description: "Transfer to development team with backlog items",
    status: "pending",
    icon: Handshake,
    estimatedTime: "1 day",
  },
]

export default function RequirementsIntake() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<RequirementRequest>({
    id: "",
    title: "",
    description: "",
    requestor: "",
    department: "",
    priority: "Medium",
    type: "Feature",
    businessJustification: "",
    expectedOutcome: "",
    stakeholders: [],
    timeline: "",
    status: "Draft",
  })
  const [newStakeholder, setNewStakeholder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentRequests, setRecentRequests] = useState<RequirementRequest[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)
  const [triageMode, setTriageMode] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RequirementRequest | null>(null)
  const [triageFilters, setTriageFilters] = useState({
    status: "all",
    priority: "all",
    department: "all",
  })

  // Track Your Requests state
  const [trackingFilters, setTrackingFilters] = useState({
    status: "all",
    requestor: "all",
    dateRange: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequestForTracking, setSelectedRequestForTracking] = useState<RequirementRequest | null>(null)
  const [isLoadingTracking, setIsLoadingTracking] = useState(false)

  useEffect(() => {
    // Load recent requests
    const loadRecentRequests = async () => {
      setIsLoadingRecent(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockRequests: RequirementRequest[] = [
        {
          id: "REQ-001",
          title: "Mobile app performance issues",
          description: "Implement push notification system for mobile app to improve user engagement",
          requestor: "Alice Johnson",
          department: "Marketing",
          priority: "High",
          type: "Feature",
          businessJustification: "Increase user retention by 25% and improve communication with customers",
          expectedOutcome: "Higher user engagement and reduced churn rate",
          stakeholders: ["Marketing Team", "Mobile Dev Team", "UX Team"],
          timeline: "Q3 2024",
          status: "In Analysis",
          submittedDate: "2024-06-15",
          assignedBA: "Sarah",
          lastUpdated: "2024-06-18",
          jiraIssueKey: "ECOM-123",
          comments: [
            {
              id: "C1",
              author: "Sarah",
              content: "Initial analysis completed. Moving to stakeholder identification phase.",
              timestamp: "2024-06-18 10:30",
              type: "comment",
            },
            {
              id: "C2",
              author: "System",
              content: "Status changed from 'Under Review' to 'In Analysis'",
              timestamp: "2024-06-17 14:20",
              type: "status_change",
            },
          ],
          attachments: [
            {
              id: "A1",
              name: "mobile-performance-metrics.pdf",
              size: "2.3 MB",
              uploadedBy: "Alice Johnson",
              uploadedAt: "2024-06-15 09:15",
            },
          ],
        },
        {
          id: "REQ-002",
          title: "New reporting dashboard request",
          description: "Add advanced filtering and sorting capabilities to customer dashboard",
          requestor: "Bob Williams",
          department: "Customer Success",
          priority: "Medium",
          type: "Enhancement",
          businessJustification: "Improve customer self-service capabilities and reduce support tickets",
          expectedOutcome: "20% reduction in support tickets related to account management",
          stakeholders: ["Customer Success", "Frontend Team", "Product Team"],
          timeline: "Q4 2024",
          status: "Under Review",
          submittedDate: "2024-06-20",
          assignedBA: "Emma",
          lastUpdated: "2024-06-21",
          jiraIssueKey: "ECOM-124",
          comments: [
            {
              id: "C3",
              author: "Emma",
              content: "Reviewing requirements and scheduling stakeholder meetings.",
              timestamp: "2024-06-21 11:45",
              type: "comment",
            },
          ],
        },
        {
          id: "REQ-003",
          title: "Integration with third-party API",
          description: "Integrate additional payment methods including digital wallets",
          requestor: "Charlie Brown",
          department: "Finance",
          priority: "High",
          type: "Feature",
          businessJustification: "Expand payment options to increase conversion rates",
          expectedOutcome: "15% increase in successful transactions",
          stakeholders: ["Finance Team", "Backend Team", "Security Team"],
          timeline: "Q3 2024",
          status: "Approved",
          submittedDate: "2024-06-10",
          assignedBA: "Jack",
          lastUpdated: "2024-06-22",
          jiraIssueKey: "ECOM-125",
          comments: [
            {
              id: "C4",
              author: "Jack",
              content: "Requirements approved. Creating development backlog items.",
              timestamp: "2024-06-22 16:30",
              type: "comment",
            },
            {
              id: "C5",
              author: "System",
              content: "Status changed from 'In Analysis' to 'Approved'",
              timestamp: "2024-06-22 16:25",
              type: "status_change",
            },
          ],
        },
      ]
      setRecentRequests(mockRequests)
      setIsLoadingRecent(false)
    }
    loadRecentRequests()
  }, [])

  const handleInputChange = (field: keyof RequirementRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addStakeholder = () => {
    if (newStakeholder.trim() && !formData.stakeholders.includes(newStakeholder.trim())) {
      setFormData((prev) => ({
        ...prev,
        stakeholders: [...prev.stakeholders, newStakeholder.trim()],
      }))
      setNewStakeholder("")
    }
  }

  const removeStakeholder = (stakeholder: string) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((s) => s !== stakeholder),
    }))
  }

  const handleSubmitRequest = async () => {
    if (!formData.title || !formData.description || !formData.requestor) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newRequest = {
      ...formData,
      id: `REQ-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      status: "Submitted" as const,
      submittedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    setRecentRequests((prev) => [newRequest, ...prev])

    toast({
      title: "Request Submitted Successfully!",
      description: `Your requirement request ${newRequest.id} has been submitted for review.`,
    })

    // Reset form
    setFormData({
      id: "",
      title: "",
      description: "",
      requestor: "",
      department: "",
      priority: "Medium",
      type: "Feature",
      businessJustification: "",
      expectedOutcome: "",
      stakeholders: [],
      timeline: "",
      status: "Draft",
    })

    setCurrentStep(1) // Move to next step in journey
    setIsSubmitting(false)
  }

  const handleTriageRequest = (request: RequirementRequest) => {
    setSelectedRequest(request)
    setTriageMode(true)
  }

  const updateRequestStatus = async (requestId: string, updates: Partial<RequirementRequest>) => {
    setRecentRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, ...updates } : req)))

    toast({
      title: "Request Updated",
      description: `Request ${requestId} has been updated successfully.`,
    })
  }

  const moveToNextStep = async (requestId: string) => {
    const request = recentRequests.find((r) => r.id === requestId)
    if (!request) return

    let nextStatus = request.status
    switch (request.status) {
      case "Submitted":
        nextStatus = "Under Review"
        break
      case "Under Review":
        nextStatus = "In Analysis"
        break
      case "In Analysis":
        nextStatus = "Approved"
        break
    }

    await updateRequestStatus(requestId, { status: nextStatus })

    toast({
      title: "Request Advanced",
      description: `Request moved to ${nextStatus} stage.`,
    })
  }

  const assignToBA = async (requestId: string, baName: string) => {
    await updateRequestStatus(requestId, { assignedBA: baName })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "In Analysis":
        return "bg-blue-500"
      case "Under Review":
        return "bg-yellow-500"
      case "Submitted":
        return "bg-purple-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Analysis":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "Under Review":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Submitted":
        return <Send className="h-4 w-4 text-purple-500" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredRequestsForTracking = recentRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = trackingFilters.status === "all" || request.status === trackingFilters.status
    const matchesRequestor = trackingFilters.requestor === "all" || request.requestor === trackingFilters.requestor

    return matchesSearch && matchesStatus && matchesRequestor
  })

  const refreshTracking = async () => {
    setIsLoadingTracking(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoadingTracking(false)
    toast({
      title: "Tracking Updated",
      description: "Request tracking information has been refreshed.",
    })
  }

  const viewRequestDetails = (request: RequirementRequest) => {
    setSelectedRequestForTracking(request)
  }

  return (
    <div className="space-y-6">
      {/* Journey Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Requirements Intake Journey
          </CardTitle>
          <CardDescription>Track your requirement through our structured intake process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(currentStep / (journeySteps.length - 1)) * 100} className="w-full" />
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {journeySteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2
                      ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                      ${isCurrent ? "bg-blue-500 border-blue-500 text-white" : ""}
                      ${isPending ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
                    `}
                    >
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${isCurrent ? "text-blue-600" : ""}`}>{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.estimatedTime}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="submit">Submit Request</TabsTrigger>
          <TabsTrigger value="triage">Triage & Review</TabsTrigger>
          <TabsTrigger value="track">Track Progress</TabsTrigger>
          <TabsTrigger value="recent">Recent Requests</TabsTrigger>
          <TabsTrigger value="templates">Templates & Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  New Requirement Request
                </CardTitle>
                <CardDescription>Provide detailed information about your business requirement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestor">Requestor Name *</Label>
                    <Input
                      id="requestor"
                      placeholder="Your full name"
                      value={formData.requestor}
                      onChange={(e) => handleInputChange("requestor", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Customer Success">Customer Success</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                        <SelectItem value="IT">Information Technology</SelectItem>
                        <SelectItem value="Product">Product Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Requirement Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief, descriptive title for your requirement"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need in detail. Include current pain points, desired functionality, and any specific requirements."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High - Urgent/Critical</SelectItem>
                        <SelectItem value="Medium">Medium - Important</SelectItem>
                        <SelectItem value="Low">Low - Nice to Have</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feature">New Feature</SelectItem>
                        <SelectItem value="Enhancement">Enhancement</SelectItem>
                        <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                        <SelectItem value="Process Change">Process Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-justification">Business Justification</Label>
                  <Textarea
                    id="business-justification"
                    placeholder="Explain the business value and why this requirement is important"
                    value={formData.businessJustification}
                    onChange={(e) => handleInputChange("businessJustification", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected-outcome">Expected Outcome</Label>
                  <Textarea
                    id="expected-outcome"
                    placeholder="What specific outcomes or benefits do you expect from this requirement?"
                    value={formData.expectedOutcome}
                    onChange={(e) => handleInputChange("expectedOutcome", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Stakeholders</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add stakeholder name or team"
                      value={newStakeholder}
                      onChange={(e) => setNewStakeholder(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addStakeholder()}
                    />
                    <Button type="button" onClick={addStakeholder} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {stakeholder}
                        <button onClick={() => removeStakeholder(stakeholder)} className="ml-1 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Desired Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., Q3 2024, By end of year, ASAP"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange("timeline", e.target.value)}
                  />
                </div>

                <Button onClick={handleSubmitRequest} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Requirement Request
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Guidance Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Submission Guidelines
                </CardTitle>
                <CardDescription>Tips for a successful requirement submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> The more detailed your initial submission, the faster we can process your
                    request!
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Be Specific</p>
                      <p className="text-sm text-muted-foreground">
                        Include concrete examples and use cases rather than vague descriptions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Identify Impact</p>
                      <p className="text-sm text-muted-foreground">
                        Explain how this affects users, processes, or business outcomes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Include Context</p>
                      <p className="text-sm text-muted-foreground">
                        Provide background on current state and why change is needed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Set Expectations</p>
                      <p className="text-sm text-muted-foreground">
                        Be realistic about timelines and understand dependencies
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">What Happens Next?</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      1. <strong>Triage (1-2 days):</strong> We'll review and categorize your request
                    </p>
                    <p>
                      2. <strong>Stakeholder Alignment (1 day):</strong> Identify key decision makers
                    </p>
                    <p>
                      3. <strong>Requirements Gathering (3-5 days):</strong> Detailed analysis sessions
                    </p>
                    <p>
                      4. <strong>Documentation (5-7 days):</strong> Create formal requirements
                    </p>
                    <p>
                      5. <strong>Approval (2-3 days):</strong> Stakeholder sign-off
                    </p>
                    <p>
                      6. <strong>Handoff (1 day):</strong> Transfer to development team
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="triage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Triage Queue */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Triage Queue
                    </span>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={triageFilters.status}
                        onValueChange={(value) => setTriageFilters((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="In Analysis">In Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={triageFilters.priority}
                        onValueChange={(value) => setTriageFilters((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                  <CardDescription>Review and categorize incoming requirement requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRecent ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground mt-2">Loading requests for triage...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentRequests
                        .filter((req) => {
                          if (triageFilters.status !== "all" && req.status !== triageFilters.status) return false
                          if (triageFilters.priority !== "all" && req.priority !== triageFilters.priority) return false
                          return true
                        })
                        .map((request) => (
                          <div
                            key={request.id}
                            className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium">{request.title}</h3>
                                  <Badge variant={getPriorityColor(request.priority)}>{request.priority}</Badge>
                                  <Badge className={`${getStatusColor(request.status)} text-white`}>
                                    {request.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {request.requestor}
                                  </span>
                                  <span className="flex items-center">
                                    <Building className="h-3 w-3 mr-1" />
                                    {request.department}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {request.submittedDate}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2 ml-4">
                                <Button variant="outline" size="sm" onClick={() => handleTriageRequest(request)}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => moveToNextStep(request.id)}
                                  disabled={request.status === "Approved"}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Advance
                                </Button>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={request.assignedBA || ""}
                                  onValueChange={(value) => assignToBA(request.id, value)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Assign BA" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sarah">Sarah (Lead BA)</SelectItem>
                                    <SelectItem value="Emma">Emma (Senior BA)</SelectItem>
                                    <SelectItem value="Jack">Jack (BA)</SelectItem>
                                    <SelectItem value="Paul">Paul (BA)</SelectItem>
                                    <SelectItem value="David">David (Junior BA)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={request.type}
                                  onValueChange={(value) => updateRequestStatus(request.id, { type: value as any })}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Feature">New Feature</SelectItem>
                                    <SelectItem value="Enhancement">Enhancement</SelectItem>
                                    <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                                    <SelectItem value="Process Change">Process Change</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="text-xs text-muted-foreground">ID: {request.id}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Triage Statistics & Guidelines */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Triage Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Review</span>
                      <Badge variant="destructive">
                        {recentRequests.filter((r) => r.status === "Submitted").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Under Review</span>
                      <Badge variant="default">
                        {recentRequests.filter((r) => r.status === "Under Review").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Analysis</span>
                      <Badge variant="secondary">
                        {recentRequests.filter((r) => r.status === "In Analysis").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Priority</span>
                      <Badge variant="destructive">{recentRequests.filter((r) => r.priority === "High").length}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>SLA Target:</strong> 2 days for initial triage
                    </p>
                    <p>
                      <strong>Avg. Processing:</strong> 1.5 days
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Triage Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Assess Completeness</p>
                        <p className="text-muted-foreground">Verify all required information is provided</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Categorize Request</p>
                        <p className="text-muted-foreground">Assign appropriate type and priority</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Assign BA</p>
                        <p className="text-muted-foreground">Match expertise with request complexity</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Set Expectations</p>
                        <p className="text-muted-foreground">Communicate timeline and next steps</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Triage Modal */}
          {triageMode && selectedRequest && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Detailed Triage Review - {selectedRequest.id}</span>
                    <Button variant="ghost" size="sm" onClick={() => setTriageMode(false)}>
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Request Details</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
                          <p>
                            <strong>Title:</strong> {selectedRequest.title}
                          </p>
                          <p>
                            <strong>Requestor:</strong> {selectedRequest.requestor}
                          </p>
                          <p>
                            <strong>Department:</strong> {selectedRequest.department}
                          </p>
                          <p>
                            <strong>Submitted:</strong> {selectedRequest.submittedDate}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Description</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{selectedRequest.description}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Business Justification</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{selectedRequest.businessJustification || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="triage-priority">Priority</Label>
                          <Select
                            value={selectedRequest.priority}
                            onValueChange={(value) =>
                              setSelectedRequest((prev) => (prev ? { ...prev, priority: value as any } : null))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="triage-type">Type</Label>
                          <Select
                            value={selectedRequest.type}
                            onValueChange={(value) =>
                              setSelectedRequest((prev) => (prev ? { ...prev, type: value as any } : null))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Feature">New Feature</SelectItem>
                              <SelectItem value="Enhancement">Enhancement</SelectItem>
                              <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                              <SelectItem value="Process Change">Process Change</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="assign-ba">Assign Business Analyst</Label>
                        <Select
                          value={selectedRequest.assignedBA || ""}
                          onValueChange={(value) =>
                            setSelectedRequest((prev) => (prev ? { ...prev, assignedBA: value } : null))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select BA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sarah">Sarah (Lead BA)</SelectItem>
                            <SelectItem value="Emma">Emma (Senior BA)</SelectItem>
                            <SelectItem value="Jack">Jack (BA)</SelectItem>
                            <SelectItem value="Paul">Paul (BA)</SelectItem>
                            <SelectItem value="David">David (Junior BA)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="triage-notes">Triage Notes</Label>
                        <Textarea
                          id="triage-notes"
                          placeholder="Add notes about the triage decision, next steps, or concerns..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Stakeholders</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedRequest.stakeholders.map((stakeholder, index) => (
                            <Badge key={index} variant="outline">
                              {stakeholder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setTriageMode(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, { status: "Rejected" })
                        setTriageMode(false)
                        toast({
                          title: "Request Rejected",
                          description: "Request has been marked as rejected.",
                          variant: "destructive",
                        })
                      }}
                    >
                      Reject Request
                    </Button>
                    <Button
                      onClick={() => {
                        updateRequestStatus(selectedRequest.id, {
                          priority: selectedRequest.priority,
                          type: selectedRequest.type,
                          assignedBA: selectedRequest.assignedBA,
                          status: "Under Review",
                        })
                        setTriageMode(false)
                        toast({
                          title: "Triage Complete",
                          description: "Request has been triaged and moved to Under Review.",
                        })
                      }}
                    >
                      Complete Triage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="track" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Request Tracking List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Track Your Requests
                    </span>
                    <Button variant="outline" size="sm" onClick={refreshTracking} disabled={isLoadingTracking}>
                      {isLoadingTracking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription>Monitor the progress of your submitted requirements in real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title, description, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={trackingFilters.status}
                        onValueChange={(value) => setTrackingFilters((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="In Analysis">In Analysis</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={trackingFilters.requestor}
                        onValueChange={(value) => setTrackingFilters((prev) => ({ ...prev, requestor: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Requestors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Requestors</SelectItem>
                          <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                          <SelectItem value="Bob Williams">Bob Williams</SelectItem>
                          <SelectItem value="Charlie Brown">Charlie Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Request List */}
                  <div className="space-y-4">
                    {filteredRequestsForTracking.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">No requests found</p>
                        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                      </div>
                    ) : (
                      filteredRequestsForTracking.map((request) => (
                        <div
                          key={request.id}
                          className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => viewRequestDetails(request)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(request.status)}
                                <h3 className="font-medium">{request.title}</h3>
                                <Badge variant={getPriorityColor(request.priority)}>{request.priority}</Badge>
                                <Badge className={`${getStatusColor(request.status)} text-white`}>
                                  {request.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {request.requestor}
                                </span>
                                <span className="flex items-center">
                                  <Building className="h-3 w-3 mr-1" />
                                  {request.department}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Submitted: {request.submittedDate}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Updated: {request.lastUpdated}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <span className="text-xs text-muted-foreground">{request.id}</span>
                              {request.jiraIssueKey && (
                                <Badge variant="outline" className="text-xs">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {request.jiraIssueKey}
                                </Badge>
                              )}
                              {request.assignedBA && (
                                <Badge variant="secondary" className="text-xs">
                                  BA: {request.assignedBA}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Progress Indicator */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>
                                {journeySteps.findIndex((step) => step.title.includes(request.status.split(" ")[0])) +
                                  1}{" "}
                                of {journeySteps.length} steps
                              </span>
                            </div>
                            <Progress
                              value={
                                ((journeySteps.findIndex((step) => step.title.includes(request.status.split(" ")[0])) +
                                  1) /
                                  journeySteps.length) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              {request.comments && request.comments.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {request.comments.length} comments
                                </Badge>
                              )}
                              {request.attachments && request.attachments.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {request.attachments.length} files
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tracking Summary & Help */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Request Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Requests</span>
                      <Badge variant="outline">{recentRequests.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress</span>
                      <Badge variant="default">
                        {
                          recentRequests.filter((r) => ["Submitted", "Under Review", "In Analysis"].includes(r.status))
                            .length
                        }
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <Badge variant="secondary">{recentRequests.filter((r) => r.status === "Approved").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Priority</span>
                      <Badge variant="destructive">{recentRequests.filter((r) => r.priority === "High").length}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Avg. Processing Time:</strong> 12 days
                    </p>
                    <p>
                      <strong>Next Update:</strong> Within 2 business days
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Status Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Send className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Submitted</p>
                        <p className="text-muted-foreground">Request received and queued for review</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Under Review</p>
                        <p className="text-muted-foreground">BA team is evaluating and categorizing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">In Analysis</p>
                        <p className="text-muted-foreground">Detailed requirements gathering in progress</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Approved</p>
                        <p className="text-muted-foreground">Ready for development handoff</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    If you have questions about your request status or need to provide additional information:
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Your BA
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Support Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Request Details Modal */}
          {selectedRequestForTracking && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Request Details - {selectedRequestForTracking.id}</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRequestForTracking(null)}>
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Request Information</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
                          <p>
                            <strong>Title:</strong> {selectedRequestForTracking.title}
                          </p>
                          <p>
                            <strong>Type:</strong> {selectedRequestForTracking.type}
                          </p>
                          <p>
                            <strong>Priority:</strong> {selectedRequestForTracking.priority}
                          </p>
                          <p>
                            <strong>Status:</strong> {selectedRequestForTracking.status}
                          </p>
                          <p>
                            <strong>Requestor:</strong> {selectedRequestForTracking.requestor}
                          </p>
                          <p>
                            <strong>Department:</strong> {selectedRequestForTracking.department}
                          </p>
                          {selectedRequestForTracking.assignedBA && (
                            <p>
                              <strong>Assigned BA:</strong> {selectedRequestForTracking.assignedBA}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Description</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{selectedRequestForTracking.description}</p>
                        </div>
                      </div>

                      {selectedRequestForTracking.businessJustification && (
                        <div>
                          <Label className="text-base font-medium">Business Justification</Label>
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">{selectedRequestForTracking.businessJustification}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Timeline</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
                          <p>
                            <strong>Submitted:</strong> {selectedRequestForTracking.submittedDate}
                          </p>
                          <p>
                            <strong>Last Updated:</strong> {selectedRequestForTracking.lastUpdated}
                          </p>
                          <p>
                            <strong>Target Timeline:</strong> {selectedRequestForTracking.timeline}
                          </p>
                        </div>
                      </div>

                      {selectedRequestForTracking.stakeholders.length > 0 && (
                        <div>
                          <Label className="text-base font-medium">Stakeholders</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedRequestForTracking.stakeholders.map((stakeholder, index) => (
                              <Badge key={index} variant="outline">
                                {stakeholder}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRequestForTracking.jiraIssueKey && (
                        <div>
                          <Label className="text-base font-medium">JIRA Integration</Label>
                          <div className="mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View in JIRA ({selectedRequestForTracking.jiraIssueKey})
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedRequestForTracking.comments && selectedRequestForTracking.comments.length > 0 && (
                        <div>
                          <Label className="text-base font-medium">Recent Comments</Label>
                          <div className="mt-2 space-y-2">
                            {selectedRequestForTracking.comments.slice(0, 3).map((comment) => (
                              <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setSelectedRequestForTracking(null)}>
                      Close
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                    {selectedRequestForTracking.jiraIssueKey && (
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in JIRA
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requirement Requests</CardTitle>
              <CardDescription>View recently submitted requirements and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecent ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading recent requests...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{request.title}</h3>
                            <Badge variant={getPriorityColor(request.priority)}>{request.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {request.requestor}
                            </span>
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {request.department}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {request.submittedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={`${getStatusColor(request.status)} text-white`}>{request.status}</Badge>
                          <span className="text-xs text-muted-foreground">{request.id}</span>
                        </div>
                      </div>

                      {request.stakeholders.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {request.stakeholders.map((stakeholder, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {stakeholder}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-muted-foreground">
                            <Target className="h-3 w-3 mr-1" />
                            {request.type}
                          </span>
                          <span className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {request.timeline}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feature Request Template</CardTitle>
                <CardDescription>For new functionality requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Process Change Template</CardTitle>
                <CardDescription>For workflow modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enhancement Template</CardTitle>
                <CardDescription>For improving existing features</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements Checklist</CardTitle>
                <CardDescription>Ensure completeness</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Download Checklist
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stakeholder Map</CardTitle>
                <CardDescription>Identify key stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impact Assessment</CardTitle>
                <CardDescription>Evaluate business impact</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
