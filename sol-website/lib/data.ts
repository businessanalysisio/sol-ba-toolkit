import type { Framework, LearningPath, Testimonial } from "./types";

export const learningPaths: LearningPath[] = [
  {
    id: "path-foundations",
    title: "BA Foundations",
    description:
      "Master the core mindset: elicitation, stakeholder mapping, and turning vague asks into crisp requirements.",
    order: 1,
    level: "Foundation",
    duration: "4 weeks",
    accent: "from-amber-400 to-orange-500",
    modules: [
      { id: "m1", path_id: "path-foundations", title: "What business analysis actually is", content: "", order: 1 },
      { id: "m2", path_id: "path-foundations", title: "Stakeholder mapping & power grids", content: "", order: 2 },
      { id: "m3", path_id: "path-foundations", title: "Elicitation techniques that work", content: "", order: 3 },
      { id: "m4", path_id: "path-foundations", title: "Writing requirements people read", content: "", order: 4 },
      { id: "m5", path_id: "path-foundations", title: "Acceptance criteria & Gherkin", content: "", order: 5 },
    ],
  },
  {
    id: "path-strategy",
    title: "Strategy Analysis",
    description:
      "Assess markets, model competition, and connect company strategy to the initiatives you scope.",
    order: 2,
    level: "Intermediate",
    duration: "5 weeks",
    accent: "from-orange-400 to-rose-500",
    modules: [
      { id: "m6", path_id: "path-strategy", title: "Current state vs. future state", content: "", order: 1 },
      { id: "m7", path_id: "path-strategy", title: "SWOT & PESTLE in practice", content: "", order: 2 },
      { id: "m8", path_id: "path-strategy", title: "Porter's Five Forces deep dive", content: "", order: 3 },
      { id: "m9", path_id: "path-strategy", title: "Business cases that get funded", content: "", order: 4 },
      { id: "m10", path_id: "path-strategy", title: "Risk assessment & change strategy", content: "", order: 5 },
    ],
  },
  {
    id: "path-product",
    title: "Product Discovery",
    description:
      "Jobs-to-be-done, story mapping, and prioritization — the BA toolkit for product teams and founders.",
    order: 3,
    level: "Intermediate",
    duration: "4 weeks",
    accent: "from-rose-400 to-fuchsia-500",
    modules: [
      { id: "m11", path_id: "path-product", title: "Jobs-to-be-Done interviews", content: "", order: 1 },
      { id: "m12", path_id: "path-product", title: "User story mapping workshops", content: "", order: 2 },
      { id: "m13", path_id: "path-product", title: "Kano model & MoSCoW prioritization", content: "", order: 3 },
      { id: "m14", path_id: "path-product", title: "Opportunity solution trees", content: "", order: 4 },
    ],
  },
  {
    id: "path-data",
    title: "Data-Driven BA",
    description:
      "Read schemas, write SQL, design KPIs, and build dashboards that make your analysis undeniable.",
    order: 4,
    level: "Advanced",
    duration: "6 weeks",
    accent: "from-sky-400 to-violet-500",
    modules: [
      { id: "m15", path_id: "path-data", title: "Data modeling for analysts", content: "", order: 1 },
      { id: "m16", path_id: "path-data", title: "SQL for requirement validation", content: "", order: 2 },
      { id: "m17", path_id: "path-data", title: "KPI trees & metric design", content: "", order: 3 },
      { id: "m18", path_id: "path-data", title: "Dashboards & data storytelling", content: "", order: 4 },
      { id: "m19", path_id: "path-data", title: "Experimentation & A/B analysis", content: "", order: 5 },
    ],
  },
];

export const frameworks: Framework[] = [
  {
    id: "swot",
    name: "SWOT Analysis",
    category: "Strategy",
    description:
      "Map strengths, weaknesses, opportunities, and threats to assess a company, product, or initiative at a glance.",
    use_cases: ["Quarterly strategy reviews", "New market entry", "Competitive positioning"],
    best_for: "Fast situational awareness before deeper analysis",
    steps: ["List internal strengths & weaknesses", "Scan external opportunities & threats", "Cross-match: how do strengths unlock opportunities?", "Turn each quadrant into 1–2 actions"],
  },
  {
    id: "porters",
    name: "Porter's Five Forces",
    category: "Strategy",
    description:
      "Analyze industry attractiveness through rivalry, new entrants, substitutes, and the power of buyers and suppliers.",
    use_cases: ["Industry attractiveness", "Pricing power analysis", "Investment decisions"],
    best_for: "Understanding why an industry's margins look the way they do",
    steps: ["Score competitive rivalry", "Assess threat of new entrants", "Assess threat of substitutes", "Evaluate buyer & supplier power", "Synthesize into a positioning decision"],
  },
  {
    id: "jtbd",
    name: "Jobs-to-be-Done",
    category: "Customer",
    description:
      "Understand what customers 'hire' your product to do — the functional, emotional, and social progress they seek.",
    use_cases: ["Product discovery", "Feature prioritization", "Positioning & messaging"],
    best_for: "Escaping feature-thinking and finding the real demand",
    steps: ["Interview recent switchers", "Extract the struggling moment", "Write the job statement", "Map hiring & firing criteria"],
  },
  {
    id: "bmc",
    name: "Business Model Canvas",
    category: "Strategy",
    description:
      "One page, nine blocks: value proposition, segments, channels, revenue, costs, and the operations that connect them.",
    use_cases: ["Startup pitch prep", "Business model innovation", "Aligning founding teams"],
    best_for: "Seeing the whole business on a single page",
    steps: ["Define customer segments", "Articulate value propositions", "Map channels & relationships", "Detail revenue streams & cost structure", "Identify key resources, activities, partners"],
  },
  {
    id: "vpc",
    name: "Value Proposition Canvas",
    category: "Customer",
    description:
      "Zoom into the fit between what you offer and what customers actually want: pains, gains, and jobs.",
    use_cases: ["Product-market fit checks", "Landing page copy", "Sales enablement"],
    best_for: "Diagnosing why a product isn't resonating",
    steps: ["Profile customer jobs, pains, gains", "Map products, pain relievers, gain creators", "Score the fit honestly", "Iterate the weakest link"],
  },
  {
    id: "moscow",
    name: "MoSCoW Prioritization",
    category: "Requirements",
    description:
      "Sort requirements into Must, Should, Could, and Won't to force honest scope conversations before a deadline.",
    use_cases: ["Release planning", "MVP scoping", "Stakeholder negotiation"],
    best_for: "Cutting scope without cutting trust",
    steps: ["List all candidate requirements", "Define 'Must' as 'fails without it'", "Negotiate Should vs. Could openly", "Publish the Won't list — it's the real deliverable"],
  },
  {
    id: "5whys",
    name: "5 Whys / Root Cause",
    category: "Process",
    description:
      "Ask 'why' repeatedly to move past symptoms and find the process failure actually causing the problem.",
    use_cases: ["Incident retrospectives", "Defect analysis", "Process improvement"],
    best_for: "Problems that keep coming back after being 'fixed'",
    steps: ["State the problem precisely", "Ask why it happened — answer with evidence", "Repeat until you hit a process cause", "Fix the process, not the person"],
  },
  {
    id: "pestle",
    name: "PESTLE Analysis",
    category: "Strategy",
    description:
      "Scan the macro environment: Political, Economic, Social, Technological, Legal, and Environmental forces.",
    use_cases: ["Market entry research", "Risk registers", "Long-range planning"],
    best_for: "Spotting external shifts before they hit your roadmap",
    steps: ["Scan each of the six lenses", "Rate impact & likelihood", "Link top forces to strategic responses"],
  },
  {
    id: "story-mapping",
    name: "User Story Mapping",
    category: "Requirements",
    description:
      "Arrange stories along the user journey to see the whole product, slice releases, and expose gaps.",
    use_cases: ["Backlog structuring", "Release slicing", "Onboarding new teams"],
    best_for: "Turning a flat backlog into a shared product narrative",
    steps: ["Map the user's journey as activities", "Break activities into steps & stories", "Slice horizontal release lines", "Walk the map with stakeholders"],
  },
  {
    id: "kano",
    name: "Kano Model",
    category: "Customer",
    description:
      "Classify features as basic expectations, performance factors, or delighters based on how they drive satisfaction.",
    use_cases: ["Feature prioritization", "Survey design", "Differentiation strategy"],
    best_for: "Knowing which features to perfect vs. which to merely ship",
    steps: ["Survey functional & dysfunctional reactions", "Classify: must-be, performance, delighter", "Invest to standard on must-bes", "Pick 1–2 delighters to own"],
  },
  {
    id: "bpmn",
    name: "BPMN Process Modeling",
    category: "Process",
    description:
      "The standard notation for mapping business processes — swimlanes, gateways, and events everyone can read.",
    use_cases: ["As-is / to-be process design", "Automation candidates", "SOP documentation"],
    best_for: "Making a messy cross-team process legible",
    steps: ["Identify start & end events", "Map activities into role swimlanes", "Add decision gateways", "Validate by walking real cases through it"],
  },
  {
    id: "raci",
    name: "RACI Matrix",
    category: "Process",
    description:
      "Clarify who is Responsible, Accountable, Consulted, and Informed for every major decision and deliverable.",
    use_cases: ["Project kickoffs", "Cross-team initiatives", "Escalation design"],
    best_for: "Killing the 'I thought you owned that' failure mode",
    steps: ["List key deliverables & decisions", "Assign exactly one Accountable each", "Trim Consulted lists ruthlessly", "Review with every named person"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mai Tran",
    role: "Product Manager",
    company: "Fintech scale-up",
    quote:
      "Sol turned my folder of half-read BA books into an actual practice. The framework library is what I open before every stakeholder workshop.",
    avatar_url: "",
  },
  {
    id: "t2",
    name: "Daniel Okafor",
    role: "Founder & CEO",
    company: "B2B SaaS startup",
    quote:
      "I'm not a trained analyst — Sol's learning paths gave me just enough structure to run discovery like one. Our roadmap debates got 10x shorter.",
    avatar_url: "",
  },
  {
    id: "t3",
    name: "Sophie Lindqvist",
    role: "Senior Business Analyst",
    company: "Global e-commerce",
    quote:
      "The AI insights caught a requirements conflict across two documents I'd never have cross-referenced manually. That alone paid for Pro.",
    avatar_url: "",
  },
  {
    id: "t4",
    name: "Kenji Watanabe",
    role: "Tech Entrepreneur",
    company: "Two-time founder",
    quote:
      "Second brain tools always felt like organizing for its own sake. Sol is the first one organized around decisions, not notes.",
    avatar_url: "",
  },
  {
    id: "t5",
    name: "Priya Raman",
    role: "Business Analyst",
    company: "Healthcare IT",
    quote:
      "I passed my CBAP prep milestones two months early. The progress tracking kept me honest week after week.",
    avatar_url: "",
  },
];

export const faqs = [
  {
    q: "What exactly is a 'second brain' for business analysis?",
    a: "A second brain is an external, organized system for the knowledge you can't hold in your head. Sol applies that idea to business analysis specifically: every framework, stakeholder note, requirement, and lesson learned is captured once, linked, and resurfaced exactly when a project needs it — so your analysis compounds instead of resetting with every new initiative.",
  },
  {
    q: "How is Sol different from Notion or a note-taking app?",
    a: "Generic tools give you blank pages; Sol gives you structure built for BA work. Frameworks come pre-modeled with steps and use cases, learning paths sequence skills in the right order, and the AI layer understands BA concepts — it can flag conflicting requirements or suggest the right framework for a decision, which a blank workspace never will.",
  },
  {
    q: "I'm a founder, not a business analyst. Is Sol for me?",
    a: "Yes — roughly half our users are founders and product managers. The Foundation and Product Discovery paths assume no BA background and focus on the 20% of techniques (stakeholder mapping, JTBD, prioritization) that drive 80% of better decisions.",
  },
  {
    q: "How does the AI actually help — is it just a chatbot?",
    a: "No. The AI works over your captured knowledge: it summarizes long documents into decision-ready briefs, detects gaps and conflicts across requirements, recommends frameworks based on the problem you describe, and quizzes you on modules you've completed to fight the forgetting curve.",
  },
  {
    q: "Can I import my existing notes and documents?",
    a: "Yes. Sol imports Markdown, Notion exports, Word documents, and PDFs. During import, the AI tags content against the framework library so old notes become searchable by concept, not just keyword.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is yours. You can export everything — notes, progress, and framework annotations — as Markdown and JSON at any time, on any tier, including after cancellation.",
  },
];

export const stats = [
  { value: "12k+", label: "analysts & founders learning" },
  { value: "651", label: "skills, modeled & cross-linked" },
  { value: "92%", label: "finish their first learning path" },
  { value: "4.9/5", label: "average member rating" },
];
