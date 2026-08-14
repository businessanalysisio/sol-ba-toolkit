"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with fallback to mock data
let supabase: any = null

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  }
} catch (error) {
  console.warn("Supabase connection not available, using mock data:", error instanceof Error ? error.message : error)
}

// JIRA API configuration. Credentials must only come from the server environment.
const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY,
}

// Types based on database schema
interface User {
  id: string
  email: string
  name: string
  role: string
  department: string
  slack_handle?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Requirement {
  id: string
  title: string
  description: string
  status: string
  priority: string
  type: string
  source: string
  requestor_id: string
  project_id?: string
  assigned_ba_id?: string
  business_justification?: string
  expected_outcomes?: string
  stakeholder_ids: string[]
  sentiment_score?: number
  sentiment?: string
  submitted_at: string
  created_at: string
  updated_at: string
  requestor_name?: string
  assigned_ba_name?: string
  project_name?: string
}

interface BacklogItem {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  type: string
  effort_points?: number
  business_value?: number
  cluster?: string
  project_id?: string
  assigned_to?: string
  due_date?: string
  dependency_ids: string[]
  created_at: string
  updated_at: string
  assigned_to_name?: string
  project_name?: string
}

interface Meeting {
  id: string
  title: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  status: string
  organizer_id: string
  project_id?: string
  agenda?: string
  notes?: string
  created_at: string
  updated_at: string
  organizer_name?: string
  project_name?: string
  attendees?: User[]
  decisions?: Decision[]
  action_items?: ActionItem[]
}

interface Decision {
  id: string
  description: string
  status: string
  meeting_id: string
  made_by?: string
  decided_at?: string
  created_at: string
  updated_at: string
  made_by_name?: string
}

interface ActionItem {
  id: string
  description: string
  status: string
  meeting_id: string
  assignee_id?: string
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  assignee_name?: string
}

interface Document {
  id: string
  title: string
  type: string
  content?: string
  version: string
  status: string
  author_id: string
  project_id?: string
  file_path?: string
  created_at: string
  updated_at: string
  author_name?: string
  project_name?: string
}

interface SolutionDesign {
  id: string
  title: string
  description?: string
  status: string
  project_id?: string
  author_id: string
  components: string[]
  diagram_url?: string
  created_at: string
  updated_at: string
  author_name?: string
  project_name?: string
}

interface JiraIssue {
  id: string
  key: string
  summary: string
  description: string
  status: string
  priority: string
  assignee: string
  reporter: string
  issueType: string
  storyPoints?: number
  sprint?: string
  created: string
  updated: string
  labels: string[]
  components: string[]
}

// Mock data for fallback when database is not available
const mockRecentIntakes = [
  {
    id: "REQ-001",
    source: "Email",
    title: "Mobile app performance issues",
    status: "Analyzed",
    priority: "High",
    timestamp: "2 hours ago",
    sentiment: "Negative",
    requestor_name: "Alice Johnson",
    assigned_ba_name: "Sarah",
    project_name: "Mobile App Enhancement",
  },
  {
    id: "REQ-002",
    source: "Form",
    title: "New reporting dashboard request",
    status: "Processing",
    priority: "Medium",
    timestamp: "4 hours ago",
    sentiment: "Neutral",
    requestor_name: "Bob Williams",
    assigned_ba_name: "Emma",
    project_name: "B2B Partner Portal",
  },
  {
    id: "REQ-003",
    source: "Ticket",
    title: "Integration with third-party API",
    status: "Pending Review",
    priority: "Low",
    timestamp: "1 day ago",
    sentiment: "Positive",
    requestor_name: "Charlie Brown",
    assigned_ba_name: "Jack",
    project_name: "E-commerce Platform Redesign",
  },
]

const mockBacklogItems = [
  {
    id: "STORY-001",
    title: "User Authentication System",
    description: "Implement secure login with 2FA",
    priority: "High",
    effort: 13,
    businessValue: 8,
    cluster: "Authentication",
    status: "Ready",
    stakeholder: "Security Team",
    lastUpdated: "2 days ago",
    dependencies: ["STORY-002"],
    type: "Feature",
    assigned_to_name: "Bob Williams",
    project_name: "E-commerce Platform Redesign",
  },
  {
    id: "STORY-002",
    title: "Password Reset Flow",
    description: "Allow users to reset forgotten passwords",
    priority: "High",
    effort: 5,
    businessValue: 6,
    cluster: "Authentication",
    status: "In Progress",
    stakeholder: "UX Team",
    lastUpdated: "1 day ago",
    dependencies: [],
    type: "Feature",
    assigned_to_name: "Charlie Brown",
    project_name: "E-commerce Platform Redesign",
  },
  {
    id: "STORY-003",
    title: "Mobile App Performance",
    description: "Optimize app loading times",
    priority: "Medium",
    effort: 8,
    businessValue: 7,
    cluster: "Performance",
    status: "Backlog",
    stakeholder: "Mobile Team",
    lastUpdated: "5 days ago",
    dependencies: ["STORY-004"],
    type: "Improvement",
    assigned_to_name: "Diana Prince",
    project_name: "Mobile App Enhancement",
  },
]

const mockMeetings = [
  {
    id: "MEET-001",
    title: "Sprint Planning - Q3 Features",
    date: "2025-07-05",
    time: "10:00 AM",
    status: "Pending",
    attendees: ["Alice", "Bob", "Charlie"],
    organizer_name: "Sarah",
    project_name: "E-commerce Platform Redesign",
    decisionHistory: [
      { id: "DEC-001", description: "Prioritized User Auth Epic", status: "Implemented" },
      { id: "DEC-002", description: "Approved Mobile App redesign", status: "In Progress" },
    ],
    actionItems: [
      { id: "ACT-001", description: "Draft user stories for 2FA", assignee: "Alice", status: "Open" },
      { id: "ACT-002", description: "Research payment gateway options", assignee: "Bob", status: "Open" },
    ],
  },
  {
    id: "MEET-002",
    title: "B2B Portal Review",
    date: "2025-07-08",
    time: "02:00 PM",
    status: "Pending",
    attendees: ["David", "Eve"],
    organizer_name: "Emma",
    project_name: "B2B Partner Portal",
    decisionHistory: [],
    actionItems: [],
  },
]

const mockDocuments = [
  {
    id: "BRD-001",
    title: "E-commerce Platform BRD v1.0",
    type: "BRD",
    status: "Approved",
    lastModified: "1 day ago",
    author: "Sarah",
    version: "v1.0",
    project_name: "E-commerce Platform Redesign",
  },
  {
    id: "US-B2C-005",
    title: "B2C Checkout User Stories",
    type: "User Stories",
    status: "Review",
    lastModified: "5 hours ago",
    author: "Emma",
    version: "v1.1",
    project_name: "E-commerce Platform Redesign",
  },
  {
    id: "TS-UM-001",
    title: "User Management Service Tech Spec",
    type: "Technical Spec",
    status: "Draft",
    lastModified: "2 days ago",
    author: "Jack",
    version: "v0.9",
    project_name: "B2B Partner Portal",
  },
]

const mockJiraIssues: JiraIssue[] = [
  {
    id: "10001",
    key: "DEMO-123",
    summary: "Implement OAuth 2.0 authentication system",
    description: "Create secure authentication flow using OAuth 2.0 with support for multiple providers",
    status: "In Progress",
    priority: "High",
    assignee: "Hoang Sol",
    reporter: "Sarah Johnson",
    issueType: "Story",
    storyPoints: 8,
    sprint: "Sprint 23",
    created: "2025-01-15T09:00:00Z",
    updated: "2025-01-18T14:30:00Z",
    labels: ["authentication", "security", "oauth"],
    components: ["Backend", "Frontend"],
  },
  {
    id: "10002",
    key: "DEMO-124",
    summary: "Design user profile management interface",
    description: "Create wireframes and mockups for user profile management screens",
    status: "To Do",
    priority: "Medium",
    assignee: "Alice Johnson",
    reporter: "Emma Davis",
    issueType: "Task",
    storyPoints: 5,
    sprint: "Sprint 23",
    created: "2025-01-16T10:15:00Z",
    updated: "2025-01-16T10:15:00Z",
    labels: ["ui", "design", "profile"],
    components: ["Frontend"],
  },
  {
    id: "10003",
    key: "DEMO-125",
    summary: "Fix mobile checkout flow bug",
    description: "Payment button not responding on mobile devices during checkout process",
    status: "In Review",
    priority: "High",
    assignee: "Alice Johnson",
    reporter: "QA Team",
    issueType: "Bug",
    storyPoints: 3,
    sprint: "Sprint 23",
    created: "2025-01-17T16:45:00Z",
    updated: "2025-01-18T11:20:00Z",
    labels: ["mobile", "checkout", "bug"],
    components: ["Frontend", "Mobile"],
  },
  {
    id: "10004",
    key: "DEMO-126",
    summary: "Implement analytics dashboard backend",
    description: "Create REST API endpoints for analytics data aggregation and reporting",
    status: "Done",
    priority: "Medium",
    assignee: "Hoang Sol",
    reporter: "Product Manager",
    issueType: "Story",
    storyPoints: 13,
    sprint: "Sprint 22",
    created: "2025-01-08T08:30:00Z",
    updated: "2025-01-14T17:00:00Z",
    labels: ["analytics", "api", "backend"],
    components: ["Backend"],
  },
  {
    id: "10005",
    key: "DEMO-127",
    summary: "Research payment gateway integration options",
    description: "Evaluate different payment providers and create technical comparison document",
    status: "In Progress",
    priority: "Low",
    assignee: "Alice Johnson",
    reporter: "Technical Lead",
    issueType: "Research",
    storyPoints: 2,
    sprint: "Sprint 23",
    created: "2025-01-12T13:20:00Z",
    updated: "2025-01-18T09:45:00Z",
    labels: ["research", "payment", "integration"],
    components: ["Research"],
  },
]

// --- JIRA Integration Functions ---

async function makeJiraRequest(endpoint: string, options: RequestInit = {}) {
  if (!JIRA_CONFIG.baseUrl || !JIRA_CONFIG.email || !JIRA_CONFIG.apiToken) {
    throw new Error("JIRA integration is not configured")
  }

  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString("base64")

  const defaultHeaders = {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  try {
    const response = await fetch(`${JIRA_CONFIG.baseUrl}/rest/api/3/${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`JIRA API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("JIRA API request failed:", error)
    throw error
  }
}

export async function fetchJiraIssues(projectKey?: string, sprintId?: string) {
  try {
    const project = projectKey || JIRA_CONFIG.projectKey
    let jql = `project = ${project}`

    if (sprintId) {
      jql += ` AND sprint = ${sprintId}`
    } else {
      jql += ` AND sprint in openSprints()`
    }

    jql += ` ORDER BY priority DESC, updated DESC`

    const response = await makeJiraRequest(
      `search?jql=${encodeURIComponent(jql)}&fields=summary,description,status,priority,assignee,reporter,issuetype,customfield_10016,sprint,created,updated,labels,components`,
    )

    const issues: JiraIssue[] = response.issues.map((issue: any) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description || "",
      status: issue.fields.status.name,
      priority: issue.fields.priority?.name || "Medium",
      assignee: issue.fields.assignee?.displayName || "Unassigned",
      reporter: issue.fields.reporter?.displayName || "Unknown",
      issueType: issue.fields.issuetype.name,
      storyPoints: issue.fields.customfield_10016 || 0,
      sprint: issue.fields.sprint?.[0]?.name || "Backlog",
      created: issue.fields.created,
      updated: issue.fields.updated,
      labels: issue.fields.labels || [],
      components: issue.fields.components?.map((c: any) => c.name) || [],
    }))

    return { success: true, issues }
  } catch (error) {
    console.error("Error fetching JIRA issues:", error)
    // Return mock data as fallback
    return { success: false, issues: mockJiraIssues, error: "Using mock data - JIRA API not configured" }
  }
}

export async function createJiraIssue(issueData: {
  summary: string
  description: string
  issueType: string
  priority: string
  assignee?: string
  labels?: string[]
  storyPoints?: number
}) {
  try {
    const payload: { fields: Record<string, unknown> } = {
      fields: {
        project: { key: JIRA_CONFIG.projectKey },
        summary: issueData.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: issueData.description,
                },
              ],
            },
          ],
        },
        issuetype: { name: issueData.issueType },
        priority: { name: issueData.priority },
        labels: issueData.labels || [],
      },
    }

    if (issueData.assignee) {
      payload.fields.assignee = { accountId: issueData.assignee }
    }

    if (issueData.storyPoints) {
      payload.fields.customfield_10016 = issueData.storyPoints
    }

    const response = await makeJiraRequest("issue", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return { success: true, issue: response }
  } catch (error) {
    console.error("Error creating JIRA issue:", error)
    return { success: false, error: "Failed to create JIRA issue" }
  }
}

export async function updateJiraIssue(
  issueKey: string,
  updates: {
    summary?: string
    description?: string
    status?: string
    priority?: string
    assignee?: string
    storyPoints?: number
  },
) {
  try {
    const fields: any = {}

    if (updates.summary) fields.summary = updates.summary
    if (updates.description) {
      fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: updates.description,
              },
            ],
          },
        ],
      }
    }
    if (updates.priority) fields.priority = { name: updates.priority }
    if (updates.assignee) fields.assignee = { accountId: updates.assignee }
    if (updates.storyPoints) fields.customfield_10016 = updates.storyPoints

    const payload = { fields }

    const response = await makeJiraRequest(`issue/${issueKey}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })

    // Handle status transitions separately if needed
    if (updates.status) {
      await transitionJiraIssue(issueKey, updates.status)
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating JIRA issue:", error)
    return { success: false, error: "Failed to update JIRA issue" }
  }
}

export async function transitionJiraIssue(issueKey: string, targetStatus: string) {
  try {
    // Get available transitions
    const transitionsResponse = await makeJiraRequest(`issue/${issueKey}/transitions`)
    const transitions = transitionsResponse.transitions

    // Find the transition that leads to the target status
    const transition = transitions.find((t: any) => t.to.name === targetStatus)

    if (!transition) {
      throw new Error(`No transition available to status: ${targetStatus}`)
    }

    // Execute the transition
    await makeJiraRequest(`issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({
        transition: { id: transition.id },
      }),
    })

    return { success: true }
  } catch (error) {
    console.error("Error transitioning JIRA issue:", error)
    return { success: false, error: "Failed to transition JIRA issue" }
  }
}

export async function fetchJiraSprints(projectKey?: string) {
  try {
    const project = projectKey || JIRA_CONFIG.projectKey

    // First get the board ID for the project
    const boardsResponse = await makeJiraRequest(`board?projectKeyOrId=${project}`)

    if (!boardsResponse.values || boardsResponse.values.length === 0) {
      throw new Error("No boards found for project")
    }

    const boardId = boardsResponse.values[0].id

    // Get sprints for the board
    const sprintsResponse = await makeJiraRequest(`board/${boardId}/sprint?state=active,future`)

    return { success: true, sprints: sprintsResponse.values }
  } catch (error) {
    console.error("Error fetching JIRA sprints:", error)
    return {
      success: false,
      sprints: [
        { id: 1, name: "Sprint 23", state: "active" },
        { id: 2, name: "Sprint 24", state: "future" },
      ],
      error: "Using mock data - JIRA API not configured",
    }
  }
}

export async function syncWithJira() {
  try {
    const issuesResult = await fetchJiraIssues()
    const sprintsResult = await fetchJiraSprints()

    if (supabase && issuesResult.success) {
      // Sync issues to local database
      for (const issue of issuesResult.issues) {
        await supabase.from("jira_issues").upsert({
          jira_id: issue.id,
          key: issue.key,
          summary: issue.summary,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          assignee: issue.assignee,
          issue_type: issue.issueType,
          story_points: issue.storyPoints,
          sprint: issue.sprint,
          labels: issue.labels,
          components: issue.components,
          created_at: issue.created,
          updated_at: issue.updated,
          last_synced: new Date().toISOString(),
        })
      }
    }

    return {
      success: true,
      message: `Synced ${issuesResult.issues.length} issues and ${sprintsResult.sprints.length} sprints`,
      issues: issuesResult.issues,
      sprints: sprintsResult.sprints,
    }
  } catch (error) {
    console.error("Error syncing with JIRA:", error)
    return {
      success: false,
      error: "Failed to sync with JIRA",
      issues: mockJiraIssues,
      sprints: [{ id: 1, name: "Sprint 23", state: "active" }],
    }
  }
}

export async function getJiraConnectionStatus() {
  try {
    // Test connection by fetching current user
    const response = await makeJiraRequest("myself")
    return {
      connected: true,
      user: response.displayName,
      instance: JIRA_CONFIG.baseUrl,
      project: JIRA_CONFIG.projectKey,
    }
  } catch (error) {
    return {
      connected: false,
      error: "JIRA connection failed - check configuration",
      instance: JIRA_CONFIG.baseUrl,
      project: JIRA_CONFIG.projectKey,
    }
  }
}

// --- Requirements Intake Actions ---

export async function analyzeRequirement(content: string, sourceType: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

  try {
    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      // Fallback to mock analysis when API key is not available
      const mockSentiment =
        content.toLowerCase().includes("bug") ||
        content.toLowerCase().includes("issue") ||
        content.toLowerCase().includes("problem")
          ? "Negative"
          : content.toLowerCase().includes("great") ||
              content.toLowerCase().includes("excellent") ||
              content.toLowerCase().includes("love")
            ? "Positive"
            : "Neutral"
      const mockScore = mockSentiment === "Negative" ? 0.2 : mockSentiment === "Positive" ? 0.8 : 0.5

      return {
        intent: content.toLowerCase().includes("bug")
          ? "Bug Report"
          : content.toLowerCase().includes("new feature")
            ? "Feature Request"
            : "General Inquiry",
        entities: ["User", "System", "Data"],
        constraints: ["Performance", "Security"],
        suggestedIssueType: content.toLowerCase().includes("bug") ? "Bug" : "Story",
        priority: mockSentiment === "Negative" ? "High" : mockSentiment === "Positive" ? "Medium" : "Low",
        estimatedEffort: "5-8 story points",
        relatedItems: ["PROJ-001", "TASK-005"],
        sentiment: mockSentiment,
        sentimentScore: mockScore,
      }
    }

    const { text: sentimentResult } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Analyze the sentiment of the following text and provide a single word (Positive, Negative, Neutral) and a score between 0 and 1.0. Format as "Sentiment: [Sentiment], Score: [Score]".

Text: "${content}"`,
    })

    let sentiment = "Neutral"
    let sentimentScore = 0.5

    const sentimentMatch = sentimentResult.match(/Sentiment: (Positive|Negative|Neutral), Score: (\d+\.\d+)/)
    if (sentimentMatch) {
      sentiment = sentimentMatch[1]
      sentimentScore = Number.parseFloat(sentimentMatch[2])
    }

    // Mock other analysis results
    const mockIntent = content.toLowerCase().includes("bug")
      ? "Bug Report"
      : content.toLowerCase().includes("new feature")
        ? "Feature Request"
        : "General Inquiry"
    const mockEntities = ["User", "System", "Data"]
    const mockConstraints = ["Performance", "Security"]
    const mockIssueType = mockIntent.includes("Bug") ? "Bug" : "Story"
    const mockPriority = sentiment === "Negative" ? "High" : sentiment === "Positive" ? "Medium" : "Low"
    const mockEffort = "5-8 story points"
    const mockRelatedItems = ["PROJ-001", "TASK-005"]

    return {
      intent: mockIntent,
      entities: mockEntities,
      constraints: mockConstraints,
      suggestedIssueType: mockIssueType,
      priority: mockPriority,
      estimatedEffort: mockEffort,
      relatedItems: mockRelatedItems,
      sentiment: sentiment,
      sentimentScore: sentimentScore,
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return {
      intent: "Analysis Failed",
      entities: [],
      constraints: [],
      suggestedIssueType: "N/A",
      priority: "N/A",
      estimatedEffort: "N/A",
      relatedItems: [],
      sentiment: "Neutral",
      sentimentScore: 0.5,
      error: "Failed to analyze sentiment. Using fallback analysis.",
    }
  }
}

export async function fetchRecentIntakes() {
  if (supabase) {
    try {
      const { data: requirements, error } = await supabase
        .from("requirements")
        .select(`
          *,
          requestor:users!requestor_id(name),
          assigned_ba:users!assigned_ba_id(name),
          project:projects(name)
        `)
        .order("submitted_at", { ascending: false })
        .limit(10)

      if (error) throw error

      return requirements.map((req: any) => ({
        id: req.id,
        source: req.source,
        title: req.title,
        status: req.status,
        priority: req.priority,
        timestamp: new Date(req.submitted_at).toLocaleString(),
        sentiment: req.sentiment || "Neutral",
        requestor_name: req.requestor?.name,
        assigned_ba_name: req.assigned_ba?.name,
        project_name: req.project?.name,
      }))
    } catch (error) {
      console.error("Error fetching recent intakes:", error)
      return mockRecentIntakes
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockRecentIntakes
}

export async function createRequirement(data: {
  title: string
  description: string
  priority: string
  type: string
  source: string
  requestor_id: string
  business_justification?: string
  expected_outcomes?: string
  stakeholder_ids?: string[]
}) {
  if (supabase) {
    try {
      const { data: requirement, error } = await supabase
        .from("requirements")
        .insert([
          {
            title: data.title,
            description: data.description,
            priority: data.priority,
            type: data.type,
            source: data.source,
            requestor_id: data.requestor_id,
            business_justification: data.business_justification || "",
            expected_outcomes: data.expected_outcomes || "",
            stakeholder_ids: data.stakeholder_ids || [],
          },
        ])
        .select()
        .single()

      if (error) throw error

      return { success: true, requirement }
    } catch (error) {
      console.error("Error creating requirement:", error)
      return { success: false, error: "Failed to create requirement" }
    }
  }

  // Mock response when database is not available
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newReq = {
    id: `REQ-${Math.floor(Math.random() * 1000)}`,
    ...data,
    status: "New",
    submitted_at: new Date().toISOString(),
  }
  return { success: true, requirement: newReq }
}

export async function createBacklogItemFromIntake(itemData: {
  title: string
  description: string
  priority: string
  type: string
  effort_points?: number
  business_value?: number
  cluster?: string
  project_id?: string
  assigned_to?: string
  due_date?: string
}) {
  if (supabase) {
    try {
      const { data: item, error } = await supabase
        .from("backlog_items")
        .insert([
          {
            title: itemData.title,
            description: itemData.description,
            priority: itemData.priority,
            type: itemData.type,
            effort_points: itemData.effort_points || null,
            business_value: itemData.business_value || null,
            cluster: itemData.cluster || null,
            project_id: itemData.project_id || null,
            assigned_to: itemData.assigned_to || null,
            due_date: itemData.due_date || null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return { success: true, message: "Backlog item created successfully!", item }
    } catch (error) {
      console.error("Error creating backlog item:", error)
      return { success: false, error: "Failed to create backlog item" }
    }
  }

  // Mock response when database is not available
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newItem = {
    id: `STORY-${Math.floor(Math.random() * 1000)}`,
    lastUpdated: new Date().toLocaleDateString(),
    dependencies: [],
    status: "To Do",
    ...itemData,
  }
  return { success: true, message: "Backlog item created successfully!", item: newItem }
}

// --- Backlog Refinement Actions ---

export async function fetchBacklogData() {
  if (supabase) {
    try {
      // Fetch backlog items with related data
      const { data: backlogItems, error: itemsError } = await supabase
        .from("backlog_items")
        .select(`
          *,
          assigned_user:users!assigned_to(name),
          project:projects(name)
        `)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: false })

      if (itemsError) throw itemsError

      // Calculate clusters
      const { data: clusterData, error: clusterError } = await supabase.rpc("get_backlog_clusters")

      const clusters =
        clusterData?.map((c: any) => ({
          name: c.cluster,
          items: Number.parseInt(c.items),
          totalEffort: Number.parseInt(c.total_effort) || 0,
          avgBusinessValue: Number.parseFloat(c.avg_business_value) || 0,
          priority: c.avg_business_value > 7 ? "High" : c.avg_business_value > 5 ? "Medium" : "Low",
          completion: Number.parseFloat(c.completion) || 0,
        })) || []

      // Mock gap analysis (would be more sophisticated in real implementation)
      const gapAnalysis = [
        {
          area: "Mobile Experience",
          coverage: 60,
          recommendation: "Add more mobile-specific user stories",
          priority: "High",
        },
        {
          area: "Accessibility",
          coverage: 20,
          recommendation: "Include WCAG compliance requirements",
          priority: "Medium",
        },
        {
          area: "Security",
          coverage: 80,
          recommendation: "Consider additional security audits",
          priority: "Low",
        },
        {
          area: "Integration",
          coverage: 40,
          recommendation: "Define third-party integration requirements",
          priority: "High",
        },
      ]

      return {
        backlogItems: backlogItems.map((item: any) => ({
          ...item,
          effort: item.effort_points,
          businessValue: item.business_value,
          stakeholder: item.assigned_user?.name || "Unassigned",
          lastUpdated: new Date(item.updated_at).toLocaleDateString(),
          dependencies: item.dependency_ids || [],
        })),
        clusters,
        gapAnalysis,
      }
    } catch (error) {
      console.error("Error fetching backlog data:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 700))

  const clusters = [
    {
      name: "Authentication",
      items: 2,
      totalEffort: 18,
      avgBusinessValue: 7,
      priority: "High",
      completion: 50,
    },
    {
      name: "Performance",
      items: 1,
      totalEffort: 8,
      avgBusinessValue: 7,
      priority: "Medium",
      completion: 0,
    },
  ]

  const gapAnalysis = [
    {
      area: "Mobile Experience",
      coverage: 60,
      recommendation: "Add more mobile-specific user stories",
      priority: "High",
    },
    {
      area: "Accessibility",
      coverage: 20,
      recommendation: "Include WCAG compliance requirements",
      priority: "Medium",
    },
    {
      area: "Security",
      coverage: 80,
      recommendation: "Consider additional security audits",
      priority: "Low",
    },
    {
      area: "Integration",
      coverage: 40,
      recommendation: "Define third-party integration requirements",
      priority: "High",
    },
  ]

  return {
    backlogItems: mockBacklogItems,
    clusters,
    gapAnalysis,
  }
}

// --- Meeting Preparation Actions ---

export async function fetchMeetingData() {
  if (supabase) {
    try {
      const { data: meetings, error } = await supabase
        .from("meetings")
        .select(`
          *,
          organizer:users!organizer_id(name),
          project:projects(name),
          meeting_attendees(
            user:users(name, email),
            status
          ),
          decisions(
            *,
            made_by_user:users!made_by(name)
          ),
          action_items(
            *,
            assignee:users!assignee_id(name)
          )
        `)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(10)

      if (error) throw error

      const meetingsWithDetails = meetings.map((meeting: any) => ({
        ...meeting,
        date: new Date(meeting.scheduled_at).toLocaleDateString(),
        time: new Date(meeting.scheduled_at).toLocaleTimeString(),
        attendees: meeting.meeting_attendees?.map((a: any) => a.user.name) || [],
        organizer_name: meeting.organizer?.name,
        project_name: meeting.project?.name,
        decisionHistory:
          meeting.decisions?.map((d: any) => ({
            id: d.id,
            description: d.description,
            status: d.status,
            made_by_name: d.made_by_user?.name,
          })) || [],
        actionItems:
          meeting.action_items?.map((ai: any) => ({
            id: ai.id,
            description: ai.description,
            assignee: ai.assignee?.name,
            status: ai.status,
          })) || [],
      }))

      return meetingsWithDetails
    } catch (error) {
      console.error("Error fetching meeting data:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockMeetings
}

export async function addMeetingDecision(meetingId: string, description: string, madeBy?: string) {
  if (supabase) {
    try {
      const { data: decision, error } = await supabase
        .from("decisions")
        .insert([
          {
            description,
            meeting_id: meetingId,
            made_by: madeBy || null,
            status: "Pending",
          },
        ])
        .select()
        .single()

      if (error) throw error

      return { success: true, decision }
    } catch (error) {
      console.error("Error adding meeting decision:", error)
      return { success: false, error: "Failed to add decision" }
    }
  }

  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newDecision = { id: `DEC-${Math.floor(Math.random() * 1000)}`, description, status: "Pending" }
  return { success: true, decision: newDecision }
}

export async function addMeetingActionItem(
  meetingId: string,
  description: string,
  assigneeId: string,
  dueDate?: string,
) {
  if (supabase) {
    try {
      const { data: actionItem, error } = await supabase
        .from("action_items")
        .insert([
          {
            description,
            meeting_id: meetingId,
            assignee_id: assigneeId,
            due_date: dueDate || null,
            status: "Open",
          },
        ])
        .select()
        .single()

      if (error) throw error

      return { success: true, actionItem }
    } catch (error) {
      console.error("Error adding action item:", error)
      return { success: false, error: "Failed to add action item" }
    }
  }

  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newItem = { id: `ACT-${Math.floor(Math.random() * 1000)}`, description, assignee: "TBD", status: "Open" }
  return { success: true, actionItem: newItem }
}

export async function generateMeetingNotes(meeting: Meeting & { date?: string; time?: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (!meeting) {
    return { success: false, error: "No meeting data provided." }
  }

  const attendeesList = meeting.attendees?.join(", ") || "No attendees listed"
  const decisionsAndOutcomes =
    meeting.decisions?.map((d) => `✅ ${d.description} (${d.status})`).join("\n") || "No decisions recorded"
  const toDos =
    meeting.action_items?.map((a) => `- ${a.description} (Assigned to: ${a.assignee_name ?? "Unassigned"})`).join("\n") ||
    "No action items recorded"

  const notesContent = `
# Meeting Notes: ${meeting.title}

**Date:** ${meeting.date}  
**Time:** ${meeting.time}  
**Duration:** ${meeting.duration_minutes} minutes  
**Organizer:** ${meeting.organizer_name}  

## Attendees
${attendeesList}

## Agenda
${meeting.agenda || "No agenda provided"}

## Key Discussion Points
${meeting.notes || "Meeting notes to be added"}

## Decisions & Outcomes
${decisionsAndOutcomes}

## Action Items
${toDos}

## Next Steps
- Review action items and assign owners
- Schedule follow-up meetings as needed
- Update project documentation with decisions made
`.trim()

  if (supabase) {
    try {
      // Update meeting with generated notes
      const { error } = await supabase.from("meetings").update({ notes: notesContent }).eq("id", meeting.id)

      if (error) throw error
    } catch (error) {
      console.error("Error saving meeting notes:", error)
    }
  }

  return { success: true, notes: notesContent }
}

// --- Solution Design Actions ---

export async function fetchDesignTemplates() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { id: "ecommerce-b2c", name: "E-commerce App (B2C)", description: "Layouts for product browsing and checkout." },
    {
      id: "partner-admin-b2b",
      name: "Partner Admin App (B2B)",
      description: "Workflows for procurement and back-orders.",
    },
    { id: "admin-panel", name: "Admin Panel", description: "Mockups for user, inventory, and order management." },
    { id: "user-management-service", name: "User Management Service", description: "Data models and API specs." },
    {
      id: "order-management-service",
      name: "Order Management Service",
      description: "Workflow diagrams and data flows.",
    },
  ]
}

export async function fetchRecentDesigns() {
  if (supabase) {
    try {
      const { data: designs, error } = await supabase
        .from("solution_designs")
        .select(`
          *,
          author:users!author_id(name),
          project:projects(name)
        `)
        .order("updated_at", { ascending: false })
        .limit(10)

      if (error) throw error

      return designs.map((design: any) => ({
        id: design.id,
        title: design.title,
        type: design.components?.length > 0 ? "Workflow" : "Layout",
        status: design.status,
        lastModified: new Date(design.updated_at).toLocaleDateString(),
        author_name: design.author?.name,
        project_name: design.project?.name,
      }))
    } catch (error) {
      console.error("Error fetching recent designs:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [
    { id: "DESIGN-001", title: "B2C Checkout Flow", type: "Workflow", status: "Draft", lastModified: "1 day ago" },
    {
      id: "DESIGN-002",
      title: "Partner Dashboard Mockup",
      type: "Layout",
      status: "Review",
      lastModified: "3 hours ago",
    },
    {
      id: "DESIGN-003",
      title: "Product Catalog Data Model",
      type: "Data Model",
      status: "Approved",
      lastModified: "2 days ago",
    },
  ]
}

export async function generateMockup(templateId: string, context: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      // Fallback mockup content when API key is not available
      const mockupContent = `
# ${templateId.toUpperCase()} Mockup

## Layout Overview
Based on the context: "${context}"

### Key Components:
- Header with navigation and user controls
- Main content area with responsive grid layout
- Sidebar for filters and secondary actions
- Footer with links and company information

### User Interface Elements:
- Primary action buttons with clear call-to-action
- Form inputs with validation states
- Data tables with sorting and filtering
- Modal dialogs for detailed interactions
- Responsive design for mobile and desktop

### Interaction Flow:
1. User enters the main interface
2. Navigates through primary features
3. Performs key actions (search, filter, submit)
4. Receives feedback and confirmation
5. Can access help and support options

### Technical Considerations:
- Accessibility compliance (WCAG 2.1)
- Performance optimization
- Cross-browser compatibility
- Mobile-first responsive design

This mockup provides a foundation for the ${templateId} template with the specified context.
      `.trim()

      return { success: true, content: mockupContent }
    }

    const { text: generatedContent } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Generate a detailed textual description for a UI mockup or workflow based on the following template ID and context. Focus on key elements and their arrangement.
      Template ID: ${templateId}
      Context: ${context}

      Provide a structured mockup description with sections for layout, components, and interactions.`,
    })

    return { success: true, content: generatedContent }
  } catch (error) {
    console.error("Error generating mockup:", error)
    return { success: false, content: "Failed to generate mockup. Using fallback content.", error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// --- Documentation Actions ---

export async function fetchDocumentTemplates() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    {
      id: "brd",
      name: "Business Requirements Document (BRD)",
      description: "Comprehensive business requirements and objectives for the platform.",
      sections: [
        "Executive Summary",
        "Business Objectives",
        "Scope (In/Out)",
        "B2C Features",
        "B2B Features",
        "Admin Panel Features",
        "Security & Access",
        "Non-Functional Requirements",
        "Assumptions & Constraints",
      ],
    },
    {
      id: "user-story",
      name: "User Stories",
      description: "Agile user stories with acceptance criteria for specific features.",
      sections: ["Story Description", "Acceptance Criteria", "Definition of Done", "Dependencies", "Estimation"],
    },
    {
      id: "technical-spec",
      name: "Technical Specification",
      description: "Detailed technical implementation guide for services or integrations.",
      sections: [
        "Architecture Overview",
        "API Specifications",
        "Data Models",
        "Security Requirements",
        "Performance Criteria",
        "Deployment Considerations",
      ],
    },
    {
      id: "test-plan",
      name: "Test Plan",
      description: "Comprehensive testing strategy and cases for the platform.",
      sections: ["Test Strategy", "Test Cases", "Test Environment", "Dependencies"],
    },
  ]
}

export async function fetchRecentDocuments() {
  if (supabase) {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select(`
          *,
          author:users!author_id(name),
          project:projects(name)
        `)
        .order("updated_at", { ascending: false })
        .limit(10)

      if (error) throw error

      return documents.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        lastModified: new Date(doc.updated_at).toLocaleDateString(),
        author: doc.author?.name,
        version: doc.version,
        project_name: doc.project?.name,
      }))
    } catch (error) {
      console.error("Error fetching recent documents:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDocuments
}

export async function generateDocumentContent(
  templateId: string,
  context: string,
  stakeholder: string,
  priority: string,
) {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    // Fallback document content when API key is not available
    let fallbackContent = ""

    if (templateId === "brd") {
      fallbackContent = `
# Business Requirements Document (BRD)
## E-commerce Platform Enhancement

### Executive Summary
This document outlines the business requirements for enhancing our e-commerce platform based on: ${context}

Primary Stakeholder: ${stakeholder}
Priority Level: ${priority}

### Business Objectives
- Increase online sales conversion by 25%
- Expand B2B market reach
- Improve customer satisfaction scores
- Streamline administrative processes

### Scope
**In Scope:**
- B2C customer-facing features
- B2B partner portal enhancements
- Admin panel improvements
- Mobile responsiveness

**Out of Scope:**
- Legacy system migration
- Third-party integrations (Phase 2)

### B2C Features
- Enhanced product discovery
- Streamlined checkout process
- Order tracking and history
- Customer support integration

### B2B Features
- Tiered partner management
- Bulk ordering capabilities
- Custom pricing structures
- Procurement workflows

### Admin Panel Features
- User and partner management
- Inventory oversight
- Order management
- Analytics dashboard

### Security & Access
- Role-based access control (RBAC)
- JWT authentication
- Data encryption at rest and in transit
- Audit logging

### Non-Functional Requirements
- 99.9% uptime availability
- Page load times under 2 seconds
- Support for 10,000 concurrent users
- GDPR compliance

### Assumptions & Constraints
- Current infrastructure can support enhanced load
- Development team has required expertise
- Budget approved for ${priority} priority implementation
      `.trim()
    } else if (templateId === "user-story") {
      fallbackContent = `
# User Stories
## ${context}

### Story 1: Enhanced Product Search
**As a** customer
**I want to** search products with advanced filters
**So that** I can quickly find what I'm looking for

**Acceptance Criteria:**
- Search by category, price range, brand
- Auto-complete suggestions
- Filter results in real-time
- Mobile-responsive interface

### Story 2: B2B Bulk Ordering
**As a** B2B partner
**I want to** place bulk orders with custom pricing
**So that** I can efficiently manage my inventory

**Acceptance Criteria:**
- Upload CSV for bulk orders
- Apply tiered pricing automatically
- Generate order confirmation
- Track order status

### Story 3: Admin Dashboard Analytics
**As an** administrator
**I want to** view real-time sales analytics
**So that** I can make informed business decisions

**Acceptance Criteria:**
- Display key metrics (sales, orders, users)
- Filter by date range
- Export reports to PDF/Excel
- Mobile-accessible dashboard

### Story 4: Customer Order Tracking
**As a** customer
**I want to** track my order status in real-time
**So that** I know when to expect delivery

**Acceptance Criteria:**
- Real-time status updates
- Email notifications for status changes
- Estimated delivery date
- Integration with shipping providers

### Story 5: Partner Portal Access
**As a** B2B partner
**I want to** access my dedicated portal
**So that** I can manage my account and orders

**Acceptance Criteria:**
- Secure login with 2FA
- View order history
- Download invoices
- Update account information
      `.trim()
    } else if (templateId === "technical-spec") {
      fallbackContent = `
# Technical Specification
## ${context}

### Architecture Overview
- **Frontend**: React.js with Next.js framework
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with refresh tokens
- **Deployment**: Docker containers on AWS ECS

### API Specifications

#### User Management API
\`\`\`
GET /api/users/{id}
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}
\`\`\`

#### Product Catalog API
\`\`\`
GET /api/products?category={category}&page={page}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
\`\`\`

#### Order Management API
\`\`\`
GET /api/orders/{id}
POST /api/orders
PUT /api/orders/{id}/status
GET /api/orders/user/{userId}
\`\`\`

### Data Models

#### User Entity
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- role (Enum: customer, partner, admin)
- created_at (Timestamp)
- updated_at (Timestamp)

#### Product Entity
- id (UUID, Primary Key)
- name (String)
- description (Text)
- price (Decimal)
- category_id (UUID, Foreign Key)
- inventory_count (Integer)
- is_active (Boolean)

#### Order Entity
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- status (Enum: pending, processing, shipped, delivered)
- total_amount (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)

### Security Requirements
- HTTPS enforcement
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on API endpoints
- Audit logging for sensitive operations

### Performance Criteria
- API response time < 200ms
- Database query optimization
- CDN for static assets
- Horizontal scaling capability
- Caching strategy implementation

### Deployment Strategy
- Blue-green deployment
- Automated testing pipeline
- Database migration scripts
- Environment-specific configurations
- Monitoring and alerting setup
      `.trim()
    } else if (templateId === "test-plan") {
      fallbackContent = `
# Test Plan
## ${context}

### Test Strategy
- **Unit Testing**: 80% code coverage minimum
- **Integration Testing**: API and database interactions
- **User Acceptance Testing**: Stakeholder validation
- **Performance Testing**: Load and stress testing
- **Security Testing**: Vulnerability assessment

### Test Environment
- **Development**: Local development setup
- **Staging**: Production-like environment
- **Production**: Live environment (limited testing)

### Key Test Cases

#### B2C Checkout Flow
1. **Test Case**: Complete purchase flow
   - **Steps**: Add to cart → Checkout → Payment → Confirmation
   - **Expected**: Successful order creation
   - **Priority**: High

2. **Test Case**: Payment failure handling
   - **Steps**: Invalid payment method → Error handling
   - **Expected**: Graceful error message and retry option
   - **Priority**: High

#### B2B Tiered Pricing
1. **Test Case**: Partner discount application
   - **Steps**: B2B login → Add products → Verify pricing
   - **Expected**: Correct tier pricing applied
   - **Priority**: High

2. **Test Case**: Bulk order processing
   - **Steps**: Upload CSV → Validate → Process order
   - **Expected**: Successful bulk order creation
   - **Priority**: Medium

#### Admin Panel Functions
1. **Test Case**: User management
   - **Steps**: Create/Edit/Delete users
   - **Expected**: Proper CRUD operations
   - **Priority**: Medium

2. **Test Case**: Inventory management
   - **Steps**: Update stock levels → Verify frontend
   - **Expected**: Real-time inventory updates
   - **Priority**: Medium

### Test Data Requirements
- Sample user accounts (B2C, B2B, Admin)
- Product catalog with various categories
- Order history data
- Payment method test data

### Dependencies
- Test database with sample data
- Payment gateway sandbox
- Email service testing
- Third-party API mocks

### Success Criteria
- All high-priority test cases pass
- Performance benchmarks met
- Security vulnerabilities addressed
- Stakeholder acceptance achieved
      `.trim()
    }

    if (supabase) {
      try {
        // Save document to database
        const { data: newDoc, error } = await supabase
          .from("documents")
          .insert([
            {
              title: `${templateId.toUpperCase()} for ${context.substring(0, 30)}...`,
              type: templateId.toUpperCase(),
              content: fallbackContent,
              author_id: "550e8400-e29b-41d4-a716-446655440001", // Default to Sarah for now
              status: "Draft",
            },
          ])
          .select()
          .single()

        if (error) throw error

        return { success: true, content: fallbackContent, document: newDoc }
      } catch (error) {
        console.error("Error saving document:", error)
        return { success: true, content: fallbackContent } // Still return content even if save fails
      }
    }

    return { success: true, content: fallbackContent }
  }

  let prompt = `Generate a detailed document based on the "${templateId}" template for an e-commerce platform.
The document should incorporate the following context: "${context}".
Primary Stakeholder: ${stakeholder}.
Priority Level: ${priority}.

Ensure the content is comprehensive and follows the structure of a typical ${templateId} for an e-commerce platform with B2C, B2B, and Admin Panel features.
Include relevant sections and placeholder details where appropriate.`

  if (templateId === "brd") {
    prompt += `
Specifically, include sections for:
- Executive Summary
- Business Objectives (e.g., Increase Sales, Expand B2B Market)
- Scope (In/Out)
- B2C Features (e.g., Product Discovery, Shopping Cart, Order Tracking)
- B2B Features (e.g., Tiered Partner Management, Procurement Portal, Back-Order Requests)
- Admin Panel Features (e.g., User/Partner Management, Inventory, Order Oversight)
- Security & Access (e.g., RBAC, JWT, Data Encryption)
- Non-Functional Requirements (e.g., Performance, Scalability, Availability)
- Assumptions & Constraints`
  } else if (templateId === "user-story") {
    prompt += `
Generate 3-5 user stories related to the context. Each user story should follow the format:
"As a [persona], I want to [action] so that [benefit]."
Include Acceptance Criteria for each story.`
  } else if (templateId === "technical-spec") {
    prompt += `
Focus on technical aspects like:
- Architecture Overview (e.g., microservices, frontend apps)
- API Specifications (e.g., REST endpoints, data formats)
- Data Models (e.g., key entities like User, Product, Order)
- Security Considerations (e.g., authentication, authorization)
- Deployment Strategy`
  } else if (templateId === "test-plan") {
    prompt += `
Outline a test plan including:
- Test Strategy (e.g., unit, integration, UAT)
- Key Test Cases (e.g., B2C checkout, B2B tiered pricing, back-order approval)
- Test Data requirements
- Environment Setup`
  }

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: prompt,
    })

    if (supabase) {
      try {
        // Save document to database
        const { data: newDoc, error } = await supabase
          .from("documents")
          .insert([
            {
              title: `${templateId.toUpperCase()} for ${context.substring(0, 30)}...`,
              type: templateId.toUpperCase(),
              content: text,
              author_id: "550e8400-e29b-41d4-a716-446655440001", // Default to Sarah for now
              status: "Draft",
            },
          ])
          .select()
          .single()

        if (error) throw error

        return { success: true, content: text, document: newDoc }
      } catch (error) {
        console.error("Error saving document:", error)
        return { success: true, content: text } // Still return content even if save fails
      }
    }

    return { success: true, content: text }
  } catch (error) {
    console.error("Error generating document:", error)
    return { success: false, content: "Failed to generate document. Please check API key.", error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// --- User Management Actions ---

export async function fetchUsers() {
  if (supabase) {
    try {
      const { data: users, error } = await supabase.from("users").select("*").eq("is_active", true)

      if (error) throw error

      return users
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Business Analyst",
      department: "Product",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Emma Davis",
      email: "emma@company.com",
      role: "Business Analyst",
      department: "Product",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "Jack Wilson",
      email: "jack@company.com",
      role: "Business Analyst",
      department: "Product",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "Product Manager",
      department: "Product",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      name: "Bob Williams",
      email: "bob@company.com",
      role: "Developer",
      department: "Engineering",
    },
  ]
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  if (supabase) {
    try {
      const { data: user, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

      if (error) throw error

      return { success: true, user }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: "Failed to update profile" }
    }
  }

  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, user: { id: userId, ...updates } }
}

// --- Admin Panel Actions ---

export async function fetchSystemMetrics() {
  if (supabase) {
    try {
      // Fetch various metrics from database
      const [requirementsCount, backlogCount, meetingsCount, documentsCount] = await Promise.all([
        supabase.from("requirements").select("id", { count: "exact" }),
        supabase.from("backlog_items").select("id", { count: "exact" }),
        supabase.from("meetings").select("id", { count: "exact" }),
        supabase.from("documents").select("id", { count: "exact" }),
      ])

      return {
        totalRequirements: requirementsCount.count || 0,
        totalBacklogItems: backlogCount.count || 0,
        totalMeetings: meetingsCount.count || 0,
        totalDocuments: documentsCount.count || 0,
        activeUsers: 12, // Would be calculated from user activity
        systemHealth: "Healthy",
      }
    } catch (error) {
      console.error("Error fetching system metrics:", error)
    }
  }

  // Mock data fallback
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    totalRequirements: 47,
    totalBacklogItems: 23,
    totalMeetings: 15,
    totalDocuments: 31,
    activeUsers: 12,
    systemHealth: "Healthy",
  }
}

export async function fetchSystemLogs() {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return [
    { timestamp: "2025-01-02 10:30:15", level: "INFO", message: "User sarah@company.com logged in", module: "Auth" },
    {
      timestamp: "2025-01-02 10:28:42",
      level: "INFO",
      message: "New requirement REQ-047 created",
      module: "Requirements",
    },
    {
      timestamp: "2025-01-02 10:25:33",
      level: "WARN",
      message: "High memory usage detected (85%)",
      module: "System",
    },
    {
      timestamp: "2025-01-02 10:22:18",
      level: "INFO",
      message: "Document BRD-001 updated by emma@company.com",
      module: "Documents",
    },
    { timestamp: "2025-01-02 10:20:05", level: "ERROR", message: "Failed to send email notification", module: "Email" },
  ]
}

export async function exportData(dataType: string, format: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const mockData = {
    requirements: [
      { id: "REQ-001", title: "Mobile app performance", status: "Analyzed", priority: "High" },
      { id: "REQ-002", title: "New reporting dashboard", status: "Processing", priority: "Medium" },
    ],
    backlog: [
      { id: "STORY-001", title: "User Authentication", priority: "High", effort: 13 },
      { id: "STORY-002", title: "Password Reset", priority: "High", effort: 5 },
    ],
    meetings: [
      { id: "MEET-001", title: "Sprint Planning", date: "2025-07-05", status: "Pending" },
      { id: "MEET-002", title: "B2B Portal Review", date: "2025-07-08", status: "Pending" },
    ],
  }

  const data = mockData[dataType as keyof typeof mockData] || []
  const filename = `${dataType}_export_${new Date().toISOString().split("T")[0]}.${format}`

  return {
    success: true,
    filename,
    data,
    message: `Exported ${data.length} ${dataType} records to ${format.toUpperCase()}`,
  }
}
