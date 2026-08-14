"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  Search,
  Copy,
  Filter,
  TableIcon,
  Key,
  Link,
  FileText,
  Users,
  Target,
  BarChart3,
  Download,
  Code,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Column {
  name: string
  type: string
  nullable: boolean
  primaryKey?: boolean
  foreignKey?: string
  description: string
  indexed?: boolean
}

interface Table {
  name: string
  description: string
  category: string
  columns: Column[]
  relationships: string[]
  indexes: string[]
  businessContext: string
}

const databaseSchema: Table[] = [
  {
    name: "users",
    description: "User profiles, authentication, and role management",
    category: "Core",
    businessContext: "Central user management for all BA team members and stakeholders",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique user identifier" },
      {
        name: "email",
        type: "VARCHAR(255)",
        nullable: false,
        description: "User email address (unique)",
        indexed: true,
      },
      { name: "name", type: "VARCHAR(255)", nullable: false, description: "Full name of the user" },
      { name: "role", type: "VARCHAR(100)", nullable: false, description: "User role (BA, PM, Developer, etc.)" },
      { name: "department", type: "VARCHAR(100)", nullable: true, description: "Department or team affiliation" },
      { name: "slack_handle", type: "VARCHAR(100)", nullable: true, description: "Slack username for notifications" },
      { name: "avatar_url", type: "TEXT", nullable: true, description: "Profile picture URL" },
      { name: "is_active", type: "BOOLEAN", nullable: false, description: "Account status (active/inactive)" },
      { name: "last_login", type: "TIMESTAMP", nullable: true, description: "Last login timestamp" },
      { name: "preferences", type: "JSONB", nullable: true, description: "User preferences and settings" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Account creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last profile update timestamp" },
    ],
    relationships: ["projects.owner_id", "requirements.requestor_id", "meetings.organizer_id"],
    indexes: ["email", "role", "department", "is_active"],
  },
  {
    name: "projects",
    description: "Project management and tracking information",
    category: "Core",
    businessContext: "Central repository for all BA projects and initiatives",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique project identifier" },
      { name: "name", type: "VARCHAR(255)", nullable: false, description: "Project name" },
      { name: "description", type: "TEXT", nullable: true, description: "Detailed project description" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Project status (Active, Completed, On Hold)",
      },
      { name: "priority", type: "VARCHAR(50)", nullable: false, description: "Project priority (High, Medium, Low)" },
      { name: "owner_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Project owner/manager" },
      { name: "start_date", type: "DATE", nullable: true, description: "Project start date" },
      { name: "end_date", type: "DATE", nullable: true, description: "Project end date" },
      { name: "budget", type: "DECIMAL(12,2)", nullable: true, description: "Project budget amount" },
      {
        name: "health_status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Project health (Green, Yellow, Red)",
      },
      { name: "risk_level", type: "VARCHAR(50)", nullable: false, description: "Risk assessment level" },
      { name: "stakeholder_ids", type: "UUID[]", nullable: true, description: "Array of stakeholder user IDs" },
      { name: "tags", type: "TEXT[]", nullable: true, description: "Project tags for categorization" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Project creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["requirements.project_id", "meetings.project_id", "documents.project_id"],
    indexes: ["status", "priority", "owner_id", "health_status", "start_date"],
  },
  {
    name: "requirements",
    description: "Business requirements, user stories, and functional specifications",
    category: "Requirements",
    businessContext: "Core requirements management with sentiment analysis and stakeholder tracking",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique requirement identifier" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "Requirement title/summary" },
      { name: "description", type: "TEXT", nullable: false, description: "Detailed requirement description" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Requirement status (Draft, Approved, Implemented)",
      },
      { name: "priority", type: "VARCHAR(50)", nullable: false, description: "Business priority level" },
      {
        name: "type",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Requirement type (Functional, Non-Functional, etc.)",
      },
      {
        name: "source",
        type: "VARCHAR(100)",
        nullable: false,
        description: "Source of requirement (Email, Meeting, etc.)",
      },
      {
        name: "requestor_id",
        type: "UUID",
        nullable: false,
        foreignKey: "users.id",
        description: "User who submitted requirement",
      },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      {
        name: "assigned_ba_id",
        type: "UUID",
        nullable: true,
        foreignKey: "users.id",
        description: "Assigned business analyst",
      },
      { name: "business_justification", type: "TEXT", nullable: true, description: "Business case and justification" },
      { name: "expected_outcomes", type: "TEXT", nullable: true, description: "Expected business outcomes" },
      { name: "stakeholder_ids", type: "UUID[]", nullable: true, description: "Involved stakeholders" },
      { name: "acceptance_criteria", type: "TEXT", nullable: true, description: "Acceptance criteria details" },
      {
        name: "sentiment_score",
        type: "DECIMAL(3,2)",
        nullable: true,
        description: "AI sentiment analysis score (0-1)",
      },
      {
        name: "sentiment",
        type: "VARCHAR(20)",
        nullable: true,
        description: "Sentiment classification (Positive, Negative, Neutral)",
      },
      { name: "effort_estimate", type: "INTEGER", nullable: true, description: "Estimated effort in story points" },
      { name: "business_value", type: "INTEGER", nullable: true, description: "Business value score (1-10)" },
      { name: "submitted_at", type: "TIMESTAMP", nullable: false, description: "Requirement submission timestamp" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Record creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["backlog_items.requirement_id", "comments.requirement_id"],
    indexes: ["status", "priority", "type", "requestor_id", "project_id", "assigned_ba_id", "submitted_at"],
  },
  {
    name: "backlog_items",
    description: "Agile backlog items, user stories, and sprint planning",
    category: "Agile",
    businessContext: "Agile development backlog with effort estimation and dependency tracking",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique backlog item identifier" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "Backlog item title" },
      { name: "description", type: "TEXT", nullable: true, description: "Detailed description or user story" },
      { name: "status", type: "VARCHAR(50)", nullable: false, description: "Item status (Backlog, In Progress, Done)" },
      { name: "priority", type: "VARCHAR(50)", nullable: false, description: "Priority level" },
      { name: "type", type: "VARCHAR(50)", nullable: false, description: "Item type (Story, Epic, Task, Bug)" },
      { name: "effort_points", type: "INTEGER", nullable: true, description: "Story points or effort estimate" },
      { name: "business_value", type: "INTEGER", nullable: true, description: "Business value score" },
      { name: "cluster", type: "VARCHAR(100)", nullable: true, description: "Feature cluster or theme" },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      {
        name: "requirement_id",
        type: "UUID",
        nullable: true,
        foreignKey: "requirements.id",
        description: "Source requirement",
      },
      {
        name: "assigned_to",
        type: "UUID",
        nullable: true,
        foreignKey: "users.id",
        description: "Assigned team member",
      },
      { name: "sprint_id", type: "VARCHAR(100)", nullable: true, description: "Sprint identifier" },
      { name: "due_date", type: "DATE", nullable: true, description: "Target completion date" },
      { name: "dependency_ids", type: "UUID[]", nullable: true, description: "Dependent backlog item IDs" },
      { name: "acceptance_criteria", type: "TEXT", nullable: true, description: "Acceptance criteria" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["comments.backlog_item_id"],
    indexes: ["status", "priority", "type", "project_id", "assigned_to", "sprint_id"],
  },
  {
    name: "meetings",
    description: "Meeting scheduling, agenda, and outcome tracking",
    category: "Collaboration",
    businessContext: "Comprehensive meeting management with decision and action item tracking",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique meeting identifier" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "Meeting title" },
      { name: "description", type: "TEXT", nullable: true, description: "Meeting description or purpose" },
      { name: "scheduled_at", type: "TIMESTAMP", nullable: false, description: "Scheduled meeting date/time" },
      { name: "duration_minutes", type: "INTEGER", nullable: false, description: "Planned duration in minutes" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Meeting status (Scheduled, Completed, Cancelled)",
      },
      { name: "organizer_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Meeting organizer" },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      {
        name: "meeting_type",
        type: "VARCHAR(50)",
        nullable: true,
        description: "Type of meeting (Standup, Review, etc.)",
      },
      { name: "location", type: "VARCHAR(255)", nullable: true, description: "Meeting location or virtual link" },
      { name: "agenda", type: "TEXT", nullable: true, description: "Meeting agenda" },
      { name: "notes", type: "TEXT", nullable: true, description: "Meeting notes and summary" },
      { name: "recording_url", type: "TEXT", nullable: true, description: "Recording URL if available" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["meeting_attendees.meeting_id", "decisions.meeting_id", "action_items.meeting_id"],
    indexes: ["scheduled_at", "status", "organizer_id", "project_id", "meeting_type"],
  },
  {
    name: "meeting_attendees",
    description: "Meeting attendance tracking and participant management",
    category: "Collaboration",
    businessContext: "Track meeting participation and attendance patterns",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique attendance record" },
      {
        name: "meeting_id",
        type: "UUID",
        nullable: false,
        foreignKey: "meetings.id",
        description: "Associated meeting",
      },
      { name: "user_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Attendee user" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Attendance status (Invited, Accepted, Declined, Attended)",
      },
      {
        name: "role",
        type: "VARCHAR(50)",
        nullable: true,
        description: "Role in meeting (Presenter, Participant, Observer)",
      },
      { name: "invited_at", type: "TIMESTAMP", nullable: false, description: "Invitation timestamp" },
      { name: "responded_at", type: "TIMESTAMP", nullable: true, description: "Response timestamp" },
      { name: "attended_at", type: "TIMESTAMP", nullable: true, description: "Actual attendance timestamp" },
    ],
    relationships: [],
    indexes: ["meeting_id", "user_id", "status"],
  },
  {
    name: "decisions",
    description: "Decision tracking and outcome management",
    category: "Collaboration",
    businessContext: "Track important decisions made during meetings and projects",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique decision identifier" },
      { name: "description", type: "TEXT", nullable: false, description: "Decision description" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Decision status (Pending, Approved, Implemented)",
      },
      {
        name: "meeting_id",
        type: "UUID",
        nullable: true,
        foreignKey: "meetings.id",
        description: "Associated meeting",
      },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      { name: "made_by", type: "UUID", nullable: true, foreignKey: "users.id", description: "Decision maker" },
      { name: "impact_level", type: "VARCHAR(50)", nullable: true, description: "Impact level (High, Medium, Low)" },
      { name: "rationale", type: "TEXT", nullable: true, description: "Decision rationale and context" },
      { name: "alternatives_considered", type: "TEXT", nullable: true, description: "Alternative options considered" },
      { name: "decided_at", type: "TIMESTAMP", nullable: true, description: "Decision timestamp" },
      { name: "implemented_at", type: "TIMESTAMP", nullable: true, description: "Implementation timestamp" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["status", "meeting_id", "project_id", "made_by", "decided_at"],
  },
  {
    name: "action_items",
    description: "Action item tracking and follow-up management",
    category: "Collaboration",
    businessContext: "Track action items and follow-ups from meetings and decisions",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique action item identifier" },
      { name: "description", type: "TEXT", nullable: false, description: "Action item description" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Status (Open, In Progress, Completed, Cancelled)",
      },
      { name: "priority", type: "VARCHAR(50)", nullable: false, description: "Priority level" },
      { name: "meeting_id", type: "UUID", nullable: true, foreignKey: "meetings.id", description: "Source meeting" },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      { name: "assignee_id", type: "UUID", nullable: true, foreignKey: "users.id", description: "Assigned person" },
      { name: "due_date", type: "DATE", nullable: true, description: "Due date" },
      { name: "completed_at", type: "TIMESTAMP", nullable: true, description: "Completion timestamp" },
      { name: "notes", type: "TEXT", nullable: true, description: "Progress notes" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["status", "priority", "assignee_id", "due_date", "meeting_id"],
  },
  {
    name: "documents",
    description: "Document management and version control",
    category: "Documentation",
    businessContext: "Central repository for all BA documents with version control",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique document identifier" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "Document title" },
      { name: "type", type: "VARCHAR(100)", nullable: false, description: "Document type (BRD, User Stories, etc.)" },
      { name: "content", type: "TEXT", nullable: true, description: "Document content (for text documents)" },
      { name: "version", type: "VARCHAR(20)", nullable: false, description: "Document version" },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Document status (Draft, Review, Approved)",
      },
      { name: "author_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Document author" },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      { name: "file_path", type: "TEXT", nullable: true, description: "File storage path" },
      { name: "file_size", type: "BIGINT", nullable: true, description: "File size in bytes" },
      { name: "mime_type", type: "VARCHAR(100)", nullable: true, description: "File MIME type" },
      { name: "tags", type: "TEXT[]", nullable: true, description: "Document tags" },
      { name: "is_template", type: "BOOLEAN", nullable: false, description: "Whether document is a template" },
      {
        name: "parent_document_id",
        type: "UUID",
        nullable: true,
        foreignKey: "documents.id",
        description: "Parent document for versions",
      },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["comments.document_id"],
    indexes: ["type", "status", "author_id", "project_id", "is_template", "created_at"],
  },
  {
    name: "solution_designs",
    description: "Solution architecture and design documentation",
    category: "Design",
    businessContext: "Technical and business solution designs with component tracking",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique design identifier" },
      { name: "title", type: "VARCHAR(255)", nullable: false, description: "Design title" },
      { name: "description", type: "TEXT", nullable: true, description: "Design description" },
      { name: "status", type: "VARCHAR(50)", nullable: false, description: "Design status (Draft, Review, Approved)" },
      { name: "type", type: "VARCHAR(50)", nullable: false, description: "Design type (Architecture, Workflow, etc.)" },
      {
        name: "project_id",
        type: "UUID",
        nullable: true,
        foreignKey: "projects.id",
        description: "Associated project",
      },
      { name: "author_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Design author" },
      { name: "components", type: "JSONB", nullable: true, description: "Design components and structure" },
      { name: "diagram_url", type: "TEXT", nullable: true, description: "Diagram or mockup URL" },
      { name: "technologies", type: "TEXT[]", nullable: true, description: "Technologies involved" },
      { name: "assumptions", type: "TEXT", nullable: true, description: "Design assumptions" },
      { name: "constraints", type: "TEXT", nullable: true, description: "Design constraints" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["status", "type", "project_id", "author_id"],
  },
  {
    name: "comments",
    description: "Comments and feedback system for all entities",
    category: "Collaboration",
    businessContext: "Universal commenting system for requirements, documents, and other entities",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique comment identifier" },
      { name: "content", type: "TEXT", nullable: false, description: "Comment content" },
      { name: "author_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Comment author" },
      { name: "entity_type", type: "VARCHAR(50)", nullable: false, description: "Type of entity being commented on" },
      { name: "entity_id", type: "UUID", nullable: false, description: "ID of the entity being commented on" },
      {
        name: "parent_comment_id",
        type: "UUID",
        nullable: true,
        foreignKey: "comments.id",
        description: "Parent comment for threading",
      },
      { name: "is_resolved", type: "BOOLEAN", nullable: false, description: "Whether comment/issue is resolved" },
      {
        name: "resolved_by",
        type: "UUID",
        nullable: true,
        foreignKey: "users.id",
        description: "User who resolved the comment",
      },
      { name: "resolved_at", type: "TIMESTAMP", nullable: true, description: "Resolution timestamp" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["entity_type", "entity_id", "author_id", "parent_comment_id", "is_resolved"],
  },
  {
    name: "teams",
    description: "Team organization and structure management",
    category: "Organization",
    businessContext: "Organizational structure for BA teams and project teams",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique team identifier" },
      { name: "name", type: "VARCHAR(255)", nullable: false, description: "Team name" },
      { name: "description", type: "TEXT", nullable: true, description: "Team description and purpose" },
      { name: "type", type: "VARCHAR(50)", nullable: false, description: "Team type (BA Team, Project Team, etc.)" },
      { name: "lead_id", type: "UUID", nullable: true, foreignKey: "users.id", description: "Team lead/manager" },
      {
        name: "parent_team_id",
        type: "UUID",
        nullable: true,
        foreignKey: "teams.id",
        description: "Parent team for hierarchy",
      },
      { name: "is_active", type: "BOOLEAN", nullable: false, description: "Team status" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: ["team_members.team_id"],
    indexes: ["type", "lead_id", "parent_team_id", "is_active"],
  },
  {
    name: "team_members",
    description: "Team membership and role assignments",
    category: "Organization",
    businessContext: "Track team membership and roles within teams",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique membership record" },
      { name: "team_id", type: "UUID", nullable: false, foreignKey: "teams.id", description: "Team identifier" },
      { name: "user_id", type: "UUID", nullable: false, foreignKey: "users.id", description: "Team member" },
      { name: "role", type: "VARCHAR(100)", nullable: false, description: "Role within the team" },
      { name: "joined_at", type: "TIMESTAMP", nullable: false, description: "Join timestamp" },
      { name: "left_at", type: "TIMESTAMP", nullable: true, description: "Leave timestamp (if applicable)" },
      { name: "is_active", type: "BOOLEAN", nullable: false, description: "Active membership status" },
    ],
    relationships: [],
    indexes: ["team_id", "user_id", "is_active"],
  },
  {
    name: "stakeholders",
    description: "Stakeholder information and relationship management",
    category: "Stakeholder",
    businessContext: "Comprehensive stakeholder management with influence and interest tracking",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique stakeholder identifier" },
      { name: "name", type: "VARCHAR(255)", nullable: false, description: "Stakeholder name" },
      { name: "email", type: "VARCHAR(255)", nullable: true, description: "Contact email" },
      { name: "phone", type: "VARCHAR(50)", nullable: true, description: "Contact phone" },
      { name: "organization", type: "VARCHAR(255)", nullable: true, description: "Organization or company" },
      { name: "role", type: "VARCHAR(100)", nullable: false, description: "Stakeholder role/title" },
      { name: "department", type: "VARCHAR(100)", nullable: true, description: "Department or division" },
      {
        name: "influence_level",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Influence level (High, Medium, Low)",
      },
      {
        name: "interest_level",
        type: "VARCHAR(50)",
        nullable: false,
        description: "Interest level (High, Medium, Low)",
      },
      {
        name: "communication_preference",
        type: "VARCHAR(50)",
        nullable: true,
        description: "Preferred communication method",
      },
      { name: "notes", type: "TEXT", nullable: true, description: "Additional notes about stakeholder" },
      { name: "is_internal", type: "BOOLEAN", nullable: false, description: "Internal vs external stakeholder" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["organization", "role", "influence_level", "interest_level", "is_internal"],
  },
  {
    name: "inventory_items",
    description: "Inventory and product management for business analysis",
    category: "Business",
    businessContext: "Track products, services, and business assets for analysis",
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, description: "Unique inventory item identifier" },
      { name: "name", type: "VARCHAR(255)", nullable: false, description: "Item name" },
      { name: "description", type: "TEXT", nullable: true, description: "Item description" },
      { name: "category", type: "VARCHAR(100)", nullable: false, description: "Item category" },
      { name: "sku", type: "VARCHAR(100)", nullable: true, description: "Stock keeping unit" },
      { name: "status", type: "VARCHAR(50)", nullable: false, description: "Item status (Active, Discontinued, etc.)" },
      { name: "quantity", type: "INTEGER", nullable: true, description: "Current quantity" },
      { name: "unit_price", type: "DECIMAL(10,2)", nullable: true, description: "Unit price" },
      { name: "supplier", type: "VARCHAR(255)", nullable: true, description: "Supplier information" },
      { name: "location", type: "VARCHAR(255)", nullable: true, description: "Storage location" },
      {
        name: "last_updated_by",
        type: "UUID",
        nullable: true,
        foreignKey: "users.id",
        description: "Last updated by user",
      },
      { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Creation timestamp" },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp" },
    ],
    relationships: [],
    indexes: ["category", "sku", "status", "supplier"],
  },
]

const categories = [
  "All",
  "Core",
  "Requirements",
  "Agile",
  "Collaboration",
  "Documentation",
  "Design",
  "Organization",
  "Stakeholder",
  "Business",
]

export default function DataAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const { toast } = useToast()

  const filteredTables = databaseSchema.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.columns.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || table.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} copied successfully`,
    })
  }

  const generateCreateSQL = (table: Table) => {
    const columns = table.columns
      .map((col) => {
        let definition = `  ${col.name} ${col.type}`
        if (!col.nullable) definition += " NOT NULL"
        if (col.primaryKey) definition += " PRIMARY KEY"
        return definition
      })
      .join(",\n")

    const foreignKeys = table.columns
      .filter((col) => col.foreignKey)
      .map((col) => `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreignKey}`)
      .join(",\n")

    return `CREATE TABLE ${table.name} (\n${columns}${foreignKeys ? ",\n" + foreignKeys : ""}\n);`
  }

  const generateSelectSQL = (table: Table) => {
    return `SELECT *\nFROM ${table.name}\nWHERE created_at >= CURRENT_DATE - INTERVAL '30 days'\nORDER BY created_at DESC\nLIMIT 100;`
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            Database Schema Reference
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive database schema for business analysis and data insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schema
          </Button>
          <Button variant="outline">
            <Code className="h-4 w-4 mr-2" />
            Generate DDL
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables, columns, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                Tables ({filteredTables.length})
              </CardTitle>
              <CardDescription>Click on a table to view detailed schema information</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredTables.map((table) => (
                    <div
                      key={table.name}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTable?.name === table.name ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedTable(table)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{table.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {table.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{table.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{table.columns.length} columns</span>
                        <span>{table.relationships.length} relationships</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Table Details */}
        <div className="lg:col-span-2">
          {selectedTable ? (
            <Tabs defaultValue="columns" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="columns">Columns</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="sql">SQL</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="columns">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TableIcon className="h-5 w-5" />
                          {selectedTable.name}
                        </CardTitle>
                        <CardDescription>{selectedTable.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{selectedTable.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Business Context</h4>
                        <p className="text-sm text-muted-foreground">{selectedTable.businessContext}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Columns ({selectedTable.columns.length})</h4>
                        <div className="space-y-2">
                          {selectedTable.columns.map((column) => (
                            <div key={column.name} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-semibold">{column.name}</span>
                                  {column.primaryKey && (
                                    <Badge variant="default" className="text-xs">
                                      <Key className="h-3 w-3 mr-1" />
                                      PK
                                    </Badge>
                                  )}
                                  {column.foreignKey && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Link className="h-3 w-3 mr-1" />
                                      FK
                                    </Badge>
                                  )}
                                  {column.indexed && (
                                    <Badge variant="outline" className="text-xs">
                                      IDX
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                  {column.type} {column.nullable ? "NULL" : "NOT NULL"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{column.description}</p>
                              {column.foreignKey && (
                                <p className="text-xs text-blue-600 mt-1">References: {column.foreignKey}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="relationships">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Relationships & Indexes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Foreign Key Relationships</h4>
                      <div className="space-y-2">
                        {selectedTable.columns
                          .filter((col) => col.foreignKey)
                          .map((column) => (
                            <div key={column.name} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                              <Link className="h-4 w-4 text-blue-600" />
                              <span className="font-mono text-sm">{column.name}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="font-mono text-sm text-blue-600">{column.foreignKey}</span>
                            </div>
                          ))}
                        {selectedTable.columns.filter((col) => col.foreignKey).length === 0 && (
                          <p className="text-muted-foreground text-sm">No foreign key relationships</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Referenced By</h4>
                      <div className="space-y-2">
                        {selectedTable.relationships.map((relationship) => (
                          <div key={relationship} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                            <Link className="h-4 w-4 text-green-600" />
                            <span className="font-mono text-sm text-green-600">{relationship}</span>
                            <span className="text-muted-foreground">references this table</span>
                          </div>
                        ))}
                        {selectedTable.relationships.length === 0 && (
                          <p className="text-muted-foreground text-sm">No incoming references</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Indexes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTable.indexes.map((index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                            <BarChart3 className="h-4 w-4 text-yellow-600" />
                            <span className="font-mono text-sm">{index}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sql">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>CREATE TABLE Statement</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateCreateSQL(selectedTable), "CREATE statement")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateCreateSQL(selectedTable)}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Sample SELECT Query</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateSelectSQL(selectedTable), "SELECT query")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateSelectSQL(selectedTable)}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Data Analysis Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTable.name === "requirements" && (
                          <>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-sm">Requirements Velocity</h5>
                              <p className="text-xs text-muted-foreground">Track requirements submitted over time</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-sm">Sentiment Analysis</h5>
                              <p className="text-xs text-muted-foreground">Monitor sentiment trends in requirements</p>
                            </div>
                          </>
                        )}
                        {selectedTable.name === "projects" && (
                          <>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <h5 className="font-medium text-sm">Project Health</h5>
                              <p className="text-xs text-muted-foreground">Track project health status distribution</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <h5 className="font-medium text-sm">Budget Analysis</h5>
                              <p className="text-xs text-muted-foreground">Monitor budget vs actual spending</p>
                            </div>
                          </>
                        )}
                        {selectedTable.name === "meetings" && (
                          <>
                            <div className="p-3 bg-cyan-50 rounded-lg">
                              <h5 className="font-medium text-sm">Meeting Efficiency</h5>
                              <p className="text-xs text-muted-foreground">Analyze meeting duration vs outcomes</p>
                            </div>
                            <div className="p-3 bg-pink-50 rounded-lg">
                              <h5 className="font-medium text-sm">Attendance Patterns</h5>
                              <p className="text-xs text-muted-foreground">Track stakeholder engagement</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Common Queries</h4>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm mb-1">Trend Analysis</h5>
                          <p className="text-xs text-muted-foreground">
                            GROUP BY DATE_TRUNC('month', created_at) to analyze monthly trends
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm mb-1">Performance Metrics</h5>
                          <p className="text-xs text-muted-foreground">
                            Calculate averages, counts, and percentiles for KPI tracking
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm mb-1">Relationship Analysis</h5>
                          <p className="text-xs text-muted-foreground">
                            JOIN with related tables for comprehensive reporting
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Business Intelligence</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-sm">KPI Dashboards</h5>
                            <p className="text-xs text-muted-foreground">
                              Use timestamp fields for time-series analysis and trend identification
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <Users className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-sm">Stakeholder Analytics</h5>
                            <p className="text-xs text-muted-foreground">
                              Analyze user engagement and participation patterns
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-sm">Process Optimization</h5>
                            <p className="text-xs text-muted-foreground">
                              Identify bottlenecks and improvement opportunities
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[600px] text-center">
                <Database className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Table</h3>
                <p className="text-muted-foreground">
                  Choose a table from the list to view its detailed schema information, relationships, and analysis
                  opportunities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TableIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{databaseSchema.length}</p>
                <p className="text-sm text-muted-foreground">Total Tables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {databaseSchema.reduce((sum, table) => sum + table.columns.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Link className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {databaseSchema.reduce((sum, table) => sum + table.relationships.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Relationships</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {databaseSchema.reduce((sum, table) => sum + table.indexes.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Indexes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
