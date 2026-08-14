---
id: skill-0346
title: "Technical validation of data quality"
source: "Introduction to Business Data Analytics"
number: 346
category: ""
tags: ["data-analytics", "business-analysis", "analytics", "solution-design"]
---
# Technical validation of data quality

## Overview

Verifying data quality through automated, rule-based checks rather than human judgment — the mechanical counterpart to business validation. It applies tests for the quality dimensions: type and format conformance, range and boundary constraints, null and completeness rates, referential integrity across keys, duplicate detection, checksum and record-count reconciliation between source and target, and re-runnable validation scripts that flag violations. These checks are repeatable and can be embedded in the data pipeline so that quality is monitored continuously, not just inspected once.

## Context & Usage

A Source Data activity, executed after profiling and mapping and often automated into the load process, paired with business validation before analysis begins (identify → source → analyze → interpret & report → use). Concrete example: for the churn dataset, validation scripts assert every customer_id in orders exists in the customer table (referential integrity), reject order_value outside plausible bounds, confirm the loaded row count matches the source extract, and quarantine duplicate order records — producing a pass/fail report that gates whether the data proceeds to modeling.

## Related Techniques / Tools

* Source Data (328), Data quality dimensions (344), Data profiling (340), Data mapping source-to-target (343), Business validation of data sources (345), Data lineage assessment (342); BABOK: Data Modelling (44), Non-Functional Requirements Analysis (58), Business Rules Analysis (30)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (technical validation)
