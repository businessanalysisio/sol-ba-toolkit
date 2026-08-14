---
id: skill-0342
title: "Data lineage assessment"
source: "Introduction to Business Data Analytics"
number: 342
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data lineage assessment

## Overview

Tracing where each data element originates, how it moves, and every transformation it undergoes from system of record to the point of analysis. A lineage assessment documents the source system, the extraction and load steps, the joins, derivations, and business rules applied along the way, and the owner at each stage. It answers "can I trust this number, and where did it come from?" — essential for debugging discrepancies, satisfying audit and regulatory scrutiny, and judging whether a field still means what the analyst assumes after passing through several transformations.

## Context & Usage

A Source Data activity that underpins trust and reproducibility, informing both quality validation and later reporting (identify → source → analyze → interpret & report → use). Concrete example: the churn study's "monthly active customer" metric looks off; lineage tracing shows it is derived two hops upstream from a session table that changed its bot-filtering rule three months ago, explaining a step-change in the trend that had nothing to do with customer behavior — a conclusion impossible to reach without documented lineage.

## Related Techniques / Tools

* Source Data (328), Data mapping source-to-target (343), Technical validation of data quality (346), Data integrity/validity/reliability/bias assessment (350); BABOK: Data Dictionary (41), Data Modelling (44), Business Rules Analysis (30)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (data lineage)
