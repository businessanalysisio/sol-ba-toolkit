---
id: skill-0337
title: "Data-collection planning"
source: "Introduction to Business Data Analytics"
number: 337
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data-collection planning

## Overview

Deciding, before extraction begins, exactly what data will be gathered, from where, how often, in what format, and under what constraints. A collection plan enumerates the fields each research question needs, maps them to candidate sources, specifies granularity and time span, sets refresh cadence, and flags access, privacy, and consent requirements. It is the bridge between knowing which sources exist and actually pulling data: a deliberate plan prevents the common failure of collecting whatever is easy and discovering mid-analysis that a needed field was never captured.

## Context & Usage

An early Source Data activity, following source identification and preceding profiling and acquisition (identify → source → analyze → interpret & report → use). Concrete example: to answer the premium-churn questions, the plan specifies pulling 24 months of order history, customer segmentation, delivery timestamps, and support-ticket counts at the customer-month grain, refreshed monthly, with personally identifying fields pseudonymized before analysis — settling scope and compliance up front rather than improvising later.

## Related Techniques / Tools

* Source Data (328), Data-source evaluation — cost/value/timing/risk/feasibility (338), Data sampling (341), Data mapping source-to-target (343), Assessing the Five Vs (339); BABOK: Data Dictionary (41), Data Mining (43), Data Modelling (44)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (data-collection planning)
