// Framework knowledge base for the Decision Brief Builder (ported from
// sol-website). Kept separate from lib/mock-data.ts because the builder's
// scoring needs the `best_for` field, which the marketing Framework type
// doesn't carry.
export interface BriefFramework {
  id: string;
  name: string;
  category: "Strategy" | "Requirements" | "Customer" | "Process";
  description: string;
  best_for: string;
  use_cases: string[];
}

export const frameworks: BriefFramework[] = [
  {
    id: "swot",
    name: "SWOT Analysis",
    category: "Strategy",
    description:
      "Map strengths, weaknesses, opportunities, and threats to assess a company, product, or initiative at a glance.",
    best_for: "Fast situational awareness before deeper analysis",
    use_cases: ["Quarterly strategy reviews", "New market entry", "Competitive positioning"],
  },
  {
    id: "porters",
    name: "Porter's Five Forces",
    category: "Strategy",
    description:
      "Analyze industry attractiveness through rivalry, new entrants, substitutes, and the power of buyers and suppliers.",
    best_for: "Understanding why an industry's margins look the way they do",
    use_cases: ["Industry attractiveness", "Pricing power analysis", "Investment decisions"],
  },
  {
    id: "jtbd",
    name: "Jobs-to-be-Done",
    category: "Customer",
    description:
      "Understand what customers 'hire' your product to do — the functional, emotional, and social progress they seek.",
    best_for: "Escaping feature-thinking and finding the real demand",
    use_cases: ["Product discovery", "Feature prioritization", "Positioning & messaging"],
  },
  {
    id: "bmc",
    name: "Business Model Canvas",
    category: "Strategy",
    description:
      "One page, nine blocks: value proposition, segments, channels, revenue, costs, and the operations that connect them.",
    best_for: "Seeing the whole business on a single page",
    use_cases: ["Startup pitch prep", "Business model innovation", "Aligning founding teams"],
  },
  {
    id: "vpc",
    name: "Value Proposition Canvas",
    category: "Customer",
    description:
      "Zoom into the fit between what you offer and what customers actually want: pains, gains, and jobs.",
    best_for: "Diagnosing why a product isn't resonating",
    use_cases: ["Product-market fit checks", "Landing page copy", "Sales enablement"],
  },
  {
    id: "moscow",
    name: "MoSCoW Prioritization",
    category: "Requirements",
    description:
      "Sort requirements into Must, Should, Could, and Won't to force honest scope conversations before a deadline.",
    best_for: "Cutting scope without cutting trust",
    use_cases: ["Release planning", "MVP scoping", "Stakeholder negotiation"],
  },
  {
    id: "5whys",
    name: "5 Whys / Root Cause",
    category: "Process",
    description:
      "Ask 'why' repeatedly to move past symptoms and find the process failure actually causing the problem.",
    best_for: "Problems that keep coming back after being 'fixed'",
    use_cases: ["Incident retrospectives", "Defect analysis", "Process improvement"],
  },
  {
    id: "pestle",
    name: "PESTLE Analysis",
    category: "Strategy",
    description:
      "Scan the macro environment: Political, Economic, Social, Technological, Legal, and Environmental forces.",
    best_for: "Spotting external shifts before they hit your roadmap",
    use_cases: ["Market entry research", "Risk registers", "Long-range planning"],
  },
  {
    id: "story-mapping",
    name: "User Story Mapping",
    category: "Requirements",
    description:
      "Arrange stories along the user journey to see the whole product, slice releases, and expose gaps.",
    best_for: "Turning a flat backlog into a shared product narrative",
    use_cases: ["Backlog structuring", "Release slicing", "Onboarding new teams"],
  },
  {
    id: "kano",
    name: "Kano Model",
    category: "Customer",
    description:
      "Classify features as basic expectations, performance factors, or delighters based on how they drive satisfaction.",
    best_for: "Knowing which features to perfect vs. which to merely ship",
    use_cases: ["Feature prioritization", "Survey design", "Differentiation strategy"],
  },
  {
    id: "bpmn",
    name: "BPMN Process Modeling",
    category: "Process",
    description:
      "The standard notation for mapping business processes — swimlanes, gateways, and events everyone can read.",
    best_for: "Making a messy cross-team process legible",
    use_cases: ["As-is / to-be process design", "Automation candidates", "SOP documentation"],
  },
  {
    id: "raci",
    name: "RACI Matrix",
    category: "Process",
    description:
      "Clarify who is Responsible, Accountable, Consulted, and Informed for every major decision and deliverable.",
    best_for: "Killing the 'I thought you owned that' failure mode",
    use_cases: ["Project kickoffs", "Cross-team initiatives", "Escalation design"],
  },
];
