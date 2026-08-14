import type { Feature, Framework, LearningPath, Testimonial, UserProgress } from "./types"

export const features: Feature[] = [
  {
    title: "Knowledge capture",
    description: "Turn notes, articles, meeting fragments, and BA references into linked concepts with source context.",
    metric: "4x faster retrieval",
  },
  {
    title: "Analysis frameworks",
    description: "Apply structured templates for discovery, strategy, requirements, process design, and validation.",
    metric: "30+ tools",
  },
  {
    title: "AI insight synthesis",
    description: "Ask Sol to compare signals, surface assumptions, and turn scattered research into decision-ready briefs.",
    metric: "Minutes to brief",
  },
  {
    title: "Progress tracking",
    description: "Follow role-based learning paths and measure applied BA skill growth across modules and projects.",
    metric: "Live skill map",
  },
]

export const learningPaths: LearningPath[] = [
  {
    id: "founder-ba",
    title: "Founder Discovery System",
    description: "Learn customer discovery, problem framing, market signals, and decision briefs for early-stage products.",
    order: 1,
    modules: ["Problem framing", "JTBD interviews", "Opportunity sizing", "MVP requirement cuts"],
    audience: "Startup founders",
    duration: "3 weeks",
    level: "Foundation",
    progress: 42,
  },
  {
    id: "pm-requirements",
    title: "Product Requirements Mastery",
    description: "Move from ambiguous product ideas to structured PRDs, acceptance criteria, and traceable decisions.",
    order: 2,
    modules: ["Stakeholder maps", "User stories", "Acceptance criteria", "Traceability"],
    audience: "Product managers",
    duration: "4 weeks",
    level: "Applied",
    progress: 64,
  },
  {
    id: "ba-consulting",
    title: "Business Analysis Consulting",
    description: "Build executive-grade analysis using BABOK thinking, process models, risk views, and recommendation memos.",
    order: 3,
    modules: ["Elicitation", "Current-state analysis", "Future-state design", "Executive synthesis"],
    audience: "Business analysts",
    duration: "5 weeks",
    level: "Advanced",
    progress: 28,
  },
  {
    id: "tech-operator",
    title: "Tech Operator Playbook",
    description: "Connect operational metrics, system constraints, workflows, and automation ideas into practical change plans.",
    order: 4,
    modules: ["Process mapping", "KPI trees", "Root cause analysis", "Automation backlog"],
    audience: "Tech entrepreneurs",
    duration: "3 weeks",
    level: "Applied",
    progress: 53,
  },
]

export const frameworks: Framework[] = [
  {
    id: "swot",
    name: "SWOT",
    category: "Strategy",
    description: "Map strengths, weaknesses, opportunities, and threats before committing to a strategic direction.",
    use_cases: ["Market entry", "Product repositioning", "Partnership review"],
    signal: "Use when the team has options but no shared view of tradeoffs.",
    artifact: "One-page strategy brief",
  },
  {
    id: "porters-five-forces",
    name: "Porter's 5 Forces",
    category: "Market",
    description: "Assess competitive pressure across suppliers, buyers, substitutes, rivals, and new entrants.",
    use_cases: ["Category research", "Investor prep", "Pricing strategy"],
    signal: "Use when competition is misunderstood or reduced to feature comparison.",
    artifact: "Industry attractiveness memo",
  },
  {
    id: "jtbd",
    name: "Jobs To Be Done",
    category: "Customer",
    description: "Understand the progress customers are trying to make and the constraints around switching.",
    use_cases: ["Interview design", "Product positioning", "Feature prioritization"],
    signal: "Use when personas are descriptive but not predictive.",
    artifact: "Job map and switching forces",
  },
  {
    id: "moscow",
    name: "MoSCoW",
    category: "Prioritization",
    description: "Classify requirements into must, should, could, and will-not scope decisions.",
    use_cases: ["MVP planning", "Release cuts", "Stakeholder alignment"],
    signal: "Use when every requirement is being treated as mandatory.",
    artifact: "Scope decision matrix",
  },
  {
    id: "bpmn-lite",
    name: "BPMN Lite",
    category: "Process",
    description: "Document actors, decisions, handoffs, and exceptions without over-modeling the operation.",
    use_cases: ["Workflow redesign", "Automation planning", "Onboarding"],
    signal: "Use when process pain is hidden in handoffs.",
    artifact: "Current and future-state flow",
  },
  {
    id: "kano",
    name: "Kano Model",
    category: "Product",
    description: "Separate basic expectations, performance features, and delight factors for product decisions.",
    use_cases: ["Roadmap planning", "Customer research", "Feature audits"],
    signal: "Use when customer value is being measured only by votes.",
    artifact: "Feature satisfaction map",
  },
  {
    id: "pestle",
    name: "PESTLE",
    category: "Environment",
    description: "Scan political, economic, social, technological, legal, and environmental forces.",
    use_cases: ["Expansion planning", "Risk discovery", "Policy shifts"],
    signal: "Use when external risk could reshape the product or business model.",
    artifact: "External forces brief",
  },
  {
    id: "rtm",
    name: "Traceability Matrix",
    category: "Requirements",
    description: "Connect business goals, stakeholder needs, requirements, tests, and release evidence.",
    use_cases: ["Audit readiness", "QA alignment", "Change control"],
    signal: "Use when decisions are getting lost between discovery and delivery.",
    artifact: "Requirements traceability table",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "mira",
    name: "Mira Tran",
    role: "Founder",
    company: "RelayOps",
    quote: "Sol helped us turn a messy folder of customer calls into a crisp opportunity map before our next investor update.",
    avatar_url: "/placeholder-user.jpg",
  },
  {
    id: "alex",
    name: "Alex Nguyen",
    role: "Product Lead",
    company: "Northstar Labs",
    quote: "The framework library makes analysis repeatable. My team now starts with the right question instead of a blank page.",
    avatar_url: "/placeholder-user.jpg",
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    role: "Senior BA",
    company: "FinEdge",
    quote: "The learning paths connect theory to artifacts. I can see exactly which BA skills are improving through real work.",
    avatar_url: "/placeholder-user.jpg",
  },
]

export const userProgress: UserProgress[] = [
  { id: "up-1", user_id: "demo", module_id: "problem-framing", completed_at: "2026-07-02T09:00:00Z", score: 92 },
  { id: "up-2", user_id: "demo", module_id: "jtbd-interviews", completed_at: "2026-07-05T09:00:00Z", score: 88 },
  { id: "up-3", user_id: "demo", module_id: "traceability", completed_at: null, score: 0 },
]
