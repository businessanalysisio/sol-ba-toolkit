#!/usr/bin/env python3
"""Replace generated skill placeholders with useful source-aware notes.

This intentionally updates only files that still contain the original stub
markers from scripts/build_skills.py. Existing hand-enriched files are left
alone.
"""

from __future__ import annotations

import pathlib
import re


BASE = pathlib.Path(__file__).resolve().parent.parent
SKILLS_DIR = BASE / "skills"

PLACEHOLDER_RE = re.compile(
    r"Add brief description here|When and why this skill is applied|add section / page reference"
)


def sentence_subject(title: str) -> str:
    text = title.strip()
    text = re.sub(r"\s*\([^)]*\)", "", text).strip()
    text = text.replace("_", " ")
    return text[:1].lower() + text[1:] if text else "this skill"


def focus_area(title: str) -> str:
    lower = title.lower()
    if any(k in lower for k in ["requirement", "user stor", "acceptance", "backlog"]):
        return "requirements and product definition"
    if any(k in lower for k in ["stakeholder", "communication", "facilitation", "workshop", "interview"]):
        return "stakeholder collaboration and elicitation"
    if any(k in lower for k in ["process", "workflow", "value stream", "activity", "journey"]):
        return "process analysis and operational improvement"
    if any(k in lower for k in ["data", "analytics", "metric", "kpi", "measurement"]):
        return "analytics, evidence, and decision support"
    if any(k in lower for k in ["risk", "issue", "conflict", "change"]):
        return "risk, change, and governance"
    if any(k in lower for k in ["strategy", "market", "customer", "brand", "sales", "growth"]):
        return "strategy, market fit, and growth"
    if any(k in lower for k in ["finance", "cost", "budget", "pricing", "cash", "funding"]):
        return "commercial and financial analysis"
    if any(k in lower for k in ["team", "leadership", "management", "culture", "talent"]):
        return "team effectiveness and organizational capability"
    return "business analysis and decision making"


def related_terms(source: str, title: str) -> list[str]:
    lower = title.lower()
    terms: list[str] = []

    keyword_terms = [
        (["requirement", "user stor", "acceptance"], ["Backlog Management", "Requirements Traceability", "Acceptance Criteria"]),
        (["stakeholder", "communication"], ["Stakeholder Map", "Power/Interest Grid", "Communication Plan"]),
        (["facilitation", "workshop", "interview"], ["Workshops", "Interviews", "Active Listening"]),
        (["process", "workflow"], ["Process Modelling", "Value Stream Mapping", "Gap Analysis"]),
        (["data", "analytics"], ["Research Questions", "Data Quality", "Metrics and KPIs"]),
        (["risk", "issue"], ["Risk Analysis", "Impact Analysis", "Decision Analysis"]),
        (["strategy", "market"], ["SWOT Analysis", "PESTLE Analysis", "Business Model Canvas"]),
        (["customer", "persona", "journey"], ["Personas", "Customer Journey Map", "Value Proposition Canvas"]),
        (["finance", "cost", "pricing", "budget"], ["Business Case", "Cost-Benefit Analysis", "Financial Analysis"]),
        (["product", "mvp", "roadmap"], ["Product Roadmap", "MVP", "Kano Analysis"]),
        (["team", "leadership", "management"], ["RACI", "Governance Model", "Lessons Learned"]),
    ]
    for keys, values in keyword_terms:
        if any(key in lower for key in keys):
            terms.extend(values)

    source_defaults = {
        "The Business Analysis Handbook": ["Business Case", "Requirements Documentation", "Stakeholder Management"],
        "PMI": ["Needs Assessment", "Traceability", "Solution Evaluation"],
        "Seven Steps to Mastering Business Analysis": ["Elicitation Planning", "Stakeholder Analysis", "Requirements Analysis"],
        "Guide to Product Ownership Analysis": ["Backlog Refinement", "Value Modelling", "Story Mapping"],
        "Introduction to Business Data Analytics": ["Analytics Approach Planning", "Source Data", "Analytical Storytelling"],
        "The Personal MBA": ["Value Creation", "Marketing", "Systems Thinking"],
        "How to Start Your Own Business": ["Business Model", "Marketing Mix", "Cash Flow Planning"],
        "Business Analysis Techniques": ["Business Analysis Techniques", "BABOK v3", "Decision Analysis"],
    }
    terms.extend(source_defaults.get(source, ["BABOK v3", "Business Analysis Planning", "Solution Evaluation"]))

    unique: list[str] = []
    for term in terms:
        if term.lower() != title.lower() and term not in unique:
            unique.append(term)
    return unique[:6]


def resource_for(source: str, category: str) -> str:
    if category:
        return f"{source} - {category}"
    return source


def overview_for(source: str, title: str, category: str) -> str:
    subject = sentence_subject(title)
    area = focus_area(title)

    if source == "The Personal MBA":
        return (
            f"{title} is a business mental model for understanding {area}. "
            f"It gives operators a compact lens for diagnosing a situation, naming the forces at work, "
            f"and choosing a practical next action without overcomplicating the analysis."
        )
    if source == "How to Start Your Own Business":
        return (
            f"{title} covers a core founder activity in {area}. It helps turn an early business idea into "
            f"clear operating choices, visible trade-offs, and actions that can be tested with customers, "
            f"partners, regulators, or the market."
        )
    if source == "Introduction to Business Data Analytics":
        return (
            f"{title} is an analytics skill for converting business questions into evidence-led decisions. "
            f"It clarifies what needs to be known, what data or analysis is appropriate, and how findings "
            f"should influence business action."
        )
    if source == "Guide to Product Ownership Analysis":
        return (
            f"{title} is a product ownership analysis technique for improving value delivery. It helps teams "
            f"connect customer needs, product decisions, backlog items, and delivery outcomes."
        )
    if source == "PMI":
        return (
            f"{title} describes a practitioner capability used to support project and product outcomes. "
            f"It helps the BA align stakeholders, requirements, delivery constraints, and value measures."
        )
    if source == "Seven Steps to Mastering Business Analysis":
        return (
            f"{title} is a practical BA capability for progressing from unclear business need to agreed "
            f"requirements and delivery-ready understanding."
        )
    if source == "The Business Analysis Handbook":
        return (
            f"{title} is a business analysis practice for handling {area}. It helps the BA move from "
            f"ambiguous stakeholder input to structured analysis, documented decisions, and actionable outputs."
        )
    return (
        f"{title} is a business analysis technique for {area}. It provides a structured way to examine the "
        f"situation, compare options, and produce an artifact that stakeholders can review."
    )


def context_for(source: str, title: str) -> str:
    subject = sentence_subject(title)
    area = focus_area(title)

    if source == "The Personal MBA":
        return (
            f"Use this model when a business conversation needs clearer thinking about {area}. Start by naming "
            f"the current situation, identify which assumptions or constraints are driving outcomes, then use "
            f"the model to choose one experiment, policy, metric, or decision to test next."
        )
    if source == "How to Start Your Own Business":
        return (
            f"Apply this during venture discovery, launch planning, or operating review. Capture the decision "
            f"to be made, the evidence available, the risks of acting too early or too late, and the next "
            f"customer-facing or operational step."
        )
    if source == "Introduction to Business Data Analytics":
        return (
            f"Apply this before analysis begins and again when interpreting results. Define the business "
            f"decision, expected evidence, data limitations, analysis method, and stakeholder action so the "
            f"analytics work does not become detached from the original need."
        )
    if source == "Guide to Product Ownership Analysis":
        return (
            f"Use this in discovery, backlog refinement, roadmap planning, or sprint preparation. Connect "
            f"the technique to customer value, prioritization, acceptance criteria, and measurable outcomes."
        )
    if source == "PMI":
        return (
            f"Use this capability across initiation, planning, execution, and evaluation when {subject} affects "
            f"scope, stakeholder alignment, quality, or benefit realization."
        )
    if source == "Seven Steps to Mastering Business Analysis":
        return (
            f"Apply this when entering a new initiative, preparing elicitation, analyzing findings, or driving "
            f"agreement. The expected output should be specific enough to support stakeholder review and next-step planning."
        )
    if source == "The Business Analysis Handbook":
        return (
            f"Use this when {subject} is creating uncertainty, disagreement, or missing detail. The BA should "
            f"clarify purpose, collect evidence, involve the right stakeholders, and convert the result into a "
            f"documented artifact or decision."
        )
    return (
        f"Use this technique during {area} work when a team needs a shared view of facts, options, impacts, "
        f"or decisions. Define scope first, facilitate input from relevant stakeholders, and record outcomes "
        f"with owners and follow-up actions."
    )


def rewrite_body(meta: dict[str, str]) -> str:
    title = meta["title"]
    source = meta["source"]
    category = meta.get("category", "")
    related = related_terms(source, title)
    resource = resource_for(source, category)

    return "\n".join(
        [
            f"# {title}",
            "",
            "## Overview",
            "",
            overview_for(source, title, category),
            "",
            "## Context & Usage",
            "",
            context_for(source, title),
            "",
            "## Related Techniques / Tools",
            "",
            "* " + ", ".join(related),
            "",
            "## Resources",
            "",
            f"* {resource}",
            "",
        ]
    )


def parse_meta(front_matter: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    for line in front_matter.splitlines():
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        value = raw_value.strip().strip('"')
        meta[key.strip()] = value
    return meta


def enrich_file(path: pathlib.Path) -> bool:
    text = path.read_text()
    if not PLACEHOLDER_RE.search(text):
        return False

    match = re.match(r"^---\n(?P<meta>.*?)\n---\n(?P<body>.*)$", text, re.DOTALL)
    if not match:
        return False

    meta = parse_meta(match.group("meta"))
    if not {"title", "source"}.issubset(meta):
        return False

    path.write_text(f"---\n{match.group('meta')}\n---\n{rewrite_body(meta)}")
    return True


def main() -> None:
    changed = 0
    for path in sorted(SKILLS_DIR.glob("*/*.md")):
        if enrich_file(path):
            changed += 1
    print(f"Enriched {changed} placeholder skill files.")


if __name__ == "__main__":
    main()
