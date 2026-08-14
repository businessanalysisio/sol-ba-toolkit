---
id: skill-0328
title: "Source Data"
source: "Introduction to Business Data Analytics"
number: 328
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Source Data

## Overview

The second domain of the business data analytics lifecycle: locating, evaluating, and acquiring the data needed to answer the research questions defined upstream. It covers identifying candidate internal sources (transactional systems, CRM, ERP, data warehouses, logs) and external ones (open data, purchased datasets, partner feeds, surveys); assessing each source for relevance, quality, accessibility, cost, timeliness, and risk; planning collection and sampling; and performing the acquisition step — extract, transform, load — that stages raw data for analysis. Sourcing decisions bound everything downstream: a question can only be answered as well as the data that feeds it allows.

## Context & Usage

Sits second in the cycle (identify research questions → source data → analyze → interpret & report → use results), immediately after questions are framed and before any analysis runs. Concrete example: a research question asks which customer segments cut repeat purchases over two quarters. Sourcing means confirming the order-history table covers both quarters, that customer IDs join cleanly to the segmentation table, that returns and cancellations are distinguishable from purchases, and deciding whether to sample or pull the full population — all before a single aggregate is computed.

## Related Techniques / Tools

* Data-collection planning (337), Data-source evaluation — cost/value/timing/risk/feasibility (338), Assessing the Five Vs (339), Data profiling (340), Data sampling (341), Data mapping source-to-target (343), Business validation of data sources (345); BABOK: Data Mining (43), Data Dictionary (41), Data Modelling (44)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (domain overview)
