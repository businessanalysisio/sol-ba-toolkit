---
id: skill-0166
title: "Business use case modelling / diagrams / descriptions"
source: "Business Analysis Techniques"
number: 166
category: "99 Essential Tools"
tags: ["ba-techniques", "business-analysis", "99-essential-tools", "modeling"]
---
# Business use case modelling / diagrams / descriptions

## Overview

Models the services a business or system offers as use cases — named goals an actor achieves through interaction. The diagram is UML: stick-figure actors (roles or external systems) outside a rectangular boundary box, ellipses for use cases inside it, association lines joining actor to goal, with «include» for mandatory shared sub-flows and «extend» for optional variant behaviour. The diagram only names the goals; the substance lives in each use case description: actor, preconditions, postconditions, the main success scenario as a numbered actor-step/system-response dialogue, plus alternative flows (legitimate variations) and exception flows (things going wrong). Business use cases take the whole organisation as the boundary and customers or partners as actors; system use cases draw the boundary around the IT system, with workers becoming its actors.

## Context & Usage

Deployed to scope a solution (the diagram is a contents page of everything it must do for whom) and then to specify behaviour in a form business readers can validate step by step — walking a stakeholder down the main scenario flushes out missing rules and exceptions faster than abstract discussion. Descriptions map naturally onward: scenarios become test scripts, steps become interface requirements, and each use case slices into user stories for agile delivery. The classic modelling error is functional decomposition in disguise — ellipses like "validate postcode" that no actor would ever name as a goal.

## Related Techniques / Tools

* Scenarios (154), User stories (156), Activity diagrams (131), Business event analysis (130), Task analysis (134), Class modelling (167); BABOK: Use Cases and Scenarios (76), Scope Modelling (70), Sequence Diagrams (71); Documenting functional requirements — use cases, user stories, storyboards (206)

## Resources

* Business Analysis Techniques (Cadle, Paul & Turner) — requirements documentation and modelling
