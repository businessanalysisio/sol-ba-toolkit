---
id: skill-0343
title: "Data mapping (source-to-target)"
source: "Introduction to Business Data Analytics"
number: 343
category: ""
tags: ["data-analytics", "business-analysis", "analytics", "modeling"]
---
# Data mapping (source-to-target)

## Overview

Specifying, field by field, how data in source systems corresponds to fields in the target structure used for analysis, including the transformation applied to each. A source-to-target map is a table listing every target field alongside its source field(s), data type conversions, formatting rules, default values, and the logic for derived or calculated columns. It is the blueprint the ETL/integration work follows, and it makes the transformation logic reviewable — a stakeholder or auditor can read exactly how "raw order status codes" became the "churned/active" flag the model consumes.

## Context & Usage

A Source Data activity performed during integration, sitting between collection planning and the actual load, and closely tied to lineage (identify → source → analyze → interpret & report → use). Concrete example: for the churn study the map states that target field customer_status derives from source order_status where no order in 90 days maps to "churned", that delivery_delay_days = delivered_date − promised_date, and that region codes are standardized from three legacy schemes into one — documenting every rule so the transformed dataset is trustworthy and repeatable.

## Related Techniques / Tools

* Source Data (328), Data-collection planning (337), Data lineage assessment (342), Data preparation — joins/normalization/cleansing/weighting (348), Technical validation of data quality (346); BABOK: Data Modelling (44), Data Dictionary (41), Business Rules Analysis (30)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (source-to-target mapping)
