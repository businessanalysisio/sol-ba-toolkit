---
id: skill-0340
title: "Data profiling"
source: "Introduction to Business Data Analytics"
number: 340
category: ""
tags: ["data-analytics", "business-analysis", "analytics"]
---
# Data profiling

## Overview

Systematically examining a dataset's actual contents and structure to learn what is really there before trusting it. Profiling computes column-level statistics — data types, value ranges, min/max, means, null counts, distinct-value counts, frequency distributions, and pattern conformance (e.g. does every email match an email format) — and checks structural facts like key uniqueness and referential relationships between tables. It surfaces the surprises that documentation hides: unexpected nulls, out-of-range values, duplicate keys, and format drift that would otherwise corrupt analysis silently.

## Context & Usage

An early Source Data activity, run right after acquiring or accessing data and feeding both sampling and quality validation (identify → source → analyze → interpret & report → use). Concrete example: profiling the order-history table for the churn study reveals that 4% of rows have a null customer_id, order_value has negative entries (refunds coded as orders), and the delivery_date column is populated for only 70% of records — findings that reshape the cleansing plan before any churn model is built.

## Related Techniques / Tools

* Source Data (328), Data quality dimensions (344), Data sampling (341), Technical validation of data quality (346), Exploratory data analysis (349); BABOK: Data Dictionary (41), Data Modelling (44), Data Mining (43)

## Resources

* IIBA Introduction to Business Data Analytics — Source Data (data profiling)
