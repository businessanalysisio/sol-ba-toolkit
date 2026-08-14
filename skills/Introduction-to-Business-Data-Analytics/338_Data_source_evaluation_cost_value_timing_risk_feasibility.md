---
id: skill-0338
title: "Data-source evaluation (cost, value, timing, risk, feasibility)"
source: "Introduction to Business Data Analytics"
number: 338
category: ""
tags: ["data-analytics", "business-analysis", "analytics", "risk", "finance"]
---
# Data-source evaluation (cost, value, timing, risk, feasibility)

## Overview

Comparing candidate data sources against explicit criteria so the initiative invests in the data most worth having. The five standard lenses are cost (acquisition, licensing, storage, preparation effort), value (how directly the source answers the question and its expected lift), timing (whether it is available in the window the decision needs and how fresh it stays), risk (privacy, licensing, security, and reliability exposure), and feasibility (whether the team can technically access, join, and use it). Weighing these together avoids both over-paying for marginal external data and relying on a free source that is too stale or incomplete to trust.

## Context & Usage

A Source Data activity applied when more than one source could feed a question and a trade-off must be made (identify → source → analyze → interpret & report → use). Concrete example: for premium churn the team weighs an internal delivery-events table (free, high value, low risk, but only 12 months retained) against a purchased demographic-append dataset (costly, moderate value, licensing risk) — evaluation shows the internal source covers the core question and the purchased data is deferred as optional enrichment.

## Related Techniques / Tools

* Source Data (328), Data-collection planning (337), Business validation of data sources (345), Assessing the Five Vs (339); BABOK: Risk Analysis and Management (75), Decision Analysis (40), Business Cases (36), Estimation (49)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (evaluating data sources)
