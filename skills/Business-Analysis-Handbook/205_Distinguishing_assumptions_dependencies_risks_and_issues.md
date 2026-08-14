---
id: skill-0205
title: "Distinguishing assumptions, dependencies, risks, and issues"
source: "The Business Analysis Handbook"
number: 205
category: "Core BA Skills"
tags: ["ba-handbook", "business-analysis", "core-ba-skills", "risk"]
---
# Distinguishing assumptions, dependencies, risks, and issues

## Overview

The four RAID categories are routinely muddled, and each miscategorisation has a cost because each category demands a different response. An assumption is something taken as true without proof ("the vendor API supports bulk export") — its action is validation, and any assumption that cannot be validated should be converted into a risk. A dependency is a reliance on something outside the project's control ("the data-warehouse upgrade must complete first") — its action is coordination and monitoring of the thing depended on. A risk is a potential future event, scored by probability and impact, with a mitigation or contingency plan and an owner. An issue is a risk that has landed — a live problem needing resolution now, not probability estimates. Maintain them in a RAID log with owners, dates, and review cadence; a log that is written once and never revisited is a compliance ornament, not a management tool.

## Context & Usage

RAID capture runs alongside all analysis work — assumptions in particular breed silently inside requirements ("the system shall interface with X" assumes X has an interface). The distinctions bite in practice: an assumption logged as a risk gets probability-managed instead of simply checked; a dependency logged as an issue gets escalated before anything has gone wrong; and an unvalidated assumption that reaches build is the classic origin story of integration-phase disasters. In the BRD, each category gets its own labelled section (see 204) so reviewers can challenge them separately.

## Related Techniques / Tools

* Problem solving (187), Requirements change management (215), Structuring a BRD (204); BA Techniques: Risk analysis (146), Impact analysis (145); BABOK: Risk Analysis and Management (67), Item Tracking (55)

## Resources

* The Business Analysis Handbook (Helen Winter) — Requirements: assumptions, dependencies, risks, and issues

