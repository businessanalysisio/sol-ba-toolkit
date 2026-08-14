---
id: skill-0242
title: "Business intelligence analyst"
source: "PMI"
number: 242
category: "Business Analysis for Practitioners: A Practice Guide"
tags: ["pmi", "business-analysis", "business-analysis-for-practitioners-a-practice-guide"]
---
# Business intelligence analyst

## Overview

The role that performs business analysis on the organization's decision-support layer. Its BA work centres on reporting requirements ("who needs to see what, at which grain, refreshed how often, to make which decision?"), KPI definitions precise enough to compute — pinning down whether "active customer" means purchased in 90 days or logged in once, because dashboards fail on exactly these ambiguities — and data warehouse source-to-target mapping, the field-by-field specification of where each reported number originates, how it is transformed, and what business rule governs nulls and duplicates. The role also owns data-quality requirements as first-class requirements: a report is only as trustworthy as the profiling and cleansing rules behind it, and stakeholders discover trust problems faster than accuracy problems.

## Context & Usage

PMI includes the BI analyst among roles performing business analysis. Requirements Elicitation & Analysis dominates the workload, with a twist — elicitation must dig beneath the requested report to the decision it serves, since users routinely ask for a copy of the spreadsheet they already have. Traceability here runs from business question to KPI to source field, a lineage chain auditors and regulators increasingly demand. The role is also infrastructure for everyone else's Solution Evaluation: the measures PMI expects projects to evaluate benefits against are usually built and validated by BI analysts.

## Related Techniques / Tools

* This library: Data / functional / operational / systems / UX analyst (245), Technical awareness (238), Analytical skills (219); BABOK: The Business Intelligence Perspective (81), Metrics and Key Performance Indicators (57), Data Modelling (44), Data Mining (43); BA Techniques: Key performance indicators (101), Logical data modelling (169), CRUD matrix (171)

## Resources

* PMI Business Analysis for Practitioners — Section 1 Introduction (roles that perform business analysis); Section 6 Solution Evaluation (defining and obtaining measurements)
