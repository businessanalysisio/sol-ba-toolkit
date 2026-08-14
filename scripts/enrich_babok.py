#!/usr/bin/env python3
"""Enrich all 84 BABOK-v3 SKILL.MD stubs with content drawn from the
babok-v3 knowledge base (chapters, glossary, patterns, cheatsheet)."""

import textwrap, pathlib, re

BASE = pathlib.Path(__file__).resolve().parent.parent
SKILLS_DIR = BASE / "skills" / "BABOK-v3"
MANIFEST = BASE / "skills" / "manifest.json"

# ── Enrichment data: Overview / Context / Related / Resources ───────────

# Underlying Competencies 1-29 (source: Ch09)
COMPETENCIES = {
    1: {
        "overview": "Generating novel approaches and solutions; not constrained by established patterns. The ability to think beyond 'how it has always been done' to discover new ways of addressing business needs.",
        "context": "Applied when existing approaches are insufficient, when innovation is needed, or when stakeholders are stuck in established thinking patterns. Use brainstorming and collaborative games to stimulate creative thinking in group settings. Particularly valuable in strategy analysis (defining future state) and solution option generation.",
        "related": "Brainstorming (34), Collaborative Games (39), Problem Solving (4), Conceptual Thinking (6), Mind Mapping (58)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    2: {
        "overview": "Applying systematic criteria to choose among options under uncertainty. Decision making involves identifying the decision, gathering information, evaluating alternatives, and committing to a course of action.",
        "context": "Used throughout all knowledge areas. In planning, to select BA approach and governance model. In analysis, to prioritize requirements and recommend solutions. In evaluation, to determine whether a solution should continue, be modified, or retired. Informed by techniques like Decision Analysis and Decision Modelling.",
        "related": "Decision Analysis (45), Decision Modelling (46), Prioritization (62), Financial Analysis (49)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    3: {
        "overview": "Rapidly acquiring domain knowledge and adapting to new contexts. Learning is the engine of professional growth — absorbing new business domains, methodologies, technologies, and stakeholder languages.",
        "context": "Required at the start of every new initiative or assignment when entering an unfamiliar domain. Use document analysis, stakeholder interviews, and observation to build domain knowledge quickly. Continuous learning across BABOK perspectives (Agile, BI, IT, BPM, Business Architecture) differentiates senior practitioners.",
        "related": "Document Analysis (47), Interviews (54), Observation (60), Lessons Learned (56)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    4: {
        "overview": "Identifying root causes (not just symptoms), then generating and evaluating solutions. Problem solving is the practical application of analytical thinking to real-world business challenges.",
        "context": "Applied when a business need is identified, when requirements conflict, when solution evaluation reveals performance gaps, or when stakeholder collaboration breaks down. Use Root Cause Analysis (5 Whys, Fishbone) to separate symptoms from root causes before defining solutions.",
        "related": "Root Cause Analysis (69), Creative Thinking (1), Decision Making (2), Systems Thinking (5)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    5: {
        "overview": "Understanding how components interrelate within a whole system. Systems thinking avoids local optimizations that create global problems by considering the full context and ripple effects of change.",
        "context": "Essential in strategy analysis (understanding enterprise-wide impact), requirements architecture (how requirements relate), and solution evaluation (how enterprise limitations affect value). Apply when scoping change — ask 'what else will this affect?' before finalizing recommendations.",
        "related": "Conceptual Thinking (6), Scope Modelling (70), Context Diagram, Business Capability Analysis (35), Organizational Modelling (61)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    6: {
        "overview": "Identifying patterns, principles, and abstract concepts from specific instances. Conceptual thinking enables the BA to recognize recurring structures across different business domains and apply known solutions to novel problems.",
        "context": "Applied when analysing complex or unfamiliar domains — identifying underlying patterns that simpler approaches miss. Critical during requirements architecture design, business capability analysis, and when defining future state in strategy analysis.",
        "related": "Systems Thinking (5), Creative Thinking (1), Data Modelling (44), Concept Modelling (40)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    7: {
        "overview": "Using visual representations to explore, analyze, and communicate ideas. Visual thinking leverages diagrams, models, sketches, and prototypes to make abstract concepts tangible and accessible.",
        "context": "Applied in nearly every BA task. Use process models to document workflows, data models to define information structures, wireframes to prototype interfaces, mind maps to brainstorm, and context diagrams to define scope. Visuals are especially powerful with stakeholders who struggle with textual requirements.",
        "related": "Mind Mapping (58), Process Modelling (64), Data Modelling (44), Prototyping (65), Wireframes, Scope Modelling (70)",
        "resources": "BABOK v3 Ch09 — Analytical Thinking & Problem Solving"
    },
    8: {
        "overview": "Acting with integrity — maintaining confidentiality, managing conflicts of interest, and upholding professional standards. Ethics is the foundation of trust between the BA and all stakeholders.",
        "context": "Applies to every BA interaction. Specific scenarios: handling sensitive information from interviews, managing competing stakeholder interests without bias, honest reporting of project status and risk, and proper attribution of ideas. Ethical breaches destroy the trust that effective BA work depends on.",
        "related": "Trustworthiness (10), Personal Accountability (9), Negotiation and Conflict Resolution (25)",
        "resources": "BABOK v3 Ch09 — Behavioural Characteristics"
    },
    9: {
        "overview": "Taking ownership of commitments, deliverables, and outcomes. Personal accountability means following through on promises and taking responsibility for results — including mistakes.",
        "context": "Demonstrated through reliable delivery of BA work products, honest status reporting, proactive communication of delays or issues, and continuous self-improvement. Builds stakeholder confidence that BA outputs are dependable.",
        "related": "Trustworthiness (10), Organization and Time Management (11), Ethics (8)",
        "resources": "BABOK v3 Ch09 — Behavioural Characteristics"
    },
    10: {
        "overview": "Inspiring confidence through consistent, honest, and reliable behaviour. Trustworthiness enables the BA to influence without authority and to gain the candid stakeholder input that quality requirements depend on.",
        "context": "Earned over time through repeated reliable behaviour. Critical during stakeholder engagement — stakeholders share their real needs only when they trust the BA. Also essential in negotiations, conflict resolution, and when managing sensitive organizational information.",
        "related": "Ethics (8), Personal Accountability (9), Leadership and Influencing (23), Negotiation and Conflict Resolution (25)",
        "resources": "BABOK v3 Ch09 — Behavioural Characteristics"
    },
    11: {
        "overview": "Managing time, priorities, commitments, and resources effectively. Organization and time management ensure BA work is delivered predictably despite multiple competing demands.",
        "context": "Applied when planning BA activities (scheduling elicitation sessions, managing requirements review cycles, tracking action items). Particularly important when the BA supports multiple initiatives simultaneously or works in fast-paced agile environments.",
        "related": "Backlog Management (31), Estimation (48), Prioritization (62), Item Tracking (55)",
        "resources": "BABOK v3 Ch09 — Behavioural Characteristics"
    },
    12: {
        "overview": "Adjusting to changing contexts, requirements, stakeholder needs, and methodologies. Adaptability is the ability to shift approach when circumstances demand it without losing effectiveness.",
        "context": "Required in almost every initiative as scope, priorities, and stakeholder availability shift. Choose predictive vs. adaptive approach based on context. Adapt communication style to different stakeholders. Adjust technique selection when the planned approach isn't working.",
        "related": "Methodology Knowledge (17), Facilitation (22), Communication Tools and Technology (29)",
        "resources": "BABOK v3 Ch09 — Behavioural Characteristics"
    },
    13: {
        "overview": "Understanding how enterprises create, deliver, and capture value. Business acumen connects BA work to business outcomes, enabling the BA to operate strategically rather than tactically.",
        "context": "Applied in strategy analysis (defining future state, assessing risk), business case development, stakeholder conversations with executives, and solution evaluation (measuring value realization). Without business acumen, BAs produce technically correct requirements that don't advance business goals.",
        "related": "Business Cases (36), Business Model Canvas (37), Financial Analysis (49), SWOT Analysis (75), KPIs (57)",
        "resources": "BABOK v3 Ch09 — Business Knowledge"
    },
    14: {
        "overview": "Domain-specific knowledge — the terminology, regulations, processes, competitive dynamics, and standards of the industry in which the BA operates.",
        "context": "Required when entering a new industry domain. Build through document analysis (industry reports, regulatory docs), stakeholder interviews, and observation. Industry knowledge enables the BA to ask informed questions, understand domain constraints, and communicate credibly with subject matter experts.",
        "related": "Document Analysis (47), Interviews (54), Observation (60), Glossary (52)",
        "resources": "BABOK v3 Ch09 — Business Knowledge"
    },
    15: {
        "overview": "Knowledge of how the specific organization works — its culture, power structures, informal networks, policies, and political landscape.",
        "context": "Applied in stakeholder engagement (knowing who influences decisions beyond formal titles), communication planning (tailoring message to organizational culture), and governance design (understanding who must approve what). Learn through stakeholder analysis, observation, and background research.",
        "related": "Stakeholder List Map or Personas (72), Organizational Modelling (61), Communication Tools and Technology (29)",
        "resources": "BABOK v3 Ch09 — Business Knowledge"
    },
    16: {
        "overview": "Understanding of the solution domain — the technologies, products, processes, and methodologies relevant to the solutions the BA is specifying.",
        "context": "Essential when evaluating design options (build vs. buy vs. modify), specifying non-functional requirements, performing vendor assessment, and communicating with technical teams. Deep solution knowledge helps the BA distinguish 'what is needed' from 'how to build it' without over-specifying implementation.",
        "related": "Vendor Assessment (78), Non-Functional Requirements Analysis (59), Interface Analysis (53), Solution Knowledge",
        "resources": "BABOK v3 Ch09 — Business Knowledge"
    },
    17: {
        "overview": "Familiarity with BA methodologies (agile, waterfall, hybrid) and understanding when each is appropriate. Methodology knowledge enables the BA to design the right approach for each initiative.",
        "context": "Applied when planning the BA approach (predictive vs. adaptive selection). Different methodologies affect how requirements are documented, how change is managed, how stakeholders are engaged, and how often the BA delivers outputs. Choosing the wrong methodology creates friction and rework.",
        "related": "The Agile Perspective (80), Backlog Management (31), User Stories (77), Scope Modelling (70)",
        "resources": "BABOK v3 Ch09 — Business Knowledge"
    },
    18: {
        "overview": "Clear, concise, audience-adapted speaking. Verbal communication is the primary channel for elicitation, facilitation, presentation, and stakeholder management.",
        "context": "Used in every stakeholder interaction — interviews, workshops, presentations, informal conversations. Adapt vocabulary, pace, and level of detail to the audience (executives need summaries; SMEs need specifics). In workshops, verbal communication maintains focus and encourages participation.",
        "related": "Facilitation (22), Interviews (54), Workshops (79), Listening (21), Non-Verbal Communication (19)",
        "resources": "BABOK v3 Ch09 — Communication Skills"
    },
    19: {
        "overview": "Reading body language, tone, and presence; adjusting one's own non-verbal signals. Non-verbal communication often conveys more than words, especially in emotionally charged situations.",
        "context": "Critical during facilitation and stakeholder engagement. Reading stakeholder posture, eye contact, and tone reveals resistance, confusion, or agreement that words may not express. The BA's own non-verbal signals (open posture, eye contact, calm tone) build trust and encourage candour.",
        "related": "Listening (21), Verbal Communication (18), Facilitation (22), Negotiation and Conflict Resolution (25)",
        "resources": "BABOK v3 Ch09 — Communication Skills"
    },
    20: {
        "overview": "Structured, unambiguous documentation tailored to the audience and purpose. Written communication produces the durable artefacts — requirements specs, business cases, stakeholder registers — that outlive verbal conversations.",
        "context": "Applied when producing all BA deliverables. Requirements must be clear enough to build and test from. Business cases must persuade executives. Emails and meeting notes must be actionable. Tailor format (formal document vs. wiki page vs. slide) to audience needs.",
        "related": "Acceptance and Evaluation Criteria (30), Business Cases (36), Glossary (52), User Stories (77), Document Analysis (47)",
        "resources": "BABOK v3 Ch09 — Communication Skills"
    },
    21: {
        "overview": "Active listening — hearing not just words but intent, concerns, and what is left unsaid. Paraphrasing to confirm understanding is the core practice.",
        "context": "Applied in every elicitation activity. In interviews, listening guides probing questions. In workshops, listening detects emerging consensus or hidden disagreement. In stakeholder management, listening uncovers resistance before it becomes a blocker. Most underrated BA skill.",
        "related": "Interviews (54), Workshops (79), Facilitation (22), Observation (60), Verbal Communication (18)",
        "resources": "BABOK v3 Ch09 — Communication Skills"
    },
    22: {
        "overview": "Guiding groups to productive outcomes without imposing personal views. Facilitation is the primary skill for workshops and collaborative sessions — it keeps groups focused, inclusive, and moving toward decisions.",
        "context": "Applied when running workshops, collaborative games, focus groups, and any group decision-making session. Key practices: set clear objectives, design the agenda, manage participation (draw out quiet voices, contain dominant ones), capture decisions visibly, and confirm next steps. The facilitator is neutral — they own the process, not the content.",
        "related": "Workshops (79), Collaborative Games (39), Focus Groups (50), Brainstorming (34), Leadership and Influencing (23)",
        "resources": "BABOK v3 Ch09 — Interaction Skills"
    },
    23: {
        "overview": "Influencing without formal authority — creating alignment around goals and motivating stakeholders to act. Leadership in BA means driving the analysis process forward even when the BA doesn't manage the team.",
        "context": "Required when stakeholders are reluctant to participate, when decisions stall, when competing priorities need resolution, or when the BA must advocate for proper analysis practices. Builds on trustworthiness, business acumen, and communication skills. Senior BAs lead through influence, not title.",
        "related": "Negotiation and Conflict Resolution (25), Facilitation (22), Teamwork (24), Teaching (26)",
        "resources": "BABOK v3 Ch09 — Interaction Skills"
    },
    24: {
        "overview": "Contributing to and supporting collaborative work — sharing credit, helping teammates, and putting team goals above individual recognition.",
        "context": "Essential in agile teams (where BA is embedded with developers and testers), in multi-BA initiatives (where requirements ownership must be coordinated), and when working with virtual/distributed teams. Teamwork extends to supporting the development team during implementation, not just handing off requirements.",
        "related": "Facilitation (22), Leadership and Influencing (23), Collaborative Games (39), Communication Tools and Technology (29)",
        "resources": "BABOK v3 Ch09 — Interaction Skills"
    },
    25: {
        "overview": "Finding mutually acceptable solutions to conflicting stakeholder needs. Negotiation and conflict resolution turn disagreement into productive compromise without damaging relationships.",
        "context": "Applied when stakeholders have competing priorities (budget vs. scope, quality vs. speed), when requirements conflict, when change requests require trade-off decisions, and during governance escalation. Approach conflicts by understanding each party's underlying interests (not positions) and seeking options that address both.",
        "related": "Facilitation (22), Leadership and Influencing (23), Prioritization (62), Stakeholder List Map or Personas (72)",
        "resources": "BABOK v3 Ch09 — Interaction Skills"
    },
    26: {
        "overview": "Transferring knowledge to stakeholders and team members — enabling them to contribute more effectively to BA activities and to understand BA outputs.",
        "context": "Applied when training stakeholders on how to write user stories, when helping product owners refine their backlog, when teaching SMEs what level of detail requirements need, and when mentoring junior BAs. Teaching multiplies the BA's effectiveness by making others better contributors.",
        "related": "Facilitation (22), Workshops (79), User Stories (77), Lessons Learned (56)",
        "resources": "BABOK v3 Ch09 — Interaction Skills"
    },
    27: {
        "overview": "Proficient use of office productivity tools — word processors, spreadsheets, presentation software, diagramming tools. These are the foundational tools for documenting and communicating BA work.",
        "context": "Used daily for documenting requirements, creating traceability matrices, building presentations, and communicating analysis results. Spreadsheets are essential for managing large requirement sets, prioritization matrices, and RTMs. Diagramming tools produce process flows, data models, and wireframes.",
        "related": "Business Analysis Tools and Technology (28), Communication Tools and Technology (29), Data Dictionary (41), Requirements Traceability Matrix (55)",
        "resources": "BABOK v3 Ch09 — Tools & Technology"
    },
    28: {
        "overview": "Specialized tools for BA work — requirements management platforms, modelling tools (BPMN, UML), wireframing and prototyping tools, and testing or traceability platforms.",
        "context": "Applied throughout all knowledge areas. Requirements management tools (Jira, Azure DevOps) support backlog management, traceability, and change control. Modelling tools (draw.io, Lucidchart, Sparx EA) produce process models, data models, and UML diagrams. Wireframing tools (Balsamiq, Figma) support rapid prototyping.",
        "related": "Office Productivity Tools and Technology (27), Communication Tools and Technology (29), Process Modelling (64), Data Modelling (44), Prototyping (65)",
        "resources": "BABOK v3 Ch09 — Tools & Technology"
    },
    29: {
        "overview": "Communication and collaboration platforms — email, video conferencing, instant messaging, wikis, shared document repositories, and project management tools.",
        "context": "Used for stakeholder engagement, especially with distributed or remote teams. Video conferencing enables remote workshops and interviews. Wikis and shared repositories serve as the single source of truth for BA information. Effective use of these tools is critical when the BA cannot rely on in-person interactions.",
        "related": "Office Productivity Tools and Technology (27), Business Analysis Tools and Technology (28), Communication Skills (18-21)",
        "resources": "BABOK v3 Ch09 — Tools & Technology"
    },
}

# The 50 Named Techniques 30-79 (source: Ch10 + patterns.md + glossary)
TECHNIQUES = {
    30: {
        "overview": "Defining conditions a solution must meet to be accepted by stakeholders. Acceptance criteria make requirements testable by establishing clear, verifiable conditions of satisfaction.",
        "context": "Applied in RADD when specifying requirements and in Requirements Life Cycle Management during approval. Written for each requirement, user story, or feature. Best expressed in Given/When/Then format for functional scenarios. Must be objective, measurable, and agreed upon before development begins.",
        "related": "User Stories (77), Use Cases and Scenarios (76), Verification (7.2), Reviews (66)",
        "resources": "BABOK v3 Ch07 — RADD; Ch10 — Technique 10.1"
    },
    31: {
        "overview": "Maintaining and prioritizing a list of work items — the primary requirements management practice in agile contexts. Backlog management ensures the team always works on the most valuable items next.",
        "context": "Applied continuously in agile and adaptive initiatives. The BA (often as or with the Product Owner) refines the backlog: writing and splitting stories, adding acceptance criteria, prioritizing by value and risk, and ensuring items are 'ready' for sprint planning. Backlog refinement is a recurring activity, not a one-time event.",
        "related": "User Stories (77), Prioritization (62), Estimation (48), The Agile Perspective (80), Acceptance and Evaluation Criteria (30)",
        "resources": "BABOK v3 Ch10 — Technique 10.2"
    },
    32: {
        "overview": "Strategic performance measurement across four perspectives: Financial, Customer, Internal Business Processes, and Learning & Growth. The Balanced Scorecard translates strategy into operational metrics.",
        "context": "Applied during Strategy Analysis (defining future state objectives) and Solution Evaluation (measuring whether the solution delivers intended value). Each perspective must have goals, measures, targets, and initiatives. Useful for aligning BA work with strategic objectives and communicating performance to executives.",
        "related": "Metrics and KPIs (57), Business Cases (36), SWOT Analysis (75), The Business Intelligence Perspective (81)",
        "resources": "BABOK v3 Ch10 — Technique 10.3"
    },
    33: {
        "overview": "Comparing current performance, processes, or practices to industry standards, competitors, or best-in-class organizations. Benchmarking identifies performance gaps and improvement targets.",
        "context": "Applied during Strategy Analysis (identifying opportunities and setting targets) and during Process Analysis (comparing process efficiency). Can be competitive (against direct competitors) or functional (comparing similar processes across industries). Use to justify change initiatives with data-driven comparisons.",
        "related": "SWOT Analysis (75), Process Analysis (63), Metrics and KPIs (57), The Business Architecture Perspective (83)",
        "resources": "BABOK v3 Ch10 — Technique 10.4"
    },
    34: {
        "overview": "Divergent idea generation in a group setting. Key rules: defer judgment, go for quantity, encourage wild ideas, and build on others' ideas. Brainstorming is the starting point for creative problem solving.",
        "context": "Applied when generating solution options, identifying risks, exploring root causes, or defining requirements scope. Best with 5-10 participants from diverse perspectives. Separate ideation (divergent) from evaluation (convergent) — never critique during brainstorming. Record all ideas visibly; cluster and prioritize afterward.",
        "related": "Collaborative Games (39), Creative Thinking (1), Root Cause Analysis (69), Workshops (79), Focus Groups (50)",
        "resources": "BABOK v3 Ch10 — Technique 10.5"
    },
    35: {
        "overview": "Mapping enterprise capabilities to identify strengths, gaps, and investment priorities. A business capability is what an enterprise does (not how it does it) — it is stable even as processes and systems change.",
        "context": "Applied during Strategy Analysis and in the Business Architecture perspective. Capability maps are typically organized hierarchically (Level 1: Strategic/Tier 1 capabilities; Level 2+ decompose detail). Gap analysis between current and desired capabilities drives the change strategy. Essential for enterprise-level BA work.",
        "related": "Organizational Modelling (61), SWOT Analysis (75), Value Stream Mapping, The Business Architecture Perspective (83), Gap Analysis",
        "resources": "BABOK v3 Ch10 — Technique 10.6"
    },
    36: {
        "overview": "Documenting the justification for a proposed initiative — analysing options, costs, benefits, risks, and recommending a course of action. The business case is the key decision-making document for investment approval.",
        "context": "Applied during Strategy Analysis (Define Change Strategy) and RADD (Analyze Potential Value and Recommend Solution). Structure: problem/opportunity statement → options analyzed (including 'do nothing') → costs and benefits per option → risk assessment → recommendation with rationale. Tailor depth to the size of the decision.",
        "related": "Financial Analysis (49), Risk Analysis and Management (67), SWOT Analysis (75), Decision Analysis (45), Cost-Benefit Analysis",
        "resources": "BABOK v3 Ch10 — Technique 10.7"
    },
    37: {
        "overview": "Nine-block visual framework describing how an organization creates, delivers, and captures value: Key Partners, Key Activities, Key Resources, Value Propositions, Customer Relationships, Channels, Customer Segments, Cost Structure, Revenue Streams.",
        "context": "Applied during Strategy Analysis (pre-initiative scoping, understanding the business model) and when analysing how a change affects the enterprise's value creation. Excellent alignment tool for stakeholder groups to develop a shared understanding of the business. Use as a precursor to detailed requirements work.",
        "related": "Business Cases (36), Value Stream Mapping, SWOT Analysis (75), The Business Architecture Perspective (83), Scope Modelling (70)",
        "resources": "BABOK v3 Ch10 — Technique 10.8"
    },
    38: {
        "overview": "Extracting and defining constraints and directives that govern organizational behaviour. Business rules are atomic statements about how the business operates — they are not processes or requirements but constraints on both.",
        "context": "Applied during RADD when specifying requirements that must comply with policy, regulation, or business policy. Business rules should be stated declaratively ('A customer may have at most one active loan') independent of how they are implemented. Essential in regulated industries (banking, insurance, healthcare).",
        "related": "Decision Modelling (46), Decision Tables, Data Dictionary (41), Non-Functional Requirements Analysis (59), Process Modelling (64)",
        "resources": "BABOK v3 Ch10 — Technique 10.9"
    },
    39: {
        "overview": "Structured activities that engage stakeholders creatively — Product Box, Buy a Feature, Speed Boat, and other facilitated games. Collaborative games surface requirements, priorities, and concerns in an engaging, low-inhibition format.",
        "context": "Applied during Elicitation when standard workshop formats may be too rigid or when stakeholder engagement is low. Each game has a specific purpose: Buy a Feature for prioritization, Product Box for value proposition definition, Speed Boat for identifying problems. Particularly effective in agile and innovation contexts.",
        "related": "Brainstorming (34), Workshops (79), Facilitation (22), Focus Groups (50), Prioritization (62)",
        "resources": "BABOK v3 Ch10 — Technique 10.10"
    },
    40: {
        "overview": "Depicting key business concepts and their relationships — entity-relationship style but focused on business meaning, not data structures. Concept models build shared vocabulary across the organization.",
        "context": "Applied during Requirements Analysis and Design Definition (RADD) when defining requirements that involve complex business domains. Produces a visual diagram showing concepts as boxes and relationships as labelled lines. Each concept maps to a Glossary entry. Essential precursor to data modelling.",
        "related": "Data Modelling (44), Glossary (52), Data Dictionary (41), Business Rules Analysis (38), Data Flow Diagrams (42)",
        "resources": "BABOK v3 Ch10 — Technique 10.11"
    },
    41: {
        "overview": "Cataloguing data elements with definitions, formats, allowable values, validation rules, and usage metadata. The Data Dictionary is the authoritative reference for data definitions across the enterprise.",
        "context": "Applied during RADD (specifying data-related requirements), in the Business Intelligence perspective, and whenever multiple systems or teams need consistent data definitions. Each entry includes: name, definition, data type, format, allowable values, source system, and business owner. Essential for data governance.",
        "related": "Glossary (52), Data Modelling (44), Concept Modelling (40), Data Flow Diagrams (42), The Business Intelligence Perspective (81)",
        "resources": "BABOK v3 Ch10 — Technique 10.12"
    },
    42: {
        "overview": "Showing how data moves between processes, data stores, and external entities. Data Flow Diagrams (DFDs) provide a high-level view of data movement without revealing process details.",
        "context": "Applied during RADD when analysing systems with significant data movement, or when scope includes multiple systems that exchange information. DFD levels: Context Diagram (Level 0 — single process representing the whole system) → Level 1 (major processes) → Level 2+ (detailed sub-processes). Use alongside Process Models.",
        "related": "Process Modelling (64), Interface Analysis (53), Scope Modelling (70), Sequence Diagrams (71), Data Modelling (44)",
        "resources": "BABOK v3 Ch10 — Technique 10.13"
    },
    43: {
        "overview": "Discovering patterns in large datasets to support decision making. Data mining uses statistical and machine learning techniques to identify correlations, clusters, and anomalies that humans would miss.",
        "context": "Applied in the Business Intelligence perspective and during Solution Evaluation when analysing performance data. Common techniques: association rule learning, classification, clustering (K-means), regression, and anomaly detection. Data mining results inform Strategy Analysis (identifying opportunities) and RADD (defining data requirements).",
        "related": "Metrics and KPIs (57), The Business Intelligence Perspective (81), Data Modelling (44), Data Dictionary (41)",
        "resources": "BABOK v3 Ch10 — Technique 10.14"
    },
    44: {
        "overview": "Designing logical and physical data structures using Entity Relationship Diagrams (ERDs) or class diagrams. Data modelling specifies the information the solution must manage.",
        "context": "Applied during RADD when requirements involve persistent data. Logical data models are business-focused (entities, attributes, relationships, cardinality); physical data models are implementation-specific (tables, columns, keys, indexes). Business stakeholders validate the logical model; technical teams use the physical model.",
        "related": "Concept Modelling (40), Data Dictionary (41), Data Flow Diagrams (42), Glossary (52), The Business Intelligence Perspective (81)",
        "resources": "BABOK v3 Ch10 — Technique 10.15"
    },
    45: {
        "overview": "Evaluating choices under uncertainty — using decision trees, weighted ranking, or multi-criteria analysis to systematically compare alternatives.",
        "context": "Applied when selecting solution options (build vs. buy vs. customize), choosing vendors, or making trade-off decisions between competing requirements. Structured approach: identify criteria → assign weights → score each alternative → calculate weighted scores → perform sensitivity analysis. Reduces cognitive bias in complex decisions.",
        "related": "Decision Modelling (46), Financial Analysis (49), Prioritization (62), Vendor Assessment (78), Risk Analysis and Management (67)",
        "resources": "BABOK v3 Ch10 — Technique 10.16"
    },
    46: {
        "overview": "Representing complex decision logic using Decision Model and Notation (DMN). Decision models make business rules explicit, verifiable, and maintainable — replacing nested if-else logic with decision tables.",
        "context": "Applied during RADD when requirements contain complex rules with multiple conditions and outcomes (e.g., loan approval rules, pricing algorithms, eligibility criteria). Decision tables show conditions as columns and rules as rows, with the resulting action. DMN separates decision logic from process flow.",
        "related": "Business Rules Analysis (38), Decision Analysis (45), Process Modelling (64), Data Dictionary (41)",
        "resources": "BABOK v3 Ch10 — Technique 10.17"
    },
    47: {
        "overview": "Reviewing existing documentation to extract requirements, understand current state, and identify constraints. Document analysis is the most efficient elicitation technique when relevant documentation exists.",
        "context": "Applied during Elicitation, especially when replacing an existing system, documenting legacy processes, or when stakeholders are unavailable. Sources include: process manuals, system documentation, contracts, regulations, user guides, incident reports, and existing requirements documents. Always validate document findings with stakeholders — documents are often outdated.",
        "related": "Interviews (54), Observation (60), Process Analysis (63), Lessons Learned (56), Benchmarking and Market Analysis (33)",
        "resources": "BABOK v3 Ch10 — Technique 10.18"
    },
    48: {
        "overview": "Forecasting the effort, cost, or duration required for BA activities or solution delivery. Estimation techniques include analogous (based on similar past work), parametric (based on historical ratios), and three-point (optimistic, pessimistic, most likely).",
        "context": "Applied during BA Planning (estimating BA effort), during Requirements Life Cycle Management (estimating cost of requirements), and during RADD (estimating effort for design options). Estimates are always ranges, not single numbers. The more information available, the narrower the range. Re-estimate as understanding improves.",
        "related": "Financial Analysis (49), Prioritization (62), Planning Poker, Timeboxing, Business Cases (36)",
        "resources": "BABOK v3 Ch10 — Technique 10.19"
    },
    49: {
        "overview": "Quantifying the business value of solutions using ROI, Net Present Value (NPV), Internal Rate of Return (IRR), payback period, and cost-benefit analysis.",
        "context": "Applied during Strategy Analysis (business case development) and RADD (analyze potential value and recommend solution). Financial analysis translates business benefits into monetary terms, enabling comparison between solution options and informed investment decisions. The BA need not be a finance expert but must understand the key metrics.",
        "related": "Business Cases (36), Estimation (48), Decision Analysis (45), Risk Analysis and Management (67), Metrics and KPIs (57)",
        "resources": "BABOK v3 Ch10 — Technique 10.20"
    },
    50: {
        "overview": "Guided discussion with 6-12 representative users to collect qualitative feedback, preferences, and perceptions about a system, process, or concept.",
        "context": "Applied during Elicitation when you need deep qualitative input from a specific stakeholder group (e.g., end users, customers, subject matter experts). A trained moderator guides discussion using prepared questions while a separate scribe captures responses. Good for usability feedback, feature prioritization, and understanding user needs.",
        "related": "Interviews (54), Workshops (79), Brainstorming (34), Collaborative Games (39), Survey or Questionnaire (74)",
        "resources": "BABOK v3 Ch10 — Technique 10.21"
    },
    51: {
        "overview": "Breaking complex systems or processes into smaller, more manageable components. Functional decomposition creates a hierarchical view of what a system does, without describing how it does it.",
        "context": "Applied during RADD (specifying requirements architecture), during Scope Modelling, and when building a Work Breakdown Structure (WBS). Decompose from the highest-level function down to atomic activities. Each level refines the level above. Stop decomposing when the function is clearly understood and can be specified or estimated.",
        "related": "Scope Modelling (70), Process Analysis (63), Process Modelling (64), Use Cases and Scenarios (76)",
        "resources": "BABOK v3 Ch10 — Technique 10.22"
    },
    52: {
        "overview": "Defining terms consistently to prevent misunderstanding across stakeholders. A glossary builds shared vocabulary, reducing ambiguity in requirements, communications, and deliverables.",
        "context": "Applied throughout the initiative — created during Elicitation (capturing domain terms), maintained through Requirements Life Cycle Management, and used as a reference document by all stakeholders. Each entry includes: term name, definition, context/domain, synonyms, and related terms. The simplest and most cost-effective BA technique.",
        "related": "Data Dictionary (41), Concept Modelling (40), Document Analysis (47), Stakeholder List Map or Personas (72)",
        "resources": "BABOK v3 Ch10 — Technique 10.23"
    },
    53: {
        "overview": "Identifying and documenting interactions between a system and its users or between systems. Interface analysis defines what crosses a solution boundary — inputs, outputs, data formats, and protocols.",
        "context": "Applied during RADD when the solution interacts with external systems, users, or devices. Include both user interfaces (UI screens, reports) and system-to-system interfaces (APIs, file transfers, messages). Each interface is defined with: purpose, triggering event, data exchanged, frequency, and format.",
        "related": "Scope Modelling (70), Data Flow Diagrams (42), Use Cases and Scenarios (76), Sequence Diagrams (71), Non-Functional Requirements Analysis (59)",
        "resources": "BABOK v3 Ch10 — Technique 10.24"
    },
    54: {
        "overview": "Structured or unstructured one-on-one conversations with stakeholders. Interviews are the most flexible elicitation technique — adaptable to any stakeholder, topic, or context.",
        "context": "Applied during Elicitation as the primary technique for individual stakeholder engagement. Types: structured (predefined questions asked in order), semi-structured (topic guide with flexible follow-up), and unstructured (open conversation). Best practice: prepare questions (open-ended first, then probing), listen more than speak, paraphrase to confirm, and document immediately after.",
        "related": "Workshops (79), Observation (60), Document Analysis (47), Survey or Questionnaire (74), Listening (21)",
        "resources": "BABOK v3 Ch10 — Technique 10.25"
    },
    55: {
        "overview": "Logging and managing issues, defects, action items, and risks throughout the initiative. Item tracking ensures nothing falls through the cracks and provides an audit trail for decisions.",
        "context": "Applied in Requirements Life Cycle Management (tracking change requests and defects) and throughout all knowledge areas for action item management. Each item has: ID, description, type (issue/risk/action/defect), owner, status, priority, and target resolution date. Use a simple register or a dedicated tool (Jira, Azure DevOps, Excel).",
        "related": "Risk Analysis and Management (67), Reviews (66), Lessons Learned (56), Organization and Time Management (11)",
        "resources": "BABOK v3 Ch10 — Technique 10.26"
    },
    56: {
        "overview": "Capturing what worked and what didn't from completed initiatives or phases. Lessons learned drive continuous improvement in BA practice and organizational capability.",
        "context": "Applied during BA Planning and Monitoring (Identify BA Performance Improvements) and at initiative milestones or closure. Conduct as a facilitated session with the project team. Focus on: what went well (continue doing), what went poorly (stop doing), and what could be improved (start doing). Document formally and share across the organization.",
        "related": "Reviews (66), Item Tracking (55), Facilitation (22), Risk Analysis and Management (67)",
        "resources": "BABOK v3 Ch10 — Technique 10.27"
    },
    57: {
        "overview": "Defining measurable performance indicators tied to business objectives. KPIs and metrics translate strategy into quantifiable targets that can be tracked over time.",
        "context": "Applied in Strategy Analysis (setting future state success metrics), RADD (defining acceptance criteria), and Solution Evaluation (measuring performance). Good KPIs are SMART: Specific, Measurable, Achievable, Relevant, Time-bounded. Leading indicators predict future performance; lagging indicators report past performance.",
        "related": "Balanced Scorecard (32), Acceptance and Evaluation Criteria (30), Financial Analysis (49), The Business Intelligence Perspective (81), Solution Evaluation (8)",
        "resources": "BABOK v3 Ch10 — Technique 10.28"
    },
    58: {
        "overview": "Non-linear visual brainstorming technique that captures ideas radiating from a central topic. Mind maps organize complex information in a way that mirrors how the brain naturally associates concepts.",
        "context": "Applied during Elicitation (brainstorming requirements), RADD (organizing complex requirements), and anytime the BA needs to quickly capture and structure information. Start with a central topic; add major branches (main categories); then add sub-branches (details). Use colour and images to enhance recall. Excellent for workshop facilitation and personal note-taking.",
        "related": "Brainstorming (34), Concept Modelling (40), Creative Thinking (1), Workshops (79), Visual Thinking (7)",
        "resources": "BABOK v3 Ch10 — Technique 10.29"
    },
    59: {
        "overview": "Specifying quality attributes the solution must meet — performance, security, usability, reliability, availability, scalability, maintainability, and compliance. Non-functional requirements define 'how well' the system performs, not 'what' it does.",
        "context": "Applied during RADD alongside functional requirements. Unlike functional requirements, NFRs often cut across the entire solution and may conflict with each other (e.g., security vs. usability). Should be specific and testable ('The system shall process 500 transactions per second under peak load' not 'The system shall be fast').",
        "related": "Acceptance and Evaluation Criteria (30), Business Rules Analysis (38), Interface Analysis (53), Risk Analysis and Management (67), The Information Technology Perspective (82)",
        "resources": "BABOK v3 Ch10 — Technique 10.30"
    },
    60: {
        "overview": "Watching stakeholders perform their work (active or passive) to surface tacit knowledge — what people actually do versus what they say they do. Observation reveals workarounds, inefficiencies, and unstated needs.",
        "context": "Applied during Elicitation, especially for process-intensive domains or when stakeholders struggle to articulate their work. Types: passive (watch without interrupting), active (ask questions during observation), participant (perform the work yourself). Use when interviews have produced conflicting or incomplete information. Time-intensive but reveals insights no other technique can.",
        "related": "Interviews (54), Document Analysis (47), Process Analysis (63), Process Modelling (64), Root Cause Analysis (69)",
        "resources": "BABOK v3 Ch10 — Technique 10.31"
    },
    61: {
        "overview": "Depicting roles, responsibilities, reporting structures, and organizational relationships. Organizational models (org charts, RACI matrices, role descriptions) clarify who does what and who decides what.",
        "context": "Applied during Stakeholder Engagement (identifying stakeholders and their relationships), during RADD (defining roles and permissions), and during Solution Evaluation (assessing enterprise limitations). RACI matrices (Responsible, Accountable, Consulted, Informed) are the most common tool for clarifying decision authority and task ownership.",
        "related": "Stakeholder List Map or Personas (72), Roles and Permissions Matrix (68), Business Capability Analysis (35), The Business Architecture Perspective (83)",
        "resources": "BABOK v3 Ch10 — Technique 10.32"
    },
    62: {
        "overview": "Ranking requirements by relative importance using defined criteria. Prioritization enables the team to focus on the most valuable work first and make defensible scope trade-offs.",
        "context": "Applied continuously in Requirements Life Cycle Management. Common techniques: MoSCoW (Must/Should/Could/Won't — simple and fast), Weighted Ranking (more rigorous, uses scored criteria), Timeboxing (fixed deadline, prioritise by value delivered), and Planning Poker (consensus-based estimation and prioritization). Prioritization criteria include: business value, risk, dependency, urgency, and cost.",
        "related": "MoSCoW, Backlog Management (31), Estimation (48), Decision Analysis (45), Business Cases (36)",
        "resources": "BABOK v3 Ch10 — Technique 10.33"
    },
    63: {
        "overview": "Examining existing processes to identify inefficiencies, bottlenecks, redundancies, and improvement opportunities. Process analysis is the diagnostic phase that precedes process redesign.",
        "context": "Applied during Strategy Analysis (current state analysis) and during RADD (when designing new processes). Analyze AS-IS processes to understand: cycle time, handoffs, decision points, error rates, and value-add vs. non-value-add activities. Quantify the cost of current inefficiencies to justify the change investment.",
        "related": "Process Modelling (64), Root Cause Analysis (69), Observation (60), Functional Decomposition (51), The Business Process Management Perspective (84)",
        "resources": "BABOK v3 Ch10 — Technique 10.34"
    },
    64: {
        "overview": "Documenting business processes using BPMN, flowcharts, or swim-lane diagrams. Process models communicate how work flows across roles, systems, and departments.",
        "context": "Applied during RADD (specifying process requirements) and Strategy Analysis (documenting current and future state). BPMN is the standard notation. Key elements: events (circles — start/end), activities (rounded rectangles — tasks), gateways (diamonds — decisions), flows (arrows — sequence), and pools/lanes (organize who does what). Choose level of detail to match audience.",
        "related": "Process Analysis (63), Data Flow Diagrams (42), Functional Decomposition (51), Use Cases and Scenarios (76), The Business Process Management Perspective (84)",
        "resources": "BABOK v3 Ch10 — Technique 10.35"
    },
    65: {
        "overview": "Creating working models of a solution to elicit requirements and validate understanding before full development. Prototypes make abstract requirements tangible.",
        "context": "Applied during Elicitation (especially when stakeholders cannot articulate needs abstractly) and during RADD (validating requirements). Types: throwaway (paper sketches, low-fidelity wireframes — quick, cheap, encourages big-picture feedback) vs. evolutionary (high-fidelity, becomes part of the final product). Risk: stakeholders may anchor on prototype details and resist changes.",
        "related": "Wireframes, Storyboarding, Use Cases and Scenarios (76), User Stories (77), Interface Analysis (53), Acceptance and Evaluation Criteria (30)",
        "resources": "BABOK v3 Ch10 — Technique 10.36"
    },
    66: {
        "overview": "Formal or informal examination of requirements documents, designs, or other BA work products for quality, completeness, and correctness. Reviews catch defects before they reach development.",
        "context": "Applied during RADD (verification) and throughout the requirements life cycle. Types: informal (peer review, walkthrough), formal (inspection with defined roles and checklists). The review criteria should match the requirements quality characteristics: atomic, complete, consistent, correct, feasible, modifiable, prioritized, testable, traceable, unambiguous.",
        "related": "Verification, Validation, Acceptance and Evaluation Criteria (30), Lessons Learned (56), Item Tracking (55)",
        "resources": "BABOK v3 Ch10 — Technique 10.37"
    },
    67: {
        "overview": "Identifying, assessing, and planning responses to uncertainties that could affect the initiative. Risk analysis and management is proactive — it addresses what might go wrong before it does.",
        "context": "Applied in Strategy Analysis (assessing risks to future state), RADD (assessing solution option risks), and throughout the requirements life cycle (managing requirement volatility). Process: identify risks → assess probability × impact → classify (avoid/mitigate/transfer/accept) → plan response → monitor. Maintain a risk register throughout the initiative.",
        "related": "Decision Analysis (45), Financial Analysis (49), Item Tracking (55), SWOT Analysis (75), Business Cases (36)",
        "resources": "BABOK v3 Ch10 — Technique 10.38"
    },
    68: {
        "overview": "Mapping system functions to user roles and the permissions each role has. The Roles and Permissions Matrix (also called RACI for security) defines who can access, create, modify, or delete what.",
        "context": "Applied during RADD (specifying security and access requirements). Structure: rows are system functions/objects; columns are roles; cells indicate permission level (Create, Read, Update, Delete, Admin) or access type (View, Edit, Approve). Essential for compliance, audit, and secure system design.",
        "related": "Organizational Modelling (61), Stakeholder List Map or Personas (72), Non-Functional Requirements Analysis (59), Use Cases and Scenarios (76)",
        "resources": "BABOK v3 Ch10 — Technique 10.39"
    },
    69: {
        "overview": "Finding the fundamental cause of a problem rather than treating symptoms. Root Cause Analysis uses techniques like 5 Whys (iteratively asking 'why' until the root cause emerges) and Fishbone/Ishikawa diagrams (categorizing potential causes by type).",
        "context": "Applied during Strategy Analysis (analysing current state problems) and RADD (ensuring requirements address real needs). The 5 Whys approach: state the problem → ask 'Why?' → repeat until the root cause is found (usually 3-7 iterations). Fishbone diagrams organize causes into categories: People, Process, Technology, Environment, Materials, Management. Always validate the identified root cause before designing solutions.",
        "related": "Problem Solving (4), Process Analysis (63), Observation (60), Brainstorming (34), Root Cause Analysis",
        "resources": "BABOK v3 Ch10 — Technique 10.40"
    },
    70: {
        "overview": "Defining and visualizing the boundaries of a solution — what is in scope and what is out. Scope modelling techniques include context diagrams (system and external entities), feature trees, and event-response lists.",
        "context": "Applied during Strategy Analysis (defining solution scope) and at the start of Elicitation (setting boundaries for requirements gathering). The context diagram is the most common tool: the solution is a single process in the centre, surrounded by external entities (people, systems, organizations) connected by data flows. Clear scope prevents scope creep and sets stakeholder expectations.",
        "related": "Context Diagram, Functional Decomposition (51), Interface Analysis (53), Use Cases and Scenarios (76), Business Model Canvas (37)",
        "resources": "BABOK v3 Ch10 — Technique 10.41"
    },
    71: {
        "overview": "Modelling object or system interactions in time sequence using UML Sequence Diagrams. Sequence diagrams show the order of messages exchanged between participants to accomplish a function.",
        "context": "Applied during RADD when specifying complex interactions between system components, users, and external systems. Lifelines represent participants; arrows represent messages; the vertical axis represents time. Useful for defining API call sequences, user-system interaction flows, and use case realizations.",
        "related": "Use Cases and Scenarios (76), Data Flow Diagrams (42), Interface Analysis (53), Process Modelling (64), State Modelling (73)",
        "resources": "BABOK v3 Ch10 — Technique 10.42"
    },
    72: {
        "overview": "Identifying and characterizing stakeholders to plan engagement and understand their needs, influence, and attitudes. Deliverables include stakeholder lists, maps (Power/Interest Grid), and personas.",
        "context": "Applied during BA Planning and Monitoring (Plan Stakeholder Engagement) and throughout the initiative as new stakeholders emerge. The Power/Interest Grid classifies stakeholders into four quadrants: Manage Closely (high power, high interest), Keep Satisfied (high power, low interest), Keep Informed (low power, high interest), Monitor (low power, low interest). Personas add depth — describing goals, behaviours, and pain points of representative users.",
        "related": "Organizational Modelling (61), Roles and Permissions Matrix (68), Facilitated Workshops, Interviews (54), Focus Groups (50)",
        "resources": "BABOK v3 Ch10 — Technique 10.43"
    },
    73: {
        "overview": "Depicting the states an object can occupy and the valid transitions between them. State modelling (UML State Machine Diagrams) reveals complex object behaviour that flow-based models miss.",
        "context": "Applied during RADD when requirements involve objects that change state in response to events (e.g., an order: New → Submitted → Paid → Shipped → Delivered → Cancelled/Returned). Each state diagram includes: states (rounded rectangles), transitions (arrows labelled with events/conditions), start state (filled circle), and end state (bullseye). Essential for systems with complex lifecycle management.",
        "related": "Sequence Diagrams (71), Use Cases and Scenarios (76), Process Modelling (64), Data Modelling (44), Decision Modelling (46)",
        "resources": "BABOK v3 Ch10 — Technique 10.44"
    },
    74: {
        "overview": "Collecting structured input from many stakeholders through standardized questions. Surveys and questionnaires are the most efficient way to gather data from large or geographically distributed groups.",
        "context": "Applied during Elicitation when the stakeholder group is too large for interviews or workshops, or when quantitative data is needed. Best practices: keep surveys focused and short (10-15 minutes max), use a mix of closed-ended (Likert scale, multiple choice) and open-ended questions, pilot test before distribution, and ensure anonymity for sensitive topics. Response rates typically 20-40%.",
        "related": "Interviews (54), Focus Groups (50), Stakeholder List Map or Personas (72), Metrics and KPIs (57)",
        "resources": "BABOK v3 Ch10 — Technique 10.45"
    },
    75: {
        "overview": "Strategic assessment of Strengths (internal positive), Weaknesses (internal negative), Opportunities (external positive), and Threats (external negative). SWOT provides a structured situational analysis for decision making.",
        "context": "Applied during Strategy Analysis (assessing current state and defining change strategy). Best conducted as a facilitated workshop with diverse stakeholders. After identifying all four quadrants, cross-analyse: SO strategies (use strengths to exploit opportunities), WO strategies (overcome weaknesses to pursue opportunities), ST strategies (use strengths to mitigate threats), WT strategies (minimize weaknesses and avoid threats).",
        "related": "Business Capability Analysis (35), Benchmarking and Market Analysis (33), Risk Analysis and Management (67), Business Cases (36), PESTLE",
        "resources": "BABOK v3 Ch10 — Technique 10.46"
    },
    76: {
        "overview": "Describing interactions between actors (users, systems, organizations) and the system to achieve a specific goal. Use cases capture functional requirements as a sequence of interactions with clear outcomes.",
        "context": "Applied during RADD for specifying functional requirements, especially in IT systems and the Information Technology perspective. Structure: Use Case Name → Actor → Preconditions → Main Success Scenario (basic flow) → Alternative Flows (exceptions, extensions) → Postconditions. Use case diagrams show relationships between actors and use cases at a high level. Particularly effective for complex workflows.",
        "related": "User Stories (77), Sequence Diagrams (71), Interface Analysis (53), Scope Modelling (70), Acceptance and Evaluation Criteria (30)",
        "resources": "BABOK v3 Ch10 — Technique 10.47"
    },
    77: {
        "overview": "Short, structured expressions of user need: 'As a [role], I want [goal] so that [benefit].' User stories are placeholders for conversation, not full requirements — they shift the focus from documenting to discussing.",
        "context": "Applied in agile and adaptive contexts as the primary requirements artifact. Each story includes the narrative plus acceptance criteria (Given/When/Then format). Stories should be INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. The BA/Product Owner refines stories in the backlog — splitting large stories, adding detail, and confirming acceptance criteria with the team.",
        "related": "Backlog Management (31), Acceptance and Evaluation Criteria (30), The Agile Perspective (80), Use Cases and Scenarios (76), Prioritization (62)",
        "resources": "BABOK v3 Ch10 — Technique 10.48"
    },
    78: {
        "overview": "Evaluating third-party vendors against defined requirements and criteria. Vendor assessment includes market research, RFP/RFQ, vendor demonstrations, reference checks, and pilot evaluations.",
        "context": "Applied during RADD (Define Design Options) when a buy or outsource solution is being considered. Process: define requirements → identify candidate vendors → issue RFP → evaluate responses → shortlist → conduct demos and reference checks → select vendor. Use weighted scoring criteria aligned with requirements. Include total cost of ownership (licensing, implementation, training, support, maintenance) in financial analysis.",
        "related": "Business Cases (36), Financial Analysis (49), Decision Analysis (45), Risk Analysis and Management (67), Non-Functional Requirements Analysis (59)",
        "resources": "BABOK v3 Ch10 — Technique 10.49"
    },
    79: {
        "overview": "Facilitated group sessions that engage cross-functional stakeholders in eliciting, analysing, or validating requirements. Workshops are the most powerful elicitation technique for complex, multi-stakeholder requirements.",
        "context": "Applied during Elicitation when requirements span multiple stakeholder groups, when decisions need group consensus, or when complex domain issues need collaborative exploration. Best for 8-15 participants. Preparation is critical: define objectives → identify participants → prepare agenda and pre-work materials → set up the room (physical or virtual). The facilitator drives the process neutrally; a separate scribe captures outputs.",
        "related": "Facilitation (22), Brainstorming (34), Collaborative Games (39), Focus Groups (50), Interviews (54), Prioritization (62)",
        "resources": "BABOK v3 Ch10 — Technique 10.50"
    },
}

# The 5 Perspectives 80-84 (source: Ch11)
PERSPECTIVES = {
    80: {
        "overview": "A just-in-time analysis approach — deliver the right detail at the right time, not everything upfront. The BA operates as a continuous team member, refining requirements iteratively through the product backlog.",
        "context": "Applied when the initiative uses an agile delivery methodology (Scrum, Kanban, SAFe). Key practices: user stories as requirements placeholder, continuous backlog refinement, acceptance criteria as definition of done, and close collaboration with the development team. The BA role shifts from phase-gate analyst to embedded team member focused on value delivery.",
        "related": "User Stories (77), Backlog Management (31), Acceptance and Evaluation Criteria (30), Collaborative Games (39), Prioritization (62)",
        "resources": "BABOK v3 Ch11 — The Agile Perspective"
    },
    81: {
        "overview": "Enabling data-driven decision making through information quality, architecture, and analytics. The BA focus shifts from process requirements to data requirements — definitions, quality, lineage, and governance.",
        "context": "Applied when the initiative involves data warehousing, reporting, dashboards, analytics, or business intelligence. The BA must bridge business reporting needs and technical data architecture. Key deliverables include data dictionaries, data quality requirements, KPI definitions, and report specifications. Critical: understanding the difference between operational data (transactions) and analytical data (summaries, trends).",
        "related": "Data Modelling (44), Data Dictionary (41), Metrics and KPIs (57), Balanced Scorecard (32), Data Mining (43), Data Flow Diagrams (42)",
        "resources": "BABOK v3 Ch11 — The Business Intelligence Perspective"
    },
    82: {
        "overview": "Bridging business needs and technical solutions within IT delivery contexts. The BA translates business language into precise system requirements without over-specifying implementation.",
        "context": "Applied when the solution is primarily a technology system. The BA works closely with architects, developers, and testers. Requirements must be technically precise enough for development while remaining understandable to business stakeholders. Use Cases, Sequence Diagrams, and Interface Analysis are dominant techniques. The BA defines 'what' the system must do; architecture/development defines 'how'.",
        "related": "Use Cases and Scenarios (76), Sequence Diagrams (71), Interface Analysis (53), Non-Functional Requirements Analysis (59), Data Modelling (44)",
        "resources": "BABOK v3 Ch11 — The Information Technology Perspective"
    },
    83: {
        "overview": "Aligning change initiatives with enterprise capabilities, strategy, and operating model. The BA works at the enterprise level, analysing capability gaps, value streams, and strategic alignment.",
        "context": "Applied when the initiative spans multiple business units, when operating model changes are needed, or when aligning projects with enterprise strategy. Key artifacts: business capability maps, value stream maps, organizational models, and capability gap assessments. BA ensures initiative scope aligns with the target operating model and capability roadmap.",
        "related": "Business Capability Analysis (35), Business Model Canvas (37), Organizational Modelling (61), SWOT Analysis (75), Scope Modelling (70)",
        "resources": "BABOK v3 Ch11 — The Business Architecture Perspective"
    },
    84: {
        "overview": "Analyzing, modelling, optimizing, and managing business processes as a core deliverable. The BA focuses on process discovery, analysis, redesign, and governance using BPMN (Business Process Model and Notation).",
        "context": "Applied in initiatives centred on process improvement, automation, or transformation. Key deliverables: AS-IS process models (current state), TO-BE process models (future state), process performance metrics, and process governance frameworks. BPMN is the standard notation. Observation and process walkthroughs are primary elicitation techniques.",
        "related": "Process Modelling (64), Process Analysis (63), Root Cause Analysis (69), Data Flow Diagrams (42), Functional Decomposition (51), Observation (60)",
        "resources": "BABOK v3 Ch11 — The Business Process Management Perspective"
    },
}

ALL = {**COMPETENCIES, **TECHNIQUES, **PERSPECTIVES}


def enrich_file(num):
    data = ALL.get(num)
    if not data:
        print(f"  skipping {num} — no enrichment data")
        return False

    # Find the stub file: glob for `{num:03d}_*.md`
    candidates = list(SKILLS_DIR.glob(f"{num:03d}_*.md"))
    if not candidates:
        print(f"  file not found for skill {num}")
        return False
    path = candidates[0]

    content = path.read_text()

    # Build the enriched content by replacing sections
    # Replace the placeholder lines with actual content
    overview = data["overview"]
    context = data["context"]
    related = data["related"]
    resources = data["resources"]

    # Use the front-matter title
    import re
    m = re.search(r'^title:\s*"(.+)"', content, re.MULTILINE)
    title = m.group(1) if m else f"Skill {num}"

    new_content = textwrap.dedent(f"""\
    ---
    id: skill-{num:04d}
    title: "{title}"
    source: "BABOK Guide v3"
    number: {num}
    category: "{get_cat(num)}"
    tags: []
    ---
    # {title}

    ## Overview

    {overview}

    ## Context & Usage

    {context}

    ## Related Techniques / Tools

    * {related}

    ## Resources

    * {resources}
    """)

    path.write_text(new_content)
    return True


def get_cat(num):
    if 1 <= num <= 29:
        return "Underlying Competencies"
    elif 30 <= num <= 79:
        return "The 50 Named Techniques"
    elif 80 <= num <= 84:
        return "The 5 Perspectives"
    return ""


def main():
    enriched = 0
    skipped = 0
    for num in sorted(ALL.keys()):
        if enrich_file(num):
            enriched += 1
        else:
            skipped += 1
    print(f"\nEnriched: {enriched}, Skipped: {skipped}")


if __name__ == "__main__":
    main()
