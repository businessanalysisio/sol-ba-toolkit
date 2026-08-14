export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: "active" | "away" | "offline"
}

export interface WorkspaceTask {
  id: string
  title: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
}

export interface WorkspaceDocument {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
  author: string
}

export interface WorkspaceGoal {
  id: string
  title: string
  description: string
  progress: number
  targetDate: string
  status: "on-track" | "at-risk" | "completed"
}

export interface WorkspaceMilestone {
  id: string
  title: string
  date: string
  status: "upcoming" | "completed" | "overdue"
  description: string
}

export interface Workspace {
  id: string
  name: string
  description: string
  type: "project" | "team" | "client"
  status: "active" | "planning" | "completed" | "on-hold"
  progress: number
  startDate: string
  endDate: string
  members: WorkspaceMember[]
  tasks: WorkspaceTask[]
  documents: WorkspaceDocument[]
  goals: WorkspaceGoal[]
  milestones: WorkspaceMilestone[]
  tags: string[]
  budget?: number
  spent?: number
}

export interface KnowledgeCategory {
  id: string
  name: string
  description: string
  icon: string
  articleCount: number
}

export interface KnowledgeArticle {
  id: string
  title: string
  slug: string
  content: string
  category: string
  tags: string[]
  lastUpdated: string
  readTime: number
  author: string
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: User
  publishedAt: string
  updatedAt: string
  readTime: number
  featured: boolean
}

export interface Partner {
  id: string
  name: string
  type: "vendor" | "client" | "consultant" | "technology"
  status: "active" | "inactive" | "pending"
  contactPerson: string
  email: string
  phone?: string
  website?: string
  description: string
  services: string[]
  projects: string[]
  contractStart?: string
  contractEnd?: string
  rating: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: "workshop" | "meeting" | "training" | "conference"
  startDate: string
  endDate: string
  location: string
  isVirtual: boolean
  meetingLink?: string
  organizer: User
  attendees: User[]
  maxAttendees?: number
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  tags: string[]
  createdAt: string
}

// Sample users data
export const sampleUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Senior Business Analyst",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Business Analyst",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Product Owner",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Project Manager",
  },
]

// Knowledge categories data
export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "requirements",
    name: "Requirements Engineering",
    description: "Best practices for gathering, analyzing, and documenting requirements",
    icon: "FileText",
    articleCount: 12,
  },
  {
    id: "stakeholder",
    name: "Stakeholder Management",
    description: "Techniques for identifying, engaging, and managing stakeholders",
    icon: "Users",
    articleCount: 8,
  },
  {
    id: "process",
    name: "Process Analysis",
    description: "Methods for analyzing and improving business processes",
    icon: "GitBranch",
    articleCount: 10,
  },
  {
    id: "documentation",
    name: "Documentation Standards",
    description: "Templates and guidelines for BA documentation",
    icon: "BookOpen",
    articleCount: 15,
  },
  {
    id: "agile",
    name: "Agile BA Practices",
    description: "Business analysis in agile and iterative environments",
    icon: "Zap",
    articleCount: 9,
  },
  {
    id: "tools",
    name: "BA Tools & Techniques",
    description: "Software tools and analytical techniques for business analysts",
    icon: "Wrench",
    articleCount: 11,
  },
]

// Knowledge articles data
export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "req-001",
    title: "Requirements Elicitation Techniques",
    slug: "requirements-elicitation-techniques",
    content: `# Requirements Elicitation Techniques

Requirements elicitation is the practice of collecting requirements from stakeholders and other sources. Here are the most effective techniques:

## 1. Interviews
One-on-one conversations with stakeholders to gather detailed requirements.

**Best Practices:**
- Prepare structured questions in advance
- Use open-ended questions to encourage discussion
- Document everything and confirm understanding
- Follow up with written summaries

## 2. Workshops
Collaborative sessions with multiple stakeholders to define requirements together.

**Benefits:**
- Builds consensus among stakeholders
- Identifies conflicts early
- Encourages creative solutions
- More efficient than individual interviews

## 3. Observation
Watching users perform their current tasks to understand actual vs. stated requirements.

**When to Use:**
- When processes are complex or poorly documented
- To identify inefficiencies in current workflows
- To understand user behavior patterns

## 4. Document Analysis
Reviewing existing documentation, reports, and systems to understand current state.

**Sources to Review:**
- Business process documents
- System documentation
- User manuals
- Regulatory requirements
- Historical data and reports

## 5. Prototyping
Creating early versions of solutions to validate requirements with stakeholders.

**Types:**
- Paper prototypes for quick feedback
- Digital mockups for user interface design
- Working prototypes for complex functionality

## Key Success Factors

1. **Stakeholder Engagement**: Ensure all relevant stakeholders are involved
2. **Clear Communication**: Use language that stakeholders understand
3. **Documentation**: Record all requirements clearly and consistently
4. **Validation**: Confirm requirements with stakeholders before proceeding
5. **Iteration**: Be prepared to refine requirements as understanding improves`,
    category: "requirements",
    tags: ["elicitation", "interviews", "workshops", "stakeholders"],
    lastUpdated: "2024-01-15",
    readTime: 8,
    author: "Sarah Johnson",
  },
  {
    id: "stake-001",
    title: "Stakeholder Analysis and Management",
    slug: "stakeholder-analysis-management",
    content: `# Stakeholder Analysis and Management

Effective stakeholder management is crucial for project success. This guide covers identification, analysis, and engagement strategies.

## Stakeholder Identification

### Primary Stakeholders
- **Project Sponsors**: Provide funding and high-level support
- **End Users**: Will use the final product or service
- **Business Owners**: Own the business processes being changed
- **IT Teams**: Implement technical solutions

### Secondary Stakeholders
- **Regulatory Bodies**: May impose compliance requirements
- **Vendors**: Provide external services or products
- **Support Teams**: Maintain and support solutions
- **Customers**: May be impacted by changes

## Stakeholder Analysis Matrix

Use the Power/Interest grid to categorize stakeholders:

### High Power, High Interest (Manage Closely)
- Regular communication
- Involve in decision-making
- Address concerns immediately

### High Power, Low Interest (Keep Satisfied)
- Periodic updates
- Don't overwhelm with details
- Ensure they remain supportive

### Low Power, High Interest (Keep Informed)
- Regular communication
- Use as project advocates
- Gather detailed feedback

### Low Power, Low Interest (Monitor)
- Minimal communication
- Watch for changes in interest/power
- Don't ignore completely

## Engagement Strategies

### Communication Planning
1. **Frequency**: How often to communicate with each stakeholder group
2. **Method**: Email, meetings, reports, presentations
3. **Content**: What information each group needs
4. **Timing**: When to communicate (milestones, decisions, issues)

### Building Relationships
- Understand individual motivations and concerns
- Find common ground and shared objectives
- Be transparent about challenges and constraints
- Celebrate successes together

### Managing Conflicts
1. **Identify** conflicting requirements early
2. **Understand** the underlying business needs
3. **Facilitate** discussions between conflicting parties
4. **Document** decisions and rationale
5. **Communicate** resolutions to all affected parties

## Best Practices

1. **Start Early**: Begin stakeholder analysis in project initiation
2. **Keep Updated**: Stakeholder landscape can change during projects
3. **Be Inclusive**: Don't forget about indirect stakeholders
4. **Document Everything**: Maintain stakeholder register and communication logs
5. **Measure Engagement**: Track stakeholder satisfaction and engagement levels`,
    category: "stakeholder",
    tags: ["stakeholders", "analysis", "communication", "management"],
    lastUpdated: "2024-01-12",
    readTime: 10,
    author: "Michael Chen",
  },
  {
    id: "proc-001",
    title: "Business Process Modeling",
    slug: "business-process-modeling",
    content: `# Business Process Modeling

Business process modeling is essential for understanding current state operations and designing future state improvements.

## What is Business Process Modeling?

Business process modeling is the graphical representation of business processes to:
- Document current state operations
- Identify improvement opportunities
- Design future state processes
- Communicate process changes to stakeholders

## Common Modeling Techniques

### 1. Flowcharts
Simple diagrams showing process steps and decision points.

**Best For:**
- High-level process overviews
- Simple, linear processes
- Quick documentation

**Elements:**
- Start/End ovals
- Process rectangles
- Decision diamonds
- Flow arrows

### 2. BPMN (Business Process Model and Notation)
Standardized notation for detailed process modeling.

**Advantages:**
- Industry standard
- Supports complex processes
- Clear notation rules
- Tool support

**Key Elements:**
- Events (start, intermediate, end)
- Activities (tasks, sub-processes)
- Gateways (decision points)
- Sequence flows

### 3. Swimlane Diagrams
Show processes across different roles or departments.

**Benefits:**
- Clear responsibility assignment
- Identifies handoffs
- Shows organizational boundaries
- Highlights communication needs

### 4. Value Stream Maps
Focus on value-added vs. non-value-added activities.

**Use Cases:**
- Lean process improvement
- Waste identification
- Cycle time analysis
- Cost reduction initiatives

## Modeling Best Practices

### 1. Define Scope and Purpose
- What process are you modeling?
- What level of detail is needed?
- Who is the audience?
- What decisions will the model support?

### 2. Gather Information
- Interview process participants
- Observe actual work
- Review existing documentation
- Collect process metrics

### 3. Start Simple
- Begin with high-level overview
- Add detail incrementally
- Focus on main path first
- Add exceptions and variations later

### 4. Validate with Stakeholders
- Review models with process participants
- Confirm accuracy and completeness
- Get sign-off from process owners
- Update based on feedback

### 5. Keep Models Current
- Update when processes change
- Regular review cycles
- Version control
- Change documentation

## Process Analysis Techniques

### Gap Analysis
Compare current state vs. desired future state:
1. Document current process
2. Define target process
3. Identify gaps and differences
4. Prioritize improvement opportunities
5. Develop implementation plan

### Root Cause Analysis
When problems are identified:
1. Define the problem clearly
2. Gather data about the issue
3. Identify potential causes
4. Test and validate root causes
5. Develop solutions

### Process Metrics
Key measurements to track:
- **Cycle Time**: Total time from start to finish
- **Processing Time**: Actual work time
- **Wait Time**: Time spent waiting
- **Error Rate**: Percentage of defects
- **Cost per Transaction**: Resource consumption
- **Customer Satisfaction**: End user experience

## Tools for Process Modeling

### Free Tools
- Draw.io (now diagrams.net)
- Lucidchart (free tier)
- Microsoft Visio (if available)
- Google Drawings

### Professional Tools
- Bizagi Modeler
- ARIS
- IBM Blueworks Live
- Signavio
- Camunda Modeler

## Common Pitfalls to Avoid

1. **Too Much Detail**: Start high-level, add detail as needed
2. **Modeling the Exception**: Focus on normal flow first
3. **Not Validating**: Always confirm with process participants
4. **Static Models**: Keep models updated as processes change
5. **Ignoring the Audience**: Tailor detail level to your audience`,
    category: "process",
    tags: ["process modeling", "BPMN", "flowcharts", "analysis"],
    lastUpdated: "2024-01-10",
    readTime: 12,
    author: "Lisa Rodriguez",
  },
]

// Sample workspaces data
export const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Customer Portal Redesign",
    description: "Modernizing the customer-facing portal to improve user experience and reduce support tickets",
    type: "project",
    status: "active",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    budget: 150000,
    spent: 97500,
    tags: ["UX", "Customer Experience", "Web Development"],
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@company.com",
        role: "Lead Business Analyst",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike@company.com",
        role: "UX Designer",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
      {
        id: "3",
        name: "Emily Davis",
        email: "emily@company.com",
        role: "Frontend Developer",
        avatar: "/placeholder-user.jpg",
        status: "away",
      },
      {
        id: "4",
        name: "John Smith",
        email: "john@company.com",
        role: "Product Owner",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
    ],
    tasks: [
      {
        id: "1",
        title: "Complete user journey mapping",
        status: "completed",
        priority: "high",
        assignee: "Sarah Johnson",
        dueDate: "2024-02-15",
      },
      {
        id: "2",
        title: "Design new dashboard wireframes",
        status: "in-progress",
        priority: "high",
        assignee: "Mike Chen",
        dueDate: "2024-02-28",
      },
      {
        id: "3",
        title: "Implement responsive navigation",
        status: "todo",
        priority: "medium",
        assignee: "Emily Davis",
        dueDate: "2024-03-15",
      },
      {
        id: "4",
        title: "User acceptance testing",
        status: "todo",
        priority: "high",
        assignee: "John Smith",
        dueDate: "2024-04-15",
      },
    ],
    documents: [
      {
        id: "1",
        name: "Requirements Document v2.1",
        type: "PDF",
        size: "2.4 MB",
        lastModified: "2024-02-10",
        author: "Sarah Johnson",
      },
      {
        id: "2",
        name: "User Research Findings",
        type: "DOCX",
        size: "1.8 MB",
        lastModified: "2024-02-08",
        author: "Mike Chen",
      },
      {
        id: "3",
        name: "Technical Architecture",
        type: "PDF",
        size: "3.2 MB",
        lastModified: "2024-02-05",
        author: "Emily Davis",
      },
    ],
    goals: [
      {
        id: "1",
        title: "Reduce customer support tickets by 30%",
        description: "Improve self-service capabilities to reduce support burden",
        progress: 45,
        targetDate: "2024-04-30",
        status: "on-track",
      },
      {
        id: "2",
        title: "Increase user satisfaction score to 4.5/5",
        description: "Enhance user experience through better design and functionality",
        progress: 60,
        targetDate: "2024-04-30",
        status: "on-track",
      },
    ],
    milestones: [
      {
        id: "1",
        title: "Requirements Sign-off",
        date: "2024-02-15",
        status: "completed",
        description: "All stakeholders approve final requirements",
      },
      {
        id: "2",
        title: "Design Review",
        date: "2024-03-01",
        status: "upcoming",
        description: "Present final designs to stakeholders",
      },
      {
        id: "3",
        title: "Beta Launch",
        date: "2024-04-01",
        status: "upcoming",
        description: "Release beta version to select users",
      },
    ],
  },
  {
    id: "2",
    name: "Supply Chain Optimization",
    description: "Analyzing and improving supply chain processes to reduce costs and improve efficiency",
    type: "project",
    status: "planning",
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    budget: 200000,
    spent: 25000,
    tags: ["Supply Chain", "Process Improvement", "Cost Reduction"],
    members: [
      {
        id: "5",
        name: "David Wilson",
        email: "david@company.com",
        role: "Senior Business Analyst",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
      {
        id: "6",
        name: "Anna Martinez",
        email: "anna@company.com",
        role: "Supply Chain Manager",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
      {
        id: "7",
        name: "Robert Taylor",
        email: "robert@company.com",
        role: "Data Analyst",
        avatar: "/placeholder-user.jpg",
        status: "offline",
      },
    ],
    tasks: [
      {
        id: "5",
        title: "Current state process mapping",
        status: "in-progress",
        priority: "high",
        assignee: "David Wilson",
        dueDate: "2024-02-28",
      },
      {
        id: "6",
        title: "Vendor performance analysis",
        status: "todo",
        priority: "medium",
        assignee: "Anna Martinez",
        dueDate: "2024-03-15",
      },
      {
        id: "7",
        title: "Cost analysis dashboard",
        status: "todo",
        priority: "low",
        assignee: "Robert Taylor",
        dueDate: "2024-03-30",
      },
    ],
    documents: [
      {
        id: "4",
        name: "Project Charter",
        type: "PDF",
        size: "1.2 MB",
        lastModified: "2024-02-01",
        author: "David Wilson",
      },
      {
        id: "5",
        name: "Stakeholder Analysis",
        type: "XLSX",
        size: "856 KB",
        lastModified: "2024-02-03",
        author: "Anna Martinez",
      },
    ],
    goals: [
      {
        id: "3",
        title: "Reduce supply chain costs by 15%",
        description: "Optimize processes and vendor relationships",
        progress: 20,
        targetDate: "2024-08-31",
        status: "on-track",
      },
    ],
    milestones: [
      {
        id: "4",
        title: "Stakeholder Alignment",
        date: "2024-02-15",
        status: "completed",
        description: "All stakeholders aligned on project scope",
      },
      {
        id: "5",
        title: "Current State Analysis Complete",
        date: "2024-03-31",
        status: "upcoming",
        description: "Finish analyzing current supply chain processes",
      },
    ],
  },
  {
    id: "3",
    name: "Digital Marketing Team",
    description: "Ongoing support for digital marketing initiatives and campaign analysis",
    type: "team",
    status: "active",
    progress: 80,
    startDate: "2023-09-01",
    endDate: "2024-12-31",
    tags: ["Marketing", "Analytics", "Campaign Management"],
    members: [
      {
        id: "8",
        name: "Jessica Brown",
        email: "jessica@company.com",
        role: "Marketing Analyst",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
      {
        id: "9",
        name: "Kevin Lee",
        email: "kevin@company.com",
        role: "Campaign Manager",
        avatar: "/placeholder-user.jpg",
        status: "active",
      },
    ],
    tasks: [
      {
        id: "8",
        title: "Q1 campaign performance review",
        status: "completed",
        priority: "medium",
        assignee: "Jessica Brown",
        dueDate: "2024-01-31",
      },
      {
        id: "9",
        title: "Social media analytics setup",
        status: "in-progress",
        priority: "high",
        assignee: "Kevin Lee",
        dueDate: "2024-02-29",
      },
    ],
    documents: [
      {
        id: "6",
        name: "Marketing Analytics Dashboard",
        type: "XLSX",
        size: "2.1 MB",
        lastModified: "2024-02-12",
        author: "Jessica Brown",
      },
    ],
    goals: [
      {
        id: "4",
        title: "Improve campaign ROI by 25%",
        description: "Optimize targeting and messaging based on data analysis",
        progress: 75,
        targetDate: "2024-06-30",
        status: "on-track",
      },
    ],
    milestones: [
      {
        id: "6",
        title: "Analytics Platform Migration",
        date: "2024-03-15",
        status: "upcoming",
        description: "Complete migration to new analytics platform",
      },
    ],
  },
]

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: "1",
    title: "Business Requirements Document (BRD) Template",
    slug: "brd-template",
    content: `# Business Requirements Document Template

## 1. Executive Summary
Provide a high-level overview of the project, its objectives, and expected outcomes.

## 2. Project Overview
### 2.1 Project Background
Describe the business context and reasons for the project.

### 2.2 Project Objectives
List the specific goals and objectives the project aims to achieve.

### 2.3 Success Criteria
Define measurable criteria that will determine project success.

## 3. Stakeholder Analysis
### 3.1 Primary Stakeholders
List key stakeholders and their roles in the project.

### 3.2 Secondary Stakeholders
Identify other parties affected by or interested in the project.

## 4. Business Requirements
### 4.1 Functional Requirements
Detail what the system or solution must do.

### 4.2 Non-Functional Requirements
Specify performance, security, and other quality requirements.

### 4.3 Business Rules
Document business policies and constraints.

## 5. Assumptions and Constraints
### 5.1 Assumptions
List assumptions made during requirements gathering.

### 5.2 Constraints
Identify limitations and restrictions.

## 6. Risk Assessment
Identify potential risks and mitigation strategies.

## 7. Approval and Sign-off
Document approval process and required signatures.`,
    excerpt:
      "A comprehensive template for creating Business Requirements Documents with all essential sections and guidelines.",
    category: "Templates",
    tags: ["BRD", "Requirements", "Documentation", "Template"],
    author: sampleUsers[0],
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-20",
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    title: "Stakeholder Analysis Best Practices",
    slug: "stakeholder-analysis-best-practices",
    content: `# Stakeholder Analysis Best Practices

## Introduction
Effective stakeholder analysis is crucial for project success. This guide provides proven techniques for identifying, analyzing, and managing stakeholders throughout your project lifecycle.

## 1. Stakeholder Identification
### 1.1 Brainstorming Sessions
Conduct collaborative sessions to identify all potential stakeholders.

### 1.2 Stakeholder Categories
- **Primary Stakeholders**: Directly affected by the project
- **Secondary Stakeholders**: Indirectly affected or influential
- **Key Players**: High influence and interest

### 1.3 Identification Techniques
- Organizational charts review
- Process mapping
- Interview key personnel
- Review existing documentation

## 2. Stakeholder Analysis Matrix
### 2.1 Power/Interest Grid
Plot stakeholders based on their level of power and interest:
- **High Power, High Interest**: Manage closely
- **High Power, Low Interest**: Keep satisfied
- **Low Power, Low Interest**: Monitor

### 2.2 Influence/Impact Assessment
Evaluate each stakeholder's ability to influence the project and the impact the project will have on them.

## 3. Engagement Strategies
### 3.1 Communication Planning
Develop tailored communication strategies for each stakeholder group.

### 3.2 Engagement Techniques
- Regular meetings and updates
- Workshops and collaborative sessions
- Surveys and feedback collection
- One-on-one discussions

## 4. Ongoing Management
### 4.1 Regular Reviews
Conduct periodic stakeholder analysis reviews to identify changes.

### 4.2 Relationship Maintenance
Maintain positive relationships through consistent engagement.

## 5. Common Pitfalls to Avoid
- Incomplete stakeholder identification
- Static analysis without updates
- One-size-fits-all communication
- Ignoring negative stakeholders

## Conclusion
Effective stakeholder analysis and management is an ongoing process that requires attention throughout the project lifecycle.`,
    excerpt:
      "Learn proven techniques for identifying, analyzing, and managing stakeholders effectively throughout your project lifecycle.",
    category: "Best Practices",
    tags: ["Stakeholders", "Analysis", "Management", "Communication"],
    author: sampleUsers[1],
    publishedAt: "2024-01-10",
    updatedAt: "2024-01-18",
    readTime: 12,
    featured: true,
  },
  {
    id: "3",
    title: "Agile Requirements Gathering Techniques",
    slug: "agile-requirements-gathering",
    content: `# Agile Requirements Gathering Techniques

## Overview
Traditional requirements gathering doesn't always fit agile methodologies. This guide explores techniques specifically designed for agile environments.

## 1. User Stories
### 1.1 Structure
As a [user type], I want [functionality] so that [benefit].

### 1.2 INVEST Criteria
- **Independent**: Can be developed independently
- **Negotiable**: Details can be discussed
- **Valuable**: Provides value to users
- **Estimable**: Can be estimated for effort
- **Small**: Fits within a sprint
- **Testable**: Has clear acceptance criteria

## 2. Story Mapping
### 2.1 Process
1. Identify user activities
2. Break down into user tasks
3. Prioritize and sequence
4. Group into releases

### 2.2 Benefits
- Visual representation of user journey
- Helps identify gaps and dependencies
- Facilitates prioritization discussions

## 3. Three Amigos Sessions
### 3.1 Participants
- Business Analyst/Product Owner
- Developer
- Tester

### 3.2 Purpose
Collaborative discussion to ensure shared understanding of requirements.

## 4. Acceptance Criteria
### 4.1 Given-When-Then Format
- **Given**: Initial context
- **When**: Event or action
- **Then**: Expected outcome

### 4.2 Best Practices
- Be specific and measurable
- Include both positive and negative scenarios
- Keep them independent

## 5. Backlog Refinement
### 5.1 Regular Sessions
Ongoing process to refine and prioritize backlog items.

### 5.2 Activities
- Add detail to user stories
- Estimate effort
- Split large stories
- Remove outdated items

## 6. Prototyping and Wireframing
### 6.1 Low-Fidelity Prototypes
Quick sketches to validate concepts.

### 6.2 Interactive Prototypes
Clickable prototypes for user testing.

## Conclusion
Agile requirements gathering is iterative and collaborative, focusing on just enough detail to move forward while maintaining flexibility.`,
    excerpt:
      "Explore techniques specifically designed for gathering requirements in agile environments, including user stories, story mapping, and collaborative sessions.",
    category: "Agile",
    tags: ["Agile", "Requirements", "User Stories", "Scrum"],
    author: sampleUsers[2],
    publishedAt: "2024-01-08",
    updatedAt: "2024-01-16",
    readTime: 10,
    featured: false,
  },
]

export const samplePartners: Partner[] = [
  {
    id: "1",
    name: "TechSolutions Inc.",
    type: "vendor",
    status: "active",
    contactPerson: "David Wilson",
    email: "david.wilson@techsolutions.com",
    phone: "+1-555-0123",
    website: "https://techsolutions.com",
    description: "Leading software development and IT consulting firm specializing in enterprise solutions.",
    services: ["Software Development", "IT Consulting", "Cloud Migration", "DevOps"],
    projects: ["Customer Portal Redesign", "CRM Integration"],
    contractStart: "2023-06-01",
    contractEnd: "2024-12-31",
    rating: 4.5,
    notes: "Excellent technical expertise and project delivery. Strong communication and collaborative approach.",
    createdAt: "2023-05-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "DataAnalytics Pro",
    type: "consultant",
    status: "active",
    contactPerson: "Lisa Chen",
    email: "lisa.chen@dataanalyticspro.com",
    phone: "+1-555-0456",
    website: "https://dataanalyticspro.com",
    description: "Specialized data analytics and business intelligence consulting firm.",
    services: ["Data Analytics", "BI Implementation", "Data Visualization", "Reporting"],
    projects: ["Digital Transformation Initiative"],
    contractStart: "2023-09-01",
    contractEnd: "2024-08-31",
    rating: 4.8,
    notes:
      "Outstanding data analysis capabilities. Helped identify key business insights and optimization opportunities.",
    createdAt: "2023-08-15",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    name: "Global Manufacturing Corp",
    type: "client",
    status: "active",
    contactPerson: "Robert Johnson",
    email: "robert.johnson@globalmanufacturing.com",
    phone: "+1-555-0789",
    website: "https://globalmanufacturing.com",
    description: "Large manufacturing company requiring business process optimization and digital transformation.",
    services: ["Business Analysis", "Process Optimization", "Change Management"],
    projects: ["Supply Chain Optimization", "ERP Implementation"],
    contractStart: "2023-10-01",
    contractEnd: "2025-03-31",
    rating: 4.2,
    notes: "Complex requirements but good collaboration. Regular stakeholder meetings have been productive.",
    createdAt: "2023-09-20",
    updatedAt: "2024-01-22",
  },
]

export const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Requirements Gathering Workshop",
    description: "Interactive workshop to gather and prioritize requirements for the customer portal redesign project.",
    type: "workshop",
    startDate: "2024-02-15T09:00:00Z",
    endDate: "2024-02-15T17:00:00Z",
    location: "Conference Room A",
    isVirtual: false,
    organizer: sampleUsers[0],
    attendees: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    maxAttendees: 12,
    status: "scheduled",
    tags: ["Requirements", "Workshop", "Customer Portal"],
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Stakeholder Review Meeting",
    description: "Monthly stakeholder review meeting to discuss project progress and upcoming milestones.",
    type: "meeting",
    startDate: "2024-02-20T14:00:00Z",
    endDate: "2024-02-20T15:30:00Z",
    location: "Virtual",
    isVirtual: true,
    meetingLink: "https://meet.company.com/stakeholder-review",
    organizer: sampleUsers[1],
    attendees: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]],
    status: "scheduled",
    tags: ["Stakeholders", "Review", "Progress"],
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "3",
    title: "Agile BA Training Session",
    description: "Training session on agile business analysis techniques and best practices.",
    type: "training",
    startDate: "2024-03-01T10:00:00Z",
    endDate: "2024-03-01T16:00:00Z",
    location: "Training Room B",
    isVirtual: false,
    organizer: sampleUsers[2],
    attendees: [sampleUsers[0], sampleUsers[1]],
    maxAttendees: 20,
    status: "scheduled",
    tags: ["Training", "Agile", "Business Analysis"],
    createdAt: "2024-01-30T09:00:00Z",
  },
]

// Helper functions - ALL REQUIRED EXPORTS
export function getAllWorkspaces(): Workspace[] {
  return workspaces
}

export function getWorkspaceById(id: string): Workspace | undefined {
  return workspaces.find((workspace) => workspace.id === id)
}

export function getKnowledgeArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return knowledgeArticles.find((article) => article.slug === slug)
}

export function getKnowledgeArticlesByCategory(category: string): KnowledgeArticle[] {
  return knowledgeArticles.filter((article) => article.category === category)
}

export function searchKnowledgeArticles(query: string): KnowledgeArticle[] {
  const lowercaseQuery = query.toLowerCase()
  return knowledgeArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getPartnerById(id: string): Partner | undefined {
  return samplePartners.find((partner) => partner.id === id)
}

export function getEventById(id: string): Event | undefined {
  return sampleEvents.find((event) => event.id === id)
}

export function getKnowledgeBaseArticleBySlug(slug: string): KnowledgeBaseArticle | undefined {
  return knowledgeBaseArticles.find((article) => article.slug === slug)
}

export function getWorkspacesByStatus(status: Workspace["status"]): Workspace[] {
  return workspaces.filter((workspace) => workspace.status === status)
}

export function getPartnersByType(type: Partner["type"]): Partner[] {
  return samplePartners.filter((partner) => partner.type === type)
}

export function getEventsByType(type: Event["type"]): Event[] {
  return sampleEvents.filter((event) => event.type === type)
}

export function getFeaturedKnowledgeBaseArticles(): KnowledgeBaseArticle[] {
  return knowledgeBaseArticles.filter((article) => article.featured)
}

export function getKnowledgeBaseArticlesByCategory(category: string): KnowledgeBaseArticle[] {
  return knowledgeBaseArticles.filter((article) => article.category === category)
}

export function searchWorkspaces(query: string): Workspace[] {
  const lowercaseQuery = query.toLowerCase()
  return workspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(lowercaseQuery) ||
      workspace.description.toLowerCase().includes(lowercaseQuery) ||
      workspace.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
  const lowercaseQuery = query.toLowerCase()
  return knowledgeBaseArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

// Community announcements data
export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "urgent" | "event" | "update"
  author: User
  publishedAt: string
  pinned: boolean
  tags: string[]
}

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "New BA Toolkit Features Released",
    content:
      "We've added new AI-powered analysis tools and enhanced the requirements repository. Check out the updated features in the AI Workspace section.",
    type: "update",
    author: sampleUsers[0],
    publishedAt: "2024-02-10T09:00:00Z",
    pinned: true,
    tags: ["features", "ai", "update"],
  },
  {
    id: "2",
    title: "Monthly BA Community Meeting",
    content:
      "Join us for our monthly community meeting this Friday at 2 PM EST. We'll be discussing best practices for stakeholder management and sharing success stories.",
    type: "event",
    author: sampleUsers[1],
    publishedAt: "2024-02-08T14:30:00Z",
    pinned: false,
    tags: ["meeting", "community", "stakeholders"],
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    content:
      "Scheduled maintenance will occur this Sunday from 2-4 AM EST. The system will be temporarily unavailable during this time.",
    type: "urgent",
    author: sampleUsers[2],
    publishedAt: "2024-02-07T16:00:00Z",
    pinned: true,
    tags: ["maintenance", "system", "downtime"],
  },
]

// Community members data
export interface CommunityMember {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  expertise: string[]
  joinDate: string
  status: "active" | "away" | "offline"
  bio: string
  projects: string[]
  certifications: string[]
}

export const communityMembers: CommunityMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Senior Business Analyst",
    department: "Digital Transformation",
    expertise: ["Requirements Engineering", "Stakeholder Management", "Process Analysis"],
    joinDate: "2023-01-15",
    status: "active",
    bio: "Experienced BA with 8+ years in digital transformation projects. Passionate about agile methodologies and user-centered design.",
    projects: ["Customer Portal Redesign", "Digital Transformation Initiative"],
    certifications: ["CBAP", "PMI-PBA", "Agile Analysis Certification"],
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Business Analyst",
    department: "IT Operations",
    expertise: ["Data Analysis", "System Integration", "Technical Documentation"],
    joinDate: "2023-03-20",
    status: "active",
    bio: "Technical BA specializing in system integrations and data analysis. Strong background in SQL and business intelligence tools.",
    projects: ["Supply Chain Optimization", "CRM Integration"],
    certifications: ["CCBA", "Six Sigma Green Belt"],
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Product Owner",
    department: "Product Management",
    expertise: ["Product Strategy", "User Research", "Agile Methodologies"],
    joinDate: "2022-11-10",
    status: "away",
    bio: "Product-focused BA with expertise in user research and agile product development. Advocates for user-centered design principles.",
    projects: ["Customer Portal Redesign", "Mobile App Development"],
    certifications: ["CSPO", "SAFe PO/PM"],
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Project Manager",
    department: "PMO",
    expertise: ["Project Management", "Risk Management", "Change Management"],
    joinDate: "2023-05-08",
    status: "active",
    bio: "Experienced PM working closely with BA teams. Focuses on ensuring successful project delivery and stakeholder satisfaction.",
    projects: ["Digital Transformation Initiative", "Process Automation"],
    certifications: ["PMP", "Change Management Professional"],
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@company.com",
    avatar: "/placeholder-user.jpg",
    role: "Senior Business Analyst",
    department: "Finance",
    expertise: ["Financial Analysis", "Regulatory Compliance", "Process Improvement"],
    joinDate: "2022-08-15",
    status: "active",
    bio: "Finance-focused BA with deep expertise in regulatory requirements and financial process optimization.",
    projects: ["Financial Reporting Automation", "Compliance Management System"],
    certifications: ["CBAP", "CPA", "Lean Six Sigma Black Belt"],
  },
]

// Re-export events with the correct name (it was already defined as sampleEvents)
export const events = sampleEvents
